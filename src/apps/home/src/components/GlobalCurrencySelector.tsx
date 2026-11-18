import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Coins, ArrowRightLeft, X, MapPin } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCode, CurrencyConfig } from '../types';

interface GlobalCurrencySelectorProps {
  isMobileCompact?: boolean;
}

export const GlobalCurrencySelector: React.FC<GlobalCurrencySelectorProps> = ({
  isMobileCompact = false,
}) => {
  const {
    currentCurrency,
    setCurrency,
    currency,
    currencies,
    isAutoDetected,
    detectedLocation,
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'africa' | 'global'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Click outside and escape key listeners
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currencyList = useMemo(() => {
    const all = Object.values(currencies) as CurrencyConfig[];
    return all.filter((c: CurrencyConfig) => {
      // Category filter
      if (activeCategory === 'africa' && c.region === 'Global Reserve') return false;
      if (activeCategory === 'global' && c.region !== 'Global Reserve') return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    });
  }, [currencies, searchQuery, activeCategory]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  if (isMobileCompact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          title="Change Global Currency"
          aria-expanded={isOpen}
        >
          <span>{currency.flag}</span>
          <span>{currentCurrency}</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="fixed inset-x-3 top-20 z-50 bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 max-h-[75vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Global Currency Provider
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mt-2 mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NGN, USD, KES, ZAR, ZIP..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0866FF]"
              />
            </div>

            {/* Currency Grid */}
            <div className="overflow-y-auto space-y-1 pr-1 flex-1">
              {currencyList.map((c) => {
                const isSelected = c.code === currentCurrency;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-slate-800 text-[#0866FF] dark:text-[#B7F000] font-bold border border-blue-200/60 dark:border-blue-800/60'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold">{c.code}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-normal">
                            ({c.symbol})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{c.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />}
                  </button>
                );
              })}
            </div>

            {isAutoDetected && detectedLocation && (
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span>
                  Auto-selected for <strong className="text-slate-700 dark:text-slate-200">{detectedLocation.countryName}</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors shadow-xs group"
        title="Switch Global Currency & Live Exchange Rate"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm leading-none">{currency.flag}</span>
        <span className="font-bold tracking-tight">{currentCurrency}</span>
        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
          ({currency.symbol})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0866FF] dark:text-[#B7F000]' : ''
          }`}
        />
      </button>

      {/* Global Currency Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />
                <span>Global Currency Provider</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Converts all revenue, transactions, and POS data live
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              16 Currencies
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mt-2.5 mb-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, country or name (e.g. USD, KES, ZiG)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0866FF] focus:ring-1 focus:ring-[#0866FF]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1.5 mb-2 text-[11px] font-medium">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-750 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All (16)
            </button>
            <button
              onClick={() => setActiveCategory('africa')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeCategory === 'africa'
                  ? 'bg-[#0866FF] text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              African Trade (12)
            </button>
            <button
              onClick={() => setActiveCategory('global')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeCategory === 'global'
                  ? 'bg-[#0866FF] text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Global Reserve (4)
            </button>
          </div>

          {/* Currencies Scroll Area */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100/70 dark:divide-slate-800/60">
            {currencyList.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No currency matches &quot;{searchQuery}&quot;
              </div>
            ) : (
              currencyList.map((c) => {
                const isSelected = c.code === currentCurrency;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all duration-150 text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-50 to-blue-50/40 dark:from-blue-950/40 dark:to-slate-800/80 border border-blue-200/80 dark:border-blue-800/80'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 shadow-inner">
                        {c.flag}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {c.code}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                            {c.symbol}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {c.region}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                          {c.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {c.code === 'NGN' ? 'Base Currency' : `1 ${c.code} ≈ ₦${c.rateToNGN}`}
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#0866FF] dark:bg-[#B7F000] text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Conversion Note */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              {isAutoDetected && detectedLocation ? (
                <>
                  <MapPin className="w-3 h-3 text-[#0866FF] dark:text-[#B7F000]" />
                  Auto-selected for {detectedLocation.countryName}
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-3 h-3 text-[#0866FF] dark:text-[#B7F000]" />
                  Automated multi-currency ledger sync
                </>
              )}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Active: {currentCurrency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
