export interface BankHoliday {
  name: string;
  dateStr: string; // e.g. "2026-05-01" or "May 1"
  description: string;
  isUpcomingOrActive: boolean;
  daysAway: number;
}

export interface CountryHolidayInfo {
  countryName: string;
  countryCode: string;
  currencyCode: string;
  flag: string;
  nextHoliday: BankHoliday;
  activeHolidayWarning?: string;
  allHolidays: { name: string; date: string; description: string }[];
}

export const COUNTRY_BANK_HOLIDAYS: Record<string, CountryHolidayInfo> = {
  NGN: {
    countryName: 'Nigeria',
    countryCode: 'NG',
    currencyCode: 'NGN',
    flag: '🇳🇬',
    nextHoliday: {
      name: 'Workers\' Day & Democracy Day',
      dateStr: 'May 1 & June 12',
      description: 'National public holiday observed across all 36 Nigerian states and FCT Abuja.',
      isUpcomingOrActive: true,
      daysAway: 4,
    },
    activeHolidayWarning: 'Bank Settlement Advisory: Commercial Nigerian banks and NIBSS clearing may experience holiday processing queues. MsmeBooks cloud servers and offline POS remain 100% active 24/7.',
    allHolidays: [
      { name: 'New Year\'s Day', date: 'Jan 1', description: 'Statutory national holiday' },
      { name: 'Good Friday & Easter Monday', date: 'April', description: 'Federal statutory bank holidays' },
      { name: 'Eid-el-Fitr', date: 'March / April', description: 'Islamic holiday observed nationwide' },
      { name: 'Workers\' Day', date: 'May 1', description: 'Labor Day observed across all commercial institutions' },
      { name: 'Democracy Day', date: 'June 12', description: 'Celebration of Nigerian democratic governance' },
      { name: 'Eid-el-Kabir', date: 'June', description: 'Federal public holiday' },
      { name: 'Independence Day', date: 'Oct 1', description: 'National Independence day' },
      { name: 'Christmas & Boxing Day', date: 'Dec 25 - 26', description: 'Public holiday nationwide' },
    ],
  },
  GHS: {
    countryName: 'Ghana',
    countryCode: 'GH',
    currencyCode: 'GHS',
    flag: '🇬🇭',
    nextHoliday: {
      name: 'Independence Day & African Union Day',
      dateStr: 'March 6 / May 25',
      description: 'Official statutory public holiday observed across the Republic of Ghana.',
      isUpcomingOrActive: true,
      daysAway: 8,
    },
    activeHolidayWarning: 'Ghana Revenue Authority (GRA) and commercial banking clearing may have delayed response times during national public holidays.',
    allHolidays: [
      { name: 'Constitution Day', date: 'Jan 7', description: 'Celebration of Ghanaian 4th Republic' },
      { name: 'Independence Day', date: 'March 6', description: 'National holiday in Ghana' },
      { name: 'Workers\' Day', date: 'May 1', description: 'Statutory public holiday' },
      { name: 'AU Day', date: 'May 25', description: 'African Union celebration' },
      { name: 'Founders\' Day', date: 'Aug 4', description: 'Honoring founders of Ghana' },
      { name: 'Kwame Nkrumah Memorial Day', date: 'Sept 21', description: 'National public holiday' },
    ],
  },
  KES: {
    countryName: 'Kenya',
    countryCode: 'KE',
    currencyCode: 'KES',
    flag: '🇰🇪',
    nextHoliday: {
      name: 'Madaraka Day & Mashujaa Day',
      dateStr: 'June 1 / Oct 20',
      description: 'National public holidays celebrated across Kenya.',
      isUpcomingOrActive: true,
      daysAway: 6,
    },
    activeHolidayWarning: 'KRA iTax filing assistance and bank inter-switch clearing may have adjusted support hours during Kenyan public holidays.',
    allHolidays: [
      { name: 'New Year\'s Day', date: 'Jan 1', description: 'Public holiday' },
      { name: 'Labor Day', date: 'May 1', description: 'Statutory labor holiday' },
      { name: 'Madaraka Day', date: 'June 1', description: 'Self-governance day' },
      { name: 'Utamaduni Day', date: 'Oct 10', description: 'Cultural diversity holiday' },
      { name: 'Mashujaa Day', date: 'Oct 20', description: 'Heroes day in Kenya' },
      { name: 'Jamhuri Day', date: 'Dec 12', description: 'Republic day' },
    ],
  },
  ZAR: {
    countryName: 'South Africa',
    countryCode: 'ZA',
    currencyCode: 'ZAR',
    flag: '🇿🇦',
    nextHoliday: {
      name: 'Freedom Day & Workers\' Day',
      dateStr: 'April 27 / May 1',
      description: 'South African statutory public holidays.',
      isUpcomingOrActive: true,
      daysAway: 5,
    },
    activeHolidayWarning: 'SARS eFiling telephonic support and SARB payment clearing observe statutory South African bank holidays.',
    allHolidays: [
      { name: 'Human Rights Day', date: 'March 21', description: 'Statutory holiday' },
      { name: 'Freedom Day', date: 'April 27', description: 'First democratic elections commemoration' },
      { name: 'Workers\' Day', date: 'May 1', description: 'National public holiday' },
      { name: 'Youth Day', date: 'June 16', description: 'Commemorating Soweto youth' },
      { name: 'National Women\'s Day', date: 'Aug 9', description: 'Statutory holiday' },
      { name: 'Heritage Day', date: 'Sept 24', description: 'Cultural heritage day' },
      { name: 'Day of Reconciliation', date: 'Dec 16', description: 'National unity day' },
    ],
  },
  GBP: {
    countryName: 'United Kingdom',
    countryCode: 'GB',
    currencyCode: 'GBP',
    flag: '🇬🇧',
    nextHoliday: {
      name: 'Early May & Spring Bank Holiday',
      dateStr: 'First & Last Monday in May',
      description: 'UK nationwide statutory bank holiday.',
      isUpcomingOrActive: true,
      daysAway: 11,
    },
    activeHolidayWarning: 'UK clearing banks and HMRC telephone support observe statutory UK Bank Holidays.',
    allHolidays: [
      { name: 'New Year\'s Day', date: 'Jan 1', description: 'Bank holiday' },
      { name: 'Good Friday & Easter Monday', date: 'Spring', description: 'Bank holidays' },
      { name: 'Early May Bank Holiday', date: 'May (first Mon)', description: 'Statutory bank holiday' },
      { name: 'Spring Bank Holiday', date: 'May (last Mon)', description: 'Statutory bank holiday' },
      { name: 'Summer Bank Holiday', date: 'August (last Mon)', description: 'Bank holiday' },
    ],
  },
  USD: {
    countryName: 'United States',
    countryCode: 'US',
    currencyCode: 'USD',
    flag: '🇺🇸',
    nextHoliday: {
      name: 'Memorial Day & Juneteenth',
      dateStr: 'Last Monday in May / June 19',
      description: 'US Federal statutory holidays.',
      isUpcomingOrActive: true,
      daysAway: 14,
    },
    activeHolidayWarning: 'Federal Reserve ACH clearing and US banking institutions are closed on federal holidays.',
    allHolidays: [
      { name: 'Martin Luther King Jr. Day', date: 'Jan (3rd Mon)', description: 'Federal holiday' },
      { name: 'Presidents\' Day', date: 'Feb (3rd Mon)', description: 'Federal holiday' },
      { name: 'Memorial Day', date: 'May (last Mon)', description: 'Federal holiday' },
      { name: 'Juneteenth', date: 'June 19', description: 'Federal holiday' },
      { name: 'Independence Day', date: 'July 4', description: 'Federal holiday' },
      { name: 'Labor Day', date: 'Sept (1st Mon)', description: 'Federal holiday' },
    ],
  },
};

export function getHolidayInfoForCurrency(currencyCode: string): CountryHolidayInfo {
  return COUNTRY_BANK_HOLIDAYS[currencyCode] || COUNTRY_BANK_HOLIDAYS.NGN;
}
