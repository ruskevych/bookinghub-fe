import { useMutation } from 'urql';
import type { Booking } from '@/lib/api';

const UPDATE_BOOKING_MUTATION = `
  mutation UpdateBooking($id: ID!, $input: UpdateBookingInput!) {
    updateBooking(id: $id, input: $input) {
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
  }
`;

export function useUpdateBooking() {
  const [result, executeMutation] = useMutation(UPDATE_BOOKING_MUTATION);

  const updateBooking = async (id: string, input: Partial<Booking>) => {
    try {
      return await executeMutation({ id, input });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  };

  return {
    updateBooking,
    data: result.data,
    loading: result.fetching,
    error: result.error,
  };
} 