import React from 'react';
import {
  Clock,
  Wifi,
  Star,
  Mail,
  Calendar,
  ChevronRight,
  Sparkles,
  Zap,
  Scale,
  Check,
  Coins,
  Building2,
  Layers,
  Store,
  Award,
  QrCode,
  Camera,
  MessageCircleQuestion,
  MessageSquare,
  Video,
  Heart,
  Navigation,
  TrendingUp,
} from 'lucide-react';
import { Partner, PartnerLevel, SuccessStoryScale } from '../types';
import { TrustBadge, calculateDynamicTrustScore } from './TrustBadge';
import { useCurrency } from '../context/CurrencyContext';
import { VerifiedSkillTag } from './VerifiedSkillTag';
import { LiveAvailabilityIndicator } from './LiveAvailabilityIndicator';
import { useLiveScheduling } from '../context/LiveSchedulingContext';
import { AwardBadge } from './AwardBadge';
import { buildWhatsAppBookingUrl } from '../utils/whatsappBooking';
import { recordPartnerInteraction } from '../utils/browsingHistory';
import { calculateSuccessImpactScore } from '../utils/partnerFiltering';
import { formatDistanceKm } from '../utils/geoCoordinates';

/**
 * Helper to determine if a partner qualifies for the 'Fast Response' badge.
 * Returns true for partners with a response time under 2 hours (e.g., '< 30 mins', '< 45 mins', '< 1 hour', '< 2 hours').
 * Returns false for longer intervals (e.g., '< 3 hours', '< 4 hours', 'Within 24 hours').
 */
export const isFastResponse = (responseTime: string): boolean => {
  if (!responseTime) return false;
  const rt = responseTime.toLowerCase().trim();

  // Sub-hour response times in minutes (< 60 mins)
  if (rt.includes('min')) {
    return true;
  }

  // Check hour values
  const match = rt.match(/(\d+(\.\d+)?)/);
  if (match) {
    const hours = parseFloat(match[1]);
    return hours <= 2;
  }

  return false;
};

/**
 * Helper to determine if a partner qualifies for the 'Top-Rated' badge.
 * Calculated from review data: rating >= 4.90 and reviewCount >= 20.
 */
export const isTopRatedPartner = (partner: Partner): boolean => {
  return partner.rating >= 4.90 && partner.reviewCount >= 20;
};

/**
 * Helper to determine if a partner qualifies for the 'Fastest Responder' badge.
 * Calculated from response time data: sub-hour or <= 1 hour response time (e.g., '< 30 mins', '< 45 mins', '< 1 hour').
 */
export const isFastestResponder = (responseTime: string): boolean => {
  if (!responseTime) return false;
  const rt = responseTime.toLowerCase().trim();

  // Sub-hour in minutes (e.g. '< 30 mins', '< 45 mins')
  if (rt.includes('min')) {
    return true;
  }

  // Under or equal to 1 hour
  if (rt.includes('< 1 hour') || rt.includes('1 hour') || rt.includes('under 1 hour')) {
    return true;
  }

  const match = rt.match(/(\d+(\.\d+)?)/);
  if (match) {
    const hours = parseFloat(match[1]);
    return hours <= 1;
  }

  return false;
};

/**
 * Helper to determine if a partner qualifies for the 'Most Certified' badge.
 * Conferred to partners with 3+ certification authorities, 3+ certifications, or Platinum status with multi-body accreditations.
 */
export const isMostCertifiedPartner = (partner: Partner): boolean => {
  const authCount = partner.certificationAuthorities?.length || 0;
  const certCount = partner.certifications?.length || 0;
  return authCount >= 3 || (authCount >= 2 && partner.level === 'Platinum') || certCount >= 3;
};

/**
 * Helper to determine if a partner qualifies for the 'Veteran' / 'Enterprise Elite' badge.
 * Conferred to partners with 10+ years experience or 180+ business implementations.
 */
export const isVeteranPartner = (partner: Partner): boolean => {
  return partner.yearsExperience >= 10 || partner.businessesSupported >= 180;
};

