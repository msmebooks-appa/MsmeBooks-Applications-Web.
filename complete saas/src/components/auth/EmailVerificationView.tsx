import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RotateCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { OTPInput } from '../common/OTPInput';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';

interface EmailVerificationViewProps {
  email: string;
  onVerified: () => void;
  onBack?: () => void;
  showProgress?: boolean;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  email,
  onVerified,
  onBack,
  showProgress = true,
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = (codeToVerify = otp) => {
    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        onVerified();
      }, 1200);
    }, 800);
  };

  const handleOTPChange = (val: string) => {
    setOtp(val);
    if (error) setError('');
    if (val.length === 6) {
      handleVerify(val);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(45);
    setOtp('');
    setError('');
  };

  return (
    <AuthCard>
      {showProgress && <ProgressIndicator currentStep={3} className="mb-4" />}

      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center mx-auto mb-2">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          We've sent a verification code to <br />
          <strong className="text-[#072644] font-semibold">{email || 'your email address'}</strong>.
          Enter the code below to continue.
        </p>
      </div>

      {isSuccess ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 border-2 border-[#84CC16] text-[#65A30D] flex items-center justify-center mx-auto shadow-md shadow-[#84CC16]/20">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-[#072644]">
              Email Verified Successfully
            </h3>
            <p className="text-xs text-slate-500">
              Your identity has been confirmed. Redirecting to business setup...
            </p>
          </div>
          <PrimaryButton onClick={onVerified} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue
          </PrimaryButton>
        </div>
      ) : (
        <div className="space-y-5">
          {/* OTP Component */}
          <div>
            <OTPInput
              value={otp}
              onChange={handleOTPChange}
              disabled={isVerifying}
              isError={Boolean(error)}
            />
            {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}
          </div>

          {/* Resend Code Section */}
          <div className="text-center space-y-1 text-xs text-slate-500">
            <div>Didn't receive the code?</div>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-[#0F4C81] hover:text-[#0A365C] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Resend Code
              </button>
            ) : (
              <div className="font-semibold text-slate-600 flex items-center justify-center gap-1">
                <span>Resend available in</span>
                <span className="font-mono text-[#0F4C81] font-bold">
                  {formatCountdown(countdown)}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <PrimaryButton
              onClick={() => handleVerify()}
              isLoading={isVerifying}
              disabled={otp.length !== 6}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Verify & Continue
            </PrimaryButton>

            {onBack && (
              <SecondaryButton onClick={onBack} fullWidth size="sm">
                Change Email Address
              </SecondaryButton>
            )}
          </div>

          <div className="pt-1 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
              Secured with time-sensitive one-time token
            </span>
          </div>
        </div>
      )}
    </AuthCard>
  );
};
