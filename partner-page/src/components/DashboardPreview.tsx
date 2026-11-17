import React, { useState } from 'react';
import { 
  SAMPLE_DASHBOARD_CLIENTS 
} from '../data/partnerData';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Search, 
  ExternalLink, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Crown,
  Eye,
  Filter,
  RefreshCw,
  Sparkles,
  Calendar
} from 'lucide-react';

interface DashboardPreviewProps {
  onOpenDashboardTour: () => void;
  onOpenApplyModal: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  onOpenDashboardTour,
  onOpenApplyModal
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'commissions' | 'referrals'>('clients');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = SAMPLE_DASHBOARD_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="partner-dashboard" className="py-20 bg-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-[#65A30D]" />
            Multi-Tenant Command Console
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Built for Complete Transparency & Client Oversight
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Monitor client deployments, view active subscription renewals, track conversion velocity, and audit monthly commission payouts from one intuitive partner console.
          </p>
        </div>

        {/* Dashboard Shell Frame */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          
          {/* Top Bar of the Mock Dashboard */}
          <div className="bg-[#0A192F] text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C81] flex items-center justify-center font-bold text-white shadow-xs">
                MB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">Adeyemi Advisory Hub Console</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#84CC16] text-[#0A192F] flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Platinum Partner (40%)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Partner ID: <span className="font-mono text-slate-300">MSME-PTR-77291</span> • Pan-Africa Multi-Currency Console
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenDashboardTour}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>See How the Partner Dashboard Works</span>
              </button>
              <button
                onClick={onOpenApplyModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] transition-colors flex items-center gap-1.5"
              >
                <span>Deploy New Client</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Metric Cards Row (Exact Requirements from User Prompt) */}
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* Metric 1: Total Clients */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Total Clients
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">264</div>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                  ↑ +18 this quarter
                </span>
              </div>

              {/* Metric 2: Active Subscriptions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Active Businesses
                </span>
                <div className="text-2xl font-extrabold text-[#0F4C81] mt-1">248</div>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                  94.0% active rate
                </span>
              </div>

              {/* Metric 3: Monthly Recurring Commission */}
              <div className="bg-white p-4 rounded-xl border border-[#84CC16]/60 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#84CC16]/20 rounded-bl-xl flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-[#4D7C0F]" />
                </div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Monthly Recurring
                </span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">₦874,500</div>
                <span className="text-[10px] text-[#4D7C0F] font-bold mt-0.5 block">
                  +16.4% MoM growth
                </span>
              </div>

              {/* Metric 4: Total Commission Earned */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Total Commission
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">₦12,450,000</div>
                <span className="text-[10px] text-sky-600 font-bold mt-0.5 block">
                  Verified settlements
                </span>
              </div>

              {/* Metric 5: Pending Commission */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Pending Payout
                </span>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">₦286,200</div>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                  Disburses on 10th
                </span>
              </div>

              {/* Metric 6: Referral Conversion */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                  Conversion Rate
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">74.2%</div>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                  Top 5% Partner tier
                </span>
              </div>

            </div>
          </div>

          {/* Tab Navigation in Mock Dashboard */}
          <div className="px-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('clients')}
                className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'clients'
                    ? 'border-[#0F4C81] text-[#0F4C81]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Client Roster & Ledger Access (248)
              </button>
              <button
                onClick={() => setActiveTab('commissions')}
                className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'commissions'
                    ? 'border-[#0F4C81] text-[#0F4C81]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Commission History & Payouts
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'referrals'
                    ? 'border-[#0F4C81] text-[#0F4C81]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Referral Performance & Links
              </button>
            </div>

            {/* Search within mock console */}
            <div className="hidden sm:flex items-center relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
              />
            </div>
          </div>

          {/* Interactive Tab Body */}
          <div className="p-6">
            
            {activeTab === 'clients' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[11px] border-b border-slate-100">
                      <th className="pb-3 font-semibold">Client Name</th>
                      <th className="pb-3 font-semibold">Industry / Location</th>
                      <th className="pb-3 font-semibold">Plan Tier</th>
                      <th className="pb-3 font-semibold">Monthly Subscription</th>
                      <th className="pb-3 font-semibold text-[#4D7C0F]">Your 40% Share</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5">
                          <div className="font-bold text-slate-900">{client.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{client.id}</span>
                        </td>
                        <td className="py-3.5">
                          <div>{client.industry}</div>
                          <span className="text-[11px] text-slate-500">{client.country}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                            {client.plan}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono font-semibold">
                          {client.monthlyFee}
                        </td>
                        <td className="py-3.5 font-mono font-bold text-emerald-700">
                          {client.partnerCut}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            client.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={onOpenDashboardTour}
                            className="text-xs font-bold text-[#0F4C81] hover:underline"
                          >
                            Open Ledger →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'commissions' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs text-slate-700">
                      Last payout of <strong className="font-bold text-slate-900">₦812,400.00</strong> was successfully deposited to Guaranty Trust Bank (Acct: ••••4190) on August 10, 2026.
                    </p>
                  </div>
                  <button className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Statement
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 font-bold uppercase">Settled This Year</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">₦8,940,000</div>
                    <span className="text-[11px] text-slate-500">Jan – Aug 2026</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 font-bold uppercase">Average Per Client</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">₦3,526 / mo</div>
                    <span className="text-[11px] text-[#4D7C0F] font-bold">40% Platinum split</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-400 font-bold uppercase">Upcoming 10th Payout</span>
                    <div className="text-xl font-bold text-emerald-700 mt-1">₦874,500</div>
                    <span className="text-[11px] text-slate-500">Auto Bank Transfer</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Your Exclusive Partner Referral Link:</span>
                    <p className="text-xs font-mono text-slate-600 mt-0.5">https://app.msmebooks.com/signup?ref=ADEYEMI-PARTNER-40</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard?.writeText('https://app.msmebooks.com/signup?ref=ADEYEMI-PARTNER-40')}
                    className="px-3 py-1.5 rounded-lg bg-[#0F4C81] text-white text-xs font-bold hover:bg-[#0A3861]"
                  >
                    Copy Link
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every business that signs up via your link receives 30 days of complimentary cloud ledger storage, and is automatically tied to your recurring commission account for life.
                </p>
              </div>
            )}

          </div>

          {/* Footer note and CTA in console */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 italic">
              * Example dashboard metrics for illustration purposes only. Actual earnings depend on active subscriber volume and tier qualification.
            </p>
            <button
              onClick={onOpenDashboardTour}
              className="text-xs font-bold text-[#0F4C81] hover:text-[#0A3861] flex items-center gap-1.5"
            >
              <span>See How the Partner Dashboard Works</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
