import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { ChevronDown, Check, Coins, Search } from 'lucide-react';

export const CurrencySelector: React.FC<{ variant?: 'desktop' | 'mobile' }> = ({ variant = 'desktop' }) => {
  const { currentCurrency, setCurrencyCode, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/20 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Select regional currency (${currentCurrency.code})`}
      >
        <span className="text-sm">{currentCurrency.flag}</span>
        <span className="font-mono font-bold text-slate-800 dark:text-white">{currentCurrency.code}</span>
        {variant === 'desktop' && (
          <span className="text-slate-500 dark:text-slate-400 font-normal">({currentCurrency.symbol})</span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[#0B4EA2] dark:text-[#38BDF8]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-zinc-950 shadow-xl border border-slate-200 dark:border-zinc-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
          role="menu"
        >
          <div className="px-3 py-2 bg-slate-50 dark:bg-black/80 border-b border-slate-100 dark:border-zinc-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
              <span>Regional Currency</span>
            </span>
            <span className="font-mono text-[#65A30D] dark:text-[#84CC16]">
              1 USD = {currentCurrency.ratePerUSD} {currentCurrency.code}
            </span>
          </div>

          <div className="p-2 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-black/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search currency (e.g. NGN, KES, USD)..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-[#0B4EA2] dark:focus:border-[#38BDF8] text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50 dark:divide-zinc-800/60">
            {filteredCurrencies.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching currency found
              </div>
            ) : (
              filteredCurrencies.map((c) => {
                const isSelected = c.code === currentCurrency.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrencyCode(c.code);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-blue-50/60 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/70 font-bold text-[#0B4EA2] dark:text-[#38BDF8]'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{c.code}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">({c.symbol})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{c.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0B4EA2] dark:text-lime-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="px-3 py-1.5 bg-slate-50 dark:bg-black/90 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono">
            Live Pan-African &amp; Global Conversion
          </div>
        </div>
      )}
    </div>
  );
};
