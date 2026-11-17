import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  Briefcase,
  Star,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  Mail,
  Calendar,
  RotateCcw,
  Check,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowRight,
  Compass,
  X,
  QrCode,
  Coins
} from 'lucide-react';
import { Partner } from '../types';
import { TrustBadge } from './TrustBadge';
import { useCurrency } from '../context/CurrencyContext';
import {
  computeRecommendedPartners,
  getUserLocationContext,
  setUserLocationPreference,
  UserLocationContext,
  RecommendedPartnerItem
} from '../utils/partnerRecommendations';
import { normalizeCategory, recordCategoryFilter, clearBrowsingHistory, hasBrowsingHistory } from '../utils/browsingHistory';

interface RecommendedPartnersSectionProps {
  allPartners: Partner[];
  activeFilterCountry?: string;
  activeFilterCategory?: string;
  onSelectPartner: (partner: Partner) => void;
  onContactPartner: (partner: Partner) => void;
  onRequestConsultation: (partner: Partner) => void;
  onApplyCategoryFilter?: (category: string) => void;
  onApplyCountryFilter?: (country: string) => void;
  onOpenQrBadge?: (partner: Partner) => void;
}

const AVAILABLE_SAMPLE_COUNTRIES = [
  { country: 'Nigeria', city: 'Lagos', flag: '🇳🇬', code: 'NG' },
  { country: 'Kenya', city: 'Nairobi', flag: '🇰🇪', code: 'KE' },
  { country: 'South Africa', city: 'Johannesburg', flag: '🇿🇦', code: 'ZA' },
  { country: 'Ghana', city: 'Accra', flag: '🇬🇭', code: 'GH' },
  { country: 'Rwanda', city: 'Kigali', flag: '🇷🇼', code: 'RW' },
  { country: 'United Kingdom', city: 'London', flag: '🇬🇧', code: 'GB' },
];

const SAMPLE_INTEREST_CATEGORIES = [
  'Accounting Firms',
  'POS Agents',
  'Technology Companies',
  'Audit Firms',
  'SME Advisors',
];

