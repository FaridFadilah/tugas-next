// Color Palette untuk Activity Tracker App
export const colorPalette = {
  // Primary Colors - untuk main actions dan highlights
  primary: {
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100', ring: 'ring-emerald-500' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100', ring: 'ring-blue-500' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100', ring: 'ring-purple-500' },
    pink: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-100', ring: 'ring-pink-500' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100', ring: 'ring-orange-500' },
  },

  // Mood Colors - untuk mood distribution dan emotional states
  moods: {
    productive: { 
      bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600', 
      solid: 'bg-emerald-500',
      text: 'text-emerald-600', 
      light: 'bg-emerald-50',
      border: 'border-emerald-200',
      glow: 'shadow-emerald-500/25'
    },
    focused: { 
      bg: 'bg-gradient-to-br from-blue-400 to-blue-600', 
      solid: 'bg-blue-500',
      text: 'text-blue-600', 
      light: 'bg-blue-50',
      border: 'border-blue-200',
      glow: 'shadow-blue-500/25'
    },
    motivated: { 
      bg: 'bg-gradient-to-br from-purple-400 to-purple-600', 
      solid: 'bg-purple-500',
      text: 'text-purple-600', 
      light: 'bg-purple-50',
      border: 'border-purple-200',
      glow: 'shadow-purple-500/25'
    },
    creative: { 
      bg: 'bg-gradient-to-br from-pink-400 to-pink-600', 
      solid: 'bg-pink-500',
      text: 'text-pink-600', 
      light: 'bg-pink-50',
      border: 'border-pink-200',
      glow: 'shadow-pink-500/25'
    },
    relaxed: { 
      bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600', 
      solid: 'bg-indigo-500',
      text: 'text-indigo-600', 
      light: 'bg-indigo-50',
      border: 'border-indigo-200',
      glow: 'shadow-indigo-500/25'
    },
    reflective: { 
      bg: 'bg-gradient-to-br from-violet-400 to-violet-600', 
      solid: 'bg-violet-500',
      text: 'text-violet-600', 
      light: 'bg-violet-50',
      border: 'border-violet-200',
      glow: 'shadow-violet-500/25'
    }
  },

  // Activity Categories
  activities: {
    journal: { 
      bg: 'bg-gradient-to-br from-emerald-400 to-teal-500', 
      solid: 'bg-emerald-500',
      text: 'text-emerald-600', 
      light: 'bg-emerald-50',
      icon: 'text-emerald-600',
      glow: 'shadow-emerald-500/25',
      border: 'border-emerald-200'
    },
    reminder: { 
      bg: 'bg-gradient-to-br from-orange-400 to-amber-500', 
      solid: 'bg-orange-500',
      text: 'text-orange-600', 
      light: 'bg-orange-50',
      icon: 'text-orange-600',
      glow: 'shadow-orange-500/25',
      border: 'border-orange-200'
    },
    summary: { 
      bg: 'bg-gradient-to-br from-purple-400 to-violet-500', 
      solid: 'bg-purple-500',
      text: 'text-purple-600', 
      light: 'bg-purple-50',
      icon: 'text-purple-600',
      glow: 'shadow-purple-500/25',
      border: 'border-purple-200'
    },
    tracking: { 
      bg: 'bg-gradient-to-br from-blue-400 to-cyan-500', 
      solid: 'bg-blue-500',
      text: 'text-blue-600', 
      light: 'bg-blue-50',
      icon: 'text-blue-600',
      glow: 'shadow-blue-500/25',
      border: 'border-blue-200'
    }
  },

  // Success/Warning/Error states
  status: {
    success: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
    warning: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50' },
    error: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' },
    info: { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-50' }
  }
};

// Helper functions untuk mendapatkan colors
export const getMoodColor = (mood: string) => {
  const moodKey = mood.toLowerCase() as keyof typeof colorPalette.moods;
  return colorPalette.moods[moodKey] || colorPalette.moods.productive;
};

export const getActivityColor = (activity: string) => {
  const activityKey = activity.toLowerCase() as keyof typeof colorPalette.activities;
  return colorPalette.activities[activityKey] || colorPalette.activities.journal;
};
