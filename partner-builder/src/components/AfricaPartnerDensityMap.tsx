import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { CertifiedPartner } from '../types';
import { 
  Globe2, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Search, 
  X, 
  Star, 
  Maximize2,
  Navigation,
  Compass,
  Radio,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AFRICA_MAP_PATHS, AfricaCountryPath } from '../data/africaMapPaths';

interface AfricaPartnerDensityMapProps {
  partners: CertifiedPartner[];
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
  className?: string;
  onContactPartner?: (partner: CertifiedPartner) => void;
}

interface RegionStats {
  regionKey: AfricaCountryPath['region'];
  label: string;
  count: number;
  activeCountries: number;
  partnerNames: string[];
}

interface HoveredCountryInfo {
  country: AfricaCountryPath;
  count: number;
  regionLabel: string;
  regionPartnerCount: number;
  regionActiveCountries: number;
  partnerNames: string[];
  services: string[];
  x: number;
  y: number;
}

interface HoveredRegionBoxInfo {
  title: string;
  subtitle: string;
  count: number;
  countries: string[];
  x: number;
  y: number;
}

interface RegionPreset {
  id: string;
  name: string;
  shortLabel: string;
  flag: string;
  center: [number, number];
  scale: number;
  countryCodes: string[];
  description: string;
}

const REGION_PRESETS: RegionPreset[] = [
  {
    id: 'all',
    name: 'All Hubs (Global)',
    shortLabel: 'Global View',
    flag: '🌍',
    center: [400, 390],
    scale: 1.0,
    countryCodes: [],
    description: 'Pan-African & Global Diaspora certified partner ecosystem'
  },
  {
    id: 'west',
    name: 'West Africa',
    shortLabel: 'West Africa',
    flag: '🇳🇬',
    center: [240, 420],
    scale: 2.35,
    countryCodes: ['NG', 'GH', 'SN', 'CI', 'NE', 'ML', 'BF', 'GN', 'SL', 'LR', 'TG', 'BJ'],
    description: 'Lagos & Accra retail POS, commerce and FIRS tax compliance corridor'
  },
  {
    id: 'east',
    name: 'East Africa',
    shortLabel: 'East Africa',
    flag: '🇰🇪',
    center: [530, 460],
    scale: 2.45,
    countryCodes: ['KE', 'RW', 'UG', 'TZ', 'ET', 'SS'],
    description: 'Silicon Savannah, KRA/EBM electronic billing and mobile money POS hub'
  },
  {
    id: 'south',
    name: 'Southern Africa',
    shortLabel: 'Southern Africa',
    flag: '🇿🇦',
    center: [450, 650],
    scale: 2.35,
    countryCodes: ['ZA', 'BW', 'NA', 'ZW', 'MZ', 'ZM', 'MW', 'AO', 'LS', 'SZ', 'MG'],
    description: 'Enterprise ERP implementations, SARS tax filings and mining/supply chain'
  },
  {
    id: 'north',
    name: 'North Africa',
    shortLabel: 'North Africa',
    flag: '🇪🇬',
    center: [380, 180],
    scale: 2.15,
    countryCodes: ['EG', 'MA', 'DZ', 'TN', 'LY', 'SD'],
    description: 'Bilingual Arabic & French advisory practices with ETA e-invoicing'
  },
  {
    id: 'global',
    name: 'Global Diaspora Hubs',
    shortLabel: 'Global Markets',
    flag: '🌐',
    center: [420, 150],
    scale: 1.35,
    countryCodes: ['GB', 'US', 'CA', 'AE', 'IN', 'AU'],
    description: 'UK, US, Canada, UAE, India and Australia international trade desks'
  }
];

// Network flight / data synchronization corridors connecting Africa to global financial hubs
interface NetworkArc {
  id: string;
  sourceName: string;
  sourceCoord: [number, number];
  targetName: string;
  targetCoord: [number, number];
  controlPoint: [number, number];
  label: string;
}

