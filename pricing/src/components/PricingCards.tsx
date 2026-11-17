import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Star,
  ShoppingBag,
  CreditCard,
  Lock,
  Layers,
  AlertTriangle,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Info,
  Grid,
  Maximize2,
  Users,
  MessageCircle,
  X,
  Lightbulb,
  Zap,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { PRICING_PLANS } from '../data/pricingData';
import { getFeatureTooltipText, getFeatureTooltipDetails, FeatureTooltipData } from '../data/businessTermsTooltips';
import { BillingPeriod, Currency, PricingPlan } from '../types';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { VolumePricingSlider } from './VolumePricingSlider';
import {
  calculatePlanVolumePricing,
  TIER_LIMITS,
} from '../utils/volumePricing';
import { AnimatedPriceDisplay } from './AnimatedPriceDisplay';
import { EnterpriseBulkCalculator } from './EnterpriseBulkCalculator';

interface PricingCardsProps {
  billingPeriod: BillingPeriod;
  currency: Currency;
  onSelectPlan: (planId: string) => void;
  onOpenDemoModal: () => void;
  users?: number;
  transactions?: number;
  onUsersChange?: (users: number) => void;
  onTransactionsChange?: (transactions: number) => void;
  onOpenUpgradeAdvisor?: () => void;
}

type PlanFilterCategory = 'all' | 'sme' | 'enterprise' | 'ultimate';

