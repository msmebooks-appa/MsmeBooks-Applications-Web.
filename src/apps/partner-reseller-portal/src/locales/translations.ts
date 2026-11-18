export type SupportedLanguage = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'Global & Pan-Africa'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Afrique Francophone & Monde'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'Angola, Moçambique & Global'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Guinea Ecuatorial & Global'
  }
];

export interface TranslationDictionary {
  [key: string]: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    // Nav
    'nav.categories': 'Categories',
    'nav.commissionTiers': 'Commission Tiers',
    'nav.calculator': 'Earnings Calculator',
    'nav.agreement': 'Partner Agreement',
    'nav.faq': 'FAQ',
    'nav.partnerPortal': 'Partner Portal',
    'nav.adminDesk': 'Admin Desk',
    'nav.becomePartner': 'Become a Partner',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    // Hero
    'hero.badge.ecosystem': 'MsmeBooks Global Ecosystem',
    'hero.badge.regions': 'Africa & Worldwide',
    'hero.badge.commission': 'Up to 40% Recurring Commission',
    'hero.title.part1': 'Partner With MsmeBooks.',
    'hero.title.highlight1': 'Grow Your Business.',
    'hero.title.highlight2': 'Earn Recurring Revenue.',
    'hero.subtitle': 'Join the MsmeBooks Global Partner Network and help businesses transform their accounting, point of sale, inventory, payroll and business operations while building sustainable recurring income.',
    'hero.description': 'Whether you’re an accountant, bookkeeper, consultant, POS agent, software reseller, technology company or business advisor, MsmeBooks provides the tools, technology and partnership opportunities to expand your services and grow your revenue.',
    'hero.cta.becomePartner': 'Become a Partner Today',
    'hero.cta.exploreTiers': 'Explore Commission Tiers',
    'hero.cta.reviewAgreement': 'Review Legal Agreement',
    'hero.cta.liveDemo': 'Live Partner Portal Demo',
    'hero.stat.payoutRate': 'Peak Recurring Share',
    'hero.stat.activePartners': 'Active Certified Partners',
    'hero.stat.jurisdictions': 'Operational Currencies',
    'hero.stat.avgAnnualPayout': 'Top Earner Payout Rate',
    'hero.card.portalBadge': 'Live Partner Portal Preview',
    'hero.card.activeTier': 'Diamond Tier Partner',
    'hero.card.monthlyAccrual': 'Est. Monthly Commission',
    'hero.card.instantSettlement': 'Multi-currency settlement via direct bank wire & mobile money',

    // Categories
    'categories.badge': '10 Specialised Partner Categories',
    'categories.title': 'Tailored Tracks for Every Industry Professional',
    'categories.subtitle': 'From licensed chartered accountants and enterprise ERP advisors to frontline retail POS distributors, choose the partnership track structured for your business model.',
    'categories.searchPlaceholder': 'Search partner categories, target audience, or benefits...',
    'categories.filterAll': 'All Categories',
    'categories.joinCategory': 'Join this Category',
    'categories.viewSchedule': 'View Schedule',
    'categories.targetAudience': 'Ideal For',
    'categories.keyBenefits': 'Key Strategic Benefits',

    // Commission Tiers
    'tiers.badge': 'Progressive Earnings Architecture',
    'tiers.title': 'Transparent Recurring Commission Structure',
    'tiers.subtitle': 'Earn reliable recurring revenue on every active subscription, implementation service fee, and marketplace extension for the entire customer lifecycle.',
    'tiers.monthlyPayouts': 'Monthly Automated Payouts',
    'tiers.bronze': 'Bronze Affiliate',
    'tiers.silver': 'Silver Associate',
    'tiers.gold': 'Gold Consultant',
    'tiers.platinum': 'Platinum Enterprise',
    'tiers.diamond': 'Diamond Elite Sovereign',
    'tiers.rate': 'Commission Rate',
    'tiers.clientsRequired': 'Active Client Accounts',
    'tiers.applyForTier': 'Apply for this Tier',
    'tiers.guaranteed': 'Lifetime Attribution Guarantee',

