import React from 'react';
import { Search, Send, FileCheck, Users, PartyPopper } from 'lucide-react';

export const HiringProcess: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Explore Opportunities',
      description:
        'Discover open roles across software engineering, product, sales, marketing, and business operations matching your ambitions.',
      icon: <Search className="w-5 h-5 text-white" />,
    },
    {
      number: '02',
      title: 'Submit Application',
      description:
        'Fill out our transparent online form, attach your CV/resume, and answer a few quick role-specific questions in under 4 minutes.',
      icon: <Send className="w-5 h-5 text-white" />,
    },
    {
      number: '03',
      title: 'Initial Screening',
      description:
        'Our recruitment team reviews your submission against key role criteria and conducts an introductory conversation within 5 business days.',
      icon: <FileCheck className="w-5 h-5 text-white" />,
    },
    {
      number: '04',
      title: 'Interviews & Assessment',
      description:
        'Meet your future teammates and complete a practical, respectful technical challenge or business scenario reflecting real workplace tasks.',
      icon: <Users className="w-5 h-5 text-white" />,
    },
    {
      number: '05',
      title: 'Offer & Onboarding',
      description:
        'Receive your comprehensive offer package, meet executive leaders, and begin our structured onboarding with full hardware provisioning.',
      icon: <PartyPopper className="w-5 h-5 text-white" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
            <span>How We Hire</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14243A] dark:text-white tracking-tight">
            Our Recruitment Process
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
            We respect your time. Our hiring framework is structured, transparent, and focused on genuine human potential and technical excellence.
          </p>
        </div>

        {/* 5-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-white dark:bg-[#131D35] p-6 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                {/* Step Header with Blue Numbered Icon & Lemon Green Accent */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0066CC] flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-[#0066CC]">
                    Step {step.number}
                  </span>
                </div>

                {/* Lemon Green top hairline bar */}
                <div className="w-10 h-1 bg-[#B5E61D] rounded-full mb-3" />

                <h3 className="text-base font-bold text-[#14243A] dark:text-white mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {idx === 0 && 'Immediate'}
                {idx === 1 && 'Instant confirmation'}
                {idx === 2 && '3–5 business days'}
                {idx === 3 && '1–2 weeks'}
                {idx === 4 && 'Welcoming you aboard'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
