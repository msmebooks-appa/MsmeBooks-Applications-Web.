import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  lightMode = false,
}) => {
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
      {/* Official MsmeBooks Stylized SVG Emblem */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        {/* Rounded Container */}
        <rect
          width="44"
          height="44"
          rx="10"
          className={lightMode ? 'fill-white' : 'fill-[#0A3D62] dark:fill-[#0E4B77]'}
        />
        {/* Ledger Page Fold / Open Book Base */}
        <path
          d="M10 32C10 30.8954 10.8954 30 12 30H32C33.1046 30 34 30.8954 34 32C34 33.1046 33.1046 34 32 34H12C10.8954 34 10 33.1046 10 32Z"
          className={lightMode ? 'fill-[#0A3D62]' : 'fill-[#7CB518]'}
        />
        {/* Book Left Curve */}
        <path
          d="M12 12C12 10.8954 12.8954 10 14 10H20V26H14C12.8954 26 12 25.1046 12 24V12Z"
          className={lightMode ? 'fill-[#072B45]' : 'fill-slate-200 dark:fill-slate-100'}
          fillOpacity={lightMode ? '0.85' : '0.9'}
        />
        {/* Dynamic Growth Bars in Lemon Green */}
        {/* Growth Bar 1 */}
        <rect x="23" y="20" width="3.2" height="6" rx="1.2" fill="#7CB518" />
        {/* Growth Bar 2 */}
        <rect x="27.5" y="16" width="3.2" height="10" rx="1.2" fill="#7CB518" />
        {/* Growth Bar 3 */}
        <rect x="32" y="12" width="3.2" height="14" rx="1.2" fill={lightMode ? '#0A3D62' : '#90CF24'} />
        {/* Growth Trend Accent Dot */}
        <circle cx="33.6" cy="9.5" r="1.8" fill="#7CB518" />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight leading-none ${textSizes[size]} ${
            lightMode ? 'text-white' : 'text-[#0A3D62] dark:text-white'
          }`}
        >
          Msme<span className="text-[#7CB518] dark:text-[#90CF24]">Books</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-medium tracking-wider uppercase mt-0.5 ${
              lightMode ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Operating System for MSMEs
          </span>
        )}
      </div>
    </div>
  );
};
