import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileCheck2, 
  Share2, 
  X, 
  DollarSign, 
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { CurrencyCode, CountryInfo } from '../types';
import { formatPrice } from '../utils/currency';

interface PartnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
}

export const PartnerPortalModal: React.FC<PartnerPortalModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
}) => {
  const [activePartnerTab, setActivePartnerTab] = useState<'overview' | 'assignments' | 'earnings' | 'tiers'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('https://msmebooks.org/partner/ref/adeola-fca-991');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-700 flex items-center justify-center text-slate-950 font-extrabold text-sm">
              PP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-grotesk text-white">
                  Outsourcing Partner & Provider Portal
                </h2>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                  Partner Tier: Gold (30% Commission)
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Partner: <span className="text-slate-200 font-semibold">Adeola & Associates Chartered Accountants</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-slate-950/40 border-b border-slate-800">
          {[
            { id: 'overview', label: 'Partner Dashboard' },
            { id: 'assignments', label: 'Client Assignments (4)' },
            { id: 'earnings', label: 'Commission & Payouts' },
            { id: 'tiers', label: 'Partner Tiers & Rates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePartnerTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition cursor-pointer ${
                activePartnerTab === tab.id
                  ? 'bg-slate-900 text-lime-400 border-t-2 border-lime-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activePartnerTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Partner Quick Referral Box */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                    Your Unique Partner Referral Link
                  </span>
                  <div className="text-xs text-slate-300">
                    Earn 30% recurring monthly commission on every client you onboard to MsmeBooks Outsourcing.
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    readOnly
                    value="https://msmebooks.org/partner/ref/adeola-fca-991"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 w-full sm:w-64"
                  />
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* KPI stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Total Settled Earnings</div>
                  <div className="text-2xl font-extrabold text-lime-400 font-grotesk mt-1">
                    {formatPrice(4680, selectedCurrency)}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">Direct Bank Wire / Paystack Transfer</div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Pending Month-End Payout</div>
                  <div className="text-2xl font-extrabold text-white font-grotesk mt-1">
                    {formatPrice(870, selectedCurrency)}
                  </div>
                  <div className="text-[10px] text-blue-300 mt-1">Scheduled for 1st of Nov</div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Service SLA Performance</div>
                  <div className="text-2xl font-extrabold text-amber-400 font-grotesk mt-1">
                    99.4%
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">Top Tier Practitioner Rating</div>
                </div>
              </div>

            </div>
          )}

          {activePartnerTab === 'assignments' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-grotesk">
                Current Outsourced Client Accounts
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Apex Retail Ventures Ltd', plan: 'Growth Plan', country: 'Nigeria', status: 'Reconciling Ledger', retainerUSD: 290 },
                  { name: 'Safari Horizons Expeditions', plan: 'Professional Plan', country: 'Kenya', status: 'Payroll Disbursed', retainerUSD: 590 },
                  { name: 'Cape Tech Logistics Hub', plan: 'Enterprise Plan', country: 'South Africa', status: 'IFRS Accounts Review', retainerUSD: 1250 },
                  { name: 'BioGreen Agriculture PLC', plan: 'Growth Plan', country: 'Ghana', status: 'VAT Preparation', retainerUSD: 290 },
                ].map((c, i) => (
                  <div key={i} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      <div className="text-slate-400 text-xs">{c.plan} • {c.country} • Status: <span className="text-lime-400">{c.status}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{formatPrice(c.retainerUSD, selectedCurrency)}/mo</div>
                      <span className="text-[10px] text-emerald-400">30% Comm: {formatPrice(Math.round(c.retainerUSD * 0.3), selectedCurrency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePartnerTab === 'tiers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-grotesk">
                MsmeBooks Partner Ecosystem Tiers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                {[
                  { tier: 'Bronze Partner', rate: '15%', req: '1 - 3 active clients', badge: 'Entry' },
                  { tier: 'Silver Partner', rate: '20%', req: '4 - 9 active clients', badge: 'Growing' },
                  { tier: 'Gold Partner', rate: '30%', req: '10 - 24 active clients', badge: 'Current Tier' },
                  { tier: 'Platinum Partner', rate: '40%', req: '25+ active clients', badge: 'Elite' },
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      t.tier.includes('Gold')
                        ? 'bg-blue-950/60 border-lime-400 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">{t.badge}</span>
                    <h4 className="text-base font-bold text-white mt-1">{t.tier}</h4>
                    <div className="text-2xl font-extrabold text-white mt-2 font-grotesk">{t.rate}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{t.req}</div>
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
