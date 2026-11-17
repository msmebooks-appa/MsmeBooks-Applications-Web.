import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles,
  FolderOpen,
  X,
  ExternalLink,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { BookingRecord } from '../types/booking';
import {
  AutoInvoiceDocument,
  dataUriToPdfBlob,
  downloadAutoInvoicePdf,
  formatPdfBytes,
} from '../utils/autoInvoiceService';
import { useCurrency } from '../context/CurrencyContext';

interface DocumentsSectionProps {
  documents: AutoInvoiceDocument[];
  bookings: BookingRecord[];
  onOpenBookingInvoice: (booking: BookingRecord) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  bookings,
  onOpenBookingInvoice,
}) => {
  const { formatAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<AutoInvoiceDocument | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!previewDoc) {
      setPreviewBlobUrl(null);
      return;
    }
    const blob = dataUriToPdfBlob(previewDoc.pdfDataUri);
    const url = URL.createObjectURL(blob);
    setPreviewBlobUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [previewDoc]);

  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const sorted = [...documents].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
    if (!q) return sorted;
    return sorted.filter(
      doc =>
        doc.invoiceNumber.toLowerCase().includes(q) ||
        doc.bookingReference.toLowerCase().includes(q) ||
        doc.serviceTitle.toLowerCase().includes(q) ||
        doc.providerName.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  const totalValueNGN = useMemo(
    () => documents.reduce((acc, doc) => acc + (doc.totalNGN || 0), 0),
    [documents]
  );

  const handleDownload = (doc: AutoInvoiceDocument) => {
    downloadAutoInvoicePdf(doc);
    setDownloadedId(doc.id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Vault Header Banner */}
      <div className="bg-gradient-to-br from-[#102B4E] via-[#14437A] to-[#0A1727] text-white p-6 rounded-3xl shadow-lg border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B7E532]">
              <FolderOpen className="w-4 h-4" />
              <span>Documents Vault • Auto-Invoice Archive</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Completed Engagement PDF Invoices
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Whenever any booking reaches <strong className="text-[#B7E532]">Completed</strong> status, an official tax-compliant PDF invoice copy is automatically generated and archived here for immediate download and audit records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Archived PDFs
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {documents.length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Invoiced Value
              </div>
              <div className="text-lg font-black text-[#B7E532] mt-1">
                {formatAmount(totalValueNGN)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline PDF Preview Panel */}
      {previewDoc && previewBlobUrl && (
        <div className="bg-white dark:bg-[#0A1727] rounded-2xl border-2 border-[#1464C8] dark:border-[#B7E532]/60 shadow-lg overflow-hidden animate-in fade-in duration-200">
          <div className="bg-[#102B4E] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-[#B7E532] shrink-0" />
              <div className="truncate">
                <div className="text-xs font-black truncate">{previewDoc.fileName}</div>
                <div className="text-[11px] text-slate-300">
                  {previewDoc.invoiceNumber} • {previewDoc.serviceTitle} ({formatPdfBytes(previewDoc.sizeBytes)})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownload(previewDoc)}
                className="px-3 py-1.5 rounded-lg bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                title="Close PDF preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 p-2 sm:p-4">
            <iframe
              src={previewBlobUrl}
              title={`PDF Preview - ${previewDoc.fileName}`}
              className="w-full h-[480px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white"
            />
          </div>
        </div>
      )}

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, booking ref, service title, or practice firm..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-[#B7E532] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Invoice Trigger Active</span>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white dark:bg-[#0A1727] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-sm text-[#102B4E] dark:text-white">
            {documents.length === 0
              ? 'No Completed Booking Invoices Archived Yet'
              : 'No matching PDF invoices found'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {documents.length === 0
              ? 'As soon as a service booking reaches Completed status (via milestone fulfillment or stage sign-off), its official PDF invoice copy will appear here automatically.'
              : 'Try adjusting your search keywords to locate another invoice PDF.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map(doc => {
            const matchedBooking = bookings.find(
              b => b.id === doc.bookingId || b.reference === doc.bookingReference
            );
            const isPreviewing = previewDoc?.id === doc.id;
            const isDownloaded = downloadedId === doc.id;
            const generatedLabel = new Date(doc.generatedAt).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={doc.id}
                className={`bg-white dark:bg-[#0A1727] rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                  isPreviewing
                    ? 'border-[#1464C8] dark:border-[#B7E532] ring-2 ring-[#1464C8]/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: PDF Identity & Metadata */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex flex-col items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span className="text-[9px] font-black text-rose-700 dark:text-rose-300 tracking-wider mt-0.5">
                        PDF
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#1464C8] dark:text-[#B7E532]">
                          {doc.invoiceNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Auto-Generated on Completion</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {formatPdfBytes(doc.sizeBytes)}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-[#102B4E] dark:text-white truncate">
                        {doc.serviceTitle}{' '}
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          ({doc.packageName})
                        </span>
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.providerName}</span>
                        </span>
                        <span className="font-mono text-[11px]">
                          Ref: <strong className="text-slate-700 dark:text-slate-300">{doc.bookingReference}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Archived: {generatedLabel}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                        File: {doc.fileName}
                      </div>
                    </div>
                  </div>

                  {/* Right: Total & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Settled
                      </div>
                      <div className="text-base font-black text-emerald-700 dark:text-[#B7E532]">
                        {formatAmount(doc.totalNGN)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(isPreviewing ? null : doc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                          isPreviewing
                            ? 'bg-[#1464C8] text-white border-[#1464C8]'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isPreviewing ? 'Hide Preview' : 'Preview PDF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isDownloaded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#102B4E] hover:bg-[#1464C8] text-white border border-white/10'
                        }`}
                      >
                        {isDownloaded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#B7E532]" />
                            <span>PDF Downloaded!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-[#B7E532]" />
                            <span>Download PDF</span>
                          </>
                        )}
                      </button>

                      {matchedBooking && (
                        <button
                          type="button"
                          onClick={() => onOpenBookingInvoice(matchedBooking)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#1464C8] dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Open interactive official tax receipt modal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Receipt View</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compliance Footer Note */}
      <div className="bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-[#B7E532] shrink-0" />
        <span>
          All PDF copies in this Documents vault include FIRS TIN, Statutory VAT (7.5%) breakdown, escrow settlement verification, and are persisted locally for offline access.
        </span>
      </div>
    </div>
  );
};
