import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type Language = 'en' | 'fr' | 'sw' | 'yo';

export interface LanguageInfo {
  code: Language;
  name: string;
  englishName: string;
  flag: string;
  badge: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    englishName: 'English',
    flag: '🇬🇧',
    badge: 'EN',
    region: 'Global / West Africa',
  },
  {
    code: 'fr',
    name: 'Français',
    englishName: 'French',
    flag: '🇫🇷',
    badge: 'FR',
    region: 'Afrique Francophone',
  },
  {
    code: 'sw',
    name: 'Kiswahili',
    englishName: 'Swahili',
    flag: '🇰🇪',
    badge: 'SW',
    region: 'Afrika Mashariki',
  },
  {
    code: 'yo',
    name: 'Yorùbá',
    englishName: 'Yoruba',
    flag: '🇳🇬',
    badge: 'YO',
    region: 'Ìwọ-oòrùn Áfíríkà',
  },
];

export interface TranslationDictionary {
  [key: string]: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    // Top Navigation & Entity Context
    appTitle: 'MsmeBooks Enterprise',
    switchBusiness: 'Switch Business',
    switchBranch: 'Switch Branch',
    askAI: 'Ask MsmeBooks AI',
    askAIPlaceholder: 'Ask MsmeBooks AI: "How much did we sell this month?"',
    switchRole: 'Switch Active Role',
    securitySettings: 'Security Settings',
    signOut: 'Sign Out',
    secureAccess: 'Secure Business Access',
    secureSession: 'Secure Cloud Session',
    theme: 'Theme',
    language: 'Language',
    selectLanguage: 'Select Language',
    quickDemoFlow: 'Interactive Flow Navigator',

    // Core Tabs
    accountingAndFinance: 'Accounting & Finance',
    posAndSales: 'POS & Sales',
    inventoryAndStock: 'Inventory & Stock',
    businessGovernance: 'Business Governance',

    // Sub-Tabs
    overview: 'Overview',
    chartOfAccounts: 'Chart of Accounts',
    journalEntries: 'Journal Entries',
    profitAndLoss: 'Profit & Loss',
    balanceSheet: 'Balance Sheet',
    taxAndVat: 'Tax & VAT',
    invoices: 'Invoices',
    auditTrail: 'Audit Trail',
    pointOfSale: 'Point of Sale',
    salesOrders: 'Sales Orders',
    customers: 'Customers',
    receipts: 'Receipts',
    productsAndStock: 'Products & Stock',
    stockAdjustments: 'Stock Adjustments',
    suppliers: 'Suppliers',
    purchaseOrders: 'Purchase Orders',
    branchesAndEntities: 'Branches & Entities',
    usersAndRoles: 'Users & Roles',
    systemSettings: 'System Settings',
    complianceLogs: 'Compliance Logs',

    // Dashboard Overview Metrics
    totalRevenue: 'Total Revenue',
    netProfit: 'Net Profit',
    operatingExpenses: 'Operating Expenses',
    cashAndBank: 'Cash & Bank Balances',
    recentTransactions: 'Recent Transactions',
    newInvoice: 'New Invoice',
    recordExpense: 'Record Expense',
    makeSale: 'Make Sale (POS)',
    exportReport: 'Export Report',
    quickActions: 'Quick Actions',

    // Table Columns & Statuses
    status: 'Status',
    date: 'Date',
    amount: 'Amount',
    customer: 'Customer',
    action: 'Action',
    approved: 'Approved',
    pending: 'Pending',
    draft: 'Draft',
    paid: 'Paid',
    overdue: 'Overdue',

    // Security Simulations
    simulate: 'Simulate:',
    newDevice: 'New Device',
    sessionExpired: 'Session Expired',
    unauthorized: 'Unauthorized',
    accountLocked: 'Locked',
    suspiciousActivity: 'Suspicious Activity',

    // Security Settings View
    securityAndLogin: 'Security & Login Settings',
    securitySubtitle: 'Manage multi-factor authentication, active enterprise sessions, and credentials.',
    backToWorkspace: 'Back to Workspace',
    twoFactorAuth: 'Two-Factor Authentication (2FA)',
    twoFactorSubtitle: 'Mandatory for high-value invoice approvals and multi-branch ledger edits.',
    displayAndTheme: 'Display & Color Theme',
    displaySubtitle: 'Synchronize light, dark, or system appearance across the MsmeBooks portal.',
    activeSessions: 'Active Enterprise Sessions',
    securityLogs: 'Recent Security Logs',

