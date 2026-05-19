import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken } from '../api/axios';
import { AuthResponse, UserDto } from '../types/api';

interface AuthContextValue {
  user: UserDto | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(() => {
    const stored = localStorage.getItem('smart-leads-user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('smart-leads-token'));

  useEffect(() => {
    setToken(token);
    if (token) {
      localStorage.setItem('smart-leads-token', token);
    } else {
      localStorage.removeItem('smart-leads-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart-leads-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart-leads-user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    setUser(response.data.user);
    setTokenState(response.data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setUser(response.data.user);
    setTokenState(response.data.token);
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
