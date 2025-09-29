"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuthStatus } from "../store/slices/authSlice";

export default function AuthDebugger() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string> | null>(null);
  const [cookieData, setCookieData] = useState<Record<string, string> | null>(null);
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    setLocalStorageData({
      token: token ? token.substring(0, 20) + '...' : 'null',
      user: userData ? JSON.parse(userData) : 'null'
    });

    // Check cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    setCookieData(cookies);

    // Dispatch check auth
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleRefreshAuth = () => {
    dispatch(checkAuthStatus());
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      
      <div className="mb-2">
        <strong>Redux Auth State:</strong>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
          {JSON.stringify({
            isAuthenticated: authState.isAuthenticated,
            isLoading: authState.isLoading,
            hasUser: !!authState.user,
            hasToken: !!authState.token,
            error: authState.error
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-2">
        <strong>localStorage:</strong>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
          {JSON.stringify(localStorageData, null, 2)}
        </pre>
      </div>

      <div className="mb-2">
        <strong>Cookies:</strong>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
          {JSON.stringify(cookieData, null, 2)}
        </pre>
      </div>

      <button 
        onClick={handleRefreshAuth}
        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Refresh Auth
      </button>
    </div>
  );
}
