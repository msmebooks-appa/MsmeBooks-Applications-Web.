import React, { useState } from 'react';
import { 
  PlayCircle, 
  Award, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Download, 
  Layers, 
  Sparkles,
  ExternalLink,
  Flame,
  FileCheck,
  Star,
  ShieldCheck,
  ChevronRight, 
  Heart,
  Check,
  Lock,
  Zap,
  Target,
  Trophy,
  User,
  Plus,
  Bell,
  Trash2,
  CalendarCheck,
  Share2,
  WifiOff,
  CloudOff,
  HardDriveDownload,
  Printer,
  QrCode,
  X,
  Copy,
  Receipt,
  CreditCard,
  Percent,
  FileText,
  Building2,
  Search
} from 'lucide-react';
import { Course, CertificateRecord, StudentBadge, StudyScheduleItem } from '../types';
import { COURSES, CERTIFICATES_DATABASE, LIVE_WEBINARS } from '../data/mockData';
import { StarRatingWidget } from './StarRatingWidget';
import { isCourseSavedOffline, downloadCourseForOffline, removeCourseFromOffline } from '../utils/offlineCourseStorage';
import { 
  getCertificateForCourse, 
  downloadCertificatePdf, 
  printCertificate 
} from '../utils/certificatePdfGenerator';
import { InvoiceRecord } from '../data/paymentGateways';
import { getCustomerInvoices } from '../utils/invoiceStorage';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

interface StudentDashboardProps {
  onContinueCourse: (course: Course) => void;
  onExploreMore: () => void;
  onOpenSandbox: () => void;
  onViewCertificate: (certId: string) => void;
  onSelectCourse?: (course: Course) => void;
  onEnrollCourse?: (course: Course) => void;
  wishlistCourseIds?: string[];
  onToggleWishlist?: (courseId: string) => void;
  courseRatings?: Record<string, { userRating?: number; averageRating: number; ratingCount: number }>;
  onRateCourse?: (courseId: string, rating: number) => void;
  isOffline?: boolean;
  currentCurrency?: SupportedCurrency;
  onOpenCart?: () => void;
}

