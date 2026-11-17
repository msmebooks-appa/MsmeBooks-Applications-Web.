import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Coins, ArrowRightLeft } from 'lucide-react';
import { useCurrency, CurrencyCode, CurrencyMeta } from '../context/CurrencyContext';

interface CurrencySelectorProps {
  isMobile?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ isMobile = false }) => {
  const { currency, currencyMeta, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input after opening
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

  const regions = ['All', 'West Africa', 'East Africa', 'Southern & Central', 'North Africa & Middle East', 'Global'];

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((item: CurrencyMeta) => {
      const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
      if (!matchesRegion) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q)
      );
    });
  }, [currencies, searchQuery, selectedRegion]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#5B95FF]" />
            <span>Display Currency & Rates</span>
          </span>
          <span className="font-mono text-[11px] text-[#1455C0] dark:text-[#B8E62E]">
            {currencyMeta.flag} {currencyMeta.code} ({currencyMeta.symbol})
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
          aria-expanded={isOpen}
          aria-label="Select global transaction currency"
        >
          <div className="flex items-center gap-2">
            <span className="text-base" role="img" aria-label={currencyMeta.name}>
              {currencyMeta.flag}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{currencyMeta.code}</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">({currencyMeta.symbol})</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
              - {currencyMeta.name}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-2 p-3 bg-white dark:bg-[#0D1627] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg space-y-2.5 max-h-80 overflow-y-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search currency, symbol, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#1455C0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {filteredCurrencies.map((c) => {
                const isSelected = currency === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className={`p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between border ${
                      isSelected
                        ? 'bg-[#1455C0]/10 dark:bg-[#1455C0]/30 border-[#1455C0] text-[#1455C0] dark:text-[#5B95FF] font-bold'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm">{c.flag}</span>
                      <span className="font-semibold">{c.code}</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">({c.symbol})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#B8E62E] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 rounded-lg border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-[#111C30] hover:bg-slate-50 dark:hover:bg-[#16233B] text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs group"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Change global currency & transaction display rate"
      >
        <span className="text-sm" role="img" aria-label={currencyMeta.name}>
          {currencyMeta.flag}
        </span>
        <span className="font-bold text-slate-900 dark:text-white tracking-tight">{currencyMeta.code}</span>
        <span className="text-slate-400 dark:text-slate-400 font-mono text-[11px] hidden xl:inline">
          ({currencyMeta.symbol})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 dark:group-hover:text-slate-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50/90 dark:bg-[#0D1627] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1455C0]/10 dark:bg-[#1455C0]/25 text-[#1455C0] dark:text-[#5B95FF] flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Global Display Currency</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">16 Pan-African & World Currencies</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
              Auto-Converted
            </span>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by code (e.g. NGN, USD, KES) or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pt-2 pb-0.5 no-scrollbar text-[10px]">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    selectedRegion === region
                      ? 'bg-[#1455C0] text-white font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Currencies List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
            {filteredCurrencies.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching currency found for &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredCurrencies.map((item) => {
                const isSelected = currency === item.code;
                const rateText =
                  item.code === 'NGN'
                    ? 'Base statutory ledger'
                    : `1 ${item.code} ≈ ₦${item.rateToNgn.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

                return (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#1455C0]/10 dark:bg-[#1455C0]/25 text-[#1455C0] dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0" role="img" aria-label={item.name}>
                        {item.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                            {item.code}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">· {item.region}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px] sm:max-w-[220px]">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          {rateText}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-[#1455C0] dark:text-[#B8E62E] font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#1455C0] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0">
                          <ArrowRightLeft className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Notice */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0D1627] border-t border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="truncate">Indicative rates anchored to standard statutory base.</span>
            <span className="font-mono font-medium text-slate-600 dark:text-slate-300 shrink-0">
              {currencyMeta.code} = {currencyMeta.symbol}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
