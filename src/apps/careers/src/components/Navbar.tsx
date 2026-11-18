import React, { useState, useEffect } from 'react';
import { MsmeBooksLogo } from './MsmeBooksLogo';
import { ThemeToggle } from './ThemeToggle';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu,
  X,
  ShieldCheck,
  Bookmark,
  ArrowRight,
  ExternalLink,
  Plus,
  Bot,
  Handshake,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface NavbarProps {
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  onExplorePositions: () => void;
  onOpenPostJob?: () => void;
  onOpenAiAdvisor?: () => void;
  onOpenPartnerModal?: (role?: 'employer' | 'candidate') => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup', role?: UserRole) => void;
  onOpenProfileModal?: () => void;
  savedJobsCount: number;
  onOpenSavedJobs: () => void;
  activeSection: string;
  onShowToast?: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdminMode,
  onToggleAdmin,
  onExplorePositions,
  onOpenPostJob,
  onOpenAiAdvisor,
  onOpenPartnerModal,
  onOpenAuthModal,
  onOpenProfileModal,
  savedJobsCount,
  onOpenSavedJobs,
  onShowToast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { user } = useAuth();
  const { tr } = useLanguage();

  // Network connection status (online / offline)
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onShowToast) {
        onShowToast('✅ Internet connection restored. You are back online!');
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      if (onShowToast) {
        onShowToast('⚠️ Offline Mode activated. Browsing cached positions and bookmarks.');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onShowToast]);

  const handleTestConnection = async () => {
    setIsCheckingConnection(true);
    try {
      // Short delay to simulate/validate network probe
      await new Promise((r) => setTimeout(r, 600));
      const onlineNow = typeof navigator !== 'undefined' ? navigator.onLine : true;
      setIsOnline(onlineNow);
      if (onlineNow) {
        if (onShowToast) onShowToast('✅ Connection verified: Online and synchronized.');
      } else {
        if (onShowToast) onShowToast('⚠️ Still offline. Local cache remains active.');
      }
    } catch {
      setIsOnline(false);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const getRoleTag = (role: UserRole) => {
    switch (role) {
      case 'candidate':
        return { label: 'Candidate', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'employer':
        return { label: 'Employer', color: 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800' };
      case 'agency':
        return { label: 'Agency', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      case 'headhunter':
        return { label: 'Headhunter', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'partner':
        return { label: 'Partner', color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
    }
  };

  const navLinks = [
    { label: tr.nav.home, href: 'https://www.msmebooks.org', external: true },
    { label: tr.nav.aboutUs, href: '#why-msmebooks', external: false },
    { label: tr.nav.solutions, href: 'https://www.msmebooks.org/#solutions', external: true },
    { label: tr.nav.careers, href: '#job-board', active: true, external: false },
    { label: tr.nav.recruitmentModule, href: '#partner-ecosystem', external: false },
    { label: tr.nav.pricingPlans, href: '#pricing', external: false },
    { label: tr.nav.ourCulture, href: '#life-at-msmebooks', external: false },
    { label: tr.nav.faqs, href: '#faqs', external: false },
  ];

  const roleTag = user ? getRoleTag(user.role) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Offline Mode Alert Banner */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-bold border-b border-amber-600 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-slate-950 text-amber-400 shrink-0">
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span>
                <strong>Operating in Offline Mode</strong> · Internet connection is currently unavailable. All jobs, bookmarks & cached applications remain fully accessible.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isCheckingConnection}
                className="px-2.5 py-1 text-[11px] font-extrabold bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingConnection ? 'animate-spin' : ''}`} />
                <span>{isCheckingConnection ? 'Testing...' : 'Check Connection'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                className="px-2 py-1 text-[11px] font-bold text-slate-900 hover:text-white underline transition-colors cursor-pointer"
              >
                Offline Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter / Admin Mode Banner if active */}
      {isAdminMode && (
        <div className="bg-[#14243A] dark:bg-[#070D18] text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
            <span className="font-semibold text-[#B5E61D]">{tr.nav.adminModeActive}</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              {tr.nav.adminModeDesc}
            </span>
            <button
              onClick={onToggleAdmin}
              className="ml-auto text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-0.5 rounded border border-slate-600 transition-colors cursor-pointer"
            >
              {tr.nav.exitCandidateView}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-6">
          {/* Logo container */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 focus:outline-none"
              title="MsmeBooks Home"
            >
              <MsmeBooksLogo className="w-auto h-9" />
            </a>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline-block">
              {tr.nav.talentRecruitment}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className={`text-xs font-semibold tracking-wide transition-colors flex items-center gap-1 ${
                  link.active
                    ? 'text-[#0066CC] dark:text-[#38BDF8] font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8]'
                }`}
              >
                <span>{link.label}</span>
                {link.external && <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Selector (EN, FR, PT, ES) */}
            <LanguageSelector />

            {/* Global Currency Selector */}
            <CurrencySelector />

            {/* Visual Connection Status Indicator (Desktop) */}
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/50 animate-pulse'
              }`}
              title={
                isOnline
                  ? 'Status: Online (Connected to MsmeBooks Live Cloud). Click for details.'
                  : 'Status: Offline Mode (Operating with local cache). Click for details.'
              }
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="hidden xl:inline text-[11px] font-bold">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">Offline</span>
                </>
              )}
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Bookmark Counter */}
            <button
              onClick={onOpenSavedJobs}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-[#15223E] rounded-lg transition-colors cursor-pointer"
              title={tr.nav.viewBookmarks}
              aria-label={tr.nav.viewBookmarks}
            >
              <Bookmark className="w-5 h-5" />
              {savedJobsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0066CC] text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                  {savedJobsCount}
                </span>
              )}
            </button>

            {/* Post a Job Button */}
            {onOpenPostJob && (
              <button
                onClick={onOpenPostJob}
                className="px-3 py-2 text-xs font-bold text-[#14243A] bg-[#B5E61D] hover:bg-[#a2d114] active:bg-[#91bb12] rounded-lg shadow-xs transition-all flex items-center gap-1.5 shrink-0 hover:shadow-sm cursor-pointer"
                title="Post a job vacancy as a Company or Individual Recruiter"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{tr.nav.postJob}</span>
              </button>
            )}

            {/* AI Career Advisor Button */}
            {onOpenAiAdvisor && (
              <button
                onClick={onOpenAiAdvisor}
                className="px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/70 rounded-lg shadow-2xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Launch AI Career Advisor & Job Matcher"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{tr.nav.aiAdvisor}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {/* AUTHENTICATION CONTROLS (Sign In / Sign Up OR User Profile Pill) */}
            {user && roleTag ? (
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#15223E] hover:bg-slate-100 dark:hover:bg-[#1B2C50] border border-slate-200 dark:border-slate-700/80 transition-all text-left shadow-2xs group shrink-0 cursor-pointer"
                title={`Active account: ${user.fullName} (${roleTag.label}). Click to view details or switch roles.`}
              >
                <div className="relative">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-white/60 dark:border-slate-600 shadow-2xs" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#0066CC] text-white text-[11px] font-bold flex items-center justify-center">
                      {user.fullName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#15223E]" />
                </div>
                <div className="flex flex-col text-left leading-tight hidden lg:block">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[110px]">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1 py-0.2 rounded border ${roleTag.color}`}>
                    {roleTag.label}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('signin')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0066CC] dark:hover:text-[#38BDF8] bg-slate-100 dark:bg-[#15223E] hover:bg-slate-200 dark:hover:bg-[#1B2C50] border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{tr.nav.signIn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}
                  className="px-3 py-2 text-xs font-bold text-[#14243A] bg-[#B5E61D] hover:bg-[#a2d114] active:bg-[#91bb12] rounded-lg shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Sign up as Candidate, Employer, Agency, Headhunter, or Partner"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{tr.nav.signUp}</span>
                </button>
              </div>
            )}

            {/* Admin Switcher */}
            <button
              onClick={onToggleAdmin}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                isAdminMode
                  ? 'bg-slate-900 dark:bg-[#0066CC] text-white border-slate-900 dark:border-[#0066CC] shadow-sm'
                  : 'bg-slate-50 dark:bg-[#15223E] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1B2C50]'
              }`}
              title="HR Recruiter Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span className="hidden xl:inline">{isAdminMode ? 'Dashboard' : 'Portal'}</span>
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Visual Connection Status Indicator (Mobile) */}
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/60 animate-pulse'
              }`}
              title={isOnline ? 'Online (Connected)' : 'Offline Mode Active'}
              aria-label="Connection Status"
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                  <span className="text-[10px] font-extrabold uppercase">Offline</span>
                </>
              )}
            </button>

            <CurrencySelector compact />
            <ThemeToggle />

            {user && (
              <button
                onClick={onOpenProfileModal}
                className="p-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center"
                title={user.fullName}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#0066CC] text-white text-[11px] font-bold flex items-center justify-center">
                    {user.fullName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </button>
            )}

            <button
              onClick={onOpenSavedJobs}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] rounded-lg"
              aria-label="Saved jobs"
            >
              <Bookmark className="w-5 h-5" />
              {savedJobsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0066CC] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedJobsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#0066CC] dark:hover:text-[#38BDF8] rounded-lg hover:bg-slate-100 dark:hover:bg-[#15223E] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0D1527] border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          {/* Connection Status Card in Mobile Menu */}
          <div className="p-3 bg-slate-50 dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              {isOnline ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                  <WifiOff className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{isOnline ? 'Network: Online' : 'Operating in Offline Mode'}</span>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isOnline ? 'Live cloud sync active' : 'Offline storage & cached data active'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isCheckingConnection}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-[#1A284A] border border-slate-200 dark:border-slate-700 hover:border-[#0066CC] transition-colors cursor-pointer"
              >
                {isCheckingConnection ? 'Checking...' : 'Test'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsStatusModalOpen(true);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                title="View offline details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* User Status Card in Mobile Menu */}
          {user && roleTag ? (
            <div className="p-3 bg-slate-50 dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#0066CC] text-white text-xs font-bold flex items-center justify-center">
                      {user.fullName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131D35]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {user.fullName}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${roleTag.color}`}>
                    {roleTag.label}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfileModal) onOpenProfileModal();
                }}
                className="px-2.5 py-1 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs"
              >
                Profile / Switch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal('signin');
                }}
                className="py-2 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal('signup');
                }}
                className="py-2 px-3 text-xs font-bold text-[#14243A] bg-[#B5E61D] rounded-lg flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up (5 Roles)</span>
              </button>
            </div>
          )}

          {/* Language & Currency in Mobile Drawer */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {tr.common.language}
              </span>
              <LanguageSelector compact />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {tr.filters.currency}
              </span>
              <CurrencySelector compact />
            </div>
          </div>

          {/* Dedicated Theme Toggle in Mobile Drawer */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Appearance / Theme
            </span>
            <ThemeToggle showLabel />
          </div>

          <nav className="flex flex-col space-y-1.5 py-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                  link.active
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0066CC] dark:text-[#38BDF8] font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{link.label}</span>
                {link.external && <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {onOpenPostJob && (
              <button
                onClick={() => {
                  onOpenPostJob();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-sm font-bold text-[#14243A] bg-[#B5E61D] hover:bg-[#a2d114] rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{tr.nav.postJob}</span>
              </button>
            )}

            {onOpenPartnerModal && (
              <button
                onClick={() => {
                  onOpenPartnerModal('employer');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#15223E] hover:bg-slate-200 dark:hover:bg-[#1B2C50] border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Handshake className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                <span>Partner With Us</span>
              </button>
            )}

            {onOpenAiAdvisor && (
              <button
                onClick={() => {
                  onOpenAiAdvisor();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{tr.nav.aiAdvisor}</span>
              </button>
            )}

            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#15223E] hover:bg-slate-200 dark:hover:bg-[#1B2C50] border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>{isAdminMode ? tr.nav.exitCandidateView : 'HR Recruiter Dashboard'}</span>
            </button>

            <button
              onClick={() => {
                onExplorePositions();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{tr.hero.explorePositions}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Connection & Offline Status Modal Dialog */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-[#131D35] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isOnline ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'}`}>
                  {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Network & Offline Status
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Resilient connectivity for regional internet access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A284A] transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Status Banner Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isOnline
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200'
                }`}
              >
                {isOnline ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                )}
                <div>
                  <div className="font-extrabold text-xs uppercase tracking-wider mb-0.5">
                    {isOnline ? 'Live Cloud Synchronized' : 'Offline Mode Active'}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {isOnline
                      ? 'Your device is connected to MsmeBooks cloud services. Live job counts, real-time alerts, and instant submissions are active.'
                      : 'Internet connectivity is currently unavailable. MsmeBooks is operating with local cache storage so your browsing experience continues seamlessly.'}
                  </p>
                </div>
              </div>

              {/* Offline Capabilities List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  Offline-Ready Capabilities
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1A284A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      <strong>Full Job Catalog:</strong> Cached positions, descriptions & salary ranges remain browsable.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1A284A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      <strong>Client-Side Filters & Presets:</strong> Dynamic search, department, and salary filtering work completely offline.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1A284A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      <strong>Bookmarks & Pinned Filters:</strong> Saved criteria persist in local storage across browser sessions.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1A284A] border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      <strong>Application Staging:</strong> Quick applications submitted while offline are recorded locally.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isCheckingConnection}
                  className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingConnection ? 'animate-spin' : ''}`} />
                  <span>{isCheckingConnection ? 'Checking Connection...' : 'Test Connection Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
