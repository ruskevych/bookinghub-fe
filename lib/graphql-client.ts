import { createClient, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
// import { useAppStore } from '@/components/providers'; // Uncomment when using Zustand for token

// Placeholder for getting JWT token (replace with Zustand or session logic)
function getAuthToken() {
  // return useAppStore.getState().jwtToken;
  return typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
}

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      addAuthToOperation: ({ authState, operation }) => {
        if (!authState || !authState.token) return operation;
        return {
          ...operation,
          context: {
            ...operation.context,
            fetchOptions: {
              ...operation.context.fetchOptions,
              headers: {
                ...operation.context.fetchOptions?.headers,
                Authorization: `Bearer ${authState.token}`,
              },
            },
          },
        };
      },
      getAuth: async ({ authState }) => {
        if (!authState) {
          const token = getAuthToken();
          if (token) {
            return { token };
          }
          return null;
        }
        // Optionally refresh token logic here
        return authState;
      },
      didAuthError: ({ error }) => {
        return error.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED');
      },
      willAuthError: ({ authState }) => {
        if (!authState || !authState.token) return true;
        return false;
      },
    }),
    fetchExchange,
  ],
});

// React context/provider for urql
import { Provider as UrqlProvider } from 'urql';
export { UrqlProvider }; 