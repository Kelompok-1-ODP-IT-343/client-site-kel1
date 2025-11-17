export type PropertyListItem = {
  id: number;
  title: string;
  city: string | null;
  property_code: string | null;
  property_type: string | null;
  listing_type: string | null;
  price: number;
  main_image: string | null;
  nearby_places: string | null;
  // New fields from list API body
  building_area?: number | null;
  land_area?: number | null;
  parsedFeatures: {
    key: string;
    value: string;
  }[];
  is_developer_pilihan: boolean;
};
export type PropertyDetail = {
  id: number;
  title: string;
  description?: string | null;
  city?: string | null;
  address?: string | null;
  district?: string | null; // kecamatan
  subdistrict?: string | null; // kelurahan/desa
  province?: string | null;
  postalCode?: string | null;
  property_type?: string | null;
  listing_type?: string | null;
  property_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  yearBuilt?: number | null;
  handoverDate?: string | null;
  availabilityDate?: string | null;
  // Teknis
  buildingArea?: number | null;
  landArea?: number | null;
  pricePerSqm?: number | null;
  floors?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  garage?: number | null;
  certificateArea?: number | null;
  // Legal & Pajak
  certificate_type?: string | null;
  certificate_number?: string | null;
  pbb_value?: number | null;
  price: number;
  images: string[];
  features: Array<{ featureName: string; featureValue: string }>;
  locations: Array<{ poiName: string; distanceKm: number }>;
  // KPR & Simulasi
  minDownPaymentPercent?: number | null;
  maxLoanTermYears?: number | null;
  maintenanceFee?: number | null;
  // Statistik Listing
  inquiryCount?: number | null;
  favoriteCount?: number | null;
  viewCount?: number | null;
  status?: string | null;
  developer?: {
    companyName: string;
    partnershipLevel?: string | null;
    contactPerson?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
  } | null;
};
