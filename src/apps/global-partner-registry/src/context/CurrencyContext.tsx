import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Partner } from '../types';
import {
  CurrencyCode,
  UserLocationContext,
  getUserLocationContext,
  getCurrencyForCountry,
  LOCATION_CHANGED_EVENT,
} from '../utils/userLocation';
import {
  getGeographicPricingProfile,
  GeographicPricingProfile,
  calculateLocalizedServicePrice,
  calculateLocalizedConsultationRate,
  PartnerLocalizedServicePrice,
  MASTER_SERVICES_CATALOG,
} from '../utils/locationPricing';

export type { CurrencyCode };
export type { GeographicPricingProfile, PartnerLocalizedServicePrice };

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstUSD: number; // 1 USD = rateAgainstUSD in local currency
  region: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateAgainstUSD: 1.0,
    region: 'Global / Americas',
    locale: 'en-US',
  },
  {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    rateAgainstUSD: 1550,
    region: 'West Africa',
    locale: 'en-NG',
  },
  {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    rateAgainstUSD: 130,
    region: 'East Africa',
    locale: 'en-KE',
  },
  {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    flag: '🇬🇭',
    rateAgainstUSD: 15.5,
    region: 'West Africa',
    locale: 'en-GH',
  },
  {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    rateAgainstUSD: 18.2,
    region: 'Southern Africa',
    locale: 'en-ZA',
  },
  {
    code: 'RWF',
    symbol: 'FRw',
    name: 'Rwandan Franc',
    flag: '🇷🇼',
    rateAgainstUSD: 1320,
    region: 'East Africa',
    locale: 'rw-RW',
  },
  {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    flag: '🇺🇬',
    rateAgainstUSD: 3750,
    region: 'East Africa',
    locale: 'en-UG',
  },
  {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    flag: '🇹🇿',
    rateAgainstUSD: 2600,
    region: 'East Africa',
    locale: 'sw-TZ',
  },
  {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African Franc',
    flag: '🇨🇲',
    rateAgainstUSD: 605,
    region: 'Central/West Africa',
    locale: 'fr-CM',
  },
  {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    flag: '🇪🇬',
    rateAgainstUSD: 48.5,
    region: 'North Africa',
    locale: 'ar-EG',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rateAgainstUSD: 0.78,
    region: 'Europe / UK',
    locale: 'en-GB',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateAgainstUSD: 0.92,
    region: 'European Union',
    locale: 'de-DE',
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    rateAgainstUSD: 1.36,
    region: 'North America',
    locale: 'en-CA',
  },
  {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rateAgainstUSD: 3.67,
    region: 'Middle East',
    locale: 'ar-AE',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rateAgainstUSD: 83.5,
    region: 'South Asia',
    locale: 'en-IN',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    rateAgainstUSD: 1.52,
    region: 'Oceania',
    locale: 'en-AU',
  },
];

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode, isManualOverride?: boolean) => void;
  currentCurrency: CurrencyConfig;
  allCurrencies: CurrencyConfig[];
  convertFromUSD: (usdAmount: number, options?: { applyGeoAdjustment?: boolean; partnerCountry?: string }) => number;
  formatAmount: (usdAmount: number, options?: { showCode?: boolean; compact?: boolean; applyGeoAdjustment?: boolean; partnerCountry?: string }) => string;
  formatBudget: (startingBudget?: string, minBudgetUSD?: number, options?: { prefix?: string; showUSDRef?: boolean; partnerCountry?: string }) => string;
  getRawUSD: (startingBudget?: string, minBudgetUSD?: number) => number;
  getConsultationRateUSD: (partner: Partner, options?: { applyGeoAdjustment?: boolean }) => number;
  formatConsultationRate: (partner: Partner, options?: { showUSDRef?: boolean; compact?: boolean; sessionPrefix?: boolean }) => string;
  formatHourlyRate: (partner: Partner, options?: { showUSDRef?: boolean; compact?: boolean }) => string;
  formatServicePricing: (serviceName: string, partner: Partner, options?: { showUSDRef?: boolean; compact?: boolean }) => PartnerLocalizedServicePrice;
  getPartnerServicesWithPricing: (partner: Partner) => PartnerLocalizedServicePrice[];
  geographicProfile: GeographicPricingProfile;
  useRegionalParity: boolean;
  setUseRegionalParity: (enabled: boolean) => void;
  isDomesticPartner: (partner: Partner) => boolean;
  detectedLocation: UserLocationContext;
  autoLocationSync: boolean;
  setAutoLocationSync: (enabled: boolean) => void;
  syncWithLocation: (location: { country: string; city?: string; countryCode?: string }) => void;
  isLocationAdjusted: boolean;
  recommendedCurrency: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_selected_currency';
