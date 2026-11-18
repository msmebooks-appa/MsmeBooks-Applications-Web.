import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types';
import { CURRENCIES } from '../data/mockData';

export interface DetectedLocation {
  countryCode: string;
  countryName: string;
  city?: string;
}

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currency: CurrencyConfig;
  currencies: Record<CurrencyCode, CurrencyConfig>;
  formatAmount: (amountInNGN: number, options?: { compact?: boolean }) => string;
  convertFromNGN: (amountInNGN: number) => number;
  convertToNGN: (amountInCurrentCurrency: number) => number;
  isDetectingCurrency: boolean;
  isAutoDetected: boolean;
  detectedLocation: DetectedLocation | null;
}

const STORAGE_CURRENCY_KEY = 'msmebooks-currency';
const STORAGE_MANUAL_KEY = 'msmebooks-currency-manual';
const STORAGE_GEO_KEY = 'msmebooks-geo-location';

// Maps ISO 3166-1 alpha-2 country codes to supported regional currencies
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // Core African Markets
  NG: 'NGN',
  KE: 'KES',
  ZA: 'ZAR',
  NA: 'ZAR',
  LS: 'ZAR',
  SZ: 'ZAR',
  GH: 'GHS',
  MA: 'MAD',
  UG: 'UGX',
  TZ: 'TZS',
  RW: 'RWF',
  ZM: 'ZMW',
  EG: 'EGP',
  ZW: 'ZIP',
  // CEMAC & WAEMU CFA Franc Zone
  CM: 'XAF',
  GA: 'XAF',
  CG: 'XAF',
  TD: 'XAF',
  CF: 'XAF',
  GQ: 'XAF',
  SN: 'XAF',
  CI: 'XAF',
  BJ: 'XAF',
  TG: 'XAF',
  BF: 'XAF',
  ML: 'XAF',
  NE: 'XAF',
  GW: 'XAF',
  // Middle East Hub
  AE: 'AED',
  // UK
  GB: 'GBP',
  GG: 'GBP',
  JE: 'GBP',
  IM: 'GBP',
  // Eurozone
  AT: 'EUR',
  BE: 'EUR',
  HR: 'EUR',
  CY: 'EUR',
  EE: 'EUR',
  FI: 'EUR',
  FR: 'EUR',
  DE: 'EUR',
  GR: 'EUR',
  IE: 'EUR',
  IT: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  MT: 'EUR',
  NL: 'EUR',
  PT: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  ES: 'EUR',
  // Americas & Global Reserve Regions
  US: 'USD',
  CA: 'USD',
  AU: 'USD',
  NZ: 'USD',
  SG: 'USD',
};

const ISO_CURRENCY_TO_CODE: Record<string, CurrencyCode> = {
  NGN: 'NGN',
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR',
  KES: 'KES',
  ZAR: 'ZAR',
  GHS: 'GHS',
  MAD: 'MAD',
  XAF: 'XAF',
  XOF: 'XAF',
  AED: 'AED',
  UGX: 'UGX',
  TZS: 'TZS',
  RWF: 'RWF',
  ZMW: 'ZMW',
  EGP: 'EGP',
  ZIP: 'ZIP',
  ZWG: 'ZIP',
  ZWL: 'ZIP',
};

export function resolveCurrencyFromGeo(
  countryCode?: string,
  isoCurrencyCode?: string
): CurrencyCode {
  const normalizedCountry = countryCode?.trim().toUpperCase();
  if (normalizedCountry && COUNTRY_TO_CURRENCY[normalizedCountry]) {
    return COUNTRY_TO_CURRENCY[normalizedCountry];
  }

  const normalizedCurrency = isoCurrencyCode?.trim().toUpperCase();
  if (normalizedCurrency && ISO_CURRENCY_TO_CODE[normalizedCurrency]) {
    return ISO_CURRENCY_TO_CODE[normalizedCurrency];
  }

  // Default global fallback when country is successfully detected outside supported local markets
  if (normalizedCountry) {
    return 'USD';
  }

  return 'NGN';
}

interface GeoResult {
  countryCode: string;
  countryName: string;
  city?: string;
  currencyCode?: string;
}

async function fetchWithTimeout(url: string, timeoutMs: number, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  const onParentAbort = () => controller.abort();
  signal?.addEventListener('abort', onParentAbort);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', onParentAbort);
  }
}

