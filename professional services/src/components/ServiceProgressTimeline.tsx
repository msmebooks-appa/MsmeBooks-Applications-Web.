import React, { useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Circle,
  GitCommitVertical,
  Calendar,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { BookingRecord } from '../types/booking';

export interface TimelineMilestoneItem {
  id: string;
  name: string;
  completed: boolean;
  targetDate?: string;
  description?: string;
}

export function isLongTermEngagement(booking: BookingRecord): boolean {
  if (
    booking.billingFrequency === 'monthly' ||
    booking.billingFrequency === 'quarterly' ||
    booking.billingFrequency === 'bi-yearly' ||
    booking.billingFrequency === 'yearly'
  ) {
    return true;
  }
  if (booking.billingUnits && booking.billingUnits > 1 && booking.billingUnitType !== 'hours') {
    return true;
  }
  if (booking.milestones && booking.milestones.length >= 3) {
    return true;
  }
  const combined = `${booking.serviceTitle} ${booking.packageName} ${booking.requirements}`.toLowerCase();
  return (
    combined.includes('annual') ||
    combined.includes('retainer') ||
    combined.includes('monthly') ||
    combined.includes('quarterly') ||
    combined.includes('tax') ||
    combined.includes('audit') ||
    combined.includes('growth')
  );
}

export function getEngagementCadenceLabel(booking: BookingRecord): string {
  if (booking.billingFrequency && booking.billingFrequency !== 'hourly') {
    const map: Record<string, string> = {
      monthly: 'Monthly Retainer',
      quarterly: 'Quarterly Retainer',
      'bi-yearly': 'Bi-Yearly Engagement',
      yearly: 'Annual Engagement',
    };
    const base = map[booking.billingFrequency] || 'Retainer Engagement';
    if (booking.billingUnits && booking.billingUnits > 1) {
      return `${base} (${booking.billingUnits} ${booking.billingUnitType || 'cycles'})`;
    }
    return base;
  }
  const title = (booking.serviceTitle || '').toLowerCase();
  if (title.includes('annual')) return 'Annual Statutory Engagement';
  if (title.includes('quarterly')) return 'Quarterly Engagement';
  if (title.includes('monthly')) return 'Monthly Retainer';
  return 'Multi-Phase Long-Term Engagement';
}

export function getMilestonesWithDetails(booking: BookingRecord): TimelineMilestoneItem[] {
  const baseMilestones =
    booking.milestones && booking.milestones.length > 0
      ? booking.milestones
      : [
          {
            id: `${booking.id}-tl-1`,
            name: 'Phase 1: Kickoff, Engagement Scope & Data Room Intake',
            completed: booking.status !== 'Pending Review',
            targetDate: booking.appointmentDate || 'Week 1',
          },
          {
            id: `${booking.id}-tl-2`,
            name: 'Phase 2: Ledger Reconciliation & Statutory Fieldwork',
            completed: booking.status === 'In Progress' || booking.status === 'Completed',
            targetDate: 'Week 2',
          },
          {
            id: `${booking.id}-tl-3`,
            name: 'Phase 3: Partner Quality Review & Draft Report Sign-Off',
            completed: booking.status === 'Completed',
            targetDate: 'Week 3',
          },
          {
            id: `${booking.id}-tl-4`,
            name: 'Phase 4: Final Regulatory Filing & Compliance Handover',
            completed: booking.status === 'Completed',
            targetDate: 'Week 4',
          },
        ];

  const defaultDescriptions = [
    `Initial discovery briefing, document checklist verification, and partner onboarding with ${booking.providerName}.`,
    'Detailed analysis, reconciliations, compliance testing, and workpaper preparation by the assigned practice team.',
    'Senior partner review, management walkthrough session, and client approval of draft schedules.',
    'Official submission, final signed deliverables package, and archival in your Documents vault.',
  ];

  return baseMilestones.map((m, idx) => ({
    ...m,
    description: defaultDescriptions[idx] || 'Scheduled engagement milestone deliverable.',
  }));
}

interface ServiceProgressTimelineProps {
  booking: BookingRecord;
  onUpdateMilestones?: (
    bookingId: string,
    updatedMilestones: { id: string; name: string; completed: boolean; targetDate?: string }[],
    newPercent: number
  ) => void;
  defaultExpanded?: boolean;
  compactHeader?: boolean;
}

export const ServiceProgressTimeline: React.FC<ServiceProgressTimelineProps> = ({
  booking,
  onUpdateMilestones,
  defaultExpanded = true,
  compactHeader = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const timelineItems = useMemo(() => getMilestonesWithDetails(booking), [booking]);
  const completedCount = timelineItems.filter((item) => item.completed).length;
  const pendingCount = timelineItems.length - completedCount;
  const progressPercent =
    timelineItems.length > 0 ? Math.round((completedCount / timelineItems.length) * 100) : 0;

  const firstPendingIndex = timelineItems.findIndex((item) => !item.completed);
  const cadenceLabel = getEngagementCadenceLabel(booking);

  const handleToggleUpToStep = (index: number) => {
    if (!onUpdateMilestones) return;
    const clickedCompleted = timelineItems[index].completed;
    const nextMilestones = timelineItems.map((item, idx) => ({
      id: item.id,
      name: item.name,
      targetDate: item.targetDate,
      // Clicking an already-completed last step toggles it back to pending; otherwise completes up through clicked index
      completed: clickedCompleted && idx === index ? false : idx <= index,
    }));
    const nextDoneCount = nextMilestones.filter((m) => m.completed).length;
    const nextPercent = Math.round((nextDoneCount / nextMilestones.length) * 100);
    onUpdateMilestones(booking.id, nextMilestones, nextPercent);
  };

  const handleCompleteNextMilestone = () => {
    if (!onUpdateMilestones || firstPendingIndex === -1) return;
    handleToggleUpToStep(firstPendingIndex);
  };

  return (
    <div className="bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Header Strip */}
      <div
        className={`px-4 py-3.5 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 dark:from-[#081322] dark:via-[#0D1E35] dark:to-[#081322] border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#102B4E] dark:bg-[#1464C8] text-[#B7E532] flex items-center justify-center shrink-0 shadow-2xs">
            <GitCommitVertical className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
                Service Progress Timeline
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {cadenceLabel}
              </span>
            </div>
            {!compactHeader ? (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-bold text-[#1464C8] dark:text-[#B7E532]">{booking.reference}</span>
                <span>·</span>
                <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                  {booking.serviceTitle}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {booking.providerName}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Visual vertical milestone tracker for {booking.providerName}
              </p>
            )}
          </div>
        </div>

        {/* Completed vs Pending Counters + Expand/Collapse */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 text-[11px] font-black">
            <CheckCircle2 className="w-3 h-3" />
            <span>{completedCount} Completed</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70 text-[11px] font-black">
            <Clock className="w-3 h-3" />
            <span>{pendingCount} Pending</span>
          </span>

          {compactHeader && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Collapse Service Progress Timeline' : 'Expand Service Progress Timeline'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Vertical Step-Tracker Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Overall Progress Strip */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300">
              Engagement Milestone Completion
            </span>
            <span className="font-black text-[#1464C8] dark:text-[#B7E532]">
              {progressPercent}% ({completedCount}/{timelineItems.length} Steps)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1464C8] via-emerald-500 to-[#B7E532] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Visual Vertical Step-Tracker */}
          <div className="relative pl-1 pt-1">
            {timelineItems.map((step, idx) => {
              const isLast = idx === timelineItems.length - 1;
              const isCompleted = step.completed;
              const isActivePending = !isCompleted && idx === firstPendingIndex;

              return (
                <div key={step.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {/* Vertical Connector Rail */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={`absolute left-[15px] top-8 bottom-0 w-0.5 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 dark:bg-emerald-500/80'
                          : 'border-l-2 border-dashed border-slate-300 dark:border-slate-700 bg-transparent'
                      }`}
                    />
                  )}

                  {/* Vertical Step Node */}
                  <button
                    type="button"
                    onClick={() => handleToggleUpToStep(idx)}
                    disabled={!onUpdateMilestones}
                    title={
                      onUpdateMilestones
                        ? isCompleted
                          ? 'Click to update milestone progress'
                          : 'Click to mark milestone as completed'
                        : undefined
                    }
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      onUpdateMilestones ? 'cursor-pointer hover:scale-105' : ''
                    } ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-500/15'
                        : isActivePending
                        ? 'bg-[#1464C8] text-white shadow-sm ring-4 ring-blue-500/20'
                        : 'bg-white dark:bg-[#0D1D31] text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isActivePending ? (
                      <Clock className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </button>

                  {/* Step Detail Card */}
                  <div
                    className={`flex-1 rounded-xl border p-3 transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/90 dark:border-emerald-900/50'
                        : isActivePending
                        ? 'bg-blue-50/70 dark:bg-blue-950/35 border-blue-300 dark:border-[#1464C8]/60 shadow-2xs'
                        : 'bg-slate-50/70 dark:bg-[#081322] border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Milestone {idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                              : isActivePending
                              ? 'bg-blue-100 dark:bg-blue-900/70 text-[#1464C8] dark:text-[#B7E532]'
                              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isCompleted
                            ? 'Completed'
                            : isActivePending
                            ? 'Pending · Active Next'
                            : 'Pending'}
                        </span>
                      </div>

                      {step.targetDate && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{isCompleted ? `Cleared (${step.targetDate})` : `Target: ${step.targetDate}`}</span>
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-black mt-1 ${
                        isCompleted
                          ? 'text-emerald-950 dark:text-emerald-100'
                          : isActivePending
                          ? 'text-[#102B4E] dark:text-white'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {step.name}
                    </h4>

                    {step.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          {onUpdateMilestones && pendingCount > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">
                Click any milestone node to update status, or advance the next pending step:
              </span>
              <button
                type="button"
                onClick={handleCompleteNextMilestone}
                className="px-3 py-1.5 rounded-lg bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#B7E532]" />
                <span>Complete Milestone {firstPendingIndex + 1}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ServiceProgressTimelineTabProps {
  bookings: BookingRecord[];
  onUpdateMilestones: (
    bookingId: string,
    updatedMilestones: { id: string; name: string; completed: boolean; targetDate?: string }[],
    newPercent: number
  ) => void;
  onNewBookingClick: () => void;
}

export const ServiceProgressTimelineTab: React.FC<ServiceProgressTimelineTabProps> = ({
  bookings,
  onUpdateMilestones,
  onNewBookingClick,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const longTermBookings = useMemo(() => {
    return bookings.filter((b) => isLongTermEngagement(b));
  }, [bookings]);

  const displayedLongTerm = useMemo(() => {
    if (filterStatus === 'active') {
      return longTermBookings.filter((b) => b.status !== 'Completed');
    }
    if (filterStatus === 'completed') {
      return longTermBookings.filter((b) => b.status === 'Completed');
    }
    return longTermBookings;
  }, [longTermBookings, filterStatus]);

  const stats = useMemo(() => {
    let completedMilestones = 0;
    let pendingMilestones = 0;
    for (const b of longTermBookings) {
      const items = getMilestonesWithDetails(b);
      completedMilestones += items.filter((i) => i.completed).length;
      pendingMilestones += items.filter((i) => !i.completed).length;
    }
    const total = completedMilestones + pendingMilestones;
    const pct = total > 0 ? Math.round((completedMilestones / total) * 100) : 0;
    return {
      engagementsCount: longTermBookings.length,
      completedMilestones,
      pendingMilestones,
      pct,
    };
  }, [longTermBookings]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Banner Header */}
      <div className="bg-gradient-to-br from-[#102B4E] via-[#1464C8] to-[#0A1727] text-white p-6 rounded-3xl shadow-lg border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B7E532]">
              <GitCommitVertical className="w-4 h-4" />
              <span>Service Progress Timeline · Long-Term Engagements</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
              Completed vs Pending Engagement Milestones
            </h3>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl">
              Visual vertical step-tracker monitoring retainers, multi-phase compliance engagements, and turnkey implementations from kickoff to sign-off.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15 self-start">
            {([
              { id: 'all', label: `All (${longTermBookings.length})` },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-[#B7E532] text-[#102B4E] shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Long-Term Engagements
          </span>
          <div className="text-xl font-black text-[#102B4E] dark:text-white mt-1 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
            <span>{stats.engagementsCount}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Completed Milestones
          </span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{stats.completedMilestones}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Milestones
          </span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{stats.pendingMilestones}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Overall Progress
          </span>
          <div className="text-xl font-black text-[#1464C8] dark:text-[#B7E532] mt-1">
            {stats.pct}%
          </div>
        </div>
      </div>

      {/* Vertical Step-Trackers List */}
      {displayedLongTerm.length === 0 ? (
        <div className="bg-white dark:bg-[#0A1727] p-10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
          <GitCommitVertical className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="text-base font-black text-[#102B4E] dark:text-white">
            No matching long-term engagements
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Book a monthly, quarterly, or annual retainer engagement to track its completed and pending milestones here.
          </p>
          <button
            type="button"
            onClick={onNewBookingClick}
            className="px-4 py-2 rounded-xl bg-[#1464C8] text-white text-xs font-black hover:bg-[#1052a5] transition-colors cursor-pointer"
          >
            + Book Long-Term Engagement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedLongTerm.map((booking) => (
            <ServiceProgressTimeline
              key={booking.id}
              booking={booking}
              onUpdateMilestones={onUpdateMilestones}
              defaultExpanded={true}
              compactHeader={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
