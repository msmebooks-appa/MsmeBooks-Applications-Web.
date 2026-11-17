import { useState, useCallback, useMemo } from 'react';
import { findNearestCity, calculateDistanceKm, getPartnerCoordinates } from '../utils/geoCoordinates';
import { PARTNERS_DATA, getCitiesForCountry } from '../data/partnersData';
import { TIMEZONE_TO_LOCATION } from '../utils/userLocation';

export interface GeolocationFilterResult {
  country: string;
  city: string;
  countryFlag: string;
  distanceKm: number;
  coords: {
    lat: number;
    lng: number;
  };
  nearestPartner: {
    id: string;
    name: string;
    city: string;
    country: string;
    distanceKm: number;
  } | null;
}

export function useGeolocationFilter() {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [detectedResult, setDetectedResult] = useState<GeolocationFilterResult | null>(null);

  const timezoneFallback = useMemo(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TIMEZONE_TO_LOCATION[tz]) {
        const entry = TIMEZONE_TO_LOCATION[tz];
        return {
          country: entry.country,
          city: entry.city,
          countryFlag: entry.flag,
        };
      }
    } catch {
      // ignore Intl errors
    }
    return {
      country: 'Nigeria',
      city: 'Lagos',
      countryFlag: '🇳🇬',
    };
  }, []);

  const resolveCoordinates = useCallback((lat: number, lng: number): GeolocationFilterResult => {
    const nearestCity = findNearestCity(lat, lng);
    const validCities = getCitiesForCountry(nearestCity.country);
    const resolvedCity = validCities.includes(nearestCity.city)
      ? nearestCity.city
      : validCities[0] || nearestCity.city;

    let closestPartner: GeolocationFilterResult['nearestPartner'] = null;
    let minPartnerDist = Infinity;

    for (const p of PARTNERS_DATA) {
      const pCoords = getPartnerCoordinates(p);
      const dist = calculateDistanceKm(lat, lng, pCoords.lat, pCoords.lng);
      if (dist < minPartnerDist) {
        minPartnerDist = dist;
        closestPartner = {
          id: p.id,
          name: p.name,
          city: p.city,
          country: p.country,
          distanceKm: dist,
        };
      }
    }

    return {
      country: nearestCity.country,
      city: resolvedCity,
      countryFlag: nearestCity.countryFlag,
      distanceKm: nearestCity.distanceKm,
      coords: { lat, lng },
      nearestPartner: closestPartner,
    };
  }, []);

  const locateNearMe = useCallback(
    (onDetected: (result: GeolocationFilterResult) => void) => {
      setGeoError(null);

      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setGeoError('Browser geolocation is not supported on this device. You can use your timezone region below.');
        return;
      }

      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const result = resolveCoordinates(latitude, longitude);
          setIsLocating(false);
          setDetectedResult(result);
          setGeoError(null);
          onDetected(result);
        },
        (error) => {
          setIsLocating(false);
          if (error.code === 1) {
            setGeoError('Location permission denied. Enable browser location access or apply your timezone region.');
          } else if (error.code === 2) {
            setGeoError('Current coordinates unavailable. Try again or apply your timezone region.');
          } else if (error.code === 3) {
            setGeoError('Location request timed out. Please retry or apply your timezone region.');
          } else {
            setGeoError('Could not detect your current location.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    },
    [resolveCoordinates]
  );

  const detectCoordinatesSilently = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const result = resolveCoordinates(latitude, longitude);
        setDetectedResult(result);
      },
      () => {
        // Silently fall back to timezone coordinates when GPS is unavailable or denied
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 120000,
      }
    );
  }, [resolveCoordinates]);

  const clearGeoStatus = useCallback(() => {
    setGeoError(null);
    setDetectedResult(null);
  }, []);

  return {
    isLocating,
    geoError,
    detectedResult,
    timezoneFallback,
    locateNearMe,
    detectCoordinatesSilently,
    clearGeoStatus,
    setGeoError,
  };
}