/**
 * Helper to compute an objective Trust Score (0-100) and grade for a partner
 * based on verified implementations, client rating, experience, and audit status.
 */
export interface TrustScoreInfo {
  score: number;
  grade: string;
  implementationsCount: number;
  ratingValue: number;
  yearsCount: number;
}

export const calculateTrustScore = (partner: Partner): TrustScoreInfo => {
  const dynamic = calculateDynamicTrustScore(partner);
  return {
    score: dynamic.score,
    grade: dynamic.grade,
    implementationsCount: partner.businessesSupported || 0,
    ratingValue: dynamic.ratingValue,
    yearsCount: dynamic.yearsCount,
  };
};

interface PartnerCardProps {
  partner: Partner;
  onSelectPartner: (partner: Partner) => void;
  onContactPartner: (partner: Partner) => void;
  onRequestConsultation: (partner: Partner) => void;
  isComparing?: boolean;
  onToggleCompare?: (partner: Partner) => void;
  canCompare?: boolean;
  activeSort?: string;
  activeSuccessStoryScale?: string;
  onOpenQrBadge?: (partner: Partner) => void;
  onOpenQRScanner?: () => void;
  onSelectSkill?: (skill: string) => void;
  activeSkill?: string;
  onAskQuestion?: (partner: Partner) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (partner: Partner) => void;
  smartSortMode?: 'distance' | 'impact';
  distanceKm?: number;
  successImpactScore?: number;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  onSelectPartner,
  onContactPartner,
  onRequestConsultation,
  isComparing = false,
  onToggleCompare,
  canCompare = true,
  activeSort,
  activeSuccessStoryScale,
  onOpenQrBadge,
  onOpenQRScanner,
  onSelectSkill,
  activeSkill,
  onAskQuestion,
  isFavorite = false,
  onToggleFavorite,
  smartSortMode,
  distanceKm,
  successImpactScore,
}) => {
  const isFast = isFastResponse(partner.responseTime);
  const isFastest = isFastestResponder(partner.responseTime);
  const isTopRated = isTopRatedPartner(partner);
  const isMostCertified = isMostCertifiedPartner(partner);
  const isVeteran = isVeteranPartner(partner);
  const computedImpactScore = successImpactScore ?? calculateSuccessImpactScore(partner);
  const {
    currency,
    formatBudget,
    getRawUSD,
    currentCurrency,
    formatHourlyRate,
    formatServicePricing,
    geographicProfile,
    detectedLocation,
    isLocationAdjusted,
  } = useCurrency();

  const distinctScales = React.useMemo(() => {
    if (!partner.clientSuccessStories) return [];
    const set = new Set<SuccessStoryScale>();
    partner.clientSuccessStories.forEach((s) => {
      if (s.implementationScale) set.add(s.implementationScale);
    });
    return Array.from(set);
  }, [partner.clientSuccessStories]);

  const matchingStory = React.useMemo(() => {
    if (!partner.clientSuccessStories || partner.clientSuccessStories.length === 0) return null;
    if (activeSuccessStoryScale) {
      return partner.clientSuccessStories.find((s) => s.implementationScale === activeSuccessStoryScale) || null;
    }
    return null;
  }, [partner.clientSuccessStories, activeSuccessStoryScale]);

  // Subtle hover popover preview state
  const [isHovered, setIsHovered] = React.useState(false);
  const [popoverPlacement, setPopoverPlacement] = React.useState<'top' | 'bottom'>('top');
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      // If card is close to top of viewport, place popover below the card to avoid clipping
      setPopoverPlacement(rect.top < 190 ? 'bottom' : 'top');
    }
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const getLevelBadge = (level: PartnerLevel) => {
    return (
      <TrustBadge
        level={level}
        partnerId={partner.id}
        commissionRate={partner.commissionRate}
        variant="card"
      />
    );
  };

  const { getPartnerAvailability } = useLiveScheduling();
  const live = getPartnerAvailability(partner.id);
  const isAccepting = live.isAcceptingRequests;
  const isBooked = !isAccepting;

  const renderAvailabilityIndicator = () => {
    return (
      <LiveAvailabilityIndicator
        partner={partner}
        onRequestConsultation={onRequestConsultation}
        idPrefix="card"
      />
    );
  };

  const whatsappConsultUrl = React.useMemo(() => buildWhatsAppBookingUrl(partner), [partner]);

  return (
    <div
      ref={cardRef}
      id={`partner-card-${partner.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative bg-white dark:bg-[#0b1f3b] border rounded-2xl p-5 sm:p-6 pt-7 sm:pt-7 shadow-md dark:shadow-xl transition-all flex flex-col justify-between group ${
        isComparing
          ? 'border-lime-500 dark:border-lime-400 ring-2 ring-lime-500/50 shadow-lg shadow-lime-500/10'
          : 'border-slate-200 dark:border-slate-700/80 hover:border-lime-500/60 dark:hover:border-lime-500/60 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-lime-500/5'
      }`}
    >
      {/* Subtle Hover Popover Preview (Top 3 Skills & Years of Experience) */}
      {isHovered && (
        <div
          role="tooltip"
          id={`partner-hover-popover-${partner.id}`}
          data-testid={`card-hover-popover-${partner.id}`}
          className={`absolute ${
            popoverPlacement === 'top'
              ? 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2'
              : 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2'
          } z-40 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900/95 dark:bg-[#07192f]/98 text-slate-100 border border-lime-500/40 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none select-none`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-700/60">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-lime-400">
              <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Partner Quick Snapshot</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{partner.rating.toFixed(1)}</span>
              <span className="text-slate-400">({partner.reviewCount})</span>
            </div>
          </div>

          {/* Years of Experience */}
          <div className="flex items-center justify-between bg-slate-800/70 dark:bg-slate-800/90 rounded-lg px-2.5 py-1.5 mb-2.5 border border-slate-700/70">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>Experience:</span>
            </div>
            <span className="text-xs font-bold text-lime-300 bg-lime-500/20 px-2 py-0.5 rounded border border-lime-500/30">
              {partner.yearsExperience} {partner.yearsExperience === 1 ? 'Year' : 'Years'} of Practice
            </span>
          </div>

          {/* Top 3 Skills */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-slate-300">
              <span>Top 3 Skills</span>
              <span className="text-[10px] text-slate-400 font-normal">Core Competencies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {partner.specialties.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0"></span>
                  <span className="truncate max-w-[170px]">{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900/95 dark:bg-[#07192f]/98 border-lime-500/40 transform rotate-45 ${
              popoverPlacement === 'top'
                ? '-bottom-1.5 border-b border-r'
                : '-top-1.5 border-t border-l'
            }`}
          />
        </div>
      )}
      {/* Floating Quick Connect Actions ('Direct WhatsApp Consult' & 'Ask a Question') */}
      <div className="absolute -top-3.5 right-3 sm:right-5 z-10 flex items-center gap-1.5">
        <a
          href={whatsappConsultUrl}
          target="_blank"
          rel="noopener noreferrer"
          id={`btn-direct-whatsapp-consult-${partner.id}`}
          data-testid={`btn-whatsapp-consult-${partner.id}`}
          onClick={(e) => {
            e.stopPropagation();
            recordPartnerInteraction(partner, 'contact');
          }}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#25D366] to-emerald-600 hover:from-[#22c55e] hover:to-emerald-500 text-white text-[11px] font-extrabold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all border-2 border-white dark:border-[#0b1f3b] whitespace-nowrap cursor-pointer group/wa"
          title={`Direct WhatsApp Consult with ${partner.name} (${partner.phone})`}
          aria-label={`Direct WhatsApp Consult with ${partner.name}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 shrink-0 group-hover/wa:scale-110 transition-transform"
            aria-hidden="true"
          >
            <path d="M12.031 2C6.508 2 2.031 6.477 2.031 12c0 1.894.525 3.666 1.438 5.18L2 22l4.947-1.434A9.946 9.946 0 0012.031 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm5.822 14.132c-.246.693-1.425 1.326-1.958 1.404-.49.072-1.127.102-1.821-.118-.425-.135-.969-.317-1.662-.616-2.909-1.256-4.808-4.185-4.953-4.379-.145-.194-1.182-1.572-1.182-2.999 0-1.427.748-2.129 1.013-2.419.265-.29.579-.363.772-.363.193 0 .386.002.555.01.178.009.417-.068.652.497.246.591.836 2.04.909 2.185.072.145.121.314.024.508-.097.194-.145.314-.29.484-.145.169-.304.378-.435.508-.145.145-.296.303-.127.593.169.29.752 1.241 1.615 2.01 1.11.989 2.046 1.296 2.336 1.441.29.145.459.121.628-.072.169-.194.724-.846.917-1.136.193-.29.386-.242.652-.145.265.097 1.69.797 1.98.942.29.145.483.218.555.339.073.121.073.699-.173 1.392z" />
          </svg>
          <span>Direct WhatsApp Consult</span>
        </a>

        {onAskQuestion && (
          <button
            type="button"
            id={`btn-ask-question-floating-${partner.id}`}
            data-testid={`btn-ask-question-${partner.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAskQuestion(partner);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 text-[11px] font-black shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all border-2 border-white dark:border-[#0b1f3b] whitespace-nowrap cursor-pointer group/ask"
            title={`Quick Inquiry: Ask ${partner.name} a question`}
            aria-label={`Ask a Question to ${partner.name}`}
          >
            <MessageCircleQuestion className="w-3.5 h-3.5 fill-slate-950 group-hover/ask:scale-110 transition-transform" />
            <span>Ask a Question</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-950"></span>
            </span>
          </button>
        )}
      </div>

      {/* Card Top: Partner Identity & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 group-hover:border-lime-500 dark:group-hover:border-lime-400 transition-all shrink-0"
                loading="lazy"
              />
              {/* Real-time Availability Status Dot (Green / Amber) */}
              <span
                data-testid={`availability-dot-${partner.id}`}
                className="absolute -top-1 -left-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700"
                title={`Live availability: ${isAccepting ? 'Accepting New Clients' : 'Currently Booked'}`}
              >
                {isAccepting ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                )}
              </span>
              <TrustBadge
                level={partner.level}
                partnerId={partner.id}
                variant="seal"
                className="absolute -bottom-1 -right-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                  {partner.name}
                </h3>
              </div>

              {/* Verification, Trust Badges, Real-time Availability, Top-Rated & Fastest Responder */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <TrustBadge
                  level={partner.level}
                  partnerId={partner.id}
                  variant="pill"
                />
                {/* Dynamic Trust Score Badge (Years in business, certifications & client satisfaction) */}
                <TrustBadge
                  level={partner.level}
                  partner={partner}
                  partnerId={partner.id}
                  variant="score"
                />
                {renderAvailabilityIndicator()}

                {/* Visual Award Badges with Subtle Hover-State Animations (Gentle Pulse & Lift) */}
                {isTopRated && (
                  <AwardBadge
                    type="top-rated"
                    label="Top Rated 2024"
                    metricSnippet={`${partner.rating.toFixed(2)} ★`}
                    reason={`Top Rated 2024: Awarded for outstanding ${partner.rating.toFixed(2)} client satisfaction score across ${partner.reviewCount} verified client reviews.`}
                    id={`partner-top-rated-badge-${partner.id}`}
                    testId="top-rated-badge"
                  />
                )}

                {isFastest ? (
                  <AwardBadge
                    type="fastest-responder"
                    label="Fastest Responder"
                    metricSnippet={partner.responseTime}
                    reason={`Fastest Responder: Guaranteed priority response SLA (${partner.responseTime}) for consultations and enterprise support.`}
                    id={`partner-fastest-responder-badge-${partner.id}`}
                    testId="fastest-responder-badge"
                  />
                ) : isFast ? (
                  <AwardBadge
                    type="fastest-responder"
                    label={`Responds ${partner.responseTime}`}
                    reason={`Fast Response: Consistently quick client reply SLA within ${partner.responseTime}.`}
                    id={`partner-fast-response-badge-${partner.id}`}
                    testId="fast-response-badge"
                  />
                ) : null}

                {isMostCertified && (
                  <AwardBadge
                    type="most-certified"
                    label="Most Certified"
                    metricSnippet={`${partner.certificationAuthorities?.length || 3} Bodies`}
                    reason={`Most Certified: Holds ${partner.certificationAuthorities?.length || 3}+ audited institutional accreditations (${partner.certificationAuthorities?.map(a => a.acronym).slice(0, 2).join(' & ') || 'MPAB & Statutory Bodies'}).`}
                    id={`partner-most-certified-badge-${partner.id}`}
                    testId="most-certified-badge"
                  />
                )}

                {!isFastest && !isTopRated && isVeteran && (
                  <AwardBadge
                    type="veteran"
                    label={`${partner.yearsExperience}+ Yrs Veteran`}
                    metricSnippet={`${partner.businessesSupported}+ SMEs`}
                    reason={`Veteran Advisor: Over ${partner.yearsExperience} years in professional practice with ${partner.businessesSupported}+ verified implementations.`}
                    id={`partner-veteran-badge-${partner.id}`}
                    testId="veteran-badge"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Partner Level Pill, Save to Favorites Heart & Compare Action */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              {onToggleFavorite && (
                <button
                  type="button"
                  id={`btn-favorite-${partner.id}`}
                  data-testid={`btn-favorite-${partner.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(partner);
                  }}
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? `Remove ${partner.name} from favorites` : `Save ${partner.name} to favorites`}
                  title={isFavorite ? 'Saved to Favorites (click to remove)' : 'Save to Favorites'}
                  className={`p-1.5 rounded-lg border transition-all shadow-2xs cursor-pointer group/fav ${
                    isFavorite
                      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/50 ring-1 ring-rose-400/30'
                      : 'bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/40'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform duration-200 group-hover/fav:scale-110 ${
                      isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : ''
                    }`}
                  />
                </button>
              )}
              {onOpenQrBadge && (
                <button
                  type="button"
                  id={`btn-qr-badge-top-${partner.id}`}
                  data-testid={`btn-qr-badge-${partner.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQrBadge(partner);
                  }}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                  title="View Partner Scannable QR Badge / Digital Business Card"
                  aria-label="View Partner QR Badge"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              )}
              {getLevelBadge(partner.level)}
            </div>

            {onToggleCompare && (
              <button
                type="button"
                id={`btn-compare-${partner.id}`}
                data-testid={`btn-compare-${partner.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(partner);
                }}
                disabled={!isComparing && !canCompare}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  isComparing
                    ? 'bg-lime-500 text-slate-950 border-lime-600 shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-lime-400 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
                title={
                  isComparing
                    ? 'Remove from comparison'
                    : canCompare
                    ? 'Select up to 3 partners for side-by-side comparison'
                    : 'Maximum 3 partners selected'
                }
              >
                {isComparing ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                )}
                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Location & Response Time */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
            <span className="text-sm">{partner.countryFlag}</span>
            <span>📍 {partner.city}, {partner.country}</span>
          </span>

          <span className="text-slate-300 dark:text-slate-600">•</span>

          <span className={`flex items-center gap-1 ${isFast ? 'text-amber-700 dark:text-amber-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
            <Clock className={`w-3 h-3 ${isFast ? 'text-amber-600 dark:text-amber-400' : 'text-lime-600 dark:text-lime-400'}`} />
            <span>Responds {partner.responseTime}</span>
          </span>

          {partner.remoteSupport && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-medium border border-blue-200 dark:border-blue-500/20">
              <Wifi className="w-2.5 h-2.5" />
              Remote
            </span>
          )}

          {activeSort === 'experience' && !smartSortMode && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] font-black border border-sky-500/30">
              <Award className="w-3 h-3 text-sky-500" />
              {partner.yearsExperience} Years Exp.
            </span>
          )}
        </div>

        {/* Smart Sort Metrics Strip (Distance + Verified Success Impact Score) */}
        {smartSortMode && (
          <div
            id={`partner-smart-sort-metrics-${partner.id}`}
            data-testid={`partner-smart-sort-metrics-${partner.id}`}
            className="flex items-center justify-between gap-2 px-3 py-1.5 mb-3 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-700/80 text-[11px] tabular-nums"
          >
            <div
              className={`flex items-center gap-1.5 min-w-0 ${
                smartSortMode === 'distance'
                  ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <Navigation
                className={`w-3.5 h-3.5 shrink-0 ${
                  smartSortMode === 'distance' ? 'text-emerald-500' : 'text-slate-400'
                }`}
              />
              <span className="truncate">
                {typeof distanceKm === 'number' ? formatDistanceKm(distanceKm) : `${partner.city}, ${partner.country}`}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-700 shrink-0">·</span>

            <div
              className={`flex items-center gap-1.5 shrink-0 ${
                smartSortMode === 'impact'
                  ? 'text-lime-700 dark:text-lime-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <TrendingUp
                className={`w-3.5 h-3.5 shrink-0 ${
                  smartSortMode === 'impact' ? 'text-lime-500' : 'text-slate-400'
                }`}
              />
              <span>
                Success Impact: <strong className="font-extrabold">{computedImpactScore}/100</strong>
              </span>
            </div>
          </div>
        )}

        {/* Tagline / Pitch */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
          {partner.tagline}
        </p>

        {/* Specialties / Clickable Skill Tags with Badge Verification */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-lime-500" />
              <span>Skills & Specialties:</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Hover badge • Click to filter
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Skills for ${partner.name}`}>
            {partner.specialties.slice(0, 5).map((spec, sIdx) => {
              const isSelected = Boolean(activeSkill && activeSkill.toLowerCase() === spec.toLowerCase());
              return (
                <VerifiedSkillTag
                  key={sIdx}
                  partner={partner}
                  skill={spec}
                  isSelected={isSelected}
                  onSelect={onSelectSkill}
                  id={`skill-tag-${partner.id}-${sIdx}`}
                  testId={`skill-tag-${partner.id}-${sIdx}`}
                  variant="specialty"
                />
              );
            })}
          </div>
        </div>

        {/* Services with Location-Adjusted Rates & Clickable Service Skill Tags */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Services Offered & Localized Pricing:
            </span>
            <span className="text-[10px] text-lime-600 dark:text-lime-400 font-mono">
              {currentCurrency.code}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {partner.services.slice(0, 4).map((srv, srvIdx) => {
              const priceInfo = formatServicePricing(srv, partner);
              const isSelected = Boolean(activeSkill && activeSkill.toLowerCase() === srv.toLowerCase());
              const priceBadge = (
                <span
                  className={`font-mono text-[9.5px] font-extrabold px-1 py-0.2 rounded border shrink-0 ${
                    isSelected
                      ? 'bg-slate-950/20 text-slate-950 border-slate-950/20'
                      : 'text-lime-700 dark:text-lime-300 bg-lime-500/15 dark:bg-lime-500/20 border-lime-500/20'
                  }`}
                >
                  {priceInfo.formattedPrice}
                </span>
              );
              return (
                <VerifiedSkillTag
                  key={srvIdx}
                  partner={partner}
                  skill={srv}
                  isSelected={isSelected}
                  onSelect={onSelectSkill}
                  id={`service-tag-${partner.id}-${srvIdx}`}
                  testId={`service-tag-${partner.id}-${srvIdx}`}
                  variant="service"
                  priceBadge={priceBadge}
                />
              );
            })}
          </div>
        </div>

        {/* Performance Metas: Businesses, Rating, Experience */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-center mb-4">
          <div className={`transition-all rounded-lg py-0.5 -my-0.5 ${
            activeSort === 'rating'
              ? 'bg-amber-500/15 border border-amber-500/40 ring-1 ring-amber-500/30'
              : isTopRated
              ? 'bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25'
              : ''
          }`}>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-400" />
              <span>{partner.rating}</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <span>({partner.reviewCount})</span>
              {activeSort === 'rating' ? (
                <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400">Ranked</span>
              ) : isTopRated ? (
                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300">★ Top</span>
              ) : null}
            </div>
          </div>

          <div className={`border-x border-slate-200 dark:border-slate-800 transition-all rounded-lg py-0.5 -my-0.5 ${
            activeSort === 'businesses'
              ? 'bg-lime-500/15 border border-lime-500/40 ring-1 ring-lime-500/30'
              : ''
          }`}>
            <div className="text-xs font-extrabold text-lime-600 dark:text-lime-400">
              {partner.businessesSupported}+
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <span>Businesses</span>
              {activeSort === 'businesses' && (
                <span className="text-[9px] font-extrabold text-lime-600 dark:text-lime-400">Ranked</span>
              )}
            </div>
          </div>

          <div className={`transition-all rounded-lg py-0.5 -my-0.5 ${
            activeSort === 'experience'
              ? 'bg-sky-500/15 border border-sky-500/40 ring-1 ring-sky-500/30'
              : ''
          }`}>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white">
              {partner.yearsExperience} yrs
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <span>Experience</span>
              {activeSort === 'experience' && (
                <span className="text-[9px] font-extrabold text-sky-600 dark:text-sky-400">Ranked</span>
              )}
            </div>
          </div>
        </div>

        {/* Starting Budget & Pricing Tier Strip with Multi-Currency */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs mt-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px] flex items-center gap-1 shrink-0">
              <Coins className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Est. Budget:</span>
            </span>
            <span 
              id={`partner-budget-${partner.id}`}
              data-testid={`partner-budget-${partner.id}`}
              className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 truncate"
            >
              <span className="text-lime-600 dark:text-lime-400">
                {formatBudget(partner.startingBudget, partner.minBudgetUSD, { prefix: '', partnerCountry: partner.country })}
              </span>
              {currency !== 'USD' && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
                  (≈ ${getRawUSD(partner.startingBudget, partner.minBudgetUSD).toLocaleString()} USD)
                </span>
              )}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            {partner.budgetTier || 'Mid-range'}
          </span>
        </div>

        {/* Location-Aware Consultation & Advisory Rate Strip */}
        <div 
          id={`partner-consultation-strip-${partner.id}`}
          data-testid="partner-consultation-strip"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-lime-500/5 dark:bg-lime-500/10 border border-lime-500/20 text-xs mt-2"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium truncate">
              Consultation:
            </span>
            <span
              id={`partner-consultation-rate-${partner.id}`}
              data-testid={`partner-consultation-rate-${partner.id}`}
              className="font-extrabold text-slate-900 dark:text-white truncate"
            >
              {formatHourlyRate(partner)}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
              title={`Pricing automatically adjusted for ${detectedLocation.country} in ${currentCurrency.code}`}
            >
              📍 {detectedLocation.countryCode || currentCurrency.code} Localized
            </span>
            <span 
              className="text-[10px] font-bold text-lime-700 dark:text-lime-400 flex items-center gap-1"
              title={`Live scheduling API status: ${live.status} (${live.statusHeadline})`}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                {isAccepting && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isAccepting ? 'bg-lime-500' : 'bg-slate-400'}`}></span>
              </span>
              <span>{isAccepting ? `${live.availableSlotsToday} Slots Today` : 'Waitlist Active'}</span>
            </span>
          </div>
        </div>

        {/* Verified Implementation Track Record */}
        {distinctScales.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>Verified Implementations:</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {partner.clientSuccessStories.length} Case {partner.clientSuccessStories.length === 1 ? 'Study' : 'Studies'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {distinctScales.map((scale, scIdx) => {
                const isScaleActive = activeSuccessStoryScale === scale;
                const Icon = scale === 'Large-Scale Enterprise' ? Building2 : scale === 'Mid-Market' ? Layers : Store;
                let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                if (isScaleActive) {
                  if (scale === 'Large-Scale Enterprise') {
                    badgeStyle = 'bg-purple-600 text-white border-purple-500 shadow-xs ring-1 ring-purple-400/50 font-bold';
                  } else if (scale === 'Mid-Market') {
                    badgeStyle = 'bg-blue-600 text-white border-blue-500 shadow-xs ring-1 ring-blue-400/50 font-bold';
                  } else {
                    badgeStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-xs ring-1 ring-emerald-400/50 font-bold';
                  }
                }

                return (
                  <span
                    key={scIdx}
                    className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg border transition-all ${badgeStyle}`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{scale}</span>
                  </span>
                );
              })}
            </div>

            {/* Highlighted Case Study Result Excerpt when filtered */}
            {matchingStory && (
              <div className="mt-2 p-2 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs animate-in fade-in">
                <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-900 dark:text-white">
                  <span className="truncate pr-1 flex items-center gap-1">
                    <span className="text-lime-600 dark:text-lime-400 font-extrabold">✓</span>
                    <span className="truncate">{matchingStory.businessName}</span>
                  </span>
                  {matchingStory.metric && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-lime-500/20 text-lime-700 dark:text-lime-300 font-extrabold shrink-0 border border-lime-500/30">
                      {matchingStory.metric}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                  {matchingStory.result}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className={`grid gap-2 ${onAskQuestion ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {onAskQuestion && (
            <button
              id={`btn-ask-question-${partner.id}`}
              onClick={() => onAskQuestion(partner)}
              className="py-2 px-2 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 text-lime-800 dark:text-lime-300 font-bold text-xs border border-lime-500/35 hover:border-lime-500/60 transition-all flex items-center justify-center gap-1 shadow-2xs"
              title={`Ask ${partner.name} a quick question`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Ask Question</span>
            </button>
          )}

          <button
            id={`btn-contact-${partner.id}`}
            onClick={() => onContactPartner(partner)}
            className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-1"
          >
            <Mail className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            <span>Contact</span>
          </button>

          <button
            id={`btn-consultation-${partner.id}`}
            onClick={() => onRequestConsultation(partner)}
            className={`py-2 px-2.5 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1 ${
              isBooked
                ? 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60'
                : 'bg-lime-100 dark:bg-lime-500/10 hover:bg-lime-200 dark:hover:bg-lime-500/20 text-lime-700 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-300 border-lime-300 dark:border-lime-500/30'
            }`}
            title={`Live Scheduling API: ${live.status} • Next opening: ${live.nextAvailableSlot}`}
          >
            <Calendar className={`w-3.5 h-3.5 ${isBooked ? 'text-amber-600 dark:text-amber-400' : 'text-lime-600 dark:text-lime-400'}`} />
            <span>{isBooked ? 'Waitlist' : live.availableSlotsToday > 0 ? `Consult (${live.availableSlotsToday} Slots)` : 'Consult'}</span>
          </button>
        </div>

        {/* Quick Call via Native Protocol (Microsoft Teams / Zoom / Google Meet) */}
        <a
          id={`btn-quick-call-${partner.id}`}
          href={partner.quickCallUrl || 'https://meet.google.com/new'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 hover:from-sky-500/20 hover:via-blue-500/20 hover:to-indigo-500/20 border border-sky-300 dark:border-sky-700/60 text-sky-800 dark:text-sky-300 font-bold text-xs transition-all flex items-center justify-between shadow-2xs group"
          title={`Start instant discovery call via ${partner.meetingPlatform || 'Google Meet'} (${partner.quickCallUrl || 'Web link'})`}
        >
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-sky-500/20 text-sky-700 dark:text-sky-300 group-hover:scale-110 transition-transform">
              <Video className="w-3.5 h-3.5" />
            </span>
            <span>Quick Call: Instant Discovery</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-700/80 shadow-2xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{partner.meetingPlatform || 'Meet'}</span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <button
            id={`btn-view-profile-${partner.id}`}
            onClick={() => onSelectPartner(partner)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-98"
          >
            <span>View Full Partner Profile</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {onOpenQrBadge && (
            <button
              type="button"
              id={`btn-card-qr-${partner.id}`}
              onClick={() => onOpenQrBadge(partner)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
              title="View & Download Scannable QR Business Card"
              aria-label="View QR Badge"
            >
              <QrCode className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span className="hidden sm:inline">QR Badge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
