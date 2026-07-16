import puppeteer, { type Browser, type HTTPRequest } from "puppeteer";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";

const REQUEST_TIMEOUT_MS = 12_000;
const NAVIGATION_TIMEOUT_MS = 15_000;
const ALLOWED_HOSTS = (process.env.SCRAPE_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
const RESOURCE_BLOCKLIST = [
  "doubleclick.net",
  "google-analytics.com",
  "googletagmanager.com",
  "facebook.net/tr",
  "hotjar.com",
];

type ScrapePayload = {
  render?: boolean;
  selector?: string;
  url?: string;
};

type ScrapeResponse = {
  ok: boolean;
  rendered: boolean;
  text: string | null;
  timings: Record<string, number>;
  title: string;
  url: string;
};

let browserPromise: Promise<Browser> | null = null;

const now = () => Date.now();

const isPrivateIpv4 = (value: string) => {
  const octets = value.split(".").map((octet) => Number(octet));
  if (octets.length !== 4 || octets.some((octet) => Number.isNaN(octet))) {
    return true;
  }

  const [first, second] = octets;
  return (
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
};

const isPrivateIpv6 = (value: string) => {
  const normalized = value.toLowerCase();
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:") ||
    normalized.startsWith("::ffff:127.")
  );
};

const isPrivateAddress = (value: string) => {
  const version = isIP(value);
  if (version === 4) return isPrivateIpv4(value);
  if (version === 6) return isPrivateIpv6(value);
  return true;
};

const assertPublicHostname = async (hostname: string) => {
  if (hostname === "localhost" || hostname.endsWith(".local")) {
    throw new Error("Private hosts are not allowed.");
  }

  const resolvedAddresses = await lookup(hostname, { all: true, verbatim: true });
  if (resolvedAddresses.length === 0) {
    throw new Error("Could not resolve target host.");
  }

  const hasPrivateAddress = resolvedAddresses.some((entry) => isPrivateAddress(entry.address));
  if (hasPrivateAddress) {
    throw new Error("Private network targets are not allowed.");
  }
};

const normalizeTargetUrl = async (value: string) => {
  if (ALLOWED_HOSTS.length === 0) {
    throw new Error("SCRAPE_ALLOWED_HOSTS is not configured.");
  }

  const parsed = new URL(value);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  const parsedHostname = parsed.hostname.toLowerCase();
  const allowedHostname = ALLOWED_HOSTS.find((hostname) => hostname === parsedHostname);
  if (!allowedHostname) {
    throw new Error("Target host is not allowed.");
  }

  await assertPublicHostname(allowedHostname);

  const safePath = `${parsed.pathname}${parsed.search}`;
  const normalized = new URL(safePath, `${parsed.protocol}//${allowedHostname}`);

  return normalized.toString();
};

const extractTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.trim() ?? "";
};

const shouldBlockRequest = (request: HTTPRequest) => {
  const resourceType = request.resourceType();
  if (["font", "image", "media"].includes(resourceType)) {
    return true;
  }

  const requestUrl = request.url();
  return RESOURCE_BLOCKLIST.some((blockedDomain) => requestUrl.includes(blockedDomain));
};

const getBrowser = async () => {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
        headless: true,
      })
      .catch((error: unknown) => {
        browserPromise = null;
        throw error;
      });
  }

  const browser = await browserPromise;
  if (!browser.connected) {
    browserPromise = null;
    return getBrowser();
  }

  return browser;
};

const createErrorResponse = (error: unknown, status = 500) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  return Response.json({ error: message, ok: false }, { status });
};

export async function POST(request: Request) {
  const timings: Record<string, number> = {};
  const startedAt = now();

  try {
    const payload = (await request.json()) as ScrapePayload;
    if (!payload.url) {
      return Response.json({ error: "url is required", ok: false }, { status: 400 });
    }

    const targetUrl = await normalizeTargetUrl(payload.url);
    const shouldRenderPage = payload.render ?? false;

    if (!shouldRenderPage) {
      const fetchStartedAt = now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(targetUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        const html = await response.text();
        timings.fetch = now() - fetchStartedAt;
        timings.total = now() - startedAt;

        const result: ScrapeResponse = {
          ok: true,
          rendered: false,
          text: null,
          timings,
          title: extractTitle(html),
          url: targetUrl,
        };

        console.info("[api/scrape] completed", result.timings);
        return Response.json(result);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const browserStartedAt = now();
    const browser = await getBrowser();
    timings.browser = now() - browserStartedAt;

    const pageStartedAt = now();
    const page = await browser.newPage();
    timings.newPage = now() - pageStartedAt;

    try {
      page.setDefaultTimeout(REQUEST_TIMEOUT_MS);
      page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);

      await page.setRequestInterception(true);
      page.on("request", (interceptedRequest) => {
        if (shouldBlockRequest(interceptedRequest)) {
          void interceptedRequest.abort();
          return;
        }

        void interceptedRequest.continue();
      });

      const gotoStartedAt = now();
      await page.goto(targetUrl, {
        timeout: NAVIGATION_TIMEOUT_MS,
        waitUntil: "domcontentloaded",
      });
      timings.goto = now() - gotoStartedAt;

      const extractStartedAt = now();
      const title = await page.title();
      const text = payload.selector
        ? await page
            .$eval(payload.selector, (element) => element.textContent?.trim() ?? null)
            .catch(() => null)
        : null;
      timings.extract = now() - extractStartedAt;
      timings.total = now() - startedAt;

      const result: ScrapeResponse = {
        ok: true,
        rendered: true,
        text,
        timings,
        title,
        url: targetUrl,
      };

      console.info("[api/scrape] completed", result.timings);
      return Response.json(result);
    } finally {
      const closeStartedAt = now();
      await page.close();
      timings.close = now() - closeStartedAt;
    }
  } catch (error: unknown) {
    timings.total = now() - startedAt;
    console.error("[api/scrape] failed", timings, error);

    if (error instanceof SyntaxError) {
      return createErrorResponse(new Error("Invalid JSON body"), 400);
    }

    if (error instanceof Error && error.name === "AbortError") {
      return createErrorResponse(new Error("Request timed out"), 504);
    }

    return createErrorResponse(error);
  }
}
