import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/apiConfig";
// Uncomment ini dit buat testing
// const PROTECTED=["/user/dashboard"];
const PROTECTED = [
  "/user/pengajuan",
   "/user/akun",
  "/user/detail-pengajuan",
  "/user/dashboard",
];
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname =
    url.pathname.endsWith("/") && url.pathname !== "/"
      ? url.pathname.slice(0, -1)
      : url.pathname;

  if (!PROTECTED.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (token) {
    return NextResponse.next();
  }

  // Try refresh if refreshToken exists
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (refreshToken) {
    return handleRefresh(req, url, refreshToken);
  }

  const redirectUrl = new URL(url.toString());
  // Jika tidak ada token dan tidak bisa refresh, arahkan ke beranda
  redirectUrl.pathname = "/beranda";
  return NextResponse.redirect(redirectUrl);
}

function ttlFromJwt(token: string | undefined): number | null {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const payload = JSON.parse(atob(base64Url.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp !== "number" || typeof payload.iat !== "number") return null;
    return Math.max(0, payload.exp - payload.iat);
  } catch {
    return null;
  }
}

async function handleRefresh(req: NextRequest, url: URL | any, refreshToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json().catch(() => ({} as any));
    const data = (json && (json.data || json)) as any;

    const newToken: string | undefined = data?.token;
    const newRefreshToken: string | undefined = data?.refreshToken;
    const type: string = data?.type || "Bearer";

    if (res.ok && newToken) {
      const response = NextResponse.next();
      const tokenTtl = ttlFromJwt(newToken) ?? 3600;
      const refreshTtl = ttlFromJwt(newRefreshToken || refreshToken) ?? 86400;

      response.cookies.set("token", newToken, {
        path: "/",
        maxAge: tokenTtl,
        sameSite: "lax",
      });
      response.cookies.set("token_type", type, {
        path: "/",
        maxAge: tokenTtl,
        sameSite: "lax",
      });
      if (newRefreshToken) {
        response.cookies.set("refreshToken", newRefreshToken, {
          path: "/",
          maxAge: refreshTtl,
          sameSite: "lax",
        });
      }
      return response;
    }
  } catch (e) {
    // ignore and fall through to redirect
  }

  const redirectUrl = new URL(url.toString());
  redirectUrl.pathname = "/login";
  const next = url.pathname + (url.search || "");
  redirectUrl.searchParams.set("next", next);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/user/pengajuan", "/user/detail-pengajuan"],
};
