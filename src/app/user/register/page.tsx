"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ⬅️ Tambahkan ini
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const OCCUPATION_KTP = [
  "BELUM_TIDAK_BEKERJA",
  "MENGURUS_RUMAH_TANGGA",
  "PELAJAR_MAHASISWA",
  "PENSIUNAN",
  "PNS",
  "TNI",
  "POLRI",
  "KARYAWAN_SWASTA",
  "KARYAWAN_BUMN",
  "KARYAWAN_BUMD",
  "KARYAWAN_HONORER",
  "WIRASWASTA",
  "PERDAGANGAN",
  "PETANI_PEKEBUN",
  "PETERNAK",
  "NELAYAN_PERIKANAN",
  "INDUSTRI",
  "KONSTRUKSI",
  "TRANSPORTASI",
  "BURUH_HARIAN_LEPAS",
  "BURUH_TANI_PERKEBUNAN",
  "BURUH_NELAYAN_PERIKANAN",
  "BURUH_PETERNAKAN",
  "PEMBANTU_RUMAH_TANGGA",
];

export default function RegisterSimple() {
  const router = useRouter(); // Inisialisasi router
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    retype_password: "",
    full_name: "",
    birth_place: "",
    occupation: "",
    salary_income: "",
    agree_terms: false,
    agree_info: false,
  });
  const [birthDate, setBirthDate] = useState<Date>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email.includes("@")) return setError("Format email tidak valid.");
    if (form.password.length < 8)
      return setError("Password minimal 8 karakter.");
    if (form.password !== form.retype_password)
      return setError("Konfirmasi password tidak sama.");
    if (!form.agree_terms)
      return setError("Anda harus menyetujui syarat & ketentuan.");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, birth_date: birthDate }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // ✅ Kalau berhasil, tampilkan pesan dulu
      setMessage("✅ Registrasi berhasil! Mengarahkan ke halaman login...");
      
      // Tunggu 1,5 detik lalu redirect ke login
      setTimeout(() => {
        router.push("/user/login"); // Route ke halaman login
      }, 1500);
    } catch (err: any) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white p-8 md:p-10 rounded-2xl shadow-lg text-sm"
      >
        {/* Heading */}
        <h1 className="text-sm md:text-base font-semibold text-center text-gray-800 mb-1">
          Daftar Akun Satu Atap
        </h1>
        <p className="text-center text-gray-500 text-xs md:text-sm mb-6">
          Lengkapi data berikut untuk registrasi KPR
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========================= SECTION 1: AKUN ========================= */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-3">
              Informasi Akun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
              <InputField label="Username *" name="username" type="text" value={form.username} onChange={handleChange} placeholder="Username" />
              <InputField label="Password *" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
              <InputField label="Konfirmasi Password *" name="retype_password" type="password" value={form.retype_password} onChange={handleChange} placeholder="Konfirmasi Password" />
            </div>
          </div>

          {/* ========================= SECTION 2: DATA DIRI ========================= */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-3">
              Data Diri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Nama Lengkap *" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Nama Lengkap" />
              <InputField label="Tempat Lahir *" name="birth_place" value={form.birth_place} onChange={handleChange} placeholder="Tempat Lahir" />

              {/* === 📅 Kalender === */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Tanggal Lahir *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-full border rounded-lg px-3 py-2 text-xs bg-white hover:bg-gray-50",
                        !birthDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {birthDate ? format(birthDate, "dd/MM/yyyy") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    className="p-3 bg-white border border-gray-200 shadow-xl rounded-xl w-[280px]"
                  >
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      className="rounded-md text-xs [&_.rdp-months]:flex [&_.rdp-months]:justify-center [&_.rdp-head_cell]:text-gray-500 [&_.rdp-day]:h-7 [&_.rdp-day]:w-7 [&_.rdp-day_selected]:bg-orange-500 [&_.rdp-day_selected]:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Pekerjaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Pekerjaan *
                </label>
                <select
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 text-xs"
                >
                  <option value="">Pilih Jenis Pekerjaan</option>
                  {OCCUPATION_KTP.map((job) => (
                    <option key={job} value={job}>
                      {job.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <InputField label="Pendapatan Bulanan *" name="salary_income" value={form.salary_income} onChange={handleChange} placeholder="Pendapatan Bulanan" />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1 mt-2 text-xs">
            <Checkbox
              name="agree_terms"
              checked={form.agree_terms}
              onChange={handleChange}
              label="Saya menyetujui syarat & ketentuan penggunaan Satu Atap."
            />
            <Checkbox
              name="agree_info"
              checked={form.agree_info}
              onChange={handleChange}
              label="Saya bersedia menerima informasi produk & promo KPR."
            />
          </div>

          {/* Error & Success */}
          {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
          {message && <p className="text-green-600 text-xs mt-2">{message}</p>}

          <button
            type="submit"
            className="w-full mt-5 py-2 bg-orange-500 text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-all"
          >
            Daftar Sekarang
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* 🔸 Input Field */
function InputField({ label, name, type = "text", value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 text-xs"
      />
    </div>
  );
}

/* 🔸 Checkbox */
function Checkbox({ name, checked, onChange, label }: any) {
  return (
    <label className="flex items-center text-gray-700 text-xs">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2 accent-orange-500"
      />
      {label}
    </label>
  );
}
