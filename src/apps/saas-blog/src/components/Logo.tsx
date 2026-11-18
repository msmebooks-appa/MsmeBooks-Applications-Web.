import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md'
}) => {
  const isLight = variant === 'light';
  
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Brand Icon: Minimalist Modern Ledger Mark + Growth Angle in Blue & Lemon Green */}
      <div className={`relative flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-sm ${iconSizes[size]} overflow-hidden`}>
        <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
          {/* Main Book/Ledger Base */}
          <rect x="7" y="6" width="22" height="24" rx="4" className="fill-blue-800/80 stroke-blue-400 stroke-[1.5]" />
          {/* Growth bar chart accents */}
          <rect x="11" y="18" width="3" height="7" rx="1" className="fill-slate-300" />
          <rect x="16" y="14" width="3" height="11" rx="1" className="fill-blue-400" />
          <rect x="21" y="10" width="3" height="15" rx="1" className="fill-lime-400" />
          {/* Top spark dot */}
          <circle cx="22.5" cy="8" r="1.5" className="fill-lime-300" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight font-sans ${textSizes[size]} ${isLight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          Msme<span className="text-blue-700 dark:text-lime-400 transition-colors">Books</span>
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
          SaaS Knowledge Hub
        </span>
      </div>
    </div>
  );
};
