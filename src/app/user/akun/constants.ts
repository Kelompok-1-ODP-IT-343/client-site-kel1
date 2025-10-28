import { AppStatus, ProfileForm } from "@/app/user/akun/types";

export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export const STATUS_STYLES: Record<AppStatus, { chip: string; dot: string }> = {
  "Dokumen Terkirim": {
    chip: "text-blue-700 border-blue-600",
    dot: "bg-blue-600",
  },
  "Peninjauan 1": {
    chip: "text-yellow-700 border-yellow-600",
    dot: "bg-yellow-500",
  },
  "Peninjauan 2": {
    chip: "text-orange-700 border-orange-600",
    dot: "bg-orange-600",
  },
  "Peninjauan 3": { chip: "text-teal-700 border-teal-600", dot: "bg-teal-600" },
  SUBMITTED: {
    chip: "text-blue-700 border-blue-600",
    dot: "bg-blue-600",
  },
};

export const DEFAULT_PROFILE: ProfileForm = {
  full_name: "",
  username: "",
  email: "",
  phone: "",
  nik: "",
  npwp: "",
  birth_date: "",
  birth_place: "",
  gender: "",
  marital_status: "",
  address: "",
  sub_district: "",
  district: "",
  city: "",
  province: "",
  postal_code: "",
  occupation: "",
  company_name: "",
  company_address: "",
  company_district: "",
  company_subdistrict: "",
  company_city: "",
  company_province: "",
  company_postal_code: "",
  monthly_income: "",
  profile_photo: null,
  ktp_photo: null,
  salary_slip_photo: null,
};
