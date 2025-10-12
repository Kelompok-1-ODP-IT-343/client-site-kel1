"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock3,
  Percent,
  Wallet,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const COLORS = { teal: "#3FD8D4", gray: "#757575", orange: "#FF8500", lime: "#DDEE59" };

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image src="/logo-satuatap.png" alt="SatuAtap" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-xl text-[#FF8500]">satuatap</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link className="text-gray-700 hover:text-[#FF8500]" href="/">Beranda</Link>
            <Link className="text-gray-700 hover:text-[#FF8500]" href="/cari-rumah">Cari Rumah</Link>
            <Link className="text-gray-700 hover:text-[#FF8500]" href="/simulasi">Simulasi</Link>
          </nav>
          <UserBadge />
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-[#C5F3F3]">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Wujudkan Impian Rumah Anda
          </h1>
          <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
            KPR BNI dengan bunga kompetitif dan proses yang mudah
          </p>

          {/* CTA */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/pengajuan"
              className="rounded-xl px-5 py-3 text-white font-semibold shadow transition"
              style={{ backgroundColor: "#3FD8D4" }}
            >
              Ajukan KPR Sekarang
            </Link>
            <Link
              href="/simulasi"
              className="rounded-xl px-5 py-3 font-semibold border border-[#3FD8D4] bg-white hover:bg-gray-50 text-[#0f766e] transition"
            >
              Hitung Simulasi
            </Link>
          </div>

          {/* 3 fitur */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard icon={<Clock3 />} title="Proses Cepat" desc="Persetujuan kredit 3–5 hari kerja dengan syarat mudah." accent="#3FD8D4" />
            <FeatureCard icon={<Percent />} title="Bunga Kompetitif" desc="Suku bunga mulai 6.25% dengan tenor hingga 25 tahun." accent="#FF8500" />
            <FeatureCard icon={<Wallet />} title="Fleksibel" desc="Pilihan produk KPR sesuai kebutuhan dan finansial Anda." accent="#DDEE59" />
          </div>
        </div>
      </section>

      {/* EKSPLOR RUMAH IMPIAN */}
      <ExploreSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

function UserBadge() {
  const [user, setUser] = useState<{ name?: string; photo?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        const name = parsed?.name || parsed?.username || parsed?.fullName || "Pengguna";
        const photo = parsed?.photo || parsed?.photoURL || parsed?.avatar || undefined;
        setUser({ name, photo });
      } else if (token) {
        setUser({ name: "Pengguna", photo: undefined });
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  if (!user) {
    return (
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden px-5 py-2 rounded-full text-white text-sm shadow"
          style={{ backgroundColor: "#0f766e" }}
        >
          <motion.span
            initial={{ x: "-120%" }}
            animate={{ x: ["-120%", "120%"] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            className="pointer-events-none absolute inset-y-0 left-0 w-[120%] opacity-20"
            style={{ background: "linear-gradient(90deg, transparent, #fff, transparent)" }}
          />
          Login
        </motion.button>
      </Link>
    );
  }

  return (
    <Link href="/user/beranda" className="flex items-center gap-2">
      <div className="relative w-8 h-8 rounded-full overflow-hidden border">
        {user.photo ? (
          <Image src={user.photo} alt="Profile" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            {user.name?.charAt(0) || "U"}
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-gray-800">{user.name || "Pengguna"}</span>
    </Link>
  );
}

function FeatureCard({ icon, title, desc, accent }:{
  icon: React.ReactNode; title:string; desc:string; accent:string;
}) {
  return (
    <div
      className="rounded-2xl p-5 bg-white/80 backdrop-blur border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
      style={{ boxShadow: `0 10px 30px -12px ${accent}55` }}
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white shadow"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        {icon}
      </div>
      <h3 className="mt-3 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

/* =========================
   Eksplor Rumah Impian
   ========================= */
function ExploreSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      id: 1,
      title: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 456.500.000",
      image: "/rumah-1.png", // ganti sesuai asetmu
    },
    {
      id: 2,
      title: "Cluster Green Valley",
      location: "Margonda, Depok",
      price: "Rp 625.500.000",
      image: "/rumah-2.jpg",
    },
    {
      id: 3,
      title: "PONDOK TAKATAKAN",
      location: "Serang, Banten",
      price: "Rp 197.000.000",
      image: "/rumah-3.jpg",
    },
    {
      id: 4,
      title: "Bukit Permata",
      location: "Bogor, Jawa Barat",
      price: "Rp 520.000.000",
      image: "/rumah-4.jpg",
    },
  ];

  const scrollBy = (delta: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Judul + subjudul */}
        <div
          className="rounded-2xl p-6 md:p-7 mb-6"
          style={{ background: `linear-gradient(0deg, ${COLORS.lime}55, ${COLORS.lime}55), #F7FEE7` }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900">
            Eksplor Rumah Impian
          </h2>
          <p className="text-center text-sm text-gray-600 mt-1">
            Tersedia rumah dengan kualitas terbaik dari developer pilihan BNI
          </p>

          {/* Carousel kartu */}
          <div className="relative mt-4">
            <button
              aria-label="prev"
              onClick={() => scrollBy(-320)}
              className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border bg-white shadow hover:bg-gray-50 items-center justify-center"
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="next"
              onClick={() => scrollBy(320)}
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border bg-white shadow hover:bg-gray-50 items-center justify-center"
            >
              <ChevronRight />
            </button>

            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 pb-2"
            >
              {items.map((it) => (
                <PropertyCard key={it.id} {...it} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({
  title,
  location,
  price,
  image,
}: {
  title: string;
  location: string;
  price: string;
  image: string;
}) {
  return (
    <div className="min-w-[260px] max-w-[280px] snap-start bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-36 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 leading-snug">{title}</h4>
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">Harga mulai</div>
        <div className="font-extrabold text-gray-900">{price}</div>
      </div>
    </div>
  );
}

/* =========================
   Footer
   ========================= */
function Footer() {
  return (
    <footer className="mt-6" style={{ background: COLORS.orange }}>
      <div className="max-w-7xl mx-auto px-4 py-10 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Deskripsi */}
          <div className="text-sm leading-relaxed">
            <p className="opacity-95">
              PT Bank Negara Indonesia (Persero) Tbk adalah bank BUMN terbesar di Indonesia.
              Kami berkomitmen memberikan layanan KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
            <div className="flex items-center gap-3 mt-4 opacity-90">
              <a className="hover:opacity-100" href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a className="hover:opacity-100" href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a className="hover:opacity-100" href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h5 className="font-semibold mb-3 text-base">Layanan</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pengajuan" className="hover:underline">Pengajuan</Link></li>
              <li><Link href="/simulasi" className="hover:underline">Simulasi</Link></li>
              <li><Link href="/cari-rumah" className="hover:underline">Cari Rumah</Link></li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h5 className="font-semibold mb-3 text-base">Hubungi Kami</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={16} /> 1500046</li>
              <li className="flex items-center gap-2"><Mail size={16} /> kpr@bni.co.id</li>
              <li className="leading-relaxed">
                Jl. Jenderal Sudirman Kav. 1<br/>Jakarta Pusat 10220
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.lime})` }} />
    </footer>
  );
}
