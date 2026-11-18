import { SectionItem, LegalCategory } from '../types/terms';
import { TERMS_SECTIONS, LEGAL_CATEGORIES } from './termsContent';

export type Language = 'en' | 'fr' | 'pt' | 'es';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇵🇹' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
];

export interface TranslationDictionary {
  nav: {
    platform: string;
    solutions: string;
    pricing: string;
    resources: string;
    legal: string;
    checklist: string;
    consentSimulator: string;
    jumpTo: string;
  };
  hero: {
    agreementType: string;
    subtitle: string;
    quote: string;
    versionLabel: string;
    versionValue: string;
    effectiveDateLabel: string;
    lastUpdatedLabel: string;
    scopeLabel: string;
    scopeValue: string;
    downloadPdf: string;
    printTerms: string;
    versionHistory: string;
    counselReview: string;
    testConsent: string;
    home: string;
    legalBreadcrumb: string;
  };
  toc: {
    title: string;
    readProgress: string;
    searchPlaceholder: string;
    matchCount: string;
    totalNumbered: string;
    expandAll: string;
    collapseAll: string;
    backToTop: string;
    jumpToSection: string;
    closeNavigator: string;
    sectionsTitle: string;
    jumpDirectly: string;
  };
  notice: {
    badge: string;
    text: string;
    button: string;
  };
  sectionControls: {
    copied: string;
    link: string;
    collapse: string;
    expand: string;
    definitionsHeader: string;
    definedCount: string;
    termHeader: string;
    meaningHeader: string;
    saasComplianceNote: string;
    openConsentSimulator: string;
    corporateHeader: string;
    hqLabel: string;
    commLabel: string;
    telephoneLabel: string;
    legalDeskLabel: string;
    websiteLabel: string;
  };
  categories: Record<string, string>;
  sectionTranslations: Record<number, {
    title: string;
    summary: string;
  }>;
  definitionTranslations: Record<string, {
    term: string;
    definition: string;
  }>;
  relatedDocs: {
    frameworkTag: string;
    heading: string;
    description: string;
    statusPublished: string;
    statusPending: string;
    updatedPrefix: string;
    quickView: string;
    statusLabel: string;
    lastUpdatedLabel: string;
    summaryHeading: string;
    closeButton: string;
    requestCopy: string;
  };
  chat: {
    triggerLabel: string;
    onlineStatus: string;
    dialogTitle: string;
    repliesIn: string;
    tabChat: string;
    tabChannels: string;
    tabFaqs: string;
    startTitle: string;
    startDesc: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    topicLabel: string;
    connectBtn: string;
    typePlaceholder: string;
    typingIndicator: string;
    directDesksTitle: string;
    directDesksDesc: string;
    whatsappTitle: string;
    whatsappDesc: string;
    supportDeskTitle: string;
    supportDeskDesc: string;
    legalDeskTitle: string;
    legalDeskDesc: string;
    commonFaqsTitle: string;
  };
  modals: {
    consentTitle: string;
    consentSubtitle: string;
    consentDesc: string;
    businessNameLabel: string;
    emailLabel: string;
    planLabel: string;
    termsAgreedPrefix: string;
    termsAgreedLink: string;
    termsAgreedMid: string;
    privacyLink: string;
    mandatoryNote: string;
    marketingConsent: string;
    cancelBtn: string;
    submitConsentBtn: string;
    verifiedSuccessTitle: string;
    verifiedSuccessDesc: string;
    auditPayloadLabel: string;
    copyJsonBtn: string;
    copiedBtn: string;
    testAnotherBtn: string;
    doneBtn: string;
    checklistTitle: string;
    checklistSubtitle: string;
    checklistBanner: string;
    viewInSecBtn: string;
    exportChecklistBtn: string;
    dismissBtn: string;
    versionTitle: string;
    versionSubtitle: string;
    currentActiveTag: string;
    effectiveLabel: string;
    keyModificationsLabel: string;
    closeVersionBtn: string;
  };
  footer: {
    mission: string;
    serving: string;
    platformTitle: string;
    companyTitle: string;
    resourcesTitle: string;
    legalTitle: string;
    rights: string;
    ndpaTag: string;
    sslTag: string;
    cloudTag: string;
  };
  leftNav: {
    upTooltip: string;
    downTooltip: string;
    topTooltip: string;
    bottomTooltip: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      platform: "Platform",
      solutions: "Solutions",
      pricing: "Pricing",
      resources: "Resources",
      legal: "Legal & Terms",
      checklist: "Legal Checklist",
      consentSimulator: "Consent Simulator",
      jumpTo: "Jump to...",
    },
    hero: {
      agreementType: "Official Master SaaS Agreement",
      subtitle: "Clear Terms. Trusted Technology. Better Business.",
      quote: "Welcome to MsmeBooks. These Terms and Conditions explain the rules, responsibilities, rights, and obligations governing access to and use of our cloud-based accounting, point of sale, inventory, and business management solutions. We believe in transparency, security, and building lasting relationships with businesses across Africa and beyond.",
      versionLabel: "Version:",
      versionValue: "v2.4 (Enterprise)",
      effectiveDateLabel: "Effective Date:",
      lastUpdatedLabel: "Last Updated:",
      scopeLabel: "Scope:",
      scopeValue: "33 Formally Drafted Sections",
      downloadPdf: "Download PDF",
      printTerms: "Print Terms",
      versionHistory: "Version History",
      counselReview: "Counsel Review Checklist",
      testConsent: "Test Signup Consent",
      home: "Home",
      legalBreadcrumb: "Legal",
    },
    toc: {
      title: "Table of Contents",
      readProgress: "read",
      searchPlaceholder: "Search within terms...",
      matchCount: "sections match",
      totalNumbered: "33 Formally Numbered Sections",
      expandAll: "Expand All",
      collapseAll: "Collapse All",
      backToTop: "Back to Top of Page",
      jumpToSection: "Jump to Section",
      closeNavigator: "Close Navigator",
      sectionsTitle: "Table of Contents",
      jumpDirectly: "Jump directly to any of the 33 sections",
    },
    notice: {
      badge: "Legal Counsel Pre-Publication Draft",
      text: "This document contains comprehensive provisions governing cloud accounting, POS, multi-branch inventory, and African data protection (NDPA 2023). Specific company placeholders are ready for final corporate sign-off.",
      button: "Review 6 Placeholders",
    },
    sectionControls: {
      copied: "Copied",
      link: "Link",
      collapse: "Collapse section",
      expand: "Expand section",
      definitionsHeader: "Standard SaaS Interpretation & Defined Terms",
      definedCount: "Defined Terms",
      termHeader: "Term",
      meaningHeader: "Contractual Meaning",
      saasComplianceNote: "SaaS Consent Compliance: Test how user consent is verified and stored with audit logs.",
      openConsentSimulator: "Open Consent Simulator",
      corporateHeader: "MsmeBooks Official Corporate Coordinates",
      hqLabel: "Headquarters & Jurisdiction",
      commLabel: "Communications & Verification",
      telephoneLabel: "Telephone:",
      legalDeskLabel: "Legal Desk:",
      websiteLabel: "Website:",
    },
    categories: {
      "cat-foundations": "1. Foundations & Accounts",
      "cat-saas-scope": "2. SaaS Platform Scope & Licensing",
      "cat-data-compliance": "3. Data Protection, Security & Compliance",
      "cat-industry-modules": "4. Specialized Modules & Technology",
      "cat-governance-partners": "5. Operational Governance & Partners",
      "cat-legal-liability": "6. Legal Protections, Risk & Jurisdiction",
    },
    sectionTranslations: {
      1: { title: "Introduction and Acceptance of Terms", summary: "Establishes the binding contractual agreement between MsmeBooks and its subscribers, authorized users, and business organizations." },
      2: { title: "Definitions and Interpretation", summary: "Provides precise legal and technical definitions of terms utilized throughout this Agreement." },
      3: { title: "Eligibility and Account Registration", summary: "Defines who may register for an account, security standards, credential management, and business verification." },
      4: { title: "Scope of MsmeBooks SaaS Services", summary: "Details the modular business management modules provided by MsmeBooks and plan-based availability." },
      5: { title: "Subscription Plans and Licensing", summary: "Governs license grants, plan tiers (Free, Growth, Enterprise, Custom), seat limits, and upgrade/downgrade rules." },
      6: { title: "Billing, Payments and Taxes", summary: "Outlines recurring subscription billing, payment channels, invoice schedules, withholding taxes, and VAT treatment." },
      7: { title: "Refunds, Cancellations and Subscription Termination", summary: "Defines subscription cancellation procedures, refund eligibility criteria, data export windows, and account deletion protocols." },
      8: { title: "Customer Data Ownership and Privacy", summary: "Confirms customer ownership of business data, outlines data processing obligations under NDPA 2023 & GDPR, and covers subprocessors." },
      9: { title: "Information Security and Platform Protection", summary: "Sets out technical and organizational security controls, encryption, incident notification protocols, and customer shared responsibilities." },
      10: { title: "Accounting, Financial and Tax Responsibilities", summary: "Clarifies that MsmeBooks provides automated software tools and does not provide certified accounting, tax, or legal advice." },
      11: { title: "POS, Payments and Transaction Processing", summary: "Covers point-of-sale operations, hardware compatibility, integrated payment service providers, cash till reconciliation, and dispute management." },
      12: { title: "Inventory, Warehouse and Stock Management", summary: "Sets terms regarding stock valuations, inventory adjustments, physical audits, supplier records, and damaged goods." },
      13: { title: "Payroll, HR and Employee Information", summary: "Regulates employee personal data, salary schedules, statutory pension/NHF/PAYE deductions, and employer legal duties." },
      14: { title: "Hospitality, Restaurant and Property Management", summary: "Addresses room reservations, guest folios, restaurant table workflows, booking cancellations, and operator guest policies." },
      15: { title: "E-commerce, Marketplace and Third-Party Applications", summary: "Governs online storefront extensions, marketplace integrations, vendor agreements, and data exchange with third-party apps." },
      16: { title: "API Access and Developer Usage", summary: "Outlines developer API keys, rate limits, webhook endpoints, security standards, and non-abuse obligations." },
      17: { title: "Artificial Intelligence and Automated Features", summary: "Regulates automated machine learning insights, AI predictions, human verification rules, and liability disclaimers for automated output." },
      18: { title: "Acceptable Use Policy", summary: "Defines strictly prohibited platform behaviors, including fraudulent activity, scraping, security breaches, and illegal business operations." },
      19: { title: "Intellectual Property Rights", summary: "Protects MsmeBooks software, trademarks, brand assets, and proprietary UI, while confirming Customer's ownership of uploaded assets." },
      20: { title: "Service Availability, Maintenance and Updates", summary: "Covers cloud uptime targets, routine maintenance schedules, emergency patches, and infrastructure dependencies." },
      21: { title: "Technical Support and Customer Assistance", summary: "Details support channels, service tiers, response expectations, onboarding guidance, and escalation processes." },
      22: { title: "Resellers, Affiliates and Business Partners", summary: "Regulates authorized partner networks, commission eligibility, brand representations, and reseller duties." },
      23: { title: "Professional Services and Third-Party Consultants", summary: "Covers bookkeeping, implementation, data migration, and third-party accounting firms engaged by Customers." },
      24: { title: "Confidentiality", summary: "Binds both parties to rigorous protection of proprietary commercial, financial, and technical information." },
      25: { title: "Warranties and Disclaimers", summary: "States software performance disclaimers, as-is provisions, and statutory consumer rights protections." },
      26: { title: "Limitation of Liability", summary: "Defines liability limitations, consequential damage exclusions, and financial liability caps subject to legal counsel review." },
      27: { title: "Indemnification", summary: "Requires Customer to indemnify MsmeBooks against claims arising from unlawful platform use or tax non-compliance." },
      28: { title: "Suspension and Termination", summary: "Sets out terms for account suspension, breach remediation, voluntary closure, and post-termination effects." },
      29: { title: "International Users and Cross-Border Services", summary: "Covers cross-border multi-currency operations across African and global markets, trade controls, and local compliance." },
      30: { title: "Governing Law and Dispute Resolution", summary: "Provides structured dispute resolution, informal conciliation, mediation, and arbitration venue placeholders." },
      31: { title: "Changes to Terms and Conditions", summary: "Explains how terms are revised, notice mechanisms for material modifications, and archived version tracking." },
      32: { title: "General Legal Provisions", summary: "Standard contractual clauses: Severability, Entire Agreement, Force Majeure, Non-Waiver, Assignment, and Survival." },
      33: { title: "Contact Information and Legal Enquiries", summary: "Official contact details, legal notice channels, corporate credentials, and formal correspondence endpoints." }
    },
    definitionTranslations: {
      "MsmeBooks / Company / Provider": { term: "MsmeBooks / Company / Provider", definition: "The technology entity [MsmeBooks Technologies Ltd / Insert Registered Legal Entity], provider and operator of the cloud business management software accessible at www.msmebooks.org." },
      "Customer / Subscriber": { term: "Customer / Subscriber", definition: "The micro, small, medium enterprise, corporation, merchant, or individual that enters into this Agreement by registering an account or purchasing a subscription." },
      "Authorized User": { term: "Authorized User", definition: "Any employee, officer, contractor, accountant, auditor, or agent designated by the Customer and granted login credentials to access the platform under Customer's account." },
      "Account Administrator": { term: "Account Administrator", definition: "The designated primary user(s) authorized by the Customer to manage account settings, assign user permissions, purchase add-ons, and bind the Customer financially." },
      "Services / Platform": { term: "Services / Platform", definition: "The suite of proprietary cloud-based software modules provided by MsmeBooks, including Accounting, Point of Sale (POS), Inventory & Warehouse, HR & Payroll, Hospitality, E-commerce, APIs, and associated web/mobile applications." },
      "Subscription Plan": { term: "Subscription Plan", definition: "The specific commercial package (such as Free Plan, Growth Plan, Enterprise Plan, or Custom Plan) selected by the Customer, specifying features, user seats, branches, and billing cycles." },
      "Customer Data": { term: "Customer Data", definition: "All electronic data, financial transactions, invoices, inventory records, customer lists, payroll figures, reports, and multimedia files uploaded, ingested, or generated by Customer within the platform." },
      "Personal Data": { term: "Personal Data", definition: "Any information relating to an identified or identifiable natural person processed through the platform, as defined under the Nigeria Data Protection Act 2023 (NDPA), GDPR, and other applicable data privacy laws." },
      "Third-Party Services": { term: "Third-Party Services", definition: "External hardware, payment gateways, banking integrations, SMS gateways, cloud providers, and software add-ons not owned or operated by MsmeBooks." },
      "Add-On Modules": { term: "Add-On Modules", definition: "Optional features, additional branch licenses, expanded user seats, specialized vertical solutions, or premium integrations purchased outside base plan tiers." },
      "Billing Cycle": { term: "Billing Cycle", definition: "The recurring duration for which subscription fees are charged (e.g., monthly, quarterly, semi-annually, or annually) as selected by Customer." },
      "Service Availability": { term: "Service Availability", definition: "The operational uptime during which the production cloud platform is accessible to Customers via the internet, excluding scheduled maintenance." },
      "Intellectual Property": { term: "Intellectual Property", definition: "All patents, patent applications, copyrights, moral rights, trademarks, service marks, trade secrets, algorithms, UI designs, codebases, and domain names." },
      "Confidential Information": { term: "Confidential Information", definition: "Non-public proprietary business, technical, financial, or strategic information disclosed by one party to the other in connection with the platform." },
      "Acceptable Use": { term: "Acceptable Use", definition: "The standard of conduct and operational parameters governing lawful, non-disruptive, and secure interaction with MsmeBooks infrastructure." }
    },
    relatedDocs: {
      frameworkTag: "Governance & Compliance Framework",
      heading: "Related Legal Documents & Policies",
      description: "These Terms and Conditions operate in tandem with our complete legal framework. Select any document below to inspect its operational scope.",
      statusPublished: "Published",
      statusPending: "Available on Request",
      updatedPrefix: "Updated",
      quickView: "Quick View",
      statusLabel: "Operational Status:",
      lastUpdatedLabel: "Last Updated:",
      summaryHeading: "Executive Summary",
      closeButton: "Close",
      requestCopy: "Request Full Copy",
    },
    chat: {
      triggerLabel: "Live Chat",
      onlineStatus: "Online",
      dialogTitle: "MsmeBooks Support",
      repliesIn: "Typically replies in under 5 minutes",
      tabChat: "Agent Chat",
      tabChannels: "Channels",
      tabFaqs: "FAQs",
      startTitle: "Start a Conversation",
      startDesc: "Please provide your details so we can assign a specialized legal or billing agent to your ticket.",
      nameLabel: "Your Full Name / Business *",
      namePlaceholder: "e.g., Tunde Adeleke",
      emailLabel: "Business Email Address *",
      emailPlaceholder: "tunde@mybusiness.com",
      topicLabel: "Inquiry Topic",
      connectBtn: "Connect with Agent",
      typePlaceholder: "Type your message...",
      typingIndicator: "Agent is typing...",
      directDesksTitle: "Direct Corporate Desks",
      directDesksDesc: "Reach MsmeBooks representatives across phone, messaging, and email.",
      whatsappTitle: "Official WhatsApp Desk",
      whatsappDesc: "Fastest response for billing, setup, and instant inquiries.",
      supportDeskTitle: "Technical Support Desk",
      supportDeskDesc: "For technical troubleshooting and bug reports.",
      legalDeskTitle: "Legal & Compliance Department",
      legalDeskDesc: "Formal legal notices, enterprise MSAs, and DPA agreements.",
      commonFaqsTitle: "Common Terms Questions",
    },
    modals: {
      consentTitle: "SaaS Registration Consent Simulator",
      consentSubtitle: "Audited Section 7 & NDPA 2023 Contractual Workflow",
      consentDesc: "Experience MsmeBooks' affirmative, un-preselected contractual consent protocol. Every registration logs an immutable cryptographic audit record.",
      businessNameLabel: "Business / Legal Entity Name",
      emailLabel: "Account Administrator Email",
      planLabel: "Selected Subscription Tier",
      termsAgreedPrefix: "I have read and agree to the",
      termsAgreedLink: "MsmeBooks Terms and Conditions",
      termsAgreedMid: "and acknowledge the separate",
      privacyLink: "Privacy Policy",
      mandatoryNote: "* Affirmative, unselected checkbox required by law. Preselected boxes are strictly prohibited.",
      marketingConsent: "(Optional) Send me product updates, SME accounting guides, and platform news via email.",
      cancelBtn: "Cancel",
      submitConsentBtn: "Complete Registration & Capture Audit",
      verifiedSuccessTitle: "Consent Successfully Verified & Recorded",
      verifiedSuccessDesc: "The contractual acceptance record has been stamped into the MsmeBooks security audit trail.",
      auditPayloadLabel: "Cryptographic Audit Payload (JSON):",
      copyJsonBtn: "Copy JSON",
      copiedBtn: "Copied!",
      testAnotherBtn: "← Test Another User Registration",
      doneBtn: "Done",
      checklistTitle: "Legal Counsel Pre-Publication Checklist",
      checklistSubtitle: "Action Items for In-House Counsel / External Solicitors",
      checklistBanner: "As required by the master SaaS specification, these 6 contractual placeholders are explicitly highlighted rather than invented. Qualified legal counsel must approve these corporate details before official production release.",
      viewInSecBtn: "View in Sec",
      exportChecklistBtn: "Export Checklist Text",
      dismissBtn: "Dismiss Checklist",
      versionTitle: "Terms & Conditions Version History",
      versionSubtitle: "Formal Revision Changelog & Archive",
      currentActiveTag: "Current Active Version",
      effectiveLabel: "Effective:",
      keyModificationsLabel: "Key Modifications:",
      closeVersionBtn: "Close Version Archive",
    },
    footer: {
      mission: "All-in-one cloud-based Accounting, Point of Sale (POS), Multi-Warehouse Inventory, and Payroll management software empowering micro, small, and medium businesses across Africa and global emerging markets.",
      serving: "Lagos & Abuja, Nigeria · Serving Pan-African & Global Markets",
      platformTitle: "Platform",
      companyTitle: "Company",
      resourcesTitle: "Resources",
      legalTitle: "Legal & Trust",
      rights: "MsmeBooks Technologies Ltd. All rights reserved. Registered under applicable trade laws.",
      ndpaTag: "NDPA 2023 Compliant",
      sslTag: "256-bit SSL Encryption",
      cloudTag: "Pan-African SaaS Cloud",
    },
    leftNav: {
      upTooltip: "Up: Previous Section",
      downTooltip: "Down: Next Section",
      topTooltip: "Scroll to Top",
      bottomTooltip: "Scroll to Bottom",
    }
  },

  fr: {
    nav: {
      platform: "Plateforme",
      solutions: "Solutions",
      pricing: "Tarification",
      resources: "Ressources",
      legal: "Conditions Générales",
      checklist: "Checklist Juridique",
      consentSimulator: "Simulateur de Consentement",
      jumpTo: "Accéder à...",
    },
    hero: {
      agreementType: "Contrat-Cadre SaaS Officiel",
      subtitle: "Conditions Claires. Technologie Fiable. Entreprise Prospère.",
      quote: "Bienvenue sur MsmeBooks. Ces Conditions Générales énoncent les règles, responsabilités, droits et obligations régissant l'accès et l'utilisation de nos solutions cloud de comptabilité, point de vente (POS), inventaire et gestion d'entreprise. Nous croyons en la transparence, la sécurité et l'établissement de partenariats durables avec les entreprises à travers l'Afrique et au-delà.",
      versionLabel: "Version :",
      versionValue: "v2.4 (Édition Entreprise)",
      effectiveDateLabel: "Date d'entrée en vigueur :",
      lastUpdatedLabel: "Dernière mise à jour :",
      scopeLabel: "Périmètre :",
      scopeValue: "33 Articles Rédigés et Structurés",
      downloadPdf: "Télécharger PDF",
      printTerms: "Imprimer les Conditions",
      versionHistory: "Historique des Versions",
      counselReview: "Checklist pour Conseils Juridiques",
      testConsent: "Tester le Consentement",
      home: "Accueil",
      legalBreadcrumb: "Juridique",
    },
    toc: {
      title: "Table des Matières",
      readProgress: "lu",
      searchPlaceholder: "Rechercher dans les conditions...",
      matchCount: "articles trouvés",
      totalNumbered: "33 Articles Officiellement Numérotés",
      expandAll: "Tout Développer",
      collapseAll: "Tout Réduire",
      backToTop: "Retour en Haut de Page",
      jumpToSection: "Aller à l'Article",
      closeNavigator: "Fermer le Navigateur",
      sectionsTitle: "Table des Matières",
      jumpDirectly: "Accédez directement à l'un des 33 articles",
    },
    notice: {
      badge: "Projet pour Examen Juridique Pré-Publication",
      text: "Ce document contient des clauses exhaustives régissant la comptabilité cloud, le POS, la gestion multi-entrepôts et la protection des données en Afrique (NDPA 2023 & RGPD). Les balises d'entreprise sont prêtes pour validation juridique finale.",
      button: "Examiner les 6 Balises",
    },
    sectionControls: {
      copied: "Copié",
      link: "Lien",
      collapse: "Réduire l'article",
      expand: "Développer l'article",
      definitionsHeader: "Interprétation SaaS et Termes Définis",
      definedCount: "Termes Définis",
      termHeader: "Terme",
      meaningHeader: "Signification Contractuelle",
      saasComplianceNote: "Conformité SaaS : Testez la vérification et l'enregistrement de l'acceptation avec piste d'audit.",
      openConsentSimulator: "Ouvrir le Simulateur",
      corporateHeader: "Coordonnées Officielles MsmeBooks",
      hqLabel: "Siège Social & Juridiction",
      commLabel: "Communications & Vérifications",
      telephoneLabel: "Téléphone :",
      legalDeskLabel: "Département Juridique :",
      websiteLabel: "Site Web :",
    },
    categories: {
      "cat-foundations": "1. Fondements & Comptes",
      "cat-saas-scope": "2. Périmètre SaaS & Licences",
      "cat-data-compliance": "3. Protection des Données & Conformité",
      "cat-industry-modules": "4. Modules Spécialisés & Technologie",
      "cat-governance-partners": "5. Gouvernance & Partenaires",
      "cat-legal-liability": "6. Responsabilités & Juridiction",
    },
    sectionTranslations: {
      1: { title: "Introduction et Acceptation des Conditions", summary: "Établit l'accord contractuel contraignant entre MsmeBooks et ses abonnés, utilisateurs autorisés et entreprises clientes." },
      2: { title: "Définitions et Interprétation", summary: "Fournit des définitions juridiques et techniques précises des termes employés dans cet accord." },
      3: { title: "Éligibilité et Inscription au Compte", summary: "Définit qui peut ouvrir un compte, les normes de sécurité, la gestion des identifiants et la vérification d'entreprise." },
      4: { title: "Périmètre des Services SaaS MsmeBooks", summary: "Détaille les modules de gestion d'entreprise fournis par MsmeBooks et la disponibilité selon le forfait souscrit." },
      5: { title: "Forfaits d'Abonnement et Licences", summary: "Régit les concessions de licence, les paliers de forfaits, les quotas d'utilisateurs et les règles de mise à niveau." },
      6: { title: "Facturation, Paiements et Fiscalité", summary: "Définit la facturation récurrente, les modes de règlement, les échéances, les retenues à la source et la TVA applicable." },
      7: { title: "Remboursements, Résiliations et Fin d'Abonnement", summary: "Procédure de résiliation, critères d'éligibilité aux remboursements, fenêtres d'exportation des données et suppression de compte." },
      8: { title: "Propriété des Données Client et Confidentialité", summary: "Confirme la propriété exclusive des données client, les obligations NDPA 2023 / RGPD et les sous-traitants agréés." },
      9: { title: "Sécurité de l'Information et Protection de la Plateforme", summary: "Définit les mesures de sécurité techniques (chiffrement TLS 1.3 / AES-256), les audits et le modèle de responsabilité partagée." },
      10: { title: "Responsabilités Comptables, Financières et Fiscales", summary: "Précise que MsmeBooks fournit un outil informatique et ne délivre aucun conseil comptable, fiscal ou juridique agréé." },
      11: { title: "POS, Paiements et Traitement des Transactions", summary: "Régit les opérations de caisse, le matériel compatible, les prestataires de paiement intégrés et la gestion des litiges." },
      12: { title: "Inventaire, Entrepôts et Gestion des Stocks", summary: "Clauses régissant l'exactitude des stocks, les valorisations (FIFO), les inventaires physiques et les transferts inter-dépôts." },
      13: { title: "Paie, Ressources Humaines et Données Employés", summary: "Réglemente le traitement des fiches de paie, les déductions sociales obligatoires et les devoirs de l'employeur." },
      14: { title: "Hôtellerie, Restauration et Gestion Immobilière", summary: "Gestion des réservations, folios clients, bons de commande cuisine et politiques d'annulation propres à l'opérateur." },
      15: { title: "E-commerce, Marketplace et Applications Tierces", summary: "Encadre les passerelles e-commerce, les connecteurs externes et le partage sécurisé des données avec des API tierces." },
      16: { title: "Accès API et Utilisation Développeurs", summary: "Conditions d'utilisation des clés API, quotas de requêtes (rate limits) et interdiction stricte du moissonnage non autorisé." },
      17: { title: "Intelligence Artificielle et Fonctionnalités Automatisées", summary: "Encadre les prédictions automatisées, la vérification humaine obligatoire et les exclusions de responsabilité pour les rapports IA." },
      18: { title: "Politique d'Utilisation Acceptable", summary: "Définit les comportements strictement prohibés, incluant la fraude financière, les cyberattaques et l'exploitation illicite." },
      19: { title: "Droits de Propriété Intellectuelle", summary: "Protège les droits d'auteur, marques et interfaces de MsmeBooks tout en garantissant la propriété des contenus du client." },
      20: { title: "Disponibilité du Service, Maintenance et Mises à Jour", summary: "Engagements de disponibilité cloud, fenêtres de maintenance préventive et interventions d'urgence." },
      21: { title: "Support Technique et Assistance Client", summary: "Canaux de support, niveaux de service, délais de réponse et procédures d'escalade d'incidents." },
      22: { title: "Revendeurs, Affiliés et Partenaires Commerciaux", summary: "Régit les partenariats certifiés, l'éligibilité aux commissions et l'interdiction de fausses déclarations commerciales." },
      23: { title: "Services Professionnels et Consultants Indépendants", summary: "Distingue les prestations d'intégration officielles des cabinets comptables tiers mandatés par le client." },
      24: { title: "Confidentialité", summary: "Engagement mutuel de protection stricte des données commerciales, financières et stratégiques non publiques." },
      25: { title: "Garanties et Décharges de Responsabilité", summary: "Fourniture du service « EN L'ÉTAT » et préservation des droits statutaires impératifs des consommateurs." },
      26: { title: "Limitation de Responsabilité", summary: "Plafond d'indemnisation financière et exclusion des dommages indirects sous réserve d'approbation juridique." },
      27: { title: "Indemnisation", summary: "Obligation d'indemnisation incombant au client en cas d'utilisation illégale de la plateforme ou d'infraction fiscale." },
      28: { title: "Suspension et Résiliation de Compte", summary: "Motifs légitimes de suspension (défaut de paiement, fraude), préavis de remédiation et effets post-résiliation." },
      29: { title: "Utilisateurs Internationaux et Services Transfrontaliers", summary: "Services multi-devises à travers l'Afrique et le monde, respect des embargos et conformité aux réglementations locales." },
      30: { title: "Droit Applicable et Résolution des Différends", summary: "Droit applicable, négociations amiables préalables, médiation et arbitrage commercial exécutoire." },
      31: { title: "Modifications des Conditions Générales", summary: "Procédure de révision des clauses, préavis de 30 jours pour changements substantiels et archivage des versions." },
      32: { title: "Dispositions Juridiques Générales", summary: "Divisibilité, intégralité de l'accord, force majeure, absence de renonciation et survie des clauses clés." },
      33: { title: "Coordonnées Officielles et Demandes Juridiques", summary: "Adresses de notification formelle, contacts officiels du siège et canaux de conformité réglementaire." }
    },
    definitionTranslations: {
      "MsmeBooks / Company / Provider": { term: "MsmeBooks / Entreprise / Prestataire", definition: "L'entité technologique [MsmeBooks Technologies Ltd / Insérer l'Entité Enregistrée], exploitant de la plateforme cloud accessible sur www.msmebooks.org." },
      "Customer / Subscriber": { term: "Client / Abonné", definition: "La micro, petite ou moyenne entreprise, société ou professionnel souscrivant aux Services par ouverture de compte ou paiement d'un abonnement." },
      "Authorized User": { term: "Utilisateur Autorisé", definition: "Tout employé, dirigeant, comptable, auditeur ou sous-traitant habilité par le Client à se connecter à la plateforme sous ses identifiants." },
      "Account Administrator": { term: "Administrateur de Compte", definition: "L'utilisateur principal désigné pour gérer les paramètres, attribuer les accès, acheter des options et engager financièrement le Client." },
      "Services / Platform": { term: "Services / Plateforme", definition: "La suite logicielle cloud propriétaire comprenant Comptabilité, Point de Vente (POS), Gestion des Stocks, Paie, Hôtellerie, APIs et applications mobiles." },
      "Subscription Plan": { term: "Forfait d'Abonnement", definition: "L'offre commerciale souscrite (Gratuit, Croissance, Entreprise ou Sur-Mesure) définissant les fonctionnalités, sièges utilisateurs et cycles de facturation." },
      "Customer Data": { term: "Données Client", definition: "L'ensemble des écritures financières, factures, fiches de stock, répertoires clients et données de paie téléversés ou générés par le Client." },
      "Personal Data": { term: "Données Personnelles", definition: "Toute information se rapportant à une personne physique identifiée ou identifiable au sens de la NDPA 2023, du RGPD et des lois applicables." },
      "Third-Party Services": { term: "Services Tiers", definition: "Matériels externes, passerelles bancaires, passerelles SMS, hébergeurs cloud et extensions non détenus par MsmeBooks." },
      "Add-On Modules": { term: "Modules Complémentaires", definition: "Fonctionnalités optionnelles, licences de succursales supplémentaires ou sièges additionnels souscrits hors du forfait de base." },
      "Billing Cycle": { term: "Cycle de Facturation", definition: "La périodicité récurrente de paiement convenue (mensuelle, trimestrielle ou annuelle) choisie par le Client." },
      "Service Availability": { term: "Disponibilité du Service", definition: "Le taux d'accessibilité en ligne de la plateforme cloud de production, hors périodes de maintenance programmée." },
      "Intellectual Property": { term: "Propriété Intellectuelle", definition: "Tous brevets, droits d'auteur, marques, secrets d'affaires, algorithmes, interfaces graphiques, codes sources et noms de domaine." },
      "Confidential Information": { term: "Informations Confidentielles", definition: "Toute information commerciale, technique, financière ou stratégique non publique transmise entre les parties." },
      "Acceptable Use": { term: "Usage Acceptable", definition: "L'ensemble des règles opérationnelles régissant une utilisation licite, sécurisée et non disruptive de l'infrastructure MsmeBooks." }
    },
    relatedDocs: {
      frameworkTag: "Cadre de Gouvernance & Conformité",
      heading: "Documents Juridiques & Politiques Connexes",
      description: "Ces Conditions Générales s'articulent avec notre dispositif juridique complet. Cliquez sur un document pour en consulter le champ d'application.",
      statusPublished: "Publié",
      statusPending: "Disponible sur Demande",
      updatedPrefix: "Mis à jour en",
      quickView: "Aperçu Rapide",
      statusLabel: "Statut Opérationnel :",
      lastUpdatedLabel: "Dernière Mise à Jour :",
      summaryHeading: "Synthèse Exécutive",
      closeButton: "Fermer",
      requestCopy: "Demander la Copie Complète",
    },
    chat: {
      triggerLabel: "Chat en Direct",
      onlineStatus: "En Ligne",
      dialogTitle: "Support MsmeBooks",
      repliesIn: "Répond généralement en moins de 5 minutes",
      tabChat: "Chat Agent",
      tabChannels: "Canaux",
      tabFaqs: "FAQ",
      startTitle: "Démarrer une Conversation",
      startDesc: "Veuillez renseigner vos coordonnées pour qu'un agent juridique ou commercial spécialisé prenne en charge votre demande.",
      nameLabel: "Nom Complet / Entreprise *",
      namePlaceholder: "ex. Jean-Paul Kouamé",
      emailLabel: "Adresse E-mail Professionnelle *",
      emailPlaceholder: "jp@monentreprise.ci",
      topicLabel: "Objet de la Demande",
      connectBtn: "Contacter un Agent",
      typePlaceholder: "Écrivez votre message...",
      typingIndicator: "L'agent rédige une réponse...",
      directDesksTitle: "Bureaux Directs d'Entreprise",
      directDesksDesc: "Joignez les représentants de MsmeBooks par messagerie, téléphone ou e-mail.",
      whatsappTitle: "Bureau WhatsApp Officiel",
      whatsappDesc: "Canal le plus rapide pour la facturation et les questions urgentes.",
      supportDeskTitle: "Assistance Technique",
      supportDeskDesc: "Pour les diagnostics logiciels et signalements d'incidents.",
      legalDeskTitle: "Département Juridique & Conformité",
      legalDeskDesc: "Notifications officielles, accords de sous-traitance DPA et contrats grands comptes.",
      commonFaqsTitle: "Questions Fréquentes sur les Conditions",
    },
    modals: {
      consentTitle: "Simulateur de Consentement d'Inscription SaaS",
      consentSubtitle: "Workflow Contractuel Audité selon l'Article 7 & NDPA 2023",
      consentDesc: "Découvrez le protocole de consentement contractuel affirmatif et non présélectionné de MsmeBooks. Chaque inscription génère un horodatage cryptographique audité.",
      businessNameLabel: "Nom de l'Entreprise / Raison Sociale",
      emailLabel: "E-mail de l'Administrateur du Compte",
      planLabel: "Forfait d'Abonnement Sélectionné",
      termsAgreedPrefix: "J'ai lu et j'accepte les",
      termsAgreedLink: "Conditions Générales de MsmeBooks",
      termsAgreedMid: "et je prends acte de la",
      privacyLink: "Politique de Confidentialité",
      mandatoryNote: "* Case à cocher affirmative et non pré-cochée imposée par la loi. Les cases pré-cochées sont strictement prohibées.",
      marketingConsent: "(Facultatif) Recevoir les actualités produits, guides comptables et nouveautés par e-mail.",
      cancelBtn: "Annuler",
      submitConsentBtn: "Valider l'Inscription & Créer l'Audit",
      verifiedSuccessTitle: "Consentement Vérifié et Enregistré",
      verifiedSuccessDesc: "L'enregistrement d'acceptation contractuelle a été scellé dans la piste d'audit de sécurité MsmeBooks.",
      auditPayloadLabel: "Données de la Piste d'Audit Cryptographique (JSON) :",
      copyJsonBtn: "Copier JSON",
      copiedBtn: "Copié !",
      testAnotherBtn: "← Tester une Autre Inscription",
      doneBtn: "Terminé",
      checklistTitle: "Checklist Pré-Publication pour Conseils Juridiques",
      checklistSubtitle: "Points d'Attention pour Avocats & Juristes d'Entreprise",
      checklistBanner: "Conformément aux spécifications SaaS, ces 6 balises contractuelles sont expressément isolées. Un conseiller juridique habilité doit approuver ces éléments avant publication officielle.",
      viewInSecBtn: "Voir à l'Art.",
      exportChecklistBtn: "Exporter la Checklist",
      dismissBtn: "Fermer la Checklist",
      versionTitle: "Historique des Versions des Conditions",
      versionSubtitle: "Registre Officiel des Révisions et Archives",
      currentActiveTag: "Version Active en Vigueur",
      effectiveLabel: "Prise d'effet :",
      keyModificationsLabel: "Principales Évolutions :",
      closeVersionBtn: "Fermer l'Archive",
    },
    footer: {
      mission: "Logiciel de gestion cloud tout-en-un réunissant Comptabilité, Caisse (POS), Multi-Entrepôts et Paie pour développer les PME en Afrique et sur les marchés émergents.",
      serving: "Lagos & Abuja, Nigeria · Déploiement Panafricain et International",
      platformTitle: "Plateforme",
      companyTitle: "Entreprise",
      resourcesTitle: "Ressources",
      legalTitle: "Confiance & Légal",
      rights: "MsmeBooks Technologies Ltd. Tous droits réservés. Enregistré selon les lois commerciales applicables.",
      ndpaTag: "Conforme NDPA 2023",
      sslTag: "Chiffrement SSL 256 bits",
      cloudTag: "Cloud SaaS Panafricain",
    },
    leftNav: {
      upTooltip: "Haut : Article Précédent",
      downTooltip: "Bas : Article Suivant",
      topTooltip: "Haut de Page",
      bottomTooltip: "Bas de Page",
    }
  },

  pt: {
    nav: {
      platform: "Plataforma",
      solutions: "Soluções",
      pricing: "Preços",
      resources: "Recursos",
      legal: "Termos & Condições",
      checklist: "Checklist Jurídico",
      consentSimulator: "Simulador de Consentimento",
      jumpTo: "Ir para...",
    },
    hero: {
      agreementType: "Contrato Principal SaaS Oficial",
      subtitle: "Termos Claros. Tecnologia Confiável. Melhores Negócios.",
      quote: "Bem-vindo ao MsmeBooks. Estes Termos e Condições explicam as regras, responsabilidades, direitos e obrigações que regem o acesso e uso de nossas soluções na nuvem de contabilidade, ponto de venda (POS), estoque e gestão empresarial. Acreditamos na transparência, segurança e em relações duradouras com empresas em toda a África e além.",
      versionLabel: "Versão:",
      versionValue: "v2.4 (Edição Empresarial)",
      effectiveDateLabel: "Data de Vigência:",
      lastUpdatedLabel: "Última Atualização:",
      scopeLabel: "Abrangência:",
      scopeValue: "33 Seções Formalmente Redigidas",
      downloadPdf: "Baixar PDF",
      printTerms: "Imprimir Termos",
      versionHistory: "Histórico de Versões",
      counselReview: "Checklist para Assessoria Jurídica",
      testConsent: "Testar Consentimento",
      home: "Início",
      legalBreadcrumb: "Jurídico",
    },
    toc: {
      title: "Índice de Conteúdo",
      readProgress: "lido",
      searchPlaceholder: "Pesquisar nos termos...",
      matchCount: "seções encontradas",
      totalNumbered: "33 Seções Formalmente Numeradas",
      expandAll: "Expandir Tudo",
      collapseAll: "Recolher Tudo",
      backToTop: "Voltar ao Topo da Página",
      jumpToSection: "Ir para Seção",
      closeNavigator: "Fechar Navegador",
      sectionsTitle: "Índice de Conteúdo",
      jumpDirectly: "Navegue diretamente para qualquer uma das 33 seções",
    },
    notice: {
      badge: "Minuta de Pré-Publicação para Assessoria Jurídica",
      text: "Este documento contém cláusulas completas sobre contabilidade em nuvem, POS, estoques filiais e proteção de dados em África (NDPA 2023 & RGPD). Marcadores corporativos prontos para validação final.",
      button: "Revisar 6 Marcadores",
    },
    sectionControls: {
      copied: "Copiado",
      link: "Link",
      collapse: "Recolher seção",
      expand: "Expandir seção",
      definitionsHeader: "Interpretação SaaS e Termos Definidos",
      definedCount: "Termos Definidos",
      termHeader: "Termo",
      meaningHeader: "Significado Contratual",
      saasComplianceNote: "Conformidade SaaS: Teste como a aceitação do usuário é verificada e gravada com trilhas de auditoria.",
      openConsentSimulator: "Abrir Simulador",
      corporateHeader: "Coordenadas Corporativas Oficiais MsmeBooks",
      hqLabel: "Sede & Jurisdição",
      commLabel: "Comunicações & Verificação",
      telephoneLabel: "Telefone:",
      legalDeskLabel: "Departamento Jurídico:",
      websiteLabel: "Website:",
    },
    categories: {
      "cat-foundations": "1. Fundamentos & Contas",
      "cat-saas-scope": "2. Escopo SaaS & Licenciamento",
      "cat-data-compliance": "3. Proteção de Dados & Conformidade",
      "cat-industry-modules": "4. Módulos Especializados & Tecnologia",
      "cat-governance-partners": "5. Governança & Parceiros",
      "cat-legal-liability": "6. Responsabilidades & Jurisdição",
    },
    sectionTranslations: {
      1: { title: "Introdução e Aceitação dos Termos", summary: "Estabelece o vínculo contratual vinculativo entre o MsmeBooks e seus assinantes, usuários autorizados e empresas." },
      2: { title: "Definições e Interpretação", summary: "Fornece definições jurídicas e técnicas precisas dos termos empregados ao longo deste Contrato." },
      3: { title: "Elegibilidade e Cadastro de Conta", summary: "Define quem pode registrar uma conta, padrões de segurança, gestão de credenciais e verificação comercial." },
      4: { title: "Escopo dos Serviços SaaS MsmeBooks", summary: "Detalha os módulos de gestão empresarial oferecidos pelo MsmeBooks e a disponibilidade conforme o plano contratado." },
      5: { title: "Planos de Assinatura e Licenciamento", summary: "Regula concessões de licença, faixas de planos, limites de usuários e regras de upgrade e downgrade." },
      6: { title: "Faturamento, Pagamentos e Tributos", summary: "Regula o faturamento recorrente, métodos aceitos, retenções na fonte e o tratamento tributário do IVA." },
      7: { title: "Reembolsos, Cancelamentos e Rescisão", summary: "Procedimentos de cancelamento, elegibilidade a reembolso, período de exportação de dados e exclusão de conta." },
      8: { title: "Propriedade dos Dados do Cliente e Privacidade", summary: "Confirma a titularidade dos dados pelo cliente, obrigações sob a NDPA 2023 / RGPD e subprocessadores autorizados." },
      9: { title: "Segurança da Informação e Proteção da Plataforma", summary: "Define controles técnicos (criptografia TLS 1.3 / AES-256), monitoramento e o modelo de responsabilidade compartilhada." },
      10: { title: "Responsabilidades Contábeis, Fiscais e Financeiras", summary: "Esclarece que o software é uma ferramenta automatizada e não substitui consultoria contábil, fiscal ou jurídica habilitada." },
      11: { title: "POS, Pagamentos e Processamento de Transações", summary: "Abrange operações de balcão, compatibilidade de hardware, intermediadores integrados e resolução de disputas." },
      12: { title: "Gestão de Estoque, Armazéns e Mercadorias", summary: "Cláusulas sobre exatidão de estoques, métodos de valoração (FIFO), inventários físicos e perdas de estoque." },
      13: { title: "Folha de Pagamento, RH e Dados de Funcionários", summary: "Regula cálculos de salários, retenções previdenciárias obrigatórias e deveres de sigilo do empregador." },
      14: { title: "Hotelaria, Restaurantes e Gestão de Propriedades", summary: "Registros de reservas, folios de hóspedes, pedidos de cozinha e políticas próprias de cancelamento do estabelecimento." },
      15: { title: "Comércio Eletrônico, Marketplace e Apps de Terceiros", summary: "Regula integrações com lojas virtuais, conectores de marketplace e compartilhamento seguro via APIs." },
      16: { title: "Acesso a APIs e Uso por Desenvolvedores", summary: "Termos de uso de chaves de API, limites de requisições por minuto e proibição de raspagem não autorizada." },
      17: { title: "Inteligência Artificial e Recursos Automatizados", summary: "Regula sugestões por IA, necessidade de verificação humana e isenção de garantia para relatórios preditivos." },
      18: { title: "Política de Uso Aceitável", summary: "Define condutas expressamente proibidas, incluindo fraude, evasão fiscal, distribuição de malware e engenharia reversa." },
      19: { title: "Direitos de Propriedade Intelectual", summary: "Protege o código, marcas e interfaces do MsmeBooks, preservando a titularidade dos conteúdos inseridos pelo cliente." },
      20: { title: "Disponibilidade do Serviço, Manutenção e Atualizações", summary: "Metas de disponibilidade em nuvem, janelas de manutenção preventiva e manutenções emergenciais." },
      21: { title: "Suporte Técnico e Assistência ao Cliente", summary: "Canais de atendimento, níveis de serviço, tempos de resposta acordados e fluxos de escalonamento." },
      22: { title: "Revendedores, Afiliados e Parceiros Comerciais", summary: "Normas para canais autorizados, regras de comissionamento e vedação a representações inverídicas da marca." },
      23: { title: "Serviços Profissionais e Consultores Terceirizados", summary: "Distingue implantações oficiais de escritórios contábeis independentes contratados diretamente pelo cliente." },
      24: { title: "Confidencialidade", summary: "Obrigação mútua de proteção rigorosa de segredos comerciais, dados contábeis e informações estratégicas." },
      25: { title: "Garantias e Isenções Legais", summary: "Prestação de serviço «NO ESTADO EM QUE SE ENCONTRA» resguardados os direitos consumeristas inalienáveis." },
      26: { title: "Limitação de Responsabilidade", summary: "Exclusão de danos indiretos e teto de indenização financeira submetido à chancela da assessoria jurídica." },
      27: { title: "Indenização", summary: "Dever de indenizar do cliente por infrações à lei, manuseio irregular de dados pessoais ou sonegação fiscal." },
      28: { title: "Suspensão e Rescisão", summary: "Hipóteses de bloqueio de conta por inadimplemento ou fraude, prazos de cura e desfecho contratual." },
      29: { title: "Usuários Internacionais e Serviços Transfronteiriços", summary: "Suporte a transações em múltiplas moedas na África e internacionalmente, cumprimento de sanções e leis locais." },
      30: { title: "Legislação Aplicável e Resolução de Conflitos", summary: "Direito aplicável, tentativa prévia de conciliação amigável e arbitragem comercial vinculante." },
      31: { title: "Alterações nos Termos e Condições", summary: "Mecanismos de atualização, aviso prévio de 30 dias para alterações materiais e consulta a versões anteriores." },
      32: { title: "Disposições Gerais", summary: "Cláusulas de autonomia contratual, integralidade do acordo, força maior e vigência pós-rescisão." },
      33: { title: "Informações de Contato e Notificações Legais", summary: "Endereços corporativos oficiais, contatos de suporte e canais formais de compliance." }
    },
    definitionTranslations: {
      "MsmeBooks / Company / Provider": { term: "MsmeBooks / Empresa / Provedor", definition: "A entidade tecnológica [MsmeBooks Technologies Ltd / Inserir Entidade Registrada], fornecedora da plataforma em nuvem acessível em www.msmebooks.org." },
      "Customer / Subscriber": { term: "Cliente / Assinante", definition: "A micro, pequena ou média empresa, corporação ou comerciante que adere a este Contrato ao cadastrar-se ou adquirir um plano." },
      "Authorized User": { term: "Usuário Autorizado", definition: "Qualquer funcionário, contador, auditor ou agente credenciado pelo Cliente para acessar a plataforma sob a conta corporativa." },
      "Account Administrator": { term: "Administrador de Conta", definition: "O usuário primário credenciado pelo Cliente para configurar acessos, gerenciar faturamento e vincular a empresa." },
      "Services / Platform": { term: "Serviços / Plataforma", definition: "A suíte de módulos de software em nuvem incluindo Contabilidade, Ponto de Venda (POS), Estoque, Folha de Pagamento, Hotelaria e APIs." },
      "Subscription Plan": { term: "Plano de Assinatura", definition: "O pacote comercial contratado (Gratuito, Crescimento, Empresarial ou Personalizado) especificando recursos, usuários e ciclos." },
      "Customer Data": { term: "Dados do Cliente", definition: "Todos os registros contábeis, notas fiscais, movimentações de estoque, cadastros de clientes e dados de folha inseridos na plataforma." },
      "Personal Data": { term: "Dados Pessoais", definition: "Qualquer informação relativa a pessoa natural identificada ou identificável, nos termos da NDPA 2023, do RGPD e leis pertinentes." },
      "Third-Party Services": { term: "Serviços de Terceiros", definition: "Hardwares externos, intermediadores de pagamento, gateways bancários e extensões não operados pelo MsmeBooks." },
      "Add-On Modules": { term: "Módulos Adicionais", definition: "Recursos extras, licenças para novas filiais ou expansão de assentos adquiridos além do plano base." },
      "Billing Cycle": { term: "Ciclo de Faturamento", definition: "A frequência periódica de cobrança da assinatura (mensal, trimestral ou anual) escolhida pelo Cliente." },
      "Service Availability": { term: "Disponibilidade do Serviço", definition: "O tempo operacional em que a plataforma em nuvem permanece acessível online, ressalvadas manutenções programadas." },
      "Intellectual Property": { term: "Propriedade Intelectual", definition: "Todas as patentes, direitos autorais, marcas registradas, códigos-fonte, algoritmos, designs e nomes de domínio." },
      "Confidential Information": { term: "Informações Confidenciais", definition: "Dados estratégicos, financeiros, operacionais ou técnicos não públicos revelados entre as partes." },
      "Acceptable Use": { term: "Uso Aceitável", definition: "O conjunto de parâmetros operacionais que asseguram o uso lícito, íntegro e seguro da infraestrutura MsmeBooks." }
    },
    relatedDocs: {
      frameworkTag: "Estrutura de Governança & Conformidade",
      heading: "Políticas & Documentos Jurídicos Relacionados",
      description: "Estes Termos operam em harmonia com nosso arcabouço normativo completo. Selecione qualquer documento para conferir o escopo.",
      statusPublished: "Publicado",
      statusPending: "Disponível sob Consulta",
      updatedPrefix: "Atualizado em",
      quickView: "Visualização Rápida",
      statusLabel: "Status Operacional:",
      lastUpdatedLabel: "Última Atualização:",
      summaryHeading: "Sumário Executivo",
      closeButton: "Fechar",
      requestCopy: "Solicitar Cópia Completa",
    },
    chat: {
      triggerLabel: "Chat ao Vivo",
      onlineStatus: "Online",
      dialogTitle: "Suporte MsmeBooks",
      repliesIn: "Normalmente responde em menos de 5 minutos",
      tabChat: "Chat com Atendente",
      tabChannels: "Canais",
      tabFaqs: "Perguntas",
      startTitle: "Iniciar Conversa",
      startDesc: "Informe seus dados para direcionarmos seu chamado a um especialista jurídico ou de faturamento.",
      nameLabel: "Seu Nome Completo / Empresa *",
      namePlaceholder: "ex.: Manuel dos Santos",
      emailLabel: "E-mail Corporativo *",
      emailPlaceholder: "manuel@minhaempresa.co.ao",
      topicLabel: "Assunto da Consulta",
      connectBtn: "Falar com Atendente",
      typePlaceholder: "Digite sua mensagem...",
      typingIndicator: "Atendente está digitando...",
      directDesksTitle: "Mesas Diretas Corporativas",
      directDesksDesc: "Fale com os representantes do MsmeBooks por aplicativo, telefone ou e-mail.",
      whatsappTitle: "Canal Oficial WhatsApp",
      whatsappDesc: "Atendimento mais rápido para dúvidas financeiras e implantação.",
      supportDeskTitle: "Mesa de Suporte Técnico",
      supportDeskDesc: "Para assistência técnica de software e relatórios de erro.",
      legalDeskTitle: "Departamento Jurídico e Compliance",
      legalDeskDesc: "Notificações oficiais, acordos de processamento DPA e contratos empresariais.",
      commonFaqsTitle: "Perguntas Frequentes sobre os Termos",
    },
    modals: {
      consentTitle: "Simulador de Consentimento de Cadastro SaaS",
      consentSubtitle: "Fluxo Contratual Auditado sob Artigo 7 e NDPA 2023",
      consentDesc: "Conheça o protocolo de consentimento afirmativo e sem caixas pré-marcadas do MsmeBooks. Cada adesão registra uma trilha criptográfica auditada.",
      businessNameLabel: "Nome da Empresa / Razão Social",
      emailLabel: "E-mail do Administrador da Conta",
      planLabel: "Plano de Assinatura Selecionado",
      termsAgreedPrefix: "Li e concordo com os",
      termsAgreedLink: "Termos e Condições do MsmeBooks",
      termsAgreedMid: "e tomo conhecimento da",
      privacyLink: "Política de Privacidade",
      mandatoryNote: "* Caixa de seleção afirmativa e não pré-marcada exigida por lei. Caixas pré-selecionadas são proibidas.",
      marketingConsent: "(Opcional) Desejo receber atualizações, guias de gestão e novidades por e-mail.",
      cancelBtn: "Cancelar",
      submitConsentBtn: "Concluir Cadastro & Gravar Auditoria",
      verifiedSuccessTitle: "Consentimento Verificado e Gravado",
      verifiedSuccessDesc: "O registro formal de aceitação contratual foi gravado na trilha de auditoria do MsmeBooks.",
      auditPayloadLabel: "Carga de Dados Criptográficos da Auditoria (JSON):",
      copyJsonBtn: "Copiar JSON",
      copiedBtn: "Copiado!",
      testAnotherBtn: "← Testar Outro Cadastro",
      doneBtn: "Concluído",
      checklistTitle: "Checklist Pré-Publicação para Assessoria Jurídica",
      checklistSubtitle: "Itens de Ação para Advogados e Juristas Corporativos",
      checklistBanner: "Conforme estipulado no escopo mestre, estes 6 marcadores estão explicitamente destacados. O corpo jurídico qualificado deve aprová-los antes da publicação oficial.",
      viewInSecBtn: "Ver na Seção",
      exportChecklistBtn: "Exportar Checklist",
      dismissBtn: "Fechar Checklist",
      versionTitle: "Histórico de Versões dos Termos",
      versionSubtitle: "Registro de Revisões Formais e Arquivo",
      currentActiveTag: "Versão Vigente Atual",
      effectiveLabel: "Vigência:",
      keyModificationsLabel: "Principais Alterações:",
      closeVersionBtn: "Fechar Arquivo",
    },
    footer: {
      mission: "Software de gestão empresarial na nuvem unificando Contabilidade, Ponto de Venda (POS), Estoque e Folha de Pagamento para impulsionar PMEs na África e mercados globais.",
      serving: "Lagos & Abuja, Nigéria · Atuação Panafricana e Internacional",
      platformTitle: "Plataforma",
      companyTitle: "Empresa",
      resourcesTitle: "Recursos",
      legalTitle: "Confiança & Jurídico",
      rights: "MsmeBooks Technologies Ltd. Todos os direitos reservados. Registrada conforme a legislação comercial aplicável.",
      ndpaTag: "Em conformidade com a NDPA 2023",
      sslTag: "Criptografia SSL de 256 bits",
      cloudTag: "Nuvem SaaS Panafricana",
    },
    leftNav: {
      upTooltip: "Cima: Seção Anterior",
      downTooltip: "Baixo: Próxima Seção",
      topTooltip: "Topo da Página",
      bottomTooltip: "Fim da Página",
    }
  },

  es: {
    nav: {
      platform: "Plataforma",
      solutions: "Soluciones",
      pricing: "Precios",
      resources: "Recursos",
      legal: "Términos y Condiciones",
      checklist: "Checklist Legal",
      consentSimulator: "Simulador de Consentimiento",
      jumpTo: "Ir a...",
    },
    hero: {
      agreementType: "Contrato Marco SaaS Oficial",
      subtitle: "Términos Claros. Tecnología Confiable. Mejores Negocios.",
      quote: "Bienvenido a MsmeBooks. Estos Términos y Condiciones explican las normas, responsabilidades, derechos y obligaciones que rigen el acceso y uso de nuestras soluciones en la nube de contabilidad, punto de venta (POS), inventario y gestión empresarial. Creemos en la transparencia, la seguridad y en construir relaciones duraderas con las empresas en África y en todo el mundo.",
      versionLabel: "Versión:",
      versionValue: "v2.4 (Edición Empresarial)",
      effectiveDateLabel: "Fecha de Entrada en Vigor:",
      lastUpdatedLabel: "Última Actualización:",
      scopeLabel: "Alcance:",
      scopeValue: "33 Secciones Formalmente Redactadas",
      downloadPdf: "Descargar PDF",
      printTerms: "Imprimir Términos",
      versionHistory: "Historial de Versiones",
      counselReview: "Checklist para Asesoría Legal",
      testConsent: "Probar Consentimiento",
      home: "Inicio",
      legalBreadcrumb: "Legal",
    },
    toc: {
      title: "Tabla de Contenidos",
      readProgress: "leído",
      searchPlaceholder: "Buscar en los términos...",
      matchCount: "secciones encontradas",
      totalNumbered: "33 Secciones Formalmente Numeradas",
      expandAll: "Expandir Todo",
      collapseAll: "Contraer Todo",
      backToTop: "Volver al Inicio de Página",
      jumpToSection: "Ir a Sección",
      closeNavigator: "Cerrar Navegador",
      sectionsTitle: "Tabla de Contenidos",
      jumpDirectly: "Navegue directamente a cualquiera de las 33 secciones",
    },
    notice: {
      badge: "Borrador de Prepublicación para Asesoría Legal",
      text: "Este documento contiene disposiciones completas sobre contabilidad en la nube, POS, almacenes múltiples y protección de datos en África (NDPA 2023 y RGPD). Marcadores corporativos listos para validación final.",
      button: "Revisar 6 Marcadores",
    },
    sectionControls: {
      copied: "Copiado",
      link: "Enlace",
      collapse: "Contraer sección",
      expand: "Expandir sección",
      definitionsHeader: "Interpretación SaaS y Términos Definidos",
      definedCount: "Términos Definidos",
      termHeader: "Término",
      meaningHeader: "Significado Contractual",
      saasComplianceNote: "Conformidad SaaS: Compruebe cómo se valida y registra el consentimiento del usuario con pistas de auditoría.",
      openConsentSimulator: "Abrir Simulador",
      corporateHeader: "Coordenadas Corporativas Oficiales de MsmeBooks",
      hqLabel: "Sede Central & Jurisdicción",
      commLabel: "Comunicaciones & Verificación",
      telephoneLabel: "Teléfono:",
      legalDeskLabel: "Departamento Legal:",
      websiteLabel: "Sitio Web:",
    },
    categories: {
      "cat-foundations": "1. Fundamentos & Cuentas",
      "cat-saas-scope": "2. Alcance SaaS & Licenciamiento",
      "cat-data-compliance": "3. Protección de Datos & Cumplimiento",
      "cat-industry-modules": "4. Módulos Especializados & Tecnología",
      "cat-governance-partners": "5. Gobernanza & Socios",
      "cat-legal-liability": "6. Responsabilidades & Jurisdicción",
    },
    sectionTranslations: {
      1: { title: "Introducción y Aceptación de los Términos", summary: "Establece el acuerdo contractual vinculante entre MsmeBooks y sus suscriptores, usuarios autorizados y empresas." },
      2: { title: "Definiciones e Interpretación", summary: "Proporciona definiciones legales y técnicas precisas de los términos utilizados a lo largo de este Contrato." },
      3: { title: "Elegibilidad y Registro de Cuenta", summary: "Define quién puede registrar una cuenta, normas de seguridad, gestión de credenciales y verificación empresarial." },
      4: { title: "Alcance de los Servicios SaaS de MsmeBooks", summary: "Detalla los módulos de gestión empresarial ofrecidos por MsmeBooks y su disponibilidad según el plan contratado." },
      5: { title: "Planes de Suscripción y Licenciamiento", summary: "Regula las concesiones de licencia, niveles de planes, límites de usuarios y reglas de cambio de plan." },
      6: { title: "Facturación, Pagos e Impuestos", summary: "Regula la facturación periódica, métodos de pago, retenciones en la fuente y tratamiento del IVA." },
      7: { title: "Reembolsos, Cancelaciones y Rescisión", summary: "Procedimiento de cancelación, elegibilidad para reembolsos, plazo de descarga de datos y eliminación de cuenta." },
      8: { title: "Propiedad de los Datos del Cliente y Privacidad", summary: "Confirma la titularidad de los datos por parte del cliente, deberes bajo NDPA 2023 / RGPD y subencargados." },
      9: { title: "Seguridad de la Información y Protección", summary: "Establece controles técnicos de seguridad (cifrado TLS 1.3 / AES-256), auditorías y responsabilidad compartida." },
      10: { title: "Responsabilidades Contables, Financieras y Fiscales", summary: "Aclara que el software es una herramienta computacional y no constituye asesoría contable o fiscal certificada." },
      11: { title: "POS, Pagos y Procesamiento de Transacciones", summary: "Regula ventas en mostrador, hardware compatible, pasarelas de pago integradas y resolución de disputas." },
      12: { title: "Inventario, Almacén y Gestión de Existencias", summary: "Cláusulas sobre precisión de existencias, métodos de valoración (FIFO), inventarios físicos y mermas." },
      13: { title: "Nómina, Recursos Humanos y Datos de Empleados", summary: "Regula el cálculo de remuneraciones, deducciones legales obligatorias y deberes de confidencialidad laboral." },
      14: { title: "Hostelería, Restaurantes y Gestión Inmobiliaria", summary: "Gestión de reservas, folios de huéspedes, comandas de cocina y políticas propias de cancelación del operador." },
      15: { title: "Comercio Electrónico, Marketplace y Apps de Terceros", summary: "Regula tiendas online vinculadas, conectores externos y el intercambio seguro de datos mediante APIs." },
      16: { title: "Acceso a APIs y Uso por Desarrolladores", summary: "Condiciones de credenciales de API, límites de peticiones por minuto y prohibición de extracción no autorizada." },
      17: { title: "Inteligencia Artificial y Funciones Automatizadas", summary: "Regula estimaciones por IA, el requisito de verificación humana y exención de garantía sobre cálculos predictivos." },
      18: { title: "Política de Uso Aceptable", summary: "Define conductas estrictamente prohibidas, incluyendo fraude, evasión fiscal, distribución de malware y hackeo." },
      19: { title: "Derechos de Propiedad Intelectual", summary: "Protege el código, marcas registradas e interfaces de MsmeBooks, preservando los contenidos propios del cliente." },
      20: { title: "Disponibilidad del Servicio, Mantenimiento y Actualizaciones", summary: "Objetivos de disponibilidad cloud, mantenimiento programado y parches de seguridad de emergencia." },
      21: { title: "Soporte Técnico y Asistencia al Cliente", summary: "Canales de soporte, niveles de servicio, tiempos de respuesta comprometidos y protocolos de escalamiento." },
      22: { title: "Distribuidores, Afiliados y Socios Comerciales", summary: "Normas para canales autorizados, condiciones de comisiones y prohibición de declaraciones engañosas." },
      23: { title: "Servicios Profesionales y Consultores Independientes", summary: "Diferencia los servicios oficiales de MsmeBooks respecto a firmas contables independientes contratadas por el cliente." },
      24: { title: "Confidencialidad", summary: "Obligación mutua de estricta protección de información comercial, financiera y técnica de carácter no público." },
      25: { title: "Garantías y Renuncias Legales", summary: "Suministro del servicio «TAL CUAL» y preservación de los derechos irrenunciables de los consumidores." },
      26: { title: "Limitación de Responsabilidad", summary: "Exclusión de daños indirectos y límite económico de responsabilidad sujeto a revisión de la asesoría legal." },
      27: { title: "Indemnización", summary: "Deber de indemnizar que asume el cliente por uso ilícito de la plataforma, infracciones de privacidad o faltas fiscales." },
      28: { title: "Suspensión y Terminación", summary: "Causales de suspensión por impago o actividades ilícitas, plazos de subsanación y efectos de la terminación." },
      29: { title: "Usuarios Internacionales y Servicios Transfronterizos", summary: "Soporte multi-moneda para África y el mercado global, cumplimiento de sanciones y normativas locales." },
      30: { title: "Ley Aplicable y Resolución de Disputas", summary: "Legislación aplicable, negociación informal previa de buena fe y arbitraje comercial vinculante." },
      31: { title: "Modificaciones a los Términos y Condiciones", summary: "Procedimiento de actualización, aviso previo de 30 días para cambios sustanciales y archivo de versiones." },
      32: { title: "Disposiciones Generales", summary: "Independencia de cláusulas, acuerdo completo, fuerza mayor, no renuncia y vigencia posterior." },
      33: { title: "Información de Contacto y Notificaciones Legales", summary: "Coordenadas oficiales de la sede, canales de notificación legal y puntos de contacto de compliance." }
    },
    definitionTranslations: {
      "MsmeBooks / Company / Provider": { term: "MsmeBooks / Empresa / Proveedor", definition: "La entidad tecnológica [MsmeBooks Technologies Ltd / Insertar Entidad Registrada], operadora del software en la nube disponible en www.msmebooks.org." },
      "Customer / Subscriber": { term: "Cliente / Suscriptor", definition: "La micro, pequeña o mediana empresa, corporación o comerciante que suscribe este Contrato al registrarse o pagar un plan." },
      "Authorized User": { term: "Usuario Autorizado", definition: "Cualquier empleado, directivo, contador, auditor o colaborador autorizado por el Cliente para ingresar a la plataforma." },
      "Account Administrator": { term: "Administrador de Cuenta", definition: "El usuario principal facultado por el Cliente para administrar permisos, adquirir módulos y obligar comercialmente a la empresa." },
      "Services / Platform": { term: "Servicios / Plataforma", definition: "El conjunto de módulos de software en la nube que incluye Contabilidad, POS, Inventario, Nómina, Hostelería y APIs." },
      "Subscription Plan": { term: "Plan de Suscripción", definition: "El paquete comercial contratado (Gratuito, Crecimiento, Empresa o a Medida) que define funciones, usuarios y ciclos de facturación." },
      "Customer Data": { term: "Datos del Cliente", definition: "Todos los registros contables, facturas, catálogos de stock, listas de clientes e información de nómina cargados en la plataforma." },
      "Personal Data": { term: "Datos Personales", definition: "Cualquier información relativa a una persona natural identificada o identificable según la ley NDPA 2023, el RGPD y normativas vigentes." },
      "Third-Party Services": { term: "Servicios de Terceros", definition: "Hardware externo, pasarelas de pago bancarias, proveedores de SMS y plataformas en la nube no operadas por MsmeBooks." },
      "Add-On Modules": { term: "Módulos Adicionales", definition: "Funciones opcionales, licencias para sucursales extra o usuarios adicionales adquiridos fuera del plan base." },
      "Billing Cycle": { term: "Ciclo de Facturación", definition: "La periodicidad recurrente acordada de cobro (mensual, trimestral o anual) seleccionada por el Cliente." },
      "Service Availability": { term: "Disponibilidad del Servicio", definition: "El porcentaje operativo durante el cual la plataforma en la nube permanece accesible en línea, salvo mantenimientos programados." },
      "Intellectual Property": { term: "Propiedad Intelectual", definition: "Todas las patentes, derechos de autor, marcas, secretos comerciales, algoritmos, diseños de interfaz y nombres de dominio." },
      "Confidential Information": { term: "Información Confidencial", definition: "Cualquier dato comercial, técnico, financiero o estratégico no público divulgado entre las partes." },
      "Acceptable Use": { term: "Uso Aceptable", definition: "El conjunto de normas operativas que rigen una interacción legal, segura e ininterrumpida con la infraestructura de MsmeBooks." }
    },
    relatedDocs: {
      frameworkTag: "Marco de Gobernanza & Cumplimiento",
      heading: "Políticas & Documentos Legales Relacionados",
      description: "Estos Términos operan en conjunto con nuestro marco legal integral. Seleccione cualquier documento para revisar su alcance.",
      statusPublished: "Publicado",
      statusPending: "Disponible a Solicitud",
      updatedPrefix: "Actualizado en",
      quickView: "Vista Rápida",
      statusLabel: "Estado Operativo:",
      lastUpdatedLabel: "Última Actualización:",
      summaryHeading: "Resumen Ejecutivo",
      closeButton: "Cerrar",
      requestCopy: "Solicitar Copia Completa",
    },
    chat: {
      triggerLabel: "Chat en Vivo",
      onlineStatus: "En Línea",
      dialogTitle: "Soporte MsmeBooks",
      repliesIn: "Responde habitualmente en menos de 5 minutos",
      tabChat: "Chat con Agente",
      tabChannels: "Canales",
      tabFaqs: "Preguntas",
      startTitle: "Iniciar una Conversación",
      startDesc: "Facilite sus datos para asignar un especialista legal o comercial a su solicitud.",
      nameLabel: "Nombre Completo / Empresa *",
      namePlaceholder: "ej.: Carlos Mendoza",
      emailLabel: "Correo Electrónico Corporativo *",
      emailPlaceholder: "carlos@miempresa.com",
      topicLabel: "Motivo de la Consulta",
      connectBtn: "Conectar con Agente",
      typePlaceholder: "Escriba su mensaje...",
      typingIndicator: "El agente está escribiendo...",
      directDesksTitle: "Mesas Directas Corporativas",
      directDesksDesc: "Contacte con los representantes de MsmeBooks por mensajería, teléfono o correo.",
      whatsappTitle: "Mesa Oficial de WhatsApp",
      whatsappDesc: "Canal más ágil para facturación, altas y consultas inmediatas.",
      supportDeskTitle: "Soporte Técnico de Software",
      supportDeskDesc: "Para incidencias técnicas y reporte de anomalías en la plataforma.",
      legalDeskTitle: "Departamento Legal y Cumplimiento",
      legalDeskDesc: "Notificaciones formales, acuerdos de tratamiento DPA y contratos corporativos.",
      commonFaqsTitle: "Preguntas Frecuentes sobre los Términos",
    },
    modals: {
      consentTitle: "Simulador de Consentimiento de Registro SaaS",
      consentSubtitle: "Flujo Contractual Auditado bajo Artículo 7 y NDPA 2023",
      consentDesc: "Experimente el protocolo de consentimiento afirmativo y sin casillas premarcadas de MsmeBooks. Cada registro genera una pista de auditoría criptográfica inmutable.",
      businessNameLabel: "Nombre de la Empresa / Razón Social",
      emailLabel: "Correo Electrónico del Administrador",
      planLabel: "Nivel de Suscripción Elegido",
      termsAgreedPrefix: "He leído y acepto los",
      termsAgreedLink: "Términos y Condiciones de MsmeBooks",
      termsAgreedMid: "y reconozco la",
      privacyLink: "Política de Privacidad",
      mandatoryNote: "* Casilla afirmativa y no premarcada requerida por ley. Las casillas premarcadas están prohibidas.",
      marketingConsent: "(Opcional) Enviarme actualizaciones de producto, guías para pymes y novedades por correo.",
      cancelBtn: "Cancelar",
      submitConsentBtn: "Completar Registro & Generar Auditoría",
      verifiedSuccessTitle: "Consentimiento Verificado y Registrado",
      verifiedSuccessDesc: "El registro formal de aceptación contractual ha quedado sellado en la pista de auditoría de MsmeBooks.",
      auditPayloadLabel: "Carga de Datos de Auditoría Criptográfica (JSON):",
      copyJsonBtn: "Copiar JSON",
      copiedBtn: "¡Copiado!",
      testAnotherBtn: "← Probar Otro Registro",
      doneBtn: "Listo",
      checklistTitle: "Checklist Prepublicación para Asesoría Legal",
      checklistSubtitle: "Puntos de Acción para Abogados y Asesores Internos",
      checklistBanner: "Tal como exige la especificación SaaS, estos 6 marcadores están expresamente identificados. El equipo jurídico competente debe aprobar estos detalles antes del lanzamiento formal.",
      viewInSecBtn: "Ver en Sec.",
      exportChecklistBtn: "Exportar Checklist",
      dismissBtn: "Descartar Checklist",
      versionTitle: "Historial de Versiones de los Términos",
      versionSubtitle: "Registro Oficial de Revisiones y Archivo",
      currentActiveTag: "Versión Vigente Actual",
      effectiveLabel: "Vigencia:",
      keyModificationsLabel: "Principales Modificaciones:",
      closeVersionBtn: "Cerrar Archivo",
    },
    footer: {
      mission: "Software integral en la nube que unifica Contabilidad, Punto de Venta (POS), Inventario Multisede y Nómina para impulsar a las pymes en África y mercados globales.",
      serving: "Lagos y Abuya, Nigeria · Despliegue Panafricano e Internacional",
      platformTitle: "Plataforma",
      companyTitle: "Empresa",
      resourcesTitle: "Recursos",
      legalTitle: "Confianza & Legal",
      rights: "MsmeBooks Technologies Ltd. Todos los derechos reservados. Registrada conforme a las leyes comerciales aplicables.",
      ndpaTag: "Conforme con NDPA 2023",
      sslTag: "Cifrado SSL de 256 bits",
      cloudTag: "Nube SaaS Panafricana",
    },
    leftNav: {
      upTooltip: "Arriba: Sección Anterior",
      downTooltip: "Abajo: Siguiente Sección",
      topTooltip: "Inicio de Página",
      bottomTooltip: "Fin de Página",
    }
  }
};

