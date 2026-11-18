import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Globe,
  Search,
  Check,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { CURRENCY_REGIONS, POPULAR_CURRENCIES, SUPPORTED_CURRENCIES } from '../utils/currency';
import { getDefaultRegionForCurrency } from '../data/paymentGateways';
import { CurrencyInfo } from '../types';

interface CheckoutCurrencySelectorProps {
  onCurrencySelect?: (code: string) => void;
}

export const CheckoutCurrencySelector: React.FC<CheckoutCurrencySelectorProps> = ({
  onCurrencySelect,
}) => {
  const { currency, setCurrency, activeCurrency, currencies } = useCurrency();
  const { setSelectedRegion } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegionFilter] = useState<string>('All');
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
    const targetRegion = getDefaultRegionForCurrency(code);
    setSelectedRegion(targetRegion);
    if (onCurrencySelect) {
      onCurrencySelect(code);
    }
    setIsOpen(false);
  };

  const isNgnDefault = currency === 'NGN';

  // Compute exchange rate text
  const exchangeRateText = useMemo(() => {
    if (currency === 'NGN') {
      return '1 NGN = ₦1.00 (Platform Baseline Currency)';
    }
    const rate = activeCurrency.rateFromNgn;
    if (rate > 0) {
      const inverseNgn = (1 / rate).toFixed(2).replace(/\.00$/, '');
      return `1 ${currency} ≈ ₦${Number(inverseNgn).toLocaleString()} NGN`;
    }
    return '';
  }, [currency, activeCurrency]);

  return (
    <div ref={dropdownRef} className="relative z-30">
      {/* Top Banner & Trigger Bar inside Checkout */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-950 to-slate-900 text-white p-3 sm:p-3.5 rounded-2xl border border-blue-700/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shrink-0 shadow-inner">
            {activeCurrency.flag}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-blue-200">
                Checkout Billing Currency:
              </span>
              <span className="text-xs font-black text-lime-400">
                {activeCurrency.code} ({activeCurrency.symbol.trim()})
              </span>
              {isNgnDefault ? (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  Default (Nigeria)
                </span>
              ) : (
                <span className="text-[9px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-400/30">
                  Global / African Currency
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5 flex items-center gap-1.5">
              <span>{activeCurrency.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-lime-300 font-mono font-medium">{exchangeRateText}</span>
            </p>
          </div>
        </div>

        {/* Change Currency Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-blue-500/30 cursor-pointer border border-blue-400/40"
          >
            <Globe className="w-3.5 h-3.5 text-lime-400" />
            <span>Switch Currency ({currencies.length}+)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Currency Selection Dropdown / Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#081528] rounded-2xl border border-slate-300 dark:border-blue-900/80 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                <span>Select Pan-African or Global Currency</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All order line items, statutory VAT, and card payments will be processed in this currency.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Popular Currencies Chips */}
          <div className="py-2.5 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Popular Pan-African & Global Currencies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CURRENCIES.map((code) => {
                const info = SUPPORTED_CURRENCIES[code];
                if (!info) return null;
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A4FD5] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{info.flag}</span>
                    <span>{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-3 pb-2 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by currency code, country name, or symbol (e.g. Kenya, Rand, Dollar, Euro, CFA)..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Regional Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[11px] no-scrollbar">
            {CURRENCY_REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegionFilter(region)}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-[#0A4FD5] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Currency Items Grid */}
          <div className="max-h-56 overflow-y-auto mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 pr-1">
            {filteredCurrencies.map((curr) => {
              const isSelected = currency === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`p-2 rounded-xl text-left transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 border-[#0A4FD5] text-[#0A4FD5] dark:text-blue-300 shadow-xs ring-1 ring-[#0A4FD5]'
                      : 'bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{curr.flag}</span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{curr.code}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({curr.symbol.trim()})</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {curr.country || curr.name}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#0A4FD5] dark:text-lime-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {filteredCurrencies.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No currencies match "{searchQuery}". Try searching by country name or code.
            </div>
          )}

          {/* Footer with conversion disclosure */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-500" />
              <span>Real-time interbank foreign exchange rates with 0% foreign transaction fees.</span>
            </span>
            <button
              type="button"
              onClick={() => handleSelect('NGN')}
              className="text-[#0A4FD5] dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Reset to NGN (Default)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
