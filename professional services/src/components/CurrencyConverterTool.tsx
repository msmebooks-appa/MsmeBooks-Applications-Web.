import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  X, 
  Coins, 
  Check, 
  TrendingUp, 
  Calculator, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  Info,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useCurrency, CurrencyCode, CurrencyInfo, MAJOR_AFRICAN_CURRENCIES } from '../context/CurrencyContext';

interface CurrencyConverterToolProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'modal' | 'inline' | 'drawer';
  className?: string;
}

// Sample benchmark service packages for quick cross-currency estimation
const BENCHMARK_SERVICES = [
  {
    title: 'Starter Consultation & Setup',
    ngnBase: 35000,
    tag: 'Quick Consult',
    period: 'Single Session',
  },
  {
    title: 'Monthly Bookkeeping Retainer',
    ngnBase: 95000,
    tag: 'Popular',
    period: 'Per Month',
  },
  {
    title: 'POS, Cashier & Inventory Rollout',
    ngnBase: 165000,
    tag: 'Implementation',
    period: 'Turnkey Project',
  },
  {
    title: 'Corporate Tax & VAT Statutory Filing',
    ngnBase: 220000,
    tag: 'Compliance',
    period: 'Annual Package',
  },
  {
    title: 'Enterprise Multi-Branch ERP System',
    ngnBase: 450000,
    tag: 'Enterprise',
    period: 'Custom Blueprint',
  },
];

