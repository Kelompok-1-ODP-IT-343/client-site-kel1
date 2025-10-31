import { API_BASE_URL, API_ENDPOINTS } from "./apiConfig";
import type { PropertyDetail, PropertyListItem } from "./types";
import { getCookie } from "./cookie";
function parseFeaturesList(
  featuresString: string | null
): { key: string; value: string }[] {
  if (!featuresString) return [];
  try {
    return featuresString
      .split(",")
      .map((part) => {
        const pieces = part.split(":");
        if (pieces.length < 2) return null;
        const key = pieces[0].trim();
        const value = pieces.slice(1).join(":").trim();
        return { key, value };
      })
      .filter(Boolean) as { key: string; value: string }[];
  } catch (e) {
    console.error("Gagal mem-parsing string fitur list:", featuresString, e);
    return [];
  }
}
function buildFeaturesArray(
  d: any
): { featureName: string; featureValue: string }[] {
  const features = [];
  if (d.bedrooms) {
    features.push({
      featureName: "Kamar Tidur",
      featureValue: String(d.bedrooms),
    });
  }
  if (d.bathrooms) {
    features.push({
      featureName: "Kamar Mandi",
      featureValue: String(d.bathrooms),
    });
  }
  if (d.buildingArea) {
    features.push({
      featureName: "Luas Bangunan",
      featureValue: `${d.buildingArea} m²`,
    });
  }
  if (d.landArea) {
    features.push({
      featureName: "Luas Tanah",
      featureValue: `${d.landArea} m²`,
    });
  }
  if (d.floors) {
    features.push({
      featureName: "Jumlah Lantai",
      featureValue: String(d.floors),
    });
  }
  if (d.garage) {
    features.push({
      featureName: "Garasi/Carport",
      featureValue: String(d.garage),
    });
  }
  if (d.certificateType) {
    features.push({
      featureName: "Sertifikat",
      featureValue: d.certificateType,
    });
  }
  if (d.yearBuilt) {
    features.push({
      featureName: "Tahun Dibangun",
      featureValue: String(d.yearBuilt),
    });
  }

  return features;
}
export async function registerUser(payload: any) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return {
        success: true,
        message: json.message,
        data: json.data,
        status: res.status,
      };
    }

    return {
      success: false,
      message: json.message || "Registrasi gagal.",
      status: res.status,
    };
  } catch (e) {
    return {
      success: false,
      message: "Terjadi kesalahan koneksi ke server.",
      status: 500,
    };
  }
}

export async function loginApi(payload: any) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      return { success: true, message: json.message, data: json.data };
    }
    return { success: false, message: json.message || "Login gagal." };
  } catch (e) {
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}

