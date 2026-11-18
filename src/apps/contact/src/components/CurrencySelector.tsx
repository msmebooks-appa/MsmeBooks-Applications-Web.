import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Coins, Check } from 'lucide-react';
import { useCurrency, CURRENCIES, CurrencyCode } from '../context/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  compact = false,
}) => {
  const { currentCurrency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currenciesList = Object.values(CURRENCIES);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0B3B82] dark:hover:text-white bg-slate-100 dark:bg-[#131E35] hover:bg-[#f0f6ff] dark:hover:bg-[#1A2846] border border-slate-200 dark:border-slate-700 transition-all select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select global currency"
      >
        <Coins className="w-3.5 h-3.5 text-[#70C038]" />
        <span className="text-sm leading-none">{currentCurrency.flag}</span>
        <span className="font-mono font-bold text-[#0B3B82] dark:text-[#93C5FD]">{currentCurrency.code}</span>
        {!compact && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">({currentCurrency.symbol.trim()})</span>
        )}
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 max-h-80 bg-white dark:bg-[#0F172A] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-2 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Operating Currency
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Auto-Converted
            </span>
          </div>

          <div className="space-y-0.5">
            {currenciesList.map((curr) => {
              const isSelected = currentCurrency.code === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code as CurrencyCode);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#f0f6ff] dark:bg-blue-950/60 text-[#0B3B82] dark:text-[#93C5FD] font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{curr.flag}</span>
                    <div className="truncate">
                      <span className="font-mono font-semibold">{curr.code}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1.5 truncate">
                        {curr.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                      {curr.symbol}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#70C038]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2 text-[10px] text-slate-400 dark:text-slate-500">
            Rates updated dynamically · 1 USD = {currentCurrency.ratePerUSD} {currentCurrency.code}
          </div>
        </div>
      )}
    </div>
  );
};
