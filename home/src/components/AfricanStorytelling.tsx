import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';

export const AfricanStorytelling: React.FC = () => {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      title: 'Modern Retail & Food Supermarkets',
      city: 'Lagos, Nigeria',
      founder: 'Yetunde & Femi Awolowo',
      company: 'Afrimart Retail Chain',
      devices: 'Barcodes & Cloud POS',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80',
      description:
        'Managing 3 bustling retail branches in Lagos with over 2,400 fast-moving stock items. MsmeBooks links their cashier barcode scanners directly with cloud inventory, reducing closing reconciliation from 3 hours to 10 minutes.',
      metric: '99.8% Inventory Accuracy',
      growth: '+44% Year-on-Year Sales',
    },
    {
      title: 'Fashion, Textiles & E-Commerce',
      city: 'Nairobi, Kenya',
      founder: 'Wangari Kimani',
      company: 'Savannah Silk & Home Studio',
      devices: 'Laptops & Mobile Money POS',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      description:
        'Blending physical showroom sales in Nairobi CBD with digital orders across East Africa and diaspora buyers in the UK. M-Pesa automatic reconciliation and WhatsApp payment links have transformed their cash flow.',
      metric: 'Zero Payment Reconcile Delays',
      growth: '3.5x International Volume',
    },
    {
      title: 'Boutique Hotels & Culinary Lounges',
      city: 'Accra, Ghana',
      founder: 'Kwame Boateng',
      company: 'The Palms Hospitality Group',
      devices: 'Tablets & Guest Billing Folios',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
      description:
        'Front-desk room bookings, poolside bar orders, and restaurant billing now flow smoothly into one centralized balance sheet without manual spreadsheet copies or GRA tax errors.',
      metric: 'Audit Ready in 1 Click',
      growth: '+28% Operating Margins',
    },
    {
      title: 'Wholesale Depot & Fleet Distribution',
      city: 'Kigali, Rwanda',
      founder: 'Jean-Paul Habimana',
      company: 'Kigali Central Logistics Depot',
      devices: 'Handheld Scanners & Fleet Orders',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
      description:
        'Field sales representatives log client deliveries on Android smartphones in real time. Van inventory and customer credit balances stay accurate across 12 delivery routes.',
      metric: '100% Credit Limit Enforcement',
      growth: '38% Faster Turnaround',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7F000]/30 text-slate-950 dark:text-[#B7F000] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0866FF] dark:text-[#B7F000]" />
            <span>Authentic African Business Storytelling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Built for the Realities of African Commerce
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            From open-market wholesale depots and vibrant city supermarkets to high-growth tech startups and hospitality chains, see how modern African entrepreneurs rely on MsmeBooks daily.
          </p>
        </div>

        {/* Interactive Story Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Tab Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {stories.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStory(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 border flex flex-col gap-1.5 ${
                  activeStory === idx
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#0866FF] dark:border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-slate-50/60 dark:bg-[#0E172A] border-slate-200/70 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0866FF] dark:text-blue-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0866FF] dark:text-blue-400" />
                    <span>{s.city}</span>
                  </span>
                  <span className="text-[11px] font-semibold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {s.devices}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {s.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {s.company} &bull; Founded by {s.founder}
                </div>
              </button>
            ))}
          </div>

          {/* Right: Active Story Hero Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={stories[activeStory].image}
                  alt={stories[activeStory].title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Metric Badges */}
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-[#B7F000]">
                  {stories[activeStory].growth}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#B7F000]" />
                    <span>{stories[activeStory].metric}</span>
                  </div>
                  <span className="text-xs text-slate-300">
                    {stories[activeStory].city}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="text-xl sm:text-2xl font-black text-white font-display">
                  "{stories[activeStory].description}"
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
                    <span>Verified Active MsmeBooks Customer</span>
                  </div>
                  <span className="text-slate-300 font-semibold font-mono">
                    {stories[activeStory].company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
