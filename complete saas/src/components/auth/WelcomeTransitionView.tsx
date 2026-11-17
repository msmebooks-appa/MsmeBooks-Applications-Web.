import React, { useEffect, useState } from 'react';
import { Building2, MapPin, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { MsmeBooksLogo } from '../common/MsmeBooksLogo';
import { PrimaryButton } from '../common/Buttons';
import { Company, Branch, UserRole } from '../../types';

interface WelcomeTransitionViewProps {
  userName: string;
  company: Company;
  branch: Branch;
  role: UserRole;
  onEnterDashboard: () => void;
}

export const WelcomeTransitionView: React.FC<WelcomeTransitionViewProps> = ({
  userName,
  company,
  branch,
  role,
  onEnterDashboard,
}) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Authenticating credentials...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusMessage(`Synchronizing ledger for ${company.name}...`);
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusMessage(`Configuring permissions for ${role.replace('_', ' ')}...`);
    }, 1300);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('Workspace ready!');
    }, 2000);

    const timer4 = setTimeout(() => {
      onEnterDashboard();
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [company.name, role, onEnterDashboard]);

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8 sm:p-10 text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <MsmeBooksLogo size="lg" showTagline={false} />
      </div>

      {/* Welcome Heading */}
      <div className="space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16]/20 text-[#65A30D] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Access Granted</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072644] tracking-tight">
          Welcome back, {userName}!
        </h2>

        <p className="text-sm text-slate-500">
          You're signing into <strong className="text-[#072644] font-semibold">{company.name}</strong>.
        </p>

        {/* Selected Branch & Role Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs text-[#072644] font-semibold mt-2">
          <span className="flex items-center gap-1 text-[#0F4C81]">
            <MapPin className="w-3.5 h-3.5" />
            {branch.name} • {branch.location}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-[#65A30D] capitalize">
            <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
            {role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Animated Blue + Lemon Green Progress Bar */}
      <div className="space-y-3 py-4 my-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-[#0F4C81] font-semibold">
            {progress < 100 ? (
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-ping" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
            )}
            {statusMessage}
          </span>
          <span className="font-mono text-[#072644] font-bold">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] via-[#1964A5] to-[#84CC16] transition-all duration-300 ease-out shadow-xs shadow-[#84CC16]/30"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-400">
          Preparing your workspace...
        </p>
      </div>

      {/* Button to bypass waiting */}
      <div className="pt-4">
        <PrimaryButton
          onClick={onEnterDashboard}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          size="md"
        >
          Open Dashboard Now
        </PrimaryButton>
      </div>
    </div>
  );
};
