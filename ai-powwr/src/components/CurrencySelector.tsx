import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyConfig } from '../context/CurrencyContext';
import { ChevronDown, Check, Coins, Search, ArrowRightLeft, Sparkles } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'topbar' | 'compact' | 'mobile-nav' | 'drawer';
  className?: string;
}

// Major quick-toggle currencies requested by user
const QUICK_TOGGLE_CODES = ['NGN', 'USD', 'GBP', 'KES', 'ZAR', 'EUR', 'GHS', 'AED'];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'topbar',
  className = ''
}) => {
  const { currency, currencyInfo, currencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [justSwitchedToast, setJustSwitchedToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectCurrency = (code: string) => {
    setCurrency(code);
    const selected = currencies.find((c) => c.code === code);
    if (selected) {
      setJustSwitchedToast(`${selected.flag} ${selected.code} (${selected.symbol}) active`);
      setTimeout(() => setJustSwitchedToast(null), 2500);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredCurrencies = currencies.filter((c: CurrencyConfig) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q) ||
      c.regionHint.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Toast notification confirming real-time conversion update */}
      {justSwitchedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#17233D] text-[#B7E522] border border-[#B7E522]/40 text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 font-bold animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-[#B7E522]" />
          <span>All transactions & revenue updated: {justSwitchedToast}</span>
        </div>
      )}

      {/* Trigger Button Variants */}
      {variant === 'drawer' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{currencyInfo.flag}</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {currencyInfo.code} ({currencyInfo.symbol})
            </span>
            <span className="text-slate-400 text-[11px]">— {currencyInfo.name}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : variant === 'mobile-nav' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-[#131E36] text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
          title={`Active Currency: ${currencyInfo.code} (${currencyInfo.symbol})`}
          aria-expanded={isOpen}
        >
          <span className="text-sm leading-none">{currencyInfo.flag}</span>
          <span className="font-mono text-[#1254B5] dark:text-[#B7E522] text-[11px]">{currencyInfo.code}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131E36] hover:bg-slate-50 dark:hover:bg-[#1A2642] text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition cursor-pointer"
          title={`Toggle Global Currency (Currently ${currencyInfo.code})`}
          aria-expanded={isOpen}
        >
          <Coins className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
          <span>{currencyInfo.flag}</span>
          <span className="font-mono text-[#1254B5] dark:text-[#B7E522]">{currencyInfo.code}</span>
          <span className="text-slate-400 text-[11px]">({currencyInfo.symbol})</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        /* Topbar Variant */
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-700/70 hover:bg-blue-700 dark:bg-blue-900/70 dark:hover:bg-blue-800 text-white font-medium text-xs transition cursor-pointer border border-blue-500/30"
          title={`Toggle Global Currency: ${currencyInfo.name} (${currencyInfo.code})`}
          aria-expanded={isOpen}
        >
          <Coins className="w-3 h-3 text-[#B7E522]" />
          <span>{currencyInfo.flag}</span>
          <span className="font-mono font-bold text-[#B7E522]">{currencyInfo.code}</span>
          <span className="text-white/80 text-[11px]">({currencyInfo.symbol})</span>
          <ChevronDown className={`w-3 h-3 text-white/80 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Global Currency Selection Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-76 sm:w-84 bg-white dark:bg-[#131E36] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 z-50 overflow-hidden animate-fadeIn">
          {/* Dropdown Header */}
          <div className="p-3 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
                Select Global Currency
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[#1254B5] dark:text-[#B7E522] font-bold">
                {currencies.length} Major Currencies
              </span>
            </div>

            {/* Quick Toggle Pills Strip for Major requested currencies */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_TOGGLE_CODES.map((code) => {
                const target = currencies.find((c) => c.code === code);
                if (!target) return null;
                const isSelected = target.code === currency;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelectCurrency(target.code)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1254B5] text-white shadow-xs'
                        : 'bg-white dark:bg-[#192642] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1254B5]'
                    }`}
                  >
                    <span>{target.flag}</span>
                    <span>{target.code}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search Input */}
            <div className="relative mt-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NGN, USD, GBP, KES, ZAR, EUR..."
                className="w-full text-xs py-1.5 pl-7 pr-3 bg-white dark:bg-[#131E36] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6]"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Currencies Scrollable List */}
          <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredCurrencies.map((c) => {
              const isSelected = c.code === currency;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelectCurrency(c.code)}
                  className={`w-full text-left rtl:text-right px-3 py-2 text-xs rounded-lg flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-[#1254B5] dark:text-[#B7E522] font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1A2642] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{c.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold">{c.code}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-400 font-semibold">
                          ({c.symbol})
                        </span>
                      </div>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block line-clamp-1">
                        {c.name} • <span className="italic">{c.regionHint}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-right rtl:text-left">
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {c.code === 'USD' ? 'Base: $1.00' : `1$ = ${c.rateAgainstUSD.toLocaleString()}`}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0" />}
                  </div>
                </button>
              );
            })}

            {filteredCurrencies.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching currencies found for "{searchQuery}".
              </div>
            )}
          </div>

          {/* Currency Footer Note */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0E1726] border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Rate Provider (Anchor: USD)
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Updates all transaction & revenue data
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
