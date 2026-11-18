import React from 'react';
import { Briefcase, Handshake, Check, ArrowRight, Coins } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface SalesAndPartnershipsProps {
  onSalesClick: () => void;
  onPartnerClick: () => void;
}

export const SalesAndPartnerships: React.FC<SalesAndPartnershipsProps> = ({
  onSalesClick,
  onPartnerClick,
}) => {
  const { formatAmount } = useCurrency();
  const { tDict } = useLanguage();
  return (
    <section id="partnerships" className="py-16 lg:py-24 bg-[#f8fafc] dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold text-[#70C038] dark:text-[#a1e670] uppercase tracking-wider mb-2">
            {tDict.partnerships.badge}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight">
            {tDict.partnerships.title}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tDict.partnerships.subtitle}
          </p>
        </div>

        {/* Feature Visual Banner: African Business Executives Collaborating */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 mb-12 bg-slate-900 aspect-[16/7] max-h-96">
          <img
            src="/src/assets/images/african_executives_partnership_1792327888590.jpg"
            alt="African business executives in boardroom agreeing on partnership"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B82]/90 via-[#0B3B82]/60 to-transparent flex items-center">
            <div className="max-w-lg p-6 sm:p-10 text-white">
              <span className="text-xs font-bold text-[#a1e670] uppercase tracking-wider">
                PAN-AFRICAN ECOSYSTEM
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mt-1 text-white leading-tight">
                Empowering Business Leaders and Trusted Advisors
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                Connect directly with our corporate solutions leads to explore custom enterprise deployments and certified agency partner programs.
              </p>
            </div>
          </div>
        </div>

        {/* Split Layout as required in Section 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left Column — Sales & Enterprise Solutions */}
          <div className="bg-white dark:bg-[#131E35] rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#0B3B82]/40 dark:hover:border-blue-500/40 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0B3B82]" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f0f6ff] dark:bg-blue-950/60 border border-[#cbe0fb] dark:border-blue-900 flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-[#0B3B82] dark:text-[#93C5FD]" />
              </div>

              <span className="text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] uppercase tracking-wider">
                Sales & Enterprise
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B3B82] dark:text-white mt-1 mb-3">
                Find the Right Solution for Your Business.
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Whether you're managing a retail store, restaurant, hotel, supermarket, distribution business, or multiple business locations, our team can help you explore the right MsmeBooks solution.
              </p>

              {/* Feature Highlights with dynamic currency values */}
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>
                    Scalable cloud subscriptions starting from{' '}
                    <strong className="text-[#0B3B82] dark:text-[#93C5FD] font-mono font-bold tabular-nums">
                      {formatAmount(79)}/month
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Centralized multi-store inventory sync & audit logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>
                    Average annual leakage prevented:{' '}
                    <strong className="text-[#3d701a] dark:text-[#a1e670] font-mono font-bold tabular-nums">
                      +{formatAmount(36000)}/yr
                    </strong>{' '}
                    across 20 outlets
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Enterprise SLA and regional compliance consulting</span>
                </div>
              </div>
            </div>

            <button
              onClick={onSalesClick}
              className="w-full py-3.5 px-6 rounded-lg text-xs font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-[#1D4ED8] dark:hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Speak With Sales</span>
              <ArrowRight className="w-4 h-4 text-[#70C038]" />
            </button>
          </div>

          {/* Right Column — Partnership Opportunities */}
          <div className="bg-white dark:bg-[#131E35] rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#70C038] transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#70C038]" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f2f9eb] dark:bg-lime-950/50 border border-[#d2edaa] dark:border-lime-900 flex items-center justify-center mb-6">
                <Handshake className="w-6 h-6 text-[#70C038]" />
              </div>

              <span className="text-xs font-bold text-[#4d8b20] dark:text-[#a1e670] uppercase tracking-wider">
                Partner Network
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B3B82] dark:text-white mt-1 mb-3">
                Let's Build Business Opportunities Together.
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Join our growing ecosystem of accountants, bookkeepers, business consultants, technology companies, POS agents, distributors, and implementation partners.
              </p>

              {/* Feature Highlights with dynamic currency values */}
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Accountant & Bookkeeper client console with bulk management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>
                    Earn up to{' '}
                    <strong className="text-[#3d701a] dark:text-[#a1e670] font-mono font-bold tabular-nums">
                      {formatAmount(450)}
                    </strong>{' '}
                    client onboarding bonus + 25% recurring margin
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Hardware distributor bundling for POS printers and tablets</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Co-branded marketing collateral & lead sharing</span>
                </div>
              </div>
            </div>

            <button
              onClick={onPartnerClick}
              className="w-full py-3.5 px-6 rounded-lg text-xs font-bold text-slate-950 bg-[#70C038] hover:bg-[#5fa62c] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Become a Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
