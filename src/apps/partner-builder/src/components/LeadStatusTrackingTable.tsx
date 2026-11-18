import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  X,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReferredLead, LeadStage } from '../types';
import { LeadConversionDashboard } from './LeadConversionDashboard';

interface LeadStatusTrackingTableProps {
  partnerCode?: string;
  commissionRate?: number;
}

const INITIAL_LEADS: ReferredLead[] = [
  {
    id: 'lead-1',
    clientName: 'GreenField Supermarket',
    industry: 'Retail & Supermarket',
    contactPerson: 'Emeka Nwosu',
    email: 'emeka@greenfield.ng',
    phone: '+234 803 291 0492',
    country: 'Nigeria',
    countryCode: 'NG',
    plan: 'Retail POS + Inventory (5 Users)',
    monthlySpendEst: 85,
    stage: 'converted',
    daysInStage: 234,
    lastTouchpoint: 'Monthly automated commission wire verified',
    nextAction: 'Active Recurring Subscriber',
    submittedDate: '2024-03-12',
    partnerRate: 30
  },
  {
    id: 'lead-2',
    clientName: 'Lagos Medical Diagnostics',
    industry: 'Healthcare & Clinics',
    contactPerson: 'Dr. Folashade Adebayo',
    email: 'adebayo@lagosdiagnostics.com',
    phone: '+234 802 811 9022',
    country: 'Nigeria',
    countryCode: 'NG',
    plan: 'Enterprise Accounting + Multi-Branch',
    monthlySpendEst: 140,
    stage: 'converted',
    daysInStage: 168,
    lastTouchpoint: 'Q3 audit pack export synchronized via API',
    nextAction: 'Active Recurring Subscriber',
    submittedDate: '2024-05-18',
    partnerRate: 30
  },
  {
    id: 'lead-3',
    clientName: 'Accra Modern Supermarket Ltd',
    industry: 'FMCG Retail Chain',
    contactPerson: 'Kofi Mensah',
    email: 'k.mensah@accramodern.gh',
    phone: '+233 24 550 1823',
    country: 'Ghana',
    countryCode: 'GH',
    plan: 'Multi-Store Cloud POS (4 Terminals)',
    monthlySpendEst: 140,
    stage: 'trial',
    daysInStage: 4,
    lastTouchpoint: 'Trial Day 4 of 14 - POS hardware connected',
    nextAction: 'Schedule receipt printer configuration follow-up',
    submittedDate: '2026-10-28',
    partnerRate: 30
  },
  {
    id: 'lead-4',
    clientName: 'Kigali Logistics Hub',
    industry: 'Supply Chain & Freight',
    contactPerson: 'Jean-Paul Habimana',
    email: 'jp@kigalilogistics.rw',
    phone: '+250 788 412 901',
    country: 'Rwanda',
    countryCode: 'RW',
    plan: 'Supply Chain & Warehouse Pro',
    monthlySpendEst: 120,
    stage: 'converted',
    daysInStage: 152,
    lastTouchpoint: 'Annual subscription renewal locked in',
    nextAction: 'Active Recurring Subscriber',
    submittedDate: '2024-06-02',
    partnerRate: 30
  },
  {
    id: 'lead-5',
    clientName: 'Dakar Distribution SARL',
    industry: 'Import & Wholesale',
    contactPerson: 'Moussa Diop',
    email: 'moussa@dakardistrib.sn',
    phone: '+221 77 641 2900',
    country: 'Senegal',
    countryCode: 'SN',
    plan: 'Enterprise Multi-Branch Suite',
    monthlySpendEst: 160,
    stage: 'implementation',
    daysInStage: 6,
    lastTouchpoint: 'Data migration mapping completed (Sage to MsmeBooks)',
    nextAction: 'Final sign-off with financial director on Friday',
    submittedDate: '2026-10-20',
    partnerRate: 30
  },
  {
    id: 'lead-6',
    clientName: 'Kano Wholesale Fabrics',
    industry: 'Textile Distribution',
    contactPerson: 'Alhaji Ibrahim Danbaba',
    email: 'danbaba.kano@gmail.com',
    phone: '+234 809 332 1980',
    country: 'Nigeria',
    countryCode: 'NG',
    plan: 'Inventory Starter + POS',
    monthlySpendEst: 65,
    stage: 'demo',
    daysInStage: 2,
    lastTouchpoint: 'Product demo conducted with partner manager Chidi Kalu',
    nextAction: 'Send 14-day free trial invite link',
    submittedDate: '2026-10-30',
    partnerRate: 30
  },
  {
    id: 'lead-7',
    clientName: 'Apex Pharma Distributors',
    industry: 'Pharmaceutical Wholesale',
    contactPerson: 'Pharmacist Toyin Adeleke',
    email: 'toyin@apexpharma.ng',
    phone: '+234 813 904 2210',
    country: 'Nigeria',
    countryCode: 'NG',
    plan: 'Multi-Store Cloud POS + Tax',
    monthlySpendEst: 95,
    stage: 'submitted',
    daysInStage: 1,
    lastTouchpoint: 'Partner referral form submitted into ecosystem',
    nextAction: 'Partner success desk routing automated discovery call',
    submittedDate: '2026-11-01',
    partnerRate: 30
  },
  {
    id: 'lead-8',
    clientName: 'Nairobi Organic Foods',
    industry: 'Organic Grocery & Cafe',
    contactPerson: 'Wangari Kamau',
    email: 'wangari@nairobiorganic.co.ke',
    phone: '+254 712 890 334',
    country: 'Kenya',
    countryCode: 'KE',
    plan: 'Multi-Store Cloud POS',
    monthlySpendEst: 95,
    stage: 'converted',
    daysInStage: 9,
    lastTouchpoint: 'Upgraded from 14-day trial to 12-month prepaid plan',
    nextAction: 'Active Recurring Subscriber',
    submittedDate: '2024-10-24',
    partnerRate: 30
  }
];

