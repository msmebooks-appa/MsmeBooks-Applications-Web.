import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  XCircle, 
  Search, 
  FileText, 
  AlertCircle, 
  Clock, 
  Lock, 
  DollarSign, 
  ArrowRight,
  Database
} from 'lucide-react';
import { RefundRequest, RefundStage } from '../types/policy';
import { useCurrency } from '../context/CurrencyContext';

interface AdminRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: RefundRequest[];
  onUpdateRequest: (updated: RefundRequest) => void;
}

export const AdminRefundModal: React.FC<AdminRefundModalProps> = ({
  isOpen,
  onClose,
  requests,
  onUpdateRequest,
}) => {
  const { currentCurrency, formatCurrency, formatConverted, convertAmount, currencyDetail } = useCurrency();
  const [selectedId, setSelectedId] = useState<string>(requests[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [gatewayTxId, setGatewayTxId] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  if (!isOpen) return null;

  const currentReq = requests.find((r) => r.id === selectedId) || requests[0];

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.accountEmail.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'pending') {
      return matchesSearch && (r.stage === 'submitted' || r.stage === 'under_review' || r.stage === 'additional_info');
    }
    return matchesSearch;
  });

  const totalFilteredValue = filtered.reduce(
    (sum, r) => sum + convertAmount(r.amount, r.currency, currentCurrency),
    0
  );

  const handleStageChange = (newStage: RefundStage) => {
    if (!currentReq) return;
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} WAT`;

    const updated: RefundRequest = {
      ...currentReq,
      stage: newStage,
      lastUpdatedAt: formatted,
      reviewerNotes: actionNote || currentReq.reviewerNotes,
      gatewayTransactionId: gatewayTxId || currentReq.gatewayTransactionId,
      auditTrail: [
        ...currentReq.auditTrail,
        {
          timestamp: formatted,
          actor: 'MsmeBooks Compliance Desk (Demo User)',
          action: `Stage Changed to ${newStage.toUpperCase().replace('_', ' ')}`,
          note: actionNote || `Administrative action updated by billing supervisor.`,
        },
      ],
    };

    onUpdateRequest(updated);
    setActionNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-900 border border-lime-400/50 flex items-center justify-center text-lime-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  MsmeBooks Billing Compliance & Refund Console
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 font-semibold border border-lime-400/30">
                  Separation of Duties Enforced
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized internal review interface for reconciling bank webhooks and approving claims.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split view */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Left Column: Tickets Queue */}
          <div className="md:col-span-5 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/60 dark:bg-slate-950/60 overflow-hidden">
            
            {/* Filter Tray */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter requests..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    activeTab === 'pending'
                      ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Pending Action ({requests.filter(r => r.stage !== 'processed' && r.stage !== 'declined').length})
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-900 dark:bg-blue-800 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All ({requests.length})
                </button>
              </div>

              {/* Converted Queue Total */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Queue Value ({currentCurrency}):</span>
                <span className="font-mono font-bold text-blue-950 dark:text-lime-300">
                  {formatCurrency(totalFilteredValue, currentCurrency)}
                </span>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((req) => {
                const isSelected = req.id === currentReq?.id;
                const converted = formatConverted(req.amount, req.currency);
                return (
                  <button
                    key={req.id}
                    onClick={() => {
                      setSelectedId(req.id);
                      setGatewayTxId(req.gatewayTransactionId || '');
                      setActionNote('');
                    }}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 border-l-4 border-blue-900 dark:border-lime-400'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-blue-950 dark:text-white">
                        {req.referenceNumber}
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-lime-400 block">
                          {converted.formatted}
                        </span>
                        {converted.isConverted && (
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                            orig {converted.originalFormatted} ({req.currency})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {req.businessName}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{req.paymentMethod}</span>
                      <span className="capitalize font-semibold text-blue-900 dark:text-lime-300">
                        {req.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No requests matching filter.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Active Claim Details & Actions */}
          <div className="md:col-span-7 flex flex-col overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-900">
            {currentReq ? (
              <>
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-blue-950 dark:text-lime-300 rounded">
                        {currentReq.referenceNumber}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Invoice: {currentReq.invoiceReference}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-blue-950 dark:text-white mt-1">
                      {currentReq.businessName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Contact: {currentReq.customerName} · {currentReq.accountEmail}
                    </p>
                  </div>

                  {(() => {
                    const converted = formatConverted(currentReq.amount, currentReq.currency);
                    return (
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>Claim Amount</span>
                          {converted.isConverted && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 font-bold">
                              {currentCurrency}
                            </span>
                          )}
                        </div>
                        <span className="text-xl font-extrabold text-blue-950 dark:text-lime-400 font-mono block">
                          {converted.formatted}
                        </span>
                        {converted.isConverted ? (
                          <div className="mt-0.5">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                              Original: {converted.originalFormatted} {currentReq.currency}
                            </span>
                            <span className="text-[10px] text-lime-700 dark:text-lime-400 font-mono">
                              {converted.exchangeRateDescription}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                            Native currency match
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          via {currentReq.paymentMethod}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Claim details */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Reason for Request:</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">Paid: {currentReq.paymentDate}</span>
                  </div>
                  <p className="font-semibold text-blue-950 dark:text-lime-300">{currentReq.reason}</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentReq.detailedExplanation}</p>
                  
                  {currentReq.attachmentName && (
                    <div className="flex items-center gap-2 text-lime-700 dark:text-lime-400 font-mono text-[11px] pt-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Attachment Verified: {currentReq.attachmentName}</span>
                    </div>
                  )}
                </div>

                {/* Gateway Reconciliation Input */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Payment Gateway Verification
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">
                        Processor Transaction Hash / ID:
                      </label>
                      <input
                        type="text"
                        value={gatewayTxId}
                        onChange={(e) => setGatewayTxId(e.target.value)}
                        placeholder="e.g. pstk_txn_991204"
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">
                        Upstream Gateway Status:
                      </label>
                      <div className="px-3 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-mono rounded-lg border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                        <span>Settled at Acquiring Bank</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Internal Compliance Review Notes (Visible on Audit Trail):
                  </label>
                  <textarea
                    rows={2}
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="Enter verification notes, reason for approval/decline, or credit note details..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Separation of Duties Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Financial Authorization Actions
                  </span>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <button
                      onClick={() => handleStageChange('under_review')}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                    >
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => handleStageChange('additional_info')}
                      className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 rounded-lg transition-colors"
                    >
                      Request Additional Evidence
                    </button>
                    <button
                      onClick={() => handleStageChange('approved')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
                    >
                      Authorize Approval
                    </button>
                    <button
                      onClick={() => handleStageChange('processed')}
                      className="px-3.5 py-2 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
                    >
                      Execute Gateway Reversal
                    </button>
                    <button
                      onClick={() => handleStageChange('declined')}
                      className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 rounded-lg transition-colors"
                    >
                      Decline Claim
                    </button>
                  </div>
                </div>

                {/* Audit Trail List */}
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    Internal System Audit Log
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {currentReq.auditTrail.map((item, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-800/70 rounded border border-slate-100 dark:border-slate-700 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-semibold">
                          <span>{item.action}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">{item.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a ticket from the left queue to inspect details.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
