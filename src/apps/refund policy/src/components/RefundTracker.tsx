import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileCheck, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Building2,
  Calendar,
  CreditCard,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { RefundRequest, RefundStage } from '../types/policy';
import { useCurrency } from '../context/CurrencyContext';

interface RefundTrackerProps {
  requests: RefundRequest[];
  onRequestNewClick: () => void;
}

export const RefundTracker: React.FC<RefundTrackerProps> = ({ requests, onRequestNewClick }) => {
  const { currentCurrency, formatCurrency, formatConverted } = useCurrency();
  const [searchReference, setSearchReference] = useState('MB-REF-2026-8841');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(
    requests.find((r) => r.referenceNumber === 'MB-REF-2026-8841') || requests[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchReference.trim().toUpperCase();
    const found = requests.find(
      (r) =>
        r.referenceNumber.toUpperCase() === query ||
        r.accountEmail.toLowerCase() === searchReference.trim().toLowerCase() ||
        r.invoiceReference.toUpperCase() === query
    );
    if (found) {
      setSelectedRequest(found);
    } else {
      setSelectedRequest(null);
    }
  };

  const stagesList: { key: RefundStage; label: string; desc: string }[] = [
    { key: 'submitted', label: '1. Submitted', desc: 'Case received & logged' },
    { key: 'under_review', label: '2. Under Review', desc: 'Ledger & gateway check' },
    { key: 'additional_info', label: '3. Additional Info', desc: 'Evidence clarification' },
    { key: 'approved', label: '4. Decision Made', desc: 'Approved or declined' },
    { key: 'processed', label: '5. Funds Processed', desc: 'Gateway release initiated' },
  ];

  const getStageIndex = (stage: RefundStage): number => {
    switch (stage) {
      case 'submitted':
        return 0;
      case 'under_review':
        return 1;
      case 'additional_info':
        return 2;
      case 'approved':
      case 'declined':
        return 3;
      case 'processed':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = selectedRequest ? getStageIndex(selectedRequest.stage) : -1;

  return (
    <section id="refund-tracker" className="scroll-mt-24 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 tracking-wider uppercase mb-1">
          <span>08. Public Resolution Portal</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Refund Request & 5-Stage Live Status Tracker
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Check the real-time status of your billing review, audit notes, gateway payout reference, or file a new request.
            </p>
          </div>

          <button
            onClick={onRequestNewClick}
            className="px-4.5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm flex items-center gap-2 whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-lime-400" />
            <span>Submit New Refund Request</span>
          </button>
        </div>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchReference}
              onChange={(e) => setSearchReference(e.target.value)}
              placeholder="Enter Reference (e.g. MB-REF-2026-8841) or Account Email..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-blue-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            Check Status
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          <span className="text-[11px] font-semibold text-slate-600">Sample Live Records:</span>
          {requests.slice(0, 3).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSearchReference(r.referenceNumber);
                setSelectedRequest(r);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 font-mono text-[11px] border border-slate-200 transition-colors"
            >
              {r.referenceNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Request Card */}
      {selectedRequest ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-8">
          
          {/* Header of Request */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md">
                  {selectedRequest.referenceNumber}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Invoice: {selectedRequest.invoiceReference}
                </span>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mt-2">
                {selectedRequest.serviceType}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedRequest.businessName} · {selectedRequest.customerName} ({selectedRequest.accountEmail})
              </p>
            </div>

            {(() => {
              const converted = formatConverted(selectedRequest.amount, selectedRequest.currency);
              return (
                <div className="text-left sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1 text-xs text-slate-500">
                    <span>Claim Amount</span>
                    {converted.isConverted && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-100 text-lime-800 font-bold">
                        {currentCurrency}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-extrabold text-blue-950 font-mono block">
                    {converted.formatted}
                  </span>
                  {converted.isConverted ? (
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Orig: {converted.originalFormatted} {selectedRequest.currency}
                    </span>
                  ) : null}
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    via {selectedRequest.paymentMethod}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* 5-Stage Visual Workflow Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                5-Stage Resolution Progress
              </span>
              <span className="text-xs font-semibold text-blue-900 capitalize">
                Status: {selectedRequest.stage.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {stagesList.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                const isDeclined = selectedRequest.stage === 'declined' && idx === 3;

                return (
                  <div
                    key={stage.key}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? isDeclined
                          ? 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-blue-900 border-blue-950 text-white shadow-sm ring-2 ring-lime-400/40'
                        : isPassed
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-white border-slate-100 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-bold">0{idx + 1}</span>
                      {isPassed && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      {isCurrent && !isDeclined && <Clock className="w-3.5 h-3.5 text-lime-400 animate-spin" />}
                      {isDeclined && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <div className="font-bold text-xs">
                      {isDeclined ? 'Declined' : stage.label}
                    </div>
                    <p className={`text-[11px] mt-1 leading-snug ${isCurrent ? 'text-slate-200' : 'text-slate-500'}`}>
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Reviewer Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-900" />
                <span>Claimed Reason & Description</span>
              </h4>
              <p className="font-semibold text-blue-950">{selectedRequest.reason}</p>
              <p className="text-slate-600 leading-relaxed">{selectedRequest.detailedExplanation}</p>
              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                Original Transaction Date: {selectedRequest.paymentDate}
              </div>
            </div>

            <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lime-600" />
                <span>MsmeBooks Billing Verification Notes</span>
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {selectedRequest.reviewerNotes || 'Preliminary verification in progress with payment provider.'}
              </p>
              {selectedRequest.gatewayTransactionId && (
                <div className="pt-2 text-[11px] font-mono text-blue-900">
                  Gateway Tx Reference: {selectedRequest.gatewayTransactionId}
                </div>
              )}
            </div>

          </div>

          {/* Audit History Timeline */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Transaction Audit Trail
            </h4>
            <div className="space-y-2">
              {selectedRequest.auditTrail.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900 shrink-0" />
                    <span className="font-semibold text-blue-950">{entry.action}</span>
                    <span className="text-slate-500">by {entry.actor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-[11px]">{entry.note}</span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">{entry.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Request Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We could not find an active refund review matching "{searchReference}". Please double-check your reference code or invoice number.
          </p>
          <button
            onClick={() => {
              setSearchReference('MB-REF-2026-8841');
              setSelectedRequest(requests[0]);
            }}
            className="text-xs font-semibold text-blue-900 hover:underline"
          >
            Load sample record MB-REF-2026-8841
          </button>
        </div>
      )}

    </section>
  );
};
