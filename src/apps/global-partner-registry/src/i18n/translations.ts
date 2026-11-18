export interface TranslationSchema {
  nav: {
    registryBadge: string;
    tagline: string;
    directory: string;
    bestMatch: string;
    globalMap: string;
    industries: string;
    countries: string;
    spotlight: string;
    tiers: string;
    referEarn: string;
    faqs: string;
    partnerLogin: string;
    becomePartner: string;
    scanQr: string;
    selectLanguage: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    searchPlaceholder: string;
    countryLabel: string;
    allCountries: string;
    cityLabel: string;
    cityPlaceholder: string;
    industryLabel: string;
    allIndustries: string;
    findPartnersBtn: string;
    trustedBy: string;
    topRatedPill: string;
    fastResponsePill: string;
    acceptingPill: string;
    remotePill: string;
    enterprisePill: string;
  };
  directory: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    refineFilters: string;
    clearAll: string;
    country: string;
    city: string;
    partnerType: string;
    allTypes: string;
    industry: string;
    allIndustries: string;
    verifiedOnly: string;
    acceptingOnly: string;
    remoteOnly: string;
    sortBy: string;
    sortRecommended: string;
    sortRating: string;
    sortExperience: string;
    sortReviews: string;
    sortImplementations: string;
    resultsCount: string;
    noResults: string;
    noLocalOffices: string;
    remoteOffer: string;
    viewRemotePartners: string;
  };
  partnerCard: {
    verifiedExpert: string;
    inReview: string;
    trustScore: string;
    viewProfile: string;
    requestConsultation: string;
    contact: string;
    compare: string;
    askQuestion: string;
    experienceYears: string;
    implementations: string;
    rating: string;
    respondsIn: string;
    fastestResponder: string;
    topRated: string;
    acceptingClients: string;
    currentlyBooked: string;
  };
  stats: {
    partnersCount: string;
    partnersLabel: string;
    countriesCount: string;
    countriesLabel: string;
    businessesCount: string;
    businessesLabel: string;
    satisfactionCount: string;
    satisfactionLabel: string;
  };
  smartMatch: {
    badge: string;
    title: string;
    subtitle: string;
    getMatched: string;
  };
  countriesSection: {
    badge: string;
    title: string;
    subtitle: string;
    allRegions: string;
    africaNations: string;
    globalHubs: string;
    searchPlaceholder: string;
    explorePartners: string;
  };
  whyWork: {
    title: string;
    subtitle: string;
    reason1Title: string;
    reason1Desc: string;
    reason2Title: string;
    reason2Desc: string;
    reason3Title: string;
    reason3Desc: string;
  };
  footer: {
    tagline: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
    partnerAgreement: string;
  };
}

