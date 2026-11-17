export interface Milestone {
  id: string;
  title: string;
  shortTitle: string;
  category: 'Sales' | 'Accounting' | 'Operations' | 'Growth';
  badgeIcon: string; // Emoji or icon tag
  color: string;
  description: string;
  requirement: string;
  perkUnlocked: string;
  progressMax: number;
  currentProgress?: number;
  points: number;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_invoice',
    title: 'First Invoice Pioneer',
    shortTitle: '1st Invoice',
    category: 'Sales',
    badgeIcon: '🧾',
    color: 'from-blue-500 to-indigo-600',
    description: 'Generated and sent your first official digital invoice with automated VAT calculation.',
    requirement: 'Create 1 invoice in MsmeBooks',
    perkUnlocked: '+3 Premium Invoice Templates unlocked',
    progressMax: 1,
    points: 100,
  },
  {
    id: 'hundred_transactions',
    title: 'Century Club (100 Transactions)',
    shortTitle: '100 Tx Club',
    category: 'Sales',
    badgeIcon: '🚀',
    color: 'from-amber-500 to-orange-600',
    description: 'Processed 100 successful customer payments through POS, invoices, or online checkout.',
    requirement: 'Process 100 successful transactions',
    perkUnlocked: 'Priority Live Chat Routing & WhatsApp Support',
    progressMax: 100,
    points: 500,
  },
  {
    id: 'tax_compliant',
    title: 'Tax Compliant Pro',
    shortTitle: 'Audit Ready',
    category: 'Accounting',
    badgeIcon: '🛡️',
    color: 'from-emerald-500 to-teal-600',
    description: 'Generated your first monthly FIRS VAT-002 schedule or KRA iTax statutory tax report.',
    requirement: 'Download a statutory monthly tax schedule',
    perkUnlocked: 'Automated FIRS TaxPro-Max XML Exporter',
    progressMax: 1,
    points: 250,
  },
  {
    id: 'offline_pos',
    title: 'Offline POS Pioneer',
    shortTitle: 'Always Selling',
    category: 'Operations',
    badgeIcon: '⚡',
    color: 'from-purple-500 to-pink-600',
    description: 'Rang up transactions while offline during network dips with automatic cloud resync.',
    requirement: 'Complete 1 offline cloud POS sale',
    perkUnlocked: 'Offline Multi-Till Sync Buffering',
    progressMax: 1,
    points: 200,
  },
  {
    id: 'payroll_master',
    title: 'Payroll Master',
    shortTitle: 'Team Builder',
    category: 'Growth',
    badgeIcon: '👥',
    color: 'from-cyan-500 to-blue-600',
    description: 'Disbursed employee salaries with statutory PAYE income tax and Pension fund schedules.',
    requirement: 'Process 1 team monthly payroll run',
    perkUnlocked: 'Employee Self-Service (ESS) Mobile App Access',
    progressMax: 1,
    points: 300,
  },
  {
    id: 'fixed_assets_champion',
    title: 'Asset Guardian',
    shortTitle: 'Asset Pro',
    category: 'Operations',
    badgeIcon: '🏷️',
    color: 'from-rose-500 to-red-600',
    description: 'Logged 10 company fixed assets and printed QR barcode tags for physical audits.',
    requirement: 'Tag and register 10 fixed assets',
    perkUnlocked: 'Automated Insurance & Warranty Alert Engine',
    progressMax: 10,
    points: 350,
  },
  {
    id: 'multi_branch_mogul',
    title: 'Multi-Branch Mogul',
    shortTitle: 'Scaling High',
    category: 'Growth',
    badgeIcon: '🏢',
    color: 'from-lime-500 to-emerald-600',
    description: 'Connected 2 or more physical retail branches or warehouses under unified ledger.',
    requirement: 'Set up multi-branch inventory tracking',
    perkUnlocked: 'Inter-Branch Stock Transfer Waybill Module',
    progressMax: 2,
    points: 400,
  },
];