export const LeadStatusTrackingTable: React.FC<LeadStatusTrackingTableProps> = ({
  partnerCode = 'MSME-PT-8421',
  commissionRate = 30
}) => {
  const [leads, setLeads] = useState<ReferredLead[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_leads');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_LEADS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | LeadStage>('all');
  const [selectedLead, setSelectedLead] = useState<ReferredLead | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // New Lead Form State
  const [newClientName, setNewClientName] = useState('');
  const [newIndustry, setNewIndustry] = useState('Retail & Supermarket');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCountry, setNewCountry] = useState('Nigeria');
  const [newPlan, setNewPlan] = useState('Retail POS + Inventory (5 Users)');
  const [newSpendEst, setNewSpendEst] = useState('85');
  const [leadAddedSuccess, setLeadAddedSuccess] = useState(false);

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newEmail.trim()) return;

    const newLead: ReferredLead = {
      id: `lead-${Date.now()}`,
      clientName: newClientName.trim(),
      industry: newIndustry,
      contactPerson: newContact.trim() || 'Primary Contact',
      email: newEmail.trim(),
      phone: newPhone.trim() || '+234 800 000 0000',
      country: newCountry,
      countryCode: newCountry === 'Ghana' ? 'GH' : newCountry === 'Kenya' ? 'KE' : newCountry === 'Rwanda' ? 'RW' : 'NG',
      plan: newPlan,
      monthlySpendEst: parseFloat(newSpendEst) || 85,
      stage: 'submitted',
      daysInStage: 0,
      lastTouchpoint: 'Newly registered by partner portal form',
      nextAction: 'Automated welcome email & demo dispatch',
      submittedDate: new Date().toISOString().slice(0, 10),
      partnerRate: commissionRate
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('msmebooks_leads', JSON.stringify(updated));
    }

    setLeadAddedSuccess(true);
    setTimeout(() => {
      setLeadAddedSuccess(false);
      setShowAddLeadModal(false);
      setNewClientName('');
      setNewContact('');
      setNewEmail('');
      setNewPhone('');
    }, 1200);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.plan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Funnel Stage Info Helper
  const getStageMeta = (stage: LeadStage) => {
    switch (stage) {
      case 'submitted':
        return {
          label: 'Lead Submitted',
          step: 1,
          badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          dotColor: 'bg-amber-500',
          desc: 'Qualified lead recorded in CRM'
        };
      case 'demo':
        return {
          label: 'Demo Scheduled',
          step: 2,
          badgeColor: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
          dotColor: 'bg-sky-500',
          desc: 'Guided walkthrough with partner engineer'
        };
      case 'trial':
        return {
          label: '14-Day Free Trial',
          step: 3,
          badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          dotColor: 'bg-purple-500',
          desc: 'Evaluating live data & POS setup'
        };
      case 'implementation':
        return {
          label: 'Setup & Migration',
          step: 4,
          badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
          dotColor: 'bg-indigo-500',
          desc: 'Migrating charts & invoice templates'
        };
      case 'converted':
        return {
          label: 'Conversion Complete',
          step: 5,
          badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#8CE600] border-emerald-300 dark:border-emerald-800',
          dotColor: 'bg-emerald-500',
          desc: 'Paying Subscriber (Recurring share locked)'
        };
      case 'at_risk':
        return {
          label: 'Trial Expiring / Follow-up',
          step: 3,
          badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          dotColor: 'bg-rose-500',
          desc: 'Action needed to secure conversion'
        };
    }
  };

  // Pipeline calculations
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.stage === 'converted').length;
  const inPipelineLeads = totalLeads - convertedLeads;
  const activeMonthlyComm = leads
    .filter(l => l.stage === 'converted')
    .reduce((sum, l) => sum + l.monthlySpendEst * (l.partnerRate / 100), 0);
  const pipelineMonthlyComm = leads
    .filter(l => l.stage !== 'converted')
    .reduce((sum, l) => sum + l.monthlySpendEst * (l.partnerRate / 100), 0);

  return (
    <div className="space-y-6">
      {/* 4 Pipeline Transparency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Total Referred Leads
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalLeads} Leads
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            100% Attributed to {partnerCode}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active Paying Subscribers
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-[#8CE600] font-mono mt-1">
            {convertedLeads} Clients
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-[#8CE600] font-semibold mt-1">
            ${activeMonthlyComm.toFixed(2)}/mo recurring earned
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Leads in Active Trial / Demo
          </div>
          <div className="text-2xl font-black text-[#0A3981] dark:text-sky-300 font-mono mt-1">
            {inPipelineLeads} in Funnel
          </div>
          <div className="text-[11px] text-[#0A3981] dark:text-sky-300 font-semibold mt-1">
            +${pipelineMonthlyComm.toFixed(2)}/mo projected commission
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A2552] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Funnel Conversion Rate
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-[#8CE600] font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High territory engagement
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm overflow-hidden transition-colors">
        {/* Table Filter & Action Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-blue-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              Referred Lead Status Tracking Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
              Transparent step-by-step progress from lead submission to paid subscription.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client, country, plan..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as any)}
              className="text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer"
            >
              <option value="all">All Stages ({leads.length})</option>
              <option value="submitted">1. Submitted</option>
              <option value="demo">2. Demo</option>
              <option value="trial">3. Free Trial</option>
              <option value="implementation">4. Implementation</option>
              <option value="converted">5. Converted</option>
            </select>

            {/* Conversion Analytics Toggle Button */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                showAnalytics
                  ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-transparent shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-[#8CE600] border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{showAnalytics ? 'Hide Analytics' : 'Conversion Charts (Recharts)'}</span>
            </button>

            {/* Submit Lead Button */}
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9de81f] rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New Lead</span>
            </button>
          </div>
        </div>

        {/* Embedded Recharts Lead Conversion Dashboard when toggled */}
        {showAnalytics && (
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-blue-800/80 bg-slate-50/50 dark:bg-[#061F4A]/50">
            <LeadConversionDashboard
              partnerCode={partnerCode}
              commissionRate={commissionRate}
            />
          </div>
        )}

        {/* Status Tracking Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-blue-800/80 bg-slate-50/80 dark:bg-[#061F4A] text-slate-500 dark:text-slate-300 uppercase text-[10.5px] font-bold">
                <th className="p-3.5">Client Enterprise</th>
                <th className="p-3.5">Solution & Plan</th>
                <th className="p-3.5">Funnel Progression Stepper</th>
                <th className="p-3.5">Monthly Value</th>
                <th className="p-3.5">Gold Share (30%)</th>
                <th className="p-3.5">Last Touchpoint & Next Action</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-900/50">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No referred leads match your current search criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const meta = getStageMeta(lead.stage);
                  const comm = (lead.monthlySpendEst * (lead.partnerRate / 100)).toFixed(2);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#0c2e64] transition-colors"
                    >
                      {/* Client info */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-bold text-[#0A3981] dark:text-[#8CE600] shrink-0 text-xs">
                            {lead.countryCode}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {lead.clientName}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                              <span>{lead.contactPerson}</span>
                              <span>·</span>
                              <span>{lead.country}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Solution */}
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {lead.plan}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lead.industry}
                        </div>
                      </td>

                      {/* Stage Badge & 5-Step Visual Stepper */}
                      <td className="p-3.5 min-w-[210px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeColor}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                              {meta.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Step {meta.step}/5
                            </span>
                          </div>

                          {/* 5-Step Visual Progress Bar */}
                          <div className="grid grid-cols-5 gap-1 w-full h-1.5 bg-slate-100 dark:bg-[#041535] rounded-full overflow-hidden p-0.5">
                            {[1, 2, 3, 4, 5].map((stepNum) => (
                              <div
                                key={stepNum}
                                className={`h-full rounded-full transition-all ${
                                  stepNum <= meta.step
                                    ? stepNum === 5
                                      ? 'bg-emerald-500 dark:bg-[#8CE600]'
                                      : 'bg-[#0A3981] dark:bg-sky-400'
                                    : 'bg-slate-200 dark:bg-blue-900/60'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                            {meta.desc}
                          </div>
                        </div>
                      </td>

                      {/* Monthly Value */}
                      <td className="p-3.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                        ${lead.monthlySpendEst.toFixed(2)}/mo
                      </td>

                      {/* Gold Share */}
                      <td className="p-3.5">
                        <span
                          className={`font-mono font-bold text-xs ${
                            lead.stage === 'converted'
                              ? 'text-emerald-700 dark:text-[#8CE600]'
                              : 'text-slate-500 dark:text-sky-300'
                          }`}
                        >
                          +${comm}/mo
                        </span>
                        {lead.stage === 'converted' && (
                          <div className="text-[9.5px] font-bold text-emerald-600 dark:text-[#8CE600] flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Settled Monthly
                          </div>
                        )}
                      </td>

                      {/* Touchpoint & Next Action */}
                      <td className="p-3.5 max-w-xs">
                        <div className="text-slate-800 dark:text-slate-200 font-medium truncate">
                          {lead.nextAction}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                          {lead.lastTouchpoint}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0A3981] dark:text-[#8CE600] hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Submit New Lead */}
      <AnimatePresence>
        {showAddLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#072048] rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-blue-800 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-blue-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Register Client Lead
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Instantly attributes commission and alerts your partner manager.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {leadAddedSuccess ? (
                <div className="py-12 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Lead Successfully Registered!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    Your referral tracking ID has been bound to this business.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveLead} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="e.g. Lagos Superstore Ltd"
                        className="w-full text-xs bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        placeholder="e.g. Adebayo Johnson"
                        className="w-full text-xs bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Client Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="e.g. info@lagosstore.ng"
                        className="w-full text-xs bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full text-xs bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Country
                      </label>
                      <select
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="Nigeria">Nigeria 🇳🇬</option>
                        <option value="Ghana">Ghana 🇬🇭</option>
                        <option value="Kenya">Kenya 🇰🇪</option>
                        <option value="Rwanda">Rwanda 🇷🇼</option>
                        <option value="South Africa">South Africa 🇿🇦</option>
                        <option value="Senegal">Senegal 🇸🇳</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Target Software Plan
                      </label>
                      <select
                        value={newPlan}
                        onChange={(e) => setNewPlan(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-[#041535] border border-slate-200 dark:border-blue-900 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="Retail POS + Inventory (5 Users)">Retail POS + Inventory ($85/mo)</option>
                        <option value="Cloud Accounting & Tax Pro">Cloud Accounting & Tax ($95/mo)</option>
                        <option value="Enterprise Multi-Branch Suite">Enterprise Multi-Branch ($140/mo)</option>
                        <option value="Warehouse & Supply Chain Pro">Warehouse & Logistics ($120/mo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Your Gold Commission (30%):</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Paid monthly for lifetime of customer subscription
                      </p>
                    </div>
                    <span className="text-base font-black font-mono text-[#0A3981] dark:text-[#8CE600]">
                      ${(parseFloat(newSpendEst) * (commissionRate / 100)).toFixed(2)}/mo
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0A3981] dark:bg-[#8CE600] dark:text-[#061F4A] rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                    >
                      Confirm & Submit Lead
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddLeadModal(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#041535] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Lead Details Inspection Drawer / Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#072048] rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-blue-800 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-blue-900">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lead File #{selectedLead.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedLead.clientName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 pt-4 text-xs">
                {/* Stepper overview */}
                <div className="p-3 bg-slate-50 dark:bg-[#041535] rounded-xl border border-slate-200 dark:border-blue-900">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                    Current Funnel Stage
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        getStageMeta(selectedLead.stage).badgeColor
                      }`}
                    >
                      {getStageMeta(selectedLead.stage).label}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {selectedLead.daysInStage} days in current stage
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Next Action:</strong> {selectedLead.nextAction}
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Contact Person</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {selectedLead.contactPerson}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Territory</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {selectedLead.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Work Email</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100 break-all">
                      {selectedLead.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Phone</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100">
                      {selectedLead.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Selected Plan</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {selectedLead.plan}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px]">Partner Commission</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-[#8CE600]">
                      ${(selectedLead.monthlySpendEst * (selectedLead.partnerRate / 100)).toFixed(2)}/mo ({selectedLead.partnerRate}%)
                    </span>
                  </div>
                </div>

                {/* Assigned Success Lead */}
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] flex items-center justify-center font-bold text-xs">
                      CK
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        Chidi Kalu
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Assigned Partner Success Manager
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    SLA: 24h Response
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#041535] rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
