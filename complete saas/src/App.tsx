import React, { useState } from 'react';
import {
  AuthScreen,
  Company,
  Branch,
  UserRole,
  UserProfile,
  SecurityStateType,
  BusinessRegistrationData,
} from './types';
import {
  MOCK_COMPANIES,
  MOCK_USER_PROFILE,
  MOCK_REGISTRATION_DEFAULT,
} from './data/mockData';

// Layout & Common
import { AuthLayout } from './components/layout/AuthLayout';
import { LogoutModal } from './components/auth/LogoutModal';

// Auth Views
import { SignInView } from './components/auth/SignInView';
import { SignUpPersonalView } from './components/auth/SignUpPersonalView';
import { SignUpBusinessView } from './components/auth/SignUpBusinessView';
import { EmailVerificationView } from './components/auth/EmailVerificationView';
import { BusinessSetupView } from './components/auth/BusinessSetupView';
import { SignUpCompleteView } from './components/auth/SignUpCompleteView';
import { TwoFactorView } from './components/auth/TwoFactorView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { CompanySelectionView } from './components/auth/CompanySelectionView';
import { BranchSelectionView } from './components/auth/BranchSelectionView';
import { WelcomeTransitionView } from './components/auth/WelcomeTransitionView';

// Dashboard & Security Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SecuritySettingsView } from './components/security/SecuritySettingsView';
import { SecurityStatesView } from './components/security/SecurityStatesView';
import { ThemeToggle } from './components/common/ThemeToggle';

