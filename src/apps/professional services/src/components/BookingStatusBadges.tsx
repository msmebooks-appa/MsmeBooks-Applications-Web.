import React from 'react';
import { 
  CheckCircle2, 
  Activity, 
  CreditCard, 
  UserCheck, 
  CalendarCheck, 
  Clock, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { BookingRecord } from '../types/booking';

interface BookingStatusBadgesProps {
  booking: BookingRecord;
  size?: 'default' | 'compact' | 'mini';
  effectiveStage?: 'Booked' | 'Consultation' | 'Work in Progress' | 'Completed';
  className?: string;
}

export function getPrimaryStatusColorBorder(
  booking: BookingRecord, 
  effectiveStage?: 'Booked' | 'Consultation' | 'Work in Progress' | 'Completed'
): string {
  const isCompleted = booking.status === 'Completed' || effectiveStage === 'Completed' || booking.milestoneProgressPercent === 100;
  if (isCompleted) {
    return 'border-l-4 border-l-blue-500 dark:border-l-blue-400';
  }

  const isAwaitingPayment = 
    booking.paymentStatus === 'Pending Payment' || 
    booking.paymentStatus === 'Quote Requested' ||
    (booking.status !== 'Completed' && booking.paymentStatus !== 'Paid');
  if (isAwaitingPayment) {
    return 'border-l-4 border-l-amber-500 dark:border-l-amber-400';
  }

  const isInProgress = 
    booking.status === 'In Progress' || 
    effectiveStage === 'Work in Progress' || 
    (booking.milestoneProgressPercent != null && booking.milestoneProgressPercent > 0 && booking.milestoneProgressPercent < 100);
  if (isInProgress) {
    return 'border-l-4 border-l-purple-500 dark:border-l-purple-400';
  }

  if (booking.status === 'Confirmed') {
    return 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400';
  }

  return 'border-l-4 border-l-amber-400 dark:border-l-amber-500';
}

export const BookingStatusBadges: React.FC<BookingStatusBadgesProps> = ({
  booking,
  size = 'default',
  effectiveStage,
  className = ''
}) => {
  const isCompact = size === 'compact';
  const isMini = size === 'mini';

  const isCompleted = 
    booking.status === 'Completed' || 
    effectiveStage === 'Completed' || 
    booking.milestoneProgressPercent === 100;

  const isInProgress = 
    !isCompleted && (
      booking.status === 'In Progress' || 
      effectiveStage === 'Work in Progress' || 
      (booking.milestoneProgressPercent != null && booking.milestoneProgressPercent > 0 && booking.milestoneProgressPercent < 100)
    );

  const isAwaitingPayment = 
    booking.paymentStatus === 'Pending Payment' || 
    booking.paymentStatus === 'Quote Requested' ||
    (!isCompleted && booking.paymentStatus !== 'Paid');

  const isPaid = booking.paymentStatus === 'Paid';
  const hasExpertAssigned = Boolean(booking.providerName && booking.providerName.trim() !== '');

  const badgeSizeClasses = isCompact
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  const iconSizeClasses = isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const dotSizeClasses = isCompact ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* 1. PRIMARY OPERATIONAL STATUS BADGE */}
      {isCompleted ? (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs ${badgeSizeClasses}`}
          title="Service engagement concluded & sign-off archived"
        >
          {/* Status-specific color indicator dot */}
          <span className={`inline-flex rounded-full ${dotSizeClasses} bg-blue-500 mr-0.5 shrink-0 shadow-xs ring-2 ring-blue-200 dark:ring-blue-900`} />
          <CheckCircle2 className={`${iconSizeClasses} text-blue-600 dark:text-blue-400 shrink-0`} />
          <span>Completed</span>
        </span>
      ) : isInProgress ? (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs ${badgeSizeClasses}`}
          title="Active execution & milestone progress in flight"
        >
          {/* Status-specific color indicator: pulsing purple dot */}
          <span className={`relative flex ${dotSizeClasses} mr-0.5 shrink-0`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className={`relative inline-flex rounded-full ${dotSizeClasses} bg-purple-600 dark:bg-purple-400`} />
          </span>
          <Activity className={`${iconSizeClasses} text-purple-600 dark:text-purple-400 shrink-0`} />
          <span>In Progress</span>
        </span>
      ) : booking.status === 'Confirmed' ? (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs ${badgeSizeClasses}`}
          title="Appointment locked on provider schedule"
        >
          {/* Status-specific color indicator: solid emerald dot */}
          <span className={`inline-flex rounded-full ${dotSizeClasses} bg-emerald-500 mr-0.5 shrink-0 shadow-xs ring-2 ring-emerald-200 dark:ring-emerald-900`} />
          <CalendarCheck className={`${iconSizeClasses} text-emerald-600 dark:text-emerald-400 shrink-0`} />
          <span>Confirmed</span>
        </span>
      ) : (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs ${badgeSizeClasses}`}
          title="Request submitted, awaiting intake confirmation"
        >
          {/* Status-specific color indicator: pulsing amber dot */}
          <span className={`relative flex ${dotSizeClasses} mr-0.5 shrink-0`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className={`relative inline-flex rounded-full ${dotSizeClasses} bg-amber-500`} />
          </span>
          <Clock className={`${iconSizeClasses} text-amber-600 dark:text-amber-400 shrink-0`} />
          <span>Pending Review</span>
        </span>
      )}

      {/* 2. PAYMENT STATUS BADGE (e.g. 'Awaiting Payment' or 'Paid') */}
      {!isMini && isAwaitingPayment && (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shadow-2xs ${badgeSizeClasses}`}
          title="Invoice pending payment clearance or 1-click wallet settlement"
        >
          {/* Status-specific color indicator: pulsing amber/orange alert dot */}
          <span className={`relative flex ${dotSizeClasses} mr-0.5 shrink-0`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className={`relative inline-flex rounded-full ${dotSizeClasses} bg-amber-500`} />
          </span>
          <CreditCard className={`${iconSizeClasses} text-amber-600 dark:text-amber-400 shrink-0`} />
          <span>Awaiting Payment</span>
        </span>
      )}

      {!isMini && !isAwaitingPayment && isPaid && !isCompleted && (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 ${badgeSizeClasses}`}
          title="Fees reconciled via verified payment channel"
        >
          <span className={`inline-flex rounded-full ${dotSizeClasses} bg-emerald-500 mr-0.5 shrink-0`} />
          <CheckCircle2 className={`${iconSizeClasses} text-emerald-600 dark:text-emerald-400 shrink-0`} />
          <span>Paid</span>
        </span>
      )}

      {/* 3. EXPERT ASSIGNED BADGE (e.g. 'Expert Assigned') */}
      {!isMini && hasExpertAssigned && (
        <span 
          className={`rounded-full font-bold inline-flex items-center bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-2xs ${badgeSizeClasses}`}
          title={`Assigned Provider: ${booking.providerName} (${booking.providerType || 'Verified Partner'})`}
        >
          {/* Status-specific color indicator: teal dot with soft ring */}
          <span className={`inline-flex rounded-full ${dotSizeClasses} bg-teal-500 mr-0.5 shrink-0 ring-2 ring-teal-200 dark:ring-teal-900/60`} />
          <UserCheck className={`${iconSizeClasses} text-teal-600 dark:text-[#B7E532] shrink-0`} />
          <span className="truncate max-w-[140px] sm:max-w-none">
            Expert Assigned
          </span>
        </span>
      )}
    </div>
  );
};
