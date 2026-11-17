import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCode } from '../types/currency';
import { ChevronDown, Check, Coins, Search, Plus, Globe } from 'lucide-react';
import { AddCountryCurrencyModal } from './AddCountryCurrencyModal';

interface CurrencySelectorProps {
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ compact = false }) => {
  const { currency, setCurrency, currencies, currentConfig } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  const filteredCurrencies = currencies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 rounded-lg border transition-all text-xs font-semibold cursor-pointer select-none ${
            compact
              ? 'px-2.5 py-1.5 bg-slate-50 dark:bg-[#15223E] hover:bg-slate-100 dark:hover:bg-[#1B2C50] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              : 'px-2.5 py-1.5 bg-slate-50 dark:bg-[#15223E] hover:bg-slate-100 dark:hover:bg-[#1B2C50] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs hover:border-[#0066CC]/50 dark:hover:border-[#38BDF8]/50'
          }`}
          title={`Global Currency: ${currentConfig.name} (${currentConfig.code} ${currentConfig.symbol}). Click to change.`}
          aria-label="Select currency"
          aria-expanded={isOpen}
        >
          <span className="text-sm leading-none" role="img" aria-label={currentConfig.country}>
            {currentConfig.flag}
          </span>
          <span className="font-bold text-[#14243A] dark:text-white">
            {currentConfig.code}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
            ({currentConfig.symbol})
          </span>
          {currentConfig.code === 'NGN' && (
            <span className="hidden lg:inline text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              Default
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-[#0066CC] dark:text-[#38BDF8]' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-[#131D35] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#14243A] dark:text-white">
                <Coins className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Select Global Currency</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{currencies.length} World Countries</span>
            </div>

            {/* Search Box & Add Country Trigger */}
            <div className="p-2 space-y-1.5">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 150+ countries & currencies..."
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none text-xs"
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowAddModal(true);
                }}
                className="w-full py-1.5 px-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0066CC] dark:text-[#38BDF8] rounded-xl text-xs font-bold border border-blue-200/80 dark:border-blue-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Any Country / Currency</span>
              </button>
            </div>

            {/* Currency List */}
            <div className="max-h-72 overflow-y-auto space-y-0.5 p-1">
              {filteredCurrencies.map((c) => {
                const isSelected = c.code === currency;
                const isDefault = c.code === 'NGN';

                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] font-bold ring-1 ring-[#0066CC]/20'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1A284A] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base leading-none" role="img" aria-label={c.country}>
                        {c.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 leading-tight">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.code}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px]">
                            ({c.symbol})
                          </span>
                          {isDefault && (
                            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                          {c.name} · {c.country}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {c.code !== 'USD' && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ~{c.ratePerUSD.toLocaleString()} / $
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-between">
              <span>Nigeria (NGN ₦) Default</span>
              <span>All 195+ Countries</span>
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Country Modal */}
      <AddCountryCurrencyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
};
