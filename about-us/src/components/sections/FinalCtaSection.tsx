import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Check, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenDemo: () => void;
  onOpenGetStarted: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenDemo,
  onOpenGetStarted,
}) => {
  const { t } = useLanguage();

  return (
    <section id="cta" className="py-20 md:py-28 bg-[#0B4EA2] dark:bg-black text-white relative overflow-hidden border-t border-[#0B4EA2] dark:border-zinc-900 transition-colors duration-200">
      {/* Decorative background subtle gradients */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime-400/15 dark:bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-lime-400 uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
          <span>{t.cta_eyebrow}</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto text-balance">
          {t.cta_title_1}{' '}
          <span className="text-lime-400">{t.cta_title_2}</span>
        </h2>

        {/* Supporting Text */}
        <p className="mt-5 text-base sm:text-lg text-blue-100 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.cta_desc}
        </p>

        {/* 3 CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {/* Primary CTA */}
          <button
            onClick={onOpenGetStarted}
            className="px-8 py-4 bg-lime-400 text-slate-950 font-bold rounded-xl hover:bg-lime-300 transition-all duration-150 text-sm shadow-lg cursor-pointer flex items-center gap-2"
          >
            <span>{t.cta_btn_primary}</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onOpenDemo}
            className="px-7 py-4 bg-white/10 dark:bg-zinc-900 hover:bg-white/20 dark:hover:bg-zinc-800 border border-white/25 dark:border-zinc-700 text-white font-semibold rounded-xl transition-all duration-150 text-sm cursor-pointer flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-lime-400" />
            <span>{t.cta_btn_secondary}</span>
          </button>

          {/* Third CTA */}
          <a
            href="#what-we-do"
            className="px-6 py-4 text-white hover:text-lime-300 font-medium text-sm transition-colors cursor-pointer"
          >
            {t.cta_btn_third}
          </a>
        </div>

        {/* Quiet Reassurance Badges */}
        <div className="mt-12 pt-8 border-t border-white/15 dark:border-zinc-800 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-blue-100 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>{t.cta_badge_1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>{t.cta_badge_2}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>{t.cta_badge_3}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
