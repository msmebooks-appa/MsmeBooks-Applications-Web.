export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCategory =
  | 'Accounting & Financial Management'
  | 'Point of Sale (POS) Operations'
  | 'Inventory & Warehouse Management'
  | 'Retail & Multi-Branch Operations'
  | 'Restaurant & Hospitality Management'
  | 'Hotel Property Management (PMS)'
  | 'Payroll & Business Administration'
  | 'Taxation & Financial Compliance'
  | 'E-commerce & Marketplace Operations'
  | 'Business Analytics & Reporting'
  | 'MsmeBooks Software Implementation'
  | 'Partner & Reseller Certification'
  | 'Entrepreneurship & SME Growth'
  | 'AI Tools & Business Automation'
  | 'Data Migration & System Integration'
  | 'Accounting Practice & Bookkeeping Services'
  // Government & Public Sector
  | 'Public Sector Accounting & IPSAS Standards'
  | 'Government Revenue, IGR & Tax Collection'
  | 'Public Procurement & Tender Compliance'
  | 'Government Hospitals & Public Healthcare Logistics'
  | 'State & Municipal Asset Management'
  | 'Civil Service Payroll & Pension Fund Administration'
  // Private Business Sectors
  | 'Manufacturing, Factory Costing & BOM'
  | 'Agriculture, Agribusiness & Farm Operations'
  | 'Oil, Gas & Energy Financial Accounting'
  | 'Financial Services, Microfinance & Cooperatives'
  | 'Transport, Haulage & Fleet Management'
  | 'Real Estate, Construction & Project Job Costing'
  | 'Private Schools & Higher Education Billing'
  | 'NGO, Non-Profit & Donor Grant Management';

export type BusinessSector = 'All Sectors' | 'Private Sector' | 'Government & Public Sector' | 'Core SaaS Operations';

export interface CategoryItem {
  name: CourseCategory;
  count: number;
  icon: string;
  sector: 'Private Sector' | 'Government & Public Sector' | 'Core SaaS Operations';
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'interactive-demo' | 'document' | 'quiz';
  videoUrl?: string;
  contentSnippet?: string;
  transcript?: string;
  isCompleted?: boolean;
  quiz?: QuizQuestion[];
  downloadableResource?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  verified: boolean;
  totalStudents: number;
  rating: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: CourseCategory;
  sector?: 'Private Sector' | 'Government & Public Sector' | 'Core SaaS Operations';
  level: CourseLevel;
  durationHours: number;
  modulesCount: number;
  lessonsCount: number;
  language: string;
  priceNgn: number;
  isFree: boolean;
  rating: number;
  ratingCount: number;
  enrollmentCount: number;
  certificateEligible: boolean;
  thumbnail: string;
  instructor: Instructor;
  learningObjectives: string[];
  targetAudience: string[];
  prerequisites: string[];
  modules: Module[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  targetRole: string;
  description: string;
  coursesCount: number;
  durationHours: number;
  badge: string;
  courses: string[]; // course IDs
  examRequirements: string;
  certificationTitle: string;
}

export interface CertificateRecord {
  certificateId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  credentialType: string;
  issueDate: string;
  expiryDate?: string;
  scorePercentage: number;
  instructorName: string;
  verificationUrl: string;
  qrCodeUrl?: string;
  status: 'valid' | 'expired' | 'revoked';
  skillsValidated: string[];
}

export interface LiveWebinarSession {
  id: string;
  title: string;
  courseReference?: string;
  instructor: string;
  instructorRole: string;
  date: string;
  time: string;
  duration: string;
  platform: 'Zoom' | 'Microsoft Teams' | 'Google Meet';
  meetingUrl: string;
  capacity: number;
  registeredCount: number;
  status: 'upcoming' | 'live' | 'completed';
  description: string;
}

export interface CorporateDepartment {
  name: string;
  seatsTotal: number;
  seatsAssigned: number;
  completionRate: number;
  employees: {
    id: string;
    name: string;
    email: string;
    course: string;
    progress: number;
    status: 'In Progress' | 'Completed' | 'Not Started';
    lastActive: string;
  }[];
}

export interface PartnerTier {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  commissionRate: string;
  minCertifiedStaff: number;
  description: string;
  perks: string[];
}

export interface AppNotification {
  id: string;
  type: 'course_added' | 'certification_verified' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetTab?: string;
  targetId?: string;
  badgeLabel?: string;
  meta?: {
    courseTitle?: string;
    courseCategory?: string;
    studentName?: string;
    certificateId?: string;
  };
}

export interface CourseRatingData {
  userRating?: number;
  averageRating: number;
  ratingCount: number;
}

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'completion' | 'certification' | 'mastery';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressCurrent?: number;
  progressTarget?: number;
  progressUnit?: string;
  xpReward: number;
  criteria?: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface TrainingBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  badge: string;
  bannerGradient: string;
  courseIds: string[];
  totalHours: number;
  totalModules: number;
  originalPriceNgn: number;
  discountedPriceNgn: number;
  discountPercentage: number;
  featuredPill: string;
  targetAudience: string[];
  careerOutcomes: string[];
}

export interface ActivityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timestamp: string;
  content: string;
  likes: number;
}

export interface ActivityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  location: string;
  category: string;
  timestamp: string;
  content: string;
  codeOrSnippet?: string;
  likesCount: number;
  hasLiked?: boolean;
  comments: ActivityComment[];
  pinned?: boolean;
  courseReferenceId?: string;
  courseReferenceTitle?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  scenario: string;
  options: {
    text: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    isBest: boolean;
  }[];
  explanation: string;
  relatedCategory: string;
}

export interface AssessmentResult {
  scorePercentage: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  recommendedCourseId: string;
  recommendedModules: {
    id: string;
    title: string;
    status: 'priority' | 'fast-track';
    reason: string;
  }[];
  timeSavedHours: number;
}

export interface StudyScheduleItem {
  id: string;
  courseId: string;
  courseTitle: string;
  sessionTitle: string;
  targetDay: string;
  targetTime: string;
  durationMinutes: number;
  completed: boolean;
  reminderEnabled: boolean;
  notes?: string;
  deadlineDate?: string;
}

export interface LiveChatMessage {
  id: string;
  senderName: string;
  senderRole: 'Student' | 'Peer Tutor' | 'Certified Instructor' | 'Moderator';
  senderAvatar: string;
  location: string;
  channel: string;
  message: string;
  timestamp: string;
  isSelf?: boolean;
  likes?: number;
}

