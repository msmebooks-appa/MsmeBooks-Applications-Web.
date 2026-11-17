import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  Copy,
  Check,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BarChart3,
  Sliders,
  Bell,
  Sparkles,
  Trophy,
  Flame,
  Award,
  Zap,
  Video,
  QrCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { INITIAL_REFERRALS, INITIAL_TRANSACTIONS, INITIAL_PAYOUTS } from '../data/partnerData';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  GrowthNotificationToast, 
  GrowthMilestonesDrawer, 
  INITIAL_MILESTONES, 
  GrowthMilestone 
} from './GrowthNotificationToast';
import {
  LiveTrainingWidget,
  RsvpConfirmationToast,
  RsvpToastState
} from './LiveTrainingWidget';
import { ReferralQRCodeModal } from './ReferralQRCodeModal';

export const PartnerDashboardPreview: React.FC = () => {
  const { currency, currencyConfig, convertFromNGN, formatFromNGN, formatAmount } = useCurrency();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions' | 'payouts' | 'growth' | 'training'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<GrowthMilestone | null>(null);
  const [isMilestonesDrawerOpen, setIsMilestonesDrawerOpen] = useState(false);
  const [hasShownInitialToast, setHasShownInitialToast] = useState(false);
  const [rsvpToastState, setRsvpToastState] = useState<RsvpToastState | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Trigger celebration toast on first arrival or milestone achievement
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownInitialToast) {
        setActiveMilestone(INITIAL_MILESTONES[0]); // First 10 conversions milestone
        setHasShownInitialToast(true);
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [hasShownInitialToast]);

  // Conversion projection state for the bar chart (stored in base NGN: 20000)
  const [monthlyConversions, setMonthlyConversions] = useState<number>(8); // 8 new converted SMEs per month
  const [avgPlanValue, setAvgPlanValue] = useState<number>(20000); // ₦20,000 base avg plan

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.msmebooks.org/partner/ace-consulting');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('MSME-ACE-781');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Generate 6-month projected recurring revenue growth based on conversion velocity converted to active currency
  const chartData = useMemo(() => {
    const baseClients = 58; // Current active clients
    const months = ['Current (Oct)', 'Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027', 'Mar 2027'];
    const convertedPlanValue = convertFromNGN(avgPlanValue);

    return months.map((month, idx) => {
      const projectedClients = baseClients + (idx * monthlyConversions);
      let commissionRate = 0.30;
      let tierName = 'Gold (30%)';

      if (projectedClients >= 100) {
        commissionRate = 0.40;
        tierName = 'Platinum (40%)';
      }

      const totalSubscriptionMRR = projectedClients * convertedPlanValue;
      const partnerCommissionMRR = totalSubscriptionMRR * commissionRate;

      return {
        month,
        activeClients: projectedClients,
        commissionMRR: Math.round(partnerCommissionMRR),
        subscriptionMRR: Math.round(totalSubscriptionMRR),
        tierName
      };
    });
  }, [monthlyConversions, avgPlanValue, convertFromNGN]);

  return (
    <section id="dashboard" className="py-20 lg:py-28 bg-[#F7FAFC] dark:bg-[#0B1528] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>{t('dashboard.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            {t('dashboard.title')}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Dashboard Shell Mockup */}
        <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101e35] shadow-2xl overflow-hidden relative">
          {/* Floating Growth Milestone Toast Notification */}
          <GrowthNotificationToast
            activeMilestone={activeMilestone}
            onDismiss={() => setActiveMilestone(null)}
            onViewMilestoneTab={() => setActiveTab('growth')}
          />

          {/* Webinar RSVP Confirmation Toast Notification */}
          <RsvpConfirmationToast
            toastState={rsvpToastState}
            onDismiss={() => setRsvpToastState(null)}
          />

          {/* Growth Milestones Drawer / Quick Simulator */}
          <GrowthMilestonesDrawer
            isOpen={isMilestonesDrawerOpen}
            onClose={() => setIsMilestonesDrawerOpen(false)}
            milestones={INITIAL_MILESTONES}
            onTriggerToast={(ms) => {
              setActiveMilestone(ms);
              setIsMilestonesDrawerOpen(false);
            }}
            onViewGrowthTab={() => setActiveTab('growth')}
          />

          {/* Referral QR Code Generator & Downloader Modal */}
          <ReferralQRCodeModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            partnerCode="MSME-ACE-781"
            partnerName="Ace Advisory"
            partnerTier="Gold Partner (30%)"
          />

          {/* Dashboard Window Header Bar */}
          <div className="bg-[#142D4E] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="h-4 w-px bg-slate-600 mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">MsmeBooks Partner Portal</span>
                <span className="text-[11px] font-mono text-[#B9E51C] bg-[#B9E51C]/15 px-2 py-0.5 rounded">
                  Active Partner: Ace Advisory (Gold · 30%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {/* QR Code Quick Launcher Button */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B9E51C] hover:bg-[#a8d315] text-[#142D4E] text-xs font-black transition-all shadow-sm cursor-pointer group"
                title="Generate & download scannable SME onboarding QR code"
              >
                <QrCode className="w-3.5 h-3.5 text-[#142D4E] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Referral QR</span>
              </button>

              {/* Growth Milestones Toast Hub Trigger */}
              <button
                type="button"
                onClick={() => setIsMilestonesDrawerOpen(!isMilestonesDrawerOpen)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B9E51C]"
                title="Growth Notifications & Milestone Celebrations"
              >
                <Bell className="w-3.5 h-3.5 text-[#B9E51C] group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Growth Milestones</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#B9E51C] text-[#142D4E] leading-tight">
                  {INITIAL_MILESTONES.length}
                </span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B9E51C] rounded-full animate-ping opacity-75" />
              </button>

              <span className="text-slate-300 hidden sm:inline">Partner ID: #MSME-ACE-781</span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Verified Partner Desk</span>
              </span>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c182c] px-4 sm:px-6 overflow-x-auto scrollbar-none flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'referrals'
                  ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Referral Management (58)</span>
            </button>

            <button
              onClick={() => setActiveTab('commissions')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'commissions'
                  ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Commission Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'payouts'
                  ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Payouts & Banking</span>
            </button>

            <button
              onClick={() => setActiveTab('growth')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'growth'
                  ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tier Upgrades (Gold &rarr; Platinum)</span>
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'training'
                  ? 'border-[#1261B5] dark:border-[#B9E51C] text-[#1261B5] dark:text-[#B9E51C] bg-white dark:bg-[#14233c]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Live Training & Webinars</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#1261B5] text-white dark:bg-[#B9E51C] dark:text-[#142D4E]">
                4
              </span>
            </button>
          </div>

          {/* Dashboard Tab Content */}
          <div className="p-6 sm:p-8 bg-white dark:bg-[#14233c] min-h-[480px]">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Total Referred Clients
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">
                        74
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">+6 this month</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                      58 Active · 12 Trials · 4 In Review
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Active Paying Clients
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#1261B5] dark:text-[#B9E51C] font-mono tabular-nums">
                        58
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">(98.4% Retention)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                      {formatFromNGN(1420000)} monthly customer MRR
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-[#0e1b30] border border-blue-200 dark:border-blue-800">
                    <span className="text-[11px] font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider block">
                      Available Payout Balance
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">
                        {formatFromNGN(346200)}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1">
                      Eligible for withdrawal (Min {formatFromNGN(20000)} met)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Lifetime Commissions Paid
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums">
                        {formatFromNGN(3369300)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                      Disbursed to Access Bank PLC
                    </span>
                  </div>
                </div>

                {/* Referral Links & Tools Bar */}
                <div className="bg-[#142D4E] rounded-xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 w-full md:w-auto">
                    <span className="text-xs font-bold text-[#B9E51C] uppercase tracking-wider block">
                      Your Unique Attribution Link:
                    </span>
                    <p className="font-mono text-xs sm:text-sm text-slate-200 bg-black/30 px-3 py-1.5 rounded-lg select-all">
                      https://www.msmebooks.org/partner/ace-consulting
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="px-3.5 py-2 bg-[#B9E51C] hover:bg-[#a8d315] text-[#142D4E] rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer group"
                      title="Generate and download partner QR code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#142D4E] group-hover:scale-110 transition-transform" />
                      <span>Generate QR Code</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 bg-[#1261B5] hover:bg-[#0e4e94] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[#B9E51C]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Partner Link'}</span>
                    </button>

                    <button
                      onClick={handleCopyCode}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-[#B9E51C]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Code Copied!' : 'Code: MSME-ACE-781'}</span>
                    </button>
                  </div>
                </div>

                {/* Recharts Bar Chart: Projected Recurring Revenue Growth by Conversions */}
                <div className="bg-slate-50 dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700/60">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider mb-1">
                        <BarChart3 className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
                        <span>Recurring Commission Growth Projection</span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#142D4E] dark:text-white">
                        Projected Monthly Recurring Revenue by Conversion Velocity
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Forecast based on current 58 active clients plus steady monthly SME conversion rate.
                      </p>
                    </div>

                    {/* Interactive controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#14233c] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <Sliders className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Conversions:</span>
                        <select
                          value={monthlyConversions}
                          onChange={(e) => setMonthlyConversions(parseInt(e.target.value))}
                          aria-label="New SME Conversions Per Month"
                          className="text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] bg-transparent focus:outline-none cursor-pointer"
                        >
                          <option value={4}>+4 SMEs / month</option>
                          <option value={8}>+8 SMEs / month (Expected)</option>
                          <option value={12}>+12 SMEs / month (Aggressive)</option>
                          <option value={20}>+20 SMEs / month (Enterprise)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#14233c] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Plan:</span>
                        <select
                          value={avgPlanValue}
                          onChange={(e) => setAvgPlanValue(parseInt(e.target.value))}
                          aria-label="Average Subscription Plan Value"
                          className="text-xs font-bold text-[#142D4E] dark:text-white bg-transparent focus:outline-none cursor-pointer"
                        >
                          <option value={10000} className="bg-white dark:bg-[#14233c] text-slate-800 dark:text-slate-100">{formatFromNGN(10000)} / mo (Starter)</option>
                          <option value={20000} className="bg-white dark:bg-[#14233c] text-slate-800 dark:text-slate-100">{formatFromNGN(20000)} / mo (Pro Retail POS)</option>
                          <option value={35000} className="bg-white dark:bg-[#14233c] text-slate-800 dark:text-slate-100">{formatFromNGN(35000)} / mo (Multi-Branch)</option>
                          <option value={50000} className="bg-white dark:bg-[#14233c] text-slate-800 dark:text-slate-100">{formatFromNGN(50000)} / mo (Enterprise ERP)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* The Bar Chart */}
                  <div className="w-full h-72 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fill: '#94A3B8', fontSize: 11 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                          tickFormatter={(val) => formatAmount(val, { compact: true })}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fill: '#94A3B8', fontSize: 11 }}
                          axisLine={{ stroke: '#475569' }}
                          tickLine={false}
                          tickFormatter={(val) => `${val} clients`}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-[#142D4E] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans">
                                  <p className="font-bold text-[#B9E51C] text-[11px] uppercase tracking-wider">{label}</p>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-slate-300">Active Clients:</span>
                                    <span className="font-mono font-bold text-white tabular-nums">{data.activeClients} SMEs</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-slate-300">Total Customer MRR:</span>
                                    <span className="font-mono text-slate-200 tabular-nums">{formatAmount(data.subscriptionMRR)}</span>
                                  </div>
                                  <div className="flex justify-between gap-4 pt-1 border-t border-slate-700">
                                    <span className="text-slate-200 font-semibold">Your Commission MRR:</span>
                                    <span className="font-mono font-extrabold text-[#B9E51C] tabular-nums">
                                      {formatAmount(data.commissionMRR)} / mo
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    Tier: <span className="text-white font-medium">{data.tierName}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                          formatter={(value) => {
                            if (value === 'commissionMRR') return `Monthly Commission Earnings (${currencyConfig.symbol})`;
                            if (value === 'activeClients') return 'Active Subscribed SME Clients';
                            return value;
                          }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="commissionMRR"
                          name="commissionMRR"
                          fill="#1261B5"
                          radius={[6, 6, 0, 0]}
                          barSize={32}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="activeClients"
                          name="activeClients"
                          fill="#B9E51C"
                          radius={[6, 6, 0, 0]}
                          barSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary note below chart */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#1261B5]" />
                      <span>Primary Blue = Monthly Commission (Left Axis)</span>
                      <span className="mx-2">·</span>
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#B9E51C]" />
                      <span className="text-[#142D4E] dark:text-white font-medium">Lemon Green = Active Client Count (Right Axis)</span>
                    </span>
                    <span className="text-[#1261B5] dark:text-[#B9E51C] font-semibold">
                      *Reaching 100+ active clients unlocks Platinum 40% Tier
                    </span>
                  </div>
                </div>

                {/* Recent Referrals Snapshot */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-[#142D4E] dark:text-white">Recent Attributed Subscriptions</h4>
                    <button
                      onClick={() => setActiveTab('referrals')}
                      className="text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] hover:underline"
                    >
                      View all 58 active clients &rarr;
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-[#0c182c] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Customer Business</th>
                          <th className="p-3">Plan</th>
                          <th className="p-3">Monthly Value</th>
                          <th className="p-3">Your Commission (30%)</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {INITIAL_REFERRALS.slice(0, 3).map((ref) => (
                          <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-[#182c4d]/50">
                            <td className="p-3 font-semibold text-[#142D4E] dark:text-white">{ref.businessName}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">{ref.planName}</td>
                            <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{formatFromNGN(ref.monthlyValue)}/mo</td>
                            <td className="p-3 font-mono font-bold text-emerald-700 dark:text-[#B9E51C]">
                              {formatFromNGN(ref.monthlyValue * 0.3)}/mo
                            </td>
                            <td className="p-3">
                              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                                Active Subscription
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Live Training Widget */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-[#142D4E] dark:text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
                      <span>Live Training & Upcoming Webinars</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('training')}
                      className="text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] hover:underline cursor-pointer"
                    >
                      View full training portal &rarr;
                    </button>
                  </div>
                  <LiveTrainingWidget onRsvpToast={(toast) => setRsvpToastState(toast)} />
                </div>
              </div>
            )}

            {/* 2. REFERRALS MANAGEMENT TAB */}
            {activeTab === 'referrals' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Referral Directory & Attribution</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      All customers bound to partner code MSME-ACE-781 with permanent recurring commission rights.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQrModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#B9E51C] hover:bg-[#a8d315] text-[#142D4E] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      title="Generate unique scannable QR code for rapid SME client onboarding"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Referral QR Code</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer">
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filter by Status</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#1261B5] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-[#0e4e94]">
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[640px]">
                    <thead className="bg-slate-50 dark:bg-[#0c182c] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Client Organization</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Plan Subscribed</th>
                        <th className="p-3">Monthly Value</th>
                        <th className="p-3">Total Earned</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {INITIAL_REFERRALS.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-[#182c4d]/50">
                          <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{ref.id}</td>
                          <td className="p-3 font-bold text-[#142D4E] dark:text-white">{ref.businessName}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{ref.contactPerson}</td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">{ref.planName}</td>
                          <td className="p-3 font-mono font-semibold text-[#142D4E] dark:text-white">
                            {formatFromNGN(ref.monthlyValue)}
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-700 dark:text-[#B9E51C]">
                            {formatFromNGN(ref.commissionEarnedToDate)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                ref.status === 'active'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {ref.status === 'active' ? 'Active Paid' : '14-Day Free Trial'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. COMMISSION LEDGER TAB */}
            {activeTab === 'commissions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-[#142D4E] dark:text-white">Commission Transactions Ledger</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Itemized calculation records generated by eligible subscription billing events.
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 self-start sm:self-auto">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download October Statement</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[700px]">
                    <thead className="bg-slate-50 dark:bg-[#0c182c] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Reference No</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Period</th>
                        <th className="p-3">Gross Sub</th>
                        <th className="p-3">Rate</th>
                        <th className="p-3">Your Commission</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {INITIAL_TRANSACTIONS.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-[#182c4d]/50">
                          <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{tx.referenceNumber}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{tx.date}</td>
                          <td className="p-3 font-bold text-[#142D4E] dark:text-white">{tx.customerName}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{tx.billingPeriod}</td>
                          <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{formatFromNGN(tx.grossAmount)}</td>
                          <td className="p-3 font-mono font-bold text-[#1261B5] dark:text-[#B9E51C]">30%</td>
                          <td className="p-3 font-mono font-bold text-emerald-700 dark:text-[#B9E51C]">
                            {formatFromNGN(tx.commissionAmount)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                tx.status === 'approved'
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1261B5] dark:text-blue-300'
                                  : tx.status === 'paid'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {tx.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Adjustment notice */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0e1b30] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-700 dark:text-slate-200">Audit Trail Security:</strong> All financial entries are immutable. Refund and chargeback adjustments appear as explicit reversal ledger entries with matched billing event identifiers.
                </div>
              </div>
            )}

            {/* 4. PAYOUTS & BANKING TAB */}
            {activeTab === 'payouts' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Available Balance to Withdraw
                      </span>
                      <span className="text-3xl font-extrabold text-[#142D4E] dark:text-white font-mono tabular-nums block mt-1">
                        {formatFromNGN(346200)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                        Minimum withdrawal requirement: {formatFromNGN(20000)} (Satisfied)
                      </span>
                    </div>

                    <button
                      onClick={() => setWithdrawalRequested(true)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                        withdrawalRequested
                          ? 'bg-emerald-600'
                          : 'bg-[#1261B5] hover:bg-[#0e4e94] shadow-sm'
                      }`}
                    >
                      {withdrawalRequested ? 'Withdrawal Submitted' : 'Request Payout Now'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Bank Settlement Rail
                    </span>
                    <p className="text-xs font-bold text-[#142D4E] dark:text-white">Access Bank PLC</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">Acct: ······4921</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                      Verified Automated Rail ({currencyConfig.code} Payout)
                    </p>
                  </div>
                </div>

                {withdrawalRequested && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C] shrink-0" />
                      <span>
                        Payout request for <strong>{formatFromNGN(346200)}</strong> queued for automated processing on next cycle (15th or 30th).
                      </span>
                    </div>
                    <button
                      onClick={() => setWithdrawalRequested(false)}
                      className="text-xs text-emerald-700 dark:text-[#B9E51C] underline font-semibold ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-[#142D4E] dark:text-white mb-3">Historical Payout Records</h4>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
                    <table className="w-full text-xs text-left min-w-[600px]">
                      <thead className="bg-slate-50 dark:bg-[#0c182c] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Disbursement ID</th>
                          <th className="p-3">Payment Date</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Settlement Method</th>
                          <th className="p-3">Bank Reference</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {INITIAL_PAYOUTS.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-[#182c4d]/50">
                            <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{pay.id}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{pay.date}</td>
                            <td className="p-3 font-mono font-bold text-[#142D4E] dark:text-white">
                              {formatFromNGN(pay.amount)}
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">{pay.method}</td>
                            <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{pay.referenceNumber}</td>
                            <td className="p-3">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                Completed
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

            {/* 5. TIER UPGRADE PROGRESS TAB */}
            {activeTab === 'growth' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50/40 dark:from-[#0e1b30] dark:to-[#102436] p-6 rounded-2xl border border-blue-200/80 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider block">
                        Current Tier Status
                      </span>
                      <h3 className="text-xl font-extrabold text-[#142D4E] dark:text-white">
                        Gold Partner (30% Recurring Commission)
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-[#1261B5] text-white text-xs font-bold rounded-lg self-start sm:self-auto">
                      Target: Platinum Partner (40%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Active Customer Volume</span>
                      <span className="font-mono text-[#1261B5] dark:text-[#B9E51C]">58 / 100 Clients (58% Achieved)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                      <div className="bg-[#1261B5] dark:bg-[#B9E51C] h-full rounded-full transition-all duration-500 w-[58%]" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Add 42 more active paying clients to qualify for automatic Platinum Partner review.
                    </span>
                  </div>
                </div>

                {/* Upgrade Checklist */}
                <div>
                  <h4 className="text-sm font-bold text-[#142D4E] dark:text-white mb-3">Platinum Tier Qualification Checklist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#142D4E] dark:text-white block">Product Certification Completed</strong>
                        <span className="text-slate-500 dark:text-slate-400">Passed MsmeBooks Accounting & POS Partner Training masterclass.</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#142D4E] dark:text-white block">High Customer Retention (&gt;90%)</strong>
                        <span className="text-slate-500 dark:text-slate-400">Current portfolio retention sits at 98.4%.</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#142D4E] dark:text-white block">Customer Volume Threshold</strong>
                        <span className="text-slate-500 dark:text-slate-400">Requires 100 active clients (currently at 58).</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-[#0e1b30] border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#142D4E] dark:text-white block">Enterprise Distribution Agreement</strong>
                        <span className="text-slate-500 dark:text-slate-400">Assigned upon hitting active threshold for regional co-marketing.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Milestones & Live Toast Celebrations */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#142D4E] dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#B9E51C]" />
                        <span>Growth Milestones & Toast Celebrations</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Automated toast alerts fire whenever you surpass key conversion benchmarks and revenue leaps.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMilestonesDrawerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] bg-[#1261B5]/10 dark:bg-[#B9E51C]/10 hover:bg-[#1261B5]/20 dark:hover:bg-[#B9E51C]/20 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Open Milestones Drawer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {INITIAL_MILESTONES.map((ms) => {
                      const isFirst10 = ms.id === 'ms-10-conversions';
                      const isRevSurge = ms.id === 'ms-10pct-revenue';

                      return (
                        <div
                          key={ms.id}
                          className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                            isFirst10
                              ? 'bg-gradient-to-br from-lime-50/60 to-white dark:from-[#132822] dark:to-[#0e1b30] border-lime-300/80 dark:border-lime-500/30 shadow-sm'
                              : isRevSurge
                              ? 'bg-gradient-to-br from-blue-50/60 to-white dark:from-[#0e213b] dark:to-[#0e1b30] border-blue-200 dark:border-blue-500/30 shadow-sm'
                              : 'bg-white dark:bg-[#0e1b30] border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-[#142D4E] dark:text-white leading-tight">
                                {ms.title}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#142D4E] dark:bg-[#1b3457] text-[#B9E51C] font-semibold shrink-0">
                                {ms.metricBadge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                              {ms.description}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg mb-3 font-medium">
                              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B9E51C] shrink-0" />
                              <span>{ms.rewardText}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              Achieved: {ms.timestamp}
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveMilestone(ms)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] hover:underline cursor-pointer"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Trigger Toast</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 6. LIVE TRAINING TAB */}
            {activeTab === 'training' && (
              <div className="space-y-6 animate-fade-in">
                <LiveTrainingWidget onRsvpToast={(toast) => setRsvpToastState(toast)} />
              </div>
            )}
          </div>
        </div>

        {/* Security & Access note */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>
            *Partner portal records are securely scoped to authenticated partner accounts with role-based access control and multi-factor authentication.
          </p>
        </div>
      </div>
    </section>
  );
};
