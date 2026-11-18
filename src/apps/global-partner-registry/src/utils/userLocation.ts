export type CurrencyCode =
  | 'USD'
  | 'NGN'
  | 'KES'
  | 'GHS'
  | 'ZAR'
  | 'GBP'
  | 'EUR'
  | 'CAD'
  | 'AED'
  | 'RWF'
  | 'UGX'
  | 'TZS'
  | 'XAF'
  | 'EGP'
  | 'INR'
  | 'AUD';

export interface UserLocationContext {
  country: string;
  city: string;
  countryCode: string;
  countryFlag: string;
  isAutoDetected: boolean;
}

export const STORAGE_LOCATION_KEY = 'msmebooks_user_manual_country';
export const LOCATION_CHANGED_EVENT = 'msmebooks-location-changed';

/**
 * Common African and global timezone to country & primary hub mapping
 */
export const TIMEZONE_TO_LOCATION: Record<
  string,
  { country: string; city: string; code: string; flag: string; currency: CurrencyCode }
> = {
  'Africa/Lagos': { country: 'Nigeria', city: 'Lagos', code: 'NG', flag: '🇳🇬', currency: 'NGN' },
  'Africa/Nairobi': { country: 'Kenya', city: 'Nairobi', code: 'KE', flag: '🇰🇪', currency: 'KES' },
  'Africa/Johannesburg': { country: 'South Africa', city: 'Johannesburg', code: 'ZA', flag: '🇿🇦', currency: 'ZAR' },
  'Africa/Accra': { country: 'Ghana', city: 'Accra', code: 'GH', flag: '🇬🇭', currency: 'GHS' },
  'Africa/Kigali': { country: 'Rwanda', city: 'Kigali', code: 'RW', flag: '🇷🇼', currency: 'RWF' },
  'Africa/Kampala': { country: 'Uganda', city: 'Kampala', code: 'UG', flag: '🇺🇬', currency: 'UGX' },
  'Africa/Dar_es_Salaam': { country: 'Tanzania', city: 'Dar es Salaam', code: 'TZ', flag: '🇹🇿', currency: 'TZS' },
  'Africa/Douala': { country: 'Cameroon', city: 'Douala', code: 'CM', flag: '🇨🇲', currency: 'XAF' },
  'Africa/Abidjan': { country: 'Côte d\'Ivoire', city: 'Abidjan', code: 'CI', flag: '🇨🇮', currency: 'XAF' },
  'Africa/Dakar': { country: 'Senegal', city: 'Dakar', code: 'SN', flag: '🇸🇳', currency: 'XAF' },
  'Africa/Cairo': { country: 'Egypt', city: 'Cairo', code: 'EG', flag: '🇪🇬', currency: 'EGP' },
  'Africa/Casablanca': { country: 'Morocco', city: 'Casablanca', code: 'MA', flag: '🇲🇦', currency: 'EUR' },
  'Africa/Addis_Ababa': { country: 'Ethiopia', city: 'Addis Ababa', code: 'ET', flag: '🇪🇹', currency: 'USD' },
  'Africa/Gaborone': { country: 'Botswana', city: 'Gaborone', code: 'BW', flag: '🇧🇼', currency: 'ZAR' },
  'Europe/London': { country: 'United Kingdom', city: 'London', code: 'GB', flag: '🇬🇧', currency: 'GBP' },
  'Europe/Paris': { country: 'France', city: 'Paris', code: 'FR', flag: '🇫🇷', currency: 'EUR' },
  'Europe/Berlin': { country: 'Germany', city: 'Berlin', code: 'DE', flag: '🇩🇪', currency: 'EUR' },
  'America/Toronto': { country: 'Canada', city: 'Toronto', code: 'CA', flag: '🇨🇦', currency: 'CAD' },
  'America/Vancouver': { country: 'Canada', city: 'Vancouver', code: 'CA', flag: '🇨🇦', currency: 'CAD' },
  'America/New_York': { country: 'United States', city: 'New York', code: 'US', flag: '🇺🇸', currency: 'USD' },
  'America/Chicago': { country: 'United States', city: 'Chicago', code: 'US', flag: '🇺🇸', currency: 'USD' },
  'America/Los_Angeles': { country: 'United States', city: 'Los Angeles', code: 'US', flag: '🇺🇸', currency: 'USD' },
  'Asia/Dubai': { country: 'UAE', city: 'Dubai', code: 'AE', flag: '🇦🇪', currency: 'AED' },
  'Asia/Kolkata': { country: 'India', city: 'Mumbai', code: 'IN', flag: '🇮🇳', currency: 'INR' },
  'Australia/Sydney': { country: 'Australia', city: 'Sydney', code: 'AU', flag: '🇦🇺', currency: 'AUD' },
};

/**
 * Country name/code to CurrencyCode mapping
 */
