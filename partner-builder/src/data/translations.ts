export type SupportedLanguage = 'en' | 'fr' | 'sw' | 'ar' | 'pt' | 'ha' | 'yo' | 'es';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🌍',
    region: 'Global / Pan-African',
    dir: 'ltr'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Afrique de l’Ouest et Centrale',
    dir: 'ltr'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Guinea Ecuatorial, LatAm & España',
    dir: 'ltr'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇦🇴',
    region: 'Angola, Moçambique & Global',
    dir: 'ltr'
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    region: 'Afrika Mashariki (East Africa)',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇪🇬',
    region: 'شمال أفريقيا (North Africa)',
    dir: 'rtl'
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    flag: '🇳🇬',
    region: 'West Africa (Nigeria & Niger)',
    dir: 'ltr'
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    flag: '🇳🇬',
    region: 'West Africa (Nigeria & Benin)',
    dir: 'ltr'
  }
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Partner Programme',
    'nav.tiers': 'Tiers & Badges',
    'nav.benefits': 'Benefits',
    'nav.integrations': 'Audit Integrations',
    'nav.directory': 'Partner Directory',
    'nav.calculator': 'Commission Calculator',
    'nav.academy': 'Certification Academy',
    'nav.faq': 'FAQ',
    'nav.verify_partner': 'Verify Partner',
    'nav.partner_portal': 'Partner Portal',
    'nav.become_partner': 'Become a Partner',
    'nav.impact': 'Partner Impact',
    'nav.rewards': 'P2P Rewards',
    'nav.resources': 'Resources',
    'nav.admin_console': 'Admin Console',

    // Hero
    'hero.badge_trust': 'Empowering Partners. Growing Businesses. Across Africa and Beyond.',
    'hero.headline': 'Partner with MsmeBooks. Grow Your Business. Earn Recurring Revenue.',
    'hero.subheadline': 'Join the MsmeBooks Partner Ecosystem and unlock new business opportunities by helping businesses across Africa and beyond simplify accounting, POS, inventory, and everyday business management.',
    'hero.cta_become': 'Become a Partner',
    'hero.cta_explore': 'Explore Partner Benefits',
    'hero.cta_find': 'Find a Certified Partner',
    'hero.recurring_revenue': 'Up to 40% Recurring Commission',
    'hero.verified_credential': 'Official Verifiable Badges',
    'hero.enterprise_ready': '25+ Audit Software Integrations',

    // Badges Showcase
    'badges.tag': 'Official Partner Credentials',
    'badges.title': 'Four Distinct Membership Badges',
    'badges.desc': 'Every MsmeBooks partner is issued an official digital badge and verifiable identification number. Showcase your credentials across websites, proposals, certificates, and marketing materials.',
    'badges.bronze': 'Bronze Partner',
    'badges.silver': 'Silver Partner',
    'badges.gold': 'Gold Partner',
    'badges.platinum': 'Platinum Partner',
    'badges.official_partner': 'Official Partner',
    'badges.apply_now': 'Apply for this Tier',
    'badges.verify_cta': 'Verify Credential',

    // Why Partner
    'why.tag': 'Programme Advantages',
    'why.title': 'Why Partner with MsmeBooks?',
    'why.desc': 'A purpose-built SaaS ecosystem designed to accelerate your firm’s recurring revenue, client satisfaction, and market authority across Africa.',
    'why.benefit1_title': 'Lucrative Recurring Revenue',
    'why.benefit1_desc': 'Earn up to 40% recurring lifetime commissions on client subscriptions paid on time, every month.',
    'why.benefit2_title': 'Official SaaS Certification',
    'why.benefit2_desc': 'Equip your team with verifiable accreditation, digital badges, and official training certificates.',
    'why.benefit3_title': 'Dedicated Partner Support',
    'why.benefit3_desc': 'Direct priority access to dedicated account managers, technical leads, and implementation engineers.',
    'why.benefit4_title': 'Co-Marketing & Lead Referrals',
    'why.benefit4_desc': 'Get featured in our certified public directory and receive direct enterprise client referrals in your territory.',

    // Audit Integrations
    'audit.tag': 'Bi-Directional Audit Ecosystem',
    'audit.title': 'Integrate Any Audit Software with MsmeBooks',
    'audit.desc': 'Eliminate manual CSV downloads, spreadsheet re-keying, and outdated lead schedules. Connect your audit practice’s preferred software directly to MsmeBooks using our high-speed REST API and real-time Event Webhooks.',
    'audit.track1_label': 'Row 1 • Sliding Left: Working Papers, Reporting & Continuous Assurance',
    'audit.track2_label': 'Row 2 • Sliding Right: AI Analytics, Sampling & Intelligent Verification',
    'audit.request_sandbox': 'Request Audit API Sandbox Key',
    'audit.view_specs': 'View API Specs',

    // Academy
    'academy.tag': 'Partner Enablement & Academy',
    'academy.title': 'Learn. Get Certified. Grow.',
    'academy.desc': 'Our structured certification curriculum equips your engineers, accountants, and consultants with enterprise implementation methodologies.',
    'academy.countdown_title': 'Next Academy Cohort Starts in:',
    'academy.claim_seat': 'Claim Your Cohort Seat',
    'academy.preview_badge': 'Preview Certificate & Badge',

    // Calculator
    'calc.tag': 'Earnings Estimator',
    'calc.title': 'Calculate Your Recurring Partner Revenue',
    'calc.desc': 'Estimate your monthly and annual commission payouts based on client count, business size, and your partner tier.',

    // Directory
    'dir.tag': 'Certified Directory',
    'dir.title': 'Find an Accredited MsmeBooks Partner',
    'dir.desc': 'Browse verified partners across Nigeria, Kenya, Ghana, South Africa, and international markets.',

    // Final CTA
    'cta.title': 'Ready to Grow with MsmeBooks?',
    'cta.desc': 'Join hundreds of accounting firms, technology consultants, and software distributors building high-margin recurring revenue across Africa and globally.',
    'cta.button': 'Apply to Become a Partner',
    'cta.find': 'Find a Certified Partner',

    // Footer
    'footer.tagline': 'The all-in-one Accounting, POS, Inventory, and Business Management platform for Africa and beyond.',
    'footer.rights': 'All rights reserved. MsmeBooks is registered across Africa and the United Kingdom.',
    'lang.switcher_label': 'Select Language',

    // Partner Portal
    'portal.header_title': 'MsmeBooks Partner Portal',
    'portal.tab_overview': 'Overview',
    'portal.tab_leaderboard': '🏆 Global Leaderboard',
    'portal.tab_clients': 'Clients',
    'portal.tab_commissions': 'Commissions & Earnings',
    'portal.tab_payouts': 'Payout History',
    'portal.tab_support': 'Support & Escalation',
    'portal.ref_link_label': 'Your Dedicated Referral Link',
    'portal.copy_link': 'Copy Referral Link',
    'portal.link_copied': 'Link Copied!',
    'portal.kpi_monthly': 'Monthly Recurring Commission',
    'portal.kpi_total': 'Total Paid-out to Date',
    'portal.kpi_clients': 'Active Subscribed Clients',
    'portal.kpi_payout': 'Next Wire Payout Date',
    'portal.download_badge': 'Download Badge',
    'portal.status_active': 'Status: Verified Active',

    // Offline & Connectivity
    'offline.status_online': 'Online',
    'offline.status_offline': 'Offline Mode',
    'offline.banner_offline': 'Operating in Offline Mode — Local Cache Active. Submissions and referrals will sync automatically when reconnected.',
    'offline.sync_active': 'Cloud Real-Time Sync Active',

    // Currency
    'currency.switcher_label': 'Select Currency',
    'currency.rates_live': 'Multi-Currency Real-Time Conversion',

    // Theme
    'theme.toggle_dark': 'Switch to Dark Mode (Deep Navy)',
    'theme.toggle_light': 'Switch to Light Mode'
  },

  fr: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Programme Partenaire',
    'nav.tiers': 'Niveaux & Badges',
    'nav.benefits': 'Avantages',
    'nav.integrations': 'Intégrations Audit',
    'nav.directory': 'Annuaire Partenaires',
    'nav.calculator': 'Calculateur de Commission',
    'nav.academy': 'Académie de Certification',
    'nav.faq': 'FAQ',
    'nav.verify_partner': 'Vérifier Partenaire',
    'nav.partner_portal': 'Portail Partenaire',
    'nav.become_partner': 'Devenir Partenaire',
    'nav.impact': 'Impact Partenaires',
    'nav.rewards': 'Récompenses P2P',
    'nav.resources': 'Ressources',
    'nav.admin_console': 'Console Admin',

    // Hero
    'hero.badge_trust': 'Autonomiser les partenaires. Développer les entreprises. En Afrique et au-delà.',
    'hero.headline': 'Devenez Partenaire MsmeBooks. Développez Votre Activité. Générez des Revenus Récurrents.',
    'hero.subheadline': 'Rejoignez l’écosystème de partenaires MsmeBooks et débloquez de nouvelles opportunités en aidant les entreprises d’Afrique et d’ailleurs à simplifier leur comptabilité, leur caisse (POS), leurs stocks et leur gestion quotidienne.',
    'hero.cta_become': 'Devenir Partenaire',
    'hero.cta_explore': 'Explorer les Avantages',
    'hero.cta_find': 'Trouver un Partenaire Certifié',
    'hero.recurring_revenue': 'Jusqu’à 40% de Commission Récurrente',
    'hero.verified_credential': 'Badges Officiels Vérifiables',
    'hero.enterprise_ready': '25+ Logiciels d’Audit Intégrés',

    // Badges Showcase
    'badges.tag': 'Titres Officiels de Partenariat',
    'badges.title': 'Quatre Badges de Membre Distincts',
    'badges.desc': 'Chaque partenaire MsmeBooks reçoit un badge numérique officiel et un numéro d’identification vérifiable. Affichez vos compétences sur vos sites web, propositions commerciales et supports marketing.',
    'badges.bronze': 'Partenaire Bronze',
    'badges.silver': 'Partenaire Argent',
    'badges.gold': 'Partenaire Or',
    'badges.platinum': 'Partenaire Platine',
    'badges.official_partner': 'Partenaire Officiel',
    'badges.apply_now': 'Postuler pour ce Niveau',
    'badges.verify_cta': 'Vérifier l’Accréditation',

    // Why Partner
    'why.tag': 'Avantages du Programme',
    'why.title': 'Pourquoi Devenir Partenaire MsmeBooks ?',
    'why.desc': 'Un écosystème SaaS spécialement conçu pour accélérer les revenus récurrents, la fidélisation client et l’autorité sur le marché de votre cabinet en Afrique.',
    'why.benefit1_title': 'Revenus Récurrents Lucratifs',
    'why.benefit1_desc': 'Gagnez jusqu’à 40% de commission récurrente à vie sur les abonnements de vos clients, versés ponctuellement chaque mois.',
    'why.benefit2_title': 'Certification SaaS Officielle',
    'why.benefit2_desc': 'Dotez votre équipe d’accréditations vérifiables, de badges numériques et de certificats de formation reconnus.',
    'why.benefit3_title': 'Support Partenaire Dédié',
    'why.benefit3_desc': 'Accès direct et prioritaire à des directeurs de comptes, ingénieurs et spécialistes du déploiement dédiés.',
    'why.benefit4_title': 'Co-Marketing & Références Clients',
    'why.benefit4_desc': 'Figurez dans notre annuaire public certifié et recevez des prospects qualifiés dans votre zone géographique.',

    // Audit Integrations
    'audit.tag': 'Écosystème d’Audit Bi-Directionnel',
    'audit.title': 'Intégrez Tous Vos Logiciels d’Audit avec MsmeBooks',
    'audit.desc': 'Éliminez les exports CSV manuels et les ressaisies fastidieuses. Connectez directement les logiciels d’audit de votre cabinet à MsmeBooks grâce à notre API REST ultra-rapide et nos webhooks en temps réel.',
    'audit.track1_label': 'Ligne 1 • Défilement Gauche : Dossiers de Travail, Reporting & Assurance Continue',
    'audit.track2_label': 'Ligne 2 • Défilement Droite : Analyse par IA, Échantillonnage & Vérification Intelligente',
    'audit.request_sandbox': 'Demander une Clé Sandbox API',
    'audit.view_specs': 'Voir les Spécifications API',

    // Academy
    'academy.tag': 'Habilitation & Académie Partenaire',
    'academy.title': 'Apprenez. Certifiez-vous. Progressez.',
    'academy.desc': 'Notre cursus de formation structuré prépare vos ingénieurs, experts-comptables et consultants aux méthodologies de déploiement d’entreprise.',
    'academy.countdown_title': 'La Prochaine Cohorte Débute Dans :',
    'academy.claim_seat': 'Réserver Votre Place en Cohorte',
    'academy.preview_badge': 'Aperçu du Certificat & Badge',

    // Calculator
    'calc.tag': 'Simulateur de Gains',
    'calc.title': 'Calculez Vos Revenus Récurrents de Partenaire',
    'calc.desc': 'Estimez vos commissions mensuelles et annuelles selon le volume de clients, la taille des entreprises et votre niveau de partenariat.',

    // Directory
    'dir.tag': 'Annuaire Certifié',
    'dir.title': 'Trouver un Partenaire MsmeBooks Agréé',
    'dir.desc': 'Consultez les partenaires vérifiés au Sénégal, en Côte d’Ivoire, au Cameroun, en RDC et à l’international.',

    // Final CTA
    'cta.title': 'Prêt à Vous Développer avec MsmeBooks ?',
    'cta.desc': 'Rejoignez des centaines de cabinets comptables et de consultants IT qui génèrent des revenus récurrents élevés en Afrique et dans le monde.',
    'cta.button': 'Postuler au Programme Partenaire',
    'cta.find': 'Trouver un Partenaire Certifié',

    // Footer
    'footer.tagline': 'La plateforme tout-en-un de Comptabilité, Caisse (POS), Stocks et Gestion d’Entreprise pour l’Afrique et le monde.',
    'footer.rights': 'Tous droits réservés. MsmeBooks est enregistré en Afrique et au Royaume-Uni.',
    'lang.switcher_label': 'Changer de Langue',

    // Partner Portal
    'portal.header_title': 'Portail Partenaire MsmeBooks',
    'portal.tab_overview': 'Aperçu',
    'portal.tab_leaderboard': '🏆 Classement Mondial',
    'portal.tab_clients': 'Clients',
    'portal.tab_commissions': 'Commissions & Gains',
    'portal.tab_payouts': 'Historique des Paiements',
    'portal.tab_support': 'Support & Escalade',
    'portal.ref_link_label': 'Votre Lien de Parrainage Dédié',
    'portal.copy_link': 'Copier le Lien',
    'portal.link_copied': 'Lien Copié !',
    'portal.kpi_monthly': 'Commission Récurrente Mensuelle',
    'portal.kpi_total': 'Total Payé à ce Jour',
    'portal.kpi_clients': 'Clients Abonnés Actifs',
    'portal.kpi_payout': 'Prochaine Date de Paiement',
    'portal.download_badge': 'Télécharger le Badge',
    'portal.status_active': 'Statut : Vérifié Actif',

    // Offline & Connectivity
    'offline.status_online': 'En Ligne',
    'offline.status_offline': 'Mode Hors Ligne',
    'offline.banner_offline': 'Fonctionnement en mode hors ligne — Cache local actif. Vos actions seront synchronisées dès le rétablissement de la connexion.',
    'offline.sync_active': 'Synchronisation Cloud en Temps Réel',

    // Currency
    'currency.switcher_label': 'Sélectionner la Devise',
    'currency.rates_live': 'Conversion Multidevises en Temps Réel',

    // Theme
    'theme.toggle_dark': 'Passer en Mode Sombre (Bleu Nuit)',
    'theme.toggle_light': 'Passer en Mode Clair'
  },

  sw: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Programu ya Washirika',
    'nav.tiers': 'Viwango na Beji',
    'nav.benefits': 'Faida',
    'nav.integrations': 'Miunganisho ya Ukaguzi',
    'nav.directory': 'Orodha ya Washirika',
    'nav.calculator': 'Kikokotoo cha Kamisheni',
    'nav.academy': 'Chuo cha Cheti',
    'nav.faq': 'Maswali ya Kawaida',
    'nav.verify_partner': 'Thibitisha Mshirika',
    'nav.partner_portal': 'Mlango wa Mshirika',
    'nav.become_partner': 'Kuwa Mshirika',
    'nav.impact': 'Athari ya Washirika',
    'nav.rewards': 'Tuzo za P2P',
    'nav.resources': 'Nyenzo na Rasilimali',
    'nav.admin_console': 'Dashibodi ya Usimamizi',

    // Hero
    'hero.badge_trust': 'Kuwezesha Washirika. Kukuza Biashara. Kote Barani Afrika na Ulimwenguni.',
    'hero.headline': 'Shirikiana na MsmeBooks. Kuza Biashara Yako. Pata Mapato ya Kila Mwezi.',
    'hero.subheadline': 'Jiunge na Mfumo wa Washirika wa MsmeBooks na upate fursa mpya za biashara kwa kusaidia biashara kote Afrika kurahisisha uhasibu, POS, orodha ya bidhaa, na usimamizi wa kila siku.',
    'hero.cta_become': 'Kuwa Mshirika',
    'hero.cta_explore': 'Chunguza Faida za Washirika',
    'hero.cta_find': 'Tafuta Mshirika Aliyethibitishwa',
    'hero.recurring_revenue': 'Hadi 40% Kamisheni ya Kila Mwezi',
    'hero.verified_credential': 'Beji Rasmi Zinazothibitishwa',
    'hero.enterprise_ready': 'Mifumo 25+ ya Ukaguzi Imeunganishwa',

    // Badges Showcase
    'badges.tag': 'Vyeti Rasmi vya Ushirika',
    'badges.title': 'Beji Nne Tofauti za Uanachama',
    'badges.desc': 'Kila mshirika wa MsmeBooks anapewa beji rasmi ya kidijitali na nambari ya utambulisho inayothibitishwa mtandaoni.',
    'badges.bronze': 'Mshirika wa Shaba (Bronze)',
    'badges.silver': 'Mshirika wa Fedha (Silver)',
    'badges.gold': 'Mshirika wa Dhahabu (Gold)',
    'badges.platinum': 'Mshirika wa Platinamu (Platinum)',
    'badges.official_partner': 'Mshirika Rasmi',
    'badges.apply_now': 'Omba Kiwango Hiki',
    'badges.verify_cta': 'Thibitisha Cheti',

    // Why Partner
    'why.tag': 'Manufaa ya Programu',
    'why.title': 'Kwa Nini Ushirikiane na MsmeBooks?',
    'why.desc': 'Mfumo maalum wa SaaS ulioundwa ili kuharakisha mapato endelevu ya kampuni yako na kuimarisha huduma za wateja kote Afrika.',
    'why.benefit1_title': 'Mapato ya Kudumu ya Kila Mwezi',
    'why.benefit1_desc': 'Pata hadi 40% ya kamisheni ya maisha kwa usajili wa wateja wako, ikilipwa kwa wakati kila mwezi.',
    'why.benefit2_title': 'Vyeti Rasmi vya SaaS',
    'why.benefit2_desc': 'Wape wataalamu wako vyeti vya kimataifa vinavyotambulika na beji za kidijitali.',
    'why.benefit3_title': 'Msaada wa Kujitolea kwa Washirika',
    'why.benefit3_desc': 'Pata mawasiliano ya moja kwa moja na wahandisi wa kiufundi na mameneja wa akaunti.',
    'why.benefit4_title': 'Wateja Wapya na Masoko ya Pamoja',
    'why.benefit4_desc': 'Orodheshwa katika saraka yetu ya umma na upokee rufaa za wateja wa mashirika katika eneo lako.',

    // Audit Integrations
    'audit.tag': 'Mfumo wa Ukaguzi wa Pandembili',
    'audit.title': 'Unganisha Programu Yoyote ya Ukaguzi na MsmeBooks',
    'audit.desc': 'Ondoa matatizo ya majedwali ya Excel. Unganisha zana zako za ukaguzi moja kwa moja kwenye MsmeBooks kupitia REST API na Webhooks zetu za haraka.',
    'audit.track1_label': 'Mstari 1 • Kusonga Kushoto: Karatasi za Kazi, Taarifa na Ukaguzi Endelevu',
    'audit.track2_label': 'Mstari 2 • Kusonga Kulia: Uchambuzi wa AI, Sampuli na Uthibitishaji Mahiri',
    'audit.request_sandbox': 'Omba Ufunguo wa Sandbox ya API',
    'audit.view_specs': 'Tazama Maelezo ya API',

    // Academy
    'academy.tag': 'Chuo na Mafunzo ya Washirika',
    'academy.title': 'Jifunze. Pata Cheti. Kuza Biashara.',
    'academy.desc': 'Mtaala wetu uliopangwa huwapa wahandisi na wahasibu wako ujuzi wa kiwango cha juu cha utekelezaji.',
    'academy.countdown_title': 'Kikundi Kinachofuata Kinaanza Baada Ya:',
    'academy.claim_seat': 'Chukua Nafasi Yako ya Kikundi',
    'academy.preview_badge': 'Kagua Cheti na Beji Yako',

    // Calculator
    'calc.tag': 'Kikadiria Mapato',
    'calc.title': 'Kadiria Mapato Yako ya Kila Mwezi',
    'calc.desc': 'Kadiria malipo ya kamisheni yako ya kila mwezi kulingana na idadi ya wateja na kiwango chako cha ushirika.',

    // Directory
    'dir.tag': 'Orodha ya Washirika',
    'dir.title': 'Pata Mshirika wa MsmeBooks Aliyehitimu',
    'dir.desc': 'Tafuta washirika walioidhinishwa nchini Kenya, Tanzania, Uganda, Rwanda na kimataifa.',

    // Final CTA
    'cta.title': 'Uko Tayari Kukuza Biashara Yako?',
    'cta.desc': 'Ungana na mamia ya makampuni ya uhasibu na washauri wa TEHAMA wanaopata mapato endelevu kote Afrika.',
    'cta.button': 'Omba Kuwa Mshirika Sasa',
    'cta.find': 'Tafuta Mshirika Aliyethibitishwa',

    // Footer
    'footer.tagline': 'Mfumo kamili wa Uhasibu, POS, Orodha ya Bidhaa na Usimamizi wa Biashara kwa Afrika na ulimwengu.',
    'footer.rights': 'Haki zote zimehifadhiwa. MsmeBooks imesajiliwa kote Afrika na Uingereza.',
    'lang.switcher_label': 'Chagua Lugha',

    // Partner Portal
    'portal.header_title': 'Lango la Mshirika la MsmeBooks',
    'portal.tab_overview': 'Muhtasari',
    'portal.tab_leaderboard': '🏆 Ubao wa Viongozi Duniani',
    'portal.tab_clients': 'Wateja',
    'portal.tab_commissions': 'Tume na Mapato',
    'portal.tab_payouts': 'Historia ya Malipo',
    'portal.tab_support': 'Usaidizi na Maombi',
    'portal.ref_link_label': 'Kiungo Chako Maalum cha Rufaa',
    'portal.copy_link': 'Nakili Kiungo',
    'portal.link_copied': 'Kiungo Kimenakiliwa!',
    'portal.kpi_monthly': 'Tume ya Kila Mwezi Inayojirudia',
    'portal.kpi_total': 'Jumla Iliyolipwa Hadi Sasa',
    'portal.kpi_clients': 'Wateja Amilifu Waliojisajili',
    'portal.kpi_payout': 'Tarehe Ijayo ya Malipo ya Waya',
    'portal.download_badge': 'Pakua Beji',
    'portal.status_active': 'Hali: Imethibitishwa Imewashwa'
  },

  ar: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'برنامج الشركاء',
    'nav.tiers': 'المستويات والشارات',
    'nav.benefits': 'المزايا',
    'nav.integrations': 'تكاملات التدقيق',
    'nav.directory': 'دليل الشركاء',
    'nav.calculator': 'حاسبة العمولات',
    'nav.academy': 'أكاديمية الشهادات',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.verify_partner': 'التحقق من شريك',
    'nav.partner_portal': 'بوابة الشركاء',
    'nav.become_partner': 'انضم كشريك',
    'nav.impact': 'تأثير الشركاء',
    'nav.rewards': 'مكافآت الإحالة P2P',
    'nav.resources': 'الموارد والأصول',
    'nav.admin_console': 'لوحة الإدارة',

    // Hero
    'hero.badge_trust': 'تمكين الشركاء. تنمية الأعمال. عبر إفريقيا وحول العالم.',
    'hero.headline': 'شارك مع MsmeBooks. نمّ أعمالك. اكسب عوائد دورية ومستمرة.',
    'hero.subheadline': 'انضم إلى منظومة شركاء MsmeBooks وافتح آفاقاً استثمارية جديدة بمساعدة الشركات في تبسيط المحاسبة ونقاط البيع وإدارة المخزون.',
    'hero.cta_become': 'كن شريكاً معتمداً',
    'hero.cta_explore': 'استكشف مزايا الشراكة',
    'hero.cta_find': 'ابحث عن شريك معتمد',
    'hero.recurring_revenue': 'عمولات دورية تصل إلى 40%',
    'hero.verified_credential': 'شارات رقمية معتمدة وقابلة للتحقق',
    'hero.enterprise_ready': 'تكامل مع أكثر من 25 برنامج تدقيق',

    // Badges Showcase
    'badges.tag': 'اعتمادات الشراكة الرسمية',
    'badges.title': 'أربع شارات عضوية حصرية',
    'badges.desc': 'يُمنح كل شريك شارة رقمية رسمية ومعرّفاً قابلاً للتحقق لإبراز الاعتماد في عروضكم ومواقعكم الإلكترونية.',
    'badges.bronze': 'شريك برونزي',
    'badges.silver': 'شريك فضي',
    'badges.gold': 'شريك ذهبي',
    'badges.platinum': 'شريك بلاتيني',
    'badges.official_partner': 'شريك رسمي معتمد',
    'badges.apply_now': 'التقدم لهذا المستوى',
    'badges.verify_cta': 'التحقق من الاعتماد',

    // Why Partner
    'why.tag': 'مزايا البرنامج',
    'why.title': 'لماذا تشارك مع MsmeBooks؟',
    'why.desc': 'منظومة سحابية متطورة مصممة لمضاعفة العوائد المتكررة لمكتبك وتوسيع قاعدة عملائك.',
    'why.benefit1_title': 'عوائد شهرية مجزية',
    'why.benefit1_desc': 'اكسب عمولات متكررة تصل إلى 40% تدفع شهرياً بدقة وانتظام.',
    'why.benefit2_title': 'شهادات سحابية معتمدة',
    'why.benefit2_desc': 'زوّد فريقك باعتمادات مهنية وشارات رقمية تزيد من مصداقية مكتبك.',
    'why.benefit3_title': 'دعم فني واستراتيجي مخصص',
    'why.benefit3_desc': 'تواصل مباشر مع مهندسي النظام ومديري الحسابات لدعم مشاريعك.',
    'why.benefit4_title': 'تسويق مشترك وإحالات عملاء',
    'why.benefit4_desc': 'إدراج في دليل الشركاء المعتمد والحصول على عملاء مباشرين في منطقتك.',

    // Audit Integrations
    'audit.tag': 'منظومة تدقيق متكاملة',
    'audit.title': 'ربط جميع برامج التدقيق المحاسبي مع MsmeBooks',
    'audit.desc': 'وداعاً للإدخال اليدوي وجداول الإكسل. اربط برامج التدقيق المفضلة لديك مباشرة عبر REST API وWebhooks الفورية.',
    'audit.track1_label': 'المسار 1: أوراق العمل والتقارير والتدقيق المستمر',
    'audit.track2_label': 'المسار 2: تحليلات الذكاء الاصطناعي وأخذ العينات والتحقق الذكي',
    'audit.request_sandbox': 'طلب مفتاح تجريبي للـ API',
    'audit.view_specs': 'عرض مواصفات الـ API',

    // Academy
    'academy.tag': 'تمكين وتدريب الشركاء',
    'academy.title': 'تعلّم. احصل على الشهادة. انطلق.',
    'academy.desc': 'منهج تدريبي معتمد يزود المحاسبين والاستشاريين بأحدث منهجيات التطبيق للمؤسسات.',
    'academy.countdown_title': 'يبدأ الفوج القادم خلال:',
    'academy.claim_seat': 'احجز مقعدك في الفوج القادم',
    'academy.preview_badge': 'معاينة الشهادة والشارة باسمك',

    // Calculator
    'calc.tag': 'حاسبة الأرباح',
    'calc.title': 'احسب عوائدك المتوقعة من الشراكة',
    'calc.desc': 'توقع دخلك الشهري والسنوي بناءً على عدد المشتركين ومستوى شراكتك.',

    // Directory
    'dir.tag': 'دليل الشركاء المعتمدين',
    'dir.title': 'ابحث عن شريك MsmeBooks معتمد',
    'dir.desc': 'تصفح قائمة الشركاء المعتمدين في مصر، المغرب، تونس، الجزائر ودولياً.',

    // Final CTA
    'cta.title': 'هل أنت مستعد للنمو مع MsmeBooks؟',
    'cta.desc': 'انضم إلى مئات مكاتب المحاسبة وشركات تقنية المعلومات التي تبني عوائد مستقرة ومربحة.',
    'cta.button': 'قدم طلب الانضمام كشريك',
    'cta.find': 'ابحث عن شريك معتمد',

    // Footer
    'footer.tagline': 'المنصة الشاملة للمحاسبة ونقاط البيع وإدارة المخزون في إفريقيا والعالم.',
    'footer.rights': 'جميع الحقوق محفوظة. MsmeBooks مسجلة في إفريقيا والمملكة المتحدة.',
    'lang.switcher_label': 'اختر اللغة',

    // Partner Portal
    'portal.header_title': 'بوابة شركاء MsmeBooks',
    'portal.tab_overview': 'نظرة عامة',
    'portal.tab_leaderboard': '🏆 لوحة المتصدرين العالمية',
    'portal.tab_clients': 'العملاء',
    'portal.tab_commissions': 'العمولات والأرباح',
    'portal.tab_payouts': 'سجل المدفوعات',
    'portal.tab_support': 'الدعم الفني',
    'portal.ref_link_label': 'رابط الإحالة المخصص لك',
    'portal.copy_link': 'نسخ الرابط',
    'portal.link_copied': 'تم نسخ الرابط!',
    'portal.kpi_monthly': 'العمولة الشهرية المتكررة',
    'portal.kpi_total': 'إجمالي المدفوعات حتى اليوم',
    'portal.kpi_clients': 'العملاء النشطون المشتركون',
    'portal.kpi_payout': 'تاريخ التحويل المصرفي القادم',
    'portal.download_badge': 'تحميل الشارة',
    'portal.status_active': 'الحالة: نشط ومتحقق منه'
  },

  pt: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Programa de Parceiros',
    'nav.tiers': 'Níveis e Distintivos',
    'nav.benefits': 'Benefícios',
    'nav.integrations': 'Integrações de Auditoria',
    'nav.directory': 'Directório de Parceiros',
    'nav.calculator': 'Calculadora de Comissões',
    'nav.academy': 'Academia de Certificação',
    'nav.faq': 'Perguntas Frequentes',
    'nav.verify_partner': 'Verificar Parceiro',
    'nav.partner_portal': 'Portal do Parceiro',
    'nav.become_partner': 'Tornar-se Parceiro',
    'nav.impact': 'Impacto dos Parceiros',
    'nav.rewards': 'Recompensas P2P',
    'nav.resources': 'Recursos',
    'nav.admin_console': 'Consola de Administração',

    // Hero
    'hero.badge_trust': 'Capacitar Parceiros. Fazer Crescer Negócios. Em África e no Mundo.',
    'hero.headline': 'Seja Parceiro MsmeBooks. Faça Crescer o Seu Negócio. Ganhe Receita Recorrente.',
    'hero.subheadline': 'Junte-se ao Ecossistema de Parceiros MsmeBooks e descubra novas oportunidades ajudando empresas a simplificar a contabilidade, POS e gestão de stocks.',
    'hero.cta_become': 'Tornar-se Parceiro',
    'hero.cta_explore': 'Explorar Benefícios',
    'hero.cta_find': 'Encontrar Parceiro Certificado',
    'hero.recurring_revenue': 'Até 40% de Comissão Recorrente',
    'hero.verified_credential': 'Distintivos Oficiais Verificáveis',
    'hero.enterprise_ready': '25+ Softwares de Auditoria Integrados',

    // Badges Showcase
    'badges.tag': 'Credenciais Oficiais de Parceria',
    'badges.title': 'Quatro Distintivos Exclusivos de Membro',
    'badges.desc': 'Cada parceiro MsmeBooks recebe um distintivo digital oficial e um número de identificação verificável para exibir nos seus websites e propostas.',
    'badges.bronze': 'Parceiro Bronze',
    'badges.silver': 'Parceiro Prata',
    'badges.gold': 'Parceiro Ouro',
    'badges.platinum': 'Parceiro Platina',
    'badges.official_partner': 'Parceiro Oficial',
    'badges.apply_now': 'Candidatar-se a Este Nível',
    'badges.verify_cta': 'Verificar Credencial',

    // Why Partner
    'why.tag': 'Vantagens do Programa',
    'why.title': 'Por Que Ser Parceiro MsmeBooks?',
    'why.desc': 'Um ecossistema SaaS concebido para acelerar a receita recorrente da sua empresa e a satisfação dos seus clientes.',
    'why.benefit1_title': 'Receita Recorrente Lucrativa',
    'why.benefit1_desc': 'Ganhe até 40% de comissão recorrente vitalícia sobre as subscrições dos seus clientes.',
    'why.benefit2_title': 'Certificação SaaS Oficial',
    'why.benefit2_desc': 'Equipe a sua equipa com certificações reconhecidas e distintivos digitais oficiais.',
    'why.benefit3_title': 'Suporte Dedicado ao Parceiro',
    'why.benefit3_desc': 'Acesso directo a gestores de conta e especialistas em implementação técnica.',
    'why.benefit4_title': 'Co-Marketing e Encaminhamento de Clientes',
    'why.benefit4_desc': 'Destaque-se no nosso directório público e receba contactos de empresas no seu país.',

    // Audit Integrations
    'audit.tag': 'Ecossistema Bidireccional de Auditoria',
    'audit.title': 'Integre Qualquer Software de Auditoria com MsmeBooks',
    'audit.desc': 'Elimine ficheiros manuais e reintrodução de dados. Ligue o software da sua preferência à MsmeBooks via REST API e Webhooks em tempo real.',
    'audit.track1_label': 'Linha 1 • Deslizar à Esquerda: Papéis de Trabalho e Relatórios',
    'audit.track2_label': 'Linha 2 • Deslizar à Direita: Análise por IA e Amostragem',
    'audit.request_sandbox': 'Pedir Chave de Sandbox da API',
    'audit.view_specs': 'Ver Especificações da API',

    // Academy
    'academy.tag': 'Capacitação e Academia de Parceiros',
    'academy.title': 'Aprenda. Certifique-se. Cresça.',
    'academy.desc': 'O nosso currículo prepara consultores e contabilistas com metodologias empresariais de excelência.',
    'academy.countdown_title': 'O Próximo Grupo Inicia Em:',
    'academy.claim_seat': 'Garantir Vaga no Grupo',
    'academy.preview_badge': 'Pré-visualizar Certificado e Distintivo',

    // Calculator
    'calc.tag': 'Estimador de Rendimentos',
    'calc.title': 'Calcule a Sua Receita Recorrente',
    'calc.desc': 'Estime as suas comissões mensais e anuais com base no número de clientes e no seu nível de parceria.',

    // Directory
    'dir.tag': 'Directório de Parceiros Certificados',
    'dir.title': 'Encontre um Parceiro MsmeBooks Credenciado',
    'dir.desc': 'Pesquise parceiros certificados em Angola, Moçambique, Portugal e no mercado internacional.',

    // Final CTA
    'cta.title': 'Pronto para Crescer com a MsmeBooks?',
    'cta.desc': 'Junte-se a centenas de gabinetes de contabilidade e consultorias de TI que geram receitas recorrentes sustentáveis.',
    'cta.button': 'Candidatar-se ao Programa',
    'cta.find': 'Encontrar um Parceiro Certificado',

    // Footer
    'footer.tagline': 'A plataforma completa de Contabilidade, POS, Inventário e Gestão Empresarial para África e o mundo.',
    'footer.rights': 'Todos os direitos reservados. MsmeBooks registada em África e no Reino Unido.',
    'lang.switcher_label': 'Selecionar Idioma',

    // Partner Portal
    'portal.header_title': 'Portal do Parceiro MsmeBooks',
    'portal.tab_overview': 'Visão Geral',
    'portal.tab_leaderboard': '🏆 Tabela Global de Líderes',
    'portal.tab_clients': 'Clientes',
    'portal.tab_commissions': 'Comissões e Ganhos',
    'portal.tab_payouts': 'Histórico de Pagamentos',
    'portal.tab_support': 'Suporte e Atendimento',
    'portal.ref_link_label': 'O Seu Link de Indicação Dedicado',
    'portal.copy_link': 'Copiar Link',
    'portal.link_copied': 'Link Copiado!',
    'portal.kpi_monthly': 'Comissão Recorrente Mensal',
    'portal.kpi_total': 'Total Pago até à Data',
    'portal.kpi_clients': 'Clientes Ativos Assinantes',
    'portal.kpi_payout': 'Próxima Data de Transferência',
    'portal.download_badge': 'Baixar Emblema',
    'portal.status_active': 'Estado: Verificado Ativo',

    // Offline & Connectivity
    'offline.status_online': 'Online',
    'offline.status_offline': 'Modo Offline',
    'offline.banner_offline': 'A operar em modo offline — Cache local ativa. Os seus dados e indicações serão sincronizados automaticamente quando a ligação for restaurada.',
    'offline.sync_active': 'Sincronização Cloud em Tempo Real Ativa',

    // Currency
    'currency.switcher_label': 'Selecionar Moeda',
    'currency.rates_live': 'Conversão Multimoeda em Tempo Real',

    // Theme
    'theme.toggle_dark': 'Mudar para Modo Escuro (Azul Noite)',
    'theme.toggle_light': 'Mudar para Modo Claro'
  },

  ha: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Shirin Abokan Hulɗa',
    'nav.tiers': 'Matakai da Tambura',
    'nav.benefits': 'Fa’idodi',
    'nav.integrations': 'Haɗin Manhajojin Binciken Kuɗi',
    'nav.directory': 'Jerin Abokan Hulɗa',
    'nav.calculator': 'Kwamfutar Lissafin Lada',
    'nav.academy': 'Makarantar Horarwa da Takardun Shaida',
    'nav.faq': 'Tambayoyin da Aka Saba Yi',
    'nav.verify_partner': 'Tabbatar da Abokin Hulɗa',
    'nav.partner_portal': 'Kofar Abokin Hulɗa',
    'nav.become_partner': 'Zama Abokin Hulɗa',
    'nav.impact': 'Tasirin Abokan Hulɗa',
    'nav.rewards': 'Ladan P2P',
    'nav.resources': 'Kayan Aiki',
    'nav.admin_console': 'Gudanarwar Manhaja',

    // Hero
    'hero.badge_trust': 'Karfafa Abokan Hulɗa. Habaka Kasuwanci. A fadin Afirka da Duniya.',
    'hero.headline': 'Yi Abota da MsmeBooks. Habaka Kasuwancinku. Samu Riba Mai Dorewa.',
    'hero.subheadline': 'Shiga cikin shirin abokan hulɗa na MsmeBooks domin samun sabbin damammaki ta hanyar taimaka wa ‘yan kasuwa saukaka lissafi, sayarwa (POS), da kayan ajiya.',
    'hero.cta_become': 'Zama Abokin Hulɗa',
    'hero.cta_explore': 'Duba Fa’idodi',
    'hero.cta_find': 'Nemi Abokin Hulɗa',
    'hero.recurring_revenue': 'Ribar Har Zuwa 40% a Kowanne Wata',
    'hero.verified_credential': 'Tambura da Takardun Shaida na Gaskiya',
    'hero.enterprise_ready': 'Haɗin Manhajojin Audit Sama da 25',

    // Badges Showcase
    'badges.tag': 'Tamburan Yabo na Doka',
    'badges.title': 'Tambura Hudu Masu Daraja',
    'badges.desc': 'Kowanne abokin hulɗa na MsmeBooks yana samun tambarin dijital da lambar tantancewa ta musamman domin nunawa a shafukan yanar gizo da takardun aiki.',
    'badges.bronze': 'Abokin Hulɗa na Bronze',
    'badges.silver': 'Abokin Hulɗa na Azurfa (Silver)',
    'badges.gold': 'Abokin Hulɗa na Zinare (Gold)',
    'badges.platinum': 'Abokin Hulɗa na Platinum',
    'badges.official_partner': 'Halattaccen Abokin Hulɗa',
    'badges.apply_now': 'Nemi Wannan Matakin',
    'badges.verify_cta': 'Tantance Takardar Shaida',

    // Why Partner
    'why.tag': 'Fa’idodin Shirin',
    'why.title': 'Me Ya Sa Za Ku Yi Aiki da MsmeBooks?',
    'why.desc': 'Manhaja ce da aka tsara musamman domin bunkasa ribar kamfaninku da gamsar da abokan cinikinku a fadin Afirka.',
    'why.benefit1_title': 'Riba Mai Dorewa a Kowanne Wata',
    'why.benefit1_desc': 'Samu har zuwa kashi 40% na lada a kowanne wata daga kudin da kwastomominku ke biya.',
    'why.benefit2_title': 'Takardun Shaida na Kasa da Kasa',
    'why.benefit2_desc': 'Kwarewar ma’aikatanku tana samun shaida ta musamman da za a iya tabbatarwa a yanar gizo.',
    'why.benefit3_title': 'Taimako na Musamman',
    'why.benefit3_desc': 'Samun damar yin magana kai tsaye da kwararrun injiniyoyinmu da manajojin asusu.',
    'why.benefit4_title': 'Talla da Samar da Sabbin Kwastomomi',
    'why.benefit4_desc': 'Sanya kamfaninku a cikin jerinmu na yanar gizo domin kwastomomi su neme ku kai tsaye.',

    // Audit Integrations
    'audit.tag': 'Hadin Manhajojin Audit',
    'audit.title': 'Hada Kowace Manhajar Audit da MsmeBooks',
    'audit.desc': 'Babu bukatar sake shigar da lissafi da hannu. Hada manhajojin da kuka fi so da MsmeBooks ta hanyar REST API da Webhooks.',
    'audit.track1_label': 'Layi na 1: Takardun Aiki da Rahotanni',
    'audit.track2_label': 'Layi na 2: Binciken AI da Tantance Kura-kurai',
    'audit.request_sandbox': 'Nemi Mabudin Gwaji na API',
    'audit.view_specs': 'Duba Bayanin API',

    // Academy
    'academy.tag': 'Makarantar Horarwa',
    'academy.title': 'Koyi. Samu Takardar Shaida. Habaka.',
    'academy.desc': 'Tsarin koyarwarmu yana ba akantoci da mashawartan fasaha cikakken ilimi kan yadda ake amfani da MsmeBooks.',
    'academy.countdown_title': 'Rukunin Dalibai Masu Zuwa Zai Fara a:',
    'academy.claim_seat': 'Karbi Wurin Zama Yanzu',
    'academy.preview_badge': 'Duba Yadda Takardar Shaidarka Za Ta Kasance',

    // Calculator
    'calc.tag': 'Kwamfutar Lissafin Riba',
    'calc.title': 'Kiyasta Kudin da Za Ka Iya Samu',
    'calc.desc': 'Lissafa ribar da za ka samu a wata ko shekara bisa adadin kwastomomin da kake da su.',

    // Directory
    'dir.tag': 'Jerin Abokan Hulɗa Masu Shaida',
    'dir.title': 'Nemi Abokin Hulɗa na MsmeBooks',
    'dir.desc': 'Nemo kwararru a Najeriya, Nijar, Ghana da sauran kasashen duniya.',

    // Final CTA
    'cta.title': 'A Shirye Kake Don Bunkasa da MsmeBooks?',
    'cta.desc': 'Kasance tare da daruruwan kamfanonin akanta da kwararrun IT da ke samun riba a kowanne wata.',
    'cta.button': 'Cika Fom Din Neman Zama Abokin Hulɗa',
    'cta.find': 'Nemi Abokin Hulɗa Mai Shaida',

    // Footer
    'footer.tagline': 'Cikakkiyar manhajar Akanta, POS, da Kula da Kasuwanci don Afirka da kasashen waje.',
    'footer.rights': 'An kiyaye duk hakkoki. An yi wa MsmeBooks rajista a Afirka da Birtaniya.',
    'lang.switcher_label': 'Zabi Harshe',

    // Partner Portal
    'portal.header_title': 'Dandalin Abokin Hulɗa na MsmeBooks',
    'portal.tab_overview': 'Bayanin Gabaɗaya',
    'portal.tab_leaderboard': '🏆 Jagororin Duniya na Wata',
    'portal.tab_clients': 'Abokan Ciniki',
    'portal.tab_commissions': 'Kudaden Hukuma da Riba',
    'portal.tab_payouts': 'Tarihin Biyan Kuɗi',
    'portal.tab_support': 'Taimako da Tambayoyi',
    'portal.ref_link_label': 'Hanyar Haɗin Gayyatar Ka',
    'portal.copy_link': 'Kwafi Hanyar',
    'portal.link_copied': 'An Kwafi Hanyar!',
    'portal.kpi_monthly': 'Kudaden Hukuma na Kowanne Wata',
    'portal.kpi_total': 'Jimillar Kuɗin da Aka Biya Zuwa Yanzu',
    'portal.kpi_clients': 'Abokan Ciniki Masu Aiki',
    'portal.kpi_payout': 'Ranar Biyan Kuɗi ta Gaba',
    'portal.download_badge': 'Zazzage Tambari',
    'portal.status_active': 'Matsayi: Yana Aiki Kuma An Tabbatar'
  },

  yo: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Ètò Àwọn Alájọṣe',
    'nav.tiers': 'Àwọn Ipele àti Àmì',
    'nav.benefits': 'Àwọn Àǹfààní',
    'nav.integrations': 'Àsopọ̀ Àwọn Ohun Èlò Ìṣirò (Audit)',
    'nav.directory': 'Àtòjọ Àwọn Alájọṣe',
    'nav.calculator': 'Ẹ̀rọ Ìṣirò Èrè',
    'nav.academy': 'Ilé-Ẹ̀kọ́ Ìwé-Ẹ̀rí',
    'nav.faq': 'Àwọn Ìbéèrè Wọ́pọ̀',
    'nav.verify_partner': 'Ṣe Àyẹ̀wò Alájọṣe',
    'nav.partner_portal': 'Ẹnu Ọ̀nà Alájọṣe',
    'nav.become_partner': 'Di Alájọṣe',
    'nav.impact': 'Ipa Àwọn Alájọṣe',
    'nav.rewards': 'Èrè P2P',
    'nav.resources': 'Àwọn Ohun Èlò',
    'nav.admin_console': 'Ibùdó Alákòóso',

    // Hero
    'hero.badge_trust': 'Fífún Àwọn Alájọṣe Lágbára. Ìdàgbàsókè Ìṣòwò. Káàkiri Áfíríkà àti Àgbáyé.',
    'hero.headline': 'Ṣe Àjọṣepọ̀ pẹ̀lú MsmeBooks. Gbòòrò Ìṣòwò Rẹ. Gba Èrè Oṣooṣù Tí Kò Lópin.',
    'hero.subheadline': 'Darapọ̀ mọ́ ètò àwọn alájọṣe MsmeBooks kí o sì ṣí àwọn àǹfààní tuntun nípa ríran àwọn oníṣòwò lọ́wọ́ láti jẹ́ kí ìṣirò owó, títà ọjà (POS) àti ìtọ́jú ẹrù rọrùn.',
    'hero.cta_become': 'Di Alájọṣe Nisinsinyi',
    'hero.cta_explore': 'Wo Àwọn Àǹfààní',
    'hero.cta_find': 'Wá Alájọṣe Tí A Fọwọ́sí',
    'hero.recurring_revenue': 'Èrè Oṣooṣù Tí Ó Tó 40%',
    'hero.verified_credential': 'Àwọn Àmì Ẹ̀rí Òtítọ́',
    'hero.enterprise_ready': 'Àsopọ̀ pẹ̀lú Àwọn Ohun Èlò Audit 25+',

    // Badges Showcase
    'badges.tag': 'Àwọn Àmì Ẹ̀rí Òtítọ́',
    'badges.title': 'Àwọn Àmì Ẹ̀rí Ọlọ́lá Mẹ́rin',
    'badges.desc': 'Gbogbo alájọṣe MsmeBooks ni a ń fún ní àmì ẹ̀rí orí-ẹ̀rọ àti nọ́mbà ìdánimọ̀ tí a lè ṣàyẹ̀wò lórí ayélujára.',
    'badges.bronze': 'Alájọṣe Idẹ (Bronze)',
    'badges.silver': 'Alájọṣe Fadaka (Silver)',
    'badges.gold': 'Alájọṣe Wura (Gold)',
    'badges.platinum': 'Alájọṣe Pilatinnọmu (Platinum)',
    'badges.official_partner': 'Alájọṣe Gidi',
    'badges.apply_now': 'Béèrè fún Ipele Yìí',
    'badges.verify_cta': 'Ṣàyẹ̀wò Ìwé-Ẹ̀rí',

    // Why Partner
    'why.tag': 'Àwọn Àǹfààní Ètò Náà',
    'why.title': 'Èéṣe Tí O Fi Yẹ Kí O Bá MsmeBooks Ṣiṣẹ́?',
    'why.desc': 'Ètò SaaS tí a kọ́ láti mú kí èrè ilé-iṣẹ́ rẹ pọ̀ sí i kí o sì ní agbára gidi lórí àwọn oníbàárà rẹ káàkiri Áfíríkà.',
    'why.benefit1_title': 'Èrè Oṣooṣù Tí Kò Lópin',
    'why.benefit1_desc': 'Gba èrè tí ó tó 40% lórí owó tí àwọn oníbàárà rẹ ń san ní oṣooṣù ní àkókò tí ó tọ́.',
    'why.benefit2_title': 'Ìwé-Ẹ̀rí SaaS Tí A Mọ̀ Káàkiri',
    'why.benefit2_desc': 'Kọ́ àwọn oṣìṣẹ́ rẹ pẹ̀lú ẹ̀kọ́ tí a fọwọ́sí àti àwọn àmì orí-ẹ̀rọ.',
    'why.benefit3_title': 'Ìrànlọ́wọ́ Pàtàkì fún Alájọṣe',
    'why.benefit3_desc': 'Rí àwọn onímọ̀ ẹ̀rọ àti àwọn alákòóso bá sọ̀rọ̀ tààrà láti ran iṣẹ́ rẹ lọ́wọ́.',
    'why.benefit4_title': 'Ìpolówó Àpapọ̀ & Fífúnni ní Oníbàárà',
    'why.benefit4_desc': 'Jẹ́ kí orúkọ rẹ wà nínú àtòjọ wa kí àwọn oníbàárà agbègbè rẹ lè kàn sí ọ tààrà.',

    // Audit Integrations
    'audit.tag': 'Àsopọ̀ fún Àyẹ̀wò Ìṣirò',
    'audit.title': 'So Gbogbo Ohun Èlò Audit Mọ́ MsmeBooks',
    'audit.desc': 'Kò sí àkókò fún kíkọ ìṣirò pẹ̀lú ọwọ́ mọ́. So àwọn ohun èlò rẹ mọ́ MsmeBooks pẹ̀lú REST API àti Webhooks.',
    'audit.track1_label': 'Ìpele 1: Àwọn Ìwé Iṣẹ́ àti Ìròyìn',
    'audit.track2_label': 'Ìpele 2: Ìṣirò AI àti Àyẹ̀wò Ẹ̀rí',
    'audit.request_sandbox': 'Béèrè fún Kọ́kọ́rọ́ API Ìdánwò',
    'audit.view_specs': 'Wo Àlàyé API',

    // Academy
    'academy.tag': 'Ilé-Ẹ̀kọ́ Àwọn Alájọṣe',
    'academy.title': 'Kọ́kọ́ Kẹ́kọ̀ọ́. Gba Ìwé-Ẹ̀rí. Gbòòrò.',
    'academy.desc': 'Àwọn ẹ̀kọ́ wa ń fún àwọn akọ́wé-owó àti àwọn onímọ̀-ẹ̀rọ ní ìmọ̀ tó ga jùlọ.',
    'academy.countdown_title': 'Ẹgbẹ́ Àkẹ́kọ̀ọ́ Tó Kàn Yóò Bẹ̀rẹ̀ Ní:',
    'academy.claim_seat': 'Gba Àyè Rẹ Nisinsinyi',
    'academy.preview_badge': 'Wo Bí Ìwé-Ẹ̀rí Rẹ Yóò Ṣe Rí',

    // Calculator
    'calc.tag': 'Ẹ̀rọ Ìṣirò Èrè',
    'calc.title': 'Ṣirò Èrè Tí O Lè Máa Rí Lóṣooṣù',
    'calc.desc': 'Mọ iye owó tí o lè rí gẹ́gẹ́ bí alájọṣe wa pẹ̀lú iye àwọn oníbàárà rẹ.',

    // Directory
    'dir.tag': 'Àtòjọ Àwọn Alájọṣe Tí A Fọwọ́sí',
    'dir.title': 'Wá Alájọṣe MsmeBooks Tí O Kúndùn',
    'dir.desc': 'Wá àwọn alájọṣe ní Nàìjíríà, Gánà, Kẹ́ńyà àti káàkiri àgbáyé.',

    // Final CTA
    'cta.title': 'Ṣé O Ti Ṣe Tán Láti Dàgbà pẹ̀lú MsmeBooks?',
    'cta.desc': 'Darapọ̀ mọ́ ọgọ́rọ̀ọ̀rún àwọn ilé-iṣẹ́ ìṣirò owó àti àwọn amòye IT tí wọ́n ń rí èrè ribiribi lórí MsmeBooks.',
    'cta.button': 'Béèrè Láti Di Alájọṣe',
    'cta.find': 'Wá Alájọṣe Tí A Fọwọ́sí',

    // Footer
    'footer.tagline': 'Ètò kíkún fún Ìṣirò Owó, Títà Ọjà (POS), Ìtọ́jú Ẹrù àti Ìṣàkóso Ìṣòwò fún Áfíríkà àti Àgbáyé.',
    'footer.rights': 'Gbogbo ẹ̀tọ́ ni a dáàbò bò. MsmeBooks ti forúkọsílẹ̀ ní Áfíríkà àti Ilẹ̀ Gẹ̀ẹ́sì.',
    'lang.switcher_label': 'Yan Èdè',

    // Partner Portal
    'portal.header_title': 'Ẹnu Ọ̀nà Alájọṣe MsmeBooks',
    'portal.tab_overview': 'Àkópọ̀',
    'portal.tab_leaderboard': '🏆 Àtẹ Àwọn Olórí Àgbáyé',
    'portal.tab_clients': 'Àwọn Oníbàárà',
    'portal.tab_commissions': 'Èrè & Àwọn Ìpín',
    'portal.tab_payouts': 'Ìtàn Ìsanwó',
    'portal.tab_support': 'Ìtìlẹ́yìn & Ìbánisọ̀rọ̀',
    'portal.ref_link_label': 'Ọ̀nà Ìbánisọ̀rọ̀ Pàtàkì Rẹ',
    'portal.copy_link': 'Ṣe Àdàkọ Ọ̀nà',
    'portal.link_copied': 'A Ti Da Àdàkọ Rẹ̀!',
    'portal.kpi_monthly': 'Èrè Lóṣooṣù Tí Ń Wọlé',
    'portal.kpi_total': 'Àpapọ̀ Owó Tí A San Títí Di Òní',
    'portal.kpi_clients': 'Àwọn Oníbàárà Lọ́wọ́lọ́wọ́',
    'portal.kpi_payout': 'Ọjọ́ Ìsanwó Tó Kàn',
    'portal.download_badge': 'Gba Àmì',
    'portal.status_active': 'Ipo: O Nṣiṣẹ Lọ́wọ́ & A Ti Fọwọ́sí'
  },

  es: {
    // Navbar
    'nav.brand_name': 'MsmeBooks',
    'nav.partner_programme': 'Programa de Socios',
    'nav.tiers': 'Niveles y Distintivos',
    'nav.benefits': 'Beneficios',
    'nav.integrations': 'Integraciones de Auditoría',
    'nav.directory': 'Directorio de Socios',
    'nav.calculator': 'Calculadora de Comisiones',
    'nav.academy': 'Academia de Certificación',
    'nav.faq': 'Preguntas Frecuentes',
    'nav.verify_partner': 'Verificar Socio',
    'nav.partner_portal': 'Portal del Socio',
    'nav.become_partner': 'Convertirse en Socio',
    'nav.impact': 'Impacto de Socios',
    'nav.rewards': 'Recompensas P2P',
    'nav.resources': 'Recursos',
    'nav.admin_console': 'Consola de Administración',

    // Hero
    'hero.badge_trust': 'Empoderando Socios. Impulsando Empresas. En África y en Todo el Mundo.',
    'hero.headline': 'Asóciese con MsmeBooks. Haga Crecer su Negocio. Genere Ingresos Recurrentes.',
    'hero.subheadline': 'Únase al ecosistema de socios de MsmeBooks y descubra nuevas oportunidades de negocio ayudando a las empresas a simplificar su contabilidad, TPV (POS), inventario y gestión operativa diaria.',
    'hero.cta_become': 'Hacerse Socio',
    'hero.cta_explore': 'Explorar Beneficios',
    'hero.cta_find': 'Buscar un Socio Certificado',
    'hero.recurring_revenue': 'Hasta 40% de Comisión Recurrente',
    'hero.verified_credential': 'Credenciales Oficiales Verificables',
    'hero.enterprise_ready': 'Más de 25 Softwares de Auditoría Integrados',

    // Badges Showcase
    'badges.tag': 'Credenciales Oficiales de Asociación',
    'badges.title': 'Cuatro Distintivos Exclusivos de Membresía',
    'badges.desc': 'Cada socio de MsmeBooks recibe un distintivo digital oficial y un número de identificación verificable para exhibir en sitios web, propuestas comerciales y firmas de correo.',
    'badges.bronze': 'Socio Bronce',
    'badges.silver': 'Socio Plata',
    'badges.gold': 'Socio Oro',
    'badges.platinum': 'Socio Platino',
    'badges.official_partner': 'Socio Oficial',
    'badges.apply_now': 'Solicitar este Nivel',
    'badges.verify_cta': 'Verificar Credencial',

    // Why Partner
    'why.tag': 'Ventajas del Programa',
    'why.title': '¿Por Qué Asociarse con MsmeBooks?',
    'why.desc': 'Un ecosistema SaaS diseñado a medida para acelerar los ingresos recurrentes, la fidelización de clientes y el liderazgo de su firma en el mercado.',
    'why.benefit1_title': 'Ingresos Recurrentes Lucrativos',
    'why.benefit1_desc': 'Gane hasta un 40% de comisión recurrente de por vida por las suscripciones activas de sus clientes, pagadas puntualmente cada mes.',
    'why.benefit2_title': 'Certificación SaaS Oficial',
    'why.benefit2_desc': 'Equipe a su equipo con acreditaciones verificables, distintivos digitales y certificados de formación homologados.',
    'why.benefit3_title': 'Soporte Técnico Especializado',
    'why.benefit3_desc': 'Acceso prioritario y directo a gestores de cuenta dedicados e ingenieros de soporte técnico e implantación.',
    'why.benefit4_title': 'Co-Marketing y Referencias de Clientes',
    'why.benefit4_desc': 'Aparezca en nuestro directorio público certificado y reciba clientes potenciales de nivel corporativo en su región.',

    // Audit Integrations
    'audit.tag': 'Ecosistema de Auditoría Bidireccional',
    'audit.title': 'Integre Cualquier Software de Auditoría con MsmeBooks',
    'audit.desc': 'Elimine las descargas manuales de CSV y la reescritura de datos. Conecte su software de auditoría favorito directamente a MsmeBooks mediante nuestra API REST de alta velocidad y webhooks en tiempo real.',
    'audit.track1_label': 'Fila 1 • Papeles de Trabajo, Informes y Aseguramiento Continuo',
    'audit.track2_label': 'Fila 2 • Análisis por IA, Muestreo y Verificación Inteligente',
    'audit.request_sandbox': 'Solicitar Clave Sandbox de API',
    'audit.view_specs': 'Ver Especificaciones de la API',

    // Academy
    'academy.tag': 'Academia y Capacitación para Socios',
    'academy.title': 'Aprenda. Certifíquese. Escale.',
    'academy.desc': 'Nuestro plan de estudios estructurado dota a sus ingenieros, contables y consultores de metodologías de implantación de nivel empresarial.',
    'academy.countdown_title': 'La Próxima Cohorte Comienza En:',
    'academy.claim_seat': 'Reservar su Plaza en la Cohorte',
    'academy.preview_badge': 'Previsualizar Certificado y Distintivo',

    // Calculator
    'calc.tag': 'Simulador de Ingresos',
    'calc.title': 'Calcule sus Comisiones Recurrentes de Socio',
    'calc.desc': 'Estime sus pagos de comisión mensuales y anuales en función del número de clientes, tamaño de empresa y su nivel de membresía.',

    // Directory
    'dir.tag': 'Directorio Certificado',
    'dir.title': 'Encuentre un Socio Acreditado de MsmeBooks',
    'dir.desc': 'Explore socios verificados en Guinea Ecuatorial, España, México, Colombia y el mercado internacional.',

    // Final CTA
    'cta.title': '¿Listo para Crecer con MsmeBooks?',
    'cta.desc': 'Únase a cientos de firmas de contabilidad y consultoras tecnológicas que generan altos márgenes de ingresos recurrentes.',
    'cta.button': 'Solicitar Admisión como Socio',
    'cta.find': 'Buscar un Socio Certificado',

    // Footer
    'footer.tagline': 'La plataforma integral de Contabilidad, TPV (POS), Inventario y Gestión Empresarial para África y el mundo.',
    'footer.rights': 'Todos los derechos reservados. MsmeBooks está registrada en África y en el Reino Unido.',
    'lang.switcher_label': 'Seleccionar Idioma',

    // Partner Portal
    'portal.header_title': 'Portal del Socio MsmeBooks',
    'portal.tab_overview': 'Resumen General',
    'portal.tab_leaderboard': '🏆 Clasificación Global',
    'portal.tab_clients': 'Clientes',
    'portal.tab_commissions': 'Comisiones y Ganancias',
    'portal.tab_payouts': 'Historial de Pagos',
    'portal.tab_support': 'Soporte y Consultas',
    'portal.ref_link_label': 'Su Enlace de Referidos Exclusivo',
    'portal.copy_link': 'Copiar Enlace de Referido',
    'portal.link_copied': '¡Enlace Copiado!',
    'portal.kpi_monthly': 'Comisión Recurrente Mensual',
    'portal.kpi_total': 'Total Liquidado a la Fecha',
    'portal.kpi_clients': 'Clientes con Suscripción Activa',
    'portal.kpi_payout': 'Próxima Fecha de Transferencia',
    'portal.download_badge': 'Descargar Distintivo',
    'portal.status_active': 'Estado: Verificado y Activo',

    // Offline & Connectivity
    'offline.status_online': 'En Línea',
    'offline.status_offline': 'Modo Sin Conexión',
    'offline.banner_offline': 'Operando en modo sin conexión. Los datos están respaldados en la caché local y se sincronizarán al restablecerse Internet.',
    'offline.sync_active': 'Sincronización en la nube activa',

    // Currency
    'currency.switcher_label': 'Seleccionar Divisa',
    'currency.rates_live': 'Conversión Multidivisa en Tiempo Real',

    // Theme
    'theme.toggle_dark': 'Cambiar a Modo Oscuro (Azul Profundo)',
    'theme.toggle_light': 'Cambiar a Modo Claro'
  }
};
