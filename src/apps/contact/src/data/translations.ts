export type SupportedLanguage = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'Anglophone Africa & Global',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Afrique Francophone (Sénégal, Côte d\'Ivoire, RDC...)',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'África Lusófona (Angola, Moçambique, Cabo Verde...)',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Guinea Ecuatorial & Mercados Internacionales',
  },
];

export interface TranslationDictionary {
  nav: {
    bannerTitle: string;
    bannerSub: string;
    products: string;
    panAfrica: string;
    partnerships: string;
    resources: string;
    faqs: string;
    contact: string;
    talkToSales: string;
    bookDemo: string;
    contactTeam: string;
    appearanceCurrency: string;
    selectLanguage: string;
    stories: string;
    onlineStatus: string;
    offlineStatus: string;
    offlineBadge: string;
    offlineNotice: string;
    offlineFeature1: string;
    offlineFeature2: string;
    offlineFeature3: string;
    simulateOffline: string;
    restoreOnline: string;
    cloudSynced: string;
    offlineActive: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaContact: string;
    ctaDemo: string;
    quote: string;
    quarterlyVolume: string;
    leakageRecovered: string;
    badgeResponse: string;
    badgeTax: string;
    badgeSupport: string;
  };
  quick: {
    badge: string;
    title: string;
    subtitle: string;
    salesTitle: string;
    salesDesc: string;
    salesCta: string;
    supportTitle: string;
    supportDesc: string;
    supportCta: string;
    partnersTitle: string;
    partnersDesc: string;
    partnersCta: string;
    demoTitle: string;
    demoDesc: string;
    demoCta: string;
  };
  direct: {
    badge: string;
    title: string;
    subtitle: string;
    phoneTitle: string;
    phoneDesc: string;
    emailTitle: string;
    emailDesc: string;
    whatsappTitle: string;
    whatsappDesc: string;
    hoursTitle: string;
    hoursDesc: string;
    responseTime: string;
    chatWithSales: string;
  };
  form: {
    badge: string;
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    workEmail: string;
    workEmailPlaceholder: string;
    companyName: string;
    companyNamePlaceholder: string;
    country: string;
    phoneNumber: string;
    phonePlaceholder: string;
    validPhone: string;
    invalidPhone: string;
    businessType: string;
    enquiryType: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    attachment: string;
    attachmentDesc: string;
    consent: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successSubtitle: string;
    successTicket: string;
    sendAnother: string;
    slaNotice: string;
    hubsTitle: string;
  };
  presence: {
    badge: string;
    title: string;
    subtitle: string;
    activeBusinesses: string;
    annualGmv: string;
    uptime: string;
    taxRegimes: string;
    hubsTitle: string;
    selectPrompt: string;
    hubOffice: string;
    currency: string;
    taxCompliance: string;
    specialization: string;
    contactLocalTeam: string;
  };
  partnerships: {
    badge: string;
    title: string;
    subtitle: string;
    enterpriseTitle: string;
    enterpriseDesc: string;
    accountingTitle: string;
    accountingDesc: string;
    resellerTitle: string;
    resellerDesc: string;
    learnMore: string;
    applyPartner: string;
  };
  resources: {
    badge: string;
    title: string;
    subtitle: string;
    helpCenterTitle: string;
    helpCenterDesc: string;
    knowledgeBaseTitle: string;
    knowledgeBaseDesc: string;
    apiDocsTitle: string;
    apiDocsDesc: string;
    videoDemosTitle: string;
    videoDemosDesc: string;
    accessResource: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCat: string;
    salesCat: string;
    supportCat: string;
    partnersCat: string;
    noResults: string;
    stillQuestions: string;
    stillQuestionsDesc: string;
    talkToSpecialist: string;
  };
  chat: {
    title: string;
    status: string;
    welcomeMsg: string;
    inputPlaceholder: string;
    send: string;
    quickPromptsTitle: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
    agentTyping: string;
    callDirect: string;
  };
  demo: {
    title: string;
    subtitle: string;
    fullName: string;
    workEmail: string;
    companyName: string;
    country: string;
    phone: string;
    businessSize: string;
    interestedModules: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    close: string;
  };
  stories: {
    badge: string;
    title: string;
    subtitle: string;
    allSectors: string;
    verifiedClient: string;
    statShrinkage: string;
    statHours: string;
    statCompliance: string;
    readCaseStudy: string;
    bookSimilarDemo: string;
  };
  security: {
    badge: string;
    title: string;
    subtitle: string;
    isoTitle: string;
    isoDesc: string;
    soc2Title: string;
    soc2Desc: string;
    pciTitle: string;
    pciDesc: string;
    dataPrivacyTitle: string;
    dataPrivacyDesc: string;
    encryptionTitle: string;
    encryptionDesc: string;
    taxComplianceTitle: string;
    taxComplianceDesc: string;
    verifiedAudit: string;
    viewCredentials: string;
    closeModal: string;
    guaranteeText: string;
    dataResidency: string;
    uptimeSla: string;
  };
  footer: {
    bio: string;
    panAfricanOps: string;
    products: string;
    company: string;
    resources: string;
    connect: string;
    rights: string;
    privacy: string;
    terms: string;
    brandingNotice: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    nav: {
      bannerTitle: 'Pan-African Business Cloud',
      bannerSub: 'Accounting, POS, Inventory & Management across 8+ African Markets',
      products: 'Products',
      panAfrica: 'Pan-Africa',
      partnerships: 'Partnerships',
      resources: 'Resources',
      faqs: 'FAQs',
      contact: 'Contact',
      talkToSales: 'Talk to Sales',
      bookDemo: 'Book a Free Demo',
      contactTeam: 'Contact Our Team',
      appearanceCurrency: 'Appearance & Currency',
      selectLanguage: 'Language',
      stories: 'Client Stories',
      onlineStatus: 'Online',
      offlineStatus: 'Offline Mode',
      offlineBadge: 'Local Resilience Active',
      offlineNotice: 'Working in offline mode. Invoices, POS sales, and inventory records are saved locally and will auto-sync upon reconnection.',
      offlineFeature1: 'Point-of-Sale (POS) & offline receipt generation',
      offlineFeature2: 'Local inventory catalog lookup',
      offlineFeature3: 'Automatic background cloud synchronization',
      simulateOffline: 'Simulate Offline Mode',
      restoreOnline: 'Restore Online Connection',
      cloudSynced: 'All data synced with Pan-African Cloud',
      offlineActive: 'Local Cache Active • 0 Loss Architecture',
    },
    hero: {
      badge: "WE'RE HERE TO HELP",
      headline: "Let's Talk Business. We're Here to Help You Grow.",
      subheadline:
        "Have questions about MsmeBooks? Whether you're exploring our Accounting, POS, Inventory, or Business Management solutions, need technical assistance, or want to become a partner, our team is ready to help you succeed.",
      ctaContact: 'Contact Our Team',
      ctaDemo: 'Book a Free Demo',
      quote:
        '"Helping African businesses operate smarter, grow faster, and manage everything in one place."',
      quarterlyVolume: 'Quarterly African Volume',
      leakageRecovered: 'Avg. Leakage Recovered',
      badgeResponse: '< 15-Minute First Response',
      badgeTax: 'Certified Pan-African Tax Compliance',
      badgeSupport: '24/7 Dedicated Account Specialists',
    },
    quick: {
      badge: 'SPEEDY ACCESS',
      title: 'How Can We Assist You Today?',
      subtitle:
        'Choose the pathway that best fits your immediate business requirements for instant routing.',
      salesTitle: 'Talk to Our Sales Team',
      salesDesc:
        'Discover how MsmeBooks can simplify your accounting, sales, inventory, and daily business operations.',
      salesCta: 'Contact Sales',
      supportTitle: 'Get Customer Support',
      supportDesc:
        'Need assistance with your account, subscription, integrations, or software features? Our support team is here to help.',
      supportCta: 'Get Support',
      partnersTitle: 'Become a MsmeBooks Partner',
      partnersDesc:
        'Explore exciting opportunities for accountants, bookkeepers, consultants, IT companies, software resellers, and distributors.',
      partnersCta: 'Explore Partnerships',
      demoTitle: 'Schedule a Product Demo',
      demoDesc:
        'See how MsmeBooks can help your business manage finances, sales, inventory, and operations from one platform.',
      demoCta: 'Book a Demo',
    },
    direct: {
      badge: 'DIRECT CONNECTIVITY',
      title: 'Reach Us Directly Across Channels',
      subtitle:
        'Our regional teams are available around the clock via phone, email, WhatsApp, and live chat.',
      phoneTitle: 'Direct Phone Lines',
      phoneDesc: 'Immediate telephone routing to Pan-African desks in Lagos, Nairobi, and Johannesburg.',
      emailTitle: 'Email Enquiries',
      emailDesc: 'Priority inbox monitored by dedicated enterprise solutions engineers.',
      whatsappTitle: 'WhatsApp Business',
      whatsappDesc: 'Fast messaging, document sharing, and instant account assistance on WhatsApp.',
      hoursTitle: 'Operating Hours',
      hoursDesc: 'Mon - Fri: 8:00 AM - 6:00 PM WAT · 24/7 Urgent Enterprise On-Call Support',
      responseTime: 'Average reply within 15 minutes during operating hours',
      chatWithSales: 'Start Instant Chat',
    },
    form: {
      badge: 'GET IN TOUCH',
      title: 'Send Us a Message',
      subtitle:
        'Fill out the form below and an assigned specialist from your region will get back to you within 15 minutes.',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Amara Okafor',
      workEmail: 'Work Email',
      workEmailPlaceholder: 'name@company.com',
      companyName: 'Company Name',
      companyNamePlaceholder: 'e.g. Atlas Logistics Ltd',
      country: 'Country / Market',
      phoneNumber: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      validPhone: 'Valid phone format',
      invalidPhone: 'Invalid number for selected country',
      businessType: 'Business Type / Industry',
      enquiryType: 'Enquiry Type',
      subject: 'Subject',
      subjectPlaceholder: 'How can we help your business?',
      message: 'Message',
      messagePlaceholder:
        'Tell us about your team size, software needs, or any specific requirements...',
      attachment: 'Attachment (Optional)',
      attachmentDesc: 'Upload RFP, specifications, or existing ledger summary (PDF, DOCX, XLSX, PNG up to 10MB)',
      consent:
        'I consent to MsmeBooks processing my details to respond to this business enquiry in accordance with regional data privacy regulations (NDPR, POPIA, GDPR).',
      submit: 'Send Enquiry Now',
      submitting: 'Dispatching to Regional Desk...',
      successTitle: 'Enquiry Dispatched Successfully!',
      successSubtitle:
        'Thank you for contacting MsmeBooks. Your ticket has been assigned to our regional account desk.',
      successTicket: 'Ticket Reference: #MB-',
      sendAnother: 'Send Another Enquiry',
      slaNotice: 'Strict SLA Guarantee: 15-Minute Response Time',
      hubsTitle: 'Pan-African Direct Desks',
    },
    presence: {
      badge: 'CONTINENT-WIDE REACH',
      title: 'Built for Africa, Trusted Across 8+ Key Markets',
      subtitle:
        'From Lagos to Nairobi, Johannesburg to Cairo, MsmeBooks powers micro, small, and mid-sized enterprises with localized tax compliance and multi-currency operations.',
      activeBusinesses: 'Active African Enterprises',
      annualGmv: 'Annual GMV Tracked',
      uptime: 'Cloud Infrastructure Uptime',
      taxRegimes: 'Tax Compliant Regimes',
      hubsTitle: 'Regional Hub Directory',
      selectPrompt: 'Select a market below to view regional hubs, tax rules, and local currency handling:',
      hubOffice: 'Regional Hub Office',
      currency: 'Standard Currency',
      taxCompliance: 'Tax & Regulatory Compliance',
      specialization: 'Core Industry Focus',
      contactLocalTeam: 'Connect with Local Desk',
    },
    partnerships: {
      badge: 'GROW TOGETHER',
      title: 'Sales Solutions & Strategic Partnerships',
      subtitle:
        'Choose the right engagement tier for your enterprise or join our Pan-African partner ecosystem.',
      enterpriseTitle: 'Enterprise & Multi-Branch Deployments',
      enterpriseDesc:
        'Custom SLAs, dedicated database isolation, tailored chart of accounts, and multi-currency consolidated reporting for growing regional conglomerates.',
      accountingTitle: 'Accountants & Financial Advisors',
      accountingDesc:
        'Access a dedicated multi-client portal, certified advisor commissions, and streamline audit workflows for your clients across Africa.',
      resellerTitle: 'Channel Resellers & IT Distributors',
      resellerDesc:
        'Earn recurring margins, receive co-marketing funds, and deliver POS hardware & implementation services in your territory.',
      learnMore: 'Discover Requirements',
      applyPartner: 'Apply for Partnership',
    },
    resources: {
      badge: 'HELP & GUIDANCE',
      title: 'Help Centre & Knowledge Resources',
      subtitle:
        'Comprehensive documentation, step-by-step video tutorials, and technical support guides for seamless onboarding.',
      helpCenterTitle: 'MsmeBooks Help Centre',
      helpCenterDesc: 'Detailed guides on setting up your chart of accounts, bank feeds, and automated tax filings.',
      knowledgeBaseTitle: 'Knowledge Base & FAQs',
      knowledgeBaseDesc: 'Find instant answers to common questions about subscriptions, users, and multi-currency.',
      apiDocsTitle: 'Developer & API Docs',
      apiDocsDesc: 'Integrate MsmeBooks with your e-commerce store, CRM, payment gateways, and custom ERPs.',
      videoDemosTitle: 'Interactive Video Tutorials',
      videoDemosDesc: 'Watch step-by-step masterclasses on POS operations, stocktaking, and financial reporting.',
      accessResource: 'Access Resource',
    },
    faq: {
      badge: 'CLEAR ANSWERS',
      title: 'Frequently Asked Questions',
      subtitle:
        'Everything you need to know about MsmeBooks software, setup, pricing, and regional integrations.',
      searchPlaceholder: 'Search questions, topics, tax compliance, POS hardware...',
      allCat: 'All Questions',
      salesCat: 'Sales & Pricing',
      supportCat: 'Technical Support',
      partnersCat: 'Partnerships',
      noResults: 'No questions matched your search query. Try another keyword or contact our support team.',
      stillQuestions: 'Still have questions or specific needs?',
      stillQuestionsDesc:
        'Our product specialists and regional solutions engineers are available right now to assist you.',
      talkToSpecialist: 'Speak with a Specialist',
    },
    chat: {
      title: 'MsmeBooks Live Support',
      status: 'Online · Average reply < 2 mins',
      welcomeMsg:
        'Hello! Welcome to MsmeBooks. How can our Pan-African support team assist your business today?',
      inputPlaceholder: 'Type your message or inquiry here...',
      send: 'Send',
      quickPromptsTitle: 'Common Enquiries:',
      prompt1: 'What are your pricing plans & currencies?',
      prompt2: 'How quickly can I schedule a demo?',
      prompt3: 'Do you support local taxes & e-invoicing?',
      prompt4: 'What POS hardware and printers work?',
      agentTyping: 'Agent is typing...',
      callDirect: 'Call Us Direct',
    },
    demo: {
      title: 'Book a Personalized Product Demo',
      subtitle:
        'Experience how MsmeBooks streamlines your financial reporting, inventory tracking, and sales points in real time.',
      fullName: 'Full Name',
      workEmail: 'Work Email',
      companyName: 'Company Name',
      country: 'Operating Country',
      phone: 'Phone Number',
      businessSize: 'Team / Business Size',
      interestedModules: 'Modules You Wish to Explore',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time (WAT / EAT / SAST)',
      notes: 'Specific Requirements or Questions',
      notesPlaceholder: 'e.g. We have 3 branches in Nairobi needing synchronized inventory and M-Pesa POS integration...',
      submit: 'Schedule Live Demo',
      submitting: 'Confirming Booking...',
      successTitle: 'Demo Scheduled Successfully!',
      successDesc:
        'A confirmation email and Google Meet invitation have been sent to your inbox. An account executive will reach out to tailor your demo.',
      close: 'Close Window',
    },
    stories: {
      badge: 'CLIENT SUCCESS STORIES',
      title: 'Empowering Thousands of African Enterprises Every Day',
      subtitle:
        'Discover how business leaders across Nigeria, Kenya, Ghana, South Africa, and Rwanda use MsmeBooks to stop revenue leakage, simplify tax audits, and scale.',
      allSectors: 'All Sectors',
      verifiedClient: 'Verified African Enterprise Client',
      statShrinkage: 'Leakage Eliminated',
      statHours: 'Hours Saved Weekly',
      statCompliance: 'Tax Audit Ready',
      readCaseStudy: 'Explore Case Study',
      bookSimilarDemo: 'Book a Demo for Your Industry',
    },
    security: {
      badge: 'SECURITY & COMPLIANCE',
      title: 'Bank-Grade Security Built for Pan-African Enterprises',
      subtitle:
        'Your business ledger, customer transactions, and POS communications are guarded by internationally recognized security standards and regional data sovereignty.',
      isoTitle: 'ISO/IEC 27001 Certified',
      isoDesc: 'Global benchmark for Information Security Management Systems (ISMS), audited annually for zero vulnerability.',
      soc2Title: 'SOC 2 Type II Certified',
      soc2Desc: 'Independent CPA audit confirming institutional rigor across Security, Availability, and Confidentiality.',
      pciTitle: 'PCI-DSS Level 1 Compliant',
      pciDesc: 'Highest payment card security level protecting POS registers, terminal swipes, and card-on-file receipts.',
      dataPrivacyTitle: 'NDPR, POPIA & GDPR Compliant',
      dataPrivacyDesc: 'Strict adherence to African and global personal data sovereignty laws with zero unauthorized third-party sharing.',
      encryptionTitle: '256-Bit AES & TLS 1.3 Encryption',
      encryptionDesc: 'Military-grade end-to-end cryptographic hashing across all cloud backups, mobile syncs, and offline caches.',
      taxComplianceTitle: 'Certified Tax Compliance',
      taxComplianceDesc: 'Direct fiscal compliance with KRA eTIMS, FIRS, SARS VAT, and SYSCOHADA audit regulations.',
      verifiedAudit: 'Verified Institutional Standard',
      viewCredentials: 'View Audit Credentials',
      closeModal: 'Close Security Details',
      guaranteeText: 'All inquiries sent through our platform are protected by 256-bit TLS encryption and strict non-disclosure policies.',
      dataResidency: 'Pan-African Sovereign Data Hosting (Lagos, Nairobi, JHB)',
      uptimeSla: '99.98% High Availability Cloud SLA',
    },
    footer: {
      bio: 'MsmeBooks is an all-in-one cloud-based Accounting, POS, Inventory, and Business Management platform helping businesses simplify operations and grow with confidence.',
      panAfricanOps: 'Pan-African Operations',
      products: 'Products',
      company: 'Company',
      resources: 'Resources',
      connect: 'Connect',
      rights: 'All rights reserved. Built for African Businesses, Ready for Global Growth.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      brandingNotice: 'Strictly Corporate Blue & Lemon Green Branding',
    },
  },

