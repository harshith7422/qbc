import { CompanySettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../data/defaultSettings';
import { storageService } from './storageService';

export const settingsService = {
  getSettings(): CompanySettings {
    return storageService.get<CompanySettings>('SETTINGS', DEFAULT_SETTINGS);
  },

  saveSettings(settings: CompanySettings): void {
    storageService.set('SETTINGS', settings);
  },

  resetToDefault(): CompanySettings {
    storageService.set('SETTINGS', DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
};
