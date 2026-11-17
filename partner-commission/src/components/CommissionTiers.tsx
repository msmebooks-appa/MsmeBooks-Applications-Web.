import React from 'react';
import { Check, Sparkles, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { PARTNER_TIERS } from '../data/partnerData';
import { PartnerTierId } from '../types/partner';
import { useLanguage } from '../context/LanguageContext';

interface CommissionTiersProps {
  onSelectTier: (tierId: PartnerTierId) => void;
}

export const CommissionTiers: React.FC<CommissionTiersProps> = ({ onSelectTier }) => {
  const { t } = useLanguage();
  return (
    <section id="tiers" className="py-20 lg:py-28 bg-[#F7FAFC] dark:bg-[#0B1528] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>{t('tiers.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            {t('tiers.title')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('tiers.subtitle')}
          </p>
        </div>

        {/* Four Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PARTNER_TIERS.map((tier) => {
            const isPopular = tier.isPopular;
            const isPlatinum = tier.id === 'platinum';

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-white dark:bg-[#101e35] border-2 border-[#1261B5] dark:border-[#B9E51C] shadow-xl ring-4 ring-[#1261B5]/10 dark:ring-[#B9E51C]/10 lg:-translate-y-2'
                    : 'bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular or Enterprise ribbon badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                        isPopular
                          ? 'bg-[#1261B5] text-white'
                          : 'bg-[#142D4E] text-[#B9E51C] border border-[#B9E51C]/30'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{tier.badge}</span>
                    </span>
                  </div>
                )}

                <div className="p-6 lg:p-7 space-y-6">
                  {/* Tier Title & Positioning */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#142D4E] dark:text-white">{tier.name}</h3>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {tier.positioning}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Commission Rate Showcase */}
                  <div className="pt-2 pb-3 border-y border-slate-100 dark:border-slate-700/70">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl lg:text-5xl font-extrabold text-[#142D4E] dark:text-white font-mono tracking-tight tabular-nums">
                        {tier.rateDisplay}
                      </span>
                      <span className="text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
                        Recurring
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                      On eligible monthly or annual subscriptions
                    </span>
                  </div>

                  {/* Target Audience */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0e1b30] p-3 rounded-lg border border-slate-100 dark:border-slate-700/60">
                    <strong className="text-[#142D4E] dark:text-white block mb-1">Target Partners:</strong>
                    <span>{tier.targetAudience}</span>
                  </div>

                  {/* Included Entitlements */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#142D4E] dark:text-white uppercase tracking-wider">
                      Included Entitlements
                    </p>
                    <ul className="space-y-2.5">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Proposed Program Features */}
                  <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Proposed Growth Features:</span>
                    </div>
                    <ul className="space-y-1.5">
                      {tier.proposedFeatures.map((feature, idx) => (
                        <li key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 relative">
                          <span className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-[#B9E51C]" />
                          <span>{feature}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">(Admin Approval)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={() => onSelectTier(tier.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-[#1261B5] hover:bg-[#0e4e94] text-white shadow-md shadow-[#1261B5]/25'
                        : isPlatinum
                        ? 'bg-[#142D4E] hover:bg-[#0c1c31] text-white dark:bg-[#B9E51C] dark:text-[#142D4E] dark:hover:bg-[#aadc14]'
                        : 'bg-white hover:bg-slate-50 text-[#1261B5] border border-slate-300 dark:bg-transparent dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{tier.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compliance & Policy Footnote */}
        <div className="mt-12 bg-white dark:bg-[#14233c] rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#142D4E] dark:text-white">Program Governance Notice:</strong> Commission percentages (15%, 20%, 30%, 40%) represent the established core tier rates. Additional proposed benefits, co-marketing subsidies, and qualification thresholds are subject to partner agreement terms and administrative approval. No mandatory fees or automatic lock-ins apply.
            </p>
          </div>
          <a
            href="#comparison"
            className="text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] hover:underline whitespace-nowrap shrink-0"
          >
            View Full Tier Matrix &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
