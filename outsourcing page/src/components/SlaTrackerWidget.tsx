import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  User,
  Check,
  Timer,
  Lock,
  Unlock,
  GitBranch,
  ChevronRight,
  BellRing,
  CheckSquare,
  Square,
  Flame,
} from 'lucide-react';
import {
  DeliverableTask,
  CurrencyCode,
  SlaMilestone,
  SlaRiskLevel,
} from '../types';
import { useToast } from '../context/ToastContext';

export const DEFAULT_SLA_MILESTONES: SlaMilestone[] = [
  {
    id: 'm-1',
    phase: 'Phase 01',
    title: 'Month-End Data Ingestion & OCR',
    desc: 'All bank feeds, POS receipts, and supplier invoice batches ingested & verified.',
    owner: 'Adeola Adeleke, FCA',
    dueDate: 'Nov 02, 2026',
    daysRemaining: 0,
    slaTargetHours: 24,
    status: 'Completed',
    percent: 100,
    dependsOn: [],
    completedAt: 'Nov 02 • 09:40 AM',
    deliverables: [
      { id: 'd-1-1', label: 'GTBank & Zenith bank CSV feeds ingested', completed: true },
      { id: 'd-1-2', label: 'POS daily settlement batch matched', completed: true },
      { id: 'd-1-3', label: 'OCR supplier invoice indexing verified', completed: true },
    ],
  },
  {
    id: 'm-2',
    phase: 'Phase 02',
    title: 'Multi-Currency Bank & POS Ledger Closing',
    desc: 'Reconciling 450 transactions across NGN, USD, XOF & petty cash control ledgers.',
    owner: 'Adeola Adeleke, FCA',
    dueDate: 'Nov 05, 2026 (Tomorrow)',
    daysRemaining: 1,
    slaTargetHours: 24,
    status: 'In Progress',
    percent: 75,
    dependsOn: ['m-1'],
    deliverables: [
      { id: 'd-2-1', label: 'Primary operating account reconciliation', completed: true },
      { id: 'd-2-2', label: 'Gateway payout settlements (Paystack/CinetPay)', completed: true },
      { id: 'd-2-3', label: 'Petty cash imprest voucher audit', completed: true },
      { id: 'd-2-4', label: 'Cross-currency FX revaluation journal sign-off', completed: false },
    ],
  },
  {
    id: 'm-3',
    phase: 'Phase 03',
    title: 'Statutory PAYE, VAT & Pension Filing Pack',
    desc: 'Payroll tax bracket schedules and VAT 7.5% return ready for statutory portal filing.',
    owner: 'Kofi Mensah, FCCA',
    dueDate: 'Nov 07, 2026',
    daysRemaining: 2,
    slaTargetHours: 48,
    status: 'Scheduled',
    percent: 25,
    dependsOn: ['m-2'],
    deliverables: [
      { id: 'd-3-1', label: 'Monthly 22-staff payroll roster verification', completed: true },
      { id: 'd-3-2', label: 'PAYE & statutory pension deduction computation', completed: false },
      { id: 'd-3-3', label: 'Input vs Output VAT (7.5%) net schedule', completed: false },
      { id: 'd-3-4', label: 'Digital tax remittance voucher generation', completed: false },
    ],
  },
  {
    id: 'm-4',
    phase: 'Phase 04',
    title: 'WHT Credits & Vendor Retention Clearance',
    desc: 'Cross-checking withholding tax receipts and contractor credit notes for audit readiness.',
    owner: 'Jean-Luc Habimana, CPA',
    dueDate: 'Nov 08, 2026',
    daysRemaining: 3,
    slaTargetHours: 48,
    status: 'In Progress',
    percent: 33,
    dependsOn: ['m-1'],
    deliverables: [
      { id: 'd-4-1', label: 'Vendor WHT deduction register compiled', completed: true },
      { id: 'd-4-2', label: 'Certificate batch cross-referenced with treasury', completed: false },
      { id: 'd-4-3', label: 'Regional compliance sign-off (ECOWAS/OHADA)', completed: false },
    ],
  },
  {
    id: 'm-5',
    phase: 'Phase 05',
    title: 'Certified Boardpack & Management Accounts',
    desc: 'Full P&L, balance sheet, cash flow & variance notes countersigned by Lead Partner.',
    owner: 'David Mwangi, CPA-K',
    dueDate: 'Nov 15, 2026',
    daysRemaining: 10,
    slaTargetHours: 72,
    status: 'Scheduled',
    percent: 0,
    dependsOn: ['m-2', 'm-3'],
    deliverables: [
      { id: 'd-5-1', label: 'Consolidated Income Statement & Gross Margin notes', completed: false },
      { id: 'd-5-2', label: 'Balance Sheet & working capital ratios', completed: false },
      { id: 'd-5-3', label: 'Virtual CFO 12-week cash runway commentary', completed: false },
      { id: 'd-5-4', label: 'Managing Partner digital certification stamp', completed: false },
    ],
  },
];

