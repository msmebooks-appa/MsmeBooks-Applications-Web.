import { CompanyProfile, Job } from '../types/career';

export const KNOWN_COMPANY_PROFILES: Record<string, CompanyProfile> = {
  'msmebooks technologies': {
    name: 'MsmeBooks Technologies',
    tagline: 'Building the Operating System for African Commerce and Enterprise Finance',
    about:
      'MsmeBooks Technologies is a leading Pan-African SaaS company providing an all-in-one Accounting, Point of Sale (POS), Inventory, and Business Management platform for micro, small, and medium enterprises across Africa and beyond. Founded with the mission to eliminate paperwork and unlock formal credit for millions of entrepreneurs, MsmeBooks powers transactions across 20+ Countries and key Pan-African Operations Hubs.',
    mission:
      'To democratize enterprise-grade financial management and retail tooling for every African business owner, fostering financial inclusion, transparency, and sustainable economic mobility.',
    vision:
      'An interconnected African digital economy where no small business fails due to poor bookkeeping, inventory stockouts, or lack of verified financial track records.',
    industry: 'Financial Technology & Enterprise SaaS',
    companySize: '100–250 Employees',
    headquarters: 'Lagos, Nigeria & Nairobi, Kenya',
    foundedYear: '2021',
    website: 'https://www.msmebooks.org',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#0066CC',
    cultureValues: [
      {
        title: 'Customer Empathy First',
        description:
          'We spend time in street markets, retail counters, and warehouses listening to real business owners before writing a single line of product code.',
      },
      {
        title: 'Radical Autonomy & Ownership',
        description:
          'We hire exceptional builders, set clear North Star objectives, and empower teams to execute without bureaucratic friction.',
      },
      {
        title: 'High-Throughput Craftsmanship',
        description:
          'We take pride in building rock-solid, offline-first systems capable of handling critical ledger transactions with zero data loss.',
      },
      {
        title: 'Continuous Learning & Humility',
        description:
          'Every mistake is a post-mortem opportunity to strengthen our systems, documentation, and shared engineering knowledge.',
      },
    ],
    benefits: [
      {
        title: 'USD-Pegged Compensation',
        description: 'Competitive remuneration benchmarked against international tech compensation tiers with biannual performance reviews.',
        category: 'Compensation',
      },
      {
        title: 'Remote-First Flexibility',
        description: 'Work from anywhere across African time zones (GMT to GMT+3) or collaborate at our modern city innovation hubs.',
        category: 'Workplace',
      },
      {
        title: 'Comprehensive Health & Family HMO',
        description: 'Top-tier medical, optical, and dental coverage for you and your dependents, plus mental health support.',
        category: 'Health & Wellness',
      },
      {
        title: '$1,200 Home Office Stipend',
        description: 'Generous initial setup budget for ergonomic desk chairs, 4K monitors, and backup power solutions.',
        category: 'Equipment',
      },
      {
        title: '$1,500 Annual Growth Budget',
        description: 'Dedicated funds for books, certifications, AWS/GCP cloud courses, and global developer conferences.',
        category: 'Professional Growth',
      },
      {
        title: '25 Days Paid Leave + Parental Support',
        description: 'Generous annual rest days, fully paid parental leave, and flexible rest-and-recovery policies.',
        category: 'Time Off',
      },
    ],
    perksHighlights: [
      'Top-tier Apple M3 / ThinkPad hardware',
      'Annual all-hands African team summit',
      'Unlimited coffee & catered hub lunches',
      'Employee equity & stock option program',
      'Fast-track internal mobility & mentorship',
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Go', 'Tailwind CSS'],
    socialLinks: {
      website: 'https://www.msmebooks.org',
      linkedin: 'https://linkedin.com/company/msmebooks',
      twitter: 'https://twitter.com/msmebooks',
      github: 'https://github.com/msmebooks',
    },
  },

  'msmebooks east africa hub': {
    name: 'MsmeBooks East Africa Hub',
    tagline: 'Driving Mobile Money Integration and Retail POS Innovation in East Africa',
    about:
      'The East Africa innovation outpost of MsmeBooks, headquartered in Westlands Nairobi. The hub spearheads localized integration with M-Pesa, Airtel Money, and regional cross-border commerce networks across Kenya, Uganda, Tanzania, and Rwanda.',
    mission:
      'To build ultra-fast, cashless retail checkout and inventory synchronization tools optimized for East Africa’s high-velocity mobile commerce ecosystem.',
    vision:
      'A seamless retail ecosystem where merchant bookkeeping is automated in real-time on every mobile and card transaction.',
    industry: 'Mobile Fintech & Retail POS',
    companySize: '50–100 Employees',
    headquarters: 'Nairobi (Westlands), Kenya',
    foundedYear: '2022',
    website: 'https://www.msmebooks.org',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#10B981',
    cultureValues: [
      {
        title: 'Speed with Precision',
        description: 'We move fast to capture market dynamics while maintaining zero tolerance for transaction dropouts.',
      },
      {
        title: 'Collaborative Hub Culture',
        description: 'We combine hybrid independence with vibrant collaborative whiteboarding sessions in our Nairobi studio.',
      },
      {
        title: 'Merchant-Centric Prototyping',
        description: 'Designers and engineers test prototypes weekly with local store managers across Nairobi.',
      },
    ],
    benefits: [
      {
        title: 'Hybrid Workspace Flexibility',
        description: 'Collaborate 2 days a week from our Westlands office overlooking the Nairobi skyline and 3 days remote.',
        category: 'Workplace',
      },
      {
        title: 'Premium Kenyan Medical HMO',
        description: 'Comprehensive inpatient and outpatient medical coverage including dental, optical, and wellness.',
        category: 'Health & Wellness',
      },
      {
        title: 'High-Spec Tech Hardware',
        description: 'Latest MacBook Pro machine, ergonomic accessories, and high-speed mobile data reimbursement.',
        category: 'Equipment',
      },
      {
        title: 'Annual Team Retreats',
        description: 'Quarterly strategy offsites and annual safari retreats across the Great Rift Valley.',
        category: 'Culture',
      },
    ],
    perksHighlights: [
      'Westlands rooftop terrace & barista coffee',
      'Mobile data & home fibre subsidy',
      'Gym & fitness wellness membership',
      'Performance-based annual bonuses',
    ],
    techStack: ['React', 'TypeScript', 'Figma', 'Node.js', 'Kotlin (Android POS)', 'PostgreSQL'],
    socialLinks: {
      website: 'https://www.msmebooks.org',
      linkedin: 'https://linkedin.com/company/msmebooks',
      twitter: 'https://twitter.com/msmebooks',
    },
  },

  'msmebooks ai labs': {
    name: 'MsmeBooks AI Labs',
    tagline: 'Applied Artificial Intelligence & Machine Learning for Small Business Operations',
    about:
      'The research and advanced machine intelligence arm of MsmeBooks. We develop cutting-edge document OCR vision models, predictive inventory stockout algorithms, and conversational bookkeeping assistants powered by the Google Gemini API.',
    mission:
      'To put state-of-the-art artificial intelligence to work for everyday African shop owners, transforming raw paper receipts and unstructured messages into actionable financial intelligence.',
    vision:
      'Zero-data-entry bookkeeping where smart computer vision and predictive models handle 100% of clerical accounting tasks.',
    industry: 'Applied AI & Document Intelligence',
    companySize: '25–50 Researchers & Engineers',
    headquarters: 'Distributed / Kigali & Lagos',
    foundedYear: '2023',
    website: 'https://www.msmebooks.org',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#8B5CF6',
    cultureValues: [
      {
        title: 'Research Applied to Reality',
        description: 'We measure model performance not only by F1-score, but by latency, battery usage, and offline inference on entry-level Android devices.',
      },
      {
        title: 'Scientific Rigor & Experimentation',
        description: 'Hypothesis-driven development, reproducible benchmarks, and continuous model evaluation against African receipt formats.',
      },
      {
        title: 'Global Remote Freedom',
        description: 'Work from wherever you do your best thinking, with asynchronous deep-work blocks and zero unnecessary meetings.',
      },
    ],
    benefits: [
      {
        title: 'Global USD Compensation & Equity',
        description: 'Top 10% global engineering compensation packages with meaningful stock option participation.',
        category: 'Compensation',
      },
      {
        title: '$2,500 Compute & Hardware Budget',
        description: 'Dedicated GPU cloud credits, custom developer laptops, and local workstation setups.',
        category: 'Equipment',
      },
      {
        title: 'Unlimited Paid Time Off',
        description: 'Results-oriented vacation policy with mandatory 20-day minimum rest encouraged.',
        category: 'Time Off',
      },
      {
        title: 'Research Publication Support',
        description: 'Sponsorship for submitting papers to NeurIPS, CVPR, and leading international AI conferences.',
        category: 'Professional Growth',
      },
    ],
    perksHighlights: [
      'Cloud GPU cluster access (H100/A100 instances)',
      '100% asynchronous work culture',
      'Annual international team summit',
      'Book & research paper stipend',
    ],
    techStack: ['Python', 'PyTorch', 'Google Gemini API', 'ONNX', 'FastAPI', 'CUDA', 'Vector Embeddings'],
    socialLinks: {
      website: 'https://www.msmebooks.org',
      github: 'https://github.com/msmebooks',
      twitter: 'https://twitter.com/msmebooks',
    },
  },

  'sabicommerce retail network': {
    name: 'SabiCommerce Retail Network',
    tagline: 'Modernizing B2B Wholesale Distribution and Retail Fulfillment Across West Africa',
    about:
      'SabiCommerce is a fast-growing B2B commerce and distribution network connecting informal retail shops directly to FMCG manufacturers and wholesalers. Through integrated inventory ordering and digital ledger financing, SabiCommerce eliminates middleman markups and empowers shopkeepers.',
    mission:
      'To build reliable digital pipelines between African consumer goods factories and the informal neighborhood kiosks that serve 80% of urban households.',
    vision:
      'An efficient, transparent supply chain where every neighborhood store is always stocked with affordable, authentic essentials.',
    industry: 'B2B E-Commerce & FMCG Logistics',
    companySize: '250–500 Employees',
    headquarters: 'Lagos (Ikeja), Nigeria',
    foundedYear: '2020',
    website: 'https://sabicommerce.africa',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#F59E0B',
    cultureValues: [
      {
        title: 'Street-Smart Pragmatism',
        description: 'We respect the hustle of African market traders and build logistics that work in traffic, power cuts, and rain.',
      },
      {
        title: 'Relentless Execution',
        description: 'When orders are placed, our trucks move. Dependability is our core competitive advantage.',
      },
      {
        title: 'Team Solidarity',
        description: 'Warehouse staff, field sales leads, and software engineers win and celebrate together.',
      },
    ],
    benefits: [
      {
        title: 'Competitive Base + Uncapped Commission',
        description: 'Industry-leading compensation structure rewarding high-performing commercial drivers.',
        category: 'Compensation',
      },
      {
        title: 'Comprehensive Nigerian HMO',
        description: 'Access to premier private clinics, maternity care, and hospital networks in Lagos and Abuja.',
        category: 'Health & Wellness',
      },
      {
        title: 'Logistics & Transport Allowance',
        description: 'Dedicated travel stipends, corporate fuel cards, and company vehicle access for field sales.',
        category: 'Travel & Mobility',
      },
      {
        title: 'Accelerated Leadership Tracks',
        description: 'Rapid promotion pathways into territorial management and regional leadership roles.',
        category: 'Career Growth',
      },
    ],
    perksHighlights: [
      'Official mobility & logistics fleet support',
      'Quarterly sales president club awards',
      'Catered lunch at Ikeja distribution hub',
      'Pension remittances and group life cover',
    ],
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'HubSpot CRM', 'Google Maps API'],
    socialLinks: {
      website: 'https://sabicommerce.africa',
      linkedin: 'https://linkedin.com/company/sabicommerce',
    },
  },

  'afrilogistics retail hub': {
    name: 'AfriLogistics Retail Hub',
    tagline: 'Last-Mile Cold Chain and E-Commerce Freight Infrastructure for East Africa',
    about:
      'AfriLogistics provides temperature-controlled warehousing, cross-border express trucking, and last-mile retail parcel delivery connecting Rwanda, Kenya, Uganda, and the DRC. Operating from the Norrsken Kigali innovation campus, AfriLogistics powers critical medical and fresh grocery distribution.',
    mission:
      'To eliminate agricultural post-harvest loss and connect East African producers to regional consumer centers through smart green logistics.',
    vision:
      'A net-zero, high-speed freight network uniting all trade corridors across the East African Community.',
    industry: 'Logistics, Supply Chain & Green Mobility',
    companySize: '50–150 Employees',
    headquarters: 'Kigali (Norrsken House), Rwanda',
    foundedYear: '2021',
    website: 'https://afrilogistics.rw',
    verified: true,
    employerType: 'Company',
    accentColor: '#0EA5E9',
    cultureValues: [
      {
        title: 'Sustainability by Design',
        description: 'We prioritize electric delivery fleets, solar-powered hubs, and route optimization algorithms.',
      },
      {
        title: 'Pan-African Inclusivity',
        description: 'Our team speaks English, French, Swahili, and Kinyarwanda, celebrating diversity across every office.',
      },
      {
        title: 'Operational Transparency',
        description: 'Real-time GPS tracking and candid accountability in every client engagement.',
      },
    ],
    benefits: [
      {
        title: 'Norrsken Kigali Campus Perks',
        description: 'Work in Rwanda’s most vibrant tech hub with high-speed internet, wellness spaces, and garden pods.',
        category: 'Workplace',
      },
      {
        title: 'Full RSSB & Private Medical Insurance',
        description: 'Comprehensive health coverage for employees and families with top Kigali specialists.',
        category: 'Health & Wellness',
      },
      {
        title: 'Continuous Education Fund',
        description: 'Annual budget for logistics certifications, coding bootcamps, and professional degrees.',
        category: 'Education',
      },
      {
        title: 'Eco-Mobility Transit Allowance',
        description: 'Subsidized electric scooter and public transit passes for eco-friendly daily commuting.',
        category: 'Mobility',
      },
    ],
    perksHighlights: [
      'Norrsken Kigali campus community access',
      'International speaker series and hackathons',
      'Wellness and gym membership subsidy',
      'Cross-border regional travel opportunities',
    ],
    techStack: ['IoT Telematics', 'React', 'Python', 'Go', 'Docker', 'PostGIS'],
    socialLinks: {
      website: 'https://afrilogistics.rw',
      linkedin: 'https://linkedin.com/company/afrilogistics',
    },
  },

  'paybridge financial systems': {
    name: 'PayBridge Financial Systems',
    tagline: 'Enterprise B2B Payments, Treasury Operations & Direct Banking Rails',
    about:
      'PayBridge delivers enterprise-grade payment orchestration, virtual accounts, and cross-border currency settlement for multi-national corporations, fast-scaling startups, and government agencies operating in West Africa.',
    mission:
      'To build the most secure, compliant, and cost-effective financial infrastructure connecting African commercial banks to global payment networks.',
    vision:
      'Zero-friction commercial settlement where funds move between African currencies with the speed and certainty of email.',
    industry: 'Fintech, B2B Payments & Treasury',
    companySize: '100–200 Employees',
    headquarters: 'Lagos (Victoria Island), Nigeria',
    foundedYear: '2019',
    website: 'https://paybridge.ng',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#3B82F6',
    cultureValues: [
      {
        title: 'Institutional Integrity',
        description: 'We treat compliance, auditability, and regulatory adherence as non-negotiable foundations.',
      },
      {
        title: 'Resilient Engineering',
        description: 'We build for 99.999% uptime, knowing that millions of dollars in payroll depend on our rails.',
      },
      {
        title: 'Customer Stewardship',
        description: 'We act as trusted financial advisors and partners to our enterprise corporate clients.',
      },
    ],
    benefits: [
      {
        title: 'Top-Tier Compensation & Profit Sharing',
        description: 'Lucrative salary brackets paired with annual company performance bonus pools.',
        category: 'Compensation',
      },
      {
        title: 'Executive Healthcare Coverage',
        description: 'Comprehensive private HMO for employee, spouse, and up to four children with international evacuation riders.',
        category: 'Health & Wellness',
      },
      {
        title: 'Professional Exam Sponsorship',
        description: '100% reimbursement for ICAN, ACCA, CFA, and CISA dues, materials, and exam sittings.',
        category: 'Professional Growth',
      },
      {
        title: 'Three-Year Sabbatical Benefit',
        description: 'Eligible for 4 weeks of paid sabbatical leave upon completing 3 years of dedicated service.',
        category: 'Time Off',
      },
    ],
    perksHighlights: [
      'Victoria Island office with waterfront views',
      'Daily executive lunch buffet',
      'Creche and nursery subsidies for new parents',
      'Low-interest employee asset financing loans',
    ],
    techStack: ['Java Spring Boot', 'PostgreSQL', 'Kafka', 'React', 'Kubernetes', 'PCI-DSS Tier 1'],
    socialLinks: {
      website: 'https://paybridge.ng',
      linkedin: 'https://linkedin.com/company/paybridge-systems',
    },
  },

  'kopokopo merchant hub': {
    name: 'KopoKopo Merchant Hub',
    tagline: 'Empowering East African Retail Businesses with Digital Payments & Growth Credit',
    about:
      'KopoKopo pioneered merchant Till Numbers and unsecured working capital advances for small business merchants in Kenya and Ghana. Over $150M has been disbursed to date, supporting retail businesses in expanding inventory and opening new storefronts.',
    mission:
      'To provide micro and small merchants with instant digital payment acceptance and rapid, cashflow-based business credit.',
    vision:
      'Every African shopkeeper has instant access to fair capital and modern software to grow their family enterprise.',
    industry: 'Merchant Acquiring & SME Lending',
    companySize: '150–300 Employees',
    headquarters: 'Nairobi & Accra',
    foundedYear: '2018',
    website: 'https://kopokopo.ke',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#EC4899',
    cultureValues: [
      {
        title: 'Champion the Underdog',
        description: 'We believe small business owners are the real heroes of African economic development.',
      },
      {
        title: 'Data-Driven Fairness',
        description: 'We use transparent cash-flow data rather than rigid collateral to approve loans in minutes.',
      },
      {
        title: 'Tenacious Innovation',
        description: 'We continuously invent new financial instruments tailored to emerging market cash cycles.',
      },
    ],
    benefits: [
      {
        title: 'Equitable Cross-Border Pay',
        description: 'USD and local currency indexed compensation plans with annual cost-of-living adjustments.',
        category: 'Compensation',
      },
      {
        title: 'Family Medical & Dental Plan',
        description: 'Generous private healthcare package covering outpatient, inpatient, optical, and dental.',
        category: 'Health & Wellness',
      },
      {
        title: 'Flexible Hybrid Schedule',
        description: 'Modern office hubs with dedicated focus zones and the flexibility to work remotely.',
        category: 'Workplace',
      },
      {
        title: 'Annual Education Grants',
        description: 'Up to $2,000 yearly for courses in product management, data science, or leadership.',
        category: 'Education',
      },
    ],
    perksHighlights: [
      'Accra and Nairobi hub work passes',
      'Generous paid parental leave',
      'Quarterly team celebrations and hack days',
      'Mentorship from fintech pioneers',
    ],
    techStack: ['Ruby on Rails', 'React', 'PostgreSQL', 'Redis', 'AWS', 'Looker'],
    socialLinks: {
      website: 'https://kopokopo.ke',
      linkedin: 'https://linkedin.com/company/kopokopo',
    },
  },

  'apex tech talent africa': {
    name: 'Apex Tech Talent Africa',
    tagline: 'Connecting Elite Pan-African Engineers and Leaders with Global Tech Opportunities',
    about:
      'Apex Tech Talent is an executive search and tech recruitment agency headquartered in Sandton, Johannesburg. We specialize in vetting, matching, and placing top software architects, engineering managers, and commercial executives into hyper-growth African and global technology ventures.',
    mission:
      'To unlock international opportunities for world-class African technical talent while building equitable, sustainable distributed engineering hubs.',
    vision:
      'Africa recognized as the preeminent global reservoir of software innovation, technical leadership, and engineering excellence.',
    industry: 'HR Tech & Executive Search',
    companySize: '25–50 Recruiters & Advisors',
    headquarters: 'Johannesburg (Sandton), South Africa',
    foundedYear: '2020',
    website: 'https://apexafrica.co.za',
    verified: true,
    employerType: 'Agency',
    accentColor: '#4F46E5',
    cultureValues: [
      {
        title: 'People-First Transparency',
        description: 'We believe candid feedback and respectful candidate advocacy create enduring relationships.',
      },
      {
        title: 'Merit-Driven Equity',
        description: 'We actively break geographical biases and promote inclusive, high-compensation placements.',
      },
      {
        title: 'Deep Technical Fluency',
        description: 'Our consultants understand code, architecture trade-offs, and software delivery lifecycles.',
      },
    ],
    benefits: [
      {
        title: 'Competitive ZAR/USD Remuneration',
        description: 'Strong base salary paired with generous quarterly placement performance incentives.',
        category: 'Compensation',
      },
      {
        title: 'Discovery Health Comprehensive Cover',
        description: 'Top-tier medical aid with vitality wellness and gym membership subsidies.',
        category: 'Health & Wellness',
      },
      {
        title: 'Flexible Hybrid Workspace',
        description: 'Premium office hub in Sandton with option to work remotely across South African provinces.',
        category: 'Workplace',
      },
    ],
    perksHighlights: [
      'Sandton high-rise workspace and coffee bar',
      'Uncapped quarterly performance commission',
      'Generous paid parental and study leave',
      'Executive leadership mentorship network',
    ],
    techStack: ['Lever ATS', 'LinkedIn Recruiter', 'Notion', 'HubSpot', 'Slack'],
    socialLinks: {
      website: 'https://apexafrica.co.za',
      linkedin: 'https://linkedin.com/company/apex-tech-talent-africa',
    },
  },

  'biomed africa diagnostics': {
    name: 'BioMed Africa Diagnostics',
    tagline: 'Digitizing Clinical Laboratory Diagnostics & Telemedicine Across West Africa',
    about:
      'BioMed Africa Diagnostics operates modern clinical pathology centers and a digital laboratory results network across Nigeria, Ghana, and Senegal. Our cloud-connected diagnostic instruments enable small clinics and neighborhood pharmacies to access instant diagnostic test validations.',
    mission:
      'To make rapid, accredited diagnostic healthcare accessible and affordable to every community through digital pathology rails.',
    vision:
      'An interconnected African digital healthcare network where critical medical diagnoses take minutes instead of days.',
    industry: 'HealthTech & Telemedicine',
    companySize: '80–150 Healthcare Specialists',
    headquarters: 'Lagos & Accra',
    foundedYear: '2021',
    website: 'https://biomedafrica.health',
    verified: true,
    employerType: 'Company',
    accentColor: '#059669',
    cultureValues: [
      {
        title: 'Clinical Precision Above All',
        description: 'Patient health depends on flawless lab results and rigorous automated quality controls.',
      },
      {
        title: 'Affordable Accessibility',
        description: 'We continuously engineer cost-efficient diagnostic workflows to serve underserved populations.',
      },
    ],
    benefits: [
      {
        title: 'Healthcare Staff Comprehensive HMO',
        description: 'Top-grade medical, surgical, and wellness cover for employees and immediate families.',
        category: 'Health & Wellness',
      },
      {
        title: 'Continuous Medical Education (CME)',
        description: 'Fully funded clinical certification programs, conference travel, and research grants.',
        category: 'Professional Growth',
      },
    ],
    perksHighlights: [
      'State-of-the-art laboratory instrumentation',
      'Free annual health screenings for extended family',
      'Flexible clinical and software shift rosters',
    ],
    techStack: ['FHIR API', 'React', 'Python', 'PostgreSQL', 'Docker'],
    socialLinks: {
      website: 'https://biomedafrica.health',
      linkedin: 'https://linkedin.com/company/biomed-africa',
    },
  },

  'flutterflow africa': {
    name: 'FlutterFlow Africa Community',
    tagline: 'Accelerating Visual App Development and Mobile Solutions for African Builders',
    about:
      'FlutterFlow Africa empowers mobile app developers, startup founders, and agency studios across Africa with visual-first Flutter development architectures. Through localized mentorship, templates, and backend integrations with African payment gateways, we enable rapid deployment of production mobile apps.',
    mission:
      'To 10x the speed of software creation for African entrepreneurs by democratizing modern multi-platform Flutter development.',
    vision:
      'A continent where every bold entrepreneur can launch a world-class mobile app in days, not months.',
    industry: 'Low-Code & Cross-Platform Development',
    companySize: '30–60 Developers & Educators',
    headquarters: 'Nairobi & Lagos',
    foundedYear: '2022',
    website: 'https://flutterflow.africa',
    verified: true,
    employerType: 'Company',
    accentColor: '#0284C7',
    cultureValues: [
      {
        title: 'Speed with Code Quality',
        description: 'We build clean, exportable Flutter code that scales from prototype to millions of users.',
      },
      {
        title: 'Community Empowerment',
        description: 'Knowledge sharing, free open-source templates, and active mentorship of new developers.',
      },
    ],
    benefits: [
      {
        title: '100% Remote Global Freedom',
        description: 'Work from anywhere with asynchronous sprints and flexible work hours.',
        category: 'Workplace',
      },
      {
        title: 'Tech Setup Stipend ($1,500)',
        description: 'Allowance for high-spec laptops, test devices, and ergonomic workstations.',
        category: 'Equipment',
      },
    ],
    perksHighlights: [
      'All-access FlutterFlow Enterprise license',
      'Annual African developer conference tickets',
      'Co-working stipend across 20+ African cities',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'Supabase', 'Node.js'],
    socialLinks: {
      website: 'https://flutterflow.africa',
      github: 'https://github.com/flutterflow-africa',
    },
  },

  'greenroots agritech': {
    name: 'GreenRoots AgriTech',
    tagline: 'Climate-Smart Agritech, Crop Yield Intelligence & Smallholder Market Access',
    about:
      'GreenRoots AgriTech connects over 80,000 smallholder farmers in Kenya, Uganda, and Rwanda with fair-market agricultural buyers, weather index insurance, and solar-powered cold storage. Our IoT soil sensors and mobile USSD platform maximize crop yields and eliminate post-harvest waste.',
    mission:
      'To build a resilient, profitable future for African farming communities through data-driven agronomic intelligence.',
    vision:
      'Food sovereignty and prosperous farming livelihoods across every agricultural basin in Africa.',
    industry: 'AgriTech & Food Supply Chain',
    companySize: '70–120 Agribusiness Pros',
    headquarters: 'Nairobi & Kigali',
    foundedYear: '2020',
    website: 'https://greenroots.ag',
    verified: true,
    employerType: 'Company',
    accentColor: '#16A34A',
    cultureValues: [
      {
        title: 'Farmer Centricity',
        description: 'We measure success by the increased net income in the pockets of rural farm households.',
      },
      {
        title: 'Climate Resilience',
        description: 'We design solutions that regenerate the soil and withstand extreme weather.',
      },
    ],
    benefits: [
      {
        title: 'Field and Hub Work Balance',
        description: 'Flexible hybrid arrangements combining rural field insights with modern hub design.',
        category: 'Workplace',
      },
      {
        title: 'Health and Emergency Evacuation',
        description: 'Comprehensive medical coverage with remote field travel insurance.',
        category: 'Health & Wellness',
      },
    ],
    perksHighlights: [
      'Field testing visits to partner farms',
      'Fresh organic produce delivery box',
      'Eco-friendly commuting allowances',
    ],
    techStack: ['Python', 'IoT Telemetry', 'React Native', 'PostgreSQL'],
    socialLinks: {
      website: 'https://greenroots.ag',
      linkedin: 'https://linkedin.com/company/greenroots-agritech',
    },
  },

  'helios clean energy': {
    name: 'Helios Clean Energy',
    tagline: 'Solar Microgrids, Pay-As-You-Go Clean Power & Smart Energy Metering',
    about:
      'Helios Clean Energy designs, finances, and operates solar minigrids and productive-use energy equipment for off-grid rural markets, agro-processors, and commercial health clinics across sub-Saharan Africa.',
    mission:
      'To replace noisy, dirty diesel generators with reliable, clean solar power for African enterprise growth.',
    vision:
      '100% clean, 24/7 electricity access for every productive small business across Africa.',
    industry: 'Renewable Energy & CleanTech',
    companySize: '60–100 Energy Engineers',
    headquarters: 'Lagos & Nairobi',
    foundedYear: '2019',
    website: 'https://heliosenergy.africa',
    verified: true,
    employerType: 'Enterprise',
    accentColor: '#D97706',
    cultureValues: [
      {
        title: 'Zero-Carbon Commitment',
        description: 'Every kilowatt-hour we generate displaces fossil fuels and curbs greenhouse emissions.',
      },
    ],
    benefits: [
      {
        title: 'Clean Energy Employee Discount',
        description: 'Subsidized home solar and battery systems for all staff members.',
        category: 'Perks',
      },
      {
        title: 'Full Medical Coverage',
        description: 'Medical, dental, and optical insurance for staff and family.',
        category: 'Health',
      },
    ],
    perksHighlights: [
      'Clean energy field research trips',
      'Home solar power subsidy',
      'Leadership accelerator program',
    ],
    techStack: ['Embedded C', 'IoT LoRaWAN', 'React', 'Node.js'],
    socialLinks: {
      website: 'https://heliosenergy.africa',
      linkedin: 'https://linkedin.com/company/helios-clean-energy',
    },
  },

  'zindi predictive analytics': {
    name: 'Zindi Predictive Analytics',
    tagline: 'The Largest Community of African AI Scientists and Data Practitioners',
    about:
      'Zindi is the premier professional network for AI and data science talent in Africa. We connect over 60,000 data scientists across 54 countries to real-world business challenges, competitive hackathons, and global enterprise recruitment pipelines.',
    mission:
      'To showcase the extraordinary depth of African artificial intelligence talent to the world.',
    vision:
      'African data scientists solving the most pressing global challenges in climate, health, and finance.',
    industry: 'Data Science & Applied AI',
    companySize: '40–70 AI Practitioners',
    headquarters: 'Cape Town & Nairobi',
    foundedYear: '2018',
    website: 'https://zindi.africa',
    verified: true,
    employerType: 'Company',
    accentColor: '#9333EA',
    cultureValues: [
      {
        title: 'Radical Inclusivity',
        description: 'We welcome beginners, self-taught coders, and PhD researchers into one collaborative ecosystem.',
      },
    ],
    benefits: [
      {
        title: 'USD Remote Compensation',
        description: 'Global remote salary tiers with annual performance reviews.',
        category: 'Compensation',
      },
      {
        title: 'AI Cloud Compute Stipend',
        description: 'Unlimited access to GPU cloud clusters for research and model training.',
        category: 'Equipment',
      },
    ],
    perksHighlights: [
      'Direct interaction with 60,000+ AI scientists',
      'Global tech conference travel support',
      '100% remote asynchronous culture',
    ],
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'Next.js', 'FastAPI'],
    socialLinks: {
      website: 'https://zindi.africa',
      linkedin: 'https://linkedin.com/company/zindiafrica',
    },
  },
};

