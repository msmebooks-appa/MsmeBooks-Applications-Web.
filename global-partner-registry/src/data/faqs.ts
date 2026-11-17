export interface FaqItem {
  question: string;
  answer: string;
  category: 'Finding a Partner' | 'Services & Support' | 'Becoming a Partner';
}

export const FAQS_DATA: FaqItem[] = [
  {
    question: 'What is the MsmeBooks Partner Network?',
    answer: 'The MsmeBooks Partner Network is a global ecosystem of certified accountants, bookkeeping practices, IT integrators, POS hardware providers, and business consultants. Partners help micro, small, and medium businesses adopt, customize, and optimize MsmeBooks for daily accounting, invoicing, inventory, multi-branch POS, and tax compliance.',
    category: 'Finding a Partner'
  },
  {
    question: 'How do I find a MsmeBooks partner?',
    answer: 'You can search our global registry by country, city, industry, partner type (accountant, POS agent, IT company), or specific services (e.g., inventory setup, tax compliance). You can also use our interactive "Best Match" tool to answer 4 quick questions about your business, and we will recommend the top verified partners suited to your needs.',
    category: 'Finding a Partner'
  },
  {
    question: 'How are partners verified?',
    answer: 'Every partner displaying the "✓ Verified MsmeBooks Partner" badge undergoes strict vetting: 1) Business identity and legal registration verification, 2) Official MsmeBooks partner status confirmation, 3) Service skill and reference checks, 4) Physical office or operating jurisdiction validation, and 5) Completion of mandatory MsmeBooks product training and certification.',
    category: 'Finding a Partner'
  },
  {
    question: 'Can I search for a partner by country?',
    answer: 'Yes. The directory supports targeted country exploration across key African markets (Nigeria, Ghana, Kenya, South Africa, Uganda, Tanzania, Rwanda, Cameroon, Côte d\'Ivoire, Senegal, Egypt, Morocco, Ethiopia, Zambia, Zimbabwe, Botswana, Namibia) as well as global trade hubs (United Kingdom, United States, Canada, UAE, India, and Australia).',
    category: 'Finding a Partner'
  },
  {
    question: 'Can I find a partner in my city?',
    answer: 'Absolutely. Partners can be filtered by specific cities such as Lagos, Nairobi, Accra, Johannesburg, Cairo, Douala, Kampala, Dar es Salaam, Kigali, London, Atlanta, and Dubai. Furthermore, many partners offer certified remote support for businesses in regional towns.',
    category: 'Finding a Partner'
  },
  {
    question: 'What services do MsmeBooks partners provide?',
    answer: 'Partners offer end-to-end business technology services including: software implementation, historical ledger data migration, chart of accounts design, POS hardware provisioning & barcode scanner pairing, warehouse inventory counts, staff training, tax authority compliance (FIRS, GRA, KRA, SARS, URA, TRA, etc.), and ongoing retained advisory.',
    category: 'Services & Support'
  },
  {
    question: 'Can partners help with accounting setup?',
    answer: 'Yes. Verified accounting partners configure your chart of accounts, bank feeds, recurring invoices, supplier ledger terms, expense categories, automated VAT/WHT rates, and financial reports so your books are accurate from day one.',
    category: 'Services & Support'
  },
  {
    question: 'Can partners help with POS installation?',
    answer: 'Yes. Our POS specialist partners provide turnkey point-of-sale setups: supplying rugged thermal receipt printers, touch POS terminals, barcode label printers, cash drawers, and offline-ready sync configurations for retail stores, supermarkets, restaurants, and pharmacies.',
    category: 'Services & Support'
  },
  {
    question: 'Can partners help with inventory setup?',
    answer: 'Yes. Partners assist with SKU catalog organization, batch and expiration date tracking, barcode generation, multi-warehouse stock allocation, minimum reorder alerts, and physical stock count uploads.',
    category: 'Services & Support'
  },
  {
    question: 'Can partners support multiple branches?',
    answer: 'Yes. MsmeBooks is built natively for multi-branch and multi-warehouse operations. Partners specialize in connecting multiple retail outlets, centralizing master product catalogs, configuring inter-branch transfer slips, and setting granular branch manager permissions.',
    category: 'Services & Support'
  },
  {
    question: 'How do I become a MsmeBooks partner?',
    answer: 'To join the partner ecosystem, click the "Become a Partner" button on this portal and submit your organization’s details. Our partner team reviews applications within 48 hours, issues onboarding materials, and schedules your official certification training.',
    category: 'Becoming a Partner'
  },
  {
    question: 'How does the partner commission work?',
    answer: 'MsmeBooks offers industry-leading recurring monthly or annual commission structures across 4 tiers: Bronze Partner (15%), Silver Partner (20%), Gold Partner (30%), and Platinum Partner (40%). Commissions are paid out monthly for the active lifetime of the customer accounts you onboard and service.',
    category: 'Becoming a Partner'
  },
  {
    question: 'Can international businesses join the partner network?',
    answer: 'Yes. We welcome accounting firms, diaspora advisors, and software integrators located in the UK, North America, Middle East, Europe, and Asia who service African diaspora businesses, cross-border traders, or local subsidiaries.',
    category: 'Becoming a Partner'
  }
];
