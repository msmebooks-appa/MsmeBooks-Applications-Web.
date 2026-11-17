import React, { useEffect, useState, useRef } from 'react';
import { Building2, TrendingUp, Clock, Wifi, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface MetricItem {
  id: string;
  targetNumber: number;
  suffix: string;
  decimals?: number;
  formatAsCurrency?: boolean;
  currencyNgnBase?: number; // In NGN for conversion
  icon: React.ElementType;
  labelEn: string;
  labelFr: string;
  labelPt: string;
  labelEs: string;
  subEn: string;
  subFr: string;
  subPt: string;
  subEs: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'businesses',
    targetNumber: 15400,
    suffix: '+',
    decimals: 0,
    icon: Building2,
    labelEn: 'Businesses Empowered',
    labelFr: 'Entreprises Équipées',
    labelPt: 'Empresas Capacitadas',
    labelEs: 'Empresas Gestionadas',
    subEn: 'Across 28 African nations & diaspora',
    subFr: 'Dans 28 nations africaines et diaspora',
    subPt: 'Em 28 nações africanas e diáspora',
    subEs: 'En 28 naciones africanas y diáspora',
  },
  {
    id: 'transactions',
    targetNumber: 64200000000, // ₦64.2B+
    suffix: '+',
    formatAsCurrency: true,
    currencyNgnBase: 64200000000,
    icon: TrendingUp,
    labelEn: 'Transactions Processed',
    labelFr: 'Transactions Traitées',
    labelPt: 'Transações Processadas',
    labelEs: 'Transacciones Procesadas',
    subEn: 'Zero calculation errors or tax penalties',
    subFr: 'Zéro erreur de calcul ou pénalité fiscale',
    subPt: 'Zero erros de cálculo ou multas fiscais',
    subEs: 'Cero errores de cálculo o multas fiscales',
  },
  {
    id: 'hours',
    targetNumber: 820000,
    suffix: '+ hrs',
    decimals: 0,
    icon: Clock,
    labelEn: 'Accounting Hours Saved',
    labelFr: 'Heures Comptables Économisées',
    labelPt: 'Horas Contábeis Poupadas',
    labelEs: 'Horas Contables Ahorradas',
    subEn: 'Automated bank feeds & e-invoicing',
    subFr: 'Rapprochements bancaires et factures automatisés',
    subPt: 'Feeds bancários e faturamento automatizados',
    subEs: 'Conciliación bancaria y facturas automatizadas',
  },
  {
    id: 'uptime',
    targetNumber: 99.98,
    suffix: '%',
    decimals: 2,
    icon: Wifi,
    labelEn: 'Cloud & Offline POS Uptime',
    labelFr: 'Disponibilité Cloud & POS Hors-Ligne',
    labelPt: 'Disponibilidade Cloud e POS Offline',
    labelEs: 'Disponibilidad Cloud y POS Offline',
    subEn: 'Dual-region failover & SQLite sync',
    subFr: 'Bascule double-région et synchronisation SQLite',
    subPt: 'Failover de duas regiões e sincronização SQLite',
    subEs: 'Conmutación por error y sincronización SQLite',
  },
];

export const ImpactCounter: React.FC = () => {
  const { format, currency, activeCurrency } = useCurrency();
  const { language } = useLanguage();
  const [hasStarted, setHasStarted] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    businesses: 0,
    transactions: 0,
    hours: 0,
    uptime: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1800; // 1.8 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const nextCounts: { [key: string]: number } = {};
      METRICS.forEach((m) => {
        nextCounts[m.id] = m.targetNumber * easedProgress;
      });

      setCounts(nextCounts);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted]);

  const formatMetricValue = (metric: MetricItem, value: number) => {
    if (metric.formatAsCurrency && metric.currencyNgnBase) {
      // For currency, if converted amount is large, use compact format (e.g. ₦64.2B or $42.8M)
      const currentVal = (metric.currencyNgnBase * (value / metric.targetNumber));
      return format(currentVal, { compact: true });
    }

    if (metric.decimals && metric.decimals > 0) {
      return value.toFixed(metric.decimals) + metric.suffix;
    }

    return Math.floor(value).toLocaleString() + metric.suffix;
  };

  const getLabel = (m: MetricItem) => {
    if (language === 'fr') return m.labelFr;
    if (language === 'pt') return m.labelPt;
    if (language === 'es') return m.labelEs;
    return m.labelEn;
  };

  const getSub = (m: MetricItem) => {
    if (language === 'fr') return m.subFr;
    if (language === 'pt') return m.subPt;
    if (language === 'es') return m.subEs;
    return m.subEn;
  };

  return (
    <section
      ref={containerRef}
      className="py-12 bg-white dark:bg-[#070F1B] border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-950/70 text-[#4D7C0F] dark:text-[#84CC16] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {language === 'fr'
                ? 'Prouvé à Grande Échelle Africaine'
                : language === 'pt'
                ? 'Comprovado na Escala Africana'
                : language === 'es'
                ? 'Comprobado a Gran Escala Africana'
                : 'Proven African Scale & Reliability'}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0B192C] dark:text-white tracking-tight">
            {language === 'fr'
              ? 'Des Résultats Concrets Qui Génèrent la Croissance'
              : language === 'pt'
              ? 'Impacto Real Que Impulsiona Negócios'
              : language === 'es'
              ? 'Impacto Real Que Impulsa el Crecimiento'
              : 'Real Impact Powering Real Business Growth'}
          </h3>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            const currentVal = counts[metric.id] || 0;
            const displayVal = formatMetricValue(metric, currentVal);

            return (
              <div
                key={metric.id}
                className="relative overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-[#0D1C30]/80 p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#0A4FD5] dark:hover:border-blue-500 transition-all hover:shadow-lg group"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 via-lime-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#070F1B] border border-slate-200 dark:border-slate-800 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Verified
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-[#0B192C] dark:text-white tracking-tight tabular-nums mb-1">
                  {displayVal}
                </div>

                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {getLabel(metric)}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {getSub(metric)}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
