import { User, Bell, Shield, Palette, Globe, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Account",
      icon: User,
      description: "Manage your account information and preferences",
      items: [
        { name: "Profile Information", description: "Update your name, email, and avatar" },
        { name: "Password & Security", description: "Change password and security settings" },
        { name: "Privacy Settings", description: "Control who can see your information" }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Configure how you receive notifications",
      items: [
        { name: "Push Notifications", description: "Browser and device notifications" },
        { name: "Email Notifications", description: "Email preferences and frequency" },
        { name: "Reminder Settings", description: "Default reminder preferences" }
      ]
    },
    {
      title: "Appearance",
      icon: Palette,
      description: "Customize the look and feel of your app",
      items: [
        { name: "Theme", description: "Choose between light and dark mode" },
        { name: "Language", description: "Select your preferred language" },
        { name: "Date & Time Format", description: "Customize date and time display" }
      ]
    },
    {
      title: "Data & Privacy",
      icon: Shield,
      description: "Control your data and privacy settings",
      items: [
        { name: "Data Export", description: "Download your data" },
        { name: "Data Deletion", description: "Delete your account and data" },
        { name: "Privacy Policy", description: "View our privacy policy" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-8">
        {settingsCategories.map((category) => (
          <div key={category.title} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <category.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
              </div>
              <p className="text-gray-600">{category.description}</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Help & Support */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <HelpCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <h3 className="font-medium text-gray-900 mb-2">Help Center</h3>
                <p className="text-sm text-gray-600">Find answers to common questions</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600">Get help from our support team</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
                <h3 className="font-medium text-gray-900 mb-2">Feature Requests</h3>
                <p className="text-sm text-gray-600">Suggest new features or improvements</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
