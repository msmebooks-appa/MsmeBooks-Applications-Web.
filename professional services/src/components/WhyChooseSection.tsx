import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Globe2, 
  Video, 
  Receipt, 
  Cpu,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const benefits = [
    {
      title: 'One Business Ecosystem',
      description: 'Access cloud accounting software, POS, inventory management, and accredited professional human support all from a single unified platform.',
      icon: Layers,
      highlight: 'SaaS + Advisory',
    },
    {
      title: 'Qualified Professionals',
      description: 'Discover independent chartered accounting firms (ICAN, ACCA, CITN) and technology partners whose credentials and practice licenses have been thoroughly vetted.',
      icon: ShieldCheck,
      highlight: '100% Vetted',
    },
    {
      title: 'Pan-African Coverage',
      description: 'Seamlessly connect with local practitioners across Nigeria, Ghana, Kenya, South Africa, Rwanda, and international expansion hubs.',
      icon: Globe2,
      highlight: 'Cross-Border',
    },
    {
      title: 'Flexible Consultations',
      description: 'Choose the format that works for your schedule: virtual video meetings, telephone guidance, physical office visits, or on-site store deployments.',
      icon: Video,
      highlight: 'Online & On-Site',
    },
    {
      title: 'Transparent Service Options',
      description: 'Review clear scopes of work, deliverables, timelines, and indicative package fees up-front with zero surprise charges.',
      icon: Receipt,
      highlight: 'Clear Pricing',
    },
    {
      title: 'Technology-Enabled Support',
      description: 'Combine professional advisory directly with MsmeBooks automated bank feeds, barcode scanners, e-invoicing, and mobile executive dashboards.',
      icon: Cpu,
      highlight: 'Tech-Driven',
    },
  ];

  return (
    <section className="py-20 bg-[#F5F9FD]/80 dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
            Why Choose MsmeBooks Professional Services?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
            Designed to Make African Enterprises Audit-Ready and Profitable
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
            We bridge the gap between powerful business management technology and the verified professional human support SMEs need to thrive.
          </p>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0A1727] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#1464C8]/50 dark:hover:border-[#1464C8]/80"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-blue-300 flex items-center justify-center group-hover:bg-[#1464C8] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#B7E532]/25 dark:bg-[#B7E532]/20 text-[#102B4E] dark:text-[#B7E532] px-2.5 py-1 rounded-md">
                      {benefit.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#102B4E] dark:text-white group-hover:text-[#1464C8] dark:group-hover:text-[#B7E532] transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Visual Spotlight (African Business Consultant assisting SME Owner) */}
        <div className="bg-[#102B4E] dark:bg-[#0A1727] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 text-white">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#B7E532]">
              Real Human Expertise • Real Technology
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              "We don't just sell software. We provide the certified accountants and engineers to make it run flawlessly."
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Whether you are an independent pharmacy owner needing NAFFAC expiry controls or a 4-branch supermarket requiring consolidated ledger reports, our verified partners deliver tailored, compliant implementations right at your counter.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E532]" /> FIRS & Local Tax Compliance
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E532]" /> On-Site Barcode & POS Setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E532]" /> Dual Online & WhatsApp Booking
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[280px] bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=800&q=80"
              alt="African business consultant assisting an SME business owner"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#102B4E] dark:from-[#0A1727] via-transparent to-transparent lg:block hidden"></div>
          </div>
        </div>

      </div>
    </section>
  );
};
