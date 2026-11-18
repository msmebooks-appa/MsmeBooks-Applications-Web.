import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { ChevronDown, Check, Coins, ArrowRightLeft, MapPin, Sparkles } from 'lucide-react';

interface CurrencyToggleProps {
  mode?: 'dropdown' | 'segmented' | 'compact';
  showLabel?: boolean;
  className?: string;
  idPrefix?: string;
  popularOnly?: boolean;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  mode = 'dropdown',
  showLabel = false,
  className = '',
  idPrefix = 'currency',
  popularOnly = false,
}) => {
  const {
    currency,
    setCurrency,
    currentCurrency,
    allCurrencies,
    detectedLocation,
    autoLocationSync,
    setAutoLocationSync,
    recommendedCurrency,
    isLocationAdjusted,
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  // Segmented mode (ideal for toolbar or directory headers)
  if (mode === 'segmented') {
    const displayList = popularOnly
      ? allCurrencies.filter((c) => ['USD', 'NGN', 'KES', 'ZAR', 'GBP', 'EUR'].includes(c.code))
      : allCurrencies.slice(0, 6);

    return (
      <div
        id={`${idPrefix}-segmented-toggle`}
        data-testid={`${idPrefix}-segmented-toggle`}
        className={`flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs ${className}`}
      >
        {showLabel && (
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1 shrink-0">
            <Coins className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            <span>Currency:</span>
          </span>
        )}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {displayList.map((c) => {
            const isSelected = currency === c.code;
            const isLocal = c.code === recommendedCurrency.code;
            return (
              <button
                key={c.code}
                type="button"
                id={`${idPrefix}-btn-${c.code.toLowerCase()}`}
                data-testid={`${idPrefix}-btn-${c.code.toLowerCase()}`}
                onClick={() => setCurrency(c.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 relative ${
                  isSelected
                    ? 'bg-lime-500 text-slate-950 font-black shadow-xs ring-1 ring-lime-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={`${c.name} (${c.code} - ${c.symbol})${isLocal ? ' • 📍 Local Currency for your region' : ''}`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
                {isLocal && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 -ml-0.5" title="Local Currency" />
                )}
                <span className="text-[10px] opacity-75">({c.symbol})</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact badge mode
  if (mode === 'compact') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          id={`${idPrefix}-compact-btn`}
          data-testid={`${idPrefix}-compact-btn`}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-slate-400 transition-all shadow-xs"
          title={`Active currency: ${currentCurrency.name} (${currentCurrency.code}) • ${
            isLocationAdjusted ? `📍 Localized for ${detectedLocation.country}` : 'Custom Currency'
          }`}
        >
          <span>{currentCurrency.flag}</span>
          <span>{currentCurrency.code}</span>
          <span className="text-lime-600 dark:text-lime-400 font-extrabold">{currentCurrency.symbol}</span>
          {isLocationAdjusted && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Location-Adjusted" />
          )}
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Location Notice */}
            <div className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg mb-2 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-lime-500" />
                  <span>{detectedLocation.countryFlag} {detectedLocation.country}</span>
                </span>
                <span className="text-[10px] text-lime-600 dark:text-lime-400">
                  {isLocationAdjusted ? 'Localized' : 'Manual'}
                </span>
              </div>
              <label className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLocationSync}
                  onChange={(e) => setAutoLocationSync(e.target.checked)}
                  className="rounded text-lime-500 focus:ring-lime-400 accent-lime-500 w-3 h-3"
                />
                <span>Auto-match currency with location</span>
              </label>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {allCurrencies.map((c) => {
                const isSelected = currency === c.code;
                const isLocal = c.code === recommendedCurrency.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-lime-500/15 text-lime-700 dark:text-lime-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{c.flag}</span>
                      <span className="font-bold">{c.code}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[80px]">
                        {c.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isLocal && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          Local
                        </span>
                      )}
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{c.symbol}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Dropdown mode (Default: perfect for Navbar & Header)
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
          Currency:
        </span>
      )}

      <button
        type="button"
        id={`${idPrefix}-toggle-btn`}
        data-testid={`${idPrefix}-toggle-btn`}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={`Change currency (Current: ${currentCurrency.code} - ${currentCurrency.name}) • ${
          isLocationAdjusted ? `📍 Localized for ${detectedLocation.country}` : 'Custom Currency'
        }`}
      >
        <span className="text-sm">{currentCurrency.flag}</span>
        <span className="font-extrabold tracking-wide">{currentCurrency.code}</span>
        <span className="px-1.5 py-0.2 rounded-md bg-lime-500/20 text-lime-700 dark:text-lime-300 font-extrabold text-[11px]">
          {currentCurrency.symbol}
        </span>
        {isLocationAdjusted && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Localized for your region" />
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-lime-500' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={`${idPrefix}-dropdown-menu`}
          data-testid={`${idPrefix}-dropdown-menu`}
          role="listbox"
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
        >
          {/* Location-Aware Header Banner */}
          <div className="p-2.5 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-transparent dark:from-lime-500/15 dark:via-emerald-500/10 rounded-xl border border-lime-500/25 mb-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                <span>Detected Geography:</span>
              </span>
              <span className="font-bold text-lime-700 dark:text-lime-400">
                {detectedLocation.countryFlag} {detectedLocation.country}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  id={`${idPrefix}-auto-sync-checkbox`}
                  data-testid={`${idPrefix}-auto-sync-checkbox`}
                  checked={autoLocationSync}
                  onChange={(e) => setAutoLocationSync(e.target.checked)}
                  className="rounded text-lime-500 focus:ring-lime-400 accent-lime-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Auto-adjust rates by location</span>
              </label>

              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {recommendedCurrency.code}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1 pb-1.5 border-b border-slate-200 dark:border-slate-800 mb-1 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-[10.5px]">
              <Coins className="w-3.5 h-3.5 text-lime-500" />
              <span>Supported Currencies</span>
            </div>
            <span className="text-[10px] text-slate-400">Live Rates</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
            {allCurrencies.map((c) => {
              const isSelected = currency === c.code;
              const isLocal = c.code === recommendedCurrency.code;

              return (
                <button
                  key={c.code}
                  type="button"
                  id={`${idPrefix}-option-${c.code.toLowerCase()}`}
                  data-testid={`${idPrefix}-option-${c.code.toLowerCase()}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-lime-500 text-slate-950 font-black shadow-md ring-2 ring-lime-400/40'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{c.flag}</span>
                    <div className="leading-tight min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs">{c.code}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            isSelected
                              ? 'bg-slate-950/20 text-slate-950'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {c.symbol}
                        </span>
                        {isLocal && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                              isSelected
                                ? 'bg-slate-950 text-lime-300'
                                : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            📍 Local
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10.5px] block truncate max-w-[150px] ${
                          isSelected ? 'text-slate-900/80 font-medium' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {c.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] opacity-75 font-mono">
                      {c.rateAgainstUSD === 1 ? 'Base USD' : `1$ ≈ ${c.rateAgainstUSD}`}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-slate-950 ml-auto mt-0.5 stroke-[3]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 px-2 py-1 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-sky-400" />
              <span>Auto-adjusts consultation & services</span>
            </span>
            <span className="font-mono font-bold text-lime-600 dark:text-lime-400">
              1 USD = {currentCurrency.rateAgainstUSD} {currentCurrency.code}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
