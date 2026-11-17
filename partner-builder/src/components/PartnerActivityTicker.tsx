import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Building2, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Gift 
} from 'lucide-react';

interface TickerNotification {
  id: string;
  flag: string;
  country: string;
  headline: string;
  highlight: string;
  ago: string;
  icon: 'money' | 'partner' | 'deployment' | 'tier' | 'referral';
}

const INITIAL_TICKER_ITEMS: TickerNotification[] = [
  {
    id: 't-1',
    flag: '🇰🇪',
    country: 'Kenya',
    headline: 'Partner from Nairobi, Kenya',
    highlight: 'just earned $500 recurring commission',
    ago: '3s ago',
    icon: 'money'
  },
  {
    id: 't-2',
    flag: '🇬🇭',
    country: 'Ghana',
    headline: 'New certified agency in Ghana:',
    highlight: 'Kusi & Partners Consult accredited',
    ago: '11s ago',
    icon: 'partner'
  },
  {
    id: 't-3',
    flag: '🇳🇬',
    country: 'Nigeria',
    headline: 'Lagos Gold Partner practice',
    highlight: 'expanded portfolio to 150+ active clients',
    ago: '22s ago',
    icon: 'tier'
  },
  {
    id: 't-4',
    flag: '🇨🇮',
    country: 'Côte d’Ivoire',
    headline: 'Abidjan POS technician',
    highlight: 'deployed 24 cloud retail terminals today',
    ago: '34s ago',
    icon: 'deployment'
  },
  {
    id: 't-5',
    flag: '🇸🇳',
    country: 'Senegal',
    headline: 'Dakar accounting practice',
    highlight: 'automated 18 OHADA DGID e-tax filings',
    ago: '48s ago',
    icon: 'partner'
  },
  {
    id: 't-6',
    flag: '🇷🇼',
    country: 'Rwanda',
    headline: 'Kigali Implementation Specialist',
    highlight: 'just received $420 wire commission',
    ago: '1m ago',
    icon: 'money'
  },
  {
    id: 't-7',
    flag: '🇺🇬',
    country: 'Uganda',
    headline: 'Kampala advisory practice',
    highlight: 'advanced to Silver Tier (+20% rev share)',
    ago: '1m ago',
    icon: 'tier'
  },
  {
    id: 't-8',
    flag: '🇿🇦',
    country: 'South Africa',
    headline: 'Johannesburg enterprise reseller',
    highlight: 'earned $1,150 monthly recurring payout',
    ago: '2m ago',
    icon: 'money'
  },
  {
    id: 't-9',
    flag: '🇳🇬',
    country: 'Nigeria',
    headline: 'Partner Peer Referral:',
    highlight: 'Practice in Ikeja unlocked $150 bonus + 5% override',
    ago: '2m ago',
    icon: 'referral'
  },
  {
    id: 't-10',
    flag: '🇹🇿',
    country: 'Tanzania',
    headline: 'Arusha Safari Tech Consultant',
    highlight: 'onboarded 6 multi-currency lodges',
    ago: '3m ago',
    icon: 'deployment'
  }
];

export const PartnerActivityTicker: React.FC = () => {
  const [tickerItems, setTickerItems] = useState<TickerNotification[]>(INITIAL_TICKER_ITEMS);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Periodically cycle the spotlighted notification for mobile devices
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveItemIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [tickerItems.length]);

  return (
    <aside aria-label="Live Partner Activity Ticker" className="w-full bg-[#0A2552] dark:bg-[#041535] border-y border-blue-800/80 dark:border-blue-900 text-white py-3 relative overflow-hidden select-none shadow-inner z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left Live Badge */}
        <div className="shrink-0 flex items-center gap-2 bg-[#061838] dark:bg-[#030e24] px-3 py-1.5 rounded-xl border border-blue-700/80 dark:border-blue-900 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8CE600]"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8CE600] flex items-center gap-1">
            <span>Live Partner Activity</span>
          </span>
        </div>

        {/* Desktop / Tablet Continuous Marquee Slider */}
        <div className="hidden sm:flex items-center overflow-hidden flex-1 relative [mask-image:linear-gradient(to_right,transparent,white_40px,white_calc(100%-40px),transparent)]">
          <div className="flex items-center gap-6 animate-marquee-left whitespace-nowrap hover:[animation-play-state:paused]">
            {/* Duplicated array for seamless infinite marquee loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-slate-200"
              >
                <span className="text-base select-none">{item.flag}</span>
                <span className="font-semibold text-white">{item.headline}</span>
                <span className="font-bold text-[#8CE600] font-mono">{item.highlight}</span>
                <span className="text-[10px] text-blue-300 font-mono opacity-80 pl-1 border-l border-white/20">
                  {item.ago}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Single Rotating Item Ticker */}
        <div className="sm:hidden flex-1 overflow-hidden">
          <div className="flex items-center gap-2 text-xs truncate animate-in fade-in duration-300">
            <span className="text-base select-none shrink-0">
              {tickerItems[activeItemIndex].flag}
            </span>
            <div className="truncate">
              <span className="font-semibold text-white">
                {tickerItems[activeItemIndex].headline}{' '}
              </span>
              <span className="font-bold text-[#8CE600]">
                {tickerItems[activeItemIndex].highlight}
              </span>
            </div>
            <span className="text-[10px] text-blue-300 font-mono shrink-0">
              {tickerItems[activeItemIndex].ago}
            </span>
          </div>
        </div>

      </div>
    </aside>
  );
};
