"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { allHouses } from "@/app/lib/propertyData";
import { submitKprApplication } from "@/app/lib/coreApi";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/apiConfig";
import { fetchWithAuth } from "@/app/lib/authFetch";

import StepContent from "./components/StepContent";
import StepDataDiri from "./components/StepDataDiri";
import StepAlamat from "./components/StepAlamat";
import StepPekerjaan from "./components/StepPekerjaan";
import StepPengajuan from "./components/StepPengajuan";

import { formatCurrency, parseCurrency, formatNumberOnly } from "./utils/format";

type FormData = {
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  email: string;
  npwp: string;

  address: string;
  subdistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;

  occupation: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyProvince: string;
  companyPostalCode: string;
  companyDistrict: string;
  companySubdistrict: string;
  monthlyIncome: string;
  workExperience: string;

  downPayment: string;
  loanTerm: string;
  kprRateId?: string; // numeric id as string

  fileKTP: File | null;
  fileSlipGaji: File | null;

  agreeTerms: boolean;
};

type ErrorMap = Record<string, string>;

const STEPS = ["Data Diri", "Alamat", "Pekerjaan", "Pengajuan"];

function FormPengajuanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [errorSummary, setErrorSummary] = useState<string[]>([]);
  const [resultModal, setResultModal] = useState<{
    open: boolean;
    status: "success" | "fail";
    info: {
      applicationNumber?: string | number | null;
      message?: string;
      fullName: string;
      propertiNama: string | null;
      hargaProperti: number;
      downPayment: number;
      loanTerm: number;
      paketLabel: string;
      loanWithFees: number;
    };
  }>({ open: false, status: "success", info: {
    applicationNumber: null,
    message: undefined,
    fullName: "",
    propertiNama: null,
    hargaProperti: 0,
    downPayment: 0,
    loanTerm: 0,
    paketLabel: "—",
    loanWithFees: 0,
  }});

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nik: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    phone: "",
    email: "",
    npwp: "",

    address: "",
    subdistrict: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",

    occupation: "",
    companyName: "",
    companyAddress: "",
  companyCity: "",
  companyProvince: "",
  companyPostalCode: "",
  companyDistrict: "",
  companySubdistrict: "",
    monthlyIncome: "",
    workExperience: "",

    downPayment: "",
    loanTerm: "",
  kprRateId: "",

    fileKTP: null,
    fileSlipGaji: null,

    agreeTerms: false,
  });

  // Prefill form with user profile (editable). Only fills matching fields; others remain empty
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        const base = API_BASE_URL || "";
        const url = `${base}${API_ENDPOINTS.USER_PROFILE}`;
        const res = await fetchWithAuth(url, { method: "GET", signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json().catch(() => null as any);
        const d = json?.data as any;
        if (!d) return;

        const genderMap: Record<string, string> = {
          MALE: "Laki-laki",
          FEMALE: "Perempuan",
          L: "Laki-laki",
          P: "Perempuan",
        };

        setFormData((prev) => ({
          ...prev,
          fullName: d.fullName ?? prev.fullName,
          nik: d.nik ?? prev.nik,
          npwp: d.npwp ?? prev.npwp,
          birthPlace: d.birthPlace ?? prev.birthPlace,
          birthDate: d.birthDate ? String(d.birthDate).slice(0, 10) : prev.birthDate,
          gender: genderMap[(d.gender || "").toString().toUpperCase()] || prev.gender,
          maritalStatus: d.maritalStatus ?? prev.maritalStatus,
          phone: d.phone ?? prev.phone,
          email: d.email ?? prev.email,

          address: d.address ?? prev.address,
          city: d.city ?? prev.city,
          province: d.province ?? prev.province,
          postalCode: d.postalCode ?? prev.postalCode,

          occupation: d.occupation ?? prev.occupation,
          companyName: d.companyName ?? prev.companyName,
          monthlyIncome: typeof d.monthlyIncome === "number" ? formatCurrency(String(d.monthlyIncome)) : (d.monthlyIncome ?? prev.monthlyIncome),
        }));
      } catch (_) {
        // ignore errors - form remains editable
      }
    };
    run();
    return () => controller.abort();
  }, []);

  // --- data properti dari query ---
  const applicationData = {
    propertiId: searchParams.get("propertiId"),
    propertiNama: searchParams.get("propertiNama"),
    propertiLokasi: searchParams.get("propertiLokasi"),
    hargaProperti: searchParams.get("hargaProperti") || "0",
    image:
      allHouses.find(
        (h) => h.id.toString() === searchParams.get("propertiId")
      )?.image || "/rumah-default.jpg",
  };

  // --- handler serbaguna untuk semua input ---
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
      | { target: { name: string; type?: string; value?: any; checked?: boolean; files?: FileList | null } }
  ) => {
    const { name, type = "text" } = e.target as any;
    let value: any =
      type === "checkbox"
        ? (e.target as any).checked
        : type === "file"
        ? (e.target as any).files?.[0] ?? null
        : (e.target as any).value;

    // normalisasi khusus beberapa field
    if (name === "nik") value = formatNumberOnly(String(value)).slice(0, 16);
    if (name === "phone") value = formatNumberOnly(String(value)).slice(0, 15);
    if (name === "postalCode")
      value = formatNumberOnly(String(value)).slice(0, 5);
    if (name === "companyPostalCode")
      value = formatNumberOnly(String(value)).slice(0, 5);
    if (name === "monthlyIncome" || name === "downPayment")
      value = formatCurrency(String(value));
    if (name === "workExperience" || name === "loanTerm")
      value = formatNumberOnly(String(value));

    setFormData((prev) => ({ ...prev, [name]: value }));

    // bersihkan error field yang diubah
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  // --- validasi per step ---
  const validateStep = (idx: number): boolean => {
    const newErr: ErrorMap = {};
    const d = formData;

    if (idx === 0) {
      if (!d.fullName) newErr.fullName = "Nama lengkap wajib diisi";
      if (!d.nik || d.nik.length !== 16) newErr.nik = "NIK harus 16 digit";
      if (!d.npwp) newErr.npwp = "NPWP wajib diisi";
      if (!d.birthPlace) newErr.birthPlace = "Tempat lahir wajib diisi";
      if (!d.birthDate) newErr.birthDate = "Tanggal lahir wajib diisi";
      if (!d.gender) newErr.gender = "Pilih jenis kelamin";
      if (!d.maritalStatus) newErr.maritalStatus = "Pilih status perkawinan";
      if (!d.phone) newErr.phone = "Nomor telepon wajib diisi";
      if (!d.email) newErr.email = "Email wajib diisi";
    } else if (idx === 1) {
      if (!d.address) newErr.address = "Alamat wajib diisi";
      if (!d.subdistrict) newErr.subdistrict = "Kelurahan wajib diisi";
      if (!d.district) newErr.district = "Kecamatan wajib diisi";
      if (!d.city) newErr.city = "Kota/Kabupaten wajib diisi";
      if (!d.province) newErr.province = "Provinsi wajib diisi";
      if (!d.postalCode || d.postalCode.length !== 5)
        newErr.postalCode = "Kode pos 5 digit";
    } else if (idx === 2) {
      if (!d.occupation) newErr.occupation = "Pekerjaan wajib diisi";
      if (!d.companyName) newErr.companyName = "Nama perusahaan wajib diisi";
      if (!d.companyAddress) newErr.companyAddress = "Alamat perusahaan wajib diisi";
      if (!d.companySubdistrict)
        newErr.companySubdistrict = "Kelurahan perusahaan wajib diisi";
      if (!d.companyDistrict)
        newErr.companyDistrict = "Kecamatan perusahaan wajib diisi";
      if (!d.companyCity) newErr.companyCity = "Kota/Kab. perusahaan wajib diisi";
      if (!d.companyProvince)
        newErr.companyProvince = "Provinsi perusahaan wajib diisi";
      if (!d.companyPostalCode || d.companyPostalCode.length !== 5)
        newErr.companyPostalCode = "Kode pos perusahaan 5 digit";
      if (!d.monthlyIncome) newErr.monthlyIncome = "Pendapatan wajib diisi";
      // workExperience dibuat opsional (tidak wajib diisi)
    } else if (idx === 3) {
      if (!d.downPayment || parseCurrency(d.downPayment) <= 0)
        newErr.downPayment = "Uang muka tidak valid";
      if (!d.loanTerm || Number(d.loanTerm) <= 0)
        newErr.loanTerm = "Jangka waktu tidak valid";
      if (!d.kprRateId || String(d.kprRateId).trim() === "")
        newErr.kprRateId = "Paket KPR wajib dipilih";
      if (!d.fileKTP) newErr.fileKTP = "Upload KTP wajib";
      if (!d.fileSlipGaji) newErr.fileSlipGaji = "Upload Slip Gaji wajib";
      if (!d.agreeTerms)
        newErr.agreeTerms = "Anda harus menyetujui Syarat & Ketentuan";
    }

    setErrors(newErr);

    // Build friendly error summary for current step
    const labelMapStep2: Record<string, string> = {
      occupation: "Pekerjaan Utama",
      companyName: "Nama Perusahaan / Instansi",
      companyAddress: "Alamat Perusahaan",
      companySubdistrict: "Kelurahan Tempat Bekerja",
      companyDistrict: "Kecamatan Tempat Bekerja",
      companyCity: "Kota / Kabupaten Tempat Bekerja",
      companyProvince: "Provinsi Tempat Bekerja",
      companyPostalCode: "Kode Pos Tempat Bekerja",
      monthlyIncome: "Pendapatan Bersih per Bulan",
      workExperience: "Lama Bekerja (Tahun)",
    };
    if (idx === 2) {
      const summary = Object.keys(newErr)
        .map((k) => labelMapStep2[k] || k)
        .slice(0, 4); // batasi agar ringkas
      setErrorSummary(summary);
    } else {
      setErrorSummary([]);
    }

    // Fokus dan scroll ke field pertama yang error agar user tahu apa yang harus diisi
    const firstKey = Object.keys(newErr)[0];
    if (firstKey) {
      // gunakan requestAnimationFrame agar DOM sudah update
      requestAnimationFrame(() => {
        const el = document.getElementById(firstKey);
        if (el && typeof (el as any).focus === "function") {
          (el as any).focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }

    return Object.keys(newErr).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const ID_TO_NAME: Record<number, string> = {
    1: "fixed_1y", 2: "fixed_2y", 3: "fixed_1y", 4: "fixed_3y", 5: "fixed_4y",
    6: "fixed_3y", 7: "fixed_5y", 8: "fixed_6y", 9: "fixed_7y", 10: "fixed_8y",
    11: "fixed_9y", 12: "fixed_3y", 13: "fixed_5y", 14: "fixed_10y", 15: "fixed_5y",
    16: "fixed_3y", 17: "fixed_5y", 18: "fixed_3y", 19: "fixed_5y", 20: "fixed_10y",
    21: "fixed_3y", 22: "fixed_5y", 23: "fixed_10y", 24: "fixed_3y", 25: "fixed_5y",
    26: "fixed_10y", 53: "tiered_10y", 54: "tiered_15y", 55: "tiered_20y", 56: "tiered_25y", 57: "tiered_30y",
  };

  const labelForPackage = (value?: string) => {
    if (!value) return "—";
    let name = value;
    if (/^\d+$/.test(value)) {
      const mapped = ID_TO_NAME[Number(value)];
      if (mapped) name = mapped;
      else return "—";
    }
    const match = name.match(/(fixed|tiered)_(\d+)y/);
    if (!match) return name.replaceAll("_", " ");
    const kind = match[1];
    const years = Number(match[2]);
    if (kind === "tiered") return `Fixed Berjenjang ${years} Tahun`;
    return `Fixed ${years} Tahun`;
  };

  // --- submit final ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(STEPS.length - 1)) return;

    setIsLoading(true);
    try {
      const files = {
        fileKTP: formData.fileKTP,
        fileSlipGaji: formData.fileSlipGaji,
        fileNPWP: null as File | null,
        fileOther: null as File | null,
      };

      const submissionData = {
        ...formData,
        propertyId: applicationData.propertiId,
        hargaProperti: applicationData.hargaProperti,
      };

      // panggil API core
      const result = await submitKprApplication(submissionData, files);

      // Build base info
      const harga = Number(applicationData.hargaProperti || 0);
      const dp = parseCurrency(formData.downPayment || "0");
      const ADMIN_FEE = 2_500_000;
      const baseLoan = Math.max(0, harga - dp);
      const provisi = Math.round(baseLoan * 0.01);
      const loanWithFees = Math.max(0, harga + ADMIN_FEE + provisi - dp);
      const applicationNumber = (result?.data && (
        result.data.applicationNumber ?? result.data.applicationNo ?? result.data.applicationId ?? result.data.id ?? result.data.code
      )) || null;

      if (result?.success) {
        setResultModal({
          open: true,
          status: "success",
          info: {
            applicationNumber,
            message: result?.message,
            fullName: formData.fullName,
            propertiNama: applicationData.propertiNama,
            hargaProperti: harga,
            downPayment: dp,
            loanTerm: Number(formData.loanTerm || 0),
            paketLabel: labelForPackage((formData as any).kprRateId),
            loanWithFees,
          },
        });
      } else {
        setResultModal({
          open: true,
          status: "fail",
          info: {
            applicationNumber,
            message: result?.message || "Gagal mengirim pengajuan",
            fullName: formData.fullName,
            propertiNama: applicationData.propertiNama,
            hargaProperti: harga,
            downPayment: dp,
            loanTerm: Number(formData.loanTerm || 0),
            paketLabel: labelForPackage((formData as any).kprRateId),
            loanWithFees,
          },
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Network or unexpected error
      const harga = Number(applicationData.hargaProperti || 0);
      const dp = parseCurrency(formData.downPayment || "0");
      const ADMIN_FEE = 2_500_000;
      const baseLoan = Math.max(0, harga - dp);
      const provisi = Math.round(baseLoan * 0.01);
      const loanWithFees = Math.max(0, harga + ADMIN_FEE + provisi - dp);
      setResultModal({
        open: true,
        status: "fail",
        info: {
          applicationNumber: null,
          message: "Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.",
          fullName: formData.fullName,
          propertiNama: applicationData.propertiNama,
          hargaProperti: harga,
          downPayment: dp,
          loanTerm: Number(formData.loanTerm || 0),
          paketLabel: labelForPackage((formData as any).kprRateId),
          loanWithFees,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disable submit if mandatory pengajuan fields are not satisfied
  const pengajuanReady = step !== 3 ? true : (
    parseCurrency(formData.downPayment || "0") > 0 &&
    Number(formData.loanTerm || 0) > 0 &&
    !!(formData.kprRateId && String(formData.kprRateId).trim() !== "") &&
    !!formData.fileKTP &&
    !!formData.fileSlipGaji &&
    formData.agreeTerms === true
  );

  return (
    <>
    <main className="flex-grow py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-4">
          Formulir Pengajuan KPR
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Lengkapi data di bawah ini untuk melanjutkan proses pengajuan Anda.
        </p>

        {/* Stepper */}
        <div className="flex justify-center w-full mb-12">
          <div className="flex justify-between items-center max-w-2xl w-full">
            {STEPS.map((label, i) => {
              const isActive = i === step;
              const isCompleted = i < step;

              return (
                <div key={i} className="flex items-center w-full">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold border-2 transition-all ${
                      isActive
                        ? "bg-bni-orange text-white border-bni-orange scale-110 shadow-md"
                        : isCompleted
                        ? "bg-bni-orange text-white border-bni-orange"
                        : "bg-gray-200 text-gray-500 border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <span
                    className={`ml-2 whitespace-nowrap text-xs md:text-sm font-semibold transition ${
                      isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>

                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 transition-colors ${
                        isCompleted ? "bg-bni-orange" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {step === 2 && errorSummary.length > 0 && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Mohon lengkapi: {errorSummary.join(", ")}.
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <StepDataDiri
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              )}
              {step === 1 && (
                <StepAlamat
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <StepPekerjaan
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              )}
              {step === 3 && (
                <StepPengajuan
                  data={applicationData}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12 border-t pt-6">
            <div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Kembali
                </button>
              )}
            </div>

            <div>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-orange-600 transition transform hover:scale-105"
                >
                  Berikutnya <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !pengajuanReady}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-wait w-40 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Kirim Pengajuan"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
  </main>
  {/* Result Modal (success or fail) */}
    <AnimatePresence>
      {resultModal.open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex flex-col items-center text-center">
              {resultModal.status === "success" ? (
                <motion.div
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-600">
                    <motion.path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }} />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-600">
                    <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {resultModal.status === "success" ? "Pengajuan KPR Berhasil Dikirim" : "Pengajuan KPR Gagal"}
              </h3>
              {resultModal.info.message && (
                <p className={`mt-1 text-sm ${resultModal.status === "success" ? "text-gray-600" : "text-red-600"}`}>
                  {resultModal.info.message}
                </p>
              )}

              <div className="mt-4 w-full text-sm text-gray-700">
                <div className="flex justify-between py-1"><span>No. Pengajuan</span><span className="font-semibold">{resultModal.info.applicationNumber ?? "-"}</span></div>
                <div className="flex justify-between py-1"><span>Nama</span><span className="font-semibold">{resultModal.info.fullName || "-"}</span></div>
                <div className="flex justify-between py-1"><span>Properti</span><span className="font-semibold">{resultModal.info.propertiNama || "-"}</span></div>
                <div className="flex justify-between py-1"><span>Jumlah Pinjaman</span><span className="font-semibold">{formatCurrency(resultModal.info.loanWithFees || 0)}</span></div>
                <div className="flex justify-between py-1"><span>Tenor</span><span className="font-semibold">{resultModal.info.loanTerm} Tahun</span></div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setResultModal((m) => ({ ...m, open: false }))}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                >
                  Tutup
                </button>
                {resultModal.status === "success" ? (
                  <button
                    onClick={() => router.push("/beranda")}
                    className="px-5 py-2 rounded-lg bg-bni-orange text-white font-semibold hover:bg-orange-600"
                  >
                    Ke Beranda
                  </button>
                ) : (
                  <button
                    onClick={() => setResultModal((m) => ({ ...m, open: false }))}
                    className="px-5 py-2 rounded-lg bg-bni-orange text-white font-semibold hover:bg-orange-600"
                  >
                    Coba Lagi
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export default function FormPengajuanPage() {
  return (
    <Suspense fallback={null}>
      <FormPengajuanContent />
    </Suspense>
  );
}