    // Auth & Common
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    verifyEmail: 'Verify Email',
    backToSignIn: 'Back to Sign In',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    continue: 'Continue',
    submit: 'Submit',
    cancel: 'Cancel',
    resend: 'Resend',
    copy: 'Copy',
    copied: 'Copied',
    close: 'Close',
    search: 'Search',
    welcomeBack: 'Welcome Back',
    step: 'Step',
    of: 'of',
  },

  fr: {
    // Top Navigation & Entity Context
    appTitle: 'MsmeBooks Entreprise',
    switchBusiness: "Changer d'entreprise",
    switchBranch: 'Changer de succursale',
    askAI: 'Demander à MsmeBooks IA',
    askAIPlaceholder: "Demander à MsmeBooks IA : « Combien avons-nous vendu ce mois-ci ? »",
    switchRole: 'Changer de rôle actif',
    securitySettings: 'Paramètres de sécurité',
    signOut: 'Déconnexion',
    secureAccess: "Accès d'entreprise sécurisé",
    secureSession: 'Session Cloud sécurisée',
    theme: 'Thème',
    language: 'Langue',
    selectLanguage: 'Choisir la langue',
    quickDemoFlow: 'Navigateur de flux interactif',

    // Core Tabs
    accountingAndFinance: 'Comptabilité et Finance',
    posAndSales: 'Point de Vente et Ventes',
    inventoryAndStock: 'Inventaire et Stocks',
    businessGovernance: "Gouvernance d'entreprise",

    // Sub-Tabs
    overview: "Vue d'ensemble",
    chartOfAccounts: 'Plan comptable',
    journalEntries: 'Écritures de journal',
    profitAndLoss: 'Compte de résultat',
    balanceSheet: 'Bilan',
    taxAndVat: 'Taxes et TVA',
    invoices: 'Factures',
    auditTrail: "Piste d'audit",
    pointOfSale: 'Point de Vente',
    salesOrders: 'Bons de commande',
    customers: 'Clients',
    receipts: 'Reçus',
    productsAndStock: 'Produits et Stocks',
    stockAdjustments: 'Ajustements de stock',
    suppliers: 'Fournisseurs',
    purchaseOrders: "Ordres d'achat",
    branchesAndEntities: 'Succursales et Entités',
    usersAndRoles: 'Utilisateurs et Rôles',
    systemSettings: 'Paramètres système',
    complianceLogs: 'Registres de conformité',

    // Dashboard Overview Metrics
    totalRevenue: 'Revenu total',
    netProfit: 'Bénéfice net',
    operatingExpenses: "Dépenses d'exploitation",
    cashAndBank: 'Soldes de trésorerie et banques',
    recentTransactions: 'Transactions récentes',
    newInvoice: 'Nouvelle facture',
    recordExpense: 'Enregistrer une dépense',
    makeSale: 'Effectuer une vente (POS)',
    exportReport: 'Exporter le rapport',
    quickActions: 'Actions rapides',

    // Table Columns & Statuses
    status: 'Statut',
    date: 'Date',
    amount: 'Montant',
    customer: 'Client',
    action: 'Action',
    approved: 'Approuvé',
    pending: 'En attente',
    draft: 'Brouillon',
    paid: 'Payé',
    overdue: 'En retard',

    // Security Simulations
    simulate: 'Simuler :',
    newDevice: 'Nouvel appareil',
    sessionExpired: 'Session expirée',
    unauthorized: 'Non autorisé',
    accountLocked: 'Verrouillé',
    suspiciousActivity: 'Activité suspecte',

    // Security Settings View
    securityAndLogin: 'Paramètres de sécurité et connexion',
    securitySubtitle: "Gérez l'authentification multi-facteurs, les sessions actives et vos identifiants.",
    backToWorkspace: "Retour à l'espace de travail",
    twoFactorAuth: 'Authentification à deux facteurs (2FA)',
    twoFactorSubtitle: "Requis pour les factures élevées et la modification multi-succursales.",
    displayAndTheme: "Affichage et Thème visuel",
    displaySubtitle: "Synchronisez l'apparence claire, sombre ou système sur le portail.",
    activeSessions: "Sessions d'entreprise actives",
    securityLogs: 'Journaux de sécurité récents',

    // Auth & Common
    signIn: 'Se connecter',
    signUp: 'Créer un compte',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser le mot de passe',
    verifyEmail: "Vérifier l'e-mail",
    backToSignIn: 'Retour à la connexion',
    emailAddress: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    rememberMe: 'Se souvenir de moi',
    continue: 'Continuer',
    submit: 'Soumettre',
    cancel: 'Annuler',
    resend: 'Renvoyer',
    copy: 'Copier',
    copied: 'Copié',
    close: 'Fermer',
    search: 'Rechercher',
    welcomeBack: 'Bon retour parmi nous',
    step: 'Étape',
    of: 'sur',
  },

  sw: {
    // Top Navigation & Entity Context
    appTitle: 'MsmeBooks ya Shirika',
    switchBusiness: 'Badilisha Biashara',
    switchBranch: 'Badilisha Tawi',
    askAI: 'Uliza MsmeBooks AI',
    askAIPlaceholder: "Uliza MsmeBooks AI: 'Tumeuza kiasi gani mwezi huu?'",
    switchRole: 'Badilisha Wadhifa',
    securitySettings: 'Mipangilio ya Usalama',
    signOut: 'Ondoka',
    secureAccess: 'Ufikiaji Salama wa Biashara',
    secureSession: 'Kipindi Salama cha Wingu',
    theme: 'Mandhari',
    language: 'Lugha',
    selectLanguage: 'Chagua Lugha',
    quickDemoFlow: 'Kiongozi cha Maandamano ya Moja kwa Moja',

    // Core Tabs
    accountingAndFinance: 'Uhasibu na Fedha',
    posAndSales: 'POS na Mauzo',
    inventoryAndStock: 'Mali na Hifadhi',
    businessGovernance: 'Utawala wa Biashara',

    // Sub-Tabs
    overview: 'Muhtasari',
    chartOfAccounts: 'Orodha ya Akaunti',
    journalEntries: 'Maingizo ya Jarida',
    profitAndLoss: 'Faida na Hasara',
    balanceSheet: 'Lahajedwali ya Mizania',
    taxAndVat: 'Kodi na VAT',
    invoices: 'Ankara',
    auditTrail: 'Njia ya Ukaguzi',
    pointOfSale: 'Sehemu ya Mauzo',
    salesOrders: 'Maagizo ya Mauzo',
    customers: 'Wateja',
    receipts: 'Stakabadhi',
    productsAndStock: 'Bidhaa na Akiba',
    stockAdjustments: 'Marekebisho ya Akiba',
    suppliers: 'Wasambazaji',
    purchaseOrders: 'Maagizo ya Ununuzi',
    branchesAndEntities: 'Matawi na Mashirika',
    usersAndRoles: 'Watumiaji na Majukumu',
    systemSettings: 'Mipangilio ya Mfumo',
    complianceLogs: 'Kumbukumbu za Uzingatiaji',

    // Dashboard Overview Metrics
    totalRevenue: 'Mapato Yote',
    netProfit: 'Faida Halisi',
    operatingExpenses: 'Gharama za Uendeshaji',
    cashAndBank: 'Salio la Fedha na Benki',
    recentTransactions: 'Miamala ya Hivi Karibuni',
    newInvoice: 'Ankara Mpya',
    recordExpense: 'Rekodi Gharama',
    makeSale: 'Fanya Mauzo (POS)',
    exportReport: 'Pakua Ripoti',
    quickActions: 'Hatua za Haraka',

    // Table Columns & Statuses
    status: 'Hali',
    date: 'Tarehe',
    amount: 'Kiasi',
    customer: 'Mteja',
    action: 'Kitendo',
    approved: 'Imeidhinishwa',
    pending: 'Inasubiri',
    draft: 'Rasimu',
    paid: 'Imelipwa',
    overdue: 'Imechelewa',

    // Security Simulations
    simulate: 'Iga:',
    newDevice: 'Kifaa Kipya',
    sessionExpired: 'Kipindi Kimekwisha',
    unauthorized: 'Huna Ruhusa',
    accountLocked: 'Imefungwa',
    suspiciousActivity: 'Shughuli Yenye Shaka',

    // Security Settings View
    securityAndLogin: 'Mipangilio ya Usalama na Kuingia',
    securitySubtitle: 'Dhibiti uthibitishaji wa vipengele viwili, vipindi vinavyotumika na vitambulisho.',
    backToWorkspace: 'Rudi Eneo la Kazi',
    twoFactorAuth: 'Uthibitishaji wa Hatua Mbili (2FA)',
    twoFactorSubtitle: 'Lazima kwa uidhinishaji wa ankara za thamani kubwa na mabadiliko ya vitabu.',
    displayAndTheme: 'Mwonekano na Mandhari',
    displaySubtitle: 'Sawazisha mandhari mepesi, ya giza, au ya mfumo kwenye tovuti nzima.',
    activeSessions: 'Vipindi Vinavyotumika vya Shirika',
    securityLogs: 'Kumbukumbu za Usalama za Hivi Karibuni',

    // Auth & Common
    signIn: 'Ingia',
    signUp: 'Jisajili',
    forgotPassword: 'Umesahau Nenosiri?',
    resetPassword: 'Weka Upya Nenosiri',
    verifyEmail: 'Thibitisha Barua Pepe',
    backToSignIn: 'Rudi Kuingia',
    emailAddress: 'Barua Pepe',
    password: 'Nenosiri',
    confirmPassword: 'Thibitisha Nenosiri',
    rememberMe: 'Nikumbuke',
    continue: 'Endelea',
    submit: 'Wasilisha',
    cancel: 'Ghairi',
    resend: 'Tuma Tena',
    copy: 'Nakili',
    copied: 'Imenakiliwa',
    close: 'Funga',
    search: 'Tafuta',
    welcomeBack: 'Karibu Tena',
    step: 'Hatua',
    of: 'ya',
  },

  yo: {
    // Top Navigation & Entity Context
    appTitle: 'MsmeBooks Idawọle',
    switchBusiness: 'Yi Iṣowo Pada',
    switchBranch: 'Yi Ẹka Pada',
    askAI: 'Beere lọwọ MsmeBooks AI',
    askAIPlaceholder: "Beere lọwọ MsmeBooks AI: 'Elo ni a ta ni oṣu yii?'",
    switchRole: 'Yi Ipo Pada',
    securitySettings: 'Eto Aabo',
    signOut: 'Wọle Jade',
    secureAccess: 'Wiwọle Aabo Iṣowo',
    secureSession: 'Igba Aawọ Aabo lori Kọmputa',
    theme: 'Àwọ̀',
    language: 'Èdè',
    selectLanguage: 'Yan Èdè',
    quickDemoFlow: 'Olùṣàkóso Ìgbésẹ̀ Àfihàn',

    // Core Tabs
    accountingAndFinance: 'Iṣiro ati Eto Inawo',
    posAndSales: 'POS ati Titaja',
    inventoryAndStock: 'Akojọ Ọja ati Ọja Ti O Wa',
    businessGovernance: 'Isakoso Iṣowo',

    // Sub-Tabs
    overview: 'Akopọ Gbogbogbo',
    chartOfAccounts: 'Akojọ Awọn Akọọlẹ',
    journalEntries: 'Awọn Akọsilẹ Iwe-akọọlẹ',
    profitAndLoss: 'Ere ati Pipadanu',
    balanceSheet: 'Iwe Iwontunwonsi',
    taxAndVat: 'Owo-ori ati VAT',
    invoices: 'Awọn Iwe-owo',
    auditTrail: 'Ọna Ayẹwo',
    pointOfSale: 'Ibudo Titaja (POS)',
    salesOrders: 'Awọn Aṣẹ Titaja',
    customers: 'Awọn Onibara',
    receipts: 'Awọn Iwe-ẹri',
    productsAndStock: 'Awọn Ọja ati Ipamọ',
    stockAdjustments: 'Atunṣe Ọja',
    suppliers: 'Awọn Olupese',
    purchaseOrders: 'Awọn Aṣẹ Rira',
    branchesAndEntities: 'Awọn Ẹka ati Awọn Ajọ',
    usersAndRoles: 'Awọn Olumulo ati Awọn Ipa',
    systemSettings: 'Awọn Eto Eto Kọmputa',
    complianceLogs: 'Awọn Akọsilẹ Ibamu',

    // Dashboard Overview Metrics
    totalRevenue: 'Gbogbo Owo Ti O Wọle',
    netProfit: 'Ere Gidi',
    operatingExpenses: 'Awọn Inawo Iṣẹ',
    cashAndBank: 'Owo Ni Ọwọ ati Ile-ifowopamọ',
    recentTransactions: 'Awọn Iṣowo Aipẹ',
    newInvoice: 'Iwe-owo Titun',
    recordExpense: 'Kọ Inawo Silẹ',
    makeSale: 'Ṣe Titaja (POS)',
    exportReport: 'Gbe Iroyin Jade',
    quickActions: 'Awọn Iṣe Kiakia',

    // Table Columns & Statuses
    status: 'Ipo',
    date: 'Ọjọ',
    amount: 'Iye Owo',
    customer: 'Onibara',
    action: 'Iṣe',
    approved: 'Ti fọwọsi',
    pending: 'Ti n duro',
    draft: 'Apejuwe Akọkọ',
    paid: 'Ti San',
    overdue: 'Ti pẹ',

    // Security Simulations
    simulate: 'Ṣe Afarawe:',
    newDevice: 'Ẹrọ Titun',
    sessionExpired: 'Igba Wọle Ti Pari',
    unauthorized: 'Laisi Aṣẹ',
    accountLocked: 'Ti Ti Pa',
    suspiciousActivity: 'Iṣe Ti O Fura',

    // Security Settings View
    securityAndLogin: 'Aabo ati Awọn Eto Wiwọle',
    securitySubtitle: 'Ṣakoso ijẹrisi ipele meji, awọn igba wọle lọwọlọwọ, ati awọn iwe eri rẹ.',
    backToWorkspace: 'Pada si Eto Iṣẹ',
    twoFactorAuth: 'Ijẹrisi Ipele Meji (2FA)',
    twoFactorSubtitle: 'O ṣe pataki fun ifọwọsi awọn iwe-owo pataki ati atunṣe iwe-ipamọ ẹka pupọ.',
    displayAndTheme: 'Ifihan ati Awọ',
    displaySubtitle: 'Mu imọlẹ, okunkun, tabi eto ẹrọ kọmputa rẹ pọ si lori ẹrọ MsmeBooks.',
    activeSessions: 'Awọn Igba Wọle Lọwọlọwọ',
    securityLogs: 'Awọn Akọsilẹ Aabo Aipẹ',

    // Auth & Common
    signIn: 'Wọle',
    signUp: 'Forukọsilẹ',
    forgotPassword: 'Ṣe o gbagbe Ọrọ igbaniwọle rẹ?',
    resetPassword: 'Tun Ọrọ igbaniwọle Ṣeto',
    verifyEmail: 'Daju Imeeli Rẹ',
    backToSignIn: 'Pada si Wiwọle',
    emailAddress: 'Adirẹsi Imeeli',
    password: 'Ọrọ igbaniwọle',
    confirmPassword: 'Jẹrisi Ọrọ igbaniwọle',
    rememberMe: 'Ranti mi',
    continue: 'Tẹsiwaju',
    submit: 'Fisilẹ',
    cancel: 'Fagilee',
    resend: 'Tuntun Fi Ranṣẹ',
    copy: 'Daakọ',
    copied: 'Ti Daakọ',
    close: 'Paade',
    search: 'Ṣawari',
    welcomeBack: 'Kaabọ Pada',
    step: 'Igbese',
    of: 'ninu',
  },
};

export interface LanguageContextValue {
  language: Language;
  currentLanguageInfo: LanguageInfo;
  languages: LanguageInfo[];
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LANGUAGE_STORAGE_KEY = 'msmebooks_language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'en',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'en' || stored === 'fr' || stored === 'sw' || stored === 'yo') {
          return stored;
        }
      }
    } catch {
      // Fallback
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      }
    } catch (err) {
      console.warn('Unable to persist language to localStorage:', err);
    }
  }, []);

  // Listen to cross-tab storage changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && e.newValue) {
        if (
          e.newValue === 'en' ||
          e.newValue === 'fr' ||
          e.newValue === 'sw' ||
          e.newValue === 'yo'
        ) {
          setLanguageState(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentLanguageInfo = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const activeDict = TRANSLATIONS[language];
      if (activeDict && activeDict[key]) {
        return activeDict[key];
      }
      // Fallback to English
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      currentLanguageInfo,
      languages: SUPPORTED_LANGUAGES,
      setLanguage,
      t,
    }),
    [language, currentLanguageInfo, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
