export interface PolicySection {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: 'Overview' | 'Data Details' | 'Governance & Rights' | 'Compliance & Modules' | 'Operations & Contact';
  content: string;
  subsections?: {
    letter?: string;
    title: string;
    body: string;
    items?: string[];
  }[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  highlightNote?: string;
}

export const POLICY_METADATA = {
  companyName: "MsmeBooks",
  website: "www.msmebooks.org",
  supportUrl: "https://www.msmebooks.org",
  phone: "+2349158482622",
  dpoEmail: "dpo@msmebooks.org",
  privacyEmail: "privacy@msmebooks.org",
  legalEntity: "MsmeBooks Technologies Limited (RC / Registered Entity [Legal Review Pending])",
  registeredAddress: "Plot 14, Commercial Avenue, Victoria Island / Central Business District, Lagos, Nigeria [Registered Address Pending Formal Confirmation]",
  effectiveDate: "January 15, 2026",
  lastUpdatedDate: "October 20, 2026",
  version: "Version 2.4 (Enterprise Production)",
  supervisoryAuthority: "Nigeria Data Protection Commission (NDPC) – https://ndpc.gov.ng",
};

export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: "section-1",
    number: 1,
    title: "Introduction",
    shortTitle: "Introduction",
    category: "Overview",
    content: "MsmeBooks ('we', 'us', or 'our') is a premier Pan-African and global Software-as-a-Service (SaaS) business management platform dedicated to empowering micro, small, and medium-sized enterprises (MSMEs), fast-growing enterprises, accounting professionals, and retail operators. This Privacy Policy describes how MsmeBooks collects, processes, stores, discloses, and safeguards personal information and proprietary business records when you interact with our websites (including www.msmebooks.org), cloud applications, mobile apps, point-of-sale (POS) systems, APIs, integrations, and related commercial services.",
    subsections: [
      {
        title: "1.1 Products and Services Covered",
        body: "This policy applies to all MsmeBooks solutions, including cloud accounting, automated bookkeeping, Point of Sale (POS) checkout systems, real-time inventory and warehousing controls, payroll management, hotel property management systems (PMS), e-commerce integrations, client invoicing engines, and associated customer support channels."
      },
      {
        title: "1.2 Relationship Between MsmeBooks, Business Customers, and End Users",
        body: "In the modern SaaS ecosystem, data relationships take two distinct forms under global privacy jurisprudence:\n• MsmeBooks as Data Controller: When you create a direct account with us, purchase software licenses, subscribe to marketing communications, or interact directly with our website and support teams, we determine the purposes and means of processing your account details.\n• MsmeBooks as Data Processor / Service Provider: When our business customers (e.g., retailers, hotels, clinics, firms) enter customer records, inventory transactions, employee payroll, or hotel guest details into their MsmeBooks tenant, the business customer acts as the Data Controller, and MsmeBooks processes such records strictly pursuant to customer instructions and our Data Processing Agreement (DPA)."
      }
    ]
  },
  {
    id: "section-2",
    number: 2,
    title: "Scope and Applicability",
    shortTitle: "Scope & Applicability",
    category: "Overview",
    content: "This Privacy Policy governs the handling of information across all categories of individuals who engage with MsmeBooks directly or whose records are legitimately processed through our platform by subscribed businesses.",
    subsections: [
      {
        title: "2.1 Categories of Individuals Covered",
        body: "The scope of this policy covers:",
        items: [
          "Website visitors and prospective customers exploring MsmeBooks solutions.",
          "Registered account owners, company administrators, and authorized business managers.",
          "Enterprise employees, cashiers, store clerks, and staff operating under a customer tenant account.",
          "Certified accountants, external bookkeepers, auditors, and financial advisors granted delegated access.",
          "Point of Sale (POS) retail customers receiving digital e-receipts, invoices, or loyalty credits.",
          "Vendors, suppliers, and procurement partners linked to customer accounting ledgers.",
          "Hotel guests and reservation clients booked via the MsmeBooks Hospitality PMS module.",
          "E-commerce buyers transacting through customer-connected online store channels.",
          "Channel partners, independent software vendors (ISVs), resellers, and system implementers."
        ]
      },
      {
        title: "2.2 Exclusions and Third-Party Links",
        body: "This policy does not govern third-party platforms, external payment gateways, or custom external applications linked into MsmeBooks that maintain independent privacy notices. We advise reviewing the respective privacy disclosures of any third-party software you connect."
      }
    ]
  },
  {
    id: "section-3",
    number: 3,
    title: "Information We Collect",
    shortTitle: "Information We Collect",
    category: "Data Details",
    content: "We organize the data we handle into transparent, well-defined categories. Data collection is calibrated to ensure operational efficiency while honoring the principle of data minimization.",
    subsections: [
      {
        letter: "A",
        title: "Account and Identity Information",
        body: "Mandatory information necessary to establish and authenticate user accounts:",
        items: [
          "Full names, professional email addresses, telephone numbers, and designated corporate usernames.",
          "Encrypted login credentials (passwords hashed using industry-standard salt algorithms).",
          "Business registration certificates, CAC/tax identification numbers (where required for fiscal compliance), and business operating address.",
          "Assigned user roles, department affiliations, and system permission levels."
        ]
      },
      {
        letter: "B",
        title: "Business and Financial Information",
        body: "Proprietary transactional records entered or synced by business administrators:",
        items: [
          "Chart of accounts, general ledgers, sales orders, accounts payable, accounts receivable, and expenditure vouchers.",
          "Customer and vendor contact registers, invoices, payment terms, and delivery notes.",
          "Value Added Tax (VAT), Withholding Tax (WHT), and statutory fiscal reconciliation reports.",
          "Warehouse inventory counts, stock movement audits, purchase orders, and barcode records."
        ]
      },
      {
        letter: "C",
        title: "Employee and Payroll Information",
        body: "Data managed by business customers using our HR and Payroll modules:",
        items: [
          "Employee names, job titles, employment contract dates, and departmental allocations.",
          "Salary scales, net wages, bonus disbursements, and approved employee banking account numbers for disbursement.",
          "Statutory payroll deductions, pension fund administrator (PFA) pins, PAYE tax liabilities, and social insurance numbers.",
          "Shift schedules, digital timecard punches, leave records, and attendance logs."
        ]
      },
      {
        letter: "D",
        title: "Transaction and Payment Information",
        body: "Billing records associated with software subscriptions and customer checkout workflows:",
        items: [
          "Subscription tier selections, billing frequency, invoice history, and license renewal schedules.",
          "Payment references, gateway transaction IDs, and settlement tokens provided by certified payment partners.",
          "Important note: MsmeBooks does not directly collect, process, or store raw credit/debit card numbers or CVV codes on our application servers. All online card payments are handled directly by PCI-DSS Level 1 compliant processors."
        ]
      },
      {
        letter: "E",
        title: "Device and Technical Information",
        body: "Automatically gathered telemetric records ensuring operational integrity and security:",
        items: [
          "Internet Protocol (IP) addresses, approximate geographic location based on IP, and Internet Service Provider (ISP).",
          "Browser software type and version, device hardware model, operating system architecture, and screen resolution.",
          "Session timestamps, feature interaction metrics, latency diagnostics, API error traces, and crash telemetry."
        ]
      },
      {
        letter: "F",
        title: "Support and Communications",
        body: "Records created when you reach out to our customer care channels:",
        items: [
          "Help desk support tickets, live chat transcripts, email correspondence, and telephone support logs.",
          "Attached diagnostic screenshots, system audit logs submitted for troubleshooting, and customer satisfaction survey responses."
        ]
      },
      {
        letter: "G",
        title: "Hospitality and Booking Information",
        body: "Information processed through the MsmeBooks Hospitality and Property Management module:",
        items: [
          "Guest full names, passport/national ID numbers (where mandated by local hotel hospitality regulations), and contact details.",
          "Room reservation dates, check-in/check-out timestamps, room allocation preferences, and guest billing accounts.",
          "Incidental charges, restaurant/bar POS room folio postings, and special guest service requests."
        ]
      }
    ]
  },
  {
    id: "section-4",
    number: 4,
    title: "How We Collect Information",
    shortTitle: "How We Collect Data",
    category: "Data Details",
    content: "MsmeBooks collects information through systematic, secure, and lawful collection channels:",
    subsections: [
      {
        title: "4.1 Direct Customer Input",
        body: "Collected when you register an account, subscribe to software plans, configure business profiles, onboard staff, create invoices, or submit support tickets."
      },
      {
        title: "4.2 Operational Software Usage",
        body: "Captured organically during day-to-day software operations, such as recording POS register sales, scanning barcode inventory in warehouse apps, or running month-end payroll computations."
      },
      {
        title: "4.3 Customer-Imported Business Records",
        body: "Ingested when administrators upload existing accounting data via CSV, Excel sheets, or third-party accounting format imports."
      },
      {
        title: "4.4 Automated Telemetry and Cookies",
        body: "Gathered automatically via secure server logs, local browser storage, and privacy-first analytical cookies upon website and portal interaction."
      },
      {
        title: "4.5 Third-Party Integrations and Authorized APIs",
        body: "Retrieved when customers connect bank reconciliation feeds, e-commerce storefronts (e.g. WooCommerce, Shopify), or payment gateways via authorized API keys."
      }
    ]
  },
  {
    id: "section-5",
    number: 5,
    title: "How We Use Information",
    shortTitle: "How We Use Data",
    category: "Data Details",
    content: "We use personal and commercial information exclusively for legitimate, explicit, and operational business purposes:",
    subsections: [
      {
        title: "5.1 Core Service Delivery and Maintenance",
        body: "To provision software tenants, authenticate user access, balance ledger accounts, calculate depreciation, generate accurate tax computations, and manage POS checkout hardware peripherals."
      },
      {
        title: "5.2 Reporting, Analytics, and Business Intelligence",
        body: "To aggregate customer business metrics into private balance sheets, profit and loss statements, sales velocity charts, and cash flow projections visible only to authorized users."
      },
      {
        title: "5.3 Customer Support and Incident Resolution",
        body: "To diagnose software anomalies, verify account authorization, provide technical walk-throughs, and restore operational workflows."
      },
      {
        title: "5.4 Platform Security and Fraud Prevention",
        body: "To monitor suspicious login attempts, prevent unauthorized tenant cross-talk, safeguard against brute-force intrusion, and audit financial access histories."
      },
      {
        title: "5.5 Regulatory and Statutory Adherence",
        body: "To comply with applicable fiscal record retention laws, anti-money laundering (AML) standards, and statutory audit mandates."
      }
    ]
  },
  {
    id: "section-6",
    number: 6,
    title: "Legal Bases for Processing",
    shortTitle: "Legal Bases",
    category: "Governance & Rights",
    content: "Under the Nigeria Data Protection Act 2023 (NDPA), South Africa's POPIA, Kenya DPA 2019, Ghana DPA 2012, and the European Union/UK GDPR, processing must be grounded in recognized lawful bases. MsmeBooks relies upon the following legal justifications:",
    subsections: [
      {
        title: "6.1 Contractual Necessity",
        body: "Processing is essential to perform the SaaS subscription contract entered into with you or to take pre-contractual steps at your request (e.g., account activation, software hosting, database management)."
      },
      {
        title: "6.2 Legal and Regulatory Obligations",
        body: "Processing necessary to satisfy mandatory legal duties, including fiscal reporting, tax withholding computations, anti-fraud compliance, and statutory accounting retention."
      },
      {
        title: "6.3 Legitimate Business Interests",
        body: "Processing required for the legitimate interests pursued by MsmeBooks or our customers, provided such interests are not overridden by the fundamental rights and freedoms of data subjects. This includes threat detection, network stability, and software performance optimization."
      },
      {
        title: "6.4 Specific and Informed Consent",
        body: "Where statutory rules require explicit consent (e.g., promotional marketing campaigns, optional non-essential tracking cookies), we obtain unambiguous consent. Users retain the unencumbered right to withdraw consent at any time without punitive consequences."
      }
    ]
  },
  {
    id: "section-7",
    number: 7,
    title: "Customer Data Ownership and Control",
    shortTitle: "Data Ownership & Control",
    category: "Governance & Rights",
    content: "At MsmeBooks, our core tenet is unambiguous: You own your business data. MsmeBooks does not claim intellectual property or proprietary rights over the financial records, customer lists, inventory catalogues, or confidential ledgers that you enter into the platform.",
    subsections: [
      {
        title: "7.1 Distinction Between Customer Data and System Telemetry",
        body: "• Customer Data: Invoices, receipts, tax logs, payroll data, inventory manifests, and customer details remain the exclusive property of the subscribing business.\n• System Telemetry: Anonymized application uptime logs, aggregated platform throughput statistics, and non-identifiable code execution diagnostics are maintained by MsmeBooks for platform operations."
      },
      {
        title: "7.2 Data Portability and Comprehensive Export",
        body: "Subscribers maintain continuous rights to extract their financial ledgers, customer records, and product catalogues at any time through built-in standard export facilities (CSV, Microsoft Excel .xlsx, and formatted PDF)."
      },
      {
        title: "7.3 Account Closure and Data Handover",
        body: "Upon subscription termination or account cancellation, account owners are granted a 30-day transitional grace period to download all archived financial records, after which customer tenants are queued for cryptographic purge according to our retention schedule."
      }
    ]
  },
  {
    id: "section-8",
    number: 8,
    title: "Information Sharing and Disclosure",
    shortTitle: "Information Sharing",
    category: "Governance & Rights",
    content: "MsmeBooks maintains a strict policy: We do not sell, rent, monetize, or trade your personal data or business financial ledgers to third-party data brokers or advertisers under any circumstances. Information is disclosed solely to authorized service partners necessary to fulfill our core services.",
    subsections: [
      {
        title: "8.1 Categories of Authorized Service Providers",
        body: "We partner only with vetted vendors bound by strict confidentiality and data protection agreements:",
        items: [
          "Cloud Infrastructure Providers: Certified enterprise data centers hosting virtual servers, object storage, and secure databases.",
          "Payment Processing Gateways: Licensed financial institutions and payment facilitators (such as Paystack, Flutterwave, or Stripe) processing subscription charges.",
          "Communication Service Providers: Secure transactional email and SMS gateways delivering password resets, automated invoice receipts, and two-factor authentication codes.",
          "Customer Support Tools: Encrypted help-desk management platforms assisting in customer query triage."
        ]
      },
      {
        title: "8.2 Mandatory Legal Disclosures",
        body: "We may disclose minimal required data if legally mandated by a valid subpoena, court order, or formal request from a competent regulatory authority (e.g., NDPC, tax authorities), provided we give prior notice to the customer unless legally prohibited."
      }
    ]
  },
  {
    id: "section-9",
    number: 9,
    title: "Data Security",
    shortTitle: "Data Security",
    category: "Governance & Rights",
    content: "MsmeBooks adopts modern enterprise-grade security architecture designed to preserve the confidentiality, integrity, and availability of all data entrusted to our cloud ecosystem.",
    subsections: [
      {
        title: "9.1 Cryptographic Safeguards",
        body: "• Data in Transit: All incoming and outgoing data transmissions are secured using Transport Layer Security (TLS 1.3 / TLS 1.2) with strict forward secrecy and HSTS enforcement.\n• Data at Rest: Core transactional databases, encrypted document stores, and automated server snapshots are protected using Advanced Encryption Standard (AES-256)."
      },
      {
        title: "9.2 Authentication and Access Controls",
        body: "• Multi-Factor Authentication (MFA): Optional and recommended two-factor authentication via time-based one-time passwords (TOTP) or SMS security codes.\n• Role-Based Access Controls (RBAC): Granular permission gates enabling administrators to isolate access so that cashiers, inventory managers, and chief financial officers access only their designated modules.\n• Automated Session Invalidation: Automatic logout after configurable inactivity thresholds to prevent unauthorized workstation hijacking."
      },
      {
        title: "9.3 Resilience and Disaster Recovery",
        body: "Daily automated encrypted backups are stored across georedundant facilities with regular restoration drills to ensure business continuity in the event of hardware or regional connectivity disruptions."
      }
    ],
    highlightNote: "Security Governance Notice: MsmeBooks actively executes vulnerability assessments and code audits. We do not claim external certifications (such as ISO 27001 or SOC 2 Type II) until formal accredited audit reports are completed and publicly registered."
  },
  {
    id: "section-10",
    number: 10,
    title: "Cloud Hosting and International Data Transfers",
    shortTitle: "Cloud & Data Transfers",
    category: "Operations & Contact",
    content: "MsmeBooks operates on resilient, globally distributed cloud hosting infrastructure optimized for low-latency performance across African commercial hubs and global markets.",
    subsections: [
      {
        title: "10.1 Cloud Hosting Architecture",
        body: "Our primary application servers and database clusters are hosted within Tier-3 and Tier-4 carrier-neutral cloud data facilities equipped with 24/7 physical security, biometric entry controls, dual power grids, and advanced climate control."
      },
      {
        title: "10.2 Cross-Border Data Transfers",
        body: "Because our platform delivers international SaaS connectivity, data may be processed on servers located outside your jurisdiction of residence. Where cross-border data transfers occur, MsmeBooks implements recognized statutory safeguards, including standard contractual clauses, international data transfer agreements, and transfer impact assessments aligned with the NDPA 2023 and international best practices."
      }
    ]
  },
  {
    id: "section-11",
    number: 11,
    title: "Data Retention and Deletion",
    shortTitle: "Retention & Deletion",
    category: "Operations & Contact",
    content: "MsmeBooks retains personal and business information only for the duration necessary to satisfy operational purposes, contractual commitments, and statutory recordkeeping mandates (such as national tax and accounting laws).",
    tableData: {
      headers: ["Data Category", "Primary Purpose", "Standard Retention Period", "Post-Retention Procedure"],
      rows: [
        ["User Account & Credentials", "Authentication & tenant identity", "Duration of active subscription + 30 days grace", "Cryptographic erasure / anonymization"],
        ["General Accounting Ledgers & Invoices", "Tax reporting & statutory compliance", "6 to 7 years (as mandated by fiscal tax laws)", "Secure offline archive / certified purge"],
        ["Point of Sale (POS) Receipts", "Sales reconciliation & inventory tracking", "3 years from transaction date", "Aggregated statistical roll-up, PII stripped"],
        ["Employee Payroll & PAYE Tax Records", "Labor law & tax audit adherence", "6 years following tax year of payment", "Permanent de-identification or purge"],
        ["Hospitality Guest Folios & Registers", "Hospitality regulatory compliance", "2 to 3 years from checkout date", "Anonymization of personal identification"],
        ["Diagnostic Logs & Error Traces", "System stability & debugging", "90 to 180 days rolling window", "Automated circular log overwrite"],
        ["Payment Gateway Settlement Tokens", "Dispute resolution & chargeback defense", "18 months from transaction date", "Token expiry and purge from gateway cache"]
      ]
    },
    subsections: [
      {
        title: "11.1 Deletion and Anonymization Workflows",
        body: "Upon receiving a verified deletion request or expiration of mandatory retention periods, data is scrubbed using secure digital sanitization techniques. Backups are aged out systematically according to our rolling snapshot retention lifecycle."
      }
    ]
  },
  {
    id: "section-12",
    number: 12,
    title: "Cookies and Tracking Technologies",
    shortTitle: "Cookies & Tracking",
    category: "Operations & Contact",
    content: "MsmeBooks uses cookies, local web storage, and session tokens to enhance platform usability, remember session preferences, and evaluate website performance.",
    subsections: [
      {
        title: "12.1 Categorization of Cookies",
        body: "• Strictly Necessary Cookies: Essential for logging into secure areas, maintaining CSRF protection, and operating software shopping carts. These cannot be disabled without breaking the platform.\n• Functional Cookies: Remember your localized interface settings, selected currency display, and preferred dashboard views.\n• Analytical & Performance Cookies: Collect non-identifying telemetry on page navigation speeds, feature adoption rates, and error encounters to help our engineers optimize platform response times.\n• Marketing Cookies: Used solely on public marketing pages (never within private accounting tenants) to measure the effectiveness of informational campaigns. These cookies require your opt-in consent."
      },
      {
        title: "12.2 Managing Your Cookie Preferences",
        body: "You can modify your cookie choices at any time via our interactive Cookie Preferences interface accessible from the footer or rights center on this page."
      }
    ]
  },
  {
    id: "section-13",
    number: 13,
    title: "Privacy Rights",
    shortTitle: "Your Privacy Rights",
    category: "Governance & Rights",
    content: "Depending on your applicable jurisdiction, you are entitled to exercise significant statutory rights regarding your personal information:",
    subsections: [
      {
        title: "13.1 Summary of Recognized Rights",
        body: "• Right to Access: You may request confirmation of whether we process your personal data and obtain a readable copy.\n• Right to Rectification: You may request the correction of inaccurate or incomplete personal records.\n• Right to Erasure ('Right to be Forgotten'): You may request deletion of personal data where retention is no longer justified by law or contract.\n• Right to Restriction of Processing: You may request that we suspend active processing while data accuracy or legal claims are contested.\n• Right to Data Portability: You may receive your personal data in a structured, commonly used, and machine-readable format.\n• Right to Object: You may object to processing grounded on legitimate interests or direct marketing at any time."
      },
      {
        title: "13.2 Submitting and Verifying Rights Requests",
        body: "Requests may be submitted via our Privacy Rights Centre below or by writing to dpo@msmebooks.org. To protect client confidentiality, we verify the requester's identity through two-factor authentication or official documentation before releasing or modifying records. Responses are delivered within 30 calendar days."
      }
    ]
  },
  {
    id: "section-14",
    number: 14,
    title: "Nigeria Data Protection Compliance",
    shortTitle: "Nigeria Compliance (NDPA)",
    category: "Compliance & Modules",
    content: "As a technology platform originating in and actively serving the Nigerian digital economy, MsmeBooks adheres to the Nigeria Data Protection Act 2023 (NDPA) and regulatory guidance issued by the Nigeria Data Protection Commission (NDPC).",
    subsections: [
      {
        title: "14.1 Compliance Architecture",
        body: "• Lawful and Fair Processing: Ensuring that all processing involving Nigerian data subjects aligns strictly with Section 25 of the NDPA.\n• Designate Privacy Leadership: MsmeBooks has designated an internal Data Protection Lead and operational oversight team reachable at dpo@msmebooks.org.\n• Controller vs. Processor Safeguards: Enforcing standard terms guaranteeing that customer data processed on behalf of Nigerian MSMEs is treated with equivalent technical security under Section 29.\n• Incident Reporting: Maintaining internal procedures to assess and notify the NDPC and impacted individuals of any significant personal data breaches within the statutory timelines."
      },
      {
        title: "14.2 Supervisory Authority Recourse",
        body: "Nigerian data subjects retain the right to lodge inquiries or complaints directly with the Nigeria Data Protection Commission (NDPC) at https://ndpc.gov.ng or via email at info@ndpc.gov.ng."
      }
    ],
    highlightNote: "Regulatory Clarity: MsmeBooks continually aligns its operational documentation with NDPC directives. We do not claim unverified statutory certifications or formal awards without documented regulatory registry verification."
  },
  {
    id: "section-15",
    number: 15,
    title: "Other African and International Privacy Laws",
    shortTitle: "International Privacy Laws",
    category: "Compliance & Modules",
    content: "To support our Pan-African and global commercial operations, MsmeBooks incorporates privacy safeguards tailored to regional legal frameworks across jurisdictions where our clients operate:",
    subsections: [
      {
        title: "15.1 South Africa – Protection of Personal Information Act (POPIA)",
        body: "For South African enterprises and data subjects, we comply with the eight lawful processing conditions under POPIA, ensuring responsible processing of personal and juristic business information and honoring requests directed to the Information Regulator (South Africa)."
      },
      {
        title: "15.2 Kenya – Data Protection Act 2019",
        body: "For Kenyan entities, we uphold statutory principles overseen by the Office of the Data Protection Commissioner (ODPC), including clear purpose specification, data minimization, and cross-border transfer requirements."
      },
      {
        title: "15.3 Ghana – Data Protection Act 2012 (Act 843)",
        body: "For users in Ghana, processing respects statutory data subject entitlements monitored by the Data Protection Commission (DPC) of Ghana."
      },
      {
        title: "15.4 European Union & United Kingdom – GDPR",
        body: "Where MsmeBooks processes personal data of individuals located within the European Economic Area (EEA) or the United Kingdom, we adhere to GDPR/UK GDPR requirements, including legal basis justification, standard contractual clauses for transfers, and assistance with Data Subject Access Requests (DSAR)."
      }
    ]
  },
  {
    id: "section-16",
    number: 16,
    title: "Payment Processing and Financial Information",
    shortTitle: "Payments & Financial Data",
    category: "Compliance & Modules",
    content: "Financial integrity and payment security are paramount in business accounting software. MsmeBooks enforces strict boundaries between our application layer and cardholder payment networks.",
    subsections: [
      {
        title: "16.1 Subscription and License Billing",
        body: "When you pay for your MsmeBooks software licenses, payments are conducted via embedded, PCI-DSS compliant checkout frames provided by licensed payment aggregators. Your full card numbers never touch MsmeBooks database servers."
      },
      {
        title: "16.2 Customer-Facing Online Invoicing and POS Processing",
        body: "When our business customers send digital invoices to their clients with integrated payment links, settlement proceeds are processed directly through the customer's configured payment gateway integration (e.g. Paystack, Flutterwave, Stripe, or localized banking switches). MsmeBooks logs only transaction reference codes, settled amounts, and timestamps for ledger reconciliation."
      }
    ]
  },
  {
    id: "section-17",
    number: 17,
    title: "AI Features and Automated Processing",
    shortTitle: "AI & Automated Features",
    category: "Compliance & Modules",
    content: "MsmeBooks offers modern, productivity-enhancing artificial intelligence and machine-learning capabilities designed to save business owners time and enhance decision-making.",
    subsections: [
      {
        title: "17.1 AI Capabilities Offered",
        body: "Current and roadmap AI features include automated bank statement transaction categorization, cash flow forecasting, inventory reorder recommendations, invoice optical character recognition (OCR), and conversational help-desk support assistance."
      },
      {
        title: "17.2 Model Training and Privacy Commitments",
        body: "• Strict Tenant Isolation: Your private financial statements, proprietary pricing margins, and confidential customer ledgers are NEVER used to train open, public foundational AI models without your explicit opt-in consent.\n• Ephemeral Inference: Data sent to our secure AI inference pipelines is processed in transient memory to generate immediate insights (such as quarterly forecasts) and is not persisted by third-party model providers."
      },
      {
        title: "17.3 Human In The Loop",
        body: "All automated accounting categorizations and predictive suggestions remain subject to final verification and manual approval by authorized human bookkeepers or managers."
      }
    ]
  },
  {
    id: "section-18",
    number: 18,
    title: "Industry-Specific Privacy",
    shortTitle: "Industry Modules Privacy",
    category: "Compliance & Modules",
    content: "MsmeBooks caters to diverse business sectors. Each specialized module enforces appropriate privacy considerations:",
    subsections: [
      {
        title: "18.1 Retail, Supermarkets, and POS",
        body: "POS terminals record customer phone numbers or emails solely when requested for electronic receipts or loyalty enrollment. Cashiers operate with restricted permissions that prevent bulk export of customer registers."
      },
      {
        title: "18.2 Accounting, Tax, and Professional Practices",
        body: "Accountants managing multi-client portals can strictly delineate client books. Audit trails record every voucher modification, credit note issuance, and tax journal entry."
      },
      {
        title: "18.3 Inventory, Logistics, and Warehousing",
        body: "Supplier pricing agreements and consignment manifests are protected under strict tenancy walls to safeguard commercial trade secrets."
      },
      {
        title: "18.4 Hospitality and Hotel PMS",
        body: "Guest reservation registers, passport numbers, and room check-in logs are restricted to authorized front-desk and audit personnel. Automated data archiving supports hospitality regulatory retention without unnecessary data leakage."
      },
      {
        title: "18.5 Human Resources and Payroll",
        body: "Employee remuneration details, bank account numbers, and disciplinary files are accessible exclusively by designated HR administrators and account principals."
      }
    ]
  },
  {
    id: "section-19",
    number: 19,
    title: "Third-Party Applications and Integrations",
    shortTitle: "Integrations & APIs",
    category: "Compliance & Modules",
    content: "MsmeBooks allows business administrators to connect third-party productivity tools, banking feeds, and e-commerce platforms to automate workflow operations.",
    subsections: [
      {
        title: "19.1 Customer Authorizations",
        body: "Third-party integrations (such as e-commerce plugins or messaging bots) connect only after an account administrator authorizes the integration via OAuth credentials or secure API tokens."
      },
      {
        title: "19.2 Revocation and Scoped Access",
        body: "Administrators may instantly revoke third-party API tokens from their MsmeBooks settings at any time, immediately halting data exchange with that external service."
      }
    ]
  },
  {
    id: "section-20",
    number: 20,
    title: "Children's Privacy",
    shortTitle: "Children's Privacy",
    category: "Governance & Rights",
    content: "MsmeBooks is a dedicated business-to-business (B2B) commercial management platform. Our products, websites, and services are not directed to, marketed towards, or intended for use by children under the age of 18 (or the age of majority in the user's jurisdiction).",
    subsections: [
      {
        title: "20.1 Incidental Processing via Customer Records",
        body: "If a business customer (such as an educational institution or family hotel) utilizes MsmeBooks modules to manage records that include minor dependents, the business customer acts as the responsible Data Controller with full legal obligation to obtain requisite parental or guardian consents."
      }
    ]
  },
  {
    id: "section-21",
    number: 21,
    title: "Marketing Communications",
    shortTitle: "Marketing Communications",
    category: "Operations & Contact",
    content: "We respect your communication preferences and provide transparent mechanisms to control marketing touchpoints.",
    subsections: [
      {
        title: "21.1 Transactional vs. Promotional Communications",
        body: "• Mandatory Transactional Alerts: System notifications, billing invoices, security advisories, and password reset emails are necessary for software execution and cannot be opted out of while maintaining an active account.\n• Promotional Communications: Newsletters, feature releases, and webinars are sent solely to subscribers who have consented. Every marketing email includes an immediate, one-click unsubscribe link."
      }
    ]
  },
  {
    id: "section-22",
    number: 22,
    title: "Business Partners and Resellers",
    shortTitle: "Partners & Resellers",
    category: "Operations & Contact",
    content: "MsmeBooks collaborates with certified accounting practitioners, system integrators, regional distributors, and software resellers.",
    subsections: [
      {
        title: "22.1 Partner Responsibilities and Confidentiality",
        body: "Authorized resellers and onboarding consultants operate under binding contractual agreements requiring them to maintain strict confidentiality, respect client tenancy walls, and process customer credentials solely within designated onboarding scopes."
      }
    ]
  },
  {
    id: "section-23",
    number: 23,
    title: "Data Breaches and Security Incidents",
    shortTitle: "Breach Incident Response",
    category: "Governance & Rights",
    content: "MsmeBooks maintains a structured Computer Security Incident Response Plan (CSIRP) to rapidly identify, contain, and remediate suspected security events.",
    subsections: [
      {
        title: "23.1 Incident Response Workflow",
        body: "Upon detecting a confirmed breach of security resulting in accidental or unlawful destruction, loss, alteration, or unauthorized disclosure of personal data, our security team immediately activates containment protocols, isolates affected systems, and commences forensic analysis."
      },
      {
        title: "23.2 Regulatory and Customer Notifications",
        body: "In accordance with the NDPA 2023, GDPR, and relevant regional privacy mandates, MsmeBooks will notify the competent supervisory authority (such as the NDPC) and affected account administrators without undue delay upon confirming a breach that creates high risks to individuals' rights and freedoms."
      }
    ]
  },
  {
    id: "section-24",
    number: 24,
    title: "Changes to the Privacy Policy",
    shortTitle: "Policy Updates",
    category: "Operations & Contact",
    content: "We periodically update this Privacy Policy to reflect enhancements to our SaaS platform, new statutory requirements, or organizational adjustments.",
    subsections: [
      {
        title: "24.1 Notification of Material Changes",
        body: "When material changes are made that alter how we handle your personal data, we will provide prominent notice—such as an in-app banner alert, an email to your primary account administrator, or a prominent notice on our website—at least thirty (30) days prior to the effective date."
      },
      {
        title: "24.2 Version Archive",
        body: "The top of this document displays the current version number and last updated date. Historical policy revisions are preserved in our compliance repository and accessible upon written request."
      }
    ]
  },
  {
    id: "section-25",
    number: 25,
    title: "Contact and Privacy Requests",
    shortTitle: "Contact & DPO",
    category: "Operations & Contact",
    content: "If you have questions, inquiries, feedback, or wish to exercise your statutory data privacy rights under this policy, please reach out to our dedicated privacy office:",
    subsections: [
      {
        title: "25.1 Official Privacy Contact Channels",
        body: "• Platform: MsmeBooks (www.msmebooks.org)\n• Telephone: +2349158482622\n• Data Protection Officer (DPO): dpo@msmebooks.org\n• General Privacy Inquiries: privacy@msmebooks.org\n• Legal Entity: MsmeBooks Technologies Limited (RC / Registered Entity [Legal Review Pending])\n• Corporate Address: Plot 14, Commercial Avenue, Victoria Island / CBD, Lagos, Nigeria [Registered Address Pending Confirmation]"
      },
      {
        title: "25.2 Escalation to Supervisory Authority",
        body: "If you believe an inquiry or privacy complaint has not been resolved satisfactorily, you retain the statutory entitlement to contact the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng or your relevant national data protection authority."
      }
    ]
  }
];

