import React from 'react';
import { X, FileText, Printer } from 'lucide-react';

interface PartnerAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerAgreementModal: React.FC<PartnerAgreementModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#101e35] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl relative my-8 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-[#101e35] z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1261B5] dark:text-[#B9E51C] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#142D4E] dark:text-white">
                MsmeBooks Official Partner Agreement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Terms of Participation, Referral Attribution & Recurring Commission Policies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print Agreement"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close agreement modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Text Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed overflow-y-auto">
          <div className="bg-slate-50 dark:bg-[#0c182c] p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <strong>Document Reference:</strong> MSME-AGR-2026-V4 · Effective Date: October 2026. This Agreement governs participation in the MsmeBooks Partner Commission Program by individuals and registered business entities.
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">1. Scope & Program Eligibility</h4>
            <p>
              MsmeBooks offers cloud accounting, Point of Sale (POS), inventory management, and payroll software to small and medium enterprises. Qualified participants (accountants, consultants, software resellers, IT providers, and business advisors) may apply to refer clients in exchange for recurring commissions under approved tier schedules.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">2. Four Partner Commission Levels</h4>
            <p>
              Commissions are calculated as a percentage of net eligible monthly or annual subscription revenue received by MsmeBooks from attributed customers:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Bronze Partner:</strong> 15% recurring commission on eligible subscriptions.</li>
              <li><strong>Silver Partner:</strong> 20% recurring commission on eligible subscriptions.</li>
              <li><strong>Gold Partner:</strong> 30% recurring commission on eligible subscriptions.</li>
              <li><strong>Platinum Partner:</strong> 40% recurring commission on eligible subscriptions.</li>
            </ul>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              *Net subscription revenue excludes statutory value-added tax (VAT), sales taxes, payment gateway processing deductions, and promotional customer coupons.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">3. Referral Attribution & Tracking</h4>
            <p>
              Attribution is established via the partner’s designated tracking URL (with 90-day cookie window) or through entry of the partner's unique alphanumeric partner code during checkout. In the event of conflicting claims, the direct partner checkout code takes precedence over historical click cookies.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">4. Clearance Period & Payout Cycles</h4>
            <p>
              To protect against fraud, customer trial abandonment, or chargebacks, earned commissions undergo a <strong>30-day clearance cycle</strong> before maturing into available payout balances. Payouts are disbursed on the 15th and end of each calendar month. The minimum payout threshold is <strong>₦20,000 NGN</strong> (or $50 USD / foreign currency equivalent).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">5. Refunds, Cancellations & Chargebacks</h4>
            <p>
              If an attributed customer terminates their subscription, commissions cease for future billing periods. If a previously credited transaction is refunded or disputed by the customer's financial institution, MsmeBooks will debit the corresponding commission amount from the partner's account balance.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">6. Ethical Promotion & Brand Standards</h4>
            <p>
              Partners must conduct marketing in an ethical and transparent manner. Prohibited activities include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Unsolicited spam emails, SMS blasts, or automated social messaging.</li>
              <li>Bidding on protected trademarks (e.g. "MsmeBooks", "MsmeBooks Login") in paid search ads without prior written permission.</li>
              <li>Misrepresenting software capabilities, subscription prices, or promising unapproved third-party certifications.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">7. Governing Law & Dispute Resolution</h4>
            <p>
              This Agreement shall be interpreted and governed by the laws of the Federal Republic of Nigeria and applicable regional digital commerce regulations. Both parties agree to resolve any dispute in good faith via the designated MsmeBooks Partner Concierge before pursuing statutory arbitration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0c182c] border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs sticky bottom-0">
          <span className="text-slate-500 dark:text-slate-400">Official MsmeBooks Legal Policy · Confidential</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94]"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
