"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return setMessage("Isi email dan password terlebih dahulu.");
    if (!form.email.includes("@"))
      return setMessage("Format email tidak valid.");
    if (form.password.length < 8)
      return setMessage("Password minimal 8 karakter.");

    // Simulasi validasi backend:
    if (form.email === "user@bni.co.id" && form.password === "12345678") {
      setMessage("Login berhasil! Mengarahkan ke Dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard"; // redirect simulasi
      }, 2000);
    } else if (form.email === "unverified@bni.co.id") {
      setMessage("Verifikasi email Anda terlebih dahulu.");
    } else if (form.email === "locked@bni.co.id") {
      setMessage("Akun terkunci sementara.");
    } else {
      setMessage("Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FA] flex flex-col">
      {/* NAVBAR */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-2">
            <Image src="/logo-satuatap.png" alt="SatuAtap" width={130} height={40} />
          </div>
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link href="/">Beranda</Link>
            <Link href="/cari-rumah">Cari Rumah</Link>
            <Link href="/simulasi">Simulasi</Link>
          </nav>
          <Link
            href="/register"
            className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100 transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* MAIN FORM */}
      <main className="flex flex-1 items-center justify-center py-10 px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Masuk ke Akun Anda
          </h1>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Gunakan akun SatuAtap Anda untuk melanjutkan pengajuan KPR
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={!form.email || !form.password}
              className={`w-full py-2.5 rounded-lg font-medium text-white transition ${
                !form.email || !form.password
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#FF8500] hover:bg-orange-600"
              }`}
            >
              Masuk
            </button>
          </form>

          {/* Pesan Sistem */}
          {message && (
            <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
          )}

          {/* Divider */}
          <div className="text-center text-gray-600 mt-5 mb-3 text-sm">
            atau masuk dengan
          </div>

          {/* Google Login */}
          <button className="w-full flex justify-center items-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition">
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span className="text-gray-700 font-medium text-sm">
              Masuk dengan Google
            </span>
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-teal-600 hover:underline font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#FF8500] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-2">Tentang Kami</p>
            <p>
              PT Bank Negara Indonesia (Persero) Tbk berkomitmen memberikan layanan
              KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Layanan</p>
            <ul className="space-y-1">
              <li><Link href="/pengajuan">Pengajuan</Link></li>
              <li><Link href="/simulasi">Simulasi</Link></li>
              <li><Link href="/cari-rumah">Cari Rumah</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Hubungi Kami</p>
            <p>📞 1500046</p>
            <p>✉️ kpr@bni.co.id</p>
            <p>📍 Jl. Jendral Sudirman Kav.1, Jakarta Pusat 10220</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
