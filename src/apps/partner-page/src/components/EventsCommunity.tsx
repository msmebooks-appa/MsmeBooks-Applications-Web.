import React, { useState } from 'react';
import { 
  UPCOMING_EVENTS, 
  ASSET_IMAGES 
} from '../data/partnerData';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Presentation, 
  Camera,
  CheckCircle2
} from 'lucide-react';
import { EventItem } from '../types';

interface EventsCommunityProps {
  onOpenEventRegister: (event: EventItem) => void;
}

export const EventsCommunity: React.FC<EventsCommunityProps> = ({ onOpenEventRegister }) => {
  const [activeCityTab, setActiveCityTab] = useState<string>('All');

  const filteredEvents = activeCityTab === 'All' 
    ? UPCOMING_EVENTS 
    : UPCOMING_EVENTS.filter(e => e.city === activeCityTab);

  return (
    <section id="community" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 -right-32 w-80 h-80 bg-[#0F4C81]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-[#84CC16]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#84CC16] text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
            <Camera className="w-3.5 h-3.5 text-[#84CC16]" />
            Pan-African Partner Community
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            Meet MsmeBooks Where African Business Happens
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            From premier accounting congresses in Lagos and Nairobi to regional SME clinics and reseller award galas in Accra and Kigali, our partner network meets face-to-face across the continent.
          </p>
        </div>

        {/* Big Photography Showcase Banner with Overlay "Connect. Learn. Partner. Grow." */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl mb-14 group">
          <div className="h-72 sm:h-96 md:h-[420px] w-full relative">
            <img
              src={ASSET_IMAGES.conference}
              alt="African business professionals networking at MsmeBooks conference booth"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81]/40 to-transparent" />

            {/* Overlay Content (Prompt Mandate) */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-xl">
                <div className="inline-block px-3 py-1 rounded-full bg-[#84CC16] text-[#0A192F] text-xs font-extrabold tracking-wider uppercase mb-2">
                  Pan-African Summit Tour
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                  Connect. Learn. Partner. Grow.
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  Join hundreds of chartered accountants, IT partners, tax consultants, and fintech pioneers at our quarterly in-person summits, technical roundtables, and gala dinners.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <a
                  href="#events-calendar"
                  className="px-5 py-3 rounded-xl bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#84CC16]/20 transition-colors"
                >
                  <span>Explore Partner Events</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Authentic Photo & Event Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          {/* Pillar 1: Accounting & Tax Training */}
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700 overflow-hidden flex flex-col">
            <div className="h-44 overflow-hidden relative">
              <img
                src={ASSET_IMAGES.workshop}
                alt="African female chartered accountant conducting hands-on training workshop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#0F4C81] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                Certified Training
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-white mb-1.5">
                  Accountant & Bookkeeper Masterclasses
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Accredited Continuing Professional Development (CPD) sessions on cloud taxation, audit automation, and multi-tenant ledger management.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-[#84CC16] font-semibold">
                <span>Monthly in 6 African capitals</span>
                <span>CPD Accredited ✓</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Reseller & Tech Exhibitions */}
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700 overflow-hidden flex flex-col">
            <div className="h-44 overflow-hidden relative">
              <img
                src={ASSET_IMAGES.team}
                alt="African technology companies and consultants collaborating"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#84CC16] text-[#0A192F] text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                Tech Resellers
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-white mb-1.5">
                  Tech Exhibitions & POS Vendor Booths
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive MsmeBooks experience centers where POS aggregators, computer store owners, and VARs learn how to bundle software with hardware.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-[#84CC16] font-semibold">
                <span>Hardware Bundle Margins</span>
                <span>Live Demos ✓</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Annual Partner Gala & Awards */}
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700 overflow-hidden flex flex-col">
            <div className="h-44 overflow-hidden relative">
              <img
                src={ASSET_IMAGES.consultant}
                alt="African partner consultant of the year award ceremony"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-amber-500 text-[#0A192F] text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                Partner Awards
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-white mb-1.5">
                  Annual Partner Gala & Recognition
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Celebrating top-performing Platinum firms, high-growth BPOs, and standout SME mentors with trophies, marketing grants, and executive retreats.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-[#84CC16] font-semibold">
                <span>₦50M+ In Partner Grants</span>
                <span>Annual Gala ✓</span>
              </div>
            </div>
          </div>

        </div>

        {/* Upcoming Tour Calendar */}
        <div id="events-calendar" className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Upcoming Partner Tour & Meetup Dates
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Reserve your complimentary seat as an accountant, advisor, or technology partner.
              </p>
            </div>

            {/* City filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['All', 'Lagos', 'Nairobi', 'Accra', 'Kigali'].map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCityTab(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeCityTab === city
                      ? 'bg-[#84CC16] text-[#0A192F]'
                      : 'bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-700/60 mt-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-700/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex flex-col items-center justify-center text-center shrink-0">
                    <Calendar className="w-4 h-4 text-[#84CC16]" />
                    <span className="text-[9px] font-extrabold uppercase text-slate-300 mt-0.5">
                      {evt.city}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {evt.title}
                      </h4>
                      <span className="text-[10px] bg-blue-900/60 text-sky-300 px-2 py-0.5 rounded-full border border-blue-700/50">
                        {evt.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {evt.venue}, {evt.country}
                      </span>
                      <span>•</span>
                      <span>{evt.date}</span>
                      <span>•</span>
                      <span className="text-[#84CC16] font-medium">{evt.attendees}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onOpenEventRegister(evt)}
                    className="w-full md:w-auto px-4 py-2 text-xs font-bold text-[#0A192F] bg-[#84CC16] hover:bg-[#9BE22D] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Register for Meetup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
