import { GoogleGenAI } from '@google/genai';
import { Currency, BillingPeriod } from '../types';
import { PRICING_PLANS } from '../data/pricingData';
import { SUPPORTED_CURRENCIES, formatCurrency } from '../utils/currency';

interface PricingAssistantQuery {
  message: string;
  currency: Currency;
  billingPeriod: BillingPeriod;
  language: string;
  businessType?: string;
  budget?: string;
  location?: string;
  history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
}

export interface AssistantPlanRecommendation {
  planId: string;
  confidence: 'high' | 'medium';
  keyReasons: string[];
  estimatedCost: string;
}

export interface AssistantReplyResult {
  text: string;
  recommendedPlanId?: string;
  suggestedPrompts?: string[];
}

/**
 * Intelligent client-side rule/expert matcher used either standalone
 * or as reliable fallback when API key is not present or offline.
 */
export function getLocalPricingAdvice(query: PricingAssistantQuery): AssistantReplyResult {
  const q = query.message.toLowerCase();
  const curr = query.currency || 'NGN';
  const currInfo = SUPPORTED_CURRENCIES[curr] || SUPPORTED_CURRENCIES.NGN;
  const isYearly = query.billingPeriod === 'yearly';

  const starterPrice = isYearly
    ? formatCurrency(3600, curr) + '/mo (billed annually as ₦43,200/yr)'
    : formatCurrency(4500, curr) + '/mo';
  const growthPrice = isYearly
    ? formatCurrency(7200, curr) + '/mo (billed annually as ₦86,400/yr)'
    : formatCurrency(9000, curr) + '/mo';
  const bizPrice = isYearly
    ? formatCurrency(12000, curr) + '/mo (billed annually as ₦144,000/yr)'
    : formatCurrency(15000, curr) + '/mo';
  const premiumPrice = isYearly
    ? formatCurrency(40000, curr) + '/mo (billed annually as ₦480,000/yr)'
    : formatCurrency(50000, curr) + '/mo';
  const entPrice = isYearly
    ? formatCurrency(120000, curr) + '/mo (billed annually as ₦1,440,000/yr)'
    : formatCurrency(150000, curr) + '/mo';
  const superiorPrice = isYearly
    ? formatCurrency(240000, curr) + '/mo (billed annually as ₦2,880,000/yr)'
    : formatCurrency(300000, curr) + '/mo';
  const ultimatePrice = isYearly
    ? formatCurrency(400000, curr) + '/mo (billed annually as ₦4,800,000/yr)'
    : formatCurrency(500000, curr) + '/mo';
  const ultimatePrimePrice = isYearly
    ? formatCurrency(640000, curr) + '/mo (billed annually as ₦7,680,000/yr)'
    : formatCurrency(800000, curr) + '/mo';

  // 1. Enterprise detection: franchise, multi-national, custom ERP, >5 branches, wholesale distributor
  if (
    q.includes('enterprise') ||
    q.includes('chain') ||
    q.includes('franchise') ||
    q.includes('unlimited') ||
    q.includes('custom workflow') ||
    q.includes('sla') ||
    q.includes('fmcg') ||
    (q.includes('branch') && (q.includes('10') || q.includes('20') || q.includes('many')))
  ) {
    return {
      text: `For large-scale operations or expanding franchises, our **Enterprise Plan** is the recommended match. It provides unlimited branches, custom ERP workflows, dedicated account management, data migration assistance, and custom SLA agreements. We can tailor an annual contract specifically for your organization.`,
      recommendedPlanId: 'enterprise',
      suggestedPrompts: [
        'Book an Enterprise Demo',
        'What SLA and security are included?',
        'Do you provide on-site onboarding?',
      ],
    };
  }

  // 2. Business Plan detection: Multiple branches, warehouses, stock transfers, e-commerce, supermarket
  if (
    q.includes('multiple branch') ||
    q.includes('multi-branch') ||
    q.includes('warehouse') ||
    q.includes('supermarket') ||
    q.includes('wholesaler') ||
    q.includes('distributor') ||
    q.includes('e-commerce') ||
    q.includes('branches') ||
    q.includes('depot') ||
    q.includes('transfer stock')
  ) {
    return {
      text: `Based on your multi-branch and inventory requirements, the **Business Plan** (${bizPrice}) is your optimal fit. It provides centralized multi-warehouse control, branch-to-branch inventory transfers, employee management, and customer credit tracking. It keeps all your locations synchronized in real time with full offline resilience.`,
      recommendedPlanId: 'business',
      suggestedPrompts: [
        `How does stock transfer work?`,
        `Can each branch operate offline?`,
        `Start risk-free trial on Business`,
      ],
    };
  }

  // 3. Starter / Micro business / Solo / Tight Budget
  if (
    q.includes('cheap') ||
    q.includes('budget') ||
    q.includes('starter') ||
    q.includes('solo') ||
    q.includes('kiosk') ||
    q.includes('micro') ||
    q.includes('freelance') ||
    q.includes('one shop') ||
    q.includes('single shop') ||
    q.includes('low cost') ||
    q.includes('afford') ||
    q.includes('smallest')
  ) {
    return {
      text: `For solo retailers and micro-enterprises with a disciplined budget, the **Starter Plan** (${starterPrice}) offers everything you need: basic accounting, POS, invoicing, customer tracking, and offline sync. You get digital efficiency without unnecessary overhead.`,
      recommendedPlanId: 'starter',
      suggestedPrompts: [
        `What is the difference between Starter and Pro?`,
        `Can I upgrade from Starter anytime?`,
        `Start risk-free trial on Starter`,
      ],
    };
  }

  // 4. Pharmacy, Restaurant, Retail, Multi-user, Accounting, Tax
  if (
    q.includes('pharmacy') ||
    q.includes('restaurant') ||
    q.includes('retail') ||
    q.includes('tax') ||
    q.includes('vat') ||
    q.includes('user') ||
    q.includes('role') ||
    q.includes('audit') ||
    q.includes('copilot') ||
    q.includes('ai') ||
    q.includes('premium') ||
    q.includes('growth') ||
    q.includes('accounting')
  ) {
    return {
      text: `For your operational needs, the **Premium Plan** (${premiumPrice}) is our flagship choice for comprehensive accounting. It unlocks an unlimited advanced chart of accounts, multiple branch and warehouse management, employee & manager self-service, Zapier integrations, and cash flow business snapshots. For smaller teams, the **Growth Plan** (${growthPrice}) covers 2 users with full CRM, HR & Payroll.`,
      recommendedPlanId: 'premium',
      suggestedPrompts: [
        `How does the advanced chart of accounts work?`,
        `Does it calculate 7.5% Nigerian VAT automatically?`,
        `Start risk-free trial on Premium`,
      ],
    };
  }

  // 5. Currency / Location questions (Nigeria, Kenya, South Africa, Ghana, Francophone Africa, etc.)
  if (
    q.includes('nigeria') ||
    q.includes('lagos') ||
    q.includes('naira') ||
    q.includes('kenya') ||
    q.includes('nairobi') ||
    q.includes('shilling') ||
    q.includes('ghana') ||
    q.includes('cedi') ||
    q.includes('south africa') ||
    q.includes('rand') ||
    q.includes('franc') ||
    q.includes('cfa') ||
    q.includes('location') ||
    q.includes('country')
  ) {
    return {
      text: `MsmeBooks is built specifically for Pan-African commerce with native multi-currency support (${currInfo.symbol} ${currInfo.name} currently active). Our servers comply with African data sovereignty, support local statutory tax standards (such as Nigeria's 7.5% VAT and WHT), and include direct bank and fintech payment reconciliation.`,
      recommendedPlanId: 'growth',
      suggestedPrompts: [
        `Show pricing in ${currInfo.code}`,
        `What payment methods are supported?`,
        `How does offline mode handle power outages?`,
      ],
    };
  }

  // 6. Offline / Internet queries
  if (q.includes('offline') || q.includes('internet') || q.includes('wifi') || q.includes('power')) {
    return {
      text: `All MsmeBooks plans include **100% Offline Resilience**. Your POS cashiers can continue ringing up sales, managing inventory, and issuing printed or SMS receipts without internet. When electricity or internet returns, transactions background-sync automatically with zero data collisions.`,
      recommendedPlanId: 'growth',
      suggestedPrompts: [
        `Does offline POS work on mobile devices?`,
        `Recommend a plan for a busy retail shop`,
        `Start risk-free trial with offline sync`,
      ],
    };
  }

  // Default balanced recommendation
  return {
    text: `Based on your request, our **Growth Plan** (${growthPrice}) or **Business Plan** (${bizPrice}) delivers high value for growing teams. If your focus is core accounting with unlimited chart of accounts and multi-branch control, the **Premium Plan** (${premiumPrice}) is ideal. If you are just starting as a single shop, the **Starter Plan** (${starterPrice}) is our accessible launchpad.`,
    recommendedPlanId: 'premium',
    suggestedPrompts: [
      `Compare Growth vs Premium`,
      `Which plan is best for 3 users?`,
      `How much do I save with annual billing?`,
    ],
  };
}

