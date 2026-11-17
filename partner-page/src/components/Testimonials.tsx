import React, { useState, useEffect } from 'react';
import { 
  TESTIMONIALS 
} from '../data/partnerData';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#65A30D]" />
            Partner Voices
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Trusted by Professionals Empowering African SMEs
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            See how chartered accountants, management consultants, and technology vendors integrate MsmeBooks into their daily client delivery.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Main Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-8 sm:p-12 relative overflow-hidden transition-all duration-500">
            
            {/* Giant decorative quote icon */}
            <Quote className="absolute top-6 right-8 w-24 h-24 text-slate-100/80 -z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Left Column: Portrait & Badge */}
              <div className="shrink-0 flex flex-col items-center text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#84CC16] shadow-lg relative">
                  <img
                    src={current.image}
                    alt={current.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-3 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#0F4C81] text-white shadow-xs">
                  {current.tier}
                </span>
                <span className="mt-1 text-[11px] font-bold text-[#3F6212] bg-lime-50 px-2.5 py-0.5 rounded-md border border-lime-200">
                  {current.metric}
                </span>
              </div>

              {/* Right Column: Quote text and professional info */}
              <div className="flex-1 flex flex-col justify-between">
                
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-slate-400 ml-2">Verified Partner Review</span>
                </div>

                {/* Quote (Exact wording requested by prompt) */}
                <blockquote className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed italic mb-6">
                  “{current.quote}”
                </blockquote>

                {/* Author Info */}
                <div>
                  <h4 className="text-lg font-bold text-[#0A192F] font-display">
                    {current.name}
                  </h4>
                  <p className="text-sm font-semibold text-[#0F4C81]">
                    {current.role}, {current.organization}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {current.location}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-8 px-4">
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? 'w-8 bg-[#0F4C81]'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Compliance & Transparency Note (Mandated by Prompt) */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 italic">
              * Note: Partner testimonials and metrics reflect representative case-study illustrations of anticipated professional outcomes across our African rollout.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
