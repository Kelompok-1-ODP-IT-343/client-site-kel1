export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
// Optional default KPR rate ID if backend requires it; set via env NEXT_PUBLIC_DEFAULT_KPR_RATE_ID
export const DEFAULT_KPR_RATE_ID = process.env.NEXT_PUBLIC_DEFAULT_KPR_RATE_ID || "";
export const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",

  PROPERTY_LIST: "/properties",
  PROPERTY_DETAIL: (id: number | string) => `/properties/${id}/details`,

  KPR_APPLICATION: "/kpr-applications",
  KPR_HISTORY: "/kpr-applications/user/history",
  TOGGLE_FAVORITE: "/properties/favorites",
  // TOGGLE_FAVORITE: (propertyId: number | string) => `/favorites/toggle/${propertyId}`,
  FETCH_FAVORITES: "/favorites/user",
  VERIFY_OTP: "/auth/verify-otp",
  UPDATE_PROFILE: (userId: number | string) => `/user/${userId}`,
} as const;
