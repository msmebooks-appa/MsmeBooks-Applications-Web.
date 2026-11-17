import {
  CategoryItem,
  CommissionTierItem,
  ComparisonRow,
  TimelineStep,
  BenefitCard,
  EventItem,
  VideoItem,
  Testimonial,
  CaseStudy,
  FaqItem,
  DashboardClientRecord
} from '../types';

import imgTeam from '../assets/images/african_business_team_1789327088093.jpg';
import imgConference from '../assets/images/african_partner_conference_1789327101417.jpg';
import imgWorkshop from '../assets/images/african_workshop_training_1789327116469.jpg';
import imgConsultant from '../assets/images/african_consultant_partner_1789327129833.jpg';

export const ASSET_IMAGES = {
  team: imgTeam,
  conference: imgConference,
  workshop: imgWorkshop,
  consultant: imgConsultant,
};

export const PARTNER_CATEGORIES: CategoryItem[] = [
  {
    id: 'bookkeepers',
    emoji: '🧾',
    title: 'Bookkeepers',
    shortDesc: 'Help clients digitize bookkeeping, invoicing, expenses, reporting and financial records.',
    fullDesc: 'Empower small shops, service providers, and local trades with automated receipt scanning, bank reconciliation, and real-time expense tracking without messy paper ledgers.',
    categoryGroup: 'Finance & Tax',
    clientBenefits: [
      'Eliminate shoeboxes of physical paper receipts',
      'Automated daily bank feed reconciliations',
      'Instant profit & loss and cash flow statements'
    ],
    partnerRevenueModel: 'Monthly recurring commission per SME ledger + billable bookkeeping setup fee',
    recommendedFor: 'Independent bookkeepers, freelance financial assistants, and bookkeeping studios'
  },
  {
    id: 'accountants',
    emoji: '📊',
    title: 'Accountants & Accounting Firms',
    shortDesc: 'Deliver modern accounting services while managing multiple SME clients through powerful digital tools.',
    fullDesc: 'Manage tens or hundreds of SME client accounts from one unified multi-tenant console, with consolidated audit trails, management accounts, and automated ledger entries.',
    categoryGroup: 'Finance & Tax',
    clientBenefits: [
      'Multi-entity & multi-currency reporting across African markets',
      'Instant access to real-time client transactional journals',
      'Clean year-end financial statement generation'
    ],
    partnerRevenueModel: '30%–40% tier commission + recurring advisory retainer services',
    recommendedFor: 'Chartered accountants (ICAN, ACCA, CPA Kenya), audit partners, and modern accounting practices'
  },
  {
    id: 'tax-consultants',
    emoji: '🧮',
    title: 'Tax Consultants',
    shortDesc: 'Help businesses organize financial records, prepare for tax obligations and improve compliance workflows.',
    fullDesc: 'Ensure your SME clients stay compliant with local revenue authorities (FIRS, KRA, GRA, SARS) with pre-formatted VAT schedules, WHT deductions, and audit-ready tax ledgers.',
    categoryGroup: 'Finance & Tax',
    clientBenefits: [
      'Automated VAT, PAYE, and withholding tax calculation',
      'Zero penalty risk through prompt statutory tax schedules',
      'Exportable tax clearance documentation'
    ],
    partnerRevenueModel: 'Recurring software commission + tax filing and compliance consultancy retainers',
    recommendedFor: 'Tax advisors, legal-tax practices, and corporate filing specialists'
  },
  {
    id: 'pos-agents',
    emoji: '💳',
    title: 'POS Agents & Merchant Aggregators',
    shortDesc: 'Offer additional business technology services to merchants and generate recurring partner income.',
    fullDesc: 'Upgrade your terminal merchants from standalone payment collection to complete inventory tracking, digital receipting, and end-of-day sales settlements.',
    categoryGroup: 'Channels & Education',
    clientBenefits: [
      'Synchronize POS card/cash transactions directly with inventory',
      'Avoid cash leakage and inventory theft in stores',
      'Accept multiple African payment rails: Mobile Money, USSD, Cards, Transfers'
    ],
    partnerRevenueModel: 'Hardware bundle margin + continuous SaaS subscription revenue per active terminal',
    recommendedFor: 'Agency banking operators, merchant aggregators, and commercial payment sales reps'
  },
  {
    id: 'tech-companies',
    emoji: '💻',
    title: 'Technology & IT Companies',
    shortDesc: 'Add business management software to your technology portfolio and create new recurring revenue opportunities.',
    fullDesc: 'Broaden your client offering beyond hardware and networking into mission-critical SaaS, integrating MsmeBooks via REST APIs into client hardware and e-commerce stores.',
    categoryGroup: 'Technology & IT',
    clientBenefits: [
      'Enterprise-grade cloud infrastructure tailored for African bandwidth',
      'Secure multi-user permissions and role-based access control',
      'Fast offline-first sync capability for erratic network conditions'
    ],
    partnerRevenueModel: 'SaaS licensing margin + custom API integration and support fees',
    recommendedFor: 'IT service providers, software houses, system integrators, and web agencies'
  },
  {
    id: 'audit-firms',
    emoji: '🔍',
    title: 'Audit Firms',
    shortDesc: 'Support clients with organized financial information, reporting and digital business records.',
    fullDesc: 'Speed up assurance engagements with complete system-generated audit logs, unalterable transaction timestamps, and organized supporting document attachments.',
    categoryGroup: 'Finance & Tax',
    clientBenefits: [
      'Immutable transaction histories and user activity audit trails',
      'Centralized repository for digital invoices, purchase orders, and receipts',
      'Drastically reduced audit cycle time and sample review headaches'
    ],
    partnerRevenueModel: 'Institutional partner commission + high-tier enterprise compliance engagements',
    recommendedFor: 'Statutory audit firms, internal audit consultancies, and forensic accountants'
  },
  {
    id: 'sme-advisors',
    emoji: '👔',
    title: 'SME Advisors & Business Consultants',
    shortDesc: 'Help entrepreneurs make better decisions using reliable business and financial information.',
    fullDesc: 'Replace guesswork with real-time gross margin analytics, customer acquisition metrics, and runway forecasts when advising founders on expansion and capital raising.',
    categoryGroup: 'Advisory & Strategy',
    clientBenefits: [
      'Executive dashboards showing revenue velocity and inventory turnover',
      'Bank-ready and investor-ready financial performance packs',
      'Benchmarking against peer industry performance'
    ],
    partnerRevenueModel: 'Advisory retainer acceleration + ongoing platform recurring revenue share',
    recommendedFor: 'Management consultants, fractional CFOs, incubator mentors, and growth advisors'
  },
  {
    id: 'outsourcing-firms',
    emoji: '🏢',
    title: 'Outsourcing Firms (BPO)',
    shortDesc: 'Deliver bookkeeping, accounting, payroll, reporting and business administration services at scale.',
    fullDesc: 'Operate shared-services centers for multiple overseas or regional SMEs with batch invoicing, payroll automation, and customizable client access tiers.',
    categoryGroup: 'Finance & Tax',
    clientBenefits: [
      'Standardized operating workflows across 50+ clients simultaneously',
      'Full payroll run calculation with statutory African pension and health remittances',
      'Strict client data segregation and bank-grade data encryption'
    ],
    partnerRevenueModel: 'High-volume Platinum partner commission tier (up to 40%) + BPO service billing',
    recommendedFor: 'Business process outsourcing providers, shared finance teams, and virtual office managers'
  },
  {
    id: 'business-associates',
    emoji: '🤝',
    title: 'Business Associates & Connectors',
    shortDesc: 'Expand your professional service offering by introducing MsmeBooks to your business network.',
    fullDesc: 'Monetize your trusted relationships across trade chambers, business associations, alumni networks, and co-working hubs with warm client referrals.',
    categoryGroup: 'Channels & Education',
    clientBenefits: [
      'Preferred onboarding concierge for referred businesses',
      'Access to partner-exclusive promotional discount bundles',
      'Dedicated bilingual local support for their business operations'
    ],
    partnerRevenueModel: 'Direct referral commission with real-time payout tracking on every renewed plan',
    recommendedFor: 'Industry connectors, trade association executives, and independent consultants'
  },
  {
    id: 'software-distributors',
    emoji: '🛒',
    title: 'Software Distributors & Resellers',
    shortDesc: 'Sell and deploy MsmeBooks solutions while building a recurring software revenue stream.',
    fullDesc: 'Add a high-conversion, locally compliant African financial SaaS product to your existing distribution catalog with co-branded collateral and sales incentives.',
    categoryGroup: 'Technology & IT',
    clientBenefits: [
      'Localized product with African tax rates, currencies, and invoice templates',
      'Affordable local pricing in local currencies (no dollar conversion spikes)',
      'High client retention rate resulting in reliable long-term software tenure'
    ],
    partnerRevenueModel: 'Tiered wholesale margins, bulk activation discounts, and co-op marketing funds',
    recommendedFor: 'Value-added resellers (VARs), corporate software distributors, and IT vendor reps'
  },
  {
    id: 'computer-shops',
    emoji: '🖥️',
    title: 'Computer Shops & Hardware Vendors',
    shortDesc: 'Turn every business technology customer into a potential software customer.',
    fullDesc: 'When an entrepreneur buys a laptop, desktop, barcode scanner, or thermal receipt printer, pre-install or bundle MsmeBooks to generate ongoing monthly income long after the hardware sale.',
    categoryGroup: 'Technology & IT',
    clientBenefits: [
      'Pre-configured out-of-the-box business accounting setup',
      'Plug-and-play compatibility with ESC/POS receipt printers and handheld scanners',
      'No technical maintenance required—cloud hosted and automatically updated'
    ],
    partnerRevenueModel: 'Hardware bundle uplift + recurring monthly software commission per customer device',
    recommendedFor: 'Electronics retailers, computer retail shops, POS hardware vendors, and IT repairs'
  },
  {
    id: 'fintech-companies',
    emoji: '💰',
    title: 'Fintech Companies & Digital Banks',
    shortDesc: 'Integrate or partner with MsmeBooks to deliver broader financial and business technology solutions.',
    fullDesc: 'Combine business banking accounts and digital credit underwriting with verified accounting data, creating powerful synergies for MSME lending and treasury operations.',
    categoryGroup: 'Technology & IT',
    clientBenefits: [
      'Instant access to SME credit based on verified accounting cash-flow history',
      'One-click bank statement ingestion and automatic transaction tagging',
      'Embedded payouts, vendor transfers, and automated payroll disbursements'
    ],
    partnerRevenueModel: 'Strategic API partnership, revenue share on transactional volume, and ecosystem co-branding',
    recommendedFor: 'Neobanks, merchant acquiring fintechs, microfinance institutions, and credit scoring platforms'
  },
  {
    id: 'training-centers',
    emoji: '🎓',
    title: 'Business Training Centers & Hubs',
    shortDesc: 'Teach entrepreneurs modern digital business management while introducing them to practical business software.',
    fullDesc: 'Incorporate practical, real-world African accounting and inventory labs into your SME bootcamps, entrepreneurship accelerators, and vocational training curricula.',
    categoryGroup: 'Channels & Education',
    clientBenefits: [
      'Graduates gain immediately applicable practical digital management skills',
      'Free sandbox environment for students and business trainees during courses',
      'Special student-to-business discount voucher codes'
    ],
    partnerRevenueModel: 'Institutional curriculum partnership grant + lifetime recurring commission on trainee conversions',
    recommendedFor: 'Entrepreneurship incubation hubs, enterprise development centers, business schools, and chambers of commerce'
  }
];

