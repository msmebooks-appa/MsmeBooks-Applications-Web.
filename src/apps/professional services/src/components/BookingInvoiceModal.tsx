import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  QrCode,
  FileText
} from 'lucide-react';
import { BookingRecord } from '../types/booking';
import { useCurrency } from '../context/CurrencyContext';

interface BookingInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord;
}

export const BookingInvoiceModal: React.FC<BookingInvoiceModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const { formatAmount } = useCurrency();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const isCompletedReceipt = booking.status === 'Completed' || booking.paymentStatus === 'Paid';
  const invoiceNumber = `${isCompletedReceipt ? 'RCT' : 'INV'}-${booking.reference.replace('MSME-', '')}-${new Date(booking.createdAt).getFullYear()}`;
  const issueDate = new Date(booking.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const dueDate = booking.appointmentDate || issueDate;

  // Derive itemized financial values
  const breakdown = booking.billingBreakdown || {
    frequency: booking.billingFrequency || 'days',
    units: booking.billingUnits || 1,
    unitLabel: `${booking.billingUnits || 1} ${booking.billingUnitType || 'Units'}`,
    unitRateNGN: 45000,
    subtotalNGN: 45000 * (booking.billingUnits || 1),
    discountPercent: 0,
    discountNGN: 0,
    vatNGN: Math.round(45000 * (booking.billingUnits || 1) * 0.075),
    totalNGN: Math.round(45000 * (booking.billingUnits || 1) * 1.075),
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Print-only CSS to isolate the invoice sheet when saving as PDF or printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice-sheet, #printable-invoice-sheet * {
            visibility: visible !important;
          }
          #printable-invoice-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="bg-[#102B4E] dark:bg-[#07111D] px-6 py-4 text-white flex items-center justify-between border-b border-slate-700 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#B7E532]" />
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                {isCompletedReceipt ? 'Official Tax Receipt & Payment Certificate' : 'Official Tax Invoice & Receipt'}
              </h3>
              <p className="text-xs text-slate-300">
                {isCompletedReceipt ? 'Receipt Ref:' : 'Invoice No:'} {invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Download clean printable PDF or print document"
            >
              <Download className="w-3.5 h-3.5 text-[#102B4E]" />
              <span>Download PDF Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet */}
        <div className="overflow-y-auto p-6 sm:p-10 flex-1 bg-white dark:bg-[#08121E]">
          <div id="printable-invoice-sheet" ref={printRef} className="space-y-8 bg-white dark:bg-[#0A1727] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            
            {/* Top Brand & Metadata Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1464C8] text-white flex items-center justify-center font-black text-sm">
                    MB
                  </div>
                  <span className="text-xl font-black text-[#102B4E] dark:text-white">
                    Msme<span className="text-[#1464C8]">Books</span> Professional Services
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Official Pan-African MSME Accounting, Audit & Advisory Marketplace.
                  <br />
                  FIRS TIN: 24910291-0001 • Corporate Affairs Registry RC: 1849104
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-[#B7E532] text-xs font-black rounded-full border border-emerald-200 dark:border-emerald-800">
                  {booking.status === 'Completed' ? 'PAID & COMPLETED RECEIPT' : booking.paymentStatus === 'Paid' ? 'PAID & ESCROW VERIFIED' : 'CONFIRMED APPOINTMENT'}
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Issue Date: <strong className="text-slate-800 dark:text-slate-200">{issueDate}</strong>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Service Date: <strong className="text-slate-800 dark:text-slate-200">{dueDate}</strong>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Booking Ref: <strong className="font-mono text-[#1464C8] dark:text-[#B7E532]">{booking.reference}</strong>
                </div>
              </div>
            </div>

            {/* Billed To vs Executing Provider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Billed To (Client Enterprise)
                </span>
                <div className="font-extrabold text-sm text-[#102B4E] dark:text-white">
                  {booking.businessName || booking.customerName}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Attn: {booking.customerName}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {booking.city}, {booking.country}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Email: {booking.customerEmail} • Tel: {booking.customerPhone}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0D1D31] p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Executing Practice Firm
                </span>
                <div className="font-extrabold text-sm text-[#102B4E] dark:text-white flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#1464C8]" />
                  <span>{booking.providerName}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Classification: {booking.providerType || 'Certified Chartered Firm'}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Delivery Mode: {booking.consultationMode}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Time Slot: {booking.timeSlot}
                </div>
              </div>
            </div>

            {/* Itemized Service Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-3">Scope Tier</th>
                    <th className="py-3 px-3">Units</th>
                    <th className="py-3 px-3 text-right">Unit Rate</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                      <div>{booking.serviceTitle}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        Billing Model: {booking.billingFrequency ? booking.billingFrequency.toUpperCase() : 'STANDARD'}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {booking.packageName}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-200">
                      {breakdown.unitLabel}
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700 dark:text-slate-200">
                      {formatAmount(breakdown.unitRateNGN)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {formatAmount(breakdown.subtotalNGN)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 max-w-sm">
                <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment & Escrow Protection Notice:
                </div>
                <p>
                  Funds are secured via MsmeBooks smart escrow and only remitted to the professional firm after consultation delivery and client confirmation.
                </p>
                {booking.paymentTransactionRef && (
                  <div className="pt-1 font-mono text-[11px] text-[#1464C8] dark:text-[#B7E532]">
                    Audit Ref: {booking.paymentTransactionRef}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Gross Subtotal:</span>
                  <span className="font-medium">{formatAmount(breakdown.subtotalNGN)}</span>
                </div>

                {breakdown.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Discount ({breakdown.discountPercent}%):</span>
                    <span>- {formatAmount(breakdown.discountNGN)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Statutory VAT (7.5%):</span>
                  <span className="font-medium">{formatAmount(breakdown.vatNGN)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-[#102B4E] dark:text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-700 dark:text-[#B7E532] font-black">
                    {formatAmount(breakdown.totalNGN)}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Stamp & QR Code */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center p-1">
                  <QrCode className="w-8 h-8 text-[#1464C8] dark:text-[#B7E532]" />
                </div>
                <div>
                  <div className="font-bold text-[#102B4E] dark:text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NDPA Verified Digital Invoice</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Scan to verify validity at msmebooks.org/verify/{booking.reference}
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right text-[11px] text-slate-400">
                Official Signature & Seal: <span className="font-serif italic font-bold text-slate-700 dark:text-slate-300">MsmeBooks Finance Authority</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
