import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode } from '../types/policy';

export interface CurrencyDetail {
  code: CurrencyCode;
  name: string;
  symbol: string;
  symbolNative?: string;
  flag: string;
  rateToUSD: number; // 1 USD = rateToUSD in this currency
  decimals: number;
  region: string;
  country: string;
}

export const SUPPORTED_CURRENCIES: CurrencyDetail[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    symbolNative: '₦',
    flag: '🇳🇬',
    rateToUSD: 1550,
    decimals: 0,
    region: 'West Africa',
    country: 'Nigeria',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolNative: '$',
    flag: '🇺🇸',
    rateToUSD: 1.0,
    decimals: 2,
    region: 'Global / Americas',
    country: 'United States',
  },
  {
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    symbolNative: '£',
    flag: '🇬🇧',
    rateToUSD: 0.79,
    decimals: 2,
    region: 'Europe / UK',
    country: 'United Kingdom',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolNative: '€',
    flag: '🇪🇺',
    rateToUSD: 0.92,
    decimals: 2,
    region: 'European Union',
    country: 'Eurozone',
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    symbolNative: 'KSh',
    flag: '🇰🇪',
    rateToUSD: 130.0,
    decimals: 0,
    region: 'East Africa',
    country: 'Kenya',
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    symbolNative: 'R',
    flag: '🇿🇦',
    rateToUSD: 18.25,
    decimals: 2,
    region: 'Southern Africa',
    country: 'South Africa',
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    symbolNative: 'GH₵',
    flag: '🇬🇭',
    rateToUSD: 15.60,
    decimals: 2,
    region: 'West Africa',
    country: 'Ghana',
  },
  {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'MAD',
    symbolNative: 'د.م.',
    flag: '🇲🇦',
    rateToUSD: 10.15,
    decimals: 2,
    region: 'North Africa',
    country: 'Morocco',
  },
  {
    code: 'XAF',
    name: 'Central African CFA Franc',
    symbol: 'FCFA',
    symbolNative: 'FCFA',
    flag: '🇨🇲',
    rateToUSD: 605.0,
    decimals: 0,
    region: 'Central Africa (CEMAC)',
    country: 'CEMAC Region',
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    symbolNative: 'د.إ',
    flag: '🇦🇪',
    rateToUSD: 3.67,
    decimals: 2,
    region: 'Middle East',
    country: 'United Arab Emirates',
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    symbolNative: 'USh',
    flag: '🇺🇬',
    rateToUSD: 3720.0,
    decimals: 0,
    region: 'East Africa',
    country: 'Uganda',
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    symbolNative: 'TSh',
    flag: '🇹🇿',
    rateToUSD: 2620.0,
    decimals: 0,
    region: 'East Africa',
    country: 'Tanzania',
  },
  {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'FRw',
    symbolNative: 'FRw',
    flag: '🇷🇼',
    rateToUSD: 1360.0,
    decimals: 0,
    region: 'East Africa',
    country: 'Rwanda',
  },
  {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'ZK',
    symbolNative: 'ZK',
    flag: '🇿🇲',
    rateToUSD: 27.20,
    decimals: 2,
    region: 'Southern Africa',
    country: 'Zambia',
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    symbolNative: 'ج.م',
    flag: '🇪🇬',
    rateToUSD: 48.60,
    decimals: 2,
    region: 'North Africa',
    country: 'Egypt',
  },
  {
    code: 'ZIP',
    name: 'Zimbabwe Gold / ZiG',
    symbol: 'ZiG',
    symbolNative: 'Z$',
    flag: '🇿🇼',
    rateToUSD: 13.80,
    decimals: 2,
    region: 'Southern Africa',
    country: 'Zimbabwe',
  },
];

const CURRENCY_MAP = new Map<CurrencyCode, CurrencyDetail>(
  SUPPORTED_CURRENCIES.map((c) => [c.code, c])
);

