import React from 'react';
import { ArrowRight, CheckCircle2, Calculator, TrendingUp, Users } from 'lucide-react';
import heroImg from '../assets/images/hero_african_consultants_1792762385237.jpg';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenApplyModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApplyModal }) => {
  const { formatFromNGN } = useCurrency();
  const { t } = useLanguage();
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#F7FAFC] via-white to-[#F7FAFC] dark:from-[#0B1528] dark:via-[#0E1A30] dark:to-[#0B1528] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#1261B5]/5 dark:bg-[#1261B5]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#B9E51C]/10 dark:bg-[#B9E51C]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Top brand kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#142D4E] dark:text-slate-200 tracking-wide uppercase">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#B9E51C]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#142D4E] dark:text-white tracking-tight leading-[1.12] text-balance">
              {t('hero.title')}{' '}
              <span className="text-[#1261B5] dark:text-[#B9E51C] underline decoration-[#B9E51C] dark:decoration-[#1261B5] decoration-4 underline-offset-4">
                {t('hero.titleAccent')}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Supporting Benefits List */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong className="text-[#142D4E] dark:text-white">Earn 15%–40% recurring commissions</strong> based on your partner level (Bronze, Silver, Gold, Platinum).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong className="text-[#142D4E] dark:text-white">Generate revenue</strong> from eligible customer subscriptions month after month.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong className="text-[#142D4E] dark:text-white">Track referrals, earnings, and payouts</strong> in one intuitive partner dashboard.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong className="text-[#142D4E] dark:text-white">Access sales resources, training, and partner support</strong> to close and onboard clients.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong className="text-[#142D4E] dark:text-white">Grow your partnership</strong> as your client network and transaction volumes expand.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenApplyModal}
                className="px-7 py-3.5 text-base font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-[#1261B5]/30 flex items-center gap-2.5 whitespace-nowrap"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#calculator"
                className="px-6 py-3.5 text-base font-semibold text-[#142D4E] dark:text-white bg-white dark:bg-[#14233c] hover:bg-slate-50 dark:hover:bg-[#1c3052] border border-slate-300 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Calculator className="w-5 h-5 text-[#1261B5] dark:text-[#B9E51C]" />
                <span>Calculate Your Earnings</span>
              </a>

              <a
                href="#tiers"
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#1261B5] dark:hover:text-[#B9E51C] px-2 py-3 transition-colors flex items-center gap-1"
              >
                <span>Explore Partner Benefits</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            {/* Editorial trust note */}
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero registration fees · Immediate partner portal access · Verified local currency payouts</span>
            </div>
          </div>

          {/* Right Column: Hero Visual with Real Photography & Floating Analytics */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Image Container with subtle border */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl bg-slate-900 group">
                <img
                  src={heroImg}
                  alt="African business consultant meeting SME owners with MsmeBooks accounting software"
                  className="w-full h-[460px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />

                {/* Bottom caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#B9E51C]">Ace Advisory & Consulting</p>
                      <p className="text-xs text-slate-200">Onboarding Lagos Retail Merchant to MsmeBooks POS</p>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-white">
                      Gold Partner · 30%
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Top Right - Monthly Commission */}
              <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 bg-white dark:bg-[#14233c] p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20">
                <div className="w-11 h-11 rounded-lg bg-[#B9E51C]/30 flex items-center justify-center text-[#142D4E] dark:text-[#B9E51C]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Approved Monthly Payout
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">
                      {formatFromNGN(1420000)}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      +28% MoM
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Bottom Left - Active Subscriptions */}
              <div className="absolute -bottom-8 -left-6 hidden sm:flex items-center gap-3 bg-white dark:bg-[#14233c] p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20">
                <div className="w-11 h-11 rounded-lg bg-[#1261B5] flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Attributed Clients
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">
                      58 Active
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      (98.4% Retention)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metrics & Proof Strip below hero */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1261B5] dark:text-[#B9E51C] font-mono tabular-nums">15% – 40%</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Recurring Commission Tiers</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">1,400+</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Certified Partners Active</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">18 Countries</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Across Africa & Global</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#14233c] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1261B5] dark:text-[#B9E51C] font-mono tabular-nums">₦120M+</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Commissions Disbursed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
