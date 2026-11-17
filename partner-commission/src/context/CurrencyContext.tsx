import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types/partner';
import { CURRENCIES } from '../data/partnerData';

interface FormatOptions {
  compact?: boolean;
  showCode?: boolean;
  decimals?: number;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  currencies: CurrencyConfig[];
  setCurrency: (code: CurrencyCode) => void;
  // Conversions
  convertFromNGN: (amountInNGN: number) => number;
  convertToNGN: (amountInCurrent: number) => number;
  convert: (amount: number, from: CurrencyCode, to?: CurrencyCode) => number;
  // Formatting
  formatFromNGN: (amountInNGN: number, options?: FormatOptions) => string;
  formatAmount: (amountInCurrentCurrency: number, options?: FormatOptions) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_LIST = Object.values(CURRENCIES);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msme-currency') as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        return saved;
      }
    }
    return 'NGN';
  });

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      if (typeof window !== 'undefined') {
        localStorage.setItem('msme-currency', code);
      }
    }
  };

  const currencyConfig = useMemo(() => {
    return CURRENCIES[currency] || CURRENCIES.NGN;
  }, [currency]);

  // Convert amount from base NGN to current active currency
  const convertFromNGN = (amountInNGN: number): number => {
    if (currency === 'NGN') return amountInNGN;
    const rate = currencyConfig.exchangeRateToNGN;
    if (!rate || rate <= 0) return amountInNGN;
    return amountInNGN / rate;
  };

  // Convert amount from current active currency to base NGN
  const convertToNGN = (amountInCurrent: number): number => {
    if (currency === 'NGN') return amountInCurrent;
    const rate = currencyConfig.exchangeRateToNGN;
    return amountInCurrent * rate;
  };

  // Convert between any arbitrary currencies
  const convert = (amount: number, from: CurrencyCode, to: CurrencyCode = currency): number => {
    const fromConfig = CURRENCIES[from] || CURRENCIES.NGN;
    const toConfig = CURRENCIES[to] || CURRENCIES.NGN;
    // Step 1: to NGN
    const inNGN = amount * fromConfig.exchangeRateToNGN;
    // Step 2: from NGN to target
    return inNGN / toConfig.exchangeRateToNGN;
  };

  // Format an amount already denominated in current currency
  const formatAmount = (amount: number, options?: FormatOptions): string => {
    const { compact = false, showCode = false, decimals } = options || {};
    const sym = currencyConfig.symbol;
    const code = currencyConfig.code;
    const dec = decimals !== undefined ? decimals : currencyConfig.decimals;

    if (compact) {
      if (Math.abs(amount) >= 1_000_000) {
        const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '');
        return `${sym}${val}M${showCode ? ` ${code}` : ''}`;
      }
      if (Math.abs(amount) >= 1_000) {
        const val = (amount / 1_000).toFixed(1).replace(/\.0$/, '');
        return `${sym}${val}K${showCode ? ` ${code}` : ''}`;
      }
    }

    const formattedNumber = amount.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });

    // Handle symbols like KSh or FCFA where space is preferred
    const hasSpace = sym.length > 2 || sym === 'GH₵';
    const separator = hasSpace ? ' ' : '';

    if (showCode) {
      return `${sym}${separator}${formattedNumber} ${code}`;
    }
    return `${sym}${separator}${formattedNumber}`;
  };

  // Convert an amount in base NGN and format into active currency
  const formatFromNGN = (amountInNGN: number, options?: FormatOptions): string => {
    const converted = convertFromNGN(amountInNGN);
    return formatAmount(converted, options);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig,
        currencies: CURRENCY_LIST,
        setCurrency,
        convertFromNGN,
        convertToNGN,
        convert,
        formatFromNGN,
        formatAmount,
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
