import React, { createContext, useContext, useState, useMemo } from 'react';

export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
  | 'EUR'
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
  | 'ZIP';

export interface CurrencyItem {
  code: CurrencyCode;
  name: string;
  symbol: string;
  ratePerUSD: number;
  flag: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyItem> = {
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', ratePerUSD: 1450, flag: '🇳🇬', decimals: 0 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', ratePerUSD: 1.0, flag: '🇺🇸', decimals: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', ratePerUSD: 0.78, flag: '🇬🇧', decimals: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', ratePerUSD: 0.92, flag: '🇪🇺', decimals: 2 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh ', ratePerUSD: 130, flag: '🇰🇪', decimals: 0 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R ', ratePerUSD: 18.25, flag: '🇿🇦', decimals: 2 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵ ', ratePerUSD: 14.8, flag: '🇬🇭', decimals: 2 },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD ', ratePerUSD: 9.85, flag: '🇲🇦', decimals: 2 },
  XAF: { code: 'XAF', name: 'Central African Franc', symbol: 'FCFA ', ratePerUSD: 605, flag: '🇨🇲', decimals: 0 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', ratePerUSD: 3.67, flag: '🇦🇪', decimals: 2 },
  UGX: { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh ', ratePerUSD: 3700, flag: '🇺🇬', decimals: 0 },
  TZS: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh ', ratePerUSD: 2620, flag: '🇹🇿', decimals: 0 },
  RWF: { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw ', ratePerUSD: 1330, flag: '🇷🇼', decimals: 0 },
  ZMW: { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK ', ratePerUSD: 26.5, flag: '🇿🇲', decimals: 2 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£ ', ratePerUSD: 48.6, flag: '🇪🇬', decimals: 2 },
  ZIP: { code: 'ZIP', name: 'Zimbabwe Gold / Dollar', symbol: 'ZiG ', ratePerUSD: 13.8, flag: '🇿🇼', decimals: 2 },
};

interface CurrencyContextType {
  currentCurrency: CurrencyItem;
  setCurrency: (code: CurrencyCode) => void;
  convertAmount: (baseUSD: number) => number;
  formatAmount: (baseUSD: number, options?: { compact?: boolean; hideDecimals?: boolean }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('NGN');

  const currentCurrency = useMemo(() => CURRENCIES[currencyCode] || CURRENCIES.NGN, [currencyCode]);

  const convertAmount = (baseUSD: number): number => {
    return baseUSD * currentCurrency.ratePerUSD;
  };

  const formatAmount = (
    baseUSD: number,
    options?: { compact?: boolean; hideDecimals?: boolean }
  ): string => {
    const converted = baseUSD * currentCurrency.ratePerUSD;

    if (options?.compact) {
      if (converted >= 1_000_000_000) {
        return `${currentCurrency.symbol}${(converted / 1_000_000_000).toFixed(1)}B`;
      }
      if (converted >= 1_000_000) {
        return `${currentCurrency.symbol}${(converted / 1_000_000).toFixed(1)}M`;
      }
      if (converted >= 1_000) {
        return `${currentCurrency.symbol}${(converted / 1_000).toFixed(0)}K`;
      }
    }

    const decimals = options?.hideDecimals ? 0 : currentCurrency.decimals;
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(converted);

    return `${currentCurrency.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency: setCurrencyCode,
        convertAmount,
        formatAmount,
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
