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

export const allHouses: House[] = [
    { id: 1, property_type: 'Cluster', title: 'Cluster Green Valley', description: 'Hunian asri di tengah kota...', address: 'Jl. Boulevard Raya No. 1', sub_district: 'Pagedangan', district: 'Serpong', city: 'Tangerang Selatan', province: 'Banten', postal_code: '15339', land_area: 120, building_area: 90, bedrooms: 3, bathrooms: 2, floors: 2, garage: 1, year_built: 2022, price: 1500000000, image: '/rumah-1.jpg' },
    { id: 2, property_type: 'Rumah Tinggal', title: 'Rumah Klasik Menteng', description: 'Lokasi premium di jantung Jakarta...', address: 'Jl. Teuku Umar No. 20', sub_district: 'Menteng', district: 'Menteng', city: 'Jakarta Pusat', province: 'DKI Jakarta', postal_code: '10310', land_area: 300, building_area: 250, bedrooms: 5, bathrooms: 4, floors: 2, garage: 2, year_built: 2018, price: 25000000000, image: '/rumah-2.jpg' },
];