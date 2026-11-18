import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES, PRICING_PLANS } from '../data/mockData';

interface PricingSectionProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
}) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fair, Transparent Pan-African Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Simple, Transparent Pricing for Growing Businesses
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Choose a plan that fits your business stage. Every tier comes with a 14-day risk-free trial, free onboarding, and local currency billing across Africa.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={`text-xs sm:text-sm font-bold ${
                billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-8 rounded-full bg-slate-900 dark:bg-slate-800 p-1 relative transition-colors focus:outline-none"
              aria-label="Toggle Billing Cycle"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#B7F000] transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs sm:text-sm font-bold ${
                  billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                Annual Billing
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#B7F000] text-slate-950">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch mb-14">
          {PRICING_PLANS.map((plan) => {
            const isAnnual = billingCycle === 'annual';
            const rawPrice = isAnnual ? plan.annualPriceNGN : plan.monthlyPriceNGN;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 relative ${
                  plan.isPopular
                    ? 'bg-slate-950 text-white shadow-2xl border-2 border-[#0866FF] ring-4 ring-[#0866FF]/10'
                    : 'bg-slate-50/70 dark:bg-[#0E172A] border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-[#131D31] hover:shadow-lg'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0866FF] to-blue-500 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold font-display">{plan.name}</h3>
                      {plan.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          plan.isPopular ? 'bg-[#B7F000] text-slate-950' : 'bg-blue-100 dark:bg-blue-950 text-[#0866FF] dark:text-blue-300'
                        }`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${plan.isPopular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-slate-200/40 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono">
                        {currency.format(rawPrice)}
                      </span>
                      <span className={`text-xs font-semibold ${plan.isPopular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        /month
                      </span>
                    </div>
                    <div className={`text-[11px] mt-1 font-medium ${plan.isPopular ? 'text-[#B7F000]' : 'text-[#0866FF] dark:text-blue-400'}`}>
                      {isAnnual ? 'Billed annually (20% off)' : 'Billed on a monthly basis'}
                    </div>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-2.5 text-xs">
                    <span className={`font-bold uppercase tracking-wider text-[10px] ${
                      plan.isPopular ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      Included Features:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.isPopular ? 'text-[#B7F000]' : 'text-[#0866FF] dark:text-[#B7F000]'
                          }`}
                        />
                        <span className={plan.isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  {plan.id === 'enterprise' ? (
                    <button
                      onClick={onOpenBookDemo}
                      className="w-full py-3.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onOpenStartFree}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                        plan.isPopular
                          ? 'bg-[#0866FF] hover:bg-[#0752D4] text-white shadow-blue-500/30'
                          : 'bg-slate-900 dark:bg-[#0866FF] hover:bg-slate-800 dark:hover:bg-[#0752D4] text-white'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Money-Back Guarantee Strip */}
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium text-center">
          <ShieldCheck className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
          <span>
            <strong>14-Day Risk-Free Trial:</strong> No credit card required. Free live onboarding with an accounting specialist. Cancel anytime with 1 click.
          </span>
        </div>
      </div>
    </section>
  );
};
