"use client";

import { useState, useEffect } from 'react';
import { setAuthCookies, clearAuthCookies, getAuthFromCookies } from '../utils/cookies';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      try {
        // First check cookies
        const authData = getAuthFromCookies();
        if (authData) {
          setUser(authData.user);
          setToken(authData.token);
        } else {
          // Fallback to localStorage for backward compatibility
          const userData = localStorage.getItem('user');
          const authToken = localStorage.getItem('authToken');
          if (userData && authToken) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setToken(authToken);
            // Migrate to cookies
            setAuthCookies(authToken, parsedUser);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, authToken: string) => {
    // Store in cookies
    setAuthCookies(authToken, userData);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    // Clear cookies
    clearAuthCookies();
    // Clear localStorage for backward compatibility
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  };

  return {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };
}
