import { Language, LanguageInfo } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'Pan-African & Global',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Afrique Francophone & International',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'Angola, Moçambique & Lusofonia',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Guinea Ecuatorial & Internacional',
  },
];

export interface TranslationDictionary {
  common: {
    startFreeTrial: string;
    bookDemo: string;
    talkToSales: string;
    contactSales: string;
    learnMore: string;
    viewFeatures: string;
    close: string;
    cancel: string;
    submit: string;
    save: string;
    search: string;
    all: string;
    loading: string;
    offline: string;
    online: string;
    synced: string;
    popular: string;
    mostPopular: string;
    recommended: string;
    perMonth: string;
    billedAnnually: string;
    billedMonthly: string;
    billedQuarterly: string;
    billedBiYearly: string;
    customPricing: string;
    noCardRequired: string;
    instantSetup: string;
    cancelAnytime: string;
    offlineModeNotice: string;
    offlineBannerTitle: string;
    offlineBannerDesc: string;
    cloudSyncRestored: string;
    connectionActive: string;
    connectionOffline: string;
    simulateToggle: string;
    lastSynced: string;
  };
  nav: {
    brandName: string;
    pricingPlans: string;
    planMatcher: string;
    quizBadge: string;
    featureMatrix: string;
    aiAssistant: string;
    newBadge: string;
    africanFocus: string;
    faqs: string;
    talkToSales: string;
    startTrial: string;
    statusDisplay: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    subtitle: string;
    startTrialCta: string;
    talkToSalesCta: string;
    trustPill: string;
    mockTitle: string;
    livePosBadge: string;
    grossSalesToday: string;
    activeRegisters: string;
    pendingDeliveries: string;
    netMargin: string;
    recentTransactions: string;
    cashflowForecast: string;
    forecastNote: string;
    quickActionSale: string;
    quickActionReceipt: string;
    quickActionSync: string;
    quickActionAudit: string;
    syncedLedger: string;
  };
  billing: {
    monthly: string;
    quarterly: string;
    biYearly: string;
    yearly: string;
    saveDiscountBadge: string;
    quarterlyDiscountBadge: string;
    biYearlyDiscountBadge: string;
    toggleSubtitle: string;
    annualNote: string;
    quarterlyNote: string;
    biYearlyNote: string;
  };
  pricing: {
    starter: {
      name: string;
      description: string;
      bestFor: string;
      cta: string;
      features: string[];
    };
    professional: {
      name: string;
      badge: string;
      description: string;
      bestFor: string;
      cta: string;
      features: string[];
    };
    business: {
      name: string;
      description: string;
      bestFor: string;
      cta: string;
      features: string[];
    };
    enterprise: {
      name: string;
      description: string;
      bestFor: string;
      customPricingText: string;
      cta: string;
      secondaryCta: string;
      features: string[];
    };
    [key: string]: any;
    moneyBackGuarantee: string;
    noSurprises: string;
    vatCompliantNote: string;
  };
  planMatcher: {
    badge: string;
    title: string;
    subtitle: string;
    q1Title: string;
    q1Options: { label: string; sub: string }[];
    q2Title: string;
    q2Options: { label: string; sub: string }[];
    q3Title: string;
    q3Options: { label: string; sub: string }[];
    recommendationTitle: string;
    recommendationSubtitle: string;
    whyThisPlan: string;
    keyHighlights: string;
    ctaButton: string;
    retakeQuiz: string;
  };
  comparison: {
    badge: string;
    title: string;
    subtitle: string;
    categories: {
      accounting: { name: string; desc: string };
      pos: { name: string; desc: string };
      inventory: { name: string; desc: string };
      reporting: { name: string; desc: string };
      users: { name: string; desc: string };
    };
    tableFooterNote: string;
  };
  freeTrial: {
    badge: string;
    title: string;
    subtitle: string;
    perk1Title: string;
    perk1Desc: string;
    perk2Title: string;
    perk2Desc: string;
    perk3Title: string;
    perk3Desc: string;
    ctaTrial: string;
    ctaDemo: string;
  };
  valueRoi: {
    badge: string;
    title: string;
    subtitle: string;
    stat1Number: string;
    stat1Label: string;
    stat1Desc: string;
    stat2Number: string;
    stat2Label: string;
    stat2Desc: string;
    stat3Number: string;
    stat3Label: string;
    stat3Desc: string;
    stat4Number: string;
    stat4Label: string;
    stat4Desc: string;
    calculatorTitle: string;
    calculatorDesc: string;
    timeSavedHours: string;
    lossPrevented: string;
    annualRoiMultiplier: string;
  };
  aiAssistant: {
    badge: string;
    title: string;
    subtitle: string;
    cardTitle: string;
    inputPlaceholder: string;
    askButton: string;
    sampleQueriesBadge: string;
    accuracyBadge: string;
    prompts: { question: string; answer: string; badge: string }[];
  };
  africanFocus: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: {
      offline: { title: string; desc: string; tag: string };
      multiCurrency: { title: string; desc: string; tag: string };
      statutoryTax: { title: string; desc: string; tag: string };
      mobileMoney: { title: string; desc: string; tag: string };
    };
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    trustScore: string;
    verifiedBusinesses: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterBilling: string;
    filterFeatures: string;
    filterSecurity: string;
    filterOnboarding: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    startTrialBtn: string;
    bookDemoBtn: string;
    reassurance1: string;
    reassurance2: string;
    reassurance3: string;
  };
  footer: {
    brandDesc: string;
    platformTitle: string;
    smeSolutionsTitle: string;
    companySupportTitle: string;
    sslBadge: string;
    gdprBadge: string;
    copyright: string;
    panAfricanNote: string;
  };
  liveChat: {
    launcherTitle: string;
    dialogTitle: string;
    agentName: string;
    agentRole: string;
    onlineBadge: string;
    welcomeMessage: string;
    quickPrompt1: string;
    quickPrompt2: string;
    quickPrompt3: string;
    inputPlaceholder: string;
    sendButton: string;
    botResponsePrefix: string;
    phoneContact: string;
    emailContact: string;
  };
  trialModal: {
    trialTitle: string;
    demoTitle: string;
    trialSubtitle: string;
    demoSubtitle: string;
    fullNameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    businessNameLabel: string;
    businessTypeLabel: string;
    selectedPlanLabel: string;
    submitTrialBtn: string;
    submitDemoBtn: string;
    noCardNotice: string;
    successTitle: string;
    successMessage: string;
    closeBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    common: {
      startFreeTrial: 'Start Risk-Free Trial',
      bookDemo: 'Book a Demo',
      talkToSales: 'Talk to Sales',
      contactSales: 'Contact Sales',
      learnMore: 'Learn More',
      viewFeatures: 'View All Features',
      close: 'Close',
      cancel: 'Cancel',
      submit: 'Submit',
      save: 'Save',
      search: 'Search...',
      all: 'All',
      loading: 'Loading...',
      offline: 'Offline Mode',
      online: 'Online',
      synced: 'All changes synced',
      popular: 'POPULAR',
      mostPopular: 'MOST POPULAR',
      recommended: 'Recommended Plan',
      perMonth: '/month',
      billedAnnually: 'Billed annually',
      billedMonthly: 'Billed monthly',
      billedQuarterly: 'Billed quarterly',
      billedBiYearly: 'Billed bi-yearly',
      customPricing: 'Custom Enterprise Pricing',
      noCardRequired: 'No credit card required',
      instantSetup: 'Instant 2-minute setup',
      cancelAnytime: 'Cancel anytime with 1 click',
      offlineModeNotice: 'Working offline. Local sales stored safely on device.',
      offlineBannerTitle: 'Operating in Offline Mode',
      offlineBannerDesc: 'Your network is offline or unstable. MsmeBooks stores sales & inventory locally and will auto-sync once connection returns.',
      cloudSyncRestored: 'Back online — cloud sync complete',
      connectionActive: 'Cloud Sync Connected',
      connectionOffline: 'Offline Mode (Local Storage Active)',
      simulateToggle: 'Simulate Offline Mode',
      lastSynced: 'Last synced at',
    },
    nav: {
      brandName: 'MsmeBooks',
      pricingPlans: 'Pricing Plans',
      planMatcher: 'Plan Matcher',
      quizBadge: 'Quiz',
      featureMatrix: 'Feature Matrix',
      aiAssistant: 'AI Assistant',
      newBadge: 'New',
      africanFocus: 'African SME Focus',
      faqs: 'FAQs',
      talkToSales: 'Talk to Sales',
      startTrial: 'Start Free Trial',
      statusDisplay: 'Status & Display',
    },
    hero: {
      badge: 'Transparent Pan-African Pricing',
      titlePart1: 'Predictable, Transparent Pricing for',
      titleHighlight: 'Every African Business',
      titlePart2: '',
      subtitle: 'From single-outlet shops in computer village to multi-warehouse retail distributors across Africa. Run cloud accounting, offline POS, inventory, and AI analytics without hidden fees.',
      startTrialCta: 'Start Risk-Free Trial',
      talkToSalesCta: 'Schedule Live Demo',
      trustPill: 'Over 12,400+ African SMEs grow with MsmeBooks daily',
      mockTitle: 'Real-Time Enterprise Overview',
      livePosBadge: 'Live Offline POS Active',
      grossSalesToday: 'Gross Sales Today',
      activeRegisters: 'Active Registers',
      pendingDeliveries: 'Pending Deliveries',
      netMargin: 'Net Margin',
      recentTransactions: 'Recent Transactions',
      cashflowForecast: 'Cashflow Forecast',
      forecastNote: 'Expecting invoice settlements to cover upcoming consignment.',
      quickActionSale: 'Record Sale',
      quickActionReceipt: 'Thermal Receipt',
      quickActionSync: 'Sync Register',
      quickActionAudit: 'Tax Audit',
      syncedLedger: 'Encrypted Double-Entry Ledger',
    },
    billing: {
      monthly: 'Monthly Billing',
      quarterly: 'Quarterly Billing',
      biYearly: 'Bi-Yearly Billing',
      yearly: 'Annual Billing',
      saveDiscountBadge: 'Save 20%',
      quarterlyDiscountBadge: '5% OFF',
      biYearlyDiscountBadge: '10% OFF',
      toggleSubtitle: 'Flexible subscription terms with automatic scale savings on longer cycles',
      annualNote: 'Annual subscriptions billed once per year with 20% discount & 24-month price freeze',
      quarterlyNote: 'Quarterly plans billed every 3 months with 5% discount',
      biYearlyNote: 'Bi-yearly plans billed every 6 months with 10% discount & 12-month price freeze',
    },
    pricing: {
      starter: {
        name: 'Starter',
        description: 'Essential tools for small businesses getting started with digital business management.',
        bestFor: 'Solo entrepreneurs, micro retailers, and single-location startups',
        cta: 'Start Free Trial',
        features: [
          'Business profile & branding',
          'Basic cloud accounting',
          'Income & expense tracking',
          'Custom invoicing & quotes',
          'Digital & thermal receipts',
          'Single-register POS',
          'Basic inventory tracking',
          'Customer contact ledger',
          'Supplier management',
          'Daily sales reports',
          'Mobile Android/iOS access',
          'Standard community support',
        ],
      },
      professional: {
        name: 'Professional',
        badge: 'MOST POPULAR',
        description: 'Everything growing businesses need to manage sales, inventory, accounting and customers.',
        bestFor: 'Growing retail stores, pharmacies, restaurants & professional service firms',
        cta: 'Start Free Trial',
        features: [
          'Everything in Starter',
          'Full double-entry accounting',
          'Advanced multi-tender POS',
          'Multi-unit inventory management',
          'Inter-shelf stock transfers',
          'Purchase orders & vendor credits',
          'Automated bank reconciliation',
          'Financial P&L & Balance Sheet',
          'Statutory VAT & WHT schedules',
          'Multiple user accounts & roles',
          'Granular permissions & audit logs',
          'AI-powered business assistant',
          'Priority WhatsApp & phone support',
        ],
      },
      business: {
        name: 'Business',
        description: 'For established businesses managing multiple locations, teams and larger operations.',
        bestFor: 'Supermarkets, multi-store retailers, wholesalers, and multi-depot distributors',
        cta: 'Start Free Trial',
        features: [
          'Everything in Professional',
          'Multiple branch locations',
          'Multiple warehouse depots',
          'Advanced batch & expiry tracking',
          'Inter-branch stock requisitioning',
          'Multi-location POS registers',
          'Customer credit limits & aging',
          'Supplier purchase agreements',
          'Advanced sales analytics & margins',
          'Staff shift & commission tracking',
          'Integrated e-commerce storefront',
          'Open REST API integrations',
          'Priority white-glove onboarding',
          'Dedicated account manager',
        ],
      },
      enterprise: {
        name: 'Enterprise',
        description: 'Powerful business management for large organizations and growing multi-location companies.',
        bestFor: 'Large retail chains, multi-national FMCG distributors, and enterprise franchises',
        customPricingText: 'Tailored to your business',
        cta: 'Contact Sales',
        secondaryCta: 'Book Custom Demo',
        features: [
          'Everything in Business',
          'Unlimited branches & registers',
          'Unlimited regional warehouses',
          'Custom approval workflows',
          'Enterprise role & permission matrix',
          'Custom ERP & payment integrations',
          'Dedicated cloud database cluster',
          'Assisted historical data migration',
          'On-site staff training sessions',
          'Guaranteed 99.95% uptime SLA',
          'Dedicated 24/7 technical team',
        ],
      },
      moneyBackGuarantee: 'Risk-Free Trial & Free Usage Model — Zero Risk',
      noSurprises: 'Transparent local pricing with no hidden charges or setup fees.',
      vatCompliantNote: 'Prices exclusive of statutory tax where applicable.',
    },
    planMatcher: {
      badge: 'Interactive Plan Advisor',
      title: 'Not Sure Which Plan Fits Your Business?',
      subtitle: 'Answer 3 quick questions about your operation, team, and locations to find the exact plan tailored to your stage.',
      q1Title: '1. What type and scale of business do you operate?',
      q1Options: [
        { label: 'Solo Trader or Micro Retailer', sub: '1 shop, run by myself or with 1 staff member' },
        { label: 'Growing Retail, Pharmacy, or Dining', sub: 'Busy single outlet, 2 to 6 team members' },
        { label: 'Multi-Outlet or Wholesaler', sub: '2+ branch locations, warehouse, multiple cashiers' },
        { label: 'Large Enterprise or FMCG Chain', sub: '5+ branches, distributed depots, custom workflows' },
      ],
      q2Title: '2. What is your primary priority right now?',
      q2Options: [
        { label: 'Organize daily sales & receipts', sub: 'Stop writing paper receipts & track daily cash' },
        { label: 'Prevent stock theft & track P&L', sub: 'Know exact gross profit and eliminate inventory loss' },
        { label: 'Unify multiple shops & depots', sub: 'Centralized stock transfers, multi-branch oversight' },
        { label: 'Automate enterprise operations', sub: 'API connection, custom accounting, dedicated SLA' },
      ],
      q3Title: '3. Do you need offline Point of Sale capability?',
      q3Options: [
        { label: 'Yes, offline POS is critical', sub: 'Internet cuts out frequently in our commercial district' },
        { label: 'Helpful, but we have decent internet', sub: 'Primarily cloud-based with occasional backup' },
        { label: 'Mostly back-office accounting', sub: 'We issue invoices and manage accounts from computers' },
      ],
      recommendationTitle: 'Recommended for Your Business:',
      recommendationSubtitle: 'Based on your operational size, location count, and inventory requirements.',
      whyThisPlan: 'Why this plan matches your needs:',
      keyHighlights: 'Key Included Highlights:',
      ctaButton: 'Start Free Trial with This Plan',
      retakeQuiz: 'Retake Recommendation Quiz',
    },
    comparison: {
      badge: 'Feature Matrix',
      title: 'Compare All Plan Features & Limits',
      subtitle: 'Detailed breakdown of accounting capabilities, POS registers, inventory controls, and security.',
      categories: {
        accounting: { name: 'Core Accounting & Ledgers', desc: 'Double-entry books, charts of accounts, and financial reports' },
        pos: { name: 'Point of Sale (POS)', desc: 'Retail registers, receipts, barcode scanning, and offline sales' },
        inventory: { name: 'Inventory & Warehousing', desc: 'Stock valuation, multi-depot transfers, and reorder warnings' },
        reporting: { name: 'Analytics & Tax Reporting', desc: 'Profitability, sales breakdown, VAT, and WHT filings' },
        users: { name: 'Users, Security & Support', desc: 'Team access, role controls, multi-branch, and onboarding' },
      },
      tableFooterNote: 'All plans include daily cloud backups, 256-bit SSL encryption, and mobile device access.',
    },
    freeTrial: {
      badge: 'Risk-Free Onboarding',
      title: 'Experience MsmeBooks 100% Risk-Free',
      subtitle: 'Join thousands of African entrepreneurs who simplified their sales, inventory, and accounting with our free usage model.',
      perk1Title: 'Zero Payment Details Needed',
      perk1Desc: 'Start testing right now with just your email and phone number.',
      perk2Title: 'Full Enterprise Feature Access',
      perk2Desc: 'Try real offline POS checkouts, inventory audits, and AI business insights.',
      perk3Title: 'Instant Assisted Setup',
      perk3Desc: 'Import your existing products and customer lists in minutes with CSV templates.',
      ctaTrial: 'Start Risk-Free Trial',
      ctaDemo: 'Book a 1-on-1 Consultation',
    },
    valueRoi: {
      badge: 'Return on Investment',
      title: 'Built to Deliver Immediate Value with Zero Risk',
      subtitle: 'How African SMEs stop revenue leakages and reclaim 12+ hours every week with MsmeBooks.',
      stat1Number: '₦340k+',
      stat1Label: 'Monthly Stock Loss Prevented',
      stat1Desc: 'Audit trails and blind register closing eliminate cash drawer discrepancies.',
      stat2Number: '14 hrs',
      stat2Label: 'Weekly Bookkeeping Saved',
      stat2Desc: 'Automated invoices, reconciliations, and tax filings remove manual spreadsheets.',
      stat3Number: '99.9%',
      stat3Label: 'POS Uptime with Offline Mode',
      stat3Desc: 'Keep selling seamlessly when fiber cables are cut or mobile networks go down.',
      stat4Number: '3.8x',
      stat4Label: 'Average First-Year ROI',
      stat4Desc: 'Measurable net return through inventory cost optimization and faster credit collections.',
      calculatorTitle: 'Estimated SME Return Calculator',
      calculatorDesc: 'Calculate your business efficiency gains across time, inventory, and profit recovery.',
      timeSavedHours: 'Hours saved per month:',
      lossPrevented: 'Average shrinkage recovered:',
      annualRoiMultiplier: 'Annual ROI multiple:',
    },
    aiAssistant: {
      badge: 'Built-In AI Business Copilot',
      title: 'Ask Your Business Any Question in Plain English',
      subtitle: 'No complex accounting jargon. Simply ask your actual POS and ledger data for immediate, audited insights.',
      cardTitle: 'MsmeBooks Intelligent Copilot',
      inputPlaceholder: 'Ask anything, e.g., "Which products made highest profit this week?"',
      askButton: 'Query Business AI',
      sampleQueriesBadge: 'Sample Business Prompts:',
      accuracyBadge: 'Grounded in your real verified ledger data',
      prompts: [
        {
          question: 'Which products generated the highest profit this month?',
          answer: 'Your top five products generated 42% of total gross profit this month. Premium Ankara Roll #4 generated the highest margin (58.4%), contributing ₦1,240,000 in net profit. In contrast, Standard Cotton Bale had high revenue but only 14% margin due to supplier cost increases.',
          badge: 'Profitability Analysis',
        },
        {
          question: 'Analyze our operating expenses for the last 30 days',
          answer: 'Operating expenses totaled ₦1,890,000 this month (down 6.2% from last month). Diesel generator fuel was your largest non-payroll expense at ₦410,000 (21.7%), followed by shop rental amortization and packaging materials. Recommended action: Bulk purchasing packaging materials will yield a 12% supplier discount.',
          badge: 'Expense Optimization',
        },
        {
          question: 'Identify products currently low in stock or near reorder point',
          answer: 'Three critical items have fallen below safety stock: 1) Paracetamol 500mg (8 packs left, reorder threshold 25), 2) Vitamin C Effervescent (4 tubes left), 3) Amoxicillin Capsules (12 blister packs left). Estimated stockout risk in 48 hours based on daily sales velocity.',
          badge: 'Inventory Risk Alert',
        },
        {
          question: 'Generate our VAT & Withholding Tax (WHT) preview',
          answer: 'Current month output VAT collected: ₦342,500. Input VAT claimable from verified supplier invoices: ₦118,200. Net VAT liability payable to tax authority: ₦224,300. Withholding tax deducted from corporate clients stands at ₦95,000.',
          badge: 'Statutory Tax Summary',
        },
      ],
    },
    africanFocus: {
      badge: 'Engineered for Africa',
      title: 'Purpose-Built for the Realities of African Commerce',
      subtitle: 'Most Western accounting tools fail when internet drops, power cuts occur, or local tax and payment systems are needed. MsmeBooks is built locally from day one.',
      pillars: {
        offline: {
          title: 'Uncompromised Offline POS',
          desc: 'Keep checking out customers and issuing printed receipts when power or 4G drops. Auto-syncs securely when connectivity returns.',
          tag: 'Zero Downtime',
        },
        multiCurrency: {
          title: 'Pan-African Multi-Currency',
          desc: 'Seamlessly price and reconcile in NGN, GHS, KES, ZAR, XAF, USD, EUR, and 10+ local regional currencies with live conversion rates.',
          tag: '16 Supported Currencies',
        },
        statutoryTax: {
          title: 'Local Tax & Statutory Filing',
          desc: 'Automatic computation for VAT, Withholding Tax (WHT), stamp duties, and statutory audit schedules compliant with regional revenue authorities.',
          tag: 'Audit Ready',
        },
        mobileMoney: {
          title: 'Mobile Money & Payment Gateways',
          desc: 'Direct integration with M-Pesa, MTN MoMo, Airtel Money, Paystack, Flutterwave, and direct bank transfers right at your cashier counter.',
          tag: 'Fast Checkout',
        },
      },
    },
    testimonials: {
      badge: 'Customer Stories',
      title: 'Trusted by Over 12,400+ African Business Owners',
      subtitle: 'See how retailers, pharmacies, wholesalers, and restaurants across Lagos, Nairobi, Accra, and Kigali grow with MsmeBooks.',
      trustScore: '4.9 / 5.0 Average Rating',
      verifiedBusinesses: 'Verified SME Accounts across 18 African Countries',
    },
    faq: {
      badge: 'Got Questions?',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about plans, billing, offline capabilities, and data security.',
      filterAll: 'All Questions',
      filterBilling: 'Billing & Plans',
      filterFeatures: 'POS & Features',
      filterSecurity: 'Security & Multi-Branch',
      filterOnboarding: 'Onboarding & Migration',
    },
    finalCta: {
      title: 'Ready to Transform Your Business Operations?',
      subtitle: 'Join over 12,400+ African entrepreneurs who stopped stock losses, accelerated sales, and automated their accounting.',
      startTrialBtn: 'Start Risk-Free Trial',
      bookDemoBtn: 'Schedule Personalized Demo',
      reassurance1: 'No credit card required',
      reassurance2: '2-minute setup',
      reassurance3: 'Free WhatsApp onboarding',
    },
    footer: {
      brandDesc: 'MsmeBooks is the premier African business management platform engineered for micro, small, and medium-sized enterprises. Seamlessly uniting cloud accounting, offline POS, inventory, and operations.',
      platformTitle: 'Platform',
      smeSolutionsTitle: 'SME Solutions',
      companySupportTitle: 'Company & Support',
      sslBadge: '256-Bit SSL Encrypted',
      gdprBadge: 'NDPR / GDPR Compliant',
      copyright: 'MsmeBooks Inc. (www.msmebooks.org). All rights reserved.',
      panAfricanNote: 'Serving African Commerce across Nigeria, Ghana, Kenya, Rwanda, Côte d’Ivoire, Senegal, Angola, Cameroon & beyond.',
    },
    liveChat: {
      launcherTitle: '24/7 Live Support',
      dialogTitle: 'MsmeBooks Live Assistance',
      agentName: 'Amara & Support Team',
      agentRole: 'SME Specialist (Online)',
      onlineBadge: 'Online Now',
      welcomeMessage: 'Hello! Welcome to MsmeBooks. How can we help your business today? Ask us about our pricing plans, offline POS, or multi-branch management.',
      quickPrompt1: 'Which plan is best for a pharmacy or retail shop?',
      quickPrompt2: 'How does the offline POS work during internet outages?',
      quickPrompt3: 'Can I migrate my existing inventory from Excel or QuickBooks?',
      inputPlaceholder: 'Type your question here...',
      sendButton: 'Send',
      botResponsePrefix: 'MsmeBooks Specialist:',
      phoneContact: 'Call: +234 915 848 2622',
      emailContact: 'support@msmebooks.org',
    },
    trialModal: {
      trialTitle: 'Start Your Risk-Free Trial',
      demoTitle: 'Request an Enterprise Consultation & Demo',
      trialSubtitle: 'Instant access with our free usage model. No debit/credit card required.',
      demoSubtitle: 'Our solutions architect will schedule a 30-minute tailored walkthrough.',
      fullNameLabel: 'Your Full Name',
      emailLabel: 'Work / Business Email',
      phoneLabel: 'Phone Number (with WhatsApp)',
      businessNameLabel: 'Business / Company Name',
      businessTypeLabel: 'Primary Business Industry',
      selectedPlanLabel: 'Selected Plan',
      submitTrialBtn: 'Launch Risk-Free Trial Now',
      submitDemoBtn: 'Schedule Live Walkthrough',
      noCardNotice: '🔒 Zero commitment. Risk-free trial with free usage model, cancel anytime in 1 click.',
      successTitle: 'Trial Activated Successfully!',
      successMessage: 'Welcome to MsmeBooks! We have sent your temporary credentials and onboarding guide to your email and WhatsApp.',
      closeBtn: 'Go to Dashboard',
    },
  },
  fr: {
    common: {
      startFreeTrial: 'Démarrer l’Essai Sans Risque',
      bookDemo: 'Réserver une Démo',
      talkToSales: 'Parler à un Conseiller',
      contactSales: 'Contacter les Ventes',
      learnMore: 'En Savoir Plus',
      viewFeatures: 'Voir Toutes les Fonctionnalités',
      close: 'Fermer',
      cancel: 'Annuler',
      submit: 'Valider',
      save: 'Enregistrer',
      search: 'Rechercher...',
      all: 'Tous',
      loading: 'Chargement...',
      offline: 'Mode Hors-Ligne',
      online: 'En Ligne',
      synced: 'Toutes les données sont synchronisées',
      popular: 'POPULAIRE',
      mostPopular: 'LE PLUS POPULAIRE',
      recommended: 'Formule Recommandée',
      perMonth: '/mois',
      billedAnnually: 'Facturé annuellement',
      billedMonthly: 'Facturé mensuellement',
      billedQuarterly: 'Facturé trimestriellement',
      billedBiYearly: 'Facturé semestriellement',
      customPricing: 'Tarification Entreprise sur Mesure',
      noCardRequired: 'Aucune carte bancaire requise',
      instantSetup: 'Configuration instantanée en 2 minutes',
      cancelAnytime: 'Résiliable à tout moment en 1 clic',
      offlineModeNotice: 'Fonctionnement hors-ligne. Ventes locales sauvegardées en sécurité.',
      offlineBannerTitle: 'Fonctionnement en Mode Hors-Ligne',
      offlineBannerDesc: 'Votre connexion réseau est coupée ou instable. MsmeBooks stocke les ventes et le stock localement et synchronisera dès le retour du réseau.',
      cloudSyncRestored: 'Connexion rétablie — synchronisation cloud terminée',
      connectionActive: 'Synchronisation Cloud Active',
      connectionOffline: 'Mode Hors-Ligne (Stockage Local Actif)',
      simulateToggle: 'Simuler le Mode Hors-Ligne',
      lastSynced: 'Dernière synchro à',
    },
    nav: {
      brandName: 'MsmeBooks',
      pricingPlans: 'Tarifs & Plans',
      planMatcher: 'Conseiller de Plan',
      quizBadge: 'Quiz',
      featureMatrix: 'Matrice de Fonctionnalités',
      aiAssistant: 'Assistant IA',
      newBadge: 'Nouveau',
      africanFocus: 'Spécificités Afrique',
      faqs: 'FAQ',
      talkToSales: 'Contacter l’Équipe',
      startTrial: 'Essai Sans Risque',
      statusDisplay: 'Statut & Affichage',
    },
    hero: {
      badge: 'Tarification Panafricaine Transparente',
      titlePart1: 'Une Tarification Claire et Prévisible pour',
      titleHighlight: 'Chaque Entreprise Africaine',
      titlePart2: '',
      subtitle: 'Des commerces indépendants à Dakar et Douala aux grossistes et chaînes multi-dépôts d’Abidjan ou Kinshasa. Comptabilité cloud, caisse tactile hors-ligne, gestion des stocks et IA sans frais cachés.',
      startTrialCta: 'Démarrer l’Essai Sans Risque',
      talkToSalesCta: 'Planifier une Démo en Direct',
      trustPill: 'Plus de 12 400+ PME africaines se développent avec MsmeBooks chaque jour',
      mockTitle: 'Aperçu Entreprise en Temps Réel',
      livePosBadge: 'Caisse Hors-Ligne Active',
      grossSalesToday: 'Ventes Brutes du Jour',
      activeRegisters: 'Caisses Actives',
      pendingDeliveries: 'Livraisons en Attente',
      netMargin: 'Marge Nette',
      recentTransactions: 'Transactions Récentes',
      cashflowForecast: 'Prévision de Trésorerie',
      forecastNote: 'Règlements clients attendus suffisants pour régler le prochain arrivage fournisseur.',
      quickActionSale: 'Nouvelle Vente',
      quickActionReceipt: 'Ticket Thermique',
      quickActionSync: 'Synchroniser',
      quickActionAudit: 'Audit Fiscal',
      syncedLedger: 'Grand Livre Comptable Chiffré',
    },
    billing: {
      monthly: 'Facturation Mensuelle',
      quarterly: 'Facturation Trimestrielle',
      biYearly: 'Facturation Semestrielle',
      yearly: 'Facturation Annuelle',
      saveDiscountBadge: '-20%',
      quarterlyDiscountBadge: '-5%',
      biYearlyDiscountBadge: '-10%',
      toggleSubtitle: 'Cycles d’abonnement flexibles avec remises automatiques pour les durées prolongées',
      annualNote: 'Facturation annuelle en un versement avec 20% de remise et prix bloqué 24 mois',
      quarterlyNote: 'Abonnement trimestriel facturé tous les 3 mois avec 5% de remise',
      biYearlyNote: 'Abonnement semestriel facturé tous les 6 mois avec 10% de remise',
    },
    pricing: {
      starter: {
        name: 'Starter',
        description: 'Les outils indispensables pour les petites structures débutant leur gestion commerciale digitale.',
        bestFor: 'Entrepreneurs individuels, micro-commerces et boutiques à point de vente unique',
        cta: 'Essai Sans Risque',
        features: [
          'Profil d’entreprise & image de marque',
          'Comptabilité cloud simplifiée',
          'Suivi des recettes et dépenses',
          'Facturation et devis professionnels',
          'Reçus numériques et thermiques',
          'Caisse tactile POS monoposte',
          'Suivi des stocks de base',
          'Fichier clients et historique',
          'Gestion des fournisseurs',
          'Rapports de ventes quotidiens',
          'Accès mobile Android & iOS',
          'Support standard communautaire',
        ],
      },
      professional: {
        name: 'Professionnel',
        badge: 'LE PLUS POPULAIRE',
        description: 'Tout ce dont une entreprise en croissance a besoin pour piloter ventes, stocks, finances et clients.',
        bestFor: 'Magasins de détail, pharmacies, restaurants & cabinets de services professionnels',
        cta: 'Essai Sans Risque',
        features: [
          'Tout ce qui est inclus dans Starter',
          'Comptabilité complète en partie double',
          'Caisse POS multi-modes de paiement',
          'Gestion des stocks multi-unités',
          'Transferts de stocks inter-rayons',
          'Bons de commande & avoirs fournisseurs',
          'Rapprochement bancaire automatisé',
          'Bilan comptable & Compte de résultat (P&L)',
          'Déclarations TVA et retenues à la source',
          'Comptes utilisateurs et rôles multiples',
          'Permissions détaillées et journal d’audit',
          'Assistant commercial alimenté par l’IA',
          'Support prioritaire WhatsApp & téléphone',
        ],
      },
      business: {
        name: 'Business',
        description: 'Pour les entreprises établies gérant plusieurs points de vente, des équipes et des dépôts logistiques.',
        bestFor: 'Supermarchés, chaînes de magasins, grossistes et distributeurs multi-entrepôts',
        cta: 'Essai Sans Risque',
        features: [
          'Tout ce qui est inclus dans Professionnel',
          'Gestion multi-succursales et magasins',
          'Gestion multi-entrepôts et dépôts',
          'Suivi avancé des lots et dates de péremption',
          'Demandes de transfert de stock inter-dépôts',
          'Caisses POS synchronisées multi-sites',
          'Gestion du crédit client et relances',
          'Accords fournisseurs et contrats d’achat',
          'Analyses avancées des marges par produit',
          'Gestion des équipes, shifts et commissions',
          'Boutique e-commerce intégrée',
          'Accès API REST complète',
          'Intégration et formation dédiées',
          'Gestionnaire de compte dédié',
        ],
      },
      enterprise: {
        name: 'Entreprise',
        description: 'Gestion d’entreprise avancée pour les grandes organisations et réseaux de franchise régionaux.',
        bestFor: 'Grandes chaînes de distribution, groupes FMCG multi-pays et franchises industrielles',
        customPricingText: 'Devis adapté à vos besoins',
        cta: 'Contacter l’Équipe',
        secondaryCta: 'Réserver une Démo Dédiée',
        features: [
          'Tout ce qui est inclus dans Business',
          'Succursales et caisses illimitées',
          'Entrepôts régionaux illimités',
          'Circuits d’approbation sur mesure',
          'Matrice de sécurité et permissions entreprise',
          'Intégrations ERP & moyens de paiement sur mesure',
          'Cluster de base de données cloud isolé',
          'Migration assistée de vos données historiques',
          'Sessions de formation sur site pour vos équipes',
          'Contrat de niveau de service SLA 99,95%',
          'Équipe d’ingénieurs dédiée 24/7',
        ],
      },
      moneyBackGuarantee: 'Essai Sans Risque & Modèle d’Usage Gratuit — Zéro Engagement',
      noSurprises: 'Tarification locale transparente sans frais cachés ni coûts d’installation.',
      vatCompliantNote: 'Prix hors taxes réglementaires selon la législation fiscale locale.',
    },
    planMatcher: {
      badge: 'Conseiller Intelligent',
      title: 'Quelle Formule Convient le Mieux à Votre Activité ?',
      subtitle: 'Répondez à 3 questions simples sur vos opérations, votre équipe et vos points de vente pour identifier la formule adaptée.',
      q1Title: '1. Quelle est la taille et l’activité de votre entreprise ?',
      q1Options: [
        { label: 'Entrepreneur solo ou micro-commerce', sub: '1 boutique, gérée par moi-même ou avec 1 employé' },
        { label: 'Commerce en expansion, pharmacie ou restaurant', sub: 'Point de vente dynamique, équipe de 2 à 6 personnes' },
        { label: 'Réseau de magasins ou grossiste', sub: '2+ succursales, entrepôt, caissiers multiples' },
        { label: 'Grande entreprise ou groupe de distribution', sub: '5+ sites, dépôts régionaux, flux personnalisés' },
      ],
      q2Title: '2. Quelle est votre priorité commerciale actuelle ?',
      q2Options: [
        { label: 'Organiser les ventes et tickets quotidiens', sub: 'En finir avec les carnets papier et sécuriser la caisse' },
        { label: 'Stopper les pertes de stock et suivre le bénéfice', sub: 'Connaître la marge nette exacte et éviter le coulage' },
        { label: 'Fédérer plusieurs magasins et dépôts', sub: 'Transferts de stock centralisés et suivi multi-sites' },
        { label: 'Automatiser l’ensemble des opérations', sub: 'Connexion API, comptabilité avancée et SLA garanti' },
      ],
      q3Title: '3. Avez-vous besoin du mode caisse hors-ligne ?',
      q3Options: [
        { label: 'Oui, le mode hors-ligne est indispensable', sub: 'Les coupures d’internet sont fréquentes dans notre zone' },
        { label: 'Utile, mais notre connexion est généralement stable', sub: 'Utilisation cloud avec secours ponctuel' },
        { label: 'Principalement comptabilité et gestion administrative', sub: 'Facturation et gestion depuis des ordinateurs de bureau' },
      ],
      recommendationTitle: 'Formule Recommandée pour Votre Entreprise :',
      recommendationSubtitle: 'Sélectionnée en fonction de votre volume, nombre de sites et besoins de gestion.',
      whyThisPlan: 'Pourquoi ce plan correspond à vos besoins :',
      keyHighlights: 'Avantages clés inclus :',
      ctaButton: 'Démarrer l’Essai Sans Risque avec ce Plan',
      retakeQuiz: 'Recommencer le Questionnaire',
    },
    comparison: {
      badge: 'Matrice Complète',
      title: 'Comparez Toutes les Fonctionnalités et Limites',
      subtitle: 'Détail exhaustif des modules comptables, des caisses POS, de la gestion des stocks et de la sécurité.',
      categories: {
        accounting: { name: 'Comptabilité Fondamentale & Grand Livre', desc: 'Partie double, plan comptable conforme OHADA/national et états financiers' },
        pos: { name: 'Point de Vente & Caisse (POS)', desc: 'Caisses tactiles, reçus, lecture code-barres et ventes hors-ligne' },
        inventory: { name: 'Stocks & Logistique Entrepôts', desc: 'Valorisation, transferts inter-dépôts et alertes de réapprovisionnement' },
        reporting: { name: 'Analyses & Déclarations Fiscales', desc: 'Rentabilité, marge par article, états TVA et retenues' },
        users: { name: 'Utilisateurs, Sécurité & Assistance', desc: 'Accès d’équipe, contrôle des permissions et accompagnement' },
      },
      tableFooterNote: 'Toutes les formules incluent des sauvegardes quotidiennes chiffrées, le protocole SSL 256 bits et l’accès mobile.',
    },
    freeTrial: {
      badge: 'Essai Sans Risque',
      title: 'Testez MsmeBooks 100% Sans Risque',
      subtitle: 'Rejoignez des milliers de commerçants et dirigeants africains qui ont simplifié leur gestion commerciale avec notre modèle d’usage gratuit.',
      perk1Title: 'Aucune Carte Bancaire Requise',
      perk1Desc: 'Commencez vos tests immédiatement avec votre simple email et numéro de téléphone.',
      perk2Title: 'Accès Intégral aux Fonctionnalités Pro',
      perk2Desc: 'Testez les vraies ventes en caisse hors-ligne, les audits de stocks et l’assistant IA.',
      perk3Title: 'Mise en Route Rapide et Guidée',
      perk3Desc: 'Importez vos articles et contacts en quelques minutes grâce aux modèles Excel/CSV fournis.',
      ctaTrial: 'Démarrer l’Essai Sans Risque',
      ctaDemo: 'Prendre Rendez-vous avec un Expert',
    },
    valueRoi: {
      badge: 'Retour sur Investissement',
      title: 'Conçu pour Générer de la Valeur Immédiate Sans Risque',
      subtitle: 'Comment les PME africaines éliminent les pertes de stock et économisent 12+ heures par semaine avec MsmeBooks.',
      stat1Number: '250k+ FCFA',
      stat1Label: 'Pertes de Stock Évitées par Mois',
      stat1Desc: 'La clôture de caisse à l’aveugle et l’historique des mouvements éliminent les écarts d’inventaire.',
      stat2Number: '14 h',
      stat2Label: 'Économisées Chaque Semaine',
      stat2Desc: 'Factures automatisées, réconciliation bancaire et calcul de TVA sans tableur manuel.',
      stat3Number: '99,9%',
      stat3Label: 'Disponibilité POS avec le Hors-Ligne',
      stat3Desc: 'Continuez à encaisser vos clients même en cas de coupure de fibre ou de panne 4G.',
      stat4Number: '3,8x',
      stat4Label: 'Multiplicateur de ROI Annuel',
      stat4Desc: 'Gain financier net mesurable grâce à la réduction des invendus et au recouvrement plus rapide des créances.',
      calculatorTitle: 'Simulateur d’Économies pour PME',
      calculatorDesc: 'Évaluez vos gains de productivité, la réduction des pertes et l’amélioration de vos marges.',
      timeSavedHours: 'Heures économisées par mois :',
      lossPrevented: 'Pertes de stock récupérées :',
      annualRoiMultiplier: 'Multiplicateur de retour annuel :',
    },
    aiAssistant: {
      badge: 'Copilote Commercial IA Intégré',
      title: 'Interrogez Vos Données en Français Naturel',
      subtitle: 'Pas besoin d’être expert-comptable. Posez des questions simples et obtenez des réponses certifiées basées sur vos vraies ventes.',
      cardTitle: 'Copilote Intelligent MsmeBooks',
      inputPlaceholder: 'Ex: "Quels sont les articles les plus rentables cette semaine ?"',
      askButton: 'Interroger l’IA',
      sampleQueriesBadge: 'Exemples de requêtes :',
      accuracyBadge: 'Calculé à partir de vos écritures comptables vérifiées',
      prompts: [
        {
          question: 'Quels produits ont généré la plus forte marge ce mois-ci ?',
          answer: 'Vos 5 meilleurs articles représentent 42% du bénéfice brut total ce mois-ci. Le Rouleau Ankara Premium #4 affiche la plus forte marge (58,4%), apportant 1 240 000 net. À l’inverse, le Coton Standard génère du volume mais seulement 14% de marge suite aux hausses fournisseurs.',
          badge: 'Analyse de Rentabilité',
        },
        {
          question: 'Analyse nos charges d’exploitation sur les 30 derniers jours',
          answer: 'Les charges opérationnelles s’élèvent à 1 890 000 ce mois-ci (-6,2% par rapport au mois précédent). Le carburant du groupe électrogène représente votre premier poste hors salaires à 410 000 (21,7%), suivi des loyers et emballages. Recommandation : l’achat groupé d’emballages offre 12% de remise.',
          badge: 'Optimisation des Dépenses',
        },
        {
          question: 'Identifie les articles proches de la rupture de stock',
          answer: 'Trois articles critiques sont passés sous le seuil d’alerte : 1) Paracétamol 500mg (reste 8 boîtes, seuil 25), 2) Vitamine C effervescente (reste 4 tubes), 3) Amoxicilline gélules (reste 12 plaquettes). Risque d’épuisement estimé sous 48 heures au rythme des ventes actuelles.',
          badge: 'Alerte Rupture de Stock',
        },
        {
          question: 'Génère un aperçu de notre TVA et des retenues fiscales',
          answer: 'TVA collectée sur les ventes du mois : 342 500. TVA déductible sur factures fournisseurs vérifiées : 118 200. Solde net de TVA à reverser à l’administration fiscale : 224 300. Retenues à la source prélevées sur clients entreprises : 95 000.',
          badge: 'Synthèse Fiscale',
        },
      ],
    },
    africanFocus: {
      badge: 'Conçu pour l’Afrique',
      title: 'Spécialement Élaboré pour les Réalités du Commerce Africain',
      subtitle: 'Les logiciels occidentaux s’arrêtent dès que la connexion lâche ou que l’électricité coupe. MsmeBooks est taillé pour nos réalités quotidiennes.',
      pillars: {
        offline: {
          title: 'Caisse POS 100% Hors-Ligne',
          desc: 'Encaissez les clients et imprimez les tickets même sans réseau ou lors de coupures de courant. Synchronisation automatique dès le rétablissement.',
          tag: 'Zéro Interruption',
        },
        multiCurrency: {
          title: 'Gestion Multi-Devises Panafricaine',
          desc: 'Facturez et tenez vos comptes en FCFA (XAF/XOF), NGN, GHS, KES, MAD, USD, EUR et plus de 10 devises régionales avec conversion dynamique.',
          tag: '16 Devises Supportées',
        },
        statutoryTax: {
          title: 'Fiscalité et Normes OHADA',
          desc: 'Calcul automatisé de la TVA, des retenues à la source (AIB/BNC), droits de timbre et états financiers conformes aux administrations fiscales.',
          tag: 'Prêt pour l’Audit',
        },
        mobileMoney: {
          title: 'Mobile Money & Paiements Locaux',
          desc: 'Intégration directe avec Orange Money, MTN MoMo, Wave, Moov Money, Airtel, Paystack et virements bancaires instantanés au comptoir.',
          tag: 'Encaissement Rapide',
        },
      },
    },
    testimonials: {
      badge: 'Témoignages Clients',
      title: 'Adopté par Plus de 12 400+ Dirigeants et Commerçants Africains',
      subtitle: 'Découvrez comment des détaillants, pharmacies, grossistes et restaurateurs à Dakar, Abidjan, Douala et Yaoundé prospèrent avec MsmeBooks.',
      trustScore: '4,9 / 5,0 Note Moyenne',
      verifiedBusinesses: 'PME Vérifiées à Travers 18 Pays Africains',
    },
    faq: {
      badge: 'Des Questions ?',
      title: 'Foire Aux Questions',
      subtitle: 'Tout ce que vous devez savoir sur nos formules, la facturation, le mode hors-ligne et la sécurité des données.',
      filterAll: 'Toutes les Questions',
      filterBilling: 'Facturation & Formules',
      filterFeatures: 'Caisse & Fonctionnalités',
      filterSecurity: 'Sécurité & Multi-Sites',
      filterOnboarding: 'Accompagnement & Migration',
    },
    finalCta: {
      title: 'Prêt à Transformer la Gestion de Votre Entreprise ?',
      subtitle: 'Rejoignez plus de 12 400+ entrepreneurs africains qui ont éliminé les pertes de stock, accéléré leurs encaissements et automatisé leurs comptes.',
      startTrialBtn: 'Démarrer l’Essai Sans Risque',
      bookDemoBtn: 'Planifier une Démo Personnalisée',
      reassurance1: 'Aucune carte bancaire requise',
      reassurance2: 'Configuration en 2 minutes',
      reassurance3: 'Support WhatsApp inclus',
    },
    footer: {
      brandDesc: 'MsmeBooks est la plateforme panafricaine de référence pour la gestion des micro, petites et moyennes entreprises. Comptabilité cloud, caisse hors-ligne, stocks et logistique réunis.',
      platformTitle: 'Plateforme',
      smeSolutionsTitle: 'Solutions PME',
      companySupportTitle: 'Entreprise & Support',
      sslBadge: 'Chiffrement SSL 256 Bits',
      gdprBadge: 'Conforme RGPD & Lois Données',
      copyright: 'MsmeBooks Inc. (www.msmebooks.org). Tous droits réservés.',
      panAfricanNote: 'Au service du commerce en Côte d’Ivoire, Sénégal, Cameroun, RDC, Gabon, Bénin, Togo, Guinée, Rwanda et au-delà.',
    },
    liveChat: {
      launcherTitle: 'Support en Direct 24/7',
      dialogTitle: 'Assistance en Direct MsmeBooks',
      agentName: 'Amara & Équipe Support',
      agentRole: 'Spécialiste PME (En Ligne)',
      onlineBadge: 'En Ligne Maintenant',
      welcomeMessage: 'Bonjour ! Bienvenue sur MsmeBooks. Comment pouvons-nous vous aider aujourd’hui ? Posez-nous vos questions sur nos formules, le mode hors-ligne ou la gestion multi-dépôts.',
      quickPrompt1: 'Quelle formule est idéale pour une pharmacie ou boutique ?',
      quickPrompt2: 'Comment fonctionne la caisse en cas de coupure internet ?',
      quickPrompt3: 'Puis-je importer mon stock existant depuis Excel ?',
      inputPlaceholder: 'Posez votre question ici...',
      sendButton: 'Envoyer',
      botResponsePrefix: 'Conseiller MsmeBooks :',
      phoneContact: 'Tél : +234 915 848 2622',
      emailContact: 'support@msmebooks.org',
    },
    trialModal: {
      trialTitle: 'Activez Votre Essai Sans Risque',
      demoTitle: 'Demander une Consultation & Démo Entreprise',
      trialSubtitle: 'Accès immédiat avec notre modèle d’usage gratuit. Aucune carte bancaire demandée.',
      demoSubtitle: 'Notre architecte solutions organisera une démonstration personnalisée de 30 minutes.',
      fullNameLabel: 'Nom et Prénom',
      emailLabel: 'Adresse Email Professionnelle',
      phoneLabel: 'Numéro de Téléphone (avec WhatsApp)',
      businessNameLabel: 'Nom de Votre Entreprise / Commerce',
      businessTypeLabel: 'Secteur d’Activité Principal',
      selectedPlanLabel: 'Formule Sélectionnée',
      submitTrialBtn: 'Lancer Mon Essai Sans Risque Immédiatement',
      submitDemoBtn: 'Confirmer Mon Rendez-Vous Démo',
      noCardNotice: '🔒 Sans engagement. Essai sans risque avec modèle d’usage gratuit, résiliable en 1 clic.',
      successTitle: 'Essai Activé avec Succès !',
      successMessage: 'Bienvenue sur MsmeBooks ! Vos identifiants provisoires et votre guide de bienvenue ont été envoyés par email et WhatsApp.',
      closeBtn: 'Accéder à Mon Espace',
    },
  },
  pt: {
    common: {
      startFreeTrial: 'Iniciar Teste Sem Risco',
      bookDemo: 'Agendar Demonstração',
      talkToSales: 'Falar com Consultor',
      contactSales: 'Contatar Vendas',
      learnMore: 'Saber Mais',
      viewFeatures: 'Ver Todos os Recursos',
      close: 'Fechar',
      cancel: 'Cancelar',
      submit: 'Confirmar',
      save: 'Guardar',
      search: 'Pesquisar...',
      all: 'Todos',
      loading: 'Carregando...',
      offline: 'Modo Offline',
      online: 'Online',
      synced: 'Todas as alterações sincronizadas',
      popular: 'POPULAR',
      mostPopular: 'MAIS POPULAR',
      recommended: 'Plano Recomendado',
      perMonth: '/mês',
      billedAnnually: 'Faturado anualmente',
      billedMonthly: 'Faturado mensalmente',
      billedQuarterly: 'Faturado trimestralmente',
      billedBiYearly: 'Faturado semestralmente',
      customPricing: 'Preços Empresariais Sob Medida',
      noCardRequired: 'Nenhum cartão de crédito necessário',
      instantSetup: 'Configuração rápida em 2 minutos',
      cancelAnytime: 'Cancele a qualquer momento com 1 clique',
      offlineModeNotice: 'A operar em modo offline. Vendas locais salvas em segurança no dispositivo.',
      offlineBannerTitle: 'A Operar em Modo Offline',
      offlineBannerDesc: 'A sua ligação à internet caiu ou está instável. O MsmeBooks grava as vendas e o inventário localmente e sincroniza quando a rede voltar.',
      cloudSyncRestored: 'Ligação restaurada — sincronização em nuvem concluída',
      connectionActive: 'Sincronização em Nuvem Ativa',
      connectionOffline: 'Modo Offline (Armazenamento Local Activo)',
      simulateToggle: 'Simular Modo Offline',
      lastSynced: 'Última sincronização às',
    },
    nav: {
      brandName: 'MsmeBooks',
      pricingPlans: 'Planos e Preços',
      planMatcher: 'Localizador de Planos',
      quizBadge: 'Questionário',
      featureMatrix: 'Matriz de Recursos',
      aiAssistant: 'Assistente IA',
      newBadge: 'Novo',
      africanFocus: 'Foco Africano',
      faqs: 'Perguntas Frequentes',
      talkToSales: 'Falar com Vendas',
      startTrial: 'Teste Sem Risco',
      statusDisplay: 'Estado e Visualização',
    },
    hero: {
      badge: 'Preços Pan-Africanos Transparentes',
      titlePart1: 'Preços Claros e Previsíveis para',
      titleHighlight: 'Todas as Empresas Africanas',
      titlePart2: '',
      subtitle: 'De lojas em Luanda e Maputo a distribuidoras com armazéns múltiplos em Cabo Verde e Moçambique. Contabilidade em nuvem, POS offline, gestão de estoque e inteligência artificial sem custos ocultos.',
      startTrialCta: 'Iniciar Teste Sem Risco',
      talkToSalesCta: 'Agendar Demonstração ao Vivo',
      trustPill: 'Mais de 12.400+ PMEs africanas crescem diariamente com o MsmeBooks',
      mockTitle: 'Painel Empresarial em Tempo Real',
      livePosBadge: 'POS Offline em Execução',
      grossSalesToday: 'Vendas Brutas de Hoje',
      activeRegisters: 'Caixas Ativos',
      pendingDeliveries: 'Entregas Pendentes',
      netMargin: 'Margem Líquida',
      recentTransactions: 'Transações Recentes',
      cashflowForecast: 'Previsão de Fluxo de Caixa',
      forecastNote: 'Recebimentos de faturas previstos para cobrir o próximo lote do fornecedor.',
      quickActionSale: 'Registar Venda',
      quickActionReceipt: 'Recibo Térmico',
      quickActionSync: 'Sincronizar Caixa',
      quickActionAudit: 'Auditoria Fiscal',
      syncedLedger: 'Razão Contabilístico Encriptado',
    },
    billing: {
      monthly: 'Faturação Mensal',
      quarterly: 'Faturação Trimestral',
      biYearly: 'Faturação Semestral',
      yearly: 'Faturação Anual',
      saveDiscountBadge: '-20%',
      quarterlyDiscountBadge: '-5%',
      biYearlyDiscountBadge: '-10%',
      toggleSubtitle: 'Ciclos de assinatura flexíveis com descontos automáticos em prazos mais longos',
      annualNote: 'Assinatura anual cobrada em parcela única com 20% de desconto e preço congelado por 24 meses',
      quarterlyNote: 'Assinatura trimestral faturada a cada 3 meses com 5% de desconto',
      biYearlyNote: 'Assinatura semestral faturada a cada 6 meses com 10% de desconto',
    },
    pricing: {
      starter: {
        name: 'Starter',
        description: 'Ferramentas essenciais para pequenas empresas que estão a iniciar a gestão digital.',
        bestFor: 'Empreendedores individuais, micro-comerciantes e lojas com um único ponto de venda',
        cta: 'Iniciar Teste Sem Risco',
        features: [
          'Perfil e identidade visual da empresa',
          'Contabilidade básica em nuvem',
          'Controlo de receitas e despesas',
          'Emissão de faturas e orçamentos',
          'Recibos digitais e térmicos',
          'Ponto de Venda (POS) monoposto',
          'Controlo básico de estoque',
          'Registo e histórico de clientes',
          'Gestão de fornecedores',
          'Relatórios de vendas diários',
          'Acesso móvel Android e iOS',
          'Suporte padrão da comunidade',
        ],
      },
      professional: {
        name: 'Profissional',
        badge: 'MAIS POPULAR',
        description: 'Tudo o que as empresas em crescimento precisam para gerir vendas, estoque, contabilidade e clientes.',
        bestFor: 'Lojas a retalho, farmácias, restaurantes e empresas de serviços profissionais',
        cta: 'Iniciar Teste Sem Risco',
        features: [
          'Tudo incluído no Starter',
          'Contabilidade completa por partidas dobradas',
          'POS avançado multi-pagamento',
          'Gestão de estoque multi-unidade',
          'Transferências de produtos entre prateleiras',
          'Ordens de compra e notas de crédito',
          'Reconciliação bancária automática',
          'Demonstração de Resultados (DRE) e Balanço',
          'Relatórios fiscais de IVA e retenções na fonte',
          'Contas de múltiplos utilizadores e perfis',
          'Permissões granulares e registo de auditoria',
          'Assistente empresarial com Inteligência Artificial',
          'Suporte prioritário via WhatsApp e telefone',
        ],
      },
      business: {
        name: 'Business',
        description: 'Para empresas consolidadas com múltiplos locais, equipas alargadas e grandes operações.',
        bestFor: 'Supermercados, redes de retalho, grossistas e distribuidores multi-armazém',
        cta: 'Iniciar Teste Sem Risco',
        features: [
          'Tudo incluído no Profissional',
          'Gestão de múltiplas filiais e lojas',
          'Múltiplos armazéns e entrepostos',
          'Rastreio avançado de lotes e validades',
          'Requisições e transferências entre armazéns',
          'Caixas POS multi-loja sincronizados',
          'Gestão de crédito a clientes e prazos',
          'Contratos de compra com fornecedores',
          'Análise detalhada de rentabilidade e margens',
          'Gestão de turnos e comissões de funcionários',
          'Loja virtual de comércio eletrónico integrada',
          'Integrações via API REST completa',
          'Formação e integração personalizada',
          'Gestor de conta dedicado',
        ],
      },
      enterprise: {
        name: 'Enterprise',
        description: 'Gestão corporativa robusta para grandes organizações e redes de franquias em expansão.',
        bestFor: 'Grandes cadeias de distribuição, distribuidores de bens de consumo e franquias',
        customPricingText: 'Sob medida para o seu negócio',
        cta: 'Contatar Vendas',
        secondaryCta: 'Agendar Demonstração',
        features: [
          'Tudo incluído no Business',
          'Filiais e caixas ilimitados',
          'Armazéns regionais ilimitados',
          'Fluxos de aprovação personalizados',
          'Matriz corporativa de segurança e acessos',
          'Integrações personalizadas com ERP e bancos',
          'Cluster isolado de base de dados em nuvem',
          'Migração assistida de dados históricos',
          'Sessões presenciais de capacitação da equipa',
          'Contrato de nível de serviço (SLA) de 99,95%',
          'Equipa técnica dedicada disponível 24/7',
        ],
      },
      moneyBackGuarantee: 'Teste Sem Risco e Modelo de Uso Gratuito — Risco Zero',
      noSurprises: 'Preços locais transparentes sem cobranças ocultas ou taxas de ativação.',
      vatCompliantNote: 'Preços sem impostos obrigatórios, aplicáveis conforme a jurisdição fiscal.',
    },
    planMatcher: {
      badge: 'Recomendador Inteligente',
      title: 'Não Tem Certeza de Qual Plano Escolher?',
      subtitle: 'Responda a 3 perguntas simples sobre a sua operação, equipa e locais para encontrar a opção ideal.',
      q1Title: '1. Qual é a dimensão e atividade do seu negócio?',
      q1Options: [
        { label: 'Empreendedor individual ou micro-retalhista', sub: '1 loja, gerida por mim ou com 1 colaborador' },
        { label: 'Retalho em expansão, farmácia ou restauração', sub: 'Ponto de venda movimentado, equipa de 2 a 6 pessoas' },
        { label: 'Rede de lojas ou grossista', sub: '2+ filiais, armazém de estoque, caixas múltiplos' },
        { label: 'Grande empresa ou cadeia de distribuição', sub: '5+ filiais, entrepostos regionais, fluxos corporativos' },
      ],
      q2Title: '2. Qual é a sua maior prioridade no momento?',
      q2Options: [
        { label: 'Organizar vendas e recibos do dia a dia', sub: 'Acabar com o papel e ter controlo do caixa' },
        { label: 'Eliminar quebras de estoque e ver o lucro real', sub: 'Saber a margem líquida e prevenir desvios' },
        { label: 'Unificar múltiplas lojas e armazéns', sub: 'Transferências controladas e supervisão central' },
        { label: 'Automatizar todas as operações empresariais', sub: 'Ligação via API, contabilidade avançada e SLA' },
      ],
      q3Title: '3. Precisa de funcionamento de caixa offline?',
      q3Options: [
        { label: 'Sim, o modo offline é fundamental', sub: 'A internet cai com frequência na nossa zona' },
        { label: 'Útil, mas temos ligação relativamente estável', sub: 'Uso principalmente em nuvem com salvaguarda' },
        { label: 'Foco em contabilidade e escritório', sub: 'Emissão de faturas e gestão em computadores' },
      ],
      recommendationTitle: 'Plano Recomendado para o Seu Negócio:',
      recommendationSubtitle: 'Selecionado com base no seu volume de vendas, número de locais e controlo de estoque.',
      whyThisPlan: 'Por que este plano é ideal para si:',
      keyHighlights: 'Destaques incluídos no plano:',
      ctaButton: 'Iniciar Teste Sem Risco com Este Plano',
      retakeQuiz: 'Refazer o Questionário',
    },
    comparison: {
      badge: 'Matriz Comparativa',
      title: 'Compare Todos os Recursos e Limites',
      subtitle: 'Análise detalhada dos módulos contabilísticos, caixas POS, controlo de armazéns e segurança.',
      categories: {
        accounting: { name: 'Contabilidade e Razão Geral', desc: 'Partidas dobradas, plano de contas e relatórios financeiros' },
        pos: { name: 'Ponto de Venda e Caixas (POS)', desc: 'Caixas de atendimento, recibos, leitores e vendas sem internet' },
        inventory: { name: 'Estoque e Logística de Armazéns', desc: 'Valorização, transferências entre filiais e avisos de reposição' },
        reporting: { name: 'Análise e Declarações Fiscais', desc: 'Lucratividade, margens de lucro, apuramento de IVA e retenções' },
        users: { name: 'Utilizadores, Segurança e Apoio', desc: 'Acessos de equipa, perfis de permissão e acompanhamento' },
      },
      tableFooterNote: 'Todos os planos incluem cópias de segurança diárias encriptadas, SSL de 256 bits e acesso via smartphone.',
    },
    freeTrial: {
      badge: 'Teste Sem Risco',
      title: 'Experimente o MsmeBooks 100% Sem Risco',
      subtitle: 'Junte-se a milhares de empresários africanos que simplificaram as suas vendas, estoque e contabilidade com o nosso modelo de uso gratuito.',
      perk1Title: 'Sem Dados de Cartão de Crédito',
      perk1Desc: 'Comece já a testar apenas com o seu email e número de telefone.',
      perk2Title: 'Acesso Completo a Todos os Recursos',
      perk2Desc: 'Teste vendas reais no POS offline, auditorias de estoque e insights com IA.',
      perk3Title: 'Configuração Rápida em Minutos',
      perk3Desc: 'Importe os seus produtos e clientes existentes rapidamente através de modelos Excel/CSV.',
      ctaTrial: 'Iniciar Teste Sem Risco',
      ctaDemo: 'Agendar Consulta com Especialista',
    },
    valueRoi: {
      badge: 'Retorno do Investimento',
      title: 'Concebido para Gerar Valor Imediato Sem Risco',
      subtitle: 'Como as PMEs africanas eliminam o extravio de mercadorias e poupam mais de 12 horas semanais.',
      stat1Number: '350.000 Kz+',
      stat1Label: 'Perdas Evitadas por Mês',
      stat1Desc: 'Fecho cego de caixa e registo auditável eliminam diferenças no dinheiro e mercadoria.',
      stat2Number: '14 h',
      stat2Label: 'Poupadas Semanalmente',
      stat2Desc: 'Faturas automáticas, reconciliação bancária e impostos sem folhas de cálculo manuais.',
      stat3Number: '99,9%',
      stat3Label: 'Disponibilidade com o POS Offline',
      stat3Desc: 'Continue a faturar clientes mesmo durante falhas na fibra ótica ou redes móveis.',
      stat4Number: '3,8x',
      stat4Label: 'Multiplicador Médio de ROI Anual',
      stat4Desc: 'Ganho líquido comprovado através da redução do desperdício e cobrança ágil de créditos.',
      calculatorTitle: 'Calculadora de Eficiência para PMEs',
      calculatorDesc: 'Calcule a melhoria na produtividade, recuperação de estoque e aumento das margens.',
      timeSavedHours: 'Horas poupadas por mês:',
      lossPrevented: 'Extravios de estoque prevenidos:',
      annualRoiMultiplier: 'Multiplicador de retorno anual:',
    },
    aiAssistant: {
      badge: 'Copiloto de Negócios com IA',
      title: 'Pergunte Qualquer Coisa ao Seu Negócio em Português',
      subtitle: 'Sem termos contabilísticos complicados. Consulte as suas vendas e finanças reais para obter respostas auditadas.',
      cardTitle: 'Copiloto Inteligente MsmeBooks',
      inputPlaceholder: 'Ex: "Quais produtos deram maior lucro esta semana?"',
      askButton: 'Consultar IA',
      sampleQueriesBadge: 'Perguntas sugeridas:',
      accuracyBadge: 'Calculado com base nas suas operações reais verificadas',
      prompts: [
        {
          question: 'Quais produtos geraram o maior lucro este mês?',
          answer: 'Os seus cinco principais artigos geraram 42% do lucro bruto total este mês. O Rolo de Tecido Premium #4 registou a maior margem (58,4%), gerando 1.240.000 em lucro líquido. Por outro lado, o Fardo de Algodão teve bom volume, mas apenas 14% de margem devido ao aumento de custos do fornecedor.',
          badge: 'Análise de Rentabilidade',
        },
        {
          question: 'Analise as nossas despesas operacionais dos últimos 30 dias',
          answer: 'As despesas operacionais totalizaram 1.890.000 este mês (redução de 6,2%). O combustível do gerador foi a maior despesa não-salarial com 410.000 (21,7%), seguido do aluguer do espaço e embalagens. Sugestão: compras em grande escala de embalagens garantem 12% de desconto.',
          badge: 'Otimização de Custos',
        },
        {
          question: 'Identifique os produtos que estão com estoque baixo',
          answer: 'Três artigos críticos estão abaixo da margem de segurança: 1) Paracetamol 500mg (restam 8 caixas, mínimo 25), 2) Vitamina C Efervescente (restam 4 tubos), 3) Amoxicilina Cápsulas (restam 12 cartelas). Risco de rutura de estoque estimado em 48 horas conforme o ritmo de vendas.',
          badge: 'Alerta de Ruptura de Estoque',
        },
        {
          question: 'Gere um resumo do nosso IVA e das retenções na fonte',
          answer: 'IVA liquidado sobre as vendas do mês corrente: 342.500. IVA dedutível de faturas de fornecedores verificadas: 118.200. Valor líquido de IVA a entregar ao fisco: 224.300. Retenções na fonte efetuadas por clientes empresariais somam 95.000.',
          badge: 'Resumo Fiscal',
        },
      ],
    },
    africanFocus: {
      badge: 'Criado para África',
      title: 'Desenvolvido Sob Medida para as Realidades do Mercado Africano',
      subtitle: 'Softwares estrangeiros param de funcionar quando a ligação falha ou há cortes de energia. O MsmeBooks foi concebido para o dia a dia africano.',
      pillars: {
        offline: {
          title: 'POS Totalmente Offline',
          desc: 'Continue a atender clientes e a imprimir recibos mesmo sem sinal ou durante falhas de luz. Sincronização automática quando a rede regressar.',
          tag: 'Zero Interrupções',
        },
        multiCurrency: {
          title: 'Multi-Moeda Pan-Africano',
          desc: 'Fature e reconcilie em Kz (AOA), Meticais (MZN), NGN, KES, USD, EUR e mais de 10 moedas regionais com taxas de câmbio dinâmicas.',
          tag: '16 Moedas Suportadas',
        },
        statutoryTax: {
          title: 'Conformidade Fiscal e IVA',
          desc: 'Cálculo automatizado de IVA, retenções na fonte, impostos de selo e mapas oficiais para envio aos organismos tributários locais.',
          tag: 'Pronto para Auditoria',
        },
        mobileMoney: {
          title: 'Mobile Money e Pagamentos Locais',
          desc: 'Integração direta com Multicaixa Express, M-Pesa, E-Mola, Unitel Money, Paystack e transferências bancárias instantâneas no balcão.',
          tag: 'Atendimento Rápido',
        },
      },
    },
    testimonials: {
      badge: 'Casos de Sucesso',
      title: 'Mais de 12.400+ Empresários Confiam no MsmeBooks',
      subtitle: 'Veja como retalhistas, farmácias, grossistas e restaurantes em Luanda, Maputo, Benguela e Nampula aceleram as suas operações.',
      trustScore: '4,9 / 5,0 Classificação Média',
      verifiedBusinesses: 'PMEs Verificadas em 18 Países Africanos',
    },
    faq: {
      badge: 'Dúvidas Frequentes',
      title: 'Perguntas Frequentes',
      subtitle: 'Tudo o que precisa de saber sobre planos, pagamentos, modo sem internet e segurança dos dados.',
      filterAll: 'Todas as Perguntas',
      filterBilling: 'Faturação e Planos',
      filterFeatures: 'POS e Recursos',
      filterSecurity: 'Segurança e Multi-Filiais',
      filterOnboarding: 'Integração e Migração',
    },
    finalCta: {
      title: 'Pronto para Transformar a Gestão do Seu Negócio?',
      subtitle: 'Junte-se a mais de 12.400+ empresários africanos que eliminaram quebras de estoque, agilizaram vendas e automatizaram a contabilidade.',
      startTrialBtn: 'Iniciar Teste Sem Risco',
      bookDemoBtn: 'Agendar Demonstração Dedicada',
      reassurance1: 'Sem cartão de crédito',
      reassurance2: 'Configuração em 2 minutos',
      reassurance3: 'Suporte por WhatsApp incluído',
    },
    footer: {
      brandDesc: 'O MsmeBooks é a principal plataforma pan-africana de gestão empresarial desenhada para micro, pequenas e médias empresas. Unindo contabilidade em nuvem, POS offline e estoques.',
      platformTitle: 'Plataforma',
      smeSolutionsTitle: 'Soluções para PMEs',
      companySupportTitle: 'Empresa e Suporte',
      sslBadge: 'Encriptação SSL de 256 Bits',
      gdprBadge: 'Conformidade com Proteção de Dados',
      copyright: 'MsmeBooks Inc. (www.msmebooks.org). Todos os direitos reservados.',
      panAfricanNote: 'Apoio ao comércio em Angola, Moçambique, Cabo Verde, São Tomé e Príncipe, Guiné-Bissau e toda a África.',
    },
    liveChat: {
      launcherTitle: 'Apoio ao Vivo 24/7',
      dialogTitle: 'Atendimento ao Vivo MsmeBooks',
      agentName: 'Amara e Equipa de Apoio',
      agentRole: 'Especialista em PMEs (Online)',
      onlineBadge: 'Disponível Agora',
      welcomeMessage: 'Olá! Bem-vindo ao MsmeBooks. Como podemos ajudar a sua empresa hoje? Tire dúvidas sobre planos, POS offline ou gestão de múltiplos armazéns.',
      quickPrompt1: 'Qual é o melhor plano para uma farmácia ou loja a retalho?',
      quickPrompt2: 'Como funciona o POS offline durante falhas de internet?',
      quickPrompt3: 'Posso importar o meu estoque existente a partir do Excel?',
      inputPlaceholder: 'Escreva a sua mensagem aqui...',
      sendButton: 'Enviar',
      botResponsePrefix: 'Consultor MsmeBooks:',
      phoneContact: 'Tel: +234 915 848 2622',
      emailContact: 'support@msmebooks.org',
    },
    trialModal: {
      trialTitle: 'Inicie o Seu Teste Sem Risco',
      demoTitle: 'Solicitar Demonstração e Consulta Corporativa',
      trialSubtitle: 'Acesso total imediato com o nosso modelo de uso gratuito. Sem pedido de cartão bancário.',
      demoSubtitle: 'O nosso consultor irá agendar uma apresentação personalizada de 30 minutos.',
      fullNameLabel: 'Nome Completo',
      emailLabel: 'Email Profissional / da Empresa',
      phoneLabel: 'Número de Telefone (com WhatsApp)',
      businessNameLabel: 'Nome da Empresa / Estabelecimento',
      businessTypeLabel: 'Setor de Atividade Principal',
      selectedPlanLabel: 'Plano Selecionado',
      submitTrialBtn: 'Começar Teste Sem Risco Imediatamente',
      submitDemoBtn: 'Confirmar Agendamento da Demonstração',
      noCardNotice: '🔒 Sem compromisso. Teste sem risco com modelo de uso gratuito, cancele com 1 clique.',
      successTitle: 'Teste Ativado com Sucesso!',
      successMessage: 'Bem-vindo ao MsmeBooks! Enviámos os seus dados de acesso provisórios e guia inicial para o seu email e WhatsApp.',
      closeBtn: 'Entrar no Painel',
    },
  },
  es: {
    common: {
      startFreeTrial: 'Comenzar Prueba Sin Riesgo',
      bookDemo: 'Solicitar Demostración',
      talkToSales: 'Hablar con Asesor',
      contactSales: 'Contactar a Ventas',
      learnMore: 'Más Información',
      viewFeatures: 'Ver Todas las Funciones',
      close: 'Cerrar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      save: 'Guardar',
      search: 'Buscar...',
      all: 'Todos',
      loading: 'Cargando...',
      offline: 'Modo Sin Conexión',
      online: 'En Línea',
      synced: 'Todos los cambios sincronizados',
      popular: 'POPULAR',
      mostPopular: 'MÁS POPULAR',
      recommended: 'Plan Recomendado',
      perMonth: '/mes',
      billedAnnually: 'Facturación anual',
      billedMonthly: 'Facturación mensual',
      billedQuarterly: 'Facturación trimestral',
      billedBiYearly: 'Facturación semestral',
      customPricing: 'Tarifas Corporativas a Medida',
      noCardRequired: 'No se requiere tarjeta de crédito',
      instantSetup: 'Configuración en 2 minutos',
      cancelAnytime: 'Cancela cuando quieras en 1 clic',
      offlineModeNotice: 'Operando sin conexión. Ventas locales guardadas con seguridad.',
      offlineBannerTitle: 'Operando en Modo Sin Conexión',
      offlineBannerDesc: 'La conexión de red no está disponible o es inestable. MsmeBooks guarda las ventas e inventario localmente y sincronizará en cuanto regrese la red.',
      cloudSyncRestored: 'Conexión restablecida — sincronización en la nube lista',
      connectionActive: 'Sincronización en la Nube Activa',
      connectionOffline: 'Modo Sin Conexión (Almacenamiento Local Activo)',
      simulateToggle: 'Simular Modo Sin Conexión',
      lastSynced: 'Última sincronización a las',
    },
    nav: {
      brandName: 'MsmeBooks',
      pricingPlans: 'Planes y Precios',
      planMatcher: 'Asesor de Planes',
      quizBadge: 'Cuestionario',
      featureMatrix: 'Tabla de Funciones',
      aiAssistant: 'Asistente IA',
      newBadge: 'Nuevo',
      africanFocus: 'Enfoque Panafricano',
      faqs: 'Preguntas Frecuentes',
      talkToSales: 'Hablar con Ventas',
      startTrial: 'Prueba Sin Riesgo',
      statusDisplay: 'Estado y Pantalla',
    },
    hero: {
      badge: 'Precios Panafricanos Transparentes',
      titlePart1: 'Precios Claros y Predecibles para',
      titleHighlight: 'Cada Empresa Africana',
      titlePart2: '',
      subtitle: 'Desde comercios en Malabo y Bata hasta mayoristas y distribuidores con múltiples almacenes en toda África. Contabilidad en la nube, TPV sin conexión, control de stock e inteligencia artificial sin cobros ocultos.',
      startTrialCta: 'Comenzar Prueba Sin Riesgo',
      talkToSalesCta: 'Agendar Demostración en Vivo',
      trustPill: 'Más de 12.400+ pymes africanas crecen a diario con MsmeBooks',
      mockTitle: 'Panel Empresarial en Tiempo Real',
      livePosBadge: 'TPV Sin Conexión Activo',
      grossSalesToday: 'Ventas Brutas de Hoy',
      activeRegisters: 'Cajas Activas',
      pendingDeliveries: 'Entregas Pendientes',
      netMargin: 'Margen Neto',
      recentTransactions: 'Transacciones Recientes',
      cashflowForecast: 'Previsión de Flujo de Caja',
      forecastNote: 'Cobros de facturas previstos suficientes para abonar el próximo envío de proveedores.',
      quickActionSale: 'Nueva Venta',
      quickActionReceipt: 'Ticket Térmico',
      quickActionSync: 'Sincronizar Caja',
      quickActionAudit: 'Auditoría Fiscal',
      syncedLedger: 'Libro Contable Encriptado',
    },
    billing: {
      monthly: 'Facturación Mensual',
      quarterly: 'Facturación Trimestral',
      biYearly: 'Facturación Semestral',
      yearly: 'Facturación Anual',
      saveDiscountBadge: '-20%',
      quarterlyDiscountBadge: '-5%',
      biYearlyDiscountBadge: '-10%',
      toggleSubtitle: 'Ciclos de suscripción flexibles con descuentos automáticos en periodos más amplios',
      annualNote: 'Suscripción anual en un solo pago con 20% de descuento y precio congelado 24 meses',
      quarterlyNote: 'Suscripción trimestral facturada cada 3 meses con 5% de descuento',
      biYearlyNote: 'Suscripción semestral facturada cada 6 meses con 10% de descuento',
    },
    pricing: {
      starter: {
        name: 'Starter',
        description: 'Herramientas esenciales para pequeños negocios que inician su gestión comercial digital.',
        bestFor: 'Emprendedores individuales, micro-comercios y locales de venta única',
        cta: 'Comenzar Prueba Sin Riesgo',
        features: [
          'Perfil y branding de empresa',
          'Contabilidad básica en la nube',
          'Control de ingresos y gastos',
          'Facturación y presupuestos profesionales',
          'Tickets digitales y térmicos',
          'Punto de venta (TPV) monopuesto',
          'Control de inventario básico',
          'Registro y cartera de clientes',
          'Gestión de proveedores',
          'Informes de ventas diarias',
          'Acceso móvil para Android e iOS',
          'Soporte estándar de la comunidad',
        ],
      },
      professional: {
        name: 'Profesional',
        badge: 'MÁS POPULAR',
        description: 'Todo lo que un negocio en crecimiento necesita para gestionar ventas, stock, contabilidad y clientes.',
        bestFor: 'Comercios minoristas, farmacias, restaurantes y empresas de servicios profesionales',
        cta: 'Comenzar Prueba Sin Riesgo',
        features: [
          'Todo lo incluido en Starter',
          'Contabilidad completa por partida doble',
          'TPV avanzado multi-método de pago',
          'Gestión de inventario por múltiples unidades',
          'Traslado de artículos entre estanterías',
          'Órdenes de compra y abonos a proveedores',
          'Conciliación bancaria automatizada',
          'Balance de situación y Cuenta de Resultados (P&L)',
          'Liquidaciones de IVA y retenciones en origen',
          'Cuentas de usuario y roles múltiples',
          'Permisos granulares y registro de auditoría',
          'Asistente de negocio con Inteligencia Artificial',
          'Soporte prioritario por WhatsApp y teléfono',
        ],
      },
      business: {
        name: 'Business',
        description: 'Para empresas consolidadas con múltiples locales, personal y grandes volúmenes operativos.',
        bestFor: 'Supermercados, cadenas de tiendas, mayoristas y distribuidores con varios depósitos',
        cta: 'Comenzar Prueba Sin Riesgo',
        features: [
          'Todo lo incluido en Profesional',
          'Gestión de múltiples sucursales y tiendas',
          'Gestión de múltiples almacenes y depósitos',
          'Seguimiento avanzado de lotes y caducidades',
          'Solicitudes de transferencia inter-almacén',
          'Cajas TPV sincronizadas en múltiples sedes',
          'Control de crédito comercial y cobros a clientes',
          'Contratos de compra y convenios con proveedores',
          'Analítica avanzada de márgenes por producto',
          'Gestión de turnos de empleados y comisiones',
          'Tienda de comercio electrónico integrada',
          'Acceso completo a API REST abierta',
          'Incorporación guiada con especialista',
          'Gestor de cuenta dedicado',
        ],
      },
      enterprise: {
        name: 'Enterprise',
        description: 'Gestión corporativa de alto rendimiento para grandes organizaciones y redes de franquicias.',
        bestFor: 'Grandes cadenas comerciales, distribuidores multinacionales y franquicias',
        customPricingText: 'A la medida de su empresa',
        cta: 'Contactar a Ventas',
        secondaryCta: 'Agendar Demostración',
        features: [
          'Todo lo incluido en Business',
          'Sucursales y cajas TPV ilimitadas',
          'Almacenes regionales sin límite',
          'Flujos de aprobación personalizados',
          'Matriz corporativa de permisos y roles',
          'Integraciones a medida con ERP y pasarelas bancarias',
          'Clúster exclusivo de base de datos en la nube',
          'Migración guiada de datos históricos',
          'Capacitación presencial para el equipo de trabajo',
          'Acuerdo de nivel de servicio (SLA) del 99,95%',
          'Equipo técnico de soporte dedicado 24/7',
        ],
      },
      moneyBackGuarantee: 'Prueba Sin Riesgo y Modelo de Uso Gratuito — Cero Compromiso',
      noSurprises: 'Precios locales transparentes sin costes imprevistos ni tarifas de alta.',
      vatCompliantNote: 'Precios sin tributos obligatorios, aplicables según la normativa fiscal.',
    },
    planMatcher: {
      badge: 'Asesor Interactivo',
      title: '¿No Está Seguro de Qué Plan se Adapta a su Negocio?',
      subtitle: 'Responda 3 breves preguntas sobre su operativa, equipo y puntos de venta para conocer la opción perfecta.',
      q1Title: '1. ¿Cuál es el tamaño y actividad de su negocio?',
      q1Options: [
        { label: 'Emprendedor individual o micro-comercio', sub: '1 tienda, gestionada por mí o con 1 empleado' },
        { label: 'Comercio en expansión, farmacia o restaurante', sub: 'Local con alta afluencia, equipo de 2 a 6 personas' },
        { label: 'Cadena de tiendas o distribuidor mayorista', sub: '2+ sucursales, almacén central, múltiples cajeros' },
        { label: 'Gran empresa o red de distribución', sub: '5+ sedes, depósitos regionales, procesos corporativos' },
      ],
      q2Title: '2. ¿Cuál es su principal prioridad operativa?',
      q2Options: [
        { label: 'Organizar las ventas y recibos diarios', sub: 'Dejar el papel y cuadrar la caja con seguridad' },
        { label: 'Evitar mermas de inventario y conocer el margen', sub: 'Saber el beneficio neto exacto y evitar pérdidas' },
        { label: 'Unificar múltiples tiendas y depósitos', sub: 'Traslados controlados de stock y visión centralizada' },
        { label: 'Automatizar todas las operaciones de la empresa', sub: 'Conexión por API, contabilidad avanzada y SLA' },
      ],
      q3Title: '3. ¿Necesita funcionamiento del TPV sin conexión a internet?',
      q3Options: [
        { label: 'Sí, el modo sin conexión es fundamental', sub: 'La conexión a internet falla habitualmente en nuestra zona' },
        { label: 'Útil, pero disponemos de buena conexión', sub: 'Uso principalmente en la nube con respaldo ocasional' },
        { label: 'Principalmente tareas de contabilidad y oficina', sub: 'Emisión de facturas y control desde ordenadores' },
      ],
      recommendationTitle: 'Plan Recomendado para su Negocio:',
      recommendationSubtitle: 'Seleccionado en función de su volumen, número de locales y necesidades de control de existencias.',
      whyThisPlan: 'Por qué este plan es perfecto para usted:',
      keyHighlights: 'Puntos destacados incluidos:',
      ctaButton: 'Comenzar Prueba Sin Riesgo con este Plan',
      retakeQuiz: 'Reiniciar el Cuestionario',
    },
    comparison: {
      badge: 'Tabla Comparativa',
      title: 'Compare Todas las Funcionalidades y Límites',
      subtitle: 'Detalle minucioso de módulos contables, cajas TPV, control de almacenes y medidas de seguridad.',
      categories: {
        accounting: { name: 'Contabilidad Fundamental y Libros', desc: 'Partida doble, plan contable adaptado y estados financieros' },
        pos: { name: 'Punto de Venta y Cajas (TPV)', desc: 'Cajas táctiles, tickets, escaneo de códigos de barra y ventas sin red' },
        inventory: { name: 'Inventario y Almacenamiento', desc: 'Valoración, traslados entre depósitos y avisos de reposición' },
        reporting: { name: 'Analítica y Liquidación Fiscal', desc: 'Rentabilidad, márgenes por producto, control de IVA y retenciones' },
        users: { name: 'Usuarios, Seguridad y Acompañamiento', desc: 'Accesos de equipo, control de permisos y puesta en marcha' },
      },
      tableFooterNote: 'Todos los planes cuentan con copias de seguridad diarias encriptadas, SSL de 256 bits y acceso móvil.',
    },
    freeTrial: {
      badge: 'Prueba Sin Riesgo',
      title: 'Pruebe MsmeBooks 100% Sin Riesgo',
      subtitle: 'Únase a miles de comerciantes y empresarios africanos que han transformado sus ventas, stock y contabilidad con nuestro modelo de uso gratuito.',
      perk1Title: 'Sin Datos Bancarios Ni Tarjetas',
      perk1Desc: 'Empiece de inmediato utilizando únicamente su correo electrónico y teléfono.',
      perk2Title: 'Acceso Completo a las Funciones Pro',
      perk2Desc: 'Pruebe ventas reales en el TPV sin internet, auditorías de inventario y el asistente IA.',
      perk3Title: 'Configuración Guiada en Minutos',
      perk3Desc: 'Importe sus productos y clientes actuales en cuestión de minutos con plantillas de Excel/CSV.',
      ctaTrial: 'Comenzar Prueba Sin Riesgo',
      ctaDemo: 'Reservar Sesión con un Especialista',
    },
    valueRoi: {
      badge: 'Retorno de la Inversión',
      title: 'Diseñado para Generar Valor Inmediato Sin Riesgo',
      subtitle: 'Cómo las pymes africanas eliminan mermas y recuperan más de 12 horas cada semana con MsmeBooks.',
      stat1Number: '250.000 FCFA+',
      stat1Label: 'Pérdidas de Stock Evitadas al Mes',
      stat1Desc: 'El arqueo ciego de caja y el registro de movimientos eliminan descuadres de caja y mercancía.',
      stat2Number: '14 h',
      stat2Label: 'Ahorradas Cada Semana',
      stat2Desc: 'Facturas automáticas, conciliación bancaria e impuestos sin hojas de cálculo manuales.',
      stat3Number: '99,9%',
      stat3Label: 'Disponibilidad con TPV Sin Red',
      stat3Desc: 'Continúe cobrando a sus clientes incluso ante caídas de fibra óptica o redes móviles.',
      stat4Number: '3,8x',
      stat4Label: 'Retorno de Inversión Anual Medio',
      stat4Desc: 'Beneficio neto demostrable gracias a la reducción de mermas y al cobro ágil de saldos pendientes.',
      calculatorTitle: 'Calculadora de Ahorro para Pymes',
      calculatorDesc: 'Calcule la mejora en productividad, recuperación de stock y optimización de sus márgenes.',
      timeSavedHours: 'Horas ahorradas al mes:',
      lossPrevented: 'Mermas de inventario evitadas:',
      annualRoiMultiplier: 'Multiplicador de retorno anual:',
    },
    aiAssistant: {
      badge: 'Copiloto Comercial con IA',
      title: 'Pregunte Cualquier Dato de su Negocio en Español',
      subtitle: 'Sin tecnicismos contables difíciles. Consulte directamente sus ventas y cuentas reales para obtener respuestas auditadas.',
      cardTitle: 'Copiloto Inteligente MsmeBooks',
      inputPlaceholder: 'Ej: "¿Qué productos generaron mayor margen esta semana?"',
      askButton: 'Consultar IA',
      sampleQueriesBadge: 'Preguntas recomendadas:',
      accuracyBadge: 'Calculado a partir de sus asientos contables verificados',
      prompts: [
        {
          question: '¿Qué productos generaron el mayor beneficio este mes?',
          answer: 'Sus cinco artículos principales generaron el 42% del beneficio bruto total este mes. El Rollo de Tejido Premium #4 obtuvo el margen más alto (58,4%), aportando 1.240.000 de beneficio neto. Por contra, el Fardo de Algodón tuvo alto volumen pero solo un 14% de margen por subidas del proveedor.',
          badge: 'Análisis de Rentabilidad',
        },
        {
          question: 'Analiza nuestros gastos operativos de los últimos 30 días',
          answer: 'Los gastos operativos sumaron 1.890.000 este mes (un 6,2% menos). El combustible para el grupo electrógeno fue el mayor gasto no laboral con 410.000 (21,7%), seguido del alquiler del local y embalajes. Recomendación: comprar embalajes al por mayor otorga un 12% de descuento.',
          badge: 'Optimización de Gastos',
        },
        {
          question: 'Identifica los artículos con stock bajo o cerca del mínimo',
          answer: 'Tres artículos críticos están por debajo del nivel de seguridad: 1) Paracetamol 500mg (quedan 8 cajas, mínimo 25), 2) Vitamina C Efervescente (quedan 4 tubos), 3) Amoxicilina Cápsulas (quedan 12 blísteres). Riesgo de rotura de stock en 48 horas según el ritmo de ventas.',
          badge: 'Alerta de Rotura de Stock',
        },
        {
          question: 'Genera un resumen de nuestro IVA y retenciones fiscales',
          answer: 'IVA repercutido en ventas del mes: 342.500. IVA soportado deducible en facturas de proveedores: 118.200. Saldo neto de IVA a ingresar en la administración tributaria: 224.300. Retenciones en origen practicadas a clientes corporativos: 95.000.',
          badge: 'Resumen Fiscal',
        },
      ],
    },
    africanFocus: {
      badge: 'Creado para África',
      title: 'Diseñado Específicamente para la Realidad del Comercio Africano',
      subtitle: 'Las herramientas internacionales se bloquean cuando se corta la luz o se interrumpe internet. MsmeBooks fue desarrollado pensando en nuestro día a día.',
      pillars: {
        offline: {
          title: 'TPV 100% Sin Conexión',
          desc: 'Siga cobrando a sus clientes e imprimiendo recibos incluso ante apagones o caídas de internet. Sincronización automática al volver la red.',
          tag: 'Cero Interrupciones',
        },
        multiCurrency: {
          title: 'Multidivisa Panafricana',
          desc: 'Facture y concilie en FCFA (XAF/XOF), NGN, GHS, KES, USD, EUR y más de 10 monedas locales con tipos de cambio actualizados.',
          tag: '16 Monedas Compatibles',
        },
        statutoryTax: {
          title: 'Fiscalidad Local e IVA',
          desc: 'Cálculo automatizado de IVA, retenciones en origen, timbres fiscales e informes oficiales adaptados a los organismos tributarios.',
          tag: 'Listo para Auditoría',
        },
        mobileMoney: {
          title: 'Mobile Money y Pagos Locales',
          desc: 'Integración directa con Orange Money, MoMo, Wave, M-Pesa, Paystack y transferencias bancarias directas en el mostrador de cobro.',
          tag: 'Cobro Rápido',
        },
      },
    },
    testimonials: {
      badge: 'Opiniones de Clientes',
      title: 'La Confianza de Más de 12.400+ Negocios en África',
      subtitle: 'Conozca cómo minoristas, farmacias, mayoristas y restaurantes en Malabo, Bata, Duala y Kinsasa impulsan sus operaciones con MsmeBooks.',
      trustScore: '4,9 / 5,0 Calificación Promedio',
      verifiedBusinesses: 'Pymes Verificadas en 18 Países Africanos',
    },
    faq: {
      badge: '¿Tiene Dudas?',
      title: 'Preguntas Frecuentes',
      subtitle: 'Todo lo que necesita saber sobre planes, cobros, funcionamiento sin internet y protección de datos.',
      filterAll: 'Todas las Preguntas',
      filterBilling: 'Facturación y Planes',
      filterFeatures: 'TPV y Funciones',
      filterSecurity: 'Seguridad y Sedes',
      filterOnboarding: 'Incorporación y Migración',
    },
    finalCta: {
      title: '¿Listo para Modernizar la Gestión de su Empresa?',
      subtitle: 'Únase a más de 12.400+ emprendedores africanos que han erradicado las mermas de stock, acelerado sus ventas y automatizado sus cuentas.',
      startTrialBtn: 'Comenzar Prueba Sin Riesgo',
      bookDemoBtn: 'Agendar Demostración Personalizada',
      reassurance1: 'Sin tarjeta de crédito',
      reassurance2: 'Configuración en 2 minutos',
      reassurance3: 'Soporte por WhatsApp incluido',
    },
    footer: {
      brandDesc: 'MsmeBooks es la plataforma panafricana de gestión empresarial diseñada para micro, pequeñas y medianas empresas. Integrando contabilidad en la nube, TPV sin conexión y almacenes.',
      platformTitle: 'Plataforma',
      smeSolutionsTitle: 'Soluciones para Pymes',
      companySupportTitle: 'Empresa y Asistencia',
      sslBadge: 'Cifrado SSL de 256 Bits',
      gdprBadge: 'Cumplimiento con Protección de Datos',
      copyright: 'MsmeBooks Inc. (www.msmebooks.org). Todos los derechos reservados.',
      panAfricanNote: 'Impulsando el comercio en Guinea Ecuatorial, Senegal, Costa de Marfil, Camerún, Gabón, Nigeria y toda África.',
    },
    liveChat: {
      launcherTitle: 'Soporte en Vivo 24/7',
      dialogTitle: 'Atención en Vivo MsmeBooks',
      agentName: 'Amara y Equipo de Soporte',
      agentRole: 'Especialista en Pymes (En Línea)',
      onlineBadge: 'En Línea Ahora',
      welcomeMessage: '¡Hola! Bienvenido a MsmeBooks. ¿En qué podemos ayudar a su negocio hoy? Pregúntenos sobre planes, TPV sin conexión o control de varios almacenes.',
      quickPrompt1: '¿Qué plan es el más adecuado para una farmacia o comercio minorista?',
      quickPrompt2: '¿Cómo funciona el TPV ante caídas de la conexión a internet?',
      quickPrompt3: '¿Puedo importar mi catálogo de productos existente desde Excel?',
      inputPlaceholder: 'Escriba su mensaje aquí...',
      sendButton: 'Enviar',
      botResponsePrefix: 'Asesor MsmeBooks:',
      phoneContact: 'Tel: +234 915 848 2622',
      emailContact: 'support@msmebooks.org',
    },
    trialModal: {
      trialTitle: 'Active su Prueba Sin Riesgo',
      demoTitle: 'Solicitar Demostración y Asesoría Corporativa',
      trialSubtitle: 'Acceso total inmediato con nuestro modelo de uso gratuito. No solicitamos datos de tarjeta.',
      demoSubtitle: 'Nuestro especialista programará una presentación personalizada de 30 minutos.',
      fullNameLabel: 'Nombre y Apellidos',
      emailLabel: 'Correo Electrónico de Trabajo',
      phoneLabel: 'Número de Teléfono (con WhatsApp)',
      businessNameLabel: 'Nombre de la Empresa o Local',
      businessTypeLabel: 'Sector o Actividad Principal',
      selectedPlanLabel: 'Plan Seleccionado',
      submitTrialBtn: 'Iniciar mi Prueba Sin Riesgo de Inmediato',
      submitDemoBtn: 'Confirmar Solicitud de Demostración',
      noCardNotice: '🔒 Sin compromiso. Prueba sin riesgo con modelo de uso gratuito, cancelación en 1 clic.',
      successTitle: '¡Prueba Activada con Éxito!',
      successMessage: '¡Bienvenido a MsmeBooks! Hemos enviado sus claves provisionales y la guía de inicio a su correo y WhatsApp.',
      closeBtn: 'Acceder a mi Panel',
    },
  },
};
