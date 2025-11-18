"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock3,
  Percent,
  Wallet,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { fetchPropertyList } from "@/app/lib/coreApi";
import type { PropertyListItem } from "@/app/lib/types";
import { API_BASE_URL } from "@/app/lib/apiConfig";

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
})();

function absoluteImg(src?: string | null) {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return `${API_ORIGIN}${src}`;
  return src;
}

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

const COLORS = {
  primary: "#FF8500",
  teal: "#3FD8D4",
  bgLime: "#F9FEE7",
  darkTeal: "#0f766e",
};

export default function BerandaPage() {
  const [items, setItems] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { items } = await fetchPropertyList({});
        setItems(items.slice(0, 8));
      } catch (e: any) {
        setErr(e?.message || "Gagal memuat properti");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="flex-1">
      <HeroSection />
      <FeatureSection />
      <ExploreSection items={items} loading={loading} error={err} />

      <FloatingTantiAI />  
    </main>
  );
}

function FloatingTantiAI() {
  return (
    <button
      onClick={() =>
        window.open("https://wa.me/628561310609", "_blank")
      }
      className="
        fixed bottom-10 right-6 z-50 flex items-center gap-2
        bg-[#FF8500] text-white font-semibold shadow-lg
        rounded-full px-4 py-2.5
        hover:bg-[#ff7300] transition-all
        hover:scale-[1.05]
      "
    >
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5 text-[#FF8500]'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 8h10M7 12h6m-6 4h8m-4 4l-4-4H5a2 2 0 01-2-2V6c0-1.1.9-2 2-2h14a2 2 0 012 2v10c0 1.1-.9 2-2 2h-3l-3 4z'
          />
        </svg>
      </div>

      <span className="hidden sm:block text-sm">
        Tanya KPR yuk ke Tanti AI!
      </span>
    </button>
  );
}



function HeroSection() {
  return (
    <section className="bg-[#E0F7F5] py-20 sm:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight"
        >
          Wujudkan Impian Rumah Anda
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
        >
          KPR BNI dengan bunga kompetitif dan proses yang mudah
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href="/cari-rumah" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors hover:bg-teal-600"
            >
              Ajukan KPR Sekarang
            </motion.button>
          </Link>
          <Link href="/simulasi" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-teal-700 font-semibold py-3 px-8 rounded-lg border-2 border-teal-500 transition-colors hover:bg-teal-50"
            >
              Hitung Simulasi
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureSection() {
  const features = [
    {
      icon: <Clock3 className="w-9 h-9 text-bni-orange" />,
      title: "Proses Cepat",
      desc: "Persetujuan kredit dalam 3-5 hari kerja dengan persyaratan yang mudah",
    },
    {
      icon: <Percent className="w-9 h-9 text-bni-orange" />,
      title: "Bunga Kompetitif",
      desc: "Suku bunga mulai dari 6.25% dengan opsi Pilihan tenor hingga 25 tahun",
    },
    {
      icon: <Wallet className="w-9 h-9 text-bni-orange" />,
      title: "Fleksibel",
      desc: "Berbagai pilihan produk KPR sesuai kebutuhan dan kemampuan finansial Anda",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Mengapa Memilih KPR BNI?
          </h2>
          <p className="mt-3 text-lg text-gray-500 max-w-3xl mx-auto">
            Dapatkan kemudahan dan keuntungan terbaik untuk kepemilikan rumah
            impian Anda!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 justify-items-stretch">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-7 text-center shadow-lg border border-gray-100 w-full"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-[0.9rem] text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExploreSection({
  items,
  loading,
  error,
}: {
  items: PropertyListItem[];
  loading: boolean;
  error: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dotCount, setDotCount] = useState(1);
  const [activeDot, setActiveDot] = useState(0);
  const autoplayIdRef = useRef<number | null>(null);

  // Helper untuk menghitung lebar 1 langkah scroll (lebar kartu + gap)
  const getStep = () => {
    const el = sliderRef.current;
    if (!el) return 272; // fallback width after 80% scaling
    const firstChild = el.firstElementChild as HTMLElement | null;
    const width = firstChild?.clientWidth ?? 272;
    // Ambil gap dari flex container (Tailwind gap-8 ~= 2rem => 32px)
    const gapStr = getComputedStyle(el).gap || getComputedStyle(el).columnGap || "0";
    const gap = Number.parseFloat(gapStr) || 24; // gap-6 ~= 24px
    return width + gap;
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const step = getStep();
      const scrollAmount = direction === "left" ? -step : step;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Hitung jumlah dot dan indeks aktif berdasarkan posisi scroll
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const update = () => {
      const step = getStep();
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const total = maxScroll > 0 ? Math.floor(maxScroll / step) + 1 : 1;
      setDotCount(total);
      setActiveDot(Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / step))));
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const onResize = () => update();
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", update as EventListener);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  // Autoplay: geser otomatis setiap 5 detik, kembali ke awal saat mencapai akhir
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const tick = () => {
      const step = getStep();
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const nearEnd = el.scrollLeft >= maxScroll - 2;
      const nextLeft = nearEnd ? 0 : Math.min(el.scrollLeft + step, maxScroll);
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    };
    autoplayIdRef.current = window.setInterval(tick, 5000);
    return () => {
      if (autoplayIdRef.current) {
        clearInterval(autoplayIdRef.current);
        autoplayIdRef.current = null;
      }
    };
  }, [items]);

  return (
    <section className="py-20 sm:py-24" style={{ backgroundColor: "#FFFEEB" }}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              Eksplor Rumah Impian
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Tersedia rumah dengan kualitas terbaik dari developer pilihan BNI
            </p>
          </div>

          <Link href="/cari-rumah" passHref>
            <button className="hidden sm:block border-2 border-teal-600 text-teal-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-50 transition">
              Lihat Semua
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Memuat properti…</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Belum ada properti yang bisa ditampilkan.
          </div>
        ) : (
          <div className="relative">
            {/* Arrow buttons removed as requested */}

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar px-0"
            >
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex-shrink-0 w-[240px] sm:w-[272px] snap-center"
                >
                  <PropertyCard
                    id={it.id}
                    title={it.title}
                    location={it.city ?? "-"}
                    price={formatIDR(it.price)}
                    image={absoluteImg(it.main_image)}
                  />
                </div>
              ))}
            </div>

            {/* Dots indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: dotCount }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Halaman ${i + 1}`}
                  onClick={() => {
                    const el = sliderRef.current;
                    if (!el) return;
                    const step = getStep();
                    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
                    const target = Math.min(i * step, maxScroll);
                    el.scrollTo({ left: target, behavior: "smooth" });
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeDot ? "bg-[#FF8500] w-6" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PropertyCard({
  id,
  title,
  location,
  price,
  image,
}: {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/detail-rumah/${id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-teal-300 overflow-hidden transition-all cursor-pointer"
    >
      <div className="relative h-44 w-full flex items-center justify-center bg-white">
        <Image
          src={image}
          alt={title}
          width={272}
          height={180}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
          {title}
        </h3>
        <p className="flex items-center text-gray-600 mt-2 text-xs">
          <MapPin size={14} className="mr-1.5 text-gray-500" /> {location}
        </p>
        <p className="mt-4 text-xl font-extrabold">
          <span className="text-[#FF8500]">Rp</span>{" "}
          <span className="text-[#FF8500]">{price.replace(/^Rp\s*/, "")}</span>
        </p>
      </div>
    </motion.div>
  );
}
