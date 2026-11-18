import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Globe2, 
  MessageCircle, 
  Calendar, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Award,
  Users,
  X,
  Zap,
  ArrowUpDown,
  Check,
  RotateCcw,
  Crown
} from 'lucide-react';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';
import { FirmReviewSystem } from './FirmReviewSystem';
import { getAllFirmsAggregates } from '../utils/reviewStorage';
import {
  FirmBadgeIconsCluster,
  FirmTierBadgesBar,
  FirmTierShowcase,
} from './FirmTierBadges';
import {
  FirmAvailabilityCalendar,
  getNextAvailableSlotForFirm,
} from './FirmAvailabilityCalendar';

interface FirmDirectoryProps {
  onBookWithFirm: (
    service: ServiceItem,
    firm: ProfessionalFirm,
    prefilledDate?: string,
    prefilledTimeSlot?: string
  ) => void;
  selectedCountry: string;
}

export type FirmSortOption = 'featured' | 'fastest_response' | 'rating' | 'experience' | 'reviews';

export const FirmDirectory: React.FC<FirmDirectoryProps> = ({
  onBookWithFirm,
  selectedCountry,
}) => {
  const { formatPriceString } = useCurrency();
  const [searchFirmQuery, setSearchFirmQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'top_rated' | 'fast_responder' | 'verified_partner' | 'platinum_core'>('all');
  const [sortBy, setSortBy] = useState<FirmSortOption>('featured');
  const [selectedFirmModal, setSelectedFirmModal] = useState<ProfessionalFirm | null>(null);
  const [reviewModalFirm, setReviewModalFirm] = useState<ProfessionalFirm | null>(null);
  const [firmAggregates, setFirmAggregates] = useState<Record<string, { rating: number; reviewCount: number }>>(() => getAllFirmsAggregates());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleReviewsChanged = () => {
      setFirmAggregates(getAllFirmsAggregates());
    };
    window.addEventListener('msmebooks_reviews_changed', handleReviewsChanged);
    window.addEventListener('storage', handleReviewsChanged);
    return () => {
      window.removeEventListener('msmebooks_reviews_changed', handleReviewsChanged);
      window.removeEventListener('storage', handleReviewsChanged);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [categoryFilter, badgeFilter, selectedCountry, sortBy]);

  const categories = [
    'All',
    'Chartered Accounting Firm',
    'Tax & Regulatory Advisory',
    'Certified Implementation Partner',
    'Business Advisory & Strategy',
    'Internal Audit & Risk Firm',
  ];

  // Helper checks synchronized with computeFirmBadges tiered badge engine
  const isFirmTopRated = (firm: ProfessionalFirm) => {
    const r = firmAggregates[firm.id]?.rating ?? firm.rating;
    return Boolean(firm.isTopRated || r >= 4.88);
  };

  const isFirmFastResponder = (firm: ProfessionalFirm) => {
    return Boolean(firm.isFastResponder || firm.avgResponseTimeMinutes <= 30);
  };

  const isFirmVerifiedPartner = (firm: ProfessionalFirm) => {
    return firm.isVerified;
  };

  const isFirmPlatinumOrCore = (firm: ProfessionalFirm) => {
    return firm.partnerTier === 'Official Core Team' || firm.partnerTier === 'Platinum Partner';
  };

  const filteredFirms = useMemo(() => {
    const list = PROFESSIONAL_FIRMS.filter((firm) => {
      if (categoryFilter !== 'All' && firm.category !== categoryFilter) {
        return false;
      }
      if (badgeFilter === 'top_rated' && !isFirmTopRated(firm)) {
        return false;
      }
      if (badgeFilter === 'fast_responder' && !isFirmFastResponder(firm)) {
        return false;
      }
      if (badgeFilter === 'verified_partner' && !isFirmVerifiedPartner(firm)) {
        return false;
      }
      if (badgeFilter === 'platinum_core' && !isFirmPlatinumOrCore(firm)) {
        return false;
      }
      if (selectedCountry && selectedCountry !== 'All Countries' && selectedCountry !== 'UK / International') {
        const match = firm.countriesServed.some(c => c.toLowerCase().includes(selectedCountry.toLowerCase()));
        if (!match) return false;
      }
      if (searchFirmQuery.trim()) {
        const q = searchFirmQuery.toLowerCase();
        const matchName = firm.name.toLowerCase().includes(q) || firm.tagline.toLowerCase().includes(q);
        const matchSpec = firm.specializations.some(s => s.toLowerCase().includes(q));
        const matchCity = firm.city.toLowerCase().includes(q) || firm.location.toLowerCase().includes(q);
        if (!matchName && !matchSpec && !matchCity) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'fastest_response') {
        return a.avgResponseTimeMinutes - b.avgResponseTimeMinutes;
      }
      if (sortBy === 'rating') {
        const aRating = firmAggregates[a.id]?.rating ?? a.rating;
        const bRating = firmAggregates[b.id]?.rating ?? b.rating;
        const aReviews = firmAggregates[a.id]?.reviewCount ?? a.reviewCount;
        const bReviews = firmAggregates[b.id]?.reviewCount ?? b.reviewCount;
        return bRating - aRating || bReviews - aReviews;
      }
      if (sortBy === 'experience') {
        return b.yearsInPractice - a.yearsInPractice;
      }
      if (sortBy === 'reviews') {
        const aReviews = firmAggregates[a.id]?.reviewCount ?? a.reviewCount;
        const bReviews = firmAggregates[b.id]?.reviewCount ?? b.reviewCount;
        return bReviews - aReviews;
      }
      // 'featured'
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [categoryFilter, badgeFilter, selectedCountry, searchFirmQuery, sortBy, firmAggregates]);

  return (
    <section id="firms-directory" className="py-16 bg-white dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Verified Professional Firms & Consultant Directory
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
            Find the Right Professional for Your Business.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 font-normal">
            Discover qualified accounting firms, tax consultants, business advisers, implementation partners, and technology specialists across Africa.
          </p>
        </div>

        {/* Search, Filter & Sort Toolbar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by firm name, ICAN/ACCA specialization, city..."
                value={searchFirmQuery}
                onChange={(e) => setSearchFirmQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-[#0A1727] border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-[#0D1D31] focus:outline-none focus:ring-2 focus:ring-[#1464C8] text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            {/* Quick Filter: Fastest Response & Sort Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick Toggle: Fastest Response */}
              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'fastest_response' ? 'featured' : 'fastest_response')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  sortBy === 'fastest_response'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
                title="Sort firms by fastest average booking and inquiry response time"
              >
                <Zap className={`w-3.5 h-3.5 ${sortBy === 'fastest_response' ? 'fill-white text-white' : 'fill-current text-emerald-600 dark:text-emerald-400'}`} />
                <span>Fastest Response</span>
                {sortBy === 'fastest_response' ? (
                  <Check className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-extrabold ml-0.5">
                    &lt; 15m
                  </span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="relative inline-flex items-center">
                <div className="absolute left-3 pointer-events-none text-slate-400">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as FirmSortOption)}
                  className="pl-8 pr-8 py-2.5 text-xs font-bold bg-slate-50 dark:bg-[#0A1727] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1464C8] cursor-pointer appearance-none"
                  aria-label="Sort professional firms"
                >
                  <option value="featured">✨ Sort: Featured & Verified</option>
                  <option value="fastest_response">⚡ Sort: Fastest Response Turnaround</option>
                  <option value="rating">⭐ Sort: Highest Rating (5.0 → 4.0)</option>
                  <option value="reviews">👥 Sort: Most Client Reviews</option>
                  <option value="experience">🎓 Sort: Years in Practice</option>
                </select>
                <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Visual Performance Badges Quick Filter Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Award className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Performance Badges:</span>
            </span>

            <button
              type="button"
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'all'
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#0A1727] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Practices ({PROFESSIONAL_FIRMS.length})
            </button>

            <button
              type="button"
              onClick={() => setBadgeFilter(badgeFilter === 'top_rated' ? 'all' : 'top_rated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                badgeFilter === 'top_rated'
                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Top Rated (4.8+)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {PROFESSIONAL_FIRMS.filter(f => isFirmTopRated(f)).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBadgeFilter(badgeFilter === 'fast_responder' ? 'all' : 'fast_responder')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                badgeFilter === 'fast_responder'
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Fast Response (≤30m)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {PROFESSIONAL_FIRMS.filter(f => isFirmFastResponder(f)).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBadgeFilter(badgeFilter === 'verified_partner' ? 'all' : 'verified_partner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                badgeFilter === 'verified_partner'
                  ? 'bg-[#1464C8] text-white shadow-xs ring-2 ring-blue-400'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {PROFESSIONAL_FIRMS.filter(f => isFirmVerifiedPartner(f)).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBadgeFilter(badgeFilter === 'platinum_core' ? 'all' : 'platinum_core')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                badgeFilter === 'platinum_core'
                  ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Platinum & Core Tier</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {PROFESSIONAL_FIRMS.filter(f => isFirmPlatinumOrCore(f)).length}
              </span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#0A1727] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132842] border border-transparent dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Fastest Response Status Banner */}
          {sortBy === 'fastest_response' && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-600 text-white shrink-0">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </span>
                <span>
                  <strong>Fastest Response sorting active:</strong> Showing professional firms ordered by quickest inquiry turnaround time (from <strong>{filteredFirms[0]?.avgResponseTimeText || '~10 mins'}</strong> to ~2 hours).
                </span>
              </div>
              <button
                onClick={() => setSortBy('featured')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" /> Reset sort
              </button>
            </div>
          )}
        </div>

        {/* SKELETON LOADING STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 animate-pulse flex flex-col justify-between h-[360px]"
              >
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                  <div className="space-y-2 my-4">
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <div className="h-8 flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  <div className="h-8 flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Firms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 pt-2">
            {filteredFirms.map((firm) => {
              const primaryService =
                SERVICES_CATALOGUE.find(s => firm.servicesOfferedIds.includes(s.id)) ||
                SERVICES_CATALOGUE[0];
              const nextAvailableSlot = getNextAvailableSlotForFirm(firm);
              const directConsultWhatsappUrl = buildWhatsAppBookingUrl({
                providerName: firm.name,
                serviceName: primaryService?.title || `${firm.category} Consultation`,
                consultationType: firm.consultationModes[0] || 'Online Consultation',
                preferredDate: nextAvailableSlot
                  ? `${nextAvailableSlot.dateLabel} (${nextAvailableSlot.dateIso}) • ${nextAvailableSlot.slot}`
                  : 'Next Available Slot',
                location: `${firm.city}, ${firm.country}`,
                estimatedFee: firm.startingPrice,
                requirements: `Direct WhatsApp Consult request for ${firm.name} (${firm.partnerTier}).`,
              });

              return (
              <div
                key={firm.id}
                className={`relative bg-white dark:bg-[#0A1727] rounded-2xl border ${
                  sortBy === 'fastest_response' && firm.avgResponseTimeMinutes <= 30
                    ? 'border-emerald-400/80 dark:border-emerald-600/70 shadow-emerald-500/10'
                    : 'border-slate-200/90 dark:border-slate-800'
                } shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 pt-7 hover:border-[#1464C8]/50 dark:hover:border-[#1464C8]/70 group`}
              >
                {/* Floating Direct WhatsApp Consult Button */}
                <a
                  href={directConsultWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute -top-3.5 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-[11px] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all ring-2 ring-white dark:ring-[#0A1727] cursor-pointer"
                  title={`Start a Direct WhatsApp Consult with ${firm.name}`}
                  aria-label={`Direct WhatsApp Consult with ${firm.name}`}
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                  <span>Direct WhatsApp Consult</span>
                </a>
              <div>
                {/* Firm Card Header: Logo, Name & Tiered Small Badge Icons */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-xl ${firm.avatarBg} text-white font-black text-base flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                      {firm.logoText}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-black text-base text-[#102B4E] dark:text-white leading-snug group-hover:text-[#1464C8] dark:group-hover:text-[#B7E532] transition-colors">
                          {firm.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                        {firm.category}
                      </span>
                    </div>
                  </div>

                  {/* Small Icons Representing Tiered Badges */}
                  <FirmBadgeIconsCluster
                    firm={firm}
                    liveRating={firmAggregates[firm.id]?.rating}
                    liveReviewCount={firmAggregates[firm.id]?.reviewCount}
                  />
                </div>

                {/* Tiered Badges Row: Partner Tier, Verified, Top Rated, Fast Response */}
                <FirmTierBadgesBar
                  firm={firm}
                  liveRating={firmAggregates[firm.id]?.rating}
                  liveReviewCount={firmAggregates[firm.id]?.reviewCount}
                  onOpenReviews={() => setReviewModalFirm(firm)}
                />

                {/* Tagline / Bio snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {firm.tagline}
                </p>

                {/* Metadata details */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {/* Response Turnaround Indicator */}
                  <div className={`flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                    sortBy === 'fastest_response'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200/60 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-[#071321] text-slate-600 dark:text-slate-300'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${
                        sortBy === 'fastest_response'
                          ? 'text-emerald-600 dark:text-emerald-400 fill-current'
                          : 'text-emerald-600 dark:text-emerald-400'
                      } shrink-0`} />
                      <span className="text-[11px]">Avg Response Time:</span>
                    </div>
                    <span className={`font-extrabold text-[11px] ${
                      sortBy === 'fastest_response'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-[#102B4E] dark:text-white'
                    }`}>
                      {firm.avgResponseTimeText}
                    </span>
                  </div>

                  {/* Live Next Available Slot Indicator */}
                  {(() => {
                    const nextSlot = getNextAvailableSlotForFirm(firm);
                    return (
                      <button
                        type="button"
                        onClick={() => setSelectedFirmModal(firm)}
                        className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 transition-colors cursor-pointer"
                        title="Open profile to view full Live Availability calendar & open time slots"
                      >
                        <span className="flex items-center gap-1.5 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span>Live Availability:</span>
                        </span>
                        <span className="text-[11px] font-black truncate">
                          {nextSlot ? `${nextSlot.dateLabel} • ${nextSlot.slot.split(' - ')[0]}` : 'View Calendar'}
                        </span>
                      </button>
                    );
                  })()}

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{firm.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{firm.yearsInPractice} Years Experience • {firm.teamSize}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Modes: {firm.consultationModes.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                {/* Specializations Pills */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {firm.specializations.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-100 dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-transparent dark:border-slate-800">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Starting from</span>
                  <span className="font-extrabold text-[#102B4E] dark:text-white">{formatPriceString(firm.startingPrice)}</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSelectedFirmModal(firm)}
                    className="py-2 px-2 text-[11px] font-bold text-[#102B4E] dark:text-slate-200 bg-slate-100 dark:bg-[#0D1D31] hover:bg-slate-200 dark:hover:bg-[#132842] rounded-xl transition-colors cursor-pointer text-center border border-transparent dark:border-slate-800"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setReviewModalFirm(firm)}
                    className="py-2 px-2 text-[11px] font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl transition-colors cursor-pointer text-center border border-amber-200/60 dark:border-amber-800/50 flex items-center justify-center gap-1"
                    title="View reviews and rate firm"
                  >
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                    Reviews
                  </button>
                  <button
                    onClick={() => {
                      const matchedService = SERVICES_CATALOGUE.find(s => firm.servicesOfferedIds.includes(s.id)) || SERVICES_CATALOGUE[0];
                      onBookWithFirm(matchedService, firm);
                    }}
                    className="py-2 px-2 text-[11px] font-bold text-white bg-[#1464C8] hover:bg-[#1052a5] rounded-xl shadow-xs transition-colors cursor-pointer text-center truncate"
                  >
                    Book
                  </button>
                </div>

                {/* WhatsApp Chat with this Firm */}
                <a
                  href={buildWhatsAppBookingUrl({
                    providerName: firm.name,
                    location: `${firm.city}, ${firm.country}`,
                    serviceName: 'General Consultation & Scope Review',
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 text-xs font-bold text-[#102B4E] bg-[#B7E532]/80 hover:bg-[#B7E532] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>
              );
            })}
        </div>
      )}

      </div>

      {/* FIRM PROFILE DETAIL MODAL */}
      {selectedFirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col text-slate-800 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-blue-300 text-xs font-bold rounded-md">
                  {selectedFirmModal.partnerTier}
                </span>

                {selectedFirmModal.isTopRated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold text-xs border border-amber-200/80 dark:border-amber-800/60">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Top Rated
                  </span>
                )}

                {(selectedFirmModal.isFastResponder || selectedFirmModal.avgResponseTimeMinutes <= 30) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800/60">
                    <Zap className="w-3 h-3 fill-current text-emerald-600 dark:text-emerald-400" /> Fastest Response
                  </span>
                )}

                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Practice
                </span>
              </div>

              <button
                onClick={() => setSelectedFirmModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 bg-white dark:bg-[#08121E]">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl ${selectedFirmModal.avatarBg} text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0`}>
                  {selectedFirmModal.logoText}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#102B4E] dark:text-white">
                    {selectedFirmModal.name}
                  </h3>
                  <p className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] mt-0.5">
                    {selectedFirmModal.category}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedFirmModal.location}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-amber-500 font-bold flex items-center">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> {(firmAggregates[selectedFirmModal.id]?.rating ?? selectedFirmModal.rating).toFixed(1)}
                    </span>
                    <span className="text-slate-400">({firmAggregates[selectedFirmModal.id]?.reviewCount ?? selectedFirmModal.reviewCount} verified client reviews)</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedFirmModal.yearsInPractice} Years in Practice</span>
                  </div>
                </div>
              </div>

              {/* Tiered Badge Breakdown */}
              <FirmTierShowcase
                firm={selectedFirmModal}
                liveRating={firmAggregates[selectedFirmModal.id]?.rating}
                liveReviewCount={firmAggregates[selectedFirmModal.id]?.reviewCount}
              />

              {/* Live Availability Calendar View */}
              <FirmAvailabilityCalendar
                firm={selectedFirmModal}
                onSelectSlotAndBook={(dateIso, slot) => {
                  const matchedService =
                    SERVICES_CATALOGUE.find(s =>
                      selectedFirmModal.servicesOfferedIds.includes(s.id)
                    ) || SERVICES_CATALOGUE[0];
                  const targetFirm = selectedFirmModal;
                  setSelectedFirmModal(null);
                  onBookWithFirm(matchedService, targetFirm, dateIso, slot);
                }}
              />

              {/* Bio & Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Firm Overview & Background
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {selectedFirmModal.bio}
                </p>
              </div>

              {/* Verified Accreditations */}
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1464C8] dark:text-blue-300 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Validated Licenses & Accreditations
                </h4>
                <ul className="space-y-1.5">
                  {selectedFirmModal.accreditations.map((acc, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specializations & Consultation Modes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Core Specializations
                  </h4>
                  <ul className="space-y-1">
                    {selectedFirmModal.specializations.map((spec, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Consultation & Availability
                  </h4>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Avg Response Turnaround: <strong>{selectedFirmModal.avgResponseTimeText}</strong></span>
                    </div>
                    <div>Modes: <strong>{selectedFirmModal.consultationModes.join(', ')}</strong></div>
                    <div>Languages: <strong>{selectedFirmModal.languages.join(', ')}</strong></div>
                    <div>Active Days: <strong>{selectedFirmModal.availableSlotDays.join(', ')}</strong></div>
                  </div>
                </div>
              </div>

              {/* Client Reviews & Rating Section embedded directly */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <FirmReviewSystem inline={true} firm={selectedFirmModal} />
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-[#060F1A] px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Indicative Pricing</span>
                <span className="text-lg font-black text-[#102B4E] dark:text-white">{formatPriceString(selectedFirmModal.startingPrice)}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={buildWhatsAppBookingUrl({
                    providerName: selectedFirmModal.name,
                    location: `${selectedFirmModal.city}, ${selectedFirmModal.country}`,
                    serviceName: 'Professional Engagement Inquiry',
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                  <span>WhatsApp Firm</span>
                </a>

                <button
                  onClick={() => {
                    const matchedService = SERVICES_CATALOGUE.find(s => selectedFirmModal.servicesOfferedIds.includes(s.id)) || SERVICES_CATALOGUE[0];
                    setSelectedFirmModal(null);
                    onBookWithFirm(matchedService, selectedFirmModal);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Standalone Review Modal */}
      {reviewModalFirm && (
        <FirmReviewSystem
          isOpen={true}
          onClose={() => setReviewModalFirm(null)}
          firm={reviewModalFirm}
        />
      )}

    </section>
  );
};
