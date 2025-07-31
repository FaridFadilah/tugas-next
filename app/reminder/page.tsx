import Link from "next/link";
import { Plus, Clock, Bell, Calendar, Edit3, Trash2, Check } from "lucide-react";

export default function ReminderPage() {
  const reminders = [
    {
      id: 1,
      title: "Daily Standup Meeting",
      description: "Join the daily standup with the development team",
      time: "09:00",
      date: "2025-01-31",
      repeat: "Daily",
      isActive: true,
      priority: "high"
    },
    {
      id: 2,
      title: "Weekly Review",
      description: "Review and plan activities for the upcoming week",
      time: "15:00",
      date: "2025-02-02",
      repeat: "Weekly",
      isActive: true,
      priority: "medium"
    },
    {
      id: 3,
      title: "Doctor Appointment",
      description: "Annual health checkup appointment",
      time: "10:30",
      date: "2025-02-05",
      repeat: "None",
      isActive: true,
      priority: "high"
    },
    {
      id: 4,
      title: "Project Deadline",
      description: "Submit final project deliverables",
      time: "17:00",
      date: "2025-02-07",
      repeat: "None",
      isActive: false,
      priority: "high"
    },
    {
      id: 5,
      title: "Team Building Event",
      description: "Monthly team building activity",
      time: "14:00",
      date: "2025-02-10",
      repeat: "Monthly",
      isActive: true,
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRepeatColor = (repeat: string) => {
    switch (repeat) {
      case 'Daily': return 'bg-blue-100 text-blue-800';
      case 'Weekly': return 'bg-purple-100 text-purple-800';
      case 'Monthly': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingReminders = reminders.filter(r => r.isActive).slice(0, 3);
  const allReminders = reminders;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
          <p className="text-gray-600">Manage your scheduled reminders and notifications</p>
        </div>
        <Link
          href="/reminder/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Reminder
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => r.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Reminders</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Reminders */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
          <div className="space-y-4">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{reminder.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{reminder.time} • {reminder.date}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Reminders */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">All Reminders</h2>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {allReminders.map((reminder) => (
              <div key={reminder.id} className={`bg-white rounded-lg shadow p-6 ${!reminder.isActive ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
                      {!reminder.isActive && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{reminder.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        {reminder.time} • {reminder.date}
                      </div>
                      
                      {reminder.repeat !== 'None' && (
                        <span className={`px-2 py-1 text-xs rounded-full ${getRepeatColor(reminder.repeat)}`}>
                          {reminder.repeat}
                        </span>
                      )}
                      
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority} priority
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className={`p-2 rounded-lg transition-colors ${
                        reminder.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={reminder.isActive ? 'Mark as completed' : 'Activate reminder'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State (if no reminders) */}
      {reminders.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders set</h3>
          <p className="text-gray-600 mb-6">Create your first reminder to stay organized</p>
          <Link
            href="/reminder/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create your first reminder
          </Link>
        </div>
      )}
    </div>
  );
}
