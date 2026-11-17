import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  MapPin,
  GripVertical,
  Move,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Video,
  ExternalLink,
  Plus,
  X,
  AlertCircle,
  CalendarDays,
  LayoutGrid,
  Columns3,
  CalendarRange,
  FileText,
} from 'lucide-react';
import { CandidateApplication, PipelineStatus } from '../types/career';
import { AddToCalendarButton } from './AddToCalendarButton';

interface InterviewCalendarProps {
  applications: CandidateApplication[];
  onScheduleInterview: (appId: string, newDateIso: string) => void;
  onViewCandidate: (app: CandidateApplication) => void;
  onPreviewResume?: (app: CandidateApplication) => void;
  onUpdateStatus?: (appId: string, status: PipelineStatus) => void;
}

export const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
  applications,
  onScheduleInterview,
  onViewCandidate,
  onPreviewResume,
  onUpdateStatus,
}) => {
  // Calendar Navigation State
  // Default to October 2026 (app baseline context)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 9, 23));
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [searchFilter, setSearchFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Drag and Drop State
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverDateStr, setDragOverDateStr] = useState<string | null>(null);
  const [rescheduleToast, setRescheduleToast] = useState<string | null>(null);

  // Unscheduled Candidates Drawer
  const [showUnscheduledShelf, setShowUnscheduledShelf] = useState(false);

  // Quick Time Editor Dialog
  const [editingApp, setEditingApp] = useState<CandidateApplication | null>(null);
  const [editDateValue, setEditDateValue] = useState('');
  const [editTimeValue, setEditTimeValue] = useState('10:00');
  const [editMeetingType, setEditMeetingType] = useState('Technical Screening');

  // Map of scheduled applications
  const scheduledApps = useMemo(() => {
    return applications.filter((app) => !!app.interviewDate);
  }, [applications]);

  // Unscheduled candidates (candidates in applied, screening, or shortlisted stages without an interview date)
  const unscheduledApps = useMemo(() => {
    return applications.filter(
      (app) => !app.interviewDate && ['applied', 'screening', 'shortlisted'].includes(app.status)
    );
  }, [applications]);

  // Unique departments for filter
  const departments = useMemo(() => {
    return Array.from(new Set(applications.map((a) => a.department))).sort();
  }, [applications]);

  // Filtered scheduled applications
  const filteredScheduledApps = useMemo(() => {
    return scheduledApps.filter((app) => {
      const matchesSearch =
        searchFilter.trim() === '' ||
        `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.referenceCode.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesDept = deptFilter === 'ALL' || app.department === deptFilter;

      return matchesSearch && matchesDept;
    });
  }, [scheduledApps, searchFilter, deptFilter]);

  // Map interviews by date string YYYY-MM-DD
  const interviewsByDate = useMemo(() => {
    const map: Record<string, CandidateApplication[]> = {};

    filteredScheduledApps.forEach((app) => {
      if (!app.interviewDate) return;
      try {
        const d = new Date(app.interviewDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`;
        if (!map[key]) map[key] = [];
        map[key].push(app);
      } catch (err) {
        console.error('Invalid interview date:', app.interviewDate, err);
      }
    });

    // Sort interviews within each day by time
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => {
        const timeA = new Date(a.interviewDate!).getTime();
        const timeB = new Date(b.interviewDate!).getTime();
        return timeA - timeB;
      });
    });

    return map;
  }, [filteredScheduledApps]);

  // Helper to format ISO date key YYYY-MM-DD
  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  // Month view generation (grid of 35 or 42 cells)
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
    const totalDays = lastDayOfMonth.getDate();

    const days: {
      date: Date;
      dateKey: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const isToday =
        d.getFullYear() === 2026 && d.getMonth() === 9 && d.getDate() === 23;
      days.push({
        date: d,
        dateKey: getDateKey(d),
        isCurrentMonth: false,
        isToday,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const isToday =
        d.getFullYear() === 2026 && d.getMonth() === 9 && d.getDate() === 23;
      days.push({
        date: d,
        dateKey: getDateKey(d),
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = 35 - (days.length % 35);
    if (remaining < 35) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        const isToday =
          d.getFullYear() === 2026 && d.getMonth() === 9 && d.getDate() === 23;
        days.push({
          date: d,
          dateKey: getDateKey(d),
          isCurrentMonth: false,
          isToday,
        });
      }
    }

    return days;
  }, [currentDate]);

  // Week view days (7 days starting from Sunday or Monday)
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay(); // 0 = Sun
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const days: {
      date: Date;
      dateKey: string;
      isToday: boolean;
    }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const isToday =
        d.getFullYear() === 2026 && d.getMonth() === 9 && d.getDate() === 23;
      days.push({
        date: d,
        dateKey: getDateKey(d),
        isToday,
      });
    }

    return days;
  }, [currentDate]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, app: CandidateApplication) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ appId: app.id, appName: `${app.firstName} ${app.lastName}`, currentInterviewDate: app.interviewDate }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedAppId(app.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (dateKey: string) => {
    setDragOverDateStr(dateKey);
  };

  const handleDragLeave = (dateKey: string) => {
    if (dragOverDateStr === dateKey) {
      setDragOverDateStr(null);
    }
  };

  const handleDropOnDate = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDateStr(null);
    setDraggedAppId(null);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      const { appId, appName, currentInterviewDate } = data;

      let hours = 10;
      let minutes = 0;

      // Preserve original hour and minute if available
      if (currentInterviewDate) {
        try {
          const prevDate = new Date(currentInterviewDate);
          hours = prevDate.getHours();
          minutes = prevDate.getMinutes();
        } catch {}
      }

      const newDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        hours,
        minutes
      );

      const newDateIso = newDate.toISOString();
      onScheduleInterview(appId, newDateIso);

      const formatted = newDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const timeFormatted = newDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      setRescheduleToast(`Rescheduled ${appName} to ${formatted} at ${timeFormatted}`);
      setTimeout(() => setRescheduleToast(null), 3500);
    } catch (err) {
      console.error('Error dropping interview card:', err);
    }
  };

  // Quick Editor Save
  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp || !editDateValue) return;

    try {
      const [year, month, day] = editDateValue.split('-').map(Number);
      const [hours, minutes] = editTimeValue.split(':').map(Number);
      const newDate = new Date(year, month - 1, day, hours || 10, minutes || 0);

      onScheduleInterview(editingApp.id, newDate.toISOString());

      setRescheduleToast(
        `Updated interview for ${editingApp.firstName} ${editingApp.lastName} (${editMeetingType})`
      );
      setTimeout(() => setRescheduleToast(null), 3000);
      setEditingApp(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Open Quick Edit
  const handleOpenEdit = (app: CandidateApplication) => {
    setEditingApp(app);
    if (app.interviewDate) {
      const d = new Date(app.interviewDate);
      setEditDateValue(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`
      );
      setEditTimeValue(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    } else {
      setEditDateValue('2026-10-24');
      setEditTimeValue('11:00');
    }
  };

  // Navigation helpers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else {
        d.setDate(d.getDate() - 7);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else {
        d.setDate(d.getDate() + 7);
      }
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 23));
  };

  const monthYearLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekRangeLabel = useMemo(() => {
    if (weekDays.length === 0) return '';
    const first = weekDays[0].date;
    const last = weekDays[6].date;
    return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [weekDays]);

  return (
    <div className="space-y-6">
      {/* Reschedule Toast Notification */}
      {rescheduleToast && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{rescheduleToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setRescheduleToast(null)}
            className="text-emerald-600 hover:text-emerald-900 ml-3"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Calendar Controls & Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Month/Week Heading & Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-[#0066CC] hover:bg-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-black text-[#14243A] tracking-tight">
              {viewMode === 'month' ? monthYearLabel : weekRangeLabel}
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              ({filteredScheduledApps.length} scheduled)
            </span>
          </div>
        </div>

        {/* Right: Search, Filter, Mode Toggle & Unscheduled Drawer Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search candidate or role..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:bg-white focus:border-[#0066CC] outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 rounded-xl border border-slate-200 outline-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'month'
                  ? 'bg-white text-[#0066CC] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'week'
                  ? 'bg-white text-[#0066CC] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
          </div>

          {/* Unscheduled Candidates Toggle */}
          <button
            type="button"
            onClick={() => setShowUnscheduledShelf(!showUnscheduledShelf)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
              showUnscheduledShelf
                ? 'bg-[#14243A] text-white border-[#14243A]'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Unscheduled Candidates ({unscheduledApps.length})</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Guidance Banner */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2 font-medium">
          <Move className="w-4 h-4 text-[#0066CC] shrink-0" />
          <span>
            <strong>Drag-and-Drop to Reschedule:</strong> Grab any candidate interview card and drop it onto another day cell to update their interview schedule instantly.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Auto-syncs candidate status</span>
        </div>
      </div>

      {/* Optional Unscheduled Shelf Drawer */}
      {showUnscheduledShelf && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#14243A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B5E61D]" />
                <span>Ready for Interview Invitation ({unscheduledApps.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag any candidate below directly onto a date in the calendar to schedule their interview!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowUnscheduledShelf(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {unscheduledApps.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              All active shortlisted candidates have scheduled interviews!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {unscheduledApps.map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 hover:border-[#0066CC] transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between group shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-[#0066CC] uppercase tracking-wider">
                        {app.department}
                      </div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0066CC] mt-0.5">
                        {app.firstName} {app.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {app.jobTitle}
                      </div>
                    </div>
                    <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-[#0066CC] shrink-0" />
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{app.city}, {app.country}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(app)}
                      className="font-bold text-[#0066CC] hover:underline"
                    >
                      + Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE: MONTH VIEW
         ========================================================================= */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/90 text-center text-xs font-bold text-slate-600">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2.5 border-r border-slate-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200">
            {monthDays.map((cell) => {
              const dayInterviews = interviewsByDate[cell.dateKey] || [];
              const isOver = dragOverDateStr === cell.dateKey;

              return (
                <div
                  key={cell.dateKey}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(cell.dateKey)}
                  onDragLeave={() => handleDragLeave(cell.dateKey)}
                  onDrop={(e) => handleDropOnDate(e, cell.date)}
                  className={`min-h-[125px] p-2 flex flex-col justify-between transition-colors relative group ${
                    cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/60 text-slate-400'
                  } ${cell.isToday ? 'bg-blue-50/30 ring-2 ring-[#0066CC] inset-0 z-10' : ''} ${
                    isOver ? 'bg-blue-100/70 border-2 border-dashed border-[#0066CC]' : ''
                  }`}
                >
                  {/* Cell Top: Date Number & Badges */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        cell.isToday
                          ? 'bg-[#0066CC] text-white shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>

                    {dayInterviews.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0066CC]">
                        {dayInterviews.length}
                      </span>
                    )}
                  </div>

                  {/* Drop highlight helper message */}
                  {isOver && (
                    <div className="text-[10px] font-bold text-[#0066CC] text-center py-1 bg-white/90 rounded border border-[#0066CC] shadow-2xs mb-1">
                      Drop to move here
                    </div>
                  )}

                  {/* Scheduled Candidate Badges */}
                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[90px] scrollbar-none">
                    {dayInterviews.map((app) => {
                      const timeStr = app.interviewDate
                        ? new Date(app.interviewDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '10:00 AM';

                      return (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, app)}
                          onClick={() => onViewCandidate(app)}
                          className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 hover:border-[#0066CC] shadow-2xs text-left cursor-grab active:cursor-grabbing group/card transition-all"
                          title="Click to view candidate details or drag to another day"
                        >
                          <div className="flex items-center justify-between gap-1 text-[10px]">
                            <span className="font-bold text-[#0066CC] font-mono flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              {timeStr}
                            </span>
                            <span className="text-slate-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                              <GripVertical className="w-3 h-3 text-slate-400" />
                            </span>
                          </div>

                          <div className="text-[11px] font-bold text-slate-900 truncate leading-snug">
                            {app.firstName} {app.lastName}
                          </div>

                          <div className="text-[10px] text-slate-500 truncate">
                            {app.jobTitle}
                          </div>

                          {onPreviewResume && (
                            <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPreviewResume(app);
                                }}
                                className="text-[10px] font-semibold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
                                title={`Preview ${app.firstName}'s PDF resume`}
                              >
                                <FileText className="w-2.5 h-2.5 text-rose-500" />
                                <span>Resume</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Add icon on hover */}
                  <div className="pt-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingApp(applications[0] || null);
                        setEditDateValue(cell.dateKey);
                        setEditTimeValue('10:00');
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-[#0066CC] flex items-center gap-0.5"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Slot</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE: WEEK VIEW (DETAILED DAY COLUMNS)
         ========================================================================= */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-slate-200">
            {weekDays.map((col) => {
              const dayInterviews = interviewsByDate[col.dateKey] || [];
              const isOver = dragOverDateStr === col.dateKey;

              return (
                <div
                  key={col.dateKey}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(col.dateKey)}
                  onDragLeave={() => handleDragLeave(col.dateKey)}
                  onDrop={(e) => handleDropOnDate(e, col.date)}
                  className={`min-h-[420px] flex flex-col transition-colors ${
                    col.isToday ? 'bg-blue-50/20' : 'bg-white'
                  } ${isOver ? 'bg-blue-100/70 border-2 border-dashed border-[#0066CC]' : ''}`}
                >
                  {/* Column Header */}
                  <div
                    className={`p-3 text-center border-b border-slate-200 ${
                      col.isToday ? 'bg-[#0066CC] text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                      {col.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-black mt-0.5">{col.date.getDate()}</div>
                    <div className="text-[10px] font-semibold opacity-75 mt-0.5">
                      {dayInterviews.length} interviews
                    </div>
                  </div>

                  {/* Drop banner */}
                  {isOver && (
                    <div className="m-2 p-2 bg-[#0066CC] text-white text-center rounded-lg text-xs font-bold">
                      Drop to move interview here
                    </div>
                  )}

                  {/* Card Column list */}
                  <div className="p-2 space-y-2.5 flex-1 overflow-y-auto">
                    {dayInterviews.map((app) => {
                      const timeStr = app.interviewDate
                        ? new Date(app.interviewDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '10:00 AM';

                      return (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, app)}
                          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#0066CC] shadow-xs cursor-grab active:cursor-grabbing transition-all group/item"
                        >
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#0066CC]">
                              <Clock className="w-3 h-3 text-[#0066CC]" />
                              <span>{timeStr}</span>
                            </span>

                            <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#0066CC]" />
                          </div>

                          <div className="font-bold text-xs text-slate-900 leading-snug">
                            {app.firstName} {app.lastName}
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {app.jobTitle}
                          </div>

                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{app.city}, {app.country}</span>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] flex-wrap gap-1">
                            <button
                              type="button"
                              onClick={() => onViewCandidate(app)}
                              className="font-bold text-[#0066CC] hover:underline cursor-pointer"
                            >
                              Review Profile
                            </button>

                            {onPreviewResume && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPreviewResume(app);
                                }}
                                className="font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title={`Preview ${app.firstName}'s PDF resume`}
                              >
                                <FileText className="w-3 h-3 text-rose-500" />
                                <span>PDF</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(app)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              title="Edit exact time or meeting link"
                            >
                              Adjust
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {dayInterviews.length === 0 && !isOver && (
                      <div className="text-center py-10 text-xs text-slate-400 italic">
                        No interviews
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          QUICK TIME & INTERVIEW DETAILS POPUP MODAL
         ========================================================================= */}
      {editingApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reschedule Candidate Interview
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center flex-wrap gap-2">
                  <span>{editingApp.firstName} {editingApp.lastName} — {editingApp.jobTitle}</span>
                  {onPreviewResume && (
                    <button
                      type="button"
                      onClick={() => onPreviewResume(editingApp)}
                      className="text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                      title="Preview candidate's read-only PDF resume"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF Resume</span>
                    </button>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  required
                  value={editDateValue}
                  onChange={(e) => setEditDateValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-[#0066CC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Interview Time (Local Time)
                </label>
                <input
                  type="time"
                  required
                  value={editTimeValue}
                  onChange={(e) => setEditTimeValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-[#0066CC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Interview Stage / Meeting Type
                </label>
                <select
                  value={editMeetingType}
                  onChange={(e) => setEditMeetingType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 outline-none"
                >
                  <option value="Technical Screening">Technical Screening (45 min)</option>
                  <option value="Systems Architecture Review">Systems Architecture Review (60 min)</option>
                  <option value="Hiring Manager Discussion">Hiring Manager Discussion (45 min)</option>
                  <option value="Culture & Leadership Fit">Culture & Leadership Fit (30 min)</option>
                  <option value="Executive Final Round">Executive Final Round (45 min)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 text-[11px]">
                  <Video className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                  <span>Google Meet video invitation dispatched to {editingApp.email}.</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Import to calendar:</span>
                  <AddToCalendarButton
                    variant="compact"
                    event={{
                      id: editingApp.id,
                      candidateName: `${editingApp.firstName} ${editingApp.lastName}`,
                      candidateEmail: editingApp.email,
                      jobTitle: editingApp.jobTitle,
                      companyName: editingApp.companyName || 'MsmeBooks',
                      interviewDate: editingApp.interviewDate || `${editDateValue}T${editTimeValue}:00Z`,
                      meetingType: editMeetingType,
                      referenceCode: editingApp.referenceCode,
                    }}
                    label="Add to Calendar (.ics)"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
