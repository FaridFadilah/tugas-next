import Link from "next/link";
import { ArrowLeft, Calendar, Edit3, Trash2, Share2 } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default function JournalDetailPage({ params }: Props) {
  // Mock data - in real app this would be fetched based on params.id
  const journalEntry = {
    id: params.id,
    title: "Daily Standup Meeting",
    date: "2025-01-30",
    time: "09:15",
    content: `Today's standup was particularly productive. We discussed the progress on the new feature development and identified some key blockers that need attention.

**Key Points Discussed:**
- User authentication flow is 80% complete
- Database optimization needs review
- API endpoint testing scheduled for tomorrow
- UI/UX feedback session planned for Friday

**Challenges Faced:**
I struggled a bit with the complex database queries today. The performance wasn't as good as expected, and I need to revisit the indexing strategy. Also, the integration tests are taking longer than anticipated.

**Accomplishments:**
- Fixed 3 critical bugs in the authentication system
- Completed code review for 2 pull requests
- Updated project documentation
- Mentored junior developer on React best practices

**Lessons Learned:**
The importance of early performance testing became clear today. Also learned a new debugging technique that will be useful for future projects.

**Tomorrow's Goals:**
- Optimize database queries
- Complete API endpoint testing
- Review UI/UX feedback
- Plan sprint retrospective`,
    mood: "productive",
    weather: "sunny",
    location: "Office",
    tags: ["work", "meeting", "development", "team"],
    activities: [
      "Daily standup meeting",
      "Code review session", 
      "Bug fixing",
      "Documentation update"
    ]
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'productive': return 'bg-green-100 text-green-800';
      case 'motivated': return 'bg-blue-100 text-blue-800';
      case 'focused': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'windy': return '💨';
      default: return '🌤️';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/journal"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{journalEntry.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {journalEntry.date} at {journalEntry.time}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getMoodColor(journalEntry.mood)}`}>
                {journalEntry.mood}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/journal/${journalEntry.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </Link>
          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Journal Entry</h2>
            <div className="prose max-w-none">
              {journalEntry.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return <br key={index} />;
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="text-gray-700 ml-4">
                      {paragraph.substring(2)}
                    </li>
                  );
                }
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              {journalEntry.weather && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-16">Weather:</span>
                  <span className="text-sm text-gray-700">
                    {getWeatherIcon(journalEntry.weather)} {journalEntry.weather}
                  </span>
                </div>
              )}
              
              {journalEntry.location && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-16">Location:</span>
                  <span className="text-sm text-gray-700">{journalEntry.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-16">Mood:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getMoodColor(journalEntry.mood)}`}>
                  {journalEntry.mood}
                </span>
              </div>
            </div>
          </div>

          {/* Activities */}
          {journalEntry.activities && journalEntry.activities.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Activities</h3>
              <ul className="space-y-2">
                {journalEntry.activities.map((activity, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {journalEntry.tags && journalEntry.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {journalEntry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <div className="space-y-2">
              <Link
                href="/journal/2"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                ← Previous Entry
              </Link>
              <Link
                href="/journal/4"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Next Entry →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
