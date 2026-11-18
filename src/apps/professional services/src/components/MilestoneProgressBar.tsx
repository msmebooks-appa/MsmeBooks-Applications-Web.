import React from 'react';
import { CheckCircle2, Circle, Clock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { BookingRecord } from '../types/booking';

interface MilestoneProgressBarProps {
  booking: BookingRecord;
  onUpdateMilestones?: (bookingId: string, updatedMilestones: { id: string; name: string; completed: boolean; targetDate?: string }[], newPercent: number) => void;
  interactive?: boolean;
}

export const MilestoneProgressBar: React.FC<MilestoneProgressBarProps> = ({
  booking,
  onUpdateMilestones,
  interactive = true,
}) => {
  // If booking has no explicit milestones, generate appropriate standard milestones based on service type
  const milestones = booking.milestones && booking.milestones.length > 0
    ? booking.milestones
    : [
        { id: 'm1', name: 'Phase 1: Project Scope & Intake Data Room', completed: true, targetDate: 'Day 1' },
        { id: 'm2', name: 'Phase 2: Source Reconciliations & Fieldwork', completed: booking.status === 'In Progress' || booking.status === 'Completed', targetDate: 'Day 3' },
        { id: 'm3', name: 'Phase 3: Statutory Review & Draft Sign-off', completed: booking.status === 'Completed', targetDate: 'Day 5' },
        { id: 'm4', name: 'Phase 4: Official Filing / Go-Live Handover', completed: booking.status === 'Completed', targetDate: 'Day 7' },
      ];

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const handleToggleMilestone = (index: number) => {
    if (!interactive || !onUpdateMilestones) return;
    const updated = milestones.map((m, idx) => {
      if (idx <= index) {
        return { ...m, completed: true };
      }
      return { ...m, completed: false };
    });
    const newCompletedCount = updated.filter(m => m.completed).length;
    const newPercent = Math.round((newCompletedCount / updated.length) * 100);
    onUpdateMilestones(booking.id, updated, newPercent);
  };

  const handleAdvanceNext = () => {
    if (!interactive || !onUpdateMilestones) return;
    const firstIncompleteIdx = milestones.findIndex(m => !m.completed);
    if (firstIncompleteIdx !== -1) {
      handleToggleMilestone(firstIncompleteIdx);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#071322] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1464C8] dark:bg-[#B7E532] animate-pulse"></span>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
            Multi-Phase Service Milestones
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#1464C8] dark:text-[#B7E532]">
            {progressPercent}% Complete
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            ({completedCount}/{milestones.length} Phases)
          </span>
        </div>
      </div>

      {/* Visual Progress Bar Track */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#1464C8] to-[#B7E532] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Sequential Milestone Stepper Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
        {milestones.map((m, idx) => {
          const isDone = m.completed;
          const isCurrent = !isDone && (idx === 0 || milestones[idx - 1].completed);

          return (
            <div
              key={m.id}
              onClick={() => interactive && onUpdateMilestones && handleToggleMilestone(idx)}
              className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                  : isCurrent
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-[#1464C8] dark:text-[#B7E532] ring-1 ring-blue-400/30'
                  : 'bg-white dark:bg-[#0D1D31] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              } ${interactive ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
              title={interactive ? `Click to mark up to this milestone as completed` : undefined}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Phase {idx + 1}
                </span>
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                )}
              </div>

              <div className="font-bold text-[11px] leading-tight line-clamp-2">
                {m.name}
              </div>

              {m.targetDate && (
                <div className="mt-1 text-[9px] text-slate-400 font-mono">
                  {isDone ? 'Completed' : `Target: ${m.targetDate}`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Milestone Simulator Action for Demo */}
      {interactive && onUpdateMilestones && completedCount < milestones.length && (
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Click any phase above or simulate provider update:</span>
          <button
            type="button"
            onClick={handleAdvanceNext}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1464C8] dark:text-[#B7E532] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border border-blue-200 dark:border-blue-900/60"
          >
            <Sparkles className="w-3 h-3" />
            <span>Mark Next Phase Complete</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
