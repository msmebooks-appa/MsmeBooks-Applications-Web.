import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Clock,
  RotateCcw,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

export interface LoginAttemptsCounterProps {
  failedAttempts: number;
  maxAttempts?: number;
  isLocked?: boolean;
  lockoutDurationSeconds?: number;
  onLockout?: () => void;
  onResetAttempts?: () => void;
  onForgotPassword?: () => void;
  onUnlockEarly?: () => void;
  onSimulateFailedAttempt?: () => void;
  className?: string;
  showSimulateControl?: boolean;
}

export const LoginAttemptsCounter: React.FC<LoginAttemptsCounterProps> = ({
  failedAttempts,
  maxAttempts = 5,
  isLocked = false,
  lockoutDurationSeconds = 15 * 60, // 15 minutes default
  onLockout,
  onResetAttempts,
  onForgotPassword,
  onUnlockEarly,
  onSimulateFailedAttempt,
  className = '',
  showSimulateControl = true,
}) => {
  const remainingAttempts = Math.max(0, maxAttempts - failedAttempts);
  const effectivelyLocked = isLocked || remainingAttempts === 0;

  // Countdown timer for lockout
  const [secondsLeft, setSecondsLeft] = useState(lockoutDurationSeconds);

  useEffect(() => {
    if (effectivelyLocked) {
      if (onLockout) {
        onLockout();
      }
      setSecondsLeft(lockoutDurationSeconds);
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (onResetAttempts) onResetAttempts();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setSecondsLeft(lockoutDurationSeconds);
    }
  }, [effectivelyLocked, lockoutDurationSeconds]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine state level styling
  const getWarningLevel = () => {
    if (effectivelyLocked) return 'locked';
    if (remainingAttempts === 1) return 'critical';
    if (remainingAttempts === 2) return 'high';
    if (remainingAttempts <= 4 && failedAttempts > 0) return 'medium';
    return 'idle';
  };

  const level = getWarningLevel();

  // If 0 attempts have failed and not locked, we can display a reassuring shield status
  if (failedAttempts === 0 && !effectivelyLocked) {
    return (
      <div
        className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#071626]/60 p-2.5 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2 transition-all ${className}`}
        id="login-attempts-counter"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#0F4C81]/10 dark:bg-[#0F4C81]/30 text-[#0F4C81] dark:text-[#9AE61C] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium">
            Account Lockout Guard: <strong className="text-slate-800 dark:text-slate-200">{maxAttempts} attempts</strong> allowed
          </span>
        </div>

        {showSimulateControl && onSimulateFailedAttempt && (
          <button
            type="button"
            onClick={onSimulateFailedAttempt}
            className="text-[10px] font-semibold text-[#0F4C81] dark:text-[#9AE61C] hover:underline cursor-pointer flex items-center gap-1"
            title="Simulate entering a wrong password to test warning counter"
          >
            Test failed try
          </button>
        )}
      </div>
    );
  }

  // Visual meter segments
  const segments = Array.from({ length: maxAttempts }, (_, i) => {
    const attemptNumber = i + 1;
    const isFailed = attemptNumber <= failedAttempts;
    return {
      attemptNumber,
      isFailed,
    };
  });

  return (
    <div
      id="login-attempts-counter"
      role="alert"
      aria-live="assertive"
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
        level === 'locked'
          ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900/60'
          : level === 'critical'
          ? 'bg-red-50/90 dark:bg-red-950/25 border-red-300 dark:border-red-800/80 animate-pulse-slow'
          : level === 'high'
          ? 'bg-orange-50/90 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50'
          : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
      } ${className}`}
    >
      <div className="p-3.5 space-y-3">
        {/* Header & Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                level === 'locked'
                  ? 'bg-red-600 text-white animate-bounce-subtle'
                  : level === 'critical'
                  ? 'bg-red-500 text-white animate-pulse'
                  : level === 'high'
                  ? 'bg-orange-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {level === 'locked' ? (
                <Lock className="w-4 h-4" />
              ) : level === 'critical' || level === 'high' ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`text-xs font-bold tracking-tight ${
                    level === 'locked'
                      ? 'text-red-900 dark:text-red-200'
                      : level === 'critical'
                      ? 'text-red-800 dark:text-red-300'
                      : level === 'high'
                      ? 'text-orange-900 dark:text-orange-200'
                      : 'text-amber-900 dark:text-amber-200'
                  }`}
                >
                  {level === 'locked'
                    ? 'Account Temporarily Locked'
                    : level === 'critical'
                    ? 'Critical Security Warning'
                    : 'Failed Login Warning'}
                </span>

                {/* Remaining Attempts Badge */}
                <span
                  className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                    level === 'locked'
                      ? 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700'
                      : level === 'critical'
                      ? 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800'
                      : level === 'high'
                      ? 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {effectivelyLocked ? '0 / 5 left' : `${remainingAttempts} of ${maxAttempts} attempts left`}
                </span>
              </div>

              <p
                className={`text-xs font-semibold mt-0.5 ${
                  level === 'locked'
                    ? 'text-red-700 dark:text-red-300'
                    : level === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : level === 'high'
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {level === 'locked' ? (
                  <span>Authentication suspended due to 5 consecutive invalid entries.</span>
                ) : remainingAttempts === 1 ? (
                  <span>Next failed attempt will lock your account for 15 minutes!</span>
                ) : (
                  <span>
                    {remainingAttempts} failed {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before temporary account lockout.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Progress Meter (Segmented Counter) */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>Attempt History:</span>
            <span>
              {failedAttempts} used / {remainingAttempts} safe
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {segments.map((seg) => (
              <div
                key={seg.attemptNumber}
                className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 transition-all duration-300"
                title={`Attempt ${seg.attemptNumber} of ${maxAttempts}`}
              >
                <div
                  className={`h-full w-full transition-all duration-300 ${
                    seg.isFailed
                      ? level === 'locked'
                        ? 'bg-red-600'
                        : level === 'critical'
                        ? 'bg-red-500'
                        : level === 'high'
                        ? 'bg-orange-500'
                        : 'bg-amber-400'
                      : 'bg-transparent'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-0.5">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span className="font-bold text-red-600 dark:text-red-400">5 (Lockout)</span>
          </div>
        </div>

        {/* Locked Countdown or Recommendation Box */}
        {effectivelyLocked ? (
          <div className="p-3 rounded-xl bg-red-100/90 dark:bg-red-950/70 border border-red-300 dark:border-red-800/80 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 dark:text-red-200">
                <Clock className="w-4 h-4 text-red-600 dark:text-red-400 animate-spin-slow" />
                <span>Temporary Lockout Timer:</span>
              </div>
              <span className="text-base font-mono font-extrabold text-red-700 dark:text-red-300 px-2 py-0.5 rounded bg-white/70 dark:bg-black/40 border border-red-200 dark:border-red-900">
                {formatCountdown(secondsLeft)}
              </span>
            </div>

            <p className="text-[11px] text-red-800 dark:text-red-300 leading-relaxed">
              Your credentials have been placed in protected quarantine to shield financial ledgers from unauthorized brute-force attempts.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Password Now</span>
                </button>
              )}

              {onUnlockEarly && (
                <button
                  type="button"
                  onClick={onUnlockEarly}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Unlock Account (Demo)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5">
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-semibold text-[#0F4C81] dark:text-[#9AE61C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Forgot password?</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showSimulateControl && onSimulateFailedAttempt && remainingAttempts > 0 && (
                <button
                  type="button"
                  onClick={onSimulateFailedAttempt}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Simulate entering a wrong password"
                >
                  +1 Failed Try
                </button>
              )}

              {onResetAttempts && failedAttempts > 0 && (
                <button
                  type="button"
                  onClick={onResetAttempts}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-0.5 cursor-pointer"
                  title="Reset counter back to 0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