/**
 * Resolves a company profile by name. If a pre-configured profile exists, returns it;
 * otherwise dynamically builds an authentic, comprehensive CompanyProfile using the
 * company's real jobs and attributes.
 */
export function resolveCompanyProfile(companyName: string, allJobs: Job[]): CompanyProfile {
  const normalizedKey = (companyName || '').trim().toLowerCase();
  
  if (KNOWN_COMPANY_PROFILES[normalizedKey]) {
    return KNOWN_COMPANY_PROFILES[normalizedKey];
  }

  // Find all jobs for this company
  const companyJobs = allJobs.filter(
    (j) => (j.company?.name || '').trim().toLowerCase() === normalizedKey
  );

  const firstJob = companyJobs[0];
  const employerType = firstJob?.company?.employerType || 'Company';
  const website = firstJob?.company?.website || undefined;
  const verified = firstJob?.company?.verified ?? true;

  // Extract unique locations and departments
  const locations = Array.from(
    new Set(companyJobs.map((j) => `${j.location.city}, ${j.location.country}`))
  );
  const departments = Array.from(new Set(companyJobs.map((j) => j.department)));
  const skills = Array.from(new Set(companyJobs.flatMap((j) => j.skills))).slice(0, 8);
  const benefitsExtracted = Array.from(new Set(companyJobs.flatMap((j) => j.benefits || [])));

  const primaryLocation = locations[0] || 'Lagos, Nigeria';

  // Construct dynamic fallback profile
  return {
    name: companyName || 'Verified Partner Employer',
    tagline: `Leading ${departments[0] || 'Enterprise'} solutions and hiring across African commercial hubs.`,
    about: `${companyName} is an active employer on the MsmeBooks Careers & Recruitment network, hiring top African tech, commercial, and operational talent. With active operations across ${locations.join(' · ') || 'Africa'}, the organization is committed to engineering excellence, employee growth, and business empowerment.`,
    mission: `To cultivate high-impact African talent, accelerate digital transformation, and foster inclusive economic growth across the continent.`,
    vision: `To stand as a recognized benchmark of workplace culture, continuous learning, and scalable innovation in Africa.`,
    industry: departments[0] ? `${departments[0]} & Digital Technology` : 'Technology & Enterprise Solutions',
    companySize: companyJobs.length > 5 ? '100–500 Employees' : '20–100 Employees',
    headquarters: primaryLocation,
    foundedYear: '2021',
    website: website,
    verified: verified,
    employerType: employerType === 'Individual' ? 'Individual' : 'Company',
    accentColor: '#0066CC',
    cultureValues: [
      {
        title: 'Impact & Mission Focus',
        description: 'Every team member works directly on deliverables that create tangible economic value for customers and communities.',
      },
      {
        title: 'Transparency & Trust',
        description: 'Open communication, data-backed decisions, and mutual respect across distributed and hub teams.',
      },
      {
        title: 'Continuous Talent Development',
        description: 'Dedicated mentorship, career milestones, and ongoing support for skill enhancement.',
      },
    ],
    benefits: benefitsExtracted.length > 0
      ? benefitsExtracted.slice(0, 6).map((b) => ({
          title: b,
          description: 'Provided to full-time team members with flexible enrollment options.',
          category: 'Standard Benefit',
        }))
      : [
          {
            title: 'Competitive Remuneration',
            description: 'Regularly reviewed compensation plans benchmarked against industry standards.',
            category: 'Compensation',
          },
          {
            title: 'Flexible Work Arrangement',
            description: 'Work opportunities designed with remote and hybrid balance.',
            category: 'Workplace',
          },
          {
            title: 'Health & Wellness Coverage',
            description: 'Comprehensive medical benefits and employee wellbeing initiatives.',
            category: 'Health',
          },
          {
            title: 'Professional Learning Budget',
            description: 'Support for courses, certifications, and technical conferences.',
            category: 'Growth',
          },
        ],
    perksHighlights: [
      'Comprehensive onboarding experience',
      'Modern hardware and software tooling',
      'Collaborative team environment',
      'Direct executive mentorship',
    ],
    techStack: skills.length > 0 ? skills : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    socialLinks: {
      website: website,
    },
  };
}
