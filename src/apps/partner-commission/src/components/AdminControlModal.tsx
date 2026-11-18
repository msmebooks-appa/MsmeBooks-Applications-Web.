import React, { useState } from 'react';
import { X, ShieldCheck, Check, Ban, Sliders, Users, AlertTriangle, FileCheck } from 'lucide-react';
import { PartnerApplication, PartnerTierId } from '../types/partner';
import { useCurrency } from '../context/CurrencyContext';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: PartnerApplication[];
  onUpdateAppStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
  applications,
  onUpdateAppStatus
}) => {
  const { currencyConfig, formatFromNGN } = useCurrency();
  const [activeTab, setActiveTab] = useState<'applications' | 'rates' | 'products' | 'disputes'>('applications');
  const [minPayout, setMinPayout] = useState(20000);
  const [payoutCycleDays, setPayoutCycleDays] = useState(15);
  const [tierRates, setTierRates] = useState<Record<PartnerTierId, number>>({
    bronze: 15,
    silver: 20,
    gold: 30,
    platinum: 40
  });

  const [eligibleProducts, setEligibleProducts] = useState({
    accountingPro: true,
    posRetail: true,
    multiBranchInventory: true,
    payrollEngine: true,
    smsCredits: false,
    hardwareTerminals: false
  });

  const [resolvedDispute, setResolvedDispute] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#101e35] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-300 dark:border-slate-700 shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="bg-[#142D4E] text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1261B5] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Partner Commission Administration Control Panel
                </h3>
                <span className="text-[10px] font-mono bg-[#B9E51C] text-[#142D4E] font-bold px-1.5 py-0.5 rounded">
                  Internal Ops Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Governance console for partner application reviews, tier rates, and product commission rules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close admin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c182c] px-6 gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applications Queue ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'rates'
                ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Commission Tiers & Minimums</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Eligible Subscription Products</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'disputes'
                ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Referral Attribution Disputes</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-[#101e35] text-slate-800 dark:text-slate-100">
          {/* TAB 1: APPLICATIONS QUEUE */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">Partner Applications Awaiting Review</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review applicant credentials, requested tier, and approve or decline.
                  </p>
                </div>
              </div>

              {applications.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-[#0c182c] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                  No pending partner applications in the queue. Apply through the main page to test!
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#14233c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#142D4E] dark:text-white">{app.fullName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({app.businessName})</span>
                          <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                            {app.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {app.email} · {app.phone} · {app.city}, {app.country}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Target Tier: <strong className="text-[#1261B5] dark:text-[#B9E51C] uppercase">{app.preferredTier}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Network: {app.networkSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {app.status === 'under_review' || app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onUpdateAppStatus(app.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Partner</span>
                            </button>
                            <button
                              onClick={() => onUpdateAppStatus(app.id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                              app.status === 'approved'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RATES & THRESHOLDS */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-[#142D4E] dark:text-white mb-1">Commission Tier Governance</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure default recurring commission percentages across tiers. Changes require financial committee signoff.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                {(['bronze', 'silver', 'gold', 'platinum'] as PartnerTierId[]).map((tierId) => (
                  <div key={tierId} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c182c] space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200 uppercase block">{tierId} Partner</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={5}
                        max={60}
                        value={tierRates[tierId]}
                        onChange={(e) =>
                          setTierRates({ ...tierRates, [tierId]: parseInt(e.target.value) || 0 })
                        }
                        className="w-16 px-2 py-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white rounded font-mono font-bold text-center text-sm"
                      />
                      <span className="font-bold text-slate-600 dark:text-slate-300">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Established Base Rate</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-200">
                    Minimum Payout Withdrawal (Base NGN: ₦{minPayout.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    value={minPayout}
                    onChange={(e) => setMinPayout(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0c182c] text-slate-900 dark:text-white rounded font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Converts to ≈ {formatFromNGN(minPayout)} in active {currencyConfig.code} view.
                  </span>
                </div>

                <div className="p-4 bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-200">Scheduled Payout Frequency</label>
                  <select
                    value={payoutCycleDays}
                    onChange={(e) => setPayoutCycleDays(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0c182c] text-slate-900 dark:text-white rounded font-semibold"
                  >
                    <option value={15}>Bi-Weekly (15th & Month-End)</option>
                    <option value={30}>Monthly (Month-End Only)</option>
                    <option value={7}>Weekly (Enterprise Only)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">Standard automated NIP bank run schedule.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS ELIGIBILITY */}
          {activeTab === 'products' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-sm font-bold text-[#142D4E] dark:text-white mb-1">Eligible Subscription Products Configuration</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select which SaaS plans and addons trigger partner recurring commission calculation.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'accountingPro', label: 'MsmeBooks Accounting Pro (Core Cloud Ledger)', eligible: eligibleProducts.accountingPro },
                  { key: 'posRetail', label: 'MsmeBooks POS Touch Retail Subscriptions', eligible: eligibleProducts.posRetail },
                  { key: 'multiBranchInventory', label: 'Multi-Location Warehousing & Barcode Module', eligible: eligibleProducts.multiBranchInventory },
                  { key: 'payrollEngine', label: 'Multi-Employee Automated Payroll Engine', eligible: eligibleProducts.payrollEngine },
                  { key: 'smsCredits', label: 'Customer SMS & WhatsApp Notification Bundles (Addon)', eligible: eligibleProducts.smsCredits },
                  { key: 'hardwareTerminals', label: 'Subsidized Android Merchant POS Hardware (Hardware)', eligible: eligibleProducts.hardwareTerminals }
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#14233c] hover:bg-slate-50 dark:hover:bg-[#1a2d4c] cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.eligible}
                      onChange={(e) =>
                        setEligibleProducts({
                          ...eligibleProducts,
                          [item.key]: e.target.checked
                        })
                      }
                      className="rounded border-slate-300 text-[#1261B5] focus:ring-[#1261B5] w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DISPUTES RESOLUTION */}
          {activeTab === 'disputes' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-sm font-bold text-[#142D4E] dark:text-white mb-1">Referral Attribution Conflict Management</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Handle cases where multiple partners submit referral claims for the same customer account.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#142D4E] dark:text-white">Dispute #DSP-2026-081</span>
                  <span className="text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded">
                    First-Click vs Last-Code Conflict
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Merchant:</strong> "Prime Horizon Supermarket, Ikeja" was clicked via Partner Ace Advisory referral link, but checked out using Partner Premier POS agent code.
                </p>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                  <button
                    onClick={() => setResolvedDispute('Attributed to First-Touch Partner Link (Ace Advisory)')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#14233c] border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Award to First-Touch Link
                  </button>
                  <button
                    onClick={() => setResolvedDispute('Attributed to Direct Partner Code at Checkout (Premier POS)')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94]"
                  >
                    Award to Checkout Partner Code
                  </button>
                </div>
              </div>

              {resolvedDispute && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C] shrink-0" />
                  <span>Dispute resolved: {resolvedDispute}. Attribution ledger updated.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-[#0c182c] p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">MsmeBooks Administrative System · Audit Log #AUD-2026-X9</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};