export async function submitKprApplication(
  formData: any,
  files: { [key: string]: File | null }
) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.KPR_APPLICATION}`;

  try {
    const multipartData = new FormData();

    // Property and simulation data
    multipartData.append("propertyId", formData.propertyId || "");
    multipartData.append("kprRateId", "27"); // Default value as shown in curl
    multipartData.append(
      "simulationData.propertyValue",
      formData.hargaProperti || ""
    );
    multipartData.append(
      "simulationData.downPayment",
      formData.downPayment?.replace(/[^0-9]/g, "") || ""
    );
    multipartData.append(
      "simulationData.loanAmount",
      String(
        Number(formData.hargaProperti?.replace(/[^0-9]/g, "") || 0) -
          Number(formData.downPayment?.replace(/[^0-9]/g, "") || 0)
      )
    );
    multipartData.append(
      "simulationData.loanTermYears",
      formData.loanTerm || ""
    );

    // Personal data
    multipartData.append("personalData.fullName", formData.fullName || "");
    multipartData.append("personalData.nik", formData.nik || "");
    multipartData.append("personalData.npwp", formData.npwp || "");
    multipartData.append("personalData.birthDate", formData.birthDate || "");
    multipartData.append("personalData.birthPlace", formData.birthPlace || "");
    multipartData.append(
      "personalData.gender",
      formData.gender === "Laki-laki" ? "male" : "female"
    );
    multipartData.append(
      "personalData.maritalStatus",
      formData.maritalStatus?.toLowerCase() || ""
    );
    multipartData.append("personalData.address", formData.address || "");
    multipartData.append("personalData.city", formData.city || "");
    multipartData.append("personalData.province", formData.province || "");
    multipartData.append("personalData.postalCode", formData.postalCode || "");

    // Employment data
    multipartData.append(
      "employmentData.occupation",
      formData.occupation || ""
    );
    multipartData.append(
      "employmentData.monthlyIncome",
      formData.monthlyIncome?.replace(/[^0-9]/g, "") || ""
    );
    multipartData.append(
      "employmentData.companyName",
      formData.companyName || ""
    );
    multipartData.append(
      "employmentData.companyAddress",
      formData.companyAddress || ""
    );
    multipartData.append("employmentData.companyCity", formData.city || "");
    multipartData.append(
      "employmentData.companyProvince",
      formData.province || ""
    );
    multipartData.append(
      "employmentData.companyPostalCode",
      formData.postalCode || ""
    );

    // File uploads
    if (files.fileKTP) {
      multipartData.append("ktpDocument", files.fileKTP);
    }
    if (files.fileSlipGaji) {
      multipartData.append("salarySlipDocument", files.fileSlipGaji);
    }
    if (files.fileNPWP) {
      multipartData.append("npwpDocument", files.fileNPWP);
    }
    if (files.fileOther) {
      multipartData.append("otherDocument", files.fileOther);
    }

    const token = getCookie("token") || "";
    const tokenType = getCookie("token_type") || "Bearer";

    console.log("Debug KPR Submit - Token:", token);
    console.log("Debug KPR Submit - Token Type:", tokenType);
    console.log(
      "Debug KPR Submit - Authorization Header:",
      `${tokenType} ${token}`
    );

    const res = await fetch(url, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        Authorization: token ? `${tokenType} ${token}` : "",
      },
      body: multipartData,
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return {
        success: true,
        message: json.message || "Pengajuan KPR berhasil dikirim",
        data: json.data,
      };
    }
    return { success: false, message: json.message || "Pengajuan KPR gagal." };
  } catch (e) {
    console.error("KPR Application Error:", e);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}

export function buildPropertyListQuery(params: {
  name?: string;
  city?: string;
  provinsi?: string;
  tipeProperti?: string;
  priceMin?: number;
  priceMax?: number;
}) {
  const sp = new URLSearchParams();
  if (params.name) sp.set("name", params.name);
  if (params.city) sp.set("city", params.city);
  if (params.provinsi) sp.set("provinsi", params.provinsi);
  if (params.tipeProperti) sp.set("tipeProperti", params.tipeProperti);
  if (typeof params.priceMin === "number")
    sp.set("priceMin", String(params.priceMin));
  if (typeof params.priceMax === "number")
    sp.set("priceMax", String(params.priceMax));
  return sp.toString();
}

export async function fetchPropertyList(params: {
  name?: string;
  city?: string;
  provinsi?: string;
  tipeProperti?: string;
  priceMin?: number;
  priceMax?: number;
}): Promise<{ items: PropertyListItem[]; raw: any }> {
  const qs = buildPropertyListQuery(params); // Asumsi fungsi ini ada di file ini

  const url = `${API_BASE_URL}${API_ENDPOINTS.PROPERTY_LIST}${
    qs ? `?${qs}` : ""
  }`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();

  if (!res.ok || json?.success !== true) {
    throw new Error(json?.message || "Gagal mengambil daftar properti");
  }

  const data: PropertyListItem[] = Array.isArray(json.data)
    ? json.data.map((d: any) => {
        const dynamicFeatures = parseFeaturesList(d.features);

        return {
          id: d.id,
          title: d.title,
          city: d.city ?? null,
          property_code: d.property_code ?? null,
          property_type: d.property_type ?? null,
          listing_type: d.listing_type ?? null,
          price: Number(d.price ?? 0),
          main_image: d.file_path ?? null,
          nearby_places: d.nearby_places ?? null,
          parsedFeatures: dynamicFeatures,
        };
      })
    : [];

  return { items: data, raw: json };
}
function parseJsonArray<T = any>(input: unknown): T[] {
  if (Array.isArray(input)) return input as T[];
  if (typeof input === "string") {
    try {
      const arr = JSON.parse(input);
      return Array.isArray(arr) ? (arr as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function fetchPropertyDetail(
  id: number | string
): Promise<PropertyDetail> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.PROPERTY_DETAIL(id)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const json = await res.json();

  if (!res.ok || json?.success !== true || !json?.data) {
    throw new Error(json?.message || "Gagal mengambil detail properti");
  }

  const d = json.data;

  const features = buildFeaturesArray(d);
  const locations: { poiName: string; distanceKm: number }[] = [];

  const mainImage = d.filePath ?? null;
  const galleryImages = Array.isArray(d.images) ? d.images : [];
  const allImages = [mainImage, ...galleryImages].filter(Boolean) as string[];
  const result: PropertyDetail = {
    id: d.id,
    title: d.title,
    description: d.description ?? null,
    city: d.city ?? null,
    property_type: d.property_type ?? null,
    listing_type: d.listing_type ?? null,
    property_code: d.property_code ?? null,
    price: Number(d.price ?? 0),
    images: allImages,
    features,
    locations,
    developer: d.developer ?? null,
  };

  return result;
}

export async function fetchKprHistory() {
  const url = `${API_BASE_URL}${API_ENDPOINTS.KPR_HISTORY}`;

  try {
    const token = getCookie("token") || "";
    const tokenType = getCookie("token_type") || "Bearer";

    console.log("Debug - Token:", token);
    console.log("Debug - Token Type:", tokenType);
    console.log("Debug - Authorization Header:", `${tokenType} ${token}`);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${tokenType} ${token}` : "",
      },
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return { success: true, data: json.data || [], message: json.message };
    }
    return {
      success: false,
      data: [],
      message: json.message || "Gagal mengambil riwayat pengajuan KPR.",
    };
  } catch (e) {
    console.error("KPR History Error:", e);
    return {
      success: false,
      data: [],
      message: "Terjadi kesalahan koneksi ke server.",
    };
  }
}

