import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Clock, 
  Globe2, 
  Wifi, 
  Check, 
  X, 
  ChevronRight, 
  Phone, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  Building2,
  Calendar,
  Scale,
  ArrowRight,
  Bookmark,
  Coins,
  Award,
  Store,
  QrCode,
  LocateFixed,
  Loader2,
  Heart,
  Navigation,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Partner, FilterState, PartnerLevel, AvailabilityStatus, SuccessStoryScale } from '../types';
import { PARTNERS_DATA, COUNTRIES_LIST, PARTNER_TYPES, INDUSTRIES_LIST, PARTNER_LEVELS_INFO, AVAILABILITY_STATUSES, SUCCESS_STORY_SCALES, getCitiesForCountry } from '../data/partnersData';
import { PartnerCard } from './PartnerCard';
import { QuickFilterChips, QUICK_FILTER_TAGS } from './QuickFilterChips';
import { SavedFilterShortcuts } from './SavedFilterShortcuts';
import { MobileFilterSheet } from './MobileFilterSheet';
import { CurrencyToggle } from './CurrencyToggle';
import { useCurrency } from '../context/CurrencyContext';
import { RecommendedPartnersSection } from './RecommendedPartnersSection';
import { LocationPricingBanner } from './LocationPricingBanner';
import { useGeolocationFilter } from '../hooks/useGeolocationFilter';
import { CITY_GEO_COORDINATES, formatDistanceKm } from '../utils/geoCoordinates';
import {
  filterAndSortPartners,
  SmartSortMode,
  calculateSuccessImpactScore,
  getPartnerDistanceKm,
} from '../utils/partnerFiltering';

interface DirectorySectionProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onApplyFilters?: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  onSelectPartner: (partner: Partner) => void;
  onContactPartner: (partner: Partner) => void;
  onRequestConsultation: (partner: Partner) => void;
  selectedComparePartners?: Partner[];
  onToggleComparePartner?: (partner: Partner) => void;
  onOpenComparisonModal?: () => void;
  onOpenQrBadge?: (partner: Partner) => void;
  onOpenQRScanner?: () => void;
  onAskQuestion?: (partner: Partner) => void;
  onFilteredPartnersChange?: (partners: Partner[], isFiltered: boolean) => void;
}