export function getLocalizedSections(language: Language): SectionItem[] {
  const dict = TRANSLATIONS[language];
  if (!dict || language === 'en') return TERMS_SECTIONS;

  return TERMS_SECTIONS.map(sec => {
    const secTrans = dict.sectionTranslations[sec.number];
    const categoryObj = LEGAL_CATEGORIES.find(c => c.sectionIds.includes(sec.number));
    const catTrans = categoryObj ? dict.categories[categoryObj.id] : undefined;

    let localizedDefs = sec.definitions;
    if (sec.definitions && dict.definitionTranslations) {
      localizedDefs = sec.definitions.map(d => {
        const transDef = dict.definitionTranslations[d.term];
        return transDef ? { term: transDef.term, definition: transDef.definition } : d;
      });
    }

    return {
      ...sec,
      title: secTrans ? secTrans.title : sec.title,
      summary: secTrans ? secTrans.summary : sec.summary,
      category: catTrans || sec.category,
      definitions: localizedDefs,
    };
  });
}

export function getLocalizedCategories(language: Language): LegalCategory[] {
  const dict = TRANSLATIONS[language];
  if (!dict || language === 'en') return LEGAL_CATEGORIES;

  return LEGAL_CATEGORIES.map(cat => ({
    ...cat,
    title: dict.categories[cat.id] || cat.title,
  }));
}
