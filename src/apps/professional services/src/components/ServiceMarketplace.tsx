import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  Search,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Building2,
  Users,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  X,
  Flame,
  Star,
  BadgeCheck,
  Globe2,
  ShoppingCart,
  CheckSquare,
  Square,
  Layers,
  Percent,
  Check,
  Coins,
  ArrowRightLeft,
  Zap,
  Tag
} from 'lucide-react';
import {
  SERVICES_CATALOGUE,
  SERVICE_CATEGORIES,
  ServiceItem,
  ServiceCategory,
  ServicePackage
} from '../data/servicesData';
import { PROFESSIONAL_FIRMS } from '../data/firmsData';
import { ALL_WORLD_COUNTRIES } from '../data/countries';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { getServiceSavingsData } from '../utils/savingsCalculator';
import { ComplianceSavingsWidget } from './ComplianceSavingsWidget';
import { CompareServicesModal } from './CompareServicesModal';
import { CompareFloatingBar } from './CompareFloatingBar';
import { FloatingQuickFilterBar, QuickFilterMode } from './FloatingQuickFilterBar';
import { BulkBookingModal, BulkCartItem } from './BulkBookingModal';
import { CurrencyConverterTool } from './CurrencyConverterTool';
import { useCurrency, MAJOR_AFRICAN_CURRENCIES } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface ServiceMarketplaceProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCountry: string;
  setSelectedCountry?: (country: string) => void;
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem, selectedPackage?: ServicePackage) => void;
  onAddToCart?: (service: ServiceItem, selectedPackage?: ServicePackage) => void;
  searchFilter: { query: string; category: string; mode: string };
}

/**
 * Checks if a service is provided by verified firms that have open slots within 48h
 */
export const isServiceAvailableSoon = (service: ServiceItem): boolean => {
  return service.verifiedProviderIds.some(firmId => {
    const firm = PROFESSIONAL_FIRMS.find(f => f.id === firmId);
    if (!firm) return false;
    return (
      firm.isFastResponder ||
      firm.avgResponseTimeMinutes <= 30 ||
      firm.partnerTier === 'Official Core Team' ||
      (firm.availableSlotDays && firm.availableSlotDays.length >= 4)
    );
  });
};

/**
 * Helper to compute delivery turnaround speed in days (lower is faster)
 */
export const getServiceDeliverySpeedDays = (service: ServiceItem): number => {
  const str = (service.estimatedTimeline + ' ' + (service.packages?.[0]?.duration || '')).toLowerCase();
  let baseDays = 7;
  if (str.includes('minute') || str.includes('instant') || str.includes('same day') || str.includes('same-day')) {
    baseDays = 0.2;
  } else if (str.includes('24 hour') || str.includes('24h') || str.includes('1 day') || str.includes('1-day')) {
    baseDays = 1;
  } else if (str.includes('48 hour') || str.includes('48h') || str.includes('2 day') || str.includes('2-day')) {
    baseDays = 2;
  } else if (str.includes('1-2 day') || str.includes('1-3 day')) {
    baseDays = 1.5;
  } else if (str.includes('2-3') || str.includes('3 day') || str.includes('3-day')) {
    baseDays = 2.5;
  } else if (str.includes('3-5') || str.includes('5 day') || str.includes('4-5')) {
    baseDays = 4;
  } else if (str.includes('1 week') || str.includes('5-7 day') || str.includes('7 day')) {
    baseDays = 6;
  } else if (str.includes('1-2 week') || str.includes('10-14') || str.includes('2 week')) {
    baseDays = 10;
  } else if (str.includes('2-4 week') || str.includes('3-4 week') || str.includes('3 week')) {
    baseDays = 20;
  } else if (str.includes('month') || str.includes('quarter') || str.includes('ongoing')) {
    baseDays = 30;
  }

  // If firms providing this service have open appointment slots < 48h, prioritize with a speed bonus
  if (isServiceAvailableSoon(service)) {
    baseDays -= 0.6;
  }
  return baseDays;
};

/**
 * Helper to compute lowest starter cost in NGN (lower is cheaper)
 */
export const getServiceLowestCostNGN = (service: ServiceItem): number => {
  const extractNum = (val?: string): number => {
    if (!val) return 999999999;
    const match = val.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 999999999;
  };
  const pStart = extractNum(service.startingPrice);
  const pPkg0 = extractNum(service.packages?.[0]?.priceDisplay);
  const pPkg1 = extractNum(service.packages?.[1]?.priceDisplay);
  return Math.min(pStart, pPkg0, pPkg1);
};

/**
 * Helper to compute highest rating & verified review density score (higher is better)
 */
export const getServiceRatingScore = (service: ServiceItem): number => {
  const matched = PROFESSIONAL_FIRMS.filter(f => service.verifiedProviderIds.includes(f.id));
  if (matched.length === 0) return 4.7 * 100;
  const maxRating = Math.max(...matched.map(f => f.rating));
  const avgRating = matched.reduce((sum, f) => sum + f.rating, 0) / matched.length;
  const reviewCount = matched.reduce((sum, f) => sum + f.reviewCount, 0);
  return maxRating * 1000 + avgRating * 100 + Math.min(reviewCount, 250);
};

/**
 * Promoted badge component with subtle pulsing animation
 */
