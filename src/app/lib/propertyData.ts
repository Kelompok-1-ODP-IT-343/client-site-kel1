// Definisikan tipe House di sini
export type House = {
  id: number;
  property_type: 'Cluster' | 'Apartemen' | 'Rumah Tinggal' | 'Townhouse'; // Sesuai requirement
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
  // Tambahkan field lain dari requirement jika perlu (misal company_name)
  company_name?: string; // Developer (Opsional)
  image: string;
};

// Simpan array data rumah di sini (Contoh data lebih lengkap)
export const allHouses: House[] = [
    { id: 1, property_type: 'Cluster', title: 'Cluster Green Valley', description: 'Hunian asri...', address: 'Jl. Boulevard Raya No. 1', sub_district: 'Pagedangan', district: 'Serpong', city: 'Tangerang Selatan', province: 'Banten', postal_code: '15339', land_area: 120, building_area: 90, bedrooms: 3, bathrooms: 2, floors: 2, garage: 1, year_built: 2022, price: 1500000000, company_name: 'Sinarmas Land', image: '/rumah-1.jpg' },
    { id: 2, property_type: 'Rumah Tinggal', title: 'Rumah Klasik Menteng', description: 'Lokasi premium...', address: 'Jl. Teuku Umar No. 20', sub_district: 'Menteng', district: 'Menteng', city: 'Jakarta Pusat', province: 'DKI Jakarta', postal_code: '10310', land_area: 300, building_area: 250, bedrooms: 5, bathrooms: 4, floors: 2, garage: 2, year_built: 2018, price: 25000000000, company_name: 'Jaya Properti', image: '/rumah-2.jpg' },
    { id: 3, property_type: 'Apartemen', title: 'The Peak Apartment', description: 'Apartemen mewah...', address: 'Jl. Sudirman Kav. 52-53', sub_district: 'Kebayoran Baru', district: 'Senayan', city: 'Jakarta Selatan', province: 'DKI Jakarta', postal_code: '12190', land_area: 0, building_area: 120, bedrooms: 2, bathrooms: 2, floors: 1, garage: 1, year_built: 2020, price: 4500000000, company_name: 'Agung Sedayu Group', image: '/rumah-3.jpg' },
    { id: 4, property_type: 'Cluster', title: 'Citra Garden Bintaro', description: 'Kawasan terpadu...', address: 'Jl. Bintaro Utama Sektor 9', sub_district: 'Pondok Aren', district: 'Bintaro', city: 'Tangerang Selatan', province: 'Banten', postal_code: '15229', land_area: 90, building_area: 75, bedrooms: 3, bathrooms: 2, floors: 2, garage: 1, year_built: 2023, price: 1200000000, company_name: 'Ciputra Development', image: '/rumah-4.jpg' },
    // Tambahkan 5+ data lagi untuk menguji paginasi
    { id: 5, property_type: 'Rumah Tinggal', title: 'Pondok Indah Residence', city: 'Jakarta Selatan', province: 'DKI Jakarta', bedrooms: 4, bathrooms: 3, building_area: 200, price: 15000000000, image: '/rumah-1.jpg', description: '', address: '', sub_district: '', district: '', postal_code: '', land_area: 250, floors: 2, garage: 2, year_built: 2019 },
    { id: 6, property_type: 'Apartemen', title: 'Casa Grande Residence', city: 'Jakarta Selatan', province: 'DKI Jakarta', bedrooms: 1, bathrooms: 1, building_area: 60, price: 2200000000, image: '/rumah-2.jpg', description: '', address: '', sub_district: '', district: '', postal_code: '', land_area: 0, floors: 1, garage: 1, year_built: 2021 },
    { id: 7, property_type: 'Cluster', title: 'Summarecon Serpong', city: 'Tangerang', province: 'Banten', bedrooms: 4, bathrooms: 3, building_area: 150, price: 3200000000, image: '/rumah-3.jpg', description: '', address: '', sub_district: '', district: '', postal_code: '', land_area: 180, floors: 2, garage: 2, year_built: 2022 },
    { id: 8, property_type: 'Rumah Tinggal', title: 'Vila Modern Cisarua', city: 'Bogor', province: 'Jawa Barat', bedrooms: 3, bathrooms: 2, building_area: 180, price: 1800000000, image: '/rumah-4.jpg', description: '', address: '', sub_district: '', district: '', postal_code: '', land_area: 400, floors: 1, garage: 1, year_built: 2017 },
    { id: 9, property_type: 'Townhouse', title: 'Kemang Village Townhouse', city: 'Jakarta Selatan', province: 'DKI Jakarta', bedrooms: 3, bathrooms: 3, building_area: 160, price: 5500000000, image: '/rumah-1.jpg', description: '', address: '', sub_district: '', district: '', postal_code: '', land_area: 100, floors: 3, garage: 1, year_built: 2015 },
    { id: 10, property_type: 'Cluster', title: 'BSD City Cluster Avani', city: 'Tangerang Selatan', province: 'Banten', bedrooms: 4, bathrooms: 3, building_area: 130, price: 2800000000, image: '/rumah-2.jpg', description: '', address: '', sub_district: '', district: '', postal_code: '', land_area: 160, floors: 2, garage: 2, year_built: 2020 },
];