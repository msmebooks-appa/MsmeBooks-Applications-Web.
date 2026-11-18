import React, { useState, useEffect, useMemo } from 'react';
import {
  Job,
  CandidateApplication,
  TalentCommunityMember,
  JobAlertSubscription,
  PipelineStatus,
} from '../types/career';
import { InterviewCalendar } from './InterviewCalendar';
import { AddToCalendarButton } from './AddToCalendarButton';
import { ResumePdfPreviewModal } from './ResumePdfPreviewModal';
import {
  Users,
  Briefcase,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Clock,
  Star,
  ExternalLink,
  ChevronDown,
  Mail,
  Send,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  Inbox,
  BellRing,
  Copy,
  Check,
  CalendarX,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  jobs: Job[];
  applications: CandidateApplication[];
  talentMembers: TalentCommunityMember[];
  jobAlerts: JobAlertSubscription[];
  onUpdateJob: (job: Job) => void;
  onCreateJob: (job: Job) => void;
  onUpdateApplicationStatus: (appId: string, newStatus: PipelineStatus) => void;
  onBulkUpdateApplicationStatus?: (appIds: string[], newStatus: PipelineStatus) => void;
  onAddRecruiterNote: (appId: string, note: string) => void;
  onScheduleInterview: (appId: string, date: string) => void;
  onExitAdmin: () => void;
}

