import React from 'react';
import { ArrowRight, ShieldCheck, Check, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ClosingCtaProps {
  onContactSupportClick: () => void;
}

export const ClosingCta: React.FC<ClosingCtaProps> = ({ onContactSupportClick }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-blue-800/40 dark:border-slate-800 my-12">
      {/* Subtle brand glow geometry */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-lime-400 text-xs font-semibold tracking-wide border border-white/10">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span>{t('cta.badge', 'Commitment to Pan-African Enterprises')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
          {t('cta.title', 'Built on Trust. Backed by Transparency.')}
        </h2>

        <p className="text-base sm:text-lg text-slate-200 leading-relaxed text-balance max-w-2xl mx-auto">
          {t('cta.subtitle', 'At MsmeBooks, we are committed to providing dependable business management solutions, transparent billing practices, and responsive support to help businesses operate with confidence.')}
        </p>

        {/* 3 Value bullets */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>{t('cta.bullet1', 'Clear 30-day billing cycles')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>{t('cta.bullet2', 'Instant self-service cancellation')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-lime-400" />
            <span>{t('cta.bullet3', 'Verified human billing specialists')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://www.msmebooks.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-sm font-semibold text-blue-950 bg-lime-400 hover:bg-lime-300 active:bg-lime-500 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>{t('cta.getStarted', 'Get Started for Free')}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://www.msmebooks.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>{t('cta.explorePricing', 'Explore Pricing')}</span>
            <ExternalLink className="w-4 h-4 text-lime-400" />
          </a>

          <button
            onClick={onContactSupportClick}
            className="px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-transparent hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('cta.contact', 'Contact Support')}
          </button>
        </div>

      </div>
    </section>
  );
};
