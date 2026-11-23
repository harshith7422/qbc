import { MasterPricingCatalog, PricingType } from '../types/pricing';
import { INITIAL_PRICING_CATALOG } from '../data/mockPricing';
import { storageService } from './storageService';
import { generateId } from '../utils/calculations';

export const pricingService = {
  getCatalog(): MasterPricingCatalog {
    return storageService.get<MasterPricingCatalog>('PRICING', INITIAL_PRICING_CATALOG);
  },

  saveCatalog(catalog: MasterPricingCatalog): void {
    const updated = {
      ...catalog,
      lastUpdated: new Date().toISOString(),
    };
    storageService.set('PRICING', updated);
  },

  updateGlobalBaseRate(rate: number): MasterPricingCatalog {
    const catalog = this.getCatalog();
    catalog.globalBaseRate = rate;
    this.saveCatalog(catalog);
    return catalog;
  },

  addRoom(roomName: string): MasterPricingCatalog {
    const catalog = this.getCatalog();
    const newRoom = {
      id: generateId('room'),
      name: roomName.trim(),
      isCustom: true,
      categories: [
        {
          id: generateId('cat'),
          name: 'General Woodwork',
          subCategories: [
            {
              id: generateId('sub'),
              name: 'Laminate Finish',
              pricingType: 'fixed' as PricingType,
              rate: 1500,
              description: 'Standard 1mm laminate with PVC edge band'
            }
          ]
        }
      ]
    };
    catalog.rooms.push(newRoom);
    this.saveCatalog(catalog);
    return catalog;
  },

  renameRoom(roomId: string, newName: string): MasterPricingCatalog {
    const catalog = this.getCatalog();
    const room = catalog.rooms.find(r => r.id === roomId);
    if (room) {
      room.name = newName.trim();
      this.saveCatalog(catalog);
    }
    return catalog;
  },

  deleteRoom(roomId: string): MasterPricingCatalog {
    const catalog = this.getCatalog();
    catalog.rooms = catalog.rooms.filter(r => r.id !== roomId);
    this.saveCatalog(catalog);
    return catalog;
  },

  resetToDefault(): MasterPricingCatalog {
    this.saveCatalog(INITIAL_PRICING_CATALOG);
    return INITIAL_PRICING_CATALOG;
  }
};
