import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Building, 
  Users, 
  HelpCircle,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { BillingCycle, CurrencyCode, PricingPlan } from '../types';
import { PRICING_PLANS } from '../data/mockData';
import { formatPrice } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface SubscriptionPlansProps {
  selectedCurrency: CurrencyCode;
  onSelectPlan: (plan: PricingPlan, cycle: BillingCycle) => void;
  onRequestEnterpriseQuote: () => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  selectedCurrency,
  onSelectPlan,
  onRequestEnterpriseQuote,
}) => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            {t.plans.pill}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            {t.plans.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t.plans.subtitle} ({selectedCurrency}).
          </p>

          {/* Billing Cycle Switcher with Discount Badges */}
          <div className="pt-4 flex justify-center">
            <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.plans.monthly}
              </button>
              <button
                onClick={() => setBillingCycle('quarterly')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'quarterly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{t.plans.quarterly}</span>
              </button>
              <button
                onClick={() => setBillingCycle('bi-yearly')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'bi-yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{t.plans.biYearly}</span>
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-slate-950 shadow-md shadow-lime-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{t.plans.annual}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (4 Plans) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isEnterprise = plan.id === 'enterprise';
            const price = plan.basePriceUSD[billingCycle];

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-lime-500 dark:border-lime-400 shadow-xl dark:shadow-2xl shadow-lime-500/10 scale-102 lg:-translate-y-2'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs dark:shadow-none hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* Popular / Feature Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-lime-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold font-grotesk text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-2 border-y border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
                        {formatPrice(price, selectedCurrency)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {t.plans.perMonth}
                      </span>
                    </div>
                    {billingCycle !== 'monthly' && (
                      <div className="text-[11px] text-lime-700 dark:text-lime-400 font-semibold mt-1">
                        {billingCycle === 'annual' 
                          ? '20% ' + t.plans.saveApplied 
                          : billingCycle === 'bi-yearly'
                            ? '12% ' + t.plans.saveApplied
                            : '5% ' + t.plans.saveApplied}
                      </div>
                    )}
                  </div>

                  {/* Target Scale Limits */}
                  <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t.plans.standardScale}
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {plan.targetAudience}
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                      Reporting: {plan.limits.reportsFrequency}
                    </div>
                  </div>

                  {/* Included Features List */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                      {t.plans.included}
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded Features (Transparency) */}
                  {plan.excludedFeatures.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t.plans.excluded}
                      </div>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {plan.excludedFeatures.map((ex, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/80">
                  {isEnterprise ? (
                    <button
                      onClick={onRequestEnterpriseQuote}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{t.plans.enterpriseBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectPlan(plan, billingCycle)}
                      className={`w-full py-3 font-extrabold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        plan.isPopular
                          ? 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-500/25'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <span>{t.plans.subscribeBtn} {plan.name.split('—')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Pricing Guarantee Footnote */}
        <div className="mt-12 bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300 shadow-xs dark:shadow-none">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-lime-600 dark:text-lime-400 shrink-0" />
            <div>
              {t.plans.footnote}
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('calculator');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-600 transition cursor-pointer"
          >
            {t.plans.calcCustomBtn}
          </button>
        </div>

      </div>
    </section>
  );
};
