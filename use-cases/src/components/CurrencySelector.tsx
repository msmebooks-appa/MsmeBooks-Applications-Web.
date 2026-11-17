import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, DollarSign, Globe2, X, RefreshCw } from 'lucide-react';
import { useCurrency, CurrencyCode, CurrencyInfo } from '../context/CurrencyContext';

interface CurrencySelectorProps {
  compact?: boolean;
  className?: string;
  onSelect?: () => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  compact = false,
  className = '',
  onSelect
}) => {
  const { currency, currencyInfo, currencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'african' | 'global'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input on open
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((c) => {
      // Tab filter
      if (activeTab === 'african' && !c.isAfrican) return false;
      if (activeTab === 'global' && c.isAfrican) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query) ||
        c.symbol.toLowerCase().includes(query)
      );
    });
  }, [currencies, activeTab, searchQuery]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchQuery('');
    if (onSelect) onSelect();
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Currency Selector. Currently selected: ${currencyInfo.code} (${currencyInfo.name})`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border select-none focus:outline-hidden focus:ring-2 focus:ring-[#7CB518]/40 ${
          isOpen
            ? 'bg-slate-100 dark:bg-[#122A3F] border-[#0A3D62] dark:border-sky-400 text-[#0A3D62] dark:text-sky-300 shadow-xs'
            : 'bg-white dark:bg-[#0A2238] border-slate-200 dark:border-[#163654] text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#0E2C48]'
        }`}
      >
        <span className="text-sm leading-none shrink-0" role="img" aria-label={currencyInfo.name}>
          {currencyInfo.flag}
        </span>
        <span className="font-mono text-[#0A3D62] dark:text-[#7CB518] font-black tracking-tight">
          {currencyInfo.symbol}
        </span>
        <span className="font-bold tracking-wide">{currencyInfo.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0A3D62] dark:text-sky-300' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-80 sm:w-88 rounded-xl bg-white dark:bg-[#071F33] border border-slate-200 dark:border-[#163B5D] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        >
          {/* Header & Title */}
          <div className="px-3.5 pt-1.5 pb-2 border-b border-slate-100 dark:border-[#122F4C] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
              <DollarSign className="w-3.5 h-3.5 text-[#7CB518]" />
              <span>Select Display Currency</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#0B253D] px-1.5 py-0.5 rounded">
              16 Currencies
            </span>
          </div>

          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-100 dark:border-[#122F4C] bg-slate-50/70 dark:bg-[#092238]/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency, code, or country..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#071827] border border-slate-200 dark:border-[#163B5D] rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0A3D62] dark:focus:ring-sky-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Segment Filter */}
            <div className="flex items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center ${
                  activeTab === 'all'
                    ? 'bg-[#0A3D62] text-white dark:bg-[#0E4B77]'
                    : 'bg-white dark:bg-[#0B253D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#102F4D]'
                }`}
              >
                All (16)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('african')}
                className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center ${
                  activeTab === 'african'
                    ? 'bg-[#0A3D62] text-white dark:bg-[#0E4B77]'
                    : 'bg-white dark:bg-[#0B253D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#102F4D]'
                }`}
              >
                Pan-African (12)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('global')}
                className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center ${
                  activeTab === 'global'
                    ? 'bg-[#0A3D62] text-white dark:bg-[#0E4B77]'
                    : 'bg-white dark:bg-[#0B253D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#102F4D]'
                }`}
              >
                Global (4)
              </button>
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-100 dark:divide-[#102942]">
            {filteredCurrencies.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching currencies found
              </div>
            ) : (
              filteredCurrencies.map((c) => {
                const isSelected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    role="menuitem"
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-[#0B2A47] text-[#0A3D62] dark:text-sky-200'
                        : 'hover:bg-slate-50 dark:hover:bg-[#0B243B] text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg leading-none shrink-0" role="img" aria-label={c.name}>
                        {c.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white font-mono">
                            {c.code}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                            ({c.symbol})
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[#7CB518] bg-[#7CB518]/10 px-1 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {c.name} &middot; <span className="opacity-80">{c.region}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                          1 USD =
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          {c.ratePerUSD.toLocaleString('en-US', {
                            maximumFractionDigits: c.decimals > 0 ? 2 : 0
                          })}{' '}
                          {c.symbol}
                        </span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#7CB518] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Rate Conversion Note */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-[#122F4C] bg-slate-50 dark:bg-[#092238] flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-[#7CB518]" />
              <span>Real-time conversion active globally</span>
            </span>
            <span className="font-mono text-slate-400">Base: USD &middot; NGN Pivot</span>
          </div>
        </div>
      )}
    </div>
  );
};
