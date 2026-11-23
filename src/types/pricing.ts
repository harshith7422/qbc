export type PricingType = 'fixed' | 'variable';

export interface SubCategoryItem {
  id: string;
  name: string; // e.g. Acrylic, Laminate, PU Finish, Granite / Quartz
  pricingType: PricingType;
  rate: number; // If fixed: rate per sq.ft. If variable: 0 or multiplier, or fallback to global base rate
  description?: string;
}

export interface CategoryItem {
  id: string;
  name: string; // e.g. Base Cabinet, Wall Cabinet, Countertop
  subCategories: SubCategoryItem[];
}

export interface RoomCatalog {
  id: string;
  name: string; // e.g. Kitchen, Bedroom, Living Room, Bathroom, Wardrobe
  isCustom?: boolean;
  categories: CategoryItem[];
}

export interface MasterPricingCatalog {
  globalBaseRate: number; // e.g. 1500
  rooms: RoomCatalog[];
  lastUpdated: string;
}
