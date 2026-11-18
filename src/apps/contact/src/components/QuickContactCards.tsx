import React from 'react';
import { TrendingUp, Headset, Handshake, Calendar, ArrowRight } from 'lucide-react';
import { EnquiryType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuickContactCardsProps {
  onSelectOption: (enquiryType: EnquiryType) => void;
  onOpenDemo: () => void;
}

export const QuickContactCards: React.FC<QuickContactCardsProps> = ({
  onSelectOption,
  onOpenDemo,
}) => {
  const { tDict } = useLanguage();

  const cards = [
    {
      id: 'sales',
      icon: TrendingUp,
      title: tDict.quick.salesTitle,
      description: tDict.quick.salesDesc,
      cta: tDict.quick.salesCta,
      enquiryType: 'Sales & Pricing' as EnquiryType,
      isDemo: false,
    },
    {
      id: 'support',
      icon: Headset,
      title: tDict.quick.supportTitle,
      description: tDict.quick.supportDesc,
      cta: tDict.quick.supportCta,
      enquiryType: 'Technical Support' as EnquiryType,
      isDemo: false,
    },
    {
      id: 'partners',
      icon: Handshake,
      title: tDict.quick.partnersTitle,
      description: tDict.quick.partnersDesc,
      cta: tDict.quick.partnersCta,
      enquiryType: 'Reseller / Distributor Partnership' as EnquiryType,
      isDemo: false,
    },
    {
      id: 'demo',
      icon: Calendar,
      title: tDict.quick.demoTitle,
      description: tDict.quick.demoDesc,
      cta: tDict.quick.demoCta,
      enquiryType: 'Request Product Demo' as EnquiryType,
      isDemo: true,
    },
  ];

  return (
    <section id="quick-options" className="py-12 bg-slate-50/80 dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold text-[#70C038] dark:text-[#a1e670] uppercase tracking-wider mb-2">
            {tDict.quick.badge}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight">
            {tDict.quick.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {tDict.quick.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group flex flex-col justify-between bg-white dark:bg-[#131E35] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-[#0B3B82]/40 dark:hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Top subtle highlight line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B3B82] to-[#70C038] dark:from-[#1D4ED8] dark:to-[#70C038] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Lemon-green accent icon container */}
                  <div className="w-12 h-12 rounded-lg bg-[#f2f9eb] dark:bg-lime-950/50 border border-[#d2edaa] dark:border-lime-900 flex items-center justify-center mb-5 group-hover:scale-105 transition-all">
                    <Icon className="w-6 h-6 text-[#70C038]" />
                  </div>

                  {/* Heading */}
                  <h3 className="text-lg font-bold text-[#0B3B82] dark:text-white group-hover:text-[#082d64] dark:group-hover:text-[#93C5FD] transition-colors leading-snug mb-3">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* CTA Action button */}
                <button
                  onClick={() => {
                    if (card.isDemo) {
                      onOpenDemo();
                    } else {
                      onSelectOption(card.enquiryType);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] bg-slate-50 dark:bg-[#0B1120] hover:bg-[#0B3B82] hover:text-white dark:hover:bg-[#1D4ED8] dark:hover:text-white border border-slate-200 dark:border-slate-700 group-hover:border-[#0B3B82] dark:group-hover:border-blue-500 transition-all flex items-center justify-between mt-auto"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#70C038] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
