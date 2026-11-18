import React, { createContext, useContext, useState, useMemo } from 'react';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  ratePerUSD: number; // 1 USD = rate in this currency
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', ratePerUSD: 1550 },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', ratePerUSD: 1.0 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', ratePerUSD: 0.78 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', ratePerUSD: 0.92 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', ratePerUSD: 130 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', ratePerUSD: 18.2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', ratePerUSD: 15.5 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', ratePerUSD: 9.9 },
  { code: 'XAF', name: 'Central African CFA', symbol: 'FCFA', flag: '🇨🇲', ratePerUSD: 605 },
  { code: 'XOF', name: 'West African CFA', symbol: 'CFA', flag: '🇸🇳', ratePerUSD: 605 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', ratePerUSD: 3.67 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', ratePerUSD: 3700 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', ratePerUSD: 2600 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼', ratePerUSD: 1350 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', flag: '🇿🇲', ratePerUSD: 26.5 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', ratePerUSD: 48.5 },
  { code: 'ZIP', name: 'Zimbabwean ZiG / ZIP', symbol: 'ZiG', flag: '🇿🇼', ratePerUSD: 28.5 },
];

const CURRENCY_STORAGE_KEY = 'msmebooks_currency';

interface CurrencyContextType {
  currentCurrency: CurrencyConfig;
  setCurrencyCode: (code: string) => void;
  currencies: CurrencyConfig[];
  convertFromNGN: (amountInNGN: number) => number;
  formatFromNGN: (amountInNGN: number, options?: { hideSymbol?: boolean; decimals?: number }) => string;
  formatCompactFromNGN: (amountInNGN: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SPACED_SYMBOLS = ['KSh', 'USh', 'TSh', 'FRw', 'FCFA', 'CFA', 'MAD', 'AED', 'GH₵', 'ZK', 'E£', 'ZiG'];

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'NGN';
  });

  const setCurrencyCode = (code: string) => {
    const valid = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (!valid) return;
    setCurrencyCodeState(valid.code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, valid.code);
    } catch {
      // Ignore storage write errors
    }
  };

  const currentCurrency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  }, [currencyCode]);

  const convertFromNGN = (amountInNGN: number): number => {
    const ngnRate = SUPPORTED_CURRENCIES.find((c) => c.code === 'NGN')!.ratePerUSD;
    const amountInUSD = amountInNGN / ngnRate;
    return amountInUSD * currentCurrency.ratePerUSD;
  };

  const attachSymbol = (formatted: string): string => {
    if (SPACED_SYMBOLS.includes(currentCurrency.symbol)) {
      return `${currentCurrency.symbol} ${formatted}`;
    }
    return `${currentCurrency.symbol}${formatted}`;
  };

  const formatFromNGN = (
    amountInNGN: number,
    options: { hideSymbol?: boolean; decimals?: number } = {}
  ): string => {
    const converted = convertFromNGN(amountInNGN);
    const decimals = options.decimals !== undefined ? options.decimals : (converted >= 1000 ? 0 : 2);
    
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(converted);

    if (options.hideSymbol) {
      return formattedNum;
    }

    return attachSymbol(formattedNum);
  };

  const formatCompactFromNGN = (amountInNGN: number): string => {
    const converted = convertFromNGN(amountInNGN);
    const formattedCompact = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(converted);
    return attachSymbol(formattedCompact);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrencyCode,
        currencies: SUPPORTED_CURRENCIES,
        convertFromNGN,
        formatFromNGN,
        formatCompactFromNGN,
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
