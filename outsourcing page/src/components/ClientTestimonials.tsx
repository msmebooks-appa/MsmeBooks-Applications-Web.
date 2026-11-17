import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  companyName: string;
  industry: string;
  location: string;
  countryFlag: string;
  avatarUrl: string;
  quote: string;
  highlightMetric: string;
  metricLabel: string;
  serviceTier: string;
  rating: number;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'Babajide Adeleke',
    role: 'Founder & Managing Director',
    companyName: 'Apex Mart Supermarket Group',
    industry: 'Retail & Supermarkets',
    location: 'Lagos & Abuja, Nigeria',
    countryFlag: '🇳🇬',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'Before MsmeBooks, reconciling 4 supermarket branches took 3 different spreadsheets and endless cashier discrepancies. Now, our daily POS-to-bank feeds are verified every morning by 10 AM, and our month-end books close in 48 hours without stress.',
    highlightMetric: '35+ Hours',
    metricLabel: 'Saved Per Month in Manual Reconciliations',
    serviceTier: 'Growth Business Plan',
    rating: 5,
  },
  {
    id: 'test-2',
    clientName: 'Dr. Wanjiku Mwangi',
    role: 'Chief Executive Officer',
    companyName: 'Safari Health Diagnostics Hub',
    industry: 'Healthcare & Clinics',
    location: 'Nairobi, Kenya',
    countryFlag: '🇰🇪',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: 'Handling doctor locum payouts, pharmaceutical batch write-offs, and delayed insurance claim receivables was overwhelming. MsmeBooks assigned us a certified CPA-K who restructured our cash flow and accelerated our HMO collections significantly.',
    highlightMetric: '99.8%',
    metricLabel: 'On-Time HMO Claim Reconciliations',
    serviceTier: 'Professional Managed Plan',
    rating: 5,
  },
  {
    id: 'test-3',
    clientName: 'Pieter van der Merwe',
    role: 'Chief Operating Officer',
    companyName: 'Vanguard Logistics & Fleet SA',
    industry: 'Logistics & Transportation',
    location: 'Johannesburg, South Africa',
    countryFlag: '🇿🇦',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'SARS audits used to keep our leadership team awake at night. Our assigned CA(SA) from MsmeBooks conducted a full pre-audit review, cleared an outstanding R380,000 VAT query, and established an automated payroll for our 72 drivers via Ozow Instant EFT.',
    highlightMetric: 'R0',
    metricLabel: 'Incurred in Statutory Late Penalties',
    serviceTier: 'Professional Managed Plan',
    rating: 5,
  },
  {
    id: 'test-4',
    clientName: 'Kwame Boateng',
    role: 'Co-Founder & VP Finance',
    companyName: 'AfriPay Technologies PLC',
    industry: 'Fintech & SaaS',
    location: 'Accra, Ghana & London, UK',
    countryFlag: '🇬🇭',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'Managing remote tech talent across Ghana, Nigeria, and the UK with different statutory tax withholdings was our biggest hurdle. MsmeBooks provides clean multi-currency payroll, automated tax clearance, and investor-ready IFRS board packs every single month.',
    highlightMetric: '6th Day',
    metricLabel: 'Consistent Month-End Closing SLA',
    serviceTier: 'Enterprise Fully Managed',
    rating: 5,
  },
  {
    id: 'test-5',
    clientName: 'Amina Kalisa',
    role: 'Managing Partner',
    companyName: 'Akagera Eco-Hospitality Resorts',
    industry: 'Hospitality & Resorts',
    location: 'Kigali, Rwanda',
    countryFlag: '🇷🇼',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    quote: 'The bilingual compliance team at MsmeBooks handles our Rwanda Revenue Authority (RRA) returns, EAC trade duties, and food & beverage cost margin accounting. Their encrypted document vault makes remote collaboration completely seamless.',
    highlightMetric: '14.8%',
    metricLabel: 'Identified Cost Margin Optimizations',
    serviceTier: 'Growth Business Plan',
    rating: 5,
  },
];

export const ClientTestimonials: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-cycle through testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            {t.testimonials.pill}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700/80 shadow-xl dark:shadow-2xl relative">
            
            {/* Top row: Quote icon & Service Tier Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-lime-600 dark:text-lime-400">
                <Quote className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-lime-800 dark:text-lime-400 bg-lime-100 dark:bg-lime-950/80 px-3 py-1 rounded-full border border-lime-300 dark:border-lime-800">
                  {current.serviceTier}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 pl-2">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content with Animated Transitions */}
            <div className="py-6 min-h-[220px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {/* Quote Body */}
                  <blockquote className="text-base sm:text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-normal italic">
                    "{current.quote}"
                  </blockquote>

                  {/* Impact Metric Card & Author Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    
                    {/* Author Details (Col 8) */}
                    <div className="md:col-span-7 flex items-center gap-4">
                      <img
                        src={current.avatarUrl}
                        alt={current.clientName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-lime-500 dark:border-lime-400 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white font-grotesk">
                            {current.clientName}
                          </h4>
                          <span className="text-lg">{current.countryFlag}</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {current.role} • <span className="text-blue-600 dark:text-blue-300 font-semibold">{current.companyName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{current.industry}</span>
                          <span>•</span>
                          <span>{current.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Impact Metric Callout (Col 5) */}
                    <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-right md:text-left flex md:flex-col items-center md:items-start justify-between">
                      <div className="text-xl sm:text-2xl font-black text-lime-700 dark:text-lime-400 font-grotesk">
                        {current.highlightMetric}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        {current.metricLabel}
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls: Prev/Next, Dots, Play/Pause */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-8 bg-lime-500 dark:bg-lime-400' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows & Auto-play toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
                  title={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                  aria-label={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={handlePrev}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
