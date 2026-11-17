import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Coffee, 
  Cpu, 
  Factory, 
  Activity, 
  Building, 
  Heart, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Truck
} from 'lucide-react';
import { IndustryItem, CurrencyCode } from '../types';
import { INDUSTRIES } from '../data/mockData';

interface IndustryOutsourcingProps {
  onCustomizePlanForIndustry: (industry: IndustryItem) => void;
}

export const IndustryOutsourcing: React.FC<IndustryOutsourcingProps> = ({
  onCustomizePlanForIndustry,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryItem>(INDUSTRIES[0]);

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart': return <ShoppingCart className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Factory': return <Factory className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Building': return <Building className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="industries" className="py-20 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/80 border border-lime-300 dark:border-lime-800 text-lime-900 dark:text-lime-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-lime-700 dark:text-lime-400" />
            Industry-Specific Outsourcing Blueprints
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            Engineered for Your Industry's Unique Operational Realities
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A supermarket faces vastly different cash reconciliations than a SaaS startup or a construction contractor. Discover the tailored outsourcing stack built for your sector.
          </p>
        </div>

        {/* Industry Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedIndustry.id === ind.id
                  ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-lg shadow-blue-900/25 ring-2 ring-lime-400'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{getIndustryIcon(ind.iconName)}</span>
              <span>{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Deep Industry Blueprint Card */}
        <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Challenges & Solutions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-400 bg-lime-950/80 px-2.5 py-1 rounded border border-lime-800">
                  Sector Blueprint
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-white">
                  {selectedIndustry.name}
                </h3>
              </div>

              {/* Challenges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Common Operational Challenges in this Sector:</span>
                </div>
                <div className="space-y-2">
                  {selectedIndustry.challenges.map((ch, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Services */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tailored MsmeBooks Outsourcing Stack:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedIndustry.recommendedServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-blue-950/60 p-2.5 rounded-lg border border-blue-900/60 font-medium">
                      <span className="text-lime-400 font-bold">✓</span>
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Deliverables, Integrations & CTA */}
            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-6">
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Expected Client Deliverables
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedIndustry.expectedDeliverables.map((del, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
                      <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Integrations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Seamless Software & Hardware Integrations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIndustry.softwareIntegrations.map((sw, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 text-[11px] font-semibold text-blue-300 rounded-md border border-slate-700">
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Package Banner */}
              <div className="p-3.5 bg-blue-900/40 rounded-xl border border-blue-700/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Recommended Package</div>
                  <div className="text-sm font-extrabold text-lime-400">{selectedIndustry.suggestedPackage}</div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onCustomizePlanForIndustry(selectedIndustry)}
                className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-lime-400/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Customize Outsourcing for {selectedIndustry.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