export const COMMISSION_TIERS: CommissionTierItem[] = [
  {
    id: 'bronze',
    badge: '🥉 BRONZE PARTNER',
    name: 'Bronze Partner',
    percentage: 15,
    percentageLabel: '15% Recurring Commission',
    badgeIcon: 'Award',
    forWhom: 'For new partners getting started with MsmeBooks.',
    description: 'The ideal entry path for independent bookkeepers, computer shops, and new business associates entering the partner program.',
    features: [
      'Partner onboarding & setup call',
      'Standard sales resources & digital brochures',
      'Product training & feature walkthroughs',
      'Standard partner support desk',
      '15% ongoing recurring commission on all active subscribers'
    ],
    ctaText: 'Start as Bronze',
    accentGradient: 'from-amber-700/20 via-orange-600/10 to-transparent',
    textColor: 'text-amber-800'
  },
  {
    id: 'silver',
    badge: '🥈 SILVER PARTNER',
    name: 'Silver Partner',
    percentage: 20,
    percentageLabel: '20% Recurring Commission',
    badgeIcon: 'ShieldCheck',
    forWhom: 'For active partners growing their customer portfolio.',
    description: 'Designed for established accounting consultants, IT firms, and POS agents managing an expanding roster of MSME businesses.',
    features: [
      'Everything included in Bronze tier',
      'Advanced partner resources & pitch decks',
      'Dedicated marketing support & co-branded assets',
      'Client growth tools & health diagnostic checklist',
      '20% ongoing recurring commission on all active subscribers'
    ],
    ctaText: 'Become Silver',
    accentGradient: 'from-slate-400/20 via-slate-300/10 to-transparent',
    textColor: 'text-slate-700'
  },
  {
    id: 'partner',
    badge: '🥇 PARTNER',
    name: 'Partner',
    percentage: 30,
    percentageLabel: '30% Recurring Commission',
    badgeIcon: 'Sparkles',
    forWhom: 'For established partners actively building the MsmeBooks customer ecosystem.',
    description: 'For growing accounting practices, software resellers, and enterprise consultants driving continuous MSME adoption.',
    features: [
      'Everything included in Silver tier',
      'Priority partner support via dedicated WhatsApp & phone channel',
      'Dedicated growth resources & revenue accelerator workshops',
      'Enhanced marketing opportunities & regional directory listing',
      '30% ongoing recurring commission on all active subscribers'
    ],
    ctaText: 'Become a Partner',
    accentGradient: 'from-blue-600/20 via-sky-500/10 to-transparent',
    textColor: 'text-blue-700'
  },
  {
    id: 'platinum',
    badge: '💎 PLATINUM PARTNER',
    name: 'Platinum Partner',
    percentage: 40,
    percentageLabel: '40% Recurring Commission',
    badgeIcon: 'Crown',
    forWhom: 'For high-performing strategic partners, BPOs and enterprise organizations.',
    description: 'The pinnacle of the MsmeBooks partner ecosystem for regional distributors, large audit firms, financial aggregators, and fintechs.',
    features: [
      'Everything included in Partner tier',
      'Premium 24/7 dedicated partner relationship manager',
      'Strategic executive collaboration & quarterly product roadmap input',
      'Co-marketing opportunities, joint press releases & event sponsorships',
      'Priority enterprise lead distribution from MsmeBooks inbound flow',
      'Up to 40% top-tier recurring commission on all active accounts'
    ],
    ctaText: 'Become Platinum',
    isDominant: true,
    accentGradient: 'from-emerald-600/25 via-[#84CC16]/20 to-blue-600/10',
    textColor: 'text-emerald-700'
  }
];

