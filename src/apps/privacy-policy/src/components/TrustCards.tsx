import React from 'react';
import { Eye, KeyRound, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface TrustCardsProps {
  onSelectCategory: (targetId: string) => void;
}

export const TrustCards: React.FC<TrustCardsProps> = ({ onSelectCategory }) => {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();

  const cards = [
    {
      id: "section-1",
      title: t('pillars.transparencyTitle', 'Transparency'),
      tagline: t('pillars.transparencyTag', 'Total Clarity in Processing'),
      description: t('pillars.transparencyDesc', 'Understand how information is collected, used and managed across MsmeBooks services.'),
      icon: Eye,
      targetSection: "section-1",
      metric: t('pillars.transparencyMetric', 'Explicit Lawful Bases'),
      action: t('pillars.transparencyAction', 'Read Collection Scope')
    },
    {
      id: "section-7",
      title: t('pillars.controlTitle', 'Data Control'),
      tagline: t('pillars.controlTag', 'Customer Autonomy & Portability'),
      description: t('pillars.controlDesc', 'Explore the choices and rights available to you regarding your personal information.'),
      icon: KeyRound,
      targetSection: "section-7",
      metric: `100% Exportable (${formatMoney(50_000_000_000, { compact: true })}+ Volume)`,
      action: t('pillars.controlAction', 'Review Ownership Terms')
    },
    {
      id: "section-9",
      title: t('pillars.securityTitle', 'Security'),
      tagline: t('pillars.securityTag', 'Defense-in-Depth Architecture'),
      description: t('pillars.securityDesc', 'Learn about the safeguards used to protect information entrusted to the platform.'),
      icon: ShieldAlert,
      targetSection: "section-9",
      metric: t('pillars.securityMetric', 'AES-256 & TLS 1.3'),
      action: t('pillars.securityAction', 'Inspect Security Controls')
    }
  ];

  return (
    <section id="security-pillars" className="py-12 bg-white dark:bg-[#0D1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1455C0] dark:text-[#5B95FF]">
            {t('pillars.kicker', 'Core Data Governance Principles')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172B4D] dark:text-white tracking-tight mt-1">
            {t('pillars.title', 'Built on Three Pillars of Trust')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {t('pillars.subtitle', 'Our privacy framework is engineered directly into our accounting, POS, inventory, and payroll systems.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative bg-[#F7FAFC] hover:bg-white dark:bg-[#111C30] dark:hover:bg-[#16233B] border border-slate-200 hover:border-[#1455C0]/40 dark:border-slate-800 dark:hover:border-[#1455C0]/60 rounded-xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-[#16233B] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#1455C0] dark:text-[#5B95FF] group-hover:border-[#1455C0] transition-colors shadow-2xs relative">
                      <Icon className="w-6 h-6" />
                      {/* Lemon-green dot indicator */}
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B8E62E] border-2 border-white dark:border-[#111C30] rounded-full" />
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                      {card.metric}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#1455C0] dark:text-[#5B95FF]">
                      {card.tagline}
                    </span>
                    <h3 className="text-lg font-bold text-[#172B4D] dark:text-white group-hover:text-[#1455C0] dark:group-hover:text-[#5B95FF] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      &ldquo;{card.description}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    onClick={() => onSelectCategory(card.targetSection)}
                    className="text-xs font-semibold text-[#1455C0] dark:text-[#5B95FF] hover:text-[#0f449e] dark:hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{card.action}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#5B95FF]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
