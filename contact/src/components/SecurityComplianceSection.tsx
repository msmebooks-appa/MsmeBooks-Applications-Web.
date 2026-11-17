import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck2,
  ExternalLink,
  X,
  CheckCircle2,
  Award,
  Globe2,
  Database,
  ArrowRight,
} from 'lucide-react';
import {
  SecurityLogo,
  SECURITY_STANDARDS_DATA,
  SecurityStandardDetails,
} from './SecurityBadges';
import { useLanguage } from '../context/LanguageContext';

interface SecurityComplianceSectionProps {
  onScrollToForm: (enquiryType?: string) => void;
  compact?: boolean;
}

export const SecurityComplianceSection: React.FC<SecurityComplianceSectionProps> = ({
  onScrollToForm,
  compact = false,
}) => {
  const { tDict } = useLanguage();
  const [selectedStandard, setSelectedStandard] = useState<SecurityStandardDetails | null>(null);

  // Close modal on escape key
  React.useEffect(() => {
    if (!selectedStandard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStandard(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStandard]);

  return (
    <section
      id="security-compliance"
      className={`${
        compact ? 'py-8' : 'py-16 lg:py-20'
      } bg-slate-50 dark:bg-[#070D18] border-y border-slate-200/90 dark:border-slate-800/90 relative transition-colors`}
    >
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#0B3B82]/5 dark:bg-[#0B3B82]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#70C038]/5 dark:bg-[#70C038]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <ShieldCheck className="w-4 h-4 text-[#70C038]" />
            <span className="text-xs font-bold text-[#70C038] uppercase tracking-wider">
              {tDict.security.badge}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight mb-3">
            {tDict.security.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tDict.security.subtitle}
          </p>

          {/* Quick Pillar Highlights (Zero-Pill Typography) */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#70C038]" />
              <span>{tDict.security.dataResidency}</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#70C038]" />
              <span>{tDict.security.uptimeSla}</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
              <Lock className="w-3.5 h-3.5 text-[#0B3B82] dark:text-[#93C5FD]" />
              <span>Zero Unauthorized Data Sharing</span>
            </span>
          </div>
        </div>

        {/* Security Standards Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECURITY_STANDARDS_DATA.map((standard) => {
            const isSelected = selectedStandard?.id === standard.id;
            return (
              <div
                key={standard.id}
                className={`bg-white dark:bg-[#10192E] rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between hover:shadow-md group ${
                  isSelected
                    ? 'border-[#0B3B82] dark:border-blue-500 ring-2 ring-[#0B3B82]/15 shadow-sm'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar with Logo & Verification Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <SecurityLogo id={standard.id} size="md" />
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                      {standard.code}
                    </span>
                  </div>

                  {/* Standard Name & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B3B82] dark:group-hover:text-[#93C5FD] transition-colors">
                    {standard.shortName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {standard.fullName}
                  </p>

                  {/* Key Operational Scope */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] space-y-1.5 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#70C038] shrink-0" />
                      <span className="truncate">Auditor: {standard.auditor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#0B3B82] dark:text-[#93C5FD] shrink-0" />
                      <span className="truncate">Status: {standard.lastAuditDate}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Verification Trigger */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedStandard(standard)}
                    className="text-xs font-semibold text-[#0B3B82] dark:text-[#93C5FD] hover:text-[#082d64] dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>{tDict.security.viewCredentials}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                    Active Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form Reassurance Strip (Enhancing trust during contact requests) */}
        <div className="mt-10 p-4 sm:p-5 bg-white dark:bg-[#131E35] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#70C038]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Safe & Confidential Enquiry Submission
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {tDict.security.guaranteeText}
              </p>
            </div>
          </div>

          <button
            onClick={() => onScrollToForm('Enterprise Solutions')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>Request Security Architecture Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Compliance Credentials Modal */}
      {selectedStandard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedStandard.fullName}
          onClick={() => setSelectedStandard(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#0F172A] rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <SecurityLogo id={selectedStandard.id} size="lg" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#70C038]">
                    Verified Institutional Standard
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedStandard.fullName}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {selectedStandard.code}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStandard(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audit & Cryptographic Specifications */}
            <div className="py-4 space-y-3.5 text-xs">
              <div className="bg-slate-50 dark:bg-[#131E35] p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Certification Reference:</span>
                  <span className="font-mono font-bold text-[#0B3B82] dark:text-[#93C5FD]">
                    {selectedStandard.certificateRef}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Accredited Auditor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedStandard.auditor}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Audit Cycle:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedStandard.lastAuditDate}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Jurisdiction:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedStandard.jurisdiction}</span>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Data Residency & Cloud Hubs:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {selectedStandard.dataCenterHubs}
                  </span>
                </div>
              </div>

              {/* Verified Security Guarantees */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Key Institutional Guarantees
                </h4>
                <ul className="space-y-2">
                  {selectedStandard.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#70C038] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Audited annually for institutional banking & POS operations.
              </span>
              <button
                type="button"
                onClick={() => setSelectedStandard(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] transition-colors"
              >
                {tDict.security.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