export const COMPARISON_DATA: ComparisonRow[] = [
  {
    benefit: 'Recurring commission rate',
    category: 'Revenue & Earnings',
    bronze: '15% Monthly',
    silver: '20% Monthly',
    partner: '30% Monthly',
    platinum: 'Up to 40% Monthly',
    isKeyHighlight: true
  },
  {
    benefit: 'Partner onboarding & portal access',
    category: 'Enablement',
    bronze: true,
    silver: true,
    partner: true,
    platinum: true
  },
  {
    benefit: 'Product training & certification',
    category: 'Enablement',
    bronze: 'Self-paced Online',
    silver: 'Live Guided Sessions',
    partner: 'Advanced Certification',
    platinum: 'Custom Onsite / Executive',
    isKeyHighlight: true
  },
  {
    benefit: 'Sales resources & pitch decks',
    category: 'Sales & Marketing',
    bronze: 'Standard Toolkit',
    silver: 'Customizable Decks',
    partner: 'Co-branded Materials',
    platinum: 'Bespoke Campaign Kits'
  },
  {
    benefit: 'Marketing support & lead generation',
    category: 'Sales & Marketing',
    bronze: false,
    silver: 'Digital Collateral',
    partner: 'Regional Directory Feature',
    platinum: 'Joint Campaigns & Lead Flow',
    isKeyHighlight: true
  },
  {
    benefit: 'Client management tools (Multi-tenant console)',
    category: 'Technology',
    bronze: 'Basic Overview',
    silver: 'Full Client Switcher',
    partner: 'Multi-Firm Console & Bulk Tasks',
    platinum: 'API Integrations & Custom Roles',
    isKeyHighlight: true
  },
  {
    benefit: 'Partner support SLA',
    category: 'Support',
    bronze: 'Email (48h SLA)',
    silver: 'Priority Desk (24h SLA)',
    partner: 'Direct WhatsApp (4h SLA)',
    platinum: 'Dedicated Account Manager (Instant)'
  },
  {
    benefit: 'Growth resources & quarterly reviews',
    category: 'Enablement',
    bronze: false,
    silver: false,
    partner: true,
    platinum: true
  },
  {
    benefit: 'Strategic opportunities & roadmap access',
    category: 'Strategy',
    bronze: false,
    silver: false,
    partner: 'Quarterly Townhall',
    platinum: 'Executive Advisory Board',
    isKeyHighlight: true
  },
  {
    benefit: 'Co-marketing & event sponsorship funds',
    category: 'Sales & Marketing',
    bronze: false,
    silver: false,
    partner: 'Partial Event Subsidy',
    platinum: 'Full Co-Op Marketing Budget',
    isKeyHighlight: true
  }
];

