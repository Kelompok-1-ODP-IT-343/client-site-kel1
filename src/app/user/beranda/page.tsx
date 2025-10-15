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
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <ExploreSection />
      </main>
      <Footer />
    </div>
  );
}

/* --------------------------- HEADER --------------------------- */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/80">
      {/* DIUBAH: Kontainer dilebarkan untuk mengurangi space kosong */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 z-50">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10">
              <Image src="/logo-satuatap.png" alt="SatuAtap Logo" fill className="object-contain" sizes="(max-width: 640px) 36px, 40px" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight" style={{ color: COLORS.orange }}>
              satuatap
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-teal-600 transition-colors">Beranda</Link>
            <Link href="/user/cari-rumah" className="hover:text-teal-600 transition-colors">Cari Rumah</Link>
            <Link href="/user/simulasi" className="hover:text-teal-600 transition-colors">Simulasi</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/user/login" className="hidden md:block" passHref>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-md" style={{ backgroundColor: COLORS.darkTeal }}>
                Login
              </motion.button>
            </Link>
            <div className="md:hidden z-50">
              <motion.button aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)} whileTap={{ scale: 0.9 }}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)} />
        )}
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "-50%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="absolute top-0 left-0 w-full bg-white shadow-lg pt-24 pb-12 px-8 md:hidden">
            <nav className="flex flex-col items-center gap-8 text-lg font-medium">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Beranda</Link>
              <Link href="/user/cari-rumah" onClick={() => setIsMenuOpen(false)}>Cari Rumah</Link>
              <Link href="/user/simulasi" onClick={() => setIsMenuOpen(false)}>Simulasi</Link>
              <Link href="/user/login" passHref>
                <motion.button className="w-full max-w-xs px-8 py-3 mt-4 rounded-full text-white font-medium shadow-md" style={{ backgroundColor: COLORS.darkTeal }}>
                  Login
                </motion.button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.lime}, ${COLORS.orange})` }} />
    </header>
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

/* --------------------------- FOOTER --------------------------- */
function Footer() {
  return (
    <footer className="bg-[#FF8500] text-white">
      {/* DIUBAH: Kontainer dilebarkan untuk mengurangi space kosong */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="text-sm">
            <h5 className="font-bold text-lg mb-4">satuatap</h5>
            <p className="opacity-90 leading-relaxed max-w-sm">
              PT Bank Negara Indonesia (Persero) Tbk berkomitmen memberikan layanan KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity"><Facebook /></Link>
              <Link href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity"><Instagram /></Link>
              <Link href="#" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity"><Linkedin /></Link>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-5 text-lg">Layanan</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/user/pengajuan" className="hover:underline">Pengajuan KPR</Link></li>
              <li><Link href="/user/simulasi" className="hover:underline">Simulasi Kredit</Link></li>
              <li><Link href="/user/cari-rumah" className="hover:underline">Cari Properti</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-5 text-lg">Hubungi Kami</h5>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><Phone size={18} /> <span>1500046</span></li>
              <li className="flex items-center gap-3"><Mail size={18} /> <span>kpr@bni.co.id</span></li>
              <li className="flex items-start gap-3">
                <MapPin size={24} className="mt-1 flex-shrink-0"/>
                <span>Jl. Jenderal Sudirman Kav. 1<br />Jakarta Pusat 10220, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center sm:text-left">
          <p className="text-xs opacity-80">&copy; {new Date().getFullYear()} satuatap by BNI. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}