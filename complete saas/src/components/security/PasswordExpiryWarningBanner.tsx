import React from 'react';
import {
  AlertTriangle,
  Clock,
  KeyRound,
  X,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface PasswordExpiryWarningBannerProps {
  daysUntilExpiry: number;
  expiryIntervalDays: number;
  onUpdatePassword: () => void;
  onNavigateToResetFlow?: () => void;
  onDismiss: () => void;
  onSimulateDays?: (days: number) => void;
  companyName?: string;
}

export const PasswordExpiryWarningBanner: React.FC<PasswordExpiryWarningBannerProps> = ({
  daysUntilExpiry,
  expiryIntervalDays,
  onUpdatePassword,
  onNavigateToResetFlow,
  onDismiss,
  onSimulateDays,
  companyName = 'ABC Supermarket Ltd',
}) => {
  // Determine severity tier based on remaining days (within 30 days)
  const isCritical = daysUntilExpiry <= 3;
  const isUrgent = daysUntilExpiry > 3 && daysUntilExpiry <= 10;
  const isApproaching = daysUntilExpiry > 10 && daysUntilExpiry <= 30;

  const handleDirectReset = () => {
    if (onNavigateToResetFlow) {
      onNavigateToResetFlow();
    } else {
      onUpdatePassword();
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      id="password-expiry-warning-banner"
      className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm ${
        isCritical
          ? 'bg-rose-50/95 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/70'
          : isUrgent
          ? 'bg-amber-50/95 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/70'
          : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-900/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Alert Icon & Message */}
        <div className="flex items-start gap-3.5 flex-1 text-left">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isCritical
                ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                : isUrgent
                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                : 'bg-amber-100/90 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-sm font-bold ${
                  isCritical
                    ? 'text-rose-900 dark:text-rose-200'
                    : 'text-amber-950 dark:text-amber-200'
                }`}
              >
                Password Expiry Warning
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                  isCritical
                    ? 'bg-rose-600 text-white'
                    : isUrgent
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-200/90 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span className="tabular-nums">
                  {daysUntilExpiry === 1
                    ? 'Expires Tomorrow'
                    : `${daysUntilExpiry} Days Remaining (Within 30-Day Window)`}
                </span>
              </span>
            </div>

            <p
              className={`text-xs leading-relaxed ${
                isCritical
                  ? 'text-rose-800 dark:text-rose-300'
                  : 'text-amber-900 dark:text-amber-300'
              }`}
            >
              Your account password is scheduled to expire in{' '}
              <span className="font-extrabold underline decoration-amber-400 tabular-nums">
                {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}
              </span>{' '}
              (enforced by {companyName}&apos;s {expiryIntervalDays}-day password reset policy). To avoid losing access to POS checkouts, inventory logs, and accounting reports, please use the{' '}
              <button
                type="button"
                id="link-warning-direct-reset-flow"
                onClick={handleDirectReset}
                className="inline-flex items-center gap-1 font-bold underline underline-offset-2 text-[#0F4C81] dark:text-[#9AE61C] hover:opacity-80 cursor-pointer"
              >
                direct link to the reset flow
                <ArrowRight className="w-3 h-3 inline" />
              </button>
              {' '}or renew your credentials immediately.
            </p>

            {/* Test Simulation Controls */}
            {onSimulateDays && (
              <div className="pt-2 flex items-center gap-1.5 flex-wrap text-[11px] border-t border-amber-200/60 dark:border-amber-900/40 mt-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  Test Expiry Scenarios:
                </span>
                {[
                  { label: 'Critical (2d)', days: 2 },
                  { label: 'Urgent (7d)', days: 7 },
                  { label: 'Notice (15d)', days: 15 },
                  { label: 'Within Window (29d)', days: 29 },
                  { label: 'Outside Window (45d - Hides)', days: 45 },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => onSimulateDays(item.days)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      daysUntilExpiry === item.days
                        ? 'bg-[#0F4C81] text-white border-[#0F4C81]'
                        : 'bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 self-stretch sm:self-center justify-end">
          <button
            type="button"
            id="btn-warning-reset-password"
            onClick={onUpdatePassword}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isCritical
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-98'
                : 'bg-[#0F4C81] hover:bg-[#072644] active:scale-98'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#84CC16]" />
            <span>Reset Password Now</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          <div className="flex items-center gap-2">
            {onNavigateToResetFlow && (
              <button
                type="button"
                onClick={onNavigateToResetFlow}
                className="text-[11px] font-semibold text-[#0F4C81] dark:text-[#9AE61C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Reset Page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={onDismiss}
              className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Snooze warning for this session"
            >
              Snooze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
