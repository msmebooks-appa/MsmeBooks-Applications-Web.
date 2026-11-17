import { FaqItem, PolicySectionItem, RefundRequest } from '../types/policy';

export const POLICY_METADATA = {
  version: '2.4-DRAFT',
  status: 'Pending Management & Legal Ratification',
  effectiveDate: 'January 15, 2026',
  lastUpdatedDate: 'October 21, 2026',
  jurisdictions: 'Nigeria (FCCPC / NDPR), ECOWAS, East African Community, and Global SaaS Customers',
  officialSupportEmail: 'billing@msmebooks.org',
  officialWhatsAppNumber: '+2349158482622',
  officialWhatsAppFormatted: '+234 915 848 2622',
  officialWebsite: 'https://www.msmebooks.org',
  supportHours: 'Monday – Friday: 8:00 AM – 6:00 PM (WAT) · Saturday: 9:00 AM – 2:00 PM (WAT)',
};

export const POLICY_NAV_SECTIONS: PolicySectionItem[] = [
  { id: 'overview', number: '01', title: 'Policy Overview', summary: 'Foundational principles of transparency, fairness, and commercial framework.' },
  { id: 'subscriptions', number: '02', title: 'Subscription Plans', summary: 'Terms for Free, Monthly, Annual, and Enterprise tiers.' },
  { id: 'addons', number: '03', title: 'Add-ons & Marketplace', summary: 'Modular features, 3rd party marketplace extensions, and license keys.' },
  { id: 'professional-services', number: '04', title: 'Professional Services', summary: 'Implementation, accounting setup, data migration, and training refunds.' },
  { id: 'eligibility-matrix', number: '05', title: 'Refund Eligibility & Exclusions', summary: '10-category detailed assessment matrix and non-waivable statutory rights.' },
  { id: 'cancellation-procedure', number: '06', title: 'Cancellation & Renewals', summary: 'Step-by-step self-service cancellation and automatic renewal policies.' },
  { id: 'failed-duplicate-payments', number: '07', title: 'Failed & Duplicate Payments', summary: 'Handling overcharges, duplicate debits, and bank network reconciliations.' },
  { id: 'refund-processing', number: '08', title: 'Refund Processing & Gateways', summary: 'Paystack, Flutterwave, Stripe, PayPal, and Mobile Money timelines.' },
  { id: 'partners-resellers', number: '09', title: 'Partner & Reseller Purchases', summary: 'Policies for certified accountants, VARs, distributors, and agents.' },
  { id: 'promotions-discounts', number: '10', title: 'Promotional Offers & Credits', summary: 'Discounted subscriptions, promo codes, and annual prepayment incentives.' },
  { id: 'account-suspension', number: '11', title: 'Suspension & Termination', summary: 'Involuntary suspension, policy breaches, and non-payment consequences.' },
  { id: 'data-retention', number: '12', title: 'Data Retention & Closure', summary: '7-year accounting record compliance, exports, and permanent deletion.' },
  { id: 'payment-disputes', number: '13', title: 'Disputes & Chargebacks', summary: 'Pre-chargeback billing resolution and friendly dispute procedures.' },
  { id: 'statutory-rights', number: '14', title: 'Statutory Consumer Rights', summary: 'Supremacy of mandatory consumer protection legislation over contract terms.' },
  { id: 'policy-updates', number: '15', title: 'Policy Updates & Notices', summary: 'Revision cycles, notification procedures, and archival records.' },
  { id: 'faq-section', number: '16', title: 'Frequently Asked Questions', summary: 'Searchable knowledge base answering 24+ common subscriber questions.' },
  { id: 'customer-support', number: '17', title: 'Customer Support Channels', summary: 'Direct billing ticket, verified WhatsApp link, and office hours.' },
];

