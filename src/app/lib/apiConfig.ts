export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",

  PROPERTY_LIST: "/auth/cari-rumah",
  PROPERTY_DETAIL: (id: number | string) => `/properties/${id}/details`,
} as const;
