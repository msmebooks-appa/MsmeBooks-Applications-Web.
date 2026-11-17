import React from 'react';
import { 
  Users, 
  Globe2, 
  Building2, 
  Briefcase, 
  Clock, 
} from 'lucide-react';
import { SuccessImpactDashboard } from './SuccessImpactDashboard';

export const TrustStats: React.FC = () => {
  const stats = [
    {
      value: '500+',
      label: 'Certified Partners',
      subtext: 'Across Africa & global hubs',
      icon: Users,
    },
    {
      value: '30+',
      label: 'Countries Active',
      subtext: 'Pan-African & diaspora reach',
      icon: Globe2,
    },
    {
      value: '1,000+',
      label: 'Businesses Supported',
      subtext: 'From micro shops to enterprises',
      icon: Building2,
    },
    {
      value: '50+',
      label: 'Business Industries',
      subtext: 'Retail, FMCG, pharma, hospitality',
      icon: Briefcase,
    },
    {
      value: '24/7',
      label: 'Digital Platform',
      subtext: 'Cloud sync & offline resilience',
      icon: Clock,
    },
  ];

  return (
    <div id="trust-stats" className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#0c1f38]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 shadow-lg shadow-blue-950/5 hover:border-lime-500/50 hover:shadow-lime-500/10 transition-all group ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-blue-300 group-hover:bg-lime-500/10 group-hover:text-lime-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="w-2 h-2 rounded-full bg-lime-400 group-hover:scale-125 transition-transform"></span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  <span className="text-blue-900 dark:text-blue-200 group-hover:text-lime-500 dark:group-hover:text-lime-400 transition-colors">
                    {item.value}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {item.label}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <SuccessImpactDashboard />
    </div>
  );
};
