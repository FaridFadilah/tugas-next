"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Calendar, Edit3, Trash2 } from "lucide-react";
import { journalAPI } from "../utils/api";
import { DEMO_USER_ID } from "../utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setIsLoading(true);
      const entries = await journalAPI.getEntries();
      setJournalEntries(entries);
    } catch (err: any) {
      setError(err.message || 'Failed to load journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await journalAPI.deleteEntry(id);
      setJournalEntries(entries => entries.filter(entry => entry.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete journal entry');
    }
  };

  // Filter entries based on search term, mood, and date
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    const matchesDate = !selectedDate || entry.createdAt.split('T')[0] === selectedDate;
    
    return matchesSearch && matchesMood && matchesDate;
  });
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'productive': return 'bg-green-100 text-green-800';
      case 'motivated': return 'bg-blue-100 text-blue-800';
      case 'focused': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              onClick={loadJournalEntries}
              size="sm"
              variant="outline"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal</h1>
          <p className="text-gray-600">Track your daily activities and thoughts</p>
        </div>
        <Button asChild>
          <Link href="/journal/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Entry
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Moods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Moods</SelectItem>
                  <SelectItem value="productive">Productive</SelectItem>
                  <SelectItem value="motivated">Motivated</SelectItem>
                  <SelectItem value="focused">Focused</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="tired">Tired</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {entry.title || 'Journal Entry'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                    <Badge variant="secondary" className={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </Badge>
                    {entry.energyLevel && (
                      <span className="text-xs text-muted-foreground">
                        Energy: {entry.energyLevel}/10
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href={`/journal/${entry.id}`}>
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                {entry.content.length > 200 
                  ? `${entry.content.substring(0, 200)}...` 
                  : entry.content
                }
              </p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.tags.map((tag: string, index: number) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href={`/journal/${entry.id}`}>
                  Read more →
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {journalEntries.length === 0 ? 'No journal entries yet' : 'No entries match your search'}
            </h3>
            <p className="text-gray-600 mb-6">
              {journalEntries.length === 0 
                ? 'Start documenting your daily activities and thoughts'
                : 'Try adjusting your search criteria'
              }
            </p>
            {journalEntries.length === 0 && (
              <Button asChild>
                <Link href="/journal/new" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create your first entry
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
