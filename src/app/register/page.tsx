"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/app/lib/util";
import { Button } from "@/app/components/Ui/Button";
import { Calendar } from "@/app/components/Ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/Ui/popover";
import { registerUser } from "@/app/lib/coreApi";

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
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    birthPlace: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    occupation: "",
    monthlyIncome: "",
    agree_terms: false,
  });

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
    if (!/[A-Z]/.test(form.password))
      return setError("Password harus mengandung huruf besar.");
    if (!/[a-z]/.test(form.password))
      return setError("Password harus mengandung huruf kecil.");
    if (!/\d/.test(form.password))
      return setError("Password harus mengandung angka.");
    if (!/[^A-Za-z0-9]/.test(form.password))
      return setError("Password harus mengandung karakter spesial.");
    if (form.password !== form.confirmPassword)
      return setError("Konfirmasi password tidak sama.");
    if (!form.agree_terms)
      return setError("Anda harus menyetujui syarat & ketentuan.");
    if (!birthDate) return setError("Tanggal lahir harus diisi.");
    if (
      !form.fullName ||
      !form.birthPlace ||
      !form.occupation ||
      !form.monthlyIncome
    )
      return setError("Semua data diri (*) harus diisi.");

    setLoading(true);

    const payload = {
      fullName: form.fullName,
      birthPlace: form.birthPlace,
      birthDate: format(birthDate, "yyyy-MM-dd"),
      email: form.email,
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      occupation: form.occupation,
      monthlyIncome: form.monthlyIncome,
      consentAt: new Date().toISOString(),
    };

    try {
      const result = await registerUser(payload);
      if (result.success) {
        setMessage(`✅ ${result.message}. Mengarahkan ke login...`);
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
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 md:p-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-2">
            Daftar Akun Satu Atap
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Lengkapi data Anda untuk mengajukan KPR
          </p>
        </div>

        <div className="flex items-center justify-center mb-8 space-x-3">
          <StepIndicator
            number={1}
            label="Informasi Akun"
            active={step === 1}
          />
          <span className="text-gray-400">—</span>
          <StepIndicator number={2} label="Data Diri" active={step === 2} />
        </div>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-[#003366]">
                  Informasi Akun
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="email"
                    label="Email *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <InputField
                    id="username"
                    label="Username *"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                  />
                  <InputField
                    id="password"
                    label="Kata Sandi *"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Kata Sandi"
                  />
                  <InputField
                    id="confirmPassword"
                    label="Konfirmasi Kata Sandi *"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Konfirmasi Kata Sandi"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-[#FFB703] hover:bg-[#f9a602] text-[#003366] font-semibold px-6 py-2 rounded-md transition"
                  >
                    Selanjutnya
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-[#003366]">
                  Data Diri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="fullName"
                    label="Nama Lengkap *"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nama Lengkap"
                  />
                  <InputField
                    id="birthPlace"
                    label="Tempat Lahir *"
                    name="birthPlace"
                    value={form.birthPlace}
                    onChange={handleChange}
                    placeholder="Tempat Lahir"
                  />

                  <div>
                    <label
                      htmlFor="birth_date"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tanggal Lahir *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="birth_date"
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-full border rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50",
                            !birthDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {birthDate
                            ? format(birthDate, "dd/MM/yyyy")
                            : "Pilih tanggal"}
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
                          fromYear={1950}
                          toYear={new Date().getFullYear() - 17}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label
                      htmlFor="occupation"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Pekerjaan *
                    </label>
                    <select
                      id="occupation"
                      name="occupation"
                      value={form.occupation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Pilih Jenis Pekerjaan</option>
                      {OCCUPATION_KTP.map((job) => (
                        <option key={job} value={job}>
                          {job.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    id="monthlyIncome"
                    label="Pendapatan Bulanan *"
                    name="monthlyIncome"
                    type="number"
                    value={form.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Contoh: 5000000"
                  />
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-700 mt-3">
                  <input
                    type="checkbox"
                    name="agree_terms"
                    checked={form.agree_terms}
                    onChange={handleChange}
                    className="mt-1 accent-orange-500"
                  />
                  <span>
                    Saya menyetujui{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-orange-600 underline font-medium"
                    >
                      Syarat & Ketentuan BNI
                    </button>
                  </span>
                </div>

                {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
                {message && (
                  <p className="text-green-600 text-xs mt-2">{message}</p>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-[#FFF3CD] text-[#003366] font-semibold px-6 py-2 rounded-md hover:bg-[#ffeaa7] transition"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`font-semibold px-6 py-2 rounded-md text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#FF6600] hover:bg-[#e65c00]"
                    }`}
                  >
                    {loading ? "Mendaftar..." : "Daftar Sekarang"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

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
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative text-xs"
            >
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>

              <h2 className="text-sm font-semibold mb-3">
                Syarat dan Ketentuan Penggunaan Layanan Satu Atap by BNI
              </h2>
              <div className="text-gray-700 space-y-4 text-xs leading-relaxed mt-2">
                <h3 className="font-bold">1. Definisi</h3>
                <p>
                  “Satu Atap” adalah platform digital yang menyediakan layanan simulasi, pengajuan,
                  dan monitoring kredit pemilikan rumah (KPR) secara daring, bekerja sama
                  dengan mitra bank dan developer properti.
                </p>
                <p>
                  “Pengguna” adalah individu yang melakukan registrasi dan/atau menggunakan layanan Satu Atap.
                </p>
                <p>
                  “Data Pribadi” adalah setiap data mengenai seseorang yang teridentifikasi atau
                  dapat diidentifikasi, sesuai ketentuan UU No. 27 Tahun 2022.
                </p>
                <p>
                  “Mitra Bank” adalah lembaga keuangan yang bekerja sama dengan Satu Atap untuk
                  proses analisis dan persetujuan kredit.
                </p>
                <p>“Layanan” berarti seluruh fitur, sistem, dan fungsi yang disediakan melalui aplikasi atau situs web Satu Atap.</p>

                <h3 className="font-bold">2. Ketentuan Umum</h3>
                <p>
                  Pengguna wajib membaca dan memahami seluruh isi Syarat dan Ketentuan ini sebelum
                  menggunakan layanan Satu Atap. Dengan melakukan registrasi dan/atau menggunakan
                  layanan Satu Atap, Pengguna dianggap telah memberikan persetujuan eksplisit atas
                  pengumpulan, penyimpanan, penggunaan, dan pemrosesan data pribadi sesuai 
                  ketentuan perundang-undangan yang berlaku.
                </p>
                <p>Satu Atap berhak mengubah, menambah, atau memperbarui ketentuan ini sewaktu-waktu.</p>

                <h3 className="font-bold">3. Pengumpulan dan Penggunaan Data Pribadi</h3>
                <p>
                  Satu Atap mengumpulkan dan memproses data pribadi Pengguna untuk verifikasi,
                  pemrosesan pengajuan KPR, komunikasi layanan, dan analisis internal dengan
                  prinsip transparansi dan keamanan.
                </p>

                <h3 className="font-bold">4. Pembagian Data kepada Mitra Bank dan Developer</h3>
                <p>
                  Pengguna menyetujui pembagian data pribadi kepada Mitra Bank dan Developer
                  Properti secara aman dan terenkripsi sesuai UU PDP dan POJK.
                </p>

                <h3 className="font-bold">5. Hak dan Kewajiban Pengguna</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Mengakses, memperbaiki, dan menghapus data pribadi</li>
                  <li>Menarik persetujuan pemrosesan data</li>
                  <li>Mendapatkan pemberitahuan jika terjadi kebocoran data</li>
                  <li>Menyampaikan data yang benar dan menjaga kerahasiaan akun</li>
                </ul>

                <h3 className="font-bold">6. Keamanan Informasi</h3>
                <p>
                  Data dilindungi dengan standar keamanan ISO 27001, kontrol akses, dan komunikasi HTTPS.
                  Satu Atap tidak akan meminta OTP atau password melalui pesan pribadi.
                </p>

                <h3 className="font-bold">7. Persetujuan dan Penyimpanan Data</h3>
                <p>
                  Data pribadi disimpan selama layanan berlangsung dan dapat dihapus sesuai permintaan Pengguna.
                </p>

                <h3 className="font-bold">8. Batas Tanggung Jawab</h3>
                <p>
                  Satu Atap tidak menanggung kerugian akibat kelalaian Pengguna menjaga akun,
                  atau gangguan dari pihak ketiga.
                </p>

                <h3 className="font-bold">9. Hukum dan Penyelesaian Sengketa</h3>
                <p>
                  Diatur oleh hukum Republik Indonesia dan diselesaikan melalui OJK atau
                  Pengadilan Negeri Jakarta Pusat.
                </p>

                <h3 className="font-bold">10. Kontak Pengaduan</h3>
                <p>Email: dpo@satuatap.co.id</p>
                <p>Telepon: (021) 1234-5678</p>
                <p>Graha BNI City Lt. 10, Jakarta Pusat, Indonesia</p>

                <p className="mt-4 font-medium">
                  Dengan mencentang persetujuan, Pengguna menyatakan telah membaca,
                  memahami dan menyetujui seluruh ketentuan di atas.
                </p>
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

function InputField({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

function StepIndicator({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all",
          active
            ? "bg-[#FF8500] text-white border-[#FF8500]"
            : "bg-gray-100 text-gray-500 border-gray-300"
        )}
      >
        {number}
      </div>
      <span
        className={cn(
          "text-sm font-semibold",
          active ? "text-[#003366]" : "text-gray-400"
        )}
      >
        {label}
      </span>
    </div>
  );
}
