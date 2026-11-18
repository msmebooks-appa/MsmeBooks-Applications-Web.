import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCode } from '../types/partner';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';

interface CurrencySelectorProps {
  align?: 'left' | 'right';
  compact?: boolean;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  align = 'right',
  compact = false,
  className = ''
}) => {
  const { currency, currencyConfig, currencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'All' | 'Africa' | 'Global' | 'Middle East'>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside or Escape
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
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((curr) => {
      const matchesSearch =
        curr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curr.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curr.shortLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = regionFilter === 'All' || curr.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [currencies, searchQuery, regionFilter]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-colors focus:outline-none"
        title="Select Display Currency"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none select-none">{currencyConfig.flag}</span>
        <span className="font-bold tracking-tight">{currencyConfig.code}</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">({currencyConfig.symbol})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-80 sm:w-88 rounded-xl bg-white dark:bg-[#101e35] shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* Header */}
          <div className="px-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#1261B5] dark:text-[#B9E51C]" />
                Display Currency ({currencies.length})
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Auto-converted rates
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search NGN, USD, GBP, KES, ZAR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1 mt-2">
              {(['All', 'Africa', 'Global', 'Middle East'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegionFilter(r)}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                    regionFilter === r
                      ? 'bg-[#1261B5] text-white dark:bg-[#1261B5]'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Currencies Scrollable List */}
          <div className="max-h-72 overflow-y-auto px-1.5 py-1 divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredCurrencies.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching currencies found
              </div>
            ) : (
              filteredCurrencies.map((curr) => {
                const isSelected = curr.code === currency;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors group ${
                      isSelected
                        ? 'bg-[#1261B5]/10 dark:bg-[#1261B5]/20 text-[#1261B5] dark:text-[#B9E51C] font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg leading-none shrink-0">{curr.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1261B5] dark:group-hover:text-[#B9E51C]">
                            {curr.code}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({curr.symbol})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {curr.name.replace(/\(.*?\)/, '').trim()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {curr.code !== 'NGN' && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                          ≈ {curr.exchangeRateToNGN >= 1 ? `₦${curr.exchangeRateToNGN.toLocaleString()}` : `₦${curr.exchangeRateToNGN}`}
                        </span>
                      )}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#1261B5] dark:bg-[#B9E51C] text-white dark:text-[#142D4E] flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Updates all revenue & ledgers across app</span>
            <span className="font-mono">16 Currencies</span>
          </div>
        </div>
      )}
    </div>
  );
};
