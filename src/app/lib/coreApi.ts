import axios, { AxiosHeaders } from "axios";

// Axios instance untuk seluruh request ke API Satu Atap
const coreApi = axios.create({
  baseURL: "https://satuatap.my.id/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: sisipkan Authorization jika ada token di localStorage
coreApi.interceptors.request.use((config) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";
      if (token) {
        if (config.headers instanceof AxiosHeaders) {
          config.headers.set("Authorization", `${tokenType} ${token}`);
        } else {
          config.headers = new AxiosHeaders(config.headers as any);
          config.headers.set("Authorization", `${tokenType} ${token}`);
        }
      }
    }
  } catch (_) {
    // abaikan jika localStorage tidak tersedia
  }
  return config;
});

// Interceptor response: kembalikan response apa adanya, propagasi error
coreApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Call API: Login (Strapi style payload: identifier & password)
// Returns JWT token and user data. We store token into localStorage as 'access_token'
export async function loginApi(payload: {
  identifier: string;
  password: string;
}) {
  const res = await coreApi.post("/v1/auth/login", payload);
  return res.data;
}

export default coreApi;
