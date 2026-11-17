import React from 'react';
import {
  ShieldCheck,
  Star,
  Zap,
  Crown,
  Award,
  Medal,
  BadgeCheck,
} from 'lucide-react';
import { ProfessionalFirm } from '../data/firmsData';

export type FirmBadgeKind = 'verified' | 'top_rated' | 'fast_response';

export interface EarnedFirmBadge {
  id: FirmBadgeKind;
  label: string;
  tierLabel: string;
  tierLevel: 1 | 2 | 3;
  tooltip: string;
  badgeClass: string;
  iconSlotClass: string;
  iconColorClass: string;
}

export interface PartnerTierMeta {
  label: ProfessionalFirm['partnerTier'];
  shortLabel: string;
  tierRank: number;
  description: string;
  containerClass: string;
  iconColorClass: string;
}

export function getPartnerTierMeta(tier: ProfessionalFirm['partnerTier']): PartnerTierMeta {
  switch (tier) {
    case 'Official Core Team':
      return {
        label: tier,
        shortLabel: 'Core Team',
        tierRank: 5,
        description: 'Official MsmeBooks in-house engineering & chartered accounting unit',
        containerClass:
          'bg-[#102B4E] dark:bg-[#1464C8] text-[#B7E532] border-[#102B4E] dark:border-blue-500/50',
        iconColorClass: 'text-[#B7E532]',
      };
    case 'Platinum Partner':
      return {
        label: tier,
        shortLabel: 'Platinum',
        tierRank: 4,
        description: 'Highest partner tier: 98%+ client SLA, multi-country audit & verified team',
        containerClass:
          'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700/70',
        iconColorClass: 'text-indigo-600 dark:text-indigo-300',
      };
    case 'Gold Partner':
      return {
        label: tier,
        shortLabel: 'Gold',
        tierRank: 3,
        description: 'Established certified practice with proven MSME track record',
        containerClass:
          'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700/70',
        iconColorClass: 'text-amber-600 dark:text-amber-400',
      };
    case 'Silver Partner':
      return {
        label: tier,
        shortLabel: 'Silver',
        tierRank: 2,
        description: 'Accredited specialist firm meeting MsmeBooks compliance standards',
        containerClass:
          'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700',
        iconColorClass: 'text-slate-500 dark:text-slate-300',
      };
    default:
      return {
        label: tier,
        shortLabel: 'Bronze',
        tierRank: 1,
        description: 'Verified entry-tier partner practice',
        containerClass:
          'bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800/70',
        iconColorClass: 'text-orange-600 dark:text-orange-400',
      };
  }
}

