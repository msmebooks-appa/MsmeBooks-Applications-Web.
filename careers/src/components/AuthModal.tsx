import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Users,
  Target,
  Handshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Phone,
  Briefcase,
  FileText,
  UploadCloud,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, CandidateProfile, EmployerProfile, AgencyProfile, HeadhunterProfile, PartnerProfile } from '../types/auth';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  initialRole?: UserRole;
  onSuccess?: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  initialRole = 'candidate',
  onSuccess,
}) => {
  const { signIn, signUp, signInWithSocial, switchDemoUser, demoAccounts, isLoading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [socialLoadingProvider, setSocialLoadingProvider] = useState<'linkedin' | 'google' | 'facebook' | null>(null);
  const [showCustomSocialEmail, setShowCustomSocialEmail] = useState(false);
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [customSocialName, setCustomSocialName] = useState('');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Common Sign Up state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('Lagos');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Role-specific sign up state
  // Candidate:
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level (3-5 years)');
  const [skillsText, setSkillsText] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [workArrangement, setWorkArrangement] = useState<'Remote' | 'Hybrid' | 'On-site' | 'Any'>('Remote');
  const [resumeFileName, setResumeFileName] = useState('');

  // Employer:
  const [companyName, setCompanyName] = useState('');
  const [employerType, setEmployerType] = useState<'Company' | 'Startup' | 'SME' | 'Enterprise'>('SME');
  const [industry, setIndustry] = useState('Fintech & Software');
  const [companySize, setCompanySize] = useState('11-50 employees');
  const [website, setWebsite] = useState('');
  const [hiringVolume, setHiringVolume] = useState('1-5 roles / quarter');

  // Agency:
  const [agencyName, setAgencyName] = useState('');
  const [contactPersonTitle, setContactPersonTitle] = useState('Principal Recruiter');
  const [candidateRosterSize, setCandidateRosterSize] = useState('1,000-5,000 candidates');
  const [specialization, setSpecialization] = useState('Technology & Engineering');

  // Headhunter:
  const [practiceName, setPracticeName] = useState('');
  const [executiveFocus, setExecutiveFocus] = useState('C-Suite (CTO, CFO, COO)');
  const [yearsInSearch, setYearsInSearch] = useState(5);
  const [confidentialTier, setConfidentialTier] = useState<'Standard' | 'Retained Executive' | 'Exclusive Talent Partner'>('Retained Executive');

  // Partner:
  const [organizationName, setOrganizationName] = useState('');
  const [partnerCategory, setPartnerCategory] = useState<'Education / Bootcamp' | 'University' | 'HR Tech Module' | 'Co-Working / Hub' | 'Financial Institution' | 'Industry Body'>('Education / Bootcamp');
  const [collaborationScope, setCollaborationScope] = useState('Talent Pipeline & Graduate Placement');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSelectedRole(initialRole);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const handleSocialAuth = async (provider: 'linkedin' | 'google' | 'facebook') => {
    setErrorMessage(null);
    setSocialLoadingProvider(provider);

    const providerDisplayNames = {
      linkedin: 'LinkedIn',
      google: 'Google / Gmail',
      facebook: 'Facebook',
    };

    const customOverrides = showCustomSocialEmail && customSocialEmail.trim()
      ? {
          email: customSocialEmail.trim(),
          fullName: customSocialName.trim() || undefined,
        }
      : undefined;

    const res = await signInWithSocial(provider, selectedRole, customOverrides);
    setSocialLoadingProvider(null);

    if (res.success) {
      setSuccessMessage(
        res.isNewUser
          ? `Account successfully created via ${providerDisplayNames[provider]} as ${getRoleLabel(selectedRole).split('/')[0].trim()}!`
          : `Signed in successfully via ${providerDisplayNames[provider]}!`
      );
      setTimeout(() => {
        if (onSuccess) onSuccess(selectedRole);
        onClose();
      }, 750);
    } else {
      setErrorMessage(res.error || `Failed to authenticate with ${providerDisplayNames[provider]}.`);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await signIn(signInEmail, signInPassword, selectedRole);
    if (res.success) {
      setSuccessMessage('Successfully signed in! Welcome back.');
      setTimeout(() => {
        if (onSuccess) onSuccess(selectedRole);
        onClose();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Failed to sign in.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name or company representative name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must accept the MsmeBooks terms of service to proceed.');
      return;
    }

    // Build role data
    let roleData: any;

    if (selectedRole === 'candidate') {
      const candData: CandidateProfile = {
        targetRole: targetRole || 'Software Engineer',
        experienceLevel,
        skills: skillsText ? skillsText.split(',').map((s) => s.trim()).filter(Boolean) : ['React', 'TypeScript', 'Node.js'],
        expectedSalaryMonthly: expectedSalary,
        currency,
        workArrangementPreference: workArrangement,
        resumeFileName: resumeFileName || undefined,
      };
      roleData = { role: 'candidate', data: candData };
    } else if (selectedRole === 'employer') {
      const empData: EmployerProfile = {
        companyName: companyName || fullName + ' Enterprise',
        employerType,
        industry,
        companySize,
        website: website || undefined,
        hiringVolume,
        hrModulesActive: ['Talent ATS Module'],
        verifiedBadge: true,
      };
      roleData = { role: 'employer', data: empData };
    } else if (selectedRole === 'agency') {
      const agnData: AgencyProfile = {
        agencyName: agencyName || fullName + ' Talent Group',
        contactPersonTitle,
        specializationSectors: [specialization],
        clientCountEstimate: '10-25 Clients',
        candidateRosterSize,
        servicesProvided: ['Contingency Placement', 'Executive Search'],
        website: website || undefined,
      };
      roleData = { role: 'agency', data: agnData };
    } else if (selectedRole === 'headhunter') {
      const headData: HeadhunterProfile = {
        practiceName: practiceName || fullName + ' Executive Advisory',
        executiveFocus: [executiveFocus],
        yearsInExecutiveSearch: Number(yearsInSearch) || 5,
        confidentialSearchTier: confidentialTier,
        regionsCovered: [country, 'Pan-African Remote'],
        successfulPlacements: 12,
      };
      roleData = { role: 'headhunter', data: headData };
    } else {
      const partData: PartnerProfile = {
        organizationName: organizationName || fullName + ' Network',
        partnerCategory,
        collaborationScope: [collaborationScope],
        referralCode: 'MSME-PARTNER-' + Date.now().toString().slice(-4),
        totalReferredTalent: 0,
        contactDesignation: 'Partnerships Lead',
        integrationStatus: 'Active',
      };
      roleData = { role: 'partner', data: partData };
    }

    const res = await signUp(
      {
        email,
        fullName,
        role: selectedRole,
        phone: phone || undefined,
        country,
        city,
        roleData,
      },
      password
    );

    if (res.success) {
      setSuccessMessage(`Account created successfully as ${getRoleLabel(selectedRole)}!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(selectedRole);
        onClose();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const handleQuickDemoClick = (role: UserRole) => {
    switchDemoUser(role);
    setSuccessMessage(`Logged in instantly as ${getRoleLabel(role)}!`);
    setTimeout(() => {
      if (onSuccess) onSuccess(role);
      onClose();
    }, 600);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'candidate':
        return 'Candidate / Job Seeker';
      case 'employer':
        return 'Employer / Company';
      case 'agency':
        return 'Recruitment Agency';
      case 'headhunter':
        return 'Headhunter / Executive Search';
      case 'partner':
        return 'Ecosystem Partner';
    }
  };

  const rolesConfig: {
    id: UserRole;
    title: string;
    badge: string;
    description: string;
    icon: any;
    color: string;
    bgHover: string;
    darkBgHover: string;
  }[] = [
    {
      id: 'candidate',
      title: 'Candidate / Job Seeker',
      badge: 'For Talent',
      description: 'Discover Pan-African & remote jobs, get AI CV matching, track applications',
      icon: User,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgHover: 'hover:border-emerald-500 hover:bg-emerald-50/40',
      darkBgHover: 'dark:hover:bg-emerald-950/20',
    },
    {
      id: 'employer',
      title: 'Employer / Company',
      badge: 'For MSMEs & Startups',
      description: 'Post jobs, auto-screen applicants with Gemini AI, and sync with payroll',
      icon: Building2,
      color: 'text-blue-600 dark:text-[#38BDF8]',
      bgHover: 'hover:border-blue-500 hover:bg-blue-50/40',
      darkBgHover: 'dark:hover:bg-blue-950/20',
    },
    {
      id: 'agency',
      title: 'Recruitment Agency',
      badge: 'For Staffing Firms',
      description: 'Manage client job pipelines, place pre-vetted candidates, and track rosters',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgHover: 'hover:border-purple-500 hover:bg-purple-50/40',
      darkBgHover: 'dark:hover:bg-purple-950/20',
    },
    {
      id: 'headhunter',
      title: 'Headhunter',
      badge: 'Executive Search',
      description: 'Confidential C-Suite executive search, leadership sourcing & retained mandates',
      icon: Target,
      color: 'text-amber-600 dark:text-amber-400',
      bgHover: 'hover:border-amber-500 hover:bg-amber-50/40',
      darkBgHover: 'dark:hover:bg-amber-950/20',
    },
    {
      id: 'partner',
      title: 'Ecosystem Partner',
      badge: 'Accelerators & Hubs',
      description: 'Bootcamps, universities, and HR tech innovators collaborating with MsmeBooks',
      icon: Handshake,
      color: 'text-teal-600 dark:text-teal-400',
      bgHover: 'hover:border-teal-500 hover:bg-teal-50/40',
      darkBgHover: 'dark:hover:bg-teal-950/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131D35] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#14243A] via-[#1a3354] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#B5E61D] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B5E61D]">
                  MsmeBooks Talent Portal
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/15 text-white">
                  Multi-Role Auth
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight mt-0.5">
                {mode === 'signin' ? 'Sign In to Your Account' : 'Create an Account on MsmeBooks'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D1527] shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-2 ${
              mode === 'signin'
                ? 'border-[#0066CC] text-[#0066CC] dark:text-[#38BDF8] bg-white dark:bg-[#131D35]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-[#16233F]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sign In to Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'border-[#0066CC] text-[#0066CC] dark:text-[#38BDF8] bg-white dark:bg-[#131D35]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-[#16233F]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#B5E61D]" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Status Banners */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* =========================================================================
              SIGN IN TAB
             ========================================================================= */}
          {mode === 'signin' && (
            <div className="space-y-5">
              {/* Role Context selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Signing in as:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {rolesConfig.map((r) => {
                    const isSelected = selectedRole === r.id;
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-semibold ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#0066CC] dark:border-[#38BDF8] text-[#0066CC] dark:text-[#38BDF8] shadow-xs'
                            : 'bg-white dark:bg-[#0D1527] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0066CC] dark:text-[#38BDF8]' : 'text-slate-400'}`} />
                        <span className="truncate w-full text-[11px]">{r.title.split('/')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social Sign-in Options */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Sign in with Social Identity:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomSocialEmail(!showCustomSocialEmail);
                      if (!customSocialEmail) setCustomSocialEmail('msmesbooks@gmail.com');
                    }}
                    className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold cursor-pointer"
                  >
                    {showCustomSocialEmail ? 'Use default social' : 'Use custom email (e.g. msmesbooks@gmail.com)'}
                  </button>
                </div>

                {showCustomSocialEmail && (
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span>Custom Social Account Credentials:</span>
                      <span className="text-slate-400">Clicking any social button uses these</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="email"
                        value={customSocialEmail}
                        onChange={(e) => setCustomSocialEmail(e.target.value)}
                        placeholder="e.g. msmesbooks@gmail.com"
                        className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#0D1527] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                      <input
                        type="text"
                        value={customSocialName}
                        onChange={(e) => setCustomSocialName(e.target.value)}
                        placeholder="Your Name (optional)"
                        className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#0D1527] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* LinkedIn */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialAuth('linkedin')}
                    className="py-2.5 px-3 bg-white dark:bg-[#0D1527] hover:bg-blue-50/80 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 hover:border-[#0A66C2] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    title="Sign in with LinkedIn"
                  >
                    {socialLoadingProvider === 'linkedin' ? (
                      <span className="w-4 h-4 border-2 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <LinkedInIcon />
                    )}
                    <span>LinkedIn</span>
                  </button>

                  {/* Google / Gmail */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialAuth('google')}
                    className="py-2.5 px-3 bg-white dark:bg-[#0D1527] hover:bg-slate-50 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    title="Sign in with Gmail / Google"
                  >
                    {socialLoadingProvider === 'google' ? (
                      <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>Gmail / Google</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialAuth('facebook')}
                    className="py-2.5 px-3 bg-white dark:bg-[#0D1527] hover:bg-blue-50/80 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 hover:border-[#1877F2] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                    title="Sign in with Facebook"
                  >
                    {socialLoadingProvider === 'facebook' ? (
                      <span className="w-4 h-4 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FacebookIcon />
                    )}
                    <span>Facebook</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-[#131D35] text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    or sign in with email
                  </span>
                </div>
              </div>

              {/* Standard Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. yourname@company.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] focus:border-[#0066CC] dark:focus:border-[#38BDF8] text-slate-900 dark:text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Demo accounts password is: password123')}
                      className="text-xs font-medium text-[#0066CC] dark:text-[#38BDF8] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] focus:border-[#0066CC] dark:focus:border-[#38BDF8] text-slate-900 dark:text-white outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-[#0066CC] focus:ring-[#0066CC]"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as {getRoleLabel(selectedRole).split('/')[0].trim()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Accounts Drawer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#14243A] dark:text-white">
                      Instant 1-Click Demo Accounts
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Test any role immediately</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoAccounts.map((acc) => {
                    const conf = rolesConfig.find((r) => r.id === acc.role);
                    const Icon = conf?.icon || User;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleQuickDemoClick(acc.role)}
                        className="p-2.5 bg-slate-50 dark:bg-[#0D1527] hover:bg-blue-50/70 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8]">
                            <Icon className={`w-3.5 h-3.5 ${conf?.color}`} />
                            <span>{acc.title}</span>
                          </span>
                          <span className="text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity">
                            Login ⚡
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {acc.name} · <span className="font-mono text-[10px]">{acc.email}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SIGN UP TAB (5 Dedicated User Roles)
             ========================================================================= */}
          {mode === 'signup' && (
            <div className="space-y-5">
              {/* Step 1: Account Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14243A] dark:text-white mb-2">
                  1. Select Your Account Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rolesConfig.map((r) => {
                    const isSelected = selectedRole === r.id;
                    const Icon = r.icon;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#0066CC] dark:border-[#38BDF8] shadow-sm ring-1 ring-[#0066CC]/20'
                            : `bg-slate-50/60 dark:bg-[#0D1527] border-slate-200 dark:border-slate-700/80 ${r.bgHover} ${r.darkBgHover}`
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 ${r.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#14243A] dark:text-white leading-tight">
                                {r.title}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                {r.badge}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-[#0066CC] dark:bg-[#38BDF8] border-transparent text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {r.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Sign-up Options */}
              <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Sign up instantly as {getRoleLabel(selectedRole).split('/')[0].trim()} with:
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 1-Click Setup
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialAuth('linkedin')}
                    className="py-2 px-3 bg-white dark:bg-[#131D35] hover:bg-blue-50/80 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 hover:border-[#0A66C2] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {socialLoadingProvider === 'linkedin' ? (
                      <span className="w-3.5 h-3.5 border-2 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <LinkedInIcon />
                    )}
                    <span>LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialAuth('google')}
                    className="py-2 px-3 bg-white dark:bg-[#131D35] hover:bg-slate-50 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {socialLoadingProvider === 'google' ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>Gmail / Google</span>
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSocialAuth('facebook')}
                    className="py-2 px-3 bg-white dark:bg-[#131D35] hover:bg-blue-50/80 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700/80 hover:border-[#1877F2] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {socialLoadingProvider === 'facebook' ? (
                      <span className="w-3.5 h-3.5 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FacebookIcon />
                    )}
                    <span>Facebook</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center pt-1 pb-0.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-slate-50 dark:bg-[#0D1527] text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    or fill out manual registration
                  </span>
                </div>
              </div>

              {/* Step 2: Dynamic Form based on selected role */}
              <form onSubmit={handleSignUpSubmit} className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#14243A] dark:text-white">
                    2. {getRoleLabel(selectedRole)} Profile Details
                  </span>
                  <span className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] font-semibold">
                    * Required fields
                  </span>
                </div>

                {/* Common credentials grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {selectedRole === 'candidate'
                        ? 'Full Name'
                        : selectedRole === 'employer'
                        ? 'Primary Contact Name'
                        : selectedRole === 'agency'
                        ? 'Agency Lead / Contact Person'
                        : selectedRole === 'headhunter'
                        ? 'Consultant Full Name'
                        : 'Partner Representative Name'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Olumide Adebayo"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {selectedRole === 'candidate' ? 'Personal Email' : 'Official Work Email'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Phone & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Ghana">Ghana</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Egypt">Egypt</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Pan-Africa Diaspora">Pan-Africa Diaspora</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lagos, Nairobi, Kigali"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 801 234 5678"
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* ================= Specific fields for Candidate ================= */}
                {selectedRole === 'candidate' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Desired Job Title / Profession <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="e.g. Senior Frontend Engineer, Financial Analyst"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Experience Level
                        </label>
                        <select
                          value={experienceLevel}
                          onChange={(e) => setExperienceLevel(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                          <option value="Junior (1-3 years)">Junior (1-3 years)</option>
                          <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                          <option value="Senior (6+ years)">Senior (6+ years)</option>
                          <option value="Lead / Manager">Lead / Manager</option>
                          <option value="Executive / C-Suite">Executive / C-Suite</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Core Skills (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="e.g. React, TypeScript, Node.js, Accounting, IFRS, PostgreSQL"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Work Arrangement Preference
                        </label>
                        <select
                          value={workArrangement}
                          onChange={(e) => setWorkArrangement(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="Remote">Remote Only</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                          <option value="Any">Flexible / Any</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Expected Monthly Salary (USD)
                        </label>
                        <input
                          type="number"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          placeholder="e.g. 2500"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= Specific fields for Employer ================= */}
                {selectedRole === 'employer' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Company / Business Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Sahara Commerce Technologies Ltd"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Organization Type
                        </label>
                        <select
                          value={employerType}
                          onChange={(e) => setEmployerType(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="SME">Growing MSME / SME</option>
                          <option value="Startup">Venture-Backed Startup</option>
                          <option value="Company">Private Limited Company</option>
                          <option value="Enterprise">Pan-African Enterprise</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Company Size
                        </label>
                        <select
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="1-10 employees">1-10 employees</option>
                          <option value="11-50 employees">11-50 employees</option>
                          <option value="51-200 employees">51-200 employees</option>
                          <option value="200+ employees">200+ employees</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Industry
                        </label>
                        <input
                          type="text"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          placeholder="Fintech, Retail, Health"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Hiring Volume
                        </label>
                        <select
                          value={hiringVolume}
                          onChange={(e) => setHiringVolume(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="1-3 roles / quarter">1-3 roles / quarter</option>
                          <option value="4-10 roles / quarter">4-10 roles / quarter</option>
                          <option value="10+ ongoing recruitment">10+ ongoing recruitment</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= Specific fields for Agency ================= */}
                {selectedRole === 'agency' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Agency / Staffing Firm Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="e.g. Apex Talent Partners Ltd"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Your Role / Designation
                        </label>
                        <input
                          type="text"
                          value={contactPersonTitle}
                          onChange={(e) => setContactPersonTitle(e.target.value)}
                          placeholder="e.g. Managing Partner, Lead Recruiter"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Primary Sector Focus
                        </label>
                        <select
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="Technology & Software Engineering">Technology & Software Engineering</option>
                          <option value="Accounting, Finance & Auditing">Accounting, Finance & Auditing</option>
                          <option value="Sales, Marketing & Commercial">Sales, Marketing & Commercial</option>
                          <option value="Operations, Supply Chain & Logistics">Operations, Supply Chain & Logistics</option>
                          <option value="Multi-Sector General Staffing">Multi-Sector General Staffing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Active Candidate Pool
                        </label>
                        <select
                          value={candidateRosterSize}
                          onChange={(e) => setCandidateRosterSize(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="500-2,000 candidates">500-2,000 candidates</option>
                          <option value="2,000-10,000 candidates">2,000-10,000 candidates</option>
                          <option value="10,000+ candidates">10,000+ candidates</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= Specific fields for Headhunter ================= */}
                {selectedRole === 'headhunter' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Executive Practice / Brand Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={practiceName}
                          onChange={(e) => setPracticeName(e.target.value)}
                          placeholder="e.g. Chidi Okonkwo Executive Advisory"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Executive Focus Tier
                        </label>
                        <select
                          value={executiveFocus}
                          onChange={(e) => setExecutiveFocus(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="C-Suite (CTO, CFO, COO, CEO)">C-Suite (CTO, CFO, COO, CEO)</option>
                          <option value="VP & Engineering Leadership">VP & Engineering Leadership</option>
                          <option value="Finance Directors & Controllers">Finance Directors & Controllers</option>
                          <option value="Bespoke Confidential Searches">Bespoke Confidential Searches</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Years in Executive Search
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={40}
                          value={yearsInSearch}
                          onChange={(e) => setYearsInSearch(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Search Tier
                        </label>
                        <select
                          value={confidentialTier}
                          onChange={(e) => setConfidentialTier(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="Retained Executive">Retained Executive Search</option>
                          <option value="Exclusive Talent Partner">Exclusive Talent Partner</option>
                          <option value="Standard">Standard Search</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= Specific fields for Partner ================= */}
                {selectedRole === 'partner' && (
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Partner Organization / Institution <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="e.g. African Leadership Tech Academy"
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Partner Category
                        </label>
                        <select
                          value={partnerCategory}
                          onChange={(e) => setPartnerCategory(e.target.value as any)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        >
                          <option value="Education / Bootcamp">Education / Coding Bootcamp</option>
                          <option value="University">University / Academic Institution</option>
                          <option value="HR Tech Module">HR Tech & Payroll Software</option>
                          <option value="Co-Working / Hub">Co-Working / Tech Innovation Hub</option>
                          <option value="Financial Institution">Financial Institution / Bank</option>
                          <option value="Industry Body">Industry Association</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Collaboration Scope
                      </label>
                      <input
                        type="text"
                        value={collaborationScope}
                        onChange={(e) => setCollaborationScope(e.target.value)}
                        placeholder="e.g. Graduate Talent Pipeline, ATS Module Integration, Co-badged Certification"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#0066CC] focus:ring-[#0066CC] mt-0.5"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-[#0066CC] dark:text-[#38BDF8] font-semibold underline">
                        MsmeBooks Terms of Service
                      </span>{' '}
                      and Applicant Data Protection Policy.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration as {getRoleLabel(selectedRole).split('/')[0].trim()}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
