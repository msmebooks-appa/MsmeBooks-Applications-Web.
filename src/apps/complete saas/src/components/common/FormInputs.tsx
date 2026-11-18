import React, { useState, useId } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRequired?: boolean;
  reserveErrorSpace?: boolean;
  isValid?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightElement,
  isRequired = false,
  reserveErrorSpace = false,
  isValid = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-[#072644] dark:text-slate-200 tracking-tight uppercase"
        >
          {label} {isRequired && <span className="text-[#84CC16] font-extrabold">*</span>}
        </label>
        {rightElement && <div>{rightElement}</div>}
      </div>

      <div className="relative rounded-xl shadow-xs transition-all duration-200">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`
            w-full rounded-xl border bg-white dark:bg-[#071626] px-3.5 py-2.5 text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400
            transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950/40'
                : isValid
                ? 'border-[#84CC16] focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15'
            }
            focus:outline-none
            ${className}
          `}
          {...props}
        />
      </div>

      {reserveErrorSpace ? (
        <div className="min-h-[20px] mt-1 flex items-center" aria-live="polite">
          {error ? (
            <p id={`${inputId}-error`} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1 animate-in fade-in duration-150" role="alert">
              <X className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </p>
          ) : helperText ? (
            <p id={`${inputId}-helper`} className="text-xs text-slate-500 dark:text-slate-400 animate-in fade-in duration-150">{helperText}</p>
          ) : (
            <span className="invisible text-xs select-none" aria-hidden="true">&nbsp;</span>
          )}
        </div>
      ) : error ? (
        <p id={`${inputId}-error`} className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
          <X className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

interface PasswordFieldProps extends Omit<InputFieldProps, 'type' | 'leftIcon'> {
  showStrengthMeter?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  showStrengthMeter = false,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordVal = typeof value === 'string' ? value : '';

  // Password strength calculation
  const calculateStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-amber-400' };
    if (score === 3) return { score: 2, label: 'Fair', color: 'bg-blue-400' };
    if (score === 4) return { score: 3, label: 'Strong', color: 'bg-[#84CC16]' };
    return { score: 4, label: 'Very Strong', color: 'bg-[#65A30D]' };
  };

  const strength = calculateStrength(passwordVal);

  return (
    <div className="w-full space-y-1.5 text-left">
      <InputField
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        error={error}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="text-xs text-[#0F4C81] hover:text-[#0A365C] font-semibold flex items-center gap-1 cursor-pointer"
          >
            {showPassword ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Hide
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Show
              </>
            )}
          </button>
        }
        {...props}
      />

      {showStrengthMeter && passwordVal.length > 0 && (
        <div className="pt-1.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Password strength:</span>
            <span
              className={`font-bold ${
                strength.score >= 3 ? 'text-[#65A30D]' : strength.score === 2 ? 'text-[#0F4C81]' : 'text-amber-600'
              }`}
            >
              {strength.label}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score >= 1 ? strength.color : 'bg-slate-200'
              }`}
            />
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score >= 2 ? strength.color : 'bg-slate-200'
              }`}
            />
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score >= 3 ? strength.color : 'bg-slate-200'
              }`}
            />
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score >= 4 ? strength.color : 'bg-slate-200'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-1">
              {passwordVal.length >= 8 ? (
                <Check className="w-3 h-3 text-[#84CC16]" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />
              )}
              <span>8+ characters</span>
            </div>
            <div className="flex items-center gap-1">
              {/[A-Z]/.test(passwordVal) ? (
                <Check className="w-3 h-3 text-[#84CC16]" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />
              )}
              <span>Uppercase letter</span>
            </div>
            <div className="flex items-center gap-1">
              {/[a-z]/.test(passwordVal) ? (
                <Check className="w-3 h-3 text-[#84CC16]" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />
              )}
              <span>Lowercase letter</span>
            </div>
            <div className="flex items-center gap-1">
              {/[0-9]/.test(passwordVal) && /[^A-Za-z0-9]/.test(passwordVal) ? (
                <Check className="w-3 h-3 text-[#84CC16]" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />
              )}
              <span>Number & symbol</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
