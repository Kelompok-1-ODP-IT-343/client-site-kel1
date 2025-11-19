"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { resetPasswordMock } from "@/app/lib/coreApi";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await resetPasswordMock({ phone, newPassword: pw, confirmPassword: cpw });
      if (res.success) {
        setSuccessOpen(true);
      } else {
        setError(res.message || "Gagal reset kata sandi.");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 relative">
        <h1 className="text-2xl font-extrabold text-gray-800 text-center">Atur Kata Sandi Baru</h1>
        <p className="text-sm text-gray-600 text-center mt-2">Silakan masukkan kata sandi baru Anda.</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="pw" className="block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              id="pw"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="flex-1 outline-none text-sm text-gray-800"
            />
          </div>

          <label htmlFor="cpw" className="block text-sm font-medium text-gray-700 mt-4">Konfirmasi Kata Sandi Baru</label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              id="cpw"
              type="password"
              value={cpw}
              onChange={(e) => setCpw(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="flex-1 outline-none text-sm text-gray-800"
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-lg text-white font-bold ${
              loading ? "bg-gray-300" : "bg-[#FF8500] hover:bg-[#e67800]"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/login" className="text-bni-teal hover:underline font-bold">Kembali ke Login</Link>
        </p>

        {successOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 text-center">
              <h2 className="text-xl font-extrabold text-gray-800">Kata Sandi Berhasil Direset</h2>
              <p className="text-sm text-gray-600 mt-2">Anda dapat masuk kembali menggunakan kata sandi baru.</p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => setSuccessOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                >
                  Tutup
                </button>
                <button
                  onClick={() => router.replace("/login")}
                  className="px-4 py-2 rounded-lg bg-[#FF8500] text-white font-semibold hover:bg-[#e67800]"
                >
                  Masuk ke Akun Anda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}