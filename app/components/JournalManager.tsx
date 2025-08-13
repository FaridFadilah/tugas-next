"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
  fetchJournalEntries, 
  createJournalEntry, 
  deleteJournalEntry,
  setFilters,
  clearError 
} from "../store/slices/journalSlice";
import { addNotification } from "../store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function JournalManager() {
  const dispatch = useAppDispatch();
  const { 
    entries, 
    isLoading, 
    error, 
    filters 
  } = useAppSelector((state) => state.journal);
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
    tags: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchJournalEntries());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      dispatch(addNotification({
        type: 'error',
        message: error
      }));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreateEntry = async () => {
    if (!newEntry.content.trim()) {
      dispatch(addNotification({
        type: 'warning',
        message: 'Content is required'
      }));
      return;
    }

    try {
      const entryData = {
        ...newEntry,
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      const result = await dispatch(createJournalEntry(entryData));
      
      if (createJournalEntry.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Journal entry created successfully!'
        }));
        setNewEntry({ title: "", content: "", mood: "neutral", tags: "" });
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error('Failed to create entry:', err);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const result = await dispatch(deleteJournalEntry(id));
        
        if (deleteJournalEntry.fulfilled.match(result)) {
          dispatch(addNotification({
            type: 'success',
            message: 'Journal entry deleted successfully!'
          }));
        }
      } catch (err) {
        console.error('Failed to delete entry:', err);
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // You can implement more complex filtering logic here
    // For now, we'll just store the search term
  };

  const filteredEntries = entries.filter(entry => 
    searchTerm === "" || 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p>Please login to manage your journal entries.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Journal Manager (Redux)</h1>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title (optional)"
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Write your journal entry..."
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Mood</label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="happy">Happy</option>
                  <option value="neutral">Neutral</option>
                  <option value="sad">Sad</option>
                  <option value="excited">Excited</option>
                  <option value="anxious">Anxious</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  placeholder="work, personal, reflection"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateEntry} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Entry"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading journal entries...</p>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 && !isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No journal entries found.</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search terms or create a new entry.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex-1">
                  {entry.title && (
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{entry.mood}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {entry.content}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
