import { PaymentGateway, PaymentGatewayId, PaymentRegionKey, PaymentCheckoutResult } from '../types/payment';
import { PAYMENT_GATEWAYS, getGatewayById, getGatewaysByRegion } from '../data/paymentGateways';

export interface CountryPaymentSummary {
  countryName: string;
  flag: string;
  currency: string;
  region: PaymentRegionKey;
  primaryGateway: PaymentGateway;
  recommendedGateways: PaymentGateway[];
  localRailsDescription: string;
  badgeText: string;
  isMobileMoneyDominant: boolean;
  isBankTransferDominant: boolean;
}

/**
 * Unified PaymentProcessor utility that maps regional payment gateways
 * (Stripe, Paystack, Flutterwave, M-Pesa, Monnify, Ozow, Yoco, CinetPay, etc.)
 * based on the user's selected country, currency, and region.
 */
export class PaymentProcessor {
  /**
   * Normalize country name for flexible matching
   */
  private static normalizeCountry(countryName: string): string {
    return (countryName || '').trim().toLowerCase();
  }

  /**
   * Determine the geographic payment region based on country
   */
  public static getPaymentRegion(countryName: string): PaymentRegionKey {
    const c = this.normalizeCountry(countryName);

    if (
      c.includes('nigeria') ||
      c.includes('ghana') ||
      c.includes('sierra leone') ||
      c.includes('liberia') ||
      c.includes('gambia')
    ) {
      return 'Nigeria & West Africa';
    }

    if (
      c.includes('kenya') ||
      c.includes('tanzania') ||
      c.includes('uganda') ||
      c.includes('rwanda') ||
      c.includes('burundi') ||
      c.includes('ethiopia') ||
      c.includes('south sudan')
    ) {
      return 'East Africa';
    }

    if (
      c.includes('south africa') ||
      c.includes('namibia') ||
      c.includes('botswana') ||
      c.includes('lesotho') ||
      c.includes('eswatini') ||
      c.includes('swaziland')
    ) {
      return 'South Africa';
    }

    if (
      c.includes('benin') ||
      c.includes('togo') ||
      c.includes('senegal') ||
      c.includes("côte d'ivoire") ||
      c.includes('ivory coast') ||
      c.includes('cameroon') ||
      c.includes('mali') ||
      c.includes('burkina') ||
      c.includes('guinea') ||
      c.includes('gabon') ||
      c.includes('congo') ||
      c.includes('drc') ||
      c.includes('egypt') ||
      c.includes('morocco') ||
      c.includes('tunisia') ||
      c.includes('zimbabwe') ||
      c.includes('zambia') ||
      c.includes('mozambique') ||
      c.includes('malawi')
    ) {
      return 'Other Africa Countries';
    }

    // Default to Global & International
    return 'Global & International';
  }

