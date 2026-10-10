import React, { createContext, useContext, useEffect, useState } from 'react';
import type { LoginInput, RegisterInput, User } from '../types';
import { api, setOnUnauthorized, tokenStorage } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = tokenStorage.get();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await api.auth.getProfile();
      setUser(profile);
      tokenStorage.setUser(profile);
    } catch {
      // Token invalid or expired
      tokenStorage.remove();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
    });

    refreshUser();
  }, []);

  const login = async (credentials: LoginInput) => {
    const response = await api.auth.login(credentials);
    tokenStorage.set(response.accessToken);
    tokenStorage.setUser(response.user);
    setUser(response.user);
  };

  const register = async (userData: RegisterInput) => {
    const response = await api.auth.register(userData);
    tokenStorage.set(response.accessToken);
    tokenStorage.setUser(response.user);
    setUser(response.user);
  };

  const logout = () => {
    tokenStorage.remove();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
