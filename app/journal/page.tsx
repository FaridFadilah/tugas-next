import Link from "next/link";
import { Plus, Search, Calendar, Edit3, Trash2 } from "lucide-react";

export default function JournalPage() {
  const journalEntries = [
    {
      id: 1,
      title: "Daily Standup Meeting",
      date: "2025-01-30",
      content: "Today we discussed the progress on the new feature development...",
      mood: "productive"
    },
    {
      id: 2,
      title: "Project Planning Session",
      date: "2025-01-29",
      content: "We planned the roadmap for the next quarter and identified key milestones...",
      mood: "motivated"
    },
    {
      id: 3,
      title: "Code Review Day",
      date: "2025-01-28",
      content: "Spent the day reviewing pull requests and providing feedback...",
      mood: "focused"
    }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'productive': return 'bg-green-100 text-green-800';
      case 'motivated': return 'bg-blue-100 text-blue-800';
      case 'focused': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Moods</option>
              <option>Productive</option>
              <option>Motivated</option>
              <option>Focused</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {journalEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{entry.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {entry.date}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getMoodColor(entry.mood)}`}>
                    {entry.mood}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{entry.content}</p>
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

      {/* Empty State (if no entries) */}
      {journalEntries.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
          <p className="text-gray-600 mb-6">Start documenting your daily activities and thoughts</p>
          <Link
            href="/journal/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create your first entry
          </Link>
        </div>
      )}
    </div>
  );
}
