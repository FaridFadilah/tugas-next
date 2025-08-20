"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, Smile, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createJournalEntry, clearError } from "../../store/slices/journalSlice";

export default function NewJournalPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.journal);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  
  const moods = [
    { value: "excited", label: "Excited", emoji: "🤩", color: "bg-yellow-100 text-yellow-800" },
    { value: "productive", label: "Productive", emoji: "💪", color: "bg-green-100 text-green-800" },
    { value: "focused", label: "Focused", emoji: "🎯", color: "bg-blue-100 text-blue-800" },
    { value: "motivated", label: "Motivated", emoji: "🚀", color: "bg-purple-100 text-purple-800" },
    { value: "creative", label: "Creative", emoji: "🎨", color: "bg-pink-100 text-pink-800" },
    { value: "happy", label: "Happy", emoji: "😊", color: "bg-green-100 text-green-800" },
    { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-100 text-gray-800" },
    { value: "sad", label: "Sad", emoji: "😢", color: "bg-red-100 text-red-800" },
    { value: "anxious", label: "Anxious", emoji: "😰", color: "bg-orange-100 text-orange-800" }
  ];

  // const currentDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      
      // Extract form data
      const entryData = {
        title: formData.get('title') as string || undefined,
        content: formData.get('content') as string,
        mood: formData.get('mood') as string,
        energyLevel: energyLevel[0],
        tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(tag => tag) || [],
        weather: selectedWeather || undefined,
        location: formData.get('location') as string || undefined,
        activities: (formData.get('activities') as string)?.split(',').map(activity => activity.trim()).filter(activity => activity) || [],
        goals: formData.get('goals') as string || undefined
      };

      // Validate required fields
      if (!entryData.content || !entryData.mood) {
        dispatch(clearError());
        // You could dispatch a notification here instead
        alert('Content and mood are required');
        return;
      }

      const result = await dispatch(createJournalEntry(entryData));
      
      if (createJournalEntry.fulfilled.match(result)) {
        router.push('/journal');
      }
    } catch (err) {
      console.error('Failed to create journal entry:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please login to create journal entries</p>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <p className="text-gray-600 mt-1">
            Document your thoughts and activities
            {user && <span className="ml-2">• {user.fullName}</span>}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                name="title"
                placeholder="Give your entry a title..."
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="content" className="required">Content *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="What's on your mind today? Share your thoughts, experiences, or reflections..."
                rows={8}
                className="resize-none"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Mood & Energy
            </CardTitle>
            <CardDescription>
              How are you feeling right now?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="mood" className="required">Current Mood *</Label>
              <Select name="mood" required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <div className="flex items-center gap-2">
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="energyLevel">Energy Level: {energyLevel[0]}/10</Label>
              <div className="mt-2">
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low Energy</span>
                  <span>High Energy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Context & Details</CardTitle>
            <CardDescription>
              Add more context to your entry (all optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weather">Weather</Label>
                <Select value={selectedWeather} onValueChange={setSelectedWeather} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">☀️ Sunny</SelectItem>
                    <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                    <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                    <SelectItem value="snowy">❄️ Snowy</SelectItem>
                    <SelectItem value="windy">💨 Windy</SelectItem>
                    <SelectItem value="stormy">⛈️ Stormy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Where are you?"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="work, personal, reflection, goals (separate with commas)"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            <div>
              <Label htmlFor="activities">Key Activities</Label>
              <Input
                id="activities"
                name="activities"
                placeholder="meeting, coding, exercise, reading (separate with commas)"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                What were the main activities of your day?
              </p>
            </div>

            <div>
              <Label htmlFor="goals">Goals & Intentions</Label>
              <Textarea
                id="goals"
                name="goals"
                placeholder="What do you want to achieve tomorrow? Any intentions or goals?"
                rows={3}
                className="resize-none"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Entry
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
