import { useState, useEffect, useCallback } from 'react';
import {
  ExchangeRateData,
  getCurrentExchangeData,
  subscribeToExchangeRates,
  fetchLiveExchangeRates,
} from '../services/exchangeRateService';

export function useExchangeRates() {
  const [exchangeData, setExchangeData] = useState<ExchangeRateData>(getCurrentExchangeData);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to rate updates
    const unsubscribe = subscribeToExchangeRates((data) => {
      setExchangeData(data);
    });

    // Initial fetch on mount
    let isMounted = true;
    setIsFetching(true);
    fetchLiveExchangeRates(false)
      .then((data) => {
        if (isMounted) {
          setExchangeData(data);
          setIsFetching(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFetchError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const refreshRates = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const fresh = await fetchLiveExchangeRates(true);
      setExchangeData(fresh);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to refresh rates');
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    exchangeData,
    isFetching,
    fetchError,
    refreshRates,
  };
}