export interface MilestoneEvaluation {
  blockingMilestones: SlaMilestone[];
  dependentMilestones: SlaMilestone[];
  isBlocked: boolean;
  riskLevel: SlaRiskLevel;
  riskLabel: string;
  riskReason: string;
}

export const evaluateMilestoneStatus = (
  milestone: SlaMilestone,
  allMilestones: SlaMilestone[]
): MilestoneEvaluation => {
  const blockingMilestones = milestone.dependsOn
    .map((depId) => allMilestones.find((m) => m.id === depId))
    .filter((m): m is SlaMilestone => !!m && m.status !== 'Completed');

  const dependentMilestones = allMilestones.filter((m) =>
    m.dependsOn.includes(milestone.id)
  );

  const isBlocked = blockingMilestones.length > 0;

  if (milestone.status === 'Completed' || milestone.percent >= 100) {
    return {
      blockingMilestones,
      dependentMilestones,
      isBlocked: false,
      riskLevel: 'completed',
      riskLabel: 'Completed',
      riskReason: milestone.completedAt
        ? `Delivered on schedule (${milestone.completedAt})`
        : 'All deliverables verified within SLA',
    };
  }

  // Deadline Risk Engine based on remaining time, completion rate, and dependency blocks
  const isCritical =
    (milestone.daysRemaining <= 2 && milestone.percent < 60) ||
    (isBlocked && milestone.daysRemaining <= 3 && milestone.percent < 50) ||
    (milestone.daysRemaining <= 1 && milestone.percent < 50);

  if (isCritical) {
    const blockerText = isBlocked
      ? ` • Blocked by ${blockingMilestones.map((b) => b.phase).join(', ')}`
      : '';
    return {
      blockingMilestones,
      dependentMilestones,
      isBlocked,
      riskLevel: 'critical',
      riskLabel: 'At Risk of Breach',
      riskReason: `Only ${milestone.daysRemaining}d left at ${milestone.percent}% completion${blockerText}`,
    };
  }

  const isWarning =
    (milestone.daysRemaining <= 2 && milestone.percent < 100) ||
    (milestone.daysRemaining <= 4 && milestone.percent < 65) ||
    (isBlocked && milestone.daysRemaining <= 5);

  if (isWarning) {
    return {
      blockingMilestones,
      dependentMilestones,
      isBlocked,
      riskLevel: 'warning',
      riskLabel: 'Behind Pace',
      riskReason: `${milestone.daysRemaining}d remaining with ${100 - milestone.percent}% deliverables left`,
    };
  }

  return {
    blockingMilestones,
    dependentMilestones,
    isBlocked,
    riskLevel: 'on_track',
    riskLabel: isBlocked ? 'Waiting on Prerequisite' : 'On Track',
    riskReason: isBlocked
      ? `Scheduled cleanly once ${blockingMilestones.map((b) => b.phase).join(', ')} completes`
      : `${milestone.daysRemaining}d remaining • pacing within contractual SLA`,
  };
};

