import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { Coins, ChevronDown, Check, Search, Sparkles, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderCurrencyToggleProps {
  className?: string;
}

export const HeaderCurrencyToggle: React.FC<HeaderCurrencyToggleProps> = ({
  className = ''
}) => {
  const { currency, setCurrency, currentCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'Pan-Africa' | 'Global'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSyncNotice, setShowSyncNotice] = useState(false);
  const [lastSelected, setLastSelected] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Key currencies explicitly featured in the header segmented toggle
  const primaryCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'INR'];

  // Check if current currency is one of the primary 4
  const isPrimary = primaryCurrencies.includes(currency);

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    setLastSelected(code);
    setShowSyncNotice(true);
    setIsOpen(false);
    setTimeout(() => {
      setShowSyncNotice(false);
    }, 2800);
  };

  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
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

  return (
    <div className={`relative flex items-center ${className}`} ref={dropdownRef}>
      {/* Segmented Currency Toggle Bar */}
      <div 
        className="flex items-center p-0.5 sm:p-1 bg-slate-100 dark:bg-[#072457] rounded-xl border border-slate-200/90 dark:border-blue-800/80 shadow-xs"
        role="group"
        aria-label="Currency selection toggle"
      >
        {/* Primary 4 Currency Toggle Buttons: USD, EUR, GBP, INR */}
        {primaryCurrencies.map((code) => {
          const cObj = currencies.find(c => c.code === code);
          const isSelected = currency === code;

          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelectCurrency(code)}
              className={`relative px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 select-none ${
                isSelected
                  ? 'text-white dark:text-[#061F4A]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={`Switch currency to ${code} (${cObj?.symbol.trim()}) - Updates Commission Calculator live`}
            >
              {/* Animated active pill background */}
              {isSelected && (
                <motion.div
                  layoutId="header-currency-active-pill"
                  className="absolute inset-0 bg-[#0A3981] dark:bg-[#8CE600] rounded-lg shadow-xs -z-0"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 text-[11px] leading-none hidden sm:inline">{cObj?.flag}</span>
              <span className="relative z-10 font-mono tracking-tight">{code}</span>
              <span className="relative z-10 text-[10px] opacity-75 hidden xl:inline">({cObj?.symbol.trim()})</span>
            </button>
          );
        })}

        {/* Divider */}
        <span className="h-4 w-px bg-slate-200 dark:bg-blue-800/80 mx-0.5" />

        {/* More Currencies Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            !isPrimary || isOpen
              ? 'bg-[#0A3981]/10 dark:bg-[#8CE600]/15 text-[#0A3981] dark:text-[#8CE600] border border-[#0A3981]/20 dark:border-[#8CE600]/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Browse all 16 Pan-African and Global Currencies"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {!isPrimary ? (
            <>
              <span className="text-[11px]">{currentCurrency.flag}</span>
              <span className="font-mono">{currentCurrency.code}</span>
            </>
          ) : (
            <span className="hidden sm:inline text-[11px]">More</span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Floating Dynamic Sync Notification Badge */}
      <AnimatePresence>
        {showSyncNotice && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 z-50 bg-slate-900 dark:bg-black text-white text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 dark:border-blue-800 flex items-center gap-2 whitespace-nowrap pointer-events-auto"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CE600] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8CE600]"></span>
            </span>
            <span className="font-medium">
              Calculator converted to <strong className="text-[#8CE600]">{lastSelected} ({currentCurrency.symbol.trim()})</strong>
            </span>
            <button
              onClick={scrollToCalculator}
              className="text-[11px] font-bold text-sky-300 hover:underline flex items-center gap-0.5 ml-1 cursor-pointer"
            >
              View <ArrowDown className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Currencies Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#072457] rounded-2xl shadow-2xl border border-slate-200 dark:border-blue-800/80 p-3.5 z-50 overflow-hidden"
          >
            {/* Header with Search */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-blue-900/60">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Currency Selector
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                Live Calculator Sync
              </span>
            </div>

            {/* Region Tabs */}
            <div className="flex gap-1.5 mt-2.5 p-1 bg-slate-100 dark:bg-[#051a3d] rounded-xl text-xs font-semibold">
              {(['all', 'Global', 'Pan-Africa'] as const).map((tab) => (
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
                  {tab === 'all' ? 'All (16)' : tab === 'Global' ? '🌐 Global (6)' : '🌍 Pan-Africa (10)'}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="relative mt-2.5 mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code, country, or symbol (e.g. INR, USD, NGN)..."
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
                    onClick={() => handleSelectCurrency(c.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/60 border border-[#0A3981]/30 dark:border-[#8CE600]/40 font-bold'
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
                        {c.rateVsUsd === 1 ? '1.0 (Base)' : `1 USD ≈ ${c.rateVsUsd.toLocaleString()} ${c.code}`}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footnote */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#8CE600]" />
                Dynamically updates Commission Calculator
              </span>
              <button
                onClick={(e) => {
                  setIsOpen(false);
                  scrollToCalculator(e);
                }}
                className="text-[#0A3981] dark:text-[#8CE600] font-bold hover:underline cursor-pointer"
              >
                Jump to Calculator →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
