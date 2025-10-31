export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
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
} as const;
