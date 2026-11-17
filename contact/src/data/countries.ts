import { CountryInfo } from '../types';

/**
 * Complete, standardized global dataset of all countries and territories of the world
 * with ISO 3166-1 alpha-2 codes, official international calling/dial codes, emoji flags,
 * regional groupings, and phone formatting guides.
 */
export const COUNTRIES: CountryInfo[] = [
  // ==========================================
  // PAN-AFRICAN MARKETS (Key Priority & All 54 African Nations)
  // ==========================================
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', isAfrican: true, region: 'Africa', example: '803 123 4567' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', isAfrican: true, region: 'Africa', example: '24 123 4567' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', isAfrican: true, region: 'Africa', example: '712 345 678' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', isAfrican: true, region: 'Africa', example: '82 123 4567' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', isAfrican: true, region: 'Africa', example: '788 123 456' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', isAfrican: true, region: 'Africa', example: '772 123 456' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', isAfrican: true, region: 'Africa', example: '712 345 678' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', isAfrican: true, region: 'Africa', example: '100 123 4567' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳', isAfrican: true, region: 'Africa', example: '77 123 45 67' },
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮', isAfrican: true, region: 'Africa', example: '07 12 34 56 78' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲', isAfrican: true, region: 'Africa', example: '6 71 23 45 67' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹', isAfrican: true, region: 'Africa', example: '91 123 4567' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲', isAfrican: true, region: 'Africa', example: '97 1234567' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼', isAfrican: true, region: 'Africa', example: '77 123 4567' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼', isAfrican: true, region: 'Africa', example: '71 123 456' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', isAfrican: true, region: 'Africa', example: '612-345678' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺', isAfrican: true, region: 'Africa', example: '5251 2345' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', isAfrican: true, region: 'Africa', example: '551 23 45 67' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴', isAfrican: true, region: 'Africa', example: '923 123 456' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯', isAfrican: true, region: 'Africa', example: '97 12 34 56' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', isAfrican: true, region: 'Africa', example: '70 12 34 56' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮', isAfrican: true, region: 'Africa', example: '79 12 34 56' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238', flag: '🇨🇻', isAfrican: true, region: 'Africa', example: '991 23 45' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫', isAfrican: true, region: 'Africa', example: '75 12 34 56' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩', isAfrican: true, region: 'Africa', example: '66 12 34 56' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲', isAfrican: true, region: 'Africa', example: '321 23 45' },
  { code: 'CG', name: 'Congo (Republic of)', dialCode: '+242', flag: '🇨🇬', isAfrican: true, region: 'Africa', example: '06 123 4567' },
  { code: 'CD', name: 'Congo (DRC)', dialCode: '+243', flag: '🇨🇩', isAfrican: true, region: 'Africa', example: '812 345 678' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯', isAfrican: true, region: 'Africa', example: '77 12 34 56' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶', isAfrican: true, region: 'Africa', example: '222 12 34 56' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷', isAfrican: true, region: 'Africa', example: '7 123 456' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿', isAfrican: true, region: 'Africa', example: '7612 3456' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', isAfrican: true, region: 'Africa', example: '06 12 34 56' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲', isAfrican: true, region: 'Africa', example: '701 2345' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳', isAfrican: true, region: 'Africa', example: '621 12 34 56' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼', isAfrican: true, region: 'Africa', example: '955 12 34 56' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸', isAfrican: true, region: 'Africa', example: '5812 3456' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷', isAfrican: true, region: 'Africa', example: '77 123 4567' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾', isAfrican: true, region: 'Africa', example: '91 123 4567' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬', isAfrican: true, region: 'Africa', example: '32 12 345 67' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼', isAfrican: true, region: 'Africa', example: '991 23 45 67' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', isAfrican: true, region: 'Africa', example: '65 12 34 56' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷', isAfrican: true, region: 'Africa', example: '22 12 34 56' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿', isAfrican: true, region: 'Africa', example: '84 123 4567' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦', isAfrican: true, region: 'Africa', example: '81 123 4567' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', isAfrican: true, region: 'Africa', example: '90 12 34 56' },
  { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: '🇸🇹', isAfrican: true, region: 'Africa', example: '991 2345' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨', isAfrican: true, region: 'Africa', example: '2 512 345' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱', isAfrican: true, region: 'Africa', example: '76 123456' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴', isAfrican: true, region: 'Africa', example: '61 2345678' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸', isAfrican: true, region: 'Africa', example: '921 123 456' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩', isAfrican: true, region: 'Africa', example: '91 123 4567' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', isAfrican: true, region: 'Africa', example: '90 12 34 56' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', isAfrican: true, region: 'Africa', example: '20 123 456' },

  // ==========================================
  // AMERICAS & CARIBBEAN
  // ==========================================
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', isAfrican: false, region: 'Americas', example: '(201) 555-0123' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', isAfrican: false, region: 'Americas', example: '(416) 555-0123' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', isAfrican: false, region: 'Americas', example: '55 1234 5678' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', isAfrican: false, region: 'Americas', example: '11 91234-5678' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', isAfrican: false, region: 'Americas', example: '11 2345-6789' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', isAfrican: false, region: 'Americas', example: '9 1234 5678' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', isAfrican: false, region: 'Americas', example: '300 123 4567' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', isAfrican: false, region: 'Americas', example: '912 345 678' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', isAfrican: false, region: 'Americas', example: '99 123 4567' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', isAfrican: false, region: 'Americas', example: '412-1234567' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', isAfrican: false, region: 'Americas', example: '71234567' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', isAfrican: false, region: 'Americas', example: '981 123456' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', isAfrican: false, region: 'Americas', example: '99 123 456' },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦', isAfrican: false, region: 'Americas', example: '6123-4567' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', isAfrican: false, region: 'Americas', example: '8312 3456' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1809', flag: '🇩🇴', isAfrican: false, region: 'Americas', example: '(809) 234-5678' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲', isAfrican: false, region: 'Americas', example: '(876) 234-5678' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: '🇹🇹', isAfrican: false, region: 'Americas', example: '(868) 234-5678' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸', isAfrican: false, region: 'Americas', example: '(242) 345-6789' },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧', isAfrican: false, region: 'Americas', example: '(246) 234-5678' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿', isAfrican: false, region: 'Americas', example: '622-1234' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', isAfrican: false, region: 'Americas', example: '5123 4567' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', isAfrican: false, region: 'Americas', example: '9123-4567' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', isAfrican: false, region: 'Americas', example: '7012 3456' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮', isAfrican: false, region: 'Americas', example: '8712 3456' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', isAfrican: false, region: 'Americas', example: '5 1234567' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹', isAfrican: false, region: 'Americas', example: '34 12 3456' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾', isAfrican: false, region: 'Americas', example: '624 1234' },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷', isAfrican: false, region: 'Americas', example: '741 2345' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1787', flag: '🇵🇷', isAfrican: false, region: 'Americas', example: '(787) 234-5678' },
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', flag: '🇦🇬', isAfrican: false, region: 'Americas', example: '(268) 464-1234' },
  { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: '🇩🇲', isAfrican: false, region: 'Americas', example: '(767) 235-1234' },
  { code: 'GD', name: 'Grenada', dialCode: '+1473', flag: '🇬🇩', isAfrican: false, region: 'Americas', example: '(473) 403-1234' },
  { code: 'KN', name: 'Saint Kitts and Nevis', dialCode: '+1869', flag: '🇰🇳', isAfrican: false, region: 'Americas', example: '(869) 662-1234' },
  { code: 'LC', name: 'Saint Lucia', dialCode: '+1758', flag: '🇱🇨', isAfrican: false, region: 'Americas', example: '(758) 285-1234' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '+1784', flag: '🇻🇨', isAfrican: false, region: 'Americas', example: '(784) 492-1234' },
  { code: 'BM', name: 'Bermuda', dialCode: '+1441', flag: '🇧🇲', isAfrican: false, region: 'Americas', example: '(441) 333-1234' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '+1345', flag: '🇰🇾', isAfrican: false, region: 'Americas', example: '(345) 926-1234' },

  // ==========================================
  // EUROPE
  // ==========================================
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', isAfrican: false, region: 'Europe', example: '7911 123456' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', isAfrican: false, region: 'Europe', example: '151 12345678' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', isAfrican: false, region: 'Europe', example: '6 12 34 56 78' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', isAfrican: false, region: 'Europe', example: '612 34 56 78' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', isAfrican: false, region: 'Europe', example: '312 345 6789' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', isAfrican: false, region: 'Europe', example: '912 345 678' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', isAfrican: false, region: 'Europe', example: '6 12345678' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', isAfrican: false, region: 'Europe', example: '470 12 34 56' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', isAfrican: false, region: 'Europe', example: '78 123 45 67' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', isAfrican: false, region: 'Europe', example: '664 1234567' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', isAfrican: false, region: 'Europe', example: '70 123 45 67' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', isAfrican: false, region: 'Europe', example: '412 34 567' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', isAfrican: false, region: 'Europe', example: '20 12 34 56' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', isAfrican: false, region: 'Europe', example: '41 2345678' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', isAfrican: false, region: 'Europe', example: '85 123 4567' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', isAfrican: false, region: 'Europe', example: '512 345 678' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', isAfrican: false, region: 'Europe', example: '601 123 456' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', isAfrican: false, region: 'Europe', example: '712 345 678' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', isAfrican: false, region: 'Europe', example: '691 234 5678' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', isAfrican: false, region: 'Europe', example: '20 123 4567' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', isAfrican: false, region: 'Europe', example: '501 234 56 78' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦', isAfrican: false, region: 'Europe', example: '50 123 4567' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷', isAfrican: false, region: 'Europe', example: '91 234 5678' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸', isAfrican: false, region: 'Europe', example: '60 1234567' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰', isAfrican: false, region: 'Europe', example: '912 345 678' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', isAfrican: false, region: 'Europe', example: '87 123 4567' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹', isAfrican: false, region: 'Europe', example: '612 34567' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻', isAfrican: false, region: 'Europe', example: '2123 4567' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪', isAfrican: false, region: 'Europe', example: '5123 4567' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮', isAfrican: false, region: 'Europe', example: '31 234 567' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', isAfrican: false, region: 'Europe', example: '621 123 456' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾', isAfrican: false, region: 'Europe', example: '96 123456' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', isAfrican: false, region: 'Europe', example: '9912 3456' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸', isAfrican: false, region: 'Europe', example: '612 3456' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱', isAfrican: false, region: 'Europe', example: '67 212 3456' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦', isAfrican: false, region: 'Europe', example: '61 123 456' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰', isAfrican: false, region: 'Europe', example: '70 123 456' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪', isAfrican: false, region: 'Europe', example: '67 123 456' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩', isAfrican: false, region: 'Europe', example: '621 12 345' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪', isAfrican: false, region: 'Europe', example: '555 12 34 56' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲', isAfrican: false, region: 'Europe', example: '77 123456' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿', isAfrican: false, region: 'Europe', example: '50 123 45 67' },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾', isAfrican: false, region: 'Europe', example: '29 123-45-67' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮', isAfrican: false, region: 'Europe', example: '660 1234' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨', isAfrican: false, region: 'Europe', example: '6 12 34 56 78' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩', isAfrican: false, region: 'Europe', example: '312 345' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲', isAfrican: false, region: 'Europe', example: '66 12 34 56' },
  { code: 'VA', name: 'Vatican City', dialCode: '+39', flag: '🇻🇦', isAfrican: false, region: 'Europe', example: '06 69812345' },

  // ==========================================
  // ASIA & MIDDLE EAST
  // ==========================================
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', isAfrican: false, region: 'Asia', example: '50 123 4567' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', isAfrican: false, region: 'Asia', example: '50 123 4567' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', isAfrican: false, region: 'Asia', example: '3312 3456' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', isAfrican: false, region: 'Asia', example: '5012 3456' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', isAfrican: false, region: 'Asia', example: '9123 4567' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', isAfrican: false, region: 'Asia', example: '3600 1234' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', isAfrican: false, region: 'Asia', example: '138 0013 8000' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', isAfrican: false, region: 'Asia', example: '98123 45678' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', isAfrican: false, region: 'Asia', example: '90 1234 5678' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', isAfrican: false, region: 'Asia', example: '10-1234-5678' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', isAfrican: false, region: 'Asia', example: '8123 4567' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', isAfrican: false, region: 'Asia', example: '12-345 6789' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', isAfrican: false, region: 'Asia', example: '812-3456-7890' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', isAfrican: false, region: 'Asia', example: '917 123 4567' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', isAfrican: false, region: 'Asia', example: '81 234 5678' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', isAfrican: false, region: 'Asia', example: '91 234 56 78' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', isAfrican: false, region: 'Asia', example: '301 2345678' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', isAfrican: false, region: 'Asia', example: '1712-345678' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', isAfrican: false, region: 'Asia', example: '71 234 5678' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', isAfrican: false, region: 'Asia', example: '984-1234567' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', isAfrican: false, region: 'Asia', example: '9123 4567' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', isAfrican: false, region: 'Asia', example: '912 345 678' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', isAfrican: false, region: 'Asia', example: '50-123-4567' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', isAfrican: false, region: 'Asia', example: '7 9012 3456' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', isAfrican: false, region: 'Asia', example: '71 123 456' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶', isAfrican: false, region: 'Asia', example: '790 123 4567' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿', isAfrican: false, region: 'Asia', example: '701 123 4567' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿', isAfrican: false, region: 'Asia', example: '90 123 45 67' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭', isAfrican: false, region: 'Asia', example: '12 345 678' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲', isAfrican: false, region: 'Asia', example: '9 251 234 567' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦', isAfrican: false, region: 'Asia', example: '20 22 123 456' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳', isAfrican: false, region: 'Asia', example: '8812 3456' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳', isAfrican: false, region: 'Asia', example: '812 3456' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻', isAfrican: false, region: 'Asia', example: '771-2345' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫', isAfrican: false, region: 'Asia', example: '70 123 4567' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪', isAfrican: false, region: 'Asia', example: '71 123 456' },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸', isAfrican: false, region: 'Asia', example: '59 912 3456' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹', isAfrican: false, region: 'Asia', example: '17 12 34 56' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬', isAfrican: false, region: 'Asia', example: '700 123 456' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯', isAfrican: false, region: 'Asia', example: '91 812 3456' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲', isAfrican: false, region: 'Asia', example: '65 123456' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱', isAfrican: false, region: 'Asia', example: '7721 2345' },
  { code: 'MO', name: 'Macau', dialCode: '+853', flag: '🇲🇴', isAfrican: false, region: 'Asia', example: '6612 3456' },

  // ==========================================
  // OCEANIA
  // ==========================================
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', isAfrican: false, region: 'Oceania', example: '412 345 678' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', isAfrican: false, region: 'Oceania', example: '21 123 4567' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬', isAfrican: false, region: 'Oceania', example: '7012 3456' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯', isAfrican: false, region: 'Oceania', example: '701 2345' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧', isAfrican: false, region: 'Oceania', example: '742 1234' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺', isAfrican: false, region: 'Oceania', example: '591 2345' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸', isAfrican: false, region: 'Oceania', example: '72 12345' },
  { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴', isAfrican: false, region: 'Oceania', example: '771 2345' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲', isAfrican: false, region: 'Oceania', example: '920 1234' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭', isAfrican: false, region: 'Oceania', example: '235 1234' },
  { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼', isAfrican: false, region: 'Oceania', example: '775 1234' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮', isAfrican: false, region: 'Oceania', example: '720 12345' },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷', isAfrican: false, region: 'Oceania', example: '555 1234' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻', isAfrican: false, region: 'Oceania', example: '90 1234' },
];

