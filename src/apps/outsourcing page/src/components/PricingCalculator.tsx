import React, { useState, useEffect, useId } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  Download, 
  ArrowRight, 
  Info, 
  Building2, 
  Users, 
  Receipt, 
  Layers, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ArrowRightLeft,
  DollarSign
} from 'lucide-react';
import { CountryInfo, CurrencyCode, BillingCycle } from '../types';
import { COUNTRIES, INDUSTRIES, EXCHANGE_RATES } from '../data/mockData';
import { formatPrice, convertFromUSD } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { CurrencyTrendMiniChart } from './CurrencyTrendMiniChart';

export const CURRENCY_OPTIONS: { code: CurrencyCode; label: string; symbol: string; flag: string; region: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸', region: 'Global / Int’l' },
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', region: 'West Africa' },
  { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', region: 'East Africa' },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R', flag: '🇿🇦', region: 'Southern Africa' },
  { code: 'GHS', label: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', region: 'West Africa' },
  { code: 'XOF', label: 'CFA Franc (UEMOA)', symbol: 'CFA', flag: '🇨🇮', region: 'West Africa' },
  { code: 'EGP', label: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', region: 'North Africa' },
  { code: 'RWF', label: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼', region: 'East Africa' },
  { code: 'UGX', label: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', region: 'East Africa' },
  { code: 'TZS', label: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', region: 'East Africa' },
  { code: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺', region: 'European Union' },
  { code: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧', region: 'United Kingdom' },
];

interface PricingCalculatorProps {
  selectedCountry: CountryInfo;
  selectedCurrency: CurrencyCode;
  onProceedToCheckoutWithCustomPlan: (config: any) => void;
  onSelectCurrency?: (currency: CurrencyCode) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  selectedCountry,
  selectedCurrency,
  onProceedToCheckoutWithCustomPlan,
  onSelectCurrency,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Real-time active currency state (can be overridden locally or synchronized)
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(selectedCurrency);

  // Synchronize when parent prop changes
  useEffect(() => {
    setActiveCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setActiveCurrency(newCurrency);
    if (onSelectCurrency) {
      onSelectCurrency(newCurrency);
    }
    const rate = EXCHANGE_RATES[newCurrency] || 1;
    const currMeta = CURRENCY_OPTIONS.find(c => c.code === newCurrency);
    toast.locale('country', `${currMeta?.flag || ''} ${newCurrency} Exchange Rate Active`, `1 USD = ${rate.toLocaleString()} ${newCurrency}`);
  };
  // Inputs state
  const [employeeCount, setEmployeeCount] = useState<number>(12);
  const [txVolume, setTxVolume] = useState<number>(450);
  const [branchCount, setBranchCount] = useState<number>(1);
  const [industryId, setIndustryId] = useState<string>('retail');
  const [serviceBookkeeping, setServiceBookkeeping] = useState<boolean>(true);
  const [serviceAccounting, setServiceAccounting] = useState<boolean>(true);
  const [servicePayroll, setServicePayroll] = useState<boolean>(true);
  const [serviceHr, setServiceHr] = useState<boolean>(false);
  const [serviceTax, setServiceTax] = useState<boolean>(true);
  const [serviceCfo, setServiceCfo] = useState<boolean>(false);
  const [reportingFreq, setReportingFreq] = useState<'monthly' | 'biweekly' | 'boardpack'>('monthly');
  const [slaTier, setSlaTier] = useState<'standard' | 'priority' | 'executive'>('standard');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [showSavedNotice, setShowSavedNotice] = useState<boolean>(false);
  const [showTopTrendChart, setShowTopTrendChart] = useState<boolean>(false);

  // Accessible unique IDs for form controls
  const empSliderId = useId();
  const txSliderId = useId();
  const branchSelectId = useId();
  const industrySelectId = useId();
  const reportingSelectId = useId();
  const slaSelectId = useId();

  // Price Calculation Logic
  // Base cost depends on core services selected
  let baseServicesUSD = 0;
  if (serviceBookkeeping) baseServicesUSD += 110;
  if (serviceAccounting) baseServicesUSD += 150;
  if (servicePayroll) baseServicesUSD += 90;
  if (serviceHr) baseServicesUSD += 80;
  if (serviceTax) baseServicesUSD += 70;
  if (serviceCfo) baseServicesUSD += 190;

  if (baseServicesUSD === 0) baseServicesUSD = 110; // minimum package base

  // Volume scale
  const volumeCostUSD = Math.max(0, Math.floor((txVolume - 200) / 100) * 15);
  // Employee headcount scale for payroll & HR
  const employeeCostUSD = Math.max(0, (employeeCount - 5) * 4);
  // Branches scale
  const branchCostUSD = Math.max(0, (branchCount - 1) * 35);
  // Reporting frequency modifier
  const reportingFreqCostUSD = reportingFreq === 'boardpack' ? 95 : reportingFreq === 'biweekly' ? 45 : 0;
  // SLA modifier
  const slaCostUSD = slaTier === 'executive' ? 120 : slaTier === 'priority' ? 50 : 0;

  const rawMonthlySubtotalUSD = baseServicesUSD + volumeCostUSD + employeeCostUSD + branchCostUSD + reportingFreqCostUSD + slaCostUSD;

  // Discount
  const discountMultiplier = billingCycle === 'annual' ? 0.20 : billingCycle === 'bi-yearly' ? 0.12 : billingCycle === 'quarterly' ? 0.05 : 0;
  const discountedMonthlyUSD = rawMonthlySubtotalUSD * (1 - discountMultiplier);

  // Billing period total
  const periodMonths = billingCycle === 'annual' ? 12 : billingCycle === 'bi-yearly' ? 6 : billingCycle === 'quarterly' ? 3 : 1;
  const totalPayablePeriodUSD = discountedMonthlyUSD * periodMonths;
  const setupFeeUSD = 0; // Standard onboarding waived
  const taxRate = 0.075; // e.g. 7.5% standard VAT
  const vatAmountUSD = totalPayablePeriodUSD * taxRate;
  const grandTotalUSD = totalPayablePeriodUSD + vatAmountUSD;

  const activeCurrencyMeta = CURRENCY_OPTIONS.find(c => c.code === activeCurrency) || {
    code: activeCurrency,
    label: activeCurrency,
    symbol: activeCurrency,
    flag: selectedCountry.flag,
    region: selectedCountry.region
  };
  const activeRate = EXCHANGE_RATES[activeCurrency] || 1;
  const reverseRate = activeRate > 0 ? (1 / activeRate) : 1;
  const [lastRateSync, setLastRateSync] = useState<string>('Just now (real-time)');

  const handleManualSync = () => {
    setLastRateSync('Verified seconds ago');
    toast.success(`Exchange rates refreshed. 1 USD = ${activeRate.toLocaleString()} ${activeCurrency}`, 'Live Rates Synchronized');
  };

  const handleSaveQuote = () => {
    setShowSavedNotice(true);
    toast.success('Your tailored outsourcing estimate has been saved as a PDF.', 'Formal Estimate Generated');
    setTimeout(() => setShowSavedNotice(false), 4000);
  };

  const handleCheckout = () => {
    onProceedToCheckoutWithCustomPlan({
      title: 'Custom Outsourced Business Architecture',
      employeeCount,
      txVolume,
      branchCount,
      industryId,
      billingCycle,
      currency: activeCurrency,
      monthlyUSD: Math.round(discountedMonthlyUSD),
      totalPayableUSD: Math.round(grandTotalUSD),
      selectedServices: [
        serviceBookkeeping && 'Bookkeeping',
        serviceAccounting && 'Accounting & Reporting',
        servicePayroll && 'Payroll Outsourcing',
        serviceHr && 'HR Outsourcing',
        serviceTax && 'Tax & Compliance',
        serviceCfo && 'Virtual CFO Advisory',
      ].filter(Boolean),
    });
  };

  return (
    <section id="calculator" className="py-20 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
            <Calculator className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            {t.calculator.pill}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            {t.calculator.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t.calculator.subtitle} ({activeCurrencyMeta.flag} {activeCurrency}).
          </p>
        </div>

        {/* Real-Time Currency Conversion & Exchange Rate Engine Widget */}
        <div className="mb-10 bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-32 bg-lime-400/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            {/* Widget Title & Live Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-500/20 to-blue-500/20 border border-lime-500/30 flex items-center justify-center text-lime-500 shrink-0">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold font-grotesk text-slate-900 dark:text-white flex items-center gap-1.5">
                    Real-Time Currency Conversion & Interbank Rates
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE RATES
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Toggle currency instantly to recalculate monthly retainers, SLA add-ons, and VAT in real-time.
                </p>
              </div>
            </div>

            {/* Live Exchange Rate Status Ticker */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-500 dark:text-slate-400">Rate:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">1 USD =</span>
                <span className="font-black text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-950/80 px-1.5 py-0.5 rounded border border-lime-300 dark:border-lime-700/50">
                  {activeRate.toLocaleString()} {activeCurrency}
                </span>
              </div>
              {activeCurrency !== 'USD' && (
                <div className="text-[11px] text-slate-400 border-l border-slate-300 dark:border-slate-700 pl-2.5 hidden sm:inline">
                  (1 {activeCurrency} ≈ ${(reverseRate >= 0.01 ? reverseRate.toFixed(2) : reverseRate.toFixed(4))} USD)
                </div>
              )}
              <button
                type="button"
                onClick={handleManualSync}
                title="Refresh rates"
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                aria-label="Synchronize live rates"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick-Toggle Currencies Bar & Dropdown Select */}
          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Quick Pill Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                Quick Toggle:
              </span>
              {[
                { code: 'USD' as CurrencyCode, flag: '🇺🇸', label: 'USD' },
                { code: 'NGN' as CurrencyCode, flag: '🇳🇬', label: 'NGN' },
                { code: 'KES' as CurrencyCode, flag: '🇰🇪', label: 'KES' },
                { code: 'ZAR' as CurrencyCode, flag: '🇿🇦', label: 'ZAR' },
                { code: 'GHS' as CurrencyCode, flag: '🇬🇭', label: 'GHS' },
                { code: 'XOF' as CurrencyCode, flag: '🇨🇮', label: 'XOF' },
                { code: 'EGP' as CurrencyCode, flag: '🇪🇬', label: 'EGP' },
                { code: 'EUR' as CurrencyCode, flag: '🇪🇺', label: 'EUR' },
                { code: 'GBP' as CurrencyCode, flag: '🇬🇧', label: 'GBP' },
              ].map((curr) => {
                const isActive = activeCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/25 ring-2 ring-lime-400 scale-[1.03]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <span>{curr.flag}</span>
                    <span>{curr.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown for All 12 Available Currencies */}
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="currency-select-dropdown" className="text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                All Currencies:
              </label>
              <select
                id="currency-select-dropdown"
                value={activeCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-lime-400 outline-none cursor-pointer"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Dynamic Conversion Preview Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">Active Conversion:</span>
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-300">
                USD Base: ${Math.round(discountedMonthlyUSD)}/mo
              </span>
              <span>➔</span>
              <span className="font-mono font-extrabold text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-950/60 px-2 py-0.5 rounded border border-lime-300 dark:border-lime-700/60">
                {formatPrice(Math.round(discountedMonthlyUSD), activeCurrency)}/mo
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                ({periodMonths} mo total: {formatPrice(Math.round(grandTotalUSD), activeCurrency)})
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>{lastRateSync}</span>
                <span>• Zero FX Spread</span>
              </div>

              <button
                type="button"
                onClick={() => setShowTopTrendChart(!showTopTrendChart)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  showTopTrendChart
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                }`}
                title="Toggle 30-Day D3.js FX Trend Analysis Chart"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{showTopTrendChart ? 'Close D3 Trend' : '30D D3.js FX Trend'}</span>
              </button>
            </div>
          </div>

          {/* Expandable D3 Currency Trend Analysis Panel */}
          {showTopTrendChart && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
              <CurrencyTrendMiniChart 
                currency={activeCurrency} 
                currencySymbol={activeCurrencyMeta.symbol} 
              />
            </div>
          )}
        </div>

        {/* Two-Column Interactive Tool */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Configuration Inputs */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            
            {/* Top selectors: Industry & Branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={industrySelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t.calculator.industryLabel}
                </label>
                <select
                  id={industrySelectId}
                  value={industryId}
                  onChange={(e) => setIndustryId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={branchSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t.calculator.branchesLabel}
                </label>
                <select
                  id={branchSelectId}
                  value={branchCount}
                  onChange={(e) => setBranchCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value={1}>1 Primary Office / Store</option>
                  <option value={2}>2 Branches</option>
                  <option value={3}>3 - 5 Branches</option>
                  <option value={6}>6 - 10 Branches</option>
                  <option value={11}>10+ Multi-Entity Group</option>
                </select>
              </div>
            </div>

            {/* Slider 1: Transaction Volume */}
            <div className="space-y-2 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
              <div className="flex items-center justify-between text-xs font-bold">
                <label htmlFor={txSliderId} className="text-slate-300">
                  {t.calculator.transactionsLabel}
                </label>
                <span className="text-lime-400 text-sm font-extrabold font-grotesk">
                  {txVolume.toLocaleString()} transactions/mo
                </span>
              </div>
              <input
                id={txSliderId}
                type="range"
                min="100"
                max="5000"
                step="50"
                value={txVolume}
                onChange={(e) => setTxVolume(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>100 (Micro)</span>
                <span>1,500 (Medium SME)</span>
                <span>5,000+ (High Volume)</span>
              </div>
            </div>

            {/* Slider 2: Employee Headcount */}
            <div className="space-y-2 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
              <div className="flex items-center justify-between text-xs font-bold">
                <label htmlFor={empSliderId} className="text-slate-300">
                  {t.calculator.employeesLabel}
                </label>
                <span className="text-blue-400 text-sm font-extrabold font-grotesk">
                  {employeeCount} staff members
                </span>
              </div>
              <input
                id={empSliderId}
                type="range"
                min="1"
                max="150"
                step="1"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 Staff</span>
                <span>50 Staff</span>
                <span>150+ Staff</span>
              </div>
            </div>

            {/* Checkbox Grid: Core Outsourcing Modules */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {t.calculator.modulesTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'Bookkeeping & Reconciliations', checked: serviceBookkeeping, set: setServiceBookkeeping, desc: 'Ledger, bank & cash feeds' },
                  { label: 'Accounting & Management Accounts', checked: serviceAccounting, set: setServiceAccounting, desc: 'Monthly P&L, balance sheet' },
                  { label: 'Payroll Processing & Payslips', checked: servicePayroll, set: setServicePayroll, desc: 'Gross-to-net & deductions' },
                  { label: 'HR Administration & Policies', checked: serviceHr, set: setServiceHr, desc: 'Onboarding, leave, records' },
                  { label: 'Tax & Regulatory Compliance', checked: serviceTax, set: setServiceTax, desc: 'VAT, PAYE, WHT returns' },
                  { label: 'Fractional / Virtual CFO Advisory', checked: serviceCfo, set: setServiceCfo, desc: 'Strategic cash flow modeling' },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      item.checked
                        ? 'bg-blue-950/40 border-lime-400 text-white'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.set(e.target.checked)}
                      className="mt-1 accent-lime-400 rounded cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reporting Frequency & SLA Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor={reportingSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Reporting Frequency
                </label>
                <select
                  id={reportingSelectId}
                  value={reportingFreq}
                  onChange={(e) => setReportingFreq(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                >
                  <option value="monthly">Monthly Pack (Standard)</option>
                  <option value="biweekly">Bi-Weekly Updates (+ $45)</option>
                  <option value="boardpack">Executive Board Pack & Live KPI (+ $95)</option>
                </select>
              </div>

              <div>
                <label htmlFor={slaSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Service SLA Speed
                </label>
                <select
                  id={slaSelectId}
                  value={slaTier}
                  onChange={(e) => setSlaTier(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                >
                  <option value="standard">Standard SLA (48-Hour Turnaround)</option>
                  <option value="priority">Priority SLA (24-Hour Turnaround)</option>
                  <option value="executive">Executive Pod (Same-Day Response)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Column: Live Calculated Estimate & Breakdown */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border-2 border-lime-400 shadow-2xl space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-lime-400">
                  Custom Estimate ({activeCurrency})
                </span>
                <h3 className="text-xl font-bold font-grotesk text-white">
                  {t.calculator.summaryTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeCurrencyMeta.flag}</span>
                <span className="text-xs font-mono font-bold bg-slate-800 text-lime-400 px-2 py-0.5 rounded border border-slate-700">
                  {activeCurrency}
                </span>
              </div>
            </div>

            {/* Billing Cycle Pill inside calculator */}
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                Billing Cadence
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-1.5 px-2 rounded-lg transition cursor-pointer text-center ${
                    billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('quarterly')}
                  className={`py-1.5 px-2 rounded-lg transition cursor-pointer text-center ${
                    billingCycle === 'quarterly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quarterly (-5%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('bi-yearly')}
                  className={`py-1.5 px-2 rounded-lg transition cursor-pointer text-center ${
                    billingCycle === 'bi-yearly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bi-Yearly (-12%)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-1.5 px-2 rounded-lg transition cursor-pointer text-center ${
                    billingCycle === 'annual' ? 'bg-lime-400 text-slate-950 font-extrabold shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annual (-20%)
                </button>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-300 divide-y divide-slate-800/80">
              <div className="flex justify-between pt-1">
                <span>Core Functional Retainer:</span>
                <span className="font-semibold text-white">{formatPrice(baseServicesUSD, activeCurrency)}/mo</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Transaction Volume Scale ({txVolume} tx):</span>
                <span className="font-semibold text-white">{formatPrice(volumeCostUSD, activeCurrency)}/mo</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Staffing & Payroll Scale ({employeeCount} staff):</span>
                <span className="font-semibold text-white">{formatPrice(employeeCostUSD, activeCurrency)}/mo</span>
              </div>
              {branchCostUSD > 0 && (
                <div className="flex justify-between pt-2">
                  <span>Multi-Branch Surcharge ({branchCount} units):</span>
                  <span className="font-semibold text-white">{formatPrice(branchCostUSD, activeCurrency)}/mo</span>
                </div>
              )}
              {reportingFreqCostUSD > 0 && (
                <div className="flex justify-between pt-2">
                  <span>Executive Reporting Pack:</span>
                  <span className="font-semibold text-white">{formatPrice(reportingFreqCostUSD, activeCurrency)}/mo</span>
                </div>
              )}
              {slaCostUSD > 0 && (
                <div className="flex justify-between pt-2">
                  <span>Fast-Track SLA Tier:</span>
                  <span className="font-semibold text-white">{formatPrice(slaCostUSD, activeCurrency)}/mo</span>
                </div>
              )}
              {discountMultiplier > 0 && (
                <div className="flex justify-between pt-2 text-lime-400 font-bold">
                  <span>Long-Term Billing Discount:</span>
                  <span>- {Math.round(discountMultiplier * 100)}%</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-slate-400">
                <span>Onboarding & Setup Fee:</span>
                <span className="text-emerald-400 font-bold">FREE ($0)</span>
              </div>
              <div className="flex justify-between pt-2 text-slate-400">
                <span>Applicable Statutory VAT (7.5%):</span>
                <span>{formatPrice(Math.round(vatAmountUSD), activeCurrency)}</span>
              </div>
            </div>

            {/* D3-based 30-Day Historical Currency Trend & Timing Chart */}
            <CurrencyTrendMiniChart 
              currency={activeCurrency} 
              currencySymbol={activeCurrencyMeta.symbol} 
            />

            {/* Grand Total Display */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
              <div className="text-[11px] uppercase font-bold text-slate-400">
                {t.calculator.effectiveMonthly}
              </div>
              <div className="text-3xl font-extrabold text-lime-400 font-grotesk tracking-tight">
                {formatPrice(Math.round(discountedMonthlyUSD), activeCurrency)}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </div>
              <div className="text-xs text-slate-400 pt-1">
                Total payable for this {billingCycle} period (incl. VAT):{' '}
                <span className="font-bold text-white">{formatPrice(Math.round(grandTotalUSD), activeCurrency)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-lime-400/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t.calculator.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveQuote}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.calculator.savePdfBtn}</span>
              </button>
            </div>

            {showSavedNotice && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{t.calculator.savedNotice}</span>
              </div>
            )}

            <div className="text-[11px] text-slate-500 leading-tight">
              {t.calculator.disclaimer}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
