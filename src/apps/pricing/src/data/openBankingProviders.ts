export interface AfricanOpenBankingBank {
  id: string;
  name: string;
  shortCode: string;
  country: string;
  currency: string;
  railName: string;
  apiProvider: 'Mono' | 'Okra' | 'Stitch' | 'PesaLink' | 'GhIPSS';
  clearingTime: string;
  accentColor: string;
  accountLength: number;
  sampleAccount: string;
  feeRatePercent: number;
  feeCapNgn: number;
}

export interface LinkedBankAccount {
  id: string;
  bank: AfricanOpenBankingBank;
  maskedAccountNumber: string;
  accountHolderName: string;
  accountType: 'Business Current' | 'Corporate Checking' | 'SME Savings';
  mandateId: string;
  linkedAt: string;
}

export const AFRICAN_OPEN_BANKING_BANKS: AfricanOpenBankingBank[] = [
  // Nigeria (Mono / Okra / NIBSS NIP)
  {
    id: 'gtbank-ng',
    name: 'Guaranty Trust Bank (GTBank)',
    shortCode: '058',
    country: 'Nigeria',
    currency: 'NGN',
    railName: 'NIBSS Direct Debit (NIP)',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#DD4F05',
    accountLength: 10,
    sampleAccount: '0124893021',
    feeRatePercent: 0.25,
    feeCapNgn: 150,
  },
  {
    id: 'zenith-ng',
    name: 'Zenith Bank Nigeria',
    shortCode: '057',
    country: 'Nigeria',
    currency: 'NGN',
    railName: 'NIBSS Direct Debit (NIP)',
    apiProvider: 'Okra',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#C8102E',
    accountLength: 10,
    sampleAccount: '1014829304',
    feeRatePercent: 0.25,
    feeCapNgn: 150,
  },
  {
    id: 'access-ng',
    name: 'Access Bank Plc',
    shortCode: '044',
    country: 'Nigeria',
    currency: 'NGN',
    railName: 'NIBSS Direct Debit (NIP)',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#F37021',
    accountLength: 10,
    sampleAccount: '0048291735',
    feeRatePercent: 0.25,
    feeCapNgn: 150,
  },
  {
    id: 'kuda-ng',
    name: 'Kuda Microfinance Bank',
    shortCode: '090267',
    country: 'Nigeria',
    currency: 'NGN',
    railName: 'NIBSS Open Finance',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 3s)',
    accentColor: '#40196D',
    accountLength: 10,
    sampleAccount: '2048192034',
    feeRatePercent: 0.2,
    feeCapNgn: 100,
  },
  {
    id: 'moniepoint-ng',
    name: 'Moniepoint Business Bank',
    shortCode: '50515',
    country: 'Nigeria',
    currency: 'NGN',
    railName: 'NIBSS Corporate Switch',
    apiProvider: 'Okra',
    clearingTime: 'Instant (< 3s)',
    accentColor: '#0361F0',
    accountLength: 10,
    sampleAccount: '8149203847',
    feeRatePercent: 0.2,
    feeCapNgn: 100,
  },
  {
    id: 'uba-ng',
    name: 'United Bank for Africa (UBA)',
    shortCode: '033',
    country: 'Nigeria',
    currency: 'NGN',
    railName: 'NIBSS Direct Debit (NIP)',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#D61E27',
    accountLength: 10,
    sampleAccount: '1029384756',
    feeRatePercent: 0.25,
    feeCapNgn: 150,
  },

  // Kenya (PesaLink / Stitch / Mono)
  {
    id: 'kcb-ke',
    name: 'KCB Bank Kenya',
    shortCode: '01',
    country: 'Kenya',
    currency: 'KES',
    railName: 'PesaLink Open API',
    apiProvider: 'PesaLink',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#6EB43F',
    accountLength: 10,
    sampleAccount: '1102938475',
    feeRatePercent: 0.25,
    feeCapNgn: 180,
  },
  {
    id: 'equity-ke',
    name: 'Equity Bank Kenya',
    shortCode: '68',
    country: 'Kenya',
    currency: 'KES',
    railName: 'PesaLink Open API',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#A32020',
    accountLength: 13,
    sampleAccount: '0180293847102',
    feeRatePercent: 0.25,
    feeCapNgn: 180,
  },
  {
    id: 'coop-ke',
    name: 'Co-operative Bank of Kenya',
    shortCode: '11',
    country: 'Kenya',
    currency: 'KES',
    railName: 'PesaLink Open API',
    apiProvider: 'PesaLink',
    clearingTime: 'Instant (< 6s)',
    accentColor: '#006B3F',
    accountLength: 12,
    sampleAccount: '011293847501',
    feeRatePercent: 0.25,
    feeCapNgn: 180,
  },
  {
    id: 'ncba-ke',
    name: 'NCBA Bank Kenya',
    shortCode: '07',
    country: 'Kenya',
    currency: 'KES',
    railName: 'PesaLink Open API',
    apiProvider: 'Stitch',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#0033A0',
    accountLength: 10,
    sampleAccount: '4920183746',
    feeRatePercent: 0.25,
    feeCapNgn: 180,
  },

  // South Africa (Stitch Open Banking / SARB RTC)
  {
    id: 'capitec-za',
    name: 'Capitec Business Bank',
    shortCode: '470010',
    country: 'South Africa',
    currency: 'ZAR',
    railName: 'Stitch Open Banking (PayShap)',
    apiProvider: 'Stitch',
    clearingTime: 'Instant (< 3s)',
    accentColor: '#004B87',
    accountLength: 10,
    sampleAccount: '1492038471',
    feeRatePercent: 0.2,
    feeCapNgn: 200,
  },
  {
    id: 'fnb-za',
    name: 'FNB (First National Bank)',
    shortCode: '250655',
    country: 'South Africa',
    currency: 'ZAR',
    railName: 'Stitch Instant EFT / RTC',
    apiProvider: 'Stitch',
    clearingTime: 'Instant (< 4s)',
    accentColor: '#009E9B',
    accountLength: 11,
    sampleAccount: '62849102934',
    feeRatePercent: 0.25,
    feeCapNgn: 200,
  },
  {
    id: 'standardbank-za',
    name: 'Standard Bank South Africa',
    shortCode: '051001',
    country: 'South Africa',
    currency: 'ZAR',
    railName: 'Stitch Instant EFT / RTC',
    apiProvider: 'Stitch',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#0033A1',
    accountLength: 9,
    sampleAccount: '029384712',
    feeRatePercent: 0.25,
    feeCapNgn: 200,
  },
  {
    id: 'nedbank-za',
    name: 'Nedbank Corporate',
    shortCode: '198765',
    country: 'South Africa',
    currency: 'ZAR',
    railName: 'Stitch Open Banking API',
    apiProvider: 'Stitch',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#007A3E',
    accountLength: 10,
    sampleAccount: '1928374650',
    feeRatePercent: 0.25,
    feeCapNgn: 200,
  },

  // Ghana (GhIPSS Open Banking / Mono)
  {
    id: 'gcb-gh',
    name: 'GCB Bank Ghana',
    shortCode: '040100',
    country: 'Ghana',
    currency: 'GHS',
    railName: 'GhIPSS Instant Pay (GIP)',
    apiProvider: 'GhIPSS',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#FDB913',
    accountLength: 13,
    sampleAccount: '1011180029384',
    feeRatePercent: 0.25,
    feeCapNgn: 160,
  },
  {
    id: 'ecobank-gh',
    name: 'Ecobank Ghana',
    shortCode: '130100',
    country: 'Ghana',
    currency: 'GHS',
    railName: 'GhIPSS Open Finance',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#005C8F',
    accountLength: 13,
    sampleAccount: '1441002938471',
    feeRatePercent: 0.25,
    feeCapNgn: 160,
  },
  {
    id: 'stanbic-gh',
    name: 'Stanbic Bank Ghana',
    shortCode: '190100',
    country: 'Ghana',
    currency: 'GHS',
    railName: 'GhIPSS Instant Pay (GIP)',
    apiProvider: 'GhIPSS',
    clearingTime: 'Instant (< 5s)',
    accentColor: '#0033A1',
    accountLength: 13,
    sampleAccount: '9040002918273',
    feeRatePercent: 0.25,
    feeCapNgn: 160,
  },

  // Pan-African / Rwanda / Egypt / Francophone fallback banks
  {
    id: 'bk-rw',
    name: 'Bank of Kigali',
    shortCode: '040',
    country: 'Rwanda',
    currency: 'RWF',
    railName: 'RSwitch Open Finance',
    apiProvider: 'Mono',
    clearingTime: 'Instant (< 6s)',
    accentColor: '#004E98',
    accountLength: 12,
    sampleAccount: '000400293847',
    feeRatePercent: 0.3,
    feeCapNgn: 200,
  },
  {
    id: 'cib-eg',
    name: 'CIB Egypt (InstaPay Open API)',
    shortCode: '0010',
    country: 'Egypt',
    currency: 'EGP',
    railName: 'CBE InstaPay IPA',
    apiProvider: 'Stitch',
    clearingTime: 'Instant (< 3s)',
    accentColor: '#004990',
    accountLength: 10,
    sampleAccount: '1000293847',
    feeRatePercent: 0.25,
    feeCapNgn: 180,
  },
  {
    id: 'ecobank-pan',
    name: 'Ecobank Pan-African RapidTransfer',
    shortCode: 'ECO-PA',
    country: 'Pan-Africa',
    currency: 'USD',
    railName: 'Ecobank Open Banking Switch',
    apiProvider: 'Mono',
    clearingTime: 'Same-Day / Instant',
    accentColor: '#005C8F',
    accountLength: 12,
    sampleAccount: '391002938471',
    feeRatePercent: 0.3,
    feeCapNgn: 250,
  },
];

