import { useEffect, useState } from 'react';
import { FetchApiData } from '@/lib/fetchApiData';

export function useFetch<T>(url: string, limit: number = 10, offset: number = 0) {
  const [data, setData] = useState<T[] | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await FetchApiData<T>(url, limit, offset);
        setData(result.data);
        setTotalRecords(result.totalRecords);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, limit, offset]);

  return { data, totalRecords, loading, error };
}
