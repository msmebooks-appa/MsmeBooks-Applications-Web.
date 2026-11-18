import React, { useState } from 'react';
import { 
  Users, 
  Gift, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Percent
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface PartnerReferralRewardsSectionProps {
  onOpenApply?: () => void;
  partnerCode?: string;
}

export const PartnerReferralRewardsSection: React.FC<PartnerReferralRewardsSectionProps> = ({
  onOpenApply,
  partnerCode = 'MSME-PT-8421'
}) => {
  const { t } = useLanguage();
  const [referredCount, setReferredCount] = useState<number>(4);
  const [avgClientsPerPeer, setAvgClientsPerPeer] = useState<number>(10);
  const [avgClientSub, setAvgClientSub] = useState<number>(65); // $65 avg monthly plan
  const [copiedLink, setCopiedLink] = useState(false);

  // Rewards Calculations
  const upfrontBounty = referredCount * 150; // $150 per peer on onboarding first 3 clients
  const totalReferredClients = referredCount * avgClientsPerPeer;
  const totalReferredMRR = totalReferredClients * avgClientSub;
  const monthlyOverrideEarnings = totalReferredMRR * 0.05; // 5% lifetime override
  const annualOverrideEarnings = monthlyOverrideEarnings * 12;
  const totalFirstYearValue = upfrontBounty + annualOverrideEarnings;

  const referralLink = `https://www.msmebooks.org/partner-programme?peer_ref=${partnerCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const steps = [
    {
      step: '01',
      title: 'Share Your Partner Referral Link',
      desc: 'Send your personalized invite link or QR code to fellow accountants, IT resellers, and consulting practices across your network.'
    },
    {
      step: '02',
      title: 'Peer Onboards & Gets Certified',
      desc: 'Your invited peer receives complimentary access to the MsmeBooks Certification Academy and priority application review within 24 hours.'
    },
    {
      step: '03',
      title: 'Unlock $150 Bounty + 5% Lifetime Override',
      desc: 'Receive $150 direct cash credit when they onboard their first 3 clients, plus a continuous 5% recurring revenue share on all their client renewals forever.'
    }
  ];

  return (
    <section id="partner-rewards" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#8CE600] border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Gift className="w-3.5 h-3.5" />
            Partner-to-Partner (P2P) Referral Programme
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Refer a Partner. Earn $150 + 5% Lifetime Recurring Override.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            Grow Africa’s leading accounting ecosystem while building a secondary, hands-off passive income stream. When you introduce another accounting practice or IT vendor, you share in their long-term success.
          </p>
        </div>

        {/* 3 Pillars of Partner Referral Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Reward 1 */}
          <div className="bg-gradient-to-br from-blue-50/60 via-white to-white dark:from-[#0A2552] dark:via-[#072048] dark:to-[#071c3d] p-6 sm:p-8 rounded-3xl border border-blue-200/80 dark:border-blue-800 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0A3981] dark:bg-blue-600 text-white flex items-center justify-center font-black text-xl mb-5 shadow-sm">
              <DollarSign className="w-6 h-6 text-[#8CE600]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#8CE600] mb-1">
              Upfront Onboarding Cash
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              $150 Activation Bounty
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Disbursed immediately into your verified settlement account as soon as your referred peer deploys MsmeBooks for their first 3 active client businesses.
            </p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-[#8CE600] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Paid per activated partner with no upper cap
            </div>
          </div>

          {/* Reward 2 */}
          <div className="bg-gradient-to-br from-emerald-50/60 via-white to-white dark:from-[#062445] dark:via-[#072048] dark:to-[#071c3d] p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 dark:border-[#8CE600]/50 shadow-md relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
              Most Lucrative
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 dark:bg-[#8CE600] text-white dark:text-[#061F4A] flex items-center justify-center font-black text-xl mb-5 shadow-sm">
              <Percent className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#8CE600] mb-1">
              Hands-Off Passive Revenue
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              5% Lifetime Override
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Every month your referred peer’s clients renew their subscriptions, you earn a 5% override bonus. Does not reduce your peer’s tier commission.
            </p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-[#8CE600] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Compounding recurring monthly wire transfer
            </div>
          </div>

          {/* Reward 3 */}
          <div className="bg-gradient-to-br from-purple-50/60 via-white to-white dark:from-[#0A2552] dark:via-[#072048] dark:to-[#071c3d] p-6 sm:p-8 rounded-3xl border border-purple-200/80 dark:border-blue-800 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl mb-5 shadow-sm">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300 mb-1">
              Tier Accelerator & Prestige
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Fast-Track Tier Points
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Earn 500 Ecosystem Credits per accredited peer. Accelerates your path to Gold (30%) and Platinum (40%) tiers without needing extra solo client volume.
            </p>
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> VIP invites to Pan-African Partner Summits
            </div>
          </div>
        </div>

        {/* Interactive Referral Rewards Simulator */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-[#072457] dark:via-[#0A2552] dark:to-[#051838] rounded-3xl border-2 border-blue-200 dark:border-blue-800 p-6 sm:p-10 shadow-xl mb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-blue-800">
            <div>
              <span className="text-xs font-extrabold text-[#0A3981] dark:text-[#8CE600] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Earnings Model
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Calculate Your Partner Referral Potential
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-blue-100/80 mt-1">
                Adjust the sliders to simulate upfront cash bounties plus compounding monthly passive overrides.
              </p>
            </div>

            {/* Quick Share Pill */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#061F4A] p-2 rounded-2xl border border-slate-200 dark:border-blue-800 shadow-xs">
              <span className="text-xs font-mono font-bold text-[#0A3981] dark:text-[#8CE600] px-2 truncate max-w-xs">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-[#0A3981] hover:bg-[#072c66] dark:bg-[#8CE600] dark:hover:bg-[#9be81c] text-white dark:text-[#061F4A] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Sliders Area */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Partners Referred */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                    Partners You Introduce to MsmeBooks:
                  </label>
                  <span className="text-base font-black text-[#0A3981] dark:text-[#8CE600] font-mono">
                    {referredCount} Accounting/IT Partners
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={referredCount}
                  onChange={(e) => setReferredCount(parseInt(e.target.value))}
                  className="w-full accent-[#0A3981] dark:accent-[#8CE600] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 Partner</span>
                  <span>10 Partners</span>
                  <span>25 Partners</span>
                </div>
              </div>

              {/* Slider 2: Average Clients per Peer */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                    Avg Clients Onboarded per Referred Partner:
                  </label>
                  <span className="text-base font-black text-[#0A3981] dark:text-[#8CE600] font-mono">
                    {avgClientsPerPeer} Businesses / Partner
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={35}
                  value={avgClientsPerPeer}
                  onChange={(e) => setAvgClientsPerPeer(parseInt(e.target.value))}
                  className="w-full accent-[#0A3981] dark:accent-[#8CE600] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>3 Clients (Starter)</span>
                  <span>15 Clients (Growing Firm)</span>
                  <span>35+ Clients (Regional Leader)</span>
                </div>
              </div>

              {/* Projected Network Scale Summary */}
              <div className="bg-white/80 dark:bg-[#061F4A]/80 p-4 rounded-2xl border border-slate-200 dark:border-blue-900 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">
                  Total Active Downstream Clients:
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                  {totalReferredClients} Subscribed Businesses
                </span>
              </div>
            </div>

            {/* Calculations Result Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0A3981] to-[#051F4A] rounded-2xl p-6 sm:p-8 text-white border border-blue-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="text-xs uppercase font-extrabold tracking-wider text-[#8CE600] mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Your Projected Referral Return
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1">
                  ${totalFirstYearValue.toLocaleString()}
                  <span className="text-xs font-sans text-blue-200 font-normal ml-2">Total Year 1</span>
                </div>
              </div>

              <div className="my-6 space-y-3 border-y border-blue-800/80 py-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Upfront Cash Bounties ($150/ea):</span>
                  <span className="font-mono font-bold text-white">${upfrontBounty.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Monthly Passive Override (5%):</span>
                  <span className="font-mono font-bold text-[#8CE600]">${Math.round(monthlyOverrideEarnings).toLocaleString()} / month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Annualized Recurring Override:</span>
                  <span className="font-mono font-bold text-white">${Math.round(annualOverrideEarnings).toLocaleString()} / year</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#8CE600] hover:bg-[#9be81c] text-[#061F4A] font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Invite a Peer Today</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Simple Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-slate-50 dark:bg-[#072457] p-6 rounded-2xl border border-slate-200 dark:border-blue-800 flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl font-black font-mono text-[#0A3981] dark:text-[#8CE600] mb-2">
                  {st.step}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
