import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLocale, FaqItemData } from '../types/faq';
import { FAQ_TRANSLATIONS } from '../data/faqTranslations';

export type { SupportedLocale };

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  regionHint?: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr', regionHint: 'Global / Anglophone Africa' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', regionHint: 'Francophone Africa & Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr', regionHint: 'Angola, Mozambique, Portugal, Brazil' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', regionHint: 'Equatorial Guinea, LatAm & Spain' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl', regionHint: 'North Africa & Middle East' },
];

export const UI_TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  en: {
    // Header & Nav
    'nav.home': 'Home',
    'nav.products': 'Products & Solutions',
    'nav.industries': 'Industries',
    'nav.features': 'Features',
    'nav.marketplace': 'Marketplace',
    'nav.pricing': 'Pricing',
    'nav.partners': 'Partners',
    'nav.faq': 'Help & FAQ',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started Free',
    'nav.askAi': 'Ask AI Assistant',
    'nav.adminCms': 'Admin CMS',
    'nav.directSupport': 'Direct Support',
    'nav.allInOneSaaS': 'All-in-One Cloud SaaS for Africa & Global Commerce',
    'nav.selectMarket': 'Select Your Market',
    'nav.theme': 'Theme',
    'nav.light': 'Light',
    'nav.dark': 'Dark',
    'nav.language': 'Language',
    'nav.currency': 'Currency',

    // Hero
    'hero.badge': 'MSMEBOOKS HELP & KNOWLEDGE CENTRE',
    'hero.title': "Questions? We've Got Answers.",
    'hero.subtitle': 'Everything You Need to Know About Running Your Business with MsmeBooks.',
    'hero.description': 'Explore helpful answers about accounting, point of sale, inventory, payroll, business management, integrations, industry solutions, pricing, security, and more — all in one centralized hub.',
    'hero.searchPlaceholder': 'Search questions, features, industries or topics...',
    'hero.findAnswers': 'Find Answers',
    'hero.clear': 'Clear',
    'hero.popular': 'Popular',
    'hero.verifiedIndexed': 'Indexed across verified questions & 20 industries',
    'hero.askAiPrompt': 'Prefer natural conversation? Ask AI',
    'hero.getStartedFree': 'Get Started Free',
    'hero.viewPricing': 'View Pricing',
    'hero.activeCurrency': 'Active Currency',
    'hero.metricDailyPos': 'Daily POS Volume',
    'hero.metricMonthlyTurnover': 'Avg. Monthly SME Turnover',
    'hero.metricStartingPlan': 'Starting Plan / Month',
    'hero.metricPartnerPayout': 'Top Partner Payout (40%)',

    // Category Grid
    'cat.badge': '24 Core Categories',
    'cat.title': 'Explore by Functional Domain',
    'cat.description': 'Browse verified operational guides, feature deep-dives, hardware checklists, and accounting workflows.',
    'cat.allCategories': 'All Categories',
    'cat.clearSelection': 'Clear Category Filter',
    'cat.faqsCount': 'FAQs',

    // Popular FAQs
    'popular.badge': 'Verified Top Queries',
    'popular.title': 'Most Frequently Asked Questions',
    'popular.description': 'The critical answers business founders, cashiers, and accountants consult most often.',
    'popular.exploreAll': 'Explore All Questions',

    // Explorer
    'explorer.badge': 'Interactive Knowledge Base',
    'explorer.title': 'Filter, Search & Explore All FAQs',
    'explorer.description': 'Combine keyword search, industry sectors, modules, and category tags to pinpoint immediate operational answers.',
    'explorer.filterByCategory': 'Filter by Category',
    'explorer.filterByIndustry': 'Filter by Industry',
    'explorer.filterByModule': 'Filter by Product Module',
    'explorer.sortBy': 'Sort Questions',
    'explorer.sortAll': 'Default Order',
    'explorer.sortPopular': 'Most Helpful / Popular',
    'explorer.sortRecent': 'Recently Updated',
    'explorer.resetFilters': 'Reset All Filters',
    'explorer.resultsFound': 'questions match your criteria',
    'explorer.noResultsTitle': 'No questions match your current filters',
    'explorer.noResultsDesc': 'Try clearing the search query or selecting a different category or industry.',

    // FAQ Item
    'faq.directSummary': 'Direct Summary',
    'faq.stepByStep': 'Step-by-Step Instructions',
    'faq.exploreRelated': 'Explore Related',
    'faq.lastReviewed': 'Last reviewed',
    'faq.verifiedBy': 'Verified by Operations',
    'faq.wasHelpful': 'Was this answer helpful?',
    'faq.yes': 'Yes',
    'faq.no': 'No',
    'faq.thanksHelpful': 'Thank you! Your feedback helps us refine answers.',
    'faq.thanksUnhelpful': 'Thank you for your feedback. Our team will review this.',
    'faq.copyLink': 'Copy direct link to this FAQ',
    'faq.livePlanBenchmarks': 'Live Plan Benchmarks in',
    'faq.relatedArticles': 'Related Articles',
    'faq.suggestedByTags': 'Suggested based on related links, category & tags',
    'faq.readArticle': 'Read answer',

    // Industries
    'ind.badge': '20 Vertical Sectors',
    'ind.title': 'Industry-Specific FAQ Knowledge Bases',
    'ind.description': 'From retail supermarkets and boutique hotels to community pharmacies and construction supply yards, explore sector-specific workflows.',
    'ind.filterSector': 'Filter FAQs for this industry',

    // Pricing & Revenue
    'pricing.badge': 'Live Multi-Currency Pricing',
    'pricing.title': 'Transparent Pricing in',
    'pricing.description': 'All subscription tiers, transaction limits, and operational benchmarks update automatically when you switch your active currency.',
    'pricing.monthly': 'Monthly Billing',
    'pricing.annual': 'Annual Billing',
    'pricing.save20': 'Save 20%',
    'pricing.calculatorTitle': 'Live Revenue & Turnover Savings Calculator',
    'pricing.storeTurnover': 'Monthly Store Turnover',
    'pricing.monthlySavings': 'Your Estimated Monthly Savings',
    'pricing.legacyCost': 'Legacy Software & Fee Cost',
    'pricing.msmeCost': 'MsmeBooks Consolidated',

    // Help & Footer
    'help.badge': '24/7 Multi-Channel Support',
    'help.title': 'Still Need Personalized Guidance?',
    'help.description': 'Our technical onboarding specialists and AI assistants are on standby to assist with migrations, hardware setups, and VAT configuration.',
    'help.chatWhatsapp': 'Chat on WhatsApp',
    'help.callSupport': 'Call Direct Hotline',
    'help.consultAi': 'Consult MsmeBooks AI',
    'help.emailOps': 'Email Support Desk',
    'footer.rights': 'All rights reserved. Built for enterprises across Africa and global commerce.',
    'footer.disclaimer': 'MsmeBooks complies with local tax mandates, VAT reporting, and banking-grade security standards.',

    // Connection Status & Offline Mode
    'conn.online': 'Online',
    'conn.offline': 'Offline',
    'conn.offlineMode': 'Offline Mode',
    'conn.cloudSyncActive': 'Cloud Sync Active',
    'conn.workingOffline': 'Working Offline',
    'conn.simulated': 'Demo Mode',
    'conn.simulatingOffline': 'Offline Simulation Active',
    'conn.bannerOfflineTitle': 'Operating in Offline Mode',
    'conn.bannerOfflineDesc': 'Reliable internet can be intermittent across regions. MsmeBooks is operating from local cache — all FAQ answers, search, and calculators remain fully accessible. Changes will sync once reconnected.',
    'conn.reconnect': 'Test Connection',
    'conn.reconnecting': 'Checking connection...',
    'conn.toggleSimulation': 'Simulate Offline Mode (Demo)',
    'conn.toggleOnline': 'Exit Offline Simulation',
    'conn.diagnosticsTitle': 'Network & Sync Diagnostics',
    'conn.allDataCached': 'Knowledge base and 24 categories cached locally',
    'conn.lastChecked': 'Last verified',
    'conn.connectedToCloud': 'Connected to MsmeBooks Edge Cloud',
    'conn.dismiss': 'Dismiss',
    'conn.pingLatency': 'Network Latency',

    // Live Chat Support Dialog
    'chat.liveChat': 'Live Chat',
    'chat.contactSupport': 'Contact Support Agents',
    'chat.typicallyReplies': 'Typically replies in under 2 mins',
    'chat.humanAgents': 'Human Support Specialists',
    'chat.agentsOnline': '3 Agents Online',
    'chat.talkToAgent': 'Chat with Support Team',
    'chat.tabChat': 'Live Message',
    'chat.tabChannels': 'Direct Channels',
    'chat.tabTeam': 'On-Duty Agents',
    'chat.typeMessage': 'Type your message to an agent...',
    'chat.send': 'Send',
    'chat.callDirect': 'Direct Hotline',
    'chat.whatsapp': 'WhatsApp Support',
    'chat.submitTicket': 'Create Support Ticket',
    'chat.requestCallback': 'Request Phone Callback',
    'chat.ticketSubject': 'Subject / Topic',
    'chat.ticketEmail': 'Work Email',
    'chat.ticketName': 'Your Name',
    'chat.ticketMessage': 'Describe your issue or setup request...',
    'chat.ticketSubmitted': 'Ticket Created Successfully!',
    'chat.agentTyping': 'Support specialist is typing...',
    'chat.offlineNotice': 'Operating in offline mode. Messages will be queued locally and sent upon reconnection.',
    'chat.phoneHours': 'Mon - Sat, 7:00 AM - 10:00 PM WAT',
  },

  fr: {
    // Header & Nav
    'nav.home': 'Accueil',
    'nav.products': 'Produits & Solutions',
    'nav.industries': 'Secteurs d’activité',
    'nav.features': 'Fonctionnalités',
    'nav.marketplace': 'Place de marché',
    'nav.pricing': 'Tarifs',
    'nav.partners': 'Partenaires',
    'nav.faq': 'Aide & FAQ',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.getStarted': 'Démarrer gratuitement',
    'nav.askAi': 'Assistant IA',
    'nav.adminCms': 'Gestionnaire CMS',
    'nav.directSupport': 'Support direct',
    'nav.allInOneSaaS': 'SaaS Cloud tout-en-un pour le commerce en Afrique et dans le monde',
    'nav.selectMarket': 'Sélectionnez votre marché',
    'nav.theme': 'Thème',
    'nav.light': 'Clair',
    'nav.dark': 'Sombre',
    'nav.language': 'Langue',
    'nav.currency': 'Devise',

    // Hero
    'hero.badge': 'CENTRE D’AIDE & BASE DE CONNAISSANCES MSMEBOOKS',
    'hero.title': 'Des questions ? Nous avons les réponses.',
    'hero.subtitle': 'Tout ce que vous devez savoir pour gérer votre entreprise avec MsmeBooks.',
    'hero.description': 'Explorez des réponses claires sur la comptabilité, le point de vente (POS), les stocks, la paie, les intégrations, les tarifs et la sécurité en un seul endroit.',
    'hero.searchPlaceholder': 'Rechercher des questions, fonctionnalités, secteurs...',
    'hero.findAnswers': 'Trouver des réponses',
    'hero.clear': 'Effacer',
    'hero.popular': 'Populaire',
    'hero.verifiedIndexed': 'Indexé sur des questions vérifiées & 20 secteurs',
    'hero.askAiPrompt': 'Vous préférez discuter ? Demandez à l’IA',
    'hero.getStartedFree': 'Commencer gratuitement',
    'hero.viewPricing': 'Voir les tarifs',
    'hero.activeCurrency': 'Devise active',
    'hero.metricDailyPos': 'Volume quotidien POS',
    'hero.metricMonthlyTurnover': 'Chiffre d’affaires moyen PME',
    'hero.metricStartingPlan': 'Forfait de départ / Mois',
    'hero.metricPartnerPayout': 'Commission Partenaire (40%)',

    // Category Grid
    'cat.badge': '24 Catégories Clés',
    'cat.title': 'Explorer par domaine fonctionnel',
    'cat.description': 'Consultez des guides opérationnels vérifiés, des fiches matérielles et des flux de travail comptables.',
    'cat.allCategories': 'Toutes les catégories',
    'cat.clearSelection': 'Effacer le filtre',
    'cat.faqsCount': 'FAQ',

    // Popular FAQs
    'popular.badge': 'Questions Fréquentes',
    'popular.title': 'Questions les plus consultées',
    'popular.description': 'Les réponses essentielles que les chefs d’entreprise et comptables consultent au quotidien.',
    'popular.exploreAll': 'Voir toutes les questions',

    // Explorer
    'explorer.badge': 'Base de connaissances interactive',
    'explorer.title': 'Filtrer, rechercher et explorer toutes les FAQ',
    'explorer.description': 'Combinez mots-clés, secteurs d’activité et modules pour trouver instantanément la réponse recherchée.',
    'explorer.filterByCategory': 'Filtrer par catégorie',
    'explorer.filterByIndustry': 'Filtrer par secteur',
    'explorer.filterByModule': 'Filtrer par module produit',
    'explorer.sortBy': 'Trier les questions',
    'explorer.sortAll': 'Ordre standard',
    'explorer.sortPopular': 'Plus utiles / populaires',
    'explorer.sortRecent': 'Récemment mises à jour',
    'explorer.resetFilters': 'Réinitialiser les filtres',
    'explorer.resultsFound': 'questions correspondent à vos critères',
    'explorer.noResultsTitle': 'Aucune question ne correspond à vos filtres',
    'explorer.noResultsDesc': 'Essayez d’effacer votre recherche ou de sélectionner une autre catégorie.',

    // FAQ Item
    'faq.directSummary': 'Résumé direct',
    'faq.stepByStep': 'Instructions étape par étape',
    'faq.exploreRelated': 'Ressources associées',
    'faq.lastReviewed': 'Dernière vérification',
    'faq.verifiedBy': 'Vérifié par l’équipe technique',
    'faq.wasHelpful': 'Cette réponse vous a-t-elle été utile ?',
    'faq.yes': 'Oui',
    'faq.no': 'Non',
    'faq.thanksHelpful': 'Merci ! Vos retours nous aident à améliorer nos réponses.',
    'faq.thanksUnhelpful': 'Merci pour votre retour. Notre équipe va examiner ce point.',
    'faq.copyLink': 'Copier le lien direct vers cette FAQ',
    'faq.livePlanBenchmarks': 'Tarifs en direct en',
    'faq.relatedArticles': 'Articles FAQ connexes',
    'faq.suggestedByTags': 'Suggérés selon la catégorie et les mots-clés',
    'faq.readArticle': 'Lire la réponse',

    // Industries
    'ind.badge': '20 Secteurs Verticaux',
    'ind.title': 'Bases de connaissances par secteur d’activité',
    'ind.description': 'Des supermarchés et hôtels de charme aux pharmacies et grossistes, explorez des processus sur mesure.',
    'ind.filterSector': 'Filtrer les FAQ pour ce secteur',

    // Pricing & Revenue
    'pricing.badge': 'Tarifs multi-devises en direct',
    'pricing.title': 'Tarifs transparents en',
    'pricing.description': 'Tous les forfaits, plafonds de transactions et indicateurs sont mis à jour selon votre devise active.',
    'pricing.monthly': 'Facturation mensuelle',
    'pricing.annual': 'Facturation annuelle',
    'pricing.save20': 'Économisez 20%',
    'pricing.calculatorTitle': 'Calculateur d’économies sur le chiffre d’affaires',
    'pricing.storeTurnover': 'Chiffre d’affaires mensuel de la boutique',
    'pricing.monthlySavings': 'Vos économies mensuelles estimées',
    'pricing.legacyCost': 'Coût des logiciels traditionnels',
    'pricing.msmeCost': 'Coût consolidé MsmeBooks',

    // Help & Footer
    'help.badge': 'Assistance 24/7 multi-canal',
    'help.title': 'Besoin d’une assistance personnalisée ?',
    'help.description': 'Nos spécialistes techniques et nos assistants IA sont disponibles pour vous guider lors de votre migration et configuration.',
    'help.chatWhatsapp': 'Discuter sur WhatsApp',
    'help.callSupport': 'Appeler le support direct',
    'help.consultAi': 'Consulter l’IA MsmeBooks',
    'help.emailOps': 'Envoyer un courriel',
    'footer.rights': 'Tous droits réservés. Conçu pour les entreprises africaines et mondiales.',
    'footer.disclaimer': 'MsmeBooks est conforme aux normes fiscales locales, à la TVA et aux exigences de sécurité financière.',

    // Connection Status & Offline Mode
    'conn.online': 'En ligne',
    'conn.offline': 'Hors ligne',
    'conn.offlineMode': 'Mode hors ligne',
    'conn.cloudSyncActive': 'Synchronisation cloud active',
    'conn.workingOffline': 'Fonctionnement hors ligne',
    'conn.simulated': 'Mode Démo',
    'conn.simulatingOffline': 'Simulation hors ligne active',
    'conn.bannerOfflineTitle': 'Fonctionnement en mode hors ligne',
    'conn.bannerOfflineDesc': 'La connectivité internet peut être instable selon les régions. MsmeBooks fonctionne avec le cache local : toutes les réponses FAQ, la recherche et les devises restent disponibles. Les modifications seront synchronisées dès le rétablissement de la connexion.',
    'conn.reconnect': 'Tester la connexion',
    'conn.reconnecting': 'Vérification...',
    'conn.toggleSimulation': 'Simuler le mode hors ligne (Démo)',
    'conn.toggleOnline': 'Désactiver la simulation',
    'conn.diagnosticsTitle': 'Diagnostics réseau et synchronisation',
    'conn.allDataCached': 'Base de connaissances et 24 catégories en cache local',
    'conn.lastChecked': 'Dernière vérification',
    'conn.connectedToCloud': 'Connecté au cloud MsmeBooks',
    'conn.dismiss': 'Masquer',
    'conn.pingLatency': 'Latence réseau',

    // Live Chat Support Dialog
    'chat.liveChat': 'Tchat en direct',
    'chat.contactSupport': 'Contacter nos conseillers',
    'chat.typicallyReplies': 'Répond généralement en moins de 2 min',
    'chat.humanAgents': 'Conseillers d’assistance humaine',
    'chat.agentsOnline': '3 conseillers en ligne',
    'chat.talkToAgent': 'Discuter avec l’équipe support',
    'chat.tabChat': 'Message en direct',
    'chat.tabChannels': 'Canaux directs',
    'chat.tabTeam': 'Conseillers en service',
    'chat.typeMessage': 'Écrivez votre message à un conseiller...',
    'chat.send': 'Envoyer',
    'chat.callDirect': 'Ligne directe',
    'chat.whatsapp': 'Support WhatsApp',
    'chat.submitTicket': 'Créer un ticket d’assistance',
    'chat.requestCallback': 'Demander un rappel téléphonique',
    'chat.ticketSubject': 'Objet / Sujet',
    'chat.ticketEmail': 'E-mail professionnel',
    'chat.ticketName': 'Votre nom',
    'chat.ticketMessage': 'Décrivez votre demande ou configuration...',
    'chat.ticketSubmitted': 'Ticket créé avec succès !',
    'chat.agentTyping': 'Le conseiller d’assistance rédige une réponse...',
    'chat.offlineNotice': 'Mode hors ligne actif. Les messages seront mis en file d’attente et envoyés dès la reconnexion.',
    'chat.phoneHours': 'Lun - Sam, 7h00 - 22h00 WAT',
  },

  pt: {
    // Header & Nav
    'nav.home': 'Início',
    'nav.products': 'Produtos e Soluções',
    'nav.industries': 'Setores de Atividade',
    'nav.features': 'Funcionalidades',
    'nav.marketplace': 'Mercado de Apps',
    'nav.pricing': 'Preços',
    'nav.partners': 'Parceiros',
    'nav.faq': 'Ajuda e FAQ',
    'nav.about': 'Sobre Nós',
    'nav.contact': 'Contacto',
    'nav.login': 'Entrar',
    'nav.getStarted': 'Começar Grátis',
    'nav.askAi': 'Assistente IA',
    'nav.adminCms': 'Painel CMS',
    'nav.directSupport': 'Apoio Direto',
    'nav.allInOneSaaS': 'SaaS Cloud tudo-em-um para comércio em África e no mundo',
    'nav.selectMarket': 'Selecione o seu mercado',
    'nav.theme': 'Tema',
    'nav.light': 'Claro',
    'nav.dark': 'Escuro',
    'nav.language': 'Idioma',
    'nav.currency': 'Moeda',

    // Hero
    'hero.badge': 'CENTRO DE AJUDA & BASE DE CONHECIMENTO MSMEBOOKS',
    'hero.title': 'Dúvidas? Temos as Respostas.',
    'hero.subtitle': 'Tudo o que precisa de saber para gerir o seu negócio com o MsmeBooks.',
    'hero.description': 'Explore respostas claras e verificadas sobre contabilidade, ponto de venda (POS), inventário, processamento salarial, integrações, soluções setoriais, preços e segurança numa plataforma centralizada.',
    'hero.searchPlaceholder': 'Pesquisar perguntas, funcionalidades, setores ou tópicos...',
    'hero.findAnswers': 'Encontrar Respostas',
    'hero.clear': 'Limpar',
    'hero.popular': 'Popular',
    'hero.verifiedIndexed': 'Indexado em perguntas verificadas e 20 setores de atividade',
    'hero.askAiPrompt': 'Prefere uma conversa direta? Pergunte à IA',
    'hero.getStartedFree': 'Começar Gratuitamente',
    'hero.viewPricing': 'Ver Tabela de Preços',
    'hero.activeCurrency': 'Moeda Ativa',
    'hero.metricDailyPos': 'Volume Diário de POS',
    'hero.metricMonthlyTurnover': 'Faturação Média Mensal PME',
    'hero.metricStartingPlan': 'Plano Inicial / Mês',
    'hero.metricPartnerPayout': 'Comissão Máxima de Parceiro (40%)',

    // Category Grid
    'cat.badge': '24 Categorias Principais',
    'cat.title': 'Explorar por Domínio Funcional',
    'cat.description': 'Consulte guias operacionais verificados, manuais de configuração de hardware e fluxos de contabilidade.',
    'cat.allCategories': 'Todas as Categorias',
    'cat.clearSelection': 'Limpar Filtro de Categoria',
    'cat.faqsCount': 'Perguntas',

    // Popular FAQs
    'popular.badge': 'Principais Consultas Verificadas',
    'popular.title': 'Perguntas Mais Frequentes',
    'popular.description': 'As respostas essenciais que empresários, operadores de caixa e contabilistas mais consultam diariamente.',
    'popular.exploreAll': 'Explorar Todas as Perguntas',

    // Explorer
    'explorer.badge': 'Base de Conhecimento Interativa',
    'explorer.title': 'Filtrar, Pesquisar e Explorar Todas as FAQs',
    'explorer.description': 'Combine pesquisa por palavras-chave, setores industriais, módulos e categorias para encontrar soluções imediatas.',
    'explorer.filterByCategory': 'Filtrar por Categoria',
    'explorer.filterByIndustry': 'Filtrar por Setor de Atividade',
    'explorer.filterByModule': 'Filtrar por Módulo de Produto',
    'explorer.sortBy': 'Ordenar Perguntas',
    'explorer.sortAll': 'Ordem Padrão',
    'explorer.sortPopular': 'Mais Úteis / Populares',
    'explorer.sortRecent': 'Atualizadas Recentemente',
    'explorer.resetFilters': 'Repor Todos os Filtros',
    'explorer.resultsFound': 'perguntas correspondem aos seus critérios',
    'explorer.noResultsTitle': 'Nenhuma pergunta encontrada com estes filtros',
    'explorer.noResultsDesc': 'Tente limpar a pesquisa ou selecionar outra categoria ou setor.',

    // FAQ Item
    'faq.directSummary': 'Resumo Direto',
    'faq.stepByStep': 'Instruções Passo a Passo',
    'faq.exploreRelated': 'Recursos e Páginas Relacionadas',
    'faq.lastReviewed': 'Última revisão',
    'faq.verifiedBy': 'Verificado pela Equipa de Operações',
    'faq.wasHelpful': 'Esta resposta foi útil?',
    'faq.yes': 'Sim',
    'faq.no': 'Não',
    'faq.thanksHelpful': 'Obrigado! O seu feedback ajuda-nos a aperfeiçoar as respostas.',
    'faq.thanksUnhelpful': 'Obrigado pelo seu comentário. A nossa equipa técnica irá rever este conteúdo.',
    'faq.copyLink': 'Copiar ligação direta para esta FAQ',
    'faq.livePlanBenchmarks': 'Referência de planos em tempo real em',
    'faq.relatedArticles': 'Artigos e FAQs Relacionados',
    'faq.suggestedByTags': 'Sugeridos com base na categoria e etiquetas de palavras-chave',
    'faq.readArticle': 'Ler resposta',

    // Industries
    'ind.badge': '20 Setores Verticais',
    'ind.title': 'Bases de Conhecimento Específicas por Setor',
    'ind.description': 'De supermercados e hotéis de charme a farmácias comunitárias e estaleiros de construção, conheça fluxos de trabalho à medida.',
    'ind.filterSector': 'Filtrar FAQs para este setor',

    // Pricing & Revenue
    'pricing.badge': 'Preços Dinâmicos Multimoeda',
    'pricing.title': 'Preços Transparentes em',
    'pricing.description': 'Todos os planos de subscrição, limites de transações e métricas operacionais atualizam-se automaticamente conforme a sua moeda ativa.',
    'pricing.monthly': 'Faturação Mensal',
    'pricing.annual': 'Faturação Anual',
    'pricing.save20': 'Poupe 20%',
    'pricing.calculatorTitle': 'Calculadora de Poupança e Faturação em Tempo Real',
    'pricing.storeTurnover': 'Faturação Mensal da Loja',
    'pricing.monthlySavings': 'A Sua Poupança Mensal Estimada',
    'pricing.legacyCost': 'Custo de Software Tradicional e Taxas Fragmentadas',
    'pricing.msmeCost': 'Custo Consolidado com MsmeBooks',

    // Help & Footer
    'help.badge': 'Suporte Multicanal 24/7',
    'help.title': 'Ainda Precisa de Apoio Personalizado?',
    'help.description': 'Os nossos especialistas técnicos e assistentes IA estão a postos para ajudar na migração de dados, configuração de POS e enquadramento de IVA.',
    'help.chatWhatsapp': 'Conversar no WhatsApp',
    'help.callSupport': 'Ligar para a Linha Direta',
    'help.consultAi': 'Consultar MsmeBooks IA',
    'help.emailOps': 'Enviar E-mail ao Suporte',
    'footer.rights': 'Todos os direitos reservados. Criado a pensar nas empresas em África e no mundo.',
    'footer.disclaimer': 'O MsmeBooks cumpre os requisitos fiscais locais, regras de IVA e normas de conformidade financeira internacional.',

    // Connection Status & Offline Mode
    'conn.online': 'Online',
    'conn.offline': 'Offline',
    'conn.offlineMode': 'Modo Offline',
    'conn.cloudSyncActive': 'Sincronização Cloud Ativa',
    'conn.workingOffline': 'A Trabalhar em Modo Offline',
    'conn.simulated': 'Modo de Demonstração',
    'conn.simulatingOffline': 'Simulação Offline Ativa',
    'conn.bannerOfflineTitle': 'A Funcionar em Modo Offline',
    'conn.bannerOfflineDesc': 'A conectividade à internet pode oscilar em várias regiões. O MsmeBooks opera a partir de cache local: todas as respostas de FAQ, pesquisa e calculadoras continuam operacionais. As alterações serão sincronizadas assim que a ligação for restabelecida.',
    'conn.reconnect': 'Testar Ligação',
    'conn.reconnecting': 'A verificar ligação...',
    'conn.toggleSimulation': 'Simular Modo Offline (Demo)',
    'conn.toggleOnline': 'Terminar Simulação Offline',
    'conn.diagnosticsTitle': 'Diagnóstico de Rede e Sincronização',
    'conn.allDataCached': 'Base de conhecimento e 24 categorias guardadas em cache local',
    'conn.lastChecked': 'Última verificação',
    'conn.connectedToCloud': 'Ligado à Cloud Edge do MsmeBooks',
    'conn.dismiss': 'Fechar',
    'conn.pingLatency': 'Latência de Rede',

    // Live Chat Support Dialog
    'chat.liveChat': 'Chat em Direto',
    'chat.contactSupport': 'Contactar Agentes de Apoio',
    'chat.typicallyReplies': 'Resposta habitual em menos de 2 minutos',
    'chat.humanAgents': 'Especialistas de Apoio Humano',
    'chat.agentsOnline': '3 Agentes Online',
    'chat.talkToAgent': 'Falar com a Equipa de Suporte',
    'chat.tabChat': 'Mensagem em Direto',
    'chat.tabChannels': 'Canais Diretos',
    'chat.tabTeam': 'Agentes em Turno',
    'chat.typeMessage': 'Escreva a sua mensagem para um agente...',
    'chat.send': 'Enviar',
    'chat.callDirect': 'Linha Telefónica Direta',
    'chat.whatsapp': 'Suporte por WhatsApp',
    'chat.submitTicket': 'Criar Pedido de Assistência',
    'chat.requestCallback': 'Solicitar Chamada de Retorno',
    'chat.ticketSubject': 'Assunto / Tópico',
    'chat.ticketEmail': 'E-mail de Trabalho',
    'chat.ticketName': 'O Seu Nome',
    'chat.ticketMessage': 'Descreva a sua dúvida ou pedido de configuração...',
    'chat.ticketSubmitted': 'Pedido de Assistência Criado com Sucesso!',
    'chat.agentTyping': 'O especialista de suporte está a escrever...',
    'chat.offlineNotice': 'A funcionar em modo offline. As mensagens serão guardadas localmente e enviadas assim que a rede for restabelecida.',
    'chat.phoneHours': 'Seg - Sáb, 7:00 - 22:00 WAT',
  },

  es: {
    // Header & Nav
    'nav.home': 'Inicio',
    'nav.products': 'Productos y Soluciones',
    'nav.industries': 'Industrias',
    'nav.features': 'Funcionalidades',
    'nav.marketplace': 'Mercado de Apps',
    'nav.pricing': 'Precios',
    'nav.partners': 'Socios',
    'nav.faq': 'Ayuda y Preguntas',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.getStarted': 'Comenzar Gratis',
    'nav.askAi': 'Asistente IA',
    'nav.adminCms': 'Panel CMS',
    'nav.directSupport': 'Soporte Directo',
    'nav.allInOneSaaS': 'SaaS Cloud todo en uno para el comercio en África y el mundo',
    'nav.selectMarket': 'Selecciona tu mercado',
    'nav.theme': 'Tema',
    'nav.light': 'Claro',
    'nav.dark': 'Oscuro',
    'nav.language': 'Idioma',
    'nav.currency': 'Moneda',

    // Hero
    'hero.badge': 'CENTRO DE AYUDA Y CONOCIMIENTO MSMEBOOKS',
    'hero.title': '¿Preguntas? Tenemos respuestas.',
    'hero.subtitle': 'Todo lo que necesitas saber sobre la gestión de tu negocio con MsmeBooks.',
    'hero.description': 'Descubre respuestas sobre contabilidad, punto de venta (POS), inventario, nómina, integraciones, precios y seguridad, todo en un solo lugar.',
    'hero.searchPlaceholder': 'Busca preguntas, módulos, industrias o temas...',
    'hero.findAnswers': 'Buscar Respuestas',
    'hero.clear': 'Limpiar',
    'hero.popular': 'Popular',
    'hero.verifiedIndexed': 'Indexado en preguntas verificadas y 20 industrias',
    'hero.askAiPrompt': '¿Prefieres conversar? Pregunta a la IA',
    'hero.getStartedFree': 'Empieza Gratis',
    'hero.viewPricing': 'Ver Precios',
    'hero.activeCurrency': 'Moneda Activa',
    'hero.metricDailyPos': 'Volumen Diario POS',
    'hero.metricMonthlyTurnover': 'Facturación Promedio PYME',
    'hero.metricStartingPlan': 'Plan Inicial / Mes',
    'hero.metricPartnerPayout': 'Pago a Socios (40%)',

    // Category Grid
    'cat.badge': '24 Categorías Clave',
    'cat.title': 'Explora por dominio funcional',
    'cat.description': 'Consulta guías operativas verificadas, compatibilidad de hardware y flujos contables.',
    'cat.allCategories': 'Todas las categorías',
    'cat.clearSelection': 'Quitar filtro de categoría',
    'cat.faqsCount': 'Preguntas',

    // Popular FAQs
    'popular.badge': 'Preguntas Frecuentes',
    'popular.title': 'Preguntas más consultadas',
    'popular.description': 'Las soluciones clave que empresarios, cajeros y contadores consultan a diario.',
    'popular.exploreAll': 'Explorar Todas las Preguntas',

    // Explorer
    'explorer.badge': 'Base de Conocimiento Interactiva',
    'explorer.title': 'Filtra, busca y explora todas las preguntas',
    'explorer.description': 'Combina búsqueda por palabras clave, sectores industriales y módulos para resolver cualquier duda.',
    'explorer.filterByCategory': 'Filtrar por categoría',
    'explorer.filterByIndustry': 'Filtrar por industria',
    'explorer.filterByModule': 'Filtrar por módulo',
    'explorer.sortBy': 'Ordenar preguntas',
    'explorer.sortAll': 'Orden predeterminado',
    'explorer.sortPopular': 'Más útiles / populares',
    'explorer.sortRecent': 'Actualizadas recientemente',
    'explorer.resetFilters': 'Restablecer filtros',
    'explorer.resultsFound': 'preguntas coinciden con tu búsqueda',
    'explorer.noResultsTitle': 'No se encontraron preguntas con estos filtros',
    'explorer.noResultsDesc': 'Intenta borrar la búsqueda o seleccionar otra categoría.',

    // FAQ Item
    'faq.directSummary': 'Resumen directo',
    'faq.stepByStep': 'Instrucciones paso a paso',
    'faq.exploreRelated': 'Recursos relacionados',
    'faq.lastReviewed': 'Última revisión',
    'faq.verifiedBy': 'Verificado por Operaciones',
    'faq.wasHelpful': '¿Te fue útil esta respuesta?',
    'faq.yes': 'Sí',
    'faq.no': 'No',
    'faq.thanksHelpful': '¡Gracias! Tu opinión nos ayuda a mejorar.',
    'faq.thanksUnhelpful': 'Gracias por tus comentarios. Nuestro equipo lo revisará.',
    'faq.copyLink': 'Copiar enlace directo a esta pregunta',
    'faq.livePlanBenchmarks': 'Planes de precios en vivo en',
    'faq.relatedArticles': 'Artículos FAQ relacionados',
    'faq.suggestedByTags': 'Sugeridos por categoría y etiquetas clave',
    'faq.readArticle': 'Leer respuesta',

    // Industries
    'ind.badge': '20 Sectores Verticales',
    'ind.title': 'Bases de conocimiento por industria',
    'ind.description': 'Desde supermercados y hoteles boutique hasta farmacias y almacenes, conoce procesos a medida.',
    'ind.filterSector': 'Ver preguntas de esta industria',

    // Pricing & Revenue
    'pricing.badge': 'Precios en vivo multimoneda',
    'pricing.title': 'Precios transparentes en',
    'pricing.description': 'Todos los planes y límites de transacciones se actualizan según tu moneda seleccionada.',
    'pricing.monthly': 'Facturación mensual',
    'pricing.annual': 'Facturación anual',
    'pricing.save20': 'Ahorra 20%',
    'pricing.calculatorTitle': 'Calculadora de Ahorro y Facturación',
    'pricing.storeTurnover': 'Facturación Mensual del Negocio',
    'pricing.monthlySavings': 'Tus Ahorros Mensuales Estimados',
    'pricing.legacyCost': 'Costo de sistemas tradicionales',
    'pricing.msmeCost': 'Costo integrado MsmeBooks',

    // Help & Footer
    'help.badge': 'Soporte 24/7 multicanal',
    'help.title': '¿Aún necesitas ayuda personalizada?',
    'help.description': 'Nuestros especialistas técnicos y asistentes de IA están listos para asistirte con tu migración y configuración fiscal.',
    'help.chatWhatsapp': 'Chatear por WhatsApp',
    'help.callSupport': 'Llamar al soporte directo',
    'help.consultAi': 'Consultar a la IA MsmeBooks',
    'help.emailOps': 'Enviar correo electrónico',
    'footer.rights': 'Todos los derechos reservados. Diseñado para empresas en África y el mundo.',
    'footer.disclaimer': 'MsmeBooks cumple con las normativas fiscales locales, cálculo de IVA y estándares de seguridad.',

    // Connection Status & Offline Mode
    'conn.online': 'En línea',
    'conn.offline': 'Sin conexión',
    'conn.offlineMode': 'Modo sin conexión',
    'conn.cloudSyncActive': 'Sincronización en la nube activa',
    'conn.workingOffline': 'Trabajando sin conexión',
    'conn.simulated': 'Modo Demo',
    'conn.simulatingOffline': 'Simulación sin conexión activa',
    'conn.bannerOfflineTitle': 'Operando en Modo Sin Conexión',
    'conn.bannerOfflineDesc': 'La conectividad a internet puede ser inestable en varias regiones. MsmeBooks funciona desde la memoria caché local: todas las preguntas frecuentes, la búsqueda y las monedas permanecen activas. Los cambios se sincronizarán al reconectarse.',
    'conn.reconnect': 'Comprobar conexión',
    'conn.reconnecting': 'Verificando...',
    'conn.toggleSimulation': 'Simular modo sin conexión (Demo)',
    'conn.toggleOnline': 'Salir de la simulación',
    'conn.diagnosticsTitle': 'Diagnóstico de Red y Sincronización',
    'conn.allDataCached': 'Base de conocimientos y 24 categorías en caché local',
    'conn.lastChecked': 'Última verificación',
    'conn.connectedToCloud': 'Conectado a la nube de MsmeBooks',
    'conn.dismiss': 'Cerrar',
    'conn.pingLatency': 'Latencia de red',

    // Live Chat Support Dialog
    'chat.liveChat': 'Chat en vivo',
    'chat.contactSupport': 'Contactar agentes de soporte',
    'chat.typicallyReplies': 'Responde habitualmente en menos de 2 min',
    'chat.humanAgents': 'Especialistas de soporte humano',
    'chat.agentsOnline': '3 agentes en línea',
    'chat.talkToAgent': 'Hablar con el equipo de soporte',
    'chat.tabChat': 'Mensaje en vivo',
    'chat.tabChannels': 'Canales directos',
    'chat.tabTeam': 'Agentes en turno',
    'chat.typeMessage': 'Escribe tu mensaje a un agente...',
    'chat.send': 'Enviar',
    'chat.callDirect': 'Línea directa',
    'chat.whatsapp': 'Soporte por WhatsApp',
    'chat.submitTicket': 'Crear ticket de soporte',
    'chat.requestCallback': 'Solicitar llamada telefónica',
    'chat.ticketSubject': 'Asunto / Tema',
    'chat.ticketEmail': 'Correo de trabajo',
    'chat.ticketName': 'Tu nombre',
    'chat.ticketMessage': 'Describe tu consulta o requerimiento...',
    'chat.ticketSubmitted': '¡Ticket creado exitosamente!',
    'chat.agentTyping': 'El agente de soporte está escribiendo...',
    'chat.offlineNotice': 'Modo sin conexión activo. Los mensajes se guardarán localmente y se enviarán al reconectarte.',
    'chat.phoneHours': 'Lun - Sáb, 7:00 AM - 10:00 PM WAT',
  },

  ar: {
    // Header & Nav
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات والحلول',
    'nav.industries': 'القطاعات',
    'nav.features': 'المميزات',
    'nav.marketplace': 'سوق التطبيقات',
    'nav.pricing': 'الأسعار',
    'nav.partners': 'الشركاء',
    'nav.faq': 'المساعدة والأسئلة الشائعة',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.getStarted': 'ابدأ مجاناً',
    'nav.askAi': 'المساعد الذكي (AI)',
    'nav.adminCms': 'لوحة الإدارة',
    'nav.directSupport': 'الدعم المباشر',
    'nav.allInOneSaaS': 'منظومة سحابية متكاملة للشركات في إفريقيا والعالم',
    'nav.selectMarket': 'اختر سوقك المحلي',
    'nav.theme': 'المظهر',
    'nav.light': 'فاتح',
    'nav.dark': 'داكن',
    'nav.language': 'اللغة',
    'nav.currency': 'العملة',

    // Hero
    'hero.badge': 'مركز مساعدة ومعرفة MSMEBOOKS',
    'hero.title': 'لديك أسئلة؟ لدينا جميع الإجابات.',
    'hero.subtitle': 'كل ما تحتاج لمعرفته حول إدارة أعمالك بنجاح مع MsmeBooks.',
    'hero.description': 'اكتشف إجابات شاملة وموثوقة حول المحاسبة، نقاط البيع (POS)، المخزون، الرواتب، خطط الأسعار والأمان في منصة واحدة متكاملة.',
    'hero.searchPlaceholder': 'ابحث في الأسئلة، المميزات، القطاعات أو الموضوعات...',
    'hero.findAnswers': 'البحث عن إجابات',
    'hero.clear': 'مسح',
    'hero.popular': 'الأكثر شيوعاً',
    'hero.verifiedIndexed': 'مفهرس عبر أسئلة موثقة و20 قطاعاً تجارياً',
    'hero.askAiPrompt': 'تفضل المحادثة المباشرة؟ اسأل الذكاء الاصطناعي',
    'hero.getStartedFree': 'ابدأ التجربة المجانية',
    'hero.viewPricing': 'عرض خطط الأسعار',
    'hero.activeCurrency': 'العملة النشطة',
    'hero.metricDailyPos': 'حجم المعاملات اليومي لنقاط البيع',
    'hero.metricMonthlyTurnover': 'متوسط إيرادات الشركات شهرياً',
    'hero.metricStartingPlan': 'الباقة الأساسية / شهرياً',
    'hero.metricPartnerPayout': 'عمولة الشركاء (40%)',

    // Category Grid
    'cat.badge': '24 فئة أساسية',
    'cat.title': 'استكشف حسب المجال الوظيفي',
    'cat.description': 'تصفح الإرشادات المعتمدة، وتكامل الأجهزة، وإجراءات المحاسبة المتقدمة.',
    'cat.allCategories': 'جميع الفئات',
    'cat.clearSelection': 'إلغاء تحديد الفئة',
    'cat.faqsCount': 'سؤال وجواب',

    // Popular FAQs
    'popular.badge': 'أهم الاستفسارات الموثقة',
    'popular.title': 'الأسئلة الأكثر تداولاً واستخداماً',
    'popular.description': 'الحلول والإجابات التي يعتمد عليها رواد الأعمال والمحاسبون يومياً.',
    'popular.exploreAll': 'استكشاف جميع الأسئلة',

    // Explorer
    'explorer.badge': 'قاعدة المعرفة التفاعلية',
    'explorer.title': 'تصفية وبحث في جميع الأسئلة الشائعة',
    'explorer.description': 'اجمع بين البحث بالكلمات المفتاحية، وتصنيفات القطاعات والموديلات للوصول لإجابة فورية.',
    'explorer.filterByCategory': 'تصفية حسب الفئة',
    'explorer.filterByIndustry': 'تصفية حسب القطاع',
    'explorer.filterByModule': 'تصفية حسب الوحدة البرمجية',
    'explorer.sortBy': 'ترتيب الأسئلة',
    'explorer.sortAll': 'الترتيب الافتراضي',
    'explorer.sortPopular': 'الأكثر إفادة وشهرة',
    'explorer.sortRecent': 'المحدثة مؤخراً',
    'explorer.resetFilters': 'إعادة ضبط الفلاتر',
    'explorer.resultsFound': 'أسئلة تطابق معايير بحثك',
    'explorer.noResultsTitle': 'لم يتم العثور على أسئلة تطابق بحثك',
    'explorer.noResultsDesc': 'جرب تغيير كلمات البحث أو اختيار فئة أو قطاع مختلف.',

    // FAQ Item
    'faq.directSummary': 'ملخص مباشر',
    'faq.stepByStep': 'خطوات التنفيذ بالتفصيل',
    'faq.exploreRelated': 'موضوعات ذات صلة',
    'faq.lastReviewed': 'آخر مراجعة',
    'faq.verifiedBy': 'تم التحقق من الفريق الفني',
    'faq.wasHelpful': 'هل كانت هذه الإجابة مفيدة لك؟',
    'faq.yes': 'نعم',
    'faq.no': 'لا',
    'faq.thanksHelpful': 'شكراً لك! ملاحظاتك تساعدنا في تحسين المحتوى.',
    'faq.thanksUnhelpful': 'شكراً على ملاحظاتك. سيقوم فريقنا بمراجعة هذا الموضوع.',
    'faq.copyLink': 'نسخ الرابط المباشر لهذا السؤال',
    'faq.livePlanBenchmarks': 'مؤشرات الأسعار الحية بعملة',
    'faq.relatedArticles': 'مقالات وأسئلة ذات صلة',
    'faq.suggestedByTags': 'مقترحة بناءً على الفئة والكلمات الدلالية',
    'faq.readArticle': 'قراءة الإجابة',

    // Industries
    'ind.badge': '20 قطاعاً تخصصياً',
    'ind.title': 'قواعد المعرفة المخصصة للقطاعات',
    'ind.description': 'من المتاجر والفنادق إلى الصيدليات ومستودعات التوزيع، استكشف حلولاً مخصصة لنشاطك.',
    'ind.filterSector': 'عرض أسئلة هذا القطاع',

    // Pricing & Revenue
    'pricing.badge': 'أسعار حية متعددة العملات',
    'pricing.title': 'أسعار شفافة بعملة',
    'pricing.description': 'تتحدث جميع الباقات وحدود العمليات تلقائياً حسب عملتك المختارة وبدون رسوم صرف خفية.',
    'pricing.monthly': 'الدفع الشهري',
    'pricing.annual': 'الدفع السنوي',
    'pricing.save20': 'خصم 20%',
    'pricing.calculatorTitle': 'حاسبة توفير الإيرادات والعمليات الحية',
    'pricing.storeTurnover': 'حجم المبيعات الشهري للمتجر',
    'pricing.monthlySavings': 'قيمة التوفير الشهري التقديرية',
    'pricing.legacyCost': 'تكلفة الأنظمة التقليدية المنفصلة',
    'pricing.msmeCost': 'تكلفة منظومة MsmeBooks الموحدة',

    // Help & Footer
    'help.badge': 'دعم فني متعدد القنوات 24/7',
    'help.title': 'هل لا تزال بحاجة إلى مساعدة شخصية؟',
    'help.description': 'فريق الدعم المتخصص ومساعدونا الأذكياء جاهزون لمساعدتك في الترحيل، وتجهيز نقاط البيع، والإعدادات الضريبية.',
    'help.chatWhatsapp': 'محادثة عبر واتساب',
    'help.callSupport': 'الاتصال بالخط الساخن',
    'help.consultAi': 'استشارة الذكاء الاصطناعي',
    'help.emailOps': 'مراسلة مكتب الدعم',
    'footer.rights': 'جميع الحقوق محفوظة. صُمم لدعم الشركات في إفريقيا والعالم.',
    'footer.disclaimer': 'تلتزم MsmeBooks بالمعايير الضريبية المحلية والفوترة الإلكترونية وأنظمة الأمان المصرفية العالمية.',

    // Connection Status & Offline Mode
    'conn.online': 'متصل',
    'conn.offline': 'غير متصل',
    'conn.offlineMode': 'وضع دون اتصال',
    'conn.cloudSyncActive': 'المزامنة السحابية نشطة',
    'conn.workingOffline': 'العمل دون اتصال بالإنترنت',
    'conn.simulated': 'وضع تجريبي',
    'conn.simulatingOffline': 'محاكاة وضع دون اتصال نشطة',
    'conn.bannerOfflineTitle': 'التطبيق يعمل في وضع عدم الاتصال',
    'conn.bannerOfflineDesc': 'نظراً لأن الاتصال بالإنترنت قد يكون متقطعاً في بعض المناطق، يعمل MsmeBooks من التخزين المؤقت المحلي. تظل جميع إجابات الأسئلة والبحث وتحويل العملات متاحة بالكامل.',
    'conn.reconnect': 'فحص الاتصال',
    'conn.reconnecting': 'جارٍ فحص الاتصال...',
    'conn.toggleSimulation': 'محاكاة وضع عدم الاتصال (عرض تجريبي)',
    'conn.toggleOnline': 'إنهاء وضع المحاكاة',
    'conn.diagnosticsTitle': 'تشخيص الشبكة والمزامنة السحابية',
    'conn.allDataCached': 'قاعدة المعرفة و24 تصنيفاً محفوظة في التخزين المحلي',
    'conn.lastChecked': 'آخر فحص',
    'conn.connectedToCloud': 'متصل بشبكة MsmeBooks السحابية',
    'conn.dismiss': 'إغلاق',
    'conn.pingLatency': 'زمن استجابة الشبكة',

    // Live Chat Support Dialog
    'chat.liveChat': 'المحادثة المباشرة',
    'chat.contactSupport': 'التواصل مع موظفي الدعم',
    'chat.typicallyReplies': 'الرد عادة خلال أقل من دقيقتين',
    'chat.humanAgents': 'خبراء دعم فني بشري',
    'chat.agentsOnline': '3 موظفين متصلين الآن',
    'chat.talkToAgent': 'تحدث مع فريق الدعم المتخصص',
    'chat.tabChat': 'محادثة فورية',
    'chat.tabChannels': 'قنوات التواصل المباشرة',
    'chat.tabTeam': 'الموظفون في الخدمة',
    'chat.typeMessage': 'اكتب رسالتك لأحد موظفي الدعم...',
    'chat.send': 'إرسال',
    'chat.callDirect': 'الخط الساخن المباشر',
    'chat.whatsapp': 'دعم عبر واتساب',
    'chat.submitTicket': 'إنشاء تذكرة دعم فني',
    'chat.requestCallback': 'طلب معاودة اتصال هاتفي',
    'chat.ticketSubject': 'الموضوع / الاستفسار',
    'chat.ticketEmail': 'البريد الإلكتروني للعمل',
    'chat.ticketName': 'الاسم الكامل',
    'chat.ticketMessage': 'يرجى توضيح استفسارك أو طلب التثبيت...',
    'chat.ticketSubmitted': 'تم إرسال تذكرة الدعم بنجاح!',
    'chat.agentTyping': 'موظف الدعم يكتب رداً الآن...',
    'chat.offlineNotice': 'أنت في وضع عدم الاتصال حالياً. سيتم حفظ الرسائل محلياً وإرسالها فور عودة الاتصال.',
    'chat.phoneHours': 'الإثنين - السبت، 7:00 ص - 10:00 م بتوقيت غرب إفريقيا',
  }
};

