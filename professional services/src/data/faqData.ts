export interface FAQItem {
  id: string;
  category: 'General & Services' | 'Booking & WhatsApp' | 'Firms & Verification' | 'Pricing & Payments' | 'Provider Partnership';
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General & Services',
    question: 'What professional services does MsmeBooks offer?',
    answer: 'MsmeBooks offers an end-to-end ecosystem of professional business services including Bookkeeping & Accounting Outsourcing, Corporate Tax & VAT Compliance, Payroll & Statutory Pensions, MsmeBooks Software & POS Setup, Hotel PMS & Restaurant Implementation, Business Advisory & Funding Readiness, Internal Stock Audits, Technology Integrations, and Staff Training.',
  },
  {
    id: 'faq-2',
    category: 'General & Services',
    question: 'Can I book an accountant through MsmeBooks?',
    answer: 'Yes! You can book qualified ICAN/ACCA chartered accountants and verified accounting firms directly through our platform for one-off health checks, historical books cleanup, or ongoing monthly bookkeeping retainers.',
  },
  {
    id: 'faq-3',
    category: 'Booking & WhatsApp',
    question: 'How do I book a professional service?',
    answer: 'You have two seamless options on every service: (1) Click "Book with a Professional Firm" to select your preferred verified firm, choose consultation mode (virtual or on-site), and schedule a confirmed date/time slot; or (2) Click "Book via WhatsApp" to instantly chat with our dedicated concierge on +2349158482622 with pre-filled service details.',
  },
  {
    id: 'faq-4',
    category: 'Booking & WhatsApp',
    question: 'Can I book directly through WhatsApp?',
    answer: 'Absolutely. Every service, package, and professional firm has a direct "Book via WhatsApp" button. Clicking it generates an official wa.me link directly to +2349158482622 with all your service details pre-formatted. A MsmeBooks customer success manager will immediately assist you.',
  },
  {
    id: 'faq-5',
    category: 'Firms & Verification',
    question: 'Can I select my preferred accounting or consulting firm?',
    answer: 'Yes. You can browse our directory of verified independent professional firms, compare their accreditations (ICAN, ACCA, CITN, ICAG, ICPAR), read authentic customer reviews, check their locations, and choose the exact firm you wish to engage.',
  },
  {
    id: 'faq-6',
    category: 'Firms & Verification',
    question: 'How are professional firms verified?',
    answer: 'Every firm undergoes rigorous vetting before receiving a "Verified" badge: we validate corporate registration documents (e.g. CAC/RGD), professional practice licenses (ICAN, ACCA, CITN, etc.), partner identities, track record, and technical proficiency on MsmeBooks software.',
  },
  {
    id: 'faq-7',
    category: 'Booking & WhatsApp',
    question: 'Are consultations available online?',
    answer: 'Yes! Virtual consultations via Google Meet, Zoom, or Microsoft Teams are supported across all services, making it easy to work with top-tier specialists regardless of your physical location.',
  },
  {
    id: 'faq-8',
    category: 'Booking & WhatsApp',
    question: 'Can I request an on-site business visit?',
    answer: 'Yes. For services like Supermarket POS hardware setup, Hotel PMS deployment, physical stocktakes, internal controls audits, and in-person cashier training, you can book an on-site visit to your business premises.',
  },
  {
    id: 'faq-9',
    category: 'General & Services',
    question: 'Does MsmeBooks provide bookkeeping services directly?',
    answer: 'Yes. MsmeBooks offers both in-house Core Team services and an extensive marketplace of independent certified partner firms, giving you the choice between our direct engineering team and specialized local practices.',
  },
  {
    id: 'faq-10',
    category: 'General & Services',
    question: 'Can a professional help me migrate from Sage, QuickBooks, Xero, Zoho Books, or Excel?',
    answer: 'Yes. Our software migration experts specialize in transferring customer databases, vendor ledgers, opening balances, historical transactions, and product catalogues from QuickBooks, Sage Pastel/50, Xero, Zoho, and spreadsheets into MsmeBooks with zero data loss.',
  },
  {
    id: 'faq-11',
    category: 'General & Services',
    question: 'Can I get assistance implementing MsmeBooks POS and Inventory?',
    answer: 'Yes. Our field implementation partners and in-house team provide turnkey retail setups, barcode printer configuration, scanner pairing, cash drawer linking, inventory uploads, and cashier coaching.',
  },
  {
    id: 'faq-12',
    category: 'General & Services',
    question: 'Do you provide hotel and restaurant system implementation?',
    answer: 'Yes. We configure MsmeBooks Hotel PMS (room folios, night audits, keycards) and Restaurant POS (table layouts, Kitchen Order Ticket printers, recipe costing) for hotels, guest houses, lounges, and eateries across Africa.',
  },
  {
    id: 'faq-13',
    category: 'General & Services',
    question: 'Can I book tax compliance or payroll advisory?',
    answer: 'Yes. You can engage accredited tax practitioners for annual Company Income Tax (CIT) filing, monthly VAT and WHT returns, and comprehensive payroll processing including PAYE and statutory pension remittances.',
  },
  {
    id: 'faq-14',
    category: 'General & Services',
    question: 'Are services available outside Nigeria?',
    answer: 'Yes. MsmeBooks professional services actively cover Nigeria, Ghana, Kenya, South Africa, Rwanda, and international businesses operating in or trading with Africa.',
  },
  {
    id: 'faq-15',
    category: 'Pricing & Payments',
    question: 'How much do professional services cost?',
    answer: 'Each service displays transparent indicative package pricing (e.g. Starter Consultation, Business Essentials, Business Growth). Initial diagnostic consultations start from ₦30,000 / $25, with monthly retainers and full implementations tailored to your business scale.',
  },
  {
    id: 'faq-16',
    category: 'Pricing & Payments',
    question: 'Can I request a customized quotation?',
    answer: 'Yes. For multi-branch enterprises, extensive historical records cleanup, or custom API projects, simply select "Request Custom Quote" or message our WhatsApp team to receive a tailored scope of work and quotation.',
  },
  {
    id: 'faq-17',
    category: 'Booking & WhatsApp',
    question: 'Can I change my appointment date or reschedule?',
    answer: 'Yes. You can reschedule eligible appointments through your "My Bookings" dashboard or by notifying your assigned professional firm or MsmeBooks concierge on WhatsApp at least 24 hours in advance.',
  },
  {
    id: 'faq-18',
    category: 'Pricing & Payments',
    question: 'What happens if a firm cancels an appointment?',
    answer: 'If a verified firm cannot make an appointment due to unforeseen circumstances, you will be offered immediate priority rescheduling or the option to be matched with an equivalent qualified firm, or a 100% refund.',
  },
  {
    id: 'faq-19',
    category: 'Pricing & Payments',
    question: 'How do payments and refunds work?',
    answer: 'Payments can be securely processed via Paystack, Flutterwave, Stripe, bank transfer, or milestone invoices. Funds are held in escrow until service milestones are verified, protecting both client and provider.',
  },
  {
    id: 'faq-20',
    category: 'Pricing & Payments',
    question: 'Can my business subscribe to monthly accounting support?',
    answer: 'Yes. Many clients choose our "Business Essentials" or "Business Growth" monthly retainers for ongoing ledger maintenance, monthly financial reports, and tax compliance without the overhead of hiring full-time staff.',
  },
  {
    id: 'faq-21',
    category: 'Provider Partnership',
    question: 'How do I register as a service provider?',
    answer: 'Click "Register Your Firm" on the partner banner to complete our provider application. Submit your company credentials, practice licenses, service specialties, and operating cities. Our vetting committee reviews applications within 48 hours.',
  },
  {
    id: 'faq-22',
    category: 'Provider Partnership',
    question: 'Can accounting firms offer their own custom services on MsmeBooks?',
    answer: 'Yes. Verified firms can customize their service packages, set their own rates, manage their client calendars, and receive qualified SME leads looking for accounting, tax, or business advisory.',
  },
  {
    id: 'faq-23',
    category: 'Provider Partnership',
    question: 'Does MsmeBooks charge providers a commission?',
    answer: 'MsmeBooks operates transparent partner tiers (Bronze 15%, Silver 20%, Partner Tier 30%, Platinum 40% recurring commission on eligible SaaS referrals). Service marketplace bookings operate under standard platform transaction terms.',
  },
  {
    id: 'faq-24',
    category: 'General & Services',
    question: 'How is my business financial information protected?',
    answer: 'We adhere strictly to the Nigeria Data Protection Act (NDPA), GDPR-level data governance, 256-bit SSL encryption, and strict non-disclosure agreements. Uploaded financial statements and records are never exposed publicly.',
  },
  {
    id: 'faq-25',
    category: 'General & Services',
    question: 'Can I use MsmeBooks software without purchasing professional services?',
    answer: 'Absolutely! MsmeBooks cloud software can be purchased and used independently as a self-service SaaS platform. Professional services are an optional ecosystem benefit whenever you need expert hands to accelerate your growth.',
  },
];
