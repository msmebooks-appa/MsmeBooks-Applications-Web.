import React, { useState } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink, 
  ArrowRight,
  Filter,
  Globe2,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  REGIONAL_TAX_DEADLINES, 
  TaxDeadlineItem, 
  getDaysRemaining, 
  getDeadlineUrgency 
} from '../utils/taxDeadlines';
import { 
  getNotificationPermission, 
  requestNotificationPermission 
} from '../utils/reminderService';
import { useCurrency } from '../context/CurrencyContext';

interface ComplianceCalendarSectionProps {
  userCountry?: string;
  onBookTaxService?: (categoryId?: string, deadlineTitle?: string) => void;
}

export const ComplianceCalendarSection: React.FC<ComplianceCalendarSectionProps> = ({
  userCountry = 'Nigeria',
  onBookTaxService,
}) => {
  const { currentCurrency } = useCurrency();
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    if (REGIONAL_TAX_DEADLINES[userCountry]) return userCountry;
    return 'Nigeria';
  });

  const [filterUrgency, setFilterUrgency] = useState<'all' | 'urgent' | 'monthly' | 'annual'>('all');
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>(getNotificationPermission());
  const [pushSubscribedToast, setPushSubscribedToast] = useState<string | null>(null);

  const regionDeadlines = REGIONAL_TAX_DEADLINES[selectedRegion] || REGIONAL_TAX_DEADLINES['Nigeria'];

  const filteredDeadlines = regionDeadlines.filter((item) => {
    const days = getDaysRemaining(item.nextDueDate);
    if (filterUrgency === 'urgent') return days <= 14;
    if (filterUrgency === 'monthly') return item.frequency === 'Monthly';
    if (filterUrgency === 'annual') return item.frequency === 'Annual';
    return true;
  });

  // Handle Browser Notification Opt-in
  const handleEnablePushAlerts = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPerm(perm);
    if (perm === 'granted') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('MsmeBooks Compliance Alerts Activated', {
          body: `You are subscribed to statutory tax alerts for ${selectedRegion}. Reminders will trigger 3 days before filing deadlines.`,
          icon: '/favicon.ico',
        });
      }
      setPushSubscribedToast(`Subscribed! Real-time alerts activated for ${selectedRegion} tax deadlines.`);
      setTimeout(() => setPushSubscribedToast(null), 4000);
    }
  };

  const handleTriggerTestPush = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('⚠️ Tax Filing Due in 7 Days', {
        body: `Upcoming deadline: ${regionDeadlines[0]?.title || 'Monthly VAT/WHT Return'}. Avoid statutory penalty under ${regionDeadlines[0]?.authority || 'tax authority'}.`,
        icon: '/favicon.ico',
      });
      setPushSubscribedToast('Sample desktop tax deadline notification delivered!');
      setTimeout(() => setPushSubscribedToast(null), 3500);
    } else {
      handleEnablePushAlerts();
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#102B4E] to-[#1464C8] text-white p-6 rounded-3xl border border-[#1464C8]/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7E532] text-[#102B4E] text-xs font-black uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Statutory Tax & Filing Radar
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Regional Compliance & Tax Calendar
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
            Track official statutory filing dates, avoid automatic default fines, and engage certified chartered tax consultants before penalty cutoff dates.
          </p>
        </div>

        {/* Region Selector Pills */}
        <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md p-2 rounded-2xl border border-white/15">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
            Active Tax Jurisdiction:
          </span>
          <div className="flex flex-wrap gap-1">
            {Object.keys(REGIONAL_TAX_DEADLINES).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegion(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-[#B7E532] text-[#102B4E] font-black shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {r === 'Nigeria' && '🇳🇬 '}
                {r === 'Kenya' && '🇰🇪 '}
                {r === 'Ghana' && '🇬🇭 '}
                {r === 'South Africa' && '🇿🇦 '}
                {r === 'UK / International' && '🇬🇧 '}
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Browser Push Notification Opt-in Card (Browser Notification API) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-[#0B1E34] dark:to-[#0D1D31] p-4 sm:p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1464C8] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BellRing className="w-5 h-5 text-[#B7E532]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-[#102B4E] dark:text-white">
                Real-Time Desktop & Mobile Push Alerts
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                notificationPerm === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              }`}>
                {notificationPerm === 'granted' ? '✓ Alerts Active' : 'Permission Required'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Opt-in to get browser push notifications 3 days before any statutory filing deadline and 1 hour before scheduled consultation appointments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {notificationPerm === 'granted' ? (
            <button
              type="button"
              onClick={handleTriggerTestPush}
              className="px-3.5 py-2 bg-white dark:bg-[#071322] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#1464C8] dark:text-[#B7E532] border border-blue-200 dark:border-blue-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Send Test Alert
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnablePushAlerts}
              className="px-4 py-2 bg-[#1464C8] hover:bg-[#1052a5] text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Alerts</span>
            </button>
          )}
        </div>
      </div>

      {pushSubscribedToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
          <span>{pushSubscribedToast}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
          {[
            { id: 'all', label: `All Deadlines (${regionDeadlines.length})` },
            { id: 'urgent', label: 'Due in ≤ 14 Days' },
            { id: 'monthly', label: 'Monthly Remittances' },
            { id: 'annual', label: 'Annual CIT / Accounts' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterUrgency(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterUrgency === f.id
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#0D1D31] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Official statutory schedule for <strong>{selectedRegion}</strong>
        </span>
      </div>

      {/* Deadlines Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeadlines.map((item) => {
          const daysRemaining = getDaysRemaining(item.nextDueDate);
          const urgency = getDeadlineUrgency(daysRemaining);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-[#1464C8] dark:hover:border-[#B7E532] transition-all"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
                    <span>{item.frequency} Schedule</span>
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${urgency.badgeBg}`}>
                    {urgency.label}
                  </span>
                </div>

                {/* Title & Authority */}
                <h4 className="text-base font-black text-[#102B4E] dark:text-white">
                  {item.title}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Authority: <strong className="text-slate-700 dark:text-slate-300">{item.authority}</strong>
                </div>

                {/* Due Date Callout */}
                <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-[#071322] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Filing Deadline</span>
                    <strong className="text-sm font-black text-[#1464C8] dark:text-[#B7E532]">
                      {item.nextDueDate} ({item.dueDayDescription})
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tax Category</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.taxType}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Statutory Penalty Warning */}
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-[11px] uppercase tracking-wide">Statutory Penalty:</strong>
                    <span className="text-[11px] leading-snug">{item.penaltyWarning}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.statutoryAct}
                </span>

                {onBookTaxService && (
                  <button
                    type="button"
                    onClick={() => onBookTaxService(item.serviceCategoryId, item.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Schedule Filing Support</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
