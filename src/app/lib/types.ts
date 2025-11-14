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
  property_type?: string | null;
  listing_type?: string | null;
  property_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price: number;
  images: string[];
  features: Array<{ featureName: string; featureValue: string }>;
  locations: Array<{ poiName: string; distanceKm: number }>;
  developer?: {
    companyName: string;
  } | null;
};
