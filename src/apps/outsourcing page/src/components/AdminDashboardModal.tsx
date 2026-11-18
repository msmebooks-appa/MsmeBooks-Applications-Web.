import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard, 
  Settings, 
  X, 
  CheckCircle2, 
  Globe, 
  Percent,
  Sliders,
  FileCheck2,
  Lock
} from 'lucide-react';
import { CurrencyCode, CountryInfo } from '../types';
import { COUNTRIES, PAYMENT_GATEWAYS } from '../data/mockData';
import { formatPrice } from '../utils/currency';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'mrr' | 'gateways' | 'clients' | 'pricing'>('mrr');
  const [gatewayStatus, setGatewayStatus] = useState<Record<string, boolean>>({
    paystack: true,
    flutterwave: true,
    mpesa: true,
    payfast: true,
    ozow: true,
    monnify: true,
    stripe: true,
    paypal: true,
  });

  if (!isOpen) return null;

  const toggleGateway = (id: string) => {
    setGatewayStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white font-extrabold text-sm border border-blue-500/30">
              HQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-grotesk text-white">
                  MsmeBooks Central Operations Hub
                </h2>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Super Administrator Access
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Multi-Tenant Outsourcing Governance • Pan-African & Global Settlement
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
            { id: 'mrr', label: 'Revenue & MRR Analytics' },
            { id: 'gateways', label: 'Payment Gateway Orchestration' },
            { id: 'clients', label: 'Client Accounts & Assignments' },
            { id: 'pricing', label: 'Country Pricing Controls' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition cursor-pointer ${
                activeAdminTab === tab.id
                  ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: REVENUE */}
          {activeAdminTab === 'mrr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Monthly Recurring Revenue (MRR)</div>
                  <div className="text-2xl font-extrabold text-lime-400 font-grotesk mt-1">
                    {formatPrice(34250, selectedCurrency)}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">+18.5% MoM Growth</div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Active Subscribers</div>
                  <div className="text-2xl font-extrabold text-white font-grotesk mt-1">
                    84 Businesses
                  </div>
                  <div className="text-[10px] text-blue-300 mt-1">Across 8 African Countries</div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Churn Rate</div>
                  <div className="text-2xl font-extrabold text-sky-400 font-grotesk mt-1">
                    0.8%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Industry leading retention</div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400">Average Contract Value</div>
                  <div className="text-2xl font-extrabold text-amber-400 font-grotesk mt-1">
                    {formatPrice(408, selectedCurrency)}/mo
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">SME average retainer</div>
                </div>
              </div>

              {/* Revenue by Country */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Active Subscription Distribution by Country
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { country: 'Nigeria 🇳🇬', clients: 38, share: '45%', mrrUSD: 15400 },
                    { country: 'Kenya 🇰🇪', clients: 22, share: '26%', mrrUSD: 9100 },
                    { country: 'South Africa 🇿🇦', clients: 14, share: '17%', mrrUSD: 6200 },
                    { country: 'Ghana 🇬🇭', clients: 6, share: '7%', mrrUSD: 2350 },
                    { country: 'Global Diaspora 🌐', clients: 4, share: '5%', mrrUSD: 1200 },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800 rounded-lg">
                      <span className="font-bold text-white w-40">{r.country}</span>
                      <span className="text-slate-400">{r.clients} Active Accounts ({r.share})</span>
                      <span className="font-extrabold text-lime-400">{formatPrice(r.mrrUSD, selectedCurrency)}/mo</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GATEWAY CONTROLS */}
          {activeAdminTab === 'gateways' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-grotesk">
                    Regional Payment Gateway Router
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live toggle switches for active payment processors and auto-reconciliation webhooks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_GATEWAYS.map((gw) => {
                  const isEnabled = gatewayStatus[gw.id] !== false;
                  return (
                    <div
                      key={gw.id}
                      className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1.5 bg-slate-900 rounded-lg">{gw.logo}</span>
                        <div>
                          <div className="font-bold text-white text-sm">{gw.name}</div>
                          <div className="text-[10px] text-slate-400">{gw.paymentMethods.slice(0, 2).join(', ')}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleGateway(gw.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          isEnabled
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {isEnabled ? 'Active ✓' : 'Disabled ✗'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CLIENT ASSIGNMENTS */}
          {activeAdminTab === 'clients' && (
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white font-grotesk">
                Subscriber Pod Allocation & Verification Status
              </h3>
              {[
                { name: 'Apex Retail Ventures Ltd', plan: 'Growth', lead: 'Adeola Adeleke, FCA', status: 'KYB Verified', health: 'Healthy (99.8%)' },
                { name: 'Safari Horizons Expeditions', plan: 'Professional', lead: 'David Mwangi, CPA-K', status: 'KYB Verified', health: 'Healthy (100%)' },
                { name: 'Cape Tech Logistics Hub', plan: 'Enterprise', lead: 'Nompumelelo Khumalo, CA(SA)', status: 'Audit Prep', health: 'Healthy (98.5%)' },
                { name: 'BioGreen Agriculture PLC', plan: 'Growth', lead: 'Kofi Mensah, FCCA', status: 'KYB Verified', health: 'Healthy (100%)' },
              ].map((c, idx) => (
                <div key={idx} className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-slate-400 text-xs">Plan: {c.plan} • Lead Practitioner: <span className="text-blue-300">{c.lead}</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[10px] font-bold">
                      {c.status}
                    </span>
                    <button
                      onClick={() => alert(`Reassigning practitioner for ${c.name}`)}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition cursor-pointer"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PRICING CONTROLS */}
          {activeAdminTab === 'pricing' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white font-grotesk">
                Exchange Rate Buffer & Country Price Multipliers
              </h3>
              <p className="text-slate-400">
                Configure baseline USD price and automated conversion exchange rate margins to protect against currency fluctuations.
              </p>

              <div className="space-y-2">
                {COUNTRIES.slice(0, 6).map((c) => (
                  <div key={c.code} className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-bold text-white">{c.name} ({c.currency})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">FX Buffer: +1.5%</span>
                      <span className="font-bold text-lime-400">{c.currencySymbol} Local Billing Active</span>
                    </div>
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
