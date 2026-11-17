import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Building2,
  Users,
  Target,
  Handshake,
  ShieldCheck,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Bookmark,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Clock,
  Video,
  Wand2,
  AlertCircle,
  Copy,
  Check,
  Send,
  CalendarX,
  FileEdit,
  Download,
  BarChart2,
  ListOrdered,
  BookmarkCheck,
  Trash2,
  Bell,
  Edit3,
  Save,
  Plus,
  SlidersHorizontal,
  UploadCloud,
  GraduationCap,
  Star,
  MessageSquare,
  Timer,
  Loader2,
  Compass,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { UserRole, CandidateWorkExperience, CandidateEducation } from '../types/auth';
import { AddToCalendarButton } from './AddToCalendarButton';
import { ApplicationInsightsD3Chart } from './ApplicationInsightsD3Chart';
import { ResumeStrengthIndicator } from './ResumeStrengthIndicator';
import { ResumeBuilderPanel } from './ResumeBuilderPanel';
import { CareerPathPanel } from './CareerPathPanel';
import { CandidateApplication, FilterPreset, JobAlertSubscription } from '../types/career';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPostJob?: () => void;
  onOpenSavedJobs?: () => void;
  onOpenPartnerModal?: () => void;
  onOpenPricing?: () => void;
  onOpenMockInterview?: (question?: string) => void;
  applications?: CandidateApplication[];
  onApplyFilterPreset?: (preset: FilterPreset) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenPostJob,
  onOpenSavedJobs,
  onOpenPartnerModal,
  onOpenPricing,
  onOpenMockInterview,
  applications,
  onApplyFilterPreset,
}) => {
  const {
    user,
    signOut,
    switchDemoUser,
    demoAccounts,
    updateProfile,
    userApplications,
    userJobAlerts,
    deleteJobAlert,
    saveJobAlert,
  } = useAuth();

  // Profile Editing Form State
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCountry, setEditCountry] = useState(user?.country || 'Nigeria');
  const [editCity, setEditCity] = useState(user?.city || 'Lagos');
  const candidateData = user?.roleData.role === 'candidate' ? user.roleData.data : null;
  const [editTargetRole, setEditTargetRole] = useState(candidateData?.targetRole || 'Software Engineer');
  const [editExperienceLevel, setEditExperienceLevel] = useState(candidateData?.experienceLevel || 'Senior (6+ years)');
  const [editExpectedSalary, setEditExpectedSalary] = useState(candidateData?.expectedSalaryMonthly || '3500');
  const [editCurrency, setEditCurrency] = useState(candidateData?.currency || 'USD');
  const [editWorkArrangement, setEditWorkArrangement] = useState<'Remote' | 'Hybrid' | 'On-site' | 'Any'>(
    candidateData?.workArrangementPreference || 'Remote'
  );
  const [editSkillsText, setEditSkillsText] = useState((candidateData?.skills || ['React', 'TypeScript', 'Node.js']).join(', '));
  const [editBio, setEditBio] = useState(candidateData?.bio || '');
  const [editPortfolioUrl, setEditPortfolioUrl] = useState(candidateData?.portfolioUrl || '');
  const [editLinkedinUrl, setEditLinkedinUrl] = useState(candidateData?.linkedinUrl || '');
  const [editWorkHistory, setEditWorkHistory] = useState<CandidateWorkExperience[]>(
    candidateData?.workHistory || []
  );
  const [editEducation, setEditEducation] = useState<CandidateEducation[]>(
    candidateData?.education || []
  );
  const [isImportingLinkedinPdf, setIsImportingLinkedinPdf] = useState(false);
  const [importProfileToast, setImportProfileToast] = useState<string | null>(null);
  const linkedinPdfInputRef = React.useRef<HTMLInputElement>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveToast, setProfileSaveToast] = useState(false);

  // Live clock for interview countdown indicators (updates every 60 seconds)
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  // Scheduled interviews booked via JobDetailsModal Scheduler + default upcoming call
  const [bookedInterviews, setBookedInterviews] = useState<any[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('msmebooks_candidate_interviews') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    const refreshBookings = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('msmebooks_candidate_interviews') || '[]');
        setBookedInterviews(Array.isArray(stored) ? stored : []);
      } catch {}
    };
    window.addEventListener('msmebooks_interviews_updated', refreshBookings);
    return () => window.removeEventListener('msmebooks_interviews_updated', refreshBookings);
  }, []);

  // Past Interview Feedback State & Quick-Rate Modal
  const [interviewFeedbackMap, setInterviewFeedbackMap] = useState<
    Record<
      string,
      {
        communicationRating: number;
        professionalismRating: number;
        relevanceRating: number;
        notes: string;
        submittedAt: string;
      }
    >
  >(() => {
    try {
      const stored = localStorage.getItem('msmebooks_interview_feedback');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [quickRateInterview, setQuickRateInterview] = useState<{
    id: string;
    jobTitle: string;
    companyName: string;
    recruiterName: string;
    completedDate: string;
  } | null>(null);
  const [rateComm, setRateComm] = useState(5);
  const [rateProf, setRateProf] = useState(5);
  const [rateRelevance, setRateRelevance] = useState(5);
  const [rateNotes, setRateNotes] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Job Alert Form State
  const [newAlertDepartment, setNewAlertDepartment] = useState('Engineering');
  const [newAlertLocation, setNewAlertLocation] = useState('Remote');
  const [newAlertFrequency, setNewAlertFrequency] = useState<'immediate' | 'daily' | 'weekly'>('daily');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [alertSuccessToast, setAlertSuccessToast] = useState(false);

  // Sync edit fields whenever user profile changes
  useEffect(() => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditPhone(user.phone || '');
      setEditCountry(user.country || 'Nigeria');
      setEditCity(user.city || 'Lagos');
      if (user.roleData.role === 'candidate') {
        const c = user.roleData.data;
        setEditTargetRole(c.targetRole || '');
        setEditExperienceLevel(c.experienceLevel || '');
        setEditExpectedSalary(c.expectedSalaryMonthly || '');
        setEditCurrency(c.currency || 'USD');
        setEditWorkArrangement(c.workArrangementPreference || 'Remote');
        setEditSkillsText((c.skills || []).join(', '));
        setEditBio(c.bio || '');
        setEditPortfolioUrl(c.portfolioUrl || '');
        setEditLinkedinUrl(c.linkedinUrl || '');
        setEditWorkHistory(c.workHistory || []);
        setEditEducation(c.education || []);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);

    const skillsArray = editSkillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let updatedRoleData = user.roleData;
    if (user.roleData.role === 'candidate') {
      updatedRoleData = {
        role: 'candidate',
        data: {
          ...user.roleData.data,
          targetRole: editTargetRole,
          experienceLevel: editExperienceLevel,
          expectedSalaryMonthly: editExpectedSalary,
          currency: editCurrency,
          workArrangementPreference: editWorkArrangement,
          skills: skillsArray.length > 0 ? skillsArray : ['React', 'TypeScript'],
          bio: editBio,
          portfolioUrl: editPortfolioUrl,
          linkedinUrl: editLinkedinUrl,
          workHistory: editWorkHistory,
          education: editEducation,
        },
      };
    }

    await updateProfile({
      fullName: editFullName,
      phone: editPhone,
      country: editCountry,
      city: editCity,
      roleData: updatedRoleData,
    });

    setIsSavingProfile(false);
    setProfileSaveToast(true);
    setTimeout(() => setProfileSaveToast(false), 3000);
  };

  const handleCreateNewAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsCreatingAlert(true);

    const newAlert: JobAlertSubscription = {
      id: `alert-${Date.now()}`,
      email: user.email,
      category: newAlertDepartment,
      department: newAlertDepartment,
      location: newAlertLocation,
      employmentType: 'Full-time',
      workArrangement: 'Remote',
      frequency: newAlertFrequency,
      isVerified: true,
      subscribedAt: new Date().toISOString(),
      unsubscribeToken: `token-${Date.now()}`,
    };

    await saveJobAlert(newAlert);
    setIsCreatingAlert(false);
    setAlertSuccessToast(true);
    setTimeout(() => setAlertSuccessToast(false), 3000);
  };

  // AI Candidate Persona State
  const [persona, setPersona] = useState<{
    summary: string;
    keyStrengths: string[];
    applicationHook: string;
    generatedAt?: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_candidate_persona');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [resumeSnippet, setResumeSnippet] = useState('');
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [showPersonaInput, setShowPersonaInput] = useState(false);
  const [copiedPersona, setCopiedPersona] = useState(false);
  const [personaSavedToast, setPersonaSavedToast] = useState(false);

  // Reschedule Request State
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('Work schedule clash');
  const [rescheduleProposedDate, setRescheduleProposedDate] = useState('2026-10-26');
  const [rescheduleProposedTime, setRescheduleProposedTime] = useState('14:00');
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [rescheduleSubmitted, setRescheduleSubmitted] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_reschedule_requests');
      if (stored) {
        const list = JSON.parse(stored);
        return Array.isArray(list) && list.length > 0;
      }
    } catch {}
    return false;
  });
  const [rescheduleSuccessToast, setRescheduleSuccessToast] = useState(false);

  // Candidate Subtabs: Profile, Build Resume, Career Path, Applications Tracker, Alerts, Persona, Saved Interviews, D3 Insights Dashboard, Resume Strength, Saved Presets
  const [candidateTab, setCandidateTab] = useState<
    'profile' | 'resume-builder' | 'career-path' | 'applications' | 'alerts' | 'persona' | 'interviews' | 'insights' | 'strength' | 'presets'
  >('profile');
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState(false);

  // Saved Filter Presets State
  const [savedFilterPresets, setSavedFilterPresets] = useState<FilterPreset[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_saved_filter_presets');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const handleDeleteUserPreset = (presetId: string) => {
    const updated = savedFilterPresets.filter((p) => p.id !== presetId);
    setSavedFilterPresets(updated);
    try {
      localStorage.setItem('msmebooks_saved_filter_presets', JSON.stringify(updated));
      window.dispatchEvent(new Event('msmebooks_presets_updated'));
    } catch {}
  };

  // Candidate Applications state
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>(() => {
    if (applications && applications.length > 0) return applications;
    try {
      const stored = localStorage.getItem('msmebooks_applications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleDownloadPdfCv = () => {
    if (!user) return;
    setPdfDownloading(true);
    try {
      const doc = new jsPDF();
      const candidateData = user.roleData.role === 'candidate' ? user.roleData.data : null;

      // Header styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(20, 36, 58);
      doc.text(user.fullName, 20, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 102, 204);
      doc.text(`${candidateData?.targetRole || 'Senior Engineer'} · ${candidateData?.experienceLevel || 'Senior'}`, 20, 30);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const userLoc = user.city ? `${user.city}, ${user.country}` : user.country;
      doc.text(`Email: ${user.email} | Location: ${userLoc} | Phone: ${user.phone || '+234 800 123 4567'}`, 20, 37);

      // Accent Line
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(0.75);
      doc.line(20, 42, 190, 42);

      // Summary Section
      let curY = 50;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 36, 58);
      doc.text('EXECUTIVE PROFILE & SUMMARY', 20, curY);
      curY += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const summaryText = persona?.summary || `${user.fullName} is an experienced ${candidateData?.targetRole || 'technology practitioner'} with a proven track record of shipping resilient, high-volume products across Pan-African and international distributed squads.`;
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, curY);
      curY += splitSummary.length * 5 + 6;

      // Core Skills Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 36, 58);
      doc.text('CORE TECHNICAL SKILLS & DOMAIN EXPERTISE', 20, curY);
      curY += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const skillsList = candidateData?.skills?.join('   •   ') || 'TypeScript   •   Node.js   •   PostgreSQL   •   Redis   •   Distributed Systems';
      const splitSkills = doc.splitTextToSize(skillsList, 170);
      doc.text(splitSkills, 20, curY);
      curY += splitSkills.length * 5 + 6;

      // Career History & Deliverables
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 36, 58);
      doc.text('KEY PROFESSIONAL DELIVERABLES & IMPACT', 20, curY);
      curY += 7;

      const deliverables = [
        `Lead Systems Architect / Senior Specialist · MsmeBooks Ecosystem (2023 - Present)`,
        `• Architected and deployed microservices supporting multi-currency ledger reconciliations across 5+ countries.`,
        `• Reduced system incident recovery time (MTTR) by 40% and improved transactional throughput under load.`,
        `• Mentored mid-level and junior engineers across hybrid and remote distributed squads.`,
        `Full Stack Software Engineer · Tech Ecosystem Hub (2020 - 2023)`,
        `• Engineered core user-facing portals, payment gateways, and real-time dashboard analytics.`,
        `• Optimized database queries and introduced Redis caching, achieving 99.98% service uptime.`,
      ];

      deliverables.forEach((item) => {
        const isHeader = !item.startsWith('•');
        doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
        doc.setFontSize(isHeader ? 10 : 9);
        doc.setTextColor(isHeader ? 20 : 71, isHeader ? 36 : 85, isHeader ? 58 : 105);
        const splitItem = doc.splitTextToSize(item, 170);
        doc.text(splitItem, 20, curY);
        curY += splitItem.length * 4.5 + (isHeader ? 2 : 1.5);
      });

      curY += 4;
      // Footer Verification
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, curY, 190, curY);
      curY += 6;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`MsmeBooks Verified Talent Network · Candidate Reference MSME-CV-${Date.now().toString().slice(-6)} · Generated ${new Date().toLocaleDateString()}`, 20, curY);

      doc.save(`${user.fullName.replace(/\s+/g, '_')}_Resume_MsmeBooks.pdf`);
      setPdfSuccessToast(true);
      setTimeout(() => setPdfSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF resume', err);
    } finally {
      setPdfDownloading(false);
    }
  };

  if (!isOpen || !user) return null;

  const formatInterviewCountdown = (targetIso: string) => {
    const targetMs = new Date(targetIso).getTime();
    if (isNaN(targetMs)) return null;
    const diffMs = targetMs - nowMs;
    if (diffMs <= 0) return { label: 'Starting / Completed', isSoon: true };
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) {
      return { label: `In ${days}d ${hours}h`, isSoon: days <= 2 };
    }
    return { label: `In ${hours}h ${mins}m`, isSoon: true };
  };

  const handleImportLinkedinPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImportingLinkedinPdf(true);
    setImportProfileToast(null);
    setCandidateTab('profile');
    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
      });

      let extractedText = '';
      if (file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt')) {
        extractedText = await file.text();
      }

      const resp = await fetch('/api/parse-linkedin-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileBase64,
          extractedText,
        }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        throw new Error(json.error || 'Import failed');
      }

      const imported = json.data || {};
      const nextFullName = imported.fullName || editFullName;
      const nextPhone = imported.phone || editPhone;
      const nextTargetRole = imported.targetRole || editTargetRole;
      const nextExperienceLevel = imported.experienceLevel || editExperienceLevel;
      const nextCity = imported.city || editCity;
      const nextCountry = imported.country || editCountry;
      const nextLinkedinUrl = imported.linkedinUrl || editLinkedinUrl;
      const nextBio = imported.bio || editBio;
      const nextSkills: string[] =
        Array.isArray(imported.skills) && imported.skills.length > 0
          ? imported.skills
          : editSkillsText
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
      const nextWorkHistory: CandidateWorkExperience[] = Array.isArray(imported.workHistory)
        ? imported.workHistory
        : editWorkHistory;
      const nextEducation: CandidateEducation[] = Array.isArray(imported.education)
        ? imported.education
        : editEducation;

      setEditFullName(nextFullName);
      setEditPhone(nextPhone);
      setEditTargetRole(nextTargetRole);
      setEditExperienceLevel(nextExperienceLevel);
      setEditCity(nextCity);
      setEditCountry(nextCountry);
      setEditLinkedinUrl(nextLinkedinUrl);
      setEditBio(nextBio);
      if (nextSkills.length > 0) {
        setEditSkillsText(nextSkills.join(', '));
      }
      setEditWorkHistory(nextWorkHistory);
      setEditEducation(nextEducation);

      if (user && user.roleData.role === 'candidate') {
        await updateProfile({
          fullName: nextFullName,
          phone: nextPhone,
          country: nextCountry,
          city: nextCity,
          roleData: {
            role: 'candidate',
            data: {
              ...user.roleData.data,
              targetRole: nextTargetRole,
              experienceLevel: nextExperienceLevel,
              skills: nextSkills.length > 0 ? nextSkills : user.roleData.data.skills,
              bio: nextBio,
              linkedinUrl: nextLinkedinUrl,
              workHistory: nextWorkHistory,
              education: nextEducation,
            },
          },
        });
      }

      const engineLabel = json.source === 'gemini-4-hydrogen' ? 'Gemini AI' : 'Smart PDF Parser';
      setImportProfileToast(
        `Imported from ${file.name} via ${engineLabel}: populated ${nextWorkHistory.length} work roles, ${nextSkills.length} skills & ${nextEducation.length} education entries and synced your profile.`
      );
      setTimeout(() => setImportProfileToast(null), 6500);
    } catch (err: any) {
      setImportProfileToast(`Could not parse ${file.name}: ${err?.message || 'Unexpected error'}`);
      setTimeout(() => setImportProfileToast(null), 5000);
    } finally {
      setIsImportingLinkedinPdf(false);
      e.target.value = '';
    }
  };

  const handleOpenQuickRate = (interview: {
    id: string;
    jobTitle: string;
    companyName: string;
    recruiterName: string;
    completedDate: string;
  }) => {
    const existing = interviewFeedbackMap[interview.id];
    setRateComm(existing?.communicationRating || 5);
    setRateProf(existing?.professionalismRating || 5);
    setRateRelevance(existing?.relevanceRating || 5);
    setRateNotes(existing?.notes || '');
    setQuickRateInterview(interview);
  };

  const handleSaveQuickRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRateInterview) return;
    const updated = {
      ...interviewFeedbackMap,
      [quickRateInterview.id]: {
        communicationRating: rateComm,
        professionalismRating: rateProf,
        relevanceRating: rateRelevance,
        notes: rateNotes.trim(),
        submittedAt: new Date().toISOString(),
      },
    };
    setInterviewFeedbackMap(updated);
    try {
      localStorage.setItem('msmebooks_interview_feedback', JSON.stringify(updated));
    } catch {}
    setFeedbackToast(`Private rating submitted for ${quickRateInterview.recruiterName} (${quickRateInterview.jobTitle}).`);
    setQuickRateInterview(null);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleGeneratePersona = async () => {
    setIsGeneratingPersona(true);
    setPersonaSavedToast(false);
    try {
      const candidateData = user.roleData.role === 'candidate' ? user.roleData.data : null;
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Generate an AI Candidate Persona for ${user.fullName}.
Role Target: ${candidateData?.targetRole || 'Senior Engineer'}
Seniority: ${candidateData?.experienceLevel || 'Senior'}
Skills: ${candidateData?.skills?.join(', ') || 'Software Architecture, Distributed Systems'}
Resume snippet / Experience: ${resumeSnippet || 'Proven experience leading software development, building microservices, and collaborating across Pan-African fintech squads.'}

Respond with valid JSON strictly in this format:
{
  "summary": "2-3 high-impact sentences articulating executive value, proven deliverables, and leadership.",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "applicationHook": "1 compelling sentence to include on job applications that grabs recruiter attention immediately."
}`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      let text = data.text || '';
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        text = text.slice(jsonStart, jsonEnd + 1);
      }
      const parsed = JSON.parse(text);
      const newPersona = {
        summary: parsed.summary || 'Senior professional with extensive experience leading cross-functional engineering initiatives and driving measurable growth in tech.',
        keyStrengths: Array.isArray(parsed.keyStrengths) ? parsed.keyStrengths : [
          'Strategic Problem Solving & High Velocity Delivery',
          'Scalable Architecture & Systems Engineering',
          'Cross-border Pan-African Stakeholder Collaboration',
        ],
        applicationHook: parsed.applicationHook || 'Brings 6+ years of specialized domain acumen with a track record of reducing latency and scaling operations across emerging markets.',
        generatedAt: new Date().toISOString(),
      };
      setPersona(newPersona);
      localStorage.setItem('msmebooks_candidate_persona', JSON.stringify(newPersona));
      setPersonaSavedToast(true);
      setTimeout(() => setPersonaSavedToast(false), 3000);
    } catch (err) {
      console.warn('Persona generation fallback:', err);
      const fallbackPersona = {
        summary: `${user.fullName} is a driven ${user.roleData.role === 'candidate' ? user.roleData.data.targetRole : 'Professional'} recognized for combining strong technical rigor with rapid execution to scale mission-critical products.`,
        keyStrengths: [
          'High-throughput Systems Architecture & Code Reliability',
          'Cross-Functional Agile Collaboration in Distributed Teams',
          'Deep Domain Acumen in African FinTech & Commerce Infrastructure',
        ],
        applicationHook: 'Positioned to accelerate squad velocity from Day 1 with hands-on expertise in distributed microservices and African payment integrations.',
        generatedAt: new Date().toISOString(),
      };
      setPersona(fallbackPersona);
      localStorage.setItem('msmebooks_candidate_persona', JSON.stringify(fallbackPersona));
      setPersonaSavedToast(true);
      setTimeout(() => setPersonaSavedToast(false), 3000);
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const handleCopyPersona = () => {
    if (!persona) return;
    const text = `AI CANDIDATE PERSONA - ${user.fullName}
SUMMARY:
${persona.summary}

KEY STRENGTHS:
${persona.keyStrengths.map((s) => `• ${s}`).join('\n')}

APPLICATION HOOK:
${persona.applicationHook}`;

    navigator.clipboard.writeText(text);
    setCopiedPersona(true);
    setTimeout(() => setCopiedPersona(false), 2500);
  };

  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    const req = {
      id: `resched-${Date.now()}`,
      candidateName: user.fullName,
      candidateEmail: user.email,
      jobTitle: user.roleData.role === 'candidate' ? user.roleData.data.targetRole || 'Senior Backend Engineer' : 'Senior Backend Engineer',
      originalDate: '2026-10-23T10:00:00Z',
      proposedDate: rescheduleProposedDate,
      proposedTime: rescheduleProposedTime,
      reason: rescheduleReason,
      note: rescheduleNote.trim(),
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };

    let existing: any[] = [];
    try {
      const stored = localStorage.getItem('msmebooks_reschedule_requests');
      if (stored) existing = JSON.parse(stored);
    } catch {}
    existing.unshift(req);
    localStorage.setItem('msmebooks_reschedule_requests', JSON.stringify(existing));
    window.dispatchEvent(new Event('msmebooks_reschedule_updated'));

    setRescheduleSubmitted(true);
    setShowRescheduleForm(false);
    setRescheduleSuccessToast(true);
    setTimeout(() => setRescheduleSuccessToast(false), 4000);
  };

  const handleCancelReschedule = () => {
    try {
      localStorage.removeItem('msmebooks_reschedule_requests');
      window.dispatchEvent(new Event('msmebooks_reschedule_updated'));
    } catch {}
    setRescheduleSubmitted(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'candidate':
        return {
          label: 'Candidate / Job Seeker',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          icon: User,
        };
      case 'employer':
        return {
          label: 'Employer / Company',
          bg: 'bg-blue-100 text-[#0066CC] dark:bg-blue-950/70 dark:text-[#38BDF8] border-blue-300 dark:border-blue-800',
          icon: Building2,
        };
      case 'agency':
        return {
          label: 'Recruitment Agency',
          bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          icon: Users,
        };
      case 'headhunter':
        return {
          label: 'Executive Headhunter',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: Target,
        };
      case 'partner':
        return {
          label: 'Ecosystem Partner',
          bg: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-300 dark:border-teal-800',
          icon: Handshake,
        };
    }
  };

  const badge = getRoleBadge(user.role);
  const RoleIcon = badge.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div
        className={`bg-white dark:bg-[#131D35] rounded-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[92vh] transition-all duration-200 ${
          candidateTab === 'resume-builder' || candidateTab === 'career-path' ? 'max-w-3xl' : 'max-w-xl'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#14243A] to-[#0066CC] dark:from-[#091122] dark:to-[#0A4585] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/60 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-lg text-white">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#14243A]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white leading-tight">
                  {user.fullName}
                </h2>
                {user.isVerified && (
                  <span title="Verified MsmeBooks Account">
                    <ShieldCheck className="w-4 h-4 text-[#B5E61D]" />
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span className="font-mono text-[11px]">{user.email}</span>
                <span>·</span>
                <span className="capitalize">{user.city ? `${user.city}, ${user.country}` : user.country}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Active Role Card & Download CV Action */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg border ${badge.bg}`}>
                <RoleIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Active Account Role
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {badge.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {user.role === 'candidate' && (
                <>
                  <button
                    type="button"
                    onClick={() => linkedinPdfInputRef.current?.click()}
                    disabled={isImportingLinkedinPdf}
                    className="px-3 py-1.5 bg-white dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Upload a LinkedIn PDF profile export to automatically populate Work History, Skills & Education via Gemini AI"
                  >
                    {isImportingLinkedinPdf ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5" />
                    )}
                    <span>{isImportingLinkedinPdf ? 'Importing PDF...' : 'Import Profile'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCandidateTab('resume-builder')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      candidateTab === 'resume-builder'
                        ? 'bg-[#14243A] text-[#B5E61D] border-[#14243A]'
                        : 'bg-white dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800'
                    }`}
                    title="Build an ATS-optimized resume with Gemini AI and download as PDF"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Build Resume</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdfCv}
                    disabled={pdfDownloading}
                    className="px-3 py-1.5 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Generate and download structured professional PDF CV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{pdfDownloading ? 'Generating CV...' : 'Download CV (PDF)'}</span>
                  </button>
                </>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#B5E61D]/20 text-[#14243A] dark:text-[#B5E61D] border border-[#B5E61D]/40">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
          </div>

          {pdfSuccessToast && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Professional PDF CV successfully generated and downloaded!</span>
            </div>
          )}

          {/* Hidden LinkedIn PDF file input accessible from both header and Edit Profile */}
          <input
            ref={linkedinPdfInputRef}
            type="file"
            accept=".pdf,application/pdf,.docx,.txt"
            onChange={handleImportLinkedinPdf}
            className="hidden"
          />

          {/* Sub-tab navigation when role is candidate */}
          {user.role === 'candidate' && user.roleData.role === 'candidate' && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setCandidateTab('profile')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'profile'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('resume-builder')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'resume-builder'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Build Resume</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('career-path')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'career-path'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>Career Path</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('applications')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'applications'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span>Applications ({userApplications.length > 0 ? userApplications.length : candidateApplications.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('alerts')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'alerts'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Job Alerts ({userJobAlerts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('persona')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'persona'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>AI Persona</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('interviews')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'interviews'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                <span>Interviews</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('insights')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'insights'
                    ? 'bg-white dark:bg-[#1A284A] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Insights</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('strength')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'strength'
                    ? 'bg-white dark:bg-[#1A284A] text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                <span>Resume Strength</span>
              </button>
              <button
                type="button"
                onClick={() => setCandidateTab('presets')}
                className={`py-1.5 px-3 rounded-lg font-bold text-center transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  candidateTab === 'presets'
                    ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Presets ({savedFilterPresets.length})</span>
              </button>
            </div>
          )}

          {/* Role-Specific Overview */}
          {user.role === 'candidate' && user.roleData.role === 'candidate' && (
            <div className="space-y-4">
              {/* TAB: Edit Profile & Career Preferences */}
              {candidateTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Manage Profile & Career Preferences</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Update your details or import your LinkedIn PDF export via Gemini AI.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => linkedinPdfInputRef.current?.click()}
                        disabled={isImportingLinkedinPdf}
                        className="px-3 py-2 bg-slate-100 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Upload LinkedIn PDF export to auto-populate Work History, Skills & Education"
                      >
                        {isImportingLinkedinPdf ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5" />
                        )}
                        <span>{isImportingLinkedinPdf ? 'Parsing PDF...' : 'Import Profile'}</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>

                  {importProfileToast && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-[#0066CC] dark:text-[#38BDF8] font-semibold flex items-center gap-2 animate-in fade-in">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>{importProfileToast}</span>
                    </div>
                  )}

                  {profileSaveToast && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Profile updated successfully and synchronized with Firebase Firestore!</span>
                    </div>
                  )}

                  {/* Basic Details */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Personal Information
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 bg-slate-100 dark:bg-[#1A284A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed text-xs"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+234 800 000 0000"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Country
                          </label>
                          <select
                            value={editCountry}
                            onChange={(e) => setEditCountry(e.target.value)}
                            className="w-full px-2.5 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                          >
                            <option value="Nigeria">Nigeria</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="South Africa">South Africa</option>
                            <option value="Egypt">Egypt</option>
                            <option value="Uganda">Uganda</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            placeholder="e.g. Lagos"
                            className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career & Role Preferences */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Target Role & Compensation
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Target Role
                        </label>
                        <input
                          type="text"
                          value={editTargetRole}
                          onChange={(e) => setEditTargetRole(e.target.value)}
                          placeholder="e.g. Senior Full-Stack Engineer"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Experience Level
                        </label>
                        <select
                          value={editExperienceLevel}
                          onChange={(e) => setEditExperienceLevel(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        >
                          <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                          <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                          <option value="Senior (6+ years)">Senior (6+ years)</option>
                          <option value="Lead / Principal (8+ years)">Lead / Principal (8+ years)</option>
                          <option value="Executive / Director">Executive / Director</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Expected Salary (Monthly)
                          </label>
                          <input
                            type="text"
                            value={editExpectedSalary}
                            onChange={(e) => setEditExpectedSalary(e.target.value)}
                            placeholder="e.g. 4500"
                            className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Currency
                          </label>
                          <select
                            value={editCurrency}
                            onChange={(e) => setEditCurrency(e.target.value)}
                            className="w-full px-2 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="NGN">NGN (₦)</option>
                            <option value="GHS">GHS (GH₵)</option>
                            <option value="KES">KES (KSh)</option>
                            <option value="ZAR">ZAR (R)</option>
                            <option value="RWF">RWF (FRw)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Work Arrangement Preference
                        </label>
                        <select
                          value={editWorkArrangement}
                          onChange={(e) => setEditWorkArrangement(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        >
                          <option value="Remote">Remote (Anywhere in Africa)</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site Hub</option>
                          <option value="Any">Flexible / Any</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Core Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        value={editSkillsText}
                        onChange={(e) => setEditSkillsText(e.target.value)}
                        placeholder="e.g. TypeScript, React, Node.js, PostgreSQL, Docker, AWS"
                        className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Professional Bio / Summary
                      </label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        placeholder="Describe your architectural background, achievements, and career focus..."
                        className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC] text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Portfolio / GitHub URL
                        </label>
                        <input
                          type="url"
                          value={editPortfolioUrl}
                          onChange={(e) => setEditPortfolioUrl(e.target.value)}
                          placeholder="https://github.com/yourhandle"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={editLinkedinUrl}
                          onChange={(e) => setEditLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work History & Education Section (Populated by Import Profile or manual entry) */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Work History ({editWorkHistory.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditWorkHistory((prev) => [
                            ...prev,
                            {
                              id: `wh-${Date.now()}`,
                              title: '',
                              company: '',
                              period: '',
                              location: 'Remote',
                              highlights: '',
                            },
                          ])
                        }
                        className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Role</span>
                      </button>
                    </div>

                    {editWorkHistory.length === 0 ? (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        Click &ldquo;Import Profile&rdquo; above with a LinkedIn PDF export or &ldquo;Add Role&rdquo; to populate your work history.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {editWorkHistory.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={item.title}
                                placeholder="Job Title"
                                onChange={(e) => {
                                  const next = [...editWorkHistory];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  setEditWorkHistory(next);
                                }}
                                className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-[#0066CC] outline-none flex-1 pb-0.5"
                              />
                              <button
                                type="button"
                                onClick={() => setEditWorkHistory((prev) => prev.filter((w) => w.id !== item.id))}
                                className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                                title="Remove work entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={item.company}
                                placeholder="Company"
                                onChange={(e) => {
                                  const next = [...editWorkHistory];
                                  next[idx] = { ...next[idx], company: e.target.value };
                                  setEditWorkHistory(next);
                                }}
                                className="px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none"
                              />
                              <input
                                type="text"
                                value={item.period}
                                placeholder="2022 – Present"
                                onChange={(e) => {
                                  const next = [...editWorkHistory];
                                  next[idx] = { ...next[idx], period: e.target.value };
                                  setEditWorkHistory(next);
                                }}
                                className="px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none font-mono text-[11px]"
                              />
                              <input
                                type="text"
                                value={item.location || ''}
                                placeholder="Location (e.g. Lagos / Remote)"
                                onChange={(e) => {
                                  const next = [...editWorkHistory];
                                  next[idx] = { ...next[idx], location: e.target.value };
                                  setEditWorkHistory(next);
                                }}
                                className="px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={item.highlights}
                              placeholder="Key deliverables and impact..."
                              onChange={(e) => {
                                const next = [...editWorkHistory];
                                next[idx] = { ...next[idx], highlights: e.target.value };
                                setEditWorkHistory(next);
                              }}
                              className="w-full px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 outline-none text-[11px]"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                          <span>Education ({editEducation.length})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditEducation((prev) => [
                              ...prev,
                              { id: `ed-${Date.now()}`, degree: '', institution: '', year: '' },
                            ])
                          }
                          className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Education</span>
                        </button>
                      </div>

                      {editEducation.length === 0 ? (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          No education entries added yet. Import a LinkedIn PDF or click &ldquo;Add Education&rdquo;.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {editEducation.map((ed, idx) => (
                            <div
                              key={ed.id}
                              className="p-2.5 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-12 gap-2 items-center text-xs"
                            >
                              <input
                                type="text"
                                value={ed.degree}
                                placeholder="Degree / Certification"
                                onChange={(e) => {
                                  const next = [...editEducation];
                                  next[idx] = { ...next[idx], degree: e.target.value };
                                  setEditEducation(next);
                                }}
                                className="col-span-5 px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold outline-none"
                              />
                              <input
                                type="text"
                                value={ed.institution}
                                placeholder="Institution"
                                onChange={(e) => {
                                  const next = [...editEducation];
                                  next[idx] = { ...next[idx], institution: e.target.value };
                                  setEditEducation(next);
                                }}
                                className="col-span-4 px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 outline-none"
                              />
                              <input
                                type="text"
                                value={ed.year}
                                placeholder="Year"
                                onChange={(e) => {
                                  const next = [...editEducation];
                                  next[idx] = { ...next[idx], year: e.target.value };
                                  setEditEducation(next);
                                }}
                                className="col-span-2 px-2 py-1 bg-slate-50 dark:bg-[#1A284A] rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[11px] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setEditEducation((prev) => prev.filter((item) => item.id !== ed.id))}
                                className="col-span-1 text-slate-400 hover:text-rose-500 flex justify-center cursor-pointer"
                                title="Remove education entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingProfile ? 'Saving Changes to Firestore...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: Personalized Job Alerts Manager */}
              {candidateTab === 'alerts' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-500" />
                        <span>Personalized Job Alerts ({userJobAlerts.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Receive instant or digest alerts when matching roles are published. Persisted in Firebase.
                      </p>
                    </div>
                  </div>

                  {alertSuccessToast && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Personalized job alert created and saved to Firestore!</span>
                    </div>
                  )}

                  {/* Create New Alert Card */}
                  <form onSubmit={handleCreateNewAlert} className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#0066CC]" />
                        <span>Create New Alert Subscription</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Sends to {user.email}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Role / Department
                        </label>
                        <select
                          value={newAlertDepartment}
                          onChange={(e) => setNewAlertDepartment(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Product">Product Management</option>
                          <option value="Design">UI/UX Design</option>
                          <option value="Finance">Finance & Accounting</option>
                          <option value="Data">Data & AI</option>
                          <option value="Operations">Operations & Merchant Success</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Location Preference
                        </label>
                        <select
                          value={newAlertLocation}
                          onChange={(e) => setNewAlertLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                        >
                          <option value="Remote">Pan-African Remote</option>
                          <option value="Nigeria">Nigeria (Lagos / Abuja)</option>
                          <option value="Kenya">Kenya (Nairobi)</option>
                          <option value="Rwanda">Rwanda (Kigali)</option>
                          <option value="Ghana">Ghana (Accra)</option>
                          <option value="South Africa">South Africa (Cape Town)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Frequency
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={newAlertFrequency}
                            onChange={(e) => setNewAlertFrequency(e.target.value as any)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
                          >
                            <option value="immediate">Immediate</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                          </select>

                          <button
                            type="submit"
                            disabled={isCreatingAlert}
                            className="px-3.5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer text-xs"
                          >
                            {isCreatingAlert ? 'Adding...' : 'Subscribe'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Active Alerts List */}
                  <div className="space-y-2.5">
                    {userJobAlerts.length === 0 ? (
                      <div className="p-6 text-center bg-white dark:bg-[#0D1527] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1.5">
                        <Bell className="w-7 h-7 text-slate-400 mx-auto" />
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          No Active Job Alerts Yet
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                          Create an alert above to get notified whenever new roles in your field are published.
                        </p>
                      </div>
                    ) : (
                      userJobAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3.5 bg-white dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{alert.department || alert.category} Roles</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8]">
                                  {alert.frequency}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Location: <span className="font-semibold">{alert.location}</span> · Subscribed to {alert.email}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteJobAlert(alert.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Alert"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: Profile & AI Persona */}
              {candidateTab === 'persona' && (
                <>
                  {/* Snapshot */}
                  <div className="space-y-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/70 dark:border-emerald-900/40">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Candidate Career Snapshot</span>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">Verified Profile</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Target Role</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.targetRole}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Experience</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.experienceLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Preference</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.workArrangementPreference}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Expected Monthly</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      ${user.roleData.data.expectedSalaryMonthly || '3,000'} USD
                    </span>
                  </div>
                </div>

                {user.roleData.data.skills && (
                  <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Key Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {user.roleData.data.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded text-[11px] bg-white dark:bg-[#131D35] border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resume Strength & Target Match Quick Banner */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-[#0066CC]/10 to-indigo-500/10 dark:from-emerald-950/30 dark:via-blue-950/30 dark:to-indigo-950/20 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Resume Strength & Target Job Match
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        84% · Strong Contender
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Audited against <strong>{user.roleData.data.targetRole || 'Target Role'}</strong>. 7 of 8 stack skills matched with high ATS density.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCandidateTab('strength')}
                  className="px-3 py-1.5 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#223663] text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center gap-1 transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <span>View Strength Analysis & Suggestions</span>
                </button>
              </div>

              {/* AI Candidate Persona Tool (User Request 5) */}
              <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-[#131D35] dark:to-purple-950/20 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>AI Candidate Persona</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                          Gemini 2.5
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Synthesizes your resume into an executive summary & standout qualifications for job applications.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPersonaInput(!showPersonaInput)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <FileEdit className="w-3 h-3" />
                    <span>{showPersonaInput ? 'Hide Input' : 'Resume / Notes'}</span>
                  </button>
                </div>

                {showPersonaInput && (
                  <div className="space-y-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                      Paste Resume Snippet / Key Achievements (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={resumeSnippet}
                      onChange={(e) => setResumeSnippet(e.target.value)}
                      placeholder="e.g. Led payment microservices at fintech with 99.99% uptime, reduced latency by 35%, scaled transactions to $12M/mo..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1527] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isGeneratingPersona}
                    onClick={handleGeneratePersona}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isGeneratingPersona ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Persona...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
                        <span>{persona ? 'Regenerate AI Persona' : 'Generate AI Candidate Persona'}</span>
                      </>
                    )}
                  </button>

                  {persona && (
                    <button
                      type="button"
                      onClick={handleCopyPersona}
                      className="px-3 py-2 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#223663] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      {copiedPersona ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Persona</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {personaSavedToast && (
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Persona generated & saved! Automatically accessible during job applications.</span>
                  </div>
                )}

                {/* Display Persona if available */}
                {persona && (
                  <div className="mt-3 p-3 bg-white dark:bg-[#0D1527] rounded-lg border border-indigo-100 dark:border-indigo-950/80 space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-0.5">
                        Executive Value Summary
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {persona.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Highlighted Qualifications & Superpowers
                      </span>
                      <ul className="space-y-1">
                        {persona.keyStrengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-2 rounded-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-0.5">
                        High-Impact Application Hook
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 italic">
                        "{persona.applicationHook}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: Saved Interviews & Reschedule */}
          {candidateTab === 'interviews' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Upcoming Interviews & Coordination</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {rescheduleSubmitted ? 'Reschedule Requested' : 'Confirmed'}
                </span>
              </div>

                <div className="p-3 bg-white dark:bg-[#0D1527] rounded-xl border border-emerald-200 dark:border-emerald-800/80 shadow-2xs space-y-2.5">
                  {(() => {
                    const defaultUpcomingIso = new Date(nowMs + (3 * 24 + 5) * 60 * 60 * 1000).toISOString();
                    const countdownInfo = formatInterviewCountdown(defaultUpcomingIso);
                    return (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                        <span>Technical Screening Call with Adaobi Vance</span>
                        {countdownInfo && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono tabular-nums bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800">
                            <Timer className="w-3 h-3" />
                            <span>{countdownInfo.label}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] font-semibold mt-0.5">
                        {user.roleData.data.targetRole || 'Senior Backend Engineer'} · MsmeBooks
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                      rescheduleSubmitted
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8]'
                    }`}>
                      {rescheduleSubmitted ? 'Reschedule Pending' : 'Confirmed'}
                    </span>
                  </div>
                    );
                  })()}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {new Date(nowMs + (3 * 24 + 5) * 60 * 60 * 1000).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZone: 'UTC',
                      })} UTC
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                      Google Meet Video
                    </span>
                  </div>

                  {rescheduleSuccessToast && (
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Formal reschedule notification sent to recruiter! The application pipeline has been marked.</span>
                    </div>
                  )}

                  {rescheduleSubmitted && !showRescheduleForm && (
                    <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center justify-between">
                        <span>Reschedule Request in Progress</span>
                        <button
                          type="button"
                          onClick={handleCancelReschedule}
                          className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                        >
                          Cancel Request
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Proposed slot: <strong>{rescheduleProposedDate} at {rescheduleProposedTime} UTC</strong> ({rescheduleReason}). Awaiting recruiter confirmation.
                      </p>
                    </div>
                  )}

                  {/* Reschedule Request Form Dialog */}
                  {showRescheduleForm ? (
                    <form onSubmit={handleSubmitReschedule} className="p-3 bg-slate-50 dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <CalendarX className="w-3.5 h-3.5 text-amber-600" />
                          <span>Request Interview Reschedule</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowRescheduleForm(false)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Reason for Reschedule *
                        </label>
                        <select
                          value={rescheduleReason}
                          onChange={(e) => setRescheduleReason(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                        >
                          <option value="Work schedule clash">Work schedule clash / Prior client engagement</option>
                          <option value="Timezone mismatch">Timezone / Travel flight conflict</option>
                          <option value="Medical / Emergency">Health or Family Emergency</option>
                          <option value="Awaiting technical preparation">Need 48 hours for project preparation</option>
                          <option value="Other">Other unavoidable conflict</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Proposed Date *
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().slice(0, 10)}
                            value={rescheduleProposedDate}
                            onChange={(e) => setRescheduleProposedDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Proposed Time (UTC) *
                          </label>
                          <input
                            type="time"
                            required
                            value={rescheduleProposedTime}
                            onChange={(e) => setRescheduleProposedTime(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Brief Note to Recruiter (Optional):
                        </label>
                        <input
                          type="text"
                          value={rescheduleNote}
                          onChange={(e) => setRescheduleNote(e.target.value)}
                          placeholder="e.g. Apologies for the inconvenience, I am fully available on the proposed afternoon slot."
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 text-xs outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowRescheduleForm(false)}
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Reschedule Request</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRescheduleForm(true)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg border border-amber-300 dark:border-amber-800/80 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CalendarX className="w-3.5 h-3.5" />
                          <span>{rescheduleSubmitted ? 'Modify Reschedule Request' : 'Request Reschedule'}</span>
                        </button>

                        {onOpenMockInterview && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenMockInterview('Technical Screening Call practice question');
                            }}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            title="Launch AI Mock Interview with timer and microphone"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Practice with AI Mock Interview</span>
                          </button>
                        )}
                      </div>

                      <AddToCalendarButton
                        event={{
                          id: 'candidate-scheduled-interview',
                          candidateName: user.fullName,
                          candidateEmail: user.email,
                          jobTitle: user.roleData.data.targetRole || 'Senior Backend Engineer',
                          companyName: 'MsmeBooks',
                          interviewDate: new Date(nowMs + (3 * 24 + 5) * 60 * 60 * 1000).toISOString(),
                          meetingType: 'Technical Screening Call',
                          referenceCode: 'MSME-APP-2026-9142',
                        }}
                        label="Add to Calendar (.ics)"
                        variant="primary"
                      />
                    </div>
                  )}
                </div>

                {/* Self-Scheduled Upcoming Interviews Booked from Job Details */}
                {bookedInterviews.map((b) => {
                  const cd = formatInterviewCountdown(b.interviewDate);
                  return (
                    <div
                      key={b.id}
                      className="p-3 bg-white dark:bg-[#0D1527] rounded-xl border border-blue-200 dark:border-blue-800/80 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                            <span>{b.meetingType || 'Technical Screening Call'}</span>
                            {cd && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono tabular-nums bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800">
                                <Timer className="w-3 h-3" />
                                <span>{cd.label}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] font-semibold mt-0.5">
                            {b.jobTitle} · {b.companyName || 'MsmeBooks'}
                          </div>
                        </div>
                        <AddToCalendarButton
                          variant="compact"
                          event={{
                            id: b.id,
                            candidateName: user.fullName,
                            candidateEmail: user.email,
                            jobTitle: b.jobTitle,
                            companyName: b.companyName || 'MsmeBooks',
                            interviewDate: b.interviewDate,
                            meetingType: b.meetingType,
                            meetingUrl: b.meetingUrl,
                          }}
                          label="Sync"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#0066CC]" />
                          {new Date(b.interviewDate).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC',
                          })}{' '}
                          UTC
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                          {b.interviewerName || 'Adaobi Vance'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Interview Feedback Portal + Quick-Rate Button for Past Interviews */}
                <div className="pt-3 mt-2 border-t border-emerald-200/60 dark:border-emerald-800/50 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Interview Feedback Portal</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Share private ratings on recruiter communication and professionalism from past rounds.
                      </p>
                    </div>
                  </div>

                  {feedbackToast && (
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg text-[11px] text-[#0066CC] dark:text-[#38BDF8] font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{feedbackToast}</span>
                    </div>
                  )}

                  {[
                    {
                      id: 'past-int-1',
                      jobTitle: 'Senior Backend Engineer (Fintech)',
                      companyName: 'MsmeBooks Technologies',
                      recruiterName: 'Adaobi Vance',
                      completedDate: 'Oct 23, 2026',
                    },
                    {
                      id: 'past-int-2',
                      jobTitle: 'Staff Distributed Systems Architect',
                      companyName: 'Paystack Africa Partner',
                      recruiterName: 'Chidi Okonkwo',
                      completedDate: 'Oct 14, 2026',
                    },
                  ].map((past) => {
                    const submitted = interviewFeedbackMap[past.id];
                    return (
                      <div
                        key={past.id}
                        className="p-3 bg-white dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{past.jobTitle}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {past.companyName} · Interviewer: <strong className="text-slate-700 dark:text-slate-200">{past.recruiterName}</strong> · {past.completedDate}
                          </div>
                          {submitted && (
                            <div className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                              <span className="inline-flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                Comm: {submitted.communicationRating}/5
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                Prof: {submitted.professionalismRating}/5
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenQuickRate(past)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                            submitted
                              ? 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                              : 'bg-[#0066CC] hover:bg-[#0052A3] text-white shadow-2xs'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${submitted ? 'text-amber-500 fill-amber-400' : 'text-[#B5E61D]'}`} />
                          <span>{submitted ? 'Edit Rating' : 'Quick Rate'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: My Applications Pipeline Tracker */}
            {candidateTab === 'applications' && (() => {
              const displayedApplications = userApplications.length > 0 ? userApplications : candidateApplications;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        My Job Applications ({displayedApplications.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Real-time status across recruitment screening, technical assessments, and offers. Synced via Firestore.
                      </p>
                    </div>
                  </div>

                  {displayedApplications.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        No Applications Submitted Yet
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Explore opportunities on the job board and click 1-Click Quick Apply to enter recruiter pipelines.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayedApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 bg-white dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                              {app.jobTitle}
                            </h5>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Ref: <span className="font-mono font-semibold">{app.referenceCode}</span> · Submitted {new Date(app.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {app.status}
                            </span>
                            {onOpenMockInterview && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenMockInterview(`Tell me how you would excel in the ${app.jobTitle} position`);
                                }}
                                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                <span>Practice Interview</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress pipeline indicator */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Applied</span>
                            <span>Review</span>
                            <span>Screening</span>
                            <span>Interview</span>
                            <span>Offer</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-[#0066CC] rounded-full"
                              style={{
                                width:
                                  app.status === 'offer'
                                    ? '100%'
                                    : app.status === 'interview'
                                    ? '75%'
                                    : app.status === 'screening'
                                    ? '50%'
                                    : '25%',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

            {/* TAB 4: Job Application Insights D3 Dashboard */}
            {candidateTab === 'insights' && (
              <div className="space-y-3">
                <ApplicationInsightsD3Chart />
              </div>
            )}

            {/* TAB 5: Visual Resume Strength & Target Job Match */}
            {candidateTab === 'strength' && (
              <div className="space-y-3">
                <ResumeStrengthIndicator
                  candidateName={user.fullName}
                  candidateSkills={user.roleData.data.skills || []}
                  candidateYearsExp={user.roleData.data.experienceLevel === 'Senior' ? 6 : 4}
                  candidateCurrentTitle={user.roleData.data.targetRole}
                  initialTargetRole={user.roleData.data.targetRole}
                />
              </div>
            )}

            {/* TAB 6: Saved Filter Presets (Prompt 3) */}
            {candidateTab === 'presets' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>Saved Search & Career Presets</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Retrieve and activate your customized career filters with one click.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0066CC] dark:text-[#38BDF8]">
                    {savedFilterPresets.length} Presets
                  </span>
                </div>

                {savedFilterPresets.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                    <BookmarkCheck className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Presets Saved Yet</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Configure your preferred role, location, or salary range in the Job Board, then click "Save Preset" in the sidebar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedFilterPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {preset.name}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                              {new Date(preset.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {preset.filters.departments.map((d) => (
                              <span key={d} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8]">
                                {d}
                              </span>
                            ))}
                            {preset.filters.locations.map((l) => (
                              <span key={l} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                                {l}
                              </span>
                            ))}
                            {preset.filters.workArrangements.map((a) => (
                              <span key={a} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                                {a}
                              </span>
                            ))}
                            {preset.filters.currency !== 'ALL' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                                {preset.filters.currency}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (onApplyFilterPreset) onApplyFilterPreset(preset);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            Apply Preset
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUserPreset(preset.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete preset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: AI Resume Builder (ATS-Optimized PDF) */}
            {candidateTab === 'resume-builder' && (
              <ResumeBuilderPanel
                initialFullName={editFullName}
                initialEmail={user.email}
                initialPhone={editPhone}
                initialCity={editCity}
                initialCountry={editCountry}
                initialTargetRole={editTargetRole}
                initialSkillsText={editSkillsText}
                initialBio={editBio}
                initialLinkedinUrl={editLinkedinUrl}
                initialPortfolioUrl={editPortfolioUrl}
                initialWorkHistory={editWorkHistory}
                initialEducation={editEducation}
                savedWorkHistory={user.roleData.data.workHistory || []}
                savedEducation={user.roleData.data.education || []}
                onSyncToProfile={async (payload) => {
                  setEditFullName(payload.fullName);
                  setEditPhone(payload.phone);
                  setEditCity(payload.city);
                  setEditCountry(payload.country);
                  setEditTargetRole(payload.targetRole);
                  setEditSkillsText(payload.skillsText);
                  setEditBio(payload.bio);
                  setEditLinkedinUrl(payload.linkedinUrl);
                  setEditPortfolioUrl(payload.portfolioUrl);
                  setEditWorkHistory(payload.workHistory);
                  setEditEducation(payload.education);

                  const skillsArray = payload.skillsText
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  if (user.roleData.role === 'candidate') {
                    await updateProfile({
                      fullName: payload.fullName,
                      phone: payload.phone,
                      country: payload.country,
                      city: payload.city,
                      roleData: {
                        role: 'candidate',
                        data: {
                          ...user.roleData.data,
                          targetRole: payload.targetRole,
                          skills: skillsArray.length > 0 ? skillsArray : user.roleData.data.skills,
                          bio: payload.bio,
                          linkedinUrl: payload.linkedinUrl,
                          portfolioUrl: payload.portfolioUrl,
                          workHistory: payload.workHistory,
                          education: payload.education,
                        },
                      },
                    });
                  }
                }}
              />
            )}

            {/* TAB: 3-Year AI Career Path Visualization */}
            {candidateTab === 'career-path' && (
              <CareerPathPanel
                currentRole={editWorkHistory[0]?.title || editTargetRole || user.roleData.data.targetRole || 'Software Engineer'}
                experienceLevel={editExperienceLevel || user.roleData.data.experienceLevel || 'Mid-Level'}
                skills={editSkillsText
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)}
                workHistory={editWorkHistory}
                country={editCountry || user.country || 'Nigeria'}
                onAdoptTargetRole={(roleTitle) => setEditTargetRole(roleTitle)}
                onAdoptSkill={(skill) => {
                  setEditSkillsText((prev) => {
                    const existing = prev
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    if (existing.some((s) => s.toLowerCase() === skill.trim().toLowerCase())) {
                      return prev;
                    }
                    return [...existing, skill.trim()].join(', ');
                  });
                }}
              />
            )}
          </div>
        )}

          {user.role === 'employer' && user.roleData.role === 'employer' && (
            <div className="space-y-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/70 dark:border-blue-900/40">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Enterprise & Recruiter Details
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Organization</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Industry</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.industry}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Company Size</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.companySize}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Hiring Pace</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.hiringVolume}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPostJob) onOpenPostJob();
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Post Vacancy</span>
                </button>
                {onOpenPricing && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPricing();
                    }}
                    className="flex-1 py-2 px-3 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#223663] rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>View Pricing Plans</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {user.role === 'agency' && user.roleData.role === 'agency' && (
            <div className="space-y-3 p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/70 dark:border-purple-900/40">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Staffing Agency Operations
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Agency Brand</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.agencyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Candidate Pool</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.candidateRosterSize}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Client Volume</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.clientCountEstimate}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Sector Focus</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.roleData.data.specializationSectors.join(', ')}
                  </span>
                </div>
              </div>

              {onOpenPricing && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPricing();
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-purple-900 dark:text-purple-200 bg-purple-100/80 dark:bg-purple-900/40 hover:bg-purple-200/80 dark:hover:bg-purple-900/60 rounded-lg border border-purple-200 dark:border-purple-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
                    <span>View Agency Single & Bulk Requisition Plans</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {user.role === 'headhunter' && user.roleData.role === 'headhunter' && (
            <div className="space-y-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/70 dark:border-amber-900/40">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Executive Headhunter Mandate
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Practice</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.practiceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Executive Focus</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.executiveFocus.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Experience</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.yearsInExecutiveSearch} Years Search</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Search Tier</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.confidentialSearchTier}</span>
                </div>
              </div>

              {onOpenPricing && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPricing();
                    }}
                    className="w-full py-2 px-3 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/40 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                    <span>View Stealth & Retainer Headhunter Plans</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {user.role === 'partner' && user.roleData.role === 'partner' && (
            <div className="space-y-3 p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-200/70 dark:border-teal-900/40">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Ecosystem Partnership Hub
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Organization</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.organizationName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.roleData.data.partnerCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Referral Code</span>
                  <span className="font-semibold text-[#0066CC] dark:text-[#38BDF8] font-mono">{user.roleData.data.referralCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Referred Talent</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{user.roleData.data.totalReferredTalent} placed</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Switch Role Demo Preview</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Test any of the 5 roles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {demoAccounts.map((acc) => {
                const isCurrent = user.role === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      switchDemoUser(acc.role);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-[#0066CC]/30 font-bold'
                        : 'bg-slate-50 dark:bg-[#0D1527] hover:bg-slate-100 dark:hover:bg-[#1A284A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80'
                    }`}
                  >
                    <span className="truncate">{acc.title}</span>
                    {isCurrent && <span className="text-[10px] text-[#0066CC] dark:text-[#38BDF8]">● Active</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick-Rate Past Interview Modal Overlay */}
      {quickRateInterview && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setQuickRateInterview(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#111B33] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#14243A] to-[#0066CC] p-4 text-white flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B5E61D]">
                  <Star className="w-3.5 h-3.5 fill-[#B5E61D]" />
                  <span>Quick Interview Rating</span>
                </div>
                <h3 className="text-sm font-extrabold mt-0.5 leading-snug">
                  {quickRateInterview.jobTitle}
                </h3>
                <p className="text-[11px] text-blue-100 mt-0.5">
                  Interviewer: <strong className="text-white">{quickRateInterview.recruiterName}</strong> · {quickRateInterview.companyName} ({quickRateInterview.completedDate})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickRateInterview(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close Quick-Rate Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickRate} className="p-5 space-y-4 text-xs">
              {[
                {
                  label: 'Recruiter Communication Skills',
                  hint: 'Clarity, responsiveness & active listening',
                  value: rateComm,
                  setter: setRateComm,
                },
                {
                  label: 'Recruiter Professionalism',
                  hint: 'Punctuality, respect & structured process',
                  value: rateProf,
                  setter: setRateProf,
                },
                {
                  label: 'Role & Technical Clarity',
                  hint: 'Accuracy of role scope & expectations',
                  value: rateRelevance,
                  setter: setRateRelevance,
                },
              ].map((criterion) => (
                <div
                  key={criterion.label}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {criterion.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {criterion.hint}
                      </div>
                    </div>
                    <span className="text-xs font-extrabold font-mono tabular-nums text-[#0066CC] dark:text-[#38BDF8]">
                      {criterion.value}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const active = starValue <= criterion.value;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => criterion.setter(starValue)}
                          aria-label={`Rate ${criterion.label} ${starValue} out of 5`}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            active
                              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-500 scale-105'
                              : 'bg-white dark:bg-[#111B33] border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:text-amber-400'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${active ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  Private Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rateNotes}
                  onChange={(e) => setRateNotes(e.target.value)}
                  placeholder="Share constructive notes on interview pacing, feedback timeliness, or interviewer conduct..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickRateInterview(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B5E61D]" />
                  <span>Submit Rating</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
