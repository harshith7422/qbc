import { Quotation, QuotationStatus } from '../types/quotation';
import { INITIAL_QUOTATIONS } from '../data/mockQuotations';
import { storageService } from './storageService';
import { generateId, generateQuotationReference } from '../utils/calculations';

export const quotationService = {
  getQuotations(): Quotation[] {
    return storageService.get<Quotation[]>('QUOTATIONS', INITIAL_QUOTATIONS);
  },

  getQuotationById(id: string): Quotation | undefined {
    const list = this.getQuotations();
    return list.find(q => q.id === id);
  },

  saveQuotation(quotation: Quotation): Quotation {
    const list = this.getQuotations();
    const existingIndex = list.findIndex(q => q.id === quotation.id);

    const updatedQuotation: Quotation = {
      ...quotation,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = updatedQuotation;
    } else {
      list.unshift(updatedQuotation);
    }

    storageService.set('QUOTATIONS', list);
    return updatedQuotation;
  },

  updateStatus(id: string, status: QuotationStatus): Quotation | null {
    const list = this.getQuotations();
    const target = list.find(q => q.id === id);
    if (!target) return null;

    target.status = status;
    target.updatedAt = new Date().toISOString();
    storageService.set('QUOTATIONS', list);
    return target;
  },

  duplicateQuotation(id: string): Quotation | null {
    const list = this.getQuotations();
    const original = list.find(q => q.id === id);
    if (!original) return null;

    const newRef = generateQuotationReference(list.length + 1);
    const duplicated: Quotation = {
      ...original,
      id: generateId('quot'),
      referenceNumber: newRef,
      customer: {
        ...original.customer,
        customerName: `${original.customer.customerName} (Copy)`,
        referenceNumber: newRef,
        quotationDate: new Date().toISOString().split('T')[0],
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(duplicated);
    storageService.set('QUOTATIONS', list);
    return duplicated;
  },

  deleteQuotation(id: string): boolean {
    const list = this.getQuotations();
    const filtered = list.filter(q => q.id !== id);
    storageService.set('QUOTATIONS', filtered);
    return filtered.length !== list.length;
  },

  resetToDefault(): Quotation[] {
    storageService.set('QUOTATIONS', INITIAL_QUOTATIONS);
    return INITIAL_QUOTATIONS;
  }
};
