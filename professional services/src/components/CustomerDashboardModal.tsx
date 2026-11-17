import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Trash2, 
  Share2, 
  Bell, 
  BellRing, 
  Copy, 
  Check, 
  Award, 
  Gift, 
  Coins, 
  Sparkles, 
  Zap, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  SlidersHorizontal, 
  TrendingUp, 
  AlertTriangle, 
  Printer,
  BarChart2,
  Trophy,
  Percent,
  ArrowUpRight,
  Ticket,
  Undo2,
  AlarmClock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  Legend,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { BookingRecord, DeliverableTask, LoyaltyVoucher, MsmePointsState, AppliedBookingDiscount } from '../types/booking';
import { SERVICES_CATALOGUE } from '../data/servicesData';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  triggerTestReminderNotification,
  triggerBookingAcceptedNotification,
  triggerBookingStatusUpdatedNotification,
  isBookingAlertsEnabled,
  setBookingAlertsEnabled,
  trigger24HourReminderNotification,
  check24HourBookingReminders
} from '../utils/reminderService';
import { RescheduleModal } from './RescheduleModal';
import { BookingInvoiceModal } from './BookingInvoiceModal';
import { addAppNotification } from '../utils/notificationService';
import { ComplianceCalendarSection } from './ComplianceCalendarSection';
import { BookingReviewModal } from './BookingReviewModal';
import { MilestoneProgressBar } from './MilestoneProgressBar';
import { CalendarSyncButton } from './CalendarSyncButton';
import { addFirmReview } from '../utils/reviewStorage';
import { ShieldAlert, Star, MessageSquare, Edit3, Wallet, FolderOpen, QrCode, GitCommitVertical } from 'lucide-react';
import { WalletSection } from './WalletSection';
import { DocumentsSection } from './DocumentsSection';
import { SpendingInsightsSection } from './SpendingInsightsSection';
import { BookingTaskChecklist } from './BookingTaskChecklist';
import {
  ServiceProgressTimeline,
  ServiceProgressTimelineTab,
  isLongTermEngagement,
} from './ServiceProgressTimeline';
import {
  CheckInQrModal,
  CHECKIN_RECORDS_STORAGE_KEY,
  getStoredCheckInRecords,
} from './CheckInQrModal';
import {
  AutoInvoiceDocument,
  AUTO_INVOICES_CHANGED_EVENT,
  getAutoInvoices,
  syncAutoInvoicesForCompletedBookings,
} from '../utils/autoInvoiceService';
import { getWalletState, payWithWallet } from '../utils/walletStorage';
import { BookingStatusBadges, getPrimaryStatusColorBorder } from './BookingStatusBadges';

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onCancelBooking: (bookingId: string) => void;
  onNewBookingClick: () => void;
  onRescheduleBooking?: (bookingId: string, newDate: string, newTimeSlot?: string) => void;
  userCountry?: string;
}