async function detectUserGeoFromIP(signal: AbortSignal): Promise<GeoResult | null> {
  // Primary provider: ipapi.co
  try {
    const res = await fetchWithTimeout('https://ipapi.co/json/', 3500, signal);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error && data.country_code) {
        return {
          countryCode: String(data.country_code).toUpperCase(),
          countryName: String(data.country_name || data.country_code),
          city: data.city ? String(data.city) : undefined,
          currencyCode: data.currency ? String(data.currency).toUpperCase() : undefined,
        };
      }
    }
  } catch {
    if (signal.aborted) return null;
  }

  // Secondary provider: ipwho.is
  try {
    const res = await fetchWithTimeout('https://ipwho.is/', 3500, signal);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.country_code) {
        return {
          countryCode: String(data.country_code).toUpperCase(),
          countryName: String(data.country || data.country_code),
          city: data.city ? String(data.city) : undefined,
          currencyCode: data.currency?.code ? String(data.currency.code).toUpperCase() : undefined,
        };
      }
    }
  } catch {
    if (signal.aborted) return null;
  }

  // Tertiary lightweight provider: api.country.is
  try {
    const res = await fetchWithTimeout('https://api.country.is/', 3000, signal);
    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        const code = String(data.country).toUpperCase();
        return {
          countryCode: code,
          countryName: code,
        };
      }
    }
  } catch {
    // Graceful fallback handled by caller
  }

  return null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{
  children: React.ReactNode;
  initialCurrency?: CurrencyCode;
}> = ({ children, initialCurrency }) => {
  const hasSavedPreferenceRef = useRef<boolean>(false);
  const hasUserSelectedRef = useRef<boolean>(false);

  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>(() => {
    if (initialCurrency && CURRENCIES[initialCurrency]) {
      hasSavedPreferenceRef.current = true;
      return initialCurrency;
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_CURRENCY_KEY) as CurrencyCode | null;
        if (saved && CURRENCIES[saved]) {
          hasSavedPreferenceRef.current = true;
          return saved;
        }
      } catch {
        // Ignore storage errors in restricted environments
      }
    }
    return 'NGN';
  });

  const [isDetectingCurrency, setIsDetectingCurrency] = useState<boolean>(false);

  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(() => {
    if (initialCurrency || typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(STORAGE_CURRENCY_KEY) as CurrencyCode | null;
      const isManual = localStorage.getItem(STORAGE_MANUAL_KEY) === 'true';
      return Boolean(saved && CURRENCIES[saved] && !isManual);
    } catch {
      return false;
    }
  });

  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_GEO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DetectedLocation;
        if (parsed?.countryCode) return parsed;
      }
    } catch {
      // Ignore invalid cached geo data
    }
    return null;
  });

  // Auto-detect user location via IP on first visit (when no saved preference exists)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialCurrency || hasSavedPreferenceRef.current) return;

    const abortController = new AbortController();
    let isMounted = true;

    const runDetection = async () => {
      setIsDetectingCurrency(true);
      const geo = await detectUserGeoFromIP(abortController.signal);

      if (!isMounted || abortController.signal.aborted) return;

      if (geo && !hasUserSelectedRef.current) {
        const resolved = resolveCurrencyFromGeo(geo.countryCode, geo.currencyCode);
        const locationInfo: DetectedLocation = {
          countryCode: geo.countryCode,
          countryName: geo.countryName,
          city: geo.city,
        };

        setDetectedLocation(locationInfo);

        if (CURRENCIES[resolved]) {
          setCurrentCurrencyState(resolved);
          setIsAutoDetected(true);
          try {
            localStorage.setItem(STORAGE_CURRENCY_KEY, resolved);
            localStorage.setItem(STORAGE_GEO_KEY, JSON.stringify(locationInfo));
          } catch {
            // Ignore storage errors
          }
        }
      }

      if (isMounted) {
        setIsDetectingCurrency(false);
      }
    };

    runDetection();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [initialCurrency]);

  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (!CURRENCIES[code]) return;
    hasUserSelectedRef.current = true;
    setCurrentCurrencyState(code);
    setIsAutoDetected(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CURRENCY_KEY, code);
        localStorage.setItem(STORAGE_MANUAL_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
    }
  }, []);

  const formatAmount = (amountInNGN: number, options?: { compact?: boolean }): string => {
    return currency.format(amountInNGN, options);
  };

  const convertFromNGN = (amountInNGN: number): number => {
    return amountInNGN * currency.rate;
  };

  const convertToNGN = (amountInCurrentCurrency: number): number => {
    return currency.rate > 0 ? amountInCurrentCurrency / currency.rate : amountInCurrentCurrency;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        currency,
        currencies: CURRENCIES,
        formatAmount,
        convertFromNGN,
        convertToNGN,
        isDetectingCurrency,
        isAutoDetected,
        detectedLocation,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
