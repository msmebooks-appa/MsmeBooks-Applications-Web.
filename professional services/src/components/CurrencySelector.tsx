import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Coins, RefreshCw, Activity } from 'lucide-react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';

interface CurrencySelectorProps {
  compact?: boolean;
  className?: string;
  variant?: 'header' | 'banner' | 'mobile' | 'dropdown' | 'compact';
}

const PRIMARY_HEADER_CURRENCIES: CurrencyCode[] = ['NGN', 'KES', 'GHS', 'USD'];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
  variant = 'header',
}) => {
  const {
    currentCurrency,
    currencyCode,
    setCurrencyCode,
    currencies,
    isRefreshingRates,
    ratesSource,
    lastRatesUpdatedAt,
    refreshExchangeRates,
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: CurrencyCode) => {
    setCurrencyCode(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const isCurrentPrimary = PRIMARY_HEADER_CURRENCIES.includes(currencyCode);

  const formattedUpdatedTime = lastRatesUpdatedAt
    ? new Date(lastRatesUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  /* =========================================================================
     VARIANT: BANNER (Micro pill for the top dark blue announcement bar)
     ========================================================================= */
  if (variant === 'banner') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2 py-0.5 rounded-md border border-white/10 text-xs">
          <Coins className="w-3 h-3 text-[#B7E532]" />
          <span className="text-[11px] text-slate-300 font-semibold hidden md:inline">Currency:</span>

          <div className="flex items-center gap-0.5 ml-0.5">
            {PRIMARY_HEADER_CURRENCIES.map((code) => {
              const isActive = currencyCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B7E532] text-[#102B4E] shadow-2xs'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Convert service & subscription prices to ${code}`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`ml-1 pl-1 border-l border-white/20 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer ${
              !isCurrentPrimary ? 'text-[#B7E532]' : 'text-slate-300 hover:text-white'
            }`}
            title="More African & Global Currencies"
          >
            <span>{!isCurrentPrimary ? currentCurrency.code : 'More'}</span>
            <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && renderDropdown()}
      </div>
    );
  }

  /* =========================================================================
     VARIANT: MOBILE (Touch-friendly segmented group for drawer)
     ========================================================================= */
  if (variant === 'mobile') {
    return (
      <div className={`w-full relative ${className}`} ref={dropdownRef}>
        <div className="flex flex-wrap items-center gap-1.5">
          {PRIMARY_HEADER_CURRENCIES.map((code) => {
            const currObj = currencies.find((c) => c.code === code);
            const isActive = currencyCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className={`flex-1 min-w-[64px] py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#1464C8] text-white border-[#1464C8] shadow-xs ring-2 ring-blue-400/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{currObj?.flag}</span>
                <span>{code}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              !isCurrentPrimary
                ? 'bg-[#1464C8] text-white border-[#1464C8]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title="More Currencies"
          >
            <span>{!isCurrentPrimary ? `${currentCurrency.flag} ${currentCurrency.code}` : '🌍 +12'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isOpen && renderDropdown()}
      </div>
    );
  }

  /* =========================================================================
     VARIANT: HEADER (Main navigation bar segmented switcher + dropdown)
     ========================================================================= */
  return (
    <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
      {/* Segmented Quick Currency Switcher Container */}
      <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs transition-all">
        {/* Currency Icon Label */}
        <div
          className="hidden 2xl:flex items-center gap-1 px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400"
          title="Real-Time Global Currency Switcher"
        >
          <Coins className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
          <span>FX:</span>
        </div>

        {/* Primary Currencies: NGN, KES, GHS, USD */}
        <div className="flex items-center gap-0.5">
          {PRIMARY_HEADER_CURRENCIES.map((code) => {
            const currObj = currencies.find((c) => c.code === code);
            const isActive = currencyCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-white dark:bg-[#102B4E] text-[#1464C8] dark:text-[#B7E532] shadow-xs border border-blue-200/70 dark:border-[#1464C8]/50 ring-1 ring-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
                title={`Convert all services & subscriptions to ${currObj?.name} (${currObj?.symbol})`}
                aria-pressed={isActive}
              >
                <span className="text-xs leading-none">{currObj?.flag}</span>
                <span>{code}</span>
              </button>
            );
          })}
        </div>

        {/* "+ More" Dropdown Trigger for ZAR, GBP, EUR, XAF, etc. */}
        <div className="pl-0.5 ml-0.5 border-l border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isCurrentPrimary
                ? 'bg-[#1464C8] text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
            title="Choose from all 16 African and international currencies"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {!isCurrentPrimary ? (
              <span className="flex items-center gap-1 font-black">
                <span>{currentCurrency.flag}</span>
                <span>{currentCurrency.code}</span>
              </span>
            ) : (
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                +More
              </span>
            )}
            <ChevronDown
              className={`w-3 h-3 text-slate-400 dark:text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu Modal */}
      {isOpen && renderDropdown()}
    </div>
  );

  /* =========================================================================
     SHARED DROPDOWN MENU RENDERER
     ========================================================================= */
  function renderDropdown() {
    return (
      <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#0A1727] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-3.5 pt-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#102B4E] dark:text-slate-100">
              <Coins className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Real-Time FX Currency</span>
            </div>
            <button
              type="button"
              onClick={() => void refreshExchangeRates(true)}
              disabled={isRefreshingRates}
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532] hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors cursor-pointer disabled:opacity-60"
              title="Fetch latest live exchange rates"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isRefreshingRates ? 'animate-spin' : ''}`} />
              <span>{isRefreshingRates ? 'Updating...' : 'Refresh FX'}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search currency, country, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
            />
          </div>
        </div>

        {/* Quick Popular Currencies Bar */}
        {!searchQuery && (
          <div className="px-3 py-1.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase">
              Quick:
            </span>
            <div className="flex gap-1">
              {(['NGN', 'KES', 'GHS', 'USD', 'ZAR', 'GBP'] as CurrencyCode[]).map((cCode) => (
                <button
                  key={cCode}
                  type="button"
                  onClick={() => handleSelect(cCode)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer text-[10px] ${
                    currencyCode === cCode
                      ? 'bg-[#1464C8] text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cCode}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Currencies List */}
        <div className="max-h-64 overflow-y-auto py-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
          {filteredCurrencies.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No matching currency found.
            </div>
          ) : (
            filteredCurrencies.map((c) => {
              const isSelected = currencyCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 font-bold text-[#1464C8] dark:text-[#B7E532]'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0">{c.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold tracking-wide">{c.code}</span>
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                          ({c.symbol})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {c.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {c.code === 'NGN' ? 'Base (1:1)' : `~₦${c.approxNGNPerUnit.toLocaleString()}`}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#1464C8] dark:bg-[#B7E532] text-white dark:text-[#102B4E] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Notice */}
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-[#071322] border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 truncate">
            <Activity
              className={`w-3 h-3 shrink-0 ${
                ratesSource === 'live'
                  ? 'text-emerald-500'
                  : ratesSource === 'cached'
                  ? 'text-[#1464C8] dark:text-[#B7E532]'
                  : 'text-amber-500'
              }`}
            />
            <span className="truncate">
              {ratesSource === 'live'
                ? 'Live FX rates'
                : ratesSource === 'cached'
                ? 'Live FX (cached)'
                : 'Standard FX rates'}
              {formattedUpdatedTime ? ` · ${formattedUpdatedTime}` : ''}
            </span>
          </span>
          <span className="font-bold text-[#1464C8] dark:text-[#B7E532] shrink-0">
            {currentCurrency.code} Active
          </span>
        </div>
      </div>
    );
  }
};
