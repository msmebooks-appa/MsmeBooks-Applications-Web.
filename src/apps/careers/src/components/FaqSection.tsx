import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Users,
  Building2,
  Sparkles,
  Search,
  ArrowRight,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types/language';

interface FaqItem {
  q: string;
  a: string;
  category: string;
  badge?: string;
}

interface FaqSectionProps {
  onOpenPartnerModal?: (role?: 'employer' | 'candidate') => void;
  onOpenPostJob?: () => void;
}

type RecruiterCategory = 'all' | 'posting_limits' | 'applicant_management' | 'partnership_models' | 'payroll_integration';

interface FaqLocaleBundle {
  ui: {
    kicker: string;
    heading: string;
    subtitle: string;
    tabCandidates: string;
    tabEmployers: string;
    newBadge: string;
    hubTitle: string;
    hubBadge: string;
    hubDesc: string;
    partnerWithUs: string;
    postVacancy: string;
    filterBy: string;
    allTopics: string;
    catPostingLimits: string;
    catApplicantManagement: string;
    catPartnershipModels: string;
    catPayrollSync: string;
    searchPlaceholderCandidates: string;
    searchPlaceholderEmployers: string;
    clear: string;
    noMatchesTitle: string;
    noMatchesSubtitle: string;
    resetFilters: string;
    bottomBannerText: string;
    joinPartnerNetwork: string;
    speakSpecialist: string;
  };
  candidateFaqs: FaqItem[];
  employerFaqs: FaqItem[];
}

