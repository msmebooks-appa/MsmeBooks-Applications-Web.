import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Quote, 
  Building2, 
  MapPin, 
  Film, 
  Sparkles, 
  Play, 
  SlidersHorizontal,
  Video,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TESTIMONIALS } from '../data/pricingData';
import { BUSINESS_CASE_STUDIES } from '../data/caseStudiesData';
import { Testimonial } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { VideoTestimonialPlayer } from './VideoTestimonialPlayer';
import { GenerateVideoModal } from './GenerateVideoModal';
import { VideoDetailModal } from './VideoDetailModal';
import { CaseStudiesCarousel } from './CaseStudiesCarousel';

interface CustomerTrustSectionProps {
  onOpenTrial?: (planId?: string) => void;
}

export const CustomerTrustSection: React.FC<CustomerTrustSectionProps> = ({ onOpenTrial }) => {
  const { t } = useLanguage();
  const { format } = useCurrency();

  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS);
  const [activeTab, setActiveTab] = useState<'video' | 'written'>('video');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [activeDetailTestimonial, setActiveDetailTestimonial] = useState<Testimonial | null>(null);

  const countries = ['All', 'Nigeria', 'Ghana', 'Kenya', 'South Africa'];

  const filteredTestimonials = testimonialsList.filter((item) => {
    if (selectedCountryFilter === 'All') return true;
    return item.country.toLowerCase().includes(selectedCountryFilter.toLowerCase());
  });

  const handleVideoGenerated = (newTestimonial: Testimonial) => {
    setTestimonialsList([newTestimonial, ...testimonialsList]);
    setSelectedCountryFilter('All');
    setActiveTab('video');
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white dark:bg-[#070F1B] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200/40 dark:border-blue-900/40">
            <Film className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>Verified Customer Case Studies & Video Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B192C] dark:text-white tracking-tight text-balance">
            Real African Entrepreneurs. Real Growth.
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Swipe through detailed scaling case studies and watch 10-second looping video vignettes from supermarket operators, pharmacies, fashion wholesalers, and agri-exporters across Africa.
          </p>
        </div>

        {/* Interactive Swipeable Case Studies Carousel */}
        <CaseStudiesCarousel
          caseStudies={BUSINESS_CASE_STUDIES}
          onStartTrial={onOpenTrial}
        />

        {/* View Mode & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-50 dark:bg-[#0B192C] p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Left: View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto shadow-xs">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-[#0A4FD5] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>10s Video Stories ({testimonialsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('written')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'written'
                  ? 'bg-[#0A4FD5] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Written Reviews</span>
            </button>
          </div>

          {/* Middle: Country Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountryFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedCountryFilter === c
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-[#0A4FD5] dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                {c === 'All' && 'All Africa 🌍'}
                {c === 'Nigeria' && 'Nigeria 🇳🇬'}
                {c === 'Ghana' && 'Ghana 🇬🇭'}
                {c === 'Kenya' && 'Kenya 🇰🇪'}
                {c === 'South Africa' && 'South Africa 🇿🇦'}
              </button>
            ))}
          </div>

          {/* Right: AI Video Generation Action */}
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A4FD5] via-blue-600 to-[#0A4FD5] hover:opacity-95 text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
            <span>Generate Custom Video Vignette</span>
          </button>
        </div>

        {/* Video Stories Mode */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((item, idx) => (
                <VideoTestimonialPlayer
                  key={item.name + idx}
                  testimonial={item}
                  onSelect={() => {}}
                  onOpenDetails={(t) => setActiveDetailTestimonial(t)}
                />
              ))}
            </div>

            {/* AI Video Capabilities Info Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-emerald-50/50 dark:from-blue-950/40 dark:via-[#0B192C] dark:to-emerald-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A4FD5]/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5 text-[#0A4FD5] dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>10-Second Looping Video Engine</span>
                    <span className="text-[10px] font-mono bg-[#84CC16]/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                      gemini-omni-1.2-flash
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Continuous 60fps looping video vignettes featuring verified African SME owners in shops, pharmacies, cold storage depots, and food bistros.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="shrink-0 text-xs font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Create Video for Your Business</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Written Reviews Mode */}
        {activeTab === 'written' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTestimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 dark:bg-[#0B192C] hover:bg-white dark:hover:bg-[#0D1E36] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Star rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#84CC16] text-[#84CC16]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                      {item.growthStat}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic relative">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {item.role}
                    </div>
                    <div className="text-[10px] font-bold text-[#0A4FD5] dark:text-blue-400 flex items-center gap-1 truncate mt-0.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span>{item.business}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{item.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pan-African Trust Numbers */}
        <div className="mt-14 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-black text-[#0A4FD5] dark:text-blue-400">15,000+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">African SMEs Empowered</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black text-[#0B192C] dark:text-white">
              {format(120000000000, { compact: true })}+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Annual Transactions Processed</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black text-[#65A30D] dark:text-[#84CC16]">99.98%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Cloud Infrastructure Uptime</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black text-[#0A4FD5] dark:text-blue-400">4.9 / 5</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Customer Satisfaction Score</div>
          </div>
        </div>

      </div>

      {/* Generation Modal */}
      <GenerateVideoModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onVideoGenerated={handleVideoGenerated}
      />

      {/* Expanded Video Detail Case Study Modal */}
      <VideoDetailModal
        testimonial={activeDetailTestimonial}
        onClose={() => setActiveDetailTestimonial(null)}
        onStartTrial={onOpenTrial}
      />
    </section>
  );
};