export const ELIGIBILITY_RULES = [
  {
    type: 'Duplicate Payment',
    guidance: 'Eligible for 100% refund of duplicate charge following verification.',
    timeframe: 'Report within 14 business days of occurrence.',
    remedy: 'Reversal to original payment method or instant account credit at subscriber preference.',
    badgeType: 'eligible'
  },
  {
    type: 'Incorrect Billing Amount',
    guidance: 'Subject to immediate billing verification and discrepancy correction.',
    timeframe: 'Report within 30 calendar days of invoice date.',
    remedy: 'Credit note or immediate refund of overbilled differential.',
    badgeType: 'eligible'
  },
  {
    type: 'Unauthorized Transaction',
    guidance: 'Subject to internal fraud investigation and payment provider security review.',
    timeframe: 'Report immediately (within 48 hours of detection).',
    remedy: 'Immediate account lock, credential rotation, and gateway chargeback support if validated.',
    badgeType: 'conditional'
  },
  {
    type: 'Monthly Subscription Cancellation',
    guidance: 'Future recurring billing stops immediately at cycle conclusion. Current month is generally non-refundable.',
    timeframe: 'Initiate prior to next automated renewal date.',
    remedy: 'Full service access maintained through end of current paid 30-day billing cycle.',
    badgeType: 'non-refundable'
  },
  {
    type: 'Annual Subscription Cancellation',
    guidance: 'Evaluated under approved annual refund rules. Exceptional 14-day onboarding grace window applies.',
    timeframe: 'Within 14 calendar days of initial annual purchase.',
    remedy: 'Prorated refund or credit after deducting 1 month standard retail rate and gateway transaction costs.',
    badgeType: 'conditional'
  },
  {
    type: 'Technical Service Failure / Severe Outage',
    guidance: 'Reviewed under MsmeBooks Service Level Commitments (SLA) and applicable consumer laws.',
    timeframe: 'Incident logged within 7 business days of outage.',
    remedy: 'Service credit or partial refund proportional to verified downtime duration.',
    badgeType: 'conditional'
  },
  {
    type: 'Unused Add-on / Inactive Module',
    guidance: 'Subject to activation status, provisioned resources, and specific module terms.',
    timeframe: 'Within 7 calendar days if zero data activity recorded.',
    remedy: 'Full refund if unactivated; prorated store credit if provisioned but unused.',
    badgeType: 'conditional'
  },
  {
    type: 'Completed Professional Service',
    guidance: 'Non-refundable once milestone sign-off or delivery acceptance has been executed.',
    timeframe: 'Subject to contractual defect warranty period.',
    remedy: 'Remediation of deficient configuration without additional consulting charges.',
    badgeType: 'non-refundable'
  },
  {
    type: 'Custom Software Development',
    guidance: 'Governed strictly by executed Statement of Work (SOW) milestone schedules.',
    timeframe: 'As stipulated in enterprise agreement.',
    remedy: 'Unperformed milestone funds returned; completed engineering hours non-refundable.',
    badgeType: 'conditional'
  },
  {
    type: 'Partner or Reseller Transaction',
    guidance: 'Governed by originating reseller invoice, partner agreement, and merchant of record status.',
    timeframe: 'Varies by authorized reseller terms.',
    remedy: 'Customer directed to contracting partner; MsmeBooks arbitrates unresolved disputes.',
    badgeType: 'partner'
  }
];