const GLOBAL_NETWORK_ARCS: NetworkArc[] = [
  {
    id: 'ng-gb',
    sourceName: 'Lagos',
    sourceCoord: [330, 420],
    targetName: 'London',
    targetCoord: [680, 50],
    controlPoint: [480, 170],
    label: 'Lagos – London Financial Corridor'
  },
  {
    id: 'ng-us',
    sourceName: 'Lagos',
    sourceCoord: [330, 420],
    targetName: 'New York',
    targetCoord: [80, 150],
    controlPoint: [170, 260],
    label: 'West Africa – North America Trade'
  },
  {
    id: 'ng-ca',
    sourceName: 'Lagos',
    sourceCoord: [330, 420],
    targetName: 'Toronto',
    targetCoord: [80, 70],
    controlPoint: [150, 200],
    label: 'West Africa – Canada Diaspora Desk'
  },
  {
    id: 'ke-ae',
    sourceName: 'Nairobi',
    sourceCoord: [540, 470],
    targetName: 'Dubai',
    targetCoord: [650, 200],
    controlPoint: [620, 310],
    label: 'East Africa – GCC Trade Bridge'
  },
  {
    id: 'ke-in',
    sourceName: 'Nairobi',
    sourceCoord: [540, 470],
    targetName: 'Mumbai',
    targetCoord: [730, 240],
    controlPoint: [670, 330],
    label: 'Nairobi – Mumbai Tech Exchange'
  },
  {
    id: 'za-au',
    sourceName: 'Johannesburg',
    sourceCoord: [450, 680],
    targetName: 'Sydney',
    targetCoord: [740, 550],
    controlPoint: [620, 660],
    label: 'Southern Africa – Asia Pacific Link'
  },
  {
    id: 'eg-gb',
    sourceName: 'Cairo',
    sourceCoord: [510, 120],
    targetName: 'London',
    targetCoord: [680, 50],
    controlPoint: [600, 70],
    label: 'Cairo – London EMEA Channel'
  },
  {
    id: 'eg-ae',
    sourceName: 'Cairo',
    sourceCoord: [510, 120],
    targetName: 'Dubai',
    targetCoord: [650, 200],
    controlPoint: [580, 150],
    label: 'MENA Enterprise Network'
  }
];

