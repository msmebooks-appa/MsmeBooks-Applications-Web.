import { useState, useEffect } from 'react';
import { FilterState } from '../types';

export interface SavedFilterPreset {
  id: string;
  name: string;
  createdAt: number;
  filters: FilterState;
}

const STORAGE_KEY = 'msmebooks_saved_search_filters';
const CUSTOM_EVENT_KEY = 'msmebooks_saved_filters_updated';

// Default presets that help users immediately see the power of saving/loading presets
export const DEFAULT_PRESETS: SavedFilterPreset[] = [
  {
    id: 'preset-quick-lagos-retail',
    name: 'Lagos • Retail & Supermarket POS',
    createdAt: 1710000000000,
    filters: {
      search: '',
      country: 'Nigeria',
      city: 'Lagos',
      partnerType: 'POS Hardware & Software Integrator',
      industry: 'Retail & Supermarkets',
      service: 'POS Setup',
      level: '',
      language: '',
      businessSize: '',
      remoteOnly: false,
      verifiedOnly: true,
      availability: 'Accepting New Clients',
      sortBy: 'recommended',
      quickFilters: ['POS & Hardware'],
    },
  },
  {
    id: 'preset-nairobi-platinum',
    name: 'Kenya • Platinum Verified Tax Experts',
    createdAt: 1710000001000,
    filters: {
      search: '',
      country: 'Kenya',
      city: 'Nairobi',
      partnerType: 'Accounting Practice',
      industry: '',
      service: 'Tax Support',
      level: 'Platinum',
      language: 'English',
      businessSize: '',
      remoteOnly: false,
      verifiedOnly: true,
      availability: '',
      sortBy: 'rating',
      quickFilters: ['Tax & Compliance', 'Platinum Verified'],
    },
  },
  {
    id: 'preset-remote-fast-erp',
    name: 'Remote ERP • Multi-Branch Experts',
    createdAt: 1710000002000,
    filters: {
      search: '',
      country: '',
      city: '',
      partnerType: 'ERP Implementation Consultant',
      industry: 'Wholesale & Distribution',
      service: 'Multi-Branch Setup',
      level: '',
      language: '',
      businessSize: 'Medium',
      remoteOnly: true,
      verifiedOnly: true,
      availability: 'Accepting New Clients',
      sortBy: 'experience',
      quickFilters: ['Multi-Branch Support', 'Remote Available'],
    },
  },
];

export function getSavedFilters(): SavedFilterPreset[] {
  if (typeof window === 'undefined') return DEFAULT_PRESETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with default presets so user immediately has useful templates
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRESETS));
      return DEFAULT_PRESETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PRESETS;
  } catch (err) {
    console.warn('Failed to parse saved filters from localStorage:', err);
    return DEFAULT_PRESETS;
  }
}

export function saveFilterPreset(name: string, filters: FilterState): SavedFilterPreset {
  const current = getSavedFilters();
  const newPreset: SavedFilterPreset = {
    id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || generateSmartPresetName(filters),
    createdAt: Date.now(),
    filters: { ...filters },
  };

  const updated = [newPreset, ...current.filter(p => p.id !== newPreset.id)].slice(0, 15); // keep max 15 presets
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_KEY));
  } catch (err) {
    console.error('Failed to save filter preset to localStorage:', err);
  }
  return newPreset;
}

export function deleteSavedFilterPreset(id: string): void {
  const current = getSavedFilters();
  const updated = current.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_KEY));
  } catch (err) {
    console.error('Failed to delete saved filter from localStorage:', err);
  }
}

export function clearAllSavedFilterPresets(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_KEY));
  } catch (err) {
    console.error('Failed to clear saved filters:', err);
  }
}

/**
 * Generate a smart descriptive title for a filter configuration if user doesn't type a custom name
 */
export function generateSmartPresetName(filters: FilterState): string {
  const parts: string[] = [];

  if (filters.search) {
    parts.push(`"${filters.search}"`);
  }
  if (filters.city && filters.country) {
    parts.push(`${filters.city}, ${filters.country}`);
  } else if (filters.country) {
    parts.push(filters.country);
  } else if (filters.city) {
    parts.push(filters.city);
  }

  if (filters.industry) {
    parts.push(filters.industry);
  } else if (filters.partnerType) {
    parts.push(filters.partnerType);
  }

  if (filters.level) {
    parts.push(`${filters.level} Partners`);
  }

  if (filters.successStoryScale) {
    parts.push(`${filters.successStoryScale}`);
  }

  if (filters.remoteOnly) {
    parts.push('Remote');
  }

  if (parts.length === 0) {
    return 'Custom Filter Shortcut';
  }

  return parts.slice(0, 3).join(' • ');
}

/**
 * React hook that provides the list of saved filters and syncs across updates/tabs
 */
export function useSavedFilters() {
  const [savedPresets, setSavedPresets] = useState<SavedFilterPreset[]>(() => getSavedFilters());

  useEffect(() => {
    const handleUpdate = () => {
      setSavedPresets(getSavedFilters());
    };

    window.addEventListener(CUSTOM_EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CUSTOM_EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const saveCurrent = (name: string, filters: FilterState) => {
    const preset = saveFilterPreset(name, filters);
    setSavedPresets(getSavedFilters());
    return preset;
  };

  const removePreset = (id: string) => {
    deleteSavedFilterPreset(id);
    setSavedPresets(getSavedFilters());
  };

  const resetToDefaults = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRESETS));
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_KEY));
      setSavedPresets(DEFAULT_PRESETS);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    savedPresets,
    saveCurrent,
    removePreset,
    resetToDefaults,
  };
}