const REDEEMABLE_VOUCHERS_CATALOGUE = [
  {
    title: '₦5,000 / $5 Off Any Service',
    pointsCost: 250,
    discountNGN: 5000,
    discountDisplay: '₦5,000 / $5',
    minSpendNGN: 30000,
    codePrefix: 'MSME5K',
  },
  {
    title: '₦12,000 / $10 Off Package Booking',
    pointsCost: 500,
    discountNGN: 12000,
    discountDisplay: '₦12,000 / $10',
    minSpendNGN: 60000,
    codePrefix: 'MSME12K',
  },
  {
    title: '₦30,000 / $25 Off Business Growth & Enterprise',
    pointsCost: 1000,
    discountNGN: 30000,
    discountDisplay: '₦30,000 / $25',
    minSpendNGN: 120000,
    codePrefix: 'MSME30K',
  },
];

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onNewBookingClick,
  onRescheduleBooking,
  userCountry,
}) => {
  const { formatPriceString, formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'calendar' | 'rewards' | 'spending' | 'compliance' | 'wallet' | 'documents' | 'timeline'>('upcoming');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'upcoming' | 'in-progress' | 'pending' | 'completed'>('all');
  const [reviewModalBooking, setReviewModalBooking] = useState<BookingRecord | null>(null);
  const [localBookings, setLocalBookings] = useState<BookingRecord[]>(bookings);
  const [walletBalanceState, setWalletBalanceState] = useState<number>(() => getWalletState().balanceNGN);
  const [autoInvoices, setAutoInvoices] = useState<AutoInvoiceDocument[]>(() => getAutoInvoices());
  const [autoInvoiceToast, setAutoInvoiceToast] = useState<{
    invoiceNumber: string;
    fileName: string;
    serviceTitle: string;
  } | null>(null);
  const [checkInQrBooking, setCheckInQrBooking] = useState<BookingRecord | null>(null);
  const [checkedInRecords, setCheckedInRecords] = useState<Record<string, string>>(() =>
    getStoredCheckInRecords()
  );
  const hasSyncedAutoInvoicesRef = useRef(false);

  const handleMarkBookingCheckedIn = (booking: BookingRecord, timestamp: string) => {
    const next = { ...checkedInRecords, [booking.id]: timestamp };
    setCheckedInRecords(next);
    try {
      localStorage.setItem(CHECKIN_RECORDS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save check-in record:', e);
    }
    addAppNotification({
      type: 'booking',
      title: 'Attendance Check-In Verified',
      message: `${booking.providerName} verified attendance upon arrival for ${booking.serviceTitle} (${booking.reference}).`,
      bookingRef: booking.reference,
      actionLabel: 'View Booking',
    });
    setReminderToast(`Attendance verified for ${booking.serviceTitle} (${booking.reference}).`);
    setTimeout(() => setReminderToast(null), 4500);
  };

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    const handleAutoInvoicesChanged = () => {
      setAutoInvoices(getAutoInvoices());
    };
    window.addEventListener(AUTO_INVOICES_CHANGED_EVENT, handleAutoInvoicesChanged);
    return () => window.removeEventListener(AUTO_INVOICES_CHANGED_EVENT, handleAutoInvoicesChanged);
  }, []);

  useEffect(() => {
    const { allDocuments, newlyCreated } = syncAutoInvoicesForCompletedBookings(localBookings, {
      notify: hasSyncedAutoInvoicesRef.current,
    });
    setAutoInvoices(allDocuments);
    if (newlyCreated.length > 0 && hasSyncedAutoInvoicesRef.current) {
      const latest = newlyCreated[0];
      setAutoInvoiceToast({
        invoiceNumber: latest.invoiceNumber,
        fileName: latest.fileName,
        serviceTitle: latest.serviceTitle,
      });
      setTimeout(() => setAutoInvoiceToast(null), 7000);
    }
    hasSyncedAutoInvoicesRef.current = true;
  }, [localBookings]);

  useEffect(() => {
    const handleWalletChanged = () => {
      setWalletBalanceState(getWalletState().balanceNGN);
    };
    window.addEventListener('msmebooks_wallet_changed', handleWalletChanged);
    return () => window.removeEventListener('msmebooks_wallet_changed', handleWalletChanged);
  }, []);

  const handle1ClickWalletPay = (booking: BookingRecord) => {
    const parseAmount = (b: BookingRecord): number => {
      if (b.billingBreakdown?.totalNGN) return b.billingBreakdown.totalNGN;
      const match = b.packagePrice.match(/₦\s*([\d,]+)/);
      if (match) return parseInt(match[1].replace(/,/g, ''), 10);
      return 75000;
    };

    const amount = parseAmount(booking);
    const wallet = getWalletState();

    if (wallet.balanceNGN < amount) {
      setActiveTab('wallet');
      setReminderToast(`Insufficient wallet credits (${formatAmount(wallet.balanceNGN)}). Please pre-load at least ${formatAmount(amount - wallet.balanceNGN)} to complete 1-click payment.`);
      setTimeout(() => setReminderToast(null), 5000);
      return;
    }

    const res = payWithWallet(booking.id, amount, booking.serviceTitle, booking.reference);
    if (res.success && res.state) {
      const updated = localBookings.map(b => {
        if (b.id === booking.id) {
          return {
            ...b,
            paymentStatus: 'Paid' as const,
            status: 'Confirmed' as const,
            paymentGateway: 'MsmeBooks Wallet (1-Click Instant Payment)',
            paymentTransactionRef: res.transaction?.reference,
          };
        }
        return b;
      });
      setLocalBookings(updated);
      try {
        localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
      } catch (e) {
        console.error(e);
      }
      setReminderToast(`⚡ 1-Click Payment Complete: ${formatAmount(amount)} paid from your MsmeBooks Wallet for "${booking.serviceTitle}" (${booking.reference})!`);
      setTimeout(() => setReminderToast(null), 5000);
    } else {
      setReminderToast(res.error || 'Payment failed.');
      setTimeout(() => setReminderToast(null), 5000);
    }
  };

  const handleUpdateBookingMilestones = (
    bookingId: string,
    updatedMilestones: { id: string; name: string; completed: boolean; targetDate?: string }[],
    newPercent: number
  ) => {
    const updated = localBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          milestones: updatedMilestones,
          milestoneProgressPercent: newPercent,
          status: newPercent === 100 ? ('Completed' as const) : b.status,
        };
      }
      return b;
    });
    setLocalBookings(updated);
    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
    } catch (e) {
      console.error(e);
    }
    if (newPercent === 100) {
      const target = localBookings.find(b => b.id === bookingId);
      if (target) {
        awardPointsForBooking({ ...target, status: 'Completed' }, 200);
      }
    }
  };

  const handleUpdateDeliverableChecklist = (
    bookingId: string,
    updatedTasks: DeliverableTask[]
  ) => {
    const updated = localBookings.map((b) =>
      b.id === bookingId ? { ...b, deliverableChecklist: updatedTasks } : b
    );
    setLocalBookings(updated);
    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewSubmitted = (
    bookingId: string,
    rating: number,
    comment: string,
    tags: string[]
  ) => {
    const updated = localBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          userRating: rating,
          userReviewText: comment,
          feedback: comment,
          userReviewTags: tags,
          reviewedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    setLocalBookings(updated);
    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
    } catch (e) {
      console.error(e);
    }
    setReviewModalBooking(null);
    setReminderToast(`Review & feedback submitted successfully! Thank you for rating.`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  // Inline star-rating input and feedback tracking state
  const [editingFeedbackBookingId, setEditingFeedbackBookingId] = useState<string | null>(null);
  const [inlineFeedbackText, setInlineFeedbackText] = useState<{ [bookingId: string]: string }>({});
  const [hoveredStar, setHoveredStar] = useState<{ [bookingId: string]: number }>({});

  const handleQuickStarRating = (booking: BookingRecord, rating: number) => {
    const existingFeedback = inlineFeedbackText[booking.id] ?? (booking.feedback || booking.userReviewText || '');
    const updated = localBookings.map(b => {
      if (b.id === booking.id) {
        return {
          ...b,
          userRating: rating,
          feedback: existingFeedback,
          userReviewText: existingFeedback,
          reviewedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    setLocalBookings(updated);
    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
    } catch (e) {
      console.error(e);
    }

    // Automatically sync to verified firm review directory
    try {
      addFirmReview({
        firmId: booking.providerId || 'firm-cedar',
        firmName: booking.providerName || 'Certified Partner Firm',
        authorName: booking.customerName || 'Verified Client',
        authorBusiness: booking.businessName || 'SME Business',
        authorCountry: booking.country || 'Nigeria',
        rating,
        serviceEngaged: booking.serviceTitle,
        title: `${rating}★ Client Experience - ${booking.packageName}`,
        comment: existingFeedback || `Client awarded a ${rating}-star rating for ${booking.serviceTitle} executed by ${booking.providerName}.`,
        verifiedClient: true,
      });
      window.dispatchEvent(new CustomEvent('msmebooks_reviews_changed'));
    } catch (err) {
      console.error(err);
    }

    setEditingFeedbackBookingId(booking.id);
    setReminderToast(`Rated ${rating}.0 ★ for ${booking.providerName}. You can add written feedback below.`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  const handleSaveInlineFeedback = (booking: BookingRecord, rating: number, feedbackComment: string) => {
    const effectiveRating = rating || booking.userRating || 5;
    const trimmed = feedbackComment.trim();
    const updated = localBookings.map(b => {
      if (b.id === booking.id) {
        return {
          ...b,
          userRating: effectiveRating,
          feedback: trimmed,
          userReviewText: trimmed,
          reviewedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    setLocalBookings(updated);
    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
    } catch (e) {
      console.error(e);
    }

    try {
      addFirmReview({
        firmId: booking.providerId || 'firm-cedar',
        firmName: booking.providerName || 'Certified Partner Firm',
        authorName: booking.customerName || 'Verified Client',
        authorBusiness: booking.businessName || 'SME Business',
        authorCountry: booking.country || 'Nigeria',
        rating: effectiveRating,
        serviceEngaged: booking.serviceTitle,
        title: `${effectiveRating}★ Client Review - ${booking.packageName}`,
        comment: trimmed || `Client rated their experience ${effectiveRating} out of 5 stars with ${booking.providerName}.`,
        verifiedClient: true,
      });
      window.dispatchEvent(new CustomEvent('msmebooks_reviews_changed'));
    } catch (e) {
      console.error(e);
    }

    setEditingFeedbackBookingId(null);
    setReminderToast(`Thank you! Your ${effectiveRating}★ review feedback for ${booking.providerName} has been saved.`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);
  const [copiedVoucherCode, setCopiedVoucherCode] = useState<string | null>(null);
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>(getNotificationPermission());
  const [bookingAlertsEnabled, setBookingAlertsEnabledState] = useState<boolean>(() => isBookingAlertsEnabled());
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [rewardToast, setRewardToast] = useState<string | null>(null);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState<BookingRecord | null>(null);
  const [rescheduleToast, setRescheduleToast] = useState<string | null>(null);
  const [calendarToast, setCalendarToast] = useState<string | null>(null);

  // View Mode: 'list' vs 'calendar' (Prompt #2)
  const [viewFormat, setViewFormat] = useState<'list' | 'calendar'>('list');
  const [calMonth, setCalMonth] = useState<Date>(() => new Date(2026, 9, 1)); // October 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Invoice Modal Target (Prompt #5)
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<BookingRecord | null>(null);

  // Budget Threshold feature (Prompt #9)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_monthly_budget');
      if (saved) return parseInt(saved, 10);
    } catch (e) {
      console.error(e);
    }
    return 350000; // Default: ₦350,000 monthly spend budget
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInputVal, setBudgetInputVal] = useState(String(monthlyBudgetLimit));
  const [budgetBreachAlertDismissed, setBudgetBreachAlertDismissed] = useState(false);

  // Lifecycle progress tracker override state (Prompt #7)
  const [bookingStages, setBookingStages] = useState<Record<string, 'Booked' | 'Consultation' | 'Work in Progress' | 'Completed'>>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_booking_stages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const getEffectiveStage = (booking: BookingRecord): 'Booked' | 'Consultation' | 'Work in Progress' | 'Completed' => {
    if (bookingStages[booking.id]) return bookingStages[booking.id];
    if (booking.lifecycleStage) return booking.lifecycleStage;
    if (booking.status === 'Completed') return 'Completed';
    if (booking.status === 'In Progress') return 'Work in Progress';
    return 'Booked';
  };

  const handleAdvanceStage = (bookingId: string) => {
    const b = bookings.find(x => x.id === bookingId);
    const current = bookingStages[bookingId] || b?.lifecycleStage || 'Booked';
    let next: 'Booked' | 'Consultation' | 'Work in Progress' | 'Completed' = 'Consultation';
    if (current === 'Booked') next = 'Consultation';
    else if (current === 'Consultation') next = 'Work in Progress';
    else if (current === 'Work in Progress') next = 'Completed';
    else return;

    const updated = { ...bookingStages, [bookingId]: next };
    setBookingStages(updated);
    try {
      localStorage.setItem('msmebooks_booking_stages', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    addAppNotification({
      type: 'booking',
      title: `Service Stage: ${next}`,
      message: `Your appointment for ${b?.serviceTitle || 'Professional Service'} has progressed to "${next}".`,
      bookingRef: b?.reference,
      actionLabel: 'View Status',
    });

    if (next === 'Completed') {
      const updatedBookings = localBookings.map(item => 
        item.id === bookingId ? { ...item, status: 'Completed' as const, milestoneProgressPercent: 100 } : item
      );
      setLocalBookings(updatedBookings);
      try {
        localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updatedBookings));
        window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
      } catch (e) {
        console.error(e);
      }
      if (b) {
        awardPointsForBooking({ ...b, status: 'Completed' }, 200);
      }
    }
  };

  const handleConfirmReschedule = (bookingId: string, newDate: string, newTimeSlot?: string) => {
    if (onRescheduleBooking) {
      onRescheduleBooking(bookingId, newDate, newTimeSlot);
    }
    const targetBooking = bookings.find(b => b.id === bookingId);
    setRescheduleToast(`Appointment for "${targetBooking?.serviceTitle || 'Booking'}" (Ref: ${targetBooking?.reference || bookingId}) successfully rescheduled to ${newDate}${newTimeSlot ? ` (${newTimeSlot})` : ''} without canceling the service request!`);
    setTimeout(() => {
      setRescheduleToast(null);
    }, 5000);
  };

  // MsmePoints State (stored persistently in localStorage)
  const [pointsData, setPointsData] = useState<MsmePointsState>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_msmepoints');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial bonus
    return {
      balance: 650,
      lifetimeEarned: 650,
      tier: 'Silver',
      history: [
        {
          id: 'pt-welcome',
          description: 'Welcome Bonus on Account Activation',
          points: 500,
          type: 'earned',
          date: '2026-10-15',
        },
        {
          id: 'pt-booking-1',
          description: 'Booking Completed: POS Hardware Setup (MSME-BK-9182)',
          points: 150,
          type: 'earned',
          date: '2026-10-18',
          reference: 'MSME-BK-9182',
        },
      ],
      activeVouchers: [],
    };
  });

  // Keep points synchronized in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('msmebooks_msmepoints', JSON.stringify(pointsData));
    } catch (e) {
      console.error(e);
    }
  }, [pointsData]);

  // Determine Tier and Tier Progress
  const currentTier = useMemo(() => {
    if (pointsData.lifetimeEarned >= 3000) return 'Platinum';
    if (pointsData.lifetimeEarned >= 1500) return 'Gold';
    if (pointsData.lifetimeEarned >= 500) return 'Silver';
    return 'Bronze';
  }, [pointsData.lifetimeEarned]);

  const nextTierInfo = useMemo(() => {
    if (currentTier === 'Bronze') return { next: 'Silver', pointsNeeded: 500 - pointsData.lifetimeEarned, max: 500 };
    if (currentTier === 'Silver') return { next: 'Gold', pointsNeeded: 1500 - pointsData.lifetimeEarned, max: 1500 };
    if (currentTier === 'Gold') return { next: 'Platinum', pointsNeeded: 3000 - pointsData.lifetimeEarned, max: 3000 };
    return { next: 'Maximum Tier', pointsNeeded: 0, max: 3000 };
  }, [currentTier, pointsData.lifetimeEarned]);

  // Active applied booking discount (persisted to localStorage)
  const [appliedBookingDiscount, setAppliedBookingDiscount] = useState<AppliedBookingDiscount | null>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_applied_service_discount');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Points Redemption Section Form State
  const [redemptionPointsPreset, setRedemptionPointsPreset] = useState<number>(500);
  const [customPointsInput, setCustomPointsInput] = useState<number>(500);
  const [isCustomPointsMode, setIsCustomPointsMode] = useState<boolean>(false);
  const [targetServiceId, setTargetServiceId] = useState<string>('all');

  // Compute active points to redeem
  const activePointsToRedeem = isCustomPointsMode ? customPointsInput : redemptionPointsPreset;

  // Compute discount in NGN based on points
  const computedDiscountNGN = useMemo(() => {
    if (activePointsToRedeem === 250) return 5000;
    if (activePointsToRedeem === 500) return 12000;
    if (activePointsToRedeem === 1000) return 30000;
    if (activePointsToRedeem === 2000) return 65000;
    // Dynamic formula: 1 pt = 24 NGN (accelerating discount)
    return Math.round(activePointsToRedeem * 24);
  }, [activePointsToRedeem]);

  // Synchronize applied booking discount across window tabs/events
  useEffect(() => {
    const handleSyncAppliedDiscount = () => {
      try {
        const saved = localStorage.getItem('msmebooks_applied_service_discount');
        if (saved) setAppliedBookingDiscount(JSON.parse(saved));
        else setAppliedBookingDiscount(null);
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('msmebooks_applied_discount_changed', handleSyncAppliedDiscount);
    return () => window.removeEventListener('msmebooks_applied_discount_changed', handleSyncAppliedDiscount);
  }, []);

  // Apply accumulated points directly to next service booking
  const handleApplyPointsToNextBooking = (pointsToSpend: number, serviceId = 'all', autoOpenBooking = false) => {
    if (pointsData.balance < pointsToSpend) {
      setRewardToast(`Insufficient MsmePoints. You have ${pointsData.balance} points, but need ${pointsToSpend} points.`);
      setTimeout(() => setRewardToast(null), 3500);
      return;
    }

    let discountNGN = Math.round(pointsToSpend * 24);
    if (pointsToSpend === 250) discountNGN = 5000;
    else if (pointsToSpend === 500) discountNGN = 12000;
    else if (pointsToSpend === 1000) discountNGN = 30000;
    else if (pointsToSpend === 2000) discountNGN = 65000;

    const matchedService = SERVICES_CATALOGUE.find(s => s.id === serviceId);
    const serviceTitle = matchedService ? matchedService.title : 'Any Service Booking';
    const uniqueCode = `MSME-${Math.round(discountNGN / 1000)}K-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVoucher: LoyaltyVoucher = {
      code: uniqueCode,
      title: `${formatAmount(discountNGN)} Off ${serviceTitle}`,
      pointsCost: pointsToSpend,
      discountNGN,
      discountDisplay: formatAmount(discountNGN),
      minSpendNGN: Math.max(30000, discountNGN * 2),
      used: false,
      expiresAt: 'Dec 31, 2026',
    };

    const appliedObj: AppliedBookingDiscount = {
      code: uniqueCode,
      title: `${formatAmount(discountNGN)} Off ${serviceTitle}`,
      discountNGN,
      discountDisplay: formatAmount(discountNGN),
      pointsSpent: pointsToSpend,
      serviceId: serviceId === 'all' ? undefined : serviceId,
      serviceTitle,
      appliedAt: new Date().toISOString(),
      minSpendNGN: Math.max(30000, discountNGN * 2),
    };

    setPointsData(prev => ({
      ...prev,
      balance: prev.balance - pointsToSpend,
      activeVouchers: [newVoucher, ...prev.activeVouchers],
      history: [
        {
          id: `pt-redeem-${Date.now()}`,
          description: `Applied ${pointsToSpend} pts for ${formatAmount(discountNGN)} discount on next booking (${uniqueCode})`,
          points: -pointsToSpend,
          type: 'redeemed',
          date: new Date().toISOString().split('T')[0],
          reference: uniqueCode,
        },
        ...prev.history,
      ],
    }));

    setAppliedBookingDiscount(appliedObj);
    localStorage.setItem('msmebooks_applied_service_discount', JSON.stringify(appliedObj));
    window.dispatchEvent(new CustomEvent('msmebooks_applied_discount_changed', { detail: appliedObj }));

    setRewardToast(`🎉 Points redeemed! ${formatAmount(discountNGN)} discount applied to your next service booking.`);
    setTimeout(() => setRewardToast(null), 4000);

    if (autoOpenBooking) {
      onClose();
      onNewBookingClick();
    }
  };

  // Cancel currently applied discount and refund points
  const handleCancelAppliedDiscount = () => {
    if (!appliedBookingDiscount) return;
    const pts = appliedBookingDiscount.pointsSpent || 0;
    const code = appliedBookingDiscount.code;

    setPointsData(prev => ({
      ...prev,
      balance: prev.balance + pts,
      activeVouchers: prev.activeVouchers.filter(v => v.code !== code),
      history: [
        {
          id: `pt-refund-${Date.now()}`,
          description: `Refunded ${pts} pts from canceled discount reservation (${code})`,
          points: pts,
          type: 'earned',
          date: new Date().toISOString().split('T')[0],
          reference: code,
        },
        ...prev.history,
      ],
    }));

    setAppliedBookingDiscount(null);
    localStorage.removeItem('msmebooks_applied_service_discount');
    window.dispatchEvent(new CustomEvent('msmebooks_applied_discount_changed', { detail: null }));

    setRewardToast(`Discount reservation canceled. ${pts} points restored to your balance.`);
    setTimeout(() => setRewardToast(null), 3500);
  };

  // Handle Voucher Redemption
  const handleRedeemVoucher = (voucherTemplate: typeof REDEEMABLE_VOUCHERS_CATALOGUE[0]) => {
    if (pointsData.balance < voucherTemplate.pointsCost) {
      setRewardToast(`Insufficient MsmePoints. You need ${voucherTemplate.pointsCost} points to redeem this voucher.`);
      setTimeout(() => setRewardToast(null), 3500);
      return;
    }

    const uniqueCode = `${voucherTemplate.codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVoucher: LoyaltyVoucher = {
      code: uniqueCode,
      title: voucherTemplate.title,
      pointsCost: voucherTemplate.pointsCost,
      discountNGN: voucherTemplate.discountNGN,
      discountDisplay: voucherTemplate.discountDisplay,
      minSpendNGN: voucherTemplate.minSpendNGN,
      used: false,
      expiresAt: 'Dec 31, 2026',
    };

    setPointsData(prev => ({
      ...prev,
      balance: prev.balance - voucherTemplate.pointsCost,
      activeVouchers: [newVoucher, ...prev.activeVouchers],
      history: [
        {
          id: `pt-redeem-${Date.now()}`,
          description: `Redeemed Voucher: ${voucherTemplate.title} (${uniqueCode})`,
          points: -voucherTemplate.pointsCost,
          type: 'redeemed',
          date: new Date().toISOString().split('T')[0],
          reference: uniqueCode,
        },
        ...prev.history,
      ],
    }));

    setRewardToast(`🎉 Success! Voucher ${uniqueCode} redeemed and added to your wallet.`);
    setTimeout(() => setRewardToast(null), 4000);
  };

  const handleCopyVoucher = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedVoucherCode(code);
      setRewardToast(`Voucher code "${code}" copied! Paste at booking checkout.`);
      setTimeout(() => {
        setCopiedVoucherCode(null);
        setRewardToast(null);
      }, 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Chart visual type for Loyalty Progression
  const [loyaltyChartType, setLoyaltyChartType] = useState<'accumulation' | 'velocity'>('accumulation');

  // Award Points for a completed booking
  const awardPointsForBooking = (booking: BookingRecord, pointsToAward = 200) => {
    // Check if points for this booking reference have already been awarded
    const alreadyAwarded = pointsData.history.some(h => 
      h.type === 'earned' && (h.reference === booking.reference || h.id.startsWith(`pt-booking-${booking.id}`))
    );
    if (alreadyAwarded) {
      setRewardToast(`Loyalty points for booking ${booking.reference} have already been awarded.`);
      setTimeout(() => setRewardToast(null), 3000);
      return;
    }

    const newHistoryItem = {
      id: `pt-booking-${booking.id}-${Date.now()}`,
      description: `Completed Booking Reward: ${booking.serviceTitle} (${booking.reference})`,
      points: pointsToAward,
      type: 'earned' as const,
      date: new Date().toISOString().split('T')[0],
      reference: booking.reference,
    };

    setPointsData(prev => {
      const newLifetime = prev.lifetimeEarned + pointsToAward;
      const newBalance = prev.balance + pointsToAward;
      let newTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
      if (newLifetime >= 3000) newTier = 'Platinum';
      else if (newLifetime >= 1500) newTier = 'Gold';
      else if (newLifetime >= 500) newTier = 'Silver';

      return {
        ...prev,
        balance: newBalance,
        lifetimeEarned: newLifetime,
        tier: newTier,
        history: [newHistoryItem, ...prev.history],
      };
    });

    addAppNotification({
      type: 'booking',
      title: '🎉 +200 MsmePoints Awarded!',
      message: `You earned 200 loyalty points for completing your ${booking.serviceTitle} engagement (${booking.reference}). Redeem them for booking discounts!`,
      bookingRef: booking.reference,
      actionLabel: 'View Rewards',
    });

    setRewardToast(`🎉 +${pointsToAward} MsmePoints awarded for completing ${booking.serviceTitle}!`);
    setTimeout(() => setRewardToast(null), 4500);
  };

  // Manual complete booking and award points
  const handleManualCompleteBooking = (bookingId: string) => {
    const target = localBookings.find(x => x.id === bookingId);
    if (!target) return;

    const updatedBookings = localBookings.map(item => 
      item.id === bookingId ? { ...item, status: 'Completed' as const, milestoneProgressPercent: 100 } : item
    );
    setLocalBookings(updatedBookings);
    
    const updatedStages = { ...bookingStages, [bookingId]: 'Completed' as const };
    setBookingStages(updatedStages);

    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updatedBookings));
      localStorage.setItem('msmebooks_booking_stages', JSON.stringify(updatedStages));
      window.dispatchEvent(new CustomEvent('msmebooks_bookings_changed'));
    } catch (e) {
      console.error(e);
    }

    awardPointsForBooking(target, 200);
  };

  // Calculate unclaimed completed bookings
  const unclaimedCompletedBookings = useMemo(() => {
    return localBookings.filter(b => {
      if (b.status !== 'Completed') return false;
      const alreadyAwarded = pointsData.history.some(h => 
        h.type === 'earned' && (h.reference === b.reference || h.id.startsWith(`pt-booking-${b.id}`))
      );
      return !alreadyAwarded;
    });
  }, [localBookings, pointsData.history]);

  const handleClaimAllCompletedPoints = () => {
    if (unclaimedCompletedBookings.length === 0) return;
    unclaimedCompletedBookings.forEach((b, index) => {
      setTimeout(() => {
        awardPointsForBooking(b, 200);
      }, index * 250);
    });
  };

  // Handle applying redeemed voucher to a future booking
  const handleApplyVoucherToBooking = (voucher: LoyaltyVoucher) => {
    handleCopyVoucher(voucher.code);
    const appliedObj: AppliedBookingDiscount = {
      code: voucher.code,
      title: voucher.title,
      discountNGN: voucher.discountNGN,
      discountDisplay: voucher.discountDisplay,
      pointsSpent: voucher.pointsCost,
      appliedAt: new Date().toISOString(),
      minSpendNGN: voucher.minSpendNGN,
    };
    setAppliedBookingDiscount(appliedObj);
    localStorage.setItem('msmebooks_applied_service_discount', JSON.stringify(appliedObj));
    window.dispatchEvent(new CustomEvent('msmebooks_applied_discount_changed', { detail: appliedObj }));
    onClose();
    onNewBookingClick();
  };

  // Recharts timeline dataset for loyalty progress & booking history
  const loyaltyTimelineData = useMemo(() => {
    const baselineMonths = [
      { key: '2026-05', label: 'May 2026', earned: 0, redeemed: 0, completed: 0, total: 0 },
      { key: '2026-06', label: 'Jun 2026', earned: 0, redeemed: 0, completed: 0, total: 0 },
      { key: '2026-07', label: 'Jul 2026', earned: 0, redeemed: 0, completed: 0, total: 0 },
      { key: '2026-08', label: 'Aug 2026', earned: 0, redeemed: 0, completed: 0, total: 0 },
      { key: '2026-09', label: 'Sep 2026', earned: 0, redeemed: 0, completed: 0, total: 0 },
      { key: '2026-10', label: 'Oct 2026', earned: 500, redeemed: 0, completed: 1, total: 2 },
      { key: '2026-11', label: 'Nov 2026', earned: 150, redeemed: 0, completed: 1, total: 3 },
    ];

    const monthlyMap: Record<string, { earned: number; redeemed: number; completedBookings: number; totalBookings: number; descriptions: string[] }> = {};
    baselineMonths.forEach(m => {
      monthlyMap[m.key] = { earned: 0, redeemed: 0, completedBookings: 0, totalBookings: 0, descriptions: [] };
    });

    pointsData.history.forEach(h => {
      const monthKey = h.date.slice(0, 7);
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { earned: 0, redeemed: 0, completedBookings: 0, totalBookings: 0, descriptions: [] };
      }
      if (h.points > 0) {
        monthlyMap[monthKey].earned += h.points;
      } else {
        monthlyMap[monthKey].redeemed += Math.abs(h.points);
      }
      monthlyMap[monthKey].descriptions.push(h.description);
    });

    localBookings.forEach(b => {
      const bDate = b.createdAt ? b.createdAt.slice(0, 7) : '2026-10';
      if (!monthlyMap[bDate]) {
        monthlyMap[bDate] = { earned: 0, redeemed: 0, completedBookings: 0, totalBookings: 0, descriptions: [] };
      }
      monthlyMap[bDate].totalBookings += 1;
      if (b.status === 'Completed') {
        monthlyMap[bDate].completedBookings += 1;
      }
    });

    // Ensure baseline fallback values if history is young
    if (monthlyMap['2026-10'] && monthlyMap['2026-10'].earned === 0) {
      monthlyMap['2026-10'].earned = 500;
      monthlyMap['2026-10'].completedBookings = 1;
      monthlyMap['2026-10'].totalBookings = 2;
    }
    if (monthlyMap['2026-11'] && monthlyMap['2026-11'].earned === 0) {
      monthlyMap['2026-11'].earned = Math.max(150, pointsData.lifetimeEarned - 500);
      monthlyMap['2026-11'].completedBookings = localBookings.filter(b => b.status === 'Completed').length || 1;
      monthlyMap['2026-11'].totalBookings = localBookings.length || 2;
    }

    const sortedMonthKeys = Object.keys(monthlyMap).sort();
    let cumulative = 0;
    let cumulativeCompleted = 0;

    return sortedMonthKeys.map(k => {
      const item = monthlyMap[k];
      cumulative += (item.earned - item.redeemed);
      cumulativeCompleted += item.completedBookings;
      
      const d = new Date(`${k}-15`);
      const label = isNaN(d.getTime()) ? k : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      return {
        monthKey: k,
        label,
        pointsEarned: item.earned,
        pointsRedeemed: item.redeemed,
        netPoints: item.earned - item.redeemed,
        cumulativePoints: Math.max(0, cumulative),
        monthlyCompletedBookings: item.completedBookings,
        cumulativeCompletedBookings: cumulativeCompleted,
        totalBookings: item.totalBookings,
        tierLevel: cumulative >= 3000 ? 4 : cumulative >= 1500 ? 3 : cumulative >= 500 ? 2 : 1,
        tierName: cumulative >= 3000 ? 'Platinum' : cumulative >= 1500 ? 'Gold' : cumulative >= 500 ? 'Silver' : 'Bronze',
      };
    });
  }, [pointsData.history, pointsData.lifetimeEarned, localBookings]);

  const handleShareBooking = async (booking: BookingRecord) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://msmebooks.com';
    const serviceUrl = `${origin}?bookingRef=${encodeURIComponent(booking.reference)}&service=${encodeURIComponent(booking.serviceId)}`;

    const preformattedShareText = 
      `📋 MsmeBooks Professional Service Booking Details\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Service: ${booking.serviceTitle} (${booking.packageName})\n` +
      `• Provider: ${booking.providerName} [${booking.providerType}]\n` +
      `• Schedule: ${booking.appointmentDate} at ${booking.timeSlot}\n` +
      `• Consultation Mode: ${booking.consultationMode}\n` +
      `• Booking Reference: ${booking.reference}\n` +
      `• Client: ${booking.customerName} (${booking.businessName})\n` +
      `• Status: ${booking.status}${booking.paymentGateway ? `\n• Payment Gateway: ${booking.paymentGateway} (Ref: ${booking.paymentTransactionRef || 'Verified'})` : ''}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔗 MsmeBooks Service Link:\n${serviceUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `MsmeBooks Booking: ${booking.serviceTitle} (${booking.reference})`,
          text: preformattedShareText,
          url: serviceUrl,
        });
        setShareToast(`Booking ${booking.reference} shared successfully!`);
        setTimeout(() => setShareToast(null), 3500);
        return;
      } catch (err: unknown) {
        // If the user cancelled the native share sheet, do not fallback or error
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(preformattedShareText);
      setCopiedBookingId(booking.id);
      setShareToast(`Booking details & MsmeBooks service link copied to clipboard!`);
      setTimeout(() => {
        setCopiedBookingId(null);
        setShareToast(null);
      }, 3500);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  const handleEnableReminders = async () => {
    const res = await requestNotificationPermission();
    setNotificationPerm(res);
    if (res === 'granted') {
      setBookingAlertsEnabled(true);
      setBookingAlertsEnabledState(true);
      await check24HourBookingReminders();
      setReminderToast('Reminders activated! You will receive push notifications 24 hours and 1 hour before scheduled sessions.');
      setTimeout(() => setReminderToast(null), 4500);
    }
  };

  const handleToggleBookingAlerts = async () => {
    const nextState = !bookingAlertsEnabled;
    if (nextState) {
      let perm = notificationPerm;
      if (perm !== 'granted') {
        perm = await requestNotificationPermission();
        setNotificationPerm(perm);
      }
      if (perm === 'granted') {
        setBookingAlertsEnabled(true);
        setBookingAlertsEnabledState(true);
        await check24HourBookingReminders();
        setReminderToast('🔔 Booking Alerts Enabled: Browser Push API will alert you 24 hours before your service appointments.');
        setTimeout(() => setReminderToast(null), 4500);
      } else {
        setBookingAlertsEnabled(false);
        setBookingAlertsEnabledState(false);
        setReminderToast('⚠️ Browser notification permission was denied. Please enable notifications in your browser settings to receive 24h booking alerts.');
        setTimeout(() => setReminderToast(null), 5000);
      }
    } else {
      setBookingAlertsEnabled(false);
      setBookingAlertsEnabledState(false);
      setReminderToast('🔕 Booking Alerts Disabled: 24-hour pre-appointment reminders turned off.');
      setTimeout(() => setReminderToast(null), 4000);
    }
  };

  const handleTest24HourAlert = async () => {
    if (notificationPerm !== 'granted') {
      const res = await requestNotificationPermission();
      setNotificationPerm(res);
      if (res !== 'granted') {
        setReminderToast('⚠️ Notification permission required to trigger appointment alerts.');
        setTimeout(() => setReminderToast(null), 4000);
        return;
      }
    }
    const targetBooking = bookings.find(b => b.status === 'Confirmed') || bookings[0];
    await trigger24HourReminderNotification(targetBooking);
    setReminderToast('⏰ 24-Hour Booking Alert dispatched! Check your desktop notification or in-app bell.');
    setTimeout(() => setReminderToast(null), 4500);
  };

  const handleTestReminder = async () => {
    if (notificationPerm !== 'granted') {
      const res = await requestNotificationPermission();
      setNotificationPerm(res);
      if (res !== 'granted') return;
    }
    await triggerTestReminderNotification(bookings[0]);
    setReminderToast('Sample 1-hour consultation alert triggered via Service Worker!');
    setTimeout(() => setReminderToast(null), 3500);
  };

  const handleTestBookingAcceptedAlert = async () => {
    if (notificationPerm !== 'granted') {
      const res = await requestNotificationPermission();
      setNotificationPerm(res);
      if (res !== 'granted') return;
    }
    const targetBooking = bookings[0];
    await triggerBookingAcceptedNotification({
      bookingId: targetBooking?.id || 'bkg-demo-1',
      reference: targetBooking?.reference || 'MSME-BK-9182',
      serviceTitle: targetBooking?.serviceTitle || 'Statutory Tax Filing & Withholding Tax Audit',
      providerName: targetBooking?.providerName || 'Cedar Professional Services Limited',
      appointmentDate: targetBooking?.appointmentDate || 'Thursday, Nov 12',
      timeSlot: targetBooking?.timeSlot || '10:00 AM',
      clientName: targetBooking?.customerName || 'Adebayo Ogunlesi',
    });
    setReminderToast('🎉 Browser push alert dispatched: Firm accepted your booking request!');
    setTimeout(() => setReminderToast(null), 4500);
  };

  const handleTestBookingStatusAlert = async () => {
    if (notificationPerm !== 'granted') {
      const res = await requestNotificationPermission();
      setNotificationPerm(res);
      if (res !== 'granted') return;
    }
    const targetBooking = bookings[0];
    await triggerBookingStatusUpdatedNotification({
      bookingId: targetBooking?.id || 'bkg-demo-1',
      reference: targetBooking?.reference || 'MSME-BK-9182',
      serviceTitle: targetBooking?.serviceTitle || 'Statutory Tax Filing & Withholding Tax Audit',
      providerName: targetBooking?.providerName || 'Cedar Professional Services Limited',
      status: 'Phase 2: Discovery Review Completed',
      note: 'Certified Partner completed statutory review checklist and assigned senior tax counsel.',
      progressPercent: 65,
    });
    setReminderToast('📋 Browser push alert dispatched: Firm updated booking status & milestones!');
    setTimeout(() => setReminderToast(null), 4500);
  };

  const totalSpentNGN = useMemo(() => {
    return bookings.reduce((acc, b) => {
      if (b.billingBreakdown?.totalNGN) return acc + b.billingBreakdown.totalNGN;
      const match = b.packagePrice.match(/₦\s*([\d,]+)/);
      if (match) return acc + parseInt(match[1].replace(/,/g, ''), 10);
      return acc + 85000;
    }, 0);
  }, [bookings]);

  const budgetRatio = monthlyBudgetLimit > 0 ? (totalSpentNGN / monthlyBudgetLimit) : 0;
  const isBudgetExceeded = totalSpentNGN > monthlyBudgetLimit;
  const isNearBudget = !isBudgetExceeded && monthlyBudgetLimit > 0 && budgetRatio >= 0.85;

  // Trigger alert notification when budget limit is breached
  useEffect(() => {
    if (isBudgetExceeded && !budgetBreachAlertDismissed) {
      addAppNotification({
        type: 'expert',
        title: 'Budget Threshold Breached!',
        message: `Your professional services spend (${formatAmount(totalSpentNGN)}) has exceeded your user-defined monthly limit of ${formatAmount(monthlyBudgetLimit)}.`,
        actionLabel: 'Review Budget',
      });
    }
  }, [isBudgetExceeded, monthlyBudgetLimit, budgetBreachAlertDismissed, totalSpentNGN, formatAmount]);

  // Calendar Grid calculation for Mini Calendar View (Prompt #2)
  const calendarGrid = useMemo(() => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dayNumber: number; dateString: string; dayBookings: BookingRecord[] }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateString = `${year}-${mm}-${dd}`;
      const dayBookings = bookings.filter(b => b.appointmentDate === dateString);
      days.push({
        dayNumber: d,
        dateString,
        dayBookings,
      });
    }

    return {
      monthLabel: calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      firstDayIndex,
      days,
    };
  }, [calMonth, bookings]);

  const handleSimulateDownload = (bookingId: string) => {
    setDownloadSuccessId(bookingId);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B7E532]">
                Customer Engagement Portal
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                {bookings.length} Bookings
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-bold text-[#B7E532] bg-slate-800/80 px-2 py-0.5 rounded">
                Value: {formatAmount(totalSpentNGN)}
              </span>
              <span className="text-slate-400">•</span>
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className="text-xs font-bold text-[#B7E532] bg-slate-800/80 hover:bg-[#1464C8]/50 px-2.5 py-0.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors border border-white/10"
                title="Open MsmeBooks Digital Wallet"
              >
                <Wallet className="w-3 h-3 text-[#B7E532]" />
                <span>Wallet: {formatAmount(walletBalanceState)}</span>
              </button>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              My Bookings & Professional Engagements
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle & View Switcher */}
        <div className="bg-slate-50 dark:bg-[#08121E] px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'upcoming' 
                  ? 'bg-[#1464C8] text-white shadow-xs' 
                  : 'bg-white dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Active / Upcoming ({bookings.filter(b => b.status !== 'Completed').length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'past' 
                  ? 'bg-[#1464C8] text-white shadow-xs' 
                  : 'bg-white dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Completed ({bookings.filter(b => b.status === 'Completed').length})
            </button>

            {/* MsmeBooks Wallet Tab (Pre-load Credits & 1-Click Payments) */}
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'wallet' 
                  ? 'bg-gradient-to-r from-[#102B4E] to-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]' 
                  : 'bg-blue-50 dark:bg-blue-950/40 text-[#1464C8] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-[#B7E532]" />
              <span>MsmeBooks Wallet</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#B7E532]/20 text-emerald-800 dark:text-[#B7E532] font-black">
                1-Click
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calendar' 
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]' 
                  : 'bg-white dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Monthly Calendar ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rewards' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs' 
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5 fill-amber-400" />
              <span>Points Redemption ({pointsData.balance} pts)</span>
              {appliedBookingDiscount && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" title="Active discount ready for next booking" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('spending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'spending' 
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]' 
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
              <span>Spending Insights</span>
            </button>

            {/* Compliance Calendar Section (Tax Filing Deadlines) */}
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compliance' 
                  ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-xs ring-2 ring-[#B7E532]' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Compliance Calendar</span>
            </button>

            {/* Documents Vault Tab (Auto-Generated PDF Invoices) */}
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]'
                  : 'bg-white dark:bg-[#0D1D31] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span>Documents ({autoInvoices.length})</span>
            </button>

            {/* Service Progress Timeline Tab (Long-Term Engagements) */}
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs ring-2 ring-[#B7E532]'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-900'
              }`}
            >
              <GitCommitVertical className="w-3.5 h-3.5 text-indigo-600 dark:text-[#B7E532]" />
              <span>Service Progress Timeline ({localBookings.filter(isLongTermEngagement).length})</span>
            </button>

            {/* View Format Toggle: List vs Calendar Grid (Prompt #2) */}
            {activeTab !== 'rewards' && activeTab !== 'spending' && activeTab !== 'compliance' && activeTab !== 'calendar' && activeTab !== 'wallet' && activeTab !== 'documents' && activeTab !== 'timeline' && (
              <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-bold ml-2">
                <button
                  type="button"
                  onClick={() => setViewFormat('list')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                    viewFormat === 'list'
                      ? 'bg-white dark:bg-[#1464C8] text-[#102B4E] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="View as detailed engagement list"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat('calendar')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                    viewFormat === 'calendar'
                      ? 'bg-white dark:bg-[#1464C8] text-[#102B4E] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="View as interactive monthly appointment calendar"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Mini Calendar</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onNewBookingClick();
            }}
            className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Book New Service</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1 bg-slate-50/50 dark:bg-[#08121E]">
          
          {/* Rewards Toast */}
          {rewardToast && (
            <div className="bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{rewardToast}</span>
              </div>
              <button onClick={() => setRewardToast(null)} className="text-amber-500 hover:text-amber-800 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Auto-Invoice PDF Generated Toast */}
          {autoInvoiceToast && (
            <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                <span>
                  Auto-Invoice generated PDF copy <strong>{autoInvoiceToast.fileName}</strong> for completed service "{autoInvoiceToast.serviceTitle}" and archived it in your Documents tab.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('documents');
                    setAutoInvoiceToast(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#102B4E] hover:bg-[#1464C8] text-white font-black text-[11px] cursor-pointer"
                >
                  Open Documents →
                </button>
                <button onClick={() => setAutoInvoiceToast(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* REWARDS TAB VIEW */}
          {activeTab === 'rewards' ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top Points Balance & Tier Status Banner */}
              <div className="bg-gradient-to-br from-[#102B4E] via-[#1464C8] to-[#0A1727] text-white p-6 rounded-3xl shadow-lg border border-white/10 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B7E532]">
                      <Coins className="w-4 h-4" />
                      <span>MsmeBooks Loyalty & Client Rewards</span>
                    </div>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {pointsData.balance.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                        Available Points
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      Earn <span className="font-black text-[#B7E532]">+150 MsmePoints</span> on every verified booking completed.
                    </p>
                  </div>

                  {/* Tier Badge & Progress */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-300 font-semibold">Current Status Tier:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                        currentTier === 'Platinum' ? 'bg-purple-500 text-white' :
                        currentTier === 'Gold' ? 'bg-amber-400 text-slate-900' :
                        currentTier === 'Silver' ? 'bg-slate-200 text-slate-800' :
                        'bg-amber-700 text-white'
                      }`}>
                        {currentTier} Member
                      </span>
                    </div>

                    {nextTierInfo.pointsNeeded > 0 ? (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                          <span>Progress to {nextTierInfo.next}</span>
                          <span className="font-bold">{nextTierInfo.pointsNeeded} pts left</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                          <div 
                            className="h-full bg-[#B7E532] transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (pointsData.lifetimeEarned / nextTierInfo.max) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-[11px] text-[#B7E532] font-black flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Maximum Tier Achieved! VIP Benefits Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Unclaimed Points Banner */}
              {unclaimedCompletedBookings.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border-2 border-amber-400 dark:border-amber-500/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Trophy className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#102B4E] dark:text-white">
                          {unclaimedCompletedBookings.length} Completed Booking{unclaimedCompletedBookings.length > 1 ? 's' : ''} Ready to Claim!
                        </span>
                        <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          +{unclaimedCompletedBookings.length * 200} Points
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Claim points for completed professional engagements now to unlock immediate discount codes.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClaimAllCompletedPoints}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4 text-[#B7E532]" />
                    <span>Claim +{unclaimedCompletedBookings.length * 200} MsmePoints</span>
                  </button>
                </div>
              )}

              {/* Loyalty Tracker KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-[#0D1D31] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-bold">Available Points</span>
                    <Coins className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#102B4E] dark:text-white">
                    {pointsData.balance.toLocaleString()}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold text-emerald-600 dark:text-[#B7E532] flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    <span>
                      {pointsData.balance >= 2500 ? 'Up to ₦30,000 Off' : pointsData.balance >= 1500 ? 'Up to ₦15,000 Off' : pointsData.balance >= 500 ? 'Up to ₦5,000 Off' : 'Earn 500 pts for ₦5k Off'}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0D1D31] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-bold">Lifetime Earned</span>
                    <Award className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#102B4E] dark:text-white">
                    {pointsData.lifetimeEarned.toLocaleString()}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Tier: <span className="font-bold text-[#1464C8] dark:text-blue-400">{currentTier} Member</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0D1D31] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-bold">Completed Bookings</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#102B4E] dark:text-white">
                    {localBookings.filter(b => b.status === 'Completed').length}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    +{(localBookings.filter(b => b.status === 'Completed').length * 200).toLocaleString()} pts awarded
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0D1D31] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-bold">Active Vouchers</span>
                    <Tag className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="mt-1 text-2xl font-black text-[#102B4E] dark:text-white">
                    {pointsData.activeVouchers.length}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    {pointsData.activeVouchers.length > 0 ? 'Ready for next booking' : 'Redeem points below'}
                  </div>
                </div>
              </div>

              {/* Recharts Loyalty Accumulation & Booking Velocity Chart */}
              <div className="bg-white dark:bg-[#0D1D31] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                      <h3 className="font-black text-sm sm:text-base text-[#102B4E] dark:text-white">
                        Loyalty Points Progress & Booking History
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Visualize cumulative points growth, monthly booking milestones, and tier thresholds over time.
                    </p>
                  </div>

                  {/* Chart View Switcher */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setLoyaltyChartType('accumulation')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        loyaltyChartType === 'accumulation'
                          ? 'bg-white dark:bg-[#1464C8] text-[#1464C8] dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Cumulative Points
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoyaltyChartType('velocity')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        loyaltyChartType === 'velocity'
                          ? 'bg-white dark:bg-[#1464C8] text-[#1464C8] dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Monthly Earned & Bookings
                    </button>
                  </div>
                </div>

                {/* Chart Canvas */}
                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {loyaltyChartType === 'accumulation' ? (
                      <AreaChart data={loyaltyTimelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="loyaltyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1464C8" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#1464C8" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fontSize: 11, fill: '#64748b' }} 
                          axisLine={{ stroke: '#cbd5e1' }}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: '#64748b' }} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="bg-[#102B4E] text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-white/10">
                                <div className="font-black text-[#B7E532] border-b border-white/10 pb-1 flex items-center justify-between gap-4">
                                  <span>{d.label}</span>
                                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/20">{d.tierName} Tier</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-300">Cumulative Balance:</span>
                                  <span className="font-black text-amber-400">{d.cumulativePoints.toLocaleString()} pts</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-300">Points Earned:</span>
                                  <span className="font-bold text-emerald-400">+{d.pointsEarned} pts</span>
                                </div>
                                {d.pointsRedeemed > 0 && (
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-slate-300">Points Redeemed:</span>
                                    <span className="font-bold text-red-400">-{d.pointsRedeemed} pts</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-4 text-[11px] text-slate-300 pt-0.5">
                                  <span>Completed Bookings:</span>
                                  <span className="font-bold text-white">{d.monthlyCompletedBookings}</span>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <ReferenceLine y={500} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Silver (500 pts)', position: 'insideTopLeft', fill: '#94a3b8', fontSize: 10 }} />
                        <ReferenceLine y={1500} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Gold (1,500 pts)', position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10 }} />
                        <ReferenceLine y={3000} stroke="#a855f7" strokeDasharray="3 3" label={{ value: 'Platinum (3,000 pts)', position: 'insideTopLeft', fill: '#a855f7', fontSize: 10 }} />
                        <Area 
                          type="monotone" 
                          dataKey="cumulativePoints" 
                          name="Cumulative Points" 
                          stroke="#1464C8" 
                          fill="url(#loyaltyAreaGrad)" 
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: '#1464C8' }}
                          activeDot={{ r: 5, fill: '#B7E532' }}
                        />
                      </AreaChart>
                    ) : (
                      <ComposedChart data={loyaltyTimelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fontSize: 11, fill: '#64748b' }} 
                          axisLine={{ stroke: '#cbd5e1' }}
                          tickLine={false}
                        />
                        <YAxis 
                          yAxisId="left"
                          tick={{ fontSize: 11, fill: '#64748b' }} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 11, fill: '#64748b' }} 
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="bg-[#102B4E] text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-white/10">
                                <div className="font-black text-[#B7E532] border-b border-white/10 pb-1">
                                  {d.label} Performance
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-300">Earned from Bookings:</span>
                                  <span className="font-black text-emerald-400">+{d.pointsEarned} pts</span>
                                </div>
                                {d.pointsRedeemed > 0 && (
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-slate-300">Redeemed for Vouchers:</span>
                                    <span className="font-bold text-red-400">-{d.pointsRedeemed} pts</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-300">Completed Appointments:</span>
                                  <span className="font-bold text-[#B7E532]">{d.monthlyCompletedBookings}</span>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                        <Bar yAxisId="left" dataKey="pointsEarned" name="Points Earned" fill="#1464C8" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="left" dataKey="pointsRedeemed" name="Points Redeemed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="monthlyCompletedBookings" name="Completed Bookings" stroke="#B7E532" strokeWidth={2.5} dot={{ r: 4, fill: '#B7E532' }} />
                      </ComposedChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Loyalty Rules & Summary Footnote */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span><strong>+200 Points</strong> per verified booking completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span><strong>500 Pts = ₦5,000 Off</strong> voucher discount</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span><strong>Tier Milestones:</strong> Silver (500), Gold (1.5k), Platinum (3k)</span>
                  </div>
                </div>
              </div>

              {/* POINTS REDEMPTION SECTION */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-[#102B4E] dark:text-white flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-amber-500" />
                      <span>Points Redemption & Booking Discounts</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Apply your accumulated MsmePoints directly toward instant price reductions on your next service appointment.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 self-start sm:self-auto">
                    <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Balance: <strong className="font-black text-amber-600 dark:text-amber-400">{pointsData.balance.toLocaleString()} pts</strong>
                    </span>
                  </div>
                </div>

                {/* Active Applied Booking Discount Banner */}
                {appliedBookingDiscount ? (
                  <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-blue-500/15 border-2 border-emerald-400 dark:border-emerald-600 p-4 rounded-2xl shadow-sm space-y-3 animate-in fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                              Active Booking Discount Ready
                            </span>
                            <span className="font-mono font-bold text-xs text-[#102B4E] dark:text-white">
                              {appliedBookingDiscount.code}
                            </span>
                          </div>
                          <div className="text-lg font-black text-[#102B4E] dark:text-white mt-1">
                            {appliedBookingDiscount.discountDisplay} Off {appliedBookingDiscount.serviceTitle || 'Next Service'}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                            Redeemed with {appliedBookingDiscount.pointsSpent} points. This discount is currently armed and will automatically deduct from your invoice when you book.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto flex-wrap sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNewBookingClick();
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Book with {appliedBookingDiscount.discountDisplay} Off</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelAppliedDiscount}
                          className="px-3 py-2 bg-white dark:bg-[#0D1D31] hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Cancel discount reservation and refund points"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Cancel & Refund</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Interactive Redemption Builder */
                  <div className="bg-white dark:bg-[#0D1D31] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                    {/* Step 1: Select Points to Spend */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#102B4E] dark:bg-[#1464C8] text-white flex items-center justify-center text-[10px]">1</span>
                          <span>Choose Points to Apply Toward Discount</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setIsCustomPointsMode(!isCustomPointsMode)}
                          className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline cursor-pointer"
                        >
                          {isCustomPointsMode ? 'Use Preset Tiers' : 'Custom Points Slider'}
                        </button>
                      </div>

                      {!isCustomPointsMode ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { pts: 250, discNGN: 5000, label: 'Starter', minSpend: 30000 },
                            { pts: 500, discNGN: 12000, label: 'Most Popular', minSpend: 60000, recommended: true },
                            { pts: 1000, discNGN: 30000, label: 'Enterprise', minSpend: 120000 },
                            { pts: 2000, discNGN: 65000, label: 'VIP Retainer', minSpend: 200000 },
                          ].map((tier) => {
                            const isSelected = redemptionPointsPreset === tier.pts;
                            const canAfford = pointsData.balance >= tier.pts;

                            return (
                              <button
                                key={tier.pts}
                                type="button"
                                onClick={() => setRedemptionPointsPreset(tier.pts)}
                                className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                                  isSelected
                                    ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/70 dark:bg-blue-950/50 shadow-sm ring-2 ring-[#1464C8]/30'
                                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#071322] hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                              >
                                {tier.recommended && (
                                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-amber-500 text-white shadow-2xs">
                                    Popular
                                  </span>
                                )}
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                  {tier.label}
                                </div>
                                <div className="text-sm font-black text-[#102B4E] dark:text-white mt-0.5">
                                  {formatAmount(tier.discNGN)} Off
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                                  <span className="text-amber-600 dark:text-amber-400">{tier.pts} pts</span>
                                  <span className={`text-[10px] ${canAfford ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                    {canAfford ? 'Eligible' : 'Need more'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-slate-50 dark:bg-[#071322] p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                              Redeem Points: <strong className="text-amber-600 dark:text-amber-400">{customPointsInput} pts</strong>
                            </span>
                            <span className="font-black text-[#1464C8] dark:text-[#B7E532] text-sm">
                              = {formatAmount(computedDiscountNGN)} Discount
                            </span>
                          </div>

                          <input
                            type="range"
                            min="100"
                            max={Math.max(100, Math.min(3000, pointsData.balance || 1000))}
                            step="50"
                            value={customPointsInput}
                            onChange={(e) => setCustomPointsInput(Number(e.target.value))}
                            className="w-full accent-[#1464C8] dark:accent-[#B7E532] cursor-pointer"
                          />

                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>100 pts ({formatAmount(2400)} Off)</span>
                            <span>Max Available: {pointsData.balance} pts</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Target Service Scope */}
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                        <span className="w-5 h-5 rounded-full bg-[#102B4E] dark:bg-[#1464C8] text-white flex items-center justify-center text-[10px]">2</span>
                        <span>Select Target Service for Next Booking</span>
                      </label>

                      <select
                        value={targetServiceId}
                        onChange={(e) => setTargetServiceId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#071322] text-xs font-bold text-[#102B4E] dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1464C8]"
                      >
                        <option value="all">🌟 Any Service Booking (Universal Voucher - Applies at Checkout)</option>
                        {SERVICES_CATALOGUE.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.title} ({srv.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Step 3: Summary & Application Actions */}
                    <div className="bg-slate-50 dark:bg-[#071322] p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-slate-400">Total Discount:</span>
                          <span className="text-base font-black text-emerald-600 dark:text-[#B7E532]">
                            {formatAmount(computedDiscountNGN)} Off
                          </span>
                          <span className="text-[11px] text-slate-400">
                            (Costs {activePointsToRedeem} Points)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Remaining points balance after redemption: <strong className="text-slate-700 dark:text-slate-200">{Math.max(0, pointsData.balance - activePointsToRedeem).toLocaleString()} pts</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => handleApplyPointsToNextBooking(activePointsToRedeem, targetServiceId, false)}
                          disabled={pointsData.balance < activePointsToRedeem}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            pointsData.balance >= activePointsToRedeem
                              ? 'bg-[#102B4E] hover:bg-[#1464C8] text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Ticket className="w-3.5 h-3.5 text-amber-400" />
                          <span>Apply to Next Booking</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyPointsToNextBooking(activePointsToRedeem, targetServiceId, true)}
                          disabled={pointsData.balance < activePointsToRedeem}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                            pointsData.balance >= activePointsToRedeem
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#B7E532]" />
                          <span>Apply & Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Redeemable Vouchers Catalogue */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#102B4E] dark:text-white flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-500" />
                      <span>Standard Discount Vouchers Catalogue</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instantly redeem points into promo codes stored in your wallet.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {REDEEMABLE_VOUCHERS_CATALOGUE.map((v, i) => {
                    const canAfford = pointsData.balance >= v.pointsCost;
                    return (
                      <div
                        key={i}
                        className="bg-white dark:bg-[#0D1D31] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-[#1464C8] transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                              {v.discountDisplay} Off
                            </span>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              {v.pointsCost} pts
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#102B4E] dark:text-white mt-2 leading-tight">
                            {v.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Min. service spend: {formatAmount(v.minSpendNGN)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRedeemVoucher(v)}
                          disabled={!canAfford}
                          className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            canAfford
                              ? 'bg-[#1464C8] hover:bg-[#1052a5] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          <span>{canAfford ? 'Redeem Voucher' : 'Need More Points'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Vouchers in Wallet */}
              {pointsData.activeVouchers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-[#102B4E] dark:text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span>Your Active Vouchers & Promo Codes</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pointsData.activeVouchers.map((vc) => (
                      <div
                        key={vc.code}
                        className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-emerald-800 dark:text-emerald-300 font-mono tracking-wider">
                              {vc.code}
                            </span>
                            <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.2 rounded font-bold">
                              {vc.discountDisplay}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            Valid until {vc.expiresAt}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                          <button
                            type="button"
                            onClick={() => handleCopyVoucher(vc.code)}
                            className="px-2.5 py-1 bg-white dark:bg-[#0D1D31] hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                            title="Copy voucher code to clipboard"
                          >
                            {copiedVoucherCode === vc.code ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyVoucherToBooking(vc)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                            title="Copy code and open service marketplace to apply this discount"
                          >
                            <span>Use Discount</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Points Activity History */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-[#102B4E] dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>MsmePoints Activity History</span>
                </h3>

                <div className="bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {pointsData.history.map((h) => (
                    <div key={h.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#102B4E] dark:text-white">
                          {h.description}
                        </p>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {h.date} {h.reference ? `• Ref: ${h.reference}` : ''}
                        </span>
                      </div>
                      <span className={`font-black text-xs px-2 py-0.5 rounded ${
                        h.points > 0
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532]'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                      }`}>
                        {h.points > 0 ? `+${h.points}` : h.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : activeTab === 'spending' ? (
            <SpendingInsightsSection
              bookings={localBookings}
              monthlyBudgetLimit={monthlyBudgetLimit}
              onNewBookingClick={() => {
                onClose();
                onNewBookingClick();
              }}
            />
          ) : activeTab === 'compliance' ? (
            <ComplianceCalendarSection
              userCountry={userCountry || localBookings[0]?.country || 'Nigeria'}
              onBookTaxService={() => {
                onClose();
                onNewBookingClick();
              }}
            />
          ) : activeTab === 'calendar' ? (
            /* DEDICATED MONTHLY CALENDAR VIEW */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-[#0A1727] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                {/* Month Navigation & Summary Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1464C8] text-white flex items-center justify-center shadow-xs shrink-0">
                      <CalendarDays className="w-6 h-6 text-[#B7E532]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#1464C8] dark:text-[#B7E532]">
                          Monthly Engagement Calendar
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-[#B7E532]">
                          {bookings.length} Total Appointments
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-[#102B4E] dark:text-white mt-0.5">
                        {calendarGrid.monthLabel}
                      </h3>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                        setSelectedCalendarDate(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCalMonth(new Date(2026, 9, 1)); // October 2026 default
                        setSelectedCalendarDate(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#1464C8] dark:text-[#B7E532] text-xs font-bold transition-colors cursor-pointer border border-blue-200 dark:border-blue-900"
                    >
                      Current Month
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                        setSelectedCalendarDate(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Next Month"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="py-1">{d}</div>
                  ))}
                </div>

                {/* 7-Column Responsive Month Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty padding cells */}
                  {Array.from({ length: calendarGrid.firstDayIndex }).map((_, i) => (
                    <div
                      key={`cal-pad-${i}`}
                      className="min-h-[76px] rounded-2xl bg-slate-50/40 dark:bg-slate-900/10 border border-transparent"
                    />
                  ))}

                  {/* Day Cells */}
                  {calendarGrid.days.map((d) => {
                    const hasAppointments = d.dayBookings.length > 0;
                    const isSelected = selectedCalendarDate === d.dateString;
                    const hasPending = d.dayBookings.some(b => b.status === 'Pending Review' || b.paymentStatus === 'Pending Payment');

                    return (
                      <div
                        key={d.dateString}
                        onClick={() => setSelectedCalendarDate(isSelected ? null : d.dateString)}
                        className={`min-h-[82px] p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/80 dark:bg-blue-950/60 shadow-md ring-2 ring-[#1464C8]/40 scale-[1.02]'
                            : hasAppointments
                            ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500 hover:shadow-xs'
                            : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${
                            isSelected 
                              ? 'text-[#1464C8] dark:text-[#B7E532]' 
                              : hasAppointments 
                              ? 'text-emerald-800 dark:text-emerald-300' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {d.dayNumber}
                          </span>
                          {hasAppointments && (
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                hasPending ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                hasPending ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}></span>
                            </span>
                          )}
                        </div>

                        {hasAppointments ? (
                          <div className="mt-1 space-y-1">
                            <div className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-white/90 dark:bg-slate-800/90 px-1.5 py-0.5 rounded shadow-xs truncate">
                              {d.dayBookings.length} {d.dayBookings.length === 1 ? 'Booking' : 'Bookings'}
                            </div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                              {d.dayBookings[0].serviceTitle.slice(0, 14)}...
                            </div>
                          </div>
                        ) : (
                          <div className="text-[9px] text-slate-300 dark:text-slate-600">
                            Open
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Date Appointments Inspector */}
                {selectedCalendarDate ? (
                  <div className="mt-6 p-5 bg-gradient-to-br from-blue-50/90 via-slate-50 to-blue-50/50 dark:from-[#0B1E34] dark:via-[#09182A] dark:to-[#0B1E34] rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-xs animate-in fade-in space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
                          Appointments on {new Date(selectedCalendarDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCalendarDate(null)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                      >
                        ✕ Close Inspector
                      </button>
                    </div>

                    {bookings.filter(b => b.appointmentDate === selectedCalendarDate).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                        No appointments booked for this specific date. Click "Book New Service" to schedule a session.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bookings
                          .filter(b => b.appointmentDate === selectedCalendarDate)
                          .map(b => {
                            const isPending = 
                              b.status === 'Pending Review' || 
                              (b.status as string) === 'Pending' || 
                              b.paymentStatus === 'Pending Payment' ||
                              b.paymentStatus === 'Quote Requested';

                            return (
                              <div
                                key={b.id}
                                className={`p-4 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800 ${getPrimaryStatusColorBorder(b, getEffectiveStage(b))} shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}
                              >
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-black text-xs text-[#1464C8] dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                                      {b.reference}
                                    </span>
                                    <BookingStatusBadges
                                      booking={b}
                                      size="compact"
                                      effectiveStage={getEffectiveStage(b)}
                                    />
                                    <span className="text-xs font-extrabold text-[#102B4E] dark:text-[#B7E532]">
                                      {formatPriceString(b.packagePrice)}
                                    </span>
                                  </div>

                                  <h4 className="font-black text-sm text-[#102B4E] dark:text-white mt-1">
                                    {b.serviceTitle} ({b.packageName})
                                  </h4>

                                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                                    <span>🕒 {b.timeSlot}</span>
                                    <span>•</span>
                                    <span>🏢 Firm: <strong className="text-slate-700 dark:text-slate-200">{b.providerName}</strong></span>
                                    <span>•</span>
                                    <span>Mode: {b.consultationMode}</span>
                                  </div>
                                </div>

                                {/* Appointment Actions in Inspector */}
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Invoice Receipt */}
                                  {b.status === 'Completed' ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => setActiveInvoiceBooking(b)}
                                        className="px-3 py-1.5 bg-[#102B4E] hover:bg-[#1464C8] text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-white/10"
                                        title="Download clean printable tax invoice & receipt"
                                      >
                                        <Download className="w-3.5 h-3.5 text-[#B7E532]" />
                                        <span>Download PDF Receipt</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setReviewModalBooking(b)}
                                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ring-1 ring-amber-400/40"
                                        title="Leave star rating and feedback"
                                      >
                                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                                        <span>{b.userRating ? `Rated ${b.userRating}★` : 'Leave a Review'}</span>
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setActiveInvoiceBooking(b)}
                                      className="px-3 py-1.5 bg-[#102B4E] hover:bg-[#1464C8] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                      title="View & print invoice receipt"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-[#B7E532]" />
                                      <span>Invoice</span>
                                    </button>
                                  )}

                                  {/* Export to Calendar Button */}
                                  <CalendarSyncButton 
                                    booking={b} 
                                    label="Export to Calendar"
                                    highlightConfirmed={b.status === 'Confirmed'}
                                    onExportSuccess={(msg) => {
                                      setCalendarToast(msg);
                                      setTimeout(() => setCalendarToast(null), 4000);
                                    }}
                                  />

                                  {/* 1-Click Wallet Pay & Quick Deposit Button for pending bookings */}
                                  {isPending && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handle1ClickWalletPay(b)}
                                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs ring-1 ring-emerald-400/40 cursor-pointer"
                                        title="1-Click instant payment using pre-loaded MsmeBooks Wallet credits"
                                      >
                                        <Zap className="w-3.5 h-3.5 text-[#B7E532] fill-[#B7E532]" />
                                        <span>1-Click Wallet Pay</span>
                                      </button>
                                      <a
                                        href={buildWhatsAppBookingUrl({
                                          serviceName: b.serviceTitle,
                                          packageName: b.packageName,
                                          providerName: b.providerName,
                                          bookingRef: b.reference,
                                          customerName: b.customerName,
                                          businessName: b.businessName,
                                          billingOption: 'Initial Deposit / Quick Fee Settlement',
                                          estimatedFee: b.packagePrice,
                                          requirements: `Requesting instant secure payment link to deposit/settle fees for pending booking ${b.reference}.`,
                                        })}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-[#1464C8] dark:text-blue-300 font-bold text-xs rounded-lg flex items-center gap-1 transition-all border border-blue-200 dark:border-blue-800 cursor-pointer"
                                        title="Request payment link via WhatsApp"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Deposit</span>
                                      </a>
                                    </>
                                  )}

                                  {/* Reschedule Button */}
                                  {b.status !== 'Completed' && (
                                    <button
                                      type="button"
                                      onClick={() => setRescheduleBookingTarget(b)}
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                                      title="Reschedule this appointment to another date"
                                    >
                                      <Calendar className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                                      <span>Reschedule</span>
                                    </button>
                                  )}

                                  {/* Chat on WhatsApp */}
                                  <a
                                    href={buildWhatsAppBookingUrl({
                                      serviceName: b.serviceTitle,
                                      packageName: b.packageName,
                                      providerName: b.providerName,
                                      bookingRef: b.reference,
                                      customerName: b.customerName,
                                      businessName: b.businessName,
                                    })}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-[#071322] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                    💡 Click on any calendar day above to inspect scheduled appointments, download tax invoices, reschedule dates, or initiate Quick Pay deposit fees.
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'wallet' ? (
            <WalletSection
              bookings={localBookings}
              onBookingPaid={(bookingId) => {
                setLocalBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paymentStatus: 'Paid', status: 'Confirmed' } : b));
              }}
              onOpenBookingInvoice={(b) => setActiveInvoiceBooking(b)}
            />
          ) : activeTab === 'documents' ? (
            <DocumentsSection
              documents={autoInvoices}
              bookings={localBookings}
              onOpenBookingInvoice={(b) => setActiveInvoiceBooking(b)}
            />
          ) : activeTab === 'timeline' ? (
            <ServiceProgressTimelineTab
              bookings={localBookings}
              onUpdateMilestones={handleUpdateBookingMilestones}
              onNewBookingClick={() => {
                onClose();
                onNewBookingClick();
              }}
            />
          ) : (
            <>
              {/* BUDGET THRESHOLD MONITOR (Prompt #9) */}
              <div className="bg-white dark:bg-[#0A1727] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isBudgetExceeded 
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-600 animate-bounce' 
                        : isNearBudget 
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' 
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#B7E532]'
                    }`}>
                      {isBudgetExceeded ? <AlertTriangle className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
                          Monthly Professional Services Budget
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isBudgetExceeded 
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' 
                            : isNearBudget 
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' 
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {isBudgetExceeded ? 'Threshold Breached' : isNearBudget ? 'Near Limit (85%+)' : 'Within Budget'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Current Month Spend: <strong className="text-slate-800 dark:text-slate-200">{formatAmount(totalSpentNGN)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{formatAmount(monthlyBudgetLimit)}</strong> limit ({Math.round(budgetRatio * 100)}% used)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('spending')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#1464C8] dark:text-[#B7E532] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-200 dark:border-blue-900"
                      title="Open Spending Insights monthly expenditure chart"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Spending Insights →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingBudget(!isEditingBudget);
                        setBudgetInputVal(String(monthlyBudgetLimit));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                      <span>{isEditingBudget ? 'Cancel' : 'Set Budget Limit'}</span>
                    </button>
                  </div>
                </div>

                {/* Spend Ratio Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBudgetExceeded 
                        ? 'bg-red-500 animate-pulse' 
                        : isNearBudget 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500 dark:bg-[#B7E532]'
                    }`}
                    style={{ width: `${Math.min(100, budgetRatio * 100)}%` }}
                  />
                </div>

                {/* Inline Budget Adjustment Form */}
                {isEditingBudget && (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const parsed = parseInt(budgetInputVal.replace(/[^\d]/g, ''), 10);
                      if (!isNaN(parsed) && parsed > 0) {
                        setMonthlyBudgetLimit(parsed);
                        localStorage.setItem('msmebooks_monthly_budget', String(parsed));
                        setIsEditingBudget(false);
                        setBudgetBreachAlertDismissed(false);
                      }
                    }}
                    className="p-3 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-300">Set Monthly Limit (NGN):</span>
                    <input
                      type="number"
                      min="50000"
                      step="25000"
                      value={budgetInputVal}
                      onChange={(e) => setBudgetInputVal(e.target.value)}
                      className="w-36 px-2.5 py-1.5 bg-white dark:bg-[#0A1727] border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-slate-800 dark:text-slate-100"
                    />
                    <div className="flex gap-1.5">
                      {[150000, 350000, 500000, 1000000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBudgetInputVal(String(preset))}
                          className="px-2 py-1 bg-white dark:bg-[#0A1727] hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          {formatAmount(preset)}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white rounded-lg font-bold cursor-pointer"
                    >
                      Save Limit
                    </button>
                  </form>
                )}

                {/* High Priority Budget Exceeded Alert Banner */}
                {isBudgetExceeded && !budgetBreachAlertDismissed && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>
                        <strong>Budget Alert:</strong> Total booking expenditure ({formatAmount(totalSpentNGN)}) exceeds your monthly limit of {formatAmount(monthlyBudgetLimit)}. UI notifications and audit alerts have been dispatched.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBudgetBreachAlertDismissed(true)}
                      className="text-red-500 hover:text-red-800 dark:hover:text-red-300 cursor-pointer font-bold shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              {/* MINI CALENDAR VIEW (Prompt #2) */}
              {viewFormat === 'calendar' && (
                <div className="bg-white dark:bg-[#0A1727] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  {/* Calendar Month Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-[#1464C8] dark:text-[#B7E532]" />
                      <h3 className="font-extrabold text-sm sm:text-base text-[#102B4E] dark:text-white">
                        {calendarGrid.monthLabel} Appointment Grid
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
                          setSelectedCalendarDate(null);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
                          setSelectedCalendarDate(null);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Labels */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  {/* Month Grid Cells */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Padding cells */}
                    {Array.from({ length: calendarGrid.firstDayIndex }).map((_, i) => (
                      <div key={`pad-${i}`} className="h-14 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-transparent"></div>
                    ))}

                    {/* Day Cells */}
                    {calendarGrid.days.map((d) => {
                      const hasAppointments = d.dayBookings.length > 0;
                      const isSelected = selectedCalendarDate === d.dateString;

                      return (
                        <div
                          key={d.dateString}
                          onClick={() => {
                            if (hasAppointments) {
                              setSelectedCalendarDate(isSelected ? null : d.dateString);
                            }
                          }}
                          className={`h-16 p-1.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50 dark:bg-blue-950/50 shadow-sm ring-2 ring-[#1464C8]/30'
                              : hasAppointments
                              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 hover:border-emerald-500'
                              : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-200 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${
                              isSelected 
                                ? 'text-[#1464C8] dark:text-[#B7E532] font-black' 
                                : hasAppointments 
                                ? 'text-emerald-800 dark:text-emerald-200 font-extrabold' 
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {d.dayNumber}
                            </span>
                            {hasAppointments && (
                              <span className="w-2 h-2 rounded-full bg-[#1464C8] dark:bg-[#B7E532] animate-pulse"></span>
                            )}
                          </div>

                          {hasAppointments && (
                            <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 truncate bg-white/80 dark:bg-slate-800/80 px-1 py-0.5 rounded">
                              {d.dayBookings.length} {d.dayBookings.length === 1 ? 'Booking' : 'Bookings'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Date Appointments Inspector */}
                  {selectedCalendarDate && (
                    <div className="mt-3 p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 animate-in fade-in space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[#1464C8] dark:text-[#B7E532]">
                          Appointments on {selectedCalendarDate}:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedCalendarDate(null)}
                          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <div className="divide-y divide-blue-200/60 dark:divide-blue-900/60 text-xs">
                        {bookings
                          .filter(b => b.appointmentDate === selectedCalendarDate)
                          .map(b => (
                            <div key={b.id} className="py-2 flex items-center justify-between gap-3">
                              <div>
                                <div className="font-extrabold text-[#102B4E] dark:text-white">
                                  {b.serviceTitle} ({b.packageName})
                                </div>
                                <div className="text-slate-500 dark:text-slate-400">
                                  {b.timeSlot} • Provider: {b.providerName} • Ref: {b.reference}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                {b.status === 'Completed' ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setActiveInvoiceBooking(b)}
                                      className="px-2.5 py-1 bg-[#102B4E] hover:bg-[#1464C8] text-white font-extrabold rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow-xs border border-white/10"
                                      title="Download clean printable tax invoice & receipt"
                                    >
                                      <Download className="w-3 h-3 text-[#B7E532]" />
                                      <span>Receipt</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setReviewModalBooking(b)}
                                      className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow-xs ring-1 ring-amber-400/40"
                                      title="Leave a review and star rating"
                                    >
                                      <Star className="w-3 h-3 fill-white text-white" />
                                      <span>{b.userRating ? `${b.userRating}★` : 'Review'}</span>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setActiveInvoiceBooking(b)}
                                    className="px-2.5 py-1 bg-[#102B4E] hover:bg-[#1464C8] text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
                                  >
                                    <FileText className="w-3 h-3 text-[#B7E532]" />
                                    <span>Invoice</span>
                                  </button>
                                )}
                                <CalendarSyncButton 
                                  booking={b} 
                                  label="Export"
                                  highlightConfirmed={b.status === 'Confirmed'}
                                  onExportSuccess={(msg) => {
                                    setCalendarToast(msg);
                                    setTimeout(() => setCalendarToast(null), 4000);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PWA Browser Push Notification & Booking Alerts Control Bar */}
              <div className="bg-white dark:bg-[#0A1727] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                {/* 1. Main 24-Hour Booking Alerts Toggle Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      bookingAlertsEnabled 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] ring-1 ring-[#1464C8]/30' 
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500'
                    }`}>
                      <AlarmClock className={`w-5 h-5 ${bookingAlertsEnabled ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-[#102B4E] dark:text-white uppercase tracking-wider">
                          Booking Alerts
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          bookingAlertsEnabled
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-[#B7E532] border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {bookingAlertsEnabled ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              24h Reminders Active
                            </>
                          ) : (
                            'Alerts Disabled'
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
                        Uses browser Push API & local notifications to remind you <strong>24 hours before</strong> your scheduled appointments so you have ample time to prepare documents or request rescheduling.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto shrink-0 justify-between sm:justify-end">
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#071322] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {bookingAlertsEnabled ? 'On' : 'Off'}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={bookingAlertsEnabled}
                        onClick={handleToggleBookingAlerts}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1464C8] focus:ring-offset-2 ${
                          bookingAlertsEnabled ? 'bg-[#1464C8]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={bookingAlertsEnabled ? 'Disable 24h booking alerts' : 'Enable 24h booking alerts'}
                      >
                        <span className="sr-only">Toggle Booking Alerts</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            bookingAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Test 24-Hour Alert Button */}
                    <button
                      type="button"
                      onClick={handleTest24HourAlert}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border border-white/10"
                      title="Simulate 24-hour appointment reminder push & local notification"
                    >
                      <AlarmClock className="w-3.5 h-3.5 text-[#B7E532]" />
                      <span>Test 24h Alert</span>
                    </button>
                  </div>
                </div>

                {/* 2. Secondary Push Radar Status & Test Triggers */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Bell className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                    <span>
                      Push Status: <strong className="text-slate-700 dark:text-slate-200">{notificationPerm === 'granted' ? 'Service Worker Push Enabled' : 'Click Toggle or Enable Below'}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
                    {notificationPerm !== 'granted' ? (
                      <button
                        onClick={handleEnableReminders}
                        className="w-full sm:w-auto px-3 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <BellRing className="w-3.5 h-3.5 text-[#B7E532]" />
                        <span>Enable Browser Push</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleTestBookingAcceptedAlert}
                          className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                          title="Simulate push alert when firm accepts booking"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-[#B7E532]" />
                          <span>Firm Accept Alert</span>
                        </button>

                        <button
                          onClick={handleTestBookingStatusAlert}
                          className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1464C8] dark:text-blue-300 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-blue-200 dark:border-blue-800"
                          title="Simulate push alert when firm updates milestone status"
                        >
                          <Sparkles className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
                          <span>Status Update Alert</span>
                        </button>

                        <button
                          onClick={handleTestReminder}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                          title="Test 1-hour consultation reminder"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>1-Hr Alert</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Toast Notification Alert */}
              {shareToast && (
                <div className="bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[#1464C8] dark:text-[#B7E532] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                    <span>{shareToast}</span>
                  </div>
                  <button onClick={() => setShareToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {reminderToast && (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                    <span>{reminderToast}</span>
                  </div>
                  <button onClick={() => setReminderToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {rescheduleToast && (
                <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-[#B7E532] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                    <span>{rescheduleToast}</span>
                  </div>
                  <button onClick={() => setRescheduleToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {calendarToast && (
                <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-[#B7E532] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] shrink-0" />
                    <span>{calendarToast}</span>
                  </div>
                  <button onClick={() => setCalendarToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {/* Loyalty Points Tracker Mini-Banner */}
              <div className="bg-gradient-to-r from-blue-900/10 via-amber-500/10 to-emerald-500/10 dark:from-blue-950/40 dark:via-amber-950/20 dark:to-emerald-950/30 p-3.5 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#102B4E] dark:bg-[#1464C8] text-[#B7E532] flex items-center justify-center shrink-0 shadow-xs">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#102B4E] dark:text-white">
                        {pointsData.balance.toLocaleString()} MsmePoints
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        {currentTier} Tier
                      </span>
                      {unclaimedCompletedBookings.length > 0 && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 animate-pulse">
                          +{unclaimedCompletedBookings.length * 200} pts ready to claim
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Earn <strong className="text-emerald-600 dark:text-[#B7E532]">+200 points</strong> when each booking is completed. Redeem for up to ₦30,000 voucher discounts.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('rewards')}
                  className="px-3 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-[#B7E532]" />
                  <span>View Points Chart & Rewards</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* SUB-FILTER BUTTONS (Upcoming, Pending, Completed, All) */}
              <div className="bg-white dark:bg-[#0A1727] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                    Filter View:
                  </span>
                  {[
                    { id: 'all', label: `All Bookings (${localBookings.length})`, color: 'bg-[#102B4E] dark:bg-[#1464C8]' },
                    { id: 'upcoming', label: `Confirmed (${localBookings.filter(b => b.status === 'Confirmed').length})`, color: 'bg-emerald-600' },
                    { id: 'in-progress', label: `In Progress (${localBookings.filter(b => b.status === 'In Progress' || getEffectiveStage(b) === 'Work in Progress').length})`, color: 'bg-purple-600' },
                    { id: 'pending', label: `Pending (${localBookings.filter(b => b.status === 'Pending Review' || b.paymentStatus === 'Pending Payment' || b.paymentStatus === 'Quote Requested').length})`, color: 'bg-amber-600' },
                    { id: 'completed', label: `Completed (${localBookings.filter(b => b.status === 'Completed').length})`, color: 'bg-blue-600' },
                  ].map(btn => {
                    const isSelected = bookingStatusFilter === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setBookingStatusFilter(btn.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? `${btn.color} text-white shadow-xs ring-2 ring-blue-400/20`
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  Showing {
                    localBookings.filter(b => {
                      if (activeTab === 'past') return b.status === 'Completed';
                      if (bookingStatusFilter === 'upcoming') return b.status === 'Confirmed';
                      if (bookingStatusFilter === 'in-progress') return b.status === 'In Progress' || getEffectiveStage(b) === 'Work in Progress';
                      if (bookingStatusFilter === 'pending') return b.status === 'Pending Review' || b.paymentStatus === 'Pending Payment' || b.paymentStatus === 'Quote Requested';
                      if (bookingStatusFilter === 'completed') return b.status === 'Completed';
                      return true;
                    }).length
                  } records
                </span>
              </div>

              {(() => {
                const baseBookings = activeTab === 'past' 
                  ? localBookings.filter(b => b.status === 'Completed') 
                  : localBookings;

                const displayedBookings = baseBookings.filter(b => {
                  if (bookingStatusFilter === 'upcoming') return b.status === 'Confirmed';
                  if (bookingStatusFilter === 'in-progress') return b.status === 'In Progress' || getEffectiveStage(b) === 'Work in Progress';
                  if (bookingStatusFilter === 'pending') return b.status === 'Pending Review' || b.paymentStatus === 'Pending Payment' || b.paymentStatus === 'Quote Requested';
                  if (bookingStatusFilter === 'completed') return b.status === 'Completed';
                  return true;
                });

            if (displayedBookings.length === 0) {
              return (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#102B4E] dark:text-slate-100">
                    {activeTab === 'past' ? 'No completed engagements yet' : 'No active appointments found'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {activeTab === 'past' 
                      ? 'Completed consulting, audit, and implementation engagements will appear here.'
                      : 'You do not have any pending appointments. Browse our catalogue to schedule services.'}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNewBookingClick();
                    }}
                    className="mt-4 px-5 py-2 bg-[#1464C8] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Browse Services Catalogue
                  </button>
                </div>
              );
            }

            return displayedBookings.map((booking) => {
              const isPending = 
                booking.status === 'Pending Review' || 
                (booking.status as string) === 'Pending' || 
                booking.paymentStatus === 'Pending Payment' ||
                booking.paymentStatus === 'Quote Requested';

              const effectiveStage = getEffectiveStage(booking);

              return (
                <div
                  key={booking.id}
                  className={`bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 ${getPrimaryStatusColorBorder(booking, effectiveStage)} shadow-xs p-5 hover:shadow-md transition-shadow space-y-4`}
                >
                  {/* Top Bar: Ref, Status Badges, Price & Share */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#1464C8] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-md">
                        {booking.reference}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <BookingStatusBadges
                        booking={booking}
                        effectiveStage={effectiveStage}
                      />
                      {checkedInRecords[booking.id] && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532] border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-[#B7E532]" />
                          <span>Checked In</span>
                        </span>
                      )}
                      {booking.status === 'Completed' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 shadow-2xs">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span>+{booking.pointsEarned || 200} Pts</span>
                        </span>
                      )}
                      <span className="font-extrabold text-sm text-[#102B4E] dark:text-[#B7E532]">
                        {formatPriceString(booking.packagePrice)}
                      </span>

                      {/* Header Share Icon Button */}
                      <button
                        type="button"
                        onClick={() => handleShareBooking(booking)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#1464C8] dark:hover:text-[#B7E532] bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                        title="Share booking details via Web Share API or copy link"
                        aria-label="Share Booking"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block font-semibold mb-0.5">Service & Package:</span>
                      <div className="font-black text-[#102B4E] dark:text-slate-100 text-sm">{booking.serviceTitle}</div>
                      <div className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">{booking.packageName}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block font-semibold mb-0.5">Assigned Provider:</span>
                      <div className="font-bold text-[#102B4E] dark:text-slate-100 flex items-center gap-1">
                        <span>{booking.providerName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#B7E532]" />
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5">{booking.providerType}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block font-semibold mb-0.5">Appointment Schedule:</span>
                      <div className="font-bold text-[#102B4E] dark:text-slate-100 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                        <span>{booking.appointmentDate}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">{booking.timeSlot} ({booking.consultationMode})</div>
                    </div>
                  </div>

                  {/* VISUAL PROGRESS TIMELINE (Prompt #7) */}
                  {(() => {
                    const effectiveStage = getEffectiveStage(booking);
                    const stageOrder: ('Booked' | 'Consultation' | 'Work in Progress' | 'Completed')[] = [
                      'Booked',
                      'Consultation',
                      'Work in Progress',
                      'Completed'
                    ];
                    const currentIdx = stageOrder.indexOf(effectiveStage);

                    return (
                      <div className="bg-slate-50 dark:bg-[#071322] p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                            <span>Service Lifecycle Status:</span>
                            <span className="text-[#102B4E] dark:text-white font-black bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {effectiveStage}
                            </span>
                          </span>

                          {effectiveStage !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStage(booking.id)}
                              className="px-2.5 py-1 rounded-md bg-[#1464C8] hover:bg-[#1052a5] text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Advance engagement to next lifecycle stage"
                            >
                              <span>Next Milestone</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Interactive Stepper Bar */}
                        <div className="grid grid-cols-4 gap-2 relative pt-1">
                          {[
                            { id: 'Booked', label: '1. Booked', desc: 'Scope Confirmed' },
                            { id: 'Consultation', label: '2. Consultation', desc: 'Intake Discovery' },
                            { id: 'Work in Progress', label: '3. In Progress', desc: 'Active Execution' },
                            { id: 'Completed', label: '4. Completed', desc: 'Sign-off Delivered' },
                          ].map((st, sIdx) => {
                            const isDone = sIdx < currentIdx;
                            const isCurrent = sIdx === currentIdx;

                            return (
                              <div key={st.id} className="text-center relative">
                                {/* Connecting line */}
                                {sIdx < 3 && (
                                  <div className={`absolute top-3 left-1/2 w-full h-1 -z-0 transition-colors ${
                                    sIdx < currentIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                  }`} />
                                )}

                                {/* Step node circle */}
                                <div className={`w-6 h-6 rounded-full mx-auto relative z-10 flex items-center justify-center text-[10px] font-black transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : isCurrent
                                    ? 'bg-[#1464C8] text-white ring-4 ring-blue-100 dark:ring-blue-900/60 animate-pulse'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                }`}>
                                  {isDone ? '✓' : sIdx + 1}
                                </div>

                                <div className="mt-1.5">
                                  <span className={`text-[11px] font-extrabold block leading-tight ${
                                    isCurrent ? 'text-[#1464C8] dark:text-[#B7E532]' : isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                                  }`}>
                                    {st.label}
                                  </span>
                                  <span className="text-[9px] text-slate-400 hidden sm:block">
                                    {st.desc}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Multi-Phase Milestone Progress Bar (Prompt Requirement) */}
                  <MilestoneProgressBar
                    booking={booking}
                    interactive={true}
                    onUpdateMilestones={handleUpdateBookingMilestones}
                  />

                  {/* Visual Vertical Service Progress Timeline for Long-Term Engagements */}
                  {isLongTermEngagement(booking) && (
                    <ServiceProgressTimeline
                      booking={booking}
                      onUpdateMilestones={handleUpdateBookingMilestones}
                      defaultExpanded={booking.status === 'In Progress'}
                      compactHeader={true}
                    />
                  )}

                  {/* Task Checklist for In Progress Bookings */}
                  {(booking.status === 'In Progress' || effectiveStage === 'Work in Progress') && (
                    <BookingTaskChecklist
                      booking={booking}
                      onUpdateChecklist={handleUpdateDeliverableChecklist}
                    />
                  )}

                  {/* Pending Request Schedule Note */}
                  {isPending && (
                    <div className="flex items-center gap-2 p-2.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>
                        <strong>Pending Confirmation:</strong> Need to change your scheduled date? Use the <strong>Reschedule</strong> button below to choose a new appointment date without canceling your request.
                      </span>
                    </div>
                  )}

                  {/* Requirements / Notes */}
                  {booking.requirements && (
                    <div className="p-3 bg-slate-50 dark:bg-[#071322] rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      <strong>Client Requirements:</strong> {booking.requirements}
                    </div>
                  )}

                  {/* Interactive Star-Rating Input & Client Feedback Review Section for Completed Services */}
                  {booking.status === 'Completed' && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-amber-50/50 dark:from-amber-950/20 dark:via-[#0E1F35] dark:to-amber-950/30 border border-amber-200/90 dark:border-amber-900/60 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-400 dark:bg-amber-500 text-[#102B4E] flex items-center justify-center font-black shadow-xs shrink-0">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                              Verified Client Experience Review
                            </span>
                            <h4 className="text-xs sm:text-sm font-black text-[#102B4E] dark:text-white leading-tight">
                              Rate Your Experience with {booking.providerName}
                            </h4>
                          </div>
                        </div>

                        {/* Interactive Star-Rating Input */}
                        <div className="flex items-center gap-1 bg-white dark:bg-[#0A1727] px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/80 shadow-2xs self-start sm:self-auto">
                          {[1, 2, 3, 4, 5].map((starVal) => {
                            const activeRating = hoveredStar[booking.id] || booking.userRating || 0;
                            const isFilled = starVal <= activeRating;

                            return (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => handleQuickStarRating(booking, starVal)}
                                onMouseEnter={() => setHoveredStar(prev => ({ ...prev, [booking.id]: starVal }))}
                                onMouseLeave={() => setHoveredStar(prev => ({ ...prev, [booking.id]: 0 }))}
                                className="p-1 rounded-md hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                                title={`Award ${starVal} out of 5 stars for ${booking.providerName}`}
                                aria-label={`Rate ${starVal} star out of 5`}
                              >
                                <Star
                                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                                    isFilled
                                      ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                      : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                                  }`}
                                />
                              </button>
                            );
                          })}
                          <span className="text-[11px] font-black text-amber-900 dark:text-amber-200 ml-1.5 min-w-[70px]">
                            {(() => {
                              const r = hoveredStar[booking.id] || booking.userRating;
                              if (!r) return 'Click to rate';
                              if (r === 5) return '5.0 ★ Exceptional';
                              if (r === 4) return '4.0 ★ Very Good';
                              if (r === 3) return '3.0 ★ Good';
                              if (r === 2) return '2.0 ★ Fair';
                              return '1.0 ★ Needs Work';
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Display Existing Client Feedback or Edit Form */}
                      {(booking.feedback || booking.userReviewText) && editingFeedbackBookingId !== booking.id ? (
                        <div className="bg-white/80 dark:bg-[#060F1A]/80 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Your Submitted Feedback:
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed">
                              "{booking.feedback || booking.userReviewText}"
                            </p>
                            {booking.userReviewTags && booking.userReviewTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {booking.userReviewTags.map((tag, tIdx) => (
                                  <span key={tIdx} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                    ✓ {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFeedbackBookingId(booking.id);
                                setInlineFeedbackText(prev => ({
                                  ...prev,
                                  [booking.id]: booking.feedback || booking.userReviewText || ''
                                }));
                              }}
                              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/70 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="Edit feedback text"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Feedback</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewModalBooking(booking)}
                              className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] text-xs font-bold transition-colors cursor-pointer"
                              title="Open full review dialog"
                            >
                              Full Modal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                              <span>Client Feedback for {booking.providerName}:</span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (Stored on verified firm profile)
                            </span>
                          </div>

                          <textarea
                            rows={2}
                            value={inlineFeedbackText[booking.id] ?? (booking.feedback || booking.userReviewText || '')}
                            onChange={(e) => setInlineFeedbackText(prev => ({ ...prev, [booking.id]: e.target.value }))}
                            placeholder={`Describe your experience working with ${booking.providerName}. Was their delivery punctual, ICAN/ACCA compliant, and professional?`}
                            className="w-full text-xs p-3 bg-white dark:bg-[#060F1A] border border-amber-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#B7E532] outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-2xs"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveInlineFeedback(
                                  booking,
                                  booking.userRating || 5,
                                  inlineFeedbackText[booking.id] ?? (booking.feedback || booking.userReviewText || '')
                                )}
                                className="px-3.5 py-1.5 bg-[#102B4E] hover:bg-[#1464C8] text-white text-xs font-black rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E532]" />
                                <span>Save Feedback</span>
                              </button>

                              {editingFeedbackBookingId === booking.id && (booking.feedback || booking.userReviewText) && (
                                <button
                                  type="button"
                                  onClick={() => setEditingFeedbackBookingId(null)}
                                  className="px-2.5 py-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => setReviewModalBooking(booking)}
                              className="text-xs text-[#1464C8] dark:text-[#B7E532] font-black hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span>Open Review Modal (Add Tags & Badges)</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Generate Official Invoice or Download PDF Receipt */}
                      {booking.status === 'Completed' ? (
                        <button
                          type="button"
                          onClick={() => setActiveInvoiceBooking(booking)}
                          className="px-3.5 py-1.5 bg-[#102B4E] hover:bg-[#1464C8] text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-white/10 ring-1 ring-[#B7E532]/30"
                          title="Download clean printable tax invoice & receipt document"
                        >
                          <Download className="w-3.5 h-3.5 text-[#B7E532]" />
                          <span>Download PDF Receipt</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveInvoiceBooking(booking)}
                          className="px-3.5 py-1.5 bg-[#102B4E] hover:bg-[#1464C8] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          title="Generate official printable tax invoice & receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#B7E532]" />
                          <span>Invoice / Receipt</span>
                        </button>
                      )}

                      {/* Export to Calendar (.ics download & Google/Outlook calendar integration) */}
                      <CalendarSyncButton 
                        booking={booking} 
                        label="Export to Calendar"
                        highlightConfirmed={booking.status === 'Confirmed'}
                        onExportSuccess={(msg) => {
                          setCalendarToast(msg);
                          setTimeout(() => setCalendarToast(null), 4000);
                        }}
                      />

                      {/* Generate Check-in QR Code for Upcoming Booking Attendance Verification */}
                      {booking.status !== 'Completed' && (
                        <button
                          type="button"
                          onClick={() => setCheckInQrBooking(booking)}
                          className={`px-3.5 py-1.5 font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
                            checkedInRecords[booking.id]
                              ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-[#B7E532] border-emerald-300 dark:border-emerald-800'
                              : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800'
                          }`}
                          title="Display QR code for the service provider to scan and verify attendance upon arrival"
                        >
                          <QrCode className="w-3.5 h-3.5 text-indigo-600 dark:text-[#B7E532]" />
                          <span>{checkedInRecords[booking.id] ? 'Check-in QR (Verified)' : 'Generate Check-in QR'}</span>
                        </button>
                      )}

                      {/* Leave a Review & Star-Rating for Completed Bookings */}
                      {booking.status === 'Completed' && (
                        booking.userRating ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                            <span>Rated {booking.userRating}.0 ★</span>
                            <button
                              type="button"
                              onClick={() => setReviewModalBooking(booking)}
                              className="text-[#1464C8] dark:text-[#B7E532] underline ml-1 cursor-pointer text-[11px] font-black"
                              title="Update review and star rating feedback"
                            >
                              Edit Review
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setReviewModalBooking(booking)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ring-1 ring-amber-400/40"
                            title="Rate service provider and leave verified customer feedback"
                          >
                            <Star className="w-3.5 h-3.5 fill-white text-white" />
                            <span>Leave a Review</span>
                          </button>
                        )
                      )}

                      {/* Reschedule Button */}
                      {booking.status !== 'Completed' && (
                        <button
                          type="button"
                          onClick={() => setRescheduleBookingTarget(booking)}
                          className={`px-3.5 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isPending
                              ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-xs ring-1 ring-amber-300/50'
                              : 'bg-blue-50/60 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          }`}
                          title="Reschedule service appointment date without canceling request"
                          aria-label={`Reschedule booking ${booking.reference}`}
                        >
                          <Calendar className={`w-3.5 h-3.5 ${isPending ? 'text-amber-600 dark:text-amber-400' : 'text-[#1464C8] dark:text-blue-300'}`} />
                          <span>Reschedule</span>
                          {isPending && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          )}
                        </button>
                      )}

                      {/* 1-Click Wallet Pay & Deposit Fee Button for pending bookings */}
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => handle1ClickWalletPay(booking)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs ring-1 ring-emerald-400/40 cursor-pointer"
                            title="1-Click instant payment using pre-loaded MsmeBooks Wallet credits"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#B7E532] fill-[#B7E532]" />
                            <span>1-Click Wallet Pay</span>
                          </button>
                          <a
                            href={buildWhatsAppBookingUrl({
                              serviceName: booking.serviceTitle,
                              packageName: booking.packageName,
                              providerName: booking.providerName,
                              bookingRef: booking.reference,
                              customerName: booking.customerName,
                              businessName: booking.businessName,
                              billingOption: 'Initial Deposit / Quick Fee Settlement',
                              estimatedFee: booking.packagePrice,
                              requirements: `Requesting instant secure payment link to deposit/settle fees for pending booking ref: ${booking.reference}.`,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-[#1464C8] dark:text-blue-300 font-bold text-xs rounded-lg flex items-center gap-1 transition-all border border-blue-200 dark:border-blue-800 cursor-pointer"
                            title="Initiate quick deposit payment or request instant payment link via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Deposit</span>
                          </a>
                        </>
                      )}

                      {/* Loyalty Points Completion / Claimed Badge */}
                      {booking.status === 'Completed' ? (
                        <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>+{booking.pointsEarned || 200} Pts Earned</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleManualCompleteBooking(booking.id)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          title="Mark engagement fulfilled to immediately receive +200 MsmePoints"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E532]" />
                          <span>Complete (+200 Pts)</span>
                        </button>
                      )}

                      {/* WhatsApp Handover */}
                      <a
                        href={buildWhatsAppBookingUrl({
                          serviceName: booking.serviceTitle,
                          packageName: booking.packageName,
                          providerName: booking.providerName,
                          bookingRef: booking.reference,
                          customerName: booking.customerName,
                          businessName: booking.businessName,
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      {/* Share Booking Action Button */}
                      <button
                        type="button"
                        onClick={() => handleShareBooking(booking)}
                        className={`px-3.5 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border ${
                          copiedBookingId === booking.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#1464C8] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        }`}
                        title="Share booking details and MsmeBooks service link via Web Share API or copy to clipboard"
                        aria-label="Share appointment"
                      >
                        {copiedBookingId === booking.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
                            <span>Details Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-blue-300" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Cancel / Reschedule Option */}
                    {confirmCancelId === booking.id ? (
                      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-1 rounded-xl text-xs">
                        <span className="text-red-700 dark:text-red-300 font-bold">Confirm cancel?</span>
                        <button
                          onClick={() => {
                            onCancelBooking(booking.id);
                            setConfirmCancelId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold cursor-pointer text-[11px]"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium cursor-pointer text-[11px]"
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancelId(booking.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                        title="Cancel appointment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </>
      )}
    </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#07111D] px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Need urgent rescheduling? Contact WhatsApp concierge on +234 915 848 2622</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>

      {/* Simplified Mini-Calendar Reschedule Modal */}
      <RescheduleModal
        isOpen={!!rescheduleBookingTarget}
        onClose={() => setRescheduleBookingTarget(null)}
        booking={rescheduleBookingTarget}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* Official Tax Invoice & Slip Generator Modal (Prompt #5) */}
      {activeInvoiceBooking && (
        <BookingInvoiceModal
          isOpen={!!activeInvoiceBooking}
          onClose={() => setActiveInvoiceBooking(null)}
          booking={activeInvoiceBooking}
        />
      )}

      {/* Verified Client Review & Rating Modal */}
      {reviewModalBooking && (
        <BookingReviewModal
          isOpen={!!reviewModalBooking}
          onClose={() => setReviewModalBooking(null)}
          booking={reviewModalBooking}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Attendance Verification Check-in QR Pass Modal */}
      <CheckInQrModal
        isOpen={!!checkInQrBooking}
        onClose={() => setCheckInQrBooking(null)}
        booking={checkInQrBooking}
        checkedInAt={checkInQrBooking ? checkedInRecords[checkInQrBooking.id] : null}
        onMarkCheckedIn={handleMarkBookingCheckedIn}
      />
    </div>
  );
};
