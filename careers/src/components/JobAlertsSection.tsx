import React, { useState, useMemo } from 'react';
import {
  BellRing,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Send,
  Eye,
  X,
  ExternalLink,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Inbox,
  AlertCircle,
  Clock,
  Briefcase,
  MapPin,
  Building2,
} from 'lucide-react';
import { JobAlertSubscription, Job } from '../types/career';
import { INITIAL_JOBS } from '../data/initialJobs';
import { useCurrency } from '../context/CurrencyContext';
import { JobAlertSettingsModal } from './JobAlertSettingsModal';
import { Sliders } from 'lucide-react';

interface JobAlertsProps {
  onSubscribeAlert: (sub: JobAlertSubscription) => void;
  onUnsubscribeAlert?: (tokenOrEmail: string) => void;
  allJobs?: Job[];
}

export const JobAlertsSection: React.FC<JobAlertsProps> = ({
  onSubscribeAlert,
  onUnsubscribeAlert,
  allJobs = INITIAL_JOBS,
}) => {
  const { formatSalaryRange } = useCurrency();

  // Alert Criteria Form State
  const [email, setEmail] = useState('');
  const [jobTitleKeyword, setJobTitleKeyword] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [department, setDepartment] = useState('All Departments');
  const [location, setLocation] = useState('All Locations');
  const [employmentType, setEmploymentType] = useState('All Types');
  const [workArrangement, setWorkArrangement] = useState('All Arrangements');
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly'>('daily');

  // Multi-step verification state
  const [step, setStep] = useState<'form' | 'verifying' | 'success'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');
  const [activeSubscription, setActiveSubscription] = useState<JobAlertSubscription | null>(null);

  // Modals & Active Subscriptions List
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [lookupEmail, setLookupEmail] = useState('');
  const [manageFeedback, setManageFeedback] = useState<string | null>(null);
  const [savedSubscriptions, setSavedSubscriptions] = useState<JobAlertSubscription[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_job_alerts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filter Matching Jobs for the Simulated Alert Email Preview and Live Counter
  const matchingJobs = useMemo(() => {
    return allJobs.filter((j) => {
      if (jobTitleKeyword.trim()) {
        const kw = jobTitleKeyword.toLowerCase();
        const titleMatch = j.title.toLowerCase().includes(kw);
        const skillsMatch = j.skills.some((s) => s.toLowerCase().includes(kw));
        const descMatch = j.shortDescription.toLowerCase().includes(kw);
        if (!titleMatch && !skillsMatch && !descMatch) return false;
      }
      if (department !== 'All Departments' && j.department !== department) return false;
      if (
        location !== 'All Locations' &&
        !j.location.country.toLowerCase().includes(location.split(' ')[0].toLowerCase()) &&
        !j.location.city.toLowerCase().includes(location.split(' ')[0].toLowerCase())
      ) {
        return false;
      }
      if (employmentType !== 'All Types' && j.employmentType !== employmentType) return false;
      if (workArrangement !== 'All Arrangements' && j.workArrangement !== workArrangement) return false;
      return true;
    });
  }, [allJobs, jobTitleKeyword, department, location, employmentType, workArrangement]);

  // Fallback to top 3 jobs if zero match exact criteria for email preview
  const previewJobs = matchingJobs.length > 0 ? matchingJobs.slice(0, 3) : allJobs.slice(0, 3);

  // Generate random 6-digit code
  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please provide a valid email address to receive alerts.');
      return;
    }

    const code = generateCode();
    const token = `unsub_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    const formattedCategory = jobTitleKeyword.trim() ? `${jobTitleKeyword.trim()} (${category})` : category;

    const newSub: JobAlertSubscription = {
      id: `alert-${Date.now()}`,
      email: email.trim(),
      category: formattedCategory,
      department,
      location,
      employmentType,
      workArrangement,
      frequency,
      isVerified: false,
      verificationCode: code,
      subscribedAt: new Date().toISOString(),
      unsubscribeToken: token,
    };

    setActiveSubscription(newSub);
    setVerificationCode(code);
    setEnteredCode('');
    setError('');
    setStep('verifying');
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredCode.trim() !== verificationCode) {
      setError('Invalid verification code. Please check the code and try again.');
      return;
    }

    if (activeSubscription) {
      const verifiedSub: JobAlertSubscription = {
        ...activeSubscription,
        isVerified: true,
      };
      setActiveSubscription(verifiedSub);
      onSubscribeAlert(verifiedSub);

      // Save to localStorage & local state
      try {
        const stored = JSON.parse(localStorage.getItem('msmebooks_job_alerts') || '[]');
        const updated = [verifiedSub, ...stored.filter((s: any) => s.email !== verifiedSub.email || s.category !== verifiedSub.category)];
        localStorage.setItem('msmebooks_job_alerts', JSON.stringify(updated));
        setSavedSubscriptions(updated);
      } catch (err) {
        console.error(err);
      }
    }

    setError('');
    setStep('success');
  };

  const handleQuickFillCode = () => {
    setEnteredCode(verificationCode);
    setError('');
  };

  const handleResendCode = () => {
    const newCode = generateCode();
    setVerificationCode(newCode);
    setEnteredCode('');
    setError('');
    if (activeSubscription) {
      setActiveSubscription({
        ...activeSubscription,
        verificationCode: newCode,
      });
    }
  };

  const handleUnsubscribe = (tokenOrEmail?: string) => {
    const identifier = tokenOrEmail || activeSubscription?.unsubscribeToken || activeSubscription?.email || lookupEmail;
    if (!identifier) return;

    if (onUnsubscribeAlert) {
      onUnsubscribeAlert(identifier);
    }

    try {
      const stored: JobAlertSubscription[] = JSON.parse(localStorage.getItem('msmebooks_job_alerts') || '[]');
      const filtered = stored.filter(
        (a) =>
          a.unsubscribeToken !== identifier &&
          a.email.toLowerCase() !== identifier.toLowerCase() &&
          a.id !== identifier
      );
      localStorage.setItem('msmebooks_job_alerts', JSON.stringify(filtered));
      setSavedSubscriptions(filtered);
    } catch (err) {
      console.error(err);
    }

    setManageFeedback(`Successfully unsubscribed (${identifier}). You will no longer receive job alerts.`);
    if (activeSubscription && (activeSubscription.unsubscribeToken === identifier || activeSubscription.email.toLowerCase() === identifier.toLowerCase())) {
      setActiveSubscription(null);
      setStep('form');
    }
  };

  const handleResetForm = () => {
    setEmail('');
    setStep('form');
    setError('');
    setActiveSubscription(null);
  };

  return (
    <section id="job-alerts" className="py-20 bg-slate-50 dark:bg-[#091122] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#111A30] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl transition-colors duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0066CC]/10 dark:bg-[#38BDF8]/15 border border-[#0066CC]/20 dark:border-[#38BDF8]/30 flex items-center justify-center text-[#0066CC] dark:text-[#38BDF8] shrink-0">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
                  <span>Personalized Opportunity Radar</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#14243A] dark:text-white tracking-tight">
                  Candidate Job Alert Subscription
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Specify your exact career criteria and receive instant, daily, or weekly notifications with verified unsubscribe control.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0066CC]/10 dark:bg-[#38BDF8]/15 hover:bg-[#0066CC]/20 text-[#0066CC] dark:text-[#38BDF8] text-xs font-bold border border-[#0066CC]/20 dark:border-[#38BDF8]/30 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Configure industry, role and salary alert preferences"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Job Alert Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLookupEmail(email);
                  setIsManageModalOpen(true);
                  setManageFeedback(null);
                }}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0066CC] dark:hover:text-[#38BDF8] underline decoration-dotted transition-colors"
              >
                Manage or Unsubscribe
              </button>
            </div>
          </div>

          {/* =========================================================================
              STEP 1: SUBSCRIPTION CRITERIA FORM
             ========================================================================= */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Core Filtering Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 0. Target Job Title or Keywords */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>Target Job Title or Keywords (Optional)</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">e.g. Senior Full-Stack, Backend, DevOps, Product</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitleKeyword}
                    onChange={(e) => setJobTitleKeyword(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Developer, TypeScript, Ledger, SRE..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all font-medium"
                  />
                </div>

                {/* 1. Job Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Technology & Engineering">Technology & Engineering</option>
                    <option value="Product & UX Design">Product & UX Design</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Sales & Business Development">Sales & Business Development</option>
                    <option value="Customer Operations & Support">Customer Operations & Support</option>
                    <option value="Data Science & Artificial Intelligence">Data Science & AI</option>
                    <option value="Executive & People Operations">Executive & People Ops</option>
                  </select>
                </div>

                {/* 2. Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all"
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Business Development">Sales & Business Development</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Data & Artificial Intelligence">Data & AI</option>
                  </select>
                </div>

                {/* 3. Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Location Preference
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all"
                  >
                    <option value="All Locations">All Pan-African & Global Hubs</option>
                    <option value="Remote">Remote Only (Pan-Africa / Global)</option>
                    <option value="Nigeria">Nigeria (Lagos / Abuja)</option>
                    <option value="Kenya">Kenya (Nairobi)</option>
                    <option value="Rwanda">Rwanda (Kigali)</option>
                    <option value="Ghana">Ghana (Accra)</option>
                    <option value="South Africa">South Africa (Johannesburg / Cape Town)</option>
                    <option value="Egypt">Egypt (Cairo)</option>
                    <option value="Morocco">Morocco (Casablanca)</option>
                    <option value="United Kingdom">United Kingdom (London)</option>
                  </select>
                </div>

                {/* 4. Employment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all"
                  >
                    <option value="All Types">All Types (Full, Part, Contract)</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract / Project-based</option>
                    <option value="Internship">Graduate Internship</option>
                  </select>
                </div>

                {/* 5. Work Arrangement */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Work Arrangement
                  </label>
                  <select
                    value={workArrangement}
                    onChange={(e) => setWorkArrangement(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all"
                  >
                    <option value="All Arrangements">All Arrangements</option>
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid (Flexible In-Office)</option>
                    <option value="On-site">On-site Hub</option>
                  </select>
                </div>

                {/* 6. Frequency Options: immediate, daily, weekly */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none transition-all font-semibold"
                  >
                    <option value="immediate">Immediate (Real-Time Notification)</option>
                    <option value="daily">Daily Digest (Morning Briefing)</option>
                    <option value="weekly">Weekly Digest (Curated Weekend Summary)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Live Matching Jobs Radar Bar */}
              <div className="p-3 bg-gradient-to-r from-blue-50/90 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    Dynamic Match Radar:
                  </span>
                  <span className="text-[#0066CC] dark:text-[#38BDF8] font-extrabold">
                    {matchingJobs.length} {matchingJobs.length === 1 ? 'Open Position Matches' : 'Open Positions Match'} Your Preferences
                  </span>
                </div>
                {matchingJobs.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Latest:</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-[#131D35] border border-blue-200 dark:border-blue-800 font-medium">
                      {matchingJobs[0].title} · {matchingJobs[0].location.city || matchingJobs[0].location.country}
                    </span>
                  </div>
                )}
              </div>

              {/* Email Address & Submit */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. adekunle.candidate@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4 sm:pt-6">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-5 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Subscribe to Job Alerts</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Includes 2-step email verification to prevent spam.</span>
                  </span>
                  <span>Every alert email features a 1-click instant unsubscribe link.</span>
                </div>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 2: EMAIL VERIFICATION STEP
             ========================================================================= */}
          {step === 'verifying' && activeSubscription && (
            <div className="space-y-6 animate-in fade-in">
              {/* Simulation notice banner */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0066CC] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0066CC] dark:text-[#38BDF8]">
                      Simulated Email Verification Sent
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      A 6-digit confirmation PIN was dispatched to <strong>{activeSubscription.email}</strong>.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-[#131D35] px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-700 shadow-2xs">
                  <span className="text-[11px] text-slate-400">Demo Code:</span>
                  <span className="font-mono font-extrabold text-[#0066CC] dark:text-[#38BDF8] text-sm tracking-wider">
                    {verificationCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickFillCode}
                    className="ml-1 px-2 py-0.5 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded text-[10px] font-bold"
                  >
                    Quick Fill
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerify} className="max-w-md mx-auto space-y-4 py-2">
                <div>
                  <label className="block text-xs font-bold text-center text-slate-700 dark:text-slate-300 mb-2">
                    Enter the 6-Digit Code to Confirm Your Subscription
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 582910"
                    autoFocus
                    className="w-full text-center tracking-[0.35em] font-mono text-xl py-3 px-4 bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-2xl border-2 border-slate-300 dark:border-slate-600 focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Change Email
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Activate</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-xs font-semibold text-slate-500 hover:text-[#0066CC] dark:hover:text-[#38BDF8] flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Didn't receive code? Resend new code</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              STEP 3: SUCCESS & EMAIL PREVIEW / UNSUBSCRIBE ACCESS
             ========================================================================= */}
          {step === 'success' && activeSubscription && (
            <div className="py-6 space-y-6 animate-in fade-in">
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6 sm:p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#14243A] dark:text-white">
                  Job Alert Activated & Verified!
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                  We have verified <strong>{activeSubscription.email}</strong>. You will receive{' '}
                  <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">
                    {activeSubscription.frequency === 'immediate'
                      ? 'immediate notifications as new roles are posted'
                      : activeSubscription.frequency === 'daily'
                      ? 'a daily morning digest'
                      : 'a weekly curated weekend summary'}
                  </span>{' '}
                  matching your specific criteria.
                </p>

                {/* Subscribed Criteria Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                  <span className="px-3 py-1 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium">
                    Category: <strong>{activeSubscription.category}</strong>
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium">
                    Department: <strong>{activeSubscription.department}</strong>
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium">
                    Location: <strong>{activeSubscription.location}</strong>
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium">
                    Arrangement: <strong>{activeSubscription.workArrangement}</strong>
                  </span>
                  <span className="px-3 py-1 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium">
                    Type: <strong>{activeSubscription.employmentType}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Preview Email & Unsubscribe link demonstration */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailPreviewOpen(true)}
                  className="w-full sm:w-auto py-2.5 px-5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Simulated Alert Email & Unsubscribe Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUnsubscribe(activeSubscription.unsubscribeToken)}
                  className="w-full sm:w-auto py-2.5 px-4 bg-white dark:bg-[#1A284A] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Test Instant Unsubscribe</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto py-2.5 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
                >
                  Create another alert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SIMULATED EMAIL NOTIFICATION PREVIEW MODAL
         ========================================================================= */}
      {isEmailPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#0D1527] rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            {/* Fake Webmail Header */}
            <div className="bg-slate-100 dark:bg-[#131D35] px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                  Webmail Inbox Simulation
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Meta Info */}
            <div className="p-4 sm:p-5 bg-white dark:bg-[#0D1527] border-b border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">From:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  MsmeBooks Career Alerts &lt;careers-alerts@msmebooks.org&gt;
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">To:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {activeSubscription?.email || email || 'candidate@domain.com'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">
                  [MsmeBooks Alert] {previewJobs.length} new vacancies matching your criteria
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs bg-[#F8FAFC] dark:bg-[#070D1A]">
              {/* Brand Header */}
              <div className="bg-white dark:bg-[#111A30] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0066CC] text-white flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <span className="text-base font-extrabold text-[#14243A] dark:text-white">
                    Msme<span className="text-[#0066CC] dark:text-[#38BDF8]">Books</span> Careers
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#14243A] dark:text-white">
                  New Opportunities Matching Your Alert
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Alert frequency: <strong>{activeSubscription?.frequency || frequency}</strong> · Filter:{' '}
                  {activeSubscription?.department || department} · {activeSubscription?.location || location}
                </p>
              </div>

              {/* Matched Job List */}
              <div className="space-y-3">
                {previewJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-white dark:bg-[#111A30] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0066CC] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider">
                          {job.department} · {job.workArrangement}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {job.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {job.company?.name || 'MsmeBooks'}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {job.location.city}, {job.location.country}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {formatSalaryRange(
                            job.salary.min,
                            job.salary.max,
                            job.salary.currency,
                            job.salary.period,
                            job.salary.isPublic
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                          Actively hiring
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                      {job.shortDescription}
                    </p>
                  </div>
                ))}
              </div>

              {/* Working Unsubscribe Footer */}
              <div className="p-4 bg-slate-100 dark:bg-[#111A30] rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <p>
                  You received this email notification because you subscribed to MsmeBooks Job Alerts for{' '}
                  <span className="font-mono font-semibold">{activeSubscription?.email || email}</span>.
                </p>

                <div className="pt-1 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailPreviewOpen(false);
                      handleUnsubscribe(activeSubscription?.unsubscribeToken);
                    }}
                    className="text-rose-600 dark:text-rose-400 font-bold underline hover:text-rose-800 transition-colors"
                  >
                    Click here to Unsubscribe immediately
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailPreviewOpen(false);
                      setIsManageModalOpen(true);
                    }}
                    className="text-[#0066CC] dark:text-[#38BDF8] font-bold underline hover:text-[#0052A3]"
                  >
                    Update Alert Preferences
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-slate-50 dark:bg-[#131D35] border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEmailPreviewOpen(false)}
                className="px-5 py-2 bg-[#0066CC] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0052A3]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MANAGE / UNSUBSCRIBE MODAL DIALOG
         ========================================================================= */}
      {isManageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#0D1527] rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Manage or Unsubscribe</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {manageFeedback ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{manageFeedback}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(false)}
                  className="w-full mt-2 py-2 bg-[#0066CC] text-white rounded-lg font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {savedSubscriptions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                      Your Active Alert Subscriptions ({savedSubscriptions.length})
                    </span>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {savedSubscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 bg-slate-50 dark:bg-[#1A284A] rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {sub.category || 'All Categories'}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {sub.department} · {sub.location} · {sub.frequency}
                            </div>
                            <div className="text-[10px] text-[#0066CC] dark:text-[#38BDF8] font-mono truncate">
                              {sub.email}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnsubscribe(sub.unsubscribeToken || sub.id || sub.email)}
                            className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-lg font-bold text-[11px] shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Unsubscribe</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Unsubscribe by Email Address or Token:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Enter your email to cancel all active job notifications across any device.
                  </p>

                  <input
                    type="text"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="e.g. adekunle@gmail.com or token"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                  />

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsManageModalOpen(false)}
                      className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={!lookupEmail.trim()}
                      onClick={() => handleUnsubscribe(lookupEmail)}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      Unsubscribe All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dedicated Job Alert Settings Modal */}
      <JobAlertSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </section>
  );
};
