import { useMutation } from 'urql';
import type { CreateBookingRequest } from '@/lib/api';

const CREATE_BOOKING_MUTATION = `
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
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

export function useCreateBooking() {
  const [result, executeMutation] = useMutation(CREATE_BOOKING_MUTATION);

  const createBooking = async (input: CreateBookingRequest) => {
    try {
      return await executeMutation({ input });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  };

  return {
    createBooking,
    data: result.data,
    loading: result.fetching,
    error: result.error,
  };
} 