export const HOW_IT_WORKS_STEPS: TimelineStep[] = [
  {
    step: '01',
    title: 'JOIN',
    summary: 'Register for the MsmeBooks Partner Program.',
    details: 'Complete our streamlined digital application in 2 minutes. Select your professional category, specify your region, and receive your verified Partner Portal credentials.',
    iconName: 'UserPlus',
    duration: '2 Minutes'
  },
  {
    step: '02',
    title: 'LEARN',
    summary: 'Get trained on MsmeBooks products, solutions and business use cases.',
    details: 'Access high-yield video courses, sales toolkits, interactive software sandboxes, and obtain your official MsmeBooks Certified Advisor credentials.',
    iconName: 'GraduationCap',
    duration: 'Self-Paced'
  },
  {
    step: '03',
    title: 'REFER & DEPLOY',
    summary: 'Introduce MsmeBooks to your customers, clients and business network.',
    details: 'Share your personalized partner link, onboard clients through your multi-tenant portal, or deploy pre-configured instances tailored to their industry.',
    iconName: 'Send',
    duration: 'Immediate'
  },
  {
    step: '04',
    title: 'GROW & EARN',
    summary: 'Build your customer portfolio and earn eligible recurring commissions.',
    details: 'Track conversions in real time. Collect recurring commissions deposited directly into your bank or mobile money account as long as your clients stay active.',
    iconName: 'TrendingUp',
    duration: 'Ongoing Monthly'
  }
];

