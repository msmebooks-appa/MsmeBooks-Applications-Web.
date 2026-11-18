import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useI18n } from '../context/I18nContext';
import { Check, Sparkles, TrendingUp, ShieldCheck, Zap, ArrowRight, DollarSign, Calculator } from 'lucide-react';

export const PricingRevenueShowcase: React.FC = () => {
  const { currencyInfo, formatFromUSD, convertFromUSD } = useCurrency();
  const { t } = useI18n();
  const [monthlyTurnoverUSD, setMonthlyTurnoverUSD] = useState<number>(10000);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Annual discount: 20% off (pay for 10 months)
  const isAnnual = billingCycle === 'annual';
  const growthPriceUSD = isAnnual ? 12 : 15;
  const enterprisePriceUSD = isAnnual ? 39 : 49;
  const hotelPmsPriceUSD = isAnnual ? 16 : 20;

  // Estimated savings calculation: legacy software charges ~4.5% of turnover in fragmented licenses & transaction fees
  const legacyCostUSD = monthlyTurnoverUSD * 0.045;
  const msmeCostUSD = enterprisePriceUSD + 25; // enterprise + gateway integrations
  const estimatedSavingsUSD = Math.max(0, legacyCostUSD - msmeCostUSD);

  return (
    <section className="py-16 bg-[#F5F8FC] dark:bg-[#070D1B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[#1254B5] dark:text-[#B7E522] text-xs font-bold uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            {t('pricing.badge', 'Live Global Currency Pricing & Revenue Impact')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17233D] dark:text-white tracking-tight">
            {t('pricing.title', 'Transparent Pricing in')} <span className="text-[#1254B5] dark:text-[#3B82F6]">{currencyInfo.flag} {currencyInfo.code} ({currencyInfo.symbol})</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('pricing.description', 'All subscription tiers, transaction limits, and operational benchmarks update automatically when you switch your active currency. Zero surprise exchange fees.')}
          </p>

          {/* Billing Switcher (Monthly / Annual) */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-200 dark:bg-[#131E36] border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                !isAnnual
                  ? 'bg-white dark:bg-[#1254B5] text-[#1254B5] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {t('pricing.monthly', 'Monthly Billing')}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isAnnual
                  ? 'bg-[#1254B5] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span>{t('pricing.annual', 'Annual Billing')}</span>
              <span className="text-[10px] bg-[#B7E522] text-[#17233D] px-1.5 py-0.2 rounded-full font-extrabold">
                {t('pricing.save20', 'Save 20%')}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* 1. Free Starter Plan */}
          <div className="bg-white dark:bg-[#131E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Starter Micro
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Forever Free
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#17233D] dark:text-white">
                    {formatFromUSD(0)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ forever</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ideal for single-counter shops and informal micro-traders.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Monthly sales cap up to <strong>{formatFromUSD(2500, { compact: true })}</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Up to 1,000 monthly POS receipts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Single cashier login & device</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Automated Profit & Loss report</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href="#get-started"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Start Free with {currencyInfo.code}
              </a>
            </div>
          </div>

          {/* 2. Growth / POS Pro Plan */}
          <div className="bg-white dark:bg-[#131E36] rounded-2xl border-2 border-[#1254B5] dark:border-[#3B82F6] p-6 flex flex-col justify-between shadow-lg relative ring-2 ring-[#1254B5]/20 dark:ring-blue-500/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B7E522] text-[#17233D] px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1254B5] dark:text-blue-300">
                  Growth & Retail
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#1254B5] dark:text-blue-300">
                  Up to 3 Branches
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#17233D] dark:text-white">
                    {formatFromUSD(growthPriceUSD)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  For growing supermarkets, pharmacies & retail outlets.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0 mt-0.5" />
                  <span>
                    Monthly sales cap up to <strong>{formatFromUSD(50000, { compact: true })}</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0 mt-0.5" />
                  <span>Unlimited cashier shifts & receipts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0 mt-0.5" />
                  <span>Barcode scanners & thermal printers</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0 mt-0.5" />
                  <span>
                    Payment gateway fees capped at <strong>{formatFromUSD(3.5, { customDecimals: 2 })}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href="#get-started"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1254B5] hover:bg-[#0A3D87] shadow-sm transition transform active:scale-95"
              >
                Choose Growth ({currencyInfo.code})
              </a>
            </div>
          </div>

          {/* 3. Multi-Branch Enterprise */}
          <div className="bg-white dark:bg-[#131E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Enterprise
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                  Unlimited Scale
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#17233D] dark:text-white">
                    {formatFromUSD(enterprisePriceUSD)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  For multi-depot wholesalers, chains & holding companies.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Unlimited</strong> monthly transaction turnover
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Multi-warehouse depots & batch/FEFO</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Multi-company consolidated P&L & VAT</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Custom RBAC matrices & REST APIs</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href="#get-started"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1254B5] hover:bg-[#0A3D87] transition shadow-xs"
              >
                Deploy Enterprise
              </a>
            </div>
          </div>

          {/* 4. Hotel PMS Add-on */}
          <div className="bg-white dark:bg-[#131E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Specialized Add-on
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4FCD9] dark:bg-[#253609] text-[#17233D] dark:text-[#B7E522] border border-[#B7E522]">
                  Hotel PMS
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#17233D] dark:text-white">
                    +{formatFromUSD(hotelPmsPriceUSD)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  For hotels, resorts, lodges & serviced apartments.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Room inventory & booking engine</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Guest folios & consolidated checkout</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Restaurant & bar table billing</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Housekeeping status & night audits</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href="#demo"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-[#17233D] bg-[#B7E522] hover:bg-[#a2ce1d] transition shadow-xs"
              >
                Add Hotel PMS
              </a>
            </div>
          </div>
        </div>

        {/* Live Revenue & Turnover Cost Savings Calculator */}
        <div className="mt-12 bg-white dark:bg-[#131E36] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1254B5] dark:text-[#B7E522] uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                Live Revenue & Turnover Calculator ({currencyInfo.code})
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#17233D] dark:text-white">
                Calculate Your Monthly Software & Transaction Savings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Traditional legacy ERPs charge per-transaction fees and fragmented modular add-on costs. Adjust the slider to your approximate monthly revenue turnover in <strong>{currencyInfo.name}</strong> to see how much your business saves with MsmeBooks.
              </p>

              {/* Turnover Slider */}
              <div className="space-y-2 pt-2 max-w-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Monthly Store Turnover:</span>
                  <span className="font-mono text-base font-extrabold text-[#1254B5] dark:text-[#B7E522]">
                    {formatFromUSD(monthlyTurnoverUSD, { compact: false })}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={250000}
                  step={1000}
                  value={monthlyTurnoverUSD}
                  onChange={(e) => setMonthlyTurnoverUSD(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1254B5] dark:accent-[#B7E522]"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Min: {formatFromUSD(1000, { compact: true })}</span>
                  <span>Mid: {formatFromUSD(100000, { compact: true })}</span>
                  <span>Max: {formatFromUSD(250000, { compact: true })}</span>
                </div>
              </div>
            </div>

            {/* Savings Callout Card */}
            <div className="w-full lg:w-80 bg-gradient-to-br from-[#1254B5] to-[#0A3D87] text-white p-6 rounded-2xl shadow-xl flex-shrink-0 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-200">
                <span>Estimated Value</span>
                <span className="text-[10px] bg-[#B7E522] text-[#17233D] px-2 py-0.5 rounded-full font-extrabold">
                  {currencyInfo.code}
                </span>
              </div>

              <div>
                <span className="text-xs text-blue-200">Your Monthly Savings:</span>
                <div className="text-3xl font-extrabold text-[#B7E522] mt-0.5 tracking-tight">
                  {formatFromUSD(estimatedSavingsUSD, { compact: false })}
                </div>
                <span className="text-[11px] text-blue-100 mt-1 block">
                  ≈ {formatFromUSD(estimatedSavingsUSD * 12, { compact: true })} saved annually
                </span>
              </div>

              <div className="pt-3 border-t border-white/15 space-y-1.5 text-xs text-blue-100">
                <div className="flex items-center justify-between">
                  <span>Legacy Disjointed Cost:</span>
                  <span className="line-through text-blue-300 font-mono">
                    {formatFromUSD(legacyCostUSD, { compact: false })}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-white">
                  <span>MsmeBooks All-in-One:</span>
                  <span className="text-[#B7E522] font-mono">
                    {formatFromUSD(msmeCostUSD, { compact: false })}
                  </span>
                </div>
              </div>

              <a
                href="#get-started"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-[#17233D] bg-[#B7E522] hover:bg-[#a2ce1d] transition shadow-xs"
              >
                <span>Start Saving in {currencyInfo.code}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
