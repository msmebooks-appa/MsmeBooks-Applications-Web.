import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  MapPin, 
  ArrowRight, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Building,
  Plus,
  Minus,
  RotateCcw,
  Navigation,
  LocateFixed,
  ZoomIn,
  Compass,
  Maximize2,
  Star,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Layers,
  Eye,
  Volume2,
  Phone,
  Mail,
  Clock,
  Flame,
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  Zap,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Calculator,
  Cpu,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { COUNTRIES_LIST, PARTNERS_DATA } from '../data/partnersData';
import { 
  COUNTRY_HEATMAP_DATA, 
  CountryHeatmapItem, 
  HeatmapMetric, 
  HEATMAP_METRIC_CONFIG, 
  getCountryHeatmapStyle,
  CoverageDensityTier,
  CoverageTierInfo,
  COVERAGE_TIER_CONFIG,
  getCountryCoverageTier,
  getCoverageHeatmapStyle,
} from '../data/countryHeatmapData';
import { Partner } from '../types';
import { 
  calculateDistanceKm, 
  formatDistanceKm, 
  getPartnerCoordinates, 
  projectLatLngToSvgPercent,
  findNearestCity,
} from '../utils/geoCoordinates';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyToggle } from './CurrencyToggle';
import { MapLegendAccessibility } from './MapLegendAccessibility';

interface GlobalMapSectionProps {
  filteredPartners?: Partner[];
  isDirectoryFiltered?: boolean;
  onResetDirectoryFilters?: () => void;
  onSelectCountry: (countryName: string) => void;
  onSelectPartner?: (partner: Partner) => void;
  onContactPartner?: (partner: Partner) => void;
  onOpenBecomePartner?: () => void;
  focusedPartnerId?: string | null;
  onFocusedPartnerChange?: (partnerId: string | null) => void;
  onLogAnnouncement?: (message: string) => void;
  onSyncLocationFilters?: (country: string, city: string) => void;
}

interface RegionPreset {
  id: string;
  name: string;
  flag: string;
  scale: number;
  cx: number;
  cy: number;
  description: string;
  hubIds: string[];
}

const REGION_PRESETS: RegionPreset[] = [
  {
    id: 'global',
    name: 'Global',
    flag: '🌍',
    scale: 1,
    cx: 400,
    cy: 250,
    description: 'Global Overview & Pan-African Trade Ecosystem',
    hubIds: [],
  },
  {
    id: 'sub-saharan-africa',
    name: 'Sub-Saharan Africa',
    flag: '🌍',
    scale: 1.85,
    cx: 395,
    cy: 310,
    description: 'Sub-Saharan Africa: West, East, Central & Southern Africa Hubs',
    hubIds: [
      'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Uganda', 'Tanzania',
      'Rwanda', 'Cameroon', "Côte d'Ivoire", 'Senegal', 'Ethiopia', 'Zambia',
      'Botswana', 'Zimbabwe', 'Namibia'
    ],
  },
  {
    id: 'north-america',
    name: 'North America',
    flag: '🇺🇸',
    scale: 2.6,
    cx: 160,
    cy: 175,
    description: 'North America: United States & Canada Trade & Financial Corridors',
    hubIds: ['United States', 'Canada'],
  },
  {
    id: 'west-africa',
    name: 'West Africa',
    flag: '🇳🇬',
    scale: 2.45,
    cx: 342,
    cy: 268,
    description: 'Nigeria, Ghana, Côte d\'Ivoire, Senegal, Cameroon',
    hubIds: ['Nigeria', 'Ghana', 'Côte d\'Ivoire', 'Senegal', 'Cameroon'],
  },
  {
    id: 'east-africa',
    name: 'East Africa',
    flag: '🇰🇪',
    scale: 2.5,
    cx: 444,
    cy: 288,
    description: 'Kenya, Uganda, Tanzania, Rwanda, Ethiopia',
    hubIds: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'],
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    flag: '🇿🇦',
    scale: 2.3,
    cx: 410,
    cy: 388,
    description: 'South Africa & Southern Commercial Belt',
    hubIds: ['South Africa', 'Zambia', 'Botswana', 'Zimbabwe', 'Namibia'],
  },
  {
    id: 'north-africa',
    name: 'North Africa',
    flag: '🇪🇬',
    scale: 2.25,
    cx: 375,
    cy: 185,
    description: 'Egypt & Morocco Trade Hubs',
    hubIds: ['Egypt', 'Morocco'],
  },
  {
    id: 'global-corridors',
    name: 'Global Corridors',
    flag: '🌐',
    scale: 1.45,
    cx: 330,
    cy: 185,
    description: 'United Kingdom, United States, Canada, UAE Bridges',
    hubIds: ['United Kingdom', 'United States', 'Canada', 'UAE', 'India'],
  },
];

// Sub-city hubs revealed when zoomed in
const SUB_CITIES = [
  // West Africa
  { name: 'Lagos', country: 'Nigeria', x: 44, y: 53.5, partners: 84 },
  { name: 'Abuja', country: 'Nigeria', x: 46, y: 51, partners: 36 },
  { name: 'Port Harcourt', country: 'Nigeria', x: 45.8, y: 55.5, partners: 22 },
  { name: 'Accra', country: 'Ghana', x: 40, y: 55.5, partners: 45 },
  { name: 'Kumasi', country: 'Ghana', x: 39.2, y: 54, partners: 23 },
  { name: 'Abidjan', country: 'Côte d\'Ivoire', x: 38, y: 54.5, partners: 26 },
  { name: 'Dakar', country: 'Senegal', x: 33.5, y: 49.5, partners: 27 },
  { name: 'Douala', country: 'Cameroon', x: 47.5, y: 56.5, partners: 16 },
  // East Africa
  { name: 'Nairobi', country: 'Kenya', x: 57, y: 56.5, partners: 58 },
  { name: 'Mombasa', country: 'Kenya', x: 58.2, y: 59, partners: 31 },
  { name: 'Kampala', country: 'Uganda', x: 53.6, y: 54.5, partners: 41 },
  { name: 'Dar es Salaam', country: 'Tanzania', x: 57.2, y: 62, partners: 26 },
  { name: 'Arusha', country: 'Tanzania', x: 55.5, y: 59.8, partners: 12 },
  { name: 'Kigali', country: 'Rwanda', x: 52, y: 57, partners: 29 },
  // Southern
  { name: 'Johannesburg', country: 'South Africa', x: 51.8, y: 77.2, partners: 56 },
  { name: 'Cape Town', country: 'South Africa', x: 48.5, y: 81, partners: 38 },
  // North America
  { name: 'Atlanta', country: 'United States', x: 20, y: 36, partners: 18 },
  { name: 'New York', country: 'United States', x: 23, y: 32, partners: 16 },
  { name: 'Toronto', country: 'Canada', x: 21, y: 30, partners: 14 },
];

export const PARTNER_MAP_COORDINATES: Record<string, { x: number; y: number }> = {
  'p-01': { x: 44.5, y: 53.5 }, // Lagos, Nigeria
  'p-02': { x: 57.0, y: 56.5 }, // Nairobi, Kenya
  'p-03': { x: 40.0, y: 55.5 }, // Accra, Ghana
  'p-04': { x: 51.8, y: 77.2 }, // Johannesburg, South Africa
  'p-05': { x: 52.0, y: 57.0 }, // Kigali, Rwanda
  'p-06': { x: 54.0, y: 38.0 }, // Cairo, Egypt
  'p-07': { x: 39.0, y: 36.0 }, // Casablanca, Morocco
  'p-08': { x: 33.5, y: 49.5 }, // Dakar, Senegal
  'p-09': { x: 38.0, y: 54.5 }, // Abidjan, Côte d'Ivoire
  'p-10': { x: 53.6, y: 54.5 }, // Kampala, Uganda
  'p-11': { x: 57.2, y: 62.0 }, // Dar es Salaam, Tanzania
  'p-12': { x: 47.5, y: 56.5 }, // Douala, Cameroon
  'p-13': { x: 56.5, y: 48.0 }, // Addis Ababa, Ethiopia
  'p-14': { x: 51.0, y: 68.0 }, // Lusaka, Zambia
  'p-15': { x: 50.0, y: 74.0 }, // Gaborone, Botswana
  'p-16': { x: 41.0, y: 25.0 }, // London, United Kingdom
  'p-17': { x: 20.0, y: 36.0 }, // Atlanta, United States
  'p-18': { x: 62.0, y: 42.0 }, // Dubai, UAE
  'p-19': { x: 18.0, y: 31.0 }, // Toronto, Canada
  'p-20': { x: 68.0, y: 45.0 }, // Mumbai, India
};

export interface MapHubItem {
  name: string;
  flag: string;
  count: number;
  cities: string;
  x: number;
  y: number;
  tier: string;
  region: string;
}

// Map coordinates and regional tiers for highlighted country hubs
const HUB_METADATA_MAP: Record<string, { x: number; y: number; tier: string; region: string }> = {
  'Nigeria': { x: 45, y: 53, tier: 'Primary Hub', region: 'west-africa' },
  'Ghana': { x: 40, y: 55, tier: 'West Africa Hub', region: 'west-africa' },
  'Kenya': { x: 57, y: 57, tier: 'East Africa Hub', region: 'east-africa' },
  'South Africa': { x: 51, y: 78, tier: 'Southern Africa Hub', region: 'southern-africa' },
  'Uganda': { x: 54, y: 55, tier: 'Regional Hub', region: 'east-africa' },
  'Tanzania': { x: 56, y: 61, tier: 'Regional Hub', region: 'east-africa' },
  'Rwanda': { x: 52, y: 57, tier: 'Innovation Hub', region: 'east-africa' },
  'Cameroon': { x: 48, y: 56, tier: 'Central Africa Hub', region: 'west-africa' },
  'Côte d\'Ivoire': { x: 38, y: 54, tier: 'Francophone Hub', region: 'west-africa' },
  'Senegal': { x: 34, y: 50, tier: 'Atlantic Hub', region: 'west-africa' },
  'Egypt': { x: 54, y: 38, tier: 'North Africa Hub', region: 'north-africa' },
  'Morocco': { x: 39, y: 36, tier: 'Maghreb Hub', region: 'north-africa' },
  'Ethiopia': { x: 56.5, y: 48, tier: 'Horn of Africa Hub', region: 'east-africa' },
  'Zambia': { x: 51, y: 68, tier: 'Regional Belt Hub', region: 'southern-africa' },
  'Zimbabwe': { x: 53, y: 71, tier: 'Regional Belt Hub', region: 'southern-africa' },
  'Botswana': { x: 50, y: 74, tier: 'Regional Belt Hub', region: 'southern-africa' },
  'Namibia': { x: 46, y: 73, tier: 'Atlantic Belt Hub', region: 'southern-africa' },
  'United Kingdom': { x: 41, y: 25, tier: 'Global Corridor', region: 'global-corridors' },
  'United States': { x: 20, y: 36, tier: 'North America Hub', region: 'north-america' },
  'Canada': { x: 18, y: 31, tier: 'North America Hub', region: 'north-america' },
  'UAE': { x: 62, y: 42, tier: 'Trade Corridor', region: 'global-corridors' },
  'India': { x: 68, y: 45, tier: 'Global Corridor', region: 'global-corridors' },
  'Australia': { x: 80, y: 75, tier: 'Global Corridor', region: 'global-corridors' },
};

export type MarkerLegendType = 'all' | 'accountant' | 'consultant' | 'technology';

export function getPartnerCategory(partnerType: string = ''): 'accountant' | 'consultant' | 'technology' {
  const t = (partnerType || '').toLowerCase();
  if (t.includes('account') || t.includes('audit') || t.includes('tax')) {
    return 'accountant';
  }
  if (t.includes('consult') || t.includes('advisor') || t.includes('associate')) {
    return 'consultant';
  }
  return 'technology';
}