export function getBanksForCountry(country: string): AfricanOpenBankingBank[] {
  const normalized = country.trim().toLowerCase();
  const exact = AFRICAN_OPEN_BANKING_BANKS.filter(
    (b) => b.country.toLowerCase() === normalized
  );
  const panAfrican = AFRICAN_OPEN_BANKING_BANKS.filter(
    (b) => b.country === 'Pan-Africa'
  );
  if (exact.length > 0) {
    return [...exact, ...panAfrican];
  }
  return AFRICAN_OPEN_BANKING_BANKS;
}

export function calculateOpenBankingSettlementFeeNgn(
  amountNgn: number,
  bank: AfricanOpenBankingBank
): { openBankingFeeNgn: number; standardCardFeeNgn: number; feeSavingsNgn: number } {
  const rawFee = Math.round((amountNgn * bank.feeRatePercent) / 100);
  const openBankingFeeNgn = Math.min(rawFee, bank.feeCapNgn);
  // Typical African card gateway fee (~1.5% + NGN 100 or 2.9% cross-border)
  const standardCardFeeNgn = Math.round((amountNgn * 1.5) / 100 + 100);
  const feeSavingsNgn = Math.max(0, standardCardFeeNgn - openBankingFeeNgn);
  return { openBankingFeeNgn, standardCardFeeNgn, feeSavingsNgn };
}