  fr: {
    nav: {
      bannerTitle: 'Cloud d\'Entreprise Panafricain',
      bannerSub: 'Comptabilité, Point de Vente, Stocks et Gestion dans 8+ Marchés Africains',
      products: 'Produits',
      panAfrica: 'Panafrique',
      partnerships: 'Partenariats',
      resources: 'Ressources',
      faqs: 'FAQ',
      contact: 'Contact',
      talkToSales: 'Contacter les Ventes',
      bookDemo: 'Réserver une Démo Gratuite',
      contactTeam: 'Contacter Notre Équipe',
      appearanceCurrency: 'Apparence & Devise',
      selectLanguage: 'Langue',
      stories: 'Témoignages Clients',
      onlineStatus: 'En ligne',
      offlineStatus: 'Mode Hors-Ligne',
      offlineBadge: 'Résilience Locale Active',
      offlineNotice: 'Fonctionnement en mode hors-ligne. Factures, ventes caisse et stocks sont enregistrés localement et synchronisés automatiquement dès reconnexion.',
      offlineFeature1: 'Point de vente (POS) & émission de reçus hors-ligne',
      offlineFeature2: 'Consultation du catalogue de stock en cache local',
      offlineFeature3: 'Synchronisation automatique en arrière-plan avec le cloud',
      simulateOffline: 'Simuler Mode Hors-Ligne',
      restoreOnline: 'Rétablir la Connexion',
      cloudSynced: 'Toutes les données sont synchronisées avec le Cloud',
      offlineActive: 'Cache Local Actif • Zéro Perte de Données',
    },
    hero: {
      badge: 'NOUS SOMMES LÀ POUR VOUS AIDER',
      headline: 'Parlons Affaires. Nous Sommes Là Pour Accélérer Votre Croissance.',
      subheadline:
        'Vous avez des questions sur MsmeBooks ? Que vous découvriez nos solutions de Comptabilité, Caisse POS, Gestion des Stocks ou Gestion d\'Entreprise, notre équipe locale est prête à assurer votre réussite.',
      ctaContact: 'Contacter Notre Équipe',
      ctaDemo: 'Réserver une Démo Gratuite',
      quote:
        '« Permettre aux entreprises africaines de fonctionner plus intelligemment, de croître plus vite et de tout gérer au même endroit. »',
      quarterlyVolume: 'Volume Trimestriel Africain',
      leakageRecovered: 'Moyenne Fuites Récupérées',
      badgeResponse: 'Première réponse en < 15 minutes',
      badgeTax: 'Conformité Fiscale Certifiée en Afrique',
      badgeSupport: 'Spécialistes Dédiés Disponibles 24h/7j',
    },
    quick: {
      badge: 'ACCÈS RAPIDE',
      title: 'Comment Pouvons-Nous Vous Aider Aujourd\'hui ?',
      subtitle:
        'Choisissez le canal le plus adapté à vos besoins immédiats pour une prise en charge instantanée.',
      salesTitle: 'Échanger avec Notre Équipe Commerciale',
      salesDesc:
        'Découvrez comment MsmeBooks simplifie votre comptabilité, vos ventes de caisse, vos stocks et vos opérations quotidiennes.',
      salesCta: 'Contacter les Ventes',
      supportTitle: 'Obtenir de l\'Assistance Technique',
      supportDesc:
        'Besoin d\'aide avec votre compte, votre abonnement, vos intégrations ou vos modules ? Notre support est à votre disposition.',
      supportCta: 'Obtenir du Support',
      partnersTitle: 'Devenir Partenaire MsmeBooks',
      partnersDesc:
        'Explorez de formidables opportunités pour experts-comptables, consultants d\'affaires, revendeurs informatiques et distributeurs.',
      partnersCta: 'Découvrir les Partenariats',
      demoTitle: 'Planifier une Démo Personnalisée',
      demoDesc:
        'Voyez concrètement comment MsmeBooks pilote vos finances, vos points de vente et vos inventaires sur une plateforme unifiée.',
      demoCta: 'Réserver une Démo',
    },
    direct: {
      badge: 'CONNECTIVITÉ DIRECTE',
      title: 'Contactez-Nous Directement sur Nos Canaux',
      subtitle:
        'Nos équipes régionales sont joignables en continu par téléphone, e-mail, WhatsApp et messagerie instantanée.',
      phoneTitle: 'Lignes Téléphoniques Directes',
      phoneDesc: 'Mise en relation immédiate avec nos bureaux régionaux à Lagos, Nairobi et Johannesburg.',
      emailTitle: 'Demandes par E-mail',
      emailDesc: 'Boîte de réception prioritaire traitée par des ingénieurs solutions d\'entreprise dédiés.',
      whatsappTitle: 'WhatsApp Professionnel',
      whatsappDesc: 'Échanges rapides, envoi de devis et assistance instantanée via WhatsApp.',
      hoursTitle: 'Heures d\'Ouverture',
      hoursDesc: 'Lun - Ven : 08h00 - 18h00 WAT · Support d\'astreinte d\'urgence Entreprise 24h/7j',
      responseTime: 'Délai moyen de réponse inférieur à 15 minutes pendant les heures ouvrées',
      chatWithSales: 'Démarrer le Chat Direct',
    },
    form: {
      badge: 'PRENDRE CONTACT',
      title: 'Envoyez-Nous un Message',
      subtitle:
        'Remplissez le formulaire ci-dessous et un spécialiste dédié à votre pays vous recontactera sous 15 minutes.',
      fullName: 'Nom Complet',
      fullNamePlaceholder: 'ex. Amara Okafor / Jean Dupont',
      workEmail: 'E-mail Professionnel',
      workEmailPlaceholder: 'nom@entreprise.com',
      companyName: 'Nom de l\'Entreprise',
      companyNamePlaceholder: 'ex. Atlas Logistique SARL',
      country: 'Pays / Marché',
      phoneNumber: 'Numéro de Téléphone',
      phonePlaceholder: 'Saisissez votre numéro de téléphone',
      validPhone: 'Format de téléphone valide',
      invalidPhone: 'Numéro invalide pour le pays sélectionné',
      businessType: 'Secteur d\'Activité / Industrie',
      enquiryType: 'Type de Demande',
      subject: 'Objet',
      subjectPlaceholder: 'Comment pouvons-nous vous aider ?',
      message: 'Message',
      messagePlaceholder:
        'Précisez la taille de votre équipe, vos besoins logiciels ou toute exigence particulière...',
      attachment: 'Pièce Jointe (Facultatif)',
      attachmentDesc: 'Téléversez votre cahier des charges, balance générale ou plan de comptes (PDF, DOCX, XLSX jusqu\'à 10 Mo)',
      consent:
        'J\'accepte que MsmeBooks traite mes données pour répondre à cette demande d\'affaires conformément aux lois de protection des données (NDPR, POPIA, RGPD).',
      submit: 'Envoyer la Demande',
      submitting: 'Transmission au Bureau Régional...',
      successTitle: 'Demande Transmise avec Succès !',
      successSubtitle:
        'Merci d\'avoir contacté MsmeBooks. Votre dossier a été transmis à notre équipe régionale avec le numéro de ticket.',
      successTicket: 'Référence du Ticket : #MB-',
      sendAnother: 'Envoyer un Autre Message',
      slaNotice: 'Garantie SLA Stricte : Réponse sous 15 Minutes',
      hubsTitle: 'Bureaux Régionaux Directs',
    },
    presence: {
      badge: 'RAYONNEMENT CONTINENTAL',
      title: 'Conçu pour l\'Afrique, Adopté dans Plus de 8 Grands Marchés',
      subtitle:
        'De Lagos à Dakar, de Nairobi à Abidjan, MsmeBooks accompagne les PME et entreprises régionales avec une fiscalité locale certifiée et une gestion multidevise native.',
      activeBusinesses: 'Entreprises Africaines Actives',
      annualGmv: 'Volume Annuel Traité',
      uptime: 'Disponibilité Infrastructure Cloud',
      taxRegimes: 'Régimes Fiscaux Conformes',
      hubsTitle: 'Répertoire des Hubs Régionaux',
      selectPrompt: 'Sélectionnez un marché pour voir les pôles régionaux, la conformité fiscale et la devise :',
      hubOffice: 'Siège du Hub Régional',
      currency: 'Devise Principale',
      taxCompliance: 'Conformité Fiscale & Réglementaire',
      specialization: 'Spécialisation Sectorielle',
      contactLocalTeam: 'Contacter le Bureau Local',
    },
    partnerships: {
      badge: 'GRANDIR ENSEMBLE',
      title: 'Solutions d\'Entreprise & Partenariats Stratégiques',
      subtitle:
        'Choisissez le niveau d\'accompagnement adapté à votre entreprise ou rejoignez notre écosystème de partenaires panafricains.',
      enterpriseTitle: 'Déploiement Multi-Agences & Grands Comptes',
      enterpriseDesc:
        'SLA personnalisés, bases de données isolées, plan comptable sur-mesure et consolidation financière multi-devises pour holdings en pleine expansion.',
      accountingTitle: 'Experts-Comptables & Cabinets Conseil',
      accountingDesc:
        'Accédez à un portail multi-entreprises dédié, touchez des commissions partenaires et simplifiez les audits de vos clients partout en Afrique.',
      resellerTitle: 'Revendeurs & Intégrateurs Informatiques',
      resellerDesc:
        'Générez des marges récurrentes, bénéficiez de fonds marketing partagés et déployez le matériel de caisse POS et les formations dans votre région.',
      learnMore: 'Découvrir les Conditions',
      applyPartner: 'Candidater au Partenariat',
    },
    resources: {
      badge: 'ASSISTANCE & GUIDES',
      title: 'Centre d\'Aide & Ressources Documentaires',
      subtitle:
        'Documentation exhaustive, didacticiels vidéo pas à pas et guides d\'intégration technique pour un démarrage rapide.',
      helpCenterTitle: 'Centre d\'Aide MsmeBooks',
      helpCenterDesc: 'Guides détaillés pour configurer votre plan comptable, vos rapprochements bancaires et vos télé-déclarations fiscales.',
      knowledgeBaseTitle: 'Base de Connaissances & FAQ',
      knowledgeBaseDesc: 'Trouvez des réponses immédiates aux questions fréquentes sur la facturation, les utilisateurs et le multidevise.',
      apiDocsTitle: 'Documentation API & Développeurs',
      apiDocsDesc: 'Connectez MsmeBooks à vos boutiques e-commerce, CRM, passerelles de paiement locales et ERP existants.',
      videoDemosTitle: 'Formations Vidéo Interactives',
      videoDemosDesc: 'Visionnez des démonstrations pratiques sur la caisse tactile, l\'inventaire et les rapports d\'états financiers.',
      accessResource: 'Consulter la Ressource',
    },
    faq: {
      badge: 'RÉPONSES CLAIRES',
      title: 'Foire Aux Questions',
      subtitle:
        'Tout ce que vous devez savoir sur le progiciel MsmeBooks, la mise en service, les tarifs et la conformité locale.',
      searchPlaceholder: 'Rechercher une question, fiscalité, matériel de caisse, devise...',
      allCat: 'Toutes les Questions',
      salesCat: 'Ventes & Tarification',
      supportCat: 'Support Technique',
      partnersCat: 'Partenariats',
      noResults: 'Aucune question ne correspond à votre recherche. Essayez un autre terme ou contactez notre support.',
      stillQuestions: 'Vous avez encore des questions ou un besoin sur-mesure ?',
      stillQuestionsDesc:
        'Nos spécialistes produits et ingénieurs d\'affaires régionaux sont immédiatement disponibles pour vous renseigner.',
      talkToSpecialist: 'Parler à un Spécialiste',
    },
    chat: {
      title: 'Support en Direct MsmeBooks',
      status: 'En ligne · Réponse moyenne < 2 min',
      welcomeMsg:
        'Bonjour ! Bienvenue sur MsmeBooks. En quoi notre équipe de support panafricaine peut-elle vous aider aujourd\'hui ?',
      inputPlaceholder: 'Écrivez votre message ou votre question ici...',
      send: 'Envoyer',
      quickPromptsTitle: 'Questions fréquentes :',
      prompt1: 'Quels sont vos forfaits et devises acceptées ?',
      prompt2: 'En combien de temps puis-je avoir une démo ?',
      prompt3: 'Gérez-vous la TVA locale et la facture électronique ?',
      prompt4: 'Quels lecteurs codes-barres et imprimantes sont compatibles ?',
      agentTyping: 'L\'agent est en train d\'écrire...',
      callDirect: 'Nous Appeler Directement',
    },
    demo: {
      title: 'Réserver une Démo Personnalisée du Produit',
      subtitle:
        'Découvrez comment MsmeBooks fluidifie vos bilans comptables, le suivi de vos inventaires et vos points de vente en temps réel.',
      fullName: 'Nom Complet',
      workEmail: 'E-mail Professionnel',
      companyName: 'Nom de l\'Entreprise',
      country: 'Pays d\'Activité',
      phone: 'Numéro de Téléphone',
      businessSize: 'Taille de l\'Entreprise / Effectif',
      interestedModules: 'Modules Souhaités à Explorer',
      preferredDate: 'Date Souhaitée',
      preferredTime: 'Heure Souhaitée (WAT / GMT / CAT)',
      notes: 'Besoins Spécifiques ou Précisions',
      notesPlaceholder: 'ex. Nous avons 3 magasins à Abidjan et souhaitons synchroniser les stocks et paiements mobiles...',
      submit: 'Confirmer la Démo',
      submitting: 'Réservation en Cours...',
      successTitle: 'Démo Programmée avec Succès !',
      successDesc:
        'Un e-mail de confirmation et une invitation Google Meet ont été envoyés à votre adresse. Un responsable commercial préparera votre session personnalisée.',
      close: 'Fermer la Fenêtre',
    },
    stories: {
      badge: 'TÉMOIGNAGES CLIENTS',
      title: 'Au Service de Milliers d\'Entreprises Africaines au Quotidien',
      subtitle:
        'Découvrez comment les dirigeants au Sénégal, Côte d\'Ivoire, Cameroun et RDC utilisent MsmeBooks pour stopper les pertes de stock et simplifier la comptabilité.',
      allSectors: 'Tous les Secteurs',
      verifiedClient: 'Entreprise Cliente Vérifiée',
      statShrinkage: 'Pertes de Stock Éliminées',
      statHours: 'Heures Gagnées par Semaine',
      statCompliance: 'Conformité Fiscale 100%',
      readCaseStudy: 'Voir l\'Étude de Cas',
      bookSimilarDemo: 'Réserver une Démo Dédiée',
    },
    security: {
      badge: 'SÉCURITÉ & CONFORMITÉ',
      title: 'Sécurité Bancaire Conçue pour les Entreprises Africaines',
      subtitle:
        'Vos grands livres, transactions de caisse et données clients sont protégés selon les normes de sécurité les plus strictes et la souveraineté régionale des données.',
      isoTitle: 'Certifié ISO/IEC 27001',
      isoDesc: 'Référence mondiale pour les systèmes de gestion de la sécurité de l\'information (SMSI), audité chaque année.',
      soc2Title: 'Certifié SOC 2 Type II',
      soc2Desc: 'Audit institutionnel indépendant certifiant la sécurité, la haute disponibilité et la confidentialité des données.',
      pciTitle: 'Conforme PCI-DSS Niveau 1',
      pciDesc: 'Niveau maximal de sécurité des transactions par carte pour caisses de vente (POS) et terminaux mobiles.',
      dataPrivacyTitle: 'Conforme RGPD, NDPR & POPIA',
      dataPrivacyDesc: 'Respect scrupuleux des lois africaines et internationales sur la protection de la vie privée sans revente de données.',
      encryptionTitle: 'Chiffrement 256-Bit AES & TLS 1.3',
      encryptionDesc: 'Chiffrement cryptographique de niveau militaire sur toutes les sauvegardes cloud, synchronisations et caches locaux.',
      taxComplianceTitle: 'Conformité Fiscale Certifiée',
      taxComplianceDesc: 'Intégration directe aux normes SYSCOHADA, DGI, KRA et SARS pour des audits comptables sans faille.',
      verifiedAudit: 'Norme Institutionnelle Vérifiée',
      viewCredentials: 'Voir les Accréditations',
      closeModal: 'Fermer les Détails de Sécurité',
      guaranteeText: 'Toutes les demandes adressées via notre plateforme bénéficient d\'un chiffrement TLS 256 bits et d\'accords de confidentialité stricts.',
      dataResidency: 'Hébergement Souverain Panafricain (Lagos, Nairobi, JHB)',
      uptimeSla: 'SLA Haute Disponibilité Cloud de 99,98%',
    },
    footer: {
      bio: 'MsmeBooks est une plateforme cloud tout-en-un de Comptabilité, Point de Vente, Gestion des Stocks et Pilotage d\'Entreprise qui aide les sociétés à simplifier leurs opérations et grandir sereinement.',
      panAfricanOps: 'Opérations Panafricaines',
      products: 'Produits',
      company: 'Entreprise',
      resources: 'Ressources',
      connect: 'Nous Contacter',
      rights: 'Tous droits réservés. Conçu pour les entreprises africaines, prêt pour le monde entier.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions Générales d\'Utilisation',
      brandingNotice: 'Identité de Marque : Bleu Corporatif & Vert Citron',
    },
  },

