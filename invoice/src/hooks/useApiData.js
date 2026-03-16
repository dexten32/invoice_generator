import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:4000/api';

/**
 * Generic data-fetching hook for the backend API.
 * Automatically attaches the JWT token from localStorage.
 *
 * @param {string} path - e.g. '/customers' or '/services'
 * @returns {{ data: any, isLoading: boolean, error: string|null, refetch: () => void }}
 */
export function useApiData(path) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('auth_token');

    fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  return { data, isLoading, error, refetch };
}
