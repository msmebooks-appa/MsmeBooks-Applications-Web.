import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Coins, Search } from 'lucide-react';
import { CurrencyCode, CURRENCY_LIST } from '../data/currencies';
import { useCurrency } from '../context/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  variant = 'compact'
}) => {
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filtered = CURRENCY_LIST.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearch('');
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D2238] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#102A44] hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:border-[#84CC16]/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select currency"
        title={`Active Currency: ${currencyInfo.name} (${currencyInfo.symbol})`}
      >
        <span className="text-sm leading-none" aria-hidden="true">{currencyInfo.flag}</span>
        <span className="font-mono text-[11px] font-bold text-[#0B3558] dark:text-[#84CC16]">
          {currencyInfo.code}
        </span>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          ({currencyInfo.symbol})
        </span>
        {variant === 'full' && (
          <span className="hidden sm:inline-block font-normal text-slate-500 dark:text-slate-400 text-[11px]">
            {currencyInfo.name}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available currencies"
          className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#0A1A2C] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Header & Search */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0D2238] border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Coins className="w-3 h-3 text-[#84CC16]" />
                Select Currency
              </span>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                16 Currencies
              </span>
            </div>
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search NGN, USD, KES..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1 text-xs bg-white dark:bg-[#07131F] border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#84CC16]"
                autoFocus
              />
            </div>
          </div>

          {/* Currency list */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-slate-100 dark:divide-slate-800/60 overscroll-contain">
            {filtered.length === 0 ? (
              <div className="py-3 px-3 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching currency found
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.code === currency;
                return (
                  <button
                    key={item.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setCurrency(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                      isSelected
                        ? 'bg-[#F0F7FD] dark:bg-[#0D2A4A] text-[#0B3558] dark:text-[#84CC16] font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0D2238]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm shrink-0" aria-hidden="true">{item.flag}</span>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold">{item.code}</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                            ({item.symbol})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {item.name}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#84CC16] shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Dropdown Footer with conversion note */}
          <div className="p-2 bg-slate-50 dark:bg-[#0D2238] border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono">
            Rates updated automatically across all modules
          </div>
        </div>
      )}
    </div>
  );
};
