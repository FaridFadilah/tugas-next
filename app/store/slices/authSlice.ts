import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store in both localStorage and cookies for compatibility
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Also store in cookies for server-side compatibility
      document.cookie = `authToken=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      document.cookie = `userData=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { email: string; password: string; fullName: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Store in localStorage for persistence
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Clear cookies
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  return null;
});

// Async thunk for checking existing auth
export const checkAuthStatus = createAsyncThunk('auth/checkAuthStatus', async () => {
  console.log('[CHECK AUTH STATUS] Starting...');
  
  // First try localStorage
  let token = localStorage.getItem('authToken');
  let userData = localStorage.getItem('user');
  
  console.log('[CHECK AUTH STATUS] localStorage - token:', !!token, 'userData:', !!userData);
  
  // If not in localStorage, try cookies
  if (!token || !userData) {
    console.log('[CHECK AUTH STATUS] Not found in localStorage, checking cookies...');
    
    // Get cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        acc[name] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    console.log('[CHECK AUTH STATUS] Available cookies:', Object.keys(cookies));
    
    token = cookies['authToken'];
    userData = cookies['userData'];
    
    console.log('[CHECK AUTH STATUS] cookies - token:', !!token, 'userData:', !!userData);
    
    // If found in cookies, sync to localStorage for consistency
    if (token && userData) {
      console.log('[CHECK AUTH STATUS] Syncing cookies to localStorage...');
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', userData);
    }
  }
  
  if (token && userData) {
    try {
      const parsedUser = JSON.parse(userData);
      console.log('[CHECK AUTH STATUS] Success - returning auth data');
      return {
        token,
        user: parsedUser,
      };
    } catch (error) {
      console.error('[CHECK AUTH STATUS] Failed to parse user data:', error);
      return null;
    }
  }
  
  console.log('[CHECK AUTH STATUS] No auth data found');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
