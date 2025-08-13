"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect, ReactNode } from 'react';
import { useAppDispatch } from './hooks';
import { checkAuthStatus } from './slices/authSlice';

interface StoreProviderProps {
  children: ReactNode;
}

// Component to initialize auth state
function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check for existing authentication on app start
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <>{children}</>;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}
