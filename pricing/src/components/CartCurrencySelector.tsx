import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Globe,
  Search,
  Check,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CURRENCY_LIST, CURRENCY_REGIONS, SUPPORTED_CURRENCIES } from '../utils/currency';
import { CurrencyInfo } from '../types';

export const CartCurrencySelector: React.FC = () => {
  const { currency, setCurrency, activeCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filter currencies
  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return currencies.filter((curr) => {
      // Region filter
      if (selectedRegion === 'Default (Nigeria)') {
        if (curr.code !== 'NGN') return false;
      } else if (selectedRegion !== 'All' && curr.region !== selectedRegion) {
        return false;
      }

      // Search query
      if (!q) return true;
      return (
        curr.code.toLowerCase().includes(q) ||
        curr.name.toLowerCase().includes(q) ||
        curr.symbol.toLowerCase().includes(q) ||
        (curr.country && curr.country.toLowerCase().includes(q)) ||
        curr.region.toLowerCase().includes(q)
      );
    });
  }, [currencies, searchQuery, selectedRegion]);

  const handleSelect = (code: string) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const handleResetToDefault = () => {
    setCurrency('NGN');
    setIsOpen(false);
  };

  const isNgnDefault = currency === 'NGN';

  return (
    <div ref={dropdownRef} className="relative">
      {/* Active Currency Banner / Trigger in Cart */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-slate-900 dark:to-blue-950/40 p-2.5 sm:p-3 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg shadow-2xs shrink-0">
            {activeCurrency.flag}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                Payment Currency:
              </span>
              <span className="text-xs font-extrabold text-[#0A4FD5] dark:text-blue-400">
                {activeCurrency.code} ({activeCurrency.symbol.trim()})
              </span>
              {isNgnDefault ? (
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-300/40">
                  Default (Nigeria)
                </span>
              ) : (
                <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 font-semibold px-1.5 py-0.2 rounded">
                  World Currency
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {activeCurrency.name} • All cart prices convert live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isNgnDefault && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[10px] font-bold text-slate-500 hover:text-[#0A4FD5] dark:hover:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Reset to default Nigerian Naira"
            >
              🇳🇬 Default
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#0A4FD5] hover:bg-[#073AA0] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            aria-expanded={isOpen}
            aria-label="Change payment currency"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Change</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* World Currencies Dropdown / Modal Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#0B192C] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 text-xs animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] sm:max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div>
              <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#0A4FD5]" />
                <span>Select Payment Currency</span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  ({currencies.length} World Currencies)
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Select any currency worldwide. Default is Nigeria Naira (₦ NGN).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Close currency picker"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Default Reset & Search Bar */}
          <div className="pt-3 pb-2 space-y-2 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by country, code or name (e.g. Nigeria, USD, Kenya, CFA, EUR)..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Region Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {CURRENCY_REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedRegion === region
                      ? 'bg-[#0A4FD5] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Fast Quick Default Button */}
            <button
              type="button"
              onClick={handleResetToDefault}
              className={`w-full p-2 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                isNgnDefault
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🇳🇬</span>
                <div>
                  <div className="font-extrabold text-xs flex items-center gap-1.5">
                    <span>NGN — Nigerian Naira</span>
                    <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                      PLATFORM DEFAULT
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Primary base currency for all Pan-African operations (Symbol: ₦)
                  </div>
                </div>
              </div>
              {isNgnDefault && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>
          </div>

          {/* Currencies Grid / List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[260px]">
            {filteredCurrencies.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No currencies matching "{searchQuery}". Try searching for country or currency code.
              </div>
            ) : (
              filteredCurrencies.map((curr) => {
                const isSelected = currency === curr.code;
                const rateText =
                  curr.code === 'NGN'
                    ? 'Base 1:1'
                    : `1 ${curr.code} ≈ ₦${Math.round(1 / curr.rateFromNgn).toLocaleString()}`;

                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full pt-1.5 pb-1.5 px-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0A4FD5] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{curr.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {curr.code}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                            {curr.name}
                          </span>
                          {curr.isDefault && (
                            <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-2">
                          <span>Symbol: <strong className="text-slate-600 dark:text-slate-300">{curr.symbol.trim()}</strong></span>
                          <span>•</span>
                          <span>{curr.region}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {rateText}
                      </div>
                      {isSelected && (
                        <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-[#0A4FD5] dark:text-blue-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
