import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  CurrencyCode, 
  CurrencyInfo, 
  CURRENCIES, 
  CURRENCY_LIST, 
  convertFromNgn, 
  formatCurrencyAmount, 
  formatNgnToCurrency 
} from '../data/currencies';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyInfo: CurrencyInfo;
  convertFromNgn: (amountNgn: number) => number;
  formatNgn: (baseNgn: number, options?: { compact?: boolean; forceDecimals?: boolean }) => string;
  formatAmount: (amount: number, options?: { compact?: boolean; forceDecimals?: boolean }) => string;
  currencies: CurrencyInfo[];
  exchangeRateVsUsd: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_currency');
      if (saved && saved in CURRENCIES) {
        return saved as CurrencyCode;
      }
    }
    return 'NGN';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('msmebooks_currency', code);
    }
  };

  const currencyInfo = useMemo(() => CURRENCIES[currency], [currency]);

  const value = useMemo<CurrencyContextType>(() => {
    return {
      currency,
      setCurrency,
      currencyInfo,
      convertFromNgn: (baseNgn: number) => convertFromNgn(baseNgn, currency),
      formatNgn: (baseNgn: number, options) => formatNgnToCurrency(baseNgn, currency, options),
      formatAmount: (amount: number, options) => formatCurrencyAmount(amount, currency, options),
      currencies: CURRENCY_LIST,
      exchangeRateVsUsd: currencyInfo.ratePerUsd,
    };
  }, [currency, currencyInfo]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
