import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const htmlPath = join(process.cwd(), "public/landing/index.html");
    let html = readFileSync(htmlPath, "utf-8");

    html = html.replace('href="/styles.css"', 'href="/landing/styles.css"');
    html = html.replace('src="/app.js"', 'src="/landing/app.js"');

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Landing page not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
