import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Globe,
  ChevronDown,
  Search,
  Check,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  X,
  Zap,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { Currency, BillingPeriod, PricingPlan } from '../types';
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_LIST,
  POPULAR_CURRENCIES,
  formatCurrency,
  convertFromNgn,
  getLiveExchangeRate,
} from '../utils/currency';
import { CurrencyTrendSparkline } from './CurrencyTrendSparkline';
import { get30DayCurrencyTrend } from '../utils/currencyTrends';
import { PRICING_PLANS } from '../data/pricingData';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCart } from '../context/CartContext';

interface RealTimeCurrencyWidgetProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  compact?: boolean;
}

const REGION_TABS = [
  { id: 'popular', label: 'Popular' },
  { id: 'west_africa', label: 'West Africa', filter: (c: any) => c.region === 'West Africa' },
  { id: 'east_south', label: 'East & South Africa', filter: (c: any) => c.region === 'East Africa' || c.region === 'Southern Africa' },
  { id: 'global', label: 'Europe & Americas', filter: (c: any) => c.region === 'Europe & Americas' },
  { id: 'asia_me', label: 'Asia & Middle East', filter: (c: any) => c.region === 'Asia & Pacific' || c.region === 'Middle East' },
  { id: 'all', label: 'All Currencies' },
];

