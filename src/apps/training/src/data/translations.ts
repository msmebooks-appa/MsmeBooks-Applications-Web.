export type Language = 'en' | 'fr' | 'pt' | 'es';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    fr: string;
    pt: string;
    es: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Navigation & Branding
  brandTagline: {
    en: 'Accredited SaaS Training for African SMEs & Partners',
    fr: 'Formation SaaS accréditée pour les PME et partenaires africains',
    pt: 'Treinamento SaaS credenciado para PMEs e parceiros africanos',
    es: 'Capacitación SaaS acreditada para PYMEs y socios africanos'
  },
  home: {
    en: 'Academy Home',
    fr: 'Accueil Académie',
    pt: 'Início da Academia',
    es: 'Inicio de la Academia'
  },
  courseCatalog: {
    en: 'Course Catalog',
    fr: 'Catalogue des Cours',
    pt: 'Catálogo de Cursos',
    es: 'Catálogo de Cursos'
  },
  bundles: {
    en: 'Training Bundles',
    fr: 'Packs de Formation',
    pt: 'Pacotes de Treinamento',
    es: 'Paquetes de Capacitación'
  },
  studyGroups: {
    en: 'Study Groups',
    fr: 'Groupes d\'Étude',
    pt: 'Grupos de Estudo',
    es: 'Grupos de Estudio'
  },
  learningPaths: {
    en: 'Learning Paths',
    fr: 'Parcours d\'Apprentissage',
    pt: 'Trilhas de Aprendizagem',
    es: 'Rutas de Aprendizaje'
  },
  wishlist: {
    en: 'Wishlist',
    fr: 'Liste d\'Envies',
    pt: 'Lista de Desejos',
    es: 'Lista de Deseos'
  },
  sandbox: {
    en: 'Software Sandbox',
    fr: 'Bac à Sable Logiciel',
    pt: 'Sandbox de Software',
    es: 'Entorno de Pruebas'
  },
  liveTraining: {
    en: 'Live Training',
    fr: 'Formation en Direct',
    pt: 'Treinamento ao Vivo',
    es: 'Capacitación en Vivo'
  },
  verifyCert: {
    en: 'Verify Certificate',
    fr: 'Vérifier Certificat',
    pt: 'Verificar Certificado',
    es: 'Verificar Certificado'
  },
  studentDashboard: {
    en: 'Student Dashboard',
    fr: 'Tableau de Bord Étudiant',
    pt: 'Painel do Estudante',
    es: 'Panel del Estudiante'
  },
  curriculum: {
    en: 'Curriculum',
    fr: 'Programme',
    pt: 'Currículo',
    es: 'Plan de Estudios'
  },

  // Connection & Offline
  online: {
    en: 'Online',
    fr: 'En ligne',
    pt: 'Online',
    es: 'En línea'
  },
  offline: {
    en: 'Offline',
    fr: 'Hors ligne',
    pt: 'Offline',
    es: 'Sin conexión'
  },
  onlineStatus: {
    en: 'Online · Cloud Sync Active',
    fr: 'En ligne · Synchro Cloud active',
    pt: 'Online · Sincronização em nuvem ativa',
    es: 'En línea · Sincronización en la nube activa'
  },
  offlineStatus: {
    en: 'Offline · Local Storage Active',
    fr: 'Hors ligne · Stockage local actif',
    pt: 'Offline · Cache local ativo',
    es: 'Sin conexión · Almacenamiento local activo'
  },
  offlineBannerTitle: {
    en: 'Internet Connection Lost · Offline Mode Active',
    fr: 'Connexion Internet perdue · Mode hors ligne actif',
    pt: 'Conexão com a Internet Perdida · Modo Offline Ativo',
    es: 'Conexión a Internet Perdida · Modo sin Conexión Activo'
  },
  offlineBannerDesc: {
    en: 'You have lost internet access, but your offline-cached courses and downloaded modules remain fully available for study. All progress will sync once reconnected.',
    fr: 'Vous avez perdu l\'accès à Internet, mais vos cours mis en cache et modules téléchargés restent entièrement accessibles pour l\'apprentissage. Vos progrès seront synchronisés dès la reconnexion.',
    pt: 'Você perdeu o acesso à internet, mas seus cursos em cache offline e módulos baixados continuam totalmente disponíveis para estudo. O progresso será sincronizado ao reconectar.',
    es: 'Ha perdido el acceso a internet, pero sus cursos en caché sin conexión y módulos descargados siguen totalmente disponibles para el estudio. Su progreso se sincronizará al reconectarse.'
  },
  offlineCachedAvailable: {
    en: 'Offline-Cached Courses Available',
    fr: 'Cours mis en cache hors ligne disponibles',
    pt: 'Cursos em Cache Offline Disponíveis',
    es: 'Cursos en Caché sin Conexión Disponibles'
  },
  accessCachedCourses: {
    en: 'Access Offline Courses',
    fr: 'Accéder aux cours hors ligne',
    pt: 'Acessar Cursos Offline',
    es: 'Acceder a Cursos sin Conexión'
  },
  cachedCoursesReady: {
    en: 'Cached Courses Ready',
    fr: 'Cours en cache prêts',
    pt: 'Cursos em Cache Prontos',
    es: 'Cursos en Caché Listos'
  },
  offlinePillLabel: {
    en: 'Offline · Cached Courses Available',
    fr: 'Hors ligne · Cours en cache disponibles',
    pt: 'Offline · Cursos em Cache Disponíveis',
    es: 'Sin conexión · Cursos en Caché Disponibles'
  },
  simulateOffline: {
    en: 'Simulate Offline Mode',
    fr: 'Simuler le mode hors ligne',
    pt: 'Simular modo offline',
    es: 'Simular modo sin conexión'
  },
  simulateOnline: {
    en: 'Switch to Online',
    fr: 'Passer en ligne',
    pt: 'Mudar para online',
    es: 'Cambiar a en línea'
  },
  connectionInspector: {
    en: 'Connection Inspector & Cache',
    fr: 'Inspecteur de Connexion & Cache',
    pt: 'Inspetor de Conexão e Cache',
    es: 'Inspector de Conexión y Caché'
  },
  offlineExplanation: {
    en: 'Local caching engine active. Modules, notes, and quiz drafts remain accessible offline.',
    fr: 'Moteur de cache local actif. Modules, notes et quiz restent accessibles hors ligne.',
    pt: 'Mecanismo de cache local ativo. Módulos, anotações e testes continuam acessíveis offline.',
    es: 'Motor de caché local activo. Módulos, notas y cuestionarios siguen disponibles sin conexión.'
  },
  onlineExplanation: {
    en: 'Live Cloud Firestore sync connected. All actions sync across devices in real time.',
    fr: 'Synchronisation Cloud Firestore active. Vos actions se synchronisent en temps réel.',
    pt: 'Sincronização Cloud Firestore ativa. Todas as ações sincronizam em tempo real.',
    es: 'Sincronización en la nube activa. Todas las acciones se sincronizan en tiempo real.'
  },
  offlineReady: {
    en: 'Offline Ready',
    fr: 'Prêt hors ligne',
    pt: 'Pronto para Offline',
    es: 'Listo sin conexión'
  },
  saveForOffline: {
    en: 'Save for Offline',
    fr: 'Enregistrer hors ligne',
    pt: 'Salvar para Offline',
    es: 'Guardar sin conexión'
  },
  downloading: {
    en: 'Downloading...',
    fr: 'Téléchargement...',
    pt: 'Baixando...',
    es: 'Descargando...'
  },
  savedForOffline: {
    en: 'Downloaded for offline study',
    fr: 'Téléchargé pour étude hors ligne',
    pt: 'Baixado para estudo offline',
    es: 'Descargado para estudio sin conexión'
  },
  lowBandwidthNotice: {
    en: 'Optimized for African Low-Bandwidth Networks',
    fr: 'Optimisé pour les réseaux à faible bande passante en Afrique',
    pt: 'Otimizado para redes de baixa largura de banda na África',
    es: 'Optimizado para redes de bajo ancho de banda en África'
  },

  // Currency Switcher
  currency: {
    en: 'Currency',
    fr: 'Devise',
    pt: 'Moeda',
    es: 'Moneda'
  },
  selectCurrency: {
    en: 'Select Currency',
    fr: 'Sélectionner la Devise',
    pt: 'Selecionar Moeda',
    es: 'Seleccionar Moneda'
  },
  panAfricanCurrencies: {
    en: 'African & Global Currencies',
    fr: 'Devises Africaines & Mondiales',
    pt: 'Moedas Africanas e Globais',
    es: 'Monedas Africanas y Globales'
  },
  ratesAutoConverted: {
    en: 'Prices automatically converted at daily commercial mid-market rates',
    fr: 'Prix convertis automatiquement selon les taux moyens du marché',
    pt: 'Preços convertidos automaticamente pelas taxas médias do mercado',
    es: 'Precios convertidos automáticamente a tasas promedio de mercado'
  },

  // Theme & Dark Mode
  themeLight: {
    en: 'Switch to Light Mode',
    fr: 'Passer en mode clair',
    pt: 'Mudar para modo claro',
    es: 'Cambiar a modo claro'
  },
  themeDark: {
    en: 'Switch to Dark Mode',
    fr: 'Passer en mode sombre',
    pt: 'Mudar para modo escuro',
    es: 'Cambiar a modo oscuro'
  },
  themeToggle: {
    en: 'Toggle Theme',
    fr: 'Changer de thème',
    pt: 'Alternar tema',
    es: 'Alternar tema'
  },

  // Hero Section
  heroBadge: {
    en: 'Official MsmeBooks SaaS Training & Certification Ecosystem',
    fr: 'Écosystème officiel de formation et certification SaaS MsmeBooks',
    pt: 'Ecossistema oficial de treinamento e certificação SaaS MsmeBooks',
    es: 'Ecosistema oficial de capacitación y certificación SaaS MsmeBooks'
  },
  heroTitle: {
    en: 'Master Business Management with',
    fr: 'Maîtrisez la gestion d\'entreprise avec',
    pt: 'Domine a gestão de negócios com',
    es: 'Domine la gestión empresarial con'
  },
  heroSub: {
    en: 'Build practical accounting, POS, inventory, payroll, hospitality, and business management skills through expert-led courses, hands-on software exercises, and industry-recognized training programs.',
    fr: 'Développez des compétences pratiques en comptabilité, caisse POS, stocks, paie, hôtellerie et gestion grâce à des cours animés par des experts et des ateliers logiciels réels.',
    pt: 'Desenvolva habilidades práticas em contabilidade, PDV, estoque, folha de pagamento e hotelaria por meio de cursos práticos e certificados reconhecidos pelo setor.',
    es: 'Desarrolle habilidades prácticas en contabilidad, POS, inventarios, nómina y hotelería mediante cursos prácticos y certificados reconocidos por la industria.'
  },
  exploreCourses: {
    en: 'Explore Courses',
    fr: 'Explorer les Cours',
    pt: 'Explorar Cursos',
    es: 'Explorar Cursos'
  },
  startFreeLearning: {
    en: 'Start Learning Free',
    fr: 'Commencer Gratuitement',
    pt: 'Começar Grátis',
    es: 'Comenzar Gratis'
  },
  becomeCertified: {
    en: 'Become Certified',
    fr: 'Obtenir une Certification',
    pt: 'Obter Certificação',
    es: 'Obtener Certificación'
  },
  bookCorporateTraining: {
    en: 'Book Corporate Training',
    fr: 'Formation Entreprise',
    pt: 'Treinamento Corporativo',
    es: 'Capacitación Corporativa'
  },
  realSoftwareSandbox: {
    en: 'Real Software Sandbox',
    fr: 'Bac à sable logiciel réel',
    pt: 'Sandbox de Software Real',
    es: 'Entorno de Pruebas Real'
  },
  verifiableCertificates: {
    en: 'Verifiable QR Certificates',
    fr: 'Certificats QR Vérifiables',
    pt: 'Certificados QR Verificáveis',
    es: 'Certificados QR Verificables'
  },
  partnerTiers: {
    en: 'Up to 40% Partner Tiers',
    fr: 'Jusqu\'à 40% remise partenaire',
    pt: 'Até 40% em níveis parceiro',
    es: 'Hasta 40% nivel de socios'
  },
  kpiCertified: {
    en: 'SME Professionals Certified',
    fr: 'Professionnels PME Certifiés',
    pt: 'Profissionais de PMEs Certificados',
    es: 'Profesionales de PYMEs Certificados'
  },
  kpiLabs: {
    en: 'Hands-On Software Labs',
    fr: 'Ateliers Pratiques Logiciels',
    pt: 'Laboratórios Práticos de Software',
    es: 'Laboratorios Prácticos de Software'
  },
  kpiCompletion: {
    en: 'Assessment Completion Rate',
    fr: 'Taux de Réussite aux Évaluations',
    pt: 'Taxa de Conclusão de Avaliações',
    es: 'Tasa de Aprobación de Evaluaciones'
  },
  kpiMarkets: {
    en: 'African Markets & Partners',
    fr: 'Marchés & Partenaires Africains',
    pt: 'Mercados e Parceiros Africanos',
    es: 'Mercados y Socios Africanos'
  },

  // Daily Streak & Rewards
  dailyStreak: {
    en: 'Daily Study Streak',
    fr: 'Série d\'étude quotidienne',
    pt: 'Sequência diária de estudos',
    es: 'Racha de estudio diario'
  },
  daysStreak: {
    en: 'Day Streak',
    fr: 'Jours consécutifs',
    pt: 'Dias consecutivos',
    es: 'Días consecutivos'
  },
  claimDailyBonus: {
    en: 'Claim Today\'s Bonus (+50 XP)',
    fr: 'Réclamer le bonus (+50 XP)',
    pt: 'Resgatar bônus (+50 XP)',
    es: 'Reclamar bono de hoy (+50 XP)'
  },
  bonusClaimed: {
    en: 'Claimed Today (+50 XP)',
    fr: 'Réclamé aujourd\'hui (+50 XP)',
    pt: 'Resgatado hoje (+50 XP)',
    es: 'Reclamado hoy (+50 XP)'
  },

  // Pomodoro Timer
  pomodoroTimer: {
    en: 'Pomodoro Study Timer',
    fr: 'Chronomètre Pomodoro',
    pt: 'Temporizador Pomodoro',
    es: 'Temporizador Pomodoro'
  },
  focusSession: {
    en: 'Focus Session (25 min)',
    fr: 'Session de concentration (25 min)',
    pt: 'Sessão de foco (25 min)',
    es: 'Sesión de concentración (25 min)'
  },
  shortBreak: {
    en: 'Short Break (5 min)',
    fr: 'Courte pause (5 min)',
    pt: 'Pausa curta (5 min)',
    es: 'Pausa corta (5 min)'
  },
  longBreak: {
    en: 'Long Break (15 min)',
    fr: 'Longue pause (15 min)',
    pt: 'Pausa longa (15 min)',
    es: 'Pausa larga (15 min)'
  },
  startTimer: {
    en: 'Start Timer',
    fr: 'Démarrer le minuteur',
    pt: 'Iniciar temporizador',
    es: 'Iniciar temporizador'
  },
  pauseTimer: {
    en: 'Pause Timer',
    fr: 'Mettre en pause',
    pt: 'Pausar',
    es: 'Pausar'
  },
  resetTimer: {
    en: 'Reset',
    fr: 'Réinitialiser',
    pt: 'Reiniciar',
    es: 'Reiniciar'
  },

  // Download Notes
  downloadNotes: {
    en: 'Download Course Notes (PDF)',
    fr: 'Télécharger les notes de cours (PDF)',
    pt: 'Baixar notas do curso (PDF)',
    es: 'Descargar notas del curso (PDF)'
  },
  generatingNotes: {
    en: 'Preparing Notes for Print/PDF...',
    fr: 'Préparation des notes pour impression/PDF...',
    pt: 'Preparando notas para impressão/PDF...',
    es: 'Preparando notas para imprimir/PDF...'
  },

  // Adaptive Skill Assessment
  skillAssessment: {
    en: 'Adaptive Skill Assessment',
    fr: 'Évaluation des compétences adaptative',
    pt: 'Avaliação adaptativa de habilidades',
    es: 'Evaluación de habilidades adaptativa'
  },
  takeAssessment: {
    en: 'Take Skill Diagnostic',
    fr: 'Faire le diagnostic',
    pt: 'Fazer diagnóstico de habilidades',
    es: 'Realizar diagnóstico'
  },
  assessmentDesc: {
    en: 'Answer 5 quick scenario questions to tailor your learning pathway and fast-track modules you already know.',
    fr: 'Répondez à 5 questions pour personnaliser votre parcours et ignorer les modules déjà maîtrisés.',
    pt: 'Responda a 5 perguntas para personalizar seu curso e avançar módulos que você já domina.',
    es: 'Responda a 5 preguntas para personalizar su aprendizaje y avanzar módulos que ya domina.'
  },
  recommendedModules: {
    en: 'Recommended to Prioritize',
    fr: 'Recommandé en priorité',
    pt: 'Recomendado priorizar',
    es: 'Recomendado priorizar'
  },
  fastTrackModules: {
    en: 'Fast-Track / Skip',
    fr: 'Accélérer / Ignorer',
    pt: 'Avançar / Pular',
    es: 'Acelerar / Omitir'
  },

  // Study Schedule
  studySchedule: {
    en: 'Study Schedule & Deadlines',
    fr: 'Planning d\'étude & Échéances',
    pt: 'Cronograma de Estudo & Prazos',
    es: 'Horario de Estudio y Plazos'
  },
  addReminder: {
    en: 'Add Study Reminder',
    fr: 'Ajouter un rappel',
    pt: 'Adicionar lembrete',
    es: 'Agregar recordatorio'
  },
  upcomingDeadlines: {
    en: 'Upcoming Deadlines & Sessions',
    fr: 'Échéances et sessions à venir',
    pt: 'Próximos prazos e sessões',
    es: 'Próximos plazos y sesiones'
  },

  // Live Chat
  liveChat: {
    en: 'Live Peer & Tutor Chat',
    fr: 'Chat en direct pairs & tuteurs',
    pt: 'Chat ao vivo com colegas e tutores',
    es: 'Chat en vivo con compañeros y tutores'
  },
  typeMessage: {
    en: 'Type a message to fellow students...',
    fr: 'Écrivez un message aux étudiants...',
    pt: 'Digite uma mensagem para os colegas...',
    es: 'Escriba un mensaje para sus compañeros...'
  },
  sendMessage: {
    en: 'Send',
    fr: 'Envoyer',
    pt: 'Enviar',
    es: 'Enviar'
  },

  // Catalog Filters & Search
  searchPlaceholder: {
    en: 'Search courses by title, keywords or topic...',
    fr: 'Rechercher des cours par titre, mots-clés ou thème...',
    pt: 'Buscar cursos por título, palavras-chave ou tema...',
    es: 'Buscar cursos por título, palabras clave o tema...'
  },
  filterByLevel: {
    en: 'Filter by Level',
    fr: 'Filtrer par niveau',
    pt: 'Filtrar por nível',
    es: 'Filtrar por nivel'
  },
  filterByPricing: {
    en: 'Pricing',
    fr: 'Tarification',
    pt: 'Preço',
    es: 'Precios'
  },
  filterBySector: {
    en: 'Sector',
    fr: 'Secteur',
    pt: 'Setor',
    es: 'Sector'
  },
  beginner: {
    en: 'Beginner',
    fr: 'Débutant',
    pt: 'Iniciante',
    es: 'Principiante'
  },
  intermediate: {
    en: 'Intermediate',
    fr: 'Intermédiaire',
    pt: 'Intermediário',
    es: 'Intermedio'
  },
  advanced: {
    en: 'Advanced',
    fr: 'Avancé',
    pt: 'Avançado',
    es: 'Avanzado'
  },
  freeCourses: {
    en: 'Free',
    fr: 'Gratuit',
    pt: 'Gratuito',
    es: 'Gratis'
  },
  paidCourses: {
    en: 'Paid / Certified',
    fr: 'Payant / Certifié',
    pt: 'Pago / Certificado',
    es: 'De Pago / Certificado'
  },
  clearFilters: {
    en: 'Clear All Filters',
    fr: 'Effacer tous les filtres',
    pt: 'Limpar todos os filtros',
    es: 'Borrar todos los filtros'
  },

  // Sectors
  allSectors: {
    en: 'All Sectors',
    fr: 'Tous les Secteurs',
    pt: 'Todos os Setores',
    es: 'Todos los Sectores'
  },
  privateSector: {
    en: 'Private Sector',
    fr: 'Secteur Privé',
    pt: 'Setor Privado',
    es: 'Sector Privado'
  },
  publicSector: {
    en: 'Government & Public Sector',
    fr: 'Gouvernement & Secteur Public',
    pt: 'Governo e Setor Público',
    es: 'Gobierno y Sector Público'
  },
  coreSaas: {
    en: 'Core SaaS Operations',
    fr: 'Opérations SaaS Principales',
    pt: 'Operações SaaS Principais',
    es: 'Operaciones SaaS Principales'
  },
  viewCourses: {
    en: 'View Courses',
    fr: 'Voir les Cours',
    pt: 'Ver Cursos',
    es: 'Ver Cursos'
  },

  // Course Details & Checkout
  courseDetails: {
    en: 'Course Details',
    fr: 'Détails du Cours',
    pt: 'Detalhes do Curso',
    es: 'Detalles del Curso'
  },
  learningObjectives: {
    en: 'What You Will Learn',
    fr: 'Ce que vous apprendrez',
    pt: 'O que você vai aprender',
    es: 'Lo que aprenderá'
  },
  prerequisites: {
    en: 'Prerequisites',
    fr: 'Prérequis',
    pt: 'Pré-requisitos',
    es: 'Requisitos previos'
  },
  targetAudience: {
    en: 'Target Audience',
    fr: 'Public cible',
    pt: 'Público-alvo',
    es: 'Audiencia objetivo'
  },
  tuitionFee: {
    en: 'Tuition & Certification Fee',
    fr: 'Frais de scolarité & certification',
    pt: 'Taxa de matrícula e certificação',
    es: 'Matrícula y tarifa de certificación'
  },
  freeEnrollment: {
    en: 'FREE ENROLLMENT',
    fr: 'INSCRIPTION GRATUITE',
    pt: 'INSCRIÇÃO GRATUITA',
    es: 'INSCRIPCIÓN GRATUITA'
  },
  standardTuition: {
    en: 'Standard Tuition',
    fr: 'Frais standards',
    pt: 'Taxa padrão',
    es: 'Matrícula estándar'
  },
  totalPayable: {
    en: 'Total Payable',
    fr: 'Total à Payer',
    pt: 'Total a Pagar',
    es: 'Total a Pagar'
  },
  selectPaymentChannel: {
    en: 'Select Payment Channel',
    fr: 'Sélectionner le mode de paiement',
    pt: 'Selecionar canal de pagamento',
    es: 'Seleccionar canal de pago'
  },
  promotionalDiscount: {
    en: 'Promotional Discount (15%)',
    fr: 'Remise promotionnelle (15%)',
    pt: 'Desconto promocional (15%)',
    es: 'Descuento promocional (15%)'
  },
  haveCoupon: {
    en: 'Have coupon? (e.g. MSME2026)',
    fr: 'Un coupon ? (ex. MSME2026)',
    pt: 'Tem cupom? (ex. MSME2026)',
    es: '¿Tiene cupón? (ej. MSME2026)'
  },
  apply: {
    en: 'Apply',
    fr: 'Appliquer',
    pt: 'Aplicar',
    es: 'Aplicar'
  },
  cancel: {
    en: 'Cancel',
    fr: 'Annuler',
    pt: 'Cancelar',
    es: 'Cancelar'
  },
  confirmFreeEnrollment: {
    en: 'Confirm Free Enrollment',
    fr: 'Confirmer l\'inscription gratuite',
    pt: 'Confirmar inscrição gratuita',
    es: 'Confirmar inscripción gratuita'
  },
  oneTimeAccess: {
    en: 'One-time access',
    fr: 'Accès unique à vie',
    pt: 'Acesso vitalício',
    es: 'Acceso de por vida'
  },

  // Actions
  enrollNow: {
    en: 'Enroll Now',
    fr: 'S\'inscrire',
    pt: 'Inscrever-se',
    es: 'Inscribirse'
  },
  startFree: {
    en: 'Start Free',
    fr: 'Commencer gratuitement',
    pt: 'Começar grátis',
    es: 'Comenzar gratis'
  },
  continueLearning: {
    en: 'Continue Learning',
    fr: 'Continuer l\'apprentissage',
    pt: 'Continuar aprendendo',
    es: 'Continuar aprendiendo'
  },
  viewDetails: {
    en: 'View Details',
    fr: 'Voir les détails',
    pt: 'Ver detalhes',
    es: 'Ver detalles'
  },
  all: {
    en: 'All',
    fr: 'Tous',
    pt: 'Todos',
    es: 'Todos'
  },
  close: {
    en: 'Close',
    fr: 'Fermer',
    pt: 'Fechar',
    es: 'Cerrar'
  },

  // Certificate Verification
  verifyTitle: {
    en: 'Verify MsmeBooks Academy Certificate',
    fr: 'Vérifier un Certificat MsmeBooks Academy',
    pt: 'Verificar Certificado da MsmeBooks Academy',
    es: 'Verificar Certificado de MsmeBooks Academy'
  },
  verifySub: {
    en: 'Enter a credential ID or scan QR code to confirm official accreditation status.',
    fr: 'Entrez un identifiant ou scannez le QR code pour confirmer le statut d\'accréditation.',
    pt: 'Insira o ID ou leia o código QR para confirmar o status oficial de credenciamento.',
    es: 'Ingrese el ID o escanee el código QR para confirmar la acreditación oficial.'
  },
  certIdPlaceholder: {
    en: 'e.g. MSME-2026-CA-001',
    fr: 'ex. MSME-2026-CA-001',
    pt: 'ex. MSME-2026-CA-001',
    es: 'ej. MSME-2026-CA-001'
  },
  verifyButton: {
    en: 'Verify Credential',
    fr: 'Vérifier la Certification',
    pt: 'Verificar Credencial',
    es: 'Verificar Credencial'
  },

  // Wishlist
  savedCourses: {
    en: 'Saved Courses',
    fr: 'Cours Enregistrés',
    pt: 'Cursos Salvos',
    es: 'Cursos Guardados'
  },
  emptyWishlist: {
    en: 'Your Wishlist is Currently Empty',
    fr: 'Votre liste d\'envies est actuellement vide',
    pt: 'Sua lista de desejos está vazia no momento',
    es: 'Su lista de deseos está actualmente vacía'
  },
  emptyWishlistDesc: {
    en: 'Found a course you like in Accounting, Point of Sale, Inventory, or Hotel PMS? Click the bookmark icon to save it here for later study.',
    fr: 'Un cours vous intéresse en comptabilité, caisse POS, inventaire ou hôtellerie ? Cliquez sur l\'icône de favori pour le sauvegarder ici.',
    pt: 'Encontrou um curso de seu interesse em Contabilidade, PDV, Estoque ou Hotelaria? Clique no ícone de favorito para salvá-lo aqui.',
    es: '¿Encontró un curso de su interés en Contabilidad, POS, Inventarios u Hotelería? Haga clic en el marcador para guardarlo aquí.'
  }
};

export const getTranslation = (key: string, lang: Language = 'en'): string => {
  if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
    return TRANSLATIONS[key][lang];
  }
  return TRANSLATIONS[key]?.['en'] || key;
};
