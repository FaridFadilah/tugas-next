"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Share2, Edit3, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { 
  fetchJournalEntry, 
  deleteJournalEntry,
  setCurrentEntry,
  clearError 
} from "../../store/slices/journalSlice";
import { useRouter } from "next/navigation";

interface Props {
  // In Next.js 15+ with React 19, params is a Promise and should be unwrapped with React.use()
  params: Promise<{ id: string }>; // keep it explicit to satisfy PageProps
}

export default function JournalDetailPage({ params }: Props) {
  // Unwrap the async params
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { 
    currentEntry: journalEntry, 
    isLoading, 
    error 
  } = useAppSelector(state => state.journal);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchJournalEntry(id));
    }

    // Cleanup function to clear current entry when component unmounts
    return () => {
      dispatch(setCurrentEntry(null));
    };
  }, [dispatch, id, isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDelete = async () => {
    if (!journalEntry || !confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await dispatch(deleteJournalEntry(journalEntry.id));
      router.push('/journal');
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

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

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'windy': return '💨';
      default: return '🌤️';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please login to view journal entries</p>
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
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading journal entry...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <div className="flex gap-2">
              <Button 
                onClick={() => dispatch(fetchJournalEntry(id))}
                size="sm"
                variant="outline"
              >
                Retry
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/journal">Back to Journal</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!journalEntry) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Journal Entry Not Found</h3>
            <p className="text-gray-600 mb-6">The journal entry you're looking for doesn't exist or has been deleted.</p>
            <Button asChild>
              <Link href="/journal">Back to Journal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/journal"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {journalEntry.title || 'Journal Entry'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(journalEntry.createdAt).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} at {new Date(journalEntry.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <Badge className={getMoodColor(journalEntry.mood)}>
                {journalEntry.mood}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <Link
            href={`/journal/${journalEntry.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </Link>
          <button 
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Journal Entry</h2>
            <div className="prose max-w-none">
              {journalEntry.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return <br key={index} />;
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.slice(2, -2)}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc list-inside ml-4 mb-2">
                      <li className="text-gray-700">{paragraph.slice(2)}</li>
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              {journalEntry.weather && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-16">Weather:</span>
                  <span className="text-gray-900 text-sm flex items-center gap-1">
                    {getWeatherIcon(journalEntry.weather)} {journalEntry.weather}
                  </span>
                </div>
              )}
              
              {journalEntry.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-sm w-16">Location:</span>
                  <span className="text-gray-900 text-sm">{journalEntry.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-16">Mood:</span>
                <Badge className={getMoodColor(journalEntry.mood)}>
                  {journalEntry.mood}
                </Badge>
              </div>

              {journalEntry.energyLevel && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-16">Energy:</span>
                  <span className="text-gray-900 text-sm">{journalEntry.energyLevel}/10</span>
                </div>
              )}
            </div>
          </div>

          {/* Activities */}
          {journalEntry.activities && journalEntry.activities.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Activities</h3>
              <ul className="space-y-2">
                {journalEntry.activities.map((activity: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {journalEntry.tags && journalEntry.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {journalEntry.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {journalEntry.goals && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
              <p className="text-sm text-gray-700">{journalEntry.goals}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <div className="space-y-2">
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href="/journal">
                  ← Back to Journal
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href={`/journal/${journalEntry.id}/edit`}>
                  Edit This Entry
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
