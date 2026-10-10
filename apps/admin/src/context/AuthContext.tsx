import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setOnUnauthorized, tokenStorage } from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => tokenStorage.getUser());
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const logout = useCallback(() => {
    tokenStorage.remove();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Set up 401 callback
  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
    });
  }, [logout]);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.get();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.auth.me();
        if (profile.role !== 'ADMIN') {
          logout();
          setError('Access restricted. Admin credentials required.');
        } else {
          setUser(profile);
          tokenStorage.setUser(profile);
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.login({ email, password });

      if (response.user.role !== 'ADMIN') {
        throw new Error('Access denied: You do not have administrator permissions.');
      }

      tokenStorage.set(response.accessToken);
      tokenStorage.setUser(response.user);
      setToken(response.accessToken);
      setUser(response.user);
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user && user.role === 'ADMIN',
    isLoading,
    login,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
