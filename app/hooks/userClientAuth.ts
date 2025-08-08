

// // For backward compatibility, export a client-side hook that uses the server actions
"use client";
import { useState, useEffect } from 'react';
import { setAuthCookies, clearAuthCookies, getAuthFromCookies } from '../utils/cookies';
import { User } from './useServerAuth';

export function useClientAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      console.log("[CLIENT AUTH] Checking authentication status...");
      try {
        // First check cookies
        const authData = getAuthFromCookies();
        if (authData) {
          console.log("[CLIENT AUTH] Authentication data found in cookies:", authData);
          setUser(authData.user);
          setToken(authData.token);
        } else {
          console.log("[CLIENT AUTH] No authentication data in cookies. Checking localStorage...");
          // Fallback to localStorage for backward compatibility
          const userData = localStorage.getItem('user');
          const authToken = localStorage.getItem('authToken');
          if (userData && authToken) {
            console.log("[CLIENT AUTH] Authentication data found in localStorage:", { userData, authToken });
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setToken(authToken);
            // Migrate to cookies
            setAuthCookies(authToken, parsedUser);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
          } else {
            console.log("[CLIENT AUTH] No authentication data found in localStorage.");
          }
        }
      } catch (error) {
        console.error("[CLIENT AUTH] Error checking auth:", error);
      } finally {
        setIsLoading(false);
        console.log("[CLIENT AUTH] Authentication check completed.");
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log("[CLIENT AUTH] Logging in user:", userData);
    // Store in cookies
    setAuthCookies(authToken, userData);
    setUser(userData);
    setToken(authToken);
    console.log("[CLIENT AUTH] User logged in successfully.");
  };

  const logout = () => {
    console.log("[CLIENT AUTH] Logging out user...");
    // Clear cookies
    clearAuthCookies();
    // Clear localStorage for backward compatibility
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    console.log("[CLIENT AUTH] User logged out successfully.");
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