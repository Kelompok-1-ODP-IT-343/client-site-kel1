// src/app/user/detail-rumah/[id]/page.tsx

"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Home, CreditCard, ChevronRight, BedDouble, Bath, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { allHouses } from '@/app/lib/propertyData';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const houseId = parseInt(params.id, 10);
  const house = allHouses.find(h => h.id === houseId);

  if (!house) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Properti tidak ditemukan.</h1>
      </main>
    );
  }
  
  const handleAjukanKPR = () => {
    const urlParams = new URLSearchParams({
      propertiId: house.id.toString(),
      propertiNama: house.name,
      propertiLokasi: house.location,
      hargaProperti: house.price.toString(),
    });
    router.push(`/user/pengajuan?${urlParams.toString()}`);
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(house.price);

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/user/cari-rumah" className="hover:underline">Cari Rumah</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-semibold text-gray-700">Detail Rumah</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{house.name}</h1>
        <p className="mt-1 text-gray-600 flex items-center gap-1.5"><MapPin size={16} /> {house.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card title="Galeri Properti" icon={<Home />}>
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
              <Image src={house.image} alt={house.name} fill className="object-cover" />
            </div>
          </Card>
          <Card title="Deskripsi & Spesifikasi" icon={<FileText />}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Deskripsi</h3>
            <p className="text-gray-600 mb-6">{house.description}</p>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Spesifikasi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 text-sm">
              <InfoItem label="Kamar Tidur" value={house.specs.bedrooms} icon={<BedDouble size={16} />} />
              <InfoItem label="Kamar Mandi" value={house.specs.bathrooms} icon={<Bath size={16} />} />
              <InfoItem label="Luas Tanah" value={`${house.specs.land_area} m²`} />
              <InfoItem label="Luas Bangunan" value={`${house.specs.building_area} m²`} />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-8">
          <div className="sticky top-24">
            <Card title="Harga Properti" icon={<CreditCard />}>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-bni-orange">{formattedPrice}</p>
              </div>
            </Card>
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 text-center">Siap Mengajukan KPR?</h3>
              <p className="text-center text-sm text-gray-600 mt-1">Lanjutkan ke proses pengajuan untuk properti ini.</p>
              <button onClick={handleAjukanKPR} className="mt-4 w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-all">
                Ajukan KPR Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// === KOMPONEN REUSABLE ===
const Card = ({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode; }) => ( <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="flex items-center gap-3 mb-5 border-b pb-3"><div className="text-bni-orange">{icon}</div><h2 className="text-lg font-bold text-gray-800">{title}</h2></div>{children}</motion.div> );
const InfoItem = ({ label, value, icon }: { label: string; value?: string | number; icon?: ReactNode }) => ( <div className="flex items-start gap-2">{icon && <div className="text-gray-600 mt-0.5">{icon}</div>}<div><p className="text-xs text-gray-500">{label}</p>{value && <p className="font-semibold text-gray-800">{value}</p>}</div></div> );