import { supabase } from '@/lib/supabaseClient';

export const FetchApiData = async <T>(
  url: string,
  limit: number = 10,
  offset: number = 0,
): Promise<T[]> => {
  const query = supabase.from(url).select('*').limit(limit).range(offset, offset + limit - 1);


  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }

  return data || [];
};