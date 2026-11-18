import { AgreementArticle, AgreementSchedule } from '../types/partner';

export const AGREEMENT_META = {
  title: 'MsmeBooks Global Partner, Reseller & Affiliate Agreement',
  version: 'v2026.4',
  effectiveDate: 'October 2026',
  governingLaw: 'Applicable Regional Commercial Jurisdiction & International Arbitration Rules',
  legalEntity: 'MsmeBooks Enterprise Technologies Limited',
  portalUrl: 'www.msmebooks.org/partners',
  supportContact: 'partnerships@msmebooks.org'
};

export const AGREEMENT_ARTICLES: AgreementArticle[] = [
  {
    number: 1,
    title: 'Introduction and Contracting Parties',
    category: 'Parties & Scope',
    summary: 'Identifies MsmeBooks Enterprise Technologies Limited and the approved Partner, establishing mutual legal obligations and effective date.',
    content: `This Master Partner and Reseller Agreement (the "Agreement") is entered into by and between MsmeBooks Enterprise Technologies Limited ("MsmeBooks", "Company", "we", "us"), the owner and operator of the MsmeBooks All-in-One Accounting, POS, Inventory & Business Management Platform (www.msmebooks.org), and the registered entity, firm, or professional identified in the approved Partner Application ("Partner", "you", "your"). This Agreement takes effect immediately upon electronic execution by the Partner and formal acceptance into the MsmeBooks Partner Ecosystem by MsmeBooks ("Effective Date"). Both MsmeBooks and the Partner may be referred to individually as a "Party" and collectively as the "Parties".`
  },
  {
    number: 2,
    title: 'Definitions and Interpretation',
    category: 'Parties & Scope',
    summary: 'Defines Qualified Customers, Net Subscription Revenue, Commission, Attribution Window, Confidential Information, and Partner Portal.',
    content: `In this Agreement, unless context explicitly provides otherwise:
(a) "Qualified Customer" means a distinct commercial entity or natural person that registers an active paying subscription for MsmeBooks software via the Partner's registered referral link, registered coupon code, or verified sales registration, having had no prior active subscription or direct sales contact with MsmeBooks within the preceding one hundred and eighty (180) days.
(b) "Net Subscription Revenue" means the actual recurring license or subscription monies collected by MsmeBooks from a Qualified Customer, strictly excluding value-added taxes (VAT), withholding taxes, credit card processing surcharges, bad-debt write-offs, payment gateway fees, and refunded or chargeback transactions.
(c) "Commission" means the percentage of Net Subscription Revenue payable by MsmeBooks to the Partner in accordance with the applicable Partner Tier specified in Schedule B.
(d) "Attribution Window" means the ninety (90) calendar day tracking window following a prospect's initial visit through the Partner's referral tracking link during which an eligible account creation will be formally attributed to the Partner.
(e) "Partner Portal" means the secure web-based portal at www.msmebooks.org through which the Partner views registered referrals, generated commissions, marketing collateral, and compliance statuses.`
  },
  {
    number: 3,
    title: 'Appointment and Nature of Relationship',
    category: 'Parties & Scope',
    summary: 'Specifies non-exclusive appointment, independent-contractor status, lack of employer-employee relationship, and territorial limitations.',
    content: `MsmeBooks hereby grants the Partner a non-exclusive, revocable, non-transferable appointment to market, introduce, refer, and, where certified, implement MsmeBooks software to prospective business customers within the authorised geographic territories agreed upon. Nothing in this Agreement creates any partnership, joint venture, agency, franchise, sales representative, or employer-employee relationship between the Parties. The Partner possesses no authority to make representations, incur liabilities, enter contracts, or pledge credit on behalf of MsmeBooks.`
  },
  {
    number: 4,
    title: 'Partner Eligibility and Ongoing Qualification',
    category: 'Parties & Scope',
    summary: 'Sets out legal age, business registration, professional credentials, tax documentation, and continuous eligibility requirements.',
    content: `To attain and retain partner status, the Partner must:
(a) Be a duly registered corporate entity, partnership, or individual of legal majority possessing full capacity to enter commercial agreements in their jurisdiction of operation;
(b) Provide accurate business registration numbers, tax identification certificates, and valid government-issued photographic identification upon request;
(c) Maintain professional standing without active disqualifications, criminal convictions for fraud, or regulatory disciplinary proceedings;
(d) Complete mandatory introductory partner compliance modules within thirty (30) days of onboarding approval.`
  },
  {
    number: 5,
    title: 'Partner Classification and Scopes of Activity',
    category: 'Parties & Scope',
    summary: 'Outlines the authorized activities for accounting professionals, software distributors, POS agents, education hubs, and digital affiliates.',
    content: `Partners are classified into distinct categories in accordance with Schedule A: Accounting & Financial Professionals, Technology & Software Partners, Business Development Partners, Education & Professional Partners, and Digital & Strategic Partners. Each Partner's authorised activities, permitted promotional channels, customer onboarding guidelines, and service delivery parameters are governed strictly by their approved category classification. A Partner desiring to expand their classification scope must submit an addendum request through the Partner Portal.`
  },
  {
    number: 6,
    title: 'Partnership Levels, Upgrades, and Tier Downgrades',
    category: 'Parties & Scope',
    summary: 'Defines Bronze (15%), Silver (20%), Gold (30%), and Platinum (40%) tiers, review cycles, minimum customer thresholds, and adjustments.',
    content: `Partnership tiers are established as Bronze Partner (15% recurring commission), Silver Partner (20% recurring commission), Gold Partner (30% recurring commission), and Platinum Partner (40% recurring commission). Tier advancement is determined by maintaining active Qualified Customer accounts as defined in Schedule B. MsmeBooks evaluates Partner performance quarterly. In the event a Partner's active customer count falls below the requisite threshold for two consecutive calendar quarters, MsmeBooks reserves the right, upon fifteen (15) days written notice, to reclassify the Partner to the qualifying tier.`
  },
  {
    number: 7,
    title: 'Partner Rights and Operational Responsibilities',
    category: 'Rights & Compliance',
    summary: 'Mandates transparent marketing, prohibition of spam or misleading performance promises, and adherence to brand safety standards.',
    content: `The Partner covenants and agrees to:
(a) Market and represent MsmeBooks software with truthfulness, integrity, and dignity, accurately reflecting software features, pricing, and system specifications;
(b) Refrain from engaging in deceptive advertising, unsolicited commercial email (spam), misleading search ads bidding on MsmeBooks registered trademarks, or promises of outcomes not verified in official documentation;
(c) Disclose their affiliate or reseller status to referred prospects where required by applicable consumer transparency regulations;
(d) Maintain adequate technical competence regarding MsmeBooks modules for which the Partner undertakes consulting or training.`
  },
  {
    number: 8,
    title: 'MsmeBooks Responsibilities and Enablement',
    category: 'Rights & Compliance',
    summary: 'Outlines software uptime commitments, tracking infrastructure, commission reporting transparency, and partner resource delivery.',
    content: `MsmeBooks undertakes to:
(a) Provide commercial access to the MsmeBooks Cloud Platform with high commercial availability standards, subject to scheduled maintenance windows;
(b) Maintain reliable tracking systems via the Partner Portal to log referral clicks, customer activations, subscription renewals, and commission ledger credits;
(c) Supply standard digital marketing collateral, pitch decks, product release notes, and sales enablement assets through the Partner Resource Centre;
(d) Provide tier-appropriate technical escalation channels to resolve software anomalies impacting Qualified Customers.`
  },
  {
    number: 9,
    title: 'Referrals, Lead Registration, and Customer Attribution',
    category: 'Rights & Compliance',
    summary: 'Governs referral links, ninety-day attribution window, duplicate lead arbitration, and customer ownership protocols.',
    content: `Referrals must be tracked via the Partner's authenticated digital link or logged through the Deal Registration tool in the Partner Portal prior to customer checkout. In instances where multiple Partners claim attribution for the same prospective customer, attribution will be awarded to the Partner whose tracking link was last utilized by the customer immediately prior to initial paid subscription, or whose formal Deal Registration was approved first in time by MsmeBooks. The end-user contract and customer subscription relationship remain strictly between MsmeBooks and the Customer.`
  },
  {
    number: 10,
    title: 'Commission Calculation and Revenue Sharing Terms',
    category: 'Commercial & Commission',
    summary: 'Details calculation formulas, recurring commission lifespan, exclusion of one-off setup fees, and adjustments for refunds or chargebacks.',
    content: `Commissions are calculated as the contracted Tier Percentage multiplied by Net Subscription Revenue collected for the active subscription period of each Qualified Customer. Recurring commissions continue for as long as the Qualified Customer maintains an uninterrupted paid subscription and the Partner maintains active partner status. Commissions do not accrue on one-time professional services, hardware sales (unless subject to an explicit hardware schedule), data migration fees, or third-party SMS/telecom pass-through credits.`
  },
  {
    number: 11,
    title: 'Commission Payment Schedules and Payout Conditions',
    category: 'Commercial & Commission',
    summary: 'Sets monthly reconciliation, minimum payout thresholds ($50 or local currency equivalent), banking details, and tax withholding.',
    content: `Commissions earned during any calendar month are reconciled within ten (10) business days following month-end and paid on or before the twenty-fifth (25th) day of the following calendar month, provided the Partner's accumulated balance reaches or exceeds the minimum threshold of fifty United States Dollars ($50.00 USD) or local sovereign currency equivalent. Payouts are remitted via electronic bank transfer, international wire, or approved pan-African payment corridors. The Partner is solely responsible for all national and municipal income taxes arising from commission earnings.`
  },
  {
    number: 12,
    title: 'Partner Training, Certification, and Quality Assurance',
    category: 'Rights & Compliance',
    summary: 'Specifies training pathways for accounting and implementation partners, recertification cycles, and badging rules.',
    content: `Partners seeking Gold or Platinum status, or those offering billable customer implementation, must complete the MsmeBooks Partner Certification Curriculum. Certifications are valid for twelve (12) months and require annual recertification upon major platform version upgrades. MsmeBooks reserves the right to audit the implementation quality of certified partners to ensure customer satisfaction.`
  },
  {
    number: 13,
    title: 'Marketing, Brand Usage, and Trademark Protection',
    category: 'Rights & Compliance',
    summary: 'Defines limited license to use approved logos, prohibits domain squatting (e.g., msmebooks-africa.com), and sets advertising guidelines.',
    content: `MsmeBooks grants the Partner a revocable, non-exclusive, royalty-free license during the term to use the MsmeBooks logo and approved marks solely in promotional materials complying with Schedule D. The Partner shall not register or use domain names, social media handles, or commercial entities incorporating "MsmeBooks" or deceptive variations thereof. Bidding on "MsmeBooks" or trademarked terms in Google Ads, Bing Ads, or paid PPC channels without written consent is strictly prohibited.`
  },
  {
    number: 14,
    title: 'Customer Data Privacy and Regulatory Compliance',
    category: 'Legal & Governance',
    summary: 'Mandates strict compliance with African and international data protection laws (NDPR, POPIA, GDPR) and customer confidentiality.',
    content: `The Partner shall comply with all applicable data protection legislation, including the Nigeria Data Protection Act (NDPA), South Africa POPIA, Kenya Data Protection Act, and international standards such as GDPR where cross-border data is processed. The Partner shall not store, export, scrape, or process customer financial records or personal information accessed through client collaborations except as strictly authorised in writing by the customer.`
  },
  {
    number: 15,
    title: 'Confidentiality and Trade Secrets',
    category: 'Legal & Governance',
    summary: 'Protects proprietary technology, pricing structures, roadmap documents, and commercial terms for a period of three (3) years post-termination.',
    content: `Each Party acknowledges that it may receive Confidential Information of the other Party, including software roadmaps, API specifications, partner commission schedules, financial statistics, and commercial customer lists. Both Parties agree to safeguard such Confidential Information with the same degree of care exercised for their own proprietary data, and in no event less than reasonable care, during the term of this Agreement and for three (3) years following termination.`
  },
  {
    number: 16,
    title: 'Intellectual Property Rights Ownership',
    category: 'Legal & Governance',
    summary: 'Affirms MsmeBooks sole ownership of all software source code, algorithms, databases, UX interfaces, and brand assets.',
    content: `MsmeBooks retains sole and exclusive ownership of all right, title, and interest in and to the MsmeBooks software, documentation, databases, proprietary algorithms, API endpoints, design systems, and trademarks. Nothing in this Agreement grants the Partner any title, equity, or intellectual property rights beyond the limited marketing license explicitly conferred herein.`
  },
  {
    number: 17,
    title: 'Anti-Bribery, Anti-Corruption, and Ethical Standards',
    category: 'Rights & Compliance',
    summary: 'Zero tolerance for bribery, corrupt payments to public officials, money laundering, or illegal rebates.',
    content: `The Partner represents and warrants that it has not offered, paid, or promised, and will not offer, pay, or promise, directly or indirectly, any bribe, kickback, or unlawful inducement to any government official, customer representative, or employee of MsmeBooks. Violation of anti-corruption standards results in immediate termination of partner status and forfeiture of accrued commissions.`
  },
  {
    number: 18,
    title: 'Territory, Cross-Border Operations, and Local Taxes',
    category: 'Legal & Governance',
    summary: 'Governs cross-border sales across African nations, multi-currency revenue sharing, and local statutory tax compliance.',
    content: `The Partner is authorised to introduce prospective customers across countries where MsmeBooks commercially operates, subject to local banking and regulatory laws. Where local taxation mandates statutory withholding tax at source, MsmeBooks will deduct the mandated percentage and provide official tax credit withholding receipts to the Partner.`
  },
  {
    number: 19,
    title: 'Customer Implementation and Support Handover',
    category: 'Rights & Compliance',
    summary: 'Delineates partner implementation service boundaries, customer data migration liability, and first-line vs second-line support.',
    content: `Partners offering bespoke onboarding or data migration to Qualified Customers do so as independent service contractors. MsmeBooks is not responsible for partner billings, implementation delays, or inaccurate client bookkeeping resulting from partner consultancy. Technical bug remediation and software infrastructure remain the exclusive responsibility of MsmeBooks.`
  },
  {
    number: 20,
    title: 'Non-Solicitation and Fair Competition',
    category: 'Legal & Governance',
    summary: 'Narrowly tailored restrictions preventing poaching of technical staff and unfair misappropriation of proprietary customer pipelines.',
    content: `During the term and for a period of twelve (12) months following termination, neither Party shall intentionally solicit for employment or hire any key engineering or product management personnel of the other Party without prior written consent. General public employment advertisements are excluded from this restriction.`
  },
  {
    number: 21,
    title: 'Warranties, Disclaimers, and Limitation of Guarantees',
    category: 'Legal & Governance',
    summary: 'Standard commercial warranty disclaimers; software provided as-is without representations of guaranteed commercial earnings.',
    content: `MsmeBooks warrants that it provides the platform with reasonable skill and professional care. Except as expressly stated, the platform is provided "as is" and "as available". MsmeBooks does not warrant that software operations will be entirely error-free or uninterrupted. MsmeBooks makes no representation or warranty regarding the volume of earnings or customer conversions a Partner will achieve.`
  },
  {
    number: 22,
    title: 'Limitation of Liability and Indemnification',
    category: 'Legal & Governance',
    summary: 'Proportionate liability caps limited to commissions paid in the preceding twelve (12) months; mutual indemnification.',
    content: `To the maximum extent permitted by law, neither Party shall be liable for indirect, incidental, consequential, or punitive damages, or lost profits. Total aggregate liability of MsmeBooks arising out of or related to this Agreement shall not exceed the total commissions paid or payable to the Partner under this Agreement in the twelve (12) months preceding the claim.`
  },
  {
    number: 23,
    title: 'Agreement Duration and Automatic Annual Renewal',
    category: 'Parties & Scope',
    summary: 'Initial one (1) year term with automatic successive twelve-month renewals unless thirty (30) days advance notice is provided.',
    content: `This Agreement commences on the Effective Date and continues for an initial term of one (1) year. Thereafter, this Agreement automatically renews for successive one-year periods unless either Party provides written notice of non-renewal at least thirty (30) days prior to the expiration of the current term.`
  },
  {
    number: 24,
    title: 'Suspension and Grounds for Termination',
    category: 'Legal & Governance',
    summary: 'Immediate termination for material breach, fraudulent attribution, or insolvency; thirty (30) days notice for convenience.',
    content: `MsmeBooks may suspend partner portal access or terminate this Agreement immediately upon written notice if the Partner:
(a) Commits a material breach of this Agreement that remains uncured after fourteen (14) days written notice;
(b) Engages in fraud, attribution manipulation, credit card abuse, or illicit referral practices;
(c) Enters liquidation, bankruptcy, or ceases ordinary commercial business operations;
(d) Either Party may terminate this Agreement for convenience upon thirty (30) days written notice to the other Party.`
  },
  {
    number: 25,
    title: 'Post-Termination Obligations and Commission Run-Off',
    category: 'Commercial & Commission',
    summary: 'Settlement of legitimately accrued commissions, cessation of logo usage, and return of confidential assets.',
    content: `Upon termination:
(a) The Partner shall immediately cease all use of MsmeBooks trademarks, logos, and promotional assets;
(b) Legitimate commissions accrued prior to the effective termination date shall be paid in the next regular billing cycle, subject to set-off for chargebacks or refunds;
(c) In the event of termination for convenience by MsmeBooks, recurring commissions on existing active Qualified Customers shall continue to be paid for a run-off period of ninety (90) calendar days.`
  },
  {
    number: 26,
    title: 'Dispute Resolution, Negotiation, and Arbitration',
    category: 'Legal & Governance',
    summary: 'Three-stage escalation: friendly commercial negotiation, mediation, and binding arbitration under regional arbitration rules.',
    content: `Any dispute or claim arising out of or relating to this Agreement shall first be submitted to good-faith executive negotiation between appointed commercial representatives for thirty (30) days. If unresolved, the dispute shall be resolved by final and binding arbitration administered by the relevant regional arbitration centre in accordance with its Commercial Arbitration Rules. The arbitral decision shall be final and enforceable in any court of competent jurisdiction.`
  },
  {
    number: 27,
    title: 'Force Majeure and Unforeseeable Events',
    category: 'Legal & Governance',
    summary: 'Excuses performance delays caused by acts of God, war, pandemic, government embargo, or widespread internet infrastructure collapse.',
    content: `Neither Party shall be liable for delay or failure to perform its contractual obligations if such delay or failure is caused by an event beyond its reasonable control, including natural catastrophes, acts of war, civil insurrection, pandemics, national electrical grid or undersea telecommunications cable failure, or governmental embargoes.`
  },
  {
    number: 28,
    title: 'Amendments, Schedule Updates, and Notifications',
    category: 'Parties & Scope',
    summary: 'Defines formal digital notification procedures and a thirty (30) day advance notice window for commercial schedule modifications.',
    content: `MsmeBooks may update the commercial schedules (including commission percentages for future customer referrals) upon thirty (30) days electronic notice dispatched to the Partner's registered email address or posted prominently in the Partner Portal. Continued participation in the Partner Programme following the notice period constitutes acceptance of updated schedules.`
  },
  {
    number: 29,
    title: 'General Legal Provisions and Severability',
    category: 'Legal & Governance',
    summary: 'Entire agreement clause, non-waiver, severability of invalid clauses, electronic execution, and order of precedence.',
    content: `This Agreement, including all Schedules A through G, constitutes the entire agreement between the Parties with respect to its subject matter, superseding all prior oral or written understandings. If any provision is held invalid by an arbitral tribunal or competent court, the remaining provisions remain in full force. No waiver of any breach shall constitute a waiver of subsequent breaches.`
  },
  {
    number: 30,
    title: 'Electronic Execution, Digital Signatures, and Acceptance',
    category: 'Parties & Scope',
    summary: 'Confirms full legal validity of digital signatures, timestamp hashes, and electronic click-through acceptance under the Electronic Transactions Act.',
    content: `The Parties agree that execution of this Agreement via electronic signature, cryptographic hash, or verified digital click-through in the MsmeBooks Partner Portal shall have the same legal force and binding effect as a physical handwritten signature under applicable Electronic Transactions and Evidence Acts. By checking the acceptance box and submitting the Partner Onboarding form, the Partner warrants that the signatory possesses full corporate authority to bind the entity.`
  }
];

