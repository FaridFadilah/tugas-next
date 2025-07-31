import Link from "next/link";
import { BookOpen, BarChart3, Clock, Plus, Calendar, TrendingUp, Sparkles, Activity } from "lucide-react";
import { colorPalette, getActivityColor } from "./utils/colors";

export default function Dashboard() {
  const stats = [
    { 
      name: "Journal Entries", 
      value: "12", 
      icon: BookOpen, 
      color: colorPalette.activities.journal,
      trend: "+2 this week",
      description: "Personal reflections"
    },
    { 
      name: "Active Reminders", 
      value: "5", 
      icon: Clock, 
      color: colorPalette.activities.reminder,
      trend: "+1 today",
      description: "Pending tasks"
    },
    { 
      name: "Weekly Summary", 
      value: "1", 
      icon: BarChart3, 
      color: colorPalette.activities.summary,
      trend: "Updated",
      description: "Progress report"
    },
    { 
      name: "Days Tracked", 
      value: "30", 
      icon: Calendar, 
      color: colorPalette.activities.tracking,
      trend: "Consistent",
      description: "Activity monitoring"
    },
  ];

  const quickActions = [
    { 
      name: "New Journal Entry", 
      href: "/journal/new", 
      icon: Plus, 
      description: "Write today's journal",
      color: colorPalette.activities.journal,
      bgPattern: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
    },
    { 
      name: "View Summary", 
      href: "/summary", 
      icon: TrendingUp, 
      description: "Check your progress",
      color: colorPalette.activities.summary,
      bgPattern: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"
    },
    { 
      name: "Set Reminder", 
      href: "/reminder/new", 
      icon: Clock, 
      description: "Create new reminder",
      color: colorPalette.activities.reminder,
      bgPattern: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
    },
  ];

  const recentEntries = [
    { 
      title: "Daily Standup Meeting", 
      date: "2025-01-30", 
      type: "journal",
      color: colorPalette.activities.journal,
      icon: "📝"
    },
    { 
      title: "Weekly Review", 
      date: "2025-01-29", 
      type: "summary",
      color: colorPalette.activities.summary,
      icon: "📊"
    },
    { 
      title: "Doctor Appointment", 
      date: "2025-01-28", 
      type: "reminder",
      color: colorPalette.activities.reminder,
      icon: "⏰"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your activity overview.</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className={`w-full h-full ${stat.color.bg}`}></div>
            </div>
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color.light} dark:${stat.color.light}/20 p-3 rounded-lg ${stat.color.glow} shadow-md`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.text}`} />
                </div>
                <span className={`text-xs px-2 py-1 ${stat.color.light} ${stat.color.text} rounded-full font-medium`}>
                  {stat.trend}
                </span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <div className={`w-full h-full ${stat.color.bg} rounded-full transform translate-x-6 -translate-y-6`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${action.bgPattern}`}></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${action.color.light} dark:${action.color.light}/20 p-3 rounded-lg ${action.color.glow} shadow-md group-hover:shadow-lg transition-shadow`}>
                      <action.icon className={`w-8 h-8 ${action.color.text} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Activity className={`w-5 h-5 ${action.color.text}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-50">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                  
                  {/* Action indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 ${action.color.light} ${action.color.text} rounded-full font-medium`}>
                      Ready
                    </span>
                    <div className={`w-6 h-6 ${action.color.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Activity</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <ul className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <li key={index} className="group">
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {/* Icon */}
                      <div className={`w-10 h-10 ${entry.color.light} dark:${entry.color.light}/20 rounded-lg flex items-center justify-center ${entry.color.glow}`}>
                        <span className="text-lg">{entry.icon}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-50">
                          {entry.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.date}
                        </p>
                      </div>
                      
                      {/* Type Badge */}
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${entry.color.light} ${entry.color.text} ${entry.color.border} border`}>
                        {entry.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/activity" 
                className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <span>View all activity</span>
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
