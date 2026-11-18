import React from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  Headphones, 
  ArrowRight, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { POLICY_METADATA } from '../data/policyData';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onContactSupportClick: () => void;
  onRequestRefundClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactSupportClick, onRequestRefundClick }) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-blue-800/40">
      {/* Subtle brand glow geometry */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Draft Commercial Policy Notice / Disclaimer */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-blue-900/60 border border-lime-400/30 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="p-1 rounded bg-lime-400 text-blue-950 font-bold shrink-0">
                {t('hero.noticeTag', 'NOTICE')}
              </span>
              <p className="text-slate-200 leading-relaxed">
                {t('hero.noticeText', 'Commercial Governance Draft: All proposed refund periods, eligibility conditions, and service-level rules herein are commercial policy terms subject to executive and legal ratification. Mandatory statutory consumer rights remain unimpaired.')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-slate-300 shrink-0 font-mono text-[11px]">
              <span>{t('hero.effective', `Effective: ${POLICY_METADATA.effectiveDate}`)}</span>
              <span aria-hidden="true">·</span>
              <span>{t('hero.updated', `Updated: ${POLICY_METADATA.lastUpdatedDate}`)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-lime-400 text-xs font-semibold tracking-wide border border-white/10">
                <span>{t('hero.badge', 'MsmeBooks Commercial Governance · Version 2.4')}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
                {t('hero.title', 'Refund & Cancellation Policy')}
              </h1>

              <p className="text-xl sm:text-2xl font-medium text-lime-300 text-balance">
                {t('hero.subtitle', 'Transparent Billing. Fair Policies. Your Business, Our Priority.')}
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              {t('hero.description', 'At MsmeBooks, we believe business software should come with clear pricing, transparent subscription terms, and dependable customer support. Our Refund & Cancellation Policy explains how payments, subscription renewals, refunds, service cancellations, and billing disputes are handled.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onContactSupportClick}
                className="px-6 py-3 text-sm font-semibold text-blue-950 bg-lime-400 hover:bg-lime-300 active:bg-lime-500 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2.5 whitespace-nowrap"
              >
                <span>{t('hero.contactSupport', 'Contact Billing Support')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#subscriptions"
                className="px-6 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-lime-400" />
                <span>{t('hero.viewPlans', 'View Subscription Plans')}</span>
              </a>

              <button
                onClick={onRequestRefundClick}
                className="text-xs font-medium text-slate-300 hover:text-white underline underline-offset-4 decoration-lime-400/60 transition-colors"
              >
                {t('hero.submitDisputeLink', 'Already have an invoice dispute? Submit Refund Request →')}
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/msmebooks_billing_hero_1792627916173.jpg"
                alt="MsmeBooks Financial Dashboard and Transparent Billing Ledger"
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                  <span className="font-semibold text-white">{t('hero.cloudTransparency', 'Cloud Billing Transparency')}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{t('hero.auditCompliant', 'Audit Compliant')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Trust Information Bar */}
        <div className="mt-12 pt-8 border-t border-white/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-lime-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{t('hero.trust1Title', 'Transparent Billing')}</h4>
                <p className="text-xs text-slate-400">{t('hero.trust1Desc', 'No hidden deductions')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-lime-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{t('hero.trust2Title', 'Secure Processing')}</h4>
                <p className="text-xs text-slate-400">{t('hero.trust2Desc', 'PCI-DSS & CBN compliant')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-lime-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{t('hero.trust3Title', 'Clear Cancellation')}</h4>
                <p className="text-xs text-slate-400">{t('hero.trust3Desc', 'Instant self-service portal')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-lime-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{t('hero.trust4Title', 'Dedicated Support')}</h4>
                <p className="text-xs text-slate-400">{t('hero.trust4Desc', 'Direct WhatsApp & ticket desk')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

