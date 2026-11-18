import React from 'react';
import { 
  DollarSign, 
  Users, 
  LayoutDashboard, 
  Wallet, 
  Megaphone, 
  GraduationCap, 
  Headphones, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building2,
  Cpu,
  Calculator
} from 'lucide-react';
import { PARTNER_LEVELS_INFO } from '../data/partnersData';

interface BecomePartnerSectionProps {
  onOpenBecomePartnerModal: () => void;
}

export const BecomePartnerSection: React.FC<BecomePartnerSectionProps> = ({
  onOpenBecomePartnerModal,
}) => {
  const eligibleTypes = [
    { title: 'Accountants & Accounting Firms', icon: Calculator },
    { title: 'Certified Bookkeepers', icon: CheckCircle2 },
    { title: 'Tax & Fiscal Consultants', icon: ShieldCheck },
    { title: 'POS Agents & Hardware Providers', icon: Cpu },
    { title: 'Tech Companies & IT Firms', icon: Building2 },
    { title: 'SME Advisors & Consultants', icon: Users },
    { title: 'Software Distributors & Resellers', icon: Megaphone },
    { title: 'Business Training Centers', icon: GraduationCap },
  ];

  const benefits = [
    {
      title: 'Up to 40% Recurring Commission',
      description: 'Earn predictable monthly and annual recurring revenue for every client subscription you introduce and retain.',
      icon: DollarSign,
    },
    {
      title: 'Keep 100% Implementation Fees',
      description: 'You bill clients directly for your training, hardware supply, chart of accounts setup, and consulting fees. We take 0% of your service fees.',
      icon: Wallet,
    },
    {
      title: 'Partner Portal & Client Console',
      description: 'Manage multiple client organizations from a single unified partner dashboard with granular employee permissions and audit trails.',
      icon: LayoutDashboard,
    },
    {
      title: 'Global Directory Lead Referrals',
      description: 'Get discovered by SMEs actively looking for certified local consultants through our verified partner directory marketplace.',
      icon: Megaphone,
    },
    {
      title: 'Client Acquisition & Expansion',
      description: 'Offer an all-in-one software package (Accounting + POS + Inventory + Payroll) that displaces fragmented, expensive legacy software.',
      icon: Users,
    },
    {
      title: 'Official Certification & Training',
      description: 'Access comprehensive video modules, technical certifications, and sales playbooks tailored to African commerce.',
      icon: GraduationCap,
    },
    {
      title: 'Direct Dedicated Partner Support',
      description: 'Get priority escalations, dedicated technical account managers, and direct WhatsApp / phone assistance.',
      icon: Headphones,
    },
    {
      title: 'Official Verified Partner Badge',
      description: 'Showcase your official verification badge and corporate partner profile to build immediate trust with prospective clients.',
      icon: Award,
    },
  ];

  return (
    <section id="become-partner" className="py-20 bg-slate-50 dark:bg-[#091b34] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-500/10 border border-lime-300 dark:border-lime-500/30 text-lime-800 dark:text-lime-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Global Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Grow Your Practice as an Official MsmeBooks Partner
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Join accounting firms, consultants, POS agents and technology providers building recurring revenue with MsmeBooks across Africa and worldwide.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenBecomePartnerModal}
              className="px-8 py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-lime-500/20 transition-all inline-flex items-center gap-2 transform active:scale-95"
            >
              <span>Apply to Become a Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Who Can Become a Partner Pill Grid */}
        <div className="mb-16">
          <h3 className="text-xs font-bold text-center text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5">
            Who Can Join the MsmeBooks Partner Network:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {eligibleTypes.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-2.5 hover:border-lime-500 dark:hover:border-lime-400/60 shadow-sm transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-lime-400 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 17: PARTNER COMMISSION TIERS */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Transparent Partner Tiering & Commission</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Earn competitive, recurring monthly or annual commissions as you onboard more clients to MsmeBooks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARTNER_LEVELS_INFO.map((tier) => (
              <div
                key={tier.level}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                  tier.tier === 'Platinum'
                    ? 'bg-lime-50/70 dark:bg-[#0e274a] border-lime-500 dark:border-lime-400/80 shadow-xl dark:shadow-2xl dark:shadow-lime-500/10'
                    : 'bg-white dark:bg-[#0b1f3b] border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {tier.level}
                    </span>
                    {tier.tier === 'Platinum' && (
                      <span className="text-[11px] font-bold text-lime-700 dark:text-lime-400">★ Top Tier</span>
                    )}
                  </div>

                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                    <span className="text-lime-600 dark:text-lime-400">{tier.percentage}%</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-1">Recurring</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">{tier.description}</p>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                      <span>{tier.requirements}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                      <span>{tier.commission}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={onOpenBecomePartnerModal}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      tier.tier === 'Platinum'
                        ? 'bg-lime-500 hover:bg-lime-400 text-slate-950 shadow'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Join as {tier.level}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8 PARTNER BENEFITS GRID */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Everything You Need to Grow as a MsmeBooks Partner</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              We empower our partners with technology, marketing collateral, and high-margin service tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c223f] border border-slate-200 dark:border-slate-700/80 hover:border-lime-500 dark:hover:border-lime-400/80 transition-all hover:shadow-xl shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:bg-lime-500 group-hover:text-slate-950 transition-all mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-300 transition-colors mb-1.5">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
