import { useState, useEffect, useCallback } from 'react';
import { CountryInfo, CurrencyCode } from '../types';
import { COUNTRIES } from '../data/mockData';

// Map common African & global timezones for instant client-side resolution
const TIMEZONE_TO_COUNTRY_CODE: Record<string, string> = {
  'Africa/Lagos': 'NG',
  'Africa/Accra': 'GH',
  'Africa/Nairobi': 'KE',
  'Africa/Johannesburg': 'ZA',
  'Africa/Kigali': 'RW',
  'Africa/Kampala': 'UG',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Abidjan': 'CI',
  'Africa/Cairo': 'EG',
  'Europe/London': 'GB',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'US',
  'Europe/Paris': 'EU',
  'Europe/Berlin': 'EU',
  'Europe/Amsterdam': 'EU',
  'Europe/Madrid': 'EU',
  'Europe/Rome': 'EU',
};

// Map European Union country codes to EU entry
const EU_COUNTRY_CODES = new Set([
  'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'PT', 'AT', 'IE', 'FI', 'SE', 'DK', 'PL', 'GR', 'CZ', 'RO', 'HU'
]);

interface UseUserLocationResult {
  isDetecting: boolean;
  detectedCountryCode: string | null;
  detectedCity: string | null;
  detectedCountryName: string | null;
  isAutoDetected: boolean;
  error: string | null;
  reDetect: () => Promise<void>;
}

export function useUserLocation(
  setSelectedCountry: (country: CountryInfo) => void,
  setSelectedCurrency: (currency: CurrencyCode) => void
): UseUserLocationResult {
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [detectedCountryCode, setDetectedCountryCode] = useState<string | null>(null);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [detectedCountryName, setDetectedCountryName] = useState<string | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const matchCountryAndApply = useCallback((countryCode: string, cityName?: string) => {
    let targetCode = countryCode.toUpperCase();

    // Check if within EU
    if (EU_COUNTRY_CODES.has(targetCode)) {
      targetCode = 'EU';
    }

    // Match against our supported country list
    let matched = COUNTRIES.find(c => c.code === targetCode);

    // If not found, fallback to USD / Global
    if (!matched) {
      matched = COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
    }

    if (matched) {
      setSelectedCountry(matched);
      setSelectedCurrency(matched.currency);
      setDetectedCountryCode(matched.code);
      setDetectedCountryName(matched.name);
      if (cityName) setDetectedCity(cityName);
      setIsAutoDetected(true);
    }
  }, [setSelectedCountry, setSelectedCurrency]);

  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    setError(null);

    // Step 1: Check if user already manually selected a preference in current session
    const manualPreference = localStorage.getItem('msmebooks_manual_country_code');
    if (manualPreference) {
      const savedCountry = COUNTRIES.find(c => c.code === manualPreference);
      if (savedCountry) {
        setSelectedCountry(savedCountry);
        setSelectedCurrency(savedCountry.currency);
        setDetectedCountryCode(savedCountry.code);
        setDetectedCountryName(savedCountry.name);
        setIsDetecting(false);
        return;
      }
    }

    // Step 2: Instant Timezone Heuristic
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTimeZone && TIMEZONE_TO_COUNTRY_CODE[userTimeZone]) {
        const heuristicCode = TIMEZONE_TO_COUNTRY_CODE[userTimeZone];
        matchCountryAndApply(heuristicCode);
      }
    } catch {
      // Ignore Intl errors
    }

    // Step 3: Fetch verified IP Geolocation from APIs with fallback & timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Attempt 1: ipapi.co (standard free IP geolocation endpoint)
      let resolved = false;
      try {
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.country_code) {
            matchCountryAndApply(data.country_code, data.city);
            resolved = true;
          }
        }
      } catch {
        // Fallback to secondary service
      }

      // Attempt 2 if attempt 1 was blocked or failed: ipwho.is
      if (!resolved) {
        const fallbackRes = await fetch('https://ipwho.is/', {
          signal: controller.signal,
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.success && fallbackData.country_code) {
            matchCountryAndApply(fallbackData.country_code, fallbackData.city);
            resolved = true;
          }
        }
      }

      clearTimeout(timeoutId);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unable to detect IP location');
      }
    } finally {
      setIsDetecting(false);
    }
  }, [matchCountryAndApply, setSelectedCountry, setSelectedCurrency]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return {
    isDetecting,
    detectedCountryCode,
    detectedCity,
    detectedCountryName,
    isAutoDetected,
    error,
    reDetect: detectLocation,
  };
}
