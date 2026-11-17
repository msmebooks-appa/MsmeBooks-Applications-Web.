import { SectionItem, LegalCategory, DocumentVersion, LegalChecklistItem, RelatedLegalDoc } from '../types/terms';

export const DOCUMENT_METADATA = {
  title: "MsmeBooks Terms & Conditions",
  subtitle: "Clear Terms. Trusted Technology. Better Business.",
  version: "2.4",
  effectiveDate: "October 21, 2026",
  lastUpdated: "October 21, 2026",
  totalSections: 33,
  estimatedReadTime: "24 min read",
  brandWebsite: "www.msmebooks.org",
  supportPhone: "+2349158482622",
  supportEmail: "support@msmebooks.org",
  legalEmail: "legal@msmebooks.org",
  companyPlaceholder: "[MsmeBooks Technologies Ltd / Insert Registered Legal Entity]",
  addressPlaceholder: "[Insert Registered Corporate Address, Nigeria / International]",
  jurisdictionPlaceholder: "[Approved Governing Jurisdiction / Federal Republic of Nigeria]",
  arbitrationForumPlaceholder: "[Approved Arbitration Center / Lagos Court of Arbitration (LCA)]",
};

export const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: "cat-foundations",
    title: "1. Foundations & Accounts",
    sectionIds: [1, 2, 3],
  },
  {
    id: "cat-saas-scope",
    title: "2. SaaS Platform Scope & Licensing",
    sectionIds: [4, 5, 6, 7],
  },
  {
    id: "cat-data-compliance",
    title: "3. Data Protection, Security & Compliance",
    sectionIds: [8, 9, 10],
  },
  {
    id: "cat-industry-modules",
    title: "4. Specialized Modules & Technology",
    sectionIds: [11, 12, 13, 14, 15, 16, 17],
  },
  {
    id: "cat-governance-partners",
    title: "5. Operational Governance & Partners",
    sectionIds: [18, 19, 20, 21, 22, 23],
  },
  {
    id: "cat-legal-liability",
    title: "6. Legal Protections, Risk & Jurisdiction",
    sectionIds: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  },
];

