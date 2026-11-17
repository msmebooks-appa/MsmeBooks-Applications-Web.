import { FaqCategory } from '../types/faq';

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started & Onboarding',
    shortDescription: 'Account creation, initial business setup, free registration, and basic navigation.',
    iconName: 'Rocket',
    group: 'Core Platform'
  },
  {
    id: 'accounting',
    title: 'Accounting & Financial Management',
    shortDescription: 'General ledger, P&L, balance sheets, bank reconciliation, VAT, and chart of accounts.',
    iconName: 'Calculator',
    group: 'Core Platform'
  },
  {
    id: 'pos',
    title: 'Point of Sale (POS)',
    shortDescription: 'Barcode scanning, receipt printers, cashiers, offline shifts, and hardware setups.',
    iconName: 'ShoppingBag',
    group: 'Operations & Industry'
  },
  {
    id: 'inventory',
    title: 'Inventory & Warehouse Management',
    shortDescription: 'Multi-warehouse stock, low-stock alerts, variants, expiry dates, and batch tracking.',
    iconName: 'Boxes',
    group: 'Operations & Industry'
  },
  {
    id: 'sales-invoicing',
    title: 'Sales, Purchases & Invoicing',
    shortDescription: 'Quotations, proforma invoices, recurring billing, POs, and automated reminders.',
    iconName: 'FileText',
    group: 'Core Platform'
  },
  {
    id: 'hr-payroll',
    title: 'HR, Payroll & Employees',
    shortDescription: 'Staff records, payslips, PAYE/statutory deductions, attendance, and leave.',
    iconName: 'Users',
    group: 'Core Platform'
  },
  {
    id: 'hotel-management',
    title: 'Hotel & Property Management (PMS)',
    shortDescription: 'Room reservations, guest folios, housekeeping, restaurant POS, and night audit.',
    iconName: 'Hotel',
    badge: 'PMS Add-on',
    group: 'Operations & Industry'
  },
  {
    id: 'restaurants',
    title: 'Restaurants & Hospitality',
    shortDescription: 'Table management, kitchen order tickets (KOT), recipe costing, and food inventory.',
    iconName: 'Utensils',
    group: 'Operations & Industry'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce & Online Stores',
    shortDescription: 'Digital storefronts, online checkout, payment links, and order dispatch.',
    iconName: 'Globe',
    group: 'Operations & Industry'
  },
  {
    id: 'industry-solutions',
    title: 'Industry Solutions',
    shortDescription: 'Tailored workflows for retail, pharmacies, construction, schools, and professional firms.',
    iconName: 'Building2',
    group: 'Operations & Industry'
  },
  {
    id: 'pricing-billing',
    title: 'Pricing, Subscriptions & Billing',
    shortDescription: 'Free plan, Enterprise tiers, add-ons, monthly/annual renewals, and invoice receipts.',
    iconName: 'CreditCard',
    group: 'Billing & Growth'
  },
  {
    id: 'payments-fintech',
    title: 'Payments & Payment Gateways',
    shortDescription: 'Paystack, Flutterwave, M-Pesa, Stripe, POS terminal sync, and automated reconciliation.',
    iconName: 'Wallet',
    group: 'Billing & Growth'
  },
  {
    id: 'marketplace',
    title: 'Marketplace & Add-ons',
    shortDescription: 'Extending MsmeBooks with specialized modules, PMS, custom plugins, and developer tools.',
    iconName: 'Layers',
    group: 'Billing & Growth'
  },
  {
    id: 'integrations-api',
    title: 'Integrations & API',
    shortDescription: 'REST APIs, webhooks, third-party apps, banking feeds, and ERP data connections.',
    iconName: 'Cpu',
    group: 'Core Platform'
  },
  {
    id: 'multi-branch',
    title: 'Multi-Branch & Multi-Company',
    shortDescription: 'Manage several entities, cross-branch transfers, consolidated reporting, and role permissions.',
    iconName: 'Network',
    group: 'Core Platform'
  },
  {
    id: 'ai-automation',
    title: 'AI Tools & Automation',
    shortDescription: 'Intelligent financial summaries, trend forecasting, automated reminders, and AI assistants.',
    iconName: 'Sparkles',
    badge: 'AI Powered',
    group: 'Core Platform'
  },
  {
    id: 'data-migration',
    title: 'Data Migration & Implementation',
    shortDescription: 'Importing from Excel, Sage 50, QuickBooks, Xero, Zoho, and legacy spreadsheets.',
    iconName: 'ArrowLeftRight',
    group: 'Core Platform'
  },
  {
    id: 'security-privacy',
    title: 'Security, Privacy & Compliance',
    shortDescription: '2FA authentication, role-based controls, TLS encryption, cloud backups, and data privacy.',
    iconName: 'ShieldCheck',
    group: 'Company & Support'
  },
  {
    id: 'support-training',
    title: 'Customer Support & Training',
    shortDescription: 'Live training, video guides, ticket escalation, webinars, and dedicated support hotlines.',
    iconName: 'Headphones',
    group: 'Company & Support'
  },
  {
    id: 'partners-resellers',
    title: 'Partners, Resellers & Affiliates',
    shortDescription: 'Partner tiers (15%-40% recurring commission), client management, and certification.',
    iconName: 'Briefcase',
    badge: 'Up to 40% Commission',
    group: 'Billing & Growth'
  },
  {
    id: 'account-management',
    title: 'Account Management',
    shortDescription: 'Profile settings, company branding, user invitations, and subscription controls.',
    iconName: 'UserCheck',
    group: 'Company & Support'
  },
  {
    id: 'mobile-compatibility',
    title: 'Mobile & Device Compatibility',
    shortDescription: 'iOS, Android, desktop browsers, tablet POS, and offline mobile receipt printing.',
    iconName: 'Smartphone',
    group: 'Core Platform'
  },
  {
    id: 'international-business',
    title: 'International Business & Localization',
    shortDescription: 'Multi-currency ledgers, Pan-African tax rates, regional banking, and multi-language support.',
    iconName: 'Compass',
    group: 'Core Platform'
  },
  {
    id: 'company-careers',
    title: 'Company, Careers & General Enquiries',
    shortDescription: 'About MsmeBooks, African mission, partnership inquiries, and career opportunities.',
    iconName: 'Info',
    group: 'Company & Support'
  }
];
