import React, { useState, useMemo } from 'react';
import { PartnerLevelType } from '../types/partner';
import { DollarSign, HelpCircle, ArrowRight } from 'lucide-react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface CommissionCalculatorProps {
  onOpenApply: () => void;
}

export const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({ onOpenApply }) => {
  const { currentCurrency, setCurrency, currencies } = useCurrency();
  const { t } = useLanguage();
  const [customerCount, setCustomerCount] = useState<number>(25);
  const [avgFeeUsd, setAvgFeeUsd] = useState<number>(65); // Default $65/mo
  const [selectedTier, setSelectedTier] = useState<PartnerLevelType>('Gold');
  const [retentionMonths, setRetentionMonths] = useState<number>(24);

  const activeCurrency = currentCurrency;

  const tierRates: Record<PartnerLevelType, number> = {
    Bronze: 15,
    Silver: 20,
    Gold: 30,
    Platinum: 40
  };

  const commissionRate = tierRates[selectedTier];

  const calculations = useMemo(() => {
    // Total monthly customer billing in USD
    const monthlyGrossRevenueUsd = customerCount * avgFeeUsd;
    // Estimated net (after 4% standard processing / statutory leeway)
    const monthlyNetRevenueUsd = monthlyGrossRevenueUsd * 0.96;
    // Monthly commission
    const monthlyCommissionUsd = monthlyNetRevenueUsd * (commissionRate / 100);
    // Annualized
    const annualCommissionUsd = monthlyCommissionUsd * 12;
    // Retention duration projection (assuming 92% annual retention)
    const cumulativeUsd = monthlyCommissionUsd * retentionMonths * 0.95;

    // Convert to selected currency
    const rate = activeCurrency.rate;

    return {
      monthlyGross: monthlyGrossRevenueUsd * rate,
      monthlyCommission: monthlyCommissionUsd * rate,
      annualCommission: annualCommissionUsd * rate,
      cumulativeProjection: cumulativeUsd * rate
    };
  }, [customerCount, avgFeeUsd, commissionRate, retentionMonths, activeCurrency]);

  const formatMoney = (val: number) => {
    return `${activeCurrency.symbol}${Math.round(val).toLocaleString()}`;
  };

  return (
    <section id="calculator" className="py-20 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-blue-400">
              <span>Section 03</span>
              <span aria-hidden="true">·</span>
              <span>{t('calc.badge', 'Interactive Financial Modeler')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('calc.title', 'Interactive Commission Calculator')}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'calc.subtitle',
                'Model your recurring revenue potential by adjusting customer subscriptions, average client plan values, and partner tiers.'
              )}
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex-wrap">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-2">Currency:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {currencies.slice(0, 8).map(curr => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrency(curr.code)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    currentCurrency.code === curr.code
                      ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {curr.code}
                </button>
              ))}
              <select
                value={currentCurrency.code}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                aria-label="More currencies"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol.trim()}) - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Calculator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-sm">
            
            {/* Control 1: Customer Subscriptions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="customer-count-input" className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Customer Subscriptions
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Number of referred paying businesses</p>
                </div>
                <span className="text-xl font-extrabold text-[#0046B8] dark:text-blue-400 tabular-nums font-mono bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-900/60">
                  {customerCount} Clients
                </span>
              </div>
              <input
                id="customer-count-input"
                type="range"
                min="1"
                max="150"
                step="1"
                value={customerCount}
                onChange={e => setCustomerCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0046B8] dark:accent-[#84CC16]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                <span>1 Client</span>
                <span>50 Clients</span>
                <span>100 Clients</span>
                <span>150+ Clients</span>
              </div>
            </div>

            {/* Control 2: Average Monthly Client Plan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="avg-plan-input" className="text-sm font-bold text-slate-900 dark:text-white">
                    Average Client Subscription Plan
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Core accounting, POS terminals, and multi-branch modules</p>
                </div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  {formatMoney(avgFeeUsd * activeCurrency.rate)}/mo
                </span>
              </div>
              <input
                id="avg-plan-input"
                type="range"
                min="20"
                max="250"
                step="5"
                value={avgFeeUsd}
                onChange={e => setAvgFeeUsd(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0046B8] dark:accent-[#84CC16]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Starter ({formatMoney(20 * activeCurrency.rate)})</span>
                <span>Growth ({formatMoney(75 * activeCurrency.rate)})</span>
                <span>Multi-Branch ({formatMoney(150 * activeCurrency.rate)})</span>
                <span>Enterprise ({formatMoney(250 * activeCurrency.rate)})</span>
              </div>
            </div>

            {/* Control 3: Partner Tier Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white block">
                Partner Level & Commission Percentage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Bronze', 'Silver', 'Gold', 'Platinum'] as PartnerLevelType[]).map(tier => {
                  const isSelected = selectedTier === tier;
                  const rate = tierRates[tier];

                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#0046B8] dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-[#0046B8]/30 dark:ring-blue-500/30 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <p className={`text-xs font-bold ${isSelected ? 'text-[#0046B8] dark:text-lime-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {tier}
                      </p>
                      <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                        {rate}%
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control 4: Customer Retention Horizon */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white block">
                Projected Retention Horizon
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[12, 24, 36].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRetentionMonths(m)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      retentionMonths === m
                        ? 'border-[#84CC16] bg-lime-50 dark:bg-lime-950/50 text-slate-900 dark:text-lime-300 ring-1 ring-lime-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {m} Months ({m / 12} {m === 12 ? 'Year' : 'Years'})
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Display Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 dark:border-slate-700 relative overflow-hidden">
              
              {/* Illustrative Watermark Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400">Projection Summary</span>
                <span className="text-[11px] font-medium text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 font-mono">
                  Illustrative Estimate
                </span>
              </div>

              {/* Primary Output: Monthly Recurring Commission */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Estimated Monthly Recurring Commission
                </p>
                <p className="text-4xl sm:text-5xl font-black text-lime-400 tabular-nums tracking-tight font-mono">
                  {formatMoney(calculations.monthlyCommission)}
                </p>
                <p className="text-xs text-slate-300">
                  Disbursed on the 25th of every month
                </p>
              </div>

              {/* Secondary Metrics Strip */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Annualized Recurring</p>
                  <p className="text-xl font-bold text-white tabular-nums font-mono">
                    {formatMoney(calculations.annualCommission)}
                  </p>
                  <p className="text-[11px] text-slate-400">12-Month Run-Rate</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400">{retentionMonths}-Month Cumulative</p>
                  <p className="text-xl font-bold text-white tabular-nums font-mono">
                    {formatMoney(calculations.cumulativeProjection)}
                  </p>
                  <p className="text-[11px] text-slate-400">With 95% retention</p>
                </div>
              </div>

              {/* Client Portfolio Overview */}
              <div className="bg-slate-800/80 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-700/80 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Client Monthly Spend:</span>
                  <span className="font-bold text-white tabular-nums font-mono">{formatMoney(calculations.monthlyGross)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Your Commission Share:</span>
                  <span className="font-bold text-lime-400">{commissionRate}% ({selectedTier} Tier)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Processing Leeway:</span>
                  <span className="text-slate-400">~4% Gateway/VAT</span>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={onOpenApply}
                className="w-full py-3.5 px-4 bg-[#84CC16] hover:bg-[#74C011] text-slate-900 text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply as {selectedTier} Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Disclaimer Footnote Box */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-200">Financial Modeling Disclaimer:</p>
              <p className="leading-relaxed">
                Calculations shown above are purely illustrative projections. Actual commission remittances are subject to customer payment success, statutory local tax withholdings, currency conversion spreads, and refunds/chargebacks as detailed in Schedule B of the Partner Agreement.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
