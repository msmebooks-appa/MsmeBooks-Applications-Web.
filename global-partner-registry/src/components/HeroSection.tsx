import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Briefcase,
  Star,
  Award,
  LocateFixed,
  Loader2,
  X,
} from 'lucide-react';
import { COUNTRIES_LIST, INDUSTRIES_LIST, getCitiesForCountry } from '../data/partnersData';
import trustedPartnerHeroImg from '../assets/images/trusted_partner_hero_1793726182714.jpg';
import { useGeolocationFilter } from '../hooks/useGeolocationFilter';

interface HeroSectionProps {
  onSearchSubmit: (searchParams: {
    query: string;
    country: string;
    city: string;
    industry: string;
  }) => void;
  onOpenSmartMatch: () => void;
  activeCountry?: string;
  activeCity?: string;
  onLocateNearMe?: (country: string, city: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchSubmit,
  onOpenSmartMatch,
  activeCountry,
  activeCity,
  onLocateNearMe,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(activeCountry || '');
  const [city, setCity] = useState(activeCity || '');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const {
    isLocating,
    geoError,
    timezoneFallback,
    locateNearMe,
    setGeoError,
  } = useGeolocationFilter();

  useEffect(() => {
    if (activeCountry !== undefined) {
      setSelectedCountry(activeCountry);
    }
  }, [activeCountry]);

  useEffect(() => {
    if (activeCity !== undefined) {
      setCity(activeCity);
    }
  }, [activeCity]);

  const availableCities = getCitiesForCountry(selectedCountry);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    const validCities = getCitiesForCountry(newCountry);
    if (city && !validCities.includes(city)) {
      setCity('');
    }
  };

  const applyLocationToFilters = (countryName: string, cityName: string) => {
    setSelectedCountry(countryName);
    setCity(cityName);
    if (onLocateNearMe) {
      onLocateNearMe(countryName, cityName);
    } else {
      onSearchSubmit({
        query,
        country: countryName,
        city: cityName,
        industry: selectedIndustry,
      });
    }
  };

  const handleFindNearMeClick = () => {
    locateNearMe((result) => {
      applyLocationToFilters(result.country, result.city);
    });
  };

