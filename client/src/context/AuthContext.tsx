import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { http, API_BASE_URL } from '../services/http';
import type { User } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  handleCallback: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth-token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await http.get<User>('/auth/me');
      setUser(userData);
    } catch {
      localStorage.removeItem('auth-token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setUser(null);
  }, []);

  const handleCallback = useCallback(async (newToken: string) => {
    localStorage.setItem('auth-token', newToken);
    setToken(newToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        handleCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