export interface FormattedConvertedAmount {
  convertedAmount: number;
  formatted: string;
  originalAmount: number;
  originalCurrency: CurrencyCode;
  originalFormatted: string;
  isConverted: boolean;
  targetCurrency: CurrencyCode;
  exchangeRateDescription: string;
}

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyDetail: CurrencyDetail;
  currencies: CurrencyDetail[];
  convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency?: CurrencyCode) => number;
  formatCurrency: (amount: number, currencyCode?: CurrencyCode, options?: { showCode?: boolean; maximumFractionDigits?: number }) => string;
  formatConverted: (amount: number, originalCurrency: CurrencyCode) => FormattedConvertedAmount;
  getExchangeRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'msmebooks_preferred_currency';

interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrency?: CurrencyCode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  defaultCurrency = 'NGN',
}) => {
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as CurrencyCode | null;
        if (saved && CURRENCY_MAP.has(saved)) {
          return saved;
        }
      } catch {
        // Fallback to default
      }
    }
    return defaultCurrency;
  });

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCY_MAP.has(code)) {
      setCurrentCurrencyState(code);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, code);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const currencyDetail = CURRENCY_MAP.get(currentCurrency) || SUPPORTED_CURRENCIES[0];

  // Calculate cross exchange rate
  const getExchangeRate = (fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number => {
    if (fromCurrency === toCurrency) return 1.0;
    const fromDetail = CURRENCY_MAP.get(fromCurrency) || CURRENCY_MAP.get('USD')!;
    const toDetail = CURRENCY_MAP.get(toCurrency) || CURRENCY_MAP.get('USD')!;
    // fromCurrency -> USD -> toCurrency
    const inUSD = 1.0 / fromDetail.rateToUSD;
    return inUSD * toDetail.rateToUSD;
  };

  // Convert amount from one currency to another
  const convertAmount = (
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency?: CurrencyCode
  ): number => {
    const target = toCurrency || currentCurrency;
    if (fromCurrency === target) return amount;
    const rate = getExchangeRate(fromCurrency, target);
    const converted = amount * rate;
    
    // Check target decimals
    const targetDetail = CURRENCY_MAP.get(target);
    const decimals = targetDetail?.decimals ?? 2;
    if (decimals === 0) {
      return Math.round(converted);
    }
    return Math.round(converted * 100) / 100;
  };

  // Format a number with its currency symbol and separators
  const formatCurrency = (
    amount: number,
    currencyCode?: CurrencyCode,
    options?: { showCode?: boolean; maximumFractionDigits?: number }
  ): string => {
    const code = currencyCode || currentCurrency;
    const detail = CURRENCY_MAP.get(code) || CURRENCY_MAP.get('NGN')!;
    const maxDigits = options?.maximumFractionDigits !== undefined ? options.maximumFractionDigits : detail.decimals;

    // Use Intl for reliable locale formatting
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: maxDigits > 0 && amount % 1 !== 0 ? Math.min(2, maxDigits) : 0,
      maximumFractionDigits: maxDigits,
    }).format(amount);

    const symbol = detail.symbol;
    const withSymbol = `${symbol}${symbol.length > 2 ? ' ' : ''}${formattedNumber}`;

    if (options?.showCode) {
      return `${withSymbol} ${code}`;
    }
    return withSymbol;
  };

  // Helper providing converted figures plus original comparison
  const formatConverted = (
    amount: number,
    originalCurrency: CurrencyCode
  ): FormattedConvertedAmount => {
    const isConverted = originalCurrency !== currentCurrency;
    const convertedAmount = convertAmount(amount, originalCurrency, currentCurrency);
    const formatted = formatCurrency(convertedAmount, currentCurrency);
    const originalFormatted = formatCurrency(amount, originalCurrency);
    const rate = getExchangeRate(originalCurrency, currentCurrency);

    let exchangeRateDescription = `1 ${originalCurrency} = ${rate < 0.01 ? rate.toFixed(4) : rate < 1 ? rate.toFixed(3) : rate.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${currentCurrency}`;

    return {
      convertedAmount,
      formatted,
      originalAmount: amount,
      originalCurrency,
      originalFormatted,
      isConverted,
      targetCurrency: currentCurrency,
      exchangeRateDescription,
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        currencyDetail,
        currencies: SUPPORTED_CURRENCIES,
        convertAmount,
        formatCurrency,
        formatConverted,
        getExchangeRate,
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
