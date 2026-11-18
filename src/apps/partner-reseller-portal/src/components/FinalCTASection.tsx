import React from 'react';
import { ArrowRight, FileText, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FinalCTASectionProps {
  onOpenApply: () => void;
  onScrollToAgreement: () => void;
  onOpenContact: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onOpenApply,
  onScrollToAgreement,
  onOpenContact
}) => {
  const { t } = useLanguage();
  return (
    <section id="cta" className="bg-gradient-to-br from-[#003893] via-[#0046B8] to-[#0A3C96] dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/80 text-white py-20 lg:py-24 relative overflow-hidden border-t border-transparent dark:border-slate-800 transition-colors duration-200">
      {/* Background Subtle Geometric Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
        
        {/* Unboxed Metadata Tag */}
        <div className="inline-flex items-center gap-2 text-xs font-bold text-lime-300">
          <span>Global Partner Network</span>
          <span aria-hidden="true">·</span>
          <span>Pan-African Footprint</span>
          <span aria-hidden="true">·</span>
          <span>Official Programme</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight text-balance">
          {t('cta.title', 'Ready to Expand Your Practice and Revenue with MsmeBooks?')}
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed text-balance">
          {t(
            'cta.subtitle',
            'Join hundreds of accountants, advisors, and technology providers empowering SMEs across Africa and internationally.'
          )}
        </p>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {/* Primary CTA (Lemon Green) */}
          <button
            type="button"
            onClick={onOpenApply}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-black text-slate-900 bg-[#84CC16] hover:bg-[#74C011] active:scale-[0.98] rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap cursor-pointer"
          >
            <span>{t('cta.primary', 'Apply to Become a Partner')}</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>

          {/* Secondary CTA (White border) */}
          <button
            type="button"
            onClick={onScrollToAgreement}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4 text-lime-300" />
            <span>{t('cta.secondary', 'Review Agreement Terms')}</span>
          </button>

          {/* Third CTA (Contact) */}
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-blue-100 hover:text-white hover:bg-white/10 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>{t('cta.support', 'Contact Partner Alliance Desk')}</span>
          </button>
        </div>

        {/* Official Website & Regional Trust Line */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200 gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-lime-300" />
            <span>Official Portal: </span>
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:underline"
            >
              www.msmebooks.org
            </a>
          </div>

          <div className="flex items-center gap-4 text-blue-200">
            <span>Direct Inquiries: partnerships@msmebooks.org</span>
            <span aria-hidden="true">·</span>
            <span>24/7 SLA Partner Desk</span>
          </div>
        </div>

      </div>
    </section>
  );
};
