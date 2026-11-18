import React, { useState } from 'react';
import {
  Lock,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: (newPassword: string) => void;
  userEmail?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onPasswordChanged,
  userEmail = 'john.adeyemi@abcsupermarket.ng',
}) => {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password Complexity Validation Rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid =
    currentPassword.length > 0 &&
    hasMinLength &&
    hasUppercase &&
    hasNumber &&
    hasSymbol &&
    passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('Please enter your existing password for verification.');
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSymbol) {
      setErrorMsg('New password does not meet enterprise security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg('New password cannot be identical to your current password per security policy.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onPasswordChanged(newPassword);
      toast.success(
        'Password Updated Successfully',
        'Your credentials have been securely renewed. The expiration countdown has been reset.'
      );
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#072644] to-[#0F4C81] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#84CC16]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 id="change-password-modal-title" className="text-base font-bold">
                Update Workspace Password
              </h3>
              <p className="text-xs text-slate-300">
                Reset your credential for {userEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-left">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] dark:focus:ring-[#84CC16]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] dark:focus:ring-[#84CC16]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] dark:focus:ring-[#84CC16]"
            />
          </div>

          {/* Password Requirements Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Enterprise Complexity Rules:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div
                className={`flex items-center gap-1.5 ${
                  hasMinLength
                    ? 'text-[#65A30D] dark:text-[#84CC16] font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>At least 8 characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasUppercase
                    ? 'text-[#65A30D] dark:text-[#84CC16] font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1 uppercase letter</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasNumber
                    ? 'text-[#65A30D] dark:text-[#84CC16] font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1 numeric character</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasSymbol
                    ? 'text-[#65A30D] dark:text-[#84CC16] font-semibold'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1 symbol (!@#$%)</span>
              </div>
            </div>
            {newPassword && confirmPassword && (
              <div
                className={`pt-1 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center gap-1.5 ${
                  passwordsMatch
                    ? 'text-[#65A30D] dark:text-[#84CC16] font-semibold'
                    : 'text-rose-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                isFormValid && !isSubmitting
                  ? 'bg-[#0F4C81] hover:bg-[#072644] text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
              <span>{isSubmitting ? 'Updating...' : 'Confirm & Reset Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
