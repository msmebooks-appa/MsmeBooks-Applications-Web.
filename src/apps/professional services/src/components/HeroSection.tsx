import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  MessageCircle, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Sparkles,
  Award,
  TrendingUp,
  Cpu,
  BadgeCheck
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onSearch: (query: string, category: string, mode: string) => void;
  onExploreClick: () => void;
  onFindFirmClick: () => void;
  onQuickBookClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExploreClick,
  onFindFirmClick,
  onQuickBookClick,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [consultationMode, setConsultationMode] = useState('All Modes');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory, consultationMode);
    const element = document.getElementById('services-catalogue');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FD] via-white to-white dark:from-[#07111D] dark:via-[#091728] dark:to-[#08121E] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100 dark:border-slate-800 transition-colors duration-250">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1464C8]/5 dark:bg-[#1464C8]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#B7E532]/15 dark:bg-[#B7E532]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Eyebrow, Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/80 text-[#1464C8] dark:text-[#B7E532] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1464C8] dark:bg-[#B7E532] animate-ping"></span>
              <span>{t('hero.eyebrow')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#102B4E] dark:text-white tracking-tight leading-[1.12]">
              {t('hero.title1')}{' '}
              <span className="relative inline-block text-[#1464C8] dark:text-[#388bfd]">
                {t('hero.titleExpertise')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#B7E532] -z-10" viewBox="0 0 200 8" fill="currentColor">
                  <path d="M0,5 Q50,0 100,5 T200,5" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              {t('hero.title2')}
            </h1>

            {/* Subtitle / Supporting description */}
            <p className="text-base sm:text-lg text-[#334155] dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t('hero.subtitle')}
            </p>

            {/* Three Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <span>{t('hero.ctaExplore')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onFindFirmClick}
                className="px-6 py-3.5 bg-white dark:bg-[#0E2036] hover:bg-slate-50 dark:hover:bg-[#132842] text-[#102B4E] dark:text-white font-bold text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-all hover:border-[#1464C8] dark:hover:border-[#1464C8] shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                <span>{t('hero.ctaFindFirm')}</span>
              </button>

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I would like to book a professional service consultation.")}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-extrabold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                <span>{t('hero.ctaWhatsapp')}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1464C8] flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">{t('hero.statSpecialists')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.statSpecialistsSub')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">{t('hero.statVerified')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.statVerifiedSub')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold text-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">{t('hero.statGuarantee')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.statGuaranteeSub')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">{t('hero.statSupport')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.statSupportSub')}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Premium African Business Photographic Composition with Floating UI Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=1000&q=80"
                  alt="African professional chartered accountant and business consultant in modern executive office"
                  className="w-full h-[440px] sm:h-[480px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102B4E]/85 via-[#102B4E]/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B7E532]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified African Professional Network
                  </div>
                  <p className="text-sm font-semibold text-white/90 mt-0.5">
                    Empowering African commerce with certified accountants, tax advisers & software engineers.
                  </p>
                </div>
              </div>

              {/* Floating UI Card 1: Bookkeeping Consultation */}
              <div className="absolute -top-4 -left-4 sm:-left-8 bg-white dark:bg-[#0E2036] p-3.5 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-[210px] animate-in fade-in slide-in-from-left duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#1464C8] dark:text-[#B7E532] flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#102B4E] dark:text-white">Bookkeeping</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Consultation Active</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 4.95 Rating
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">Monthly</span>
                </div>
              </div>

              {/* Floating UI Card 2: Tax Advisory Appointment */}
              <div className="absolute top-1/3 -right-4 sm:-right-6 bg-white dark:bg-[#0E2036] p-3.5 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-[220px] animate-in fade-in slide-in-from-right duration-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#B7E532] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#102B4E] dark:text-white">Tax Advisory</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">FIRS / GRA Compliant</div>
                  </div>
                </div>
                <div className="mt-2 pt-1 flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-300">
                  <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 font-bold rounded">Verified Firm</span>
                  <span>Appointment</span>
                </div>
              </div>

              {/* Floating UI Card 3: Software Implementation + WhatsApp */}
              <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-[#102B4E] dark:bg-[#08121E] text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/60 dark:border-slate-800 max-w-[240px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B7E532] animate-pulse"></span>
                    <span className="text-xs font-bold text-white">Software Setup</span>
                  </div>
                  <span className="text-[10px] bg-[#B7E532] text-[#102B4E] font-extrabold px-1.5 py-0.5 rounded">
                    MsmeBooks
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 dark:text-slate-400 mt-1.5">
                  Retail POS, Hotel PMS & Cloud migrations.
                </p>
                <div className="mt-2 pt-2 border-t border-slate-700 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-[#B7E532] font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp Deep Link
                  </span>
                  <span className="text-slate-300 dark:text-slate-400 font-medium">Book Online</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Prominent Search Component (Section 3 of Prompt) */}
        <div className="mt-12 lg:mt-16 bg-white dark:bg-[#0E2036] p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 relative z-20 transition-colors duration-250">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
              <h2 className="text-sm font-bold text-[#102B4E] dark:text-white uppercase tracking-wide">
                What service do you need?
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Search by service, category, keyword, professional firm, or location
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-sm bg-slate-50 dark:bg-[#08121E] border border-slate-200 dark:border-slate-700 text-[#102B4E] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:bg-white dark:focus:bg-[#0A1727] focus:outline-none focus:ring-2 focus:ring-[#1464C8] focus:border-transparent transition-all font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 text-sm bg-slate-50 dark:bg-[#08121E] border border-slate-200 dark:border-slate-700 text-[#102B4E] dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-[#0A1727] focus:outline-none focus:ring-2 focus:ring-[#1464C8] focus:border-transparent transition-all font-medium cursor-pointer"
              >
                <option value="All">{t('hero.allCategories')} ({SERVICE_CATEGORIES.length})</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Consultation Mode */}
            <div className="lg:col-span-2">
              <select
                value={consultationMode}
                onChange={(e) => setConsultationMode(e.target.value)}
                className="w-full px-3 py-3 text-sm bg-slate-50 dark:bg-[#08121E] border border-slate-200 dark:border-slate-700 text-[#102B4E] dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-[#0A1727] focus:outline-none focus:ring-2 focus:ring-[#1464C8] focus:border-transparent transition-all font-medium cursor-pointer"
              >
                <option value="All Modes">{t('hero.allModes')}</option>
                <option value="Online">Online / Virtual</option>
                <option value="On-site">On-site Business Visit</option>
                <option value="Hybrid">Hybrid Flexible</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t('hero.searchSubmit')}</span>
              </button>
            </div>

          </form>

          {/* Quick Filter Tags */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 dark:text-slate-500">Popular searches:</span>
            {[
              'Monthly Bookkeeping',
              'Supermarket POS Setup',
              'Corporate Tax / CIT',
              'QuickBooks Migration',
              'Hotel PMS',
              'Physical Stock Audit',
              'PAYE Payroll'
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  onSearch(tag, 'All', 'All Modes');
                  const element = document.getElementById('services-catalogue');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#B7E532]/20 dark:hover:bg-[#B7E532]/20 text-slate-600 dark:text-slate-300 hover:text-[#102B4E] dark:hover:text-[#B7E532] rounded-md font-medium transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
