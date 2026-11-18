import { Currency, CurrencyInfo } from '../types';
import { SUPPORTED_CURRENCIES, detectUserCurrency } from '../utils/currency';

export interface IpLocationData {
  country: string;
  countryCode: string;
  currency: Currency;
  currencySymbol: string;
  flag: string;
  ip?: string;
  city?: string;
  isSimulated?: boolean;
}

// Country code to standard currency mapping
const COUNTRY_TO_CURRENCY_MAP: Record<string, Currency> = {
  GB: 'GBP',
  UK: 'GBP',
  US: 'USD',
  NG: 'NGN',
  KE: 'KES',
  GH: 'GHS',
  ZA: 'ZAR',
  UG: 'UGX',
  TZ: 'TZS',
  RW: 'RWF',
  EG: 'EGP',
  MA: 'MAD',
  SN: 'XOF',
  CI: 'XOF',
  BF: 'XOF',
  ML: 'XOF',
  BJ: 'XOF',
  TG: 'XOF',
  NE: 'XOF',
  CM: 'XAF',
  GA: 'XAF',
  CG: 'XAF',
  TD: 'XAF',
  CF: 'XAF',
  ZM: 'ZMW',
  BW: 'BWP',
  CA: 'CAD',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
  AE: 'AED',
  SA: 'SAR',
  IN: 'INR',
  AU: 'AUD',
  JP: 'JPY',
  CN: 'CNY',
  BR: 'BRL',
};

// Common country names
const COUNTRY_NAMES: Record<string, string> = {
  GB: 'United Kingdom',
  UK: 'United Kingdom',
  US: 'United States',
  NG: 'Nigeria',
  KE: 'Kenya',
  GH: 'Ghana',
  ZA: 'South Africa',
  UG: 'Uganda',
  TZ: 'Tanzania',
  RW: 'Rwanda',
  EG: 'Egypt',
  MA: 'Morocco',
  SN: 'Senegal',
  CI: "Côte d'Ivoire",
  CM: 'Cameroon',
  ZM: 'Zambia',
  BW: 'Botswana',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  AE: 'United Arab Emirates',
  IN: 'India',
  AU: 'Australia',
};

const STORAGE_KEY = 'msmebooks_detected_ip_location';
const SIMULATED_KEY = 'msmebooks_simulated_ip_country';

/**
 * Detects location and corresponding currency using free public IP APIs,
 * with graceful fallback to browser timezone heuristics.
 */
export async function detectIpLocation(): Promise<IpLocationData> {
  // 1. Check if user set a simulated country for testing/demonstration
  if (typeof window !== 'undefined') {
    try {
      const simulatedCode = sessionStorage.getItem(SIMULATED_KEY);
      if (simulatedCode && simulatedCode in COUNTRY_TO_CURRENCY_MAP) {
        return createLocationDataFromCode(simulatedCode, true);
      }
    } catch {
      // Ignore
    }
  }

  // 2. Check cached detection in current session
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.currency && parsed.countryCode) {
          return parsed as IpLocationData;
        }
      }
    } catch {
      // Ignore
    }
  }

  // 3. Attempt live IP lookup via ipwho.is (fast, free, CORS-enabled, zero keys)
  try {
    const res = await fetch('https://ipwho.is/', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.country_code) {
        const code = data.country_code.toUpperCase();
        const currency = COUNTRY_TO_CURRENCY_MAP[code] || 'USD';
        const currInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

        const locationData: IpLocationData = {
          country: data.country || COUNTRY_NAMES[code] || code,
          countryCode: code,
          currency,
          currencySymbol: currInfo.symbol.trim(),
          flag: data.flag?.emoji || currInfo.flag || '🌐',
          ip: data.ip,
          city: data.city,
          isSimulated: false,
        };

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(locationData));
        } catch {
          // Ignore
        }

        return locationData;
      }
    }
  } catch (err) {
    console.warn('Live IP location lookup error, falling back to timezone/browser:', err);
  }

  // 4. Secondary fallback: timezone & browser language heuristic
  const fallbackCurrency = detectUserCurrency();
  const currInfo = SUPPORTED_CURRENCIES[fallbackCurrency] || SUPPORTED_CURRENCIES.NGN;
  const inferredCountry = currInfo.country || 'Detected Region';

  const fallbackData: IpLocationData = {
    country: inferredCountry,
    countryCode: currInfo.code.substring(0, 2),
    currency: fallbackCurrency,
    currencySymbol: currInfo.symbol.trim(),
    flag: currInfo.flag,
    isSimulated: false,
  };

  return fallbackData;
}

/**
 * Creates IpLocationData from a known country code
 */
function createLocationDataFromCode(code: string, isSimulated = false): IpLocationData {
  const upperCode = code.toUpperCase();
  const currency = COUNTRY_TO_CURRENCY_MAP[upperCode] || 'USD';
  const currInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

  return {
    country: COUNTRY_NAMES[upperCode] || upperCode,
    countryCode: upperCode,
    currency,
    currencySymbol: currInfo.symbol.trim(),
    flag: currInfo.flag,
    isSimulated,
  };
}

/**
 * Allows switching the simulated location for testing/demo purposes
 */
export function setSimulatedLocation(countryCode: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (countryCode) {
      sessionStorage.setItem(SIMULATED_KEY, countryCode.toUpperCase());
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.removeItem(SIMULATED_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}
