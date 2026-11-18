import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Mail,
  DollarSign,
  Building2,
  Briefcase,
  CheckCircle2,
  Sliders,
  Sparkles,
  Check,
  Send,
  ShieldCheck,
  Globe,
  Trash2,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export interface AlertPreferenceSettings {
  email: string;
  industries: string[];
  roles: string[];
  minSalary: number;
  workArrangements: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
  notifyOnSalaryIncrease: boolean;
  active: boolean;
  lastUpdated: string;
}

interface JobAlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: string;
  initialIndustry?: string;
  initialSearchQuery?: string;
  onSaveSuccess?: (settings: AlertPreferenceSettings) => void;
}

const AVAILABLE_INDUSTRIES = [
  'FinTech',
  'SaaS & Cloud',
  'E-Commerce & Retail',
  'HealthTech & Biotech',
  'AgTech & Agriculture',
  'CleanTech & Solar',
  'EdTech & Learning',
  'Logistics & Supply Chain',
  'Banking & Insurance',
  'Media & Creative',
];

const AVAILABLE_ROLES = [
  'Software Engineering',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps & SRE',
  'Product Manager',
  'Product Designer (UI/UX)',
  'Data & AI Engineer',
  'Finance & Accounting',
  'Sales & Growth',
];

const WORK_ARRANGEMENTS = ['Remote', 'Hybrid', 'On-site'];

