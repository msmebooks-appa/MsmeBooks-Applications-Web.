export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Accounting & Bookkeeping' | 'Taxes & Compliance' | 'Software & ERP' | 'Invoicing & Payments' | 'Audit & Governance';
  snippet: string;
  content: string;
  readTime: string;
  tags: string[];
  recommendedServiceId?: string;
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'art-wht-vat-guide',
    slug: 'wht-and-vat-filing-deadlines',
    title: 'Withholding Tax (WHT) and Value Added Tax (VAT) Filing Deadlines',
    category: 'Taxes & Compliance',
    snippet: 'Complete schedule of statutory filing deadlines, remittance portals, and tax penalties for African and global MSMEs.',
    content: 'VAT returns must be filed and remitted by the 21st day of the following month for operations in Nigeria, Ghana, Kenya, and South Africa. Failure to remit incurs automatic statutory penalty interest plus cumulative administrative fees. Our verified tax partners provide automated filing, schedule reconciliation, and withholding credit note collections.',
    readTime: '4 min read',
    tags: ['VAT', 'WHT', 'Tax Returns', 'FIRS', 'KRA', 'SARS', 'Penalties'],
    recommendedServiceId: 'srv-tax-advisory',
  },
  {
    id: 'art-pos-setup-retail',
    slug: 'choosing-pos-hardware-supermarkets',
    title: 'POS Hardware & Barcode Setup Guide for Retail and Supermarkets',
    category: 'Software & ERP',
    snippet: 'Step-by-step checklist for configuring multi-terminal POS touchscreens, thermal printers, cash drawers, and offline mode.',
    content: 'Retail checkout requires 99.9% uptime and offline transaction sync. When choosing hardware, verify standard ESC/POS compliance for receipt printers, 2D QR scanners for digital payments, and local database caching to continue sales during internet disruptions.',
    readTime: '6 min read',
    tags: ['POS', 'Retail', 'Supermarkets', 'Hardware', 'Printers', 'Barcode'],
    recommendedServiceId: 'srv-pos-retail-setup',
  },
  {
    id: 'art-clean-backlog-books',
    slug: 'how-to-catch-up-on-backlog-bookkeeping',
    title: 'Catching Up on Unreconciled Bank Records & Historical Bookkeeping',
    category: 'Accounting & Bookkeeping',
    snippet: 'Methodology for reconciling months or years of unrecorded bank statements, missing receipts, and vendor invoices.',
    content: 'Begin by exporting raw electronic bank statements in CSV/QBO format. Categorize recurring operational expenditures, map debit transfers to supplier ledgers, and establish an unallocated clearing account for suspicious entries. A certified implementation partner can complete up to 24 months of backlog books in 5 to 10 business days.',
    readTime: '5 min read',
    tags: ['Backlog', 'Bank Reconciliation', 'Bank Feeds', 'Ledger', 'Bookkeeping'],
    recommendedServiceId: 'srv-backlog-bookkeeping',
  },
  {
    id: 'art-payroll-paye-pension',
    slug: 'payroll-tax-paye-and-pension-compliance',
    title: 'Payroll Setup: PAYE, Pension Remittances, and NHF Calculations',
    category: 'Taxes & Compliance',
    snippet: 'How to structure executive salary packages, calculate consolidated relief allowances, and file monthly payroll schedules.',
    content: 'Ensure all employee compensation structures comply with labor laws and statutory deductions: 8% employee pension, 10% employer contribution, and graduated PAYE tax brackets. Automated payroll systems generate monthly bank-approved payment schedules and electronic pay slips.',
    readTime: '5 min read',
    tags: ['Payroll', 'PAYE', 'Pension', 'NHF', 'Salary', 'HR'],
    recommendedServiceId: 'srv-payroll-management',
  },
  {
    id: 'art-erp-migration-quickbooks-odoo',
    slug: 'migrating-to-cloud-erp-from-excel',
    title: 'Migrating from Spreadsheets to Cloud ERP (Odoo, ERPNext, Zoho)',
    category: 'Software & ERP',
    snippet: 'Best practices for chart of accounts mapping, customer database cleansing, and historical balance transfers.',
    content: 'Transitioning from spreadsheets to integrated cloud ERP eliminates double data entry and inventory leakage. Critical milestones include data sanitization, opening trial balance verification, user role permission configuration, and employee sandbox training.',
    readTime: '7 min read',
    tags: ['ERP', 'Odoo', 'QuickBooks', 'Zoho', 'Excel Migration', 'Chart of Accounts'],
    recommendedServiceId: 'srv-erp-migration',
  },
  {
    id: 'art-audit-readiness-checklist',
    slug: 'statutory-financial-audit-readiness',
    title: 'Statutory Financial Audit Readiness Checklist for Growing Businesses',
    category: 'Audit & Governance',
    snippet: 'Prepare trial balances, fixed asset registers, and confirmation letters for external statutory auditors.',
    content: 'External audits proceed quickly and affordably when documentation is pre-assembled. Key files required: signed bank confirmations, physical stock count sheets, loan amortization tables, board minutes approving large asset acquisitions, and revenue cutoff schedules.',
    readTime: '6 min read',
    tags: ['Audit', 'Financial Statements', 'IFRS', 'Fixed Assets', 'Governance'],
    recommendedServiceId: 'srv-audit-preparation',
  },
  {
    id: 'art-invoice-payment-gateways',
    slug: 'optimizing-cross-border-b2b-invoicing',
    title: 'Optimizing B2B Invoicing & Multi-Currency Payment Collections',
    category: 'Invoicing & Payments',
    snippet: 'How to accept international wire transfers, cards, and mobile money with automated receipt reconciliation.',
    content: 'Accepting client payments across multiple currencies requires smart routing: local instant bank transfer (e.g., NIBSS instant pay, M-Pesa, Mobile Money) for domestic transactions, and Stripe / PayPal / Flutterwave for international USD and GBP credit cards with automatic ledger reconciliation.',
    readTime: '4 min read',
    tags: ['Invoicing', 'Payment Gateway', 'Stripe', 'Paystack', 'M-Pesa', 'Multi-currency'],
    recommendedServiceId: 'srv-payment-gateway-setup',
  },
];
