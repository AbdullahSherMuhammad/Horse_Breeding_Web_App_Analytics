'use client'

import { useEffect, useState } from 'react';
import { FetchApiData } from '@/app/api/Api';

export function useFetch<T>(url: string, limit: number = 10, offset: number = 0) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await FetchApiData<T>(url, limit, offset);
        setData(result);
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, limit, offset]); 

  return { data, loading, error };
}