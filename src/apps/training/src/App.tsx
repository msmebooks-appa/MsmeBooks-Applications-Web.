import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { CourseCatalog } from './components/CourseCatalog';
import { LearningPaths } from './components/LearningPaths';
import { CourseDetailsModal } from './components/CourseDetailsModal';
import { CoursePlayer } from './components/CoursePlayer';
import { SoftwareSandbox } from './components/SoftwareSandbox';
import { StudentDashboard } from './components/StudentDashboard';
import { CertificateVerification } from './components/CertificateVerification';
import { LiveWebinarSystem } from './components/LiveWebinarSystem';
import { CorporatePortal } from './components/CorporatePortal';
import { PartnerAcademy } from './components/PartnerAcademy';
import { InstructorStudio } from './components/InstructorStudio';
import { AILearningAssistant } from './components/AILearningAssistant';
import { EnrollmentModal } from './components/EnrollmentModal';
import { Testimonials } from './components/Testimonials';
import { WhyLearnAndFAQ } from './components/WhyLearnAndFAQ';
import { WishlistView } from './components/WishlistView';
import { TrainingBundles } from './components/TrainingBundles';
import { StudyGroups } from './components/StudyGroups';
import { AdaptiveSkillAssessment } from './components/AdaptiveSkillAssessment';
import { ScrollNavigation } from './components/ScrollNavigation';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Footer } from './components/Footer';
import { COURSES, INITIAL_NOTIFICATIONS, TRAINING_BUNDLES } from './data/mockData';
import { Course, LearningPath, AppNotification, CertificateRecord, TrainingBundle, AssessmentResult } from './types';
import { Language } from './data/translations';
import { SupportedCurrency } from './data/currencies';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { InvoiceReceiptModal } from './components/InvoiceReceiptModal';
import { CartItem, InvoiceRecord } from './data/paymentGateways';
import { 
  Sparkles, 
  Layers, 
  Award, 
  Building, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Heart
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<'student' | 'instructor' | 'corporate' | 'partner' | 'admin'>('student');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Theme state: dark / light (persisted to localStorage)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('msmebooks_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('msmebooks_theme', 'light');
      }
    } catch {}
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Translations Language state (en, fr, pt, es)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_lang') as Language;
      if (['en', 'fr', 'pt', 'es'].includes(saved)) return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  const handleChangeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('msmebooks_lang', lang);
    } catch {}
  };

  // Global Currency state (NGN, USD, GHS, KES, ZAR, XOF, XAF, EUR, GBP)
  const [currentCurrency, setCurrentCurrency] = useState<SupportedCurrency>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_currency') as SupportedCurrency;
      if (['NGN', 'USD', 'GHS', 'KES', 'ZAR', 'XOF', 'XAF', 'EUR', 'GBP'].includes(saved)) {
        return saved;
      }
      return 'NGN';
    } catch {
      return 'NGN';
    }
  });

  const handleChangeCurrency = (curr: SupportedCurrency) => {
    setCurrentCurrency(curr);
    try {
      localStorage.setItem('msmebooks_currency', curr);
    } catch {}
  };

  // Visual Connection Status: tracks navigator.onLine & supports simulator toggle
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleSimulateOffline = () => {
    setIsOffline((prev) => !prev);
  };

  // Adaptive Skill Assessment modal state
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);
  const [assessmentTargetCourse, setAssessmentTargetCourse] = useState<Course>(COURSES[0]);

  // Wishlist state (persisted to localStorage)
  const [wishlistCourseIds, setWishlistCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_wishlist');
      return saved ? JSON.parse(saved) : ['course-2', 'course-4'];
    } catch {
      return ['course-2', 'course-4'];
    }
  });

  const handleToggleWishlist = (courseId: string) => {
    setWishlistCourseIds((prev) => {
      const exists = prev.includes(courseId);
      const updated = exists
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
      try {
        localStorage.setItem('msmebooks_wishlist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearWishlist = () => {
    setWishlistCourseIds([]);
    try {
      localStorage.removeItem('msmebooks_wishlist');
    } catch {}
  };

  // Shopping Cart & Multi-Item Checkout State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_cart_items_v1');
      if (saved) return JSON.parse(saved);
      // Pre-seed with initial starter course in cart
      return [
        {
          id: `item-${COURSES[0].id}`,
          type: 'course',
          title: COURSES[0].title,
          category: COURSES[0].category,
          thumbnail: COURSES[0].thumbnail,
          priceNgn: COURSES[0].priceNgn,
          originalPriceNgn: COURSES[0].priceNgn,
          courseId: COURSES[0].id,
          duration: `${COURSES[0].durationHours} hrs`,
          level: COURSES[0].level,
          instructorName: COURSES[0].instructor.name
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<InvoiceRecord | null>(null);

  const updateCartStorage = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('msmebooks_cart_items_v1', JSON.stringify(items));
    } catch {}
  };

  const handleAddToCart = (itemOrCourse: CartItem | Course | TrainingBundle) => {
    let newItem: CartItem;
    if ('modulesCount' in itemOrCourse) {
      const c = itemOrCourse as Course;
      newItem = {
        id: `course-${c.id}-${Date.now()}`,
        type: 'course',
        title: c.title,
        category: c.category,
        thumbnail: c.thumbnail,
        priceNgn: c.isFree ? 0 : c.priceNgn,
        originalPriceNgn: c.priceNgn,
        courseId: c.id,
        duration: `${c.durationHours} hrs`,
        level: c.level,
        instructorName: c.instructor.name
      };
    } else if ('courseIds' in itemOrCourse) {
      const b = itemOrCourse as TrainingBundle;
      newItem = {
        id: `bundle-${b.id}-${Date.now()}`,
        type: 'bundle',
        title: b.title,
        category: b.category,
        priceNgn: b.discountedPriceNgn,
        originalPriceNgn: b.originalPriceNgn,
        bundleId: b.id,
        duration: 'Career Suite',
        level: 'Executive Track'
      };
    } else {
      newItem = itemOrCourse as CartItem;
    }

    const filtered = cartItems.filter((i) => i.courseId !== newItem.courseId || !newItem.courseId);
    updateCartStorage([...filtered, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (itemId: string) => {
    updateCartStorage(cartItems.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    updateCartStorage([]);
  };

  const handleCheckoutSuccess = (invoice: InvoiceRecord) => {
    const ids: string[] = [];
    invoice.items.forEach((it) => {
      if (it.courseId) ids.push(it.courseId);
      if (it.bundleId) {
        const found = TRAINING_BUNDLES.find((b) => b.id === it.bundleId);
        if (found) ids.push(...found.courseIds);
      }
    });

    if (ids.length > 0) {
      setEnrolledCourseIds((prev) => {
        const merged = Array.from(new Set([...prev, ...ids]));
        try {
          localStorage.setItem('msmebooks_enrolled_courses', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    }

    const notif: AppNotification = {
      id: `notif-invoice-${Date.now()}`,
      type: 'course_added',
      title: `Payment Verified (${invoice.paymentGatewayName})`,
      message: `Tax Invoice #${invoice.invoiceNumber} generated with 7.5% exclusive VAT. Your courses are now active in the Student Dashboard!`,
      timestamp: 'Just now',
      read: false,
      targetTab: 'dashboard',
      badgeLabel: 'Paid & Invoiced'
    };
    handleAddNotification(notif);

    setActiveInvoiceModal(invoice);
  };

  // Enrolled courses state (persisted to localStorage)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_enrolled_courses');
      return saved ? JSON.parse(saved) : ['course-1', 'course-2', 'course-3', 'course-5'];
    } catch {
      return ['course-1', 'course-2', 'course-3', 'course-5'];
    }
  });

  // Course star ratings state (persisted to localStorage)
  const [courseRatings, setCourseRatings] = useState<Record<string, { userRating?: number; averageRating: number; ratingCount: number }>>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_course_ratings');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, { userRating?: number; averageRating: number; ratingCount: number }> = {};
    COURSES.forEach((c) => {
      initial[c.id] = {
        averageRating: c.rating,
        ratingCount: c.ratingCount,
        userRating: c.id === 'course-1' ? 5 : undefined
      };
    });
    return initial;
  });

  const handleRateCourse = (courseId: string, rating: number) => {
    setCourseRatings((prev) => {
      const current = prev[courseId] || {
        averageRating: 5.0,
        ratingCount: 1,
        userRating: undefined
      };
      const hadPriorUserRating = current.userRating !== undefined;
      const newRatingCount = hadPriorUserRating ? current.ratingCount : current.ratingCount + 1;
      const currentSum = hadPriorUserRating
        ? (current.averageRating * current.ratingCount) - (current.userRating || 0)
        : current.averageRating * current.ratingCount;
      const newSum = currentSum + rating;
      const newAverage = parseFloat((newSum / newRatingCount).toFixed(1));

      const updated = {
        ...prev,
        [courseId]: {
          averageRating: newAverage,
          ratingCount: newRatingCount,
          userRating: rating
        }
      };

      try {
        localStorage.setItem('msmebooks_course_ratings', JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  // Notifications state (persisted to localStorage)
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem('msmebooks_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('msmebooks_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    try {
      localStorage.removeItem('msmebooks_notifications');
    } catch {}
  };

  const handleAddNotification = (newNotif: AppNotification) => {
    setNotifications((prev) => {
      const updated = [newNotif, ...prev.filter((n) => n.id !== newNotif.id)];
      try {
        localStorage.setItem('msmebooks_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleNotificationClick = (notif: AppNotification) => {
    handleMarkNotificationAsRead(notif.id);
    if (notif.type === 'course_added' && notif.targetId) {
      const found = COURSES.find((c) => c.id === notif.targetId);
      if (found) {
        setModalCourse(found);
      } else {
        setCurrentTab('courses');
      }
    } else if (notif.type === 'certification_verified' && notif.targetId) {
      setVerificationSearchId(notif.targetId);
      setCurrentTab('verify-certificate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (notif.targetTab) {
      handleSelectTab(notif.targetTab);
    }
  };

  // Real-time notification callbacks from live actions
  const handleCertificateVerified = (cert: CertificateRecord) => {
    const newNotif: AppNotification = {
      id: `notif-cert-${cert.certificateId}-${Date.now()}`,
      type: 'certification_verified',
      title: 'Certification Successfully Verified',
      message: `Registry credential #${cert.certificateId} for ${cert.studentName} (${cert.credentialType}) verified with ${cert.scorePercentage}% score.`,
      timestamp: 'Just now',
      read: false,
      targetTab: 'verify-certificate',
      targetId: cert.certificateId,
      badgeLabel: 'Verified Credential',
      meta: {
        studentName: cert.studentName,
        certificateId: cert.certificateId
      }
    };
    handleAddNotification(newNotif);
  };

  const handleCourseCreated = (course: Course) => {
    const newNotif: AppNotification = {
      id: `notif-course-${course.id}-${Date.now()}`,
      type: 'course_added',
      title: 'New Course Added',
      message: `"${course.title}" was submitted to the catalog under ${course.category}.`,
      timestamp: 'Just now',
      read: false,
      targetTab: 'courses',
      targetId: course.id,
      badgeLabel: 'New Course',
      meta: {
        courseTitle: course.title,
        courseCategory: course.category
      }
    };
    handleAddNotification(newNotif);
  };

  // Live alert simulators for immediate testing in UI
  const handleSimulateNewCourseAlert = () => {
    const sampleOptions = [
      { id: 'course-8', title: 'Commercial Agriculture & Farm Management: Harvest Costing & Silos', cat: 'Agriculture, Agribusiness & Farm Operations' },
      { id: 'course-7', title: 'Public Sector IPSAS Accounting & MDA Financial Governance', cat: 'Public Sector Accounting & IPSAS Standards' }
    ];
    const picked = sampleOptions[Math.floor(Math.random() * sampleOptions.length)];
    const notif: AppNotification = {
      id: `notif-sim-course-${Date.now()}`,
      type: 'course_added',
      title: 'New Course Added',
      message: `"${picked.title}" is now published and open for registration in ${picked.cat}.`,
      timestamp: 'Just now',
      read: false,
      targetTab: 'courses',
      targetId: picked.id,
      badgeLabel: 'New Course',
      meta: {
        courseTitle: picked.title,
        courseCategory: picked.cat
      }
    };
    handleAddNotification(notif);
  };

  const handleSimulateCertificateVerifiedAlert = () => {
    const notif: AppNotification = {
      id: `notif-sim-cert-${Date.now()}`,
      type: 'certification_verified',
      title: 'Certification Successfully Verified',
      message: 'Registry credential #MSME-CERT-2026-90412 for Chiamaka Ngozi Eze (Master Certified Professional Bookkeeper) verified with 98% score.',
      timestamp: 'Just now',
      read: false,
      targetTab: 'verify-certificate',
      targetId: 'MSME-CERT-2026-90412',
      badgeLabel: 'Verified Credential',
      meta: {
        studentName: 'Chiamaka Ngozi Eze',
        certificateId: 'MSME-CERT-2026-90412'
      }
    };
    handleAddNotification(notif);
  };

  // Modal states
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [activePlayerCourse, setActivePlayerCourse] = useState<Course | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [verificationSearchId, setVerificationSearchId] = useState<string>('');

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromGrid = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setModalCourse(course);
  };

  const handleEnrollCourse = (course: Course) => {
    setModalCourse(null);
    setEnrollCourse(course);
  };

  const handleStartPlayer = (course: Course) => {
    setModalCourse(null);
    setActivePlayerCourse(course);
  };

  const handleSelectPath = (path: LearningPath) => {
    const firstCourse = COURSES.find((c) => path.courses.includes(c.id));
    if (firstCourse) {
      setModalCourse(firstCourse);
    } else {
      setCurrentTab('courses');
    }
  };

  const handleViewCertificate = (certId: string) => {
    setVerificationSearchId(certId);
    setCurrentTab('verify-certificate');
  };

  const handleEnrollSuccess = (course: Course, invoice?: InvoiceRecord) => {
    setEnrollCourse(null);
    setEnrolledCourseIds((prev) => {
      if (!prev.includes(course.id)) {
        const updated = [...prev, course.id];
        try {
          localStorage.setItem('msmebooks_enrolled_courses', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });

    if (invoice) {
      setActiveInvoiceModal(invoice);
    } else {
      handleStartPlayer(course);
    }
  };

  // Training Bundle Enrollment
  const handleEnrollBundle = (bundle: TrainingBundle) => {
    setEnrolledCourseIds((prev) => {
      const merged = Array.from(new Set([...prev, ...bundle.courseIds]));
      try {
        localStorage.setItem('msmebooks_enrolled_courses', JSON.stringify(merged));
      } catch {}
      return merged;
    });

    const notif: AppNotification = {
      id: `notif-bundle-${Date.now()}`,
      type: 'course_added',
      title: 'Bundle Enrollment Activated!',
      message: `You have successfully enrolled in "${bundle.title}". All ${bundle.courseIds.length} accredited masterclasses are now available in your dashboard.`,
      timestamp: 'Just now',
      read: false,
      targetTab: 'dashboard',
      badgeLabel: 'Bundle Enrolled'
    };
    handleAddNotification(notif);

    setCurrentTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adaptive Skill Assessment Application
  const handleOpenAssessment = (course?: Course) => {
    setAssessmentTargetCourse(course || COURSES[0]);
    setShowAssessmentModal(true);
  };

  const handleApplyAssessmentRecommendation = (result: AssessmentResult) => {
    setShowAssessmentModal(false);
    const target = COURSES.find((c) => c.id === result.recommendedCourseId) || COURSES[0];
    handleStartPlayer(target);
  };

  // If student is actively inside the Course Player Viewport:
  if (activePlayerCourse) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <CoursePlayer
          course={activePlayerCourse}
          isOffline={isOffline}
          onBack={() => {
            setActivePlayerCourse(null);
            setCurrentTab('dashboard');
          }}
          onOpenSandbox={() => {
            setActivePlayerCourse(null);
            setCurrentTab('sandbox');
          }}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          onCompleteCourse={() => {
            alert(`Congratulations on completing all modules of ${activePlayerCourse.title}! Your verifiable certificate is ready.`);
            setActivePlayerCourse(null);
            setCurrentTab('dashboard');
          }}
        />

        <AILearningAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          onSelectCourseById={(cId) => {
            const c = COURSES.find((item) => item.id === cId);
            if (c) handleStartPlayer(c);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 transition-colors ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        wishlistCount={wishlistCourseIds.length}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearNotifications={handleClearNotifications}
        onNotificationClick={handleNotificationClick}
        onSimulateNewCourseAlert={handleSimulateNewCourseAlert}
        onSimulateCertificateVerifiedAlert={handleSimulateCertificateVerifiedAlert}
        currentLanguage={currentLanguage}
        onChangeLanguage={handleChangeLanguage}
        currentCurrency={currentCurrency}
        onChangeCurrency={handleChangeCurrency}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isOffline={isOffline}
        onToggleSimulateOffline={handleToggleSimulateOffline}
        onSelectCourse={handleStartPlayer}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        
        {/* TAB 1: ACADEMY HOME LANDING PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section */}
            <Hero
              onExploreCourses={() => handleSelectTab('courses')}
              onStartFree={() => {
                const freeCourse = COURSES.find((c) => c.isFree) || COURSES[0];
                handleSelectCourse(freeCourse);
              }}
              onViewCertifications={() => handleSelectTab('learning-paths')}
              onBookCorporate={() => handleSelectTab('corporate')}
              onOpenSandbox={() => handleSelectTab('sandbox')}
              onTakeAssessment={() => handleOpenAssessment(COURSES[0])}
              currentLanguage={currentLanguage}
            />

            {/* Curated Categories Grid (16 categories) */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategoryFromGrid}
            />

            {/* Featured Courses Showcase */}
            <CourseCatalog
              onSelectCourse={handleSelectCourse}
              onEnrollCourse={handleEnrollCourse}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              wishlistCourseIds={wishlistCourseIds}
              onToggleWishlist={handleToggleWishlist}
              courseRatings={courseRatings}
              onRateCourse={handleRateCourse}
              enrolledCourseIds={enrolledCourseIds}
              currentCurrency={currentCurrency}
              currentLanguage={currentLanguage}
            />

            {/* Structured Learning Pathways */}
            <LearningPaths
              onSelectPath={handleSelectPath}
              onSelectCourse={handleSelectCourse}
            />

            {/* Practical Software Training Sandbox Showcase Banner */}
            <section className="py-16 bg-[#073B75] dark:bg-slate-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-xs font-bold text-[#84CC16] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                      Hands-On Learning Innovation
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Practice in the Real MsmeBooks Software Sandbox
                    </h2>
                    <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                      Don't just watch videos. Post real customer invoices, test cashier barcode operations, manage warehouse stock thresholds, and handle hotel PMS check-ins in our safe, simulated company database.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSelectTab('sandbox')}
                        className="px-6 py-3 text-xs font-bold text-slate-950 bg-[#72B01D] hover:bg-[#5B8D17] rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Layers className="w-4 h-4 text-slate-950" />
                        <span>Launch Free Software Sandbox</span>
                      </button>
                      <button
                        onClick={() => setIsAIAssistantOpen(true)}
                        className="px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#84CC16]" />
                        <span>Ask AI Software Guide</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-3 text-xs">
                    <h3 className="font-extrabold text-white text-sm">4 Practice Labs Available</h3>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between">
                        <span>1. Invoicing &amp; VAT 7.5% Posting</span>
                        <span className="text-[#84CC16] font-bold">Ready</span>
                      </div>
                      <div className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between">
                        <span>2. High-Speed POS Cashier Till</span>
                        <span className="text-[#84CC16] font-bold">Ready</span>
                      </div>
                      <div className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between">
                        <span>3. Multi-Warehouse Stock Adjustments</span>
                        <span className="text-[#84CC16] font-bold">Ready</span>
                      </div>
                      <div className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between">
                        <span>4. Hotel PMS &amp; Guest Folio Billing</span>
                        <span className="text-[#84CC16] font-bold">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials & Real African Business Stories */}
            <Testimonials />

            {/* Why Learn & FAQ Accordion */}
            <WhyLearnAndFAQ />
          </div>
        )}

        {/* TAB 2: COURSE CATALOG */}
        {currentTab === 'courses' && (
          <CourseCatalog
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollCourse}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            wishlistCourseIds={wishlistCourseIds}
            onToggleWishlist={handleToggleWishlist}
            courseRatings={courseRatings}
            onRateCourse={handleRateCourse}
            enrolledCourseIds={enrolledCourseIds}
            currentCurrency={currentCurrency}
            currentLanguage={currentLanguage}
          />
        )}

        {/* TAB 3: TRAINING BUNDLES */}
        {currentTab === 'bundles' && (
          <TrainingBundles
            onEnrollBundle={handleEnrollBundle}
            onSelectCourse={handleSelectCourse}
            onAddToCart={handleAddToCart}
            enrolledCourseIds={enrolledCourseIds}
            currentCurrency={currentCurrency}
            currentLanguage={currentLanguage}
          />
        )}

        {/* TAB 4: STUDY GROUPS */}
        {currentTab === 'study-groups' && (
          <StudyGroups
            onSelectCourse={(cId) => {
              const c = COURSES.find((item) => item.id === cId);
              if (c) handleSelectCourse(c);
            }}
            onExploreCourses={() => handleSelectTab('courses')}
          />
        )}

        {/* TAB: WISHLIST (SAVED COURSES) */}
        {currentTab === 'wishlist' && (
          <WishlistView
            wishlistCourseIds={wishlistCourseIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollCourse}
            onExploreCourses={() => handleSelectTab('courses')}
            onClearWishlist={handleClearWishlist}
            currentCurrency={currentCurrency}
            currentLanguage={currentLanguage}
          />
        )}

        {/* TAB 5: LEARNING PATHS */}
        {currentTab === 'learning-paths' && (
          <LearningPaths
            onSelectPath={handleSelectPath}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {/* TAB 6: SOFTWARE SANDBOX */}
        {currentTab === 'sandbox' && (
          <SoftwareSandbox
            onBackToAcademy={() => handleSelectTab('home')}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          />
        )}

        {/* TAB 7: STUDENT DASHBOARD */}
        {currentTab === 'dashboard' && (
          <StudentDashboard
            onContinueCourse={handleStartPlayer}
            onExploreMore={() => handleSelectTab('courses')}
            onOpenSandbox={() => handleSelectTab('sandbox')}
            onViewCertificate={handleViewCertificate}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollCourse}
            wishlistCourseIds={wishlistCourseIds}
            onToggleWishlist={handleToggleWishlist}
            courseRatings={courseRatings}
            onRateCourse={handleRateCourse}
            isOffline={isOffline}
            currentCurrency={currentCurrency}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* TAB 8: VERIFY CERTIFICATE */}
        {currentTab === 'verify-certificate' && (
          <CertificateVerification
            initialCertId={verificationSearchId}
            onCertificateVerified={handleCertificateVerified}
          />
        )}

        {/* TAB 9: LIVE TRAINING & WEBINARS */}
        {currentTab === 'live-training' && (
          <LiveWebinarSystem />
        )}

        {/* TAB 10: CORPORATE PORTAL */}
        {currentTab === 'corporate' && (
          <CorporatePortal
            onExploreCourses={() => handleSelectTab('courses')}
            currentCurrency={currentCurrency}
          />
        )}

        {/* TAB 11: PARTNER ACADEMY */}
        {currentTab === 'partners' && (
          <PartnerAcademy
            onStartPartnerCourse={() => {
              const partnerCourse = COURSES.find((c) => c.category === 'Partner & Reseller Certification') || COURSES[0];
              handleSelectCourse(partnerCourse);
            }}
          />
        )}

        {/* TAB 12: INSTRUCTOR STUDIO */}
        {currentTab === 'instructor' && (
          <InstructorStudio
            onCourseCreated={handleCourseCreated}
          />
        )}

      </main>

      {/* Floating Left: Scroll Up and Down Navigation */}
      <ScrollNavigation />

      {/* Floating Right: Live Peer & Tutor Chat Widget */}
      <LiveChatWidget currentLanguage={currentLanguage} />

      {/* Floating AI Learning Assistant Trigger Button */}
      <div className="fixed bottom-6 right-20 sm:right-24 z-30">
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="px-3.5 py-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 text-xs font-bold border-2 border-white dark:border-slate-800 cursor-pointer group"
          title="Ask AI Learning Assistant"
        >
          <div className="p-1 rounded-full bg-[#72B01D] text-slate-950">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="hidden sm:inline">AI Tutor</span>
        </button>
      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={modalCourse}
        onClose={() => setModalCourse(null)}
        onEnroll={(c) => {
          setModalCourse(null);
          handleEnrollCourse(c);
        }}
        onOpenPlayer={(c) => {
          setModalCourse(null);
          handleStartPlayer(c);
        }}
        onAddToCart={handleAddToCart}
        isWishlisted={modalCourse ? wishlistCourseIds.includes(modalCourse.id) : false}
        onToggleWishlist={handleToggleWishlist}
        userRating={modalCourse ? courseRatings[modalCourse.id]?.userRating : undefined}
        averageRating={modalCourse ? courseRatings[modalCourse.id]?.averageRating : undefined}
        ratingCount={modalCourse ? courseRatings[modalCourse.id]?.ratingCount : undefined}
        onRateCourse={handleRateCourse}
        isEnrolled={modalCourse ? enrolledCourseIds.includes(modalCourse.id) : false}
        currentCurrency={currentCurrency}
        currentLanguage={currentLanguage}
      />

      {/* Course Checkout Modal */}
      <EnrollmentModal
        course={enrollCourse}
        onClose={() => setEnrollCourse(null)}
        onSuccess={handleEnrollSuccess}
        onAddToCart={handleAddToCart}
        currentCurrency={currentCurrency}
        currentLanguage={currentLanguage}
      />

      {/* Pan-African Multi-Country Cart & Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onAddToCart={handleAddToCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
        currentCurrency={currentCurrency}
        currentLanguage={currentLanguage}
      />

      {/* Official Tax Invoice & Payment Receipt Modal */}
      <InvoiceReceiptModal
        invoice={activeInvoiceModal}
        onClose={() => setActiveInvoiceModal(null)}
        onGoToDashboard={() => {
          setActiveInvoiceModal(null);
          setCurrentTab('dashboard');
        }}
        currentCurrency={currentCurrency}
        currentLanguage={currentLanguage}
      />

      {/* Adaptive Skill Assessment Modal */}
      {showAssessmentModal && (
        <AdaptiveSkillAssessment
          onClose={() => setShowAssessmentModal(false)}
          onApplyRecommendation={handleApplyAssessmentRecommendation}
          targetCourse={assessmentTargetCourse}
        />
      )}

      {/* Global AI Assistant Drawer */}
      <AILearningAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onSelectCourseById={(cId) => {
          const c = COURSES.find((item) => item.id === cId);
          if (c) handleStartPlayer(c);
        }}
      />

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />

    </div>
  );
}
