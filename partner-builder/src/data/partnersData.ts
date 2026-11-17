import { PartnerTierInfo, PartnerCategory, CertifiedPartner, SuccessStory } from '../types';

export const PARTNER_TIERS: Record<string, PartnerTierInfo> = {
  bronze: {
    id: 'bronze',
    name: 'Bronze Partner',
    commissionRate: 15,
    color: '#B45309',
    metallicTheme: 'Bronze metallic with MsmeBooks corporate blue',
    badgeGradient: 'from-[#92400E] via-[#D97706] to-[#78350F]',
    accentBorder: 'border-[#B45309]',
    tagline: 'Ideal entry point for freelance bookkeepers and individual consultants',
    minReferrals: '1–15 active subscriptions',
    recommendedFor: 'Independent accountants, early-stage affiliates and technology associates'
  },
  silver: {
    id: 'silver',
    name: 'Silver Partner',
    commissionRate: 20,
    color: '#64748B',
    metallicTheme: 'Silver metallic with MsmeBooks corporate blue',
    badgeGradient: 'from-[#475569] via-[#94A3B8] to-[#334155]',
    accentBorder: 'border-[#94A3B8]',
    tagline: 'For established advisory firms and active software resellers',
    minReferrals: '16–50 active subscriptions',
    recommendedFor: 'Boutique accounting firms, IT service providers and POS hardware agents'
  },
  gold: {
    id: 'gold',
    name: 'Gold Partner',
    commissionRate: 30,
    color: '#D97706',
    metallicTheme: 'Gold metallic with MsmeBooks corporate blue',
    badgeGradient: 'from-[#B45309] via-[#FBBF24] to-[#78350F]',
    accentBorder: 'border-[#F59E0B]',
    tagline: 'High-growth milestone for certified implementation practices',
    minReferrals: '51–150 active subscriptions',
    recommendedFor: 'Regional accounting practices, ERP consultants, and technology distributors'
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Partner',
    commissionRate: 40,
    color: '#0284C7',
    metallicTheme: 'Platinum metallic with corporate blue & lemon-green accents',
    badgeGradient: 'from-[#0369A1] via-[#38BDF8] to-[#0A3981]',
    accentBorder: 'border-[#38BDF8]',
    tagline: 'Top-tier enterprise partners with dedicated channel growth teams',
    minReferrals: '151+ active subscriptions',
    recommendedFor: 'National IT distributors, fintech aggregators, and corporate outsourcing firms'
  }
};

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    id: 'accountants',
    title: 'Accountants & Accounting Firms',
    group: 'finance',
    shortDesc: 'Certified accountants offering bookkeeping, tax advisory, and modern cloud management to SME clients.',
    opportunities: ['Provide managed bookkeeping & payroll services', 'Earn 15%-40% recurring software commissions', 'Streamline multi-company audits with one master login'],
    icon: 'Calculator'
  },
  {
    id: 'bookkeepers',
    title: 'Professional Bookkeepers',
    group: 'finance',
    shortDesc: 'Independent bookkeepers managing everyday sales, purchases, bank feeds, and ledger reconciliations.',
    opportunities: ['Automate daily ledger entries and client reporting', 'White-glove client onboarding fee income', 'Receive continuous subscription revenue shares'],
    icon: 'BookOpen'
  },
  {
    id: 'tax_consultants',
    title: 'Tax Consultants',
    group: 'finance',
    shortDesc: 'Tax practitioners preparing VAT, withholding tax, and statutory filing for African SMEs.',
    opportunities: ['Ensure statutory tax compliance for growing businesses', 'Generate automated tax summaries in minutes', 'Upsell ongoing tax audit advisory retainers'],
    icon: 'FileSpreadsheet'
  },
  {
    id: 'audit_firms',
    title: 'Audit Firms',
    group: 'finance',
    shortDesc: 'Chartered auditing and assurance practices reviewing corporate financial records and internal controls.',
    opportunities: ['Accelerate audit engagements with clean digital audit trails', 'Deliver system reviews and compliance attestations', 'Institutional partner tier benefits'],
    icon: 'ShieldCheck'
  },
  {
    id: 'pos_agents',
    title: 'POS Agents & Service Providers',
    group: 'technology',
    shortDesc: 'Specialists deploying retail and hospitality point-of-sale hardware, thermal printers, and cloud sync.',
    opportunities: ['Bundle POS hardware with MsmeBooks retail software', 'Earn recurring commissions from supermarket & restaurant clients', 'Onsite installation and maintenance fees'],
    icon: 'Laptop'
  },
  {
    id: 'it_companies',
    title: 'IT & Technology Companies',
    group: 'technology',
    shortDesc: 'System integrators and managed service providers equipping commercial clients with enterprise tech.',
    opportunities: ['Deliver full-suite cloud ERP transitions for corporate clients', 'API integration and custom reporting projects', 'Recurring software revenue stream'],
    icon: 'Cpu'
  },
  {
    id: 'software_resellers',
    title: 'Software Resellers & Distributors',
    group: 'technology',
    shortDesc: 'Established software distribution channels and digital license value-added resellers across Africa.',
    opportunities: ['Distribute leading African SME business software', 'Tier-based volume commission rebates', 'Co-branded marketing collateral & sales lead distribution'],
    icon: 'Layers'
  },
  {
    id: 'hardware_vendors',
    title: 'Computer Shops & Hardware Vendors',
    group: 'retail',
    shortDesc: 'Retailers of desktop PCs, laptops, receipt printers, barcode scanners, and commercial cash drawers.',
    opportunities: ['Pre-install MsmeBooks on all sold business computers', 'Offer ready-to-use business management bundles', 'Immediate additional profit on equipment sales'],
    icon: 'Monitor'
  },
  {
    id: 'sme_advisors',
    title: 'SME Advisors & Business Consultants',
    group: 'advisory',
    shortDesc: 'Strategic management advisors guiding MSMEs on capital readiness, operations, and scaling.',
    opportunities: ['Equip SME founders with real-time financial dashboards', 'Prepare clients for bank loans and venture investment', 'Strategic advisory retainers'],
    icon: 'TrendingUp'
  },
  {
    id: 'bpo_firms',
    title: 'Outsourcing & BPO Firms',
    group: 'advisory',
    shortDesc: 'Business process outsourcing providers managing back-office operations, inventory, and billing.',
    opportunities: ['Scale offshore back-office bookkeeping teams', 'Centralized multi-tenant client administrative control', 'Predictable monthly high-margin revenues'],
    icon: 'Briefcase'
  },
  {
    id: 'fintech_companies',
    title: 'Financial Technology Companies',
    group: 'technology',
    shortDesc: 'Payment gateways, digital lenders, and neobanks building embedded financial ecosystems.',
    opportunities: ['Integrate payment processing and instant merchant checkout', 'Leverage accounting data for credit assessment', 'Ecosystem co-marketing and reciprocal referrals'],
    icon: 'Coins'
  },
  {
    id: 'training_centres',
    title: 'Business Training Centres',
    group: 'advisory',
    shortDesc: 'Vocational institutes, entrepreneurship academies, and business schools training modern managers.',
    opportunities: ['Incorporate MsmeBooks practical labs into curriculum', 'Certify business students in modern cloud software', 'Institutional referral partner benefits'],
    icon: 'GraduationCap'
  },
  {
    id: 'referral_associates',
    title: 'Business Associates & Referral Partners',
    group: 'advisory',
    shortDesc: 'Professionals and community champions connecting small business owners with better digital tools.',
    opportunities: ['Zero technical implementation required', 'Share custom referral links & track payouts in real-time', 'Earn passive income on every introduced client'],
    icon: 'Share2'
  },
  {
    id: 'erp_consultants',
    title: 'ERP & Software Implementation Consultants',
    group: 'technology',
    shortDesc: 'Specialized enterprise architects migrating medium-sized companies from legacy on-premise systems.',
    opportunities: ['Deliver end-to-end data migration and team training', 'Charge professional consulting fees directly to clients', 'Highest partner tier commissions with dedicated account managers'],
    icon: 'Workflow'
  }
];

