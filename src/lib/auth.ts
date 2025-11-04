import { getCookie } from "../app/lib/cookie";

export function getCurrentUserId(): number | null {
  try {
    const token = getCookie("token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    return Number(payload.sub || payload.id || null);
  } catch (err) {
    console.error("Gagal decode token:", err);
    return null;
  }
}