  /**
   * Get an ordered list of recommended payment gateways mapped to the selected country
   */
  public static getGatewaysForCountry(countryName: string): PaymentGateway[] {
    const c = this.normalizeCountry(countryName);

    // 1. NIGERIA: Paystack, Monnify, Flutterwave, TransactPay, Stripe
    if (c.includes('nigeria')) {
      return [
        getGatewayById('paystack'),
        getGatewayById('monnify'),
        getGatewayById('flutterwave'),
        getGatewayById('transactpay'),
        getGatewayById('stripe'),
      ];
    }

    // 2. GHANA: Paystack, Flutterwave, TransactPay, Stripe
    if (c.includes('ghana')) {
      return [
        getGatewayById('paystack'),
        getGatewayById('flutterwave'),
        getGatewayById('transactpay'),
        getGatewayById('stripe'),
      ];
    }

    // 3. KENYA: M-Pesa, Peach Payments, DPO Pay, Paystack, Flutterwave
    if (c.includes('kenya')) {
      return [
        getGatewayById('mpesa'),
        getGatewayById('peachpayments'),
        getGatewayById('dpopay'),
        getGatewayById('paystack'),
        getGatewayById('flutterwave'),
      ];
    }

    // 4. RWANDA, TANZANIA, UGANDA: DPO Pay, M-Pesa, Flutterwave, Peach Payments
    if (c.includes('rwanda') || c.includes('tanzania') || c.includes('uganda')) {
      return [
        getGatewayById('dpopay'),
        getGatewayById('mpesa'),
        getGatewayById('flutterwave'),
        getGatewayById('peachpayments'),
      ];
    }

    // 5. SOUTH AFRICA: Ozow, Yoco, Paystack, Peach Payments, Pesapal, TransactPay
    if (c.includes('south africa') || c.includes('namibia')) {
      return [
        getGatewayById('ozow'),
        getGatewayById('yoco'),
        getGatewayById('paystack'),
        getGatewayById('peachpayments'),
        getGatewayById('pesapal'),
        getGatewayById('transactpay'),
      ];
    }

    // 6. BENIN, TOGO, NIGER: FedaPay, CinetPay, Flutterwave
    if (c.includes('benin') || c.includes('togo') || c.includes('niger')) {
      return [
        getGatewayById('fedapay'),
        getGatewayById('cinetpay'),
        getGatewayById('flutterwave'),
      ];
    }

    // 7. CÔTE D'IVOIRE, SENEGAL, CAMEROON, MALI, GUINEA: CinetPay, FedaPay, Flutterwave
    if (
      c.includes("côte d'ivoire") ||
      c.includes('ivory coast') ||
      c.includes('senegal') ||
      c.includes('cameroon') ||
      c.includes('mali') ||
      c.includes('guinea') ||
      c.includes('gabon') ||
      c.includes('congo')
    ) {
      return [
        getGatewayById('cinetpay'),
        getGatewayById('fedapay'),
        getGatewayById('flutterwave'),
      ];
    }

    // 8. BURKINA FASO: LigdiCash, CinetPay, FedaPay
    if (c.includes('burkina')) {
      return [
        getGatewayById('ligdicash'),
        getGatewayById('cinetpay'),
        getGatewayById('fedapay'),
      ];
    }

    // 9. EGYPT & NORTH AFRICA: Payfort, Stripe, PayPal
    if (c.includes('egypt') || c.includes('morocco') || c.includes('tunisia')) {
      return [
        getGatewayById('payfort'),
        getGatewayById('stripe'),
        getGatewayById('paypal'),
      ];
    }

    // 10. ZIMBABWE: Paynow, DPO Pay, Stripe
    if (c.includes('zimbabwe')) {
      return [
        getGatewayById('paynow'),
        getGatewayById('dpopay'),
        getGatewayById('stripe'),
      ];
    }

    // 11. UNITED KINGDOM & EUROPE: Stripe, Mollie, PayPal, 2Checkout
    if (
      c.includes('united kingdom') ||
      c.includes('uk') ||
      c.includes('england') ||
      c.includes('europe') ||
      c.includes('germany') ||
      c.includes('france') ||
      c.includes('netherlands') ||
      c.includes('belgium')
    ) {
      return [
        getGatewayById('stripe'),
        getGatewayById('mollie'),
        getGatewayById('paypal'),
        getGatewayById('twocheckout'),
      ];
    }

    // 12. INDIA & ASIA: Razorpay, Stripe, PayPal
    if (c.includes('india') || c.includes('uae') || c.includes('dubai') || c.includes('singapore')) {
      return [
        getGatewayById('razorpay'),
        getGatewayById('stripe'),
        getGatewayById('paypal'),
      ];
    }

    // 13. GLOBAL / USA / OTHER: Stripe, PayPal, Razorpay, 2Checkout, Mollie
    return [
      getGatewayById('stripe'),
      getGatewayById('paypal'),
      getGatewayById('razorpay'),
      getGatewayById('twocheckout'),
      getGatewayById('mollie'),
    ];
  }

  /**
   * Get the primary (default recommended) gateway for a country
   */
  public static getPrimaryGateway(countryName: string): PaymentGateway {
    const list = this.getGatewaysForCountry(countryName);
    return list[0] || getGatewayById('paystack');
  }