export const INITIAL_CERTIFIED_PARTNERS: CertifiedPartner[] = [
  {
    id: 'p-1',
    partnerCode: 'MSME-PT-8421',
    companyName: 'Adeyemi Financial & Tax Advisory',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Lagos State',
    city: 'Lagos (Victoria Island)',
    tier: 'gold',
    category: 'Accountants & Accounting Firms',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 38,
    yearsActive: 6,
    services: ['Cloud Accounting Setup', 'Multi-Store POS Deployment', 'Payroll & Statutory Filing', 'Staff Training'],
    industrySpecialisation: ['Retail & Supermarkets', 'Hospitality', 'Logistics & Distribution'],
    summary: 'Premier accounting and digital transformation consultancy in Lagos. Successfully deployed MsmeBooks across over 70 retail, medical, and wholesale companies in West Africa.',
    contactEmail: 'partnerships@adeyemifinancial.ng',
    contactPhone: '+234 803 456 7890',
    website: 'https://adeyemifinancial.ng',
    certifiedSince: '2023-04-12',
    certifications: [
      {
        title: 'MsmeBooks Certified Implementation Specialist',
        certId: 'CERT-MSME-8421-CIS',
        issueDate: '2024-01-15',
        expiryDate: '2027-01-15'
      },
      {
        title: 'Advanced POS & Inventory Configuration Architect',
        certId: 'CERT-MSME-8421-POS',
        issueDate: '2024-06-20',
        expiryDate: '2027-06-20'
      }
    ]
  },
  {
    id: 'p-2',
    partnerCode: 'MSME-PT-5012',
    companyName: 'Apex Point Technologies Ltd',
    country: 'Kenya',
    countryCode: 'KE',
    state: 'Nairobi County',
    city: 'Nairobi (Westlands)',
    tier: 'platinum',
    category: 'POS Agents & Service Providers',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 64,
    yearsActive: 8,
    services: ['Hardware & POS Bundling', 'Cloud Inventory Integration', 'Custom Barcode Printing', '24/7 SLA Support'],
    industrySpecialisation: ['Pharmacies', 'FMCG Wholesalers', 'Hardware Stores'],
    summary: 'East Africa’s top commercial POS hardware distributor and certified software implementation agency with a dedicated field deployment team across Kenya and Uganda.',
    contactEmail: 'pos@apexpoint-tech.co.ke',
    contactPhone: '+254 711 234 567',
    website: 'https://apexpoint-tech.co.ke',
    certifiedSince: '2022-09-01',
    certifications: [
      {
        title: 'Master Enterprise Implementation Partner',
        certId: 'CERT-MSME-5012-MEP',
        issueDate: '2023-11-10',
        expiryDate: '2026-11-10'
      }
    ]
  },
  {
    id: 'p-3',
    partnerCode: 'MSME-PT-9934',
    companyName: 'Kusi & Partners Business Consult',
    country: 'Ghana',
    countryCode: 'GH',
    state: 'Greater Accra Region',
    city: 'Accra (Airport City)',
    tier: 'silver',
    category: 'SME Advisors & Business Consultants',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 22,
    yearsActive: 4,
    services: ['SME Business Healthchecks', 'Bookkeeping Migration', 'GRA Tax Compliance', 'Financial Modeling'],
    industrySpecialisation: ['Agribusiness', 'Import/Export', 'Professional Services'],
    summary: 'Accra-based advisory helping Ghanaian SMEs transition from manual notebooks and spreadsheets to auditable cloud accounting and point-of-sale systems.',
    contactEmail: 'info@kusiconsult.com.gh',
    contactPhone: '+233 244 890 123',
    website: 'https://kusiconsult.com.gh',
    certifiedSince: '2024-02-18',
    certifications: [
      {
        title: 'MsmeBooks Certified Business Advisor',
        certId: 'CERT-MSME-9934-CBA',
        issueDate: '2024-03-01',
        expiryDate: '2027-03-01'
      }
    ]
  },
  {
    id: 'p-4',
    partnerCode: 'MSME-PT-1108',
    companyName: 'AfriCloud Solutions Rwanda',
    country: 'Rwanda',
    countryCode: 'RW',
    state: 'Kigali City (Nyarugenge / Gasabo / Kicukiro)',
    city: 'Kigali (Nyarugenge)',
    tier: 'gold',
    category: 'ERP & Software Implementation Consultants',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 19,
    yearsActive: 5,
    services: ['Legacy Migration', 'Multi-Warehouse Inventory', 'E-Billing Electronic Invoicing (EBM)', 'Bilingual Training'],
    industrySpecialisation: ['Manufacturing', 'E-Commerce', 'Wholesale Trade'],
    summary: 'Specialized enterprise systems consultancy guiding Rwanda and DRC enterprises into modern paperless accounting with automated tax synchronization.',
    contactEmail: 'support@africloud.rw',
    contactPhone: '+250 788 123 456',
    website: 'https://africloud.rw',
    certifiedSince: '2023-08-14',
    certifications: [
      {
        title: 'MsmeBooks Certified Implementation Specialist',
        certId: 'CERT-MSME-1108-CIS',
        issueDate: '2023-10-05',
        expiryDate: '2026-10-05'
      }
    ]
  },
  {
    id: 'p-5',
    partnerCode: 'MSME-PT-7721',
    companyName: 'Vanguard Digital Solutions SA',
    country: 'South Africa',
    countryCode: 'ZA',
    state: 'Gauteng (Johannesburg / Pretoria)',
    city: 'Johannesburg (Sandton)',
    tier: 'platinum',
    category: 'IT & Technology Companies',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 51,
    yearsActive: 10,
    services: ['ERP Systems Architecture', 'Cloud Migration', 'POS Network Setup', 'Custom API Connectors'],
    industrySpecialisation: ['Automotive Spares', 'Franchise Groups', 'Light Manufacturing'],
    summary: 'Leading Southern African digital transformation practice integrating MsmeBooks into national multi-branch franchise retail and manufacturing clients.',
    contactEmail: 'partners@vanguarddigital.co.za',
    contactPhone: '+27 11 883 4500',
    website: 'https://vanguarddigital.co.za',
    certifiedSince: '2022-04-10',
    certifications: [
      {
        title: 'Master Enterprise Implementation Partner',
        certId: 'CERT-MSME-7721-MEP',
        issueDate: '2023-05-12',
        expiryDate: '2026-05-12'
      }
    ]
  },
  {
    id: 'p-6',
    partnerCode: 'MSME-PT-3329',
    companyName: 'El-Nile Advisory & Bookkeeping',
    country: 'Egypt',
    countryCode: 'EG',
    state: 'Cairo Governorate',
    city: 'Cairo (New Cairo)',
    tier: 'bronze',
    category: 'Professional Bookkeepers',
    isVerified: true,
    rating: 4.7,
    reviewsCount: 14,
    yearsActive: 3,
    services: ['Monthly Bookkeeping', 'Inventory Auditing', 'E-Invoicing Setup', 'Bank Feeds Reconciliation'],
    industrySpecialisation: ['Boutique Retail', 'Clinics & Healthcare', 'Consultancies'],
    summary: 'Bilingual bookkeeping practice in Cairo serving modern startups and independent service companies across North Africa.',
    contactEmail: 'contact@elnileadvisory.com',
    contactPhone: '+20 2 2750 8900',
    website: 'https://elnileadvisory.com',
    certifiedSince: '2024-05-20',
    certifications: [
      {
        title: 'Certified Associate Bookkeeper',
        certId: 'CERT-MSME-3329-CAB',
        issueDate: '2024-06-11',
        expiryDate: '2027-06-11'
      }
    ]
  },
  {
    id: 'p-7',
    partnerCode: 'MSME-PT-4410',
    companyName: 'Meridian Global Cloud Advisory',
    country: 'United Kingdom',
    countryCode: 'GB',
    state: 'Greater London (City & Boroughs)',
    city: 'London (Canary Wharf & Shoreditch)',
    tier: 'platinum',
    category: 'Accountants & Accounting Firms',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 42,
    yearsActive: 9,
    services: ['Cross-Border SME Accounting', 'UK VAT & Statutory Filing', 'Multi-Currency ERP Sync', 'Advisory Retainers'],
    industrySpecialisation: ['Import / Export', 'Diaspora Businesses', 'Fintech Startups'],
    summary: 'London-based chartered practice helping UK and diaspora businesses manage real-time financial reporting and Pan-African trade operations on MsmeBooks.',
    contactEmail: 'uk-partners@meridianadvisory.co.uk',
    contactPhone: '+44 20 7946 0912',
    website: 'https://meridianadvisory.co.uk',
    certifiedSince: '2023-01-18',
    certifications: [
      {
        title: 'Master Enterprise Implementation Partner',
        certId: 'CERT-MSME-4410-MEP',
        issueDate: '2023-03-10',
        expiryDate: '2026-03-10'
      }
    ]
  },
  {
    id: 'p-8',
    partnerCode: 'MSME-PT-6190',
    companyName: 'Silicon Valley Cloud Books & Advisory',
    country: 'United States',
    countryCode: 'US',
    state: 'California (Los Angeles / SF Bay Area / Silicon Valley)',
    city: 'San Francisco & San Jose',
    tier: 'platinum',
    category: 'ERP & Software Implementation Consultants',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 57,
    yearsActive: 8,
    services: ['SaaS Multi-Entity Rollouts', 'API & Webhook Integrations', 'Venture Debt Accounting', 'Automated Reconciliations'],
    industrySpecialisation: ['Technology Startups', 'E-Commerce Portals', 'Cross-Border Supply Chains'],
    summary: 'Top West Coast implementation firm supporting multi-national startups and modern merchants with automated cloud bookkeeping and ERP scale.',
    contactEmail: 'us-partners@svcloudbooks.com',
    contactPhone: '+1 415 555 0198',
    website: 'https://svcloudbooks.com',
    certifiedSince: '2022-11-05',
    certifications: [
      {
        title: 'Master Enterprise Implementation Partner',
        certId: 'CERT-MSME-6190-MEP',
        issueDate: '2023-01-20',
        expiryDate: '2026-01-20'
      }
    ]
  },
  {
    id: 'p-9',
    partnerCode: 'MSME-PT-7703',
    companyName: 'Bharat Cloud Accounting & GST Partners',
    country: 'India',
    countryCode: 'IN',
    state: 'Maharashtra (Mumbai / Pune / Nagpur)',
    city: 'Mumbai (BKC & Andheri)',
    tier: 'platinum',
    category: 'Accountants & Accounting Firms',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 76,
    yearsActive: 11,
    services: ['GST Compliance Automation', 'Multi-Branch Inventory Sync', 'Retail POS Cloud Migration', 'E-Invoicing'],
    industrySpecialisation: ['Textiles & Apparel', 'Pharmaceuticals', 'Retail Chains'],
    summary: 'Premier Indian chartered advisory deploying modern cloud accounting, multi-warehouse stock management, and automated GST billing across India and the diaspora.',
    contactEmail: 'partners@bharatcloudaccounting.in',
    contactPhone: '+91 22 2876 5432',
    website: 'https://bharatcloudaccounting.in',
    certifiedSince: '2022-08-15',
    certifications: [
      {
        title: 'Master Enterprise Implementation Partner',
        certId: 'CERT-MSME-7703-MEP',
        issueDate: '2022-10-10',
        expiryDate: '2025-10-10'
      }
    ]
  },
  {
    id: 'p-10',
    partnerCode: 'MSME-PT-2281',
    companyName: 'Bangalore TechLedger Systems',
    country: 'India',
    countryCode: 'IN',
    state: 'Karnataka (Bengaluru / Mysuru)',
    city: 'Bengaluru (Koramangala & Whitefield)',
    tier: 'gold',
    category: 'IT & Technology Companies',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 45,
    yearsActive: 7,
    services: ['Custom API Connectors', 'POS Terminal Fleet Management', 'Cloud Data Lake Sync', 'Enterprise SLA'],
    industrySpecialisation: ['Quick Service Restaurants', 'Tech Startups', 'Logistics'],
    summary: 'Specialist systems integrator in Bengaluru equipping commercial chains and retail stores with cloud billing and resilient automated ledger synchronization.',
    contactEmail: 'contact@techledger.in',
    contactPhone: '+91 80 4123 9876',
    website: 'https://techledger.in',
    certifiedSince: '2023-05-10',
    certifications: [
      {
        title: 'MsmeBooks Certified Implementation Specialist',
        certId: 'CERT-MSME-2281-CIS',
        issueDate: '2023-06-25',
        expiryDate: '2026-06-25'
      }
    ]
  },
  {
    id: 'p-11',
    partnerCode: 'MSME-PT-8890',
    companyName: 'Al-Khaleej Digital Business Hub',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    state: 'Emirate of Dubai (DIFC / Business Bay / JLT)',
    city: 'Dubai (Business Bay & Downtown)',
    tier: 'platinum',
    category: 'IT & Technology Companies',
    isVerified: true,
    rating: 5.0,
    reviewsCount: 68,
    yearsActive: 9,
    services: ['UAE Corporate Tax & VAT Setup', 'ERP Retail Cloud Integration', 'Dual-Language Billing (AR/EN)', 'Freezone Accounting'],
    industrySpecialisation: ['Trading & Freezone Entities', 'Hospitality Groups', 'Luxury Retail'],
    summary: 'Leading Dubai digital consultancy enabling UAE businesses to execute flawless corporate tax accounting and multi-channel POS operations on MsmeBooks.',
    contactEmail: 'consulting@alkhaleejdigital.ae',
    contactPhone: '+971 4 389 4200',
    website: 'https://alkhaleejdigital.ae',
    certifiedSince: '2022-12-01',
    certifications: [
      {
        title: 'Master Enterprise Implementation Partner',
        certId: 'CERT-MSME-8890-MEP',
        issueDate: '2023-02-14',
        expiryDate: '2026-02-14'
      }
    ]
  },
  {
    id: 'p-12',
    partnerCode: 'MSME-PT-5544',
    companyName: 'Maple Leaf Advisory & FinTech',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Ontario (Toronto / Ottawa / Mississauga)',
    city: 'Toronto (Financial District)',
    tier: 'silver',
    category: 'SME Advisors & Business Consultants',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 21,
    yearsActive: 5,
    services: ['HST/GST Tax Automations', 'Payroll Reconciliation', 'SME Growth Modeling', 'Cloud Migration'],
    industrySpecialisation: ['Professional Practices', 'Immigrant-Owned Businesses', 'Design Studios'],
    summary: 'Toronto business consultancy helping Canadian MSMEs simplify operations with modern cloud bookkeeping and automated transaction audits.',
    contactEmail: 'toronto@mapleleafadvisory.ca',
    contactPhone: '+1 416 555 0142',
    website: 'https://mapleleafadvisory.ca',
    certifiedSince: '2024-01-10',
    certifications: [
      {
        title: 'MsmeBooks Certified Business Advisor',
        certId: 'CERT-MSME-5544-CBA',
        issueDate: '2024-02-18',
        expiryDate: '2027-02-18'
      }
    ]
  },
  {
    id: 'p-13',
    partnerCode: 'MSME-PT-3109',
    companyName: 'Pacific Rim Cloud Integrations',
    country: 'Australia',
    countryCode: 'AU',
    state: 'New South Wales (Sydney / Newcastle / Wollongong)',
    city: 'Sydney (Surry Hills & CBD)',
    tier: 'gold',
    category: 'ERP & Software Implementation Consultants',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 34,
    yearsActive: 7,
    services: ['ATO BAS Tax Setup', 'Cloud Inventory Deployment', 'Hospitality POS Integration', 'API Workflows'],
    industrySpecialisation: ['Cafes & Restaurants', 'Specialty Retail', 'Logistics'],
    summary: 'Sydney-based cloud systems architecture practice helping Australian retail and service businesses scale seamlessly on MsmeBooks.',
    contactEmail: 'sydney@pacificrimcloud.com.au',
    contactPhone: '+61 2 8901 2345',
    website: 'https://pacificrimcloud.com.au',
    certifiedSince: '2023-07-22',
    certifications: [
      {
        title: 'MsmeBooks Certified Implementation Specialist',
        certId: 'CERT-MSME-3109-CIS',
        issueDate: '2023-09-01',
        expiryDate: '2026-09-01'
      }
    ]
  },
  {
    id: 'p-14',
    partnerCode: 'MSME-PT-1492',
    companyName: 'Rivers Digital Bookkeeping Hub',
    country: 'Nigeria',
    countryCode: 'NG',
    state: 'Rivers State (Port Harcourt)',
    city: 'Port Harcourt (GRA Phase 2)',
    tier: 'silver',
    category: 'Professional Bookkeepers',
    isVerified: true,
    rating: 4.7,
    reviewsCount: 19,
    yearsActive: 4,
    services: ['Oilfield Vendor Bookkeeping', 'WHT & VAT Automation', 'Inventory Counting', 'Staff Training'],
    industrySpecialisation: ['Oil & Gas Services', 'Marine Logistics', 'Engineering Firms'],
    summary: 'Specialized corporate bookkeeping and compliance firm in Port Harcourt managing complex vendor billing and inventory records on MsmeBooks.',
    contactEmail: 'portharcourt@riversdigital.ng',
    contactPhone: '+234 84 555 1234',
    website: 'https://riversdigital.ng',
    certifiedSince: '2024-03-15',
    certifications: [
      {
        title: 'Certified Associate Bookkeeper',
        certId: 'CERT-MSME-1492-CAB',
        issueDate: '2024-04-01',
        expiryDate: '2027-04-01'
      }
    ]
  },
  {
    id: 'p-15',
    partnerCode: 'MSME-PT-6720',
    companyName: 'Coastline POS & Inventory Solutions',
    country: 'Kenya',
    countryCode: 'KE',
    state: 'Mombasa County',
    city: 'Mombasa (Nyali)',
    tier: 'gold',
    category: 'POS Agents & Service Providers',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 26,
    yearsActive: 6,
    services: ['Coastal Resort POS Setup', 'Multi-Currency Guest Billing', 'Thermal Receipt Hardware', 'Off-Grid Sync'],
    industrySpecialisation: ['Hotels & Beach Resorts', 'Diving Centres', 'Curio & Gift Retail'],
    summary: 'Mombasa-based hospitality POS specialists equipping coast hotels, restaurants, and retail outlets with robust cloud accounting and point-of-sale systems.',
    contactEmail: 'mombasa@coastlinepos.co.ke',
    contactPhone: '+254 41 234 9876',
    website: 'https://coastlinepos.co.ke',
    certifiedSince: '2023-09-10',
    certifications: [
      {
        title: 'Advanced POS & Inventory Configuration Architect',
        certId: 'CERT-MSME-6720-POS',
        issueDate: '2023-11-05',
        expiryDate: '2026-11-05'
      }
    ]
  },
  {
    id: 'p-16',
    partnerCode: 'MSME-PT-8231',
    companyName: 'Cape Town FinTech Advisory',
    country: 'South Africa',
    countryCode: 'ZA',
    state: 'Western Cape (Cape Town / Stellenbosch)',
    city: 'Cape Town (Foreshore & Century City)',
    tier: 'gold',
    category: 'Accountants & Accounting Firms',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 33,
    yearsActive: 7,
    services: ['SARS Tax Compliance', 'Wine Estate Inventory Tracking', 'Cloud POS & ERP Integration', 'Export Invoicing'],
    industrySpecialisation: ['Viticulture & Wine Estates', 'Tourism & Hospitality', 'Creative Agencies'],
    summary: 'Chartered practice in the Western Cape delivering integrated cloud accounting, inventory batch tracking, and SARS compliance for agricultural and retail enterprises.',
    contactEmail: 'capetown@ctfintech.co.za',
    contactPhone: '+27 21 400 9876',
    website: 'https://ctfintech.co.za',
    certifiedSince: '2023-03-14',
    certifications: [
      {
        title: 'MsmeBooks Certified Implementation Specialist',
        certId: 'CERT-MSME-8231-CIS',
        issueDate: '2023-04-20',
        expiryDate: '2026-04-20'
      }
    ]
  }
];