export const TERMS_SECTIONS: SectionItem[] = [
  {
    id: "section-1",
    number: 1,
    title: "Introduction and Acceptance of Terms",
    category: "Foundations & Accounts",
    summary: "Establishes the binding contractual agreement between MsmeBooks and its subscribers, authorized users, and business organizations.",
    content: [
      "Welcome to MsmeBooks (\"MsmeBooks\", \"we\", \"us\", or \"our\"), accessible via www.msmebooks.org and associated client applications. These Terms and Conditions (\"Terms\", \"Terms of Service\", or \"Agreement\") constitute a legally binding contractual relationship between MsmeBooks and the business entity, subscriber, or individual accessing or using our cloud-based business management software platform.",
      "By creating an account, clicking \"I Agree\", submitting a subscription order, making a payment, or continuing to access or use the platform in any manner, you expressly acknowledge that you have read, understood, and agreed to be bound by these Terms, together with our Privacy Policy, Acceptable Use Policy, and any applicable Service Level Agreements (SLAs).",
      "If you are accepting these Terms on behalf of a company, partnership, sole proprietorship, non-profit, or other legal entity, you represent and warrant that you possess the full legal authority to bind that entity to this Agreement. In such cases, the terms \"Customer\", \"you\", or \"your\" refer directly to that entity.",
      "If you do not agree with any provision of these Terms or lack the requisite legal authority to bind your organization, you must immediately discontinue use of the Services, refrain from creating an account, and cancel any pending subscription orders."
    ],
    subsections: [
      {
        subtitle: "1.1 Order of Precedence",
        paragraphs: [
          "In the event of an express conflict between these general Terms and Conditions and a separately executed written Enterprise Master Services Agreement (MSA) signed by authorized signatories of both parties, the terms of the signed Enterprise MSA shall prevail to the extent of such conflict."
        ]
      },
      {
        subtitle: "1.2 Updates and Supplemental Terms",
        paragraphs: [
          "Specific modules (such as Point of Sale hardware integrations, multi-entity payroll, or custom API endpoints) may be subject to additional service-specific schedules or policies. All such schedules are incorporated into these Terms by reference."
        ]
      }
    ]
  },
  {
    id: "section-2",
    number: 2,
    title: "Definitions and Interpretation",
    category: "Foundations & Accounts",
    summary: "Provides precise legal and technical definitions of terms utilized throughout this Agreement.",
    content: [
      "In this Agreement, unless the context requires otherwise, the terms defined in the structured definition table below have the respective meanings assigned to them."
    ],
    definitions: [
      {
        term: "MsmeBooks / Company / Provider",
        definition: "The technology entity [MsmeBooks Technologies Ltd / Insert Registered Legal Entity], provider and operator of the cloud business management software accessible at www.msmebooks.org."
      },
      {
        term: "Customer / Subscriber",
        definition: "The micro, small, medium enterprise, corporation, merchant, or individual that enters into this Agreement by registering an account or purchasing a subscription."
      },
      {
        term: "Authorized User",
        definition: "Any employee, officer, contractor, accountant, auditor, or agent designated by the Customer and granted login credentials to access the platform under Customer's account."
      },
      {
        term: "Account Administrator",
        definition: "The designated primary user(s) authorized by the Customer to manage account settings, assign user permissions, purchase add-ons, and bind the Customer financially."
      },
      {
        term: "Services / Platform",
        definition: "The suite of proprietary cloud-based software modules provided by MsmeBooks, including Accounting, Point of Sale (POS), Inventory & Warehouse, HR & Payroll, Hospitality, E-commerce, APIs, and associated web/mobile applications."
      },
      {
        term: "Subscription Plan",
        definition: "The specific commercial package (such as Free Plan, Growth Plan, Enterprise Plan, or Custom Plan) selected by the Customer, specifying features, user seats, branches, and billing cycles."
      },
      {
        term: "Customer Data",
        definition: "All electronic data, financial transactions, invoices, inventory records, customer lists, payroll figures, reports, and multimedia files uploaded, ingested, or generated by Customer within the platform."
      },
      {
        term: "Personal Data",
        definition: "Any information relating to an identified or identifiable natural person processed through the platform, as defined under the Nigeria Data Protection Act 2023 (NDPA), GDPR, and other applicable data privacy laws."
      },
      {
        term: "Third-Party Services",
        definition: "External hardware, payment gateways, banking integrations, SMS gateways, cloud providers, and software add-ons not owned or operated by MsmeBooks."
      },
      {
        term: "Add-On Modules",
        definition: "Optional features, additional branch licenses, expanded user seats, specialized vertical solutions, or premium integrations purchased outside base plan tiers."
      },
      {
        term: "Billing Cycle",
        definition: "The recurring duration for which subscription fees are charged (e.g., monthly, quarterly, semi-annually, or annually) as selected by Customer."
      },
      {
        term: "Service Availability",
        definition: "The operational uptime during which the production cloud platform is accessible to Customers via the internet, excluding scheduled maintenance."
      },
      {
        term: "Intellectual Property",
        definition: "All patents, patent applications, copyrights, moral rights, trademarks, service marks, trade secrets, algorithms, UI designs, codebases, and domain names."
      },
      {
        term: "Confidential Information",
        definition: "Non-public proprietary business, technical, financial, or strategic information disclosed by one party to the other in connection with the platform."
      },
      {
        term: "Acceptable Use",
        definition: "The standard of conduct and operational parameters governing lawful, non-disruptive, and secure interaction with MsmeBooks infrastructure."
      }
    ]
  },
  {
    id: "section-3",
    number: 3,
    title: "Eligibility and Account Registration",
    category: "Foundations & Accounts",
    summary: "Defines who may register for an account, security standards, credential management, and business verification.",
    content: [
      "To access MsmeBooks Services, you must register for an account by providing accurate, complete, and current information. Accounts must be registered in the verified legal or trade name of an active business entity or an individual authorized to conduct commercial enterprise.",
      "You agree to maintain the accuracy of your registration information throughout the lifespan of your account. Providing fraudulent, deceptive, or misleading registration details constitutes a material breach of this Agreement.",
      "The individual initially creating the account is deemed the primary Account Administrator. The Account Administrator retains full administrative authority to configure user roles, grant permissions to Authorized Users, control billing details, and initiate subscription cancellations or data exports."
    ],
    subsections: [
      {
        subtitle: "3.1 Credential Protection and MFA",
        paragraphs: [
          "Customers and Authorized Users are strictly responsible for maintaining the confidentiality of their login credentials, passwords, and API tokens. You are solely liable for all activities, transactions, and modifications that occur under your account credentials.",
          "MsmeBooks highly recommends and reserves the right to enforce Multi-Factor Authentication (MFA) across administrator accounts to safeguard sensitive financial ledger records."
        ]
      },
      {
        subtitle: "3.2 Notification of Security Breach",
        paragraphs: [
          "You must immediately notify MsmeBooks at support@msmebooks.org upon discovering any unauthorized access, loss of credentials, or suspected security breach relating to your account. MsmeBooks shall not be liable for losses caused by unauthorized credential use prior to receiving verified written notice."
        ]
      },
      {
        subtitle: "3.3 Business Verification (KYB/AML)",
        paragraphs: [
          "Where necessary to comply with applicable anti-money laundering (AML), counter-terrorist financing (CTF), or payment gateway rules, MsmeBooks or our payment partners may request business registration certificates, corporate documentation, tax identification numbers, or proof of director identity."
        ]
      }
    ]
  },
  {
    id: "section-4",
    number: 4,
    title: "Scope of MsmeBooks SaaS Services",
    category: "SaaS Platform Scope & Licensing",
    summary: "Details the modular business management modules provided by MsmeBooks and plan-based availability.",
    content: [
      "MsmeBooks provides an integrated multi-tenant Software-as-a-Service (SaaS) platform engineered specifically for micro, small, and medium-sized enterprises across Africa and global emerging markets. The Services are offered on a modular basis, and available features depend directly upon your subscribed plan and active add-on modules."
    ],
    subsections: [
      {
        subtitle: "4.1 Accounting & Financial Management",
        paragraphs: [
          "Includes automated general ledger, chart of accounts configuration, professional sales invoicing, accounts receivable tracking, bill and vendor management, expense categorization, bank transaction import and reconciliation, profit and loss statements, balance sheets, and tax liability tracking."
        ]
      },
      {
        subtitle: "4.2 Point of Sale (POS)",
        paragraphs: [
          "Facilitates in-store and counter sales, cashier shift reconciliation, barcode scanning support, digital cash register balancing, multi-store/multi-till synchronizations, receipt generation, and offline transaction caching subject to device storage limitations."
        ]
      },
      {
        subtitle: "4.3 Inventory & Warehouse Operations",
        paragraphs: [
          "Delivers real-time stock level monitoring, multi-warehouse stock transfers, reorder point alerts, SKU/batch/serial tracking, supplier purchase orders, goods received notes (GRN), and FIFO or weighted average stock valuation."
        ]
      },
      {
        subtitle: "4.4 Human Resources & Payroll",
        paragraphs: [
          "Covers employee records management, automated payroll slip generation, tax deductions (such as PAYE), statutory contributions (such as pension and national housing funds where configured), and attendance records."
        ]
      },
      {
        subtitle: "4.5 Hospitality & Property Operations",
        paragraphs: [
          "Specialized modules for hotels, guest houses, and restaurants, encompassing room and table reservations, check-in/check-out workflows, kitchen order ticketing (KOT), minibar billing, and unified guest folio accounting."
        ]
      },
      {
        subtitle: "4.6 Additional Platform Services",
        paragraphs: [
          "Provides connected e-commerce storefront sync, third-party payment gateway links, developer REST APIs, executive business analytics dashboards, and automated report exports."
        ]
      }
    ]
  },
  {
    id: "section-5",
    number: 5,
    title: "Subscription Plans and Licensing",
    category: "SaaS Platform Scope & Licensing",
    summary: "Governs license grants, plan tiers (Free, Growth, Enterprise, Custom), seat limits, and upgrade/downgrade rules.",
    content: [
      "Subject to your compliance with this Agreement and timely payment of applicable subscription fees, MsmeBooks grants you a limited, non-exclusive, non-transferable, revocable, worldwide license to access and use the subscribed SaaS modules solely for your internal business operations during the active subscription term.",
      "The license does not constitute a sale of the software or any underlying source code. You acquire no ownership rights in MsmeBooks software, architecture, or proprietary assets."
    ],
    subsections: [
      {
        subtitle: "5.1 Plan Tiers and Capacity Allocations",
        paragraphs: [
          "MsmeBooks offers tiered subscription plans including Free Plan, Growth Plan, Enterprise Plan, and bespoke Custom Plans. Each plan defines quantitative parameters, such as allowed Authorized Users, transaction caps, branch/location limits, and storage quotas.",
          "Customers exceeding their plan capacity will be prompted to upgrade to a higher tier or purchase supplemental seat/location add-ons."
        ]
      },
      {
        subtitle: "5.2 Upgrades and Downgrades",
        paragraphs: [
          "You may upgrade your subscription plan at any time through the billing console. Upgrades take effect immediately, with pro-rated billing adjustments applied to your next statement.",
          "Downgrading a subscription tier becomes effective at the end of the current paid billing cycle. Downgrading may result in the loss of access to specific features, historical data exports, or excess user seats; MsmeBooks accepts no liability for such plan-induced limitations."
        ]
      },
      {
        subtitle: "5.3 Promotional Trials",
        paragraphs: [
          "Free trials or promotional periods are provided at our sole discretion. Upon trial expiration, continued platform access requires subscription to an active paid plan or automatic transition to a free plan tier where available."
        ]
      }
    ]
  },
  {
    id: "section-6",
    number: 6,
    title: "Billing, Payments and Taxes",
    category: "SaaS Platform Scope & Licensing",
    summary: "Outlines recurring subscription billing, payment channels, invoice schedules, withholding taxes, and VAT treatment.",
    content: [
      "Customers agree to pay all subscription and add-on fees in accordance with the pricing and billing frequency selected during checkout or specified in a valid service order. All fees are stated and payable in the currency displayed during registration (e.g., Nigerian Naira [NGN] or US Dollars [USD]), exclusive of applicable statutory taxes."
    ],
    subsections: [
      {
        subtitle: "6.1 Recurring Billing Authorization",
        paragraphs: [
          "By providing a payment method (credit/debit card, bank transfer, direct debit, or digital wallet), you authorize MsmeBooks and our PCI-DSS certified payment processors to charge recurring fees on or around the start of each billing cycle until cancellation."
        ]
      },
      {
        subtitle: "6.2 Invoicing and Due Dates",
        paragraphs: [
          "Subscription invoices are generated electronically and made available in your account dashboard. Invoices are payable upon receipt or within the grace period specified on the billing schedule."
        ]
      },
      {
        subtitle: "6.3 Failed Payments and Grace Period",
        paragraphs: [
          "If an automated renewal charge fails, MsmeBooks will attempt re-billing over a 7-day grace window. If payment remains outstanding following this period, MsmeBooks reserves the right to suspend account access until the arrears are fully settled."
        ]
      },
      {
        subtitle: "6.4 Statutory Taxes and Withholdings",
        paragraphs: [
          "Customers are responsible for all applicable Value Added Tax (VAT), sales tax, goods and services tax (GST), or withholding tax (WHT) levied by competent tax authorities in their jurisdiction. Where withholding tax deductions are mandated by local statute, Customer must supply valid withholding tax credit certificates within statutory deadlines."
        ]
      },
      {
        subtitle: "6.5 Distinction Between Platform Fees and Customer Revenue",
        paragraphs: [
          "MsmeBooks charges fees strictly for the provision of SaaS software services. Payments collected by Customer from their own retail, wholesale, or hospitality patrons via integrated payment terminals or gateways flow directly to Customer's designated merchant accounts and do not constitute MsmeBooks revenue."
        ]
      }
    ]
  },
  {
    id: "section-7",
    number: 7,
    title: "Refunds, Cancellations and Subscription Termination",
    category: "SaaS Platform Scope & Licensing",
    summary: "Defines subscription cancellation procedures, refund eligibility criteria, data export windows, and account deletion protocols.",
    content: [
      "Customers may cancel their subscription at any time through the Account Administration dashboard or by sending formal written notice to support@msmebooks.org. Cancellation halts future automated renewals.",
      "Upon cancellation, Customer retains full access to subscribed modules until the conclusion of the prepaid billing cycle, after which the account enters a read-only or inactive state."
    ],
    subsections: [
      {
        subtitle: "7.1 Refund Eligibility and Policy",
        paragraphs: [
          "Except where required by applicable consumer protection laws or explicitly stated in our separate Refund Policy, paid subscription fees, setup fees, and add-on module charges are non-refundable.",
          "Customers on annual commitments who request cancellation within [Approved Review Window / 14 days] of the initial purchase date may be eligible for a pro-rated refund, minus an administrative processing allowance, provided no significant custom implementation services have been delivered."
        ]
      },
      {
        subtitle: "7.2 Data Export and Retrieval Window",
        paragraphs: [
          "Following subscription cancellation or expiration, MsmeBooks provides Customers with a minimum [30 to 60-day approved window] to export financial ledger records, inventory tables, customer databases, and audit logs in standard formats (e.g., CSV, Excel, PDF).",
          "Following the expiration of the data export window, MsmeBooks reserves the right to securely purge inactive Customer Data in accordance with our data retention schedule."
        ]
      },
      {
        subtitle: "7.3 Account Deletion Requests",
        paragraphs: [
          "An authorized Account Administrator may submit a permanent account deletion request. Permanent deletion will irreversibly erase active databases, subject only to statutory tax and financial record retention requirements imposed by law."
        ]
      }
    ]
  },
  {
    id: "section-8",
    number: 8,
    title: "Customer Data Ownership and Privacy",
    category: "Data Protection, Security & Compliance",
    summary: "Confirms customer ownership of business data, outlines data processing obligations under NDPA 2023 & GDPR, and covers subprocessors.",
    content: [
      "As between MsmeBooks and Customer, Customer exclusively owns all rights, title, and interest in and to all Customer Data. MsmeBooks claims no intellectual property ownership over financial ledgers, sales records, customer directories, or trade records ingested into the platform.",
      "Customer grants MsmeBooks a non-exclusive, worldwide, royalty-free license to host, copy, process, transmit, and display Customer Data solely to the extent necessary to provide, maintain, optimize, and secure the Services, or as required by law."
    ],
    subsections: [
      {
        subtitle: "8.1 Compliance with Data Protection Legislation",
        paragraphs: [
          "Both parties agree to comply with applicable data protection legislation, including the Nigeria Data Protection Act 2023 (NDPA), the General Data Protection Regulation (GDPR) where processing European personal data, and regional African data privacy statutes.",
          "In relation to Personal Data uploaded by Customer (such as employee payroll files or retail customer contacts), Customer acts as the Data Controller, and MsmeBooks acts as a Data Processor acting upon Customer's lawful instructions."
        ]
      },
      {
        subtitle: "8.2 Customer Warranties Regarding Third-Party Data",
        paragraphs: [
          "Customer represents and warrants that it has secured all lawful consents, notices, and authorizations required to upload third-party personal information (including employee, vendor, and patron data) onto the MsmeBooks platform."
        ]
      },
      {
        subtitle: "8.3 Subprocessors and Cross-Border Transfers",
        paragraphs: [
          "MsmeBooks engages reputable tier-1 cloud infrastructure providers and data center operators (such as Google Cloud, AWS, or accredited regional data facilities) as subprocessors. All transfers of Personal Data across borders are executed under appropriate legal transfer mechanisms and security safeguards."
        ]
      }
    ]
  },
  {
    id: "section-9",
    number: 9,
    title: "Information Security and Platform Protection",
    category: "Data Protection, Security & Compliance",
    summary: "Sets out technical and organizational security controls, encryption, incident notification protocols, and customer shared responsibilities.",
    content: [
      "MsmeBooks implements industry-standard technical and organizational security measures engineered to protect Customer Data against accidental, unlawful, or unauthorized destruction, loss, alteration, disclosure, or access.",
      "Our security program incorporates encrypted data transmissions (TLS 1.2/1.3), database encryption at rest (AES-256), continuous security monitoring, automated vulnerability scanning, strict role-based access controls, and regular distributed backups."
    ],
    subsections: [
      {
        subtitle: "9.1 Shared Responsibility Model",
        paragraphs: [
          "Information security is a shared responsibility. While MsmeBooks secures the underlying cloud architecture, application code, and database infrastructure, Customer remains responsible for configuring internal user permissions, enforcing strong password hygiene, protecting physical workstation endpoints, and preventing credential leaks."
        ]
      },
      {
        subtitle: "9.2 Security Incident Notification",
        paragraphs: [
          "In the confirmed event of a security incident resulting in unlawful access to or exfiltration of Customer Personal Data, MsmeBooks will notify the affected Account Administrator without undue delay and within statutory reporting windows mandated by applicable law (e.g., NDPA requirements), accompanied by actionable mitigation guidance."
        ]
      },
      {
        subtitle: "9.3 Certification Notice",
        paragraphs: [
          "MsmeBooks strives for continuous alignment with global standards such as ISO/IEC 27001, SOC 2, and PCI-DSS. Specific formal audit reports or compliance attestations are subject to verified execution and available to Enterprise subscribers upon request."
        ]
      }
    ]
  },
  {
    id: "section-10",
    number: 10,
    title: "Accounting, Financial and Tax Responsibilities",
    category: "Data Protection, Security & Compliance",
    summary: "Clarifies that MsmeBooks provides automated software tools and does not provide certified accounting, tax, or legal advice.",
    content: [
      "MsmeBooks provides automated software tools designed to record, categorize, calculate, and display financial transactions. However, MsmeBooks is not an accounting firm, certified public accountant (CPA), chartered tax advisory, or legal consultancy.",
      "The platform, its automated reports, financial summaries, tax estimates, and balance sheet outputs are software-generated computational calculations and do not constitute certified professional financial, tax, or legal advice."
    ],
    subsections: [
      {
        subtitle: "10.1 Customer Verification Obligation",
        paragraphs: [
          "Customer retains sole, unreserved responsibility for verifying the accuracy, completeness, and regulatory compliance of all accounting entries, journal adjustments, ledger classifications, depreciation schedules, and tax filings produced using the software.",
          "Customers must review all financial statements with qualified chartered accountants, tax practitioners, or auditors before filing official returns with revenue authorities (such as the Federal Inland Revenue Service - FIRS, State Internal Revenue Services, or international tax bodies)."
        ]
      },
      {
        subtitle: "10.2 Disclaimer of Tax Liability",
        paragraphs: [
          "MsmeBooks expressly disclaims any liability for statutory penalties, back-taxes, interest, tax audits, or fines incurred by Customer as a consequence of inaccurate tax rule configuration, incorrect transaction categorization, or erroneous financial reporting."
        ]
      }
    ]
  },
  {
    id: "section-11",
    number: 11,
    title: "POS, Payments and Transaction Processing",
    category: "Specialized Modules & Technology",
    summary: "Covers point-of-sale operations, hardware compatibility, integrated payment service providers, cash till reconciliation, and dispute management.",
    content: [
      "The MsmeBooks Point of Sale (POS) module facilitates counter and mobile checkout operations. Customer is solely responsible for entering correct product pricing, applying appropriate discount rules, verifying tender types, and maintaining physical cash drawer balances."
    ],
    subsections: [
      {
        subtitle: "11.1 Integrated Payment Service Providers (PSPs)",
        paragraphs: [
          "Electronic card, QR code, USSD, and transfer payments processed through the POS rely on integrations with third-party licensed payment service providers and acquirers. MsmeBooks is not a licensed banking institution, payment service provider, or merchant acquirer.",
          "Customer's payment processing relationship is governed directly by the merchant terms and conditions of the respective integrated payment gateway or acquiring bank."
        ]
      },
      {
        subtitle: "11.2 Chargebacks, Reversals, and Disputes",
        paragraphs: [
          "Customer assumes full responsibility for all chargebacks, cardholder disputes, fraudulent transactions, and payment reversals originating from its retail or hospitality sales. MsmeBooks does not indemnify Customer against chargeback losses or disputed merchant settlements."
        ]
      },
      {
        subtitle: "11.3 Hardware and Terminal Compatibility",
        paragraphs: [
          "While MsmeBooks supports standard thermal printers, barcode scanners, and cash drawers, Customer is responsible for verifying hardware compatibility and ensuring reliable local internet and power connectivity."
        ]
      }
    ]
  },
  {
    id: "section-12",
    number: 12,
    title: "Inventory, Warehouse and Stock Management",
    category: "Specialized Modules & Technology",
    summary: "Sets terms regarding stock valuations, inventory adjustments, physical audits, supplier records, and damaged goods.",
    content: [
      "MsmeBooks enables multi-location inventory tracking, purchase ordering, and valuation. System stock counts depend entirely on data entered by Customer's authorized stock clerks and warehouse managers.",
      "Customer is strictly responsible for conducting periodic physical stock reconciliations to account for shrinkage, spoilage, theft, damage, or measurement discrepancies between physical inventory and system counts.",
      "MsmeBooks shall not be liable for stockouts, lost sales, over-ordering, or valuation discrepancies resulting from improper stock unit conversions, delayed entry of goods received notes, or unrecorded inventory transfers."
    ]
  },
  {
    id: "section-13",
    number: 13,
    title: "Payroll, HR and Employee Information",
    category: "Specialized Modules & Technology",
    summary: "Regulates employee personal data, salary schedules, statutory pension/NHF/PAYE deductions, and employer legal duties.",
    content: [
      "The Human Resources and Payroll module allows Customers to organize employee directories, compute salary disbursements, and calculate statutory deductions.",
      "Customer acts as the lawful employer and remains solely responsible for ensuring that all payroll calculations, wage levels, overtime rates, and statutory remittances comply with applicable labor laws, minimum wage statutes, pension reforms, and trade union agreements.",
      "Customer is obligated to maintain strict internal access controls over employee salary records and bank account details, granting payroll permissions exclusively to authorized HR and finance personnel."
    ]
  },
  {
    id: "section-14",
    number: 14,
    title: "Hospitality, Restaurant and Property Management",
    category: "Specialized Modules & Technology",
    summary: "Addresses room reservations, guest folios, restaurant table workflows, booking cancellations, and operator guest policies.",
    content: [
      "For hotel, guest house, and restaurant operators utilizing MsmeBooks hospitality modules, Customer is solely responsible for formulating, publishing, and enforcing its own guest booking, cancellation, deposit, room damage, and refund policies.",
      "MsmeBooks acts strictly as a property management software tool and does not manage guest reservations, set room tariffs, or arbitrate guest-operator disputes.",
      "Customer is responsible for safeguarding guest identification documents, passport numbers, and room access logs stored within the hospitality module in compliance with applicable privacy and hospitality hospitality regulatory guidelines."
    ]
  },
  {
    id: "section-15",
    number: 15,
    title: "E-commerce, Marketplace and Third-Party Applications",
    category: "Specialized Modules & Technology",
    summary: "Governs online storefront extensions, marketplace integrations, vendor agreements, and data exchange with third-party apps.",
    content: [
      "MsmeBooks may provide connectors or marketplace extensions enabling integration with external platforms (such as Shopify, WooCommerce, delivery logistics providers, or CRM systems).",
      "Customer acknowledges that third-party applications are governed by their respective vendor terms, privacy policies, and fee structures. MsmeBooks does not warrant or guarantee the continuous availability, accuracy, or compatibility of third-party applications.",
      "MsmeBooks reserves the right to suspend or deprecate specific third-party connectors if a vendor changes its API policies, breaches security standards, or ceases business operations."
    ]
  },
  {
    id: "section-16",
    number: 16,
    title: "API Access and Developer Usage",
    category: "Specialized Modules & Technology",
    summary: "Outlines developer API keys, rate limits, webhook endpoints, security standards, and non-abuse obligations.",
    content: [
      "Customers subscribing to plans with Application Programming Interface (API) access are granted a non-exclusive license to use MsmeBooks APIs to integrate internal business systems or build custom workflow automations.",
      "API access is subject to technical rate limits, concurrent connection thresholds, and call quotas published in our developer documentation. Customers must not attempt to circumvent rate limits or execute abusive, high-frequency polling scripts.",
      "API authentication keys and bearer tokens must be stored securely. You must never expose secret keys in client-side public code repositories or web browsers. MsmeBooks reserves the right to immediately revoke API keys involved in suspicious or abnormal activity."
    ]
  },
  {
    id: "section-17",
    number: 17,
    title: "Artificial Intelligence and Automated Features",
    category: "Specialized Modules & Technology",
    summary: "Regulates automated machine learning insights, AI predictions, human verification rules, and liability disclaimers for automated output.",
    content: [
      "MsmeBooks may deploy automated algorithms, predictive models, or artificial intelligence (\"AI Features\") to provide smart expense categorization, cash-flow projections, automated invoice data extraction, or inventory reorder recommendations.",
      "AI Features are intended solely as analytical decision-support aids. Output generated by automated systems may occasionally contain inaccuracies, incomplete projections, or algorithmic variance. Customer must apply human review and verification before executing critical commercial, credit, or tax decisions based on AI outputs.",
      "Customer Data processed by our AI features is handled strictly in accordance with enterprise data protection standards and is not used to train public machine learning models without express authorization."
    ]
  },
  {
    id: "section-18",
    number: 18,
    title: "Acceptable Use Policy",
    category: "Operational Governance & Partners",
    summary: "Defines strictly prohibited platform behaviors, including fraudulent activity, scraping, security breaches, and illegal business operations.",
    content: [
      "You agree to use MsmeBooks strictly for lawful commercial purposes and in compliance with all applicable local, national, and international laws. You must not use the platform to:",
      "1. Engage in unlawful, fraudulent, deceptive, or money laundering activities;",
      "2. Record fictitious transactions, generate fraudulent invoices, or manipulate accounting ledgers to evade statutory tax duties;",
      "3. Probe, scan, or test the vulnerability of MsmeBooks systems or breach any authentication or security measures without prior written authorization;",
      "4. Interfere with, disrupt, or burden platform infrastructure via distributed denial-of-service (DDoS) attacks, brute-force requests, or high-volume automated scrapers;",
      "5. Upload or distribute viruses, ransomware, trojans, worms, or other malicious computer code;",
      "6. Reverse engineer, decompile, disassemble, or derive the underlying source code of the software;",
      "7. Resell, sublicense, lease, or syndicate the Services without an approved, written MsmeBooks Partner or Reseller Agreement.",
      "Violation of this Acceptable Use Policy constitutes grounds for immediate account suspension or termination without prior notice."
    ]
  },
  {
    id: "section-19",
    number: 19,
    title: "Intellectual Property Rights",
    category: "Operational Governance & Partners",
    summary: "Protects MsmeBooks software, trademarks, brand assets, and proprietary UI, while confirming Customer's ownership of uploaded assets.",
    content: [
      "All intellectual property rights in the MsmeBooks platform, software code, user interface designs, logos, graphics, icons, databases, technical documentation, and domain names are and remain the exclusive property of MsmeBooks or its licensors.",
      "Nothing in this Agreement grants Customer any right to use the MsmeBooks trademarks, trade names, or brand logos in public marketing materials, press releases, or commercial advertisements without prior written consent.",
      "Customer retains full ownership of its own registered trademarks, trade names, and uploaded branding assets (such as customer logos embedded onto invoices or receipts)."
    ]
  },
  {
    id: "section-20",
    number: 20,
    title: "Service Availability, Maintenance and Updates",
    category: "Operational Governance & Partners",
    summary: "Covers cloud uptime targets, routine maintenance schedules, emergency patches, and infrastructure dependencies.",
    content: [
      "MsmeBooks strives to maintain high service availability for its production cloud platform. However, continuous, uninterrupted, or error-free operation cannot be guaranteed.",
      "Routine maintenance, infrastructure upgrades, and system enhancements are scheduled during off-peak hours where commercially practicable, with advance notices posted in the application status dashboard.",
      "Emergency security patching, database failover procedures, or critical bug fixes may be executed immediately without prior notice to safeguard user data integrity. MsmeBooks shall not be held liable for temporary platform inaccessibility resulting from emergency maintenance or upstream telecommunications interruptions."
    ]
  },
  {
    id: "section-21",
    number: 21,
    title: "Technical Support and Customer Assistance",
    category: "Operational Governance & Partners",
    summary: "Details support channels, service tiers, response expectations, onboarding guidance, and escalation processes.",
    content: [
      "MsmeBooks provides technical support through designated online ticketing, knowledge base articles, email at support@msmebooks.org, and verified official WhatsApp support channels.",
      "Standard support is provided during normal business hours (West Africa Time - WAT). Enterprise plan subscribers may be entitled to prioritized response times, dedicated account managers, and custom Service Level Agreements (SLAs) as set out in their service contracts.",
      "Customer is responsible for providing clear error descriptions, reproduction steps, and diagnostic details when logging support requests."
    ]
  },
  {
    id: "section-22",
    number: 22,
    title: "Resellers, Affiliates and Business Partners",
    category: "Operational Governance & Partners",
    summary: "Regulates authorized partner networks, commission eligibility, brand representations, and reseller duties.",
    content: [
      "Authorized resellers, accounting firm partners, and affiliate marketers are independent business entities and are not authorized agents, employees, or legal representatives of MsmeBooks.",
      "Partners must not make false, exaggerated, or misleading representations regarding platform capabilities, pricing, or compliance certifications. Partner commission schedules, referral payouts, and reseller discounts are governed exclusively by approved Partner Program Agreements."
    ]
  },
  {
    id: "section-23",
    number: 23,
    title: "Professional Services and Third-Party Consultants",
    category: "Operational Governance & Partners",
    summary: "Covers bookkeeping, implementation, data migration, and third-party accounting firms engaged by Customers.",
    content: [
      "Where Customer engages independent external bookkeepers, accountants, or implementation consultants to assist with data migration, chart of accounts setup, or POS deployment, such engagements are strictly between Customer and the independent professional.",
      "MsmeBooks bears no responsibility or liability for errors, unauthorized transactions, data manipulation, or omissions executed by independent consultants granted access to Customer's account."
    ]
  },
  {
    id: "section-24",
    number: 24,
    title: "Confidentiality",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Binds both parties to rigorous protection of proprietary commercial, financial, and technical information.",
    content: [
      "Each party agrees that all code, inventions, business, technical, financial, and customer records disclosed by one party (\"Disclosing Party\") to the other (\"Receiving Party\") constitute confidential information.",
      "The Receiving Party agrees to hold Confidential Information in strict confidence, using at least the same degree of care it uses to protect its own confidential materials, but no less than a reasonable degree of care.",
      "Confidential Information may only be disclosed to employees, contractors, and legal/financial advisors who have a need to know and are bound by confidentiality obligations at least as restrictive as those contained herein, or pursuant to a valid judicial or governmental order."
    ]
  },
  {
    id: "section-25",
    number: 25,
    title: "Warranties and Disclaimers",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "States software performance disclaimers, as-is provisions, and statutory consumer rights protections.",
    content: [
      "Except as expressly set forth in this Agreement, the Services, software, APIs, and all related documentation are provided on an \"AS IS\" and \"AS AVAILABLE\" basis, without warranties of any kind, whether express, statutory, or implied.",
      "MsmeBooks specifically disclaims all implied warranties of merchantability, fitness for a particular purpose, title, quiet enjoyment, and non-infringement. We do not warrant that the Services will meet all of your business requirements, that operations will be uninterrupted, or that software defects will be corrected immediately.",
      "No oral advice or written information provided by MsmeBooks, its directors, employees, or authorized agents shall create a warranty. Certain jurisdictions do not allow the exclusion of implied warranties; in such jurisdictions, the above exclusions apply only to the maximum extent permitted by applicable law."
    ]
  },
  {
    id: "section-26",
    number: 26,
    title: "Limitation of Liability",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Defines liability limitations, consequential damage exclusions, and financial liability caps subject to legal counsel review.",
    content: [
      "To the maximum extent permitted by applicable law, in no event shall MsmeBooks, its affiliates, directors, officers, employees, or licensors be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to damages for loss of profits, loss of revenue, loss of business goodwill, data loss, work stoppage, computer failure, or loss of commercial opportunities, however caused and under any theory of liability.",
      "The aggregate financial liability of MsmeBooks arising out of or related to this Agreement or your use of the Services, whether in contract, tort (including negligence), strict liability, or otherwise, shall not exceed the total subscription fees actually paid by Customer to MsmeBooks in the [Approved Liability Cap / Twelve (12) Months] immediately preceding the event giving rise to liability.",
      "Nothing in this Agreement limits or excludes liability for death, personal injury caused by gross negligence, fraud, fraudulent misrepresentation, or any other liability that cannot lawfully be limited or excluded under governing statute."
    ]
  },
  {
    id: "section-27",
    number: 27,
    title: "Indemnification",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Requires Customer to indemnify MsmeBooks against claims arising from unlawful platform use or tax non-compliance.",
    content: [
      "Customer agrees to defend, indemnify, and hold harmless MsmeBooks, its parent, subsidiaries, affiliates, officers, directors, employees, agents, and licensors from and against any third-party claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or connected with:",
      "1. Customer's breach of this Agreement or violation of applicable laws;",
      "2. Any Customer Data uploaded, processed, or transmitted through the platform;",
      "3. Unlawful or unauthorized processing of third-party Personal Data;",
      "4. Tax penalties, tax assessments, or statutory fines resulting from Customer's improper financial records or tax misconfigurations;",
      "5. Commercial disputes between Customer and its patrons, retail purchasers, guests, or employees."
    ]
  },
  {
    id: "section-28",
    number: 28,
    title: "Suspension and Termination",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Sets out terms for account suspension, breach remediation, voluntary closure, and post-termination effects.",
    content: [
      "MsmeBooks reserves the right to immediately suspend or restrict access to your account if: (a) your account is in arrears following the payment grace period; (b) you engage in activities that threaten the security or integrity of the platform; (c) we reasonably suspect fraudulent, money laundering, or illegal operations; or (d) required by a court or regulatory authority.",
      "Either party may terminate this Agreement for material breach if the breaching party fails to cure such breach within thirty (30) days of receiving written notice thereof.",
      "Upon termination, all licenses granted under this Agreement immediately cease, outstanding subscription fees become immediately due and payable, and Customer must cease all access to the Services, subject to the data export window defined in Section 7."
    ]
  },
  {
    id: "section-29",
    number: 29,
    title: "International Users and Cross-Border Services",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Covers cross-border multi-currency operations across African and global markets, trade controls, and local compliance.",
    content: [
      "While MsmeBooks is engineered with deep support for Pan-African trade, multi-currency accounting, and international tax frameworks, users accessing the Services from outside the primary operating jurisdiction are responsible for compliance with their respective local laws.",
      "You represent and warrant that you and your business entity are not located in, organized under the laws of, or ordinarily resident in any country or territory subject to comprehensive international trade sanctions or embargoes."
    ]
  },
  {
    id: "section-30",
    number: 30,
    title: "Governing Law and Dispute Resolution",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Provides structured dispute resolution, informal conciliation, mediation, and arbitration venue placeholders.",
    content: [
      "This Agreement and any dispute, controversy, or claim arising out of or relating to it shall be governed by and construed in accordance with the substantive laws of [Approved Governing Jurisdiction / Federal Republic of Nigeria], without giving effect to any conflict of law principles.",
      "In the event of any controversy or dispute, the parties agree to first attempt informal resolution in good faith for a period of not less than thirty (30) days from written notice of dispute.",
      "If informal discussions fail, disputes shall be submitted to and finally resolved by binding commercial arbitration in accordance with the Arbitration and Mediation Act 2023 or the rules of [Approved Arbitration Center / Lagos Court of Arbitration (LCA)], before a single arbitrator appointed in accordance with said rules.",
      "Notwithstanding the foregoing, either party may seek emergency injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property or confidential information."
    ]
  },
  {
    id: "section-31",
    number: 31,
    title: "Changes to Terms and Conditions",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Explains how terms are revised, notice mechanisms for material modifications, and archived version tracking.",
    content: [
      "MsmeBooks reserves the right to amend, update, or replace these Terms and Conditions at any time to reflect software updates, changes in statutory law, or commercial evolution.",
      "When material revisions occur, we will provide at least thirty (30) days advance notice via email to registered Account Administrators or through prominent in-app notification banners prior to the changes taking effect.",
      "Your continued access or use of the Services following the effective date of revised Terms constitutes your full acceptance of the updated terms. If you do not agree to the amendments, you must exercise your right to cancel your subscription prior to the effective date."
    ]
  },
  {
    id: "section-32",
    number: 32,
    title: "General Legal Provisions",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Standard contractual clauses: Severability, Entire Agreement, Force Majeure, Non-Waiver, Assignment, and Survival.",
    content: [
      "32.1 Severability: If any provision of this Agreement is found by a court of competent jurisdiction to be invalid, illegal, or unenforceable, that provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall remain in full force and effect.",
      "32.2 Entire Agreement: This Agreement, together with the Privacy Policy, Acceptable Use Policy, and executed order schedules, constitutes the entire agreement between the parties concerning the subject matter hereof, superseding all prior oral or written discussions, representations, or understandings.",
      "32.3 Force Majeure: Neither party shall be liable for delays or failure to perform obligations (excluding payment duties) resulting from events beyond reasonable control, including acts of God, strikes, power blackouts, internet backbone failures, war, civil unrest, natural disasters, or regulatory mandates.",
      "32.4 Assignment: Customer may not assign or transfer this Agreement or any rights herein without prior written consent from MsmeBooks. MsmeBooks may assign this Agreement in connection with a merger, acquisition, corporate reorganization, or sale of assets.",
      "32.5 No Waiver: The failure of either party to enforce any right or provision shall not operate as a waiver of such right or future breach.",
      "32.6 Survival: Sections 2, 8, 10, 18, 19, 24, 25, 26, 27, 30, and 32 shall survive any termination or expiration of this Agreement."
    ]
  },
  {
    id: "section-33",
    number: 33,
    title: "Contact Information and Legal Enquiries",
    category: "Legal Protections, Risk & Jurisdiction",
    summary: "Official contact details, legal notice channels, corporate credentials, and formal correspondence endpoints.",
    content: [
      "For formal legal notices, questions regarding these Terms, compliance inquiries, or regulatory communications, please contact the MsmeBooks Legal and Compliance Department via the official channels below:"
    ],
    subsections: [
      {
        subtitle: "Official Legal Notice Coordinates",
        paragraphs: [
          "Platform Brand: MsmeBooks",
          "Website: www.msmebooks.org",
          "Official Telephone: +2349158482622",
          "Legal & Compliance Email: legal@msmebooks.org",
          "General Customer Support: support@msmebooks.org",
          "Registered Corporate Entity: [MsmeBooks Technologies Ltd / Insert Verified Legal Entity]",
          "Registered Office Address: [Insert Corporate Headquarters Address, Lagos / Abuja, Nigeria]"
        ]
      }
    ]
  }
];

