export type MarketplaceMode = 'cars' | 'homes';

export type ListingType = 'sale' | 'rent';

export type PropertyCategory = 
  | 'villa' 
  | 'apartment' 
  | 'compound_g2' 
  | 'townhouse' 
  | 'penthouse' 
  | 'commercial_residential';

export type ListingStatus = 'active' | 'sold' | 'urgent' | 'pending';

export interface PropertyListing {
  id: string;
  title: string;
  titleAm?: string;
  type: ListingType;
  category: PropertyCategory;
  city: string;
  neighborhood: string;
  price: number; // in ETB
  bedrooms: number;
  bathrooms: number;
  area: number; // m²
  parkingSpaces?: number;
  yearBuilt?: number;
  furnishing?: 'furnished' | 'unfurnished' | 'semi-furnished';
  description: string;
  descriptionAm?: string;
  photos: string[];
  status?: ListingStatus;
  isFeatured?: boolean;
  hasCarta?: boolean; // Ethiopian property title deed
  hasGenerator?: boolean;
  hasWaterTank?: boolean;
  hasSecurity?: boolean;
  createdAt: string;
  views?: number;
  sellerType: 'owner' | 'verified_agent';
  // Admin-only private seller information (NEVER displayed on public property cards or modals)
  sellerContact?: {
    name?: string;
    phone?: string;
    altPhone?: string;
    email?: string;
    telegram?: string;
    preferredContact?: 'phone' | 'whatsapp' | 'telegram' | 'any';
    notes?: string;
  };
}

// -------------------------------------------------------------
// Charte Cars Types
// -------------------------------------------------------------
export type CarCondition = 'brand_new' | 'like_new' | 'used' | 'duty_free';
export type CarTransmission = 'automatic' | 'manual';
export type CarFuelType = 'petrol' | 'electric' | 'hybrid' | 'diesel';
export type CarPlateCode = 'code_2' | 'code_3' | 'code_1' | 'duty_free' | 'unregistered';
export type CarBodyType = 'suv' | 'sedan' | 'crossover' | 'hatchback' | 'pickup' | 'van' | 'luxury';

export interface CarListing {
  id: string;
  // Stable public reference number for marketing (YouTube, TikTok, etc.)
  // Displayed as "C{listingCode}" e.g. C1, C2, C10. Assigned once at creation
  // time and never reused or reassigned, even if earlier cars are deleted.
  listingCode?: number;
  title: string;
  titleAm?: string;
  make: string;
  model: string;
  year: number;
  type: ListingType; // 'sale' | 'rent'
  rentPeriod?: 'day' | 'month';
  condition: CarCondition;
  transmission: CarTransmission;
  fuelType: CarFuelType;
  plateCode: CarPlateCode;
  bodyType: CarBodyType;
  color: string;
  mileage: number; // in km
  engineCapacity?: string; // e.g. "1.5L Turbo", "60 kWh EV"
  city: string;
  neighborhood: string;
  price: number; // in ETB
  photos: string[];
  features: string[];
  description: string;
  descriptionAm?: string;
  status?: ListingStatus;
  isFeatured?: boolean;
  createdAt: string;
  views?: number;
  sellerType: 'owner' | 'verified_dealer';
  // Admin-only private seller contact (Strictly hidden from public visitors)
  sellerContact?: {
    name?: string;
    phone?: string;
    altPhone?: string;
    email?: string;
    telegram?: string;
    preferredContact?: 'phone' | 'whatsapp' | 'telegram' | 'any';
    notes?: string;
  };
  // Payment Verification Record (Prevents reuse & tracks manual Telebirr/M-Pesa/Bank transfers)
  paymentDetails?: {
    method: 'telebirr' | 'mpesa' | 'cbe' | 'abyssinia' | 'buna' | 'dashen' | 'awash' | 'lion' | 'admin_waived' | string;
    transactionRef?: string;
    amount: number;
    paidAt: string;
    receiptScreenshot?: string;
    receiptFileType?: 'pdf' | 'image';
    receiptFileName?: string;
    verifiedByAdmin?: boolean;
  };
}

export interface CarFilterState {
  searchQuery: string;
  make: string;
  type: ListingType | 'all';
  bodyType: string;
  transmission: string;
  fuelType: string;
  condition: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  yearMin: string;
  plateCode: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  type: ListingType | 'all';
  category: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  hasCartaOnly: boolean;
}

export type Language = 'en' | 'am';
export type Currency = 'ETB' | 'USD';

