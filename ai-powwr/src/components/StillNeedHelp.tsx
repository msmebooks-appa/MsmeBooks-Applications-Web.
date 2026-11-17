import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useI18n } from '../context/I18nContext';
import { PhoneCall, Headphones, Briefcase, Mail, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface StillNeedHelpProps {
  onOpenAiAssistant: () => void;
  onOpenLiveChat?: () => void;
}

export const StillNeedHelp: React.FC<StillNeedHelpProps> = ({ onOpenAiAssistant, onOpenLiveChat }) => {
  const { currencyInfo, formatFromUSD } = useCurrency();
  const { t } = useI18n();

  return (
    <section className="py-16 bg-[#17233D] text-white relative overflow-hidden" id="contact">
      {/* Background radial gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1254B5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B7E522]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header (Section 26) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#B7E522] text-xs font-bold uppercase tracking-wider mb-3">
            <Headphones className="w-3.5 h-3.5" />
            {t('help.badge', 'Direct Support Channels')} ({currencyInfo.code})
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t('help.title', "Still Have Questions? We're Here to Help.")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {t('help.description', 'Our team is ready to help you discover how MsmeBooks can simplify your accounting, sales, inventory, and business operations.')}
          </p>
        </div>

        {/* 3 Conversion Support Cards (Section 26) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Talk to Sales */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1254B5] text-white flex items-center justify-center mb-5 shadow-sm">
                <PhoneCall className="w-6 h-6 text-[#B7E522]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Talk to Sales</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Custom multi-branch plans from {formatFromUSD(15)}/mo with personalized product demonstrations.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="tel:+2349158482622"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1254B5] hover:bg-[#0A3D87] transition shadow-sm"
              >
                <span>Call Sales: +234 915 848 2622</span>
              </a>
              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Mon – Sat: 8:00 AM – 6:00 PM (WAT)
              </div>
            </div>
          </div>

          {/* Card 2: Get Technical Support */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B7E522]/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ring-1 ring-[#B7E522]/20">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B7E522] text-[#17233D] flex items-center justify-center mb-5 shadow-sm">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Get Technical Support</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  24/7 Portal
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Need immediate assistance with your account, POS hardware, offline synchronization, or software settings?
              </p>
            </div>

            <div className="space-y-2.5">
              {onOpenLiveChat && (
                <button
                  onClick={onOpenLiveChat}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-[#17233D] bg-[#B7E522] hover:bg-[#a2ce1d] transition shadow-sm cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-[#17233D]" />
                  <span>Chat with Live Support Agents</span>
                </button>
              )}
              <button
                onClick={onOpenAiAssistant}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <span>Ask AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B7E522]" />
              </button>
              <div className="text-center text-[11px] text-slate-400">
                24/7 Human Agents · Instant Response
              </div>
            </div>
          </div>

          {/* Card 3: Become a Partner */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-[#B7E522] flex items-center justify-center mb-5 border border-blue-500/30">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Become a Partner</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B7E522]/20 text-[#B7E522]">
                  Up to 40%
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Help African businesses digitize their records and earn generous recurring commissions (up to {formatFromUSD(3850, { compact: true })}/mo) across 4 partner tiers.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="#partners"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <span>Explore Partnerships</span>
                <ArrowRight className="w-4 h-4 text-[#B7E522]" />
              </a>
              <div className="text-center text-[11px] text-slate-400">
                For accountants, IT shops & consultants
              </div>
            </div>
          </div>
        </div>

        {/* Verified Support Hotline Footer Banner */}
        <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B7E522]" />
            <span>
              Official MsmeBooks Support Hotline: <strong>+2349158482622</strong> | Web: <strong>www.msmebooks.org</strong>
            </span>
          </div>
          <div className="text-slate-400">
            Serving Nigeria, Kenya, Ghana, South Africa, Rwanda, and Global Markets.
          </div>
        </div>
      </div>
    </section>
  );
};
