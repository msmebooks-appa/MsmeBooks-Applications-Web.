import React, { useState } from 'react';
import {
  X,
  Scale,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Check,
  Building2,
  Clock,
  Mail,
  Calendar,
  ChevronRight,
  Plus,
  Briefcase,
  DollarSign,
  TrendingUp,
  Globe2,
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Partner, PartnerLevel } from '../types';
import { isFastResponse, isTopRatedPartner, isFastestResponder } from './PartnerCard';
import { TrustBadge } from './TrustBadge';
import { CurrencyToggle } from './CurrencyToggle';
import { useCurrency } from '../context/CurrencyContext';
import { PartnerCompetencyRadarChart } from './PartnerCompetencyRadarChart';
import {
  useBrowsingInterest,
  getTopRatedPartnersForCategory,
  normalizeCategory,
} from '../utils/browsingHistory';

interface PartnerComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPartners: Partner[];
  allPartners: Partner[];
  activeFilterCategory?: string;
  onRemovePartner: (partnerId: string) => void;
  onAddPartner: (partner: Partner) => void;
  onClearAll: () => void;
  onSelectPartnerForProfile: (partner: Partner) => void;
  onContactPartner: (partner: Partner) => void;
  onRequestConsultation: (partner: Partner) => void;
}

export const PartnerComparisonModal: React.FC<PartnerComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedPartners,
  allPartners,
  activeFilterCategory,
  onRemovePartner,
  onAddPartner,
  onClearAll,
  onSelectPartnerForProfile,
  onContactPartner,
  onRequestConsultation,
}) => {
  const [partnerToAddId, setPartnerToAddId] = useState<string>('');
  const [selectedCategoryOverride, setSelectedCategoryOverride] = useState<string | null>(null);

  const browsingInterest = useBrowsingInterest(allPartners, activeFilterCategory);

  // Available categories across all partners
  const availableCategories = React.useMemo(() => {
    const cats = new Set<string>();
    allPartners.forEach((p) => {
      if (p.partnerType) cats.add(normalizeCategory(p.partnerType));
    });
    return Array.from(cats).sort();
  }, [allPartners]);

  const effectiveCategory = selectedCategoryOverride || browsingInterest.category;
  const { formatBudget } = useCurrency();

  const topRatedSuggestions = React.useMemo(() => {
    return getTopRatedPartnersForCategory(effectiveCategory, allPartners, 3);
  }, [effectiveCategory, allPartners]);

  if (!isOpen) return null;

  // Compute available partners that are not already selected
  const availablePartners = allPartners.filter(
    (p) => !selectedPartners.some((sp) => sp.id === p.id)
  );

  // Determine top experience and volume leaders among selected
  const maxExperience = Math.max(...selectedPartners.map((p) => p.yearsExperience), 1);
  const maxBusinesses = Math.max(...selectedPartners.map((p) => p.businessesSupported), 1);

  const getLevelBadge = (level: PartnerLevel) => {
    return (
      <TrustBadge
        level={level}
        variant="compact"
      />
    );
  };

  const handleAddSelected = () => {
    if (!partnerToAddId) return;
    const partner = allPartners.find((p) => p.id === partnerToAddId);
    if (partner) {
      onAddPartner(partner);
      setPartnerToAddId('');
    }
  };

  // Compute unique union of all services across selected partners
  const allServicesSet = new Set<string>();
  selectedPartners.forEach((p) => p.services.forEach((s) => allServicesSet.add(s)));
  const unionServices = Array.from(allServicesSet);

  return (
    <div
      id="partner-comparison-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="partner-comparison-modal-dialog"
        data-testid="comparison-modal"
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-[#07162b] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 bg-gradient-to-r from-slate-900 via-[#0a1c35] to-emerald-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 border border-lime-500/30 flex items-center justify-center shadow-md shadow-lime-500/10 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Side-by-Side Partner Comparison
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
                  {selectedPartners.length} of 3 Partners
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Compare certified services, partner tiers, years of experience, and businesses supported.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CurrencyToggle mode="compact" idPrefix="compare-modal-currency" />

            {selectedPartners.length > 0 && (
              <button
                type="button"
                id="btn-clear-comparison"
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              type="button"
              id="btn-close-comparison-modal"
              data-testid="btn-close-comparison"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Add Bar if fewer than 3 are selected */}
        {selectedPartners.length < 3 && availablePartners.length > 0 && (
          <div className="px-5 py-2.5 bg-lime-50 dark:bg-lime-950/30 border-b border-lime-200 dark:border-lime-900/50 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-lime-900 dark:text-lime-300 font-medium">
              <Plus className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>You can compare up to 3 partners side-by-side:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                id="select-add-partner"
                value={partnerToAddId}
                onChange={(e) => setPartnerToAddId(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-lime-500"
              >
                <option value="">-- Select another partner to add --</option>
                {availablePartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city}, {p.country} • {p.level})
                  </option>
                ))}
              </select>
              <button
                type="button"
                id="btn-confirm-add-partner"
                onClick={handleAddSelected}
                disabled={!partnerToAddId}
                className="px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                Add to Comparison
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6">
          {selectedPartners.length === 0 ? (
            <div className="py-4 sm:py-6 max-w-4xl mx-auto space-y-6">
              {/* Header with Dynamic Interest Indicator */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-600 dark:text-lime-400 text-xs font-bold shadow-xs">
                  <Sparkles className="w-4 h-4 text-lime-500 shrink-0" />
                  <span>
                    {browsingInterest.isDefault
                      ? 'Recommended Focus Category'
                      : `Active Interest Based on Your Browsing History (${browsingInterest.interactionCount} ${
                          browsingInterest.interactionCount === 1 ? 'interaction' : 'interactions'
                        })`}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Top-Rated Partners in {effectiveCategory}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                    You haven't selected partners to compare yet. Based on your active interest in{' '}
                    <span className="font-bold text-slate-900 dark:text-white bg-lime-500/10 dark:bg-lime-500/20 px-2 py-0.5 rounded-md border border-lime-500/30">
                      {effectiveCategory}
                    </span>
                    , here are our highest-rated certified partners. Compare their competencies, pricing, and accreditations side-by-side:
                  </p>
                </div>

                {/* Category Switcher Tabs */}
                {availableCategories.length > 1 && (
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                      Switch Category:
                    </span>
                    {availableCategories.map((cat) => {
                      const isSelected = effectiveCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategoryOverride(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-lime-500 text-slate-950 font-bold shadow-xs scale-105'
                              : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Grid of Dynamic Suggested Top-Rated Partners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {topRatedSuggestions.map((partner) => {
                  const isFast = isFastResponse(partner.responseTime);

                  return (
                    <div
                      key={partner.id}
                      className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm hover:border-lime-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        {/* Top info */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                                {partner.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <span>{partner.countryFlag}</span>
                                <span>{partner.city}, {partner.country}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Badges: Top Rated & Level */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            ★ Top-Rated ({partner.rating})
                          </span>
                          {getLevelBadge(partner.level)}
                          {isFast && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                              <Zap className="w-2.5 h-2.5 text-sky-400" />
                              {partner.responseTime}
                            </span>
                          )}
                        </div>

                        {/* Performance Metas */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl text-center text-[11px] border border-slate-100 dark:border-slate-800">
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {partner.reviewCount} Reviews
                            </div>
                            <div className="text-[10px] text-slate-400">Client verified</div>
                          </div>
                          <div>
                            <div className="font-extrabold text-lime-600 dark:text-lime-400">
                              {partner.businessesSupported}+
                            </div>
                            <div className="text-[10px] text-slate-400">Businesses</div>
                          </div>
                        </div>

                        {/* Specialties preview */}
                        <div className="flex flex-wrap gap-1">
                          {partner.specialties.slice(0, 2).map((spec, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onAddPartner(partner)}
                          className="flex-1 py-2 px-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Compare
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectPartnerForProfile(partner)}
                          className="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                          title="View Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  id="btn-compare-suggested-all"
                  onClick={() => {
                    topRatedSuggestions.slice(0, 3).forEach((p) => onAddPartner(p));
                  }}
                  className="px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  Compare Top {Math.min(topRatedSuggestions.length, 3)} {effectiveCategory} Partners
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
                >
                  Return to Directory
                </button>
              </div>
            </div>
          ) : (
            <div className="min-w-[650px] space-y-6">
              {/* Partner Profiles Top Cards Grid */}
              <div
                className={`grid gap-4 ${
                  selectedPartners.length === 1
                    ? 'grid-cols-2'
                    : selectedPartners.length === 2
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-3'
                }`}
              >
                {selectedPartners.map((partner) => {
                  const isFast = isFastResponse(partner.responseTime);
                  const isAccepting = partner.availabilityStatus === 'Accepting New Clients';

                  return (
                    <div
                      key={partner.id}
                      className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between relative shadow-sm hover:border-lime-500/40 transition-all"
                    >
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => onRemovePartner(partner.id)}
                        className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove from comparison"
                        aria-label={`Remove ${partner.name} from comparison`}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div>
                        {/* Avatar & Location */}
                        <div className="flex items-center gap-3 mb-2.5 pr-6">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {partner.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>{partner.countryFlag}</span>
                              <span className="truncate">{partner.city}, {partner.country}</span>
                            </p>
                          </div>
                        </div>

                        {/* Partner Level & Availability */}
                        <div className="space-y-1.5 mb-3">
                          <div>{getLevelBadge(partner.level)}</div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="inline-flex items-center gap-1 text-lime-700 dark:text-lime-400 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                              Verified Partner
                            </span>
                            <span>•</span>
                            <span className={isAccepting ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-500 font-medium'}>
                              {partner.availabilityStatus}
                            </span>
                          </div>
                        </div>

                        {/* Starting Budget, Top-Rated & Response Speed */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-3">
                          {isTopRatedPartner(partner) && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/35 text-[10px]"
                              title={`Top-Rated Partner: ${partner.rating} ★ (${partner.reviewCount} reviews)`}
                            >
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                              Top-Rated
                            </span>
                          )}
                          {isFastestResponder(partner.responseTime) ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-800 dark:text-sky-300 font-bold border border-sky-500/35 text-[10px]"
                              title={`Fastest Responder: Replies in ${partner.responseTime}`}
                            >
                              <Zap className="w-2.5 h-2.5 fill-sky-400 text-sky-500" />
                              Fastest Responder
                            </span>
                          ) : isFast ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-300 dark:border-slate-700 text-[10px]">
                              {partner.responseTime}
                            </span>
                          ) : null}
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                            {formatBudget(partner.startingBudget, partner.minBudgetUSD)}
                          </span>
                        </div>
                      </div>

                      {/* Quick Action CTAs */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onContactPartner(partner)}
                            className="py-1.5 px-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-lime-600 dark:text-lime-400" />
                            <span>Contact</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRequestConsultation(partner)}
                            className="py-1.5 px-2 bg-lime-100 dark:bg-lime-950/40 hover:bg-lime-200 dark:hover:bg-lime-900/40 text-lime-800 dark:text-lime-300 rounded-lg text-xs font-semibold border border-lime-300 dark:border-lime-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3 h-3 text-lime-600 dark:text-lime-400" />
                            <span>Book</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectPartnerForProfile(partner)}
                          className="w-full py-1.5 px-2 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                        >
                          <span>View Full Profile</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Empty Slot Card if less than 3 */}
                {selectedPartners.length < 3 && (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                        Add {selectedPartners.length === 1 ? 'a 2nd' : 'a 3rd'} Partner
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Compare up to 3 certified partners side-by-side
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* D3.JS COMPETENCY STRENGTHS RADAR CHART */}
              <PartnerCompetencyRadarChart partners={selectedPartners} />

              {/* DETAILED COMPARISON TABLE */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#0a1c35]">
                {/* 1. KEY HIGHLIGHT METRICS (Years of Exp, Businesses Supported, Projects) */}
                <div className="bg-slate-100 dark:bg-slate-850 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Track Record & Experience Benchmarks</span>
                </div>

                {/* Years of Experience Row */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span>Years of Experience</span>
                  </div>
                  {selectedPartners.map((p) => {
                    const isTop = p.yearsExperience === maxExperience && selectedPartners.length > 1;
                    return (
                      <div key={p.id} className="px-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {p.yearsExperience} Years
                          </span>
                          {isTop && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              Top Exp
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (p.yearsExperience / 20) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* Businesses Supported Row */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Businesses Supported</span>
                  </div>
                  {selectedPartners.map((p) => {
                    const isTop = p.businessesSupported === maxBusinesses && selectedPartners.length > 1;
                    return (
                      <div key={p.id} className="px-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-extrabold text-lime-600 dark:text-lime-400">
                            {p.businessesSupported}+
                          </span>
                          {isTop && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-lime-100 dark:bg-lime-950 text-lime-800 dark:text-lime-300 border border-lime-300 dark:border-lime-700">
                              Most Clients
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Active enterprise & SMB clients
                        </p>
                      </div>
                    );
                  })}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* Projects Completed Row */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-500" />
                    <span>Projects Completed</span>
                  </div>
                  {selectedPartners.map((p) => (
                    <div key={p.id} className="px-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {p.projectsCompleted}+ Implementations
                      </span>
                    </div>
                  ))}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* 2. SERVICES BREAKDOWN */}
                <div className="bg-slate-100 dark:bg-slate-850 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Certified Services Comparison</span>
                </div>

                {unionServices.map((service, sIdx) => (
                  <div
                    key={service}
                    className={`grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center ${
                      sIdx % 2 === 0 ? 'bg-white dark:bg-[#0a1c35]' : 'bg-slate-50/50 dark:bg-slate-900/20'
                    }`}
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200 pr-2">
                      {service}
                    </div>
                    {selectedPartners.map((p) => {
                      const hasService = p.services.includes(service);
                      return (
                        <div key={p.id} className="px-2">
                          {hasService ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border border-lime-300 dark:border-lime-700">
                              <Check className="w-3 h-3 text-lime-600 dark:text-lime-400 stroke-[2.5]" />
                              <span>Offered</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                          )}
                        </div>
                      );
                    })}
                    {selectedPartners.length < 3 && (
                      <div className="text-slate-400 italic text-center text-[11px]">—</div>
                    )}
                  </div>
                ))}

                {/* 3. CAPABILITIES, RATINGS & BUDGET */}
                <div className="bg-slate-100 dark:bg-slate-850 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Rating, Response & Budget Tier</span>
                </div>

                {/* Partner Rating & Reviews */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Client Rating
                  </div>
                  {selectedPartners.map((p) => (
                    <div key={p.id} className="px-2">
                      <div className="flex items-center gap-1 text-sm font-extrabold text-slate-900 dark:text-white">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{p.rating.toFixed(1)} / 5.0</span>
                      </div>
                      <span className="text-[10px] text-slate-400">({p.reviewCount} verified reviews)</span>
                    </div>
                  ))}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* Response Time Row */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Response Time</span>
                  </div>
                  {selectedPartners.map((p) => {
                    const isFast = isFastResponse(p.responseTime);
                    return (
                      <div key={p.id} className="px-2">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {p.responseTime}
                        </div>
                        {isFast && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            <Zap className="w-2.5 h-2.5 fill-amber-400" />
                            Under 2 Hours
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* Starting Budget Row */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Starting Budget</span>
                  </div>
                  {selectedPartners.map((p) => (
                    <div key={p.id} className="px-2">
                      <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                        {formatBudget(p.startingBudget, p.minBudgetUSD, { prefix: '' })}
                      </span>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {p.budgetTier || 'Mid-range'}
                      </div>
                    </div>
                  ))}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* Remote vs Onsite Support */}
                <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs items-center bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Remote Support</span>
                  </div>
                  {selectedPartners.map((p) => (
                    <div key={p.id} className="px-2">
                      {p.remoteSupport ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                          <Check className="w-3 h-3 text-blue-500" />
                          100% Remote Available
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">On-site Local Only</span>
                      )}
                    </div>
                  ))}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>

                {/* Client Success Metric Highlight */}
                <div className="grid grid-cols-4 p-3 sm:p-4 text-xs items-center">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Case Study Proof
                  </div>
                  {selectedPartners.map((p) => {
                    const story = p.clientSuccessStories[0];
                    return (
                      <div key={p.id} className="px-2">
                        {story ? (
                          <div className="space-y-1">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-lime-100 dark:bg-lime-950/80 text-lime-900 dark:text-lime-300 font-extrabold text-[10px] border border-lime-300 dark:border-lime-700">
                              {story.metric}
                            </span>
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                              {story.businessName} ({story.industry})
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </div>
                    );
                  })}
                  {selectedPartners.length < 3 && (
                    <div className="text-slate-400 italic text-center text-[11px]">—</div>
                  )}
                </div>
              </div>

              {/* Bottom Action Cards */}
              <div
                className={`grid gap-4 pt-2 ${
                  selectedPartners.length === 1
                    ? 'grid-cols-2'
                    : selectedPartners.length === 2
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-3'
                }`}
              >
                {selectedPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      Ready to work with {partner.name}?
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onContactPartner(partner)}
                        className="py-2 px-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                        <span>Contact</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestConsultation(partner)}
                        className="py-2 px-2 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-950" />
                        <span>Book Call</span>
                      </button>
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
