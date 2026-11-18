/**
 * Comprehensive dictionary of business, accounting, POS, and ERP definitions
 * tailored for SME owners and enterprise operators using MsmeBooks.
 */
export interface FeatureTooltipData {
  explanation: string;
  whyItMatters: string;
  category: 'Accounting' | 'Inventory & Logistics' | 'POS & Hardware' | 'Integrations & API' | 'Tax & Compliance' | 'Operations & HR' | 'Enterprise';
}

export const BUSINESS_TERMS_TOOLTIPS_DETAILS: Record<string, FeatureTooltipData> = {
  // API & Integrations
  'API Integrations': {
    explanation: 'Programmatic interfaces (REST API & Webhooks) that connect MsmeBooks directly to your website, mobile app, logistics courier, or external database.',
    whyItMatters: 'Eliminates repetitive manual copy-pasting of orders and customers between platforms, saving 15+ hours weekly and avoiding human errors.',
    category: 'Integrations & API',
  },
  'Webhook and REST API access': {
    explanation: 'Developer endpoints and real-time event triggers that instantly notify external systems whenever an invoice is paid, order created, or stock modified.',
    whyItMatters: 'Allows your technical team or agency to build custom mobile apps, automated dispatch alerts, and sync data into proprietary tools.',
    category: 'Integrations & API',
  },
  'Zapier integrations (5,000+ apps)': {
    explanation: 'No-code workflow automation bridging MsmeBooks with Google Sheets, Slack, HubSpot, Mailchimp, WhatsApp, and thousands of SaaS tools.',
    whyItMatters: 'Automates routine notifications (e.g., auto-post new wholesale sales to Slack, or email VIP customers) without hiring software developers.',
    category: 'Integrations & API',
  },

  // Inventory & Warehousing
  'Multi-warehouse': {
    explanation: 'Centralized multi-depot management overseeing multiple physical storerooms, regional warehouses, and branch back-rooms from one screen.',
    whyItMatters: 'Stops inventory shrinkage, prevents stockouts, and tracks goods in-transit between state depots with official electronic waybills.',
    category: 'Inventory & Logistics',
  },
  'Multiple branch & warehouse management': {
    explanation: 'Manage central distribution depots and branch storerooms with digital waybills, inter-store transfer requisitions, and real-time stock balances.',
    whyItMatters: 'Gives management complete visibility into exact SKU quantities at each location, eliminating stockouts and unauthorized stock movements.',
    category: 'Inventory & Logistics',
  },
  'Inter-warehouse logistics approval workflows': {
    explanation: 'Enforces a secure two-step authorization before goods in transit are transferred between warehouse locations on the ledger.',
    whyItMatters: 'Guarantees that both dispatching warehouse managers and receiving branch supervisors sign off, eliminating theft during transit.',
    category: 'Inventory & Logistics',
  },
  'Basic inventory & stock tracking': {
    explanation: 'Real-time SKU inventory tracking with automated low-stock reorder alerts and purchase replenishment notices.',
    whyItMatters: 'Prevents selling out of top-selling items and highlights slow-moving products tying up valuable working capital.',
    category: 'Inventory & Logistics',
  },
  'Batch, serial & expiration date tracking': {
    explanation: 'Lot traceability for pharmaceuticals, packaged foods, and cosmetics tracking batch numbers, manufacturing dates, and expiration cycles.',
    whyItMatters: 'Enforces First-In, First-Out (FIFO) dispatch to prevent stock expiry losses and satisfies NAFDAC and consumer protection regulations.',
    category: 'Inventory & Logistics',
  },
  'Serial Number & IMEI Tracking': {
    explanation: 'Tracks unique alphanumeric serial numbers and phone IMEI identifiers from procurement delivery through customer point-of-sale receipt.',
    whyItMatters: 'Protects electronics and machinery dealers from fraudulent warranty claims and prevents counterfeit returns.',
    category: 'Inventory & Logistics',
  },
  'Landed cost tracking': {
    explanation: 'Allocates clearing costs, port demurrage, customs duty, and international freight directly into the unit cost of imported stock items.',
    whyItMatters: 'Reveals true profit margins on imported merchandise, ensuring you price products profitably without surprise logistics expenses.',
    category: 'Inventory & Logistics',
  },
  'Price lists & tiered pricing': {
    explanation: 'Customized pricing books for distinct customer tiers (e.g., walk-in retail, bulk wholesale, VIP loyalty, or distributor discount).',
    whyItMatters: 'Ensures store cashiers automatically apply the correct negotiated rates without manual discretion or calculation errors.',
    category: 'Inventory & Logistics',
  },

  // Accounting & Tax
  'Core double-entry bookkeeping': {
    explanation: 'Standard accounting system where every transaction logs balanced debits and credits, generating automated P&L, balance sheets, and ledgers.',
    whyItMatters: 'Ensures your business accounts comply with IFRS and Nigerian GAAP, qualifying you for commercial bank loans and equity investments.',
    category: 'Accounting',
  },
  'Unlimited advance chart of accounts': {
    explanation: 'Hierarchical general ledger account architecture with customizable nominal ledgers, cost centers, and departmental sub-accounts.',
    whyItMatters: 'Gives multi-department and multi-branch companies deep visibility into exact revenue and cost drivers across the organization.',
    category: 'Accounting',
  },
  'Custom statutory tax schedules (VAT & WHT)': {
    explanation: 'Automates 7.5% Nigerian VAT calculations on sales and purchases and generates Withholding Tax (WHT) deduction schedules.',
    whyItMatters: 'Prepares 1-click filing schedules for FIRS TaxPro-Max and State Internal Revenue Services, avoiding audit penalties and interest.',
    category: 'Tax & Compliance',
  },
  'Foreign exchange valuation ledgers': {
    explanation: 'Tracks foreign currency bank balances (USD, EUR, GBP) and revalues them at current CBN/market rates with automated FX gain/loss entries.',
    whyItMatters: 'Protects import/export businesses from hidden currency devaluation losses and keeps financial statements accurate.',
    category: 'Accounting',
  },
  'Cash flow & business snapshot analytics': {
    explanation: 'Predictive 30-day and 90-day cash runway projection analyzing upcoming customer receivables against supplier obligations.',
    whyItMatters: 'Warns you of liquidity crunches weeks in advance so you can collect receivables or arrange financing before cash runs dry.',
    category: 'Accounting',
  },

  // POS & Hardware
  'Single-register cloud POS': {
    explanation: 'Fast touchscreen checkout interface for computers, tablets, and smartphones with offline resilience during power/internet blackouts.',
    whyItMatters: 'Ensures retail sales never stall when internet connections or electricity fluctuate, caching transactions locally and auto-syncing later.',
    category: 'POS & Hardware',
  },
  'POS terminals integrations (Touch/ESC-POS)': {
    explanation: 'Hardware device drivers for Android smart POS payment terminals, 58mm/80mm thermal receipt printers, and cash drawers.',
    whyItMatters: 'Turns low-cost hardware into a professional retail checkout lane, printing receipts instantly and opening cash drawers on cash sales.',
    category: 'POS & Hardware',
  },
  'Standard labels, QR & barcodes printing': {
    explanation: 'Built-in barcode generator creating Code 128, EAN-13, and QR shelf labels printable on adhesive thermal label printers.',
    whyItMatters: 'Accelerates customer checkout by 5x using barcode scanners and eliminates cashier price-entry mistakes.',
    category: 'POS & Hardware',
  },

  // E-Commerce & Portals
  'Single store integration': {
    explanation: 'Direct two-way inventory link with 1 digital storefront (Shopify, Jumia, Selar, or WooCommerce).',
    whyItMatters: 'When an item sells in your physical shop, online stock updates immediately, preventing frustrating out-of-stock customer orders.',
    category: 'Integrations & API',
  },
  'Shopify, Jumia, Selar & WooCommerce': {
    explanation: 'Automated bidirectional sync of product prices, stock levels, and order transactions across top African e-commerce channels.',
    whyItMatters: 'Enables omnichannel retail from one central inventory ledger, eliminating the need to update stock counts across 4 different apps.',
    category: 'Integrations & API',
  },
  'Payment gateways (Paystack/Flutterwave)': {
    explanation: 'Integrated digital checkout accepting cards, bank transfers, and USSD directly through customer invoices and checkout.',
    whyItMatters: 'Speeds up cash collection by 3x and automatically reconciles payments into your bank ledger without manual checking.',
    category: 'Integrations & API',
  },
  'Customers and suppliers portal': {
    explanation: 'Self-service web portal where customers view account balances and pay bills, and suppliers view purchase orders and submit invoices.',
    whyItMatters: 'Drastically reduces WhatsApp messages and phone calls asking "what is my balance?" or "has my payment arrived?".',
    category: 'Operations & HR',
  },
  'Custom domain & white-label portal': {
    explanation: 'Hosts client billing portals on your company’s custom web address (e.g., portal.yourcompany.com) with custom logos and colors.',
    whyItMatters: 'Projects a professional, established corporate brand image to high-value B2B enterprise clients and international partners.',
    category: 'Integrations & API',
  },

  // HR & Operations
  'Standard HR and Payroll': {
    explanation: 'Automated monthly salary calculation, digital payslip generation, and statutory PAYE/Pension deduction tracking.',
    whyItMatters: 'Replaces error-prone payroll spreadsheets, handles salary advances, and generates employee payslips in under 2 minutes.',
    category: 'Operations & HR',
  },
  'Sales Agents and commission tracking': {
    explanation: 'Tags sales representatives and cashiers on customer invoices to calculate tiered percentage commissions and track sales targets.',
    whyItMatters: 'Motivates sales staff with transparent performance payouts and eliminates disputed manual commission spreadsheets.',
    category: 'Operations & HR',
  },
  'Standard Fixed asset register': {
    explanation: 'Digital catalog of company vehicles, store furniture, laptops, and plant machinery with automated monthly depreciation.',
    whyItMatters: 'Keeps track of company equipment across branches and ensures asset valuations reflect actual book depreciation.',
    category: 'Operations & HR',
  },
  'Post 1 job vacancy/week on Job Board': {
    explanation: 'Publish verified job openings to the MsmeBooks African business talent network to recruit qualified sales and bookkeeping staff.',
    whyItMatters: 'Helps expanding businesses hire vetted cashiers, accountants, and retail supervisors without paying expensive agency recruiter fees.',
    category: 'Operations & HR',
  },

  // Enterprise Governance
  'Multi-entity consolidation & cross-company ledgers': {
    explanation: 'Rolls up multiple legally registered subsidiary companies into consolidated balance sheets with intercompany transaction eliminations.',
    whyItMatters: 'Crucial for holding companies and conglomerate groups to evaluate unified group health and produce audited consolidated accounts.',
    category: 'Enterprise',
  },
  '99.9% uptime SLA guarantee': {
    explanation: 'Contractually guaranteed enterprise service level agreement backed by redundant cloud database clusters and priority monitoring.',
    whyItMatters: 'Guarantees your enterprise operations, POS checkouts, and customer portals experience minimal business disruption.',
    category: 'Enterprise',
  },
};

