export type WorkArrangement = 'Remote' | 'Hybrid' | 'On-site';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary';

export type ExperienceLevel =
  | 'Internship'
  | 'Entry Level'
  | 'Junior'
  | 'Mid-Level'
  | 'Senior'
  | 'Lead/Manager'
  | 'Executive';

export type PipelineStatus =
  | 'applied'
  | 'screening'
  | 'shortlisted'
  | 'interview'
  | 'assessment'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface CompanyInfo {
  name: string;
  logo?: string;
  verified?: boolean;
  website?: string;
  employerType?: 'Company' | 'Individual' | 'Agency';
}

export interface CompanyBenefitItem {
  title: string;
  description: string;
  category?: string;
}

export interface CompanyCultureValue {
  title: string;
  description: string;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  about: string;
  mission: string;
  vision?: string;
  industry: string;
  companySize: string;
  headquarters: string;
  foundedYear?: string;
  website?: string;
  verified: boolean;
  employerType: 'Company' | 'Startup' | 'SME' | 'Enterprise' | 'Individual' | 'Agency';
  logo?: string;
  accentColor?: string;
  cultureValues: CompanyCultureValue[];
  benefits: CompanyBenefitItem[];
  perksHighlights: string[];
  techStack?: string[];
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface JobSalary {
  min: number;
  max: number;
  currency: 'NGN' | 'USD' | 'KES' | 'RWF' | 'ZAR' | string;
  isPublic: boolean;
  period: 'month' | 'year';
}

export interface JobLocation {
  country: string;
  region?: string;
  city: string;
  isRemote: boolean;
  isWorldwide: boolean;
}

export interface Job {
  id: string;
  slug: string;
  referenceCode: string;
  title: string;
  company: CompanyInfo;
  department: string;
  industry?: string;
  location: JobLocation;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  experienceLevel: ExperienceLevel;
  salary: JobSalary;
  datePosted: string;
  applicationDeadline: string;
  shortDescription: string;
  aboutRole: string;
  keyResponsibilities: string[];
  requiredQualifications: string[];
  preferredQualifications: string[];
  skills: string[];
  benefits: string[];
  availablePositions?: number; // Number of open positions/headcount for this vacancy
  interviewDate?: string; // Target interview commencement or first-round date
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived' | 'closed';
  isSampleDemo: boolean;
  applicantsCount: number;
}

export interface CandidateApplication {
  id: string;
  referenceCode: string;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  department: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience: number;
  currentJobTitle?: string;
  earliestStartDate: string;
  coverLetter?: string;
  resumeFileName: string;
  resumeFileSize: string;
  screeningAnswers: {
    question: string;
    answer: string;
  }[];
  status: PipelineStatus;
  submittedAt: string;
  skills?: string[];
  aiMatchScore?: number;
  extractedSummary?: string;
  recruiterNotes: {
    id: string;
    author: string;
    date: string;
    text: string;
  }[];
  interviewDate?: string;
  rating?: number;
}

export interface ParsedResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  yearsOfExperience: number;
  currentJobTitle: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  summary: string;
  screeningAnswers?: {
    fintechExcitement?: string;
    distributedExperience?: string;
  };
}

export interface TalentCommunityMember {
  id: string;
  fullName: string;
  email: string;
  country: string;
  areaOfInterest: string;
  preferredArrangement: WorkArrangement | 'Any';
  resumeFileName?: string;
  registeredAt: string;
}

export interface JobAlertSubscription {
  id: string;
  email: string;
  category: string;
  department: string;
  location: string;
  employmentType: string;
  workArrangement: string;
  frequency: 'immediate' | 'daily' | 'weekly';
  isVerified: boolean;
  verificationCode?: string;
  subscribedAt: string;
  unsubscribeToken: string;
}

export interface FilterState {
  searchQuery: string;
  companies: string[];
  industries?: string[];
  departments: string[];
  locations: string[];
  countries?: string[];
  states?: string[];
  cities?: string[];
  employmentTypes: EmploymentType[];
  workArrangements: WorkArrangement[];
  experienceLevels: ExperienceLevel[];
  minSalary: number;
  maxSalary: number;
  currency: 'ALL' | 'NGN' | 'USD' | 'GHS' | 'KES' | 'RWF' | 'ZAR';
  datePosted: 'all' | '24h' | '7d' | '14d' | '30d';
  sortBy: 'newest' | 'oldest' | 'title_asc' | 'deadline';
  onlySaved: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  createdAt: string;
  filters: FilterState;
}

export interface PinnedFilterCombination {
  id: string;
  label: string;
  filters: FilterState;
  pinnedAt: string;
}
