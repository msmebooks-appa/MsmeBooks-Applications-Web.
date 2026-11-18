import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Star, 
  Wifi, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Globe2, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  Award,
  Calendar,
  Layers,
  Building2,
  Store,
  FileText,
  Zap,
  Coins,
  QrCode,
  MessageCircleQuestion,
  ExternalLink,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { Partner } from '../types';
import { isFastResponse, isTopRatedPartner, isFastestResponder, isMostCertifiedPartner, isVeteranPartner } from './PartnerCard';
import { TrustBadge } from './TrustBadge';
import { CurrencyToggle } from './CurrencyToggle';
import { useCurrency } from '../context/CurrencyContext';
import { VerifiedSkillTag } from './VerifiedSkillTag';
import { getPartnerCertificationAuthorities } from '../data/partnersData';
import { LiveAvailabilityIndicator } from './LiveAvailabilityIndicator';
import { AwardBadge } from './AwardBadge';
import { PartnerMiniCalendar } from './PartnerMiniCalendar';

interface PartnerProfileModalProps {
  partner: Partner | null;
  onClose: () => void;
  onContactPartner: (partner: Partner) => void;
  onRequestConsultation: (partner: Partner) => void;
  onOpenQrBadge?: (partner: Partner) => void;
  onAskQuestion?: (partner: Partner) => void;
}

