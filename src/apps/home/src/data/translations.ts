import { LanguageCode } from '../types';

export interface TranslationDictionary {
  nav: {
    products: string;
    solutions: string;
    features: string;
    industries: string;
    multiBranch: string;
    resources: string;
    pricing: string;
    aiAssistant: string;
    signIn: string;
    requestDemo: string;
    startFree: string;
    startFreeTrial: string;
    requestDemo1on1: string;
    signInAccount: string;
    allInOneModules: string;
    builtForAfrica: string;
    tailoredByType: string;
    selectLanguage: string;
    selectCurrency: string;
    connectionMode: string;
    theme: string;
    online: string;
    offline: string;
    tagline: string;
    aiPowered: string;
    live: string;
  };
  products: {
    accounting: { title: string; desc: string };
    invoicing: { title: string; desc: string };
    pos: { title: string; desc: string };
    inventory: { title: string; desc: string };
    crm: { title: string; desc: string };
    expenses: { title: string; desc: string };
    banking: { title: string; desc: string };
    payroll: { title: string; desc: string };
    tax: { title: string; desc: string };
    reports: { title: string; desc: string };
    bi: { title: string; desc: string };
    ai: { title: string; desc: string };
  };
  solutions: {
    micro: { title: string; desc: string };
    growing: { title: string; desc: string };
    multibranch: { title: string; desc: string };
    retail: { title: string; desc: string };
    restaurants: { title: string; desc: string };
    hotels: { title: string; desc: string };
    realEstate: { title: string; desc: string };
    services: { title: string; desc: string };
    accountingFirms: { title: string; desc: string };
    wholesale: { title: string; desc: string };
    ecommerce: { title: string; desc: string };
  };
  hero: {
    badge: string;
    year: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaStart: string;
    ctaDemo: string;
    ctaTour: string;
    trustedBy: string;
    pillOffline: string;
    pillCurrency: string;
    pillBank: string;
    pillWhatsApp: string;
    totalRevenue: string;
    operatingExpenses: string;
    netProfit: string;
    newCustomers: string;
    lowStockAlert: string;
    itemsNeedReorder: string;
    vsLastMonth: string;
    margin: string;
  };
  trust: {
    headline: string;
    activeMsmes: string;
    tradeVolume: string;
    offlineSync: string;
    taxAccuracy: string;
  };
  chat: {
    launcherTooltip: string;
    badgeOnline: string;
    headerTitle: string;
    headerSubtitle: string;
    tabChat: string;
    tabWhatsapp: string;
    tabCallback: string;
    welcomeMsg: string;
  };
  cta: {
    title: string;
    subtitle: string;
    startTrialBtn: string;
    requestDemoBtn: string;
    guarantee: string;
  };
  footer: {
    tagline: string;
    rights: string;
    builtWithLove: string;
    selectLang: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    nav: {
      products: 'Products',
      solutions: 'Solutions',
      features: 'Features',
      industries: 'Industries',
      multiBranch: 'Multi-Branch',
      resources: 'Resources',
      pricing: 'Pricing',
      aiAssistant: 'AI Business Assistant',
      signIn: 'Sign In',
      requestDemo: 'Request Demo',
      startFree: 'Start Free',
      startFreeTrial: 'Start Free Trial (14 Days)',
      requestDemo1on1: 'Request a 1-on-1 Demo',
      signInAccount: 'Sign In to Account',
      allInOneModules: 'All-in-One Modules',
      builtForAfrica: 'Built for African MSMEs',
      tailoredByType: 'Tailored by African Business Type',
      selectLanguage: 'Select Language',
      selectCurrency: 'Select Currency',
      connectionMode: 'Connection Mode',
      theme: 'Theme',
      online: 'Online',
      offline: 'Offline',
      tagline: 'Africa',
      aiPowered: 'AI Powered',
      live: 'Live',
    },
    products: {
      accounting: {
        title: 'Accounting',
        desc: 'Real-time P&L, balance sheets & general ledger',
      },
      invoicing: {
        title: 'Invoicing',
        desc: 'Multi-currency digital invoices with payment links',
      },
      pos: {
        title: 'POS Checkout',
        desc: 'Fast retail sales with offline sync & receipts',
      },
      inventory: {
        title: 'Inventory Management',
        desc: 'Multi-warehouse stock tracking & re-orders',
      },
      crm: {
        title: 'Customers & CRM',
        desc: 'Track customer balances, statements & loyalty',
      },
      expenses: {
        title: 'Expenses & Petty Cash',
        desc: 'OCR receipt capture & approval workflows',
      },
      banking: {
        title: 'Banking & Feeds',
        desc: 'Direct sync with 25+ top African commercial banks',
      },
      payroll: {
        title: 'HR & Payroll',
        desc: 'Automate PAYE, Pension, NHF & staff payslips',
      },
      tax: {
        title: 'Tax & Compliance',
        desc: 'FIRS, KRA, GRA automated filing preparation',
      },
      reports: {
        title: 'Business Reports',
        desc: '60+ automated financial and operational reports',
      },
      bi: {
        title: 'Business Intelligence',
        desc: 'Predictive analytics & profit trends',
      },
      ai: {
        title: 'AI Business Assistant',
        desc: 'Natural language answers about your numbers',
      },
    },
    solutions: {
      micro: {
        title: 'Small & Micro Businesses',
        desc: 'Affordable, easy bookkeeping from day one',
      },
      growing: {
        title: 'Growing Businesses',
        desc: 'Multi-user roles, payroll and supplier controls',
      },
      multibranch: {
        title: 'Multi-Branch Businesses',
        desc: 'Centrally manage up to 50+ retail outlets',
      },
      retail: {
        title: 'Retail Stores',
        desc: 'Barcode scanning, cashier drawers & stock sync',
      },
      restaurants: {
        title: 'Restaurants & Bars',
        desc: 'Kitchen tickets, menu costing & table billing',
      },
      hotels: {
        title: 'Hotels & Hospitality',
        desc: 'Room booking folios & guest payments',
      },
      realEstate: {
        title: 'Real Estate',
        desc: 'Tenant billing, lease tracking & maintenance',
      },
      services: {
        title: 'Professional Services',
        desc: 'Retainers, milestones & project costing',
      },
      accountingFirms: {
        title: 'Accounting Firms',
        desc: 'One unified portal to manage 50+ client books',
      },
      wholesale: {
        title: 'Distributors & Wholesale',
        desc: 'Inter-warehouse transfers & credit limits',
      },
      ecommerce: {
        title: 'E-commerce Businesses',
        desc: 'Online storefront synced with warehouse stock',
      },
    },
    hero: {
      badge: 'The Smarter Way to Manage Your Business',
      year: 'Africa 2026',
      title1: 'Run Your Business Smarter.',
      title2: 'Grow With Confidence.',
      subtitle:
        'MsmeBooks brings accounting, invoicing, inventory, sales, expenses, POS, customers, employees, reporting and business operations together in one intelligent platform built for African businesses.',
      ctaStart: 'Start Free Trial',
      ctaDemo: 'Book a Live Demo',
      ctaTour: 'Watch 2-Min Tour',
      trustedBy: 'Trusted by 18,000+ businesses across Africa',
      pillOffline: 'Offline-First POS',
      pillCurrency: 'Multi-Currency & VAT',
      pillBank: 'Direct Bank Feeds',
      pillWhatsApp: 'WhatsApp Invoicing',
      totalRevenue: 'Total Revenue',
      operatingExpenses: 'Operating Expenses',
      netProfit: 'Net Profit',
      newCustomers: 'New Customers',
      lowStockAlert: 'Low Stock Alert',
      itemsNeedReorder: 'items need reorder',
      vsLastMonth: 'vs last period',
      margin: 'Net margin',
    },
    trust: {
      headline: 'Trusted by 18,000+ businesses across 14 African nations',
      activeMsmes: 'Active MSMEs',
      tradeVolume: 'Trade Volume Recorded',
      offlineSync: 'Offline Transactions Synced',
      taxAccuracy: 'Tax Compliance Accuracy',
    },
    chat: {
      launcherTooltip: 'Need help? Chat with African Support',
      badgeOnline: 'Online Support',
      headerTitle: 'Live Help & Support',
      headerSubtitle: 'We typically reply in under 3 minutes',
      tabChat: 'Live Chat',
      tabWhatsapp: 'WhatsApp',
      tabCallback: 'Request Callback',
      welcomeMsg: 'Hello! Welcome to MsmeBooks Africa support. How can we assist your business today?',
    },
    cta: {
      title: 'Ready to transform your business finances?',
      subtitle: 'Join thousands of African entrepreneurs growing with MsmeBooks today.',
      startTrialBtn: 'Start 14-Day Free Trial',
      requestDemoBtn: 'Schedule Personalized Demo',
      guarantee: 'No credit card required • Cancel anytime • 100% Offline-ready',
    },
    footer: {
      tagline: 'Empowering African commerce with intelligent bookkeeping and multi-branch POS.',
      rights: 'All rights reserved.',
      builtWithLove: 'Proudly built for African commerce',
      selectLang: 'Language',
    },
  },

