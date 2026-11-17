import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  FileText, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Percent,
  CreditCard
} from 'lucide-react';
import { InvoiceRecord } from '../data/paymentGateways';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';

interface InvoiceReceiptModalProps {
  invoice: InvoiceRecord | null;
  onClose: () => void;
  onGoToDashboard?: () => void;
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  invoice,
  onClose,
  onGoToDashboard,
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  if (!invoice) return null;

  const [emailSent, setEmailSent] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const handleDownloadReceipt = () => {
    setDownloading(true);
    setTimeout(() => {
      // Trigger browser print or download text representation
      const element = document.createElement('a');
      const textContent = `
============================================================
              MSMEBOOKS CLOUD TECHNOLOGIES LTD
       OFFICIAL TAX INVOICE & PAYMENT RECEIPT
============================================================
Invoice Number:   ${invoice.invoiceNumber}
Date & Time:      ${invoice.date} ${invoice.time}
Status:           ${invoice.status} (Verified)
Payment Gateway:  ${invoice.paymentGatewayName}
Transaction Ref:  ${invoice.transactionReference}

CUSTOMER DETAILS:
Name:             ${invoice.customer.fullName}
Email:            ${invoice.customer.email}
Phone:            ${invoice.customer.phone}
Company:          ${invoice.customer.companyName || 'N/A'}
Tax ID / TIN:     ${invoice.customer.tin || 'N/A'}
Country/Region:   ${invoice.customer.country} (${invoice.customer.regionId})

ITEMS PURCHASED:
${invoice.items.map((it, idx) => `${idx + 1}. ${it.title} [${it.type.toUpperCase()}] - ${formatCurrency(it.priceNgn, invoice.currency)}`).join('\n')}

FINANCIAL BREAKDOWN:
Subtotal:         ${formatCurrency(invoice.subtotalNgn, invoice.currency)}
Promo Discount:  -${formatCurrency(invoice.discountAmountNgn, invoice.currency)} (${invoice.discountPercentage || 0}% OFF via ${invoice.discountCode || 'N/A'})
Net Taxable:      ${formatCurrency(invoice.netTaxableNgn, invoice.currency)}
7.5% Exclusive VAT: +${formatCurrency(invoice.vatAmountNgn, invoice.currency)}
------------------------------------------------------------
TOTAL PAID:       ${formatCurrency(invoice.totalAmountNgn, invoice.currency)}
============================================================
Issuer: MsmeBooks Enterprise Academy & Cloud ERP
RC: 1894210 · TIN: TIN-NG-24901842-001
This is an authentic computer-generated Pan-African tax receipt.
      `;
      const file = new Blob([textContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${invoice.invoiceNumber}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 max-h-[92vh]">
        
        {/* Modal Top Actions Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#72B01D]" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Tax Invoice &amp; Official Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors text-xs flex items-center gap-1.5 px-2.5 font-semibold"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors text-xs flex items-center gap-1.5 px-2.5 font-semibold"
              title="Download Receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white cursor-pointer transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0 print:m-0" id="printable-receipt">
          
          {/* Header with Organization Details & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B4F9C] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  M
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                    MsmeBooks Cloud Technologies Ltd
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Pan-African SaaS &amp; Executive Financial Academy
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5 leading-relaxed">
                <p>RC Number: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">RC-1894210</span> · TIN: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">TIN-NG-24901842-001</span></p>
                <p>Headquarters: Victoria Island Commercial Hub, Lagos | Upper Hill, Nairobi</p>
                <p>VAT Registration: Standard 7.5% Educational SaaS Exemption &amp; Compliance</p>
              </div>
            </div>

            {/* Official PAID Stamp */}
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-widest shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>PAID &amp; SETTLED</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 text-left sm:text-right">
                <p className="font-mono font-bold text-slate-900 dark:text-white">{invoice.invoiceNumber}</p>
                <p className="text-[10px]">{invoice.date} · {invoice.time}</p>
              </div>
            </div>
          </div>

          {/* Customer & Transaction Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Billed To (Customer):
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                {invoice.customer.fullName}
              </p>
              {invoice.customer.companyName && (
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {invoice.customer.companyName}
                </p>
              )}
              <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {invoice.customer.email}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {invoice.customer.phone} · {invoice.customer.country}
              </p>
              {invoice.customer.tin && (
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Customer TIN: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{invoice.customer.tin}</span>
                </p>
              )}
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Payment Channel Details:
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                <CreditCard className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                <span>{invoice.paymentGatewayName}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Transaction Reference:
              </p>
              <p className="font-mono font-semibold text-[10px] text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-700">
                {invoice.transactionReference}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>3D-Secure Authenticated &amp; Verified</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Purchased Subscriptions &amp; Courses
            </h4>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Type</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.category || 'Executive Accounting'} {item.duration ? `· ${item.duration}` : ''}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="uppercase text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.priceNgn, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation Breakdown with 7.5% Exclusive VAT */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
            
            {/* Left: Statutory Compliance & Notes */}
            <div className="sm:max-w-xs space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 space-y-1">
                <p className="font-bold text-[#0B4F9C] dark:text-blue-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Statutory Tax &amp; Audit Reference
                </p>
                <p className="leading-relaxed">
                  Value Added Tax is charged at the statutory rate of 7.5% exclusive on the net taxable amount. Fully deductible for registered VAT commercial entities.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <QrCode className="w-8 h-8 text-slate-600 dark:text-slate-300 shrink-0" />
                <span className="text-[9px] leading-tight">
                  Scan QR with any banking or tax app to verify digital certificate authenticity on MsmeBooks ledger.
                </span>
              </div>
            </div>

            {/* Right: Calculations with Clear Savings and 7.5% VAT */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Gross Subtotal:</span>
                <span className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {formatCurrency(invoice.subtotalNgn, invoice.currency)}
                </span>
              </div>

              {invoice.discountAmountNgn > 0 && (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 space-y-0.5">
                  <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-300 font-bold">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      Promo ({invoice.discountCode}):
                    </span>
                    <span className="font-mono tabular-nums">
                      -{formatCurrency(invoice.discountAmountNgn, invoice.currency)}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-200 font-extrabold text-right">
                    You saved {formatCurrency(invoice.discountAmountNgn, invoice.currency)} ({invoice.discountPercentage}% OFF)!
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Net Taxable Base:</span>
                <span className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                  {formatCurrency(invoice.netTaxableNgn, invoice.currency)}
                </span>
              </div>

              {/* 7.5% EXCLUSIVE VAT SECTION */}
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-0.5">
                <div className="flex justify-between items-center text-amber-900 dark:text-amber-200 font-extrabold">
                  <span className="flex items-center gap-1">
                    VAT (7.5% Exclusive):
                  </span>
                  <span className="font-mono tabular-nums">
                    +{formatCurrency(invoice.vatAmountNgn, invoice.currency)}
                  </span>
                </div>
                <p className="text-[9px] text-amber-800 dark:text-amber-300 leading-tight">
                  Statutory 7.5% commercial Value Added Tax applied exclusively.
                </p>
              </div>

              {/* Grand Total */}
              <div className="pt-2 border-t-2 border-slate-900 dark:border-white flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                <span>Total Paid:</span>
                <span className="text-[#0B4F9C] dark:text-blue-400 font-mono text-base tabular-nums">
                  {formatCurrency(invoice.totalAmountNgn, invoice.currency)}
                </span>
              </div>
            </div>

          </div>

          {/* Feedback banner if emailed */}
          {emailSent && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official tax invoice &amp; receipt successfully sent to <strong>{invoice.customer.email}</strong>.</span>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEmailInvoice}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Receipt</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Done
            </button>
            {onGoToDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onGoToDashboard();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Access My Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