export const RecommendedPartnersSection: React.FC<RecommendedPartnersSectionProps> = ({
  allPartners,
  activeFilterCountry,
  activeFilterCategory,
  onSelectPartner,
  onContactPartner,
  onRequestConsultation,
  onApplyCategoryFilter,
  onApplyCountryFilter,
  onOpenQrBadge,
}) => {
  const { formatBudget, formatHourlyRate, currentCurrency } = useCurrency();
  const [userLoc, setUserLoc] = useState<UserLocationContext>(() =>
    getUserLocationContext(activeFilterCountry)
  );
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [showHeuristicsInfo, setShowHeuristicsInfo] = useState<boolean>(false);
  const [historyKey, setHistoryKey] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [hasHistory, setHasHistory] = useState<boolean>(() => hasBrowsingHistory());

  // Sync location context when filter or custom event fires
  useEffect(() => {
    setUserLoc(getUserLocationContext(activeFilterCountry));
  }, [activeFilterCountry]);

  useEffect(() => {
    const handleUpdate = () => {
      setHistoryKey((prev) => prev + 1);
      setUserLoc(getUserLocationContext(activeFilterCountry));
      setHasHistory(hasBrowsingHistory());
    };

    window.addEventListener('msmebooks-history-updated', handleUpdate);
    return () => {
      window.removeEventListener('msmebooks-history-updated', handleUpdate);
    };
  }, [activeFilterCountry]);

  // Compute recommendations reactively
  const recommendations: RecommendedPartnerItem[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = historyKey; // trigger recomputation on history update
    return computeRecommendedPartners(allPartners, {
      userCountry: userLoc.country,
      userCity: userLoc.city,
      activeFilterCategory,
      limit: 4,
    });
  }, [allPartners, userLoc.country, userLoc.city, activeFilterCategory, historyKey]);

  const handleSelectCountry = (item: typeof AVAILABLE_SAMPLE_COUNTRIES[0]) => {
    setUserLocationPreference(item);
    setUserLoc({
      country: item.country,
      city: item.city,
      countryCode: item.code,
      countryFlag: item.flag,
      isAutoDetected: false,
    });
    setShowLocationPicker(false);
  };

  const handleSelectInterest = (cat: string) => {
    recordCategoryFilter(cat);
    onApplyCategoryFilter?.(cat);
  };

  const handleResetHistory = () => {
    clearBrowsingHistory();
    setHistoryKey((prev) => prev + 1);
    setHasHistory(false);
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section 
      id="recommended-partners-section"
      aria-label="Recommended Partners for You"
      className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1c38] to-[#07162d] border border-lime-500/30 text-white shadow-xl overflow-hidden transition-all"
    >
      {/* Top Banner Header */}
      <div className="px-5 sm:px-7 py-4.5 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Title & Heuristic Badges */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lime-500/20 border border-lime-400/40 flex items-center justify-center text-lime-400 shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Recommended for You
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-lime-500 text-slate-950 shadow-xs">
                Personalized
              </span>
            </div>
            
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Heuristic suggestions matching your location</span>
              <span className="text-slate-500">•</span>
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="inline-flex items-center gap-1 text-lime-400 hover:text-lime-300 font-bold underline transition-colors cursor-pointer"
                title="Change recommendation location"
              >
                <span>{userLoc.countryFlag} {userLoc.country}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </p>
          </div>
        </div>

        {/* Right Action Tools: Heuristics Info & Collapse Toggle */}
        <div className="flex items-center gap-2 relative">
          
          {/* Location Picker Popover */}
          {showLocationPicker && (
            <div className="absolute right-0 top-11 w-64 bg-white dark:bg-[#0c1f3d] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-40 text-slate-900 dark:text-white animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
                <span>Select Your Location</span>
                <button onClick={() => setShowLocationPicker(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {AVAILABLE_SAMPLE_COUNTRIES.map((item) => {
                  const isCurrent = userLoc.country.toLowerCase() === item.country.toLowerCase();
                  return (
                    <button
                      key={item.country}
                      type="button"
                      onClick={() => handleSelectCountry(item)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400 font-bold border border-lime-500/30'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.country}</span>
                        <span className="text-[10px] text-slate-400">({item.city})</span>
                      </span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-lime-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* "Why These?" Info Button */}
          <button
            type="button"
            id="btn-recommendations-info"
            data-testid="btn-recommendations-info"
            onClick={() => setShowHeuristicsInfo(!showHeuristicsInfo)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            title="Learn how suggestions are calculated"
          >
            <Info className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Why these?</span>
          </button>

          {/* Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            aria-label={isCollapsed ? 'Expand recommendations' : 'Collapse recommendations'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Heuristics Transparency Dialog Drawer */}
      {showHeuristicsInfo && (
        <div className="px-5 sm:px-7 py-3.5 bg-blue-950/40 border-b border-slate-800 text-xs text-slate-300 flex items-start justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Recommendation Heuristics Breakdown:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-300">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-lime-400 block mb-0.5">1. Geographic Proximity</span>
                Matches your country ({userLoc.country}) and city hubs to reduce on-site travel costs.
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-sky-400 block mb-0.5">2. Browsing History</span>
                Weights categories you view, contact, or compare to recommend relevant specialists.
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">3. Quality & Response SLA</span>
                Prioritizes 4.8★+ ratings, sub-hour responsiveness, and active client capacity.
              </div>
            </div>

            {hasHistory && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Custom interest history is currently active.
                </span>
                <button
                  type="button"
                  id="btn-reset-browsing-history"
                  onClick={handleResetHistory}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Browsing History</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowHeuristicsInfo(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Interest Quick-Switch Filter Strip */}
      <div className="px-5 sm:px-7 py-2.5 bg-slate-950/20 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>Tune Interest:</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {SAMPLE_INTEREST_CATEGORIES.map((cat) => {
            const isMatch = activeFilterCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectInterest(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  isMatch
                    ? 'bg-lime-500 text-slate-950 border-lime-400 font-bold shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Cards Body */}
      {!isCollapsed && (
        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((item) => {
              const p = item.partner;
              const isAccepting = p.availabilityStatus === 'Accepting New Clients';

              return (
                <div
                  key={p.id}
                  id={`recommended-card-${p.id}`}
                  data-testid="recommended-partner-card"
                  className="bg-white/5 hover:bg-white/8 border border-slate-700/80 hover:border-lime-500/60 rounded-2xl p-4.5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-lime-500/5 relative"
                >
                  <div>
                    {/* Heuristic Kicker / Reason Pill */}
                    <div className="flex items-center justify-between gap-1 mb-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-md border border-lime-500/30 truncate">
                        {item.isLocalMatch ? (
                          <MapPin className="w-3 h-3 shrink-0" />
                        ) : item.isCategoryMatch ? (
                          <Briefcase className="w-3 h-3 shrink-0" />
                        ) : (
                          <Star className="w-3 h-3 shrink-0 fill-lime-400" />
                        )}
                        <span className="truncate">{item.reasonBadge}</span>
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onOpenQrBadge && (
                          <button
                            type="button"
                            id={`btn-recommended-qr-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenQrBadge(p);
                            }}
                            className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                            title={`View QR Badge for ${p.name}`}
                            aria-label={`View QR Badge for ${p.name}`}
                          >
                            <QrCode className="w-3 h-3 text-lime-400" />
                          </button>
                        )}
                        <TrustBadge
                          level={p.level}
                          partnerId={p.id}
                          variant="pill"
                        />
                      </div>
                    </div>

                    {/* Partner Header */}
                    <div className="flex items-start gap-3">
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0 group-hover:border-lime-400 transition-colors"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-white truncate group-hover:text-lime-400 transition-colors">
                          {p.name}
                        </h4>
                        
                        <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                          <span>{p.countryFlag}</span>
                          <span className="truncate">{p.city}, {p.country}</span>
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {p.rating.toFixed(1)}
                          </span>
                          <span className="text-slate-400">({p.reviewCount})</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300 font-medium truncate">{p.partnerType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Primary Reason Explanatory Snippet */}
                    <div className="mt-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 leading-snug">
                      <span className="text-lime-400 font-semibold mr-1">Match Reason:</span>
                      {item.primaryReason}
                    </div>

                    {/* Key Services Tags */}
                    <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] text-slate-300">
                      {p.specialties.slice(0, 2).map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Location-Adjusted Rates & Budget Strip */}
                    <div className="mt-3 py-1.5 px-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-1 min-w-0">
                        <Coins className="w-3 h-3 text-lime-400 shrink-0" />
                        <span className="text-slate-400 text-[10px]">Est:</span>
                        <span className="font-extrabold text-lime-400 truncate text-[11px]">
                          {formatBudget(p.startingBudget, p.minBudgetUSD, { prefix: '', partnerCountry: p.country })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 font-mono text-[10.5px] font-bold text-slate-200">
                        <span className="text-slate-500">•</span>
                        <span>{formatHourlyRate(p, { compact: true })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Replies {p.responseTime}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[10px] ${
                          isAccepting ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAccepting ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        {isAccepting ? 'Available' : 'Booked'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onContactPartner(p)}
                        className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-lime-400" />
                        <span>Contact</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectPartner(p)}
                        className="py-1.5 px-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1 transform active:scale-98"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
