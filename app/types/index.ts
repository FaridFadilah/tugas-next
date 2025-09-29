// Type definitions for the application
export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  joinDate?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood: string;
  energyLevel?: number;
  tags?: string[];
  weather?: string;
  location?: string;
  activities?: string[];
  goals?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  journalEntries: number;
  reminders: number;
  summaries: number;
}

export interface WeeklyStats {
  journalEntries: number;
  reminders: number;
}

export interface MoodDistribution {
  mood: string;
  count: number;
  icon?: string;
  percentage?: number;
}

export interface DailyActivity {
  date: string;
  journalEntries: number;
  reminders: number;
}

export interface DashboardData {
  totalStats: DashboardStats;
  weeklyStats: WeeklyStats;
  recentJournalEntries: JournalEntry[];
  moodDistribution: MoodDistribution[];
  dailyActivity: DailyActivity[];
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string;
  date: string;
  repeat: string;
  isActive: boolean;
  priority: string;
  userId: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  id: string;
  content: string;
  userId: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface UpdateData {
  [key: string]: string | boolean | number | null | undefined;
}

// UI types
export interface StatCard {
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    bg: string;
    text: string;
    light: string;
    glow?: string;
    border?: string;
  };
  trend: string;
  description: string;
}

export interface QuickAction {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: {
    bg: string;
    text: string;
    light: string;
    glow?: string;
  };
  bgPattern: string;
}

export interface RecentEntry {
  title: string;
  date: string;
  type: string;
  color: {
    bg?: string;
    text?: string;
    light: string;
    glow?: string;
  };
  icon: string;
}

// Form data types
export interface JournalFormData {
  title?: string;
  content: string;
  mood: string;
  energyLevel?: number;
  tags?: string[];
  weather?: string;
  location?: string;
  activities?: string[];
  goals?: string;
}

export interface UserFormData {
  email?: string;
  fullName?: string;
  name?: string;
  password?: string;
}

export interface ReminderFormData {
  title: string;
  description?: string;
  time: string;
  date: string;
  repeat: string;
  priority: string;
}

export interface SummaryFormData {
  content: string;
  period: string;
}

// API Create/Update types
export interface CreateJournalEntry extends JournalFormData {
  userId: string;
}

export interface CreateUser extends UserFormData {
  email: string;
  fullName: string;
  password: string;
}

export interface CreateReminder extends ReminderFormData {
  userId: string;
}

export interface CreateSummary extends SummaryFormData {
  userId: string;
}
