"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CheckCircle } from "lucide-react";

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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
   <motion.div
    className="bg-white rounded-xl shadow-2xl shadow-gray-900/10 w-[90%] max-w-md p-8 text-center relative"
    initial={{ scale: 0.8, opacity: 0, y: -20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 20 }}
    transition={{ type: "spring", stiffness: 250, damping: 20 }}
   >
    <motion.div
     className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center border-4 border-green-200"
     initial={{ scale: 0 }}
     animate={{ scale: 1 }}
     transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
    >
     <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2.5} />
    </motion.div>

    <h3 className="mt-6 text-2xl font-extrabold text-[#003366]">
     Akun Berhasil Dibuat!
    </h3>
    <p className="mt-3 text-sm text-gray-700">
     Verifikasi akun Anda telah berhasil dilewati. Silakan masuk untuk memulai proses pengajuan KPR.
    </p>

    <button
     onClick={() => router.push(next)}
     className="mt-8 w-full py-3 rounded-lg bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold text-base transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
    >
     Masuk Sekarang...
    </button>
   </motion.div>
  </div>
 );
}

export default function RegisterSuccessPage() {
 return (
  <Suspense fallback={
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 text-center relative">Memuat informasi...</div>
   </div>
  }>
   <RegisterSuccessContent />
  </Suspense>
 );
}