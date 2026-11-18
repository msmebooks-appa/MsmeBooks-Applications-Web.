import { PartnerCategoryGroup, PartnerLevelInfo } from '../types/partner';

export const PARTNER_LEVELS: PartnerLevelInfo[] = [
  {
    name: 'Bronze',
    commissionRate: 15,
    targetAudience: 'Entry-level referrers, independent advisors & solo professionals',
    minActiveClients: 1,
    highlightBenefit: '15% Monthly Recurring Commission',
    qualifications: 'Approved registration & compliance verification',
    benefits: [
      '15% recurring commission on eligible customer subscription fees',
      'Personal trackable referral link and partner QR code',
      'Access to standard MsmeBooks Partner Portal',
      'Downloadable sales decks, brochures & digital banners',
      'Automated referral tracking and monthly revenue statements',
      'Introductory online partner product onboarding course'
    ]
  },
  {
    name: 'Silver',
    commissionRate: 20,
    targetAudience: 'Active accountants, business consultants & steady referrers',
    minActiveClients: 10,
    highlightBenefit: '20% Monthly Recurring Commission',
    qualifications: '10+ active paying customer accounts maintained',
    benefits: [
      '20% recurring commission on eligible customer subscription fees',
      'All Bronze Partner benefits included',
      'Advanced sales enablement & live quarterly training webinars',
      'Official MsmeBooks Silver Certified Partner Digital Badge',
      'Co-marketing collateral templates with partner branding',
      'Dedicated partner success manager email support'
    ]
  },
  {
    name: 'Gold',
    commissionRate: 30,
    targetAudience: 'Established accounting firms, POS agents & tech integrators',
    minActiveClients: 30,
    highlightBenefit: '30% Monthly Recurring Commission',
    qualifications: '30+ active paying accounts or certified implementation status',
    benefits: [
      '30% recurring commission on eligible customer subscription fees',
      'All Silver Partner benefits included',
      'Priority partner desk with SLA-backed direct WhatsApp & phone hotline',
      'Advanced implementation & multi-branch API training certification',
      'Joint sales opportunities and inbound lead referrals in your city',
      'Eligibility to bill client onboarding and custom training services',
      'Quarterly performance bonuses on net-new revenue milestones'
    ]
  },
  {
    name: 'Platinum',
    commissionRate: 40,
    targetAudience: 'Strategic distribution networks, enterprise systems integrators',
    minActiveClients: 75,
    highlightBenefit: '40% Top-Tier Recurring Commission',
    qualifications: '75+ active paying accounts or national distributor agreement',
    benefits: [
      '40% top-tier recurring commission on eligible recurring revenue',
      'All Gold Partner benefits included',
      'Executive strategic account director and bespoke commercial roadmap',
      'Co-branded event sponsorships and regional trade-show support',
      'Custom ERP/API integration sandboxes and beta feature access',
      'Enterprise implementation dispatch opportunities, subject to approval',
      'White-label partner reporting and custom commission schedules'
    ]
  }
];

