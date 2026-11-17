import React, { useState, useMemo } from 'react';
import { CertifiedPartner } from '../types';
import { INITIAL_CERTIFIED_PARTNERS } from '../data/partnersData';
import { ALL_WORLD_COUNTRIES, findCountry, getStatesForCountry, WorldCountry } from '../data/worldCountriesAndStates';
import { OfficialPartnerBadge } from './OfficialPartnerBadge';
import { AfricaPartnerDensityMap } from './AfricaPartnerDensityMap';
import { Search, MapPin, ShieldCheck, Star, ExternalLink, Mail, Phone, Filter, LayoutGrid, List, CheckCircle, MessageSquare, MessageCircle, Globe, X, Sparkles, Building2, UserPlus, RefreshCw } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface PartnerDirectorySectionProps {
  onVerifyPartnerCode: (code: string) => void;
  onOpenApply?: () => void;
}

const PartnerDirectorySectionComponent: React.FC<PartnerDirectorySectionProps> = ({
  onVerifyPartnerCode,
  onOpenApply
}) => {
  const [partners, setPartners] = useState<CertifiedPartner[]>(INITIAL_CERTIFIED_PARTNERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals for partner details and contact
  const [activePartnerModal, setActivePartnerModal] = useState<CertifiedPartner | null>(null);
  const [contactPartnerModal, setContactPartnerModal] = useState<CertifiedPartner | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    businessType: '',
    message: ''
  });

  // Dynamic states for currently selected country
  const availableStates = useMemo(() => {
    if (selectedCountry === 'all') return [];
    return getStatesForCountry(selectedCountry);
  }, [selectedCountry]);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    setSelectedState('all'); // Always reset state when country changes
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedKeyword('');
    setSelectedCountry('all');
    setSelectedState('all');
    setSelectedTier('all');
    setVerifiedOnly(false);
  };

  const serviceKeywords = [
    { label: 'POS installation', term: 'pos' },
    { label: 'tax compliance', term: 'tax' },
    { label: 'cloud accounting setup', term: 'accounting' },
    { label: 'inventory integration', term: 'inventory' },
    { label: 'legacy migration', term: 'migration' },
    { label: 'staff training', term: 'training' },
    { label: 'hardware bundling', term: 'hardware' },
    { label: 'e-invoicing / e-fiscal', term: 'e-invoicing' }
  ];

  const popularCountries = [
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'Rwanda', flag: '🇷🇼' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Australia', flag: '🇦🇺' }
  ];

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const kw = selectedKeyword.toLowerCase().trim();

      // General query match
      const matchesSearch =
        !q ||
        p.companyName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.state && p.state.toLowerCase().includes(q)) ||
        p.country.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q)) ||
        p.industrySpecialisation.some(i => i.toLowerCase().includes(q));

      // Specific Service Description Keyword Matching
      const matchesKeyword =
        !kw ||
        p.services.some(s => s.toLowerCase().includes(kw)) ||
        p.summary.toLowerCase().includes(kw) ||
        (p.certifications && p.certifications.some(c => c.title.toLowerCase().includes(kw)));

      const matchesCountry = selectedCountry === 'all' || p.country.toLowerCase() === selectedCountry.toLowerCase();

      const matchesState =
        selectedState === 'all' ||
        (p.state && p.state.toLowerCase() === selectedState.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(selectedState.toLowerCase()));

      const matchesTier = selectedTier === 'all' || p.tier === selectedTier;
      const matchesVerified = !verifiedOnly || p.isVerified;

      return matchesSearch && matchesKeyword && matchesCountry && matchesState && matchesTier && matchesVerified;
    });
  }, [partners, searchQuery, selectedKeyword, selectedCountry, selectedState, selectedTier, verifiedOnly]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactPartnerModal(null);
      setContactFormData({ clientName: '', clientEmail: '', clientPhone: '', businessType: '', message: '' });
    }, 2000);
  };

  return (
    <section id="directory" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            Pan-African Certified Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Find the Right MsmeBooks Partner for Your Business
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            Connect with verified accountants, POS technicians, and ERP consultants who can configure MsmeBooks, migrate your records, train your staff, and provide local ongoing support.
          </p>
        </div>

        {/* Interactive Pan-African Partner Density Map (D3 Choropleth) */}
        <AfricaPartnerDensityMap
          partners={partners}
          selectedCountry={selectedCountry}
          onSelectCountry={handleCountryChange}
          onContactPartner={(p) => setContactPartnerModal(p)}
        />

        {/* Directory Controls Bar */}
        <div className="bg-slate-50 dark:bg-[#0A2552] border border-slate-200 dark:border-blue-800/60 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            {/* 1. Country of the World Selector */}
            <div className="md:col-span-4 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-300 mb-1">
                Country (Worldwide)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer"
                >
                  <option value="all">🌍 All Countries of the World ({ALL_WORLD_COUNTRIES.length})</option>
                  
                  <optgroup label="🌍 Pan-African Hubs">
                    {ALL_WORLD_COUNTRIES.filter(c => c.region === 'Pan-Africa').map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.states.length} states/regions)
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="🌐 Global Anchor Markets">
                    {ALL_WORLD_COUNTRIES.filter(c => c.region !== 'Pan-Africa' && ['US', 'GB', 'IN', 'AE', 'CA', 'AU', 'DE', 'FR', 'SG', 'SA'].includes(c.code)).map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.states.length} states/provinces)
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="🌐 All 240+ Countries of the World (A to Z)">
                    {ALL_WORLD_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* 2. Respective State / Province Selector (Dynamically populated based on chosen Country) */}
            <div className="md:col-span-4 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-300 mb-1">
                State / Province / Region
              </label>
              <div className="relative">
                <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  selectedCountry === 'all' ? 'text-slate-300 dark:text-slate-600' : 'text-[#0A3981] dark:text-[#8CE600]'
                }`} />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={selectedCountry === 'all'}
                  className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] ${
                    selectedCountry === 'all' ? 'opacity-60 cursor-not-allowed text-slate-400' : 'cursor-pointer font-medium'
                  }`}
                >
                  {selectedCountry === 'all' ? (
                    <option value="all">📍 Select country first to choose state</option>
                  ) : (
                    <>
                      <option value="all">📍 All States in {selectedCountry} ({availableStates.length} available)</option>
                      {availableStates.map((st) => {
                        const countInState = partners.filter(p =>
                          p.country.toLowerCase() === selectedCountry.toLowerCase() &&
                          ((p.state && p.state.toLowerCase() === st.toLowerCase()) || p.city.toLowerCase().includes(st.toLowerCase()))
                        ).length;

                        return (
                          <option key={st} value={st}>
                            {st} {countInState > 0 ? `(${countInState} partner${countInState > 1 ? 's' : ''})` : ''}
                          </option>
                        );
                      })}
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* 3. Tier & View Mode */}
            <div className="md:col-span-4 flex items-center gap-2">
              <div className="flex-1">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs sm:text-sm bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer"
                >
                  <option value="all">All Tiers</option>
                  <option value="bronze">Bronze (15%)</option>
                  <option value="silver">Silver (20%)</option>
                  <option value="gold">Gold (30%)</option>
                  <option value="platinum">Platinum (40%)</option>
                </select>
              </div>

              {/* Grid vs List View Mode Toggle */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#0A3981] dark:bg-blue-600 text-white border-[#0A3981] dark:border-blue-600'
                      : 'bg-white dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-blue-800 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0A3981] dark:bg-blue-600 text-white border-[#0A3981] dark:border-blue-600'
                      : 'bg-white dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-blue-800 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Popular Country Filter Chips */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-blue-900/60">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#8CE600]" />
                Popular:
              </span>
              <button
                type="button"
                onClick={() => handleCountryChange('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCountry === 'all'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] font-bold shadow-xs'
                    : 'bg-white dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-blue-900/70 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                }`}
              >
                🌍 All Countries
              </button>
              {popularCountries.map((c) => {
                const isSelected = selectedCountry.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleCountryChange(c.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] font-bold shadow-xs'
                        : 'bg-white dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-blue-900/70 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Description Keyword Matching Filter Row */}
          <div className="pt-2.5 border-t border-slate-200/70 dark:border-blue-900/60">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#0A3981] dark:text-[#8CE600]" />
                Keyword Matching:
              </span>
              {serviceKeywords.map((kw) => {
                const isSelected = selectedKeyword.toLowerCase() === kw.term.toLowerCase();
                const count = partners.filter(p => 
                  p.services.some(s => s.toLowerCase().includes(kw.term)) ||
                  p.summary.toLowerCase().includes(kw.term)
                ).length;
                return (
                  <button
                    key={kw.label}
                    type="button"
                    onClick={() => setSelectedKeyword(isSelected ? '' : kw.term)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] font-bold shadow-xs'
                        : 'bg-white dark:bg-[#061F4A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/70 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                    title={`Filter partners matching phrase "${kw.label}"`}
                  >
                    <span>{kw.label}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      isSelected 
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#061F4A]' 
                        : 'bg-slate-100 dark:bg-blue-900/60 text-slate-500 dark:text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
              {selectedKeyword && (
                <button
                  type="button"
                  onClick={() => setSelectedKeyword('')}
                  className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline px-2 cursor-pointer shrink-0"
                >
                  Clear Keyword
                </button>
              )}
            </div>
          </div>

          {/* Quick Sub-filters & Active Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-[#0A3981] focus:ring-[#0A3981]"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Verified Credentials Only</span>
              </label>

              {/* Active Filter Badges */}
              {selectedKeyword && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600] px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
                  <span>Keyword: &ldquo;{selectedKeyword}&rdquo;</span>
                  <button onClick={() => setSelectedKeyword('')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCountry !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950 text-[#0A3981] dark:text-[#8CE600] px-2.5 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                  <span>{findCountry(selectedCountry)?.flag} {selectedCountry}</span>
                  <button onClick={() => handleCountryChange('all')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedState !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950 text-[#0A3981] dark:text-[#8CE600] px-2.5 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                  <span>State: {selectedState}</span>
                  <button onClick={() => setSelectedState('all')} className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(selectedCountry !== 'all' || selectedState !== 'all' || selectedTier !== 'all' || selectedKeyword || verifiedOnly || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 ml-1 cursor-pointer font-semibold"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Filters
                </button>
              )}
            </div>

            <div className="font-medium text-xs">
              Showing <span className="font-bold text-[#0A3981] dark:text-[#8CE600]">{filteredPartners.length}</span> certified practices
              {selectedCountry !== 'all' && (
                <span> in <strong className="text-slate-900 dark:text-white">{selectedCountry}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Dedicated Real-Time Firm Search Bar Above Directory Grid */}
        <div className="mb-8">
          <div className="relative bg-white dark:bg-[#0A2552] border-2 border-slate-200 dark:border-blue-700/70 focus-within:border-[#0A3981] dark:focus-within:border-[#8CE600] rounded-2xl shadow-sm transition-colors p-1.5 sm:p-2 flex items-center gap-2">
            <div className="pl-2.5 text-[#0A3981] dark:text-[#8CE600] shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <label htmlFor="directory-firm-search" className="sr-only">
              Search firm cards by company name, city, or service tags
            </label>
            <input
              id="directory-firm-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search firms in real-time by company name, city, or service tag (e.g. Lagos, Cloud Accounting, POS)..."
              className="w-full py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/90 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] whitespace-nowrap shrink-0">
              <span>{filteredPartners.length}</span>
              <span className="font-semibold text-slate-600 dark:text-blue-200">
                {filteredPartners.length === 1 ? 'Firm' : 'Firms'}
              </span>
            </div>
          </div>
        </div>

        {/* Directory Results (Grid View) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className={`bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-700/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between relative group ${
                  partner.isVerified
                    ? 'dark:border-blue-600/70 dark:shadow-[0_0_18px_rgba(10,57,129,0.35)] dark:hover:border-[#8CE600]/80 dark:hover:shadow-[0_0_26px_rgba(140,230,0,0.22)]'
                    : 'dark:border-blue-800/60 dark:hover:border-blue-500'
                }`}
              >
                <div>
                  {/* Top Header: Badge, Code & Verification */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A3981] to-[#1E40AF] dark:from-blue-600 dark:to-blue-800 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                        {partner.companyName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                            {partner.companyName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-blue-200 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-blue-300 shrink-0" />
                          <span className="truncate">
                            {findCountry(partner.country)?.flag || '🌍'} {partner.city}{partner.state ? `, ${partner.state}` : ''}, {partner.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Official Tier Badge Icon */}
                    <div className="shrink-0">
                      <OfficialPartnerBadge
                        tier={partner.tier}
                        size="sm"
                        showId={false}
                        interactive
                        onClick={() => onVerifyPartnerCode(partner.partnerCode)}
                      />
                    </div>
                  </div>

                  {/* Verification & Rating Row */}
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    {partner.isVerified && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-[#8CE600] font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700/60 dark:shadow-[0_0_8px_rgba(140,230,0,0.25)]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600]" />
                        Active Partner
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {partner.rating} ({partner.reviewsCount} reviews)
                    </span>
                    <span className="text-slate-400 dark:text-slate-400 font-mono text-[11px] ml-auto">
                      {partner.partnerCode}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-blue-100/75 line-clamp-3 mb-4 leading-relaxed">
                    {partner.summary}
                  </p>

                  {/* Services Tags */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-200 mb-1.5">
                      Expertise:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.services.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#072250] px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                      {partner.services.length > 3 && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 py-0.5">
                          +{partner.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Industries */}
                  <div className="mb-14">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-200 mb-1">
                      Focus:
                    </div>
                    <div className="text-xs text-slate-600 dark:text-blue-100/70">
                      {partner.industrySpecialisation.join(' · ')}
                    </div>
                  </div>
                </div>

                {/* Floating Direct WhatsApp Consult CTA */}
                <a
                  href={buildWhatsAppBookingUrl(partner)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Direct WhatsApp Consult with ${partner.companyName}`}
                  title={`Start pre-filled WhatsApp consult with ${partner.companyName}`}
                  className="absolute bottom-[74px] right-5 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white text-xs font-bold shadow-lg shadow-[#25D366]/30 border border-white/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Direct WhatsApp Consult</span>
                </a>

                {/* Bottom Card Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-blue-900/60 flex items-center gap-2">
                  <button
                    onClick={() => setActivePartnerModal(partner)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] bg-slate-100 dark:bg-blue-900/40 hover:bg-slate-200 dark:hover:bg-blue-800/50 rounded-lg transition-colors cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setContactPartnerModal(partner)}
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                  >
                    Contact Partner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Directory Results (List View) */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className={`bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-700/60 p-6 pb-16 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all duration-300 relative group ${
                  partner.isVerified
                    ? 'dark:border-blue-600/70 dark:shadow-[0_0_18px_rgba(10,57,129,0.35)] dark:hover:border-[#8CE600]/80 dark:hover:shadow-[0_0_26px_rgba(140,230,0,0.22)]'
                    : 'dark:border-blue-800/60 dark:hover:border-blue-500'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A3981] dark:bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg shrink-0">
                    {partner.companyName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{partner.companyName}</h3>
                      {partner.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />
                      )}
                      <span className="text-xs font-mono text-slate-400">({partner.partnerCode})</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-blue-200 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-blue-300 shrink-0" />
                        <span>{findCountry(partner.country)?.flag || '🌍'}</span>
                        <span>{partner.city}{partner.state ? `, ${partner.state}` : ''}, {partner.country}</span>
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{partner.category}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-blue-100/75 mt-2 max-w-2xl line-clamp-2">
                      {partner.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="hidden sm:block">
                    <OfficialPartnerBadge tier={partner.tier} size="sm" showId={false} />
                  </div>
                  <div className="flex flex-col gap-2 w-36">
                    <button
                      onClick={() => setActivePartnerModal(partner)}
                      className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-blue-900/40 hover:bg-slate-200 dark:hover:bg-blue-800/50 rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => setContactPartnerModal(partner)}
                      className="w-full py-2 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                    >
                      Contact
                    </button>
                  </div>
                </div>

                {/* Floating Direct WhatsApp Consult CTA */}
                <a
                  href={buildWhatsAppBookingUrl(partner)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Direct WhatsApp Consult with ${partner.companyName}`}
                  title={`Start pre-filled WhatsApp consult with ${partner.companyName}`}
                  className="absolute bottom-3.5 right-6 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white text-xs font-bold shadow-lg shadow-[#25D366]/30 border border-white/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Direct WhatsApp Consult</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State with Territory Expansion & Apply CTA */}
        {filteredPartners.length === 0 && (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-[#0A2552] rounded-3xl border border-dashed border-slate-300 dark:border-blue-800 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No certified partners found in {selectedState !== 'all' ? `${selectedState}, ` : ''}{selectedCountry !== 'all' ? selectedCountry : 'this region'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 max-w-md mx-auto mb-6 leading-relaxed">
              MsmeBooks is actively accrediting practice firms across {selectedCountry !== 'all' ? selectedCountry : 'global territories'}. Verified partners receive direct client routing, 15%–40% lifetime recurring commissions, and listing in our official international registry.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {onOpenApply && (
                <button
                  type="button"
                  onClick={onOpenApply}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#8CE600]" />
                  <span>Apply to Become Partner in {selectedCountry !== 'all' ? selectedCountry : 'this Territory'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#061F4A] hover:bg-slate-100 dark:hover:bg-blue-900/40 border border-slate-300 dark:border-blue-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Location Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Partner Profile Modal */}
      {activePartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#072457] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-blue-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActivePartnerModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0A3981] dark:bg-blue-600 text-white font-extrabold flex items-center justify-center text-xl shrink-0">
                {activePartnerModal.companyName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0A3981] dark:text-white">
                  {activePartnerModal.companyName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-blue-200 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">
                    {findCountry(activePartnerModal.country)?.flag || '🌍'} {activePartnerModal.city}{activePartnerModal.state ? `, ${activePartnerModal.state}` : ''}, {activePartnerModal.country}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">{activePartnerModal.partnerCode}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-[#061F4A] p-4 rounded-xl mb-6 text-center border border-slate-200 dark:border-blue-900">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-blue-200">Membership Tier</div>
                <div className="text-sm font-bold text-[#0A3981] dark:text-[#8CE600] uppercase tracking-wide">
                  {activePartnerModal.tier} Partner
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-blue-200">Verified Since</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {activePartnerModal.certifiedSince}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-blue-200">Customer Rating</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-300">
                  ★ {activePartnerModal.rating} / 5.0
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200 mb-1">Company Profile</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activePartnerModal.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200 mb-2">Accredited Certifications</h4>
                <div className="space-y-2">
                  {activePartnerModal.certifications.map((c, i) => (
                    <div key={i} className="p-3 bg-blue-50/60 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#0A3981] dark:text-[#8CE600]">{c.title}</div>
                        <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">ID: {c.certId}</div>
                      </div>
                      <div className="text-right text-slate-500 dark:text-blue-200 text-[11px]">
                        Valid thru {c.expiryDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200 mb-1.5">Offered Services</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activePartnerModal.services.map((s, i) => (
                    <span key={i} className="text-xs bg-slate-100 dark:bg-blue-900/50 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppBookingUrl(activePartnerModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>Direct WhatsApp Consult</span>
              </a>
              <button
                onClick={() => {
                  const p = activePartnerModal;
                  setActivePartnerModal(null);
                  setContactPartnerModal(p);
                }}
                className="flex-1 py-3 text-xs sm:text-sm font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow transition-colors cursor-pointer"
              >
                Request Consultation
              </button>
              <button
                onClick={() => {
                  onVerifyPartnerCode(activePartnerModal.partnerCode);
                  setActivePartnerModal(null);
                }}
                className="flex-1 py-3 text-xs sm:text-sm font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-800/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors cursor-pointer"
              >
                Verify Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Partner / Request Consultation Modal */}
      {contactPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#072457] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-blue-800 relative">
            <button
              onClick={() => setContactPartnerModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg"
            >
              ✕
            </button>

            {contactSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-[#8CE600] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Consultation Request Dispatched!</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80">
                  Your inquiry has been routed directly to <strong className="text-[#0A3981] dark:text-[#8CE600]">{contactPartnerModal.companyName}</strong>. A certified partner representative will reach out within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200">
                    Direct Partner Inquiry
                  </span>
                  <h3 className="text-xl font-black text-[#0A3981] dark:text-white">
                    Contact {contactPartnerModal.companyName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-blue-100/75 mt-1 flex items-center gap-1.5">
                    <span>{findCountry(contactPartnerModal.country)?.flag || '🌍'}</span>
                    <span>{contactPartnerModal.city}{contactPartnerModal.state ? `, ${contactPartnerModal.state}` : ''}, {contactPartnerModal.country}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-500 font-semibold">{contactPartnerModal.partnerCode}</span>
                  </p>
                </div>

                <div className="space-y-3.5 mb-6 text-xs sm:text-sm">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Your Full Name / Business</label>
                    <input
                      type="text"
                      required
                      value={contactFormData.clientName}
                      onChange={(e) => setContactFormData({ ...contactFormData, clientName: e.target.value })}
                      placeholder="e.g. Samuel Okafor (Apex Grocers)"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactFormData.clientEmail}
                        onChange={(e) => setContactFormData({ ...contactFormData, clientEmail: e.target.value })}
                        placeholder="samuel@example.com"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={contactFormData.clientPhone}
                        onChange={(e) => setContactFormData({ ...contactFormData, clientPhone: e.target.value })}
                        placeholder="+234 800 000 0000"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Project Requirements</label>
                    <textarea
                      rows={3}
                      required
                      value={contactFormData.message}
                      onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                      placeholder="Describe your current accounting, POS, or inventory requirements..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setContactPartnerModal(null)}
                    className="flex-1 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-blue-900/40 hover:bg-slate-200 dark:hover:bg-blue-800/50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow"
                  >
                    Send Consultation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export const PartnerDirectorySection = React.memo(PartnerDirectorySectionComponent);

