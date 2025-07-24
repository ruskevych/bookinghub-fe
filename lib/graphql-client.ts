import { createClient, cacheExchange, fetchExchange, Operation } from 'urql';
import { authExchange } from '@urql/exchange-auth';
// import { useAppStore } from '@/components/providers'; // Uncomment when using Zustand for token

// Placeholder for getting JWT token (replace with Zustand or session logic)
function getAuthToken(): string | null {
  // return useAppStore.getState().jwtToken;
  return typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
}

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  exchanges: [
    cacheExchange,
    authExchange(async (utils) => ({
      addAuthToOperation(operation: Operation) {
        const token = getAuthToken();
        if (!token) return operation;
        return utils.appendHeaders(operation, {
          Authorization: `Bearer ${token}`,
        });
      },
      async getAuth(authState: { token?: string } | null) {
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
      didAuthError(error, _operation) {
        return error.graphQLErrors?.some((e: { extensions?: { code?: string } }) => e.extensions?.code === 'UNAUTHENTICATED');
      },
      willAuthError(operation: Operation) {
        // Try to extract the token from the operation's headers
        let token: string | undefined;
        const fetchOptions = operation.context.fetchOptions;
        if (typeof fetchOptions === 'object' && fetchOptions && 'headers' in fetchOptions) {
          const headers = fetchOptions.headers as Record<string, string>;
          token = headers['Authorization'] || headers['authorization'];
        }
        return !token;
      },
      async refreshAuth() {
        // No-op for now; implement token refresh logic if needed
        return;
      },
    })),
    fetchExchange,
  ],
});

// React context/provider for urql
import { Provider as UrqlProvider } from 'urql';
export { UrqlProvider }; 