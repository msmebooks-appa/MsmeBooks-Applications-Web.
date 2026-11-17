export interface GeoCoordinate {
  lat: number;
  lng: number;
  city: string;
  country: string;
  countryFlag: string;
  region: 'west-africa' | 'east-africa' | 'southern-africa' | 'north-africa' | 'global';
}

// Canonical city geo-coordinates for all MsmeBooks partner hubs & major global cities
// Every city & country name matches COUNTRIES_LIST in src/data/countriesData.ts
export const CITY_GEO_COORDINATES: Record<string, GeoCoordinate> = {
  // Nigeria
  'Lagos': {
    lat: 6.5244,
    lng: 3.3792,
    city: 'Lagos',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  'Abuja': {
    lat: 9.0765,
    lng: 7.3986,
    city: 'Abuja',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  'Port Harcourt': {
    lat: 4.8156,
    lng: 7.0498,
    city: 'Port Harcourt',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  'Kano': {
    lat: 12.0022,
    lng: 8.5920,
    city: 'Kano',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  'Ibadan': {
    lat: 7.3775,
    lng: 3.9470,
    city: 'Ibadan',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  'Enugu': {
    lat: 6.4584,
    lng: 7.5464,
    city: 'Enugu',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  'Benin City': {
    lat: 6.3350,
    lng: 5.6037,
    city: 'Benin City',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    region: 'west-africa',
  },
  // Ghana
  'Accra': {
    lat: 5.6037,
    lng: -0.1870,
    city: 'Accra',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    region: 'west-africa',
  },
  'Kumasi': {
    lat: 6.6885,
    lng: -1.6244,
    city: 'Kumasi',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    region: 'west-africa',
  },
  'Tema': {
    lat: 5.6698,
    lng: -0.0166,
    city: 'Tema',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    region: 'west-africa',
  },
  // Francophone & West Africa
  'Abidjan': {
    lat: 5.3600,
    lng: -4.0083,
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    countryFlag: '🇨🇮',
    region: 'west-africa',
  },
  'Dakar': {
    lat: 14.7167,
    lng: -17.4677,
    city: 'Dakar',
    country: 'Senegal',
    countryFlag: '🇸🇳',
    region: 'west-africa',
  },
  'Cotonou': {
    lat: 6.3703,
    lng: 2.3912,
    city: 'Cotonou',
    country: 'Benin',
    countryFlag: '🇧🇯',
    region: 'west-africa',
  },
  'Lomé': {
    lat: 6.1375,
    lng: 1.2123,
    city: 'Lomé',
    country: 'Togo',
    countryFlag: '🇹🇬',
    region: 'west-africa',
  },
  'Bamako': {
    lat: 12.6392,
    lng: -8.0029,
    city: 'Bamako',
    country: 'Mali',
    countryFlag: '🇲🇱',
    region: 'west-africa',
  },
  // Central Africa
  'Douala': {
    lat: 4.0511,
    lng: 9.7679,
    city: 'Douala',
    country: 'Cameroon',
    countryFlag: '🇨🇲',
    region: 'west-africa',
  },
  'Yaoundé': {
    lat: 3.8480,
    lng: 11.5021,
    city: 'Yaoundé',
    country: 'Cameroon',
    countryFlag: '🇨🇲',
    region: 'west-africa',
  },
  'Kinshasa': {
    lat: -4.4419,
    lng: 15.2663,
    city: 'Kinshasa',
    country: 'Democratic Republic of the Congo',
    countryFlag: '🇨🇩',
    region: 'west-africa',
  },
  // East Africa
  'Nairobi': {
    lat: -1.2921,
    lng: 36.8219,
    city: 'Nairobi',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    region: 'east-africa',
  },
  'Mombasa': {
    lat: -4.0435,
    lng: 39.6682,
    city: 'Mombasa',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    region: 'east-africa',
  },
  'Kisumu': {
    lat: -0.0917,
    lng: 34.7680,
    city: 'Kisumu',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    region: 'east-africa',
  },
  'Kampala': {
    lat: 0.3476,
    lng: 32.5825,
    city: 'Kampala',
    country: 'Uganda',
    countryFlag: '🇺🇬',
    region: 'east-africa',
  },
  'Dar es Salaam': {
    lat: -6.7924,
    lng: 39.2083,
    city: 'Dar es Salaam',
    country: 'Tanzania',
    countryFlag: '🇹🇿',
    region: 'east-africa',
  },
  'Arusha': {
    lat: -3.3869,
    lng: 36.6830,
    city: 'Arusha',
    country: 'Tanzania',
    countryFlag: '🇹🇿',
    region: 'east-africa',
  },
  'Kigali': {
    lat: -1.9706,
    lng: 30.1044,
    city: 'Kigali',
    country: 'Rwanda',
    countryFlag: '🇷🇼',
    region: 'east-africa',
  },
  'Addis Ababa': {
    lat: 9.0320,
    lng: 38.7480,
    city: 'Addis Ababa',
    country: 'Ethiopia',
    countryFlag: '🇪🇹',
    region: 'east-africa',
  },
  // Southern Africa
  'Johannesburg': {
    lat: -26.2041,
    lng: 28.0473,
    city: 'Johannesburg',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    region: 'southern-africa',
  },
  'Cape Town': {
    lat: -33.9249,
    lng: 18.4241,
    city: 'Cape Town',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    region: 'southern-africa',
  },
  'Durban': {
    lat: -29.8587,
    lng: 31.0218,
    city: 'Durban',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    region: 'southern-africa',
  },
  'Pretoria': {
    lat: -25.7479,
    lng: 28.2293,
    city: 'Pretoria',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    region: 'southern-africa',
  },
  'Lusaka': {
    lat: -15.3875,
    lng: 28.3228,
    city: 'Lusaka',
    country: 'Zambia',
    countryFlag: '🇿🇲',
    region: 'southern-africa',
  },
  'Gaborone': {
    lat: -24.6282,
    lng: 25.9231,
    city: 'Gaborone',
    country: 'Botswana',
    countryFlag: '🇧🇼',
    region: 'southern-africa',
  },
  'Harare': {
    lat: -17.8252,
    lng: 31.0335,
    city: 'Harare',
    country: 'Zimbabwe',
    countryFlag: '🇿🇼',
    region: 'southern-africa',
  },
  'Windhoek': {
    lat: -22.5609,
    lng: 17.0658,
    city: 'Windhoek',
    country: 'Namibia',
    countryFlag: '🇳🇦',
    region: 'southern-africa',
  },
  'Luanda': {
    lat: -8.8390,
    lng: 13.2894,
    city: 'Luanda',
    country: 'Angola',
    countryFlag: '🇦🇴',
    region: 'southern-africa',
  },
  'Maputo': {
    lat: -25.9692,
    lng: 32.5732,
    city: 'Maputo',
    country: 'Mozambique',
    countryFlag: '🇲🇿',
    region: 'southern-africa',
  },
  // North Africa
  'Cairo': {
    lat: 30.0444,
    lng: 31.2357,
    city: 'Cairo',
    country: 'Egypt',
    countryFlag: '🇪🇬',
    region: 'north-africa',
  },
  'Alexandria': {
    lat: 31.2001,
    lng: 29.9187,
    city: 'Alexandria',
    country: 'Egypt',
    countryFlag: '🇪🇬',
    region: 'north-africa',
  },
  'Casablanca': {
    lat: 33.5731,
    lng: -7.5898,
    city: 'Casablanca',
    country: 'Morocco',
    countryFlag: '🇲🇦',
    region: 'north-africa',
  },
  'Rabat': {
    lat: 34.0209,
    lng: -6.8416,
    city: 'Rabat',
    country: 'Morocco',
    countryFlag: '🇲🇦',
    region: 'north-africa',
  },
  'Marrakech': {
    lat: 31.6295,
    lng: -7.9811,
    city: 'Marrakech',
    country: 'Morocco',
    countryFlag: '🇲🇦',
    region: 'north-africa',
  },
  'Tunis': {
    lat: 36.8065,
    lng: 10.1815,
    city: 'Tunis',
    country: 'Tunisia',
    countryFlag: '🇹🇳',
    region: 'north-africa',
  },
  'Algiers': {
    lat: 36.7538,
    lng: 3.0588,
    city: 'Algiers',
    country: 'Algeria',
    countryFlag: '🇩🇿',
    region: 'north-africa',
  },
  // Europe
  'London': {
    lat: 51.5074,
    lng: -0.1278,
    city: 'London',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    region: 'global',
  },
  'Manchester': {
    lat: 53.4808,
    lng: -2.2426,
    city: 'Manchester',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    region: 'global',
  },
  'Birmingham': {
    lat: 52.4862,
    lng: -1.8904,
    city: 'Birmingham',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    region: 'global',
  },
  'Edinburgh': {
    lat: 55.9533,
    lng: -3.1883,
    city: 'Edinburgh',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    region: 'global',
  },
  'Dublin': {
    lat: 53.3498,
    lng: -6.2603,
    city: 'Dublin',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    region: 'global',
  },
  'Paris': {
    lat: 48.8566,
    lng: 2.3522,
    city: 'Paris',
    country: 'France',
    countryFlag: '🇫🇷',
    region: 'global',
  },
  'Lyon': {
    lat: 45.7640,
    lng: 4.8357,
    city: 'Lyon',
    country: 'France',
    countryFlag: '🇫🇷',
    region: 'global',
  },
  'Berlin': {
    lat: 52.5200,
    lng: 13.4050,
    city: 'Berlin',
    country: 'Germany',
    countryFlag: '🇩🇪',
    region: 'global',
  },
  'Frankfurt': {
    lat: 50.1109,
    lng: 8.6821,
    city: 'Frankfurt',
    country: 'Germany',
    countryFlag: '🇩🇪',
    region: 'global',
  },
  'Munich': {
    lat: 48.1351,
    lng: 11.5820,
    city: 'Munich',
    country: 'Germany',
    countryFlag: '🇩🇪',
    region: 'global',
  },
  'Amsterdam': {
    lat: 52.3676,
    lng: 4.9041,
    city: 'Amsterdam',
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    region: 'global',
  },
  'Zurich': {
    lat: 47.3769,
    lng: 8.5417,
    city: 'Zurich',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    region: 'global',
  },
  'Madrid': {
    lat: 40.4168,
    lng: -3.7038,
    city: 'Madrid',
    country: 'Spain',
    countryFlag: '🇪🇸',
    region: 'global',
  },
  'Barcelona': {
    lat: 41.3874,
    lng: 2.1686,
    city: 'Barcelona',
    country: 'Spain',
    countryFlag: '🇪🇸',
    region: 'global',
  },
  'Milan': {
    lat: 45.4642,
    lng: 9.1900,
    city: 'Milan',
    country: 'Italy',
    countryFlag: '🇮🇹',
    region: 'global',
  },
  'Rome': {
    lat: 41.9028,
    lng: 12.4964,
    city: 'Rome',
    country: 'Italy',
    countryFlag: '🇮🇹',
    region: 'global',
  },
  'Lisbon': {
    lat: 38.7223,
    lng: -9.1393,
    city: 'Lisbon',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    region: 'global',
  },
  // North America
  'Atlanta': {
    lat: 33.7490,
    lng: -84.3880,
    city: 'Atlanta',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'New York': {
    lat: 40.7128,
    lng: -74.0060,
    city: 'New York',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'Chicago': {
    lat: 41.8781,
    lng: -87.6298,
    city: 'Chicago',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'Houston': {
    lat: 29.7604,
    lng: -95.3698,
    city: 'Houston',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'Dallas': {
    lat: 32.7767,
    lng: -96.7970,
    city: 'Dallas',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'Miami': {
    lat: 25.7617,
    lng: -80.1918,
    city: 'Miami',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'San Francisco': {
    lat: 37.7749,
    lng: -122.4194,
    city: 'San Francisco',
    country: 'United States',
    countryFlag: '🇺🇸',
    region: 'global',
  },
  'Toronto': {
    lat: 43.6532,
    lng: -79.3832,
    city: 'Toronto',
    country: 'Canada',
    countryFlag: '🇨🇦',
    region: 'global',
  },
  'Vancouver': {
    lat: 49.2827,
    lng: -123.1207,
    city: 'Vancouver',
    country: 'Canada',
    countryFlag: '🇨🇦',
    region: 'global',
  },
  'Montreal': {
    lat: 45.5017,
    lng: -73.5673,
    city: 'Montreal',
    country: 'Canada',
    countryFlag: '🇨🇦',
    region: 'global',
  },
  'Calgary': {
    lat: 51.0447,
    lng: -114.0719,
    city: 'Calgary',
    country: 'Canada',
    countryFlag: '🇨🇦',
    region: 'global',
  },
  'Mexico City': {
    lat: 19.4326,
    lng: -99.1332,
    city: 'Mexico City',
    country: 'Mexico',
    countryFlag: '🇲🇽',
    region: 'global',
  },
  // Middle East
  'Dubai': {
    lat: 25.2048,
    lng: 55.2708,
    city: 'Dubai',
    country: 'UAE',
    countryFlag: '🇦🇪',
    region: 'global',
  },
  'Abu Dhabi': {
    lat: 24.4539,
    lng: 54.3773,
    city: 'Abu Dhabi',
    country: 'UAE',
    countryFlag: '🇦🇪',
    region: 'global',
  },
  'Riyadh': {
    lat: 24.7136,
    lng: 46.6753,
    city: 'Riyadh',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    region: 'global',
  },
  'Doha': {
    lat: 25.2854,
    lng: 51.5310,
    city: 'Doha',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    region: 'global',
  },
  // Asia & Pacific
  'Mumbai': {
    lat: 19.0760,
    lng: 72.8777,
    city: 'Mumbai',
    country: 'India',
    countryFlag: '🇮🇳',
    region: 'global',
  },
  'Delhi': {
    lat: 28.6139,
    lng: 77.2090,
    city: 'Delhi',
    country: 'India',
    countryFlag: '🇮🇳',
    region: 'global',
  },
  'Bangalore': {
    lat: 12.9716,
    lng: 77.5946,
    city: 'Bangalore',
    country: 'India',
    countryFlag: '🇮🇳',
    region: 'global',
  },
  'Singapore City': {
    lat: 1.3521,
    lng: 103.8198,
    city: 'Singapore City',
    country: 'Singapore',
    countryFlag: '🇸🇬',
    region: 'global',
  },
  'Sydney': {
    lat: -33.8688,
    lng: 151.2093,
    city: 'Sydney',
    country: 'Australia',
    countryFlag: '🇦🇺',
    region: 'global',
  },
  'Melbourne': {
    lat: -37.8136,
    lng: 144.9631,
    city: 'Melbourne',
    country: 'Australia',
    countryFlag: '🇦🇺',
    region: 'global',
  },
  'Tokyo': {
    lat: 35.6762,
    lng: 139.6503,
    city: 'Tokyo',
    country: 'Japan',
    countryFlag: '🇯🇵',
    region: 'global',
  },
  'Shanghai': {
    lat: 31.2304,
    lng: 121.4737,
    city: 'Shanghai',
    country: 'China',
    countryFlag: '🇨🇳',
    region: 'global',
  },
  // Latin America
  'São Paulo': {
    lat: -23.5505,
    lng: -46.6333,
    city: 'São Paulo',
    country: 'Brazil',
    countryFlag: '🇧🇷',
    region: 'global',
  },
};

// Exact partner coordinate mapping with real-world city coordinate offsets
export const PARTNER_REAL_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'p-01': { lat: 6.4281, lng: 3.4219 }, // Victoria Island, Lagos
  'p-02': { lat: -1.2673, lng: 36.8113 }, // Westlands, Nairobi
  'p-03': { lat: 5.6001, lng: -0.1802 }, // Airport Residential, Accra
  'p-04': { lat: -26.1076, lng: 28.0567 }, // Sandton, Johannesburg
  'p-05': { lat: -1.9540, lng: 30.0890 }, // Kigali City Centre
  'p-06': { lat: 30.0561, lng: 31.3301 }, // Nasr City, Cairo
  'p-07': { lat: 33.5928, lng: -7.6192 }, // Bd Mohammed V, Casablanca
  'p-08': { lat: 14.7180, lng: -17.4690 }, // Almadies, Dakar
  'p-09': { lat: 5.3364, lng: -4.0267 }, // Plateau, Abidjan
  'p-10': { lat: 0.3163, lng: 32.5811 }, // Nakasero, Kampala
  'p-11': { lat: -6.8163, lng: 39.2804 }, // Posta / CBD, Dar es Salaam
  'p-12': { lat: 4.0435, lng: 9.6934 }, // Akwa, Douala
  'p-13': { lat: 9.0108, lng: 38.7617 }, // Bole Medhanealem, Addis Ababa
  'p-14': { lat: -15.4167, lng: 28.2833 }, // Longacres, Lusaka
  'p-15': { lat: -24.6541, lng: 25.9087 }, // Fairgrounds, Gaborone
  'p-16': { lat: 51.5138, lng: -0.0884 }, // City of London
  'p-17': { lat: 33.8463, lng: -84.3621 }, // Buckhead, Atlanta
  'p-18': { lat: 25.0925, lng: 55.1561 }, // Business Bay, Dubai
  'p-19': { lat: 43.6487, lng: -79.3817 }, // Financial District, Toronto
  'p-20': { lat: 19.0657, lng: 72.8687 }, // BKC, Mumbai
};

export function getPartnerCoordinates(partner: { id: string; city: string; country: string }) {
  if (PARTNER_REAL_COORDINATES[partner.id]) {
    return PARTNER_REAL_COORDINATES[partner.id];
  }
  const cityMatch = CITY_GEO_COORDINATES[partner.city.trim()];
  if (cityMatch) {
    return { lat: cityMatch.lat, lng: cityMatch.lng };
  }
  return { lat: 6.5244, lng: 3.3792 };
}

// Great-circle distance using Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km away`;
  }
  return `${Math.round(km).toLocaleString()} km away`;
}

// Anchors mapping real-world lat/lng to the stylized GlobalMapSection SVG (0..100 percentage)
const MAP_ANCHORS: { lat: number; lng: number; x: number; y: number }[] = [
  { lat: 6.4281, lng: 3.4219, x: 44.5, y: 53.5 }, // Lagos
  { lat: 5.6001, lng: -0.1802, x: 40.0, y: 55.5 }, // Accra
  { lat: 14.7180, lng: -17.4690, x: 33.5, y: 49.5 }, // Dakar
  { lat: 4.0435, lng: 9.6934, x: 47.5, y: 56.5 }, // Douala
  { lat: -1.2673, lng: 36.8113, x: 57.0, y: 56.5 }, // Nairobi
  { lat: 0.3163, lng: 32.5811, x: 53.6, y: 54.5 }, // Kampala
  { lat: -1.9540, lng: 30.0890, x: 52.0, y: 57.0 }, // Kigali
  { lat: -6.8163, lng: 39.2804, x: 57.2, y: 62.0 }, // Dar es Salaam
  { lat: -26.1076, lng: 28.0567, x: 51.8, y: 77.2 }, // Johannesburg
  { lat: -33.9249, lng: 18.4241, x: 48.5, y: 81.0 }, // Cape Town
  { lat: 30.0561, lng: 31.3301, x: 54.0, y: 38.0 }, // Cairo
  { lat: 33.5928, lng: -7.6192, x: 39.0, y: 36.0 }, // Casablanca
  { lat: 51.5138, lng: -0.0884, x: 41.0, y: 25.0 }, // London
  { lat: 33.8463, lng: -84.3621, x: 20.0, y: 36.0 }, // Atlanta
  { lat: 43.6487, lng: -79.3817, x: 18.0, y: 31.0 }, // Toronto
  { lat: 25.0925, lng: 55.1561, x: 62.0, y: 42.0 }, // Dubai
  { lat: 19.0657, lng: 72.8687, x: 68.0, y: 45.0 }, // Mumbai
];

// Project any real world latitude/longitude to the stylized map (0..100 coordinate space)
export function projectLatLngToSvgPercent(userLat: number, userLng: number): { x: number; y: number } {
  // Use inverse-distance weighting with the 4 closest anchors
  const distances = MAP_ANCHORS.map(anchor => ({
    anchor,
    dist: calculateDistanceKm(userLat, userLng, anchor.lat, anchor.lng),
  })).sort((a, b) => a.dist - b.dist);

  if (distances[0].dist < 5) {
    return { x: distances[0].anchor.x, y: distances[0].anchor.y };
  }

  const k = Math.min(4, distances.length);
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (let i = 0; i < k; i++) {
    const d = Math.max(1, distances[i].dist);
    const weight = 1 / Math.pow(d, 1.5);
    weightedX += distances[i].anchor.x * weight;
    weightedY += distances[i].anchor.y * weight;
    totalWeight += weight;
  }

  const x = Math.max(5, Math.min(95, weightedX / totalWeight));
  const y = Math.max(5, Math.min(95, weightedY / totalWeight));
  return { x, y };
}

/**
 * Finds the closest canonical partner city from user coordinates using Haversine distance
 */
export function findNearestCity(userLat: number, userLng: number): {
  city: string;
  country: string;
  countryFlag: string;
  lat: number;
  lng: number;
  distanceKm: number;
} {
  let nearestCity = 'Lagos';
  let nearestCountry = 'Nigeria';
  let nearestFlag = '🇳🇬';
  let nearestLat = 6.5244;
  let nearestLng = 3.3792;
  let minDistance = Infinity;

  for (const [, coord] of Object.entries(CITY_GEO_COORDINATES)) {
    const dist = calculateDistanceKm(userLat, userLng, coord.lat, coord.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = coord.city;
      nearestCountry = coord.country;
      nearestFlag = coord.countryFlag;
      nearestLat = coord.lat;
      nearestLng = coord.lng;
    }
  }

  return {
    city: nearestCity,
    country: nearestCountry,
    countryFlag: nearestFlag,
    lat: nearestLat,
    lng: nearestLng,
    distanceKm: minDistance,
  };
}

