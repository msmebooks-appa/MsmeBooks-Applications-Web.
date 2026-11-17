import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Quote, 
  Star, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  Sparkles,
  Building
} from 'lucide-react';
import { PartnerTierId } from '../types';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  firm: string;
  location: string;
  countryCode: string;
  tier: PartnerTierId;
  metric: string;
  quote: string;
  rating: number;
  specialty: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Chief Adebayo O. Johnson, FCA',
    role: 'Senior Managing Partner',
    firm: 'Apex Financial & Tax Advisory',
    location: 'Victoria Island, Lagos, Nigeria',
    countryCode: 'NG',
    tier: 'gold',
    metric: '$3,850 / month recurring software commission',
    quote: 'MsmeBooks has completely reshaped our accounting practice. Rather than just billing once a year for statutory audit filings, we now bundle MsmeBooks cloud accounting and multi-store POS for all 48 of our retail clients, earning a dependable 30% monthly recurring commission that paid for our new branch office.',
    rating: 5,
    specialty: 'Retail Multi-Store Accounting & Statutory FIRS Tax Automation'
  },
  {
    id: 'test-2',
    name: 'Wanjiku Kamau, CPA',
    role: 'Director of Technology Solutions',
    firm: 'Rift Valley Retail & Cloud POS',
    location: 'Westlands, Nairobi, Kenya',
    countryCode: 'KE',
    tier: 'platinum',
    metric: '92 Active MSMEs onboarded · $5,400 monthly revenue',
    quote: 'In Kenya, small supermarkets and wholesalers demand POS systems that handle eTIMS compliance flawlessly. MsmeBooks handles statutory KRA requirements out-of-the-box. As a Platinum Partner earning 40%, our hardware distribution business unlocked software recurring revenue that now exceeds our equipment margins.',
    rating: 5,
    specialty: 'eTIMS Tax Compliance & Supermarket Touchscreen POS'
  },
  {
    id: 'test-3',
    name: 'Kwame Asante, ACCA',
    role: 'Head of FinTech Implementation',
    firm: 'Gold Coast Advisory & ERP Group',
    location: 'Airport Residential Area, Accra, Ghana',
    countryCode: 'GH',
    tier: 'gold',
    metric: '100% Client Retention Rate over 18 Months',
    quote: 'Our clients love the simplicity of the mobile app and WhatsApp invoice delivery. As their advisory firm, having real-time access to their general ledgers and 1-click sync with Caseware IDEA cuts our audit preparation time by 60%. The Gold partner perks and dedicated technical architect are first-class.',
    rating: 5,
    specialty: 'Caseware Audit Integration & WhatsApp Invoicing'
  },
  {
    id: 'test-4',
    name: 'Thabo Mokoena, CA(SA)',
    role: 'Managing Principal',
    firm: 'Mzansi Enterprise Cloud ERP',
    location: 'Sandton, Johannesburg, South Africa',
    countryCode: 'ZA',
    tier: 'platinum',
    metric: '+185% Year-over-Year Practice Valuation Growth',
    quote: 'We migrated 35 franchise outlets from clunky legacy desktop systems to MsmeBooks in under six weeks. The multi-branch inventory tracking with offline sync survived load-shedding power outages without a single lost transaction. Becoming an official partner was our best strategic decision.',
    rating: 5,
    specialty: 'Multi-Branch Inventory & Offline Load-Shedding Resilience'
  },
  {
    id: 'test-5',
    name: 'Diane Uwase, MBA',
    role: 'Co-Founder & Technology Architect',
    firm: 'Kigali Smart Commerce Hub',
    location: 'Nyarugenge, Kigali, Rwanda',
    countryCode: 'RW',
    tier: 'silver',
    metric: '28 Pharmacy & Distribution Clients Onboarded',
    quote: 'The training academy and certification curriculum made it easy to upskill our junior tech engineers. Within two weeks of earning the Certified Implementation Specialist badge, we landed three major pharmacy distribution chains. The recurring 20% commission deposits arrive promptly like clockwork.',
    rating: 5,
    specialty: 'Pharmaceutical Batch Tracking & Expiry Management'
  },
  {
    id: 'test-6',
    name: 'Yves Kouassi, Expert-Comptable',
    role: 'Président Directeur Général',
    firm: 'Abidjan Fiscal & Advisory Network',
    location: 'Plateau, Abidjan, Côte d’Ivoire',
    countryCode: 'CI',
    tier: 'silver',
    metric: 'SYSCOHADA Compliant Reporting for 34 Firms',
    quote: 'La prise en charge du plan comptable SYSCOHADA et l’export automatique vers Sage ont fait de MsmeBooks la solution préférée de nos PME clientes à Abidjan. Le portail partenaire en français et le support technique dédié nous permettent d’intervenir en toute sérénité.',
    rating: 5,
    specialty: 'SYSCOHADA Standard Accounting & West African Tax Filing'
  }
];

