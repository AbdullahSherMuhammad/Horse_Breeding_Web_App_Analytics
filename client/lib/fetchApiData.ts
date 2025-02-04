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
export const fetchWithFilters = async (
  filterUrl: string,
  limit: number,
  offset: number,
  filters: { [key: string]: string | number | null }
) => {
  try {
    const { data, error, count } = await supabase
      .rpc(filterUrl, {
        _gender_id: filters.gender_id ?? null,
        _year: filters.year ?? null,
        _show_id: filters.show_id ?? null,
        _farm_id: filters.farm_id ?? null,
      }, { count: 'exact' }) // This option tells Supabase to return the exact count.
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { data: data || [], totalRecords: count || 0 };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error fetching data with filters');
    } else {
      throw new Error('Error fetching data with filters');
    }
  }
};

// Main FetchApiData function to decide which endpoint to use
export const FetchApiData = async <T>({
  url,
  filterUrl,
  limit = 10,
  offset = 0,
  filters = {},
}: {
  url: string;
  filterUrl?: string;
  limit?: number;
  offset?: number;
  filters?: { [key: string]: string | number | null };
}): Promise<{ data: T[]; totalRecords: number }> => {
  try {
    if (filterUrl && Object.keys(filters).length > 0) {
      const { data, totalRecords } = await fetchWithFilters(filterUrl, limit, offset, filters);
      return { data, totalRecords };
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
