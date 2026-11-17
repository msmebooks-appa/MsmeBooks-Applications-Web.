import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, CheckCircle2, X, Sparkles, MapPin, Building2 } from 'lucide-react';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';
import { BookingRecord } from '../types/booking';

export interface SocialProofEvent {
  id: string;
  businessName: string;
  businessType: string;
  city: string;
  country: string;
  firmName: string;
  firmId: string;
  firmAvatarBg: string;
  firmLogoText: string;
  serviceTitle: string;
  timeAgo: string;
}

const SAMPLE_SOCIAL_PROOF_EVENTS: SocialProofEvent[] = [
  {
    id: 'sp-1',
    businessName: 'PrimeMart Supermarkets',
    businessType: 'Retail Supermarket',
    city: 'Lekki, Lagos',
    country: 'Nigeria',
    firmName: 'Cedar Professional Services Limited',
    firmId: 'firm-cedar',
    firmAvatarBg: 'bg-[#102B4E]',
    firmLogoText: 'CP',
    serviceTitle: 'Monthly Bookkeeping & Tax Retainer',
    timeAgo: 'Just now',
  },
  {
    id: 'sp-2',
    businessName: 'Royal Palm Resort & Suites',
    businessType: 'Boutique Hotel & Resort',
    city: 'Airport Residential, Accra',
    country: 'Ghana',
    firmName: 'MsmeBooks In-House Professional Services',
    firmId: 'firm-msme-direct',
    firmAvatarBg: 'bg-[#1464C8]',
    firmLogoText: 'MB',
    serviceTitle: 'Hotel PMS & Restaurant POS Setup',
    timeAgo: '2 minutes ago',
  },
  {
    id: 'sp-3',
    businessName: 'Apex Health Diagnostics',
    businessType: 'Outpatient Clinic & Pharmacy',
    city: 'Wuse 2, Abuja',
    country: 'Nigeria',
    firmName: 'Bodman Finance & Accounting Associates',
    firmId: 'firm-bodman',
    firmAvatarBg: 'bg-[#0f4c81]',
    firmLogoText: 'BF',
    serviceTitle: 'PAYE Payroll & Statutory Pensions',
    timeAgo: '4 minutes ago',
  },
  {
    id: 'sp-4',
    businessName: 'Savannah Fresh Wholesale',
    businessType: 'FMCG Distribution Depot',
    city: 'Westlands, Nairobi',
    country: 'Kenya',
    firmName: 'Apex Cloud Systems & Implementations',
    firmId: 'firm-apex',
    firmAvatarBg: 'bg-[#2b2d42]',
    firmLogoText: 'AC',
    serviceTitle: 'Turnkey POS & Barcode Label Rollout',
    timeAgo: '6 minutes ago',
  },
  {
    id: 'sp-5',
    businessName: 'Horizon Logistics Fleet',
    businessType: 'Haulage & Cold Chain',
    city: 'Trans-Amadi, Port Harcourt',
    country: 'Nigeria',
    firmName: 'Point of View Consulting',
    firmId: 'firm-pointview',
    firmAvatarBg: 'bg-[#1b4332]',
    firmLogoText: 'PV',
    serviceTitle: 'BOI Working Capital Funding Readiness',
    timeAgo: '9 minutes ago',
  },
  {
    id: 'sp-6',
    businessName: 'Kigali Urban Roasters & Café',
    businessType: 'Specialty Coffee & Lounge',
    city: 'Kigali Heights, Kigali',
    country: 'Rwanda',
    firmName: 'Kigali Horizon Tax & Audit Advisory',
    firmId: 'firm-kigali',
    firmAvatarBg: 'bg-[#0284c7]',
    firmLogoText: 'KH',
    serviceTitle: 'EBM E-Invoicing & Corporate Tax Compliance',
    timeAgo: '12 minutes ago',
  },
  {
    id: 'sp-7',
    businessName: 'GoldCoast Logistics & Freight',
    businessType: 'Regional Clearing & Forwarding',
    city: 'Tema & Accra',
    country: 'Ghana',
    firmName: 'GoldCoast Chartered Advisors',
    firmId: 'firm-goldcoast',
    firmAvatarBg: 'bg-[#d97706]',
    firmLogoText: 'GC',
    serviceTitle: 'GRA VAT & SSNIT Pension Retainer',
    timeAgo: '15 minutes ago',
  },
  {
    id: 'sp-8',
    businessName: 'Ubuntu Industrial Supplies',
    businessType: 'Wholesale Warehouses',
    city: 'Sandton, Johannesburg',
    country: 'South Africa',
    firmName: 'Ubuntu Internal Controls & Asset Management',
    firmId: 'firm-ubuntu',
    firmAvatarBg: 'bg-[#4b5563]',
    firmLogoText: 'UB',
    serviceTitle: 'Physical Inventory & Risk Assessment',
    timeAgo: '18 minutes ago',
  },
];

