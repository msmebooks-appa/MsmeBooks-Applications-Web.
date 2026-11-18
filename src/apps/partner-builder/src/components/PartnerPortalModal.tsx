import React, { useState } from 'react';
import { OfficialPartnerBadge, downloadBadgeSvg } from './OfficialPartnerBadge';
import { PartnerLeaderboard } from './PartnerLeaderboard';
import { ReferralLinkGenerator } from './ReferralLinkGenerator';
import { LeadStatusTrackingTable } from './LeadStatusTrackingTable';
import { PartnerNotificationsSlideOver } from './PartnerNotificationsSlideOver';
import { PayoutVisualSummary } from './PayoutVisualSummary';
import { LeadConversionDashboard } from './LeadConversionDashboard';
import { PortalToastNotification, ToastNotification } from './PortalToastNotification';
import { PartnerAchievementsSystem } from './PartnerAchievementsSystem';
import { ScheduleDiscoveryCallModal } from './ScheduleDiscoveryCallModal';
import { PartnerOnboardingChecklist } from './PartnerOnboardingChecklist';
import { PartnerQuickActionsGrid } from './PartnerQuickActionsGrid';
import { LayoutDashboard, Users, DollarSign, Award, Download, Copy, Check, TrendingUp, HelpCircle, FileText, ExternalLink, ShieldCheck, CreditCard, ChevronRight, Trophy, Link2, BarChart2, BellRing, Sparkles, Send, Calendar, Linkedin, LogIn, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PartnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerPortalModal: React.FC<PartnerPortalModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'referrals' | 'analytics' | 'generator' | 'commissions' | 'payouts' | 'support'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDiscoveryCallOpen, setIsDiscoveryCallOpen] = useState(false);
  const [authProvider, setAuthProvider] = useState<'google' | 'linkedin' | 'credentials'>('google');
  const [authEmail, setAuthEmail] = useState('adeyemi.financial@gmail.com');
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);

  // Mock Referrals Database
  const [referrals] = useState([
    { id: 'ref-1', client: 'GreenField Supermarket', plan: 'Retail POS + Inventory (5 Users)', monthlySpend: '$85.00', tierRate: '30%', monthlyComm: '$25.50', status: 'Active (Renewed)', joinedDate: '2024-03-12' },
    { id: 'ref-2', client: 'Lagos Medical Diagnostics', plan: 'Enterprise Accounting + Multi-Branch', monthlySpend: '$140.00', tierRate: '30%', monthlyComm: '$42.00', status: 'Active (Renewed)', joinedDate: '2024-05-18' },
    { id: 'ref-3', client: 'Kigali Logistics Hub', plan: 'Supply Chain & Warehouse Pro', monthlySpend: '$120.00', tierRate: '30%', monthlyComm: '$36.00', status: 'Active (Renewed)', joinedDate: '2024-06-02' },
    { id: 'ref-4', client: 'Zambezi Auto Spares', plan: 'POS & Inventory Starter', monthlySpend: '$45.00', tierRate: '30%', monthlyComm: '$13.50', status: 'Active (Renewed)', joinedDate: '2024-07-29' },
    { id: 'ref-5', client: 'Nairobi Organic Foods', plan: 'Multi-Store Cloud POS', monthlySpend: '$95.00', tierRate: '30%', monthlyComm: '$28.50', status: '14-Day Free Trial', joinedDate: '2024-10-24' }
  ]);

  // Mock Payouts
  const [payouts] = useState([
    { id: 'TXN-9041', date: '2026-10-15', amount: '$1,440.00', method: 'Direct Bank Wire (First Bank Nigeria)', status: 'Paid & Settled' },
    { id: 'TXN-8812', date: '2026-09-30', amount: '$1,385.50', method: 'Direct Bank Wire (First Bank Nigeria)', status: 'Paid & Settled' },
    { id: 'TXN-8540', date: '2026-09-15', amount: '$1,290.00', method: 'Direct Bank Wire (First Bank Nigeria)', status: 'Paid & Settled' },
    { id: 'TXN-8219', date: '2026-08-31', amount: '$1,150.00', method: 'Direct Bank Wire (First Bank Nigeria)', status: 'Paid & Settled' }
  ]);

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Toast Notification System State
  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: 'toast-init-1',
      type: 'lead_assignment',
      title: 'New High-Value Inbound Lead Assigned',
      description: 'Zuma Gourmet Bakery (Abuja) requested cloud POS consultation.',
      timestamp: 'Just now',
      clientName: 'Zuma Gourmet Bakery',
      location: 'Abuja, Nigeria',
      amount: '$180/mo ARR',
      targetTab: 'referrals',
      actionLabel: 'View in Pipeline',
      durationMs: 7000
    }
  ]);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerLeadToast = () => {
    const leads = [
      { client: 'Safina Fisheries & Cold Chain', location: 'Mombasa, Kenya', amount: '$240/mo ARR', desc: 'Enterprise 4-terminal POS & cold store inventory deployment.' },
      { client: 'Dakar Express Pharmacy', location: 'Dakar, Senegal', amount: '$150/mo ARR', desc: 'Inbound match for OHADA pharmaceutical accounting compliance.' },
      { client: 'Kigali Fresh Mart', location: 'Kigali, Rwanda', amount: '$190/mo ARR', desc: 'Electronic billing machine (EBM v2) synchronization required.' },
      { client: 'Gold Coast Auto Spares', location: 'Accra, Ghana', amount: '$220/mo ARR', desc: 'Multi-store barcode scanner & retail POS integration.' }
    ];
    const picked = leads[Math.floor(Math.random() * leads.length)];
    const newToast: ToastNotification = {
      id: `toast-lead-${Date.now()}`,
      type: 'lead_assignment',
      title: '🎯 Inbound Lead Assigned to Your Practice',
      description: `${picked.client} (${picked.location}) - ${picked.desc}`,
      timestamp: 'Just now',
      clientName: picked.client,
      location: picked.location,
      amount: picked.amount,
      targetTab: 'referrals',
      actionLabel: 'Open Pipeline',
      durationMs: 7000
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 3)]);
  };

  const triggerCommissionToast = () => {
    const payoutsList = [
      { amount: '$432.00', id: 'TXN-9821', bank: 'Direct Wire · First Bank Nigeria', client: 'GreenField Supermarket Renewal' },
      { amount: '$680.50', id: 'TXN-9822', bank: 'USD Swift · Standard Chartered', client: 'Lagos Medical Diagnostics Quarterly' },
      { amount: '$295.00', id: 'TXN-9823', bank: 'Direct Wire · First Bank Nigeria', client: 'Kigali Logistics Hub Annual' }
    ];
    const picked = payoutsList[Math.floor(Math.random() * payoutsList.length)];
    const newToast: ToastNotification = {
      id: `toast-comm-${Date.now()}`,
      type: 'commission_payout',
      title: '💰 Commission Wire Disbursed & Settled',
      description: `Disbursement ${picked.id} of ${picked.amount} successfully processed via ${picked.bank}.`,
      timestamp: 'Just now',
      amount: picked.amount,
      clientName: picked.client,
      targetTab: 'payouts',
      actionLabel: 'View Payout Receipt',
      durationMs: 7000
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 3)]);
  };

  const handleShowQuickActionToast = (message: string) => {
    const newToast: ToastNotification = {
      id: `toast-act-${Date.now()}`,
      type: 'tier_upgrade',
      title: '⚡ Quick Action Executed',
      description: message,
      timestamp: 'Just now',
      durationMs: 5000
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 3)]);
  };

  if (!isOpen) return null;

  const partnerCode = 'MSME-PT-8421';
  const referralLink = `https://www.msmebooks.org/signup?ref=${partnerCode}`;

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-50 dark:bg-[#061F4A] rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 dark:border-blue-800 flex flex-col overflow-hidden relative transition-colors duration-300 ease-in-out">
        {/* Top Portal Navigation Header */}
        <div className="bg-white dark:bg-[#072457] px-6 py-4 border-b border-slate-200 dark:border-blue-800/80 flex items-center justify-between gap-4 shrink-0 transition-colors duration-300 ease-in-out">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] flex items-center justify-center font-black text-sm">
              MB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Adeyemi Financial & Advisory</h3>
                <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase border border-transparent dark:border-amber-700/50">
                  Gold Partner (30%)
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                <span>{t('portal.partner_id', 'Partner ID')}: {partnerCode}</span>
                <span>·</span>
                <span className="text-emerald-600 dark:text-[#8CE600] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {t('portal.status_active', 'Status: Verified Active')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* In-Portal Notification Bell & Real-Time Slide-Over */}
            <PartnerNotificationsSlideOver
              variant="portal"
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />

            {/* Quick in-portal language switcher */}
            <LanguageSwitcher variant="portal" />

            <button
              type="button"
              onClick={() => setIsDiscoveryCallOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0A3981] dark:bg-blue-600 hover:bg-[#072c66] dark:hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Schedule Partner Strategy & Onboarding Call"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8CE600]" />
              <span>Schedule Call</span>
            </button>

            <button
              onClick={() => downloadBadgeSvg('gold', partnerCode)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-[#061F4A] hover:bg-blue-100 dark:hover:bg-[#092b61] rounded-lg transition-colors border border-blue-200 dark:border-blue-800 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {t('portal.download_badge', 'Download Badge')}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg text-sm cursor-pointer"
              title="Close Portal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Frictionless Partner SSO Authentication Bar (Google & LinkedIn) */}
        <div className="bg-slate-100/90 dark:bg-[#051A3D] px-6 py-2 border-b border-slate-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Authenticated Session:</span>
            {authProvider === 'google' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-blue-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-blue-800 font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-bold text-[#0A3981] dark:text-[#8CE600]">{authEmail}</span>
                <span className="text-[10px] text-emerald-600 dark:text-[#8CE600] font-bold">✓ Google SSO</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-blue-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-blue-800 font-medium">
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span className="font-bold text-[#0A3981] dark:text-[#8CE600]">{authEmail}</span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">✓ LinkedIn Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">Switch Account:</span>
            <button
              type="button"
              onClick={() => {
                setAuthProvider('google');
                setAuthEmail('adeyemi.financial@gmail.com');
                handleShowQuickActionToast('Logged in with Google Workspace SSO');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                authProvider === 'google'
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-blue-950/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-blue-800 hover:bg-slate-50'
              }`}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthProvider('linkedin');
                setAuthEmail('adeyemi.advisory@linkedin.com');
                handleShowQuickActionToast('Logged in with LinkedIn Professional Sync');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                authProvider === 'linkedin'
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-blue-950/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-blue-800 hover:bg-slate-50'
              }`}
            >
              <Linkedin className="w-3 h-3 text-[#0A66C2]" />
              <span>Sign in with LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="bg-white dark:bg-[#072457] px-6 border-b border-slate-200 dark:border-blue-800/80 flex gap-6 text-xs sm:text-sm font-semibold shrink-0 overflow-x-auto transition-colors duration-300 ease-in-out">
          {[
            { id: 'overview', label: t('portal.tab_overview', 'Overview') },
            { id: 'referrals', label: '📊 Lead Pipeline & Status' },
            { id: 'analytics', label: '📈 Conversion Analytics' },
            { id: 'leaderboard', label: t('portal.tab_leaderboard', '🏆 Global Leaderboard') },
            { id: 'generator', label: '🔗 Link & QR Studio' },
            { id: 'commissions', label: t('portal.tab_commissions', 'Commissions & Earnings') },
            { id: 'payouts', label: t('portal.tab_payouts', 'Payout History') },
            { id: 'support', label: t('portal.tab_support', 'Support & Escalation') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0A3981] dark:border-[#8CE600] text-[#0A3981] dark:text-[#8CE600] font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Interactive Real-Time Toast Simulation Bar */}
              <div className="bg-gradient-to-r from-blue-900/10 via-emerald-500/10 to-blue-900/10 dark:from-blue-950/80 dark:via-emerald-950/40 dark:to-blue-950/80 p-3.5 rounded-2xl border border-blue-200/80 dark:border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Live Toast Notification System</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-[#8CE600] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.2 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-300">
                      Dispatches interactive push alerts with sound cue, progress timer, and direct tab routing.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={triggerLeadToast}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-[#8CE600]" />
                    <span>Simulate Lead</span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerCommissionToast}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/60 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <DollarSign className="w-3 h-3 text-emerald-600 dark:text-[#8CE600]" />
                    <span>Simulate Commission</span>
                  </button>
                </div>
              </div>

              {/* Partner Quick Actions 1-Click Operations Grid */}
              <PartnerQuickActionsGrid
                onNavigateTab={(tab) => setActiveTab(tab as any)}
                onScheduleCall={() => setIsDiscoveryCallOpen(true)}
                partnerCode={partnerCode}
                referralLink={referralLink}
                onShowToast={handleShowQuickActionToast}
              />

              {/* New Partner Fast-Track Onboarding Checklist Widget */}
              <PartnerOnboardingChecklist
                onScheduleMeeting={() => setIsDiscoveryCallOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
                partnerCode={partnerCode}
              />

              {/* Visual Summary Cards: Total Earned, Pending Payouts, Next Payout Date */}
              <PayoutVisualSummary
                totalEarned={16240.00}
                pendingPayouts={1440.00}
                accruingCycle={480.00}
                nextPayoutDate="Nov 15, 2026"
                nextPayoutDayLabel="Friday · In 4 Days"
                payoutMethod="First Bank Nigeria (•••8821)"
                onViewPayouts={() => setActiveTab('payouts')}
                onViewCommissions={() => setActiveTab('commissions')}
              />

              {/* Dynamic Referral Link Generator Feature */}
              <ReferralLinkGenerator
                partnerCode={partnerCode}
                tierName="Gold Partner"
                commissionRate={30}
              />

              {/* Badges Earned & Partner Achievements System */}
              <PartnerAchievementsSystem />

              {/* KPI Cards Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('portal.kpi_monthly', 'Monthly Recurring Commission')}
                  </div>
                  <div className="text-2xl font-black text-[#0A3981] dark:text-[#8CE600] font-mono tabular-nums mt-1">
                    $1,440.00
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-[#8CE600] font-bold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('portal.kpi_total', 'Total Paid-out to Date')}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums mt-1">
                    $16,240.00
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">100% On-time Wire Settled</div>
                </div>

                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('portal.kpi_clients', 'Active Subscribed Clients')}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums mt-1">
                    48 Businesses
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">98.2% annual retention rate</div>
                </div>

                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Next Upgrade Target</div>
                  <div className="text-sm font-bold text-[#0284C7] dark:text-sky-300 mt-1">
                    Platinum (40% Rev Share)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Only 2 more clients to unlock!</div>
                </div>
              </div>

              {/* Two Column Grid: Official Badge + Recent Client Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Official Badge Card */}
                <div className="lg:col-span-4 bg-white dark:bg-[#0A2552] p-6 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm flex flex-col items-center text-center justify-between transition-colors">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-sky-300 mb-1">
                      Accredited Membership Credential
                    </div>
                    <div className="my-2">
                      <OfficialPartnerBadge tier="gold" size="md" partnerCode={partnerCode} />
                    </div>
                  </div>

                  <div className="w-full space-y-2 mt-4">
                    <button
                      onClick={() => downloadBadgeSvg('gold', partnerCode)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#8CE600] dark:text-[#061F4A]" />
                      Download High-Res SVG Badge
                    </button>
                  </div>
                </div>

                {/* Recent Referrals Table */}
                <div className="lg:col-span-8 bg-white dark:bg-[#0A2552] p-6 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Introduced Client Subscriptions</h4>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className="text-xs font-bold text-emerald-600 dark:text-[#8CE600] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Conversion Charts →</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('referrals')}
                        className="text-xs font-semibold text-[#0A3981] dark:text-sky-300 hover:underline cursor-pointer"
                      >
                        Pipeline Table →
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-blue-800/80 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[10px]">
                          <th className="py-2.5">Client Enterprise</th>
                          <th className="py-2.5">Plan / Modules</th>
                          <th className="py-2.5">Billing</th>
                          <th className="py-2.5">Monthly Share</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-blue-900/50">
                        {referrals.slice(0, 4).map((ref) => (
                          <tr key={ref.id} className="hover:bg-slate-50/70 dark:hover:bg-[#0c2e64]">
                            <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{ref.client}</td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-300">{ref.plan}</td>
                            <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300">{ref.monthlySpend}</td>
                            <td className="py-2.5 font-mono font-bold text-emerald-700 dark:text-[#8CE600]">{ref.monthlyComm}</td>
                            <td className="py-2.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#8CE600] border border-transparent dark:border-emerald-800">
                                {ref.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LEAD PIPELINE & STATUS TRACKING TABLE */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              <LeadStatusTrackingTable
                partnerCode={partnerCode}
                commissionRate={30}
              />
            </div>
          )}

          {/* TAB 2b: DATA VISUALIZATION DASHBOARD (RECHARTS) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <LeadConversionDashboard
                partnerCode={partnerCode}
                commissionRate={30}
                onNavigateToLeads={() => setActiveTab('referrals')}
              />
            </div>
          )}

          {/* TAB 3: DEDICATED REFERRAL LINK & QR STUDIO */}
          {activeTab === 'generator' && (
            <div className="space-y-6">
              <ReferralLinkGenerator
                partnerCode={partnerCode}
                tierName="Gold Partner"
                commissionRate={30}
              />
            </div>
          )}

          {/* TAB 3: COMMISSIONS */}
          {activeTab === 'commissions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Pending Commission</div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">$480.00</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Processing cycle end</div>
                </div>
                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approved for Next Disbursement</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-[#8CE600] font-mono mt-1">$1,440.00</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Disbursing next Friday</div>
                </div>
                <div className="bg-white dark:bg-[#0A2552] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Refund / Adjustment Deductions</div>
                  <div className="text-2xl font-black text-slate-400 dark:text-slate-500 font-mono mt-1">$0.00</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Zero chargebacks</div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0A2552] p-6 rounded-2xl border border-slate-200 dark:border-blue-800 transition-colors">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Commission Governance Policy</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Commissions are calculated as an approved percentage of collected software subscription billings. As a Gold Partner, your 30% revenue share applies to both initial subscription terms and recurring renewals. Independent implementation and training fees charged directly to your clients remain 100% retained by your practice.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <PayoutVisualSummary
                totalEarned={16240.00}
                pendingPayouts={1440.00}
                accruingCycle={480.00}
                nextPayoutDate="Nov 15, 2026"
                nextPayoutDayLabel="Friday · In 4 Days"
                payoutMethod="First Bank Nigeria (•••8821)"
                onViewCommissions={() => setActiveTab('commissions')}
              />

              <div className="bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800 p-6 shadow-sm transition-colors">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Official Commission Settlement History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-blue-800 bg-slate-50 dark:bg-[#061F4A] text-slate-500 dark:text-slate-300 uppercase text-[11px] font-semibold">
                      <th className="p-3">Reference ID</th>
                      <th className="p-3">Settlement Date</th>
                      <th className="p-3">Disbursed Amount</th>
                      <th className="p-3">Payout Destination</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-blue-900/50">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-[#0c2e64]">
                        <td className="p-3 font-mono font-bold text-[#0A3981] dark:text-[#8CE600]">{p.id}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">{p.date}</td>
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{p.amount}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{p.method}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#8CE600] border border-transparent dark:border-emerald-800">
                            {p.status}
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

          {/* TAB: GLOBAL LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <PartnerLeaderboard />
          )}

          {/* TAB 5: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-[#0A2552] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-sm transition-colors">
              <h3 className="text-lg font-bold text-[#0A3981] dark:text-white mb-1">Dedicated Partner Support Desk</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
                Need technical assistance configuring a multi-branch client, pairing POS hardware, or requesting custom enterprise pricing? Submit an escalation ticket directly to our senior engineering team.
              </p>

              {ticketSubmitted ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                  <Check className="w-8 h-8 text-emerald-600 dark:text-[#8CE600] mx-auto mb-2" />
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Ticket Submitted Successfully!</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Your Partner Success Lead will respond within 4 business hours.</div>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Ticket Category</label>
                    <select className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]">
                      <option>Technical Implementation / Hardware Sync</option>
                      <option>Commission & Payout Reconciliation</option>
                      <option>Client Migration & Bulk Data Import</option>
                      <option>Co-Marketing Collateral Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Assistance pairing thermal printer model XP-58"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Details & Context</label>
                    <textarea
                      rows={4}
                      required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Provide specific client context or issue details..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 text-xs sm:text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow cursor-pointer transition-colors"
                  >
                    Submit Priority Ticket
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Live In-Portal Toast Notifications */}
        <PortalToastNotification
          toasts={toasts}
          onDismiss={handleDismissToast}
          onNavigateTab={(tab) => setActiveTab(tab as any)}
        />

        {/* Schedule Discovery Call Modal */}
        <ScheduleDiscoveryCallModal
          isOpen={isDiscoveryCallOpen}
          onClose={() => setIsDiscoveryCallOpen(false)}
        />
      </div>
    </div>
  );
};