// ==============================
// WISHLIST / FAVORITE PROPERTY
// ==============================

export async function fetchUserFavorites() {
  const url = `${API_BASE_URL}${API_ENDPOINTS.FETCH_FAVORITES}`;
  const token = getCookie("token") || "";
  const tokenType = getCookie("token_type") || "Bearer";

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${tokenType} ${token}` : "",
      },
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return { success: true, data: json.data || [] };
    } else {
      return { success: false, data: [], message: json.message };
    }
  } catch (error) {
    console.error("Fetch Wishlist Error:", error);
    return { success: false, data: [], message: "Gagal memuat wishlist." };
  }
}

// export async function toggleFavorite(propertyId: number | string) {
//   const url = `${API_BASE_URL}${API_ENDPOINTS.TOGGLE_FAVORITE(propertyId)}`;
//   const token = getCookie("token") || "";
//   const tokenType = getCookie("token_type") || "Bearer";

//   try {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `${tokenType} ${token}` : "",
//       },
//     });

//     const json = await res.json();

//     if (res.ok && json.success) {
//       return {
//         success: true,
//         message: json.message || "Toggle favorite success",
//         data: json.data,
//       };
//     } else {
//       return {
//         success: false,
//         message: json.message || "Gagal mengubah status favorit.",
//       };
//     }
//   } catch (error) {
//     console.error("Toggle Favorite Error:", error);
//     return { success: false, message: "Terjadi kesalahan koneksi ke server." };
//   }
// }

export async function verifyOtpApi(payload: {
  identifier: string;
  otp: string;
  purpose: string;
}) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`; // Tambahkan VERIFY_OTP ke ENDPOINTS
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return {
        success: true,
        message: json.message,
        data: json.data,
      };
    } else {
      return {
        success: false,
        message: json.message || "Verifikasi OTP gagal.",
      };
    }
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return { success: false, message: "Terjadi kesalahan koneksi." };
  }
}
export async function toggleFavorite(userId: number | string, propertyId: number | string) {
  // --- PERBAIKAN DI SINI ---
  // Membangun URL dengan query parameters
  const url = `${API_BASE_URL}${API_ENDPOINTS.TOGGLE_FAVORITE}?userId=${userId}&propertyId=${propertyId}`;
  // -------------------------

  const token = getCookie("token") || "";
  const tokenType = getCookie("token_type") || "Bearer";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${tokenType} ${token}` : "",
      },
    });

    const json = await res.json();

    if (res.ok && json.success) {
      return {
        success: true,
        message: json.message || "Toggle favorite success",
        data: json.data,
      };
    } else {
      return {
        success: false,
        message: json.message || "Gagal mengubah status favorit.",
      };
    }
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}