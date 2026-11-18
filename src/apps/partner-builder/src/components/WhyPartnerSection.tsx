import React from 'react';
import { DollarSign, Layers, Award, Megaphone, GraduationCap, Headphones, Briefcase, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WhyPartnerSectionProps {
  onOpenApply: () => void;
}

export const WhyPartnerSection: React.FC<WhyPartnerSectionProps> = ({ onOpenApply }) => {
  const { t } = useLanguage();
  const benefits = [
    {
      icon: DollarSign,
      title: 'Recurring Revenue',
      desc: 'Earn 15% to 40% ongoing commissions on qualifying subscription payments from every customer you introduce, for as long as their subscription renews.',
      kpi: 'Up to 40% Recurring Share'
    },
    {
      icon: Layers,
      title: 'Expand Your Service Portfolio',
      desc: 'Deliver a complete suite of cloud accounting, point of sale (POS), multi-warehouse inventory, payroll, and industry-specific business management solutions.',
      kpi: 'All-in-One Business Suite'
    },
    {
      icon: Award,
      title: 'Grow Your Professional Reputation',
      desc: 'Become a recognised MsmeBooks partner with official metallic membership badges, digital certifications, and public directory visibility across Africa.',
      kpi: 'Official Accredited Badges'
    },
    {
      icon: Megaphone,
      title: 'Sales and Marketing Support',
      desc: 'Access co-branded brochures, localized pitch decks, promotional social graphics, product demo environments, and customizable campaign resources.',
      kpi: 'Turnkey Marketing Library'
    },
    {
      icon: GraduationCap,
      title: 'Training and Certification',
      desc: 'Master product configuration, legacy data migration, and sales demonstration strategies through the structured MsmeBooks Partner Academy.',
      kpi: 'Certified Implementation Badges'
    },
    {
      icon: Headphones,
      title: 'Dedicated Partner Support',
      desc: 'Receive rapid priority onboarding assistance, technical escalation channels, and guidance from a dedicated partner development manager.',
      kpi: 'Priority Escalation SLA'
    },
    {
      icon: Briefcase,
      title: 'Business Opportunities',
      desc: 'Generate substantial service income by billing clients directly for hardware sales, onsite implementation, training, consulting, and monthly bookkeeping.',
      kpi: '100% Retained Service Fees'
    },
    {
      icon: LayoutDashboard,
      title: 'Partner Management Dashboard',
      desc: 'Track customer accounts, lead statuses, recurring commissions, performance KPIs, payout histories, and accredited badges in one real-time dashboard.',
      kpi: 'Real-Time Transparency'
    }
  ];

  return (
    <section id="benefits" className="py-20 lg:py-28 bg-slate-50/60 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            {t('why.tag', 'Programme Advantages')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            {t('why.title', 'Why Partner with MsmeBooks?')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            {t('why.desc', 'Whether you are an independent accountant, an IT system integrator, or an established business advisory firm, MsmeBooks equips your team with everything required to scale recurring revenues.')}
          </p>
        </div>

        {/* 8 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0A2552] rounded-2xl p-6 border border-slate-200 dark:border-blue-800/60 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#061F4A] border border-blue-100 dark:border-blue-800 flex items-center justify-center text-[#0A3981] dark:text-[#8CE600] mb-5 group-hover:bg-[#0A3981] dark:group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/75 leading-relaxed mb-4">
                    {b.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-blue-900/60 flex items-center gap-2 text-xs font-bold text-[#0A3981] dark:text-[#8CE600]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE600]" />
                  <span>{b.kpi}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action anchor banner */}
        <div className="text-center">
          <button
            onClick={onOpenApply}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#0A3981] hover:bg-[#072c66] active:bg-[#051f47] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-md transition-all"
          >
            Apply to Become an Official Partner Today
          </button>
        </div>
      </div>
    </section>
  );
};