// Quick Demo Navigation Icons
import { Sparkles, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import { useToast } from './context/ToastContext';

export default function App() {
  const toast = useToast();
  // Current Active Screen
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('signin');

  // Active Tenant & Session Context
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(MOCK_COMPANIES[0].branches[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('business_owner');
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE as UserProfile);

  // Registration Multi-Step State
  const [registrationData, setRegistrationData] = useState<BusinessRegistrationData>(
    MOCK_REGISTRATION_DEFAULT as BusinessRegistrationData
  );

  // Security Simulation State
  const [activeSecurityState, setActiveSecurityState] =
    useState<SecurityStateType>('new-device');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // --- HANDLERS FOR SIGN IN ---
  const handleSignInSuccess = (role: UserRole, requires2FA = true) => {
    setCurrentRole(role);
    setUserProfile((prev) => ({ ...prev, role }));

    if (requires2FA) {
      setCurrentScreen('two-factor');
    } else {
      setCurrentScreen('select-company');
    }
  };

  // --- HANDLERS FOR 2FA ---
  const handle2FAVerified = () => {
    toast.success(
      'Two-Factor Authentication Confirmed',
      'Session authenticated with secure hardware-level verification.'
    );
    setCurrentScreen('select-company');
  };

  // --- HANDLERS FOR MULTI-STEP REGISTRATION ---
  const handlePersonalStepComplete = (data: {
    firstName: string;
    lastName: string;
    workEmail: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
    setCurrentScreen('signup-business');
  };

  const handleBusinessStepComplete = (data: {
    businessName: string;
    businessType: string;
    country: string;
    stateRegion: string;
    currency: string;
    businessSize: 'Micro' | 'Small' | 'Medium' | 'Large';
  }) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
    setCurrentScreen('signup-verify');
  };

  const handleVerificationComplete = () => {
    setRegistrationData((prev) => ({ ...prev, emailVerified: true }));
    setCurrentScreen('signup-setup');
  };

  const handleSetupComplete = (data: {
    businessAddress: string;
    taxIdNumber: string;
    financialYearStart: string;
    website?: string;
  }) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
    // Add the new company to our mock companies list
    const newComp: Company = {
      id: `comp_${Date.now()}`,
      name: registrationData.businessName || 'New Registered Business Ltd',
      industry: registrationData.businessType || 'Retail & Supermarket',
      location: `${registrationData.stateRegion}, ${registrationData.country}`,
      country: registrationData.country,
      branchesCount: 1,
      warehousesCount: 1,
      userRole: 'business_owner',
      currency: registrationData.currency,
      currencySymbol: registrationData.currency === 'NGN' ? '₦' : '$',
      branches: [
        {
          id: `br_${Date.now()}`,
          name: 'Head Office & Main Store',
          location: data.businessAddress || 'Commercial Boulevard',
          state: registrationData.stateRegion,
          code: 'HQ-01',
          isHeadOffice: true,
          phone: registrationData.phoneNumber,
          managerName: `${registrationData.firstName} ${registrationData.lastName}`,
        },
      ],
    };

    setCompanies((prev) => [newComp, ...prev]);
    setSelectedCompany(newComp);
    setSelectedBranch(newComp.branches[0]);
    setCurrentRole('business_owner');

    setCurrentScreen('signup-complete');
  };

  // --- HANDLERS FOR FORGOT / RESET PASSWORD ---
  const handleProceedToReset = (email: string) => {
    setCurrentScreen('reset-password');
  };

  // --- HANDLERS FOR COMPANY & BRANCH SELECTION ---
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setCurrentRole(company.userRole);
    toast.info('Entity Selected', `Switched organization profile to ${company.name}.`);
    setCurrentScreen('select-branch');
  };

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    toast.success('Branch Operating Node Set', `Loaded branch ledger for ${branch.name} (${branch.code}).`);
    setCurrentScreen('welcome-transition');
  };

  // --- HANDLER FOR DASHBOARD ENTRY ---
  const handleEnterDashboard = () => {
    setCurrentScreen('dashboard');
  };

  // --- HANDLERS FOR LOGOUT ---
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    toast.info('Logged Out', 'You have been securely signed out of MsmeBooks.');
    setCurrentScreen('signin');
  };

  // --- HANDLERS FOR SECURITY SIMULATIONS ---
  const handleTriggerSecurityState = (stateType: SecurityStateType) => {
    setActiveSecurityState(stateType);
    setCurrentScreen('security-state');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#071727] flex flex-col font-sans selection:bg-[#84CC16]/30 selection:text-[#072644] transition-colors">
      {/* =========================================================================
          INTERACTIVE DEMO TOOLBAR: Instant Screen & Role Switcher
          Allows testing every single view of the MsmeBooks ecosystem effortlessly
          ========================================================================= */}
      <div className="bg-[#072644] text-white border-b border-white/10 px-3 py-1.5 text-xs z-50 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1.5 font-bold text-[#84CC16]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MsmeBooks Navigator</span>
            </span>
            <span className="text-white/30">|</span>
          </div>

          {/* Quick Flow Jump Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] py-0.5 flex-1">
            <button
              type="button"
              onClick={() => setCurrentScreen('signin')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentScreen === 'signin'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <span>1. Sign In</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 font-normal">
                QR & Pwd
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('two-factor')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'two-factor'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              2. 2FA Verification
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('signup-personal')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen.startsWith('signup-')
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              3. Sign Up Flow (5 Steps)
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('forgot-password')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'forgot-password' || currentScreen === 'reset-password'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              4. Password Recovery
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('select-company')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'select-company'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              5. Select Business
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('select-branch')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'select-branch'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              6. Select Branch
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('welcome-transition')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'welcome-transition'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              7. Welcome Screen
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('dashboard')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              8. Dashboard & AI
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('security-settings')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentScreen === 'security-settings'
                  ? 'bg-[#84CC16] text-[#072644] font-bold'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <span>9. Security Settings</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 font-normal">
                Biometrics
              </span>
            </button>
          </div>

          {/* Quick Toast System Demos */}
          <div className="flex-shrink-0 flex items-center gap-1.5 pl-2 border-l border-white/10">
            <span className="text-[10px] text-slate-300 font-semibold hidden md:inline">Toasts:</span>
            <button
              type="button"
              id="test-success-toast-btn"
              onClick={() =>
                toast.success(
                  'Payment Reconciled (Lemon Green)',
                  '₦1,450,000 received via NIBSS Instant Payment from Lekki Megastore.',
                  {
                    action: {
                      label: 'View Receipt',
                      onClick: () =>
                        toast.info('Receipt Remittance', 'Remittance advice generated for #REC-2026-891.'),
                    },
                  }
                )
              }
              title="Trigger Lemon-Green Success Toast"
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#84CC16]/20 text-[#84CC16] hover:bg-[#84CC16]/30 border border-[#84CC16]/40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Success</span>
            </button>

            <button
              type="button"
              id="test-error-toast-btn"
              onClick={() =>
                toast.error(
                  'Reconciliation Mismatch (Subtle Red)',
                  'Bank statement line item #492 has a discrepancy of -₦12,400 with current sales ledger.'
                )
              }
              title="Trigger Subtle Red Error Toast"
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Error</span>
            </button>
          </div>

          {/* Direct Theme Switcher in Navigation Bar */}
          <div className="flex-shrink-0 flex items-center pl-2 border-l border-white/10">
            <ThemeToggle variant="icon" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW SWITCHER & ROUTER
          Renders appropriate layout shell based on active screen
          ========================================================================= */}
      <div className="flex-1 flex flex-col">
        {/* --- SIGN IN --- */}
        {currentScreen === 'signin' && (
          <AuthLayout visualType="supermarket">
            <SignInView
              onSignIn={(email, role) => handleSignInSuccess(role || 'business_owner')}
              onDirectRoleSignIn={(role) => handleSignInSuccess(role)}
              onNavigateToSignUp={() => setCurrentScreen('signup-personal')}
              onNavigateToForgotPassword={() => setCurrentScreen('forgot-password')}
              onTriggerSecurityState={handleTriggerSecurityState}
            />
          </AuthLayout>
        )}

        {/* --- TWO-FACTOR AUTH (2FA) --- */}
        {currentScreen === 'two-factor' && (
          <AuthLayout visualType="security">
            <TwoFactorView
              userPhone={userProfile.phone}
              userEmail={userProfile.email}
              onVerify={handle2FAVerified}
              onBackToSignIn={() => setCurrentScreen('signin')}
            />
          </AuthLayout>
        )}

        {/* --- REGISTRATION STEP 1: PERSONAL --- */}
        {currentScreen === 'signup-personal' && (
          <AuthLayout visualType="pharmacy">
            <SignUpPersonalView
              initialData={{
                firstName: registrationData.firstName,
                lastName: registrationData.lastName,
                workEmail: registrationData.workEmail,
                phoneNumber: registrationData.phoneNumber,
                password: registrationData.password,
                confirmPassword: registrationData.confirmPassword,
              }}
              onContinue={handlePersonalStepComplete}
              onNavigateToSignIn={() => setCurrentScreen('signin')}
            />
          </AuthLayout>
        )}

        {/* --- REGISTRATION STEP 2: BUSINESS --- */}
        {currentScreen === 'signup-business' && (
          <AuthLayout visualType="distribution">
            <SignUpBusinessView
              initialData={{
                businessName: registrationData.businessName,
                businessType: registrationData.businessType,
                country: registrationData.country,
                stateRegion: registrationData.stateRegion,
                currency: registrationData.currency,
                businessSize: registrationData.businessSize,
              }}
              onContinue={handleBusinessStepComplete}
              onBack={() => setCurrentScreen('signup-personal')}
            />
          </AuthLayout>
        )}

        {/* --- REGISTRATION STEP 3: EMAIL VERIFICATION --- */}
        {currentScreen === 'signup-verify' && (
          <AuthLayout visualType="security">
            <EmailVerificationView
              email={registrationData.workEmail}
              onVerified={handleVerificationComplete}
              onBack={() => setCurrentScreen('signup-business')}
            />
          </AuthLayout>
        )}

        {/* --- REGISTRATION STEP 4: BUSINESS SETUP --- */}
        {currentScreen === 'signup-setup' && (
          <AuthLayout visualType="agriculture">
            <BusinessSetupView
              initialData={{
                businessAddress: registrationData.businessAddress,
                taxIdNumber: registrationData.taxIdNumber,
                financialYearStart: registrationData.financialYearStart,
                website: registrationData.website,
              }}
              businessName={registrationData.businessName}
              onComplete={handleSetupComplete}
              onSkip={() => handleSetupComplete(registrationData)}
            />
          </AuthLayout>
        )}

        {/* --- REGISTRATION STEP 5: REGISTRATION COMPLETE --- */}
        {currentScreen === 'signup-complete' && (
          <AuthLayout visualType="supermarket">
            <SignUpCompleteView
              businessName={registrationData.businessName}
              userEmail={registrationData.workEmail}
              onProceed={() => setCurrentScreen('select-branch')}
            />
          </AuthLayout>
        )}

        {/* --- FORGOT PASSWORD --- */}
        {currentScreen === 'forgot-password' && (
          <AuthLayout visualType="security">
            <ForgotPasswordView
              onBackToSignIn={() => setCurrentScreen('signin')}
              onProceedToReset={handleProceedToReset}
            />
          </AuthLayout>
        )}

        {/* --- RESET PASSWORD --- */}
        {currentScreen === 'reset-password' && (
          <AuthLayout visualType="security">
            <ResetPasswordView
              onSuccessSignIn={() => setCurrentScreen('signin')}
            />
          </AuthLayout>
        )}

        {/* --- COMPANY / WORKSPACE SELECTION --- */}
        {currentScreen === 'select-company' && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#071626] dark:to-[#040D17] transition-colors">
            <CompanySelectionView
              companies={companies}
              selectedCompanyId={selectedCompany.id}
              userName={userProfile.firstName}
              onSelectCompany={handleSelectCompany}
              onRegisterNewBusiness={() => setCurrentScreen('signup-personal')}
              onSignOut={() => setIsLogoutModalOpen(true)}
            />
          </div>
        )}

        {/* --- BRANCH SELECTION --- */}
        {currentScreen === 'select-branch' && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#071626] dark:to-[#040D17] transition-colors">
            <BranchSelectionView
              company={selectedCompany}
              selectedBranchId={selectedBranch.id}
              onSelectBranch={handleSelectBranch}
              onBackToCompanies={() => setCurrentScreen('select-company')}
            />
          </div>
        )}

        {/* --- WELCOME TRANSITION SCREEN --- */}
        {currentScreen === 'welcome-transition' && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#071626] dark:to-[#040D17] transition-colors">
            <WelcomeTransitionView
              userName={userProfile.firstName}
              company={selectedCompany}
              branch={selectedBranch}
              role={currentRole}
              onEnterDashboard={handleEnterDashboard}
            />
          </div>
        )}

        {/* --- DASHBOARD ENTRY EXPERIENCE --- */}
        {currentScreen === 'dashboard' && (
          <DashboardView
            company={selectedCompany}
            branch={selectedBranch}
            role={currentRole}
            userName={`${userProfile.firstName} ${userProfile.lastName}`}
            onSwitchCompany={() => setCurrentScreen('select-company')}
            onSwitchBranch={() => setCurrentScreen('select-branch')}
            onSwitchRole={(r) => {
              setCurrentRole(r);
              setUserProfile((prev) => ({ ...prev, role: r }));
            }}
            onOpenSecuritySettings={() => setCurrentScreen('security-settings')}
            onTriggerSecurityState={handleTriggerSecurityState}
            onRequestLogout={() => setIsLogoutModalOpen(true)}
          />
        )}

        {/* --- SECURITY & LOGIN SETTINGS --- */}
        {currentScreen === 'security-settings' && (
          <div className="flex-1 p-4 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#071626] dark:to-[#040D17] flex items-center justify-center transition-colors">
            <SecuritySettingsView
              onBackToDashboard={() => setCurrentScreen('dashboard')}
              userEmail={userProfile.email}
              userPhone={userProfile.phone}
              role={currentRole}
              userName={userProfile.firstName}
              companyName={selectedCompany.name}
              onNavigateToResetPassword={() => setCurrentScreen('reset-password')}
            />
          </div>
        )}

        {/* --- SECURITY STATES SIMULATION (New Device, Expired, Unauthorized, Locked, Suspicious) --- */}
        {currentScreen === 'security-state' && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#071626] dark:to-[#040D17] transition-colors">
            <SecurityStatesView
              stateType={activeSecurityState}
              onResolve={() => setCurrentScreen('dashboard')}
              onReturnToSignIn={() => setCurrentScreen('signin')}
            />
          </div>
        )}
      </div>


      {/* --- CONFIRMATION LOGOUT MODAL --- */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirmLogout={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        userName={userProfile.firstName}
        businessName={selectedCompany.name}
      />
    </div>
  );
}