export const DOCUMENT_VERSIONS: DocumentVersion[] = [
  {
    version: "v2.4",
    effectiveDate: "October 21, 2026",
    releaseDate: "October 21, 2026",
    isCurrent: true,
    summary: "Enterprise multi-module consolidation, full NDPA 2023 data compliance, structured definition table, and cross-border SaaS provisions.",
    changes: [
      "Added complete structured Definition Table in Section 2.",
      "Expanded specific module coverage for POS, Multi-Warehouse Inventory, HR/Payroll, and Hospitality Folios.",
      "Clarified distinction between MsmeBooks subscription billing and third-party payment gateway transaction settlements.",
      "Updated data protection terms to reflect Nigeria Data Protection Act 2023 (NDPA) controller/processor relationship.",
      "Integrated formal Legal Counsel Review Checklist for pre-publication placeholders."
    ]
  },
  {
    version: "v2.3",
    effectiveDate: "May 15, 2026",
    releaseDate: "May 10, 2026",
    summary: "Introduction of Hospitality Management terms and AI-assisted bookkeeping features disclaimers.",
    changes: [
      "Added Section 14 (Hospitality, Restaurant and Property Management).",
      "Added Section 17 (Artificial Intelligence and Automated Features).",
      "Refined API rate limit governance and developer security provisions."
    ]
  },
  {
    version: "v2.0",
    effectiveDate: "January 10, 2026",
    releaseDate: "December 20, 2025",
    summary: "Major overhaul for multi-tenant cloud architecture, multi-branch POS, and unified business suites.",
    changes: [
      "Transitioned from single-ledger software to comprehensive multi-tenant SaaS architecture.",
      "Added Section 11 POS transaction dispute procedures.",
      "Added formal 30-day data export window on subscription cancellation."
    ]
  }
];

