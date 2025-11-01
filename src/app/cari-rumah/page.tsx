"use client";

import { useState, useMemo, ReactNode, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  MapPin,
  BedDouble,
  Bath,
  Home as HomeIcon,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

import { fetchPropertyList,toggleFavorite } from "@/app/lib/coreApi";
import type { PropertyListItem } from "@/app/lib/types";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
const ITEMS_PER_PAGE = 9;

export default function CariRumahPage() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    name: "",
    location: "",
    type: "",
    budget: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn,setIsLoggedIn] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [items, setItems] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const userString = localStorage.getItem("user");
  const [userData, setUserData] = useState<{ id: number | string } | null>(null);
  useEffect(() => {
      const userString = localStorage.getItem("user");      
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setUserData(user);
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Gagal parse data user dari localStorage", e);
          localStorage.removeItem("user");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }, []);
  const debouncedSearchName = useDebounce(filters.name, 500);
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const priceRange = parseBudget(filters.budget);
        const { items } = await fetchPropertyList({
          name: debouncedSearchName || undefined,
          city: filters.location || undefined,
          tipeProperti: filters.type ? filters.type.toUpperCase() : undefined,
          priceMin: priceRange?.min,
          priceMax: priceRange?.max,
        });
        setItems(items);
      } catch (e: any) {
        setError(e.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    })();
    // }, [filters.name, filters.location, filters.type, filters.budget]);
  }, [debouncedSearchName, filters.location, filters.type, filters.budget]);
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

const handleToggleFavorite = async (houseId: number) => {
    if (!isLoggedIn || !userData) { 
      alert("Silakan login untuk menyimpan favorit.");
      return;
    }

    const userId = userData.id;

    if (!userId) {
        alert("Sesi pengguna tidak ditemukan (ID tidak ada), silakan login kembali.");
        return;
    }

    try {
      const response = await toggleFavorite(userId, houseId);

      if (response.success) {
        const status = response.data.status;
        
        if (status === "added") {
          setFavorites((prev) => [...prev, houseId]);
        } else if (status === "removed") {
          setFavorites((prev) => prev.filter((id) => id !== houseId));
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi saat mengubah favorit.");
    }
  };
  const handleAjukan = (house: PropertyListItem) => {
    const params = new URLSearchParams({
      propertiId: String(house.id),
      propertiNama: house.title,
      hargaProperti: String(house.price),
    });
    router.push(`/user/pengajuan?${params.toString()}`);
  };

  const locationOptions = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => i.city && s.add(i.city));
    return Array.from(s);
  }, [items]);

  const typeOptions = ["Rumah", "Apartemen"];
  const budgetOptions = [
    { label: "< Rp 1 Miliar", value: "0-1000000000" },
    { label: "Rp 1 M - 2 M", value: "1000000000-2000000000" },
    { label: "Rp 2 M - 5 M", value: "2000000000-5000000000" },
    { label: "> Rp 5 Miliar", value: "5000000000" },
  ];

  const filtered = items.filter((i) => {
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentHouses = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="mb-12">
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Eksplor Rumah Impian
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Cari Rumah
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nama Rumah Impianmu"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Lokasi
            </label>
            <div className="relative">
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Lokasi</option>
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Tipe
            </label>
            <div className="relative">
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Tipe</option>
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Rentang Harga
            </label>
            <div className="relative">
              <select
                name="budget"
                value={filters.budget}
                onChange={handleFilterChange}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Harga</option>
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="text-center py-20">Memuat data…</div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">{error}</div>
        ) : currentHouses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentHouses.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                  isFavorite={favorites.includes(house.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAjukan={() => handleAjukan(house)}
                />
              ))}
            </div>
            {
              // Show all aja jadi koboi
              /* {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Sebelumnya
                </button>
                <span className="text-sm text-gray-700">
                  Hal <strong>{currentPage}</strong> dari{" "}
                  <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Selanjutnya
                </button>
              </div>
            )} */
            }
          </>
        ) : (
          <div className="text-center py-20 col-span-full">
            <h3 className="text-2xl font-bold text-bni-dark-blue">
              Tidak ada rumah yang cocok.
            </h3>
            <p className="mt-2 text-bni-gray">
              Silakan ubah kriteria pencarian Anda.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function parseBudget(v: string) {
  if (!v) return null;
  const [minStr, maxStr] = v.split("-");
  const min = parseInt(minStr, 10);
  const max = maxStr ? parseInt(maxStr, 10) : undefined;
  return {
    min: isNaN(min) ? undefined : min,
    max: isNaN(Number(max)) ? undefined : max,
  };
}

function HouseCard({
  house,
  isFavorite,
  onToggleFavorite,
  onAjukan,
}: {
  house: PropertyListItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAjukan: () => void;
}) {
  const router = useRouter();
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(house.price);

  const goToDetail = () => router.push(`/detail-rumah/${house.id}`);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={goToDetail}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col cursor-pointer"
    >
      <div className="relative w-full aspect-[4/3] min-h-[160px] sm:min-h-[180px] lg:min-h-[220px] max-h-[260px]">
        <Image
          src={house.main_image || "/placeholder.png"}
          alt={house.title}
          fill
          priority={false}
          className="object-cover rounded-t-xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(house.id);
          }}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-1.5 rounded-full transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Toggle Favorite"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            className={
              isFavorite
                ? "fill-red-500 text-red-500"
                : "fill-transparent text-gray-600"
            }
          >
            <path d="M12 21s-6.716-4.438-9.333-7.056C.517 11.794.5 9.5 2.1 7.9c1.6-1.6 4.2-1.6 5.8 0L12 12l4.1-4.1c1.6-1.6 4.2-1.6 5.8 0 1.6 1.6 1.583 3.894-.567 6.044C18.716 16.562 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-semibold text-bni-orange uppercase tracking-wider">
          {house.property_type}
        </p>
        <h3 className="font-bold text-gray-800 text-lg truncate mt-1">
          {house.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          {house.city}
        </p>
        <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 mt-3 border-t pt-3 min-h-[44px]">
          {" "}
          {house.parsedFeatures.length > 0 ? (
            house.parsedFeatures.slice(0, 3).map((feature) => (
              <div key={feature.key} className="flex flex-col items-start">
                <span className="font-semibold text-sm text-gray-800">
                  {feature.value}
                </span>
                <span className="text-gray-500">{feature.key}</span>{" "}
              </div>
            ))
          ) : (
            <span className="text-gray-400 col-span-3 text-center">
              Fitur tidak tersedia
            </span>
          )}{" "}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Harga mulai</p>
          <p className="text-xl font-bold text-bni-orange">{formattedPrice}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex-grow flex items-end">
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAjukan();
              }}
              className="py-2.5 rounded-lg font-semibold text-sm text-white shadow transition hover:opacity-90"
              style={{ backgroundColor: "#FF8500" }}
            >
              Ajukan
            </button>
            <Link
              href={`/detail-rumah/${house.id}`}
              onClick={(e) => e.stopPropagation()}
              className="py-2.5 rounded-lg font-semibold text-sm text-center text-gray-900 shadow transition hover:opacity-90"
              style={{ backgroundColor: "#DDEE59" }}
            >
              Detail
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
