"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, Trash2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type WishItem = {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
};

export default function WishlistContent() {
  const [wishlist, setWishlist] = useState<WishItem[]>([
    {
      id: 1,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000.000",
      image: "/rumah-1.jpg",
    },
    {
      id: 2,
      name: "Bukit Permata Residence",
      location: "Bogor, Jawa Barat",
      price: "Rp 980.000.000",
      image: "/rumah-4.jpg",
    },
  ]);

  const toggleWishlist = (id: number) =>
    setWishlist((prev) => prev.filter((item) => item.id !== id));

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Wishlist
          </h2>
          <p className="text-sm text-gray-500">
            Simpan properti favoritmu untuk dilihat kembali nanti.
          </p>
        </div>
        {wishlist.length > 0 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {wishlist.length} item
          </span>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 grid place-items-center">
            <Heart className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Belum ada rumah di wishlist
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Jelajahi daftar rumah dan tekan ikon hati untuk menyimpan.
          </p>
          <Link
            href="/user/cari-rumah"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-bni-orange px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95"
          >
            Cari Rumah
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((house) => (
              <motion.div
                key={house.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-transparent transition-all hover:shadow-lg hover:ring-gray-200"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={house.image}
                    alt={house.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    priority={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90" />

                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-900 shadow backdrop-blur-sm">
                    {house.price}
                  </div>

                  <button
                    onClick={() => toggleWishlist(house.id)}
                    aria-label="Hapus dari wishlist"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-red-500 shadow backdrop-blur-sm transition hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
                      Favorit
                    </span>
                  </div>

                  <h3 className="line-clamp-1 text-base font-bold text-gray-900">
                    {house.name}
                  </h3>
                  <p className="mt-1 flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                    <span className="line-clamp-1">{house.location}</span>
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/user/detail-rumah/${house.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </Link>
                    <Link
                      href={`/user/pengajuan?propertiId=${
                        house.id
                      }&propertiNama=${encodeURIComponent(
                        house.name
                      )}&hargaProperti=${encodeURIComponent(house.price)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-bni-orange px-3 py-2 text-sm font-semibold text-white shadow transition hover:brightness-95"
                    >
                      <Heart className="h-4 w-4 fill-white" />
                      Ajukan
                    </Link>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-200 via-teal-200 to-orange-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
