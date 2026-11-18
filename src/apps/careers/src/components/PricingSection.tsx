import React, { useState } from 'react';
import {
  CheckCircle2,
  Building2,
  Users,
  User,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Briefcase,
  Layers,
  Clock,
  TrendingDown,
  Globe,
  CreditCard,
  Smartphone,
  Check,
  Plus,
} from 'lucide-react';
import { PricingPlan, BillingCycle, PostingScope, PricingTargetAudience, Currency } from '../types/pricing';
import { PRICING_PLANS, BILLING_DISCOUNTS } from '../data/pricingPlans';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { PAYMENT_REGIONS, PAYMENT_GATEWAYS, PaymentRegionId } from '../data/paymentGateways';
import { SubscriptionCurrencyModal } from './SubscriptionCurrencyModal';
import { AddCountryCurrencyModal } from './AddCountryCurrencyModal';
import { getCandidateApplicationQuota, getEmployerWeeklyPostStatus } from '../utils/planQuotas';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan, cycle: BillingCycle, currency: Currency) => void;
  onOpenPostJob?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onOpenPostJob,
}) => {
  const { tr } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'employer' | 'candidate'>('employer');
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [selectedScope, setSelectedScope] = useState<PostingScope>('all');
  const [selectedAudience, setSelectedAudience] = useState<PricingTargetAudience>('all');
  const [gatewayPreviewRegion, setGatewayPreviewRegion] = useState<PaymentRegionId>('west-africa');
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const { currentCurrency, currentConfig, formatAmount, setCurrency: setGlobalCurrency, currencies } = useCurrency();

  const candidateQuota = getCandidateApplicationQuota();
  const employerWeeklyStatus = getEmployerWeeklyPostStatus();

  const currentDiscount = BILLING_DISCOUNTS[selectedCycle];

  // Filter plans based on category, scope and audience
  const filteredPlans = PRICING_PLANS.filter((plan) => {
    // Category match
    const planCat = plan.planCategory || (plan.targetAudience === 'candidate' ? 'candidate' : 'employer');
    if (planCat !== activeCategory) return false;

    if (activeCategory === 'employer') {
      const matchesScope = selectedScope === 'all' || plan.postingScope === selectedScope;
      const matchesAudience = selectedAudience === 'all' || plan.targetAudience === selectedAudience;
      return matchesScope && matchesAudience;
    }

    return true;
  });

  // Calculate pricing per period
  const getPlanPricing = (plan: PricingPlan) => {
    let totalUSD = plan.priceMonthlyUSD;
    let monthlyRateUSD = plan.priceMonthlyUSD;

    switch (selectedCycle) {
      case 'monthly':
        totalUSD = plan.priceMonthlyUSD;
        monthlyRateUSD = plan.priceMonthlyUSD;
        break;
      case 'quarterly':
        totalUSD = plan.priceQuarterlyUSD;
        monthlyRateUSD = Math.round(plan.priceQuarterlyUSD / 3);
        break;
      case 'biyearly':
        totalUSD = plan.priceBiYearlyUSD;
        monthlyRateUSD = Math.round(plan.priceBiYearlyUSD / 6);
        break;
      case 'yearly':
        totalUSD = plan.priceYearlyUSD;
        monthlyRateUSD = Math.round(plan.priceYearlyUSD / 12);
        break;
    }

    const regularTotalUSD = plan.priceMonthlyUSD * currentDiscount.periodMonths;
    const savingsUSD = Math.max(0, regularTotalUSD - totalUSD);

    return {
      totalUSD,
      monthlyRateUSD,
      savingsUSD,
      regularMonthlyUSD: plan.priceMonthlyUSD,
    };
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'employer':
        return {
          label: 'For Employers & MSMEs',
          color: 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800',
          icon: Building2,
        };
      case 'candidate':
        return {
          label: 'For Candidates & Job Seekers',
          color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: User,
        };
      case 'agency':
        return {
          label: 'For Staffing Agencies',
          color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          icon: Users,
        };
      case 'headhunter':
        return {
          label: 'For Executive Headhunters',
          color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: Target,
        };
      default:
        return {
          label: 'General Plan',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Briefcase,
        };
    }
  };

  return (
    <section id="pricing" className="py-20 bg-[#F7F9FC] dark:bg-[#091122] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#B5E61D]/10 dark:bg-[#B5E61D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
            <span>{tr.pricing.kicker}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#14243A] dark:text-white tracking-tight leading-tight text-balance">
            {tr.pricing.title} <br />
            <span className="text-[#0066CC] dark:text-[#38BDF8]">{tr.pricing.subtitle}</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base mt-4 leading-relaxed font-normal">
            {tr.pricing.desc}
          </p>
        </div>

        {/* Category Switcher Tabs: Employers vs Candidates */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-md gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('employer');
                setSelectedScope('all');
                setSelectedAudience('all');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'employer'
                  ? 'bg-[#0066CC] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1A284A]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Employers & Recruiters</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                activeCategory === 'employer' ? 'bg-[#B5E61D] text-[#14243A]' : 'bg-blue-100 text-[#0066CC]'
              }`}>
                1 Free Post/Wk
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('candidate');
                setSelectedScope('all');
                setSelectedAudience('candidate');
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'candidate'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1A284A]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>For Job Seekers & Candidates</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                activeCategory === 'candidate' ? 'bg-[#B5E61D] text-[#14243A]' : 'bg-emerald-100 text-emerald-800'
              }`}>
                10 Free Apps/Mo
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Banner: Employer Weekly Post or Candidate Monthly Quota */}
        {activeCategory === 'employer' ? (
          <div className="max-w-3xl mx-auto mb-8 p-3.5 bg-blue-50/90 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Employer Free Weekly Post: </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {employerWeeklyStatus.isAvailable
                    ? '1 Free Vacancy Post is available right now! (Renews every 7 days · 14-day shelf-life)'
                    : `Next free weekly post unlocks in ${employerWeeklyStatus.daysUntilNext} day(s) on ${employerWeeklyStatus.formattedResetDate}`}
                </span>
              </div>
            </div>
            {onOpenPostJob && employerWeeklyStatus.isAvailable && (
              <button
                type="button"
                onClick={onOpenPostJob}
                className="px-3.5 py-1.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Post Free Vacancy Now
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto mb-8 p-3.5 bg-emerald-50/90 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Candidate Quota Status: </span>
                <span className="text-slate-600 dark:text-slate-300">
                  You are on <strong>{candidateQuota.planName}</strong>. You have used{' '}
                  <strong>{candidateQuota.usedThisMonth}</strong> of{' '}
                  <strong>{candidateQuota.monthlyLimit === 'unlimited' ? 'Unlimited' : candidateQuota.monthlyLimit}</strong> monthly applications ({candidateQuota.remainingThisMonth === 'unlimited' ? 'Unlimited remaining' : `${candidateQuota.remainingThisMonth} remaining`}).
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl shrink-0">
              {candidateQuota.canApply ? 'Applications Active' : 'Upgrade to Apply'}
            </span>
          </div>
        )}

        {/* =========================================================================
            INTERACTIVE CONTROLS BAR: BILLING CYCLE, SCOPE, AUDIENCE & CURRENCY
           ========================================================================= */}
        <div className="mb-12 space-y-6">
          {/* Row 1: Billing Cycle Tabs (Monthly, Quarterly, Bi-Yearly, Yearly) */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>{tr.pricing.chooseCycle}</span>
            </div>

            <div className="inline-flex p-1.5 bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm gap-1 flex-wrap justify-center">
              {(['monthly', 'quarterly', 'biyearly', 'yearly'] as BillingCycle[]).map((cycle) => {
                const info = BILLING_DISCOUNTS[cycle];
                const isSelected = selectedCycle === cycle;
                const cycleText =
                  cycle === 'monthly'
                    ? tr.pricing.monthly
                    : cycle === 'quarterly'
                    ? tr.pricing.quarterly
                    : cycle === 'biyearly'
                    ? tr.pricing.biyearly
                    : tr.pricing.yearly;
                return (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setSelectedCycle(cycle)}
                    className={`relative px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0066CC] text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1A284A]'
                    }`}
                  >
                    <span>{cycleText}</span>
                    {info.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isSelected
                            ? 'bg-[#B5E61D] text-[#14243A]'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {info.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Secondary Filter Bar (Scope + Role Filter + Currency) */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            {/* Scope / Subtype Tabs */}
            {activeCategory === 'employer' ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                  Scope:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedScope === 'all'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A]'
                  }`}
                >
                  All Employer Tiers (5)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScope('single')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedScope === 'single'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A]'
                  }`}
                >
                  Single & Monthly Posts
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScope('bulk')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedScope === 'bulk'
                      ? 'bg-[#14243A] dark:bg-[#0066CC] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A284A]'
                  }`}
                >
                  Bulk & Growth Packs
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                  Candidate Tiers:
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Career Acceleration · 10 to Unlimited Applications/mo
                </span>
              </div>
            )}

            {/* Target Audience Filters (for employer mode) */}
            {activeCategory === 'employer' && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                  Audience:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAudience('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedAudience === 'all'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Roles
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAudience('employer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    selectedAudience === 'employer'
                      ? 'bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] border border-blue-300 dark:border-blue-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Employers</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAudience('agency')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    selectedAudience === 'agency'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Agencies</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAudience('headhunter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    selectedAudience === 'headhunter'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Headhunters</span>
                </button>
              </div>
            )}

            {/* Global Currency Switcher with All World Currencies */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0066CC]/10 dark:bg-[#38BDF8]/10 hover:bg-[#0066CC]/15 dark:hover:bg-[#38BDF8]/15 border border-[#0066CC]/30 dark:border-[#38BDF8]/30 text-[#0066CC] dark:text-[#38BDF8] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                title="Browse and select from all 150+ world currencies"
              >
                <Globe className="w-3.5 h-3.5 shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="text-sm leading-none">{currentConfig.flag}</span>
                <span>
                  {currentConfig.code} ({currentConfig.symbol})
                </span>
                <span className="hidden sm:inline text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  · {currentConfig.name}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#0066CC] dark:bg-[#38BDF8] text-white dark:text-slate-900 text-[10px] font-extrabold ml-1">
                  150+ All Currencies
                </span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
                <select
                  value={currentCurrency}
                  onChange={(e) => setGlobalCurrency(e.target.value)}
                  aria-label="Quick select world currency"
                  className="px-2 py-1 text-xs font-bold bg-white dark:bg-[#131D35] text-[#0066CC] dark:text-[#38BDF8] rounded-lg border border-slate-200 dark:border-slate-700 outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
                >
                  <optgroup label="Default System Currency (Nigeria)">
                    {currencies
                      .filter((c) => c.code === 'NGN')
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country} (Default)
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Popular World Currencies">
                    {currencies
                      .filter((c) => c.isPopular && c.code !== 'NGN')
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Africa">
                    {currencies
                      .filter((c) => c.region === 'Africa' && !c.isPopular && c.code !== 'NGN')
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Americas">
                    {currencies
                      .filter((c) => c.region === 'Americas' && !c.isPopular)
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Europe">
                    {currencies
                      .filter((c) => c.region === 'Europe' && !c.isPopular)
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Middle East">
                    {currencies
                      .filter((c) => c.region === 'Middle East' && !c.isPopular)
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Asia">
                    {currencies
                      .filter((c) => c.region === 'Asia' && !c.isPopular)
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Oceania & Global">
                    {currencies
                      .filter((c) => (c.region === 'Oceania' || c.region === 'Global') && !c.isPopular)
                      .map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol}) - {c.country}
                        </option>
                      ))}
                  </optgroup>
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddCountryModal(true)}
                  className="px-2 py-1 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Add any country and currency"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Exchange Rate Notice */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/60 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base">{currentConfig.flag}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                All subscription tiers converted live in <strong>{currentConfig.name} ({currentConfig.code})</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                Pegged Benchmark: 1 USD ≈ {currentConfig.ratePerUSD.toLocaleString()} {currentConfig.code}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCurrencyModalOpen(true)}
              className="text-[#0066CC] dark:text-[#38BDF8] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore All Currencies of the World</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRICING CARDS GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredPlans.map((plan) => {
            const pricing = getPlanPricing(plan);
            const aud = getAudienceBadge(plan.targetAudience);
            const AudIcon = aud.icon;

            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-[#131D35] rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'border-2 border-[#0066CC] dark:border-[#38BDF8] shadow-xl hover:shadow-2xl ring-4 ring-[#0066CC]/10 dark:ring-[#38BDF8]/10'
                    : 'border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Popular / Feature Ribbon */}
                {plan.popularBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#B5E61D] text-[#14243A] text-[11px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>{plan.popularBadge}</span>
                  </div>
                )}

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${aud.color}`}>
                      <AudIcon className="w-3.5 h-3.5" />
                      <span>{aud.label}</span>
                    </span>

                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {plan.postingScope === 'single' ? 'Single Post' : 'Bulk Pack'}
                    </span>
                  </div>

                  {/* Plan Name & Tagline */}
                  <h3 className="text-xl font-bold text-[#14243A] dark:text-white leading-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 min-h-[36px]">
                    {plan.tagline}
                  </p>

                  {/* Price Block */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#14243A] dark:text-white tracking-tight font-mono">
                        {formatAmount(pricing.monthlyRateUSD)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        / month
                      </span>
                      {pricing.savingsUSD > 0 && (
                        <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-mono">
                          {formatAmount(pricing.regularMonthlyUSD)}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">
                        {selectedCycle === 'monthly'
                          ? 'Billed monthly · Qty: 1 Mo'
                          : `Billed ${formatAmount(pricing.totalUSD)} · Qty: ${currentDiscount.quantity || currentDiscount.periodMonths} Mo`}
                      </span>

                      {pricing.savingsUSD > 0 && (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />
                          <span>Save {formatAmount(pricing.savingsUSD)}</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Subscription Term:</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] font-mono font-bold">
                        Quantity: {selectedCycle === 'monthly' ? '1 Month' : selectedCycle === 'yearly' ? '12 Months' : `${currentDiscount.quantity || currentDiscount.periodMonths} Months`}
                      </span>
                    </div>
                  </div>

                  {/* Feature Highlights Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {plan.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0066CC] dark:text-[#38BDF8] border border-blue-100 dark:border-blue-900/50"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Bullet list of features */}
                  <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200 mb-6">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  {plan.id === 'employer-free-weekly' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenPostJob) onOpenPostJob();
                        else onSelectPlan(plan, selectedCycle, currentCurrency as any);
                      }}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#B5E61D]" />
                      <span>{employerWeeklyStatus.isAvailable ? 'Post Free Weekly Job' : 'View Free Slot Rules'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : plan.id === 'candidate-free' ? (
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan, selectedCycle, currentCurrency as any)}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{candidateQuota.planId === 'free' ? 'Current Active Plan (10 Apps/mo)' : 'Switch to Free Plan'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan, selectedCycle, currentCurrency as any)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.isPopular
                          ? 'bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] text-white shadow-md'
                          : plan.planCategory === 'candidate'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-[#14243A] dark:bg-[#1A284A] hover:bg-slate-800 dark:hover:bg-[#20325A] text-white border border-slate-700/60'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            PAN-AFRICAN & GLOBAL PAYMENT GATEWAYS SHOWCASE
           ========================================================================= */}
        <div className="mt-14 p-6 sm:p-8 bg-white dark:bg-[#131D35] rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider mb-1.5">
                <Globe className="w-4 h-4" />
                <span>Multi-Region Payment Infrastructure</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#14243A] dark:text-white">
                Pay by Country & Region Across 30+ Nations
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Whether you are an Employer in Lagos or Nairobi, a Recruitment Agency in Johannesburg or Dakar, or a Global Headhunting Practice in London or New York, pay seamlessly in your home currency.
              </p>
            </div>

            {/* Region Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-thin">
              {PAYMENT_REGIONS.map((r) => {
                const isSelected = gatewayPreviewRegion === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setGatewayPreviewRegion(r.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0066CC] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
                    }`}
                  >
                    <span>{r.flag}</span>
                    <span>{r.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gateways Grid for active region */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAYMENT_GATEWAYS.filter((g) => g.regionId === gatewayPreviewRegion).map((gw) => (
              <div
                key={gw.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#0D1527] hover:border-[#0066CC] dark:hover:border-[#38BDF8] transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors">
                      {gw.name}
                    </span>
                    {gw.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-bold">
                        {gw.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {gw.tagline}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>Methods:</strong> {gw.methods.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>Countries:</strong> {gw.countries.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">
                    Currencies: {gw.currencies.join(', ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectPlan(filteredPlans[0] || PRICING_PLANS[0], selectedCycle, currentCurrency as any)}
                    className="text-[#0066CC] dark:text-[#38BDF8] font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Subscribe via {gw.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Bespoke Box below grid */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-[#14243A] via-[#162B46] to-[#0066CC] dark:from-[#070D1A] dark:via-[#0F1E38] dark:to-[#0A407A] rounded-3xl text-white shadow-xl border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B5E61D] uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>Need Custom Enterprise Volume or Local Bank Invoicing?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Tailored Billing for High-Volume Staffing & Multinational Enterprises
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-normal">
              We provide custom SLA terms, VAT-exempt corporate invoicing, dedicated account executives, and multi-country billing across Nigeria, Kenya, Rwanda, Ghana, South Africa, and the UK/US.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {onOpenPostJob && (
              <button
                type="button"
                onClick={onOpenPostJob}
                className="px-5 py-3 text-xs font-bold text-[#14243A] bg-[#B5E61D] hover:bg-[#a2d114] rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Briefcase className="w-4 h-4" />
                <span>Post a Job Free First</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectPlan(PRICING_PLANS[PRICING_PLANS.length - 1], selectedCycle, currentCurrency as any)}
              className="px-5 py-3 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Request Custom Enterprise Invoice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 150+ World Currencies Modal */}
      <SubscriptionCurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />

      {/* Add Custom Country & Currency Modal */}
      <AddCountryCurrencyModal
        isOpen={showAddCountryModal}
        onClose={() => setShowAddCountryModal(false)}
      />
    </section>
  );
};
