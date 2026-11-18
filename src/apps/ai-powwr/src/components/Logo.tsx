import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'h-9',
  variant = 'dark',
  showTagline = false
}) => {
  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square flex-shrink-0 drop-shadow-sm"
      >
        {/* Base rounded square in Primary Blue */}
        <rect width="44" height="44" rx="11" fill="#1254B5" />
        
        {/* Subtle inner grid/ledger accent */}
        <path
          d="M12 14C12 12.8954 12.8954 12 14 12H23C24.1046 12 25 12.8954 25 14V30C25 31.1046 24.1046 32 23 32H14C12.8954 32 12 31.1046 12 30V14Z"
          fill="#0D3E8C"
        />
        {/* Ledger lines */}
        <rect x="15" y="16" width="7" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="15" y="21" width="7" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="15" y="26" width="5" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.8" />

        {/* Dynamic Growth / Open Ledger checkmark in Lemon Green */}
        <path
          d="M24 23.5L28.5 28L34 16"
          stroke="#B7E522"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Small Lemon Green accent dot representing active SaaS status */}
        <circle cx="34" cy="30" r="2" fill="#B7E522" />
      </svg>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div
          className={`flex items-center text-xl font-extrabold tracking-tight transition-colors ${
            isWhite
              ? 'text-white'
              : 'text-[#17233D] dark:text-white'
          }`}
        >
          <span>Msme</span>
          <span className="text-[#1254B5] dark:text-[#3B82F6]">Books</span>
          <span
            className="ml-1 w-2 h-2 rounded-full inline-block bg-[#B7E522]"
            title="SaaS Online"
          />
        </div>
        {showTagline && (
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 transition-colors ${
              isWhite
                ? 'text-blue-200'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Accounting • POS • Inventory
          </span>
        )}
      </div>
    </div>
  );
};

