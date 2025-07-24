import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useClient } from 'urql';

// Types for auth
interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  business_id?: string;
  created_at: string;
  updated_at: string;
}

// GraphQL operations (should be codegen'd, but inlined for now)
const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      refresh_token
      user {
        id
        name
        email
        business_id
        created_at
        updated_at
      }
    }
  }
`;

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      access_token
      refresh_token
      user {
        id
        name
        email
        business_id
        created_at
        updated_at
      }
    }
  }
`;

const REFRESH_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      access_token
      refresh_token
      user {
        id
        name
        email
        business_id
        created_at
        updated_at
      }
    }
  }
`;

const ME_QUERY = `
  query GetCurrentUser {
    me {
      id
      name
      email
      business_id
      created_at
      updated_at
    }
  }
`;

export function useAuth() {
  const client = useClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mutations
  const [, loginMutation] = useMutation(LOGIN_MUTATION);
  const [, registerMutation] = useMutation(REGISTER_MUTATION);
  const [, refreshMutation] = useMutation(REFRESH_MUTATION);

  // Query for current user
  const [{ data: meData, fetching: meFetching, error: meError }, refetchMe] = useQuery({
    query: ME_QUERY,
    pause: typeof window === 'undefined' || !localStorage.getItem('jwtToken'),
  });

  // On mount or after login/register/logout, try to load user from token
  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [meData]);

  // Login
  const login = useCallback(async (credentials: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginMutation({ input: credentials });
      if (result.error) throw result.error;
      const { access_token, refresh_token, user } = result.data.login;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
      }
      setUser(user);
      setIsAuthenticated(true);
      refetchMe({ requestPolicy: 'network-only' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        throw err;
      } else {
        setError(new Error(String(err)));
        setUser(null);
        setIsAuthenticated(false);
        throw new Error(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, [loginMutation, refetchMe]);

  // Register
  const register = useCallback(async (userData: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerMutation({ input: userData });
      if (result.error) throw result.error;
      const { access_token, refresh_token, user } = result.data.register;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
      }
      setUser(user);
      setIsAuthenticated(true);
      refetchMe({ requestPolicy: 'network-only' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        throw err;
      } else {
        setError(new Error(String(err)));
        setUser(null);
        setIsAuthenticated(false);
        throw new Error(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, [registerMutation, refetchMe]);

  // Logout
  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
    }
    setUser(null);
    setIsAuthenticated(false);
    refetchMe({ requestPolicy: 'network-only' });
  }, [refetchMe]);

  // Refresh user/token
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) throw new Error('No refresh token');
      const result = await refreshMutation({ refreshToken });
      if (result.error) throw result.error;
      const { access_token, refresh_token, user } = result.data.refreshToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
      }
      setUser(user);
      setIsAuthenticated(true);
      refetchMe({ requestPolicy: 'network-only' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        throw err;
      } else {
        setError(new Error(String(err)));
        setUser(null);
        setIsAuthenticated(false);
        throw new Error(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshMutation, refetchMe]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || meFetching,
    error: error || meError,
    login,
    register,
    logout,
    refreshUser,
  };
} 