export const COMPARISON_CRITERIA = [
  {
    category: 'Partner Scale & Progression Requirements',
    criteria: [
      { 
        label: 'Client Portfolio Threshold (To Move to Next Level)', 
        bronze: '1–15 Active Clients', 
        silver: '16–50 Active Clients', 
        gold: '51–150 Active Clients', 
        platinum: '151+ Enterprise Clients' 
      },
      { 
        label: 'Accreditation & Professional Certifications', 
        bronze: 'Certified Associate Bookkeeper (CAB)', 
        silver: 'Certified Business Advisor (CBA)', 
        gold: 'Certified Implementation Specialist (CIS) & POS Architect', 
        platinum: 'Master Enterprise Implementation Partner (MEP) & Board Fellow' 
      },
      { 
        label: 'Minimum Staff Requirement', 
        bronze: '1 Solo Practitioner / Consultant', 
        silver: '2–3 Dedicated Implementation Staff', 
        gold: '4–7 Certified Accounting & Tech Consultants', 
        platinum: '8+ Multi-Disciplinary Enterprise Team' 
      }
    ]
  },
  {
    category: 'Commission & Earnings',
    criteria: [
      { label: 'Recurring Subscription Commission', bronze: '15%', silver: '20%', gold: '30%', platinum: '40%' },
      { label: 'Independent Implementation & Training Fees', bronze: '100% Retained', silver: '100% Retained', gold: '100% Retained', platinum: '100% Retained' },
      { label: 'Monthly Commission Payout Frequency', bronze: 'Standard (30 days)', silver: 'Bi-Weekly', gold: 'Bi-Weekly Priority', platinum: 'Weekly / Custom' },
      { label: 'Commission Tracking Dashboard', bronze: 'Included', silver: 'Included', gold: 'Advanced Analytics', platinum: 'Enterprise BI Export' }
    ]
  },
  {
    category: 'Badges & Credentials',
    criteria: [
      { label: 'Official Metallic Membership Badge', bronze: 'Bronze Badge', silver: 'Silver Badge', gold: 'Gold Badge', platinum: 'Platinum Badge' },
      { label: 'Downloadable Vector Badge Files (SVG/PNG)', bronze: 'Yes', silver: 'Yes', gold: 'Yes (High-Res)', platinum: 'Yes (Master Kit)' },
      { label: 'Public Partner Verification Profile & QR Code', bronze: 'Yes', silver: 'Yes', gold: 'Verified Gold Crest', platinum: 'Verified Platinum Crest' },
      { label: 'Website Embed Badge Code Snippet', bronze: 'Yes', silver: 'Yes', gold: 'Yes', platinum: 'Yes' }
    ]
  },
  {
    category: 'Enablement & Growth',
    criteria: [
      { label: 'Training Academy & Official Certification', bronze: 'Self-Paced Core', silver: 'Core + POS Specialisation', gold: 'Full Certification Academy', platinum: 'Executive Masterclasses' },
      { label: 'Public Partner Directory Listing', bronze: 'Standard Listing', silver: 'Enhanced Profile', gold: 'Featured Search Placement', platinum: 'Top Tier Global Spotlight' },
      { label: 'Marketing Collateral & Co-Branding Kits', bronze: 'Digital Brochures', silver: 'Brochures + Social Kits', gold: 'Co-Branded Assets + Demos', platinum: 'Joint Co-Marketing Budget' },
      { label: 'Direct Qualified Lead Routing from MsmeBooks', bronze: 'Subject to Terms', silver: 'Periodic Inbound', gold: 'Priority Geo-Routing', platinum: 'Guaranteed Lead Pipeline' },
      { label: 'Dedicated Partner Success Manager', bronze: 'Email Support', silver: 'Slack / Teams Channel', gold: 'Dedicated Success Lead', platinum: 'Executive Sponsor & Direct WhatsApp' },
      { label: 'Free Demo & Test NFR Software Environment', bronze: '1 Sandbox Account', silver: '3 Sandbox Accounts', gold: 'Unlimited Demo Accounts', platinum: 'Dedicated Multi-Tenant Staging' }
    ]
  }
];

