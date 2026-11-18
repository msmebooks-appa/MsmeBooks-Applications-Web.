import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Database, RefreshCw, FileCheck, Lock, CheckCircle2 } from 'lucide-react';

export const TrustSecuritySection: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Database className="w-5 h-5 text-[#0B4EA2] dark:text-[#38BDF8]" />;
      case 1: return <ShieldCheck className="w-5 h-5 text-[#65A30D] dark:text-lime-400" />;
      case 2: return <FileCheck className="w-5 h-5 text-[#0B4EA2] dark:text-[#38BDF8]" />;
      case 3: return <RefreshCw className="w-5 h-5 text-[#65A30D] dark:text-lime-400" />;
      default: return <Database className="w-5 h-5 text-[#0B4EA2] dark:text-[#38BDF8]" />;
    }
  };

  return (
    <section id="trust-security" className="py-16 md:py-24 bg-slate-50/70 dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.trust_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.trust_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.trust_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.trust_desc}
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {t.trust_pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-950 rounded-2xl p-7 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center">
                    {getIcon(idx)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {pillar.title}
                    </h3>
                    <span className="text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8]">
                      {pillar.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  {pillar.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  {pillar.principles.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D] dark:text-lime-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency Banner & Document Links */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#0B4EA2] dark:text-[#38BDF8]" />
            <span>
              {t.trust_banner_text}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8]">
            <a href="#privacy" className="hover:underline">{t.trust_link_privacy}</a>
            <span>·</span>
            <a href="#terms" className="hover:underline">{t.trust_link_terms}</a>
            <span>·</span>
            <a href="#security-overview" className="hover:underline">{t.trust_link_security}</a>
          </div>
        </div>

      </div>
    </section>
  );
};
