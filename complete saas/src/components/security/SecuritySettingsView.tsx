import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Laptop,
  Key,
  Lock,
  Mail,
  Phone,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Clock,
  Check,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Info,
  Calendar,
  Grid3x3,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { MOCK_ACTIVE_SESSIONS, MOCK_SECURITY_LOGS } from '../../data/mockData';
import { TwoFactorMethod, UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';
import { PasswordExpiryWarningBanner } from './PasswordExpiryWarningBanner';
import { ChangePasswordModal } from './ChangePasswordModal';
import { PatternLockModal } from './PatternLockModal';
import { PatternLock } from './PatternLock';
import { BiometricSettingsCard } from './BiometricSettingsCard';

interface SecuritySettingsViewProps {
  onBackToDashboard: () => void;
  userEmail?: string;
  userPhone?: string;
  role?: UserRole;
  userName?: string;
  companyName?: string;
  onNavigateToResetPassword?: () => void;
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({
  onBackToDashboard,
  userEmail = 'john.adeyemi@abcsupermarket.ng',
  userPhone = '+234 803 123 4567',
  role = 'business_owner',
  userName = 'John',
  companyName = 'ABC Supermarket Ltd',
  onNavigateToResetPassword,
}) => {
  const toast = useToast();
  const [sessions, setSessions] = useState(MOCK_ACTIVE_SESSIONS);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [preferred2FAMethod, setPreferred2FAMethod] = useState<TwoFactorMethod>('sms');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState('');

  // Password Expiry Policy State
  const [passwordExpiryEnabled, setPasswordExpiryEnabled] = useState(true);
  const [expiryIntervalDays, setExpiryIntervalDays] = useState<30 | 60 | 90>(90);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(5); // Default 5 days to demonstrate warning banner
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [lastPasswordChanged, setLastPasswordChanged] = useState('18 Sep 2026 (75 days ago)');
  const [notifyDaysBefore, setNotifyDaysBefore] = useState(7);
  const [preventReuse, setPreventReuse] = useState(true);
  const [requireComplexity, setRequireComplexity] = useState(true);

  // Pattern Lock (Android-Style Gesture 2FA) State for Mobile-First Users
  const [patternLockEnabled, setPatternLockEnabled] = useState(true);
  const [savedPattern, setSavedPattern] = useState<number[] | null>([0, 1, 2, 4, 6]);
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [patternModalTab, setPatternModalTab] = useState<'setup' | 'test'>('setup');
  const [showInlineGrid, setShowInlineGrid] = useState(true);
  const [inlineGridMode, setInlineGridMode] = useState<'record' | 'verify'>('verify');
  const [inlineTestStatus, setInlineTestStatus] = useState<string | null>(null);
  const [showPatternTrail, setShowPatternTrail] = useState(true);
  const [patternHapticEnabled, setPatternHapticEnabled] = useState(true);
  const [requirePatternOnMobile, setRequirePatternOnMobile] = useState(true);

  const handleSavePattern = (newPattern: number[]) => {
    setSavedPattern(newPattern);
    setPatternLockEnabled(true);
    setInlineGridMode('verify');
    setInlineTestStatus('saved');
    toast.success(
      'Pattern Lock Configured',
      `Android-style 3x3 gesture lock with ${newPattern.length} nodes saved for mobile 2FA verification.`
    );
  };

  const handleClearPattern = () => {
    setSavedPattern(null);
    if (preferred2FAMethod === 'pattern') {
      setPreferred2FAMethod('sms');
    }
    toast.info(
      'Pattern Lock Cleared',
      'Gesture pattern removed. Secondary verification reverted to SMS delivery.'
    );
  };

  // Check admin authorization
  const isAdmin = [
    'super_admin',
    'business_owner',
    'administrator',
    'finance_manager',
  ].includes(role);

  const backupCodes = [
    'MSME-4910-8201',
    'MSME-7729-1094',
    'MSME-3301-9982',
    'MSME-8472-1209',
    'MSME-5510-4493',
  ];

  const handleLogoutOtherDevices = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success(
      'Sessions Terminated',
      'All other active terminal and device sessions have been invalidated.'
    );
  };

  const handleTogglePasswordExpiry = (enabled: boolean) => {
    if (!isAdmin) {
      toast.error(
        'Permission Restricted',
        'Only organization administrators can modify password expiration policies.'
      );
      return;
    }
    setPasswordExpiryEnabled(enabled);
    if (enabled) {
      toast.success(
        'Password Expiry Policy Enabled',
        `Mandatory password resets every ${expiryIntervalDays} days are now enforced for all ${companyName} team accounts.`
      );
    } else {
      toast.info(
        'Password Expiry Policy Disabled',
        'Automatic credential expiration turned off. Passwords will remain valid indefinitely until manually changed.'
      );
    }
  };

  const handleSelectInterval = (interval: 30 | 60 | 90) => {
    if (!isAdmin) {
      toast.error(
        'Permission Restricted',
        'Only organization administrators can modify password expiration intervals.'
      );
      return;
    }
    setExpiryIntervalDays(interval);
    toast.info(
      'Rotation Cycle Updated',
      `Policy set to ${interval} days. Click "Apply & Broadcast Policy" to update workspace enforcement.`
    );
  };

  const handleSavePolicy = () => {
    if (!isAdmin) {
      toast.error(
        'Permission Restricted',
        'Only organization administrators can broadcast enterprise security policies.'
      );
      return;
    }
    toast.success(
      'Password Expiry Policy Broadcasted',
      `All users across ${companyName} branches are mandated to rotate credentials every ${expiryIntervalDays} days.`
    );
  };

  const handlePasswordChanged = () => {
    setLastPasswordChanged('Just now');
    setDaysUntilExpiry(expiryIntervalDays);
    setWarningDismissed(false);
  };

  const handleSimulateDays = (days: number) => {
    setDaysUntilExpiry(days);
    setWarningDismissed(false);
    toast.info(
      'Simulation Updated',
      `Simulating ${days} days until password expiration.`
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-[#0A1F36] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-[#9AE61C] flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#072644] dark:text-white">
                Security & Login Settings
              </h2>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-[#9AE61C]/20 dark:text-[#9AE61C]">
                  Admin Cleared
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage multi-factor authentication, enterprise password rotation policies, and active sessions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToDashboard}
          className="text-xs font-bold text-[#0F4C81] dark:text-[#9AE61C] hover:text-[#0A365C] dark:hover:text-[#84CC16] flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>
      </div>

      {alertSuccess && (
        <div className="p-3 rounded-xl bg-[#84CC16]/20 border border-[#84CC16] text-[#072644] dark:text-[#9AE61C] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-[#84CC16]" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* =========================================================================
          WARNING BANNER: For users nearing password expiration date (within 30 days)
          ========================================================================= */}
      {passwordExpiryEnabled && !warningDismissed && daysUntilExpiry <= 30 && (
        <PasswordExpiryWarningBanner
          daysUntilExpiry={daysUntilExpiry}
          expiryIntervalDays={expiryIntervalDays}
          companyName={companyName}
          onUpdatePassword={() => setIsPasswordModalOpen(true)}
          onNavigateToResetFlow={onNavigateToResetPassword}
          onDismiss={() => {
            setWarningDismissed(true);
            toast.info(
              'Expiration Banner Snoozed',
              'We will alert you again within 24 hours prior to deadline.'
            );
          }}
          onSimulateDays={handleSimulateDays}
        />
      )}

      {/* Appearance & Color Scheme Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#071626]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#9AE61C] flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#072644] dark:text-white">
              Display & Color Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronize light, dark, or system appearance across the MsmeBooks portal.
            </p>
          </div>
        </div>

        <ThemeToggle variant="segmented" showLabels />
      </div>

      {/* =========================================================================
          PASSWORD EXPIRY POLICY CARD
          Allows enforcing periodic password resets every 30, 60, or 90 days
          ========================================================================= */}
      <div id="password-expiry-policy-section" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#071626]/50 space-y-5">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F4C81]/15 text-[#0F4C81] dark:text-[#9AE61C] flex items-center justify-center shrink-0">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#072644] dark:text-white">
                  Password Expiry Policy
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  passwordExpiryEnabled
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {passwordExpiryEnabled ? 'Enforced' : 'Disabled'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-[#9AE61C]/20 dark:text-[#9AE61C] border border-[#0F4C81]/20 dark:border-[#9AE61C]/30">
                  {isAdmin ? 'Admin Clearance' : 'Organization Managed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enforce mandatory resets every 30, 60, or 90 days for all team accounts to maintain proactive security hygiene.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden sm:inline">
              {passwordExpiryEnabled ? 'Enabled' : 'Off'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                id="toggle-password-expiry-policy"
                name="toggle-password-expiry-policy"
                aria-label="Enforce Password Expiry Policy"
                checked={passwordExpiryEnabled}
                onChange={(e) => handleTogglePasswordExpiry(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C81] dark:peer-checked:bg-[#0F4C81]" />
            </label>
          </div>
        </div>

        {passwordExpiryEnabled ? (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Enforce Resets Every:
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Current policy: Resets every <strong className="text-[#072644] dark:text-white">{expiryIntervalDays} days</strong>
                </span>
              </div>

              {/* 30, 60, 90 Day Preset Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 30 Days */}
                <button
                  type="button"
                  id="btn-expiry-interval-30"
                  onClick={() => handleSelectInterval(30)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 ease-out cursor-pointer relative hover:-translate-y-0.5 active:translate-y-0 ${
                    expiryIntervalDays === 30
                      ? 'border-[#84CC16] bg-[#84CC16]/10 dark:bg-[#84CC16]/10 ring-2 ring-[#84CC16]/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-[#072644] dark:text-white">
                      30 Days
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      High Security
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Monthly reset cycle recommended for high-volume POS operators and bank treasurers.
                  </p>
                  {expiryIntervalDays === 30 && (
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#65A30D] dark:text-[#84CC16]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Policy</span>
                    </div>
                  )}
                </button>

                {/* 60 Days */}
                <button
                  type="button"
                  id="btn-expiry-interval-60"
                  onClick={() => handleSelectInterval(60)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 ease-out cursor-pointer relative hover:-translate-y-0.5 active:translate-y-0 ${
                    expiryIntervalDays === 60
                      ? 'border-[#84CC16] bg-[#84CC16]/10 dark:bg-[#84CC16]/10 ring-2 ring-[#84CC16]/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-[#072644] dark:text-white">
                      60 Days
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                      Balanced
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Bi-monthly schedule suited for multi-branch retail supervisors and warehouse clerks.
                  </p>
                  {expiryIntervalDays === 60 && (
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#65A30D] dark:text-[#84CC16]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Policy</span>
                    </div>
                  )}
                </button>

                {/* 90 Days */}
                <button
                  type="button"
                  id="btn-expiry-interval-90"
                  onClick={() => handleSelectInterval(90)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 ease-out cursor-pointer relative hover:-translate-y-0.5 active:translate-y-0 ${
                    expiryIntervalDays === 90
                      ? 'border-[#84CC16] bg-[#84CC16]/10 dark:bg-[#84CC16]/10 ring-2 ring-[#84CC16]/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-[#072644] dark:text-white">
                      90 Days
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]">
                      Corporate Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Standard quarterly cadence compliant with NDPR, CBN guidelines, and ISO 27001.
                  </p>
                  {expiryIntervalDays === 90 && (
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#65A30D] dark:text-[#84CC16]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Policy</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Warning Banner & Expiry Status Details */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-200 block">
                    Password Expiration Warning Status:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Warning banners automatically appear when a user is within 30 days of expiration.
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-direct-reset-password-flow"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F4C81] text-white hover:bg-[#072644] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>Open Reset Flow</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C81] dark:text-[#84CC16]" />
                  <span>
                    Current Status:{' '}
                    <strong className={daysUntilExpiry <= 30 ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                      {daysUntilExpiry} days remaining
                    </strong>
                    {daysUntilExpiry <= 30 ? ' (Warning banner is active)' : ' (Safe - banner is hidden)'}
                  </span>
                </div>

                {warningDismissed && daysUntilExpiry <= 30 && (
                  <button
                    type="button"
                    onClick={() => setWarningDismissed(false)}
                    className="text-[11px] text-[#0F4C81] dark:text-[#9AE61C] font-bold hover:underline cursor-pointer"
                  >
                    Restore Warning Banner
                  </button>
                )}
              </div>
            </div>

            {/* Additional Policy Guardrails */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 block">
                Enterprise Password Enforcements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyDaysBefore === 7}
                    onChange={(e) => setNotifyDaysBefore(e.target.checked ? 7 : 0)}
                    disabled={!isAdmin}
                    className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                  />
                  <span>Warn users 7 days prior to expiry</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preventReuse}
                    onChange={(e) => setPreventReuse(e.target.checked)}
                    disabled={!isAdmin}
                    className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                  />
                  <span>Prevent reuse of last 3 passwords</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireComplexity}
                    onChange={(e) => setRequireComplexity(e.target.checked)}
                    disabled={!isAdmin}
                    className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                  />
                  <span>Enforce symbols, numbers & uppercase</span>
                </label>
              </div>
            </div>

            {/* Admin Policy Action Bar */}
            {isAdmin && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
                  <span>Enforces immediate compliance across all branches and accounts</span>
                </div>

                <button
                  type="button"
                  onClick={handleSavePolicy}
                  className="px-4 py-2 bg-[#0F4C81] hover:bg-[#072644] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>Save & Broadcast Expiry Policy</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center py-5 text-xs text-slate-500 dark:text-slate-400">
            <Lock className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-slate-400" />
            <p className="font-bold text-slate-700 dark:text-slate-300">
              Password Expiry Policy is Disabled
            </p>
            <p className="text-[11px] mt-0.5 max-w-md mx-auto">
              Passwords will remain valid indefinitely until manually changed. Toggle the switch above to enforce periodic resets every 30, 60, or 90 days.
            </p>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#071626]/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#84CC16]/20 text-[#65A30D] flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#072644] dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mandatory for high-value invoice approvals and multi-branch ledger edits.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C81]" />
          </label>
        </div>

        {twoFactorEnabled && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                Default 2FA Verification Method:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPreferred2FAMethod('sms')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer ${
                    preferred2FAMethod === 'sms'
                      ? 'border-[#84CC16] bg-[#84CC16]/10 font-bold text-[#072644] dark:text-white ring-1 ring-[#84CC16]/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] text-slate-600 dark:text-slate-300 hover:border-[#0F4C81]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                    <div>
                      <div className="font-bold">SMS Code</div>
                      <div className="text-[10px] text-slate-500 font-normal">{userPhone}</div>
                    </div>
                  </div>
                  {preferred2FAMethod === 'sms' && <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPreferred2FAMethod('email')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer ${
                    preferred2FAMethod === 'email'
                      ? 'border-[#84CC16] bg-[#84CC16]/10 font-bold text-[#072644] dark:text-white ring-1 ring-[#84CC16]/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] text-slate-600 dark:text-slate-300 hover:border-[#0F4C81]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                    <div>
                      <div className="font-bold">Email OTP</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-[90px]">Registered inbox</div>
                    </div>
                  </div>
                  {preferred2FAMethod === 'email' && <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPreferred2FAMethod('authenticator')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer ${
                    preferred2FAMethod === 'authenticator'
                      ? 'border-[#84CC16] bg-[#84CC16]/10 font-bold text-[#072644] dark:text-white ring-1 ring-[#84CC16]/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] text-slate-600 dark:text-slate-300 hover:border-[#0F4C81]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                    <div>
                      <div className="font-bold">Authenticator</div>
                      <div className="text-[10px] text-slate-500 font-normal">TOTP Google/Authy</div>
                    </div>
                  </div>
                  {preferred2FAMethod === 'authenticator' && (
                    <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
                  )}
                </button>

                <button
                  type="button"
                  id="btn-2fa-method-pattern"
                  onClick={() => {
                    setPreferred2FAMethod('pattern');
                    if (!savedPattern) {
                      setIsPatternModalOpen(true);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 cursor-pointer ${
                    preferred2FAMethod === 'pattern'
                      ? 'border-[#84CC16] bg-[#84CC16]/10 font-bold text-[#072644] dark:text-white ring-1 ring-[#84CC16]/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] text-slate-600 dark:text-slate-300 hover:border-[#0F4C81]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Grid3x3 className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">Pattern Lock</span>
                        <span className="px-1 py-0.2 rounded text-[8px] font-black uppercase bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]">
                          Mobile
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {savedPattern ? `${savedPattern.length}-dot gesture` : 'Tap to setup'}
                      </div>
                    </div>
                  </div>
                  {preferred2FAMethod === 'pattern' && <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />}
                </button>
              </div>
            </div>

            {/* Android-Style Pattern Lock Configuration Sub-Panel */}
            <div
              id="pattern-lock-configuration-section"
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0F4C81]/10 text-[#0F4C81] dark:text-[#9AE61C] flex items-center justify-center shrink-0 mt-0.5">
                    <Grid3x3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#072644] dark:text-white">
                        Pattern Lock 2FA Configuration
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#84CC16]/15 text-[#65A30D] dark:text-[#84CC16] border border-[#84CC16]/30">
                        Mobile-Friendly Alternative
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Visual 3x3 gesture grid input component for secondary two-factor authentication (2FA). Designed for smartphones, tablets, and POS touchscreen terminals without cellular SMS delivery delays or network outages.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    id="toggle-pattern-lock-2fa"
                    name="toggle-pattern-lock-2fa"
                    aria-label="Enable Pattern Lock 2FA Configuration"
                    checked={patternLockEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPatternLockEnabled(checked);
                      if (!checked && preferred2FAMethod === 'pattern') {
                        setPreferred2FAMethod('sms');
                      }
                      toast.info(
                        checked ? 'Pattern Lock 2FA Enabled' : 'Pattern Lock 2FA Disabled',
                        checked
                          ? 'Mobile gesture verification is ready to be drawn and saved.'
                          : 'Secondary factor will use SMS or Authenticator app.'
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F4C81]" />
                </label>
              </div>

              {patternLockEnabled && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-[#071626] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs">
                      {savedPattern ? (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#84CC16] shadow-xs" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Saved 2FA Pattern:
                          </span>
                          <span className="text-[11px] text-[#65A30D] dark:text-[#84CC16] font-bold">
                            {savedPattern.length}-Node Gesture Sequence Active
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            No Pattern Recorded:
                          </span>
                          <span className="text-[11px] text-amber-600 dark:text-amber-400">
                            Draw gesture pattern below to save for 2FA
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        id="btn-pattern-draw-new"
                        onClick={() => {
                          setShowInlineGrid(true);
                          setInlineGridMode('record');
                          setInlineTestStatus(null);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          showInlineGrid && inlineGridMode === 'record'
                            ? 'bg-[#0F4C81] text-white shadow-2xs'
                            : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        Create / Draw Pattern
                      </button>

                      <button
                        type="button"
                        id="btn-pattern-test-verify"
                        onClick={() => {
                          setShowInlineGrid(true);
                          setInlineGridMode('verify');
                          setInlineTestStatus(null);
                        }}
                        disabled={!savedPattern}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          showInlineGrid && inlineGridMode === 'verify'
                            ? 'bg-[#84CC16] text-[#072644] font-bold shadow-2xs'
                            : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40'
                        }`}
                      >
                        Verify Pattern
                      </button>

                      <button
                        type="button"
                        id="btn-pattern-reconfigure-modal"
                        onClick={() => {
                          setPatternModalTab(savedPattern ? 'setup' : 'setup');
                          setIsPatternModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0F4C81] hover:bg-[#072644] text-white transition-all shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        {savedPattern ? 'Full Modal Setup' : 'Set Up in Modal'}
                      </button>

                      {savedPattern && (
                        <button
                          type="button"
                          id="btn-clear-pattern"
                          onClick={handleClearPattern}
                          className="px-2 py-1 rounded-md text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Interactive Pattern Grid Canvas */}
                  {showInlineGrid && (
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#071626] border border-slate-200 dark:border-slate-800 flex flex-col items-center space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between w-full max-w-[280px]">
                        <span className="text-xs font-bold text-[#072644] dark:text-white flex items-center gap-1.5">
                          <Grid3x3 className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C]" />
                          Visual 3x3 Grid Input
                        </span>

                        {/* Inline Mode Switcher */}
                        <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setInlineGridMode('verify');
                              setInlineTestStatus(null);
                            }}
                            disabled={!savedPattern}
                            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                              inlineGridMode === 'verify'
                                ? 'bg-white dark:bg-[#0B1E33] text-[#072644] dark:text-white shadow-2xs'
                                : 'text-slate-500 hover:text-slate-700 disabled:opacity-40'
                            }`}
                          >
                            Test Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInlineGridMode('record');
                              setInlineTestStatus(null);
                            }}
                            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                              inlineGridMode === 'record'
                                ? 'bg-white dark:bg-[#0B1E33] text-[#072644] dark:text-white shadow-2xs'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            Draw New
                          </button>
                        </div>
                      </div>

                      <PatternLock
                        key={`inline-${inlineGridMode}-${savedPattern ? savedPattern.join('-') : 'none'}`}
                        size={250}
                        minNodes={4}
                        mode={inlineGridMode === 'record' ? 'record' : 'verify'}
                        targetPattern={savedPattern || [0, 1, 2, 4, 6]}
                        showTrail={showPatternTrail}
                        onSuccess={(pattern) => {
                          if (inlineGridMode === 'record') {
                            handleSavePattern(pattern);
                          } else {
                            setInlineTestStatus('success');
                            toast.success(
                              'Gesture Verified',
                              'Fast mobile/touchscreen authentication authorized.'
                            );
                          }
                        }}
                        onError={() => {
                          setInlineTestStatus('error');
                        }}
                        promptText={
                          inlineGridMode === 'record'
                            ? 'Draw 4+ connected dots to record'
                            : 'Draw pattern gesture to verify'
                        }
                      />

                      {/* Quick Presets for Rapid Evaluation */}
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] flex-wrap justify-center">
                        <span className="text-slate-400 font-semibold">Test Presets:</span>
                        <button
                          type="button"
                          id="btn-preset-z-shape"
                          onClick={() => handleSavePattern([0, 1, 2, 4, 6, 7, 8])}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-[#84CC16]/20 hover:text-[#65A30D] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          Z-Shape
                        </button>
                        <button
                          type="button"
                          id="btn-preset-l-shape"
                          onClick={() => handleSavePattern([0, 3, 6, 7, 8])}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-[#84CC16]/20 hover:text-[#65A30D] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          L-Shape
                        </button>
                        <button
                          type="button"
                          id="btn-preset-c-shape"
                          onClick={() => handleSavePattern([0, 1, 2, 5, 8, 7, 6])}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-[#84CC16]/20 hover:text-[#65A30D] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          C-Shape
                        </button>
                        <button
                          type="button"
                          id="btn-preset-n-shape"
                          onClick={() => handleSavePattern([6, 3, 0, 4, 8, 5, 2])}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-[#84CC16]/20 hover:text-[#65A30D] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          N-Shape
                        </button>
                      </div>

                      {inlineTestStatus === 'success' && (
                        <div className="w-full max-w-[280px] p-2.5 rounded-lg bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#65A30D] dark:text-[#84CC16] text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pattern Match Confirmed!</span>
                        </div>
                      )}

                      {inlineTestStatus === 'saved' && (
                        <div className="w-full max-w-[280px] p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0F4C81] dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                          <span>Pattern Saved! Ready for 2FA.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Android Lock Preferences */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showPatternTrail}
                        onChange={(e) => setShowPatternTrail(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer"
                      />
                      <span>Make pattern visible when drawing (trail)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={patternHapticEnabled}
                        onChange={(e) => setPatternHapticEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#0F4C81] focus:ring-[#84CC16] border-slate-300 cursor-pointer"
                      />
                      <span>Vibrate on node touch (tactile feedback)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Biometric Login & Hardware Keys Card */}
      <BiometricSettingsCard
        userName={userName}
        companyName={companyName}
      />

      {/* Recovery Credentials & Backup Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recovery Info */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071626]/70 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#072644] dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
              <span>Account Recovery Credentials</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-[#9AE61C]/20 dark:text-[#9AE61C] hover:bg-[#0F4C81]/20 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Recovery Email</span>
              <span className="font-bold text-[#072644] dark:text-white">{userEmail}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Recovery Phone</span>
              <span className="font-bold text-[#072644] dark:text-white">{userPhone}</span>
            </div>
            <div className="py-1.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Current Password</span>
                <div className="text-right">
                  <span className="font-mono text-slate-600 dark:text-slate-300 block text-xs">
                    •••••••••••• ({lastPasswordChanged})
                  </span>
                  {passwordExpiryEnabled && daysUntilExpiry >= 30 && (
                    <span className="text-[10px] font-medium text-slate-400">
                      Expires in {daysUntilExpiry} days
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Warning for expiry < 30 days with direct link to update flow */}
              {passwordExpiryEnabled && daysUntilExpiry < 30 && (
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 text-xs transition-colors ${
                    daysUntilExpiry <= 3
                      ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                      : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        daysUntilExpiry <= 3
                          ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    />
                    <div className="leading-tight">
                      <span className="font-bold">
                        Expires in <span className="tabular-nums">{daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}</span>
                      </span>{' '}
                      <span className="text-[11px] opacity-85">
                        (&lt; 30 days remaining)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0F4C81] hover:bg-[#072644] text-white flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>Update Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Backup Codes */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071626]/70 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#072644] dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
              <span>Emergency Backup Codes</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="text-xs text-[#0F4C81] dark:text-[#9AE61C] font-bold hover:underline cursor-pointer"
            >
              {showBackupCodes ? 'Hide' : 'Reveal'}
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep these one-time recovery codes safe in case you lose mobile phone access.
          </p>

          {showBackupCodes ? (
            <div className="grid grid-cols-2 gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-[#072644] dark:text-white">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0A1F36] p-1.5 rounded border border-slate-200 dark:border-slate-700 text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400 font-mono">
              [ 5 Backup Codes Protected ]
            </div>
          )}
        </div>
      </div>

      {/* Active Devices & Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#072644] dark:text-white">
              Active Devices & Sessions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Devices currently signed into this tenant profile across Lagos, Abuja, and Port Harcourt nodes.
            </p>
          </div>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleLogoutOtherDevices}
              className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Log Out All Other Devices</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#071626]/70">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    sess.isCurrent
                      ? 'bg-[#84CC16]/20 text-[#65A30D]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {sess.device.includes('iPhone') ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#072644] dark:text-white">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16] font-extrabold text-[10px]">
                        Current Device
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {sess.browser} • {sess.location} • IP: {sess.ipAddress}
                  </div>
                </div>
              </div>

              <span className="text-slate-400 font-medium">{sess.lastActive}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Security Activity Logs */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-[#072644] dark:text-white">
          Recent Login Activity
        </h3>
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#071626]/70">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-4">Event</th>
                <th className="py-2.5 px-4">Device & IP</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {MOCK_SECURITY_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-semibold text-[#072644] dark:text-white">
                    {log.event}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{log.device}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{log.location}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        log.status === 'success'
                          ? 'bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]'
                          : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {log.status === 'success' ? 'Authorized' : 'Challenged'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChanged={handlePasswordChanged}
        userEmail={userEmail}
      />

      {/* Interactive Pattern Lock 2FA Configuration & Test Modal */}
      <PatternLockModal
        isOpen={isPatternModalOpen}
        onClose={() => setIsPatternModalOpen(false)}
        savedPattern={savedPattern}
        onSavePattern={handleSavePattern}
        onClearPattern={handleClearPattern}
        showTrail={showPatternTrail}
        onToggleShowTrail={setShowPatternTrail}
        hapticEnabled={patternHapticEnabled}
        onToggleHaptic={setPatternHapticEnabled}
        initialTab={patternModalTab}
      />
    </div>
  );
};
