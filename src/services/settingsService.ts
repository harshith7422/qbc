import { CompanySettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import { storageService } from './storageService';

export const settingsService = {
  getSettings(): CompanySettings {
    const stored = storageService.get<CompanySettings | null>('SETTINGS', null);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      paymentMilestones: (stored.paymentMilestones && stored.paymentMilestones.length > 0)
        ? stored.paymentMilestones
        : DEFAULT_SETTINGS.paymentMilestones,
      materialSpecifications: (stored.materialSpecifications && stored.materialSpecifications.length > 0)
        ? stored.materialSpecifications
        : DEFAULT_SETTINGS.materialSpecifications,
      sections: stored.sections ?? DEFAULT_SETTINGS.sections,
    };
  },

  saveSettings(settings: CompanySettings): void {
    storageService.set('SETTINGS', settings);
  },

  resetToDefault(): CompanySettings {
    storageService.set('SETTINGS', DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
};
