import { CurrencyCode } from '../types';
import { EXCHANGE_RATES, COUNTRIES } from '../data/mockData';

export function convertFromUSD(amountUSD: number, currency: CurrencyCode): number {
  const rate = EXCHANGE_RATES[currency] || 1;
  return Math.round(amountUSD * rate);
}

export function formatPrice(
  amountUSD: number,
  currency: CurrencyCode,
  locale: 'en' | 'fr' = 'en',
  pdfSafe: boolean = false
): string {
  const localAmount = convertFromUSD(amountUSD, currency);
  const country = COUNTRIES.find(c => c.currency === currency);
  const symbol = country ? country.currencySymbol : (currency === 'USD' ? '$' : currency);

  const intlLocale = locale === 'fr' ? 'fr-FR' : 'en-US';
  let formattedNum = localAmount.toLocaleString(intlLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (pdfSafe) {
    // Normalize narrow non-breaking spaces (\u202F) and non-breaking spaces (\u00A0)
    // so jsPDF standard Helvetica font renders clean ASCII spaces
    formattedNum = formattedNum.replace(/[\u00A0\u202F]/g, ' ');
  }

  if (locale === 'fr') {
    // Standard French placement for non-USD/GBP/EUR or CFA/African currencies
    if (currency === 'XOF' || currency === 'NGN' || currency === 'KES' || currency === 'GHS' || currency === 'RWF' || currency === 'UGX' || currency === 'TZS' || currency === 'ZAR' || currency === 'EGP' || currency === 'ZWL') {
      return `${formattedNum} ${symbol}`;
    }
    return `${formattedNum} ${symbol}`;
  }

  if (currency === 'NGN' || currency === 'UGX' || currency === 'TZS' || currency === 'RWF' || currency === 'XOF' || currency === 'ZWL') {
    return `${symbol} ${formattedNum}`;
  }
  return `${symbol}${formattedNum}`;
}

export function formatRawLocalCurrency(amount: number, currency: CurrencyCode, locale: 'en' | 'fr' = 'en'): string {
  const country = COUNTRIES.find(c => c.currency === currency);
  const symbol = country ? country.currencySymbol : (currency === 'USD' ? '$' : currency);
  const intlLocale = locale === 'fr' ? 'fr-FR' : 'en-US';
  const formatted = Math.round(amount).toLocaleString(intlLocale).replace(/[\u00A0\u202F]/g, ' ');
  return locale === 'fr' ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}
