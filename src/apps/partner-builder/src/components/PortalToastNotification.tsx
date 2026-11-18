import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  DollarSign, 
  UserCheck, 
  TrendingUp, 
  CheckCircle, 
  X, 
  ArrowRight, 
  ExternalLink, 
  Sparkles,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'lead_assignment' | 'commission_payout' | 'tier_upgrade' | 'client_renewal';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  description: string;
  timestamp: string;
  amount?: string;
  clientName?: string;
  location?: string;
  targetTab?: 'overview' | 'referrals' | 'analytics' | 'commissions' | 'payouts';
  actionLabel?: string;
  durationMs?: number;
}

interface PortalToastNotificationProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const PortalToastNotification: React.FC<PortalToastNotificationProps> = ({
  toasts,
  onDismiss,
  onNavigateTab,
  soundEnabled = true,
  onToggleSound
}) => {
  return (
    <div 
      aria-live="polite" 
      aria-label="Partner Portal live notifications"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onNavigateTab={onNavigateTab}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss, onNavigateTab }) => {
  const duration = toast.durationMs || 6500;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'lead_assignment':
        return <UserCheck className="w-5 h-5 text-blue-600 dark:text-[#8CE600]" />;
      case 'commission_payout':
        return <DollarSign className="w-5 h-5 text-emerald-600 dark:text-[#8CE600]" />;
      case 'tier_upgrade':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'client_renewal':
        return <TrendingUp className="w-5 h-5 text-sky-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'lead_assignment':
        return 'border-blue-400 dark:border-[#8CE600]/80 shadow-blue-500/10';
      case 'commission_payout':
        return 'border-emerald-500 dark:border-emerald-400 shadow-emerald-500/10';
      case 'tier_upgrade':
        return 'border-amber-400 dark:border-amber-400 shadow-amber-500/10';
      default:
        return 'border-blue-300 dark:border-blue-700 shadow-blue-500/10';
    }
  };

  const getBadgeStyle = () => {
    switch (toast.type) {
      case 'lead_assignment':
        return 'bg-blue-100 text-[#0A3981] dark:bg-blue-950 dark:text-[#8CE600] border-blue-200 dark:border-blue-800';
      case 'commission_payout':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-[#8CE600] border-emerald-200 dark:border-emerald-800';
      case 'tier_upgrade':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-blue-900/60 dark:text-slate-200';
    }
  };

  const getCategoryLabel = () => {
    switch (toast.type) {
      case 'lead_assignment':
        return '🎯 Inbound Lead Assigned';
      case 'commission_payout':
        return '💰 Commission Disbursed';
      case 'tier_upgrade':
        return '⭐ Tier Milestone';
      case 'client_renewal':
        return '🔄 Recurring Renewal';
      default:
        return 'Notification';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto w-full bg-white/95 dark:bg-[#072457]/95 backdrop-blur-md rounded-2xl border-2 ${getBorderColor()} shadow-2xl overflow-hidden p-4 relative group transition-colors`}
    >
      {/* Top Banner & Category */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
          {getCategoryLabel()}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-mono">
            {toast.timestamp}
          </span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/60 cursor-pointer transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Toast Content */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#061F4A] flex items-center justify-center shrink-0 border border-slate-200 dark:border-blue-800 shadow-inner">
          {getIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {toast.title}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-blue-100/80 mt-0.5 leading-snug">
            {toast.description}
          </p>

          {/* Optional Meta Tags */}
          {(toast.clientName || toast.amount || toast.location) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {toast.amount && (
                <span className="text-[11px] font-black text-emerald-600 dark:text-[#8CE600] font-mono bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                  {toast.amount}
                </span>
              )}
              {toast.clientName && (
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                  {toast.clientName}
                </span>
              )}
              {toast.location && (
                <span className="text-[10px] text-slate-400 dark:text-slate-400">
                  📍 {toast.location}
                </span>
              )}
            </div>
          )}

          {/* Action Button */}
          {toast.targetTab && onNavigateTab && (
            <button
              onClick={() => {
                onNavigateTab(toast.targetTab!);
                onDismiss(toast.id);
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline cursor-pointer group/btn"
            >
              <span>{toast.actionLabel || 'View in Portal'}</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Auto-Dismiss Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-blue-950/60">
        <div
          className="h-full bg-gradient-to-r from-[#0A3981] to-[#8CE600] transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
