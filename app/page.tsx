"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, Plus, TrendingUp, Sparkles, Activity } from "lucide-react";
import { colorPalette } from "./utils/colors";
import { dashboardAPI } from "./utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, _setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      // If API fails, use mock data as fallback
      console.warn('Dashboard API failed, using mock data:', err.message);
      setDashboardData({
        totalStats: {
          journalEntries: 12,
          reminders: 8,
          summaries: 3
        },
        weeklyStats: {
          journalEntries: 5,
          reminders: 3
        },
        recentJournalEntries: [],
        moodDistribution: [
          { mood: "productive", count: 8 },
          { mood: "focused", count: 6 },
          { mood: "motivated", count: 4 }
        ],
        dailyActivity: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic stats based on API data
  const getStats = () => {
    if (!dashboardData) return [];
    
    return [
      { 
        name: "Journal Entries", 
        value: dashboardData.totalStats.journalEntries.toString(), 
        icon: BookOpen, 
        color: colorPalette.activities.journal,
        trend: `+${dashboardData.weeklyStats.journalEntries} this week`,
        description: "Personal reflections"
      },
      { 
        name: "Active Reminders", 
        value: dashboardData.totalStats.reminders.toString(), 
        icon: Clock, 
        color: colorPalette.activities.reminder,
        trend: `+${dashboardData.weeklyStats.reminders} this week`,
        description: "Scheduled tasks"
      },
      { 
        name: "AI Summaries", 
        value: dashboardData.totalStats.summaries.toString(), 
        icon: Sparkles, 
        color: colorPalette.activities.summary,
        trend: "Generated weekly",
        description: "AI insights"
      },
      { 
        name: "Weekly Activity", 
        value: (dashboardData.weeklyStats.journalEntries + dashboardData.weeklyStats.reminders).toString(), 
        icon: Activity, 
        color: colorPalette.moods.productive,
        trend: "Total this week",
        description: "Combined actions"
      }
    ];
  };

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

  // Generate recent entries from API data
  const getRecentEntries = () => {
    if (!dashboardData || !dashboardData.recentJournalEntries) {
      return [
        { 
          title: "No recent entries", 
          date: "Start creating journal entries", 
          type: "journal",
          color: colorPalette.activities.journal,
          icon: "📝"
        }
      ];
    }

    return dashboardData.recentJournalEntries.map((entry: any) => ({
      title: entry.content.substring(0, 50) + (entry.content.length > 50 ? '...' : ''),
      date: new Date(entry.createdAt).toLocaleDateString(),
      type: "journal",
      color: colorPalette.activities.journal,
      icon: "📝"
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getStats();
  const recentEntries = getRecentEntries();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your activity overview.</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat: any) => (
          <Card key={stat.name} className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className={`w-full h-full ${stat.color.bg}`}></div>
            </div>
            
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color.light} dark:${stat.color.light}/20 p-3 rounded-lg ${stat.color.glow} shadow-md`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.text}`} />
                </div>
                <Badge variant="secondary" className={`${stat.color.light} ${stat.color.text}`}>
                  {stat.trend}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <div className={`w-full h-full ${stat.color.bg} rounded-full transform translate-x-6 -translate-y-6`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Quick Actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Card key={action.name} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${action.bgPattern}`}></div>
                
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${action.color.light} dark:${action.color.light}/20 p-3 rounded-lg ${action.color.glow} shadow-md group-hover:shadow-lg transition-shadow`}>
                      <action.icon className={`w-8 h-8 ${action.color.text} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Activity className={`w-5 h-5 ${action.color.text}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold group-hover:text-gray-800 dark:group-hover:text-gray-50">
                      {action.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  
                  {/* Action indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary" className={`${action.color.light} ${action.color.text}`}>
                      Ready
                    </Badge>
                    <div className={`w-6 h-6 ${action.color.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </CardContent>
                <Link href={action.href} className="absolute inset-0" />
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Recent Activity</h2>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {recentEntries.map((entry: any, index: number) => (
                  <li key={index} className="group">
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {/* Icon */}
                      <div className={`w-10 h-10 ${entry.color.light} dark:${entry.color.light}/20 rounded-lg flex items-center justify-center ${entry.color.glow}`}>
                        <span className="text-lg">{entry.icon}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold group-hover:text-gray-800 dark:group-hover:text-gray-50">
                          {entry.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {entry.date}
                        </p>
                      </div>
                      
                      {/* Type Badge */}
                      <Badge variant="outline" className={`${entry.color.light} ${entry.color.text}`}>
                        {entry.type}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            
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
          </Card>
        </div>
      </div>
    </div>
  );
}