export const TestimonialScroll: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-scroll carousel every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const getTierColorClass = (tier: PartnerTierId) => {
    switch (tier) {
      case 'platinum':
        return 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700';
      case 'gold':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'silver':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
      case 'bronze':
        return 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-700';
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
              Verified Partner Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
              What Top African Partners Say About MsmeBooks
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
              Hear directly from chartered accounting principals, POS hardware distributors, and systems consultants scaling recurring SaaS commissions across Africa.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-[#072457] border border-slate-200 dark:border-blue-800 text-slate-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-2xl bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] hover:bg-[#082a61] dark:hover:bg-[#9be81c] flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Animated Carousel Entry using Framer Motion */}
        <div className="relative min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-white dark:bg-[#072557] rounded-3xl p-6 sm:p-10 border-2 border-slate-200 dark:border-blue-800/90 shadow-xl relative overflow-hidden"
            >
              {/* Background watermark quote */}
              <Quote className="absolute right-6 bottom-4 w-36 h-36 text-blue-500/5 dark:text-blue-300/5 pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Profile Column */}
                <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-blue-800/70 pb-6 lg:pb-0 lg:pr-8">
                  <div>
                    {/* Metallic Partner Tier Pill */}
                    <div className="inline-flex items-center gap-1.5 mb-4">
                      <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getTierColorClass(TESTIMONIALS[currentIndex].tier)}`}>
                        ★ {TESTIMONIALS[currentIndex].tier.toUpperCase()} PARTNER
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {TESTIMONIALS[currentIndex].name}
                    </h3>
                    <div className="text-xs sm:text-sm font-semibold text-[#0A3981] dark:text-[#8CE600] mt-1">
                      {TESTIMONIALS[currentIndex].role}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5" />
                      {TESTIMONIALS[currentIndex].firm}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {TESTIMONIALS[currentIndex].location}
                    </div>
                  </div>

                  {/* Rating Stars & Specialty */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-blue-900/60">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Specialty: <strong className="text-slate-800 dark:text-slate-200">{TESTIMONIALS[currentIndex].specialty}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Quote & Quantified Outcomes Column */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Quantified Business Metric Banner */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950/60 border border-blue-200 dark:border-emerald-800/60 text-xs sm:text-sm font-bold text-[#0A3981] dark:text-[#8CE600]">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-[#8CE600] shrink-0" />
                    <span>Verified Growth Outcome: {TESTIMONIALS[currentIndex].metric}</span>
                  </div>

                  {/* Main Attributable Quote */}
                  <blockquote className="text-base sm:text-xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic border-l-4 border-[#0A3981] dark:border-[#8CE600] pl-5 py-1">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </blockquote>

                  {/* Bottom Verification Seal */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-blue-900/60 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Official MsmeBooks SaaS Certified Practitioner
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-400">
                      Testimonial #{currentIndex + 1} of {TESTIMONIALS.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators / Dot Navigation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 h-2.5 bg-[#0A3981] dark:bg-[#8CE600]'
                  : 'w-2.5 h-2.5 bg-slate-300 dark:bg-blue-900 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Infinite Marquee Strip of Partner Firm Names */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-blue-900/60">
          <div className="text-xs font-bold text-center uppercase tracking-widest text-slate-400 dark:text-sky-400 mb-4">
            Trusted by 100+ Leading Accounting Practices & FinTech Distributors across Africa
          </div>
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
              className="flex shrink-0 gap-8 items-center text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap"
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#072457] rounded-xl border border-slate-200 dark:border-blue-800 shadow-2xs">
                  <span className="text-sm">🏢</span>
                  <span>{item.firm}</span>
                  <span className="text-slate-400">({item.location.split(',')[1]?.trim() || item.countryCode})</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