export const AGREEMENT_SCHEDULES: AgreementSchedule[] = [
  {
    letter: 'A',
    title: 'Partner Categories and Authorised Activities',
    subtitle: 'Scope of permitted advisory, reseller, technical, and referral activities',
    summary: 'Defines eligible professional categories, permitted services, customer onboarding protocols, and restrictions by classification.',
    sections: [
      {
        heading: 'Section A.1 — Approved Category Classifications',
        body: 'Partners operate under five primary classifications: (1) Accounting & Financial Professionals, (2) Technology & Software Partners, (3) Business Development Partners, (4) Education & Professional Partners, and (5) Digital & Strategic Partners. Each classification entitles the Partner to specific promotional rights and tools.'
      },
      {
        heading: 'Section A.2 — Permitted Implementation & Advisory Services',
        body: 'Certified accounting and technology partners may charge end-user clients independent implementation, chart of accounts setup, staff training, and data migration fees. MsmeBooks does not regulate independent consulting rates, provided service descriptions are transparent and do not misrepresent platform licensing.'
      },
      {
        heading: 'Section A.3 — Restrictions and Prohibited Conduct',
        body: 'Partners shall not reverse-engineer MsmeBooks software, distribute unauthorized software cracks or keygens, impersonate MsmeBooks executive personnel, or represent that they have exclusive monopoly rights in any sovereign country without an executed Master Distributor Addendum.'
      }
    ]
  },
  {
    letter: 'B',
    title: 'Commission Structure and Revenue Sharing Schedules',
    subtitle: 'Detailed commission percentages, eligible revenue products, calculation schedules, and payment thresholds',
    summary: 'Defines the 15%, 20%, 30%, and 40% commission tiers, calculation methodologies, payment cycles, and deduction rules.',
    sections: [
      {
        heading: 'Section B.1 — Tier Schedule',
        body: 'Bronze Partner: 15% recurring commission (1–9 active paying accounts); Silver Partner: 20% recurring commission (10–29 active accounts); Gold Partner: 30% recurring commission (30–74 active accounts); Platinum Partner: 40% recurring commission (75+ active accounts or approved enterprise agreement).'
      },
      {
        heading: 'Section B.2 — Eligible Revenue Products',
        body: 'Recurring commissions apply to all core MsmeBooks cloud software subscriptions: Accounting Standard, Growth Suite, Multi-Branch POS & Inventory, Enterprise Cloud, and add-on user seats. Commissions do not apply to hardware purchases, third-party SMS bundles, or custom development.'
      },
      {
        heading: 'Section B.3 — Payout Windows & Currency Settlement',
        body: 'Monthly earnings are reconciled by the 10th of every month. Payments are disbursed by the 25th in USD, NGN, KES, GHS, ZAR, or EUR via local clearing houses or SWIFT, with a minimum payout threshold of $50 USD.'
      }
    ]
  },
  {
    letter: 'C',
    title: 'Partner Benefits and Qualification Requirements',
    subtitle: 'Criteria for tier advancement, training certifications, co-marketing allowances, and SLA commitments',
    summary: 'Details the benefits, enablement resources, support SLAs, and qualification thresholds across partner tiers.',
    sections: [
      {
        heading: 'Section C.1 — Enablement and Learning Resources',
        body: 'All partners receive access to the MsmeBooks Academy, partner knowledge base, product roadmap briefings, sales slide decks, and digital battlecards. Gold and Platinum partners gain priority hotline support and dedicated Partner Success Managers.'
      },
      {
        heading: 'Section C.2 — Joint Sales & Lead Distribution',
        body: 'MsmeBooks routes qualified inbound enterprise and retail leads to certified Gold and Platinum partners based on city, sector competence, and customer satisfaction rating.'
      }
    ]
  },
  {
    letter: 'D',
    title: 'Brand and Marketing Guidelines',
    subtitle: 'Standards for MsmeBooks trademark usage, co-branding, logo specifications, and advertising rules',
    summary: 'Protects the MsmeBooks brand identity, color codes, logo clear-space rules, and advertising requirements.',
    sections: [
      {
        heading: 'Section D.1 — Approved Logo Assets & Brand Colors',
        body: 'Partners must use approved vector assets without altering color, proportion, or typography. Primary brand colors: Corporate Blue (#0046B8), Lemon Green (#84CC16), and Crisp White. Partner badge lockups must state "Authorised Partner" or "Certified Reseller".'
      },
      {
        heading: 'Section D.2 — Advertising and PPC Rules',
        body: 'Partners may run display ads and social media campaigns adhering to brand guidelines. Partners are strictly barred from bidding on "MsmeBooks", "msmebooks.org", or misspellings in Google Search Ads or direct-link paid search.'
      }
    ]
  },
  {
    letter: 'E',
    title: 'Data Protection, Security, and Confidentiality',
    subtitle: 'Sovereign data protection compliance, customer data isolation, and security incident response',
    summary: 'Outlines obligations under NDPR, POPIA, GDPR, confidentiality, and data incident reporting protocols.',
    sections: [
      {
        heading: 'Section E.1 — Compliance with Sovereign Data Protection Laws',
        body: 'Both parties commit to full compliance with applicable African data protection frameworks including NDPR (Nigeria), POPIA (South Africa), Data Protection Act (Kenya, Ghana), and international GDPR frameworks.'
      },
      {
        heading: 'Section E.2 — Security & Incident Notification',
        body: 'In the event of an unauthorized access incident or credential breach involving customer accounts managed by the Partner, the Partner must inform MsmeBooks within twenty-four (24) hours.'
      }
    ]
  },
  {
    letter: 'F',
    title: 'Partner Code of Professional Conduct',
    subtitle: 'Ethical standards, customer transparency, anti-fraud standards, and compliance integrity',
    summary: 'Mandates fair customer treatment, prohibition of unauthorized fees, and strict anti-corruption standards.',
    sections: [
      {
        heading: 'Section F.1 — Ethical Merchant Treatment',
        body: 'Partners shall deal fairly and transparently with MSME merchants, avoiding deceptive high-pressure sales tactics or unauthorized retention of merchant login credentials.'
      },
      {
        heading: 'Section F.2 — Anti-Bribery and Fair Practices',
        body: 'Partners must not offer or accept illicit inducements, kickbacks, or false accounting entries. Integrity and fiduciary responsibility to small business owners are paramount.'
      }
    ]
  },
  {
    letter: 'G',
    title: 'Territory and Special Commercial Terms',
    subtitle: 'Pan-African jurisdictions, multi-country distribution agreements, and local regulatory addenda',
    summary: 'Governs cross-border sales across West, East, Central, Southern Africa and global international territories.',
    sections: [
      {
        heading: 'Section G.1 — Pan-African and Global Territory Scope',
        body: 'Partners may onboard clients across Nigeria, Kenya, Ghana, South Africa, Rwanda, Uganda, Tanzania, Côte d’Ivoire, Egypt, and international jurisdictions, subject to currency settlement regulations.'
      },
      {
        heading: 'Section G.2 — Local Regulatory Withholding Tax & Invoicing',
        body: 'Where local tax law requires statutory withholding tax (e.g. FIRS in Nigeria, KRA in Kenya, SARS in South Africa), statutory deductions will be made and official credit receipts provided.'
      }
    ]
  }
];
