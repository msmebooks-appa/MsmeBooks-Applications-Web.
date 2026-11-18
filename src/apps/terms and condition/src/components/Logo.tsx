import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
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
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon: Minimalist Ledger Book with Lemon-Green Growth Curve */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-lg bg-[#0B3558] dark:bg-[#0E3F6D] border border-transparent dark:border-blue-900/40 flex items-center justify-center shadow-sm overflow-hidden transition-colors`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
          aria-hidden="true"
        >
          {/* Left ledger page */}
          <path
            d="M8 8C8 6.89543 8.89543 6 10 6H17V28C17 28 12.5 27 10 27C8.89543 27 8 27.8954 8 29V8Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
          {/* Right ledger page */}
          <path
            d="M28 8C28 6.89543 27.1046 6 26 6H19V28C19 28 23.5 27 26 27C27.1046 27 28 27.8954 28 29V8Z"
            fill="#FFFFFF"
            fillOpacity="0.8"
          />
          {/* Spine divider */}
          <line x1="18" y1="6" x2="18" y2="28" stroke="#0B3558" strokeWidth="1.5" />
          {/* Lemon Green Growth Curve */}
          <path
            d="M10 22C14 20 18 16 26 11"
            stroke="#84CC16"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Lemon Green Growth Node */}
          <circle cx="26" cy="11" r="2.2" fill="#84CC16" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-bold tracking-tight ${textSizes[size]} leading-none`}>
          <span className="text-[#0B3558] dark:text-white transition-colors">Msme</span>
          <span className="text-[#84CC16]">Books</span>
        </span>
        {showTagline && (
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            Smart Cloud ERP
          </span>
        )}
      </div>
    </div>
  );
};