export const AfricaPartnerDensityMap: React.FC<AfricaPartnerDensityMapProps> = ({
  partners,
  selectedCountry,
  onSelectCountry,
  className = '',
  onContactPartner
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [hoveredCountry, setHoveredCountry] = useState<HoveredCountryInfo | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [isDetailCardOpen, setIsDetailCardOpen] = useState<boolean>(true);
  const [showFlightArcs, setShowFlightArcs] = useState<boolean>(true);
  const [mapSearch, setMapSearch] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const [hoveredRegionBox, setHoveredRegionBox] = useState<HoveredRegionBoxInfo | null>(null);

  // Human-readable labels for each map region
  const REGION_LABELS: Record<AfricaCountryPath['region'], string> = useMemo(() => ({
    West: 'West Africa',
    East: 'East Africa',
    South: 'Southern Africa',
    North: 'North Africa',
    Central: 'Central Africa',
    Global: 'Global Diaspora'
  }), []);

  // Compute partner count and details per country
  const countryPartnerStats = useMemo(() => {
    const stats: Record<string, { count: number; partners: CertifiedPartner[]; services: Set<string> }> = {};

    AFRICA_MAP_PATHS.forEach((c) => {
      stats[c.name.toLowerCase()] = { count: 0, partners: [], services: new Set() };
    });

    partners.forEach((p) => {
      const cName = p.country.toLowerCase();
      if (!stats[cName]) {
        stats[cName] = { count: 0, partners: [], services: new Set() };
      }
      stats[cName].count += 1;
      stats[cName].partners.push(p);
      p.services.forEach((s) => stats[cName].services.add(s));
    });

    return stats;
  }, [partners]);

  // Compute aggregate partner counts per region for custom tooltips and region pills
  const regionPartnerStats = useMemo(() => {
    const map: Record<AfricaCountryPath['region'], RegionStats> = {
      West: { regionKey: 'West', label: 'West Africa', count: 0, activeCountries: 0, partnerNames: [] },
      East: { regionKey: 'East', label: 'East Africa', count: 0, activeCountries: 0, partnerNames: [] },
      South: { regionKey: 'South', label: 'Southern Africa', count: 0, activeCountries: 0, partnerNames: [] },
      North: { regionKey: 'North', label: 'North Africa', count: 0, activeCountries: 0, partnerNames: [] },
      Central: { regionKey: 'Central', label: 'Central Africa', count: 0, activeCountries: 0, partnerNames: [] },
      Global: { regionKey: 'Global', label: 'Global Diaspora', count: 0, activeCountries: 0, partnerNames: [] }
    };

    AFRICA_MAP_PATHS.forEach((country) => {
      const cStats = countryPartnerStats[country.name.toLowerCase()];
      const cCount = cStats?.count || 0;
      const target = map[country.region];
      if (target && cCount > 0) {
        target.count += cCount;
        target.activeCountries += 1;
        cStats.partners.forEach((p) => target.partnerNames.push(p.companyName));
      }
    });

    return map;
  }, [countryPartnerStats]);

  // Helper to show tooltip for a country
  const handleShowCountryTooltip = useCallback((country: AfricaCountryPath, clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const stats = countryPartnerStats[country.name.toLowerCase()];
    const regStats = regionPartnerStats[country.region];

    setHoveredRegionBox(null);
    setHoveredCountry({
      country,
      count: stats?.count || 0,
      regionLabel: REGION_LABELS[country.region],
      regionPartnerCount: regStats?.count || 0,
      regionActiveCountries: regStats?.activeCountries || 0,
      partnerNames: stats?.partners.map((p) => p.companyName) || [],
      services: Array.from(stats?.services || []).slice(0, 3),
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  }, [countryPartnerStats, regionPartnerStats, REGION_LABELS]);

  // Total countries and active partner hubs
  const totalActiveHubs = useMemo(() => {
    return Object.values(countryPartnerStats).filter((s) => s.count > 0).length;
  }, [countryPartnerStats]);

  // D3 Zoom setup
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 5.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial centering
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));
  }, []);

  // Smooth zoom to specific coordinates and scale
  const zoomToTransform = useCallback((targetScale: number, cx: number, cy: number, duration = 750) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const tx = 400 - cx * targetScale;
    const ty = 400 - cy * targetScale;

    d3.select(svgRef.current)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(tx, ty).scale(targetScale)
      );
  }, []);

  // Zoom into country
  const zoomToCountry = useCallback((countryName: string) => {
    const countryObj = AFRICA_MAP_PATHS.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    if (!countryObj) return;

    // Determine region for active preset tab
    const reg = REGION_PRESETS.find((r) => r.countryCodes.includes(countryObj.code));
    if (reg) {
      setActiveRegion(reg.id);
    }

    const [cx, cy] = countryObj.center;
    zoomToTransform(2.8, cx, cy);
    setIsDetailCardOpen(true);
  }, [zoomToTransform]);

  // Reset zoom to default global view
  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    setActiveRegion('all');
  }, []);

  // Handle region preset selection
  const handleSelectRegion = (regionId: string) => {
    setActiveRegion(regionId);
    const preset = REGION_PRESETS.find((p) => p.id === regionId);
    if (!preset) return;

    if (regionId === 'all') {
      resetZoom();
      onSelectCountry('all');
    } else {
      zoomToTransform(preset.scale, preset.center[0], preset.center[1]);
    }
  };

  // Zoom controls (+, -, reset)
  const handleManualZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);

    if (direction === 'reset') {
      resetZoom();
      onSelectCountry('all');
    } else {
      const factor = direction === 'in' ? 1.35 : 0.75;
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, factor);
    }
  };

  // Handle clicking a country (path or pin)
  const handleCountryClick = (country: AfricaCountryPath) => {
    if (selectedCountry.toLowerCase() === country.name.toLowerCase()) {
      onSelectCountry('all');
      resetZoom();
    } else {
      onSelectCountry(country.name);
      zoomToCountry(country.name);
    }
  };

  // Synchronize when external selectedCountry prop changes
  useEffect(() => {
    if (selectedCountry && selectedCountry !== 'all') {
      zoomToCountry(selectedCountry);
    }
  }, [selectedCountry, zoomToCountry]);

  // Search suggestions for quick-jump
  const searchResults = useMemo(() => {
    if (!mapSearch.trim()) return [];
    const query = mapSearch.toLowerCase();
    return AFRICA_MAP_PATHS.filter((c) => {
      const stats = countryPartnerStats[c.name.toLowerCase()];
      const matchesCountry = c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
      const matchesPartner = stats?.partners.some((p) => p.companyName.toLowerCase().includes(query));
      return matchesCountry || matchesPartner;
    }).slice(0, 5);
  }, [mapSearch, countryPartnerStats]);

  // Countries that have registered partners
  const activePartnerCountries = useMemo(() => {
    return AFRICA_MAP_PATHS.filter((c) => {
      const count = countryPartnerStats[c.name.toLowerCase()]?.count || 0;
      return count > 0;
    }).sort((a, b) => {
      const countA = countryPartnerStats[a.name.toLowerCase()]?.count || 0;
      const countB = countryPartnerStats[b.name.toLowerCase()]?.count || 0;
      return countB - countA;
    });
  }, [countryPartnerStats]);

  const selectedCountryObj = useMemo(() => {
    return AFRICA_MAP_PATHS.find((c) => c.name.toLowerCase() === selectedCountry.toLowerCase());
  }, [selectedCountry]);

  const selectedCountryPartners = useMemo(() => {
    if (selectedCountry === 'all') return [];
    return countryPartnerStats[selectedCountry.toLowerCase()]?.partners || [];
  }, [selectedCountry, countryPartnerStats]);

  return (
    <div className={`w-full bg-slate-50/90 dark:bg-[#072457] rounded-3xl border border-slate-200 dark:border-blue-800/80 p-4 sm:p-6 mb-8 shadow-sm transition-all overflow-hidden ${className}`}>
      {/* SVG Animation Keyframes Definition */}
      <style>{`
        @keyframes flightDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .flight-arc-path {
          stroke-dasharray: 6 4;
          animation: flightDash 2.5s linear infinite;
        }
      `}</style>

      {/* Map Header & Global Network Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-blue-900/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center font-bold">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
                <span>Interactive Global & Pan-African Partner Map</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#8CE600] border border-emerald-300 dark:border-emerald-800 whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  D3 Vector Zoom & Filter
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-blue-100/70">
                Click any region preset or territory path below to zoom in, view certified firms, and filter the directory.
              </p>
            </div>
          </div>
        </div>

        {/* Global Network Metrics & Quick Search */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Search Dropdown */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Find country / firm..."
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-[#061F4A] border border-slate-200 dark:border-blue-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] w-40 sm:w-48 transition-all"
              />
              {mapSearch && (
                <button
                  type="button"
                  onClick={() => setMapSearch('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Autocomplete Flyout */}
            {isSearchFocused && searchResults.length > 0 && (
              <div 
                className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#061F4A] rounded-xl shadow-xl border border-slate-200 dark:border-blue-800 z-50 p-1.5 space-y-1"
                onMouseLeave={() => setIsSearchFocused(false)}
              >
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Fly & Zoom to Territory
                </div>
                {searchResults.map((c) => {
                  const count = countryPartnerStats[c.name.toLowerCase()]?.count || 0;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        handleCountryClick(c);
                        setMapSearch('');
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] font-mono">
                        {count} {count === 1 ? 'firm' : 'firms'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Network Flight Arcs Toggle */}
          <button
            type="button"
            onClick={() => setShowFlightArcs(!showFlightArcs)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              showFlightArcs
                ? 'bg-blue-50 dark:bg-blue-900/40 text-[#0A3981] dark:text-[#8CE600] border-blue-200 dark:border-blue-700/80 shadow-xs'
                : 'bg-white dark:bg-[#061F4A] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-blue-900 hover:text-slate-700'
            }`}
            title="Toggle global trade & synchronization lines"
          >
            <Radio className={`w-3.5 h-3.5 ${showFlightArcs ? 'animate-pulse text-[#0A3981] dark:text-[#8CE600]' : ''}`} />
            <span className="hidden sm:inline">Global Corridors</span>
          </button>

          {/* D3 Zoom Controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#061F4A] p-1 rounded-xl border border-slate-200 dark:border-blue-900 shadow-xs">
            <button
              type="button"
              onClick={() => handleManualZoom('in')}
              title="Zoom In"
              aria-label="Zoom In"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-[#8CE600] rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/40 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualZoom('out')}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-[#8CE600] rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/40 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualZoom('reset')}
              title="Reset View"
              aria-label="Reset View"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-[#8CE600] rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/40 cursor-pointer text-xs flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-400 dark:text-blue-300 hidden sm:inline select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Region Presets Selector Bar */}
      <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 dark:text-blue-300 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#0A3981] dark:text-[#8CE600]" />
          <span>Region Zoom:</span>
        </span>
        {REGION_PRESETS.map((preset) => {
          const isActive = activeRegion === preset.id;
          const regionKeyMap: Record<string, AfricaCountryPath['region'] | 'all'> = {
            all: 'all',
            west: 'West',
            east: 'East',
            south: 'South',
            north: 'North',
            global: 'Global'
          };
          const mappedKey = regionKeyMap[preset.id];
          const regionCount = mappedKey === 'all'
            ? partners.length
            : (regionPartnerStats[mappedKey]?.count || 0);

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectRegion(preset.id)}
              title={`${preset.name}: ${regionCount} certified partner${regionCount === 1 ? '' : 's'} — ${preset.description}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] shadow-sm ring-2 ring-[#0A3981]/20 dark:ring-[#8CE600]/30'
                  : 'bg-white dark:bg-[#061F4A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/80 hover:bg-slate-100 dark:hover:bg-blue-900/30'
              }`}
            >
              <span className="text-sm select-none">{preset.flag}</span>
              <span>{preset.shortLabel}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#061F4A]'
                    : 'bg-blue-50 dark:bg-blue-950 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800'
                }`}
              >
                {regionCount}
              </span>
              {isActive && <Check className="w-3 h-3 ml-0.5 stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* Active Region / Selection Status Pill */}
      {selectedCountry !== 'all' && (
        <div className="mt-2.5 flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#0A3981] dark:text-[#8CE600]">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Target Jurisdiction: {selectedCountry}</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-slate-600 dark:text-blue-200 font-normal">
              {(countryPartnerStats[selectedCountry.toLowerCase()]?.count || 0)} Certified Practice(s) Found
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelectCountry('all');
              resetZoom();
            }}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Main SVG Visualization Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[540px] mt-3.5 rounded-2xl bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 dark:from-[#051838] dark:via-[#061F4A] dark:to-[#041530] border border-slate-200/80 dark:border-blue-900/70 overflow-hidden select-none"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 800"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label="Interactive Africa and Global Partner Map"
        >
          {/* Definitions for Gradients and Markers */}
          <defs>
            {/* Network flight line gradient */}
            <linearGradient id="flightArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#8CE600" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.85" />
            </linearGradient>

            {/* Glowing pattern overlay */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0A3981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0A3981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle Global Radar Grid Lines */}
          <g opacity="0.06">
            <circle cx="400" cy="400" r="150" fill="none" stroke="#0A3981" strokeDasharray="3 3" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="#0A3981" strokeDasharray="4 4" />
            <circle cx="400" cy="400" r="380" fill="none" stroke="#0A3981" strokeDasharray="5 5" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="#0A3981" strokeDasharray="4 4" />
            <line x1="400" y1="0" x2="400" y2="800" stroke="#0A3981" strokeDasharray="4 4" />
          </g>

          {/* D3 Zoomable Group */}
          <g ref={gRef}>
            {/* Global Diaspora Hub Decorative Boundaries & Inset Cards with Mouseover Tooltips */}
            <g className="global-hubs-decor" opacity="0.95">
              {/* North America Inset Badge */}
              <g
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const usCount = countryPartnerStats['united states']?.count || 0;
                  const caCount = countryPartnerStats['canada']?.count || 0;
                  setHoveredCountry(null);
                  setHoveredRegionBox({
                    title: 'North America Hub',
                    subtitle: 'Diaspora & Cross-Border Trade',
                    count: usCount + caCount,
                    countries: ['United States', 'Canada'],
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setHoveredRegionBox((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                }}
                onMouseLeave={() => setHoveredRegionBox(null)}
              >
                <rect x="35" y="20" width="105" height="180" rx="14" fill="#0A3981" fillOpacity="0.06" stroke="#38BDF8" strokeOpacity="0.35" strokeDasharray="3 3" />
                <text x="88" y="38" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-400 dark:fill-blue-300 tracking-wider">
                  NORTH AMERICA HUB
                </text>
              </g>

              {/* Europe & UK Inset Badge */}
              <g
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const gbCount = countryPartnerStats['united kingdom']?.count || 0;
                  setHoveredCountry(null);
                  setHoveredRegionBox({
                    title: 'UK & Europe Hub',
                    subtitle: 'EMEA Accounting & Advisory',
                    count: gbCount,
                    countries: ['United Kingdom'],
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setHoveredRegionBox((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                }}
                onMouseLeave={() => setHoveredRegionBox(null)}
              >
                <rect x="635" y="15" width="95" height="75" rx="14" fill="#0A3981" fillOpacity="0.06" stroke="#38BDF8" strokeOpacity="0.35" strokeDasharray="3 3" />
                <text x="682" y="30" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-400 dark:fill-blue-300 tracking-wider">
                  UK / EUROPE
                </text>
              </g>

              {/* Middle East & Asia Inset Badge */}
              <g
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const aeCount = countryPartnerStats['united arab emirates']?.count || 0;
                  const inCount = countryPartnerStats['india']?.count || 0;
                  setHoveredCountry(null);
                  setHoveredRegionBox({
                    title: 'Gulf & South Asia Hub',
                    subtitle: 'GCC & Tech Implementation Corridor',
                    count: aeCount + inCount,
                    countries: ['United Arab Emirates', 'India'],
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setHoveredRegionBox((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                }}
                onMouseLeave={() => setHoveredRegionBox(null)}
              >
                <rect x="615" y="160" width="160" height="130" rx="14" fill="#0A3981" fillOpacity="0.06" stroke="#38BDF8" strokeOpacity="0.35" strokeDasharray="3 3" />
                <text x="695" y="176" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-400 dark:fill-blue-300 tracking-wider">
                  GULF & SOUTH ASIA
                </text>
              </g>

              {/* Oceania / Australia Inset Badge */}
              <g
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const auCount = countryPartnerStats['australia']?.count || 0;
                  setHoveredCountry(null);
                  setHoveredRegionBox({
                    title: 'Asia Pacific Hub',
                    subtitle: 'APAC Cloud ERP Advisory',
                    count: auCount,
                    countries: ['Australia'],
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setHoveredRegionBox((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                }}
                onMouseLeave={() => setHoveredRegionBox(null)}
              >
                <rect x="685" y="495" width="100" height="95" rx="14" fill="#0A3981" fillOpacity="0.06" stroke="#38BDF8" strokeOpacity="0.35" strokeDasharray="3 3" />
                <text x="735" y="512" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-400 dark:fill-blue-300 tracking-wider">
                  ASIA PACIFIC
                </text>
              </g>
            </g>

            {/* Global Intercontinental Network Flight & Sync Arcs */}
            {showFlightArcs && (
              <g className="network-flight-arcs pointer-events-none">
                {GLOBAL_NETWORK_ARCS.map((arc) => {
                  const d = `M ${arc.sourceCoord[0]} ${arc.sourceCoord[1]} Q ${arc.controlPoint[0]} ${arc.controlPoint[1]} ${arc.targetCoord[0]} ${arc.targetCoord[1]}`;
                  return (
                    <g key={arc.id}>
                      {/* Background arc glow */}
                      <path
                        d={d}
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="1.2"
                        opacity="0.3"
                      />
                      {/* Animated dashed flight line */}
                      <path
                        d={d}
                        fill="none"
                        stroke="url(#flightArcGradient)"
                        strokeWidth="2"
                        className="flight-arc-path"
                        opacity="0.75"
                      />
                      {/* Animated pulse dot travelling along route */}
                      <circle r="3" fill="#8CE600">
                        <animateMotion
                          path={d}
                          dur="3.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>
            )}

            {/* All Country & Global Territory Paths */}
            {AFRICA_MAP_PATHS.map((country) => {
              const stats = countryPartnerStats[country.name.toLowerCase()];
              const count = stats?.count || 0;
              const isSelected = selectedCountry.toLowerCase() === country.name.toLowerCase();
              const isHovered = hoveredCountry?.country.code === country.code;
              const isGlobalHub = country.region === 'Global';

              // Dynamic color based on partner concentration
              let fillColor = '#cbd5e135';
              if (count > 0) {
                if (count >= 3) fillColor = '#0A3981';
                else if (count === 2) fillColor = '#0284C7';
                else fillColor = '#0ea5e9';
              }

              if (isGlobalHub && count > 0) {
                fillColor = '#072457';
              }

              return (
                <path
                  key={country.code}
                  d={country.path}
                  fill={isSelected ? '#8CE600' : isHovered ? '#38BDF8' : fillColor}
                  stroke={isSelected ? '#061F4A' : isHovered ? '#FFFFFF' : isGlobalHub ? '#38BDF8' : '#ffffff80'}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : isGlobalHub ? 1.8 : 1.2}
                  strokeDasharray={isGlobalHub && count === 0 ? '3 3' : undefined}
                  className="transition-colors duration-150 cursor-pointer"
                  onClick={() => handleCountryClick(country)}
                  onMouseEnter={(e) => handleShowCountryTooltip(country, e.clientX, e.clientY)}
                  onMouseMove={(e) => handleShowCountryTooltip(country, e.clientX, e.clientY)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
              );
            })}

            {/* Hub Pins & Density Badges for Registered Countries */}
            {AFRICA_MAP_PATHS.filter((c) => (countryPartnerStats[c.name.toLowerCase()]?.count || 0) > 0).map((c) => {
              const count = countryPartnerStats[c.name.toLowerCase()]?.count || 0;
              const isSelected = selectedCountry.toLowerCase() === c.name.toLowerCase();
              const isGlobal = c.region === 'Global';

              return (
                <g 
                  key={`pin-${c.code}`} 
                  transform={`translate(${c.center[0]}, ${c.center[1]})`} 
                  className="cursor-pointer"
                  onClick={() => handleCountryClick(c)}
                  onMouseEnter={(e) => handleShowCountryTooltip(c, e.clientX, e.clientY)}
                  onMouseMove={(e) => handleShowCountryTooltip(c, e.clientX, e.clientY)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {/* Ping Animation Ring for High Concentration Hubs */}
                  {count >= 2 && (
                    <circle
                      r="14"
                      fill={isGlobal ? '#38BDF8' : '#8CE600'}
                      opacity="0.3"
                      className="animate-ping pointer-events-none"
                    />
                  )}

                  {/* Pin Circle Dot */}
                  <circle
                    r={isSelected ? 8 : 6}
                    fill={isSelected ? '#061F4A' : isGlobal ? '#0284C7' : '#8CE600'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="shadow-md"
                  />

                  {/* Label Text */}
                  <text
                    y="-10"
                    textAnchor="middle"
                    className={`text-[10px] font-black tracking-wide fill-slate-900 dark:fill-white font-sans select-none ${
                      isSelected ? 'font-extrabold fill-[#8CE600]' : ''
                    }`}
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                  >
                    {c.flag} {c.name} ({count})
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Custom Mouseover Tooltip: Country + Region Partner Density */}
        {hoveredCountry && (
          <div
            role="tooltip"
            className="absolute z-40 pointer-events-none bg-slate-900/95 dark:bg-[#041535]/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 dark:border-blue-600/80 backdrop-blur-md w-64 transition-transform duration-75 text-xs"
            style={{
              left: `${Math.min(Math.max(10, hoveredCountry.x + 16), (containerRef.current?.clientWidth || 500) - 270)}px`,
              top: `${Math.min(Math.max(10, hoveredCountry.y - 52), (containerRef.current?.clientHeight || 400) - 180)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-extrabold text-sm flex items-center gap-1.5">
                <span className="text-base select-none">{hoveredCountry.country.flag}</span>
                <span>{hoveredCountry.country.name}</span>
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                  hoveredCountry.count > 0
                    ? 'bg-emerald-500/20 text-[#8CE600] border border-emerald-500/40'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {hoveredCountry.count} {hoveredCountry.count === 1 ? 'Partner' : 'Partners'}
              </span>
            </div>

            {/* Regional Summary Row */}
            <div className="mb-2 px-2.5 py-1.5 rounded-xl bg-blue-950/90 border border-blue-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-sky-300 font-bold uppercase tracking-wider">
                <Compass className="w-3 h-3 text-[#8CE600] shrink-0" />
                <span>{hoveredCountry.regionLabel} Region</span>
              </div>
              <span className="text-[11px] font-black text-white font-mono">
                {hoveredCountry.regionPartnerCount} {hoveredCountry.regionPartnerCount === 1 ? 'Partner' : 'Partners'}
              </span>
            </div>

            {hoveredCountry.count > 0 ? (
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-200 font-medium leading-snug">
                  {hoveredCountry.partnerNames.slice(0, 2).join(' · ')}
                  {hoveredCountry.partnerNames.length > 2 ? ` +${hoveredCountry.partnerNames.length - 2} more` : ''}
                </div>
                {hoveredCountry.services.length > 0 && (
                  <div className="text-[10px] text-sky-300 truncate">
                    Specialisms: {hoveredCountry.services.join(', ')}
                  </div>
                )}
                <div className="text-[10px] text-[#8CE600] font-bold pt-1.5 border-t border-slate-700/80 flex items-center justify-between">
                  <span>Click to filter directory</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-300 leading-relaxed">
                {hoveredCountry.regionPartnerCount > 0 ? (
                  <span>
                    Covered by <strong className="text-white">{hoveredCountry.regionPartnerCount}</strong> regional {hoveredCountry.regionLabel} partner{hoveredCountry.regionPartnerCount === 1 ? '' : 's'}. Click to explore or apply locally.
                  </span>
                ) : (
                  <span>
                    Pan-African coverage supported. Inquire to become the accredited founding partner in {hoveredCountry.country.name}.
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Mouseover Tooltip for Global Regional Hub Inset Boxes */}
        {!hoveredCountry && hoveredRegionBox && (
          <div
            role="tooltip"
            className="absolute z-40 pointer-events-none bg-slate-900/95 dark:bg-[#041535]/95 text-white p-3 rounded-2xl shadow-2xl border border-sky-500/50 backdrop-blur-md w-60 text-xs"
            style={{
              left: `${Math.min(Math.max(10, hoveredRegionBox.x + 16), (containerRef.current?.clientWidth || 500) - 255)}px`,
              top: `${Math.min(Math.max(10, hoveredRegionBox.y - 45), (containerRef.current?.clientHeight || 400) - 120)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-extrabold text-sm text-sky-300">{hoveredRegionBox.title}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#8CE600] border border-emerald-500/40 shrink-0">
                {hoveredRegionBox.count} {hoveredRegionBox.count === 1 ? 'Partner' : 'Partners'}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 mb-1.5">{hoveredRegionBox.subtitle}</div>
            <div className="text-[10px] text-slate-400 border-t border-slate-700/80 pt-1">
              Hubs: {hoveredRegionBox.countries.join(', ')}
            </div>
          </div>
        )}

        {/* Selected Country Interactive Detail Card Drawer */}
        {selectedCountry !== 'all' && isDetailCardOpen && (
          <div className="absolute top-3 right-3 z-30 w-[92%] sm:w-84 max-h-[92%] bg-white/95 dark:bg-[#072457]/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 dark:border-blue-700/80 shadow-2xl flex flex-col justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-blue-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-2xl select-none">
                    {selectedCountryObj?.flag || '🌍'}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {selectedCountry}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-blue-200">
                      {selectedCountryPartners.length} Certified {
                        selectedCountryPartners.length === 1 ? 'Firm' : 'Firms'
                      } Available
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => zoomToCountry(selectedCountry)}
                    title="Center & Zoom into country"
                    className="p-1.5 text-xs text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-900/60 hover:bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailCardOpen(false)}
                    title="Close Card"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Local Certified Partners List */}
              <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {selectedCountryPartners.length > 0 ? (
                  selectedCountryPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-700/60 text-xs space-y-1.5 transition-all duration-200 hover:border-[#8CE600]/80"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white leading-snug">
                            {partner.companyName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{partner.city}{partner.state ? `, ${partner.state}` : ''}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono bg-blue-100 dark:bg-blue-900 text-[#0A3981] dark:text-[#8CE600] shrink-0">
                          {partner.tier}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-blue-900/50">
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{partner.rating}</span>
                          <span className="text-slate-400 text-[10px]">({partner.reviewsCount})</span>
                        </span>

                        {onContactPartner && (
                          <button
                            type="button"
                            onClick={() => onContactPartner(partner)}
                            className="px-2 py-1 text-[10px] font-bold text-white bg-[#0A3981] dark:bg-blue-600 hover:bg-[#072c66] dark:hover:bg-blue-500 rounded-md transition-colors cursor-pointer"
                          >
                            Contact Firm
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 px-2 text-xs text-slate-500 dark:text-blue-200">
                    <p className="font-semibold">No registered partner in {selectedCountry} yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Inquire now to become the founding accredited partner in this country.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-blue-800/80 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={resetZoom}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectCountry('all')}
                className="text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#072457]/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-blue-900 shadow-md text-xs flex flex-col gap-1.5 max-w-[260px]">
          <span className="text-[10px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#0A3981] dark:text-[#8CE600]" />
            <span>Density & Hub Legend:</span>
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
            <span>0</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0ea5e9]" />
            <span>1</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0A3981]" />
            <span>2+</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#8CE600]" />
            <span>Selected</span>
          </div>
        </div>

        {/* Global Network HUD Badge in bottom right */}
        <div className="hidden sm:flex absolute bottom-3 right-3 bg-white/90 dark:bg-[#072457]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-blue-900 shadow-md text-xs items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-white">
              {totalActiveHubs} Global Hubs Active
            </span>
          </div>
          <span className="text-slate-300 dark:text-blue-800">|</span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-blue-300">
            {partners.length} Certified Partners
          </span>
        </div>
      </div>

      {/* Quick-Tap Verified Partner Country Chips */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-blue-900/60">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-blue-300 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#0A3981] dark:text-[#8CE600]" />
            Active Partner Hubs (Tap to Filter & Zoom):
          </span>
          {selectedCountry !== 'all' && (
            <button
              onClick={() => {
                onSelectCountry('all');
                resetZoom();
              }}
              className="text-[#0A3981] dark:text-[#8CE600] lowercase font-normal underline cursor-pointer"
            >
              Reset to all hubs
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              onSelectCountry('all');
              resetZoom();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCountry === 'all'
                ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] shadow-xs'
                : 'bg-white dark:bg-[#061F4A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/80 hover:bg-slate-100'
            }`}
          >
            🌍 All Hubs ({partners.length})
          </button>

          {activePartnerCountries.map((c) => {
            const isSelected = selectedCountry.toLowerCase() === c.name.toLowerCase();
            const count = countryPartnerStats[c.name.toLowerCase()]?.count || 0;

            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountryClick(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] shadow-xs ring-2 ring-[#0A3981]/20 dark:ring-[#8CE600]/30'
                    : 'bg-white dark:bg-[#061F4A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-blue-900/80 hover:border-blue-400'
                }`}
              >
                <span className="text-sm select-none">{c.flag}</span>
                <span>{c.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#061F4A]'
                      : 'bg-blue-50 dark:bg-blue-950 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {count}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

