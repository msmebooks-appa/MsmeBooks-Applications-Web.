import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  FileText, 
  Award, 
  Settings, 
  CheckCircle2, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Sparkles,
  ExternalLink,
  CreditCard,
  Building,
  ShieldCheck
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyToggle } from './CurrencyToggle';

export const PartnerDashboardPreview: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<'clients' | 'commissions' | 'leads'>('clients');

  const clients = [
    { name: 'PrimeCare Pharmacies Ltd', country: '🇳🇬 Nigeria', plan: 'Enterprise (5 Branches)', status: 'Active', mrrUSD: 360, commissionUSD: 144, renewal: 'Nov 2026', health: '98%' },
    { name: 'Sahara Savanna Supermarkets', country: '🇰🇪 Kenya', plan: 'Growth Tier (3 Branches)', status: 'Active', mrrUSD: 220, commissionUSD: 88, renewal: 'Dec 2026', health: '95%' },
    { name: 'AfriForge Construction Depot', country: '🇿🇦 South Africa', plan: 'Enterprise (10 Branches)', status: 'Active', mrrUSD: 650, commissionUSD: 260, renewal: 'Jan 2027', health: '99%' },
    { name: 'Accra Gourmet Bistro Chain', country: '🇬🇭 Ghana', plan: 'Pro POS + Inventory', status: 'Active', mrrUSD: 180, commissionUSD: 72, renewal: 'Oct 2026', health: '92%' },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#07162b] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-lime-500/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-lime-400 text-xs font-semibold">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dedicated Partner Technology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The MsmeBooks Partner Console
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            A single, powerful interface to oversee all your SME clients, track recurring payouts, manage lead assignments, and download marketing assets.
          </p>
        </div>

        {/* Dashboard Shell Frame */}
        <div className="rounded-3xl border border-slate-300 dark:border-slate-700/80 bg-[#091d36] shadow-2xl overflow-hidden backdrop-blur-xl text-white">
          
          {/* Dashboard Header Bar */}
          <div className="px-6 py-4 bg-[#061426] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Apex FinTech & Advisory</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-lime-400 border border-lime-500/30">
                  Platinum Partner
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <CurrencyToggle mode="compact" idPrefix="partner-dashboard-currency" />
              <div className="flex items-center gap-1 text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                <span>Partner ID: MSME-PT-8834</span>
              </div>
              <div className="relative p-2 bg-slate-900 rounded-lg border border-slate-700 text-slate-300">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400"></span>
              </div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="p-6 bg-[#08182d] border-b border-slate-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Total Commission Earned</span>
                  <DollarSign className="w-4 h-4 text-lime-400" />
                </div>
                <div className="text-2xl font-black text-white">{formatAmount(48920, { showCode: true })}</div>
                <div className="flex items-center gap-1 text-[11px] text-lime-400 font-semibold mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+18.4% vs last quarter</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Monthly Recurring MRR</span>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-lime-400">{formatAmount(6410, { showCode: true })}</div>
                <div className="text-[11px] text-slate-400 mt-1">Direct monthly deposit</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Active Client Accounts</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">48 SMEs</div>
                <div className="text-[11px] text-lime-400 mt-1">100% active retention</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Directory Inbound Leads</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">14 Warm Leads</div>
                <div className="text-[11px] text-slate-400 mt-1">4 awaiting consultation</div>
              </div>

            </div>
          </div>

          {/* Main Console Body: Tabs & Table */}
          <div className="p-6 space-y-6">
            
            {/* Nav Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'clients'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                >
                  Managed Clients (48)
                </button>
                <button
                  onClick={() => setActiveTab('commissions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'commissions'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                >
                  Payout History
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'leads'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                >
                  Lead Pipeline (14)
                </button>
                <a
                  href="#partner-referrals"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-lime-400 hover:text-slate-950 bg-lime-500/10 hover:bg-lime-400 border border-lime-500/30 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Referral Rewards (4,850 pts)</span>
                </a>
              </div>

              <span className="text-xs text-slate-400 hidden sm:inline">
                Live Data Synchronized with MsmeBooks Core Engine
              </span>
            </div>

            {/* Clients Table Mockup */}
            {activeTab === 'clients' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Client Organization</th>
                      <th className="py-3 px-4">Plan & Branches</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Your Commission</th>
                      <th className="py-3 px-4">Next Renewal</th>
                      <th className="py-3 px-4">Health Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {clients.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-lime-400" />
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.country}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{c.plan}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-500/10 text-lime-400 border border-lime-500/30">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-lime-300">
                          {formatAmount(c.commissionUSD)}/mo (40%)
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{c.renewal}</td>
                        <td className="py-3.5 px-4 font-semibold text-lime-400">{c.health}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Commissions Tab */}
            {activeTab === 'commissions' && (
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Recent Payout Dispatches</h4>
                  <span className="text-xs text-lime-400 font-semibold">Automatic payout on 1st of every month</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div>
                      <div className="font-bold text-white">September 2026 Partner Payout</div>
                      <div className="text-slate-400">Direct Wire to Standard Bank Corporate Account •••• 4421</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-lime-400">{formatAmount(6410, { showCode: true })}</div>
                      <span className="text-[10px] text-green-400">Paid & Cleared</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div>
                      <div className="font-bold text-white">August 2026 Partner Payout</div>
                      <div className="text-slate-400">Direct Wire to Standard Bank Corporate Account •••• 4421</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-lime-400">{formatAmount(5820, { showCode: true })}</div>
                      <span className="text-[10px] text-green-400">Paid & Cleared</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white">Recent Inbound Requests via MsmeBooks Directory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Evergreen Distribution Ltd</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-lime-500/10 text-lime-400">New Request</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">Wholesale FMCG • Needs POS & Multi-Warehouse Setup in Lagos</p>
                    <div className="text-[10px] text-slate-400 pt-1">Received 2 hours ago</div>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Blue Horizon Medical Centre</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-lime-500/10 text-lime-400">Consultation Booked</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">Pharmacy & Clinic • Needs Accounting & Stock Expiry tracking</p>
                    <div className="text-[10px] text-slate-400 pt-1">Scheduled for tomorrow, 10:00 AM</div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
