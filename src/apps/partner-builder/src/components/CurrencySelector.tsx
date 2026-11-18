import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { Coins, ChevronDown, Check, Search, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CurrencySelectorProps {
  variant?: 'navbar' | 'mobile' | 'compact' | 'portal';
  className?: string;
  align?: 'left' | 'right';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'navbar',
  className = '',
  align = 'right'
}) => {
  const { currency, setCurrency, currentCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'Pan-Africa' | 'Global'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCurrencies = currencies.filter((c) => {
    if (activeTab !== 'all' && c.region !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.countryOrBloc.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    );
  });

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            Select Currency
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
            {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol.trim()})
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {currencies.slice(0, 9).map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={`flex items-center gap-1.5 p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                currency === c.code
                  ? 'bg-blue-50 dark:bg-blue-900/70 border-[#0A3981] dark:border-[#8CE600] text-[#0A3981] dark:text-[#8CE600] shadow-xs'
                  : 'bg-white dark:bg-[#072048] border-slate-200 dark:border-blue-900/80 text-slate-700 dark:text-slate-200'
              }`}
            >
              <span>{c.flag}</span>
              <span className="font-mono font-bold">{c.code}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select currency"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
          isOpen
            ? 'bg-blue-50 dark:bg-blue-900/70 border-[#0A3981] dark:border-[#8CE600] text-[#0A3981] dark:text-[#8CE600] shadow-sm'
            : 'bg-white/80 dark:bg-[#072457]/80 hover:bg-slate-100 dark:hover:bg-blue-900/50 border-slate-200 dark:border-blue-800/60 text-slate-700 dark:text-slate-200'
        }`}
      >
        <span className="text-sm leading-none">{currentCurrency.flag}</span>
        <span className="font-mono font-bold text-slate-900 dark:text-white">{currentCurrency.code}</span>
        <span className="text-slate-400 dark:text-slate-400 font-normal hidden xl:inline">({currentCurrency.symbol.trim()})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#072457] rounded-2xl shadow-2xl border border-slate-200 dark:border-blue-800/80 p-3.5 z-50 overflow-hidden`}
          >
            {/* Header with Search */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-blue-900/60">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Currency
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                16 Pan-African & Global Currencies
              </span>
            </div>

            {/* Region Tabs */}
            <div className="flex gap-1.5 mt-2.5 p-1 bg-slate-100 dark:bg-[#051a3d] rounded-xl text-xs font-semibold">
              {(['all', 'Pan-Africa', 'Global'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'all' ? 'All (15)' : tab === 'Pan-Africa' ? '🌍 Pan-Africa (10)' : '🌐 Global (5)'}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative mt-2.5 mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency by code, country, symbol..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#051a3d] border border-slate-200 dark:border-blue-900 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
              />
            </div>

            {/* Currencies Grid List */}
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              {filteredCurrencies.map((c) => {
                const isSelected = currency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/60 border border-[#0A3981]/30 dark:border-[#8CE600]/40'
                        : 'hover:bg-slate-50 dark:hover:bg-blue-900/30 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{c.code}</span>
                          <span className="font-semibold text-slate-500 dark:text-slate-400">({c.symbol.trim()})</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 truncate max-w-[120px]">{c.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                          {c.countryOrBloc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">
                        {c.rateVsUsd === 1 ? 'Base 1.0' : `1 USD ≈ ${c.rateVsUsd.toLocaleString()} ${c.code}`}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live conversion footnote */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#8CE600]" />
                Applies globally across calculator & payouts
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                Active: {currentCurrency.code}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
