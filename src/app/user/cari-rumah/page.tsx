// src/app/user/cari-rumah/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { allHouses, House } from "@/app/lib/propertyData"; // Impor data terpusat

const FilterInput = ({ label, placeholder }: { label: string; placeholder: string }) => (
    <div><label className="text-sm font-medium text-gray-600 mb-2 block">{label}</label><div className="relative"><input type="text" placeholder={placeholder} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-bni-teal focus:outline-none" />{['Lokasi', 'Tipe', 'Rentang Harga'].includes(label) && (<ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />)}</div></div>
);

export default function CariRumahPage() {
  const router = useRouter();

  // Fungsi untuk redirect ke form pengajuan
  const handleAjukan = (house: House) => {
    const params = new URLSearchParams({
      propertiId: house.id.toString(),
      propertiNama: house.name,
      propertiLokasi: house.location,
      hargaProperti: house.price.toString(),
    });
    router.push(`/user/pengajuan?${params.toString()}`);
  };

  return (
    <div className="bg-brand-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Eksplor Rumah Impian</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterInput label="Cari Rumah" placeholder="Nama Rumah Impianmu" />
            <FilterInput label="Lokasi" placeholder="Lokasi" />
            <FilterInput label="Tipe" placeholder="Tipe Rumah" />
            <FilterInput label="Rentang Harga" placeholder="+1.000.000.000" />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allHouses.map((house) => (
              <div key={house.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div className="p-4">
                  <div className="relative h-48 w-full mb-4">
                    <Image src={house.image} alt={house.name} fill className="object-cover rounded-lg" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg truncate">{house.name}</h3>
                  <p className="text-sm text-gray-500">{house.location}</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Harga mulai</p>
                    <p className="text-xl font-bold text-bni-orange">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(house.price)}
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => handleAjukan(house)} className="py-2.5 rounded-lg font-semibold text-sm text-white bg-bni-orange shadow hover:bg-orange-600 transition">
                      Ajukan
                    </button>
                    <Link href={`/user/detail-rumah/${house.id}`} className="py-2.5 rounded-lg font-semibold text-sm text-center text-gray-900 bg-yellow-400 shadow hover:bg-yellow-500 transition">
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}