import React, { useState } from 'react';
import { 
  Briefcase, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  MessageCircle, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface BecomeProviderSectionProps {
  onRegisterClick: () => void;
}

export const BecomeProviderSection: React.FC<BecomeProviderSectionProps> = ({ onRegisterClick }) => {
  const tiers = [
    {
      name: 'Bronze Partner',
      commission: '15%',
      commissionSubtitle: 'Recurring commission on SaaS subscriptions',
      badgeColor: 'border-amber-300 bg-amber-50/50',
      tagColor: 'bg-amber-100 text-amber-800',
      benefits: [
        'Verified directory firm profile',
        'Customer appointment booking desk',
        'Standard WhatsApp enquiry routing',
        'MsmeBooks software partner training',
      ],
      idealFor: 'Solo practitioners & emerging bookkeepers',
    },
    {
      name: 'Silver Partner',
      commission: '20%',
      commissionSubtitle: 'Recurring commission on SaaS subscriptions',
      badgeColor: 'border-slate-300 bg-slate-50/60',
      tagColor: 'bg-slate-200 text-slate-800',
      benefits: [
        'All Bronze benefits included',
        'Featured placement in city searches',
        'Direct quote & milestone contract tools',
        'Co-branded marketing collaterals',
      ],
      idealFor: 'Established local accounting practices',
    },
    {
      name: 'Partner Tier (Gold)',
      commission: '30%',
      commissionSubtitle: 'Recurring commission on SaaS subscriptions',
      badgeColor: 'border-blue-300 bg-blue-50/50',
      tagColor: 'bg-blue-100 text-[#1464C8]',
      benefits: [
        'Priority lead allocation by algorithm',
        'Direct multi-staff consultant accounts',
        'Dedicated partner relationship manager',
        'Quarterly revenue bonus eligibility',
      ],
      idealFor: 'Regional consulting & audit firms',
    },
    {
      name: 'Platinum Partner',
      commission: '40%',
      commissionSubtitle: 'Highest recurring SaaS revenue tier',
      badgeColor: 'border-[#1464C8] bg-white ring-2 ring-[#B7E532]',
      tagColor: 'bg-[#B7E532] text-[#102B4E]',
      popular: true,
      benefits: [
        'Maximum recurring SaaS referral share',
        'Enterprise nationwide tender referrals',
        'Direct API integration & customization desk',
        'Executive Advisory Council seat',
      ],
      idealFor: 'Premier multi-branch corporate practices',
    },
  ];

  return (
    <section id="partner-program" className="py-20 bg-gradient-to-b from-[#102B4E] to-[#0A1D36] dark:from-[#07111D] dark:to-[#0A1727] text-white relative overflow-hidden transition-colors">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#1464C8]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#B7E532]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7E532]/20 text-[#B7E532] text-xs font-black uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            Join the MsmeBooks Partner Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Grow Your Professional Practice with MsmeBooks.
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base font-normal">
            Join our pan-African ecosystem of accountants, bookkeepers, tax advisers, software consultants, trainers, and business service providers.
          </p>
        </div>

        {/* 4 Partner Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                tier.popular 
                  ? 'bg-white dark:bg-[#0E2036] text-slate-800 dark:text-slate-100 shadow-2xl scale-[1.02] border-[#1464C8]/30 dark:border-[#1464C8]' 
                  : 'bg-white/10 dark:bg-[#0A1727]/80 backdrop-blur-md text-white border-white/15 dark:border-slate-800 hover:bg-white/15 dark:hover:bg-[#0D1D31]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    tier.popular ? 'bg-[#102B4E] dark:bg-[#07111D] text-[#B7E532]' : 'bg-white/20 text-slate-200'
                  }`}>
                    {tier.name}
                  </span>
                  {tier.popular && (
                    <span className="text-[10px] font-extrabold bg-[#B7E532] text-[#102B4E] px-2 py-0.5 rounded-md">
                      Top Tier
                    </span>
                  )}
                </div>

                <div className="my-4">
                  <div className={`text-4xl font-black tracking-tight ${tier.popular ? 'text-[#1464C8] dark:text-[#B7E532]' : 'text-[#B7E532]'}`}>
                    {tier.commission}
                  </div>
                  <div className={`text-[11px] font-medium leading-tight mt-1 ${tier.popular ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300'}`}>
                    {tier.commissionSubtitle}
                  </div>
                </div>

                <p className={`text-xs mb-4 font-semibold ${tier.popular ? 'text-slate-600 dark:text-slate-300' : 'text-slate-200'}`}>
                  Ideal for: {tier.idealFor}
                </p>

                <div className={`pt-4 border-t space-y-2.5 ${tier.popular ? 'border-slate-100 dark:border-slate-800' : 'border-white/10 dark:border-slate-800'}`}>
                  {tier.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.popular ? 'text-emerald-600 dark:text-[#B7E532]' : 'text-[#B7E532]'}`} />
                      <span className={tier.popular ? 'text-slate-700 dark:text-slate-200' : 'text-slate-200'}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={onRegisterClick}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    tier.popular 
                      ? 'bg-[#1464C8] hover:bg-[#1052a5] text-white shadow-md' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  Apply for {tier.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory & Commission Clarification Disclaimer */}
        <div className="p-4 bg-white/5 dark:bg-[#07111D]/80 rounded-2xl border border-white/10 dark:border-slate-800 text-xs text-slate-300 max-w-4xl mx-auto flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#B7E532] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Program Terms Clarification:</strong> Commission percentages (15% to 40%) apply to eligible ongoing MsmeBooks cloud software subscriptions referred by verified partner firms under program guidelines, creating recurring passive revenue alongside your professional service booking fees.
          </p>
        </div>

        {/* Register CTA Banner */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onRegisterClick}
            className="px-8 py-3.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-sm rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <span>Register Your Firm Today</span>
            <ArrowRight className="w-4 h-4 text-[#102B4E]" />
          </button>

          <a
            href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I would like to inquire about becoming a verified service provider / partner firm.")}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#B7E532]" />
            <span>Chat with Partner Desk</span>
          </a>
        </div>

      </div>
    </section>
  );
};