export const SAMPLE_DASHBOARD_CLIENTS: DashboardClientRecord[] = [
  {
    id: 'CLI-9021',
    name: 'Kafanchan Agro Mills Ltd',
    industry: 'Agribusiness / Processing',
    country: 'Nigeria',
    plan: 'Enterprise Growth',
    monthlyFee: '₦45,000',
    partnerCut: '₦18,000 (40%)',
    status: 'Active',
    joinedDate: '12 May 2026'
  },
  {
    id: 'CLI-8842',
    name: 'Mombasa Logistics & Freight',
    industry: 'Transport & Warehousing',
    country: 'Kenya',
    plan: 'Multi-Branch Pro',
    monthlyFee: 'KSh 7,500',
    partnerCut: 'KSh 3,000 (40%)',
    status: 'Active',
    joinedDate: '28 Apr 2026'
  },
  {
    id: 'CLI-8120',
    name: 'Zuri Pharmaceuticals Chain',
    industry: 'Healthcare Retail',
    country: 'Ghana',
    plan: 'POS & Inventory Pro',
    monthlyFee: 'GH₵ 850',
    partnerCut: 'GH₵ 340 (40%)',
    status: 'Active',
    joinedDate: '15 Mar 2026'
  },
  {
    id: 'CLI-7910',
    name: 'Apex Supermarket & Stores',
    industry: 'FMCG Retail / Supermarket',
    country: 'Nigeria',
    plan: 'POS Multi-Register',
    monthlyFee: '₦55,000',
    partnerCut: '₦22,000 (40%)',
    status: 'Active',
    joinedDate: '04 Feb 2026'
  },
  {
    id: 'CLI-7634',
    name: 'Kilimanjaro Safari Tours',
    industry: 'Hospitality & Tourism',
    country: 'Tanzania',
    plan: 'Multi-Currency Standard',
    monthlyFee: 'TZS 120,000',
    partnerCut: 'TZS 48,000 (40%)',
    status: 'Renewal Due',
    joinedDate: '19 Jan 2026'
  }
];

