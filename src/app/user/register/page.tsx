"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { registerUser } from "./../../lib/coreApi";
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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    birth_place: "",
    email: "",
    username: "",
    password: "",
    retype_password: "",
    occupation: "",
    salary_income: "",
    agree_terms: false,
    agree_info: false,
  });

  const router = useRouter();
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
    if (form.password.length < 8) {
      return setError("Password minimal 8 karakter.");
    }

    if (!/[A-Z]/.test(form.password)) {
      return setError("Password harus mengandung minimal satu huruf besar.");
    }

    if (!/[a-z]/.test(form.password)) {
      return setError("Password harus mengandung minimal satu huruf kecil.");
    }
    if (!/\d/.test(form.password)) {
      return setError("Password harus mengandung minimal satu angka.");
    }

    if (!/[^A-Za-z0-9]/.test(form.password)) {
      return setError("Password harus mengandung minimal satu karakter spesial.");
    }

    if (form.password !== form.retype_password) {
      return setError("Konfirmasi password tidak sama.");
    } 
    if (!form.agree_terms)
      return setError("Anda harus menyetujui syarat & ketentuan.");
    if (!birthDate) return setError("Tanggal lahir harus diisi.");
    if (!form.full_name || !form.birth_place || !form.occupation || !form.salary_income)
      return setError("Semua data diri (*) harus diisi.");

    setLoading(true);

    const payload = {
      fullName: form.full_name,
      birthPlace: form.birth_place,
      birthDate: format(birthDate, "yyyy-MM-dd"), // Format date to string
      phone: "08123455678", // no need
      nik:"1212121212121312",// no need
      npwp:"1212121212123212",// no need
      email: form.email,
      username: form.username,
      password: form.password,
      confirmPassword: form.retype_password,
      gender:"MALE",
      maritalStatus:"SINGLE",
      address:"Kemang",
      city: "Jakarta",
      province: "Jakarta Selatan",
      postalCode: "12741",
      companyName: "Kuburan Band",
      occupation: form.occupation,
      workExperience:"5",
      monthlyIncome: form.salary_income,
      consentAt: new Date().toISOString(), //no need

    };
    try {
      const result = await registerUser(payload);

      if (result.success) {
        setMessage(`✅ ${result.message}\nUsername: ${result.data?.user.username}. Mengarahkan ke login...`);
        setTimeout(() => {
          router.push("/user/login");
        }, 2000);
      } else {
        setError(`${result.message || "Registrasi gagal."}`);
      }
    } catch (err: any) {
      setError(`${err.message || "Terjadi kesalahan koneksi."}`);
    } finally {
      setLoading(false);
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
        <h1 className="text-sm md:text-base font-semibold text-center text-gray-800 mb-1">
          Daftar Akun Satu Atap
        </h1>
        <p className="text-center text-gray-500 text-xs md:text-sm mb-6">
          Lengkapi data berikut untuk registrasi KPR
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-3">
              Informasi Akun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField required label="Email *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
              <InputField required label="Username *" name="username" type="text" value={form.username} onChange={handleChange} placeholder="Username" />
              <InputField required label="Password *" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
              <InputField required label="Konfirmasi Password *" name="retype_password" type="password" value={form.retype_password} onChange={handleChange} placeholder="Konfirmasi Password" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-3">
              Data Diri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField required label="Nama Lengkap *" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Nama Lengkap" />
              <InputField required label="Tempat Lahir *" name="birth_place" value={form.birth_place} onChange={handleChange} placeholder="Tempat Lahir" />

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
                      // Optional: Add range limits for birth date
                      fromYear={1950}
                      toYear={new Date().getFullYear() - 17} // Example: min 17 years old
                      captionLayout="dropdown"                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Pekerjaan *
                </label>
                <select
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  required
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

              <InputField required label="Pendapatan Bulanan *" name="salary_income" value={form.salary_income} onChange={handleChange} placeholder="Pendapatan Bulanan" type="number" />
            </div>
          </div>

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

          {error && <p className="text-red-600 text-xs mt-2 whitespace-pre-wrap">{error}</p>}
          {message && <p className="text-green-600 text-xs mt-2 whitespace-pre-wrap">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-5 py-2 text-white text-xs font-semibold rounded-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({ label, name, type = "text", value, onChange, placeholder, required = false }: any) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 text-xs"
      />
    </div>
  );
}

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