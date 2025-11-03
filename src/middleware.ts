import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Uncomment ini dit buat testing
// const PROTECTED=["/user/dashboard"];
const PROTECTED = [
  "/user/pengajuan",
   "/user/akun",
  "/user/detail-pengajuan",
  "/user/dashboard",
];
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname =
    url.pathname.endsWith("/") && url.pathname !== "/"
      ? url.pathname.slice(0, -1)
      : url.pathname;

  if (!PROTECTED.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = "/login";
    const next = url.pathname + (url.search || "");
    redirectUrl.searchParams.set("next", next);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/pengajuan", "/user/detail-pengajuan"],
};
