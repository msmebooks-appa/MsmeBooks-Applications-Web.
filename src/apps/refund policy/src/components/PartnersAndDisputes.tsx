import React from 'react';
import { 
  Users, 
  AlertOctagon, 
  Database, 
  ShieldCheck, 
  FileText, 
  Download, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';

export const PartnersAndDisputes: React.FC = () => {
  return (
    <div className="space-y-12">
      
      {/* Section 09: Partners, Resellers & Affiliates */}
      <section id="partners-resellers" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>09. Partner Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            Partners, Resellers, Distributors & Affiliates
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Clear delineation of commercial obligations, billing responsibility, and refund recourse for channel purchases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors shadow-xs">
            <h3 className="text-base font-bold text-blue-950 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Merchant of Record (MoR) Principle</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When a subscriber acquires MsmeBooks software through an authorized reseller, regional distributor, or certified accounting consultancy, the legal entity named on the commercial invoice is the <strong>Merchant of Record</strong> responsible for refund execution.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-700 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Direct Purchases:</p>
              <p>Invoices issued directly by MsmeBooks (www.msmebooks.org) are refunded directly through MsmeBooks billing channels.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-700 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Reseller Invoices:</p>
              <p>Purchases billed by certified partner firms are refunded via that partner, governed by the partner's service contract.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors shadow-xs">
            <h3 className="text-base font-bold text-blue-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-900 dark:text-lime-400" />
              <span>Commission Clawbacks & Fraud Prevention</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              To preserve partner network integrity and prevent affiliate abuse:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-slate-200">Commission Reversal:</strong> If an annual subscription is refunded during the 14-day grace window, associated partner commissions or referral credits are automatically reversed.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-200">Dispute Arbitration:</strong> If a partner fails to respond to a legitimate billing error within 5 business days, MsmeBooks customer relations desk will intervene directly.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-200">Partner-Fulfilled Services:</strong> Implementation or custom bookkeeping delivered by independent partners remains the sole contractual warranty of the provider.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Section 13: Failed Payments & Chargebacks */}
      <section id="payment-disputes" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>13. Dispute Governance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            Failed Payments, Chargebacks & Billing Disputes
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Resolving bank reconciliation discrepancies smoothly and preventing unintended administrative account suspension.
          </p>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-5 space-y-3 text-xs text-amber-950 dark:text-amber-200 transition-colors">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <AlertOctagon className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
            <h3 className="text-sm">Please Contact MsmeBooks Billing Support First</h3>
          </div>
          <p className="text-amber-900 dark:text-amber-300/90 leading-relaxed">
            Bank chargebacks are designed for criminal fraud. When an automated bank chargeback is initiated without prior communication, payment gateways (Paystack/Stripe/Flutterwave) automatically freeze the merchant account integration, which can trigger an automated temporary lock on your company's active accounting books.
          </p>
          <p className="text-amber-800 dark:text-amber-400">
            Filing a ticket with our billing desk or contacting us via WhatsApp at <strong>+234 915 848 2622</strong> typically resolves duplicate debits and ledger overcharges within <strong>24 business hours</strong> without freezing operational access for your sales staff and cashiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
            <h4 className="font-bold text-blue-950 dark:text-white">Bank Network Dropoffs</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              If your bank account was debited but your MsmeBooks subscription did not activate, our webhook auto-reconciles within 2 hours or queues an instant manual activation.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
            <h4 className="font-bold text-blue-950 dark:text-white">Unrecognized Transactions</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Check if a colleague or branch manager renewed an inventory tier. If unauthorized, alert our security team immediately for credential lockout and reversal.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
            <h4 className="font-bold text-blue-950 dark:text-white">Dispute Investigation</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We provide full audit trails, gateway logs, and IP timestamps to assist your bank or credit card issuer in verifying legitimate corporate expenditures.
            </p>
          </div>
        </div>
      </section>

      {/* Section 12 & 14: Data Retention & Account Closure */}
      <section id="data-retention" className="scroll-mt-24 space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            <span>12 & 14. Data Protection & Records Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
            Data Retention, Exports & Account Closure
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            How your financial ledgers, tax invoices, and customer transactions are safeguarded following subscription termination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center text-blue-900 dark:text-blue-400">
              <Download className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-blue-950 dark:text-white">90-Day Read-Only Export Window</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Upon subscription cancellation, your account transitions into read-only archive mode for 90 days. You can freely log in and export all data:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
              <li>General Ledger, Balance Sheets & P&L in Excel/CSV</li>
              <li>Complete Sales Invoice history & POS receipts</li>
              <li>Customer & Supplier master ledgers</li>
              <li>Inventory valuation & product catalogs</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-lime-50 dark:bg-lime-950/40 border border-lime-200 dark:border-lime-800/40 flex items-center justify-center text-lime-700 dark:text-lime-400">
              <Database className="w-4 h-4 text-lime-700 dark:text-lime-400" />
            </div>
            <h3 className="text-sm font-bold text-blue-950 dark:text-white">7-Year Statutory Tax Compliance</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Under Nigerian tax legislation (Companies Income Tax Act, FIRS mandates) and regional financial governance statutes, businesses are legally required to retain transaction records for 7 years.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              MsmeBooks maintains encrypted, tamper-evident archival records for statutory compliance purposes. We cannot immediately destroy tax-relevant ledger records subject to lawful regulatory retention.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-blue-950 dark:text-white">NDPR & Permanent Deletion Requests</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with the Nigeria Data Protection Act (NDPA) and NDPR regulations, subscribers may submit a formal "Right to Erasure" request for non-financial personal data (marketing preferences, operational cookies, staff contact cards).
            </p>
            <a
              href="mailto:privacy@msmebooks.org?subject=Data%20Erasure%20Request"
              className="text-xs font-semibold text-blue-900 dark:text-lime-400 hover:underline block pt-2"
            >
              Contact Data Protection Officer →
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
