import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  Sparkles,
  Zap,
  Globe2,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { OfficialPartnerBadge } from './OfficialPartnerBadge';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenApply: () => void;
  onOpenVerify: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApply, onOpenVerify }) => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  // Subtle parallax scroll effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active Partners', value: '100+', detail: 'Across 12 African Nations', icon: Users },
    { label: 'Pan-African Countries', value: '20+', detail: 'Multi-Currency & Tax Compliant', icon: Globe2, flags: '🇳🇬 🇰🇪 🇬🇭 🇿🇦' },
    { label: 'Certified Experts', value: '500+', detail: 'Academy Accredited Practitioners', icon: Award },
    { label: 'Commissions Paid', value: '$2M+', detail: '100% On-Time Wire Settlements', icon: DollarSign },
    { label: 'Cloud POS Uptime', value: '99.9%', detail: 'Offline Resilient & Fault Tolerant', icon: Zap },
    { label: 'Audit Integrations', value: '25+', detail: 'Caseware, Sage, QuickBooks, etc.', icon: Globe2 }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F6FF] via-white to-slate-50 dark:from-[#041533] dark:via-[#061F4A] dark:to-[#072557] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      {/* Background Subtle Accent Grids & Parallax Elements */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#0A3981_1px,transparent_1px)] dark:bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] dark:opacity-[0.07] pointer-events-none" 
      />

      {/* Parallax Floating Orb 1 (Top Left) */}
      <div 
        style={{ transform: `translate3d(0, ${scrollY * 0.18}px, 0)` }}
        className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-600/15 filter blur-3xl pointer-events-none transition-transform duration-75 ease-out" 
      />

      {/* Parallax Floating Orb 2 (Right Center) */}
      <div 
        style={{ transform: `translate3d(0, ${scrollY * -0.12}px, 0)` }}
        className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#8CE600]/10 filter blur-3xl pointer-events-none transition-transform duration-75 ease-out" 
      />

      {/* Parallax Geometric Floating Accent */}
      <div 
        style={{ transform: `translate3d(${scrollY * 0.05}px, ${scrollY * 0.22}px, 0) rotate(${scrollY * 0.04}deg)` }}
        className="absolute top-24 right-1/4 w-24 h-24 border border-blue-300/30 dark:border-blue-700/30 rounded-3xl pointer-events-none hidden lg:block"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust statement & Program Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200/60 dark:border-blue-800 text-xs font-bold tracking-wide uppercase mb-6">
              <Award className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
              <span>{t('hero.badge_trust', 'Official MsmeBooks SaaS Partner Ecosystem')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-[#0A3981] dark:text-white leading-[1.18] sm:leading-[1.12] mb-5 hyphens-none break-normal">
              {t('hero.headline', 'Partner with MsmeBooks. Grow Your Business. Earn Recurring Revenue.')}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-200 font-normal leading-relaxed mb-6 max-w-2xl">
              {t('hero.subheadline', 'Join the MsmeBooks Partner Ecosystem and unlock new business opportunities by helping businesses across Africa and beyond simplify accounting, POS, inventory, and everyday business management.')}
            </p>

            <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-blue-100/85 font-medium mb-8 max-w-2xl border-l-2 border-[#8CE600] pl-4">
              Build a profitable, scalable business with attractive recurring commissions (15%–40%), professional certification, official metallic partner recognition, marketing resources, and dedicated local support.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#0A3981] hover:bg-[#072c66] active:bg-[#051f47] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-900/20 dark:shadow-blue-950/50 transition-all transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
              >
                {t('hero.cta_become', 'Become a Partner')}
                <ArrowRight className="w-4 h-4 text-[#8CE600]" />
              </button>

              <a
                href="#benefits"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 dark:text-white bg-white dark:bg-[#0A2552] hover:bg-slate-50 dark:hover:bg-[#0E3675] border border-slate-300 dark:border-blue-800 rounded-xl transition-all whitespace-nowrap"
              >
                {t('hero.cta_explore', 'Explore Partner Benefits')}
              </a>

              <a
                href="#directory"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-[#0A3981] dark:text-[#8CE600] hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/80 rounded-xl transition-all whitespace-nowrap"
              >
                {t('hero.cta_find', 'Find a Certified Partner')}
              </a>
            </div>

            {/* Trust Statement Bar */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-blue-900/60 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span className="text-[#0A3981] dark:text-[#8CE600] font-bold">Trust Statement:</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8CE600]" />
                Empowering Partners
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8CE600]" />
                Growing Businesses
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8CE600]" />
                Across Africa and Beyond
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual with Real African Team + Floating UI Cards with Parallax Offset */}
          <div 
            style={{ transform: `translate3d(0, ${scrollY * -0.06}px, 0)` }}
            className="lg:col-span-5 relative transition-transform duration-75 ease-out"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#0A3981]/20 via-[#8CE600]/20 to-blue-200/30 dark:from-blue-600/30 dark:via-[#8CE600]/20 dark:to-cyan-400/20 rounded-3xl filter blur-xl opacity-70" />

              {/* Main Photo Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-blue-900 bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/src/assets/images/hero_african_business_team_1793445604973.jpg"
                  alt="African business and technology partnership team collaborating in modern office"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-bold tracking-wider uppercase text-[#8CE600] flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Partnership Network
                  </div>
                  <div className="text-sm font-semibold drop-shadow-md">
                    Lagos · Nairobi · Accra · Johannesburg · Kigali
                  </div>
                </div>
              </div>

              {/* Floating UI Card 1: Official Gold Partner Badge Preview */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-white/95 dark:bg-[#0A2552]/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-blue-800/80 hidden sm:flex flex-col items-center transform rotate-2 hover:rotate-0 transition-transform">
                <div className="text-[10px] font-bold text-slate-500 dark:text-blue-200 uppercase tracking-wider mb-1">
                  Official Credential
                </div>
                <OfficialPartnerBadge tier="gold" size="sm" partnerCode="MSME-PT-8421" />
                <button
                  onClick={onOpenVerify}
                  className="mt-1 text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline cursor-pointer"
                >
                  Verify Partner Status →
                </button>
              </div>

              {/* Floating UI Card 2: Commission Recurring Earnings */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 dark:bg-[#0A2552]/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 dark:border-blue-800/80 max-w-xs transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-300">Monthly Commission</span>
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border dark:border-emerald-800/50">
                    +30% Gold Tier
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-[#0A3981] dark:text-white font-mono tabular-nums">
                  $2,840.00 <span className="text-xs text-slate-500 dark:text-slate-300 font-sans font-normal">/ mo recurring</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 border-t border-slate-100 dark:border-blue-900/60 pt-2">
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-[#8CE600]" />
                  <span>48 Active Client Subscriptions</span>
                </div>
              </div>

              {/* Floating UI Card 3: Top Left Growth Pill */}
              <div className="absolute top-4 -left-4 bg-white/90 dark:bg-[#0A2552]/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-blue-800/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8CE600]/20 flex items-center justify-center text-[#4d7c0f] dark:text-[#8CE600]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-blue-200 font-medium">Partner Growth</div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">+140% YoY Portfolio</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE: Real-Time Statistics Ticker Component */}
        <div className="mt-16 pt-8 border-t border-slate-200/90 dark:border-blue-900/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-sky-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-Time Ecosystem Statistics</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Live Verified Metrics across Pan-Africa
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-[#0A2552]/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-blue-800/80 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-[#8CE600]/60 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-300 leading-tight">
                        {s.label}
                      </span>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A3981] dark:text-white font-mono tracking-tight flex items-baseline justify-between gap-1">
                      <span>{s.value}</span>
                      {s.flags && (
                        <span className="text-[10px] sm:text-xs font-normal select-none tracking-tight hidden xl:inline opacity-90">
                          {s.flags}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-300 mt-1 truncate">
                    {s.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
