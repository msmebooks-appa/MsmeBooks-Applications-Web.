import React from 'react';
import { CheckCircle2, Building2, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { PrimaryButton } from '../common/Buttons';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { AuthCard } from '../layout/AuthLayout';

interface SignUpCompleteViewProps {
  businessName: string;
  userEmail: string;
  onProceed: () => void;
}

export const SignUpCompleteView: React.FC<SignUpCompleteViewProps> = ({
  businessName,
  userEmail,
  onProceed,
}) => {
  return (
    <AuthCard>
      <ProgressIndicator currentStep={5} className="mb-4" />

      <div className="text-center space-y-4 py-3">
        <div className="flex justify-center mb-1">
          <MsmeBooksLogo size="sm" showTagline={false} />
        </div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 border-2 border-[#84CC16] text-[#65A30D] flex items-center justify-center mx-auto shadow-lg shadow-[#84CC16]/20 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-block text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#84CC16]/20 text-[#65A30D] tracking-wider">
            Ready for Operations
          </span>
          <h2 className="text-2xl font-extrabold text-[#072644] tracking-tight">
            Account Created Successfully!
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your MsmeBooks business workspace for{' '}
            <strong className="text-[#072644]">{businessName || 'ABC Supermarket Ltd'}</strong> has
            been provisioned and secured.
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Administrator Email</span>
            <span className="font-bold text-[#072644]">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Assigned Role</span>
            <span className="font-bold text-[#0F4C81] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" /> Business Owner (Full Admin)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Initial Branch</span>
            <span className="font-bold text-[#072644] flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-slate-400" /> Head Office & Flagship Store
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <PrimaryButton onClick={onProceed} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Enter Workspace
          </PrimaryButton>
        </div>
      </div>
    </AuthCard>
  );
};
