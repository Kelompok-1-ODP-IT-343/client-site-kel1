"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone as PhoneIcon } from "lucide-react";
import { requestPasswordResetMock } from "@/app/lib/coreApi";

export default function LupaKataSandiPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const clean = phone.replace(/[^0-9+]/g, "");
    if (!clean) {
      setError("Nomor telepon wajib diisi.");
      return;
    }
    if (clean.length < 8) {
      setError("Nomor telepon tidak valid.");
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordResetMock(clean);
      if (res.success) {
        setNotice(res.message || "OTP telah dikirim.");
        const params = new URLSearchParams({
          purpose: "reset",
          phone: clean,
          identifier: clean,
        });
        setTimeout(() => router.push(`/OTP-verification?${params.toString()}`), 500);
      } else {
        setError(res.message || "Gagal mengirim OTP.");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-gray-800 text-center">Lupa Kata Sandi</h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Masukkan nomor telepon Anda untuk menerima kode OTP.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3">
            <PhoneIcon className="w-5 h-5 text-gray-500" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="flex-1 outline-none text-sm text-gray-800"
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {notice && <p className="mt-3 text-sm text-green-600">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-lg text-white font-bold ${
              loading ? "bg-gray-300" : "bg-[#FF8500] hover:bg-[#e67800]"
            }`}
          >
            {loading ? "Mengirim OTP..." : "Kirim OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/login" className="text-bni-teal hover:underline font-bold">Kembali ke Login</Link>
        </p>
      </div>
    </main>
  );
}