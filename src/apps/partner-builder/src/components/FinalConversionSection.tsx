import React from 'react';
import { ArrowRight, MessageCircle, CheckCircle, ShieldCheck, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FinalConversionSectionProps {
  onOpenApply: () => void;
}

export const FinalConversionSection: React.FC<FinalConversionSectionProps> = ({ onOpenApply }) => {
  const { t } = useLanguage();
  const whatsappNumber = '+2349158482622';
  const whatsappUrl = `https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Partnership%20Team,%20I%20am%20interested%20in%20becoming%20an%20official%20partner.`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061F4A] via-[#0A3981] to-[#041430] dark:from-[#031129] dark:via-[#061F4A] dark:to-[#020b1a] text-white py-20 lg:py-28 transition-colors">
      {/* Decorative Brand Circles and Grid */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#8CE600]/10 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-500/10 filter blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Lemon Accent Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/15 text-[#8CE600] border border-[#8CE600]/30 text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4 text-[#8CE600]" />
          <span>Pan-African SaaS Expansion Programme</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 text-balance">
          {t('cta.title', 'Grow with MsmeBooks. Build a Profitable Partnership.')}
        </h2>

        <p className="text-base sm:text-xl text-blue-100 dark:text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          {t('cta.desc', 'Join a growing ecosystem of technology professionals, accountants, consultants, resellers, and business advisors helping enterprises succeed with smarter business management technology.')}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onOpenApply}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] active:bg-[#7bc800] rounded-xl shadow-xl shadow-[#8CE600]/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
          >
            {t('cta.button', 'Apply to Become a Partner')}
            <ArrowRight className="w-4 h-4 text-[#061F4A]" />
          </button>

          <a
            href="#categories"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 text-base font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all whitespace-nowrap"
          >
            Explore Partner Opportunities
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Partnership Desk ({whatsappNumber})
          </a>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs sm:text-sm text-blue-200 pt-6 border-t border-white/10">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#8CE600]" />
            Free Onboarding & Sandbox Accounts
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#8CE600]" />
            15%–40% Recurring Monthly Commissions
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#8CE600]" />
            Verifiable Digital Partner Badges
          </span>
        </div>
      </div>
    </section>
  );
};
