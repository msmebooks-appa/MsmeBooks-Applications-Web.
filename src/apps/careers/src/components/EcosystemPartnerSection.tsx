import React from 'react';
import {
  Building2,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Plus,
  Bot,
  Target,
  Handshake,
} from 'lucide-react';
import { UserRole } from '../types/auth';

interface EcosystemPartnerSectionProps {
  onOpenPartnerModal: (role?: 'employer' | 'candidate') => void;
  onOpenPostJob: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup', role?: UserRole) => void;
}

export const EcosystemPartnerSection: React.FC<EcosystemPartnerSectionProps> = ({
  onOpenPartnerModal,
  onOpenPostJob,
  onOpenAiAdvisor,
  onOpenAuthModal,
}) => {
  return (
    <section id="partner-ecosystem" className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#0B132B] dark:via-[#0E172A] dark:to-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Kicker and Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
            <span>Open Pan-African Talent Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14243A] dark:text-white tracking-tight text-balance">
            More Than Just MsmeBooks Hiring. <br />
            <span className="text-[#0066CC] dark:text-[#38BDF8]">An Open Platform</span> for African Talent & Employers.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base mt-4 leading-relaxed font-normal">
            This job portal is powered by the <strong>MsmeBooks Recruitment & Talent Acquisition Add-on Module</strong>.
            We empower verified companies, enterprises, independent recruiters, and top-tier candidates to connect, evaluate, and hire seamlessly.
          </p>
        </div>

        {/* 3 Ecosystem Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Pillar 1: For Companies & MSMEs */}
          <div className="bg-white dark:bg-[#131D35] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-extrabold uppercase tracking-wide mb-2">
                For Companies & Enterprises
              </div>
              <h3 className="text-xl font-bold text-[#14243A] dark:text-white mb-3">
                Hire Verified African Talent Faster
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Publish openings to thousands of qualified candidates across Africa. Leverage automated AI resume parsing, candidate scoring, and seamless payroll onboarding.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Free job posting up to 3 active requisitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>AI resume extraction & pipeline Kanban</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>1-click hire sync into MsmeBooks Payroll</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'employer') : onOpenPartnerModal('employer'))}
                className="w-full py-2.5 px-4 bg-[#14243A] dark:bg-[#0066CC] hover:bg-slate-800 dark:hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Sign Up as Employer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenPostJob}
                className="w-full py-2 px-3 text-[#0066CC] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post a Vacancy Now</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: For Recruiters & Agency Partners */}
          <div className="bg-white dark:bg-[#131D35] rounded-2xl p-6 sm:p-7 border-2 border-[#0066CC]/30 dark:border-[#0066CC]/60 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative group">
            {/* Spotlight badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#B5E61D] text-[#14243A] text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Recruiter Add-on Module
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-lime-50 dark:bg-lime-950/60 border border-lime-200 dark:border-lime-800 text-[#14243A] dark:text-[#B5E61D] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6 text-[#0066CC] dark:text-[#B5E61D]" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/80 text-[#14243A] dark:text-[#B5E61D] text-[10px] font-extrabold uppercase tracking-wide mb-2">
                For Agencies & Headhunters
              </div>
              <h3 className="text-xl font-bold text-[#14243A] dark:text-white mb-3">
                Power Your Staffing Business
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Independent headhunters and staffing agencies can manage multiple client requisitions, share candidate dossiers, and collaborate on placement commissions.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Multi-tenant recruiter workspaces & clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Pan-African candidate distribution network</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Executive Headhunter & Agency sign-up options</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'agency') : onOpenPartnerModal('employer'))}
                  className="py-2.5 px-3 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Agency Sign Up</span>
                </button>
                <button
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'headhunter') : onOpenPartnerModal('employer'))}
                  className="py-2.5 px-3 bg-[#14243A] hover:bg-slate-800 text-[#B5E61D] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Headhunter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pillar 3: For Candidates & Job Seekers */}
          <div className="bg-white dark:bg-[#131D35] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wide mb-2">
                For Candidates & Job Seekers
              </div>
              <h3 className="text-xl font-bold text-[#14243A] dark:text-white mb-3">
                AI Guidance & Verified Roles
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Access curated remote and local jobs across MsmeBooks and partner employers. Use our AI Career Advisor to match roles based on salary, skills, and growth goals.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Interactive AI Career Advisor & Matcher</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Fast-track application with AI CV parser</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Personal candidate profile & application tracking</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'candidate') : onOpenPartnerModal('candidate'))}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] text-[#14243A] dark:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/80"
              >
                <span>Create Candidate Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenAiAdvisor}
                className="w-full py-2 px-3 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Launch AI Career Advisor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid for the Add-on Module */}
        <div className="bg-slate-900 dark:bg-[#091122] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-slate-800">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0066CC]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B5E61D]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B5E61D] uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>MsmeBooks Business Suite Add-On</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Open to Candidates, Employers, Agencies, Headhunters & Partners
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal mb-6">
                Whether you are a job seeker, a scaling enterprise, an agency, an executive headhunter, or an education accelerator, our unified recruitment suite centralizes job distribution, applicant screening, interview notes, and automated payroll onboarding into one platform.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#B5E61D]">5 Roles</div>
                  <div className="text-xs text-slate-400 mt-1">Unified Sign-In</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white">75% Faster</div>
                  <div className="text-xs text-slate-400 mt-1">Screening with AI</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#B5E61D]">1-Click</div>
                  <div className="text-xs text-slate-400 mt-1">Payroll Onboarding</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white">Pan-Africa</div>
                  <div className="text-xs text-slate-400 mt-1">Talent Reach</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'partner') : onOpenPartnerModal('employer'))}
                className="w-full py-3.5 px-5 bg-[#B5E61D] hover:bg-[#a2d114] text-[#14243A] font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Handshake className="w-4 h-4" />
                <span>Sign Up as Ecosystem Partner</span>
              </button>

              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('signin') : onOpenPostJob())}
                className="w-full py-3.5 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Existing User? Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