export const COUNTRY_TO_CURRENCY_MAP: Record<string, CurrencyCode> = {
  // Nigeria
  nigeria: 'NGN',
  ng: 'NGN',
  // Kenya
  kenya: 'KES',
  ke: 'KES',
  // Ghana
  ghana: 'GHS',
  gh: 'GHS',
  // South Africa
  'south africa': 'ZAR',
  za: 'ZAR',
  rsa: 'ZAR',
  // Rwanda
  rwanda: 'RWF',
  rw: 'RWF',
  // Uganda
  uganda: 'UGX',
  ug: 'UGX',
  // Tanzania
  tanzania: 'TZS',
  tz: 'TZS',
  // Central/West African CFA zone
  cameroon: 'XAF',
  cm: 'XAF',
  'côte d\'ivoire': 'XAF',
  'cote d\'ivoire': 'XAF',
  ci: 'XAF',
  senegal: 'XAF',
  sn: 'XAF',
  // Egypt
  egypt: 'EGP',
  eg: 'EGP',
  // Morocco
  morocco: 'EUR',
  ma: 'EUR',
  // Botswana
  botswana: 'ZAR',
  bw: 'ZAR',
  // Ethiopia
  ethiopia: 'USD',
  et: 'USD',
  // United Kingdom
  'united kingdom': 'GBP',
  uk: 'GBP',
  gb: 'GBP',
  england: 'GBP',
  // United States
  'united states': 'USD',
  usa: 'USD',
  us: 'USD',
  // Canada
  canada: 'CAD',
  ca: 'CAD',
  // UAE
  uae: 'AED',
  'united arab emirates': 'AED',
  ae: 'AED',
  dubai: 'AED',
  // India
  india: 'INR',
  in: 'INR',
  // Australia
  australia: 'AUD',
  au: 'AUD',
  // Eurozone
  germany: 'EUR',
  france: 'EUR',
  spain: 'EUR',
  italy: 'EUR',
  netherlands: 'EUR',
  ireland: 'EUR',
  belgium: 'EUR',
};

/**
 * Resolves the currency code associated with a country name or ISO country code
 */
export function getCurrencyForCountry(countryNameOrCode?: string): CurrencyCode {
  if (!countryNameOrCode) return 'USD';
  const clean = countryNameOrCode.trim().toLowerCase();
  if (COUNTRY_TO_CURRENCY_MAP[clean]) {
    return COUNTRY_TO_CURRENCY_MAP[clean];
  }
  // Substring checks
  if (clean.includes('nigeria')) return 'NGN';
  if (clean.includes('kenya')) return 'KES';
  if (clean.includes('ghana')) return 'GHS';
  if (clean.includes('south africa')) return 'ZAR';
  if (clean.includes('rwanda')) return 'RWF';
  if (clean.includes('uganda')) return 'UGX';
  if (clean.includes('tanzania')) return 'TZS';
  if (clean.includes('cameroon') || clean.includes('côte') || clean.includes('senegal')) return 'XAF';
  if (clean.includes('egypt')) return 'EGP';
  if (clean.includes('kingdom') || clean.includes('britain') || clean.includes('london')) return 'GBP';
  if (clean.includes('canada')) return 'CAD';
  if (clean.includes('emirates') || clean.includes('uae') || clean.includes('dubai')) return 'AED';
  if (clean.includes('india')) return 'INR';
  if (clean.includes('australia')) return 'AUD';
  if (clean.includes('united states') || clean.includes('america')) return 'USD';

  return 'USD';
}

/**
 * Detect or retrieve the user's active location context.
 */
export function getUserLocationContext(fallbackCountry?: string): UserLocationContext {
  if (typeof window === 'undefined') {
    return { country: 'Nigeria', city: 'Lagos', countryCode: 'NG', countryFlag: '🇳🇬', isAutoDetected: false };
  }

  // 1. Check if user manually selected a preference
  const manual = localStorage.getItem(STORAGE_LOCATION_KEY);
  if (manual) {
    try {
      const parsed = JSON.parse(manual);
      if (parsed.country) {
        return {
          country: parsed.country,
          city: parsed.city || '',
          countryCode: parsed.countryCode || parsed.code || 'NG',
          countryFlag: parsed.countryFlag || parsed.flag || '🌍',
          isAutoDetected: false,
        };
      }
    } catch {
      // ignore
    }
  }

  // 2. Check active directory country filter
  if (fallbackCountry) {
    const known = Object.values(TIMEZONE_TO_LOCATION).find(
      (loc) => loc.country.toLowerCase() === fallbackCountry.toLowerCase()
    );
    if (known) {
      return {
        country: known.country,
        city: known.city,
        countryCode: known.code,
        countryFlag: known.flag,
        isAutoDetected: false,
      };
    }
    return {
      country: fallbackCountry,
      city: '',
      countryCode: '',
      countryFlag: '🌍',
      isAutoDetected: false,
    };
  }

  // 3. TimeZone heuristic detection
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_LOCATION[tz]) {
      const item = TIMEZONE_TO_LOCATION[tz];
      return {
        country: item.country,
        city: item.city,
        countryCode: item.code,
        countryFlag: item.flag,
        isAutoDetected: true,
      };
    }
  } catch {
    // fallback
  }

  // Default to Nigeria (Largest SME ecosystem)
  return { country: 'Nigeria', city: 'Lagos', countryCode: 'NG', countryFlag: '🇳🇬', isAutoDetected: true };
}

/**
 * Save manual location preference and notify listeners
 */
export function setUserLocationPreference(location: {
  country: string;
  city: string;
  flag?: string;
  code?: string;
  countryFlag?: string;
  countryCode?: string;
}) {
  if (typeof window === 'undefined') return;
  try {
    const payload: UserLocationContext = {
      country: location.country,
      city: location.city,
      countryCode: location.countryCode || location.code || '',
      countryFlag: location.countryFlag || location.flag || '🌍',
      isAutoDetected: false,
    };
    localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(LOCATION_CHANGED_EVENT, { detail: payload }));
    window.dispatchEvent(new CustomEvent('msmebooks-history-updated'));
  } catch {
    // ignore
  }
}
