"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Info,
  CheckCircle2,
  Phone,
  Wallet,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/Ui/card";
import { Button } from "../components/Ui/Button";
export default function TentangKami() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Tentang <span className="text-[#FF8500]">Satu Atap</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto" style={{ textAlign: "justify" }}>
            Portal simulasi & pengajuan KPR Pembelian yang terhubung dengan
            produk resmi <b>BNI Griya Pembelian</b>.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <motion.div variants={fadeInUp}>
            <Card className="h-full border border-gray-200 hover:border-[#FF8500]/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Info className="w-5 h-5 text-[#FF8500]" />
                  Tentang Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed" style={{ textAlign: "justify" }}>
                <p>
                  <b>Satu Atap</b> adalah prototipe portal pengajuan{" "}
                  <b>KPR Pembelian</b> yang merujuk ke produk resmi{" "}
                  <b>BNI Griya Pembelian</b>. Tujuan penggunaan kredit di Satu
                  Atap hanya untuk <b>pembelian properti</b> seperti rumah
                  tapak, apartemen, dan ruko/rukan.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="h-full border border-gray-200 hover:border-[#FF8500]/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <CheckCircle2 className="w-5 h-5 text-[#FF8500]" />
                  Keunggulan Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed">
                <ul className="list-disc list-outside pl-6 space-y-2" style={{ textAlign: "justify" }}>
                  <li>
                    Suku bunga kompetitif dengan pilihan masa fixed sesuai promo
                    BNI.
                  </li>
                  <li>
                    Tenor fleksibel hingga <b>30 tahun</b> untuk pembelian
                    rumah/apartemen.
                  </li>
                  <li>
                    Proses mudah secara online melalui halaman Simulasi dan
                    Pengajuan.
                  </li>
                  <li>
                    Fokus pada pembelian properti (rumah, apartemen, ruko).
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="h-full border border-gray-200 hover:border-[#FF8500]/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Building2 className="w-5 h-5 text-[#FF8500]" />
                  Plafon & Syarat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed" style={{ textAlign: "justify" }}>
                <p>
                  <b>Plafon kredit:</b> hingga Rp 20 miliar (tergantung analisis
                  kemampuan bayar & kebijakan BNI).
                </p>
                <p>
                  <b>Tenor:</b> maksimal 30 tahun untuk rumah tinggal/apartemen.
                </p>
                <p className="mt-2">
                  <b>Syarat umum pemohon:</b>
                </p>
                <ul className="list-disc list-outside pl-6 space-y-1" style={{ textAlign: "justify" }}>
                  <li>WNI usia ≥21 tahun.</li>
                  <li>
                    Usia maksimal kredit lunas: 55 tahun (pegawai) / 65 tahun
                    (wiraswasta).
                  </li>
                  <li>Usaha/profesi berjalan minimal 2 tahun.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="h-full border border-gray-200 hover:border-[#FF8500]/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Wallet className="w-5 h-5 text-[#FF8500]" />
                  Biaya dan Suku Bunga
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 leading-relaxed" style={{ textAlign: "justify" }}>
                <p>
                  <b>Provisi:</b> 1% dari plafon kredit yang disetujui.
                </p>
                <p>
                  <b>Administrasi:</b> Rp 750.000 – Rp 2.500.000 (tergantung
                  kebijakan).
                </p>
                <p className="text-sm mt-2">
                  Setelah masa fixed berakhir, berlaku <b>floating rate</b>.
                  Untuk informasi promo suku bunga terbaru, cek halaman resmi
                  BNI Griya Pembelian.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-10"
        >
          <Card className="bg-[#FFF9F5] border border-[#FF8500]/20 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Phone className="w-5 h-5 text-[#FF8500]" />
                Bantuan & Pengaduan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed" style={{ textAlign: "justify" }}>
              <p>
                Untuk informasi resmi dan pengaduan, hubungi{" "}
                <b>BNI Call 1500046</b> atau{" "}
                <a
                  href="mailto:bnicall@bni.co.id"
                  className="text-[#FF8500] font-semibold hover:underline"
                >
                  bnicall@bni.co.id
                </a>
                .
              </p>
              <p>
                BNI berizin dan diawasi oleh <b>OJK</b> dan{" "}
                <b>Bank Indonesia</b>.
              </p>
              <p className="text-sm italic text-gray-500 border-l-4 border-[#FF8500] pl-3 mt-2">
                *Satu Atap merupakan prototipe, bukan platform resmi pengajuan
                KPR BNI.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center"
        >
          <Link href="/simulasi" passHref>
            <Button className="bg-[#FF8500] hover:bg-[#ff9933] text-white font-semibold px-10 py-6 rounded-lg text-lg shadow-md transition-all duration-300">
              Coba Simulasi KPR
              <ArrowRight className="ml-2 w-5 h-5 inline-block" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
