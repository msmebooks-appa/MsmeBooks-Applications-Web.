import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Globe, 
  Languages, 
  Briefcase, 
  Clock,
  Sparkles,
  Lock,
  DollarSign
} from 'lucide-react';
import { CurrencyCode, ProfessionalProfile } from '../types';
import { VERIFIED_PROFESSIONALS } from '../data/mockData';
import { formatPrice } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface ProfessionalMarketplaceProps {
  selectedCurrency: CurrencyCode;
  onBookConsultationWithPro: (pro: ProfessionalProfile, model?: 'hourly' | 'fixed') => void;
  onAssignProToPlan: (pro: ProfessionalProfile) => void;
}

export const ProfessionalMarketplace: React.FC<ProfessionalMarketplaceProps> = ({
  selectedCurrency,
  onBookConsultationWithPro,
  onAssignProToPlan,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [rateModelFilter, setRateModelFilter] = useState<'All' | 'hourly' | 'fixed'>('All');

  const filteredPros = VERIFIED_PROFESSIONALS.filter((pro) => {
    const matchesSearch = pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.credentials.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || pro.category === selectedCategory;
    const matchesCountry = selectedCountryFilter === 'All' || pro.country === selectedCountryFilter;
    
    let matchesRate = true;
    if (rateModelFilter === 'hourly') {
      matchesRate = pro.hourlyRateUSD <= 60; // Show affordable hourly specialists
    } else if (rateModelFilter === 'fixed') {
      matchesRate = !!pro.fixedRateUSD;
    }

    return matchesSearch && matchesCategory && matchesCountry && matchesRate;
  });

  return (
    <section id="marketplace" className="py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
            {t.marketplace.pill}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            {t.marketplace.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t.marketplace.subtitle}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.marketplace.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Rate Model Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:inline">Contract:</span>
              <select
                value={rateModelFilter}
                onChange={(e) => setRateModelFilter(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer"
              >
                <option value="All">All Rates (Hourly & Fixed)</option>
                <option value="hourly">Hourly Advisory Specialists</option>
                <option value="fixed">Fixed Monthly Retainers</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:inline">Specialty:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer"
              >
                <option value="All">{t.marketplace.allSpecialties}</option>
                <option value="Accounting">Accounting & Reporting</option>
                <option value="Payroll">Payroll Outsourcing</option>
                <option value="HR">HR & Talent Governance</option>
                <option value="Tax & Compliance">Tax & Regulatory</option>
                <option value="Virtual CFO">Virtual CFO</option>
              </select>
            </div>

            {/* Country Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:inline">Country:</span>
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer"
              >
                <option value="All">{t.marketplace.allRegions}</option>
                <option value="Nigeria">Nigeria 🇳🇬</option>
                <option value="Kenya">Kenya 🇰🇪</option>
                <option value="South Africa">South Africa 🇿🇦</option>
                <option value="Ghana">Ghana 🇬🇭</option>
                <option value="Rwanda">Rwanda 🇷🇼</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
              </select>
            </div>
          </div>

        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPros.map((pro) => (
            <div
              key={pro.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                
                {/* Header with Photo & Verification Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={pro.avatarUrl}
                        alt={pro.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-lime-500 dark:border-lime-400 shadow-xs"
                      />
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white font-grotesk">
                          {pro.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {pro.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating & Location Tag */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{pro.rating}</span>
                    <span className="text-[10px]">({pro.reviewCount} engagements)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[140px]">{pro.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {pro.bio}
                </p>

                {/* Credentials list */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Accredited Credentials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pro.credentials.map((cred, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dual Rates Comparison Display Box */}
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-lime-500 dark:text-lime-400" />
                      <span className="font-semibold">Hourly Advisory:</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {formatPrice(pro.hourlyRateUSD, selectedCurrency)}/hr
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Lock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span className="font-semibold">Fixed Retainer:</span>
                    </div>
                    <span className="font-bold text-lime-600 dark:text-lime-400 font-mono">
                      {formatPrice(pro.fixedRateUSD, selectedCurrency)}/mo
                    </span>
                  </div>
                </div>

                {/* Languages & Experience */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {pro.experienceYears} Years Exp.
                  </span>
                  <span className="flex items-center gap-1">
                    <Languages className="w-3 h-3 text-slate-400" />
                    {pro.languages.join(', ')}
                  </span>
                </div>

              </div>

              {/* Bottom Card Footer Actions: Book Hourly vs Book Fixed vs Assign Plan */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onBookConsultationWithPro(pro, 'hourly')}
                    className="py-2 px-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Clock className="w-3 h-3 text-lime-500 dark:text-lime-400" />
                    <span>Book Hourly</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookConsultationWithPro(pro, 'fixed')}
                    className="py-2 px-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800/80 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span>Fixed Scope</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onAssignProToPlan(pro)}
                  className="w-full py-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Assign to Ongoing Subscription Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
