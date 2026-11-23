import { QuotationRoom, QuotationSummary } from '../types/quotation';

/**
 * Calculates internal base price: Configured Rate per Sq.Ft. * Applicable Area
 */
export function calculateBasePrice(ratePerSqFt: number, area: number): number {
  if (!ratePerSqFt || isNaN(ratePerSqFt) || !area || isNaN(area)) return 0;
  return Math.round(ratePerSqFt * area);
}

/**
 * Recalculates quotation summary from the list of rooms and items.
 * Note: totalFinalPrice is strictly the sum of all final quoted prices.
 * Internal base prices are preserved only for internal reference.
 */
export function recalculateQuotationSummary(
  rooms: QuotationRoom[],
  discountPercent = 0,
  taxPercent = 0
): QuotationSummary {
  let totalItems = 0;
  let totalBasePrice = 0;
  let totalFinalPrice = 0;

  for (const room of rooms) {
    for (const item of room.items) {
      totalItems += 1;
      totalBasePrice += Number(item.basePrice) || 0;
      totalFinalPrice += Number(item.finalPrice) || 0;
    }
  }

  const discountAmount = discountPercent > 0 ? Math.round((totalFinalPrice * discountPercent) / 100) : 0;
  const priceAfterDiscount = Math.max(0, totalFinalPrice - discountAmount);
  
  const taxAmount = taxPercent > 0 ? Math.round((priceAfterDiscount * taxPercent) / 100) : 0;
  const grandTotal = Math.round(priceAfterDiscount + taxAmount);

  return {
    totalRooms: rooms.length,
    totalItems,
    totalBasePrice,
    totalFinalPrice,
    discountPercent,
    discountAmount,
    taxPercent,
    taxAmount,
    grandTotal,
  };
}

/**
 * Generates an auto-incremented or timestamp-based quotation reference number.
 * E.g., BCD-2026-0138
 */
export function generateQuotationReference(existingCount = 0): string {
  const year = new Date().getFullYear();
  const sequence = String(101 + existingCount).padStart(4, '0');
  return `BCD-${year}-${sequence}`;
}

/**
 * Generates a unique client-side ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}
