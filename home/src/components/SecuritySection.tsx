import React from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Server,
  FileCheck2,
  RefreshCw,
  EyeOff,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      title: '256-Bit Bank-Grade Encryption',
      desc: 'All data in transit is shielded with TLS 1.3 encryption and stored using AES-256 standards at rest.',
      icon: Lock,
    },
    {
      title: 'Granular Role-Based Access',
      desc: 'Define custom permission tiers for cashiers, store managers, accountants, and executive directors.',
      icon: UserCheck,
    },
    {
      title: 'Complete Immutable Audit Trails',
      desc: 'Every journal edit, price adjustment, invoice cancellation, and cash drawer opening is permanently logged.',
      icon: FileCheck2,
    },
    {
      title: 'Automated Continuous Cloud Backups',
      desc: 'Your books and customer accounts are backed up every 15 minutes across geo-redundant African data centers.',
      icon: HardDrive,
    },
    {
      title: 'Business Continuity & Offline Resiliency',
      desc: 'Local browser and terminal caching ensures sales keep ringing even when national fiber cables or power fail.',
      icon: RefreshCw,
    },
    {
      title: 'NDPR, GDPR & African Tax Compliance',
      desc: 'Engineered in strict accordance with the Nigeria Data Protection Regulation and Pan-African compliance laws.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank-Grade African Cloud Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Your Business Data.{' '}
            <span className="text-[#0866FF] dark:text-blue-400">Protected.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Financial records are the lifeblood of your enterprise. MsmeBooks provides enterprise security protocols so you can sleep with peace of mind.
          </p>
        </div>

        {/* 6 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0E172A] border border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-[#131D31] hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-[#0866FF] dark:text-blue-400 shadow-xs border border-slate-200/70 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:bg-[#0866FF] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#0866FF] dark:group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enterprise Protocol Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Certificate Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-[#09122C] text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B7F000] text-slate-950 font-black flex items-center justify-center">
              ✓
            </div>
            <div>
              <div className="text-sm font-bold text-white">99.99% Uptime Guarantee SLA</div>
              <div className="text-xs text-slate-400">Backed by enterprise disaster recovery protocols</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-semibold">
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">SOC 2 Type II Audited</span>
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">ISO 27001 Certified</span>
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">PCI-DSS Level 1 Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};