export function computeFirmBadges(
  firm: ProfessionalFirm,
  liveRating?: number,
  liveReviewCount?: number
): {
  partnerTierMeta: PartnerTierMeta;
  earnedBadges: EarnedFirmBadge[];
} {
  const effectiveRating = liveRating ?? firm.rating;
  const effectiveReviews = liveReviewCount ?? firm.reviewCount;
  const partnerTierMeta = getPartnerTierMeta(firm.partnerTier);
  const earnedBadges: EarnedFirmBadge[] = [];

  // 1. Verified Tiered Badge
  if (firm.isVerified) {
    const isEnterpriseVerified =
      firm.partnerTier === 'Official Core Team' ||
      firm.partnerTier === 'Platinum Partner' ||
      firm.accreditations.length >= 3;
    const tierLevel: 1 | 2 | 3 =
      firm.partnerTier === 'Official Core Team' ? 3 : isEnterpriseVerified ? 2 : 1;

    earnedBadges.push({
      id: 'verified',
      label: 'Verified',
      tierLabel:
        tierLevel === 3
          ? 'Core Verified'
          : tierLevel === 2
          ? 'Premier Verified'
          : 'Verified',
      tierLevel,
      tooltip: `${firm.verificationBadge} (${firm.accreditations.length} validated accreditations)`,
      badgeClass:
        'bg-blue-50 dark:bg-blue-950/70 text-[#1464C8] dark:text-blue-200 border-blue-200/90 dark:border-blue-800/70',
      iconSlotClass:
        'bg-blue-100 dark:bg-blue-900/80 border-blue-300 dark:border-blue-700 text-[#1464C8] dark:text-blue-300',
      iconColorClass: 'text-[#1464C8] dark:text-blue-300',
    });
  }

  // 2. Top Rated Tiered Badge
  if (firm.isTopRated || effectiveRating >= 4.88) {
    const isElite = effectiveRating >= 4.95 && effectiveReviews >= 150;
    const tierLevel: 1 | 2 | 3 = isElite ? 3 : 2;

    earnedBadges.push({
      id: 'top_rated',
      label: 'Top Rated',
      tierLabel: isElite ? 'Elite Top Rated' : 'Top Rated',
      tierLevel,
      tooltip: `${
        isElite ? 'Elite Top Rated' : 'Top Rated'
      }: ${effectiveRating.toFixed(2)} / 5.0 across ${effectiveReviews} verified client reviews`,
      badgeClass: isElite
        ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
      iconSlotClass:
        'bg-amber-100 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-300',
      iconColorClass: 'text-amber-500 dark:text-amber-400',
    });
  }

  // 3. Fast Response Tiered Badge
  if (firm.isFastResponder || firm.avgResponseTimeMinutes <= 30) {
    const isInstant = firm.avgResponseTimeMinutes <= 15;
    const tierLevel: 1 | 2 | 3 = isInstant ? 3 : 2;

    earnedBadges.push({
      id: 'fast_response',
      label: 'Fast Response',
      tierLabel: isInstant ? 'Instant Response' : 'Fast Response',
      tierLevel,
      tooltip: `${
        isInstant ? 'Instant Response Tier' : 'Fast Response Tier'
      }: Average reply within ${firm.avgResponseTimeText}`,
      badgeClass: isInstant
        ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-[#B7E532] border-emerald-300 dark:border-emerald-700'
        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      iconSlotClass:
        'bg-emerald-100 dark:bg-emerald-900/80 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-[#B7E532]',
      iconColorClass: 'text-emerald-600 dark:text-[#B7E532]',
    });
  }

  return { partnerTierMeta, earnedBadges };
}

function renderPartnerTierIcon(tier: ProfessionalFirm['partnerTier'], className: string) {
  switch (tier) {
    case 'Official Core Team':
      return <BadgeCheck className={className} />;
    case 'Platinum Partner':
      return <Crown className={className} />;
    case 'Gold Partner':
      return <Medal className={className} />;
    default:
      return <Award className={className} />;
  }
}

function renderBadgeIcon(id: FirmBadgeKind, className: string) {
  switch (id) {
    case 'verified':
      return <ShieldCheck className={className} />;
    case 'top_rated':
      return <Star className={`${className} fill-current`} />;
    case 'fast_response':
      return <Zap className={`${className} fill-current`} />;
  }
}

interface FirmBadgeIconsClusterProps {
  firm: ProfessionalFirm;
  liveRating?: number;
  liveReviewCount?: number;
}

/**
 * Compact small icon tokens displayed directly on the firm profile card header
 * so users immediately spot Verified, Top Rated, Fast Response, and Partner Tier status.
 */
export const FirmBadgeIconsCluster: React.FC<FirmBadgeIconsClusterProps> = ({
  firm,
  liveRating,
  liveReviewCount,
}) => {
  const { partnerTierMeta, earnedBadges } = computeFirmBadges(firm, liveRating, liveReviewCount);

  return (
    <div
      className="flex items-center gap-1 shrink-0"
      aria-label={`${firm.name} credential badges`}
    >
      {/* Partner Tier Small Icon */}
      <span
        title={`${partnerTierMeta.label}: ${partnerTierMeta.description}`}
        className={`w-6 h-6 rounded-lg border flex items-center justify-center shadow-2xs ${partnerTierMeta.containerClass}`}
      >
        {renderPartnerTierIcon(firm.partnerTier, `w-3.5 h-3.5 ${partnerTierMeta.iconColorClass}`)}
      </span>

      {/* Earned Performance Badge Small Icons */}
      {earnedBadges.map((badge) => (
        <span
          key={badge.id}
          title={badge.tooltip}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center shadow-2xs ${badge.iconSlotClass}`}
        >
          {renderBadgeIcon(badge.id, 'w-3.5 h-3.5')}
        </span>
      ))}
    </div>
  );
};

interface FirmTierBadgesBarProps {
  firm: ProfessionalFirm;
  liveRating?: number;
  liveReviewCount?: number;
  onOpenReviews?: () => void;
}

/**
 * Full tiered badge row inside each profile card displaying the Partner Tier badge,
 * Verified / Top Rated / Fast Response tier labels with small icons, and live rating button.
 */
export const FirmTierBadgesBar: React.FC<FirmTierBadgesBarProps> = ({
  firm,
  liveRating,
  liveReviewCount,
  onOpenReviews,
}) => {
  const effectiveRating = liveRating ?? firm.rating;
  const effectiveReviews = liveReviewCount ?? firm.reviewCount;
  const { partnerTierMeta, earnedBadges } = computeFirmBadges(firm, liveRating, liveReviewCount);

  return (
    <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
      {/* Partner Tier Badge */}
      <span
        title={partnerTierMeta.description}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-black text-[10px] shadow-2xs ${partnerTierMeta.containerClass}`}
      >
        {renderPartnerTierIcon(firm.partnerTier, `w-3 h-3 ${partnerTierMeta.iconColorClass}`)}
        <span>{partnerTierMeta.label}</span>
      </span>

      {/* Earned Merit Badges */}
      {earnedBadges.map((badge) => (
        <span
          key={badge.id}
          title={badge.tooltip}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-black text-[10px] shadow-2xs ${badge.badgeClass}`}
        >
          {renderBadgeIcon(badge.id, `w-2.5 h-2.5 ${badge.iconColorClass}`)}
          <span>
            {badge.id === 'fast_response'
              ? `${badge.label} (${firm.avgResponseTimeText})`
              : badge.tierLabel}
          </span>
        </span>
      ))}

      {onOpenReviews && (
        <button
          type="button"
          onClick={onOpenReviews}
          title="View client reviews & rate this firm"
          className="ml-auto flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-xs hover:text-[#1464C8] dark:hover:text-[#B7E532] transition-colors cursor-pointer group/rate"
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-current group-hover/rate:scale-110 transition-transform" />
          <span>{effectiveRating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({effectiveReviews})</span>
        </button>
      )}
    </div>
  );
};

interface FirmTierShowcaseProps {
  firm: ProfessionalFirm;
  liveRating?: number;
  liveReviewCount?: number;
}

/**
 * Detailed Tier & Credentials Breakdown shown inside the Firm Profile Modal.
 */
export const FirmTierShowcase: React.FC<FirmTierShowcaseProps> = ({
  firm,
  liveRating,
  liveReviewCount,
}) => {
  const { partnerTierMeta, earnedBadges } = computeFirmBadges(firm, liveRating, liveReviewCount);

  return (
    <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Tiered Recognition & Performance Badges
        </span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-black ${partnerTierMeta.containerClass}`}>
          {renderPartnerTierIcon(firm.partnerTier, `w-3.5 h-3.5 ${partnerTierMeta.iconColorClass}`)}
          <span>{partnerTierMeta.label}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {earnedBadges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 rounded-xl border flex items-start gap-2.5 ${badge.badgeClass}`}
          >
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${badge.iconSlotClass}`}>
              {renderBadgeIcon(badge.id, 'w-4 h-4')}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black leading-tight">{badge.tierLabel}</div>
              <div className="text-[11px] opacity-85 mt-0.5 leading-snug">
                {badge.tooltip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
