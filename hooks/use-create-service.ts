import { useMutation } from 'urql';

// GraphQL input type for creating a service
type CreateServiceInput = {
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
};

const CREATE_SERVICE_MUTATION = `
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      business_id
      name
      description
      duration
      price
      created_at
      updated_at
    }
  }
`;

export function useCreateService() {
  const [result, executeMutation] = useMutation(CREATE_SERVICE_MUTATION);

  const createService = async (input: CreateServiceInput) => {
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
    createService,
    data: result.data,
    loading: result.fetching,
    error: result.error,
  };
} 