export const PRIVACY_FAQS = [
  {
    q: "What information does MsmeBooks collect?",
    a: "MsmeBooks collects account identity details (names, verified emails, phone numbers, corporate registration details), business transactional ledgers (invoices, expenses, inventory, charts of accounts), employee payroll records, hospitality reservations (where PMS is enabled), technical telemetry (IP addresses, device metadata), and customer support logs. We collect only what is necessary to operate our cloud business platform."
  },
  {
    q: "Who can access my business data?",
    a: "Only authorized users within your business tenant who have been explicitly granted permission by your account administrator can view your business data. MsmeBooks engineering personnel access database tenants strictly for necessary customer-requested technical support or troubleshooting under strict role-based access controls and logged audit trails."
  },
  {
    q: "How is financial information protected?",
    a: "All data in transit is encrypted using TLS 1.3 / TLS 1.2 with perfect forward secrecy. Data at rest (databases, storage snapshots, backups) is encrypted using industry-standard AES-256. We support multi-factor authentication (MFA) and granular role-based permissions."
  },
  {
    q: "Does MsmeBooks share information with third parties?",
    a: "MsmeBooks does NOT sell, rent, or trade your personal or business records to advertisers or third-party data brokers. Information is shared strictly with authorized infrastructure subprocessors (e.g., cloud hosting, transactional email delivery, payment processors) bound by strict confidentiality and data protection agreements."
  },
  {
    q: "Where is customer data stored?",
    a: "Customer data is hosted in high-availability, carrier-neutral Tier-3/Tier-4 cloud data facilities equipped with 24/7 physical security, biometric controls, dual power grids, and enterprise redundancy, optimized for African and international businesses."
  },
  {
    q: "Can I export my accounting records?",
    a: "Yes. You maintain complete ownership of your data. You can export complete accounting ledgers, invoices, inventory manifests, and customer contact books into standard machine-readable formats (Excel .xlsx, CSV, and PDF) directly from your administration panel at any time."
  },
  {
    q: "What happens to my data if I cancel my subscription?",
    a: "Upon subscription cancellation, your account enters a 30-day transitional grace period allowing you to complete any final data exports. After this grace period, your active database tenant is securely scheduled for permanent cryptographic deletion and de-identification in accordance with our retention policy."
  },
  {
    q: "How can I request deletion of my personal information?",
    a: "You can submit an erasure request directly through our interactive Privacy Rights Centre on this page or by emailing our Data Protection Officer at dpo@msmebooks.org. We will verify your identity and process the request within 30 days, subject to mandatory legal tax record retention requirements."
  },
  {
    q: "How does MsmeBooks handle employee payroll data?",
    a: "When business customers use the MsmeBooks Payroll module, the business customer acts as the Data Controller and MsmeBooks acts as the Data Processor. Payroll information (wages, bank details, tax deductions) is stored in encrypted tenant partitions accessible only to authorized payroll officers."
  },
  {
    q: "What information is processed through the hotel PMS?",
    a: "The Hospitality and Property Management module processes guest names, contact details, dates of stay, room assignments, folio charges, and regulatory registration information (such as passport copies where required by local tourism hospitality laws), strictly under the direction of the hotel operator."
  },
  {
    q: "Does MsmeBooks use customer information for AI training?",
    a: "No. Your proprietary business ledgers, client invoices, and financial records are NOT used to train public, generalized AI foundation models without explicit opt-in consent. AI features utilize isolated, ephemeral inference solely to compute your specific requested projections or categorizations."
  },
  {
    q: "How can I manage cookies?",
    a: "You can adjust your cookie settings at any time by clicking 'Manage Cookie Preferences' in our Privacy Rights Centre or using the Cookie Settings button in the footer. You can enable or disable analytical and marketing cookies while strictly necessary cookies remain active to guarantee software security."
  },
  {
    q: "How do I report a privacy concern or security issue?",
    a: "You can report privacy concerns directly to our Data Protection Officer at dpo@msmebooks.org, submit a ticket via our interactive Rights Centre, or call our direct line at +2349158482622. We triage and respond to all privacy escalations promptly."
  },
  {
    q: "What privacy laws apply to MsmeBooks?",
    a: "As a platform operating primarily from Nigeria and serving Pan-African and global clients, we adhere to the Nigeria Data Protection Act 2023 (NDPA). Depending on customer location, we also align practices with South Africa's POPIA, Kenya's Data Protection Act 2019, Ghana's Data Protection Act 2012, and the European Union / UK GDPR."
  },
  {
    q: "How can I contact the privacy team?",
    a: "You can reach the MsmeBooks Privacy Office via email at dpo@msmebooks.org or privacy@msmebooks.org, via phone at +2349158482622, or by visiting our website at www.msmebooks.org."
  }
];

