import { Search } from 'lucide-react';
import type { House } from '@/app/user/cari-rumah/page'; // Sesuaikan path jika perlu

type FilterBarProps = {
  filters: { name: string; location: string; type: string; budget: string; };
  onFilterChange: (name: string, value: string) => void;
  houses: House[];
};

export default function FilterBar({ filters, onFilterChange, houses }: FilterBarProps) {
  const locationOptions = Array.from(new Set(houses.map(h => h.city)));
  const typeOptions = Array.from(new Set(houses.map(h => h.property_type)));
  const budgetOptions = [
    { label: '< Rp 1 Miliar', value: '0-1000000000' },
    { label: 'Rp 1 M - 2 M', value: '1000000000-2000000000' },
    { label: 'Rp 2 M - 5 M', value: '2000000000-5000000000' },
    { label: '> Rp 5 Miliar', value: '5000000000' },
  ];

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      {/* INI KUNCI RESPONSif: grid-cols-1 di mobile, md:grid-cols-2 di tablet, lg:grid-cols-5 di desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cari Properti</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={filters.name}
              onChange={(e) => onFilterChange('name', e.target.value)}
              placeholder="Masukkan nama cluster atau area..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-orange"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
          <select value={filters.location} onChange={(e) => onFilterChange('location', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bni-orange">
            <option value="">Semua Lokasi</option>
            {locationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
          <select value={filters.type} onChange={(e) => onFilterChange('type', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bni-orange">
            <option value="">Semua Tipe</option>
            {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Harga</label>
          <select value={filters.budget} onChange={(e) => onFilterChange('budget', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bni-orange">
            <option value="">Semua Harga</option>
            {budgetOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}