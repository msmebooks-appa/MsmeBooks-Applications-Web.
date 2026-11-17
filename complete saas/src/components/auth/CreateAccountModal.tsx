import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { evaluatePasswordEntropy } from './PasswordStrengthIndicator';

export interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (accountData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => void;
  onSwitchToSignIn?: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToSignIn,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Real-time password strength analysis with Brand Blue and Lemon Green
  const strength = evaluatePasswordEntropy(password);
  const passwordLength = password.length;
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password;

  // Brand blue & lemon green strength tiers
  const getStrengthTierInfo = () => {
    if (!password) {
      return {
        label: 'Enter password',
        barColor: 'bg-slate-200 dark:bg-slate-700',
        textColor: 'text-slate-400',
        badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
        score: 0,
        percentage: 0,
      };
    }
    if (strength.score <= 1) {
      return {
        label: 'Weak — Add more variety',
        barColor: 'bg-[#0F4C81]/60', // Soft brand blue
        textColor: 'text-[#0F4C81] dark:text-sky-300',
        badgeBg: 'bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-[#0F4C81]/30 dark:text-sky-200',
        score: 1,
        percentage: 25,
      };
    }
    if (strength.score === 2) {
      return {
        label: 'Moderate — Good start',
        barColor: 'bg-[#0F4C81]', // Primary Brand Blue
        textColor: 'text-[#0F4C81] dark:text-sky-400',
        badgeBg: 'bg-[#0F4C81]/15 text-[#0F4C81] dark:bg-[#0F4C81]/40 dark:text-white',
        score: 2,
        percentage: 50,
      };
    }
    if (strength.score === 3) {
      return {
        label: 'Strong — Secure password',
        barColor: 'bg-[#84CC16]', // Vibrant Lemon Green
        textColor: 'text-[#65A30D] dark:text-[#9AE61C]',
        badgeBg: 'bg-[#84CC16]/20 text-[#65A30D] dark:text-[#9AE61C]',
        score: 3,
        percentage: 75,
      };
    }
    return {
      label: 'Enterprise Grade — Optimal protection',
      barColor: 'bg-gradient-to-r from-[#0F4C81] via-[#84CC16] to-[#9AE61C]', // Blue to Lemon Green Gradient
      textColor: 'text-[#65A30D] dark:text-[#84CC16]',
      badgeBg: 'bg-[#84CC16]/25 text-[#4D7C0F] dark:text-[#9AE61C] border border-[#84CC16]/40',
      score: 4,
      percentage: 100,
    };
  };

  const tierInfo = getStrengthTierInfo();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid work email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (strength.score < 2) {
      errs.password = 'Password is too weak. Please add numbers, symbols or uppercase letters.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!termsAccepted) {
      errs.terms = 'You must accept the terms of service';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.({
          firstName,
          lastName,
          email,
          phone,
        });
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-account-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        id="create-account-modal"
      >
        {/* Header with MsmeBooks Brand Styling */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/90 dark:bg-[#071626]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-[#9AE61C] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="create-account-title"
                  className="text-base font-bold text-[#072644] dark:text-white"
                >
                  Create MsmeBooks Account
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]">
                  Instant Setup
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Join thousands of businesses managing ledgers, POS, and inventory.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-[#072644] dark:text-white">
                Account Created Successfully!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Welcome to MsmeBooks! Setting up your workspace credentials now...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#072644] dark:text-slate-200 uppercase tracking-tight mb-1">
                    First Name <span className="text-[#84CC16]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071626] text-xs sm:text-sm text-[#072644] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#072644] dark:text-slate-200 uppercase tracking-tight mb-1">
                    Last Name <span className="text-[#84CC16]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adeyemi"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071626] text-xs sm:text-sm text-[#072644] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                  {errors.lastName && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-bold text-[#072644] dark:text-slate-200 uppercase tracking-tight mb-1">
                  Work Email <span className="text-[#84CC16]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="john.adeyemi@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071626] text-xs sm:text-sm text-[#072644] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#072644] dark:text-slate-200 uppercase tracking-tight mb-1">
                  Phone Number <span className="text-[#84CC16]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071626] text-xs sm:text-sm text-[#072644] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.phone}</p>
                )}
              </div>

              {/* =========================================================================
                  PASSWORD FIELD & BRAND BLUE / LEMON GREEN PASSWORD STRENGTH METER
                  ========================================================================= */}
              <div className="space-y-2 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#072644] dark:text-slate-200 uppercase tracking-tight">
                      Password <span className="text-[#84CC16]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] font-semibold flex items-center gap-1 cursor-pointer"
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
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: '' }));
                        }
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071626] text-xs sm:text-sm text-[#072644] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">{errors.password}</p>
                  )}
                </div>

                {/* --- REAL-TIME PASSWORD STRENGTH METER (BRAND BLUE & LEMON GREEN PALETTE) --- */}
                {passwordLength > 0 && (
                  <div
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#071626]/80 space-y-2.5 transition-all duration-200 animate-in fade-in"
                    aria-live="polite"
                  >
                    {/* Header: Strength Badge & Bits */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          Password Strength:
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${tierInfo.badgeBg}`}
                        >
                          {tierInfo.label}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono font-bold text-[#0F4C81] dark:text-[#9AE61C]">
                        {strength.entropyBits} bits
                      </span>
                    </div>

                    {/* 4-Segment Brand Blue and Lemon Green Progress Bars */}
                    <div className="grid grid-cols-4 gap-1.5 h-2 w-full">
                      {/* Segment 1: Soft Brand Blue */}
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          tierInfo.score >= 1 ? 'bg-[#0F4C81]' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                      {/* Segment 2: Vibrant Brand Blue */}
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          tierInfo.score >= 2 ? 'bg-[#0F4C81]' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                      {/* Segment 3: Primary Lemon Green */}
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          tierInfo.score >= 3 ? 'bg-[#84CC16]' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                      {/* Segment 4: Radiant Lemon Green */}
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          tierInfo.score >= 4 ? 'bg-[#65A30D] dark:bg-[#9AE61C]' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    </div>

                    {/* Password Security Rules Checklist with Brand Colors */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                      {strength.rules.map((rule) => (
                        <div
                          key={rule.id}
                          className={`flex items-center gap-1.5 transition-colors ${
                            rule.met
                              ? 'text-[#072644] dark:text-slate-100 font-semibold'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              rule.met
                                ? 'bg-[#84CC16] text-[#072644]'
                                : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#072644] dark:text-slate-200 uppercase tracking-tight">
                      Confirm Password <span className="text-[#84CC16]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-xs text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Show
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#071626] text-xs sm:text-sm text-[#072644] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                    />
                  </div>

                  {confirmPassword.length > 0 && (
                    <p
                      className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                        passwordsMatch ? 'text-[#65A30D] dark:text-[#84CC16]' : 'text-amber-500'
                      }`}
                    >
                      {passwordsMatch ? '✓ Passwords match' : 'Passwords do not match yet'}
                    </p>
                  )}

                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#0F4C81] focus:ring-[#84CC16] accent-[#0F4C81]"
                  />
                  <span>
                    I agree to the{' '}
                    <span className="text-[#0F4C81] dark:text-[#9AE61C] font-semibold underline">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-[#0F4C81] dark:text-[#9AE61C] font-semibold underline">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Account
                </PrimaryButton>
              </div>

              {/* Switch to Sign In */}
              <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-1">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToSignIn?.();
                  }}
                  className="font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
