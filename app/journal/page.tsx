"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Calendar, Edit3, Trash2 } from "lucide-react";
import { journalAPI } from "../utils/api";
import { DEMO_USER_ID } from "../utils/constants";

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setIsLoading(true);
      const entries = await journalAPI.getEntries();
      setJournalEntries(entries);
    } catch (err: any) {
      setError(err.message || 'Failed to load journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await journalAPI.deleteEntry(id);
      setJournalEntries(entries => entries.filter(entry => entry.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete journal entry');
    }
  };

  // Filter entries based on search term, mood, and date
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    const matchesDate = !selectedDate || entry.createdAt.split('T')[0] === selectedDate;
    
    return matchesSearch && matchesMood && matchesDate;
  });
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'productive': return 'bg-green-100 text-green-800';
      case 'motivated': return 'bg-blue-100 text-blue-800';
      case 'focused': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadJournalEntries}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal</h1>
          <p className="text-gray-600">Track your daily activities and thoughts</p>
        </div>
        <Link
          href="/journal/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Moods</option>
              <option value="productive">Productive</option>
              <option value="motivated">Motivated</option>
              <option value="focused">Focused</option>
              <option value="creative">Creative</option>
              <option value="relaxed">Relaxed</option>
              <option value="excited">Excited</option>
              <option value="neutral">Neutral</option>
              <option value="tired">Tired</option>
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {entry.title || 'Journal Entry'}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                    {entry.mood}
                  </span>
                  {entry.energyLevel && (
                    <span className="text-xs text-gray-500">
                      Energy: {entry.energyLevel}/10
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/journal/${entry.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {entry.content.length > 200 
                ? `${entry.content.substring(0, 200)}...` 
                : entry.content
              }
            </p>
            {entry.tags && entry.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link 
                href={`/journal/${entry.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {journalEntries.length === 0 ? 'No journal entries yet' : 'No entries match your search'}
          </h3>
          <p className="text-gray-600 mb-6">
            {journalEntries.length === 0 
              ? 'Start documenting your daily activities and thoughts'
              : 'Try adjusting your search criteria'
            }
          </p>
          {journalEntries.length === 0 && (
            <Link
              href="/journal/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create your first entry
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
