import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error?.error || 'Login failed');
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error('Login error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const API = import.meta.env.VITE_API_URL;
    const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};