  fr: {
    nav: {
      products: 'Produits',
      solutions: 'Solutions',
      features: 'Fonctionnalités',
      industries: 'Secteurs',
      multiBranch: 'Multi-Succursales',
      resources: 'Ressources',
      pricing: 'Tarifs',
      aiAssistant: 'Assistant IA Entreprise',
      signIn: 'Connexion',
      requestDemo: 'Demander une démo',
      startFree: 'Essai Gratuit',
      startFreeTrial: 'Essai gratuit (14 jours)',
      requestDemo1on1: 'Demander une démo personnalisée',
      signInAccount: 'Se connecter au compte',
      allInOneModules: 'Modules Tout-en-Un',
      builtForAfrica: 'Conçu pour les PME Africaines',
      tailoredByType: 'Adapté selon le type d’entreprise',
      selectLanguage: 'Choisir la langue',
      selectCurrency: 'Choisir la devise',
      connectionMode: 'Mode de connexion',
      theme: 'Thème',
      online: 'En ligne',
      offline: 'Hors ligne',
      tagline: 'Afrique',
      aiPowered: 'Propulsé par IA',
      live: 'Actif',
    },
    products: {
      accounting: {
        title: 'Comptabilité',
        desc: 'Compte de résultat, bilans et grand livre en temps réel',
      },
      invoicing: {
        title: 'Facturation',
        desc: 'Factures numériques multidevises avec liens de paiement',
      },
      pos: {
        title: 'Caisse & POS',
        desc: 'Ventes rapides au détail avec synchronisation hors-ligne',
      },
      inventory: {
        title: 'Gestion des Stocks',
        desc: 'Suivi multi-entrepôts et réapprovisionnements automatiques',
      },
      crm: {
        title: 'Clients & CRM',
        desc: 'Soldes clients, relevés de compte et fidélité',
      },
      expenses: {
        title: 'Dépenses & Petite Caisse',
        desc: 'Reconnaissance OCR des reçus et circuits de validation',
      },
      banking: {
        title: 'Banques & Flux Directs',
        desc: 'Synchronisation directe avec +25 banques africaines',
      },
      payroll: {
        title: 'RH & Paie',
        desc: 'Automatisation des cotisations, impôts et fiches de paie',
      },
      tax: {
        title: 'Fiscalité & Conformité',
        desc: 'Préparation automatisée pour les déclarations fiscales',
      },
      reports: {
        title: 'Rapports Financiers',
        desc: '+60 rapports financiers et opérationnels automatisés',
      },
      bi: {
        title: 'Intelligence d’Affaires',
        desc: 'Analyses prédictives et tendances de rentabilité',
      },
      ai: {
        title: 'Assistant IA Entreprise',
        desc: 'Réponses instantanées en langage naturel sur vos chiffres',
      },
    },
    solutions: {
      micro: {
        title: 'Micro & Petites Entreprises',
        desc: 'Comptabilité simple et accessible dès le premier jour',
      },
      growing: {
        title: 'PME en Croissance',
        desc: 'Rôles multi-utilisateurs, gestion paie et fournisseurs',
      },
      multibranch: {
        title: 'Entreprises Multi-Succursales',
        desc: 'Gérez centralement jusqu’à 50+ points de vente',
      },
      retail: {
        title: 'Commerces de Détail',
        desc: 'Lecteur code-barres, tiroir-caisse et stock synchronisé',
      },
      restaurants: {
        title: 'Restaurants & Bars',
        desc: 'Bons de commande cuisine, coût de revient et tables',
      },
      hotels: {
        title: 'Hôtellerie & Hébergement',
        desc: 'Folio de réservations et gestion des paiements clients',
      },
      realEstate: {
        title: 'Gestion Immobilière',
        desc: 'Facturation locataires, baux et suivi des charges',
      },
      services: {
        title: 'Services Professionnels',
        desc: 'Honoraires, jalons et gestion des coûts de projet',
      },
      accountingFirms: {
        title: 'Cabinets Comptables',
        desc: 'Portail unique pour gérer les comptes de 50+ clients',
      },
      wholesale: {
        title: 'Distributeurs & Grossistes',
        desc: 'Transferts inter-dépôts et gestion des limites de crédit',
      },
      ecommerce: {
        title: 'Boutiques E-commerce',
        desc: 'Vente en ligne connectée au stock physique des magasins',
      },
    },
    hero: {
      badge: 'La Méthode Intelligente Pour Gérer Votre Entreprise',
      year: 'Afrique 2026',
      title1: 'Pilotez Votre Entreprise Mieux.',
      title2: 'Croissez Avec Sérénité.',
      subtitle:
        'MsmeBooks regroupe la comptabilité, la facturation, les stocks, les ventes, les dépenses, le POS, les clients, les employés et le reporting dans une seule plateforme intelligente conçue pour les entreprises africaines.',
      ctaStart: 'Démarrer l’Essai Gratuit',
      ctaDemo: 'Réserver une Démo en Direct',
      ctaTour: 'Visite Vidéo (2 min)',
      trustedBy: 'Plébiscité par +18 000 entreprises à travers l’Afrique',
      pillOffline: 'POS Fonctionnant Hors-Ligne',
      pillCurrency: 'Multidevise & TVA Régionale',
      pillBank: 'Flux Bancaires Directs',
      pillWhatsApp: 'Facturation via WhatsApp',
      totalRevenue: 'Chiffre d’Affaires Total',
      operatingExpenses: 'Dépenses d’Exploitation',
      netProfit: 'Bénéfice Net',
      newCustomers: 'Nouveaux Clients',
      lowStockAlert: 'Alerte Stock Bas',
      itemsNeedReorder: 'articles à commander',
      vsLastMonth: 'vs période précédente',
      margin: 'Marge nette',
    },
    trust: {
      headline: 'Plébiscité par 18 000+ entreprises dans 14 pays africains',
      activeMsmes: 'PME Actives',
      tradeVolume: 'Volume de Transactions',
      offlineSync: 'Transactions Hors-Ligne',
      taxAccuracy: 'Précision de Conformité Fiscale',
    },
    chat: {
      launcherTooltip: 'Besoin d’aide ? Échangez avec le support africain',
      badgeOnline: 'Support en Ligne',
      headerTitle: 'Aide & Assistance en Direct',
      headerSubtitle: 'Nous répondons généralement en moins de 3 minutes',
      tabChat: 'Chat en Direct',
      tabWhatsapp: 'WhatsApp',
      tabCallback: 'Demander un Rappel',
      welcomeMsg: 'Bonjour ! Bienvenue au support MsmeBooks Afrique. Comment pouvons-nous aider votre entreprise aujourd’hui ?',
    },
    cta: {
      title: 'Prêt à transformer les finances de votre entreprise ?',
      subtitle: 'Rejoignez des milliers d’entrepreneurs africains qui grandissent avec MsmeBooks.',
      startTrialBtn: 'Démarrer l’Essai Gratuit de 14 Jours',
      requestDemoBtn: 'Planifier une Démo Personnalisée',
      guarantee: 'Sans carte bancaire • Annulation à tout moment • 100% Fonctionnel hors-ligne',
    },
    footer: {
      tagline: 'Renforcer le commerce africain avec une comptabilité intelligente et un POS multi-succursales.',
      rights: 'Tous droits réservés.',
      builtWithLove: 'Fait avec fierté pour le commerce africain',
      selectLang: 'Langue',
    },
  },

