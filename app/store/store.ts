import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import journalSlice from './slices/journalSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    journal: journalSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'auth/checkAuthStatus/fulfilled',
          'auth/loginUser/fulfilled',
          'auth/registerUser/fulfilled'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'auth.user.createdAt',
          'auth.user.updatedAt',
          'journal.entries',
          'journal.currentEntry'
        ],
        // Ignore these field names
        ignoredActionsPaths: [
          'payload.timestamp',
          'payload.createdAt',
          'payload.updatedAt'
        ]
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
