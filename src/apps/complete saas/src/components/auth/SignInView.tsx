import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, UserCheck, AlertCircle, ShieldAlert, Loader2, Check, QrCode, Smartphone, Fingerprint, ScanFace, Sparkles } from 'lucide-react';
import { InputField, PasswordField } from '../common/FormInputs';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { SecurityNotice } from '../common/Alerts';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';
import { UserRole, SecurityStateType } from '../../types';
import { LoginAttemptsCounter } from './LoginAttemptsCounter';
import { GoogleIcon, MicrosoftIcon, LinkedInIcon } from './SocialIcons';
import { QRCodeSignIn } from './QRCodeSignIn';

interface SignInViewProps {
  onSignIn: (email: string, role?: UserRole) => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onDirectRoleSignIn?: (role: UserRole) => void;
  onTriggerSecurityState?: (type: SecurityStateType) => void;
  initialMode?: 'password' | 'qrcode';
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSignIn,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onDirectRoleSignIn,
  onTriggerSecurityState,
  initialMode = 'password',
}) => {
  const MAX_ATTEMPTS = 5;
  const [authMode, setAuthMode] = useState<'password' | 'qrcode'>(initialMode);
  const [email, setEmail] = useState('john.adeyemi@abcsupermarket.ng');
  const [password, setPassword] = useState('MsmeBooks@2026');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'microsoft' | 'linkedin' | null>(null);

  // Biometric login state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricScanStep, setBiometricScanStep] = useState<'prompt' | 'scanning' | 'success'>('prompt');

  const handleStartBiometricAuth = () => {
    setIsBiometricModalOpen(true);
    setBiometricScanStep('prompt');
  };

  const handleExecuteBiometricScan = () => {
    setBiometricScanStep('scanning');
    setTimeout(() => {
      setBiometricScanStep('success');
      setTimeout(() => {
        setIsBiometricModalOpen(false);
        onSignIn(email || 'john.adeyemi@abcsupermarket.ng', 'business_owner');
      }, 950);
    }, 1200);
  };

  // Email validation: format + required
  const validateEmail = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Email address is required';
    }
    if (!trimmed.includes('@')) {
      return "Email must include an '@' symbol";
    }
    const [localPart, domainPart] = trimmed.split('@');
    if (!localPart) {
      return "Please enter username before '@'";
    }
    if (!domainPart) {
      return "Please enter domain after '@' (e.g., company.com)";
    }
    if (!domainPart.includes('.')) {
      return "Domain must include a '.' (e.g., company.com or biz.ng)";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid work email (e.g. name@company.com)';
    }
    return '';
  };

  // Password validation: required + length
  const validatePassword = (val: string): string => {
    if (!val) {
      return 'Password is required';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailTouched(true);
    const err = validateEmail(val);
    setEmailError(err);
    if (error && !isLocked) setError('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordTouched(true);
    const err = validatePassword(val);
    setPasswordError(err);
    if (error && !isLocked) setError('');
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const isEmailValid = emailTouched && !emailError && email.trim().length > 0;
  const isPasswordValid = passwordTouched && !passwordError && password.length >= 6;

  const handleSocialSignIn = (
    provider: 'google' | 'microsoft' | 'linkedin',
    defaultEmail: string
  ) => {
    if (isLocked) return;
    setOauthLoading(provider);
    setTimeout(() => {
      setOauthLoading(null);
      setFailedAttempts(0);
      setIsLocked(false);
      onSignIn(defaultEmail);
    }, 650);
  };

  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - failedAttempts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setError('Account is temporarily locked due to repeated failed login attempts. Please wait for the lockout timer to expire or reset your password.');
      return;
    }

    setEmailTouched(true);
    setPasswordTouched(true);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      return;
    }

    // Check credentials against standard authorized enterprise demo password
    if (password !== 'MsmeBooks@2026') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);

        if (nextFailed >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setError('Security Lockout: 5 failed attempts reached. Access is temporarily suspended for 15 minutes.');
        } else {
          const remaining = MAX_ATTEMPTS - nextFailed;
          setError(
            `Invalid password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before temporary account lockout.`
          );
        }
      }, 500);
      return;
    }

    // Success
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFailedAttempts(0);
      setIsLocked(false);
      onSignIn(email);
    }, 700);
  };

  const handleSimulateFailedAttempt = () => {
    if (isLocked) return;
    const nextFailed = failedAttempts + 1;
    setFailedAttempts(nextFailed);

    if (nextFailed >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setError('Security Lockout: 5 failed attempts reached. Your account has been temporarily locked for 15 minutes.');
    } else {
      const remaining = MAX_ATTEMPTS - nextFailed;
      setError(
        `Simulated failed attempt. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before temporary account lockout.`
      );
    }
  };

  const handleResetAttempts = () => {
    setFailedAttempts(0);
    setIsLocked(false);
    setError('');
  };

  const handleQuickDemo = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('MsmeBooks@2026');
    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError('');
    setPasswordError('');
    setFailedAttempts(0);
    setIsLocked(false);
    setError('');
    if (onDirectRoleSignIn) {
      onDirectRoleSignIn(role);
    } else {
      onSignIn(demoEmail, role);
    }
  };

  return (
    <AuthCard>
      {/* Card Header */}
      <div className="text-center space-y-2 mb-4">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="md" showTagline={false} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#072644] dark:text-white tracking-tight">
          {authMode === 'qrcode' ? 'Scan to Sign In' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {authMode === 'qrcode'
            ? 'Scan this QR code with your MsmeBooks Mobile app for instant passwordless access.'
            : 'Sign in to your MsmeBooks account and keep your business operations in sync.'}
        </p>
      </div>

      {/* Segmented Sign-In Mode Switcher: Password vs QR Code */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-4 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
        <button
          type="button"
          id="tab-signin-password"
          onClick={() => setAuthMode('password')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            authMode === 'password'
              ? 'bg-white dark:bg-[#0A1F36] text-[#072644] dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Password Sign-In</span>
        </button>

        <button
          type="button"
          id="tab-signin-qrcode"
          onClick={() => setAuthMode('qrcode')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            authMode === 'qrcode'
              ? 'bg-white dark:bg-[#0A1F36] text-[#072644] dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#84CC16]" />
          <span>Sign in with QR Code</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]">
            Fast
          </span>
        </button>
      </div>

      {/* QR Code Sign-In Mode */}
      {authMode === 'qrcode' ? (
        <QRCodeSignIn
          onSuccess={(approvedEmail, role) => {
            if (role && onDirectRoleSignIn) {
              onDirectRoleSignIn(role);
            } else {
              onSignIn(approvedEmail, role);
            }
          }}
          onSwitchToPassword={() => setAuthMode('password')}
        />
      ) : (
        <>
          {/* Visual Warning Counter for Failed Attempts Remaining */}
          <div className="mb-4">
            <LoginAttemptsCounter
              failedAttempts={failedAttempts}
              maxAttempts={MAX_ATTEMPTS}
              isLocked={isLocked}
              lockoutDurationSeconds={15 * 60}
              onLockout={() => setIsLocked(true)}
              onResetAttempts={handleResetAttempts}
              onUnlockEarly={handleResetAttempts}
              onForgotPassword={onNavigateToForgotPassword}
              onSimulateFailedAttempt={handleSimulateFailedAttempt}
              showSimulateControl={true}
            />
          </div>

          {/* Quick QR Code Shortcut Prompt */}
          <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-[#0F4C81]/5 via-[#84CC16]/10 to-transparent border border-[#0F4C81]/15 dark:border-[#84CC16]/20 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] dark:text-[#84CC16] flex items-center justify-center flex-shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-[#072644] dark:text-white text-[11px]">
                  Have the MsmeBooks Mobile app?
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Scan QR code for 1-click passwordless sign-in
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuthMode('qrcode')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[#0F4C81] dark:text-[#84CC16] border border-slate-200 dark:border-slate-700 text-[11px] font-bold hover:shadow-2xs transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              Sign in with QR Code
            </button>
          </div>

      {/* Sign-in Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && !isLocked && (
          <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={handleEmailBlur}
          error={emailTouched ? emailError : undefined}
          isValid={isEmailValid}
          reserveErrorSpace={true}
          placeholder="you@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          rightElement={
            isEmailValid ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#65A30D] dark:text-[#84CC16] animate-in fade-in duration-150">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Valid</span>
              </span>
            ) : null
          }
          isRequired
          autoComplete="email"
          disabled={isLocked}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onBlur={handlePasswordBlur}
          error={passwordTouched ? passwordError : undefined}
          isValid={isPasswordValid}
          reserveErrorSpace={true}
          placeholder="Enter your password"
          isRequired
          autoComplete="current-password"
          disabled={isLocked}
          helperText={
            failedAttempts > 0 && !isLocked && !passwordError
              ? `Authorized demo password: "MsmeBooks@2026"`
              : undefined
          }
        />

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLocked}
              className="w-4 h-4 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 dark:border-slate-700 cursor-pointer accent-[#0F4C81]"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={onNavigateToForgotPassword}
            className="font-semibold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-all duration-200 ease-out hover:translate-x-0.5 cursor-pointer underline decoration-transparent hover:decoration-current underline-offset-2"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary CTA */}
        <div className="pt-2 space-y-2">
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            disabled={isLocked}
            rightIcon={isLocked ? <Lock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            variant={isLocked ? 'secondary' : 'primary'}
          >
            {isLocked ? 'Sign In Locked (15m Cooldown)' : 'Sign In'}
          </PrimaryButton>

          {/* Biometric Instant Login Option */}
          <button
            type="button"
            id="signin-with-biometrics-btn"
            onClick={handleStartBiometricAuth}
            disabled={isLocked || isLoading}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-[#84CC16]/10 hover:border-[#84CC16]/50 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-2xs"
          >
            <Fingerprint className="w-4 h-4 text-[#0F4C81] dark:text-[#84CC16]" />
            <span>Sign In with Biometrics (Touch ID / Face ID)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]">
              Instant
            </span>
          </button>

          {/* Sign in with QR Code Option */}
          <button
            type="button"
            id="signin-with-qrcode-btn"
            onClick={() => setAuthMode('qrcode')}
            disabled={isLocked || isLoading}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-[#0F4C81]/10 hover:border-[#0F4C81]/50 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-2xs"
          >
            <QrCode className="w-4 h-4 text-[#0F4C81] dark:text-[#84CC16]" />
            <span>Sign in with QR Code (Mobile App)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#84CC16]">
              Mobile Sync
            </span>
          </button>

          {isLocked && onTriggerSecurityState && (
            <button
              type="button"
              onClick={() => onTriggerSecurityState('account-locked')}
              className="w-full py-2 px-3 rounded-xl border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 bg-red-50/50 dark:bg-red-950/40 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/80 hover:-translate-y-0.5 hover:shadow-xs flex items-center justify-center gap-1.5 transition-all duration-200 ease-out cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>View Dedicated Security Lockout Screen</span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white dark:bg-[#0A1F36] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Social OAuth Sign-in Options: Google, Microsoft, LinkedIn */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5" id="social-oauth-providers">
          {/* Google Button */}
          <button
            type="button"
            id="oauth-signin-google"
            title="Sign in with Google Workspace"
            aria-label="Sign in with Google"
            disabled={isLocked || isLoading || !!oauthLoading}
            onClick={() => handleSocialSignIn('google', 'google.auth@abcsupermarket.ng')}
            className={`group h-11 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ease-out select-none shadow-2xs ${
              isLocked || (!!oauthLoading && oauthLoading !== 'google')
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900'
                : oauthLoading === 'google'
                ? 'border-[#0F4C81] dark:border-[#84CC16] bg-[#0F4C81]/5 dark:bg-[#84CC16]/10 text-[#0F4C81] dark:text-[#84CC16] cursor-wait'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]'
            }`}
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0F4C81] dark:text-[#84CC16]" />
            ) : (
              <GoogleIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-110" />
            )}
            <span className="truncate">Google</span>
          </button>

          {/* Microsoft Button */}
          <button
            type="button"
            id="oauth-signin-microsoft"
            title="Sign in with Microsoft 365"
            aria-label="Sign in with Microsoft"
            disabled={isLocked || isLoading || !!oauthLoading}
            onClick={() => handleSocialSignIn('microsoft', 'microsoft.auth@abcsupermarket.ng')}
            className={`group h-11 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ease-out select-none shadow-2xs ${
              isLocked || (!!oauthLoading && oauthLoading !== 'microsoft')
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900'
                : oauthLoading === 'microsoft'
                ? 'border-[#0F4C81] dark:border-[#84CC16] bg-[#0F4C81]/5 dark:bg-[#84CC16]/10 text-[#0F4C81] dark:text-[#84CC16] cursor-wait'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]'
            }`}
          >
            {oauthLoading === 'microsoft' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0F4C81] dark:text-[#84CC16]" />
            ) : (
              <MicrosoftIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-110" />
            )}
            <span className="truncate">Microsoft</span>
          </button>

          {/* LinkedIn Button */}
          <button
            type="button"
            id="oauth-signin-linkedin"
            title="Sign in with LinkedIn"
            aria-label="Sign in with LinkedIn"
            disabled={isLocked || isLoading || !!oauthLoading}
            onClick={() => handleSocialSignIn('linkedin', 'linkedin.auth@abcsupermarket.ng')}
            className={`group h-11 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ease-out select-none shadow-2xs ${
              isLocked || (!!oauthLoading && oauthLoading !== 'linkedin')
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-900'
                : oauthLoading === 'linkedin'
                ? 'border-[#0F4C81] dark:border-[#84CC16] bg-[#0F4C81]/5 dark:bg-[#84CC16]/10 text-[#0F4C81] dark:text-[#84CC16] cursor-wait'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]'
            }`}
          >
            {oauthLoading === 'linkedin' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0F4C81] dark:text-[#84CC16]" />
            ) : (
              <LinkedInIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-110" />
            )}
            <span className="truncate">LinkedIn</span>
          </button>
        </div>

        {/* Secondary: Create Account */}
        <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
          <span>Don't have a MsmeBooks account? </span>
          <button
            type="button"
            id="create-account-link"
            onClick={onNavigateToSignUp}
            className="group inline-flex items-center gap-1 font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] transition-all duration-200 ease-out hover:translate-x-0.5 cursor-pointer"
          >
            <span className="underline decoration-[#0F4C81]/40 dark:decoration-[#9AE61C]/40 group-hover:decoration-current transition-colors">
              Create an account
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
        </div>

        {/* Security Message */}
        <div className="pt-2 text-center">
          <SecurityNotice text="Secure business access" />
        </div>
      </form>

      {/* Quick Demo Role Picker for Rapid Evaluation */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[#84CC16]" /> Instant Demo Sign-In
          </span>
          <span className="text-[10px] text-slate-400">Select any role to test</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('business_owner', 'kemi.adeyemi@abcsupermarket.ng')}
            className="group text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#84CC16]/10 hover:border-[#84CC16]/40 dark:hover:border-[#84CC16]/50 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 ease-out text-[11px] cursor-pointer"
          >
            <div className="font-bold text-[#072644] dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-[#9AE61C] transition-colors">Business Owner</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Executive Access</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('finance_manager', 'ibrahim.danladi@xyzdist.ng')}
            className="group text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#84CC16]/10 hover:border-[#84CC16]/40 dark:hover:border-[#84CC16]/50 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 ease-out text-[11px] cursor-pointer"
          >
            <div className="font-bold text-[#072644] dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-[#9AE61C] transition-colors">Finance Manager</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Accounting & Tax</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('store_manager', 'nneka.eze@primehealth.ng')}
            className="group text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#84CC16]/10 hover:border-[#84CC16]/40 dark:hover:border-[#84CC16]/50 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 ease-out text-[11px] cursor-pointer"
          >
            <div className="font-bold text-[#072644] dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-[#9AE61C] transition-colors">Store Manager</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Inventory & Branch</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('pos_operator', 'cashier.chinedu@abcsupermarket.ng')}
            className="group text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-[#84CC16]/10 hover:border-[#84CC16]/40 dark:hover:border-[#84CC16]/50 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 ease-out text-[11px] cursor-pointer"
          >
            <div className="font-bold text-[#072644] dark:text-white group-hover:text-[#0F4C81] dark:group-hover:text-[#9AE61C] transition-colors">POS Cashier</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Checkout Only</div>
          </button>
        </div>
      </div>
      </>
      )}

      {/* Biometric Verification Simulation Modal */}
      {isBiometricModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#071626] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsBiometricModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs cursor-pointer font-bold"
            >
              ✕
            </button>

            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0F4C81]/10 text-[#0F4C81] dark:text-[#84CC16] flex items-center justify-center">
              <Fingerprint className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#072644] dark:text-white">
                Biometric Login
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authenticate with Touch ID or Face ID for{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {email}
                </span>
              </p>
            </div>

            {/* Visual Scanner Arena with animated beam & radar pulse */}
            <div className="relative mx-auto w-32 h-32 rounded-2xl border-2 border-dashed border-[#0F4C81]/30 dark:border-[#84CC16]/40 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0A1F36]">
              {biometricScanStep === 'scanning' && (
                <>
                  <div className="absolute inset-2 rounded-xl bg-[#84CC16]/15 animate-bio-radar pointer-events-none" />
                  <div className="absolute left-2 right-2 h-0.5 bg-[#84CC16] shadow-[0_0_8px_#84CC16] animate-scan-beam pointer-events-none" />
                </>
              )}

              {biometricScanStep === 'success' ? (
                <div className="flex flex-col items-center justify-center animate-success-pop">
                  <div className="w-12 h-12 rounded-full bg-[#84CC16] text-[#072644] flex items-center justify-center shadow-lg shadow-[#84CC16]/40 mb-1">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-black text-[#65A30D] dark:text-[#84CC16] uppercase tracking-wider">
                    Verified!
                  </span>
                </div>
              ) : (
                <Fingerprint
                  className={`w-14 h-14 transition-all duration-300 ${
                    biometricScanStep === 'scanning'
                      ? 'text-[#84CC16] scale-105'
                      : 'text-[#0F4C81] dark:text-slate-300 opacity-80'
                  }`}
                />
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {biometricScanStep === 'prompt' && 'Touch fingerprint reader or face sensor to continue.'}
              {biometricScanStep === 'scanning' && 'Verifying hardware enclave token (FIDO2)...'}
              {biometricScanStep === 'success' && 'Biometric identity verified! Redirecting to workspace...'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              {biometricScanStep === 'prompt' && (
                <button
                  type="button"
                  id="simulate-touch-id-sensor-btn"
                  onClick={handleExecuteBiometricScan}
                  className="flex-1 py-2 px-3 bg-[#84CC16] hover:bg-[#65A30D] text-[#072644] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Tap to Simulate Touch</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsBiometricModalOpen(false)}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthCard>
  );
};

export const SignInCard = SignInView;