export const FAQ_ITEMS = [
  {
    q: 'Who can become a MsmeBooks partner?',
    a: 'Any qualified accounting firm, chartered accountant, independent bookkeeper, tax consultant, POS hardware vendor, IT services firm, software reseller, business consultant, or enterprise implementation specialist across Africa and globally can apply to join the MsmeBooks Partner Ecosystem.'
  },
  {
    q: 'Is partner registration free?',
    a: 'Yes, initial registration and onboarding to the MsmeBooks Partner Programme are completely free. We invest in our partners with complimentary enablement training, marketing assets, and a fully functional partner dashboard.'
  },
  {
    q: 'How do I earn recurring commissions?',
    a: 'You earn your tier percentage (from 15% up to 40%) every single time an introduced customer pays or renews their MsmeBooks subscription for as long as their account remains active and in good standing.'
  },
  {
    q: 'What are the four membership levels?',
    a: 'The four official membership tiers are: Bronze Partner (15% recurring commission), Silver Partner (20%), Gold Partner (30%), and Platinum Partner (40%). Each level comes with its distinctive metallic official badge, elevated visibility, and deeper enablement benefits.'
  },
  {
    q: 'How is my partner tier determined?',
    a: 'Your starting tier is evaluated during your application review based on your existing client base, team certifications, and business model. As you onboard and retain active subscriptions, you automatically qualify for upgrades to Silver, Gold, and Platinum status.'
  },
  {
    q: 'When are commissions paid?',
    a: 'Approved commissions are calculated at the end of each billing cycle and disbursed directly to your bank account, mobile money wallet, or via international wire transfer in your preferred currency (USD, NGN, KES, GHS, ZAR, etc.) on our bi-weekly or monthly disbursement schedules.'
  },
  {
    q: 'Can I refer customers outside my country?',
    a: 'Yes. MsmeBooks is a cloud-native platform serving businesses across all 54 African countries and internationally. You can refer and implement customers across borders and manage them through your central partner console.'
  },
  {
    q: 'How do I obtain my official partner badge?',
    a: 'Upon review and tier approval, your official partner badge is immediately generated and made available inside your Partner Portal. You can download vector SVGs and transparent PNGs for your website, email signature, proposals, and social profiles.'
  },
  {
    q: 'Can I display my badge on my website?',
    a: 'Absolutely! Verified partners receive a one-click embed code snippet and SVG assets to proudly showcase their official MsmeBooks partnership badge on their website, proposals, and promotional banners.'
  },
  {
    q: 'How do customers verify my partner status?',
    a: 'Every approved partner has a unique Partner ID (e.g. MSME-PT-8421). Prospective customers can look up this ID on our public verification portal to confirm active status, tier level, service specialisations, and certified credentials.'
  },
  {
    q: 'Can I become a certified implementation partner?',
    a: 'Yes. Through the MsmeBooks Training Academy, your team can complete structured coursework and practical exams to earn the "MsmeBooks Certified Implementation Specialist" (CIS) accreditation.'
  },
  {
    q: 'What happens when a customer cancels?',
    a: 'Commissions are paid on active qualifying subscription payments. If a customer cancels or receives a refund, commissions for future unpaid cycles cease or adjustments are reflected transparently in your earnings dashboard per the Partner Agreement.'
  },
  {
    q: 'Can partners offer independent implementation services?',
    a: 'Yes! Partners retain 100% of the fees they charge clients for hardware sales, onsite POS installation, data migration, staff training, and monthly accounting retainers. Recurring commissions are purely an added software revenue stream.'
  },
  {
    q: 'How do I access partner training?',
    a: 'Once approved, you receive immediate access to the MsmeBooks Partner Academy containing video modules, setup checklists, demo playbooks, and downloadable exam guides.'
  },
  {
    q: 'How do I upgrade my membership level?',
    a: 'As your active portfolio grows (e.g., reaching 51 active clients for Gold, or 151 for Platinum), our Partner Operations team reviews your metrics and issues your upgraded metallic badge, increased commission rates, and priority benefits.'
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    name: 'Adeyemi & Associates',
    founder: 'Folake Adeyemi, FCA',
    type: 'Chartered Accounting Practice',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    tier: 'Gold Partner (30% Commission)',
    results: [
      '+$42,000 Annual Recurring Revenue',
      '74 SME Clients Successfully Migrated',
      '65% Reduction in Client Tax Prep Time'
    ],
    quote: 'MsmeBooks transformed our practice from billing one-off yearly audit fees to building a predictable monthly recurring revenue stream. The official Gold Partner badge immediately established trust with retail chains across Nigeria.',
    imageType: 'accountant',
    imageUrl: '/src/assets/images/nigeria_partner_story_1794143923812.jpg'
  },
  {
    name: 'Apex Point POS Solutions',
    founder: 'David Mwangi',
    type: 'Retail Technology & Hardware Provider',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    tier: 'Platinum Partner (40% Commission)',
    results: [
      '+120 Supermarket & Pharmacy Deployments',
      '40% Ongoing Software Commission',
      'Zero Server Downtime for Clients'
    ],
    quote: 'Pairing our touch POS terminals with MsmeBooks cloud inventory created the most competitive retail package in East Africa. The recurring software commissions now exceed our hardware margins.',
    imageType: 'retail_tech',
    imageUrl: '/src/assets/images/kenya_partner_story_1794143936293.jpg'
  },
  {
    name: 'Teranga Digital Compta',
    founder: 'Amadou Diop, Expert-Comptable',
    type: 'OHADA Accounting & E-Tax Advisory',
    location: 'Dakar (Plateau & Almadies), Senegal',
    country: 'Senegal',
    countryFlag: '🇸🇳',
    tier: 'Gold Partner (30% Commission)',
    results: [
      '+$38,500 Annual Software Revenue Share',
      '58 Francophone SMEs Onboarded',
      '100% DGID Automated E-Tax Returns'
    ],
    quote: 'Deploying MsmeBooks in Dakar enabled us to automate OHADA financial reports and electronic tax filings for French-speaking companies across West Africa. The seamless French localization and local bank feeds are second to none.',
    imageType: 'accountant',
    imageUrl: '/src/assets/images/senegal_partner_story_1794143949864.jpg'
  },
  {
    name: 'Ivoire Retail & Cloud Systems',
    founder: 'Aïssatou Koné',
    type: 'POS Hardware & Multi-Store Cloud ERP',
    location: 'Abidjan (Cocody & Plateau), Côte d’Ivoire',
    country: 'Côte d’Ivoire',
    countryFlag: '🇨🇮',
    tier: 'Platinum Partner (40% Commission)',
    results: [
      '85 Supermarket & Pharmacy Deployments',
      'Wave & Orange Money Mobile Checkout',
      '+$64,000 Cumulative Software Earnings'
    ],
    quote: 'Integrating touch-screen POS hardware with MsmeBooks cloud inventory and local mobile money in Abidjan has been transformative. Our clients experience zero downtime even during internet dropouts.',
    imageType: 'retail_tech',
    imageUrl: '/src/assets/images/ivorycoast_partner_story_1794143963639.jpg'
  },
  {
    name: 'Kazinga Advisory & POS Solutions',
    founder: 'Brian Mukasa, CPA (U)',
    type: 'Corporate Tax & SME Implementation',
    location: 'Kampala (Kololo & Nakasero), Uganda',
    country: 'Uganda',
    countryFlag: '🇺🇬',
    tier: 'Silver Partner (20% Commission)',
    results: [
      '36 SME Accounts Managed on Cloud',
      '100% URA EFRIS E-Invoicing Compliant',
      '70% Faster Month-End Reconciliations'
    ],
    quote: 'MsmeBooks bridges daily supermarket and clinic operations directly into Uganda Revenue Authority EFRIS electronic tax invoicing. Our advisory practice now earns recurring monthly income alongside retainer fees.',
    imageType: 'accountant',
    imageUrl: '/src/assets/images/uganda_partner_story_1794143977854.jpg'
  },
  {
    name: 'Kilimanjaro Cloud Partners',
    founder: 'Neema Lyimo',
    type: 'Tourism & Wholesale Distribution Systems',
    location: 'Dar es Salaam & Arusha, Tanzania',
    country: 'Tanzania',
    countryFlag: '🇹🇿',
    tier: 'Gold Partner (30% Commission)',
    results: [
      '46 Safari Lodges & Retail Chains Synced',
      'TRA VFD E-Fiscal Tax Sync',
      '+$29,000 First-Year Software Share'
    ],
    quote: 'Equipping safari tour operators and retail chains with real-time multi-currency accounting in USD and Tanzanian Shillings transformed our agency into the premier technology consultancy in the region.',
    imageType: 'retail_tech',
    imageUrl: '/src/assets/images/tanzania_partner_story_1794143995684.jpg'
  }
];

