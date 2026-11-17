import React from 'react';
import { ArrowRight, Phone, Globe, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FinalCtaProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenTrial, onOpenDemo }) => {
  const { t } = useLanguage();

  return (
    <section id="final-cta" className="py-16 lg:py-24 bg-white dark:bg-[#070F1B] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B192C] via-[#0A4FD5] to-[#07389B] dark:from-[#050C16] dark:via-[#092868] dark:to-[#04132B] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-lime-400 text-xs font-bold border border-white/15 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              {t.common.instantSetup} • {t.pricing.moneyBackGuarantee}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t.finalCta.title}
            </h2>

            <p className="mt-5 text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
              {t.finalCta.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenTrial}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] text-base font-black px-8 py-4 rounded-xl shadow-xl shadow-lime-900/30 hover:shadow-2xl transition-all cursor-pointer group"
              >
                <span>{t.finalCta.startTrialBtn}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-base px-8 py-4 rounded-xl backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{t.finalCta.bookDemoBtn}</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="mt-8 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-blue-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-lime-400" /> {t.finalCta.reassurance1}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-lime-400" /> {t.finalCta.reassurance2}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-lime-400" /> {t.finalCta.reassurance3}
              </span>
            </div>

            {/* Direct Official Contact Bar */}
            <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-200">
              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white font-semibold transition-colors"
              >
                <Globe className="w-4 h-4 text-lime-400" />
                <span>www.msmebooks.org</span>
              </a>

              <span className="hidden sm:inline text-white/30">|</span>

              <a
                href="tel:+2349158482622"
                className="inline-flex items-center gap-2 hover:text-white font-semibold transition-colors"
              >
                <Phone className="w-4 h-4 text-lime-400" />
                <span>+234 915 848 2622</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
