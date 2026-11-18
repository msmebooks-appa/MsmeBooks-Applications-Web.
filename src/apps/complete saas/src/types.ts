/**
 * MsmeBooks Authentication & Platform Types
 */

export type AuthScreen =
  | 'signin'
  | 'signup-personal'
  | 'signup-business'
  | 'signup-verify'
  | 'signup-setup'
  | 'signup-complete'
  | 'forgot-password'
  | 'reset-password'
  | 'two-factor'
  | 'select-company'
  | 'select-branch'
  | 'welcome-transition'
  | 'dashboard'
  | 'security-state'
  | 'security-settings';

export type TwoFactorMethod = 'email' | 'sms' | 'authenticator' | 'pattern' | 'backup' | 'qr_code';

export type SecurityStateType =
  | 'new-device'
  | 'session-expired'
  | 'unauthorized'
  | 'account-locked'
  | 'suspicious';

export type UserRole =
  | 'super_admin'
  | 'business_owner'
  | 'administrator'
  | 'accountant'
  | 'finance_manager'
  | 'store_manager'
  | 'branch_manager'
  | 'sales_manager'
  | 'inventory_manager'
  | 'pos_operator'
  | 'employee'
  | 'auditor'
  | 'external_accountant';

export interface UserRoleInfo {
  role: UserRole;
  label: string;
  department: string;
  permissions: string[];
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  state: string;
  code: string;
  isHeadOffice?: boolean;
  phone: string;
  managerName: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  country: string;
  branchesCount: number;
  warehousesCount: number;
  userRole: UserRole;
  currency: string;
  currencySymbol: string;
  logoUrl?: string;
  taxNumber?: string;
  branches: Branch[];
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  trustDeviceFor30Days: boolean;
  lastLogin: string;
}

export interface BusinessRegistrationData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;

  // Step 2: Business details
  businessName: string;
  businessType: string;
  country: string;
  stateRegion: string;
  currency: string;
  businessSize: 'Micro' | 'Small' | 'Medium' | 'Large';

  // Step 3: Verification
  verificationCode: string;
  emailVerified: boolean;

  // Step 4: Business Setup
  businessAddress: string;
  taxIdNumber: string;
  financialYearStart: string;
  website?: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: string;
  event: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'warning' | 'alert';
}

export interface AIAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  dataSnippet?: {
    type: 'metric' | 'table' | 'insight';
    title: string;
    items: { label: string; value: string; delta?: string }[];
  };
}

export type BiometricMethod = 'fingerprint' | 'face' | 'auto';

export interface BiometricPreferences {
  enabled: boolean;
  preferredMethod: BiometricMethod;
  requireForHighValueTransactions: boolean;
  requireOnAppResume: boolean;
  allowPatternFallback: boolean;
  trustDevice30Days: boolean;
  sensorHaptic: boolean;
  registeredKeyId: string;
  lastUpdated: string;
  authenticatorName: string;
}
