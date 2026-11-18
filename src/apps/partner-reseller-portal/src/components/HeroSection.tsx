import React from 'react';
import { ArrowRight, CheckCircle2, FileText, TrendingUp, Users, DollarSign, Wallet } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenApply: () => void;
  onScrollToTiers: () => void;
  onScrollToAgreement: () => void;
  onOpenPortalDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenApply,
  onScrollToTiers,
  onScrollToAgreement,
  onOpenPortalDemo
}) => {
  const { formatMoney, currentCurrency } = useCurrency();
  const { t } = useLanguage();
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950 pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Subtle Background Geometric Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0046b808_1px,transparent_1px),linear-gradient(to_bottom,#0046b808_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#38bdf80a_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, Value Proposition & 3 CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Metadata Trust Marker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="text-[#0046B8] dark:text-blue-400 font-bold">
                {t('hero.badge.ecosystem', 'MsmeBooks Global Ecosystem')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t('hero.badge.regions', 'Africa & Worldwide')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-lime-700 dark:text-lime-400 font-bold">
                {t('hero.badge.commission', 'Up to 40% Recurring Commission')}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
              {t('hero.title.part1', 'Partner With MsmeBooks.')}{' '}
              <span className="text-[#0046B8] dark:text-blue-400">
                {t('hero.title.highlight1', 'Grow Your Business.')}
              </span>{' '}
              <span className="relative inline-block">
                <span>{t('hero.title.highlight2', 'Earn Recurring Revenue.')}</span>
                <span className="absolute bottom-1 left-0 w-full h-2.5 bg-lime-300/60 dark:bg-lime-500/30 -z-10 rounded-sm" />
              </span>
            </h1>

            {/* Supporting Headline */}
            <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-balance">
              {t(
                'hero.subtitle',
                'Join the MsmeBooks Global Partner Network and help businesses transform their accounting, point of sale, inventory, payroll and business operations while building sustainable recurring income.'
              )}
            </p>

            {/* Concrete Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {t(
                'hero.description',
                'Whether you’re an accountant, bookkeeper, consultant, POS agent, software reseller, technology company or business advisor, MsmeBooks provides the tools, technology and partnership opportunities to expand your services and grow your revenue.'
              )}
            </p>

            {/* 3 Prominent CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenApply}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-slate-900 bg-[#84CC16] hover:bg-[#74C011] active:scale-[0.98] rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <span>{t('hero.cta.becomePartner', 'Become a Partner Today')}</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </button>

              <button
                type="button"
                onClick={onScrollToTiers}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer"
              >
                <span>{t('hero.cta.exploreTiers', 'Explore Commission Tiers')}</span>
              </button>

              <button
                type="button"
                onClick={onScrollToAgreement}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#0046B8] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap cursor-pointer border border-transparent dark:border-blue-900/40"
              >
                <FileText className="w-4 h-4 text-[#0046B8] dark:text-blue-400" />
                <span>{t('hero.cta.reviewAgreement', 'Review Legal Agreement')}</span>
              </button>
            </div>

            {/* Regional Trust Markers & Quick Stats */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">40%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Tier Recurring</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#0046B8] dark:text-blue-400 tabular-nums">36+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Partner Categories</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">90-Day</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attribution Window</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Dashboard Preview + Collaboration Showcase */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Interactive Illustrative Dashboard Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
              
              {/* Header Bar */}
              <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-semibold text-slate-300">MsmeBooks Partner Portal</span>
                </div>
                {/* Illustrative Label */}
                <span className="text-[11px] font-medium text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 font-mono">
                  Illustrative Preview ({currentCurrency.code})
                </span>
              </div>

              {/* Body KPI strip */}
              <div className="p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
                
                {/* Top Partner Summary Pill */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Classification</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Chartered Accountant Partner</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-md">
                      Gold Tier · 30%
                    </span>
                  </div>
                </div>

                {/* 2-Column Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span className="text-xs font-medium">Monthly Commission</span>
                      <TrendingUp className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums font-mono">{formatMoney(2840)}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <span>+18.4% vs last mo</span>
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span className="text-xs font-medium">Active Subscriptions</span>
                      <Users className="w-4 h-4 text-[#0046B8] dark:text-blue-400" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">48 Clients</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Across 4 countries</p>
                  </div>
                </div>

                {/* Mini Live Referral Activity Rows */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Recent Customer Subscriptions</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Last 7 days</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Savannah Superstores</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Multi-Branch POS Suite · Kenya</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">+{formatMoney(54)}/mo</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Recurring</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Accra MedPlus Pharmacy</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Multi-Branch Suite · Ghana</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">+{formatMoney(63)}/mo</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Recurring</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Click to Launch Live Partner Dashboard Demo */}
                <button
                  type="button"
                  onClick={onOpenPortalDemo}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#0046B8] to-blue-700 hover:from-[#003893] hover:to-blue-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-lime-300" />
                  <span>{t('hero.cta.liveDemo', 'Launch Interactive Partner Dashboard View')}</span>
                </button>
              </div>

              {/* Footer Trust Bar */}
              <div className="bg-slate-100 dark:bg-slate-950/80 px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>Prorated Payouts on 25th</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">Settled in {currentCurrency.code} ({currentCurrency.name})</span>
              </div>
            </div>

            {/* African Business Collaboration Context Box */}
            <div className="bg-blue-900 dark:bg-slate-900 border border-transparent dark:border-blue-900/50 text-white p-4 rounded-xl shadow-sm flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-white/10 dark:bg-blue-950/80 flex items-center justify-center text-lime-300 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white text-sm">Pan-African & Global Business Network</p>
                <p className="text-blue-100/90 dark:text-slate-300 leading-tight mt-0.5">
                  Connecting certified accountants, POS dealers, and consultants with 50,000+ MSME merchants across Lagos, Nairobi, Johannesburg, Accra & Kigali.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
