import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode =
  | 'USD'
  | 'NGN'
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
  | 'EGP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // exchange rate relative to 1 USD
  flag: string; // ISO 2-letter or region badge
  decimalPlaces?: number;
}

export const ALL_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, flag: 'US', decimalPlaces: 2 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1550, flag: 'NG', decimalPlaces: 0 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.78, flag: 'GB', decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: 'EU', decimalPlaces: 2 },
  { code: 'KES', symbol: 'KSh ', name: 'Kenyan Shilling', rate: 130, flag: 'KE', decimalPlaces: 0 },
  { code: 'ZAR', symbol: 'R ', name: 'South African Rand', rate: 18.2, flag: 'ZA', decimalPlaces: 2 },
  { code: 'GHS', symbol: 'GH₵ ', name: 'Ghanaian Cedi', rate: 15.5, flag: 'GH', decimalPlaces: 2 },
  { code: 'MAD', symbol: 'MAD ', name: 'Moroccan Dirham', rate: 10.0, flag: 'MA', decimalPlaces: 2 },
  { code: 'XAF', symbol: 'FCFA ', name: 'Central African CFA', rate: 610, flag: 'CM', decimalPlaces: 0 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 3.67, flag: 'AE', decimalPlaces: 2 },
  { code: 'UGX', symbol: 'USh ', name: 'Ugandan Shilling', rate: 3750, flag: 'UG', decimalPlaces: 0 },
  { code: 'TZS', symbol: 'TSh ', name: 'Tanzanian Shilling', rate: 2650, flag: 'TZ', decimalPlaces: 0 },
  { code: 'RWF', symbol: 'RWF ', name: 'Rwandan Franc', rate: 1350, flag: 'RW', decimalPlaces: 0 },
  { code: 'ZMW', symbol: 'ZK ', name: 'Zambian Kwacha', rate: 26.5, flag: 'ZM', decimalPlaces: 2 },
  { code: 'EGP', symbol: 'E£ ', name: 'Egyptian Pound', rate: 48.5, flag: 'EG', decimalPlaces: 2 }
];

interface CurrencyContextType {
  currentCurrency: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  currencies: CurrencyConfig[];
  convert: (amountInUSD: number) => number;
  formatMoney: (amountInUSD: number, options?: { showCents?: boolean }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('msmebooks_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  const currentCurrency = ALL_CURRENCIES.find(c => c.code === selectedCode) || ALL_CURRENCIES[0];

  const setCurrency = (code: CurrencyCode) => {
    setSelectedCode(code);
    localStorage.setItem('msmebooks_currency', code);
  };

  const convert = (amountInUSD: number): number => {
    return amountInUSD * currentCurrency.rate;
  };

  const formatMoney = (amountInUSD: number, options?: { showCents?: boolean }): string => {
    const converted = convert(amountInUSD);
    const decimals = options?.showCents !== undefined
      ? (options.showCents ? 2 : 0)
      : (currentCurrency.decimalPlaces ?? (currentCurrency.rate > 50 ? 0 : 2));

    const formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return `${currentCurrency.symbol}${formattedNumber}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        currencies: ALL_CURRENCIES,
        convert,
        formatMoney
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
