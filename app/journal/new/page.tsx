"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, Smile } from "lucide-react";
import { journalAPI } from "../../utils/api";
import { DEMO_USER_ID } from "../../utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function NewJournalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  
  // For demo purposes, using a hardcoded user ID
  // In a real app, this would come from authentication context
  const userId = DEMO_USER_ID;
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
      const content = formData.get('content') as string;
      const mood = formData.get('mood') as string;
      const energyLevelValue = energyLevel[0];
      const tagsInput = formData.get('tags') as string;
      const weather = selectedWeather;
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

      if (!content || !mood) {
        setError('Content and mood are required');
        return;
      }

      // Create journal entry via API
      const journalEntry = await journalAPI.createEntry({
        content,
        mood,
        energyLevel: energyLevelValue,
        tags,
        weather,
        location,
        activities,
        goals
      });

      console.log('Journal entry created:', journalEntry);
      
      // Redirect to journal list
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
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Tell us about your journal entry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="What did you do today?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={currentDate}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Share your thoughts and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">Journal Entry *</Label>
              <Textarea
                id="content"
                name="content"
                rows={12}
                placeholder="Write about your day, what you accomplished, challenges you faced, things you learned, or anything else that's on your mind..."
                className="resize-vertical"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Key Activities (Optional)</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  name="activity1"
                  placeholder="Activity 1"
                />
                <Input
                  type="text"
                  name="activity2"
                  placeholder="Activity 2"
                />
                <Input
                  type="text"
                  name="activity3"
                  placeholder="Activity 3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Goals for Tomorrow (Optional)</Label>
              <Textarea
                id="goals"
                name="goals"
                rows={3}
                placeholder="What do you want to accomplish tomorrow?"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mood Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              How are you feeling today? *
            </CardTitle>
            <CardDescription>Select the mood that best describes how you feel</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Energy Level */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Level</CardTitle>
            <CardDescription>Rate your energy level from 1 to 10</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="energyLevel">
                Current Energy Level: {energyLevel[0]}
              </Label>
              <Slider
                id="energyLevel"
                min={1}
                max={10}
                step={1}
                value={energyLevel}
                onValueChange={setEnergyLevel}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low (1)</span>
                <span>High (10)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional details about your day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weather">Weather (Optional)</Label>
                <Select value={selectedWeather} onValueChange={setSelectedWeather}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">☀️ Sunny</SelectItem>
                    <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                    <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                    <SelectItem value="snowy">❄️ Snowy</SelectItem>
                    <SelectItem value="windy">💨 Windy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Where were you today?"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                type="text"
                id="tags"
                name="tags"
                placeholder="Add tags separated by commas (e.g., work, meeting, coding)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" asChild>
            <Link href="/journal">Cancel</Link>
          </Button>
          
          <div className="flex gap-3">
            <Button type="button" variant="secondary">
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