const FAQ_TRANSLATIONS: Record<LanguageCode, FaqLocaleBundle> = {
  en: {
    ui: {
      kicker: 'Help & FAQ Center',
      heading: 'Frequently Asked Questions',
      subtitle:
        'Everything candidates, partner companies, and recruiting agencies need to know about the MsmeBooks Talent & Recruitment ecosystem.',
      tabCandidates: 'For Candidates & Job Seekers',
      tabEmployers: 'For Recruiters & Employers',
      newBadge: 'New',
      hubTitle: 'Recruiter & Employer Operations Hub',
      hubBadge: 'Open Platform',
      hubDesc:
        'MsmeBooks is an open talent marketplace. Discover answers regarding job posting limits, applicant management (ATS), AI resume screening, and our multi-tier partnership models.',
      partnerWithUs: 'Partner With Us',
      postVacancy: 'Post a Vacancy',
      filterBy: 'Filter by:',
      allTopics: 'All Topics',
      catPostingLimits: 'Job Posting Limits',
      catApplicantManagement: 'Applicant Management (ATS)',
      catPartnershipModels: 'Partnership Models',
      catPayrollSync: 'Payroll & HR Sync',
      searchPlaceholderCandidates: 'Search candidate questions (e.g. resume, remote, interview)...',
      searchPlaceholderEmployers: 'Search recruiter & employer questions (e.g. limits, ATS, commission, pricing)...',
      clear: 'Clear',
      noMatchesTitle: 'No questions matched your search.',
      noMatchesSubtitle: 'Try searching with a different term or reset your category filter.',
      resetFilters: 'Reset filters',
      bottomBannerText:
        'Have a custom requirement, high-volume recruitment need, or enterprise ERP integration question?',
      joinPartnerNetwork: 'Join Partner Network',
      speakSpecialist: 'Speak to our Talent Solutions Specialist',
    },
    candidateFaqs: [
      {
        q: 'How do I apply for a job on MsmeBooks?',
        a: 'Browse all open vacancies on this portal, filter by your preferred role, location, department, or company, and click "Apply Now". Complete the 3-step application form, upload your CV (PDF or DOCX), and take advantage of our AI Resume Parser to automatically extract your contact info, experience, and skills. You will instantly receive a unique reference code confirming your submission.',
        category: 'applying',
        badge: 'Application Guide',
      },
      {
        q: 'Are all jobs on this board for MsmeBooks internal positions?',
        a: 'No. While MsmeBooks lists its own internal software, finance, and operations vacancies, this portal is also an open Pan-African recruitment platform utilized by verified companies, MSMEs, startups, and recruiting partners who use our Recruitment and Talent Acquisition Add-on Modules to find world-class African talent.',
        category: 'general',
      },
      {
        q: 'How does the AI Career Advisor work?',
        a: 'Our AI Career Advisor (powered by Gemini AI) evaluates your skills, experience level, salary targets, preferred work arrangement (Remote/Hybrid/Onsite), and target industry against all active listings. It highlights matching percentages, explains why roles suit you, detects skill gaps to bridge, and lets you filter the board with 1 click.',
        category: 'ai_tools',
      },
      {
        q: 'Can I apply for multiple positions at different companies?',
        a: 'Yes, you may submit applications for multiple roles across different hiring companies and departments. However, we recommend tailoring your applications to the positions where your strengths, portfolio, and skills are most directly relevant.',
        category: 'applying',
      },
      {
        q: 'Does MsmeBooks offer remote opportunities across Africa?',
        a: 'Yes! A substantial portion of engineering, data, accounting, customer success, and sales positions are 100% remote. Roles are open to professionals across Nigeria, Kenya, Rwanda, Ghana, South Africa, Uganda, Egypt, and globally across the African diaspora.',
        category: 'remote',
      },
      {
        q: 'Can students and entry-level talent apply?',
        a: 'Absolutely. We and our partner companies frequently run Internship and Graduate Trainee programs designed specifically for recent graduates and self-taught professionals in software engineering, accounting, economics, and product design.',
        category: 'general',
      },
      {
        q: 'How can I track my application status?',
        a: 'Upon submission, you receive a unique Application Reference Code (e.g. MSME-APP-2026-XXXX). Recruiter review statuses (Screening, Interviewing, Offered) are tracked, and automated notifications are sent to your registered email at every pipeline milestone.',
        category: 'tracking',
      },
      {
        q: 'How is my data and CV protected?',
        a: 'We comply with the Nigeria Data Protection Act (NDPA), Kenya Data Protection Act, and international privacy standards. Candidate documents are encrypted, stored in isolated recruiter repositories, and never sold to third parties.',
        category: 'privacy',
      },
    ],
    employerFaqs: [
      {
        q: 'What are the job posting limits for employers, startups, and individual recruiters?',
        a: 'MsmeBooks provides flexible tiered posting tiers tailored to your organization size:\n• Free Community Tier: Allows verified businesses and individuals to post up to 3 active jobs concurrently at zero cost, perfect for startups making their first key hires.\n• Growth Plan (Talent Add-on): Up to 25 active concurrent job listings with automated weekly refreshing, custom branding, and featured placement on our Pan-African homepage.\n• Enterprise & Agency Partner Tier: Unlimited active postings across multiple client companies or subsidiaries, multi-channel syndication (LinkedIn, regional job boards), and dedicated priority indexing.',
        category: 'posting_limits',
        badge: 'Posting Limits',
      },
      {
        q: 'How long do posted jobs remain active, and can listings be edited or renewed?',
        a: 'By default, standard listings remain live for 30 calendar days, while Growth and Enterprise listings remain active for 60 days. You have full control from your recruiter dashboard to pause, edit specifications, adjust salary bands, or renew expiring listings with a single click without losing existing applicant histories or screening notes.',
        category: 'posting_limits',
        badge: 'Posting Limits',
      },
      {
        q: 'How does applicant tracking and pipeline management (ATS) work on MsmeBooks?',
        a: 'Our built-in Applicant Tracking System provides end-to-end pipeline visibility for every opening:\n• Visual Pipeline Stages: Seamlessly progress candidates through Applied -> Screening -> Technical Assessment -> Team Interview -> Offer Stage -> Hired or Archived.\n• Real-Time Candidate Profiles: View complete application submissions, AI match scores, extracted skills, and downloadable resumes.\n• Team Collaboration & Notes: Leave private internal evaluation notes, assign candidate star ratings, and record interview debriefs visible only to your hiring team.\n• Automated Candidate Notifications: Send bulk or individualized status emails with one click to keep applicants informed and maintain an exceptional employer brand.\n• CSV/Excel Export: Export applicant dossiers and screening metrics for stakeholder reporting.',
        category: 'applicant_management',
        badge: 'Applicant Management',
      },
      {
        q: 'How does the AI Resume Parsing and Candidate Screening utility work?',
        a: 'Every time a candidate submits a PDF or DOCX resume, our multimodal Gemini AI engine parses the document in under two seconds. It automatically extracts contact details, verified email and phone numbers, total years of relevant experience, current job title, and technical/functional skill sets. The engine matches candidate qualifications directly against your job requirements and assigns an objective percentage match score, cutting your manual resume triage time by over 75%.',
        category: 'applicant_management',
        badge: 'Applicant Management',
      },
      {
        q: 'Can external recruitment agencies collaborate with client internal HR teams?',
        a: 'Yes. The MsmeBooks Talent Suite supports granular Role-Based Access Control (RBAC). Staffing agencies and independent recruiters can be assigned recruiter contributor seats for specific client requisitions. Agencies can upload shortlisted candidates and track pipeline milestones while confidential company financials, compensation bands, and other internal requisitions remain strictly restricted.',
        category: 'applicant_management',
        badge: 'Applicant Management',
      },
      {
        q: 'What partnership models does MsmeBooks offer to companies and recruiters?',
        a: 'We offer four distinct partnership pathways designed for various market participants:\n1. Direct Employer SaaS: For growing companies adopting the MsmeBooks Talent Acquisition Module alongside our ERP & Payroll software for automated hire-to-onboard management.\n2. Certified Recruiter & Agency Partner: For independent headhunters and staffing agencies seeking a high-performance ATS, client management portal, and revenue-sharing placement opportunities.\n3. Talent Scout & Referral Partner: For community leaders, tech hubs, and individuals who refer vetted senior engineers, accountants, and executives to active requisitions, earning up to 15% placement bounties.\n4. Co-Branded Enterprise Talent Hubs: Custom-branded recruitment portals with custom domains, tailored application screening rubrics, and direct API webhooks into existing HR systems.',
        category: 'partnership_models',
        badge: 'Partnership Models',
      },
      {
        q: 'What are the commercial terms and pricing models for partner recruiters?',
        a: 'Certified recruitment partners can choose between flexible subscription plans or performance-based models. Subscription plans start with flat monthly or annual fees covering unlimited candidates, ATS seats, and AI parsing quotas. Performance partners operate on a pre-agreed placement success fee (typically 10%-18% of first-year gross base), backed by a 90-day candidate guarantee and automated escrow billing via MsmeBooks Pay.',
        category: 'partnership_models',
        badge: 'Partnership Models',
      },
      {
        q: 'How does the Talent Acquisition module integrate with MsmeBooks Accounting & Payroll?',
        a: 'This is MsmeBooks\' flagship advantage! Once an applicant is marked as "Hired" in the ATS, you can convert them into an active employee profile with a single click. Their agreed compensation package, bank details, residency, tax identification number, and pension contributions automatically flow into the MsmeBooks Payroll engine, eliminating manual data re-entry and administrative payroll bottlenecks.',
        category: 'payroll_integration',
        badge: 'Payroll Integration',
      },
      {
        q: 'How does MsmeBooks ensure candidate data privacy and regulatory compliance?',
        a: 'We strictly comply with the Nigeria Data Protection Act (NDPA), Kenya Data Protection Act, South Africa POPIA, and GDPR. Candidate information is stored in encrypted, tenant-isolated cloud databases. Candidate data submitted to one hiring company is strictly segregated and cannot be harvested by competing recruiters or unauthorized third parties.',
        category: 'partnership_models',
        badge: 'Compliance & Privacy',
      },
      {
        q: 'How do we sign up as a partner or activate the Recruiter Module?',
        a: 'You can get started immediately by clicking the "Partner With Us" button on this portal. Simply select your organization type (Employer, Recruiter/Agency, or Talent Scout), submit your company details, and choose your preferred tier. Our team provisions your workspace within minutes, and our onboarding team offers free live migration assistance from legacy spreadsheets or ATS platforms.',
        category: 'partnership_models',
        badge: 'Getting Started',
      },
    ],
  },
  fr: {
    ui: {
      kicker: 'Centre d\'aide & FAQ',
      heading: 'Foire aux questions',
      subtitle:
        'Tout ce que les candidats, entreprises partenaires et cabinets de recrutement doivent savoir sur l\'écosystème MsmeBooks Talent.',
      tabCandidates: 'Pour les Candidats',
      tabEmployers: 'Pour les Recruteurs & Employeurs',
      newBadge: 'Nouveau',
      hubTitle: 'Hub Opérations Recruteurs & Employeurs',
      hubBadge: 'Plateforme Ouverte',
      hubDesc:
        'MsmeBooks est une place de marché de talents ouverte. Trouvez des réponses sur les limites de publication, l\'ATS, le tri de CV par IA et nos modèles de partenariat.',
      partnerWithUs: 'Devenir Partenaire',
      postVacancy: 'Publier une Offre',
      filterBy: 'Filtrer par :',
      allTopics: 'Tous les sujets',
      catPostingLimits: 'Limites de publication',
      catApplicantManagement: 'Gestion des candidatures (ATS)',
      catPartnershipModels: 'Modèles de partenariat',
      catPayrollSync: 'Synchro Paie & RH',
      searchPlaceholderCandidates: 'Rechercher une question candidat (ex: CV, télétravail, entretien)...',
      searchPlaceholderEmployers: 'Rechercher une question recruteur (ex: limites, ATS, tarifs)...',
      clear: 'Effacer',
      noMatchesTitle: 'Aucune question ne correspond à votre recherche.',
      noMatchesSubtitle: 'Essayez avec un autre terme ou réinitialisez le filtre de catégorie.',
      resetFilters: 'Réinitialiser les filtres',
      bottomBannerText:
        'Un besoin spécifique, un recrutement à fort volume ou une question d\'intégration ERP ?',
      joinPartnerNetwork: 'Rejoindre le réseau partenaire',
      speakSpecialist: 'Parler à un spécialiste Solutions Talents',
    },
    candidateFaqs: [
      {
        q: 'Comment postuler à une offre sur MsmeBooks ?',
        a: 'Parcourez les postes ouverts, filtrez par métier, pays ou entreprise et cliquez sur « Postuler ». Remplissez le formulaire en 3 étapes, importez votre CV (PDF ou DOCX) et laissez notre analyseur IA extraire automatiquement vos coordonnées, expériences et compétences. Vous recevrez immédiatement un code de suivi unique.',
        category: 'applying',
        badge: 'Guide Candidat',
      },
      {
        q: 'Toutes les offres concernent-elles uniquement MsmeBooks en interne ?',
        a: 'Non. MsmeBooks publie ses propres postes en ingénierie, finance et opérations, mais le portail est aussi une plateforme panafricaine utilisée par des entreprises vérifiées, des PME et des cabinets partenaires via notre module de recrutement.',
        category: 'general',
      },
      {
        q: 'Comment fonctionne le Conseiller Carrière IA ?',
        a: 'Propulsé par Gemini AI, notre conseiller analyse vos compétences, votre niveau d\'expérience, vos attentes salariales et votre mode de travail préféré par rapport à toutes les offres actives. Il calcule votre taux de compatibilité et identifie les compétences à renforcer.',
        category: 'ai_tools',
      },
      {
        q: 'Puis-je postuler à plusieurs postes dans différentes entreprises ?',
        a: 'Oui, vous pouvez soumettre votre candidature à plusieurs offres au sein de différentes entreprises partenaires. Nous vous conseillons toutefois de cibler les postes correspondant le mieux à votre profil et à vos réalisations.',
        category: 'applying',
      },
      {
        q: 'MsmeBooks propose-t-il des postes en télétravail à travers l\'Afrique ?',
        a: 'Oui ! Une grande partie des postes en développement logiciel, données, comptabilité et réussite client sont 100 % à distance et ouverts aux professionnels au Nigeria, au Kenya, au Rwanda, au Ghana, en Afrique du Sud et dans la diaspora.',
        category: 'remote',
      },
      {
        q: 'Les étudiants et profils juniors peuvent-ils postuler ?',
        a: 'Tout à fait. Nous et nos entreprises partenaires proposons régulièrement des programmes de stages et de jeunes diplômés dans la tech, la comptabilité, l\'économie et le design produit.',
        category: 'general',
      },
      {
        q: 'Comment suivre l\'avancement de ma candidature ?',
        a: 'Un code de référence unique (ex. MSME-APP-2026-XXXX) vous est attribué dès l\'envoi. Vous pouvez suivre chaque étape depuis votre espace candidat et recevoir des notifications automatiques par e-mail.',
        category: 'tracking',
      },
      {
        q: 'Comment mes données et mon CV sont-ils protégés ?',
        a: 'Nous respectons les lois africaines sur la protection des données (NDPA, Kenya DPA, POPIA) ainsi que le RGPD. Vos documents sont chiffrés, cloisonnés par recruteur et ne sont jamais vendus à des tiers.',
        category: 'privacy',
      },
    ],
    employerFaqs: [
      {
        q: 'Quelles sont les limites d\'offres d\'emploi pour les employeurs et recruteurs ?',
        a: 'MsmeBooks propose trois formules adaptées à votre taille :\n• Offre Communautaire Gratuite : jusqu\'à 3 annonces actives simultanément sans frais.\n• Plan Croissance : jusqu\'à 25 annonces actives avec actualisation hebdomadaire et mise en avant panafricaine.\n• Plan Entreprise & Agence : offres illimitées multi-clients, multidiffusion et indexation prioritaire.',
        category: 'posting_limits',
        badge: 'Limites de publication',
      },
      {
        q: 'Combien de temps les offres restent-elles en ligne et sont-elles modifiables ?',
        a: 'Les annonces standard restent actives 30 jours calendaires (60 jours pour Croissance et Entreprise). Vous pouvez mettre en pause, modifier le salaire ou renouveler une offre en un clic depuis votre tableau de bord sans perdre vos candidatures existantes.',
        category: 'posting_limits',
        badge: 'Limites de publication',
      },
      {
        q: 'Comment fonctionne le suivi des candidatures (ATS) sur MsmeBooks ?',
        a: 'Notre ATS intégré offre une visibilité complète :\n• Pipeline visuel : Candidature -> Présélection -> Test technique -> Entretien -> Offre -> Embauché.\n• Dossiers enrichis : Scores de compatibilité IA, compétences extraites et lecture PDF.\n• Collaboration équipe : Notes privées, évaluations par étoiles et exports CSV/Excel.',
        category: 'applicant_management',
        badge: 'Gestion ATS',
      },
      {
        q: 'Comment fonctionne l\'analyse de CV par IA et le filtrage ?',
        a: 'À chaque candidature PDF ou DOCX, notre moteur Gemini AI extrait en moins de deux secondes les coordonnées, années d\'expérience, poste actuel et compétences clés, puis calcule un score d\'adéquation objectif réduisant de plus de 75 % le tri manuel.',
        category: 'applicant_management',
        badge: 'Gestion ATS',
      },
      {
        q: 'Les cabinets externes peuvent-ils collaborer avec les équipes RH internes ?',
        a: 'Oui. Le contrôle d\'accès par rôle (RBAC) permet d\'attribuer aux agences des accès dédiés à des postes précis tout en préservant la confidentialité des données financières internes.',
        category: 'applicant_management',
        badge: 'Gestion ATS',
      },
      {
        q: 'Quels modèles de partenariat propose MsmeBooks ?',
        a: 'Nous proposons quatre parcours :\n1. SaaS Employeur Direct (ATS + Paie).\n2. Agence & Chasseur de têtes certifié.\n3. Programme Talent Scout & Recommandation (primes jusqu\'à 15 %).\n4. Portails Entreprise en marque blanche avec webhooks API.',
        category: 'partnership_models',
        badge: 'Partenariats',
      },
      {
        q: 'Quelles sont les conditions commerciales pour les recruteurs partenaires ?',
        a: 'Choisissez entre un abonnement mensuel/annuel fixe avec candidats illimités ou une commission au succès (10 % à 18 % du brut annuel) assortie d\'une garantie de 90 jours et d\'un séquestre automatisé via MsmeBooks Pay.',
        category: 'partnership_models',
        badge: 'Partenariats',
      },
      {
        q: 'Comment le module Recrutement s\'intègre-t-il à la Comptabilité et la Paie MsmeBooks ?',
        a: 'Dès qu\'un candidat passe au statut « Embauché », convertissez-le en employé actif en un clic. Salaire, RIB, résidence fiscale et cotisations sociales sont transférés automatiquement vers le moteur de paie MsmeBooks.',
        category: 'payroll_integration',
        badge: 'Intégration Paie',
      },
      {
        q: 'Comment garantissez-vous la confidentialité des données et la conformité ?',
        a: 'Nous appliquons les standards NDPA, POPIA et RGPD avec bases cloisonnées par locataire et chiffrement de bout en bout. Aucune donnée candidat n\'est partagée entre entreprises concurrentes.',
        category: 'partnership_models',
        badge: 'Conformité',
      },
      {
        q: 'Comment activer un compte partenaire ou le module Recruteur ?',
        a: 'Cliquez sur « Devenir Partenaire », sélectionnez votre profil (Employeur, Agence ou Scout) et validez vos informations. Votre espace est provisionné en quelques minutes avec assistance gratuite à la migration.',
        category: 'partnership_models',
        badge: 'Démarrage',
      },
    ],
  },
  pt: {
    ui: {
      kicker: 'Central de Ajuda & FAQ',
      heading: 'Perguntas Frequentes',
      subtitle:
        'Tudo o que candidatos, empresas parceiras e agências de recrutamento precisam saber sobre o ecossistema MsmeBooks Talent.',
      tabCandidates: 'Para Candidatos',
      tabEmployers: 'Para Recrutadores & Empresas',
      newBadge: 'Novo',
      hubTitle: 'Hub Operacional de Recrutadores e Empresas',
      hubBadge: 'Plataforma Aberta',
      hubDesc:
        'A MsmeBooks é um mercado aberto de talentos. Veja respostas sobre limites de vagas, gestão de candidatos (ATS), triagem por IA e parcerias.',
      partnerWithUs: 'Seja Parceiro',
      postVacancy: 'Publicar Vaga',
      filterBy: 'Filtrar por:',
      allTopics: 'Todos os tópicos',
      catPostingLimits: 'Limites de publicação',
      catApplicantManagement: 'Gestão de candidatos (ATS)',
      catPartnershipModels: 'Modelos de parceria',
      catPayrollSync: 'Folha & RH Sync',
      searchPlaceholderCandidates: 'Buscar dúvidas de candidatos (ex: currículo, remoto, entrevista)...',
      searchPlaceholderEmployers: 'Buscar dúvidas de recrutadores (ex: limites, ATS, comissão)...',
      clear: 'Limpar',
      noMatchesTitle: 'Nenhuma pergunta corresponde à sua busca.',
      noMatchesSubtitle: 'Tente outro termo ou redefina o filtro de categoria.',
      resetFilters: 'Redefinir filtros',
      bottomBannerText:
        'Tem uma demanda personalizada, recrutamento em alto volume ou dúvida de integração ERP?',
      joinPartnerNetwork: 'Entrar na Rede de Parceiros',
      speakSpecialist: 'Falar com Especialista em Talentos',
    },
    candidateFaqs: [
      {
        q: 'Como me candidato a uma vaga na MsmeBooks?',
        a: 'Explore as vagas abertas no portal, filtre por cargo, localização ou empresa e clique em "Candidatar-se". Preencha o formulário em 3 etapas, envie seu CV (PDF ou DOCX) e utilize nosso leitor de currículo com IA para preencher seus dados e receber um código de acompanhamento na hora.',
        category: 'applying',
        badge: 'Guia de Candidatura',
      },
      {
        q: 'Todas as vagas são para posições internas da MsmeBooks?',
        a: 'Não. Além das nossas vagas internas de tecnologia, finanças e operações, o portal funciona como uma plataforma pan-africana aberta usada por PMEs, startups e recrutadores parceiros verificados.',
        category: 'general',
      },
      {
        q: 'Como funciona o Consultor de Carreira com IA?',
        a: 'Alimentado pelo Gemini AI, o consultor compara suas competências, experiência, pretensão salarial e modelo de trabalho com todas as vagas ativas, exibindo compatibilidade, lacunas técnicas e filtros com 1 clique.',
        category: 'ai_tools',
      },
      {
        q: 'Posso me candidatar a várias vagas em empresas diferentes?',
        a: 'Sim, você pode enviar candidaturas para múltiplas oportunidades em diferentes empresas e departamentos, priorizando aquelas alinhadas ao seu portfólio e experiência.',
        category: 'applying',
      },
      {
        q: 'A MsmeBooks oferece vagas 100% remotas pela África?',
        a: 'Sim! Grande parte das vagas de engenharia, dados, contabilidade e sucesso do cliente são totalmente remotas, abertas a profissionais na Nigéria, Quênia, Ruanda, Gana, África do Sul, Angola, Moçambique e diáspora.',
        category: 'remote',
      },
      {
        q: 'Estudantes e profissionais em início de carreira podem se candidatar?',
        a: 'Com certeza. Mantemos programas contínuos de estágio e trainee voltados a recém-formados e autodidatas em software, contabilidade e design de produto.',
        category: 'general',
      },
      {
        q: 'Como acompanho o status da minha candidatura?',
        a: 'Após o envio, você recebe um código único (ex. MSME-APP-2026-XXXX) e acompanha cada etapa (Triagem, Entrevista, Proposta) no painel de perfil e por alertas automáticos de e-mail.',
        category: 'tracking',
      },
      {
        q: 'Como meus dados e currículo são protegidos?',
        a: 'Seguimos rigorosamente a NDPA, POPIA, LGPD e GDPR. Os arquivos ficam criptografados em repositórios isolados por empregador e nunca são vendidos a terceiros.',
        category: 'privacy',
      },
    ],
    employerFaqs: [
      {
        q: 'Quais são os limites de publicação para empresas e recrutadores?',
        a: 'Oferecemos planos flexíveis por porte:\n• Plano Comunitário Gratuito: até 3 vagas ativas simultaneamente sem custo.\n• Plano Crescimento: até 25 vagas ativas com renovação semanal automática e destaque.\n• Plano Enterprise & Agência: vagas ilimitadas multiempresa e indexação prioritária.',
        category: 'posting_limits',
        badge: 'Limites de Vagas',
      },
      {
        q: 'Por quanto tempo as vagas ficam ativas e posso editá-las?',
        a: 'Vagas padrão permanecem ativas por 30 dias corridos (60 dias no Crescimento e Enterprise). Você pode pausar, ajustar faixas salariais ou renovar com um clique sem perder o histórico de candidatos.',
        category: 'posting_limits',
        badge: 'Limites de Vagas',
      },
      {
        q: 'Como funciona o sistema de rastreamento de candidatos (ATS)?',
        a: 'Nosso ATS nativo garante visibilidade de ponta a ponta:\n• Estágios visuais: Aplicado -> Triagem -> Avaliação -> Entrevista -> Proposta -> Contratado.\n• Perfis completos: Score de IA, competências extraídas e visualizador PDF.\n• Notas internas da equipe e exportação CSV/Excel.',
        category: 'applicant_management',
        badge: 'Gestão ATS',
      },
      {
        q: 'Como funciona a análise e triagem automática de currículos com IA?',
        a: 'A cada envio de PDF ou DOCX, nosso motor Gemini AI extrai em menos de 2 segundos dados de contato, experiência e competências, gerando uma pontuação objetiva que reduz em mais de 75% o tempo de triagem manual.',
        category: 'applicant_management',
        badge: 'Gestão ATS',
      },
      {
        q: 'Agências externas podem colaborar com o RH interno dos clientes?',
        a: 'Sim. O controle de acesso baseado em função (RBAC) permite atribuir assentos dedicados a agências por requisição, mantendo dados financeiros e confidenciais protegidos.',
        category: 'applicant_management',
        badge: 'Gestão ATS',
      },
      {
        q: 'Quais modelos de parceria a MsmeBooks oferece?',
        a: 'Disponibilizamos quatro caminhos:\n1. SaaS Direto para Empregadores.\n2. Parceiro Certificado de Agência e Headhunting.\n3. Talent Scout & Indicações (comissões de até 15%).\n4. Portais Enterprise personalizados com webhooks de API.',
        category: 'partnership_models',
        badge: 'Parcerias',
      },
      {
        q: 'Quais são os termos comerciais para recrutadores parceiros?',
        a: 'Escolha entre assinatura mensal/anual fixa com candidatos ilimitados ou taxa de sucesso (10% a 18% do salário bruto anual) com garantia de 90 dias via MsmeBooks Pay.',
        category: 'partnership_models',
        badge: 'Parcerias',
      },
      {
        q: 'Como o módulo de Talentos se integra à Contabilidade e Folha MsmeBooks?',
        a: 'Ao marcar um candidato como "Contratado", converta-o em funcionário ativo com 1 clique. Salário, dados bancários e impostos fluem diretamente para o motor de folha de pagamento.',
        category: 'payroll_integration',
        badge: 'Folha de Pagamento',
      },
      {
        q: 'Como a MsmeBooks garante privacidade e conformidade regulatória?',
        a: 'Cumprimos as leis NDPA, Kenya DPA, POPIA e GDPR com isolamento multilocatário e criptografia. Dados enviados a uma empresa jamais ficam acessíveis a concorrentes.',
        category: 'partnership_models',
        badge: 'Conformidade',
      },
      {
        q: 'Como ativamos o módulo de Recrutador ou conta de parceiro?',
        a: 'Clique em "Seja Parceiro", escolha sua categoria e envie os dados da empresa. Provisionamos seu ambiente em minutos com suporte gratuito para migração de planilhas.',
        category: 'partnership_models',
        badge: 'Primeiros Passos',
      },
    ],
  },
  es: {
    ui: {
      kicker: 'Centro de Ayuda y FAQ',
      heading: 'Preguntas Frecuentes',
      subtitle:
        'Todo lo que candidatos, empresas asociadas y agencias de selección necesitan saber sobre el ecosistema MsmeBooks Talent.',
      tabCandidates: 'Para Candidatos',
      tabEmployers: 'Para Reclutadores y Empresas',
      newBadge: 'Nuevo',
      hubTitle: 'Centro de Operaciones para Reclutadores y Empresas',
      hubBadge: 'Plataforma Abierta',
      hubDesc:
        'MsmeBooks es un mercado abierto de talento. Encuentra respuestas sobre límites de publicación, gestión de candidatos (ATS), cribado con IA y modelos de alianza.',
      partnerWithUs: 'Asóciate con Nosotros',
      postVacancy: 'Publicar Vacante',
      filterBy: 'Filtrar por:',
      allTopics: 'Todos los temas',
      catPostingLimits: 'Límites de publicación',
      catApplicantManagement: 'Gestión de candidatos (ATS)',
      catPartnershipModels: 'Modelos de alianza',
      catPayrollSync: 'Sincronización Nómina y RRHH',
      searchPlaceholderCandidates: 'Buscar preguntas para candidatos (ej: currículum, remoto, entrevista)...',
      searchPlaceholderEmployers: 'Buscar preguntas para reclutadores (ej: límites, ATS, tarifas)...',
      clear: 'Limpiar',
      noMatchesTitle: 'Ninguna pregunta coincide con tu búsqueda.',
      noMatchesSubtitle: 'Prueba con otro término o restablece el filtro de categoría.',
      resetFilters: 'Restablecer filtros',
      bottomBannerText:
        '¿Tienes requisitos a medida, alto volumen de contratación o consultas de integración ERP?',
      joinPartnerNetwork: 'Unirse a la Red de Socios',
      speakSpecialist: 'Hablar con un Especialista en Talento',
    },
    candidateFaqs: [
      {
        q: '¿Cómo postulo a una vacante en MsmeBooks?',
        a: 'Explora las vacantes abiertas, filtra por puesto, ubicación o empresa y haz clic en "Postular ahora". Completa el formulario de 3 pasos, sube tu CV (PDF o DOCX) y usa nuestro lector con IA para autocompletar tu historial y obtener un código único de seguimiento.',
        category: 'applying',
        badge: 'Guía de Postulación',
      },
      {
        q: '¿Todas las ofertas pertenecen a puestos internos de MsmeBooks?',
        a: 'No. Además de nuestras propias vacantes en ingeniería, finanzas y operaciones, este portal es una plataforma panafricana abierta empleada por empresas verificadas, pymes y agencias asociadas.',
        category: 'general',
      },
      {
        q: '¿Cómo funciona el Asesor de Carrera con IA?',
        a: 'Impulsado por Gemini AI, analiza tus habilidades, experiencia, expectativa salarial y modalidad preferida frente a todas las vacantes activas, calculando compatibilidad y detectando brechas de habilidades.',
        category: 'ai_tools',
      },
      {
        q: '¿Puedo postular a múltiples vacantes en distintas empresas?',
        a: 'Sí, puedes enviar candidaturas a varias posiciones en diferentes compañías y departamentos, priorizando aquellas alineadas con tu experiencia y portafolio.',
        category: 'applying',
      },
      {
        q: '¿MsmeBooks ofrece oportunidades 100% remotas en África?',
        a: '¡Sí! Gran parte de nuestros puestos en ingeniería, datos, contabilidad y éxito del cliente son 100% remotos para talento en Nigeria, Kenia, Ruanda, Ghana, Sudáfrica y la diáspora global.',
        category: 'remote',
      },
      {
        q: '¿Pueden postular estudiantes y talento junior?',
        a: 'Por supuesto. Publicamos continuamente programas de prácticas y graduados para recién titulados y autodidactas en desarrollo, contabilidad y diseño de producto.',
        category: 'general',
      },
      {
        q: '¿Cómo hago seguimiento del estado de mi candidatura?',
        a: 'Al enviar tu solicitud obtienes un código de referencia único (ej. MSME-APP-2026-XXXX). Podrás seguir cada hito desde tu perfil y recibir notificaciones por correo electrónico.',
        category: 'tracking',
      },
      {
        q: '¿Cómo se protegen mis datos y mi CV?',
        a: 'Cumplimos con las leyes NDPA, Kenya DPA, POPIA y RGPD. Tus documentos se cifran y almacenan en entornos aislados por reclutador sin venderse jamás a terceros.',
        category: 'privacy',
      },
    ],
    employerFaqs: [
      {
        q: '¿Cuáles son los límites de publicación para empresas y reclutadores?',
        a: 'Ofrecemos niveles flexibles según tu organización:\n• Nivel Gratuito Comunitario: hasta 3 vacantes activas simultáneas sin costo.\n• Plan Crecimiento: hasta 25 vacantes activas con renovación semanal y visibilidad destacada.\n• Nivel Enterprise y Agencias: publicaciones ilimitadas multicliente e indexación prioritaria.',
        category: 'posting_limits',
        badge: 'Límites de Publicación',
      },
      {
        q: '¿Cuánto tiempo permanecen activas las ofertas y se pueden editar?',
        a: 'Las vacantes estándar duran 30 días naturales (60 días en Crecimiento y Enterprise). Puedes pausar, editar bandas salariales o renovar en un clic sin perder el historial de postulantes.',
        category: 'posting_limits',
        badge: 'Límites de Publicación',
      },
      {
        q: '¿Cómo funciona el sistema de seguimiento de candidatos (ATS)?',
        a: 'Nuestro ATS integrado te da visibilidad total:\n• Etapas visuales: Postulado -> Cribado -> Evaluación Técnica -> Entrevista -> Oferta -> Contratado.\n• Perfiles en tiempo real con puntuación de IA, habilidades extraídas y visor PDF.\n• Notas internas privadas y exportación a CSV/Excel.',
        category: 'applicant_management',
        badge: 'Gestión ATS',
      },
      {
        q: '¿Cómo funciona el análisis y filtrado de currículums con IA?',
        a: 'Cada vez que un candidato sube su PDF o DOCX, Gemini AI extrae en menos de 2 segundos sus datos de contacto, experiencia y competencias, asignando un porcentaje objetivo que reduce en más del 75% la revisión manual.',
        category: 'applicant_management',
        badge: 'Gestión ATS',
      },
      {
        q: '¿Pueden colaborar agencias externas con equipos internos de RR. HH.?',
        a: 'Sí. El control de acceso por roles (RBAC) permite asignar asientos a agencias por requisición específica manteniendo aislados los datos financieros confidenciales.',
        category: 'applicant_management',
        badge: 'Gestión ATS',
      },
      {
        q: '¿Qué modelos de alianza ofrece MsmeBooks?',
        a: 'Ofrecemos cuatro vías:\n1. SaaS Directo para Empresas.\n2. Socio Certificado de Agencia y Headhunting.\n3. Talent Scout y Referidos (recompensas de hasta el 15%).\n4. Portales Enterprise con marca propia y webhooks API.',
        category: 'partnership_models',
        badge: 'Alianzas',
      },
      {
        q: '¿Cuáles son los términos comerciales para reclutadores asociados?',
        a: 'Puedes elegir entre suscripciones fijas mensuales/anuales con candidatos ilimitados o honorarios por éxito (10%–18% del bruto anual) con garantía de 90 días mediante MsmeBooks Pay.',
        category: 'partnership_models',
        badge: 'Alianzas',
      },
      {
        q: '¿Cómo se integra el módulo de Talento con Contabilidad y Nómina MsmeBooks?',
        a: 'Cuando un candidato pasa a "Contratado", conviértelo en empleado activo con un clic. Su salario, cuenta bancaria y deducciones fiscales fluyen automáticamente a MsmeBooks Payroll.',
        category: 'payroll_integration',
        badge: 'Integración Nómina',
      },
      {
        q: '¿Cómo garantiza MsmeBooks la privacidad y cumplimiento normativo?',
        a: 'Cumplimos estrictamente con NDPA, POPIA y RGPD mediante bases cifradas aisladas por cliente. Los candidatos de una empresa nunca son visibles para competidores.',
        category: 'partnership_models',
        badge: 'Cumplimiento',
      },
      {
        q: '¿Cómo nos registramos como socios o activamos el Módulo de Reclutamiento?',
        a: 'Haz clic en "Asóciate con Nosotros", selecciona tu tipo de organización y envía tus datos. Tu espacio queda listo en minutos con asistencia gratuita de migración.',
        category: 'partnership_models',
        badge: 'Primeros Pasos',
      },
    ],
  },
};

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenPartnerModal,
  onOpenPostJob,
}) => {
  const { language } = useLanguage();
  const localeBundle = FAQ_TRANSLATIONS[language] || FAQ_TRANSLATIONS.en;
  const { ui, candidateFaqs, employerFaqs } = localeBundle;

  const [activeTab, setActiveTab] = useState<'candidates' | 'employers'>('employers');
  const [recruiterFilter, setRecruiterFilter] = useState<RecruiterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCandidateIndex, setOpenCandidateIndex] = useState<number | null>(0);
  const [openEmployerIndex, setOpenEmployerIndex] = useState<number | null>(0);

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidateFaqs;
    const q = searchQuery.toLowerCase();
    return candidateFaqs.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [searchQuery, candidateFaqs]);

  const filteredEmployers = useMemo(() => {
    let list = employerFaqs;
    if (recruiterFilter !== 'all') {
      list = list.filter((item) => item.category === recruiterFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
    }
    return list;
  }, [recruiterFilter, searchQuery, employerFaqs]);

  const currentFaqs = activeTab === 'candidates' ? filteredCandidates : filteredEmployers;
  const currentOpenIndex = activeTab === 'candidates' ? openCandidateIndex : openEmployerIndex;
  const setOpenIndex = activeTab === 'candidates' ? setOpenCandidateIndex : setOpenEmployerIndex;

  return (
    <section id="faqs" className="py-20 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>{ui.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14243A] dark:text-white tracking-tight">
            {ui.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base mt-3 leading-relaxed">
            {ui.subtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-slate-100 dark:bg-[#131D35] p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner border border-slate-200 dark:border-slate-700/80">
            <button
              onClick={() => {
                setActiveTab('candidates');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'candidates'
                  ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#14243A] dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{ui.tabCandidates}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('employers');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'employers'
                  ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#14243A] dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#B5E61D]" />
              <span>{ui.tabEmployers}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#B5E61D] text-[#14243A] text-[10px] font-extrabold uppercase tracking-wide">
                {ui.newBadge}
              </span>
            </button>
          </div>
        </div>

        {/* Informational Callout & Sub-categories for Recruiters & Employers */}
        {activeTab === 'employers' && (
          <div className="mb-6 space-y-4">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#14243A] via-indigo-950 to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-900/50">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-[#B5E61D] shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2 flex-wrap">
                    <span>{ui.hubTitle}</span>
                    <span className="bg-[#B5E61D] text-[#14243A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {ui.hubBadge}
                    </span>
                  </h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed max-w-xl">
                    {ui.hubDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onOpenPartnerModal && (
                  <button
                    onClick={() => onOpenPartnerModal('employer')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B5E61D] text-[#14243A] hover:bg-[#a3d415] text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <span>{ui.partnerWithUs}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onOpenPostJob && (
                  <button
                    onClick={onOpenPostJob}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{ui.postVacancy}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Recruiter Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {ui.filterBy}
              </span>
              <button
                onClick={() => setRecruiterFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  recruiterFilter === 'all'
                    ? 'bg-[#14243A] dark:bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#131D35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1A284A]'
                }`}
              >
                {ui.allTopics} ({employerFaqs.length})
              </button>
              <button
                onClick={() => setRecruiterFilter('posting_limits')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  recruiterFilter === 'posting_limits'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#131D35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1A284A]'
                }`}
              >
                {ui.catPostingLimits}
              </button>
              <button
                onClick={() => setRecruiterFilter('applicant_management')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  recruiterFilter === 'applicant_management'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#131D35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1A284A]'
                }`}
              >
                {ui.catApplicantManagement}
              </button>
              <button
                onClick={() => setRecruiterFilter('partnership_models')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  recruiterFilter === 'partnership_models'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#131D35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1A284A]'
                }`}
              >
                {ui.catPartnershipModels}
              </button>
              <button
                onClick={() => setRecruiterFilter('payroll_integration')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  recruiterFilter === 'payroll_integration'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#131D35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1A284A]'
                }`}
              >
                {ui.catPayrollSync}
              </button>
            </div>
          </div>
        )}

        {/* Quick Search Input */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'candidates'
                ? ui.searchPlaceholderCandidates
                : ui.searchPlaceholderEmployers
            }
            className="w-full pl-10 pr-16 py-2.5 bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-[#14243A] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] dark:focus:border-[#38BDF8] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              {ui.clear}
            </button>
          )}
        </div>

        {/* Accordion Container */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {currentFaqs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ui.noMatchesTitle}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{ui.noMatchesSubtitle}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRecruiterFilter('all');
                }}
                className="mt-3 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline"
              >
                {ui.resetFilters}
              </button>
            </div>
          ) : (
            currentFaqs.map((faq, index) => {
              const isOpen = currentOpenIndex === index;
              return (
                <div key={index} className="py-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-[#131D35]/50 px-2 sm:px-3 rounded-lg">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-start justify-between text-left gap-4 group focus:outline-none cursor-pointer"
                  >
                    <div className="space-y-1">
                      {faq.badge && (
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                          {faq.badge}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full bg-slate-100 dark:bg-[#1A284A] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8]' : 'text-slate-400 dark:text-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pr-4 sm:pr-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-150 whitespace-pre-line">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Trust & Contact banner */}
        <div className="mt-12 text-center pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {ui.bottomBannerText}
          </div>
          <div className="flex items-center gap-3">
            {onOpenPartnerModal && (
              <button
                onClick={() => onOpenPartnerModal('employer')}
                className="text-xs font-bold text-[#14243A] dark:text-white bg-slate-100 dark:bg-[#131D35] hover:bg-slate-200 dark:hover:bg-[#1A284A] border border-transparent dark:border-slate-700/80 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {ui.joinPartnerNetwork}
              </button>
            )}
            <a
              href="https://www.msmebooks.org/contact"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1.5"
            >
              <span>{ui.speakSpecialist}</span>
              <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
