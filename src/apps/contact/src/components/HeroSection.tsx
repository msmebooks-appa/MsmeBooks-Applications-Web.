import React from 'react';
import { Headset, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onContactClick: () => void;
  onDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick, onDemoClick }) => {
  const { formatAmount } = useCurrency();
  const { tDict } = useLanguage();

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] transition-colors">
      {/* Subtle brand decorative background grid & glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#f0f6ff] dark:bg-blue-900/30 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#f2f9eb] dark:bg-lime-900/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Inbound Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow Heading */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#f2f9eb] dark:bg-[#14290f] border border-[#d2edaa] dark:border-[#285217] text-xs font-bold text-[#4d8b20] dark:text-[#a1e670] uppercase tracking-wider mb-5 transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#70C038]" />
              {tDict.hero.badge}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight leading-[1.15] text-balance transition-colors">
              {tDict.hero.headline}
            </h1>

            {/* Supporting Description */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl transition-colors">
              {tDict.hero.subheadline}
            </p>

            {/* Primary CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* Contact Our Team — Corporate Blue */}
              <button
                onClick={onContactClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-sm font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-[#1D4ED8] dark:hover:bg-[#1E40AF] transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{tDict.hero.ctaContact}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Book a Free Demo — Lemon Green */}
              <button
                onClick={onDemoClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-sm font-bold text-slate-950 bg-[#70C038] hover:bg-[#5fa62c] hover:text-white transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{tDict.hero.ctaDemo}</span>
                <Sparkles className="w-4 h-4 text-slate-900" />
              </button>
            </div>

            {/* Additional Reassurance & Real-Time Currency Proof Strip */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 w-full transition-colors">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                {tDict.hero.quote}
              </p>

              {/* Dynamic Transaction & Revenue Volume Metrics in Current Currency */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white dark:bg-[#131E35] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f0f6ff] dark:bg-blue-950/60 border border-[#cbe0fb] dark:border-blue-900 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#0B3B82] dark:text-[#93C5FD]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block tracking-wider">
                      {tDict.hero.quarterlyVolume}
                    </span>
                    <span className="text-sm font-extrabold text-[#0B3B82] dark:text-[#93C5FD] font-mono tabular-nums">
                      {formatAmount(38500000, { compact: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f2f9eb] dark:bg-lime-950/40 border border-[#d2edaa] dark:border-lime-900 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#70C038]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block tracking-wider">
                      {tDict.hero.leakageRecovered}
                    </span>
                    <span className="text-sm font-extrabold text-[#3d701a] dark:text-[#a1e670] font-mono tabular-nums">
                      +{formatAmount(14800)}/yr
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#70C038]" />
                  {tDict.hero.badgeResponse}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-[#0B3B82] dark:text-[#93C5FD]" />
                  {tDict.hero.badgeTax}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Headset className="w-4 h-4 text-[#70C038]" />
                  {tDict.hero.badgeSupport}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic African Business Team Image with Floating Support Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative brand backdrops */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#0B3B82]/20 to-[#70C038]/30 dark:from-[#1D4ED8]/25 dark:to-[#70C038]/20 rounded-2xl filter blur-xl opacity-70 -z-10" />

              {/* High-fidelity photography container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-4/3 group">
                <img
                  src="/src/assets/images/hero_african_tech_team_1792327888460.jpg"
                  alt="Diverse team of African customer success professionals collaborating in a modern technology office"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Subtle bottom gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Overlay Customer-Support Card as requested */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 right-4 sm:right-auto sm:max-w-xs bg-white/95 dark:bg-[#131E35]/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3.5 z-20 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-[#f2f9eb] dark:bg-lime-950/50 flex items-center justify-center shrink-0 border border-[#d2edaa] dark:border-lime-900">
                  <Headset className="w-6 h-6 text-[#70C038]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Your Business Success Matters to Us.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Live consultants standing by across Africa
                  </p>
                </div>
              </div>

              {/* Secondary corner trust tag */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#0B3B82] dark:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg shadow-lg text-xs font-semibold items-center gap-1.5 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#70C038] animate-pulse" />
                <span>Pan-African Support Desk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