export const LEGAL_CHECKLIST_ITEMS: LegalChecklistItem[] = [
  {
    id: "chk-1",
    sectionNumber: 2,
    topic: "Registered Legal Entity Name",
    status: "pending_counsel",
    placeholderText: "[MsmeBooks Technologies Ltd / Insert Registered Legal Entity]",
    description: "Confirm the exact legal corporate entity name registered with the Corporate Affairs Commission (CAC) or corresponding company registry.",
    notes: "Requires official Certificate of Incorporation reference."
  },
  {
    id: "chk-2",
    sectionNumber: 30,
    topic: "Governing Law & Dispute Jurisdiction",
    status: "pending_counsel",
    placeholderText: "[Approved Governing Jurisdiction / Federal Republic of Nigeria]",
    description: "Verify preferred governing law jurisdiction and whether Lagos Court of Arbitration (LCA) or alternative dispute venue is chosen.",
    notes: "Counsel should confirm whether state or federal courts have primary jurisdiction."
  },
  {
    id: "chk-3",
    sectionNumber: 26,
    topic: "Financial Liability Cap",
    status: "pending_counsel",
    placeholderText: "[Approved Liability Cap / Twelve (12) Months]",
    description: "Confirm whether liability cap should be 12 months fees paid or a fixed monetary ceiling (e.g., NGN or USD equivalent).",
    notes: "Crucial for enterprise risk balancing."
  },
  {
    id: "chk-4",
    sectionNumber: 7,
    topic: "Annual Cancellation Refund Window",
    status: "pending_counsel",
    placeholderText: "[Approved Review Window / 14 days]",
    description: "Set the commercial refund eligibility window for annual prepaid subscriptions.",
    notes: "Verify standard 14-day or 30-day money-back guarantee policy."
  },
  {
    id: "chk-5",
    sectionNumber: 8,
    topic: "Data Protection Authority Registration",
    status: "pending_counsel",
    placeholderText: "Nigeria Data Protection Act 2023 (NDPA)",
    description: "Ensure Nigeria Data Protection Commission (NDPC) data controller/processor audit filing alignment.",
    notes: "Verify Data Protection Officer (DPO) contact designation."
  },
  {
    id: "chk-6",
    sectionNumber: 33,
    topic: "Registered Corporate Headquarters Address",
    status: "pending_counsel",
    placeholderText: "[Insert Corporate Headquarters Address, Lagos / Abuja, Nigeria]",
    description: "Supply the physical registered office address for receipt of legal process.",
    notes: "Must match official CAC records."
  }
];

