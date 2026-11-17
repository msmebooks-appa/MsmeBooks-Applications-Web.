import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Building2, Globe2, Activity, TrendingUp } from 'lucide-react';

interface MetricConfig {
  id: string;
  target: number;
  decimals?: number;
  suffix: string;
  progressTarget: number;
  label: string;
  sublabel: string;
  trend: string;
  accent: 'blue' | 'lime';
  icon: React.ReactNode;
}

export const ImpactCountersSection: React.FC = () => {
  const { t } = useLanguage();
  const { currentCurrency, formatCompactFromNGN } = useCurrency();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1 eased progress

  const metrics: MetricConfig[] = [
    {
      id: 'businesses',
      target: 12450,
      decimals: 0,
      suffix: '+',
      progressTarget: 86,
      label: t.counters_businesses_label,
      sublabel: t.counters_businesses_sub,
      trend: t.counters_businesses_trend,
      accent: 'blue',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'countries',
      target: 18,
      decimals: 0,
      suffix: '+',
      progressTarget: 74,
      label: t.counters_countries_label,
      sublabel: t.counters_countries_sub,
      trend: t.counters_countries_trend,
      accent: 'lime',
      icon: <Globe2 className="w-5 h-5" />,
    },
    {
      id: 'transactions',
      target: 4.8,
      decimals: 1,
      suffix: 'M+',
      progressTarget: 94,
      label: t.counters_transactions_label,
      sublabel: t.counters_transactions_sub,
      trend: t.counters_transactions_trend,
      accent: 'blue',
      icon: <Activity className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasAnimated) return;

    const triggerAnimation = () => {
      setHasAnimated(true);

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setProgress(1);
        return;
      }

      const durationMs = 1800;
      const startTime = performance.now();

      let frameId = 0;
      const step = (now: number) => {
        const elapsed = now - startTime;
        const rawRatio = Math.min(1, elapsed / durationMs);
        // Ease-out cubic curve for crisp, natural deceleration
        const eased = 1 - Math.pow(1 - rawRatio, 3);
        setProgress(eased);

        if (rawRatio < 1) {
          frameId = requestAnimationFrame(step);
        }
      };

      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    };

    if (typeof IntersectionObserver === 'undefined') {
      triggerAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const formatAnimatedValue = (target: number, decimals = 0, suffix: string) => {
    const current = target * progress;
    if (decimals > 0) {
      return `${current.toFixed(decimals)}${suffix}`;
    }
    return `${Math.round(current).toLocaleString()}${suffix}`;
  };

  return (
    <section
      id="impact-metrics"
      ref={sectionRef}
      aria-label={t.counters_eyebrow}
      className="py-10 md:py-14 bg-slate-50/80 dark:bg-black border-t border-slate-200/80 dark:border-zinc-900 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Eyebrow Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
            <span>{t.counters_eyebrow}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200/90 dark:border-zinc-800 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84CC16]" />
            </span>
            <span>{t.counters_live_badge}</span>
          </div>
        </div>

        {/* 3 Dynamic Counter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const isBlue = metric.accent === 'blue';
            const barWidth = Math.max(4, Math.round(metric.progressTarget * progress));

            return (
              <div
                key={metric.id}
                className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-[#0B4EA2]/50 dark:hover:border-[#38BDF8]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Icon & Data Trend Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                        isBlue
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0B4EA2] dark:text-[#38BDF8] group-hover:bg-[#0B4EA2] group-hover:text-white'
                          : 'bg-lime-50 dark:bg-lime-950/60 text-[#65A30D] dark:text-[#84CC16] group-hover:bg-[#84CC16] group-hover:text-slate-950'
                      }`}
                    >
                      {metric.icon}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-[#65A30D] dark:text-[#84CC16]">
                      <TrendingUp className="w-3 h-3" />
                      <span>{metric.trend}</span>
                    </span>
                  </div>

                  {/* Animated Counter Number */}
                  <div
                    className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight ${
                      isBlue
                        ? 'text-[#0B4EA2] dark:text-white'
                        : 'text-slate-900 dark:text-[#84CC16]'
                    }`}
                  >
                    {formatAnimatedValue(metric.target, metric.decimals, metric.suffix)}
                  </div>

                  {/* Label & Subtext */}
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {metric.label}
                    </h3>
                    {metric.id === 'transactions' && (
                      <span className="text-[11px] font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded-md tabular-nums">
                        {formatCompactFromNGN(285000000000)}+ ({currentCurrency.code})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {metric.sublabel}
                  </p>
                </div>

                {/* Data-Driven Animated Bar */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-none ${
                        isBlue
                          ? 'bg-gradient-to-r from-[#0B4EA2] to-[#38BDF8]'
                          : 'bg-gradient-to-r from-[#65A30D] to-[#84CC16]'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
