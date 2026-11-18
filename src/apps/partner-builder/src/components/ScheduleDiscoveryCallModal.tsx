import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Globe, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface ScheduleDiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed?: (details: BookingDetails) => void;
  initialTopic?: string;
}

export interface BookingDetails {
  topic: string;
  date: string;
  timeSlot: string;
  timezone: string;
  fullName: string;
  firmName: string;
  email: string;
  phone: string;
  country: string;
  clientRange: string;
  platform: string;
}

export const ScheduleDiscoveryCallModal: React.FC<ScheduleDiscoveryCallModalProps> = ({
  isOpen,
  onClose,
  onBookingConfirmed,
  initialTopic
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopic || 'Practice Firm Onboarding & Accreditation'
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-12');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('WAT (UTC+1, Lagos/Abuja)');
  const [platform, setPlatform] = useState<string>('Google Meet');

  const [formData, setFormData] = useState({
    fullName: '',
    firmName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    clientRange: '20–50 clients'
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const topics = [
    {
      id: 'practice',
      title: 'Practice Firm Onboarding & Accreditation',
      desc: 'For chartered accountants and bookkeepers transitioning commercial clients to MsmeBooks cloud.'
    },
    {
      id: 'pos',
      title: 'POS Hardware & Supermarket Rollout',
      desc: 'For IT vendors and POS technicians bundling touch terminals, receipt printers, and offline sync.'
    },
    {
      id: 'tax',
      title: 'Pan-African E-Tax & Statutory Compliance',
      desc: 'Deep-dive on EBM, TIMS, ZIMRA, GRA, KRA, SARS, and OHADA automated tax engines.'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Channel & Territory Exclusivity',
      desc: 'For regional software distributors exploring 40% Platinum recurring margins and lead routing.'
    }
  ];

  const dates = [
    { label: 'Thu, Nov 12', value: '2026-11-12' },
    { label: 'Fri, Nov 13', value: '2026-11-13' },
    { label: 'Mon, Nov 16', value: '2026-11-16' },
    { label: 'Tue, Nov 17', value: '2026-11-17' },
    { label: 'Wed, Nov 18', value: '2026-11-18' }
  ];

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM'
  ];

  const timezones = [
    'WAT (UTC+1, Lagos / Abuja / Luanda)',
    'EAT (UTC+3, Nairobi / Kigali / Kampala)',
    'GMT (UTC+0, Accra / Dakar / Abidjan / London)',
    'SAST (UTC+2, Johannesburg / Cape Town)',
    'CET (UTC+1, Paris / Brussels)',
    'EST (UTC-5, New York / Toronto)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details: BookingDetails = {
      topic: selectedTopic,
      date: selectedDate,
      timeSlot: selectedTime,
      timezone: selectedTimezone,
      fullName: formData.fullName,
      firmName: formData.firmName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      clientRange: formData.clientRange,
      platform
    };

    setIsSubmitted(true);
    if (onBookingConfirmed) {
      onBookingConfirmed(details);
    }
  };

  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MsmeBooks//Partner Discovery Call//EN
BEGIN:VEVENT
SUMMARY:MsmeBooks Partner Discovery & Onboarding Session
DESCRIPTION:Onboarding discussion for ${formData.firmName || 'Partner'} regarding ${selectedTopic}.
LOCATION:${platform}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MsmeBooks_Partner_Discovery_Call.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-blue-800 relative max-h-[92vh] overflow-y-auto transition-colors duration-300 ease-in-out">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation Success State */
          <div className="text-center py-6 sm:py-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-[#8CE600] flex items-center justify-center mx-auto border-2 border-emerald-300 dark:border-emerald-800 shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#8CE600] bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Meeting Reserved · Partner Priority Channel
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-white mt-2">
                Discovery Call Confirmed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 max-w-md mx-auto mt-2">
                A calendar invitation and secure meeting link have been dispatched to <strong className="text-[#0A3981] dark:text-[#8CE600]">{formData.email}</strong>.
              </p>
            </div>

            {/* Meeting Summary Box */}
            <div className="bg-slate-50 dark:bg-[#061F4A] rounded-2xl p-5 border border-slate-200 dark:border-blue-900 text-left space-y-3 text-xs sm:text-sm max-w-md mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {selectedDate} @ {selectedTime}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400">Timezone:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedTimezone}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400">Topic:</span>
                <span className="font-bold text-[#0A3981] dark:text-[#8CE600] truncate max-w-[200px]">
                  {selectedTopic}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Meeting Platform:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  {platform}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#072457] hover:bg-slate-100 dark:hover:bg-blue-900/60 border border-slate-300 dark:border-blue-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Scheduling Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Partner Onboarding Advisory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-white tracking-tight">
                Schedule Partner Discovery Call
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 mt-1">
                Book a 25-minute strategy call with the MsmeBooks Channel Director to discuss commission structures, technical certification, and direct client routing.
              </p>
            </div>

            {/* 1. Discussion Topic */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2">
                1. Select Meeting Focus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {topics.map((t) => {
                  const isSelected = selectedTopic === t.title;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTopic(t.title)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/80 border-[#0A3981] dark:border-[#8CE600] ring-1 ring-[#0A3981] dark:ring-[#8CE600]'
                          : 'bg-white dark:bg-[#061F4A] border-slate-200 dark:border-blue-900/60 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {t.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {t.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                  <span>2. Pick Available Date</span>
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between border ${
                        selectedDate === d.value
                          ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] font-bold'
                          : 'bg-white dark:bg-[#061F4A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/60 hover:bg-slate-50'
                      }`}
                    >
                      <span>{d.label}</span>
                      <span className="text-[10px] opacity-75 font-mono">Available</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                  <span>3. Pick Time Slot</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {timeSlots.map((ts) => (
                    <button
                      key={ts}
                      type="button"
                      onClick={() => setSelectedTime(ts)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer text-center border ${
                        selectedTime === ts
                          ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] font-bold'
                          : 'bg-white dark:bg-[#061F4A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/60 hover:bg-slate-50'
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>

                {/* Timezone Dropdown */}
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                  Timezone
                </label>
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white text-xs border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981]"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Contact & Practice Info */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-blue-900/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                4. Your Practice Contact Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Adebayo Ogunlesi"
                    className="w-full px-3 py-2 bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-[#0A3981]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Firm or Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firmName}
                    onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                    placeholder="e.g. Apex Financial Consult Ltd"
                    className="w-full px-3 py-2 bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-[#0A3981]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="adebayo@apexconsult.com"
                    className="w-full px-3 py-2 bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-[#0A3981]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    WhatsApp / Direct Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 802 345 6789"
                    className="w-full px-3 py-2 bg-white dark:bg-[#061F4A] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-[#0A3981]"
                  />
                </div>
              </div>

              {/* Platform Selector */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  Preferred Video Platform:
                </label>
                <div className="flex items-center gap-2">
                  {['Google Meet', 'WhatsApp Video', 'Zoom'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                        platform === p
                          ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-transparent font-bold'
                          : 'bg-white dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-blue-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-blue-900/60 flex items-center justify-between gap-3 transition-colors duration-300 ease-in-out">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600]" />
                Zero obligation · Direct Alliance Director
              </span>

              <button
                type="submit"
                className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm & Reserve Call</span>
                <ArrowRight className="w-4 h-4 text-[#8CE600]" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
