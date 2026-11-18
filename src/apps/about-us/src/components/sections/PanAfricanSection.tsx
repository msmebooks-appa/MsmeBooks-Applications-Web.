import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, MapPin, Compass } from 'lucide-react';

export const PanAfricanSection: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<string>('west');
  const { currentCurrency, formatFromNGN } = useCurrency();
  const { t } = useLanguage();
  const hubs = t.africa_hubs;
  const activeHub = hubs.find((h) => h.id === selectedHub) || hubs[0];

  const hubBenchmarkNgn: Record<string, number> = {
    west: 28500000,
    east: 19400000,
    southern: 42000000,
    north: 36000000,
  };

  return (
    <section id="pan-african" className="py-16 md:py-24 bg-slate-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-200">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B4EA2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-lime-400 uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.africa_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            {t.africa_title_1}{' '}
            <span className="text-lime-400">{t.africa_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-300">
            {t.africa_desc}
          </p>
        </div>

        {/* 2-Column Display: Left = Photo & Statement; Right = Interactive Regional Hubs & Visual Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Authentic Photography & High-Impact Statement */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
              <img
                src="/src/assets/images/pan_african_tech_collaboration_1792324719375.jpg"
                alt="African software engineering and business team collaborating in modern tech office"
                className="w-full h-[360px] object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-mono text-lime-400 uppercase tracking-wider block mb-1">
                  {t.africa_photo_label}
                </span>
                <p className="text-sm font-semibold text-white">
                  {t.africa_photo_caption}
                </p>
              </div>
            </div>

            {/* Strategic Ambition Statement Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-lime-400 uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4 text-lime-400" />
                <span>{t.africa_vision_tag}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {t.africa_statement}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.africa_statement_desc}
              </p>
            </div>
          </div>

          {/* Right Column: African Map Hub Architecture & Localization Engine */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-lg font-bold text-white">{t.africa_hubs_title}</h4>
                  <p className="text-xs text-slate-400">{t.africa_hubs_desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-lime-300 font-mono">
                    <span>{t.africa_active_label}</span>
                    <span className="font-bold text-white">{currentCurrency.code} ({currentCurrency.symbol})</span>
                  </div>
                  <Globe className="w-5 h-5 text-lime-400" />
                </div>
              </div>

              {/* Hub Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5">
                {hubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-center ${
                      selectedHub === hub.id
                        ? 'bg-lime-400 text-slate-950 shadow-sm'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {hub.region}
                  </button>
                ))}
              </div>

              {/* Active Hub Details */}
              <div className="bg-slate-950/60 rounded-xl p-5 border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-lime-400 uppercase tracking-wider font-semibold">
                    {t.africa_scope_label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeHub.currencies}
                  </span>
                </div>
                <h5 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-lime-400 shrink-0" />
                  {activeHub.markets}
                </h5>

                <div className="space-y-2 text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400 block font-medium">{t.africa_landscape_label}</span>
                    <p className="mt-0.5 text-white/90">{activeHub.focus}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-slate-400 block font-medium">{t.africa_compliance_label}</span>
                    <p className="mt-0.5 text-lime-300/90">{activeHub.taxCapabilities}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Avg. Hub Enterprise Volume / Mo</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {formatFromNGN(hubBenchmarkNgn[activeHub.id] || 25000000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized SVG Map Representation of Africa with Connection Nodes */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{t.africa_interconnect_label}</span>
                <span className="text-lime-400 font-mono text-[11px]">{t.africa_latency_label}</span>
              </div>
              
              <div className="relative h-28 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-around px-4">
                {/* Node 1: Lagos */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#0B4EA2] border-2 border-lime-400 shadow-sm"></div>
                  <span className="text-[10px] text-slate-300 mt-1 font-mono">Lagos (West)</span>
                </div>
                {/* Line */}
                <div className="h-0.5 flex-1 bg-gradient-to-r from-lime-400/60 to-blue-400/60 mx-2"></div>
                {/* Node 2: Nairobi */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-lime-400 border-2 border-white shadow-sm"></div>
                  <span className="text-[10px] text-slate-300 mt-1 font-mono">Nairobi (East)</span>
                </div>
                {/* Line */}
                <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-400/60 to-lime-400/60 mx-2"></div>
                {/* Node 3: Johannesburg */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#0B4EA2] border-2 border-lime-400 shadow-sm"></div>
                  <span className="text-[10px] text-slate-300 mt-1 font-mono">Joburg (South)</span>
                </div>
                {/* Line */}
                <div className="h-0.5 flex-1 bg-gradient-to-r from-lime-400/60 to-slate-500/40 mx-2"></div>
                {/* Node 4: Global */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-lime-400 shadow-sm"></div>
                  <span className="text-[10px] text-slate-300 mt-1 font-mono">Global Edge</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
