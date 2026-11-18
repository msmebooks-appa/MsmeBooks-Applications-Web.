import React, { useState } from 'react';
import { CustomerReferral, CommissionPayout, PartnerResourceItem, SignedAgreementRecord } from '../types/partner';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencySelector } from './CurrencySelector';
import {
  X,
  TrendingUp,
  Users,
  Copy,
  Check,
  Download,
  Award,
  BookOpen,
  FileText,
  LifeBuoy,
  Shield,
  CreditCard,
  QrCode,
  DollarSign,
  Share2,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';

interface PartnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerRecord: SignedAgreementRecord;
  referrals: CustomerReferral[];
  payouts: CommissionPayout[];
  resources: PartnerResourceItem[];
  onOpenCertificate: () => void;
}

export const PartnerDashboardModal: React.FC<PartnerDashboardModalProps> = ({
  isOpen,
  onClose,
  partnerRecord,
  referrals,
  payouts,
  resources,
  onOpenCertificate
}) => {
  const { formatMoney, currentCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'customers' | 'payouts' | 'training' | 'resources' | 'agreement'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  if (!isOpen) return null;

  const referralUrl = `https://www.msmebooks.org/signup?ref=${partnerRecord.applicationId.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Calculations
  const totalMrr = referrals.reduce((sum, r) => sum + (r.status === 'Active' ? r.mrr : 0), 0);
  const monthlyRecurringCommission = referrals.reduce(
    (sum, r) => sum + (r.status === 'Active' ? r.monthlyCommission : 0),
    0
  );
  const totalLifetimePaid = payouts
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.netPayout, 0);
  const pendingPayout = payouts
    .filter(p => p.status === 'Pending Approval')
    .reduce((sum, p) => sum + p.netPayout, 0);
  const activeClientCount = referrals.filter(r => r.status === 'Active').length;

  const filteredReferrals = referrals.filter(r =>
    r.clientName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    r.businessType.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    r.country.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl max-w-6xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[94vh] transition-colors duration-200">
        
        {/* Top Navbar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0046B8] flex items-center justify-center text-white font-extrabold text-sm">
              MB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {partnerRecord.businessName}
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {partnerRecord.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {partnerRecord.partnerName} · {partnerRecord.primaryCategory} · ID: {partnerRecord.applicationId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency Selector inside modal */}
            <CurrencySelector />

            <div className="hidden md:flex items-center gap-2 bg-blue-50/80 dark:bg-blue-950/70 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Tier:</span>
              <span className="font-extrabold text-[#0046B8] dark:text-lime-400">{partnerRecord.assignedTier} (30%)</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 shrink-0 overflow-x-auto">
          <div className="flex space-x-6 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
              { id: 'referrals', label: 'Referral Engine & Links', icon: Share2 },
              { id: 'customers', label: 'Active Subscriptions', icon: Users },
              { id: 'payouts', label: 'Commissions & Payouts', icon: CreditCard },
              { id: 'training', label: 'Academy & Certification', icon: Award },
              { id: 'resources', label: 'Marketing Collateral', icon: BookOpen },
              { id: 'agreement', label: 'Signed Contract & Certificate', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
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

        {/* Scrollable Dashboard Workspace */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Referral Link Quick Bar */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 dark:from-slate-900 dark:to-blue-950 text-white rounded-2xl p-5 shadow-sm border border-transparent dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                    Your Dedicated Tracking Link (90-Day Attribution Window)
                  </p>
                  <p className="text-xs text-blue-100 dark:text-slate-300 font-mono truncate max-w-xl">
                    {referralUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#0046B8]" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-colors cursor-pointer"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Primary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Monthly Commission</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
                    {formatMoney(monthlyRecurringCommission)}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    +15.2% vs previous cycle
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Active Subscriptions</span>
                    <Users className="w-4 h-4 text-[#0046B8] dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
                    {activeClientCount} Accounts
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Across {referrals.length} registered leads
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Eligible Portfolio MRR</span>
                    <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
                    {formatMoney(totalMrr)}/mo
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Annualized: {formatMoney(totalMrr * 12)}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-medium">Lifetime Disbursed</span>
                    <Shield className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
                    {formatMoney(totalLifetimePaid)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Pending next cycle: {formatMoney(pendingPayout)}
                  </p>
                </div>
              </div>

              {/* Tier Progress & Target Advancement Bar */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Tier Qualification & Advancement: Gold Level (30%)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You need 30 active clients to maintain Gold. 75 active clients unlocks Platinum (40% recurring).
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {activeClientCount} / 75 Accounts (Platinum Track)
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0046B8] to-lime-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (activeClientCount / 75) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Bronze (1-9 · 15%)</span>
                  <span>Silver (10-29 · 20%)</span>
                  <span className="font-bold text-[#0046B8] dark:text-blue-400">Gold (30-74 · 30%) [Active]</span>
                  <span className="font-bold text-slate-900 dark:text-white">Platinum (75+ · 40%)</span>
                </div>
              </div>

              {/* Quick Customer Table Snapshot */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Customer Portfolio Snapshot</h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('customers')}
                    className="text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all customers</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      <tr>
                        <th className="py-3 px-6">Client Organization</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Subscription Plan</th>
                        <th className="py-3 px-4 text-right">MRR</th>
                        <th className="py-3 px-4 text-right">Your Monthly Share</th>
                        <th className="py-3 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {referrals.slice(0, 4).map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                          <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{r.clientName}</td>
                          <td className="py-3.5 px-4">{r.country}</td>
                          <td className="py-3.5 px-4">{r.plan}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">{formatMoney(r.mrr)}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                            {formatMoney(r.monthlyCommission)}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REFERRALS & LINK GENERATOR */}
          {activeTab === 'referrals' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Custom Campaign Link Builder</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create unique campaign links to track marketing conversions from specific emails, events, or social channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Campaign Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. linkedin_promo, accra_seminar"
                      className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Landing Page</label>
                    <select className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      <option>Main Homepage (www.msmebooks.org)</option>
                      <option>Point of Sale (POS) Solutions Page</option>
                      <option>Accounting & Invoicing Suite</option>
                      <option>Multi-Branch Retail Suite</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="w-full py-2.5 px-4 bg-[#0046B8] text-white text-xs font-bold rounded-lg hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                    >
                      {copiedLink ? 'Copied Campaign Link' : 'Generate & Copy Link'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Attribution Window Explanation */}
              <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 p-5 rounded-2xl text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <p className="font-bold text-[#0046B8] dark:text-blue-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>90-Day Legal Attribution Window Rule</span>
                </p>
                <p>
                  When a client visits via your link, an attribution cookie valid for ninety (90) calendar days is placed. Even if they complete their subscription weeks later, the client is attributed to your partner ledger.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS & MRR */}
          {activeTab === 'customers' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Customer Subscription Directory</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monitor active client contracts, monthly subscription fees, and earned recurring commission.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Filter by client name, industry, or country..."
                  value={searchCustomer}
                  onChange={e => setSearchCustomer(e.target.value)}
                  className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-3 py-2 w-full sm:w-64"
                />
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Industry / Model</th>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4">Software Plan</th>
                      <th className="py-3 px-4 text-right">Client MRR</th>
                      <th className="py-3 px-4 text-right">Commission Rate</th>
                      <th className="py-3 px-4 text-right">Monthly Payout</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredReferrals.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.clientName}</td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{r.businessType}</td>
                        <td className="py-3.5 px-4 font-medium">{r.country}</td>
                        <td className="py-3.5 px-4">{r.plan}</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">{formatMoney(r.mrr)}</td>
                        <td className="py-3.5 px-4 text-right font-mono">{r.commissionRate}%</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                          {formatMoney(r.monthlyCommission)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: COMMISSIONS & PAYOUT HISTORY */}
          {activeTab === 'payouts' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Commission Settlement Ledger</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Monthly statements and historical remittances disbursed in {currentCurrency.code} ({currentCurrency.name}).
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    Payment Method: Access Bank PLC Wire
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="py-3 px-4">Period</th>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4 text-right">Gross Commission</th>
                        <th className="py-3 px-4 text-right">Deductions</th>
                        <th className="py-3 px-4 text-right">Net Remitted</th>
                        <th className="py-3 px-4">Disbursement Date</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Statement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {payouts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{p.period}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{p.reference}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums">{formatMoney(p.grossCommission)}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-400 dark:text-slate-500">{formatMoney(p.deductions)}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                            {formatMoney(p.netPayout)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{p.payoutDate}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Paid'
                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="p-1 text-slate-400 hover:text-[#0046B8] dark:hover:text-lime-400"
                              title="Download Statement"
                            >
                              <Download className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACADEMY & CERTIFICATION */}
          {activeTab === 'training' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Partner Certification Status: Completed
                  </span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    MsmeBooks Certified Accounting & Advisory Partner
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Certification Valid Through: October 2027 · Recertification Cycle: Annual
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-lime-300" />
                  <span>View Official Partner Certificate</span>
                </button>
              </div>

              {/* Course Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Module 1: Core Ledger & VAT Compliance',
                    duration: '45 mins',
                    status: '100% Completed',
                    desc: 'African tax compliance (FIRS, KRA, SARS), chart of accounts architecture, and bank feed automation.'
                  },
                  {
                    title: 'Module 2: Point of Sale & Multi-Store Inventory',
                    duration: '60 mins',
                    status: '100% Completed',
                    desc: 'Hardware pairing, offline cashier modes, barcode scanning, and multi-branch stock transfers.'
                  },
                  {
                    title: 'Module 3: Client Migration & Advisory Billing',
                    duration: '35 mins',
                    status: '100% Completed',
                    desc: 'Best practices for migrating client data from legacy software and packaging consulting services.'
                  }
                ].map((course, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-400 dark:text-slate-500">{course.duration}</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded">
                        {course.status}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{course.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{course.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MARKETING COLLATERAL */}
          {activeTab === 'resources' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Partner Resource & Enablement Centre</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Approved sales pitch decks, brochures, social creatives, and technical guides.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(res => (
                  <div
                    key={res.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 hover:border-blue-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#0046B8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded font-mono">
                          {res.format} · {res.size}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">·</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{res.category}</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">{res.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{res.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading asset: ${res.title}`)}
                      className="p-2 text-slate-400 hover:text-[#0046B8] dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                      title="Download Resource"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SIGNED CONTRACT */}
          {activeTab === 'agreement' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Executed Master Partner Agreement</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Legally binding electronic execution on record in the MsmeBooks Partner Ledger.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Contract</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCertificate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-lime-300" />
                    <span>Official Certificate</span>
                  </button>
                </div>
              </div>

              {/* Digital Execution Seal Certificate Box */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Application Reference ID:</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">{partnerRecord.applicationId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Signatory Legal Name:</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{partnerRecord.partnerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Trading Entity:</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{partnerRecord.businessName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Execution Timestamp:</span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 text-sm mt-0.5">{partnerRecord.signedAt}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">IP Stamp & Geolocation:</span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 text-xs mt-0.5">{partnerRecord.ipAddress}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Agreement Governing Version:</span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 text-xs mt-0.5">{partnerRecord.agreementVersion} (30 Articles + Schedules A-G)</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Cryptographic Evidence Verified</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">SHA-256 HASH VERIFIED</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* QR Code Modal Preview */}
      {showQrModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-xs w-full text-center space-y-4 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Your Referral QR Code</h4>
            <div className="w-48 h-48 bg-slate-100 dark:bg-slate-800 rounded-xl mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <QrCode className="w-32 h-32 text-slate-800 dark:text-slate-200" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan with camera to open client registration</p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
