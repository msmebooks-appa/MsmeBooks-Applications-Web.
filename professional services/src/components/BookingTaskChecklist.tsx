import React, { useMemo, useState } from 'react';
import {
  ListChecks,
  Check,
  Plus,
  Trash2,
  Building2,
  UserCheck,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BookingRecord, DeliverableTask } from '../types/booking';

interface BookingTaskChecklistProps {
  booking: BookingRecord;
  onUpdateChecklist: (bookingId: string, updatedTasks: DeliverableTask[]) => void;
}

export function buildDefaultDeliverablesForBooking(booking: BookingRecord): DeliverableTask[] {
  const title = (booking.serviceTitle || '').toLowerCase();

  if (title.includes('tax') || title.includes('vat') || title.includes('withholding')) {
    return [
      {
        id: `${booking.id}-del-1`,
        title: 'Trial balance & prior-year tax return intake verification',
        owner: 'Client Action',
        completed: true,
        dueLabel: booking.milestones?.[0]?.targetDate || 'Phase 1',
      },
      {
        id: `${booking.id}-del-2`,
        title: 'Capital allowances, WHT credits & tax adjustment schedule',
        owner: 'Firm Deliverable',
        completed: true,
        dueLabel: booking.milestones?.[1]?.targetDate || 'Phase 2',
      },
      {
        id: `${booking.id}-del-3`,
        title: 'Draft Corporate Income Tax (CIT) computation review pack',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: booking.milestones?.[2]?.targetDate || 'Phase 3',
      },
      {
        id: `${booking.id}-del-4`,
        title: 'Signed statutory e-filing receipt & TaxPro-Max confirmation',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: booking.milestones?.[3]?.targetDate || 'Phase 4',
      },
    ];
  }

  if (title.includes('pos') || title.includes('hardware') || title.includes('retail') || title.includes('inventory')) {
    return [
      {
        id: `${booking.id}-del-1`,
        title: 'POS network & counter hardware readiness check',
        owner: 'Firm Deliverable',
        completed: true,
        dueLabel: 'Phase 1',
      },
      {
        id: `${booking.id}-del-2`,
        title: 'Product SKU catalogue, pricing & barcode import',
        owner: 'Firm Deliverable',
        completed: true,
        dueLabel: 'Phase 2',
      },
      {
        id: `${booking.id}-del-3`,
        title: 'Cashier tender, thermal receipt & supervisor permissions training',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: 'Phase 3',
      },
      {
        id: `${booking.id}-del-4`,
        title: 'Live store go-live sign-off & handover manual',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: 'Phase 4',
      },
    ];
  }

  if (title.includes('audit') || title.includes('advisory') || title.includes('payroll')) {
    return [
      {
        id: `${booking.id}-del-1`,
        title: 'Engagement letter & source ledger access confirmation',
        owner: 'Client Action',
        completed: true,
        dueLabel: 'Phase 1',
      },
      {
        id: `${booking.id}-del-2`,
        title: 'Fieldwork testing & statutory compliance reconciliation',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: 'Phase 2',
      },
      {
        id: `${booking.id}-del-3`,
        title: 'Draft management report & partner review walkthrough',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: 'Phase 3',
      },
      {
        id: `${booking.id}-del-4`,
        title: 'Final signed advisory report / statutory schedule package',
        owner: 'Firm Deliverable',
        completed: false,
        dueLabel: 'Phase 4',
      },
    ];
  }

  return [
    {
      id: `${booking.id}-del-1`,
      title: 'Initial kickoff checklist & source document collection',
      owner: 'Client Action',
      completed: true,
      dueLabel: booking.milestones?.[0]?.targetDate || 'Phase 1',
    },
    {
      id: `${booking.id}-del-2`,
      title: 'Bank, ledger & expense reconciliation workpapers',
      owner: 'Firm Deliverable',
      completed: false,
      dueLabel: booking.milestones?.[1]?.targetDate || 'Phase 2',
    },
    {
      id: `${booking.id}-del-3`,
      title: 'Partner quality review & draft financial statement pack',
      owner: 'Firm Deliverable',
      completed: false,
      dueLabel: booking.milestones?.[2]?.targetDate || 'Phase 3',
    },
    {
      id: `${booking.id}-del-4`,
      title: 'Final signed deliverable handover & compliance summary',
      owner: 'Firm Deliverable',
      completed: false,
      dueLabel: booking.milestones?.[3]?.targetDate || 'Phase 4',
    },
  ];
}

