import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search, ArrowRightLeft, DollarSign, TrendingUp } from 'lucide-react';

export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
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
  | 'ZIP'
  | 'EUR';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  region: 'West Africa' | 'East Africa' | 'Southern Africa' | 'North Africa' | 'Central Africa' | 'Global / Middle East';
  rateToUSD: number; // 1 USD = rateToUSD [Code]
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
}

export const supportedCurrencies: CurrencyInfo[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    region: 'West Africa',
    rateToUSD: 1520.0,
    symbolPosition: 'before',
    decimalPlaces: 0,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    region: 'Global / Middle East',
    rateToUSD: 1.0,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    region: 'Global / Middle East',
    rateToUSD: 0.77,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    region: 'Global / Middle East',
    rateToUSD: 0.92,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    region: 'East Africa',
    rateToUSD: 129.5,
    symbolPosition: 'before',
    decimalPlaces: 0,
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    region: 'Southern Africa',
    rateToUSD: 18.25,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    flag: '🇬🇭',
    region: 'West Africa',
    rateToUSD: 15.6,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'MAD',
    flag: '🇲🇦',
    region: 'North Africa',
    rateToUSD: 9.85,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'XAF',
    name: 'Central African CFA Franc',
    symbol: 'FCFA',
    flag: '🇨🇲',
    region: 'Central Africa',
    rateToUSD: 605.0,
    symbolPosition: 'after',
    decimalPlaces: 0,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    region: 'Global / Middle East',
    rateToUSD: 3.67,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    flag: '🇺🇬',
    region: 'East Africa',
    rateToUSD: 3710.0,
    symbolPosition: 'before',
    decimalPlaces: 0,
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    flag: '🇹🇿',
    region: 'East Africa',
    rateToUSD: 2680.0,
    symbolPosition: 'before',
    decimalPlaces: 0,
  },
  {
    code: 'RWF',
    name: 'Rwandan Franc',
    symbol: 'RF',
    flag: '🇷🇼',
    region: 'East Africa',
    rateToUSD: 1365.0,
    symbolPosition: 'before',
    decimalPlaces: 0,
  },
  {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'ZK',
    flag: '🇿🇲',
    region: 'Southern Africa',
    rateToUSD: 26.85,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    flag: '🇪🇬',
    region: 'North Africa',
    rateToUSD: 48.6,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
  {
    code: 'ZIP',
    name: 'Zimbabwean ZiG',
    symbol: 'ZiG',
    flag: '🇿🇼',
    region: 'Southern Africa',
    rateToUSD: 25.4,
    symbolPosition: 'before',
    decimalPlaces: 2,
  },
];

