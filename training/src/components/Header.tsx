import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard, 
  Sparkles, 
  GraduationCap,
  Building,
  Award,
  Heart,
  Bell,
  CheckCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronRight,
  BellOff,
  Filter,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Globe,
  Package,
  Users,
  AlertTriangle,
  HardDriveDownload,
  ChevronDown,
  PlayCircle,
  ShoppingCart
} from 'lucide-react';
import { AppNotification, Course } from '../types';
import { Language, getTranslation } from '../data/translations';
import { SupportedCurrency, CURRENCIES } from '../data/currencies';
import { PWAInstallButton } from './PWAInstallButton';
import { getOfflineCourses, OfflineCourseRecord } from '../utils/offlineCourseStorage';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
  userRole: 'student' | 'instructor' | 'corporate' | 'partner' | 'admin';
  onChangeUserRole: (role: 'student' | 'instructor' | 'corporate' | 'partner' | 'admin') => void;
  wishlistCount?: number;
  cartCount?: number;
  onOpenCart?: () => void;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onClearNotifications?: () => void;
  onNotificationClick?: (notification: AppNotification) => void;
  onSimulateNewCourseAlert?: () => void;
  onSimulateCertificateVerifiedAlert?: () => void;
  currentLanguage: Language;
  onChangeLanguage: (lang: Language) => void;
  currentCurrency: SupportedCurrency;
  onChangeCurrency: (curr: SupportedCurrency) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleSimulateOffline: () => void;
  onSelectCourse?: (course: Course) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenAIAssistant,
  userRole,
  onChangeUserRole,
  wishlistCount = 0,
  cartCount = 0,
  onOpenCart,
  notifications = [],
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearNotifications,
  onNotificationClick,
  onSimulateNewCourseAlert,
  onSimulateCertificateVerifiedAlert,
  currentLanguage,
  onChangeLanguage,
  currentCurrency,
  onChangeCurrency,
  isDarkMode,
  onToggleDarkMode,
  isOffline,
  onToggleSimulateOffline,
  onSelectCourse
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [connectionDropdownOpen, setConnectionDropdownOpen] = useState(false);
  const [offlineDrawerOpen, setOfflineDrawerOpen] = useState(false);
  const [offlineCourses, setOfflineCourses] = useState<OfflineCourseRecord[]>(() => getOfflineCourses());
  const [activeNotifFilter, setActiveNotifFilter] = useState<'all' | 'courses' | 'certifications'>('all');
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const connRef = useRef<HTMLDivElement>(null);
  const offlineIndicatorRef = useRef<HTMLDivElement>(null);

  // Sync offline cached courses reactive to storage changes
  useEffect(() => {
    const syncOfflineCourses = () => {
      setOfflineCourses(getOfflineCourses());
    };
    syncOfflineCourses();
    window.addEventListener('msmebooks_offline_courses_changed', syncOfflineCourses);
    window.addEventListener('storage', syncOfflineCourses);
    return () => {
      window.removeEventListener('msmebooks_offline_courses_changed', syncOfflineCourses);
      window.removeEventListener('storage', syncOfflineCourses);
    };
  }, [isOffline]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (connRef.current && !connRef.current.contains(event.target as Node)) {
        setConnectionDropdownOpen(false);
      }
      if (offlineIndicatorRef.current && !offlineIndicatorRef.current.contains(event.target as Node)) {
        setOfflineDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeNotifFilter === 'courses') return n.type === 'course_added';
    if (activeNotifFilter === 'certifications') return n.type === 'certification_verified';
    return true;
  });

  const courseAlertsCount = notifications.filter((n) => n.type === 'course_added').length;
  const certAlertsCount = notifications.filter((n) => n.type === 'certification_verified').length;

  const navItems = [
    { id: 'home', label: getTranslation('home', currentLanguage) },
    { id: 'courses', label: getTranslation('courseCatalog', currentLanguage) },
    { id: 'bundles', label: getTranslation('bundles', currentLanguage), badgeText: 'Save 48%' },
    { id: 'study-groups', label: getTranslation('studyGroups', currentLanguage) },
    { id: 'learning-paths', label: getTranslation('learningPaths', currentLanguage) },
    { id: 'wishlist', label: getTranslation('wishlist', currentLanguage), badge: wishlistCount },
    { id: 'sandbox', label: getTranslation('sandbox', currentLanguage) },
    { id: 'live-training', label: getTranslation('liveTraining', currentLanguage) },
    { id: 'verify-certificate', label: getTranslation('verifyCert', currentLanguage) }
  ];

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'pt' as const, label: 'Português', flag: '🇵🇹' },
    { code: 'es' as const, label: 'Español', flag: '🇪🇸' }
  ];

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  const handleNotificationSelect = (notif: AppNotification) => {
    if (onMarkNotificationAsRead && !notif.read) {
      onMarkNotificationAsRead(notif.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notif);
    }
    setNotificationOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      
      {/* Clear, Persistent Offline Connectivity Warning Banner */}
      {isOffline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 dark:from-amber-950 dark:via-amber-900 dark:to-orange-950 text-white text-xs px-4 py-2 border-b-2 border-amber-500/80 dark:border-amber-700 shadow-md transition-all">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            
            {/* Warning info cluster */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 flex items-center justify-center p-1.5 rounded-xl bg-amber-500/30 dark:bg-amber-800/60 border border-amber-300/40">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-amber-400 opacity-40"></span>
                <WifiOff className="w-4 h-4 text-white shrink-0" />
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm uppercase tracking-wide text-amber-100 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{getTranslation('offlineBannerTitle', currentLanguage)}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 dark:bg-emerald-600 font-extrabold text-white flex items-center gap-1 shadow-xs">
                    <HardDriveDownload className="w-3 h-3 text-white" />
                    <span>{offlineCourses.length} {getTranslation('cachedCoursesReady', currentLanguage)}</span>
                  </span>
                </div>

                <p className="text-[11px] text-amber-100/90 leading-tight">
                  {getTranslation('offlineBannerDesc', currentLanguage)}
                </p>
              </div>
            </div>

            {/* Action cluster in persistent warning banner */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto pt-1 md:pt-0">
              <button
                onClick={() => {
                  onSelectTab('dashboard');
                }}
                className="px-3 py-1.5 bg-white text-slate-900 hover:bg-amber-50 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Open Dashboard with all offline courses"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                <span>{getTranslation('accessCachedCourses', currentLanguage)}</span>
              </button>

              <button
                onClick={() => setOfflineDrawerOpen(!offlineDrawerOpen)}
                className="px-2.5 py-1.5 bg-amber-500/30 hover:bg-amber-500/50 border border-white/20 rounded-lg text-xs font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
                title="Inspect cached courses details"
              >
                <span>View List ({offlineCourses.length})</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onToggleSimulateOffline}
                className="px-2.5 py-1.5 bg-amber-800/70 hover:bg-amber-800 text-amber-100 border border-amber-400/40 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                title="Simulate network recovery / reconnect"
              >
                {getTranslation('simulateOnline', currentLanguage)}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Top micro-bar for role switching and quick LMS view selection */}
      <div className="bg-[#073B75] dark:bg-slate-950 text-white text-xs px-4 py-1.5 hidden md:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-200">
            <span className="font-medium text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#72B01D]" />
              MsmeBooks Learning Ecosystem
            </span>
            <span className="text-slate-400">·</span>
            <span>{getTranslation('brandTagline', currentLanguage)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Visual Connection Status Indicator */}
            <div className="relative" ref={connRef}>
              <button
                onClick={() => setConnectionDropdownOpen(!connectionDropdownOpen)}
                className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  isOffline
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-xs'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
                title="Network Status & Local Cache"
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span className="font-bold">{getTranslation('offlineStatus', currentLanguage)}</span>
                    <span className="bg-amber-400 text-amber-950 text-[10px] px-1 rounded font-extrabold">
                      {offlineCourses.length} Cached
                    </span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-[#72B01D]" />
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#72B01D] animate-ping" />
                      {getTranslation('onlineStatus', currentLanguage)}
                    </span>
                  </>
                )}
                <span className="text-[9px]">▼</span>
              </button>

              {connectionDropdownOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <HardDriveDownload className="w-4 h-4 text-amber-500" />
                      Connection Inspector
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOffline ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                      {isOffline ? 'OFFLINE' : 'ONLINE'}
                    </span>
                  </div>

                  {isOffline ? (
                    <div className="mb-3 space-y-2">
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200">
                        <p className="font-bold mb-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          Internet Access Lost
                        </p>
                        <p className="leading-snug">
                          {getTranslation('offlineCachedAvailable', currentLanguage)}
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between px-1">
                        <span>Offline-cached courses:</span>
                        <span className="font-black text-amber-600 dark:text-amber-400">{offlineCourses.length} Ready</span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectTab('dashboard');
                          setConnectionDropdownOpen(false);
                        }}
                        className="w-full py-1.5 px-2 rounded-lg text-xs font-bold bg-[#0B4F9C] hover:bg-[#073B75] text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{getTranslation('accessCachedCourses', currentLanguage)}</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                      Live WebSocket & Cloud Firestore sync connected. All course updates and quiz results sync in real-time.
                    </p>
                  )}

                  <button
                    onClick={() => {
                      onToggleSimulateOffline();
                      setConnectionDropdownOpen(false);
                    }}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center ${
                      isOffline
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {isOffline ? getTranslation('simulateOnline', currentLanguage) : getTranslation('simulateOffline', currentLanguage)}
                  </button>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Select Language"
              >
                <span>{currentLangObj.flag}</span>
                <span className="uppercase">{currentLangObj.code}</span>
                <span className="text-[9px]">▼</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 text-xs">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                        currentLanguage === l.code ? 'font-bold text-[#0B4F9C] dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {currentLanguage === l.code && <CheckCheck className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Currency Selector Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                title="Select Currency"
              >
                <span>{CURRENCIES[currentCurrency]?.flag || '🇳🇬'}</span>
                <span className="font-bold">{currentCurrency}</span>
                <span className="text-slate-300 text-[10px] font-semibold">({CURRENCIES[currentCurrency]?.symbol})</span>
                <span className="text-[9px]">▼</span>
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{getTranslation('panAfricanCurrencies', currentLanguage)}</span>
                    <span className="text-emerald-500 font-extrabold text-[9px]">Active</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {(Object.keys(CURRENCIES) as SupportedCurrency[]).map((cKey) => {
                      const item = CURRENCIES[cKey];
                      const isSelected = currentCurrency === cKey;
                      return (
                        <button
                          key={cKey}
                          onClick={() => {
                            onChangeCurrency(cKey);
                            setCurrencyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                            isSelected ? 'font-bold text-[#0B4F9C] dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base shrink-0">{item.flag}</span>
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold">{item.code}</span>
                                <span className="text-slate-400 dark:text-slate-400 text-[11px] font-medium">({item.symbol})</span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.name}</p>
                            </div>
                          </div>
                          {isSelected && <CheckCheck className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isDarkMode ? getTranslation('themeLight', currentLanguage) : getTranslation('themeDark', currentLanguage)}
              aria-label="Toggle theme mode"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-200" />
              )}
            </button>

            {/* Active Role Selector */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="capitalize">{userRole} Portal</span>
                <span className="text-[10px]">▼</span>
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <button
                    onClick={() => { onChangeUserRole('student'); onSelectTab('dashboard'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                    <span>Student Dashboard</span>
                  </button>
                  <button
                    onClick={() => { onChangeUserRole('instructor'); onSelectTab('instructor'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                    <span>Instructor Studio</span>
                  </button>
                  <button
                    onClick={() => { onChangeUserRole('corporate'); onSelectTab('corporate'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Building className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                    <span>Corporate Portal</span>
                  </button>
                  <button
                    onClick={() => { onChangeUserRole('partner'); onSelectTab('partners'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-[#72B01D]" />
                    <span>Partner Academy</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAIAssistant}
              className="bg-[#72B01D] hover:bg-[#5B8D17] text-white px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Primary Top Bar: Brand — Nav Links — Action Cluster */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0B4F9C] flex items-center justify-center text-white font-bold shadow-xs border border-blue-700">
            <span className="text-xl tracking-tight text-white font-black">M</span>
            <span className="w-1.5 h-4 bg-[#72B01D] rounded-full ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-[#0B4F9C] dark:text-blue-400 tracking-tight">MsmeBooks</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#72B01D] px-1.5 py-0.5 rounded-sm">
                Academy
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Learn Smarter · Manage Better · Grow Faster
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap transition-colors hover:text-[#0B4F9C] dark:hover:text-blue-400 cursor-pointer py-1 flex items-center gap-1.5 ${
                currentTab === item.id
                  ? 'text-[#0B4F9C] dark:text-blue-400 font-semibold border-b-2 border-[#0B4F9C]'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{item.label}</span>
              {item.badgeText && (
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded-full">
                  {item.badgeText}
                </span>
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#72B01D] text-white rounded-full tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action Cluster: Connection Indicator + Wishlist + Notification Bell + LMS */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0" ref={notificationRef}>
          
          {/* Main Nav Bar Visual Connection Status Indicator with Persistent Offline Badge & Cached Courses Popover */}
          <div className="relative" ref={offlineIndicatorRef}>
            <button
              onClick={() => {
                if (isOffline) {
                  setOfflineDrawerOpen(!offlineDrawerOpen);
                } else {
                  onToggleSimulateOffline();
                }
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                isOffline
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30 animate-pulse hover:bg-amber-500/25'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-500/20'
              }`}
              title={
                isOffline
                  ? 'Offline Mode Active · Offline-cached courses remain available (Click to view available offline courses)'
                  : 'Online Mode · Cloud Firestore & Real-Time Sync Active (Click to test offline)'
              }
              aria-label={isOffline ? 'Offline Mode active. View cached courses available.' : 'Online Mode active.'}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300">
                    {getTranslation('offline', currentLanguage)}
                  </span>
                  <span className="text-[9px] bg-amber-400 dark:bg-amber-500 text-amber-950 font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <HardDriveDownload className="w-2.5 h-2.5" />
                    <span>{offlineCourses.length}</span>
                  </span>
                  <ChevronDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#72B01D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#72B01D]"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5 text-[#72B01D] shrink-0" />
                  <span className="hidden lg:inline text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    {getTranslation('online', currentLanguage)}
                  </span>
                </>
              )}
            </button>

            {/* Offline Inspector & Cached Courses Popover */}
            {isOffline && offlineDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-amber-400/80 dark:border-amber-600/80 p-4 z-50 text-xs">
                {/* Popover Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-amber-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400/20">
                      <WifiOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">
                        {getTranslation('offlineBannerTitle', currentLanguage)}
                      </h4>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        {offlineCourses.length} {getTranslation('cachedCoursesReady', currentLanguage)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOfflineDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Explicit Availability Highlight */}
                <div className="mb-3.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold leading-snug">
                      {getTranslation('offlineCachedAvailable', currentLanguage)}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                    Lesson modules, interactive quizzes, and local progress tracking remain functional on this device without interruption.
                  </p>
                </div>

                {/* Cached courses preview list */}
                <div className="mb-3.5 space-y-2 max-h-52 overflow-y-auto pr-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                    <span>Available Offline</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{offlineCourses.length} Ready</span>
                  </div>
                  {offlineCourses.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      No courses cached yet.
                    </div>
                  ) : (
                    offlineCourses.map((item) => (
                      <div
                        key={item.courseId}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2.5 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {item.course.title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.course.modulesCount || item.moduleCount || 4} modules ready · {item.course.level}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (onSelectCourse) {
                              onSelectCourse(item.course);
                            } else {
                              onSelectTab('dashboard');
                            }
                            setOfflineDrawerOpen(false);
                          }}
                          className="px-2.5 py-1.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-2xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-[#72B01D]" />
                          <span>Study</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectTab('dashboard');
                      setOfflineDrawerOpen(false);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold text-center cursor-pointer transition-colors"
                  >
                    {getTranslation('accessCachedCourses', currentLanguage)}
                  </button>
                  <button
                    onClick={() => {
                      onToggleSimulateOffline();
                      setOfflineDrawerOpen(false);
                    }}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold text-center cursor-pointer transition-colors shadow-2xs"
                    title="Simulate network recovery"
                  >
                    Reconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Dark Mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="xl:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Quick Button */}
          <button
            onClick={() => onSelectTab('wishlist')}
            className={`p-2 rounded-lg border transition-colors relative cursor-pointer ${
              currentTab === 'wishlist'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0B4F9C] text-[#0B4F9C] dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600'
            }`}
            title="View Wishlist"
            aria-label="View Saved Courses Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#72B01D] text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Quick Button */}
          <button
            onClick={onOpenCart}
            className="p-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C] dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors relative cursor-pointer"
            title="View Enrollment Cart & Multi-Country Checkout"
            aria-label={`View Cart, ${cartCount} items`}
          >
            <ShoppingCart className={`w-4 h-4 ${cartCount > 0 ? 'text-[#0B4F9C] dark:text-blue-400' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0B4F9C] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notification Bell Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`p-2 rounded-lg border transition-all relative cursor-pointer ${
                notificationOpen
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0B4F9C] text-[#0B4F9C] dark:text-blue-400 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0B4F9C]'
              }`}
              title="Notifications & Alerts"
              aria-label={`View notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-white font-black text-[9px] tabular-nums shadow-xs">
                    {unreadCount}
                  </span>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-400 opacity-75 animate-ping" />
                </>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0B4F9C] text-white flex items-center justify-center shadow-xs">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Notifications</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All alerts caught up'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && onMarkAllNotificationsAsRead && (
                        <button
                          onClick={onMarkAllNotificationsAsRead}
                          className="px-2 py-1 text-[11px] font-medium text-[#0B4F9C] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          title="Mark all as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                      {notifications.length > 0 && onClearNotifications && (
                        <button
                          onClick={onClearNotifications}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer transition-colors"
                          title="Clear all notifications"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 pt-1 text-xs">
                    <button
                      onClick={() => setActiveNotifFilter('all')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        activeNotifFilter === 'all'
                          ? 'bg-[#0B4F9C] text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setActiveNotifFilter('courses')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        activeNotifFilter === 'courses'
                          ? 'bg-[#0B4F9C] text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      Courses ({courseAlertsCount})
                    </button>
                    <button
                      onClick={() => setActiveNotifFilter('certifications')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        activeNotifFilter === 'certifications'
                          ? 'bg-[#0B4F9C] text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-[#72B01D]" />
                      Verified ({certAlertsCount})
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-10 px-4 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <BellOff className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No notifications found</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        You are completely caught up! New course announcements and credential verification confirmations will appear here.
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => {
                      const isCourse = notif.type === 'course_added';
                      const isCert = notif.type === 'certification_verified';

                      return (
                        <div
                          key={notif.id}
                          className={`p-3.5 transition-colors relative group ${
                            notif.read ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-blue-50/40 dark:bg-blue-950/40 hover:bg-blue-50/70'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              {isCourse ? (
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-blue-300 flex items-center justify-center">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                              ) : isCert ? (
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                                  <ShieldCheck className="w-4 h-4 text-[#72B01D]" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                                    isCourse
                                      ? 'bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-blue-300'
                                      : isCert
                                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                                      : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
                                  }`}
                                >
                                  {notif.badgeLabel || (isCourse ? 'New Course' : 'Verified Certificate')}
                                </span>
                                <span className="text-[10px] text-slate-400 tabular-nums">
                                  {notif.timestamp}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                                {notif.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>

                              <div className="mt-2.5 flex items-center justify-between">
                                <button
                                  onClick={() => handleNotificationSelect(notif)}
                                  className="text-xs font-semibold text-[#0B4F9C] dark:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <span>{isCourse ? 'View Course Details' : 'Inspect Verified Credential'}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                {!notif.read && onMarkNotificationAsRead && (
                                  <button
                                    onClick={() => onMarkNotificationAsRead(notif.id)}
                                    className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                                    title="Mark as read"
                                  >
                                    <CheckCheck className="w-3 h-3" />
                                    <span>Read</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {!notif.read && (
                              <div className="shrink-0 pt-1">
                                <span className="w-2 h-2 rounded-full bg-[#0B4F9C] block ring-4 ring-blue-100 dark:ring-blue-950" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom interactive simulation bar */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium px-1 mb-1.5 flex items-center justify-between">
                    <span>Simulate Real-Time Trigger:</span>
                    <span className="text-[9px] text-[#72B01D] font-bold">Live Alert Simulator</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={onSimulateNewCourseAlert}
                      className="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-semibold text-[#0B4F9C] dark:text-blue-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>+ Course Alert</span>
                    </button>
                    <button
                      onClick={onSimulateCertificateVerifiedAlert}
                      className="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#72B01D]" />
                      <span>+ Verify Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* In-App PWA Install Prompt */}
          <PWAInstallButton />

          {/* Student LMS Quick Action */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{getTranslation('studentDashboard', currentLanguage)}</span>
          </button>
        </div>

        {/* Mobile menu trigger + quick actions */}
        <div className="xl:hidden flex items-center gap-1.5">
          {/* Mobile direct connection status button */}
          <button
            onClick={() => {
              if (isOffline) {
                setOfflineDrawerOpen(!offlineDrawerOpen);
              } else {
                onToggleSimulateOffline();
              }
            }}
            className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isOffline
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
            }`}
            title={isOffline ? 'Offline Mode active - Cached courses available' : 'Online active'}
            aria-label={isOffline ? 'Offline Mode active. View cached courses available.' : 'Online active.'}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-200">
                  {offlineCourses.length}
                </span>
              </>
            ) : (
              <Wifi className="w-4 h-4 text-[#72B01D]" />
            )}
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Cart Button */}
          <button
            onClick={onOpenCart}
            className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer relative"
            aria-label="Open Enrollment Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0B4F9C] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-between ${
                currentTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badgeText && (
                <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full">
                  {item.badgeText}
                </span>
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#72B01D] text-white rounded-full tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Mobile Currency & Language Selectors */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  {getTranslation('currency', currentLanguage)}
                </label>
                <select
                  value={currentCurrency}
                  onChange={(e) => onChangeCurrency(e.target.value as SupportedCurrency)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  {(Object.keys(CURRENCIES) as SupportedCurrency[]).map((c) => (
                    <option key={c} value={c}>
                      {CURRENCIES[c].flag} {c} ({CURRENCIES[c].symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Language</label>
                <select
                  value={currentLanguage}
                  onChange={(e) => onChangeLanguage(e.target.value as Language)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Connection Status Badge & Offline Cached Notice */}
            <div className={`p-3 rounded-xl border text-xs space-y-2.5 ${
              isOffline
                ? 'bg-amber-500/15 border-amber-400 dark:border-amber-600/80 text-amber-900 dark:text-amber-200'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOffline ? (
                    <div className="p-1 rounded-md bg-amber-500 text-slate-950">
                      <WifiOff className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <Wifi className="w-4 h-4 text-[#72B01D]" />
                  )}
                  <span className="font-extrabold text-xs">
                    {isOffline ? getTranslation('offlineBannerTitle', currentLanguage) : getTranslation('onlineStatus', currentLanguage)}
                  </span>
                </div>
                <button
                  onClick={onToggleSimulateOffline}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                    isOffline
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isOffline ? 'Simulate Online' : 'Test Offline'}
                </button>
              </div>

              {isOffline && (
                <div className="pt-2 border-t border-amber-300/40 dark:border-amber-700/40 space-y-2">
                  <div className="flex items-start gap-1.5 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="font-bold leading-snug">
                      {getTranslation('offlineCachedAvailable', currentLanguage)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-900/40 px-2 py-1 rounded-lg">
                    <span>{getTranslation('cachedCoursesReady', currentLanguage)}:</span>
                    <span className="font-black text-amber-900 dark:text-amber-100">{offlineCourses.length} Courses</span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTab('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 text-center text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{getTranslation('accessCachedCourses', currentLanguage)}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Cart & Checkout Action */}
            <button
              onClick={() => {
                if (onOpenCart) onOpenCart();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-center text-xs font-bold text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg shadow-2xs flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                <span>Enrollment Cart &amp; Multi-Country Checkout</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0B4F9C] text-white text-[10px] font-black">
                {cartCount}
              </span>
            </button>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Offline App:</span>
              <PWAInstallButton />
            </div>

            <button
              onClick={() => {
                onSelectTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-[#0B4F9C] rounded-lg cursor-pointer"
            >
              {getTranslation('studentDashboard', currentLanguage)}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
