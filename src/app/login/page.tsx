"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock } from "lucide-react";
import { loginApi } from "@/app/lib/coreApi";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/apiConfig";
import { fetchWithAuth } from "@/app/lib/authFetch";
import { useAuth } from "@/app/lib/authContext";
import { setCookie } from "@/app/lib/cookie";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const finalRedirectPath = searchParams.get("next") || "/beranda";
  const otpVerificationPath = "/OTP-verification";
  const { login, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    type: "" as "success" | "error" | "",
  });

  useEffect(() => {
    // Hanya redirect bila sudah terautentikasi (user ada),
    // bukan sekadar karena ada cookie token yang mungkin sudah invalid.
    if (user) {
      router.replace("/beranda");
    }
  }, [user, router]);


  const isValidIdentifier = (raw: string) => {
    const s = (raw || "").trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    const isUsername = /^[A-Za-z0-9._-]{3,}$/.test(s);
    return Boolean(isEmail || isUsername);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "email") {
      const msg = value.trim() === ""
        ? "Identifier wajib diisi."
        : isValidIdentifier(value) ? "" : "Masukkan email atau username yang valid.";
      setErrors((s) => ({ ...s, email: msg }));
      return;
    }
    if (errors[name as keyof typeof errors])
      setErrors((s) => ({ ...s, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let ok = true;

    const s = (form.email || "").trim();
    const validId = isValidIdentifier(s);

    if (!s) {
      newErrors.email = "Identifier wajib diisi.";
      ok = false;
    } else if (!validId) {
      newErrors.email = "Masukkan email atau username yang valid.";
      ok = false;
    }

    if (!form.password) {
      newErrors.password = "Password wajib diisi.";
      ok = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setStatus({ loading: false, message: "", type: "" });
  if (!validateForm()) return;

  setStatus({ loading: true, message: "", type: "" });
  try {
    const s = (form.email || "").trim();
    const payload = { identifier: s, password: form.password };
    const res = await loginApi(payload);

    if (res.success && res.data) {
      const params = new URLSearchParams({
        identifier: s,
        phone: res.data.maskedPhone || "nomor Anda",
        next: finalRedirectPath,
        purpose: "login",
      });

      setStatus({
        loading: false,
        message: res.message || "OTP berhasil dikirim! Mengarahkan...",
        type: "success",
      });

      setTimeout(() => {
        if (res.data.otpRequired === false) {
          setCookie("token", res.data.token, 86400);
          setCookie("token_type", res.data.tokenType || "Bearer", 86400);
          // Fetch profile once after login to ensure we store the canonical full name
          (async () => {
            try {
              const prof = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.USER_PROFILE}`, { method: "GET" });
              const json = await prof.json().catch(() => ({}));
              const d = json?.data || {};
              login({
                id: d.id ?? res.data.id,
                fullName: d.fullName || res.data.fullName || form.email,
                photoUrl: d.photoUrl || res.data.photoUrl || "",
              });
            } catch {
              // Fallback to response data if profile fetch fails
              login({ id: res.data.id, fullName: res.data.fullName || form.email, photoUrl: res.data.photoUrl || "" });
            } finally {
              router.replace(finalRedirectPath);
            }
          })();
        } else {
          // default: arahkan ke OTP
          router.replace(`${otpVerificationPath}?${params.toString()}`);
        }
      }, 500);
    } else {
      const raw = (res.errorDetail?.detail || res.errorDetail?.message || res.message || "").toString();
      const parts = raw.split(":");
      const tail = (parts.length ? parts[parts.length - 1] : raw).trim();
      const lower = tail.toLowerCase();
      const friendly = /username atau email tidak ditemukan/.test(lower)
        ? "Username atau email tidak ditemukan"
        : /password.*salah/.test(lower)
        ? "Password salah"
        : tail || "Login gagal.";
      setStatus({
        loading: false,
        message: friendly,
        type: "error",
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error && err.message ? err.message : "Gagal terhubung ke server.";
    setStatus({
      loading: false,
      message: msg,
      type: "error",
    });
  }
};

  return (
    <main className="flex flex-1 items-center justify-center py-10 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 transition-shadow hover:shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Masuk ke Akun <span className="text-bni-orange">Satu Atap</span>
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Gunakan akun Anda untuk melanjutkan pengajuan KPR.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="email"
                placeholder="Email / Username"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-2.5 text-gray-800 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                  errors.email
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:border-transparent focus:ring-orange-400"
                }`}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-2.5 text-gray-800 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                  errors.password
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:border-transparent focus:ring-orange-400"
                }`}
                required
                />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status.loading || !form.email || !form.password || !isValidIdentifier(form.email)}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 flex justify-center items-center ${
              !form.email || !form.password || status.loading || !isValidIdentifier(form.email)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-bni-orange hover:bg-orange-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {status.loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {status.message && (
          <div
            className={`text-center text-sm p-3 rounded-lg mt-6 ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:text-green-700 hover:underline font-bold"
          >
            Daftar sekarang
          </Link>
        </p>

        <div className="flex items-center gap-3 mt-4 text-gray-400">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs font-semibold text-gray-500">atau</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Lupa kata sandi?{" "}
          <Link
            href="/lupa-kata-sandi"
            className="text-green-600 hover:text-green-700 hover:underline font-bold"
          >
            Perbarui di sini
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
