export interface GeoDetectionResult {
  country: string;
  source: 'gps' | 'timezone' | 'default';
  cityName?: string;
}

export function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Lagos')) return 'Nigeria';
    if (tz.includes('Nairobi')) return 'Kenya';
    if (tz.includes('Accra')) return 'Ghana';
    if (tz.includes('Johannesburg')) return 'South Africa';
    if (tz.includes('Kigali')) return 'Rwanda';
    if (tz.includes('London')) return 'UK / International';
    if (tz.includes('Cairo') || tz.includes('Casablanca')) return 'UK / International';
  } catch (e) {
    console.error(e);
  }
  return 'Nigeria';
}

/**
 * Maps GPS Latitude and Longitude to nearest Pan-African country
 */
export function mapCoordinatesToCountry(latitude: number, longitude: number): string {
  // Nigeria approximate bounding box
  if (latitude >= 4.0 && latitude <= 14.0 && longitude >= 2.5 && longitude <= 15.0) {
    return 'Nigeria';
  }
  // Ghana approximate bounding box
  if (latitude >= 4.5 && latitude <= 11.5 && longitude >= -3.5 && longitude <= 1.5) {
    return 'Ghana';
  }
  // Kenya approximate bounding box
  if (latitude >= -4.8 && latitude <= 5.5 && longitude >= 33.8 && longitude <= 42.0) {
    return 'Kenya';
  }
  // Rwanda approximate bounding box
  if (latitude >= -2.9 && latitude <= -1.0 && longitude >= 28.8 && longitude <= 31.0) {
    return 'Rwanda';
  }
  // South Africa approximate bounding box
  if (latitude >= -35.0 && latitude <= -22.0 && longitude >= 16.0 && longitude <= 33.0) {
    return 'South Africa';
  }
  // United Kingdom approximate bounding box
  if (latitude >= 49.8 && latitude <= 60.9 && longitude >= -8.5 && longitude <= 2.0) {
    return 'UK / International';
  }

  // Fallback to timezone if outside mapped regions
  return detectCountryFromTimezone();
}

/**
 * Asynchronously detects user's location via browser Geolocation API
 * with automatic fallback to Timezone heuristic
 */
export async function autoDetectUserCountry(): Promise<GeoDetectionResult> {
  // If user previously manually selected a country in this browser session, keep it
  try {
    const saved = localStorage.getItem('msmebooks_selected_country');
    if (saved) {
      return { country: saved, source: 'default' };
    }
  } catch {
    // ignore
  }

  // Try HTML5 Geolocation API with a 3-second timeout
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 3000,
          maximumAge: 1000 * 60 * 60, // Cache for 1 hour
          enableHighAccuracy: false,
        });
      });

      const detected = mapCoordinatesToCountry(
        position.coords.latitude,
        position.coords.longitude
      );
      return { country: detected, source: 'gps' };
    } catch {
      // Geolocation denied, prompt timed out, or unavailable
    }
  }

  // Timezone fallback
  const tzCountry = detectCountryFromTimezone();
  return { country: tzCountry, source: 'timezone' };
}
