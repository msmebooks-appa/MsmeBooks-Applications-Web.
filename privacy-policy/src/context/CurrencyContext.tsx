import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  region: 'West Africa' | 'East Africa' | 'Southern & Central' | 'North Africa & Middle East' | 'Global';
  // Rate expressed as 1 Unit of this Currency = X NGN (Nigerian Naira as base ledger currency)
  rateToNgn: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    region: 'West Africa',
    rateToNgn: 1.0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    region: 'Global',
    rateToNgn: 1500.0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    region: 'Global',
    rateToNgn: 1920.0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    region: 'Global',
    rateToNgn: 1630.0,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    region: 'East Africa',
    rateToNgn: 11.5,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    region: 'Southern & Central',
    rateToNgn: 82.5,
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    flag: '🇬🇭',
    region: 'West Africa',
    rateToNgn: 98.0,
  },
  MAD: {
    code: 'MAD',
    symbol: 'MAD',
    name: 'Moroccan Dirham',
    flag: '🇲🇦',
    region: 'North Africa & Middle East',
    rateToNgn: 150.0,
  },
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA Franc',
    flag: '🇨🇲',
    region: 'Southern & Central',
    rateToNgn: 2.48,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    region: 'North Africa & Middle East',
    rateToNgn: 408.0,
  },
  UGX: {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    flag: '🇺🇬',
    region: 'East Africa',
    rateToNgn: 0.40,
  },
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    flag: '🇹🇿',
    region: 'East Africa',
    rateToNgn: 0.58,
  },
  RWF: {
    code: 'RWF',
    symbol: 'RF',
    name: 'Rwandan Franc',
    flag: '🇷🇼',
    region: 'East Africa',
    rateToNgn: 1.09,
  },
  ZMW: {
    code: 'ZMW',
    symbol: 'ZK',
    name: 'Zambian Kwacha',
    flag: '🇿🇲',
    region: 'Southern & Central',
    rateToNgn: 55.0,
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    flag: '🇪🇬',
    region: 'North Africa & Middle East',
    rateToNgn: 31.0,
  },
  ZIP: {
    code: 'ZIP',
    symbol: 'ZiG',
    name: 'Zimbabwe Gold (ZiG)',
    flag: '🇿🇼',
    region: 'Southern & Central',
    rateToNgn: 60.0,
  },
};

export const ALL_CURRENCY_CODES: CurrencyCode[] = [
  'NGN',
  'USD',
  'GBP',
  'KES',
  'ZAR',
  'GHS',
  'MAD',
  'XAF',
  'AED',
  'UGX',
  'TZS',
  'RWF',
  'ZMW',
  'EGP',
  'ZIP',
  'EUR',
];

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyMeta: CurrencyMeta;
  setCurrency: (code: CurrencyCode) => void;
  currencies: CurrencyMeta[];
  convert: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
  formatMoney: (
    amountInNgn: number,
    options?: {
      compact?: boolean;
      decimals?: number;
      showCode?: boolean;
    }
  ) => string;
  formatAmount: (
    amount: number,
    fromCurrency: CurrencyCode,
    options?: {
      compact?: boolean;
      decimals?: number;
      showCode?: boolean;
    }
  ) => string;
  exchangeRateNotice: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('msmebooks_currency');
      if (stored && stored in CURRENCIES) {
        return stored as CurrencyCode;
      }
    }
    return 'NGN';
  });

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      if (typeof window !== 'undefined') {
        localStorage.setItem('msmebooks_currency', code);
      }
    }
  };

  const currentMeta = CURRENCIES[currency] || CURRENCIES.NGN;

  // Convert any amount from one currency to another using the rateToNgn bridge
  const convert = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    const fromRate = CURRENCIES[from]?.rateToNgn || 1.0;
    const toRate = CURRENCIES[to]?.rateToNgn || 1.0;
    const amountInNgn = amount * fromRate;
    return amountInNgn / toRate;
  };

  // Format an amount originally denominated in NGN (the statutory base currency) into the active selected currency
  const formatMoney = (
    amountInNgn: number,
    options?: {
      compact?: boolean;
      decimals?: number;
      showCode?: boolean;
    }
  ): string => {
    const targetMeta = currentMeta;
    const converted = amountInNgn / targetMeta.rateToNgn;
    const showCode = options?.showCode ?? false;
    const compact = options?.compact ?? false;

    if (compact) {
      const absVal = Math.abs(converted);
      let suffix = '';
      let divisor = 1;

      if (absVal >= 1_000_000_000) {
        suffix = 'B';
        divisor = 1_000_000_000;
      } else if (absVal >= 1_000_000) {
        suffix = 'M';
        divisor = 1_000_000;
      } else if (absVal >= 1_000) {
        suffix = 'K';
        divisor = 1_000;
      }

      const formattedVal = (converted / divisor).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });

      return `${targetMeta.symbol}${formattedVal}${suffix}${showCode ? ` ${targetMeta.code}` : ''}`;
    }

    const defaultDecimals =
      options?.decimals !== undefined
        ? options.decimals
        : ['UGX', 'TZS', 'RWF', 'XAF'].includes(targetMeta.code)
        ? 0
        : converted >= 1000
        ? 0
        : 2;

    const formattedVal = converted.toLocaleString(undefined, {
      minimumFractionDigits: defaultDecimals,
      maximumFractionDigits: defaultDecimals,
    });

    return `${targetMeta.symbol}${formattedVal}${showCode ? ` ${targetMeta.code}` : ''}`;
  };

  const formatAmount = (
    amount: number,
    fromCurrency: CurrencyCode,
    options?: {
      compact?: boolean;
      decimals?: number;
      showCode?: boolean;
    }
  ): string => {
    const amountInNgn = amount * (CURRENCIES[fromCurrency]?.rateToNgn || 1.0);
    return formatMoney(amountInNgn, options);
  };

  const exchangeRateNotice =
    currency === 'NGN'
      ? 'Base statutory accounting currency (1 NGN = ₦1.00)'
      : `1 ${currency} ≈ ₦${currentMeta.rateToNgn.toLocaleString(undefined, { maximumFractionDigits: 2 })} NGN`;

  const currencies = Object.values(CURRENCIES);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyMeta: currentMeta,
        setCurrency,
        currencies,
        convert,
        formatMoney,
        formatAmount,
        exchangeRateNotice,
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
