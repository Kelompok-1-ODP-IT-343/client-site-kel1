import { API_BASE_URL, API_ENDPOINTS, DEFAULT_KPR_RATE_ID } from "./apiConfig";
import type { PropertyDetail, PropertyListItem } from "./types";
import { getCookie } from "./cookie";
import { fetchWithAuth } from "./authFetch";

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
    const errDetail =
      json?.errorDetail || json?.data?.errorDetail || json?.error || null;
    const candidates = [
      errDetail?.detail,
      errDetail?.message,
      json?.detail,
      json?.message,
    ].filter(Boolean);
    let detailText = String(candidates[0] || "");
    // Clean prefixes to surface the actionable part
    detailText = detailText.replace(/^system error during login:\s*/i, "");
    detailText = detailText.replace(/^login gagal:\s*/i, "");
    const finalMsg =
      detailText.trim() || String(json?.message || "Login gagal.");
    return {
      success: false,
      message: finalMsg,
      data: json?.data ?? null,
      errorDetail: errDetail,
    };
  } catch (e) {
    return {
      success: false,
      message: "Terjadi kesalahan koneksi ke server.",
      data: null,
      errorDetail: null,
    };
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
    // Append kprRateId if provided by client or a default from env is set
    const kprRateId = formData.kprRateId || DEFAULT_KPR_RATE_ID;
    if (kprRateId) {
      multipartData.append("kprRateId", String(kprRateId));
    }
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
        Math.max(
          0,
          Number(formData.hargaProperti?.replace(/[^0-9]/g, "") || 0) -
            Number(formData.downPayment?.replace(/[^0-9]/g, "") || 0)
        )
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
    multipartData.append("personalData.district", formData.district || "");
    multipartData.append(
      "personalData.subDistrict",
      formData.subdistrict || ""
    );
    multipartData.append("personalData.city", formData.city || "");
    multipartData.append("personalData.province", formData.province || "");
    multipartData.append("personalData.postalCode", formData.postalCode || "");
    // Tambahan: nomor rekening bank (opsional)
    multipartData.append("bankAccountNumber", formData.bankAccountNumber || "");

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
    // New adjustments: use dedicated company location fields
    multipartData.append(
      "employmentData.companyCity",
      formData.companyCity || ""
    );
    multipartData.append(
      "employmentData.companyProvince",
      formData.companyProvince || ""
    );
    multipartData.append(
      "employmentData.companyPostalCode",
      formData.companyPostalCode || ""
    );
    multipartData.append(
      "employmentData.workExperience",
      formData.workExperience || ""
    );
    multipartData.append(
      "employmentData.companyDistrict",
      formData.companyDistrict || ""
    );
    multipartData.append(
      "employmentData.companySubdistrict",
      formData.companySubdistrict || ""
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

    const res = await fetchWithAuth(url, {
      method: "POST",
      // don't set Content-Type for FormData, browser will add boundary
      body: multipartData,
    });

    const json = await res.json();

    const statusText = (json?.status ?? json?.result ?? "")
      .toString()
      .toLowerCase();
    const messageText = (json?.message ?? "").toString();
    const successFlag = Boolean(
      json?.success === true ||
        statusText === "success" ||
        (res.ok && /berhasil|success/i.test(messageText))
    );

    if (successFlag) {
      return {
        success: true,
        message: messageText || "Pengajuan KPR berhasil dikirim",
        data: json.data ?? json.result ?? json,
      };
    }
    return {
      success: false,
      message: messageText || "Pengajuan KPR gagal.",
      data: json.data ?? null,
    };
  } catch (e) {
    console.error("KPR Application Error:", e);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}

export function buildPropertyListQuery(params: {
  title?: string;
  description?: string;
  city?: string;
  provinsi?: string;
  // New API expects `propertyType`, `minPrice`, `maxPrice` (lowercase type values like 'rumah')
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  // Back-compat with older callers
  tipeProperti?: string;
  priceMin?: number;
  priceMax?: number;
}) {
  const sp = new URLSearchParams();
  if (params.title) sp.set("title", params.title);
  if (params.description) sp.set("description", params.description);
  if (params.city) sp.set("city", params.city);
  if (params.provinsi) sp.set("provinsi", params.provinsi);

  // Prefer new keys; fall back to old ones if provided
  const propertyType = (
    params.propertyType ?? params.tipeProperti
  )?.toLowerCase();
  if (propertyType) sp.set("propertyType", propertyType);

  const minPrice = params.minPrice ?? params.priceMin;
  const maxPrice = params.maxPrice ?? params.priceMax;
  if (typeof minPrice === "number") sp.set("minPrice", String(minPrice));
  if (typeof maxPrice === "number") sp.set("maxPrice", String(maxPrice));

  return sp.toString();
}

export async function fetchPropertyList(params: {
  title?: string;
  description?: string;
  city?: string;
  provinsi?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  // Back-compat
  tipeProperti?: string;
  priceMin?: number;
  priceMax?: number;
}): Promise<{ items: PropertyListItem[]; raw: any }> {
  const qs = buildPropertyListQuery(params);

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

        // --- LOGIKA PENENTUAN DEVELOPER ---
        const isDeveloperPilihan = d.listing_type === "PRIMARY";

        return {
          id: d.id,
          title: d.title,
          city: d.city ?? null,
          property_code: d.property_code ?? null,
          property_type: d.property_type ?? null,
          listing_type: d.listing_type ?? null,
          price: Number(d.price ?? 0),
          main_image: d.file_path ?? d.filePath ?? null,
          nearby_places: d.nearby_places ?? null,
          parsedFeatures: dynamicFeatures,
          // Mengisi field baru berdasarkan logika di atas
          is_developer_pilihan: isDeveloperPilihan,
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

// Parse nearby places string: "Name (2.80 km), Place (1.2 km)"
function parseNearbyPlaces(
  input: unknown
): { poiName: string; distanceKm: number }[] {
  if (!input) return [];
  const s = String(input);
  return s
    .split(",")
    .map((part) => part.trim())
    .map((item) => {
      const match = item.match(/^(.+?)\s*\(([0-9.,]+)\s*km\)$/i);
      if (match) {
        const name = match[1].trim();
        const dist = Number(String(match[2]).replace(/,/g, "."));
        return { poiName: name, distanceKm: Number.isFinite(dist) ? dist : 0 };
      }
      return { poiName: item, distanceKm: 0 };
    });
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

  // Normalize developer object with safe fallbacks
  const developer = (() => {
    const src =
      d && d.developer && typeof d.developer === "object" ? d.developer : {};
    const companyName =
      src.companyName ??
      src.name ??
      d.developer_name ??
      d.developerName ??
      null;
    const partnershipLevel =
      src.partnershipLevel ??
      src.level ??
      d.partnership_level ??
      d.developer_level ??
      null;
    const contactPerson =
      src.contactPerson ?? src.contact ?? d.developer_contact ?? null;
    const phone =
      src.phone ?? src.telephone ?? src.telepon ?? d.developer_phone ?? null;
    const email = src.email ?? d.developer_email ?? null;
    const website = src.website ?? d.developer_website ?? null;
    const address = src.address ?? d.developer_address ?? null;
    const city = src.city ?? d.developer_city ?? null;
    const province = src.province ?? d.developer_province ?? null;
    const obj = {
      companyName,
      partnershipLevel,
      contactPerson,
      phone,
      email,
      website,
      address,
      city,
      province,
    };
    const hasAny = Object.values(obj).some(
      (v) => v != null && String(v).trim() !== ""
    );
    return hasAny ? obj : null;
  })();

  // Merge features: prefer API-provided features if available, then add derived ones
  const apiFeatures: Array<{ featureName: string; featureValue: string }> =
    Array.isArray(d.features)
      ? (d.features as any[])
          .map((x) => ({
            featureName: String(
              x?.featureName ?? x?.name ?? x?.key ?? ""
            ).trim(),
            featureValue: String(x?.featureValue ?? x?.value ?? "").trim(),
          }))
          .filter((x) => x.featureName.length > 0)
      : [];
  const derivedFeatures = buildFeaturesArray(d);
  const featureMap = new Map<
    string,
    { featureName: string; featureValue: string }
  >();
  // API features first
  for (const f of apiFeatures) {
    featureMap.set(f.featureName.toLowerCase(), f);
  }
  // Add derived features if not present
  for (const f of derivedFeatures) {
    const key = f.featureName.toLowerCase();
    if (!featureMap.has(key)) featureMap.set(key, f);
  }
  const features = Array.from(featureMap.values());

  // Locations: support either array from API or parse from string
  let locations: { poiName: string; distanceKm: number }[] = [];
  if (Array.isArray(d.locations)) {
    locations = (d.locations as any[])
      .map((l) => ({
        poiName: String(l?.poiName ?? l?.name ?? "").trim(),
        distanceKm: Number(l?.distanceKm ?? l?.distance ?? 0) || 0,
      }))
      .filter((l) => l.poiName.length > 0);
  } else {
    locations = parseNearbyPlaces(d.nearby_places ?? d.nearbyPlaces ?? null);
  }

  const mainImage = d.file_path ?? d.filePath ?? null;
  const galleryImages = Array.isArray(d.images) ? d.images : [];
  const allImages = [mainImage, ...galleryImages].filter(Boolean) as string[];
  const result: PropertyDetail = {
    id: d.id,
    title: d.title,
    description: d.description ?? null,
    city: d.city ?? null,
    address: d.address ?? d.alamat ?? null,
    district: d.district ?? d.kecamatan ?? null,
    subdistrict:
      d.subdistrict ??
      d.subDistrict ??
      d.sub_district ??
      d.village ??
      d.kelurahan ??
      d.desa ??
      null,
    province: d.province ?? d.provinsi ?? null,
    postalCode: d.postalCode ?? d.postal_code ?? d.kodePos ?? null,
    property_type: d.property_type ?? null,
    listing_type: d.listing_type ?? null,
    property_code: d.property_code ?? null,
    latitude:
      typeof d.latitude === "number"
        ? d.latitude
        : d.latitude
        ? Number(d.latitude)
        : null,
    longitude:
      typeof d.longitude === "number"
        ? d.longitude
        : d.longitude
        ? Number(d.longitude)
        : null,
    yearBuilt:
      (typeof d.yearBuilt === "number" ? d.yearBuilt : Number(d.year_built)) ||
      null,
    handoverDate: d.handoverDate ?? d.handover_date ?? null,
    availabilityDate: d.availabilityDate ?? d.availability_date ?? null,
    buildingArea:
      (typeof d.buildingArea === "number"
        ? d.buildingArea
        : Number(d.building_area)) || null,
    landArea:
      (typeof d.landArea === "number" ? d.landArea : Number(d.land_area)) ||
      null,
    pricePerSqm:
      (typeof d.pricePerSqm === "number"
        ? d.pricePerSqm
        : Number(d.price_per_sqm)) || null,
    floors:
      (typeof d.floors === "number" ? d.floors : Number(d.total_floors)) ||
      null,
    bedrooms:
      (typeof d.bedrooms === "number"
        ? d.bedrooms
        : Number(d.total_bedrooms)) || null,
    bathrooms:
      (typeof d.bathrooms === "number"
        ? d.bathrooms
        : Number(d.total_bathrooms)) || null,
    garage:
      (typeof d.garage === "number"
        ? d.garage
        : Number(d.carport ?? d.garage_count)) || null,
    certificateArea:
      (typeof d.certificateArea === "number"
        ? d.certificateArea
        : Number(d.certificate_area)) || null,
    certificate_type: d.certificate_type ?? d.certificateType ?? null,
    certificate_number: d.certificate_number ?? d.certificateNumber ?? null,
    pbb_value:
      (typeof d.pbb_value === "number" ? d.pbb_value : Number(d.pbbValue)) ||
      null,
    price: Number(d.price ?? 0),
    images: allImages,
    features,
    locations,
    minDownPaymentPercent:
      (typeof d.minDownPaymentPercent === "number"
        ? d.minDownPaymentPercent
        : Number(d.min_down_payment_percent)) || null,
    maxLoanTermYears:
      (typeof d.maxLoanTermYears === "number"
        ? d.maxLoanTermYears
        : Number(d.max_loan_term_years)) || null,
    maintenanceFee:
      (typeof d.maintenanceFee === "number"
        ? d.maintenanceFee
        : Number(d.maintenance_fee)) || null,
    inquiryCount:
      (typeof d.inquiryCount === "number"
        ? d.inquiryCount
        : Number(d.inquiry_count)) || null,
    favoriteCount:
      (typeof d.favoriteCount === "number"
        ? d.favoriteCount
        : Number(d.favorite_count)) || null,
    viewCount:
      (typeof d.viewCount === "number" ? d.viewCount : Number(d.view_count)) ||
      null,
    status: d.status ?? null,
    developer,
  };

  return result;
}

export async function fetchKprHistory() {
  const url = `${API_BASE_URL}${API_ENDPOINTS.KPR_HISTORY}`;

  try {
    const res = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

  try {
    const res = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
export async function toggleFavorite(propertyId: number | string) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.TOGGLE_FAVORITE}?propertyId=${propertyId}`;

  try {
    const res = await fetchWithAuth(url, {
      method: "POST",
      // Jangan pakai Content-Type json tanpa body; beberapa backend menganggap ini error
      headers: {
        Accept: "application/json",
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

export async function updateUserProfile(userId: number, payload: any) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE(userId)}`;

  try {
    const res = await fetchWithAuth(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Gagal memperbarui profil.",
        data: json.data,
      };
    }

    return { success: true, message: json.message, data: json.data };
  } catch (e) {
    console.error("Update Profile Error:", e);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}

export async function fetchKprDetail(id: number | string) {
  const url = `${API_BASE_URL}${API_ENDPOINTS.KPR_DETAIL(id)}`;

  try {
    const res = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.ok && json.success && json.data) {
      return { success: true, data: json.data, message: json.message };
    } else {
      return {
        success: false,
        message: json.message || "Gagal memuat detail pengajuan.",
      };
    }
  } catch (error) {
    console.error("Fetch KPR Detail Error:", error);
    return { success: false, message: "Terjadi kesalahan koneksi ke server." };
  }
}
