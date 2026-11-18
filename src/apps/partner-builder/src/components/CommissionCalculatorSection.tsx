import React, { useState } from 'react';
import { PARTNER_TIERS } from '../data/partnersData';
import { PartnerTierId } from '../types';
import { Calculator, ArrowRight, DollarSign, TrendingUp, Info, Coins } from 'lucide-react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface CommissionCalculatorSectionProps {
  onOpenApplyWithTier: (tier: PartnerTierId) => void;
}

export const CommissionCalculatorSection: React.FC<CommissionCalculatorSectionProps> = ({
  onOpenApplyWithTier
}) => {
  const { t } = useLanguage();
  const { currency, setCurrency, formatMoney, currentCurrency, currencies } = useCurrency();
  const [selectedTier, setSelectedTier] = useState<PartnerTierId>('gold');
  const [clientsCount, setClientsCount] = useState<number>(25);
  const [avgSubscriptionUsd, setAvgSubscriptionUsd] = useState<number>(45);
  const [retentionMonths, setRetentionMonths] = useState<number>(24);

  const featuredCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'INR', 'NGN', 'KES', 'GHS', 'ZAR', 'XOF'];

  const commissionRate = PARTNER_TIERS[selectedTier].commissionRate / 100;
  const totalMonthlyCustomerSpendUsd = clientsCount * avgSubscriptionUsd;
  const monthlyCommissionUsd = totalMonthlyCustomerSpendUsd * commissionRate;
  const annualCommissionUsd = monthlyCommissionUsd * 12;
  const lifetimeCommissionUsd = monthlyCommissionUsd * retentionMonths;

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-[#F0F6FF]/60 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0A3981] dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            {t('calc.tag', 'Financial Modeling & Projections')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            {t('calc.title', 'Partner Commission Calculator')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal mb-4">
            {t('calc.desc', 'Simulate your monthly and annual recurring revenues based on your preferred membership level, average client subscription tier, and client retention longevity.')}
          </p>

          {/* Live Sync Banner with Header Currency Toggle */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-[#8CE600] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#8CE600]"></span>
            </span>
            <span className="font-semibold">
              Live Synchronized with Header Currency Toggle:
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white bg-white/80 dark:bg-blue-900/80 px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-700/60">
              {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol.trim()})
            </span>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            <span>Select Projection Currency (Active: {currentCurrency.flag} {currentCurrency.name}):</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-1.5 p-1.5 bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800/80 shadow-sm text-xs font-semibold max-w-3xl">
            {featuredCurrencies.map((cCode) => {
              const cObj = currencies.find(c => c.code === cCode);
              if (!cObj) return null;
              const isSelected = currency === cCode;
              return (
                <button
                  key={cCode}
                  onClick={() => setCurrency(cCode)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-blue-900/40'
                  }`}
                >
                  <span>{cObj.flag}</span>
                  <span>{cCode}</span>
                  <span className="text-[10px] opacity-75">({cObj.symbol.trim()})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Calculator Box */}
        <div className="bg-white dark:bg-[#0A2552] rounded-3xl shadow-xl border border-slate-200 dark:border-blue-800/80 overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Sliders and Controls (Left 7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-blue-800/80 space-y-8">
              {/* Tier Selection Radio Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  1. Select Your Partner Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tierKey) => {
                    const isSelected = selectedTier === tierKey;
                    return (
                      <button
                        key={tierKey}
                        onClick={() => setSelectedTier(tierKey)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#0A3981] dark:bg-[#061F4A] text-white border-[#0A3981] dark:border-[#8CE600] shadow-md ring-2 ring-[#8CE600]/30'
                            : 'bg-slate-50 dark:bg-[#061F4A]/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/60 hover:bg-slate-100 dark:hover:bg-[#061F4A]'
                        }`}
                      >
                        <div className="text-xs font-bold capitalize">{tierKey}</div>
                        <div className={`text-base font-black font-mono ${isSelected ? 'text-[#8CE600]' : 'text-[#0A3981] dark:text-sky-300'}`}>
                          {PARTNER_TIERS[tierKey].commissionRate}%
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider 1: Active Referred Clients */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    2. Active Client Subscriptions
                  </label>
                  <span className="text-base font-extrabold text-[#0A3981] dark:text-[#8CE600] font-mono tabular-nums bg-blue-50 dark:bg-[#061F4A] px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                    {clientsCount} businesses
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  value={clientsCount}
                  onChange={(e) => setClientsCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A3981] dark:accent-[#8CE600]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  <span>1 client</span>
                  <span>50 clients</span>
                  <span>150+ enterprise portfolio</span>
                </div>
              </div>

              {/* Slider 2: Average Monthly Subscription Value */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    3. Average Monthly Subscription / Client
                  </label>
                  <span className="text-base font-extrabold text-[#0A3981] dark:text-[#8CE600] font-mono tabular-nums bg-blue-50 dark:bg-[#061F4A] px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                    {formatMoney(avgSubscriptionUsd)} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={avgSubscriptionUsd}
                  onChange={(e) => setAvgSubscriptionUsd(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A3981] dark:accent-[#8CE600]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  <span>{formatMoney(20)} (Starter)</span>
                  <span>{formatMoney(45)} (Growth + POS)</span>
                  <span>{formatMoney(120)} (Multi-Branch ERP)</span>
                </div>
              </div>

              {/* Slider 3: Retention Period */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    4. Average Client Retention Period
                  </label>
                  <span className="text-base font-extrabold text-[#0A3981] dark:text-[#8CE600] font-mono tabular-nums bg-blue-50 dark:bg-[#061F4A] px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                    {retentionMonths} months
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  step="3"
                  value={retentionMonths}
                  onChange={(e) => setRetentionMonths(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A3981] dark:accent-[#8CE600]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  <span>6 months</span>
                  <span>18 months</span>
                  <span>36 months (3 Years)</span>
                </div>
              </div>
            </div>

            {/* Calculations & Results (Right 5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0A3981] via-[#082C66] to-[#061F4A] text-white p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-white/15 text-[#8CE600] text-xs font-bold mb-6">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Estimated Commission Return</span>
                </div>

                <div className="space-y-6">
                  {/* Monthly Recurring Metric */}
                  <div>
                    <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Recurring Monthly Commission
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-[#8CE600] font-mono tabular-nums mt-1">
                      {formatMoney(monthlyCommissionUsd)}
                      <span className="text-xs text-blue-200 font-sans font-normal ml-1">/ month</span>
                    </div>
                    <div className="text-[11px] text-blue-300 mt-0.5">
                      Based on {PARTNER_TIERS[selectedTier].commissionRate}% of {formatMoney(totalMonthlyCustomerSpendUsd)} total client billing.
                    </div>
                  </div>

                  {/* Annual Recurring Metric */}
                  <div className="pt-4 border-t border-white/15">
                    <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Annual Recurring Earnings (12 Months)
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                      {formatMoney(annualCommissionUsd)}
                    </div>
                  </div>

                  {/* Lifetime Retention Value */}
                  <div className="pt-4 border-t border-white/15">
                    <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Estimated Portfolio Lifetime Commission ({retentionMonths} mos)
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-sky-200 font-mono tabular-nums mt-1">
                      {formatMoney(lifetimeCommissionUsd)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15">
                <button
                  onClick={() => onOpenApplyWithTier(selectedTier)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Apply for {PARTNER_TIERS[selectedTier].name}
                  <ArrowRight className="w-4 h-4 text-[#061F4A]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE: Projected Yearly Earnings Growth Chart */}
        <div className="bg-white dark:bg-[#0A2552] rounded-3xl shadow-xl border border-slate-200 dark:border-blue-800/80 p-6 sm:p-8 max-w-5xl mx-auto mt-10 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-blue-900/60">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>Projected Yearly Earnings Model</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800">
                      {PARTNER_TIERS[selectedTier].name} ({PARTNER_TIERS[selectedTier].commissionRate}%)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-blue-100/70 mt-0.5">
                    Simulated compounding growth from Month 1 to Month 12 based on {clientsCount} target client accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Summary Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-900">
                <span className="text-slate-500 dark:text-slate-400">Peak Run-Rate: </span>
                <span className="font-mono font-bold text-[#0A3981] dark:text-[#8CE600]">
                  {formatMoney(monthlyCommissionUsd)} / mo
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-emerald-400">Total Year 1 Potential: </span>
                <span className="font-mono font-black text-emerald-800 dark:text-[#8CE600]">
                  {formatMoney(annualCommissionUsd * 0.72 + clientsCount * 150)}
                </span>
              </div>
            </div>
          </div>

          {/* 12-Month Projection Visual Chart (SVG with interactive hover) */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider mb-3">
              <span>Month-by-Month Recurring Progression (Months 1–12):</span>
              <span className="text-[11px] font-normal text-slate-400 dark:text-slate-400 normal-case">
                Includes software rev share + client onboarding fees
              </span>
            </div>

            {/* Responsive SVG Chart Container */}
            <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] max-h-[280px] bg-slate-50/70 dark:bg-[#061F4A]/70 rounded-2xl p-4 border border-slate-200/80 dark:border-blue-900/60 overflow-hidden select-none">
              <svg viewBox="0 0 760 220" className="w-full h-full">
                <defs>
                  <linearGradient id="calc-bar-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8CE600" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0A3981" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="calc-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A3981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8CE600" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="30" y1="40" x2="740" y2="40" stroke="#94a3b8" strokeDasharray="3 3" opacity="0.25" />
                <line x1="30" y1="90" x2="740" y2="90" stroke="#94a3b8" strokeDasharray="3 3" opacity="0.25" />
                <line x1="30" y1="140" x2="740" y2="140" stroke="#94a3b8" strokeDasharray="3 3" opacity="0.25" />
                <line x1="30" y1="190" x2="740" y2="190" stroke="#94a3b8" opacity="0.4" />

                {/* 12 Month Bars & Progression Line */}
                {Array.from({ length: 12 }, (_, i) => {
                  const monthNum = i + 1;
                  // Gradual onboarding ramp: Month 1 is 15%, reaching 100% by month 8
                  const rampFactor = Math.min(1, 0.15 + (i * 0.85) / 7);
                  const activeClients = Math.max(1, Math.round(clientsCount * rampFactor));
                  const monthlySpend = activeClients * avgSubscriptionUsd;
                  const monthComm = monthlySpend * commissionRate;
                  
                  // Retained onboarding fee for newly added clients in this month
                  const prevClients = i === 0 ? 0 : Math.max(1, Math.round(clientsCount * Math.min(1, 0.15 + ((i - 1) * 0.85) / 7)));
                  const newClients = Math.max(0, activeClients - prevClients);
                  const onboardingFees = newClients * 150;
                  const totalMonthEarnings = monthComm + onboardingFees;

                  const maxPossibleMonth = monthlyCommissionUsd + (clientsCount / 6) * 150;
                  const barHeight = Math.max(12, Math.min(150, (monthComm / (maxPossibleMonth || 1)) * 140));
                  const x = 50 + i * 58;
                  const y = 190 - barHeight;

                  return (
                    <g key={i} className="group cursor-pointer">
                      {/* Background Bar Hover Target */}
                      <rect
                        x={x - 24}
                        y={20}
                        width={48}
                        height={170}
                        fill="transparent"
                        className="hover:fill-blue-500/10 transition-colors"
                      />

                      {/* Main Bar: Recurring Commission */}
                      <rect
                        x={x - 14}
                        y={y}
                        width={28}
                        height={barHeight}
                        rx={5}
                        fill="url(#calc-bar-grad)"
                        className="transition-all duration-200 group-hover:opacity-90"
                      />

                      {/* Bar Value Tooltip on top */}
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        className="text-[9px] font-mono font-bold fill-slate-700 dark:fill-blue-200"
                      >
                        {formatMoney(monthComm).replace(/\.00$/, '')}
                      </text>

                      {/* Month Label */}
                      <text
                        x={x}
                        y={206}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400"
                      >
                        M{monthNum}
                      </text>

                      {/* Active Clients Badge */}
                      <text
                        x={x}
                        y={y + 14}
                        textAnchor="middle"
                        className="text-[8px] font-bold fill-white pointer-events-none opacity-90"
                      >
                        {activeClients}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-blue-900/60 text-xs text-slate-500 dark:text-slate-300">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                  <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#0A3981] to-[#8CE600]" />
                  <span>Monthly Recurring Commission Share ({PARTNER_TIERS[selectedTier].commissionRate}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8CE600]" />
                  <span>Ramped up to {clientsCount} clients</span>
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#0A3981] dark:text-[#8CE600] font-bold">
                100% Retained Client Setup Fees ($150/client) not included in base bars
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="max-w-4xl mx-auto mt-6 flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#0A2552] border border-slate-200 dark:border-blue-800 text-xs text-slate-500 dark:text-slate-300 shadow-sm transition-colors">
          <Info className="w-4 h-4 text-slate-400 dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-700 dark:text-white">Official Disclaimer:</strong> Estimates are illustrative and subject to qualifying subscriptions, payment collection, applicable adjustments, and the MsmeBooks Partner Agreement.
          </p>
        </div>
      </div>
    </section>
  );
};
