import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Coins, Check, ChevronDown, Search, ArrowRightLeft } from 'lucide-react';
import { useCurrency, SUPPORTED_CURRENCIES } from '../context/CurrencyContext';
import { CurrencyCode } from '../types/policy';

interface CurrencySelectorProps {
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ compact = false }) => {
  const { currentCurrency, setCurrency, currencyDetail, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegionFilter, setActiveRegionFilter] = useState<'all' | 'africa' | 'international'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
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
      // Region filter
      if (activeRegionFilter === 'africa') {
        const isAfrican = ['NGN', 'KES', 'ZAR', 'GHS', 'MAD', 'XAF', 'UGX', 'TZS', 'RWF', 'ZMW', 'EGP', 'ZIP'].includes(c.code);
        if (!isAfrican) return false;
      } else if (activeRegionFilter === 'international') {
        const isIntl = ['USD', 'GBP', 'EUR', 'AED'].includes(c.code);
        if (!isIntl) return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
      );
    });
  }, [currencies, searchQuery, activeRegionFilter]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select display currency"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          isOpen
            ? 'bg-blue-50 dark:bg-slate-800 border-blue-900/40 dark:border-lime-400 text-blue-950 dark:text-white shadow-xs'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
        }`}
        title={`Current Currency: ${currencyDetail.name} (${currencyDetail.code})`}
      >
        <span className="text-sm leading-none" role="img" aria-label={currencyDetail.country}>
          {currencyDetail.flag}
        </span>
        <span className="font-mono text-lime-700 dark:text-lime-400 font-bold">
          {currencyDetail.symbol}
        </span>
        <span className="uppercase font-mono font-bold tracking-wider text-[11px]">
          {currencyDetail.code}
        </span>
        {!compact && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-blue-900 dark:text-lime-400' : ''
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available currencies"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Global Currency Toggle</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/70 text-lime-800 dark:text-lime-300 border border-lime-300 dark:border-lime-800/40">
                16 Currencies Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Converts all subscriptions, transaction fees, and refund claims in real-time.
            </p>

            {/* Search Input */}
            <div className="relative mt-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency, country, or symbol (e.g. NGN, KES, Rand, $)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mt-2">
              {[
                { id: 'all', label: 'All (16)' },
                { id: 'africa', label: 'Pan-African (12)' },
                { id: 'international', label: 'Global FX (4)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveRegionFilter(filter.id as any)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors ${
                    activeRegionFilter === filter.id
                      ? 'bg-blue-900 dark:bg-blue-800 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
            {filteredCurrencies.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching currencies found for "{searchQuery}".
              </div>
            ) : (
              filteredCurrencies.map((c) => {
                const isSelected = c.code === currentCurrency;
                return (
                  <button
                    key={c.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(c.code)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-slate-800 text-blue-950 dark:text-white font-bold ring-1 ring-blue-900/20 dark:ring-lime-400/40 shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0 leading-none" role="img" aria-label={c.country}>
                        {c.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-blue-950 dark:text-white">
                            {c.code}
                          </span>
                          <span className="font-mono font-bold text-lime-700 dark:text-lime-400 text-xs">
                            ({c.symbol})
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                            · {c.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {c.region}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                          1 USD ≈
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {c.rateToUSD < 1
                            ? c.rateToUSD.toFixed(2)
                            : c.rateToUSD.toLocaleString('en-US', { maximumFractionDigits: 1 })} {c.symbol}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-lime-400 text-blue-950 flex items-center justify-center shrink-0">
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

          {/* Footer */}
          <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-lime-600 dark:text-lime-400" />
              <span>Base Benchmark: USD (1.00)</span>
            </span>
            <span className="font-mono text-slate-400">Stored in Preferences</span>
          </div>
        </div>
      )}
    </div>
  );
};
