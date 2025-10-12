'use client';

import { useState, useMemo } from 'react';
import Header from '../../components/Header';

// Dummy property data
const dummyProperties = [
  {
    id: 1,
    name: "Rumah Minimalis Modern",
    location: "Bekasi, Jawa Barat",
    price: 850000000,
    type: "Rumah",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: "https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Rumah+Modern"
  },
  {
    id: 2,
    name: "Cluster Asri Indah",
    location: "Depok, Jawa Barat",
    price: 1200000000,
    type: "Cluster",
    bedrooms: 4,
    bathrooms: 3,
    area: 150,
    image: "https://via.placeholder.com/400x300/FF6600/FFFFFF?text=Cluster+Asri"
  },
  {
    id: 3,
    name: "Townhouse Exclusive",
    location: "Tangerang, Banten",
    price: 2500000000,
    type: "Townhouse",
    bedrooms: 5,
    bathrooms: 4,
    area: 200,
    image: "https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Townhouse"
  },
  {
    id: 4,
    name: "Rumah Keluarga Nyaman",
    location: "Bogor, Jawa Barat",
    price: 750000000,
    type: "Rumah",
    bedrooms: 3,
    bathrooms: 2,
    area: 100,
    image: "https://via.placeholder.com/400x300/FF6600/FFFFFF?text=Rumah+Keluarga"
  },
  {
    id: 5,
    name: "Villa Mewah Pegunungan",
    location: "Bandung, Jawa Barat",
    price: 3500000000,
    type: "Villa",
    bedrooms: 6,
    bathrooms: 5,
    area: 300,
    image: "https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Villa+Mewah"
  },
  {
    id: 6,
    name: "Apartemen City View",
    location: "Jakarta Selatan, DKI Jakarta",
    price: 1800000000,
    type: "Apartemen",
    bedrooms: 2,
    bathrooms: 2,
    area: 80,
    image: "https://via.placeholder.com/400x300/FF6600/FFFFFF?text=Apartemen"
  },
  {
    id: 7,
    name: "Rumah Strategis Pusat Kota",
    location: "Jakarta Timur, DKI Jakarta",
    price: 1500000000,
    type: "Rumah",
    bedrooms: 4,
    bathrooms: 3,
    area: 140,
    image: "https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Rumah+Strategis"
  },
  {
    id: 8,
    name: "Cluster Green Valley",
    location: "Serpong, Banten",
    price: 1100000000,
    type: "Cluster",
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    image: "https://via.placeholder.com/400x300/FF6600/FFFFFF?text=Green+Valley"
  }
];

export default function CariRumah() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000000 });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get unique locations and types for filters
  const locations = [...new Set(dummyProperties.map(p => p.location))];
  const propertyTypes = [...new Set(dummyProperties.map(p => p.type))];

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    return dummyProperties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === '' || property.location === selectedLocation;
      const matchesType = selectedType === '' || property.type === selectedType;
      const matchesPrice = property.price >= priceRange.min && property.price <= priceRange.max;

      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });
  }, [searchTerm, selectedLocation, selectedType, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bni-blue to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">
              Eksplor Rumah Impian
            </h1>
            <p className="hero-subtitle text-xl mb-8">
              Temukan properti terbaik dengan KPR BNI yang mudah dan terpercaya
            </p>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Rumah
                </label>
                <input
                  type="text"
                  placeholder="Nama atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent"
                >
                  <option value="">Semua Lokasi</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent"
                >
                  <option value="">Semua Tipe</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rentang Harga
                </label>
                <select
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setPriceRange({ min, max });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bni-blue focus:border-transparent"
                >
                  <option value="0-5000000000">Semua Harga</option>
                  <option value="0-1000000000">{'< Rp 1 Miliar'}</option>
                  <option value="1000000000-2000000000">Rp 1-2 Miliar</option>
                  <option value="2000000000-3000000000">Rp 2-3 Miliar</option>
                  <option value="3000000000-5000000000">{'> Rp 3 Miliar'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title text-2xl font-bold">
                Hasil Pencarian
              </h2>
              <p className="text-gray-600">
                Ditemukan {filteredProperties.length} properti
              </p>
            </div>

            {/* Property Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <div key={property.id} className="card property-card hover:shadow-lg transition-shadow">
                  {/* Property Image */}
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-bni-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {property.type}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {property.location}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-bni-blue">
                        {formatCurrency(property.price)}
                      </div>
                    </div>

                    {/* Property Features */}
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        {property.bedrooms} KT
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                        </svg>
                        {property.bathrooms} KM
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {property.area} m²
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="btn-primary flex-1 text-center">
                        Ajukan
                      </button>
                      <button className="btn-outline flex-1 text-center">
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Tidak ada properti ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah kriteria pencarian Anda
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer dihilangkan sesuai permintaan desain halaman */}
    </div>
  );
}
