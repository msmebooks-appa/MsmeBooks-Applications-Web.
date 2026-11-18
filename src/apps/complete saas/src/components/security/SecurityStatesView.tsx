import React from 'react';
import { ShieldAlert, AlertTriangle, Lock, Clock, Smartphone, ArrowRight, ArrowLeft, RefreshCw, Mail, Phone } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { SecurityStateType } from '../../types';

interface SecurityStatesViewProps {
  stateType: SecurityStateType;
  onResolve: () => void;
  onReturnToSignIn: () => void;
}

export const SecurityStatesView: React.FC<SecurityStatesViewProps> = ({
  stateType,
  onResolve,
  onReturnToSignIn,
}) => {
  const configs = {
    'new-device': {
      title: 'New Sign-In Detected',
      icon: <Smartphone className="w-8 h-8 text-[#0F4C81]" />,
      iconBg: 'bg-[#0F4C81]/10 border-[#0F4C81]/20',
      description:
        'A new sign-in was recognized from a device not previously associated with your account.',
      details: [
        { label: 'Device', value: 'MacBook Pro 16" (Chrome 128)' },
        { label: 'Approximate Location', value: 'Victoria Island, Lagos, Nigeria' },
        { label: 'IP Address', value: '102.89.41.114' },
        { label: 'Timestamp', value: 'Today at 08:24 AM' },
      ],
      primaryBtn: 'Yes, Trust This Device',
      secondaryBtn: 'No, Lock & Protect Account',
    },
    'session-expired': {
      title: 'Your Session Has Expired',
      icon: <Clock className="w-8 h-8 text-amber-600" />,
      iconBg: 'bg-amber-100 border-amber-200',
      description:
        'For enterprise security and data privacy, sessions expire after periods of inactivity.',
      details: [
        { label: 'Reason', value: 'Idle inactivity timeout (30 minutes)' },
        { label: 'Tenant Entity', value: 'ABC Supermarket Ltd' },
        { label: 'Security Level', value: 'Protected Session Invalidation' },
      ],
      primaryBtn: 'Sign In Again to Continue',
      secondaryBtn: 'Switch Organization',
    },
    unauthorized: {
      title: 'Access Restricted',
      icon: <ShieldAlert className="w-8 h-8 text-red-600" />,
      iconBg: 'bg-red-100 border-red-200',
      description:
        'You don\'t have permission to access this area. Your current role does not grant administrative clearance for this module.',
      details: [
        { label: 'Required Permission', value: 'financial_approvals & executive_ledger' },
        { label: 'Current Role', value: 'POS Operator / Frontline Staff' },
        { label: 'Action Required', value: 'Contact your organization administrator' },
      ],
      primaryBtn: 'Return to Authorized Dashboard',
      secondaryBtn: 'Request Role Upgrade',
    },
    'account-locked': {
      title: 'Account Temporarily Locked',
      icon: <Lock className="w-8 h-8 text-red-600" />,
      iconBg: 'bg-red-100 border-red-200',
      description:
        'Too many failed sign-in attempts were recorded. To protect your company\'s financial records, authentication has been temporarily locked.',
      details: [
        { label: 'Failed Attempts', value: '5 consecutive invalid password tries' },
        { label: 'Lock Duration', value: '15 minutes or via admin unlock' },
        { label: 'Support Hotline', value: '+234 1 293 8470 / support@msmebooks.org' },
      ],
      primaryBtn: 'Unlock via Registered Email',
      secondaryBtn: 'Contact MsmeBooks Support',
    },
    suspicious: {
      title: 'Suspicious Authentication Detected',
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      iconBg: 'bg-amber-100 border-amber-200',
      description:
        'We detected an unusual authentication pattern. Additional two-step cryptographic verification is required before sensitive accounts can be displayed.',
      details: [
        { label: 'Anomaly', value: 'Simultaneous login attempt from different country IP' },
        { label: 'Risk Factor', value: 'Medium Risk Anomaly' },
        { label: 'Recommended Action', value: 'Complete 2FA Hardware or SMS challenge' },
      ],
      primaryBtn: 'Complete 2FA Challenge',
      secondaryBtn: 'Cancel & Abort Session',
    },
  };

  const current = configs[stateType];

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 p-6 sm:p-8 text-center animate-fade-in">
      <div className="flex justify-center mb-4">
        <MsmeBooksLogo size="sm" showTagline={false} />
      </div>

      <div
        className={`w-16 h-16 rounded-2xl ${current.iconBg} border flex items-center justify-center mx-auto mb-4 shadow-xs`}
      >
        {current.icon}
      </div>

      <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight mb-2">
        {current.title}
      </h2>

      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-5">
        {current.description}
      </p>

      {/* Details Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 mb-6 text-xs">
        {current.details.map((d, i) => (
          <div key={i} className="flex items-center justify-between pb-1.5 border-b border-slate-200 last:border-b-0 last:pb-0">
            <span className="text-slate-500 font-medium">{d.label}</span>
            <span className="font-bold text-[#072644] text-right">{d.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <PrimaryButton onClick={onResolve} rightIcon={<ArrowRight className="w-4 h-4" />}>
          {current.primaryBtn}
        </PrimaryButton>

        <SecondaryButton onClick={onReturnToSignIn} fullWidth size="sm">
          {current.secondaryBtn}
        </SecondaryButton>
      </div>
    </div>
  );
};