export const PAYMENT_GATEWAY_DETAILS = [
  {
    name: 'Paystack',
    supportedRegions: 'Nigeria, Ghana, Kenya, South Africa',
    currencies: 'NGN, GHS, KES, ZAR, USD',
    approvalTime: '1 – 3 business days (MsmeBooks review)',
    bankSettlementTime: '3 – 7 business days (local banking network)',
    channel: 'Cards, Direct Bank Debit, USSD, Apple Pay'
  },
  {
    name: 'Flutterwave',
    supportedRegions: 'Pan-African & Global Coverage (30+ currencies)',
    currencies: 'NGN, KES, UGX, TZS, RWF, GHS, XAF, MAD, EGP, ZMW, USD, GBP, EUR, AED, ZIP',
    approvalTime: '1 – 3 business days (MsmeBooks review)',
    bankSettlementTime: '3 – 8 business days (bank/telecom network)',
    channel: 'Credit/Debit cards, Barter, Mobile Money, Bank Transfer'
  },
  {
    name: 'Stripe',
    supportedRegions: 'International & Global Enterprise Subscribers',
    currencies: 'USD, EUR, GBP, AED, CAD, AUD',
    approvalTime: '1 – 2 business days (MsmeBooks review)',
    bankSettlementTime: '5 – 10 business days (card network settlement)',
    channel: 'Visa, Mastercard, American Express, SEPA'
  },
  {
    name: 'Mobile Money (M-Pesa / MTN / Airtel)',
    supportedRegions: 'Kenya, Uganda, Ghana, Rwanda, Tanzania, Zambia',
    currencies: 'KES, GHS, UGX, RWF, ZMW, XAF',
    approvalTime: '1 – 2 business days (MsmeBooks review)',
    bankSettlementTime: '24 – 48 hours (wallet reversal directly into registered phone line)',
    channel: 'Mobile Wallet STK Push & Direct Till Reversals'
  },
  {
    name: 'Direct Electronic Bank Transfer (NIBSS / EFT)',
    supportedRegions: 'Direct corporate treasury accounts',
    currencies: 'NGN, USD, KES, ZAR, GHS, EGP, MAD, ZIP',
    approvalTime: '2 – 4 business days (treasury verification)',
    bankSettlementTime: '2 – 5 business days (central clearing house)',
    channel: 'Direct wire / NIP / RTGS into verified source business account'
  }
];

export const INITIAL_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: 'req_001',
    referenceNumber: 'MB-REF-2026-8841',
    customerName: 'Amina Bello',
    businessName: 'Kano Agro-Logistics Ventures',
    accountEmail: 'amina.bello@kanoagro.ng',
    serviceType: 'Annual Growth Plan Subscription',
    invoiceReference: 'INV-2026-09412',
    paymentDate: '2026-10-14',
    amount: 145000,
    currency: 'NGN',
    paymentMethod: 'Paystack',
    reason: 'Duplicate payment due to network timeout during renewal',
    detailedExplanation: 'Our accountant initiated an annual plan renewal; the payment gateway timed out on the first attempt so she retried. Both charges cleared our corporate account.',
    consentAccepted: true,
    stage: 'processed',
    submittedAt: '2026-10-15 09:24 WAT',
    lastUpdatedAt: '2026-10-17 14:10 WAT',
    reviewerNotes: 'Verified duplicate charge ID pstk_txn_9948210. Duplicate of ₦145,000 processed via Paystack reversal.',
    gatewayTransactionId: 'pstk_txn_9948210',
    auditTrail: [
      { timestamp: '2026-10-15 09:24 WAT', actor: 'Amina Bello', action: 'Submitted Request', note: 'Public refund portal submission with bank statement attachment' },
      { timestamp: '2026-10-15 11:45 WAT', actor: 'Billing Compliance (MsmeBooks)', action: 'Under Review', note: 'Cross-referenced transaction against Paystack merchant dashboard' },
      { timestamp: '2026-10-16 10:30 WAT', actor: 'Lead Finance Officer', action: 'Approved', note: 'Duplicate confirmed. Reversal authorization issued.' },
      { timestamp: '2026-10-17 14:10 WAT', actor: 'Paystack Gateway Webhook', action: 'Refund Processed', note: 'Funds credited back to Zenith Bank Mastercard ending 4018.' }
    ]
  },
  {
    id: 'req_002',
    referenceNumber: 'MB-REF-2026-7290',
    customerName: 'Chidi Okonkwo',
    businessName: 'Apex Prime Retail Hub',
    accountEmail: 'billing@apexprimeretail.com',
    serviceType: 'POS Multi-Register Add-on (3 Registers)',
    invoiceReference: 'INV-2026-10204',
    paymentDate: '2026-10-18',
    amount: 38000,
    currency: 'NGN',
    paymentMethod: 'Flutterwave',
    reason: 'Accidental add-on purchase for unneeded branch',
    detailedExplanation: 'We intended to purchase the inventory barcode module but inadvertently selected the multi-register POS add-on. We have not configured or connected any additional registers.',
    consentAccepted: true,
    stage: 'under_review',
    submittedAt: '2026-10-19 16:05 WAT',
    lastUpdatedAt: '2026-10-20 09:12 WAT',
    reviewerNotes: 'Telemetry confirmed 0 registers enrolled. Checking whether subscriber prefers switch to Barcode Module or refund.',
    gatewayTransactionId: 'flw_ref_44810294',
    auditTrail: [
      { timestamp: '2026-10-19 16:05 WAT', actor: 'Chidi Okonkwo', action: 'Submitted Request', note: 'Requested module swap or full refund.' },
      { timestamp: '2026-10-20 09:12 WAT', actor: 'Billing Support Agent', action: 'Under Review', note: 'Verified zero terminal activations in database.' }
    ]
  },
  {
    id: 'req_003',
    referenceNumber: 'MB-REF-2026-9104',
    customerName: 'David Mwangi',
    businessName: 'Nairobi Fresh Foods Ltd',
    accountEmail: 'd.mwangi@nairobfresh.co.ke',
    serviceType: 'Implementation & Data Migration Package',
    invoiceReference: 'INV-2026-08190',
    paymentDate: '2026-10-10',
    amount: 450,
    currency: 'USD',
    paymentMethod: 'Stripe',
    reason: 'Project postponed by internal board prior to service commencement',
    detailedExplanation: 'We contracted MsmeBooks professional services for custom chart-of-accounts migration. Our CFO requested a 6-month hold on the migration before work started.',
    consentAccepted: true,
    stage: 'additional_info',
    submittedAt: '2026-10-12 11:30 EAT',
    lastUpdatedAt: '2026-10-14 15:40 EAT',
    reviewerNotes: 'Implementation team had not commenced work. Waiting for written board deferral confirmation to issue credit note or card reversal.',
    gatewayTransactionId: 'ch_3N8019Xk8019Lp',
    auditTrail: [
      { timestamp: '2026-10-12 11:30 EAT', actor: 'David Mwangi', action: 'Submitted Request', note: 'Requested cancellation prior to kickoff.' },
      { timestamp: '2026-10-13 14:00 EAT', actor: 'Services Director', action: 'Under Review', note: 'Confirmed zero hours billed by engineering team.' },
      { timestamp: '2026-10-14 15:40 EAT', actor: 'Billing Officer', action: 'Additional Information Requested', note: 'Requested confirmation of preference between 12-month service credit or card reversal less gateway fee.' }
    ]
  }
];

