import { CustomerDetails } from './customer';
import { PricingType } from './pricing';

export type QuotationStatus = 'draft' | 'generated' | 'sent' | 'accepted' | 'rejected';

export interface QuotationLineItem {
  id: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  pricingType?: PricingType;
  ratePerSqFt: number; // Snapshot of rate used at creation time
  area: number; // in sq.ft
  basePrice: number; // Internal Reference: ratePerSqFt * area
  finalPrice: number; // Manually editable quoted price
  notes?: string;
  description?: string;
}

export interface QuotationRoom {
  id: string;
  roomId: string;
  roomName: string;
  roomArea?: number; // optional legacy reference
  items: QuotationLineItem[];
}

export interface QuotationSummary {
  totalRooms: number;
  totalItems: number;
  totalBasePrice: number; // STRICTLY INTERNAL REFERENCE
  totalFinalPrice: number; // Customer facing sum of line items
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number; // e.g., 18% GST (optional)
  taxAmount?: number;
  grandTotal: number; // Final payable amount
}

export interface Quotation {
  id: string;
  referenceNumber: string; // e.g. BCD-2026-0089
  customer: CustomerDetails;
  rooms: QuotationRoom[];
  summary: QuotationSummary;
  status: QuotationStatus;
  notes?: string;
  termsAndConditions?: string[];
  validityDays: number;
  createdAt: string;
  updatedAt: string;
}
