"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { loginApi } from "./../../lib/coreApi";
import { useAuth } from "@/app/lib/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!form.email) {
      newErrors.email = "Email wajib diisi.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password wajib diisi.";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: false, message: "", type: "" });

    if (!validateForm()) return;
    setStatus({ loading: true, message: "", type: "" });

    try {
      const payload = { identifier: form.email, password: form.password };
      console.log("Payload login:", payload);

      const res = await loginApi(payload); 

      if (res.success && res.data) {
        const { token, type, refreshToken, fullName, photoUrl } = res.data;

        // Simpan cookies
        const expiry = 5 * 60;
        document.cookie = `token=${token}; path=/; max-age=${expiry}; SameSite=Lax`;
        document.cookie = `token_type=${type || "Bearer"}; path=/; max-age=${expiry}; SameSite=Lax`;
        const refreshExpiry = 24 * 60 * 60;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshExpiry}; SameSite=Lax`;

        // Simpan data user ke context global
        login({
          fullName: fullName || "Pengguna",
          photoUrl: photoUrl || "/default-avatar.png",
        });

        setStatus({
          loading: false,
          message: "Login berhasil! Mengarahkan ke Beranda...",
          type: "success",
        });

        setTimeout(() => {
          router.push("/user/beranda");
        }, 1000);
      } else {
        setStatus({
          loading: false,
          message: res.message || "Email atau password salah.",
          type: "error",
        });
      }
    } catch (err: any) {
      setStatus({
        loading: false,
        message: err.message || "Gagal terhubung ke server.",
        type: "error",
      });
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center py-10 px-4 bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 border transition-shadow hover:shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Masuk ke Akun Anda
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Gunakan akun Anda untuk melanjutkan pengajuan KPR.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Alamat Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-2.5 text-gray-800 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                  errors.email
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:border-bni-teal focus:ring-bni-teal/50"
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
                    : "border-gray-300 focus:border-bni-teal focus:ring-bni-teal/50"
                }`}
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status.loading || !form.email || !form.password}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 flex justify-center items-center ${
              !form.email || !form.password || status.loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-bni-orange hover:bg-orange-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {status.loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
            href="/user/register"
            className="text-bni-teal hover:underline font-bold"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
