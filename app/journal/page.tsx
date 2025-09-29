"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit3, Trash2, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
  fetchJournalEntries, 
  deleteJournalEntry,
  clearError 
} from "../store/slices/journalSlice";
import { JournalEntry } from "../types";

export default function JournalPage() {
  const dispatch = useAppDispatch();
  const { 
    entries: journalEntries, 
    isLoading, 
    error 
  } = useAppSelector(state => state.journal);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchJournalEntries());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      // Error sudah ditangani di slice, kita bisa clear error setelah ditampilkan
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await dispatch(deleteJournalEntry(id));
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  // Filter entries based on search term, mood, and date
  const filteredEntries = journalEntries.filter((entry: JournalEntry) => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = !selectedMood || selectedMood === "all" || entry.mood === selectedMood;
    const matchesDate = !selectedDate || entry.createdAt.split('T')[0] === selectedDate;
    
    return matchesSearch && matchesMood && matchesDate;
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'productive': return 'bg-blue-100 text-blue-800';
      case 'motivated': return 'bg-purple-100 text-purple-800';
      case 'focused': return 'bg-indigo-100 text-indigo-800';
      case 'excited': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-red-100 text-red-800';
      case 'anxious': return 'bg-orange-100 text-orange-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  console.log(isAuthenticated)

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please login to access your journal entries</p>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading your journal entries...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal</h1>
          <p className="text-gray-600">
            Track your daily activities and thoughts
            {user && <span className="ml-2 text-sm">• Welcome, {user.fullName}</span>}
          </p>
        </div>
        <Button asChild>
          <Link href="/journal/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Entry
          </Link>
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              onClick={() => dispatch(fetchJournalEntries())}
              size="sm"
              variant="outline"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
                  <SelectItem value="all">All Moods</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="productive">Productive</SelectItem>
                  <SelectItem value="motivated">Motivated</SelectItem>
                  <SelectItem value="focused">Focused</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="anxious">Anxious</SelectItem>
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
        {filteredEntries.map((entry: JournalEntry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(entry.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  {entry.title && (
                    <CardTitle className="text-lg mb-2">{entry.title}</CardTitle>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Link href={`/journal/${entry.id}`}>
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-400 hover:text-red-600"
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
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
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
