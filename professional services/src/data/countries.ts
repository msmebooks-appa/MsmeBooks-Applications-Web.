export interface WorldCountry {
  code: string;
  name: string;
  flag: string;
  region: 'Africa' | 'Europe' | 'North America' | 'South America' | 'Asia' | 'Oceania' | 'Middle East';
  majorCities: string[];
  currencyCode: string;
}

export const ALL_WORLD_COUNTRIES: WorldCountry[] = [
  // Africa
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', majorCities: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Benin City', 'Warri'], currencyCode: 'NGN' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa', majorCities: ['Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Tema', 'Cape Coast'], currencyCode: 'GHS' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa', majorCities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'], currencyCode: 'KES' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa', majorCities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Gqeberha', 'Sandton'], currencyCode: 'ZAR' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', region: 'Africa', majorCities: ['Kigali', 'Butare', 'Gisenyi', 'Musanze'], currencyCode: 'RWF' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', region: 'Africa', majorCities: ['Kampala', 'Entebbe', 'Jinja', 'Gulu', 'Mbarara'], currencyCode: 'UGX' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', majorCities: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar'], currencyCode: 'TZS' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa', majorCities: ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh', 'Luxor'], currencyCode: 'EGP' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa', majorCities: ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fes'], currencyCode: 'MAD' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', region: 'Africa', majorCities: ['Dakar', 'Thies', 'Saint-Louis', 'Touba'], currencyCode: 'XOF' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', region: 'Africa', majorCities: ['Abidjan', 'Yamoussoukro', 'Bouake', 'San Pedro'], currencyCode: 'XOF' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', region: 'Africa', majorCities: ['Douala', 'Yaounde', 'Bamenda', 'Bafoussam'], currencyCode: 'XAF' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa', majorCities: ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar'], currencyCode: 'ETB' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', region: 'Africa', majorCities: ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone'], currencyCode: 'ZMW' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', region: 'Africa', majorCities: ['Harare', 'Bulawayo', 'Mutare', 'Victoria Falls'], currencyCode: 'USD' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', region: 'Africa', majorCities: ['Gaborone', 'Francistown', 'Maun'], currencyCode: 'BWP' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', majorCities: ['Port Louis', 'Ebene Cybercity', 'Grand Baie', 'Curepipe'], currencyCode: 'MUR' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', region: 'Africa', majorCities: ['Windhoek', 'Walvis Bay', 'Swakopmund'], currencyCode: 'NAD' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', region: 'Africa', majorCities: ['Luanda', 'Huambo', 'Lobito', 'Benguela'], currencyCode: 'AOA' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', region: 'Africa', majorCities: ['Maputo', 'Matola', 'Beira', 'Nampula'], currencyCode: 'MZN' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', region: 'Africa', majorCities: ['Freetown', 'Bo', 'Kenema', 'Makeni'], currencyCode: 'SLE' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', region: 'Africa', majorCities: ['Monrovia', 'Gbarnga', 'Buchanan', 'Kakata'], currencyCode: 'LRD' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', region: 'Africa', majorCities: ['Banjul', 'Serekunda', 'Brikama', 'Bakau'], currencyCode: 'GMD' },

  // Europe & UK
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', majorCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Leeds', 'Bristol'], currencyCode: 'GBP' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', majorCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart'], currencyCode: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', majorCities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Nice'], currencyCode: 'EUR' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', majorCities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'], currencyCode: 'EUR' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'Europe', majorCities: ['Dublin', 'Cork', 'Galway', 'Limerick'], currencyCode: 'EUR' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', majorCities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'], currencyCode: 'CHF' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', majorCities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga'], currencyCode: 'EUR' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', majorCities: ['Milan', 'Rome', 'Turin', 'Bologna', 'Florence'], currencyCode: 'EUR' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe', majorCities: ['Brussels', 'Antwerp', 'Ghent', 'Leuven'], currencyCode: 'EUR' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', majorCities: ['Stockholm', 'Gothenburg', 'Malmo'], currencyCode: 'SEK' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe', majorCities: ['Oslo', 'Bergen', 'Stavanger', 'Trondheim'], currencyCode: 'NOK' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe', majorCities: ['Copenhagen', 'Aarhus', 'Odense'], currencyCode: 'DKK' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe', majorCities: ['Helsinki', 'Espoo', 'Tampere'], currencyCode: 'EUR' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe', majorCities: ['Warsaw', 'Krakow', 'Wroclaw', 'Gdansk'], currencyCode: 'PLN' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', majorCities: ['Lisbon', 'Porto', 'Braga', 'Faro'], currencyCode: 'EUR' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe', majorCities: ['Vienna', 'Salzburg', 'Graz', 'Innsbruck'], currencyCode: 'EUR' },

  // North America
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America', majorCities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Atlanta', 'Dallas', 'San Francisco', 'Seattle'], currencyCode: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America', majorCities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'], currencyCode: 'CAD' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America', majorCities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancun'], currencyCode: 'MXN' },

  // Middle East
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', majorCities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'], currencyCode: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', majorCities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Mecca', 'Medina'], currencyCode: 'SAR' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', majorCities: ['Doha', 'Al Wakrah', 'Lusail', 'Al Khor'], currencyCode: 'QAR' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', majorCities: ['Manama', 'Riffa', 'Muharraq'], currencyCode: 'BHD' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'Middle East', majorCities: ['Muscat', 'Salalah', 'Sohar'], currencyCode: 'OMR' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', majorCities: ['Kuwait City', 'Hawalli', 'Salmiya'], currencyCode: 'KWD' },

  // Asia & Oceania
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', majorCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'], currencyCode: 'INR' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia', majorCities: ['Singapore Central', 'Jurong', 'Changi', 'Tampines'], currencyCode: 'SGD' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', majorCities: ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Petaling Jaya'], currencyCode: 'MYR' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania', majorCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'], currencyCode: 'AUD' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', majorCities: ['Auckland', 'Wellington', 'Christchurch'], currencyCode: 'NZD' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', majorCities: ['Tokyo', 'Osaka', 'Yokohama', 'Kyoto', 'Nagoya'], currencyCode: 'JPY' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia', majorCities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Hangzhou'], currencyCode: 'CNY' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', majorCities: ['Seoul', 'Busan', 'Incheon', 'Daegu'], currencyCode: 'KRW' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', majorCities: ['Jakarta', 'Surabaya', 'Bandung', 'Bali (Denpasar)'], currencyCode: 'IDR' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia', majorCities: ['Manila', 'Cebu City', 'Davao City', 'Makati'], currencyCode: 'PHP' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', majorCities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'], currencyCode: 'VND' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', majorCities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'], currencyCode: 'THB' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia', majorCities: ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad'], currencyCode: 'PKR' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia', majorCities: ['Dhaka', 'Chittagong', 'Sylhet'], currencyCode: 'BDT' },

  // South America & Caribbean
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America', majorCities: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Curitiba'], currencyCode: 'BRL' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America', majorCities: ['Buenos Aires', 'Cordoba', 'Rosario'], currencyCode: 'ARS' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'South America', majorCities: ['Santiago', 'Valparaiso', 'Concepcion'], currencyCode: 'CLP' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America', majorCities: ['Bogota', 'Medellin', 'Cali', 'Barranquilla'], currencyCode: 'COP' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'South America', majorCities: ['Kingston', 'Montego Bay', 'Spanish Town'], currencyCode: 'JMD' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'South America', majorCities: ['Port of Spain', 'San Fernando', 'Chaguanas'], currencyCode: 'TTD' },
];

export const REGIONS = [
  'All Regions',
  'Africa',
  'Europe',
  'North America',
  'Middle East',
  'Asia',
  'Oceania',
  'South America',
] as const;

export function findCountryByName(name: string): WorldCountry | undefined {
  if (!name) return undefined;
  const n = name.trim().toLowerCase();
  return ALL_WORLD_COUNTRIES.find(
    c => c.name.toLowerCase() === n || c.code.toLowerCase() === n
  );
}
