import HouseCard from './HouseCard';
import type { House } from '@/app/user/cari-rumah/page';

type HouseListProps = {
  houses: House[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
};

export default function HouseList({ houses, favorites, onToggleFavorite }: HouseListProps) {
  if (houses.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-bni-dark-blue">Tidak Ada Hasil Ditemukan</h3>
        <p className="mt-2 text-bni-gray">Coba ubah kriteria pencarian Anda.</p>
      </div>
    );
  }

  return (
    // INI KUNCI RESPONSif: 1 kolom di mobile, 2 di tablet, 3 di laptop, 4 di desktop besar
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {houses.map((house) => (
        <HouseCard
          key={house.id}
          house={house}
          isFavorite={favorites.includes(house.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}