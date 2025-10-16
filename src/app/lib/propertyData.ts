// src/lib/propertyData.ts

export interface House {
  id: number;
  name: string;
  location: string;
  price: number; // Tipe diubah ke number agar mudah dihitung
  image: string;
  specs: {
    bedrooms: number;
    bathrooms: number;
    land_area: number;
    building_area: number;
  };
  description: string;
}

export const allHouses: House[] = [
    { 
      id: 1, name: "Cluster Green Valley", location: "Serpong, Banten", price: 456500000, image: "/rumah-1.jpg",
      specs: { bedrooms: 2, bathrooms: 1, land_area: 72, building_area: 45 },
      description: "Hunian modern di lokasi strategis Serpong dengan lingkungan asri dan fasilitas lengkap untuk keluarga muda yang dinamis."
    },
    { 
      id: 2, name: "Cluster Pinewood", location: "Depok, Jawa Barat", price: 625500000, image: "/rumah-2.jpg",
      specs: { bedrooms: 3, bathrooms: 2, land_area: 84, building_area: 60 },
      description: "Kenyamanan maksimal dengan desain elegan di jantung kota Depok, dekat dengan akses tol dan pusat perbelanjaan."
    },
    { 
      id: 3, name: "Pondok Taktakan", location: "Serang, Banten", price: 197000000, image: "/rumah-3.jpg",
      specs: { bedrooms: 2, bathrooms: 1, land_area: 60, building_area: 36 },
      description: "Solusi rumah pertama yang terjangkau dengan kualitas bangunan terjamin di area berkembang kota Serang."
    },
    { 
      id: 4, name: "Citra Garden", location: "Jakarta Barat", price: 850000000, image: "/rumah-4.jpg",
      specs: { bedrooms: 3, bathrooms: 2, land_area: 90, building_area: 70 },
      description: "Gaya hidup urban dengan fasilitas premium di kawasan elit Jakarta Barat, investasi properti yang menjanjikan."
    },
];