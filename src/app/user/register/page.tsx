"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, DollarSign, BadgeInfo, CheckCircle, ArrowRight } from "lucide-react";

// Tipe data untuk form state (diperluas dengan field baru)
interface IFormState {
  full_name: string;
  nik: string;
  birth_place: string;
  birth_date: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  occupation: string;
  salary_income: string;
  propertyType: string; // <-- FIELD BARU
  email: string;
  password: string;
  confirm: string;
}

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================
export default function RegisterPage() {
  // PERUBAHAN DI SINI: Menambahkan step baru
  const [step, setStep] = useState(0);
  const steps = ["Data Pribadi", "Alamat", "Pekerjaan", "Informasi KPR", "Buat Akun"];

  const [form, setForm] = useState<IFormState>({
    full_name: "", nik: "", birth_place: "", birth_date: "",
    address: "", city: "", province: "", postal_code: "",
    occupation: "", salary_income: "",
    propertyType: "", // <-- Inisialisasi field baru
    email: "", password: "", confirm: "",
  });
  const [errors, setErrors] = useState<Partial<IFormState>>({});
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  
  // --- LOGIKA FORM (HANDLECHANGE, VALIDATE, SUBMIT) ---
  const formatSalary = (value: string): string => {
    const rawValue = value.replace(/[^0-9]/g, "");
    if (!rawValue) return "";
    return new Intl.NumberFormat("id-ID").format(Number(rawValue));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "nik") {
      setForm({ ...form, [name]: value.replace(/[^0-g-z]/g, "").slice(0, 16) });
    } else if (name === "salary_income") {
      setForm({ ...form, [name]: formatSalary(value) });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (errors[name as keyof IFormState]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<IFormState> = {};
    if (!form.full_name) newErrors.full_name = "Nama lengkap wajib diisi.";
    if (form.nik.length !== 16) newErrors.nik = "NIK harus 16 digit.";
    if (!form.address) newErrors.address = "Alamat wajib diisi.";
    if (!form.city) newErrors.city = "Kota wajib diisi.";
    if (!form.propertyType) newErrors.propertyType = "Jenis properti wajib dipilih."; // <-- Validasi field baru
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Format email tidak valid.";
    if (form.password.length < 8) newErrors.password = "Password minimal 8 karakter.";
    if (form.password !== form.confirm) newErrors.confirm = "Konfirmasi password tidak cocok.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus({ loading: true, message: "", type: "" });
    setTimeout(() => {
      setStatus({ 
        loading: false, 
        message: "Registrasi berhasil! Silakan cek email Anda.", 
        type: "success" 
      });
      // Di sini bisa redirect ke halaman login
    }, 2000);
  };

  return (
    <main className="flex flex-1 items-center justify-center py-10 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 border">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Lengkapi Data Anda
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Ikuti beberapa langkah untuk membuat akun dan mengajukan KPR.
        </p>
        
        {/* Stepper Progresif */}
        <div className="w-full px-4 sm:px-0 mb-12">
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-bni-teal transition-all duration-500 -translate-y-1/2"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            ></div>
            <div className="flex justify-between items-center relative">
              {steps.map((label, i) => (
                <div key={i} className="flex flex-col items-center text-center w-20">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${ i <= step ? "border-bni-teal" : "border-gray-200" } ${ i === step ? "bg-bni-orange text-white scale-110 shadow-md" : i < step ? "bg-bni-teal text-white" : "bg-white text-gray-500" }`}>
                    {i < step ? <CheckCircle size={20} /> : i + 1}
                  </div>
                  <span className={`mt-2 text-xs font-semibold ${ i <= step ? "text-gray-800" : "text-gray-400"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
            <div className="mt-10 transition-all duration-300 ease-in-out">
              {/* PERUBAHAN DI SINI: Urutan step disesuaikan */}
              {step === 0 && <StepDataPribadi form={form} handleChange={handleChange} errors={errors} />}
              {step === 1 && <StepAlamat form={form} handleChange={handleChange} errors={errors} />}
              {step === 2 && <StepPekerjaan form={form} handleChange={handleChange} errors={errors} />}
              {step === 3 && <StepInformasiKPR form={form} handleChange={handleChange} errors={errors} />}
              {step === 4 && <StepAkun form={form} handleChange={handleChange} errors={errors} />}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 border-t pt-6">
              <div>{step > 0 && (<button type="button" onClick={prevStep} disabled={status.loading} className="px-5 py-2.5 rounded-lg border font-semibold text-bni-teal hover:bg-gray-50 disabled:opacity-50">Sebelumnya</button>)}</div>
              <div>{step < steps.length - 1 ? (<button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-orange-600 transition transform hover:scale-105">Selanjutnya <ArrowRight size={18} /></button>) : (<button type="submit" disabled={status.loading} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-wait w-40 transform hover:scale-105">{status.loading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : ("Daftar Sekarang")}</button>)}</div>
            </div>
        </form>
         <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun? <Link href="/login" className="text-bni-teal hover:underline font-bold">Masuk di sini</Link>
        </p>
      </div>
    </main>
  );
}

// ============================================================================
// KOMPONEN-KOMPONEN STEP
// ============================================================================
type StepProps = {
  form: IFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Partial<IFormState>;
}

const StepDataPribadi = ({ form, handleChange, errors }: StepProps) => (
  <StepContent title="Informasi Data Pribadi"><div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><InputField name="full_name" label="Nama Lengkap Sesuai KTP" value={form.full_name} onChange={handleChange} error={errors.full_name} required /><InputField name="nik" label="Nomor Induk Kependudukan (NIK)" value={form.nik} onChange={handleChange} error={errors.nik} required /><InputField name="birth_place" label="Tempat Lahir" value={form.birth_place} onChange={handleChange} error={errors.birth_place} required /><InputField name="birth_date" label="Tanggal Lahir" type="date" value={form.birth_date} onChange={handleChange} error={errors.birth_date} required /></div></StepContent>
);

const StepAlamat = ({ form, handleChange, errors }: StepProps) => (
  <StepContent title="Informasi Alamat"><div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><div className="md:col-span-2"><label className="text-sm font-medium text-gray-700 mb-2 block">Alamat Lengkap *</label><textarea name="address" value={form.address} onChange={handleChange} rows={4} className={`w-full border rounded-lg py-2.5 px-4 text-gray-800 focus:ring-2 focus:outline-none transition-all duration-300 border-gray-300 focus:border-bni-teal focus:ring-bni-teal/50`}></textarea></div><InputField name="city" label="Kota / Kabupaten" value={form.city} onChange={handleChange} error={errors.city} required /><InputField name="province" label="Provinsi" value={form.province} onChange={handleChange} required /><InputField name="postal_code" label="Kode Pos" value={form.postal_code} onChange={handleChange} required /></div></StepContent>
);

const StepPekerjaan = ({ form, handleChange, errors }: StepProps) => (
  <StepContent title="Informasi Pekerjaan"><div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><InputField name="occupation" label="Pekerjaan" value={form.occupation} onChange={handleChange} placeholder="Contoh: Karyawan Swasta" /><InputField name="salary_income" label="Penghasilan Bulanan" value={form.salary_income} onChange={handleChange} placeholder="Contoh: 10.000.000" /></div></StepContent>
);

// KOMPONEN BARU UNTUK STEP INFORMASI KPR
const StepInformasiKPR = ({ form, handleChange, errors }: StepProps) => (
  <StepContent title="Informasi KPR">
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">Jenis Properti *</label>
      <select
        name="propertyType"
        value={form.propertyType}
        onChange={handleChange}
        className={`w-full bg-white border rounded-lg py-2.5 px-4 text-gray-800 focus:ring-2 focus:outline-none transition-all duration-300 ${errors.propertyType ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-bni-teal focus:ring-bni-teal/50'}`}
      >
        <option value="">Pilih jenis properti</option>
        <option value="house">Rumah</option>
        <option value="apartment">Apartemen</option>
        <option value="townhouse">Townhouse</option>
        <option value="villa">Villa</option>
      </select>
      {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
    </div>
  </StepContent>
);

const StepAkun = ({ form, handleChange, errors }: StepProps) => (
  <StepContent title="Buat Akun Anda"><div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><InputField name="email" label="Alamat Email" type="email" value={form.email} onChange={handleChange} error={errors.email} required /><div></div><InputField name="password" label="Password" type="password" value={form.password} onChange={handleChange} error={errors.password} required /><InputField name="confirm" label="Konfirmasi Password" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} required /></div><div className="mt-6 space-y-3"><label className="flex items-center gap-2.5 text-sm text-gray-600"><input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-bni-orange focus:ring-bni-orange accent-bni-orange"/> Saya menyetujui <Link href="/terms" className="text-bni-teal hover:underline font-medium">Syarat & Ketentuan BNI</Link></label><label className="flex items-center gap-2.5 text-sm text-gray-600"><input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-bni-orange focus:ring-bni-orange accent-bni-orange"/> Saya menyetujui <Link href="/privacy" className="text-bni-teal hover:underline font-medium">Kebijakan Privasi BNI</Link></label></div></StepContent>
);

// ============================================================================
// KOMPONEN HELPER
// ============================================================================
const StepContent = ({ title, children }: { title: string; children: ReactNode }) => ( <div><h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>{children}</div> );
const InputField = ({ name, label, type = 'text', placeholder, value, onChange, error, required }: { name: string; label: string; type?: string; placeholder?: string; value: string; onChange: any; error?: string; required?: boolean; }) => ( <div><label className="text-sm font-medium text-gray-700 mb-2 block">{label} {required && <span className="text-red-500">*</span>}</label><input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className={`w-full border rounded-lg py-2.5 px-4 text-gray-800 focus:ring-2 focus:outline-none transition-all duration-300 ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-bni-teal focus:ring-bni-teal/50'}`} />{error && <p className="text-red-500 text-xs mt-1">{error}</p>}</div> );