interface FormatCurrencyOptions {
  compact?: boolean;
  showDecimals?: boolean;
  decimalPlaces?: number;
  showCode?: boolean;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currentCurrencyInfo: CurrencyInfo;
  supportedCurrencies: CurrencyInfo[];
  // Convert any amount from a source currency to the currently active currency
  convert: (amount: number, fromCurrency?: CurrencyCode) => number;
  // Convert from NGN (the default African base used in articles and raw revenue numbers) to active currency
  convertFromNGN: (amountInNGN: number) => number;
  // Format an amount (assumed in NGN by default unless fromCurrency is specified) into localized active currency string
  formatFromNGN: (amountInNGN: number, options?: FormatCurrencyOptions) => string;
  // Format an amount (assumed in USD by default) into localized active currency string
  formatFromUSD: (amountInUSD: number, options?: FormatCurrencyOptions) => string;
  // Format any raw amount directly in target currency
  formatCurrency: (amount: number, options?: FormatCurrencyOptions, explicitCurrency?: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_currency_preference';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (saved && supportedCurrencies.some((c) => c.code === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'NGN'; // Default base currency for African MSME platform
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  const currentCurrencyInfo =
    supportedCurrencies.find((c) => c.code === currency) || supportedCurrencies[0];

  const getRate = (code: CurrencyCode): number => {
    const item = supportedCurrencies.find((c) => c.code === code);
    return item ? item.rateToUSD : 1.0;
  };

  // Convert amount between any two currencies: from -> USD -> target
  const convert = (amount: number, fromCurrency: CurrencyCode = 'USD'): number => {
    if (fromCurrency === currency) return amount;
    const fromRate = getRate(fromCurrency);
    const toRate = currentCurrencyInfo.rateToUSD;
    // amount in USD = amount / fromRate
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  };

  const convertFromNGN = (amountInNGN: number): number => {
    return convert(amountInNGN, 'NGN');
  };

  const formatNumber = (num: number, compact: boolean, decimals: number): string => {
    if (compact) {
      if (Math.abs(num) >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
      }
      if (Math.abs(num) >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (Math.abs(num) >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
    }

    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCurrency = (
    amount: number,
    options?: FormatCurrencyOptions,
    explicitCurrency?: CurrencyCode
  ): string => {
    const targetInfo = explicitCurrency
      ? supportedCurrencies.find((c) => c.code === explicitCurrency) || currentCurrencyInfo
      : currentCurrencyInfo;

    const compact = options?.compact ?? false;
    const decimals: number =
      options?.decimalPlaces !== undefined
        ? options.decimalPlaces
        : options?.showDecimals === false
        ? 0
        : options?.showDecimals === true
        ? (targetInfo.decimalPlaces || 2)
        : (compact ? 0 : targetInfo.decimalPlaces);
    const showCode = options?.showCode ?? false;

    const formattedValue = formatNumber(amount, compact, decimals);

    let result = '';
    if (targetInfo.symbolPosition === 'before') {
      result = `${targetInfo.symbol}${targetInfo.symbol.length > 2 ? ' ' : ''}${formattedValue}`;
    } else {
      result = `${formattedValue} ${targetInfo.symbol}`;
    }

    if (showCode && !result.includes(targetInfo.code)) {
      result += ` ${targetInfo.code}`;
    }

    return result;
  };

  const formatFromNGN = (amountInNGN: number, options?: FormatCurrencyOptions): string => {
    const converted = convertFromNGN(amountInNGN);
    return formatCurrency(converted, options);
  };

  const formatFromUSD = (amountInUSD: number, options?: FormatCurrencyOptions): string => {
    const converted = convert(amountInUSD, 'USD');
    return formatCurrency(converted, options);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currentCurrencyInfo,
        supportedCurrencies,
        convert,
        convertFromNGN,
        formatFromNGN,
        formatFromUSD,
        formatCurrency,
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

interface CurrencySelectorProps {
  variant?: 'navbar' | 'drawer' | 'footer' | 'pill';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ variant = 'navbar' }) => {
  const { currency, setCurrency, currentCurrencyInfo, supportedCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const regions = ['All', 'West Africa', 'East Africa', 'Central Africa', 'Southern Africa', 'North Africa', 'Global / Middle East'];

  const filteredCurrencies = supportedCurrencies.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  if (variant === 'drawer') {
    return (
      <div className="bg-slate-50 dark:bg-[#102A4C] p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <DollarSign className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>Global Currency</span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-lime-100 dark:bg-lime-950/80 text-lime-900 dark:text-lime-300">
            {currentCurrencyInfo.flag} {currentCurrencyInfo.code} ({currentCurrencyInfo.symbol})
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {supportedCurrencies.map((c) => {
            const isSelected = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-[#0B1E36] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#15345E]'
                }`}
                title={`${c.name} (${c.symbol})`}
              >
                <span className="text-sm leading-none">{c.flag}</span>
                <span className="text-[10px] font-extrabold">{c.code}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
          <span>Rates updated globally</span>
          <span className="font-mono text-slate-600 dark:text-slate-300">
            1 USD = {currentCurrencyInfo.rateToUSD.toLocaleString()} {currentCurrencyInfo.code}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100/90 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] transition-all border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
        aria-expanded={isOpen}
        aria-label="Select currency"
        title={`Current Currency: ${currentCurrencyInfo.name} (${currentCurrencyInfo.code})`}
      >
        <span className="text-sm leading-none">{currentCurrencyInfo.flag}</span>
        <span className="font-mono font-extrabold text-[11px] text-slate-900 dark:text-white">
          {currentCurrencyInfo.code}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-lime-400 font-semibold hidden xl:inline">
          {currentCurrencyInfo.symbol}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-lime-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#0B1E36] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Global Currency Selector
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#102A4C] text-slate-600 dark:text-slate-300 font-mono font-semibold">
              16 Currencies
            </span>
          </div>

          {/* Search bar */}
          <div className="relative mt-2.5 mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code (e.g. NGN, USD, KES, ZAR)..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#071527] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-lime-400 font-medium"
            />
          </div>

          {/* Region Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-[10px]">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap font-medium transition-colors ${
                  selectedRegion === reg
                    ? 'bg-blue-600 dark:bg-lime-400 text-white dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-[#102A4C] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#15345E]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* List of Currencies */}
          <div className="max-h-64 overflow-y-auto space-y-1 mt-1 pr-1">
            {filteredCurrencies.map((c) => {
              const isSelected = c.code === currency;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#102A4C] border border-blue-200 dark:border-lime-500/50'
                      : 'hover:bg-slate-50 dark:hover:bg-[#0E2443] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg leading-none shrink-0">{c.flag}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.code}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          ({c.symbol})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {c.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                        1 USD = {c.rateToUSD.toLocaleString()}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-lime-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}

            {filteredCurrencies.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching currencies found
              </div>
            )}
          </div>

          {/* Live Conversion Rate Footer Callout */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-lime-600 dark:text-lime-400" />
              <span>Real-time conversion</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              {currentCurrencyInfo.flag} {currentCurrencyInfo.code}: {currentCurrencyInfo.symbol}1.00
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
