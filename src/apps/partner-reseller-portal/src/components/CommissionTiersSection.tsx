import React from 'react';
import { PARTNER_LEVELS } from '../data/categoriesData';
import { Check, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CommissionTiersSectionProps {
  onOpenApply: () => void;
  onScrollToCalculator: () => void;
}

export const CommissionTiersSection: React.FC<CommissionTiersSectionProps> = ({
  onOpenApply,
  onScrollToCalculator
}) => {
  const { t } = useLanguage();
  return (
    <section id="commission-tiers" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-blue-400">
            <span>Section 02</span>
            <span aria-hidden="true">·</span>
            <span>{t('tiers.badge', 'Progressive Earnings Architecture')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('tiers.title', 'Transparent Recurring Commission Structure')}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t(
              'tiers.subtitle',
              'Earn reliable recurring revenue on every active subscription, implementation service fee, and marketplace extension for the entire customer lifecycle.'
            )}
          </p>
        </div>

        {/* 4 Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNER_LEVELS.map((tier) => {
            const isGold = tier.name === 'Gold';
            const isPlatinum = tier.name === 'Platinum';

            return (
              <div
                key={tier.name}
                className={`rounded-2xl border flex flex-col justify-between p-6 transition-all duration-200 relative ${
                  isGold
                    ? 'border-[#0046B8] dark:border-blue-500/50 bg-blue-50/30 dark:bg-slate-900 shadow-lg ring-1 ring-[#0046B8]/20 dark:ring-blue-500/20'
                    : isPlatinum
                    ? 'border-slate-800 dark:border-slate-700 bg-slate-900 dark:bg-slate-900/90 text-white shadow-xl'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                }`}
              >
                {/* Most Popular Highlight for Gold */}
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-extrabold text-slate-900 bg-[#84CC16] px-3 py-0.5 rounded-full shadow-xs">
                      Most Selected by Firms
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  
                  {/* Tier Title & Audience */}
                  <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isPlatinum ? 'text-lime-300' : 'text-[#0046B8] dark:text-blue-400'}`}>
                      Level {tier.name === 'Bronze' ? '01' : tier.name === 'Silver' ? '02' : tier.name === 'Gold' ? '03' : '04'}
                    </p>
                    <h3 className={`text-2xl font-black tracking-tight mt-1 ${isPlatinum ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {tier.name} Partner
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isPlatinum ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {tier.targetAudience}
                    </p>
                  </div>

                  {/* Commission Rate Callout */}
                  <div className="py-2">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold tabular-nums tracking-tight ${isPlatinum ? 'text-lime-400' : 'text-[#0046B8] dark:text-lime-400'}`}>
                        {tier.commissionRate}%
                      </span>
                      <span className={`text-xs font-semibold ${isPlatinum ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        Recurring
                      </span>
                    </div>
                    <p className={`text-xs mt-1 font-medium ${isPlatinum ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      On eligible customer subscriptions
                    </p>
                  </div>

                  {/* Qualification Requirement Box */}
                  <div className={`p-3 rounded-xl text-xs space-y-1 ${
                    isPlatinum
                      ? 'bg-slate-800 dark:bg-slate-800/80 border border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800'
                  }`}>
                    <p className={`font-bold ${isPlatinum ? 'text-slate-200' : 'text-slate-800 dark:text-slate-200'}`}>
                      Active Account Baseline:
                    </p>
                    <p className={isPlatinum ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}>
                      {tier.qualifications}
                    </p>
                  </div>

                  {/* Benefits Checklist */}
                  <div className="space-y-2 pt-2">
                    <p className={`text-xs font-bold ${isPlatinum ? 'text-slate-200' : 'text-slate-800 dark:text-slate-200'}`}>
                      Included Privileges:
                    </p>
                    <ul className="space-y-2 text-xs">
                      {tier.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPlatinum ? 'text-lime-400' : 'text-lime-600 dark:text-lime-400'}`} />
                          <span className={isPlatinum ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Tier CTA */}
                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onOpenApply}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPlatinum
                        ? 'bg-[#84CC16] hover:bg-[#74C011] text-slate-900 shadow-md'
                        : isGold
                        ? 'bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>Apply for {tier.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Commercial Rules & Legal Disclaimers Banner */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 transition-colors">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#0046B8] dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Important Commercial Governance Rules & Commission Schedule Notice
              </h4>
              <p>
                1. <strong>Non-Guaranteed Earnings:</strong> Commission percentages represent contractual revenue sharing formulas applied to Net Subscription Revenue collected. Commissions are not guaranteed wages, salaries, or investment returns.
              </p>
              <p>
                2. <strong>Governing Instrument:</strong> Final commission entitlement, tier qualification, quarterly reclassification, payment cycles, and deductions for taxes, chargebacks, and cancellations are governed strictly by the executed Master Partner Agreement and Schedule B.
              </p>
              <p>
                3. <strong>Qualification Reviews:</strong> Elevation to Silver, Gold, or Platinum status requires formal verification of active Qualified Customer accounts and cannot be unilaterally assumed upon application.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onScrollToCalculator}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:underline"
            >
              <span>Test Interactive Earnings Scenarios in the Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
