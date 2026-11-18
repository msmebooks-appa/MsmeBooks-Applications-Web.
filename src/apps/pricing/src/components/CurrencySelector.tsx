import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  ChevronDown,
  Search,
  Check,
  Sparkles,
  TrendingUp,
  X,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Currency } from '../types';
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_LIST,
  POPULAR_CURRENCIES,
  CURRENCY_REGIONS,
  formatCurrency,
} from '../utils/currency';
import { getHolidayInfoForCurrency } from '../data/bankHolidays';

interface CurrencySelectorProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  onCurrencyChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [isAutoConversionActive, setIsAutoConversionActive] = useState<boolean>(true);
  const [lastRefreshedText, setLastRefreshedText] = useState<string>('Live now');
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.NGN;
  const holidayInfo = getHolidayInfoForCurrency(currency);

  const handleRefreshRates = () => {
    setIsRefreshingRates(true);
    setTimeout(() => {
      setIsRefreshingRates(false);
      setLastRefreshedText('Just now');
    }, 450);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when opened
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter currencies
  const filteredCurrencies = CURRENCY_LIST.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.country && item.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegion === 'All' || item.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs hover:shadow-xs group focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/30 relative"
        title="Toggle regional currency"
        aria-label="Select global currency"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{active.flag}</span>
        <span className="font-extrabold tracking-tight text-[#0A4FD5] dark:text-blue-400">
          {active.symbol.trim()}
        </span>
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {active.code}
        </span>
        {holidayInfo?.nextHoliday?.isUpcomingOrActive && (
          <span
            className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
            title={`${holidayInfo.countryName} public holiday advisory active`}
          />
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0A4FD5] dark:text-blue-400' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-[#091524] dark:to-[#0D1C30] border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Global Currency Selector
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Auto-converts all plans, metrics & transactions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Smart Auto-Conversion Active Status Bar */}
            <div className="mt-2.5 p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900/60 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-[#0A4FD5] dark:text-blue-300">
                  Smart Auto-Conversion:
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {lastRefreshedText}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefreshRates}
                className="flex items-center gap-1 font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline cursor-pointer"
                title="Fetch latest mid-market forex rates"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingRates ? 'animate-spin' : ''}`} />
                <span>Refresh Rates</span>
              </button>
            </div>

            {/* Localized Bank Holiday Warning Banner */}
            {holidayInfo?.activeHolidayWarning && (
              <div className="mt-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-[10px]">
                <div className="flex items-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-amber-950 dark:text-amber-100">
                      {holidayInfo.countryName} Holiday Notice:
                    </span>{' '}
                    <span className="text-amber-800 dark:text-amber-300">
                      {holidayInfo.nextHoliday.name} ({holidayInfo.nextHoliday.dateStr}).
                    </span>
                    <p className="text-[9px] text-amber-700 dark:text-amber-400 mt-0.5 leading-tight">
                      Support response times may have brief delays due to statutory bank holiday closures.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Popular Currency Chips */}
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1.5 flex items-center justify-between">
                <span>Popular Currencies</span>
                <span className="text-[9px] text-[#0A4FD5] dark:text-blue-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Live Rates
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {POPULAR_CURRENCIES.map((code) => {
                  const item = SUPPORTED_CURRENCIES[code];
                  const isSelected = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onCurrencyChange(code);
                        setIsOpen(false);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0A4FD5] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency, code, or country..."
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/30 focus:border-[#0A4FD5]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="mt-2 flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {CURRENCY_REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedRegion === region
                      ? 'bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Currencies List */}
          <div className="max-h-64 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredCurrencies.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching currencies found for "{searchQuery}"
              </div>
            ) : (
              filteredCurrencies.map((item) => {
                const isSelected = currency === item.code;
                const sample10k = formatCurrency(10000, item.code);

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      onCurrencyChange(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer pt-2 ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#0A4FD5] dark:text-blue-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{item.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {item.code}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            ({item.symbol.trim()})
                          </span>
                          {isSelected && (
                            <span className="bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item.name} • {item.region}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {sample10k}
                      </div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500">
                        per ₦10k NGN
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#07101E] border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              Base currency: NGN (Nigerian Naira)
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {CURRENCY_LIST.length} Currencies
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
