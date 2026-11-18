import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Upload, 
  CheckCircle, 
  FileCheck, 
  Lock, 
  AlertCircle,
  WifiOff,
  Layers
} from 'lucide-react';
import { CurrencyCode, PaymentMethod, RefundRequest } from '../types/policy';
import { useNetworkStatus } from '../context/NetworkContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../context/CurrencyContext';

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: RefundRequest) => void;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [serviceType, setServiceType] = useState('Monthly Subscription (Standard)');
  const [invoiceReference, setInvoiceReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const { currentCurrency, formatCurrency, convertAmount } = useCurrency();
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyCode>(currentCurrency);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Paystack');
  const [reason, setReason] = useState('Duplicate Payment / Overcharge');
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [wasSubmittedOffline, setWasSubmittedOffline] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [formError, setFormError] = useState('');

  const { isOnline, queueOfflineRequest } = useNetworkStatus();

  React.useEffect(() => {
    if (isOpen) {
      setCurrency(currentCurrency);
    }
  }, [isOpen, currentCurrency]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName || !businessName || !accountEmail || !invoiceReference || !amount || !paymentDate) {
      setFormError('Please fill in all mandatory billing identification fields.');
      return;
    }

    if (!consentAccepted) {
      setFormError('You must provide consent for MsmeBooks billing officers to verify transaction records.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRef = `MB-REF-2026-${randomSuffix}`;
    setGeneratedRef(newRef);

    const now = new Date();
    const formattedTimestamp = `${now.toISOString().split('T')[0]} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} WAT`;

    const newRequest: RefundRequest = {
      id: `req_${Date.now()}`,
      referenceNumber: newRef,
      customerName,
      businessName,
      accountEmail,
      serviceType,
      invoiceReference,
      paymentDate,
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      reason,
      detailedExplanation,
      attachmentName: attachmentName || undefined,
      consentAccepted: true,
      stage: 'submitted',
      submittedAt: formattedTimestamp,
      lastUpdatedAt: formattedTimestamp,
      reviewerNotes: isOnline 
        ? 'Pending initial gateway reconciliation with billing officer.'
        : 'Queued offline. Will sync with MsmeBooks gateway when network restores.',
      isOfflineQueued: !isOnline,
      auditTrail: [
        {
          timestamp: formattedTimestamp,
          actor: customerName,
          action: isOnline ? 'Ticket Created' : 'Ticket Queued Offline',
          note: isOnline 
            ? `Public refund submission for ${serviceType} (${invoiceReference}).`
            : `Draft recorded offline. Stored in device local storage for automatic synchronization.`,
        },
      ],
    };

    if (!isOnline) {
      queueOfflineRequest(newRequest);
      setWasSubmittedOffline(true);
    } else {
      setWasSubmittedOffline(false);
    }

    onSubmit(newRequest);
    setIsSubmittedSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSubmittedSuccess(false);
    setWasSubmittedOffline(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-5 flex items-center justify-between border-b border-blue-900 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-lime-300">
                Official Billing Desk
              </span>
              {!isOnline && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" /> Offline Mode
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Submit Refund or Billing Dispute
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmittedSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ring-8 ${
              wasSubmittedOffline 
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 ring-amber-50 dark:ring-amber-900/40' 
                : 'bg-lime-100 dark:bg-lime-950 text-lime-700 dark:text-lime-300 ring-lime-50 dark:ring-lime-900/40'
            }`}>
              {wasSubmittedOffline ? <Layers className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-blue-950 dark:text-white">
                {wasSubmittedOffline ? 'Refund Request Saved Offline' : 'Refund Request Successfully Submitted'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {wasSubmittedOffline ? (
                  <>
                    Your claim has been <strong>securely saved to your device</strong>. Since you are operating in offline mode, it will <strong>automatically sync</strong> to MsmeBooks cloud as soon as your connection is restored.
                  </>
                ) : (
                  <>
                    Your request has been securely logged into MsmeBooks billing system. An automated confirmation receipt has been sent to <strong>{accountEmail}</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-w-sm mx-auto text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Your Unique Tracking Reference
              </span>
              <span className="text-xl font-mono font-extrabold text-blue-950 dark:text-lime-400">
                {generatedRef}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {wasSubmittedOffline 
                  ? 'Preserved in offline queue. Retain this code for future tracking.'
                  : 'Save this code to check real-time resolution on the live tracker.'}
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {wasSubmittedOffline ? (
                <span className="text-amber-700 dark:text-amber-300 font-medium">
                  ⚡ Auto-sync is active: No further action required. Reconnecting will send this claim directly to our compliance officers.
                </span>
              ) : (
                <>Our billing review committee will complete cross-verification against upstream processor records within <strong>1 to 3 business days</strong>.</>
              )}
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Done & Return to Policy Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto">
            
            {/* Absolute Security Assurance Alert */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs flex items-start gap-2.5 text-blue-950 dark:text-blue-200">
              <Lock className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900 dark:text-lime-300">Security Guarantee:</strong> MsmeBooks will <span className="underline">never</span> request or store your card PIN, CVV security code, password, or full 16-digit payment card number.
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Customer & Business Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Registered Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Kano Agro-Logistics Ltd"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Service */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Account Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="billing@yourcompany.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subscription or Service Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option>Monthly Subscription (Standard/Growth)</option>
                  <option>Annual Prepaid Plan (12-Month)</option>
                  <option>Enterprise Custom Deployment</option>
                  <option>POS Multi-Register Add-on</option>
                  <option>Inventory Barcode & Warehouse Sync</option>
                  <option>WhatsApp Invoice Delivery Bundle</option>
                  <option>Implementation & Data Migration</option>
                  <option>Accounting Configuration & Training</option>
                  <option>Other Marketplace Extension</option>
                </select>
              </div>
            </div>

            {/* Invoice Ref & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Invoice or Transaction Reference <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={invoiceReference}
                  onChange={(e) => setInvoiceReference(e.target.value)}
                  placeholder="e.g. INV-2026-09412 or pstk_99120"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Payment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Amount, Currency & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Payment Amount <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="145000"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol} - {c.name})
                    </option>
                  ))}
                </select>
                {amount && parseFloat(amount) > 0 && currency !== currentCurrency && (
                  <span className="text-[10px] text-lime-700 dark:text-lime-400 font-mono block">
                    ≈ {formatCurrency(convertAmount(parseFloat(amount), currency, currentCurrency), currentCurrency)} ({currentCurrency})
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Gateway</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Paystack">Paystack</option>
                  <option value="Flutterwave">Flutterwave</option>
                  <option value="Stripe">Stripe</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer (NIBSS/EFT)</option>
                  <option value="Mobile Money (M-Pesa/MTN/Airtel)">Mobile Money</option>
                  <option value="Partner/Reseller Invoice">Partner/Reseller Invoice</option>
                </select>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason for Refund <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option>Duplicate Payment / Double Charge</option>
                <option>Incorrect Invoiced Amount</option>
                <option>Annual Plan 14-Day Initial Grace Cancellation</option>
                <option>Technical Service Outage / Critical Feature Failure</option>
                <option>Accidental Unused Add-on Purchase</option>
                <option>Professional Service Cancelled Prior to Kickoff</option>
                <option>Unauthorized Transaction / Security Escalation</option>
                <option>Other Commercial Request</option>
              </select>
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Detailed Explanation & Discrepancy Context
              </label>
              <textarea
                rows={3}
                value={detailedExplanation}
                onChange={(e) => setDetailedExplanation(e.target.value)}
                placeholder="Please describe transaction circumstances, bank debit reference, and whether you prefer account credit or bank card reversal..."
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Optional Document Attachment Simulation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Optional Supporting Attachment (PDF, PNG, JPG)</span>
                {attachmentName && (
                  <span className="text-lime-700 dark:text-lime-400 text-[11px] font-mono">
                    ✓ {attachmentName}
                  </span>
                )}
              </label>
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3 text-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Upload className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Attach bank statement or payment receipt (max 5MB)</span>
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-900 focus:ring-blue-600"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  I confirm that the details provided are accurate and authorize MsmeBooks Finance & Compliance team to review payment gateway records and audit logs to verify this claim.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Submit Claim for Verification
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
