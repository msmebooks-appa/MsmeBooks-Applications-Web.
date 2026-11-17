import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  message?: string;
  duration?: number; // duration in ms. Set to 0 for persistent/sticky toasts
  action?: ToastAction;
  id?: string;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  action?: ToastAction;
  createdAt: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (type: ToastType, title: string, options?: ToastOptions) => string;
  success: (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => string;
  error: (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => string;
  info: (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => string;
  warning: (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions): string => {
      const id = options?.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = options?.duration !== undefined ? options.duration : type === 'error' ? 6000 : 4500;

      const newToast: ToastItem = {
        id,
        type,
        title,
        message: options?.message,
        duration,
        action: options?.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Keep max 5 toasts visible to prevent viewport overflow
        const filtered = prev.filter((t) => t.id !== id);
        return [...filtered, newToast].slice(-5);
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => {
      return showToast('success', title, { ...options, message });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => {
      return showToast('error', title, { ...options, message });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => {
      return showToast('info', title, { ...options, message });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options?: Omit<ToastOptions, 'message'>) => {
      return showToast('warning', title, { ...options, message });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        info,
        warning,
        dismissToast,
        clearAll,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// --- ACCESSIBLE TOAST CONTAINER & CARDS ---

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const politeToasts = toasts.filter((t) => t.type !== 'error');
  const errorToasts = toasts.filter((t) => t.type === 'error');

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-md w-[calc(100vw-2rem)] pointer-events-none"
      id="toast-notifications-container"
    >
      {/* Assertive live region specifically for error notifications so assistive technology interrupts/announces immediately */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions text"
        className="flex flex-col gap-2.5 w-full pointer-events-auto"
      >
        {errorToasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>

      {/* Polite live region for success, warning, and informational notifications */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
        className="flex flex-col gap-2.5 w-full pointer-events-auto"
      >
        {politeToasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const remainingTimeRef = useRef(toast.duration);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (toast.duration <= 0) return;

    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    const intervalTime = 50;
    timerRef.current = setInterval(() => {
      remainingTimeRef.current -= intervalTime;
      const pct = Math.max(0, (remainingTimeRef.current / toast.duration) * 100);
      setProgress(pct);

      if (remainingTimeRef.current <= 0) {
        clearInterval(timerRef.current);
        onDismiss(toast.id);
      }
    }, intervalTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [toast.id, toast.duration, isPaused, onDismiss]);

  // Handle keyboard Escape dismissal when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onDismiss(toast.id);
    }
  };

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={`
        group relative w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-200
        focus:outline-hidden focus:ring-2 focus:ring-offset-2
        ${
          isSuccess
            ? 'bg-white dark:bg-[#0B1E33] border border-[#84CC16]/60 dark:border-[#84CC16]/50 focus:ring-[#84CC16]'
            : isError
            ? 'bg-white dark:bg-[#150F12] border border-rose-200 dark:border-rose-900/60 focus:ring-rose-400'
            : isWarning
            ? 'bg-white dark:bg-[#17140B] border border-amber-300 dark:border-amber-800/60 focus:ring-amber-400'
            : 'bg-white dark:bg-[#071F36] border border-sky-200 dark:border-sky-800/60 focus:ring-[#0F4C81]'
        }
      `}
      id={`toast-card-${toast.id}`}
    >
      {/* Decorative vertical accent bar on left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          isSuccess
            ? 'bg-[#84CC16] dark:bg-[#9AE61C]'
            : isError
            ? 'bg-rose-500/80 dark:bg-rose-500'
            : isWarning
            ? 'bg-amber-500'
            : 'bg-[#0F4C81] dark:bg-sky-400'
        }`}
        aria-hidden="true"
      />

      <div className="p-3.5 pl-4 sm:p-4 sm:pl-4.5 flex items-start gap-3">
        {/* Leading Accessible Icon Badge */}
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs
            ${
              isSuccess
                ? 'bg-[#84CC16]/20 text-[#4D7C0F] dark:text-[#9AE61C] border border-[#84CC16]/40'
                : isError
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60'
                : isWarning
                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                : 'bg-[#0F4C81]/15 text-[#0F4C81] dark:text-sky-300 border border-[#0F4C81]/25'
            }
          `}
          aria-hidden="true"
        >
          {isSuccess && <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />}
          {isError && <AlertCircle className="w-5 h-5 stroke-[2.2]" />}
          {isWarning && <AlertTriangle className="w-5 h-5 stroke-[2.2]" />}
          {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 stroke-[2.2]" />}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                isSuccess
                  ? 'text-[#072644] dark:text-white'
                  : isError
                  ? 'text-rose-950 dark:text-rose-100'
                  : isWarning
                  ? 'text-amber-950 dark:text-amber-100'
                  : 'text-[#072644] dark:text-white'
              }`}
            >
              {toast.title}
            </h4>

            {/* Type Micro Badge for screen-reader & visual clarity */}
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                isSuccess
                  ? 'bg-[#84CC16]/20 text-[#365314] dark:text-[#A3E635] border border-[#84CC16]/30'
                  : isError
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                  : isWarning
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200'
                  : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
              }`}
            >
              {toast.type}
            </span>
          </div>

          {toast.message && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {toast.message}
            </p>
          )}

          {/* Action button if provided */}
          {toast.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className={`
                  text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs
                  ${
                    isSuccess
                      ? 'bg-[#84CC16] hover:bg-[#72B013] text-[#072644]'
                      : isError
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#0F4C81] hover:bg-[#0A365C] text-white'
                  }
                `}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Close Button with accessible aria-label */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label={`Dismiss ${toast.type} notification: ${toast.title}`}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer flex-shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Timeout Progress Bar */}
      {toast.duration > 0 && (
        <div
          className="h-1 w-full bg-slate-100 dark:bg-slate-800/60 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className={`h-full transition-all duration-75 ${
              isSuccess
                ? 'bg-[#84CC16] dark:bg-[#9AE61C]'
                : isError
                ? 'bg-rose-400 dark:bg-rose-500'
                : isWarning
                ? 'bg-amber-400 dark:bg-amber-500'
                : 'bg-[#0F4C81] dark:bg-sky-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
