export type SupportedLanguage = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Global / Anglophone Africa' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Afrique Francophone' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'África Lusófona & Internacional' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Guinea Ecuatorial & Internacional' }
];

export interface TranslationDictionary {
  nav: {
    stories: string;
    useCases: string;
    reviews: string;
    platform: string;
    bookDemo: string;
    cms: string;
    themeLight: string;
    themeDark: string;
    themeSwitch: string;
    language: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    searchAria: string;
    clearSearch: string;
    showingResults: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetFilters: string;
  };
  stats: {
    reconciledRevenue: string;
    reconciledLabel: string;
    inventoryAccuracy: string;
    inventoryLabel: string;
    verticalsSupported: string;
    verticalsLabel: string;
    activeMsmes: string;
    activeLabel: string;
  };
  filters: {
    all: string;
    retail: string;
    logistics: string;
    services: string;
    healthcare: string;
    hospitality: string;
    filterByIndustry: string;
  };
  card: {
    readCaseStudy: string;
    keyResults: string;
    verifiedBusiness: string;
    location: string;
    shareStory: string;
    impactSummary: string;
    beforeMsmeBooks: string;
    afterMsmeBooks: string;
  };
  detail: {
    backToStories: string;
    shareStory: string;
    bookDemo: string;
    operationalTransformation: string;
    beforeChallenges: string;
    implementedSolution: string;
    quantifiedOutcomes: string;
    growthTrajectory: string;
    executiveQuote: string;
    companyProfile: string;
    industryLabel: string;
    teamSize: string;
    timeframe: string;
    softwareReplaced: string;
  };
  useCasesPage: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    searchPlaceholder: string;
    selectVertical: string;
    coreCapabilities: string;
    matchingStories: string;
    requestPlaybook: string;
    noMatchingTitle: string;
    noMatchingSubtitle: string;
    industryLabel: string;
    primaryWorkflow: string;
    typicalPainPoints: string;
    erpSolution: string;
  };
  reviewsPage: {
    badge: string;
    title: string;
    subtitle: string;
    submitReview: string;
    verifiedBadge: string;
    overallRating: string;
    recommendRate: string;
    filterAll: string;
    searchPlaceholder: string;
    filterByRating: string;
  };
  demoModal: {
    title: string;
    subtitle: string;
    fullName: string;
    workEmail: string;
    phone: string;
    companyName: string;
    industry: string;
    outlets: string;
    additionalNotes: string;
    submit: string;
    cancel: string;
    successTitle: string;
    successMessage: string;
    close: string;
  };
  liveChat: {
    chatTitle: string;
    online: string;
    replyTime: string;
    agentIntro: string;
    suggestedTopics: string;
    typeMessage: string;
    directChannels: string;
    emailDesk: string;
    hotline: string;
    leaveTicket: string;
    sendTicket: string;
    ticketSentTitle: string;
    ticketSentMessage: string;
    questionsPrompt: string;
    liveConversationTab: string;
    directContactsTab: string;
    demoPromptText: string;
    scheduleGuidedDemo: string;
  };
  footer: {
    tagline: string;
    website: string;
    industryHeader: string;
    viewAllIndustries: string;
    storiesHeader: string;
    customerStories: string;
    reviewsTestimonials: string;
    implementationJourneys: string;
    submitCaseStudy: string;
    getStartedHeader: string;
    getStartedDesc: string;
    bookDemoBtn: string;
    integrityTitle: string;
    integrityNote: string;
    copyright: string;
  };
  connection: {
    statusOnline: string;
    statusOffline: string;
    cloudSyncActive: string;
    localCacheActive: string;
    offlineModeActive: string;
    offlineBannerText: string;
    offlineExplanation: string;
    onlineExplanation: string;
    simulateOffline: string;
    exitSimulation: string;
    checkConnection: string;
    connectionRestored: string;
    offlineTooltip: string;
    onlineTooltip: string;
    featuresAvailableOffline: string;
    autoSyncNotice: string;
  };
  currency: {
    selectCurrency: string;
    searchCurrency: string;
    allCurrencies: string;
    panAfricanCurrencies: string;
    internationalCurrencies: string;
    realtimeExchangeActive: string;
    financialMetricsNotice: string;
    reconciledRevenueTitle: string;
    dailyTransactionsTitle: string;
    averageSavingsTitle: string;
  };
  navSearch: {
    placeholder: string;
    ariaLabel: string;
    clearLabel: string;
    quickJump: string;
    matchingStories: string;
    noMatches: string;
    tryKeywords: string;
    viewAllInGrid: string;
    popularTopics: string;
    featuredStories: string;
    matchIndustry: string;
    matchCompany: string;
    matchModule: string;
    matchRegion: string;
    matchKeyword: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    nav: {
      stories: 'Success Stories',
      useCases: 'Industry Use Cases',
      reviews: 'Customer Reviews',
      platform: 'Platform Features',
      bookDemo: 'Book a Free Demo',
      cms: 'Story CMS & Content Admin',
      themeLight: 'Switch to Light Palette',
      themeDark: 'Switch to Deep Navy Charcoal',
      themeSwitch: 'Switch',
      language: 'Language'
    },
    hero: {
      badge: 'Verified Pan-African MSME Case Studies',
      titlePart1: 'How 2,400+ African MSMEs',
      titleHighlight: 'Scale & Run on Autopilot',
      subtitle: 'Explore real operational stories from supermarkets, wholesale distributors, pharmacies, and service firms using MsmeBooks to eliminate inventory losses, automate accounting, and scale multi-branch operations.',
      searchPlaceholder: 'Search stories by company name, industry, or key challenges (e.g. Pharmacy, Inventory, POS, Multi-store)...',
      searchAria: 'Search success stories',
      clearSearch: 'Clear search query',
      showingResults: 'Showing results for',
      noResultsTitle: 'No Matching Stories Found',
      noResultsDesc: 'Try adjusting your search terms, changing the category filter, or reset your search to explore all case studies.',
      resetFilters: 'Reset All Filters'
    },
    stats: {
      reconciledRevenue: '₦4.8B+',
      reconciledLabel: 'Reconciled Revenue / Year',
      inventoryAccuracy: '99.4%',
      inventoryLabel: 'Inventory Accuracy',
      verticalsSupported: '17',
      verticalsLabel: 'Verticals Supported',
      activeMsmes: '2,400+',
      activeLabel: 'Active MSMEs'
    },
    filters: {
      all: 'All Industries',
      retail: 'Retail & Supermarkets',
      logistics: 'Logistics & Wholesale',
      services: 'Professional Services',
      healthcare: 'Healthcare & Pharma',
      hospitality: 'Hospitality & Dining',
      filterByIndustry: 'Filter by Industry Category'
    },
    card: {
      readCaseStudy: 'Read Full Case Study',
      keyResults: 'Key Results',
      verifiedBusiness: 'Verified Business',
      location: 'Location',
      shareStory: 'Share',
      impactSummary: 'Operational Impact',
      beforeMsmeBooks: 'Before MsmeBooks',
      afterMsmeBooks: 'After MsmeBooks'
    },
    detail: {
      backToStories: 'Back to Success Stories',
      shareStory: 'Share This Case Study',
      bookDemo: 'Book a Platform Demo',
      operationalTransformation: 'Operational Transformation',
      beforeChallenges: 'The Bottlenecks & Challenges',
      implementedSolution: 'The MsmeBooks Solution',
      quantifiedOutcomes: 'Quantified Business Outcomes',
      growthTrajectory: 'Three-Stage Operational Growth Metrics',
      executiveQuote: 'Founder & Leadership Perspective',
      companyProfile: 'Enterprise Profile',
      industryLabel: 'Industry',
      teamSize: 'Team Size',
      timeframe: 'Deployment Timeline',
      softwareReplaced: 'Previous Stack Replaced'
    },
    useCasesPage: {
      badge: 'Industry Playbooks & Workflows',
      title: 'Engineered for Your Exact Industry',
      subtitle: 'Every industry has distinct operational bottlenecks. Explore how MsmeBooks configures POS, inventory, multi-store sync, and tax ledgers for your specific vertical.',
      filterAll: 'All Verticals',
      searchPlaceholder: 'Filter industries (e.g. Retail, Healthcare, Logistics, Hospitality)...',
      selectVertical: 'Select an Industry',
      coreCapabilities: 'Core Architectural Capabilities',
      matchingStories: 'Real Customer Stories in this Vertical',
      requestPlaybook: 'Book a Tailored Industry Walkthrough',
      noMatchingTitle: 'No Matching Industries',
      noMatchingSubtitle: 'Try clearing your search query or choosing another category.',
      industryLabel: 'Industry Category',
      primaryWorkflow: 'Primary Workflow',
      typicalPainPoints: 'Common Challenges',
      erpSolution: 'MsmeBooks Enterprise Solution'
    },
    reviewsPage: {
      badge: 'Verified Customer Feedback',
      title: 'Loved by Thousands of African Founders',
      subtitle: 'Read unfiltered testimonials from business owners running POS, warehousing, and automated bookkeeping on MsmeBooks.',
      submitReview: 'Write a Customer Review',
      verifiedBadge: 'Verified Implementation',
      overallRating: 'Average Customer Rating',
      recommendRate: 'of founders recommend MsmeBooks to peers',
      filterAll: 'All Ratings',
      searchPlaceholder: 'Search verified reviews...',
      filterByRating: 'Filter by Star Rating'
    },
    demoModal: {
      title: 'Book a Platform Walkthrough',
      subtitle: 'See how MsmeBooks adapts to your business in a customized 20-minute screen session with an enterprise implementation specialist.',
      fullName: 'Full Name *',
      workEmail: 'Business Email *',
      phone: 'Phone / WhatsApp *',
      companyName: 'Company Name *',
      industry: 'Industry / Vertical *',
      outlets: 'Number of Branches / Outlets',
      additionalNotes: 'What are your primary operational goals?',
      submit: 'Confirm & Schedule Demo',
      cancel: 'Cancel',
      successTitle: 'Demo Request Received!',
      successMessage: 'Our regional implementation specialist will reach out via WhatsApp/email within 2 hours to confirm your tailored platform walkthrough.',
      close: 'Done'
    },
    liveChat: {
      chatTitle: 'MSMEBooks Support',
      online: 'ONLINE',
      replyTime: 'Replies in ~2 mins • Mon–Sat',
      agentIntro: "Hello! 👋 I'm Aisha from MSMEBooks Support. How can we help you streamline your operations today? Feel free to ask about our modules, pricing, or request an engineer walkthrough.",
      suggestedTopics: 'Suggested Topics:',
      typeMessage: 'Type a message for Aisha...',
      directChannels: 'Direct Channels & Ticket',
      emailDesk: 'Email Desk',
      hotline: 'Direct Phone / Hotline',
      leaveTicket: 'Leave an Agent Message / Ticket',
      sendTicket: 'Send Message to Support Desk',
      ticketSentTitle: 'Ticket Submitted!',
      ticketSentMessage: 'Our support team will email or call you within 15 minutes.',
      questionsPrompt: 'Questions? Chat with Support',
      liveConversationTab: 'Live Conversation',
      directContactsTab: 'Direct Contacts & Ticket',
      demoPromptText: 'Need a Customized Walkthrough? Book 20 minutes with our solutions engineer to see how MSMEBooks handles your multi-store POS, batch tracking, or VAT accounting.',
      scheduleGuidedDemo: 'Schedule Guided Demo'
    },
    footer: {
      tagline: 'MsmeBooks is the all-in-one Accounting, Point of Sale (POS), Inventory and Business Management Platform serving micro, small, and medium-sized enterprises across Africa and worldwide.',
      website: 'Website:',
      industryHeader: 'Industry Use Cases',
      viewAllIndustries: 'View All 17 Industries →',
      storiesHeader: 'Stories & Proof',
      customerStories: 'Customer Success Stories',
      reviewsTestimonials: 'Reviews & Testimonials',
      implementationJourneys: 'Implementation Journeys',
      submitCaseStudy: 'Submit a Case Study',
      getStartedHeader: 'Get Started',
      getStartedDesc: 'Experience how connected accounting, inventory, and point of sale simplify your enterprise.',
      bookDemoBtn: 'Book a Free Demo',
      integrityTitle: 'Verification Integrity Standard:',
      integrityNote: 'MsmeBooks strictly distinguishes verified customer testimonials from illustrative use case profiles. Unverified scenarios are clearly labeled.',
      copyright: 'MsmeBooks Org. All rights reserved.'
    },
    connection: {
      statusOnline: 'Online',
      statusOffline: 'Offline Mode',
      cloudSyncActive: 'Cloud sync real-time',
      localCacheActive: 'Local cache active',
      offlineModeActive: 'Operating Offline',
      offlineBannerText: 'Operating in offline mode. Full case studies, metrics, and reviews remain accessible from local cache.',
      offlineExplanation: 'Pan-African connectivity resilience: your sessions and data are preserved locally. Any pending requests will automatically sync once internet connectivity is restored.',
      onlineExplanation: 'Connected to cloud network. Real-time updates, verification badges, and instant demo bookings active.',
      simulateOffline: 'Simulate Offline Mode',
      exitSimulation: 'Restore Online Mode',
      checkConnection: 'Check Connection',
      connectionRestored: 'Internet connection re-established. Sync resumed.',
      offlineTooltip: 'Operating offline (Local cache active)',
      onlineTooltip: 'Connected to cloud network',
      featuresAvailableOffline: '100% of case studies, ROI calculators, and reviews are available offline.',
      autoSyncNotice: 'Changes are queued safely and will sync immediately upon reconnection.'
    },
    currency: {
      selectCurrency: 'Select Display Currency',
      searchCurrency: 'Search currency, code, or country...',
      allCurrencies: 'All (16)',
      panAfricanCurrencies: 'Pan-African (12)',
      internationalCurrencies: 'Global (4)',
      realtimeExchangeActive: 'Real-time conversion active globally',
      financialMetricsNotice: 'All financial figures converted in real time using official base exchange rates.',
      reconciledRevenueTitle: 'Annual Reconciled Revenue',
      dailyTransactionsTitle: 'Daily Processed Volume',
      averageSavingsTitle: 'Average Cost Savings / MSME'
    },
    navSearch: {
      placeholder: 'Search stories, industry, company...',
      ariaLabel: 'Global search for success stories by industry, company, or keywords',
      clearLabel: 'Clear search',
      quickJump: 'Quick Story Filter',
      matchingStories: 'matching stories',
      noMatches: 'No success stories match',
      tryKeywords: 'Try an industry (Retail, Pharmacy), company profile, or module (POS, Inventory).',
      viewAllInGrid: 'Filter all results in Stories Grid',
      popularTopics: 'Quick Filters',
      featuredStories: 'Top Featured Case Studies',
      matchIndustry: 'Industry',
      matchCompany: 'Company',
      matchModule: 'Module',
      matchRegion: 'Region',
      matchKeyword: 'Keyword'
    }
  },
  fr: {
    nav: {
      stories: 'Témoignages Réussite',
      useCases: 'Cas d\'Usage Sectoriels',
      reviews: 'Avis Clients',
      platform: 'Fonctionnalités',
      bookDemo: 'Réserver une Démo Gratuite',
      cms: 'Gestionnaire CMS d\'Histoires',
      themeLight: 'Passer au Thème Clair',
      themeDark: 'Passer au Thème Bleu Nuit / Anthracite',
      themeSwitch: 'Basculer',
      language: 'Langue'
    },
    hero: {
      badge: 'Études de Cas PME Panafricaines Vérifiées',
      titlePart1: 'Comment 2 400+ PME Africaines',
      titleHighlight: 'Grandissent et Automatisent',
      subtitle: 'Découvrez des retours d\'expérience concrets de supermarchés, grossistes, pharmacies et prestataires utilisant MsmeBooks pour éliminer les pertes de stocks, automatiser la comptabilité et piloter plusieurs magasins.',
      searchPlaceholder: 'Rechercher par entreprise, secteur ou défi opérationnel (ex : Pharmacie, Stock, Caisse POS, Multi-boutiques)...',
      searchAria: 'Rechercher des études de cas',
      clearSearch: 'Effacer la recherche',
      showingResults: 'Résultats pour',
      noResultsTitle: 'Aucun Témoignage Trouvé',
      noResultsDesc: 'Modifiez vos termes de recherche, changez de catégorie de filtre ou réinitialisez la recherche pour voir toutes les études de cas.',
      resetFilters: 'Réinitialiser Tous les Filtres'
    },
    stats: {
      reconciledRevenue: '4,8 Md ₦+',
      reconciledLabel: 'Revenus Rapprochés / An',
      inventoryAccuracy: '99,4 %',
      inventoryLabel: 'Précision d\'Inventaire',
      verticalsSupported: '17',
      verticalsLabel: 'Secteurs d\'Activité Couverts',
      activeMsmes: '2 400+',
      activeLabel: 'PME Actives'
    },
    filters: {
      all: 'Tous les Secteurs',
      retail: 'Commerce & Supermarchés',
      logistics: 'Logistique & Grossistes',
      services: 'Services Professionnels',
      healthcare: 'Santé & Pharmacies',
      hospitality: 'Hôtellerie & Restauration',
      filterByIndustry: 'Filtrer par Catégorie Sectorielle'
    },
    card: {
      readCaseStudy: 'Lire l\'Étude de Cas Complète',
      keyResults: 'Résultats Clés',
      verifiedBusiness: 'Entreprise Vérifiée',
      location: 'Localisation',
      shareStory: 'Partager',
      impactSummary: 'Impact Opérationnel',
      beforeMsmeBooks: 'Avant MsmeBooks',
      afterMsmeBooks: 'Après MsmeBooks'
    },
    detail: {
      backToStories: 'Retour aux Témoignages',
      shareStory: 'Partager cette Étude de Cas',
      bookDemo: 'Réserver une Démonstration',
      operationalTransformation: 'Transformation Opérationnelle',
      beforeChallenges: 'Goulots d\'Étranglement et Défis',
      implementedSolution: 'La Solution MsmeBooks Déployée',
      quantifiedOutcomes: 'Résultats Commerciaux Quantifiés',
      growthTrajectory: 'Évolution Opérationnelle en Trois Étapes',
      executiveQuote: 'Vision des Dirigeants',
      companyProfile: 'Fiche Entreprise',
      industryLabel: 'Secteur',
      teamSize: 'Taille de l\'Équipe',
      timeframe: 'Délai de Déploiement',
      softwareReplaced: 'Anciens Outils Remplacés'
    },
    useCasesPage: {
      badge: 'Guides et Workflows Sectoriels',
      title: 'Conçu Spécifiquement pour Votre Métier',
      subtitle: 'Chaque secteur d\'activité fait face à des contraintes opérationnelles uniques. Découvrez comment MsmeBooks configure la caisse POS, les stocks, la synchronisation multi-magasins et les déclarations fiscales pour votre verticale.',
      filterAll: 'Tous les Métiers',
      searchPlaceholder: 'Filtrer les secteurs (ex : Commerce, Santé, Logistique, Hôtellerie)...',
      selectVertical: 'Sélectionner un Secteur',
      coreCapabilities: 'Capacités Opérationnelles Clés',
      matchingStories: 'Histoires Clients Réelles dans ce Secteur',
      requestPlaybook: 'Demander une Démonstration Métier Personnalisée',
      noMatchingTitle: 'Aucun Secteur Correspondant',
      noMatchingSubtitle: 'Effacez votre recherche ou sélectionnez une autre catégorie.',
      industryLabel: 'Catégorie Sectorielle',
      primaryWorkflow: 'Flux Opérationnel Principal',
      typicalPainPoints: 'Défis Fréquents',
      erpSolution: 'Solution d\'Entreprise MsmeBooks'
    },
    reviewsPage: {
      badge: 'Retours Clients Vérifiés',
      title: 'Plébiscité par des Milliers d\'Entrepreneurs Africains',
      subtitle: 'Lisez les avis authentiques de chefs d\'entreprise qui pilotent leur point de vente, leurs entrepôts et leur comptabilité avec MsmeBooks.',
      submitReview: 'Rédiger un Avis Client',
      verifiedBadge: 'Déploiement Vérifié',
      overallRating: 'Note Moyenne Globale',
      recommendRate: 'des fondateurs recommandent MsmeBooks à leurs pairs',
      filterAll: 'Toutes les Notes',
      searchPlaceholder: 'Rechercher parmi les avis vérifiés...',
      filterByRating: 'Filtrer par Nombre d\'Étoiles'
    },
    demoModal: {
      title: 'Réserver une Démonstration de la Plateforme',
      subtitle: 'Voyez comment MsmeBooks s\'adapte à votre entreprise lors d\'une session personnalisée de 20 minutes avec un spécialiste déploiement.',
      fullName: 'Nom Complet *',
      workEmail: 'Email Professionnel *',
      phone: 'Téléphone / WhatsApp *',
      companyName: 'Nom de l\'Entreprise *',
      industry: 'Secteur d\'Activité *',
      outlets: 'Nombre d\'Agences / Points de Vente',
      additionalNotes: 'Quels sont vos objectifs prioritaires ?',
      submit: 'Confirmer et Planifier la Démo',
      cancel: 'Annuler',
      successTitle: 'Demande de Démo Reçue !',
      successMessage: 'Notre spécialiste régional vous contactera via WhatsApp ou email sous 2 heures pour organiser votre visite guidée.',
      close: 'Fermer'
    },
    liveChat: {
      chatTitle: 'Support MSMEBooks',
      online: 'EN LIGNE',
      replyTime: 'Répond en ~2 min • Lun–Sam',
      agentIntro: 'Bonjour ! 👋 Je suis Aisha du Support Client MSMEBooks. Comment pouvons-nous vous aider à développer votre entreprise aujourd\'hui ? Posez vos questions sur nos modules, nos tarifs ou demandez une démo.',
      suggestedTopics: 'Sujets Suggérés :',
      typeMessage: 'Écrivez un message pour Aisha...',
      directChannels: 'Canaux Directs & Ticket',
      emailDesk: 'Bureau d\'Assistance Email',
      hotline: 'Ligne Téléphonique Directe',
      leaveTicket: 'Laisser un Message / Créer un Ticket',
      sendTicket: 'Envoyer le Message au Support',
      ticketSentTitle: 'Ticket Envoyé !',
      ticketSentMessage: 'Notre équipe d\'assistance vous appellera ou vous enverra un e-mail dans les 15 minutes.',
      questionsPrompt: 'Une question ? Discutez avec le support',
      liveConversationTab: 'Conversation en Direct',
      directContactsTab: 'Contacts & Ticket Direct',
      demoPromptText: 'Besoin d\'une présentation personnalisée ? Réservez 20 minutes avec notre ingénieur pour voir la gestion multi-boutiques, les lots FEFO et la TVA.',
      scheduleGuidedDemo: 'Planifier une Démo Guidée'
    },
    footer: {
      tagline: 'MsmeBooks est la plateforme intégrée de Comptabilité, Point de Vente (POS), Gestion des Stocks et Pilotage d\'Entreprise dédiée aux micro, petites et moyennes entreprises en Afrique et à l\'international.',
      website: 'Site Web :',
      industryHeader: 'Cas d\'Usage Métier',
      viewAllIndustries: 'Voir les 17 Secteurs →',
      storiesHeader: 'Témoignages & Preuves',
      customerStories: 'Témoignages de Réussite',
      reviewsTestimonials: 'Avis & Retours d\'Expérience',
      implementationJourneys: 'Parcours de Déploiement',
      submitCaseStudy: 'Proposer une Étude de Cas',
      getStartedHeader: 'Démarrer Maintenant',
      getStartedDesc: 'Découvrez comment une comptabilité et des stocks connectés simplifient la gestion de votre entreprise.',
      bookDemoBtn: 'Réserver une Démo Gratuite',
      integrityTitle: 'Norme d\'Intégrité et Vérification :',
      integrityNote: 'MsmeBooks distingue rigoureusement les avis clients vérifiés des profils de cas d\'usage illustratifs. Les scénarios non vérifiés sont clairement signalés.',
      copyright: 'MsmeBooks Org. Tous droits réservés.'
    },
    connection: {
      statusOnline: 'En ligne',
      statusOffline: 'Mode hors-ligne',
      cloudSyncActive: 'Synchro cloud en temps réel',
      localCacheActive: 'Cache local actif',
      offlineModeActive: 'Fonctionnement hors-ligne',
      offlineBannerText: 'Fonctionnement en mode hors-ligne. Les études de cas, métriques et avis restent accessibles depuis le cache local.',
      offlineExplanation: 'Résilience aux coupures réseau : vos consultations et formulaires sont conservés localement. Toute demande sera synchronisée automatiquement dès le rétablissement d\'Internet.',
      onlineExplanation: 'Connecté au réseau cloud. Mises à jour en direct, vérifications d\'entreprises et réservations de démo actives.',
      simulateOffline: 'Simuler le mode hors-ligne',
      exitSimulation: 'Rétablir le mode en ligne',
      checkConnection: 'Vérifier la connexion',
      connectionRestored: 'Connexion Internet rétablie. Synchronisation active.',
      offlineTooltip: 'Fonctionne hors-ligne (Cache local actif)',
      onlineTooltip: 'Connecté au réseau cloud',
      featuresAvailableOffline: '100% des cas d\'usage, calculateurs et avis clients restent disponibles hors-ligne.',
      autoSyncNotice: 'Les requêtes sont enregistrées en sécurité et synchronisées dès reconnexion.'
    },
    currency: {
      selectCurrency: 'Sélectionner la Devise d\'Affichage',
      searchCurrency: 'Rechercher devise, code ou pays...',
      allCurrencies: 'Toutes (16)',
      panAfricanCurrencies: 'Panafricaines (12)',
      internationalCurrencies: 'Internationales (4)',
      realtimeExchangeActive: 'Conversion en direct active globalement',
      financialMetricsNotice: 'Tous les montants financiers sont convertis en temps réel selon les taux de change officiels.',
      reconciledRevenueTitle: 'Chiffre d\'Affaires Annuel Réconcilié',
      dailyTransactionsTitle: 'Volume Journalier Traité',
      averageSavingsTitle: 'Économies Moyennes par PME'
    },
    navSearch: {
      placeholder: 'Rechercher secteur, société, mots-clés...',
      ariaLabel: 'Recherche globale de cas de réussite par secteur, société ou mots-clés',
      clearLabel: 'Effacer la recherche',
      quickJump: 'Filtre Rapide d\'Histoires',
      matchingStories: 'témoignages correspondants',
      noMatches: 'Aucun témoignage ne correspond à',
      tryKeywords: 'Essayez un secteur (Commerce, Pharmacie), une entreprise ou un module (Caisse POS, Stock).',
      viewAllInGrid: 'Filtrer tous les résultats dans la grille',
      popularTopics: 'Filtres Rapides',
      featuredStories: 'Études de Cas Vedettes',
      matchIndustry: 'Secteur',
      matchCompany: 'Entreprise',
      matchModule: 'Module',
      matchRegion: 'Région',
      matchKeyword: 'Mot-clé'
    }
  },
  pt: {
    nav: {
      stories: 'Casos de Sucesso',
      useCases: 'Casos de Uso por Indústria',
      reviews: 'Avaliações de Clientes',
      platform: 'Funcionalidades da Plataforma',
      bookDemo: 'Agendar Demo Grátis',
      cms: 'Administrador de Conteúdo (CMS)',
      themeLight: 'Mudar para Tema Claro',
      themeDark: 'Mudar para Tema Azul Escuro Carvão',
      themeSwitch: 'Alternar',
      language: 'Idioma'
    },
    hero: {
      badge: 'Estudos de Caso PME Pan-Africanos Verificados',
      titlePart1: 'Como 2.400+ PMEs Africanas',
      titleHighlight: 'Crescem e Operam no Piloto Automático',
      subtitle: 'Explore casos operacionais reais de supermercados, distribuidores atacadistas, farmácias e prestadores de serviços que utilizam o MsmeBooks para eliminar quebras de estoque, automatizar a contabilidade e expandir múltiplas filiais.',
      searchPlaceholder: 'Pesquise por empresa, setor ou desafios (ex: Farmácia, Estoque, PDV, Múltiplas Lojas)...',
      searchAria: 'Pesquisar casos de sucesso',
      clearSearch: 'Limpar pesquisa',
      showingResults: 'Resultados para',
      noResultsTitle: 'Nenhum Caso Encontrado',
      noResultsDesc: 'Tente ajustar os termos de pesquisa, mudar a categoria de filtro ou redefinir a busca para explorar todos os casos.',
      resetFilters: 'Redefinir Todos os Filtros'
    },
    stats: {
      reconciledRevenue: '₦4,8B+',
      reconciledLabel: 'Receita Reconciliada / Ano',
      inventoryAccuracy: '99,4%',
      inventoryLabel: 'Precisão de Estoque',
      verticalsSupported: '17',
      verticalsLabel: 'Setores Atendidos',
      activeMsmes: '2.400+',
      activeLabel: 'PMEs Ativas'
    },
    filters: {
      all: 'Todas as Indústrias',
      retail: 'Varejo & Supermercados',
      logistics: 'Logística & Atacado',
      services: 'Serviços Profissionais',
      healthcare: 'Saúde & Farmácias',
      hospitality: 'Hotelaria & Restaurantes',
      filterByIndustry: 'Filtrar por Categoria Industrial'
    },
    card: {
      readCaseStudy: 'Ler Caso de Estudo Completo',
      keyResults: 'Resultados Principais',
      verifiedBusiness: 'Empresa Verificada',
      location: 'Localização',
      shareStory: 'Compartilhar',
      impactSummary: 'Impacto Operacional',
      beforeMsmeBooks: 'Antes do MsmeBooks',
      afterMsmeBooks: 'Depois do MsmeBooks'
    },
    detail: {
      backToStories: 'Voltar aos Casos de Sucesso',
      shareStory: 'Compartilhar este Caso',
      bookDemo: 'Agendar Demonstração',
      operationalTransformation: 'Transformação Operacional',
      beforeChallenges: 'Gargalos e Desafios Anteriores',
      implementedSolution: 'A Solução Implementada no MsmeBooks',
      quantifiedOutcomes: 'Resultados Comerciais Mensuráveis',
      growthTrajectory: 'Métricas de Crescimento em Três Fases',
      executiveQuote: 'Perspectiva da Liderança',
      companyProfile: 'Perfil da Empresa',
      industryLabel: 'Setor',
      teamSize: 'Tamanho da Equipe',
      timeframe: 'Prazo de Implantação',
      softwareReplaced: 'Sistemas Anteriores Substituídos'
    },
    useCasesPage: {
      badge: 'Playbooks e Fluxos de Trabalho Setoriais',
      title: 'Projetado para o Seu Setor Exato',
      subtitle: 'Cada indústria possui gargalos operacionais específicos. Veja como o MsmeBooks configura PDV, controle de estoque, sincronização de filiais e registros fiscais para o seu segmento.',
      filterAll: 'Todos os Setores',
      searchPlaceholder: 'Filtrar setores (ex: Varejo, Saúde, Logística, Restaurantes)...',
      selectVertical: 'Selecione uma Indústria',
      coreCapabilities: 'Capacidades Arquiteturais Centrais',
      matchingStories: 'Casos Reais neste Segmento',
      requestPlaybook: 'Solicitar Demonstração Especializada por Setor',
      noMatchingTitle: 'Nenhum Setor Encontrado',
      noMatchingSubtitle: 'Tente limpar a pesquisa ou selecionar outra categoria.',
      industryLabel: 'Categoria Industrial',
      primaryWorkflow: 'Fluxo de Trabalho Principal',
      typicalPainPoints: 'Desafios Comuns',
      erpSolution: 'Solução Empresarial MsmeBooks'
    },
    reviewsPage: {
      badge: 'Feedback Verificado de Clientes',
      title: 'Amado por Milhares de Empreendedores Africanos',
      subtitle: 'Leia depoimentos autênticos de empresários que administram pontos de venda, depósitos e contabilidade automatizada no MsmeBooks.',
      submitReview: 'Escrever uma Avaliação',
      verifiedBadge: 'Implementação Verificada',
      overallRating: 'Avaliação Média dos Clientes',
      recommendRate: 'dos fundadores recomendam MsmeBooks a parceiros',
      filterAll: 'Todas as Classificações',
      searchPlaceholder: 'Pesquisar avaliações verificadas...',
      filterByRating: 'Filtrar por Estrelas'
    },
    demoModal: {
      title: 'Agendar Demonstração da Plataforma',
      subtitle: 'Veja como o MsmeBooks se adapta ao seu negócio em uma sessão personalizada de 20 minutos com um especialista em implantação.',
      fullName: 'Nome Completo *',
      workEmail: 'E-mail Corporativo *',
      phone: 'Telefone / WhatsApp *',
      companyName: 'Nome da Empresa *',
      industry: 'Setor de Atuação *',
      outlets: 'Número de Lojas / Filiais',
      additionalNotes: 'Quais são os principais objetivos operacionais?',
      submit: 'Confirmar e Agendar Demonstração',
      cancel: 'Cancelar',
      successTitle: 'Solicitação de Demonstração Recebida!',
      successMessage: 'Nosso especialista regional entrará em contato via WhatsApp ou e-mail dentro de 2 horas para confirmar o seu agendamento.',
      close: 'Concluir'
    },
    liveChat: {
      chatTitle: 'Suporte MSMEBooks',
      online: 'ONLINE',
      replyTime: 'Responde em ~2 min • Seg–Sáb',
      agentIntro: 'Olá! 👋 Sou a Aisha do Suporte ao Cliente MSMEBooks. Como podemos ajudar a expandir o seu negócio hoje? Fique à vontade para perguntar sobre módulos, preços ou agendar uma demonstração.',
      suggestedTopics: 'Tópicos Sugeridos:',
      typeMessage: 'Digite uma mensagem para Aisha...',
      directChannels: 'Canais Diretos & Chamado',
      emailDesk: 'Central de E-mail',
      hotline: 'Telefone Direto / Central',
      leaveTicket: 'Deixar Mensagem / Abrir Chamado',
      sendTicket: 'Enviar Mensagem ao Suporte',
      ticketSentTitle: 'Chamado Aberto com Sucesso!',
      ticketSentMessage: 'Nossa equipe de suporte ligará ou responderá por e-mail dentro de 15 minutos.',
      questionsPrompt: 'Dúvidas? Fale com o Suporte',
      liveConversationTab: 'Conversa em Tempo Real',
      directContactsTab: 'Contatos Diretos & Chamado',
      demoPromptText: 'Precisa de uma demonstração sob medida? Agende 20 minutos com nosso especialista para conferir PDV multi-lojas, controle de lotes e livros contáveis.',
      scheduleGuidedDemo: 'Agendar Demonstração Guiada'
    },
    footer: {
      tagline: 'O MsmeBooks é a plataforma integrada de Contabilidade, Ponto de Venda (PDV), Estoque e Gestão Empresarial para micro, pequenas e médias empresas na África e no mundo.',
      website: 'Site Oficial:',
      industryHeader: 'Casos de Uso por Setor',
      viewAllIndustries: 'Ver Todos os 17 Setores →',
      storiesHeader: 'Casos & Provas Reais',
      customerStories: 'Casos de Sucesso de Clientes',
      reviewsTestimonials: 'Depoimentos e Avaliações',
      implementationJourneys: 'Jornadas de Implantação',
      submitCaseStudy: 'Enviar um Caso de Sucesso',
      getStartedHeader: 'Comece Agora',
      getStartedDesc: 'Descubra como finanças integradas, estoque e ponto de venda simplificam a sua empresa.',
      bookDemoBtn: 'Agendar Demo Grátis',
      integrityTitle: 'Padrão de Integridade e Verificação:',
      integrityNote: 'O MsmeBooks distingue com rigor depoimentos reais e verificados de clientes de perfis ilustrativos. Cenários não verificados são expressamente identificados.',
      copyright: 'MsmeBooks Org. Todos os direitos reservados.'
    },
    connection: {
      statusOnline: 'Online',
      statusOffline: 'Modo Offline',
      cloudSyncActive: 'Sincronização em tempo real',
      localCacheActive: 'Cache local ativo',
      offlineModeActive: 'Operando em modo offline',
      offlineBannerText: 'Operando em modo offline. Estudos de caso, métricas e avaliações continuam acessíveis no cache local.',
      offlineExplanation: 'Resiliência a oscilações de internet: suas consultas e dados ficam salvos localmente. Ações serão sincronizadas automaticamente assim que a conexão retornar.',
      onlineExplanation: 'Conectado à nuvem. Dados atualizados em tempo real, verificação de empresas e agendamentos instantâneos.',
      simulateOffline: 'Simular modo offline',
      exitSimulation: 'Restaurar modo online',
      checkConnection: 'Verificar conexão',
      connectionRestored: 'Conexão restabelecida. Sincronização retomada.',
      offlineTooltip: 'Operando offline (Cache local ativo)',
      onlineTooltip: 'Conectado à nuvem',
      featuresAvailableOffline: '100% dos estudos de caso, calculadoras e avaliações disponíveis offline.',
      autoSyncNotice: 'As alterações são enfileiradas e sincronizadas assim que a internet voltar.'
    },
    currency: {
      selectCurrency: 'Selecionar Moeda de Exibição',
      searchCurrency: 'Pesquisar moeda, código ou país...',
      allCurrencies: 'Todas (16)',
      panAfricanCurrencies: 'Pan-Africanas (12)',
      internationalCurrencies: 'Globais (4)',
      realtimeExchangeActive: 'Conversão em tempo real ativa globalmente',
      financialMetricsNotice: 'Todos os valores financeiros são convertidos em tempo real com base nas taxas cambiais oficiais.',
      reconciledRevenueTitle: 'Receita Anual Reconciliada',
      dailyTransactionsTitle: 'Volume Diário Processado',
      averageSavingsTitle: 'Economia Média por MPME'
    },
    navSearch: {
      placeholder: 'Buscar setor, empresa ou palavras-chave...',
      ariaLabel: 'Pesquisa global de casos de sucesso por setor, empresa ou palavras-chave',
      clearLabel: 'Limpar pesquisa',
      quickJump: 'Filtro Rápido de Casos',
      matchingStories: 'casos correspondentes',
      noMatches: 'Nenhum caso encontrado para',
      tryKeywords: 'Tente um setor (Varejo, Farmácia), empresa ou módulo (PDV, Estoque).',
      viewAllInGrid: 'Filtrar todos os resultados na grade',
      popularTopics: 'Filtros Rápidos',
      featuredStories: 'Estudos de Caso em Destaque',
      matchIndustry: 'Setor',
      matchCompany: 'Empresa',
      matchModule: 'Módulo',
      matchRegion: 'Região',
      matchKeyword: 'Palavra-chave'
    }
  },
  es: {
    nav: {
      stories: 'Casos de Éxito',
      useCases: 'Casos de Uso por Sector',
      reviews: 'Reseñas de Clientes',
      platform: 'Funcionalidades',
      bookDemo: 'Reservar una Demo Gratis',
      cms: 'Administrador de Contenidos (CMS)',
      themeLight: 'Cambiar a Paleta Clara',
      themeDark: 'Cambiar a Paleta Azul Marino Carbón',
      themeSwitch: 'Alternar',
      language: 'Idioma'
    },
    hero: {
      badge: 'Casos de Estudio PYME Panafricanos Verificados',
      titlePart1: 'Cómo 2.400+ PYMEs Africanas',
      titleHighlight: 'Escalan y Operan en Piloto Automático',
      subtitle: 'Explore historias operativas reales de supermercados, distribuidores mayoristas, farmacias y empresas de servicios que usan MsmeBooks para erradicar pérdidas de inventario, automatizar la contabilidad y operar múltiples sucursales.',
      searchPlaceholder: 'Buscar casos por nombre de empresa, industria o desafío (ej. Farmacia, Inventario, TPV, Múltiples Tiendas)...',
      searchAria: 'Buscar casos de éxito',
      clearSearch: 'Borrar búsqueda',
      showingResults: 'Resultados para',
      noResultsTitle: 'No se Encontraron Casos',
      noResultsDesc: 'Intente ajustar sus términos de búsqueda, cambiar el filtro de categoría o restablecer la búsqueda para explorar todos los casos de estudio.',
      resetFilters: 'Restablecer Todos los Filtros'
    },
    stats: {
      reconciledRevenue: '₦4,8B+',
      reconciledLabel: 'Ingresos Conciliados / Año',
      inventoryAccuracy: '99,4%',
      inventoryLabel: 'Precisión de Inventario',
      verticalsSupported: '17',
      verticalsLabel: 'Sectores Compatibles',
      activeMsmes: '2.400+',
      activeLabel: 'PYMEs Activas'
    },
    filters: {
      all: 'Todas las Industrias',
      retail: 'Comercio Minorista & Supermercados',
      logistics: 'Logística & Mayoristas',
      services: 'Servicios Profesionales',
      healthcare: 'Salud & Farmacias',
      hospitality: 'Hostelería & Restaurantes',
      filterByIndustry: 'Filtrar por Categoría de Industria'
    },
    card: {
      readCaseStudy: 'Leer Estudio de Caso Completo',
      keyResults: 'Resultados Clave',
      verifiedBusiness: 'Empresa Verificada',
      location: 'Ubicación',
      shareStory: 'Compartir',
      impactSummary: 'Impacto Operativo',
      beforeMsmeBooks: 'Antes de MsmeBooks',
      afterMsmeBooks: 'Después de MsmeBooks'
    },
    detail: {
      backToStories: 'Volver a Casos de Éxito',
      shareStory: 'Compartir este Caso',
      bookDemo: 'Solicitar Demostración',
      operationalTransformation: 'Transformación Operativa',
      beforeChallenges: 'Cuellos de Botella y Retos',
      implementedSolution: 'La Solución Implantada con MsmeBooks',
      quantifiedOutcomes: 'Resultados Comerciales Cuantificados',
      growthTrajectory: 'Métricas de Crecimiento Operativo en Tres Etapas',
      executiveQuote: 'Perspectiva de la Dirección',
      companyProfile: 'Perfil de la Empresa',
      industryLabel: 'Sector',
      teamSize: 'Tamaño del Equipo',
      timeframe: 'Plazo de Implementación',
      softwareReplaced: 'Software Anterior Sustituido'
    },
    useCasesPage: {
      badge: 'Manuales y Flujos de Trabajo Sectoriales',
      title: 'Diseñado para su Industria Exacta',
      subtitle: 'Cada industria presenta cuellos de botella operativos específicos. Conozca cómo MsmeBooks configura punto de venta, inventario, sincronización multitienda y libros fiscales para su sector.',
      filterAll: 'Todos los Sectores',
      searchPlaceholder: 'Filtrar industrias (ej. Comercio, Salud, Logística, Hostelería)...',
      selectVertical: 'Seleccionar una Industria',
      coreCapabilities: 'Capacidades Arquitectónicas Principales',
      matchingStories: 'Casos Reales en este Sector',
      requestPlaybook: 'Solicitar Demostración Sectorial Personalizada',
      noMatchingTitle: 'No se Encontraron Industrias',
      noMatchingSubtitle: 'Intente borrar la búsqueda o seleccionar otra categoría.',
      industryLabel: 'Categoría de Industria',
      primaryWorkflow: 'Flujo de Trabajo Principal',
      typicalPainPoints: 'Desafíos Frecuentes',
      erpSolution: 'Solución Empresarial MsmeBooks'
    },
    reviewsPage: {
      badge: 'Opiniones Verificadas de Clientes',
      title: 'Elegido por Miles de Emprendedores Africanos',
      subtitle: 'Lea opiniones reales de dueños de empresas que gestionan terminales punto de venta, almacenes y contabilidad automatizada con MsmeBooks.',
      submitReview: 'Escribir una Reseña',
      verifiedBadge: 'Implementación Verificada',
      overallRating: 'Valoración Media de Clientes',
      recommendRate: 'de los fundadores recomiendan MsmeBooks a colegas',
      filterAll: 'Todas las Calificaciones',
      searchPlaceholder: 'Buscar reseñas verificadas...',
      filterByRating: 'Filtrar por Estrellas'
    },
    demoModal: {
      title: 'Reservar Demostración de la Plataforma',
      subtitle: 'Vea cómo MsmeBooks se adapta a su negocio en una sesión guiada de 20 minutos con un especialista en implantación empresarial.',
      fullName: 'Nombre Completo *',
      workEmail: 'Correo Electrónico Corporativo *',
      phone: 'Teléfono / WhatsApp *',
      companyName: 'Nombre de la Empresa *',
      industry: 'Sector / Industria *',
      outlets: 'Número de Sucursales / Tiendas',
      additionalNotes: '¿Cuáles son sus prioridades operativas?',
      submit: 'Confirmar y Agendar Demostración',
      cancel: 'Cancelar',
      successTitle: '¡Solicitud de Demo Recibida!',
      successMessage: 'Nuestro especialista regional se comunicará por WhatsApp o correo en un plazo de 2 horas para coordinar la demostración personalizada.',
      close: 'Cerrar'
    },
    liveChat: {
      chatTitle: 'Soporte MSMEBooks',
      online: 'EN LÍNEA',
      replyTime: 'Responde en ~2 min • Lun–Sáb',
      agentIntro: '¡Hola! 👋 Soy Aisha del Soporte de MSMEBooks. ¿Cómo podemos ayudarle a optimizar las operaciones de su empresa hoy? Pregúntenos sobre módulos, precios o solicite una demostración.',
      suggestedTopics: 'Temas Sugeridos:',
      typeMessage: 'Escriba un mensaje para Aisha...',
      directChannels: 'Canales Directos & Ticket',
      emailDesk: 'Mesa de Ayuda por Correo',
      hotline: 'Línea Telefónica Directa',
      leaveTicket: 'Dejar un Mensaje / Crear Ticket',
      sendTicket: 'Enviar Mensaje a Soporte',
      ticketSentTitle: '¡Ticket Enviado con Éxito!',
      ticketSentMessage: 'Nuestro equipo de soporte se pondrá en contacto por teléfono o correo en un plazo de 15 minutos.',
      questionsPrompt: '¿Preguntas? Chatee con Soporte',
      liveConversationTab: 'Conversación en Vivo',
      directContactsTab: 'Contactos Directos & Ticket',
      demoPromptText: '¿Necesita una demostración a medida? Reserve 20 minutos con nuestro ingeniero para ver TPV multitienda, trazabilidad de lotes y contabilidad.',
      scheduleGuidedDemo: 'Programar Demostración Guiada'
    },
    footer: {
      tagline: 'MsmeBooks es la plataforma integral de Contabilidad, Punto de Venta (TPV), Inventario y Gestión Empresarial para micro, pequeñas y medianas empresas en África y en todo el mundo.',
      website: 'Sitio Web:',
      industryHeader: 'Casos de Uso por Industria',
      viewAllIndustries: 'Ver los 17 Sectores →',
      storiesHeader: 'Casos y Evidencia Real',
      customerStories: 'Casos de Éxito de Clientes',
      reviewsTestimonials: 'Reseñas y Testimonios',
      implementationJourneys: 'Procesos de Implementación',
      submitCaseStudy: 'Enviar un Caso de Estudio',
      getStartedHeader: 'Comenzar Ahora',
      getStartedDesc: 'Experimente cómo la contabilidad, el inventario y el punto de venta conectados simplifican su negocio.',
      bookDemoBtn: 'Reservar una Demo Gratis',
      integrityTitle: 'Estándar de Integridad y Verificación:',
      integrityNote: 'MsmeBooks distingue estrictamente los testimonios reales de clientes verificados de los perfiles ilustrativos. Los escenarios no verificados se señalan claramente.',
      copyright: 'MsmeBooks Org. Todos os derechos reservados.'
    },
    connection: {
      statusOnline: 'En línea',
      statusOffline: 'Modo sin conexión',
      cloudSyncActive: 'Sincronización en tiempo real',
      localCacheActive: 'Caché local activa',
      offlineModeActive: 'Operando sin conexión',
      offlineBannerText: 'Operando en modo sin conexión. Todos los casos de éxito, métricas y reseñas siguen disponibles en la caché local.',
      offlineExplanation: 'Resiliencia para conectividad intermitente: sus datos y consultas se conservan localmente. Cualquier solicitud se sincronizará automáticamente al recuperar la red.',
      onlineExplanation: 'Conectado a la nube. Actualizaciones en tiempo real, verificación de negocios y reservas de demostración activas.',
      simulateOffline: 'Simular modo sin conexión',
      exitSimulation: 'Restaurar conexión en línea',
      checkConnection: 'Comprobar conexión',
      connectionRestored: 'Conexión restablecida. Sincronización reanudada.',
      offlineTooltip: 'Operando sin conexión (Caché local activa)',
      onlineTooltip: 'Conectado a la nube',
      featuresAvailableOffline: '100% de los casos de éxito, calculadoras y opiniones disponibles sin conexión.',
      autoSyncNotice: 'Los cambios se guardan localmente y se sincronizan al recuperar la conexión.'
    },
    currency: {
      selectCurrency: 'Seleccionar Moneda de Visualización',
      searchCurrency: 'Buscar moneda, código o país...',
      allCurrencies: 'Todas (16)',
      panAfricanCurrencies: 'Panafricanas (12)',
      internationalCurrencies: 'Globales (4)',
      realtimeExchangeActive: 'Conversión en tiempo real activa globalmente',
      financialMetricsNotice: 'Todas las cifras financieras se convierten en tiempo real según los tipos de cambio oficiales.',
      reconciledRevenueTitle: 'Ingresos Anuales Conciliados',
      dailyTransactionsTitle: 'Volumen Diario Procesado',
      averageSavingsTitle: 'Ahorro Medio por MiPyme'
    },
    navSearch: {
      placeholder: 'Buscar sector, empresa o palabras clave...',
      ariaLabel: 'Búsqueda global de casos de éxito por sector, empresa o palabras clave',
      clearLabel: 'Borrar búsqueda',
      quickJump: 'Filtro Rápido de Casos',
      matchingStories: 'casos coincidentes',
      noMatches: 'No hay casos que coincidan con',
      tryKeywords: 'Pruebe un sector (Supermercados, Farmacia), empresa o módulo (TPV, Inventario).',
      viewAllInGrid: 'Filtrar todos los resultados en la cuadrícula',
      popularTopics: 'Filtros Rápidos',
      featuredStories: 'Casos de Estudio Destacados',
      matchIndustry: 'Sector',
      matchCompany: 'Empresa',
      matchModule: 'Módulo',
      matchRegion: 'Región',
      matchKeyword: 'Palabra clave'
    }
  }
};