export const INITIAL_CATEGORY_GROUPS: PartnerCategoryGroup[] = [
  {
    id: 'accounting',
    title: 'Accounting & Financial Professionals',
    iconName: 'Calculator',
    badge: '7 Subcategories',
    summary: 'Chartered accountants, tax advisors, bookkeepers, and financial advisory practices streamlining client compliance and cashflow.',
    subcategories: [
      {
        id: 'prof_accountants',
        name: 'Professional Accountants',
        description: 'Certified chartered accountants managing financial accounts, audits, and statutory reporting for SMEs and enterprises.',
        idealProfile: 'ICAN, ACCA, CPA, or registered accounting professionals serving 5+ business clients.',
        permittedActivities: ['Client books management', 'Advisory billing', 'Subscription provisioning', 'Statutory report preparation'],
        potentialBenefits: ['Consolidated multi-client dashboard', 'Up to 30% commission', 'Complimentary firm ledger seat'],
        isActive: true
      },
      {
        id: 'bookkeepers',
        name: 'Bookkeepers',
        description: 'Independent bookkeepers recording daily sales, expenses, bank reconciliations, and payroll entries for local merchants.',
        idealProfile: 'Independent bookkeepers handling daily bookkeeping for micro and small businesses.',
        permittedActivities: ['Daily transaction capture', 'Bank feed reconciliation', 'Invoicing support'],
        potentialBenefits: ['Direct client data sync', 'Automated recurring billing', 'Partner certification badge'],
        isActive: true
      },
      {
        id: 'accounting_firms',
        name: 'Accounting Firms',
        description: 'Multi-partner accounting practices seeking standardisation across their SME client base.',
        idealProfile: 'Firms with 3+ staff managing 20+ active SME clients.',
        permittedActivities: ['Firm-wide deployment', 'Staff seat delegation', 'Bulk client onboarding'],
        potentialBenefits: ['Volume tier upgrades', 'Dedicated partner manager', 'Co-branded marketing'],
        isActive: true
      },
      {
        id: 'audit_firms',
        name: 'Audit Firms',
        description: 'Statutory and internal audit practices leveraging structured audit trails and automated ledger logs.',
        idealProfile: 'Registered audit practitioners conducting independent financial examinations.',
        permittedActivities: ['Audit log inspection', 'Financial statement verification', 'Governance review'],
        potentialBenefits: ['Read-only auditor portal access', 'Immutable ledger exports', 'Enterprise security'],
        isActive: true
      },
      {
        id: 'tax_consultants',
        name: 'Tax Consultants',
        description: 'Specialists in VAT, withholding tax, corporate income tax, and electronic invoicing compliance across African tax regimes.',
        idealProfile: 'Tax practitioners advising merchants on statutory compliance and digital fiscal receipts.',
        permittedActivities: ['Tax schedule preparation', 'Fiscal compliance setup', 'Audit defense support'],
        potentialBenefits: ['Country-specific tax modules', 'Priority tax engine updates', 'Referral commissions'],
        isActive: true
      },
      {
        id: 'financial_consultants',
        name: 'Financial Consultants',
        description: 'Corporate finance advisors, CFO-as-a-service providers, and valuation specialists guiding SMEs.',
        idealProfile: 'Strategic financial planners and fractional CFOs building cashflow forecasts.',
        permittedActivities: ['Cashflow advisory', 'Budgeting model deployment', 'Management reporting'],
        potentialBenefits: ['Advanced BI analytics export', 'Client lifetime revenue share'],
        isActive: true
      },
      {
        id: 'outsourced_accounting',
        name: 'Outsourced Accounting Providers',
        description: 'BPO firms providing turnkey finance, payroll, and bookkeeping operations across borders.',
        idealProfile: 'BPO companies with dedicated accounting desks serving international clients.',
        permittedActivities: ['Full-cycle bookkeeping outsourcing', 'Payroll administration', 'Vendor payments'],
        potentialBenefits: ['Enterprise bulk seat licensing', 'API webhook integrations', 'Dedicated support SLA'],
        isActive: true
      }
    ]
  },
  {
    id: 'technology',
    title: 'Technology & Software Partners',
    iconName: 'Server',
    badge: '10 Subcategories',
    summary: 'Hardware dealers, software resellers, IT integrators, and POS agents rolling out modern point-of-sale and business software.',
    subcategories: [
      {
        id: 'tech_it_companies',
        name: 'Technology and IT Companies',
        description: 'IT infrastructure and enterprise solution vendors bundling MsmeBooks into managed IT contracts.',
        idealProfile: 'Managed Service Providers (MSPs) and cloud infrastructure vendors.',
        permittedActivities: ['Software deployment', 'Network setup', 'Client tech support'],
        potentialBenefits: ['Tiered commission up to 40%', 'Reseller margin protection', 'API sandbox'],
        isActive: true
      },
      {
        id: 'software_distributors',
        name: 'Software Distributors',
        description: 'National and regional commercial software distribution companies managing reseller channels.',
        idealProfile: 'Distributors with nationwide logistics, wholesale credit lines, and dealer networks.',
        permittedActivities: ['Channel distribution', 'Sub-partner onboarding', 'Bulk license procurement'],
        potentialBenefits: ['Master distributor margins', 'Territory exclusivity consideration', 'Joint marketing funds'],
        isActive: true
      },
      {
        id: 'software_resellers',
        name: 'Software Resellers',
        description: 'Value-added resellers (VARs) pairing business management software with training and support.',
        idealProfile: 'Software sales companies with active commercial sales reps.',
        permittedActivities: ['Direct software sales', 'Demo delivery', 'Client training billing'],
        potentialBenefits: ['Direct customer billing option', 'Monthly recurring payout', 'Lead passing'],
        isActive: true
      },
      {
        id: 'saas_consultants',
        name: 'SaaS Consultants',
        description: 'Digital transformation specialists migrating legacy desktop systems to modern cloud solutions.',
        idealProfile: 'Independent consultants and migration engineers specializing in cloud ERP/CRM.',
        permittedActivities: ['Legacy data migration', 'Workflow audit', 'Software evaluation'],
        potentialBenefits: ['Implementation fee retention', 'Commission recurring annuity', 'Partner portal'],
        isActive: true
      },
      {
        id: 'it_implementation',
        name: 'IT Implementation Companies',
        description: 'Specialist firms implementing complex warehouse inventory, multi-store retail, and ERP systems.',
        idealProfile: 'Engineering teams with enterprise implementation experience.',
        permittedActivities: ['Hardware provisioning', 'Data onboarding', 'Custom barcode integration'],
        potentialBenefits: ['Certified partner directory listing', 'Lead dispatch', 'Direct engineering escalation'],
        isActive: true
      },
      {
        id: 'systems_integrators',
        name: 'Systems Integrators',
        description: 'Integration engineers connecting MsmeBooks with CRM, e-commerce storefronts, and logistics APIs.',
        idealProfile: 'Software integration shops building middleware and enterprise connectors.',
        permittedActivities: ['API integration', 'Custom webhook setup', 'Cross-platform sync'],
        potentialBenefits: ['Developer API access', 'App marketplace revenue', 'Technical sandbox'],
        isActive: true
      },
      {
        id: 'computer_shops',
        name: 'Computer Shops & Hardware Vendors',
        description: 'Retail stores and computer plazas selling PCs, laptops, and thermal printers to retail merchants.',
        idealProfile: 'Physical stores in commercial hubs selling computers, barcode scanners, and cash drawers.',
        permittedActivities: ['Hardware bundling', 'In-store software demonstrations', 'Boxed license activation'],
        potentialBenefits: ['Hardware bundle margins', 'Instant digital signup commission', 'Display banner kit'],
        isActive: true
      },
      {
        id: 'pos_agents',
        name: 'POS Agents',
        description: 'Field agents onboarding retail kiosks, supermarkets, pharmacies, and restaurants onto digital POS.',
        idealProfile: 'Field sales agents with active merchant merchant networks in retail clusters.',
        permittedActivities: ['Merchant door-to-door onboarding', 'Terminal setup', 'Cashier training'],
        potentialBenefits: ['Fast weekly commission cycle', 'Physical POS hardware bundle pricing', 'Agent mobile tools'],
        isActive: true
      },
      {
        id: 'pos_hardware_dealers',
        name: 'POS Hardware Dealers',
        description: 'Importers and distributors of Android POS handhelds, touch terminals, and fiscal receipt printers.',
        idealProfile: 'Hardware importers and OEMs supplying POS devices across Africa.',
        permittedActivities: ['Pre-installed firmware bundling', 'Device sales', 'Warranty repair'],
        potentialBenefits: ['Pre-loading certification', 'Wholesale software bundling', 'Hardware-software ecosystem'],
        isActive: true
      },
      {
        id: 'fintech_companies',
        name: 'Fintech Companies',
        description: 'Payment processors, neo-banks, and merchant acquirers embedding smart ledger and POS tools.',
        idealProfile: 'Licensed payment providers seeking embedded bookkeeping and invoicing.',
        permittedActivities: ['Payment gateway co-selling', 'Virtual terminal embed', 'Merchant acquiring'],
        potentialBenefits: ['Bi-directional revenue share', 'API-level integration', 'Co-branded solution'],
        isActive: true
      }
    ]
  },
  {
    id: 'business_dev',
    title: 'Business Development Partners',
    iconName: 'TrendingUp',
    badge: '7 Subcategories',
    summary: 'Commercial sales executives, enterprise brokers, SME advisors, and franchise channels expanding market footprint.',
    subcategories: [
      {
        id: 'business_associates',
        name: 'Business Associates',
        description: 'Professional individuals who introduce qualified business owners in their executive networks.',
        idealProfile: 'Professionals with wide business networks across corporate and SME sectors.',
        permittedActivities: ['Qualified lead introduction', 'Referral link sharing', 'Introductory meetings'],
        potentialBenefits: ['Passive recurring commission', 'Zero inventory risk', 'Transparent link portal'],
        isActive: true
      },
      {
        id: 'independent_sales_agents',
        name: 'Independent Sales Agents',
        description: 'Experienced commission-driven sales professionals conducting direct product demos.',
        idealProfile: 'Proven B2B sales agents selling software or financial services.',
        permittedActivities: ['Direct sales pitching', 'Product demonstrations', 'Lead registration'],
        potentialBenefits: ['Attractive commission up to 30%', 'Sales collateral kits', 'Monthly bonus pool'],
        isActive: true
      },
      {
        id: 'sme_advisors',
        name: 'SME Advisors & Mentors',
        description: 'Advisors guiding growing enterprises through operational restructuring, funding, and governance.',
        idealProfile: 'Experienced business advisors registered with enterprise development agencies.',
        permittedActivities: ['Governance advisory', 'Operational restructuring', 'Digital adoption'],
        potentialBenefits: ['Client health audit tools', 'Recurring advisory annuities', 'Partner badge'],
        isActive: true
      },
      {
        id: 'business_consultants',
        name: 'Business Consultants',
        description: 'Management consultants optimizing operations, supply chain, and retail distribution.',
        idealProfile: 'Boutique consulting firms advising mid-market enterprises.',
        permittedActivities: ['Process re-engineering', 'Change management', 'SaaS evaluation'],
        potentialBenefits: ['Executive partner desk', 'Custom RFP support', 'Gold tier eligibility'],
        isActive: true
      },
      {
        id: 'outsourcing_firms',
        name: 'Outsourcing Firms',
        description: 'Firms providing outsourced administrative, sales, and merchant verification services.',
        idealProfile: 'BPO and corporate staffing organizations handling back-office workflows.',
        permittedActivities: ['Staff enablement', 'Back-office operations', 'Data processing'],
        potentialBenefits: ['Volume discounts', 'Partner API credentials', 'Account manager'],
        isActive: true
      },
      {
        id: 'bizdev_consultants',
        name: 'Business Development Consultants',
        description: 'Sector specialists opening doors in agriculture, hospitality, pharmacy, and wholesale trade.',
        idealProfile: 'Consultants with deep vertical industry experience and trade union connections.',
        permittedActivities: ['Vertical sector campaigns', 'Group buying schemes', 'Executive alignment'],
        potentialBenefits: ['Industry-wide partnership agreements', 'Specialized commission rates'],
        isActive: true
      },
      {
        id: 'franchise_channel_partners',
        name: 'Franchise and Channel Partners',
        description: 'Franchise networks and retail chain managers rolling out standard multi-store accounting.',
        idealProfile: 'Franchisors and retail chain coordinators managing 10+ branch locations.',
        permittedActivities: ['Multi-store rollout', 'Franchisee standardisation', 'Centralized royalty audit'],
        potentialBenefits: ['Master portal dashboard', 'Franchise volume pricing', 'VIP support priority'],
        isActive: true
      }
    ]
  },
  {
    id: 'education',
    title: 'Education & Professional Partners',
    iconName: 'GraduationCap',
    badge: '5 Subcategories',
    summary: 'Universities, entrepreneurship hubs, incubators, and digital training academies empowering the next generation of business founders.',
    subcategories: [
      {
        id: 'business_training_centres',
        name: 'Business Training Centres',
        description: 'Vocational institutes and commercial training centres running practical accounting and digital skills bootcamps.',
        idealProfile: 'Accredited training centres offering practical business management courses.',
        permittedActivities: ['Curriculum integration', 'Student lab provisioning', 'Certification testing'],
        potentialBenefits: ['Discounted student sandbox licenses', 'Course completion certificates', 'Revenue share'],
        isActive: true
      },
      {
        id: 'entrepreneurship_hubs',
        name: 'Entrepreneurship Hubs',
        description: 'Co-working spaces, tech hubs, and innovation centres supporting early-stage startups and SME founders.',
        idealProfile: 'Community spaces with 50+ resident or member startup enterprises.',
        permittedActivities: ['Community workshops', 'Perk bundle inclusions', 'Founder onboarding sessions'],
        potentialBenefits: ['Exclusive member promo codes', 'Community sponsorship', 'Partner commission share'],
        isActive: true
      },
      {
        id: 'professional_training_providers',
        name: 'Professional Training Providers',
        description: 'CPD and professional development firms preparing accountants for modern software mastery.',
        idealProfile: 'Providers accredited to deliver continuing professional development credits.',
        permittedActivities: ['Accredited CPD course delivery', 'Hands-on software workshops', 'Masterclasses'],
        potentialBenefits: ['Official training partner status', 'Co-branded certification', 'Speaker bureau access'],
        isActive: true
      },
      {
        id: 'business_incubators',
        name: 'Business Incubators & Accelerators',
        description: 'Venture studios and angel investor syndicates instituting rigorous bookkeeping across their portfolio.',
        idealProfile: 'Incubators backing cohorts of African high-growth enterprises.',
        permittedActivities: ['Cohort onboarding', 'Financial governance setup', 'Investor reporting access'],
        potentialBenefits: ['Portfolio-wide dashboard', 'Preferred cohort rates', 'Quarterly advisory reports'],
        isActive: true
      },
      {
        id: 'digital_skills_orgs',
        name: 'Digital Skills Training Organisations',
        description: 'Non-profits, NGOs, and donor-funded initiatives training women and youth in micro-enterprise digitisation.',
        idealProfile: 'Organizations driving digital literacy, financial inclusion, and youth empowerment.',
        permittedActivities: ['Grassroots digital adoption', 'Merchant digital bookkeeping clinics'],
        potentialBenefits: ['Subsidised non-profit licensing', 'Impact reporting metrics', 'Dedicated trainer kit'],
        isActive: true
      }
    ]
  },
  {
    id: 'digital_strategic',
    title: 'Digital & Strategic Partners',
    iconName: 'Globe',
    badge: '7 Subcategories',
    summary: 'Affiliate creators, digital marketing agencies, e-commerce facilitators, and trade associations driving online adoption.',
    subcategories: [
      {
        id: 'affiliate_marketers',
        name: 'Affiliate Marketers',
        description: 'Digital marketers, niche website publishers, and review sites comparing business software.',
        idealProfile: 'Experienced digital affiliates with established web traffic or newsletters.',
        permittedActivities: ['SEO reviews', 'Comparison tables', 'Digital ad campaigns adhering to brand rules'],
        potentialBenefits: ['Lifetime recurring attribution', 'Real-time click & conversion reporting', 'Creative asset kit'],
        isActive: true
      },
      {
        id: 'digital_agencies',
        name: 'Digital Marketing Agencies',
        description: 'Agencies designing websites and e-commerce stores who want to bundle accounting and inventory.',
        idealProfile: 'Full-service digital agencies serving retail and service clients.',
        permittedActivities: ['Website integration', 'Inventory synchronization', 'Client onboarding'],
        potentialBenefits: ['Add-on service revenue', 'Client retention enhancement', 'Agency partner badge'],
        isActive: true
      },
      {
        id: 'content_creators',
        name: 'Content Creators & YouTubers',
        description: 'Creators producing practical educational videos on business growth, tax advice, and entrepreneurship.',
        idealProfile: 'Creators with dedicated followings of business owners on YouTube, TikTok, or LinkedIn.',
        permittedActivities: ['Software walkthroughs', 'Educational case studies', 'Sponsored tutorials'],
        potentialBenefits: ['Sponsorship support', 'Custom promo codes', 'High-conversion landing pages'],
        isActive: true
      },
      {
        id: 'business_influencers',
        name: 'Business Influencers',
        description: 'Thought leaders, authors, and keynote speakers championing MSME growth and operational discipline.',
        idealProfile: 'Recognized industry speakers and author-consultants with verified business audiences.',
        permittedActivities: ['Thought leadership articles', 'Podcast interviews', 'Keynote endorsement'],
        potentialBenefits: ['VIP executive liaison', 'Bespoke commercial arrangements', 'Event co-hosting'],
        isActive: true
      },
      {
        id: 'ecommerce_providers',
        name: 'E-commerce Service Providers',
        description: 'Logistics, delivery, and web-store specialists seeking seamless automated invoice reconciliation.',
        idealProfile: 'Delivery aggregators, packaging suppliers, and Shopify/WooCommerce developers.',
        permittedActivities: ['Cross-promotions', 'Delivery receipt integration', 'Merchant co-referral'],
        potentialBenefits: ['Ecosystem cross-selling', 'API joint initiatives', 'Co-branded marketing'],
        isActive: true
      },
      {
        id: 'strategic_alliances',
        name: 'Strategic Alliance Partners',
        description: 'Commercial banks, microfinance institutions, telecom operators, and enterprise hardware brands.',
        idealProfile: 'Tier-1 enterprise organizations serving millions of African small businesses.',
        permittedActivities: ['National joint commercial programs', 'SME banking bundle integration'],
        potentialBenefits: ['Custom enterprise agreement', 'Dedicated integration desk', 'Executive governance'],
        isActive: true
      },
      {
        id: 'industry_associations',
        name: 'Industry Associations & Chambers',
        description: 'Chambers of commerce, trade unions, market associations, and retail merchant guilds.',
        idealProfile: 'Registered trade associations representing commercial business owners.',
        permittedActivities: ['Member benefit packages', 'Digital adoption townhalls', 'Group discount programs'],
        potentialBenefits: ['Member welfare revenue share', 'Digitised membership compliance', 'Free annual audits'],
        isActive: true
      }
    ]
  }
];
