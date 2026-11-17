import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Check, TrendingUp, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onOpenGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemo, onOpenGetStarted }) => {
  const { currentCurrency, formatFromNGN } = useCurrency();
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-white dark:bg-black transition-colors duration-200">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-50/60 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-lime-50/50 dark:bg-lime-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Narrative & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clean unboxed eyebrow with lemon-green indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              <span>{t.hero_eyebrow}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">{t.hero_eyebrow_sub}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
              {t.hero_title_1}{' '}
              <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.hero_title_2}</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t.hero_desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#what-we-do"
                className="px-6 py-3.5 bg-[#0B4EA2] text-white rounded-xl font-semibold hover:bg-[#083770] shadow-sm transition-all duration-150 flex items-center gap-2.5 text-sm cursor-pointer"
              >
                <span>{t.hero_cta_discover}</span>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </a>

              <button
                onClick={onOpenGetStarted}
                className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 transition-all duration-150 text-sm cursor-pointer flex items-center gap-2"
              >
                <span>{t.hero_cta_start}</span>
                <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              </button>
            </div>

            {/* Quiet Trust Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-xl text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="block font-bold text-slate-900 dark:text-white text-sm">{t.hero_trust_allinone}</span>
                <span className="text-slate-500 dark:text-slate-400">{t.hero_trust_allinone_sub}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white text-sm">{t.hero_trust_multibranch}</span>
                <span className="text-slate-500 dark:text-slate-400">{t.hero_trust_multibranch_sub}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white text-sm">{t.hero_trust_security}</span>
                <span className="text-slate-500 dark:text-slate-400">{t.hero_trust_security_sub}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-900">
              
              {/* Authentic Pan-African Professional Image */}
              <img
                src="/src/assets/images/hero_african_entrepreneurs_tech_1792324718011.jpg"
                alt="African business professionals and entrepreneurs collaborating in a modern office"
                className="w-full h-[430px] object-cover object-center"
                referrerPolicy="no-referrer"
                loading="eager"
              />

              {/* Gradient scrim for legibility of floating UI */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating UI Card 1: Top Right Live Financial Snapshot */}
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/60 dark:border-zinc-800 max-w-[210px]">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-medium">{t.hero_floating_rev}</span>
                  <span className="text-[#65A30D] dark:text-[#84CC16] font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +28.4%
                  </span>
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {formatFromNGN(18450800)}
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#84CC16] h-full rounded-full w-[78%]"></div>
                </div>
              </div>

              {/* Floating UI Card 2: Bottom Overlay Connected Modules */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-white/80 dark:border-zinc-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#0B4EA2] text-white flex items-center justify-center">
                      <Layers className="w-3 h-3" />
                    </div>
                    <span>{t.hero_floating_engine}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#65A30D] dark:text-[#84CC16] flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
                    {t.hero_floating_connected}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2.5 text-center text-[11px]">
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-zinc-900">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">{t.hero_floating_pos}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatFromNGN(742500)}</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 dark:bg-zinc-900">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">{t.hero_floating_inventory}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.hero_floating_warehouses}</span>
                  </div>
                  <div className="p-1.5 rounded bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                    <span className="text-[#0B4EA2] dark:text-[#38BDF8] block text-[10px]">{t.hero_floating_reconciled}</span>
                    <span className="font-semibold text-[#0B4EA2] dark:text-[#38BDF8]">{t.hero_floating_sync}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Decorative brand corner badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#0B4EA2] text-white px-4 py-2.5 rounded-xl shadow-lg border-2 border-white dark:border-slate-800 items-center gap-2 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              <span>{t.hero_floating_badge}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