export const RELATED_LEGAL_DOCUMENTS: RelatedLegalDoc[] = [
  {
    id: "doc-privacy",
    title: "Privacy Policy",
    description: "How MsmeBooks collects, stores, protects, and handles customer business data and personal information.",
    lastUpdated: "October 2026",
    status: "Published",
    url: "/privacy-policy",
    previewSummary: "Details our NDPA 2023 and GDPR compliant data handling, encryption standards, cookie management, and user privacy rights."
  },
  {
    id: "doc-refund",
    title: "Refund and Cancellation Policy",
    description: "Rules regarding subscription cancellations, grace periods, and eligible fee refunds.",
    lastUpdated: "October 2026",
    status: "Published",
    url: "/refund-policy",
    previewSummary: "Explains standard 14-day annual refund eligibility, non-refundable custom onboarding fees, and automated billing cancellation."
  },
  {
    id: "doc-aup",
    title: "Acceptable Use Policy (AUP)",
    description: "Standards of conduct, prohibited activities, and API traffic parameters.",
    lastUpdated: "October 2026",
    status: "Published",
    url: "/acceptable-use",
    previewSummary: "Prohibits fraudulent accounting, ledger tampering, unauthorized network scraping, and distribution of malicious code."
  },
  {
    id: "doc-dpa",
    title: "Data Processing Agreement (DPA)",
    description: "Contractual terms governing MsmeBooks as Data Processor on behalf of Customers.",
    lastUpdated: "October 2026",
    status: "Available on Request",
    url: "/dpa",
    previewSummary: "Includes Standard Contractual Clauses (SCCs), subprocessor audit protocols, and security breach notification workflows."
  },
  {
    id: "doc-sla",
    title: "Service Level Agreement (SLA)",
    description: "Uptime commitments, maintenance windows, and enterprise support response targets.",
    lastUpdated: "October 2026",
    status: "Available on Request",
    url: "/sla",
    previewSummary: "Covers 99.9% targeted uptime for enterprise tiers, scheduled maintenance schedules, and priority support response times."
  },
  {
    id: "doc-partner",
    title: "Partner and Reseller Agreement",
    description: "Terms governing certified accounting partners, software resellers, and technology affiliates.",
    lastUpdated: "October 2026",
    status: "Published",
    url: "/partner-agreement",
    previewSummary: "Governs revenue sharing, partner commission payout schedules, branding guidelines, and client onboarding ethics."
  },
  {
    id: "doc-security",
    title: "Security and Compliance Policy",
    description: "Detailed technical architecture, encryption protocols, and disaster recovery.",
    lastUpdated: "October 2026",
    status: "Published",
    url: "/security",
    previewSummary: "Documents TLS 1.3 in-transit encryption, AES-256 at-rest database protection, daily snapshot backups, and access reviews."
  }
];