export const WHY_PARTNER_BENEFITS: BenefitCard[] = [
  {
    id: 'recurring-revenue',
    title: 'Recurring Revenue',
    description: 'Build an ongoing revenue opportunity through eligible customer subscriptions. As long as your clients stay on MsmeBooks, your commissions recur every single month.',
    highlight: 'Up to 40% monthly revenue share',
    iconName: 'Repeat',
    metricLabel: 'Monthly Predictability'
  },
  {
    id: 'african-market',
    title: 'African Market Opportunity',
    description: 'Serve the rapidly digitizing MSME ecosystem across Africa. Over 44 million formal and informal MSMEs are modernizing their accounting, taxation, and payments.',
    highlight: '44M+ MSMEs transitioning to digital',
    iconName: 'Globe2',
    metricLabel: 'Massive TAM'
  },
  {
    id: 'powerful-platform',
    title: 'Powerful Business Platform',
    description: 'Give customers access to modern business management technology: invoicing, inventory, multi-store POS, bank reconciliation, expense audits, and tax compliance.',
    highlight: 'All-in-one African fintech suite',
    iconName: 'Cpu',
    metricLabel: 'Enterprise-grade'
  },
  {
    id: 'multiple-segments',
    title: 'Multiple Customer Segments',
    description: 'Serve retailers, wholesalers, service businesses, hospitality, real estate, professional services, agriculture, and many other MSMEs with specialized modular workflows.',
    highlight: 'Custom industry modules',
    iconName: 'Layers',
    metricLabel: 'Universal Fit'
  },
  {
    id: 'partner-support',
    title: 'Professional Partner Support',
    description: 'Access onboarding, training, marketing materials, sales collateral, technical architects, and dedicated business-development resources to accelerate client closings.',
    highlight: 'Dedicated partner success desk',
    iconName: 'Headphones',
    metricLabel: 'Direct Channel Help'
  },
  {
    id: 'grow-with-customers',
    title: 'Grow With Your Customers',
    description: 'As your customer portfolio grows, your partner opportunity can grow with it. Upgrades to multi-branch tiers, extra users, and POS add-ons automatically increase your monthly payout.',
    highlight: 'Automatic upsell participation',
    iconName: 'TrendingUp',
    metricLabel: 'Expansion Margin'
  }
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'evt-lagos',
    title: 'West Africa MSME Technology & Accounting Summit',
    city: 'Lagos',
    country: 'Nigeria',
    date: 'OCTOBER 14–16, 2026',
    venue: 'Eko Convention Centre, Victoria Island',
    attendees: '1,800+ Accountants & Tech Partners',
    type: 'Partner Summit',
    status: 'Featured',
    image: imgConference
  },
  {
    id: 'evt-nairobi',
    title: 'East Africa Digital Finance & Tax Advisory Expo',
    city: 'Nairobi',
    country: 'Kenya',
    date: 'NOVEMBER 05–07, 2026',
    venue: 'Sarit Expo Centre, Westlands',
    attendees: '1,200+ Consultants & POS Agents',
    type: 'Fintech Expo',
    status: 'Registration Open',
    image: imgTeam
  },
  {
    id: 'evt-accra',
    title: 'Accra SME Bookkeeping & Cloud Compliance Masterclass',
    city: 'Accra',
    country: 'Ghana',
    date: 'NOVEMBER 20–21, 2026',
    venue: 'Kempinski Gold Coast City, Accra',
    attendees: '650+ Certified Accountants',
    type: 'Accounting Masterclass',
    status: 'Upcoming',
    image: imgWorkshop
  },
  {
    id: 'evt-kigali',
    title: 'Pan-African Partner Awards & Ecosystem Gala',
    city: 'Kigali',
    country: 'Rwanda',
    date: 'DECEMBER 03, 2026',
    venue: 'Kigali Convention Centre',
    attendees: '850+ Platinum Partners & Resellers',
    type: 'Partner Summit',
    status: 'Upcoming',
    image: imgConsultant
  }
];

