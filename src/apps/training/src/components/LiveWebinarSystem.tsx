import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Download,
  Share2
} from 'lucide-react';
import { LIVE_WEBINARS } from '../data/mockData';
import { LiveWebinarSession } from '../types';

export const LiveWebinarSystem: React.FC = () => {
  const [registeredIds, setRegisteredIds] = useState<Record<string, boolean>>({
    'webinar-1': true
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleRegister = (session: LiveWebinarSession) => {
    setRegisteredIds((prev) => ({
      ...prev,
      [session.id]: true
    }));
    setFeedbackMessage(`RSVP Confirmed for "${session.title}"! Calendar invite dispatched.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleExportCalendar = (session: LiveWebinarSession) => {
    setFeedbackMessage(`Calendar file (.ics) downloaded for "${session.title}".`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            <Video className="w-4 h-4 text-[#72B01D]" />
            Virtual Classroom &amp; Live Masterclasses
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Instructor-Led Live Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Interactive virtual workshops broadcast live via Zoom, Teams, and Google Meet with lead chartered accountants and retail practitioners.
          </p>
        </div>

        {feedbackMessage && (
          <div className="max-w-4xl mx-auto p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Webinars List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {LIVE_WEBINARS.map((webinar) => {
            const isRegistered = !!registeredIds[webinar.id];
            const remainingSeats = webinar.capacity - webinar.registeredCount;

            return (
              <div
                key={webinar.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white bg-[#0B4F9C] px-2.5 py-0.5 rounded">
                      {webinar.platform}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#72B01D]" />
                      {webinar.time}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded tabular-nums">
                    {remainingSeats} seats remaining
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    {webinar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {webinar.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                      {webinar.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{webinar.instructor}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{webinar.instructorRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCalendar(webinar)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-md text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Add to Calendar</span>
                    </button>

                    <button
                      onClick={() => handleRegister(webinar)}
                      disabled={isRegistered}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isRegistered
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#0B4F9C] hover:bg-[#073B75] text-white shadow-xs'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16]" />
                          <span>RSVP Confirmed</span>
                        </>
                      ) : (
                        <span>Reserve Seat (Free)</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
