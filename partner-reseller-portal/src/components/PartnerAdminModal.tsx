import React, { useState } from 'react';
import { SignedAgreementRecord, PartnerLevelType } from '../types/partner';
import { useCurrency } from '../context/CurrencyContext';
import {
  X,
  ShieldCheck,
  Check,
  Ban,
  UserCheck,
  Sliders,
  DollarSign,
  FileText,
  AlertTriangle,
  History,
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface PartnerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApplications: SignedAgreementRecord[];
  onApproveApplication: (appId: string, assignedTier: PartnerLevelType) => void;
  onRejectApplication: (appId: string) => void;
  auditLogs: { timestamp: string; action: string; actor: string; target: string; details: string }[];
}

export const PartnerAdminModal: React.FC<PartnerAdminModalProps> = ({
  isOpen,
  onClose,
  pendingApplications,
  onApproveApplication,
  onRejectApplication,
  auditLogs
}) => {
  const { formatMoney, currentCurrency } = useCurrency();
  const [activeAdminTab, setActiveAdminTab] = useState<'applications' | 'tiers' | 'payouts' | 'audit'>('applications');
  const [adminRole, setAdminRole] = useState<'Super Admin' | 'Partnership Manager' | 'Finance Manager' | 'Compliance'>('Super Admin');
  const [commissionRates, setCommissionRates] = useState({
    Bronze: 15,
    Silver: 20,
    Gold: 30,
    Platinum: 40
  });
  const [saveRatesSuccess, setSaveRatesSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveRatesSuccess(true);
    setTimeout(() => setSaveRatesSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl max-w-6xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[94vh] transition-colors duration-200">
        
        {/* Admin Bar */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  MsmeBooks Partner Management & Compliance Administration Desk
                </h3>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/40 font-mono">
                  Governance Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Application Approvals · Commission Schedules · Compliance Audits · Payout Reconciliations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Role:</span>
              <select
                value={adminRole}
                onChange={e => setAdminRole(e.target.value as any)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Super Admin" className="bg-slate-900">Super Admin</option>
                <option value="Partnership Manager" className="bg-slate-900">Partnership Manager</option>
                <option value="Finance Manager" className="bg-slate-900">Finance Manager</option>
                <option value="Compliance" className="bg-slate-900">Compliance Officer</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Tab Navigation */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 shrink-0 overflow-x-auto">
          <div className="flex space-x-6 text-xs font-semibold">
            {[
              { id: 'applications', label: `Application Queue (${pendingApplications.length})`, icon: UserCheck },
              { id: 'tiers', label: 'Commercial Schedules & Commission Rates', icon: Sliders },
              { id: 'payouts', label: 'Payout Reconciliation & Approvals', icon: DollarSign },
              { id: 'audit', label: 'Immutable Agreement Audit Log', icon: History }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`py-3.5 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#0046B8] dark:border-lime-400 text-[#0046B8] dark:text-lime-400 font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: APPLICATION QUEUE */}
          {activeAdminTab === 'applications' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Partner Registration & Document Verification Queue</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review incoming business documents, verify tax identification, and approve partnership category assignments.
                  </p>
                </div>
              </div>

              {pendingApplications.length > 0 ? (
                <div className="space-y-4">
                  {pendingApplications.map(app => (
                    <div
                      key={app.applicationId}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-[#0046B8] dark:text-blue-400">
                              {app.applicationId}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{app.businessName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Verified Active'
                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Principal: {app.partnerName} · {app.email} · {app.phone}
                          </p>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Signed: {app.signedAt} ({app.country})
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 dark:text-slate-500 block">Requested Category</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{app.primaryCategory}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 dark:text-slate-500 block">Registration Reg No.</span>
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{app.registrationNumber || 'Pending'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 dark:text-slate-500 block">Tax ID / TIN</span>
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{app.taxId || 'Pending'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 dark:text-slate-500 block">Agreement Signed</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">{app.agreementVersion} Executed</span>
                        </div>
                      </div>

                      {app.status === 'Pending Review' && (
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Assign Initial Tier:</span>
                            <div className="flex items-center gap-1">
                              {(['Bronze', 'Silver', 'Gold'] as PartnerLevelType[]).map(t => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => onApproveApplication(app.applicationId, t)}
                                  className="px-2.5 py-1 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 hover:bg-[#0046B8] hover:text-white dark:hover:bg-blue-600 transition-colors text-slate-800 dark:text-slate-200"
                                >
                                  Approve as {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onRejectApplication(app.applicationId)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Decline Application</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onApproveApplication(app.applicationId, 'Bronze')}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify & Activate Partner</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">All applications verified</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No pending onboarding applications in queue.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMMISSION SCHEDULES CONFIGURATOR */}
          {activeAdminTab === 'tiers' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Commercial Schedule & Commission Rate Governance</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure official recurring commission percentages across Bronze, Silver, Gold, and Platinum partner levels.
                  </p>
                </div>

                <form onSubmit={handleSaveRates} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Bronze Partner Level</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="30"
                        value={commissionRates.Bronze}
                        onChange={e => setCommissionRates({ ...commissionRates, Bronze: Number(e.target.value) })}
                        className="w-20 text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-center"
                      />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">% Recurring</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Baseline entry referrer track</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Silver Partner Level</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="10"
                        max="35"
                        value={commissionRates.Silver}
                        onChange={e => setCommissionRates({ ...commissionRates, Silver: Number(e.target.value) })}
                        className="w-20 text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-center"
                      />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">% Recurring</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">10+ active accounts</p>
                  </div>

                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                    <label className="text-xs font-bold text-[#0046B8] dark:text-blue-400 block">Gold Partner Level</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="15"
                        max="40"
                        value={commissionRates.Gold}
                        onChange={e => setCommissionRates({ ...commissionRates, Gold: Number(e.target.value) })}
                        className="w-20 text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-center"
                      />
                      <span className="text-sm font-bold text-[#0046B8] dark:text-blue-400">% Recurring</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">30+ active accounts</p>
                  </div>

                  <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-lime-400 block">Platinum Partner Level</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="25"
                        max="50"
                        value={commissionRates.Platinum}
                        onChange={e => setCommissionRates({ ...commissionRates, Platinum: Number(e.target.value) })}
                        className="w-20 text-sm font-bold border border-slate-700 bg-slate-800 text-white rounded-lg p-2 text-center"
                      />
                      <span className="text-sm font-bold text-lime-400">% Recurring</span>
                    </div>
                    <p className="text-[11px] text-slate-400">75+ accounts / Distributor</p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Changes propagate to Schedule B and require thirty (30) days notice for existing contracts.
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Save Commercial Schedules
                    </button>
                  </div>
                </form>

                {saveRatesSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Commercial schedule rates updated in the central ledger!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PAYOUT RECONCILIATIONS */}
          {activeAdminTab === 'payouts' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Monthly Payout Batch Approval</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authorise pending commission batches for disbursement on the 25th calendar day.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Batch payment file generated for banking integration!')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Authorize Disbursal Batch
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Current Batch: October 2026 Settlement</span>
                  <span>Total Due: {formatMoney(4820)} (24 Qualified Partners)</span>
                </div>
                <p>
                  All calculations verified against Net Subscription Revenue with 0% chargebacks in current 30-day window.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: IMMUTABLE AUDIT LOG */}
          {activeAdminTab === 'audit' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Immutable Compliance & Agreement Audit Trail</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cryptographic logs of partner electronic signatures, tier promotions, and commercial reconciliations.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-[#0046B8] dark:text-blue-400">{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 font-sans">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Actor:</span> {log.actor} · <span className="font-semibold text-slate-600 dark:text-slate-400">Target:</span> {log.target}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-sans text-[11px]">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