export const POLICY_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Subscriptions',
    question: 'Can I get a refund after subscribing to MsmeBooks?',
    answer: 'Refund eligibility depends on your subscription type, billing timing, and the nature of the request. For monthly subscriptions, payments are generally non-refundable once billed, but you can cancel anytime to stop future renewals. For annual subscriptions, MsmeBooks offers an exceptional 14-day onboarding review window from your initial purchase date for new subscribers if the platform does not meet your business specifications, subject to administrative and payment gateway processing deductions.'
  },
  {
    id: 'faq-2',
    category: 'Subscriptions',
    question: 'Can I cancel my monthly subscription at any time?',
    answer: 'Yes. You can cancel your monthly subscription at any time directly through your dashboard under Settings → Billing & Subscription → Manage Subscription. When you cancel, automatic billing ceases immediately, and your business retains full software access through the end of your current 30-day paid billing cycle.'
  },
  {
    id: 'faq-3',
    category: 'Subscriptions',
    question: 'Will my subscription renew automatically?',
    answer: 'Yes. To ensure uninterrupted service for your invoicing, POS sales, and tax accounting records, all monthly and annual subscriptions renew automatically at the end of each billing cycle unless you disable automatic renewal or cancel before the renewal timestamp.'
  },
  {
    id: 'faq-4',
    category: 'Subscriptions',
    question: 'What happens if I cancel my annual plan early?',
    answer: 'If you cancel an annual plan after the initial 14-day review window, your plan will remain active until the end of the 12-month prepaid term without automatically renewing. Under standard commercial terms, unused months are non-refundable unless approved under extraordinary circumstances (e.g., documented permanent business cessation or prolonged unresolvable technical outage attributable to MsmeBooks).'
  },
  {
    id: 'faq-5',
    category: 'Subscriptions',
    question: 'Can I receive a refund for unused subscription months?',
    answer: 'Under standard SaaS subscription contracts, payments are prepaid for license access rather than actual usage. Unused days on monthly plans and unused months on annual plans are generally non-refundable. However, our customer success team can evaluate downgrade credits or subscription pauses in qualifying circumstances.'
  },
  {
    id: 'faq-6',
    category: 'Subscriptions',
    question: 'Are Free Plan users eligible for refunds?',
    answer: 'The MsmeBooks Free Plan is completely free of charge and carries no subscription fees to refund. However, if a Free Plan user purchases a paid add-on module (such as extra POS registers, WhatsApp invoice notifications, or payroll seats), those specific paid add-ons are governed by our standard add-on refund policies.'
  },
  {
    id: 'faq-7',
    category: 'Payment & Disputes',
    question: 'What happens if I accidentally subscribe twice?',
    answer: 'If network instability or duplicate clicks caused two identical subscription payments on the same account within a 48-hour window, you are 100% eligible for an immediate full refund of the duplicate charge. Please file a request via our Refund Tracker or WhatsApp billing desk with your invoice references.'
  },
  {
    id: 'faq-8',
    category: 'Payment & Disputes',
    question: 'How do I report a duplicate payment?',
    answer: 'You can submit a ticket instantly via the interactive Refund Request Form on this page, email billing@msmebooks.org with the subject "URGENT: Duplicate Payment Reference", or message our verified WhatsApp support line at +234 915 848 2622. Duplicate payment investigations are expedited within 24 business hours.'
  },
  {
    id: 'faq-9',
    category: 'Add-ons & Services',
    question: 'Can I get a refund for an add-on module?',
    answer: 'Add-on module purchases (e.g., Inventory Barcoding, Hotel Room Management, Multi-branch sync) can be refunded within 7 calendar days of purchase, provided that the module has not been actively deployed or used to record transactional data. Once operational data has been committed through an add-on, fees are non-refundable.'
  },
  {
    id: 'faq-10',
    category: 'Add-ons & Services',
    question: 'Are marketplace purchases refundable?',
    answer: 'MsmeBooks distinguishes between native proprietary add-ons (built and supported directly by MsmeBooks) and third-party marketplace integrations. Third-party extensions are subject to the specific refund policies of the external software provider. MsmeBooks will facilitate communication but cannot unilaterally refund third-party developer licensing fees.'
  },
  {
    id: 'faq-11',
    category: 'Add-ons & Services',
    question: 'Can I cancel a booked implementation service?',
    answer: 'Yes. If you cancel an implementation package (such as chart-of-accounts setup, POS deployment, or staff training) at least 48 hours prior to the scheduled kickoff, you are eligible for a full refund minus a 5% administrative and payment gateway processing fee.'
  },
  {
    id: 'faq-12',
    category: 'Add-ons & Services',
    question: 'What happens if a consultant has already started work?',
    answer: 'Where implementation work is already in progress, refunds are evaluated against completed contractual milestones and logged professional hours. Unperformed milestones will be refunded or credited, while completed and delivered work is non-refundable.'
  },
  {
    id: 'faq-13',
    category: 'Add-ons & Services',
    question: 'Can I request a refund for data migration?',
    answer: 'Data migration requires substantial engineering hours to extract, clean, map, and import historical ledgers. Once migration scripts have executed and data is imported into your staging or live environment, migration fees are non-refundable. If errors occur in the migrated dataset, MsmeBooks will rectify the data mapping at no additional charge under our delivery warranty.'
  },
  {
    id: 'faq-14',
    category: 'Payment & Disputes',
    question: 'What happens if a purchased feature does not work?',
    answer: 'If a purchased feature suffers from a verified defect that prevents its core commercial use and our technical team cannot remediate it within 7 business days of an official support ticket, you are entitled to a full refund or service credit for the affected feature period, in compliance with applicable consumer protection laws.'
  },
  {
    id: 'faq-15',
    category: 'Payment & Disputes',
    question: 'How long does an approved refund take to reach my bank?',
    answer: 'MsmeBooks completes internal billing review within 1 to 3 business days. Once approved, the payment gateway releases funds back to your original source: Paystack (3–7 business days), Flutterwave (3–8 business days), Stripe/Cards (5–10 business days), and Mobile Money wallets (24–48 hours).'
  },
  {
    id: 'faq-16',
    category: 'Payment & Disputes',
    question: 'Will my refund be paid into my original account?',
    answer: 'Yes. In strict compliance with global Anti-Money Laundering (AML) standards and central bank regulations, refunds are always credited back to the original bank account, debit card, or mobile money wallet used during checkout. We do not remit refunds to unverified third-party bank accounts or cash.'
  },
  {
    id: 'faq-17',
    category: 'Partners & Data',
    question: 'Can I request a refund through a reseller or certified accountant?',
    answer: 'If you purchased your MsmeBooks license through an authorized reseller, certified accounting firm, or distributor who acted as the Merchant of Record, your refund request must be processed through that partner in accordance with their sales agreement. If you purchased directly from www.msmebooks.org, our direct billing team handles your request.'
  },
  {
    id: 'faq-18',
    category: 'Partners & Data',
    question: 'What happens to my business data after cancellation?',
    answer: 'When a subscription is cancelled, your accounting records, invoices, customer lists, and POS receipts remain protected in read-only format for a minimum of 90 days, enabling you to export comprehensive financial statements in Excel/CSV or PDF formats. MsmeBooks retains audit-compliant financial records for 7 years in line with statutory tax legislation before secure archival.'
  },
  {
    id: 'faq-19',
    category: 'Subscriptions',
    question: 'Can I reactivate my cancelled subscription?',
    answer: 'Yes! You can reactivate your account at any time within your retention window simply by logging into your MsmeBooks dashboard and selecting a subscription plan. All previous charts of accounts, products, customer balances, and historical ledgers will remain completely intact.'
  },
  {
    id: 'faq-20',
    category: 'Payment & Disputes',
    question: 'How do I contact MsmeBooks billing support directly?',
    answer: 'You can reach our dedicated billing desk via email at billing@msmebooks.org, submit a request directly on this page, or chat with our verified team on WhatsApp at +234 915 848 2622 during business hours (8:00 AM – 6:00 PM WAT, Monday to Friday).'
  },
  {
    id: 'faq-21',
    category: 'Subscriptions',
    question: 'Are discounted subscriptions and promotional vouchers refundable?',
    answer: 'Subscriptions purchased during promotional discount campaigns or black Friday specials are subject to standard non-refundable monthly/annual terms. In rare cases where a refund is approved for a discounted annual plan, the refund calculation reflects the actual discounted amount paid, not the standard retail list price.'
  },
  {
    id: 'faq-22',
    category: 'Payment & Disputes',
    question: 'What happens if a payment gateway charges me twice for one invoice?',
    answer: 'When an upstream payment gateway generates two debit alerts for a single transaction reference, our system reconciles the anomaly with Paystack or Flutterwave. The extra transaction will be queued for automatic reversal, or credited to your account if you prefer.'
  },
  {
    id: 'faq-23',
    category: 'Payment & Disputes',
    question: 'Can I dispute an unauthorized payment or fraudulent debit?',
    answer: 'If you notice an unrecognized charge from MsmeBooks, contact our security desk immediately at billing@msmebooks.org or +234 915 848 2622. We will immediately trace the transaction reference, freeze unauthorized account access, and cooperate fully with your financial institution.'
  },
  {
    id: 'faq-24',
    category: 'Partners & Data',
    question: 'Do refund conditions differ between Nigeria and other countries?',
    answer: 'Our core commercial policy applies universally across Africa and international territories. However, where local mandatory consumer protection statutes (such as the Nigerian FCCPA, Kenyan Consumer Protection Act, South African CPA, or UK/EU Consumer Rights) mandate specific withdrawal rights, local non-waivable statutory provisions prevail over contract terms.'
  }
];
