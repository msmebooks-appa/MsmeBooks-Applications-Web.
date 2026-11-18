import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

export type LanguageCode = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'Global & Anglophone Africa'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Afrique Francophone & International'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'África Lusófona & Internacional'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Guinea Ecuatorial, España & LatAm'
  }
};

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    'nav.tiers': 'Commission Tiers',
    'nav.categories': 'Who Can Partner',
    'nav.calculator': 'Earnings Calculator',
    'nav.dashboard': 'Partner Portal',
    'nav.leaderboard': 'Leaderboard',
    'nav.payouts': 'Payouts & Terms',
    'nav.faq': 'FAQ',
    'nav.adminDemo': 'Admin Demo',
    'nav.apply': 'Become a Partner',
    'nav.agreement': 'Partner Agreement',
    'nav.language': 'Language',
    'nav.currency': 'Display Currency',
    'nav.takeTour': 'Partner Tour',

    // Hero
    'hero.badge': 'Pan-African Partner Ecosystem',
    'hero.title': 'Earn 15% to 40% Recurring Monthly Commission',
    'hero.titleAccent': 'For Every SME Client You Onboard',
    'hero.subtitle': 'Partner with MsmeBooks to empower SMEs across Africa with cloud accounting, retail POS, multi-branch inventory, and automated payroll while building dependable recurring income.',
    'hero.ctaPrimary': 'Become an MsmeBooks Partner — Earn Up to 40%',
    'hero.ctaSecondary': 'Preview Partner Portal Demo',
    'hero.zeroFees': 'Zero Registration Fees',
    'hero.payoutSla': 'Guaranteed 5th-of-the-month Payouts',
    'hero.lifetimeAttr': 'Lifetime Client Attribution',
    'hero.statsPartners': '1,400+ Active Partners',
    'hero.statsPayouts': '$450K+ Disbursed Commissions',
    'hero.statsRetention': '98.4% SME Client Retention Rate',

    // Tiers
    'tiers.badge': 'Four Structured Reward Levels',
    'tiers.title': 'Tier Progression & Commission Structure',
    'tiers.subtitle': 'Scale your recurring earnings as your book of active SME clients expands. Progress from 15% at Bronze to 40% at Platinum with dedicated co-marketing funds.',
    'tiers.rate': 'Recurring Monthly',
    'tiers.target': 'Target Profile',
    'tiers.benefits': 'Key Partner Benefits',
    'tiers.joinTier': 'Join as {name}',
    'tiers.mostPopular': 'Most Popular For Advisory Firms',

    // Calculator
    'calc.badge': 'Interactive Revenue Forecaster',
    'calc.title': 'Commission Earnings Calculator',
    'calc.subtitle': 'Model your projected monthly and annual recurring revenues based on client volume and software subscription tiers.',
    'calc.clientsLabel': 'Active SME Clients Referred',
    'calc.planLabel': 'Monthly Plan Subscription Tier',
    'calc.partnerTier': 'Qualified Partner Tier',
    'calc.monthlyCommission': 'Projected Monthly Commission',
    'calc.annualCommission': 'Annual Projected Recurring Income',
    'calc.applyTier': 'Lock In This Tier Now',

    // Dashboard
    'dashboard.badge': 'Realistic Partner Portal Preview',
    'dashboard.title': 'Full Visibility Over Every Referral & Payout',
    'dashboard.subtitle': 'Access detailed metrics, real-time client attribution logs, pending disbursements, and growth forecasts in your dedicated partner portal.',
    'dashboard.mrr': 'Monthly Recurring Revenue (MRR)',
    'dashboard.pendingPayout': 'Next Scheduled Payout (5th)',
    'dashboard.activeReferrals': 'Active Subscribed Clients',
    'dashboard.retention': 'Average Client Retention',
    'dashboard.tabChart': 'Recurring Growth Projection',
    'dashboard.tabLedger': 'Live Attribution Ledger',
    'dashboard.tabStatements': 'Payout History',

    // Leaderboard
    'leaderboard.badge': 'Monthly Top Performers Index',
    'leaderboard.title': 'Top 5 Performing Partners of the Month',
    'leaderboard.subtitle': 'Honoring top accounting firms, retail POS distributors, and enterprise advisors driving cloud adoption across Africa. Verified real performance data.',
    'leaderboard.champion': '#1 Champion',
    'leaderboard.silver': '#2 Silver Medal',
    'leaderboard.bronze': '#3 Bronze Medal',
    'leaderboard.conversions': 'Conversions',
    'leaderboard.commission': 'Monthly Commission',
    'leaderboard.growth': 'MoM Growth',
    'leaderboard.volume': 'Referred Volume',
    'leaderboard.join': 'Join the Leaderboard',

    // Chat
    'chat.header': 'Partner Support Desk',
    'chat.live': 'Live',
    'chat.onDuty': 'Folake & Tariq on duty',
    'chat.avgReply': 'Avg reply < 5m',
    'chat.liveChat': 'Live Chat',
    'chat.channels': 'Channels',
    'chat.ticket': 'Ticket',
    'chat.supportOnline': 'Support Agents Online',
    'chat.placeholder': 'Type your message to partner support...',
    'chat.whatsapp': 'WhatsApp Partner Desk',
    'chat.email': 'Dedicated Partner Email',
    'chat.callback': 'Schedule a Callback',

    // Tour
    'tour.stepOf': 'Step {current} of {total}',
    'tour.skip': 'Skip Tour',
    'tour.next': 'Next Step',
    'tour.back': 'Back',
    'tour.finish': 'Get Started & Apply',
    'tour.welcomeTitle': 'Welcome to MsmeBooks Partner Program',
    'tour.welcomeDesc': 'Discover how to build a dependable recurring monthly income by helping SMEs across Africa migrate to cloud accounting, smart retail POS, and automated payroll.',
    'tour.calculatorTitle': 'Interactive Commission Calculator',
    'tour.calculatorDesc': 'Model your projected earnings in real time! Adjust client volume and subscription packages to watch your commission scale up to 40% with zero earning caps.',
    'tour.dashboardTitle': 'Live Partner Portal & Growth Analytics',
    'tour.dashboardDesc': 'Your central command center: monitor client attribution, track Monthly Recurring Revenue (MRR), and visualize recurring payouts on the interactive chart.',
    'tour.leaderboardTitle': 'Pan-African Partner Leaderboard',
    'tour.leaderboardDesc': 'Meet our Top 5 monthly champions! See how leading accounting firms and tech distributors in Nigeria, Ghana, Kenya, and South Africa earn record commissions.',
    'tour.supportTitle': 'Dedicated Human Support & Live Desk',
    'tour.supportDesc': 'Need assistance with client migration or onboarding? Reach our dedicated Partner Success specialists anytime via live chat, WhatsApp, or instant callback scheduling.',
    'tour.applyTitle': 'Ready to Start Earning Up to 40%?',
    'tour.applyDesc': 'Registration takes under 2 minutes with zero upfront fees. Join 1,400+ certified business advisors and start receiving guaranteed 5th-of-the-month disbursements.',

    // Connection Status
    'status.online': 'Online',
    'status.offline': 'Offline Mode',
    'status.onlineDesc': 'Connected to MsmeBooks Cloud · Real-time rates & live sync active',
    'status.offlineDesc': 'Operating in offline cached mode · Calculations & form drafts are saved locally and will auto-sync upon reconnection',
    'status.checkConn': 'Check Connection',
    'status.simOffline': 'Simulate Offline',
    'status.restoreOnline': 'Restore Online',
    'status.offlineNotice': 'Offline Mode Active · Your data is safely stored in local cache'
  },

  fr: {
    // Nav
    'nav.tiers': 'Paliers de commission',
    'nav.categories': 'Qui peut s\'associer',
    'nav.calculator': 'Simulateur de gains',
    'nav.dashboard': 'Portail partenaire',
    'nav.leaderboard': 'Tableau des leaders',
    'nav.payouts': 'Règlements & conditions',
    'nav.faq': 'FAQ',
    'nav.adminDemo': 'Démo Admin',
    'nav.apply': 'Devenir partenaire',
    'nav.agreement': 'Contrat partenaire',
    'nav.language': 'Langue',
    'nav.currency': 'Devise d\'affichage',
    'nav.takeTour': 'Visite guidée',

    // Hero
    'hero.badge': 'Écosystème de Partenaires Panafricain',
    'hero.title': 'Gagnez 15% à 40% de Commission Mensuelle Récurrente',
    'hero.titleAccent': 'Pour Chaque Client PME Intégré',
    'hero.subtitle': 'Associez-vous à MsmeBooks pour équiper les PME d\'Afrique avec une comptabilité cloud, un point de vente tactile, une gestion de stocks et une paie automatisée tout en créant des revenus pérennes.',
    'hero.ctaPrimary': 'Devenir partenaire MsmeBooks — Jusqu\'à 40%',
    'hero.ctaSecondary': 'Découvrir la démo du portail',
    'hero.zeroFees': 'Zéro Frais d\'Inscription',
    'hero.payoutSla': 'Paiements Garantis le 5 de Chaque Mois',
    'hero.lifetimeAttr': 'Attribution Client à Vie',
    'hero.statsPartners': 'Plus de 1 400 Partenaires Actifs',
    'hero.statsPayouts': '+450K$ de Commissions Versées',
    'hero.statsRetention': '98,4% de Rétention des PME Clientes',

    // Tiers
    'tiers.badge': 'Quatre Niveaux de Rémunération Structurés',
    'tiers.title': 'Progression des Paliers & Barème de Commission',
    'tiers.subtitle': 'Augmentez vos revenus récurrents à mesure que votre clientèle de PME grandit. Passez de 15% au niveau Bronze à 40% au niveau Platinum avec fonds de co-marketing.',
    'tiers.rate': 'Récurrent Mensuel',
    'tiers.target': 'Profil Cible',
    'tiers.benefits': 'Avantages Partenaire Clés',
    'tiers.joinTier': 'Rejoindre en tant que {name}',
    'tiers.mostPopular': 'Le Plus Choisi par les Cabinets Conseil',

    // Calculator
    'calc.badge': 'Simulateur Prévisionnel de Revenus',
    'calc.title': 'Calculateur de Commissions Récurrentes',
    'calc.subtitle': 'Estimez vos revenus mensuels et annuels en fonction du volume de clients accompagnés et des formules d\'abonnement logicielles.',
    'calc.clientsLabel': 'Nombre de PME Clientes Recommandées',
    'calc.planLabel': 'Niveau de Formule d\'Abonnement',
    'calc.partnerTier': 'Palier Partenaire Obtenu',
    'calc.monthlyCommission': 'Commission Mensuelle Estimée',
    'calc.annualCommission': 'Revenu Récurrent Annuel Projeté',
    'calc.applyTier': 'Verrouiller ce Palier Maintenant',

    // Dashboard
    'dashboard.badge': 'Aperçu Réaliste du Portail Partenaire',
    'dashboard.title': 'Visibilité Totale sur Vos Recommandations & Paiements',
    'dashboard.subtitle': 'Consultez les métriques clés, le grand livre d\'attribution client en temps réel, les règlements en attente et les prévisions de croissance.',
    'dashboard.mrr': 'Revenu Récurrent Mensuel (MRR)',
    'dashboard.pendingPayout': 'Prochain Versement (le 5 du mois)',
    'dashboard.activeReferrals': 'Clients Abonnés Actifs',
    'dashboard.retention': 'Rétention Moyenne des Clients',
    'dashboard.tabChart': 'Projection de Croissance Récurrente',
    'dashboard.tabLedger': 'Registre d\'Attribution en Direct',
    'dashboard.tabStatements': 'Historique des Versements',

    // Leaderboard
    'leaderboard.badge': 'Indice Mensuel des Meilleurs Performers',
    'leaderboard.title': 'Top 5 des Partenaires Performants du Mois',
    'leaderboard.subtitle': 'Célébration des cabinets comptables, distributeurs de TPV et conseillers guidant la transition numérique des PME en Afrique.',
    'leaderboard.champion': '#1 Champion',
    'leaderboard.silver': '#2 Médaille d\'Argent',
    'leaderboard.bronze': '#3 Médaille de Bronze',
    'leaderboard.conversions': 'Conversions',
    'leaderboard.commission': 'Commission Mensuelle',
    'leaderboard.growth': 'Croissance Mensuelle',
    'leaderboard.volume': 'Volume Recommandé',
    'leaderboard.join': 'Rejoindre le Classement',

    // Chat
    'chat.header': 'Bureau d\'Assistance Partenaires',
    'chat.live': 'En direct',
    'chat.onDuty': 'Folake & Tariq en service',
    'chat.avgReply': 'Rép. moyenne < 5 min',
    'chat.liveChat': 'Chat en Direct',
    'chat.channels': 'Canaux Directs',
    'chat.ticket': 'Ouvrir un Ticket',
    'chat.supportOnline': 'Conseillers en Ligne',
    'chat.placeholder': 'Écrivez votre message à l\'assistance partenaire...',
    'chat.whatsapp': 'Ligne WhatsApp Partenaires',
    'chat.email': 'Email Partenaires Dédié',
    'chat.callback': 'Planifier un Rappel Téléphonique',

    // Tour
    'tour.stepOf': 'Étape {current} sur {total}',
    'tour.skip': 'Passer la visite',
    'tour.next': 'Étape suivante',
    'tour.back': 'Précédent',
    'tour.finish': 'Commencer & Candidater',
    'tour.welcomeTitle': 'Bienvenue dans l\'Écosystème Partenaires MsmeBooks',
    'tour.welcomeDesc': 'Découvrez comment bâtir un revenu mensuel récurrent prévisible en déployant des solutions de comptabilité cloud, TPV tactile et paie auprès des PME en Afrique.',
    'tour.calculatorTitle': 'Simulateur Interactif de Commissions',
    'tour.calculatorDesc': 'Modélisez vos gains en direct! Ajustez le volume de clients et les offres logicielles pour voir votre commission progresser jusqu\'à 40% sans aucun plafond.',
    'tour.dashboardTitle': 'Portail Partenaire & Graphique de Croissance',
    'tour.dashboardDesc': 'Votre centre de contrôle: surveillez l\'attribution de vos clients, suivez le MRR récurrent et visualisez la croissance avec le graphique dynamique à double axe.',
    'tour.leaderboardTitle': 'Tableau des Leaders Panafricain',
    'tour.leaderboardDesc': 'Découvrez nos 5 champions du mois! Voyez comment des cabinets au Nigeria, Ghana, Kenya et Afrique du Sud génèrent des commissions records.',
    'tour.supportTitle': 'Assistance Dédiée & Support Humain en Direct',
    'tour.supportDesc': 'Besoin d\'aide sur une intégration ou un déploiement client? Contactez nos spécialistes par chat en direct, WhatsApp ou demandez un rappel prioritaire.',
    'tour.applyTitle': 'Prêt à Gagner Jusqu\'à 40% de Commission?',
    'tour.applyDesc': 'L\'inscription prend moins de 2 minutes sans aucun frais d\'entrée. Rejoignez plus de 1 400 partenaires certifiés et recevez des virements garantis le 5 de chaque mois.',

    // Connection Status
    'status.online': 'En ligne',
    'status.offline': 'Mode Hors Ligne',
    'status.onlineDesc': 'Connecté au Cloud MsmeBooks · Taux réels et synchronisation active',
    'status.offlineDesc': 'Fonctionnement en mode hors ligne · Calculs et formulaires sont sauvegardés localement et seront synchronisés dès la reconnexion',
    'status.checkConn': 'Vérifier la connexion',
    'status.simOffline': 'Simuler hors ligne',
    'status.restoreOnline': 'Rétablir en ligne',
    'status.offlineNotice': 'Mode Hors Ligne Actif · Données conservées en cache local'
  },

  pt: {
    // Nav
    'nav.tiers': 'Níveis de Comissão',
    'nav.categories': 'Quem Pode Ser Parceiro',
    'nav.calculator': 'Calculadora de Ganhos',
    'nav.dashboard': 'Portal do Parceiro',
    'nav.leaderboard': 'Quadro de Líderes',
    'nav.payouts': 'Pagamentos & Termos',
    'nav.faq': 'Perguntas Frequentes',
    'nav.adminDemo': 'Demo de Admin',
    'nav.apply': 'Tornar-se Parceiro',
    'nav.agreement': 'Acordo de Parceria',
    'nav.language': 'Idioma',
    'nav.currency': 'Moeda de Exibição',
    'nav.takeTour': 'Tour Guiado',

    // Hero
    'hero.badge': 'Ecossistema de Parceiros Pan-Africano',
    'hero.title': 'Ganhe 15% a 40% de Comissão Mensal Recorrente',
    'hero.titleAccent': 'Por Cada Cliente PME Integrado',
    'hero.subtitle': 'Seja parceiro do MsmeBooks para capacitar PMEs em toda a África com contabilidade na nuvem, POS de retalho, gestão de inventário e folha de pagamento automatizada enquanto constrói receitas sustentáveis.',
    'hero.ctaPrimary': 'Ser Parceiro MsmeBooks — Ganhe Até 40%',
    'hero.ctaSecondary': 'Ver Demonstração do Portal',
    'hero.zeroFees': 'Zero Taxas de Registo',
    'hero.payoutSla': 'Pagamentos Garantidos no Dia 5 de Cada Mês',
    'hero.lifetimeAttr': 'Atribuição Vitalícia de Clientes',
    'hero.statsPartners': 'Mais de 1.400 Parceiros Ativos',
    'hero.statsPayouts': '+US$ 450K em Comissões Pagas',
    'hero.statsRetention': '98,4% de Taxa de Retenção de PMEs',

    // Tiers
    'tiers.badge': 'Quatro Níveis Estruturados de Recompensa',
    'tiers.title': 'Progressão de Níveis & Estrutura de Comissão',
    'tiers.subtitle': 'Escale os seus ganhos recorrentes à medida que a sua carteira de PMEs se expande. Progrida de 15% no Bronze até 40% no Platinum com fundos de co-marketing dedicados.',
    'tiers.rate': 'Recorrente Mensal',
    'tiers.target': 'Perfil Alvo',
    'tiers.benefits': 'Principais Benefícios',
    'tiers.joinTier': 'Aderir como {name}',
    'tiers.mostPopular': 'Mais Escolhido por Firmas de Consultoria',

    // Calculator
    'calc.badge': 'Previsão Interativa de Receita',
    'calc.title': 'Calculadora de Comissões Recorrentes',
    'calc.subtitle': 'Simule os seus rendimentos mensais e anuais com base no número de clientes indicados e nos pacotes de subscrição de software.',
    'calc.clientsLabel': 'Clientes PME Ativos Indicados',
    'calc.planLabel': 'Nível de Plano de Subscrição',
    'calc.partnerTier': 'Nível de Parceria Qualificado',
    'calc.monthlyCommission': 'Comissão Mensal Estimada',
    'calc.annualCommission': 'Receita Recorrente Anual Projetada',
    'calc.applyTier': 'Garantir Este Nível Agora',

    // Dashboard
    'dashboard.badge': 'Pré-visualização Realista do Portal',
    'dashboard.title': 'Visibilidade Completa de Cada Indicação e Pagamento',
    'dashboard.subtitle': 'Aceda a métricas detalhadas, registos de atribuição em tempo real, pagamentos pendentes e previsões de crescimento no seu portal exclusivo.',
    'dashboard.mrr': 'Receita Recorrente Mensal (MRR)',
    'dashboard.pendingPayout': 'Próximo Pagamento (Dia 5)',
    'dashboard.activeReferrals': 'Clientes Ativos Indicados',
    'dashboard.retention': 'Retenção Média de Clientes',
    'dashboard.tabChart': 'Projeção de Crescimento Recorrente',
    'dashboard.tabLedger': 'Registo de Atribuição ao Vivo',
    'dashboard.tabStatements': 'Histórico de Pagamentos',

    // Leaderboard
    'leaderboard.badge': 'Índice Mensal de Melhores Resultados',
    'leaderboard.title': 'Top 5 Parceiros com Melhor Desempenho do Mês',
    'leaderboard.subtitle': 'Reconhecendo as principais firmas de contabilidade, distribuidores de POS e consultores que lideram a transformação digital em África.',
    'leaderboard.champion': '#1 Campeão',
    'leaderboard.silver': '#2 Medalha de Prata',
    'leaderboard.bronze': '#3 Medalha de Bronze',
    'leaderboard.conversions': 'Conversões',
    'leaderboard.commission': 'Comissão Mensal',
    'leaderboard.growth': 'Crescimento Mensal',
    'leaderboard.volume': 'Volume Indicado',
    'leaderboard.join': 'Entrar no Quadro de Líderes',

    // Chat
    'chat.header': 'Mesa de Apoio ao Parceiro',
    'chat.live': 'Ao vivo',
    'chat.onDuty': 'Folake & Tariq de serviço',
    'chat.avgReply': 'Resp. média < 5 min',
    'chat.liveChat': 'Chat ao Vivo',
    'chat.channels': 'Canais Diretos',
    'chat.ticket': 'Abrir Pedido',
    'chat.supportOnline': 'Agentes de Suporte Online',
    'chat.placeholder': 'Escreva a sua mensagem para o suporte...',
    'chat.whatsapp': 'Linha WhatsApp de Parceiros',
    'chat.email': 'Email Dedicado a Parceiros',
    'chat.callback': 'Agendar Chamada Telefónica',

    // Tour
    'tour.stepOf': 'Passo {current} de {total}',
    'tour.skip': 'Ignorar Tour',
    'tour.next': 'Próximo Passo',
    'tour.back': 'Voltar',
    'tour.finish': 'Concluir & Candidatar',
    'tour.welcomeTitle': 'Bem-vindo ao Programa de Parceiros MsmeBooks',
    'tour.welcomeDesc': 'Descubra como criar um rendimento mensal recorrente e seguro ao fornecer contabilidade em nuvem, POS moderno e salários automatizados a PMEs em África.',
    'tour.calculatorTitle': 'Calculadora Interativa de Comissões',
    'tour.calculatorDesc': 'Modele os seus ganhos em tempo real! Ajuste o número de clientes e os planos para ver a sua comissão alcançar até 40% sem qualquer teto.',
    'tour.dashboardTitle': 'Portal de Parceiros & Gráficos de Crescimento',
    'tour.dashboardDesc': 'O seu centro de controlo: acompanhe atribuições de clientes, monitore a Receita Recorrente Mensal (MRR) e visualize projeções no gráfico interativo.',
    'tour.leaderboardTitle': 'Quadro de Líderes Pan-Africano',
    'tour.leaderboardDesc': 'Conheça os 5 campeões do mês! Veja como escritórios na Nigéria, Gana, Quénia e África do Sul atingem comissões históricas.',
    'tour.supportTitle': 'Suporte Humano Dedicado & Mesa de Ajuda',
    'tour.supportDesc': 'Precisa de suporte na migração ou implementação de um cliente? Fale com a equipa de Sucesso do Parceiro por chat, WhatsApp ou solicite retorno telefónico.',
    'tour.applyTitle': 'Pronto para Ganhar Até 40% de Comissão?',
    'tour.applyDesc': 'O registo demora menos de 2 minutos sem qualquer taxa inicial. Junte-se a mais de 1.400 parceiros certificados com pagamentos garantidos a cada dia 5.',

    // Connection Status
    'status.online': 'Online',
    'status.offline': 'Modo Offline',
    'status.onlineDesc': 'Conectado à Nuvem MsmeBooks · Taxas em tempo real e sincronização ativas',
    'status.offlineDesc': 'A funcionar em modo offline · Cálculos e rascunhos de candidatura são guardados localmente e sincronizados ao reconectar',
    'status.checkConn': 'Verificar ligação',
    'status.simOffline': 'Simular offline',
    'status.restoreOnline': 'Restaurar online',
    'status.offlineNotice': 'Modo Offline Ativo · Dados guardados em segurança na cache local'
  },

  es: {
    // Nav
    'nav.tiers': 'Niveles de Comisión',
    'nav.categories': 'Quién Puede Ser Socio',
    'nav.calculator': 'Calculadora de Ganancias',
    'nav.dashboard': 'Portal del Socio',
    'nav.leaderboard': 'Tabla de Líderes',
    'nav.payouts': 'Pagos & Términos',
    'nav.faq': 'Preguntas Frecuentes',
    'nav.adminDemo': 'Demo de Admin',
    'nav.apply': 'Ser Socio Asociado',
    'nav.agreement': 'Acuerdo de Asociación',
    'nav.language': 'Idioma',
    'nav.currency': 'Moneda de Visualización',
    'nav.takeTour': 'Tour Guiado',

    // Hero
    'hero.badge': 'Ecosistema de Socios Panafricano',
    'hero.title': 'Gane 15% a 40% de Comisión Mensual Recurrente',
    'hero.titleAccent': 'Por Cada Cliente Pyme Incorporado',
    'hero.subtitle': 'Asóciese con MsmeBooks para impulsar pymes en África con contabilidad en la nube, TPV minorista, control de inventario y nómina automatizada, creando ingresos recurrentes seguros.',
    'hero.ctaPrimary': 'Ser Socio de MsmeBooks — Hasta 40%',
    'hero.ctaSecondary': 'Ver Demostración del Portal',
    'hero.zeroFees': 'Cero Tarifas de Registro',
    'hero.payoutSla': 'Pagos Garantizados el Día 5 de Cada Mes',
    'hero.lifetimeAttr': 'Atribución Vitalicia de Clientes',
    'hero.statsPartners': 'Más de 1.400 Socios Activos',
    'hero.statsPayouts': '+450.000 USD en Comisiones Pagadas',
    'hero.statsRetention': '98,4% de Retención de Pymes Clientes',

    // Tiers
    'tiers.badge': 'Cuatro Niveles Estructurados de Recompensa',
    'tiers.title': 'Progresión de Niveles & Escala de Comisiones',
    'tiers.subtitle': 'Escale sus ingresos recurrentes a medida que crece su cartera de clientes pyme. Avance del 15% en Bronce al 40% en Platino con fondos de co-marketing.',
    'tiers.rate': 'Recurrente Mensual',
    'tiers.target': 'Perfil Objetivo',
    'tiers.benefits': 'Beneficios Clave para Socios',
    'tiers.joinTier': 'Unirse como {name}',
    'tiers.mostPopular': 'El Más Elegido por Firmas de Asesoría',

    // Calculator
    'calc.badge': 'Pronóstico Interactivo de Ingresos',
    'calc.title': 'Calculadora de Comisiones Recurrentes',
    'calc.subtitle': 'Estime sus ingresos mensuales y anuales en función del volumen de clientes gestionados y las suscripciones de software.',
    'calc.clientsLabel': 'Clientes Pyme Activos Recomendados',
    'calc.planLabel': 'Nivel de Suscripción del Plan',
    'calc.partnerTier': 'Nivel de Socio Alcanzado',
    'calc.monthlyCommission': 'Comisión Mensual Estimada',
    'calc.annualCommission': 'Ingreso Recurrente Anual Proyectado',
    'calc.applyTier': 'Asegurar Este Nivel Ahora',

    // Dashboard
    'dashboard.badge': 'Vista Previa Realista del Portal',
    'dashboard.title': 'Visibilidad Total de Cada Recomendación y Pago',
    'dashboard.subtitle': 'Acceda a métricas clave, libro de atribución de clientes en tiempo real, liquidaciones pendientes y previsiones de crecimiento en su portal exclusivo.',
    'dashboard.mrr': 'Ingreso Recurrente Mensual (MRR)',
    'dashboard.pendingPayout': 'Próximo Pago Programado (Día 5)',
    'dashboard.activeReferrals': 'Clientes Activos Suscritos',
    'dashboard.retention': 'Retención Promedio de Clientes',
    'dashboard.tabChart': 'Proyección de Crecimiento Recurrente',
    'dashboard.tabLedger': 'Libro de Atribución en Vivo',
    'dashboard.tabStatements': 'Historial de Liquidaciones',

    // Leaderboard
    'leaderboard.badge': 'Índice Mensual de Máximo Rendimiento',
    'leaderboard.title': 'Top 5 Socios con Mejor Desempeño del Mes',
    'leaderboard.subtitle': 'Reconocimiento a las principales firmas contables, distribuidores de TPV y consultores que lideran la adopción de la nube en África.',
    'leaderboard.champion': '#1 Campeón',
    'leaderboard.silver': '#2 Medalla de Plata',
    'leaderboard.bronze': '#3 Medalla de Bronce',
    'leaderboard.conversions': 'Conversiones',
    'leaderboard.commission': 'Comisión Mensual',
    'leaderboard.growth': 'Crecimiento Mensual',
    'leaderboard.volume': 'Volumen Recomendado',
    'leaderboard.join': 'Unirse a la Tabla de Líderes',

    // Chat
    'chat.header': 'Mesa de Asistencia para Socios',
    'chat.live': 'En directo',
    'chat.onDuty': 'Folake & Tariq de guardia',
    'chat.avgReply': 'Resp. media < 5 min',
    'chat.liveChat': 'Chat en Directo',
    'chat.channels': 'Canales Directos',
    'chat.ticket': 'Crear Ticket',
    'chat.supportOnline': 'Agentes de Soporte en Línea',
    'chat.placeholder': 'Escriba su mensaje al soporte de socios...',
    'chat.whatsapp': 'Línea WhatsApp de Socios',
    'chat.email': 'Email Exclusivo para Socios',
    'chat.callback': 'Programar una Llamada',

    // Tour
    'tour.stepOf': 'Paso {current} de {total}',
    'tour.skip': 'Omitir Tour',
    'tour.next': 'Siguiente Paso',
    'tour.back': 'Atrás',
    'tour.finish': 'Empezar & Solicitar',
    'tour.welcomeTitle': 'Bienvenido al Programa de Socios de MsmeBooks',
    'tour.welcomeDesc': 'Descubra cómo generar ingresos mensuales recurrentes confiables ayudando a pymes en África a migrar a contabilidad en la nube, TPV inteligente y nómina automatizada.',
    'tour.calculatorTitle': 'Calculadora Interactiva de Comisiones',
    'tour.calculatorDesc': '¡Modele sus ganancias en tiempo real! Ajuste la cantidad de clientes y los planes para ver cómo su comisión alcanza hasta el 40% sin límites.',
    'tour.dashboardTitle': 'Portal de Socios & Gráficos de Crecimiento',
    'tour.dashboardDesc': 'Su centro de operaciones: supervise la atribución de clientes, rastree los ingresos recurrentes (MRR) y visualice proyecciones en el gráfico interactivo.',
    'tour.leaderboardTitle': 'Tabla de Líderes Panafricana',
    'tour.leaderboardDesc': '¡Conozca a los 5 campeones mensuales! Vea cómo firmas en Nigeria, Ghana, Kenia y Sudáfrica obtienen comisiones récord.',
    'tour.supportTitle': 'Soporte Humano Dedicado & Asistencia Directa',
    'tour.supportDesc': '¿Necesita ayuda con la migración o incorporación de un cliente? Contacte a nuestros especialistas por chat en directo, WhatsApp o programe una llamada prioritaria.',
    'tour.applyTitle': '¿Listo para Ganar Hasta el 40% de Comisión?',
    'tour.applyDesc': 'El registro toma menos de 2 minutos sin costo inicial. Únase a más de 1.400 socios certificados con pagos garantizados cada día 5.',

    // Connection Status
    'status.online': 'En línea',
    'status.offline': 'Modo Sin Conexión',
    'status.onlineDesc': 'Conectado a la Nube MsmeBooks · Tasas en tiempo real y sincronización activa',
    'status.offlineDesc': 'Operando en modo sin conexión · Cálculos y borradores se guardan localmente y se sincronizarán al reconectar',
    'status.checkConn': 'Comprobar conexión',
    'status.simOffline': 'Simular sin conexión',
    'status.restoreOnline': 'Restablecer en línea',
    'status.offlineNotice': 'Modo Sin Conexión Activo · Datos protegidos en caché local'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  languageInfo: LanguageInfo;
  languages: LanguageInfo[];
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msme-language') as LanguageCode | null;
      if (saved && LANGUAGES[saved]) {
        return saved;
      }
      // Browser language detection
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      if (navLang === 'fr') return 'fr';
      if (navLang === 'pt') return 'pt';
      if (navLang === 'es') return 'es';
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    if (LANGUAGES[lang]) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('msme-language', lang);
        document.documentElement.lang = lang;
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const languageInfo = useMemo(() => {
    return LANGUAGES[language] || LANGUAGES.en;
  }, [language]);

  const languages = useMemo(() => {
    return Object.values(LANGUAGES);
  }, []);

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageInfo,
        languages,
        setLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