  pt: {
    nav: {
      bannerTitle: 'Nuvem Empresarial Pan-Africana',
      bannerSub: 'Contabilidade, Ponto de Venda, Stock e Gestão em mais de 8 Mercados Africanos',
      products: 'Produtos',
      panAfrica: 'Pan-África',
      partnerships: 'Parcerias',
      resources: 'Recursos',
      faqs: 'Perguntas Frequentes',
      contact: 'Contacto',
      talkToSales: 'Falar com Vendas',
      bookDemo: 'Agendar Demonstração Gratuita',
      contactTeam: 'Contactar Nossa Equipa',
      appearanceCurrency: 'Aparência & Moeda',
      selectLanguage: 'Idioma',
      stories: 'Casos de Sucesso',
      onlineStatus: 'Online',
      offlineStatus: 'Modo Offline',
      offlineBadge: 'Resiliência Local Ativa',
      offlineNotice: 'A operar em modo offline. Faturas, vendas no POS e stocks são guardados localmente e sincronizados automaticamente ao restabelecer a ligação.',
      offlineFeature1: 'Ponto de Venda (POS) & emissão de recibos offline',
      offlineFeature2: 'Consulta do catálogo de stock no cache local',
      offlineFeature3: 'Sincronização automática em segundo plano na nuvem',
      simulateOffline: 'Simular Modo Offline',
      restoreOnline: 'Restabelecer Ligação',
      cloudSynced: 'Todos os dados sincronizados na Nuvem',
      offlineActive: 'Cache Local Ativo • Arquitetura Sem Perdas',
    },
    hero: {
      badge: 'ESTAMOS AQUI PARA AJUDAR',
      headline: 'Vamos Falar de Negócios. Estamos Aqui Para Ajudar a Sua Empresa a Crescer.',
      subheadline:
        'Tem dúvidas sobre o MsmeBooks? Quer pretenda explorar as nossas soluções de Contabilidade, POS, Gestão de Stock ou Gestão de Negócios, a nossa equipa local está pronta para apoiar o seu sucesso.',
      ctaContact: 'Contactar Nossa Equipa',
      ctaDemo: 'Agendar Demonstração Gratuita',
      quote:
        '«Capacitar as empresas africanas a operar de forma mais inteligente, a crescer mais rápido e a gerir tudo no mesmo lugar.»',
      quarterlyVolume: 'Volume Trimestral Africano',
      leakageRecovered: 'Média de Perdas Recuperadas',
      badgeResponse: 'Primeira resposta em < 15 minutos',
      badgeTax: 'Conformidade Fiscal Certificada em África',
      badgeSupport: 'Especialistas Dedicados Disponíveis 24/7',
    },
    quick: {
      badge: 'ACESSO RÁPIDO',
      title: 'Como Podemos Ajudar Hoje?',
      subtitle:
        'Escolha o canal que melhor se adapta às necessidades imediatas da sua empresa para atendimento instantâneo.',
      salesTitle: 'Falar com a Equipa Comercial',
      salesDesc:
        'Descubra como o MsmeBooks simplifica a sua contabilidade, vendas de balcão, stocks e operações diárias.',
      salesCta: 'Contactar Vendas',
      supportTitle: 'Obter Suporte ao Cliente',
      supportDesc:
        'Precisa de assistência com a sua conta, subscrição, integrações ou funcionalidades do software? O nosso suporte está aqui.',
      supportCta: 'Obter Suporte',
      partnersTitle: 'Tornar-se Parceiro MsmeBooks',
      partnersDesc:
        'Explore oportunidades excelentes para contabilistas, consultores de gestão, empresas de TI e revendedores de software.',
      partnersCta: 'Explorar Parcerias',
      demoTitle: 'Agendar Demonstração do Produto',
      demoDesc:
        'Veja na prática como o MsmeBooks controla as suas finanças, pontos de venda e inventário numa única plataforma.',
      demoCta: 'Agendar Demonstração',
    },
    direct: {
      badge: 'CONECTIVIDADE DIRETA',
      title: 'Contacte-Nos Diretamente Pelos Nossos Canais',
      subtitle:
        'As nossas equipas regionais estão disponíveis 24 horas por dia por telefone, e-mail, WhatsApp e chat ao vivo.',
      phoneTitle: 'Linhas Telefónicas Diretas',
      phoneDesc: 'Encaminhamento telefónico imediato para as mesas de apoio em Luanda, Joanesburgo e Lagos.',
      emailTitle: 'Consultas por E-mail',
      emailDesc: 'Caixa de entrada prioritária monitorizada por engenheiros de soluções empresariais dedicados.',
      whatsappTitle: 'WhatsApp Comercial',
      whatsappDesc: 'Comunicação rápida, envio de documentos e assistência instantânea na conta via WhatsApp.',
      hoursTitle: 'Horário de Atendimento',
      hoursDesc: 'Seg - Sex: 08:00 - 18:00 WAT · Suporte de piquete urgente 24/7 para clientes Enterprise',
      responseTime: 'Tempo médio de resposta inferior a 15 minutos em horário de funcionamento',
      chatWithSales: 'Iniciar Chat Instantâneo',
    },
    form: {
      badge: 'ENTRAR EM CONTACTO',
      title: 'Envie-Nos Uma Mensagem',
      subtitle:
        'Preencha o formulário abaixo e um especialista dedicado ao seu mercado responderá em menos de 15 minutos.',
      fullName: 'Nome Completo',
      fullNamePlaceholder: 'ex. Amara Okafor / Manuel Silva',
      workEmail: 'E-mail Profissional',
      workEmailPlaceholder: 'nome@empresa.com',
      companyName: 'Nome da Empresa',
      companyNamePlaceholder: 'ex. Atlântico Logística Lda',
      country: 'País / Mercado',
      phoneNumber: 'Número de Telefone',
      phonePlaceholder: 'Introduza o seu número de telefone',
      validPhone: 'Formato de telefone válido',
      invalidPhone: 'Número inválido para o país selecionado',
      businessType: 'Setor de Atividade / Indústria',
      enquiryType: 'Tipo de Pedido',
      subject: 'Assunto',
      subjectPlaceholder: 'Como podemos ajudar a sua empresa?',
      message: 'Mensagem',
      messagePlaceholder:
        'Conte-nos sobre o tamanho da sua equipa, necessidades do software ou requisitos específicos...',
      attachment: 'Anexo (Opcional)',
      attachmentDesc: 'Carregue cadernos de encargos, balancetes ou resumos de stock (PDF, DOCX, XLSX até 10 MB)',
      consent:
        'Autorizo o MsmeBooks a processar os meus dados para responder a esta consulta de negócios de acordo com as leis de privacidade (NDPR, POPIA, RGPD).',
      submit: 'Enviar Pedido Agora',
      submitting: 'A Encaminhar para o Balcão Regional...',
      successTitle: 'Pedido Enviado com Sucesso!',
      successSubtitle:
        'Obrigado pelo seu contacto com o MsmeBooks. O seu pedido foi registado com sucesso na nossa mesa regional.',
      successTicket: 'Referência do Bilhete: #MB-',
      sendAnother: 'Enviar Outra Mensagem',
      slaNotice: 'Garantia Rigorosa de SLA: Resposta em 15 Minutos',
      hubsTitle: 'Mesas Regionais Diretas',
    },
    presence: {
      badge: 'ALCANCE CONTINENTAL',
      title: 'Construído para África, Confiado em mais de 8 Mercados-Chave',
      subtitle:
        'De Luanda a Maputo, de Lagos a Nairóbi, o MsmeBooks capacita micro, pequenas e médias empresas com regras fiscais locais e operação multimoeda nativa.',
      activeBusinesses: 'Empresas Africanas Ativas',
      annualGmv: 'Volume Anual de Negócios (GMV)',
      uptime: 'Disponibilidade da Nuvem (Uptime)',
      taxRegimes: 'Regimes Fiscais Compatíveis',
      hubsTitle: 'Diretório de Polos Regionais',
      selectPrompt: 'Selecione um mercado abaixo para ver os polos regionais, regras de impostos e moeda local:',
      hubOffice: 'Polo Regional de Operações',
      currency: 'Moeda Operacional',
      taxCompliance: 'Conformidade Fiscal e Regulamentar',
      specialization: 'Foco Setorial Principal',
      contactLocalTeam: 'Contactar a Equipa Local',
    },
    partnerships: {
      badge: 'CRESCER JUNTOS',
      title: 'Soluções Empresariais e Parcerias Estratégicas',
      subtitle:
        'Escolha o nível de compromisso ideal para a sua empresa ou junte-se ao nosso ecossistema de parceiros pan-africanos.',
      enterpriseTitle: 'Empresas com Múltiplas Filiais e Grandes Contas',
      enterpriseDesc:
        'SLAs personalizados, isolamento de bases de dados, plano de contas à medida e relatórios consolidados em múltiplas moedas para grupos em expansão.',
      accountingTitle: 'Contabilistas e Consultores Financeiros',
      accountingDesc:
        'Aceda a um portal de múltiplos clientes dedicado, receba comissões de parceiro certificado e acelere auditorias em toda a África.',
      resellerTitle: 'Revendedores de Software e Empresas de TI',
      resellerDesc:
        'Ganhe margens recorrentes, usufrua de fundos partilhados de marketing e forneça equipamentos de POS e implementação no seu território.',
      learnMore: 'Conhecer Requisitos',
      applyPartner: 'Candidatar a Parceiro',
    },
    resources: {
      badge: 'AJUDA E ORIENTAÇÃO',
      title: 'Centro de Ajuda e Recursos de Conhecimento',
      subtitle:
        'Documentação abrangente, tutoriais em vídeo passo a passo e manuais técnicos para uma implementação sem atritos.',
      helpCenterTitle: 'Centro de Ajuda MsmeBooks',
      helpCenterDesc: 'Manuais detalhados sobre como configurar o plano de contas, reconciliação bancária e faturas fiscais.',
      knowledgeBaseTitle: 'Base de Conhecimento & FAQs',
      knowledgeBaseDesc: 'Encontre respostas imediatas a perguntas comuns sobre planos, utilizadores e faturas em moeda estrangeira.',
      apiDocsTitle: 'Documentação da API & Desenvolvedores',
      apiDocsDesc: 'Integre o MsmeBooks com a sua loja online, CRM, gateways de pagamento e sistemas ERP legados.',
      videoDemosTitle: 'Tutoriais em Vídeo Interativos',
      videoDemosDesc: 'Assista a demonstrações práticas sobre gestão de caixa POS, contagem de inventário e demonstrações financeiras.',
      accessResource: 'Aceder ao Recurso',
    },
    faq: {
      badge: 'RESPOSTAS CLARAS',
      title: 'Perguntas Frequentes (FAQs)',
      subtitle:
        'Tudo o que precisa de saber sobre o software MsmeBooks, configuração, preços e integrações regionais.',
      searchPlaceholder: 'Pesquisar perguntas, impostos locais, hardware de POS, moedas...',
      allCat: 'Todas as Perguntas',
      salesCat: 'Vendas & Preços',
      supportCat: 'Suporte Técnico',
      partnersCat: 'Parcerias',
      noResults: 'Nenhuma pergunta encontrada com o termo pesquisado. Tente outra palavra ou contacte o suporte.',
      stillQuestions: 'Ainda tem dúvidas ou necessidades específicas?',
      stillQuestionsDesc:
        'Os nossos especialistas em produtos e engenheiros de soluções regionais estão online para ajudar.',
      talkToSpecialist: 'Falar com um Especialista',
    },
    chat: {
      title: 'Suporte em Direto MsmeBooks',
      status: 'Online · Resposta média < 2 min',
      welcomeMsg:
        'Olá! Bem-vindo ao MsmeBooks. Como podemos ajudar o seu negócio hoje com o nosso suporte pan-africano?',
      inputPlaceholder: 'Escreva a sua mensagem ou questão aqui...',
      send: 'Enviar',
      quickPromptsTitle: 'Dúvidas Comuns:',
      prompt1: 'Quais são os vossos planos de preços e moedas?',
      prompt2: 'Com que rapidez posso ter uma demonstração?',
      prompt3: 'Têm suporte para faturação eletrónica e IVA local?',
      prompt4: 'Que impressoras e leitores de código de barras funcionam?',
      agentTyping: 'O agente está a escrever...',
      callDirect: 'Telefonar Diretamente',
    },
    demo: {
      title: 'Agendar Demonstração Personalizada do Produto',
      subtitle:
        'Descubra em tempo real como o MsmeBooks otimiza a sua contabilidade, controlo de armazém e pontos de venda.',
      fullName: 'Nome Completo',
      workEmail: 'E-mail Profissional',
      companyName: 'Nome da Empresa',
      country: 'País de Atuação',
      phone: 'Número de Telefone',
      businessSize: 'Dimensão da Empresa / Colaboradores',
      interestedModules: 'Módulos que Deseja Conhecer',
      preferredDate: 'Data de Preferência',
      preferredTime: 'Hora de Preferência (WAT / CAT)',
      notes: 'Requisitos Específicos ou Questões',
      notesPlaceholder: 'ex. Temos 2 lojas em Luanda e precisamos de inventário sincronizado e faturação certificada...',
      submit: 'Confirmar Demonstração',
      submitting: 'A Agendar Sessão...',
      successTitle: 'Demonstração Agendada com Sucesso!',
      successDesc:
        'Um e-mail de confirmação e um convite do Google Meet foram enviados para a sua caixa de entrada. Um especialista comercial irá personalizar a sua sessão.',
      close: 'Fechar Janela',
    },
    stories: {
      badge: 'CASOS DE SUCESSO',
      title: 'A Impulsionar Milhares de Empresas Africanas Todos os Dias',
      subtitle:
        'Descubra como empresários em Angola, Moçambique e além usam o MsmeBooks para eliminar quebras de stock, agilizar reconciliações e crescer.',
      allSectors: 'Todos os Setores',
      verifiedClient: 'Empresa Cliente Verificada',
      statShrinkage: 'Quebras Eliminadas',
      statHours: 'Horas Poupadas por Semana',
      statCompliance: 'Conformidade Fiscal 100%',
      readCaseStudy: 'Ver Estudo de Caso',
      bookSimilarDemo: 'Agendar Demonstração Setorial',
    },
    security: {
      badge: 'SEGURANÇA & CONFORMIDADE',
      title: 'Segurança de Nível Bancário para Empresas Pan-Africanas',
      subtitle:
        'A sua contabilidade, vendas no POS e dados de clientes são salvaguardados com as mais elevadas certificações internacionais e soberania de dados regional.',
      isoTitle: 'Certificado ISO/IEC 27001',
      isoDesc: 'Padrão de referência global para Gestão da Segurança da Informação (SGSI), auditado anualmente.',
      soc2Title: 'Certificado SOC 2 Tipo II',
      soc2Desc: 'Auditoria institucional independente validando Segurança, Alta Disponibilidade e Confidencialidade absoluta.',
      pciTitle: 'Conformidade PCI-DSS Nível 1',
      pciDesc: 'Nível máximo de segurança para pagamentos por cartão e terminais POS em lojas físicas.',
      dataPrivacyTitle: 'Conforme RGPD, NDPR & POPIA',
      dataPrivacyDesc: 'Respeito estrito pelas leis africanas e internacionais de proteção de dados pessoais sem partilhas indevidas.',
      encryptionTitle: 'Cifragem AES 256-Bit & TLS 1.3',
      encryptionDesc: 'Proteção criptográfica de padrão militar em todas as cópias de segurança na nuvem e caches offline locais.',
      taxComplianceTitle: 'Conformidade Fiscal Certificada',
      taxComplianceDesc: 'Alinhamento integral com normas fiscais regionais (AGT Angola, SARS, KRA e SYSCOHADA).',
      verifiedAudit: 'Padrão Institucional Verificado',
      viewCredentials: 'Ver Credenciais de Auditoria',
      closeModal: 'Fechar Detalhes de Segurança',
      guaranteeText: 'Todas as mensagens enviadas através do nosso portal são protegidas por cifragem TLS de 256 bits e estrita confidencialidade.',
      dataResidency: 'Alojamento Soberano em África (Lagos, Nairobi, Joanesburgo)',
      uptimeSla: 'SLA de Alta Disponibilidade de 99,98%',
    },
    footer: {
      bio: 'O MsmeBooks é uma plataforma em nuvem completa de Contabilidade, Ponto de Venda, Gestão de Stock e Gestão Empresarial, ajudando empresas a simplificar processos e crescer com segurança.',
      panAfricanOps: 'Operações Pan-Africanas',
      products: 'Produtos',
      company: 'Empresa',
      resources: 'Recursos',
      connect: 'Ligue-se Connosco',
      rights: 'Todos os direitos reservados. Feito para empresas africanas, pronto para o mundo.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
      brandingNotice: 'Cores da Marca: Azul Corporativo & Verde Limão',
    },
  },

