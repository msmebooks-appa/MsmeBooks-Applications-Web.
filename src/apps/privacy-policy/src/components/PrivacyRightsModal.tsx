import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, AlertTriangle, Coins } from 'lucide-react';
import { POLICY_METADATA } from '../data/privacyPolicyData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const PrivacyRightsModal: React.FC<PrivacyRightsModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'access',
}) => {
  const [requestType, setRequestType] = useState<string>(defaultType);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [userRole, setUserRole] = useState('Business Owner / Administrator');
  const [requestDetails, setRequestDetails] = useState('');
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { formatMoney, currencyMeta } = useCurrency();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !requestDetails.trim()) {
      setErrorMsg(t('modal.errorRequired', 'Please complete all required fields.'));
      return;
    }
    if (!identityConfirmed) {
      setErrorMsg(t('modal.errorIdentity', 'Please confirm identity acknowledgment before submitting.'));
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate secure transmission to compliance queue
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedRef = `MSME-DSR-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(generatedRef);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setRequestDetails('');
    setIdentityConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1455C0] dark:bg-[#155de0] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B8E62E]" />
            <div>
              <h3 className="text-sm font-bold">{t('modal.title', 'MsmeBooks Privacy Rights Desk')}</h3>
              <p className="text-[11px] text-blue-100">{t('modal.subtitle', 'Statutory Data Subject Request Workflow')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedRef ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#172B4D] dark:text-white">
                  {t('modal.successTitle', 'Request Securely Logged')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  {t('modal.successDesc', 'Your privacy request has been encrypted and assigned to the MsmeBooks Data Protection Officer.')}
                </p>
              </div>

              {/* Reference ID box */}
              <div className="p-4 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-xl max-w-md mx-auto text-left space-y-1">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  {t('modal.refLabel', 'Statutory Tracking Reference')}
                </div>
                <div className="font-mono text-base font-bold text-[#1455C0] dark:text-[#5B95FF]">
                  {submittedRef}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  {t('modal.keepRefNotice', 'Please save this reference number. Official verification and resolution will be communicated within statutory deadlines.')}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] rounded-lg transition-colors"
                >
                  {t('modal.closeBtn', 'Done & Close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Request Type Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {t('modal.reqType', 'Request Type')} *
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-800 dark:text-white"
                >
                  <option value="access">{t('rights.card1Sub', 'Right to Data Portability & Access')}</option>
                  <option value="rectify">{t('rights.card2Sub', 'Right to Rectification')}</option>
                  <option value="delete">{t('rights.card3Sub', "Right to Erasure ('Right to be Forgotten')")}</option>
                  <option value="complaint">{t('rights.card5Sub', 'Grievance & NDPC Escalation')}</option>
                  <option value="contact">{t('rights.card6Sub', 'Direct Legal Communication')}</option>
                </select>
              </div>

              {/* User Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t('modal.fullName', 'Full Legal Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Ogunlesi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t('modal.email', 'Corporate / Business Email')} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. adebayo@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t('modal.phone', 'Telephone (WhatsApp Enabled)')}
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t('modal.businessName', 'Business / Organization Name')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sahara Retail Enterprise"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {t('modal.role', 'Role in Organization')} *
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-800 dark:text-white"
                >
                  <option value="Business Owner / Administrator">Business Owner / Account Administrator</option>
                  <option value="Employee / Staff User">Staff Member / Cashier / Clerk</option>
                  <option value="Accountant / Bookkeeper">External Accountant / Auditor</option>
                  <option value="POS Retail Customer">Point of Sale (POS) Customer</option>
                  <option value="Hotel PMS Guest">Hotel Guest / Booking Customer</option>
                  <option value="Supplier / Vendor">Supplier / Vendor Partner</option>
                  <option value="Other">Website Visitor / Other</option>
                </select>
              </div>

              {/* Request Details */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {t('modal.details', 'Specific Request Details')} *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={t('modal.detailsPlaceholder', 'Describe the specific records, adjustments, or clarifications you require...')}
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] text-slate-900 dark:text-white"
                />
              </div>

              {/* Verification Acknowledgment */}
              <div className="p-3 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-700 rounded-lg flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="id-confirm"
                  checked={identityConfirmed}
                  onChange={(e) => setIdentityConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-[#1455C0] dark:text-[#5B95FF] focus:ring-[#1455C0]"
                />
                <label htmlFor="id-confirm" className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight cursor-pointer">
                  {t('modal.identityConfirm', 'I confirm under penalty of law that I am the authorized data subject or designated corporate officer entitled to make this request.')}
                </label>
              </div>

              {/* Statutory Fee Notice */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0D1627] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#5B95FF]" />
                  <span>{t('modal.feeNotice', 'Statutory SAR Notice: Standard requests are completely free of charge under NDPA 2023 Section 34.')} (Cap: <strong>{formatMoney(5_000)}</strong>)</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">{currencyMeta.code}</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  {t('chat.close', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? t('modal.submitting', 'Encrypting & Submitting...') : t('modal.submitBtn', 'Submit Encrypted Request')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
