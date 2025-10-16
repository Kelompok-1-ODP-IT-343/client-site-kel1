"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Calendar, Briefcase, DollarSign, MapPin } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
    nik: "",
    birth_place: "",
    birth_date: "",
    occupation: "",
    salary_income: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.email.includes("@")) return setMessage("Format email tidak valid.");
    if (form.password.length < 8)
      return setMessage("Gunakan minimal 8 karakter untuk password.");
    if (form.password !== form.confirm)
      return setMessage("Konfirmasi password tidak cocok.");

    // Simulasi API response
    setMessage(
      "Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun."
    );
  };

  return (
    <div className="min-h-screen bg-[#E0F7FA] flex flex-col">
      {/* NAVBAR */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-satuatap.png"
              alt="SatuAtap"
              width={130}
              height={40}
            />
          </div>
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link href="/">Beranda</Link>
            <Link href="/user/cari-rumah">Cari Rumah</Link>
            <Link href="/user/simulasi">Simulasi</Link>
          </nav>
          <Link
            href="/login"
            className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* MAIN FORM */}
      <main className="flex flex-1 items-center justify-center py-10 px-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Daftar Akun Baru
          </h1>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Buat akun SatuAtap untuk mulai ajukan KPR impian Anda
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="full_name"
                placeholder="Nama Lengkap"
                value={form.full_name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

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

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirm"
                placeholder="Konfirmasi Password"
                value={form.confirm}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* NIK */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="nik"
                placeholder="NIK"
                value={form.nik}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Birth Place & Date */}
            <div className="flex gap-3">
              <input
                type="text"
                name="birth_place"
                placeholder="Tempat Lahir"
                value={form.birth_place}
                onChange={handleChange}
                className="w-1/2 border rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                className="w-1/2 border rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Occupation */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="occupation"
                placeholder="Pekerjaan"
                value={form.occupation}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Salary */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="salary_income"
                placeholder="Pendapatan Bulanan"
                value={form.salary_income}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" required /> Saya setuju dengan{" "}
              <Link href="/terms" className="text-teal-600 hover:underline">
                Syarat & Ketentuan
              </Link>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FF8500] text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              Daftar Sekarang
            </button>
          </form>

          {/* Pesan Validasi */}
          {message && (
            <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
          )}

          {/* Google Login */}
          <div className="text-center text-gray-600 mt-5 mb-3">atau daftar dengan</div>
          <button className="w-full flex justify-center items-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition">
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span className="text-gray-700 font-medium text-sm">Google</span>
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-teal-600 hover:underline font-medium">
              Masuk
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
              <li><Link href="/user/simulasi">Simulasi</Link></li>
              <li><Link href="/user/cari-rumah">Cari Rumah</Link></li>
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