export const translations: Record<string, TranslationSchema> = {
  // ==========================================
  // ENGLISH (Default)
  // ==========================================
  en: {
    nav: {
      registryBadge: 'Global Registry 2026',
      tagline: 'Official MsmeBooks Certified Ecosystem for Accounting, POS & Multi-Branch Business Technology',
      directory: 'Partner Directory',
      bestMatch: 'Find Best Match',
      globalMap: 'Global Map',
      industries: 'Industries',
      countries: 'Countries',
      spotlight: 'Client Spotlight',
      tiers: 'Tiers & Benefits',
      referEarn: 'Refer & Earn',
      faqs: 'FAQs',
      partnerLogin: 'Partner Login',
      becomePartner: 'Become a Partner',
      scanQr: 'Scan QR',
      selectLanguage: 'Language',
    },
    hero: {
      badge: 'Verified Pan-African & Global Ecosystem',
      title: 'Find a Trusted MsmeBooks Partner Near You',
      titleAccent: 'Near You',
      subtitle: 'Connect with certified accountants, POS hardware technicians, and cloud software advisors across all 54 African countries and global hubs. Accelerate onboarding, automate tax compliance, and scale your operations.',
      searchPlaceholder: 'Search partner name, specialty, or certification...',
      countryLabel: 'Country',
      allCountries: 'All Countries (All Africa & Global)',
      cityLabel: 'City / Location',
      cityPlaceholder: 'e.g. Lagos, Nairobi, London, Accra...',
      industryLabel: 'Industry',
      allIndustries: 'All Industries & Sectors',
      findPartnersBtn: 'Find Partners',
      trustedBy: 'Trusted by 10,000+ businesses across 54 African countries and global hubs',
      topRatedPill: 'Top-Rated Partners',
      fastResponsePill: 'Fast Responders (< 1h)',
      acceptingPill: 'Accepting Clients',
      remotePill: 'Remote Support Ready',
      enterprisePill: 'Enterprise Multi-Branch',
    },
    directory: {
      title: 'Certified Partner Directory',
      subtitle: 'Filter verified implementation partners by country, city, expertise, and client rating.',
      searchPlaceholder: 'Search by partner name, city, specialty, service...',
      refineFilters: 'Refine Partners',
      clearAll: 'Clear All Filters',
      country: 'Country',
      city: 'City / Town',
      partnerType: 'Partner Category',
      allTypes: 'All Partner Types',
      industry: 'Industry Focus',
      allIndustries: 'All Industries',
      verifiedOnly: 'Verified Partners Only',
      acceptingOnly: 'Accepting New Clients Only',
      remoteOnly: 'Remote Support Enabled',
      sortBy: 'Sort Directory',
      sortRecommended: 'Recommended (Default)',
      sortRating: 'Highest Client Rating',
      sortExperience: 'Most Experienced',
      sortReviews: 'Most Reviews',
      sortImplementations: 'Most Implementations',
      resultsCount: 'Showing {{count}} verified partners',
      noResults: 'No partners match your exact filter criteria',
      noLocalOffices: 'No local offices directly in {{country}} yet',
      remoteOffer: 'Our accredited international & Pan-African partners provide full remote setup, cloud migration, and ongoing consultation for clients in {{country}}.',
      viewRemotePartners: 'View Remote-Support Partners',
    },
    partnerCard: {
      verifiedExpert: 'Verified Expert',
      inReview: 'Expert • In Review',
      trustScore: 'Trust Score',
      viewProfile: 'View Profile',
      requestConsultation: 'Request Consultation',
      contact: 'Contact Partner',
      compare: 'Compare',
      askQuestion: 'Ask a Question',
      experienceYears: 'Years in Practice',
      implementations: 'Successful Implementations',
      rating: 'Client Rating',
      respondsIn: 'Responds {{time}}',
      fastestResponder: 'Fastest Responder',
      topRated: 'Top-Rated',
      acceptingClients: 'Accepting Clients',
      currentlyBooked: 'Currently Booked',
    },
    stats: {
      partnersCount: '500+',
      partnersLabel: 'Certified Partners',
      countriesCount: '109',
      countriesLabel: 'African & Global Hubs',
      businessesCount: '15,000+',
      businessesLabel: 'SMEs & Enterprises Powered',
      satisfactionCount: '99.4%',
      satisfactionLabel: 'Implementation Satisfaction',
    },
    smartMatch: {
      badge: 'Smart Partner Finder',
      title: 'Find Your Ideal Partner in 60 Seconds',
      subtitle: 'Answer 5 quick questions about your sector, branches, and requirements to match with verified partners.',
      getMatched: 'Start Smart Match',
    },
    countriesSection: {
      badge: 'Pan-African & Global Coverage (All 54 African Nations + Global Hubs)',
      title: 'Explore MsmeBooks Partners by Country',
      subtitle: 'Connect with accredited accounting and technology partners across all 54 sovereign African countries and global trade hubs, trained on localized fiscal compliance and multi-currency billing.',
      allRegions: 'All Regions',
      africaNations: 'Africa (All 54 Nations)',
      globalHubs: 'Global Hubs',
      searchPlaceholder: 'Search any country, region or city (e.g. Lagos, Kenya, London, Dubai)...',
      explorePartners: 'Explore Partners',
    },
    whyWork: {
      title: 'Why Work With a Certified MsmeBooks Partner?',
      subtitle: 'Save hundreds of hours on setup, eliminate tax filing penalties, and maximize cloud ROI with accredited local specialists.',
      reason1Title: 'Accredited Tax & Fiscal Compliance',
      reason1Desc: 'Fully trained on local statutory frameworks (FIRS, GRA, KRA, SARS, ZRA, DGI) ensuring audit readiness and flawless tax compliance.',
      reason2Title: 'Turnkey POS Hardware & Inventory Setup',
      reason2Desc: 'End-to-end deployment of thermal receipt printers, barcode scanners, multi-branch synchronized inventory, and offline-ready checkouts.',
      reason3Title: 'Dedicated Local & Remote Ongoing Support',
      reason3Desc: 'Rapid SLA response times in your local timezone and native language, with comprehensive staff training and data migration.',
    },
    footer: {
      tagline: 'Official Certified Partner Ecosystem for MsmeBooks Enterprise Accounting, Cloud POS & Multi-Branch Management.',
      allRightsReserved: 'All rights reserved. MsmeBooks Certified Partner Program.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      partnerAgreement: 'Partner Agreement',
    },
  },

  // ==========================================
  // FRENCH (Français) - West & Central Africa + Europe
  // ==========================================
  fr: {
    nav: {
      registryBadge: 'Registre Mondial 2026',
      tagline: 'Écosystème Certifié MsmeBooks pour la Comptabilité, POS et Gestion Multi-Succursales',
      directory: 'Annuaire des Partenaires',
      bestMatch: 'Trouver le Meilleur Profil',
      globalMap: 'Carte Mondiale',
      industries: 'Secteurs d’Activité',
      countries: 'Pays',
      spotlight: 'Témoignages Clients',
      tiers: 'Niveaux & Avantages',
      referEarn: 'Parrainer & Gagner',
      faqs: 'FAQ',
      partnerLogin: 'Connexion Partenaire',
      becomePartner: 'Devenir Partenaire',
      scanQr: 'Scanner QR',
      selectLanguage: 'Langue',
    },
    hero: {
      badge: 'Écosystème Panafricain & Mondial Certifié',
      title: 'Trouvez un Partenaire Agréé MsmeBooks Près de Chez Vous',
      titleAccent: 'Près de Chez Vous',
      subtitle: 'Collaborez avec des experts-comptables certifiés, des techniciens POS et des consultants cloud dans les 54 pays africains et à l’international. Accélérez votre déploiement, assurez votre conformité fiscale et développez vos activités.',
      searchPlaceholder: 'Rechercher par nom, spécialité, ville ou certification...',
      countryLabel: 'Pays',
      allCountries: 'Tous les Pays (Afrique & Monde)',
      cityLabel: 'Ville / Localité',
      cityPlaceholder: 'ex. Abidjan, Dakar, Douala, Paris...',
      industryLabel: 'Secteur d’Activité',
      allIndustries: 'Tous les Secteurs',
      findPartnersBtn: 'Trouver des Partenaires',
      trustedBy: 'Plébiscité par plus de 10 000 entreprises à travers les 54 pays africains et dans le monde',
      topRatedPill: 'Les Mieux Notés',
      fastResponsePill: 'Réponse Rapide (< 1h)',
      acceptingPill: 'Disponible Immédiatement',
      remotePill: 'Support à Distance',
      enterprisePill: 'Prêt pour Entreprise Multi-Sites',
    },
    directory: {
      title: 'Annuaire des Partenaires Certifiés',
      subtitle: 'Filtrez les partenaires agréés par pays, ville, domaine d’expertise et note client.',
      searchPlaceholder: 'Rechercher par nom de partenaire, ville, service...',
      refineFilters: 'Affiner la Recherche',
      clearAll: 'Effacer Tous les Filtres',
      country: 'Pays',
      city: 'Ville / Commune',
      partnerType: 'Catégorie de Partenaire',
      allTypes: 'Tous les Types',
      industry: 'Secteur Spécialisé',
      allIndustries: 'Tous les Secteurs',
      verifiedOnly: 'Partenaires Vérifiés Uniquement',
      acceptingOnly: 'Nouveaux Clients Acceptés',
      remoteOnly: 'Assistance à Distance',
      sortBy: 'Trier l’Annuaire',
      sortRecommended: 'Recommandé (Par Défaut)',
      sortRating: 'Meilleure Note Client',
      sortExperience: 'Plus Expérimenté',
      sortReviews: 'Plus d’Avis Vérifiés',
      sortImplementations: 'Plus de Déploiements',
      resultsCount: 'Affichage de {{count}} partenaires certifiés',
      noResults: 'Aucun partenaire ne correspond à vos critères exacts',
      noLocalOffices: 'Pas encore de bureau physique direct en {{country}}',
      remoteOffer: 'Nos partenaires certifiés panafricains et mondiaux assurent un déploiement complet à distance, la migration cloud et un accompagnement sur mesure pour vos opérations en {{country}}.',
      viewRemotePartners: 'Voir les Partenaires à Distance',
    },
    partnerCard: {
      verifiedExpert: 'Expert Vérifié',
      inReview: 'Expert • En Cours d’Audit',
      trustScore: 'Score de Confiance',
      viewProfile: 'Voir le Profil',
      requestConsultation: 'Demander une Consultation',
      contact: 'Contacter',
      compare: 'Comparer',
      askQuestion: 'Poser une Question',
      experienceYears: 'Années d’Expérience',
      implementations: 'Déploiements Réussis',
      rating: 'Note Client',
      respondsIn: 'Répond en {{time}}',
      fastestResponder: 'Réponse Prioritaire',
      topRated: 'Top Évalué',
      acceptingClients: 'Accepte des Clients',
      currentlyBooked: 'Complet Actuellement',
    },
    stats: {
      partnersCount: '500+',
      partnersLabel: 'Partenaires Certifiés',
      countriesCount: '109',
      countriesLabel: 'Pôles Africains & Internationaux',
      businessesCount: '15 000+',
      businessesLabel: 'Entreprises Modernisées',
      satisfactionCount: '99,4%',
      satisfactionLabel: 'Taux de Satisfaction',
    },
    smartMatch: {
      badge: 'Recherche Intelligente de Partenaire',
      title: 'Trouvez Votre Partenaire Idéal en 60 Secondes',
      subtitle: 'Répondez à 5 questions rapides sur votre secteur et vos besoins pour recevoir des recommandations personnalisées.',
      getMatched: 'Lancer le Diagnostic',
    },
    countriesSection: {
      badge: 'Couverture Panafricaine & Mondiale (54 Pays Africains + Hubs Mondiaux)',
      title: 'Explorez les Partenaires MsmeBooks par Pays',
      subtitle: 'Connectez-vous avec des partenaires technologiques et comptables certifiés dans les 54 nations africaines et les grands centres mondiaux.',
      allRegions: 'Toutes les Régions',
      africaNations: 'Afrique (54 Pays)',
      globalHubs: 'Pôles Mondiaux',
      searchPlaceholder: 'Rechercher un pays, une région ou une ville (ex. Dakar, Abidjan, Paris)...',
      explorePartners: 'Explorer les Partenaires',
    },
    whyWork: {
      title: 'Pourquoi Collaborer Avec un Partenaire Agréé MsmeBooks ?',
      subtitle: 'Gagnez des centaines d’heures, éliminez les risques de pénalités fiscales et optimisez votre gestion d’entreprise.',
      reason1Title: 'Conformité Fiscale et Comptable Certifiée',
      reason1Desc: 'Maîtrise approfondie des cadres fiscaux locaux (DGI, SYSCOHADA, OAPI) pour une conformité totale et des audits sereins.',
      reason2Title: 'Installation Complète du Matériel POS & Stock',
      reason2Desc: 'Configuration clé en main d’imprimantes thermiques, lecteurs codes-barres, terminaux tactiles et synchronisation multi-dépôts.',
      reason3Title: 'Assistance Locale et à Distance Dédiée',
      reason3Desc: 'Temps de réponse garanti dans votre fuseau horaire et votre langue avec formation approfondie de vos équipes.',
    },
    footer: {
      tagline: 'Écosystème officiel des partenaires certifiés pour la comptabilité d’entreprise, le POS cloud et la gestion multi-succursales MsmeBooks.',
      allRightsReserved: 'Tous droits réservés. Programme Partenaire MsmeBooks.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions Générales',
      partnerAgreement: 'Contrat Partenaire',
    },
  },

  // ==========================================
  // SWAHILI (Kiswahili) - East Africa
  // ==========================================
  sw: {
    nav: {
      registryBadge: 'Orodha ya Kimataifa 2026',
      tagline: 'Mfumo Rasmi wa Washirika Walioidhinishwa wa MsmeBooks kwa Uhasibu na POS',
      directory: 'Orodha ya Washirika',
      bestMatch: 'Tafuta Mshirika Bora',
      globalMap: 'Ramani ya Dunia',
      industries: 'Sekta za Biashara',
      countries: 'Nchi',
      spotlight: 'Mafanikio ya Wateja',
      tiers: 'Viwango & Faida',
      referEarn: 'Pendekeza & Pata',
      faqs: 'Maswali ya Mara kwa Mara',
      partnerLogin: 'Ingia kwa Mshirika',
      becomePartner: 'Kuwa Mshirika',
      scanQr: 'Changanua QR',
      selectLanguage: 'Lugha',
    },
    hero: {
      badge: 'Mfumo Uliothibitishwa wa Afrika na Ulimwenguni',
      title: 'Pata Mshirika Anayeaminika wa MsmeBooks Karibu Nawe',
      titleAccent: 'Karibu Nawe',
      subtitle: 'Wasiliana na wahasibu walioidhinishwa, wataalamu wa mifumo ya mauzo ya POS, na washauri wa wingu katika nchi zote 54 za Afrika na kote duniani. Boresha utendaji na kodi kwa urahisi.',
      searchPlaceholder: 'Tafuta jina la mshirika, ujuzi maalum au jiji...',
      countryLabel: 'Nchi',
      allCountries: 'Nchi Zote (Afrika & Dunia)',
      cityLabel: 'Mji / Eneo',
      cityPlaceholder: 'mfano: Nairobi, Dar es Salaam, Kampala, Kigali...',
      industryLabel: 'Sekta ya Biashara',
      allIndustries: 'Sekta Zote za Biashara',
      findPartnersBtn: 'Tafuta Washirika',
      trustedBy: 'Inaaminiwa na biashara zaidi ya 10,000 katika nchi 54 za Afrika na vituo vya kimataifa',
      topRatedPill: 'Walio na Alama za Juu',
      fastResponsePill: 'Majibu ya Haraka (< saa 1)',
      acceptingPill: 'Wanapokea Wateja Wapya',
      remotePill: 'Msaada wa Mbali Tayari',
      enterprisePill: 'Tayari kwa Matawi Mengi',
    },
    directory: {
      title: 'Orodha ya Washirika Walioidhinishwa',
      subtitle: 'Chuja washirika waliothibitishwa kulingana na nchi, mji, uzoefu, na viwango vya wateja.',
      searchPlaceholder: 'Tafuta kwa jina la mshirika, mji, ujuzi...',
      refineFilters: 'Chuja Matokeo',
      clearAll: 'Futa Vichungi Vyote',
      country: 'Nchi',
      city: 'Mji / Jiji',
      partnerType: 'Aina ya Mshirika',
      allTypes: 'Aina Zote za Washirika',
      industry: 'Sekta Kuu',
      allIndustries: 'Sekta Zote',
      verifiedOnly: 'Washirika Waliothibitishwa Tu',
      acceptingOnly: 'Wanaopokea Wateja Tu',
      remoteOnly: 'Msaada wa Mbali',
      sortBy: 'Panga Orodha',
      sortRecommended: 'Inayopendekezwa (Msingi)',
      sortRating: 'Alama za Juu Zaidi',
      sortExperience: 'Uzoefu Mkubwa Zaidi',
      sortReviews: 'Maoni Mengi Zaidi',
      sortImplementations: 'Miradi Mingi Zaidi',
      resultsCount: 'Inaonyesha washirika {{count}} waliothibitishwa',
      noResults: 'Hakuna washirika wanaolingana na vigezo vyako haswa',
      noLocalOffices: 'Bado hakuna ofisi ya ana kwa ana nchini {{country}}',
      remoteOffer: 'Washirika wetu walioidhinishwa wa Afrika nzima na kimataifa wanatoa huduma kamili za mbali, usanidi wa wingu na mafunzo kwa wateja katika {{country}}.',
      viewRemotePartners: 'Tazama Washirika wa Mbali',
    },
    partnerCard: {
      verifiedExpert: 'Mtaalamu Aliyethibitishwa',
      inReview: 'Mtaalamu • Anahakikiwa',
      trustScore: 'Alama ya Uaminifu',
      viewProfile: 'Tazama Wasifu',
      requestConsultation: 'Omba Mashauriano',
      contact: 'Wasiliana',
      compare: 'Linganisha',
      askQuestion: 'Uliza Swali',
      experienceYears: 'Miaka ya Uzoefu',
      implementations: 'Miradi Iliyokamilika',
      rating: 'Alama za Wateja',
      respondsIn: 'Hujibu ndani ya {{time}}',
      fastestResponder: 'Mwitikio wa Haraka Zaidi',
      topRated: 'Alama ya Juu',
      acceptingClients: 'Anapokea Wateja',
      currentlyBooked: 'Amejaa kwa Sasa',
    },
    stats: {
      partnersCount: '500+',
      partnersLabel: 'Washirika Walioidhinishwa',
      countriesCount: '109',
      countriesLabel: 'Vituo vya Afrika & Ulimwengu',
      businessesCount: '15,000+',
      businessesLabel: 'Biashara Zilizoboreshwa',
      satisfactionCount: '99.4%',
      satisfactionLabel: 'Kiwango cha Kuridhika',
    },
    smartMatch: {
      badge: 'Ulinganishaji Mahiri',
      title: 'Pata Mshirika Wako Ndani ya Sekunde 60',
      subtitle: 'Jibu maswali machache kuhusu biashara yako ili upate washirika wanaokufaa zaidi.',
      getMatched: 'Anza Ulinganishaji',
    },
    countriesSection: {
      badge: 'Huduma Afrika Nzima & Ulimwenguni (Nchi 54 za Afrika)',
      title: 'Gundua Washirika wa MsmeBooks kwa Nchi',
      subtitle: 'Ungana na wataalamu wa kodi na teknolojia katika nchi zote 54 za Afrika na vituo vikuu vya biashara duniani.',
      allRegions: 'Kanda Zote',
      africaNations: 'Afrika (Nchi 54)',
      globalHubs: 'Vituo vya Kimataifa',
      searchPlaceholder: 'Tafuta nchi, kanda au mji (mfano: Nairobi, Dar es Salaam, Kigali)...',
      explorePartners: 'Chunguza Washirika',
    },
    whyWork: {
      title: 'Kwa Nini Ufanye Kazi na Mshirika Aliyethibitishwa wa MsmeBooks?',
      subtitle: 'Okoa mamia ya saa kwenye usanidi, epuka adhabu za kodi (KRA, TRA, URA), na ongeza faida.',
      reason1Title: 'Uzingatiaji Kamili wa Kodi na Sheria',
      reason1Desc: 'Mafunzo ya kina ya sheria za kikanda za ushuru na taarifa za kisheria zinazotambulika.',
      reason2Title: 'Usanidi Kamili wa Vifaa vya POS & Hifadhi',
      reason2Desc: 'Usambazaji wa mashine za risiti, skana za misimbo, na usawazishaji wa maduka mengi kwa pamoja.',
      reason3Title: 'Msaada wa Kujitolea Eneo Husika na wa Mbali',
      reason3Desc: 'Majibu ya haraka katika ukanda wako wa saa na lugha ya kienyeji pamoja na mafunzo kwa wafanyakazi.',
    },
    footer: {
      tagline: 'Mfumo rasmi wa washirika walioidhinishwa kwa Uhasibu wa MsmeBooks, POS ya Wingu na Matawi Mengi.',
      allRightsReserved: 'Haki zote zimehifadhiwa. Mpango wa Washirika wa MsmeBooks.',
      privacy: 'Sera ya Faragha',
      terms: 'Vigezo vya Huduma',
      partnerAgreement: 'Mkataba wa Ushirika',
    },
  },

  // ==========================================
  // PORTUGUESE (Português) - Angola, Mozambique, Portugal, Brazil
  // ==========================================
  pt: {
    nav: {
      registryBadge: 'Registo Global 2026',
      tagline: 'Ecossistema Certificado MsmeBooks para Contabilidade, POS e Gestão Multi-Filiais',
      directory: 'Diretório de Parceiros',
      bestMatch: 'Encontrar Melhor Correspondência',
      globalMap: 'Mapa Global',
      industries: 'Setores de Atividade',
      countries: 'Países',
      spotlight: 'Casos de Sucesso',
      tiers: 'Níveis & Benefícios',
      referEarn: 'Indicar & Ganhar',
      faqs: 'Perguntas Frequentes',
      partnerLogin: 'Entrar como Parceiro',
      becomePartner: 'Torne-se um Parceiro',
      scanQr: 'Ler Código QR',
      selectLanguage: 'Idioma',
    },
    hero: {
      badge: 'Ecossistema Pan-Africano e Global Certificado',
      title: 'Encontre um Parceiro Certificado MsmeBooks Perto de Si',
      titleAccent: 'Perto de Si',
      subtitle: 'Conecte-se com contabilistas certificados, técnicos de POS e consultores em nuvem nos 54 países africanos e no mundo. Acelere a implementação, automatize a conformidade fiscal e expanda o seu negócio.',
      searchPlaceholder: 'Pesquisar nome do parceiro, especialidade ou cidade...',
      countryLabel: 'País',
      allCountries: 'Todos os Países (África & Global)',
      cityLabel: 'Cidade / Localização',
      cityPlaceholder: 'ex.: Luanda, Maputo, Lisboa, São Paulo...',
      industryLabel: 'Setor de Atividade',
      allIndustries: 'Todos os Setores',
      findPartnersBtn: 'Pesquisar Parceiros',
      trustedBy: 'Utilizado por mais de 10.000 empresas em 54 países africanos e centros internacionais',
      topRatedPill: 'Mais Bem Avaliados',
      fastResponsePill: 'Resposta Rápida (< 1h)',
      acceptingPill: 'Disponível Imediatamente',
      remotePill: 'Suporte Remoto Disponível',
      enterprisePill: 'Pronto para Multi-Filiais',
    },
    directory: {
      title: 'Diretório de Parceiros Certificados',
      subtitle: 'Filtre parceiros verificados por país, cidade, especialização e avaliação de clientes.',
      searchPlaceholder: 'Pesquisar por nome de parceiro, cidade, serviço...',
      refineFilters: 'Refinar Filtros',
      clearAll: 'Limpar Todos os Filtros',
      country: 'País',
      city: 'Cidade',
      partnerType: 'Categoria de Parceiro',
      allTypes: 'Todos os Tipos de Parceiros',
      industry: 'Foco no Setor',
      allIndustries: 'Todos os Setores',
      verifiedOnly: 'Apenas Parceiros Verificados',
      acceptingOnly: 'Apenas a Aceitar Novos Clientes',
      remoteOnly: 'Suporte Remoto Habilitado',
      sortBy: 'Ordenar Diretório',
      sortRecommended: 'Recomendado (Padrão)',
      sortRating: 'Melhor Avaliação de Clientes',
      sortExperience: 'Mais Experiente',
      sortReviews: 'Mais Avaliações',
      sortImplementations: 'Mais Implementações',
      resultsCount: 'A mostrar {{count}} parceiros verificados',
      noResults: 'Nenhum parceiro corresponde aos seus critérios exatos',
      noLocalOffices: 'Ainda sem escritório físico direto em {{country}}',
      remoteOffer: 'Os nossos parceiros certificados pan-africanos e globais oferecem implementação 100% remota, migração para a nuvem e formação contínua para empresas em {{country}}.',
      viewRemotePartners: 'Ver Parceiros com Suporte Remoto',
    },
    partnerCard: {
      verifiedExpert: 'Especialista Verificado',
      inReview: 'Especialista • Em Auditoria',
      trustScore: 'Índice de Confiança',
      viewProfile: 'Ver Perfil',
      requestConsultation: 'Solicitar Consulta',
      contact: 'Contactar Parceiro',
      compare: 'Comparar',
      askQuestion: 'Fazer Pergunta',
      experienceYears: 'Anos de Experiência',
      implementations: 'Implementações Realizadas',
      rating: 'Avaliação de Clientes',
      respondsIn: 'Responde em {{time}}',
      fastestResponder: 'Resposta Prioritária',
      topRated: 'Mais Bem Avaliado',
      acceptingClients: 'Aceita Clientes',
      currentlyBooked: 'Lotado no Momento',
    },
    stats: {
      partnersCount: '500+',
      partnersLabel: 'Parceiros Certificados',
      countriesCount: '109',
      countriesLabel: 'Centros Africanos & Mundiais',
      businessesCount: '15.000+',
      businessesLabel: 'Empresas Modernizadas',
      satisfactionCount: '99,4%',
      satisfactionLabel: 'Índice de Satisfação',
    },
    smartMatch: {
      badge: 'Localizador Inteligente de Parceiros',
      title: 'Encontre o Seu Parceiro Ideal em 60 Segundos',
      subtitle: 'Responda a 5 perguntas rápidas para receber recomendações de parceiros certificados.',
      getMatched: 'Iniciar Combinação Inteligente',
    },
    countriesSection: {
      badge: 'Cobertura Pan-Africana & Mundial (54 Países Africanos + Hubs Globais)',
      title: 'Explore Parceiros MsmeBooks por País',
      subtitle: 'Conecte-se com parceiros contábeis e de tecnologia em todas as 54 nações africanas e nos principais polos globais.',
      allRegions: 'Todas as Regiões',
      africaNations: 'África (54 Países)',
      globalHubs: 'Centros Globais',
      searchPlaceholder: 'Pesquisar país, região ou cidade (ex.: Luanda, Maputo, Lisboa)...',
      explorePartners: 'Explorar Parceiros',
    },
    whyWork: {
      title: 'Por Que Trabalhar com um Parceiro Certificado MsmeBooks?',
      subtitle: 'Poupe centenas de horas na configuração, elimine multas fiscais (AGT, AT) e maximize o retorno do seu investimento.',
      reason1Title: 'Conformidade Fiscal e Tributária Certificada',
      reason1Desc: 'Formação rigorosa nos regimes fiscais locais e software homologado para faturação eletrónica.',
      reason2Title: 'Instalação Completa de Hardware POS e Inventário',
      reason2Desc: 'Configuração de impressoras térmicas, leitores de código de barras e sincronização multi-lojas.',
      reason3Title: 'Suporte Dedicado Local e Remoto',
      reason3Desc: 'Respostas rápidas no seu fuso horário e idioma, com formação de pessoal e migração de dados.',
    },
    footer: {
      tagline: 'Ecossistema oficial de parceiros certificados para Contabilidade MsmeBooks, POS em Nuvem e Gestão Multi-Filiais.',
      allRightsReserved: 'Todos os direitos reservados. Programa de Parceiros MsmeBooks.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
      partnerAgreement: 'Acordo de Parceria',
    },
  },

  // ==========================================
  // ARABIC (العربية) - North Africa & Middle East
  // ==========================================
  ar: {
    nav: {
      registryBadge: 'السجل العالمي ٢٠٢٦',
      tagline: 'المنظومة الرسمية لشركاء MsmeBooks المعتمدين للمحاسبة ونقاط البيع وإدارة الفروع',
      directory: 'دليل الشركاء',
      bestMatch: 'المطابقة الذكية',
      globalMap: 'الخريطة العالمية',
      industries: 'القطاعات',
      countries: 'الدول',
      spotlight: 'قصص نجاح العملاء',
      tiers: 'المستويات والمزايا',
      referEarn: 'الإحالة والأرباح',
      faqs: 'الأسئلة الشائعة',
      partnerLogin: 'دخول الشريك',
      becomePartner: 'كن شريكاً',
      scanQr: 'مسح رمز الاستجابة',
      selectLanguage: 'اللغة',
    },
    hero: {
      badge: 'منظومة معتمدة على مستوى أفريقيا والعالم',
      title: 'اعثر على شريك MsmeBooks المعتمد بالقرب منك',
      titleAccent: 'بالقرب منك',
      subtitle: 'تواصل مع نخبة من المحاسبين المعتمدين وخبراء أنظمة نقاط البيع وحلول السحابة في ٥٤ دولة أفريقية وحول العالم. تسريع الإعداد والامتثال الضريبي ونمو أعمالك.',
      searchPlaceholder: 'ابحث باسم الشريك أو التخصص أو المدينة...',
      countryLabel: 'الدولة',
      allCountries: 'جميع الدول (أفريقيا والعالم)',
      cityLabel: 'المدينة / الموقع',
      cityPlaceholder: 'مثال: القاهرة، الدار البيضاء، دبي، الرياض...',
      industryLabel: 'القطاع التجاري',
      allIndustries: 'كافة القطاعات',
      findPartnersBtn: 'بحث عن شركاء',
      trustedBy: 'يحظى بثقة أكثر من ١٠,٠٠٠ شركة في ٥٤ دولة أفريقية ومراكز تجارية عالمية',
      topRatedPill: 'الأعلى تقييماً',
      fastResponsePill: 'استجابة سريعة (< ساعة)',
      acceptingPill: 'يقبل عملاء جدد',
      remotePill: 'دعم عن بُعد متوفر',
      enterprisePill: 'جاهز للشركات والفروع المتعددة',
    },
    directory: {
      title: 'دليل الشركاء المعتمدين',
      subtitle: 'تصفية الشركاء المعتمدين حسب الدولة والمدينة والخبرة وتقييمات العملاء.',
      searchPlaceholder: 'البحث باسم الشريك أو المدينة أو التخصص...',
      refineFilters: 'تصفية النتائج',
      clearAll: 'إلغاء الفلاتر',
      country: 'الدولة',
      city: 'المدينة',
      partnerType: 'فئة الشريك',
      allTypes: 'كافة الفئات',
      industry: 'القطاع المستهدف',
      allIndustries: 'كافة القطاعات',
      verifiedOnly: 'شركاء معتمدون فقط',
      acceptingOnly: 'يقبل عملاء جدد فقط',
      remoteOnly: 'يدعم العمل عن بُعد',
      sortBy: 'ترتيب الدليل',
      sortRecommended: 'الموصى به (افتراضي)',
      sortRating: 'الأعلى تقييماً من العملاء',
      sortExperience: 'الأكثر خبرة',
      sortReviews: 'الأكثر مراجعات',
      sortImplementations: 'الأكثر تنفيذاً للمشاريع',
      resultsCount: 'عرض {{count}} شريك معتمد',
      noResults: 'لم يتم العثور على شركاء يطابقون معايير البحث بدقة',
      noLocalOffices: 'لا توجد مكاتب مباشرة في {{country}} حالياً',
      remoteOffer: 'يوفر شركاؤنا المعتمدون في أفريقيا والعالم إعداداً سحابياً كاملاً ودعماً عن بُعد واستشارات مخصصة للشركات في {{country}}.',
      viewRemotePartners: 'عرض الشركاء الداعمين للعمل عن بُعد',
    },
    partnerCard: {
      verifiedExpert: 'خبير معتمد',
      inReview: 'خبير • قيد التدقيق',
      trustScore: 'مؤشر الثقة',
      viewProfile: 'عرض الملف',
      requestConsultation: 'طلب استشارة',
      contact: 'تواصل مع الشريك',
      compare: 'مقارنة',
      askQuestion: 'طرح سؤال',
      experienceYears: 'سنوات من الخبرة',
      implementations: 'مشاريع ناجحة',
      rating: 'تقييم العملاء',
      respondsIn: 'الرد خلال {{time}}',
      fastestResponder: 'الأسرع استجابة',
      topRated: 'الأعلى تقييماً',
      acceptingClients: 'يقبل عملاء',
      currentlyBooked: 'محجوز بالكامل حالياً',
    },
    stats: {
      partnersCount: '+٥٠٠',
      partnersLabel: 'شريك معتمد',
      countriesCount: '١٠٩',
      countriesLabel: 'دولة ومركز عالمي',
      businessesCount: '+١٥,٠٠٠',
      businessesLabel: 'منشأة تستخدم النظام',
      satisfactionCount: '٩٩.٤٪',
      satisfactionLabel: 'نسبة رضا العملاء',
    },
    smartMatch: {
      badge: 'المطابقة الذكية للشركاء',
      title: 'اعثر على شريكك المثالي في ٦٠ ثانية',
      subtitle: 'أجب عن ٥ أسئلة سريعة حول طبيعة نشاطك ومتطلباتك لمطابقتك مع أفضل الشركاء المعتمدين.',
      getMatched: 'بدء المطابقة الذكية',
    },
    countriesSection: {
      badge: 'تغطية شاملة لأفريقيا والعالم (٥٤ دولة أفريقية + مراكز عالمية)',
      title: 'استكشف شركاء MsmeBooks حسب الدولة',
      subtitle: 'تواصل مع نخبة من الشركاء في المحاسبة وتكنولوجيا الأعمال في جميع دول أفريقيا الـ ٥٤ والمراكز التجارية الكبرى.',
      allRegions: 'كافة المناطق',
      africaNations: 'أفريقيا (٥٤ دولة)',
      globalHubs: 'المراكز العالمية',
      searchPlaceholder: 'ابحث عن دولة أو منطقة أو مدينة (مثال: القاهرة، دبي، الدار البيضاء)...',
      explorePartners: 'استكشاف الشركاء',
    },
    whyWork: {
      title: 'لماذا تختار شريكاً معتمداً من MsmeBooks؟',
      subtitle: 'وفر مئات الساعات في الإعداد وتجنب الغرامات الضريبية واحصل على أقصى عائد استثماري لنشاطك التجاري.',
      reason1Title: 'امتثال ضريبي ومحاسبي معتمد',
      reason1Desc: 'تدريب احترافي على الأنظمة الضريبية المحلية والفوترة الإلكترونية لضمان الجاهزية التامة للمراجعة.',
      reason2Title: 'إعداد متكامل لأجهزة نقاط البيع والمخازن',
      reason2Desc: 'تركيب طابعات الإيصالات وقارئات الباركود وشاشات المطابخ ومزامنة الفروع ومستويات المخزون.',
      reason3Title: 'دعم فني محلي وعن بُعد مخصص',
      reason3Desc: 'سرعة استجابة فائقة في نطاقك الزمني وبلغتك الأم مع تدريب مستمر لطاقم العمل.',
    },
    footer: {
      tagline: 'المنظومة الرسمية للشركاء المعتمدين لبرنامج محاسبة المنشآت ونقاط البيع السحابية MsmeBooks.',
      allRightsReserved: 'جميع الحقوق محفوظة. برنامج شركاء MsmeBooks.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      partnerAgreement: 'اتفاقية الشريك',
    },
  },

  // ==========================================
  // YORUBA (Yorùbá) - Nigeria, Benin, West Africa
  // ==========================================
  yo: {
    nav: {
      registryBadge: 'Akọsílẹ̀ Àgbáyé 2026',
      tagline: 'Ètò Oníṣẹ́ Àkọ́kọ́ MsmeBooks fún Ìṣirò Owó, POS àti Ìṣàkóso Ẹ̀ka Púpọ̀',
      directory: 'Àkójọ Àwọn Alájọṣe',
      bestMatch: 'Wá Alájọṣe Tí Ó Dárajù',
      globalMap: 'Àwòrán Ilẹ̀ Àgbáyé',
      industries: 'Àwọn Ẹ̀ka Iṣẹ́',
      countries: 'Àwọn Orílẹ̀-èdè',
      spotlight: 'Àwọn Àṣeyọrí Oníbàárà',
      tiers: 'Àwọn Ipò & Àǹfààní',
      referEarn: 'Tọ́ka & Gba Owó',
      faqs: 'Àwọn Ìbéèrè',
      partnerLogin: 'Wọlé Alájọṣe',
      becomePartner: 'Di Alájọṣe',
      scanQr: 'Ṣàyẹ̀wò QR',
      selectLanguage: 'Èdè',
    },
    hero: {
      badge: 'Ètò Oníṣẹ́ Àfíríkà & Àgbáyé Tí A Fọwọ́sí',
      title: 'Wá Alájọṣe MsmeBooks Tí O Lè Gbẹ́kẹ̀lé Nítòsí Rẹ',
      titleAccent: 'Nítòsí Rẹ',
      subtitle: 'Bá àwọn akọ́ṣẹ́mọṣẹ́ olùṣirò owó, oníṣẹ́ POS, àti olùbánisọ̀rọ̀ software cloud sọ̀rọ̀ jákèjádò orílẹ̀-èdè 54 ní Áfíríkà àti kárí ayé. Tètè bẹ̀rẹ̀, tẹ̀lé òfin owó-orí, kí o sì mú iṣẹ́ rẹ gbòòrò.',
      searchPlaceholder: 'Wá orúkọ alájọṣe, ẹ̀kọ́ iṣẹ́ tàbí ìlú...',
      countryLabel: 'Orílẹ̀-èdè',
      allCountries: 'Gbogbo Orílẹ̀-èdè (Áfíríkà & Àgbáyé)',
      cityLabel: 'Ìlú',
      cityPlaceholder: 'f.a. Èkó, Abùjá, Port Harcourt, Ìbàdàn...',
      industryLabel: 'Ẹ̀ka Iṣẹ́',
      allIndustries: 'Gbogbo Ẹ̀ka Iṣẹ́',
      findPartnersBtn: 'Wá Àwọn Alájọṣe',
      trustedBy: 'Ó ju ilé-iṣẹ́ 10,000 lọ tí wọ́n gbẹ́kẹ̀lé wa kárí Áfíríkà àti àgbáyé',
      topRatedPill: 'Àwọn Tí Ó Ga Jùlọ',
      fastResponsePill: 'Ìdáhùn Kíákíá (< wákàtí 1)',
      acceptingPill: 'Ń Gba Oníbàárà Tuntun',
      remotePill: 'Àtìlẹ́yìn Látọ̀nà Jínjìn',
      enterprisePill: 'Ẹ̀ka Púpọ̀ fún Ilé-iṣẹ́ Nlá',
    },
    directory: {
      title: 'Àkójọ Àwọn Alájọṣe Tí A Fọwọ́sí',
      subtitle: 'Ṣàyẹ̀wò àwọn alájọṣe nípa orílẹ̀-èdè, ìlú, ìmọ̀ iṣẹ́ àti ìgbéléwọ̀n oníbàárà.',
      searchPlaceholder: 'Wá orúkọ alájọṣe, ìlú, iṣẹ́...',
      refineFilters: 'Ṣàkóso Àwọn Ajọ̀',
      clearAll: 'Pa Gbogbo Rẹ̀ Rẹ́',
      country: 'Orílẹ̀-èdè',
      city: 'Ìlú',
      partnerType: 'Oríṣi Alájọṣe',
      allTypes: 'Gbogbo Oríṣi Alájọṣe',
      industry: 'Ẹ̀ka Iṣẹ́ Pàtó',
      allIndustries: 'Gbogbo Ẹ̀ka Iṣẹ́',
      verifiedOnly: 'Àwọn Tí A Fọwọ́sí Nìkan',
      acceptingOnly: 'Àwọn Tí Ń Gba Oníbàárà Nìkan',
      remoteOnly: 'Àtìlẹ́yìn Látọ̀nà Jínjìn',
      sortBy: 'Tò Àwọn Àbájáde',
      sortRecommended: 'Èyí Tí A Dábàá',
      sortRating: 'Ìgbéléwọ̀n Oníbàárà Tí Ó Ga Jù',
      sortExperience: 'Onírìírí Jùlọ',
      sortReviews: 'Àwọn Àlàyé Púpọ̀ Jù',
      sortImplementations: 'Iṣẹ́ Tí A Ṣe Púpọ̀ Jù',
      resultsCount: 'A ń fi àwọn alájọṣe {{count}} hàn',
      noResults: 'Kò sí alájọṣe tí ó bá àwọn ìwádìí rẹ mu gan-an',
      noLocalOffices: 'Kò tíì sí ọ́fíìsì tààrà ní {{country}}',
      remoteOffer: 'Àwọn alájọṣe wa tí a fọwọ́sí kárí Áfíríkà àti àgbáyé ń pèsè ìmúrasílẹ̀ cloud látọ̀nà jínjìn àti ìtọ́sọ́nà fún àwọn oníṣòwò ní {{country}}.',
      viewRemotePartners: 'Wo Àwọn Alájọṣe Látọ̀nà Jínjìn',
    },
    partnerCard: {
      verifiedExpert: 'Akọ́ṣẹ́mọṣẹ́ Tí A Fọwọ́sí',
      inReview: 'Akọ́ṣẹ́mọṣẹ́ • Ń Yẹ̀wò',
      trustScore: 'Àmì Ìgbẹ́kẹ̀lé',
      viewProfile: 'Wo Ìrísí',
      requestConsultation: 'Béèrè fún Ìbánisọ̀rọ̀',
      contact: 'Kàn sí Alájọṣe',
      compare: 'Fi Wé',
      askQuestion: 'Béèrè Ìbéèrè',
      experienceYears: 'Ọdún Ìrírí',
      implementations: 'Iṣẹ́ Tí Ó Yọrí Sí Rere',
      rating: 'Ìgbéléwọ̀n Oníbàárà',
      respondsIn: 'Ń dáhùn láàárín {{time}}',
      fastestResponder: 'Olùdáhùn Kíákíá Jù',
      topRated: 'Olókìkí Jùlọ',
      acceptingClients: 'Ń Gba Oníbàárà',
      currentlyBooked: 'Kò Sí Àyè Lọ́wọ́lọ́wọ́',
    },
    stats: {
      partnersCount: '500+',
      partnersLabel: 'Alájọṣe Tí A Fọwọ́sí',
      countriesCount: '109',
      countriesLabel: 'Orílẹ̀-èdè Áfíríkà & Àgbáyé',
      businessesCount: '15,000+',
      businessesLabel: 'Ilé-iṣẹ́ Tí A Ṣe Àtúnṣe Sí',
      satisfactionCount: '99.4%',
      satisfactionLabel: 'Ìtẹ́lọ́rùn Oníbàárà',
    },
    smartMatch: {
      badge: 'Ìwárí Ọlọ́gbọ́n fún Alájọṣe',
      title: 'Wá Alájọṣe Rẹ Tí Ó Yẹ Ní Ìṣẹ́jú-aaya 60',
      subtitle: 'Dáhùn àwọn ìbéèrè díẹ̀ nípa iṣẹ́ rẹ kí a lè so ọ́ pọ̀ mọ́ alájọṣe tó dára jùlọ.',
      getMatched: 'Bẹ̀rẹ̀ Ìwárí Ọlọ́gbọ́n',
    },
    countriesSection: {
      badge: 'Àkójọpọ̀ Áfíríkà & Àgbáyé (Gbogbo Orílẹ̀-èdè 54 ní Áfíríkà)',
      title: 'Ṣàwárí Àwọn Alájọṣe MsmeBooks Nípa Orílẹ̀-èdè',
      subtitle: 'Bá àwọn alájọṣe olùṣirò owó àti ìmọ̀-ẹ̀rọ sọ̀rọ̀ ní gbogbo orílẹ̀-èdè 54 ní Áfíríkà àti àgbáyé.',
      allRegions: 'Gbogbo Agbègbè',
      africaNations: 'Áfíríkà (Orílẹ̀-èdè 54)',
      globalHubs: 'Àwọn Ilé-iṣẹ́ Àgbáyé',
      searchPlaceholder: 'Wá orílẹ̀-èdè tàbí ìlú (f.a. Èkó, Nairobi, London)...',
      explorePartners: 'Ṣàwárí Àwọn Alájọṣe',
    },
    whyWork: {
      title: 'Èéṣe Tí O Fi Gbọ́dọ̀ Bá Alájọṣe MsmeBooks Tí A Fọwọ́sí Ṣiṣẹ́?',
      subtitle: 'Fi ọ̀pọ̀lọpọ̀ wákàtí pamọ́, yẹra fún ìtanràn owó-orí (FIRS, LIRS), kí o sì jèrè púpọ̀.',
      reason1Title: 'Ìtẹ̀lé Òfin Owó-orí Tí A Fọwọ́sí',
      reason1Desc: 'Ìkẹ́kọ̀ọ́ tó péye nípa òfin orílẹ̀-èdè láti rí i dájú pé gbogbo ìwé owó rẹ wà ní àlàáfíà.',
      reason2Title: 'Ìṣètò Ẹ̀rọ POS & Ìṣirò Ọjà',
      reason2Desc: 'Pípèsè ẹ̀rọ ìtẹ̀wé risiti, ẹ̀rọ kíkà barcode, àti ìṣọ̀kan àwọn ilé-ìtajà púpọ̀.',
      reason3Title: 'Àtìlẹ́yìn Lójúkojú àti Látọ̀nà Jínjìn',
      reason3Desc: 'Ìdáhùn kíákíá ní èdè rẹ àti àkókò rẹ pẹ̀lú ìkẹ́kọ̀ọ́ fún àwọn òṣìṣẹ́ rẹ.',
    },
    footer: {
      tagline: 'Ètò oníṣẹ́ alájọṣe fún Ìṣirò Owó MsmeBooks, POS Cloud àti Ẹ̀ka Púpọ̀.',
      allRightsReserved: 'Gbogbo ẹ̀tọ́ wà ní ìpamọ́. Ètò Alájọṣe MsmeBooks.',
      privacy: 'Àdéhùn Àṣírí',
      terms: 'Àwọn Òfin Ìṣiṣẹ́',
      partnerAgreement: 'Àdéhùn Alájọṣe',
    },
  },

  // ==========================================
  // HAUSA (Hausa) - Northern Nigeria, Niger, West Africa
  // ==========================================
  ha: {
    nav: {
      registryBadge: 'Rijistar Duniya 2026',
      tagline: 'Tsarukan Haɗin Gwiwa na MsmeBooks don Ƙididdiga, POS da Sarrafa Rassa',
      directory: 'Jerin Abokan Hulɗa',
      bestMatch: 'Nemo Mafi Dacewa',
      globalMap: 'Taswirar Duniya',
      industries: 'Bangarorin Kasuwanci',
      countries: 'Ƙasashe',
      spotlight: 'Nasarorin Abokan Ciniki',
      tiers: 'Matakai & Fa’idodi',
      referEarn: 'Tura & Samu',
      faqs: 'Tambayoyi',
      partnerLogin: 'Shiga Abokin Hulɗa',
      becomePartner: 'Zama Abokin Hulɗa',
      scanQr: 'Bincika QR',
      selectLanguage: 'Harshe',
    },
    hero: {
      badge: 'Amintaccen Tsarin Afirka da Duniya',
      title: 'Nemo Abokin Hulɗar MsmeBooks Amintacce Kusa da Kai',
      titleAccent: 'Kusa da Kai',
      subtitle: 'Haɗa kai da ƙwararrun akantoci, ƙwararrun injinan POS, da masu ba da shawara kan software na girgije a cikin ƙasashe 54 na Afirka da duniya. Hanzarta fara aiki, bi ƙa’idojin haraji, da faɗaɗa kasuwancin ku.',
      searchPlaceholder: 'Bincika sunan abokin hulɗa, ƙwarewa ko birni...',
      countryLabel: 'Ƙasa',
      allCountries: 'Dukkan Ƙasashe (Afirka & Duniya)',
      cityLabel: 'Birni / Wuri',
      cityPlaceholder: 'misali: Kano, Abuja, Lagos, Kaduna...',
      industryLabel: 'Bangaren Kasuwanci',
      allIndustries: 'Dukkan Bangarori',
      findPartnersBtn: 'Nemo Abokan Hulɗa',
      trustedBy: 'Kamfanoni sama da 10,000 ne suka amince da mu a faɗin ƙasashe 54 na Afirka da duniya',
      topRatedPill: 'Mafi Ƙwarewa',
      fastResponsePill: 'Amsa Cikin Sauri (< awa 1)',
      acceptingPill: 'Ana Karɓar Sabbin Abokan Ciniki',
      remotePill: 'Taimako Daga Nesa',
      enterprisePill: 'Rassa Masu Yawa don Manyan Kamfanoni',
    },
    directory: {
      title: 'Jerin Abokan Hulɗa Masu Tabbaci',
      subtitle: 'Tace abokan hulɗa ta ƙasa, birni, ƙwarewa, da kimantawar abokan ciniki.',
      searchPlaceholder: 'Bincika ta sunan abokin hulɗa, birni, hidima...',
      refineFilters: 'Tace Sakamako',
      clearAll: 'Share Duk Tacewa',
      country: 'Ƙasa',
      city: 'Birni',
      partnerType: 'Rukunin Abokin Hulɗa',
      allTypes: 'Dukkan Nau’o’in Abokan Hulɗa',
      industry: 'Bangaren Aiki',
      allIndustries: 'Dukkan Bangarori',
      verifiedOnly: 'Abokan Hulɗa Masu Tabbaci Kaɗai',
      acceptingOnly: 'Masu Karɓar Abokan Ciniki Kaɗai',
      remoteOnly: 'Taimako Daga Nesa',
      sortBy: 'Tsara Jeri',
      sortRecommended: 'Wanda Aka Ba da Shawara',
      sortRating: 'Mafi Ƙimar Abokan Ciniki',
      sortExperience: 'Mafi Yawan Ƙwarewa',
      sortReviews: 'Mafi Yawan Sharhi',
      sortImplementations: 'Mafi Yawan Ayyukan Da Aka Kammala',
      resultsCount: 'Ana nuna abokan hulɗa {{count}} masu tabbaci',
      noResults: 'Babu abokin hulɗar da ya dace da abubuwan da kuke nema daidai',
      noLocalOffices: 'Babu ofishi kai tsaye a cikin {{country}} a yanzu',
      remoteOffer: 'Abokan hulɗarmu masu tabbaci a Afirka da duniya suna ba da cikakken saitin girgije da jagora daga nesa ga kasuwanci a {{country}}.',
      viewRemotePartners: 'Duba Abokan Hulɗa Daga Nesa',
    },
    partnerCard: {
      verifiedExpert: 'Ƙwararre Mai Tabbaci',
      inReview: 'Ƙwararre • Ana Dubawa',
      trustScore: 'Makin Dogaro',
      viewProfile: 'Duba Bayani',
      requestConsultation: 'Nemi Shawara',
      contact: 'Tuntuɓi Abokin Hulɗa',
      compare: 'Kwatanta',
      askQuestion: 'Yi Tambaya',
      experienceYears: 'Shekarun Ƙwarewa',
      implementations: 'Ayyukan Da Suka Yi Nasara',
      rating: 'Kimantawar Abokan Ciniki',
      respondsIn: 'Yana amsawa a cikin {{time}}',
      fastestResponder: 'Mafi Saurin Amsawa',
      topRated: 'Wanda Aka Fi Ƙima',
      acceptingClients: 'Yana Karɓar Abokan Ciniki',
      currentlyBooked: 'Babu Wuri a Yanzu',
    },
    stats: {
      partnersCount: '500+',
      partnersLabel: 'Abokan Hulɗa Masu Tabbaci',
      countriesCount: '109',
      countriesLabel: 'Ƙasashen Afirka & Duniya',
      businessesCount: '15,000+',
      businessesLabel: 'Kasuwancin Da Aka Ƙarfafa',
      satisfactionCount: '99.4%',
      satisfactionLabel: 'Gamsuwar Abokan Ciniki',
    },
    smartMatch: {
      badge: 'Neman Abokin Hulɗa Mai Fasaha',
      title: 'Nemo Abokin Hulɗar Da Ya Dace Cikin Daƙiƙa 60',
      subtitle: 'Amsa ƴan tambayoyi game da kasuwancin ku don haɗa ku da abokan hulɗar da suka dace.',
      getMatched: 'Fara Bincike Mai Fasaha',
    },
    countriesSection: {
      badge: 'Faɗin Afirka & Duniya (Dukkan Ƙasashen Afirka 54)',
      title: 'Bincika Abokan Hulɗar MsmeBooks ta Ƙasa',
      subtitle: 'Haɗu da ƙwararrun akantoci da fasaha a cikin ƙasashe 54 na Afirka da manyan cibiyoyin kasuwanci na duniya.',
      allRegions: 'Duk Yankuna',
      africaNations: 'Afirka (Ƙasashe 54)',
      globalHubs: 'Cibiyoyin Duniya',
      searchPlaceholder: 'Bincika ƙasa ko birni (misali: Kano, Nairobi, London)...',
      explorePartners: 'Bincika Abokan Hulɗa',
    },
    whyWork: {
      title: 'Me Ya Sa Za Ku Yi Aiki da Abokin Hulɗar MsmeBooks Mai Tabbaci?',
      subtitle: 'Ajiye ɗaruruwan sa’o’i kan saiti, guje wa tarar haraji (FIRS, KRA), da haɓaka ribar kasuwanci.',
      reason1Title: 'Cikakken Biyayya Ga Dokokin Haraji',
      reason1Desc: 'Horon ƙwararru kan dokokin haraji na cikin gida don tabbatar da tsaftar lissafin ku.',
      reason2Title: 'Kammala Saitin Kayan Aikin POS & Kayan Ajiya',
      reason2Desc: 'Saita injin buga takardun biya, na’urar duba barcode, da daidaita rassa da yawa tare.',
      reason3Title: 'Taimako Na Kai Tsaye da Na Daga Nesa',
      reason3Desc: 'Amsa cikin sauri a lokacin yankin ku da yaren ku tare da horar da ma’aikatan ku.',
    },
    footer: {
      tagline: 'Tsarin hukuma na abokan hulɗa don Akantocin MsmeBooks, POS na Girgije da Rassa Masu Yawa.',
      allRightsReserved: 'Dukkan haƙƙoƙi an kiyaye su. Shirin Abokin Hulɗa na MsmeBooks.',
      privacy: 'Manufar Tsare Sirri',
      terms: 'Sharuddan Hidima',
      partnerAgreement: 'Yarjejeniyar Abokin Hulɗa',
    },
  },
};
