import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Layers,
  Send,
  Globe,
  Phone,
  Mail,
  FileText,
  UserCheck,
} from 'lucide-react';

interface PartnerSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'employer' | 'candidate';
  onCandidateRegistered?: (candidateInfo: any) => void;
  onEmployerPartnered?: (partnerInfo: any) => void;
}

export const PartnerSignUpModal: React.FC<PartnerSignUpModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'employer',
  onCandidateRegistered,
  onEmployerPartnered,
}) => {
  const [activeTab, setActiveTab] = useState<'employer' | 'candidate'>(initialRole);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  // Employer Form State
  const [employerForm, setEmployerForm] = useState({
    partnerType: 'company', // 'company' | 'agency' | 'individual'
    companyName: '',
    contactName: '',
    workEmail: '',
    phone: '',
    country: 'Nigeria',
    companySize: '11-50 employees',
    hiringVolume: '1-5 roles / quarter',
    moduleInterest: ['talent_addon', 'job_board'],
    notes: '',
  });

  // Candidate Form State
  const [candidateForm, setCandidateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    targetRole: '',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    workPreference: 'Remote',
    primarySkills: '',
    expectedSalary: '',
    country: 'Nigeria',
    linkedinOrPortfolio: '',
    receiveAlerts: true,
  });

  if (!isOpen) return null;

  const toggleEmployerInterest = (item: string) => {
    setEmployerForm((prev) => ({
      ...prev,
      moduleInterest: prev.moduleInterest.includes(item)
        ? prev.moduleInterest.filter((i) => i !== item)
        : [...prev.moduleInterest, item],
    }));
  };

  const handleEmployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `MSME-PARTNER-${Date.now().toString().slice(-6)}`;
    setReferenceId(ref);

    const partnerData = {
      ...employerForm,
      referenceId: ref,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('msmebooks_partner_inquiries') || '[]');
      existing.unshift(partnerData);
      localStorage.setItem('msmebooks_partner_inquiries', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    if (onEmployerPartnered) onEmployerPartnered(partnerData);
    setSubmitted(true);
  };

  const handleCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `MSME-CAND-${Date.now().toString().slice(-6)}`;
    setReferenceId(ref);

    const candidateData = {
      ...candidateForm,
      referenceId: ref,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('msmebooks_candidate_network') || '[]');
      existing.unshift(candidateData);
      localStorage.setItem('msmebooks_candidate_network', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    if (onCandidateRegistered) onCandidateRegistered(candidateData);
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131D35] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden relative transition-colors duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#14243A] via-[#1a3354] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#B5E61D] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MsmeBooks Talent & Recruitment Network</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {submitted
                ? 'Registration Confirmed!'
                : activeTab === 'employer'
                ? 'Partner as an Employer or Recruiter'
                : 'Join the Pan-African Talent Network'}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not submitted yet */}
        {!submitted && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1527] px-6 pt-3">
            <button
              onClick={() => setActiveTab('employer')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'employer'
                  ? 'border-[#0066CC] dark:border-[#38BDF8] text-[#0066CC] dark:text-[#38BDF8]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Employers & Recruiters</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#B5E61D]/70 dark:bg-[#B5E61D] text-[#14243A] text-[10px] font-extrabold">
                Partner
              </span>
            </button>
            <button
              onClick={() => setActiveTab('candidate')}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'candidate'
                  ? 'border-[#0066CC] dark:border-[#38BDF8] text-[#0066CC] dark:text-[#38BDF8]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>For Candidates & Job Seekers</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-extrabold">
                Talent Pool
              </span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            /* Success confirmation screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-[#14243A] dark:text-white mb-2">
                {activeTab === 'employer'
                  ? 'Welcome to the Recruitment Partner Network!'
                  : 'Welcome to the Talent Community!'}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                {activeTab === 'employer'
                  ? 'Your partner inquiry and organization profile have been registered. A talent acquisition partner specialist will contact you within 24 hours to help activate your recruitment module.'
                  : 'Your candidate profile has been registered in our verified Pan-African talent directory. Hiring managers and partner recruiters will match you with upcoming positions.'}
              </p>

              {/* Reference ID card */}
              <div className="bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-w-sm mx-auto mb-6">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Registration Reference ID</div>
                <div className="font-mono text-base font-bold text-[#0066CC] dark:text-[#38BDF8] tracking-wide">
                  {referenceId}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Return to Job Board
                </button>
              </div>
            </div>
          ) : activeTab === 'employer' ? (
            /* Employer & Recruiter Partner Sign-Up Form */
            <form onSubmit={handleEmployerSubmit} className="space-y-5">
              {/* Value Proposition Callout */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#14243A] dark:text-white">Open Ecosystem: </span>
                  MsmeBooks allows companies, hiring managers, and independent recruiters to leverage our AI resume parser, candidate pipeline, and Pan-African job distribution.
                </div>
              </div>

              {/* Partner Type Selector */}
              <div>
                <label className="block text-xs font-bold text-[#14243A] dark:text-slate-200 uppercase tracking-wider mb-2">
                  I Am Partnering As:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'company', label: 'Direct Company / Employer', desc: 'Hiring for internal roles' },
                    { id: 'agency', label: 'Recruitment Agency', desc: 'Placing for multiple clients' },
                    { id: 'individual', label: 'Individual Talent Scout', desc: 'Independent recruiter' },
                  ].map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setEmployerForm((prev) => ({ ...prev, partnerType: type.id }))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        employerForm.partnerType === type.id
                          ? 'border-[#0066CC] dark:border-[#38BDF8] bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-[#0066CC]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1527] hover:bg-slate-50 dark:hover:bg-[#1A284A]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#14243A] dark:text-white">{type.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company / Organization Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Company / Agency Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={employerForm.companyName}
                    onChange={(e) => setEmployerForm((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g. PayFlow Africa or Apex Recruiters"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#0066CC] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={employerForm.contactName}
                    onChange={(e) => setEmployerForm((prev) => ({ ...prev, contactName: e.target.value }))}
                    placeholder="e.g. Amara Okafor"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#0066CC] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Work Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={employerForm.workEmail}
                    onChange={(e) => setEmployerForm((prev) => ({ ...prev, workEmail: e.target.value }))}
                    placeholder="talent@yourcompany.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#0066CC] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={employerForm.phone}
                    onChange={(e) => setEmployerForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-1 focus:ring-[#0066CC] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Company Size & Hiring Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Company / Practice Size
                  </label>
                  <select
                    value={employerForm.companySize}
                    onChange={(e) => setEmployerForm((prev) => ({ ...prev, companySize: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                  >
                    <option value="1-10 employees">1 - 10 employees (Startup / Boutique)</option>
                    <option value="11-50 employees">11 - 50 employees (Growing MSME)</option>
                    <option value="51-200 employees">51 - 200 employees (Scale-up)</option>
                    <option value="200+ employees">200+ employees (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Estimated Hiring Volume
                  </label>
                  <select
                    value={employerForm.hiringVolume}
                    onChange={(e) => setEmployerForm((prev) => ({ ...prev, hiringVolume: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                  >
                    <option value="1-2 roles / quarter">1 - 2 roles / quarter</option>
                    <option value="3-5 roles / quarter">3 - 5 roles / quarter</option>
                    <option value="6-15 roles / quarter">6 - 15 roles / quarter</option>
                    <option value="Continuous Hiring">Continuous High-Volume Hiring</option>
                  </select>
                </div>
              </div>

              {/* Module Interests */}
              <div>
                <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-2">
                  What modules or features are you interested in?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'talent_addon', label: 'Recruitment & Talent Acquisition Add-on' },
                    { id: 'job_board', label: 'Post Vacancies to Pan-African Board' },
                    { id: 'ai_screening', label: 'AI Resume Parsing & Candidate Scoring' },
                    { id: 'payroll_sync', label: 'Sync Hires with MsmeBooks Payroll' },
                  ].map((feat) => {
                    const isChecked = employerForm.moduleInterest.includes(feat.id);
                    return (
                      <button
                        type="button"
                        key={feat.id}
                        onClick={() => toggleEmployerInterest(feat.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50/80 dark:bg-blue-950/60 border-[#0066CC] dark:border-[#38BDF8] text-[#0066CC] dark:text-[#38BDF8] font-semibold'
                            : 'bg-slate-50 dark:bg-[#0D1527] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{feat.label}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-[#0066CC] dark:bg-[#0066CC] border-[#0066CC] dark:border-[#38BDF8] text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                  Specific Requirements or Role Profiles (Optional)
                </label>
                <textarea
                  rows={2}
                  value={employerForm.notes}
                  onChange={(e) => setEmployerForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g., Looking to recruit 3 senior full-stack developers in Nigeria and Kenya within the next 30 days..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#003D7A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#B5E61D]" />
                  <span>Submit Partner Application & Get Module Access</span>
                </button>
                <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                  No setup fees for standard partner onboarding. Instant access to community job posting.
                </div>
              </div>
            </form>
          ) : (
            /* Candidate & Job Seeker Sign-Up Form */
            <form onSubmit={handleCandidateSubmit} className="space-y-4">
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#14243A] dark:text-white">Verified Pan-African Talent Pool: </span>
                  Join thousands of software engineers, finance specialists, product managers, and operations leaders discovered by top African employers.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.fullName}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="e.g. Tunde Balogun"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={candidateForm.email}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="tunde@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Target Job Title / Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.targetRole}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={candidateForm.experienceLevel}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, experienceLevel: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                  >
                    <option value="Entry-Level / Graduate (0-2 yrs)">Entry-Level / Graduate (0-2 yrs)</option>
                    <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                    <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                    <option value="Lead / Executive (8+ yrs)">Lead / Executive (8+ yrs)</option>
                  </select>
                </div>
              </div>

              {/* Skills and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Core Skills (Comma separated) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.primarySkills}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, primarySkills: e.target.value }))}
                    placeholder="React, TypeScript, Node.js, SQL"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Preferred Work Arrangement
                  </label>
                  <select
                    value={candidateForm.workPreference}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, workPreference: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
                  >
                    <option value="Remote">100% Remote (Pan-Africa / Global)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Open to Any">Open to Any Arrangement</option>
                  </select>
                </div>
              </div>

              {/* Salary Expectation & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    Target Monthly Salary (USD or Local)
                  </label>
                  <input
                    type="text"
                    value={candidateForm.expectedSalary}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, expectedSalary: e.target.value }))}
                    placeholder="e.g. $2,500 - $3,500/mo or ₦1,500,000/mo"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14243A] dark:text-slate-200 mb-1">
                    LinkedIn URL or GitHub/Portfolio
                  </label>
                  <input
                    type="url"
                    value={candidateForm.linkedinOrPortfolio}
                    onChange={(e) => setCandidateForm((prev) => ({ ...prev, linkedinOrPortfolio: e.target.value }))}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-[#0D1527] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Opt-in check */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cand-alerts"
                  checked={candidateForm.receiveAlerts}
                  onChange={(e) => setCandidateForm((prev) => ({ ...prev, receiveAlerts: e.target.checked }))}
                  className="w-4 h-4 text-[#0066CC] rounded border-slate-300 dark:border-slate-600"
                />
                <label htmlFor="cand-alerts" className="text-xs text-slate-600 dark:text-slate-300">
                  Notify me when new roles matching my skills are posted by MsmeBooks or partner employers
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#003D7A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-[#B5E61D]" />
                  <span>Join Pan-African Talent Directory</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
