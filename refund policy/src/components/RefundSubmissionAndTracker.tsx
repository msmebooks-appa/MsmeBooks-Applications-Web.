import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Mail, 
  User, 
  FileCheck, 
  Upload, 
  Lock, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  XCircle,
  HelpCircle,
  WifiOff,
  Database
} from 'lucide-react';
import { CurrencyCode, PaymentMethod, RefundRequest, RefundStage } from '../types/policy';
import { useNetworkStatus } from '../context/NetworkContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '../context/CurrencyContext';

interface RefundSubmissionAndTrackerProps {
  requests: RefundRequest[];
  onAddNewRequest: (newReq: RefundRequest) => void;
  onUpdateRequest: (updatedReq: RefundRequest) => void;
}

export const RefundSubmissionAndTracker: React.FC<RefundSubmissionAndTrackerProps> = ({
  requests,
  onAddNewRequest,
  onUpdateRequest,
}) => {
  // Navigation tabs: 'submit' or 'track'
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const { currentCurrency, formatCurrency, formatConverted, convertAmount, currencyDetail } = useCurrency();
  const [currency, setCurrency] = useState<CurrencyCode>(currentCurrency);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Paystack');
  const [reasonForRefund, setReasonForRefund] = useState('Duplicate Payment / Overcharge');
  const [explanation, setExplanation] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedSuccessCode, setSubmittedSuccessCode] = useState<string | null>(null);

  const { isOnline, queueOfflineRequest } = useNetworkStatus();

  // Sync form currency when global currency updates if not modified by user
  React.useEffect(() => {
    setCurrency(currentCurrency);
  }, [currentCurrency]);

  // Tracker State
  const [searchQuery, setSearchQuery] = useState('MB-REF-2026-8841');
  const [activeTrackedRequest, setActiveTrackedRequest] = useState<RefundRequest>(
    requests[0] || {
      id: 'default',
      referenceNumber: 'MB-REF-2026-8841',
      customerName: 'Amina Bello',
      businessName: 'Kano Agro-Logistics',
      accountEmail: 'amina.bello@kanoagro.ng',
      serviceType: 'Annual Subscription',
      invoiceReference: 'INV-2026-09412',
      paymentDate: '2026-10-14',
      amount: 145000,
      currency: 'NGN',
      paymentMethod: 'Paystack',
      reason: 'Duplicate Payment / Overcharge',
      detailedExplanation: 'Network timeout resulted in double debit during renewal.',
      consentAccepted: true,
      stage: 'processed',
      submittedAt: '2026-10-15 09:24 WAT',
      lastUpdatedAt: '2026-10-17 14:10 WAT',
      reviewerNotes: 'Verified duplicate charge ID pstk_txn_9948210. ₦145,000 processed via Paystack reversal.',
      gatewayTransactionId: 'pstk_txn_9948210',
      auditTrail: [
        { timestamp: '2026-10-15 09:24 WAT', actor: 'Amina Bello', action: 'Submitted', note: 'Form submitted with bank proof' },
        { timestamp: '2026-10-15 11:45 WAT', actor: 'Billing Compliance', action: 'Under Review', note: 'Cross-referenced on Paystack dashboard' },
        { timestamp: '2026-10-16 10:30 WAT', actor: 'Lead Finance Officer', action: 'Approved', note: 'Duplicate confirmed, refund authorized' },
        { timestamp: '2026-10-17 14:10 WAT', actor: 'Paystack Webhook', action: 'Refund Processed', note: 'Funds settled to source card ending in 4018' },
      ],
    }
  );

  const trackerStages = [
    {
      id: 'submitted',
      label: 'Submitted',
      stepNumber: '01',
      description: 'Request logged & reference issued',
      detailText: 'Timestamped submission acknowledged. Automated email receipt dispatched to subscriber.',
    },
    {
      id: 'under_review',
      label: 'Under Review',
      stepNumber: '02',
      description: 'Billing & ledger verification',
      detailText: 'Compliance officer cross-checks payment gateway logs, bank statements, and account activity.',
    },
    {
      id: 'approved_declined',
      label: 'Approved / Declined',
      stepNumber: '03',
      description: 'Formal financial decision',
      detailText: 'Finance leadership determines eligibility. Approval issued or clear decline rationale stated.',
    },
    {
      id: 'refund_processed',
      label: 'Refund Processed',
      stepNumber: '04',
      description: 'Payment gateway payout execution',
      detailText: 'Gateway executes reversal to original card, bank account, or mobile wallet.',
    },
  ];

  const getStageStepIndex = (stage: RefundStage): number => {
    switch (stage) {
      case 'submitted':
        return 0;
      case 'under_review':
      case 'additional_info':
        return 1;
      case 'approved':
      case 'declined':
        return 2;
      case 'processed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStageStepIndex(activeTrackedRequest.stage);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !accountEmail.trim() || !invoiceNumber.trim() || !paymentDate || !amount) {
      setFormError('Please fill in all mandatory fields: Customer Name, Email, Invoice Number, Payment Date, and Amount.');
      return;
    }

    if (!consentAccepted) {
      setFormError('Please acknowledge the consent checkbox to permit transaction audit verification.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRefNumber = `MB-REF-2026-${randomSuffix}`;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WAT`;

    const newRequest: RefundRequest = {
      id: `req_${Date.now()}`,
      referenceNumber: newRefNumber,
      customerName: customerName.trim(),
      businessName: businessName.trim() || customerName.trim() + ' Enterprise',
      accountEmail: accountEmail.trim(),
      serviceType: 'Subscription / SaaS License',
      invoiceReference: invoiceNumber.trim().toUpperCase(),
      paymentDate,
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      reason: reasonForRefund,
      detailedExplanation: explanation.trim() || 'No additional explanation provided.',
      attachmentName: attachmentName || undefined,
      consentAccepted: true,
      stage: 'submitted',
      submittedAt: formattedDate,
      lastUpdatedAt: formattedDate,
      reviewerNotes: isOnline
        ? 'Pending preliminary ledger and payment gateway reconciliation.'
        : 'Queued offline. Will sync with MsmeBooks cloud as soon as connection is restored.',
      isOfflineQueued: !isOnline,
      auditTrail: [
        {
          timestamp: formattedDate,
          actor: customerName.trim(),
          action: isOnline ? 'Submitted' : 'Queued Offline',
          note: isOnline
            ? `Claim registered via Public Refund Portal. Invoice Ref: ${invoiceNumber.trim().toUpperCase()}.`
            : `Claim saved offline on device storage. Awaiting network reconnection for cloud sync.`,
        },
      ],
    };

    if (!isOnline) {
      queueOfflineRequest(newRequest);
    }

    onAddNewRequest(newRequest);
    setActiveTrackedRequest(newRequest);
    setSearchQuery(newRefNumber);
    setSubmittedSuccessCode(newRefNumber);
    setActiveTab('track');
  };

  const handleSimulateStageChange = (newStage: RefundStage) => {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WAT`;

    let actionLabel = 'Status Updated';
    let note = '';

    if (newStage === 'submitted') {
      actionLabel = 'Submitted';
      note = 'Ticket logged in queue.';
    } else if (newStage === 'under_review') {
      actionLabel = 'Under Review';
      note = 'Assigned to Billing Compliance Officer for bank and gateway verification.';
    } else if (newStage === 'approved') {
      actionLabel = 'Approved';
      note = 'Claim verified against processor ledger. Refund authorized by Financial Controller.';
    } else if (newStage === 'declined') {
      actionLabel = 'Declined';
      note = 'Claim declined: Account was used to process active transactions beyond the approved window.';
    } else if (newStage === 'processed') {
      actionLabel = 'Refund Processed';
      note = `Payout released via ${activeTrackedRequest.paymentMethod} API. Settlement reference issued to acquiring bank.`;
    }

    const updated: RefundRequest = {
      ...activeTrackedRequest,
      stage: newStage,
      lastUpdatedAt: formatted,
      reviewerNotes: note,
      gatewayTransactionId: newStage === 'processed' ? `pstk_ref_${Math.floor(100000 + Math.random() * 900000)}` : activeTrackedRequest.gatewayTransactionId,
      auditTrail: [
        ...activeTrackedRequest.auditTrail,
        {
          timestamp: formatted,
          actor: 'MsmeBooks Compliance Desk',
          action: actionLabel,
          note,
        },
      ],
    };

    setActiveTrackedRequest(updated);
    onUpdateRequest(updated);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    const match = requests.find(
      (r) =>
        r.referenceNumber.toUpperCase() === query ||
        r.invoiceReference.toUpperCase() === query ||
        r.accountEmail.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (match) {
      setActiveTrackedRequest(match);
    }
  };

  return (
    <section id="refund-tracker" className="scroll-mt-24 space-y-8">
      
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
          <span>08. Dispute Resolution & Live Tracker</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
              Submit Refund Request & Live Progress Tracker
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Easily submit claims for review and track your request in real-time through all four fulfillment milestones.
            </p>
          </div>

          {/* Tab Navigation Pill Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl shrink-0 self-start sm:self-auto border border-transparent dark:border-slate-700">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'submit'
                  ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-lime-400" />
              <span>Submit Request</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-lime-400" />
              <span>Progress Tracker</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner after submission */}
      {submittedSuccessCode && activeTab === 'track' && (
        <div className="p-4 rounded-xl bg-lime-50 dark:bg-lime-950/40 border border-lime-300 dark:border-lime-800/60 text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-lime-400 text-blue-950 flex items-center justify-center shrink-0 font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950 dark:text-white">
                Refund Request Successfully Submitted!
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your request has been filed under tracking code <strong className="font-mono text-blue-900 dark:text-lime-400">{submittedSuccessCode}</strong>. Visual progress is displayed below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmittedSuccessCode(null)}
            className="text-xs font-bold text-blue-900 dark:text-lime-400 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: SUBMISSION FORM */}
      {activeTab === 'submit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
          
          {/* Form Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white px-6 py-6 border-b border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-lime-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MsmeBooks Commercial Protection</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Submit a Refund or Billing Claim
              </h3>
              <p className="text-xs text-slate-300">
                Please provide accurate payment details. Standard turnaround for billing verification is 1 to 3 business days.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
              <Lock className="w-4 h-4 text-lime-400 shrink-0" />
              <span>We never ask for card PINs or CVVs</span>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">
            
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Field 1: Customer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Customer Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Name as registered on your MsmeBooks subscription profile.
                </span>
              </div>

              {/* Field 2: Account Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Account Email <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="e.g. amina.bello@kanoagro.ng"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Confirmation receipt and status updates will be sent to this email.
                </span>
              </div>

              {/* Field 3: Invoice Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Invoice Number / Transaction Reference <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-09412 or pstk_txn_88192"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Found on your automated email receipt or in Settings → Billing.
                </span>
              </div>

              {/* Field 4: Payment Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Payment Date <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Date the transaction cleared your bank or card statement.
                </span>
              </div>

              {/* Field 5: Amount and Currency */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Amount & Currency <span className="text-rose-500">*</span></span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-36 px-2.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 145000"
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Exact debit amount shown on your payment confirmation.</span>
                  {amount && parseFloat(amount) > 0 && currency !== currentCurrency && (
                    <span className="font-mono text-lime-700 dark:text-lime-400 font-semibold">
                      ≈ {formatCurrency(convertAmount(parseFloat(amount), currency, currentCurrency), currentCurrency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Field 6: Reason for Refund */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Reason for Refund <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={reasonForRefund}
                  onChange={(e) => setReasonForRefund(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                >
                  <option>Duplicate Payment / Overcharge</option>
                  <option>Incorrect Billing Amount</option>
                  <option>Annual Plan 14-Day Initial Grace Period</option>
                  <option>Technical Service Outage / Platform Defect</option>
                  <option>Unused / Inactive Add-on Module</option>
                  <option>Implementation Cancelled Prior to Kickoff</option>
                  <option>Unauthorized Transaction / Security Review</option>
                  <option>Other Commercial Inquiry</option>
                </select>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Select the category that best matches your situation.
                </span>
              </div>

            </div>

            {/* Field 7: Explanation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Detailed Explanation & Discrepancy Context <span className="text-slate-400 font-normal">(Optional but recommended)</span>
              </label>
              <textarea
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Provide any relevant context (e.g. network timeout occurred during checkout, invoice charged twice on Zenith Bank card ending 4018, or preference between instant account credit versus bank refund)..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
              />
            </div>

            {/* Supporting Document / File Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Supporting Attachment <span className="text-slate-400 font-normal">(Bank statement excerpt, duplicate debit SMS or invoice PDF)</span></span>
                {attachmentName && (
                  <span className="text-lime-700 dark:text-lime-400 font-mono text-[11px]">
                    ✓ {attachmentName}
                  </span>
                )}
              </label>
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachmentName(e.target.files[0].name);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Click or drag bank receipt or debit alert (PDF, JPG, PNG up to 5MB)</span>
                </div>
              </div>
            </div>

            {/* Consent & Compliance Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-900 focus:ring-blue-600 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  I hereby declare that the information provided is accurate and authorize the MsmeBooks billing and compliance team to cross-verify the submitted transaction references against upstream payment gateway records.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Protected under NDPR & MsmeBooks Commercial Policy</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerName('');
                    setAccountEmail('');
                    setInvoiceNumber('');
                    setPaymentDate('');
                    setAmount('');
                    setExplanation('');
                    setAttachmentName('');
                    setFormError('');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 active:bg-blue-950 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-lime-400" />
                  <span>Submit Refund Request</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      )}

      {/* VIEW 2: VISUAL PROGRESS TRACKER */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          
          {/* Search / Lookup Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lookup by Reference (e.g. MB-REF-2026-8841) or Account Email..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-blue-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                Track Request
              </button>
            </form>

            {/* Quick sample chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Explore Existing Requests:</span>
              {requests.slice(0, 4).map((r) => {
                const converted = formatConverted(r.amount, r.currency);
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSearchQuery(r.referenceNumber);
                      setActiveTrackedRequest(r);
                    }}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-colors flex items-center gap-1.5 ${
                      activeTrackedRequest.id === r.id
                        ? 'bg-blue-900 dark:bg-blue-800 text-white border-blue-900 dark:border-blue-700'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{r.referenceNumber}</span>
                    <span className="font-semibold text-lime-600 dark:text-lime-400">
                      ({converted.formatted})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Global Currency Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Total Claims Value ({currentCurrency})
              </span>
              <span className="text-xl font-extrabold text-blue-950 dark:text-white font-mono mt-0.5 block">
                {formatCurrency(
                  requests.reduce((sum, r) => sum + convertAmount(r.amount, r.currency, currentCurrency), 0)
                )}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Across {requests.length} logged enterprise dispute cases
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Processed Reversals Payouts
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                {formatCurrency(
                  requests
                    .filter((r) => r.stage === 'processed')
                    .reduce((sum, r) => sum + convertAmount(r.amount, r.currency, currentCurrency), 0)
                )}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                100% credited to original accounts
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Active Benchmark Rate
              </span>
              <span className="text-sm font-extrabold text-blue-950 dark:text-white font-mono mt-1 block">
                1 USD ≈ {currencyDetail.rateToUSD < 1
                  ? currencyDetail.rateToUSD.toFixed(2)
                  : currencyDetail.rateToUSD.toLocaleString('en-US', { maximumFractionDigits: 1 })} {currencyDetail.symbol} ({currentCurrency})
              </span>
              <span className="text-[10px] text-lime-700 dark:text-lime-400 font-semibold">
                {currencyDetail.name} · {currencyDetail.region}
              </span>
            </div>
          </div>

          {/* Live Progress Tracker Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8 transition-colors duration-200">
            
            {/* Header: Request Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-lime-400 border border-blue-200 dark:border-blue-800/50 rounded-md">
                    {activeTrackedRequest.referenceNumber}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Invoice: {activeTrackedRequest.invoiceReference}
                  </span>
                  {activeTrackedRequest.isOfflineQueued && (
                    <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 rounded-md">
                      <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      Queued Offline (Pending Sync)
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-blue-950 dark:text-white">
                  {activeTrackedRequest.reason}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Submitted by <strong>{activeTrackedRequest.customerName}</strong> ({activeTrackedRequest.accountEmail}) on {activeTrackedRequest.submittedAt}
                </p>
              </div>

              {(() => {
                const convertedInfo = formatConverted(activeTrackedRequest.amount, activeTrackedRequest.currency);
                return (
                  <div className="text-left sm:text-right">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>Claim Amount</span>
                      {convertedInfo.isConverted && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 font-bold">
                          Converted to {currentCurrency}
                        </span>
                      )}
                    </div>
                    <span className="text-2xl font-extrabold text-blue-950 dark:text-white font-mono block">
                      {convertedInfo.formatted}
                    </span>
                    {convertedInfo.isConverted ? (
                      <div className="mt-0.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                          Original: {convertedInfo.originalFormatted} ({activeTrackedRequest.currency})
                        </span>
                        <span className="text-[10px] text-lime-700 dark:text-lime-400 font-mono">
                          {convertedInfo.exchangeRateDescription}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                        Settled in {activeTrackedRequest.currency}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      via {activeTrackedRequest.paymentMethod}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* VISUAL PROGRESS TRACKER (4 STAGES) */}
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Visual Resolution Lifecycle
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                    Current Status: <span className="font-bold text-blue-950 dark:text-lime-400 capitalize">{activeTrackedRequest.stage.replace('_', ' ')}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Estimated Turnaround</span>
                  <span className="text-xs font-bold text-lime-700 dark:text-lime-400">1 – 3 Business Days</span>
                </div>
              </div>

              {/* Progress Bar & Connected Steps */}
              <div className="relative">
                
                {/* Horizontal Connector Line for Desktop */}
                <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-slate-200 dark:bg-slate-700 z-0">
                  <div
                    className="h-1 bg-lime-500 transition-all duration-300"
                    style={{
                      width: `${(currentStepIndex / (trackerStages.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* 4 Stage Step Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                  {trackerStages.map((stage, idx) => {
                    const isCompleted = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;
                    const isDeclined = activeTrackedRequest.stage === 'declined' && idx === 2;

                    return (
                      <div
                        key={stage.id}
                        className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                          isCurrent
                            ? isDeclined
                              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-200 ring-2 ring-rose-400/40'
                              : 'bg-blue-900 dark:bg-blue-800 border-blue-950 dark:border-blue-700 text-white shadow-md ring-2 ring-lime-400/50'
                            : isCompleted
                            ? 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                            : 'bg-white dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
                        }`}
                      >
                        <div>
                          {/* Step Badge / Icon */}
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isCurrent
                                  ? 'bg-lime-400 text-blue-950'
                                  : isCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              STEP {stage.stepNumber}
                            </span>

                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {isCurrent && !isDeclined && (
                              <Clock className="w-4 h-4 text-lime-400 animate-spin" />
                            )}
                            {isDeclined && (
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            )}
                          </div>

                          <h5 className="font-bold text-sm">
                            {isDeclined ? 'Declined' : stage.label}
                          </h5>

                          <p className={`text-[11px] mt-1 leading-snug ${isCurrent ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                            {stage.description}
                          </p>
                        </div>

                        <div className={`mt-3 pt-3 border-t text-[10px] leading-relaxed ${
                          isCurrent
                            ? 'border-white/10 text-slate-300'
                            : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                        }`}>
                          {stage.detailText}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* Details Grid: Explanation & Reviewer Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-900 dark:text-lime-400" />
                  <span>Submitted Explanation & Context</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeTrackedRequest.detailedExplanation || 'No detailed explanation supplied.'}
                </p>
                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Payment Date: {activeTrackedRequest.paymentDate}
                </div>
              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-2">
                <span className="font-bold text-blue-950 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>MsmeBooks Internal Verification Notes</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeTrackedRequest.reviewerNotes || 'Preliminary review in queue with billing compliance team.'}
                </p>
                {activeTrackedRequest.gatewayTransactionId && (
                  <div className="pt-2 text-[11px] font-mono text-blue-900 dark:text-lime-400">
                    Gateway Payout Reference: <strong>{activeTrackedRequest.gatewayTransactionId}</strong>
                  </div>
                )}
              </div>

            </div>

            {/* Interactive Demo Control Bar: Test Every Stage */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Interactive Stage Simulation Control</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click any stage below to test how the visual progress tracker behaves:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => handleSimulateStageChange('submitted')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTrackedRequest.stage === 'submitted'
                      ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  1. Set to 'Submitted'
                </button>
                <button
                  onClick={() => handleSimulateStageChange('under_review')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTrackedRequest.stage === 'under_review'
                      ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  2. Set to 'Under Review'
                </button>
                <button
                  onClick={() => handleSimulateStageChange('approved')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTrackedRequest.stage === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  3. Set to 'Approved'
                </button>
                <button
                  onClick={() => handleSimulateStageChange('processed')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTrackedRequest.stage === 'processed'
                      ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  4. Set to 'Refund Processed'
                </button>
                <button
                  onClick={() => handleSimulateStageChange('declined')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTrackedRequest.stage === 'declined'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  Decline
                </button>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Fulfillment Activity Log
              </h5>
              <div className="space-y-2">
                {activeTrackedRequest.auditTrail.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900 dark:bg-lime-400 shrink-0" />
                      <span className="font-semibold text-blue-950 dark:text-white">{entry.action}</span>
                      <span className="text-slate-500 dark:text-slate-400">by {entry.actor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">{entry.note}</span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
};
