import React from 'react';
import { 
  MapPin, 
  Zap, 
  Compass, 
  GraduationCap, 
  HeadphonesIcon, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

interface WhyWorkWithPartnerSectionProps {
  onOpenDirectory: () => void;
  onOpenBecomePartner: () => void;
}

export const WhyWorkWithPartnerSection: React.FC<WhyWorkWithPartnerSectionProps> = ({
  onOpenDirectory,
  onOpenBecomePartner,
}) => {
  const benefits = [
    {
      title: 'Local Expertise',
      description: 'Work with certified professionals who understand your domestic tax requirements, local payment gateways, and market landscape.',
      icon: MapPin,
    },
    {
      title: 'Faster Implementation',
      description: 'Get immediate help importing historical spreadsheets, setting up POS receipt printers, and structuring your chart of accounts.',
      icon: Zap,
    },
    {
      title: 'Business-Specific Guidance',
      description: 'Receive custom blueprints and workflows tailored directly to your supermarket, restaurant, pharmacy, or wholesale distribution model.',
      icon: Compass,
    },
    {
      title: 'Practical Staff Training',
      description: 'Empower cashiers, store keepers, accountants, and branch managers with hands-on training to ensure rapid daily adoption.',
      icon: GraduationCap,
    },
    {
      title: 'Ongoing Operational Support',
      description: 'Benefit from dedicated phone, chat, and on-site support to troubleshoot day-to-day queries and maintain clean financial records.',
      icon: HeadphonesIcon,
    },
    {
      title: 'Continuous Growth Support',
      description: 'Easily scale from a single shop to multi-warehouse and cross-border branch networks with expert technological backing.',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-20 bg-slate-100/70 dark:bg-[#07162a] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-lime-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
            <span>The Partner Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Work With a MsmeBooks Partner?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Maximizing return on your business software investment requires more than code—it requires experienced local human expertise on the ground.
          </p>
        </div>

        {/* 6 Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0b1e38] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 hover:border-lime-500 dark:hover:border-lime-400/80 transition-all hover:shadow-xl hover:shadow-lime-500/5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:bg-lime-500 group-hover:text-slate-950 transition-all mb-4 border border-slate-200 dark:border-slate-700">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-300 transition-colors mb-2">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors duration-300">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Ready to modernize your accounting and point of sale?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse 500+ verified partner organizations across Africa and worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenDirectory}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Find a Partner
            </button>
            <button
              onClick={onOpenBecomePartner}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition-all"
            >
              Become a Partner
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
