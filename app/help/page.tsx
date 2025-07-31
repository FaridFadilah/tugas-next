"use client";

import { ChevronDown, ChevronRight, Search, MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create my first journal entry?",
        answer: "To create your first journal entry, navigate to the Journal section from the sidebar and click the 'New Entry' button. You can then write your thoughts, select a mood, and add tags to organize your entries."
      },
      {
        question: "How do I set up reminders?",
        answer: "Go to the Reminder section and click 'Add Reminder'. You can set the title, description, date, time, and choose how often you want to be reminded (once, daily, weekly, etc.)."
      },
      {
        question: "What can I see in the Summary section?",
        answer: "The Summary section provides analytics about your activities, including mood trends, journal entry frequency, reminder completion rates, and overall progress insights."
      }
    ]
  },
  {
    category: "Journal Features",
    questions: [
      {
        question: "Can I add images to my journal entries?",
        answer: "Yes! When creating or editing a journal entry, you can upload images by clicking the image icon in the editor toolbar. Supported formats include JPG, PNG, and GIF."
      },
      {
        question: "How do I organize my journal entries?",
        answer: "You can organize entries using tags, mood indicators, and the built-in search functionality. Entries are automatically sorted by date, but you can filter by tags or mood to find specific content."
      },
      {
        question: "Can I export my journal entries?",
        answer: "Yes, you can export your journal entries in PDF or text format. Go to Settings > Export Data to download your entries."
      }
    ]
  },
  {
    category: "Reminders & Notifications",
    questions: [
      {
        question: "Why am I not receiving reminder notifications?",
        answer: "Make sure notifications are enabled in your browser settings and in your device settings. Also check that you've set the correct time and date for your reminders."
      },
      {
        question: "Can I customize reminder sounds?",
        answer: "Yes, you can customize notification sounds in the Settings page under 'Notification Preferences'. You can choose from several built-in sounds or upload your own."
      },
      {
        question: "How do I mark a reminder as complete?",
        answer: "Click the checkbox next to the reminder in your reminder list, or click on the reminder and select 'Mark as Complete'. Completed reminders will move to your completed tasks list."
      }
    ]
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        question: "How do I change my password?",
        answer: "Go to your Profile page and click on 'Security & Privacy', then select 'Change Password'. You'll need to enter your current password and your new password twice."
      },
      {
        question: "Is my data private and secure?",
        answer: "Yes, your data is encrypted and stored securely. We never share your personal information with third parties. You can read our full privacy policy in the footer."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, go to Profile > Security & Privacy > Delete Account. Please note that this action is permanent and cannot be undone."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...faqData.map(cat => cat.category)];

  const filteredFAQ = faqData.filter(category => {
    if (selectedCategory !== "all" && category.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions and get the help you need
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category === "all" ? "All Categories" : category}
          </button>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="space-y-8 mb-12">
        {filteredFAQ.map((category) => (
          <div key={category.category}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions
                .filter(q => 
                  !searchQuery || 
                  q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  q.answer.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Still need help?
        </h2>
        <p className="text-gray-600 mb-8">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help from our support team
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">
              Send us an email and we'll respond within 24 hours
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Send Email
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Phone className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-4">
              Call us for urgent issues or complex problems
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="flex justify-center gap-6 text-blue-600">
          <a href="/privacy" className="hover:text-blue-800 transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-800 transition-colors">Terms of Service</a>
          <a href="/tutorials" className="hover:text-blue-800 transition-colors">Video Tutorials</a>
          <a href="/feedback" className="hover:text-blue-800 transition-colors">Send Feedback</a>
        </div>
      </div>
    </div>
  );
}
