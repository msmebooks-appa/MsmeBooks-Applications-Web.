import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  RotateCw,
  ArrowRight,
  Clock,
  Copy,
  Check,
  X,
  ShieldCheck,
  Inbox,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

interface ForgotPasswordEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  otpCode: string;
  countdown: number;
  canResend: boolean;
  onResend: () => void;
  onProceedToReset: (email: string) => void;
}

export const ForgotPasswordEmailModal: React.FC<ForgotPasswordEmailModalProps> = ({
  isOpen,
  onClose,
  email,
  otpCode,
  countdown,
  canResend,
  onResend,
  onProceedToReset,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(otpCode);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulation-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#0A1F36] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-left overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#072644] text-white flex items-center justify-between border-b border-[#0F4C81]/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F4C81] flex items-center justify-center text-[#9AE61C]">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Simulated Email Inbox
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#84CC16]/20 text-[#9AE61C] border border-[#84CC16]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse" />
                  Delivered
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Interactive preview of the message sent to your mail server
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Email Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Simulated Email Envelope Header */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071626] border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                From:
              </span>
              <span className="font-semibold text-[#072644] dark:text-white">
                MsmeBooks Security Desk &lt;security-auth@msmebooks.com&gt;
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                To:
              </span>
              <span className="font-semibold text-[#0F4C81] dark:text-[#9AE61C] break-all">
                {email}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Subject:
              </span>
              <span className="font-bold text-[#072644] dark:text-slate-100">
                Password Reset Request &amp; 6-Digit OTP Token
              </span>
            </div>
          </div>

          {/* Simulated Email Content Box */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D243F] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <MsmeBooksLogo size="sm" showTagline={false} />
              <span className="text-[10px] text-slate-400 font-mono">
                ID: MSME-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

            <div className="space-y-2">
              <h3
                id="simulation-modal-title"
                className="text-base font-extrabold text-[#072644] dark:text-white"
              >
                Password Reset Instructions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hello, we received a request to reset the login credentials for your
                MsmeBooks business account (<span className="font-semibold text-[#072644] dark:text-white">{email}</span>).
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You can either enter the 6-digit one-time token below or use the direct reset button to set a new password.
              </p>
            </div>

            {/* OTP Code Display Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071626] border border-slate-200 dark:border-slate-800 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <KeyRound className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
                Your 6-Digit Password Reset OTP
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 tracking-widest font-mono text-xl sm:text-2xl font-black text-[#072644] dark:text-[#9AE61C] px-4 py-2 rounded-xl bg-white dark:bg-[#0A1F36] border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {otpCode.split('').map((digit, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-900 dark:text-white"
                    >
                      {digit}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A1F36] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  title="Copy code to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline text-emerald-600 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                This code expires in 15 minutes.
              </div>
            </div>

            {/* Direct Action Link in Email */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToReset(email);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] dark:bg-[#9AE61C] dark:hover:bg-[#84CC16] text-white dark:text-[#072644] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Reset Password Now (Direct Link)</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                If you did not request this password recovery, please ignore this email or contact your company's MsmeBooks enterprise administrator immediately.
              </span>
            </div>
          </div>

          {/* Resend Timer Status in Modal */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071626] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs gap-3">
            <div className="text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-500 dark:text-slate-400 block text-[11px]">
                Email status:
              </span>
              <span>Didn't get the email?</span>
            </div>

            <div>
              {canResend ? (
                <button
                  type="button"
                  onClick={onResend}
                  className="font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:underline flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Resend Email Now
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
                  <span>Resend in</span>
                  <span className="font-mono font-bold text-[#072644] dark:text-white">
                    {formatCountdown(countdown)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-[#071626] border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <SecondaryButton onClick={onClose} size="sm" className="w-full sm:w-auto">
            Close Preview
          </SecondaryButton>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <PrimaryButton
              onClick={() => {
                onClose();
                onProceedToReset(email);
              }}
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Continue to Reset Password
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
