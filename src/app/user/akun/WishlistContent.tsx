"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUserFavorites, toggleFavorite } from "@/app/lib/coreApi";

type DisplayFavorite = {
  propertyId: number;
  title: string;
  location: string;
  priceText: string;
  imageUrl: string;
};

function formatCurrencyIDR(n: number | string | null | undefined): string {
  const val = typeof n === "number" ? n : Number(String(n || "0").replace(/[^0-9]/g, ""));
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
  } catch {
    return `Rp ${val.toLocaleString("id-ID")}`;
  }
}

function normalizeItem(item: any): DisplayFavorite {
  const propertyId = Number(
    item?.property_id ?? item?.propertyId ?? item?.id ?? 0
  );
  const title = String(item?.title ?? item?.name ?? item?.property_name ?? "Properti Tanpa Judul");
  const location = String(
    item?.city ?? item?.location ?? item?.address ?? item?.province ?? "Lokasi tidak tersedia"
  );
  const priceNum = Number(item?.price ?? item?.property_price ?? 0);
  const priceText = formatCurrencyIDR(priceNum);
  const imageUrl = String(
    item?.file_path ?? item?.filePath ?? item?.image_url ?? item?.image ?? "/rumah-1.jpg"
  );
  return { propertyId, title, location, priceText, imageUrl };
}

export default function WishlistContent() {
  const [wishlist, setWishlist] = useState<DisplayFavorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await fetchUserFavorites();
      if (!mounted) return;
      if (result.success) {
        const arr = Array.isArray(result.data) ? result.data : [];
        const normalized = arr.map(normalizeItem).filter((x) => x.propertyId > 0);
        setWishlist(normalized);
      } else {
        setError(result.message || "Gagal memuat favorit.");
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.max(1, Math.ceil(wishlist.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = wishlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleRemove = async (propertyId: number) => {
    try {
      const res = await toggleFavorite(propertyId);
      if (res.success) {
        const status = String(res.data?.status || "").toLowerCase();
        if (status === "removed" || status === "deleted") {
          setWishlist((prev) => prev.filter((it) => it.propertyId !== propertyId));
        } else if (status === "added") {
          // Optional: refetch to ensure consistency when server adds back
          const result = await fetchUserFavorites();
          if (result.success) {
            const arr = Array.isArray(result.data) ? result.data : [];
            setWishlist(arr.map(normalizeItem).filter((x) => x.propertyId > 0));
          }
        }
      } else {
        alert(res.message || "Gagal mengubah status favorit.");
      }
    } catch (e) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Favorit</h2>
          <p className="text-sm text-gray-500">Simpan properti favoritmu untuk dilihat kembali nanti.</p>
        </div>
        {wishlist.length > 0 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {wishlist.length} item
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-10 text-center text-sm text-gray-600">Memuat data favorit...</div>
      ) : error ? (
        (() => {
          const isNoFavorites = /no favorites/i.test(String(error));
          if (isNoFavorites) {
            return (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 grid place-items-center">
                  <Heart className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Belum Menyimpan Rumah Impian</h3>
                <p className="mt-1 text-sm text-gray-500">Jelajahi daftar rumah dan tekan ikon hati untuk menyimpan.</p>
                <Link href="/cari-rumah" className="mt-6 inline-flex items-center justify-center rounded-xl bg-bni-orange px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95">Cari Rumah Impian</Link>
              </div>
            );
          }
          return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 grid place-items-center">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Terjadi kesalahan</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
            </div>
          );
        })()
      ) : wishlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 grid place-items-center">
            <Heart className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Belum Menyimpan Rumah Impian</h3>
          <p className="mt-1 text-sm text-gray-500">Jelajahi daftar rumah dan tekan ikon hati untuk menyimpan.</p>
          <Link href="/cari-rumah" className="mt-6 inline-flex items-center justify-center rounded-xl bg-bni-orange px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95">Cari Rumah Impian</Link>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div key="grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((house) => (
              <motion.div
                key={house.propertyId}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-transparent transition-all hover:shadow-lg hover:ring-gray-200"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={house.imageUrl}
                    alt={house.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    priority={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90" />

                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase text-white shadow">
                    FAVORIT
                  </span>

                  <button
                    onClick={() => handleRemove(house.propertyId)}
                    aria-label="Hapus dari wishlist"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-red-500 shadow backdrop-blur-sm transition hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-base font-bold text-gray-900">{house.title}</h3>
                  <p className="mt-1 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                    <span className="line-clamp-1">{house.location}</span>
                  </p>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Harga mulai</p>
                    <p className="text-lg font-bold">
                      <span className="text-[#FF8500]">Rp</span>{" "}
                      <span className="text-[#FF8500]">{house.priceText.replace(/^Rp\s*/, "")}</span>
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/user/pengajuan?propertiId=${house.propertyId}&propertiNama=${encodeURIComponent(house.title)}&propertiLokasi=${encodeURIComponent(house.location)}&hargaProperti=${encodeURIComponent(house.priceText)}`}
                      className="py-2 rounded-lg font-semibold text-sm text-white shadow transition hover:opacity-90 text-center"
                      style={{ backgroundColor: "#FF8500" }}
                    >
                      Ajukan
                    </Link>
                    <Link
                      href={`/detail-rumah/${house.propertyId}`}
                      className="py-2 rounded-lg font-semibold text-sm text-center text-gray-900 shadow transition hover:opacity-90"
                      style={{ backgroundColor: "#DDEE59" }}
                    >
                      Detail
                    </Link>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#E6FCF9] via-[#3FD8D4] to-[#E6FCF9] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
          <div key="pagination" className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-500">Halaman {currentPage} dari {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
