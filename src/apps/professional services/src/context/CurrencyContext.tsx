import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
  | 'KES'
  | 'ZAR'
  | 'GHS'
  | 'MAD'
  | 'XAF'
  | 'AED'
  | 'UGX'
  | 'TZS'
  | 'RWF'
  | 'ZMW'
  | 'EGP'
  | 'ZIP'
  | 'EUR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  region: string;
  rateFromNGN: number; // Multiply NGN base amount by this rate
  approxNGNPerUnit: number; // 1 unit in NGN for human display
}

export type FxRateSource = 'live' | 'cached' | 'default';

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    region: 'Nigeria',
    rateFromNGN: 1.0,
    approxNGNPerUnit: 1,
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    region: 'Global / US',
    rateFromNGN: 0.00067,
    approxNGNPerUnit: 1492,
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    region: 'United Kingdom',
    rateFromNGN: 0.00052,
    approxNGNPerUnit: 1923,
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    region: 'European Union',
    rateFromNGN: 0.00062,
    approxNGNPerUnit: 1613,
  },
  {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    region: 'Kenya / East Africa',
    rateFromNGN: 0.086,
    approxNGNPerUnit: 11.6,
  },
  {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    region: 'South Africa',
    rateFromNGN: 0.012,
    approxNGNPerUnit: 83.3,
  },
  {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    flag: '🇬🇭',
    region: 'Ghana / West Africa',
    rateFromNGN: 0.0105,
    approxNGNPerUnit: 95.2,
  },
  {
    code: 'MAD',
    symbol: 'MAD',
    name: 'Moroccan Dirham',
    flag: '🇲🇦',
    region: 'Morocco / North Africa',
    rateFromNGN: 0.0067,
    approxNGNPerUnit: 149.3,
  },
  {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA Franc',
    flag: '🇨🇲',
    region: 'CEMAC / Central Africa',
    rateFromNGN: 0.41,
    approxNGNPerUnit: 2.44,
  },
  {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    region: 'United Arab Emirates',
    rateFromNGN: 0.00246,
    approxNGNPerUnit: 406.5,
  },
  {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    flag: '🇺🇬',
    region: 'Uganda / East Africa',
    rateFromNGN: 2.45,
    approxNGNPerUnit: 0.41,
  },
  {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    flag: '🇹🇿',
    region: 'Tanzania / East Africa',
    rateFromNGN: 1.75,
    approxNGNPerUnit: 0.57,
  },
  {
    code: 'RWF',
    symbol: 'RWF',
    name: 'Rwandan Franc',
    flag: '🇷🇼',
    region: 'Rwanda / East Africa',
    rateFromNGN: 0.92,
    approxNGNPerUnit: 1.09,
  },
  {
    code: 'ZMW',
    symbol: 'ZK',
    name: 'Zambian Kwacha',
    flag: '🇿🇲',
    region: 'Zambia / Southern Africa',
    rateFromNGN: 0.018,
    approxNGNPerUnit: 55.6,
  },
  {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    flag: '🇪🇬',
    region: 'Egypt / North Africa',
    rateFromNGN: 0.033,
    approxNGNPerUnit: 30.3,
  },
  {
    code: 'ZIP',
    symbol: 'ZiG',
    name: 'Zimbabwe Gold (ZiG / ZIP)',
    flag: '🇿🇼',
    region: 'Zimbabwe',
    rateFromNGN: 0.0175,
    approxNGNPerUnit: 57.1,
  },
];

export const MAJOR_AFRICAN_CURRENCIES: CurrencyCode[] = ['NGN', 'KES', 'GHS', 'USD', 'ZAR'];

