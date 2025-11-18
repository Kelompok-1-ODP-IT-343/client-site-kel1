"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { cn } from "@/app/lib/util";
import { Button } from "@/app/components/Ui/Button";
import { Calendar } from "@/app/components/Ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/Ui/popover";
import { registerUser } from "@/app/lib/coreApi";
import { formatCurrency } from "@/app/user/pengajuan/utils/format";
import { format, isValid } from "date-fns"; 
import { useAuth } from "@/app/lib/authContext";
import { OCCUPATION_KTP } from "./constants";
import { OCCUPATION_OPTIONS } from "@/app/user/constants/occupationOptions";


export default function RegisterSimple() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  type FormState = {
    fullName: string;
    birthPlace: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    phone: string;
    occupation: string;
    monthlyIncome: string;
    agree_terms: boolean;
  };

  type ErrorState = Partial<Record<keyof FormState, string>>;

  const [form, setForm] = useState<FormState>({
    fullName: "",
    birthPlace: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    occupation: "",
    monthlyIncome: "",
    agree_terms: false,
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [globalError, setGlobalError] = useState(""); 
  const mapErrorMessage = (msg: string | undefined) => {
    const lower = (msg || "").toLowerCase();
    const phoneDup = /(nomor\s*telepon).*?(sudah\s*pernah\s*digunakan|terdaftar)/.test(lower) || /(phone).*?(already|exists)/.test(lower);
    const phoneInvalid = /(nomor\s*telepon).*?(tidak\s*valid)/.test(lower) || /(phone).*?(invalid)/.test(lower);
    const emailDup = /(email).*?(sudah\s*pernah\s*digunakan|terdaftar|already|exists)/.test(lower);
    const usernameDup = /(username|user\s*name).*?(sudah\s*pernah\s*digunakan|terdaftar|already|exists)/.test(lower);

    if (phoneDup) return "Nomor telepon sudah pernah digunakan";
    if (emailDup && usernameDup) return "Email dan username sudah pernah digunakan";
    if (emailDup) return "Email sudah pernah digunakan";
    if (usernameDup) return "Username sudah pernah digunakan";
    if (phoneInvalid) return "Nomor telepon tidak valid";
    return msg || "Registrasi gagal.";
  };

  const PROFANITY_WORDS = [
    "kontol",
    "memek",
    "pepek",
    "anjing",
    "bangsat",
    "tai",
    "peler",
    "jembut",
    "kampret",
    "goblok",
    "tolol",
    "pecun",
    "ngewe",
    "bokep",
  ];
  const hasProfanity = (text: string) => {
    const t = text.toLowerCase();
    return PROFANITY_WORDS.some((w) => t.includes(w));
  };
  const isGibberishName = (text: string) => {
    const t = text.toLowerCase().trim();
    if (!t) return false;
    const words = t.split(/\s+/).filter(Boolean);
    for (const w of words) {
      if (w.length < 2) return true;
      if (w.length > 30) return true;
      if (!/[aeiou]/.test(w)) return true;
      if (/(.)\1{2,}/.test(w)) return true; // 3+ repeat
      if (/[^aeiou]{5,}/.test(w)) return true; // 5 consonants run
    }
    return false;
  };
  const isLikelyName = (text: string) => {
    const trimmed = text.trim();
    if (!/^[A-Za-z ]+$/.test(trimmed)) return false;
    if (isGibberishName(trimmed)) return false;
    return true;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = (e.target as HTMLInputElement).checked;

    let finalValue: string | boolean = isCheckbox ? checked : value;

    if (name === "monthlyIncome") {
      let numericOnly = value.replace(/[^0-9]/g, "").slice(0, 20);
      let incomeNumber = Number(numericOnly || "0");
      if (incomeNumber > 500_000_000) {
        numericOnly = String(500_000_000);
        incomeNumber = 500_000_000;
      }
      finalValue = formatCurrency(numericOnly);
      const outOfRange = incomeNumber > 0 && incomeNumber < 1_000_000;
      setErrors(prev => ({
        ...prev,
        monthlyIncome: outOfRange
          ? "Pendapatan bulanan harus antara Rp 1.000.000 dan Rp 500.000.000"
          : undefined,
      }));
    } else if (name === "fullName") {
      const cleaned = value.replace(/[^A-Za-z\s]/g, "").replace(/\s+/g, " ").slice(0, 100).trimStart();
      finalValue = cleaned;
      const invalid = cleaned.length > 0 && (hasProfanity(cleaned) || !isLikelyName(cleaned));
      setErrors(prev => ({
        ...prev,
        fullName: invalid
          ? "Nama lengkap tidak valid. Gunakan huruf saja, hindari teks acak atau kata tidak pantas"
          : undefined,
      }));
    } else if (name === "phone") {
      finalValue = value.replace(/[^0-9]/g, "").slice(0, 15);
    }

    setForm(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name as keyof FormState]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
    setGlobalError(""); 
  };

  const validateStep1 = () => {
    const newErrors: ErrorState = {};
    let isValid = true;

    if (!form.email) {
      newErrors.email = "Email wajib diisi.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
      isValid = false;
    }

    if (!form.username) {
      newErrors.username = "Username wajib diisi.";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password wajib diisi.";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      isValid = false;
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password harus mengandung huruf besar.";
      isValid = false;
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Password harus mengandung huruf kecil.";
      isValid = false;
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Password harus mengandung angka.";
      isValid = false;
    } else if (!/[^A-Za-z0-9]/.test(form.password)) {
      newErrors.password = "Password harus mengandung karakter spesial.";
      isValid = false;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak sama.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors: ErrorState = {};
    let isFormValid = true; 
    
    if (!form.fullName) {
      newErrors.fullName = "Nama lengkap wajib diisi.";
      isFormValid = false; 
    } else if (hasProfanity(form.fullName)) {
      newErrors.fullName = "Nama lengkap tidak boleh mengandung kata tidak pantas.";
      isFormValid = false;
    } else if (!isLikelyName(form.fullName)) {
      newErrors.fullName = "Nama lengkap tidak valid. Gunakan huruf saja dan hindari teks acak.";
      isFormValid = false;
    }
    if (!form.phone) {
      newErrors.phone = "Nomor telepon wajib diisi.";
      isFormValid = false; 
    } else if (form.phone.length < 10) {
      newErrors.phone = "Nomor telepon tidak valid.";
      isFormValid = false;
    }
    if (!form.birthPlace) {
      newErrors.birthPlace = "Tempat lahir wajib diisi.";
      isFormValid = false; 
    }
    
    if (!birthDate || !isValid(birthDate)) { 
      setGlobalError("Tanggal lahir wajib diisi.");
      isFormValid = false; 
    }
    
    if (!form.occupation) {
      newErrors.occupation = "Pekerjaan wajib diisi.";
      isFormValid = false; 
    }
    if (!form.monthlyIncome) {
      newErrors.monthlyIncome = "Pendapatan bulanan wajib diisi.";
      isFormValid = false; 
    } else {
      const numeric = Number(form.monthlyIncome.replace(/\D/g, ""));
      if (numeric < 1_000_000 || numeric > 500_000_000) {
        newErrors.monthlyIncome = "Pendapatan bulanan harus antara Rp 1.000.000 dan Rp 500.000.000";
        isFormValid = false;
      }
    }
    if (!form.agree_terms) {
      setGlobalError("Anda harus menyetujui syarat & ketentuan.");
      isFormValid = false; 
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isFormValid;
  };
const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.key === 'Enter') {
   if (step === 1) {
    e.preventDefault();
    handleNextStep();
   }
  }
 };
  const handleNextStep = () => {
    setGlobalError(""); 
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();

    if (!isStep1Valid || !isStep2Valid) {
      if (!isStep1Valid) setStep(1); 
      return;
    }

    setLoading(true);

    const payload = {
      fullName: form.fullName,
      phone: form.phone,
      birthPlace: form.birthPlace,
      birthDate: format(birthDate!, "yyyy-MM-dd"),
      email: form.email,
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      occupation: form.occupation,
      // Pastikan hanya angka yang dikirim ke backend
      monthlyIncome: form.monthlyIncome.replace(/\D/g, ''),
      consentAt: new Date().toISOString(),
    };

    try {
      const result = await registerUser(payload);

      if (result.status === 409 || result.message?.toLowerCase().includes("terdaftar") || result.message?.toLowerCase().includes("already") || result.message?.toLowerCase().includes("exists")) {
        const msg = (result.message || "").toLowerCase();
        const isEmailDup = /email/.test(msg);
        const isUsernameDup = /username|user\s*name/.test(msg);

        setErrors((prev) => ({
          ...prev,
          email: isEmailDup || (!isEmailDup && !isUsernameDup)
            ? "Email sudah pernah digunakan"
            : prev.email,
          username: isUsernameDup || (!isEmailDup && !isUsernameDup)
            ? "Username sudah pernah digunakan"
            : prev.username,
        }));

        setGlobalError(
          isEmailDup && isUsernameDup
            ? "Email dan username sudah pernah digunakan"
            : isEmailDup
            ? "Email sudah pernah digunakan"
            : isUsernameDup
            ? "Username sudah pernah digunakan"
            : "Akun dengan email atau username tersebut sudah terdaftar."
        );
        setStep(1);
        setShowErrorModal(true);
        return;
      }
      if (result.status === 404 || result.message?.includes("tidak ditemukan")) {
        setGlobalError("Endpoint tidak ditemukan.");
        setShowErrorModal(true);
        return;
      }

      if (result.success && result.data) {
        const params = new URLSearchParams({
          identifier: form.email,
          phone: form.phone || "nomor Anda",
          next: "/login",
          purpose: "registration",
        });
        setMessage(`✅ ${result.message}. OTP telah dikirim ke WhatsApp Anda, mengarahkan ke verifikasi...`);
        setTimeout(() => router.replace(`/OTP-verification?${params.toString()}`), 600);
      } else {
        setGlobalError(mapErrorMessage(result.message));
        setShowErrorModal(true);
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGlobalError(mapErrorMessage(msg) || "Terjadi kesalahan koneksi.");
      setShowErrorModal(true);
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
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputField
                    id="email"
                    label="Email *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    error={errors.email}
                  />
                  <InputField
                    id="username"
                    label="Username *"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    error={errors.username}
                  />
                  <InputField
                    id="password"
                    label="Kata Sandi *"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Kata Sandi"
                    error={errors.password}
                  />
                  <InputField
                    id="confirmPassword"
                    label="Konfirmasi Kata Sandi *"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Konfirmasi Kata Sandi"
                    error={errors.confirmPassword}
                  />
                </div>

                

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep} 
                    className="bg-[#FF6600] hover:bg-[#e65c00] text-white font-semibold px-6 py-2.5 rounded-lg transition"
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
                    pattern="[A-Za-z ]+"
                    error={errors.fullName}
                  />
                  <InputField
                    id="phone"
                    label="Nomor Telepon *"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={15}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 628123456789"
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
                            "justify-start text-left font-normal w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:bg-gray-50",
                            !birthDate && "text-gray-400"
                          )}
                          style={birthDate ? { color: "#111827" } : undefined}
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
                        className="w-auto p-0 bg-white border border-gray-300 rounded-lg shadow-lg"
                      >
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={setBirthDate}
                          fromYear={1950}
                          toYear={new Date().getFullYear() - 17}
                          captionLayout="dropdown"
                          className="p-3"
                          classNames={{
                            head_cell: "w-9 font-semibold text-sm",
                            cell: "h-9 w-9 text-center p-0",
                            day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-orange-100/50 transition-colors",
                            day_selected: "bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600 aria-selected:bg-orange-500 aria-selected:text-black",
                            day_today: "bg-gray-100 text-gray-900",
                            month: "space-y-4",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Baris 3 */}
                  <div>
                    <label
                      htmlFor="occupation"
                      className="block text-sm font-semibold text-gray-800 mb-2"
                    >
                      Pekerjaan *
                    </label>
                    <div className="relative">
                      <select
                        id="occupation"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        className="w-full px-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      >
                        <option value="">Pilih Jenis Pekerjaan</option>
                        {(() => {
                          const labelMap = new Map(
                            OCCUPATION_OPTIONS.map((o) => [o.value, o.label])
                          );
                          return OCCUPATION_KTP.map((job) => (
                            <option key={job} value={job}>
                              {labelMap.get(job) ?? job.replaceAll("_", " ")}
                            </option>
                          ));
                        })()}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <InputField
                  id="monthlyIncome"
                  label="Pendapatan Bulanan *"
                  name="monthlyIncome"
                  type="text"
                  value={form.monthlyIncome}
                  onChange={handleChange}
                  placeholder="Contoh: 5.000.000"
                  inputMode="numeric"
                  pattern="[0-9.]*"
                  error={errors.monthlyIncome}
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
                  “Satu Atap” adalah platform digital yang menyediakan layanan
                  simulasi, pengajuan, dan monitoring kredit pemilikan rumah
                  (KPR) secara daring, bekerja sama dengan mitra bank dan
                  developer properti.
                </p>
                <p>
                  “Pengguna” adalah individu yang melakukan registrasi dan/atau
                  menggunakan layanan Satu Atap.
                </p>
                <p>
                  “Data Pribadi” adalah setiap data mengenai seseorang yang
                  teridentifikasi atau dapat diidentifikasi, sesuai ketentuan UU
                  No. 27 Tahun 2022.
                </p>
                <p>
                  “Mitra Bank” adalah lembaga keuangan yang bekerja sama dengan
                  Satu Atap untuk proses analisis dan persetujuan kredit.
                </p>
                <p>
                  “Layanan” berarti seluruh fitur, sistem, dan fungsi yang
                  disediakan melalui aplikasi atau situs web Satu Atap.
                </p>

                <h3 className="font-bold">2. Ketentuan Umum</h3>
                <p>
                  Pengguna wajib membaca dan memahami seluruh isi Syarat dan
                  Ketentuan ini sebelum menggunakan layanan Satu Atap. Dengan
                  melakukan registrasi dan/atau menggunakan layanan Satu Atap,
                  Pengguna dianggap telah memberikan persetujuan eksplisit atas
                  pengumpulan, penyimpanan, penggunaan, dan pemrosesan data
                  pribadi sesuai ketentuan perundang-undangan yang berlaku.
                </p>
                <p>
                  Satu Atap berhak mengubah, menambah, atau memperbarui
                  ketentuan ini sewaktu-waktu.
                </p>

                <h3 className="font-bold">
                  3. Pengumpulan dan Penggunaan Data Pribadi
                </h3>
                <p>
                  Satu Atap mengumpulkan dan memproses data pribadi Pengguna
                  untuk verifikasi, pemrosesan pengajuan KPR, komunikasi
                  layanan, dan analisis internal dengan prinsip transparansi dan
                  keamanan.
                </p>

                <h3 className="font-bold">
                  4. Pembagian Data kepada Mitra Bank dan Developer
                </h3>
                <p>
                  Pengguna menyetujui pembagian data pribadi kepada Mitra Bank
                  dan Developer Properti secara aman dan terenkripsi sesuai UU
                  PDP dan POJK.
                </p>

                <h3 className="font-bold">5. Hak dan Kewajiban Pengguna</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Mengakses, memperbaiki, dan menghapus data pribadi</li>
                  <li>Menarik persetujuan pemrosesan data</li>
                  <li>Mendapatkan pemberitahuan jika terjadi kebocoran data</li>
                  <li>
                    Menyampaikan data yang benar dan menjaga kerahasiaan akun
                  </li>
                </ul>

                <h3 className="font-bold">6. Keamanan Informasi</h3>
                <p>
                  Data dilindungi dengan standar keamanan ISO 27001, kontrol
                  akses, dan komunikasi HTTPS. Satu Atap tidak akan meminta OTP
                  atau password melalui pesan pribadi.
                </p>

                <h3 className="font-bold">
                  7. Persetujuan dan Penyimpanan Data
                </h3>
                <p>
                  Data pribadi disimpan selama layanan berlangsung dan dapat
                  dihapus sesuai permintaan Pengguna.
                </p>

                <h3 className="font-bold">8. Batas Tanggung Jawab</h3>
                <p>
                  Satu Atap tidak menanggung kerugian akibat kelalaian Pengguna
                  menjaga akun, atau gangguan dari pihak ketiga.
                </p>

                <h3 className="font-bold">
                  9. Hukum dan Penyelesaian Sengketa
                </h3>
                <p>
                  Diatur oleh hukum Republik Indonesia dan diselesaikan melalui
                  OJK atau Pengadilan Negeri Jakarta Pusat.
                </p>

                <h3 className="font-bold">10. Kontak Pengaduan</h3>
                <p>Email: dpo@satuatap.co.id</p>
                <p>Telepon: (021) 1234-5678</p>
                <p>Graha BNI City Lt. 10, Jakarta Pusat, Indonesia</p>

                <p className="mt-4 font-medium">
                  Dengan mencentang persetujuan, Pengguna menyatakan telah
                  membaca, memahami dan menyetujui seluruh ketentuan di atas.
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

      {/* Popup error untuk kegagalan registrasi setelah klik "Daftar Sekarang" */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
            >
              <button
                onClick={() => setShowErrorModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Registrasi Gagal</h3>
              </div>

              <p className="mt-3 text-sm text-gray-700">
                {globalError || "Terjadi kesalahan saat memproses pendaftaran."}
              </p>

              <div className="mt-5 flex gap-3 justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Tutup
                </button>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Oke, mengerti
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
  error, 
  inputMode,
  pattern,
  maxLength,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string; 
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800 mb-2"
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
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
        className={cn(
          "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent",
          error && "border-red-500 ring-1 ring-red-200" 
        )}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
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
