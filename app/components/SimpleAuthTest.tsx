"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuthStatus } from "../store/slices/authSlice";

export default function SimpleAuthTest() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  useEffect(() => {
    console.log('=== SIMPLE AUTH TEST ===');
    console.log('Current auth state:', authState);
    
    // Check localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    console.log('localStorage - token exists:', !!token);
    console.log('localStorage - user exists:', !!userData);
    
    // Check cookies
    const cookies = document.cookie;
    console.log('All cookies:', cookies);
    
    // Dispatch check
    console.log('Dispatching checkAuthStatus...');
    dispatch(checkAuthStatus());
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded">
      <h2 className="font-bold mb-4">Redux Auth Test</h2>
      <div className="space-y-2">
        <p><strong>isAuthenticated:</strong> {String(authState.isAuthenticated)}</p>
        <p><strong>isLoading:</strong> {String(authState.isLoading)}</p>
        <p><strong>hasUser:</strong> {String(!!authState.user)}</p>
        <p><strong>hasToken:</strong> {String(!!authState.token)}</p>
        <p><strong>error:</strong> {authState.error || 'none'}</p>
        {authState.user && (
          <p><strong>userName:</strong> {authState.user.fullName}</p>
        )}
      </div>
      <button 
        onClick={() => dispatch(checkAuthStatus())}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Refresh Auth
      </button>
    </div>
  );
}