export const PartnerProfileModal: React.FC<PartnerProfileModalProps> = ({
  partner,
  onClose,
  onContactPartner,
  onRequestConsultation,
  onOpenQrBadge,
  onAskQuestion,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [showShareTray, setShowShareTray] = useState<boolean>(false);

  const handleCopyCredential = (credId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(credId);
      setCopiedId(credId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getShareUrl = (): string => {
    if (typeof window === 'undefined' || !partner) return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?partner=${encodeURIComponent(partner.slug || partner.id)}`;
  };

  const handleSharePartner = async () => {
    if (!partner) return;
    const shareUrl = getShareUrl();
    const shareTitle = `${partner.name} - MsmeBooks Certified ${partner.level} Partner`;
    const shareText = `Connect with ${partner.name} (${partner.city}, ${partner.country}), official MsmeBooks ${partner.level} Partner. Specializing in ${partner.specialties.slice(0, 3).join(', ')}. Rating: ${partner.rating} ★ (${partner.businessesSupported}+ businesses supported). Typical implementation: ${partner.typicalImplementationTime || '2–4 weeks'}.`;

    // 1. Web Share API (native share on mobile/supported desktop browsers)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 3000);
        return;
      } catch (err: any) {
        // User aborted/dismissed native sheet
        if (err && (err.name === 'AbortError' || err.code === 20)) {
          return;
        }
      }
    }

    // 2. Fallback: Copy URL to clipboard and show interactive social share tray
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('Link copied to clipboard!');
        setShowShareTray(true);
        setTimeout(() => setShareFeedback(null), 3500);
      } catch {
        setShowShareTray(true);
      }
    } else {
      setShowShareTray(true);
    }
  };

  const {
    formatBudget,
    getRawUSD,
    currency,
    currentCurrency,
    formatHourlyRate,
    formatServicePricing,
    getPartnerServicesWithPricing,
    geographicProfile,
    detectedLocation,
    isLocationAdjusted,
  } = useCurrency();
  if (!partner) return null;

  const authorities = (partner.certificationAuthorities && partner.certificationAuthorities.length > 0)
    ? partner.certificationAuthorities
    : getPartnerCertificationAuthorities(partner);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-4xl bg-[#091d38] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-[#08182e] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              MsmeBooks Official Partner Dossier
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Native Web Share API Button */}
            <button
              type="button"
              id={`btn-modal-share-${partner.id}`}
              data-testid="modal-share-button"
              onClick={handleSharePartner}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/40 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Share Partner Profile via native apps or messaging"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareFeedback === 'Shared successfully!' ? 'Shared!' : shareFeedback === 'Link copied to clipboard!' ? 'Copied!' : 'Share'}</span>
            </button>

            {onOpenQrBadge && (
              <button
                type="button"
                id={`btn-modal-qr-badge-${partner.id}`}
                onClick={() => onOpenQrBadge(partner)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 text-lime-400 border border-lime-500/40 text-xs font-bold transition-all shadow-xs"
                title="View & Download Scannable QR Badge / Digital Business Card"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">QR Badge</span>
              </button>
            )}
            <CurrencyToggle mode="compact" idPrefix="profile-modal-currency" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share Feedback Toast Notification */}
        {shareFeedback && (
          <div
            id="modal-share-toast"
            data-testid="modal-share-toast"
            className="px-6 py-2 bg-sky-500 text-slate-950 text-xs font-bold flex items-center justify-between shadow-md transition-all animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-slate-950" />
              <span>{shareFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setShareFeedback(null)}
              className="p-0.5 hover:bg-sky-600 rounded transition-colors text-slate-950"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Header Identity Block */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shrink-0 shadow-lg"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {partner.name}
                  </h2>
                  <TrustBadge
                    level={partner.level}
                    partnerId={partner.id}
                    commissionRate={partner.commissionRate}
                    variant="pill"
                  />
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {partner.verified ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-lime-400" />
                      <span>✓ Verified MsmeBooks Partner</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Provisional • Pending Verification</span>
                    </div>
                  )}

                  {/* Visual Award Badges with Subtle Hover Animations */}
                  {isTopRatedPartner(partner) && (
                    <AwardBadge
                      type="top-rated"
                      label="Top Rated 2024"
                      metricSnippet={`${partner.rating.toFixed(2)} ★`}
                      reason={`Top Rated 2024: Awarded for outstanding ${partner.rating.toFixed(2)} client satisfaction score across ${partner.reviewCount} verified client reviews.`}
                      id={`modal-top-rated-badge-${partner.id}`}
                      testId="modal-top-rated-badge"
                    />
                  )}

                  {isFastestResponder(partner.responseTime) && (
                    <AwardBadge
                      type="fastest-responder"
                      label="Fastest Responder"
                      metricSnippet={partner.responseTime}
                      reason={`Fastest Responder: Guaranteed priority response SLA within ${partner.responseTime}.`}
                      id={`modal-fastest-responder-badge-${partner.id}`}
                      testId="modal-fastest-responder-badge"
                    />
                  )}

                  {isMostCertifiedPartner(partner) && (
                    <AwardBadge
                      type="most-certified"
                      label="Most Certified"
                      metricSnippet={`${partner.certificationAuthorities?.length || 3} Bodies`}
                      reason={`Most Certified: Holds ${partner.certificationAuthorities?.length || 3}+ audited institutional accreditations (${partner.certificationAuthorities?.map(a => a.acronym).slice(0, 2).join(' & ') || 'MPAB & Statutory Bodies'}).`}
                      id={`modal-most-certified-badge-${partner.id}`}
                      testId="modal-most-certified-badge"
                    />
                  )}

                  {!isFastestResponder(partner.responseTime) && !isTopRatedPartner(partner) && isVeteranPartner(partner) && (
                    <AwardBadge
                      type="veteran"
                      label={`${partner.yearsExperience}+ Yrs Veteran`}
                      metricSnippet={`${partner.businessesSupported}+ SMEs`}
                      reason={`Veteran Advisor: Over ${partner.yearsExperience} years in professional practice with ${partner.businessesSupported}+ verified implementations.`}
                      id={`modal-veteran-badge-${partner.id}`}
                      testId="modal-veteran-badge"
                    />
                  )}

                  {/* Live Scheduling Availability Indicator with Real-Time Popover */}
                  <LiveAvailabilityIndicator
                    partner={partner}
                    onRequestConsultation={onRequestConsultation}
                    idPrefix="modal"
                  />

                  {/* Typical Implementation Time Badge */}
                  <div
                    id={`modal-typical-duration-badge-${partner.id}`}
                    data-testid="modal-typical-duration-badge"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-500/40 text-sky-300 text-xs font-bold"
                    title={`Typical Implementation Time: ${partner.typicalImplementationTime || '2–4 weeks'} (Estimated duration from kickoff to live deployment)`}
                  >
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Typical Implementation: <strong className="text-white">{partner.typicalImplementationTime || '2–4 weeks'}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="text-sm">{partner.countryFlag}</span>
                    <span>📍 {partner.address || `${partner.city}, ${partner.country}`}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className={`w-3.5 h-3.5 ${isFastResponse(partner.responseTime) ? 'text-amber-400' : 'text-lime-400'}`} />
                    <span>Responds {partner.responseTime}</span>
                  </span>
                  {isFastResponse(partner.responseTime) && (
                    <span
                      id={`modal-fast-response-badge-${partner.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                      title={`Fast Response: Typically replies in ${partner.responseTime}`}
                    >
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400/30 shrink-0" />
                      <span>Fast Response</span>
                    </span>
                  )}
                  {partner.remoteSupport && (
                    <span className="inline-flex items-center gap-1 text-blue-300 bg-blue-950 px-2 py-0.5 rounded text-[11px] border border-blue-800">
                      <Wifi className="w-3 h-3" />
                      Remote Support Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={() => onContactPartner(partner)}
                className="px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Contact Partner</span>
              </button>

              <button
                onClick={() => onRequestConsultation(partner)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4 text-lime-400" />
                <span>{partner.availabilityStatus === 'Currently Booked' ? 'Join Waitlist' : 'Request Consultation'}</span>
              </button>

              <button
                type="button"
                id={`btn-modal-share-cta-${partner.id}`}
                data-testid="modal-share-cta"
                onClick={handleSharePartner}
                className="px-5 py-2.5 bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 hover:text-white font-semibold text-xs rounded-xl border border-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Share this partner profile via native apps or messaging"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>

          {/* Section 12: Partner Verification System Info Box */}
          <div className="bg-[#0c2342] border border-lime-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-lime-400" />
                <span className="text-sm font-bold text-white">
                  Official MsmeBooks Partner Verification Status
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-lime-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                ID: {partner.verification.partnerId}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                {partner.verification?.businessIdentityVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-slate-200">
                  {partner.verification?.businessIdentityVerified ? 'Business Identity Verified' : 'Identity In Review'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {partner.verification?.partnerStatusVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-slate-200">
                  {partner.verification?.partnerStatusVerified ? 'Partner Status Verified' : 'Status In Review'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {partner.verification?.servicesVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-slate-200">
                  {partner.verification?.servicesVerified ? 'Services & Rates Verified' : 'Rates Under Review'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {partner.verification?.trainingCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-slate-200">
                  {partner.verification?.trainingCompleted ? 'Product Training Completed' : 'Training In Progress'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>Verification Validated: <strong className="text-slate-200">{partner.verification?.verifiedDate || 'Pending Review'}</strong></span>
              <span>Training Certified: <strong className="text-slate-200">{partner.verification?.trainingDate || 'Scheduled'}</strong></span>
              <span>Partner Tier: <strong className="text-lime-400">{partner.level} Partner</strong></span>
            </div>
          </div>

          {/* Key Partner Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-lime-400">{partner.businessesSupported}+</div>
              <div className="text-xs text-slate-400">Businesses Supported</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-white">{partner.projectsCompleted}+</div>
              <div className="text-xs text-slate-400">Projects Completed</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-lime-400">{partner.yearsExperience} yrs</div>
              <div className="text-xs text-slate-400">Years Experience</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{partner.rating}</span>
              </div>
              <div className="text-xs text-slate-400">{partner.reviewCount} verified client reviews</div>
            </div>
          </div>

          {/* Real-Time Availability Mini-Calendar (LiveSchedulingProvider) */}
          <PartnerMiniCalendar
            partner={partner}
            onRequestConsultation={(p) => {
              onClose();
              onRequestConsultation(p);
            }}
          />

          {/* Location-Aware Project Budget & Multi-Currency Scope */}
          <div className="p-4 sm:p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-lime-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Location-Aware Service Pricing & Consultation Rates
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  📍 {detectedLocation.countryFlag} {detectedLocation.country} ({currentCurrency.code})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  1 USD ≈ {currentCurrency.rateAgainstUSD} {currentCurrency.code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800/80">
              {/* Implementation Project Budget */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                  Starting Engagement Budget
                </span>
                <div className="text-2xl font-black text-lime-400">
                  {formatBudget(partner.startingBudget, partner.minBudgetUSD, { prefix: '', partnerCountry: partner.country })}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-bold">
                    {partner.budgetTier || 'Mid-range ($500 - $1.5k)'}
                  </span>
                  {currency !== 'USD' && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      ≈ ${getRawUSD(partner.startingBudget, partner.minBudgetUSD).toLocaleString()} USD baseline
                    </span>
                  )}
                </div>
              </div>

              {/* Typical Implementation Time Field */}
              <div 
                id={`modal-typical-implementation-time-${partner.id}`}
                data-testid="modal-implementation-time"
                className="p-3.5 bg-slate-950/70 rounded-xl border border-sky-900/40 bg-gradient-to-b from-sky-950/20 to-slate-950/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-sky-300 uppercase tracking-wider font-bold block">
                    Typical Implementation Time
                  </span>
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-sky-400">
                  {partner.typicalImplementationTime || '2–4 weeks'}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                    Estimated Project Duration
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Kickoff to Go-Live
                  </span>
                </div>
              </div>

              {/* Consultation & Advisory Hourly Rate */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                  Consultation & Advisory Rate
                </span>
                <div 
                  id={`modal-consultation-rate-${partner.id}`}
                  data-testid="modal-consultation-rate"
                  className="text-2xl font-black text-white"
                >
                  {formatHourlyRate(partner)}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Free 30-min Strategy Call
                  </span>
                  <span className="text-[11px] text-slate-400">
                    No commitment required
                  </span>
                </div>
              </div>
            </div>

            {/* Location-Aware Context Explainer */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="text-lime-400">📍</span>
                <span>
                  <strong>{geographicProfile.regionName}:</strong> Rates automatically calibrated for {detectedLocation.countryFlag} {detectedLocation.country} economic conditions in {currentCurrency.code} ({currentCurrency.name}).
                </span>
              </span>
              <span className="text-[10px] text-lime-400/90 font-mono">
                Regional Index: {Math.round(geographicProfile.parityMultiplier * 100)}%
              </span>
            </div>
          </div>

          {/* Location-Aware Services & Deliverables Rate Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-lime-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-lime-400" />
                  <span>Services Offered & Localized Rate Card</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transparent service deliverables and pricing automatically adjusted for your location in {currentCurrency.code}.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {partner.services.length} Services Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partner.services.map((srv, sIdx) => {
                const priceInfo = formatServicePricing(srv, partner);
                return (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-lime-500/40 transition-all flex flex-col justify-between space-y-2.5 shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shrink-0" />
                          <span>{srv}</span>
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {priceInfo.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug mt-1.5">
                        {priceInfo.deliverables}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-lime-400 font-mono">
                          {priceInfo.formattedPrice}
                        </div>
                        <div className="text-[9.5px] text-slate-400">
                          {priceInfo.unit} {currency !== 'USD' && `(${priceInfo.formattedUSDRef})`}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onRequestConsultation(partner);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-lime-500/20 hover:bg-lime-500 text-lime-300 hover:text-slate-950 font-bold text-[10.5px] border border-lime-500/40 transition-all flex items-center gap-1"
                      >
                        <span>Book Service</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-lime-400 uppercase tracking-wider">
              About This Partner
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {partner.about}
            </p>
          </div>

          {/* Specialties & Industries Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expertise & Specialties */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Core Expertise & Certifications
                </h4>
                <span className="text-[10px] text-slate-400">Hover for verified credentials</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {partner.specialties.map((item, idx) => (
                  <VerifiedSkillTag
                    key={idx}
                    partner={partner}
                    skill={item}
                    id={`modal-skill-tag-${partner.id}-${idx}`}
                    testId={`modal-skill-tag-${partner.id}-${idx}`}
                    variant="specialty"
                  />
                ))}
              </div>
            </div>

            {/* Target Industries */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Industry Coverage
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {partner.industries.map((item, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages & Scale */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-lime-400" />
              <span className="text-slate-400">Languages Supported:</span>
              <span className="font-bold text-white">{partner.languages.join(', ')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Business Size Coverage:</span>
              <span className="font-bold text-white">{partner.businessSizeCoverage.join(', ')}</span>
            </div>
          </div>

          {/* Section: Certification Authority & Statutory Verification Portals */}
          <div 
            id="section-certification-authority" 
            data-testid="section-certification-authority" 
            className="space-y-4 pt-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-lime-400 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-lime-400" />
                  <span>Certification Authority & Statutory Verification</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official licensing boards, statutory accountancy institutes, and accreditation authorities certifying {partner.name}.
                </p>
              </div>
              <span className="self-start sm:self-auto text-[10px] px-2.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 font-bold">
                {authorities.length} Issuing Authorities Verified
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {authorities.map((auth) => (
                <div
                  key={auth.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#07162b] border border-slate-700/80 hover:border-lime-500/40 transition-all space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-lime-400 text-[11px] font-mono font-bold border border-slate-700">
                          {auth.acronym}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base text-white">
                          {auth.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-medium">
                          {auth.issuerType}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{auth.status}</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="font-semibold text-lime-300">{auth.credentialName}</span>
                        {auth.jurisdiction && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">📍 {auth.jurisdiction}</span>
                          </>
                        )}
                        {auth.issuedYear && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">Issued {auth.issuedYear}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <a
                      href={auth.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition-all shadow shrink-0 group"
                      title={`Open ${auth.portalName} in a new tab`}
                    >
                      <span>Verify on Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  {auth.description && (
                    <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2.5">
                      {auth.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Credential ID:</span>
                      <code className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-lime-400 font-mono font-bold">
                        {auth.credentialId}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyCredential(auth.credentialId)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copy Credential ID"
                      >
                        {copiedId === auth.credentialId ? (
                          <Check className="w-3 h-3 text-lime-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                      {copiedId === auth.credentialId && (
                        <span className="text-lime-400 text-[10px] font-bold">Copied!</span>
                      )}
                    </div>

                    <div className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Registry: <strong>{auth.portalName}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Success Stories */}
          {partner.clientSuccessStories && partner.clientSuccessStories.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-lime-400 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-lime-400" />
                  <span>Client Case Studies & Verified Results</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partner.clientSuccessStories.map((story, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-2xl bg-[#07162b] border border-slate-700/90 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-bold text-sm text-white">{story.businessName}</h4>
                          {story.implementationScale && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              story.implementationScale === 'Large-Scale Enterprise'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : story.implementationScale === 'Mid-Market'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {story.implementationScale === 'Large-Scale Enterprise' && <Building2 className="w-2.5 h-2.5 shrink-0" />}
                              {story.implementationScale === 'Mid-Market' && <Layers className="w-2.5 h-2.5 shrink-0" />}
                              {story.implementationScale === 'Small Business' && <Store className="w-2.5 h-2.5 shrink-0" />}
                              <span>{story.implementationScale}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {story.industry} • 📍 {story.location}
                        </div>
                      </div>
                      {story.metric && (
                        <span className="px-2 py-0.5 rounded bg-lime-500/20 text-lime-400 font-extrabold text-xs border border-lime-500/30 shrink-0">
                          {story.metric}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-red-300 font-semibold">Challenge: </span>
                        <span className="text-slate-300">{story.challenge}</span>
                      </div>
                      <div>
                        <span className="text-blue-300 font-semibold">Solution: </span>
                        <span className="text-slate-300">{story.solution}</span>
                      </div>
                      <div>
                        <span className="text-lime-300 font-semibold">Outcome: </span>
                        <span className="text-white font-medium">{story.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#08182e] border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Direct Partner Line:</span>
            <a href={`tel:${partner.phone}`} className="text-lime-400 font-semibold hover:underline">
              {partner.phone}
            </a>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onAskQuestion && (
              <button
                type="button"
                id={`btn-profile-ask-question-${partner.id}`}
                onClick={() => {
                  onClose();
                  onAskQuestion(partner);
                }}
                className="py-2 px-3.5 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 text-lime-400 font-bold border border-lime-500/30 transition-all flex items-center gap-1.5"
              >
                <MessageCircleQuestion className="w-4 h-4 text-lime-400" />
                <span>Ask a Question</span>
              </button>
            )}
            <button
              type="button"
              id={`btn-footer-share-${partner.id}`}
              data-testid="btn-footer-share"
              onClick={handleSharePartner}
              className="py-2 px-3.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 font-bold border border-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Share Partner Profile via native Web Share or social apps"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestConsultation(partner);
              }}
              className="flex-1 sm:flex-none py-2 px-5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl shadow transition-all"
            >
              Request Consultation
            </button>
          </div>
        </div>

        {/* Floating Share Sheet / Fallback Tray */}
        {showShareTray && (
          <div 
            id="modal-share-fallback-tray"
            data-testid="modal-share-fallback-tray"
            className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-5 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 rounded-b-3xl shadow-2xl transition-all"
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-white">Share {partner.name}'s Profile</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareTray(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
                  className="bg-transparent flex-1 text-slate-300 font-mono text-[11px] outline-none px-1"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(getShareUrl());
                    setShareFeedback('Link copied to clipboard!');
                    setTimeout(() => setShareFeedback(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                >
                  {shareFeedback === 'Link copied to clipboard!' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="text-slate-400 text-[11px]">Direct Share:</span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${partner.name} - Official MsmeBooks Partner (${partner.city}, ${partner.country})\n${getShareUrl()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${partner.name}, certified MsmeBooks ${partner.level} Partner in ${partner.country}!`)}&url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>X (Twitter)</span>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`${partner.name} - MsmeBooks Partner Recommendation`)}&body=${encodeURIComponent(`I wanted to share this MsmeBooks Partner profile with you:\n\n${partner.name}\n${partner.tagline}\nLocation: ${partner.city}, ${partner.country}\n\nView full verified profile: ${getShareUrl()}`)}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
