import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Download, Share2, ArrowRight, Check, AlertCircle, Sparkles, Copy, Printer, Globe } from 'lucide-react';
import { PARTNER_TIERS } from '../data/partnerData';
import { CurrencyCode, PartnerTierId } from '../types/partner';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface CommissionCalculatorProps {
  onApplyWithTier: (tierId: PartnerTierId, estimatedAnnual: string) => void;
}

export const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({ onApplyWithTier }) => {
  const { currency, currencyConfig, currencies, setCurrency, formatAmount } = useCurrency();
  const { t } = useLanguage();
  const [selectedTierId, setSelectedTierId] = useState<PartnerTierId>('gold');
  const [activeCustomers, setActiveCustomers] = useState<number>(50);
  const [monthlySubValue, setMonthlySubValue] = useState<number>(currencyConfig.defaultSubscription);
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'annual'>('monthly');
  const [calculationPeriod, setCalculationPeriod] = useState<'monthly' | 'quarterly' | 'annually'>('annually');
  const [enableGrowthProjection, setEnableGrowthProjection] = useState<boolean>(false);
  const [growthRatePerMonth, setGrowthRatePerMonth] = useState<number>(5);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync monthlySubValue when global currency changes
  useEffect(() => {
    setMonthlySubValue(currencyConfig.defaultSubscription);
  }, [currency, currencyConfig.defaultSubscription]);

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    setCurrency(newCurr);
  };

  const selectedTier = useMemo(() => {
    return PARTNER_TIERS.find((t) => t.id === selectedTierId) || PARTNER_TIERS[2];
  }, [selectedTierId]);

  // Calculations
  const calculations = useMemo(() => {
    // Total eligible subscription revenue per month
    const effectiveCustomers = enableGrowthProjection
      ? activeCustomers + (growthRatePerMonth * 6) // Average projected over 12 months
      : activeCustomers;

    const totalMonthlyEligibleRevenue = effectiveCustomers * monthlySubValue;

    // Monthly commission
    const monthlyCommission = totalMonthlyEligibleRevenue * selectedTier.rate;

    // Quarterly commission
    const quarterlyCommission = monthlyCommission * 3;

    // Annualized commission
    const annualizedCommission = monthlyCommission * 12;

    // Selected period result
    let periodCommission = monthlyCommission;
    let periodLabel = 'Monthly Commission';

    if (calculationPeriod === 'quarterly') {
      periodCommission = quarterlyCommission;
      periodLabel = 'Quarterly Commission (3 Months)';
    } else if (calculationPeriod === 'annually') {
      periodCommission = annualizedCommission;
      periodLabel = 'Annualized Commission (12 Months)';
    }

    // Comparison across all tiers for the same inputs
    const tierComparisons = PARTNER_TIERS.map((tier) => {
      const tierMonthly = totalMonthlyEligibleRevenue * tier.rate;
      const tierAnnual = tierMonthly * 12;
      return {
        id: tier.id,
        name: tier.name,
        rateDisplay: tier.rateDisplay,
        rate: tier.rate,
        monthly: tierMonthly,
        annual: tierAnnual
      };
    });

    return {
      effectiveCustomers,
      totalMonthlyEligibleRevenue,
      monthlyCommission,
      quarterlyCommission,
      annualizedCommission,
      periodCommission,
      periodLabel,
      tierComparisons
    };
  }, [
    activeCustomers,
    monthlySubValue,
    selectedTier,
    calculationPeriod,
    enableGrowthProjection,
    growthRatePerMonth
  ]);

  const formatMoney = (amount: number) => {
    return formatAmount(amount);
  };

  const handleCopyEstimate = () => {
    const summary = `MsmeBooks Partner Estimate: ${selectedTier.name} (${selectedTier.rateDisplay}) with ${activeCustomers} customers at ${formatMoney(monthlySubValue)}/mo = ${formatMoney(calculations.monthlyCommission)}/mo (${formatMoney(calculations.annualizedCommission)}/yr). Calculate yours at https://www.msmebooks.org/partners/commissions`;
    navigator.clipboard.writeText(summary);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-[#142D4E] text-white relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1261B5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#B9E51C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B9E51C] uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>{t('calc.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t('calc.title')}
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            {t('calc.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-7">
            {/* Top Selector: Currency & Calculation Period */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex-1 min-w-[260px]">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#B9E51C]" />
                  <span>Operating Currency ({currencies.length} Available)</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['NGN', 'USD', 'GBP', 'EUR', 'KES', 'ZAR', 'GHS'] as CurrencyCode[]).map((cCode) => (
                    <button
                      key={cCode}
                      type="button"
                      onClick={() => handleCurrencyChange(cCode)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors font-mono flex items-center gap-1 ${
                        currency === cCode
                          ? 'bg-[#B9E51C] text-[#142D4E] shadow-sm'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      <span>{cCode}</span>
                    </button>
                  ))}

                  {/* All 16 Currencies Select Dropdown */}
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/15 text-white border border-white/20 focus:outline-none focus:border-[#B9E51C] cursor-pointer"
                    aria-label="Select from all currencies"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#142D4E] text-white">
                        {c.flag} {c.code} ({c.symbol}) - {c.name.split('(')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  View Horizon
                </label>
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
                  <button
                    onClick={() => setCalculationPeriod('monthly')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      calculationPeriod === 'monthly' ? 'bg-[#1261B5] text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setCalculationPeriod('quarterly')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      calculationPeriod === 'quarterly' ? 'bg-[#1261B5] text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => setCalculationPeriod('annually')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      calculationPeriod === 'annually' ? 'bg-[#1261B5] text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Annualized
                  </button>
                </div>
              </div>
            </div>

            {/* Input 1: Partner Tier Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                1. Select Partner Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PARTNER_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedTierId === tier.id
                        ? 'bg-[#1261B5] border-[#B9E51C] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{tier.name.split(' ')[0]}</span>
                      {selectedTierId === tier.id && <Check className="w-3.5 h-3.5 text-[#B9E51C]" />}
                    </div>
                    <span className="text-lg font-bold font-mono text-[#B9E51C] block mt-1">
                      {tier.rateDisplay}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Number of Active Paying Customers Slider & Number */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Number of Active Paying Customers
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={activeCustomers}
                    onChange={(e) => setActiveCustomers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded-md text-right font-mono font-bold text-sm text-white focus:outline-none focus:border-[#B9E51C]"
                  />
                  <span className="text-xs text-slate-400">clients</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={250}
                value={activeCustomers}
                onChange={(e) => setActiveCustomers(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#B9E51C]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>1 client</span>
                <span>25 clients</span>
                <span>50 clients (Default)</span>
                <span>100 clients</span>
                <span>250+ clients</span>
              </div>
            </div>

            {/* Input 3: Monthly Subscription Value per Customer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  3. Avg Monthly Subscription per Customer
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-mono">{currencyConfig.symbol}</span>
                  <input
                    type="number"
                    step={100}
                    value={monthlySubValue}
                    onChange={(e) => setMonthlySubValue(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-28 px-2 py-1 bg-white/10 border border-white/20 rounded-md text-right font-mono font-bold text-sm text-white focus:outline-none focus:border-[#B9E51C]"
                  />
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Sample Plans:</span>
                <button
                  type="button"
                  onClick={() => setMonthlySubValue(Math.round(currencyConfig.defaultSubscription * 0.5))}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  Starter ({formatAmount(Math.round(currencyConfig.defaultSubscription * 0.5))})
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySubValue(currencyConfig.defaultSubscription)}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  Pro ({formatAmount(currencyConfig.defaultSubscription)})
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySubValue(Math.round(currencyConfig.defaultSubscription * 2.5))}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  Multi-Branch ({formatAmount(Math.round(currencyConfig.defaultSubscription * 2.5))})
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySubValue(Math.round(currencyConfig.defaultSubscription * 5))}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                >
                  Enterprise ({formatAmount(Math.round(currencyConfig.defaultSubscription * 5))})
                </button>
              </div>
            </div>

            {/* Growth Projection Toggle */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Enable Customer Growth Forecast
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Model adding +{growthRatePerMonth} new paying clients every month
                  </span>
                </div>
                <button
                  onClick={() => setEnableGrowthProjection(!enableGrowthProjection)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    enableGrowthProjection ? 'bg-[#B9E51C]' : 'bg-white/20'
                  }`}
                  aria-label="Toggle growth projection"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#142D4E] transition-transform ${
                      enableGrowthProjection ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Results Analytics Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#B9E51C]/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-[#B9E51C] uppercase tracking-wider block">
                    Estimated Partner Earning
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {selectedTier.name} ({selectedTier.rateDisplay})
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-300 bg-white/10 px-2.5 py-1 rounded-md">
                  {activeCustomers} Clients
                </span>
              </div>

              {/* Marquee Earnings Stat */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">
                  {calculations.periodLabel}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#B9E51C] font-mono tracking-tight tabular-nums">
                  {formatMoney(calculations.periodCommission)}
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  From {formatMoney(calculations.totalMonthlyEligibleRevenue)}/mo in eligible customer subscription billing.
                </p>
              </div>

              {/* Side-by-side Monthly & Annual Breakdown */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/20 border border-white/10">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Monthly Recurring
                  </span>
                  <span className="text-xl font-bold text-white font-mono tabular-nums">
                    {formatMoney(calculations.monthlyCommission)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Annualized (12 Mo)
                  </span>
                  <span className="text-xl font-bold text-[#B9E51C] font-mono tabular-nums">
                    {formatMoney(calculations.annualizedCommission)}
                  </span>
                </div>
              </div>

              {/* Side-by-side comparison across all 4 tiers */}
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  Earnings by Tier for Same {activeCustomers} Clients:
                </span>
                <div className="space-y-1.5">
                  {calculations.tierComparisons.map((tc) => (
                    <div
                      key={tc.id}
                      onClick={() => setSelectedTierId(tc.id as PartnerTierId)}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        selectedTierId === tc.id
                          ? 'bg-[#1261B5] text-white font-bold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#B9E51C]" />
                        <span>{tc.name} ({tc.rateDisplay})</span>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <span>{formatMoney(tc.monthly)}/mo</span>
                        <span className="text-[10px] text-slate-400 block">
                          {formatMoney(tc.annual)}/yr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Apply, Copy, Print */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() =>
                    onApplyWithTier(
                      selectedTier.id,
                      formatMoney(calculations.annualizedCommission)
                    )
                  }
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-[#142D4E] bg-[#B9E51C] hover:bg-[#aadb14] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B9E51C]/20"
                >
                  <span>Apply with this Estimate ({selectedTier.name})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyEstimate}
                    className="py-2 px-3 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#B9E51C]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied to Clipboard' : 'Share Estimate'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="py-2 px-3 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimer (Exact brief text) */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-[11px] text-slate-400 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-300">Mandatory Program Notice:</strong> Illustrative earnings only. Actual commissions depend on eligible paid subscriptions, applicable program terms, refunds, taxes, payment adjustments, and continued customer eligibility. Earnings are not guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