export const RELATED_LEGAL_DOCUMENTS = [
  {
    id: "terms",
    title: "Terms and Conditions",
    description: "Standard master service terms governing subscription licenses, acceptable use, and platform access.",
    status: "Published",
    version: "v3.1",
    summary: "Governs platform licensing, payment commitments, uptime service levels, account termination rules, and limitation of liability."
  },
  {
    id: "dpa",
    title: "Data Processing Agreement (DPA)",
    description: "Contractual provisions establishing processor duties when MsmeBooks processes customer business data.",
    status: "Published",
    version: "v2.0",
    summary: "Mandatory contract for enterprise and business clients outlining GDPR/NDPA processor responsibilities, subprocessor vetting, security controls, and audit commitments."
  },
  {
    id: "cookie",
    title: "Cookie Policy",
    description: "Comprehensive breakdown of technical cookies, analytical tags, and local storage tokens utilized.",
    status: "Published",
    version: "v1.8",
    summary: "Lists all first-party and third-party cookies, expiration durations, and browser-based management instructions."
  },
  {
    id: "security",
    title: "Security & Trust Overview",
    description: "Detailed architecture review of encryption, physical hosting, DDoS protection, and backup protocols.",
    status: "Published",
    version: "v2.4",
    summary: "Technical whitepaper covering our defense-in-depth architecture, TLS 1.3 encryption, AES-256 storage, and vulnerability testing."
  },
  {
    id: "refund",
    title: "Refund Policy",
    description: "Fair terms governing billing disputes, subscription cancellations, and prorated refund eligibility.",
    status: "Published",
    version: "v2.0",
    summary: "Details our 14-day evaluation guarantee, renewal billing notices, and cancellation procedures."
  },
  {
    id: "subprocessors",
    title: "Subprocessor Directory",
    description: "Approved third-party infrastructure and service vendors supporting the MsmeBooks SaaS platform.",
    status: "Published",
    version: "v1.4",
    summary: "Official registry of cloud hosting, CDN, transactional email, and payment gateway infrastructure partners."
  },
  {
    id: "reseller",
    title: "Partner & Reseller Agreement",
    description: "Confidentiality and governance standards for accounting firms and regional distributors.",
    status: "Published",
    version: "v1.2",
    summary: "Establishes compliance and client data isolation requirements for certified bookkeepers, accountants, and software resellers."
  },
  {
    id: "aup",
    title: "Acceptable Use Policy (AUP)",
    description: "Rules regarding prohibited financial activities, fraudulent billing, and system abuse.",
    status: "Published",
    version: "v2.1",
    summary: "Defines strict restrictions against using MsmeBooks for pyramid schemes, money laundering, unsolicited bulk spamming, or hacking attempts."
  }
];