export const TRAINING_MODULES = [
  {
    id: 'mod-1',
    code: 'MB-101',
    title: 'MsmeBooks Architecture & Navigation',
    duration: '2.5 Hours',
    lessons: 6,
    topics: ['Company workspace setup', 'Multi-currency configuration', 'Chart of accounts customization', 'Role-based access permissions']
  },
  {
    id: 'mod-2',
    code: 'MB-201',
    title: 'Point of Sale (POS) Hardware & Offline Sync',
    duration: '3.0 Hours',
    lessons: 8,
    topics: ['Barcode scanner & thermal printer pairing', 'Cash drawer triggers', 'Offline sales buffering', 'End-of-day Z-report reconciliation']
  },
  {
    id: 'mod-3',
    code: 'MB-301',
    title: 'Multi-Warehouse Inventory & Cost of Goods',
    duration: '3.5 Hours',
    lessons: 7,
    topics: ['Batch & expiry date tracking', 'Stock transfer protocols', 'FIFO / Weighted Average valuation', 'Automated low-stock reorder triggers']
  },
  {
    id: 'mod-4',
    code: 'MB-401',
    title: 'Accounting, Bank Reconciliations & Tax Filing',
    duration: '4.0 Hours',
    lessons: 9,
    topics: ['Automated bank feeds integration', 'VAT & WHT statutory schedules', 'P&L, Balance Sheet & Cash Flow generation', 'Year-end ledger closings']
  },
  {
    id: 'mod-5',
    code: 'MB-501',
    title: 'Client Data Migration from Legacy ERPs',
    duration: '3.0 Hours',
    lessons: 6,
    topics: ['Excel & CSV bulk import mapping', 'Opening balance verification', 'Customer & vendor ledger imports', 'Historical reconciliation audits']
  },
  {
    id: 'mod-6',
    code: 'MB-601',
    title: 'Partner Sales Enablement & Demo Mastery',
    duration: '2.0 Hours',
    lessons: 5,
    topics: ['15-minute high-converting client demo playbook', 'Objection handling for traditional business owners', 'Structuring your setup & training fees', 'Co-marketing strategies']
  }
];