// Plain text dictionary mapping for backward compatibility
export const BUSINESS_TERMS_TOOLTIPS: Record<string, string> = Object.fromEntries(
  Object.entries(BUSINESS_TERMS_TOOLTIPS_DETAILS).map(([key, data]) => [key, data.explanation])
);

/**
 * Helper to resolve detailed structured tooltip data for any feature string.
 */
export function getFeatureTooltipDetails(
  featureText: string,
  planTooltips?: Record<string, string>
): FeatureTooltipData | null {
  if (!featureText) return null;

  // 1. Plan specific override
  if (planTooltips && planTooltips[featureText]) {
    return {
      explanation: planTooltips[featureText],
      whyItMatters: 'Tailored specifically for this subscription tier to maximize your operational efficiency.',
      category: 'Operations & HR',
    };
  }

  // 2. Exact match in dictionary
  if (BUSINESS_TERMS_TOOLTIPS_DETAILS[featureText]) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS[featureText];
  }

  // 3. Keyword / partial match
  const lower = featureText.toLowerCase();

  for (const [key, value] of Object.entries(BUSINESS_TERMS_TOOLTIPS_DETAILS)) {
    const keyLower = key.toLowerCase();
    if (lower.includes(keyLower) || keyLower.includes(lower)) {
      return value;
    }
  }

  // 4. Fallback heuristics for common terms
  if (lower.includes('api') || lower.includes('webhook') || lower.includes('integration')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['API Integrations'];
  }
  if (lower.includes('warehouse') || lower.includes('depot')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Multi-warehouse'];
  }
  if (lower.includes('double-entry') || lower.includes('bookkeeping')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Core double-entry bookkeeping'];
  }
  if (lower.includes('pos') || lower.includes('till') || lower.includes('register')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Single-register cloud POS'];
  }
  if (lower.includes('chart of accounts')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Unlimited advance chart of accounts'];
  }
  if (lower.includes('payroll') || lower.includes('payslip') || lower.includes('paye')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Standard HR and Payroll'];
  }
  if (lower.includes('fixed asset')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Standard Fixed asset register'];
  }
  if (lower.includes('commission') || lower.includes('sales agent')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Sales Agents and commission tracking'];
  }
  if (lower.includes('portal') || lower.includes('crm')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Customers and suppliers portal'];
  }
  if (lower.includes('multi-entity') || lower.includes('consolidation')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Multi-entity consolidation & cross-company ledgers'];
  }
  if (lower.includes('sla') || lower.includes('uptime')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['99.9% uptime SLA guarantee'];
  }
  if (lower.includes('batch') || lower.includes('expiry') || lower.includes('lot')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Batch, serial & expiration date tracking'];
  }
  if (lower.includes('serial') || lower.includes('imei')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Serial Number & IMEI Tracking'];
  }
  if (lower.includes('landed cost') || lower.includes('freight')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Landed cost tracking'];
  }
  if (lower.includes('price list')) {
    return BUSINESS_TERMS_TOOLTIPS_DETAILS['Price lists & tiered pricing'];
  }

  return null;
}

/**
 * Helper to resolve a simple tooltip explanation string.
 */
export function getFeatureTooltipText(
  featureText: string,
  planTooltips?: Record<string, string>
): string | null {
  const details = getFeatureTooltipDetails(featureText, planTooltips);
  return details ? details.explanation : null;
}

