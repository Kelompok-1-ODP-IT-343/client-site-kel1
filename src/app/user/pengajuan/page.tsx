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
    return Object.keys(newErr).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(0, s - 1));

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
        alert(result.message || "Pengajuan berhasil dikirim.");
        // router.push("/user/pengajuan/success");
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
  );
}
