import { API_BASE_URL, API_ENDPOINTS } from "./apiConfig";
export async function registerUser(payload: any) { 
  const url = `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), 
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Registrasi gagal." };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}
export async function loginApi(payload:any){
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), 
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Login gagal." };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}
// ADD THIS FOR ADDING NEW IMPLEMENTATION INTEGRATION
export async function cariRumah(){

}