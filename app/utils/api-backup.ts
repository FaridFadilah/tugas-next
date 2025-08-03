// API utility functions for the journal app
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
    });= '/api';

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
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
    userId: string;
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    return handleResponse(response);
  },

  // Update a journal entry
  updateEntry: async (id: string, entryData: {
    content?: string;
    mood?: string;
    energyLevel?: number;
    tags?: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    return handleResponse(response);
  },

  // Delete a journal entry
  deleteEntry: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// User API functions
export const userAPI = {
  // Create a new user (register)
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Get user profile
  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse(response);
  },

  // Update user profile
  updateUser: async (id: string, userData: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user account
  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Reminder API functions
export const reminderAPI = {
  // Get all reminders for a user
  getReminders: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/reminders?userId=${userId}`);
    return handleResponse(response);
  },

  // Create a new reminder
  createReminder: async (reminderData: {
    userId: string;
    reminderType: string;
    sentAt: string;
    via: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    });
    return handleResponse(response);
  },
};

// Summary API functions
export const summaryAPI = {
  // Get all AI summaries for a user
  getSummaries: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/summaries?userId=${userId}`);
    return handleResponse(response);
  },

  // Create a new AI summary
  createSummary: async (summaryData: {
    userId: string;
    weekStart: string;
    weekEnd: string;
    summary: string;
    aiModel: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/summaries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(summaryData),
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
