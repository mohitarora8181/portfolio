import type { MetadataRoute } from "next";

const SITE_URL = "https://mohit8181.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/launch",
    "/youtube",
    "/whatsapp",
    "/spotify",
    "/linkedin",
    "/gmeet",
    "/maps",
  ];

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