export const CurrencyConverterTool: React.FC<CurrencyConverterToolProps> = ({
  isOpen = true,
  onClose,
  variant = 'modal',
  className = '',
}) => {
  const { 
    currentCurrency, 
    currencyCode, 
    setCurrencyCode, 
    currencies, 
    convertBetween, 
    getExchangeRate 
  } = useCurrency();

  // Calculator states
  const [fromCode, setFromCode] = useState<CurrencyCode>('NGN');
  const [toCode, setToCode] = useState<CurrencyCode>(() => {
    return currencyCode === 'NGN' ? 'USD' : currencyCode;
  });
  const [inputAmount, setInputAmount] = useState<string>('100000');
  const [activeTab, setActiveTab] = useState<'calculator' | 'benchmarks' | 'rates'>('calculator');
  const [justApplied, setJustApplied] = useState<boolean>(false);

  // Parse numerical amount
  const numericAmount = useMemo(() => {
    const cleaned = inputAmount.replace(/[^0-9.]/g, '');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }, [inputAmount]);

  // Source and target currency objects
  const fromCurrency = useMemo(() => {
    return currencies.find((c) => c.code === fromCode) || currencies[0];
  }, [currencies, fromCode]);

  const toCurrency = useMemo(() => {
    return currencies.find((c) => c.code === toCode) || currencies[1];
  }, [currencies, toCode]);

  // Live conversion result
  const convertedAmount = useMemo(() => {
    if (numericAmount <= 0) return 0;
    return convertBetween(numericAmount, fromCode, toCode);
  }, [numericAmount, fromCode, toCode, convertBetween]);

  // Live exchange rate
  const exchangeRate = useMemo(() => {
    return getExchangeRate(fromCode, toCode);
  }, [fromCode, toCode, getExchangeRate]);

  // Inverse rate
  const inverseExchangeRate = useMemo(() => {
    return getExchangeRate(toCode, fromCode);
  }, [fromCode, toCode, getExchangeRate]);

  // Swap currencies
  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Set platform-wide currency
  const handleSetPlatformCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 2000);
  };

  // Quick preset amount buttons
  const handleQuickAmount = (val: number) => {
    setInputAmount(val.toString());
  };

  if (variant === 'modal' && !isOpen) {
    return null;
  }

  const content = (
    <div className="space-y-6">
      {/* Top Header / Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1464C8] text-white flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4 text-[#B7E532]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#102B4E] dark:text-white flex items-center gap-2">
                <span>Pan-African Currency Converter</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532]">
                  Live FX
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly toggle between NGN, KES, GHS, USD, and ZAR across all marketplace service prices.
              </p>
            </div>
          </div>
        </div>

        {/* Global Active Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-[#0D1D31] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Active Currency:</span>
            <span className="font-black text-[#1464C8] dark:text-[#B7E532] flex items-center gap-1">
              <span>{currentCurrency.flag}</span>
              <span>{currentCurrency.code} ({currentCurrency.symbol})</span>
            </span>
          </div>
          {variant === 'modal' && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick 1-Click Major African Currencies Toggle Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
            <span>1-Click Switcher (Applies to all 132+ services):</span>
          </label>
          <span className="text-[11px] text-slate-400">Real-time sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MAJOR_AFRICAN_CURRENCIES.map((code) => {
            const cur = currencies.find((c) => c.code === code) || currencies[0];
            const isSelected = currencyCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleSetPlatformCurrency(code)}
                className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white border-transparent shadow-md ring-2 ring-[#B7E532]'
                    : 'bg-white dark:bg-[#0D1D31] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#1464C8]/50 hover:bg-slate-50 dark:hover:bg-[#12243d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl leading-none">{cur.flag}</span>
                  {isSelected ? (
                    <span className="w-4 h-4 rounded-full bg-[#B7E532] text-[#102B4E] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Select</span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-black text-sm tracking-wide flex items-center gap-1">
                    <span>{cur.code}</span>
                    <span className={isSelected ? 'text-[#B7E532]' : 'text-slate-400'}>
                      ({cur.symbol})
                    </span>
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {cur.region.split('/')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs: Interactive Calculator | Benchmark Packages | Rate Matrix */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532] border-b-2 border-[#1464C8] dark:border-[#B7E532]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('benchmarks')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'benchmarks'
              ? 'bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532] border-b-2 border-[#1464C8] dark:border-[#B7E532]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Benchmark Service Packages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rates')}
          className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rates'
              ? 'bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532] border-b-2 border-[#1464C8] dark:border-[#B7E532]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>FX Rate Matrix</span>
        </button>
      </div>

      {/* Tab 1: Interactive Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            {/* From Input Card */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                You Convert (From)
              </label>
              
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value as CurrencyCode)}
                  className="bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer focus:ring-2 focus:ring-[#1464C8] focus:outline-none flex-1"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">
                  {fromCurrency.symbol}
                </span>
                <input
                  type="text"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-black text-[#102B4E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                />
              </div>

              {/* Quick Amount presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[10000, 50000, 100000, 250000, 500000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuickAmount(preset)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-[#07111D] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-2 md:py-0">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532] border border-blue-200 dark:border-blue-900/60 hover:bg-[#1464C8] hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer group"
                title="Swap currencies"
              >
                <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* To Converted Card */}
            <div className="md:col-span-5 bg-gradient-to-br from-blue-50/80 to-slate-50 dark:from-blue-950/30 dark:to-[#0D1D31] p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/40">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532] uppercase tracking-wider block">
                  Converted Output (To)
                </label>
                <span className="text-[10px] font-semibold text-slate-400">
                  1 {fromCode} = {exchangeRate >= 1 ? exchangeRate.toFixed(2) : exchangeRate.toFixed(4)} {toCode}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value as CurrencyCode)}
                  className="bg-white dark:bg-[#07111D] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer focus:ring-2 focus:ring-[#1464C8] focus:outline-none flex-1"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Big Result Output */}
              <div className="bg-white dark:bg-[#07111D] p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-xs">
                <div className="text-[10px] text-slate-400 font-medium">Estimated Value:</div>
                <div className="text-2xl font-black text-[#1464C8] dark:text-[#B7E532] truncate">
                  {toCurrency.symbol}{Math.round(convertedAmount).toLocaleString()}
                </div>
              </div>

              {/* Set as Active Platform Currency Button */}
              <button
                type="button"
                onClick={() => handleSetPlatformCurrency(toCode)}
                className={`w-full mt-3 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  currencyCode === toCode
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1464C8] hover:bg-[#1052a5] text-white'
                }`}
              >
                {currencyCode === toCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{toCode} is Active on All Services</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#B7E532]" />
                    <span>Apply {toCode} ({toCurrency.symbol}) to Entire Marketplace</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time Multi-Currency African Comparison Grid */}
          <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#102B4E] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                <span>Equivalent Across African Business Hubs for {fromCurrency.symbol}{numericAmount.toLocaleString()}:</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to apply</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {MAJOR_AFRICAN_CURRENCIES.map((code) => {
                const cur = currencies.find((c) => c.code === code) || currencies[0];
                const converted = Math.round(convertBetween(numericAmount, fromCode, code));
                const isSelected = currencyCode === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSetPlatformCurrency(code)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1464C8] dark:border-[#B7E532] ring-1 ring-[#1464C8]'
                        : 'bg-slate-50 dark:bg-[#0D1D31] border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <span>{cur.flag}</span>
                        <span>{cur.code}</span>
                      </span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532] text-white dark:text-[#102B4E] flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm font-black text-[#102B4E] dark:text-white truncate">
                      {cur.symbol}{converted.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {cur.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Benchmark Service Packages */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Real-world pricing examples from MsmeBooks professional catalogue converted across currencies:
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0A1727]">
            {BENCHMARK_SERVICES.map((item, idx) => {
              const ngnPrice = item.ngnBase;
              const kesPrice = Math.round(convertBetween(ngnPrice, 'NGN', 'KES'));
              const ghsPrice = Math.round(convertBetween(ngnPrice, 'NGN', 'GHS'));
              const usdPrice = Math.round(convertBetween(ngnPrice, 'NGN', 'USD'));
              const zarPrice = Math.round(convertBetween(ngnPrice, 'NGN', 'ZAR'));

              return (
                <div
                  key={idx}
                  className="p-3.5 hover:bg-slate-50 dark:hover:bg-[#0D1D31] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#102B4E] dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Billing Type: {item.period}
                    </p>
                  </div>

                  {/* Multi-Currency Price Comparison Bar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      ₦{ngnPrice.toLocaleString()}
                    </span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
                      KSh {kesPrice.toLocaleString()}
                    </span>
                    <span className="font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded">
                      GH₵ {ghsPrice.toLocaleString()}
                    </span>
                    <span className="font-black text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded">
                      ${usdPrice.toLocaleString()}
                    </span>
                    <span className="font-extrabold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded">
                      R {zarPrice.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setFromCode('NGN');
                        setInputAmount(ngnPrice.toString());
                        setActiveTab('calculator');
                      }}
                      className="text-[10px] font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline cursor-pointer ml-1"
                    >
                      Calculate →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: FX Rate Matrix */}
      {activeTab === 'rates' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Indicative African commercial rates vs Nigerian Naira (NGN Base):</span>
            <span className="text-[10px] text-slate-400">Updated for 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {currencies.map((c) => {
              if (c.code === 'NGN') return null;
              const rateVsUSD = (1 / c.rateFromNGN) / (1 / (currencies.find(u => u.code === 'USD')?.rateFromNGN || 0.00067));
              return (
                <div
                  key={c.code}
                  className="p-3 bg-white dark:bg-[#0A1727] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <div>
                      <div className="font-black text-[#102B4E] dark:text-white">
                        {c.code} ({c.symbol})
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                        {c.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-[#1464C8] dark:text-[#B7E532]">
                      1 {c.code} = ~₦{c.approxNGNPerUnit.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Rate: {c.rateFromNGN} NGN
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info & Confirmation Toast */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#B7E532]" />
          <span>All escrow payments and invoice generation automatically adopt your selected currency.</span>
        </div>

        {justApplied && (
          <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#B7E532] font-black rounded-lg text-xs animate-in fade-in">
            ✓ Successfully set to {currentCurrency.code} ({currentCurrency.symbol})!
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="bg-white dark:bg-[#08121E] w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs ${className}`}>
      {content}
    </div>
  );
};
