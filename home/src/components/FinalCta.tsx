import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FinalCtaProps {
  onOpenStartFree: () => void;
  onOpenBookDemo: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenStartFree, onOpenBookDemo }) => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-[#0866FF] dark:bg-[#091536] text-white relative overflow-hidden transition-colors duration-200 border-t dark:border-slate-800">
      {/* Decorative Accent Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B7F000]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#09122C]/40 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-[#B7F000] text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Join the Modern African Business Revolution</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight">
          {t.cta.title}
        </h2>

        <p className="text-base sm:text-xl text-blue-100 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.cta.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenStartFree}
            className="px-8 py-4 rounded-xl bg-[#B7F000] hover:bg-[#a6d900] text-slate-950 font-black text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>{t.cta.startTrialBtn}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={onOpenBookDemo}
            className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/25 transition-all inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#B7F000]" />
            <span>{t.cta.requestDemoBtn}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
            Cancel anytime with 1 click
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
            Free onboarding &amp; data migration
          </span>
          <span className="flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-[#B7F000]" />
            Local African WhatsApp &amp; phone support
          </span>
        </div>
      </div>
    </section>
  );
};
