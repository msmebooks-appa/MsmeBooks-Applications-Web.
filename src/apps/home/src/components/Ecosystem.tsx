import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  FileText,
  Smartphone,
  Package,
  Users,
  Truck,
  Receipt,
  Landmark,
  Coins,
  UserCheck,
  Briefcase,
  ShoppingBag,
  ShieldCheck,
  BarChart3,
  Globe,
  PieChart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Sliders,
  DollarSign,
  Copy,
  Check,
  Building2,
} from 'lucide-react';
import { ECOSYSTEM_MODULES, CURRENCIES } from '../data/mockData';
import { CurrencyCode, CurrencyConfig } from '../types';
import { useCurrency } from '../context/CurrencyContext';

const iconMap: Record<string, any> = {
  Calculator,
  FileText,
  Smartphone,
  Package,
  Users,
  Truck,
  Receipt,
  Landmark,
  Coins,
  UserCheck,
  Briefcase,
  ShoppingBag,
  Building2,
  ShieldCheck,
  BarChart3,
  Globe,
  PieChart,
  Sparkles,
};

interface EcosystemProps {
  currentCurrency?: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo?: () => void;
}

// Major African Trade Corridors
interface TradeCorridor {
  id: string;
  name: string;
  route: string;
  from: CurrencyCode;
  to: CurrencyCode;
  defaultAmount: number;
  highlight: string;
}

const TRADE_CORRIDORS: TradeCorridor[] = [
  {
    id: 'lagos-nairobi',
    name: 'West to East African Tech & Retail',
    route: 'Lagos ⇄ Nairobi',
    from: 'NGN',
    to: 'KES',
    defaultAmount: 2500000,
    highlight: 'Tech Hub & E-Commerce Corridor',
  },
  {
    id: 'lagos-accra',
    name: 'ECOWAS Coastal Trade Route',
    route: 'Lagos ⇄ Accra',
    from: 'NGN',
    to: 'GHS',
    defaultAmount: 1500000,
    highlight: 'FMCG, Textiles & Retail Corridor',
  },
  {
    id: 'joburg-lusaka',
    name: 'SADC Mining & Manufacturing',
    route: 'Johannesburg ⇄ Lusaka',
    from: 'ZAR',
    to: 'ZMW',
    defaultAmount: 75000,
    highlight: 'Cross-Border Wholesale & Agribusiness',
  },
  {
    id: 'nairobi-kampala',
    name: 'East African Community Trade',
    route: 'Nairobi ⇄ Kampala',
    from: 'KES',
    to: 'UGX',
    defaultAmount: 200000,
    highlight: 'Cross-Border Agriculture & Transit',
  },
  {
    id: 'cairo-casablanca',
    name: 'North African Commercial Axis',
    route: 'Cairo ⇄ Casablanca',
    from: 'EGP',
    to: 'MAD',
    defaultAmount: 100000,
    highlight: 'Industrial, Pharma & Logistics Trade',
  },
  {
    id: 'douala-kigali',
    name: 'Central to East African Corridor',
    route: 'Douala ⇄ Kigali',
    from: 'XAF',
    to: 'RWF',
    defaultAmount: 1200000,
    highlight: 'Coffee, Mineral & Consumer Goods',
  },
  {
    id: 'lagos-newyork',
    name: 'Pan-African FX & Diaspora Settlement',
    route: 'Lagos ⇄ New York',
    from: 'NGN',
    to: 'USD',
    defaultAmount: 3000000,
    highlight: 'Import/Export & Global SaaS Invoicing',
  },
  {
    id: 'harare-joburg',
    name: 'Southern Cross-Border Remittance',
    route: 'Harare ⇄ Johannesburg',
    from: 'ZIP',
    to: 'ZAR',
    defaultAmount: 25000,
    highlight: 'Regional Commerce & Supply Chain',
  },
];

// Currencies prioritized in the African converter
const AFRICAN_CURRENCIES_LIST: CurrencyCode[] = [
  'NGN',
  'KES',
  'ZAR',
  'GHS',
  'MAD',
  'XAF',
  'UGX',
  'TZS',
  'RWF',
  'ZMW',
  'EGP',
  'ZIP',
  'USD',
  'EUR',
  'GBP',
  'AED',
];

