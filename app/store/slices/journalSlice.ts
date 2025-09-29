import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JournalEntry } from '../../types';

interface JournalState {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    mood?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
}

const initialState: JournalState = {
  entries: [],
  currentEntry: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Async thunk for fetching entries
export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/journal', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
          return rejectWithValue('Unauthorized');
        }
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch entries');
      }

      const data = await response.json();
      
      // Ensure data is serializable array
      const entries = Array.isArray(data) ? data : (data.entries || []);
      
      // Clean data to ensure serializability
      const cleanEntries = entries.map((entry: JournalEntry) => ({
        id: entry.id,
        title: entry.title || null,
        content: entry.content || '',
        mood: entry.mood || 'neutral',
        energyLevel: entry.energyLevel || 5,
        tags: Array.isArray(entry.tags) ? entry.tags : [],
        weather: entry.weather || null,
        location: entry.location || null,
        activities: Array.isArray(entry.activities) ? entry.activities : [],
        goals: entry.goals || null,
        createdAt: entry.createdAt || new Date().toISOString(),
        updatedAt: entry.updatedAt || new Date().toISOString(),
        userId: entry.userId
      }));
      
      return cleanEntries;
  } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for fetching single entry
export const fetchJournalEntry = createAsyncThunk(
  'journal/fetchEntry',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch entry');
      }

      const data = await response.json();
      
      // Clean single entry data for serializability
      const cleanEntry = {
        id: data.id,
        title: data.title || null,
        content: data.content || '',
        mood: data.mood || 'neutral',
        energyLevel: data.energyLevel || 5,
        tags: Array.isArray(data.tags) ? data.tags : [],
        weather: data.weather || null,
        location: data.location || null,
        activities: Array.isArray(data.activities) ? data.activities : [],
        goals: data.goals || null,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        userId: data.userId
      };
      
      return cleanEntry;
  } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for creating entry
export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(entryData), // userId tidak lagi dikirim, akan diambil dari token
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to create entry');
      }

      const data = await response.json();
      
      // Clean created entry data for serializability
      const cleanEntry = {
        id: data.id,
        title: data.title || null,
        content: data.content || '',
        mood: data.mood || 'neutral',
        energyLevel: data.energyLevel || 5,
        tags: Array.isArray(data.tags) ? data.tags : [],
        weather: data.weather || null,
        location: data.location || null,
        activities: Array.isArray(data.activities) ? data.activities : [],
        goals: data.goals || null,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        userId: data.userId
      };
      
      return cleanEntry;
  } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for updating entry
export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ id, entryData }: { id: string; entryData: Partial<JournalEntry> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to update entry');
      }

      const data = await response.json();
      
      // Clean updated entry data for serializability
      const cleanEntry = {
        id: data.id,
        title: data.title || null,
        content: data.content || '',
        mood: data.mood || 'neutral',
        energyLevel: data.energyLevel || 5,
        tags: Array.isArray(data.tags) ? data.tags : [],
        weather: data.weather || null,
        location: data.location || null,
        activities: Array.isArray(data.activities) ? data.activities : [],
        goals: data.goals || null,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        userId: data.userId
      };
      
      return cleanEntry;
  } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Async thunk for deleting entry
export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to delete entry');
      }

      return id;
  } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEntry: (state, action: PayloadAction<JournalEntry | null>) => {
      state.currentEntry = action.payload;
    },
    setFilters: (state, action: PayloadAction<JournalState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearEntries: (state) => {
      state.entries = [];
      state.currentEntry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries cases
      .addCase(fetchJournalEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
        state.error = null;
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch entry cases
      .addCase(fetchJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEntry = action.payload;
        state.error = null;
      })
      .addCase(fetchJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create entry cases
      .addCase(createJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries.unshift(action.payload);
        state.error = null;
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update entry cases
      .addCase(updateJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.entries.findIndex(entry => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        if (state.currentEntry && state.currentEntry.id === action.payload.id) {
          state.currentEntry = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete entry cases
      .addCase(deleteJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = state.entries.filter(entry => entry.id !== action.payload);
        if (state.currentEntry && state.currentEntry.id === action.payload) {
          state.currentEntry = null;
        }
        state.error = null;
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setCurrentEntry, 
  setFilters, 
  clearFilters, 
  clearEntries 
} = journalSlice.actions;

export default journalSlice.reducer;