  /**
   * Get a structured summary of country payment capabilities
   */
  public static getCountryPaymentSummary(countryName: string): CountryPaymentSummary {
    const c = this.normalizeCountry(countryName);
    const region = this.getPaymentRegion(countryName);
    const recommendedGateways = this.getGatewaysForCountry(countryName);
    const primaryGateway = recommendedGateways[0] || getGatewayById('paystack');

    let flag = '🌍';
    let currency = 'USD';
    let localRailsDescription = 'International Cards, Apple Pay, Google Pay & PayPal';
    let badgeText = 'Global Payment Rails';
    let isMobileMoneyDominant = false;
    let isBankTransferDominant = false;

    if (c.includes('nigeria')) {
      flag = '🇳🇬';
      currency = 'NGN (₦)';
      localRailsDescription = 'NIP Instant Virtual Accounts, Debit Cards & USSD (*737#)';
      badgeText = 'Automated NIP Transfers';
      isBankTransferDominant = true;
    } else if (c.includes('ghana')) {
      flag = '🇬🇭';
      currency = 'GHS (GH₵)';
      localRailsDescription = 'MTN Mobile Money, Vodafone Cash & Local Cards';
      badgeText = 'Ghana MoMo & Cards';
      isMobileMoneyDominant = true;
    } else if (c.includes('kenya')) {
      flag = '🇰🇪';
      currency = 'KES (KSh)';
      localRailsDescription = 'Safaricom M-Pesa STK Push, Paybill 522522 & Cards';
      badgeText = 'M-Pesa STK Push #1';
      isMobileMoneyDominant = true;
    } else if (c.includes('rwanda')) {
      flag = '🇷🇼';
      currency = 'RWF (FRw)';
      localRailsDescription = 'MTN MoMo Rwanda, Airtel Money & International Cards';
      badgeText = 'East Africa Cross-Border';
      isMobileMoneyDominant = true;
    } else if (c.includes('south africa')) {
      flag = '🇿🇦';
      currency = 'ZAR (R)';
      localRailsDescription = 'Ozow Instant EFT (Capitec, FNB, ABSA, Nedbank), Yoco & Cards';
      badgeText = 'Instant EFT Clearing';
      isBankTransferDominant = true;
    } else if (c.includes('benin') || c.includes('togo')) {
      flag = c.includes('benin') ? '🇧🇯' : '🇹🇬';
      currency = 'XOF (CFA)';
      localRailsDescription = 'MTN MoMo, Moov Flooz & Celtiis Cash';
      badgeText = 'Francophone MoMo';
      isMobileMoneyDominant = true;
    } else if (c.includes("côte d'ivoire") || c.includes('senegal')) {
      flag = c.includes('senegal') ? '🇸🇳' : '🇨🇮';
      currency = 'XOF (CFA)';
      localRailsDescription = 'Orange Money, Wave Mobile & MTN MoMo';
      badgeText = 'Wave & Orange Money';
      isMobileMoneyDominant = true;
    } else if (c.includes('burkina')) {
      flag = '🇧🇫';
      currency = 'XOF (CFA)';
      localRailsDescription = 'LigdiCash, Orange Money Burkina & Moov Africa';
      badgeText = 'Burkina Faso MoMo';
      isMobileMoneyDominant = true;
    } else if (c.includes('egypt')) {
      flag = '🇪🇬';
      currency = 'EGP (E£)';
      localRailsDescription = 'Meeza National Scheme, Payfort & Visa/Mastercard';
      badgeText = 'Egypt Meeza Rails';
    } else if (c.includes('zimbabwe')) {
      flag = '🇿🇼';
      currency = 'USD / ZiG';
      localRailsDescription = 'EcoCash Express Prompt, OneMoney & Zimswitch';
      badgeText = 'EcoCash & Zimswitch';
      isMobileMoneyDominant = true;
    } else if (c.includes('united kingdom') || c.includes('uk')) {
      flag = '🇬🇧';
      currency = 'GBP (£)';
      localRailsDescription = 'UK Bank Cards, Apple Pay, Google Pay & Stripe Link';
      badgeText = 'Direct UK Debit & 3DS';
    } else if (c.includes('united states') || c.includes('usa')) {
      flag = '🇺🇸';
      currency = 'USD ($)';
      localRailsDescription = 'Stripe Credit/Debit Cards, Apple Pay & PayPal Wallet';
      badgeText = 'USD Card & Wallet';
    }

    return {
      countryName,
      flag,
      currency,
      region,
      primaryGateway,
      recommendedGateways,
      localRailsDescription,
      badgeText,
      isMobileMoneyDominant,
      isBankTransferDominant,
    };
  }

  /**
   * Return all 20 gateways in the system
   */
  public static getAllGateways(): PaymentGateway[] {
    return PAYMENT_GATEWAYS;
  }

  /**
   * Return gateways for a specific regional tab
   */
  public static getGatewaysByRegion(region: PaymentRegionKey): PaymentGateway[] {
    return getGatewaysByRegion(region);
  }

  /**
   * Retrieve a gateway by its unique identifier
   */
  public static getGateway(id: PaymentGatewayId): PaymentGateway {
    return getGatewayById(id);
  }
}