interface CurrencyContextType {
  currentCurrency: CurrencyInfo;
  currencyCode: CurrencyCode;
  setCurrencyCode: (code: CurrencyCode) => void;
  currencies: CurrencyInfo[];
  formatAmount: (amountInNGN: number, options?: { compact?: boolean; hideDecimals?: boolean }) => string;
  convertFromNGN: (amountInNGN: number) => number;
  formatPriceString: (rawPrice: string) => string;
  getExchangeRate: (fromCode: CurrencyCode, toCode: CurrencyCode) => number;
  convertBetween: (amount: number, fromCode: CurrencyCode, toCode: CurrencyCode) => number;
  isRefreshingRates: boolean;
  ratesSource: FxRateSource;
  lastRatesUpdatedAt: string | null;
  refreshExchangeRates: (force?: boolean) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_selected_currency';
const FX_CACHE_KEY = 'msmebooks_live_fx_rates';
const FX_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedFxPayload {
  rates: Partial<Record<CurrencyCode, number>>;
  fetchedAt: number;
  updatedAtIso: string;
}

function readCachedFx(): CachedFxPayload | null {
  try {
    const raw = localStorage.getItem(FX_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFxPayload;
    if (parsed && typeof parsed.rates === 'object' && typeof parsed.fetchedAt === 'number') {
      return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

function writeCachedFx(payload: CachedFxPayload): void {
  try {
    localStorage.setItem(FX_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
}

function extractSupportedRates(rawRates: Record<string, number>, lowercaseKeys = false): Partial<Record<CurrencyCode, number>> {
  const mapped: Partial<Record<CurrencyCode, number>> = { NGN: 1.0 };

  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency.code === 'NGN') continue;
    const lookupKeys =
      currency.code === 'ZIP'
        ? ['ZWG', 'ZIP']
        : [currency.code];

    for (const key of lookupKeys) {
      const apiKey = lowercaseKeys ? key.toLowerCase() : key;
      const val = rawRates[apiKey];
      if (typeof val === 'number' && Number.isFinite(val) && val > 0) {
        mapped[currency.code] = val;
        break;
      }
    }
  }

  return mapped;
}

async function fetchLiveNgRates(): Promise<{
  rates: Partial<Record<CurrencyCode, number>>;
  updatedAtIso: string;
} | null> {
  // Primary CORS-friendly real-time FX endpoint
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/NGN', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result === 'success' && data.rates && typeof data.rates === 'object') {
        const mapped = extractSupportedRates(data.rates, false);
        if (mapped.USD && mapped.KES && mapped.GHS) {
          return {
            rates: mapped,
            updatedAtIso: data.time_last_update_utc
              ? new Date(data.time_last_update_utc).toISOString()
              : new Date().toISOString(),
          };
        }
      }
    }
  } catch {
    // Fallback to secondary endpoint
  }

  // Secondary CDN FX endpoint
  try {
    const res = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ngn.json',
      { cache: 'no-store' }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.ngn && typeof data.ngn === 'object') {
        const mapped = extractSupportedRates(data.ngn, true);
        if (mapped.USD && mapped.KES && mapped.GHS) {
          return {
            rates: mapped,
            updatedAtIso: data.date
              ? new Date(data.date).toISOString()
              : new Date().toISOString(),
          };
        }
      }
    }
  } catch {
    // Fallback to cached / static default rates
  }

  return null;
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (saved && SUPPORTED_CURRENCIES.some(c => c.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'NGN';
  });

  const initialCache = useMemo(() => readCachedFx(), []);
  const [liveRates, setLiveRates] = useState<Partial<Record<CurrencyCode, number>>>(
    () => initialCache?.rates || {}
  );
  const [ratesSource, setRatesSource] = useState<FxRateSource>(() =>
    initialCache ? 'cached' : 'default'
  );
  const [lastRatesUpdatedAt, setLastRatesUpdatedAt] = useState<string | null>(
    () => initialCache?.updatedAtIso || null
  );
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  const refreshExchangeRates = useCallback(async (force = false) => {
    const cached = readCachedFx();
    const isFreshCache = cached && Date.now() - cached.fetchedAt < FX_CACHE_TTL_MS;

    if (!force && isFreshCache && cached) {
      setLiveRates(cached.rates);
      setRatesSource('cached');
      setLastRatesUpdatedAt(cached.updatedAtIso);
      return;
    }

    setIsRefreshingRates(true);
    try {
      const fetched = await fetchLiveNgRates();
      if (fetched) {
        const payload: CachedFxPayload = {
          rates: fetched.rates,
          fetchedAt: Date.now(),
          updatedAtIso: fetched.updatedAtIso,
        };
        writeCachedFx(payload);
        setLiveRates(fetched.rates);
        setRatesSource('live');
        setLastRatesUpdatedAt(fetched.updatedAtIso);
      } else if (cached) {
        setLiveRates(cached.rates);
        setRatesSource('cached');
        setLastRatesUpdatedAt(cached.updatedAtIso);
      }
    } finally {
      setIsRefreshingRates(false);
    }
  }, []);

  useEffect(() => {
    void refreshExchangeRates(false);
  }, [refreshExchangeRates]);

  const currencies: CurrencyInfo[] = useMemo(() => {
    return SUPPORTED_CURRENCIES.map((base) => {
      const liveRate = liveRates[base.code];
      if (base.code === 'NGN' || typeof liveRate !== 'number' || liveRate <= 0) {
        return base;
      }
      const inverseNGN = 1 / liveRate;
      return {
        ...base,
        rateFromNGN: liveRate,
        approxNGNPerUnit:
          inverseNGN >= 100
            ? Math.round(inverseNGN)
            : Number(inverseNGN.toFixed(inverseNGN >= 10 ? 1 : 2)),
      };
    });
  }, [liveRates]);

