import React, { useState } from 'react';
import { 
  Play, 
  Globe2, 
  WifiOff, 
  Coins, 
  FileCheck2, 
  Layers, 
  Printer, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export const VideoAndAfricanDesignSection: React.FC = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const pillars = [
    {
      title: 'Offline-First Resilience',
      description: 'Never lose a sale during power or broadband disruptions. Ring up sales offline; auto-sync to cloud when connection returns.',
      icon: WifiOff,
    },
    {
      title: 'Pan-African Multi-Currency',
      description: 'Process in NGN, KES, GHS, ZAR, UGX, RWF, USD, GBP and EUR with automatic daily exchange rates and FX revaluation.',
      icon: Coins,
    },
    {
      title: 'Domestic Tax & Fiscal Readiness',
      description: 'Pre-configured compliance with FIRS (Nigeria), KRA eTIMS (Kenya), GRA (Ghana), SARS (South Africa), and Francophone OHADA.',
      icon: FileCheck2,
    },
    {
      title: 'Multi-Branch & Warehouse Depots',
      description: 'Monitor store inventory across multiple cities and border regions with transfer orders, approvals, and unified reporting.',
      icon: Layers,
    },
    {
      title: 'Universal POS Hardware Support',
      description: 'Works effortlessly with ESC/POS thermal receipt printers, USB/Bluetooth barcode scanners, electronic cash drawers, and touch screens.',
      icon: Printer,
    },
    {
      title: 'Built with Africa. Scalable Globally.',
      description: 'Architected for the realities of modern African trade corridors, diaspora businesses, and international expansion.',
      icon: Globe2,
    },
  ];

  return (
    <>
      {/* SECTION 19: VIDEO SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-[#091b34] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-500/10 border border-lime-300 dark:border-lime-500/30 text-lime-800 dark:text-lime-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Partner Voices & Community</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Meet the People Behind the MsmeBooks Partner Network
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Hear directly from chartered accountants, POS engineers, and business consultants who are building scalable advisory practices and elevating local enterprises across Africa with MsmeBooks.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-800 dark:text-lime-400 flex items-center justify-center font-bold">1</div>
                  <span>How certified accountants transition from hourly fees to recurring SaaS revenue</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-800 dark:text-lime-400 flex items-center justify-center font-bold">2</div>
                  <span>On-the-ground support for supermarket chains in Lagos, Nairobi, and Johannesburg</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-500/20 text-lime-800 dark:text-lime-400 flex items-center justify-center font-bold">3</div>
                  <span>The future of pan-African trade and digital fiscal compliance</span>
                </div>
              </div>
            </div>

            {/* Video Card Player Thumbnail */}
            <div className="lg:col-span-7">
              <div 
                onClick={() => setVideoModalOpen(true)}
                className="relative rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-700/80 shadow-xl dark:shadow-2xl group cursor-pointer aspect-video bg-slate-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=80"
                  alt="Meet the people behind MsmeBooks Partner Network"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                />

                {/* Video Play Button Overlay */}
                <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/20 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Partner Spotlight: Empowering 1,000+ African SMEs</div>
                    <div className="text-slate-400">Duration: 4 mins • Featuring Platinum & Gold Partners</div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-lime-500/20 text-lime-400 font-bold text-[11px] border border-lime-500/30">
                    Watch Video
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 20: AFRICAN-FIRST GLOBAL DESIGN */}
      <section className="py-20 bg-slate-100/70 dark:bg-[#07162b] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-lime-400 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Engineered for African Realities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built with Africa. Ready for the World.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Unlike generic Western accounting software built for always-on fiber and single-currency banks, MsmeBooks is purposefully built for the realities of African business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0b1e38] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 hover:border-lime-500 dark:hover:border-lime-400/80 transition-all hover:shadow-xl shadow-sm group"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lime-600 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-slate-950 transition-all mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-300 transition-colors mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Video Modal */}
      {videoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={() => setVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">MsmeBooks Global Partner Ecosystem Story</h3>
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="MsmeBooks Partner Network"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              Press Escape or click outside to return to directory.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
