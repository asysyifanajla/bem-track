'use client';

import { useState, useCallback } from 'react';
import { User, LoginCredentials } from '@/types/auth';
import { DEMO_USERS } from '@/lib/mockData';

const TOKEN_KEY = 'bem_track_token';
const USER_KEY = 'bem_track_user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (savedUser && token) {
        return JSON.parse(savedUser);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network latency for demo
      await new Promise((r) => setTimeout(r, 400));
      const found = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!found) {
        throw new Error('Email atau kata sandi tidak sesuai dengan akun pengurus BEM');
      }

      const token = 'demo_token_' + found.role;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(found));
      setUser(found);
      return found;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login gagal';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchRole = useCallback((role: string) => {
    const target = DEMO_USERS.find((u) => u.role === role);
    if (target) {
      const token = 'demo_token_' + target.role;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(target));
      setUser(target);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    switchRole,
    logout,
  };
}
