import React, { useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Receipt,
  Users,
  ShieldCheck,
  Zap,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { MilestoneCelebrationData } from './CelebrationToast';

export interface MilestoneItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  perk: string;
  points: number;
}

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'first_invoice',
    title: 'First Invoice Created',
    category: 'Sales & Invoicing',
    icon: '🧾',
    description: 'Issued your business\'s first official digital tax invoice with automated 7.5% Nigerian VAT.',
    isUnlocked: true,
    unlockedAt: 'Completed',
    progressPercent: 100,
    currentValue: 1,
    targetValue: 1,
    perk: 'Unlocked +3 Custom Invoice Color Themes',
    points: 150,
  },
  {
    id: 'century_transactions',
    title: '100 Transactions Milestone',
    category: 'Sales Volume',
    icon: '🚀',
    description: 'Processed 100 successful customer sales, POS till slips, or bank transfer payments.',
    isUnlocked: true,
    unlockedAt: 'Completed',
    progressPercent: 100,
    currentValue: 100,
    targetValue: 100,
    perk: 'Priority WhatsApp Onboarding Specialist Access',
    points: 300,
  },
  {
    id: 'offline_pos',
    title: 'Offline POS Pioneer',
    category: 'Retail & Hardware',
    icon: '🛒',
    description: 'Conducted sales transactions completely offline without internet and synced cleanly to cloud.',
    isUnlocked: true,
    unlockedAt: 'Completed',
    progressPercent: 100,
    currentValue: 12,
    targetValue: 10,
    perk: 'Dual-Terminal Caching Acceleration Protocol',
    points: 200,
  },
  {
    id: 'tax_compliant',
    title: 'Tax Compliant Pro',
    category: 'Compliance & Legal',
    icon: '🛡️',
    description: 'Generated your first monthly statutory VAT 002 & WHT credit note filing schedule for FIRS TaxPro-Max.',
    isUnlocked: false,
    progressPercent: 75,
    currentValue: 3,
    targetValue: 4,
    perk: 'Direct Tax Auditor One-Click Export Bundle',
    points: 250,
  },
  {
    id: 'payroll_master',
    title: 'Payroll Master',
    category: 'HR & Workforce',
    icon: '👥',
    description: 'Disbursed employee monthly salaries with statutory PAYE income tax and 8% Pension auto-deductions.',
    isUnlocked: false,
    progressPercent: 50,
    currentValue: 1,
    targetValue: 2,
    perk: 'Bulk Commercial Bank NIBSS Transfer File Generator',
    points: 350,
  },
  {
    id: 'multi_branch',
    title: 'Multi-Branch Mogul',
    category: 'Expansion',
    icon: '🏢',
    description: 'Connected 2 or more retail branch shops or online storefronts (Shopify, Jumia, Selar).',
    isUnlocked: false,
    progressPercent: 40,
    currentValue: 2,
    targetValue: 5,
    perk: 'Inter-Branch Stock Transfer Automation Engine',
    points: 500,
  },
];

interface GrowthMilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerMilestoneDemo: (milestone: MilestoneCelebrationData) => void;
}

export const GrowthMilestonesModal: React.FC<GrowthMilestonesModalProps> = ({
  isOpen,
  onClose,
  onTriggerMilestoneDemo,
}) => {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(INITIAL_MILESTONES);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');

  if (!isOpen) return null;

  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const totalPoints = milestones
    .filter((m) => m.isUnlocked)
    .reduce((sum, m) => sum + m.points, 0);

  const filtered = milestones.filter((m) => {
    if (activeFilter === 'unlocked') return m.isUnlocked;
    if (activeFilter === 'in_progress') return !m.isUnlocked;
    return true;
  });

  const handleTestUnlock = (item: MilestoneItem) => {
    // Toggle unlock
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === item.id
          ? {
              ...m,
              isUnlocked: true,
              progressPercent: 100,
              currentValue: m.targetValue,
              unlockedAt: 'Just Now!',
            }
          : m
      )
    );

    // Fire celebration toast!
    onTriggerMilestoneDemo({
      id: item.id,
      title: item.title,
      badgeName: item.category,
      icon: item.icon,
      perk: item.perk,
      points: item.points,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-[#0B192C] rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-[#0A4FD5] to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-inner">
              🏆
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-black text-[10px] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>MsmeBooks Gamified Growth</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Growth Milestones & Badges
              </h3>
              <p className="text-xs text-blue-100">
                Earn platform perks and level up your business as you process transactions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close milestones"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 dark:bg-[#070F1B] border-b border-slate-200 dark:border-slate-800 text-center shrink-0">
          <div className="p-2.5 bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              Badges Earned
            </div>
            <div className="text-xl font-black text-[#0A4FD5] dark:text-blue-400 mt-0.5">
              {unlockedCount} / {milestones.length}
            </div>
          </div>

          <div className="p-2.5 bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              Growth Score
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {totalPoints} pts
            </div>
          </div>

          <div className="p-2.5 bg-white dark:bg-[#0D1C30] rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              SME Tier Status
            </div>
            <div className="text-xl font-black text-amber-500 mt-0.5 flex items-center justify-center gap-1">
              <span>Gold SME</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-2.5 bg-white dark:bg-[#0B192C] border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#0A4FD5] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({milestones.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unlocked')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'unlocked'
                  ? 'bg-[#0A4FD5] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('in_progress')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === 'in_progress'
                  ? 'bg-[#0A4FD5] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              In Progress ({milestones.length - unlockedCount})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click 'Test Toast' to preview celebration animation
          </span>
        </div>

        {/* Milestones List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs text-slate-700 dark:text-slate-300">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.isUnlocked
                  ? 'bg-white dark:bg-[#0D1C30] border-lime-300/80 dark:border-lime-900/60 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-[#070F1B]/60 border-slate-200 dark:border-slate-800 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                      item.isUnlocked
                        ? 'bg-lime-100 dark:bg-lime-950/80 border border-lime-300 dark:border-lime-700'
                        : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        +{item.points} pts
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Perk */}
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-lime-700 dark:text-lime-300 bg-lime-50 dark:bg-lime-950/50 px-2 py-1 rounded-lg inline-flex">
                      <Sparkles className="w-3 h-3 text-lime-600 dark:text-lime-400 shrink-0" />
                      <span>Perk: {item.perk}</span>
                    </div>
                  </div>
                </div>

                {/* Right side status / trigger */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-lime-100 dark:bg-lime-950 text-lime-800 dark:text-lime-300 text-[11px] font-black border border-lime-300 dark:border-lime-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}

                  {/* Test button to experience the celebratory toast */}
                  <button
                    type="button"
                    onClick={() => handleTestUnlock(item)}
                    className="text-[10px] font-extrabold text-[#0A4FD5] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900"
                    title="Trigger celebratory toast animation"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-lime-500" />
                    <span>Test Toast</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>
                    {item.currentValue} / {item.targetValue} ({item.progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isUnlocked
                        ? 'bg-gradient-to-r from-lime-500 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#070F1B] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Milestones sync automatically across POS terminals and web dashboard.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