    // Calculator
    'calc.badge': 'Interactive Revenue Forecaster',
    'calc.title': 'Estimate Your Monthly & Annual Earnings',
    'calc.subtitle': 'Model your projected recurring commissions based on active client accounts, average business software plan, and your achievement tier.',
    'calc.clientCountLabel': 'Number of Active Client Subscriptions',
    'calc.planTypeLabel': 'Primary Software Tier Sold',
    'calc.partnerTierLabel': 'Your Target Commission Tier',
    'calc.monthlyCommission': 'Projected Monthly Earnings',
    'calc.annualCommission': 'Projected Annual Recurring Revenue',
    'calc.effectiveRate': 'Effective Commission Rate',
    'calc.payoutFrequency': 'Payouts processed automatically on the 5th of each calendar month in your preferred local currency.',
    'calc.ctaButton': 'Start Earning — Join the Network',

    // Agreement Viewer
    'agreement.badge': 'Legal Framework & Master Agreement',
    'agreement.title': 'Master Partner Terms & Schedules',
    'agreement.subtitle': 'Review the comprehensive 30-article legal agreement and schedules defining terms of engagement, licensing rights, non-solicitation, and automated commission protocols.',
    'agreement.searchPlaceholder': 'Search 30 articles and schedules by keyword (e.g. commission, audit, termination)...',
    'agreement.articlesCount': 'Articles Available',
    'agreement.schedulesModal': 'Explore Schedules A–G',
    'agreement.signNow': 'Sign & Execute Agreement',
    'agreement.filterAll': 'All 30 Articles',
    'agreement.noMatches': 'No agreement articles matching your search criteria.',
    'agreement.clearSearch': 'Clear Search Filter',

    // FAQ
    'faq.badge': 'Partner Intelligence & Support',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about joining, onboarding, marketing support, billing mechanisms, and regional bank payouts across Africa and global markets.',
    'faq.searchPlaceholder': 'Search questions regarding onboarding, payouts, commissions...',
    'faq.viewAll': 'View all inquiries',

    // Final CTA
    'cta.title': 'Ready to Expand Your Practice and Revenue with MsmeBooks?',
    'cta.subtitle': 'Join hundreds of accountants, advisors, and technology providers empowering SMEs across Africa and internationally.',
    'cta.primary': 'Apply to Become a Partner',
    'cta.secondary': 'Review Agreement Terms',
    'cta.support': 'Contact Partner Alliance Desk',

    // Chat
    'chat.title': 'Partner Support Desk',
    'chat.online': 'Online · Response in ~2m',
    'chat.placeholder': 'Type your question or request...',
    'chat.send': 'Send',
    'chat.helpBadge': 'Live Help',

    // Footer
    'footer.description': 'MsmeBooks Partner Ecosystem empowers accountants, business advisors, software consultants, and enterprise resellers with next-generation cloud business tools and lucrative recurring commissions.',
    'footer.quickLinks': 'Quick Navigation',
    'footer.legalDocs': 'Legal & Compliance',
    'footer.allRights': 'All rights reserved. MsmeBooks International.',
    'footer.panAfrican': 'Empowering MSMEs across Africa & Worldwide.',
    'footer.disclaimer': 'Commissions are governed by the Master Partner Agreement and applicable regulatory guidelines in your operating jurisdiction.',

