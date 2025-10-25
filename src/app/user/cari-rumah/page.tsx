"use client";

import { useState, useMemo, ReactNode } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, BedDouble, Bath, Home as HomeIcon, Heart } from "lucide-react";
import { motion } from 'framer-motion';

import { allHouses, House } from "@/app/lib/propertyData";

const ITEMS_PER_PAGE = 9;

const COLORS = {
    lime: "#DDEE59",
    orange: "#FF8500",
    teal: "#3FD8D4",
    'bni-orange': '#FF8500',
    'bni-teal': '#3FD8D4',
    'bni-dark-blue': '#003366', 
    'bni-gray': '#6B7280', 
};

export default function CariRumahPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '', location: '', type: '', budget: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([2, 4]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleToggleFavorite = (houseId: number) => {
    if (!isLoggedIn) {
      alert('Silakan login untuk menyimpan favorit.');
      return;
    }
    setFavorites(prev =>
      prev.includes(houseId)
        ? prev.filter(id => id !== houseId)
        : [...prev, houseId]
    );
    console.log("Favorit diupdate:", favorites.includes(houseId) ? favorites.filter(id => id !== houseId) : [...favorites, houseId]);
  };

  const handleAjukan = (house: House) => {
    const params = new URLSearchParams({
      propertiId: house.id.toString(),
      propertiNama: house.title,
      hargaProperti: house.price.toString(),
    });
    router.push(`/user/pengajuan?${params.toString()}`);
  };

  const locationOptions = useMemo(() => Array.from(new Set(allHouses.map(h => h.city))), []);
  const typeOptions = ['Rumah', 'Apartemen'];
  const budgetOptions = [
    { label: '< Rp 1 Miliar', value: '0-1000000000' },
    { label: 'Rp 1 M - 2 M', value: '1000000000-2000000000' },
    { label: 'Rp 2 M - 5 M', value: '2000000000-5000000000' },
    { label: '> Rp 5 Miliar', value: '5000000000' },
  ];

  const filteredHouses = useMemo(() => {
    return allHouses.filter(house => {
      const simplePropertyType = house.property_type === 'Apartemen' ? 'Apartemen' : 'Rumah';
      const nameMatch = filters.name ? house.title.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const locationMatch = filters.location ? house.city === filters.location : true;
      const typeMatch = filters.type ? simplePropertyType === filters.type : true;
      const budgetMatch = (() => {
        if (!filters.budget) return true;
        const [minStr, maxStr] = filters.budget.split('-');
        const min = parseInt(minStr, 10);
        const max = maxStr ? parseInt(maxStr, 10) : null;
        if (max) return house.price >= min && house.price <= max;
        return house.price >= min;
      })();
      return nameMatch && locationMatch && typeMatch && budgetMatch;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredHouses.length / ITEMS_PER_PAGE);
  const currentHouses = filteredHouses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="mb-12 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Eksplor Rumah Impian</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Cari Rumah</label>
            <input type="text" name="name" placeholder="Nama Rumah Impianmu" value={filters.name} onChange={handleFilterChange} className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-bni-orange focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Lokasi</label>
            <div className="relative">
              <select name="location" value={filters.location} onChange={handleFilterChange} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-bni-orange focus:outline-none">
                <option value="">Semua Lokasi</option>
                {locationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Tipe</label>
            <div className="relative">
              <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-bni-orange focus:outline-none">
                <option value="">Semua Tipe</option>
                {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Rentang Harga</label>
            <div className="relative">
              <select name="budget" value={filters.budget} onChange={handleFilterChange} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-bni-orange focus:outline-none">
                <option value="">Semua Harga</option>
                {budgetOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section>
        {currentHouses.length > 0 ? (
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
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 sm:gap-4">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-button">Sebelumnya</button>
                <span className="text-sm text-gray-700"> Hal <strong>{currentPage}</strong> dari <strong>{totalPages}</strong></span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-button">Selanjutnya</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 col-span-full">
            <h3 className="text-2xl font-bold text-bni-dark-blue">Tidak ada rumah yang cocok.</h3>
            <p className="mt-2 text-bni-gray">Silakan ubah kriteria pencarian Anda.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function HouseCard({ house, isFavorite, onToggleFavorite, onAjukan }: {
  house: House;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAjukan: () => void;
}) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(house.price);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col"
    >
      <div
        className="relative w-full aspect-[4/3] min-h-[160px] sm:min-h-[180px] lg:min-h-[220px] max-h-[260px]"
      >
        <Image
          src={house.image}
          alt={house.title}
          fill
          priority={false}
          className="object-cover rounded-t-xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <button
          onClick={() => onToggleFavorite(house.id)}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-1.5 rounded-full transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Toggle Favorite"
        >
          <Heart
            size={20}
            className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 fill-transparent'}
            strokeWidth={isFavorite ? 2 : 1.5}
          />
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
          {house.city}, {house.province}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-600 mt-3 border-t pt-3">
          <div className="flex items-center gap-1"><BedDouble size={14} /> {house.bedrooms} KT</div>
          <div className="flex items-center gap-1"><Bath size={14} /> {house.bathrooms} KM</div>
          <div className="flex items-center gap-1"><HomeIcon size={14} /> {house.building_area} m²</div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Harga mulai</p>
          <p className="text-xl font-bold text-bni-orange">{formattedPrice}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex-grow flex items-end">
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onAjukan}
              className="py-2.5 rounded-lg font-semibold text-sm text-white shadow transition hover:opacity-90"
              style={{ backgroundColor: "#FF8500" }}
            >
              Ajukan
            </button>
            <Link
              href={`/user/detail-rumah/${house.id}`}
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