  es: {
    nav: {
      bannerTitle: 'Nube Empresarial Panafricana',
      bannerSub: 'Contabilidad, Terminal Punto de Venta, Inventarios y Gestión en más de 8 Mercados Africanos',
      products: 'Productos',
      panAfrica: 'Pan-África',
      partnerships: 'Asociaciones',
      resources: 'Recursos',
      faqs: 'Preguntas Frecuentes',
      contact: 'Contacto',
      talkToSales: 'Hablar con Ventas',
      bookDemo: 'Reservar Demo Gratuita',
      contactTeam: 'Contactar a Nuestro Equipo',
      appearanceCurrency: 'Apariencia & Moneda',
      selectLanguage: 'Idioma',
      stories: 'Casos de Éxito',
      onlineStatus: 'En línea',
      offlineStatus: 'Modo Sin Conexión',
      offlineBadge: 'Resiliencia Local Activa',
      offlineNotice: 'Operando en modo sin conexión. Facturas, ventas en TPV y existencias se guardan localmente y se sincronizan al volver el internet.',
      offlineFeature1: 'Terminal Punto de Venta (POS) y recibos sin conexión',
      offlineFeature2: 'Consulta de catálogo de inventario en caché local',
      offlineFeature3: 'Sincronización automática en segundo plano en la nube',
      simulateOffline: 'Simular Modo Sin Conexión',
      restoreOnline: 'Restablecer Conexión',
      cloudSynced: 'Todos los datos sincronizados en la Nube',
      offlineActive: 'Caché Local Activo • Arquitectura Cero Pérdidas',
    },
    hero: {
      badge: 'ESTAMOS AQUÍ PARA AYUDAR',
      headline: 'Hablemos de Negocios. Estamos Aquí Para Ayudarle a Crecer.',
      subheadline:
        '¿Tiene preguntas sobre MsmeBooks? Ya sea que busque optimizar su Contabilidad, TPV / POS, Inventarios o Gestión Integral de Empresas, nuestro equipo especializado le acompañará hacia el éxito.',
      ctaContact: 'Contactar a Nuestro Equipo',
      ctaDemo: 'Reservar Demo Gratuita',
      quote:
        '«Impulsamos a las empresas africanas e internacionales a operar de forma más ágil, crecer más rápido y administrarlo todo en un solo lugar.»',
      quarterlyVolume: 'Volumen Trimestral Panafricano',
      leakageRecovered: 'Promedio Pérdidas Recuperadas',
      badgeResponse: 'Primera respuesta en < 15 minutos',
      badgeTax: 'Conformidad Tributaria Certificada',
      badgeSupport: 'Especialistas Dedicados Disponibles 24/7',
    },
    quick: {
      badge: 'ACCESO RÁPIDO',
      title: '¿Cómo Podemos Ayudarle Hoy?',
      subtitle:
        'Elija la opción que mejor se adapte a las necesidades prioritarias de su negocio para una atención inmediata.',
      salesTitle: 'Contactar al Equipo Comercial',
      salesDesc:
        'Descubra cómo MsmeBooks simplifica su facturación, cuadres de caja, existencias y operaciones empresariales cotidianas.',
      salesCta: 'Contactar Ventas',
      supportTitle: 'Recibir Soporte Técnico',
      supportDesc:
        '¿Necesita ayuda con su cuenta, suscripción, integraciones o funciones del sistema? Nuestro equipo técnico le atiende al instante.',
      supportCta: 'Obtener Soporte',
      partnersTitle: 'Conviértase en Socio de MsmeBooks',
      partnersDesc:
        'Explore extraordinarias oportunidades para contadores públicos, consultores de gestión, distribuidores de software e integradores TI.',
      partnersCta: 'Explorar Asociaciones',
      demoTitle: 'Programar una Demostración del Producto',
      demoDesc:
        'Vea en directo cómo MsmeBooks centraliza sus finanzas, puntos de venta y control de existencias en una plataforma única y robusta.',
      demoCta: 'Solicitar Demo',
    },
    direct: {
      badge: 'COMUNICACIÓN DIRECTA',
      title: 'Comuníquese Directamente por Nuestros Canales',
      subtitle:
        'Nuestros equipos regionales están a su disposición las 24 horas a través de teléfono, correo electrónico, WhatsApp y chat en vivo.',
      phoneTitle: 'Líneas Telefónicas Directas',
      phoneDesc: 'Enrutamiento telefónico inmediato a nuestras mesas en Lagos, Nairobi y Johannesburgo.',
      emailTitle: 'Consultas por Correo Electrónico',
      emailDesc: 'Bandeja de entrada prioritaria atendida por ingenieros de soluciones empresariales dedicados.',
      whatsappTitle: 'WhatsApp Comercial',
      whatsappDesc: 'Mensajería ágil, intercambio de documentación y asistencia inmediata para su cuenta en WhatsApp.',
      hoursTitle: 'Horario de Atención',
      hoursDesc: 'Lun - Vie: 08:00 - 18:00 WAT · Soporte urgente 24/7 para clientes con plan Enterprise',
      responseTime: 'Tiempo de respuesta promedio inferior a 15 minutos en horario comercial',
      chatWithSales: 'Iniciar Chat Inmediato',
    },
    form: {
      badge: 'CONTÁCTENOS',
      title: 'Envíenos un Mensaje',
      subtitle:
        'Complete el siguiente formulario y un especialista asignado a su región le responderá en un plazo máximo de 15 minutos.',
      fullName: 'Nombre Completo',
      fullNamePlaceholder: 'ej. Amara Okafor / Carlos Méndez',
      workEmail: 'Correo Electrónico Corporativo',
      workEmailPlaceholder: 'nombre@empresa.com',
      companyName: 'Nombre de la Empresa',
      companyNamePlaceholder: 'ej. Atlas Logística S.A.',
      country: 'País / Mercado',
      phoneNumber: 'Número de Teléfono',
      phonePlaceholder: 'Introduzca su número telefónico',
      validPhone: 'Formato telefónico válido',
      invalidPhone: 'Número no válido para el país seleccionado',
      businessType: 'Sector Empresarial / Industria',
      enquiryType: 'Tipo de Consulta',
      subject: 'Asunto',
      subjectPlaceholder: '¿En qué podemos colaborar con su empresa?',
      message: 'Mensaje',
      messagePlaceholder:
        'Indíquenos el tamaño de su equipo, sus requerimientos de software o cualquier necesidad específica...',
      attachment: 'Archivo Adjunto (Opcional)',
      attachmentDesc: 'Suba especificaciones, pliegos técnicos o resúmenes de balance (PDF, DOCX, XLSX hasta 10 MB)',
      consent:
        'Acepto que MsmeBooks trate mis datos para responder a esta consulta corporativa de acuerdo con las normativas de protección de datos (NDPR, POPIA, RGPD).',
      submit: 'Enviar Consulta Ahora',
      submitting: 'Enviando a la Mesa Regional...',
      successTitle: '¡Consulta Enviada con Éxito!',
      successSubtitle:
        'Gracias por contactar a MsmeBooks. Su solicitud ha sido asignada a nuestro equipo regional con un número de ticket.',
      successTicket: 'Referencia del Ticket: #MB-',
      sendAnother: 'Enviar Otro Mensaje',
      slaNotice: 'Garantía Estricta de SLA: Respuesta en 15 Minutos',
      hubsTitle: 'Mesas Regionales Directas',
    },
    presence: {
      badge: 'PRESENCIA CONTINENTAL',
      title: 'Diseñado para África, Consolidado en más de 8 Mercados Clave',
      subtitle:
        'De Lagos a Malabo, de Nairobi a Johannesburgo y El Cairo, MsmeBooks impulsa a pequeñas, medianas y grandes empresas con facturación y fiscalidad localizada multimoneda.',
      activeBusinesses: 'Empresas Activas en África',
      annualGmv: 'Volumen Anual Transaccionado (GMV)',
      uptime: 'Disponibilidad de la Plataforma Cloud',
      taxRegimes: 'Regímenes Fiscales Certificados',
      hubsTitle: 'Directorio de Sedes Regionales',
      selectPrompt: 'Seleccione un mercado a continuación para consultar sedes locales, normativas fiscales y monedas:',
      hubOffice: 'Sede Regional de Operaciones',
      currency: 'Moneda Oficial de Operación',
      taxCompliance: 'Cumplimiento Fiscal y Normativo',
      specialization: 'Especialidad Industrial Principal',
      contactLocalTeam: 'Contactar al Equipo Local',
    },
    partnerships: {
      badge: 'CREZCAMOS JUNTOS',
      title: 'Soluciones Corporativas y Alianzas Estratégicas',
      subtitle:
        'Elija el modelo de colaboración adecuado para su empresa o forme parte de nuestra red de socios panafricana e internacional.',
      enterpriseTitle: 'Empresas Multisede y Grandes Cuentas',
      enterpriseDesc:
        'SLA garantizados, bases de datos aisladas, catálogo contable a medida e informes consolidados multidivisa para grupos empresariales en expansión.',
      accountingTitle: 'Contadores Públicos y Asesores Financieros',
      accountingDesc:
        'Acceda a un portal exclusivo para gestionar múltiples clientes, gane comisiones certificadas y acelere las auditorías fiscales en toda África.',
      resellerTitle: 'Distribuidores de Canal e Integradores TI',
      resellerDesc:
        'Obtenga atractivos márgenes recurrentes, fondos compartidos de mercadotecnia y suministre terminales TPV y servicios de implementación en su zona.',
      learnMore: 'Conocer Requisitos',
      applyPartner: 'Solicitar Afiliación',
    },
    resources: {
      badge: 'SOPORTE Y GUÍAS',
      title: 'Centro de Ayuda y Recursos de Aprendizaje',
      subtitle:
        'Manuales completos, tutoriales en vídeo paso a paso y guías de integración técnica para una adopción rápida y sin complicaciones.',
      helpCenterTitle: 'Centro de Ayuda MsmeBooks',
      helpCenterDesc: 'Manuales exhaustivos sobre configuración de planes de cuentas, conciliaciones bancarias y declaraciones tributarias automáticas.',
      knowledgeBaseTitle: 'Base de Conocimientos y Preguntas',
      knowledgeBaseDesc: 'Encuentre respuestas inmediatas sobre planes, gestión de usuarios, permisos y operaciones multimoneda.',
      apiDocsTitle: 'Documentación API para Desarrolladores',
      apiDocsDesc: 'Conecte MsmeBooks con tiendas de comercio electrónico, CRM, pasarelas de pago locales y sistemas ERP corporativos.',
      videoDemosTitle: 'Tutoriales en Vídeo Interactivos',
      videoDemosDesc: 'Observe clases maestras prácticas sobre ventas de mostrador POS, recuentos de inventario y balances financieros.',
      accessResource: 'Acceder al Recurso',
    },
    faq: {
      badge: 'RESPUESTAS CLARAS',
      title: 'Preguntas Frecuentes',
      subtitle:
        'Todo lo que necesita saber acerca del software MsmeBooks, puesta en marcha, planes y compatibilidad regional.',
      searchPlaceholder: 'Buscar preguntas, normas tributarias, terminales TPV, divisas...',
      allCat: 'Todas las Preguntas',
      salesCat: 'Ventas y Precios',
      supportCat: 'Soporte Técnico',
      partnersCat: 'Asociaciones',
      noResults: 'No se encontraron preguntas con el término de búsqueda. Intente con otra palabra o consulte a nuestro equipo.',
      stillQuestions: '¿Tiene dudas adicionales o requerimientos específicos?',
      stillQuestionsDesc:
        'Nuestros consultores de producto e ingenieros de soluciones comerciales están disponibles en este momento para asesorarle.',
      talkToSpecialist: 'Hablar con un Especialista',
    },
    chat: {
      title: 'Soporte en Vivo MsmeBooks',
      status: 'En línea · Respuesta media < 2 min',
      welcomeMsg:
        '¡Hola! Le damos la bienvenida a MsmeBooks. ¿En qué puede nuestro equipo panafricano orientar a su empresa hoy?',
      inputPlaceholder: 'Escriba aquí su mensaje o consulta...',
      send: 'Enviar',
      quickPromptsTitle: 'Consultas habituales:',
      prompt1: '¿Cuáles son sus planes de precios y monedas soportadas?',
      prompt2: '¿Con qué rapidez puedo tener una demo personalizada?',
      prompt3: '¿Tienen soporte para IVA local y facturación electrónica?',
      prompt4: '¿Qué lectores de códigos de barras e impresoras son compatibles?',
      agentTyping: 'El agente está escribiendo...',
      callDirect: 'Llamar Directamente',
    },
    demo: {
      title: 'Programar una Demostración Personalizada',
      subtitle:
        'Compruebe en tiempo real cómo MsmeBooks agiliza su contabilidad, inventarios y puntos de venta.',
      fullName: 'Nombre Completo',
      workEmail: 'Correo Corporativo',
      companyName: 'Nombre de la Empresa',
      country: 'País de Operación',
      phone: 'Número Telefónico',
      businessSize: 'Tamaño de la Empresa / Empleados',
      interestedModules: 'Módulos que Desea Explorar',
      preferredDate: 'Fecha Preferida',
      preferredTime: 'Hora Preferida (WAT / GMT / CAT)',
      notes: 'Requerimientos Específicos o Comentarios',
      notesPlaceholder: 'ej. Gestionamos 3 sucursales comerciales y requerimos sincronización de existencias y cobros móviles...',
      submit: 'Confirmar Solicitud de Demo',
      submitting: 'Programando Cita...',
      successTitle: '¡Demostración Programada con Éxito!',
      successDesc:
        'Hemos enviado una confirmación a su correo electrónico con el enlace de Google Meet. Un consultor comercial preparará una sesión a su medida.',
      close: 'Cerrar Ventana',
    },
    stories: {
      badge: 'CASOS DE ÉXITO DE CLIENTES',
      title: 'Impulsando a Miles de Empresas Africanas e Internacionales Cada Día',
      subtitle:
        'Conozca cómo líderes empresariales en Nigeria, Kenia, Ghana y Guinea Ecuatorial utilizan MsmeBooks para eliminar pérdidas de inventario y acelerar su gestión.',
      allSectors: 'Todos los Sectores',
      verifiedClient: 'Empresa Cliente Verificada',
      statShrinkage: 'Pérdidas Eliminadas',
      statHours: 'Horas Ahorradas Semanalmente',
      statCompliance: 'Auditoría Fiscal 100% Lista',
      readCaseStudy: 'Ver Caso de Estudio',
      bookSimilarDemo: 'Reservar Demo para su Sector',
    },
    security: {
      badge: 'SEGURIDAD & CUMPLIMIENTO',
      title: 'Seguridad de Grado Bancario para Empresas Panafricanas',
      subtitle:
        'Su contabilidad corporativa, cobros en TPV y registros de clientes están resguardados con estándares de seguridad internacionales y soberanía regional de datos.',
      isoTitle: 'Certificado ISO/IEC 27001',
      isoDesc: 'Estándar global para Sistemas de Gestión de Seguridad de la Información (SGSI), auditado anualmente.',
      soc2Title: 'Certificado SOC 2 Tipo II',
      soc2Desc: 'Auditoría institucional independiente que garantiza Seguridad, Alta Disponibilidad y Confidencialidad continua.',
      pciTitle: 'Cumplimiento PCI-DSS Nivel 1',
      pciDesc: 'Máximo nivel de protección para procesamiento de tarjetas de pago en terminales de punto de venta (TPV).',
      dataPrivacyTitle: 'Cumplimiento RGPD, NDPR & POPIA',
      dataPrivacyDesc: 'Apego estricto a las regulaciones de protección de datos personales africanas e internacionales sin cesión a terceros.',
      encryptionTitle: 'Cifrado 256-Bit AES & TLS 1.3',
      encryptionDesc: 'Protección criptográfica de grado militar en todas las copias de seguridad en la nube y cachés sin conexión.',
      taxComplianceTitle: 'Cumplimiento Fiscal Homologado',
      taxComplianceDesc: 'Conformidad directa con autoridades fiscales (KRA, FIRS, SARS, OTR y normativas SYSCOHADA).',
      verifiedAudit: 'Estándar Institucional Verificado',
      viewCredentials: 'Ver Credenciales de Auditoría',
      closeModal: 'Cerrar Detalles de Seguridad',
      guaranteeText: 'Todas las consultas tramitadas a través de nuestra plataforma cuentan con cifrado TLS de 256 bits y acuerdos estrictos de privacidad.',
      dataResidency: 'Alojamiento Soberano en África (Lagos, Nairobi, Johannesburgo)',
      uptimeSla: 'SLA de Alta Disponibilidad en la Nube del 99,98%',
    },
    footer: {
      bio: 'MsmeBooks es una plataforma en la nube integral de Contabilidad, Punto de Venta (TPV), Inventarios y Gestión Empresarial diseñada para simplificar las operaciones y acelerar el crecimiento con total confianza.',
      panAfricanOps: 'Operaciones Panafricanas',
      products: 'Productos',
      company: 'Empresa',
      resources: 'Recursos',
      connect: 'Conéctese con Nosotros',
      rights: 'Todos los derechos reservados. Diseñado para las empresas africanas, preparado para el crecimiento global.',
      privacy: 'Política de Privacidad',
      terms: 'Términos del Servicio',
      brandingNotice: 'Identidad de Marca: Azul Corporativo & Verde Limón',
    },
  },
};