  sw: {
    nav: {
      products: 'Bidhaa',
      solutions: 'Suluhisho',
      features: 'Vipengele',
      industries: 'Viwanda',
      multiBranch: 'Matawi Mengi',
      resources: 'Nyenzo',
      pricing: 'Bei',
      aiAssistant: 'Msaidizi wa Biashara wa AI',
      signIn: 'Ingia',
      requestDemo: 'Omba Onyesho',
      startFree: 'Anza Bure',
      startFreeTrial: 'Jaribio la Bure (Siku 14)',
      requestDemo1on1: 'Omba Onyesho la Ana kwa Ana',
      signInAccount: 'Ingia kwenye Akaunti',
      allInOneModules: 'Moduli Zote kwa Moja',
      builtForAfrica: 'Imeundwa kwa Biashara za Afrika',
      tailoredByType: 'Imebadilishwa kulingana na Aina ya Biashara',
      selectLanguage: 'Chagua Lugha',
      selectCurrency: 'Chagua Sarafu',
      connectionMode: 'Hali ya Muunganisho',
      theme: 'Mandhari',
      online: 'Mtandaoni',
      offline: 'Nje ya Mtandao',
      tagline: 'Afrika',
      aiPowered: 'Inayoendeshwa na AI',
      live: 'Inafanya Kazi',
    },
    products: {
      accounting: {
        title: 'Uhasibu',
        desc: 'Ripoti ya Faida na Hasara, mizania na daftari kuu kwa wakati halisi',
      },
      invoicing: {
        title: 'Ankara (Invoicing)',
        desc: 'Ankara za kidijitali za sarafu nyingi zenye viungo vya malipo',
      },
      pos: {
        title: 'Mauzo ya Rejareja (POS)',
        desc: 'Mauzo ya haraka yenye usawazishaji wa nje ya mtandao na risiti',
      },
      inventory: {
        title: 'Usimamizi wa Ghala',
        desc: 'Ufuatiliaji wa maghala mengi na maagizo ya bidhaa mpya',
      },
      crm: {
        title: 'Wateja & CRM',
        desc: 'Fuatilia salio za wateja, taarifa za hesabu na uaminifu',
      },
      expenses: {
        title: 'Gharama & Fedha Ndogo',
        desc: 'Nasa risiti kwa kamera (OCR) na idhinisha matumizi kwa urahisi',
      },
      banking: {
        title: 'Benki & Mlisho wa Moja kwa Moja',
        desc: 'Unganisha moja kwa moja na benki 25+ maarufu za kibiashara za Afrika',
      },
      payroll: {
        title: 'Wafanyakazi & Mishahara',
        desc: 'Otomatisha PAYE, NSSF, NHIF na hati za malipo ya wafanyakazi',
      },
      tax: {
        title: 'Kodi & Uzingatiaji',
        desc: 'Maandalizi ya kiotomatiki ya uwasilishaji wa KRA, TRA, URA na GRA',
      },
      reports: {
        title: 'Ripoti za Biashara',
        desc: 'Ripoti 60+ za kifedha na uendeshaji zinazozalishwa kiotomatiki',
      },
      bi: {
        title: 'Uchanganuzi wa Biashara',
        desc: 'Utabiri wa takwimu na mwenendo wa ongezeko la faida',
      },
      ai: {
        title: 'Msaidizi wa Biashara wa AI',
        desc: 'Majibu ya lugha asilia papo hapo kuhusu nambari na hesabu zako',
      },
    },
    solutions: {
      micro: {
        title: 'Biashara Ndogo na Ndogondogo',
        desc: 'Uwekaji hesabu rahisi na nafuu tangu siku ya kwanza',
      },
      growing: {
        title: 'Biashara Zinazopanuka',
        desc: 'Wajibu wa watumiaji wengi, mishahara na udhibiti wa wauzaji',
      },
      multibranch: {
        title: 'Biashara Zenye Matawi Mengi',
        desc: 'Simamia maduka hadi 50+ kwa urahisi kutoka sehemu moja kuu',
      },
      retail: {
        title: 'Maduka ya Rejareja',
        desc: 'Mashine za kusoma barcode, droo ya fedha na usawazishaji bidhaa',
      },
      restaurants: {
        title: 'Mikahawa na Baa',
        desc: 'Tiketi za jikoni, gharama za menyu na malipo ya meza',
      },
      hotels: {
        title: 'Hoteli & Ukarimu',
        desc: 'Kadi za vyumba na usimamizi wa malipo ya wageni',
      },
      realEstate: {
        title: 'Majengo & Mali Isiyohamishika',
        desc: 'Ankara za wapangaji, mikataba na ufuatiliaji wa matengenezo',
      },
      services: {
        title: 'Huduma za Kitaalamu',
        desc: 'Gharama za mikataba, hatua za miradi na ankara za muda',
      },
      accountingFirms: {
        title: 'Kampuni za Uhasibu',
        desc: 'Mlango mmoja wa kusimamia vitabu vya wateja 50+ kwa wakati mmoja',
      },
      wholesale: {
        title: 'Wasambazaji & Wauzaji wa Jumla',
        desc: 'Uhamisho wa bidhaa kati ya maghala na ukomo wa mikopo',
      },
      ecommerce: {
        title: 'Biashara za Mtandaoni',
        desc: 'Duka la mtandaoni lililounganishwa na ghala halisi la bidhaa',
      },
    },
    hero: {
      badge: 'Njia Bora Zaidi ya Kusimamia Biashara Yako',
      year: 'Afrika 2026',
      title1: 'Endesha Biashara kwa Uwerevu.',
      title2: 'Kua kwa Ujasiri na Uhakika.',
      subtitle:
        'MsmeBooks huleta uhasibu, ankara, orodha ya bidhaa, mauzo, gharama, POS, wateja, wafanyakazi, ripoti na uendeshaji wa biashara pamoja kwenye jukwaa moja mahiri lililojengwa kwa biashara za Kiafrika.',
      ctaStart: 'Anza Jaribio la Bure',
      ctaDemo: 'Weka Onyesho la Moja kwa Moja',
      ctaTour: 'Tazama Ziara (Dak 2)',
      trustedBy: 'Inaaminiwa na biashara 18,000+ kote barani Afrika',
      pillOffline: 'POS Inayofanya Kazi Nje ya Mtandao',
      pillCurrency: 'Sarafu Nyingi na VAT',
      pillBank: 'Mlisho wa Moja kwa Moja wa Benki',
      pillWhatsApp: 'Ankara Kupitia WhatsApp',
      totalRevenue: 'Jumla ya Mapato',
      operatingExpenses: 'Gharama za Uendeshaji',
      netProfit: 'Faida Halisi',
      newCustomers: 'Wateja Wapya',
      lowStockAlert: 'Tahadhari ya Bidhaa Chini',
      itemsNeedReorder: 'bidhaa zinahitaji kuagizwa upya',
      vsLastMonth: 'ikilinganishwa na kipindi kilichopita',
      margin: 'Kiwango cha faida',
    },
    trust: {
      headline: 'Inaaminiwa na biashara 18,000+ katika mataifa 14 ya Kiafrika',
      activeMsmes: 'Biashara Zinazofanya Kazi',
      tradeVolume: 'Kiasi cha Biashara Kilichorekodiwa',
      offlineSync: 'Miamala Nje ya Mtandao Iliyosawazishwa',
      taxAccuracy: 'Usahihi wa Uzingatiaji wa Kodi',
    },
    chat: {
      launcherTooltip: 'Unahitaji msaada? Zungumza na Msaada wa Afrika',
      badgeOnline: 'Msaada Uko Mtandaoni',
      headerTitle: 'Msaada & Usaidizi wa Papo hapo',
      headerSubtitle: 'Kwa kawaida tunajibu chini ya dakika 3',
      tabChat: 'Mazungumzo ya Moja kwa Moja',
      tabWhatsapp: 'WhatsApp',
      tabCallback: 'Omba Kupigiwa Simu',
      welcomeMsg: 'Habari! Karibu kwenye huduma ya usaidizi ya MsmeBooks Afrika. Tunawezaje kusaidia biashara yako leo?',
    },
    cta: {
      title: 'Uko tayari kubadilisha fedha za biashara yako?',
      subtitle: 'Jiunge na maelfu ya wajasiriamali wa Afrika wanaokua na MsmeBooks leo.',
      startTrialBtn: 'Anza Jaribio la Bure la Siku 14',
      requestDemoBtn: 'Panga Onyesho la Ana kwa Ana',
      guarantee: 'Hakuna kadi ya mkopo inayohitajika • Ghairi wakati wowote • Inafanya kazi 100% bila intaneti',
    },
    footer: {
      tagline: 'Kuwezesha biashara za Kiafrika kupitia uhasibu mahiri na mfumo wa maduka mengi wa POS.',
      rights: 'Haki zote zimehifadhiwa.',
      builtWithLove: 'Imejengwa kwa fahari kwa biashara za Kiafrika',
      selectLang: 'Lugha',
    },
  },

