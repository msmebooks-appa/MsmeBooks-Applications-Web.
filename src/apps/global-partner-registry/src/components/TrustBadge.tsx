import React from 'react';
import {
  Crown,
  Award,
  Medal,
  Shield,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { Partner, PartnerLevel } from '../types';

export interface DynamicTrustScoreBreakdown {
  score: number;
  grade: string;
  yearsPoints: number;
  yearsMax: number;
  certificationPoints: number;
  certificationMax: number;
  satisfactionPoints: number;
  satisfactionMax: number;
  yearsCount: number;
  certificationsCount: number;
  ratingValue: number;
  reviewCount: number;
}

/**
 * Calculates a dynamic Trust Score (0-100) for a partner from three verified pillars:
 * 1. Years in Business (up to 30 pts)
 * 2. Verified Certifications & Authorities (up to 35 pts)
 * 3. Client Satisfaction Count & Rating (up to 35 pts)
 */
export function calculateDynamicTrustScore(partner: Partner): DynamicTrustScoreBreakdown {
  const yearsCount = Math.max(0, partner.yearsExperience || 0);
  const yearsPoints = Math.min(30, Math.round((yearsCount / 12) * 30));

  const authCount = partner.certificationAuthorities?.length || 0;
  const certListCount = partner.certifications?.length || 0;
  const certificationsCount = Math.max(authCount, certListCount);
  const verifiedBase = partner.verified ? 14 : 4;
  const certBonus = Math.min(21, certificationsCount * 6 + (partner.verification?.trainingCompleted ? 3 : 0));
  const certificationPoints = Math.min(35, verifiedBase + certBonus);

  const ratingValue = partner.rating || 4.0;
  const reviewCount = Math.max(0, partner.reviewCount || 0);
  const ratingComponent = Math.min(20, Math.round(Math.max(0, (ratingValue - 3.5) / 1.5) * 20));
  const reviewVolumeComponent = Math.min(15, Math.round((reviewCount / 60) * 15));
  const satisfactionPoints = Math.min(35, ratingComponent + reviewVolumeComponent);

  const score = Math.min(100, Math.max(10, yearsPoints + certificationPoints + satisfactionPoints));

  let grade = 'Verified';
  if (score >= 92) grade = 'Grade A+ (Elite)';
  else if (score >= 84) grade = 'Grade A';
  else if (score >= 74) grade = 'Grade B+';
  else grade = 'Grade B';

  return {
    score,
    grade,
    yearsPoints,
    yearsMax: 30,
    certificationPoints,
    certificationMax: 35,
    satisfactionPoints,
    satisfactionMax: 35,
    yearsCount,
    certificationsCount,
    ratingValue,
    reviewCount,
  };
}

export interface TierTrustBadgeConfig {
  tier: PartnerLevel;
  seniorityTitle: string;
  seniorityRank: string;
  badgeLabel: string;
  starsCount: number;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textLight: string;
  textDark: string;
  accentText: string;
  glowClass: string;
  ringClass: string;
  sealBg: string;
  description: string;
}

export const TIER_TRUST_BADGE_CONFIGS: Record<PartnerLevel, TierTrustBadgeConfig> = {
  Platinum: {
    tier: 'Platinum',
    seniorityTitle: 'Elite Senior Partner',
    seniorityRank: 'Tier IV (Principal Seniority)',
    badgeLabel: 'Platinum Certified',
    starsCount: 4,
    bgLight: 'bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100',
    bgDark: 'dark:bg-gradient-to-r dark:from-[#2e0854] dark:via-[#1e1b4b] dark:to-[#170a30]',
    borderLight: 'border-purple-300',
    borderDark: 'dark:border-purple-400/60',
    textLight: 'text-purple-950',
    textDark: 'dark:text-purple-100',
    accentText: 'text-purple-700 dark:text-lime-300',
    glowClass: 'shadow-md shadow-purple-500/15',
    ringClass: 'ring-1 ring-purple-400/30',
    sealBg: 'bg-gradient-to-br from-purple-600 to-indigo-800 text-lime-300 border-purple-300',
    description: 'Executive-level certification tier with highest seniority authority, multi-country deployment capability, and priority SLA delivery.',
  },
  Gold: {
    tier: 'Gold',
    seniorityTitle: 'Senior Certified Partner',
    seniorityRank: 'Tier III (Advanced Seniority)',
    badgeLabel: 'Gold Certified',
    starsCount: 3,
    bgLight: 'bg-gradient-to-r from-amber-100/80 via-yellow-50 to-amber-100/80',
    bgDark: 'dark:bg-gradient-to-r dark:from-[#3d2005] dark:via-[#2d1702] dark:to-[#1a0f02]',
    borderLight: 'border-amber-400',
    borderDark: 'dark:border-amber-500/60',
    textLight: 'text-amber-950',
    textDark: 'dark:text-amber-100',
    accentText: 'text-amber-700 dark:text-amber-300',
    glowClass: 'shadow-md shadow-amber-500/15',
    ringClass: 'ring-1 ring-amber-400/30',
    sealBg: 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-amber-300',
    description: 'Senior verified certification tier with master-level enterprise advisory, comprehensive regional coverage, and verified audit track records.',
  },
  Silver: {
    tier: 'Silver',
    seniorityTitle: 'Mid-Senior Certified Partner',
    seniorityRank: 'Tier II (Established Seniority)',
    badgeLabel: 'Silver Certified',
    starsCount: 2,
    bgLight: 'bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100',
    bgDark: 'dark:bg-gradient-to-r dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#1e293b]',
    borderLight: 'border-slate-300',
    borderDark: 'dark:border-slate-500/60',
    textLight: 'text-slate-900',
    textDark: 'dark:text-slate-100',
    accentText: 'text-slate-700 dark:text-slate-300',
    glowClass: 'shadow-sm shadow-slate-400/10',
    ringClass: 'ring-1 ring-slate-400/25',
    sealBg: 'bg-gradient-to-br from-slate-400 to-slate-600 text-white border-slate-300',
    description: 'Established certification tier demonstrating rigorous platform competencies and proven mid-market business implementation success.',
  },
  Bronze: {
    tier: 'Bronze',
    seniorityTitle: 'Accredited Associate Partner',
    seniorityRank: 'Tier I (Associate Seniority)',
    badgeLabel: 'Bronze Certified',
    starsCount: 1,
    bgLight: 'bg-gradient-to-r from-amber-50 via-orange-50/50 to-stone-50',
    bgDark: 'dark:bg-gradient-to-r dark:from-[#2a1b12] dark:via-[#1c130d] dark:to-[#140c08]',
    borderLight: 'border-amber-300/80',
    borderDark: 'dark:border-amber-700/60',
    textLight: 'text-amber-950',
    textDark: 'dark:text-amber-200',
    accentText: 'text-amber-800 dark:text-amber-400',
    glowClass: 'shadow-sm shadow-amber-900/10',
    ringClass: 'ring-1 ring-amber-700/20',
    sealBg: 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-200 border-amber-600',
    description: 'Accredited foundation certification tier with validated training credentials for core accounting and ERP deployment.',
  },
};

interface TrustBadgeProps {
  level: PartnerLevel;
  partner?: Partner;
  partnerId?: string;
  commissionRate?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'pill' | 'seal' | 'compact' | 'score';
  showSeniorityRank?: boolean;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  level,
  partner,
  partnerId,
  commissionRate,
  variant = 'card',
  className = '',
}) => {
  const config = TIER_TRUST_BADGE_CONFIGS[level] || TIER_TRUST_BADGE_CONFIGS.Bronze;

  const renderTierIcon = (iconSizeClass: string = 'w-3.5 h-3.5') => {
    switch (level) {
      case 'Platinum':
        return <Crown className={`${iconSizeClass} text-purple-600 dark:text-purple-300 shrink-0`} />;
      case 'Gold':
        return <Award className={`${iconSizeClass} text-amber-600 dark:text-amber-300 shrink-0`} />;
      case 'Silver':
        return <Medal className={`${iconSizeClass} text-slate-600 dark:text-slate-300 shrink-0`} />;
      case 'Bronze':
        return <Shield className={`${iconSizeClass} text-amber-800 dark:text-amber-400 shrink-0`} />;
      default:
        return <Shield className={`${iconSizeClass} shrink-0`} />;
    }
  };

  const renderSeniorityStars = () => {
    return (
      <div className="flex items-center gap-0.5" aria-hidden="true" title={`Seniority Level: ${config.starsCount} of 4`}>
        {[...Array(4)].map((_, i) => {
          const isFilled = i < config.starsCount;
          let starColor = 'text-slate-300 dark:text-slate-600/40 opacity-40';
          if (isFilled) {
            if (level === 'Platinum') starColor = 'text-purple-600 dark:text-lime-300 drop-shadow-xs';
            else if (level === 'Gold') starColor = 'text-amber-500 dark:text-amber-300 drop-shadow-xs';
            else if (level === 'Silver') starColor = 'text-slate-500 dark:text-slate-200 drop-shadow-xs';
            else starColor = 'text-amber-700 dark:text-amber-400 drop-shadow-xs';
          }
          return (
            <span key={i} className={`text-[10px] leading-none ${starColor}`}>
              ★
            </span>
          );
        })}
      </div>
    );
  };

  // Dynamic Trust Score Variant (calculated from years in business, certifications, and client satisfaction count)
  if (variant === 'score' && partner) {
    const trust = calculateDynamicTrustScore(partner);
    const resolvedId = partnerId || partner.id;

    return (
      <div
        className={`relative group/trust inline-flex items-center ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        aria-label={`Trust Badge for ${partner.name}: ${trust.score}/100 (${trust.grade})`}
      >
        <span
          id={`badge-verified-expert-${resolvedId}`}
          data-testid={`trust-score-badge-${resolvedId}`}
          data-trust-score={trust.score}
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md border shadow-2xs transition-all cursor-help focus:outline-hidden focus:ring-2 focus:ring-lime-500 select-none tabular-nums ${
            partner.verified
              ? 'text-lime-700 dark:text-lime-300 bg-lime-500/15 hover:bg-lime-500/25 border-lime-500/40'
              : 'text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40'
          }`}
        >
          <ShieldCheck
            className={`w-3.5 h-3.5 shrink-0 ${
              partner.verified ? 'text-lime-600 dark:text-lime-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          />
          <span>Trust Score</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-lime-500/20 text-lime-800 dark:text-lime-200 border border-lime-500/30">
            {trust.score}/100
          </span>
        </span>

        {/* Interactive Breakdown Tooltip */}
        <div
          role="tooltip"
          id={`tooltip-verified-expert-${resolvedId}`}
          data-testid={`tooltip-trust-score-${resolvedId}`}
          className="absolute bottom-full left-0 mb-2.5 hidden group-hover/trust:flex group-focus/trust:flex group-focus-within/trust:flex flex-col z-50 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900/98 dark:bg-[#07192f]/98 text-slate-100 border border-lime-500/50 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none select-none text-left tabular-nums"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/70">
            <div className="flex items-center gap-1.5 font-bold text-xs text-lime-400">
              <BadgeCheck className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Dynamic Partner Trust Badge</span>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-lime-500/20 text-lime-300 border border-lime-500/40">
              {trust.score}/100 · {trust.grade}
            </span>
          </div>

          {/* Score Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-lime-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${trust.score}%` }}
            />
          </div>

          {/* 3 Weighted Trust Pillars */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between bg-slate-800/70 rounded-lg px-2.5 py-1.5 border border-slate-700/60">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Years in Business ({trust.yearsCount} yrs)</span>
              </span>
              <span className="font-bold text-sky-300">
                {trust.yearsPoints}/{trust.yearsMax} pts
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-800/70 rounded-lg px-2.5 py-1.5 border border-slate-700/60">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Verified Certifications ({trust.certificationsCount})</span>
              </span>
              <span className="font-bold text-lime-300">
                {trust.certificationPoints}/{trust.certificationMax} pts
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-800/70 rounded-lg px-2.5 py-1.5 border border-slate-700/60">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span>Client Satisfaction ({trust.reviewCount} reviews · {trust.ratingValue.toFixed(1)}★)</span>
              </span>
              <span className="font-bold text-amber-300">
                {trust.satisfactionPoints}/{trust.satisfactionMax} pts
              </span>
            </div>
          </div>

          {/* Audit Authority & Date */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/90 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="truncate max-w-[175px]">
              {partner.verification?.partnerId
                ? `Accreditation #${partner.verification.partnerId}`
                : 'MsmeBooks Partner Board'}
            </span>
            <span className="text-lime-400 font-semibold whitespace-nowrap">
              {partner.verified ? `Verified ${partner.verification?.verifiedDate || '2026'}` : 'Verification Pending'}
            </span>
          </div>

          {/* Tooltip Pointer Arrow */}
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-900/98 dark:bg-[#07192f]/98 border-b border-r border-lime-500/50 transform rotate-45" />
        </div>
      </div>
    );
  }

  // Avatar / Seal Variant
  if (variant === 'seal') {
    return (
      <div
        id={partnerId ? `partner-trust-seal-${partnerId}` : undefined}
        data-testid="trust-badge-seal"
        data-tier={level}
        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0b1f3b] shadow-sm ${config.sealBg} ${className}`}
        title={`${config.badgeLabel} Trust Badge • ${config.seniorityRank}`}
        aria-label={`${level} Certification Trust Badge - ${config.seniorityRank}`}
      >
        {renderTierIcon('w-2.5 h-2.5')}
      </div>
    );
  }

  // Compact / Pill Variant
  if (variant === 'pill' || variant === 'compact') {
    return (
      <div
        id={partnerId ? `partner-trust-badge-${partnerId}` : undefined}
        data-testid="trust-badge"
        data-testid-tier={`trust-badge-${level.toLowerCase()}`}
        data-tier={level}
        data-seniority={config.seniorityRank}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${config.bgLight} ${config.bgDark} ${config.borderLight} ${config.borderDark} ${config.textLight} ${config.textDark} ${config.glowClass} ${className}`}
        title={`${config.badgeLabel} Trust Badge • ${config.seniorityTitle} (${config.seniorityRank})`}
      >
        {renderTierIcon('w-3.5 h-3.5')}
        <span className="font-extrabold whitespace-nowrap">{level} Partner</span>
        {renderSeniorityStars()}
        {commissionRate !== undefined && (
          <span className="text-[10px] opacity-75 font-mono">({commissionRate}%)</span>
        )}
      </div>
    );
  }

  // Full Rich Card Header Variant
  return (
    <div
      id={partnerId ? `partner-trust-badge-${partnerId}` : undefined}
      data-testid="trust-badge"
      data-testid-tier={`trust-badge-${level.toLowerCase()}`}
      data-tier={level}
      data-seniority={config.seniorityRank}
      role="status"
      aria-label={`${config.badgeLabel} Trust Badge - ${config.seniorityRank}`}
      className={`inline-flex flex-col items-end gap-0.5 px-3 py-1.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default ${config.bgLight} ${config.bgDark} ${config.borderLight} ${config.borderDark} ${config.glowClass} ${config.ringClass} ${className}`}
      title={`${config.badgeLabel} Trust Badge • ${config.seniorityTitle}\n${config.seniorityRank}\n${config.description}`}
    >
      {/* Tier Label, Icon & Seniority Stars */}
      <div className="flex items-center gap-1.5">
        {renderTierIcon('w-3.5 h-3.5')}
        <span className={`text-xs font-black tracking-tight ${config.textLight} ${config.textDark}`}>
          {level} Trust Badge
        </span>
        {renderSeniorityStars()}
      </div>

      {/* Seniority Rank & Commission Rate */}
      <div className="flex items-center gap-1.5 text-[10.5px]">
        <span className={`font-bold ${config.accentText}`}>
          {config.seniorityTitle}
        </span>
        {commissionRate !== undefined && (
          <>
            <span className="text-slate-400 dark:text-slate-600 text-[9px]">•</span>
            <span className="text-[9.5px] font-mono px-1 py-0.2 rounded bg-slate-200/60 dark:bg-black/40 text-slate-700 dark:text-slate-300 font-bold">
              {commissionRate}%
            </span>
          </>
        )}
      </div>
    </div>
  );
};
