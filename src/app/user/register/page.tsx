"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
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
  });

  const router = useRouter();
  const [birthDate, setBirthDate] = useState<Date>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showTerms, setShowTerms] = useState(false); // popup toggle

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
    if (!/[A-Z]/.test(form.password))
      return setError("Password harus mengandung minimal satu huruf besar.");
    if (!/[a-z]/.test(form.password))
      return setError("Password harus mengandung minimal satu huruf kecil.");
    if (!/\d/.test(form.password))
      return setError("Password harus mengandung minimal satu angka.");
    if (!/[^A-Za-z0-9]/.test(form.password))
      return setError("Password harus mengandung minimal satu karakter spesial.");
    if (form.password !== form.retype_password)
      return setError("Konfirmasi password tidak sama.");
    if (!form.agree_terms)
      return setError("Anda harus menyetujui syarat & ketentuan.");
    if (!birthDate) return setError("Tanggal lahir harus diisi.");
    if (!form.full_name || !form.birth_place || !form.occupation || !form.salary_income)
      return setError("Semua data diri (*) harus diisi.");

    setLoading(true);

    const payload = {
      fullName: form.full_name,
      birthPlace: form.birth_place,
      birthDate: format(birthDate, "yyyy-MM-dd"),
      phone: "08123455678",
      nik: "1212121212121312",
      npwp: "1212121212123212",
      email: form.email,
      username: form.username,
      password: form.password,
      confirmPassword: form.retype_password,
      gender: "MALE",
      maritalStatus: "SINGLE",
      address: "Kemang",
      city: "Jakarta",
      province: "Jakarta Selatan",
      postalCode: "12741",
      companyName: "Kuburan Band",
      occupation: form.occupation,
      workExperience: "5",
      monthlyIncome: form.salary_income,
      consentAt: new Date().toISOString(),
    };

    try {
      const result = await registerUser(payload);
      if (result.success) {
        setMessage(`✅ ${result.message}\nUsername: ${result.data?.user.username}. Mengarahkan ke login...`);
        setTimeout(() => router.push("/user/login"), 2000);
      } else {
        setError(result.message || "Registrasi gagal.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
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
          {/* Informasi Akun */}
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

          {/* Data Diri */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-3">
              Data Diri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField required label="Nama Lengkap *" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Nama Lengkap" />
              <InputField required label="Tempat Lahir *" name="birth_place" value={form.birth_place} onChange={handleChange} placeholder="Tempat Lahir" />
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-700 mb-2">Tanggal Lahir *</label>
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
                  <PopoverContent align="start" side="bottom" sideOffset={4} className="p-3 bg-white border border-gray-200 shadow-xl rounded-xl w-[280px]">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      className="rounded-md text-xs"
                      fromYear={1950}
                      toYear={new Date().getFullYear() - 17}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Pekerjaan *</label>
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

          {/* Checkbox dengan Popup */}
          <div className="space-y-1 mt-2 text-xs">
            <label className="flex items-start gap-2 text-gray-700">
              <input type="checkbox" name="agree_terms" checked={form.agree_terms} onChange={handleChange} className="mt-0.5 accent-orange-500" />
              <span>
                Saya telah membaca dan menyetujui{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-orange-600 underline hover:text-orange-700"
                >
                  Syarat & Ketentuan Penggunaan Satu Atap
                </button>
                .
              </span>
            </label>
          </div>

          {error && <p className="text-red-600 text-xs mt-2 whitespace-pre-wrap">{error}</p>}
          {message && <p className="text-green-600 text-xs mt-2 whitespace-pre-wrap">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-5 py-2 text-white text-xs font-semibold rounded-md transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>
      </motion.div>

      {/* Popup Modal S&K */}
      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative text-xs"
            >
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
              <h2 className="text-sm font-semibold mb-3">Syarat dan Ketentuan Penggunaan Layanan Satu Atap by BNI</h2>
              <div className="prose prose-sm max-w-none text-gray-700 space-y-4 leading-relaxed">
                <p><strong>1. Definisi</strong><br />Dalam Syarat dan Ketentuan ini, istilah-istilah berikut memiliki arti sebagai berikut:- “Satu Atap” adalah platform digital yang menyediakan layanan simulasi, pengajuan, dan monitoring kredit pemilikan rumah (KPR) secara daring, bekerja sama dengan mitra bank dan developer properti. “Pengguna” adalah individu yang melakukan registrasi dan/atau menggunakan layanan Satu Atap. “Data Pribadi” adalah setiap data mengenai seseorang yang teridentifikasi atau dapat diidentifikasi, sesuai ketentuan UU No. 27 Tahun 2022. “Mitra Bank” adalah lembaga keuangan yang bekerja sama dengan Satu Atap untuk proses analisis dan persetujuan kredit. “Layanan” berarti seluruh fitur, sistem, dan fungsi yang disediakan melalui aplikasi atau situs web Satu Atap.</p>
                <p><strong>2. Ketentuan Umum</strong><br />Pengguna wajib membaca dan memahami seluruh isi Syarat dan Ketentuan ini sebelum menggunakan layanan Satu Atap. Dengan melakukan registrasi dan/atau menggunakan layanan Satu Atap, Pengguna dianggap telah memberikan persetujuan eksplisit atas pengumpulan, penyimpanan, penggunaan, dan pemrosesan data pribadi sesuai ketentuan perundang-undangan yang berlaku. Satu Atap berhak mengubah, menambah, atau memperbarui ketentuan ini sewaktu-waktu dengan tetap mengacu pada ketentuan hukum yang berlaku.</p>
                <p><strong>3. Pengumpulan dan Penggunaan Data Pribadi</strong><br />Satu Atap akan mengumpulkan dan memproses data pribadi Pengguna termasuk namun tidak terbatas pada nama, NIK, tanggal lahir, alamat, email, dan dokumen pendukung. Data digunakan untuk tujuan verifikasi identitas, pemrosesan pengajuan KPR, komunikasi layanan, dan analisis internal. Pemrosesan data dilakukan dengan prinsip transparansi, akuntabilitas, dan perlindungan hak subjek data pribadi.</p>
                <p><strong>4. Pembagian Data kepada Mitra Bank dan Developer</strong><br />Pengguna memberikan persetujuan eksplisit kepada Satu Atap untuk membagikan data pribadi dan dokumen pendukung kepada Mitra Bank dan Developer Properti.  Pembagian data dilakukan secara aman dan terenkripsi kepada pihak yang tunduk pada UU PDP dan POJK.</p>
                <p><strong>5. Hak dan Kewajiban Pengguna</strong><br />Hak Pengguna: Mengetahui tujuan dan dasar hukum pemrosesan data pribadi. Mengakses, memperbaiki, dan menghapus data pribadi. Menarik kembali persetujuan atas penggunaan data pribadi. Mendapatkan pemberitahuan jika terjadi kebocoran data. Kewajiban Pengguna: Menyampaikan data yang benar, akurat, dan lengkap. Menjaga kerahasiaan akun dan tidak membagikan kredensial login. Menggunakan layanan secara sah dan bertanggung jawab.</p>
                <p><strong>6. Keamanan Informasi</strong><br />Satu Atap menerapkan standar keamanan sesuai ISO 27001 dan POJK 13/2020. Dokumen diunggah disimpan secara aman dengan kontrol akses terbatas. Seluruh komunikasi data dilakukan melalui HTTPS (TLS 1.3). Satu Atap tidak akan meminta OTP atau password melalui media pribadi.</p>
                <p><strong>7. Persetujuan dan Penyimpanan Data</strong><br />Dengan menyetujui Syarat dan Ketentuan ini, Pengguna memberikan izin eksplisit untuk penyimpanan dan pemrosesan data pribadi selama masa layanan. Data dihapus bila tidak lagi relevan atau atas permintaan pengguna, sesuai Pasal 48 UU PDP.</p>
                <p><strong>8. Batas Tanggung Jawab</strong><br />Satu Atap tidak bertanggung jawab atas kerugian akibat kelalaian pengguna menjaga akun, akses ilegal, atau gangguan sistem pihak ketiga.2. Setiap insiden keamanan akan ditangani sesuai prosedur Incident Response Plan.</p>
                <p><strong>9. Hukum yang Berlaku dan Penyelesaian Sengketa</strong><br />Diatur oleh hukum Republik Indonesia. Sengketa diselesaikan melalui mediasi OJK atau Pengadilan Negeri Jakarta Pusat.</p>
                <p><strong>10. Kontak Pengaduan dan Perlindungan Data</strong><br />Email: dpo@satuatap.co.id<br />Telepon: (021) 1234-5678<br />Alamat: Graha BNI City Lt. 10, Jakarta Pusat, Indonesia</p>
                <p>Dengan mencentang kotak persetujuan dan menggunakan layanan Satu Atap, Pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh isi dokumen ini.</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setForm((prev) => ({ ...prev, agree_terms: true }));
                    setShowTerms(false);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-md"
                >
                  Saya Setuju
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================== Sub Components ========================== */
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
