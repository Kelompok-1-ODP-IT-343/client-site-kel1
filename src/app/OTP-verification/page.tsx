"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function OTPVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "08xxxxxxxxxx";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleInput = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      return setError("Masukkan kode OTP lengkap.");
    }

    if (code === "123456") {
      router.replace("/beranda");
    } else {
      setError("Kode OTP salah. Silakan coba lagi.");
    }
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    alert("OTP baru telah dikirim ulang ✔");
    document.getElementById("otp-0")?.focus();
  };

  const goBack = () => router.back();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 border text-center">
        
        {/* ICON */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-bni-orange/10 rounded-full mb-6">
          <ShieldCheck className="w-10 h-10 text-bni-orange" />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Verifikasi OTP
        </h1>

        {/* SUBTITLE */}
        <p className="text-sm text-gray-600 mb-8">
          Masukkan kode OTP 6 digit yang telah dikirim ke nomor:
          <br />
          <span className="font-semibold text-gray-800">{phone}</span>
        </p>

        {/* OTP INPUTS */}
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((value, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInput(e.target.value, i)}
              className={`w-12 h-14 border rounded-xl text-center text-xl font-semibold transition
                ${error ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-bni-teal/40"}`}
            />
          ))}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-600 text-xs font-semibold mb-4">
            {error}
          </p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleVerify}
          className="w-full py-3 rounded-lg font-bold text-white bg-bni-orange 
          transition-all duration-300 shadow-lg hover:bg-orange-600 hover:shadow-xl"
        >
          Verifikasi
        </button>

        {/* RESEND OTP */}
        <p className="text-gray-600 text-sm mt-6">
          Tidak menerima kode?{" "}
          <button
            onClick={resendOtp}
            className="text-bni-teal hover:underline font-bold"
          >
            Kirim ulang
          </button>
        </p>

        {/* BACK */}
        <button
          onClick={goBack}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Kembali ke halaman sebelumnya
        </button>

      </div>
    </main>
  );
}
