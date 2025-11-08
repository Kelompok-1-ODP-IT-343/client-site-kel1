"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RegisterSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/login";

  useEffect(() => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(
          /=.*/,
          "=;expires=" + new Date(0).toUTCString() + ";path=/"
        );
    });
    localStorage.removeItem("user");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/50 px-4">
      <motion.div
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 text-center relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Icon centang hijau */}
        <motion.div
          className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-green-600"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.1,
              }}
            />
          </svg>
        </motion.div>

        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Registrasi Akun Berhasil
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Akun Anda telah berhasil dibuat dan diverifikasi. Silakan login
          menggunakan email dan password Anda.
        </p>

        <button
          onClick={() => router.push(next)}
          className="mt-6 w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition"
        >
          Masuk ke Akun Anda
        </button>
      </motion.div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={null}>
      <RegisterSuccessContent />
    </Suspense>
  );
}