const PIPELINE_STAGES: { key: PipelineStatus; label: string; color: string }[] = [
  { key: 'applied', label: 'Applied', color: 'bg-slate-100 text-slate-800' },
  { key: 'screening', label: 'Screening', color: 'bg-blue-100 text-blue-800' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
  { key: 'interview', label: 'Interview', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'assessment', label: 'Assessment', color: 'bg-amber-100 text-amber-800' },
  { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'hired', label: 'Hired', color: 'bg-emerald-600 text-white' },
  { key: 'rejected', label: 'Rejected', color: 'bg-rose-100 text-rose-800' },
  { key: 'withdrawn', label: 'Withdrawn', color: 'bg-slate-200 text-slate-600' },
];

// Deterministic Qualification Fit Calculator comparing candidate skills & experience against job requirements
export function calculateQualificationFit(
  app: CandidateApplication,
  jobs: Job[]
): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceBonus: number;
} {
  const targetJob = jobs.find((j) => j.id === app.jobId) || jobs.find((j) => j.title === app.jobTitle);
  const reqSkills = targetJob?.skills || [];
  const candidateSkills = app.skills || [];
  const summaryBlob = `${app.extractedSummary || ''} ${app.coverLetter || ''} ${app.currentJobTitle || ''}`.toLowerCase();

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  reqSkills.forEach((req) => {
    const reqLower = req.toLowerCase().trim();
    const inSkills = candidateSkills.some(
      (cs) => cs.toLowerCase().includes(reqLower) || reqLower.includes(cs.toLowerCase().trim())
    );
    const inText = summaryBlob.includes(reqLower);
    if (inSkills || inText) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const skillRatio = reqSkills.length > 0 ? matchedSkills.length / reqSkills.length : 0.72;
  const experienceBonus = Math.min(25, Math.max(5, Math.round((app.yearsOfExperience || 3) * 4)));
  const rawComputed = Math.round(skillRatio * 75 + experienceBonus);
  const blended =
    typeof app.aiMatchScore === 'number'
      ? Math.round(rawComputed * 0.6 + app.aiMatchScore * 0.4)
      : rawComputed;
  const score = Math.min(99, Math.max(38, blended));

  return { score, matchedSkills, missingSkills, experienceBonus };
}

const QualificationFitGauge: React.FC<{ score: number; size?: number }> = ({ score, size = 40 }) => {
  const strokeWidth = size >= 50 ? 5 : 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score >= 80 ? '#059669' : score >= 60 ? '#0066CC' : '#D97706';
  const textColor =
    score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-[#0066CC]' : 'text-amber-700';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute text-[10px] font-extrabold font-mono tabular-nums ${textColor}`}>
        {score}%
      </span>
    </div>
  );
};

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'confirmation' | 'scheduling' | 'reschedule' | 'status' | 'offer';
  triggerEvent: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface SentEmailLog {
  id: string;
  recipientName: string;
  recipientEmail: string;
  jobTitle: string;
  templateName: string;
  subject: string;
  sentAt: string;
  status: 'delivered' | 'opened';
  body: string;
}

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-app-confirm',
    name: 'Application Confirmation & Receipt',
    category: 'confirmation',
    triggerEvent: 'Dispatched immediately when candidate submits job application',
    subject: 'Application Received: {{jobTitle}} at MsmeBooks (Ref: {{referenceCode}})',
    variables: ['{{candidateName}}', '{{jobTitle}}', '{{referenceCode}}', '{{companyName}}'],
    body: `Dear {{candidateName}},

Thank you for your interest in joining MsmeBooks Technologies! We have received your application dossier and resume for the role of {{jobTitle}}.

Your unique application tracking reference code is: {{referenceCode}}.

Our engineering and talent team is reviewing your profile against our core rubrics. You can expect an update within 48 to 72 business hours.

Best regards,
Talent Acquisition Squad
MsmeBooks Technologies`,
  },
  {
    id: 'tpl-interview-invite',
    name: 'Interview Invitation & Scheduling',
    category: 'scheduling',
    triggerEvent: 'Dispatched when interview is scheduled by recruiter or hiring manager',
    subject: 'Interview Invitation: Technical Screening for {{jobTitle}} - MsmeBooks',
    variables: ['{{candidateName}}', '{{jobTitle}}', '{{interviewDate}}', '{{meetLink}}', '{{referenceCode}}'],
    body: `Hello {{candidateName}},

Congratulations! Following a comprehensive review of your credentials, we are pleased to invite you to a 45-minute technical screening interview for {{jobTitle}}.

Session Details:
• Date & Time: {{interviewDate}} (UTC)
• Video Room: Google Meet ({{meetLink}})
• Lead Interviewer: Adaobi Vance (Head of Talent) & Squad Leads

You can import this session into Google or Outlook Calendar from your candidate profile. If you have an unavoidable conflict, you can submit a formal reschedule request directly from your candidate dashboard.

Warm regards,
MsmeBooks Recruitment Team`,
  },
  {
    id: 'tpl-reschedule-confirm',
    name: 'Interview Reschedule Confirmation',
    category: 'reschedule',
    triggerEvent: 'Dispatched when recruiter approves candidate reschedule request',
    subject: 'Confirmed: Rescheduled Interview for {{jobTitle}} - MsmeBooks',
    variables: ['{{candidateName}}', '{{jobTitle}}', '{{interviewDate}}', '{{meetLink}}'],
    body: `Dear {{candidateName}},

Your request to reschedule your interview session for {{jobTitle}} has been approved.

Your revised interview schedule:
• New Date & Time: {{interviewDate}} (UTC)
• Video Access: {{meetLink}}

Your candidate calendar invitation has been updated. Please let us know if you have any questions ahead of our discussion.

Best regards,
MsmeBooks Talent Operations`,
  },
  {
    id: 'tpl-status-shortlisted',
    name: 'Candidate Shortlisted Status Update',
    category: 'status',
    triggerEvent: 'Triggered when candidate pipeline status moves to Shortlisted',
    subject: 'Application Update: Shortlisted for {{jobTitle}} (Ref: {{referenceCode}})',
    variables: ['{{candidateName}}', '{{jobTitle}}', '{{referenceCode}}'],
    body: `Dear {{candidateName}},

Great news! The hiring committee has reviewed your credentials and you have advanced to the Shortlisted stage for {{jobTitle}}.

Our team is currently syncing with squad leads to coordinate your upcoming interview round. Expect a formal calendar invitation shortly.

Best regards,
Talent Acquisition Squad
MsmeBooks Technologies`,
  },
  {
    id: 'tpl-offer-letter',
    name: 'Formal Employment Offer Letter',
    category: 'offer',
    triggerEvent: 'Triggered when candidate pipeline status moves to Offer',
    subject: 'Formal Offer: Welcome to MsmeBooks Technologies as {{jobTitle}}!',
    variables: ['{{candidateName}}', '{{jobTitle}}', '{{referenceCode}}'],
    body: `Dear {{candidateName}},

On behalf of the executive leadership at MsmeBooks Technologies, we are delighted to extend a formal offer of employment for the position of {{jobTitle}}!

Your exceptional performance across our evaluation rounds proved your technical rigor and alignment with our mission to build financial infrastructure for African businesses.

Please review your formal offer terms and onboarding roadmap in your candidate portal.

Welcome to the team!

Warmest regards,
Executive Talent Committee
MsmeBooks Technologies`,
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  jobs,
  applications,
  talentMembers,
  jobAlerts,
  onUpdateJob,
  onCreateJob,
  onUpdateApplicationStatus,
  onBulkUpdateApplicationStatus,
  onAddRecruiterNote,
  onScheduleInterview,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'calendar' | 'jobs' | 'talent' | 'alerts' | 'analytics' | 'emails'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Multi-select & Bulk Actions state
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [bulkActionToast, setBulkActionToast] = useState<string | null>(null);

  // Candidate detail modal
  const [viewingApp, setViewingApp] = useState<CandidateApplication | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [interviewDateInput, setInterviewDateInput] = useState('');

  // Read-only PDF Resume Preview modal
  const [previewResumeApp, setPreviewResumeApp] = useState<CandidateApplication | null>(null);

  // New Job creation modal
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Software Engineering');
  const [newJobLocation, setNewJobLocation] = useState('Remote (Pan-Africa)');
  const [newJobArrangement, setNewJobArrangement] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Contract' | 'Part-time'>('Full-time');
  const [newJobSalary, setNewJobSalary] = useState('3500 - 5000 USD/month');
  const [newJobDescription, setNewJobDescription] = useState('');

  // Automated Email Notification System State (User Request 6)
  const [emailLogs, setEmailLogs] = useState<SentEmailLog[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_email_logs');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'log-1',
        recipientName: 'Olumide Adebayo',
        recipientEmail: 'olumide.adebayo@gmail.com',
        jobTitle: 'Senior Backend Engineer (Fintech)',
        templateName: 'Application Confirmation & Receipt',
        subject: 'Application Received: Senior Backend Engineer (Fintech) at MsmeBooks (Ref: MSME-APP-2026-9142)',
        sentAt: '2026-10-23T08:15:00Z',
        status: 'opened',
        body: `Dear Olumide Adebayo,\n\nThank you for your interest in joining MsmeBooks Technologies! We have received your application dossier and resume for the role of Senior Backend Engineer (Fintech).\n\nYour unique application tracking reference code is: MSME-APP-2026-9142.\n\nOur engineering and talent team is reviewing your profile against our core rubrics. You can expect an update within 48 to 72 business hours.\n\nBest regards,\nTalent Acquisition Squad\nMsmeBooks Technologies`,
      },
      {
        id: 'log-2',
        recipientName: 'Olumide Adebayo',
        recipientEmail: 'olumide.adebayo@gmail.com',
        jobTitle: 'Senior Backend Engineer (Fintech)',
        templateName: 'Interview Invitation & Scheduling',
        subject: 'Interview Invitation: Technical Screening for Senior Backend Engineer (Fintech) - MsmeBooks',
        sentAt: '2026-10-23T09:30:00Z',
        status: 'opened',
        body: `Hello Olumide Adebayo,\n\nCongratulations! Following a comprehensive review of your credentials, we are pleased to invite you to a 45-minute technical screening interview for Senior Backend Engineer (Fintech).\n\nSession Details:\n• Date & Time: Oct 23, 2026 at 10:00 AM (UTC)\n• Video Room: Google Meet (meet.google.com/msme-talent-call)\n• Lead Interviewer: Adaobi Vance (Head of Talent) & Squad Leads\n\nYou can import this session into Google or Outlook Calendar from your candidate profile. If you have an unavoidable conflict, you can submit a formal reschedule request directly from your candidate dashboard.\n\nWarm regards,\nMsmeBooks Recruitment Team`,
      },
      {
        id: 'log-3',
        recipientName: 'Fatima Al-Mansoor',
        recipientEmail: 'fatima.almansoor@outlook.com',
        jobTitle: 'Lead Product Designer (B2B SaaS)',
        templateName: 'Application Confirmation & Receipt',
        subject: 'Application Received: Lead Product Designer (B2B SaaS) at MsmeBooks (Ref: MSME-APP-2026-8841)',
        sentAt: '2026-10-22T14:20:00Z',
        status: 'delivered',
        body: `Dear Fatima Al-Mansoor,\n\nThank you for applying for Lead Product Designer (B2B SaaS). Your reference code is MSME-APP-2026-8841. We are currently evaluating your portfolio designs.`,
      },
      {
        id: 'log-4',
        recipientName: 'Kwame Mensah',
        recipientEmail: 'kwame.mensah@ghana-fintech.org',
        jobTitle: 'Financial Controller (IFRS & Compliance)',
        templateName: 'Candidate Shortlisted Status Update',
        subject: 'Application Update: Shortlisted for Financial Controller (IFRS & Compliance) (Ref: MSME-APP-2026-3019)',
        sentAt: '2026-10-21T11:45:00Z',
        status: 'opened',
        body: `Dear Kwame Mensah,\n\nGreat news! The hiring committee has reviewed your credentials and you have advanced to the Shortlisted stage for Financial Controller (IFRS & Compliance).\n\nOur team is currently syncing with squad leads to coordinate your upcoming interview round. Expect a formal calendar invitation shortly.\n\nBest regards,\nTalent Acquisition Squad\nMsmeBooks Technologies`,
      },
    ];
  });

  // Candidate Reschedule Requests State (User Request 7)
  const [rescheduleRequests, setRescheduleRequests] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_reschedule_requests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleRescheduleUpdate = () => {
      try {
        const stored = localStorage.getItem('msmebooks_reschedule_requests');
        setRescheduleRequests(stored ? JSON.parse(stored) : []);
      } catch {}
    };
    window.addEventListener('msmebooks_reschedule_updated', handleRescheduleUpdate);
    return () => window.removeEventListener('msmebooks_reschedule_updated', handleRescheduleUpdate);
  }, []);

  // Email Test Dispatcher Modal State
  const [testModalTemplate, setTestModalTemplate] = useState<EmailTemplate | null>(null);
  const [testSelectedAppId, setTestSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [previewingEmailLog, setPreviewingEmailLog] = useState<SentEmailLog | null>(null);
  const [emailDispatchedToast, setEmailDispatchedToast] = useState<string | null>(null);

  const logEmail = (newLog: SentEmailLog) => {
    setEmailLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('msmebooks_email_logs', JSON.stringify(updated.slice(0, 50)));
      } catch {}
      return updated;
    });
  };

  const handleApproveReschedule = (reqId: string) => {
    const req = rescheduleRequests.find((r) => r.id === reqId);
    if (!req) return;

    const matchedApp = applications.find(
      (a) =>
        a.email.toLowerCase() === req.candidateEmail.toLowerCase() ||
        `${a.firstName} ${a.lastName}`.toLowerCase() === req.candidateName.toLowerCase()
    );

    const newIso = `${req.proposedDate}T${req.proposedTime || '10:00'}:00Z`;
    if (matchedApp) {
      onScheduleInterview(matchedApp.id, newIso);
    }

    const updatedRequests = rescheduleRequests.map((r) =>
      r.id === reqId ? { ...r, status: 'approved' } : r
    );
    setRescheduleRequests(updatedRequests);
    localStorage.setItem('msmebooks_reschedule_requests', JSON.stringify(updatedRequests));
    window.dispatchEvent(new Event('msmebooks_reschedule_updated'));

    const newLog: SentEmailLog = {
      id: `log-${Date.now()}`,
      recipientName: req.candidateName,
      recipientEmail: req.candidateEmail,
      jobTitle: req.jobTitle || 'Senior Backend Engineer',
      templateName: 'Interview Reschedule Confirmation',
      subject: `Confirmed: Rescheduled Interview for ${req.jobTitle || 'Role'} - MsmeBooks`,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      body: `Dear ${req.candidateName},\n\nYour request to reschedule your interview session for ${req.jobTitle || 'the role'} has been approved.\n\nYour revised interview schedule:\n• New Date & Time: ${req.proposedDate} at ${req.proposedTime || '10:00'} UTC\n• Video Access: meet.google.com/msme-talent-call\n\nYour candidate calendar invitation has been updated.\n\nBest regards,\nMsmeBooks Talent Operations`,
    };
    logEmail(newLog);
    setEmailDispatchedToast(`Approved reschedule & dispatched confirmation email to ${req.candidateName}`);
    setTimeout(() => setEmailDispatchedToast(null), 4000);
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJob = selectedJobFilter === 'ALL' || app.jobId === selectedJobFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || app.status === selectedStatusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  });

  const filteredAppIds = filteredApps.map((a) => a.id);
  const selectedFilteredCount = filteredAppIds.filter((id) => selectedAppIds.includes(id)).length;
  const allFilteredSelected = filteredApps.length > 0 && selectedFilteredCount === filteredApps.length;
  const someFilteredSelected = selectedFilteredCount > 0 && !allFilteredSelected;

  const toggleSelectApp = (appId: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedAppIds((prev) => prev.filter((id) => !filteredAppIds.includes(id)));
    } else {
      setSelectedAppIds((prev) => Array.from(new Set([...prev, ...filteredAppIds])));
    }
  };

  const handleBulkTransition = (targetStage: PipelineStatus) => {
    if (selectedAppIds.length === 0) return;
    if (onBulkUpdateApplicationStatus) {
      onBulkUpdateApplicationStatus(selectedAppIds, targetStage);
    } else {
      selectedAppIds.forEach((id) => onUpdateApplicationStatus(id, targetStage));
    }
    const stageMeta = PIPELINE_STAGES.find((s) => s.key === targetStage);
    const stageDisplay = targetStage === 'interview' ? 'Interviewing' : stageMeta?.label || targetStage;
    const count = selectedAppIds.length;
    setSelectedAppIds([]);
    setBulkMenuOpen(false);
    setBulkActionToast(
      `Updated ${count} selected application${count === 1 ? '' : 's'} to "${stageDisplay}".`
    );
    window.setTimeout(() => setBulkActionToast(null), 4000);
  };

  // CSV Exporter for Applicants
  const handleExportApplicantsCSV = () => {
    const headers = [
      'ReferenceCode',
      'CandidateName',
      'Email',
      'Phone',
      'Country',
      'City',
      'JobTitle',
      'Department',
      'Status',
      'YearsExperience',
      'SubmittedDate',
    ];

    const rows = applications.map((app) => [
      `"${app.referenceCode}"`,
      `"${app.firstName} ${app.lastName}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${app.country}"`,
      `"${app.city}"`,
      `"${app.jobTitle}"`,
      `"${app.department}"`,
      `"${app.status}"`,
      app.yearsOfExperience,
      `"${app.submittedAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `msmebooks_applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle adding recruiter note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingApp || !newNoteText.trim()) return;
    onAddRecruiterNote(viewingApp.id, newNoteText.trim());
    // update current viewing app in modal
    setViewingApp((prev) =>
      prev
        ? {
            ...prev,
            recruiterNotes: [
              ...prev.recruiterNotes,
              {
                id: `note-${Date.now()}`,
                author: 'HR Recruitment Team',
                date: new Date().toISOString(),
                text: newNoteText.trim(),
              },
            ],
          }
        : null
    );
    setNewNoteText('');
  };

  // Handle schedule interview
  const handleSaveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingApp || !interviewDateInput) return;
    onScheduleInterview(viewingApp.id, interviewDateInput);
    setViewingApp((prev) => (prev ? { ...prev, interviewDate: interviewDateInput } : null));
    alert(`Interview invitation recorded for ${viewingApp.firstName} on ${interviewDateInput}`);
  };

  // Handle creating new job
  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const newJob: Job = {
      id: `job-${Date.now()}`,
      slug: newJobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      referenceCode: `MSME-${newJobDept.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title: newJobTitle,
      company: {
        name: 'MsmeBooks Technologies',
        verified: true,
        website: 'https://www.msmebooks.org',
        employerType: 'Company',
      },
      department: newJobDept,
      location: {
        country: newJobLocation,
        city: newJobLocation.includes('Remote') ? 'Remote' : 'Lagos / Nairobi',
        isRemote: newJobLocation.includes('Remote'),
        isWorldwide: newJobLocation.includes('Worldwide'),
      },
      employmentType: newJobType,
      workArrangement: newJobArrangement,
      experienceLevel: 'Mid-Level',
      salary: {
        min: 3000,
        max: 5000,
        currency: 'USD',
        isPublic: true,
        period: 'month',
      },
      datePosted: new Date().toISOString(),
      applicationDeadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      shortDescription:
        newJobDescription ||
        `Exciting opportunity to join MsmeBooks as ${newJobTitle} to scale business operations across Africa.`,
      aboutRole:
        newJobDescription ||
        `As a ${newJobTitle} at MsmeBooks, you will collaborate with cross-functional teams to build and scale mission-critical systems.`,
      keyResponsibilities: [
        'Drive execution of high-impact roadmap goals.',
        'Collaborate with distributed engineering and business leaders.',
        'Maintain high quality and reliability across software touchpoints.',
      ],
      requiredQualifications: [
        '3+ years of relevant industry experience in SaaS, enterprise software, or fintech.',
        'Strong collaborative and problem-solving skills.',
      ],
      preferredQualifications: ['Prior experience in African fintech or retail ERP domains.'],
      skills: ['Problem Solving', 'SaaS', 'Leadership', 'Communication'],
      benefits: [
        'Competitive compensation package',
        'Health and wellness coverage',
        'Remote and hybrid flexibility',
      ],
      isFeatured: false,
      status: 'published',
      isSampleDemo: false,
      applicantsCount: 0,
    };

    onCreateJob(newJob);
    setShowCreateJobModal(false);
    setNewJobTitle('');
    setNewJobDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#14243A] text-white px-6 py-4 border-b border-slate-700 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0066CC] flex items-center justify-center font-bold text-white text-xs">
              HR
            </div>
            <div>
              <div className="font-bold text-base leading-none">
                MsmeBooks Recruitment Administration
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Authorized Talent Ops & Candidate Tracking
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportApplicantsCSV}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#B5E61D]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowCreateJobModal(true)}
              className="px-4 py-1.5 text-xs font-semibold bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Vacancy</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Back to Candidate Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Active Vacancies
            </div>
            <div className="text-3xl font-extrabold text-[#14243A] font-mono tabular-nums mt-1">
              {jobs.filter((j) => j.status === 'published').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Across 8 departments</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total Applicants
            </div>
            <div className="text-3xl font-extrabold text-[#0066CC] font-mono tabular-nums mt-1">
              {applications.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {applications.filter((a) => a.status === 'interview').length} currently interviewing
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Talent Community
            </div>
            <div className="text-3xl font-extrabold text-[#14243A] font-mono tabular-nums mt-1">
              {talentMembers.length + 142}
            </div>
            <div className="text-xs text-slate-400 mt-1">Pre-screened candidate pool</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Active Job Alerts
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums mt-1">
              {jobAlerts.length + 386}
            </div>
            <div className="text-xs text-slate-400 mt-1">Subscribers across Africa</div>
          </div>
        </div>

        {/* Candidate Reschedule Requests Alert Banner */}
        {rescheduleRequests.filter((r) => r.status === 'pending_review').length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-sm space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <CalendarX className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Candidate Interview Reschedule Request Received</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  {rescheduleRequests.filter((r) => r.status === 'pending_review').length} Action Required
                </span>
              </div>
              <span className="text-[11px] text-amber-700 font-semibold">Immediate Recruiter Action Needed</span>
            </div>

            {rescheduleRequests
              .filter((r) => r.status === 'pending_review')
              .map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">
                      {req.candidateName} · <span className="text-[#0066CC]">{req.jobTitle}</span>
                    </div>
                    <div className="text-slate-600 flex flex-wrap items-center gap-2">
                      <span>Original Slot: <span className="line-through text-slate-400">Oct 23, 2026 10:00 UTC</span></span>
                      <span>→</span>
                      <span>Requested New Slot: <strong className="text-emerald-700 font-mono">{req.proposedDate} at {req.proposedTime || '14:00'} UTC</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                      <strong>Reason:</strong> {req.reason} {req.note ? `— "${req.note}"` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveReschedule(req.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch Confirmation Email</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'pipeline'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applicant Pipeline ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'calendar'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Interview Calendar ({applications.filter((a) => !!a.interviewDate).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'jobs'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Vacancies ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'emails'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Automated Notifications ({DEFAULT_TEMPLATES.length})</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-[#0066CC] font-bold font-mono">
              {emailLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('talent')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'talent'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Talent Community</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'border-[#0066CC] text-[#0066CC]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Job Alerts Subscriptions</span>
          </button>
        </div>

        {/* TAB 1: APPLICANT PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicants by name, role, email..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-[#0066CC] outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Filter by Job */}
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none"
                >
                  <option value="ALL">All Job Vacancies</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>

                {/* Filter by Status */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none"
                >
                  <option value="ALL">All Stages</option>
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>

                {/* Bulk Actions Dropdown Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setBulkMenuOpen((prev) => !prev)}
                    disabled={selectedAppIds.length === 0}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors ${
                      selectedAppIds.length > 0
                        ? 'bg-[#0066CC] hover:bg-[#0052A3] text-white border-[#0052A3] shadow-xs cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                    title={
                      selectedAppIds.length > 0
                        ? `Apply a bulk stage transition to ${selectedAppIds.length} selected applications`
                        : 'Select one or more applications below to enable Bulk Actions'
                    }
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>
                      Bulk Actions{selectedAppIds.length > 0 ? ` (${selectedAppIds.length})` : ''}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {bulkMenuOpen && selectedAppIds.length > 0 && (
                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl border border-slate-200 shadow-xl z-40 p-1.5 space-y-0.5 animate-in fade-in">
                      <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                        Move {selectedAppIds.length} selected to stage:
                      </div>
                      {PIPELINE_STAGES.map((stage) => {
                        const displayLabel = stage.key === 'interview' ? 'Interviewing' : stage.label;
                        const isReject = stage.key === 'rejected';
                        return (
                          <button
                            key={stage.key}
                            type="button"
                            onClick={() => handleBulkTransition(stage.key)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                              isReject
                                ? 'text-rose-700 hover:bg-rose-50'
                                : 'text-slate-700 hover:bg-blue-50 hover:text-[#0066CC]'
                            }`}
                          >
                            <span>Transition to {displayLabel}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${stage.color}`}>
                              {displayLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Action Confirmation Toast */}
            {bulkActionToast && (
              <div className="p-3 bg-blue-50 border border-[#0066CC]/30 rounded-xl text-xs font-bold text-[#0066CC] flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bulkActionToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBulkActionToast(null)}
                  className="text-[#0066CC]/70 hover:text-[#0066CC] cursor-pointer"
                  aria-label="Dismiss bulk update notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Contextual Bulk Selection Action Bar */}
            {selectedAppIds.length > 0 && (
              <div className="px-4 py-3 bg-[#14243A] text-white rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-[#0066CC] text-white font-mono font-bold">
                    {selectedAppIds.length}
                  </span>
                  <span className="font-semibold">
                    application{selectedAppIds.length === 1 ? '' : 's'} selected for bulk stage update
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAppIds([]);
                      setBulkMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-white underline text-[11px] font-medium cursor-pointer ml-1"
                  >
                    Clear selection
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleBulkTransition('shortlisted')}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Shortlist
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkTransition('interview')}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0066CC] hover:bg-[#0052A3] text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Move to Interviewing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkTransition('offer')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Extend Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkTransition('rejected')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Reject Selected
                  </button>
                </div>
              </div>
            )}

            {/* Pipeline Applicants Table */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pl-4 pr-2 py-3.5 w-10">
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someFilteredSelected;
                          }}
                          onChange={toggleSelectAllFiltered}
                          disabled={filteredApps.length === 0}
                          aria-label="Select all visible applications"
                          className="w-4 h-4 rounded border-slate-300 text-[#0066CC] focus:ring-[#0066CC] cursor-pointer"
                        />
                      </th>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-5 py-3.5">Target Role</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5">Experience</th>
                      <th className="px-5 py-3.5">Qualification Fit</th>
                      <th className="px-5 py-3.5">Current Stage</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                          No applicants match the current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => {
                        const fit = calculateQualificationFit(app, jobs);
                        const isSelected = selectedAppIds.includes(app.id);
                        return (
                        <tr
                          key={app.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="pl-4 pr-2 py-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectApp(app.id)}
                              aria-label={`Select ${app.firstName} ${app.lastName}`}
                              className="w-4 h-4 rounded border-slate-300 text-[#0066CC] focus:ring-[#0066CC] cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-[#14243A]">
                              {app.firstName} {app.lastName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{app.email}</div>
                            <div className="text-[10px] text-slate-400">{app.referenceCode}</div>
                            {app.resumeFileName && (
                              <button
                                type="button"
                                onClick={() => setPreviewResumeApp(app)}
                                className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-900 border border-rose-200/80 transition-all group cursor-pointer"
                                title={`Preview read-only PDF resume: ${app.resumeFileName}`}
                              >
                                <FileText className="w-3 h-3 text-rose-600 group-hover:scale-110 transition-transform" />
                                <span className="truncate max-w-[125px]">{app.resumeFileName}</span>
                              </button>
                            )}
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                            <div className="text-[11px] text-[#0066CC]">{app.department}</div>
                          </td>

                          <td className="px-5 py-3.5 text-slate-600">
                            {app.city}, {app.country}
                          </td>

                          <td className="px-5 py-3.5 font-mono tabular-nums text-slate-700">
                            {app.yearsOfExperience} yrs
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <QualificationFitGauge score={fit.score} size={40} />
                              <div>
                                <div className={`text-[11px] font-bold ${
                                  fit.score >= 80 ? 'text-emerald-700' : fit.score >= 60 ? 'text-[#0066CC]' : 'text-amber-700'
                                }`}>
                                  {fit.score >= 80 ? 'Strong Fit' : fit.score >= 60 ? 'Good Match' : 'Partial Fit'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {fit.matchedSkills.length}/{fit.matchedSkills.length + fit.missingSkills.length || 1} skills
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            {/* Pipeline status dropdown selector */}
                            <select
                              value={app.status}
                              onChange={(e) =>
                                onUpdateApplicationStatus(app.id, e.target.value as PipelineStatus)
                              }
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-300 bg-white shadow-xs focus:ring-1 focus:ring-[#0066CC] cursor-pointer"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewResumeApp(app)}
                                className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-900 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title={`Preview read-only PDF resume for ${app.firstName} ${app.lastName}`}
                              >
                                <FileText className="w-3.5 h-3.5 text-rose-600" />
                                <span>PDF Resume</span>
                              </button>
                              {app.interviewDate && (
                                <AddToCalendarButton
                                  variant="compact"
                                  event={{
                                    id: app.id,
                                    candidateName: `${app.firstName} ${app.lastName}`,
                                    candidateEmail: app.email,
                                    jobTitle: app.jobTitle,
                                    companyName: app.companyName || 'MsmeBooks',
                                    interviewDate: app.interviewDate,
                                    referenceCode: app.referenceCode,
                                  }}
                                  label="Calendar"
                                />
                              )}
                              <button
                                onClick={() => setViewingApp(app)}
                                className="px-3 py-1.5 text-xs font-semibold text-[#0066CC] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Review Profile</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INTERVIEW CALENDAR */}
        {activeTab === 'calendar' && (
          <InterviewCalendar
            applications={applications}
            onScheduleInterview={onScheduleInterview}
            onViewCandidate={(app) => {
              setViewingApp(app);
              setInterviewDateInput(app.interviewDate ? app.interviewDate.slice(0, 16) : '');
            }}
            onPreviewResume={(app) => setPreviewResumeApp(app)}
            onUpdateStatus={onUpdateApplicationStatus}
          />
        )}

        {/* TAB 2: MANAGE VACANCIES */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-slate-500 font-bold">
                        {job.referenceCode}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          job.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#14243A] text-base leading-snug">{job.title}</h3>
                    <div className="text-xs text-[#0066CC] font-semibold mt-1">{job.department}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {job.workArrangement} · {job.location.city}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {job.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() =>
                        onUpdateJob({
                          ...job,
                          isFeatured: !job.isFeatured,
                        })
                      }
                      className={`text-xs font-medium flex items-center gap-1 ${
                        job.isFeatured ? 'text-[#0066CC] font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${job.isFeatured ? 'fill-current' : ''}`} />
                      <span>{job.isFeatured ? 'Featured' : 'Mark Featured'}</span>
                    </button>

                    <button
                      onClick={() =>
                        onUpdateJob({
                          ...job,
                          status: job.status === 'published' ? 'closed' : 'published',
                        })
                      }
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        job.status === 'published'
                          ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                          : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {job.status === 'published' ? 'Close Vacancy' : 'Re-publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TALENT COMMUNITY */}
        {activeTab === 'talent' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-bold text-[#14243A] mb-4">
              Registered Talent Pool Candidates ({talentMembers.length + 3})
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {talentMembers.map((member) => (
                <div key={member.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#14243A]">{member.fullName}</div>
                    <div className="text-slate-500 font-mono">{member.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#0066CC]">{member.areaOfInterest}</div>
                    <div className="text-slate-400 text-[11px]">{member.preferredArrangement} · {member.country}</div>
                  </div>
                </div>
              ))}
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#14243A]">Emmanuel Boateng</div>
                  <div className="text-slate-500 font-mono">e.boateng@example.com</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#0066CC]">Software Engineering</div>
                  <div className="text-slate-400 text-[11px]">Remote · Ghana</div>
                </div>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#14243A]">Nkechi Okafor</div>
                  <div className="text-slate-500 font-mono">nkechi.okafor@example.com</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#0066CC]">Product & Design</div>
                  <div className="text-slate-400 text-[11px]">Hybrid · Nigeria</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: JOB ALERTS SUBSCRIBERS */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#14243A]">
                  Job Alert Subscriptions ({jobAlerts.length + 1})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified candidate email subscriptions filtered by category, department, location, and arrangement.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {jobAlerts.map((alert) => (
                <div key={alert.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#14243A] font-mono">{alert.email}</span>
                      {alert.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Pending Code
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0066CC]">
                        {alert.frequency}
                      </span>
                    </div>

                    <div className="text-slate-500 text-[11px] mt-1 flex flex-wrap items-center gap-2">
                      <span>Cat: <strong>{alert.category || 'General'}</strong></span>
                      <span>·</span>
                      <span>Arrangement: <strong>{alert.workArrangement || 'Any'}</strong></span>
                      <span>·</span>
                      <span>Type: <strong>{alert.employmentType || 'Any'}</strong></span>
                      <span>·</span>
                      <span className="text-slate-400">Subscribed {new Date(alert.subscribedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="font-semibold text-[#0066CC]">{alert.department}</div>
                    <div className="text-slate-500 text-[11px]">{alert.location}</div>
                  </div>
                </div>
              ))}

              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#14243A] font-mono">dev.candidate@techmail.ng</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0066CC]">
                      immediate
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1 flex flex-wrap items-center gap-2">
                    <span>Cat: <strong>Technology & Engineering</strong></span>
                    <span>·</span>
                    <span>Arrangement: <strong>Remote</strong></span>
                    <span>·</span>
                    <span>Type: <strong>Full-time</strong></span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-[#0066CC]">Software Engineering</div>
                  <div className="text-slate-500 text-[11px]">Remote Only</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AUTOMATED NOTIFICATIONS & TRANSACTIONAL EMAILS (User Request 6) */}
        {activeTab === 'emails' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0066CC] flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#14243A]">
                    Automated Candidate Email Notification Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active System
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Transactional email subsystem triggering automated, branded notifications to candidates upon application submission, interview calendar booking, reschedule requests, and hiring pipeline milestones.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTestModalTemplate(DEFAULT_TEMPLATES[0]);
                  }}
                  className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test Trigger Notification</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Template Library</div>
                <div className="text-2xl font-extrabold text-[#14243A] font-mono mt-1">{DEFAULT_TEMPLATES.length} Standard</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Pre-configured HTML & Text</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Triggers</div>
                <div className="text-2xl font-extrabold text-indigo-600 font-mono mt-1">5 Auto-Hooks</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Application, Stage, Reschedule</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Outbox Dispatched</div>
                <div className="text-2xl font-extrabold text-[#0066CC] font-mono mt-1">{emailLogs.length} Sent</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Stored transactional log</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Delivery Status</div>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">100%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Zero bounce / spam rate</div>
              </div>
            </div>

            {/* Template Library Grid */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#14243A] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0066CC]" />
                    <span>Transactional Template Library</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Select any template below to test-fire simulated candidate messages or view variable mapping.
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">Standard MsmeBooks Rubrics</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {DEFAULT_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#0066CC] bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          tpl.category === 'confirmation' ? 'bg-blue-100 text-[#0066CC]' :
                          tpl.category === 'scheduling' ? 'bg-purple-100 text-purple-700' :
                          tpl.category === 'reschedule' ? 'bg-amber-100 text-amber-800' :
                          tpl.category === 'offer' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {tpl.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Auto-Trigger</span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0066CC] transition-colors leading-snug">
                        {tpl.name}
                      </h5>

                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 font-mono text-[10.5px]">
                        <strong>Subject:</strong> {tpl.subject}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Trigger Rule:</span> {tpl.triggerEvent}
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {tpl.variables.map((v) => (
                          <span key={v} className="text-[10px] px-1.5 py-0.5 bg-slate-200/70 text-slate-700 rounded font-mono">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTestModalTemplate(tpl);
                        }}
                        className="w-full py-1.5 px-3 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Test Trigger Email</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactional Outbox Logs Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#14243A] flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-[#0066CC]" />
                    <span>Live Transactional Dispatch Log & Outbox ({emailLogs.length})</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time delivery verification across candidate email endpoints.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" /> Live Sync Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/75 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Timestamp</th>
                      <th className="px-5 py-3">Candidate / Recipient</th>
                      <th className="px-5 py-3">Position</th>
                      <th className="px-5 py-3">Notification Subject</th>
                      <th className="px-5 py-3">Delivery Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.sentAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{log.recipientName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{log.recipientEmail}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium max-w-[180px] truncate">
                          {log.jobTitle}
                        </td>
                        <td className="px-5 py-3.5 text-slate-800 max-w-xs truncate">
                          <span className="text-[10px] font-bold text-[#0066CC] uppercase tracking-wider block">
                            {log.templateName}
                          </span>
                          <span className="truncate block font-medium">{log.subject}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'opened'
                              ? 'bg-blue-100 text-[#0066CC] border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            <CheckCheck className="w-3 h-3" />
                            <span className="capitalize">{log.status}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setPreviewingEmailLog(log)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#0066CC] hover:bg-blue-100/60 rounded-lg transition-colors cursor-pointer"
                          >
                            View Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CANDIDATE DETAIL REVIEW MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <div className="text-xs font-semibold text-[#0066CC] uppercase">
                  Candidate Dossier · {viewingApp.referenceCode}
                </div>
                <div className="text-lg font-bold text-[#14243A]">
                  {viewingApp.firstName} {viewingApp.lastName}
                </div>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Target Position & Pipeline status */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Applied For</div>
                  <div className="text-sm font-bold text-[#14243A]">{viewingApp.jobTitle}</div>
                  <div className="text-xs text-[#0066CC] font-semibold">{viewingApp.department}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold">Change Stage:</span>
                  <select
                    value={viewingApp.status}
                    onChange={(e) => {
                      const newSt = e.target.value as PipelineStatus;
                      onUpdateApplicationStatus(viewingApp.id, newSt);
                      setViewingApp({ ...viewingApp, status: newSt });
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Qualification Fit Score Breakdown Card */}
              {(() => {
                const modalFit = calculateQualificationFit(viewingApp, jobs);
                return (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <QualificationFitGauge score={modalFit.score} size={56} />
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          Qualification Fit Score
                        </div>
                        <div className="text-sm font-bold text-[#14243A] mt-0.5">
                          {modalFit.score >= 80
                            ? 'Strong Role Alignment'
                            : modalFit.score >= 60
                            ? 'Qualified Contender'
                            : 'Partial Qualification Overlap'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {modalFit.matchedSkills.length} matched requirement{modalFit.matchedSkills.length === 1 ? '' : 's'} · {viewingApp.yearsOfExperience} yrs relevant experience
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:max-w-[260px] justify-start sm:justify-end">
                      {modalFit.matchedSkills.slice(0, 4).map((skill) => (
                        <span
                          key={`m-${skill}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{skill}</span>
                        </span>
                      ))}
                      {modalFit.missingSkills.slice(0, 2).map((skill) => (
                        <span
                          key={`g-${skill}`}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          Missing: {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Contact Information */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Email</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{viewingApp.email}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Phone</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{viewingApp.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Location</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{viewingApp.city}, {viewingApp.country}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Experience</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{viewingApp.yearsOfExperience} years</div>
                </div>
              </div>

              {/* Attached CV */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/50 rounded-xl border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setPreviewResumeApp(viewingApp)}
                      className="font-bold text-slate-900 hover:text-[#0066CC] hover:underline flex items-center gap-1.5 text-left text-sm cursor-pointer group"
                      title="Click to launch read-only PDF document preview"
                    >
                      <span className="group-hover:text-[#0066CC]">{viewingApp.resumeFileName}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        PDF
                      </span>
                    </button>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{viewingApp.resumeFileSize}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">Verified Clean Document</span>
                      <span>•</span>
                      <span className="text-slate-500">Read-Only</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {viewingApp.aiMatchScore !== undefined && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{viewingApp.aiMatchScore}% Match</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewResumeApp(viewingApp)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Open full interactive PDF document viewer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View PDF Resume</span>
                  </button>
                </div>
              </div>

              {/* AI Extracted Skills */}
              {viewingApp.skills && viewingApp.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI-Extracted Skills & Competencies ({viewingApp.skills.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingApp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate Screening Answers */}
              <div>
                <h4 className="text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2">
                  Screening Responses
                </h4>
                <div className="space-y-3">
                  {viewingApp.screeningAnswers.map((sa, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                      <div className="font-semibold text-slate-700">{sa.question}</div>
                      <div className="text-slate-800 mt-1.5 leading-relaxed">{sa.answer}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              {viewingApp.coverLetter && (
                <div>
                  <h4 className="text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2">
                    Cover Letter
                  </h4>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    {viewingApp.coverLetter}
                  </p>
                </div>
              )}

              {/* Schedule Interview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0066CC]" />
                  <span>Schedule Interview</span>
                </h4>
                <form onSubmit={handleSaveInterview} className="flex gap-2">
                  <input
                    type="datetime-local"
                    value={interviewDateInput}
                    onChange={(e) => setInterviewDateInput(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 outline-none flex-1"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0066CC] text-white rounded-lg text-xs font-semibold"
                  >
                    Set Date
                  </button>
                </form>
                {viewingApp.interviewDate && (
                  <div className="mt-3.5 p-3.5 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Confirmed Interview Scheduled</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
                        Active Notification
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {new Date(viewingApp.interviewDate).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Meeting Link: Google Meet (meet.google.com/msme-talent-call)</span>
                      </div>
                    </div>

                    {/* Add to Calendar Button (.ics file download, Google Calendar, Outlook) */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Export scheduled session:
                      </span>
                      <AddToCalendarButton
                        event={{
                          id: viewingApp.id,
                          candidateName: `${viewingApp.firstName} ${viewingApp.lastName}`,
                          candidateEmail: viewingApp.email,
                          jobTitle: viewingApp.jobTitle,
                          companyName: viewingApp.companyName || 'MsmeBooks',
                          interviewDate: viewingApp.interviewDate,
                          referenceCode: viewingApp.referenceCode,
                        }}
                        label="Add to Calendar (.ics)"
                        variant="outline"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recruiter Notes */}
              <div>
                <h4 className="text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#0066CC]" />
                  <span>Internal Recruiter Notes ({viewingApp.recruiterNotes.length})</span>
                </h4>
                <div className="space-y-2 mb-3">
                  {viewingApp.recruiterNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs">
                      <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                        <span className="font-bold text-slate-700">{note.author}</span>
                        <span>{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-800">{note.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an internal note about this applicant..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 outline-none focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW JOB VACANCY MODAL */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 my-auto p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#14243A]">Publish New Job Vacancy</h3>
              <button onClick={() => setShowCreateJobModal(false)} className="text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Lead Mobile POS Engineer"
                  className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Business Development">Sales & Business Dev</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Data & Artificial Intelligence">Data & AI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Arrangement</label>
                  <select
                    value={newJobArrangement}
                    onChange={(e) => setNewJobArrangement(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  placeholder="e.g. Remote (Pan-Africa) or Lagos, Nigeria"
                  className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  placeholder="Describe key responsibilities and impact..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg font-semibold"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read-Only PDF Resume Preview Modal */}
      <ResumePdfPreviewModal
        application={previewResumeApp}
        onClose={() => setPreviewResumeApp(null)}
        onUpdateStatus={(appId, status) => {
          onUpdateApplicationStatus(appId, status);
          if (previewResumeApp && previewResumeApp.id === appId) {
            setPreviewResumeApp({ ...previewResumeApp, status });
          }
          if (viewingApp && viewingApp.id === appId) {
            setViewingApp({ ...viewingApp, status });
          }
        }}
        onAddNote={(appId, noteText) => {
          onAddRecruiterNote(appId, noteText);
          const newNoteObj = {
            id: `note-${Date.now()}`,
            author: 'Recruiter Admin',
            date: new Date().toISOString(),
            text: noteText,
          };
          if (previewResumeApp && previewResumeApp.id === appId) {
            setPreviewResumeApp({
              ...previewResumeApp,
              recruiterNotes: [...(previewResumeApp.recruiterNotes || []), newNoteObj],
            });
          }
          if (viewingApp && viewingApp.id === appId) {
            setViewingApp({
              ...viewingApp,
              recruiterNotes: [...(viewingApp.recruiterNotes || []), newNoteObj],
            });
          }
        }}
      />
      {/* Test Email Dispatcher Modal */}
      {testModalTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0066CC]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Test Trigger: {testModalTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTestModalTemplate(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Recipient Candidate *
                </label>
                <select
                  value={testSelectedAppId}
                  onChange={(e) => setTestSelectedAppId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-xs"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.firstName} {app.lastName} ({app.email}) — {app.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const targetApp = applications.find((a) => a.id === testSelectedAppId) || applications[0];
                const candidateName = targetApp ? `${targetApp.firstName} ${targetApp.lastName}` : 'Candidate Name';
                const jobTitle = targetApp ? targetApp.jobTitle : 'Senior Engineer';
                const refCode = targetApp ? targetApp.referenceCode : 'MSME-APP-2026-9142';
                const dateStr = targetApp?.interviewDate ? new Date(targetApp.interviewDate).toLocaleString() : 'Oct 23, 2026 at 10:00 AM UTC';

                const filledSubject = testModalTemplate.subject
                  .replace(/{{candidateName}}/g, candidateName)
                  .replace(/{{jobTitle}}/g, jobTitle)
                  .replace(/{{referenceCode}}/g, refCode);

                const filledBody = testModalTemplate.body
                  .replace(/{{candidateName}}/g, candidateName)
                  .replace(/{{jobTitle}}/g, jobTitle)
                  .replace(/{{referenceCode}}/g, refCode)
                  .replace(/{{interviewDate}}/g, dateStr)
                  .replace(/{{meetLink}}/g, 'meet.google.com/msme-talent-call')
                  .replace(/{{companyName}}/g, 'MsmeBooks Technologies');

                return (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">Subject Line</div>
                      <div className="font-bold text-slate-900">{filledSubject}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">Body Preview</div>
                      <pre className="text-slate-700 whitespace-pre-wrap font-sans text-xs leading-relaxed bg-white p-3 rounded-lg border border-slate-200 max-h-56 overflow-y-auto">
                        {filledBody}
                      </pre>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setTestModalTemplate(null)}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newLog: SentEmailLog = {
                            id: `log-${Date.now()}`,
                            recipientName: candidateName,
                            recipientEmail: targetApp?.email || 'candidate@gmail.com',
                            jobTitle,
                            templateName: testModalTemplate.name,
                            subject: filledSubject,
                            sentAt: new Date().toISOString(),
                            status: 'delivered',
                            body: filledBody,
                          };
                          logEmail(newLog);
                          setTestModalTemplate(null);
                          setEmailDispatchedToast(`Transactional email dispatched to ${candidateName}!`);
                          setTimeout(() => setEmailDispatchedToast(null), 4000);
                        }}
                        className="px-5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Transactional Email</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Sent Email Message Viewer Modal */}
      {previewingEmailLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0066CC]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Delivered Transactional Email
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingEmailLog(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">From:</span>
                  <span className="text-slate-900 font-medium">MsmeBooks Talent Team &lt;careers@msmebooks.org&gt;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">To:</span>
                  <span className="text-slate-900 font-bold">{previewingEmailLog.recipientName} &lt;{previewingEmailLog.recipientEmail}&gt;</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Subject:</span>
                  <span className="text-slate-900 font-bold">{previewingEmailLog.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Sent Timestamp:</span>
                  <span className="text-slate-600 font-mono">{new Date(previewingEmailLog.sentAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Delivery State:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" /> Delivered & Verified
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <pre className="text-slate-800 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {previewingEmailLog.body}
                </pre>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                Dispatched via MsmeBooks Automated Talent Engine · Pan-African Hiring Infrastructure
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {emailDispatchedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{emailDispatchedToast}</span>
        </div>
      )}
    </div>
  );
};