  const currentCurrency = useMemo(() => {
    return currencies.find(c => c.code === currencyCode) || currencies[0];
  }, [currencies, currencyCode]);

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  const formatConvertedNumber = useCallback((converted: number, hideDecimals = false): string => {
    if (converted > 0 && converted < 10 && !hideDecimals) {
      return converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return Math.round(converted).toLocaleString();
  }, []);

  const convertFromNGN = (amountInNGN: number): number => {
    const converted = amountInNGN * currentCurrency.rateFromNGN;
    if (converted > 0 && converted < 10) {
      return Number(converted.toFixed(2));
    }
    return Math.round(converted);
  };

  const formatAmount = (
    amountInNGN: number,
    options?: { compact?: boolean; hideDecimals?: boolean }
  ): string => {
    const converted = amountInNGN * currentCurrency.rateFromNGN;

    if (options?.compact) {
      if (converted >= 1_000_000) {
        return `${currentCurrency.symbol}${(converted / 1_000_000).toFixed(2)}M`;
      }
      if (converted >= 1_000) {
        return `${currentCurrency.symbol}${(converted / 1_000).toFixed(1)}k`;
      }
    }

    return `${currentCurrency.symbol}${formatConvertedNumber(converted, options?.hideDecimals)}`;
  };

  /**
   * Helper that intelligently transforms any price string:
   * e.g.:
   *  - "₦35,000" -> "$23" or "KSh 3,010"
   *  - "₦95,000 / $80 per month" -> "$64 / month" or "₦95,000 / month"
   *  - "Supermarket Turnkey Rollout (From ₦280,000)" -> "Supermarket Turnkey Rollout (From $188)"
   *  - "GHS 450 (~₦42,000)" -> "GH₵441" or "$28"
   *  - "Request Custom Quote" -> "Request Custom Quote"
   */
  const formatPriceString = (rawPrice: string): string => {
    if (!rawPrice) return '';

    // If it's a quote / non-numeric string
    if (
      rawPrice.toLowerCase().includes('quote') ||
      rawPrice.toLowerCase().includes('contact') ||
      rawPrice.toLowerCase().includes('free')
    ) {
      return rawPrice;
    }

    // Check for monthly / recurring suffix
    const isPerMonth = /per month|\/mo|monthly/i.test(rawPrice);
    const suffix = isPerMonth ? ' / month' : '';

    // Try to extract NGN amount:
    // 1. Look for (~₦XX,XXX) or ₦XX,XXX
    const ngnMatch = rawPrice.match(/₦\s*([\d,]+)/);
    if (ngnMatch && ngnMatch[1]) {
      const ngnVal = parseInt(ngnMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(ngnVal)) {
        const converted = ngnVal * currentCurrency.rateFromNGN;
        const prefix = /from\s+/i.test(rawPrice) ? 'From ' : '';
        return `${prefix}${currentCurrency.symbol}${formatConvertedNumber(converted)}${suffix}`;
      }
    }

    // 2. Look for USD amount if no NGN: $XX
    const usdMatch = rawPrice.match(/\$\s*([\d,]+)/);
    if (usdMatch && usdMatch[1]) {
      const usdVal = parseInt(usdMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(usdVal)) {
        const usdCurrency = currencies.find((c) => c.code === 'USD');
        const ngnPerUsd = usdCurrency && usdCurrency.rateFromNGN > 0 ? 1 / usdCurrency.rateFromNGN : 1492;
        const ngnVal = usdVal * ngnPerUsd;
        const converted = ngnVal * currentCurrency.rateFromNGN;
        const prefix = /from\s+/i.test(rawPrice) ? 'From ' : '';
        return `${prefix}${currentCurrency.symbol}${formatConvertedNumber(converted)}${suffix}`;
      }
    }

    // 3. Look for plain numbers
    const numMatch = rawPrice.match(/([\d,]+)/);
    if (numMatch && numMatch[1]) {
      const numVal = parseInt(numMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(numVal) && numVal > 100) {
        const converted = numVal * currentCurrency.rateFromNGN;
        return `${currentCurrency.symbol}${formatConvertedNumber(converted)}${suffix}`;
      }
    }

    return rawPrice;
  };

  const getExchangeRate = (fromCode: CurrencyCode, toCode: CurrencyCode): number => {
    const from = currencies.find((c) => c.code === fromCode) || currencies[0];
    const to = currencies.find((c) => c.code === toCode) || currencies[0];
    if (!from || !to || from.rateFromNGN === 0) return 1;
    return to.rateFromNGN / from.rateFromNGN;
  };

  const convertBetween = (amount: number, fromCode: CurrencyCode, toCode: CurrencyCode): number => {
    const rate = getExchangeRate(fromCode, toCode);
    return amount * rate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        currencyCode,
        setCurrencyCode,
        currencies,
        formatAmount,
        convertFromNGN,
        formatPriceString,
        getExchangeRate,
        convertBetween,
        isRefreshingRates,
        ratesSource,
        lastRatesUpdatedAt,
        refreshExchangeRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
