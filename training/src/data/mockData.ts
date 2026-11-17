import { Course, LearningPath, CertificateRecord, LiveWebinarSession, PartnerTier, CorporateDepartment, CategoryItem, AppNotification, TrainingBundle, ActivityPost, AssessmentQuestion, LiveChatMessage } from '../types';

export const COURSES: Course[] = [
  {
    id: 'course-1',
    slug: 'msmebooks-accounting-financial-management',
    title: 'Mastering MsmeBooks Cloud Accounting & Multi-Currency Ledger',
    tagline: 'Practical financial accounting, VAT compliance, automated bank reconciliation, and cash flow forecasting.',
    description: 'Learn end-to-end small business accounting using MsmeBooks. Set up chart of accounts, post journal entries, generate P&L, balance sheets, and automate tax schedules for Nigerian and African businesses.',
    category: 'Accounting & Financial Management',
    sector: 'Core SaaS Operations',
    level: 'Beginner',
    durationHours: 12,
    modulesCount: 5,
    lessonsCount: 22,
    language: 'English',
    priceNgn: 35000,
    isFree: false,
    rating: 4.9,
    ratingCount: 342,
    enrollmentCount: 2840,
    certificateEligible: true,
    thumbnail: '/src/assets/images/course_accounting_pos_1793446483397.jpg',
    instructor: {
      id: 'inst-1',
      name: 'Dr. Folashade Adeyemi, FCA',
      title: 'Principal Accounting Consultant & MsmeBooks Master Trainer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Chartered Accountant with 15+ years advising micro and SME businesses across Lagos and West Africa.',
      verified: true,
      totalStudents: 8400,
      rating: 4.95,
    },
    learningObjectives: [
      'Design and configure a structured Chart of Accounts tailored for retail, service, or manufacturing',
      'Process accounts receivable, customer invoices, and automated credit limits',
      'Manage supplier bills, accounts payable, and withholding tax (WHT) deductions',
      'Execute bank reconciliation using automated bank feeds and statement imports',
      'Export audit-ready financial statements (P&L, Balance Sheet, Trial Balance, Cashflow)'
    ],
    targetAudience: [
      'Business owners who want accurate financial visibility',
      'In-house bookkeepers and accounting clerks',
      'Practicing chartered accountants modernizing client services'
    ],
    prerequisites: [
      'Basic understanding of debit and credit bookkeeping',
      'Computer with internet browser access'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Company Profile & Chart of Accounts Setup',
        lessons: [
          {
            id: 'les-101',
            title: '1.1 System Navigation & Organization Settings',
            durationMinutes: 18,
            type: 'video',
            transcript: 'Welcome to MsmeBooks Academy. In this lesson, we will configure your company base currency (NGN, GHS, KES, USD), fiscal year start dates, and VAT registration number. Navigate to Settings > Company Profile...',
            isCompleted: true,
            downloadableResource: {
              name: 'MsmeBooks_CoA_Template_2026.xlsx',
              size: '142 KB',
              type: 'Excel'
            }
          },
          {
            id: 'les-102',
            title: '1.2 Customizing Assets, Liabilities, Equity & Expense Codes',
            durationMinutes: 24,
            type: 'interactive-demo',
            transcript: 'Now let us structure your numbering scheme. Assets starting with 1000, Liabilities with 2000, Equity with 3000, Revenue with 4000, and Operating Expenses with 5000...',
            isCompleted: true,
          },
          {
            id: 'les-103',
            title: '1.3 Hands-On Knowledge Check: CoA Mapping',
            durationMinutes: 15,
            type: 'quiz',
            quiz: [
              {
                id: 'q-1',
                question: 'When creating an account for Accumulated Depreciation, under which account classification does it belong in MsmeBooks?',
                options: [
                  'Current Liability',
                  'Contra-Asset under Non-Current Assets',
                  'Operating Expense',
                  'Direct Cost of Sales'
                ],
                correctAnswer: 1,
                explanation: 'Accumulated Depreciation is a contra-asset account with a credit balance that offsets the gross value of fixed assets.'
              },
              {
                id: 'q-2',
                question: 'In MsmeBooks, what occurs automatically when you post a customer invoice with 7.5% VAT applied?',
                options: [
                  'Accounts Receivable is debited, Sales Revenue credited, and VAT Payable credited',
                  'Cash is debited immediately and VAT expense is created',
                  'Only Sales Revenue is recorded until cash is physically paid',
                  'The system prompts for manual general journal entry'
                ],
                correctAnswer: 0,
                explanation: 'MsmeBooks follows double-entry principles: Debits Accounts Receivable for the total gross invoice, Credits Sales for net revenue, and Credits VAT Output Payable.'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Receivables, Invoicing & Debt Recovery',
        lessons: [
          {
            id: 'les-201',
            title: '2.1 Creating Custom Quotes, Proforma & Tax Invoices',
            durationMinutes: 28,
            type: 'video',
            transcript: 'Learn how to generate professional invoices with your business logo, payment QR code, bank transfer details, and payment due dates...',
            isCompleted: false,
          },
          {
            id: 'les-202',
            title: '2.2 Automating Payment Reminders & WhatsApp Invoicing',
            durationMinutes: 20,
            type: 'interactive-demo',
            transcript: 'Set up automatic email and WhatsApp notifications at 3 days before due date, on due date, and 7 days overdue to improve cash collection...',
            isCompleted: false,
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Supplier Payables & Withholding Tax (WHT)',
        lessons: [
          {
            id: 'les-301',
            title: '3.1 Purchase Orders, Good Received Notes (GRN) & Vendor Bills',
            durationMinutes: 22,
            type: 'video',
            isCompleted: false,
          },
          {
            id: 'les-302',
            title: '3.2 Deducting and Remitting 5% / 10% Withholding Tax',
            durationMinutes: 25,
            type: 'video',
            isCompleted: false,
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Automated Bank Reconciliation & Cash Flow',
        lessons: [
          {
            id: 'les-401',
            title: '4.1 Connecting Bank Statement CSVs & Rule Engines',
            durationMinutes: 30,
            type: 'video',
            isCompleted: false,
          }
        ]
      },
      {
        id: 'mod-5',
        title: 'Module 5: Management Reporting & Certification Exam',
        lessons: [
          {
            id: 'les-501',
            title: '5.1 Generating Multi-Department P&L and Balance Sheets',
            durationMinutes: 35,
            type: 'document',
            isCompleted: false,
          },
          {
            id: 'les-502',
            title: '5.2 Final Certification Comprehensive Assessment',
            durationMinutes: 45,
            type: 'quiz',
            isCompleted: false,
            quiz: [
              {
                id: 'final-q1',
                question: 'Which report in MsmeBooks should an accountant review first to identify uncredited customer deposits during bank reconciliation?',
                options: [
                  'Bank Reconciliation Variance Report',
                  'General Ledger Audit Trail',
                  'Profit & Loss Statement',
                  'Aged Payables Summary'
                ],
                correctAnswer: 0,
                explanation: 'The Bank Reconciliation Variance report highlights all uncleared deposits and outstanding cheques.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    slug: 'pos-cashier-branch-operations',
    title: 'High-Volume Point of Sale (POS) & Multi-Branch Operations',
    tagline: 'Barcode scanning, offline sales resilience, shift reconciliation, cashier fraud prevention, and receipt customization.',
    description: 'Master fast-paced retail and supermarket cashiering on MsmeBooks POS. Learn shift opening/closing, card terminal integrations, multi-branch inventory sync, split payments, and end-of-day Z-reports.',
    category: 'Point of Sale (POS) Operations',
    sector: 'Core SaaS Operations',
    level: 'Beginner',
    durationHours: 8,
    modulesCount: 4,
    lessonsCount: 16,
    language: 'English',
    priceNgn: 25000,
    isFree: false,
    rating: 4.88,
    ratingCount: 512,
    enrollmentCount: 3910,
    certificateEligible: true,
    thumbnail: '/src/assets/images/course_accounting_pos_1793446483397.jpg',
    instructor: {
      id: 'inst-2',
      name: 'Emeka Okafor',
      title: 'Head of Retail Systems & POS Implementation, MsmeBooks',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Implemented modern POS systems across 200+ supermarkets, pharmacies, and fashion retailers in Nigeria and Ghana.',
      verified: true,
      totalStudents: 6200,
      rating: 4.9,
    },
    learningObjectives: [
      'Perform rapid product barcode lookups and touchscreen category navigation',
      'Manage multiple payment modes: Cash, Card (POS Terminal), Bank Transfer, Credit/Loyalty points',
      'Execute mid-shift cash drops, petty cash payouts, and cashier drawer counts',
      'Close daily shifts and print verified X and Z financial reports',
      'Operate in offline mode during network outages with automated cloud sync'
    ],
    targetAudience: [
      'Cashiers, store managers, and retail supervisors',
      'Pharmacy, grocery, and boutique store operators',
      'POS hardware technicians and field support engineers'
    ],
    prerequisites: ['Basic computer or tablet handling'],
    modules: [
      {
        id: 'pos-mod-1',
        title: 'Module 1: POS Hardware & Terminal Setup',
        lessons: [
          {
            id: 'pos-les-1',
            title: '1.1 Connecting Thermal Receipt Printers & Barcode Scanners',
            durationMinutes: 15,
            type: 'video',
            isCompleted: false,
          },
          {
            id: 'pos-les-2',
            title: '1.2 Cashier User Permissions and PIN Login Protocol',
            durationMinutes: 12,
            type: 'video',
            isCompleted: false,
          }
        ]
      },
      {
        id: 'pos-mod-2',
        title: 'Module 2: Core Sales Transactions & Payment Splitting',
        lessons: [
          {
            id: 'pos-les-3',
            title: '2.1 Barcode Scanning, Manual Discounts & Price Checks',
            durationMinutes: 20,
            type: 'interactive-demo',
            isCompleted: false,
          },
          {
            id: 'pos-les-4',
            title: '2.2 Processing Split Cash + Transfer Payments',
            durationMinutes: 18,
            type: 'video',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    slug: 'inventory-warehouse-multi-location',
    title: 'Inventory & Warehouse Management: Stock Control & Valuation',
    tagline: 'Batch tracking, FIFO valuation, reorder thresholds, inter-warehouse transfers, and shrinkage mitigation.',
    description: 'Transform disorganized stock into an automated, highly profitable inventory engine. Master low-stock alerts, purchase receiving, supplier returns, physical stock counts, and reconciliation.',
    category: 'Inventory & Warehouse Management',
    sector: 'Core SaaS Operations',
    level: 'Intermediate',
    durationHours: 10,
    modulesCount: 4,
    lessonsCount: 18,
    language: 'English',
    priceNgn: 30000,
    isFree: false,
    rating: 4.92,
    ratingCount: 289,
    enrollmentCount: 2150,
    certificateEligible: true,
    thumbnail: '/src/assets/images/course_inventory_warehouse_1793446484901.jpg',
    instructor: {
      id: 'inst-3',
      name: 'Ibrahim Al-Hassan',
      title: 'Supply Chain Specialist & Warehouse Automation Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Over 12 years managing FMCG and pharmaceutical warehouses across West and East Africa.',
      verified: true,
      totalStudents: 4900,
      rating: 4.88,
    },
    learningObjectives: [
      'Create products with variants (size, color, pack size) and barcode SKUs',
      'Implement automated minimum reorder levels and safety stock calculations',
      'Execute multi-branch stock transfers with Goods-In-Transit tracking',
      'Conduct blind physical stock counts and post variance adjustments in MsmeBooks',
      'Calculate Cost of Goods Sold (COGS) accurately under FIFO'
    ],
    targetAudience: [
      'Warehouse supervisors, procurement officers, and inventory controllers',
      'Wholesale distributors and importers',
      'E-commerce fulfillment managers'
    ],
    prerequisites: ['Basic spreadsheet familiarity'],
    modules: [
      {
        id: 'inv-mod-1',
        title: 'Module 1: Product Master Data & Categorization',
        lessons: [
          {
            id: 'inv-les-1',
            title: '1.1 Setting up SKUs, Barcodes, and Unit of Measures (UoM)',
            durationMinutes: 20,
            type: 'video',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    slug: 'hotel-hospitality-pms-operations',
    title: 'Hotel Property Management (PMS) & Restaurant Guest Folio',
    tagline: 'Room reservations, guest check-in/out, restaurant table billing, night audit, and revenue analytics.',
    description: 'Learn complete operational management for boutique hotels, guest houses, serviced apartments, and resorts. Seamlessly link front desk check-in with restaurant billing and housekeeping status in MsmeBooks.',
    category: 'Hotel Property Management (PMS)',
    sector: 'Private Sector',
    level: 'Intermediate',
    durationHours: 14,
    modulesCount: 6,
    lessonsCount: 26,
    language: 'English',
    priceNgn: 45000,
    isFree: false,
    rating: 4.95,
    ratingCount: 198,
    enrollmentCount: 1480,
    certificateEligible: true,
    thumbnail: '/src/assets/images/course_hospitality_hotel_1793446484792.jpg',
    instructor: {
      id: 'inst-4',
      name: 'Amara Nwosu',
      title: 'Hospitality Tech Consultant & Former Resort General Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Hospitality management expert consulting for premier hotel brands and boutique lodges across East and West Africa.',
      verified: true,
      totalStudents: 3100,
      rating: 4.96,
    },
    learningObjectives: [
      'Configure hotel room types, seasonal rates, meal plans, and extra bed policies',
      'Process guest reservations from walk-ins, phone bookings, and OTA channels',
      'Manage front desk check-in, key card issuance, and guest identification capture',
      'Post restaurant and bar charges directly to guest room folios with pin verification',
      'Run seamless midnight audit, RevPAR, and occupancy revenue reports'
    ],
    targetAudience: [
      'Hotel front desk managers, reservationists, and night auditors',
      'Boutique hotel and serviced apartment owners',
      'Hospitality accountants and food & beverage managers'
    ],
    prerequisites: ['Basic customer service or hospitality background'],
    modules: [
      {
        id: 'pms-mod-1',
        title: 'Module 1: Hotel Room Inventory & Tariff Setup',
        lessons: [
          {
            id: 'pms-les-1',
            title: '1.1 Room Numbers, Floor Plans, and Housekeeping Codes',
            durationMinutes: 22,
            type: 'video',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    slug: 'msmebooks-starter-free-overview',
    title: 'MsmeBooks Fundamentals: Free Quick-Start SaaS Training',
    tagline: 'A fast, comprehensive tour of invoicing, customer records, daily sales tracking, and reporting.',
    description: 'Jumpstart your digital management journey with MsmeBooks. Learn the interface, create your first official invoice, add products, and view your daily profit in under 90 minutes.',
    category: 'Entrepreneurship & SME Growth',
    sector: 'Core SaaS Operations',
    level: 'Beginner',
    durationHours: 2,
    modulesCount: 3,
    lessonsCount: 8,
    language: 'English',
    priceNgn: 0,
    isFree: true,
    rating: 4.97,
    ratingCount: 1240,
    enrollmentCount: 9400,
    certificateEligible: true,
    thumbnail: '/src/assets/images/hero_academy_training_1793446483834.jpg',
    instructor: {
      id: 'inst-1',
      name: 'Dr. Folashade Adeyemi, FCA',
      title: 'Principal Accounting Consultant & MsmeBooks Master Trainer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Chartered Accountant with 15+ years advising micro and SME businesses.',
      verified: true,
      totalStudents: 8400,
      rating: 4.95,
    },
    learningObjectives: [
      'Set up your company workspace and upload logo',
      'Send your first branded invoice via PDF and WhatsApp link',
      'Record an expense and capture receipt image',
      'Understand your business cash position on the executive dashboard'
    ],
    targetAudience: ['Solopreneurs, small shop owners, and freelance consultants'],
    prerequisites: ['None! 100% free for all SME operators.'],
    modules: [
      {
        id: 'free-mod-1',
        title: 'Module 1: Workspace Setup & Invoicing',
        lessons: [
          {
            id: 'free-les-1',
            title: '1.1 Welcome & Workspace Configuration',
            durationMinutes: 10,
            type: 'video',
            isCompleted: true,
          },
          {
            id: 'free-les-2',
            title: '1.2 Generating Your First Customer Invoice',
            durationMinutes: 14,
            type: 'interactive-demo',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    slug: 'partner-implementation-reseller-specialist',
    title: 'MsmeBooks Certified Implementation Partner & Reseller Bootcamp',
    tagline: 'Client onboarding, historical data migration, staff training, custom chart of accounts, and earning up to 40% recurring commissions.',
    description: 'Designed exclusively for consulting accountants, IT firms, and POS technicians who want to deploy MsmeBooks for paying clients. Learn change management, pricing proposals, and client retention.',
    category: 'Partner & Reseller Certification',
    sector: 'Core SaaS Operations',
    level: 'Advanced',
    durationHours: 16,
    modulesCount: 6,
    lessonsCount: 30,
    language: 'English',
    priceNgn: 65000,
    isFree: false,
    rating: 4.98,
    ratingCount: 164,
    enrollmentCount: 920,
    certificateEligible: true,
    thumbnail: '/src/assets/images/hero_academy_training_1793446483834.jpg',
    instructor: {
      id: 'inst-5',
      name: 'Babajide Williams',
      title: 'Director of Strategic Partnerships & Alliances, MsmeBooks',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Leading partner enablement and certification across 14 African nations.',
      verified: true,
      totalStudents: 2200,
      rating: 4.98,
    },
    learningObjectives: [
      'Migrate client historical data from Excel, QuickBooks, or Sage into MsmeBooks',
      'Train client operational staff (cashiers, inventory keepers, accountants)',
      'Earn Bronze, Silver, Gold, or Platinum partner status with 15% to 40% recurring commissions',
      'Deliver audit-ready Go-Live sign-off documentation'
    ],
    targetAudience: ['Accounting practitioners, business consultants, SaaS resellers, POS service providers'],
    prerequisites: ['Completion of Accounting & POS foundation courses'],
    modules: [
      {
        id: 'part-mod-1',
        title: 'Module 1: Partner Ecosystem & Commission Economics',
        lessons: [
          {
            id: 'part-les-1',
            title: '1.1 Partner Tiers (Bronze, Silver, Gold, Platinum) & Revenue Share',
            durationMinutes: 25,
            type: 'video',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-7',
    slug: 'public-sector-ipsas-accounting-mda-governance',
    title: 'Public Sector IPSAS Accounting & MDA Financial Governance',
    tagline: 'Accrual IPSAS transition, Treasury Single Account (TSA) reconciliations, and budget execution for ministries, departments, and state agencies.',
    description: 'Specialized for government accountants, auditor-general staff, and municipal finance directors. Learn chart of accounts mapping to National Chart of Accounts (NCOA), vote bookkeeping, TSA ledger management, and donor-fund disclosure standards.',
    category: 'Public Sector Accounting & IPSAS Standards',
    sector: 'Government & Public Sector',
    level: 'Intermediate',
    durationHours: 16,
    modulesCount: 4,
    lessonsCount: 18,
    language: 'English',
    priceNgn: 45000,
    isFree: false,
    rating: 4.93,
    ratingCount: 188,
    enrollmentCount: 1420,
    certificateEligible: true,
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    instructor: {
      id: 'inst-7',
      name: 'Hon. Aliyu Garba, CNA, ACTI',
      title: 'Former Director of Treasury & Public Financial Management Advisor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Fellow of ANAN with 20+ years implementing accrual IPSAS across federal and sub-national governments.',
      verified: true,
      totalStudents: 3100,
      rating: 4.94,
    },
    learningObjectives: [
      'Map National Chart of Accounts (NCOA) to MsmeBooks Public Sector edition',
      'Perform Treasury Single Account (TSA) multi-sub-account ledger reconciliations',
      'Manage vote books, encumbrances, and procurement commitment accounting',
      'Generate IPSAS-compliant Cash Flow, Financial Performance, and Budget Comparison Statements'
    ],
    targetAudience: [
      'MDA directors of finance & accounts, municipal treasurers, civil service auditors',
      'Government revenue and budget planning officers',
      'Public sector accounting consultants'
    ],
    prerequisites: ['Foundational public finance or government accounting experience'],
    modules: [
      {
        id: 'ipsas-mod-1',
        title: 'Module 1: Accrual IPSAS Architecture & Chart of Accounts',
        lessons: [
          {
            id: 'ipsas-les-1',
            title: '1.1 IPSAS Accrual Standard Framework & Multi-Fund Accounting',
            durationMinutes: 28,
            type: 'video',
            transcript: 'Welcome to Public Sector Financial Governance on MsmeBooks. In this lesson we review how to configure General Fund, Capital Project Funds, and Special Revenue Funds under IPSAS Accrual principles...',
            isCompleted: true,
          },
          {
            id: 'ipsas-les-2',
            title: '1.2 Treasury Single Account (TSA) Daily Remittance Balancing',
            durationMinutes: 32,
            type: 'interactive-demo',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-8',
    slug: 'commercial-agriculture-farm-management',
    title: 'Commercial Agriculture & Farm Management: Harvest Costing & Silos',
    tagline: 'Biological asset accounting (IAS 41), livestock feed-mill batching, outgrower schemes, and farm warehouse inventory.',
    description: 'Designed for commercial farm managers, poultry operators, palm oil processors, and agribusiness accountants. Track pre-harvest input costs, mortality and yield variance, grain silo valuation, and agricultural export documentation.',
    category: 'Agriculture, Agribusiness & Farm Operations',
    sector: 'Private Sector',
    level: 'Beginner',
    durationHours: 14,
    modulesCount: 4,
    lessonsCount: 16,
    language: 'English',
    priceNgn: 30000,
    isFree: false,
    rating: 4.88,
    ratingCount: 215,
    enrollmentCount: 1890,
    certificateEligible: true,
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    instructor: {
      id: 'inst-8',
      name: 'Engr. Emeka Okafor',
      title: 'Managing Director, GreenPlains Agro-Allied & AgTech Consultant',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Agribusiness operator managing 650 hectares and training over 2,000 farm managers across West Africa.',
      verified: true,
      totalStudents: 2750,
      rating: 4.91,
    },
    learningObjectives: [
      'Account for biological assets (crops, poultry, livestock) under IAS 41 fair value standards',
      'Track seed, fertilizer, pesticide, and labor inputs per farm section or hectare',
      'Calculate feed conversion ratios (FCR) and mill production run batch costs',
      'Manage harvest intake, grain silo drying loss, and bulk commodity dispatch'
    ],
    targetAudience: [
      'Commercial farm owners, estate plantation managers, poultry/fish farm operators',
      'Agricultural cooperative financial secretaries and agro-processors'
    ],
    prerequisites: ['Basic farm operations or bookkeeping familiarity'],
    modules: [
      {
        id: 'agro-mod-1',
        title: 'Module 1: Biological Asset Valuation & Sectional Cost Centers',
        lessons: [
          {
            id: 'agro-les-1',
            title: '1.1 Setting Up Field Plots, Crop Cycles & Sectional Cost Centers',
            durationMinutes: 24,
            type: 'video',
            transcript: 'In this module, learn how to split farm operations into crop and livestock cost centers, assigning field inputs, tractor fuel, and irrigation costs accurately...',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-9',
    slug: 'manufacturing-factory-costing-bom',
    title: 'Manufacturing, Factory Costing & Bill of Materials (BOM) Control',
    tagline: 'Standard costing, WIP tracking, scrap variance, multi-stage assembly, and automated factory floor requisition.',
    description: 'Built for plant controllers, industrial accountants, and factory managers. Set up multi-level bills of materials, track direct labor, machine overhead absorption, packaging materials, and finished goods inventory.',
    category: 'Manufacturing, Factory Costing & BOM',
    sector: 'Private Sector',
    level: 'Advanced',
    durationHours: 18,
    modulesCount: 5,
    lessonsCount: 24,
    language: 'English',
    priceNgn: 42000,
    isFree: false,
    rating: 4.96,
    ratingCount: 172,
    enrollmentCount: 1150,
    certificateEligible: true,
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    instructor: {
      id: 'inst-9',
      name: 'Engr. Tariere Briggs',
      title: 'Lean Operations & Industrial Costing Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Former plant accounting lead at multinational FMCG with deep expertise in ERP bill-of-materials and work-in-progress optimization.',
      verified: true,
      totalStudents: 1980,
      rating: 4.97,
    },
    learningObjectives: [
      'Build multi-level Bill of Materials (BOM) with raw materials and secondary packaging',
      'Compute standard costs and calculate monthly material price and quantity variances',
      'Record factory floor work orders, machine run hours, and labor absorption',
      'Track scrap, rework, and finished batch quality inspection releases'
    ],
    targetAudience: [
      'Factory production accountants, industrial managers, manufacturing entrepreneurs'
    ],
    prerequisites: ['Prior intermediate accounting or plant operations experience'],
    modules: [
      {
        id: 'mfg-mod-1',
        title: 'Module 1: Bill of Materials & Production Run Architecture',
        lessons: [
          {
            id: 'mfg-les-1',
            title: '1.1 Configuring Multi-Level BOMs & Component Substitution',
            durationMinutes: 30,
            type: 'video',
            isCompleted: false,
          }
        ]
      }
    ]
  },
  {
    id: 'course-10',
    slug: 'government-revenue-igr-tax-collection',
    title: 'State & Municipal Internally Generated Revenue (IGR) & Electronic Billing',
    tagline: 'State internal revenue service (SIRS) automation, land charges, market levies, and real-time bank settlement reconciliation.',
    description: 'Empower state revenue boards and local government councils to eliminate revenue leakage. Learn digital taxpayer identification number (TIN) lookup, electronic billing, POS tax collectors, and automated settlement splits.',
    category: 'Government Revenue, IGR & Tax Collection',
    sector: 'Government & Public Sector',
    level: 'Beginner',
    durationHours: 10,
    modulesCount: 3,
    lessonsCount: 14,
    language: 'English',
    priceNgn: 38000,
    isFree: false,
    rating: 4.91,
    ratingCount: 140,
    enrollmentCount: 960,
    certificateEligible: true,
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    instructor: {
      id: 'inst-10',
      name: 'Barrister Nkiru Onyema, FCTI',
      title: 'Senior Revenue Consultant & Tax Law Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Advises sub-national revenue agencies on digital tax compliance and municipal assessment frameworks.',
      verified: true,
      totalStudents: 1650,
      rating: 4.93,
    },
    learningObjectives: [
      'Deploy automated assessment notices for property rates, trade permits, and signage fees',
      'Integrate POS mobile devices for park and market daily levy revenue collectors',
      'Reconcile multi-bank collection accounts against the central state revenue ledger',
      'Monitor revenue collection leakages via live geospatial analytics maps'
    ],
    targetAudience: [
      'State Internal Revenue Service (SIRS) administrators, municipal treasurers, enforcement agents'
    ],
    prerequisites: ['Basic revenue collection or administrative background'],
    modules: [
      {
        id: 'igr-mod-1',
        title: 'Module 1: Modern IGR Automation & Payer Registry',
        lessons: [
          {
            id: 'igr-les-1',
            title: '1.1 Taxpayer Profiling, Harmonized Billing & Assessment Codes',
            durationMinutes: 20,
            type: 'video',
            isCompleted: false,
          }
        ]
      }
    ]
  }
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-1',
    slug: 'certified-msmebooks-bookkeeper',
    title: 'Certified MsmeBooks Bookkeeper',
    targetRole: 'In-house Bookkeeper / Junior Accountant',
    description: 'End-to-end mastery of bookkeeping: from setting up ledger accounts, posting invoices and bills, to monthly bank reconciliations and trial balance verification.',
    coursesCount: 3,
    durationHours: 24,
    badge: 'Certified Bookkeeper',
    courses: ['course-1', 'course-5', 'course-3'],
    examRequirements: 'Score ≥ 80% on 50-question comprehensive exam + submit completed sandbox reconciliation',
    certificationTitle: 'MsmeBooks Certified Professional Bookkeeper (MCPB)'
  },
  {
    id: 'path-2',
    slug: 'certified-pos-operator',
    title: 'Certified Point of Sale (POS) Operator',
    targetRole: 'Store Cashier / Retail Supervisor',
    description: 'Accelerated program on lightning-fast customer checkout, multi-terminal sync, split tender, end-of-day cash drawer balancing, and fraud prevention.',
    coursesCount: 2,
    durationHours: 12,
    badge: 'Certified POS Specialist',
    courses: ['course-2', 'course-5'],
    examRequirements: 'Complete timed checkout speed test (sub-45s) and pass drawer reconciliation test',
    certificationTitle: 'MsmeBooks Certified POS Operator (MCPO)'
  },
  {
    id: 'path-3',
    slug: 'certified-inventory-manager',
    title: 'Certified Inventory & Warehouse Specialist',
    targetRole: 'Warehouse Manager / Stock Controller',
    description: 'Comprehensive control over stock valuation, reorder automation, inter-branch transfers, batch expiry tracking, and physical audit reconciliation.',
    coursesCount: 3,
    durationHours: 20,
    badge: 'Certified Inventory Specialist',
    courses: ['course-3', 'course-1', 'course-5'],
    examRequirements: 'Resolve a simulated 100-item stock discrepancy scenario in the sandbox environment',
    certificationTitle: 'MsmeBooks Certified Inventory Specialist (MCIS)'
  },
  {
    id: 'path-4',
    slug: 'certified-hospitality-operator',
    title: 'Certified Hospitality Management Operator',
    targetRole: 'Hotel Front Office Manager / Food & Beverage Lead',
    description: 'Mastery of property management systems: guest reservations, folio accounting, restaurant table POS, room tariffs, and night audits.',
    coursesCount: 3,
    durationHours: 22,
    badge: 'Certified Hospitality Pro',
    courses: ['course-4', 'course-2', 'course-5'],
    examRequirements: 'Complete end-of-day night audit simulation and pass 40-question hotel PMS assessment',
    certificationTitle: 'MsmeBooks Certified Hospitality Professional (MCHP)'
  },
  {
    id: 'path-5',
    slug: 'certified-implementation-specialist',
    title: 'Certified Implementation Specialist & Partner',
    targetRole: 'Implementation Consultant / IT Reseller',
    description: 'Accreditation for external partners deploying MsmeBooks for SMEs: data migration, change management, staff training, and recurring client retention.',
    coursesCount: 4,
    durationHours: 32,
    badge: 'Accredited Partner Specialist',
    courses: ['course-6', 'course-1', 'course-2', 'course-3'],
    examRequirements: 'Submit verified client deployment case study + 85% pass mark on Partner Exam',
    certificationTitle: 'MsmeBooks Certified Implementation Partner (MCIP)'
  }
];

export const CERTIFICATES_DATABASE: CertificateRecord[] = [
  {
    certificateId: 'MSME-CERT-2026-90412',
    studentName: 'Chiamaka Ngozi Eze',
    studentEmail: 'chiamaka.eze@danielsconsult.com',
    courseTitle: 'Mastering MsmeBooks Cloud Accounting & Multi-Currency Ledger',
    credentialType: 'Professional Practitioner Certification',
    issueDate: 'October 14, 2026',
    expiryDate: 'October 14, 2028',
    scorePercentage: 96,
    instructorName: 'Dr. Folashade Adeyemi, FCA',
    verificationUrl: 'https://www.msmebooks.org/academy/verify-certificate?id=MSME-CERT-2026-90412',
    status: 'valid',
    skillsValidated: [
      'Double-entry General Ledger',
      'Automated Bank Reconciliation',
      'Nigerian VAT & WHT Compliance',
      'Multi-currency Management',
      'Management Financial Reporting'
    ]
  },
  {
    certificateId: 'MSME-CERT-2026-88104',
    studentName: 'Tunde Olumide Balogun',
    studentEmail: 'tunde.balogun@lagosretail.ng',
    courseTitle: 'High-Volume Point of Sale (POS) & Multi-Branch Operations',
    credentialType: 'Certified Specialist Credential',
    issueDate: 'September 28, 2026',
    expiryDate: 'September 28, 2028',
    scorePercentage: 94,
    instructorName: 'Emeka Okafor',
    verificationUrl: 'https://www.msmebooks.org/academy/verify-certificate?id=MSME-CERT-2026-88104',
    status: 'valid',
    skillsValidated: [
      'Rapid Barcode Terminal Operations',
      'Shift Cash Drawer Reconciliation',
      'Multi-branch Offline Sync',
      'Split-tender Payment Processing'
    ]
  },
  {
    certificateId: 'MSME-CERT-2026-74291',
    studentName: 'Amina Kwamboka Mwangi',
    studentEmail: 'amina.mwangi@serenatours.co.ke',
    courseTitle: 'Hotel Property Management (PMS) & Restaurant Guest Folio',
    credentialType: 'Hospitality Management Credential',
    issueDate: 'August 19, 2026',
    expiryDate: 'August 19, 2028',
    scorePercentage: 98,
    instructorName: 'Amara Nwosu',
    verificationUrl: 'https://www.msmebooks.org/academy/verify-certificate?id=MSME-CERT-2026-74291',
    status: 'valid',
    skillsValidated: [
      'Front Desk Check-in & Folio Billing',
      'Restaurant POS Charging to Room',
      'Night Audit & RevPAR Reporting',
      'Housekeeping Real-Time Status'
    ]
  }
];

export const LIVE_WEBINARS: LiveWebinarSession[] = [
  {
    id: 'webinar-1',
    title: 'Live Masterclass: Year-End Tax Filing & MsmeBooks Closing Entries',
    courseReference: 'Mastering MsmeBooks Cloud Accounting',
    instructor: 'Dr. Folashade Adeyemi, FCA',
    instructorRole: 'Principal Tax Consultant',
    date: 'Thursday, November 12, 2026',
    time: '2:00 PM - 3:30 PM WAT (GMT+1)',
    duration: '90 Minutes',
    platform: 'Zoom',
    meetingUrl: 'https://zoom.us/j/msmebooks-tax-closing',
    capacity: 250,
    registeredCount: 218,
    status: 'upcoming',
    description: 'Step-by-step walkthrough of closing your nominal accounts, carrying forward balances, preparing FIRS/LIRS tax schedules, and locking previous accounting periods.'
  },
  {
    id: 'webinar-2',
    title: 'Multi-Branch Inventory Synchronization: Zero Discrepancy Workshop',
    courseReference: 'Inventory & Warehouse Management',
    instructor: 'Ibrahim Al-Hassan',
    instructorRole: 'Head of Warehouse Solutions',
    date: 'Tuesday, November 17, 2026',
    time: '11:00 AM - 12:30 PM WAT (GMT+1)',
    duration: '90 Minutes',
    platform: 'Microsoft Teams',
    meetingUrl: 'https://teams.microsoft.com/l/meetup/msmebooks-inventory',
    capacity: 200,
    registeredCount: 164,
    status: 'upcoming',
    description: 'Learn real-time goods-in-transit reconciliation across distant branches, mitigating theft during transfers, and automated threshold replenishment.'
  },
  {
    id: 'webinar-3',
    title: 'Partner Onboarding: How to Pitch and Implement MsmeBooks for Retailers',
    courseReference: 'Partner & Reseller Bootcamp',
    instructor: 'Babajide Williams',
    instructorRole: 'Director of Partnerships',
    date: 'Friday, November 20, 2026',
    time: '4:00 PM - 5:30 PM WAT (GMT+1)',
    duration: '90 Minutes',
    platform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/msme-partner-scale',
    capacity: 150,
    registeredCount: 132,
    status: 'upcoming',
    description: 'High-margin client proposals, hardware bundling strategies, customer onboarding templates, and unlocking Gold Tier 30% recurring commissions.'
  }
];

export const PARTNER_TIERS: PartnerTier[] = [
  {
    tier: 'Bronze',
    commissionRate: '15% Recurring',
    minCertifiedStaff: 1,
    description: 'For independent accountants, bookkeepers, and retail POS technicians starting client rollouts.',
    perks: [
      '15% commission on all referred software subscriptions',
      'Listing on MsmeBooks Certified Reseller Directory',
      'Free demo sandbox environment for client demonstrations',
      'Standard partner email and live chat support'
    ]
  },
  {
    tier: 'Silver',
    commissionRate: '20% Recurring',
    minCertifiedStaff: 2,
    description: 'For growing IT agencies, business consultants, and accounting firms with active client portfolios.',
    perks: [
      '20% commission on recurring monthly & annual plans',
      'Priority client migration assistance from MsmeBooks engineers',
      'Co-branded sales brochures and marketing collateral',
      'Quarterly product roadmap briefing'
    ]
  },
  {
    tier: 'Gold',
    commissionRate: '30% Recurring',
    minCertifiedStaff: 4,
    description: 'For established enterprise implementation firms and high-volume hardware POS distributors.',
    perks: [
      '30% recurring commission on all managed accounts',
      'Dedicated Partner Account Manager',
      'Direct client referral leads from MsmeBooks sales team',
      'VIP passes to annual African SME Business Summit'
    ]
  },
  {
    tier: 'Platinum',
    commissionRate: '40% Recurring',
    minCertifiedStaff: 6,
    description: 'Premier regional software distributors and national technology integration syndicates.',
    perks: [
      '40% maximum commission tier',
      'Custom API access and direct database integration tools',
      'Joint PR and press features across national media',
      'Executive round-table with MsmeBooks product leadership'
    ]
  }
];

export const CORPORATE_SAMPLE_DEPARTMENTS: CorporateDepartment[] = [
  {
    name: 'Finance & Accounting Operations',
    seatsTotal: 10,
    seatsAssigned: 8,
    completionRate: 85,
    employees: [
      { id: 'emp-1', name: 'Funmilayo Adeleke', email: 'f.adeleke@primelogistics.ng', course: 'Mastering MsmeBooks Cloud Accounting', progress: 100, status: 'Completed', lastActive: 'Today' },
      { id: 'emp-2', name: 'Obinna Eze', email: 'o.eze@primelogistics.ng', course: 'Mastering MsmeBooks Cloud Accounting', progress: 75, status: 'In Progress', lastActive: 'Yesterday' },
      { id: 'emp-3', name: 'Zainab Mohammed', email: 'z.mohammed@primelogistics.ng', course: 'Taxation & Financial Compliance', progress: 90, status: 'In Progress', lastActive: '2 days ago' }
    ]
  },
  {
    name: 'Retail Branches & Cashier Supervisors',
    seatsTotal: 15,
    seatsAssigned: 14,
    completionRate: 92,
    employees: [
      { id: 'emp-4', name: 'Kelechi Nwosu', email: 'k.nwosu@primelogistics.ng', course: 'High-Volume Point of Sale (POS)', progress: 100, status: 'Completed', lastActive: 'Today' },
      { id: 'emp-5', name: 'Abubakar Sani', email: 'a.sani@primelogistics.ng', course: 'High-Volume Point of Sale (POS)', progress: 100, status: 'Completed', lastActive: '3 days ago' },
      { id: 'emp-6', name: 'Blessing Udoh', email: 'b.udoh@primelogistics.ng', course: 'High-Volume Point of Sale (POS)', progress: 65, status: 'In Progress', lastActive: 'Today' }
    ]
  },
  {
    name: 'Central Warehouse & Logistics',
    seatsTotal: 8,
    seatsAssigned: 7,
    completionRate: 70,
    employees: [
      { id: 'emp-7', name: 'David Mensah', email: 'd.mensah@primelogistics.ng', course: 'Inventory & Warehouse Management', progress: 80, status: 'In Progress', lastActive: 'Yesterday' },
      { id: 'emp-8', name: 'Tosin Alabi', email: 't.alabi@primelogistics.ng', course: 'Inventory & Warehouse Management', progress: 45, status: 'In Progress', lastActive: '4 days ago' }
    ]
  }
];

export const CATEGORIES_LIST: CategoryItem[] = [
  // Government & Public Sector
  { 
    name: 'Public Sector Accounting & IPSAS Standards', 
    count: 8, 
    icon: 'Landmark', 
    sector: 'Government & Public Sector',
    description: 'Accrual IPSAS, TSA reconciliations, and MDA budget performance reporting.' 
  },
  { 
    name: 'Government Revenue, IGR & Tax Collection', 
    count: 10, 
    icon: 'Receipt', 
    sector: 'Government & Public Sector',
    description: 'State IGR automation, municipal rate billing, and direct bank settlement splits.' 
  },
  { 
    name: 'Public Procurement & Tender Compliance', 
    count: 6, 
    icon: 'FileCheck', 
    sector: 'Government & Public Sector',
    description: 'Public procurement acts, vendor pre-qualification, and milestone audit verification.' 
  },
  { 
    name: 'Government Hospitals & Public Healthcare Logistics', 
    count: 7, 
    icon: 'Stethoscope', 
    sector: 'Government & Public Sector',
    description: 'Dispensary drug control, NHIA capitation billing, and hospital patient folios.' 
  },
  { 
    name: 'State & Municipal Asset Management', 
    count: 5, 
    icon: 'Building', 
    sector: 'Government & Public Sector',
    description: 'Public infrastructure registers, GIS tagging, and fixed asset depreciation audits.' 
  },
  { 
    name: 'Civil Service Payroll & Pension Fund Administration', 
    count: 9, 
    icon: 'Users', 
    sector: 'Government & Public Sector',
    description: 'Grade level salary scales, automated pension remittances, and biometric audit controls.' 
  },

  // Private Business Sectors
  { 
    name: 'Manufacturing, Factory Costing & BOM', 
    count: 12, 
    icon: 'Factory', 
    sector: 'Private Sector',
    description: 'Standard costing, WIP tracking, scrap rates, and bill of materials management.' 
  },
  { 
    name: 'Agriculture, Agribusiness & Farm Operations', 
    count: 9, 
    icon: 'Wheat', 
    sector: 'Private Sector',
    description: 'Biological asset accounting (IAS 41), feed mill batching, and harvest inventory.' 
  },
  { 
    name: 'Oil, Gas & Energy Financial Accounting', 
    count: 8, 
    icon: 'Fuel', 
    sector: 'Private Sector',
    description: 'Joint venture cash calls, depot liftings reconciliation, and downstream retail pricing.' 
  },
  { 
    name: 'Financial Services, Microfinance & Cooperatives', 
    count: 11, 
    icon: 'Banknote', 
    sector: 'Private Sector',
    description: 'Loan amortization, daily savings (esusu/ajo), and credit union dividend distribution.' 
  },
  { 
    name: 'Transport, Haulage & Fleet Management', 
    count: 7, 
    icon: 'Truck', 
    sector: 'Private Sector',
    description: 'Trip waybills, diesel consumption costing, tyre maintenance, and driver settlements.' 
  },
  { 
    name: 'Real Estate, Construction & Project Job Costing', 
    count: 10, 
    icon: 'HardHat', 
    sector: 'Private Sector',
    description: 'Architectural stage billing, subcontractor retention fees, and materials staging.' 
  },
  { 
    name: 'Private Schools & Higher Education Billing', 
    count: 8, 
    icon: 'GraduationCap', 
    sector: 'Private Sector',
    description: 'Termly school fees invoicing, boarding house billing, and PTA levy tracking.' 
  },
  { 
    name: 'NGO, Non-Profit & Donor Grant Management', 
    count: 6, 
    icon: 'HeartHandshake', 
    sector: 'Private Sector',
    description: 'Multi-currency donor budgets, USAID/EU grant compliance, and burn-rate tracking.' 
  },
  { 
    name: 'Retail & Multi-Branch Operations', 
    count: 8, 
    icon: 'Store', 
    sector: 'Private Sector',
    description: 'Head office branch consolidation, cashier authorization, and centralized pricing.' 
  },
  { 
    name: 'Restaurant & Hospitality Management', 
    count: 7, 
    icon: 'Utensils', 
    sector: 'Private Sector',
    description: 'Kitchen order tickets (KOT), recipe costings, and dining table management.' 
  },
  { 
    name: 'Hotel Property Management (PMS)', 
    count: 6, 
    icon: 'Building2', 
    sector: 'Private Sector',
    description: 'Guest reservation calendar, room folios, housekeeping status, and night audits.' 
  },
  { 
    name: 'E-commerce & Marketplace Operations', 
    count: 5, 
    icon: 'ShoppingCart', 
    sector: 'Private Sector',
    description: 'Online store inventory sync, digital payment gateways, and delivery tracking.' 
  },
  { 
    name: 'Entrepreneurship & SME Growth', 
    count: 15, 
    icon: 'TrendingUp', 
    sector: 'Private Sector',
    description: 'Cash flow management, business planning, and scaling operational processes.' 
  },
  { 
    name: 'Accounting Practice & Bookkeeping Services', 
    count: 10, 
    icon: 'Briefcase', 
    sector: 'Private Sector',
    description: 'Running an outsourced accounting practice and managing multi-client books.' 
  },

  // Core SaaS Operations
  { 
    name: 'Accounting & Financial Management', 
    count: 14, 
    icon: 'Calculator', 
    sector: 'Core SaaS Operations',
    description: 'Double-entry bookkeeping, chart of accounts, and financial statement generation.' 
  },
  { 
    name: 'Point of Sale (POS) Operations', 
    count: 9, 
    icon: 'CreditCard', 
    sector: 'Core SaaS Operations',
    description: 'Rapid checkout, barcode scanning, split payment, and cash drawer management.' 
  },
  { 
    name: 'Inventory & Warehouse Management', 
    count: 11, 
    icon: 'Boxes', 
    sector: 'Core SaaS Operations',
    description: 'Multi-warehouse stock transfers, reorder levels, and physical stock count audits.' 
  },
  { 
    name: 'Payroll & Business Administration', 
    count: 9, 
    icon: 'Users', 
    sector: 'Core SaaS Operations',
    description: 'Staff payroll, PAYE deductions, pension remittance, and payslip generation.' 
  },
  { 
    name: 'Taxation & Financial Compliance', 
    count: 12, 
    icon: 'FileText', 
    sector: 'Core SaaS Operations',
    description: 'VAT, WHT, CIT schedules, FIRS e-filing, and tax audit readiness.' 
  },
  { 
    name: 'Business Analytics & Reporting', 
    count: 8, 
    icon: 'BarChart3', 
    sector: 'Core SaaS Operations',
    description: 'Executive KPI dashboards, gross margin analysis, and sales trend forecasts.' 
  },
  { 
    name: 'MsmeBooks Software Implementation', 
    count: 6, 
    icon: 'Cpu', 
    sector: 'Core SaaS Operations',
    description: 'System setup, data migration, user permissions, and workflow configuration.' 
  },
  { 
    name: 'Partner & Reseller Certification', 
    count: 4, 
    icon: 'Award', 
    sector: 'Core SaaS Operations',
    description: 'Accreditation for accounting consultants, IT firms, and reseller partners.' 
  },
  { 
    name: 'AI Tools & Business Automation', 
    count: 6, 
    icon: 'Sparkles', 
    sector: 'Core SaaS Operations',
    description: 'Automated receipt parsing, intelligent categorization, and smart forecasts.' 
  },
  { 
    name: 'Data Migration & System Integration', 
    count: 5, 
    icon: 'Database', 
    sector: 'Core SaaS Operations',
    description: 'Excel/QuickBooks data import, API connections, and legacy system transitions.' 
  }
];

export const TESTIMONIALS = [
  {
    quote: "MsmeBooks Academy completely revolutionized our 8 supermarket branches in Lagos. Every cashier we hire now completes the Certified POS Operator pathway before touching a register. Drawer discrepancies dropped to zero.",
    author: "Alhaji Farouk Danladi",
    role: "Managing Director",
    company: "De-Choice Supermarkets, Ikeja",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    verifiedCourse: "Certified POS Operator"
  },
  {
    quote: "As an independent chartered accountant, completing the Certified Implementation Specialist Bootcamp gave me a structured framework to migrate 18 SME clients from paper ledgers to MsmeBooks. The 30% recurring partner commission has created a dependable new revenue stream.",
    author: "Grace Adekunle, ACA",
    role: "Managing Partner",
    company: "Apex Advisory & Tax Services, Abuja",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    verifiedCourse: "MsmeBooks Certified Implementation Partner"
  },
  {
    quote: "The interactive software sandbox is what sets MsmeBooks Academy apart. My front desk staff practiced checking in mock guests, managing restaurant folios, and closing night audits before our hotel grand opening in Accra.",
    author: "Kwame Asante-Boateng",
    role: "Operations Manager",
    company: "Royal Palm Suites & Hospitality, Ghana",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    verifiedCourse: "Certified Hospitality Management Operator"
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'course_added',
    title: 'New Course Added',
    message: 'Public Sector IPSAS Accounting & MDA Financial Governance has been added to the catalog under Government & Public Sector tracks.',
    timestamp: 'Just now',
    read: false,
    targetTab: 'courses',
    targetId: 'course-7',
    badgeLabel: 'New Course',
    meta: {
      courseTitle: 'Public Sector IPSAS Accounting & MDA Financial Governance',
      courseCategory: 'Public Sector Accounting & IPSAS Standards'
    }
  },
  {
    id: 'notif-2',
    type: 'certification_verified',
    title: 'Certification Successfully Verified',
    message: 'Credential #MSME-CERT-2026-90412 for Chiamaka Ngozi Eze (Master Certified Professional Bookkeeper) was successfully verified with 98% score.',
    timestamp: '18 minutes ago',
    read: false,
    targetTab: 'verify-certificate',
    targetId: 'MSME-CERT-2026-90412',
    badgeLabel: 'Verified Credential',
    meta: {
      studentName: 'Chiamaka Ngozi Eze',
      certificateId: 'MSME-CERT-2026-90412'
    }
  },
  {
    id: 'notif-3',
    type: 'course_added',
    title: 'New Course Added',
    message: 'Commercial Agriculture & Farm Management: Harvest Costing & Silos has been published with biological asset accounting (IAS 41).',
    timestamp: '2 hours ago',
    read: false,
    targetTab: 'courses',
    targetId: 'course-8',
    badgeLabel: 'New Course',
    meta: {
      courseTitle: 'Commercial Agriculture & Farm Management: Harvest Costing & Silos',
      courseCategory: 'Agriculture, Agribusiness & Farm Operations'
    }
  },
  {
    id: 'notif-4',
    type: 'certification_verified',
    title: 'Certification Successfully Verified',
    message: 'Credential #MSME-CERT-2026-88104 for Tunde Babatunde Balogun (Certified Multi-Branch POS & Retail Systems Operator) has been confirmed in the Registry.',
    timestamp: 'Yesterday',
    read: true,
    targetTab: 'verify-certificate',
    targetId: 'MSME-CERT-2026-88104',
    badgeLabel: 'Verified Credential',
    meta: {
      studentName: 'Tunde Babatunde Balogun',
      certificateId: 'MSME-CERT-2026-88104'
    }
  }
];

export const TRAINING_BUNDLES: TrainingBundle[] = [
  {
    id: 'bundle-cfo',
    title: 'SME Chief Financial Officer (CFO) & Executive Controller Suite',
    tagline: 'End-to-end mastery of cloud accounting, tax audit readiness, multi-currency ledger, and real-time cash flow dashboards.',
    description: 'Designed for senior bookkeepers, chartered accountants, and finance heads scaling SMEs across Africa. Bundle includes 4 accredited masterclasses covering daily transaction postings to executive board reports.',
    category: 'Accounting & Financial Management',
    badge: 'Executive Suite',
    featuredPill: 'Most Popular · 42% Discount',
    bannerGradient: 'from-blue-900 via-indigo-900 to-slate-900',
    courseIds: ['course-1', 'course-4', 'course-5', 'course-7'],
    totalHours: 46,
    totalModules: 17,
    originalPriceNgn: 130000,
    discountedPriceNgn: 75000,
    discountPercentage: 42,
    targetAudience: [
      'Heads of Finance and Senior SME Bookkeepers',
      'Finance Managers preparing for multi-branch scaling',
      'Business owners seeking rigorous internal controls'
    ],
    careerOutcomes: [
      'Certified SME Chief Financial Officer (CFO) designation',
      'Autonomous management of multi-entity ledgers & FX gains/losses',
      'Filing automated VAT and withholding tax schedules with zero penalties'
    ]
  },
  {
    id: 'bundle-retail',
    title: 'Supermarket & Multi-Branch Retail Operations Masterclass',
    tagline: 'High-speed barcode scanning, multi-warehouse stock replenishment, shrinkage control, and cashier shift reconciliation.',
    description: 'A complete operational curriculum for supermarket owners, retail store supervisors, and retail chain operators looking to eliminate stock shrinkage and audit discrepancies.',
    category: 'Point of Sale (POS) Operations',
    badge: 'Operations Track',
    featuredPill: 'High Demand · 35% Discount',
    bannerGradient: 'from-emerald-900 via-teal-900 to-slate-900',
    courseIds: ['course-2', 'course-3', 'course-5'],
    totalHours: 30,
    totalModules: 11,
    originalPriceNgn: 85000,
    discountedPriceNgn: 55000,
    discountPercentage: 35,
    targetAudience: [
      'Supermarket managers, retail supervisors, storekeepers',
      'Inventory controllers overseeing multi-depot stock',
      'Retail entrepreneurs opening 2nd or 3rd locations'
    ],
    careerOutcomes: [
      'Certified Multi-Branch Retail & POS Operations Lead',
      'Zero-variance shift balancing & automated cash-drop protocols',
      'Real-time automated reorder alerts for FMCG fast-moving goods'
    ]
  },
  {
    id: 'bundle-agri',
    title: 'Agribusiness Commercialization & Farm Enterprise Bundle',
    tagline: 'Biological asset accounting (IAS 41), grain silo batch costing, feed-mill formulation, and export logistics documentation.',
    description: 'Equip commercial farmers, agro-processors, and livestock managers with international agricultural accounting standards, production batching, and harvest yield tracking.',
    category: 'Agriculture, Agribusiness & Farm Operations',
    badge: 'Agro-Enterprise',
    featuredPill: 'Specialized Track · 30% Discount',
    bannerGradient: 'from-amber-900 via-yellow-950 to-slate-900',
    courseIds: ['course-8', 'course-3', 'course-1'],
    totalHours: 36,
    totalModules: 13,
    originalPriceNgn: 95000,
    discountedPriceNgn: 66500,
    discountPercentage: 30,
    targetAudience: [
      'Commercial farm general managers, poultry & crop directors',
      'Agribusiness accountants managing outgrower credit schemes',
      'Commodity aggregation and agricultural export coordinators'
    ],
    careerOutcomes: [
      'Certified Agricultural Financial Controller (IAS 41 Specialist)',
      'Accurate harvest yield costing and mortality accounting',
      'Automated seed, fertilizer, and silo stock inventory management'
    ]
  },
  {
    id: 'bundle-partner',
    title: 'MsmeBooks Certified ERP Partner & Implementation Consultant',
    tagline: 'Software implementation blueprint, legacy Excel/QuickBooks data migration, reseller commercialization, and client support.',
    description: 'The definitive credential for independent tech consultants, accounting firms, and IT resellers looking to build a high-income advisory practice deploying MsmeBooks to client organizations.',
    category: 'Partner & Reseller Certification',
    badge: 'Partner License',
    featuredPill: 'Career Accelerator · 48% Discount',
    bannerGradient: 'from-purple-900 via-slate-900 to-black',
    courseIds: ['course-1', 'course-2', 'course-3', 'course-4', 'course-6'],
    totalHours: 54,
    totalModules: 20,
    originalPriceNgn: 165000,
    discountedPriceNgn: 85000,
    discountPercentage: 48,
    targetAudience: [
      'Accounting firms expanding into SaaS software advisory',
      'Independent IT and ERP deployment consultants',
      'Hardware vendors selling POS terminals and thermal printers'
    ],
    careerOutcomes: [
      'Gold Certified Implementation Partner status in Partner Directory',
      '30% recurring software subscription revenue share',
      'Complete data migration toolkit from Excel/QuickBooks/Sage'
    ]
  }
];

export const INITIAL_ACTIVITY_POSTS: ActivityPost[] = [
  {
    id: 'post-1',
    authorName: 'Amina Bello, ACA',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Senior Financial Controller',
    location: 'Abuja, Nigeria',
    category: 'Accounting & Financial Management',
    timestamp: '15 minutes ago',
    pinned: true,
    courseReferenceId: 'course-1',
    courseReferenceTitle: 'Mastering MsmeBooks Cloud Accounting',
    content: 'Pro-tip for everyone handling month-end bank reconciliations: If you notice recurring uncleared direct debit charges on your bank feed, enable the "Smart Rule Regex" in the Banking Settings under Chart 1020. It auto-matched 140 merchant transactions in under 3 minutes for our retail group today! 🚀',
    codeOrSnippet: 'Rule: BANK_FEED_MATCH -> IF Desc CONTAINS "POS_PURCH" THEN AUTO_POST -> Acc: 5040 (Merchant Transaction Charges)',
    likesCount: 28,
    hasLiked: false,
    comments: [
      {
        id: 'comm-1',
        authorName: 'Emeka Okafor',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorRole: 'SME Bookkeeper',
        timestamp: '8 minutes ago',
        content: 'This saved me hours Amina! I was previously matching each micro-charge by hand every Friday afternoon.',
        likes: 6
      },
      {
        id: 'comm-2',
        authorName: 'Kofi Mensah',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Retail Operations Specialist',
        timestamp: '3 minutes ago',
        content: 'Does this also work when the bank sends truncated narrative strings? In Ghana our Ecobank feed sometimes truncates after 18 chars.',
        likes: 2
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Chidi Nnamdi',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Multi-Branch Supermarket Manager',
    location: 'Port Harcourt, Nigeria',
    category: 'Point of Sale (POS) Operations',
    timestamp: '1 hour ago',
    courseReferenceId: 'course-2',
    courseReferenceTitle: 'Advanced Point of Sale (POS) & Retail Management',
    content: 'Question for study group members in POS Module 3: When cashiers perform cash drops during peak Friday evening rushes, do you require the floor supervisor to biometric authenticate directly at the terminal or do you allow supervisor pin codes? We had a minor discrepancy yesterday and want to enforce best practices.',
    likesCount: 19,
    hasLiked: true,
    comments: [
      {
        id: 'comm-3',
        authorName: 'Fatima Al-Hassan',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Certified Lead Auditor',
        timestamp: '45 minutes ago',
        content: 'Always enforce dual authentication with biometric supervisor approval. In MsmeBooks POS, toggle "Require Supervisor Fingerprint for Safe Drops > ₦50,000" in Terminal Security Settings.',
        likes: 11
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Kwame Asante',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Farm Logistics Coordinator',
    location: 'Kumasi, Ghana',
    category: 'Agriculture, Agribusiness & Farm Operations',
    timestamp: '3 hours ago',
    courseReferenceId: 'course-8',
    courseReferenceTitle: 'Commercial Agriculture & Farm Management',
    content: 'Just finished Module 2 on IAS 41 Biological Asset valuation! The fair value minus costs to sell calculation for our cocoa nursery seedlings made our balance sheet much more attractive to the agricultural development bank loan committee.',
    likesCount: 14,
    hasLiked: false,
    comments: []
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'diag-1',
    question: 'How do you currently record supplier invoices when goods arrive before the invoice is physically received?',
    scenario: 'A delivery of 500 bags of flour arrives at your supermarket bakery on Wednesday, but the vendor statement will only be issued at month-end.',
    relatedCategory: 'Accounting & Financial Management',
    options: [
      {
        text: 'Wait until the paper invoice arrives before making any entry in the ledger.',
        level: 'Beginner',
        isBest: false
      },
      {
        text: 'Record a Goods Received Note (GRN) that debits Inventory and credits Uninvoiced Goods Received (Accrued Liabilities).',
        level: 'Advanced',
        isBest: true
      },
      {
        text: 'Post an estimated cash expense immediately to the general ledger.',
        level: 'Intermediate',
        isBest: false
      }
    ],
    explanation: 'Accrual accounting under IFRS/IPSAS mandates recording inventory assets upon transfer of risks and rewards via Goods Received Note (GRN) with offsetting accrual.'
  },
  {
    id: 'diag-2',
    question: 'What is the standard procedure when a cashier drawer has a cash discrepancy at shift close?',
    scenario: 'At 9:00 PM close, the POS expected cash shows ₦184,500 but the counted physical cash in the safe tray is ₦181,200 (₦3,300 shortage).',
    relatedCategory: 'Point of Sale (POS) Operations',
    options: [
      {
        text: 'Ask the cashier to replace the difference from personal cash before closing the day.',
        level: 'Beginner',
        isBest: false
      },
      {
        text: 'Close the POS with the actual counted figure; system automatically posts the variance to Cash Short & Over expense account for supervisor investigation.',
        level: 'Advanced',
        isBest: true
      },
      {
        text: 'Edit the system sales total down by ₦3,300 so the report balances.',
        level: 'Beginner',
        isBest: false
      }
    ],
    explanation: 'Integrity of sales records must never be tampered with. Cash Short & Over account provides an immutable audit trail for internal audit review.'
  },
  {
    id: 'diag-3',
    question: 'How do you handle stock reorders across multiple warehouse branches in MsmeBooks?',
    scenario: 'Your central hub in Lagos has 450 units of cooking oil, while the Ikeja retail outlet is down to 12 units (minimum safety buffer is 25 units).',
    relatedCategory: 'Inventory & Warehouse Management',
    options: [
      {
        text: 'Directly place a new purchase order with the foreign supplier for the Ikeja branch.',
        level: 'Beginner',
        isBest: false
      },
      {
        text: 'Create an Inter-Branch Stock Transfer Request (ITR) with Goods-in-Transit (GIT) tracking to replenish from central depot.',
        level: 'Advanced',
        isBest: true
      },
      {
        text: 'Ask the Ikeja storekeeper to verbally borrow cartons from the neighboring retail store.',
        level: 'Beginner',
        isBest: false
      }
    ],
    explanation: 'Inter-Branch Transfer Request ensures proper inventory accountability, prevents duplicate capital lockup, and tracks transit insurance liability.'
  },
  {
    id: 'diag-4',
    question: 'Which tax rule applies when paying a corporate consultant for software installation services?',
    scenario: 'An IT vendor submits a ₦400,000 fee for installing biometric POS terminals at your branch.',
    relatedCategory: 'Taxation & Financial Compliance',
    options: [
      {
        text: 'Pay the full ₦400,000 and let the consultant deal with their taxes at year-end.',
        level: 'Beginner',
        isBest: false
      },
      {
        text: 'Deduct 5% Withholding Tax (WHT), remit ₦20,000 to the tax revenue service with credit note, and pay vendor net ₦380,000 plus applicable VAT.',
        level: 'Advanced',
        isBest: true
      },
      {
        text: 'Deduct 50% as a security deposit until 6 months pass.',
        level: 'Beginner',
        isBest: false
      }
    ],
    explanation: 'Withholding Tax is an advance payment of income tax that companies are legally obligated to deduct and remit with tax clearance credit notes.'
  },
  {
    id: 'diag-5',
    question: 'How should agricultural crops or livestock be valued on the balance sheet at harvest time?',
    scenario: 'A poultry farm has 5,000 broilers reaching maturity ready for processing and delivery to restaurant buyers.',
    relatedCategory: 'Agriculture, Agribusiness & Farm Operations',
    options: [
      {
        text: 'Value at historical cost of the day-old chicks only.',
        level: 'Beginner',
        isBest: false
      },
      {
        text: 'Value at Fair Value less estimated costs to sell at the point of harvest under IAS 41.',
        level: 'Advanced',
        isBest: true
      },
      {
        text: 'Do not recognize any asset value until the customers pay their cash invoices.',
        level: 'Beginner',
        isBest: false
      }
    ],
    explanation: 'IAS 41 prescribes measuring biological assets at fair value less costs to sell, capturing biological transformation into economic value.'
  }
];

export const INITIAL_CHAT_MESSAGES: LiveChatMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Tunde Balogun',
    senderRole: 'Peer Tutor',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Lagos, NG',
    channel: 'General Lounge',
    message: 'Welcome everyone studying today! If anyone needs help on Chart of Accounts classification, tag me here.',
    timestamp: '10:14 AM'
  },
  {
    id: 'msg-2',
    senderName: 'Fatima Zahra',
    senderRole: 'Student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'Kano, NG',
    channel: 'General Lounge',
    message: 'Just passed the Module 4 Bank Reconciliation Quiz with 100%! The sandbox demo was super helpful.',
    timestamp: '10:22 AM',
    likes: 4
  },
  {
    id: 'msg-3',
    senderName: 'Dr. Jean-Paul Kouame',
    senderRole: 'Certified Instructor',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Abidjan, CI',
    channel: 'Accounting & Tax Hub',
    message: 'Reminder for regional students: The OHADA and ECOWAS tax harmonization webinar starts this Thursday at 3:00 PM GMT.',
    timestamp: '10:30 AM',
    likes: 8
  },
  {
    id: 'msg-4',
    senderName: 'Sarah Otieno',
    senderRole: 'Student',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    location: 'Nairobi, KE',
    channel: 'POS & Retail Ops',
    message: 'Working on barcode scanner configuration in the sandbox right now. Does anyone know if MsmeBooks supports 2D QR codes on receipts?',
    timestamp: '10:41 AM'
  }
];

