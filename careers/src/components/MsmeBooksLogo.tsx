import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark' | 'white';
}

export const MsmeBooksLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-lg shadow-sm overflow-hidden bg-[#0066CC]`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Back Book Cover */}
          <rect x="7" y="9" width="26" height="24" rx="3" fill="#004C99" />
          {/* Main Book Page */}
          <path
            d="M9 11C9 9.89543 9.89543 9 11 9H23C24.1046 9 25 9.89543 25 11V30C25 31.1046 24.1046 32 23 32H11C9.89543 32 9 31.1046 9 30V11Z"
            fill="#FFFFFF"
          />
          {/* Financial Growth Leaf / Arrow (Lemon Green) */}
          <path
            d="M23 9C23 9 31 10.5 31 20C31 26 27 30 23 31V9Z"
            fill="#B5E61D"
          />
          {/* Ledger line accents */}
          <line x1="12" y1="15" x2="20" y2="15" stroke="#0066CC" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="20" x2="20" y2="20" stroke="#0066CC" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="25" x2="17" y2="25" stroke="#0066CC" strokeWidth="1.8" strokeLinecap="round" />
          {/* Upward Growth Dot */}
          <circle cx="27" cy="14" r="1.5" fill="#14243A" />
        </svg>
      </div>

      {variant !== 'mark' && (
        <div className="flex flex-col leading-none">
          <div className={`font-bold tracking-tight ${textSizes[size]} ${variant === 'white' ? 'text-white' : 'text-[#14243A] dark:text-white'}`}>
            Msme<span className="text-[#0066CC] dark:text-[#38BDF8]">Books</span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mt-0.5">
            Careers Portal
          </span>
        </div>
      )}
    </div>
  );
};
