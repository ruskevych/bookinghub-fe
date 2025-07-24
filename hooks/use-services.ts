import { useQuery } from 'urql';

const GET_SERVICES_QUERY = `
  query GetServices($limit: Int, $page: Int, $businessId: ID, $category: String) {
    services(limit: $limit, page: $page, businessId: $businessId, category: $category) {
      items {
        id
        business_id
        name
        description
        duration
        price
        created_at
        updated_at
      }
      pagination {
        total
        page
        per_page
        total_pages
        has_next_page
        has_prev_page
      }
    }
  }
`;

export function useServices({ businessId, category, page = 1, limit = 10 }: { businessId?: string, category?: string, page?: number, limit?: number } = {}) {
  const [{ data, fetching, error }, refetch] = useQuery({
    query: GET_SERVICES_QUERY,
    variables: { businessId, category, page, limit },
  });

  return {
    services: data?.services?.items ?? [],
    pagination: data?.services?.pagination ?? null,
    loading: fetching,
    error,
    refetch,
  };
} 