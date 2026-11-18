import React, { useState } from 'react';
import { 
  Gift, 
  Users, 
  Building2, 
  UserCheck, 
  TrendingUp, 
  Award, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  Filter, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  QrCode, 
  Mail, 
  Phone, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Briefcase,
  ChevronDown,
  Trophy,
  Zap,
  X,
  Star,
  Flame,
  Medal,
  Target,
  Lock,
  Crown,
  Percent,
  Table,
  Eye,
  Layers,
  BadgePercent,
  CheckCheck
} from 'lucide-react';
import { 
  ReferralSubmission, 
  ReferralTargetType, 
  RewardOption, 
  RedemptionRecord,
  ReferralMilestone,
  RewardTierBenefit
} from '../types';
import { 
  DEMO_PARTNER_PROFILES, 
  INITIAL_REFERRALS, 
  REWARDS_CATALOG, 
  INITIAL_REDEMPTIONS, 
  POINT_EARNING_RULES,
  TIER_MILESTONES,
  REFERRAL_MILESTONES,
  REWARD_TIER_BENEFITS,
  PartnerReferralProfile
} from '../data/referralData';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyToggle } from './CurrencyToggle';

export interface PartnerReferralSectionProps {
  onOpenDirectory?: () => void;
}

export const PartnerReferralSection: React.FC<PartnerReferralSectionProps> = ({ onOpenDirectory }) => {
  const { formatAmount } = useCurrency();

  // Active Partner Profile
  const [selectedPartnerIndex, setSelectedPartnerIndex] = useState<number>(0);
  const currentPartner: PartnerReferralProfile = DEMO_PARTNER_PROFILES[selectedPartnerIndex];

  // Active Section Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'refer-form' | 'pipeline' | 'share-tools'>('dashboard');

  // Referrals List State
  const [referrals, setReferrals] = useState<ReferralSubmission[]>(INITIAL_REFERRALS);

  // Redemptions Ledger State
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>(INITIAL_REDEMPTIONS);

  // Filter state for pipeline
  const [pipelineFilter, setPipelineFilter] = useState<'all' | 'business' | 'consultant' | 'converted'>('all');
  const [pipelineSearch, setPipelineSearch] = useState<string>('');

  // Referral Detail Modal State
  const [selectedReferralDetail, setSelectedReferralDetail] = useState<ReferralSubmission | null>(null);

  // Reward Redemption Modal State
  const [selectedRewardForRedemption, setSelectedRewardForRedemption] = useState<RewardOption | null>(null);
  const [redemptionSuccessMsg, setRedemptionSuccessMsg] = useState<string | null>(null);

  // Copy Referral Link Feedback
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Form State for Submitting New Referral
  const [referralType, setReferralType] = useState<ReferralTargetType>('business');
  const [formEntityName, setFormEntityName] = useState<string>('');
  const [formContactPerson, setFormContactPerson] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formCountry, setFormCountry] = useState<string>('Nigeria');
  const [formCity, setFormCity] = useState<string>('');
  const [formIndustryOrSpecialty, setFormIndustryOrSpecialty] = useState<string>('Retail & Supermarket');
  const [formSizeOrExp, setFormSizeOrExp] = useState<string>('1 - 3 Branches');
  const [formSoftwareNeeds, setFormSoftwareNeeds] = useState<string[]>(['Multi-Branch POS']);
  const [formNotes, setFormNotes] = useState<string>('');
  const [formAlreadyIntroduced, setFormAlreadyIntroduced] = useState<boolean>(true);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Gamified Milestones State & Alert
  const [showMilestoneAlert, setShowMilestoneAlert] = useState<boolean>(true);
  const [selectedMilestoneModal, setSelectedMilestoneModal] = useState<ReferralMilestone | null>(null);
  const [copiedMilestoneBadge, setCopiedMilestoneBadge] = useState<boolean>(false);
  const [showConfettiBurst, setShowConfettiBurst] = useState<boolean>(false);
  const [rewardTierFilter, setRewardTierFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Calculate dynamic stats
  const totalPointsEarned = referrals.reduce((sum, r) => sum + r.pointsAwarded, 0) + 1150; // includes historical converted baseline
  const totalPointsSpent = redemptions.reduce((sum, r) => sum + r.pointsSpent, 0);
  const availablePoints = Math.max(0, totalPointsEarned - totalPointsSpent);
  const convertedReferralsCount = referrals.filter(r => r.status === 'Converted & Active' || r.status === 'Consultant Certified').length;
  const inProgressReferralsCount = referrals.filter(r => r.status !== 'Converted & Active' && r.status !== 'Consultant Certified').length;

  // Milestone gamification calculations
  const hasReachedFiveMilestone = convertedReferralsCount >= 5;
  const fiveMilestoneData = REFERRAL_MILESTONES.find(m => m.targetCount === 5) || REFERRAL_MILESTONES[2];

  // Referral Milestone Progression Calculations
  const sortedReferralMilestones = [...REFERRAL_MILESTONES].sort((a, b) => a.targetCount - b.targetCount);
  const currentAchievedMilestone = [...sortedReferralMilestones].reverse().find(m => convertedReferralsCount >= m.targetCount) || null;
  const nextMilestone = sortedReferralMilestones.find(m => m.targetCount > convertedReferralsCount) || null;
  const isAllMilestonesAchieved = !nextMilestone;
  const prevMilestoneTarget = currentAchievedMilestone ? currentAchievedMilestone.targetCount : 0;
  const nextMilestoneTarget = nextMilestone ? nextMilestone.targetCount : sortedReferralMilestones[sortedReferralMilestones.length - 1].targetCount;
  const referralsNeededForNext = nextMilestone ? Math.max(0, nextMilestone.targetCount - convertedReferralsCount) : 0;

  // Percentage towards the next milestone badge (0% - 100%)
  const progressToNextMilestonePercent = nextMilestone
    ? Math.min(100, Math.max(0, Math.round((convertedReferralsCount / nextMilestone.targetCount) * 100)))
    : 100;

  // Bracket percentage between last achieved and next target
  const bracketProgressPercent = nextMilestone
    ? Math.min(100, Math.max(0, Math.round(((convertedReferralsCount - prevMilestoneTarget) / (nextMilestone.targetCount - prevMilestoneTarget)) * 100)))
    : 100;

  // Overall milestone journey percentage across all 4 tiers (0 to 10 max target)
  const maxMilestoneTarget = sortedReferralMilestones[sortedReferralMilestones.length - 1].targetCount;
  const overallMilestonePercent = Math.min(100, Math.max(0, Math.round((convertedReferralsCount / maxMilestoneTarget) * 100)));

  // Filtered reward tiers
  const filteredRewardTiers = REWARD_TIER_BENEFITS.filter(tier => {
    const isAchieved = convertedReferralsCount >= tier.targetCount;
    if (rewardTierFilter === 'unlocked') return isAchieved;
    if (rewardTierFilter === 'locked') return !isAchieved;
    return true;
  });

  // Next points tier calculation (Points-based tiers)
  const currentTierIndex = TIER_MILESTONES.findIndex(t => totalPointsEarned >= t.minPoints && totalPointsEarned <= t.maxPoints);
  const currentTier = TIER_MILESTONES[currentTierIndex >= 0 ? currentTierIndex : TIER_MILESTONES.length - 1];
  const nextTier = TIER_MILESTONES[Math.min(TIER_MILESTONES.length - 1, (currentTierIndex >= 0 ? currentTierIndex : 0) + 1)];
  const progressPercent = Math.min(100, Math.round(((totalPointsEarned - currentTier.minPoints) / (currentTier.maxPoints - currentTier.minPoints)) * 100));

  // Referral URL
  const referralBaseUrl = `https://partners.msmebooks.org/ref/${currentPartner.partnerId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralBaseUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const handleCopyMilestoneBadge = (code: string) => {
    navigator.clipboard.writeText(`MSME-AMB-${code}-${currentPartner.partnerId}`);
    setCopiedMilestoneBadge(true);
    setTimeout(() => setCopiedMilestoneBadge(false), 2400);
  };

  // Convert a referral from pipeline
  const handleConvertReferral = (referralId: string) => {
    setReferrals(prev => prev.map(item => {
      if (item.id === referralId) {
        const bonusPts = item.provisionalPoints > 0 ? item.provisionalPoints : (item.type === 'business' ? 1250 : 1500);
        return {
          ...item,
          status: item.type === 'consultant' ? 'Consultant Certified' : 'Converted & Active',
          pointsAwarded: item.pointsAwarded + bonusPts,
          provisionalPoints: 0,
          lastUpdateDate: '2026-09-25'
        };
      }
      return item;
    }));

    // Trigger celebration if this converts the 5th referral
    if (convertedReferralsCount + 1 >= 5) {
      setShowMilestoneAlert(true);
      setShowConfettiBurst(true);
      setTimeout(() => setShowConfettiBurst(false), 4000);
    }
  };

  // Milestone Simulator for instantaneous testing between 4 and 5 referrals
  const handleToggleFiveMilestoneDemo = () => {
    if (hasReachedFiveMilestone) {
      setReferrals(prev => prev.map(r => {
        if (r.id === 'ref-105') {
          return {
            ...r,
            status: 'Pilot Onboarding',
            pointsAwarded: 250,
            provisionalPoints: 1000
          };
        }
        return r;
      }));
    } else {
      setReferrals(prev => prev.map(r => {
        if (r.id === 'ref-105') {
          return {
            ...r,
            status: 'Converted & Active',
            pointsAwarded: 1250,
            provisionalPoints: 0
          };
        }
        return r;
      }));
      setShowMilestoneAlert(true);
      setShowConfettiBurst(true);
      setTimeout(() => setShowConfettiBurst(false), 4000);
    }
  };

  // Simulate any referral milestone level for interactive testing of the progress bar
  const handleSimulateReferralCount = (targetCount: number) => {
    setReferrals(prev => {
      let count = 0;
      return prev.map(r => {
        if (count < targetCount) {
          count++;
          return {
            ...r,
            status: r.type === 'consultant' ? 'Consultant Certified' : 'Converted & Active',
            pointsAwarded: r.pointsAwarded > 0 ? r.pointsAwarded : (r.type === 'consultant' ? 1500 : 1250),
            provisionalPoints: 0,
            lastUpdateDate: '2026-09-25'
          };
        } else {
          return {
            ...r,
            status: 'Pilot Onboarding',
            pointsAwarded: 250,
            provisionalPoints: 1000,
            lastUpdateDate: '2026-09-25'
          };
        }
      });
    });

    if (targetCount >= 5) {
      setShowMilestoneAlert(true);
      setShowConfettiBurst(true);
      setTimeout(() => setShowConfettiBurst(false), 4000);
    }
  };

  const handleToggleSoftwareNeed = (item: string) => {
    setFormSoftwareNeeds(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  // Submit Referral Handler
  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEntityName.trim() || !formContactPerson.trim() || !formEmail.trim()) {
      setFormError('Please fill in the entity name, contact person, and email address.');
      return;
    }

    setFormError(null);

    const instantBonusPoints = 100;
    const estimatedPendingPoints = referralType === 'business' ? 1250 : 1500;

    const newReferral: ReferralSubmission = {
      id: `ref-${Date.now()}`,
      partnerId: currentPartner.partnerId,
      partnerName: currentPartner.partnerName,
      type: referralType,
      entityName: formEntityName.trim(),
      contactPerson: formContactPerson.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || '+234 800 000 0000',
      country: formCountry,
      city: formCity.trim() || 'Headquarters',
      industryOrSpecialty: formIndustryOrSpecialty,
      sizeOrExperience: formSizeOrExp,
      softwareNeeds: formSoftwareNeeds,
      notes: formNotes.trim() || (formAlreadyIntroduced ? 'Introduced directly to MsmeBooks ecosystem.' : 'Awaiting introductory contact.'),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      pointsAwarded: instantBonusPoints,
      provisionalPoints: estimatedPendingPoints,
      dealValueUSD: referralType === 'business' ? 3200 : 5000,
      lastUpdateDate: new Date().toISOString().split('T')[0],
    };

    setReferrals(prev => [newReferral, ...prev]);
    setFormSuccessMessage(`Referral for "${newReferral.entityName}" successfully submitted! +${instantBonusPoints} initial registration points have been added to your dashboard.`);

    // Reset fields
    setFormEntityName('');
    setFormContactPerson('');
    setFormEmail('');
    setFormPhone('');
    setFormCity('');
    setFormNotes('');

    // Clear success message after delay
    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 6000);
  };

  // Redeem Reward Handler
  const handleConfirmRedemption = (reward: RewardOption) => {
    if (availablePoints < reward.pointsRequired) {
      alert('You do not have enough available points for this reward.');
      return;
    }

    const newRedemption: RedemptionRecord = {
      id: `red-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsRequired,
      redeemedAt: new Date().toISOString().split('T')[0],
      status: 'Processing',
      referenceCode: `TX-MSME-${Math.floor(1000 + Math.random() * 9000)}-RW`,
    };

    setRedemptions(prev => [newRedemption, ...prev]);
    setSelectedRewardForRedemption(null);
    setRedemptionSuccessMsg(`Successfully redeemed "${reward.title}" for ${reward.pointsRequired.toLocaleString()} points! Reference code: ${newRedemption.referenceCode}. Our partner ops team will disburse the benefit within 24 business hours.`);

    setTimeout(() => {
      setRedemptionSuccessMsg(null);
    }, 7000);
  };

  // Filtered referrals list for the pipeline tab
  const filteredReferrals = referrals.filter(item => {
    if (pipelineFilter === 'business' && item.type !== 'business') return false;
    if (pipelineFilter === 'consultant' && item.type !== 'consultant') return false;
    if (pipelineFilter === 'converted' && item.status !== 'Converted & Active' && item.status !== 'Consultant Certified') return false;
    if (pipelineSearch.trim()) {
      const q = pipelineSearch.toLowerCase();
      const matchName = item.entityName.toLowerCase().includes(q);
      const matchPerson = item.contactPerson.toLowerCase().includes(q);
      const matchCountry = item.country.toLowerCase().includes(q);
      const matchIndustry = item.industryOrSpecialty.toLowerCase().includes(q);
      return matchName || matchPerson || matchCountry || matchIndustry;
    }
    return true;
  });

  return (
    <section 
      id="partner-referrals" 
      className="py-20 bg-slate-100/70 dark:bg-[#061426] text-slate-900 dark:text-slate-100 relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400">
              <Gift className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>Partner Ecosystem Growth</span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-slate-400">Referral & Rewards Network</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Refer Businesses & Consultants. <span className="text-lime-600 dark:text-lime-400">Earn Rewarding Points.</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Grow the MsmeBooks ecosystem by referring fellow implementation consultants or SMEs in need of cloud POS and accounting. Earn up to 2,500 points per deployment, redeemable for direct cash wire payouts, software credits, and summit passes.
            </p>
          </div>

          {/* Account Switcher for Demo / Partner Session */}
          <div className="bg-white dark:bg-[#0c1f38] border border-slate-200 dark:border-slate-700/80 p-3 rounded-2xl shadow-sm space-y-2 min-w-[280px]">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Active Partner Session</span>
              </span>
              <span className="font-mono text-[11px] text-lime-600 dark:text-lime-400 font-bold">
                {currentPartner.tier} Partner
              </span>
            </div>

            <div className="relative">
              <select
                aria-label="Switch partner profile"
                value={selectedPartnerIndex}
                onChange={(e) => setSelectedPartnerIndex(Number(e.target.value))}
                className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 dark:bg-[#07172b] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 appearance-none pr-8 cursor-pointer"
              >
                {DEMO_PARTNER_PROFILES.map((profile, idx) => (
                  <option key={profile.partnerId} value={idx}>
                    {profile.partnerName} ({profile.partnerId})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Multiplier: <strong className="text-slate-700 dark:text-slate-200 font-mono">{currentPartner.tierPointsMultiplier}x</strong></span>
              <span className="truncate max-w-[150px]">{currentPartner.country}</span>
            </div>
          </div>
        </div>

        {/* Success Alert Banner if redemption occurred */}
        {redemptionSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/80 text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shadow-md animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold">Redemption Recorded</p>
              <p className="mt-0.5">{redemptionSuccessMsg}</p>
            </div>
          </div>
        )}

        {/* Global Navigation Tabs across Referral Modules */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white dark:bg-[#091b32] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-lime-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Rewards Dashboard</span>
            <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded bg-slate-900/10 dark:bg-white/10">
              {availablePoints.toLocaleString()} pts
            </span>
          </button>

          <button
            onClick={() => setActiveTab('refer-form')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'refer-form'
                ? 'bg-lime-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Submit a Referral</span>
            <span className="text-[10px] uppercase font-bold text-lime-700 dark:text-lime-300 bg-lime-500/20 px-1.5 py-0.5 rounded">
              +100 pts bonus
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-lime-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Referrals Pipeline ({referrals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('share-tools')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'share-tools'
                ? 'bg-lime-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Share Links & QR</span>
          </button>
        </div>

        {/* TAB 1: REWARDS DASHBOARD COMPONENT */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Confetti / Sparkle Celebration Burst Effect */}
            {showConfettiBurst && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-lime-500/25 to-emerald-500/20 border-2 border-lime-400 text-slate-900 dark:text-white flex items-center justify-between shadow-lg shadow-lime-500/20 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow">
                    🎉
                  </div>
                  <div>
                    <p className="font-extrabold text-sm sm:text-base">Milestone Achieved: 5 Successful Referrals Reached!</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">+1,000 Milestone Bonus points credited & High-Roller Ambassador badge unlocked!</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-lime-700 dark:text-lime-300 bg-lime-500/20 px-3 py-1 rounded-full">
                  ★ NEW BADGE UNLOCKED
                </span>
              </div>
            )}

            {/* Visual Notification Alert: 5 Successful Referrals Reached */}
            {hasReachedFiveMilestone && showMilestoneAlert && (
              <div className="relative overflow-hidden rounded-3xl border-2 border-lime-500/60 bg-gradient-to-br from-lime-500/15 via-emerald-500/10 to-amber-500/10 dark:from-lime-950/70 dark:via-[#09223c] dark:to-amber-950/40 p-5 sm:p-6 shadow-xl shadow-lime-500/10 animate-fadeIn">
                {/* Decorative Ambient Background Glows */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-lime-400/20 dark:bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-400/15 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Left: Icon Badge & Achievement Copy */}
                  <div className="flex items-start gap-4">
                    {/* Animated Visual Milestone Badge */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-lime-500 via-amber-400 to-emerald-400 p-0.5 shadow-lg shadow-lime-500/30 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-amber-300">
                          <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 animate-pulse" />
                          <span className="text-[10px] font-mono font-extrabold tracking-tighter text-lime-400">5★ VIP</span>
                        </div>
                      </div>
                      {/* Pulsing ring indicator */}
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-lime-500 border-2 border-white dark:border-slate-900"></span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-extrabold uppercase tracking-wide">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Milestone Achieved
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lime-500/20 border border-lime-500/40 text-lime-800 dark:text-lime-300 text-[11px] font-bold">
                          <Check className="w-3 h-3 text-lime-500" />
                          5 Successful Referrals Reached!
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          Badge: <strong className="text-slate-900 dark:text-white">High-Roller Ambassador</strong>
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>🎉 Outstanding Achievement: 5 Successful Referrals Reached!</span>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        Your partner profile has officially onboarded <strong>5 active businesses & certified consulting practices</strong> to MsmeBooks! 
                        You've unlocked the <strong>+1,000 Points Milestone Bonus</strong>, verified <strong>High-Roller Ambassador</strong> status in the Partner Directory, and earned priority access to the <strong>Pan-African Partner Summit</strong>.
                      </p>

                      {/* Unlocked Perks Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 font-mono font-bold text-lime-700 dark:text-lime-400">
                          <Award className="w-3.5 h-3.5 text-lime-500" />
                          +1,000 Milestone Bonus Pts
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                          Verified Ambassador Badge
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          1.5x Multiplier Boost Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setSelectedMilestoneModal(fiveMilestoneData)}
                      className="px-4 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>View Badge & Certificate</span>
                    </button>

                    <button
                      onClick={() => setShowMilestoneAlert(false)}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed Active Milestone Notification Pill if Dismissed */}
            {hasReachedFiveMilestone && !showMilestoneAlert && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-lime-50 dark:from-amber-950/40 dark:to-lime-950/40 border border-amber-300 dark:border-amber-700/60 text-xs shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-lg bg-amber-500 text-slate-950 font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">Active Milestone Badge: </span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">5 Successful Referrals Reached (High-Roller Ambassador)</span>
                    <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-mono ml-2">· +1,000 pts bonus awarded</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMilestoneModal(fiveMilestoneData)}
                    className="font-bold text-xs text-slate-700 dark:text-slate-300 hover:underline"
                  >
                    View Certificate
                  </button>
                  <button
                    onClick={() => setShowMilestoneAlert(true)}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 transition-colors shadow-sm"
                  >
                    Show Alert Banner
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Gamification Milestone Simulator Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Referral Gamification Milestone:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-lime-500/20 text-lime-800 dark:text-lime-300">
                  {convertedReferralsCount} Converted Referrals
                </span>
                {hasReachedFiveMilestone ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    <Check className="w-3.5 h-3.5" />
                    '5 Successful Referrals Reached' Milestone Active!
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    ({5 - convertedReferralsCount} more needed to hit 5 Referrals Milestone)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFiveMilestoneDemo}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    hasReachedFiveMilestone
                      ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      : 'bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold animate-pulse'
                  }`}
                  title="Simulate hitting or resetting the 5 referrals milestone"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>{hasReachedFiveMilestone ? 'Simulate 4 Referrals (Reset)' : '⚡ Simulate 5th Referral (Trigger Milestone Alert!)'}</span>
                </button>
              </div>
            </div>

            {/* Shareable Partner Referral Link Generator & Copy Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-white via-lime-50/20 to-emerald-50/20 dark:from-[#091e38] dark:via-[#0a2340] dark:to-[#092636] border border-lime-500/30 dark:border-lime-500/20 shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Column: Link Meta & Value Proposition */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-lime-500/15 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  <Share2 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Your Unique Shareable Partner Referral Link
                    </h4>
                    <span className="font-mono text-[10px] font-extrabold text-lime-800 dark:text-lime-300 bg-lime-500/20 px-2.5 py-0.5 rounded-full border border-lime-500/30">
                      ID: {currentPartner.partnerId}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                      Code: {currentPartner.referralCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Share this unique invitation URL with prospective businesses, retail shops, or ERP consultants. They receive priority onboarding while you earn points & unlock milestone badges.
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Link Field & Copy Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center gap-2 min-w-0 max-w-full sm:max-w-xs md:max-w-sm">
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate select-all">
                    {referralBaseUrl}
                  </span>
                </div>

                <button
                  onClick={handleCopyLink}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400'
                      : 'bg-lime-500 hover:bg-lime-400 text-slate-950 hover:shadow-lime-500/25'
                  }`}
                  title="Generate & copy your unique partner referral URL"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Referral Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-950" />
                      <span>Copy Referral Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('share-tools')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  title="View QR codes and WhatsApp/Email/LinkedIn sharing channels"
                >
                  <QrCode className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">QR & Channels</span>
                </button>
              </div>
            </div>

            {/* Top Row: Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric 1: Total Points Earned */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Total Points Earned</span>
                  <Award className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {totalPointsEarned.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="text-lime-600 dark:text-lime-400 font-semibold font-mono">+{referrals.reduce((s, r) => s + r.pointsAwarded, 0)}</span>
                  <span>from active ledger</span>
                </div>
              </div>

              {/* Metric 2: Available to Redeem with Cash Equivalent */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Available to Redeem</span>
                  <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-lime-600 dark:text-lime-400 font-mono tabular-nums">
                  {availablePoints.toLocaleString()} <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400">pts</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
                  <span>Cash Equivalent:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                    {formatAmount(Math.round((availablePoints / 10)), { showCode: true })}
                  </span>
                </div>
              </div>

              {/* Metric 3: Successful Referrals Count */}
              {/* Metric 3: Successful Referrals Count with Mini Milestone Progress */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Successful Conversions</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {convertedReferralsCount} <span className="text-sm font-sans font-normal text-slate-400">/ {referrals.length}</span>
                  </div>
                </div>
                
                {/* Mini Visual Progress Bar towards Next Referral Milestone Badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold truncate flex items-center gap-1">
                      <Target className="w-3 h-3 text-amber-500 shrink-0" />
                      {nextMilestone ? nextMilestone.badgeTitle : 'All Badges Mastered'}
                    </span>
                    <span className="font-mono font-bold text-lime-600 dark:text-lime-400 shrink-0">
                      {nextMilestone ? `${convertedReferralsCount}/${nextMilestone.targetCount} (${progressToNextMilestonePercent}%)` : '100%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-lime-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressToNextMilestonePercent}%` }}
                    />
                  </div>
                  {nextMilestone ? (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {referralsNeededForNext === 1 ? '⚡ 1 more conversion to unlock badge!' : `${referralsNeededForNext} more conversions needed`}
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      ★ Deca-Network Titan Master unlocked!
                    </p>
                  )}
                </div>
              </div>

              {/* Metric 4: Referral Status Tier */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Ambassador Tier</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentTier.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mt-2">
                  <span className="font-bold font-mono">{currentPartner.tierPointsMultiplier}x</span>
                  <span>Point Multiplier active</span>
                </div>
              </div>

            </div>

            {/* Tier Progression Progress Bar Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Tier Progress: {currentTier.name}
                    </h3>
                    <span className="text-xs font-mono text-lime-600 dark:text-lime-400 font-bold">
                      {progressPercent}% completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Earn {(nextTier.minPoints - totalPointsEarned).toLocaleString()} more points to reach <strong className="text-slate-800 dark:text-slate-200">{nextTier.name}</strong> and unlock {nextTier.perk}.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>Current: <strong className="text-slate-900 dark:text-white">{totalPointsEarned.toLocaleString()} pts</strong></span>
                  <span>Target: <strong className="text-slate-900 dark:text-white">{nextTier.minPoints.toLocaleString()} pts</strong></span>
                </div>
              </div>

              {/* Visual Multi-Segment Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
                />
              </div>

              {/* Milestone checkpoints */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {TIER_MILESTONES.map((milestone) => {
                  const isAchieved = totalPointsEarned >= milestone.minPoints;
                  const isCurrent = currentTier.name === milestone.name;
                  return (
                    <div 
                      key={milestone.name}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        isCurrent 
                          ? 'border-lime-500 bg-lime-500/10 text-slate-900 dark:text-white font-semibold' 
                          : isAchieved 
                          ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-600 dark:text-slate-300' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{milestone.name}</span>
                        {isAchieved && <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {milestone.minPoints.toLocaleString()} pts ({milestone.multiplier})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DEDICATED REFERRAL MILESTONE BADGE PROGRESS BAR */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#091e38] border-2 border-lime-500/40 dark:border-lime-500/30 shadow-lg shadow-lime-500/5 relative overflow-hidden space-y-6">
              {/* Subtle ambient gradient backdrop */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-lime-400/10 dark:bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Progress Header */}
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Next Milestone Badge Graphic Icon */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-lime-500 via-amber-400 to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-amber-300">
                        {isAllMilestonesAchieved ? (
                          <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                        ) : nextMilestone?.targetCount === 5 ? (
                          <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 animate-pulse" />
                        ) : (
                          <Target className="w-6 h-6 sm:w-7 sm:h-7 text-lime-400 animate-pulse" />
                        )}
                        <span className="text-[10px] font-mono font-extrabold tracking-tight text-lime-400">
                          {isAllMilestonesAchieved ? 'MAX LVL' : nextMilestone?.badgeCode || 'GOAL'}
                        </span>
                      </div>
                    </div>
                    {!isAllMilestonesAchieved && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white dark:border-slate-900"></span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lime-500/20 text-lime-800 dark:text-lime-300 text-[11px] font-mono font-extrabold uppercase tracking-wide">
                        <Sparkles className="w-3 h-3 text-lime-500" />
                        {isAllMilestonesAchieved ? 'All Milestones Mastered' : 'Next Milestone Goal'}
                      </span>
                      {nextMilestone && (
                        <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full">
                          +{nextMilestone.bonusPoints.toLocaleString()} Bonus Points
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      {isAllMilestonesAchieved ? (
                        <span>🏆 Deca-Network Titan: Maximum Referral Badge Unlocked!</span>
                      ) : (
                        <span>Next Badge: {nextMilestone?.badgeTitle} ({nextMilestone?.targetCount} Referrals)</span>
                      )}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                      {isAllMilestonesAchieved ? (
                        <span>You have achieved all 4 verified referral milestones with <strong>{convertedReferralsCount} converted businesses & consultants</strong>! Enjoy top-tier directory rankings, permanent maximum point multipliers, and VIP executive privileges.</span>
                      ) : (
                        <span>
                          You currently have <strong>{convertedReferralsCount} successful conversion{convertedReferralsCount === 1 ? '' : 's'}</strong>. 
                          Only <strong className="text-lime-600 dark:text-lime-400 font-bold">{referralsNeededForNext} more referral{referralsNeededForNext === 1 ? '' : 's'}</strong> needed to reach the <strong>{nextMilestone?.badgeTitle}</strong> badge and unlock: <em>{nextMilestone?.perkSummary}</em>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status Counter */}
                <div className="flex flex-col sm:items-end justify-center shrink-0 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {isAllMilestonesAchieved ? 'Milestone Journey' : 'Progress to Next Badge'}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {convertedReferralsCount}
                    </span>
                    <span className="text-sm font-sans font-medium text-slate-400">
                      / {nextMilestoneTarget} Referrals
                    </span>
                    <span className="font-mono font-bold text-sm px-2 py-0.5 rounded-lg bg-lime-500/20 text-lime-800 dark:text-lime-300">
                      {progressToNextMilestonePercent}%
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {isAllMilestonesAchieved ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">★ 100% Completed</span>
                    ) : (
                      <span>{referralsNeededForNext} needed · {nextMilestone?.badgeCode}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* The Visual Progress Bar (Primary Target Progress Bar) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                    <Target className="w-4 h-4 text-lime-500" />
                    <span>Visual Progress to {nextMilestone ? nextMilestone.badgeTitle : 'Deca-Titan'}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {convertedReferralsCount} of {nextMilestoneTarget} Completed ({progressToNextMilestonePercent}%)
                  </span>
                </div>

                {/* Animated Gradient Progress Track */}
                <div className="w-full h-5 sm:h-6 bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 border border-slate-200 dark:border-slate-800 relative shadow-inner overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-lime-500 via-emerald-400 to-amber-400 rounded-xl transition-all duration-700 relative shadow-sm"
                    style={{ width: `${Math.min(100, Math.max(convertedReferralsCount > 0 ? 6 : 0, progressToNextMilestonePercent))}%` }}
                  >
                    {/* Animated Shimmer Overlay */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    
                    {/* Glowing Leading Head Cursor */}
                    {progressToNextMilestonePercent > 0 && progressToNextMilestonePercent < 100 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-4 bg-white rounded-full shadow-lg shadow-white/60" />
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-Checkpoint Milestone Journey Stepper */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Milestone Checkpoints Roadmap:</span>
                  <span>Click any checkpoint to view unlocked credentials & certificate</span>
                </div>

                {/* Stepper Grid of All 4 Milestones */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sortedReferralMilestones.map((m) => {
                    const isAchieved = convertedReferralsCount >= m.targetCount;
                    const isTarget = nextMilestone && nextMilestone.id === m.id;
                    const pctOfThis = Math.min(100, Math.round((convertedReferralsCount / m.targetCount) * 100));

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMilestoneModal(m)}
                        className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                          isTarget
                            ? 'border-amber-400 dark:border-amber-500/80 bg-gradient-to-br from-amber-500/10 via-lime-500/10 to-transparent dark:from-amber-950/40 dark:via-[#09223c] ring-2 ring-amber-400/40 shadow-md'
                            : isAchieved
                            ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#07162b]/50 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            isAchieved
                              ? 'bg-lime-500/20 text-lime-800 dark:text-lime-300'
                              : isTarget
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 animate-pulse font-bold'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {m.badgeCode}
                          </span>

                          {isAchieved ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              Achieved
                            </span>
                          ) : isTarget ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                              <Target className="w-3.5 h-3.5" />
                              Next Goal
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">
                              {convertedReferralsCount}/{m.targetCount}
                            </span>
                          )}
                        </div>

                        <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {m.badgeTitle}
                        </div>
                        <div className="text-[11px] text-lime-700 dark:text-lime-400 font-mono font-bold mt-0.5">
                          {m.targetCount} Referral{m.targetCount > 1 ? 's' : ''} · +{m.bonusPoints.toLocaleString()} pts
                        </div>

                        {/* Mini progress bar inside checkpoint */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isAchieved 
                                ? 'bg-emerald-500' 
                                : isTarget 
                                ? 'bg-gradient-to-r from-lime-500 to-amber-400' 
                                : 'bg-slate-400 dark:bg-slate-600'
                            }`}
                            style={{ width: `${pctOfThis}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                          <span>{isAchieved ? 'Unlocked' : `${m.targetCount - convertedReferralsCount} more`}</span>
                          <span className="font-mono font-bold">{pctOfThis}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Milestone Level Simulator Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                  <span className="font-semibold">Quick Progress Simulator:</span>
                  <span className="text-slate-400">Test different referral counts:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: '0 Refs', count: 0 },
                    { label: '1 Ref (Lvl 1)', count: 1 },
                    { label: '3 Refs (Lvl 2)', count: 3 },
                    { label: '4 Refs (80% to 5)', count: 4 },
                    { label: '5 Refs (Lvl 3 VIP)', count: 5 },
                    { label: '8 Refs (80% to 10)', count: 8 },
                    { label: '10 Refs (Max)', count: 10 },
                  ].map((preset) => (
                    <button
                      key={preset.count}
                      onClick={() => handleSimulateReferralCount(preset.count)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        convertedReferralsCount === preset.count
                          ? 'bg-lime-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={`Simulate having ${preset.count} converted referrals`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* GAMIFIED REFERRAL MILESTONES & BADGES SHOWCASE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Referral Milestones & Gamification Badges
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Unlock exclusive partner badges, direct points bonuses, and VIP ecosystem perks as your verified referral count expands.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Current Milestone Status:</span>
                  <span className="font-mono font-bold text-xs text-lime-700 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-lg">
                    {convertedReferralsCount} Referrals Converted
                  </span>
                </div>
              </div>

              {/* Milestones Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {REFERRAL_MILESTONES.map((m) => {
                  const isAchieved = convertedReferralsCount >= m.targetCount;
                  const isTarget = nextMilestone && nextMilestone.id === m.id;
                  const isFiveMilestone = m.targetCount === 5;
                  const progressToThis = Math.min(100, Math.round((convertedReferralsCount / m.targetCount) * 100));

                  return (
                    <div
                      key={m.id}
                      className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isTarget
                          ? 'border-lime-500 dark:border-lime-400/90 bg-gradient-to-b from-lime-500/10 via-amber-500/5 to-transparent ring-2 ring-lime-400/50 shadow-md'
                          : isFiveMilestone && isAchieved
                          ? 'border-amber-400 dark:border-amber-500/80 bg-gradient-to-b from-amber-500/10 via-lime-500/5 to-transparent dark:from-amber-950/40 dark:via-[#09223c] ring-2 ring-amber-400/40 shadow-md'
                          : isAchieved
                          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#07162b]/60'
                      }`}
                    >
                      {/* Top Tag & Status */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isAchieved
                              ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30'
                              : isTarget
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {m.badgeCode}
                          </span>

                          {isAchieved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-emerald-500" />
                              Achieved
                            </span>
                          ) : isTarget ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                              <Target className="w-3 h-3 text-amber-500" />
                              Next Goal ({m.targetCount - convertedReferralsCount} away)
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">
                              {convertedReferralsCount}/{m.targetCount} ({progressToThis}%)
                            </span>
                          )}
                        </div>

                        {/* Badge Graphic / Icon */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                            isFiveMilestone && isAchieved
                              ? 'bg-gradient-to-tr from-amber-400 to-lime-400 text-slate-950 shadow-amber-500/20'
                              : isAchieved
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {isFiveMilestone ? <Trophy className="w-5 h-5 text-slate-950" /> : <Medal className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {m.badgeTitle}
                            </div>
                            <div className="text-[11px] text-lime-700 dark:text-lime-400 font-bold font-mono">
                              +{m.bonusPoints.toLocaleString()} pts bonus
                            </div>
                          </div>
                        </div>

                        {/* Headline & Description */}
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                          {m.headline}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      {/* Bottom Perks & Action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          <strong className="text-slate-700 dark:text-slate-300">Perk:</strong> {m.perkSummary}
                        </div>

                        {/* Progress Bar for Locked Milestones */}
                        {!isAchieved && (
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-lime-500 rounded-full" 
                              style={{ width: `${progressToThis}%` }} 
                            />
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedMilestoneModal(m)}
                          className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            isAchieved
                              ? 'bg-lime-500 hover:bg-lime-400 text-slate-950 shadow-sm active:scale-95'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{isAchieved ? 'View Milestone Certificate' : 'Milestone Details'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual 'Reward Tiers' Table */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
              {/* Header with Title, Badge, Description and Filter Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-lime-500/15 text-lime-800 dark:text-lime-300 border border-lime-500/30">
                    <Table className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                    <span>REWARD TIERS & MILESTONE BENEFITS</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                    <span>Referral Milestone Reward Tiers</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-400">
                      4 Verified Tiers
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Specific privileges and benefits unlocked at each milestone tier—including featured partner directory placement, digital badge upgrades, software subscription discounts, and VIP executive incentives.
                  </p>
                </div>

                {/* Filter Buttons & Directory Preview Action */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                    <button
                      onClick={() => setRewardTierFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        rewardTierFilter === 'all'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      All Tiers (4)
                    </button>
                    <button
                      onClick={() => setRewardTierFilter('unlocked')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        rewardTierFilter === 'unlocked'
                          ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Unlocked ({REWARD_TIER_BENEFITS.filter(t => convertedReferralsCount >= t.targetCount).length})</span>
                    </button>
                    <button
                      onClick={() => setRewardTierFilter('locked')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        rewardTierFilter === 'locked'
                          ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Locked ({REWARD_TIER_BENEFITS.filter(t => convertedReferralsCount < t.targetCount).length})</span>
                    </button>
                  </div>

                  {onOpenDirectory && (
                    <button
                      onClick={onOpenDirectory}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-lime-600 dark:hover:text-lime-400 hover:border-lime-500/50 transition-all flex items-center gap-1.5 shadow-xs"
                      title="See how featured partners appear in the public directory"
                    >
                      <Eye className="w-3.5 h-3.5 text-lime-500" />
                      <span>Preview Directory</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Current Partner Status Summary Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-lime-50/30 to-amber-50/30 dark:from-[#07162b] dark:via-[#081e35] dark:to-[#07162b] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-lime-500/20 text-lime-800 dark:text-lime-300 flex items-center justify-center font-bold text-base shrink-0 border border-lime-500/30">
                    <Trophy className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Active Partner Milestone:</span>
                      {currentAchievedMilestone ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30">
                          {currentAchievedMilestone.badgeTitle} ({convertedReferralsCount} Conversions)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Awaiting 1st Referral Conversion
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {nextMilestone ? (
                        <span>
                          Next Goal: <strong className="text-slate-800 dark:text-slate-200">{nextMilestone.badgeTitle}</strong> · Need <strong className="text-lime-600 dark:text-lime-400">{referralsNeededForNext} more conversion{referralsNeededForNext === 1 ? '' : 's'}</strong> to unlock {nextMilestone.perkSummary}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ★ Maximum Referral Tier Achieved! All directory and subscription privileges unlocked.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Referral Link'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('refer-form')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-xs"
                  >
                    <span>Submit Referral</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#07162b] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Milestone Tier</th>
                      <th className="py-3.5 px-4 min-w-[190px]">Featured Listing & Placement</th>
                      <th className="py-3.5 px-4 min-w-[160px]">Badge Upgrade</th>
                      <th className="py-3.5 px-4 min-w-[180px]">Subscription Discount</th>
                      <th className="py-3.5 px-4 min-w-[170px]">Points & Multipliers</th>
                      <th className="py-3.5 px-4 min-w-[200px]">Executive Perks</th>
                      <th className="py-3.5 px-4 text-right">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRewardTiers.map((tier) => {
                      const isAchieved = convertedReferralsCount >= tier.targetCount;
                      const isTarget = nextMilestone && nextMilestone.id === tier.milestoneId;
                      const milestoneData = REFERRAL_MILESTONES.find(m => m.id === tier.milestoneId);

                      return (
                        <tr
                          key={tier.milestoneId}
                          className={`transition-colors ${
                            isTarget
                              ? 'bg-amber-50/40 dark:bg-amber-950/20'
                              : isAchieved
                              ? 'bg-emerald-50/20 dark:bg-emerald-950/10'
                              : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          {/* Col 1: Milestone Tier */}
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  tier.tierColor === 'blue' ? 'bg-blue-500' :
                                  tier.tierColor === 'emerald' ? 'bg-emerald-500' :
                                  tier.tierColor === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
                                }`} />
                                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                                  {tier.tierName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  {tier.badgeCode}
                                </span>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  {tier.targetCount} {tier.targetCount === 1 ? 'Referral' : 'Referrals'}
                                </span>
                              </div>
                              {isTarget && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                  <Target className="w-2.5 h-2.5 text-amber-500" />
                                  <span>Next Goal ({referralsNeededForNext} needed)</span>
                                </span>
                              )}
                              {isAchieved && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                  <span>Active Tier</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Col 2: Featured Listing & Directory Placement */}
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-lime-700 dark:text-lime-300 bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
                                <Eye className="w-3 h-3 text-lime-500" />
                                <span>{tier.featuredListing.placementLevel}</span>
                              </div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">
                                {tier.featuredListing.title}
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                                {tier.featuredListing.description}
                              </p>
                            </div>
                          </td>

                          {/* Col 3: Badge Upgrade */}
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              <div className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${tier.badgeUpgrade.visualStyle}`}>
                                <Award className="w-3.5 h-3.5" />
                                <span>{tier.badgeUpgrade.level}</span>
                              </div>
                              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                {tier.badgeUpgrade.designation}
                              </div>
                            </div>
                          </td>

                          {/* Col 4: Subscription Discounts */}
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                                <Percent className="w-3 h-3 text-emerald-500" />
                                <span>{tier.subscriptionDiscount.rate}</span>
                              </div>
                              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                                {tier.subscriptionDiscount.appliesTo}
                              </div>
                              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {tier.subscriptionDiscount.annualSavingsEst}
                              </div>
                            </div>
                          </td>

                          {/* Col 5: Bonus Points & Multipliers */}
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                                {tier.pointMultiplier.bonus}
                              </div>
                              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20">
                                <Zap className="w-2.5 h-2.5 text-amber-500" />
                                <span>{tier.pointMultiplier.multiplier}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {tier.pointMultiplier.impact}
                              </div>
                            </div>
                          </td>

                          {/* Col 6: Executive Perks */}
                          <td className="py-4 px-4 align-top">
                            <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                              {tier.executivePerks.map((perk, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                                  <Check className="w-3 h-3 text-lime-500 shrink-0 mt-0.5" />
                                  <span>{perk}</span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Col 7: Status & Action Button */}
                          <td className="py-4 px-4 align-top text-right">
                            <div className="flex flex-col items-end gap-2">
                              {isAchieved ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>UNLOCKED</span>
                                  </span>
                                  {milestoneData && (
                                    <button
                                      onClick={() => setSelectedMilestoneModal(milestoneData)}
                                      className="px-2.5 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs active:scale-95 shrink-0"
                                    >
                                      <span>View Certificate</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </>
                              ) : isTarget ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-1 rounded-md border border-amber-500/30">
                                    <Target className="w-3 h-3 text-amber-500" />
                                    <span>TARGET TIER</span>
                                  </span>
                                  <button
                                    onClick={handleCopyLink}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs active:scale-95 shrink-0"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Invite to Unlock</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span>LOCKED</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {tier.targetCount - convertedReferralsCount} more needed
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: High-Density Benefit Cards */}
              <div className="lg:hidden space-y-4">
                {filteredRewardTiers.map((tier) => {
                  const isAchieved = convertedReferralsCount >= tier.targetCount;
                  const isTarget = nextMilestone && nextMilestone.id === tier.milestoneId;
                  const milestoneData = REFERRAL_MILESTONES.find(m => m.id === tier.milestoneId);

                  return (
                    <div
                      key={tier.milestoneId}
                      className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                        isTarget
                          ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/20 ring-1 ring-amber-400/30 shadow-sm'
                          : isAchieved
                          ? 'border-emerald-500/30 bg-emerald-50/15 dark:bg-emerald-950/15'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#07162b]/60'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              tier.tierColor === 'blue' ? 'bg-blue-500' :
                              tier.tierColor === 'emerald' ? 'bg-emerald-500' :
                              tier.tierColor === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
                            }`} />
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {tier.tierName}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {tier.badgeCode}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {tier.targetCount} {tier.targetCount === 1 ? 'Referral' : 'Referrals'}
                            </span>
                          </div>
                        </div>

                        {/* Status Pill */}
                        {isAchieved ? (
                          <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>ACTIVE</span>
                          </span>
                        ) : isTarget ? (
                          <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold border border-amber-500/30 flex items-center gap-1">
                            <Target className="w-3 h-3 text-amber-500" />
                            <span>NEXT GOAL</span>
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>

                      {/* Benefits Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {/* Featured Listing */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Eye className="w-3 h-3 text-lime-500" />
                            <span>Featured Listing</span>
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                            {tier.featuredListing.title}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                            {tier.featuredListing.description}
                          </div>
                        </div>

                        {/* Subscription Discount */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Percent className="w-3 h-3 text-emerald-500" />
                            <span>Subscription Discount</span>
                          </div>
                          <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                            {tier.subscriptionDiscount.rate}
                          </div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                            {tier.subscriptionDiscount.appliesTo}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {tier.subscriptionDiscount.annualSavingsEst}
                          </div>
                        </div>

                        {/* Badge Upgrade & Points */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1 sm:col-span-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-500" />
                              <span>Badge & Points</span>
                            </span>
                            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                              {tier.pointMultiplier.multiplier}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${tier.badgeUpgrade.visualStyle}`}>
                              {tier.badgeUpgrade.level}
                            </span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                              {tier.pointMultiplier.bonus}
                            </span>
                          </div>
                          <ul className="mt-1 space-y-1 text-[10px] text-slate-600 dark:text-slate-300">
                            {tier.executivePerks.map((p, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-lime-500 shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isAchieved
                            ? 'All tier benefits unlocked'
                            : isTarget
                            ? `${referralsNeededForNext} referrals needed`
                            : `${tier.targetCount - convertedReferralsCount} referrals needed`}
                        </span>

                        {isAchieved && milestoneData ? (
                          <button
                            onClick={() => setSelectedMilestoneModal(milestoneData)}
                            className="py-1.5 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                          >
                            <span>View Certificate</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={handleCopyLink}
                            className="py-1.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Referral Link</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Section: Points Earning Breakdown & Rules + Quick Refer Action */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* How You Earn Points (2 Cols) */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Point Earning Rules & Multipliers</span>
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent Point Mechanics
                  </span>
                </div>

                <div className="space-y-3">
                  {POINT_EARNING_RULES.map((rule, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {rule.event}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {rule.notes}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-lime-700 dark:text-lime-400 bg-lime-500/10 px-2 py-1 rounded-lg">
                          {rule.reward}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Points credited automatically upon customer contract signing or certification.</span>
                  </span>
                  <button 
                    onClick={() => setActiveTab('refer-form')}
                    className="font-bold text-lime-700 dark:text-lime-400 hover:underline flex items-center gap-1"
                  >
                    <span>Refer Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Point Allocation Visual Summary (1 Col) */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Referral Performance
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution of successfully earned referral points.
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* SME Business Referrals Share */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>SME Businesses</span>
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">62% (2,100 pts)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>

                    {/* Consultant Onboardings Share */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-lime-500" />
                          <span>Consultants / CPAs</span>
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">38% (1,600 pts)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-lime-500 rounded-full" style={{ width: '38%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Personal Referral Code:</span>
                    <span className="font-mono font-extrabold text-lime-700 dark:text-lime-400 tracking-wider">
                      {currentPartner.referralCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium flex items-center justify-center gap-1.5 transition-colors text-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Partner Invite Link'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* REWARDS REDEMPTION CATALOG */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Rewards Catalog & Point Redemption
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Exchange your points for wire payouts, cloud license vouchers, or exclusive growth assets.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Available:</span>
                  <span className="font-mono font-extrabold text-sm text-lime-700 dark:text-lime-400 bg-lime-500/10 px-2.5 py-1 rounded-lg">
                    {availablePoints.toLocaleString()} Points
                  </span>
                </div>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {REWARDS_CATALOG.map((reward) => {
                  const canAfford = availablePoints >= reward.pointsRequired;
                  return (
                    <div 
                      key={reward.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between hover:border-lime-500/50 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-lime-700 dark:text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                            {reward.pointsRequired.toLocaleString()} pts
                          </span>
                          {reward.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded">
                              {reward.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {reward.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {reward.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <span>Value: </span>
                          <strong className="text-slate-800 dark:text-slate-200 font-mono">
                            {formatAmount(reward.cashEquivalentUSD, { showCode: true })}
                          </strong>
                        </div>

                        <button
                          onClick={() => setSelectedRewardForRedemption(reward)}
                          disabled={!canAfford}
                          className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                            canAfford 
                              ? 'bg-lime-500 hover:bg-lime-400 text-slate-950 shadow-sm active:scale-95' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Redeem Reward' : `Need ${(reward.pointsRequired - availablePoints).toLocaleString()} pts`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historical Redemption Transactions Log */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>Recent Redemption History & Receipts</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {redemptions.length} transactions recorded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-[#07162b] text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Reference Code</th>
                      <th className="py-2.5 px-3">Reward Item</th>
                      <th className="py-2.5 px-3">Points Debited</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {redemptions.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {r.referenceCode}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {r.rewardTitle}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                          -{r.pointsSpent.toLocaleString()} pts
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">
                          {r.redeemedAt}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            r.status === 'Completed' || r.status === 'Delivered'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span>{r.status}</span>
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

        {/* TAB 2: INTERACTIVE REFERRAL SUBMISSION FORM */}
        {activeTab === 'refer-form' && (
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-xl space-y-6 animate-fadeIn">
            
            <div className="text-center space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-700 dark:text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant 100 Points Credited Upon Submission</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Submit a New Business or Consultant Referral
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Our partner operations team will reach out, schedule a discovery demo, and assign credit to your partner profile.
              </p>
            </div>

            {formSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-3 shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Referral Logged Successfully!</p>
                  <p className="mt-0.5">{formSuccessMessage}</p>
                </div>
              </div>
            )}

            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p>{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmitReferral} className="space-y-6">
              
              {/* Type Switcher: Business Client vs Consultant Partner */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Who Are You Referring?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setReferralType('business');
                      setFormIndustryOrSpecialty('Retail & Supermarket');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      referralType === 'business'
                        ? 'border-lime-500 bg-lime-500/10 dark:bg-lime-500/15 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mt-0.5 ${referralType === 'business' ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        A Business / SME Client
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Retailer, supermarket, pharmacy, hospital, wholesaler, or manufacturer.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReferralType('consultant');
                      setFormIndustryOrSpecialty('Accounting & Tax Advisory');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      referralType === 'consultant'
                        ? 'border-lime-500 bg-lime-500/10 dark:bg-lime-500/15 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <UserCheck className={`w-5 h-5 mt-0.5 ${referralType === 'consultant' ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        A Consultant / Advisory Firm
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        CPA firm, ERP implementer, IT system integrator, or bookkeeping practice.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Entity & Contact Person */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {referralType === 'business' ? 'Business / Company Name *' : 'Consultancy / Firm Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formEntityName}
                    onChange={(e) => setFormEntityName(e.target.value)}
                    placeholder={referralType === 'business' ? 'e.g. Apex Superstores Ltd' : 'e.g. Prime Ledger Advisory'}
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Key Decision Maker / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    placeholder="e.g. Samuel Adekunle (Managing Director)"
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="director@company.com"
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* Location & Industry/Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Country & City
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      aria-label="Select Country"
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className="text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      <option value="Nigeria">🇳🇬 Nigeria</option>
                      <option value="Kenya">🇰🇪 Kenya</option>
                      <option value="Ghana">🇬🇭 Ghana</option>
                      <option value="South Africa">🇿🇦 South Africa</option>
                      <option value="Rwanda">🇷🇼 Rwanda</option>
                      <option value="Uganda">🇺🇬 Uganda</option>
                      <option value="Tanzania">🇹🇿 Tanzania</option>
                      <option value="United Kingdom">🇬🇧 UK</option>
                      <option value="United States">🇺🇸 USA</option>
                    </select>

                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Lagos, Nairobi"
                      className="text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {referralType === 'business' ? 'Business Industry' : 'Consulting Focus'}
                  </label>
                  <select
                    aria-label="Select Industry or Focus"
                    value={formIndustryOrSpecialty}
                    onChange={(e) => setFormIndustryOrSpecialty(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    {referralType === 'business' ? (
                      <>
                        <option value="Retail & Supermarket">Retail & Supermarket Chain</option>
                        <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                        <option value="Wholesale & Distribution">Wholesale & FMCG Distribution</option>
                        <option value="Hospitality & Restaurants">Hospitality & Restaurants</option>
                        <option value="Manufacturing & Agro-processing">Manufacturing & Agro-processing</option>
                        <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                      </>
                    ) : (
                      <>
                        <option value="Accounting & Tax Advisory">Accounting & Tax Advisory</option>
                        <option value="ERP & Cloud Systems Implementation">ERP & Cloud Systems Implementation</option>
                        <option value="POS Hardware & Retail Integration">POS Hardware & Retail Integration</option>
                        <option value="Financial Auditing & Bookkeeping">Financial Auditing & Bookkeeping</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Size or Scale */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {referralType === 'business' ? 'Scale / Estimated Branch Count' : 'Firm Size / Years of Experience'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(referralType === 'business' 
                    ? ['1 Branch (Single store)', '2 - 5 Branches', '6 - 15 Branches', '15+ Enterprise Chain']
                    : ['Solo Practitioner', '2 - 5 Consultants', '6 - 20 Consultants', '20+ Enterprise Firm']
                  ).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormSizeOrExp(size)}
                      className={`py-2 px-2.5 rounded-xl border text-xs text-center font-medium transition-colors ${
                        formSizeOrExp === size
                          ? 'border-lime-500 bg-lime-500/10 text-slate-900 dark:text-white font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solution Modules of Interest */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Anticipated Platform Modules Needed
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Multi-Branch POS',
                    'Cloud Accounting',
                    'Inventory & Warehousing',
                    'E-Commerce Sync',
                    'Tax & Audit Compliance',
                    'Partner White-Label Console'
                  ].map((mod) => {
                    const isSelected = formSoftwareNeeds.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => handleToggleSoftwareNeed(mod)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          isSelected
                            ? 'border-lime-500 bg-lime-500/20 text-lime-900 dark:text-lime-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes / Context */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Relationship Notes & Context
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Provide background context (e.g. 'Met the CFO at Lagos Retail Expo; currently dissatisfied with their legacy offline software')."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
                />
              </div>

              {/* Fast Track introduction checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formAlreadyIntroduced}
                    onChange={(e) => setFormAlreadyIntroduced(e.target.checked)}
                    className="w-4 h-4 rounded text-lime-600 focus:ring-lime-500 border-slate-300"
                  />
                  <span>I have already spoken with them and introduced MsmeBooks</span>
                </label>
                <span className="text-[11px] text-lime-700 dark:text-lime-400 font-semibold font-mono">
                  Priority Dispatch
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Referral & Claim +100 Points</span>
              </button>

            </form>
          </div>
        )}

        {/* TAB 3: REFERRALS PIPELINE & LEDGER */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPipelineFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pipelineFilter === 'all'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All ({referrals.length})
                </button>
                <button
                  onClick={() => setPipelineFilter('business')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pipelineFilter === 'business'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Businesses ({referrals.filter(r => r.type === 'business').length})
                </button>
                <button
                  onClick={() => setPipelineFilter('consultant')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pipelineFilter === 'consultant'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Consultants ({referrals.filter(r => r.type === 'consultant').length})
                </button>
                <button
                  onClick={() => setPipelineFilter('converted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pipelineFilter === 'converted'
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Converted ({convertedReferralsCount})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pipelineSearch}
                  onChange={(e) => setPipelineSearch(e.target.value)}
                  placeholder="Search by name, city, industry..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

            </div>

            {/* Referrals Table */}
            <div className="rounded-2xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-[#07162b] text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Entity / Organization</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Contact Person</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Points Credited</th>
                      <th className="py-3 px-4">Date Logged</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredReferrals.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No referrals matching the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredReferrals.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              {item.type === 'business' ? (
                                <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-lime-500 shrink-0" />
                              )}
                              <span>{item.entityName}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal pl-6">
                              {item.city}, {item.country} · {item.industryOrSpecialty}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="capitalize text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                              {item.type}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {item.contactPerson}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {item.email}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.status === 'Converted & Active' || item.status === 'Consultant Certified'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : item.status === 'Pilot Onboarding'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{item.status}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-extrabold text-lime-700 dark:text-lime-400 text-sm">
                              +{item.pointsAwarded.toLocaleString()} pts
                            </div>
                            {item.provisionalPoints > 0 && (
                              <div className="text-[10px] text-slate-400">
                                +{item.provisionalPoints.toLocaleString()} pts pending
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {item.submittedAt}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status !== 'Converted & Active' && item.status !== 'Consultant Certified' && (
                                <button
                                  onClick={() => handleConvertReferral(item.id)}
                                  className="px-2.5 py-1 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs transition-all shadow-sm active:scale-95"
                                  title="Mark referral converted & award points towards milestones"
                                >
                                  Convert
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedReferralDetail(item)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SHAREABLE REFERRAL LINKS & QR TOOLS */}
        {activeTab === 'share-tools' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-md space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Share Your Partner Invitation Link
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Every business or consultant who signs up via your link is permanently tagged with your Partner ID ({currentPartner.partnerId}).
                </p>
              </div>

              {/* Interactive Copyable Link Bar */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="px-3 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 truncate select-all">
                  {referralBaseUrl}
                </div>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-sm"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Instant Social / Channel Sharing Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hello! I recommend MsmeBooks for multi-branch accounting and POS. Sign up through my certified partner link for accelerated onboarding: ${referralBaseUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                  <span>Share on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Email Template */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Recommendation: MsmeBooks Platform Invitation`)}&body=${encodeURIComponent(`Hi,\n\nI am inviting you to explore MsmeBooks—the all-in-one Cloud Accounting, POS, and Multi-Branch platform designed specifically for African enterprises.\n\nUse our certified partner invitation link to receive priority discovery and demo access:\n${referralBaseUrl}\n\nBest regards,\n${currentPartner.partnerName}`)}`}
                  className="p-3 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-800 dark:text-blue-300 flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draft Email Invite</span>
                </a>

                {/* LinkedIn Share */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralBaseUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on LinkedIn</span>
                </a>

              </div>

            </div>

            {/* QR Code Presentation Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#091e38] border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col sm:flex-row items-center gap-6">
              
              {/* Scalable SVG QR Code Representation */}
              <div className="w-36 h-36 bg-white p-3 rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-4 border-lime-400 bg-white" />
                    <div className="w-6 h-6 border-4 border-lime-400 bg-white" />
                  </div>
                  <div className="flex justify-center items-center py-1">
                    <span className="text-[9px] font-extrabold text-lime-400 font-mono tracking-tighter">
                      MSME
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-6 h-6 border-4 border-lime-400 bg-white" />
                    <div className="w-4 h-4 bg-lime-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-lime-700 dark:text-lime-400 font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>Partner Event & Business Card QR</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Instant Smartphone Scan Code
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                  Display this QR code during client pitch presentations, SME conferences, or print it on your advisory firm brochures. Prospects scan and immediately register under your partner attribution.
                </p>
                <div className="pt-1">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Encoded Target: {referralBaseUrl}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: REWARD REDEMPTION CONFIRMATION */}
      {selectedRewardForRedemption && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#091e38] rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Confirm Redemption
                </h3>
              </div>
              <button
                onClick={() => setSelectedRewardForRedemption(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedRewardForRedemption.title}
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedRewardForRedemption.description}
              </p>
              
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-500">Points Cost:</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  -{selectedRewardForRedemption.pointsRequired.toLocaleString()} pts
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-extrabold text-lime-600 dark:text-lime-400">
                  {(availablePoints - selectedRewardForRedemption.pointsRequired).toLocaleString()} pts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedRewardForRedemption(null)}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmRedemption(selectedRewardForRedemption)}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow transition-colors"
              >
                Confirm & Redeem
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: REFERRAL DETAIL DRILL-DOWN */}
      {selectedReferralDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#091e38] rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Referral ID: {selectedReferralDetail.id}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedReferralDetail.entityName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReferralDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Contact Person</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReferralDetail.contactPerson}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Current Pipeline Stage</span>
                  <div className="font-bold text-lime-600 dark:text-lime-400 mt-0.5">
                    {selectedReferralDetail.status}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Email</span>
                  <div className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReferralDetail.email}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Phone</span>
                  <div className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReferralDetail.phone}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Location</span>
                  <div className="text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReferralDetail.city}, {selectedReferralDetail.country}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Industry / Focus</span>
                  <div className="text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedReferralDetail.industryOrSpecialty}
                  </div>
                </div>
              </div>

              {selectedReferralDetail.softwareNeeds && selectedReferralDetail.softwareNeeds.length > 0 && (
                <div>
                  <span className="text-slate-400 font-medium">Software / Service Focus:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedReferralDetail.softwareNeeds.map((need, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedReferralDetail.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Notes & Context:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 italic leading-relaxed">
                    "{selectedReferralDetail.notes}"
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-between font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Points Credited:</span>
                  <div className="font-extrabold text-lime-700 dark:text-lime-400 text-sm">
                    +{selectedReferralDetail.pointsAwarded.toLocaleString()} Points
                  </div>
                </div>
                {selectedReferralDetail.provisionalPoints > 0 && (
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Pending Upon Conversion:</span>
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                      +{selectedReferralDetail.provisionalPoints.toLocaleString()} Points
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="flex items-center gap-2 pt-1">
              {selectedReferralDetail.status !== 'Converted & Active' && selectedReferralDetail.status !== 'Consultant Certified' && (
                <button
                  onClick={() => {
                    handleConvertReferral(selectedReferralDetail.id);
                    setSelectedReferralDetail(prev => prev ? {
                      ...prev,
                      status: prev.type === 'consultant' ? 'Consultant Certified' : 'Converted & Active',
                      pointsAwarded: prev.pointsAwarded + (prev.provisionalPoints > 0 ? prev.provisionalPoints : 1250),
                      provisionalPoints: 0
                    } : null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Converted & Award Points</span>
                </button>
              )}

              <button
                onClick={() => setSelectedReferralDetail(null)}
                className={`py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-colors ${
                  selectedReferralDetail.status !== 'Converted & Active' && selectedReferralDetail.status !== 'Consultant Certified'
                    ? 'w-32'
                    : 'w-full'
                }`}
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: MILESTONE DETAILS & CERTIFICATE BADGE MODAL */}
      {selectedMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#091e38] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6 animate-scaleUp relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/20 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-lime-400/20 dark:bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-lime-400 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400">
                    <Trophy className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-lime-700 dark:text-lime-400">
                    {selectedMilestoneModal.badgeCode} · Partner Milestone
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedMilestoneModal.badgeTitle}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedMilestoneModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Certificate Plaque / Trophy Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#07162b] dark:to-[#040e1b] border border-slate-200 dark:border-slate-700/80 text-center space-y-3 relative shadow-inner">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {convertedReferralsCount >= selectedMilestoneModal.targetCount ? 'VERIFIED MILESTONE UNLOCKED' : 'MILESTONE IN PROGRESS'}
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedMilestoneModal.headline}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  {selectedMilestoneModal.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Awarded To:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentPartner.partnerName}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Credential Verification ID:</span>
                <span className="font-extrabold text-lime-700 dark:text-lime-400">
                  MSME-AMB-{selectedMilestoneModal.badgeCode}-{currentPartner.partnerId}
                </span>
              </div>
            </div>

            {/* Perks & Unlocked Benefits */}
            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Milestone Perks & Privileges
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      +{selectedMilestoneModal.bonusPoints.toLocaleString()} Bonus Points
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Credited automatically to available redemption balance.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Verified Directory Badge
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Featured in the MsmeBooks certified ecosystem listings.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Accelerated Multiplier
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Enjoy boosted points accrual on every subsequent referral.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <Star className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      VIP Summit Eligibility
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Priority access to executive partner networking roundtables.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleCopyMilestoneBadge(selectedMilestoneModal.badgeCode)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                {copiedMilestoneBadge ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMilestoneBadge ? 'Badge Credential Copied!' : 'Copy Verification Credential'}</span>
              </button>

              <button
                onClick={() => setSelectedMilestoneModal(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
