"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Clock3,
  Percent,
  Wallet,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect, ReactNode } from "react";

/* --------------------------- COLOR CONSTANTS --------------------------- */
const COLORS = {
  teal: "#3FD8D4",
  orange: "#FF8500",
  lime: "#DDEE59",
  darkTeal: "#0f766e",
};

/* --------------------------- MAIN PAGE --------------------------- */
export default function BerandaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 antialiased">
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <ExploreSection />
      </main>
    </div>
  );
}


/* --------------------------- HERO SECTION --------------------------- */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#E0F7F5] py-20 sm:py-24 lg:py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-teal-200 to-lime-200 rounded-full animate-pulse opacity-20 blur-3xl" />
      </div>
      {/* DIUBAH: Kontainer dilebarkan untuk mengurangi space kosong */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Wujudkan Impian Rumah Anda
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          KPR BNI dengan bunga kompetitif dan proses yang mudah untuk Anda.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/user/pengajuan" passHref>
            <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(63, 216, 212, 0.4)" }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition" style={{ background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.lime})` }}>
              Ajukan KPR Sekarang
            </motion.button>
          </Link>
          <Link href="/user/simulasi" passHref>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-semibold border-2 bg-white/70 hover:bg-white transition" style={{ borderColor: COLORS.teal, color: COLORS.darkTeal }}>
              Hitung Simulasi
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------- FEATURE SECTION --------------------------- */
type FeatureCardProps = { icon: ReactNode; title: string; desc: string; accent: string };

function FeatureSection() {
  const features: FeatureCardProps[] = [
    { icon: <Clock3 size={28} />, title: "Proses Cepat", desc: "Verifikasi ringkas & pendampingan personal.", accent: COLORS.teal },
    { icon: <Percent size={28} />, title: "Bunga Kompetitif", desc: "Mulai dari 2.55% (syarat & promo berlaku).", accent: COLORS.orange },
    { icon: <Wallet size={28} />, title: "Fleksibel", desc: "Produk & tenor menyesuaikan rencana Anda.", accent: COLORS.lime },
  ];
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white">
      {/* DIUBAH: Kontainer dilebarkan untuk mengurangi space kosong */}
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => <FeatureCard key={i} {...f} />)}
      </motion.div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, accent }: FeatureCardProps) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div variants={cardVariants} className="rounded-2xl p-6 sm:p-8 bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4" style={{ borderTopColor: accent }}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl text-white" style={{ background: accent }}>{icon}</div>
      <h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-base text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* --------------------------- EXPLORE SECTION --------------------------- */
type PropertyCardProps = { title: string; location: string; price: string; image: string; };

function ExploreSection() {
    const items: (PropertyCardProps & { id: number })[] = [
    { id: 1, title: "Cluster Green Valley", location: "Serpong, Banten", price: "Rp 456.500.000", image: "/rumah-1.jpg" },
    { id: 2, title: "Cluster Green Valley", location: "Margonda, Depok", price: "Rp 625.500.000", image: "/rumah-2.jpg" },
    { id: 3, title: "PONDOK TAKATAKAN", location: "Serang, Banten", price: "Rp 197.000.000", image: "/rumah-3.jpg" },
    { id: 4, title: "Bukit Permata", location: "Bogor, Jawa Barat", price: "Rp 520.000.000", image: "/rumah-4.jpg" },
    { id: 5, title: "Citra Garden", location: "Jakarta Barat", price: "Rp 850.000.000", image: "/rumah-1.jpg" },
    { id: 6, title: "The Icon", location: "BSD City", price: "Rp 1.200.000.000", image: "/rumah-2.jpg" },
    { id: 7, title: "Villa Mutiara", location: "Bekasi", price: "Rp 375.000.000", image: "/rumah-3.jpg" },
    { id: 8, title: "Grand Depok City", location: "Depok", price: "Rp 780.000.000", image: "/rumah-4.jpg" },
  ];
  
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-[#F9FEE7]">
      {/* DIUBAH: Kontainer dilebarkan untuk mengurangi space kosong */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-900">
          Eksplor Rumah Impian
        </h2>
        <p className="text-center text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Tersedia rumah dengan kualitas terbaik dari developer pilihan BNI
        </p>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-12">
          {items.map((it) => <PropertyCard key={it.id} {...it} />)}
        </motion.div>
      </div>
    </section>
  );
}

function PropertyCard({ title, location, price, image }: PropertyCardProps) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };
  return (
    <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group">
      <div className="relative h-56 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="font-bold text-gray-900 text-lg leading-snug">{title}</h4>
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1.5">
          <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500" />
          <span>{location}</span>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100 flex-grow flex flex-col justify-end">
          <div className="text-sm text-gray-500">Harga mulai</div>
          <div className="font-extrabold text-[#FF8500] text-2xl">{price}</div>
        </div>
      </div>
    </motion.div>
  );
}

