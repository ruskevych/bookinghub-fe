import { useQuery } from 'urql';

const GET_BOOKINGS_QUERY = `
  query GetBookings($limit: Int, $page: Int, $status: BookingStatus, $userId: ID) {
    bookings(limit: $limit, page: $page, status: $status, userId: $userId) {
      items {
        id
        user_id
        business_id
        service_id
        time_slot_id
        status
        service_name
        start_time
        end_time
        notes
        created_at
        updated_at
        service {
          id
          name
          price
        }
        time_slot {
          id
          start_time
          end_time
        }
        user {
          id
          name
          email
        }
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

export function useBookings({ userId, page = 1, limit = 10, status }: { userId: string, page?: number, limit?: number, status?: string }) {
  const [{ data, fetching, error }, refetch] = useQuery({
    query: GET_BOOKINGS_QUERY,
    variables: { userId, page, limit, status },
    pause: !userId,
  });

  return {
    bookings: data?.bookings?.items ?? [],
    pagination: data?.bookings?.pagination ?? null,
    loading: fetching,
    error,
    refetch,
  };
} 