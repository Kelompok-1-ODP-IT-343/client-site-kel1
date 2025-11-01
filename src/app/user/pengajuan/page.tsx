"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { allHouses } from "@/app/lib/propertyData";
import { submitKprApplication } from "@/app/lib/coreApi";

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
  monthlyIncome: string;
  workExperience: string;

  downPayment: string;
  loanTerm: string;

  fileKTP: File | null;
  fileSlipGaji: File | null;

  agreeTerms: boolean;
};

type ErrorMap = Record<string, string>;

const STEPS = ["Data Diri", "Alamat", "Pekerjaan", "Pengajuan"];

export default function FormPengajuanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    fullName: string;
    propertiNama: string | null;
    hargaProperti: number;
    downPayment: number;
    loanTerm: number;
    paketLabel: string;
    loanWithFees: number;
  } | null>(null);

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
    monthlyIncome: "",
    workExperience: "",

    downPayment: "",
    loanTerm: "",

    fileKTP: null,
    fileSlipGaji: null,

    agreeTerms: false,
  });

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
    if (name === "postalCode")
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
      if (!d.monthlyIncome) newErr.monthlyIncome = "Pendapatan wajib diisi";
      if (!d.workExperience) newErr.workExperience = "Lama bekerja wajib diisi";
    } else if (idx === 3) {
      if (!d.downPayment || parseCurrency(d.downPayment) <= 0)
        newErr.downPayment = "Uang muka tidak valid";
      if (!d.loanTerm || Number(d.loanTerm) <= 0)
        newErr.loanTerm = "Jangka waktu tidak valid";
      if (!d.fileKTP) newErr.fileKTP = "Upload KTP wajib";
      if (!d.fileSlipGaji) newErr.fileSlipGaji = "Upload Slip Gaji wajib";
      if (!d.agreeTerms)
        newErr.agreeTerms = "Anda harus menyetujui Syarat & Ketentuan";
    }

    setErrors(newErr);

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

      if (result?.success) {
        // Build success summary for modal
        const harga = Number(applicationData.hargaProperti || 0);
        const dp = parseCurrency(formData.downPayment || "0");
        const ADMIN_FEE = 2_500_000;
        const baseLoan = Math.max(0, harga - dp);
        const provisi = Math.round(baseLoan * 0.01);
        const loanWithFees = Math.max(0, harga + ADMIN_FEE + provisi - dp);
        setSuccessInfo({
          fullName: formData.fullName,
          propertiNama: applicationData.propertiNama,
          hargaProperti: harga,
          downPayment: dp,
          loanTerm: Number(formData.loanTerm || 0),
          paketLabel: labelForPackage((formData as any).kprRateId),
          loanWithFees,
        });
        setShowSuccess(true);
      } else {
        alert(`Error: ${result?.message || "Gagal mengirim pengajuan"}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

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
                  disabled={isLoading}
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
  {/* Success Modal */}
    <AnimatePresence>
      {showSuccess && (
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
              <motion.div
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-green-600"
                >
                  <motion.path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  />
                </svg>
              </motion.div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Pengajuan KPR Berhasil Dikirim</h3>
              <p className="mt-1 text-sm text-gray-600">Kami telah menerima pengajuan Anda. Tim kami akan memprosesnya secepatnya.</p>

              {successInfo && (
                <div className="mt-4 w-full text-sm text-gray-700">
                  <div className="flex justify-between py-1"><span>Nama</span><span className="font-semibold">{successInfo?.fullName || "-"}</span></div>
                  <div className="flex justify-between py-1"><span>Properti</span><span className="font-semibold">{successInfo?.propertiNama || "-"}</span></div>
                  <div className="flex justify-between py-1"><span>Harga</span><span className="font-semibold">{formatCurrency(successInfo?.hargaProperti || 0)}</span></div>
                  <div className="flex justify-between py-1"><span>Downpayment</span><span className="font-semibold">{formatCurrency(successInfo?.downPayment || 0)}</span></div>
                  <div className="flex justify-between py-1"><span>Tenor</span><span className="font-semibold">{successInfo?.loanTerm} Tahun</span></div>
                  <div className="flex justify-between py-1"><span>Paket</span><span className="font-semibold">{successInfo?.paketLabel}</span></div>
                  <div className="flex justify-between py-1 border-t mt-2 pt-2"><span>Pinjaman (incl. biaya)</span><span className="font-semibold">{formatCurrency(successInfo?.loanWithFees || 0)}</span></div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                >
                  Tutup
                </button>
                <button
                  onClick={() => router.push("/beranda")}
                  className="px-5 py-2 rounded-lg bg-bni-orange text-white font-semibold hover:bg-orange-600"
                >
                  Ke Beranda
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