export const GlobalMapSection: React.FC<GlobalMapSectionProps> = ({ 
  filteredPartners,
  isDirectoryFiltered = false,
  onResetDirectoryFilters,
  onSelectCountry, 
  onSelectPartner, 
  onContactPartner,
  onOpenBecomePartner,
  focusedPartnerId,
  onFocusedPartnerChange,
  onLogAnnouncement,
  onSyncLocationFilters,
}) => {
  const [activeCountry, setActiveCountry] = useState<string>('Nigeria');
  const [hoveredHub, setHoveredHub] = useState<MapHubItem | null>(null);
  const { formatBudget } = useCurrency();

  // Search input state for filtering map markers
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Partner Marker for Interactive Tooltip Preview
  const [selectedPartnerMarker, setSelectedPartnerMarker] = useState<Partner | null>(null);
  const [hoveredPartnerMarker, setHoveredPartnerMarker] = useState<Partner | null>(null);
  const hoverPartnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePartnerPinMouseEnter = useCallback((partner: Partner) => {
    if (hoverPartnerTimeoutRef.current) {
      clearTimeout(hoverPartnerTimeoutRef.current);
      hoverPartnerTimeoutRef.current = null;
    }
    setHoveredPartnerMarker(partner);
  }, []);

  const handlePartnerPinMouseLeave = useCallback(() => {
    if (hoverPartnerTimeoutRef.current) {
      clearTimeout(hoverPartnerTimeoutRef.current);
    }
    // 280ms grace window ensures smooth transition without premature dismissal
    hoverPartnerTimeoutRef.current = setTimeout(() => {
      setHoveredPartnerMarker(null);
    }, 280);
  }, []);

  const handleHoverCardMouseEnter = useCallback(() => {
    if (hoverPartnerTimeoutRef.current) {
      clearTimeout(hoverPartnerTimeoutRef.current);
      hoverPartnerTimeoutRef.current = null;
    }
  }, []);

  const handleHoverCardMouseLeave = useCallback(() => {
    if (hoverPartnerTimeoutRef.current) {
      clearTimeout(hoverPartnerTimeoutRef.current);
    }
    hoverPartnerTimeoutRef.current = setTimeout(() => {
      setHoveredPartnerMarker(null);
    }, 220);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverPartnerTimeoutRef.current) {
        clearTimeout(hoverPartnerTimeoutRef.current);
      }
    };
  }, []);

  const [showPartnerMarkers, setShowPartnerMarkers] = useState<boolean>(true);
  const [showCountryHubs, setShowCountryHubs] = useState<boolean>(true);

  // Custom Keyboard Navigation State
  const [keyboardFocusedMarkerId, setKeyboardFocusedMarkerId] = useState<string | null>(null);
  
  // Floating Map Legend State & Marker Type Filter
  const [selectedLegendType, setSelectedLegendType] = useState<MarkerLegendType>('all');
  const [isLegendCollapsed, setIsLegendCollapsed] = useState<boolean>(false);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string | null>(null);

  // 'Find Partners Near Me' Geolocation State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
    label: string;
  } | null>(null);
  const [nearMeResult, setNearMeResult] = useState<{
    nearestPartner: Partner;
    distanceKm: number;
    top3: { partner: Partner; distanceKm: number }[];
  } | null>(null);
  const [locationNotice, setLocationNotice] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [isNearMeActive, setIsNearMeActive] = useState<boolean>(false);

  // Regional Coverage Heatmap & Partner Density Overlay State
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapMetric, setHeatmapMetric] = useState<HeatmapMetric>('density');
  const [hoveredHeatmapCountry, setHoveredHeatmapCountry] = useState<CountryHeatmapItem | null>(null);
  const [selectedHeatmapCountry, setSelectedHeatmapCountry] = useState<CountryHeatmapItem | null>(() => {
    return COUNTRY_HEATMAP_DATA.find(c => c.country === 'Nigeria') || COUNTRY_HEATMAP_DATA[0];
  });
  const [coverageTierFilter, setCoverageTierFilter] = useState<'all' | CoverageDensityTier>('all');
  const [spotlightUnderserved, setSpotlightUnderserved] = useState<boolean>(false);
  const [underservedIndex, setUnderservedIndex] = useState<number>(0);

  // Accessibility: Screen Reader ARIA-Live Assertive Status Announcer State
  const [announcement, setAnnouncement] = useState<string>('Map ready. 20 global hubs and certified partner markers loaded. Use arrow keys to navigate markers.');
  const announceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const announce = useCallback((message: string) => {
    if (announceTimeoutRef.current) {
      clearTimeout(announceTimeoutRef.current);
    }
    // Briefly clear and set to force screen reader DOM text mutation notification
    setAnnouncement('');
    announceTimeoutRef.current = setTimeout(() => {
      setAnnouncement(message);
      if (onLogAnnouncement) {
        onLogAnnouncement(message);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('msme-a11y-announcement', {
          detail: {
            message,
            timestamp: new Date().toLocaleTimeString(),
            type: 'assertive',
          }
        }));
      }
    }, 40);
  }, [onLogAnnouncement]);

  // Accessibility: High Contrast Mode for Visually Impaired Users
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);

  // Switch between 'heatmap' (Regional Coverage Heatmap) and 'pins' (Default Marker Pin View)
  const handleSwitchMapMode = (mode: 'heatmap' | 'pins') => {
    if (mode === 'pins') {
      setShowHeatmap(false);
      setShowCountryHubs(true);
      setShowPartnerMarkers(true);
      setSpotlightUnderserved(false);
      announce('Switched to Default Marker Pin view. Certified partner pins highlighted.');
    } else {
      setShowHeatmap(true);
      setShowCountryHubs(true);
      setShowPartnerMarkers(true);
      announce('Switched to Regional Coverage Heatmap view. Country density shading enabled.');
    }
  };

  // Underserved regions memo (< 25 local certified partners)
  const underservedCountries = useMemo(() => {
    return COUNTRY_HEATMAP_DATA.filter(c => c.partnerCount < 25);
  }, []);

  // Zoom and Pan State
  const [scale, setScale] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeRegion, setActiveRegion] = useState<string>('global');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number; moved: boolean }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
    moved: false,
  });

  // Close tooltip on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPartnerMarker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const highlightedHubs: MapHubItem[] = COUNTRIES_LIST
    .filter(country => HUB_METADATA_MAP[country.name] !== undefined)
    .map(country => {
      const meta = HUB_METADATA_MAP[country.name];
      return {
        name: country.name,
        flag: country.flag,
        count: country.partnerCount,
        cities: country.cities.slice(0, 3).join(', '),
        x: meta.x,
        y: meta.y,
        tier: meta.tier,
        region: meta.region,
      };
    });

  // Real-time filtering of map country hubs based on search input
  const filteredHubs: MapHubItem[] = useMemo(() => {
    if (!searchQuery.trim()) return highlightedHubs;
    const q = searchQuery.toLowerCase().trim();
    return highlightedHubs.filter(hub => {
      const matchesName = hub.name.toLowerCase().includes(q);
      const matchesCities = hub.cities.toLowerCase().includes(q);
      const matchesTier = hub.tier.toLowerCase().includes(q);
      const matchesRegion = hub.region.toLowerCase().includes(q);
      const countryData = COUNTRIES_LIST.find(c => c.name.toLowerCase() === hub.name.toLowerCase());
      const matchesCountryCities = countryData?.cities.some(city => city.toLowerCase().includes(q));
      return matchesName || matchesCities || matchesTier || matchesRegion || Boolean(matchesCountryCities);
    });
  }, [highlightedHubs, searchQuery]);

  const sourceFilteredPartners = filteredPartners ?? PARTNERS_DATA;

  // Dynamically resolve SVG coordinates (%) for EVERY partner in the currently filtered results
  const partnerPinCoordinates = useMemo<Record<string, { x: number; y: number }>>(() => {
    const resolvedBase: Record<string, { x: number; y: number }> = {};
    const bucketCounts: Record<string, string[]> = {};

    sourceFilteredPartners.forEach((partner) => {
      let baseCoords = PARTNER_MAP_COORDINATES[partner.id];

      if (!baseCoords) {
        const subCityMatch = SUB_CITIES.find(
          (sc) => sc.name.toLowerCase() === partner.city.trim().toLowerCase()
        );
        if (subCityMatch) {
          baseCoords = { x: subCityMatch.x, y: subCityMatch.y };
        } else {
          const geo = getPartnerCoordinates(partner);
          const projected = projectLatLngToSvgPercent(geo.lat, geo.lng);
          const hubFallback = HUB_METADATA_MAP[partner.country];
          baseCoords = projected || (hubFallback ? { x: hubFallback.x, y: hubFallback.y } : { x: 45, y: 50 });
        }
      }

      resolvedBase[partner.id] = baseCoords;
      const bucketKey = `${baseCoords.x.toFixed(1)}_${baseCoords.y.toFixed(1)}`;
      if (!bucketCounts[bucketKey]) {
        bucketCounts[bucketKey] = [];
      }
      bucketCounts[bucketKey].push(partner.id);
    });

    // Apply gentle deterministic radial offset when multiple filtered partners share exact coordinates
    const finalCoords: Record<string, { x: number; y: number }> = {};
    Object.values(bucketCounts).forEach((idsInBucket) => {
      if (idsInBucket.length === 1) {
        const id = idsInBucket[0];
        finalCoords[id] = resolvedBase[id];
      } else {
        idsInBucket.forEach((id, idx) => {
          const base = resolvedBase[id];
          const angle = (idx / idsInBucket.length) * Math.PI * 2;
          const radius = 1.65;
          finalCoords[id] = {
            x: Math.max(4, Math.min(96, +(base.x + Math.cos(angle) * radius).toFixed(2))),
            y: Math.max(4, Math.min(96, +(base.y + Math.sin(angle) * radius).toFixed(2))),
          };
        });
      }
    });

    return finalCoords;
  }, [sourceFilteredPartners]);

  // Real-time filtering of partner markers based on directory filtered results, map search input & legend filters
  const filteredPartnerMarkers = useMemo(() => {
    let partnersWithCoords = [...sourceFilteredPartners];

    // Filter by marker type if legend selection is active (Accountant, Consultant, Technology)
    if (selectedLegendType !== 'all') {
      partnersWithCoords = partnersWithCoords.filter(
        (p) => getPartnerCategory(p.partnerType) === selectedLegendType
      );
    }

    // Filter by partner tier from screen-reader accessible tier legend
    if (selectedTierFilter) {
      if (selectedTierFilter.includes('Platinum')) {
        partnersWithCoords = partnersWithCoords.filter((p) => p.level === 'Platinum');
      } else if (selectedTierFilter.includes('Gold')) {
        partnersWithCoords = partnersWithCoords.filter((p) => p.level === 'Gold');
      } else if (selectedTierFilter.includes('Silver')) {
        partnersWithCoords = partnersWithCoords.filter((p) => p.level === 'Silver');
      } else if (selectedTierFilter.includes('Verified')) {
        partnersWithCoords = partnersWithCoords.filter((p) => p.verified);
      }
    }

    if (!searchQuery.trim()) return partnersWithCoords;
    const q = searchQuery.toLowerCase().trim();
    return partnersWithCoords.filter((p) => {
      const matchesCountry = p.country.toLowerCase().includes(q);
      const matchesCity = p.city.toLowerCase().includes(q);
      const matchesArea = p.primaryServiceArea?.toLowerCase().includes(q);
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesType = p.partnerType?.toLowerCase().includes(q);
      return matchesCountry || matchesCity || Boolean(matchesArea) || matchesName || Boolean(matchesType);
    });
  }, [sourceFilteredPartners, searchQuery, selectedLegendType, selectedTierFilter]);

  // Real-time filtering of secondary city nodes based on search input
  const filteredSubCities = useMemo(() => {
    if (!searchQuery.trim()) return SUB_CITIES;
    const q = searchQuery.toLowerCase().trim();
    return SUB_CITIES.filter(sub => 
      sub.name.toLowerCase().includes(q) || 
      sub.country.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Total matching visible markers on the map
  const totalMatchingMarkers = (showCountryHubs ? filteredHubs.length : 0) + (showPartnerMarkers ? filteredPartnerMarkers.length : 0);

  const currentHub = filteredHubs.find(h => h.name === activeCountry) || filteredHubs[0] || highlightedHubs[0];
  const displayHub = hoveredHub || currentHub;

  // Auto-close selected partner marker if it gets filtered out by search or directory filters
  useEffect(() => {
    if (selectedPartnerMarker) {
      const isStillVisible = filteredPartnerMarkers.some(p => p.id === selectedPartnerMarker.id);
      if (!isStillVisible) {
        setSelectedPartnerMarker(null);
      }
    }
  }, [filteredPartnerMarkers, selectedPartnerMarker]);

  // Auto-switch active country if current activeCountry is filtered out
  useEffect(() => {
    if (searchQuery.trim() && filteredHubs.length > 0) {
      const hasActive = filteredHubs.some(h => h.name.toLowerCase() === activeCountry.toLowerCase());
      if (!hasActive) {
        setActiveCountry(filteredHubs[0].name);
      }
    }
  }, [searchQuery, filteredHubs, activeCountry]);

  // Debounced screen-reader announcement for search queries & result updates
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      const matchCount = (showCountryHubs ? filteredHubs.length : 0) + (showPartnerMarkers ? filteredPartnerMarkers.length : 0);
      if (matchCount === 0) {
        announce(`Search results updated: 0 partners found matching "${searchQuery}". Try another city or country.`);
      } else {
        announce(`Search results updated: ${matchCount} ${matchCount === 1 ? 'partner' : 'partners'} found matching "${searchQuery}".`);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredHubs.length, filteredPartnerMarkers.length, showCountryHubs, showPartnerMarkers, announce]);

  // Handle typing in search input with immediate visual feedback & smart auto-centering
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const q = val.trim().toLowerCase();
    if (q.length >= 2) {
      // Find matching country hubs
      const matchedHub = highlightedHubs.find(h => 
        h.name.toLowerCase() === q || 
        h.cities.toLowerCase().split(', ').some(c => c.toLowerCase() === q || c.toLowerCase().startsWith(q))
      );
      if (matchedHub && activeCountry !== matchedHub.name) {
        setActiveCountry(matchedHub.name);
        focusOnHub(matchedHub);
      } else {
        // Also check individual partner cities or countries
        const matchedPartner = PARTNERS_DATA.find(p => 
          (p.city.toLowerCase() === q || p.country.toLowerCase() === q) && 
          PARTNER_MAP_COORDINATES[p.id] !== undefined
        );
        if (matchedPartner) {
          focusOnPartner(matchedPartner);
        }
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleResetView();
    announce('Search cleared: All partner hubs and markers restored on map.');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredHubs.length > 0) {
        focusOnHub(filteredHubs[0]);
        announce(`Focused on top hub result: ${filteredHubs[0].name}`);
      } else if (filteredPartnerMarkers.length > 0) {
        focusOnPartner(filteredPartnerMarkers[0]);
        announce(`Focused on top partner result: ${filteredPartnerMarkers[0].name}`);
      }
    } else if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  const handleQuickFilterClick = (queryText: string) => {
    setSearchQuery(queryText);
    const q = queryText.toLowerCase().trim();
    const matchedHub = highlightedHubs.find(h => 
      h.name.toLowerCase().includes(q) || 
      h.cities.toLowerCase().includes(q)
    );
    if (matchedHub) {
      focusOnHub(matchedHub);
      setActiveCountry(matchedHub.name);
      announce(`Search filter applied: ${queryText}. Focused on ${matchedHub.name} hub.`);
    } else {
      const matchedPartner = PARTNERS_DATA.find(p => 
        (p.city.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)) && 
        PARTNER_MAP_COORDINATES[p.id] !== undefined
      );
      if (matchedPartner) {
        focusOnPartner(matchedPartner);
        announce(`Search filter applied: ${queryText}. Focused on partner ${matchedPartner.name}.`);
      } else {
        announce(`Search filter applied for ${queryText}.`);
      }
    }
  };

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Smooth hover handlers with small buffer delay for seamless mouse movement
  const handleMarkerMouseEnter = (hub: MapHubItem) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredHub(hub);
  };

  const handleMarkerMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredHub(null);
    }, 180);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredHub(null);
    }, 180);
  };

  // Clamping pan offsets to prevent dragging map out of view
  const clampPan = useCallback((x: number, y: number, currentScale: number) => {
    const marginX = 140;
    const marginY = 120;
    const minX = 800 - 800 * currentScale - marginX;
    const maxX = marginX;
    const minY = 500 - 500 * currentScale - marginY;
    const maxY = marginY;
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, []);

  // Compute pan to center an SVG point (cx, cy) in the 800x500 viewport at scale
  const getPanForCenter = useCallback((cx: number, cy: number, targetScale: number) => {
    return {
      x: 400 - cx * targetScale,
      y: 250 - cy * targetScale,
    };
  }, []);

  // Select region preset with smooth deceleration animation
  const handleSelectRegion = (region: RegionPreset) => {
    setIsAnimating(true);
    setActiveRegion(region.id);
    setScale(region.scale);
    const { x, y } = getPanForCenter(region.cx, region.cy, region.scale);
    setPan(clampPan(x, y, region.scale));
    announce(`Map filtered by region: ${region.name}. ${region.description}`);
  };

  // Focus directly on a specific hub pin
  const focusOnHub = (hub: MapHubItem) => {
    setIsAnimating(true);
    const svgX = (hub.x / 100) * 800;
    const svgY = (hub.y / 100) * 500;
    const targetScale = Math.max(scale, 2.4);
    setScale(targetScale);
    const { x, y } = getPanForCenter(svgX, svgY, targetScale);
    setPan(clampPan(x, y, targetScale));
    setActiveCountry(hub.name);
    if (hub.region) {
      setActiveRegion(hub.region);
    }
    const matchedHeatmap = COUNTRY_HEATMAP_DATA.find(c => c.country.toLowerCase() === hub.name.toLowerCase());
    if (matchedHeatmap) {
      setSelectedHeatmapCountry(matchedHeatmap);
    }
    announce(`Map focused on ${hub.name} hub: ${hub.cities}. ${hub.count} partners available.`);
  };

  // Focus directly on a specific country from the heatmap layer
  const focusOnHeatmapCountry = (item: CountryHeatmapItem) => {
    setIsAnimating(true);
    const svgX = (item.center.x / 100) * 800;
    const svgY = (item.center.y / 100) * 500;
    const targetScale = Math.max(scale, 2.1);
    setScale(targetScale);
    const { x, y } = getPanForCenter(svgX, svgY, targetScale);
    setPan(clampPan(x, y, targetScale));
    setActiveCountry(item.country);
    setSelectedHeatmapCountry(item);
    setSelectedPartnerMarker(null);
    const tierInfo = getCountryCoverageTier(item);
    announce(`Map focused on ${item.country}: ${item.partnerCount} verified partners. Coverage tier: ${tierInfo.label}.`);
  };

  // Jump smoothly through underserved markets to highlight opportunities
  const jumpToNextUnderserved = () => {
    if (underservedCountries.length === 0) return;
    const nextIdx = (underservedIndex + 1) % underservedCountries.length;
    setUnderservedIndex(nextIdx);
    const country = underservedCountries[nextIdx];
    setShowHeatmap(true);
    setSpotlightUnderserved(true);
    focusOnHeatmapCountry(country);
    announce(`Focused on underserved opportunity market: ${country.country}, with ${country.partnerCount} certified partners.`);
  };

  // Focus directly on a specific partner marker pin and show tooltip preview
  const focusOnPartner = (partner: Partner) => {
    setIsAnimating(true);
    const coords = partnerPinCoordinates[partner.id] || PARTNER_MAP_COORDINATES[partner.id] || { x: 45, y: 50 };
    const svgX = (coords.x / 100) * 800;
    const svgY = (coords.y / 100) * 500;
    const targetScale = Math.max(scale, 2.2);
    setScale(targetScale);
    const { x, y } = getPanForCenter(svgX, svgY, targetScale);
    setPan(clampPan(x, y, targetScale));
    setActiveCountry(partner.country);
    setSelectedPartnerMarker(partner);
    announce(`Selected partner: ${partner.name} in ${partner.city}, ${partner.country}. Rating: ${partner.rating} stars.`);
  };

  // Custom Keyboard Navigation Logic for Map Markers: Move focus between pins with arrow keys & audio cues
  const focusMarkerByKeyboard = useCallback((partner: Partner, index: number, total: number) => {
    setIsAnimating(true);
    setKeyboardFocusedMarkerId(partner.id);
    if (onFocusedPartnerChange) {
      onFocusedPartnerChange(partner.id);
    }
    const coords = partnerPinCoordinates[partner.id] || PARTNER_MAP_COORDINATES[partner.id] || { x: 45, y: 50 };
    const svgX = (coords.x / 100) * 800;
    const svgY = (coords.y / 100) * 500;
    const targetScale = Math.max(scale, 1.85);
    setScale(targetScale);
    const { x, y } = getPanForCenter(svgX, svgY, targetScale);
    setPan(clampPan(x, y, targetScale));
    setActiveCountry(partner.country);

    // Focus actual DOM element with retry for smooth screen-reader tracking
    setTimeout(() => {
      const el = document.getElementById(`partner-marker-${partner.id}`);
      if (el) {
        (el as HTMLElement).focus();
      }
    }, 25);

    // Audio cues with location name, tier, and partner verification status
    const verificationLabel = partner.verified ? 'Verified Certified Partner' : 'Registered Partner';
    announce(
      `Selected map pin ${index + 1} of ${total}: ${partner.name} located in ${partner.city}, ${partner.country}. Verification status: ${verificationLabel}, ${partner.level} Tier. Rating: ${partner.rating} stars. Press Enter to view profile or Space for preview details.`
    );
  }, [scale, getPanForCenter, clampPan, announce, onFocusedPartnerChange, partnerPinCoordinates]);

  const handleMarkerKeyDown = (
    e: React.KeyboardEvent,
    partner: Partner,
    currentIndex: number
  ) => {
    const total = filteredPartnerMarkers.length;
    if (total === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (currentIndex + 1) % total;
      const nextPartner = filteredPartnerMarkers[nextIdx];
      if (nextPartner) focusMarkerByKeyboard(nextPartner, nextIdx, total);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (currentIndex - 1 + total) % total;
      const prevPartner = filteredPartnerMarkers[prevIdx];
      if (prevPartner) focusMarkerByKeyboard(prevPartner, prevIdx, total);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const firstPartner = filteredPartnerMarkers[0];
      if (firstPartner) focusMarkerByKeyboard(firstPartner, 0, total);
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastPartner = filteredPartnerMarkers[total - 1];
      if (lastPartner) focusMarkerByKeyboard(lastPartner, total - 1, total);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (onSelectPartner) {
        onSelectPartner(partner);
      } else {
        setSelectedPartnerMarker(partner);
      }
      announce(`Opening partner profile for ${partner.name} in ${partner.city}.`);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setSelectedPartnerMarker(partner);
      focusOnPartner(partner);
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      if (onContactPartner) {
        onContactPartner(partner);
        announce(`Opening direct message dialog for ${partner.name}.`);
      } else if (onSelectPartner) {
        onSelectPartner(partner);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSelectedPartnerMarker(null);
      announce('Partner preview closed. Focus remains on map pin.');
    }
  };

  // Synchronize external focused partner request
  useEffect(() => {
    if (focusedPartnerId) {
      setKeyboardFocusedMarkerId(focusedPartnerId);
      const targetPartner = PARTNERS_DATA.find(p => p.id === focusedPartnerId);
      if (targetPartner) {
        const idx = filteredPartnerMarkers.findIndex(p => p.id === focusedPartnerId);
        const total = filteredPartnerMarkers.length;
        focusMarkerByKeyboard(targetPartner, idx >= 0 ? idx : 0, total);
      }
    }
  }, [focusedPartnerId, filteredPartnerMarkers, focusMarkerByKeyboard]);

  const handleMapKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      if (!keyboardFocusedMarkerId && filteredPartnerMarkers.length > 0) {
        e.preventDefault();
        focusMarkerByKeyboard(filteredPartnerMarkers[0], 0, filteredPartnerMarkers.length);
      }
    }
  };

  // Show Nearby: Uses browser Geolocation API to center map on the user's current city and filter results accordingly
  const handleShowNearby = () => {
    setIsLocating(true);
    setLocationNotice(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setIsLocating(false);
      setLocationNotice({
        type: 'info',
        message: 'Browser geolocation is unavailable. Centering on primary commercial hub (Lagos, Nigeria) and filtering nearby results.',
      });
      processUserCoordinates(6.5244, 3.3792, 'Lagos, Nigeria (Demo Hub)');
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        processUserCoordinates(latitude, longitude, 'Your Detected Location');
      },
      (err) => {
        console.warn('Geolocation query failed or blocked:', err);
        let noticeMsg = 'Location access was restricted or timed out. Centered on Lagos commercial hub and filtered nearby partners.';
        if (err.code === 1) {
          noticeMsg = 'Location permission was denied. Centered on Lagos commercial hub to display nearby verified partners.';
        }
        setLocationNotice({
          type: 'info',
          message: noticeMsg,
        });
        processUserCoordinates(6.5244, 3.3792, 'Lagos Regional Hub (Demo Location)');
      },
      geoOptions
    );
  };

  // Backward-compatible alias
  const handleFindPartnersNearMe = handleShowNearby;

  const processUserCoordinates = (lat: number, lng: number, label: string) => {
    setIsLocating(false);

    // 1. Identify closest canonical city & country using Haversine calculation
    const nearestCityInfo = findNearestCity(lat, lng);
    const detectedCity = nearestCityInfo.city;
    const detectedCountry = nearestCityInfo.country;

    // 2. Calculate distance to all verified partners with valid coordinates
    const verifiedPartners = PARTNERS_DATA.filter((p) => p.verified);
    const partnersWithDistances = verifiedPartners
      .map((partner) => {
        const pCoords = getPartnerCoordinates(partner);
        const distKm = calculateDistanceKm(lat, lng, pCoords.lat, pCoords.lng);
        return {
          partner,
          distanceKm: distKm,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    if (partnersWithDistances.length === 0) {
      setLocationNotice({
        type: 'error',
        message: 'No verified partners found in database.',
      });
      return;
    }

    const nearest = partnersWithDistances[0];
    const top3 = partnersWithDistances.slice(0, 3);

    // Convert real world user lat/lng to stylized SVG percentage
    const svgPercent = projectLatLngToSvgPercent(lat, lng);
    const svgX = (svgPercent.x / 100) * 800;
    const svgY = (svgPercent.y / 100) * 500;

    setUserLocation({
      lat,
      lng,
      svgX,
      svgY,
      label: `${detectedCity}, ${detectedCountry}`,
    });

    setNearMeResult({
      nearestPartner: nearest.partner,
      distanceKm: nearest.distanceKm,
      top3,
    });

    setIsNearMeActive(true);
    setShowPartnerMarkers(true);

    // 3. Center the map on the user's current city
    const citySvgPercent = projectLatLngToSvgPercent(nearestCityInfo.lat, nearestCityInfo.lng);
    const citySvgX = (citySvgPercent.x / 100) * 800;
    const citySvgY = (citySvgPercent.y / 100) * 500;
    const targetScale = 2.75; // Zoom in to clearly display the city hub and nearby partner markers
    setIsAnimating(true);
    setScale(targetScale);
    const { x, y } = getPanForCenter(citySvgX, citySvgY, targetScale);
    setPan(clampPan(x, y, targetScale));

    // 4. Filter results accordingly to the detected city
    setSearchQuery(detectedCity);
    setActiveCountry(detectedCountry);
    if (onSyncLocationFilters) {
      onSyncLocationFilters(detectedCountry, detectedCity);
    }

    // Select the partner marker in that city if available
    const cityPartner = PARTNERS_DATA.find(p => p.city.toLowerCase() === detectedCity.toLowerCase());
    if (cityPartner) {
      setSelectedPartnerMarker(cityPartner);
    } else {
      setSelectedPartnerMarker(nearest.partner);
    }

    setLocationNotice({
      type: 'success',
      message: `Centered on ${detectedCity}, ${detectedCountry} (${formatDistanceKm(nearestCityInfo.distanceKm)}). Filtered map & directory to nearby ${detectedCity} partners.`,
    });
    announce(`Map centered on your current city: ${detectedCity}, ${detectedCountry}. Filtered results to show nearby partners in ${detectedCity}.`);
  };

  const handleFallbackLocation = (lat: number, lng: number, label: string) => {
    processUserCoordinates(lat, lng, label);
  };

  const handleClearNearMe = () => {
    setIsNearMeActive(false);
    setUserLocation(null);
    setNearMeResult(null);
    setLocationNotice(null);
    setSearchQuery('');
    if (onSyncLocationFilters) {
      onSyncLocationFilters('', '');
    }
    handleResetView();
    announce('Cleared Show Nearby filter. Showing global overview.');
  };


  // Partner marker click handler for interactive preview tooltip
  const handlePartnerMarkerClick = (partner: Partner, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragStartRef.current.moved) return;

    if (selectedPartnerMarker?.id === partner.id) {
      setSelectedPartnerMarker(null);
      announce(`Deselected partner marker for ${partner.name}.`);
    } else {
      setSelectedPartnerMarker(partner);
      setActiveCountry(partner.country);
      setHoveredHub(null);
      announce(`Selected partner: ${partner.name} in ${partner.city}, ${partner.country}. Rating: ${partner.rating} stars.`);
    }
  };

  // Zoom In button
  const handleZoomIn = () => {
    setIsAnimating(true);
    setScale((prevScale) => {
      const nextScale = Math.min(4.5, +(prevScale + 0.5).toFixed(2));
      const currentCx = (400 - pan.x) / prevScale;
      const currentCy = (250 - pan.y) / prevScale;
      const newPan = getPanForCenter(currentCx, currentCy, nextScale);
      setPan(clampPan(newPan.x, newPan.y, nextScale));
      return nextScale;
    });
  };

  // Zoom Out button
  const handleZoomOut = () => {
    setIsAnimating(true);
    setScale((prevScale) => {
      const nextScale = Math.max(1.0, +(prevScale - 0.5).toFixed(2));
      const currentCx = (400 - pan.x) / prevScale;
      const currentCy = (250 - pan.y) / prevScale;
      const newPan = getPanForCenter(currentCx, currentCy, nextScale);
      setPan(clampPan(newPan.x, newPan.y, nextScale));
      if (nextScale <= 1.05) {
        setActiveRegion('global');
      }
      return nextScale;
    });
  };

  // Reset View to overview
  const handleResetView = () => {
    setIsAnimating(true);
    setScale(1.0);
    setPan({ x: 0, y: 0 });
    setActiveRegion('global');
    setSelectedPartnerMarker(null);
    setHoveredPartnerMarker(null);
    setHoveredHub(null);
    announce('Map view reset to Global overview at 100% zoom.');
  };


  // Attach non-passive wheel listener for smooth cursor-centered zooming
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const svgCursorX = (cursorX / rect.width) * 800;
      const svgCursorY = (cursorY / rect.height) * 500;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

      setScale((prevScale) => {
        const nextScale = Math.min(4.5, Math.max(1.0, +(prevScale * zoomFactor).toFixed(2)));
        if (nextScale === prevScale) return prevScale;

        setIsAnimating(false);

        setPan((prevPan) => {
          const pointInContentX = (svgCursorX - prevPan.x) / prevScale;
          const pointInContentY = (svgCursorY - prevPan.y) / prevScale;

          const newPanX = svgCursorX - pointInContentX * nextScale;
          const newPanY = svgCursorY - pointInContentY * nextScale;

          return clampPan(newPanX, newPanY, nextScale);
        });

        if (nextScale <= 1.05) {
          setActiveRegion('global');
        } else {
          setActiveRegion('custom');
        }

        return nextScale;
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [clampPan]);

  // Pointer drag event handlers for mouse and touch pan
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsAnimating(false);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }

    const container = mapContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const svgDx = (dx / rect.width) * 800;
    const svgDy = (dy / rect.height) * 500;

    const newPanX = dragStartRef.current.panX + svgDx;
    const newPanY = dragStartRef.current.panY + svgDy;

    setPan(clampPan(newPanX, newPanY, scale));
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        // safe fallback
      }
    }
  };

  return (
    <section id="global-map" className="py-20 bg-slate-100/70 dark:bg-gradient-to-b dark:from-[#07162c] dark:to-[#0a1e38] text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      
      {/* Background World Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Accessible ARIA-Live Assertive Status Announcer for Screen Readers */}
        <div
          id="map-screen-reader-announcer"
          data-testid="map-screen-reader-announcer"
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-lime-700 dark:text-lime-400">
            <Globe2 className="w-3.5 h-3.5" />
            <span>MsmeBooks Global Partner Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            MsmeBooks Partners Around the World
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore certified partner locations across 20 global hubs. Switch between the <strong className="text-slate-900 dark:text-white">Default Marker Pin View</strong> to pinpoint individual partner offices or the <strong className="text-slate-900 dark:text-white">Regional Coverage Heatmap</strong> to uncover underserved expansion markets.
          </p>

          {/* Visual Screen Reader Live Status Feedback Pill */}
          {announcement && (
            <div
              id="map-live-status-pill"
              data-testid="map-live-status-pill"
              aria-hidden="true"
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/95 dark:bg-slate-950/90 text-lime-400 border border-lime-500/40 text-xs font-semibold shadow-md transition-all duration-300"
            >
              <Volume2 className="w-3.5 h-3.5 text-lime-400 shrink-0 animate-pulse" />
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Screen Reader Live:</span>
              <span className="text-slate-100 font-medium truncate max-w-md">{announcement}</span>
            </div>
          )}

          {/* Primary View Mode Switcher: Marker Pins vs. Coverage Heatmap */}
          <div className="pt-2 flex flex-col items-center gap-2.5">
            <div 
              role="tablist" 
              aria-label="Map Display View Mode"
              className="inline-flex p-1.5 bg-slate-100 dark:bg-[#07192f] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-inner max-w-full overflow-x-auto"
            >
              {/* Default Marker Pin View Option */}
              <button
                type="button"
                id="btn-toggle-view-pins"
                data-testid="btn-toggle-view-pins"
                role="tab"
                aria-selected={!showHeatmap}
                onClick={() => handleSwitchMapMode('pins')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  !showHeatmap
                    ? 'bg-white dark:bg-sky-600 text-slate-950 dark:text-white shadow-md ring-1 ring-slate-900/10 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to default marker pin view showing exact partner locations and regional hubs"
              >
                <MapPin className={`w-3.5 h-3.5 ${!showHeatmap ? 'text-sky-500 dark:text-sky-200' : 'text-slate-400'}`} />
                <span>Default Marker Pins</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  !showHeatmap ? 'bg-sky-100 dark:bg-sky-700 text-sky-800 dark:text-sky-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {filteredPartnerMarkers.length} Pins
                </span>
              </button>

              {/* Regional Coverage Heatmap View Option */}
              <button
                type="button"
                id="btn-toggle-view-heatmap"
                data-testid="btn-toggle-view-heatmap"
                role="tab"
                aria-selected={showHeatmap}
                onClick={() => handleSwitchMapMode('heatmap')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  showHeatmap
                    ? 'bg-lime-500 text-slate-950 font-black shadow-md ring-2 ring-lime-400/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to regional coverage heatmap overlay visualizing partner density per country"
              >
                <Layers className={`w-3.5 h-3.5 ${showHeatmap ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>Regional Coverage Heatmap</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                  showHeatmap ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  Density Gradients
                </span>
              </button>
            </div>

            {/* Contextual Mode Sub-Bar & Accessibility Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {showHeatmap ? (
                <>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
                    Territories shaded by certified partner supply & density gradients.
                  </span>
                  <button
                    type="button"
                    id="btn-quick-spotlight-underserved"
                    data-testid="btn-quick-spotlight-underserved"
                    onClick={() => {
                      const next = !spotlightUnderserved;
                      setSpotlightUnderserved(next);
                      announce(next ? 'Spotlight enabled: Showing 7 underserved countries across Africa.' : 'Spotlight disabled: Showing all coverage tiers.');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                      spotlightUnderserved
                        ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20'
                        : 'bg-white dark:bg-[#07192f] text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500/60'
                    }`}
                    title="Highlight countries with fewer than 25 certified partners where client demand is highest"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{spotlightUnderserved ? 'Highlighting Underserved' : 'Spotlight Underserved Regions'}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      spotlightUnderserved ? 'bg-slate-950/25 text-slate-950' : 'bg-amber-400/20 text-amber-600 dark:text-amber-300'
                    }`}>
                      {underservedCountries.length}
                    </span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold">
                    <MapPin className="w-3.5 h-3.5" /> Marker Pin View Active:
                  </span>
                  <span>Uncluttered map highlighting certified partner locations, service areas & direct contact pins.</span>
                </div>
              )}

              {/* High Contrast Mode Toggle Button in Header */}
              <button
                type="button"
                id="btn-header-high-contrast"
                data-testid="btn-header-high-contrast"
                aria-pressed={highContrastMode}
                onClick={() => {
                  const next = !highContrastMode;
                  setHighContrastMode(next);
                  announce(next ? 'High contrast mode enabled for map markers and heatmaps.' : 'High contrast mode disabled.');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                  highContrastMode
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 ring-2 ring-yellow-400/40 font-black'
                    : 'bg-white dark:bg-[#07192f] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                }`}
                title="Toggle high contrast map mode for enhanced marker and border visibility"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{highContrastMode ? 'High Contrast ON' : 'High Contrast'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Map Marker Search & Filter Bar */}
        <div className="mb-4 bg-white/95 dark:bg-[#0b213e]/95 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    id="map-marker-search-input"
                    data-testid="map-marker-search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search map markers by country or city (e.g., Lagos, Nairobi, Ghana, Johannesburg)..."
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all shadow-inner"
                    aria-label="Filter map markers by country or city"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      id="btn-clear-map-search"
                      data-testid="btn-clear-map-search"
                      onClick={handleClearSearch}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 rounded-lg transition-colors flex items-center gap-1"
                      title="Clear search filter"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {/* Match Counter Badge, Show Nearby Action & Focus Action */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Show Nearby Toolbar Action Button */}
                  <button
                    type="button"
                    id="btn-show-nearby"
                    data-testid="btn-show-nearby"
                    onClick={isNearMeActive ? handleClearNearMe : handleShowNearby}
                    disabled={isLocating}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isNearMeActive
                        ? 'bg-lime-500 hover:bg-lime-400 text-slate-950 ring-2 ring-lime-400/50 shadow-lime-500/20'
                        : isLocating
                        ? 'bg-sky-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                    }`}
                    title="Show Nearby: Uses browser Geolocation API to center map on your current city and filter results accordingly"
                    aria-label="Show Nearby"
                  >
                    {isLocating ? (
                      <Activity className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <LocateFixed className={`w-3.5 h-3.5 ${isNearMeActive ? 'text-slate-950 font-black' : 'text-lime-500 dark:text-lime-400'}`} />
                    )}
                    <span>{isLocating ? 'Locating City...' : isNearMeActive ? `Showing Nearby: ${searchQuery || 'Active'}` : 'Show Nearby'}</span>
                  </button>

                  {isNearMeActive && (
                    <button
                      type="button"
                      id="btn-clear-nearby"
                      data-testid="btn-clear-nearby"
                      onClick={handleClearNearMe}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Clear nearby city filter and restore global view"
                    >
                      Clear Nearby
                    </button>
                  )}

                  <div
                    id="map-search-matches-count"
                    data-testid="map-search-matches-count"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      searchQuery.trim() || isDirectoryFiltered
                        ? totalMatchingMarkers > 0
                          ? 'bg-lime-500/15 border border-lime-500/40 text-lime-700 dark:text-lime-300'
                          : 'bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      searchQuery.trim() || isDirectoryFiltered
                        ? totalMatchingMarkers > 0 ? 'bg-lime-500 animate-pulse' : 'bg-rose-500'
                        : 'bg-sky-400'
                    }`} />
                    <span>
                      {searchQuery.trim()
                        ? totalMatchingMarkers > 0
                          ? `${totalMatchingMarkers} visible marker${totalMatchingMarkers === 1 ? '' : 's'} (${filteredHubs.length} hubs, ${filteredPartnerMarkers.length} partners)`
                          : 'No matching markers'
                        : isDirectoryFiltered
                        ? `Filtered Results: ${filteredPartnerMarkers.length} Partner Pin${filteredPartnerMarkers.length === 1 ? '' : 's'}`
                        : `${highlightedHubs.length} Hubs • ${filteredPartnerMarkers.length} Partner Pins`}
                    </span>
                  </div>

                  {isDirectoryFiltered && onResetDirectoryFilters && (
                    <button
                      type="button"
                      id="btn-reset-directory-filters-from-map"
                      data-testid="btn-reset-directory-filters-from-map"
                      onClick={onResetDirectoryFilters}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                      title="Show all partners by clearing active directory filters"
                    >
                      Show All ({PARTNERS_DATA.length})
                    </button>
                  )}

                  {searchQuery.trim() && totalMatchingMarkers > 0 && (
                    <button
                      type="button"
                      id="btn-focus-first-match"
                      data-testid="btn-focus-first-match"
                      onClick={() => {
                        if (filteredHubs.length > 0) focusOnHub(filteredHubs[0]);
                        else if (filteredPartnerMarkers.length > 0) focusOnPartner(filteredPartnerMarkers[0]);
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-lime-500 hover:bg-lime-400 text-slate-950 flex items-center gap-1 shadow-sm transition-all"
                      title="Focus on first matching marker"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Focus on Map</span>
                    </button>
                  )}

                  {/* Reset Map View Quick Action Button */}
                  <button
                    type="button"
                    id="btn-reset-map-view-toolbar"
                    data-testid="btn-reset-map-view-toolbar"
                    onClick={handleResetView}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-xs"
                    title="Reset Map View: restores the map to default zoom level (100%) and centers the global view"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-lime-500" />
                    <span>Reset View</span>
                  </button>
                </div>
              </div>

              {/* Quick filter suggestions */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-sky-400" />
                  <span>Quick Search:</span>
                </span>
                <button
                  type="button"
                  id="btn-chip-show-nearby"
                  data-testid="btn-chip-show-nearby"
                  onClick={isNearMeActive ? handleClearNearMe : handleShowNearby}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 border shadow-xs cursor-pointer ${
                    isNearMeActive
                      ? 'bg-lime-500 text-slate-950 border-lime-400 ring-2 ring-lime-400/40'
                      : 'bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-500/40 hover:bg-lime-500/25'
                  }`}
                  title="Show Nearby: Centers map on your current city and filters results"
                >
                  <LocateFixed className="w-3 h-3 text-lime-500 dark:text-lime-400" />
                  <span>📍 Show Nearby</span>
                </button>
                {[
                  { label: '🇳🇬 Lagos', val: 'Lagos' },
                  { label: '🇰🇪 Nairobi', val: 'Nairobi' },
                  { label: '🇿🇦 Johannesburg', val: 'Johannesburg' },
                  { label: '🇬🇭 Accra', val: 'Accra' },
                  { label: '🇷🇼 Kigali', val: 'Kigali' },
                  { label: '🇺🇸 Atlanta', val: 'Atlanta' },
                  { label: '🇬🇧 London', val: 'London' },
                  { label: '🇨🇦 Toronto', val: 'Toronto' },
                  { label: '🇨🇲 Douala', val: 'Douala' },
                  { label: '🇪🇬 Cairo', val: 'Cairo' },
                  { label: '🇺🇬 Kampala', val: 'Kampala' },
                ].map((item) => (
                  <button
                    key={item.val}
                    id={`btn-quick-search-${item.val.toLowerCase()}`}
                    data-testid={`btn-quick-search-${item.val.toLowerCase()}`}
                    type="button"
                    onClick={() => handleQuickFilterClick(item.val)}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                      searchQuery.toLowerCase() === item.val.toLowerCase()
                        ? 'bg-lime-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Focus Toolbar (West Africa, East Africa, Southern, North Africa, All) */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 dark:bg-[#0b213e]/95 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 sm:px-5 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                <Navigation className="w-4 h-4 text-lime-500 shrink-0" />
                <span>Focus Region:</span>
              </div>

              <div className="flex items-center flex-wrap gap-1.5 flex-1" id="region-zoom-controls" data-testid="region-zoom-controls">
                {REGION_PRESETS.map((region) => {
                  const isSelected = activeRegion === region.id || 
                    ((region.id === 'global' || region.id === 'all') && (activeRegion === 'global' || activeRegion === 'all'));
                  return (
                    <button
                      key={region.id}
                      id={`btn-region-${region.id}`}
                      data-testid={`btn-region-${region.id}`}
                      data-region={region.id}
                      type="button"
                      onClick={() => handleSelectRegion(region)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 shadow-md ring-2 ring-lime-400/40 font-black'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      }`}
                      title={region.description}
                    >
                      <span className="text-sm">{region.flag}</span>
                      <span>{region.name}</span>
                      {region.hubIds.length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                          isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {highlightedHubs.filter(h => region.hubIds.includes(h.name)).reduce((sum, h) => sum + h.count, 0)}
                        </span>
                      )}
                    </button>
                  );
                })}
                {/* Backwards-compatibility and test-runner alias */}
                <button
                  type="button"
                  id="btn-region-all"
                  data-testid="btn-region-all"
                  aria-label="Zoom to Global / All Markets"
                  className="sr-only"
                  tabIndex={-1}
                  onClick={() => {
                    const preset = REGION_PRESETS.find(r => r.id === 'global');
                    if (preset) handleSelectRegion(preset);
                  }}
                >
                  Global
                </button>
              </div>

              {/* Dedicated Reset Map View Button & Quick Currency Selector in Control Panel */}
              <div className="flex items-center gap-2 sm:pl-3 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 shrink-0">
                <CurrencyToggle mode="compact" idPrefix="map-control-currency" />
                <button
                  type="button"
                  id="btn-reset-map-view"
                  data-testid="btn-reset-map-view"
                  onClick={handleResetView}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-xs"
                  title="Reset Map View: restores the map to default zoom level (100%) and centers the global view"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-lime-500" />
                  <span>Reset Map View</span>
                </button>
              </div>
            </div>

        {/* Map View Mode & Partner Intelligence Toolbar */}
        <div className="mb-5 bg-gradient-to-r from-slate-900 via-[#07192f] to-slate-900 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* View Mode Segmented Switcher & Indicator */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div 
                role="tablist"
                aria-label="Toolbar Map View Switcher"
                className="inline-flex p-1 bg-slate-950/90 border border-slate-700/80 rounded-xl shadow-inner shrink-0"
              >
                <button
                  type="button"
                  id="btn-toolbar-view-pins"
                  data-testid="btn-toolbar-view-pins"
                  role="tab"
                  aria-selected={!showHeatmap}
                  onClick={() => handleSwitchMapMode('pins')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    !showHeatmap
                      ? 'bg-sky-600 text-white shadow-xs font-black ring-1 ring-sky-400/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Default Marker Pin View: Show individual partner pins and regional hubs without country heat shading"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Marker Pins</span>
                </button>

                <button
                  type="button"
                  id="btn-toolbar-view-heatmap"
                  data-testid="btn-toolbar-view-heatmap"
                  role="tab"
                  aria-selected={showHeatmap}
                  onClick={() => handleSwitchMapMode('heatmap')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    showHeatmap
                      ? 'bg-lime-500 text-slate-950 shadow-xs font-black ring-1 ring-lime-400/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Regional Coverage Heatmap View: Shade countries by partner supply and uncover underserved regions"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Coverage Heatmap</span>
                </button>
              </div>

              <div className="hidden sm:flex flex-col text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {showHeatmap ? (
                    <>
                      <Activity className="w-3.5 h-3.5 text-lime-400" />
                      <span>Regional Coverage & Partner Density Heatmap</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>Default Marker Pin View Active</span>
                    </>
                  )}
                </span>
                <span className="text-[11px] text-slate-400">
                  {showHeatmap 
                    ? 'Visualizing certified partner density with subtle color gradients to uncover underserved regions' 
                    : 'Clean display highlighting verified partner offices, service areas, and direct contact pins'}
                </span>
              </div>
            </div>

            {/* Actions & Filters based on active mode */}
            {showHeatmap ? (
              <div className="flex flex-wrap items-center gap-2">
                {/* Spotlight Underserved Toggle */}
                <button
                  type="button"
                  id="btn-spotlight-underserved"
                  data-testid="btn-spotlight-underserved"
                  onClick={() => {
                    const next = !spotlightUnderserved;
                    setSpotlightUnderserved(next);
                    announce(next ? 'Spotlight enabled: Showing 7 underserved countries across Africa.' : 'Spotlight disabled: Showing all coverage tiers.');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                    spotlightUnderserved
                      ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-md font-black'
                      : 'bg-slate-950/80 text-amber-300 border-amber-500/30 hover:border-amber-400/60'
                  }`}
                  title="Dim established markets and spotlight only underserved territories with partner shortages"
                >
                  <AlertCircle className={`w-3.5 h-3.5 ${spotlightUnderserved ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>Spotlight Underserved Regions</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    spotlightUnderserved ? 'bg-slate-950/25 text-slate-950' : 'bg-amber-400/20 text-amber-300'
                  }`}>
                    {underservedCountries.length}
                  </span>
                </button>

                {/* Jump to Underserved Market Action */}
                <button
                  type="button"
                  id="btn-jump-underserved"
                  data-testid="btn-jump-underserved"
                  onClick={jumpToNextUnderserved}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                  title="Cycle and pan smoothly to the next underserved market opportunity"
                >
                  <span>Next Underserved Market</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Active Markers:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>{filteredPartnerMarkers.length} Partner Pins Visible</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{filteredHubs.length} Regional Hubs</span>
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Coverage Density Legend Scale & Tier Filter Chips */}
          {showHeatmap && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Subtle Color Gradient Scale Bar */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <span>Coverage Density Scale:</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-400 font-mono font-bold whitespace-nowrap">
                    &lt; 25 (Underserved)
                  </span>
                  <div 
                    className="w-32 sm:w-44 h-2.5 rounded-full bg-gradient-to-r from-[#ea580c] via-[#6366f1] via-[#0284c7] to-[#059669] border border-slate-700/80 shadow-inner"
                    title="Subtle coverage density ramp: Amber (Underserved <25), Indigo (Developing 25-34), Cyan (Adequate 35-69), Emerald (Comprehensive 70+)"
                  ></div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold whitespace-nowrap">
                    70+ (Comprehensive)
                  </span>
                </div>
              </div>

              {/* Coverage Tier Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium mr-1">Filter Tier:</span>
                
                <button
                  type="button"
                  id="btn-filter-coverage-all"
                  onClick={() => {
                    setCoverageTierFilter('all');
                    setSpotlightUnderserved(false);
                    announce('Showing all coverage tiers across 20 countries.');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    coverageTierFilter === 'all' && !spotlightUnderserved
                      ? 'bg-white text-slate-900 font-black shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All (20)
                </button>

                <button
                  type="button"
                  id="btn-filter-coverage-underserved"
                  onClick={() => {
                    setCoverageTierFilter('underserved');
                    setSpotlightUnderserved(false);
                    announce(`Coverage heatmap filtered to Underserved tier: ${underservedCountries.length} countries displayed.`);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    coverageTierFilter === 'underserved'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 font-black shadow-xs'
                      : 'bg-slate-800 text-amber-400/80 hover:text-amber-300'
                  }`}
                  title="Show only underserved regions (< 25 certified partners)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Underserved ({underservedCountries.length})</span>
                </button>

                <button
                  type="button"
                  id="btn-filter-coverage-moderate"
                  onClick={() => {
                    setCoverageTierFilter('moderate');
                    setSpotlightUnderserved(false);
                    announce('Coverage heatmap filtered to Developing tier: 6 countries displayed.');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    coverageTierFilter === 'moderate'
                      ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/60 font-black shadow-xs'
                      : 'bg-slate-800 text-indigo-400/80 hover:text-indigo-300'
                  }`}
                  title="Developing Coverage (25 - 34 partners)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Developing (6)</span>
                </button>

                <button
                  type="button"
                  id="btn-filter-coverage-adequate"
                  onClick={() => {
                    setCoverageTierFilter('adequate');
                    setSpotlightUnderserved(false);
                    announce('Coverage heatmap filtered to Adequate tier: 4 countries displayed.');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    coverageTierFilter === 'adequate'
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 font-black shadow-xs'
                      : 'bg-slate-800 text-cyan-400/80 hover:text-cyan-300'
                  }`}
                  title="Adequate Coverage (35 - 69 partners)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                  <span>Adequate (4)</span>
                </button>

                <button
                  type="button"
                  id="btn-filter-coverage-comprehensive"
                  onClick={() => {
                    setCoverageTierFilter('comprehensive');
                    setSpotlightUnderserved(false);
                    announce('Coverage heatmap filtered to Comprehensive tier: 3 countries displayed.');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    coverageTierFilter === 'comprehensive'
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 font-black shadow-xs'
                      : 'bg-slate-800 text-emerald-400/80 hover:text-emerald-300'
                  }`}
                  title="Comprehensive Coverage (70+ partners)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Comprehensive (3)</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white/90 dark:bg-[#0c223f]/90 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Interactive Vector Map Canvas */}
            <div 
              ref={mapContainerRef}
              className={`lg:col-span-8 relative rounded-2xl p-2 sm:p-4 overflow-hidden min-h-[420px] flex items-center justify-center select-none transition-all ${
                highContrastMode
                  ? 'bg-black border-2 border-yellow-400 shadow-2xl shadow-yellow-400/10'
                  : 'bg-[#061426] border border-slate-800'
              }`}
            >
              
              {/* Top Interactive Indicator Pill */}
              <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md flex items-center gap-2.5 z-10 shadow-lg pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-lime-400 -ml-3.5"></span>
                  <span className="text-slate-400 font-medium">
                    {hoveredHub ? 'Inspecting:' : 'Active Market:'}
                  </span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <span>{displayHub.flag}</span>
                    <span>{displayHub.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700 text-lime-400 font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>{displayHub.count} Available in Region</span>
                </div>
              </div>

              {/* Floating Quick Region Zoom Buttons for Rapid Map Navigation */}
              <div 
                id="floating-quick-zoom-bar"
                data-testid="floating-quick-zoom-bar"
                className="absolute top-12 left-3 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 backdrop-blur-md shadow-lg"
              >
                <span className="text-[10px] font-bold text-slate-400 px-1.5 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-lime-400" />
                  <span className="hidden xs:inline">Quick Zoom:</span>
                </span>
                <button
                  type="button"
                  id="btn-quickzoom-sub-saharan-africa"
                  data-testid="btn-quickzoom-sub-saharan-africa"
                  onClick={() => {
                    const preset = REGION_PRESETS.find(r => r.id === 'sub-saharan-africa');
                    if (preset) handleSelectRegion(preset);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                    activeRegion === 'sub-saharan-africa'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Quick zoom into Sub-Saharan Africa"
                >
                  <span>🌍</span>
                  <span>Sub-Saharan Africa</span>
                </button>
                <button
                  type="button"
                  id="btn-quickzoom-global"
                  data-testid="btn-quickzoom-global"
                  onClick={() => {
                    const preset = REGION_PRESETS.find(r => r.id === 'global');
                    if (preset) handleSelectRegion(preset);
                    else handleResetView();
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                    activeRegion === 'global' || activeRegion === 'all'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Quick zoom to Global overview"
                >
                  <span>🌍</span>
                  <span>Global</span>
                </button>
                <button
                  type="button"
                  id="btn-quickzoom-north-america"
                  data-testid="btn-quickzoom-north-america"
                  onClick={() => {
                    const preset = REGION_PRESETS.find(r => r.id === 'north-america');
                    if (preset) handleSelectRegion(preset);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                    activeRegion === 'north-america'
                      ? 'bg-lime-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Quick zoom into North America"
                >
                  <span>🇺🇸</span>
                  <span>North America</span>
                </button>
              </div>

              {/* Floating Geolocation Notice / Fallback Message */}
              {locationNotice && (
                <div 
                  id="map-geolocation-notice"
                  data-testid="map-geolocation-notice"
                  className="absolute top-22 sm:top-24 left-3 right-16 sm:right-auto sm:max-w-md bg-slate-900/95 border border-sky-500/70 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md z-30 flex items-center justify-between gap-2.5 text-xs text-slate-200 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-[11px] leading-snug">{locationNotice.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocationNotice(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Dismiss message"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Floating Nearest Verified Partner Spotlight Banner */}
              {isNearMeActive && nearMeResult && (
                <div 
                  id="near-me-spotlight-banner"
                  data-testid="near-me-spotlight-banner"
                  className="absolute top-22 sm:top-24 left-3 right-16 sm:right-auto sm:max-w-xs bg-slate-900/95 border-2 border-lime-500/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400 shrink-0">
                        <LocateFixed className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-lime-400">Nearby City Match</span>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-lime-500 text-slate-950 rounded">
                            {formatDistanceKm(nearMeResult.distanceKm)}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white leading-tight mt-0.5">
                          {nearMeResult.nearestPartner.name}
                        </h4>
                        <div className="text-[10px] text-lime-400 font-semibold mt-0.5">
                          Filtered to {nearMeResult.nearestPartner.city}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      id="btn-dismiss-near-me-spotlight"
                      onClick={handleClearNearMe}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                      title="Dismiss spotlight banner"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 text-[10.5px] text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-400">
                      {nearMeResult.nearestPartner.countryFlag} {nearMeResult.nearestPartner.city}, {nearMeResult.nearestPartner.country}
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">
                      ★ {nearMeResult.nearestPartner.rating.toFixed(2)}
                    </span>
                    <span>•</span>
                    <span className="text-lime-300 font-medium">
                      {nearMeResult.nearestPartner.specialties?.[0] || nearMeResult.nearestPartner.partnerType}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1.5">
                    <button
                      type="button"
                      id="btn-near-me-view-profile"
                      data-testid="btn-near-me-view-profile"
                      onClick={() => {
                        if (onSelectPartner) onSelectPartner(nearMeResult.nearestPartner);
                        else onSelectCountry(nearMeResult.nearestPartner.country);
                      }}
                      className="flex-1 py-1 px-2.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-[11px] text-center shadow-sm transition-all flex items-center justify-center gap-1"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    {onContactPartner && (
                      <button
                        type="button"
                        onClick={() => onContactPartner(nearMeResult.nearestPartner)}
                        className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all"
                      >
                        Contact
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Floating Zoom & Pan Control Pad */}
              <div className="absolute top-3 right-3 flex flex-col items-center gap-1.5 z-20 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl backdrop-blur-md shadow-xl">
                {/* Show Nearby Floating Action */}
                <button
                  type="button"
                  id="map-btn-show-nearby"
                  data-testid="map-btn-show-nearby"
                  onClick={isNearMeActive ? handleClearNearMe : handleShowNearby}
                  disabled={isLocating}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border cursor-pointer ${
                    isNearMeActive
                      ? 'bg-lime-500 text-slate-950 border-lime-400 shadow-md shadow-lime-500/25 ring-2 ring-lime-400/50'
                      : isLocating
                      ? 'bg-sky-500 text-white animate-pulse border-sky-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-lime-400 hover:text-lime-300 border-slate-700'
                  }`}
                  title="Show Nearby (Centers map on your current city and filters results)"
                  aria-label="Show Nearby"
                >
                  {isLocating ? (
                    <Activity className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <LocateFixed className="w-4 h-4" />
                  )}
                </button>

                <div className="w-full h-px bg-slate-700/80 my-0.5"></div>

                <button
                  type="button"
                  id="map-zoom-in"
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-slate-700"
                  title="Zoom In (or scroll up)"
                  aria-label="Zoom In"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <div 
                  className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-lime-400 bg-slate-950/80 rounded-md border border-slate-800 text-center min-w-[36px]"
                  title="Current Zoom Level"
                >
                  {Math.round(scale * 100)}%
                </div>

                <button
                  type="button"
                  id="map-zoom-out"
                  onClick={handleZoomOut}
                  disabled={scale <= 1.0}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:scale-100 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-slate-700"
                  title="Zoom Out (or scroll down)"
                  aria-label="Zoom Out"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="w-full h-px bg-slate-700/80 my-0.5"></div>

                <button
                  type="button"
                  id="map-reset-view"
                  onClick={handleResetView}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-slate-700"
                  title="Reset to Full Map Overview"
                  aria-label="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Immediate In-Map Search Filter Visual Feedback HUD */}
              {searchQuery.trim() && (
                <div 
                  id="map-canvas-search-feedback-hud"
                  data-testid="map-canvas-search-feedback-hud"
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-[94%] sm:max-w-md bg-slate-900/95 border border-lime-400/50 rounded-2xl px-3.5 py-1.5 text-xs text-white backdrop-blur-md shadow-2xl flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${totalMatchingMarkers > 0 ? 'bg-lime-400 animate-ping' : 'bg-rose-500'}`} />
                    <div className="truncate text-xs">
                      <span className="font-semibold text-slate-300">Filtering: </span>
                      <span className="font-extrabold text-lime-400 font-mono">"{searchQuery}"</span>
                      <span className="text-slate-400 text-[11px] ml-1.5 font-medium">
                        {totalMatchingMarkers > 0
                          ? `(${totalMatchingMarkers} marker${totalMatchingMarkers === 1 ? '' : 's'} on map)`
                          : '(0 markers found)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {totalMatchingMarkers > 0 && (
                      <button
                        type="button"
                        id="btn-hud-focus-match"
                        data-testid="btn-hud-focus-match"
                        onClick={() => {
                          if (filteredHubs.length > 0) focusOnHub(filteredHubs[0]);
                          else if (filteredPartnerMarkers.length > 0) focusOnPartner(filteredPartnerMarkers[0]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-[10px] flex items-center gap-1 transition-all shadow-xs"
                        title="Center map on first search match"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Center</span>
                      </button>
                    )}
                    <button
                      type="button"
                      id="btn-hud-clear-search"
                      data-testid="btn-hud-clear-search"
                      onClick={handleClearSearch}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Clear search filter"
                      aria-label="Clear search filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Stylized Africa & World SVG Map Representation with smooth zoom & pan */}
              <svg 
                viewBox="0 0 800 500" 
                className={`w-full h-full max-h-[440px] select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={() => {
                  if (!dragStartRef.current.moved) {
                    setSelectedPartnerMarker(null);
                  }
                }}
              >
                <defs>
                  {/* Glowing Marker Filter */}
                  <filter id="glow-lemon" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="popover-shadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.95" />
                  </filter>
                  <linearGradient id="popover-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0b2446" />
                    <stop offset="100%" stopColor="#061528" />
                  </linearGradient>
                  <linearGradient id="partner-tooltip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#08203d" />
                    <stop offset="100%" stopColor="#030c17" />
                  </linearGradient>
                  <radialGradient id="ocean-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0a2540" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#040d1a" stopOpacity="0.8" />
                  </radialGradient>

                  {/* Subtle Regional Coverage Heatmap Gradients */}
                  <linearGradient id="coverage-grad-comprehensive" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#047857" stopOpacity="0.72" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.48" />
                  </linearGradient>
                  <linearGradient id="coverage-grad-adequate" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e7490" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="coverage-grad-moderate" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.42" />
                  </linearGradient>
                  <linearGradient id="coverage-grad-underserved" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c2410c" stopOpacity="0.78" />
                    <stop offset="50%" stopColor="#ea580c" stopOpacity="0.62" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.45" />
                  </linearGradient>

                  {/* Subtle Glow Auras for Coverage Density Hubs */}
                  <radialGradient id="coverage-aura-underserved" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
                    <stop offset="55%" stopColor="#ea580c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="coverage-aura-comprehensive" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
                    <stop offset="55%" stopColor="#059669" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                  </radialGradient>

                  {/* Heatmap Pulsing Thermal Gradients */}
                  <radialGradient id="heat-glow-extreme" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-glow-high" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="45%" stopColor="#f97316" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-glow-moderate" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity="0.75" />
                    <stop offset="45%" stopColor="#84cc16" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-glow-emerging" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
                    <stop offset="45%" stopColor="#0ea5e9" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                  </radialGradient>
                  <clipPath id="map-frame-clip">
                    <rect width="800" height="500" rx="16" />
                  </clipPath>
                </defs>

                {/* Ocean Background & Coordinate Grid framed within container */}
                <g clipPath="url(#map-frame-clip)">
                  <rect width="800" height="500" fill={highContrastMode ? '#000000' : 'url(#ocean-grad)'} rx="16" />

                  {/* Lat/Long Grid Lines */}
                  <line x1="0" y1="250" x2="800" y2="250" stroke={highContrastMode ? '#334155' : '#1e293b'} strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="400" y1="0" x2="400" y2="500" stroke={highContrastMode ? '#334155' : '#1e293b'} strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="500" stroke={highContrastMode ? '#1e293b' : '#0f172a'} strokeDasharray="2 4" strokeWidth="1" />
                  <line x1="600" y1="0" x2="600" y2="500" stroke={highContrastMode ? '#1e293b' : '#0f172a'} strokeDasharray="2 4" strokeWidth="1" />
                </g>

                {/* Zoomable and Pannable Group */}
                <g 
                  clipPath="url(#map-frame-clip)"
                  transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
                  style={{
                    transition: isAnimating ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                    transformOrigin: '0 0',
                  }}
                >
                  {/* Stylized Continents Outlines */}
                  {/* Americas Outline */}
                  <path
                    d="M 120 90 Q 180 80 210 130 T 200 200 T 230 250 T 210 320 T 250 420 T 200 460 T 160 380 T 170 300 T 140 230 T 90 150 Z"
                    fill={highContrastMode ? '#0a0f1d' : '#122b49'}
                    stroke={highContrastMode ? '#64748b' : '#1e40af'}
                    strokeWidth={highContrastMode ? '1.8' : '1.2'}
                    opacity={highContrastMode ? '0.85' : '0.65'}
                  />
                  
                  {/* Europe Outline */}
                  <path
                    d="M 360 80 Q 420 70 450 110 T 430 160 T 380 180 T 340 140 Z"
                    fill={highContrastMode ? '#0a0f1d' : '#122b49'}
                    stroke={highContrastMode ? '#64748b' : '#1e40af'}
                    strokeWidth={highContrastMode ? '1.8' : '1.2'}
                    opacity={highContrastMode ? '0.85' : '0.7'}
                  />

                  {/* Africa Continent (Accurate stylized high-contrast prominence) */}
                  <path
                    d="M 340 185 Q 430 170 470 210 T 490 260 T 460 330 T 440 420 T 390 440 T 380 370 T 330 280 T 320 220 Z"
                    fill={highContrastMode ? '#182436' : '#1a3d66'}
                    stroke={highContrastMode ? '#facc15' : '#38bdf8'}
                    strokeWidth={highContrastMode ? (scale > 2 ? '2' : '3') : (scale > 2 ? '1.2' : '2')}
                    className="transition-all hover:fill-[#204a7c]"
                  />

                  {/* Middle East & Asia Outline */}
                  <path
                    d="M 480 150 Q 560 130 640 170 T 700 240 T 630 330 T 560 270 T 490 220 Z"
                    fill={highContrastMode ? '#0a0f1d' : '#122b49'}
                    stroke={highContrastMode ? '#64748b' : '#1e40af'}
                    strokeWidth={highContrastMode ? '1.8' : '1.2'}
                    opacity={highContrastMode ? '0.85' : '0.65'}
                  />

                  {/* Regional Halo Highlights (Visible when regional focus active) */}
                  {activeRegion === 'west-africa' && (
                    <ellipse cx="340" cy="270" rx="90" ry="60" fill="#84cc16" opacity="0.08" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3" />
                  )}
                  {activeRegion === 'east-africa' && (
                    <ellipse cx="445" cy="290" rx="70" ry="65" fill="#38bdf8" opacity="0.08" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                  )}
                  {activeRegion === 'southern-africa' && (
                    <ellipse cx="410" cy="390" rx="60" ry="50" fill="#84cc16" opacity="0.08" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3" />
                  )}
                  {activeRegion === 'sub-saharan-africa' && (
                    <ellipse cx="395" cy="315" rx="110" ry="110" fill="#84cc16" opacity="0.09" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3" />
                  )}
                  {activeRegion === 'north-america' && (
                    <ellipse cx="160" cy="170" rx="75" ry="60" fill="#38bdf8" opacity="0.09" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                  )}
                  {activeRegion === 'north-africa' && (
                    <ellipse cx="375" cy="185" rx="70" ry="40" fill="#f59e0b" opacity="0.08" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  )}

                  {/* Glowing Network Connection Curves */}
                  <path d="M 370 270 Q 420 220 380 140" fill="none" stroke="#84cc16" strokeWidth={1.5 / Math.sqrt(scale)} strokeDasharray="3 3" opacity="0.6" />
                  <path d="M 370 270 Q 280 230 180 190" fill="none" stroke="#38bdf8" strokeWidth={1.5 / Math.sqrt(scale)} strokeDasharray="4 4" opacity="0.4" />
                  <path d="M 370 270 Q 480 280 460 290" fill="none" stroke="#84cc16" strokeWidth={1.5 / Math.sqrt(scale)} strokeDasharray="2 2" opacity="0.7" />
                  <path d="M 460 290 Q 450 360 410 410" fill="none" stroke="#84cc16" strokeWidth={1.5 / Math.sqrt(scale)} strokeDasharray="3 3" opacity="0.7" />
                  <path d="M 460 290 Q 520 220 530 210" fill="none" stroke="#38bdf8" strokeWidth={1.5 / Math.sqrt(scale)} strokeDasharray="3 3" opacity="0.5" />

                  {/* Regional Coverage Heatmap Layer (Dynamic Country Shading with Subtle Gradients) */}
                  {showHeatmap && (
                    <g id="regional-coverage-heatmap-layer">
                      {COUNTRY_HEATMAP_DATA.map((item) => {
                        const isSelected = activeCountry.toLowerCase() === item.country.toLowerCase() || selectedHeatmapCountry?.id === item.id;
                        const isHovered = hoveredHeatmapCountry?.id === item.id;
                        const coverageStyle = getCoverageHeatmapStyle(item, isSelected, isHovered, spotlightUnderserved);
                        const isUnderserved = coverageStyle.isUnderserved;
                        
                        const q = searchQuery.toLowerCase().trim();
                        const matchesSearch = !q || (
                          item.country.toLowerCase().includes(q) ||
                          item.keyCommercialCities.some(c => c.toLowerCase().includes(q)) ||
                          item.region.toLowerCase().includes(q)
                        );

                        const isFiltered = (coverageTierFilter !== 'all' && coverageStyle.tierInfo.tier !== coverageTierFilter)
                          || (spotlightUnderserved && !isUnderserved)
                          || (Boolean(q) && !matchesSearch);
                        
                        const centerX = (item.center.x / 100) * 800;
                        const centerY = (item.center.y / 100) * 500;
                        
                        const auraGradientId = isUnderserved ? 'url(#coverage-aura-underserved)' : 'url(#coverage-aura-comprehensive)';

                        return (
                          <g
                            key={`coverage-${item.id}`}
                            id={`coverage-country-${item.id.toLowerCase()}`}
                            className={`transition-opacity duration-300 ${isFiltered ? 'opacity-20' : 'opacity-100'}`}
                          >
                            {/* Subtle Glow Aura (Prominent for Underserved Regions, Search Matches and Selected Countries) */}
                            <circle
                              cx={centerX}
                              cy={centerY}
                              r={isUnderserved ? (isSelected ? 38 : 24) / Math.sqrt(scale) : (isSelected ? 34 : 20) / Math.sqrt(scale)}
                              fill={auraGradientId}
                              className="pointer-events-none"
                              style={{
                                animation: (isUnderserved || isSelected || isHovered || (Boolean(q) && matchesSearch)) ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                              }}
                            />

                            {/* Dynamically Shaded Country Territory Shape with Subtle Linear Gradient */}
                            <path
                              d={item.svgPath}
                              fill={coverageStyle.fill}
                              fillOpacity={isFiltered ? 0.08 : (highContrastMode ? Math.min(coverageStyle.fillOpacity * 1.5, 0.95) : coverageStyle.fillOpacity)}
                              stroke={highContrastMode ? (isSelected ? '#facc15' : '#ffffff') : (Boolean(q) && matchesSearch ? '#a3e635' : coverageStyle.stroke)}
                              strokeWidth={(highContrastMode ? (isSelected ? 3.5 : 2.5) : (Boolean(q) && matchesSearch ? 2.4 : coverageStyle.strokeWidth)) / Math.sqrt(scale)}
                              strokeDasharray={isUnderserved ? `${3 / Math.sqrt(scale)} ${2 / Math.sqrt(scale)}` : 'none'}
                              className="cursor-pointer transition-all duration-300 hover:brightness-125"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!dragStartRef.current.moved) {
                                  focusOnHeatmapCountry(item);
                                }
                              }}
                              onMouseEnter={() => setHoveredHeatmapCountry(item)}
                              onMouseLeave={() => {
                                if (hoveredHeatmapCountry?.id === item.id) {
                                  setHoveredHeatmapCountry(null);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`${item.country}: ${item.partnerCount} verified partners (${coverageStyle.tierInfo.label}). ${coverageStyle.tierInfo.badge}.`}
                            >
                              <title>{`${item.country}: ${item.partnerCount} partners • ${coverageStyle.tierInfo.label}`}</title>
                            </path>

                            {/* Center Coverage Metric Badge Pill on Map */}
                            <g
                              transform={`translate(${centerX}, ${centerY})`}
                              className="pointer-events-none transition-opacity select-none"
                              opacity={isFiltered ? 0.35 : 1}
                            >
                              <rect
                                x={isUnderserved ? -23 / Math.sqrt(scale) : -18 / Math.sqrt(scale)}
                                y={-7.5 / Math.sqrt(scale)}
                                width={isUnderserved ? 46 / Math.sqrt(scale) : 36 / Math.sqrt(scale)}
                                height={15 / Math.sqrt(scale)}
                                rx={4.5 / Math.sqrt(scale)}
                                fill={isUnderserved ? '#431407' : '#07172b'}
                                fillOpacity={isUnderserved ? '0.92' : '0.88'}
                                stroke={coverageStyle.stroke}
                                strokeWidth={isUnderserved ? 1.2 / Math.sqrt(scale) : 0.9 / Math.sqrt(scale)}
                              />
                              <text
                                x="0"
                                y={3.8 / Math.sqrt(scale)}
                                textAnchor="middle"
                                fill={isUnderserved ? '#fed7aa' : '#ffffff'}
                                fontSize={6.8 / Math.sqrt(scale)}
                                fontWeight="800"
                                fontFamily="monospace"
                              >
                                {isUnderserved ? `⚠️ ${item.partnerCount}p` : `${item.partnerCount}p`}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Secondary City Nodes (Rendered when zoomed in to level >= 1.6) */}
                  {scale >= 1.6 && filteredSubCities.map((sub) => {
                    const subX = (sub.x / 100) * 800;
                    const subY = (sub.y / 100) * 500;
                    const isParent = sub.country === activeCountry;
                    return (
                      <g 
                        key={sub.name}
                        transform={`translate(${subX}, ${subY})`}
                        className="pointer-events-none transition-opacity duration-300 select-none"
                      >
                        <circle 
                          r={isParent ? "3" : "2"} 
                          fill={isParent ? "#a3e635" : "#38bdf8"} 
                          opacity="0.9"
                        />
                        <text
                          x="0"
                          y="-5"
                          textAnchor="middle"
                          fill={isParent ? "#f7fee7" : "#94a3b8"}
                          fontSize="7"
                          fontWeight={isParent ? "700" : "500"}
                          className="drop-shadow select-none"
                        >
                          {sub.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Map Country Hub Glowing Location Markers */}
                  {showCountryHubs && filteredHubs.map((hub) => {
                    const svgX = (hub.x / 100) * 800;
                    const svgY = (hub.y / 100) * 500;
                    const isSelected = activeCountry === hub.name;
                    const isHovered = hoveredHub?.name === hub.name;
                    
                    // Pin radius scales gently with zoom
                    const outerRadius = isHovered ? 14 : isSelected ? 12 : 7.5;
                    const innerRadius = isHovered || isSelected ? 6 : 3.5;

                    return (
                      <g 
                        key={hub.name} 
                        id={`map-hub-${hub.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dragStartRef.current.moved) return;
                          focusOnHub(hub);
                          onSelectCountry(hub.name);
                        }}
                        onMouseEnter={() => handleMarkerMouseEnter(hub)}
                        onMouseLeave={handleMarkerMouseLeave}
                        className="cursor-pointer transition-transform duration-200 group"
                        transform={`translate(${svgX}, ${svgY})`}
                        role="button"
                        tabIndex={0}
                        aria-label={`${hub.name}: ${hub.count} available partners in ${hub.tier}`}
                      >
                        {/* Generous invisible hit target for effortless hover tracking */}
                        <circle r="30" fill="transparent" className="cursor-pointer" />

                        {/* Pulsing Radar Waves for Hovered or Selected Pin or Search Active */}
                        {(isSelected || isHovered || Boolean(searchQuery.trim())) && (
                          <>
                            <circle r="24" fill="none" stroke="#a3e635" strokeWidth="2.5" opacity="0.85" className="animate-ping" />
                            <circle r="18" fill="#a3e635" opacity="0.25" className="animate-pulse" />
                            {Boolean(searchQuery.trim()) && (
                              <circle r="22" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                            )}
                          </>
                        )}
                        
                        {/* Outer Glow Halo with Lemon filter */}
                        <circle 
                          r={outerRadius} 
                          fill={isHovered || isSelected || Boolean(searchQuery.trim()) ? '#a3e635' : '#38bdf8'} 
                          opacity={isHovered ? 1 : isSelected ? 0.95 : 0.8}
                          filter="url(#glow-lemon)"
                          className="transition-all duration-200"
                        />

                        {/* Inner Core */}
                        <circle 
                          r={innerRadius} 
                          fill={highContrastMode ? (isHovered || isSelected ? '#000000' : '#ffffff') : (isHovered || isSelected ? '#091e38' : '#ffffff')} 
                          stroke={highContrastMode ? '#facc15' : (isHovered || isSelected ? '#ffffff' : '#0284c7')}
                          strokeWidth={highContrastMode ? "2.5" : "1"}
                          className="transition-all duration-200"
                        />

                        {/* Hub Label Callout on Map */}
                        <text
                          x="0"
                          y="18"
                          textAnchor="middle"
                          fill={highContrastMode ? '#ffffff' : (isHovered || isSelected || Boolean(searchQuery.trim()) ? '#a3e635' : '#cbd5e1')}
                          fontSize={isHovered || isSelected || Boolean(searchQuery.trim()) ? "11.5" : "9.5"}
                          fontWeight={highContrastMode ? "900" : (isHovered || isSelected || Boolean(searchQuery.trim()) ? "800" : "600")}
                          className="pointer-events-none drop-shadow select-none transition-colors"
                        >
                          {hub.flag} {hub.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Interactive Partner Markers on Map (Dynamically generated for every partner in filtered results) */}
                  {showPartnerMarkers && filteredPartnerMarkers.map((partner, pIdx) => {
                    const coords = partnerPinCoordinates[partner.id] || PARTNER_MAP_COORDINATES[partner.id] || { x: 45, y: 50 };
                    const svgX = (coords.x / 100) * 800;
                    const svgY = (coords.y / 100) * 500;
                    const isSelected = selectedPartnerMarker?.id === partner.id;
                    const isHovered = hoveredPartnerMarker?.id === partner.id;
                    const isKeyboardFocused = keyboardFocusedMarkerId === partner.id;
                    const isNearest = nearMeResult?.nearestPartner.id === partner.id;
                    const isSearchMatch = Boolean(searchQuery.trim()) || isDirectoryFiltered;

                    const pinRadius = (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? 10.5 : isHovered ? 9.5 : 7.5) / Math.sqrt(scale);
                    const coreRadius = (isSelected || isKeyboardFocused || isNearest ? 6.5 : isHovered ? 5.5 : 4) / Math.sqrt(scale);
                    const ringRadius = (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? 18 : isHovered ? 14 : 11) / Math.sqrt(scale);

                    const category = getPartnerCategory(partner.partnerType);
                    const categoryColor = category === 'accountant' 
                      ? '#fbbf24' 
                      : category === 'consultant' 
                      ? '#c084fc' 
                      : '#38bdf8';

                    return (
                      <g
                        key={partner.id}
                        id={`partner-marker-${partner.id}`}
                        data-testid={`partner-marker-${partner.id}`}
                        transform={`translate(${svgX}, ${svgY})`}
                        className="cursor-pointer transition-transform duration-200 select-none group focus:outline-none"
                        onClick={(e) => handlePartnerMarkerClick(partner, e)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onSelectPartner?.(partner);
                        }}
                        onMouseEnter={() => handlePartnerPinMouseEnter(partner)}
                        onMouseLeave={handlePartnerPinMouseLeave}
                        onFocus={() => {
                          setKeyboardFocusedMarkerId(partner.id);
                          const total = filteredPartnerMarkers.length;
                          const verification = partner.verified ? 'Verified Certified Partner' : 'Registered Partner';
                          announce(
                            `Selected map pin ${pIdx + 1} of ${total}: ${partner.name} located in ${partner.city}, ${partner.country}. Verification status: ${verification}, ${partner.level} Tier. Rating: ${partner.rating} stars. Use arrow keys to step between pins, M to message partner, Enter to view profile, Space for preview.`
                          );
                        }}
                        onKeyDown={(e) => handleMarkerKeyDown(e, partner, pIdx)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Partner Pin ${pIdx + 1} of ${filteredPartnerMarkers.length}: ${partner.name}, ${partner.city}, ${partner.country}. Level: ${partner.level} Tier. Status: ${partner.verified ? 'Verified Certified' : 'Registered'}. Rating: ${partner.rating} stars. Use arrow keys to move focus between map pins.`}
                      >
                        <title>{`Partner ${partner.name} (${partner.level} - ${partner.city}, ${partner.country}). Use arrow keys to navigate.`}</title>
                        {/* Generous hit target for easy clicking and tapping */}
                        <circle r={28 / Math.sqrt(scale)} fill="transparent" />

                        {/* High Visibility Keyboard Focus Indicator */}
                        {isKeyboardFocused && (
                          <g className="pointer-events-none">
                            <circle
                              r={(pinRadius + 7) / Math.sqrt(scale)}
                              fill="none"
                              stroke={highContrastMode ? '#facc15' : '#38bdf8'}
                              strokeWidth={3 / Math.sqrt(scale)}
                              strokeDasharray="4 2"
                            />
                            <circle
                              r={(pinRadius + 11) / Math.sqrt(scale)}
                              fill="none"
                              stroke={highContrastMode ? '#ffffff' : '#a3e635'}
                              strokeWidth={1.5 / Math.sqrt(scale)}
                              opacity="0.9"
                            />
                          </g>
                        )}

                        {/* Pulsing radar waves when nearest, selected, hovered, or matched by search */}
                        {(isNearest || isSelected || isHovered || isSearchMatch) && (
                          <>
                            <circle
                              r={(isNearest || isSearchMatch ? 28 : 24) / Math.sqrt(scale)}
                              fill="none"
                              stroke={isNearest || isSearchMatch ? '#a3e635' : '#38bdf8'}
                              strokeWidth={(isNearest || isSearchMatch ? 2.5 : 2) / Math.sqrt(scale)}
                              opacity="0.9"
                              className="animate-ping"
                            />
                            <circle
                              r={(isNearest || isSearchMatch ? 20 : 16) / Math.sqrt(scale)}
                              fill={isNearest || isSearchMatch ? '#a3e635' : '#38bdf8'}
                              opacity={isNearest || isSearchMatch ? 0.35 : 0.25}
                              className="animate-pulse"
                            />
                          </>
                        )}

                        {/* Outer Glow Halo */}
                        <circle
                          r={ringRadius}
                          fill={isNearest || isSearchMatch ? '#a3e635' : isSelected ? '#a3e635' : isHovered ? '#38bdf8' : categoryColor}
                          opacity={isNearest || isSearchMatch ? 1 : isSelected ? 0.95 : isHovered ? 0.9 : 0.75}
                          filter="url(#glow-lemon)"
                        />

                        {/* Pin Outer Ring */}
                        <circle
                          r={pinRadius}
                          fill={highContrastMode ? '#000000' : (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? '#031726' : '#051b33')}
                          stroke={highContrastMode ? '#ffffff' : (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? '#a3e635' : categoryColor)}
                          strokeWidth={(highContrastMode ? 2.8 : (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? 2.2 : 1.75)) / Math.sqrt(scale)}
                        />

                        {/* Inner Core */}
                        <circle
                          r={coreRadius}
                          fill={highContrastMode ? (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? '#facc15' : '#ffffff') : (isSelected || isKeyboardFocused || isNearest || isSearchMatch ? '#a3e635' : '#ffffff')}
                        />

                        {/* Miniature Star Icon */}
                        <text
                          x="0"
                          y={2.5 / Math.sqrt(scale)}
                          textAnchor="middle"
                          fill="#041221"
                          fontSize={6.5 / Math.sqrt(scale)}
                          fontWeight="900"
                          className="pointer-events-none select-none font-sans"
                        >
                          ★
                        </text>

                        {/* Partner Name Label Tag (visible on zoom, hover, select, nearest, or search active) */}
                        {(scale >= 1.35 || isHovered || isSelected || isNearest || isSearchMatch) && (
                          <g transform={`translate(0, ${16 / Math.sqrt(scale)})`}>
                            <rect
                              x={-62 / Math.sqrt(scale)}
                              y={-1 / Math.sqrt(scale)}
                              width={124 / Math.sqrt(scale)}
                              height={13 / Math.sqrt(scale)}
                              rx={4 / Math.sqrt(scale)}
                              fill="#031120"
                              fillOpacity="0.92"
                              stroke={isNearest || isSearchMatch ? '#a3e635' : isSelected ? '#a3e635' : categoryColor}
                              strokeWidth={(isNearest || isSelected || isSearchMatch ? 1.2 : 0.75) / Math.sqrt(scale)}
                            />
                            <text
                              x="0"
                              y={8 / Math.sqrt(scale)}
                              textAnchor="middle"
                              fill={isNearest || isSearchMatch ? '#a3e635' : isSelected ? '#a3e635' : isHovered ? '#ffffff' : '#cbd5e1'}
                              fontSize={7.5 / Math.sqrt(scale)}
                              fontWeight={isNearest || isSelected || isSearchMatch ? '900' : '700'}
                              className="pointer-events-none select-none drop-shadow"
                            >
                              {isSearchMatch ? `📍 ${partner.city}: ` : isNearest ? '🎯 ' : ''}
                              {partner.name.length > (isSearchMatch ? 11 : isNearest ? 14 : 18) ? partner.name.slice(0, isSearchMatch ? 10 : isNearest ? 12 : 16) + '…' : partner.name}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Interactive Partner Hover-Card Preview (Shown on Marker Hover or Click) */}
                  {(selectedPartnerMarker || hoveredPartnerMarker) && (() => {
                    const partner = selectedPartnerMarker || hoveredPartnerMarker;
                    if (!partner) return null;

                    const coords = partnerPinCoordinates[partner.id] || PARTNER_MAP_COORDINATES[partner.id] || { x: 45, y: 50 };
                    const svgX = (coords.x / 100) * 800;
                    const svgY = (coords.y / 100) * 500;

                    const viewportY = svgY * scale + pan.y;
                    const viewportX = svgX * scale + pan.x;

                    // Flip placement if marker is near the top of the viewport
                    const isRenderBelow = viewportY < 215;
                    const popoverScale = 1 / scale;

                    const tooltipWidth = 316;
                    const tooltipHeight = 198;
                    const halfW = tooltipWidth / 2;

                    let shiftX = 0;
                    if (viewportX - halfW < 18) {
                      shiftX = (18 - (viewportX - halfW)) * popoverScale;
                    } else if (viewportX + halfW > 800 - 18) {
                      shiftX = ((800 - 18) - (viewportX + halfW)) * popoverScale;
                    }

                    const arrowHeight = 10;
                    const gap = 8;
                    const offsetY = isRenderBelow
                      ? (16 * popoverScale) + gap
                      : -(tooltipHeight + arrowHeight + (14 * popoverScale) + gap);

                    const primaryExpertise = partner.specialties?.[0]
                      ? `${partner.specialties[0]}${partner.services?.[0] ? ` • ${partner.services[0]}` : ''}`
                      : `${partner.partnerType} Advisory`;

                    const secondarySkills = partner.specialties?.slice(1, 4).join(' • ') 
                      || partner.industries?.slice(0, 3).join(' • ') 
                      || 'Cloud Accounting & Enterprise ERP';

                    const isNearestThis = nearMeResult?.nearestPartner.id === partner.id;
                    const initials = (partner.name.replace(/[^\w\s]/gi, '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('') || 'MB').toUpperCase();

                    return (
                      <g
                        id={`partner-tooltip-preview-${partner.id}`}
                        data-testid="partner-tooltip-preview"
                        transform={`translate(${svgX}, ${svgY}) scale(${popoverScale})`}
                        className="cursor-default select-none transition-all duration-150"
                        filter="url(#popover-shadow)"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={handleHoverCardMouseEnter}
                        onMouseLeave={handleHoverCardMouseLeave}
                      >
                        <defs>
                          <clipPath id={`avatar-clip-${partner.id}`}>
                            <circle cx={-halfW + 32} cy="52" r="19" />
                          </clipPath>
                        </defs>

                        {/* Invisible Hit Bridge to prevent premature mouse-leave while traveling between pin and card */}
                        <rect
                          x={-50}
                          y={isRenderBelow ? 0 : offsetY + tooltipHeight}
                          width={100}
                          height={isRenderBelow ? offsetY + 10 : Math.abs(offsetY + tooltipHeight) + 10}
                          fill="transparent"
                          className="pointer-events-auto"
                          onMouseEnter={handleHoverCardMouseEnter}
                          onMouseLeave={handleHoverCardMouseLeave}
                        />

                        <g transform={`translate(${shiftX}, ${offsetY})`}>
                          {/* Container Card Background */}
                          <rect
                            x={-halfW}
                            y="0"
                            width={tooltipWidth}
                            height={tooltipHeight}
                            rx="14"
                            fill="url(#partner-tooltip-grad)"
                            stroke={isNearestThis ? '#a3e635' : '#38bdf8'}
                            strokeWidth="2"
                          />

                          {/* Indicator Arrow Pointing at the Marker Pin */}
                          {isRenderBelow ? (
                            <polygon
                              points={`${-shiftX - 9},0 ${-shiftX},${-arrowHeight} ${-shiftX + 9},0`}
                              fill="#08203d"
                              stroke={isNearestThis ? '#a3e635' : '#38bdf8'}
                              strokeWidth="2"
                            />
                          ) : (
                            <polygon
                              points={`${-shiftX - 9},${tooltipHeight} ${-shiftX},${tooltipHeight + arrowHeight} ${-shiftX + 9},${tooltipHeight}`}
                              fill="#030c17"
                              stroke={isNearestThis ? '#a3e635' : '#38bdf8'}
                              strokeWidth="2"
                            />
                          )}

                          {/* Seam Cover Stroke at arrow base */}
                          {isRenderBelow ? (
                            <line
                              x1={-shiftX - 7.5}
                              y1="1"
                              x2={-shiftX + 7.5}
                              y2="1"
                              stroke="#08203d"
                              strokeWidth="3"
                            />
                          ) : (
                            <line
                              x1={-shiftX - 7.5}
                              y1={tooltipHeight - 1}
                              x2={-shiftX + 7.5}
                              y2={tooltipHeight - 1}
                              stroke="#030c17"
                              strokeWidth="3"
                            />
                          )}

                          {/* Top Header Row: Partner Level Badge, Verified Badge & Close Button */}
                          <g transform="translate(0, 18)">
                            {/* Tier Badge */}
                            <rect
                              x={-halfW + 12}
                              y="-11"
                              width="106"
                              height="18"
                              rx="9"
                              fill={partner.level === 'Platinum' ? '#3b0764' : partner.level === 'Gold' ? '#451a03' : '#0c4a6e'}
                              stroke={partner.level === 'Platinum' ? '#c084fc' : partner.level === 'Gold' ? '#fbbf24' : '#38bdf8'}
                              strokeWidth="1"
                            />
                            <text
                              x={-halfW + 18}
                              y="2"
                              fill="#ffffff"
                              fontSize="9"
                              fontWeight="bold"
                            >
                              {partner.countryFlag} {partner.level} Partner
                            </text>

                            {/* Verified Badge */}
                            <rect
                              x={-halfW + 124}
                              y="-11"
                              width="76"
                              height="18"
                              rx="9"
                              fill="#064e3b"
                              stroke="#34d399"
                              strokeWidth="1"
                            />
                            <text
                              x={-halfW + 162}
                              y="2"
                              textAnchor="middle"
                              fill="#6ee7b7"
                              fontSize="8.5"
                              fontWeight="bold"
                            >
                              ✓ Verified
                            </text>

                            {/* Live Availability Status */}
                            {partner.availabilityStatus === 'Accepting New Clients' && (
                              <g transform={`translate(${-halfW + 208}, -2)`}>
                                <circle cx="0" cy="0" r="3.5" fill="#22c55e" className="animate-pulse" />
                                <text x="7" y="3" fill="#86efac" fontSize="8" fontWeight="bold">
                                  Accepting
                                </text>
                              </g>
                            )}

                            {/* Close (✕) Button */}
                            <g
                              id="btn-close-partner-tooltip"
                              data-testid="btn-close-partner-tooltip"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPartnerMarker(null);
                                setHoveredPartnerMarker(null);
                              }}
                              className="cursor-pointer group"
                              role="button"
                              aria-label="Close partner hover-card"
                            >
                              <circle
                                cx={halfW - 14}
                                cy="-2"
                                r="9"
                                fill="#1e293b"
                                stroke="#64748b"
                                strokeWidth="1"
                                className="group-hover:fill-red-950 group-hover:stroke-red-500 transition-colors"
                              />
                              <text
                                x={halfW - 14}
                                y="1"
                                textAnchor="middle"
                                fill="#f1f5f9"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                ✕
                              </text>
                            </g>
                          </g>

                          {/* Profile Thumbnail Avatar + Partner Identity & Ratings Row */}
                          <g transform="translate(0, 52)">
                            {/* Circular Thumbnail Frame */}
                            <circle
                              cx={-halfW + 32}
                              cy="0"
                              r="20"
                              fill="#0f2942"
                              stroke={isNearestThis ? '#a3e635' : '#38bdf8'}
                              strokeWidth="1.5"
                            />

                            {/* Fallback Initials under image */}
                            <text
                              x={-halfW + 32}
                              y="4.5"
                              textAnchor="middle"
                              fill="#38bdf8"
                              fontSize="12"
                              fontWeight="900"
                              className="select-none"
                            >
                              {initials}
                            </text>

                            {/* Partner Thumbnail Photo */}
                            {partner.logo && (
                              <image
                                href={partner.logo}
                                x={-halfW + 12}
                                y="-20"
                                width="40"
                                height="40"
                                clipPath={`url(#avatar-clip-${partner.id})`}
                                preserveAspectRatio="xMidYMid slice"
                              />
                            )}

                            {/* Status Dot */}
                            <circle
                              cx={-halfW + 46}
                              cy="13"
                              r="4.5"
                              fill="#22c55e"
                              stroke="#030c17"
                              strokeWidth="1.5"
                            />

                            {/* Partner Business Name */}
                            <text
                              x={-halfW + 62}
                              y="-6"
                              fill="#ffffff"
                              fontSize="12.5"
                              fontWeight="900"
                              letterSpacing="-0.2"
                            >
                              {partner.name.length > 25 ? partner.name.slice(0, 24) + '…' : partner.name}
                            </text>

                            {/* Location & Practice Type */}
                            <text
                              x={-halfW + 62}
                              y="8"
                              fill="#94a3b8"
                              fontSize="8.5"
                              fontWeight="500"
                            >
                              📍 {partner.city}, {partner.country} • {partner.partnerType}
                            </text>

                            {/* Rating & Response SLA */}
                            <g transform={`translate(${-halfW + 62}, 21)`}>
                              <text fill="#fbbf24" fontSize="9.5" fontWeight="800">
                                ★ {partner.rating.toFixed(2)}
                              </text>
                              <text x="36" y="0" fill="#94a3b8" fontSize="8.5">
                                ({partner.reviewCount})
                              </text>
                              <text x="66" y="0" fill="#38bdf8" fontSize="8.5" fontWeight="700">
                                • ⚡ Responds {partner.responseTime}
                              </text>
                            </g>
                          </g>

                          {/* PRIMARY EXPERTISE (Prominent Domain Capability Highlight) */}
                          <g transform="translate(0, 96)">
                            {/* Card Accent Box */}
                            <rect
                              x={-halfW + 12}
                              y="-10"
                              width={tooltipWidth - 24}
                              height="40"
                              rx="8"
                              fill="#052033"
                              stroke="#0ea5e9"
                              strokeWidth="1.2"
                            />

                            {/* Badge Header */}
                            <text
                              x={-halfW + 20}
                              y="0"
                              fill="#38bdf8"
                              fontSize="7.5"
                              fontWeight="900"
                              letterSpacing="0.6"
                            >
                              ⚡ PRIMARY EXPERTISE:
                            </text>

                            {/* Highlighted Core Competency */}
                            <text
                              x={-halfW + 20}
                              y="13"
                              fill="#f0f9ff"
                              fontSize="10"
                              fontWeight="800"
                            >
                              {primaryExpertise.length > 35 ? primaryExpertise.slice(0, 34) + '…' : primaryExpertise}
                            </text>

                            {/* Secondary Skills / Domain Focus */}
                            <text
                              x={-halfW + 20}
                              y="24"
                              fill="#94a3b8"
                              fontSize="8"
                              fontWeight="500"
                            >
                              Core Skills: {secondarySkills.length > 38 ? secondarySkills.slice(0, 37) + '…' : secondarySkills}
                            </text>
                          </g>

                          {/* Action Buttons Bar: Direct Message Partner & View Profile */}
                          <g transform="translate(0, 164)">
                            {/* DIRECT 'MESSAGE PARTNER' BUTTON (Prominent Primary Action) */}
                            <g
                              id={`btn-tooltip-message-partner-${partner.id}`}
                              data-testid="btn-tooltip-message-partner"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onContactPartner) {
                                  onContactPartner(partner);
                                } else if (onSelectPartner) {
                                  onSelectPartner(partner);
                                } else {
                                  onSelectCountry(partner.country);
                                }
                              }}
                              className="cursor-pointer group/msg"
                              role="button"
                              aria-label={`Message ${partner.name} directly`}
                            >
                              <rect
                                x={-halfW + 12}
                                y="-10"
                                width={(tooltipWidth - 30) * 0.58}
                                height="26"
                                rx="7"
                                fill="#84cc16"
                                className="group-hover/msg:fill-[#a3e635] transition-colors"
                              />
                              <text
                                x={-halfW + 12 + ((tooltipWidth - 30) * 0.58) / 2}
                                y="6.5"
                                textAnchor="middle"
                                fill="#0f291e"
                                fontSize="10"
                                fontWeight="900"
                                className="pointer-events-none select-none"
                              >
                                💬 Message Partner
                              </text>
                            </g>

                            {/* 'View Profile' Link Button */}
                            <g
                              id={`btn-tooltip-view-profile-${partner.id}`}
                              data-testid="btn-tooltip-view-profile"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectPartner) {
                                  onSelectPartner(partner);
                                } else {
                                  onSelectCountry(partner.country);
                                }
                              }}
                              className="cursor-pointer group/profile"
                              role="button"
                              aria-label={`View full profile for ${partner.name}`}
                            >
                              <rect
                                x={-halfW + 18 + ((tooltipWidth - 30) * 0.58)}
                                y="-10"
                                width={(tooltipWidth - 30) * 0.42}
                                height="26"
                                rx="7"
                                fill="#1e293b"
                                stroke="#475569"
                                strokeWidth="1"
                                className="group-hover/profile:fill-[#334155] group-hover/profile:stroke-slate-400 transition-colors"
                              />
                              <text
                                x={-halfW + 18 + ((tooltipWidth - 30) * 0.58) + ((tooltipWidth - 30) * 0.42) / 2}
                                y="6.5"
                                textAnchor="middle"
                                fill="#e2e8f0"
                                fontSize="9.5"
                                fontWeight="700"
                                className="pointer-events-none select-none"
                              >
                                Profile →
                              </text>
                            </g>
                          </g>
                        </g>
                      </g>
                    );
                  })()}

                  {/* Interactive Popover Label on Hovered Location Marker (shown when no partner marker is open) */}
                  {!selectedPartnerMarker && hoveredHub && (() => {
                    const hub = hoveredHub;
                    const svgX = (hub.x / 100) * 800;
                    const svgY = (hub.y / 100) * 500;

                    // Real-time viewport position inside 800x500 box
                    const viewportY = svgY * scale + pan.y;
                    const viewportX = svgX * scale + pan.x;

                    // Flip placement if marker is near the top of the viewport
                    const isRenderBelow = viewportY < 135;

                    // Counter-scale factor so the popover always has consistent readable physical size
                    const popoverScale = 1 / scale;

                    // Popover dimensions in physical units
                    const popoverWidth = 244;
                    const popoverHeight = 98;
                    const halfW = popoverWidth / 2;

                    // Calculate horizontal shift to keep popover inside the 800x500 viewport
                    let shiftX = 0;
                    if (viewportX - halfW < 18) {
                      shiftX = (18 - (viewportX - halfW)) * popoverScale;
                    } else if (viewportX + halfW > 800 - 18) {
                      shiftX = ((800 - 18) - (viewportX + halfW)) * popoverScale;
                    }

                    // Vertical placement offset relative to marker
                    const arrowHeight = 10;
                    const markerRadius = 14;
                    const gap = 6;
                    const offsetY = isRenderBelow
                      ? markerRadius + gap
                      : -(popoverHeight + arrowHeight + markerRadius + gap);

                    return (
                      <g
                        id={`marker-popover-${hub.name.toLowerCase().replace(/\s+/g, '-')}`}
                        transform={`translate(${svgX}, ${svgY}) scale(${popoverScale})`}
                        className="cursor-pointer select-none transition-all duration-150"
                        filter="url(#popover-shadow)"
                        onMouseEnter={handlePopoverMouseEnter}
                        onMouseLeave={handlePopoverMouseLeave}
                        onClick={(e) => {
                          e.stopPropagation();
                          focusOnHub(hub);
                          onSelectCountry(hub.name);
                        }}
                      >
                        <g transform={`translate(${shiftX}, ${offsetY})`}>
                          {/* Rounded Container Card */}
                          <rect
                            x={-halfW}
                            y="0"
                            width={popoverWidth}
                            height={popoverHeight}
                            rx="14"
                            fill="url(#popover-grad)"
                            stroke="#a3e635"
                            strokeWidth="1.75"
                          />

                          {/* Indicator Arrow Pointing at the Glowing Marker Pin */}
                          {isRenderBelow ? (
                            <polygon
                              points={`${-shiftX - 9},0 ${-shiftX},${-arrowHeight} ${-shiftX + 9},0`}
                              fill="#0b2446"
                              stroke="#a3e635"
                              strokeWidth="1.75"
                            />
                          ) : (
                            <polygon
                              points={`${-shiftX - 9},${popoverHeight} ${-shiftX},${popoverHeight + arrowHeight} ${-shiftX + 9},${popoverHeight}`}
                              fill="#061528"
                              stroke="#a3e635"
                              strokeWidth="1.75"
                            />
                          )}

                          {/* Cover stroke seam at arrow base */}
                          {isRenderBelow ? (
                            <line
                              x1={-shiftX - 7.5}
                              y1="0.75"
                              x2={-shiftX + 7.5}
                              y2="0.75"
                              stroke="#0b2446"
                              strokeWidth="2.5"
                            />
                          ) : (
                            <line
                              x1={-shiftX - 7.5}
                              y1={popoverHeight - 0.75}
                              x2={-shiftX + 7.5}
                              y2={popoverHeight - 0.75}
                              stroke="#061528"
                              strokeWidth="2.5"
                            />
                          )}

                          {/* Header Row: Flag + Country Name + Regional Tier */}
                          <g transform="translate(0, 20)">
                            <text
                              x={-halfW + 14}
                              y="0"
                              textAnchor="start"
                              fill="#ffffff"
                              fontSize="13"
                              fontWeight="800"
                              letterSpacing="-0.2"
                            >
                              {hub.flag} {hub.name}
                            </text>
                            {/* Tier Badge on right */}
                            <rect
                              x={halfW - 92}
                              y="-12"
                              width="78"
                              height="17"
                              rx="8.5"
                              fill="#1e3a5f"
                              stroke="#38bdf8"
                              strokeWidth="0.8"
                            />
                            <text
                              x={halfW - 53}
                              y="0"
                              textAnchor="middle"
                              fill="#7dd3fc"
                              fontSize="8.5"
                              fontWeight="700"
                            >
                              {hub.tier}
                            </text>
                          </g>

                          {/* Live Available Partners Hero Pill */}
                          <g transform="translate(0, 44)">
                            <rect
                              x={-halfW + 12}
                              y="-12"
                              width={popoverWidth - 24}
                              height="24"
                              rx="12"
                              fill="#0c2d1b"
                              stroke="#4ade80"
                              strokeWidth="1.2"
                            />
                            {/* Pulsing Beacon Dot */}
                            <circle cx={-halfW + 26} cy="0" r="4.5" fill="#4ade80" />
                            <circle cx={-halfW + 26} cy="0" r="8" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.6" />

                            {/* Number of Available Partners Text */}
                            <text
                              x={-halfW + 40}
                              y="4"
                              textAnchor="start"
                              fill="#4ade80"
                              fontSize="12"
                              fontWeight="900"
                              data-testid="popover-partner-count"
                            >
                              {hub.count} Verified Partners Available
                            </text>
                            <text
                              x={halfW - 20}
                              y="3.5"
                              textAnchor="end"
                              fill="#86efac"
                              fontSize="8.5"
                              fontWeight="600"
                            >
                              Live
                            </text>
                          </g>

                          {/* Commercial Hub Cities */}
                          <text
                            x={-halfW + 14}
                            y="70"
                            textAnchor="start"
                            fill="#94a3b8"
                            fontSize="9"
                            fontWeight="500"
                          >
                            📍 {hub.cities}
                          </text>

                          {/* Interactive CTA Banner at bottom */}
                          <g transform={`translate(0, 85)`}>
                            <rect
                              x={-halfW + 12}
                              y="-9"
                              width={popoverWidth - 24}
                              height="18"
                              rx="6"
                              fill="#132b47"
                              stroke="#38bdf8"
                              strokeWidth="0.8"
                              className="hover:fill-[#1b3d63] transition-colors"
                            />
                            <text
                              x="0"
                              y="3.5"
                              textAnchor="middle"
                              fill="#38bdf8"
                              fontSize="8.5"
                              fontWeight="800"
                            >
                              Click marker to view {hub.name} partners →
                            </text>
                          </g>
                        </g>
                      </g>
                    );
                  })()}

                  {/* Interactive Coverage Heatmap Tooltip */}
                  {showHeatmap && hoveredHeatmapCountry && !selectedPartnerMarker && !hoveredHub && (() => {
                    const country = hoveredHeatmapCountry;
                    const coverageTier = getCountryCoverageTier(country);
                    const isUnderserved = coverageTier.isUnderserved;
                    const cX = (country.center.x / 100) * 800;
                    const cY = (country.center.y / 100) * 500;
                    const tooltipWidth = 240;
                    const tooltipHeight = 118;
                    const halfW = tooltipWidth / 2;
                    const isUpperHalf = cY > 220;
                    const offsetY = isUpperHalf ? -tooltipHeight - 16 : 22;

                    return (
                      <g
                        id="heatmap-country-tooltip"
                        transform={`translate(${cX}, ${cY + offsetY})`}
                        className="pointer-events-none transition-all duration-200 select-none z-30"
                        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.85))' }}
                      >
                        {/* Tooltip Background Card */}
                        <rect
                          x={-halfW}
                          y="0"
                          width={tooltipWidth}
                          height={tooltipHeight}
                          rx="14"
                          fill="#07182c"
                          stroke={isUnderserved ? '#fb923c' : '#38bdf8'}
                          strokeWidth={isUnderserved ? '1.5' : '1.2'}
                        />

                        {/* Top Accent Strip */}
                        <rect
                          x={-halfW}
                          y="0"
                          width={tooltipWidth}
                          height="4"
                          rx="2"
                          fill={isUnderserved ? '#ea580c' : coverageTier.fillColor}
                        />

                        {/* Header: Flag, Name & Coverage Tier Badge */}
                        <g transform="translate(0, 20)">
                          <text
                            x={-halfW + 12}
                            y="0"
                            textAnchor="start"
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="800"
                          >
                            {country.flag} {country.country}
                          </text>
                          <rect
                            x={halfW - (isUnderserved ? 104 : 96)}
                            y="-11"
                            width={isUnderserved ? 96 : 88}
                            height="16"
                            rx="8"
                            fill={isUnderserved ? '#431407' : '#042f2e'}
                            stroke={isUnderserved ? '#fb923c' : coverageTier.strokeColor}
                            strokeWidth="0.8"
                          />
                          <text
                            x={halfW - (isUnderserved ? 56 : 52)}
                            y="0"
                            textAnchor="middle"
                            fill={isUnderserved ? '#fed7aa' : coverageTier.statusColor}
                            fontSize="7.5"
                            fontWeight="800"
                          >
                            {isUnderserved ? '⚠️ Underserved' : coverageTier.shortLabel}
                          </text>
                        </g>

                        {/* Key Metric Highlight Box: Partner Density */}
                        <g transform="translate(0, 48)">
                          <rect
                            x={-halfW + 10}
                            y="-12"
                            width={tooltipWidth - 20}
                            height="24"
                            rx="8"
                            fill={isUnderserved ? '#2c1206' : '#0d243e'}
                            stroke={isUnderserved ? '#7c2d12' : '#1e40af'}
                            strokeWidth="0.8"
                          />
                          <text
                            x={-halfW + 18}
                            y="4"
                            textAnchor="start"
                            fill={isUnderserved ? '#fdba74' : '#38bdf8'}
                            fontSize="9.5"
                            fontWeight="700"
                          >
                            {isUnderserved ? '⚠️ Partner Shortage:' : '👥 Certified Partners:'}
                          </text>
                          <text
                            x={halfW - 18}
                            y="4"
                            textAnchor="end"
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="900"
                          >
                            {country.partnerCount} verified
                          </text>
                        </g>

                        {/* Secondary stats */}
                        <g transform="translate(0, 80)">
                          <text
                            x={-halfW + 12}
                            y="0"
                            textAnchor="start"
                            fill="#94a3b8"
                            fontSize="8.5"
                            fontWeight="500"
                          >
                            Inquiries: <tspan fill="#4ade80" fontWeight="700">{country.monthlyInquiries}/mo ({country.growthRateYoY})</tspan>
                          </text>
                          <text
                            x={-halfW + 12}
                            y="14"
                            textAnchor="start"
                            fill={isUnderserved ? '#fdba74' : '#94a3b8'}
                            fontSize="8"
                            fontWeight={isUnderserved ? '700' : '500'}
                          >
                            {isUnderserved 
                              ? '⚡ High expansion opportunity for tech advisors' 
                              : `Top Need: ${country.topDemandedSolutions[0]}`}
                          </text>
                        </g>

                        {/* Pointer Arrow */}
                        {isUpperHalf ? (
                          <polygon
                            points="-7,118 7,118 0,126"
                            fill="#07182c"
                            stroke={isUnderserved ? '#fb923c' : '#38bdf8'}
                            strokeWidth="1.2"
                          />
                        ) : (
                          <polygon
                            points="-7,0 7,0 0,-8"
                            fill="#07182c"
                            stroke={isUnderserved ? '#fb923c' : '#38bdf8'}
                            strokeWidth="1.2"
                          />
                        )}
                      </g>
                    );
                  })()}

                  {/* Empty Search Result Callout in SVG Map Canvas */}
                  {searchQuery.trim() && totalMatchingMarkers === 0 && (
                    <g transform={`translate(${400 - pan.x / scale}, ${250 - pan.y / scale}) scale(${1 / scale})`} className="pointer-events-none select-none">
                      <rect x="-160" y="-36" width="320" height="72" rx="14" fill="#061528" fillOpacity="0.96" stroke="#f43f5e" strokeWidth="1.5" />
                      <text x="0" y="-8" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="bold">
                        No map markers match "{searchQuery}"
                      </text>
                      <text x="0" y="14" textAnchor="middle" fill="#94a3b8" fontSize="10">
                        Try searching for Lagos, Nairobi, Ghana, or Johannesburg
                      </text>
                    </g>
                  )}

                  {/* Connecting corridor from User Position to Nearest Verified Partner */}
                  {isNearMeActive && nearMeResult && userLocation && (() => {
                    const pCoords = partnerPinCoordinates[nearMeResult.nearestPartner.id] || PARTNER_MAP_COORDINATES[nearMeResult.nearestPartner.id] || { x: 45, y: 50 };
                    const pSvgX = (pCoords.x / 100) * 800;
                    const pSvgY = (pCoords.y / 100) * 500;
                    const midX = (userLocation.svgX + pSvgX) / 2;
                    const midY = (userLocation.svgY + pSvgY) / 2;

                    return (
                      <g id="near-me-corridor-connection" className="pointer-events-none select-none">
                        {/* Outer corridor glow */}
                        <line
                          x1={userLocation.svgX}
                          y1={userLocation.svgY}
                          x2={pSvgX}
                          y2={pSvgY}
                          stroke="#a3e635"
                          strokeWidth={3 / Math.sqrt(scale)}
                          opacity="0.35"
                        />
                        {/* Dashed animated corridor line */}
                        <line
                          x1={userLocation.svgX}
                          y1={userLocation.svgY}
                          x2={pSvgX}
                          y2={pSvgY}
                          stroke="#a3e635"
                          strokeWidth={1.75 / Math.sqrt(scale)}
                          strokeDasharray="4 3"
                          opacity="0.9"
                        />
                        {/* Distance Callout Tag at corridor midpoint */}
                        <g transform={`translate(${midX}, ${midY}) scale(${1 / Math.sqrt(scale)})`}>
                          <rect
                            x="-44"
                            y="-10"
                            width="88"
                            height="20"
                            rx="10"
                            fill="#061528"
                            fillOpacity="0.95"
                            stroke="#a3e635"
                            strokeWidth="1.25"
                          />
                          <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            fill="#a3e635"
                            fontSize="9"
                            fontWeight="900"
                          >
                            ⚡ {formatDistanceKm(nearMeResult.distanceKm)}
                          </text>
                        </g>
                      </g>
                    );
                  })()}

                  {/* User Current Position Beacon Marker on Map */}
                  {userLocation && (
                    <g
                      id="user-current-location-marker"
                      data-testid="user-current-location-marker"
                      transform={`translate(${userLocation.svgX}, ${userLocation.svgY})`}
                      className="select-none pointer-events-none"
                    >
                      {/* Concentric Pulsing Radar Rings */}
                      <circle
                        r={28 / Math.sqrt(scale)}
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth={2 / Math.sqrt(scale)}
                        opacity="0.75"
                        className="animate-ping"
                      />
                      <circle
                        r={18 / Math.sqrt(scale)}
                        fill="#0ea5e9"
                        opacity="0.25"
                        className="animate-pulse"
                      />
                      
                      {/* Inner Core */}
                      <circle
                        r={8 / Math.sqrt(scale)}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2 / Math.sqrt(scale)}
                      />
                      <circle
                        r={3.5 / Math.sqrt(scale)}
                        fill="#38bdf8"
                      />

                      {/* Location Tag */}
                      <g transform={`translate(0, ${-16 / Math.sqrt(scale)}) scale(${1 / Math.sqrt(scale)})`}>
                        <rect
                          x="-42"
                          y="-9"
                          width="84"
                          height="18"
                          rx="9"
                          fill="#0369a1"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8.5"
                          fontWeight="900"
                        >
                          📍 You Are Here
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              </svg>

              {/* Map Floating Bottom Helper Bar with Layer Toggles and Instructions */}
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl px-3 py-2 text-[11px] text-slate-300 backdrop-blur-md flex flex-wrap items-center gap-2.5 shadow-xl">
                {/* View Mode Segmented Switcher Pill */}
                <div 
                  role="tablist"
                  aria-label="Canvas View Mode Switcher"
                  className="inline-flex p-0.5 bg-slate-950 border border-slate-700/90 rounded-xl"
                >
                  <button
                    type="button"
                    id="btn-canvas-view-pins"
                    data-testid="btn-canvas-view-pins"
                    role="tab"
                    aria-selected={!showHeatmap}
                    onClick={() => handleSwitchMapMode('pins')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-[10px] ${
                      !showHeatmap
                        ? 'bg-sky-600 text-white shadow-xs font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Default Marker Pin View: Show individual partner pins and regional hubs without country heat shading"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Marker Pins</span>
                  </button>

                  <button
                    type="button"
                    id="btn-canvas-view-heatmap"
                    data-testid="btn-canvas-view-heatmap"
                    role="tab"
                    aria-selected={showHeatmap}
                    onClick={() => handleSwitchMapMode('heatmap')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-[10px] ${
                      showHeatmap
                        ? 'bg-lime-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Regional Coverage Heatmap: Shading partner density per country"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Coverage Heatmap</span>
                  </button>
                </div>

                {/* Partner Markers Toggle */}
                <button
                  type="button"
                  id="btn-toggle-partner-markers"
                  data-testid="btn-toggle-partner-markers"
                  onClick={() => {
                    const next = !showPartnerMarkers;
                    setShowPartnerMarkers(next);
                    announce(next ? 'Partner pins layer shown.' : 'Partner pins layer hidden.');
                  }}
                  className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-[10px] ${
                    showPartnerMarkers
                      ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40 shadow-xs'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                  }`}
                  title="Toggle Partner Markers"
                >
                  <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                  <span>Partner Pins ({filteredPartnerMarkers.length}{(searchQuery.trim() || isDirectoryFiltered) ? `/${PARTNERS_DATA.length}` : ''})</span>
                </button>

                {/* Country Hubs Toggle */}
                <button
                  type="button"
                  id="btn-toggle-country-hubs"
                  data-testid="btn-toggle-country-hubs"
                  onClick={() => {
                    const next = !showCountryHubs;
                    setShowCountryHubs(next);
                    announce(next ? 'Country hubs layer shown.' : 'Country hubs layer hidden.');
                  }}
                  className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-[10px] ${
                    showCountryHubs
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                  }`}
                  title="Toggle Country Hub Markers"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>Country Hubs ({filteredHubs.length}{searchQuery.trim() ? `/${highlightedHubs.length}` : ''})</span>
                </button>

                {/* High Contrast Mode Toggle for Visually Impaired Users */}
                <button
                  type="button"
                  id="btn-toggle-high-contrast"
                  data-testid="btn-toggle-high-contrast"
                  aria-pressed={highContrastMode}
                  onClick={() => {
                    const next = !highContrastMode;
                    setHighContrastMode(next);
                    announce(next ? 'High contrast mode enabled for map markers and heatmaps.' : 'High contrast mode disabled.');
                  }}
                  className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-[10px] ${
                    highContrastMode
                      ? 'bg-yellow-400 text-slate-950 font-black shadow-xs ring-1 ring-yellow-300'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                  }`}
                  title={highContrastMode ? "Disable high contrast mode" : "Enable high contrast mode for enhanced marker and heatmap visibility"}
                  aria-label="Toggle high contrast map mode"
                >
                  <Eye className="w-3 h-3" />
                  <span>{highContrastMode ? 'High Contrast ON' : 'High Contrast'}</span>
                </button>

                <div className="hidden md:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-2">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>Click any country or pin to inspect live regional demand</span>
                </div>
              </div>

              {/* Floating Accessible Map Legend Component */}
              <div 
                id="floating-map-legend"
                data-testid="floating-map-legend"
                role="region"
                aria-label="Map Marker Legend"
                className="absolute bottom-14 sm:bottom-3 right-3 z-20 max-w-[240px] sm:max-w-[260px] bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 text-xs text-slate-300 backdrop-blur-md shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-lime-400" />
                    <span>Map Marker Legend</span>
                  </div>
                  <button
                    type="button"
                    id="btn-toggle-legend-collapse"
                    onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title={isLegendCollapsed ? "Expand Map Legend" : "Collapse Map Legend"}
                    aria-label="Toggle Map Legend"
                  >
                    {isLegendCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {!isLegendCollapsed && (
                  <div className="mt-2 space-y-1 text-[10.5px]">
                    {/* Category: Accountant */}
                    <button
                      type="button"
                      id="legend-filter-accountant"
                      onClick={() => {
                        const next = selectedLegendType === 'accountant' ? 'all' : 'accountant';
                        setSelectedLegendType(next);
                        announce(next === 'all' ? 'Showing all partner categories on map.' : 'Map markers filtered by category: Accountant & Tax Advisors.');
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all ${
                        selectedLegendType === 'accountant'
                          ? 'bg-amber-500/25 border border-amber-500/50 text-amber-300 font-bold'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                      title="Filter map to show Accountants & Tax Specialists"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                        <div className="flex items-center gap-1">
                          <Calculator className="w-3 h-3 text-amber-400" />
                          <span>Accountant & Tax</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sourceFilteredPartners.filter(p => getPartnerCategory(p.partnerType) === 'accountant').length}
                      </span>
                    </button>

                    {/* Category: Business Consultant */}
                    <button
                      type="button"
                      id="legend-filter-consultant"
                      onClick={() => {
                        const next = selectedLegendType === 'consultant' ? 'all' : 'consultant';
                        setSelectedLegendType(next);
                        announce(next === 'all' ? 'Showing all partner categories on map.' : 'Map markers filtered by category: Business Consultants & Advisors.');
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all ${
                        selectedLegendType === 'consultant'
                          ? 'bg-purple-500/25 border border-purple-500/50 text-purple-300 font-bold'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                      title="Filter map to show Business Consultants & SME Advisors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-purple-400/30"></span>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-purple-400" />
                          <span>Consultant</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sourceFilteredPartners.filter(p => getPartnerCategory(p.partnerType) === 'consultant').length}
                      </span>
                    </button>

                    {/* Category: Technology Partner */}
                    <button
                      type="button"
                      id="legend-filter-technology"
                      onClick={() => {
                        const next = selectedLegendType === 'technology' ? 'all' : 'technology';
                        setSelectedLegendType(next);
                        announce(next === 'all' ? 'Showing all partner categories on map.' : 'Map markers filtered by category: Technology Integrators & POS Hardware.');
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all ${
                        selectedLegendType === 'technology'
                          ? 'bg-sky-500/25 border border-sky-500/50 text-sky-300 font-bold'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                      title="Filter map to show POS & Technology Integrators"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-400/30"></span>
                        <div className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-sky-400" />
                          <span>Technology & POS</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sourceFilteredPartners.filter(p => getPartnerCategory(p.partnerType) === 'technology').length}
                      </span>
                    </button>

                    {/* Commercial Hub Node */}
                    <div className="flex items-center justify-between p-1.5 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-sky-400 bg-[#091e38]"></span>
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-sky-400" />
                          <span>Country Trade Hub</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono">{highlightedHubs.length}</span>
                    </div>

                    {/* Geolocation / Near Me Pin */}
                    <div className="flex items-center justify-between p-1.5 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></span>
                        <div className="flex items-center gap-1">
                          <LocateFixed className="w-3 h-3 text-lime-400" />
                          <span>Nearest / User GPS</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-lime-400 font-mono font-bold">LIVE</span>
                    </div>

                    {selectedLegendType !== 'all' && (
                      <button
                        type="button"
                        id="btn-reset-legend-filter"
                        onClick={() => setSelectedLegendType('all')}
                        className="w-full mt-1.5 py-1 text-[10px] font-bold text-center text-lime-400 bg-lime-500/15 hover:bg-lime-500/25 rounded-md border border-lime-500/30 transition-all"
                      >
                        Reset Filter (Show All Types)
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right: Partner Spotlight or Country Highlight Card & Quick Actions */}
            <div className="lg:col-span-4 space-y-4">
              
              {selectedPartnerMarker ? (
                /* Partner Spotlight Card (Shown when partner marker is clicked) */
                <div 
                  id="map-partner-spotlight-card"
                  data-testid="map-partner-spotlight-card"
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-lime-500/60 shadow-lg dark:shadow-2xl space-y-4 transition-all animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${
                          selectedPartnerMarker.level === 'Platinum'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : selectedPartnerMarker.level === 'Gold'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                            : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
                        }`}>
                          {selectedPartnerMarker.level} Partner
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          ✓ Verified
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                        {selectedPartnerMarker.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                        {selectedPartnerMarker.countryFlag} {selectedPartnerMarker.city}, {selectedPartnerMarker.country} • {selectedPartnerMarker.partnerType}
                      </p>
                    </div>

                    <button
                      type="button"
                      id="btn-close-spotlight-card"
                      onClick={() => setSelectedPartnerMarker(null)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Back to country view"
                      aria-label="Close partner details"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Primary Service Area Prominent Box */}
                  <div className="p-3.5 rounded-xl bg-lime-50 dark:bg-lime-950/40 border border-lime-400/50 dark:border-lime-500/40 space-y-1">
                    <div className="text-[10px] font-extrabold text-lime-700 dark:text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                      <span>Primary Service Area</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-slate-100 leading-snug">
                      {selectedPartnerMarker.primaryServiceArea || `${selectedPartnerMarker.city}, ${selectedPartnerMarker.country}`}
                    </div>
                  </div>

                  {/* Partner Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Rating:</span>
                      <span className="font-extrabold text-amber-500">★ {selectedPartnerMarker.rating.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({selectedPartnerMarker.reviewCount})</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Response Speed:</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400">⚡ {selectedPartnerMarker.responseTime}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Starting Budget:</span>
                      <span className="font-bold text-lime-600 dark:text-lime-400">
                        {formatBudget(selectedPartnerMarker.startingBudget, selectedPartnerMarker.minBudgetUSD, { prefix: '' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Availability:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedPartnerMarker.availabilityStatus}</span>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Specialties:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPartnerMarker.specialties.slice(0, 3).map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      id="btn-spotlight-view-profile"
                      onClick={() => {
                        if (onSelectPartner) {
                          onSelectPartner(selectedPartnerMarker);
                        } else {
                          onSelectCountry(selectedPartnerMarker.country);
                        }
                      }}
                      className="py-2.5 px-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      id="btn-spotlight-contact-partner"
                      onClick={() => {
                        if (onContactPartner) {
                          onContactPartner(selectedPartnerMarker);
                        } else {
                          onSelectCountry(selectedPartnerMarker.country);
                        }
                      }}
                      className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Contact</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPartnerMarker(null)}
                    className="w-full py-1 text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    ← Switch back to {currentHub.name} country view
                  </button>
                </div>
              ) : showHeatmap ? (
                /* Regional Coverage & Opportunity Dossier (Heatmap active state) */
                (() => {
                  const activeHeatmapItem = COUNTRY_HEATMAP_DATA.find(c => c.country.toLowerCase() === activeCountry.toLowerCase()) 
                    || selectedHeatmapCountry 
                    || COUNTRY_HEATMAP_DATA[0];
                  const coverageTier = getCountryCoverageTier(activeHeatmapItem);
                  const isUnderserved = coverageTier.isUnderserved;

                  return (
                    <div 
                      id="map-market-demand-dossier"
                      data-testid="map-market-demand-dossier"
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/95 border-2 border-slate-200 dark:border-slate-700/80 shadow-lg dark:shadow-2xl space-y-4 transition-all animate-in fade-in duration-200"
                    >
                      {/* Card Header with Coverage Tier Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border flex items-center gap-1 ${
                              isUnderserved
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs'
                                : coverageTier.tier === 'comprehensive'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
                            }`}>
                              {isUnderserved ? <AlertCircle className="w-3 h-3 text-amber-500" /> : <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                              <span>{coverageTier.label}</span>
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                              {activeHeatmapItem.region}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-3xl">{activeHeatmapItem.flag}</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                              {activeHeatmapItem.country}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-2xl font-black font-mono ${isUnderserved ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {activeHeatmapItem.partnerCount}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Certified Partners
                          </div>
                        </div>
                      </div>

                      {/* Underserved Opportunity Spotlight Alert Box */}
                      {isUnderserved && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                          <div className="font-extrabold text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Underserved Market Opportunity</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                            {activeHeatmapItem.country} has only <strong className="text-amber-600 dark:text-amber-300">{activeHeatmapItem.partnerCount} certified partners</strong> handling <strong className="text-slate-900 dark:text-white">{activeHeatmapItem.monthlyInquiries} monthly client inquiries</strong>. High priority territory for new tech advisors and remote accounting specialists.
                          </p>
                        </div>
                      )}

                      {/* Visual Opportunity Gauge Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Partner Expansion Opportunity Index:</span>
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono font-extrabold">
                            {activeHeatmapItem.opportunityScore}/100
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700/80">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUnderserved
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : activeHeatmapItem.opportunityScore >= 90
                                ? 'bg-gradient-to-r from-lime-500 to-amber-500'
                                : 'bg-gradient-to-r from-sky-500 to-emerald-500'
                            }`}
                            style={{ width: `${activeHeatmapItem.opportunityScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 4-Metric Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Supply Deficit:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{activeHeatmapItem.partnerDensityRatio}</span>
                          <span className={`text-[10px] block font-bold ${isUnderserved ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {isUnderserved ? 'High Partner Shortage' : 'Balanced Capacity'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Monthly Inquiries:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{activeHeatmapItem.monthlyInquiries} / month</span>
                          <span className="text-[10px] text-emerald-500 block font-bold">{activeHeatmapItem.growthRateYoY}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Partner Coverage:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{activeHeatmapItem.partnerCount} verified</span>
                          <span className="text-[10px] text-sky-500 block font-semibold">{coverageTier.shortLabel}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Typical Project Budget:</span>
                          <span className="font-extrabold text-lime-600 dark:text-lime-400">{activeHeatmapItem.avgProjectBudget}</span>
                          <span className="text-[10px] text-slate-400 block font-semibold">Per SME rollout</span>
                        </div>
                      </div>

                      {/* Top Demanded Solutions */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Primary In-Demand Solutions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeHeatmapItem.topDemandedSolutions.map((sol) => (
                            <span key={sol} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40">
                              {sol}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Primary Call to Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          id="btn-claim-demand-partner"
                          onClick={() => {
                            if (onOpenBecomePartner) {
                              onOpenBecomePartner();
                            } else {
                              const el = document.getElementById('become-partner');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className={`py-2.5 px-3 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95 ${
                            isUnderserved
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20'
                              : 'bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-slate-950 font-black'
                          }`}
                          title={isUnderserved ? `Apply to become a partner in underserved market ${activeHeatmapItem.country}` : `Join our network in ${activeHeatmapItem.country}`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isUnderserved ? 'Apply in Region' : 'Become Partner'}</span>
                        </button>

                        <button
                          type="button"
                          id="btn-dossier-view-directory"
                          onClick={() => onSelectCountry(activeHeatmapItem.country)}
                          className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <span>Explore Partners</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Country Hub Overview Card (Default Marker Pin View) */
                <div 
                  id="map-country-hub-card"
                  data-testid="map-country-hub-card"
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-xl space-y-5 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-lime-100 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20">
                          {currentHub.tier}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-400" /> Marker Pin Focus
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-3xl">{currentHub.flag}</span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentHub.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-lime-600 dark:text-lime-400">{currentHub.count}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Partners</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Key Commercial Hubs:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{currentHub.cities}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Compliance Specialization:</span>
                      <span className="font-semibold text-lime-700 dark:text-lime-300">Accounting, POS, Fiscal Tax</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Service Coverage:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">On-site + Certified Remote</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => focusOnHub(currentHub)}
                      className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      title={`Zoom directly to ${currentHub.name} on map`}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                      <span>Focus on Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectCountry(currentHub.name)}
                      className="py-2.5 px-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <span>View Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Top Market Demand Hotspots Leaderboard (Active when Heatmap is ON) */}
              {showHeatmap && !selectedPartnerMarker && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>Top Demand Hotspots:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Highest Partner Demand
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[...COUNTRY_HEATMAP_DATA]
                      .sort((a, b) => b.opportunityScore - a.opportunityScore)
                      .slice(0, 5)
                      .map((item, idx) => {
                        const isCurrent = activeCountry.toLowerCase() === item.country.toLowerCase();
                        return (
                          <button
                            key={item.id}
                            id={`btn-hotspot-${item.id.toLowerCase()}`}
                            type="button"
                            onClick={() => focusOnHeatmapCountry(item)}
                            className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                              isCurrent
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-900 dark:text-rose-200 shadow-sm'
                                : 'bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                            title={`Inspect market demand in ${item.country}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <span className="text-base">{item.flag}</span>
                              <span className="font-bold text-slate-900 dark:text-white">{item.country}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                {item.activeProjects.toLocaleString()} projects
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                item.opportunityScore >= 95
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              }`}>
                                {item.opportunityScore}% Hot
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Quick Preview Partner Markers (Synced with Currently Filtered Results) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {isDirectoryFiltered
                      ? `Filtered Map Pins (${filteredPartnerMarkers.length}):`
                      : 'Quick Preview Partner Markers:'}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Click to select on map
                  </span>
                </div>
                {filteredPartnerMarkers.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {(isDirectoryFiltered ? filteredPartnerMarkers : filteredPartnerMarkers.slice(0, 8)).map((p) => {
                      const isSelected = selectedPartnerMarker?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          id={`btn-jump-partner-${p.id}`}
                          type="button"
                          onClick={() => focusOnPartner(p)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-lime-500 text-slate-950 shadow-md font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                          }`}
                          title={`Click to select and preview ${p.name} on the map`}
                        >
                          <span>{p.countryFlag}</span>
                          <span>{p.name.length > 15 ? p.name.slice(0, 14) + '…' : p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
                    <span>No partner pins match your current filter selection.</span>
                    {onResetDirectoryFilters && (
                      <button
                        type="button"
                        onClick={onResetDirectoryFilters}
                        className="text-lime-600 dark:text-lime-400 font-bold hover:underline shrink-0 cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Country Selector Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Quick Select African Markets:
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Click to center
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(searchQuery.trim() && filteredHubs.length > 0 ? filteredHubs : highlightedHubs).slice(0, 12).map((h) => (
                    <button
                      key={h.name}
                      id={`btn-select-hub-${h.name.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => {
                        setSelectedPartnerMarker(null);
                        focusOnHub(h);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeCountry === h.name && !selectedPartnerMarker
                          ? 'bg-lime-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span>{h.flag}</span>
                      <span>{h.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Screen-Reader Friendly Map Legend & Partner Tier Symbol Guide */}
          <div className="mt-8">
            <MapLegendAccessibility
              onAnnounce={announce}
              selectedTierFilter={selectedTierFilter}
              onSelectTierFilter={(tier) => {
                setSelectedTierFilter(tier);
                announce(tier ? `Map filtered by partner tier: ${tier}.` : 'Cleared tier filter. Showing all partner tiers.');
              }}
              highContrastMode={highContrastMode}
            />
          </div>

        </div>

      </div>
    </section>
  );
};
