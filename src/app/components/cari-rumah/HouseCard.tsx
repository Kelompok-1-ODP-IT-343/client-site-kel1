import Image from 'next/image';
import { MapPin, BedDouble, Bath, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import type { House } from '@/app/lib/propertyData';
import Link from 'next/link';

type HouseCardProps = {
  house: House;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export default function HouseCard({ house, isFavorite, onToggleFavorite }: HouseCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(house.price);

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-lg border overflow-hidden group cursor-pointer">
      <div className="relative h-56 w-full">
        <Image src={house.image} alt={house.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(house.id); }}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full transition hover:bg-white"
          aria-label="Toggle Favorite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`} fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold text-bni-orange">{house.property_type}</p>
        <h3 className="font-bold text-gray-900 text-xl mt-1 truncate">{house.title}</h3>
        <p className="flex items-center text-gray-600 mt-1 text-sm"><MapPin size={16} className="mr-1.5 flex-shrink-0" /> {house.city}, {house.province}</p>
        <div className="flex items-center justify-between text-sm text-gray-700 mt-4 border-t pt-4">
          <div className="flex items-center gap-1"><BedDouble size={16}/> {house.bedrooms}</div>
          <div className="flex items-center gap-1"><Bath size={16}/> {house.bathrooms}</div>
          <div className="flex items-center gap-1"><Home size={16}/> {house.building_area} m²</div>
        </div>
        <p className="mt-4 text-2xl font-extrabold text-bni-dark-blue">{formattedPrice}</p>
          <Link href={`/user/detail-pengajuan/${house.id}`} passHref>
            <button className="w-full bg-bni-orange text-white font-semibold py-2.5 rounded-lg hover:bg-bni-orange/90 transition-all">
              Lihat Detail & Simulasi
            </button>
          </Link>
      </div>
    </motion.div>
  );
}

