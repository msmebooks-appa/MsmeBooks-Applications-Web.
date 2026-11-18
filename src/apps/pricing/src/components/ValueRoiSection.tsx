import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, ShieldAlert, Eye, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ValueRoiSection: React.FC<{ onOpenTrial: () => void }> = ({ onOpenTrial }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax vertical drifts to create multi-plane depth as user scrolls through
  const yOffset0 = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const yOffset1 = useTransform(scrollYProgress, [0, 1], [-15, 20]);
  const yOffset2 = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const yOffset3 = useTransform(scrollYProgress, [0, 1], [-10, 25]);
  const cardOffsets = [yOffset0, yOffset1, yOffset2, yOffset3];

  const values = [
    {
      icon: Clock,
      title: t.valueRoi.stat1Label,
      description: t.valueRoi.stat1Desc,
      metric: t.valueRoi.stat1Number,
      metricLabel: 'Weekly per branch on manual ledgers & reconciliation',
      tag: 'Automation',
    },
    {
      icon: ShieldAlert,
      title: t.valueRoi.stat2Label,
      description: t.valueRoi.stat2Desc,
      metric: t.valueRoi.stat2Number,
      metricLabel: 'Eliminate duplicate cash entries and missing receipt books',
      tag: 'Zero Discrepancy',
    },
    {
      icon: Eye,
      title: t.valueRoi.stat3Label,
      description: t.valueRoi.stat3Desc,
      metric: t.valueRoi.stat3Number,
      metricLabel: 'Instant P&L from your mobile phone wherever you are',
      tag: 'Total Control',
    },
    {
      icon: TrendingUp,
      title: t.valueRoi.stat4Label,
      description: t.valueRoi.stat4Desc,
      metric: t.valueRoi.stat4Number,
      metricLabel: 'Add new outlets and warehouse depots in minutes',
      tag: 'Pan-African Scale',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-[#070F1B] dark:via-[#091525] dark:to-[#070F1B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/80 text-lime-900 dark:text-lime-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            {t.valueRoi.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {t.valueRoi.title}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t.valueRoi.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid with Staggered Scroll Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                style={{ y: cardOffsets[idx] }}
                transition={{ type: 'spring', damping: 20 }}
                className="group relative bg-white dark:bg-[#0B192C] p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center group-hover:bg-[#0A4FD5] group-hover:text-white transition-colors shadow-xs"
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0B192C] dark:text-white tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-lg font-black text-[#0A4FD5] dark:text-blue-400">
                    {item.metric}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.metricLabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner callout */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onOpenTrial}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0A4FD5] dark:text-blue-400 hover:text-[#07389B] dark:hover:text-blue-300 bg-blue-50 dark:bg-[#0D1C30] hover:bg-blue-100/80 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 px-6 py-3 rounded-xl transition-all cursor-pointer"
          >
            <span>Calculate how much your business will save with MsmeBooks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
