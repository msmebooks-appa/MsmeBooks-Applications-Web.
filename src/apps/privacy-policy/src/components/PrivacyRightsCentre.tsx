import React from 'react';
import {
  FileSpreadsheet,
  UserCheck,
  Trash2,
  SlidersHorizontal,
  AlertCircle,
  MailQuestion,
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface PrivacyRightsCentreProps {
  onOpenRightsModal: (defaultType?: string) => void;
  onOpenCookieModal: () => void;
}

export const PrivacyRightsCentre: React.FC<PrivacyRightsCentreProps> = ({
  onOpenRightsModal,
  onOpenCookieModal,
}) => {
  const { t } = useLanguage();
  const { formatMoney, currencyMeta } = useCurrency();

  const actionCards = [
    {
      id: "access",
      title: t('rights.card1Title', 'Request a Copy of My Personal Data'),
      subtitle: t('rights.card1Sub', 'Right to Data Portability & Access'),
      description: t('rights.card1Desc', 'Obtain an encrypted machine-readable export (JSON/CSV/PDF) of your account credentials, login telemetry, and personal records.'),
      icon: FileSpreadsheet,
      badge: "Portability",
      actionLabel: t('rights.card1Btn', 'Initiate Access Request'),
      type: "access"
    },
    {
      id: "rectify",
      title: t('rights.card2Title', 'Correct My Personal Information'),
      subtitle: t('rights.card2Sub', 'Right to Rectification'),
      description: t('rights.card2Desc', 'Notify our compliance desk of outdated or inaccurate personal details, tax identifiers, or corporate profile records.'),
      icon: UserCheck,
      badge: "Rectification",
      actionLabel: t('rights.card2Btn', 'Update Information'),
      type: "rectify"
    },
    {
      id: "delete",
      title: t('rights.card3Title', 'Request Deletion of Personal Information'),
      subtitle: t('rights.card3Sub', "Right to Erasure ('Right to be Forgotten')"),
      description: t('rights.card3Desc', 'Submit a formal request to purge personal identification details from our records, subject to statutory tax retention rules.'),
      icon: Trash2,
      badge: "Erasure",
      actionLabel: t('rights.card3Btn', 'Request Deletion'),
      type: "delete"
    },
    {
      id: "cookies",
      title: t('rights.card4Title', 'Manage Cookie Preferences'),
      subtitle: t('rights.card4Sub', 'Consent Control Center'),
      description: t('rights.card4Desc', 'Review and toggle analytical tags, functional preferences, and marketing beacons active on your browser.'),
      icon: SlidersHorizontal,
      badge: "Consent",
      actionLabel: t('rights.card4Btn', 'Configure Cookies'),
      onClick: onOpenCookieModal
    },
    {
      id: "complaint",
      title: t('rights.card5Title', 'Submit a Privacy Complaint'),
      subtitle: t('rights.card5Sub', 'Grievance & NDPC Escalation'),
      description: t('rights.card5Desc', 'Escalate concerns regarding unauthorized communications, suspected data misuse, or unmet statutory obligations.'),
      icon: AlertCircle,
      badge: "Grievance",
      actionLabel: t('rights.card5Btn', 'File Formal Complaint'),
      type: "complaint"
    },
    {
      id: "contact",
      title: t('rights.card6Title', 'Contact the Privacy Team & DPO'),
      subtitle: t('rights.card6Sub', 'Direct Legal Communication'),
      description: t('rights.card6Desc', 'Direct inquiries to our qualified Data Protection Officer and compliance counsel regarding enterprise DPAs or cross-border audits.'),
      icon: MailQuestion,
      badge: "DPO Office",
      actionLabel: t('rights.card6Btn', 'Message Privacy Desk'),
      type: "contact"
    }
  ];

  return (
    <section id="rights-center" className="py-16 bg-white dark:bg-[#0D1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1455C0] dark:text-[#5B95FF] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('rights.kicker', 'Interactive Data Subject Portal')}</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">NDPA 2023 & GDPR Aligned</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#172B4D] dark:text-white tracking-tight">
            {t('rights.title', 'Privacy & Data Rights Centre')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {t('rights.subtitle', 'Exercise your statutory rights with zero friction. Every request is logged with an encrypted tracking reference, acknowledged within 24 hours, and resolved within 30 calendar days.')}
          </p>
        </div>

        {/* 6 Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group bg-[#F7FAFC] hover:bg-white dark:bg-[#111C30] dark:hover:bg-[#16233B] border border-slate-200 hover:border-[#1455C0]/50 dark:border-slate-800 dark:hover:border-[#1455C0]/60 rounded-2xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#16233B] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#1455C0] dark:text-[#5B95FF] shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#1455C0] dark:text-[#5B95FF]">
                      {card.subtitle}
                    </span>
                    <h3 className="text-base font-bold text-[#172B4D] dark:text-white mt-1 group-hover:text-[#1455C0] dark:group-hover:text-[#5B95FF] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    onClick={() => {
                      if (card.onClick) {
                        card.onClick();
                      } else {
                        onOpenRightsModal(card.type);
                      }
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Verification Assurance Banner */}
        <div className="mt-10 p-4 bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF] shrink-0" />
            <span>
              <strong className="text-slate-800 dark:text-white">
                {t('rights.zeroExposure', 'Zero Public Data Exposure: Identity verification required prior to record modification or extraction. No sensitive data exposed in public URLs.')}
              </strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 text-slate-400 dark:text-slate-500">
            <span>{t('rights.sla', 'Response SLA: ≤ 30 Days')}</span>
            <span>·</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">SAR Filing: Free (Dupl. cap: {formatMoney(5_000)})</span>
            <span>·</span>
            <span>{t('rights.encrypted', 'Encrypted Queue')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