export const DirectorySection: React.FC<DirectorySectionProps> = ({
  filters,
  onUpdateFilters,
  onApplyFilters,
  onResetFilters,
  onSelectPartner,
  onContactPartner,
  onRequestConsultation,
  selectedComparePartners = [],
  onToggleComparePartner,
  onOpenComparisonModal,
  onOpenQrBadge,
  onOpenQRScanner,
  onAskQuestion,
  onFilteredPartnersChange,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isSorting, setIsSorting] = useState(false);
  const [favoritePartnerIds, setFavoritePartnerIds] = useState<string[]>([]);
  const [viewFavoritesOnly, setViewFavoritesOnly] = useState(false);
  const [smartSortEnabled, setSmartSortEnabled] = useState(false);
  const [smartSortMode, setSmartSortMode] = useState<SmartSortMode>('distance');
  const [smartSortGeoAttempted, setSmartSortGeoAttempted] = useState(false);
  const { currentCurrency } = useCurrency();

  const handleToggleFavorite = (partner: Partner) => {
    setFavoritePartnerIds((prev) =>
      prev.includes(partner.id)
        ? prev.filter((id) => id !== partner.id)
        : [...prev, partner.id]
    );
  };

  const {
    isLocating: isGeoLocating,
    geoError,
    detectedResult: geoDetectedResult,
    timezoneFallback,
    locateNearMe,
    detectCoordinatesSilently,
    clearGeoStatus,
    setGeoError,
  } = useGeolocationFilter();

  const activeLocationContext = useMemo(() => {
    if (geoDetectedResult) {
      return {
        coords: geoDetectedResult.coords,
        label: `${geoDetectedResult.countryFlag} ${geoDetectedResult.city}, ${geoDetectedResult.country}`,
        source: 'gps' as const,
      };
    }
    const fallbackCoord =
      CITY_GEO_COORDINATES[timezoneFallback.city] ||
      CITY_GEO_COORDINATES['Lagos'];
    return {
      coords: { lat: fallbackCoord.lat, lng: fallbackCoord.lng },
      label: `${timezoneFallback.countryFlag} ${timezoneFallback.city}, ${timezoneFallback.country}`,
      source: 'timezone' as const,
    };
  }, [geoDetectedResult, timezoneFallback]);

  const handleToggleSmartSort = () => {
    const nextEnabled = !smartSortEnabled;
    setIsSorting(true);
    setSmartSortEnabled(nextEnabled);
    if (nextEnabled && !geoDetectedResult && !smartSortGeoAttempted) {
      setSmartSortGeoAttempted(true);
      detectCoordinatesSilently();
    }
    setTimeout(() => {
      setIsSorting(false);
    }, 600);
  };

  const handleSelectSmartSortMode = (mode: SmartSortMode) => {
    setIsSorting(true);
    if (!smartSortEnabled) {
      setSmartSortEnabled(true);
      if (!geoDetectedResult && !smartSortGeoAttempted) {
        setSmartSortGeoAttempted(true);
        detectCoordinatesSilently();
      }
    }
    setSmartSortMode(mode);
    setTimeout(() => {
      setIsSorting(false);
    }, 600);
  };

  const handleFindNearMe = () => {
    locateNearMe((result) => {
      onUpdateFilters({
        country: result.country,
        city: result.city,
      });
    });
  };

  const availableDirectoryCities = useMemo(() => {
    return getCitiesForCountry(filters.country);
  }, [filters.country]);

  const handleCountryFilterChange = (country: string) => {
    const validCities = getCitiesForCountry(country);
    const shouldResetCity = filters.city && !validCities.includes(filters.city);
    onUpdateFilters({
      country,
      ...(shouldResetCity ? { city: '' } : {})
    });
  };

  const handleSortChange = (newSort: any) => {
    setIsSorting(true);
    setSmartSortEnabled(false);
    onUpdateFilters({ sortBy: newSort });
    setTimeout(() => {
      setIsSorting(false);
    }, 700);
  };

  // Available unique services from data
  const availableServices = [
    'Implementation',
    'Training',
    'Accounting Setup',
    'POS Setup',
    'Inventory Setup',
    'Business Consulting',
    'Data Migration',
    'Tax Support',
    'Multi-Branch Setup',
    'Payroll Setup',
    'Hardware Supply & Maintenance',
    'Configuration',
    'Integration'
  ];

  // Available unique skills & specialties from partner registry data
  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    PARTNERS_DATA.forEach((p) => {
      p.specialties.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, []);

  const handleSkillClick = (skillName: string) => {
    if (filters.skill?.toLowerCase() === skillName.toLowerCase()) {
      onUpdateFilters({ skill: '' });
    } else {
      onUpdateFilters({ skill: skillName });
    }
  };

  const availableLanguages = ['English', 'French', 'Arabic', 'Portuguese', 'Swahili', 'Yoruba', 'Amharic', 'Hindi'];
  const businessSizes = ['Micro', 'Small', 'Medium', 'Enterprise'];

  // Filter computation
  const filteredPartners = useMemo(() => {
    return filterAndSortPartners(PARTNERS_DATA, filters, {
      viewFavoritesOnly,
      favoritePartnerIds,
      smartSort: {
        enabled: smartSortEnabled,
        mode: smartSortMode,
        userCoords: activeLocationContext.coords,
      },
    });
  }, [filters, viewFavoritesOnly, favoritePartnerIds, smartSortEnabled, smartSortMode, activeLocationContext.coords]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (viewFavoritesOnly) count++;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.partnerType) count++;
    if (filters.industry) count++;
    if (filters.service) count++;
    if (filters.skill) count++;
    if (filters.level) count++;
    if (filters.language) count++;
    if (filters.businessSize) count++;
    if (filters.remoteOnly) count++;
    if (filters.verifiedOnly && (!filters.quickFilters || !filters.quickFilters.includes('verified-only'))) {
      count++;
    }
    if (filters.availability) count++;
    if (filters.successStoryScale) count++;
    if (filters.quickFilters && filters.quickFilters.length > 0) {
      count += filters.quickFilters.length;
    }
    return count;
  }, [filters, viewFavoritesOnly]);

  useEffect(() => {
    const isFiltered = activeFiltersCount > 0 || Boolean(filters.search?.trim());
    onFilteredPartnersChange?.(filteredPartners, isFiltered);
  }, [filteredPartners, activeFiltersCount, filters.search, onFilteredPartnersChange]);

  // Generate a distinct filter signature so partner cards trigger their entrance animation on filter updates
  const filterSignature = useMemo(() => {
    return [
      smartSortEnabled ? `smart:${smartSortMode}:${activeLocationContext.coords.lat.toFixed(2)},${activeLocationContext.coords.lng.toFixed(2)}` : 'smart:off',
      viewFavoritesOnly ? `fav:${favoritePartnerIds.join(',')}` : 'fav:off',
      filters.search?.trim().toLowerCase() || '',
      filters.country || '',
      filters.city?.trim().toLowerCase() || '',
      filters.partnerType || '',
      filters.industry || '',
      filters.service || '',
      filters.skill || '',
      filters.level || '',
      filters.language || '',
      filters.businessSize || '',
      filters.remoteOnly ? '1' : '0',
      filters.verifiedOnly ? '1' : '0',
      filters.availability || '',
      filters.sortBy || '',
      filters.successStoryScale || '',
      (filters.quickFilters || []).slice().sort().join(','),
    ].join('::');
  }, [filters, viewFavoritesOnly, favoritePartnerIds, smartSortEnabled, smartSortMode, activeLocationContext.coords]);

  const displayedPartners = filteredPartners.slice(0, itemsPerPage);

  const getLevelBadge = (level: PartnerLevel) => {
    switch (level) {
      case 'Platinum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-900/90 text-lime-300 border border-lime-400/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-lime-400" />
            Platinum Partner (40%)
          </span>
        );
      case 'Gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-900/30 text-amber-300 border border-amber-500/40">
            Gold Partner (30%)
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-600">
            Silver Partner (20%)
          </span>
        );
      case 'Bronze':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-800 text-stone-300 border border-stone-600">
            Bronze Partner (15%)
          </span>
        );
    }
  };

  return (
    <section id="directory" className="py-16 bg-slate-100/60 dark:bg-[#091b34] text-slate-900 dark:text-white relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-500/10 border border-lime-300 dark:border-lime-500/30 text-lime-700 dark:text-lime-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Certified Partner Directory & Marketplace</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find the Right MsmeBooks Partner
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Browse verified implementation firms, accounting practices, and POS agents tailored to your industry, geographic market, and business model.
            </p>
          </div>

          {/* Quick Partner Level Explainer Pill Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tiers:</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-lime-400 font-bold border border-blue-200 dark:border-lime-500/30">Platinum 40%</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-500/30">Gold 30%</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-transparent">Silver 20%</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium border border-stone-200 dark:border-transparent">Bronze 15%</span>
          </div>
        </div>

        {/* Local Storage Saved Filter Shortcuts */}
        <SavedFilterShortcuts
          currentFilters={filters}
          onApplyPreset={(presetFilters) => {
            if (onApplyFilters) {
              onApplyFilters(presetFilters);
            } else {
              onUpdateFilters(presetFilters);
            }
          }}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Search & Main Bar */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-8 shadow-md dark:shadow-xl transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Direct Keyword Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onUpdateFilters({ search: e.target.value })}
                placeholder="Search by partner name, service, industry or location (e.g. Lagos, POS, Retail, Tax)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              />
              {filters.search && (
                <button
                  onClick={() => onUpdateFilters({ search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                <ArrowUpDown className={`w-3.5 h-3.5 text-lime-600 dark:text-lime-400 transition-transform duration-300 ${isSorting ? 'rotate-180 text-lime-500' : ''}`} />
                Sort By:
              </span>
              <select
                id="select-partner-sort-by"
                data-testid="select-partner-sort-by"
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 w-full md:w-auto transition-all ${
                  isSorting
                    ? 'border-lime-500/80 ring-2 ring-lime-500/30'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <option value="recommended">Recommended (Platinum First)</option>
                <option value="rating">Highest Rated</option>
                <option value="businesses">Most Businesses Supported</option>
                <option value="experience">Years of Experience (Most Seasoned)</option>
              </select>

              {/* Visual reordering feedback pill */}
              <AnimatePresence>
                {isSorting && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -4 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -4 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-lime-600 dark:text-lime-400 bg-lime-500/15 border border-lime-500/30 px-2 py-0.5 rounded-full shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping"></span>
                    Reordering...
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Find Partners Near Me (Geolocation API) */}
              <button
                type="button"
                id="btn-directory-find-near-me"
                data-testid="btn-directory-find-near-me"
                onClick={handleFindNearMe}
                disabled={isGeoLocating}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-lime-500/15 dark:hover:bg-lime-500/25 text-white dark:text-lime-300 border border-slate-700 dark:border-lime-500/40 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 active:scale-98 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                title="Automatically set Country and City filters using your browser's current location coordinates"
                aria-label="Find partners near me"
              >
                {isGeoLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
                ) : (
                  <LocateFixed className="w-4 h-4 text-lime-400" />
                )}
                <span className="hidden xl:inline">{isGeoLocating ? 'Detecting...' : 'Find partners near me'}</span>
                <span className="xl:hidden">{isGeoLocating ? 'Locating...' : 'Near me'}</span>
              </button>

              {/* Scan Physical Badge Button */}
              {onOpenQRScanner && (
                <button
                  type="button"
                  id="btn-directory-scan-badge"
                  data-testid="btn-directory-scan-badge"
                  onClick={onOpenQRScanner}
                  className="flex items-center gap-1.5 px-3 py-2 bg-lime-500/10 hover:bg-lime-500/20 text-lime-700 dark:text-lime-400 border border-lime-500/30 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 active:scale-98"
                  title="Scan a partner's physical business card or badge to automatically open their full digital profile"
                  aria-label="Scan Partner Badge"
                >
                  <QrCode className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span className="hidden sm:inline">Scan Badge</span>
                  <span className="sm:hidden">Scan</span>
                </button>
              )}

              {/* Mobile Filter Drawer Toggle Button */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>
            </div>

          </div>

          {/* Quick Availability Status Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-1">
              Availability:
            </span>

            <button
              type="button"
              onClick={() => onUpdateFilters({ availability: '' })}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                !filters.availability
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All ({PARTNERS_DATA.length})
            </button>

            <button
              type="button"
              onClick={() => onUpdateFilters({ availability: filters.availability === 'Accepting New Clients' ? '' : 'Accepting New Clients' })}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filters.availability === 'Accepting New Clients'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Accepting New Clients ({PARTNERS_DATA.filter(p => p.availabilityStatus === 'Accepting New Clients').length})</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateFilters({ availability: filters.availability === 'Currently Booked' ? '' : 'Currently Booked' })}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filters.availability === 'Currently Booked'
                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>Currently Booked ({PARTNERS_DATA.filter(p => p.availabilityStatus === 'Currently Booked').length})</span>
            </button>

            <div className="sm:ml-auto flex items-center">
              <button
                type="button"
                id="btn-view-my-favorites"
                data-testid="btn-view-my-favorites"
                aria-pressed={viewFavoritesOnly}
                onClick={() => setViewFavoritesOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  viewFavoritesOnly
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-sm ring-2 ring-rose-400/50'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                }`}
                title="Toggle to view only your favorited partners"
              >
                <Heart className={`w-3.5 h-3.5 ${viewFavoritesOnly || favoritePartnerIds.length > 0 ? 'fill-current' : ''}`} />
                <span>View My Favorites</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    viewFavoritesOnly
                      ? 'bg-white/25 text-white'
                      : 'bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {favoritePartnerIds.length}
                </span>
              </button>
            </div>
          </div>

          {/* Smart Sort Toggle & Ranking Mode Switcher (Distance vs. Verified Success Impact) */}
          <div
            id="directory-smart-sort-bar"
            data-testid="directory-smart-sort-bar"
            className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={smartSortEnabled}
                id="btn-smart-sort-toggle"
                data-testid="btn-smart-sort-toggle"
                onClick={handleToggleSmartSort}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                  smartSortEnabled
                    ? 'bg-slate-900 dark:bg-lime-500 text-white dark:text-slate-950 border-slate-900 dark:border-lime-400 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
                title="Toggle Smart Sort to rank partners by proximity to your location or verified Success Impact score"
              >
                <Zap className={`w-3.5 h-3.5 ${smartSortEnabled ? 'text-lime-400 dark:text-slate-950 fill-current' : 'text-lime-600 dark:text-lime-400'}`} />
                <span>Smart Sort</span>
                <span
                  className={`inline-flex items-center w-7 h-4 rounded-full p-0.5 transition-colors ${
                    smartSortEnabled
                      ? 'bg-lime-500 dark:bg-slate-950/25 justify-end'
                      : 'bg-slate-300 dark:bg-slate-600 justify-start'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white shadow-2xs" />
                </span>
              </button>

              <div
                role="group"
                aria-label="Smart Sort Ranking Mode"
                className={`inline-flex items-center p-0.5 rounded-xl border transition-opacity ${
                  smartSortEnabled
                    ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 opacity-100'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 opacity-80'
                }`}
              >
                <button
                  type="button"
                  id="btn-smart-sort-distance"
                  data-testid="btn-smart-sort-distance"
                  aria-pressed={smartSortEnabled && smartSortMode === 'distance'}
                  onClick={() => handleSelectSmartSortMode('distance')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    smartSortEnabled && smartSortMode === 'distance'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  <span>Proximity (Distance)</span>
                </button>

                <button
                  type="button"
                  id="btn-smart-sort-impact"
                  data-testid="btn-smart-sort-impact"
                  aria-pressed={smartSortEnabled && smartSortMode === 'impact'}
                  onClick={() => handleSelectSmartSortMode('impact')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    smartSortEnabled && smartSortMode === 'impact'
                      ? 'bg-white dark:bg-slate-900 text-lime-700 dark:text-lime-300 shadow-xs ring-1 ring-lime-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Success Impact</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              {smartSortEnabled ? (
                smartSortMode === 'distance' ? (
                  <>
                    <span>
                      Prioritizing partners nearest to <strong className="text-slate-800 dark:text-slate-200">{activeLocationContext.label}</strong>
                      {' '}({activeLocationContext.source === 'gps' ? 'GPS' : 'Timezone'})
                    </span>
                    {activeLocationContext.source !== 'gps' && (
                      <button
                        type="button"
                        id="btn-smart-sort-refresh-gps"
                        data-testid="btn-smart-sort-refresh-gps"
                        onClick={() => locateNearMe(() => {})}
                        disabled={isGeoLocating}
                        className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer disabled:opacity-60"
                      >
                        <LocateFixed className="w-3 h-3" />
                        <span>{isGeoLocating ? 'Locating...' : 'Use exact GPS'}</span>
                      </button>
                    )}
                  </>
                ) : (
                  <span>
                    Prioritizing partners by verified <strong className="text-slate-800 dark:text-slate-200">Success Impact</strong> score (clients, projects &amp; accreditation)
                  </span>
                )
              ) : (
                <span>
                  Enable Smart Sort to rank by proximity to {activeLocationContext.label} or verified Success Impact
                </span>
              )}
            </div>
          </div>

          {/* Success Stories Implementation Scale Filter Strip */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Success Stories:</span>
            </span>

            <button
              type="button"
              id="filter-success-scale-all"
              data-testid="filter-success-scale-all"
              onClick={() => onUpdateFilters({ successStoryScale: '' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                !filters.successStoryScale
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Scales ({PARTNERS_DATA.length})
            </button>

            {SUCCESS_STORY_SCALES.map((scaleConfig) => {
              const isSelected = filters.successStoryScale === scaleConfig.id;
              const matchingCount = PARTNERS_DATA.filter(
                (p) => p.clientSuccessStories && p.clientSuccessStories.some((s) => s.implementationScale === scaleConfig.id)
              ).length;

              const IconComp = scaleConfig.id === 'Large-Scale Enterprise'
                ? Building2
                : scaleConfig.id === 'Mid-Market'
                ? Layers
                : Store;

              let activeStyle = 'bg-lime-500 text-slate-950 shadow-sm ring-2 ring-lime-400/50';
              let inactiveStyle = 'bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700';

              if (scaleConfig.id === 'Large-Scale Enterprise') {
                activeStyle = 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/50';
                inactiveStyle = 'bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60';
              } else if (scaleConfig.id === 'Mid-Market') {
                activeStyle = 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50';
                inactiveStyle = 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60';
              } else if (scaleConfig.id === 'Small Business') {
                activeStyle = 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50';
                inactiveStyle = 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60';
              }

              return (
                <button
                  key={scaleConfig.id}
                  type="button"
                  id={`filter-scale-${scaleConfig.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  data-testid={`filter-scale-${scaleConfig.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onUpdateFilters({ successStoryScale: isSelected ? '' : scaleConfig.id })}
                  title={scaleConfig.description}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected ? activeStyle : inactiveStyle
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{scaleConfig.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {matchingCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filters Tag Pills */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Active filters:</span>

              {viewFavoritesOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-semibold">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>My Favorites ({favoritePartnerIds.length})</span>
                  <button onClick={() => setViewFavoritesOnly(false)} aria-label="Remove favorites filter"><X className="w-3 h-3" /></button>
                </span>
              )}
              
              {filters.country && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Country: {filters.country}
                  <button onClick={() => onUpdateFilters({ country: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.city && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  City: {filters.city}
                  <button onClick={() => onUpdateFilters({ city: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.partnerType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Type: {filters.partnerType}
                  <button onClick={() => onUpdateFilters({ partnerType: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.industry && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Industry: {filters.industry}
                  <button onClick={() => onUpdateFilters({ industry: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.service && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Service: {filters.service}
                  <button onClick={() => onUpdateFilters({ service: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.level && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Level: {filters.level}
                  <button onClick={() => onUpdateFilters({ level: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.remoteOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Remote Support Only
                  <button onClick={() => onUpdateFilters({ remoteOnly: false })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold">
                  Verified Only
                  <button onClick={() => {
                    const currentQuick = filters.quickFilters || [];
                    onUpdateFilters({
                      verifiedOnly: false,
                      quickFilters: currentQuick.filter((t) => t !== 'verified-only'),
                    });
                  }}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.availability && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30 font-semibold">
                  Availability: {filters.availability}
                  <button onClick={() => onUpdateFilters({ availability: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              {filters.successStoryScale && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-semibold">
                  Success Story: {filters.successStoryScale}
                  <button onClick={() => onUpdateFilters({ successStoryScale: '' })}><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={() => {
                  clearGeoStatus();
                  setViewFavoritesOnly(false);
                  onResetFilters();
                }}
                className="text-xs text-red-400 hover:text-red-300 font-semibold underline ml-auto"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Geolocation Detection Feedback & Error Banner */}
          {(geoError || (geoDetectedResult && filters.country === geoDetectedResult.country && filters.city === geoDetectedResult.city)) && (
            <div
              id="directory-geolocation-banner"
              data-testid="directory-geolocation-banner"
              className={`mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 ${
                geoError ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {geoError ? (
                <>
                  <div className="flex items-center gap-2">
                    <LocateFixed className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{geoError}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGeoError(null);
                        onUpdateFilters({
                          country: timezoneFallback.country,
                          city: timezoneFallback.city,
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 font-bold text-amber-800 dark:text-amber-200 transition-colors cursor-pointer"
                    >
                      Use {timezoneFallback.countryFlag} {timezoneFallback.city}, {timezoneFallback.country}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeoError(null)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Dismiss location error"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : geoDetectedResult ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-bold">
                      <LocateFixed className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        Detected Location: {geoDetectedResult.countryFlag} {geoDetectedResult.city}, {geoDetectedResult.country}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      ({formatDistanceKm(geoDetectedResult.distanceKm)} from city center
                      {geoDetectedResult.nearestPartner
                        ? ` • Closest firm: ${geoDetectedResult.nearestPartner.name} in ${geoDetectedResult.nearestPartner.city}`
                        : ''}
                      )
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearGeoStatus}
                    className="text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline cursor-pointer"
                  >
                    Dismiss notice
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Main Content Layout: Sticky Sidebar Filter + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-md dark:shadow-xl space-y-6 lg:sticky lg:top-24 transition-colors duration-300">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Filter className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>Smart Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    clearGeoStatus();
                    setViewFavoritesOnly(false);
                    onResetFilters();
                  }}
                  className="text-xs text-lime-600 dark:text-lime-400 hover:underline font-semibold"
                >
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Toggles: View My Favorites, Verified & Remote Support */}
            <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 text-rose-500 ${viewFavoritesOnly || favoritePartnerIds.length > 0 ? 'fill-rose-500' : ''}`} />
                  <span>View My Favorites ({favoritePartnerIds.length})</span>
                </span>
                <input
                  type="checkbox"
                  id="sidebar-filter-favorites-only"
                  data-testid="sidebar-filter-favorites-only"
                  checked={viewFavoritesOnly}
                  onChange={(e) => setViewFavoritesOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 accent-rose-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  Verified Partners Only
                </span>
                <input
                  type="checkbox"
                  id="filter-verified-only"
                  checked={filters.verifiedOnly}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const current = filters.quickFilters || [];
                    const next = isChecked
                      ? (current.includes('verified-only') ? current : [...current, 'verified-only'])
                      : current.filter((id) => id !== 'verified-only');
                    onUpdateFilters({ verifiedOnly: isChecked, quickFilters: next });
                  }}
                  className="w-4 h-4 rounded text-lime-500 focus:ring-lime-400 accent-lime-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Remote Support Available
                </span>
                <input
                  type="checkbox"
                  checked={filters.remoteOnly}
                  onChange={(e) => onUpdateFilters({ remoteOnly: e.target.checked })}
                  className="w-4 h-4 rounded text-lime-500 focus:ring-lime-400 accent-lime-500"
                />
              </label>
            </div>

            {/* Availability Status Filter */}
            <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Client Availability
                </label>
                {filters.availability && (
                  <button 
                    onClick={() => onUpdateFilters({ availability: '' })}
                    className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-1.5">
                {[
                  { id: '', label: 'All Availabilities', count: PARTNERS_DATA.length, dot: null },
                  { id: 'Accepting New Clients', label: 'Accepting New Clients', count: PARTNERS_DATA.filter(p => p.availabilityStatus === 'Accepting New Clients').length, dot: 'bg-emerald-500' },
                  { id: 'Currently Booked', label: 'Currently Booked', count: PARTNERS_DATA.filter(p => p.availabilityStatus === 'Currently Booked').length, dot: 'bg-rose-500' },
                ].map((item) => {
                  const isSelected = (!filters.availability && item.id === '') || filters.availability === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onUpdateFilters({ availability: item.id })}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all text-left ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.dot && (
                          <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`}></span>
                        )}
                        <span>{item.label}</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-slate-950/20 text-slate-950 font-bold'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Success Stories Implementation Scale Filter */}
            <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Success Stories Scale</span>
                </label>
                {filters.successStoryScale && (
                  <button 
                    onClick={() => onUpdateFilters({ successStoryScale: '' })}
                    className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Filter by verified track record in enterprise, mid-market, or SME projects.
              </p>
              
              <div className="space-y-1.5">
                {[
                  { id: '', label: 'All Success Stories', count: PARTNERS_DATA.length, icon: Award, color: 'text-slate-400' },
                  ...SUCCESS_STORY_SCALES.map((s) => ({
                    id: s.id,
                    label: s.label,
                    count: PARTNERS_DATA.filter((p) => p.clientSuccessStories && p.clientSuccessStories.some((story) => story.implementationScale === s.id)).length,
                    icon: s.id === 'Large-Scale Enterprise' ? Building2 : s.id === 'Mid-Market' ? Layers : Store,
                    color: s.id === 'Large-Scale Enterprise' ? 'text-purple-500' : s.id === 'Mid-Market' ? 'text-blue-500' : 'text-emerald-500',
                  }))
                ].map((item) => {
                  const isSelected = (!filters.successStoryScale && item.id === '') || filters.successStoryScale === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`sidebar-scale-${item.id ? item.id.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'all'}`}
                      data-testid={`sidebar-scale-${item.id ? item.id.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'all'}`}
                      onClick={() => onUpdateFilters({ successStoryScale: item.id })}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all text-left ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : item.color}`} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-slate-950/20 text-slate-950 font-bold'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Shortcut: Find Partners Near Me */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Your Location</span>
                </span>
                {geoDetectedResult && filters.country === geoDetectedResult.country && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {geoDetectedResult.countryFlag} Auto-set
                  </span>
                )}
              </div>
              <button
                type="button"
                id="btn-sidebar-find-near-me"
                data-testid="btn-sidebar-find-near-me"
                onClick={handleFindNearMe}
                disabled={isGeoLocating}
                className="w-full py-2 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                title="Use browser Geolocation API to set Country and City filters automatically"
              >
                {isGeoLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5 text-slate-950" />
                )}
                <span>{isGeoLocating ? 'Detecting Coordinates...' : 'Find partners near me'}</span>
              </button>
            </div>

            {/* Country Filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Country</label>
                {filters.country && (
                  <button
                    type="button"
                    onClick={() => handleCountryFilterChange('')}
                    className="text-[10px] text-lime-600 dark:text-lime-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <select
                id="directory-country-filter"
                data-testid="directory-country-filter"
                value={filters.country}
                onChange={(e) => handleCountryFilterChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              >
                <option value="">All Countries (All Africa & Global)</option>
                <optgroup label="Africa — All 54 Sovereign Nations">
                  {COUNTRIES_LIST.filter(c => c.region === 'Africa').map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Europe">
                  {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Europe').map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Americas & Caribbean">
                  {COUNTRIES_LIST.filter(c => c.region === 'Global' && (c.subRegion === 'North America' || c.subRegion === 'Latin America' || c.subRegion === 'Caribbean')).map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Middle East">
                  {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Middle East').map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Asia & Pacific">
                  {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Asia-Pacific').map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">City / Town</label>
                {filters.city && (
                  <button
                    type="button"
                    onClick={() => onUpdateFilters({ city: '' })}
                    className="text-[10px] text-lime-600 dark:text-lime-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <select
                id="directory-city-filter"
                data-testid="directory-city-filter"
                value={filters.city}
                onChange={(e) => onUpdateFilters({ city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              >
                <option value="">{filters.country ? `All Cities in ${filters.country}` : 'All Cities / Locations'}</option>
                {availableDirectoryCities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Level & Trust Badge Seniority Tier */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Trust Badge Seniority
                </label>
                {filters.level && (
                  <button
                    type="button"
                    onClick={() => onUpdateFilters({ level: '' })}
                    className="text-[10px] text-lime-600 dark:text-lime-400 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Platinum', 'Gold', 'Silver', 'Bronze'] as PartnerLevel[]).map((lvl) => {
                  const isSelected = filters.level.toLowerCase() === lvl.toLowerCase();
                  return (
                    <button
                      key={lvl}
                      id={`filter-tier-${lvl.toLowerCase()}`}
                      data-testid={`filter-tier-${lvl.toLowerCase()}`}
                      type="button"
                      onClick={() => onUpdateFilters({ level: isSelected ? '' : lvl })}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                      }`}
                      title={`${lvl} Certification Tier Trust Badge`}
                    >
                      <span className="text-xs">
                        {lvl === 'Platinum' ? '👑' : lvl === 'Gold' ? '🏆' : lvl === 'Silver' ? '🥈' : '🥉'}
                      </span>
                      <span>{lvl}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Currency Filter Box */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-lime-500" />
                  <span>Pricing Currency</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  1$ ≈ {currentCurrency.rateAgainstUSD} {currentCurrency.code}
                </span>
              </div>
              <div className="pt-1">
                <CurrencyToggle mode="dropdown" idPrefix="sidebar-currency" className="w-full" />
              </div>
            </div>

            {/* Partner Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Partner Type (17 categories)</label>
              <select
                value={filters.partnerType}
                onChange={(e) => onUpdateFilters({ partnerType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              >
                <option value="">All Partner Types</option>
                {PARTNER_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Industry Expertise */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Industry Expertise</label>
              <select
                value={filters.industry}
                onChange={(e) => onUpdateFilters({ industry: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              >
                <option value="">All Industries</option>
                {INDUSTRIES_LIST.map((ind) => (
                  <option key={ind.id} value={ind.name}>{ind.name}</option>
                ))}
              </select>
            </div>

            {/* Services Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Services Required</label>
              <select
                value={filters.service}
                onChange={(e) => onUpdateFilters({ service: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              >
                <option value="">All Services</option>
                {availableServices.map((srv) => (
                  <option key={srv} value={srv}>{srv}</option>
                ))}
              </select>
            </div>

            {/* Skill / Expertise Filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                  <span>Skill & Expertise</span>
                </label>
                {filters.skill && (
                  <button
                    type="button"
                    onClick={() => onUpdateFilters({ skill: '' })}
                    className="text-[10px] text-lime-600 dark:text-lime-400 font-bold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <select
                id="select-skill-filter"
                data-testid="select-skill-filter"
                value={filters.skill || ''}
                onChange={(e) => onUpdateFilters({ skill: e.target.value })}
                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 ${
                  filters.skill
                    ? 'border-lime-500/80 ring-1 ring-lime-500/30 font-semibold'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <option value="">All Skills & Specialties</option>
                {availableSkills.map((sk) => (
                  <option key={sk} value={sk}>{sk}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Language</label>
              <select
                value={filters.language}
                onChange={(e) => onUpdateFilters({ language: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              >
                <option value="">Any Language</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Business Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Business Scale</label>
              <div className="flex flex-wrap gap-1.5">
                {businessSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => onUpdateFilters({ businessSize: filters.businessSize === sz ? '' : sz })}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                      filters.businessSize === sz
                        ? 'bg-lime-500 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right: Partner Cards Grid or Map View */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Header info bar with View Mode Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 px-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  Showing <strong className="text-lime-600 dark:text-lime-400">{filteredPartners.length}</strong> verified partners
                </span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Select up to 3 to compare side-by-side
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Quick Sort Segmented Options Bar */}
                <div 
                  role="group" 
                  aria-label="Quick Sort Options" 
                  className="hidden md:inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-lime-500" />
                    <span>Sort:</span>
                  </span>
                  {[
                    { id: 'recommended', label: 'Recommended' },
                    { id: 'rating', label: 'Top Rated' },
                    { id: 'businesses', label: 'Most Businesses' },
                    { id: 'experience', label: 'Years of Experience' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`btn-quick-sort-${opt.id}`}
                      data-testid={`btn-quick-sort-${opt.id}`}
                      type="button"
                      onClick={() => handleSortChange(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        !smartSortEnabled && filters.sortBy === opt.id
                          ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-black ring-1 ring-slate-900/10 dark:ring-white/10'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={opt.id === 'experience' ? 'Sort by Years of Experience to find the most seasoned partners' : `Sort by ${opt.label}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Multi-Currency Toggle */}
                <CurrencyToggle mode="segmented" showLabel idPrefix="directory-currency" popularOnly />
              </div>
            </div>

            {/* Location-Aware Pricing & Currency Context Banner */}
            <LocationPricingBanner
              onFilterCountrySelect={(country) => onUpdateFilters({ country })}
            />

            {/* Quick Filter Chips Component above Partner Grid */}
            <QuickFilterChips
              activeTags={
                filters.verifiedOnly && !filters.quickFilters?.includes('verified-only')
                  ? [...(filters.quickFilters || []), 'verified-only']
                  : (filters.quickFilters || [])
              }
              onToggleTag={(tagId) => {
                const current = filters.quickFilters || [];
                const isVerifiedTag = tagId === 'verified-only';
                const next = current.includes(tagId)
                  ? current.filter((id) => id !== tagId)
                  : [...current, tagId];
                
                onUpdateFilters({
                  quickFilters: next,
                  ...(isVerifiedTag ? { verifiedOnly: next.includes('verified-only') } : {})
                });
              }}
              onClearTags={() => onUpdateFilters({ quickFilters: [], verifiedOnly: false })}
              allPartners={PARTNERS_DATA}
              totalFilteredCount={filteredPartners.length}
            />

            {/* Recommended for You Heuristic Suggestions Section */}
            <RecommendedPartnersSection
              allPartners={PARTNERS_DATA}
              activeFilterCountry={filters.country}
              activeFilterCategory={filters.partnerType}
              onSelectPartner={onSelectPartner}
              onContactPartner={onContactPartner}
              onRequestConsultation={onRequestConsultation}
              onApplyCategoryFilter={(category) => {
                onUpdateFilters({ partnerType: category });
              }}
              onApplyCountryFilter={(country) => {
                onUpdateFilters({ country });
              }}
              onOpenQrBadge={onOpenQrBadge}
            />

            {/* Active Comparison Status Banner in Directory */}
            {selectedComparePartners && selectedComparePartners.length > 0 && (
              <div
                id="directory-comparison-banner"
                className="p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1c35] to-emerald-950 text-white border border-lime-500/40 shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400 border border-lime-500/30 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Side-by-Side Comparison</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-500 text-slate-950 font-extrabold">
                        {selectedComparePartners.length}/3 Selected
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {selectedComparePartners.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-800/90 text-lime-300 px-2 py-0.5 rounded-lg border border-slate-700"
                        >
                          <span>{p.countryFlag}</span>
                          <span>{p.name}</span>
                          <button
                            type="button"
                            onClick={() => onToggleComparePartner?.(p)}
                            className="hover:text-red-400 ml-0.5"
                            title={`Remove ${p.name}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-directory-open-comparison"
                  data-testid="btn-directory-open-comparison"
                  onClick={onOpenComparisonModal}
                  className="px-4 py-2 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare ({selectedComparePartners.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Active Clicked Skill Tag Filter Feedback Banner */}
            {filters.skill && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                id="active-skill-filter-banner"
                data-testid="active-skill-filter-banner"
                className="p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-lime-500/15 via-emerald-500/10 to-transparent border border-lime-500/40 text-slate-800 dark:text-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Filtering Directory by Skill:</span>{' '}
                    <span className="font-extrabold text-slate-950 dark:text-white bg-lime-400/25 dark:bg-lime-400/20 px-2 py-0.5 rounded-md border border-lime-500/30">
                      {filters.skill}
                    </span>
                    <span className="ml-2 text-slate-500 dark:text-slate-400 font-semibold">
                      ({filteredPartners.length} {filteredPartners.length === 1 ? 'partner matches' : 'partners match'} this expertise)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-remove-skill-filter"
                  data-testid="btn-remove-skill-filter"
                  onClick={() => onUpdateFilters({ skill: '' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 border border-slate-300 dark:border-slate-700 hover:border-red-400 transition-all cursor-pointer shadow-2xs"
                  title="Remove skill filter and show all matching partners"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Skill Filter</span>
                </button>
              </motion.div>
            )}

            {/* Partner Cards Grid View */}
            {filteredPartners.length === 0 ? (
              /* If No Results Found */
              (() => {
                const countryPartnersCount = filters.country
                  ? PARTNERS_DATA.filter((p) => p.country.toLowerCase() === filters.country.toLowerCase()).length
                  : 0;
                return (
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center space-y-4 shadow-md">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      {viewFavoritesOnly ? (
                        <Heart className="w-6 h-6 text-rose-500" />
                      ) : (
                        <Search className="w-6 h-6" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {viewFavoritesOnly && favoritePartnerIds.length === 0
                        ? 'You have no saved favorite partners yet'
                        : viewFavoritesOnly
                        ? 'None of your saved favorites match the current filters'
                        : filters.city && filters.country && countryPartnersCount > 0
                        ? `No physical partner offices directly in ${filters.city}, ${filters.country} yet`
                        : filters.country
                        ? `No local offices directly in ${filters.country} yet`
                        : 'No partners match your exact filter criteria'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      {viewFavoritesOnly && favoritePartnerIds.length === 0
                        ? 'Tap the heart icon on any partner card to save firms to your personal shortlist for quick comparison and outreach.'
                        : viewFavoritesOnly
                        ? `You have ${favoritePartnerIds.length} favorited partner${favoritePartnerIds.length === 1 ? '' : 's'}, but active location or category filters are hiding them.`
                        : filters.city && filters.country && countryPartnersCount > 0
                        ? `We have ${countryPartnersCount} verified partner firm${countryPartnersCount === 1 ? '' : 's'} operating across ${filters.country} ready to support your business remotely or on-site.`
                        : filters.country
                        ? `Our accredited international & Pan-African partners provide full remote setup, cloud migration, and ongoing consultation for clients in ${filters.country}.`
                        : 'Try broadening your location search, removing specific service requirements, or explore remote-enabled partners.'}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                      {viewFavoritesOnly && (
                        <button
                          type="button"
                          onClick={() => setViewFavoritesOnly(false)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                        >
                          {favoritePartnerIds.length === 0 ? 'Browse All Partners' : 'Exit Favorites View'}
                        </button>
                      )}
                      {viewFavoritesOnly && favoritePartnerIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            clearGeoStatus();
                            onResetFilters();
                          }}
                          className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                        >
                          Show All My Favorites ({favoritePartnerIds.length})
                        </button>
                      )}
                      {!viewFavoritesOnly && filters.city && filters.country && countryPartnersCount > 0 && (
                        <button
                          type="button"
                          onClick={() => onUpdateFilters({ city: '' })}
                          className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                        >
                          View All Partners in {filters.country} ({countryPartnersCount})
                        </button>
                      )}
                      {!viewFavoritesOnly && geoDetectedResult?.nearestPartner && filters.country !== geoDetectedResult.nearestPartner.country && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateFilters({
                              country: geoDetectedResult.nearestPartner!.country,
                              city: geoDetectedResult.nearestPartner!.city,
                            })
                          }
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                        >
                          Show Nearest Partner ({geoDetectedResult.nearestPartner.city}, {geoDetectedResult.nearestPartner.country})
                        </button>
                      )}
                      {!viewFavoritesOnly && filters.country && (
                        <button
                          onClick={() => onUpdateFilters({ country: '', city: '', remoteOnly: true })}
                          className="px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          View Remote-Support Partners ({PARTNERS_DATA.filter((p) => p.remoteSupport).length})
                        </button>
                      )}
                      <button
                        onClick={() => {
                          clearGeoStatus();
                          setViewFavoritesOnly(false);
                          onResetFilters();
                        }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <>
                {/* Grid of Partner Cards with Subtle Entrance Animation (Fade-in + Slide-up on filter change) */}
                <motion.div
                  key={`partner-grid-${filterSignature}`}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.045,
                        delayChildren: 0.02,
                      },
                    },
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7 pt-2"
                >
                  {displayedPartners.map((partner) => (
                    <motion.div
                      key={partner.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 20,
                          scale: 0.985,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.38,
                            ease: [0.16, 1, 0.3, 1], // Smooth natural deceleration curve
                          },
                        },
                      }}
                      className="h-full partner-card-entrance-wrapper"
                      data-testid={`partner-card-entrance-${partner.id}`}
                    >
                      <PartnerCard
                        partner={partner}
                        onSelectPartner={onSelectPartner}
                        onContactPartner={onContactPartner}
                        onRequestConsultation={onRequestConsultation}
                        isComparing={selectedComparePartners.some((p) => p.id === partner.id)}
                        canCompare={selectedComparePartners.length < 3}
                        onToggleCompare={onToggleComparePartner}
                        activeSort={smartSortEnabled ? undefined : filters.sortBy}
                        activeSuccessStoryScale={filters.successStoryScale}
                        onOpenQrBadge={onOpenQrBadge}
                        onOpenQRScanner={onOpenQRScanner}
                        onSelectSkill={handleSkillClick}
                        activeSkill={filters.skill}
                        onAskQuestion={onAskQuestion}
                        isFavorite={favoritePartnerIds.includes(partner.id)}
                        onToggleFavorite={handleToggleFavorite}
                        smartSortMode={smartSortEnabled ? smartSortMode : undefined}
                        distanceKm={getPartnerDistanceKm(partner, activeLocationContext.coords)}
                        successImpactScore={calculateSuccessImpactScore(partner)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination / Load More */}
                {filteredPartners.length > itemsPerPage && (
                  <div className="text-center pt-8">
                    <button
                      onClick={() => setItemsPerPage(prev => prev + 6)}
                      className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-lime-600 dark:text-lime-400 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 hover:border-lime-500/40 transition-all shadow-sm"
                    >
                      Load More Partners ({filteredPartners.length - itemsPerPage} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

        </div>

      </div>

      {/* Touch-Optimized Mobile Filter Slide-Up Sheet */}
      <MobileFilterSheet
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onUpdateFilters={onUpdateFilters}
        onResetFilters={() => {
          setViewFavoritesOnly(false);
          onResetFilters();
        }}
        activeFiltersCount={activeFiltersCount}
        totalFilteredCount={filteredPartners.length}
        availableServices={availableServices}
        availableLanguages={availableLanguages}
        businessSizes={businessSizes}
        availableSkills={availableSkills}
        viewFavoritesOnly={viewFavoritesOnly}
        onToggleViewFavorites={setViewFavoritesOnly}
        favoritesCount={favoritePartnerIds.length}
      />
    </section>
  );
};
