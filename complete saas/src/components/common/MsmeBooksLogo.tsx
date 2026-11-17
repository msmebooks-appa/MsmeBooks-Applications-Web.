import React from 'react';

interface MsmeBooksLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const MsmeBooksLogo: React.FC<MsmeBooksLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = false,
  className = '',
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon SVG */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0A365C] shadow-md shadow-[#0F4C81]/20 flex-shrink-0 p-1.5 border border-white/10`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main Book/Ledger Geometry */}
          <path
            d="M8 10C8 8.89543 8.89543 8 10 8H28C29.1046 8 30 8.89543 30 10V28C30 29.1046 29.1046 30 28 30H10C8.89543 30 8 29.1046 8 28V10Z"
            fill="white"
            fillOpacity="0.15"
          />
          {/* Back Leaf */}
          <path
            d="M12 12H28C29.1046 12 30 12.8954 30 14V30C30 31.1046 29.1046 32 28 32H14C12.8954 32 12 31.1046 12 30V12Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Ledger Lines */}
          <path
            d="M17 18H25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 23H23"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Lemon Green Growth Arrow & Dot Accent */}
          <path
            d="M23 15L27 15L27 19"
            stroke="#9AE61C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="11" r="2.5" fill="#9AE61C" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span
            className={`${textSizes[size]} font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-[#072644]'
            }`}
          >
            Msme<span className="text-[#0F4C81] dark:text-blue-400">Books</span>
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#84CC16] ml-1 mb-0.5 shadow-sm shadow-[#84CC16]/50"></span>
        </div>
        {showTagline && (
          <span
            className={`text-xs font-medium tracking-wide ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Manage Your Business Smarter
          </span>
        )}
      </div>
    </div>
  );
};
