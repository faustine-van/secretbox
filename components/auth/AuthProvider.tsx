'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/client/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthResponse {
  data?: any;
  error: { message: string } | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, masterPassword?: string) => Promise<AuthResponse>;
  register: (email: string, password: string, fullName: string, masterPassword: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async (email: string, password: string, masterPassword?: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          masterPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Login failed' } };
      }

      return { data, error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error during login'
        }
      };
    }
  };

  const register = async (email: string, password: string, name: string, masterPassword: string): Promise<AuthResponse> => {
    try {
      // Call our API endpoint, not Supabase directly
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          masterPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Registration failed' } };
      }

      return { data, error: null };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Network error during registration'
        }
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      await supabase.auth.signOut();
      // router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};