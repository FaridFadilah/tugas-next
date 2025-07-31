"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, BookOpen, Clock, BarChart3, Home, LogOut, Settings, User } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  
  const menuItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "Summary", href: "/summary", icon: BarChart3 },
    { name: "Reminder", href: "/reminder", icon: Clock },
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = "/auth/login";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 z-10 flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Activity Tracker
        </h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{getUserInitials()}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </Link>
        
        <ul className="space-y-1">
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 rounded-lg"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 rounded-lg"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
