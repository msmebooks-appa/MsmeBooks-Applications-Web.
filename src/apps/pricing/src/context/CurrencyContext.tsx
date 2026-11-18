import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, CurrencyInfo } from '../types';
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_LIST,
  convertFromNgn,
  formatCurrency,
  detectUserCurrency,
  registerCurrencyIfMissing,
  getLiveExchangeRate,
} from '../utils/currency';
import { subscribeToExchangeRates } from '../services/exchangeRateService';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  activeCurrency: CurrencyInfo;
  currencies: CurrencyInfo[];
  convert: (amountInNgn: number) => number;
  format: (
    amountInNgn: number,
    options?: { compact?: boolean; hideDecimals?: boolean; includeCode?: boolean }
  ) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{
  children: ReactNode;
  initialCurrency?: Currency;
}> = ({ children, initialCurrency }) => {
  const [, setRateRevision] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToExchangeRates(() => {
      setRateRevision((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('msmebooks-currency') as Currency | null;
      if (saved && saved in SUPPORTED_CURRENCIES) {
        return saved;
      }
    } catch {
      // Safe fallback
    }
    // If an initialCurrency was explicitly provided and valid, use it; otherwise auto-detect
    if (initialCurrency && initialCurrency in SUPPORTED_CURRENCIES) {
      return initialCurrency;
    }
    return detectUserCurrency();
  });

  const setCurrency = (newCurrency: Currency) => {
    registerCurrencyIfMissing(newCurrency, getLiveExchangeRate(newCurrency));
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('msmebooks-currency', newCurrency);
    } catch {
      // Safe fallback
    }
  };

  const activeCurrency = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;

  const convert = (amountInNgn: number) => {
    return convertFromNgn(amountInNgn, currency);
  };

  const format = (
    amountInNgn: number,
    options?: { compact?: boolean; hideDecimals?: boolean; includeCode?: boolean }
  ) => {
    return formatCurrency(amountInNgn, currency, options);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        activeCurrency,
        currencies: CURRENCY_LIST,
        convert,
        format,
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
