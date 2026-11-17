import React, { useState } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterCountry, setFilterCountry] = useState<string>('ALL');

  const filteredTestimonials =
    filterCountry === 'ALL'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.countryCode === filterCountry);

  const activeTestimonial =
    filteredTestimonials[currentIndex % filteredTestimonials.length] || TESTIMONIALS[0];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  // Helper to extract initials from full name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((part) => part.length > 0 && !['&', 'and', 'Dr.'].includes(part))
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  };

  const countries = [
    { code: 'ALL', name: 'All African Markets' },
    { code: 'NG', name: '🇳🇬 Nigeria' },
    { code: 'KE', name: '🇰🇪 Kenya' },
    { code: 'GH', name: '🇬🇭 Ghana' },
    { code: 'ZA', name: '🇿🇦 South Africa' },
    { code: 'RW', name: '🇷🇼 Rwanda' },
    { code: 'UG', name: '🇺🇬 Uganda' },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#090E1A] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
            ))}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">4.9/5 from 10,000+ businesses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Businesses Are Growing With MsmeBooks
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2">
            Real stories from African founders who turned operational chaos into structured, profitable growth.
          </p>

          {/* Country Filter Chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setFilterCountry(c.code);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterCountry === c.code
                    ? 'bg-[#0866FF] text-white shadow-sm'
                    : 'bg-white dark:bg-[#0E172A] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Testimonial Spotlight Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 dark:border-slate-800 relative transition-colors duration-200">
          <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-100/80 dark:text-blue-900/30 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Customer Initials Badge + Metric */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-lg border-2 border-[#0866FF] p-1 bg-gradient-to-tr from-[#0866FF] to-blue-400">
                <div className="w-full h-full rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white">
                  <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#B7F000]">
                    {getInitials(activeTestimonial.name)}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {activeTestimonial.countryCode}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  {activeTestimonial.name}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {activeTestimonial.role}
                </div>
                <div className="text-xs font-bold text-[#0866FF] dark:text-blue-400 mt-0.5">
                  {activeTestimonial.business}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#B7F000]/40 text-slate-950">
                {activeTestimonial.badge}
              </span>
            </div>

            {/* Testimonial Quote & Impact */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0866FF] dark:text-blue-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeTestimonial.city}, {activeTestimonial.country}</span>
                <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                <span className="text-slate-600 dark:text-slate-300">{activeTestimonial.industry}</span>
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </blockquote>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Verified Business Impact:</span>
                  <span className="font-mono font-bold text-[#0866FF] dark:text-blue-400">{activeTestimonial.stats}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Active User</span>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {filteredTestimonials.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-7 px-2.5 rounded-full text-[11px] font-bold font-mono transition-all flex items-center gap-1.5 ${
                        currentIndex % filteredTestimonials.length === i
                          ? 'bg-[#0866FF] text-white shadow-sm ring-2 ring-blue-400/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      aria-label={`Go to ${item.name}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7F000]" />
                      <span>{getInitials(item.name)}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