export const JobAlertSettingsModal: React.FC<JobAlertSettingsModalProps> = ({
  isOpen,
  onClose,
  initialRole,
  initialIndustry,
  initialSearchQuery,
  onSaveSuccess,
}) => {
  const { currentCurrency } = useCurrency();

  // Load existing saved settings
  const [settings, setSettings] = useState<AlertPreferenceSettings>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_job_alert_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      email: '',
      industries: ['FinTech', 'SaaS & Cloud'],
      roles: ['Software Engineering'],
      minSalary: 2500,
      workArrangements: ['Remote', 'Hybrid'],
      frequency: 'daily',
      notifyOnSalaryIncrease: true,
      active: true,
      lastUpdated: new Date().toISOString(),
    };
  });

  const [emailInput, setEmailInput] = useState(settings.email);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(settings.industries);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(settings.roles);
  const [minSalaryInput, setMinSalaryInput] = useState<number>(settings.minSalary);
  const [selectedArrangements, setSelectedArrangements] = useState<string[]>(settings.workArrangements);
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly'>(settings.frequency);
  const [notifyOnSalary, setNotifyOnSalary] = useState(settings.notifyOnSalaryIncrease);

  const [savedSuccessToast, setSavedSuccessToast] = useState(false);
  const [testEmailSentToast, setTestEmailSentToast] = useState(false);
  const [unsubscribedToast, setUnsubscribedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prepopulate if initial query provided
  useEffect(() => {
    if (initialRole && !selectedRoles.includes(initialRole)) {
      setSelectedRoles((prev) => [...prev, initialRole]);
    }
    if (initialIndustry && !selectedIndustries.includes(initialIndustry)) {
      setSelectedIndustries((prev) => [...prev, initialIndustry]);
    }
    if (initialSearchQuery && !selectedRoles.some((r) => r.toLowerCase().includes(initialSearchQuery.toLowerCase()))) {
      setSelectedRoles((prev) => [...prev, initialSearchQuery]);
    }
  }, [initialRole, initialIndustry, initialSearchQuery]);

  if (!isOpen) return null;

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const toggleRole = (r: string) => {
    setSelectedRoles((prev) =>
      prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]
    );
  };

  const toggleArrangement = (arr: string) => {
    setSelectedArrangements((prev) =>
      prev.includes(arr) ? prev.filter((a) => a !== arr) : [...prev, arr]
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !/^\S+@\S+\.\S+$/.test(emailInput)) {
      setErrorMessage('Please provide a valid destination email address.');
      return;
    }
    if (selectedIndustries.length === 0) {
      setErrorMessage('Please select at least one industry.');
      return;
    }
    if (selectedRoles.length === 0) {
      setErrorMessage('Please select at least one role/skill focus.');
      return;
    }

    setErrorMessage('');
    const newSettings: AlertPreferenceSettings = {
      email: emailInput.trim(),
      industries: selectedIndustries,
      roles: selectedRoles,
      minSalary: minSalaryInput,
      workArrangements: selectedArrangements,
      frequency,
      notifyOnSalaryIncrease: notifyOnSalary,
      active: true,
      lastUpdated: new Date().toISOString(),
    };

    setSettings(newSettings);
    localStorage.setItem('msmebooks_job_alert_settings', JSON.stringify(newSettings));

    // Also add to global alert subscriptions array if not present
    try {
      const storedAlerts = localStorage.getItem('msmebooks_job_alerts');
      const list = storedAlerts ? JSON.parse(storedAlerts) : [];
      const updatedList = [
        ...list.filter((s: { email: string }) => s.email !== newSettings.email),
        {
          id: `alert-pref-${Date.now()}`,
          email: newSettings.email,
          category: newSettings.roles.join(', '),
          department: newSettings.roles[0] || 'Engineering',
          location: newSettings.workArrangements.join(', '),
          employmentType: 'Full-time',
          workArrangement: newSettings.workArrangements[0] || 'Remote',
          frequency: newSettings.frequency,
          verified: true,
          token: `pref_${Date.now()}`,
          dateSubscribed: new Date().toISOString(),
        },
      ];
      localStorage.setItem('msmebooks_job_alerts', JSON.stringify(updatedList));
    } catch {}

    setSavedSuccessToast(true);
    if (onSaveSuccess) onSaveSuccess(newSettings);
    setTimeout(() => {
      setSavedSuccessToast(false);
      onClose();
    }, 1800);
  };

  const handleSendTestDispatch = () => {
    if (!emailInput.trim() || !/^\S+@\S+\.\S+$/.test(emailInput)) {
      setErrorMessage('Please enter a valid email address first.');
      return;
    }
    setTestEmailSentToast(true);
    setTimeout(() => setTestEmailSentToast(false), 3000);
  };

  const handleUnsubscribeFromSettings = () => {
    try {
      const email = emailInput.trim();
      const storedAlerts = localStorage.getItem('msmebooks_job_alerts');
      if (storedAlerts && email) {
        const list = JSON.parse(storedAlerts);
        const filtered = list.filter((a: any) => a.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem('msmebooks_job_alerts', JSON.stringify(filtered));
      }
      localStorage.removeItem('msmebooks_job_alert_settings');
    } catch {}

    setUnsubscribedToast(true);
    setTimeout(() => {
      setUnsubscribedToast(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-700/80 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#14243A] via-[#1A2E4D] to-[#0066CC] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#B5E61D] border border-white/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>Job Alert Settings & Automation</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B5E61D]/20 text-[#B5E61D] border border-[#B5E61D]/40 font-bold uppercase">
                  Real-Time Engine
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Configure your target industries, desired roles, and salary thresholds for automated email notifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveSettings} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 font-medium">
              {errorMessage}
            </div>
          )}

          {savedSuccessToast && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Job alert preferences saved! You will receive tailored updates automatically.</span>
            </div>
          )}

          {testEmailSentToast && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-300 font-bold flex items-center gap-2 animate-in fade-in">
              <Send className="w-4 h-4 text-[#0066CC]" />
              <span>Simulated preview digest sent to {emailInput}!</span>
            </div>
          )}

          {unsubscribedToast && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-rose-600" />
              <span>You have unsubscribed from automated job alerts. Preferences cleared.</span>
            </div>
          )}

          {/* Destination Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Your Notification Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. candidate@domain.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0066CC] outline-none"
              />
            </div>
          </div>

          {/* Industries Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Target Industries ({selectedIndustries.length} selected)</span>
              </label>
              <span className="text-[11px] text-slate-400">Click to toggle</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_INDUSTRIES.map((ind) => {
                const isSelected = selectedIndustries.includes(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => toggleIndustry(ind)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0066CC] text-white border-[#0066CC] shadow-2xs'
                        : 'bg-slate-50 dark:bg-[#0D1527] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{ind}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Roles Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Target Roles & Skill Families ({selectedRoles.length} selected)</span>
              </label>
              <span className="text-[11px] text-slate-400">Click to toggle</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_ROLES.map((r) => {
                const isSelected = selectedRoles.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRole(r)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-[#0D1527] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salary Preferences */}
          <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Minimum Monthly Base Salary Preference</span>
              </label>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                ${minSalaryInput.toLocaleString()} USD / month
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={12000}
              step={250}
              value={minSalaryInput}
              onChange={(e) => setMinSalaryInput(Number(e.target.value))}
              className="w-full accent-[#0066CC] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>$500/mo</span>
              <span>$3,500/mo</span>
              <span>$7,000/mo</span>
              <span>$12,000+/mo</span>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnSalary}
                onChange={(e) => setNotifyOnSalary(e.target.checked)}
                className="rounded text-[#0066CC] focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300 text-xs">
                Alert me immediately if an employer raises the budget on an existing role that matches my skills
              </span>
            </label>
          </div>

          {/* Work Arrangement & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Work Arrangement</span>
              </label>
              <div className="flex gap-2">
                {WORK_ARRANGEMENTS.map((arr) => {
                  const isSelected = selectedArrangements.includes(arr);
                  return (
                    <button
                      key={arr}
                      type="button"
                      onClick={() => toggleArrangement(arr)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0066CC] text-white border-[#0066CC]'
                          : 'bg-white dark:bg-[#0D1527] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {arr}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Notification Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'immediate' | 'daily' | 'weekly')}
                className="w-full px-3 py-2 bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium outline-none"
              >
                <option value="immediate">Immediate (as soon as posted)</option>
                <option value="daily">Daily Digest (9:00 AM UTC)</option>
                <option value="weekly">Weekly Briefing (Mondays)</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D1527] border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSendTestDispatch}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Digest</span>
            </button>
            <button
              type="button"
              onClick={handleUnsubscribeFromSettings}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Unsubscribe from Alerts</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
              <span>Save Alert Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
