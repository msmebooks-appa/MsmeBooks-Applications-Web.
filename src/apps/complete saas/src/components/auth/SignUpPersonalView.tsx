import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { InputField, PasswordField } from '../common/FormInputs';
import { PrimaryButton } from '../common/Buttons';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import {
  PasswordStrengthIndicator,
  evaluatePasswordStrength,
} from './PasswordStrengthIndicator';

interface SignUpPersonalViewProps {
  initialData: {
    firstName: string;
    lastName: string;
    workEmail: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  };
  onContinue: (data: {
    firstName: string;
    lastName: string;
    workEmail: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onNavigateToSignIn: () => void;
}

export const SignUpPersonalView: React.FC<SignUpPersonalViewProps> = ({
  initialData,
  onContinue,
  onNavigateToSignIn,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.workEmail.trim() || !formData.workEmail.includes('@')) {
      newErrors.workEmail = 'Valid work email is required';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      const strength = evaluatePasswordStrength(formData.password);
      if (strength.score < 2) {
        newErrors.password = 'Password entropy is too low. Please add uppercase, numbers, or symbols to reach at least Moderate entropy.';
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onContinue(formData);
    }
  };

  return (
    <AuthCard>
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} className="mb-4" />

      {/* Header */}
      <div className="text-center space-y-1.5 mb-6">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
          Create Your MsmeBooks Account
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Start managing your accounting, sales, inventory and business operations from one powerful platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Step Header */}
        <div className="text-left pb-1 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
            Step 1 — Personal Information
          </span>
          <span className="text-[11px] text-slate-400">1 of 5</span>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
            isRequired
            leftIcon={<User className="w-4 h-4" />}
          />
          <InputField
            label="Last Name"
            placeholder="Adeyemi"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
            isRequired
          />
        </div>

        {/* Email */}
        <InputField
          label="Work Email"
          type="email"
          placeholder="john.adeyemi@company.com"
          value={formData.workEmail}
          onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
          error={errors.workEmail}
          isRequired
          leftIcon={<Mail className="w-4 h-4" />}
        />

        {/* Phone */}
        <InputField
          label="Phone Number"
          type="tel"
          placeholder="+234 803 123 4567"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          error={errors.phoneNumber}
          isRequired
          leftIcon={<Phone className="w-4 h-4" />}
          helperText="Used for two-factor authentication and SMS alerts."
        />

        {/* Password with Real-Time Strength Feedback */}
        <div className="space-y-2">
          <PasswordField
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: '' }));
              }
            }}
            error={errors.password}
            isRequired
            showStrengthMeter={false}
          />

          {/* Real-Time Password Strength Visual Indicator with Color-Coded Intensity based on Entropy */}
          {formData.password.length > 0 && (
            <PasswordStrengthIndicator
              password={formData.password}
              showRulesList={true}
              showEntropyDetails={true}
            />
          )}
        </div>

        {/* Confirm Password with Match Indicator */}
        <PasswordField
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }
          }}
          error={errors.confirmPassword}
          isRequired
          showStrengthMeter={false}
          helperText={
            formData.confirmPassword.length > 0
              ? formData.confirmPassword === formData.password
                ? '✓ Passwords match'
                : 'Passwords do not match yet'
              : undefined
          }
        />

        {/* Terms notice */}
        <p className="text-[11px] text-slate-500 text-left pt-1 leading-normal">
          By continuing, you agree to MsmeBooks{' '}
          <a
            href="#terms"
            className="text-[#0F4C81] dark:text-[#9AE61C] font-semibold underline hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-colors duration-150"
          >
            Terms of Service
          </a>{' '}
          and acknowledge our{' '}
          <a
            href="#privacy"
            className="text-[#0F4C81] dark:text-[#9AE61C] font-semibold underline hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-colors duration-150"
          >
            Privacy Policy
          </a>
          .
        </p>

        {/* CTA */}
        <div className="pt-2">
          <PrimaryButton type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue
          </PrimaryButton>
        </div>

        {/* Back to sign in */}
        <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
          <span>Already have a MsmeBooks account? </span>
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="group inline-flex items-center gap-1 font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-all duration-200 ease-out hover:translate-x-0.5 cursor-pointer"
          >
            <span className="underline decoration-[#0F4C81]/40 dark:decoration-[#9AE61C]/40 group-hover:decoration-current transition-colors">
              Sign in
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </AuthCard>
  );
};
