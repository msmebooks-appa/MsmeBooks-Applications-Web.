import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { PasswordField } from '../common/FormInputs';
import { PrimaryButton } from '../common/Buttons';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import {
  PasswordStrengthIndicator,
  evaluatePasswordEntropy,
} from './PasswordStrengthIndicator';

interface ResetPasswordViewProps {
  onSuccessSignIn: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  onSuccessSignIn,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password entropy evaluation
  const entropyResult = evaluatePasswordEntropy(newPassword);
  const allRequirementsMet = entropyResult.rules.every((r) => r.met);
  const isEntropyAcceptable = entropyResult.entropyBits >= 40;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequirementsMet) {
      setError('Please satisfy all password security requirements.');
      return;
    }
    if (!isEntropyAcceptable) {
      setError('Password entropy is too low. Please add special symbols or numbers.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 700);
  };

  return (
    <AuthCard>
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center mx-auto mb-1">
          <Lock className="w-6 h-6 text-[#0F4C81]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Create a New Password
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Ensure your account stays protected with enterprise-grade credentials.
        </p>
      </div>

      {isSuccess ? (
        <div className="text-center space-y-4 py-3 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 border-2 border-[#84CC16] text-[#65A30D] flex items-center justify-center mx-auto shadow-md shadow-[#84CC16]/20">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-[#072644]">
              Password Updated Successfully
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Your password has been updated across all authorized devices. You can now sign in securely.
            </p>
          </div>

          <div className="pt-2">
            <PrimaryButton onClick={onSuccessSignIn} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign In Now
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl text-left">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError('');
              }}
              isRequired
              showStrengthMeter={false}
            />

            {/* Real-time Entropy-based Password Strength Meter with Red/Yellow/Green Feedback */}
            {newPassword.length > 0 && (
              <PasswordStrengthIndicator
                password={newPassword}
                showRulesList={true}
                showEntropyDetails={true}
              />
            )}
          </div>

          <PasswordField
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError('');
            }}
            isRequired
            showStrengthMeter={false}
            helperText={
              confirmPassword.length > 0
                ? confirmPassword === newPassword
                  ? '✓ Passwords match'
                  : 'Passwords do not match yet'
                : undefined
            }
          />

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              isLoading={isLoading}
              disabled={!allRequirementsMet || newPassword !== confirmPassword}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Reset Password
            </PrimaryButton>
          </div>
        </form>
      )}
    </AuthCard>
  );
};
