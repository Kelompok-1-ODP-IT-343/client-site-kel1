"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { verifyOtpApi, verifyForgotPasswordOtp } from "@/app/lib/coreApi";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/apiConfig";
import { fetchWithAuth } from "@/app/lib/authFetch";
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
  const rawPhone = searchParams.get("phone");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        setError("");
        setNotice("");
        return;
      }
      if (index > 0) {
        if (newOtp[index - 1]) {
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
      return;
    }
    if (e.key === "Delete") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        setError("");
        setNotice("");
        return;
      }
      if (index < newOtp.length - 1 && newOtp[index + 1]) {
        newOtp[index + 1] = "";
        setOtp(newOtp);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (index < otp.length - 1) document.getElementById(`otp-${index + 1}`)?.focus();
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const text = e.clipboardData?.getData?.("text") || "";
    const digits = text.replace(/\D/g, "");
    if (!digits) return;
    const newOtp = [...otp];
    let j = 0;
    while (j < digits.length && index + j < newOtp.length) {
      newOtp[index + j] = digits[j];
      j++;
    }
    setOtp(newOtp);
    setError("");
    setNotice("");
    const nextIndex = Math.min(index + j, newOtp.length - 1);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  const handleVerify = async () => {
      const code = otp.join("");

      if (code.length !== 6) {
        return setError("Masukkan kode OTP lengkap.");
      }

      // Untuk alur reset via phone OTP, tidak membutuhkan identifier.
      if (purpose !== "reset" && !identifier) {
        return setError("Sesi tidak valid. Silakan login kembali.");
      }
      if (purpose === "reset" && !rawPhone) {
        return setError("Nomor tidak ditemukan. Silakan kirim OTP kembali.");
      }

      setLoading(true);
  setError("");
  setNotice("");

      try {
        // Branch: forgot password via phone OTP
        if (purpose === "reset") {
          const res = await verifyForgotPasswordOtp({ phone: String(phone), otp: code });
          if (res.success && res.data?.resetToken) {
            setNotice("Verifikasi berhasil. Silakan atur kata sandi baru.");
            const nextUrl = `/reset-password?token=${encodeURIComponent(res.data.resetToken)}`;
            setTimeout(() => router.replace(nextUrl), 600);
            return;
          }
          setError(res.message || "Kode OTP salah. Silakan coba lagi.");
          return;
        }

        // Default/general OTP (login/registration) flow
        const payload = {
          identifier: identifier || "",
          otp: code,
          purpose: purpose,
        };
        const res = await verifyOtpApi(payload);

        if (res.success) {
          if (purpose === "registration") {
            setNotice("Verifikasi berhasil! Mengarahkan ke halaman sukses...");
            setTimeout(() => {
              router.replace(finalRedirectPath);
            }, 1000);
            return;
          }

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
            // Avoid using email/local-part as a name; prefer API/claims or previous stored fullName
            let previousFullName = "";
            try {
              const saved = localStorage.getItem("user");
              if (saved) previousFullName = JSON.parse(saved)?.fullName || "";
            } catch {}
            // Try to fetch canonical profile once after login
            (async () => {
              try {
                const prof = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.USER_PROFILE}`, { method: "GET" });
                const json = await prof.json().catch(() => ({}));
                const d = json?.data || {};
                const displayName = d.fullName || fullName || decodedToken.fullName || decodedToken.name || previousFullName || "Pengguna";
                login({ id: d.id ?? userId ?? identifier ?? "", fullName: displayName, photoUrl: d.photoUrl || photoUrl || "/profile.png" });
              } catch {
                const displayName = fullName || decodedToken.fullName || decodedToken.name || previousFullName || "Pengguna";
                login({ id: userId || identifier || "", fullName: displayName, photoUrl: photoUrl || "/profile.png" });
              } finally {
                router.replace(finalRedirectPath);
              }
            })();
          } else {
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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">

        <div className="inline-flex items-center justify-center w-16 h-16 bg-bni-orange/10 rounded-full mb-6">
          <ShieldCheck className="w-10 h-10 text-bni-orange" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Verifikasi OTP
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Masukkan kode OTP 6 digit yang telah dikirim ke nomor:
          <br />
          <span className="font-semibold text-gray-800">{phone}</span>
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((value, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInput(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              className={`w-12 h-14 border rounded-lg text-center text-xl font-semibold transition text-black focus:outline-none focus:ring-2
                ${error ? "border-red-500 ring-red-200" : "border-gray-300 focus:border-transparent focus:ring-orange-400"}`}
            />
          ))}
        </div>

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

        <button
          type="button"
          onClick={handleVerify}
          className="w-full py-3 rounded-lg font-bold text-white bg-bni-orange
          transition-all duration-300 shadow-lg hover:bg-orange-600 hover:shadow-xl"
        >
          Verifikasi
        </button>

        <p className="text-gray-600 text-sm mt-6">
          Tidak menerima kode?{" "}
          <button
            onClick={resendOtp}
            className="text-bni-teal hover:underline font-bold"
          >
            Kirim ulang
          </button>
        </p>

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
