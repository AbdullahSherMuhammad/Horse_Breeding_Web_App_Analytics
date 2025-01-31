import { supabase } from '@/lib/supabaseClient';

// Fetch data from the view (no filters)
export const fetchFromView = async (url: string, limit: number, offset: number) => {
  try {
    const { data, error, count } = await supabase
      .from(url)
      .select('*', { count: 'exact' })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { data, totalRecords: count || 0 };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error fetching data from the view');
    } else {
      throw new Error('Error fetching data from the view');
    }
  }
};

// Fetch data with filters using the RPC function
export const fetchWithFilters = async (filtrs: { [key: string]: string | number | null }) => {
  try {
    const { data, error } = await supabase.rpc('get_total_results_dynamic', {
      _gender_id: filtrs.gender_id ?? null,
      _year: filtrs.year ?? null,
      _show_id: filtrs.show_id ?? null,
      _farm_id: filtrs.farm_id ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error fetching data with filters');
    } else {
      throw new Error('Error fetching data with filters');
    }
  }
};

// Main FetchApiData function to decide between the two based on filters
export const FetchApiData = async <T>({
  url,
  limit = 10,
  offset = 0,
  filters = {},
}: {
  url: string;
  limit?: number;
  offset?: number;
  filters?: { [key: string]: string | number | null };
}): Promise<{ data: T[]; totalRecords: number }> => {
  try {
    if (Object.keys(filters).length > 0) {
      const data = await fetchWithFilters(filters);
      return { data, totalRecords: data.length };
    } else {
      const { data, totalRecords } = await fetchFromView(url, limit, offset);
      return { data, totalRecords };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.error('Error fetching data:', error);
    }
    throw error;
  }
};