interface EnrolledCourseItem {
  course: Course;
  completedModules: number;
  totalModules: number;
  currentModuleTitle: string;
  nextLessonTitle: string;
  lastActive: string;
  enrolledDate: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onContinueCourse,
  onExploreMore,
  onOpenSandbox,
  onViewCertificate,
  onSelectCourse,
  onEnrollCourse,
  wishlistCourseIds = [],
  onToggleWishlist,
  courseRatings = {},
  onRateCourse,
  isOffline = false,
  currentCurrency = 'NGN',
  onOpenCart
}) => {
  const studentCerts = [CERTIFICATES_DATABASE[0]];

  // Offline cached courses tracking
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);
  const [offlineFeedback, setOfflineFeedback] = useState<string | null>(null);
  const [offlineCacheTick, setOfflineCacheTick] = useState(0);

  const handleToggleOfflineCourse = async (course: Course) => {
    const isSaved = isCourseSavedOffline(course.id);
    if (isSaved) {
      removeCourseFromOffline(course.id);
      setOfflineFeedback(`"${course.title}" removed from offline storage.`);
    } else {
      setDownloadingCourseId(course.id);
      await downloadCourseForOffline(course);
      setDownloadingCourseId(null);
      setOfflineFeedback(`"${course.title}" downloaded and cached for offline study!`);
    }
    setOfflineCacheTick((prev) => prev + 1);
    setTimeout(() => setOfflineFeedback(null), 4000);
  };

  // Dashboard Sub-navigation Tabs
  const [activeDashboardTab, setActiveDashboardTab] = useState<'overview' | 'schedule' | 'badges' | 'certificates' | 'invoices'>('overview');

  // Customer Invoices & Receipts State
  const [customerInvoices, setCustomerInvoices] = useState<InvoiceRecord[]>(() => getCustomerInvoices());
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<InvoiceRecord | null>(null);

  // Synchronize invoices when a new payment occurs
  React.useEffect(() => {
    const syncInvoices = () => {
      setCustomerInvoices(getCustomerInvoices());
    };
    window.addEventListener('msmebooks_invoices_changed', syncInvoices);
    window.addEventListener('storage', syncInvoices);
    return () => {
      window.removeEventListener('msmebooks_invoices_changed', syncInvoices);
      window.removeEventListener('storage', syncInvoices);
    };
  }, []);

  // Certificate Download & Preview States
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [certificateSuccessToast, setCertificateSuccessToast] = useState<{
    courseTitle: string;
    certId: string;
  } | null>(null);
  const [previewCertModal, setPreviewCertModal] = useState<CertificateRecord | null>(null);
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);

  // Streak state & daily claim bonus
  const [streakDays, setStreakDays] = useState(7);
  const [totalXP, setTotalXP] = useState(() => {
    try {
      const saved = localStorage.getItem('msmebooks_student_xp');
      return saved ? parseInt(saved, 10) : 2450;
    } catch {
      return 2450;
    }
  });

  const [hasClaimedDailyStreak, setHasClaimedDailyStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('msmebooks_streak_claimed_date');
      const today = new Date().toDateString();
      return saved === today;
    } catch {
      return false;
    }
  });

  const [streakBonusFeedback, setStreakBonusFeedback] = useState<string | null>(null);

  const handleClaimDailyStreak = () => {
    if (hasClaimedDailyStreak) return;
    const newXP = totalXP + 50;
    setTotalXP(newXP);
    setHasClaimedDailyStreak(true);
    setStreakBonusFeedback('+50 XP Claimed! Keep up the daily study streak.');
    try {
      localStorage.setItem('msmebooks_student_xp', newXP.toString());
      localStorage.setItem('msmebooks_streak_claimed_date', new Date().toDateString());
    } catch {}
    setTimeout(() => setStreakBonusFeedback(null), 4000);
  };

  const [activeBadgeFilter, setActiveBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | 'completion' | 'mastery' | 'streak' | 'certification'>('all');
  const [badgeSearchQuery, setBadgeSearchQuery] = useState('');
  const [selectedBadgeForModal, setSelectedBadgeForModal] = useState<StudentBadge | null>(null);
  const [badgeShareFeedback, setBadgeShareFeedback] = useState<string | null>(null);

  // Enrolled courses state with module completion tracking
  // Course 1 is 100% complete (5 of 5) to display the Certificate PDF button immediately.
  // Course 2 is at 3 of 4 modules, allowing the user to click "+Module" to test real-time certificate unlocking.
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseItem[]>([
    {
      course: COURSES[0],
      completedModules: 5,
      totalModules: 5,
      currentModuleTitle: 'Module 5: Management Reporting & Final Certification',
      nextLessonTitle: 'Curriculum Mastered · Distinction Honor',
      lastActive: 'Today',
      enrolledDate: 'Oct 12, 2026'
    },
    {
      course: COURSES[1],
      completedModules: 3,
      totalModules: 4,
      currentModuleTitle: 'Module 4: Multi-Branch Cash Consolidation & Audit',
      nextLessonTitle: '4.1 Final Audit Verification & Supervisor Approval',
      lastActive: 'Yesterday',
      enrolledDate: 'Oct 18, 2026'
    },
    {
      course: COURSES[2],
      completedModules: 1,
      totalModules: 4,
      currentModuleTitle: 'Module 2: Multi-Warehouse Transfers & In-Transit',
      nextLessonTitle: '2.1 Goods-In-Transit (GIT) Reconciliation',
      lastActive: '3 days ago',
      enrolledDate: 'Oct 22, 2026'
    },
    {
      course: COURSES[4],
      completedModules: 2,
      totalModules: 3,
      currentModuleTitle: 'Module 3: Daily Profit & Executive Cash Position',
      nextLessonTitle: '3.1 Understanding Real-Time Dashboard KPI Metrics',
      lastActive: 'Oct 28',
      enrolledDate: 'Oct 25, 2026'
    }
  ]);

  // Derived completed courses and accredited certificates
  const completedCourseItems = enrolledCourses.filter((e) => e.completedModules >= e.totalModules);
  const earnedCertificates = completedCourseItems.map((e) => getCertificateForCourse(e.course));

  // Primary active course (first in enrolled)
  const primaryCourseItem = enrolledCourses[0];

  // Helper to simulate advancing a module in real time
  const handleAdvanceModule = (courseId: string) => {
    setEnrolledCourses((prev) =>
      prev.map((item) => {
        if (item.course.id === courseId && item.completedModules < item.totalModules) {
          const nextCount = item.completedModules + 1;
          const isNowDone = nextCount >= item.totalModules;
          if (isNowDone) {
            const cert = getCertificateForCourse(item.course);
            setCertificateSuccessToast({
              courseTitle: item.course.title,
              certId: cert.certificateId
            });
            setTimeout(() => setCertificateSuccessToast(null), 6000);
          }
          return {
            ...item,
            completedModules: nextCount,
            lastActive: 'Just now'
          };
        }
        return item;
      })
    );
  };

  // Handler to download accredited PDF certificate for any completed course
  const handleDownloadCourseCertificate = (course: Course) => {
    setDownloadingCertId(course.id);
    const cert = getCertificateForCourse(course);
    setTimeout(() => {
      downloadCertificatePdf(cert);
      setDownloadingCertId(null);
      setCertificateSuccessToast({
        courseTitle: course.title,
        certId: cert.certificateId
      });
      setTimeout(() => setCertificateSuccessToast(null), 6000);
    }, 350);
  };

  // Handler to open certificate preview modal
  const handleOpenCertificatePreview = (course: Course) => {
    const cert = getCertificateForCourse(course);
    setPreviewCertModal(cert);
  };

  const handleCopyCertId = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id).catch(() => {});
    }
    setCopiedCertId(id);
    setTimeout(() => setCopiedCertId(null), 2500);
  };

  // Study Schedule State
  const [studySchedule, setStudySchedule] = useState<StudyScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_study_schedule');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sched-1',
        courseId: 'course-1',
        courseTitle: 'Mastering MsmeBooks Cloud Accounting',
        sessionTitle: 'Final Exam & P&L Statement Review',
        targetDay: 'Tomorrow',
        targetTime: '17:00',
        durationMinutes: 45,
        completed: false,
        reminderEnabled: true,
        deadlineDate: 'Nov 04, 2026',
        notes: 'Review chart codes 1000 through 5000 before attempting final accreditation quiz.'
      },
      {
        id: 'sched-2',
        courseId: 'course-2',
        courseTitle: 'Advanced Point of Sale (POS) Operations',
        sessionTitle: 'Module 3 Shift Cash Drop Simulation',
        targetDay: 'Thursday',
        targetTime: '19:30',
        durationMinutes: 30,
        completed: false,
        reminderEnabled: true,
        deadlineDate: 'Nov 07, 2026',
        notes: 'Practice dual authentication supervisor approvals in the sandbox.'
      },
      {
        id: 'sched-3',
        courseId: 'course-3',
        courseTitle: 'Inventory, Warehouse & Barcode Systems',
        sessionTitle: 'Inter-Branch Stock Transfer Request',
        targetDay: 'Saturday',
        targetTime: '10:00',
        durationMinutes: 60,
        completed: true,
        reminderEnabled: false,
        deadlineDate: 'Nov 09, 2026',
        notes: 'Completed warehouse transfer exercise in Ikeja depot branch.'
      }
    ];
  });

  // Schedule Creator State
  const [newScheduleCourseId, setNewScheduleCourseId] = useState('course-1');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleDay, setNewScheduleDay] = useState('Tomorrow');
  const [newScheduleTime, setNewScheduleTime] = useState('18:00');
  const [newScheduleDuration, setNewScheduleDuration] = useState(45);
  const [newScheduleNotes, setNewScheduleNotes] = useState('');

  const handleAddScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;

    const matchedCourse = COURSES.find((c) => c.id === newScheduleCourseId) || COURSES[0];

    const newItem: StudyScheduleItem = {
      id: `sched-${Date.now()}`,
      courseId: matchedCourse.id,
      courseTitle: matchedCourse.title,
      sessionTitle: newScheduleTitle.trim(),
      targetDay: newScheduleDay,
      targetTime: newScheduleTime,
      durationMinutes: newScheduleDuration,
      completed: false,
      reminderEnabled: true,
      notes: newScheduleNotes.trim() || 'Scheduled deliberate software learning session.'
    };

    const updated = [newItem, ...studySchedule];
    setStudySchedule(updated);
    try {
      localStorage.setItem('msmebooks_study_schedule', JSON.stringify(updated));
    } catch {}

    setNewScheduleTitle('');
    setNewScheduleNotes('');
  };

  const handleToggleScheduleCompleted = (id: string) => {
    setStudySchedule((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, completed: !s.completed } : s);
      try {
        localStorage.setItem('msmebooks_study_schedule', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleScheduleReminder = (id: string) => {
    setStudySchedule((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, reminderEnabled: !s.reminderEnabled } : s);
      try {
        localStorage.setItem('msmebooks_study_schedule', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteScheduleItem = (id: string) => {
    setStudySchedule((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('msmebooks_study_schedule', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Export schedule to .ics calendar format
  const handleExportICal = () => {
    const calendarData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MsmeBooks Academy//Study Schedule//EN',
      ...studySchedule.map((item) => `
BEGIN:VEVENT
SUMMARY:MsmeBooks: ${item.sessionTitle}
DESCRIPTION:${item.courseTitle} - ${item.notes}
STATUS:${item.completed ? 'COMPLETED' : 'CONFIRMED'}
END:VEVENT`.trim()),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'msmebooks_study_schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Student Badges and Milestone Achievements
  const studentBadges: StudentBadge[] = [
    {
      id: 'badge-first-course',
      name: 'First Course Completed',
      description: 'Successfully completed 100% of your first accredited enterprise software course curriculum and passed all module assessments.',
      category: 'completion',
      icon: '🎓',
      unlocked: completedCourseItems.length > 0,
      unlockedAt: completedCourseItems.length > 0 ? 'Unlocked Oct 12, 2026' : undefined,
      progressCurrent: Math.min(1, completedCourseItems.length),
      progressTarget: 1,
      progressUnit: 'course',
      xpReward: 350,
      criteria: 'Complete 100% of curriculum modules and practical ledger submissions for any 1 accredited course.',
      rarity: 'Common'
    },
    {
      id: 'badge-quiz-master',
      name: 'Quiz Master',
      description: 'Demonstrated superior software comprehension by passing 5 module knowledge check quizzes with an average score above 90%.',
      category: 'mastery',
      icon: '🧠',
      unlocked: false,
      progressCurrent: 4,
      progressTarget: 5,
      progressUnit: 'quizzes',
      xpReward: 300,
      criteria: 'Score 90% or higher on at least 5 syllabus knowledge quizzes across financial and POS tracks.',
      rarity: 'Rare'
    },
    {
      id: 'badge-perfect-score',
      name: 'Perfect Score',
      description: 'Achieved an immaculate 100% grade on an end-of-module assessment examination without a single mistake.',
      category: 'mastery',
      icon: '💯',
      unlocked: false,
      progressCurrent: 98,
      progressTarget: 100,
      progressUnit: '% score',
      xpReward: 500,
      criteria: 'Attain a verified 100% score on the Cloud Accounting Final Ledger Assessment drill.',
      rarity: 'Legendary'
    },
    {
      id: 'badge-1',
      name: '7-Day Streak Master',
      description: 'Logged in and completed practical software exercises for 7 consecutive days.',
      category: 'streak',
      icon: '🔥',
      unlocked: true,
      unlockedAt: 'Unlocked yesterday',
      progressCurrent: 7,
      progressTarget: 7,
      progressUnit: 'days',
      xpReward: 250,
      criteria: 'Engage with daily practice drills and courseware for 7 consecutive calendar days.',
      rarity: 'Rare'
    },
    {
      id: 'badge-2',
      name: 'Fast-Track Scholar',
      description: 'Completed your first 5 software training modules in record time within 14 days of enrollment.',
      category: 'completion',
      icon: '📚',
      unlocked: true,
      unlockedAt: 'Unlocked Oct 24, 2026',
      progressCurrent: 5,
      progressTarget: 5,
      progressUnit: 'modules',
      xpReward: 150,
      criteria: 'Complete 5 full coursework modules within 14 calendar days.',
      rarity: 'Common'
    },
    {
      id: 'badge-3',
      name: 'Master Certified Bookkeeper',
      description: 'Passed the accredited MCPB professional board accreditation examination with a 98% score.',
      category: 'certification',
      icon: '🛡️',
      unlocked: true,
      unlockedAt: 'Unlocked Oct 29, 2026',
      progressCurrent: 1,
      progressTarget: 1,
      progressUnit: 'exam',
      xpReward: 600,
      criteria: 'Satisfy all practical exam prerequisites and pass the CPD accredited board examination.',
      rarity: 'Epic'
    },
    {
      id: 'badge-4',
      name: 'Sandbox Virtuoso',
      description: 'Executed 10 practice transactions in the live multi-tenant software sandbox with zero reconciliation errors.',
      category: 'mastery',
      icon: '⚡',
      unlocked: true,
      unlockedAt: 'Unlocked Oct 27, 2026',
      progressCurrent: 10,
      progressTarget: 10,
      progressUnit: 'txns',
      xpReward: 200,
      criteria: 'Post 10 simulated invoices, journals, or inventory transfers in the live sandbox environment.',
      rarity: 'Rare'
    },
    {
      id: 'badge-6',
      name: '14-Day Consistency Titan',
      description: 'Maintain a 14-day consecutive active study streak across all enrolled masterclasses.',
      category: 'streak',
      icon: '🏆',
      unlocked: false,
      progressCurrent: 7,
      progressTarget: 14,
      progressUnit: 'days',
      xpReward: 500,
      criteria: 'Log in and complete at least one practical drill for 14 consecutive calendar days.',
      rarity: 'Epic'
    },
    {
      id: 'badge-7',
      name: 'Multi-Sector Specialist',
      description: 'Complete training modules across both Private Enterprise and Government Public Sector tracks.',
      category: 'completion',
      icon: '🏛️',
      unlocked: false,
      progressCurrent: 2,
      progressTarget: 3,
      progressUnit: 'tracks',
      xpReward: 400,
      criteria: 'Finish at least one module each in Private SME, Agribusiness, and IPSAS Public Sector accounting.',
      rarity: 'Rare'
    },
    {
      id: 'badge-8',
      name: 'Century Scholar (100 Hours)',
      description: 'Log 100 cumulative hours of hands-on ERP & POS operational mastery in MsmeBooks software.',
      category: 'mastery',
      icon: '⏳',
      unlocked: false,
      progressCurrent: 22.5,
      progressTarget: 100,
      progressUnit: 'hrs',
      xpReward: 750,
      criteria: 'Accumulate 100 verified hands-on practice hours inside the simulated business environment.',
      rarity: 'Legendary'
    }
  ];

  const getBadgeProgressPercent = (badge: StudentBadge): number => {
    if (badge.unlocked) return 100;
    if (!badge.progressTarget || badge.progressTarget <= 0) return 0;
    return Math.min(99, Math.max(0, Math.round(((badge.progressCurrent ?? 0) / badge.progressTarget) * 100)));
  };

  const getBadgeRemainingText = (badge: StudentBadge): string => {
    if (badge.unlocked) return 'Completed';
    if (!badge.progressTarget) return 'In progress';
    const remaining = Math.max(0, Number((badge.progressTarget - (badge.progressCurrent ?? 0)).toFixed(1)));
    if (badge.id === 'badge-perfect-score') return `${remaining}% away from 100%`;
    const unit = badge.progressUnit ? ` ${badge.progressUnit}` : '';
    return `${remaining}${unit} to unlock`;
  };

  const handleShareBadge = (badge: StudentBadge) => {
    const text = `🏆 I unlocked the "${badge.name}" achievement badge on MsmeBooks Academy! (+${badge.xpReward} XP) #MsmeBooks #AccountingTech`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setBadgeShareFeedback(`Copied share link for "${badge.name}"!`);
    setTimeout(() => setBadgeShareFeedback(null), 3000);
  };

  const filteredBadges = studentBadges.filter((b) => {
    if (activeBadgeFilter === 'unlocked' && !b.unlocked) return false;
    if (activeBadgeFilter === 'locked' && b.unlocked) return false;
    if (badgeCategoryFilter !== 'all' && b.category !== badgeCategoryFilter) return false;
    if (badgeSearchQuery.trim()) {
      const q = badgeSearchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchCrit = b.criteria ? b.criteria.toLowerCase().includes(q) : false;
      if (!matchName && !matchDesc && !matchCrit) return false;
    }
    return true;
  });

  const unlockedBadges = studentBadges.filter((b) => b.unlocked);
  const unlockedCount = unlockedBadges.length;
  const totalBadgesCount = studentBadges.length;
  const earnedXpFromBadges = unlockedBadges.reduce((sum, b) => sum + b.xpReward, 0);
  const totalPossibleXp = studentBadges.reduce((sum, b) => sum + b.xpReward, 0);
  const badgeCompletionRate = Math.round((unlockedCount / totalBadgesCount) * 100);
  const nextMilestoneToUnlock = [...studentBadges]
    .filter((b) => !b.unlocked)
    .sort((a, b) => getBadgeProgressPercent(b) - getBadgeProgressPercent(a))[0];

  const enrolledIds = enrolledCourses.map((e) => e.course.id);

  const recommendedCourses = COURSES.filter((c) => !enrolledIds.includes(c.id)).map((c) => {
    let reason = 'Curated for your enterprise skill pathway';
    if (c.category.includes('IPSAS') || c.category.includes('Public Sector')) {
      reason = '⚡ Complements your Cloud Accounting & Multi-Currency track';
    } else if (c.category.includes('Agriculture') || c.category.includes('Agribusiness')) {
      reason = '🌱 Extends your Inventory & Warehouse logistics to farm produce';
    } else if (c.category.includes('Energy') || c.category.includes('Oil')) {
      reason = '⛽ High-value sector accounting matching your financial ledger skills';
    } else if (c.category.includes('Transport') || c.category.includes('Fleet')) {
      reason = '🚚 Synergizes with your POS & Multi-Location operations';
    } else if (c.category.includes('Taxation')) {
      reason = '💼 Next accreditation following Double-Entry Bookkeeping';
    }
    return { course: c, reason };
  }).slice(0, 4);

  const totalCompletedModules = enrolledCourses.reduce((acc, curr) => acc + curr.completedModules, 0);
  const totalModulesPossible = enrolledCourses.reduce((acc, curr) => acc + curr.totalModules, 0);
  const overallPercentage = Math.round((totalCompletedModules / totalModulesPossible) * 100);

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Offline Mode Alert Banner */}
        {isOffline && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-4 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 text-xs text-amber-900 dark:text-amber-200">
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>Offline Learning Mode Active</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200 dark:bg-amber-800 font-black text-amber-950 dark:text-amber-100">
                  Service Worker Ready
                </span>
              </div>
              <p className="text-amber-800/90 dark:text-amber-300/80">
                Internet disconnected. You can seamlessly access all saved modules, study guides, and interactive lessons stored in your local offline cache.
              </p>
            </div>
          </div>
        )}

        {offlineFeedback && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{offlineFeedback}</span>
          </div>
        )}

        {/* Certificate PDF Download Success Toast */}
        {certificateSuccessToast && (
          <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/10 dark:from-emerald-950/80 dark:to-teal-950/80 border-2 border-emerald-400 dark:border-emerald-600 px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2 flex-wrap">
                  <span>Official Certificate PDF Downloaded</span>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 px-2 py-0.5 rounded-full font-mono font-bold">
                    {certificateSuccessToast.certId}
                  </span>
                  <span className="text-[10px] bg-[#72B01D] text-slate-950 px-2 py-0.5 rounded-full font-black">
                    100% COMPLETE
                  </span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                  High-fidelity vector PDF for <strong>{certificateSuccessToast.courseTitle}</strong> saved to your device. Recognized across 30+ African partner networks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onViewCertificate(certificateSuccessToast.certId)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Verify Credential</span>
              </button>
              <button
                onClick={() => setCertificateSuccessToast(null)}
                className="p-1.5 text-emerald-600 hover:text-emerald-900 dark:hover:text-emerald-200 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. STUDENT USER PROFILE & DAILY STUDY STREAK COMMAND CARD */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#073B75] via-[#0B4F9C] to-[#0D5EB9] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-blue-900 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
            <Trophy className="w-96 h-96 -mr-16 text-white" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Student Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Chiamaka Ngozi Eze"
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#72B01D] shadow-md ring-4 ring-white/10"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#72B01D] text-white p-1 rounded-full shadow-xs" title="Verified Active Student">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#72B01D] text-slate-950 px-2 py-0.5 rounded-sm">
                    Verified Trainee
                  </span>
                  <span className="text-xs text-blue-200">
                    ID: #MSME-STU-2026-4491
                  </span>
                  <span className="text-blue-300">·</span>
                  <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-[#84CC16]" />
                    Level 4 Senior Scholar ({totalXP.toLocaleString()} XP)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Chiamaka Ngozi Eze
                </h1>
                
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Accredited SME Enterprise Bookkeeper &amp; Cashier Systems Specialist · Lagos, Nigeria
                </p>

                {/* Daily Study Streak Widget */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-amber-300">{streakDays}-Day Streak</span>
                    <span className="text-blue-200">·</span>
                    <div className="flex items-center gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full bg-[#72B01D] text-slate-950 flex items-center justify-center text-[9px] font-black"
                          title={`Day ${day}: Goal completed`}
                        >
                          ✓
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Reward Claim Button */}
                  <button
                    onClick={handleClaimDailyStreak}
                    disabled={hasClaimedDailyStreak}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      hasClaimedDailyStreak
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-[#72B01D] hover:bg-[#5B8D17] text-slate-950 hover:shadow-md'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{hasClaimedDailyStreak ? 'Claimed Today (+50 XP)' : 'Claim Daily Study Bonus (+50 XP)'}</span>
                  </button>

                  {streakBonusFeedback && (
                    <span className="text-xs font-bold text-emerald-300 animate-bounce">
                      {streakBonusFeedback}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics Cluster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center min-w-22">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-xl">
                  <Flame className="w-5 h-5 fill-amber-400" />
                  <span className="tabular-nums">{streakDays}</span>
                </div>
                <span className="text-[10px] text-slate-200 font-medium block mt-0.5">Day Streak</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center min-w-22">
                <div className="text-xl font-black text-white tabular-nums">
                  {totalCompletedModules}
                </div>
                <span className="text-[10px] text-slate-200 font-medium block mt-0.5">Modules Done</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('certificates')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center min-w-22 transition-all cursor-pointer group"
                title="View all accredited certificates and PDF downloads"
              >
                <div className="text-xl font-black text-[#84CC16] tabular-nums group-hover:scale-105 transition-transform flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-[#84CC16]" />
                  <span>{earnedCertificates.length}</span>
                </div>
                <span className="text-[10px] text-slate-200 font-medium block mt-0.5 underline decoration-[#84CC16]/60">
                  {earnedCertificates.length === 1 ? 'Verified Cert' : 'Verified Certs'}
                </span>
              </button>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center min-w-22">
                <div className="text-xl font-black text-white tabular-nums">
                  {overallPercentage}%
                </div>
                <span className="text-[10px] text-slate-200 font-medium block mt-0.5">Total Progress</span>
              </div>
            </div>

          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-sm font-semibold flex-wrap">
          <button
            onClick={() => setActiveDashboardTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeDashboardTab === 'overview'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Active Courses &amp; Progress</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('schedule')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeDashboardTab === 'schedule'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Study Schedule &amp; Deadlines</span>
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black">
              {studySchedule.filter((s) => !s.completed).length}
            </span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('badges')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeDashboardTab === 'badges'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Achievements ({unlockedCount})</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('certificates')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeDashboardTab === 'certificates'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-[#72B01D]" />
            <span>Accredited Certificates</span>
            {earnedCertificates.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#72B01D] text-slate-950 rounded-full text-[10px] font-black">
                {earnedCertificates.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveDashboardTab('invoices')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeDashboardTab === 'invoices'
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4 text-[#72B01D]" />
            <span>Invoices &amp; Receipts ({customerInvoices.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 2: STUDY SCHEDULE & DEADLINES */}
        {/* ========================================================================= */}
        {activeDashboardTab === 'schedule' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Cols: Schedule List & Deadlines */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Your Study Timetable &amp; Exam Deadlines
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Stay accountable to your weekly enterprise accreditation milestones
                    </p>
                  </div>

                  <button
                    onClick={handleExportICal}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Export calendar to Google Calendar or iCal"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                    <span>Sync with Google/Apple Calendar (.ics)</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {studySchedule.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        session.completed
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleToggleScheduleCompleted(session.id)}
                          className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 border ${
                            session.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-700 hover:border-[#0B4F9C]'
                          }`}
                        >
                          {session.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                              session.completed 
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400' 
                                : 'bg-blue-100 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300'
                            }`}>
                              {session.targetDay} at {session.targetTime} ({session.durationMinutes} min)
                            </span>

                            {session.deadlineDate && (
                              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-sm">
                                Deadline: {session.deadlineDate}
                              </span>
                            )}
                          </div>

                          <h4 className={`text-sm font-bold text-slate-900 dark:text-white ${session.completed ? 'line-through text-slate-500' : ''}`}>
                            {session.sessionTitle}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Course: {session.courseTitle}
                          </p>

                          {session.notes && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 italic bg-slate-50 dark:bg-slate-850 p-2 rounded-lg">
                              Note: {session.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <button
                          onClick={() => handleToggleScheduleReminder(session.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            session.reminderEnabled
                              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}
                          title={session.reminderEnabled ? 'Reminder notifications active' : 'Reminder muted'}
                        >
                          <Bell className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteScheduleItem(session.id)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Remove session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 1 Col: Add Reminder Form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Add Study Session Reminder
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sync with course deadlines
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddScheduleSession} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Course
                    </label>
                    <select
                      value={newScheduleCourseId}
                      onChange={(e) => setNewScheduleCourseId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
                    >
                      {enrolledCourses.map((e) => (
                        <option key={e.course.id} value={e.course.id}>
                          {e.course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Session Goal / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newScheduleTitle}
                      onChange={(e) => setNewScheduleTitle(e.target.value)}
                      placeholder="e.g. Complete Bank Reconciliation Quiz"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Scheduled Day
                      </label>
                      <select
                        value={newScheduleDay}
                        onChange={(e) => setNewScheduleDay(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newScheduleTime}
                        onChange={(e) => setNewScheduleTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Duration (Minutes)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[25, 45, 60, 90].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setNewScheduleDuration(dur)}
                          className={`py-1.5 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                            newScheduleDuration === dur
                              ? 'bg-[#0B4F9C] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {dur}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Study Focus Notes
                    </label>
                    <textarea
                      rows={2}
                      value={newScheduleNotes}
                      onChange={(e) => setNewScheduleNotes(e.target.value)}
                      placeholder="e.g. Focus on VAT output matching with tax schedule"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Save to My Timetable</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ACHIEVEMENTS & MILESTONE BADGES */}
        {/* ========================================================================= */}
        {activeDashboardTab === 'badges' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Overview Banner */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Achievements &amp; Milestone Badges
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                    Demonstrate validated practical expertise across cloud accounting, POS cashiering, inventory controls, and financial accreditation. Badges award XP bonuses and verify professional competencies.
                  </p>
                </div>

                {badgeShareFeedback && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{badgeShareFeedback}</span>
                  </div>
                )}
              </div>

              {/* Four Summary Stat KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Stat 1: Unlocked Badges */}
                <div className="bg-slate-50 dark:bg-slate-850/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Milestones Earned</span>
                    <Award className="w-4 h-4 text-[#72B01D]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {unlockedCount} <span className="text-xs font-semibold text-slate-400">/ {totalBadgesCount}</span>
                    </div>
                    <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-[#72B01D] h-full rounded-full transition-all duration-500"
                        style={{ width: `${badgeCompletionRate}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-1">
                      {badgeCompletionRate}% of all milestones completed
                    </span>
                  </div>
                </div>

                {/* Stat 2: Total Achievement XP */}
                <div className="bg-slate-50 dark:bg-slate-850/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Milestone XP</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                      {earnedXpFromBadges.toLocaleString()} <span className="text-xs font-normal text-slate-400">XP</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-1">
                      +{ (totalPossibleXp - earnedXpFromBadges).toLocaleString()} XP locked in pending goals
                    </span>
                  </div>
                </div>

                {/* Stat 3: Academic Mastery Rank */}
                <div className="bg-slate-50 dark:bg-slate-850/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Proficiency Level</span>
                    <ShieldCheck className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white truncate">
                      Level {Math.max(1, Math.floor(totalXP / 350))} Scholar
                    </div>
                    <span className="text-[10px] text-[#0B4F9C] dark:text-blue-300 font-semibold block mt-1">
                      Mastery Status: Senior Practitioner
                    </span>
                  </div>
                </div>

                {/* Stat 4: Closest Target Milestone */}
                <div className="bg-slate-50 dark:bg-slate-850/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Closest Unlock</span>
                    <Target className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {nextMilestoneToUnlock ? nextMilestoneToUnlock.name : 'All Milestones Mastered!'}
                    </div>
                    {nextMilestoneToUnlock && (
                      <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0B4F9C] to-[#72B01D] h-full rounded-full transition-all duration-500"
                          style={{ width: `${getBadgeProgressPercent(nextMilestoneToUnlock)}%` }}
                        />
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-1">
                      {nextMilestoneToUnlock
                        ? `${getBadgeProgressPercent(nextMilestoneToUnlock)}% · ${getBadgeRemainingText(nextMilestoneToUnlock)}`
                        : '100% Elite Master Honor'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Requested Milestones Spotlight Banner */}
              <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-850 dark:via-slate-850 dark:to-slate-800 p-4 sm:p-5 rounded-2xl border border-blue-200/60 dark:border-slate-700/80">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Core Academic Milestones Spotlight
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                    Live progress toward First Course Completed, Quiz Master &amp; Perfect Score
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {studentBadges.filter((b) => ['badge-first-course', 'badge-quiz-master', 'badge-perfect-score'].includes(b.id)).map((spotlight) => {
                    const pct = getBadgeProgressPercent(spotlight);
                    const remaining = getBadgeRemainingText(spotlight);
                    return (
                      <div
                        key={spotlight.id}
                        onClick={() => setSelectedBadgeForModal(spotlight)}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0B4F9C] dark:hover:border-blue-500 transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex items-start gap-3"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-750 flex items-center justify-center text-2xl shrink-0 border border-amber-200/50 dark:border-slate-700 group-hover:scale-105 transition-transform">
                          {spotlight.icon}
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors">
                                {spotlight.name}
                              </h4>
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                                +{spotlight.xpReward} XP
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {spotlight.description}
                            </p>
                          </div>

                          {/* Spotlight Visual Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                                {spotlight.progressCurrent ?? 0} / {spotlight.progressTarget} {spotlight.progressUnit || ''}
                              </span>
                              <span className={`font-extrabold tabular-nums ${
                                spotlight.unlocked
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-[#0B4F9C] dark:text-blue-400'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                            <div
                              role="progressbar"
                              aria-valuenow={pct}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${spotlight.name} progress`}
                              className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60"
                            >
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  spotlight.unlocked
                                    ? 'bg-gradient-to-r from-emerald-500 to-[#72B01D]'
                                    : 'bg-gradient-to-r from-[#0B4F9C] via-blue-500 to-[#72B01D]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-0.5">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              spotlight.unlocked
                                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/70'
                                : 'text-[#0B4F9C] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70'
                            }`}>
                              {spotlight.unlocked ? 'Unlocked' : remaining}
                            </span>
                            <span className="text-[10px] text-slate-400 group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 flex items-center gap-0.5 font-semibold">
                              Details <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filtering Controls: Status, Category, and Search */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={badgeSearchQuery}
                    onChange={(e) => setBadgeSearchQuery(e.target.value)}
                    placeholder="Search milestones, criteria, or badges..."
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#0B4F9C]"
                  />
                  {badgeSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBadgeSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveBadgeFilter('all')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeBadgeFilter === 'all'
                          ? 'bg-white dark:bg-slate-700 text-[#0B4F9C] dark:text-blue-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All ({studentBadges.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBadgeFilter('unlocked')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeBadgeFilter === 'unlocked'
                          ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Earned ({unlockedCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBadgeFilter('locked')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        activeBadgeFilter === 'locked'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      In-Progress ({studentBadges.length - unlockedCount})
                    </button>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto text-xs py-0.5">
                    {[
                      { id: 'all', label: 'All Categories' },
                      { id: 'completion', label: 'Completion' },
                      { id: 'mastery', label: 'Mastery' },
                      { id: 'streak', label: 'Streaks' },
                      { id: 'certification', label: 'Certifications' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setBadgeCategoryFilter(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                          badgeCategoryFilter === cat.id
                            ? 'bg-[#0B4F9C] text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            {filteredBadges.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No matching achievement badges found
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or reset filters to display all milestones.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBadgeFilter('all');
                    setBadgeCategoryFilter('all');
                    setBadgeSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBadges.map((badge) => {
                  const isSpecialMilestone = ['badge-first-course', 'badge-quiz-master', 'badge-perfect-score'].includes(badge.id);
                  const progressPct = getBadgeProgressPercent(badge);
                  const remainingLabel = getBadgeRemainingText(badge);

                  let rarityColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                  if (badge.rarity === 'Legendary') {
                    rarityColor = 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
                  } else if (badge.rarity === 'Epic') {
                    rarityColor = 'bg-purple-100/80 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800';
                  } else if (badge.rarity === 'Rare') {
                    rarityColor = 'bg-blue-100/80 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-300 border-blue-200 dark:border-blue-800';
                  }

                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadgeForModal(badge)}
                      className={`p-4 rounded-2xl border transition-all text-left relative flex flex-col justify-between cursor-pointer hover:shadow-md group ${
                        badge.unlocked
                          ? isSpecialMilestone
                            ? 'bg-gradient-to-br from-white via-amber-50/20 to-blue-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-850 border-amber-200/90 dark:border-amber-800/60 ring-1 ring-amber-400/20 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#0B4F9C]'
                          : isSpecialMilestone
                          ? 'bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-850 border-blue-200/90 dark:border-blue-800/70 ring-1 ring-[#0B4F9C]/15 shadow-xs hover:border-[#0B4F9C]'
                          : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Card Top: Icon & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-100 dark:border-slate-700 inline-block group-hover:scale-105 transition-transform">
                              {badge.icon}
                            </span>
                            {badge.rarity && (
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${rarityColor}`}>
                                {badge.rarity}
                              </span>
                            )}
                          </div>

                          {badge.unlocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Unlocked</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B4F9C] dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/60 px-2 py-0.5 rounded-full shrink-0">
                              <Lock className="w-3 h-3" />
                              <span>{progressPct}% Ready</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors">
                            {badge.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>

                        {/* Criteria Preview */}
                        {badge.criteria && (
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Criteria: </span>
                            {badge.criteria}
                          </div>
                        )}

                        {/* Visual Progress Bar for EVERY Unlockable Badge */}
                        {badge.progressTarget !== undefined && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                              <span className={badge.unlocked ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-300'}>
                                {badge.unlocked ? 'Milestone Achieved' : remainingLabel}
                              </span>
                              <span className="tabular-nums font-extrabold text-slate-800 dark:text-slate-200">
                                {badge.progressCurrent ?? 0} / {badge.progressTarget} {badge.progressUnit || ''} ({progressPct}%)
                              </span>
                            </div>
                            <div
                              role="progressbar"
                              aria-valuenow={progressPct}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${badge.name} completion progress`}
                              className="w-full bg-slate-200/90 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden"
                            >
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  badge.unlocked
                                    ? 'bg-gradient-to-r from-emerald-500 to-[#72B01D]'
                                    : progressPct >= 75
                                    ? 'bg-gradient-to-r from-[#0B4F9C] via-blue-500 to-[#72B01D]'
                                    : 'bg-gradient-to-r from-[#0B4F9C] to-blue-500'
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: XP & Date/Progress */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          +{badge.xpReward} XP
                        </span>
                        <span className="text-slate-400 font-medium">
                          {badge.unlocked
                            ? badge.unlockedAt || 'Unlocked'
                            : `${progressPct}% Complete`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & COURSES */}
        {/* ========================================================================= */}
        {activeDashboardTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Primary Continue Learning Banner */}
            {primaryCourseItem && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    {primaryCourseItem.completedModules >= primaryCourseItem.totalModules ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
                        <Award className="w-3.5 h-3.5 text-[#72B01D]" />
                        <span>100% Curriculum Completed · Accredited Certificate Ready</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                        Resume Primary Learning Focus
                      </span>
                    )}
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {primaryCourseItem.course.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {primaryCourseItem.completedModules >= primaryCourseItem.totalModules
                        ? 'Congratulations! You have satisfied all coursework and examination requirements for this masterclass.'
                        : `Current: ${primaryCourseItem.currentModuleTitle} · Next: ${primaryCourseItem.nextLessonTitle}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Primary Course Certificate PDF Download Button if 100% completed */}
                    {primaryCourseItem.completedModules >= primaryCourseItem.totalModules && (
                      <button
                        type="button"
                        onClick={() => handleDownloadCourseCertificate(primaryCourseItem.course)}
                        disabled={downloadingCertId === primaryCourseItem.course.id}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2 active:scale-98"
                        title="Download official accredited certificate as vector PDF"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-200" />
                        <span>
                          {downloadingCertId === primaryCourseItem.course.id
                            ? 'Generating PDF...'
                            : 'Download Certificate (PDF)'}
                        </span>
                      </button>
                    )}

                    {primaryCourseItem.completedModules >= primaryCourseItem.totalModules && (
                      <button
                        type="button"
                        onClick={() => handleOpenCertificatePreview(primaryCourseItem.course)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Preview certificate details"
                      >
                        <Award className="w-4 h-4 text-[#72B01D]" />
                        <span>Preview Certificate</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleOfflineCourse(primaryCourseItem.course)}
                      disabled={downloadingCourseId === primaryCourseItem.course.id}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCourseSavedOffline(primaryCourseItem.course.id)
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#0B4F9C]'
                      }`}
                      title="Save course modules to local storage & service worker cache for offline study"
                    >
                      <Download className={`w-4 h-4 ${isCourseSavedOffline(primaryCourseItem.course.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#0B4F9C] dark:text-blue-400'}`} />
                      <span>
                        {downloadingCourseId === primaryCourseItem.course.id
                          ? 'Downloading...'
                          : isCourseSavedOffline(primaryCourseItem.course.id)
                          ? 'Offline Ready'
                          : 'Save for Offline'}
                      </span>
                    </button>

                    <button
                      onClick={onOpenSandbox}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Layers className="w-4 h-4 text-[#72B01D]" />
                      <span>Open Software Sandbox</span>
                    </button>

                    <button
                      onClick={() => onContinueCourse(primaryCourseItem.course)}
                      className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#073B75] text-white font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4 text-[#72B01D]" />
                      <span>{primaryCourseItem.completedModules >= primaryCourseItem.totalModules ? 'Review Course' : 'Resume Course'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Achievements & Milestone Highlights */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Trophy className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Recent Milestone Achievements
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Earned {unlockedCount} of {totalBadgesCount} software operational mastery badges (+{earnedXpFromBadges.toLocaleString()} XP)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('badges')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B4F9C] dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View All Achievements ({unlockedCount})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Showcase badges grid (Unlocked & Closest Unlockable Milestones) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {studentBadges
                  .slice(0, 4)
                  .map((badge) => {
                    const pct = getBadgeProgressPercent(badge);
                    return (
                      <div
                        key={badge.id}
                        onClick={() => setSelectedBadgeForModal(badge)}
                        className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all cursor-pointer flex flex-col justify-between gap-2.5 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl shadow-2xs border border-slate-200/60 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                            {badge.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400">
                              {badge.name}
                            </h4>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                              +{badge.xpReward} XP · {badge.unlocked ? (badge.unlockedAt || 'Unlocked') : `${pct}% ready`}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            <span>{badge.unlocked ? 'Completed' : getBadgeRemainingText(badge)}</span>
                            <span className="tabular-nums font-bold text-slate-700 dark:text-slate-300">
                              {badge.progressCurrent ?? 0}/{badge.progressTarget} {badge.progressUnit || ''}
                            </span>
                          </div>
                          <div
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden"
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                badge.unlocked
                                  ? 'bg-gradient-to-r from-emerald-500 to-[#72B01D]'
                                  : 'bg-gradient-to-r from-[#0B4F9C] to-[#72B01D]'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Enrolled Courses Grid with Tiered Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Enrolled Masterclasses ({enrolledCourses.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Complete all modules to unlock your official CPD accredited PDF certificate
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((item) => {
                  const isCompleted = item.completedModules >= item.totalModules;
                  const courseProgressPercent = Math.min(100, Math.round((item.completedModules / item.totalModules) * 100));
                  const courseRating = courseRatings[item.course.id]?.averageRating ?? item.course.rating;
                  const userRating = courseRatings[item.course.id]?.userRating;
                  const isSavedForOffline = isCourseSavedOffline(item.course.id);
                  const isItemDownloading = downloadingCourseId === item.course.id;
                  const isItemDownloadingCert = downloadingCertId === item.course.id;

                  return (
                    <div
                      key={item.course.id}
                      className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                        isCompleted
                          ? 'border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {item.course.category}
                          </span>
                          <div className="flex items-center gap-2">
                            {isSavedForOffline && (
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <HardDriveDownload className="w-3 h-3 text-emerald-600" />
                                <span>Offline</span>
                              </span>
                            )}
                            {isCompleted ? (
                              <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                <Award className="w-3 h-3 text-[#72B01D]" />
                                <span>100% Completed</span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-[#72B01D]">
                                {courseProgressPercent}% Complete
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                          {item.course.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.currentModuleTitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-1 mt-3">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCompleted ? 'bg-gradient-to-r from-emerald-500 to-[#72B01D]' : 'bg-[#72B01D]'
                              }`}
                              style={{ width: `${courseProgressPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                            {isCompleted ? (
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#72B01D]" />
                                <span>All {item.totalModules} modules mastered · Distinction Grade</span>
                              </span>
                            ) : (
                              <span>{item.completedModules} of {item.totalModules} modules</span>
                            )}
                            <span>Last active: {item.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      {/* Course Card Action Footer */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                        <StarRatingWidget
                          rating={courseRating}
                          userRating={userRating}
                          onRate={(stars) => onRateCourse && onRateCourse(item.course.id, stars)}
                          compactInteractive={true}
                          size="xs"
                        />

                        {isCompleted ? (
                          /* 100% Completed Course Actions: Prominent PDF Download Button */
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <button
                              type="button"
                              onClick={() => handleDownloadCourseCertificate(item.course)}
                              disabled={isItemDownloadingCert}
                              className="px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 active:scale-98"
                              title="Download official accredited certificate as vector PDF"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-200" />
                              <span>{isItemDownloadingCert ? 'Generating...' : 'Download Certificate (PDF)'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenCertificatePreview(item.course)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              title="Preview certificate details and print"
                            >
                              <Award className="w-3.5 h-3.5 text-[#72B01D]" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => onContinueCourse(item.course)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-[#0B4F9C] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              title="Review course syllabus and lessons"
                            >
                              <PlayCircle className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                              <span>Review</span>
                            </button>
                          </div>
                        ) : (
                          /* In-Progress Course Actions */
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <button
                              type="button"
                              onClick={() => handleToggleOfflineCourse(item.course)}
                              disabled={isItemDownloading}
                              className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                                isSavedForOffline
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#0B4F9C]'
                              }`}
                              title={isSavedForOffline ? 'Saved for offline study (Click to delete cache)' : 'Download course modules for offline study'}
                            >
                              <Download className={`w-3 h-3 ${isSavedForOffline ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
                              <span className="hidden sm:inline">
                                {isItemDownloading
                                  ? 'Saving...'
                                  : isSavedForOffline
                                  ? 'Offline'
                                  : 'Save'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAdvanceModule(item.course.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="Advance module completion (Click to test reaching 100%!)"
                            >
                              <Plus className="w-3 h-3 text-[#72B01D]" />
                              <span>+Module</span>
                            </button>

                            <button
                              onClick={() => onContinueCourse(item.course)}
                              className="px-3.5 py-1 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                            >
                              <PlayCircle className="w-3.5 h-3.5 text-[#84CC16]" />
                              <span>Resume</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* EARNED ACCREDITED CERTIFICATES SPOTLIGHT */}
            {/* ========================================================================= */}
            {earnedCertificates.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-blue-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 p-6 sm:p-7 rounded-3xl border-2 border-emerald-300 dark:border-emerald-800 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        <Award className="w-4 h-4 text-[#72B01D]" />
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Earned Accredited Certificates &amp; Diplomas
                      </h3>
                      <span className="text-xs font-black bg-[#72B01D] text-slate-950 px-2.5 py-0.5 rounded-full">
                        {earnedCertificates.length} {earnedCertificates.length === 1 ? 'Credential' : 'Credentials'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Official verified qualifications for courses where you have completed 100% of modules. Download as vector PDF for employers and CPD accreditation records.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveDashboardTab('certificates')}
                    className="text-xs font-bold text-[#0B4F9C] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>View All Credentials</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {earnedCertificates.map((cert) => {
                    const matchedCourse = COURSES.find((c) => c.title.toLowerCase() === cert.courseTitle.toLowerCase()) || COURSES[0];
                    const isGenerating = downloadingCertId === matchedCourse.id;

                    return (
                      <div
                        key={cert.certificateId}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                                {cert.certificateId}
                              </span>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                                {cert.courseTitle}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {cert.credentialType} · Issued {cert.issueDate}
                              </p>
                            </div>
                            <span className="text-xs font-black text-[#72B01D] bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0">
                              {cert.scorePercentage}% Score
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1">
                            {cert.skillsValidated.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Blockchain Verified</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadCourseCertificate(matchedCourse)}
                              disabled={isGenerating}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
                              title="Download certificate as PDF"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-200" />
                              <span>{isGenerating ? 'Generating...' : 'Download (PDF)'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPreviewCertModal(cert)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                              title="Preview certificate details"
                            >
                              <Award className="w-3.5 h-3.5 text-[#72B01D]" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommended for you Section */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#72B01D] border border-emerald-200 dark:border-emerald-800">
                      <Sparkles className="w-4 h-4 text-[#72B01D]" />
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Recommended for You
                    </h3>
                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-blue-300 px-2 py-0.5 rounded-full">
                      AI Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Suggested based on your active tracks in <strong className="text-slate-800 dark:text-slate-200">Accounting</strong> and <strong className="text-slate-800 dark:text-slate-200">POS Cashier Operations</strong>.
                  </p>
                </div>

                <button
                  onClick={onExploreMore}
                  className="text-xs font-bold text-[#0B4F9C] dark:text-blue-400 hover:underline self-start sm:self-auto cursor-pointer flex items-center gap-1"
                >
                  <span>Explore Course Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommendedCourses.map(({ course, reason }) => (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden text-left group"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block line-clamp-1">
                          {reason}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h4>
                        <div className="text-[11px] text-slate-400">
                          {course.durationHours} hrs · {course.modulesCount} modules
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => onSelectCourse ? onSelectCourse(course) : onContinueCourse(course)}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#0B4F9C] hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        Inspect Course Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACCREDITED CERTIFICATES HUB */}
        {/* ========================================================================= */}
        {activeDashboardTab === 'certificates' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header overview banner */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <Award className="w-5 h-5 text-[#72B01D]" />
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Accredited Qualifications &amp; PDF Certificates
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                    Every course where you complete 100% of modules unlocks an accredited, tamper-evident certificate. Download official vector PDF credentials, print physical certificates, or verify them in the Pan-African registry.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center min-w-24">
                    <div className="text-xl font-black text-[#0B4F9C] dark:text-blue-400">
                      {earnedCertificates.length}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      Certificates
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center min-w-24">
                    <div className="text-xl font-black text-[#72B01D]">
                      {earnedCertificates.length * 15}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      CPD Hours
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center min-w-24 col-span-2 sm:col-span-1">
                    <div className="text-xl font-black text-amber-500">
                      98%
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      Avg Distinction
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Earned Certificates */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Earned Credentials ({earnedCertificates.length})</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  Ready for instant PDF download
                </span>
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {earnedCertificates.map((cert) => {
                  const matchedCourse = COURSES.find((c) => c.title.toLowerCase() === cert.courseTitle.toLowerCase()) || COURSES[0];
                  const isDownloading = downloadingCertId === matchedCourse.id;

                  return (
                    <div
                      key={cert.certificateId}
                      className="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6 relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 px-2.5 py-0.5 rounded-md">
                                {cert.certificateId}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>100% Course Completed</span>
                              </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                              {cert.courseTitle}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Recipient: <strong className="text-slate-700 dark:text-slate-300">{cert.studentName}</strong> · Lead Instructor: {cert.instructorName}
                            </p>
                          </div>

                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B4F9C] to-blue-700 text-white flex items-center justify-center font-black shadow-md shrink-0">
                            <Award className="w-6 h-6 text-[#72B01D]" />
                          </div>
                        </div>

                        {/* Badges / Competencies validated */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              Accredited Examination Score:
                            </span>
                            <span className="font-extrabold text-[#72B01D]">
                              {cert.scorePercentage}% (Honors Distinction)
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              Issue Date:
                            </span>
                            <span className="font-medium text-slate-500 dark:text-slate-400">
                              {cert.issueDate}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5">
                            {cert.skillsValidated.map((skill) => (
                              <span
                                key={skill}
                                className="text-[10px] bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Certificate Actions Toolbar */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleCopyCertId(cert.certificateId)}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                          title="Copy certificate verification ID"
                        >
                          {copiedCertId === cert.certificateId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied ID</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Direct PDF Download Button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadCourseCertificate(matchedCourse)}
                            disabled={isDownloading}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
                            title="Download standard-compliant vector PDF certificate"
                          >
                            <FileCheck className="w-4 h-4 text-emerald-200" />
                            <span>{isDownloading ? 'Generating PDF...' : 'Download Certificate (PDF)'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewCertModal(cert)}
                            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                            title="Preview certificate layout"
                          >
                            <Award className="w-4 h-4 text-[#72B01D]" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onViewCertificate(cert.certificateId)}
                            className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-300 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer flex items-center gap-1.5 border border-blue-200 dark:border-blue-900"
                            title="Open verification page in public registry"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Registry</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-Progress Courses & Certificate Requirements */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Unlock Additional Certificates</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  (Courses in progress)
                </span>
              </h4>

              <div className="space-y-3">
                {enrolledCourses.filter((e) => e.completedModules < e.totalModules).map((item) => {
                  const percent = Math.round((item.completedModules / item.totalModules) * 100);
                  const remaining = item.totalModules - item.completedModules;

                  return (
                    <div
                      key={item.course.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.course.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.completedModules} of {item.totalModules} modules completed ({remaining} more {remaining === 1 ? 'module' : 'modules'} to unlock certificate)
                        </p>
                        <div className="w-48 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-[#72B01D] h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAdvanceModule(item.course.id)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#72B01D] transition-colors cursor-pointer flex items-center gap-1.5"
                          title="Advance module completion (Click to test advancing to 100%!)"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#72B01D]" />
                          <span>+Module ({item.completedModules + 1}/{item.totalModules})</span>
                        </button>

                        <button
                          onClick={() => onContinueCourse(item.course)}
                          className="px-4 py-1.5 rounded-xl bg-[#0B4F9C] hover:bg-[#073B75] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-[#84CC16]" />
                          <span>Resume</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: OFFICIAL TAX INVOICES & PAYMENT RECEIPTS */}
        {/* ========================================================================= */}
        {activeDashboardTab === 'invoices' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Banner */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Statutory Pan-African SaaS Tax Invoices</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Payment History &amp; Official VAT Invoices
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Every enrollment and subscription is issued with an authentic tax invoice itemizing statutory 7.5% exclusive VAT, applicable promo discounts, and verified gateway transaction references.
                </p>
              </div>

              {onOpenCart && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="px-4 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Make New Payment / Cart</span>
                </button>
              )}
            </div>

            {/* Financial Overview Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Invoices</span>
                <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                  {customerInvoices.length}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% Verified &amp; Paid</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">7.5% Exclusive VAT Paid</span>
                <p className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums font-mono">
                  {formatCurrency(customerInvoices.reduce((acc, i) => acc + i.vatAmountNgn, 0), currentCurrency)}
                </p>
                <span className="text-[10px] text-slate-500">Statutory Tax Base</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Promo Savings</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
                  {formatCurrency(customerInvoices.reduce((acc, i) => acc + i.discountAmountNgn, 0), currentCurrency)}
                </p>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Scholarship &amp; Grants</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Net Invested</span>
                <p className="text-xl font-black text-[#0B4F9C] dark:text-blue-400 tabular-nums font-mono">
                  {formatCurrency(customerInvoices.reduce((acc, i) => acc + i.totalAmountNgn, 0), currentCurrency)}
                </p>
                <span className="text-[10px] text-slate-500">Accredited Career ROI</span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
                Issued Customer Invoices &amp; Receipts ({customerInvoices.length})
              </h4>

              {customerInvoices.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No invoices issued yet</p>
                  <p className="text-xs text-slate-500">When you enroll in courses or subscriptions, official receipts with 7.5% exclusive VAT will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                            {inv.invoiceNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                            {inv.status}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {inv.date} at {inv.time}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-300">
                            {inv.paymentGatewayName}
                          </span>
                        </div>

                        {/* Customer & TIN meta */}
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 flex-wrap">
                          <span>Billed to: <strong>{inv.customer.fullName}</strong></span>
                          {inv.customer.companyName && <span>· <em>{inv.customer.companyName}</em></span>}
                          {inv.customer.tin && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              (TIN: {inv.customer.tin})
                            </span>
                          )}
                        </div>

                        {/* Items list */}
                        <div className="space-y-1 pt-1">
                          {inv.items.map((it, idx) => (
                            <div key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#72B01D]" />
                              <span className="font-semibold">{it.title}</span>
                              <span className="text-[10px] text-slate-400">({it.type})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial summary & Action buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="text-left sm:text-right space-y-0.5">
                          <div className="text-xs text-slate-500 space-x-1">
                            <span>Subtotal: {formatCurrency(inv.subtotalNgn, currentCurrency)}</span>
                            {inv.discountAmountNgn > 0 && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                (-{formatCurrency(inv.discountAmountNgn, currentCurrency)} saved)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                            VAT (7.5% Exclusive): +{formatCurrency(inv.vatAmountNgn, currentCurrency)}
                          </div>
                          <div className="text-base font-black text-slate-900 dark:text-white font-mono tabular-nums">
                            Total: {formatCurrency(inv.totalAmountNgn, currentCurrency)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceForModal(inv)}
                            className="px-3.5 py-2 bg-[#0B4F9C] hover:bg-[#073B75] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#72B01D]" />
                            <span>View Tax Receipt</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* CERTIFICATE PREVIEW MODAL */}
        {/* ========================================================================= */}
        {previewCertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    <Award className="w-5 h-5 text-[#72B01D]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Official Accredited Certificate
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ID: {previewCertModal.certificateId} · Issued to {previewCertModal.studentName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewCertModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Certificate Viewport */}
              <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                <div className="bg-[#fdfbf7] text-slate-900 rounded-2xl border-4 border-[#0B4F9C] p-6 sm:p-10 text-center shadow-lg relative outline-2 outline-[#D4AF37] outline-offset-[-8px]">
                  
                  {/* Decorative background logo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4">
                    <Award className="w-80 h-80 text-[#0B4F9C]" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                      <div className="text-left flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-[#0B4F9C] text-white flex items-center justify-center font-black text-base">
                          M<span className="w-1 h-3 bg-[#72B01D] rounded-full ml-0.5" />
                        </div>
                        <div>
                          <div className="font-black text-[#0B4F9C] text-sm tracking-tight uppercase">
                            MsmeBooks Academy
                          </div>
                          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">
                            Accreditation &amp; SaaS Certification Council
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="w-10 h-10 bg-white border border-slate-300 rounded flex items-center justify-center mx-auto text-slate-700">
                          <QrCode className="w-7 h-7" />
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 mt-0.5 block">Scan to Verify</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                        This is proudly certified and presented to
                      </p>
                      
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0B4F9C] tracking-tight border-b-2 border-[#0B4F9C] inline-block px-6 pb-1">
                        {previewCertModal.studentName}
                      </h2>

                      <p className="text-xs text-slate-600 max-w-lg mx-auto pt-1">
                        for successfully completing all practical curriculum modules, live multi-branch ERP sandbox reconciliation drills, and passing the comprehensive accreditation exam in:
                      </p>

                      <div className="py-2">
                        <span className="text-base sm:text-lg font-extrabold text-[#0B4F9C] bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 inline-block shadow-2xs">
                          {previewCertModal.courseTitle}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-emerald-700">
                        Credential Type: {previewCertModal.credentialType} · Score: {previewCertModal.scorePercentage}% (Honors Distinction)
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-300 grid grid-cols-3 items-end text-xs">
                      <div className="text-left space-y-1">
                        <div className="font-serif italic text-sm text-slate-800 border-b border-slate-300 pb-1">
                          {previewCertModal.instructorName}
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold">Lead Enterprise Instructor, FCA</p>
                        <p className="text-[9px] text-slate-400">MsmeBooks Academy</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#0B4F9C] bg-blue-50 flex items-center justify-center p-1.5 shadow-xs">
                          <Award className="w-7 h-7 text-[#0B4F9C]" />
                        </div>
                        <span className="text-[8px] font-black text-[#0B4F9C] uppercase tracking-wider mt-1">
                          Official Seal
                        </span>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-slate-800 border-b border-slate-300 pb-1 font-mono text-xs">
                          {previewCertModal.issueDate}
                        </p>
                        <p className="text-[9px] text-slate-500 font-bold">Issue Date</p>
                        <p className="text-[9px] font-mono text-slate-400">{previewCertModal.certificateId}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Accredited ID: <strong>{previewCertModal.certificateId}</strong></span>
                      <span>Verified: msmebooks.org/academy/verify</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Modal Action Footer */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onViewCertificate(previewCertModal.certificateId)}
                  className="px-3.5 py-2 text-xs font-bold text-[#0B4F9C] dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Public Verification Page</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printCertificate(previewCertModal)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      downloadCertificatePdf(previewCertModal);
                      setCertificateSuccessToast({
                        courseTitle: previewCertModal.courseTitle,
                        certId: previewCertModal.certificateId
                      });
                      setTimeout(() => setCertificateSuccessToast(null), 5000);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-98"
                  >
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>Download Vector PDF</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INVOICE & TAX RECEIPT MODAL */}
        {/* ========================================================================= */}
        {selectedInvoiceForModal && (
          <InvoiceReceiptModal
            invoice={selectedInvoiceForModal}
            onClose={() => setSelectedInvoiceForModal(null)}
            currentCurrency={currentCurrency}
          />
        )}

        {/* ========================================================================= */}
        {/* ACHIEVEMENTS & BADGE DETAIL MODAL */}
        {/* ========================================================================= */}
        {selectedBadgeForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    MsmeBooks Milestone Accreditation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBadgeForModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-7 text-center space-y-5">
                {/* Large Glowing Icon Box */}
                <div className="relative inline-block mx-auto">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-blue-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-750 flex items-center justify-center text-5xl shadow-md border-2 border-amber-300 dark:border-slate-700">
                    {selectedBadgeForModal.icon}
                  </div>
                  {selectedBadgeForModal.unlocked && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-slate-900">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    {selectedBadgeForModal.rarity && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        {selectedBadgeForModal.rarity} Milestone
                      </span>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0B4F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 capitalize">
                      {selectedBadgeForModal.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {selectedBadgeForModal.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    {selectedBadgeForModal.description}
                  </p>
                </div>

                {/* Criteria Detail Box */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                      Accreditation Requirement
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      +{selectedBadgeForModal.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedBadgeForModal.criteria || 'Complete designated syllabus milestones and practical ledger exercises.'}
                  </p>

                  {/* Progress Bar & Unlock Stamp */}
                  {selectedBadgeForModal.progressTarget !== undefined && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {selectedBadgeForModal.unlocked
                            ? 'Completed (100%)'
                            : `Progress: ${getBadgeProgressPercent(selectedBadgeForModal)}% (${getBadgeRemainingText(selectedBadgeForModal)})`}
                        </span>
                        <span className="font-extrabold tabular-nums text-slate-800 dark:text-slate-200">
                          {selectedBadgeForModal.progressCurrent ?? 0} / {selectedBadgeForModal.progressTarget} {selectedBadgeForModal.progressUnit || ''}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-valuenow={getBadgeProgressPercent(selectedBadgeForModal)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden"
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            selectedBadgeForModal.unlocked
                              ? 'bg-gradient-to-r from-emerald-500 to-[#72B01D]'
                              : 'bg-gradient-to-r from-[#0B4F9C] via-blue-500 to-[#72B01D]'
                          }`}
                          style={{ width: `${getBadgeProgressPercent(selectedBadgeForModal)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                    {selectedBadgeForModal.unlocked ? (
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {selectedBadgeForModal.unlockedAt || 'Accreditation Completed'}
                      </span>
                    ) : (
                      <div className="text-right">
                        <span className="font-bold text-[#0B4F9C] dark:text-blue-400">
                          {getBadgeProgressPercent(selectedBadgeForModal)}% Complete · {getBadgeRemainingText(selectedBadgeForModal)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleShareBadge(selectedBadgeForModal)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#0B4F9C] hover:bg-[#073B75] text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Milestone Achievement</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBadgeForModal(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

