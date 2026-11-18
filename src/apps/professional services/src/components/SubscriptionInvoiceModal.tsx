import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  FileText, 
  QrCode, 
  Calendar,
  Lock,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { SubscriptionInvoiceReceipt } from '../types/payment';
import { useCurrency } from '../context/CurrencyContext';

interface SubscriptionInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: SubscriptionInvoiceReceipt | null;
}

export const SubscriptionInvoiceModal: React.FC<SubscriptionInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { formatAmount } = useCurrency();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const textContent = `
============================================================
              MSMEBOOKS PARTNER NETWORK
        PROFESSIONAL PRACTICE SHOWCASE TAX INVOICE
============================================================
Receipt No:      ${invoice.receiptNumber}
Invoice No:      ${invoice.invoiceNumber}
Date Issued:     ${new Date(invoice.issuedAt).toLocaleDateString()} ${new Date(invoice.issuedAt).toLocaleTimeString()}
Status:          ${invoice.status.toUpperCase()} (Payment Cleared & Verified)
------------------------------------------------------------
PARTNER PRACTICE DETAILS:
Practice / Firm: ${invoice.customer.businessName || invoice.customer.fullName}
Managing Partner: ${invoice.customer.fullName}
${invoice.customer.practiceLicenseNumber ? `Practice Reg No:  ${invoice.customer.practiceLicenseNumber}\n` : ''}${invoice.customer.taxIdOrTIN ? `Tax ID / TIN:     ${invoice.customer.taxIdOrTIN}\n` : ''}Location:        ${invoice.customer.city}, ${invoice.customer.country}
Email:           ${invoice.customer.email}
Phone:           ${invoice.customer.phone}
------------------------------------------------------------
DIRECTORY SHOWCASE SUBSCRIPTION:
Tier:            ${invoice.plan.name} (${invoice.plan.billingCycle})
Coverage:        ${invoice.partnerDetails?.countryCoverage || 'Pan-African & Global Directories'}
Base Price:      ${formatAmount(invoice.plan.basePriceNGN)}
${invoice.extraModules && invoice.extraModules.length > 0 ? `\nADDITIONAL MODULES:\n${invoice.extraModules.map(m => ` - ${m.name}: ${formatAmount(m.priceNGN)}`).join('\n')}\n` : ''}------------------------------------------------------------
FINANCIAL BREAKDOWN:
Subtotal:        ${formatAmount(invoice.pricing.subtotalBeforeDiscountNGN)}
${invoice.pricing.promoCodeApplied ? `Discount (${invoice.pricing.promoCodeApplied} - ${invoice.pricing.discountPercent}%): -${formatAmount(invoice.pricing.discountAmountNGN)}\n` : ''}Net Subtotal:    ${formatAmount(invoice.pricing.subtotalAfterDiscountNGN)}
VAT (7.5% Exclusive): ${formatAmount(invoice.pricing.vatAmountNGN)}
============================================================
TOTAL PAID:      ${formatAmount(invoice.pricing.totalAmountPaidNGN)}
============================================================
PAYMENT RAIL & GATEWAY:
Gateway:         ${invoice.payment.gatewayName}
Transaction Ref: ${invoice.payment.transactionReference}
Channel:         ${invoice.payment.channelUsed}
Cleared At:      ${new Date(invoice.paidAt).toLocaleTimeString()}
------------------------------------------------------------
Directory Profile Activated: https://www.msmebooks.org/directory
Partner Support: partners@msmebooks.org | +234 915 848 2622
============================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MsmeBooks-PartnerReceipt-${invoice.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(invoice.payment.transactionReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 bg-[#102B4E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1464C8] text-white font-black text-sm flex items-center justify-center shadow-xs">
              MB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">
                  Tax Invoice & Payment Receipt
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3" /> PAID
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Receipt #{invoice.receiptNumber} • Invoice #{invoice.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="p-2 rounded-xl bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Download Receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 bg-white dark:bg-[#07111D] text-xs">
          
          {/* Company & Customer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold text-[#1464C8] dark:text-[#B7E532] uppercase tracking-wider block mb-1">
                Issued By (Merchant of Record)
              </span>
              <h4 className="font-black text-sm text-[#102B4E] dark:text-white">
                MsmeBooks Technologies Ltd
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Cloud Enterprise Accounting & Point of Sale Systems<br />
                Pan-African Operational Headquarters<br />
                RC: 1849204 • Tax Identification: 24819402-0001<br />
                VAT Registered (7.5% Statutory Exclusive Rate)
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To (Partner Firm / Subscriber)
              </span>
              <h4 className="font-black text-sm text-[#102B4E] dark:text-white">
                {invoice.customer.businessName || invoice.customer.fullName}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Lead Partner: <strong>{invoice.customer.fullName}</strong><br />
                {invoice.customer.city}, {invoice.customer.country}<br />
                Email: {invoice.customer.email}<br />
                Phone: {invoice.customer.phone}<br />
                {invoice.customer.practiceLicenseNumber && (
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">
                    Practice License / Reg: {invoice.customer.practiceLicenseNumber}
                  </span>
                )}
                {invoice.customer.taxIdOrTIN && (
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Tax Identification / TIN: {invoice.customer.taxIdOrTIN}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Partner Directory Listing Status */}
          {invoice.partnerDetails && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-slate-700 dark:text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Official Partner Directory Showcase Activated
                </span>
                <span className="font-bold text-[10px] bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                  {invoice.partnerDetails.tierName}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                <div>Directory Coverage: <strong>{invoice.partnerDetails.countryCoverage}</strong></div>
                <div>Status Badges: <strong>{invoice.partnerDetails.directoryBadges.join(' · ')}</strong></div>
              </div>
            </div>
          )}

          {/* Invoice Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0A1727] border border-slate-200 dark:border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 block">Issue Date</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {new Date(invoice.issuedAt).toLocaleDateString()}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Date</span>
              <strong className="text-emerald-600 dark:text-emerald-400">
                {new Date(invoice.paidAt).toLocaleDateString()}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Rail</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {invoice.payment.gatewayName}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Billing Cycle</span>
              <strong className="text-[#1464C8] dark:text-[#B7E532]">
                {invoice.plan.billingCycle} Access
              </strong>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Partner Showcase & Directory Subscription Breakdown
            </h4>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#0E2036] text-[11px] font-extrabold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">Subscription Showcase Service</th>
                    <th className="p-3">Directory Scope</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Main Product Plan */}
                  <tr className="bg-white dark:bg-[#07111D]">
                    <td className="p-3">
                      <div className="font-extrabold text-slate-800 dark:text-white">
                        {invoice.plan.name}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Professional Practice Showcase & Client Intake Desk ({invoice.plan.billingCycle} Access)
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">
                      {invoice.partnerDetails?.countryCoverage || 'Regional Directory'}
                    </td>
                    <td className="p-3 text-right font-black text-slate-800 dark:text-white">
                      {formatAmount(invoice.plan.basePriceNGN)}
                    </td>
                  </tr>

                  {/* Extra Extensible Modules if any */}
                  {invoice.extraModules && invoice.extraModules.length > 0 && invoice.extraModules.map((mod) => (
                    <tr key={mod.id} className="bg-slate-50/50 dark:bg-[#091524]">
                      <td className="p-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></span>
                          <span>{mod.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Special Extended Module
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">
                        Add-on
                      </td>
                      <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-200">
                        {formatAmount(mod.priceNGN)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals & 7.5% VAT Section */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-2 flex-1">
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-[#1464C8] dark:text-[#B7E532] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory Tax & Regulatory Notice</span>
                </div>
                <p className="leading-relaxed">
                  Value Added Tax (VAT) is charged at the mandatory statutory rate of <strong>7.5% exclusive</strong> in accordance with regional tax laws. All charges are backed by automated tax compliance ledgers.
                </p>
              </div>

              {/* Transaction Ref Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A1727] border border-slate-200 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400">Txn Reference:</span>
                <div className="flex items-center gap-1 font-mono font-bold text-[#1464C8] dark:text-[#B7E532]">
                  <span>{invoice.payment.transactionReference}</span>
                  <button onClick={handleCopyRef} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer">
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Numerical Totals Box */}
            <div className="w-full sm:w-72 space-y-2 bg-slate-50 dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatAmount(invoice.pricing.subtotalBeforeDiscountNGN)}
                </span>
              </div>

              {invoice.pricing.discountAmountNGN > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount ({invoice.pricing.promoCodeApplied}):</span>
                  <span>-{formatAmount(invoice.pricing.discountAmountNGN)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Net Taxable Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatAmount(invoice.pricing.subtotalAfterDiscountNGN)}
                </span>
              </div>

              {/* Explicit 7.5% Exclusive VAT Section */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-extrabold border border-amber-200 dark:border-amber-900/60">
                <span className="flex items-center gap-1">
                  <span>VAT (7.5% Exclusive):</span>
                </span>
                <span>+{formatAmount(invoice.pricing.vatAmountNGN)}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm">
                <span className="font-black text-[#102B4E] dark:text-white">Total Amount Paid:</span>
                <span className="font-black text-base text-[#1464C8] dark:text-[#B7E532]">
                  {formatAmount(invoice.pricing.totalAmountPaidNGN)}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Seal */}
          <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-slate-400" />
              <span>Digital Verification ID: <strong>{invoice.receiptNumber}</strong> • Cryptographically Signed</span>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cleared on {invoice.payment.gatewayName}
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-[#060F1A] px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Close Receipt
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`MsmeBooks Subscription Receipt: ${invoice.receiptNumber} for ${invoice.plan.name}. Amount Paid: ${formatAmount(invoice.pricing.totalAmountPaidNGN)} (VAT 7.5% Included). Reference: ${invoice.payment.transactionReference}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share to WhatsApp</span>
            </a>

            <button
              onClick={handleDownloadReceipt}
              className="px-4 py-2 rounded-xl bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Receipt (.txt)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
