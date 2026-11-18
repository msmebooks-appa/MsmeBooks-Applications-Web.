import React, { useState, useMemo } from 'react';
import {
  X,
  Globe,
  MapPin,
  Building2,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Users,
} from 'lucide-react';
import { PAN_AFRICAN_OPERATION_HUBS, PanAfricanHub } from '../data/panAfricanHubs';

interface PanAfricanHubsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreHubJobs?: (country: string) => void;
}

export const PanAfricanHubsModal: React.FC<PanAfricanHubsModalProps> = ({
  isOpen,
  onClose,
  onExploreHubJobs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'Central Africa', 'Cloud'];

  const filteredHubs = useMemo(() => {
    return PAN_AFRICAN_OPERATION_HUBS.filter((hub) => {
      if (selectedRegion !== 'All' && hub.region !== selectedRegion) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        hub.country.toLowerCase().includes(q) ||
        hub.capitalCity.toLowerCase().includes(q) ||
        hub.hubCities.some((c) => c.toLowerCase().includes(q)) ||
        hub.focusAreas.some((f) => f.toLowerCase().includes(q)) ||
        hub.economicCorridor.toLowerCase().includes(q) ||
        hub.currency.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hubs-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#131D35] rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#14243A] via-[#1B3050] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#B5E61D] shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5E61D]">
                  Pan-African Footprint
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white">
                  20+ Countries Pan-African Operations Hubs
                </span>
              </div>
              <h2
                id="hubs-modal-title"
                className="text-lg sm:text-2xl font-extrabold text-white leading-tight mt-0.5"
              >
                20+ Countries Pan-African Operations Hubs
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close hubs modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-[#0D1527] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs shrink-0 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <strong>24 Strategic Hubs</strong> across 20+ sovereign African nations
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <strong>650+</strong> Combined on-ground & cloud workforce
            </span>
          </div>

          <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
            Connecting commerce across West, East, Southern, Central & North Africa
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0 bg-white dark:bg-[#131D35]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hubs by country (e.g. Nigeria, Kenya, Rwanda), hub city, economic corridor, or specialism..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#0066CC] dark:focus:border-[#38BDF8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
            {regions.map((region) => {
              const count =
                region === 'All'
                  ? PAN_AFRICAN_OPERATION_HUBS.length
                  : PAN_AFRICAN_OPERATION_HUBS.filter((h) => h.region === region).length;
              const isTabActive = selectedRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isTabActive
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
                  }`}
                >
                  <span>{region}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      isTabActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hubs Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Displaying <strong className="text-slate-800 dark:text-slate-200">{filteredHubs.length}</strong> operational hubs in 20+ countries
            </span>
            <span className="hidden sm:inline">
              Multi-entity regulatory compliance & localized payment integrations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHubs.map((hub) => {
              const isCore = hub.status === 'Established Core Hub';
              const isHighGrowth = hub.status === 'High-Growth Hub';

              return (
                <div
                  key={hub.id}
                  className="bg-slate-50/70 dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#0066CC] dark:hover:border-[#38BDF8] hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Top Row: Flag, Country & Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl shrink-0" role="img" aria-label={hub.country}>
                          {hub.flag}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors leading-tight">
                            {hub.country}
                          </h4>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {hub.region}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          isCore
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : isHighGrowth
                            ? 'bg-blue-100 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {hub.status.split(' ')[0]}
                      </span>
                    </div>

                    {/* Operational Cities & Centers */}
                    <div className="mb-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Operations Centers</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hub.hubCities.map((city) => (
                          <span
                            key={city}
                            className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 px-2 py-0.5 bg-white dark:bg-[#1A284A] rounded-md border border-slate-200 dark:border-slate-700"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Specialisms */}
                    <div className="mb-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                        Hub Specializations
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hub.focusAreas.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] font-medium text-slate-600 dark:text-slate-400 px-1.5 py-0.2 bg-slate-200/60 dark:bg-slate-800 rounded"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Corridor / Currency Details */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mb-4 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span>Currency Rails:</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {hub.currency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Jurisdiction:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]" title={hub.regulatoryJurisdiction}>
                          {hub.regulatoryJurisdiction}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  {onExploreHubJobs && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onExploreHubJobs(hub.country);
                      }}
                      className="w-full mt-2 py-2 px-3 bg-white dark:bg-[#1A284A] hover:bg-[#0066CC] hover:text-white dark:hover:bg-[#38BDF8] dark:hover:text-slate-900 border border-slate-200 dark:border-slate-700 hover:border-transparent rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group-hover:bg-[#0066CC] group-hover:text-white dark:group-hover:bg-[#38BDF8] dark:group-hover:text-slate-900"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Explore Open Roles in {hub.country.split(' ')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D1527] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400">
            All 20+ operations hubs feature direct integrations with local banks, telecom carriers, and fiscal tax systems.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] text-white dark:text-slate-900 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
