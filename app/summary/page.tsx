"use client";

import { useState, useEffect } from "react";
import { Calendar, TrendingUp, BarChart3, Download, Filter, Sparkles } from "lucide-react";
import { colorPalette, getMoodColor } from "../utils/colors";
import { dashboardAPI } from "../utils/api";
import { DEMO_USER_ID } from "../utils/constants";

export default function SummaryPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");

  useEffect(() => {
    loadSummaryData();
  }, [selectedTimeRange]);

  const loadSummaryData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      // If API fails, use mock data as fallback
      console.warn('Summary API failed, using mock data:', err.message);
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
        moodDistribution: [
          { mood: "Productive", count: 8 },
          { mood: "Focused", count: 6 },
          { mood: "Motivated", count: 4 },
          { mood: "Creative", count: 3 },
          { mood: "Relaxed", count: 2 }
        ],
        dailyActivity: [
          { date: "2025-01-24", journalEntries: 2, reminders: 1 },
          { date: "2025-01-25", journalEntries: 1, reminders: 2 },
          { date: "2025-01-26", journalEntries: 3, reminders: 1 },
          { date: "2025-01-27", journalEntries: 2, reminders: 3 },
          { date: "2025-01-28", journalEntries: 1, reminders: 1 },
          { date: "2025-01-29", journalEntries: 2, reminders: 0 },
          { date: "2025-01-30", journalEntries: 1, reminders: 0 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };
  const timeRanges = [
    { label: "Last 7 Days", value: "week", active: selectedTimeRange === "week" },
    { label: "Last 30 Days", value: "month", active: selectedTimeRange === "month" },
    { label: "Last 3 Months", value: "quarter", active: selectedTimeRange === "quarter" },
    { label: "Last Year", value: "year", active: selectedTimeRange === "year" }
  ];

  // Get dynamic stats from API data
  const getWeeklyStats = () => {
    if (!dashboardData) {
      return {
        totalEntries: 0,
        totalReminders: 0,
        completedTasks: 0,
        averageMood: "N/A"
      };
    }

    const topMood = dashboardData.moodDistribution.length > 0 
      ? dashboardData.moodDistribution[0].mood 
      : "N/A";

    return {
      totalEntries: dashboardData.weeklyStats.journalEntries,
      totalReminders: dashboardData.weeklyStats.reminders,
      completedTasks: dashboardData.weeklyStats.journalEntries + dashboardData.weeklyStats.reminders,
      averageMood: topMood
    };
  };

  const getDailyActivity = () => {
    if (!dashboardData || !dashboardData.dailyActivity) {
      return [
        { day: "Mon", entries: 0, reminders: 0, mood: "neutral" },
        { day: "Tue", entries: 0, reminders: 0, mood: "neutral" },
        { day: "Wed", entries: 0, reminders: 0, mood: "neutral" },
        { day: "Thu", entries: 0, reminders: 0, mood: "neutral" },
        { day: "Fri", entries: 0, reminders: 0, mood: "neutral" },
        { day: "Sat", entries: 0, reminders: 0, mood: "neutral" },
        { day: "Sun", entries: 0, reminders: 0, mood: "neutral" }
      ];
    }

    // Convert API data to the format expected by the component
    return dashboardData.dailyActivity.map((day: any, index: number) => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayOfWeek = new Date(day.date).getDay();
      
      return {
        day: days[dayOfWeek],
        entries: day.journalEntries,
        reminders: day.reminders,
        mood: "productive" // Default mood, could be enhanced
      };
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const weeklyStats = getWeeklyStats();
  const dailyActivity = getDailyActivity();
  
  // Add icons to mood distribution data
  const getMoodIcon = (mood: string) => {
    const moodIcons: Record<string, string> = {
      'Productive': '💪',
      'productive': '💪',
      'Focused': '🎯',
      'focused': '🎯',
      'Motivated': '⚡',
      'motivated': '⚡',
      'Creative': '🎨',
      'creative': '🎨',
      'Relaxed': '😌',
      'relaxed': '😌',
      'Excited': '🤩',
      'excited': '🤩',
      'Neutral': '😐',
      'neutral': '😐',
      'Tired': '😴',
      'tired': '😴'
    };
    return moodIcons[mood] || '😊';
  };

  const moodDistribution = (dashboardData?.moodDistribution || []).map((mood: any) => ({
    ...mood,
    icon: getMoodIcon(mood.mood),
    percentage: Math.round((mood.count / (dashboardData?.totalStats?.journalEntries || 1)) * 100)
  }));
  
  // Mock top activities for now - this could be enhanced with API data
  const topActivities = [
    { activity: "Journal Writing", count: weeklyStats.totalEntries, percentage: 40 },
    { activity: "Task Reminders", count: weeklyStats.totalReminders, percentage: 30 },
    { activity: "Weekly Planning", count: 2, percentage: 15 },
    { activity: "Progress Review", count: 1, percentage: 10 },
    { activity: "Goal Setting", count: 1, percentage: 5 }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Summary</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze your activity patterns and progress</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Enhanced Time Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                range.active
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.totalEntries}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-xl shadow-lg shadow-blue-500/25">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reminders Set</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.totalReminders}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 p-3 rounded-xl shadow-lg shadow-emerald-500/25">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.completedTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 p-3 rounded-xl shadow-lg shadow-purple-500/25">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Mood</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.averageMood}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 p-3 rounded-xl shadow-lg shadow-amber-500/25">
              <Filter className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
          <div className="space-y-4">
            {dailyActivity.map((day: any) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1 flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-xs text-gray-600">{day.entries} entries</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs text-gray-600">{day.reminders} reminders</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                  {day.mood}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Activities</h3>
          <div className="space-y-4">
            {topActivities.map((activity, index) => (
              <div key={activity.activity} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${activity.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{activity.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Mood Distribution</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {moodDistribution.map((mood: any) => {
            const moodColor = getMoodColor(mood.mood);
            return (
              <div key={mood.mood} className="group relative">
                {/* Card Container */}
                <div className={`${moodColor.light} dark:${moodColor.light}/10 rounded-xl p-4 border-2 ${moodColor.border} dark:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg ${moodColor.glow}`}>
                  
                  {/* Icon & Count */}
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{mood.icon}</div>
                    <div className={`${moodColor.bg} text-white text-xl font-bold py-2 px-4 rounded-lg shadow-md`}>
                      {mood.count}
                    </div>
                  </div>
                  
                  {/* Mood Label */}
                  <h4 className={`font-semibold text-center ${moodColor.text} dark:text-gray-200 mb-2`}>
                    {mood.mood}
                  </h4>
                  
                  {/* Percentage Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${moodColor.bg} h-2 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${mood.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${moodColor.text} dark:text-gray-300 font-medium mt-1 block text-center`}>
                      {mood.percentage}%
                    </span>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 dark:from-gray-800/0 dark:to-gray-800/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {moodDistribution.reduce((sum: number, mood: any) => sum + mood.count, 0)}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-600">
                {moodDistribution[0].mood}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Mood</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(moodDistribution.reduce((sum: number, mood: any) => sum + mood.count, 0) / 7)}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily Average</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-purple-600">
                {moodDistribution.length}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mood Types</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