interface SlaTrackerWidgetProps {
  tasks: DeliverableTask[];
  milestones?: SlaMilestone[];
  onMilestonesChange?: (updated: SlaMilestone[]) => void;
  onMilestoneCompleted?: (milestone: SlaMilestone, unblockedTitles: string[]) => void;
  selectedCurrency: CurrencyCode;
  onNavigateToTab?: (tab: string) => void;
}

interface SlaBenchmark {
  id: string;
  service: string;
  slaLimit: string;
  avgActual: string;
  complianceRate: number;
}

export const SlaTrackerWidget: React.FC<SlaTrackerWidgetProps> = ({
  tasks,
  milestones: controlledMilestones,
  onMilestonesChange,
  onMilestoneCompleted,
  onNavigateToTab,
}) => {
  const { toast } = useToast();
  const [internalMilestones, setInternalMilestones] = useState<SlaMilestone[]>(
    DEFAULT_SLA_MILESTONES
  );
  const milestones = controlledMilestones ?? internalMilestones;

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'at_risk' | 'blocked'>('all');
  const [fastTrackedTasks, setFastTrackedTasks] = useState<Record<string, boolean>>({});
  const [escalatedMilestones, setEscalatedMilestones] = useState<Record<string, boolean>>({});

  const updateMilestones = (next: SlaMilestone[]) => {
    if (onMilestonesChange) {
      onMilestonesChange(next);
    } else {
      setInternalMilestones(next);
    }
  };

  // Pre-evaluate all milestones (risks & dependency graph)
  const evaluations = useMemo(() => {
    const map: Record<string, MilestoneEvaluation> = {};
    milestones.forEach((m) => {
      map[m.id] = evaluateMilestoneStatus(m, milestones);
    });
    return map;
  }, [milestones]);

  // Overall cycle progress computed across all deliverables
  const progressStats = useMemo(() => {
    const totalDeliverables = milestones.reduce(
      (sum, m) => sum + m.deliverables.length,
      0
    );
    const completedDeliverables = milestones.reduce(
      (sum, m) => sum + m.deliverables.filter((d) => d.completed).length,
      0
    );
    const completedMilestones = milestones.filter(
      (m) => m.status === 'Completed'
    ).length;
    const overallPercent =
      totalDeliverables > 0
        ? Math.round((completedDeliverables / totalDeliverables) * 100)
        : 0;

    const criticalMilestones = milestones.filter(
      (m) => evaluations[m.id]?.riskLevel === 'critical'
    );
    const warningMilestones = milestones.filter(
      (m) => evaluations[m.id]?.riskLevel === 'warning'
    );
    const blockedMilestones = milestones.filter(
      (m) => evaluations[m.id]?.isBlocked
    );

    return {
      totalDeliverables,
      completedDeliverables,
      completedMilestones,
      overallPercent,
      criticalMilestones,
      warningMilestones,
      blockedMilestones,
      totalRiskCount: criticalMilestones.length + warningMilestones.length,
    };
  }, [milestones, evaluations]);

  const filteredMilestones = useMemo(() => {
    if (milestoneFilter === 'at_risk') {
      return milestones.filter((m) => {
        const lvl = evaluations[m.id]?.riskLevel;
        return lvl === 'critical' || lvl === 'warning';
      });
    }
    if (milestoneFilter === 'blocked') {
      return milestones.filter((m) => evaluations[m.id]?.isBlocked);
    }
    return milestones;
  }, [milestones, milestoneFilter, evaluations]);

  // Helper to complete a milestone & cascade unlock detection
  const commitMilestoneCompletion = (
    targetId: string,
    updatedList: SlaMilestone[]
  ) => {
    const targetAfter = updatedList.find((m) => m.id === targetId);
    if (!targetAfter) return;

    // Identify downstream milestones that WERE blocked before, and now have zero unfinished prerequisites
    const newlyUnblocked = updatedList
      .filter((candidate) => {
        if (!candidate.dependsOn.includes(targetId)) return false;
        if (candidate.status === 'Completed') return false;
        const stillBlocked = candidate.dependsOn.some((depId) => {
          const dep = updatedList.find((m) => m.id === depId);
          return dep && dep.status !== 'Completed';
        });
        return !stillBlocked;
      })
      .map((m) => `${m.phase}: ${m.title}`);

    // Automatically promote newly unblocked scheduled milestones to 'In Progress'
    const finalList = updatedList.map((m) => {
      if (
        m.dependsOn.includes(targetId) &&
        m.status === 'Scheduled' &&
        newlyUnblocked.includes(`${m.phase}: ${m.title}`)
      ) {
        return { ...m, status: 'In Progress' as const };
      }
      return m;
    });

    updateMilestones(finalList);

    if (onMilestoneCompleted) {
      onMilestoneCompleted(targetAfter, newlyUnblocked);
    } else {
      const unlockMsg =
        newlyUnblocked.length > 0
          ? ` Unblocked: ${newlyUnblocked.join(', ')}.`
          : '';
      toast.success(
        `${targetAfter.phase} (${targetAfter.title}) marked 100% completed.${unlockMsg}`,
        'Milestone Completed'
      );
    }
  };

  const handleToggleDeliverable = (milestoneId: string, deliverableId: string) => {
    const evalInfo = evaluations[milestoneId];
    const targetMilestone = milestones.find((m) => m.id === milestoneId);
    if (!targetMilestone || !evalInfo) return;

    if (evalInfo.isBlocked) {
      const blockerNames = evalInfo.blockingMilestones
        .map((b) => `${b.phase} (${b.title})`)
        .join(', ');
      toast.warning(
        `Complete prerequisite milestone(s) first: ${blockerNames}`,
        `${targetMilestone.phase} Is Blocked`
      );
      return;
    }

    const wasCompleted = targetMilestone.status === 'Completed';
    const nextDeliverables = targetMilestone.deliverables.map((d) =>
      d.id === deliverableId ? { ...d, completed: !d.completed } : d
    );
    const doneCount = nextDeliverables.filter((d) => d.completed).length;
    const nextPercent = Math.round(
      (doneCount / Math.max(1, nextDeliverables.length)) * 100
    );
    const nowCompleted = doneCount === nextDeliverables.length;

    const updatedList = milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      return {
        ...m,
        deliverables: nextDeliverables,
        percent: nextPercent,
        status: nowCompleted
          ? ('Completed' as const)
          : doneCount > 0
          ? ('In Progress' as const)
          : ('Scheduled' as const),
        completedAt: nowCompleted
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
      };
    });

    if (!wasCompleted && nowCompleted) {
      commitMilestoneCompletion(milestoneId, updatedList);
    } else {
      updateMilestones(updatedList);
    }
  };

  const handleMarkMilestoneComplete = (milestoneId: string) => {
    const evalInfo = evaluations[milestoneId];
    const targetMilestone = milestones.find((m) => m.id === milestoneId);
    if (!targetMilestone || !evalInfo) return;

    if (evalInfo.isBlocked) {
      const blockerNames = evalInfo.blockingMilestones
        .map((b) => `${b.phase} (${b.title})`)
        .join(', ');
      toast.warning(
        `Cannot complete ${targetMilestone.phase} while blocked by: ${blockerNames}`,
        'Dependency Block Active'
      );
      return;
    }

    if (targetMilestone.status === 'Completed') return;

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedList = milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      return {
        ...m,
        status: 'Completed' as const,
        percent: 100,
        completedAt: `Today • ${nowTime}`,
        deliverables: m.deliverables.map((d) => ({ ...d, completed: true })),
      };
    });

    commitMilestoneCompletion(milestoneId, updatedList);
  };

  const handleEscalateRiskMilestone = (milestone: SlaMilestone) => {
    setEscalatedMilestones((prev) => ({ ...prev, [milestone.id]: true }));
    toast.warning(
      `Priority SLA escalation dispatched to ${milestone.owner} for ${milestone.phase} (${milestone.daysRemaining}d remaining, ${milestone.percent}% complete).`,
      `SLA Risk Escalated: ${milestone.phase}`
    );
  };

  // SLA Benchmarks data
  const slaBenchmarks: SlaBenchmark[] = [
    {
      id: 'b-1',
      service: 'Bank & POS Ledger Reconciliation',
      slaLimit: '24 Hours SLA',
      avgActual: '11.4 Hours Avg',
      complianceRate: 99.8,
    },
    {
      id: 'b-2',
      service: 'Payroll Processing & Payslips',
      slaLimit: '48 Hours SLA',
      avgActual: '22.0 Hours Avg',
      complianceRate: 100.0,
    },
    {
      id: 'b-3',
      service: 'Ad-hoc Tax & Accounting Inquiry',
      slaLimit: '4 Hours SLA',
      avgActual: '1.6 Hours Avg',
      complianceRate: 99.1,
    },
    {
      id: 'b-4',
      service: 'Statutory Tax Schedule Preparation',
      slaLimit: '5 Days Prior to Due',
      avgActual: '6.2 Days Prior',
      complianceRate: 98.9,
    },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'in_progress') return t.status === 'In Progress';
    if (filterCategory === 'under_review') return t.status === 'Under Review';
    if (filterCategory === 'scheduled') return t.status === 'Scheduled';
    if (filterCategory === 'completed') return t.status === 'Completed';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;

  const handleRequestFastTrack = (
    taskId: string,
    taskTitle: string,
    assignee: string
  ) => {
    setFastTrackedTasks((prev) => ({ ...prev, [taskId]: true }));
    toast.success(
      `Priority escalation dispatched to ${assignee}. SLA turnaround accelerated.`,
      `Fast-Track Activated for "${taskTitle}"`
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* SLA Widget Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lime-400/20 to-blue-500/20 border border-lime-400/40 flex items-center justify-center text-lime-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400 font-mono">
              Live Service Level Agreement (SLA) & Dependency Engine
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SLA GUARANTEED
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-grotesk text-white">
            Operational Timelines, Milestones & Turnaround Tracker
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track deliverable completion rates, dependency blockers, and real-time SLA deadline risk warnings.
          </p>
        </div>

        {/* Global SLA Health KPI Pill */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 self-start lg:self-auto shadow-inner">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              SLA Adherence Rate
            </span>
            <div className="text-2xl font-black text-lime-400 font-grotesk tracking-tight">
              99.4%
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {progressStats.completedMilestones}/{milestones.length} Phases Completed
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* DEADLINE RISK WARNING SYSTEM BANNER */}
      {progressStats.totalRiskCount > 0 && (
        <div
          className={`rounded-2xl p-4 border relative z-10 space-y-3 ${
            progressStats.criticalMilestones.length > 0
              ? 'bg-gradient-to-r from-rose-950/70 via-slate-950 to-amber-950/50 border-rose-500/60 shadow-lg shadow-rose-950/30'
              : 'bg-gradient-to-r from-amber-950/60 to-slate-950 border-amber-500/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  progressStats.criticalMilestones.length > 0
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-extrabold text-white font-grotesk">
                    SLA Deadline Risk Warning System
                  </span>
                  {progressStats.criticalMilestones.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white">
                      {progressStats.criticalMilestones.length} Critical Breach Risk
                    </span>
                  )}
                  {progressStats.warningMilestones.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-600">
                      {progressStats.warningMilestones.length} Behind Pace
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Computed from remaining turnaround window, current deliverable completion rate, and upstream blockers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setMilestoneFilter(milestoneFilter === 'at_risk' ? 'all' : 'at_risk')
              }
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 transition cursor-pointer shrink-0 self-start sm:self-auto"
            >
              {milestoneFilter === 'at_risk'
                ? 'Show All Milestones'
                : `Inspect ${progressStats.totalRiskCount} At-Risk Milestones`}
            </button>
          </div>

          {/* Risk Item Quick Action Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              ...progressStats.criticalMilestones,
              ...progressStats.warningMilestones,
            ].map((rm) => {
              const ev = evaluations[rm.id];
              const isCrit = ev.riskLevel === 'critical';
              const isEscalated = !!escalatedMilestones[rm.id];
              return (
                <div
                  key={rm.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                    isCrit
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-100'
                      : 'bg-amber-950/40 border-amber-600/40 text-amber-100'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold flex items-center gap-1.5 truncate">
                      <Flame
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCrit ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      />
                      <span className="truncate">
                        {rm.phase}: {rm.title}
                      </span>
                    </div>
                    <div className="text-[10px] opacity-85 mt-0.5 truncate">
                      {ev.riskReason}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEscalateRiskMilestone(rm)}
                    disabled={isEscalated}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer shrink-0 ${
                      isEscalated
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 cursor-default'
                        : isCrit
                        ? 'bg-rose-500 hover:bg-rose-400 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {isEscalated ? 'Pod Escalated ✓' : 'Escalate SLA'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OVERALL VISUAL PROGRESS TRACKER & DEPENDENCY CHAIN */}
      <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white font-grotesk uppercase tracking-wide">
                October–November Close Timeline & Deliverable Progress
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Toggle deliverables or mark an unblocked milestone completed to trigger real-time completion alerts & unlock downstream phases.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-300">
              {progressStats.completedDeliverables}/{progressStats.totalDeliverables} Deliverables
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-lime-400/15 border border-lime-400/40 text-lime-400 font-black font-grotesk">
              {progressStats.overallPercent}% Complete
            </span>
          </div>
        </div>

        {/* Visual Overall Cycle Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-lime-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressStats.overallPercent}%` }}
            />
          </div>

          {/* Interactive Dependency Graph Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <GitBranch className="w-3 h-3 text-blue-400" />
              Dependency Chain:
            </span>
            {milestones.map((m, i) => {
              const ev = evaluations[m.id];
              return (
                <React.Fragment key={m.id}>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono font-bold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60'
                        : ev.isBlocked
                        ? 'bg-slate-900 text-slate-400 border-slate-700'
                        : ev.riskLevel === 'critical'
                        ? 'bg-rose-950/70 text-rose-300 border-rose-600/60'
                        : 'bg-lime-950/70 text-lime-300 border-lime-600/60'
                    }`}
                  >
                    {m.status === 'Completed' ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    ) : ev.isBlocked ? (
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                    ) : (
                      <Unlock className="w-2.5 h-2.5 text-lime-400" />
                    )}
                    <span>
                      {m.phase} ({m.percent}%)
                    </span>
                  </span>
                  {i < milestones.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Milestone Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setMilestoneFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                milestoneFilter === 'all'
                  ? 'bg-lime-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Phases ({milestones.length})
            </button>
            <button
              type="button"
              onClick={() => setMilestoneFilter('at_risk')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                milestoneFilter === 'at_risk'
                  ? 'bg-rose-500 text-white'
                  : 'text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>At Risk ({progressStats.totalRiskCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMilestoneFilter('blocked')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                milestoneFilter === 'blocked'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Blocked ({progressStats.blockedMilestones.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-lime-400" />
            Real-time notification triggers enabled on completion
          </span>
        </div>

        {/* Milestone Cards Grid with Sub-Deliverables, Dependency Locks & Risk Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredMilestones.map((m) => {
            const ev = evaluations[m.id];
            const isCompleted = m.status === 'Completed';
            const isCrit = ev.riskLevel === 'critical';
            const isWarn = ev.riskLevel === 'warning';

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-900/70 border-emerald-500/40'
                    : isCrit
                    ? 'bg-gradient-to-b from-rose-950/35 to-slate-900 border-rose-500/70 ring-1 ring-rose-500/30'
                    : ev.isBlocked
                    ? 'bg-slate-900/50 border-amber-700/50 opacity-95'
                    : isWarn
                    ? 'bg-gradient-to-b from-amber-950/25 to-slate-900 border-amber-500/60'
                    : 'bg-slate-900/90 border-lime-400/50'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top Row: Phase, Status & Risk Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {m.phase}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                            : ev.isBlocked
                            ? 'bg-slate-800 text-amber-300 border border-amber-700/70'
                            : m.status === 'In Progress'
                            ? 'bg-lime-950 text-lime-300 border border-lime-500'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {ev.isBlocked ? 'Blocked' : m.status}
                      </span>
                    </div>

                    {/* Risk Warning Badge */}
                    {isCrit && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        AT RISK • {m.daysRemaining}d LEFT
                      </span>
                    )}
                    {isWarn && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/60">
                        <Clock className="w-3 h-3" />
                        BEHIND PACE • {m.daysRemaining}d LEFT
                      </span>
                    )}
                    {ev.riskLevel === 'on_track' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-700/60">
                        {m.daysRemaining}d Left • On Track
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        SLA Met
                      </span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h5 className="font-bold text-sm text-white font-grotesk">
                      {m.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  {/* Dependency Indicators (Upstream Blockers & Downstream Unlocks) */}
                  {(m.dependsOn.length > 0 || ev.dependentMilestones.length > 0) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {ev.isBlocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-600/60 font-semibold">
                          <Lock className="w-3 h-3 text-amber-400" />
                          Blocked by:{' '}
                          {ev.blockingMilestones
                            .map((b) => `${b.phase} (${b.percent}%)`)
                            .join(', ')}
                        </span>
                      ) : m.dependsOn.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 font-semibold">
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          Prerequisites met ({m.dependsOn.map((id) => milestones.find((x) => x.id === id)?.phase).join(', ')})
                        </span>
                      ) : null}

                      {ev.dependentMilestones.length > 0 && !isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          <GitBranch className="w-3 h-3 text-blue-400" />
                          Unlocks:{' '}
                          {ev.dependentMilestones.map((d) => d.phase).join(', ')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Deliverable Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Deliverable Completion ({m.deliverables.filter((d) => d.completed).length}/{m.deliverables.length})
                      </span>
                      <span
                        className={`font-mono font-extrabold ${
                          isCompleted
                            ? 'text-emerald-400'
                            : isCrit
                            ? 'text-rose-400'
                            : isWarn
                            ? 'text-amber-300'
                            : 'text-lime-400'
                        }`}
                      >
                        {m.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-400'
                            : isCrit
                            ? 'bg-gradient-to-r from-rose-500 to-amber-400'
                            : isWarn
                            ? 'bg-amber-400'
                            : 'bg-gradient-to-r from-lime-400 to-emerald-400'
                        }`}
                        style={{ width: `${m.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Specific Deliverables Interactive Checklist */}
                  <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    {m.deliverables.map((del) => (
                      <button
                        key={del.id}
                        type="button"
                        onClick={() => handleToggleDeliverable(m.id, del.id)}
                        className={`w-full text-left flex items-center gap-2 py-1 px-1.5 rounded-lg text-[11px] transition cursor-pointer ${
                          ev.isBlocked
                            ? 'text-slate-500 hover:bg-slate-900/80'
                            : del.completed
                            ? 'text-emerald-300 hover:bg-slate-900'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                        title={
                          ev.isBlocked
                            ? 'Blocked by upstream milestone dependency'
                            : 'Toggle deliverable completion'
                        }
                      >
                        {del.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : ev.isBlocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                        <span className={del.completed ? 'line-through opacity-80' : ''}>
                          {del.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Row: Owner, Target Date & Complete Trigger */}
                <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="text-slate-400 space-y-0.5">
                    <div className="flex items-center gap-1 text-slate-300">
                      <User className="w-3 h-3 text-lime-400" />
                      <span>{m.owner}</span>
                    </div>
                    <div>
                      Target: <strong className="text-slate-200">{m.dueDate}</strong>
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed {m.completedAt ? `(${m.completedAt})` : ''}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMarkMilestoneComplete(m.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                        ev.isBlocked
                          ? 'bg-slate-800 text-amber-300/80 border border-amber-700/50 hover:bg-slate-800'
                          : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-sm shadow-lime-400/20'
                      }`}
                    >
                      {ev.isBlocked ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Locked by Dependency</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Mark Completed</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Turnaround Times (TAT) Analytics Grid */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-lime-400" />
            <h4 className="text-sm font-bold text-white font-grotesk uppercase tracking-wide">
              Turnaround Times (TAT) vs SLA Commitments
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Contractual SLA caps vs actual rolling 30-day speed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {slaBenchmarks.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-2.5 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span
                  className="text-[11px] text-slate-400 truncate max-w-[170px]"
                  title={b.service}
                >
                  {b.service}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                  {b.complianceRate}%
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-0.5">
                <div>
                  <div className="text-lg font-extrabold text-lime-400 font-grotesk">
                    {b.avgActual}
                  </div>
                  <div className="text-[10px] text-slate-500 line-through">
                    {b.slaLimit}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/60 inline-flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-lime-400" />
                    50%+ Faster
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Pending Deliverables & Tasks for Outsourced Team */}
      <div className="space-y-3.5 pt-2 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white font-grotesk flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Pending Deliverables & Outsourced Task Queue</span>
              <span className="text-xs bg-lime-400 text-slate-950 px-2 py-0.2 rounded-full font-bold">
                {pendingCount} Active
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Operational queue currently assigned to your team with guaranteed SLA turnaround deadlines.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'scheduled', label: 'Scheduled' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterCategory(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                  filterCategory === f.id
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Cards */}
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No tasks currently match this filter.
            </div>
          ) : (
            filteredTasks.map((t) => {
              const isFastTracked = !!fastTrackedTasks[t.id];
              return (
                <div
                  key={t.id}
                  className="p-4 bg-slate-950/70 hover:bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-white truncate">
                        {t.title}
                      </span>
                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                        {t.category}
                      </span>
                      {isFastTracked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded-full">
                          <Zap className="w-2.5 h-2.5" />
                          FAST-TRACK ESCALATED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3 h-3 text-lime-400" />
                        Lead: <strong className="text-white">{t.assignedTo}</strong>
                      </span>
                      <span>•</span>
                      <span>{t.documentCount} Source Docs Attached</span>
                      <span>•</span>
                      <span className="text-blue-400 font-mono">
                        SLA Code: MSME-SLA-{t.id.slice(-4)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Turnaround Target
                      </span>
                      <div className="font-bold text-slate-200 font-mono">{t.dueDate}</div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                        t.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : t.status === 'In Progress'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : t.status === 'Under Review'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {t.status}
                    </span>

                    {t.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRequestFastTrack(t.id, t.title, t.assignedTo)
                        }
                        disabled={isFastTracked}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          isFastTracked
                            ? 'bg-amber-900/40 text-amber-300 border border-amber-700 cursor-not-allowed'
                            : 'bg-lime-400/15 hover:bg-lime-400/25 text-lime-300 border border-lime-400/40'
                        }`}
                        title="Request immediate expedited review from practitioner"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{isFastTracked ? 'Escalated' : 'Fast-Track'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SLA Breach Protection Guarantee Footer */}
      <div className="p-4 bg-gradient-to-r from-blue-950/40 via-slate-900 to-lime-950/40 rounded-2xl border border-lime-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 relative z-10">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-lime-400 shrink-0" />
          <div>
            <span className="font-bold text-white block">
              Contractual SLA Penalty Protection:
            </span>
            <span className="text-[11px] text-slate-400">
              Any SLA turnaround breach triggers an automatic 15% billing credit applied to next month&apos;s retainer.
            </span>
          </div>
        </div>

        {onNavigateToTab && (
          <button
            type="button"
            onClick={() => onNavigateToTab('messages')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-lime-400 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Message Pod Lead</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
