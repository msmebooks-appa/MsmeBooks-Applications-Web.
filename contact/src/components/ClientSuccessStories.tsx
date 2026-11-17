import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  TrendingUp,
  Clock,
  Building,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';
import { CLIENT_TESTIMONIALS, ClientTestimonial } from '../data/testimonials';
import { CompanyLogo } from './CompanyLogos';
import { useLanguage } from '../context/LanguageContext';

interface ClientSuccessStoriesProps {
  onOpenDemo: () => void;
  onScrollToForm: (enquiryType?: string) => void;
}

export const ClientSuccessStories: React.FC<ClientSuccessStoriesProps> = ({
  onOpenDemo,
  onScrollToForm,
}) => {
  const { language, tDict } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sectors for interactive filter tabs
  const sectors = useMemo(
    () => ['All', 'Retail', 'Agribusiness', 'Hospitality', 'Logistics', 'Healthcare', 'Fintech'],
    []
  );

  // Filtered testimonials based on selected sector
  const filteredStories = useMemo(() => {
    if (selectedSector === 'All') return CLIENT_TESTIMONIALS;
    return CLIENT_TESTIMONIALS.filter((t) => t.sector === selectedSector);
  }, [selectedSector]);

  // Ensure index stays in valid range when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedSector]);

  const currentStory = filteredStories[currentIndex] || filteredStories[0];

  // Carousel Navigation Handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filteredStories.length - 1 : prev - 1));
  }, [filteredStories.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === filteredStories.length - 1 ? 0 : prev + 1));
  }, [filteredStories.length]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Auto-play timer with hover pause
  useEffect(() => {
    if (!isAutoPlaying || filteredStories.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, filteredStories.length, handleNext]);

  return (
    <section
      id="success-stories"
      className="py-20 lg:py-28 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 relative transition-colors overflow-hidden"
    >
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#70C038]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0B3B82]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-[#70C038] uppercase tracking-wider block mb-2">
            {tDict.stories.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight mb-4">
            {tDict.stories.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {tDict.stories.subtitle}
          </p>

          {/* Sector Filtering Controls */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-7 p-1 bg-white dark:bg-[#131E35] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto">
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedSector === sec
                    ? 'bg-[#0B3B82] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B3B82] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {sec === 'All' ? tDict.stories.allSectors : sec}
              </button>
            ))}
          </div>
        </div>

        {/* Main Testimonial Carousel Card */}
        {currentStory && (
          <div className="relative bg-white dark:bg-[#131E35] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md overflow-hidden transition-all duration-300">
            {/* Top Corporate Accent Bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-[#0B3B82] via-[#70C038] to-[#0B3B82]" />

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Quote & Testimonial Details */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Clean Metadata Line (Zero-Pill Compliance) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#0B3B82] dark:text-[#93C5FD]">
                      {currentStory.sector}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <span>{currentStory.flag}</span>
                      <span>{currentStory.location}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {currentStory.scale}
                    </span>
                  </div>

                  {/* Main Quote */}
                  <div className="relative">
                    <Quote className="w-10 h-10 text-slate-200 dark:text-slate-800/80 absolute -top-4 -left-3 pointer-events-none -z-0" />
                    <p className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed relative z-10 italic">
                      "{currentStory.quote[language as keyof typeof currentStory.quote] || currentStory.quote.en}"
                    </p>
                  </div>

                  {/* Client Info & Verification */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {/* Monogram Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#0B3B82] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 ring-2 ring-[#70C038]/30">
                      {currentStory.avatarInitials}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {currentStory.name}
                        </h4>
                        <CheckCircle2
                          className="w-4 h-4 text-[#70C038] shrink-0"
                          aria-label="Verified Customer"
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentStory.role} · <span className="font-semibold text-slate-700 dark:text-slate-300">{currentStory.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Modules Used Clean Text Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      Modules Used:
                    </span>
                    {currentStory.modules.map((mod, idx) => (
                      <span
                        key={mod}
                        className="text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {mod}{idx < currentStory.modules.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Company Logo & Quantified Outcome Card */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full bg-slate-50/80 dark:bg-[#0E172A] rounded-xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
                  {/* Company Logo Header */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3">
                      Featured Enterprise
                    </span>
                    <div className="py-2">
                      <CompanyLogo type={currentStory.logoType} size="lg" />
                    </div>
                  </div>

                  {/* Key Metrics Blocks */}
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-[#131E35] p-3.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#70C038] mb-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>Key Business Impact</span>
                      </div>
                      <div className="text-xl font-extrabold text-[#0B3B82] dark:text-[#93C5FD]">
                        {currentStory.metric}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentStory.metricLabel}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-[#131E35] p-3.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[#0B3B82] dark:text-[#93C5FD]" />
                        <span>Operational Advantage</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        {currentStory.secondaryMetric}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentStory.secondaryMetricLabel}
                      </p>
                    </div>
                  </div>

                  {/* Industry CTA Action */}
                  <button
                    onClick={() => onScrollToForm(currentStory.sector)}
                    className="w-full py-2.5 px-3.5 rounded-lg text-xs font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xs group"
                  >
                    <span>{tDict.stories.bookSimilarDemo}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Carousel Bottom Control Bar */}
            <div className="px-6 sm:px-10 py-4 bg-slate-50 dark:bg-[#0F172A] border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {filteredStories.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Jump to story ${idx + 1}: ${s.company}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-7 bg-[#70C038]'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                  />
                ))}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2">
                  {currentIndex + 1} of {filteredStories.length}
                </span>
              </div>

              {/* Navigation Arrows & Play/Pause Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  aria-label={isAutoPlaying ? 'Pause automatic slideshow' : 'Start automatic slideshow'}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous customer story"
                  className="p-2 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131E35] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next customer story"
                  className="p-2 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131E35] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Enterprise Logo Strip (Direct Click Jump) */}
        <div className="mt-10 sm:mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
            Trusted by Pan-African Market Leaders Across 8+ Nations
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CLIENT_TESTIMONIALS.map((t, idx) => {
              const isSelected = currentStory?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedSector('All');
                    setCurrentIndex(idx);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-white dark:bg-[#131E35] border-[#0B3B82] dark:border-blue-500 ring-2 ring-[#0B3B82]/10 shadow-sm'
                      : 'bg-white/60 dark:bg-[#10192E] border-slate-200 dark:border-slate-800/80 hover:bg-white dark:hover:bg-[#131E35] hover:border-slate-300'
                  }`}
                >
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <CompanyLogo type={t.logoType} size="sm" />
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>{t.flag} {t.sector}</span>
                    <span className="font-bold text-[#70C038] group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
