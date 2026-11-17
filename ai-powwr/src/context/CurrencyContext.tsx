import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateAgainstUSD: number; // e.g. 1 USD = 1550 NGN
  regionHint: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', rateAgainstUSD: 1550.0, regionHint: 'Nigeria', decimals: 0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rateAgainstUSD: 1.0, regionHint: 'Global Anchor', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rateAgainstUSD: 0.78, regionHint: 'United Kingdom', decimals: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', rateAgainstUSD: 130.0, regionHint: 'Kenya', decimals: 0 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rateAgainstUSD: 18.25, regionHint: 'South Africa', decimals: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', rateAgainstUSD: 15.60, regionHint: 'Ghana', decimals: 2 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', rateAgainstUSD: 9.85, regionHint: 'Morocco', decimals: 2 },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', flag: '🇨🇲', rateAgainstUSD: 605.0, regionHint: 'Central Africa (CEMAC)', decimals: 0 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', rateAgainstUSD: 3.67, regionHint: 'United Arab Emirates', decimals: 2 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', rateAgainstUSD: 3720.0, regionHint: 'Uganda', decimals: 0 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', rateAgainstUSD: 2600.0, regionHint: 'Tanzania', decimals: 0 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', flag: '🇷🇼', rateAgainstUSD: 1380.0, regionHint: 'Rwanda', decimals: 0 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'K', flag: '🇿🇲', rateAgainstUSD: 26.50, regionHint: 'Zambia', decimals: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', rateAgainstUSD: 48.60, regionHint: 'Egypt', decimals: 2 },
  { code: 'ZIP', name: 'Zimbabwe ZiG', symbol: 'ZiG', flag: '🇿🇼', rateAgainstUSD: 14.20, regionHint: 'Zimbabwe', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateAgainstUSD: 0.92, regionHint: 'European Union', decimals: 2 }
];

interface CurrencyContextValue {
  currency: string;
  currencyInfo: CurrencyConfig;
  currencies: CurrencyConfig[];
  setCurrency: (code: string) => void;
  convertFromUSD: (amountInUSD: number) => number;
  formatFromUSD: (
    amountInUSD: number,
    options?: { showCode?: boolean; compact?: boolean; customDecimals?: number }
  ) => string;
  convertAndFormat: (
    amount: number,
    fromCurrencyCode: string,
    options?: { showCode?: boolean; compact?: boolean }
  ) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_global_currency_v1';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_CURRENCIES.some((c) => c.code === stored.toUpperCase())) {
        return stored.toUpperCase();
      }
    } catch (e) {
      // fallback
    }
    return 'NGN'; // Default to primary flagship African hub (NGN), easily toggled
  });

  const currencyInfo = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
  }, [currency]);

  const setCurrency = (code: string) => {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setCurrencyState(found.code);
      try {
        localStorage.setItem(STORAGE_KEY, found.code);
      } catch (e) {
        // ignore
      }
    }
  };

  const convertFromUSD = (amountInUSD: number): number => {
    return amountInUSD * currencyInfo.rateAgainstUSD;
  };

  const formatFromUSD = (
    amountInUSD: number,
    options?: { showCode?: boolean; compact?: boolean; customDecimals?: number }
  ): string => {
    const converted = convertFromUSD(amountInUSD);
    const { showCode = false, compact = false, customDecimals } = options || {};

    const decimals =
      customDecimals !== undefined
        ? customDecimals
        : currencyInfo.decimals;

    if (compact && Math.abs(converted) >= 1_000_000_000) {
      const billions = (converted / 1_000_000_000).toFixed(1);
      return `${currencyInfo.symbol}${billions}B${showCode ? ` ${currencyInfo.code}` : ''}`;
    }

    if (compact && Math.abs(converted) >= 1_000_000) {
      const millions = (converted / 1_000_000).toFixed(1);
      return `${currencyInfo.symbol}${millions}M${showCode ? ` ${currencyInfo.code}` : ''}`;
    }

    if (compact && Math.abs(converted) >= 10_000) {
      const thousands = (converted / 1_000).toFixed(0);
      return `${currencyInfo.symbol}${thousands}K${showCode ? ` ${currencyInfo.code}` : ''}`;
    }

    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(converted);

    return `${currencyInfo.symbol}${formattedNumber}${showCode ? ` ${currencyInfo.code}` : ''}`;
  };

  const convertAndFormat = (
    amount: number,
    fromCurrencyCode: string,
    options?: { showCode?: boolean; compact?: boolean }
  ): string => {
    const sourceCurrency =
      SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === fromCurrencyCode.toUpperCase()) ||
      SUPPORTED_CURRENCIES[0];

    // Convert source amount to USD first
    const amountInUSD = amount / sourceCurrency.rateAgainstUSD;
    return formatFromUSD(amountInUSD, options);
  };

  const value = {
    currency,
    currencyInfo,
    currencies: SUPPORTED_CURRENCIES,
    setCurrency,
    convertFromUSD,
    formatFromUSD,
    convertAndFormat
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
