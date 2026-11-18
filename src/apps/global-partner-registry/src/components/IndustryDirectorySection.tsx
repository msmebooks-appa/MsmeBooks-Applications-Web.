import React from 'react';
import { 
  ArrowRight, 
  Store, 
  ShoppingBasket, 
  Utensils, 
  Building2, 
  Shirt, 
  Smartphone, 
  Pill, 
  HeartPulse, 
  HardHat, 
  Wrench, 
  Truck, 
  Factory, 
  Sparkles, 
  Home, 
  Briefcase, 
  Tractor, 
  Globe, 
  GraduationCap 
} from 'lucide-react';
import { INDUSTRIES_LIST } from '../data/partnersData';

interface IndustryDirectorySectionProps {
  onSelectIndustry: (industryName: string) => void;
}

export const IndustryDirectorySection: React.FC<IndustryDirectorySectionProps> = ({
  onSelectIndustry,
}) => {
  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Store': return Store;
      case 'ShoppingBasket': return ShoppingBasket;
      case 'Utensils': return Utensils;
      case 'Building2': return Building2;
      case 'Shirt': return Shirt;
      case 'Smartphone': return Smartphone;
      case 'Pill': return Pill;
      case 'HeartPulse': return HeartPulse;
      case 'HardHat': return HardHat;
      case 'Wrench': return Wrench;
      case 'Truck': return Truck;
      case 'Factory': return Factory;
      case 'Sparkles': return Sparkles;
      case 'Home': return Home;
      case 'Briefcase': return Briefcase;
      case 'Tractor': return Tractor;
      case 'Globe': return Globe;
      case 'GraduationCap': return GraduationCap;
      default: return Briefcase;
    }
  };

  return (
    <section id="industries" className="py-20 bg-slate-100/70 dark:bg-[#091b34] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-blue-700 dark:text-lime-400 mb-2">
              <span>Industry-Specialized Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find Partners by Industry
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Work with implementation partners who deeply understand your trade regulations, supply chain workflows, and customer expectations.
            </p>
          </div>

          <button
            onClick={() => onSelectIndustry('')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-lime-400 hover:text-lime-600 dark:hover:text-lime-300 self-start sm:self-auto bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lime-500 dark:hover:border-lime-500/40 shadow-sm transition-all"
          >
            <span>Explore All Industries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 18 Visual Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INDUSTRIES_LIST.map((ind) => {
            const Icon = getIndustryIcon(ind.icon);
            return (
              <button
                key={ind.id}
                onClick={() => onSelectIndustry(ind.name)}
                className="group relative h-64 rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-700/80 hover:border-lime-500 dark:hover:border-lime-400 shadow-lg text-left transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/10 focus:outline-none"
              >
                {/* Background Image with Zoom on Hover */}
                <img
                  src={ind.image}
                  alt={ind.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 brightness-75"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Blue Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-slate-900/30 dark:from-[#061426] dark:via-[#0c2340]/80 dark:to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>

                {/* Card Content */}
                <div className="relative h-full p-4 flex flex-col justify-between z-10">
                  
                  {/* Top: Lemon-Green Icon on Hover */}
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-lime-500 group-hover:text-slate-950 group-hover:border-lime-400 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-lime-400 border border-slate-700">
                      {ind.count}
                    </span>
                  </div>

                  {/* Bottom: Title and Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors leading-snug">
                      {ind.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 opacity-90 leading-tight">
                      {ind.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Partners</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
