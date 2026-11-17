import { LanguageCode } from '../types/language';

export interface Translations {
  nav: {
    home: string;
    aboutUs: string;
    solutions: string;
    careers: string;
    recruitmentModule: string;
    pricingPlans: string;
    ourCulture: string;
    faqs: string;
    signIn: string;
    signUp: string;
    postJob: string;
    aiAdvisor: string;
    talentRecruitment: string;
    adminModeActive: string;
    adminModeDesc: string;
    exitCandidateView: string;
    viewBookmarks: string;
    bookmarks: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    searchPlaceholder: string;
    allDepartments: string;
    allLocations: string;
    searchJobsBtn: string;
    activePositions: string;
    africanHubs: string;
    verifiedEmployers: string;
    hiringRate: string;
    explorePositions: string;
    postJobOpening: string;
  };
  filters: {
    title: string;
    available: string;
    reset: string;
    searchCompanies: string;
    companyEmployer: string;
    department: string;
    location: string;
    workArrangement: string;
    salaryRange: string;
    minMonthlySalary: string;
    currency: string;
    experienceLevel: string;
    employmentType: string;
    datePosted: string;
    anyTime: string;
    last24h: string;
    last7d: string;
    last14d: string;
    last30d: string;
    activeFilters: string;
    clearAll: string;
    savedBookmarks: string;
    endOfFilters: string;
    scrollToTop: string;
    allArrangements: string;
    allCurrencies: string;
  };
  jobs: {
    openOpportunities: string;
    discoverNext: string;
    discoverDesc: string;
    noMatches: string;
    noMatchesDesc: string;
    applyNow: string;
    viewDetails: string;
    bookmark: string;
    bookmarked: string;
    roleClosingSoon: string;
    deadline: string;
    featured: string;
    remote: string;
    hybrid: string;
    onSite: string;
    fullTime: string;
    partTime: string;
    contract: string;
    internship: string;
    perMonth: string;
    perYear: string;
    competitiveRemuneration: string;
    experience: string;
    posted: string;
  };
  application: {
    applyFor: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    fastTrackTitle: string;
    fastTrackDesc: string;
    uploadCv: string;
    reuploadCv: string;
    syncFromLinkedIn: string;
    quickDemo: string;
    personalContact: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    yearsOfExperience: string;
    currentJobTitle: string;
    linkedinUrl: string;
    portfolioUrl: string;
    earliestStartDate: string;
    coverLetter: string;
    uploadResumeTitle: string;
    screeningQuestions: string;
    consentText: string;
    continueBtn: string;
    backBtn: string;
    submitApplication: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    referenceCode: string;
    trackStatusNotice: string;
    addCalendarBtn: string;
    downloadSummary: string;
    closeBtn: string;
  };
  linkedinSync: {
    modalTitle: string;
    badge: string;
    modalDesc: string;
    urlLabel: string;
    urlPlaceholder: string;
    trySample: string;
    oneClickPreview: string;
    agentParsing: string;
    statusConnecting: string;
    statusExtracting: string;
    statusSynthesizing: string;
    cancelBtn: string;
    syncBtn: string;
    syncingBtn: string;
    successToast: string;
  };
  whyWorkHere: {
    kicker: string;
    title: string;
    desc: string;
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Title: string;
    benefit3Desc: string;
    benefit4Title: string;
    benefit4Desc: string;
    benefit5Title: string;
    benefit5Desc: string;
    benefit6Title: string;
    benefit6Desc: string;
  };
  pricing: {
    kicker: string;
    title: string;
    subtitle: string;
    desc: string;
    chooseCycle: string;
    monthly: string;
    quarterly: string;
    biyearly: string;
    yearly: string;
    saveBadge: string;
    singlePlan: string;
    bulkPlan: string;
    enterprisePlan: string;
    selectPlanBtn: string;
  };
  common: {
    search: string;
    cancel: string;
    save: string;
    close: string;
    loading: string;
    success: string;
    error: string;
    or: string;
    back: string;
    next: string;
    submit: string;
    view: string;
    clear: string;
    edit: string;
    delete: string;
    language: string;
    selectLanguage: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  // ==========================================
  // ENGLISH (Default / International)
  // ==========================================
  en: {
    nav: {
      home: 'Home',
      aboutUs: 'About Us',
      solutions: 'Solutions',
      careers: 'Careers',
      recruitmentModule: 'Recruitment Module',
      pricingPlans: 'Pricing Plans',
      ourCulture: 'Our Culture',
      faqs: 'FAQs',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      postJob: 'Post a Job',
      aiAdvisor: 'AI Advisor',
      talentRecruitment: 'Talent & Recruitment',
      adminModeActive: 'Recruiter Admin Mode Active',
      adminModeDesc: 'Managing vacancies, reviewing candidate resumes & hiring pipeline',
      exitCandidateView: 'Exit to Candidate View',
      viewBookmarks: 'View Bookmarked Jobs',
      bookmarks: 'Bookmarks',
    },
    hero: {
      badge: 'Pan-African Talent Network · Open Hiring Ecosystem',
      headline: 'Build the Digital Future of African Commerce',
      subheadline:
        'Join high-growth MSMEs, fintech pioneers, and international enterprises hiring top engineers, product leaders, accountants, and commercial talent across Africa.',
      searchPlaceholder: 'Search by role, programming language, skill, or keyword...',
      allDepartments: 'All Departments',
      allLocations: 'All Locations / Remote',
      searchJobsBtn: 'Search Opportunities',
      activePositions: 'Active Positions',
      africanHubs: 'African Hubs',
      verifiedEmployers: 'Verified Employers',
      hiringRate: 'Fast-Track Hiring',
      explorePositions: 'Explore Open Positions',
      postJobOpening: 'Post a Job Opening',
    },
    filters: {
      title: 'Filters',
      available: 'available',
      reset: 'Reset',
      searchCompanies: 'Search employers...',
      companyEmployer: 'Company / Employer',
      department: 'Department',
      location: 'Location & Hubs',
      workArrangement: 'Work Arrangement',
      salaryRange: 'Salary Range',
      minMonthlySalary: 'Min Monthly',
      currency: 'Currency',
      experienceLevel: 'Experience Level',
      employmentType: 'Employment Type',
      datePosted: 'Date Posted',
      anyTime: 'Any time',
      last24h: 'Last 24 hours',
      last7d: 'Last 7 days',
      last14d: 'Last 14 days',
      last30d: 'Last 30 days',
      activeFilters: 'Active filters:',
      clearAll: 'Clear all',
      savedBookmarks: 'Saved Bookmarks',
      endOfFilters: 'End of filters',
      scrollToTop: 'Scroll to top',
      allArrangements: 'All Arrangements',
      allCurrencies: 'All Currencies',
    },
    jobs: {
      openOpportunities: 'Open Opportunities',
      discoverNext: 'Discover Your Next Opportunity',
      discoverDesc: 'Explore exciting opportunities to grow your career and make a meaningful impact across Africa.',
      noMatches: 'No Matching Opportunities',
      noMatchesDesc: 'We could not find active job openings matching your current filter combinations. Try loosening your criteria or join our Talent Community below.',
      applyNow: 'Apply Now',
      viewDetails: 'View Details',
      bookmark: 'Save Job',
      bookmarked: 'Saved',
      roleClosingSoon: 'Closing Soon',
      deadline: 'Deadline',
      featured: 'Featured Role',
      remote: 'Remote',
      hybrid: 'Hybrid',
      onSite: 'On-Site',
      fullTime: 'Full-Time',
      partTime: 'Part-Time',
      contract: 'Contract',
      internship: 'Internship',
      perMonth: '/month',
      perYear: '/year',
      competitiveRemuneration: 'Competitive Remuneration',
      experience: 'Experience',
      posted: 'Posted',
    },
    application: {
      applyFor: 'Apply for Position',
      step1: '1. Personal Info',
      step2: '2. Experience',
      step3: '3. Resume & Skills',
      step4: '4. Submitted',
      fastTrackTitle: 'AI Resume Fast-Track',
      fastTrackDesc: 'Upload your PDF/DOCX CV or sync directly from your public LinkedIn profile. Our AI Agent extracts your experience and auto-fills this application.',
      uploadCv: 'Upload CV (PDF/DOCX)',
      reuploadCv: 'Re-upload / Replace CV',
      syncFromLinkedIn: 'Sync from LinkedIn',
      quickDemo: 'Quick Demo:',
      personalContact: 'Personal Contact Details',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number (with Country Code)',
      country: 'Country of Residence',
      city: 'City / Location',
      yearsOfExperience: 'Years of Experience',
      currentJobTitle: 'Current / Most Recent Job Title',
      linkedinUrl: 'LinkedIn Profile URL',
      portfolioUrl: 'Portfolio / GitHub / Website URL',
      earliestStartDate: 'Earliest Start Date',
      coverLetter: 'Executive Summary / Cover Note',
      uploadResumeTitle: 'Resume / Curriculum Vitae',
      screeningQuestions: 'Role Screening Questions',
      consentText: 'I confirm that the submitted information is accurate and consent to MsmeBooks processing my application for recruitment evaluation.',
      continueBtn: 'Continue',
      backBtn: 'Back',
      submitApplication: 'Submit Application',
      submitting: 'Submitting Application...',
      successTitle: 'Application Successfully Submitted!',
      successDesc: 'Thank you for applying. Your application has been logged into the recruitment pipeline with your AI match score.',
      referenceCode: 'Application Reference Code',
      trackStatusNotice: 'Please save your reference code for tracking your status and upcoming interview invitations.',
      addCalendarBtn: 'Add to Calendar',
      downloadSummary: 'Download Confirmation (.ics)',
      closeBtn: 'Close',
    },
    linkedinSync: {
      modalTitle: 'Sync from LinkedIn',
      badge: 'AI Agent',
      modalDesc: 'Enter your public LinkedIn profile URL. Our AI Agent will parse your public-facing resume and profile data to pre-fill your application.',
      urlLabel: 'Public LinkedIn Profile URL',
      urlPlaceholder: 'https://www.linkedin.com/in/username',
      trySample: 'Or try a sample public profile:',
      oneClickPreview: 'One-click AI preview',
      agentParsing: 'AI Agent Parsing Profile',
      statusConnecting: 'Connecting to public LinkedIn profile...',
      statusExtracting: 'AI Agent extracting public resume, work history & competencies...',
      statusSynthesizing: 'Synthesizing ATS-grade candidate profile & matching role skills...',
      cancelBtn: 'Cancel',
      syncBtn: 'Sync & Auto-Fill Form',
      syncingBtn: 'Syncing...',
      successToast: 'Successfully synced from LinkedIn! Form pre-filled by AI Agent.',
    },
    whyWorkHere: {
      kicker: 'Why Join Our Team',
      title: 'More Than a Job. Build Something That Matters.',
      desc: 'At MsmeBooks, our mission is to empower millions of micro, small, and medium businesses with intuitive, scalable technology.',
      benefit1Title: 'Meaningful Impact',
      benefit1Desc: 'Help micro, small, and medium businesses across Africa and worldwide operate efficiently, eliminate paper leaks, and scale sustainable enterprises.',
      benefit2Title: 'Innovation & Modern Tech',
      benefit2Desc: 'Work on modern cloud-based SaaS, offline-first POS sync architectures, and intelligent business tools built for resilient performance.',
      benefit3Title: 'Career Development',
      benefit3Desc: 'Structured opportunities to deepen domain expertise, take on executive ownership, and advance rapidly in a high-growth Pan-African software ecosystem.',
      benefit4Title: 'Collaborative Culture',
      benefit4Desc: 'Collaborate with talented engineers, designers, accountants, and commercial leaders across Lagos, Nairobi, Kigali, Accra, and Johannesburg.',
      benefit5Title: 'Growth Opportunities',
      benefit5Desc: 'Contribute to building critical digital infrastructure that expands financial inclusion and formalizes retail trade across emerging markets.',
      benefit6Title: 'People-First Environment',
      benefit6Desc: 'A culture anchored on psychological safety, mutual respect, competitive regional packages, wellness support, and flexible remote/hybrid setups.',
    },
    pricing: {
      kicker: 'Transparent Pan-African Talent Pricing',
      title: 'Single & Bulk Job Post Plans',
      subtitle: 'For Employers, Agencies & Headhunters',
      desc: 'Whether you need to fill a single critical role or scale continuous hiring across African hubs, select from monthly, quarterly, bi-yearly, or yearly billing with volume discounts.',
      chooseCycle: 'Choose Your Billing Cycle:',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      biyearly: 'Bi-Yearly',
      yearly: 'Yearly',
      saveBadge: 'Save up to 30%',
      singlePlan: 'Single Job Post',
      bulkPlan: 'Bulk Job Post Package',
      enterprisePlan: 'Enterprise Hiring Suite',
      selectPlanBtn: 'Select Plan & Checkout',
    },
    common: {
      search: 'Search',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      or: 'or',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      view: 'View',
      clear: 'Clear',
      edit: 'Edit',
      delete: 'Delete',
      language: 'Language',
      selectLanguage: 'Select Language',
    },
  },

  // ==========================================
  // FRENCH (Afrique Francophone & International)
  // Senegal, Côte d'Ivoire, Cameroun, RDC, Rwanda, etc.
  // ==========================================
  fr: {
    nav: {
      home: 'Accueil',
      aboutUs: 'À Propos',
      solutions: 'Solutions',
      careers: 'Carrières',
      recruitmentModule: 'Module de Recrutement',
      pricingPlans: 'Tarification',
      ourCulture: 'Notre Culture',
      faqs: 'FAQ',
      signIn: 'Connexion',
      signUp: 'Inscription',
      postJob: 'Publier une Offre',
      aiAdvisor: 'Conseiller IA',
      talentRecruitment: 'Talents & Recrutement',
      adminModeActive: 'Mode Administrateur Recruteur Actif',
      adminModeDesc: 'Gestion des offres, révision des CV et suivi du pipeline de recrutement',
      exitCandidateView: 'Passer en Vue Candidat',
      viewBookmarks: 'Voir les Offres Sauvegardées',
      bookmarks: 'Favoris',
    },
    hero: {
      badge: 'Réseau Panafricain de Talents · Écosystème de Recrutement Ouvert',
      headline: "Bâtissez l'Avenir Numérique du Commerce Africain",
      subheadline:
        'Rejoignez des PME en forte croissance, des pionniers de la fintech et des entreprises internationales qui recrutent les meilleurs ingénieurs, chefs de produit et experts commerciaux à travers l’Afrique.',
      searchPlaceholder: 'Rechercher par poste, langage, compétence ou mot-clé...',
      allDepartments: 'Tous les Départements',
      allLocations: 'Toutes les Localisations / Télétravail',
      searchJobsBtn: 'Rechercher des Postes',
      activePositions: 'Postes Disponibles',
      africanHubs: 'Pôles Africains',
      verifiedEmployers: 'Entreprises Vérifiées',
      hiringRate: 'Recrutement Accéléré',
      explorePositions: 'Explorer les Offres',
      postJobOpening: 'Publier une Offre',
    },
    filters: {
      title: 'Filtres',
      available: 'disponible(s)',
      reset: 'Réinitialiser',
      searchCompanies: 'Rechercher un employeur...',
      companyEmployer: 'Entreprise / Employeur',
      department: 'Département',
      location: 'Localisation & Pôles',
      workArrangement: 'Mode de Travail',
      salaryRange: 'Fourchette Salariale',
      minMonthlySalary: 'Salaire Mensuel Min.',
      currency: 'Devise',
      experienceLevel: "Niveau d'Expérience",
      employmentType: "Type d'Emploi",
      datePosted: 'Date de Publication',
      anyTime: 'Toutes les dates',
      last24h: 'Dernières 24 heures',
      last7d: '7 derniers jours',
      last14d: '14 derniers jours',
      last30d: '30 derniers jours',
      activeFilters: 'Filtres actifs :',
      clearAll: 'Tout effacer',
      savedBookmarks: 'Offres Sauvegardées',
      endOfFilters: 'Fin des filtres',
      scrollToTop: 'Remonter en haut',
      allArrangements: 'Tous les modes',
      allCurrencies: 'Toutes les devises',
    },
    jobs: {
      openOpportunities: 'Opportunités Ouvertes',
      discoverNext: 'Trouvez Votre Prochaine Opportunité',
      discoverDesc: 'Découvrez des postes stimulants pour propulser votre carrière et créer un impact durable en Afrique.',
      noMatches: 'Aucune Opportunité Trouvée',
      noMatchesDesc: 'Aucune offre ne correspond à vos filtres actuels. Essayez d’élargir vos critères ou rejoignez notre Communauté de Talents ci-dessous.',
      applyNow: 'Postuler Maintenant',
      viewDetails: 'Voir les Détails',
      bookmark: 'Sauvegarder',
      bookmarked: 'Sauvegardé',
      roleClosingSoon: 'Clôture Prochaine',
      deadline: 'Date limite',
      featured: 'Poste en Vedette',
      remote: 'Télétravail',
      hybrid: 'Hybride',
      onSite: 'Sur Site',
      fullTime: 'Temps Plein',
      partTime: 'Temps Partiel',
      contract: 'Contrat',
      internship: 'Stage',
      perMonth: '/mois',
      perYear: '/an',
      competitiveRemuneration: 'Rémunération Compétitive',
      experience: 'Expérience',
      posted: 'Publié',
    },
    application: {
      applyFor: 'Postuler à l’Offre',
      step1: '1. Informations Personnelles',
      step2: '2. Expérience',
      step3: '3. CV & Compétences',
      step4: '4. Candidature Envoyée',
      fastTrackTitle: 'Accélérateur IA de CV',
      fastTrackDesc: 'Téléversez votre CV (PDF/DOCX) ou synchronisez directement votre profil LinkedIn public. Notre Agent IA extrait vos données et pré-remplit le formulaire.',
      uploadCv: 'Téléverser un CV (PDF/DOCX)',
      reuploadCv: 'Remplacer le CV',
      syncFromLinkedIn: 'Synchroniser depuis LinkedIn',
      quickDemo: 'Démo Rapide :',
      personalContact: 'Coordonnées Personnelles',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse Email',
      phone: 'Téléphone (avec indicatif pays)',
      country: 'Pays de Résidence',
      city: 'Ville / Localité',
      yearsOfExperience: "Années d'Expérience",
      currentJobTitle: 'Poste Actuel ou Plus Récent',
      linkedinUrl: 'URL du Profil LinkedIn',
      portfolioUrl: 'Portfolio / GitHub / Site Web',
      earliestStartDate: 'Date de Début Possible',
      coverLetter: 'Lettre de Motivation / Résumé',
      uploadResumeTitle: 'Curriculum Vitae (CV)',
      screeningQuestions: 'Questions Préalables de Sélection',
      consentText: 'Je certifie que les informations fournies sont exactes et consens au traitement de ma candidature par MsmeBooks aux fins de recrutement.',
      continueBtn: 'Continuer',
      backBtn: 'Retour',
      submitApplication: 'Soumettre ma Candidature',
      submitting: 'Envoi en cours...',
      successTitle: 'Candidature Transmise avec Succès !',
      successDesc: 'Merci d’avoir postulé. Votre dossier a été enregistré dans le pipeline de recrutement avec votre score de correspondance IA.',
      referenceCode: 'Code de Référence Candidat',
      trackStatusNotice: 'Veuillez conserver ce code pour suivre l’avancement de votre candidature et vos convocations aux entretiens.',
      addCalendarBtn: 'Ajouter au Calendrier',
      downloadSummary: 'Télécharger Confirmation (.ics)',
      closeBtn: 'Fermer',
    },
    linkedinSync: {
      modalTitle: 'Synchroniser depuis LinkedIn',
      badge: 'Agent IA',
      modalDesc: 'Saisissez l’URL de votre profil LinkedIn public. Notre Agent IA analyse votre parcours et compétences pour remplir automatiquement votre candidature.',
      urlLabel: 'URL Publique du Profil LinkedIn',
      urlPlaceholder: 'https://www.linkedin.com/in/identifiant',
      trySample: 'Ou essayez un profil public de démonstration :',
      oneClickPreview: 'Aperçu IA en un clic',
      agentParsing: 'Analyse IA du Profil en Cours',
      statusConnecting: 'Connexion au profil LinkedIn public...',
      statusExtracting: 'Extraction du parcours professionnel et des compétences...',
      statusSynthesizing: 'Synthèse du profil ATS et calcul des correspondances...',
      cancelBtn: 'Annuler',
      syncBtn: 'Synchroniser & Pré-remplir',
      syncingBtn: 'Synchronisation...',
      successToast: 'Synchronisation LinkedIn réussie ! Formulaire pré-rempli par l’Agent IA.',
    },
    whyWorkHere: {
      kicker: 'Pourquoi Nous Rejoindre',
      title: 'Bien Plus Qu’un Emploi. Bâtissez Quelque Chose d’Essentiel.',
      desc: 'Chez MsmeBooks, notre mission est de donner aux micro, petites et moyennes entreprises les outils technologiques intuitifs pour prospérer.',
      benefit1Title: 'Impact Réel & Durable',
      benefit1Desc: 'Aidez les PME à travers l’Afrique et le monde à opérer efficacement, éliminer la gestion papier et développer des activités pérennes.',
      benefit2Title: 'Technologies Modernes & IA',
      benefit2Desc: 'Travaillez sur des architectures SaaS cloud modernes, des synchronisations POS hors-ligne résilientes et des outils financiers intelligents.',
      benefit3Title: 'Développement Professionnel',
      benefit3Desc: 'Des opportunités concrètes pour perfectionner votre expertise, prendre des responsabilités managériales et évoluer rapidement.',
      benefit4Title: 'Culture Collaborative',
      benefit4Desc: 'Collaborez avec des ingénieurs, designers, comptables et leaders commerciaux à Lagos, Nairobi, Kigali, Abidjan et Johannesburg.',
      benefit5Title: 'Opportunités de Croissance',
      benefit5Desc: 'Participez à la construction d’infrastructures numériques favorisant l’inclusion financière et la formalisation du commerce de détail.',
      benefit6Title: 'Cadre Axé sur l’Humain',
      benefit6Desc: 'Une culture axée sur la sécurité psychologique, la rémunération compétitive, le bien-être et des modalités de télétravail flexibles.',
    },
    pricing: {
      kicker: 'Tarification Panafricaine Transparente',
      title: 'Offres Uniques & Packages de Recrutement',
      subtitle: 'Pour Employeurs, Cabinets & Chasseurs de Têtes',
      desc: 'Que vous deviez pourvoir un poste clé ou orchestrer des embauches régulières sur le continent, profitez de forfaits flexibles avec remises sur volume.',
      chooseCycle: 'Choisissez votre Cycle de Facturation :',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      biyearly: 'Semestriel',
      yearly: 'Annuel',
      saveBadge: "Jusqu'à 30% d'économie",
      singlePlan: 'Publication Unique',
      bulkPlan: 'Pack Recrutement Multiple',
      enterprisePlan: 'Suite Recrutement Entreprise',
      selectPlanBtn: 'Choisir ce Forfait',
    },
    common: {
      search: 'Rechercher',
      cancel: 'Annuler',
      save: 'Enregistrer',
      close: 'Fermer',
      loading: 'Chargement...',
      success: 'Succès',
      error: 'Erreur',
      or: 'ou',
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      view: 'Afficher',
      clear: 'Effacer',
      edit: 'Modifier',
      delete: 'Supprimer',
      language: 'Langue',
      selectLanguage: 'Choisir la Langue',
    },
  },

  // ==========================================
  // PORTUGUESE (África Lusófona & Internacional)
  // Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé, etc.
  // ==========================================
  pt: {
    nav: {
      home: 'Início',
      aboutUs: 'Sobre Nós',
      solutions: 'Soluções',
      careers: 'Carreiras',
      recruitmentModule: 'Módulo de Recrutamento',
      pricingPlans: 'Planos de Preços',
      ourCulture: 'Nossa Cultura',
      faqs: 'Perguntas Frequentes',
      signIn: 'Entrar',
      signUp: 'Cadastre-se',
      postJob: 'Publicar Vaga',
      aiAdvisor: 'Consultor IA',
      talentRecruitment: 'Talentos & Recrutamento',
      adminModeActive: 'Modo Administrador Recrutador Ativo',
      adminModeDesc: 'Gestão de vagas, triagem de currículos e acompanhamento do pipeline',
      exitCandidateView: 'Voltar à Visão do Candidato',
      viewBookmarks: 'Ver Vagas Salvas',
      bookmarks: 'Salvos',
    },
    hero: {
      badge: 'Rede Pan-Africana de Talentos · Ecossistema Aberto de Contratação',
      headline: 'Construa o Futuro Digital do Comércio Africano',
      subheadline:
        'Junte-se a PMEs de alto crescimento, pioneiros em fintech e empresas globais que contratam os melhores engenheiros, gestores de produto e talentos comerciais em toda a África.',
      searchPlaceholder: 'Pesquisar por cargo, linguagem, competência ou palavra-chave...',
      allDepartments: 'Todos os Departamentos',
      allLocations: 'Todas as Localizações / Remoto',
      searchJobsBtn: 'Buscar Oportunidades',
      activePositions: 'Vagas Abertas',
      africanHubs: 'Polos em África',
      verifiedEmployers: 'Empresas Verificadas',
      hiringRate: 'Contratação Ágil',
      explorePositions: 'Explorar Oportunidades',
      postJobOpening: 'Publicar uma Vaga',
    },
    filters: {
      title: 'Filtros',
      available: 'disponível(is)',
      reset: 'Limpar',
      searchCompanies: 'Pesquisar empresas...',
      companyEmployer: 'Empresa / Empregador',
      department: 'Departamento',
      location: 'Localização e Polos',
      workArrangement: 'Modelo de Trabalho',
      salaryRange: 'Faixa Salarial',
      minMonthlySalary: 'Salário Mensal Mínimo',
      currency: 'Moeda',
      experienceLevel: 'Nível de Experiência',
      employmentType: 'Tipo de Emprego',
      datePosted: 'Data de Publicação',
      anyTime: 'Qualquer data',
      last24h: 'Últimas 24 horas',
      last7d: 'Últimos 7 dias',
      last14d: 'Últimos 14 dias',
      last30d: 'Últimos 30 dias',
      activeFilters: 'Filtros ativos:',
      clearAll: 'Limpar tudo',
      savedBookmarks: 'Vagas Salvas',
      endOfFilters: 'Fim dos filtros',
      scrollToTop: 'Voltar ao topo',
      allArrangements: 'Todos os modelos',
      allCurrencies: 'Todas as moedas',
    },
    jobs: {
      openOpportunities: 'Vagas Abertas',
      discoverNext: 'Descubra a Sua Próxima Oportunidade',
      discoverDesc: 'Explore posições estimulantes para impulsionar a sua carreira e gerar impacto significativo em África.',
      noMatches: 'Nenhuma Oportunidade Encontrada',
      noMatchesDesc: 'Não encontramos vagas ativas com os filtros selecionados. Tente ajustar os seus critérios ou faça parte da nossa Comunidade de Talentos.',
      applyNow: 'Candidatar-se Agora',
      viewDetails: 'Ver Detalhes',
      bookmark: 'Salvar Vaga',
      bookmarked: 'Salvo',
      roleClosingSoon: 'A Encerrar em Breve',
      deadline: 'Prazo limite',
      featured: 'Vaga em Destaque',
      remote: 'Remoto',
      hybrid: 'Híbrido',
      onSite: 'Presencial',
      fullTime: 'Tempo Integral',
      partTime: 'Meio Período',
      contract: 'Contrato',
      internship: 'Estágio',
      perMonth: '/mês',
      perYear: '/ano',
      competitiveRemuneration: 'Remuneração Competitiva',
      experience: 'Experiência',
      posted: 'Publicado',
    },
    application: {
      applyFor: 'Candidatar-se à Vaga',
      step1: '1. Dados Pessoais',
      step2: '2. Experiência',
      step3: '3. Currículo & Habilidades',
      step4: '4. Enviado',
      fastTrackTitle: 'Aceleração de Currículo por IA',
      fastTrackDesc: 'Carregue o seu currículo em PDF/DOCX ou sincronize diretamente o seu perfil público do LinkedIn. O nosso Agente de IA extrai as suas qualificações e preenche a candidatura.',
      uploadCv: 'Carregar CV (PDF/DOCX)',
      reuploadCv: 'Substituir Currículo',
      syncFromLinkedIn: 'Sincronizar do LinkedIn',
      quickDemo: 'Demonstração Rápida:',
      personalContact: 'Informações de Contacto',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'Correio Eletrónico (E-mail)',
      phone: 'Telefone (com indicativo do país)',
      country: 'País de Residência',
      city: 'Cidade / Localidade',
      yearsOfExperience: 'Anos de Experiência',
      currentJobTitle: 'Cargo Atual ou Mais Recente',
      linkedinUrl: 'Perfil do LinkedIn',
      portfolioUrl: 'Portfólio / GitHub / Website',
      earliestStartDate: 'Data Disponível para Início',
      coverLetter: 'Carta de Apresentação / Resumo',
      uploadResumeTitle: 'Currículo Profissional (CV)',
      screeningQuestions: 'Perguntas Iniciais de Triagem',
      consentText: 'Confirmo a veracidade de todas as informações apresentadas e autorizo o tratamento dos dados pela MsmeBooks para fins de recrutamento.',
      continueBtn: 'Continuar',
      backBtn: 'Voltar',
      submitApplication: 'Enviar Candidatura',
      submitting: 'A enviar candidatura...',
      successTitle: 'Candidatura Enviada com Sucesso!',
      successDesc: 'Obrigado pelo seu interesse. A sua candidatura foi integrada no pipeline de recrutamento juntamente com a sua pontuação de compatibilidade por IA.',
      referenceCode: 'Código de Referência',
      trackStatusNotice: 'Guarde este código para acompanhar o estado do seu processo e convites para entrevistas.',
      addCalendarBtn: 'Adicionar ao Calendário',
      downloadSummary: 'Baixar Confirmação (.ics)',
      closeBtn: 'Fechar',
    },
    linkedinSync: {
      modalTitle: 'Sincronizar do LinkedIn',
      badge: 'Agente de IA',
      modalDesc: 'Insira o link do seu perfil público do LinkedIn. A nossa inteligência artificial irá analisar o seu percurso e pré-preencher o formulário.',
      urlLabel: 'Link do Perfil Público do LinkedIn',
      urlPlaceholder: 'https://www.linkedin.com/in/utilizador',
      trySample: 'Ou experimente com um perfil de demonstração:',
      oneClickPreview: 'Pré-visualização imediata',
      agentParsing: 'Agente de IA a Analisar o Perfil',
      statusConnecting: 'A estabelecer ligação com o perfil público...',
      statusExtracting: 'A extrair histórico profissional, educação e competências...',
      statusSynthesizing: 'A sintetizar dados compatíveis com ATS e a mapear requisitos...',
      cancelBtn: 'Cancelar',
      syncBtn: 'Sincronizar & Pré-preencher',
      syncingBtn: 'A sincronizar...',
      successToast: 'Perfil sincronizado do LinkedIn com sucesso! Formulário preenchido por IA.',
    },
    whyWorkHere: {
      kicker: 'Por Que Fazer Parte da Nossa Equipa',
      title: 'Mais do que um Emprego. Construa Algo com Impacto.',
      desc: 'Na MsmeBooks, a nossa missão é capacitar milhões de micro, pequenas e médias empresas com tecnologia moderna e intuitiva.',
      benefit1Title: 'Impacto Real e Relevante',
      benefit1Desc: 'Apoie empresas africanas e mundiais a operarem com máxima eficiência, digitalizando operações e formalizando negócios sustentáveis.',
      benefit2Title: 'Inovação e Tecnologia de Ponta',
      benefit2Desc: 'Desenvolva soluções SaaS na nuvem, arquiteturas POS com sincronização offline e ferramentas inteligentes de contabilidade.',
      benefit3Title: 'Crescimento e Carreira',
      benefit3Desc: 'Oportunidades estruturadas para liderar projetos cruciais e progredir aceleradamente num ecossistema em expansão contínua.',
      benefit4Title: 'Cultura de Colaboração',
      benefit4Desc: 'Trabalhe lado a lado com engenheiros, designers, contabilistas e líderes de negócio em Luanda, Maputo, Lagos, Nairóbi e Joanesburgo.',
      benefit5Title: 'Inclusão e Transformação',
      benefit5Desc: 'Participe diretamente na formalização da economia digital e na democratização do acesso a crédito e tecnologia em África.',
      benefit6Title: 'Bem-Estar em Primeiro Lugar',
      benefit6Desc: 'Ambiente baseado em segurança psicológica, pacotes remuneratórios competitivos, apoio à saúde mental e modalidades de trabalho flexíveis.',
    },
    pricing: {
      kicker: 'Preços Transparentes para Recrutamento em África',
      title: 'Planos Individuais e Pacotes em Lote',
      subtitle: 'Para Empresas, Agências e Headhunters',
      desc: 'Quer precise de preencher uma função estratégica ou gerir contratações contínuas, escolha entre planos mensais, trimestrais, semestrais ou anuais com descontos atrativos.',
      chooseCycle: 'Selecione o Ciclo de Faturação:',
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      biyearly: 'Semestral',
      yearly: 'Anual',
      saveBadge: 'Economize até 30%',
      singlePlan: 'Publicação Individual',
      bulkPlan: 'Pacote de Publicações em Lote',
      enterprisePlan: 'Solução Completa para Empresas',
      selectPlanBtn: 'Selecionar Plano',
    },
    common: {
      search: 'Pesquisar',
      cancel: 'Cancelar',
      save: 'Salvar',
      close: 'Fechar',
      loading: 'A carregar...',
      success: 'Sucesso',
      error: 'Erro',
      or: 'ou',
      back: 'Voltar',
      next: 'Seguinte',
      submit: 'Enviar',
      view: 'Visualizar',
      clear: 'Limpar',
      edit: 'Editar',
      delete: 'Eliminar',
      language: 'Idioma',
      selectLanguage: 'Selecionar Idioma',
    },
  },

  // ==========================================
  // SPANISH (Guinea Ecuatorial, América Latina & Internacional)
  // ==========================================
  es: {
    nav: {
      home: 'Inicio',
      aboutUs: 'Sobre Nosotros',
      solutions: 'Soluciones',
      careers: 'Carreras',
      recruitmentModule: 'Módulo de Reclutamiento',
      pricingPlans: 'Planes de Precios',
      ourCulture: 'Nuestra Cultura',
      faqs: 'Preguntas Frecuentes',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      postJob: 'Publicar Vacante',
      aiAdvisor: 'Asesor IA',
      talentRecruitment: 'Talento & Reclutamiento',
      adminModeActive: 'Modo Administrador de Selección Activo',
      adminModeDesc: 'Gestión de vacantes, revisión de currículums y seguimiento del proceso de selección',
      exitCandidateView: 'Volver a Vista Candidato',
      viewBookmarks: 'Ver Empleos Guardados',
      bookmarks: 'Guardados',
    },
    hero: {
      badge: 'Red Panafricana de Talento · Ecosistema de Contratación Abierto',
      headline: 'Construye el Futuro Digital del Comercio Africano',
      subheadline:
        'Únete a pymes en rápido crecimiento, pioneros fintech y empresas multinacionales que contratan a los mejores ingenieros, líderes de producto y profesionales comerciales en África.',
      searchPlaceholder: 'Buscar por puesto, lenguaje de programación, habilidad o palabra clave...',
      allDepartments: 'Todos los Departamentos',
      allLocations: 'Todas las Ubicaciones / Remoto',
      searchJobsBtn: 'Buscar Empleos',
      activePositions: 'Vacantes Activas',
      africanHubs: 'Centros en África',
      verifiedEmployers: 'Empresas Verificadas',
      hiringRate: 'Contratación Rápida',
      explorePositions: 'Explorar Vacantes',
      postJobOpening: 'Publicar una Vacante',
    },
    filters: {
      title: 'Filtros',
      available: 'disponible(s)',
      reset: 'Restablecer',
      searchCompanies: 'Buscar empresas...',
      companyEmployer: 'Empresa / Empleador',
      department: 'Departamento',
      location: 'Ubicación y Centros',
      workArrangement: 'Modalidad de Trabajo',
      salaryRange: 'Rango Salarial',
      minMonthlySalary: 'Salario Mínimo Mensual',
      currency: 'Moneda',
      experienceLevel: 'Nivel de Experiencia',
      employmentType: 'Tipo de Empleo',
      datePosted: 'Fecha de Publicación',
      anyTime: 'Cualquier fecha',
      last24h: 'Últimas 24 horas',
      last7d: 'Últimos 7 días',
      last14d: 'Últimos 14 días',
      last30d: 'Últimos 30 días',
      activeFilters: 'Filtros activos:',
      clearAll: 'Borrar todo',
      savedBookmarks: 'Empleos Guardados',
      endOfFilters: 'Fin de los filtros',
      scrollToTop: 'Subir al inicio',
      allArrangements: 'Todas las modalidades',
      allCurrencies: 'Todas las monedas',
    },
    jobs: {
      openOpportunities: 'Oportunidades Abiertas',
      discoverNext: 'Descubre Tu Próxima Oportunidad',
      discoverDesc: 'Explora ofertas apasionantes para impulsar tu carrera y generar un impacto significativo en África.',
      noMatches: 'No se Encontraron Oportunidades',
      noMatchesDesc: 'No encontramos ofertas activas con los filtros actuales. Prueba a ampliar tus criterios o únete a nuestra Comunidad de Talento.',
      applyNow: 'Postularse Ahora',
      viewDetails: 'Ver Detalles',
      bookmark: 'Guardar Empleo',
      bookmarked: 'Guardado',
      roleClosingSoon: 'Cierra Pronto',
      deadline: 'Plazo límite',
      featured: 'Puesto Destacado',
      remote: 'Remoto',
      hybrid: 'Híbrido',
      onSite: 'Presencial',
      fullTime: 'Tiempo Completo',
      partTime: 'Medio Tiempo',
      contract: 'Por Contrato',
      internship: 'Pasantía / Prácticas',
      perMonth: '/mes',
      perYear: '/año',
      competitiveRemuneration: 'Remuneración Competitiva',
      experience: 'Experiencia',
      posted: 'Publicado',
    },
    application: {
      applyFor: 'Postular a la Vacante',
      step1: '1. Datos Personales',
      step2: '2. Experiencia',
      step3: '3. Currículum & Habilidades',
      step4: '4. Enviado',
      fastTrackTitle: 'Acelerador de Currículum con IA',
      fastTrackDesc: 'Sube tu CV en PDF/DOCX o sincroniza directamente tu perfil público de LinkedIn. Nuestro Agente de IA extraerá tus datos y completará tu postulación.',
      uploadCv: 'Subir CV (PDF/DOCX)',
      reuploadCv: 'Reemplazar CV',
      syncFromLinkedIn: 'Sincronizar desde LinkedIn',
      quickDemo: 'Demostración Rápida:',
      personalContact: 'Datos de Contacto Personal',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo Electrónico',
      phone: 'Teléfono (con prefijo de país)',
      country: 'País de Residencia',
      city: 'Ciudad / Localidad',
      yearsOfExperience: 'Años de Experiencia',
      currentJobTitle: 'Cargo Actual o Más Reciente',
      linkedinUrl: 'Perfil de LinkedIn',
      portfolioUrl: 'Portafolio / GitHub / Sitio Web',
      earliestStartDate: 'Fecha de Incorporación',
      coverLetter: 'Carta de Presentación / Resumen',
      uploadResumeTitle: 'Currículum Vitae (CV)',
      screeningQuestions: 'Preguntas de Filtrado Inicial',
      consentText: 'Certifico que los datos proporcionados son veraces y consiento que MsmeBooks procese mi candidatura para fines de selección laboral.',
      continueBtn: 'Continuar',
      backBtn: 'Atrás',
      submitApplication: 'Enviar Postulación',
      submitting: 'Enviando postulación...',
      successTitle: '¡Postulación Enviada con Éxito!',
      successDesc: 'Gracias por postularte. Tu expediente ha sido registrado en el proceso de selección junto con tu puntuación de afinidad IA.',
      referenceCode: 'Código de Referencia',
      trackStatusNotice: 'Guarda este código para consultar el estado de tu proceso y tus invitaciones a entrevistas.',
      addCalendarBtn: 'Añadir al Calendario',
      downloadSummary: 'Descargar Confirmación (.ics)',
      closeBtn: 'Cerrar',
    },
    linkedinSync: {
      modalTitle: 'Sincronizar desde LinkedIn',
      badge: 'Agente IA',
      modalDesc: 'Ingresa la URL pública de tu perfil de LinkedIn. Nuestro Agente de Inteligencia Artificial analizará tu trayectoria para rellenar la postulación.',
      urlLabel: 'URL Pública de tu Perfil de LinkedIn',
      urlPlaceholder: 'https://www.linkedin.com/in/usuario',
      trySample: 'O prueba con un perfil público de muestra:',
      oneClickPreview: 'Vista previa en un clic',
      agentParsing: 'Agente de IA Analizando Perfil',
      statusConnecting: 'Conectando con el perfil público...',
      statusExtracting: 'Extrayendo historial profesional, experiencia y habilidades...',
      statusSynthesizing: 'Sintetizando perfil apto para ATS y cotejando requisitos...',
      cancelBtn: 'Cancelar',
      syncBtn: 'Sincronizar & Completar',
      syncingBtn: 'Sincronizando...',
      successToast: '¡Sincronizado desde LinkedIn con éxito! Formulario completado por el Agente IA.',
    },
    whyWorkHere: {
      kicker: 'Por Qué Unirte a Nosotros',
      title: 'Más que un Trabajo. Construye Algo que Importe.',
      desc: 'En MsmeBooks, nuestra misión es empoderar a millones de micro, pequeñas y medianas empresas con tecnología intuitiva y escalable.',
      benefit1Title: 'Impacto Real y Trascendente',
      benefit1Desc: 'Ayuda a las pymes en África y el mundo a operar con eficiencia, digitalizar sus registros y construir empresas prósperas.',
      benefit2Title: 'Innovación y Tecnología Moderna',
      benefit2Desc: 'Trabaja en soluciones SaaS en la nube, sistemas POS con sincronización offline y herramientas contables inteligentes.',
      benefit3Title: 'Desarrollo Profesional Continuo',
      benefit3Desc: 'Oportunidades estructuradas para profundizar conocimientos técnicos, asumir liderazgo y progresar con rapidez.',
      benefit4Title: 'Cultura Altamente Colaborativa',
      benefit4Desc: 'Colabora con ingenieros, diseñadores, contables y directivos comerciales en Lagos, Nairobi, Kigali, Malabo y Johannesburgo.',
      benefit5Title: 'Crecimiento e Inclusión',
      benefit5Desc: 'Forma parte de la infraestructura digital que formaliza el comercio y democratiza el acceso a servicios financieros.',
      benefit6Title: 'Entorno Centrado en las Personas',
      benefit6Desc: 'Una cultura fundada en la seguridad psicológica, retribución competitiva, salud integral y flexibilidad laboral.',
    },
    pricing: {
      kicker: 'Tarifas Transparentes para África y el Mundo',
      title: 'Planes Individuales y Paquetes por Lotes',
      subtitle: 'Para Empresas, Agencias y Cazatalentos',
      desc: 'Ya sea que necesites cubrir una vacante puntual o contratar continuamente en la región, elige entre facturación mensual, trimestral, semestral o anual con descuentos por volumen.',
      chooseCycle: 'Elige tu Ciclo de Facturación:',
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      biyearly: 'Semestral',
      yearly: 'Anual',
      saveBadge: 'Ahorra hasta un 30%',
      singlePlan: 'Publicación Individual',
      bulkPlan: 'Paquete de Publicaciones en Lote',
      enterprisePlan: 'Suite Completa de Selección',
      selectPlanBtn: 'Elegir Plan',
    },
    common: {
      search: 'Buscar',
      cancel: 'Cancelar',
      save: 'Guardar',
      close: 'Cerrar',
      loading: 'Cargando...',
      success: 'Éxito',
      error: 'Error',
      or: 'o',
      back: 'Atrás',
      next: 'Siguiente',
      submit: 'Enviar',
      view: 'Ver',
      clear: 'Limpiar',
      edit: 'Editar',
      delete: 'Eliminar',
      language: 'Idioma',
      selectLanguage: 'Seleccionar Idioma',
    },
  },
};
