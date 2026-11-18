import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Official MsmeBooks Stylized Emblem: Blue Ledger Folio + Vibrant Lemon Green Growth Curve */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizeClasses[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Base Shield/Ledger Foundation in Corporate Blue */}
          <rect
            x="4"
            y="4"
            width="32"
            height="32"
            rx="8"
            fill={isLight ? '#FFFFFF' : '#0B3B82'}
          />
          {/* Internal Ledger pages & bookmark in Lemon Green & White/Blue */}
          <path
            d="M11 13H29M11 19H29M11 25H22"
            stroke={isLight ? '#0B3B82' : '#FFFFFF'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Distinctive Lemon Green Growth Chevron / Dynamic Bookmark */}
          <path
            d="M24 21L29 26L24 31V21Z"
            fill="#70C038"
          />
          <circle cx="28" cy="13" r="2.5" fill="#70C038" />
        </svg>
      </div>

      {/* Brand Typography: "Msme" in Blue + "Books" in Lemon Green */}
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold ${textClasses[size]} tracking-tight flex items-baseline`}>
          <span className={isLight ? 'text-white' : 'text-[#0B3B82] dark:text-white'}>Msme</span>
          <span className={isLight ? 'text-[#a1e670]' : 'text-[#70C038] dark:text-[#a1e670]'}>Books</span>
        </div>
      </div>
    </div>
  );
};