  const smartSuggestions = [
    { label: 'Accountant Lagos', desc: 'Accounting & tax firms in Lagos, Nigeria', country: 'Nigeria', city: 'Lagos', query: 'Accountant' },
    { label: 'POS installation Abuja', desc: 'POS agents & hardware setups in Abuja', country: 'Nigeria', city: 'Abuja', query: 'POS' },
    { label: 'inventory retail Ghana', desc: 'Inventory & supermarket experts in Ghana', country: 'Ghana', city: 'Accra', query: 'Inventory' },
    { label: 'M-Pesa Hospitality Kenya', desc: 'Restaurant & hospitality integrators in Nairobi', country: 'Kenya', city: 'Nairobi', query: 'Hospitality' },
    { label: 'Multi-Branch Wholesale SA', desc: 'Enterprise ERP advisors in Johannesburg', country: 'South Africa', city: 'Johannesburg', query: 'Multi-Branch' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      query,
      country: selectedCountry,
      city,
      industry: selectedIndustry,
    });
  };

  const applySuggestion = (sug: typeof smartSuggestions[0]) => {
    setQuery(sug.query);
    setSelectedCountry(sug.country);
    setCity(sug.city);
    setSuggestionsOpen(false);
    onSearchSubmit({
      query: sug.query,
      country: sug.country,
      city: sug.city,
      industry: selectedIndustry,
    });
  };

  return (
    <section id="hero" className="relative bg-slate-50 dark:bg-[#07162c] text-slate-900 dark:text-white pt-12 pb-20 overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Background Decorative Tech Grid & Subtle Glows */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Soft MsmeBooks Brand Blue & Lemon Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-lime-500/10 dark:bg-lime-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Headline & Partner Showcase Presentation */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Eyebrow, Headline & Value Proposition */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5">
              {/* Top Eyebrow Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-200 text-xs font-semibold backdrop-blur-sm shadow-inner">
                <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400"></span>
                <span>Official MsmeBooks Global Partner Registry</span>
                <span className="text-slate-400">•</span>
                <span className="text-lime-600 dark:text-lime-400 font-bold">500+ Verified Firms</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Find a Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-slate-800 to-lime-600 dark:from-blue-300 dark:via-white dark:to-lime-300">MsmeBooks Partner</span> Near You
              </h1>

              {/* Subheading / Value Copy */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                Connect with verified accountants, consultants, technology companies, POS agents, implementation specialists and business advisors who can help you get the most from MsmeBooks.
              </p>

              {/* Key Highlights Pill & Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 pt-1">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-lime-700 dark:text-lime-400 bg-lime-100/80 dark:bg-lime-950/40 px-3 py-1.5 rounded-xl border border-lime-300/80 dark:border-lime-500/20">
                  <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                  <span>100% Verified Credentials</span>
                </div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span>4.95/5 Client Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Right Column: Professional Partner Image Showcase beside the Headline */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div 
                id="hero-partner-image-card" 
                data-testid="hero-partner-image-card"
                className="relative w-full max-w-sm sm:max-w-md lg:max-w-none group"
              >
                {/* Decorative background glow & gradient ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-lime-500/30 via-sky-500/25 to-blue-600/30 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>

                {/* Main Card Container */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-700/80 shadow-2xl transition-transform duration-300 group-hover:-translate-y-1">
                  {/* Partner Portrait Image */}
                  <img
                    src={trustedPartnerHeroImg}
                    alt="Certified MsmeBooks Trusted Business Partner"
                    className="w-full h-72 sm:h-80 lg:h-88 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Gradient shadow overlay for badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none"></div>

                  {/* Floating Top Badge: Verified Certified Advisor */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-[#07162b]/95 backdrop-blur-md border border-lime-400/50 text-white text-xs font-bold shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                      </span>
                      <span className="text-lime-400">Verified Partner</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-amber-300 text-xs font-black shadow-lg">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>4.98</span>
                    </div>
                  </div>

                  {/* Bottom Partner Detail Card */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 dark:bg-[#07192f]/95 backdrop-blur-md border border-slate-700/80 text-white shadow-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-extrabold text-white">Elena Vance, CPA</h3>
                          <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium">Senior ERP & Cloud Accounting Advisor</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-lime-500/20 text-lime-300 border border-lime-500/30 text-[10px] font-black tracking-wider uppercase shrink-0">
                        Platinum
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>Ready in your region</span>
                      </div>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Available Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Large Modern Search Panel */}
        <div className="max-w-5xl mx-auto bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xl dark:shadow-2xl backdrop-blur-xl relative z-20 transition-all duration-300">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Search className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>What service or expertise do you need?</span>
            </div>
            
            {/* Quick Match and AI Chat Helper Links */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ask Partner AI</span>
              </button>

              <button
                type="button"
                onClick={onOpenSmartMatch}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-700 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-300 bg-lime-500/10 hover:bg-lime-500/20 px-3 py-1.5 rounded-lg border border-lime-500/30 transition-all"
              >
                <span>Smart Best Match</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            
            {/* Main Keyword Search Bar */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSuggestionsOpen(true)}
                  placeholder="Search partner, company, service or expertise (e.g. Accountant, POS, Inventory, Tax)..."
                  className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-transparent transition-all shadow-inner"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Box */}
              {suggestionsOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0c1e36] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2 px-1">
                    <span>Intelligent Search Suggestions</span>
                    <button 
                      type="button" 
                      onClick={() => setSuggestionsOpen(false)}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {smartSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applySuggestion(sug)}
                        className="flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <Search className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{sug.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{sug.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Country Select */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Country</span>
                </label>
                <select
                  id="hero-country-select"
                  data-testid="hero-country-select"
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
                >
                  <option value="">All Countries (All Africa & Global)</option>
                  <optgroup label="Africa — All 54 Sovereign Nations">
                    {COUNTRIES_LIST.filter(c => c.region === 'Africa').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.partnerCount} partners)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Europe">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Europe').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.partnerCount} partners)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Americas & Caribbean">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && (c.subRegion === 'North America' || c.subRegion === 'Latin America' || c.subRegion === 'Caribbean')).map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.partnerCount} partners)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Middle East">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Middle East').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.partnerCount} partners)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Asia & Pacific">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Asia-Pacific').map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.partnerCount} partners)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* City / Location Dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                    <span>City / Location</span>
                  </span>
                  {selectedCountry && (
                    <span className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold">
                      {availableCities.length} Cities
                    </span>
                  )}
                </label>
                <select
                  id="hero-city-select"
                  data-testid="hero-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
                >
                  <option value="">{selectedCountry ? `All Cities in ${selectedCountry}` : 'All Cities & Regions'}</option>
                  {availableCities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry Dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>Industry</span>
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
                >
                  <option value="">All Industries</option>
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind.id} value={ind.name}>
                      {ind.name} ({ind.count})
                    </option>
                  ))}
                  <option value="Other">Other Industry</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  100% Certified Partners
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Vetted Compliance & Integrity
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                {/* Geolocation 'Find partners near me' Button */}
                <button
                  type="button"
                  id="btn-hero-find-near-me"
                  data-testid="btn-hero-find-near-me"
                  onClick={handleFindNearMeClick}
                  disabled={isLocating}
                  className="w-full sm:w-auto px-4 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-lime-300 border border-slate-300 dark:border-lime-500/40 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                  title="Use your browser's current location coordinates to automatically set the country and city filter"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-lime-600 dark:text-lime-400" />
                  ) : (
                    <LocateFixed className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  )}
                  <span>{isLocating ? 'Detecting location...' : 'Find partners near me'}</span>
                </button>

                {/* Large Primary Lemon Green Search CTA */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-lime-500/25 hover:shadow-lime-500/35 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>Find a Partner</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

            {geoError && (
              <div
                id="hero-geolocation-error"
                data-testid="hero-geolocation-error"
                className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2"
              >
                <span>{geoError}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGeoError(null);
                      applyLocationToFilters(timezoneFallback.country, timezoneFallback.city);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 font-bold text-amber-900 dark:text-amber-200 transition-colors cursor-pointer"
                  >
                    Use {timezoneFallback.countryFlag} {timezoneFallback.city}, {timezoneFallback.country}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGeoError(null)}
                    className="p-1 text-amber-700 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white"
                    aria-label="Dismiss geolocation notice"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>

      </div>
    </section>
  );
};