/**
 * Live Gemini AI powered pricing advisor when GEMINI_API_KEY is available.
 * Uses gemini-2.5-flash as mandated by SDK standards.
 */
export async function queryGeminiPricingAssistant(
  query: PricingAssistantQuery
): Promise<AssistantReplyResult> {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (!apiKey) {
    // Graceful fallback to expert rule system
    return getLocalPricingAdvice(query);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const curr = query.currency || 'NGN';
    const isYearly = query.billingPeriod === 'yearly';

    const systemInstruction = `You are the MsmeBooks Intelligent Pricing & Plan Consultant.
MsmeBooks is the leading African business management platform for accounting, POS, inventory, and operations.
Your job is to advise prospective customers on the exact plan that matches their business needs, budget, scale, and location.

PLANS & PRICING IN NAIRA (NGN):
1. Starter: Single User (₦4,500/mo, ₦43,200/yr = ₦3,600/mo). For solo entrepreneurs, micro retailers, single shops. Features: single store integration of e-commerce (Shopify, Jumia, Selar, WooCommerce), payment gateways, basic double-entry bookkeeping, invoicing, receipts, single-till POS, basic inventory.
2. Growth: 2 Users (₦9,000/mo, ₦86,400/yr = ₦7,200/mo). Features: Marketing and CRM, Task & project management, standard HR and Payroll, standard Fixed asset, customers and suppliers portal, bank and fintech integrations, standard labels, QR and bar codes printing, post 1 job vacancy/week on Job Board.
3. Business: 3 Users (₦15,000/mo, ₦144,000/yr = ₦12,000/mo). Features: Sales Agents and commission, multi branches management, webhook and API, standard recruitment.
4. Premium (MOST POPULAR): 10 Users (₦50,000/mo, ₦480,000/yr = ₦40,000/mo). Features: Core more in accounting from premium licenses: unlimited advance chart of accounts, multiple branch and warehouse management, employee and manager self service, Zapier integrations, cash flow and business snapshot.
5. Enterprise: 15 Users (₦150,000/mo, ₦1,440,000/yr = ₦120,000/mo). Features: POS terminals integrations, Max of 5 stores (Shopify, WooCommerce, Selar, PrestaShop, etc.), custom domain, 5 invoice templates and 5 POS receipts templates.
6. Superior: 20 Users (₦300,000/mo, ₦2,880,000/yr = ₦240,000/mo). Features: Multi-currency accounting, advance reports and analytics, Max of 10 stores (Shopify, Selar, Jumia, WooCommerce).
7. Ultimate: 30 Users (₦500,000/mo, ₦4,800,000/yr = ₦400,000/mo). Features: Unlimited labels, QR and bar codes printing, advance fixed Assets, payroll and HR and recruitment.
8. Ultimate-Prime: 40 Users (₦800,000/mo, ₦7,680,000/yr = ₦640,000/mo). Features: Multi-entity consolidation, high volume data pipelines, custom 99.99% SLA, dedicated engineering & VIP support.
9. Custom: 50+ Users. Tailored enterprise pricing, custom ERP integrations (SAP, Oracle, NetSuite), on-premise/hybrid private cloud deployment.

KEY VALUE PROPOSITIONS:
- 100% Offline POS capability (vital for African power/internet outages).
- Multi-currency: NGN, USD, GBP, EUR, KES, ZAR, GHS, MAD, XAF, etc.
- Risk-free trial with free usage model on all plans, no credit card required, instant setup.
- 20% discount on annual billing (equivalent to 2 months free + 24-month price freeze lock).
- 7.5% Nigerian Statutory VAT compliant itemization.

CURRENT USER CONTEXT:
- Active Currency: ${curr}
- Billing Selection: ${isYearly ? 'Annual (20% discount)' : 'Monthly'}
- User Language: ${query.language}
- User Location/Country: ${query.location || 'Pan-African / Global'}
- User Business Type: ${query.businessType || 'General Retail/Services'}
- Budget note: ${query.budget || 'Flexible'}

RESPONSE GUIDELINES:
- Provide a concise, clear, and warmly professional recommendation (2-4 paragraphs).
- Always explicitly name the recommended plan from the 9 tiers (Starter, Growth, Business, Premium, Enterprise, Superior, Ultimate, Ultimate-Prime, Custom).
- Clearly explain *why* it fits their budget, team size, business type, and location.
- Mention the risk-free trial and free usage model (no card required) and annual savings where relevant.
- At the very end of your response, output on a new line:
RECOMMENDATION: [starter|growth|business|premium|enterprise|superior|ultimate|ultimate_prime|custom]
SUGGESTIONS: [Question 1] | [Question 2] | [Question 3]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: query.message }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const fullText = response.text || '';
    if (!fullText) {
      return getLocalPricingAdvice(query);
    }

    // Parse recommendation tag if provided
    let recommendedPlanId: 'starter' | 'professional' | 'business' | 'enterprise' | undefined;
    const planMatch = fullText.match(/RECOMMENDATION:\s*(starter|professional|business|enterprise)/i);
    if (planMatch) {
      recommendedPlanId = planMatch[1].toLowerCase() as any;
    }

    // Parse suggestions tag if provided
    let suggestedPrompts: string[] | undefined;
    const suggMatch = fullText.match(/SUGGESTIONS:\s*(.*)/i);
    if (suggMatch && suggMatch[1]) {
      suggestedPrompts = suggMatch[1]
        .split('|')
        .map((s) => s.trim().replace(/^\[|\]$/g, ''))
        .filter((s) => s.length > 3);
    }

    // Clean internal tags from user-facing text
    const cleanText = fullText
      .replace(/RECOMMENDATION:\s*(starter|professional|business|enterprise)/gi, '')
      .replace(/SUGGESTIONS:\s*(.*)/gi, '')
      .trim();

    return {
      text: cleanText,
      recommendedPlanId: recommendedPlanId || 'professional',
      suggestedPrompts: suggestedPrompts && suggestedPrompts.length > 0 ? suggestedPrompts : [
        'How does the risk-free trial work?',
        'Can I switch between monthly and annual?',
        'Does it support multiple branches?',
      ],
    };
  } catch {
    // If Gemini API fails (e.g. quota, network, invalid key), seamlessly fall back to expert rules
    return getLocalPricingAdvice(query);
  }
}
