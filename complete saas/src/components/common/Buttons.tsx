import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-2 px-4 text-xs font-semibold',
    md: 'py-3 px-6 text-sm font-bold',
    lg: 'py-3.5 px-7 text-base font-bold',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        group relative inline-flex items-center justify-center gap-2 rounded-xl
        bg-[#0F4C81] hover:bg-[#0A365C] text-white
        border border-transparent hover:border-[#84CC16]/40
        shadow-sm shadow-[#0F4C81]/25 hover:shadow-md hover:shadow-[#0F4C81]/30
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0F4C81] disabled:hover:translate-y-0 disabled:hover:shadow-sm
        whitespace-nowrap cursor-pointer select-none
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : (
        leftIcon && (
          <span className="flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-110">
            {leftIcon}
          </span>
        )
      )}
      <span className="transition-transform duration-200 ease-out">{children}</span>
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'py-2 px-4 text-xs font-semibold',
    md: 'py-3 px-6 text-sm font-semibold',
    lg: 'py-3.5 px-7 text-base font-semibold',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        group relative inline-flex items-center justify-center gap-2 rounded-xl
        bg-white dark:bg-[#0B1E33] hover:bg-[#F8FAFC] dark:hover:bg-[#0F2844] text-[#072644] dark:text-white
        border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81]/40 dark:hover:border-[#84CC16]/40
        shadow-2xs hover:shadow-sm
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        whitespace-nowrap cursor-pointer select-none
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#0F4C81]" />
      ) : (
        leftIcon && (
          <span className="flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-110">
            {leftIcon}
          </span>
        )
      )}
      <span className="transition-transform duration-200 ease-out">{children}</span>
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1">
          {rightIcon}
        </span>
      )}
    </button>
  );
};
