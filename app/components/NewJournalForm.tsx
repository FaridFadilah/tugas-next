"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, Smile } from "lucide-react";
import { journalAPI } from "../utils/api";

export default function NewJournalPageWithAPI() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // userId is derived from the authenticated JWT on the server; no need to pass it from the client

  const moods = [
    { value: "excited", label: "Excited", emoji: "🤩", color: "bg-yellow-100 text-yellow-800" },
    { value: "productive", label: "Productive", emoji: "💪", color: "bg-green-100 text-green-800" },
    { value: "focused", label: "Focused", emoji: "🎯", color: "bg-blue-100 text-blue-800" },
    { value: "motivated", label: "Motivated", emoji: "🚀", color: "bg-purple-100 text-purple-800" },
    { value: "creative", label: "Creative", emoji: "🎨", color: "bg-pink-100 text-pink-800" },
    { value: "relaxed", label: "Relaxed", emoji: "😌", color: "bg-indigo-100 text-indigo-800" },
    { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-100 text-gray-800" },
    { value: "tired", label: "Tired", emoji: "😴", color: "bg-orange-100 text-orange-800" }
  ];

  const currentDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Extract form data
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const mood = formData.get('mood') as string;
      const energyLevel = parseInt(formData.get('energyLevel') as string) || 5;
      const tagsInput = formData.get('tags') as string;
      const weather = formData.get('weather') as string;
      const location = formData.get('location') as string;
      
      // Parse tags
      const tags = tagsInput 
        ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Extract activities
      const activities = [
        formData.get('activity1'),
        formData.get('activity2'),
        formData.get('activity3')
      ].filter(activity => activity && activity.toString().trim()) as string[];

      const goals = formData.get('goals') as string;

  // Create journal entry via API (userId comes from JWT on server)
  const journalEntry = await journalAPI.createEntry({
        content,
        mood,
        energyLevel,
        tags,
        title,
        weather,
        location,
        activities,
        goals
      });

      console.log('Journal entry created:', journalEntry);
      
      // Redirect to journal list or show success message
      router.push('/journal');
      
    } catch (err: any) {
      setError(err.message || 'Failed to create journal entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/journal"
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Journal Entry</h1>
          <p className="text-gray-600">Document your daily activities and thoughts</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="What did you do today?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  name="date"
                  defaultValue={currentDate}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Content</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Journal Entry *
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                placeholder="Write about your day, what you accomplished, challenges you faced, things you learned, or anything else that's on your mind..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Activities (Optional)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  name="activity1"
                  placeholder="Activity 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="activity2"
                  placeholder="Activity 2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="activity3"
                  placeholder="Activity 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goals for Tomorrow (Optional)
              </label>
              <textarea
                name="goals"
                rows={3}
                placeholder="What do you want to accomplish tomorrow?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Smile className="w-6 h-6" />
            How are you feeling today? *
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {moods.map((mood) => (
              <label key={mood.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="mood"
                  value={mood.value}
                  className="sr-only peer"
                  required
                />
                <div className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50">
                  <span className="text-2xl mb-2">{mood.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{mood.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Energy Level</h2>
          <div>
            <label htmlFor="energyLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Rate your energy level (1-10)
            </label>
            <input
              type="range"
              id="energyLevel"
              name="energyLevel"
              min="1"
              max="10"
              defaultValue="5"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low (1)</span>
              <span>High (10)</span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-2">
                Weather (Optional)
              </label>
              <select
                id="weather"
                name="weather"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select weather</option>
                <option value="sunny">☀️ Sunny</option>
                <option value="cloudy">☁️ Cloudy</option>
                <option value="rainy">🌧️ Rainy</option>
                <option value="snowy">❄️ Snowy</option>
                <option value="windy">💨 Windy</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Where were you today?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="Add tags separated by commas (e.g., work, meeting, coding)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Link
            href="/journal"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