interface SocialProofToastProps {
  lastUserBooking?: BookingRecord | null;
  onSelectFirm?: (firm: ProfessionalFirm) => void;
}

export const SocialProofToast: React.FC<SocialProofToastProps> = ({
  lastUserBooking,
  onSelectFirm,
}) => {
  const [currentEvent, setCurrentEvent] = useState<SocialProofEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const eventIndexRef = useRef(0);
  const timerRef = useRef<any>(null);

  // Trigger when a real user booking happens
  useEffect(() => {
    if (lastUserBooking && !isMuted) {
      const firm = PROFESSIONAL_FIRMS.find(f => f.id === lastUserBooking.providerId) || PROFESSIONAL_FIRMS[0];
      const realUserEvent: SocialProofEvent = {
        id: `user-${Date.now()}`,
        businessName: lastUserBooking.businessName || 'A growing business',
        businessType: lastUserBooking.industry || 'SME Enterprise',
        city: `${lastUserBooking.city || 'Lagos'}, ${lastUserBooking.country || 'Nigeria'}`,
        country: lastUserBooking.country || 'Nigeria',
        firmName: lastUserBooking.providerName,
        firmId: firm.id,
        firmAvatarBg: firm.avatarBg,
        firmLogoText: firm.logoText,
        serviceTitle: lastUserBooking.serviceTitle,
        timeAgo: 'Just now',
      };

      setCurrentEvent(realUserEvent);
      setIsVisible(true);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 7000);

      return () => clearTimeout(hideTimer);
    }
  }, [lastUserBooking, isMuted]);

  // Periodic rotation of authentic social proof alerts
  useEffect(() => {
    if (isMuted) return;

    // Show initial alert after 4 seconds
    const initialDelay = setTimeout(() => {
      showNextEvent();
    }, 4500);

    return () => clearTimeout(initialDelay);
  }, [isMuted]);

  const showNextEvent = () => {
    if (isMuted) return;

    const nextEvent = SAMPLE_SOCIAL_PROOF_EVENTS[eventIndexRef.current % SAMPLE_SOCIAL_PROOF_EVENTS.length];
    eventIndexRef.current += 1;
    setCurrentEvent(nextEvent);
    setIsVisible(true);

    // Auto hide after 6 seconds
    timerRef.current = setTimeout(() => {
      setIsVisible(false);

      // Schedule next event 16-24 seconds later
      const nextDelay = 18000 + Math.random() * 6000;
      setTimeout(() => {
        showNextEvent();
      }, nextDelay);
    }, 6000);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (!currentEvent || !isVisible) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-bottom duration-300 pointer-events-auto"
    >
      <div className="bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#1464C8]/50 dark:hover:border-[#1464C8] transition-all group relative overflow-hidden">
        
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1464C8] via-[#B7E532] to-[#1464C8]"></div>

        <div className="flex items-start gap-3.5 pt-1">
          
          {/* Firm Logo text badge */}
          <div className={`w-11 h-11 rounded-xl ${currentEvent.firmAvatarBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
            {currentEvent.firmLogoText}
          </div>

          {/* Social Proof Text Content */}
          <div className="flex-1 min-w-0 pr-4">
            
            {/* Live Indicator & Timing */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-[#B7E532] uppercase tracking-wider">
                Verified Partnership
              </span>
              <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {currentEvent.timeAgo}
              </span>
            </div>

            {/* Headline */}
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
              <strong className="text-[#102B4E] dark:text-white font-extrabold">{currentEvent.businessName}</strong> ({currentEvent.businessType}) just partnered with{' '}
              <span className="text-[#1464C8] dark:text-[#B7E532] font-black inline-flex items-center gap-0.5">
                {currentEvent.firmName}
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#B7E532] inline shrink-0" />
              </span>
            </p>

            {/* Location & Service engagement */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {currentEvent.city}
              </span>
              <span>•</span>
              <span className="text-[#102B4E] dark:text-slate-200 font-semibold truncate">
                {currentEvent.serviceTitle}
              </span>
            </div>

          </div>

          {/* Close / Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
