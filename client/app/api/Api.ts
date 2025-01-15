import { supabase } from '@/lib/supabaseClient';

export const FetchApiData = async <T>(url: string): Promise<T[]> => {
  const { data, error } = await supabase.from(url).select('*');

  if (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }

  return data || [];
};