export const PricingCards: React.FC<PricingCardsProps> = ({
  billingPeriod,
  currency,
  onSelectPlan,
  onOpenDemoModal,
  users: propUsers,
  transactions: propTransactions,
  onUsersChange: propOnUsersChange,
  onTransactionsChange: propOnTransactionsChange,
  onOpenUpgradeAdvisor,
}) => {
  const { t, language } = useLanguage();
  const { addItem, openCheckout } = useCart();

  // Local volume state: defaults to single user and zero transaction limits
  const [localUsers, setLocalUsers] = useState<number>(1);
  const [localTransactions, setLocalTransactions] = useState<number>(0);

  const currentUsers = propUsers !== undefined ? propUsers : localUsers;
  const currentTransactions =
    propTransactions !== undefined ? propTransactions : localTransactions;

  // Active plan slider index and view modes
  const [activePlanIndex, setActivePlanIndex] = useState<number>(1); // Defaults to Growth or Premium
  const [planCategory, setPlanCategory] = useState<PlanFilterCategory>('all');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('grid');
  // Contextual tooltip state: tracks hovered and clicked/pinned tooltips
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [pinnedTooltip, setPinnedTooltip] = useState<string | null>(null);
  const activeTooltip = pinnedTooltip || hoveredTooltip;
  const [activeVatTooltip, setActiveVatTooltip] = useState<string | null>(null);

  // Close pinned tooltip on clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinnedTooltip(null);
        setHoveredTooltip(null);
        setActiveVatTooltip(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.contextual-tooltip-container')) {
        setPinnedTooltip(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Subtle flash animation state on currency change
  const [isCurrencyFlashing, setIsCurrencyFlashing] = useState<boolean>(false);
  const [isPricingLoading, setIsPricingLoading] = useState<boolean>(false);
  const prevCurrencyRef = useRef<Currency>(currency);

  useEffect(() => {
    if (prevCurrencyRef.current !== currency) {
      prevCurrencyRef.current = currency;
      setIsPricingLoading(true);
      setIsCurrencyFlashing(true);
      const timer = setTimeout(() => {
        setIsPricingLoading(false);
        setIsCurrencyFlashing(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currency]);

  // Carousel touch swipe handling
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  const handleUsersChange = (val: number) => {
    if (propOnUsersChange) {
      propOnUsersChange(val);
    } else {
      setLocalUsers(val);
    }
  };

  const handleTransactionsChange = (val: number) => {
    if (propOnTransactionsChange) {
      propOnTransactionsChange(val);
    } else {
      setLocalTransactions(val);
    }
  };

  const handleResetVolume = () => {
    handleUsersChange(2);
    handleTransactionsChange(500);
  };

  const getWhatsAppSalesUrl = (planName?: string, planPrice?: string, userLimit?: string) => {
    const basePhone = '2349158482622';
    let message = 'Hello MsmeBooks Sales Team, I am interested in learning more about your pricing plans and finding the best fit for my business.';
    if (planName) {
      message = `Hello MsmeBooks Sales Team, I am interested in the ${planName} plan (${userLimit || ''}${planPrice ? ` - ${planPrice}` : ''}). Could you please share more details and help me get set up?`;
    }
    return `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
  };

  // Filter plans based on category
  const filteredPlans = PRICING_PLANS.filter((plan) => {
    if (planCategory === 'sme') {
      return ['starter', 'growth', 'business'].includes(plan.id);
    }
    if (planCategory === 'enterprise') {
      return ['premium', 'enterprise', 'superior'].includes(plan.id);
    }
    if (planCategory === 'ultimate') {
      return ['ultimate', 'ultimate_prime', 'mega_org', 'custom'].includes(plan.id);
    }
    return true;
  });

  const scrollToIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(filteredPlans.length - 1, index));
    setActivePlanIndex(safeIndex);
    if (scrollContainerRef.current) {
      const cardElements = scrollContainerRef.current.children;
      if (cardElements[safeIndex]) {
        (cardElements[safeIndex] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && activePlanIndex < filteredPlans.length - 1) {
        // Swiped left -> next plan
        scrollToIndex(activePlanIndex + 1);
      } else if (diff < 0 && activePlanIndex > 0) {
        // Swiped right -> prev plan
        scrollToIndex(activePlanIndex - 1);
      }
    }
  };

  return (
    <section
      id="plans"
      className="py-12 lg:py-16 bg-white dark:bg-[#070F1B] relative transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>Flat Subscription Pricing • Zero Transaction Fees • Unlimited Usage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Transparent Flat Subscription Plans
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            From single-user Starter at flat ₦4,500/mo to multi-branch enterprises. Subscriptions are based strictly on team user seats and feature modules with zero transaction fees.
          </p>
        </div>

        {/* 1. Interactive Volume Pricing Slider Controls */}
        <VolumePricingSlider
          users={currentUsers}
          transactions={currentTransactions}
          onUsersChange={handleUsersChange}
          onTransactionsChange={handleTransactionsChange}
          currency={currency}
          onReset={handleResetVolume}
        />

        {/* 2. Interactive Plan Carousel Slider Controls */}
        <div className="my-8 p-4 sm:p-5 bg-slate-50 dark:bg-[#0B182B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-[#071322] rounded-xl border border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setPlanCategory('all');
                  setActivePlanIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  planCategory === 'all'
                    ? 'bg-[#0A4FD5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All 9 Plans
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlanCategory('sme');
                  setActivePlanIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  planCategory === 'sme'
                    ? 'bg-[#0A4FD5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Core SME Edition (Starter, Growth, Business)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlanCategory('enterprise');
                  setActivePlanIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  planCategory === 'enterprise'
                    ? 'bg-[#0A4FD5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Enterprise Edition (Premium, Enterprise, Superior)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlanCategory('ultimate');
                  setActivePlanIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  planCategory === 'ultimate'
                    ? 'bg-[#0A4FD5] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ultimate Edition (Ultimate, Ultimate-Prime, Custom)
              </button>
              <a
                href="#enterprise-bulk-calculator"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-blue-700 to-indigo-800 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xs border border-blue-400/40 cursor-pointer"
                title="Jump to Enterprise Bulk Tier Calculator (50–1,000+ seats)"
              >
                <Calculator className="w-3.5 h-3.5 text-lime-400" />
                <span>Bulk Tier Calculator (50–1,000+ Seats)</span>
              </a>
            </div>

            {/* Slider Control Rail */}
            <div className="flex-1 max-w-md w-full px-2">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[#0A4FD5]" />
                  <span>Plan Slider Navigation:</span>
                </span>
                <span className="text-[#0A4FD5] dark:text-blue-400 font-black">
                  {filteredPlans[activePlanIndex]?.name} ({filteredPlans[activePlanIndex]?.usersLimit})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={filteredPlans.length - 1}
                value={activePlanIndex}
                onChange={(e) => scrollToIndex(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0A4FD5]"
                aria-label="Subscription plan slider"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                <span>{filteredPlans[0]?.name}</span>
                <span>{filteredPlans[Math.floor(filteredPlans.length / 2)]?.name}</span>
                <span>{filteredPlans[filteredPlans.length - 1]?.name}</span>
              </div>
            </div>

            {/* View Mode Toggle & Next/Prev */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollToIndex(activePlanIndex - 1)}
                  disabled={activePlanIndex === 0}
                  className="p-2 rounded-xl bg-white dark:bg-[#071322] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous plan"
                  title="Previous Plan"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                  {activePlanIndex + 1} / {filteredPlans.length}
                </span>
                <button
                  type="button"
                  onClick={() => scrollToIndex(activePlanIndex + 1)}
                  disabled={activePlanIndex === filteredPlans.length - 1}
                  className="p-2 rounded-xl bg-white dark:bg-[#071322] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next plan"
                  title="Next Plan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'grid' ? 'slider' : 'grid')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#071322] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Toggle between grid and focus slider view"
              >
                {viewMode === 'grid' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#0A4FD5]" />
                    <span>Focus Slider</span>
                  </>
                ) : (
                  <>
                    <Grid className="w-3.5 h-3.5 text-[#0A4FD5]" />
                    <span>View All Grid</span>
                  </>
                )}
              </button>

              {onOpenUpgradeAdvisor && (
                <button
                  type="button"
                  onClick={onOpenUpgradeAdvisor}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 hover:from-lime-300 hover:to-emerald-300 text-xs font-black shadow-xs hover:shadow-md transition-all cursor-pointer"
                  title="Plan Upgrade Advisor: Calculate exact cost difference for your business"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span className="hidden sm:inline">Upgrade Advisor</span>
                  <span className="sm:hidden">Upgrade</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* 3. Subscription Plan Cards (Swipe-to-Scroll on Mobile & Responsive Grid) */}
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`pb-4 ${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch'
              : 'flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6'
          }`}
        >
          {isPricingLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch w-full col-span-full">
              {[...Array(4)].map((_, skIdx) => (
                <div
                  key={`skel-pricing-${skIdx}`}
                  className="p-6 sm:p-7 rounded-2xl lg:rounded-3xl bg-white dark:bg-[#0D1C30] border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse flex flex-col space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-28"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800/80 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3"></div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-36 mb-2"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-24"></div>
                  </div>
                  <div className="space-y-2 pt-4">
                    {[...Array(5)].map((_, fIdx) => (
                      <div key={fIdx} className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6"></div>
                    ))}
                  </div>
                  <div className="mt-auto pt-6">
                    <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredPlans.map((plan, pIdx) => {
              const planTranslation = (t.pricing as any)[plan.id] || {};
              const planName = planTranslation.name || plan.name;
              const planDescription = planTranslation.description || plan.description;
              const planBestFor = planTranslation.bestFor || plan.bestFor;
              const planCtaText = planTranslation.cta || plan.ctaText;
              const planFeatures = planTranslation.features || plan.features;

              // Compute dynamic volume calculations
              const volumeCalc = calculatePlanVolumePricing(
                plan.id,
                currentUsers,
                currentTransactions,
                billingPeriod
              );

              // Growth highlight logic: attach Best Value for Growth to Premium if scale implies expansion
              const isGrowthScale = currentUsers >= 4 || currentTransactions >= 2000;
              const isPremiumBestValue = plan.id === 'premium' && (isGrowthScale || volumeCalc.isRecommended);
              const isRecommended = volumeCalc.isRecommended || isPremiumBestValue;
              const activeMonthlyRateNgn = volumeCalc.cycleMonthlyRateNgn;

              const displayPrice = plan.customPricing
                ? 'Custom'
                : formatCurrency(activeMonthlyRateNgn, currency);

              const billingPeriodSubtext = plan.customPricing
                ? ''
                : billingPeriod === 'monthly'
                ? t.common.perMonth
                : billingPeriod === 'quarterly'
                ? `${t.common.perMonth} (${t.common.billedQuarterly || 'Billed quarterly'})`
                : billingPeriod === 'bi-yearly'
                ? `${t.common.perMonth} (${t.common.billedBiYearly || 'Billed bi-yearly'})`
                : `${t.common.perMonth} (${t.common.billedAnnually})`;

              const cycleBilledText = plan.customPricing
                ? 'Custom volume SLA contract'
                : billingPeriod === 'monthly'
                ? t.common.billedMonthly
                : billingPeriod === 'quarterly'
                ? `Billed as ${formatCurrency(volumeCalc.cycleTotalNgn, currency)} every 3 months`
                : billingPeriod === 'bi-yearly'
                ? `Billed as ${formatCurrency(volumeCalc.cycleTotalNgn, currency)} every 6 months`
                : `Billed as ${formatCurrency(volumeCalc.cycleTotalNgn, currency)} / year`;

              const savingsText =
                volumeCalc.cycleDiscountPercent > 0 && !plan.customPricing && activeMonthlyRateNgn > 0
                  ? `Save ${formatCurrency(volumeCalc.cycleSavingsNgn, currency)} (${volumeCalc.cycleDiscountPercent}% OFF)`
                  : null;

              const limits = TIER_LIMITS[plan.id];

              // 7.5% Nigerian Statutory VAT Calculations
              const isZeroPrice = plan.monthlyPrice === 0 || plan.customPricing;
              const vatRate = 0.075;
              const vatAmountNgn = isZeroPrice ? 0 : Math.round(activeMonthlyRateNgn * vatRate);
              const totalWithVatNgn = isZeroPrice ? 0 : activeMonthlyRateNgn + vatAmountNgn;

              const isFocusedInSlider = activePlanIndex === pIdx;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl lg:rounded-3xl transition-all duration-300 ${
                    viewMode === 'slider' ? 'min-w-[320px] sm:min-w-[360px] snap-center shrink-0' : ''
                  } ${
                    isCurrencyFlashing
                      ? 'ring-4 ring-[#0A4FD5]/50 dark:ring-blue-400/50 shadow-xl shadow-blue-500/25 scale-[1.015] bg-blue-50/20 dark:bg-blue-950/20'
                      : ''
                  } ${
                    isPremiumBestValue
                      ? 'bg-gradient-to-b from-emerald-50/90 via-white to-lime-50/30 dark:from-[#0B251E] dark:via-[#091D26] dark:to-[#0B192C] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 lg:-translate-y-3 ring-4 ring-emerald-400/40'
                      : isRecommended
                      ? 'bg-gradient-to-b from-blue-50/80 via-white to-lime-50/20 dark:from-[#0E2447] dark:via-[#0D1F38] dark:to-[#0B192C] border-2 border-[#0A4FD5] shadow-xl shadow-blue-500/15 dark:shadow-blue-900/40 lg:-translate-y-2 ring-4 ring-[#84CC16]/30 dark:ring-[#84CC16]/35'
                      : isFocusedInSlider && viewMode === 'slider'
                      ? 'bg-white dark:bg-[#0D1C30] border-2 border-blue-400 shadow-lg ring-2 ring-blue-300/40'
                      : 'bg-white dark:bg-[#0D1C30] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Dynamically Positioned Recommended Ribbon */}
                  {isPremiumBestValue ? (
                    <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg shadow-emerald-500/30 border border-white dark:border-slate-900 animate-in fade-in zoom-in duration-200 ring-2 ring-emerald-400/60">
                        <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                        <span>Best Value for Growth</span>
                      </span>
                    </div>
                  ) : isRecommended ? (
                    <div className="absolute -top-4 inset-x-0 flex justify-center z-20">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0A4FD5] to-[#1E60E5] text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md shadow-blue-500/30 border border-white dark:border-slate-900 animate-in fade-in zoom-in duration-200">
                        <Star className="w-3.5 h-3.5 fill-[#84CC16] text-[#84CC16]" />
                        <span>Recommended For Your Scale</span>
                      </span>
                    </div>
                  ) : null}

                  {/* Card Header */}
                  <div className={`p-6 sm:p-7 ${isRecommended ? 'pt-8' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[#0B192C] dark:text-white tracking-tight flex items-center gap-2">
                          <span>{planName}</span>
                        </h3>
                        {plan.usersLimit && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#0A4FD5] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md mt-1">
                            <Users className="w-3 h-3" />
                            <span>{plan.usersLimit}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        {isPremiumBestValue ? (
                          <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 rounded-md">
                            BEST VALUE
                          </span>
                        ) : isRecommended ? (
                          <span className="text-[11px] font-bold text-[#65A30D] dark:text-[#84CC16] bg-lime-100 dark:bg-lime-950/80 border border-lime-200 dark:border-lime-800/60 px-2.5 py-1 rounded-md">
                            {t.common.recommended}
                          </span>
                        ) : plan.isPopular ? (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-md">
                            POPULAR
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 min-h-[38px] leading-relaxed">
                      {planDescription}
                    </p>

                    {/* Flat Rate Capacity & Zero Transaction Fees Indicator */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span>Included In Flat Rate:</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{limits ? `${limits.includedUsers} ${limits.includedUsers === 1 ? 'Seat' : 'Seats'}` : 'Custom'} • Unlimited Tx</span>
                        </span>
                      </div>

                      {/* Capacity status pill */}
                      {volumeCalc.capacityStatus === 'scaled' ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 text-[10px] font-semibold">
                          <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                          <span>{volumeCalc.capacityMessage}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[10px] font-semibold">
                          <Zap className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>Flat subscription • ₦0 transaction fees • Unlimited sales</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing Box with Recalculation Flash Effect and Animated Price Counter */}
                    <div
                      className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-300 ${
                        isCurrencyFlashing
                          ? 'bg-gradient-to-r from-blue-50/90 via-lime-50/50 to-blue-50/90 dark:from-blue-950/70 dark:via-blue-900/50 dark:to-blue-950/70 px-3 py-2 -mx-3 ring-1 ring-[#0A4FD5]/40 shadow-xs'
                          : ''
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-1 flex-wrap">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <AnimatedPriceDisplay
                            value={displayPrice}
                            currency={currency}
                            showTrendTooltip={!plan.customPricing}
                            showInlineBadge={!plan.customPricing}
                            tooltipAlign="left"
                            className="text-3xl sm:text-4xl font-black text-[#0B192C] dark:text-white tracking-tight hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors cursor-pointer"
                          />
                          {billingPeriodSubtext && (
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {billingPeriodSubtext}
                            </span>
                          )}
                        </div>

                        {/* Recalculation Flash Indicator Badge */}
                        {isCurrencyFlashing && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0A4FD5] dark:text-blue-300 bg-blue-100/90 dark:bg-blue-900/80 px-2 py-0.5 rounded-full animate-in fade-in zoom-in-95 duration-150">
                            <Sparkles className="w-2.5 h-2.5 text-[#0A4FD5] dark:text-blue-400" />
                            <span>{currency} Recalculated</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cycle Billed Total or Monthly indicator */}
                    <div className="mt-1 min-h-[20px] flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {cycleBilledText}
                      </span>

                      {/* VAT Information Tooltip Icon (Nigerian 7.5% Statutory VAT Breakdown) */}
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onMouseEnter={() => setActiveVatTooltip(plan.id)}
                          onMouseLeave={() => setActiveVatTooltip(null)}
                          onClick={() => setActiveVatTooltip(activeVatTooltip === plan.id ? null : plan.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#0A4FD5] dark:text-slate-400 dark:hover:text-blue-400 cursor-help"
                          title="View 7.5% VAT calculation"
                        >
                          <span>+ 7.5% VAT</span>
                          <Info className="w-3 h-3 text-blue-500" />
                        </button>

                        {/* Interactive VAT Breakdown Popover */}
                        {activeVatTooltip === plan.id && (
                          <div className="absolute bottom-full right-0 mb-2 z-40 w-72 p-3.5 bg-slate-900 dark:bg-[#071324] text-white text-xs rounded-xl shadow-2xl border border-slate-700 dark:border-blue-900/70 animate-in fade-in duration-150">
                            <div className="font-bold text-lime-400 mb-1 flex items-center justify-between">
                              <span>Nigerian VAT Statutory Breakdown</span>
                              <span className="text-[10px] bg-lime-400/20 text-lime-300 px-1.5 py-0.5 rounded">FIRS 7.5%</span>
                            </div>
                            
                            {isZeroPrice ? (
                              <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                                {plan.id === 'starter'
                                  ? 'The Starter plan operates on our 100% Free Usage Model. No VAT is assessed (₦0.00).'
                                  : 'Custom enterprise contracts include bespoke tax agreements and withholding tax schedules.'}
                              </p>
                            ) : (
                              <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                                <div className="flex justify-between text-slate-300">
                                  <span>Base Subscription (ex-VAT):</span>
                                  <span className="font-semibold">{formatCurrency(activeMonthlyRateNgn, currency)}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>7.5% Statutory VAT:</span>
                                  <span className="font-semibold text-lime-300">+{formatCurrency(vatAmountNgn, currency)}</span>
                                </div>
                                <div className="flex justify-between font-black text-white pt-1.5 border-t border-slate-800">
                                  <span>Gross Total (inc. VAT):</span>
                                  <span className="text-lime-400">{formatCurrency(totalWithVatNgn, currency)}/mo</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight pt-1">
                                  Pursuant to Section 4 of the VAT Act of Nigeria, all commercial B2B software subscriptions are subject to 7.5% VAT. Tax invoices with verified TIN are issued immediately upon payment.
                                </p>
                              </div>
                            )}
                            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-[#071324]" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Savings tag */}
                    {savingsText && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/50">
                        <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{savingsText}</span>
                      </div>
                    )}

                    {/* Price Lock Guarantee Badge & Hover Tooltip */}
                    {billingPeriod !== 'monthly' && (
                      <div className="mt-2 block">
                        <div className="relative group inline-block">
                          <div
                            tabIndex={0}
                            role="button"
                            aria-label="Price Lock Guarantee"
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#0A4FD5] dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-2.5 py-1 rounded-full border border-blue-200/80 dark:border-blue-800/60 transition-colors cursor-help"
                          >
                            <Lock className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400" />
                            <span>
                              {billingPeriod === 'yearly'
                                ? '24-Mo Price Lock'
                                : billingPeriod === 'bi-yearly'
                                ? '12-Mo Price Lock'
                                : '3-Mo Price Lock'}
                            </span>
                            <HelpCircle className="w-2.5 h-2.5 text-blue-400 dark:text-blue-500" />
                          </div>

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block group-focus:block z-30 w-60 p-3 bg-slate-900 dark:bg-[#071324] text-white text-[11px] rounded-xl shadow-xl border border-slate-700/80 dark:border-blue-900/60 pointer-events-none animate-in fade-in duration-150">
                            <div className="font-bold text-lime-400 mb-1 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                              <span>24-Month Price Freeze</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              Subscription price guaranteed for 24 months. Zero surprise inflation adjustments or price hikes throughout your contract.
                            </p>
                            <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-[#071324]" />
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Primary CTA Buttons */}
                  <div className="mt-6 space-y-2">
                    {plan.id === 'custom' ? (
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('enterprise-bulk-calculator');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 text-sm font-black py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white transition-all cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg"
                      >
                        <Calculator className="w-4 h-4 text-lime-400" />
                        <span>Configure Bulk Tier &amp; Custom Quote</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          openCheckout(
                            plan.id,
                            billingPeriod,
                            activeMonthlyRateNgn,
                            { users: currentUsers, transactions: currentTransactions }
                          )
                        }
                        className={`w-full inline-flex items-center justify-center gap-2 text-sm font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-md ${
                          isRecommended
                            ? 'bg-[#0A4FD5] hover:bg-[#07389B] text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5'
                            : 'bg-[#0B192C] dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>{plan.id === 'starter' ? 'Start Risk-Free Trial' : 'Subscribe with Selected Volume'}</span>
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            plan.id,
                            billingPeriod,
                            undefined,
                            activeMonthlyRateNgn,
                            { users: currentUsers, transactions: currentTransactions }
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        title="Add volume-scaled plan to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                        <span>Add to Cart</span>
                      </button>

                      {plan.id === 'custom' || plan.id === 'ultimate_prime' || plan.id === 'mega_org' ? (
                        <button
                          type="button"
                          onClick={onOpenDemoModal}
                          className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                          title="Book Enterprise Demo"
                        >
                          <span>Book Demo</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectPlan(plan.id)}
                          className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                          title="Start risk-free trial"
                        >
                          <span>Risk-Free Trial</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Chat with Sales on WhatsApp button */}
                    <a
                      href={getWhatsAppSalesUrl(plan.name, displayPrice, plan.usersLimit)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all shadow-xs group"
                      title={`Chat on WhatsApp with MsmeBooks sales team about ${plan.name} plan`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform" />
                      <span>Chat with Sales on WhatsApp</span>
                    </a>
                  </div>

                  <div className="text-center mt-2.5">
                    <a
                      href="#comparison"
                      className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Compare all {planName} features</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                {/* Feature Checklist with Key Feature Info Tooltips */}
                <div className="p-6 sm:p-7 pt-4 border-t border-slate-100/90 dark:border-slate-800 flex-1 flex flex-col justify-between bg-slate-50/40 dark:bg-[#091524]/60 rounded-b-2xl lg:rounded-b-3xl">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3.5">
                      Included in {planName}:
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      {(planFeatures as string[]).map((feature: string, idx: number) => {
                        const tooltipDetails = getFeatureTooltipDetails(feature, plan.featureTooltips);
                        const tooltipKey = `${plan.id}-${idx}`;
                        const isPinned = pinnedTooltip === tooltipKey;
                        const isHovered = hoveredTooltip === tooltipKey;
                        const isTooltipOpen = activeTooltip === tooltipKey;

                        return (
                          <li
                            key={idx}
                            className={`relative flex items-start justify-between gap-2 group/feat rounded-lg p-1.5 -mx-1.5 transition-colors contextual-tooltip-container ${
                              tooltipDetails ? 'hover:bg-blue-50/70 dark:hover:bg-blue-950/40' : ''
                            } ${isPinned ? 'bg-blue-50/90 dark:bg-blue-950/60 ring-1 ring-[#0A4FD5]/30 rounded-lg' : ''}`}
                          >
                            <div
                              onClick={() => {
                                if (tooltipDetails) {
                                  setPinnedTooltip(isPinned ? null : tooltipKey);
                                }
                              }}
                              onMouseEnter={() => {
                                if (tooltipDetails) {
                                  setHoveredTooltip(tooltipKey);
                                }
                              }}
                              onMouseLeave={() => {
                                if (tooltipDetails) {
                                  setHoveredTooltip(null);
                                }
                              }}
                              className={`flex items-start gap-2.5 flex-1 select-none ${
                                tooltipDetails ? 'cursor-pointer' : ''
                              }`}
                              title={tooltipDetails ? 'Click or hover to learn how this helps your SME' : undefined}
                            >
                              <div className="w-4 h-4 rounded-full bg-[#84CC16]/20 dark:bg-[#84CC16]/25 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                              <span
                                className={`leading-snug ${
                                  feature.startsWith('Everything in') ||
                                  feature.startsWith('All Starter') ||
                                  feature.startsWith('All Growth') ||
                                  feature.startsWith('All Business') ||
                                  feature.startsWith('All Premium') ||
                                  feature.startsWith('All Superior') ||
                                  feature.startsWith('All Ultimate') ||
                                  feature.startsWith('All Ultimate-Prime') ||
                                  feature.startsWith('All Mega-Org') ||
                                  feature.startsWith('Unlimited advance chart')
                                    ? 'font-bold text-[#0A4FD5] dark:text-blue-400'
                                    : ''
                                } ${
                                  tooltipDetails
                                    ? 'decoration-slate-300 dark:decoration-slate-600 underline decoration-dotted underline-offset-2 group-hover/feat:text-[#0A4FD5] dark:group-hover/feat:text-blue-300'
                                    : ''
                                }`}
                              >
                                {feature}
                              </span>
                            </div>

                            {/* Contextual Info Tooltip Icon for Complex Technical Terms */}
                            {tooltipDetails && (
                              <div className="relative shrink-0">
                                <button
                                  type="button"
                                  onMouseEnter={() => setHoveredTooltip(tooltipKey)}
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPinnedTooltip(isPinned ? null : tooltipKey);
                                  }}
                                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                                    isPinned
                                      ? 'text-[#0A4FD5] dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 ring-1 ring-blue-400/50'
                                      : 'text-slate-400 hover:text-[#0A4FD5] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                                  aria-label={`Contextual SME guide for ${feature}`}
                                  title="Click to lock explanation open"
                                >
                                  <Info className="w-3.5 h-3.5" />
                                </button>

                                {/* Contextual Tooltip Popover */}
                                {isTooltipOpen && (
                                  <div
                                    role="tooltip"
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute bottom-full right-0 sm:-right-4 mb-2 z-50 w-72 sm:w-80 p-3.5 bg-slate-950/95 dark:bg-[#071324]/98 backdrop-blur-md text-white text-xs rounded-2xl shadow-2xl border border-blue-500/40 dark:border-blue-700/60 animate-in fade-in zoom-in-95 duration-150 text-left pointer-events-auto"
                                  >
                                    {/* Header */}
                                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800 dark:border-slate-800/80">
                                      <div className="flex items-center gap-1.5 overflow-hidden">
                                        <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                                        <span className="font-bold text-slate-100 truncate text-[11px]">{feature}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                                          {tooltipDetails.category}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setPinnedTooltip(null);
                                            setHoveredTooltip(null);
                                          }}
                                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                          aria-label="Close explanation"
                                          title="Close"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Plain English Technical Explanation */}
                                    <p className="text-slate-200 leading-relaxed text-[11px] mb-2.5">
                                      {tooltipDetails.explanation}
                                    </p>

                                    {/* Why this matters for an SME Callout Box */}
                                    <div className="p-2.5 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-200">
                                      <div className="font-black text-[10px] uppercase tracking-wider text-lime-400 flex items-center gap-1 mb-1">
                                        <Lightbulb className="w-3 h-3 text-lime-400 shrink-0" />
                                        <span>Why this matters for your SME:</span>
                                      </div>
                                      <p className="text-[11px] text-slate-200 leading-normal">
                                        {tooltipDetails.whyItMatters}
                                      </p>
                                    </div>

                                    {/* Footer Info & Pin status */}
                                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                                      <span className="flex items-center gap-1">
                                        <Check className="w-3 h-3 text-lime-400" />
                                        <span>Included in {plan.name}</span>
                                      </span>
                                      <span className="text-slate-400 italic">
                                        {isPinned ? 'Pinned · Click ✕ to close' : 'Click to pin explanation'}
                                      </span>
                                    </div>

                                    {/* Indicator Arrow */}
                                    <div className="absolute top-full right-3 sm:right-6 -mt-1 border-4 border-transparent border-t-slate-950/95 dark:border-t-[#071324]/98" />
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Best for footer tip */}
                  <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Best for:{' '}
                    </span>
                    {planBestFor}
                  </div>
                </div>
              </div>
            );
          }))}
        </div>

        {/* Mobile Swipe-to-Scroll Dots Indicator */}
        <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
          {filteredPlans.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activePlanIndex === i ? 'w-6 bg-[#0A4FD5]' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={`Go to plan ${i + 1}`}
            />
          ))}
        </div>

        {/* Enterprise Bulk Tier Calculator Section (Massive Scale 50-1,000+ Seats) */}
        <EnterpriseBulkCalculator
          currency={currency}
          onOpenDemoModal={onOpenDemoModal}
          initialBillingPeriod={billingPeriod}
        />

        {/* Regional Payment Gateways by Country Banner */}
        <div className="mt-10 p-5 bg-gradient-to-r from-blue-50/80 via-slate-50 to-lime-50/60 dark:from-[#091B33] dark:via-[#071324] dark:to-[#081E22] rounded-2xl border border-blue-200/80 dark:border-slate-800 text-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-blue-200/50 dark:border-slate-800">
            <div>
              <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                <span>Multi-Region Payment Gateways • Scan to Pay QR & Instant Settlement</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pay in your local currency across Africa or globally with dynamic Scan to Pay QR codes (Paystack, Flutterwave, TransactPay, M-Pesa), 7.5% exclusive VAT statutory compliance, and automated tax invoices.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-300 font-extrabold px-2.5 py-1 rounded-full border border-blue-400/40 flex items-center gap-1">
                <span>📱</span> Scan to Pay QR Code Active
              </span>
              <span className="text-[10px] bg-lime-400/20 text-lime-700 dark:text-lime-300 font-extrabold px-2.5 py-1 rounded-full border border-lime-400/40">
                ⚡ Instant Digital Receipts & Tax Invoices
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 text-[11px]">
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <span>🇳🇬</span> Nigeria & West Africa
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Paystack, Flutterwave, OPay, PalmPay, Interswitch, Monnify, Hubtel, Wave
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                NIBSS NQR & Instant Debit
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <span>🇰🇪</span> East Africa
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                M-Pesa, Chapa (Ethiopia), Peach Payments, DPO Pay, Paystack EA
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Lipa Na M-Pesa & Telebirr QR
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <span>🇿🇦</span> South Africa & SADC
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Ozow Instant EFT, Yoco, Chipper Cash, Pesapal, TransactPay SA, Paystack SA
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                SnapScan, Capitec Pay & Masterpass
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <span>🌍</span> Other Africa Countries
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Fawry (Egypt), Payzone (Morocco), Wave, FedaPay, CinetPay, LigdiCash, Paynow
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Fawry Kiosks, Meeza & Mobile Wallets
              </span>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <span>🌐</span> Global & International
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Stripe, Adyen, Square, Klarna BNPL, Revolut Pay, Razorpay, PayPal, Mollie
              </p>
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                UPI QR, Klarna BNPL & Stripe Link
              </span>
            </div>
          </div>
        </div>

        {/* Reassurance Footer Bar under cards */}
        <div className="mt-6 p-4 sm:p-6 bg-slate-50 dark:bg-[#0D1C30] rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#65A30D] dark:text-[#84CC16]" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Need custom volume pricing, on-premise deployment, or multi-currency African billing?
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Sales%20Team%2C%20I%20would%20like%20to%20discuss%20custom%20volume%20pricing%20and%20onboarding%20options%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-extrabold text-xs transition-all shadow-xs"
              title="Chat with Sales Advisor on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
              <span>Chat with Sales on WhatsApp</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <a
              href="tel:+2349158482622"
              className="font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline"
            >
              Call +234 915 848 2622
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href="#enterprise-bulk-calculator"
              className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#0A4FD5] dark:hover:text-blue-400 cursor-pointer inline-flex items-center gap-1"
            >
              <span>Enterprise Bulk Tier &amp; Custom Quote →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
