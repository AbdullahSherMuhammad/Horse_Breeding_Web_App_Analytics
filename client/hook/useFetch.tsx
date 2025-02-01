import { useState, useEffect } from 'react';
import { FetchApiData } from '@/lib/fetchApiData';

interface UseFetchParams {
  url: string;
  filterUrl?: string; 
  limit?: number;
  offset?: number;
  filters?: { [key: string]: any };
}

export function useFetch<T>({
  url,
  filterUrl,
  limit = 10,
  offset = 0,
  filters = {},
}: UseFetchParams) {
  const [data, setData] = useState<T[] | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await FetchApiData<T>({
          url,
          filterUrl,
          limit,
          offset,
          filters,
        });
        setData(result.data);
        setTotalRecords(result.totalRecords);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, limit, offset, JSON.stringify(filters)]);

  return { data, totalRecords, loading, error };
}
