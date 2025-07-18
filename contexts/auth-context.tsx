'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, setTokens, clearTokens, getStoredToken, getStoredRefreshToken } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // DEVELOPMENT-ONLY: Inject admin user if in dev mode and no real user is loaded
  if (process.env.NODE_ENV === 'development' && !user) {
    setUser({
      id: 'dev-admin',
      name: 'Dev Admin',
      email: 'admin@dev.local',
      business_id: 'dev-business',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User);
  }

  const isAuthenticated = !!user;

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      const refreshToken = getStoredRefreshToken();
      
      if (token && refreshToken) {
        try {
          // Try to refresh the token to get user data
          const response = await authService.refresh();
          const { access_token, refresh_token, user: userData } = response.data;
          
          setTokens(access_token, refresh_token);
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          clearTokens();
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      const { access_token, refresh_token, user: userData } = response.data;
      
      setTokens(access_token, refresh_token);
      setUser(userData);
      
      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      const { access_token, refresh_token, user: newUser } = response.data;
      
      setTokens(access_token, refresh_token);
      setUser(newUser);
      
      toast.success('Registration successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    try {
      const response = await authService.refresh();
      const { access_token, refresh_token, user: userData } = response.data;
      
      setTokens(access_token, refresh_token);
      setUser(userData);
    } catch (error) {
      console.error('User refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 