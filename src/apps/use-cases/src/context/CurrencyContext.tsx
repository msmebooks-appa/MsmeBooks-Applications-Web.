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
  name: string;
  symbol: string;
  flag: string;
  region: string;
  ratePerUSD: number; // 1 USD = X Currency Units
  decimals: number;
  symbolPosition: 'prefix' | 'suffix';
  isAfrican: boolean;
}

// Baseline Conversion Rates (Pegged to 1.0 USD as standard reference pivot)
export const CURRENCY_REGISTRY: Record<CurrencyCode, CurrencyInfo> = {
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    region: 'Nigeria & West Africa',
    ratePerUSD: 1550.0,
    decimals: 0,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    region: 'United States & Global',
    ratePerUSD: 1.0,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: false
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    flag: '🇬🇧',
    region: 'United Kingdom & International',
    ratePerUSD: 0.78,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: false
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    region: 'European Union',
    ratePerUSD: 0.92,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: false
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    region: 'Kenya & East Africa',
    ratePerUSD: 130.0,
    decimals: 0,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    region: 'South Africa & SADC',
    ratePerUSD: 18.25,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  GHS: {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    flag: '🇬🇭',
    region: 'Ghana & West Africa',
    ratePerUSD: 15.6,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  MAD: {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'MAD',
    flag: '🇲🇦',
    region: 'Morocco & North Africa',
    ratePerUSD: 9.85,
    decimals: 2,
    symbolPosition: 'suffix',
    isAfrican: true
  },
  XAF: {
    code: 'XAF',
    name: 'Central African CFA Franc',
    symbol: 'FCFA',
    flag: '🇨🇲',
    region: 'CEMAC / Central Africa',
    ratePerUSD: 605.0,
    decimals: 0,
    symbolPosition: 'suffix',
    isAfrican: true
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    region: 'United Arab Emirates & Gulf',
    ratePerUSD: 3.67,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: false
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    flag: '🇺🇬',
    region: 'Uganda & East Africa',
    ratePerUSD: 3700.0,
    decimals: 0,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    flag: '🇹🇿',
    region: 'Tanzania & East Africa',
    ratePerUSD: 2620.0,
    decimals: 0,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  RWF: {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'RF',
    flag: '🇷🇼',
    region: 'Rwanda & Great Lakes',
    ratePerUSD: 1390.0,
    decimals: 0,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  ZMW: {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'ZK',
    flag: '🇿🇲',
    region: 'Zambia & Southern Africa',
    ratePerUSD: 27.8,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    flag: '🇪🇬',
    region: 'Egypt & North Africa',
    ratePerUSD: 48.6,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: true
  },
  ZIP: {
    code: 'ZIP',
    name: 'Zimbabwe Gold (ZiG / ZIP)',
    symbol: 'ZiG',
    flag: '🇿🇼',
    region: 'Zimbabwe',
    ratePerUSD: 26.85,
    decimals: 2,
    symbolPosition: 'prefix',
    isAfrican: true
  }
};

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = Object.values(CURRENCY_REGISTRY);

export interface FormatCurrencyOptions {
  compact?: boolean;
  decimals?: number;
  showCode?: boolean;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyInfo: CurrencyInfo;
  currencies: CurrencyInfo[];
  setCurrency: (code: CurrencyCode) => void;
  convertFromUSD: (amountInUSD: number, targetCurrency?: CurrencyCode) => number;
  convertToUSD: (amount: number, fromCurrency?: CurrencyCode) => number;
  convertBetween: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
  formatUSD: (amountInUSD: number, options?: FormatCurrencyOptions) => string;
  formatCurrency: (amountInUSD: number, options?: FormatCurrencyOptions) => string;
  formatDirectAmount: (amount: number, targetCurrency?: CurrencyCode, options?: FormatCurrencyOptions) => string;
  getExchangeRateAgainstUSD: (code: CurrencyCode) => number;
  getExchangeRateAgainstActive: (code: CurrencyCode) => number;
  rates: Record<CurrencyCode, number>;
}

const STORAGE_KEY = 'msmebooks_selected_currency';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && saved in CURRENCY_REGISTRY) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'NGN';
  });

  const currencyInfo = useMemo(() => CURRENCY_REGISTRY[currency], [currency]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (code in CURRENCY_REGISTRY) {
      setCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // Storage might be restricted
      }
    }
  }, []);

  const convertFromUSD = useCallback(
    (amountInUSD: number, targetCurrency?: CurrencyCode): number => {
      const target = targetCurrency ? CURRENCY_REGISTRY[targetCurrency] : currencyInfo;
      return amountInUSD * target.ratePerUSD;
    },
    [currencyInfo]
  );

  const convertToUSD = useCallback(
    (amount: number, fromCurrency?: CurrencyCode): number => {
      const source = fromCurrency ? CURRENCY_REGISTRY[fromCurrency] : currencyInfo;
      if (source.ratePerUSD === 0) return 0;
      return amount / source.ratePerUSD;
    },
    [currencyInfo]
  );

  const convertBetween = useCallback(
    (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
      const source = CURRENCY_REGISTRY[from];
      const target = CURRENCY_REGISTRY[to];
      if (!source || !target || source.ratePerUSD === 0) return amount;
      const usdValue = amount / source.ratePerUSD;
      return usdValue * target.ratePerUSD;
    },
    []
  );

  const formatDirectAmount = useCallback(
    (amount: number, targetCurrency?: CurrencyCode, options?: FormatCurrencyOptions): string => {
      const target = targetCurrency ? CURRENCY_REGISTRY[targetCurrency] : currencyInfo;
      const { compact = false, showCode = false } = options || {};

      let decimals = options?.decimals !== undefined ? options.decimals : target.decimals;

      if (compact) {
        // Compact notation for large financial metrics (e.g., Millions, Billions, Thousands)
        const absVal = Math.abs(amount);
        let numPart = '';
        let suffix = '';

        if (absVal >= 1_000_000_000) {
          numPart = (amount / 1_000_000_000).toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
          });
          suffix = 'B';
        } else if (absVal >= 1_000_000) {
          numPart = (amount / 1_000_000).toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          });
          suffix = 'M';
        } else if (absVal >= 1_000) {
          numPart = (amount / 1_000).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
          });
          suffix = 'k';
        } else {
          numPart = amount.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
        }

        const formattedNumber = `${numPart}${suffix}`;
        if (target.symbolPosition === 'suffix') {
          return `${formattedNumber} ${target.symbol}${showCode ? ` (${target.code})` : ''}`;
        }
        return `${target.symbol}${target.symbol.length > 2 ? ' ' : ''}${formattedNumber}${showCode ? ` ${target.code}` : ''}`;
      }

      // Standard formatted currency
      const formattedNumber = amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });

      if (target.symbolPosition === 'suffix') {
        return `${formattedNumber} ${target.symbol}${showCode ? ` (${target.code})` : ''}`;
      }
      return `${target.symbol}${target.symbol.length > 2 ? ' ' : ''}${formattedNumber}${showCode ? ` ${target.code}` : ''}`;
    },
    [currencyInfo]
  );

  const formatUSD = useCallback(
    (amountInUSD: number, options?: FormatCurrencyOptions): string => {
      const converted = convertFromUSD(amountInUSD);
      return formatDirectAmount(converted, currency, options);
    },
    [convertFromUSD, formatDirectAmount, currency]
  );

  const getExchangeRateAgainstUSD = useCallback((code: CurrencyCode): number => {
    return CURRENCY_REGISTRY[code]?.ratePerUSD || 1.0;
  }, []);

  const getExchangeRateAgainstActive = useCallback(
    (code: CurrencyCode): number => {
      const targetRate = CURRENCY_REGISTRY[code]?.ratePerUSD || 1.0;
      return targetRate / currencyInfo.ratePerUSD;
    },
    [currencyInfo]
  );

  const rates = useMemo(() => {
    const r: Record<CurrencyCode, number> = {} as any;
    for (const c of SUPPORTED_CURRENCIES) {
      r[c.code] = c.ratePerUSD;
    }
    return r;
  }, []);

  const value: CurrencyContextType = {
    currency,
    currencyInfo,
    currencies: SUPPORTED_CURRENCIES,
    setCurrency,
    convertFromUSD,
    convertToUSD,
    convertBetween,
    formatUSD,
    formatCurrency: formatUSD,
    formatDirectAmount,
    getExchangeRateAgainstUSD,
    getExchangeRateAgainstActive,
    rates
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
