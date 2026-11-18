import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Star,
  Users,
  ChevronRight
} from 'lucide-react';
import { Partner } from '../types';
import { PARTNERS_DATA, COUNTRIES_LIST } from '../data/partnersData';

interface SmartMatchSectionProps {
  onSelectPartner: (partner: Partner) => void;
  onContactPartner: (partner: Partner) => void;
}

export const SmartMatchSection: React.FC<SmartMatchSectionProps> = ({
  onSelectPartner,
  onContactPartner,
}) => {
  const [businessType, setBusinessType] = useState('Retail & Supermarket');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('');
  const [branchCount, setBranchCount] = useState('2 - 5 branches');
  
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Accounting',
    'POS',
    'Inventory',
    'Multi-Branch Setup'
  ]);

  const [matchedResults, setMatchedResults] = useState<Partner[] | null>(null);

  const availableNeeds = [
    'Accounting',
    'POS',
    'Inventory',
    'Payroll',
    'Business Setup',
    'Training',
    'Migration',
    'Tax Support',
    'E-commerce',
    'Multi-Branch Setup'
  ];

  const toggleNeed = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate scoring match
    const scored = PARTNERS_DATA.map(partner => {
      let score = 0;
      // Location match
      if (country && partner.country.toLowerCase() === country.toLowerCase()) score += 40;
      if (city && partner.city.toLowerCase().includes(city.toLowerCase())) score += 20;

      // Services overlap
      selectedNeeds.forEach(need => {
        if (partner.specialties.some(s => s.toLowerCase().includes(need.toLowerCase()))) score += 15;
        if (partner.services.some(s => s.toLowerCase().includes(need.toLowerCase()))) score += 15;
      });

      // Level boost
      if (partner.level === 'Platinum') score += 15;
      if (partner.level === 'Gold') score += 10;

      return { partner, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 3).map(s => s.partner);
    setMatchedResults(topMatches);
  };

  return (
    <section id="smart-match" className="py-16 bg-slate-50 dark:bg-[#07172e] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-700 dark:text-lime-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Partner Discovery Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Let MsmeBooks Help You Find the Right Partner
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Tell us about your business and we'll help you discover partners with relevant services, industry experience and location coverage.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors duration-300">
          <form onSubmit={handleMatchSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Question 1: Business Type */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>1. What type of business do you operate?</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option value="Retail & Supermarket">Retail & Supermarkets</option>
                  <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                  <option value="Restaurant & Hospitality">Restaurant & Hospitality</option>
                  <option value="Pharmacy & Healthcare">Pharmacy & Healthcare</option>
                  <option value="Manufacturing">Manufacturing & Processing</option>
                  <option value="Fashion & Boutiques">Fashion & Boutiques</option>
                  <option value="Electronics & Phones">Electronics & Phones</option>
                  <option value="Construction & Hardware">Construction & Hardware</option>
                  <option value="Professional Services">Professional Advisory / Agency</option>
                  <option value="Agriculture">Agribusiness & Farming</option>
                  <option value="E-commerce">Online & E-commerce Brand</option>
                  <option value="Other">Other Business Line</option>
                </select>
              </div>

              {/* Question 2: Location */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>2. Where is your business located?</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
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

                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Lagos, Nairobi)"
                    className="w-full px-2.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                </div>
              </div>

            </div>

            {/* Question 3: Branches */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <span>3. How many branches or warehouses do you have?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Single branch',
                  '2 - 5 branches',
                  '6 - 15 branches',
                  '15+ Enterprise branches'
                ].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setBranchCount(tier)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      branchCount === tier
                        ? 'bg-lime-500 text-slate-950 font-bold border-lime-400 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Checkboxes */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                4. What specific MsmeBooks areas do you need help with?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {availableNeeds.map((need) => {
                  const checked = selectedNeeds.includes(need);
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => toggleNeed(need)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                        checked
                          ? 'bg-lime-100 dark:bg-lime-500/15 border-lime-500 dark:border-lime-400 text-lime-900 dark:text-lime-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{need}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        checked ? 'bg-lime-500 text-slate-950' : 'border border-slate-400 dark:border-slate-600'
                      }`}>
                        {checked && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Matches based on verified experience in {country}, {branchCount}, and chosen requirements.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-lime-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Find My Partner</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

          </form>

          {/* Matched Results Preview Box */}
          {matchedResults && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
                    Recommended For You
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Verified Matches</h3>
                </div>
                <button
                  onClick={() => setMatchedResults(null)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Reset Results
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchedResults.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1e38] border border-lime-500/30 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-100 dark:bg-lime-500/20 text-lime-800 dark:text-lime-400 border border-lime-300 dark:border-lime-500/30">
                          {idx === 0 ? '98% Best Match' : idx === 1 ? '94% Match' : '90% Match'}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-white">
                          <Star className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                          <span>{p.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h4>
                      <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {p.countryFlag} {p.city}, {p.country}
                        </p>
                        {p.availabilityStatus === 'Accepting New Clients' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span>Accepting New Clients</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                            <span>Currently Booked</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {p.tagline}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.services.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => onSelectPartner(p)}
                        className="flex-1 py-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-lg text-center"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => onContactPartner(p)}
                        className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
