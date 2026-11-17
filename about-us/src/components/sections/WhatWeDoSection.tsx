import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SolutionItem } from '../modals/SolutionDetailModal';
import { 
  Calculator, 
  ShoppingBag, 
  Boxes, 
  BarChart3, 
  GitFork, 
  Hotel, 
  Blocks, 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface WhatWeDoSectionProps {
  onSelectSolution: (sol: SolutionItem) => void;
}

export const WhatWeDoSection: React.FC<WhatWeDoSectionProps> = ({ onSelectSolution }) => {
  const { t } = useLanguage();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      case 'GitFork': return <GitFork className="w-5 h-5" />;
      case 'Hotel': return <Hotel className="w-5 h-5" />;
      case 'Blocks': return <Blocks className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      default: return <Calculator className="w-5 h-5" />;
    }
  };

  return (
    <section id="what-we-do" className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.wwd_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.wwd_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.wwd_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.wwd_desc}
          </p>
        </div>

        {/* 8 Features Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.wwd_solutions.map((solution, idx) => (
            <div
              key={solution.id}
              className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-[#0B4EA2]/50 dark:hover:border-[#38BDF8]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Icon & Counter Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0B4EA2] dark:text-[#38BDF8] flex items-center justify-center group-hover:bg-[#0B4EA2] group-hover:text-white transition-colors duration-200">
                    {getIcon(solution.iconName)}
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8] transition-colors mb-2">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {solution.description}
                </p>
              </div>

              {/* Action Button: Opens Detail Modal */}
              <button
                onClick={() => onSelectSolution(solution)}
                className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] group-hover:text-[#083770] dark:group-hover:text-white cursor-pointer"
              >
                <span>{t.wwd_btn_explore}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#84CC16] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
