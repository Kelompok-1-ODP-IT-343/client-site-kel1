import { API_BASE_URL, API_ENDPOINTS } from "./apiConfig";
import { getCookie, setCookie, deleteCookie } from "./cookie";

type JwtPayload = {
  iat?: number;
  exp?: number;
  sub?: string | number;
  userId?: string | number;
  role?: string;
};

function decodeJwtTtlSeconds(token: string | null): number | null {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload: JwtPayload = JSON.parse(typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("utf-8"));
    if (typeof payload.exp !== "number" || typeof payload.iat !== "number") return null;
    const ttl = Math.max(0, payload.exp - payload.iat);
    return ttl || null;
  } catch {
    return null;
  }
}

let currentRefreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getCookie("refreshToken");
  const tokenType = getCookie("token_type") || "Bearer";

  if (!refreshToken) return false;

  if (currentRefreshPromise) {
    return currentRefreshPromise;
  }

  currentRefreshPromise = (async () => {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokenType} ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const json = await res.json().catch(() => ({}));
      const data = (json && (json.data || json)) as any;

      const newToken: string | undefined = data?.token;
      const newRefreshToken: string | undefined = data?.refreshToken;
      const type: string = data?.type || tokenType || "Bearer";

      if (!res.ok || !newToken) {
        return false;
      }

      const tokenTtl = decodeJwtTtlSeconds(newToken) ?? 3600;
      const refreshTtl = decodeJwtTtlSeconds(newRefreshToken || refreshToken) ?? 86400;

      setCookie("token", newToken, tokenTtl);
      setCookie("token_type", type, tokenTtl);
      if (newRefreshToken) setCookie("refreshToken", newRefreshToken, refreshTtl);

      return true;
    } catch (err) {
      return false;
    } finally {
      currentRefreshPromise = null;
    }
  })();

  return currentRefreshPromise;
}

type FetchWithAuthOptions = RequestInit & {
  includeAuth?: boolean;
  retryOnUnauthorized?: boolean;
};

export async function fetchWithAuth(url: string, options: FetchWithAuthOptions = {}): Promise<Response> {
  const includeAuth = options.includeAuth !== false;
  const retryOnUnauthorized = options.retryOnUnauthorized !== false;

  let token = getCookie("token");
  let tokenType = getCookie("token_type") || "Bearer";

  // If token missing but refreshToken exists, attempt refresh first
  if (includeAuth && !token && getCookie("refreshToken")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = getCookie("token");
      tokenType = getCookie("token_type") || tokenType;
    }
  }

  // Build headers
  const headers = new Headers(options.headers as HeadersInit);
  if (includeAuth && token) {
    headers.set("Authorization", `${tokenType} ${token}`);
  }

  const initialRes = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  // If unauthorized, try refresh once and retry
  if (retryOnUnauthorized && includeAuth && (initialRes.status === 401 || initialRes.status === 403)) {
    const ok = await refreshAccessToken();
    if (ok) {
      const newToken = getCookie("token");
      const newType = getCookie("token_type") || tokenType;
      const retryHeaders = new Headers(options.headers as HeadersInit);
      if (newToken) retryHeaders.set("Authorization", `${newType} ${newToken}`);

      return fetch(url, {
        ...options,
        headers: retryHeaders,
        cache: options.cache ?? "no-store",
      });
    }
  }

  return initialRes;
}

export function clearAuthCookies() {
  deleteCookie("token");
  deleteCookie("token_type");
  deleteCookie("refreshToken");
}