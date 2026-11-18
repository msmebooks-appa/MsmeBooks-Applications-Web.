import { ProductModule } from '../types/faq';

export const PRODUCT_MODULES: ProductModule[] = [
  { id: 'module-accounting', title: 'Accounting & Ledger', description: 'General ledger, charts of accounts, P&L, balance sheets, taxes & audit trails' },
  { id: 'module-pos', title: 'Point of Sale (POS)', description: 'Cashier checkout, thermal printers, barcode scanner, and shifts' },
  { id: 'module-inventory', title: 'Inventory & Warehousing', description: 'Stock levels, multi-depot transfers, batch/expiry alerts & valuation' },
  { id: 'module-invoicing', title: 'Invoicing & Receivables', description: 'Customer quotes, automated billing, payment links & aging summaries' },
  { id: 'module-payroll', title: 'HR & Payroll', description: 'Employee wages, statutory PAYE deductions, payslips & attendance' },
  { id: 'module-pms', title: 'Hotel PMS Add-on', description: 'Room reservation engine, guest folios, housekeeping & night audits' },
  { id: 'module-multibranch', title: 'Multi-Branch & Multi-Company', description: 'Consolidated accounts, branch user permissions & cross-location transfers' },
  { id: 'module-ai', title: 'AI Business Assistant', description: 'Smart trend summaries, conversational insights & automation rules' },
  { id: 'module-gateways', title: 'Payment Gateways', description: 'Paystack, Flutterwave, M-Pesa, Stripe & bank reconciliation' },
  { id: 'module-marketplace', title: 'Marketplace & Add-ons', description: 'Custom plugins, third-party connectors & developer extensions' }
];

export interface RegionInfo {
  code: string;
  country: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  popularGateways: string[];
  localSupportNumber: string;
  taxLabel: string;
  taxRateNote: string;
}

export const REGIONS_DATA: RegionInfo[] = [
  {
    code: 'NG',
    country: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    currencySymbol: '₦',
    popularGateways: ['Paystack', 'Flutterwave', 'Transactpay', 'Direct Bank Transfer / NIBSS'],
    localSupportNumber: '+234 915 848 2622',
    taxLabel: 'VAT (7.5%) & WHT',
    taxRateNote: 'Supports FIRS e-tax breakdowns, state tax classifications, and automated VAT invoices.'
  },
  {
    code: 'KE',
    country: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    currencySymbol: 'KSh',
    popularGateways: ['M-Pesa (Safaricom STK Push / Till / Paybill)', 'Flutterwave', 'Pesapal', 'Card Payments'],
    localSupportNumber: '+254 700 000 000 (Hotline)',
    taxLabel: 'VAT (16%) & eTIMS compliant export',
    taxRateNote: 'Supports KRA eTIMS invoice numbering format and standard Kenya VAT classifications.'
  },
  {
    code: 'GH',
    country: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    popularGateways: ['MTN Mobile Money', 'Vodafone Cash', 'Paystack Ghana', 'Hubtel'],
    localSupportNumber: '+233 200 000 000',
    taxLabel: 'GRA Standard Levy (NHIL, GETFund, COVID, VAT)',
    taxRateNote: 'Supports Ghana Revenue Authority multi-tier levies computation.'
  },
  {
    code: 'ZA',
    country: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R',
    popularGateways: ['PayFast', 'Ozow Instant EFT', 'Stripe', 'Yoco'],
    localSupportNumber: '+27 10 000 0000',
    taxLabel: 'SARS VAT (15%)',
    taxRateNote: 'Automated VAT 201 reporting calculations and standard tax invoice requirements.'
  },
  {
    code: 'RW',
    country: 'Rwanda',
    flag: '🇷🇼',
    currency: 'RWF',
    currencySymbol: 'RF',
    popularGateways: ['MTN MoMo Rwanda', 'Airtel Money', 'Flutterwave'],
    localSupportNumber: '+250 780 000 000',
    taxLabel: 'RRA VAT (18%)',
    taxRateNote: 'Configured for Rwanda Revenue Authority electronic billing machines guidelines.'
  },
  {
    code: 'GLOBAL',
    country: 'Global / International',
    flag: '🌍',
    currency: 'USD',
    currencySymbol: '$',
    popularGateways: ['Stripe', 'PayPal', 'Wire Transfer', 'Multi-Currency Gateway'],
    localSupportNumber: '+234 915 848 2622',
    taxLabel: 'Custom Tax / Sales Tax / Zero-Rated',
    taxRateNote: 'Fully customizable sales tax, GST, or zero-rated tax configuration for any jurisdiction.'
  }
];
