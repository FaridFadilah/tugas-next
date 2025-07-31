import Link from "next/link";
import { Check, Calendar, BookOpen, Clock, BarChart3, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Daily Journal",
      description: "Document your daily activities, thoughts, and experiences",
      color: "bg-blue-500"
    },
    {
      icon: BarChart3,
      title: "Progress Summary",
      description: "Track your progress with detailed analytics and insights",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Smart Reminders",
      description: "Never miss important tasks with customizable reminders",
      color: "bg-green-500"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Create Your First Journal Entry",
      description: "Start documenting your daily activities and thoughts"
    },
    {
      number: 2,
      title: "Set Up Reminders",
      description: "Add reminders for important tasks and appointments"
    },
    {
      number: 3,
      title: "Track Your Progress",
      description: "View your analytics and see how you're improving"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 dark:bg-blue-500 p-4 rounded-full">
            <Calendar className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome to Activity Tracker! 🎉
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          You're all set to start organizing your life and tracking your progress
        </p>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 inline-flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-300 font-medium">Account created successfully!</span>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">
          What you can do with Activity Tracker
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className={`${feature.color} p-3 rounded-lg inline-flex mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Let's get you started
        </h2>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index === 0 && (
                  <Link
                    href="/journal/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Start Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Ready to begin your journey?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/journal/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Write First Journal
          </Link>
          
          <Link
            href="/reminder/new"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Set First Reminder
          </Link>
          
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 mb-4">
          Need help getting started?
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/help" className="text-blue-600 hover:text-blue-800 transition-colors">
            Help Center
          </Link>
          <Link href="/support" className="text-blue-600 hover:text-blue-800 transition-colors">
            Contact Support
          </Link>
          <Link href="/tutorials" className="text-blue-600 hover:text-blue-800 transition-colors">
            Video Tutorials
          </Link>
        </div>
      </div>
    </div>
  );
}
