export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const isProd =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isProd ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