export const PromotedBadge: React.FC<{
  type?: 'popular' | 'limited_offer' | 'available_soon';
  className?: string;
}> = ({ type = 'popular', className = '' }) => {
  if (type === 'limited_offer') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs border border-rose-300/40 animate-pulse ${className}`}
        title="Promoted: Special limited time offer with preferential rates"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <Tag className="w-3 h-3 text-white" />
        <span>Limited Time Offer</span>
      </span>
    );
  }

  if (type === 'available_soon') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs border border-emerald-300/40 ${className}`}
        title="Firms offering this service have verified appointment slots open within the next 48 hours"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B7E532]"></span>
        </span>
        <Zap className="w-3 h-3 text-[#B7E532]" />
        <span>Open Slots &lt; 48h</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs border border-amber-300/40 ${className}`}
      title="High client demand and frequent business bookings"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <Flame className="w-3 h-3 fill-white text-white" />
      <span>Most Popular</span>
    </span>
  );
};

export const ServiceMarketplace: React.FC<ServiceMarketplaceProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedCountry,
  setSelectedCountry,
  onSelectService,
  onBookService,
  onAddToCart,
  searchFilter,
}) => {
  const { formatPriceString, currentCurrency, currencyCode, setCurrencyCode, currencies } = useCurrency();
  const [isCurrencyToolOpen, setIsCurrencyToolOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState(searchFilter.query || '');
  const [deliveryFilter, setDeliveryFilter] = useState<string>(searchFilter.mode || 'All');
  const [sortBy, setSortBy] = useState<'relevance' | 'popular' | 'verified'>('popular');
  const [quickTrustFilter, setQuickTrustFilter] = useState<'all' | 'popular' | 'verified' | 'top_rated' | 'available_soon'>('all');
  const [showAvailableSoon, setShowAvailableSoon] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Floating Quick Filter Mode (Fastest Delivery, Lowest Cost, Highest Rated)
  const [floatingQuickFilter, setFloatingQuickFilter] = useState<QuickFilterMode>('none');

  const handleToggleFloatingFilter = (mode: QuickFilterMode) => {
    setFloatingQuickFilter(prev => (prev === mode ? 'none' : mode));
  };

  const handleResetFloatingFilter = () => {
    setFloatingQuickFilter('none');
  };

  // Country & State / City Search States
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [citySearchInput, setCitySearchInput] = useState<string>('');

  // Bulk Service Booking States
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkCart, setBulkCart] = useState<BulkCartItem[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);

  // Compute available cities dynamically based on selected country
  const availableCities = useMemo(() => {
    if (selectedCountry && selectedCountry !== 'All Countries' && selectedCountry !== 'UK / International') {
      const countryData = ALL_WORLD_COUNTRIES.find(c => c.name.toLowerCase() === selectedCountry.toLowerCase());
      if (countryData && countryData.majorCities.length > 0) {
        return ['All Cities', ...countryData.majorCities];
      }
    }
    // Default major Pan-African business cities
    return [
      'All Cities',
      'Lagos',
      'Abuja',
      'Nairobi',
      'Mombasa',
      'Accra',
      'Kumasi',
      'Johannesburg',
      'Cape Town',
      'Kigali',
      'Port Harcourt',
      'Kampala',
      'Dar es Salaam',
      'Cairo',
      'Casablanca'
    ];
  }, [selectedCountry]);

  // Bulk Cart Management Handlers
  const handleToggleBulkCart = (service: ServiceItem, defaultPackage?: ServicePackage) => {
    setBulkCart(prev => {
      const exists = prev.some(item => item.service.id === service.id);
      if (exists) {
        return prev.filter(item => item.service.id !== service.id);
      }
      const pkg = defaultPackage || service.packages[1] || service.packages[0];
      const matchedFirm = PROFESSIONAL_FIRMS.find(f => service.verifiedProviderIds.includes(f.id)) || PROFESSIONAL_FIRMS[0];
      return [
        ...prev,
        {
          service,
          selectedPackage: pkg,
          selectedFirm: matchedFirm,
          consultationMode: service.deliveryMode === 'On-site' ? 'On-site Business Visit' : 'Online Consultation',
        }
      ];
    });
  };

  const handleUpdateCartItem = (serviceId: string, updates: Partial<BulkCartItem>) => {
    setBulkCart(prev => prev.map(item => item.service.id === serviceId ? { ...item, ...updates } : item));
  };

  const handleRemoveCartItem = (serviceId: string) => {
    setBulkCart(prev => prev.filter(item => item.service.id !== serviceId));
  };

  // Trigger simulated skeleton loading when key filters shift
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedCountry, selectedCity, citySearchInput, deliveryFilter, sortBy, quickTrustFilter, showAvailableSoon]);

  // Comparison State (up to 3 services)
  const [comparedServiceIds, setComparedServiceIds] = useState<string[]>([
    'srv-bookkeeping-monthly',
    'srv-tax-advisory',
  ]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareAlert, setCompareAlert] = useState<string | null>(null);

  const handleToggleCompare = (service: ServiceItem) => {
    if (comparedServiceIds.includes(service.id)) {
      setComparedServiceIds(prev => prev.filter(id => id !== service.id));
    } else {
      if (comparedServiceIds.length >= 3) {
        setCompareAlert('You can select up to 3 services to compare at once.');
        setTimeout(() => setCompareAlert(null), 3000);
        return;
      }
      setComparedServiceIds(prev => [...prev, service.id]);
    }
  };

  const comparedServices = useMemo(() => {
    return SERVICES_CATALOGUE.filter(s => comparedServiceIds.includes(s.id));
  }, [comparedServiceIds]);

  // Sync with searchFilter prop changes
  React.useEffect(() => {
    if (searchFilter.query !== undefined) {
      setLocalSearch(searchFilter.query);
    }
    if (searchFilter.category && searchFilter.category !== 'All') {
      setSelectedCategory(searchFilter.category);
    }
    if (searchFilter.mode && searchFilter.mode !== 'All Modes') {
      setDeliveryFilter(searchFilter.mode);
    }
  }, [searchFilter, setSelectedCategory]);

  // Quick Trust Filter Tag counts (reactive to active category & country)
  const quickFilterCounts = useMemo(() => {
    let base = SERVICES_CATALOGUE;
    if (selectedCategory !== 'All') {
      base = base.filter(s => s.category === selectedCategory);
    }
    const popular = base.filter(s => s.popular || s.featured).length;
    const verified = base.filter(s =>
      s.verifiedProviderIds.some(id => {
        const firm = PROFESSIONAL_FIRMS.find(f => f.id === id);
        return firm && firm.isVerified && (firm.partnerTier === 'Official Core Team' || firm.partnerTier === 'Platinum Partner' || firm.partnerTier === 'Gold Partner');
      })
    ).length;
    const topRated = base.filter(s =>
      s.verifiedProviderIds.some(id => {
        const firm = PROFESSIONAL_FIRMS.find(f => f.id === id);
        return firm && firm.rating >= 4.85;
      })
    ).length;
    const availableSoon = base.filter(s => isServiceAvailableSoon(s)).length;
    return {
      all: base.length,
      popular,
      verified,
      topRated,
      availableSoon,
    };
  }, [selectedCategory]);

  // Filtered & sorted services list
  const filteredServices = useMemo(() => {
    return SERVICES_CATALOGUE.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Show Available Soon filter (firms with open slots < 48 hours)
      if (showAvailableSoon || quickTrustFilter === 'available_soon') {
        if (!isServiceAvailableSoon(item)) return false;
      }

      // Quick Trust Tag filter
      if (quickTrustFilter === 'popular') {
        if (!item.popular && !item.featured) return false;
      } else if (quickTrustFilter === 'verified') {
        const isVerifiedHighTrust = item.verifiedProviderIds.some(id => {
          const firm = PROFESSIONAL_FIRMS.find(f => f.id === id);
          return firm && firm.isVerified && (firm.partnerTier === 'Official Core Team' || firm.partnerTier === 'Platinum Partner' || firm.partnerTier === 'Gold Partner');
        });
        if (!isVerifiedHighTrust) return false;
      } else if (quickTrustFilter === 'top_rated') {
        const isTopRated = item.verifiedProviderIds.some(id => {
          const firm = PROFESSIONAL_FIRMS.find(f => f.id === id);
          return firm && firm.rating >= 4.85;
        });
        if (!isTopRated) return false;
      }

      // Country match
      if (selectedCountry && selectedCountry !== 'All Countries' && selectedCountry !== 'UK / International') {
        const matchesCountry = item.countriesAvailable.some(c =>
          c.toLowerCase().includes(selectedCountry.toLowerCase()) || c === 'Pan-African'
        );
        if (!matchesCountry) return false;
      }

      // State or City match
      const effectiveCity = (citySearchInput.trim() || (selectedCity !== 'All Cities' ? selectedCity : '')).toLowerCase();
      if (effectiveCity) {
        const hasLocalFirm = item.verifiedProviderIds.some(firmId => {
          const firm = PROFESSIONAL_FIRMS.find(f => f.id === firmId);
          if (!firm) return false;
          return (
            firm.city.toLowerCase().includes(effectiveCity) ||
            firm.location.toLowerCase().includes(effectiveCity) ||
            firm.countriesServed.some(cs => cs.toLowerCase().includes(effectiveCity))
          );
        });
        const matchesText = item.shortOverview.toLowerCase().includes(effectiveCity) ||
          item.detailedDescription.toLowerCase().includes(effectiveCity) ||
          item.challengesSolved.some(c => c.toLowerCase().includes(effectiveCity));
        const isRemoteAvailable = item.deliveryMode === 'Remote' || item.deliveryMode === 'Hybrid' || item.countriesAvailable.includes('Pan-African');
        if (!hasLocalFirm && !matchesText && !isRemoteAvailable) {
          return false;
        }
      }

      // Delivery mode match
      if (deliveryFilter !== 'All' && deliveryFilter !== 'All Modes') {
        if (deliveryFilter === 'Online' && item.deliveryMode === 'On-site') return false;
        if (deliveryFilter === 'On-site' && item.deliveryMode === 'Remote') return false;
      }

      // Search keyword match
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.shortOverview.toLowerCase().includes(q) || item.detailedDescription.toLowerCase().includes(q);
        const matchesChallenges = item.challengesSolved.some(c => c.toLowerCase().includes(q));
        const matchesAudience = item.targetAudience.some(a => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesChallenges && !matchesAudience) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Floating quick filter takes priority
      if (floatingQuickFilter === 'fastest_delivery') {
        const diff = getServiceDeliverySpeedDays(a) - getServiceDeliverySpeedDays(b);
        if (diff !== 0) return diff;
      } else if (floatingQuickFilter === 'lowest_cost') {
        const diff = getServiceLowestCostNGN(a) - getServiceLowestCostNGN(b);
        if (diff !== 0) return diff;
      } else if (floatingQuickFilter === 'highest_rated') {
        const diff = getServiceRatingScore(b) - getServiceRatingScore(a);
        if (diff !== 0) return diff;
      }

      if (sortBy === 'popular') {
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      }
      if (sortBy === 'verified') {
        return b.verifiedProviderIds.length - a.verifiedProviderIds.length;
      }
      return 0;
    });
  }, [selectedCategory, showAvailableSoon, quickTrustFilter, selectedCountry, selectedCity, citySearchInput, deliveryFilter, localSearch, sortBy, floatingQuickFilter]);

  return (
    <section id="services-catalogue" className="py-16 bg-[#F5F9FD]/60 dark:bg-[#07111D] border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Comprehensive Professional Services Catalogue
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
              Verified Business Services Marketplace
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1.5 max-w-2xl font-normal">
              Book verified chartered accountants, certified implementation engineers, and consulting partners. Available for instant booking online or direct via WhatsApp.
            </p>
          </div>

          {/* View Mode Toggle & Active Results Count & Compare Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Enterprise Bulk Booking Toggle */}
            <button
              onClick={() => setIsBulkMode(!isBulkMode)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer ${
                isBulkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white ring-2 ring-[#B7E532]'
                  : 'bg-white dark:bg-[#0A1727] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0E2036]'
              }`}
              title="Bulk Service Booking: select multiple service packages across providers and schedule in 1-click"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isBulkMode ? 'text-[#B7E532]' : 'text-[#1464C8] dark:text-[#B7E532]'}`} />
              <span>Bulk Booking Mode</span>
              {bulkCart.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#B7E532] text-[#102B4E] text-[10px] font-black">
                  {bulkCart.length}
                </span>
              )}
            </button>

            {comparedServices.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#102B4E] hover:bg-[#1464C8] text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer"
                title="View side-by-side comparison"
              >
                <span className="w-2 h-2 rounded-full bg-[#B7E532] animate-pulse"></span>
                <span>Compare Services ({comparedServices.length}/3)</span>
              </button>
            )}

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Showing <span className="font-bold text-[#102B4E] dark:text-white">{filteredServices.length}</span> services
            </span>

            {/* Quick Filter Active Tag */}
            {floatingQuickFilter !== 'none' && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#102B4E] dark:bg-[#0E2036] text-[#B7E532] text-xs font-black border border-[#B7E532]/40 shadow-xs animate-in fade-in">
                {floatingQuickFilter === 'fastest_delivery' && <Zap className="w-3.5 h-3.5" />}
                {floatingQuickFilter === 'lowest_cost' && <Coins className="w-3.5 h-3.5" />}
                {floatingQuickFilter === 'highest_rated' && <Star className="w-3.5 h-3.5 fill-[#B7E532]" />}
                <span>
                  {floatingQuickFilter === 'fastest_delivery'
                    ? 'Fastest Delivery'
                    : floatingQuickFilter === 'lowest_cost'
                    ? 'Lowest Cost'
                    : 'Highest Rated'}
                </span>
                <button
                  type="button"
                  onClick={handleResetFloatingFilter}
                  className="hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                  title="Clear Quick Filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* View Mode */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#1464C8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#1464C8] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Temporary Compare Alert Toast */}
        {compareAlert && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl flex items-center justify-between animate-in fade-in">
            <span>{compareAlert}</span>
            <button onClick={() => setCompareAlert(null)} className="text-amber-700 hover:text-amber-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Estimated Annual Compliance Savings Data Visualization Widget */}
        <ComplianceSavingsWidget
          selectedCountry={selectedCountry}
          onBookServiceBundle={(serviceIds, totalSavingsStr) => {
            const primaryService = SERVICES_CATALOGUE.find(s => serviceIds.includes(s.id)) || SERVICES_CATALOGUE[0];
            onBookService(primaryService);
          }}
        />

        {/* Pan-African Currency Converter Quick-Switcher Bar (Prompt #1) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-blue-50/60 dark:from-[#0B1E34] dark:via-[#09182A] dark:to-[#0B1E34] border border-blue-200/70 dark:border-blue-900/50 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1464C8] text-white flex items-center justify-center shadow-xs shrink-0">
              <Coins className="w-5 h-5 text-[#B7E532]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
                  Pan-African Currency Pricing Switcher
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B7E532]/30 text-[#102B4E] dark:text-[#B7E532]">
                  Active: {currentCurrency.code} ({currentCurrency.symbol})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle between major African currencies across all service packages & billing estimates:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {MAJOR_AFRICAN_CURRENCIES.map((code) => {
              const cur = currencies.find(c => c.code === code) || currencies[0];
              const isSelected = currencyCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrencyCode(code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]'
                      : 'bg-white dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={`Switch all prices to ${cur.name} (${cur.symbol})`}
                >
                  <span>{cur.flag}</span>
                  <span>{cur.code}</span>
                  <span className={isSelected ? 'text-[#B7E532]' : 'text-slate-400'}>
                    ({cur.symbol})
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCurrencyToolOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1464C8] hover:bg-[#1052a5] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Open full interactive currency converter tool & live FX rates"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#B7E532]" />
              <span>Full FX Converter →</span>
            </button>
          </div>
        </div>

        {/* Sticky Category Tabs Bar */}
        <div className="sticky top-20 z-30 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md p-2 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto transition-colors">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#0E2036] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132842]'
              }`}
            >
              All Services ({SERVICES_CATALOGUE.length})
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#1464C8] text-white shadow-sm ring-2 ring-[#B7E532]'
                    : 'bg-slate-100 dark:bg-[#0E2036] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132842]'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8 space-y-3.5">
          {/* Top Row: Search, Country, City/State, Delivery Mode & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Inline Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by keyword, problem or service..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0E2036] focus:outline-none focus:ring-2 focus:ring-[#1464C8] text-slate-800 dark:text-slate-100"
                />
                {localSearch && (
                  <button
                    onClick={() => setLocalSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Country Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                  Country:
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    if (setSelectedCountry) setSelectedCountry(e.target.value);
                    setSelectedCity('All Cities');
                  }}
                  className="bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer max-w-[145px]"
                >
                  <option value="All Countries">All Countries (Pan-Africa)</option>
                  {ALL_WORLD_COUNTRIES.slice(0, 16).map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                  <option value="UK / International">🌍 UK / International</option>
                </select>
              </div>

              {/* State or City Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                  State/City:
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer max-w-[135px]"
                >
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Delivery:</span>
                <select
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="All">All Delivery Modes</option>
                  <option value="Remote">Remote / Virtual</option>
                  <option value="On-site">On-site Business Visit</option>
                  <option value="Hybrid">Hybrid Flexible</option>
                </select>
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#102B4E] dark:text-slate-100 cursor-pointer"
              >
                <option value="popular">Most Popular & Recommended</option>
                <option value="relevance">Category Relevance</option>
                <option value="verified">Most Verified Providers</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Trust & Popularity Filter Tags */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                <span>Quick Filter:</span>
              </span>

              {/* All Services Tag */}
              <button
                type="button"
                onClick={() => setQuickTrustFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  quickTrustFilter === 'all'
                    ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132842]'
                }`}
              >
                <span>All Services</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  quickTrustFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {quickFilterCounts.all}
                </span>
              </button>

              {/* 'Most Popular' Tag */}
              <button
                type="button"
                onClick={() => setQuickTrustFilter(quickTrustFilter === 'popular' ? 'all' : 'popular')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  quickTrustFilter === 'popular'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm ring-2 ring-amber-400/50'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
                title="Filter by high-demand services with frequent business client bookings"
              >
                <Flame className={`w-3.5 h-3.5 ${quickTrustFilter === 'popular' ? 'text-white fill-white' : 'text-amber-600 dark:text-amber-400 fill-amber-500'}`} />
                <span>Most Popular</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  quickTrustFilter === 'popular' ? 'bg-white/25 text-white' : 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200'
                }`}>
                  {quickFilterCounts.popular}
                </span>
              </button>

              {/* 'Verified High-Trust' Tag */}
              <button
                type="button"
                onClick={() => setQuickTrustFilter(quickTrustFilter === 'verified' ? 'all' : 'verified')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  quickTrustFilter === 'verified'
                    ? 'bg-[#1464C8] text-white shadow-sm ring-2 ring-[#B7E532]'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-[#B7E532] border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                }`}
                title="Filter services delivered by verified chartered accountants & Platinum partner firms"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${quickTrustFilter === 'verified' ? 'text-[#B7E532]' : 'text-[#1464C8] dark:text-[#B7E532]'}`} />
                <span>Verified High-Trust</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  quickTrustFilter === 'verified' ? 'bg-white/25 text-white' : 'bg-blue-200/80 dark:bg-blue-900/80 text-blue-900 dark:text-blue-200'
                }`}>
                  {quickFilterCounts.verified}
                </span>
              </button>

              {/* 'Top Rated' Tag */}
              <button
                type="button"
                onClick={() => setQuickTrustFilter(quickTrustFilter === 'top_rated' ? 'all' : 'top_rated')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  quickTrustFilter === 'top_rated'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
                title="Filter services backed by providers with 4.85+ client ratings"
              >
                <Star className={`w-3.5 h-3.5 ${quickTrustFilter === 'top_rated' ? 'text-white fill-white' : 'text-emerald-600 dark:text-emerald-400 fill-emerald-500'}`} />
                <span>Top Rated (4.85+★)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  quickTrustFilter === 'top_rated' ? 'bg-white/25 text-white' : 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200'
                }`}>
                  {quickFilterCounts.topRated}
                </span>
              </button>

              {/* 'Show Available Soon' (<48h) Tag */}
              <button
                type="button"
                onClick={() => {
                  setShowAvailableSoon(prev => !prev);
                  if (quickTrustFilter === 'available_soon') setQuickTrustFilter('all');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  showAvailableSoon || quickTrustFilter === 'available_soon'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm ring-2 ring-emerald-400/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-[#B7E532] border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
                title="Filter services where professional firms have open appointment slots within the next 48 hours"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Zap className="w-3.5 h-3.5 text-[#B7E532]" />
                <span>Available Soon (&lt; 48h)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showAvailableSoon || quickTrustFilter === 'available_soon' ? 'bg-white/25 text-white' : 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-[#B7E532]'
                }`}>
                  {quickFilterCounts.availableSoon}
                </span>
              </button>
            </div>

            {/* Active Tag Status & Quick Clear Button */}
            {(quickTrustFilter !== 'all' || showAvailableSoon) && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 animate-in fade-in">
                <span className="hidden sm:inline">Active Tag:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold border border-slate-200 dark:border-slate-700">
                  {showAvailableSoon && '⚡ Available Soon (<48h)'}
                  {!showAvailableSoon && quickTrustFilter === 'popular' && '🔥 Most Popular'}
                  {!showAvailableSoon && quickTrustFilter === 'verified' && '🛡️ Verified High-Trust'}
                  {!showAvailableSoon && quickTrustFilter === 'top_rated' && '⭐ Top Rated'}
                  {!showAvailableSoon && quickTrustFilter === 'available_soon' && '⚡ Available Soon (<48h)'}
                  <button
                    onClick={() => {
                      setQuickTrustFilter('all');
                      setShowAvailableSoon(false);
                    }}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full cursor-pointer text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    title="Clear filter tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
                <button
                  onClick={() => {
                    setQuickTrustFilter('all');
                    setShowAvailableSoon(false);
                  }}
                  className="text-[#1464C8] dark:text-[#B7E532] hover:underline text-xs cursor-pointer ml-1 font-bold"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enterprise Bulk Service Banner */}
        {isBulkMode && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#102B4E] to-[#1464C8] text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#B7E532]/40 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7E532] text-[#102B4E] flex items-center justify-center font-black shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black">Enterprise Bulk Booking Mode Active</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#B7E532] text-[#102B4E] text-[10px] font-black">
                    10% Multi-Service Discount
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Select 2 or more service packages across any verified accounting or advisory firms and schedule them in a single batch transaction.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-200">
                {bulkCart.length} services selected
              </span>
              {bulkCart.length > 0 && (
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-4 py-2 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Review Bulk Order ({bulkCart.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* SKELETON LOADING SCREENS */}
        {isLoading && (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 animate-pulse ${
                  viewMode === 'grid' ? 'flex flex-col justify-between h-[420px]' : 'flex flex-col sm:flex-row gap-5 items-center'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div>
                      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                      </div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                      </div>
                      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2"></div>
                      <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded mb-1.5"></div>
                      <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                      <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full sm:w-48 h-32 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0"></div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0"></div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#0A1727] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-[#B7E532] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#102B4E] dark:text-white">No matching services found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              We couldn't find any services matching your active filters
              {quickTrustFilter !== 'all' ? ` for "${quickTrustFilter === 'popular' ? 'Most Popular' : quickTrustFilter === 'verified' ? 'Verified High-Trust' : 'Top Rated'}"` : ''}
              {localSearch ? ` and keyword "${localSearch}"` : ''} in category "{selectedCategory}".
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSelectedCategory('All');
                  setDeliveryFilter('All');
                  setQuickTrustFilter('all');
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              {quickTrustFilter !== 'all' && (
                <button
                  onClick={() => setQuickTrustFilter('all')}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#1464C8] dark:text-[#B7E532] font-bold text-xs rounded-lg border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                >
                  Clear Tag Filter ({quickTrustFilter === 'popular' ? 'Most Popular' : quickTrustFilter === 'verified' ? 'Verified High-Trust' : 'Top Rated'})
                </button>
              )}
              <a
                href={buildWhatsAppBookingUrl({ serviceName: localSearch || 'Custom Service Request' })}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#B7E532] text-[#102B4E] font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ask MsmeBooks on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* GRID VIEW MODE (3 Columns Desktop, 2 Tablet, 1 Mobile) */}
        {!isLoading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const verifiedProvidersCount = service.verifiedProviderIds.length;
              return (
                <div
                  key={service.id}
                  className={`bg-white dark:bg-[#0A1727] rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                    bulkCart.some(i => i.service.id === service.id)
                      ? 'border-emerald-500 ring-2 ring-emerald-400/50'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-[#1464C8]/60 dark:hover:border-[#1464C8]'
                  }`}
                >
                  <div>
                    {/* Bulk Selection Header inside card when Bulk Mode is active */}
                    {isBulkMode && (
                      <div className={`p-2.5 px-4 text-xs font-bold flex items-center justify-between border-b transition-colors ${
                        bulkCart.some(i => i.service.id === service.id)
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-[#B7E532] border-emerald-200 dark:border-emerald-900/40'
                      }`}>
                        <span className="flex items-center gap-1.5 text-[11px] font-black">
                          <Percent className="w-3.5 h-3.5" />
                          <span>10% Bulk Discount</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleBulkCart(service)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            bulkCart.some(i => i.service.id === service.id)
                              ? 'bg-white text-emerald-800 shadow-xs'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {bulkCart.some(i => i.service.id === service.id) ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>+ Add to Bulk</span>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Top Image & Badge */}
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      {/* Top Badges (Category & Promoted Badges) */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[75%]">
                        <span className="px-2.5 py-1 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md text-[#102B4E] dark:text-slate-100 text-[11px] font-extrabold rounded-md shadow-xs">
                          {service.category}
                        </span>
                        {service.featured && service.popular ? (
                          <PromotedBadge type="limited_offer" />
                        ) : (service.popular || service.featured) ? (
                          <PromotedBadge type="popular" />
                        ) : null}
                        {isServiceAvailableSoon(service) && (
                          <PromotedBadge type="available_soon" />
                        )}
                        {floatingQuickFilter === 'fastest_delivery' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-black shadow-xs border border-emerald-300/40">
                            <Zap className="w-3 h-3 text-[#B7E532]" />
                            <span>{service.estimatedTimeline}</span>
                          </span>
                        )}
                        {floatingQuickFilter === 'lowest_cost' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600/95 backdrop-blur-xs text-white text-[10px] font-black shadow-xs border border-amber-300/40">
                            <Coins className="w-3 h-3 text-amber-200" />
                            <span>Best Value</span>
                          </span>
                        )}
                        {floatingQuickFilter === 'highest_rated' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#102B4E]/95 backdrop-blur-xs text-[#B7E532] text-[10px] font-black shadow-xs border border-[#B7E532]/40">
                            <Star className="w-3 h-3 fill-[#B7E532]" />
                            <span>Top Reviewed</span>
                          </span>
                        )}
                      </div>

                      {/* Right Badges (Delivery Mode & Verified Status) */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md shadow-xs ${
                          service.deliveryMode === 'Remote'
                            ? 'bg-blue-600 text-white'
                            : service.deliveryMode === 'On-site'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#B7E532] text-[#102B4E]'
                        }`}>
                          {service.deliveryMode}
                        </span>
                        {verifiedProvidersCount > 0 && (
                          <span className="px-2 py-0.5 bg-[#102B4E]/90 dark:bg-[#0A1727]/90 backdrop-blur-xs text-[#B7E532] text-[10px] font-extrabold rounded-md shadow-xs flex items-center gap-1 border border-white/10">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      {/* Billing Structure & Dynamic Regional Currency Starting Price Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/15 shadow-xs">
                          <span className="text-[9px] uppercase font-bold text-[#B7E532] block tracking-wider">
                            From {formatPriceString(service.packages[0]?.priceDisplay || service.startingPrice)}
                          </span>
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#B7E532]" />
                            Hourly or Fixed
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
                          <Users className="w-3 h-3 text-[#B7E532]" />
                          <span>{verifiedProvidersCount} Verified Firms</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3
                        onClick={() => onSelectService(service)}
                        className="font-black text-lg text-[#102B4E] dark:text-white group-hover:text-[#1464C8] dark:group-hover:text-[#B7E532] transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {service.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 font-normal leading-relaxed">
                        {service.shortOverview}
                      </p>

                      {/* Billing Model Indicator */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Billing Model:</span>
                        <span className="font-bold text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                          Per Hour or Fixed Price
                        </span>
                      </div>

                      {/* Key Deliverables Highlights */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        {service.deliverables.slice(0, 2).map((del, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532] mt-1.5 shrink-0"></span>
                            <span className="line-clamp-1">{del}</span>
                          </div>
                        ))}
                      </div>

                      {/* Related Module Tag */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {service.relatedModules.slice(0, 2).map((mod, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 px-2 py-0.5 rounded">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions (Dual Booking System + Compare Toggle) */}
                  <div className="p-5 pt-0 space-y-3">
                    {/* Savings highlight & Compare toggle */}
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompare(service);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          comparedServiceIds.includes(service.id)
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-[#B7E532] border-[#1464C8] dark:border-[#B7E532] ring-1 ring-[#1464C8]/30'
                            : 'bg-slate-50 dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                          comparedServiceIds.includes(service.id) ? 'bg-[#1464C8] text-white' : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {comparedServiceIds.includes(service.id) ? '✓' : ''}
                        </span>
                        <span>{comparedServiceIds.includes(service.id) ? 'Comparing' : 'Compare'}</span>
                      </button>

                      <span className="text-[11px] font-extrabold text-emerald-700 dark:text-[#B7E532]">
                        {getServiceSavingsData(service, selectedCountry).annualSavingsFormatted} / yr savings
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectService(service)}
                        className="py-2.5 px-3 text-xs font-bold text-[#102B4E] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => onBookService(service)}
                        className="py-2.5 px-3 text-xs font-bold text-white bg-[#1464C8] hover:bg-[#1052a5] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Book a Firm</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Bulk Selection Button when in Bulk Mode */}
                    {isBulkMode && (
                      <button
                        type="button"
                        onClick={() => handleToggleBulkCart(service)}
                        className={`w-full py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          bulkCart.some(i => i.service.id === service.id)
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#B7E532] border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {bulkCart.some(i => i.service.id === service.id) ? (
                          <>
                            <CheckSquare className="w-4 h-4 text-[#B7E532]" />
                            <span>In Enterprise Bulk Order</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4" />
                            <span>+ Add to Bulk Order (-10%)</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Book via WhatsApp Direct */}
                    <a
                      href={buildWhatsAppBookingUrl({
                        serviceName: service.title,
                        packageName: service.packages[0]?.name || 'Starter Consultation',
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 text-xs font-extrabold text-[#102B4E] bg-[#B7E532] hover:bg-[#a4d227] rounded-xl transition-transform hover:scale-[1.01] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Book via WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST VIEW MODE (Horizontal Cards with Rich Details) */}
        {!isLoading && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredServices.map((service) => {
              const verifiedProvidersCount = service.verifiedProviderIds.length;
              return (
                <div
                  key={service.id}
                  className={`bg-white dark:bg-[#0A1727] rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
                    bulkCart.some(i => i.service.id === service.id)
                      ? 'border-emerald-500 ring-2 ring-emerald-400/50'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-[#1464C8]/50 dark:hover:border-[#1464C8]'
                  }`}
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full sm:w-44 h-32 object-cover rounded-xl shrink-0 bg-slate-100 dark:bg-slate-800"
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 font-bold text-xs rounded-md">
                          {service.category}
                        </span>
                        {service.featured && service.popular ? (
                          <PromotedBadge type="limited_offer" />
                        ) : (service.popular || service.featured) ? (
                          <PromotedBadge type="popular" />
                        ) : null}
                        {isServiceAvailableSoon(service) && (
                          <PromotedBadge type="available_soon" />
                        )}
                        {floatingQuickFilter === 'fastest_delivery' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-xs">
                            <Zap className="w-3 h-3 text-[#B7E532]" />
                            <span>{service.estimatedTimeline}</span>
                          </span>
                        )}
                        {floatingQuickFilter === 'lowest_cost' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600 text-white text-xs font-bold shadow-xs">
                            <Coins className="w-3 h-3 text-amber-200" />
                            <span>Best Value</span>
                          </span>
                        )}
                        {floatingQuickFilter === 'highest_rated' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#102B4E] text-[#B7E532] text-xs font-bold border border-[#B7E532]/40 shadow-xs">
                            <Star className="w-3 h-3 fill-[#B7E532]" />
                            <span>Top Reviewed</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md">
                          Mode: {service.deliveryMode}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-[#B7E532] flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/40">
                          <ShieldCheck className="w-3.5 h-3.5" /> {verifiedProvidersCount} Verified Firms
                        </span>
                        {isBulkMode && (
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#B7E532] text-xs font-bold rounded-md flex items-center gap-1">
                            <Percent className="w-3 h-3" /> 10% Bulk Eligible
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectService(service)}
                        className="text-lg font-black text-[#102B4E] dark:text-white hover:text-[#1464C8] dark:hover:text-[#B7E532] transition-colors cursor-pointer"
                      >
                        {service.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {service.shortOverview}
                      </p>

                      {/* Deliverables snippet */}
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium">Timeline: <strong className="text-slate-700 dark:text-slate-300">{service.estimatedTimeline}</strong></span>
                        <span>•</span>
                        <span>Packages: <strong className="text-[#102B4E] dark:text-slate-200">{service.packages.length} Available</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Billing & Dual Booking Actions */}
                  <div className="w-full lg:w-64 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-6 flex flex-col justify-between self-stretch shrink-0">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        From {formatPriceString(service.packages[0]?.priceDisplay || service.startingPrice)}
                      </div>
                      <div className="text-base sm:text-lg font-black text-[#1464C8] dark:text-[#B7E532] mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                        <span>Per Hour or Fixed Price</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Select hours needed or fixed project days at booking
                      </div>
                      <div className="text-[11px] font-black text-emerald-700 dark:text-[#B7E532] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800 mt-2 inline-block">
                        {getServiceSavingsData(service, selectedCountry, { symbol: currentCurrency.symbol, rateMultiplier: currentCurrency.rateFromNGN }).annualSavingsFormatted} / yr savings
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectService(service)}
                          className="py-2 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-center"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onBookService(service)}
                          className="py-2 px-3 text-xs font-bold text-white bg-[#1464C8] hover:bg-[#1052a5] rounded-lg transition-colors cursor-pointer text-center"
                        >
                          Book Firm
                        </button>
                      </div>

                      {/* Bulk Selection in List Mode */}
                      {isBulkMode && (
                        <button
                          type="button"
                          onClick={() => handleToggleBulkCart(service)}
                          className={`w-full py-1.5 px-2 text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            bulkCart.some(i => i.service.id === service.id)
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#B7E532] border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {bulkCart.some(i => i.service.id === service.id) ? (
                            <>
                              <CheckSquare className="w-3.5 h-3.5 text-[#B7E532]" />
                              <span>In Bulk Order Cart</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-3.5 h-3.5" />
                              <span>+ Add to Bulk Order (-10%)</span>
                            </>
                          )}
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(service);
                          }}
                          className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            comparedServiceIds.includes(service.id)
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-[#B7E532] border-[#1464C8] dark:border-[#B7E532]'
                              : 'bg-white dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded text-[9px] flex items-center justify-center ${
                            comparedServiceIds.includes(service.id) ? 'bg-[#1464C8] text-white' : 'border border-slate-300 dark:border-slate-600'
                          }`}>
                            {comparedServiceIds.includes(service.id) ? '✓' : ''}
                          </span>
                          <span>{comparedServiceIds.includes(service.id) ? 'Comparing' : 'Compare'}</span>
                        </button>

                        <a
                          href={buildWhatsAppBookingUrl({
                            serviceName: service.title,
                            packageName: service.packages[0]?.name || 'Starter Consultation',
                          })}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1.5 px-2 text-[11px] font-extrabold text-[#102B4E] bg-[#B7E532] hover:bg-[#a6d628] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Bulk Cart Bar */}
      {bulkCart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl bg-[#102B4E]/95 dark:bg-[#0A1727]/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-[#B7E532]/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B7E532] text-[#102B4E] flex items-center justify-center font-black shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">Bulk Order Cart:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#B7E532] text-[10px] font-black border border-[#B7E532]/40">
                  {bulkCart.length} Services • 10% Discount Applied
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5 max-w-md truncate">
                {bulkCart.map(c => c.service.title.split(' ')[0]).join(', ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setBulkCart([])}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 cursor-pointer font-bold"
            >
              Clear
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-5 py-2.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Schedule All ({bulkCart.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Booking Modal */}
      <BulkBookingModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        cart={bulkCart}
        onUpdateCartItem={handleUpdateCartItem}
        onRemoveCartItem={handleRemoveCartItem}
        onClearCart={() => setBulkCart([])}
      />

      {/* Floating Compare Bar */}
      <CompareFloatingBar
        selectedServices={comparedServices}
        onRemoveService={(id) => setComparedServiceIds(prev => prev.filter(x => x !== id))}
        onClearAll={() => setComparedServiceIds([])}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      {/* Floating Quick Filter Bar (Instant Fast Sorting without list reload) */}
      <FloatingQuickFilterBar
        activeFilter={floatingQuickFilter}
        onToggleFilter={handleToggleFloatingFilter}
        onReset={handleResetFloatingFilter}
        resultCount={filteredServices.length}
        hasOtherFloatingBars={comparedServices.length > 0 || bulkCart.length > 0}
      />

      {/* Side-by-Side Comparison Modal Matrix */}
      <CompareServicesModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        services={comparedServices}
        selectedCountry={selectedCountry}
        onRemoveService={(id) => setComparedServiceIds(prev => prev.filter(x => x !== id))}
        onBookService={(srv) => {
          setIsCompareModalOpen(false);
          onBookService(srv);
        }}
      />

      {/* Pan-African Currency Converter Tool Modal */}
      {isCurrencyToolOpen && (
        <CurrencyConverterTool
          isOpen={isCurrencyToolOpen}
          onClose={() => setIsCurrencyToolOpen(false)}
          variant="modal"
        />
      )}
    </section>
  );
};
