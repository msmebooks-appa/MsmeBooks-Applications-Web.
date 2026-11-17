export type UserRole = 'candidate' | 'employer' | 'agency' | 'headhunter' | 'partner';

export interface CandidateWorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  location?: string;
  highlights: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface CandidateProfile {
  targetRole: string;
  experienceLevel: string;
  skills: string[];
  expectedSalaryMonthly?: string;
  currency?: string;
  workArrangementPreference: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  resumeFileName?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  bio?: string;
  workHistory?: CandidateWorkExperience[];
  education?: CandidateEducation[];
  appliedJobIds?: string[];
  savedJobIds?: string[];
}

export interface EmployerProfile {
  companyName: string;
  employerType: 'Company' | 'Startup' | 'SME' | 'Enterprise';
  registrationNumber?: string;
  industry: string;
  companySize: string;
  website?: string;
  hiringVolume: string;
  hrModulesActive: string[];
  postedJobIds?: string[];
  verifiedBadge: boolean;
}

export interface AgencyProfile {
  agencyName: string;
  agencyLicense?: string;
  contactPersonTitle: string;
  specializationSectors: string[];
  clientCountEstimate: string;
  candidateRosterSize: string;
  servicesProvided: string[];
  website?: string;
  managedClientNames?: string[];
}

export interface HeadhunterProfile {
  practiceName: string;
  executiveFocus: string[]; // e.g. 'C-Suite', 'Engineering Leadership', 'Finance/CFO', 'Product Leadership'
  yearsInExecutiveSearch: number;
  confidentialSearchTier: 'Standard' | 'Retained Executive' | 'Exclusive Talent Partner';
  regionsCovered: string[];
  successfulPlacements: number;
  linkedinUrl?: string;
}

export interface PartnerProfile {
  organizationName: string;
  partnerCategory: 'Education / Bootcamp' | 'University' | 'HR Tech Module' | 'Co-Working / Hub' | 'Financial Institution' | 'Industry Body';
  collaborationScope: string[];
  referralCode: string;
  totalReferredTalent: number;
  contactDesignation: string;
  integrationStatus: 'Active' | 'Pending Review' | 'Verified Partner';
}

export type RoleData =
  | { role: 'candidate'; data: CandidateProfile }
  | { role: 'employer'; data: EmployerProfile }
  | { role: 'agency'; data: AgencyProfile }
  | { role: 'headhunter'; data: HeadhunterProfile }
  | { role: 'partner'; data: PartnerProfile };

export type AuthProviderType = 'email' | 'linkedin' | 'google' | 'facebook';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  authProvider?: AuthProviderType;
  phone?: string;
  country: string;
  city?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  isVerified: boolean;
  roleData: RoleData;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