interface I18nContextValue {
  locale: SupportedLocale;
  languageInfo: LanguageInfo;
  languages: LanguageInfo[];
  setLocale: (l: SupportedLocale) => void;
  t: (key: string, defaultText?: string) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  translateFaq: (faq: FaqItemData) => FaqItemData;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'msmebooks_locale_v1';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['en', 'fr', 'pt', 'es', 'ar'].includes(stored)) {
        return stored as SupportedLocale;
      }
      // Check browser language
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      if (['en', 'fr', 'pt', 'es', 'ar'].includes(navLang)) {
        return navLang as SupportedLocale;
      }
    } catch (e) {
      // fallback
    }
    return 'en';
  });

  const languageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === locale) || SUPPORTED_LANGUAGES[0];
  }, [locale]);

  const dir = languageInfo.dir;
  const isRTL = dir === 'rtl';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
      if (isRTL) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    } catch (e) {
      // ignore
    }
  }, [locale, dir, isRTL]);

  const setLocale = (l: SupportedLocale) => {
    if (['en', 'fr', 'pt', 'es', 'ar'].includes(l)) {
      setLocaleState(l);
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const table = UI_TRANSLATIONS[locale];
    if (table && table[key]) {
      return table[key];
    }
    const fallback = UI_TRANSLATIONS['en'][key];
    return fallback || defaultText || key;
  };

  // Localizes a given FAQ dynamically based on the active locale
  const translateFaq = (faq: FaqItemData): FaqItemData => {
    if (locale === 'en') {
      return faq;
    }

    // 1. Check embedded translations on the FAQ object
    const embedded = faq.translations?.[locale];
    if (embedded && (embedded.question || embedded.shortAnswer)) {
      return {
        ...faq,
        question: embedded.question || faq.question,
        shortAnswer: embedded.shortAnswer || faq.shortAnswer,
        detailedAnswer: embedded.detailedAnswer || faq.detailedAnswer,
        steps: embedded.steps || faq.steps,
      };
    }

    // 2. Check translation registry in FAQ_TRANSLATIONS
    const registered = FAQ_TRANSLATIONS[faq.id]?.[locale];
    if (registered && (registered.question || registered.shortAnswer)) {
      return {
        ...faq,
        question: registered.question || faq.question,
        shortAnswer: registered.shortAnswer || faq.shortAnswer,
        detailedAnswer: registered.detailedAnswer || faq.detailedAnswer,
        steps: registered.steps || faq.steps,
      };
    }

    return faq;
  };

  const value = {
    locale,
    languageInfo,
    languages: SUPPORTED_LANGUAGES,
    setLocale,
    t,
    dir,
    isRTL,
    translateFaq,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
