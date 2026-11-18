import React from 'react';
import { 
  WHY_PARTNER_BENEFITS 
} from '../data/partnerData';
import { 
  Repeat, 
  Globe2, 
  Cpu, 
  Layers, 
  Headphones, 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WhyPartnerProps {
  onOpenApplyModal: () => void;
}

export const WhyPartner: React.FC<WhyPartnerProps> = ({ onOpenApplyModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Repeat':
        return <Repeat className="w-6 h-6 text-[#65A30D]" />;
      case 'Globe2':
        return <Globe2 className="w-6 h-6 text-[#0F4C81]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#0284C7]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-indigo-600" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-emerald-600" />;
      default:
        return <TrendingUp className="w-6 h-6 text-[#84CC16]" />;
    }
  };

  return (
    <section id="why-partner" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#65A30D]" />
            Strategic Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Why Partner With MsmeBooks?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            More than just business software. MsmeBooks is a sustainable African fintech engine that empowers your advisory practice, IT firm, or agency to build lasting equity with every MSME you introduce.
          </p>
        </div>

        {/* 6-Card Benefit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_PARTNER_BENEFITS.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-2xl p-7 bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#0F4C81]/30 shadow-xs hover:shadow-xl hover:shadow-[#0F4C81]/8 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Highlight Pill */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-white group-hover:bg-blue-50/50 border border-slate-200 flex items-center justify-center shadow-xs transition-colors">
                    {getIcon(card.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-[#0F4C81] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {card.metricLabel}
                  </span>
                </div>

                {/* Card Title (Mandated by prompt) */}
                <h3 className="text-xl font-bold text-[#0A192F] group-hover:text-[#0F4C81] transition-colors mb-3 font-display">
                  {card.title}
                </h3>

                {/* Card Description (Mandated by prompt) */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Lemon-green highlight badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#3F6212]">
                <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                <span>{card.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action bar */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenApplyModal}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0F4C81] to-[#1E40AF] hover:from-[#0A3861] hover:to-[#172554] shadow-lg shadow-[#0F4C81]/25 transition-all"
          >
            <span>Claim Your Strategic Partner Territory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