export const BookingTaskChecklist: React.FC<BookingTaskChecklistProps> = ({
  booking,
  onUpdateChecklist,
}) => {
  const tasks = useMemo<DeliverableTask[]>(() => {
    if (booking.deliverableChecklist && booking.deliverableChecklist.length > 0) {
      return booking.deliverableChecklist;
    }
    return buildDefaultDeliverablesForBooking(booking);
  }, [booking]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskOwner, setNewTaskOwner] = useState<'Firm Deliverable' | 'Client Action'>('Firm Deliverable');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const percentComplete = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = useMemo(() => {
    if (filterMode === 'pending') return tasks.filter((t) => !t.completed);
    if (filterMode === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filterMode]);

  const handleToggleTask = (taskId: string) => {
    const now = new Date().toISOString();
    const next = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? now : undefined,
          }
        : t
    );
    onUpdateChecklist(booking.id, next);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    const newTask: DeliverableTask = {
      id: `${booking.id}-custom-${Date.now()}`,
      title: trimmed,
      owner: newTaskOwner,
      completed: false,
      dueLabel: newTaskDue.trim() || 'In Progress',
      isCustom: true,
    };

    onUpdateChecklist(booking.id, [...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDue('');
    setShowAddForm(false);
    setFilterMode('all');
  };

  const handleRemoveTask = (taskId: string) => {
    const next = tasks.filter((t) => t.id !== taskId);
    onUpdateChecklist(booking.id, next);
  };

  return (
    <div className="bg-blue-50/45 dark:bg-[#081525] p-4 rounded-2xl border border-blue-200/80 dark:border-[#1464C8]/40 space-y-3">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#1464C8] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ListChecks className="w-4 h-4 text-[#B7E532]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
                Task Checklist
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532]">
                {completedCount}/{tasks.length} Deliverables ({percentComplete}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Track specific deliverables & milestones expected from {booking.providerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              setShowAddForm((prev) => !prev);
            }}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#1464C8] dark:text-[#B7E532] text-[11px] font-bold border border-blue-200 dark:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Deliverable</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse task checklist' : 'Expand task checklist'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Slim Deliverable Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1464C8] to-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {isExpanded && (
        <div className="space-y-2.5 pt-1">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1 bg-white dark:bg-[#0D1D31] p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold">
              {([
                { id: 'all', label: `All (${tasks.length})` },
                { id: 'pending', label: `Remaining (${tasks.length - completedCount})` },
                { id: 'completed', label: `Done (${completedCount})` },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterMode(tab.id)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    filterMode === tab.id
                      ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Deliverable Inline Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddTask}
              className="p-3 rounded-xl bg-white dark:bg-[#0D1D31] border border-blue-200 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-150"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter expected deliverable or milestone (e.g., Signed WHT schedule)"
                  className="sm:col-span-6 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                  autoFocus
                />
                <select
                  value={newTaskOwner}
                  onChange={(e) =>
                    setNewTaskOwner(e.target.value as 'Firm Deliverable' | 'Client Action')
                  }
                  className="sm:col-span-3 px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                >
                  <option value="Firm Deliverable">Firm Deliverable</option>
                  <option value="Client Action">Client Action</option>
                </select>
                <input
                  type="text"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  placeholder="Target (e.g., Nov 15)"
                  className="sm:col-span-3 px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-3 py-1 rounded-lg bg-[#1464C8] hover:bg-[#1052a5] disabled:opacity-50 text-white text-xs font-black transition-colors cursor-pointer"
                >
                  Save Deliverable
                </button>
              </div>
            </form>
          )}

          {/* Checklist Items */}
          <div className="space-y-1.5">
            {filteredTasks.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 bg-white/70 dark:bg-[#0D1D31]/70 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                No tasks match this filter.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    task.completed
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-900/50'
                      : 'bg-white dark:bg-[#0D1D31] border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-start gap-2.5 text-left min-w-0 flex-1 cursor-pointer group"
                    aria-pressed={task.completed}
                  >
                    <span
                      className={`mt-0.5 w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-[#1464C8]'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs font-bold block leading-snug ${
                          task.completed
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-[#102B4E] dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            task.owner === 'Firm Deliverable'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532]'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {task.owner === 'Firm Deliverable' ? (
                            <Building2 className="w-2.5 h-2.5" />
                          ) : (
                            <UserCheck className="w-2.5 h-2.5" />
                          )}
                          <span>{task.owner}</span>
                        </span>

                        {task.dueLabel && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{task.completed ? 'Completed' : `Target: ${task.dueLabel}`}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {task.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                      title="Remove custom deliverable"
                      aria-label="Remove custom deliverable"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
