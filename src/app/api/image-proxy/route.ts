import { NextRequest } from "next/server";
import { Agent } from "undici";

// Keep-alive HTTP agent via undici
const agent = new Agent({
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 60_000,
});

const envBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
const allowedHosts = new Set<string>(["is3.cloudhost.id"]);
try {
  if (envBaseUrl) {
    const h = new URL(envBaseUrl).hostname;
    if (h) allowedHosts.add(h);
  }
} catch {}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) return new Response("Missing url", { status: 400 });

    let target: URL;
    try {
      target = new URL(url);
    } catch {
      return new Response("Invalid url", { status: 400 });
    }

    if (!allowedHosts.has(target.hostname)) {
      return new Response("Host not allowed", { status: 403 });
    }

    const upstream = await fetch(target, {
      // dispatcher: agent, // removed – not supported in browser RequestInit
      headers: {
        // Basic UA; some CDNs block unknown agents
        "User-Agent": "BNI-KPR-Client/1.0 (+https://bni.co.id)",
        // Prevent sending cookies/referer
        Referer: "",
      },
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(`Upstream error ${upstream.status}`, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    // Cache in CDN/proxy for a day
    const cacheControl =
      "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400";

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
      },
    });
  } catch (e) {
    return new Response("Proxy error", { status: 500 });
  }
}