export const VIDEO_SHOWCASE_ITEMS: VideoItem[] = [
  {
    id: 'vid-partner-stories',
    title: 'How Our Firm Built a ₦2.4M/Month Software Channel',
    tag: 'Partner Stories',
    duration: '04:18',
    presenter: 'Adekunle & Co. Chartered Accountants (Lagos)',
    thumbnail: imgConference,
    description: 'Hear how a mid-sized accounting firm transformed from seasonal tax filings into an ongoing digital operations partner for 110+ retail businesses.'
  },
  {
    id: 'vid-product-demo',
    title: 'MsmeBooks Ecosystem & Multi-Tenant Console Walkthrough',
    tag: 'Product Demo',
    duration: '07:45',
    presenter: 'MsmeBooks Solutions Engineering Team',
    thumbnail: imgTeam,
    description: 'A complete end-to-end look at inventory controls, automatic bank statement feeds, multi-branch POS, and partner dashboard oversight.'
  },
  {
    id: 'vid-accountant-exp',
    title: 'Auditing 60 SME Clients in Half the Time',
    tag: 'Accountant Experience',
    duration: '03:52',
    presenter: 'Faith Mutua, Certified Public Accountant (Nairobi)',
    thumbnail: imgWorkshop,
    description: 'A deep dive into how digital audit logs, pre-tagged VAT codes, and cloud reconciliations cut down year-end audit times by 55%.'
  },
  {
    id: 'vid-sme-success',
    title: 'Eliminating Cash Leakage Across 4 Retail Outlets',
    tag: 'SME Success Stories',
    duration: '05:10',
    presenter: 'Kwame Mensah, CEO of Horizon Mart (Kumasi)',
    thumbnail: imgConsultant,
    description: 'How an SME owner gained complete peace of mind over daily cash registers, store inventory shrinkage, and supplier invoices with MsmeBooks.'
  },
  {
    id: 'vid-partner-events',
    title: 'Highlights from the Pan-African Partner Summit',
    tag: 'Partner Events',
    duration: '02:40',
    presenter: 'Highlights Reel from Lagos & Nairobi',
    thumbnail: imgConference,
    description: 'Watch African fintech leaders, accounting luminaries, and reseller entrepreneurs celebrating growth, collaboration, and high partner awards.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Babatunde Adeyemi, FCA',
    role: 'Managing Partner',
    organization: 'Adeyemi & Associates Chartered Accountants',
    location: 'Lagos, Nigeria',
    quote: 'MsmeBooks has helped us modernize the way we manage and support our SME clients. Instead of chasing physical paper receipts and reconciling messy spreadsheets at tax time, our team monitors real-time ledgers across 90+ businesses while collecting high recurring partner revenue.',
    tier: 'Platinum Partner',
    metric: '92 Active SME Clients',
    image: imgConsultant
  },
  {
    id: 'test-2',
    name: 'Wanjiku Mwangi',
    role: 'Principal Business Consultant',
    organization: 'Savannah Growth Advisory',
    location: 'Nairobi, Kenya',
    quote: 'We can now provide our clients with technology alongside our advisory services. When we consult with retail and logistics founders on expansion, we immediately standardize their operations on MsmeBooks. The recurring commission provides a steady financial cushion for our practice.',
    tier: 'Partner Tier',
    metric: '48 Deployed Businesses',
    image: imgWorkshop
  },
  {
    id: 'test-3',
    name: 'Kofi Boateng',
    role: 'Chief Technology Officer',
    organization: 'Crestline IT Systems & Resellers',
    location: 'Accra, Ghana',
    quote: 'MsmeBooks gives us another valuable solution to offer the businesses we already serve. When merchants purchase barcode scanners or POS computers from us, pairing it with MsmeBooks turns a one-off device purchase into an ongoing software partnership that compounds monthly.',
    tier: 'Platinum Partner',
    metric: '130+ POS Bundles',
    image: imgTeam
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-accounting',
    tag: 'Accounting Firm',
    title: 'From Traditional Bookkeeping to Digital SME Management',
    firmName: 'Crown Heights Advisory & Tax Consultants',
    location: 'Ibadan & Lagos, Nigeria',
    before: 'Staff spent 60% of their billing hours manually collecting bank receipts, deciphering illegible paper invoices, and correcting manual data entry errors for 45 local retail clients.',
    solution: 'Migrated all 45 SME clients onto the MsmeBooks multi-tenant cloud console, trained business owners on mobile invoicing, and connected daily automated bank reconciliation feeds.',
    outcome: 'Eliminated manual ledger entry by 78%, expanded client handling capacity from 45 to 110 businesses without hiring new staff, and built an additional ₦1,250,000 monthly recurring revenue stream.',
    keyMetric: '+144% Practice Revenue Growth',
    growthStats: [
      { label: 'Client Capacity', value: '+144%' },
      { label: 'Audit Prep Time', value: '-65%' },
      { label: 'Monthly Commission', value: '₦1.25M' }
    ],
    image: imgWorkshop
  },
  {
    id: 'cs-reseller',
    tag: 'Technology Reseller',
    title: 'Turning Hardware Customers Into Long-Term Software Relationships',
    firmName: 'Apex Point Hardware & POS Solutions',
    location: 'Nairobi & Mombasa, Kenya',
    before: 'Relied purely on one-off sales of touchscreens, receipt printers, and cash drawers with unpredictable monthly revenue and zero customer lifetime value after warranty.',
    solution: 'Bundled MsmeBooks cloud software with every retail POS terminal and computer sale, offering free initial software setup and product training for store managers.',
    outcome: 'Successfully converted 82% of hardware buyers into active software subscribers, generating over KSh 380,000 in monthly recurring partner commissions from 140+ active merchant stores.',
    keyMetric: '82% Software Attachment Rate',
    growthStats: [
      { label: 'Hardware Attachment', value: '82%' },
      { label: 'Active Subscriptions', value: '142 Stores' },
      { label: 'Monthly Recurring Margin', value: 'KSh 380K' }
    ],
    image: imgTeam
  },
  {
    id: 'cs-consultant',
    tag: 'Business Consultant',
    title: 'Helping More SMEs While Building a Recurring Revenue Stream',
    firmName: 'Nexus Growth Strategy Partners',
    location: 'Accra, Ghana',
    before: 'Consultants struggled to obtain reliable financial metrics from SME founders, making strategic advisory slow, inaccurate, and heavily dependent on owner recollections.',
    solution: 'Mandated MsmeBooks as the foundational operating platform for all coaching cohorts, utilizing live gross margin, inventory turnover, and cash runway dashboards in advisory meetings.',
    outcome: 'Accelerated client decision cycles from weeks to minutes, boosted client retention to 94%, and established a consistent monthly software revenue stream alongside advisory retainers.',
    keyMetric: '94% SME Client Retention',
    growthStats: [
      { label: 'Cohort Retention', value: '94%' },
      { label: 'Advisory Speed', value: '3.5x Faster' },
      { label: 'Recurring Income', value: 'GH₵ 22,000/mo' }
    ],
    image: imgConference
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Who can become a MsmeBooks Partner?',
    answer: 'The MsmeBooks Partner Program is open to any professional or organization that serves African Micro, Small, and Medium Enterprises. This includes accountants, bookkeepers, tax advisors, IT service companies, computer retailers, POS agents, business consultants, SME training hubs, BPOs, and fintech companies across Africa.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'Can accountants and accounting firms become partners?',
    answer: 'Yes! Accountants and chartered accounting firms are among our most strategic partners. Our multi-tenant Accountant Console lets you switch between all your SME clients with a single login, run batch ledgers, generate tax schedules, and export management reports while earning up to 40% recurring monthly commissions.',
    category: 'General'
  },
  {
    id: 'faq-3',
    question: 'Can IT and technology companies join the program?',
    answer: 'Absolutely. IT service firms, software vendors, and web agencies can bundle MsmeBooks into their existing solutions, integrate client systems via our REST APIs, and create a lucrative, predictable recurring SaaS revenue stream alongside hardware and infrastructure services.',
    category: 'General'
  },
  {
    id: 'faq-4',
    question: 'Can POS agents become MsmeBooks Partners?',
    answer: 'Yes. Merchant aggregators and POS agents can introduce MsmeBooks to their terminal merchants. This empowers shopkeepers to track inventory, reduce store theft, and reconcile daily card and cash sales while the agent earns an ongoing monthly software commission on every active merchant.',
    category: 'General'
  },
  {
    id: 'faq-5',
    question: 'How does recurring commission work?',
    answer: 'Whenever a business registers and maintains an active paid subscription on MsmeBooks through your partner referral code or management portal, you earn an agreed percentage (15% to 40%) of their subscription fee every single billing cycle (monthly or annually) for as long as they stay subscribed.',
    category: 'Commissions'
  },
  {
    id: 'faq-6',
    question: 'What are the Bronze, Silver, Partner and Platinum tiers?',
    answer: 'The tiers reward partner growth: Bronze partners start with 15% commission and foundational onboarding resources; Silver partners receive 20% commission and marketing assets; Partner tier grants 30% commission, priority support, and growth workshops; Platinum partners earn 40% commission with dedicated relationship managers and co-marketing funds.',
    category: 'Commissions'
  },
  {
    id: 'faq-7',
    question: 'How do I move to a higher partner tier?',
    answer: 'Tier progression is based on the number of active, verified business clients in your partner portfolio, partner training completion, and client retention. As your client base expands, your tier automatically updates, unlocking higher commission rates on all your active accounts.',
    category: 'Commissions'
  },
  {
    id: 'faq-8',
    question: 'Do partners receive sales and marketing support?',
    answer: 'Yes. All partners gain access to the MsmeBooks Partner Resource Hub containing pitch presentations, product demo scripts, comparison sheets, social media graphics, client intake questionnaires, and co-brandable promotional collateral to help close deals with confidence.',
    category: 'Support & Tools'
  },
  {
    id: 'faq-9',
    question: 'Can I manage multiple customers from a partner dashboard?',
    answer: 'Yes! The MsmeBooks Partner Console allows you to view all your referred businesses, see subscription status, toggle directly into client books (with client permission), monitor commission accruals, and initiate support tickets on their behalf in one centralized hub.',
    category: 'Support & Tools'
  },
  {
    id: 'faq-10',
    question: 'Is MsmeBooks available across Africa?',
    answer: 'Yes. MsmeBooks is engineered specifically for the African business reality. It supports multiple local currencies (NGN, KES, GHS, ZAR, RWF, TZS, UGX, and USD), accommodates local tax frameworks (VAT, WHT, PAYE), and runs seamlessly on standard low-bandwidth mobile and desktop connections.',
    category: 'General'
  },
  {
    id: 'faq-11',
    question: 'How do partner commissions get calculated and paid?',
    answer: 'Commissions are calculated automatically at the end of each billing calendar month based on active, settled subscriptions. Payouts are transferred directly to your verified commercial bank account or business mobile money wallet on the 10th of every month without hidden administrative fees.',
    category: 'Commissions'
  },
  {
    id: 'faq-12',
    question: 'Are there partner-program terms and qualification requirements?',
    answer: 'Yes. To maintain partner active status and commission eligibility, partners must adhere to standard ethical marketing guidelines, complete periodic product update briefings, and keep client accounts in good standing in accordance with the MsmeBooks Partner Agreement.',
    category: 'Requirements'
  }
];
