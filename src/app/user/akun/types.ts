export type Section = "profil" | "notifikasi" | "pengajuan" | "wishlist";

export type AppStatus =
  | "Dokumen Terkirim"
  | "Peninjauan 1"
  | "Peninjauan 2"
  | "Peninjauan 3";

export type Application = {
  id: number;
  cluster: string;
  city: string;
  status: AppStatus;
  loanAmount: number;
  date: string;
  image: string;
};

export type ProfileForm = {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  nik: string;
  npwp: string;
  birth_date: string;
  birth_place: string;
  gender: string;
  marital_status: string;
  address: string;
  sub_district: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  occupation: string;
  company_name: string;
  company_address: string;
  company_district: string;
  company_subdistrict: string;
  company_city: string;
  company_province: string;
  company_postal_code: string;
  monthly_income: string;
  profile_photo: File | null;
  ktp_photo: File | null;
  salary_slip_photo: File | null;
};
