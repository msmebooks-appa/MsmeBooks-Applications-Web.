import React, { useState, useEffect } from 'react';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCw,
  Clock,
  Inbox,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { InputField } from '../common/FormInputs';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { AlertMessage } from '../common/Alerts';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import { ForgotPasswordEmailModal } from './ForgotPasswordEmailModal';

interface ForgotPasswordViewProps {
  onBackToSignIn: () => void;
  onProceedToReset: (email: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToSignIn,
  onProceedToReset,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('742916');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendNotification, setResendNotification] = useState('');

  // Countdown timer for Resend functionality
  useEffect(() => {
    if (!isSuccess) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isSuccess]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateCode = () => {
    const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(freshCode);
    return freshCode;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid registered work email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      handleGenerateCode();
      setCountdown(60);
      setCanResend(false);
      setIsModalOpen(true); // Automatically pop up the email simulation modal
    }, 700);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    const fresh = handleGenerateCode();
    setResendNotification(`Fresh reset link and OTP (${fresh}) sent to ${email}!`);
    setTimeout(() => {
      setResendNotification('');
    }, 4500);
  };

  return (
    <>
      <AuthCard>
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-1">
            <MsmeBooksLogo size="sm" showTagline={false} />
          </div>
          <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 dark:bg-[#0F4C81]/30 text-[#0F4C81] dark:text-[#9AE61C] flex items-center justify-center mx-auto mb-1">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#072644] dark:text-white tracking-tight">
            Forgot Your Password?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Enter your email address and we'll send you a secure password-reset link and OTP token.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center py-2 animate-fade-in text-left">
            <div className="w-14 h-14 rounded-full bg-[#84CC16]/20 border-2 border-[#84CC16] text-[#65A30D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-base font-bold text-[#072644] dark:text-white">
                Password Reset Instructions Sent
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                Check your email at <strong className="text-[#072644] dark:text-white">{email}</strong> for instructions to securely reset your password.
              </p>
            </div>

            {resendNotification && (
              <div className="p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{resendNotification}</span>
              </div>
            )}

            {/* Simulated Email Notification Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071626] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#9AE61C] flex items-center justify-center">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#072644] dark:text-white block">
                      Simulated Email Ready
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      OTP: <strong className="font-mono text-[#0F4C81] dark:text-[#9AE61C]">{otpCode}</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#0A365C] dark:bg-[#0F4C81] dark:hover:bg-[#155e9e] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  View Email
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                Valid for 15 minutes. Contains 6-digit OTP &amp; direct reset link.
              </div>
            </div>

            {/* Resend Section with Live Countdown Timer */}
            <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#071626]/70 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Didn't receive the email or token?
              </div>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer py-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Resend Reset Link &amp; OTP
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium py-1">
                  <Clock className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
                  <span>Resend available in</span>
                  <span className="font-mono font-bold text-[#072644] dark:text-white">
                    {formatCountdown(countdown)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <PrimaryButton
                onClick={() => onProceedToReset(email)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Enter New Password (Demo Flow)
              </PrimaryButton>

              <SecondaryButton onClick={onBackToSignIn} fullWidth size="sm">
                ← Back to Sign In
              </SecondaryButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl">
                {error}
              </div>
            )}

            <InputField
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              isRequired
              autoFocus
            />

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Link &amp; OTP
              </PrimaryButton>
            </div>

            <div className="pt-2 text-center text-xs">
              <button
                type="button"
                onClick={onBackToSignIn}
                className="group inline-flex items-center justify-center gap-1.5 font-semibold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-all duration-200 ease-out hover:-translate-x-0.5 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-1" />
                <span className="underline decoration-transparent hover:decoration-current underline-offset-2">
                  Back to Sign In
                </span>
              </button>
            </div>
          </form>
        )}
      </AuthCard>

      {/* Email Simulation Modal */}
      <ForgotPasswordEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={email}
        otpCode={otpCode}
        countdown={countdown}
        canResend={canResend}
        onResend={handleResend}
        onProceedToReset={onProceedToReset}
      />
    </>
  );
};

