import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Globe,
  Coins,
  Check,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyConfig } from '../types/currency';
import { CURRENCY_REGIONS, CurrencyRegionTab } from '../data/worldCurrencies';
import { AddCountryCurrencyModal } from './AddCountryCurrencyModal';

interface SubscriptionCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionCurrencyModal: React.FC<SubscriptionCurrencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentCurrency, setCurrency, currencies, currentConfig } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CurrencyRegionTab>('All');
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((c) => {
      // Region filter
      if (activeTab === 'Popular' && !c.isPopular) return false;
      if (
        activeTab !== 'All' &&
        activeTab !== 'Popular' &&
        c.region !== activeTab
      ) {
        return false;
      }

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        (c.region && c.region.toLowerCase().includes(q))
      );
    });
  }, [currencies, activeTab, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (code: string) => {
    setCurrency(code);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="currency-modal-title"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white dark:bg-[#131D35] rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[90vh] transition-colors duration-200">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#14243A] via-[#1B3050] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#B5E61D] shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5E61D]">
                    Universal Currency Exchange
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white">
                    {currencies.length} Countries & Currencies
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                    Default: Nigeria (NGN ₦)
                  </span>
                </div>
                <h2
                  id="currency-modal-title"
                  className="text-lg sm:text-xl font-extrabold text-white leading-tight mt-0.5"
                >
                  Choose Subscription Billing Currency
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close currency modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Active Currency Banner */}
          <div className="px-6 py-3 bg-slate-100 dark:bg-[#0D1527] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Currently Selected:
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-[#14243A] dark:text-white px-2.5 py-1 bg-white dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-sm">{currentConfig.flag}</span>
                <span>{currentConfig.code}</span>
                <span className="text-slate-400">({currentConfig.symbol})</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">· {currentConfig.name}</span>
                {currentConfig.code === 'NGN' && (
                  <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase">
                    System Default
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddCountryModal(true)}
                className="px-3 py-1 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg font-bold flex items-center gap-1 shadow-xs cursor-pointer text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Any Country</span>
              </button>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-[11px] hidden sm:flex">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  1 USD ≈ {currentConfig.ratePerUSD.toLocaleString()} {currentConfig.code}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Region Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0 bg-white dark:bg-[#131D35]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 150+ countries, currency codes (NGN, USD, EUR, KES), names, or symbols..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#0066CC] dark:focus:border-[#38BDF8] transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAddCountryModal(true)}
                className="px-3 py-2.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                title="Add any country not in the list"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Country</span>
              </button>
            </div>

            {/* Region Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {CURRENCY_REGIONS.map((region) => {
                const isTabActive = activeTab === region;
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setActiveTab(region)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isTabActive
                        ? 'bg-[#0066CC] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{filteredCurrencies.length}</strong> currencies
                {activeTab !== 'All' && ` in ${activeTab}`}
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Nigeria NGN (Default)
              </span>
            </div>

            {filteredCurrencies.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No currencies match "{searchQuery}"
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Want to add this country? Click below to instantly register any country and currency.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddCountryModal(true)}
                  className="px-4 py-2 bg-[#0066CC] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add "{searchQuery}" as Country</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredCurrencies.map((c) => {
                  const isSelected = c.code === currentCurrency;
                  const isDefault = c.code === 'NGN';

                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelect(c.code)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/80 border-[#0066CC] dark:border-[#38BDF8] ring-2 ring-[#0066CC]/20 shadow-xs'
                          : 'bg-white dark:bg-[#162340] border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#1B2C52]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl leading-none shrink-0" role="img" aria-label={c.country}>
                          {c.flag}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {c.code}
                            </span>
                            <span className="font-mono text-slate-500 text-xs">
                              ({c.symbol})
                            </span>
                            {isDefault && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                            {c.country}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#0066CC] dark:bg-[#38BDF8] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-slate-400 group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] font-bold">
                            {c.ratePerUSD < 1
                              ? `${c.ratePerUSD.toFixed(2)}/USD`
                              : `${Math.round(c.ratePerUSD).toLocaleString()}/USD`}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-[#0D1527] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0 flex-wrap">
            <span className="text-slate-500 dark:text-slate-400">
              Exchange rates are synchronized for all subscription tiers & invoice generation. Nigeria NGN is default.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddCountryModal(true)}
                className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 rounded-xl font-bold cursor-pointer"
              >
                + Add Custom Country
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Country Modal */}
      <AddCountryCurrencyModal
        isOpen={showAddCountryModal}
        onClose={() => setShowAddCountryModal(false)}
      />
    </>
  );
};
