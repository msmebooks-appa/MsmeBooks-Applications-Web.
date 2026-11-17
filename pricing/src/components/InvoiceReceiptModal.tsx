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
  Receipt,
  ExternalLink,
  Sparkles,
  Palette,
  Edit3,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { getComplianceForCountry } from '../data/countryCompliance';

export const InvoiceReceiptModal: React.FC = () => {
  const {
    lastInvoice,
    isInvoiceModalOpen,
    closeInvoiceModal,
  } = useCart();

  const { format, activeCurrency } = useCurrency();
  const [docType, setDocType] = useState<'receipt' | 'invoice'>('invoice');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showBrandingPanel, setShowBrandingPanel] = useState(false);
  const [brandAccentColor, setBrandAccentColor] = useState<string>('#0A4FD5');
  const [customTin, setCustomTin] = useState<string>('24810932-0001');
  const [customBankDetails, setCustomBankDetails] = useState<string>('Zenith Bank • Account: 1018492044 • MsmeBooks Technologies Ltd');

  if (!isInvoiceModalOpen || !lastInvoice) return null;

  const customerCompliance = getComplianceForCountry(lastInvoice.customer.country);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textData = `
==================================================================
           MSMEBOOKS TECHNOLOGIES LIMITED - OFFICIAL ${docType.toUpperCase()}
==================================================================
RC Number: 1829402 | TIN: 24810932-0001 | VAT Reg: 10482910-0001
Address: 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
Phone: +234 915 848 2622 | Email: billing@msmebooks.org
Web: https://www.msmebooks.org

${docType === 'receipt' ? 'RECEIPT NUMBER' : 'INVOICE NUMBER'}: ${
      docType === 'receipt' ? lastInvoice.receiptNumber : lastInvoice.invoiceNumber
    }
Transaction Reference: ${lastInvoice.transactionReference}
Date: ${lastInvoice.date}
Payment Gateway: ${lastInvoice.paymentGateway.name} (${lastInvoice.paymentGateway.regionName})
Payment Method: ${lastInvoice.paymentMethodUsed}
Status: ${lastInvoice.status} (VERIFIED & CONFIRMED)

------------------------------------------------------------------
CUSTOMER BILLING DETAILS:
------------------------------------------------------------------
Business Name: ${lastInvoice.customer.businessName}
Customer Name: ${lastInvoice.customer.fullName}
Email: ${lastInvoice.customer.email}
Phone: ${lastInvoice.customer.phone}
Billing Address: ${lastInvoice.customer.billingAddress}, ${lastInvoice.customer.city}, ${lastInvoice.customer.country}
Customer TIN: ${lastInvoice.customer.taxIdentificationNumber || 'N/A'}

------------------------------------------------------------------
ITEMIZED SUBSCRIPTION BREAKDOWN:
------------------------------------------------------------------
${lastInvoice.items
  .map(
    (i, idx) =>
      `${idx + 1}. ${i.planName} Plan (${i.billingPeriod.toUpperCase()}) - Duration: ${i.quantity} ${i.quantity === 1 ? 'Month' : 'Months'}
   Monthly Rate: ${format(i.basePriceNgn)}/mo | Subtotal: ${format(i.basePriceNgn * i.quantity)}
   ${i.addOns?.extraBranches ? `+ Extra Branches: ${i.addOns.extraBranches}\n   ` : ''}${
        i.addOns?.extraWarehouses ? `+ Extra Depots: ${i.addOns.extraWarehouses}\n   ` : ''
      }${i.addOns?.priorityPhoneSla ? `+ Priority Phone SLA: Active\n   ` : ''}`
  )
  .join('\n')}

------------------------------------------------------------------
FINANCIAL SUMMARY & STATUTORY TAX:
------------------------------------------------------------------
Gross Subtotal:             ${format(lastInvoice.subtotalNgn)}
Annual Billing Savings:     -${format(lastInvoice.planSavingsNgn)}
Promo Code Discount:        -${format(lastInvoice.promoDiscountNgn)} ${
      lastInvoice.promoCode ? `(${lastInvoice.promoCode})` : ''
    }
Net Taxable Amount:         ${format(lastInvoice.netTaxableAmountNgn)}
Exclusive VAT (${lastInvoice.vatRatePercent}%):         +${format(lastInvoice.vatAmountNgn)}
------------------------------------------------------------------
TOTAL AMOUNT PAID:          ${format(lastInvoice.totalPaidNgn)}
------------------------------------------------------------------

Thank you for choosing MsmeBooks - Powering African SMEs!
==================================================================
`;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lastInvoice.customer.businessName.replace(/\s+/g, '_')}_${docType}_${lastInvoice.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    setIsEmailSent(true);
    setTimeout(() => setIsEmailSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white dark:bg-[#0B192C] rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[95vh] flex flex-col print:border-none print:shadow-none print:max-w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          {/* Switch Document Type */}
          <div className="flex items-center gap-2">
            <div className="inline-flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setDocType('receipt')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  docType === 'receipt' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Payment Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setDocType('invoice')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  docType === 'invoice' ? 'bg-[#0A4FD5] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBrandingPanel(!showBrandingPanel)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                showBrandingPanel
                  ? 'bg-[#0A4FD5] text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="Customize invoice branding colors and company TIN"
            >
              <Palette className="w-3.5 h-3.5 text-lime-400" />
              <span>Branding</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A4FD5] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Download professional PDF invoice or print"
            >
              <Printer className="w-3.5 h-3.5 text-lime-400" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Download plain text receipt"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Email copy to customer"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={closeInvoiceModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Branding Customizer Panel */}
        {showBrandingPanel && (
          <div className="p-4 bg-slate-800 text-white border-b border-slate-700 text-xs shrink-0 print:hidden space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-extrabold flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Invoice Branding & Tax Customization</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Customizes PDF download & print styles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Brand Accent Theme:
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Royal Blue', color: '#0A4FD5' },
                    { name: 'Emerald Green', color: '#059669' },
                    { name: 'Crimson Maroon', color: '#DC2626' },
                    { name: 'Amber Gold', color: '#D97706' },
                    { name: 'Charcoal Slate', color: '#1E293B' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setBrandAccentColor(c.color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        brandAccentColor === c.color ? 'scale-120 border-white ring-2 ring-lime-400' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Company TIN / CAC Registration:
                </label>
                <input
                  type="text"
                  value={customTin}
                  onChange={(e) => setCustomTin(e.target.value)}
                  placeholder="e.g. 24810932-0001"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Bank Settlement Remittance Note:
                </label>
                <input
                  type="text"
                  value={customBankDetails}
                  onChange={(e) => setCustomBankDetails(e.target.value)}
                  placeholder="Bank details note"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Email feedback notification */}
        {isEmailSent && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-bold animate-in fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Official {docType === 'receipt' ? 'Receipt' : 'Tax Invoice'} emailed to {lastInvoice.customer.email}!</span>
          </div>
        )}

        {/* Printable Document Body */}
        <div id="printable-receipt" className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200 print:text-black print:p-0">
          
          {/* Header Row: Company Monogram & Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md"
                style={{ backgroundColor: brandAccentColor }}
              >
                M
              </div>
              <div>
                <h1 className="text-xl font-black text-[#0B192C] dark:text-white print:text-black">
                  Msme<span style={{ color: brandAccentColor }}>Books</span> Technologies Ltd
                </h1>
                <p className="text-xs text-slate-500">
                  RC: 1829402 • TIN: {customTin} • VAT Reg: 10482910-0001
                </p>
                <p className="text-[11px] text-slate-400">
                  14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria • +234 915 848 2622
                </p>
              </div>
            </div>

            {/* Document Title Badge & Stamp */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIAL {docType === 'receipt' ? 'PAYMENT RECEIPT' : 'TAX INVOICE'}</span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-1">
                {docType === 'receipt' ? lastInvoice.receiptNumber : lastInvoice.invoiceNumber}
              </div>
            </div>
          </div>

          {/* Meta Grid: Dates, Customer, Gateway */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-[#071324] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 print:bg-white print:border">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To (Customer):
              </span>
              <div className="font-extrabold text-slate-900 dark:text-white print:text-black text-sm">
                {lastInvoice.customer.businessName}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Attn: {lastInvoice.customer.fullName}
              </div>
              <div className="text-slate-500">{lastInvoice.customer.email}</div>
              <div className="text-slate-500">{lastInvoice.customer.phone}</div>
              <div className="text-slate-500">
                {lastInvoice.customer.billingAddress}, {lastInvoice.customer.city}, {lastInvoice.customer.country}
              </div>
              {lastInvoice.customer.taxIdentificationNumber && (
                <div className="text-[11px] font-mono text-[#0A4FD5] mt-0.5">
                  Client TIN: {lastInvoice.customer.taxIdentificationNumber}
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Transaction Reference:
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-white print:text-black">
                {lastInvoice.transactionReference}
              </div>
              <div className="mt-2 text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Issue Date:</span> {lastInvoice.date}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Status:</span>{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">PAID IN FULL</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold">Currency:</span> {lastInvoice.currency} ({activeCurrency.symbol})
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payment Method & Gateway:
              </span>
              <div className="font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                <span>{lastInvoice.paymentGateway.flag}</span>
                <span>{lastInvoice.paymentGateway.name}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {lastInvoice.paymentGateway.regionName}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-mono">
                Channel: {lastInvoice.paymentMethodUsed}
              </div>
              <div className="mt-2 text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified by Automated Bank Settlement</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden print:border">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] print:bg-slate-100">
                <tr>
                  <th className="p-3.5">Item & Description</th>
                  <th className="p-3.5 text-center">Period</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Unit Price</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 print:text-black">
                {lastInvoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                        MsmeBooks {item.planName} Plan Subscription
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Full cloud access, 100% offline POS synchronization, multi-user accounting & analytics.
                      </div>
                      {item.addOns && (
                        <div className="text-[10px] text-slate-400 mt-1 space-x-2">
                          {item.addOns.extraBranches ? <span>• +{item.addOns.extraBranches} Extra Branch POS</span> : null}
                          {item.addOns.extraWarehouses ? <span>• +{item.addOns.extraWarehouses} Depots</span> : null}
                          {item.addOns.priorityPhoneSla ? <span>• 24/7 Phone SLA</span> : null}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-center capitalize font-medium">
                      {item.billingPeriod === 'yearly' ? 'Annual (12 Months)' : 'Monthly'}
                    </td>
                    <td className="p-3.5 text-center font-bold">{item.quantity}</td>
                    <td className="p-3.5 text-right font-medium">{format(item.basePriceNgn)}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white print:text-black">
                      {format(item.basePriceNgn * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Breakdown & 7.5% Exclusive VAT Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start pt-2">
            
            {/* Left: Statutory Compliance Statement & Stamp */}
            <div className="bg-slate-50 dark:bg-[#071324] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-3 print:bg-white print:border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
                  <span>{customerCompliance.flag} {customerCompliance.name} Statutory Tax Compliance</span>
                </div>
                <span className="text-[10px] font-bold text-[#0A4FD5] dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {customerCompliance.taxAuthority.split('/')[0].trim()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Official tax document compliant with {customerCompliance.taxAuthority}. Standard exclusive VAT at {lastInvoice.vatRatePercent}% computed pursuant to statutory digital economy guidelines. Next scheduled filing return: <span className="font-semibold text-slate-700 dark:text-slate-300">{customerCompliance.vatFilingDeadline}</span>.
              </p>

              {/* Digital QR Code & Stamp */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 bg-white p-1 rounded-xl border border-slate-300 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    Digital Verification Key
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    VERIFIED_OK_{lastInvoice.transactionReference.slice(-6)}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Scan to verify authenticity on registry.msmebooks.org
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Numbers Calculation & Exclusive VAT */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal (Net of Discounts):</span>
                <span className="font-medium text-slate-900 dark:text-white print:text-black">
                  {format(lastInvoice.subtotalNgn)}
                </span>
              </div>

              {lastInvoice.planSavingsNgn > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Annual Billing Discount (20% OFF):</span>
                  <span>-{format(lastInvoice.planSavingsNgn)}</span>
                </div>
              )}

              {lastInvoice.promoDiscountNgn > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-300/40">
                  <span>Promotion Code ({lastInvoice.promoCode || 'PROMO'}):</span>
                  <span>Amount Saved: -{format(lastInvoice.promoDiscountNgn)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Net Taxable Amount:</span>
                <span className="font-bold">{format(lastInvoice.netTaxableAmountNgn)}</span>
              </div>

              {/* STATUTORY REGIONAL TAX LINE ITEM */}
              <div className="flex justify-between items-center bg-blue-50/80 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white print:border print:bg-white">
                <div>
                  <div className="font-extrabold text-[#0A4FD5] dark:text-blue-300">
                    {lastInvoice.taxSchemeName || 'Statutory VAT'} ({lastInvoice.vatRatePercent}%)
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {lastInvoice.taxAuthority || `${customerCompliance.taxAuthority.split('/')[0].trim()} Standard Rate`}
                    {lastInvoice.isTaxExempt ? ' • 0% B2B Reverse-Charge Exemption' : ''}
                  </div>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white print:text-black">
                  +{format(lastInvoice.vatAmountNgn)}
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline pt-2 border-t-2 border-slate-300 dark:border-slate-700">
                <span className="text-sm font-black text-slate-900 dark:text-white print:text-black uppercase">
                  Total Paid:
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#0A4FD5] dark:text-blue-400 print:text-black">
                    {format(lastInvoice.totalPaidNgn)}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Includes all 7.5% exclusive VAT • Zero pending balance
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400 print:text-slate-600 space-y-1">
            <p className="font-semibold text-slate-600 dark:text-slate-300 print:text-black">
              Thank you for trusting MsmeBooks as your African business partner!
            </p>
            <p>
              For enterprise queries, support, or billing adjustments, contact billing@msmebooks.org or call +234 915 848 2622.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
