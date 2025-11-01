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
    </main>
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
      icon: <Clock3 className="w-10 h-10 text-bni-orange" />,
      title: "Proses Cepat",
      desc: "Persetujuan kredit dalam 3-5 hari kerja dengan persyaratan yang mudah",
    },
    {
      icon: <Percent className="w-10 h-10 text-bni-orange" />,
      title: "Bunga Kompetitif",
      desc: "Suku bunga mulai dari 6.25% dengan opsi Pilihan tenor hingga 25 tahun",
    },
    {
      icon: <Wallet className="w-10 h-10 text-bni-orange" />,
      title: "Fleksibel",
      desc: "Berbagai pilihan produk KPR sesuai kebutuhan dan kemampuan finansial Anda",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Mengapa Memilih KPR BNI?
          </h2>
          <p className="mt-3 text-lg text-gray-500 max-w-3xl mx-auto">
            Dapatkan kemudahan dan keuntungan terbaik untuk kepemilikan rumah
            impian Anda!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{f.desc}</p>
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

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 sm:py-24" style={{ backgroundColor: "#FFFEEB" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Eksplor Rumah Impian
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Tersedia rumah dengan kualitas terbaik dari developer pilihan BNI
            </p>
          </div>

          <Link href="/cari-rumah" passHref>
            <button className="hidden sm:block border-2 border-[#FF8500] text-[#FF8500] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#FF8500]/10 transition">
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
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            <div
              ref={sliderRef}
              className="flex gap-8 overflow-x-auto pb-4 scroll-smooth scrollbar-hide px-10"
            >
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] snap-center"
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
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all cursor-pointer"
    >
      <div className="relative h-56 w-full flex items-center justify-center bg-white">
        <Image
          src={image}
          alt={title}
          width={340}
          height={224}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate">
          {title}
        </h3>
        <p className="flex items-center text-gray-600 mt-2 text-sm">
          <MapPin size={16} className="mr-1.5 text-gray-500" /> {location}
        </p>
        <p className="mt-4 text-2xl font-extrabold text-[#FF8500]">{price}</p>
      </div>
    </motion.div>
  );
}
