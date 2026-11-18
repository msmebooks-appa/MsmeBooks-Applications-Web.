import { SUPPORTED_CURRENCIES, updateLiveExchangeRates, registerCurrencyIfMissing } from '../utils/currency';

export interface ExchangeRateData {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  provider: string;
  isLive: boolean;
  timeLastUpdateUnix?: number;
}

const CACHE_KEY = 'msmebooks_live_exchange_rates_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache TTL

// Listeners for rate updates
type RateListener = (data: ExchangeRateData) => void;
const listeners: Set<RateListener> = new Set();

let currentExchangeData: ExchangeRateData = {
  base: 'NGN',
  rates: {},
  lastUpdated: 'Cached / Baseline Rates',
  provider: 'MsmeBooks System Standard',
  isLive: false,
};

/**
 * Register a callback that fires whenever exchange rates are updated
 */
export function subscribeToExchangeRates(listener: RateListener): () => void {
  listeners.add(listener);
  // Emit current data immediately
  listener(currentExchangeData);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(currentExchangeData);
    } catch (err) {
      console.warn('Error in exchange rate listener:', err);
    }
  });
}

/**
 * Load cached rates from localStorage
 */
function loadCachedRates(): ExchangeRateData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.rates && typeof parsed.rates === 'object') {
      return parsed as ExchangeRateData;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/**
 * Save rates to localStorage
 */
function saveCachedRates(data: ExchangeRateData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota or sandboxing
  }
}

// Initialise from cache on module load if available
const cached = loadCachedRates();
if (cached && Object.keys(cached.rates).length > 0) {
  currentExchangeData = cached;
  updateLiveExchangeRates(cached.rates);
}

/**
 * Primary fetch using open.er-api.com (Free public exchange rate API without key)
 * Backup fetch using cdn.jsdelivr.net currency-api
 */
export async function fetchLiveExchangeRates(forceRefresh = false): Promise<ExchangeRateData> {
  // If not forcing refresh and cache is fresh, return cache
  if (!forceRefresh && cached && cached.timeLastUpdateUnix) {
    const ageMs = Date.now() - cached.timeLastUpdateUnix * 1000;
    if (ageMs < CACHE_TTL_MS) {
      currentExchangeData = cached;
      return cached;
    }
  }

  // Attempt 1: open.er-api.com
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/NGN', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.result === 'success' && data.rates) {
        const rates: Record<string, number> = {};

        for (const [code, rateVal] of Object.entries(data.rates)) {
          if (typeof rateVal === 'number' && rateVal > 0) {
            rates[code.toUpperCase()] = rateVal;
            // Also ensure any non-standard currency gets auto-registered with a fallback profile
            registerCurrencyIfMissing(code.toUpperCase(), rateVal);
          }
        }

        const updatedData: ExchangeRateData = {
          base: 'NGN',
          rates,
          lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
          provider: 'ExchangeRate-API (Live)',
          isLive: true,
          timeLastUpdateUnix: data.time_last_update_unix || Math.floor(Date.now() / 1000),
        };

        updateLiveExchangeRates(rates);
        saveCachedRates(updatedData);
        currentExchangeData = updatedData;
        notifyListeners();
        return updatedData;
      }
    }
  } catch (err) {
    console.warn('ExchangeRate-API primary fetch failed, attempting backup source:', err);
  }

  // Attempt 2: Backup source (fawazahmed0 currency-api via jsdelivr)
  try {
    const backupRes = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ngn.json'
    );
    if (backupRes.ok) {
      const data = await backupRes.json();
      if (data && data.ngn) {
        const rates: Record<string, number> = {};
        for (const [code, rateVal] of Object.entries(data.ngn)) {
          if (typeof rateVal === 'number' && rateVal > 0) {
            const upperCode = code.toUpperCase();
            rates[upperCode] = rateVal;
            registerCurrencyIfMissing(upperCode, rateVal);
          }
        }

        const updatedData: ExchangeRateData = {
          base: 'NGN',
          rates,
          lastUpdated: data.date ? `${data.date} (Daily Backup)` : new Date().toUTCString(),
          provider: 'Currency-API / jsDelivr (Live)',
          isLive: true,
          timeLastUpdateUnix: Math.floor(Date.now() / 1000),
        };

        updateLiveExchangeRates(rates);
        saveCachedRates(updatedData);
        currentExchangeData = updatedData;
        notifyListeners();
        return updatedData;
      }
    }
  } catch (backupErr) {
    console.warn('Backup exchange rate fetch failed:', backupErr);
  }

  // Fallback to currently cached data or baseline
  return currentExchangeData;
}

/**
 * Get current rate data synchronously
 */
export function getCurrentExchangeData(): ExchangeRateData {
  return currentExchangeData;
}