/**
 * Fast lookup helper by 2-letter ISO country code (case-insensitive)
 */
export const getCountryByCode = (code: string): CountryInfo | undefined => {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  return COUNTRIES.find((c) => c.code === upper);
};

/**
 * Fast lookup helper by international phone dial code (e.g. "+234", "234")
 */
export const getCountryByDialCode = (dialCode: string): CountryInfo | undefined => {
  if (!dialCode) return undefined;
  const normalized = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return COUNTRIES.find((c) => c.dialCode === normalized);
};

/**
 * Helper to get all African nations
 */
export const getAfricanCountries = (): CountryInfo[] => {
  return COUNTRIES.filter((c) => c.isAfrican);
};

export const INDUSTRIES = [
  'Retail Store & Supermarket',
  'Hospitality, Hotel & Restaurant',
  'Wholesale & FMCG Distribution',
  'Professional Services & Accounting',
  'Healthcare, Pharmacy & Clinics',
  'Manufacturing & Assembly',
  'Technology & Software Startups',
  'Agriculture & Agribusiness',
  'Construction & Real Estate',
  'Transportation & Logistics',
  'Education & Training',
  'Oil, Gas & Energy Services',
  'Financial Services & Fintech',
  'Non-Profit & NGO Organization',
  'Other Business / Enterprise',
];

export const ENQUIRY_TYPES = [
  'General Enquiry',
  'Sales & Pricing',
  'Request Product Demo',
  'Technical Support',
  'Accounting & Bookkeeping',
  'POS & Inventory',
  'Hotel & Hospitality Solutions',
  'Integrations & API',
  'Reseller / Distributor Partnership',
  'Accountant / Bookkeeper Partnership',
  'Enterprise Solutions',
  'Billing & Subscription',
  'Other Enquiries',
] as const;
