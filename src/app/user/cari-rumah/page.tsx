'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Pastikan path ini benar sesuai struktur folder Anda
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import FilterBar from '@/app/components/cari-rumah/FilterBar';
import HouseList from '@/app/components/cari-rumah/HouseList';
import Pagination from '@/app/components/cari-rumah/Pagination';

export type House = {
  id: number;
  property_type: 'Cluster' | 'Apartemen' | 'Rumah Tinggal' | 'Townhouse';
  title: string;
  description: string;
  address: string;
  sub_district: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  land_area: number;
  building_area: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garage: number;
  year_built: number;
  price: number;
  image: string;
};

const allHouses: House[] = [
    { id: 1, property_type: 'Cluster', title: 'Cluster Green Valley', description: 'Hunian asri di tengah kota...', address: 'Jl. Boulevard Raya No. 1', sub_district: 'Pagedangan', district: 'Serpong', city: 'Tangerang Selatan', province: 'Banten', postal_code: '15339', land_area: 120, building_area: 90, bedrooms: 3, bathrooms: 2, floors: 2, garage: 1, year_built: 2022, price: 1500000000, image: '/rumah-1.jpg' },
    { id: 2, property_type: 'Rumah Tinggal', title: 'Rumah Klasik Menteng', description: 'Lokasi premium di jantung Jakarta...', address: 'Jl. Teuku Umar No. 20', sub_district: 'Menteng', district: 'Menteng', city: 'Jakarta Pusat', province: 'DKI Jakarta', postal_code: '10310', land_area: 300, building_area: 250, bedrooms: 5, bathrooms: 4, floors: 2, garage: 2, year_built: 2018, price: 25000000000, image: '/rumah-2.jpg' },
    { id: 3, property_type: 'Apartemen', title: 'The Peak Apartment', description: 'Apartemen mewah...', address: 'Jl. Jenderal Sudirman Kav. 52-53', sub_district: 'Kebayoran Baru', district: 'Senayan', city: 'Jakarta Selatan', province: 'DKI Jakarta', postal_code: '12190', land_area: 0, building_area: 120, bedrooms: 2, bathrooms: 2, floors: 1, garage: 1, year_built: 2020, price: 4500000000, image: '/rumah-3.jpg' },
    { id: 4, property_type: 'Cluster', title: 'Citra Garden Bintaro', description: 'Kawasan terpadu...', address: 'Jl. Bintaro Utama Sektor 9', sub_district: 'Pondok Aren', district: 'Bintaro', city: 'Tangerang Selatan', province: 'Banten', postal_code: '15229', land_area: 90, building_area: 75, bedrooms: 3, bathrooms: 2, floors: 2, garage: 1, year_built: 2023, price: 1200000000, image: '/rumah-4.jpg' },
];

const ITEMS_PER_PAGE = 8; // Menampilkan lebih banyak item per halaman

export default function CariRumahPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ name: '', location: '', type: '', budget: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([2, 4]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handleToggleFavorite = (houseId: number) => {
    if (!isLoggedIn) {
      alert('Silakan login untuk menyimpan favorit.');
      // router.push('/login');
      return;
    }
    setFavorites(prev =>
      prev.includes(houseId)
        ? prev.filter(id => id !== houseId)
        : [...prev, houseId]
    );
  };

  const filteredHouses = useMemo(() => {
    return allHouses.filter(house => {
      const nameMatch = house.title.toLowerCase().includes(filters.name.toLowerCase());
      const locationMatch = filters.location ? house.city === filters.location : true;
      const typeMatch = filters.type ? house.property_type === filters.type : true;
      const budgetMatch = (() => {
        if (!filters.budget) return true;
        const [min, max] = filters.budget.split('-').map(Number);
        return max ? house.price >= min && house.price <= max : house.price >= min;
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
    <div className="min-h-screen flex flex-col bg-gray-50 antialiased">
      <Header />
      <main className="flex-1">
        <section className="bg-[#E0F7F5] py-12 lg:py-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bni-dark-blue">
                Temukan Properti Impian Anda
              </h1>
              <p className="mt-3 text-base sm:text-lg text-bni-gray max-w-2xl mx-auto">
                Gunakan filter di bawah untuk menemukan rumah yang sesuai dengan kriteria Anda.
              </p>
            </div>
            <FilterBar filters={filters} onFilterChange={handleFilterChange} houses={allHouses} />
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <HouseList
              houses={currentHouses}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            {filteredHouses.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}