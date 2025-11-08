"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { verifyOtpApi } from "@/app/lib/coreApi";
import { useAuth } from "@/app/lib/authContext";
import { setCookie } from "@/app/lib/cookie";

import { jwtDecode } from "jwt-decode";
type JwtPayload = {
  userId: number | string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
};
function OTPVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const finalRedirectPath = searchParams.get("next") || "/beranda";
  const purpose = searchParams.get("purpose") || "login";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const identifier = searchParams.get("identifier"); 
  const { login } = useAuth();
  const phone = searchParams.get("phone") || "nomor Anda";
  const handleInput = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");
      setNotice("");

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerify = async () => {
      const code = otp.join("");

      if (code.length !== 6) {
        return setError("Masukkan kode OTP lengkap.");
      }

      if (!identifier) {
        return setError("Sesi tidak valid. Silakan login kembali.");
      }

      setLoading(true);
  setError("");
  setNotice("");

      try {
        const payload = {
          identifier: identifier,
          otp: code,
          purpose: purpose,
        };
        const res = await verifyOtpApi(payload);

        if (res.success) {
          if (purpose === "register") {
            setNotice("Verifikasi berhasil! Mengarahkan ke halaman sukses...");
            setTimeout(() => {
              const nextParams = new URLSearchParams({
                next: "/login", 
              });
              router.replace(`/register/success?${nextParams.toString()}`);
            }, 1000);
            return;
          }

          // Default (login purpose): harus ada token
          if (res.data && typeof res.data.token === "string") {
            const {
              token,
              refreshToken,
              type,
              id,
              fullName,
              photoUrl,
              expiresInSec = 3600,
              refreshExpiresInSec = 86400,
            } = res.data as any;

            setCookie("token", token, expiresInSec);
            setCookie("token_type", type || "Bearer", expiresInSec);
            if (refreshToken) setCookie("refreshToken", refreshToken, refreshExpiresInSec);

            const decodedToken = jwtDecode<JwtPayload & { fullName?: string; name?: string }>(token);
            const userId = decodedToken.userId ?? (decodedToken as any).sub ?? "";
            const fallbackFromEmail = identifier && identifier.includes("@")
              ? identifier.split("@")[0]
              : identifier || "Pengguna";
            const displayName =
              fullName || decodedToken.fullName || decodedToken.name || fallbackFromEmail || "Pengguna";

            login({ id: userId || fallbackFromEmail, fullName: displayName, photoUrl: photoUrl || "/profile.png" });
            router.replace(finalRedirectPath);
          } else {
            // Skenario sukses tetapi tanpa token (mis. backend hanya aktivasi akun)
            setError("");
            setNotice("Verifikasi berhasil. Silakan login untuk melanjutkan.");
            setTimeout(() => router.replace("/login"), 800);
          }
        } else {
          setError(res.message || "Kode OTP salah. Silakan coba lagi.");
        }
      } catch (err: any) {
        setError(err.message || "Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    };
  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setNotice("OTP baru telah dikirim ulang ✔");
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
              className={`w-12 h-14 border rounded-xl text-center text-xl font-semibold transition text-black
                ${error ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-bni-teal/40"}`}
            />
          ))}
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="text-center text-sm p-3 rounded-lg mt-4 mb-6 bg-red-100 text-red-800">
            {error}
          </div>
        )}
        {notice && !error && (
          <div className="text-center text-sm p-3 rounded-lg mt-4 mb-6 bg-green-100 text-green-800">
            {notice}
          </div>
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

export default function OTPVerificationPage() {
  return (
    <Suspense fallback={null}>
      <OTPVerificationContent />
    </Suspense>
  );
}
