// API utility functions for the journal app
import { getCookie, clearAuthCookies } from './cookies';
import { JournalEntry, User, CreateJournalEntry, CreateUser, Reminder, Summary, CreateReminder, CreateSummary } from '../types';

const API_BASE_URL = '/api';

// Helper function to get auth headers
function getAuthHeaders() {
  // Try to get token from cookie first
  let token = getCookie('authToken');
  
  // Fallback to localStorage for backward compatibility
  if (!token) {
    token = localStorage.getItem('authToken');
  }
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, clear auth and redirect to login
      clearAuthCookies();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      return;
    }
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
}

// Journal API functions
export const journalAPI = {
  // Get all journal entries for authenticated user
  getEntries: async () => {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get a specific journal entry
  getEntry: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create a new journal entry
  createEntry: async (entryData: {
    content: string;
    mood: string;
    energyLevel?: number;
    tags?: string[];
    title?: string;
    weather?: string;
    location?: string;
    activities?: string[];
    goals?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entryData)
    });
    return handleResponse(response);
  },

  // Update a journal entry
  updateEntry: async (id: string, entryData: Partial<JournalEntry>) => {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entryData)
    });
    return handleResponse(response);
  },

  // Delete a journal entry
  deleteEntry: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
};

// User API functions
export const userAPI = {
  // Create a new user
  createUser: async (userData: CreateUser) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
};

// Reminder API functions
export const reminderAPI = {
  // Get reminders for authenticated user
  getReminders: async () => {
    const response = await fetch(`${API_BASE_URL}/reminders`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create a reminder
  createReminder: async (reminderData: CreateReminder) => {
    const response = await fetch(`${API_BASE_URL}/reminders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reminderData)
    });
    return handleResponse(response);
  },
};

// Summary API functions
export const summaryAPI = {
  // Get summaries for authenticated user
  getSummaries: async () => {
    const response = await fetch(`${API_BASE_URL}/summaries`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Create a summary
  createSummary: async (summaryData: CreateSummary) => {
    const response = await fetch(`${API_BASE_URL}/summaries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(summaryData)
    });
    return handleResponse(response);
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard data for authenticated user
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
};