  ar: {
    nav: {
      products: 'المنتجات',
      solutions: 'الحلول',
      features: 'الميزات',
      industries: 'القطاعات',
      multiBranch: 'فروع متعددة',
      resources: 'الموارد',
      pricing: 'الأسعار',
      aiAssistant: 'مساعد الذكاء الاصطناعي',
      signIn: 'تسجيل الدخول',
      requestDemo: 'طلب عرض توضيحي',
      startFree: 'ابدأ مجاناً',
      startFreeTrial: 'تجربة مجانية (14 يوماً)',
      requestDemo1on1: 'طلب عرض توضيحي خاص',
      signInAccount: 'الدخول إلى الحساب',
      allInOneModules: 'وحدات متكاملة شاملة',
      builtForAfrica: 'مصمم خصيصاً للشركات الإفريقية',
      tailoredByType: 'مخصص حسب نوع النشاط التجاري',
      selectLanguage: 'اختر اللغة',
      selectCurrency: 'اختر العملة',
      connectionMode: 'وضع الاتصال',
      theme: 'المظهر',
      online: 'متصل',
      offline: 'غير متصل',
      tagline: 'إفريقيا',
      aiPowered: 'مدعوم بالذكاء الاصطناعي',
      live: 'مباشر',
    },
    products: {
      accounting: {
        title: 'المحاسبة العامة',
        desc: 'أرباح وخسائر فورية، ميزانيات عمومية ودفتر الأستاذ العام',
      },
      invoicing: {
        title: 'الفواتير والتحصيل',
        desc: 'فواتير رقمية متعددة العملات مع روابط دفع إلكترونية سريعة',
      },
      pos: {
        title: 'نقاط البيع (POS)',
        desc: 'مبيعات تجزئة سريعة تعمل بدون إنترنت مع طباعة الإيصالات',
      },
      inventory: {
        title: 'إدارة المخزون',
        desc: 'تتبع المستودعات المتعددة وإعادة الطلب التلقائي للأصناف',
      },
      crm: {
        title: 'العملاء وإدارة العلاقات',
        desc: 'متابعة أرصدة العملاء وكشوف الحسابات وبرامج الولاء',
      },
      expenses: {
        title: 'المصروفات والصندوق الصغير',
        desc: 'مسح الإيصالات ضوئياً (OCR) ودورات موافقة ذكية على النفقات',
      },
      banking: {
        title: 'الربط البنكي المباشر',
        desc: 'مزامنة مباشرة مع أكثر من 25 بنكاً تجارياً إفريقياً معتمداً',
      },
      payroll: {
        title: 'الموارد البشرية والرواتب',
        desc: 'أتمتة ضرائب الرواتب والتقاعد والتأمينات وقسائم الأجور',
      },
      tax: {
        title: 'الضرائب والامتثال المالي',
        desc: 'إعداد الإقرارات الضريبية تلقائياً للهيئات والمصالح الضريبية',
      },
      reports: {
        title: 'التقارير المالية والتشغيلية',
        desc: 'أكثر من 60 تقريراً تحليلياً شاملاً يصدر بضغطة زر واحدة',
      },
      bi: {
        title: 'ذكاء الأعمال والتحليلات',
        desc: 'تحليلات تنبؤية وتوقعات الأرباح ونمو الأعمال المستقبلية',
      },
      ai: {
        title: 'مساعد الذكاء الاصطناعي للأعمال',
        desc: 'إجابات فورية باللغة الطبيعية عن أرقامك المالية وقوائمك',
      },
    },
    solutions: {
      micro: {
        title: 'الشركات الصغيرة والمتناهية الصغر',
        desc: 'محاسبة مبسطة واقتصادية وفعالة من اليوم الأول لعملك',
      },
      growing: {
        title: 'الشركات الآخذة في النمو',
        desc: 'صلاحيات متعددة للمستخدمين، مسير الرواتب وضوابط الموردين',
      },
      multibranch: {
        title: 'الشركات ذات الفروع المتعددة',
        desc: 'إدارة مركزية موحدة لما يصل إلى أكثر من 50 فرعاً ومستودعاً',
      },
      retail: {
        title: 'متاجر التجزئة والسوبرماركت',
        desc: 'ماسح الباركود، درج النقود وتحديث فوري للمخزون المباع',
      },
      restaurants: {
        title: 'المطاعم والمقاهي',
        desc: 'تذاكر المطبخ الرقمية، تكلفة الوجبات وفواتير الطاولات',
      },
      hotels: {
        title: 'الفنادق والضيافة',
        desc: 'سجلات حجز الغرف وفواتير النزلاء والخدمات المرافقة',
      },
      realEstate: {
        title: 'العقارات وإدارة الأملاك',
        desc: 'فواتير المستأجرين، عقود الإيجار ومتابعة الصيانة الدورية',
      },
      services: {
        title: 'الخدمات المهنية والاستشارية',
        desc: 'الأتعاب الدورية، مراحل المشاريع واحتساب تكاليف العقود',
      },
      accountingFirms: {
        title: 'مكاتب المحاسبة والتدقيق',
        desc: 'بوابة موحدة لإدارة دفاتر أكثر من 50 عميلاً بكل سهولة',
      },
      wholesale: {
        title: 'الموزعون وتجار الجملة',
        desc: 'نقل البضائع بين المستودعات وتحديد حدود الائتمان التجاري',
      },
      ecommerce: {
        title: 'متاجر التجارة الإلكترونية',
        desc: 'واجهة بيع رقمية متصلة لحظياً مع مخزون المستودعات الفعلي',
      },
    },
    hero: {
      badge: 'الطريقة الأذكى لإدارة أعمالك التجارية',
      year: 'إفريقيا 2026',
      title1: 'أدِر أعمالك بذكاء أكبر.',
      title2: 'وانمُ بكل ثقة واطمئنان.',
      subtitle:
        'تجمع منصة MsmeBooks المحاسبة والفواتير والمخزون والمبيعات والمصروفات ونقاط البيع والعملاء والموظفين والتقارير في منصة واحدة ذكية مصممة خصيصاً للشركات الإفريقية.',
      ctaStart: 'ابدأ التجربة المجانية',
      ctaDemo: 'احجز عرضاً توضيحياً مباشراً',
      ctaTour: 'جولة تعريفية (دقيقتان)',
      trustedBy: 'موثوق به من أكثر من 18,000 شركة عبر إفريقيا',
      pillOffline: 'نقاط بيع تعمل بدون إنترنت',
      pillCurrency: 'متعدد العملات وضريبة القيمة المضافة',
      pillBank: 'ربط مصرفي بنكي مباشر',
      pillWhatsApp: 'إصدار الفواتير عبر واتساب',
      totalRevenue: 'إجمالي الإيرادات',
      operatingExpenses: 'المصروفات التشغيلية',
      netProfit: 'صافي الربح',
      newCustomers: 'عملاء جدد',
      lowStockAlert: 'تنبيه نقص المخزون',
      itemsNeedReorder: 'أصناف بحاجة لإعادة الطلب',
      vsLastMonth: 'مقارنة بالفترة السابقة',
      margin: 'هامش الربح الصافي',
    },
    trust: {
      headline: 'موثوق به من أكثر من 18,000 شركة في 14 دولة إفريقية',
      activeMsmes: 'مؤسسة تجارية نشطة',
      tradeVolume: 'حجم المعاملات المسجلة',
      offlineSync: 'معاملة غير متصلة تمت مزامنتها',
      taxAccuracy: 'دقة الامتثال الضريبي',
    },
    chat: {
      launcherTooltip: 'هل تحتاج لمساعدة؟ تحدث مع الدعم الإفريقي',
      badgeOnline: 'الدعم متصل الآن',
      headerTitle: 'المساعدة والدعم المباشر',
      headerSubtitle: 'نرد عادةً خلال أقل من 3 دقائق',
      tabChat: 'المحادثة الفورية',
      tabWhatsapp: 'واتساب',
      tabCallback: 'طلب اتصال هاتفي',
      welcomeMsg: 'مرحباً بك في دعم MsmeBooks إفريقيا! كيف يمكننا مساعدة نشاطك التجاري اليوم؟',
    },
    cta: {
      title: 'هل أنت مستعد لتطوير الإدارة المالية لأعمالك؟',
      subtitle: 'انضم اليوم إلى آلاف رواد الأعمال الأفارقة الذين يحققون النمو مع MsmeBooks.',
      startTrialBtn: 'ابدأ تجربة مجانية لمدة 14 يوماً',
      requestDemoBtn: 'جدولة عرض توضيحي خاص',
      guarantee: 'لا يلزم إدخال بطاقة ائتمان • إلغاء في أي وقت • جاهز للعمل 100% بدون إنترنت',
    },
    footer: {
      tagline: 'تمكين التجارة الإفريقية بأنظمة مسك الدفاتر الذكية ونقاط البيع للفروع المتعددة.',
      rights: 'جميع الحقوق محفوظة.',
      builtWithLove: 'صُنع بفخر واعتزاز للتجارة الإفريقية',
      selectLang: 'اللغة',
    },
  },
};
