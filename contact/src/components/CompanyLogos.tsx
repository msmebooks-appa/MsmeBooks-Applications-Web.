import React from 'react';

interface CompanyLogoProps {
  type: 'primemart' | 'rifthighlands' | 'oasis' | 'ubuntu' | 'kigali' | 'sahelpay';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  type,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  };

  switch (type) {
    case 'primemart':
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              PRIMEMART
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              Superstores
            </span>
          </div>
        </div>
      );

    case 'rifthighlands':
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-[#0B3B82] flex items-center justify-center text-amber-300 shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              RIFT HIGHLANDS
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
              Coffee Co-op
            </span>
          </div>
        </div>
      );

    case 'oasis':
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a5 5 0 0 0-5 5c0 3 5 9 5 9s5-6 5-9a5 5 0 0 0-5-5Z"></path>
              <circle cx="12" cy="7" r="1.5"></circle>
              <path d="M3 21h18"></path>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              OASIS PALM
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-sky-600 dark:text-sky-400">
              Hotels & Resorts
            </span>
          </div>
        </div>
      );

    case 'ubuntu':
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="16" height="13" x="1" y="5" rx="2"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              UBUNTU FREIGHT
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
              CrossBorder Logistics
            </span>
          </div>
        </div>
      );

    case 'kigali':
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 6v12"></path>
              <path d="M6 12h12"></path>
              <circle cx="12" cy="12" r="9"></circle>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              PHARMACARE
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400">
              Kigali Logistics
            </span>
          </div>
        </div>
      );

    case 'sahelpay':
      return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" x2="22" y1="10" y2="10"></line>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              SAHELPAY
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
              Merchant Network
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
