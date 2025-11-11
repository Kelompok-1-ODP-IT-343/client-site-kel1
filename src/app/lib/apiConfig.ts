export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
// Optional default KPR rate ID if backend requires it; set via env NEXT_PUBLIC_DEFAULT_KPR_RATE_ID
export const DEFAULT_KPR_RATE_ID = process.env.NEXT_PUBLIC_DEFAULT_KPR_RATE_ID || "";
export const API_ENDPOINTS = {
  REGISTER: `${API_PREFIX}/auth/register`,
  LOGIN: `${API_PREFIX}/auth/login`,
  REFRESH: `${API_PREFIX}/auth/refresh`,

  PROPERTY_LIST: `${API_PREFIX}/properties`,
  PROPERTY_DETAIL: (id: number | string) => `${API_PREFIX}/properties/${id}/details`,

  KPR_APPLICATION: `${API_PREFIX}/kpr-applications`,
  KPR_HISTORY: `${API_PREFIX}/kpr-applications/user/history`,
  TOGGLE_FAVORITE: `${API_PREFIX}/properties/favorites`,
  // TOGGLE_FAVORITE: (propertyId: number | string) => `/favorites/toggle/${propertyId}`,
  FETCH_FAVORITES: `${API_PREFIX}/favorites/user`,
  VERIFY_OTP: `${API_PREFIX}/auth/verify-otp`,
  UPDATE_PROFILE: (userId: number | string) => `${API_PREFIX}/user/${userId}`,
  KPR_DETAIL: (id: number | string) => `${API_PREFIX}/kpr-applications/${id}`,

} as const;
