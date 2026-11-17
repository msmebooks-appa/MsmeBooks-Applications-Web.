import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { ChevronDown, Globe, Search, Check } from 'lucide-react';

interface CurrencySelectorProps {
  className?: string;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  compact = false
}) => {
  const { currentCurrency, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = currencies.filter(
    c =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-lg border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer whitespace-nowrap shadow-2xs select-none focus:outline-hidden focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400"
        aria-label="Select global display currency"
        aria-expanded={isOpen}
      >
        <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-black text-[#0046B8] dark:text-lime-400 border border-slate-200 dark:border-slate-700">
          {currentCurrency.symbol.trim() || currentCurrency.code.slice(0, 1)}
        </span>
        <span className="font-mono tracking-tight">{currentCurrency.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0046B8] dark:text-lime-400" />
                <span>Global Currency Provider</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">15 Currencies</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search currency or country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400"
                autoFocus
              />
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1 text-xs">
            {filteredCurrencies.map(c => {
              const isSelected = c.code === currentCurrency.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c.code as CurrencyCode);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 font-bold text-[#0046B8] dark:text-lime-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-200 font-mono">
                      {c.symbol.trim() || c.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{c.code}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({c.flag})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{c.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700/60">
                      1 USD = {c.rate} {c.code}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#0046B8] dark:text-lime-400 shrink-0" />}
                  </div>
                </button>
              );
            })}

            {filteredCurrencies.length === 0 && (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs">
                No matching currencies found for "{search}"
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Dynamic Conversion Active</span>
            <span className="font-semibold text-[#0046B8] dark:text-lime-400">{currentCurrency.code}</span>
          </div>
        </div>
      )}
    </div>
  );
};
