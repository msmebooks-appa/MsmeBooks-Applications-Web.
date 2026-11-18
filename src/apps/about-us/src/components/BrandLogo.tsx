import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = false,
}) => {
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon */}
      <div className="relative w-10 h-10 rounded-xl bg-[#0B4EA2] flex items-center justify-center shadow-sm overflow-hidden shrink-0">
        {/* Subtle geometric book & growth accents */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
        >
          {/* Stylized open ledger pages */}
          <path
            d="M6 8.5C6 7.67 6.67 7 7.5 7H15C15.55 7 16 7.45 16 8V24C16 24.55 15.55 25 15 25H7.5C6.67 25 6 24.33 6 23.5V8.5Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M26 8.5C26 7.67 25.33 7 24.5 7H17C16.45 7 16 7.45 16 8V24C16 24.55 16.45 25 17 25H24.5C25.33 25 26 24.33 26 23.5V8.5Z"
            fill="#84CC16"
          />
          {/* Center spine marker */}
          <circle cx="16" cy="16" r="2" fill="#0B4EA2" />
          <path
            d="M9 12H13M9 16H13M9 20H12"
            stroke="#0B4EA2"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M19 12H23M19 16H23M19 20H22"
            stroke="#073066"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight">
          <span
            className={`text-xl font-bold font-sans ${
              isWhite ? 'text-white' : 'text-[#0B4EA2] dark:text-white'
            }`}
          >
            Msme
          </span>
          <span
            className={`text-xl font-bold font-sans ml-0.5 ${
              isWhite ? 'text-[#84CC16]' : 'text-[#083770] dark:text-[#84CC16]'
            }`}
          >
            Books
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] ml-1 self-baseline mb-1"></span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] uppercase font-semibold tracking-wider ${
              isWhite ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Business Cloud
          </span>
        )}
      </div>
    </div>
  );
};
