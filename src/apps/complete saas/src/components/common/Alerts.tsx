import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react';
import { SecurityDetailsPopover } from './SecurityDetailsPopover';

interface AlertMessageProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  className?: string;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  const styles = {
    success: {
      bg: 'bg-[#84CC16]/10 border-[#84CC16]/40 text-[#072644]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#65A30D] flex-shrink-0" />,
      titleColor: 'text-[#072644]',
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
      titleColor: 'text-red-950',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
      titleColor: 'text-amber-950',
    },
    info: {
      bg: 'bg-[#0F4C81]/8 border-[#0F4C81]/25 text-[#072644]',
      icon: <Info className="w-5 h-5 text-[#0F4C81] flex-shrink-0" />,
      titleColor: 'text-[#0F4C81]',
    },
  };

  const current = styles[type];

  return (
    <div
      role="alert"
      className={`rounded-xl border p-3.5 flex items-start gap-3 transition-all duration-200 ${current.bg} ${className}`}
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1 text-left text-xs sm:text-sm">
        {title && <p className={`font-bold mb-0.5 ${current.titleColor}`}>{title}</p>}
        <p className="leading-relaxed text-slate-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

interface SecurityNoticeProps {
  text?: string;
  variant?: 'subtle' | 'card';
  className?: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  text = 'Secure business access',
  variant = 'subtle',
  className = '',
}) => {
  if (variant === 'card') {
    return (
      <SecurityDetailsPopover
        variant="card"
        triggerText={text}
        triggerClassName={className}
      />
    );
  }

  return (
    <SecurityDetailsPopover
      variant="notice"
      triggerText={text}
      triggerClassName={className}
    />
  );
};