    // Scroll Widget
    'scroll.up': 'Scroll Up',
    'scroll.down': 'Scroll Down',
    'scroll.top': 'Back to Top',
    'scroll.bottom': 'Jump to Bottom',
    'scroll.sections': 'Page Sections',
    'scroll.sectionNav': 'Section Navigator'
  },

  fr: {
    // Nav
    'nav.categories': 'Catégories',
    'nav.commissionTiers': 'Niveaux de Commission',
    'nav.calculator': 'Calculateur de Revenus',
    'nav.agreement': 'Contrat de Partenariat',
    'nav.faq': 'FAQ',
    'nav.partnerPortal': 'Portail Partenaire',
    'nav.adminDesk': 'Bureau Admin',
    'nav.becomePartner': 'Devenir Partenaire',
    'nav.openMenu': 'Ouvrir le menu',
    'nav.closeMenu': 'Fermer le menu',

    // Hero
    'hero.badge.ecosystem': 'Écosystème Mondial MsmeBooks',
    'hero.badge.regions': 'Afrique & International',
    'hero.badge.commission': "Jusqu'à 40% de Commission Récurrente",
    'hero.title.part1': 'Devenez Partenaire MsmeBooks.',
    'hero.title.highlight1': 'Développez Vos Activités.',
    'hero.title.highlight2': 'Générez des Revenus Récurrents.',
    'hero.subtitle': 'Rejoignez le réseau mondial de partenaires MsmeBooks et aidez les PME à transformer leur comptabilité, points de vente (POS), stocks, paie et gestion opérationnelle tout en bâtissant des revenus récurrents durables.',
    'hero.description': "Que vous soyez expert-comptable, consultant d'affaires, distributeur de caisses tactiles, revendeur de logiciels ou société technologique, MsmeBooks vous offre les outils, l'infrastructure et les opportunités pour élargir votre offre et maximiser votre chiffre d'affaires.",
    'hero.cta.becomePartner': 'Devenir Partenaire Maintenant',
    'hero.cta.exploreTiers': 'Découvrir les Niveaux de Commission',
    'hero.cta.reviewAgreement': 'Consulter le Contrat Légal',
    'hero.cta.liveDemo': 'Démo du Portail Partenaire',
    'hero.stat.payoutRate': 'Part Récurrente Maximale',
    'hero.stat.activePartners': 'Partenaires Certifiés Actifs',
    'hero.stat.jurisdictions': 'Devises Opérationnelles',
    'hero.stat.avgAnnualPayout': 'Taux de Rétribution Élite',
    'hero.card.portalBadge': 'Aperçu du Portail Partenaire en Direct',
    'hero.card.activeTier': 'Partenaire Niveau Diamant',
    'hero.card.monthlyAccrual': 'Commission Mensuelle Estimée',
    'hero.card.instantSettlement': 'Paiement multidevise par virement bancaire direct et Mobile Money (Orange, Wave, MTN, M-Pesa)',

    // Categories
    'categories.badge': '10 Catégories de Partenaires Spécialisées',
    'categories.title': 'Des Parcours Adaptés à Chaque Métier',
    'categories.subtitle': "Des experts-comptables agréés aux intégrateurs d'ERP d'entreprise en passant par les distributeurs de matériel POS, choisissez le modèle de collaboration taillé pour votre activité.",
    'categories.searchPlaceholder': 'Rechercher une catégorie, cible ou avantage...',
    'categories.filterAll': 'Toutes les Catégories',
    'categories.joinCategory': 'Rejoindre cette Catégorie',
    'categories.viewSchedule': 'Voir Annexe',
    'categories.targetAudience': 'Profil Idéal',
    'categories.keyBenefits': 'Avantages Stratégiques Clés',

    // Commission Tiers
    'tiers.badge': 'Barème de Rémunération Progressif',
    'tiers.title': 'Structure de Commission Récurrente Claire et Transparente',
    'tiers.subtitle': "Générez des revenus récurrents fiables sur chaque abonnement actif, frais de déploiement et module complémentaire tout au long du cycle de vie du client.",
    'tiers.monthlyPayouts': 'Versements Mensuels Automatisés',
    'tiers.bronze': 'Bronze Affilié',
    'tiers.silver': 'Argent Associé',
    'tiers.gold': 'Or Consultant',
    'tiers.platinum': 'Platine Entreprise',
    'tiers.diamond': 'Diamant Élite Souverain',
    'tiers.rate': 'Taux de Commission',
    'tiers.clientsRequired': 'Comptes Clients Actifs',
    'tiers.applyForTier': 'Postuler à ce Niveau',
    'tiers.guaranteed': "Garantie d'Attribution à Vie",

    // Calculator
    'calc.badge': 'Simulateur de Revenus Interactif',
    'calc.title': 'Estimez Vos Gains Mensuels et Annuels',
    'calc.subtitle': "Calculez vos commissions récurrentes projetées selon le nombre de clients actifs, le plan logiciel déployé et votre niveau d'accomplissement.",
    'calc.clientCountLabel': "Nombre d'Abonnements Clients Actifs",
    'calc.planTypeLabel': 'Plan Logiciel Principal Vendu',
    'calc.partnerTierLabel': 'Votre Niveau de Commission Cible',
    'calc.monthlyCommission': 'Revenus Mensuels Projetés',
    'calc.annualCommission': 'Revenu Récurrent Annuel Projeté',
    'calc.effectiveRate': 'Taux de Commission Effectif',
    'calc.payoutFrequency': 'Paiements traités automatiquement le 5 de chaque mois civil dans votre devise locale préférée.',
    'calc.ctaButton': 'Commencez à Gagner — Rejoindre le Réseau',

    // Agreement Viewer
    'agreement.badge': 'Cadre Juridique & Contrat Cadre',
    'agreement.title': 'Conditions Générales & Annexes du Partenariat',
    'agreement.subtitle': "Prenez connaissance du contrat juridique de 30 articles et de ses annexes régissant les modalités d'agrément, les droits de licence, la non-sollicitation et les protocoles de paiement.",
    'agreement.searchPlaceholder': 'Rechercher parmi les 30 articles (ex. commission, audit, résiliation)...',
    'agreement.articlesCount': 'Articles Disponibles',
    'agreement.schedulesModal': 'Consulter les Annexes A–G',
    'agreement.signNow': 'Signer et Valider le Contrat',
    'agreement.filterAll': 'Tous les 30 Articles',
    'agreement.noMatches': 'Aucun article ne correspond à votre recherche.',
    'agreement.clearSearch': 'Effacer la Recherche',

    // FAQ
    'faq.badge': 'Centre de Ressources & Assistance',
    'faq.title': 'Questions Fréquemment Posées',
    'faq.subtitle': "Tout ce qu'il faut savoir sur l'adhésion, l'intégration, les supports marketing, la facturation et les règlements bancaires locaux en Afrique et à l'international.",
    'faq.searchPlaceholder': 'Rechercher des réponses sur les paiements, commissions, onboarding...',
    'faq.viewAll': 'Voir toutes les questions',

    // Final CTA
    'cta.title': 'Prêt à Développer Votre Activité et Vos Revenus avec MsmeBooks ?',
    'cta.subtitle': 'Rejoignez des centaines de professionnels comptables, conseillers et experts technologiques accompagnant les PME en Afrique et dans le monde entier.',
    'cta.primary': 'Postuler au Programme Partenaire',
    'cta.secondary': 'Consulter les Clauses Légales',
    'cta.support': 'Contacter le Bureau des Alliances',

    // Chat
    'chat.title': 'Assistance Partenaires',
    'chat.online': 'En ligne · Réponse en ~2 min',
    'chat.placeholder': 'Posez votre question ou détaillez votre demande...',
    'chat.send': 'Envoyer',
    'chat.helpBadge': 'Aide Directe',

    // Footer
    'footer.description': "L'écosystème de partenaires MsmeBooks accompagne les experts-comptables, consultants d'entreprises, intégrateurs et revendeurs avec des solutions cloud de pointe et des commissions récurrentes attractives.",
    'footer.quickLinks': 'Navigation Rapide',
    'footer.legalDocs': 'Documents Légaux & Conformité',
    'footer.allRights': 'Tous droits réservés. MsmeBooks International.',
    'footer.panAfrican': 'Au service des PME à travers toute l’Afrique et le Monde.',
    'footer.disclaimer': "Les commissions sont régies par le Contrat Cadre de Partenariat et les dispositions réglementaires applicables dans votre juridiction d'exercice.",

    // Scroll Widget
    'scroll.up': 'Défiler vers le haut',
    'scroll.down': 'Défiler vers le bas',
    'scroll.top': 'Haut de page',
    'scroll.bottom': 'Bas de page',
    'scroll.sections': 'Sections du site',
    'scroll.sectionNav': 'Navigateur de sections'
  },

  pt: {
    // Nav
    'nav.categories': 'Categorias',
    'nav.commissionTiers': 'Níveis de Comissão',
    'nav.calculator': 'Calculadora de Ganhos',
    'nav.agreement': 'Contrato de Parceria',
    'nav.faq': 'Perguntas Frequentes',
    'nav.partnerPortal': 'Portal do Parceiro',
    'nav.adminDesk': 'Painel Admin',
    'nav.becomePartner': 'Torne-se um Parceiro',
    'nav.openMenu': 'Abrir menu',
    'nav.closeMenu': 'Fechar menu',

    // Hero
    'hero.badge.ecosystem': 'Ecossistema Global MsmeBooks',
    'hero.badge.regions': 'África & Internacional',
    'hero.badge.commission': 'Até 40% de Comissão Recorrente',
    'hero.title.part1': 'Seja Parceiro da MsmeBooks.',
    'hero.title.highlight1': 'Expanda os Seus Negócios.',
    'hero.title.highlight2': 'Ganhe Receita Recorrente.',
    'hero.subtitle': 'Junte-se à Rede Global de Parceiros da MsmeBooks e ajude as empresas a transformar a sua contabilidade, pontos de venda (POS), stock, folha de pagamento e gestão operacional, construindo rendimentos recorrentes sustentáveis.',
    'hero.description': 'Quer seja contabilista certificado, consultor de gestão, agente de POS, revendedor de software ou empresa de tecnologia, a MsmeBooks disponibiliza as ferramentas, a tecnologia e os programas de parceria para alavancar a sua faturação.',
    'hero.cta.becomePartner': 'Torne-se Parceiro Hoje',
    'hero.cta.exploreTiers': 'Explorar Níveis de Comissão',
    'hero.cta.reviewAgreement': 'Revisar Contrato Legal',
    'hero.cta.liveDemo': 'Demonstração do Portal do Parceiro',
    'hero.stat.payoutRate': 'Taxa Recorrente Máxima',
    'hero.stat.activePartners': 'Parceiros Certificados Ativos',
    'hero.stat.jurisdictions': 'Moedas Operacionais',
    'hero.stat.avgAnnualPayout': 'Remuneração no Nível Diamante',
    'hero.card.portalBadge': 'Visualização em Tempo Real do Portal',
    'hero.card.activeTier': 'Parceiro Nível Diamante',
    'hero.card.monthlyAccrual': 'Comissão Mensal Estimada',
    'hero.card.instantSettlement': 'Liquidação multimoeda via transferência bancária direta e carteiras móveis',

    // Categories
    'categories.badge': '10 Categorias Especializadas de Parceiros',
    'categories.title': 'Percursos Adaptados a Cada Modelo Profissional',
    'categories.subtitle': 'Desde contabilistas certificados e consultores de ERP corporativo até distribuidores de retalho e terminais POS, escolha a modalidade ideal para o seu negócio.',
    'categories.searchPlaceholder': 'Pesquisar categorias, público-alvo ou benefícios...',
    'categories.filterAll': 'Todas as Categorias',
    'categories.joinCategory': 'Aderir a esta Categoria',
    'categories.viewSchedule': 'Ver Anexo',
    'categories.targetAudience': 'Ideal Para',
    'categories.keyBenefits': 'Principais Vantagens Estratégicas',

    // Commission Tiers
    'tiers.badge': 'Estrutura Progressiva de Ganhos',
    'tiers.title': 'Estrutura Transparente de Comissões Recorrentes',
    'tiers.subtitle': 'Receba rendimentos recorrentes garantidos em cada subscrição ativa, taxa de implementação e módulo adicional durante todo o ciclo de vida do cliente.',
    'tiers.monthlyPayouts': 'Pagamentos Mensais Automatizados',
    'tiers.bronze': 'Bronze Afiliado',
    'tiers.silver': 'Prata Associado',
    'tiers.gold': 'Ouro Consultor',
    'tiers.platinum': 'Platina Empresarial',
    'tiers.diamond': 'Diamante Elite Soberano',
    'tiers.rate': 'Taxa de Comissão',
    'tiers.clientsRequired': 'Contas de Clientes Ativas',
    'tiers.applyForTier': 'Candidatar-se a este Nível',
    'tiers.guaranteed': 'Garantia de Atribuição Vitalícia',

    // Calculator
    'calc.badge': 'Simulador Interativo de Receitas',
    'calc.title': 'Estime os Seus Ganhos Mensais e Anuais',
    'calc.subtitle': 'Simule as suas comissões recorrentes estimadas com base no número de clientes ativos, plano de software selecionado e escalão de parceria.',
    'calc.clientCountLabel': 'Número de Subscrições Ativas de Clientes',
    'calc.planTypeLabel': 'Plano de Software Principal Comercializado',
    'calc.partnerTierLabel': 'Seu Nível Alvo de Comissão',
    'calc.monthlyCommission': 'Ganhos Mensais Projetados',
    'calc.annualCommission': 'Receita Recorrente Anual Projetada',
    'calc.effectiveRate': 'Taxa Efetiva de Comissão',
    'calc.payoutFrequency': 'Pagamentos processados automaticamente no dia 5 de cada mês na sua moeda local preferida.',
    'calc.ctaButton': 'Comece a Faturar — Junte-se à Rede',

    // Agreement Viewer
    'agreement.badge': 'Enquadramento Jurídico & Contrato Principal',
    'agreement.title': 'Termos do Contrato Principal & Anexos',
    'agreement.subtitle': 'Analise os 30 artigos jurídicos e anexos detalhados que regem os termos de adesão, direitos de licença, não-aliciamento e protocolos de comissão automatizados.',
    'agreement.searchPlaceholder': 'Pesquisar nos 30 artigos e anexos (ex: comissão, auditoria, rescisão)...',
    'agreement.articlesCount': 'Artigos Disponíveis',
    'agreement.schedulesModal': 'Explorar Anexos A–G',
    'agreement.signNow': 'Assinar & Executar Contrato',
    'agreement.filterAll': 'Todos os 30 Artigos',
    'agreement.noMatches': 'Nenhum artigo encontrado para o termo pesquisado.',
    'agreement.clearSearch': 'Limpar Filtro de Pesquisa',

    // FAQ
    'faq.badge': 'Inteligência e Apoio ao Parceiro',
    'faq.title': 'Perguntas Frequentes',
    'faq.subtitle': 'Tudo o que precisa de saber sobre adesão, integração de clientes, apoio de marketing, faturação e pagamentos bancários em África e no mundo.',
    'faq.searchPlaceholder': 'Pesquisar dúvidas sobre integração, pagamentos, comissões...',
    'faq.viewAll': 'Ver todas as questões',

    // Final CTA
    'cta.title': 'Pronto para Expandir a Sua Prática e Faturação com a MsmeBooks?',
    'cta.subtitle': 'Junte-se a centenas de contabilistas, consultores e parceiros tecnológicos que capacitam as PMEs em África e internacionalmente.',
    'cta.primary': 'Candidatar-se ao Programa de Parceiros',
    'cta.secondary': 'Rever Termos do Contrato',
    'cta.support': 'Contactar Gabinete de Alianças',

    // Chat
    'chat.title': 'Suporte ao Parceiro',
    'chat.online': 'Online · Resposta em ~2 min',
    'chat.placeholder': 'Escreva a sua dúvida ou mensagem...',
    'chat.send': 'Enviar',
    'chat.helpBadge': 'Ajuda ao Vivo',

    // Footer
    'footer.description': 'O Ecossistema de Parceiros MsmeBooks capacita contabilistas, consultores empresariais e revendedores tecnológicos com ferramentas de gestão na nuvem e comissões recorrentes atrativas.',
    'footer.quickLinks': 'Navegação Rápida',
    'footer.legalDocs': 'Documentos Legais & Conformidade',
    'footer.allRights': 'Todos os direitos reservados. MsmeBooks International.',
    'footer.panAfrican': 'Capacitando PMEs em toda a África e no Mundo.',
    'footer.disclaimer': 'As comissões são regidas pelo Contrato Principal de Parceria e pelas normas regulatórias em vigor na sua jurisdição.',

    // Scroll Widget
    'scroll.up': 'Rolar para cima',
    'scroll.down': 'Rolar para baixo',
    'scroll.top': 'Voltar ao topo',
    'scroll.bottom': 'Ir para o rodapé',
    'scroll.sections': 'Secções da página',
    'scroll.sectionNav': 'Navegador de secções'
  },

  es: {
    // Nav
    'nav.categories': 'Categorías',
    'nav.commissionTiers': 'Niveles de Comisión',
    'nav.calculator': 'Calculadora de Ingresos',
    'nav.agreement': 'Acuerdo de Socios',
    'nav.faq': 'Preguntas Frecuentes',
    'nav.partnerPortal': 'Portal del Socio',
    'nav.adminDesk': 'Panel de Administración',
    'nav.becomePartner': 'Hazte Socio',
    'nav.openMenu': 'Abrir menú',
    'nav.closeMenu': 'Cerrar menú',

    // Hero
    'hero.badge.ecosystem': 'Ecosistema Global MsmeBooks',
    'hero.badge.regions': 'África e Internacional',
    'hero.badge.commission': 'Hasta 40% de Comisión Recurrente',
    'hero.title.part1': 'Asóciate con MsmeBooks.',
    'hero.title.highlight1': 'Haz Crecer tu Negocio.',
    'hero.title.highlight2': 'Genera Ingresos Recurrentes.',
    'hero.subtitle': 'Únete a la Red Global de Socios de MsmeBooks y ayuda a las empresas a transformar su contabilidad, punto de venta (POS), inventario, nóminas y operaciones comerciales mientras generas ingresos recurrentes sostenibles.',
    'hero.description': 'Tanto si eres contador público, asesor empresarial, distribuidor de TPV, revendedor de software o empresa de tecnología, MsmeBooks te ofrece las herramientas y el modelo de negocio para multiplicar tus ingresos.',
    'hero.cta.becomePartner': 'Hazte Socio Hoy Mismo',
    'hero.cta.exploreTiers': 'Explorar Niveles de Comisión',
    'hero.cta.reviewAgreement': 'Consultar Acuerdo Legal',
    'hero.cta.liveDemo': 'Demostración del Portal del Socio',
    'hero.stat.payoutRate': 'Participación Recurrente Máxima',
    'hero.stat.activePartners': 'Socios Certificados Activos',
    'hero.stat.jurisdictions': 'Monedas Operativas',
    'hero.stat.avgAnnualPayout': 'Remuneración Nivel Diamante',
    'hero.card.portalBadge': 'Vista Previa del Portal en Vivo',
    'hero.card.activeTier': 'Socio Nivel Diamante',
    'hero.card.monthlyAccrual': 'Comisión Mensual Estimada',
    'hero.card.instantSettlement': 'Liquidación multimoneda mediante transferencia bancaria directa y pagos móviles',

    // Categories
    'categories.badge': '10 Categorías Especializadas de Socios',
    'categories.title': 'Itinerarios Diseñados para Cada Perfil Profesional',
    'categories.subtitle': 'Desde contadores certificados y consultores ERP empresariales hasta distribuidores de terminales POS, elija el modelo adaptado a su negocio.',
    'categories.searchPlaceholder': 'Buscar categorías, público objetivo o beneficios...',
    'categories.filterAll': 'Todas las Categorías',
    'categories.joinCategory': 'Unirse a esta Categoría',
    'categories.viewSchedule': 'Ver Anexo',
    'categories.targetAudience': 'Ideal Para',
    'categories.keyBenefits': 'Beneficios Estratégicos Clave',

    // Commission Tiers
    'tiers.badge': 'Estructura Progresiva de Ganancias',
    'tiers.title': 'Estructura Transparente de Comisiones Recurrentes',
    'tiers.subtitle': 'Gana ingresos recurrentes continuos por cada suscripción activa, tarifa de implementación y módulo adquirido durante todo el ciclo de vida del cliente.',
    'tiers.monthlyPayouts': 'Liquidaciones Mensuales Automatizadas',
    'tiers.bronze': 'Bronce Afiliado',
    'tiers.silver': 'Plata Asociado',
    'tiers.gold': 'Oro Consultor',
    'tiers.platinum': 'Platino Empresarial',
    'tiers.diamond': 'Diamante Élite Soberano',
    'tiers.rate': 'Tasa de Comisión',
    'tiers.clientsRequired': 'Cuentas de Clientes Activas',
    'tiers.applyForTier': 'Solicitar este Nivel',
    'tiers.guaranteed': 'Garantía de Atribución Vitalicia',

    // Calculator
    'calc.badge': 'Simulador Interactivo de Ingresos',
    'calc.title': 'Calcula tus Ganancias Mensuales y Anuales',
    'calc.subtitle': 'Modela tus comisiones proyectadas en función del número de clientes activos, el plan de software y tu nivel alcanzado.',
    'calc.clientCountLabel': 'Número de Suscripciones Activas de Clientes',
    'calc.planTypeLabel': 'Plan de Software Principal Comercializado',
    'calc.partnerTierLabel': 'Tu Nivel de Comisión Objetivo',
    'calc.monthlyCommission': 'Ingresos Mensuales Proyectados',
    'calc.annualCommission': 'Ingreso Recurrente Anual Proyectado',
    'calc.effectiveRate': 'Tasa de Comisión Efectiva',
    'calc.payoutFrequency': 'Pagos procesados automáticamente el 5 de cada mes en tu moneda local preferida.',
    'calc.ctaButton': 'Empieza a Ganar — Únete a la Red',

    // Agreement Viewer
    'agreement.badge': 'Marco Legal y Acuerdo Maestro',
    'agreement.title': 'Términos del Acuerdo Maestro y Anexos',
    'agreement.subtitle': 'Revisa el exhaustivo acuerdo legal de 30 artículos y anexos que regulan las condiciones de acreditación, licencias, no captación y liquidación automatizada.',
    'agreement.searchPlaceholder': 'Buscar en los 30 artículos y anexos (ej. comisión, auditoría, terminación)...',
    'agreement.articlesCount': 'Artículos Disponibles',
    'agreement.schedulesModal': 'Explorar Anexos A–G',
    'agreement.signNow': 'Firmar y Ejecutar Acuerdo',
    'agreement.filterAll': 'Los 30 Artículos',
    'agreement.noMatches': 'No se encontraron artículos que coincidan con la búsqueda.',
    'agreement.clearSearch': 'Limpiar Filtro de Búsqueda',

    // FAQ
    'faq.badge': 'Centro de Conocimiento y Soporte',
    'faq.title': 'Preguntas Frecuentes',
    'faq.subtitle': 'Todo lo que necesitas saber sobre incorporación, comisiones, materiales de marketing, facturación y pagos bancarios locales en África y el mundo.',
    'faq.searchPlaceholder': 'Buscar dudas sobre comisiones, altas, pagos...',
    'faq.viewAll': 'Ver todas las preguntas',

    // Final CTA
    'cta.title': '¿Listo para Expandir tu Negocio e Ingresos con MsmeBooks?',
    'cta.subtitle': 'Únete a cientos de profesionales contables, consultores y empresas tecnológicas que impulsan a las pymes en África y a nivel internacional.',
    'cta.primary': 'Solicitar Unirse al Programa',
    'cta.secondary': 'Revisar Términos del Acuerdo',
    'cta.support': 'Contactar con Alianzas Estratégicas',

    // Chat
    'chat.title': 'Mesa de Soporte para Socios',
    'chat.online': 'En línea · Respuesta en ~2 min',
    'chat.placeholder': 'Escribe tu consulta o mensaje...',
    'chat.send': 'Enviar',
    'chat.helpBadge': 'Ayuda en Directo',

    // Footer
    'footer.description': 'El Ecosistema de Socios de MsmeBooks apoya a contadores, asesores comerciales y distribuidores tecnológicos con soluciones empresariales en la nube y altas comisiones recurrentes.',
    'footer.quickLinks': 'Navegación Rápida',
    'footer.legalDocs': 'Documentos Legales y Cumplimiento',
    'footer.allRights': 'Todos los derechos reservados. MsmeBooks International.',
    'footer.panAfrican': 'Impulsando a las pymes en toda África y a nivel global.',
    'footer.disclaimer': 'Las comisiones se rigen por el Acuerdo Maestro de Socios y las normativas aplicables en su territorio de operaciones.',

    // Scroll Widget
    'scroll.up': 'Desplazar hacia arriba',
    'scroll.down': 'Desplazar hacia abajo',
    'scroll.top': 'Volver arriba',
    'scroll.bottom': 'Ir al final',
    'scroll.sections': 'Secciones de la página',
    'scroll.sectionNav': 'Navegador de secciones'
  }
};
