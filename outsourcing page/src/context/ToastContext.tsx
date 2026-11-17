import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Info, 
  AlertCircle, 
  X, 
  Globe, 
  ShoppingBag, 
  CreditCard,
  Sparkles
} from 'lucide-react';

export type ToastType = 'success' | 'info' | 'plan' | 'locale' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  icon?: ReactNode;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    plan: (planName: string, detail?: string) => string;
    locale: (category: 'country' | 'language', label: string, detail?: string) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((options: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const duration = options.duration ?? 3800;

    const newToast: ToastItem = {
      id,
      ...options,
      duration,
    };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep maximum 4 concurrent toasts

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const toast = {
    success: (message: string, title: string = 'Success') => 
      showToast({ type: 'success', title, message }),
    info: (message: string, title: string = 'Information') => 
      showToast({ type: 'info', title, message }),
    warning: (message: string, title: string = 'Warning') => 
      showToast({ type: 'warning', title, message }),
    error: (message: string, title: string = 'Error') => 
      showToast({ type: 'error', title, message }),
    plan: (planName: string, detail: string = 'Ready for checkout') =>
      showToast({
        type: 'plan',
        title: 'Plan Added to Cart',
        message: `${planName} • ${detail}`,
      }),
    locale: (category: 'country' | 'language', label: string, detail?: string) =>
      showToast({
        type: 'locale',
        title: category === 'country' ? 'Market & Currency Updated' : 'Language Switched',
        message: detail ? `${label} (${detail})` : label,
      }),
  };

  const getToastIcon = (type: ToastType, customIcon?: ReactNode) => {
    if (customIcon) return customIcon;
    switch (type) {
      case 'plan':
        return <ShoppingBag className="w-4 h-4 text-lime-600 dark:text-lime-400" />;
      case 'locale':
        return <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getToastAccent = (type: ToastType) => {
    switch (type) {
      case 'plan':
        return 'border-l-4 border-l-lime-500 dark:border-l-lime-400';
      case 'locale':
        return 'border-l-4 border-l-blue-500 dark:border-l-blue-400';
      case 'success':
        return 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400';
      case 'warning':
        return 'border-l-4 border-l-amber-500';
      case 'error':
        return 'border-l-4 border-l-rose-500';
      case 'info':
      default:
        return 'border-l-4 border-l-slate-400 dark:border-l-slate-600';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, toast }}>
      {children}

      {/* Floating Toast Container */}
      <aside 
        aria-label="Notifications"
        aria-live="polite"
        className="fixed top-20 sm:top-24 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-1.5rem)] pointer-events-none select-none"
      >
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-200 dark:border-slate-800 ${getToastAccent(item.type)} text-slate-800 dark:text-slate-100 flex items-start justify-between gap-3 overflow-hidden relative group`}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getToastIcon(item.type, item.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 mt-0.5">
                    {item.message}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition shrink-0 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Subtle timed countdown indicator */}
              {item.duration && item.duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: item.duration / 1000, ease: 'linear' }}
                    className="h-full bg-lime-500 dark:bg-lime-400"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
