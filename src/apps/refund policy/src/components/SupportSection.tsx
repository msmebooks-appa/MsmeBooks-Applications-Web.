import React from 'react';
import { 
  Mail, 
  MessageCircle, 
  Globe, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Scale, 
  CheckCircle2 
} from 'lucide-react';
import { POLICY_METADATA } from '../data/policyData';
import { useLanguage } from '../context/LanguageContext';

export const SupportSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      
      {/* Section 16/17: Customer Support */}
      <section id="customer-support" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>{t('support.tag', '17. Verified Support Channels')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            {t('support.title', 'Need Help With a Payment or Refund?')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {t('support.subtitle', 'Our support team is here to help you understand your billing, subscription, cancellation, and refund options.')}
          </p>
        </div>

        {/* Support Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: WhatsApp Support */}
          <a
            href={`https://wa.me/${POLICY_METADATA.officialWhatsAppNumber}?text=${encodeURIComponent(
              'Hello MsmeBooks Billing Support, I have an inquiry regarding my subscription, payment, or refund policy.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-500/30 hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Instant Messaging Desk
                </span>
                <h3 className="text-sm font-bold text-blue-950 dark:text-white mt-0.5">
                  {t('support.whatsappTitle', 'Official WhatsApp Support')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('support.whatsappDesc', 'Chat directly with our verified billing support team.')}
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              <span>{POLICY_METADATA.officialWhatsAppFormatted}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Card 2: Billing Email Desk */}
          <a
            href={`mailto:${POLICY_METADATA.officialSupportEmail}?subject=Billing%20Support%20Inquiry%20-%20MsmeBooks`}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-900 dark:hover:border-blue-600 transition-all duration-200 flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                  Official Email Ticket
                </span>
                <h3 className="text-sm font-bold text-blue-950 dark:text-white mt-0.5">
                  {t('support.emailTitle', 'Billing & Claims Desk')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('support.emailDesc', 'Send receipts, bank statements, or dispute documentation.')}
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-900 dark:text-lime-400 font-mono">
              <span>{POLICY_METADATA.officialSupportEmail}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Card 3: Help Center */}
          <a
            href="https://www.msmebooks.org"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-900 dark:hover:border-blue-600 transition-all duration-200 flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-lime-50 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime-800 dark:text-lime-300 block">
                  Self-Service Portal
                </span>
                <h3 className="text-sm font-bold text-blue-950 dark:text-white mt-0.5">
                  {t('support.portalTitle', 'Help Center & Guides')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('support.portalDesc', 'Step-by-step software walkthroughs and accounting tutorials.')}
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Visit www.msmebooks.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Card 4: Verified Business Hours */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Operating Hours
                </span>
                <h3 className="text-sm font-bold text-blue-950 dark:text-white mt-0.5">
                  {t('support.hoursTitle', 'Business Support Hours')}
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1">
                  <p><strong>Mon – Fri:</strong> 8:00 AM – 6:00 PM WAT</p>
                  <p><strong>Saturday:</strong> 9:00 AM – 2:00 PM WAT</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Sunday & Public Holidays: Closed</p>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              West Africa Time (WAT / UTC+1)
            </div>
          </div>

        </div>
      </section>

      {/* Section 17: Legal Compliance & International Coverage */}
      <section id="statutory-rights" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>14 & 15. Legal Compliance & Jurisdiction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            Legal Compliance & International Coverage
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Structured to support MsmeBooks operations across Nigeria, Pan-African markets, and global enterprise territories.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
          
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-blue-900 dark:text-lime-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-blue-950 dark:text-white">
                {t('support.statutoryTitle', 'Supremacy of Mandatory Consumer Rights')}
              </h3>
              <p>
                Nothing in this Refund & Cancellation Policy shall be construed as excluding, restricting, or modifying any mandatory statutory guarantees, consumer warranties, or non-waivable rights under:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Federal Competition and Consumer Protection Act (FCCPA, 2018)</strong> and relevant regulations of the FCCPC in the Federal Republic of Nigeria.
                </li>
                <li>
                  <strong>Nigeria Data Protection Act (NDPA, 2023)</strong> and NDPR data processing governance standards.
                </li>
                <li>
                  <strong>Regional African Economic Frameworks</strong> including ECOWAS electronic commerce rules, the East African Community (EAC) consumer standards, and AfCFTA cross-border digital trade conventions.
                </li>
                <li>
                  <strong>Applicable International Consumer Legislation</strong> for international corporate subscribers outside Africa where mandatory consumer rights apply by operation of law.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Policy Modification & Notice Mechanism:</h4>
            <p className="text-slate-600 dark:text-slate-300">
              MsmeBooks reserves the right to amend this policy periodically to reflect evolving regulatory standards, new payment processor agreements, or product updates. Notice of material updates will be communicated at least thirty (30) days in advance via in-app dashboard notices or emails to account owners. Continued utilization of the SaaS platform after the effective date constitutes acknowledgment of updated terms.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