const AUTO_SYNC_KEY = 'msmebooks_auto_currency_location';
const REGIONAL_PARITY_KEY = 'msmebooks_use_regional_parity';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Detected Location State
  const [detectedLocation, setDetectedLocation] = useState<UserLocationContext>(() => getUserLocationContext());

  // 2. Auto-Location Currency Sync Toggle (default true unless user turned it off)
  const [autoLocationSync, setAutoLocationSyncState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTO_SYNC_KEY);
      if (stored !== null) return stored === 'true';
    } catch {
      // ignore
    }
    return true; // enabled by default
  });

  // 3. Purchasing Power Parity (PPP) / Regional Parity pricing toggle
  const [useRegionalParity, setUseRegionalParityState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(REGIONAL_PARITY_KEY);
      if (stored !== null) return stored === 'true';
    } catch {
      // ignore
    }
    return true; // enabled by default for authentic location-aware pricing
  });

  // 4. Recommended currency derived from detected location
  const recommendedCurrencyCode = useMemo(() => {
    return getCurrencyForCountry(detectedLocation.country);
  }, [detectedLocation.country]);

  // 5. Geographic pricing profile for detected location
  const geographicProfile = useMemo(() => {
    return getGeographicPricingProfile(detectedLocation.country);
  }, [detectedLocation.country]);

  // 6. Currency State: default to recommended currency or saved preference
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
        return saved as CurrencyCode;
      }
    } catch {
      // Fallback
    }
    return getCurrencyForCountry(getUserLocationContext().country);
  });

  const setAutoLocationSync = (enabled: boolean) => {
    setAutoLocationSyncState(enabled);
    try {
      localStorage.setItem(AUTO_SYNC_KEY, String(enabled));
    } catch {
      // ignore
    }
    if (enabled) {
      const matched = getCurrencyForCountry(detectedLocation.country);
      setCurrencyState(matched);
      try {
        localStorage.setItem(STORAGE_KEY, matched);
      } catch {
        // ignore
      }
    }
  };

  const setUseRegionalParity = (enabled: boolean) => {
    setUseRegionalParityState(enabled);
    try {
      localStorage.setItem(REGIONAL_PARITY_KEY, String(enabled));
    } catch {
      // ignore
    }
  };

  const setCurrency = (code: CurrencyCode, isManualOverride = true) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage errors
    }
    if (isManualOverride) {
      // If user deliberately picked a currency different from location recommendation, disable auto-override
      if (code !== recommendedCurrencyCode) {
        setAutoLocationSyncState(false);
        try {
          localStorage.setItem(AUTO_SYNC_KEY, 'false');
        } catch {
          // ignore
        }
      }
    }
  };

  // Sync when location changes (via event or explicit call)
  const syncWithLocation = useCallback((loc: { country: string; city?: string; countryCode?: string }) => {
    const updated = getUserLocationContext(loc.country);
    setDetectedLocation(updated);
    const newCurrency = getCurrencyForCountry(loc.country);
    if (autoLocationSync) {
      setCurrencyState(newCurrency);
      try {
        localStorage.setItem(STORAGE_KEY, newCurrency);
      } catch {
        // ignore
      }
    }
  }, [autoLocationSync]);

  // Listen to custom location change events across the application
  useEffect(() => {
    const handleLocationUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserLocationContext>;
      const newLoc = customEvent.detail || getUserLocationContext();
      setDetectedLocation(newLoc);
      if (autoLocationSync) {
        const matched = getCurrencyForCountry(newLoc.country);
        setCurrencyState(matched);
      }
    };

    window.addEventListener(LOCATION_CHANGED_EVENT, handleLocationUpdate);
    window.addEventListener('msmebooks-history-updated', handleLocationUpdate);

    return () => {
      window.removeEventListener(LOCATION_CHANGED_EVENT, handleLocationUpdate);
      window.removeEventListener('msmebooks-history-updated', handleLocationUpdate);
    };
  }, [autoLocationSync]);

  const currentCurrency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
  }, [currency]);

  const recommendedCurrency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === recommendedCurrencyCode) || SUPPORTED_CURRENCIES[0];
  }, [recommendedCurrencyCode]);

  const isLocationAdjusted = useMemo(() => {
    return currency === recommendedCurrencyCode;
  }, [currency, recommendedCurrencyCode]);

  const isDomesticPartner = useCallback((partner: Partner): boolean => {
    return partner.country.toLowerCase() === detectedLocation.country.toLowerCase();
  }, [detectedLocation.country]);

  const convertFromUSD = (
    usdAmount: number,
    options?: { applyGeoAdjustment?: boolean; partnerCountry?: string }
  ): number => {
    if (isNaN(usdAmount)) return 0;
    let adjustedUSD = usdAmount;
    if (options?.applyGeoAdjustment && useRegionalParity) {
      const multiplier = geographicProfile.parityMultiplier;
      const isDomestic = options.partnerCountry && options.partnerCountry.toLowerCase() === detectedLocation.country.toLowerCase();
      adjustedUSD = adjustedUSD * multiplier * (isDomestic ? 0.95 : 1.0);
    }
    return Math.round(adjustedUSD * currentCurrency.rateAgainstUSD);
  };

  const formatAmount = (
    usdAmount: number,
    options?: { showCode?: boolean; compact?: boolean; applyGeoAdjustment?: boolean; partnerCountry?: string }
  ): string => {
    if (isNaN(usdAmount)) return `${currentCurrency.symbol}0`;
    const converted = convertFromUSD(usdAmount, options);

    if (options?.compact && converted >= 1000000) {
      const millions = (converted / 1000000).toFixed(1).replace(/\.0$/, '');
      return `${currentCurrency.symbol}${millions}M${options.showCode ? ` ${currentCurrency.code}` : ''}`;
    }

    if (options?.compact && converted >= 10000) {
      const thousands = (converted / 1000).toFixed(0);
      return `${currentCurrency.symbol}${thousands}k${options.showCode ? ` ${currentCurrency.code}` : ''}`;
    }

    const formattedNumber = new Intl.NumberFormat(currentCurrency.locale || 'en-US', {
      maximumFractionDigits: 0,
    }).format(converted);

    const base = `${currentCurrency.symbol}${formattedNumber}`;
    return options?.showCode ? `${base} ${currentCurrency.code}` : base;
  };

  const getRawUSD = (startingBudget?: string, minBudgetUSD?: number): number => {
    if (typeof minBudgetUSD === 'number' && !isNaN(minBudgetUSD)) {
      return minBudgetUSD;
    }
    if (startingBudget) {
      const cleaned = startingBudget.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return 500; // default baseline
  };

  /**
   * Formats engagement starting budget, automatically adjusted for user's detected geography and active currency
   */
  const formatBudget = (
    startingBudget?: string,
    minBudgetUSD?: number,
    options?: { prefix?: string; showUSDRef?: boolean; partnerCountry?: string }
  ): string => {
    const rawUSD = getRawUSD(startingBudget, minBudgetUSD);
    const prefix = options?.prefix !== undefined ? options.prefix : 'From ';

    // Apply geographic purchasing parity adjustment
    const parityFactor = useRegionalParity ? geographicProfile.parityMultiplier : 1.0;
    const isDomestic = options?.partnerCountry && options.partnerCountry.toLowerCase() === detectedLocation.country.toLowerCase();
    const domesticFactor = isDomestic ? 0.95 : 1.0;
    const adjustedUSD = Math.round(rawUSD * parityFactor * domesticFactor);

    const localAmount = Math.round(adjustedUSD * currentCurrency.rateAgainstUSD);
    const formattedLocal = new Intl.NumberFormat(currentCurrency.locale || 'en-US', {
      maximumFractionDigits: 0,
    }).format(localAmount);

    const formatted = `${currentCurrency.symbol}${formattedLocal}`;

    if (options?.showUSDRef && currency !== 'USD') {
      return `${prefix}${formatted} (≈ $${adjustedUSD.toLocaleString()} USD)`;
    }

    return `${prefix}${formatted}`;
  };

  /**
   * Calculates baseline hourly consultation rate in USD based on partner tier or custom rate
   */
  const getConsultationRateUSD = (partner: Partner, options?: { applyGeoAdjustment?: boolean }): number => {
    const localized = calculateLocalizedConsultationRate(
      partner,
      detectedLocation.country,
      currentCurrency.rateAgainstUSD,
      currentCurrency.symbol,
      currentCurrency.locale,
      options?.applyGeoAdjustment !== false && useRegionalParity
    );
    return localized.adjustedUSD;
  };

  /**
   * Formats the partner's hourly consultation rate into the user's localized currency and geography
   */
  const formatHourlyRate = (
    partner: Partner,
    options?: { showUSDRef?: boolean; compact?: boolean }
  ): string => {
    const localized = calculateLocalizedConsultationRate(
      partner,
      detectedLocation.country,
      currentCurrency.rateAgainstUSD,
      currentCurrency.symbol,
      currentCurrency.locale,
      useRegionalParity
    );

    if (options?.compact) {
      return localized.formattedRate;
    }

    if (options?.showUSDRef && currency !== 'USD') {
      return `${localized.formattedRate} (${localized.formattedUSDRef})`;
    }
    return localized.formattedRate;
  };

  /**
   * Formats consultation offering text (Discovery Session + Hourly Advisory rate)
   */
  const formatConsultationRate = (
    partner: Partner,
    options?: { showUSDRef?: boolean; compact?: boolean; sessionPrefix?: boolean }
  ): string => {
    const localized = calculateLocalizedConsultationRate(
      partner,
      detectedLocation.country,
      currentCurrency.rateAgainstUSD,
      currentCurrency.symbol,
      currentCurrency.locale,
      useRegionalParity
    );

    if (options?.compact) {
      return localized.formattedRate;
    }

    const sessionText = options?.sessionPrefix !== false ? 'Free Discovery Call • ' : '';
    const rateText = localized.formattedRate;

    if (options?.showUSDRef && currency !== 'USD') {
      return `${sessionText}${rateText} (${localized.formattedUSDRef})`;
    }
    return `${sessionText}${rateText}`;
  };

  /**
   * Calculates localized service package price for any given service and partner
   */
  const formatServicePricing = (
    serviceName: string,
    partner: Partner,
    options?: { showUSDRef?: boolean; compact?: boolean }
  ): PartnerLocalizedServicePrice => {
    return calculateLocalizedServicePrice(
      serviceName,
      partner,
      detectedLocation.country,
      currentCurrency.rateAgainstUSD,
      currentCurrency.symbol,
      currentCurrency.code,
      currentCurrency.locale,
      useRegionalParity
    );
  };

  /**
   * Returns list of all partner services enriched with location-adjusted pricing in active currency
   */
  const getPartnerServicesWithPricing = (partner: Partner): PartnerLocalizedServicePrice[] => {
    return partner.services.map((srv) =>
      calculateLocalizedServicePrice(
        srv,
        partner,
        detectedLocation.country,
        currentCurrency.rateAgainstUSD,
        currentCurrency.symbol,
        currentCurrency.code,
        currentCurrency.locale,
        useRegionalParity
      )
    );
  };

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    currentCurrency,
    allCurrencies: SUPPORTED_CURRENCIES,
    convertFromUSD,
    formatAmount,
    formatBudget,
    getRawUSD,
    getConsultationRateUSD,
    formatConsultationRate,
    formatHourlyRate,
    formatServicePricing,
    getPartnerServicesWithPricing,
    geographicProfile,
    useRegionalParity,
    setUseRegionalParity,
    isDomesticPartner,
    detectedLocation,
    autoLocationSync,
    setAutoLocationSync,
    syncWithLocation,
    isLocationAdjusted,
    recommendedCurrency,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextValue => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
