import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Handshake, 
  Calculator, 
  FileText, 
  Cpu, 
  Boxes, 
  TrendingUp, 
  CreditCard, 
  GraduationCap, 
  Building2, 
  ArrowRight
} from 'lucide-react';

interface PartnerEcosystemSectionProps {
  onOpenPartnerModal: (category?: string) => void;
}

export const PartnerEcosystemSection: React.FC<PartnerEcosystemSectionProps> = ({
  onOpenPartnerModal,
}) => {
  const { t } = useLanguage();

  const getPartnerIcon = (name: string) => {
    switch (name) {
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      default: return <Handshake className="w-5 h-5" />;
    }
  };

  return (
    <section id="partners" className="py-16 md:py-24 bg-[#0B4EA2] dark:bg-black text-white relative overflow-hidden border-y border-[#0B4EA2] dark:border-zinc-900 transition-colors duration-200">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-400/10 dark:bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-lime-400 uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.partners_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            {t.partners_title_1}{' '}
            <span className="text-lime-400">{t.partners_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-blue-100 dark:text-slate-300">
            {t.partners_desc}
          </p>
        </div>

        {/* 8 Partner Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {t.partners_categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/10 dark:bg-zinc-950 hover:bg-white/15 dark:hover:bg-zinc-900 border border-white/15 dark:border-zinc-800 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between backdrop-blur-sm group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-zinc-900 text-lime-400 flex items-center justify-center mb-4 group-hover:bg-lime-400 group-hover:text-slate-900 transition-colors">
                  {getPartnerIcon(cat.iconName)}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                  {cat.role}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <span className="text-[11px] font-mono text-lime-300 block mb-2">
                  {cat.benefit}
                </span>
                <button
                  onClick={() => onOpenPartnerModal(cat.name)}
                  className="text-xs font-semibold text-white hover:text-lime-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.partners_apply_btn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-lime-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Call to Action */}
        <div className="bg-slate-950/40 dark:bg-zinc-950 border border-white/20 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-xl font-bold text-white">
              {t.partners_banner_title}
            </h4>
            <p className="text-xs text-blue-100 max-w-xl">
              {t.partners_banner_desc}
            </p>
          </div>

          <button
            onClick={() => onOpenPartnerModal()}
            className="px-7 py-3.5 bg-lime-400 text-slate-950 font-bold rounded-xl hover:bg-lime-300 transition-colors shadow-sm whitespace-nowrap text-sm cursor-pointer flex items-center gap-2"
          >
            <Handshake className="w-4 h-4 text-slate-900" />
            <span>{t.partners_cta}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
