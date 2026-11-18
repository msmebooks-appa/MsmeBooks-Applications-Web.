import React from 'react';

interface MsmeLogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const MsmeLogo: React.FC<MsmeLogoProps> = ({
  className = '',
  variant = 'color',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Official MsmeBooks Stylized Geometric Ledger & Foliage Logo */}
      <svg
        className={`${sizeClasses[size]} w-auto shrink-0`}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MsmeBooks Logo"
      >
        {/* Left Book Spine / Base Sheet */}
        <path
          d="M6 10C6 7.79086 7.79086 6 10 6H18C20.2091 6 22 7.79086 22 10V34C22 36.2091 20.2091 38 18 38H10C7.79086 38 6 36.2091 6 34V10Z"
          fill={isWhite ? '#FFFFFF' : '#0046B8'}
        />
        {/* Right Active Folio Leaf with Rounded Angle */}
        <path
          d="M22 10C22 7.79086 23.7909 6 26 6H34C36.2091 6 38 7.79086 38 10V34C38 36.2091 36.2091 38 34 38H26C23.7909 38 22 36.2091 22 34V10Z"
          fill={isWhite ? '#84CC16' : '#84CC16'}
          fillOpacity={isWhite ? '0.9' : '1'}
        />
        {/* Inner Ledger Sheet Geometry Line */}
        <path
          d="M12 14H16M12 20H16M12 26H16"
          stroke={isWhite ? '#0046B8' : '#FFFFFF'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right Data Bars */}
        <path
          d="M28 20H32M28 26H32"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Lemon Growth Accent Dot */}
        <circle cx="34" cy="11" r="3" fill={isWhite ? '#FFFFFF' : '#65A30D'} />
      </svg>

      <span className={`${textSizes[size]} font-extrabold tracking-tight flex items-baseline leading-none`}>
        <span className={isWhite ? 'text-white' : 'text-slate-900 dark:text-white'}>Msme</span>
        <span className={isWhite ? 'text-lime-300' : 'text-[#0046B8] dark:text-blue-400'}>Books</span>
      </span>
    </div>
  );
};
