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

  // Handle automatic 401 unauthorized
  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
    });
  }, [logout]);

  // Restore session on mount via GET /api/auth/me
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.get();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.auth.me();
        if (profile.role !== 'RIDER') {
          logout();
          setError('Access denied: Only delivery partners (RIDER role) can access this application.');
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

      if (response.user.role !== 'RIDER') {
        throw new Error('Access denied: Account role is ' + response.user.role + '. Only RIDER role can access this app.');
      }

      tokenStorage.set(response.accessToken);
      tokenStorage.setUser(response.user);
      setToken(response.accessToken);
      setUser(response.user);
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please verify credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isRider = !!token && !!user && user.role === 'RIDER';

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: isRider,
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