export const RealTimeCurrencyWidget: React.FC<RealTimeCurrencyWidgetProps> = ({
  currentCurrency,
  onCurrencyChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [previewBillingCycle, setPreviewBillingCycle] = useState<BillingPeriod>('monthly');
  const [previewCurrency, setPreviewCurrency] = useState<Currency>(currentCurrency);
  const [customNgnAmount, setCustomNgnAmount] = useState<number>(9000);
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);

  const { exchangeData, isFetching, refreshRates } = useExchangeRates();
  const { addItem, openCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync preview currency with current currency when opened
  useEffect(() => {
    if (isOpen) {
      setPreviewCurrency(currentCurrency);
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [isOpen, currentCurrency]);

  // Handle outside click & escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeCurrencyInfo = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.NGN;
  const previewCurrencyInfo = SUPPORTED_CURRENCIES[previewCurrency] || SUPPORTED_CURRENCIES.NGN;

  // Filter currencies for selection
  const filteredCurrencies = useMemo(() => {
    const list = CURRENCY_LIST;
    return list.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.country && item.country.toLowerCase().includes(q)) ||
        item.symbol.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === 'popular') {
        return POPULAR_CURRENCIES.includes(item.code);
      }
      const tabObj = REGION_TABS.find((t) => t.id === activeTab);
      if (tabObj && tabObj.filter) {
        return tabObj.filter(item);
      }
      return true;
    });
  }, [searchQuery, activeTab]);

  // Rate calculations
  const previewRate = previewCurrencyInfo.rateFromNgn || getLiveExchangeRate(previewCurrency);
  const inverseRate = previewRate > 0 ? 1 / previewRate : 0;
  const previewTrend = useMemo(() => get30DayCurrencyTrend(previewCurrency), [previewCurrency]);

  // Key plans for quick preview
  const keyPlans = useMemo(() => {
    return PRICING_PLANS.filter((p) =>
      ['starter', 'growth', 'business', 'premium', 'enterprise'].includes(p.id)
    );
  }, []);

  const handleApplyToSite = (currCode: Currency) => {
    onCurrencyChange(currCode);
    setPreviewCurrency(currCode);
  };

  const handleAddToCart = (plan: PricingPlan) => {
    addItem(plan.id, previewBillingCycle, undefined, previewCurrency);
    setAddedPlanId(plan.id);
    setTimeout(() => {
      setAddedPlanId(null);
    }, 2000);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Header Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/40 ${
          compact
            ? 'px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
            : 'px-2.5 py-1.5 bg-gradient-to-r from-blue-50/70 to-slate-50 dark:from-[#0B1A30] dark:to-[#081220] hover:from-blue-100/70 hover:to-slate-100 dark:hover:from-[#112442] dark:hover:to-[#0E1A2C] border-blue-200/60 dark:border-blue-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-xs hover:shadow-md'
        }`}
        title="Real-Time Currency Conversion & Quick Plan Pricing"
        aria-label="Real-Time Currency Conversion Widget"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{activeCurrencyInfo.flag}</span>
        <span className="font-extrabold tracking-tight text-[#0A4FD5] dark:text-blue-400">
          {activeCurrencyInfo.symbol.trim()}
        </span>
        <span className="font-bold text-slate-700 dark:text-slate-200">
          {activeCurrencyInfo.code}
        </span>

        {/* Live indicator pip with rates badge */}
        {!compact && (
          <span className="hidden xl:inline-flex items-center gap-1 pl-1 text-[10px] text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {exchangeData.isLive ? 'Live FX' : 'FX'}
            </span>
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0A4FD5] dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Real-Time Currency Converter Dropdown / Modal */}
      {isOpen && (
        <div className="fixed inset-x-2 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[580px] max-h-[85vh] overflow-y-auto bg-white dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-blue-950 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header & Live API Status */}
          <div className="p-4 bg-gradient-to-r from-blue-50/80 via-slate-50 to-blue-50/50 dark:from-[#091B33] dark:via-[#071324] dark:to-[#0A2242] border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#0A4FD5] text-white">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Real-Time Currency Converter & Plan Preview
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Inspect MsmeBooks plan pricing in any global or African currency with live rates before subscribing or adding to cart.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Status Pill with Refresh Button */}
            <div className="mt-3 flex items-center justify-between text-[11px] bg-white/80 dark:bg-[#0A1A2E] p-2 rounded-xl border border-slate-200/70 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {exchangeData.provider}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                  {exchangeData.lastUpdated}
                </span>
              </div>

              <button
                type="button"
                onClick={refreshRates}
                disabled={isFetching}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[#0A4FD5] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh exchange rates now"
              >
                <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                <span>{isFetching ? 'Updating...' : 'Sync'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Currency Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by currency code or country (e.g. USD, EUR, GBP, KES, Ghana...)"
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Regional Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {REGION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0A4FD5] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Currency Selection Chips (Scrollable) */}
            <div className="max-h-32 overflow-y-auto pr-1 grid grid-cols-3 sm:grid-cols-4 gap-1.5 text-xs">
              {filteredCurrencies.slice(0, 24).map((c) => {
                const isSelected = previewCurrency === c.code;
                const isSiteActive = currentCurrency === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setPreviewCurrency(c.code)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0A4FD5] bg-blue-50/80 dark:bg-blue-950/60 dark:border-blue-500 font-bold'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm">{c.flag}</span>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900 dark:text-white">{c.code}</span>
                        {isSiteActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active site currency"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                        {c.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Exchange Rate Spotlight Card */}
            <div className="p-3 bg-gradient-to-r from-blue-900 via-[#071F3F] to-slate-900 text-white rounded-xl shadow-inner border border-blue-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{previewCurrencyInfo.flag}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-blue-200">
                        {previewCurrencyInfo.name} ({previewCurrencyInfo.code})
                      </span>
                      {previewCurrency !== 'NGN' && (
                        <span className="text-[10px] bg-lime-400 text-slate-950 px-1.5 py-0.2 rounded font-extrabold">
                          Live Rate
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                      <span>1 NGN = {previewRate.toFixed(previewRate < 0.01 ? 6 : 4)} {previewCurrency}</span>
                      {previewCurrency !== 'NGN' && inverseRate > 0 && (
                        <span className="text-xs text-blue-300 font-normal">
                          (1 {previewCurrency} ≈ ₦{Math.round(inverseRate).toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentCurrency !== previewCurrency ? (
                    <button
                      type="button"
                      onClick={() => handleApplyToSite(previewCurrency)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#84CC16] hover:bg-lime-500 text-slate-950 shadow-sm transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Set as Site Currency</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-lime-400 font-bold px-2 py-1 bg-lime-500/10 rounded-lg border border-lime-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active on Site</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 30-Day Conversion Trend Sparkline */}
              <div className="mt-3 pt-3 border-t border-blue-800/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-bold text-white text-[11px]">30-Day Conversion Trend</span>
                  </div>
                  <div
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      previewTrend.changePercent >= 0
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {previewTrend.changePercent >= 0 ? '+' : ''}
                    {previewTrend.changePercent.toFixed(2)}% (30d)
                  </div>
                </div>

                <div className="bg-black/30 p-2 rounded-lg border border-blue-900/60">
                  <CurrencyTrendSparkline
                    points={previewTrend.points}
                    isPositive={previewTrend.isPositive}
                    width={330}
                    height={58}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-blue-200 mt-1.5 px-0.5">
                  <span>30d Low: ₦{previewTrend.low.toLocaleString('en-NG', { maximumFractionDigits: 1 })}</span>
                  <span className="text-slate-400">Avg: ₦{previewTrend.averageRate.toLocaleString('en-NG', { maximumFractionDigits: 1 })}</span>
                  <span>30d High: ₦{previewTrend.high.toLocaleString('en-NG', { maximumFractionDigits: 1 })}</span>
                </div>
              </div>
            </div>

            {/* Quick Plan Pricing Preview Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Plan Pricing in {previewCurrency}
                  </span>
                </div>

                {/* Billing toggle inside converter */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewBillingCycle('monthly')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      previewBillingCycle === 'monthly'
                        ? 'bg-white dark:bg-slate-800 text-[#0A4FD5] dark:text-blue-400 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBillingCycle('yearly')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      previewBillingCycle === 'yearly'
                        ? 'bg-white dark:bg-slate-800 text-[#0A4FD5] dark:text-blue-400 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[9px] bg-lime-400/20 text-lime-600 dark:text-lime-400 font-black px-1 rounded">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid in Converted Currency */}
              <div className="space-y-1.5">
                {keyPlans.map((plan) => {
                  const baseRateNgn =
                    previewBillingCycle === 'yearly'
                      ? plan.yearlyPricePerMonth
                      : plan.monthlyPrice;

                  const convertedPriceStr = formatCurrency(baseRateNgn, previewCurrency);
                  const isAdded = addedPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {plan.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            • {plan.usersLimit}
                          </span>
                          {plan.id === 'premium' && (
                            <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1 rounded">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Base: ₦{baseRateNgn.toLocaleString()}/mo
                          {previewBillingCycle === 'yearly' && ' (billed annually)'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-black text-[#0A4FD5] dark:text-blue-400">
                            {convertedPriceStr}
                            <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                              /mo
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            + 7.5% VAT
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(plan)}
                          className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 dark:bg-blue-600 hover:bg-[#0A4FD5] text-white shadow-2xs'
                          }`}
                          title={`Add ${plan.name} to cart in ${previewCurrency}`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Calculator Tab / Box */}
            <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
                <Calculator className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                <span>Quick Custom Amount Converter</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Amount in Nigerian Naira (₦ NGN):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={customNgnAmount}
                      onChange={(e) => setCustomNgnAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Equivalent in {previewCurrency} ({previewCurrencyInfo.symbol.trim()}):
                  </label>
                  <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-extrabold text-[#0A4FD5] dark:text-blue-400 text-sm">
                    {formatCurrency(customNgnAmount, previewCurrency)}
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">Quick Plans:</span>
                {[
                  { label: 'Starter (₦4.5k)', val: 4500 },
                  { label: 'Growth (₦9k)', val: 9000 },
                  { label: 'Business (₦15k)', val: 15000 },
                  { label: 'Premium (₦50k)', val: 50000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setCustomNgnAmount(preset.val)}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={openCart}
              className="font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Review Cart</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href="#plans"
                onClick={() => setIsOpen(false)}
                className="font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Go to Full Table
              </a>
              <button
                type="button"
                onClick={() => handleApplyToSite(previewCurrency)}
                className="px-3 py-1.5 rounded-xl font-bold bg-[#0A4FD5] hover:bg-[#07389B] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Apply {previewCurrency} to Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
