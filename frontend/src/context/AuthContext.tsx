import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, RoleEnum } from '../types/user.types';
import { AuthEmailLoginDto } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { userApi } from '../api/user.api';
import { setUnauthorizedHandler } from '../api/client';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: AuthEmailLoginDto) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES);
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Register unauthorized/401 redirect logout handler
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  // Hydrate user info on boot if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const tokenExpires = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Check if token and refresh are completely expired
      if (tokenExpires && Date.now() > Number(tokenExpires)) {
        // Token has expired, client.ts will attempt to auto refresh on first request
        // We will try to load user profile which triggers refresh if needed
      }

      try {
        const profile = await userApi.getMe();
        setUser(profile);
      } catch (err) {
        console.error('Failed to restore session:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (data: AuthEmailLoginDto) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES, String(response.tokenExpires));
      
      setToken(response.token);
      setUser(response.user);
    } catch (err) {
      logout();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === RoleEnum.superAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
