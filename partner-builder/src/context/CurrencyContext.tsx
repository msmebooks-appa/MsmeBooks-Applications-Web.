import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 
  | 'USD' 
  | 'NGN' 
  | 'KES' 
  | 'GHS' 
  | 'ZAR' 
  | 'EGP' 
  | 'XOF' 
  | 'XAF' 
  | 'RWF' 
  | 'TZS' 
  | 'UGX' 
  | 'EUR' 
  | 'GBP' 
  | 'INR'
  | 'CAD' 
  | 'AED';

export interface CurrencyDetails {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  region: 'Pan-Africa' | 'Global';
  countryOrBloc: string;
  rateVsUsd: number; // e.g. 1 USD = 1550 NGN
  decimals: number;
}

export const ALL_CURRENCIES: CurrencyDetails[] = [
  // Pan-Africa
  {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    region: 'Pan-Africa',
    countryOrBloc: 'Nigeria',
    rateVsUsd: 1550,
    decimals: 0
  },
  {
    code: 'KES',
    symbol: 'KSh ',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    region: 'Pan-Africa',
    countryOrBloc: 'Kenya & East Africa',
    rateVsUsd: 130,
    decimals: 0
  },
  {
    code: 'GHS',
    symbol: 'GH₵ ',
    name: 'Ghanaian Cedi',
    flag: '🇬🇭',
    region: 'Pan-Africa',
    countryOrBloc: 'Ghana',
    rateVsUsd: 15.5,
    decimals: 2
  },
  {
    code: 'ZAR',
    symbol: 'R ',
    name: 'South African Rand',
    flag: '🇿🇦',
    region: 'Pan-Africa',
    countryOrBloc: 'South Africa & SADC',
    rateVsUsd: 18.2,
    decimals: 2
  },
  {
    code: 'EGP',
    symbol: 'E£ ',
    name: 'Egyptian Pound',
    flag: '🇪🇬',
    region: 'Pan-Africa',
    countryOrBloc: 'Egypt & North Africa',
    rateVsUsd: 49.0,
    decimals: 2
  },
  {
    code: 'XOF',
    symbol: 'CFA ',
    name: 'West African CFA Franc',
    flag: '🇸🇳',
    region: 'Pan-Africa',
    countryOrBloc: 'UEMOA (Senegal, Côte d’Ivoire, etc.)',
    rateVsUsd: 610,
    decimals: 0
  },
  {
    code: 'XAF',
    symbol: 'FCFA ',
    name: 'Central African CFA Franc',
    flag: '🇨🇲',
    region: 'Pan-Africa',
    countryOrBloc: 'CEMAC (Cameroon, Gabon, etc.)',
    rateVsUsd: 610,
    decimals: 0
  },
  {
    code: 'RWF',
    symbol: 'FRw ',
    name: 'Rwandan Franc',
    flag: '🇷🇼',
    region: 'Pan-Africa',
    countryOrBloc: 'Rwanda',
    rateVsUsd: 1380,
    decimals: 0
  },
  {
    code: 'TZS',
    symbol: 'TSh ',
    name: 'Tanzanian Shilling',
    flag: '🇹🇿',
    region: 'Pan-Africa',
    countryOrBloc: 'Tanzania',
    rateVsUsd: 2650,
    decimals: 0
  },
  {
    code: 'UGX',
    symbol: 'USh ',
    name: 'Ugandan Shilling',
    flag: '🇺🇬',
    region: 'Pan-Africa',
    countryOrBloc: 'Uganda',
    rateVsUsd: 3700,
    decimals: 0
  },

  // Global Markets
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    region: 'Global',
    countryOrBloc: 'United States & Global Anchor',
    rateVsUsd: 1,
    decimals: 2
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    region: 'Global',
    countryOrBloc: 'European Union',
    rateVsUsd: 0.92,
    decimals: 2
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    region: 'Global',
    countryOrBloc: 'United Kingdom',
    rateVsUsd: 0.78,
    decimals: 2
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    region: 'Global',
    countryOrBloc: 'India & South Asia',
    rateVsUsd: 84.5,
    decimals: 2
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    region: 'Global',
    countryOrBloc: 'Canada',
    rateVsUsd: 1.39,
    decimals: 2
  },
  {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    region: 'Global',
    countryOrBloc: 'United Arab Emirates / Middle East',
    rateVsUsd: 3.67,
    decimals: 2
  }
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currentCurrency: CurrencyDetails;
  currencies: CurrencyDetails[];
  convertFromUsd: (amountUsd: number) => number;
  formatMoney: (amountUsd: number, customDecimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_currency') as CurrencyCode;
      if (saved && ALL_CURRENCIES.some(c => c.code === saved)) {
        return saved;
      }
    }
    return 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    if (ALL_CURRENCIES.some(c => c.code === code)) {
      setCurrencyState(code);
      if (typeof window !== 'undefined') {
        localStorage.setItem('msmebooks_currency', code);
      }
    }
  };

  const currentCurrency = ALL_CURRENCIES.find(c => c.code === currency) || ALL_CURRENCIES[10]; // USD fallback

  const convertFromUsd = (amountUsd: number): number => {
    return amountUsd * currentCurrency.rateVsUsd;
  };

  const formatMoney = (amountUsd: number, customDecimals?: number): string => {
    const converted = convertFromUsd(amountUsd);
    const decimals = customDecimals !== undefined ? customDecimals : currentCurrency.decimals;
    
    const formattedNum = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return `${currentCurrency.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currentCurrency,
        currencies: ALL_CURRENCIES,
        convertFromUsd,
        formatMoney
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