export const Ecosystem: React.FC<EcosystemProps> = ({
  currentCurrency: propCurrentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
}) => {
  const { currentCurrency: contextCurrency, setCurrency } = useCurrency();
  const activeAppCurrency = propCurrentCurrency || contextCurrency || 'NGN';

  // Section View Tab
  const [activeTab, setActiveTab] = useState<'modules' | 'converter'>('converter');

  // Selected Module for the Interactive Node Inspector
  const [selectedModule, setSelectedModule] = useState(ECOSYSTEM_MODULES[0]);

  // Converter States
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(activeAppCurrency);
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(
    activeAppCurrency === 'KES' ? 'NGN' : 'KES'
  );
  const [amount, setAmount] = useState<number>(500000);
  const [isLiveFluctuation, setIsLiveFluctuation] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);

  // Micro-fluctuation delta multiplier for live mock simulation (e.g. 0.9995 to 1.0005)
  const [mockFluctuationRates, setMockFluctuationRates] = useState<Record<CurrencyCode, number>>({
    NGN: 1,
    USD: 1.0002,
    GBP: 0.9997,
    EUR: 1.0004,
    KES: 0.9992,
    ZAR: 1.0008,
    GHS: 0.9996,
    MAD: 1.0001,
    XAF: 1.0003,
    AED: 1.0001,
    UGX: 0.9994,
    TZS: 1.0002,
    RWF: 1.0005,
    ZMW: 0.9991,
    EGP: 1.0007,
    ZIP: 0.9998,
  });

  // Ticker rate shifts for visual feedback
  const [rateDirections, setRateDirections] = useState<Record<string, 'up' | 'down'>>({
    'NGN/KES': 'up',
    'NGN/GHS': 'down',
    'ZAR/NGN': 'up',
    'USD/NGN': 'up',
    'KES/UGX': 'down',
    'XAF/NGN': 'up',
    'EGP/MAD': 'up',
    'RWF/KES': 'down',
  });

  // Pulse effect simulation every 4 seconds
  useEffect(() => {
    if (!isLiveFluctuation) return;

    const interval = setInterval(() => {
      setMockFluctuationRates((prev) => {
        const next = { ...prev };
        AFRICAN_CURRENCIES_LIST.forEach((code) => {
          if (code === 'NGN') return; // base
          // Random slight drift of ±0.06%
          const drift = (Math.random() - 0.5) * 0.0012;
          next[code] = Math.max(0.98, Math.min(1.02, (prev[code] || 1) + drift));
        });
        return next;
      });

      // Toggle random directions for ticker
      setRateDirections((prev) => ({
        ...prev,
        'NGN/KES': Math.random() > 0.4 ? 'up' : 'down',
        'NGN/GHS': Math.random() > 0.5 ? 'up' : 'down',
        'ZAR/NGN': Math.random() > 0.4 ? 'up' : 'down',
        'USD/NGN': Math.random() > 0.3 ? 'up' : 'down',
      }));

      setLastRefreshed(new Date());
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveFluctuation]);

  // Handle manual rate refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMockFluctuationRates((prev) => {
        const next = { ...prev };
        AFRICAN_CURRENCIES_LIST.forEach((code) => {
          if (code === 'NGN') return;
          const drift = (Math.random() - 0.5) * 0.0018;
          next[code] = Math.max(0.97, Math.min(1.03, (prev[code] || 1) + drift));
        });
        return next;
      });
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 400);
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Select Trade Corridor
  const handleSelectCorridor = (corridor: TradeCorridor) => {
    setFromCurrency(corridor.from);
    setToCurrency(corridor.to);
    setAmount(corridor.defaultAmount);
  };

  // Compute live effective exchange rates between fromCurrency and toCurrency
  const { fromConfig, toConfig, effectiveRate, convertedTotal, inverseRate } = useMemo(() => {
    const fromCfg: CurrencyConfig = CURRENCIES[fromCurrency] || CURRENCIES.NGN;
    const toCfg: CurrencyConfig = CURRENCIES[toCurrency] || CURRENCIES.KES;

    const fromFactor = mockFluctuationRates[fromCurrency] || 1;
    const toFactor = mockFluctuationRates[toCurrency] || 1;

    // 1 From in NGN:
    const fromUnitInNGN = (fromCfg.rateToNGN || 1) * fromFactor;
    // 1 To in NGN:
    const toUnitInNGN = (toCfg.rateToNGN || 1) * toFactor;

    // Rate: How many 'To' units for 1 'From' unit
    const rate = toUnitInNGN > 0 ? fromUnitInNGN / toUnitInNGN : 1;
    const inv = rate > 0 ? 1 / rate : 1;

    const total = amount * rate;

    return {
      fromConfig: fromCfg,
      toConfig: toCfg,
      effectiveRate: rate,
      convertedTotal: total,
      inverseRate: inv,
    };
  }, [fromCurrency, toCurrency, amount, mockFluctuationRates]);

  // Compute estimated savings vs traditional African commercial banks
  const estimatedSavings = useMemo(() => {
    // Legacy bank spreads average ~4.2% in Sub-Saharan Africa
    // MsmeBooks built-in automated FX ledger accounts for ~0.4%
    const legacyFee = convertedTotal * 0.042;
    const msmeBooksFee = convertedTotal * 0.004;
    return Math.max(0, legacyFee - msmeBooksFee);
  }, [convertedTotal]);

  // Format large numbers cleanly
  const formatNumberWithDecimals = (val: number, maxDecimals = 2): string => {
    if (isNaN(val)) return '0';
    if (val >= 1000) {
      return val.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals,
      });
    }
    if (val >= 1) {
      return val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDecimals,
      });
    }
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  };

  // Quick Amount presets
  const amountPresets = [
    { label: '50K', value: 50000 },
    { label: '250K', value: 250000 },
    { label: '1M', value: 1000000 },
    { label: '5M', value: 5000000 },
    { label: '10M', value: 10000000 },
  ];

  return (
    <section
      id="ecosystem"
      className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#090E1A] relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800 transition-colors duration-200"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-blue-500/5 via-[#B7F000]/10 to-transparent dark:from-blue-600/10 dark:via-[#B7F000]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Live Pan-African FX Ticker Bar */}
        <div className="mb-8 p-3 rounded-2xl bg-white/90 dark:bg-[#0E172A]/90 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-md overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLiveFluctuation ? 'bg-emerald-400' : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isLiveFluctuation ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </span>
              <span className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>Pan-African FX Ticker</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0866FF] dark:text-blue-300 font-bold">
                  LIVE
                </span>
              </span>
            </div>

            {/* Scrolling / Flex Ticker Items */}
            <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto font-mono text-[11px]">
              <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">NGN/KES:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(0.0862 * (mockFluctuationRates.KES || 1)).toFixed(4)}
                </span>
                {rateDirections['NGN/KES'] === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">NGN/GHS:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(0.0102 * (mockFluctuationRates.GHS || 1)).toFixed(4)}
                </span>
                {rateDirections['NGN/GHS'] === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">ZAR/NGN:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(80 * (mockFluctuationRates.ZAR || 1)).toFixed(2)}
                </span>
                {rateDirections['ZAR/NGN'] === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">USD/NGN:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(1500 * (mockFluctuationRates.USD || 1)).toFixed(1)}
                </span>
                {rateDirections['USD/NGN'] === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">KES/UGX:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(29.0 * (mockFluctuationRates.UGX || 1)).toFixed(2)}
                </span>
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              </div>
            </div>

            {/* Time / Mode toggle */}
            <div className="hidden lg:flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
              <button
                onClick={() => setIsLiveFluctuation(!isLiveFluctuation)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                  isLiveFluctuation
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Toggle live rate fluctuation simulation"
              >
                {isLiveFluctuation ? 'Auto-Update: On' : 'Auto-Update: Paused'}
              </button>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                title="Refresh Rates"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Coins className="w-3.5 h-3.5" />
            <span>Unified African Enterprise Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            One Platform.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0866FF] to-sky-400 dark:to-[#B7F000]">
              Pan-African Multi-Currency Engine.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Eliminate cross-border friction. Run invoicing, retail POS, ledger accounting, and treasury settlements seamlessly across 16 African & global currencies with live exchange rates.
          </p>

          {/* Dual-Mode Selector Tabs */}
          <div className="inline-flex p-1.5 mt-8 rounded-2xl bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/60 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'converter'
                  ? 'bg-white dark:bg-[#0E172A] text-slate-950 dark:text-white shadow-md ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />
              <span>Real-Time Currency Converter</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#B7F000] text-slate-950">
                LIVE
              </span>
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'modules'
                  ? 'bg-white dark:bg-[#0E172A] text-slate-950 dark:text-white shadow-md ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />
              <span>Interactive Modules Map</span>
              <span className="text-[10px] font-semibold text-slate-400">18 Hubs</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE REAL-TIME CURRENCY CONVERSION & TREASURY TOOL */}
        {/* ========================================================================= */}
        {activeTab === 'converter' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Main Interactive Conversion Workstation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column (7 cols): The Interactive Conversion Input Console */}
              <div className="lg:col-span-7 bg-white dark:bg-[#0E172A] p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
                {/* Console Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0866FF] dark:text-blue-400">
                      Cross-Border Treasury Engine
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Live Multi-Currency Calculator
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Synced {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <button
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Update Live Rates"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Amount Input with Quick Denomination Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Enter Transaction Amount ({fromConfig.code})
                    </label>
                    <span className="text-xs font-mono text-slate-400">
                      Format: {fromConfig.symbol}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-400 font-mono">
                        {fromConfig.symbol}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={amount || ''}
                      onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="Enter amount..."
                      className="w-full pl-14 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#131D31] border border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white text-xl sm:text-2xl font-black font-mono focus:outline-none focus:ring-2 focus:ring-[#0866FF] transition-all"
                    />
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="flex items-center gap-2 pt-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                      Quick:
                    </span>
                    {amountPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setAmount(preset.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          amount === preset.value
                            ? 'bg-[#0866FF] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* From / To Currency Selectors with Swap Button */}
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center pt-2">
                  {/* From Currency (5 cols) */}
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>From Currency</span>
                      <span className="text-[10px] text-slate-400 font-normal">{fromConfig.region}</span>
                    </label>
                    <div className="relative">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                        className="w-full appearance-none px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#131D31] border border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] transition-all pr-8"
                      >
                        {AFRICAN_CURRENCIES_LIST.map((code) => {
                          const c = CURRENCIES[code];
                          if (!c) return null;
                          return (
                            <option key={code} value={code}>
                              {c.flag} {c.code} — {c.name} ({c.symbol})
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Swap Button (1 col) */}
                  <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
                    <button
                      type="button"
                      onClick={handleSwapCurrencies}
                      className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[#0866FF] dark:text-[#B7F000] hover:bg-[#0866FF] hover:text-white dark:hover:bg-[#0866FF] dark:hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:rotate-180"
                      title="Swap From and To currencies"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* To Currency (5 cols) */}
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>To Currency</span>
                      <span className="text-[10px] text-slate-400 font-normal">{toConfig.region}</span>
                    </label>
                    <div className="relative">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                        className="w-full appearance-none px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-[#131D31] border border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] transition-all pr-8"
                      >
                        {AFRICAN_CURRENCIES_LIST.map((code) => {
                          const c = CURRENCIES[code];
                          if (!c) return null;
                          return (
                            <option key={code} value={code}>
                              {c.flag} {c.code} — {c.name} ({c.symbol})
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular African Currency Quick Chips */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Toggle African Target Currency:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { code: 'NGN', label: '🇳🇬 Naira' },
                      { code: 'KES', label: '🇰🇪 Shilling' },
                      { code: 'ZAR', label: '🇿🇦 Rand' },
                      { code: 'GHS', label: '🇬🇭 Cedi' },
                      { code: 'XAF', label: '🇨🇲 CFA Franc' },
                      { code: 'EGP', label: '🇪🇬 Pound' },
                      { code: 'MAD', label: '🇲🇦 Dirham' },
                      { code: 'UGX', label: '🇺🇬 Shilling' },
                      { code: 'TZS', label: '🇹🇿 Shilling' },
                      { code: 'RWF', label: '🇷🇼 Franc' },
                      { code: 'ZMW', label: '🇿🇲 Kwacha' },
                      { code: 'ZIP', label: '🇿🇼 ZiG' },
                    ].map((item) => {
                      const isSelected = toCurrency === item.code;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setToCurrency(item.code as CurrencyCode)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#0866FF] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time Exchange Rate Banner */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Live Indicative Exchange Rate:
                    </div>
                    <div className="text-base sm:text-lg font-black font-mono text-[#0866FF] dark:text-blue-300 flex items-center gap-2">
                      <span>
                        1 {fromConfig.code} = {formatNumberWithDecimals(effectiveRate, 4)} {toConfig.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Inverse: 1 {toConfig.code} = {formatNumberWithDecimals(inverseRate, 4)} {fromConfig.code}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      PAPSS Compatible
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Live Result Card & Treasury Insights */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0A1E4A] to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col justify-between space-y-6">
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7F000] bg-slate-800/90 px-3 py-1 rounded-full">
                      Real-Time Conversion Output
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Interbank Mock Rate
                    </span>
                  </div>

                  {/* Large Output Value */}
                  <div className="mt-6 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Target Settlement Amount:
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono text-[#B7F000] tracking-tight break-words">
                      {toConfig.symbol} {formatNumberWithDecimals(convertedTotal, toConfig.decimals)}
                    </div>
                    <div className="text-xs text-slate-300 font-medium pt-1">
                      {toConfig.name} ({toConfig.region})
                    </div>
                  </div>

                  {/* Summary Breakdown Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <div className="text-slate-400 text-[11px]">Original Amount:</div>
                      <div className="font-bold text-white font-mono mt-0.5 truncate">
                        {fromConfig.symbol} {formatNumberWithDecimals(amount, 0)}
                      </div>
                      <div className="text-[10px] text-slate-400">{fromConfig.code}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <div className="text-slate-400 text-[11px]">Settlement Speed:</div>
                      <div className="font-bold text-[#B7F000] font-mono mt-0.5">
                        &lt; 10 seconds
                      </div>
                      <div className="text-[10px] text-slate-400">Direct Ledger Sync</div>
                    </div>
                  </div>

                  {/* Cross-border Savings Calculator */}
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Estimated African Commercial Bank Spread Saved:</span>
                    </div>
                    <div className="text-sm font-black font-mono text-[#B7F000]">
                      ~{toConfig.symbol} {formatNumberWithDecimals(estimatedSavings, toConfig.decimals)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      MsmeBooks multi-currency journal eliminates intermediary correspondent banking markups.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-3 pt-2">
                  {/* Button to sync target currency globally */}
                  <button
                    type="button"
                    onClick={() => setCurrency(toCurrency)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Set {toCurrency} as Entire App Currency</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F000]" />
                  </button>

                  <button
                    onClick={onOpenStartFree}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <span>Issue {toCurrency} Invoices Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* African Trade Corridors Quick Select Cards */}
            <div className="bg-white dark:bg-[#0E172A] p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />
                    <span>Popular African Cross-Border Trade Corridors</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any commercial corridor to instantly configure the live conversion rate and settlement routes
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 shrink-0">
                  8 Preset Routes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TRADE_CORRIDORS.map((corridor) => {
                  const isCurrent =
                    fromCurrency === corridor.from && toCurrency === corridor.to;
                  return (
                    <button
                      key={corridor.id}
                      type="button"
                      onClick={() => handleSelectCorridor(corridor)}
                      className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#0866FF] shadow-sm ring-2 ring-[#0866FF]/20'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black font-display text-slate-900 dark:text-white">
                            {corridor.route}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                            {corridor.from} ⇄ {corridor.to}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          {corridor.name}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {corridor.highlight}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">Sample:</span>
                        <span className="font-bold font-mono text-[#0866FF] dark:text-[#B7F000]">
                          {CURRENCIES[corridor.from]?.symbol}{' '}
                          {formatNumberWithDecimals(corridor.defaultAmount, 0)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-Currency Invoicing & GL Sync Teaser Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white border border-blue-800/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-800/50 text-[#B7F000] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automated General Ledger Foreign Exchange Gain/Loss</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black font-display">
                  No More Manual Currency Spreadsheets
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  When you invoice in foreign currencies (e.g. KES or USD) and get paid in your home currency (e.g. NGN or GHS), MsmeBooks automatically calculates and posts the realized FX gain or loss directly into your balance sheet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={onOpenStartFree}
                  className="px-5 py-3 rounded-xl bg-[#B7F000] hover:bg-[#a5d800] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  Start Free Multi-Currency Trial
                </button>
                {onOpenBookDemo && (
                  <button
                    onClick={onOpenBookDemo}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
                  >
                    Schedule Treasury Walkthrough
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERACTIVE 17-MODULE ECOSYSTEM MAP & INSPECTOR */}
        {/* ========================================================================= */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            {/* Left / Center Grid of Ecosystem Nodes */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0E172A] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl relative">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Interactive Ecosystem Map
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click any module to inspect how it syncs with the central engine
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0866FF]" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Core Ledger</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B7F000] ml-2" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Live Feed</span>
                </div>
              </div>

              {/* Grid of the Modules */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {ECOSYSTEM_MODULES.map((mod) => {
                  const Icon = iconMap[mod.icon] || Calculator;
                  const isSelected = selectedModule.id === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModule(mod)}
                      className={`group p-3 rounded-xl text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0866FF] text-white shadow-lg shadow-blue-500/25 ring-2 ring-[#B7F000]'
                          : 'bg-slate-50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md border border-slate-200/80 dark:border-slate-750 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#B7F000] animate-ping" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold leading-snug ${
                            isSelected
                              ? 'text-white'
                              : 'text-slate-900 dark:text-slate-100 group-hover:text-[#0866FF] dark:group-hover:text-[#B7F000]'
                          }`}
                        >
                          {mod.name}
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 line-clamp-1 ${
                            isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {mod.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Connecting Sync Status */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Synchronized via 256-bit encrypted ledger pipe</span>
                </div>
                <button
                  onClick={() => setActiveTab('converter')}
                  className="font-mono text-[#0866FF] dark:text-[#B7F000] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Switch to Multi-Currency Converter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Selected Module Deep Dive Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-[#0A1E4A] to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7F000] bg-slate-800/80 px-2.5 py-1 rounded-full">
                  Module Inspector
                </span>
                <span className="text-xs text-slate-400">African Cloud Sync</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white font-display flex items-center gap-2">
                  <span>{selectedModule.name}</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedModule.desc}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  How It Integrates Instantly:
                </span>
                <div className="space-y-2 text-xs text-slate-200">
                  {selectedModule.id === 'fixed-assets' ? (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Automates monthly straight-line &amp; reducing-balance depreciation journals</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Tracks asset tagging, barcode serials, branch allocations &amp; custodians</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Auto-updates Balance Sheet Book Value and Capital Allowance tax schedules</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Logs asset disposals, salvage realizations, and capital gains/losses seamlessly</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Updates the General Ledger without manual journal entries</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Cross-checks multi-currency inventory & tax rates</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Feeds the AI Assistant for natural language treasury alerts</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#B7F000] shrink-0 mt-0.5" />
                        <span>Exports tax-compliant data for local statutory authorities</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={onOpenStartFree}
                  className="w-full py-3 px-4 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Launch {selectedModule.name} Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('converter')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Coins className="w-3.5 h-3.5 text-[#B7F000]" />
                  <span>Open Currency Converter Tool</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
