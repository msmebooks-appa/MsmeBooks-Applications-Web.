import React from 'react';
import { FileText, CheckCircle2, GraduationCap, Rocket, TrendingUp, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenApply: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenApply }) => {
  const steps = [
    {
      num: '01',
      title: 'Apply',
      desc: 'Complete the online partner application detailing your business entity, location, and client specialisations.',
      icon: FileText
    },
    {
      num: '02',
      title: 'Get Approved',
      desc: 'Our Partner Operations team reviews your credentials and assigns your approved tier and unique Partner ID.',
      icon: CheckCircle2
    },
    {
      num: '03',
      title: 'Get Trained',
      desc: 'Access your Partner Portal, download your official metallic badge, and complete structured Academy certifications.',
      icon: GraduationCap
    },
    {
      num: '04',
      title: 'Promote & Implement',
      desc: 'Introduce MsmeBooks to retail, wholesale, and service businesses, charge direct setup fees, and deploy POS hardware.',
      icon: Rocket
    },
    {
      num: '05',
      title: 'Earn & Grow',
      desc: 'Receive up to 40% recurring monthly commission on subscription renewals, and automatically advance to higher tiers.',
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            Onboarding Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            How the Partner Programme Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            A transparent, frictionless 5-step journey from initial registration to recurring monthly commission payouts.
          </p>
        </div>

        {/* 5-Step Process Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative mb-14">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 dark:bg-[#0A2552] rounded-2xl p-6 border border-slate-200 dark:border-blue-800/80 flex flex-col justify-between relative hover:border-[#0A3981]/50 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-[#0c2c5f] hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black font-mono text-[#0A3981] dark:text-[#8CE600] bg-blue-100/70 dark:bg-[#061F4A] px-2 py-0.5 rounded border border-transparent dark:border-blue-900">
                      Step {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 flex items-center justify-center text-[#0A3981] dark:text-sky-300 group-hover:bg-[#0A3981] group-hover:text-white dark:group-hover:bg-[#8CE600] dark:group-hover:text-[#061F4A] transition-colors shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-blue-900/60 flex items-center text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600]">
                  <span>Tracked in Portal</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onOpenApply}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] active:bg-[#051f47] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Start Your Partner Application
            <ArrowRight className="w-4 h-4 text-[#8CE600] dark:text-[#061F4A]" />
          </button>
        </div>
      </div>
    </section>
  );
};
