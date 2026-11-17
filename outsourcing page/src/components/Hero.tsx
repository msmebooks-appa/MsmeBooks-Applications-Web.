import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Building, 
  FileCheck2, 
  PhoneCall, 
  Layers,
  ChevronRight,
  Receipt,
  Clock
} from 'lucide-react';
import { CountryInfo, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  selectedCountry: CountryInfo;
  selectedCurrency: CurrencyCode;
  onExploreServices: () => void;
  onViewPlans: () => void;
  onBookConsultation: () => void;
  onBecomePartner: () => void;
  onOpenPortal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCountry,
  selectedCurrency,
  onExploreServices,
  onViewPlans,
  onBookConsultation,
  onBecomePartner,
  onOpenPortal,
}) => {
  const { t } = useLanguage();
  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pt-10 pb-20 overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Background subtle visual glows in MsmeBooks Blue and Lemon Green */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center sm:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400"></span>
            <span className="font-semibold text-lime-700 dark:text-lime-400 uppercase tracking-wider text-[11px]">
              {t.hero.panAfricanLaunch}
            </span>
            <span className="text-slate-300 dark:text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
              {t.hero.completeOutsourcingFor} {selectedCountry.name} ({selectedCurrency})
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
            <div className="space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-md">
                {t.hero.headlineTag}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-grotesk leading-[1.1]">
                {t.hero.headlineLine1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-lime-600 dark:from-blue-400 dark:via-sky-300 dark:to-lime-300">
                  {t.hero.headlineHighlight}
                </span>{' '}
                {t.hero.headlineLine2}
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* Quick Country Highlight */}
            <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex items-center gap-3 max-w-xl">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">{t.hero.gatewaySupportTitle} </span>
                {t.hero.gatewaySupportDesc} <span className="font-bold text-lime-700 dark:text-lime-400">{selectedCountry.currency}</span> via{' '}
                <span className="underline decoration-blue-500 dark:decoration-blue-400 font-medium">{selectedCountry.defaultGateways.join(', ').toUpperCase()}</span>.
              </div>
            </div>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
              <button
                onClick={onViewPlans}
                className="px-6 py-3.5 bg-gradient-to-r from-lime-400 via-lime-500 to-lime-400 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-lime-500/25 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>{t.hero.viewPlans}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-700/30 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>{t.hero.exploreServices}</span>
                <Layers className="w-4 h-4 text-blue-100" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-5 py-3.5 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>{t.hero.bookConsultation}</span>
              </button>
            </div>

            {/* Secondary CTA */}
            <div className="pt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <span>{t.hero.partnerPrompt}</span>
              <button
                onClick={onBecomePartner}
                className="text-lime-600 dark:text-lime-400 hover:underline font-bold cursor-pointer"
              >
                {t.hero.partnerLink}
              </button>
            </div>

            {/* Interactive Trust Indicators */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{t.hero.trustIndicators.secureCloud}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                <span>{t.hero.trustIndicators.verifiedPros}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>{t.hero.trustIndicators.flexibleSubs}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.hero.trustIndicators.multiCurrency}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{t.hero.trustIndicators.auditReady}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                <span>{t.hero.trustIndicators.dedicatedSupport}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Realistic Live Outsourcing Operations Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-5 space-y-4 transition-colors duration-200">
              
              {/* Card Header simulating active client workspace */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    MB
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      Apex Retail Ventures Ltd
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Active: Growth Plan • Lagos & Nairobi
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenPortal}
                  className="px-2.5 py-1 text-[11px] font-semibold text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-950/70 border border-lime-300 dark:border-lime-800/80 rounded hover:bg-lime-200 dark:hover:bg-lime-900 transition cursor-pointer"
                >
                  Live Dashboard →
                </button>
              </div>

              {/* Assigned Service Pod Preview */}
              <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3 border border-slate-200 dark:border-slate-700/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Assigned Dedicated Lead</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold px-2 py-0.5 rounded">
                    Verified ICAN FCA
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Adeola Adeleke"
                    className="w-10 h-10 rounded-full object-cover border-2 border-lime-500 dark:border-lime-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Adeola Adeleke, FCA</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Lead Senior Accountant & Tax Advisor</div>
                  </div>
                </div>
              </div>

              {/* Service Status Matrix */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Oct Ledger Closing</span>
                    <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">94% Reconciled</div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-lime-500 dark:bg-lime-400 h-full w-[94%] rounded-full"></div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Payroll Run</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Disbursed</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    22 Staff Payslips Sent
                  </div>
                </div>
              </div>

              {/* Upcoming Compliance Deadline */}
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-200">
                      VAT & WHT Filing Schedule
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Statutory Due in 7 Days • Zero Penalties
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-lime-800 dark:text-lime-400 bg-lime-100 dark:bg-lime-950 px-2 py-0.5 rounded border border-lime-300 dark:border-lime-800">
                  On Track
                </span>
              </div>

              {/* Secure Multi-Currency Payment Widget Preview */}
              <div className="bg-slate-100 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span className="text-slate-700 dark:text-slate-300">Next Monthly Retainer:</span>
                </div>
                <span className="font-extrabold text-lime-700 dark:text-lime-400 text-sm">
                  {formatPrice(290, selectedCurrency)}
                </span>
              </div>

            </div>

            {/* Floating verification badge */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 shadow-xl items-center gap-2.5 text-xs transition-colors duration-200">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">NDPR & POPIA Certified</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Bank-Grade 256-bit Document Vault</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
