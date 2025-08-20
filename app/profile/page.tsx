"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, Camera, Save, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    joinDate: ""
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      let jsonStr = userData as string;
      try {
        jsonStr = decodeURIComponent(jsonStr);
      } catch {}
      const parsedUser = JSON.parse(jsonStr);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        bio: parsedUser.bio || "Welcome to my activity tracker profile!",
        joinDate: parsedUser.joinDate || new Date().toISOString().split('T')[0]
      });
    }
  }, []);

  const handleSave = () => {
    // Update user data in localStorage
    const updatedUser = {
      ...user,
      ...formData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "Welcome to my activity tracker profile!",
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-100 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-700" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-blue-100 dark:text-blue-200 mt-2">{formData.email}</p>
              <div className="flex items-center gap-2 mt-4">
                <Calendar className="w-4 h-4" />
                <span className="text-blue-100 dark:text-blue-200">
                  Member since {new Date(formData.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {formData.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <p className="text-blue-800">Journal Entries</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                <p className="text-green-800">Active Reminders</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
                <p className="text-purple-800">Days Streak</p>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </h3>
            
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Change Password</div>
                <div className="text-sm text-gray-600">Update your account password</div>
              </button>
              
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Privacy Settings</div>
                <div className="text-sm text-gray-600">Manage your privacy preferences</div>
              </button>
              
              <button className="w-full text-left p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-700">
                <div className="font-medium">Delete Account</div>
                <div className="text-sm text-red-600">Permanently delete your account and all data</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
