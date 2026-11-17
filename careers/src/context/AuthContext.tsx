import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile as updateFbProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole, RoleData } from '../types/auth';
import { CandidateApplication, JobAlertSubscription } from '../types/career';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authReady: boolean;
  userApplications: CandidateApplication[];
  userJobAlerts: JobAlertSubscription[];
  userSavedJobIds: string[];
  signIn: (email: string, password: string, selectedRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: Omit<UserProfile, 'id' | 'createdAt' | 'lastLoginAt' | 'isVerified'>, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithSocial: (
    provider: 'linkedin' | 'google' | 'facebook',
    role?: UserRole,
    customData?: { email?: string; fullName?: string; avatarUrl?: string }
  ) => Promise<{ success: boolean; isNewUser: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchDemoUser: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  saveApplication: (app: CandidateApplication) => Promise<void>;
  saveJobAlert: (alert: JobAlertSubscription) => Promise<void>;
  deleteJobAlert: (alertId: string) => Promise<void>;
  demoAccounts: { role: UserRole; title: string; email: string; name: string; description: string }[];
}

const DEMO_ACCOUNTS: { role: UserRole; title: string; email: string; name: string; description: string; profile: UserProfile }[] = [
  {
    role: 'candidate',
    title: 'Candidate / Job Seeker',
    email: 'olumide.adebayo@candidate.africa',
    name: 'Olumide Adebayo',
    description: 'Senior Full-Stack & Cloud Software Engineer exploring Pan-African roles',
    profile: {
      id: 'usr-cand-001',
      email: 'olumide.adebayo@candidate.africa',
      fullName: 'Olumide Adebayo',
      role: 'candidate',
      phone: '+234 803 555 0192',
      country: 'Nigeria',
      city: 'Lagos',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T10:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      roleData: {
        role: 'candidate',
        data: {
          targetRole: 'Senior Full-Stack Engineer / Cloud Architect',
          experienceLevel: 'Senior (6+ years)',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Architecture'],
          expectedSalaryMonthly: '3500',
          currency: 'USD',
          workArrangementPreference: 'Remote',
          resumeFileName: 'Olumide_Adebayo_Senior_Dev_CV.pdf',
          portfolioUrl: 'https://olumide-dev.africa',
          linkedinUrl: 'https://linkedin.com/in/olumide-adebayo',
          bio: 'Passionate about resilient business software and fintech scalability for African enterprises.',
          appliedJobIds: ['job-msme-001', 'job-msme-003'],
          savedJobIds: ['job-msme-002', 'job-msme-004'],
        },
      },
    },
  },
  {
    role: 'employer',
    title: 'Employer / Company',
    email: 'hiring@kudapos.com',
    name: 'Kuda POS & Retail Tech',
    description: 'Verified enterprise MSME hiring for engineering, finance, and merchant operations',
    profile: {
      id: 'usr-emp-001',
      email: 'hiring@kudapos.com',
      fullName: 'Amara Nwosu (Head of Talent)',
      role: 'employer',
      phone: '+234 802 111 9988',
      country: 'Nigeria',
      city: 'Lagos',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-01T08:30:00.000Z',
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      roleData: {
        role: 'employer',
        data: {
          companyName: 'Kuda POS & Retail Systems',
          employerType: 'Enterprise',
          registrationNumber: 'RC-1849204',
          industry: 'Fintech & Cloud POS',
          companySize: '51-200 employees',
          website: 'https://kudapos.example.org',
          hiringVolume: '5-10 roles / quarter',
          hrModulesActive: ['Talent ATS Module', 'Payroll Sync', 'Gemini AI Screening'],
          postedJobIds: ['job-msme-001', 'job-msme-002', 'job-msme-005'],
          verifiedBadge: true,
        },
      },
    },
  },
  {
    role: 'agency',
    title: 'Recruitment Agency',
    email: 'partners@africatalentpartners.com',
    name: 'Africa Talent Partners Agency',
    description: 'Specialized Pan-African staffing agency managing talent pipelines across 5 countries',
    profile: {
      id: 'usr-agn-001',
      email: 'partners@africatalentpartners.com',
      fullName: 'Kwame Mensah (Managing Partner)',
      role: 'agency',
      phone: '+233 24 990 1234',
      country: 'Ghana',
      city: 'Accra',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-10T12:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      roleData: {
        role: 'agency',
        data: {
          agencyName: 'Africa Talent Partners (ATP)',
          agencyLicense: 'GH-REC-2024-912',
          contactPersonTitle: 'Principal Recruitment Director',
          specializationSectors: ['Software & Data', 'Accounting & CFOs', 'Operations & Logistics'],
          clientCountEstimate: '45+ Tech & Enterprise Clients',
          candidateRosterSize: '12,000+ Pre-vetted Professionals',
          servicesProvided: ['Contingency Placement', 'Contract-to-Hire', 'Payroll Employer of Record (EOR)'],
          website: 'https://africatalentpartners.example.com',
          managedClientNames: ['MsmeBooks Ecosystem', 'FinServe Africa', 'Sahara Logistics'],
        },
      },
    },
  },
  {
    role: 'headhunter',
    title: 'Headhunter / Executive Search',
    email: 'chidi.okonkwo@apexexecutive.africa',
    name: 'Chidi Okonkwo (Apex Executive)',
    description: 'Bespoke executive search consultant placing C-Suite and VP-level leaders',
    profile: {
      id: 'usr-head-001',
      email: 'chidi.okonkwo@apexexecutive.africa',
      fullName: 'Chidi Okonkwo',
      role: 'headhunter',
      phone: '+254 711 889 001',
      country: 'Kenya',
      city: 'Nairobi',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-14T09:15:00.000Z',
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      roleData: {
        role: 'headhunter',
        data: {
          practiceName: 'Apex Executive Search Africa',
          executiveFocus: ['Chief Technology Officer (CTO)', 'Chief Financial Officer (CFO)', 'Chief Operating Officer (COO)', 'VP Engineering'],
          yearsInExecutiveSearch: 12,
          confidentialSearchTier: 'Retained Executive',
          regionsCovered: ['Nigeria', 'Kenya', 'Rwanda', 'South Africa', 'Pan-African Diaspora'],
          successfulPlacements: 84,
          linkedinUrl: 'https://linkedin.com/in/chidi-executive-headhunter',
        },
      },
    },
  },
  {
    role: 'partner',
    title: 'Ecosystem Partner',
    email: 'partnerships@alxafrica.com',
    name: 'ALX Africa Tech Fellowship',
    description: 'Tech bootcamp & university career accelerator providing work-ready graduate pipelines',
    profile: {
      id: 'usr-part-001',
      email: 'partnerships@alxafrica.com',
      fullName: 'Ngozi Ezechukwu (Head of Partnerships)',
      role: 'partner',
      phone: '+250 788 334 112',
      country: 'Rwanda',
      city: 'Kigali',
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-20T14:45:00.000Z',
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      roleData: {
        role: 'partner',
        data: {
          organizationName: 'ALX Africa & African Leadership University',
          partnerCategory: 'Education / Bootcamp',
          collaborationScope: ['Graduate Hiring Pipeline', 'Direct ATS Integration', 'Sponsored Upskilling Hackathons'],
          referralCode: 'MSME-PARTNER-ALX',
          totalReferredTalent: 450,
          contactDesignation: 'Director of Employer Partnerships & Career Placement',
          integrationStatus: 'Verified Partner',
        },
      },
    },
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_auth_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading stored user:', e);
    }
    return DEMO_ACCOUNTS[0].profile;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [userApplications, setUserApplications] = useState<CandidateApplication[]>([]);
  const [userJobAlerts, setUserJobAlerts] = useState<JobAlertSubscription[]>([]);
  const [userSavedJobIds, setUserSavedJobIds] = useState<string[]>([]);

  // Sync current user to localStorage for instant offline access
  useEffect(() => {
    if (user) {
      localStorage.setItem('msmebooks_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('msmebooks_auth_user');
    }
  }, [user]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const firestoreData = userSnapshot.data() as UserProfile;
            setUser(firestoreData);
          } else {
            // First time Google sign-in: construct initial profile
            const nameParts = (fbUser.displayName || 'Candidate User').split(' ');
            const initialProfile: UserProfile = {
              id: fbUser.uid,
              email: fbUser.email || '',
              fullName: fbUser.displayName || nameParts[0] || 'Applicant',
              role: 'candidate',
              authProvider: 'google',
              avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              country: 'Nigeria',
              city: 'Lagos',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              isVerified: fbUser.emailVerified || true,
              roleData: getInitialRoleData('candidate', fbUser.email || ''),
            };

            await setDoc(userDocRef, initialProfile);
            setUser(initialProfile);
          }
        } catch (error) {
          console.warn('Could not read user profile from Firestore, using local session:', error);
        }
      }

      setAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to User's Firestore Subcollections (Applications, Alerts, Saved Jobs)
  useEffect(() => {
    const currentUid = firebaseUser?.uid || (user && user.id.startsWith('usr-') ? null : user?.id);

    if (!currentUid) {
      // Load from local storage for demo account
      try {
        const localApps = localStorage.getItem('msmebooks_applications');
        if (localApps) setUserApplications(JSON.parse(localApps));
        const localAlerts = localStorage.getItem('msmebooks_job_alerts');
        if (localAlerts) setUserJobAlerts(JSON.parse(localAlerts));
        const localSaved = localStorage.getItem('msmebooks_saved_jobs');
        if (localSaved) setUserSavedJobIds(JSON.parse(localSaved));
      } catch (e) {
        console.error('Error loading local user items:', e);
      }
      return;
    }

    // 1. Applications Listener
    const appsPath = `users/${currentUid}/applications`;
    const unsubscribeApps = onSnapshot(
      collection(db, 'users', currentUid, 'applications'),
      (snapshot) => {
        const appsList: CandidateApplication[] = [];
        snapshot.forEach((d) => appsList.push(d.data() as CandidateApplication));
        if (appsList.length > 0) {
          setUserApplications(appsList);
          localStorage.setItem('msmebooks_applications', JSON.stringify(appsList));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, appsPath);
      }
    );

    // 2. Alerts Listener
    const alertsPath = `users/${currentUid}/jobAlerts`;
    const unsubscribeAlerts = onSnapshot(
      collection(db, 'users', currentUid, 'jobAlerts'),
      (snapshot) => {
        const alertsList: JobAlertSubscription[] = [];
        snapshot.forEach((d) => alertsList.push(d.data() as JobAlertSubscription));
        if (alertsList.length > 0) {
          setUserJobAlerts(alertsList);
          localStorage.setItem('msmebooks_job_alerts', JSON.stringify(alertsList));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, alertsPath);
      }
    );

    // 3. Saved Jobs Listener
    const savedPath = `users/${currentUid}/savedJobs`;
    const unsubscribeSaved = onSnapshot(
      collection(db, 'users', currentUid, 'savedJobs'),
      (snapshot) => {
        const savedIds: string[] = [];
        snapshot.forEach((d) => savedIds.push(d.data().jobId || d.id));
        if (savedIds.length > 0) {
          setUserSavedJobIds(savedIds);
          localStorage.setItem('msmebooks_saved_jobs', JSON.stringify(savedIds));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, savedPath);
      }
    );

    return () => {
      unsubscribeApps();
      unsubscribeAlerts();
      unsubscribeSaved();
    };
  }, [firebaseUser, user?.id]);

  // Sign In with Email & Password
  const signIn = async (
    email: string,
    password: string,
    selectedRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Check if this is one of our instant interactive demo accounts
      const matchedDemo = DEMO_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === normalizedEmail || (selectedRole && acc.role === selectedRole && normalizedEmail.includes('demo'))
      );

      if (matchedDemo && (password === 'password123' || !password)) {
        const updated = {
          ...matchedDemo.profile,
          lastLoginAt: new Date().toISOString(),
        };
        setUser(updated);
        setIsLoading(false);
        return { success: true };
      }

      // Real Firebase Authentication
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const uid = cred.user.uid;

      // Fetch or sync user profile from Firestore
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        setUser(profile);
      } else {
        const newProfile: UserProfile = {
          id: uid,
          email: normalizedEmail,
          fullName: cred.user.displayName || normalizedEmail.split('@')[0],
          role: selectedRole || 'candidate',
          country: 'Nigeria',
          city: 'Lagos',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isVerified: cred.user.emailVerified,
          roleData: getInitialRoleData(selectedRole || 'candidate', normalizedEmail),
        };
        await setDoc(userDocRef, newProfile);
        setUser(newProfile);
      }

      setIsLoading(false);
      return { success: true };
    } catch (firebaseErr: any) {
      console.warn('Firebase sign-in error:', firebaseErr?.code, firebaseErr?.message);

      // Handle common Firebase errors gracefully
      let userFriendlyMessage = firebaseErr?.message || 'Authentication failed. Please check your credentials.';
      if (firebaseErr?.code === 'auth/user-not-found' || firebaseErr?.code === 'auth/invalid-credential') {
        userFriendlyMessage = 'Invalid email or password. Please verify your credentials or create a new account.';
      } else if (firebaseErr?.code === 'auth/wrong-password') {
        userFriendlyMessage = 'Incorrect password. Please try again.';
      } else if (firebaseErr?.code === 'auth/invalid-email') {
        userFriendlyMessage = 'Please enter a valid email address.';
      } else if (firebaseErr?.code === 'auth/too-many-requests') {
        userFriendlyMessage = 'Too many attempts. Please try again in a few minutes.';
      }

      setIsLoading(false);
      return { success: false, error: userFriendlyMessage };
    }
  };

  // Sign Up with Email & Password
  const signUp = async (
    data: Omit<UserProfile, 'id' | 'createdAt' | 'lastLoginAt' | 'isVerified'>,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const normalizedEmail = data.email.trim().toLowerCase();

      // 1. Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const uid = cred.user.uid;

      // 2. Set Firebase Auth display name
      if (data.fullName) {
        await updateFbProfile(cred.user, { displayName: data.fullName }).catch(() => {});
      }

      // 3. Create persistent profile document in Firestore
      const newProfile: UserProfile = {
        ...data,
        id: uid,
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isVerified: cred.user.emailVerified || true,
      };

      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, newProfile);
      setUser(newProfile);

      setIsLoading(false);
      return { success: true };
    } catch (firebaseErr: any) {
      console.warn('Firebase sign-up error:', firebaseErr?.code, firebaseErr?.message);

      let userFriendlyMessage = firebaseErr?.message || 'Registration failed. Please try again.';
      if (firebaseErr?.code === 'auth/email-already-in-use') {
        userFriendlyMessage = 'An account with this email already exists. Please log in instead.';
      } else if (firebaseErr?.code === 'auth/weak-password') {
        userFriendlyMessage = 'Password must be at least 6 characters long.';
      } else if (firebaseErr?.code === 'auth/invalid-email') {
        userFriendlyMessage = 'Please enter a valid email address.';
      }

      setIsLoading(false);
      return { success: false, error: userFriendlyMessage };
    }
  };

  // Social Authentication (Google Popup & Federated Identity)
  const signInWithSocial = async (
    provider: 'linkedin' | 'google' | 'facebook',
    role?: UserRole,
    customData?: { email?: string; fullName?: string; avatarUrl?: string }
  ): Promise<{ success: boolean; isNewUser: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const targetRole = role || 'candidate';

      if (provider === 'google') {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.addScope('profile');
        googleProvider.addScope('email');

        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const uid = fbUser.uid;

        const userDocRef = doc(db, 'users', uid);
        const snap = await getDoc(userDocRef);

        let finalProfile: UserProfile;
        let isNew = false;

        if (snap.exists()) {
          finalProfile = {
            ...(snap.data() as UserProfile),
            lastLoginAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, { lastLoginAt: finalProfile.lastLoginAt }, { merge: true });
        } else {
          isNew = true;
          finalProfile = {
            id: uid,
            email: fbUser.email || 'user@msmebooks.com',
            fullName: fbUser.displayName || 'MsmeBooks Candidate',
            role: targetRole,
            authProvider: 'google',
            avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            country: 'Nigeria',
            city: 'Lagos',
            isVerified: true,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            roleData: getInitialRoleData(targetRole, fbUser.email || ''),
          };
          await setDoc(userDocRef, finalProfile);
        }

        setUser(finalProfile);
        setIsLoading(false);
        return { success: true, isNewUser: isNew };
      } else {
        // LinkedIn / Facebook OAuth simulation with real profile sync
        await new Promise((r) => setTimeout(r, 400));
        let providerEmail = customData?.email || (provider === 'linkedin' ? 'talent.candidate@linkedin-africa.com' : 'partner.user@meta-africa.com');
        let providerName = customData?.fullName || (provider === 'linkedin' ? 'Chidiebere Okonkwo' : 'Amara Nwosu');
        let providerAvatar = customData?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

        const customId = `usr-${provider.slice(0, 3)}-${Date.now().toString().slice(-6)}`;
        const finalProfile: UserProfile = {
          id: customId,
          email: providerEmail,
          fullName: providerName,
          role: targetRole,
          authProvider: provider,
          avatarUrl: providerAvatar,
          country: 'Nigeria',
          city: 'Lagos',
          isVerified: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          roleData: getInitialRoleData(targetRole, providerEmail),
        };

        setUser(finalProfile);
        setIsLoading(false);
        return { success: true, isNewUser: false };
      }
    } catch (e: any) {
      console.warn('Social auth error:', e?.code, e?.message);
      setIsLoading(false);
      return { success: false, isNewUser: false, error: e?.message || 'Social sign-in was cancelled or encountered an issue.' };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setUser(null);
    setFirebaseUser(null);
    setUserApplications([]);
    setUserJobAlerts([]);
    setUserSavedJobIds([]);
    localStorage.removeItem('msmebooks_auth_user');
  };

  // Switch demo account
  const switchDemoUser = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((acc) => acc.role === role);
    if (demo) {
      const updated = {
        ...demo.profile,
        lastLoginAt: new Date().toISOString(),
      };
      setUser(updated);
    }
  };

  // Update profile
  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);

    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, updated, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    }
  };

  // Save Job
  const saveJob = async (jobId: string) => {
    if (!userSavedJobIds.includes(jobId)) {
      const updated = [...userSavedJobIds, jobId];
      setUserSavedJobIds(updated);
      localStorage.setItem('msmebooks_saved_jobs', JSON.stringify(updated));

      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid, 'savedJobs', jobId);
          await setDoc(docRef, {
            id: jobId,
            userId: firebaseUser.uid,
            jobId,
            savedAt: new Date().toISOString(),
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${firebaseUser.uid}/savedJobs/${jobId}`);
        }
      }
    }
  };

  // Unsave Job
  const unsaveJob = async (jobId: string) => {
    const updated = userSavedJobIds.filter((id) => id !== jobId);
    setUserSavedJobIds(updated);
    localStorage.setItem('msmebooks_saved_jobs', JSON.stringify(updated));

    if (firebaseUser) {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'savedJobs', jobId);
        await deleteDoc(docRef);
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `users/${firebaseUser.uid}/savedJobs/${jobId}`);
      }
    }
  };

  // Save Job Application
  const saveApplication = async (app: CandidateApplication) => {
    const updated = [app, ...userApplications.filter((a) => a.id !== app.id)];
    setUserApplications(updated);
    localStorage.setItem('msmebooks_applications', JSON.stringify(updated));

    if (firebaseUser) {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'applications', app.id);
        await setDoc(docRef, {
          ...app,
          userId: firebaseUser.uid,
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${firebaseUser.uid}/applications/${app.id}`);
      }
    }
  };

  // Save Job Alert
  const saveJobAlert = async (alert: JobAlertSubscription) => {
    const updated = [alert, ...userJobAlerts.filter((a) => a.id !== alert.id)];
    setUserJobAlerts(updated);
    localStorage.setItem('msmebooks_job_alerts', JSON.stringify(updated));

    if (firebaseUser) {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'jobAlerts', alert.id);
        await setDoc(docRef, {
          ...alert,
          userId: firebaseUser.uid,
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${firebaseUser.uid}/jobAlerts/${alert.id}`);
      }
    }
  };

  // Delete Job Alert
  const deleteJobAlert = async (alertId: string) => {
    const updated = userJobAlerts.filter((a) => a.id !== alertId);
    setUserJobAlerts(updated);
    localStorage.setItem('msmebooks_job_alerts', JSON.stringify(updated));

    if (firebaseUser) {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid, 'jobAlerts', alertId);
        await deleteDoc(docRef);
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `users/${firebaseUser.uid}/jobAlerts/${alertId}`);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        authReady,
        userApplications,
        userJobAlerts,
        userSavedJobIds,
        signIn,
        signUp,
        signInWithSocial,
        signOut,
        switchDemoUser,
        updateProfile,
        saveJob,
        unsaveJob,
        saveApplication,
        saveJobAlert,
        deleteJobAlert,
        demoAccounts: DEMO_ACCOUNTS.map((d) => ({
          role: d.role,
          title: d.title,
          email: d.email,
          name: d.name,
          description: d.description,
        })),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to bootstrap default empty role data
function getInitialRoleData(role: UserRole, email: string): RoleData {
  switch (role) {
    case 'candidate':
      return {
        role: 'candidate',
        data: {
          targetRole: 'Software Engineer',
          experienceLevel: 'Mid-Level (3-5 years)',
          skills: ['React', 'TypeScript', 'Node.js'],
          workArrangementPreference: 'Remote',
        },
      };
    case 'employer':
      return {
        role: 'employer',
        data: {
          companyName: email.split('@')[1]?.split('.')[0]?.toUpperCase() + ' Group',
          employerType: 'Company',
          industry: 'Technology & Services',
          companySize: '11-50 employees',
          hiringVolume: '1-5 roles / quarter',
          hrModulesActive: ['Talent Module', 'ATS'],
          verifiedBadge: true,
        },
      };
    case 'agency':
      return {
        role: 'agency',
        data: {
          agencyName: email.split('@')[1]?.split('.')[0]?.toUpperCase() + ' Recruitment Agency',
          contactPersonTitle: 'Senior Talent Recruiter',
          specializationSectors: ['Technology', 'Finance'],
          clientCountEstimate: '10-25 Clients',
          candidateRosterSize: '2,000+ candidates',
          servicesProvided: ['Contingency Search', 'Executive Search'],
        },
      };
    case 'headhunter':
      return {
        role: 'headhunter',
        data: {
          practiceName: 'Executive Search Partners',
          executiveFocus: ['C-Suite', 'Engineering Leadership'],
          yearsInExecutiveSearch: 8,
          confidentialSearchTier: 'Retained Executive',
          regionsCovered: ['Nigeria', 'Kenya', 'South Africa'],
          successfulPlacements: 35,
        },
      };
    case 'partner':
      return {
        role: 'partner',
        data: {
          organizationName: email.split('@')[1]?.split('.')[0]?.toUpperCase() + ' Talent Accelerator',
          partnerCategory: 'Education / Bootcamp',
          collaborationScope: ['Talent Pipeline', 'Direct Placements'],
          referralCode: 'MSME-' + Date.now().toString().slice(-4),
          totalReferredTalent: 50,
          contactDesignation: 'Partnerships Lead',
          integrationStatus: 'Active',
        },
      };
  }
}
