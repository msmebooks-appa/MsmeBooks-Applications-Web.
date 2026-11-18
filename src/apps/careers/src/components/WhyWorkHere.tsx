import React from 'react';
import {
  Globe,
  Cpu,
  TrendingUp,
  Users2,
  Rocket,
  HeartHandshake,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhyWorkHere: React.FC = () => {
  const { tr } = useLanguage();

  const benefits = [
    {
      icon: <Globe className="w-6 h-6 text-[#0066CC] dark:text-[#38BDF8]" />,
      title: tr.whyWorkHere.benefit1Title,
      description: tr.whyWorkHere.benefit1Desc,
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#0066CC] dark:text-[#38BDF8]" />,
      title: tr.whyWorkHere.benefit2Title,
      description: tr.whyWorkHere.benefit2Desc,
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#0066CC] dark:text-[#38BDF8]" />,
      title: tr.whyWorkHere.benefit3Title,
      description: tr.whyWorkHere.benefit3Desc,
    },
    {
      icon: <Users2 className="w-6 h-6 text-[#0066CC] dark:text-[#38BDF8]" />,
      title: tr.whyWorkHere.benefit4Title,
      description: tr.whyWorkHere.benefit4Desc,
    },
    {
      icon: <Rocket className="w-6 h-6 text-[#0066CC] dark:text-[#38BDF8]" />,
      title: tr.whyWorkHere.benefit5Title,
      description: tr.whyWorkHere.benefit5Desc,
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#0066CC] dark:text-[#38BDF8]" />,
      title: tr.whyWorkHere.benefit6Title,
      description: tr.whyWorkHere.benefit6Desc,
    },
  ];

  return (
    <section id="why-msmebooks" className="py-20 bg-slate-50 dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
            <span>{tr.whyWorkHere.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14243A] dark:text-white tracking-tight">
            {tr.whyWorkHere.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-4 leading-relaxed font-normal">
            {tr.whyWorkHere.desc}
          </p>
        </div>

        {/* 6 Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((card, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#131D35] p-7 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 hover:border-[#0066CC]/50 dark:hover:border-[#38BDF8]/60 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/80 flex items-center justify-center mb-5 shrink-0">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-[#14243A] dark:text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
