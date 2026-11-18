import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Copy, Code, Check } from 'lucide-react';
import { DOCUMENT_METADATA } from '../data/termsContent';
import { TranslationDictionary } from '../data/translations';
import { useCurrency } from '../context/CurrencyContext';

interface AcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTerms: () => void;
  t: TranslationDictionary;
}

export const AcceptanceModal: React.FC<AcceptanceModalProps> = ({
  isOpen,
  onClose,
  onViewTerms,
  t
}) => {
  const { currency, currencyInfo, formatNgn } = useCurrency();

  const growthPlanLabel = `Growth Tier (${formatNgn(35000)}/mo)`;
  const enterprisePlanLabel = `Enterprise Multi-Branch (${formatNgn(95000)}/mo)`;
  const freePlanLabel = `Free Tier (Micro-Business - ${currencyInfo.symbol} 0)`;

  const [businessName, setBusinessName] = useState('Apex Supermarket & Stores');
  const [email, setEmail] = useState('admin@apexstores.ng');
  const [selectedPlan, setSelectedPlan] = useState<string>(growthPlanLabel);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [auditRecord, setAuditRecord] = useState<any | null>(null);
  const [copiedAudit, setCopiedAudit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) return;

    const record = {
      auditEventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
      userIdentifier: email,
      businessEntity: businessName,
      subscriptionPlan: selectedPlan,
      billingCurrency: currency,
      currencySymbol: currencyInfo.symbol,
      exchangeRateVsUsd: currencyInfo.ratePerUsd,
      acceptedTermsVersion: `v${DOCUMENT_METADATA.version}`,
      acceptedTermsHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      acceptanceTimestamp: new Date().toISOString(),
      clientIpAddress: '102.89.44.112 (Lagos, NG)',
      userAgent: navigator.userAgent,
      acceptanceContext: 'checkout_registration_flow',
      affirmativeClickConfirmed: true,
      preselectedCheckboxUsed: false,
      optionalMarketingConsent: marketingAgreed,
      complianceStandard: 'NDPA 2023 Sec 26 & GDPR Article 7 Proof of Consent'
    };

    setAuditRecord(record);
    setSubmitted(true);
  };

  const handleCopyAudit = () => {
    if (!auditRecord) return;
    navigator.clipboard.writeText(JSON.stringify(auditRecord, null, 2)).then(() => {
      setCopiedAudit(true);
      setTimeout(() => setCopiedAudit(false), 2000);
    });
  };

  const resetForm = () => {
    setAuditRecord(null);
    setSubmitted(false);
    setTermsAgreed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0A1A2C] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Modal Header */}
        <div className="p-5 bg-[#0B3558] dark:bg-[#06182B] text-white flex items-center justify-between border-b dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl text-[#84CC16]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {t.modals.consentTitle}
              </h3>
              <p className="text-[11px] text-blue-200 mt-0.5">
                {t.modals.consentSubtitle} · Billing in <span className="font-mono font-bold text-[#84CC16]">{currency} ({currencyInfo.symbol})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.modals.consentDesc}
              </p>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t.modals.businessNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#07131F] focus:bg-white dark:focus:bg-[#0A1A2C] focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t.modals.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#07131F] focus:bg-white dark:focus:bg-[#0A1A2C] focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t.modals.planLabel} (Billed in {currency})
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#07131F] focus:bg-white dark:focus:bg-[#0A1A2C] focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16]"
                >
                  <option value={freePlanLabel}>{freePlanLabel}</option>
                  <option value={growthPlanLabel}>{growthPlanLabel}</option>
                  <option value={enterprisePlanLabel}>{enterprisePlanLabel}</option>
                  <option value="Custom Enterprise SaaS Tier (Bespoke)">Custom Enterprise SaaS Tier (Bespoke)</option>
                </select>
              </div>

              {/* Mandatory Affirmative Consent Checkbox (Unchecked by default as required) */}
              <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-[#F0F7FD] dark:bg-[#0D2238] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0B3558] dark:text-[#84CC16] focus:ring-[#84CC16]"
                  />
                  <span className="text-slate-800 dark:text-slate-200 leading-snug">
                    {t.modals.termsAgreedPrefix}{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onViewTerms();
                      }}
                      className="font-bold text-[#0B3558] dark:text-[#38BDF8] underline hover:text-[#84CC16] transition-colors"
                    >
                      {t.modals.termsAgreedLink}
                    </button>{' '}
                    {t.modals.termsAgreedMid}{' '}
                    <a
                      href="#related-documents"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        const el = document.getElementById('related-documents');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="font-bold text-[#0B3558] dark:text-[#38BDF8] underline hover:text-[#84CC16] transition-colors"
                    >
                      {t.modals.privacyLink}
                    </a>.
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                  {t.modals.mandatoryNote}
                </p>
              </div>

              {/* Optional Marketing Consent Checkbox (Strictly Separated) */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07131F]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingAgreed}
                    onChange={(e) => setMarketingAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0B3558] dark:text-[#84CC16] focus:ring-[#84CC16]"
                  />
                  <span className="text-slate-600 dark:text-slate-300 leading-snug">
                    {t.modals.marketingConsent}
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0D2238] rounded-lg transition-colors"
                >
                  {t.modals.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={!termsAgreed}
                  className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                    termsAgreed
                      ? 'bg-[#0B3558] dark:bg-[#0E3F6D] text-white hover:bg-[#072238] dark:hover:bg-[#124B82] shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {t.modals.submitConsentBtn}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    {t.modals.verifiedSuccessTitle}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    {t.modals.verifiedSuccessDesc}
                  </p>
                </div>
              </div>

              {/* JSON Audit Record Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-[#0B3558] dark:text-[#84CC16]" />
                    <span>{t.modals.auditPayloadLabel}</span>
                  </span>
                  <button
                    onClick={handleCopyAudit}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B3558] dark:text-[#38BDF8] hover:underline"
                  >
                    {copiedAudit ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">{t.modals.copiedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.modals.copyJsonBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3.5 bg-slate-900 dark:bg-[#050E17] text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border dark:border-slate-800">
                  {JSON.stringify(auditRecord, null, 2)}
                </pre>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-semibold text-[#0B3558] dark:text-[#38BDF8] hover:underline"
                >
                  {t.modals.testAnotherBtn}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#124B82] rounded-lg transition-colors"
                >
                  {t.modals.doneBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
