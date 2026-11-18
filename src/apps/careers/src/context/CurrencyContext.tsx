import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types/currency';
import { WORLD_CURRENCIES, ALL_WORLD_CURRENCIES } from '../data/worldCurrencies';

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = WORLD_CURRENCIES;
export const SUPPORTED_CURRENCIES: CurrencyConfig[] = ALL_WORLD_CURRENCIES;

interface CurrencyContextType {
  currency: CurrencyCode;
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencies: CurrencyConfig[];
  currentConfig: CurrencyConfig;
  addCustomCurrency: (newCurrency: CurrencyConfig) => void;
  convertFromUSD: (amountInUSD: number) => number;
  convertAmount: (amount: number, fromCurrency: string, toCurrency?: CurrencyCode) => number;
  formatAmount: (amountInUSD: number, options?: { showCode?: boolean }) => string;
  formatFromSource: (amount: number, sourceCurrency: string, options?: { showCode?: boolean }) => string;
  formatSalaryRange: (min: number, max: number, sourceCurrency: string, period?: string, isPublic?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load custom currencies added by the user
  const [customCurrencies, setCustomCurrencies] = useState<Record<string, CurrencyConfig>>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_custom_currencies');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {};
  });

  // Dynamic merged map of configs
  const allConfigs: Record<string, CurrencyConfig> = {
    ...CURRENCY_CONFIGS,
    ...customCurrencies,
  };

  // Nigeria (NGN) is the system default global currency
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_global_currency');
      if (saved && (CURRENCY_CONFIGS[saved] || customCurrencies[saved])) {
        return saved;
      }
    } catch {}
    return 'NGN'; // Default: Nigeria (NGN - ₦)
  });

  const setCurrency = (code: CurrencyCode) => {
    const upper = (code || '').toUpperCase();
    if (allConfigs[upper]) {
      setCurrencyState(upper);
      try {
        localStorage.setItem('msmebooks_global_currency', upper);
      } catch {}
    }
  };

  // Function to allow users to add any country and currency to the system
  const addCustomCurrency = (newCurrency: CurrencyConfig) => {
    const code = (newCurrency.code || '').toUpperCase().trim();
    if (!code) return;

    const validated: CurrencyConfig = {
      code,
      symbol: newCurrency.symbol || code,
      name: newCurrency.name || `${newCurrency.country || 'Custom'} Currency`,
      country: newCurrency.country || 'Global',
      region: newCurrency.region || 'Global',
      ratePerUSD: newCurrency.ratePerUSD && newCurrency.ratePerUSD > 0 ? newCurrency.ratePerUSD : 1.0,
      flag: newCurrency.flag || '🌐',
      fractionDigits: newCurrency.fractionDigits ?? 2,
      isPopular: false,
    };

    setCustomCurrencies((prev) => {
      const updated = { ...prev, [code]: validated };
      try {
        localStorage.setItem('msmebooks_custom_currencies', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Automatically set the newly added country/currency as active
    setCurrencyState(code);
    try {
      localStorage.setItem('msmebooks_global_currency', code);
    } catch {}
  };

  const currentConfig = allConfigs[currency] || allConfigs.NGN || allConfigs.USD;

  // Complete list of currencies including custom ones with Nigeria at top
  const combinedCurrencies: CurrencyConfig[] = React.useMemo(() => {
    const base = Object.values(allConfigs);
    // Ensure Nigeria is first, followed by others
    const nigeria = base.find((c) => c.code === 'NGN');
    const others = base.filter((c) => c.code !== 'NGN');
    return nigeria ? [nigeria, ...others] : base;
  }, [allConfigs]);

  // Convert an amount in USD to the active currency
  const convertFromUSD = (amountInUSD: number): number => {
    const rate = currentConfig.ratePerUSD;
    return Math.round(amountInUSD * rate);
  };

  // Convert an amount from any source currency to target currency (defaults to active currency)
  const convertAmount = (amount: number, fromCurrency: string, toCurrency?: CurrencyCode): number => {
    const targetCode = (toCurrency || currency).toUpperCase();
    const targetConfig = allConfigs[targetCode] || allConfigs.NGN || allConfigs.USD;
    const sourceUpper = (fromCurrency || 'USD').toUpperCase();
    const sourceConfig = allConfigs[sourceUpper] || allConfigs.USD;

    // Convert source -> USD -> target
    const amountInUSD = amount / sourceConfig.ratePerUSD;
    return Math.round(amountInUSD * targetConfig.ratePerUSD);
  };

  // Format an amount that is already in USD into the active currency string
  const formatAmount = (amountInUSD: number, options?: { showCode?: boolean }): string => {
    const converted = convertFromUSD(amountInUSD);
    const formattedNum = converted.toLocaleString();
    if (options?.showCode) {
      return `${currentConfig.symbol}${formattedNum} ${currentConfig.code}`;
    }
    return `${currentConfig.symbol}${formattedNum}`;
  };

  // Format an amount from its source currency to the currently active currency
  const formatFromSource = (amount: number, sourceCurrency: string, options?: { showCode?: boolean }): string => {
    const converted = convertAmount(amount, sourceCurrency);
    const formattedNum = converted.toLocaleString();
    if (options?.showCode) {
      return `${currentConfig.symbol}${formattedNum} ${currentConfig.code}`;
    }
    return `${currentConfig.symbol}${formattedNum}`;
  };

  // Format a salary range from source currency to the currently active currency
  const formatSalaryRange = (
    min: number,
    max: number,
    sourceCurrency: string,
    period = 'month',
    isPublic = true
  ): string => {
    if (!isPublic) return 'Competitive Remuneration';
    const convertedMin = convertAmount(min, sourceCurrency);
    const convertedMax = convertAmount(max, sourceCurrency);

    return `${currentConfig.symbol}${convertedMin.toLocaleString()} – ${currentConfig.symbol}${convertedMax.toLocaleString()}/${period}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currentCurrency: currency,
        setCurrency,
        currencies: combinedCurrencies,
        currentConfig,
        addCustomCurrency,
        convertFromUSD,
        convertAmount,
        formatAmount,
        formatFromSource,
        formatSalaryRange,
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
