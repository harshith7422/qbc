const STORAGE_KEYS = {
  PRICING: 'bluecraft_pricing_catalog',
  QUOTATIONS: 'bluecraft_quotations',
  SETTINGS: 'bluecraft_settings',
} as const;

export const storageService = {
  get<T>(key: keyof typeof STORAGE_KEYS, fallback: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error reading from localStorage key "${key}":`, e);
      return fallback;
    }
  },

  set<T>(key: keyof typeof STORAGE_KEYS, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing to localStorage key "${key}":`, e);
    }
  },

  remove(key: keyof typeof STORAGE_KEYS): void {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } catch (e) {
      console.error(`Error removing localStorage key "${key}":`, e);
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRICING);
      localStorage.removeItem(STORAGE_KEYS.QUOTATIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }
};
