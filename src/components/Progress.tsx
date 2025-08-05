'use client';

import { useState, useEffect } from 'react';
import { MeditationSession, UserProgress } from '@/types';
import { getStoredProgress, saveProgress } from '@/lib/storage';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';

export default function Progress() {
  // State to hold user's meditation progress data
  const [progress, setProgress] = useState<UserProgress>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessions: []
  });

  // State to control which view is active (overview or history)
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  // Load progress data from localStorage when component mounts
  useEffect(() => {
    const storedProgress = getStoredProgress();
    if (storedProgress) {
      setProgress(storedProgress);
    }
  }, []);

  /**
   * Format duration from seconds to readable format
   * @param seconds - Duration in seconds
   * @returns Formatted string like "5m 30s"
   */
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  /**
   * Format date to readable format
   * @param date - Date object or ISO string
   * @returns Formatted date string
   */
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  /**
   * Get sessions from the last 7 days for streak calculation
   * @returns Array of recent sessions
   */
  const getRecentSessions = (): MeditationSession[] => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return progress.sessions.filter(session => 
      new Date(session.date) >= sevenDaysAgo
    );
  };

  /**
   * Calculate average session duration
   * @returns Average duration in seconds
   */
  const getAverageSessionDuration = (): number => {
    if (progress.sessions.length === 0) return 0;
    const totalDuration = progress.sessions.reduce((sum, session) => sum + session.duration, 0);
    return Math.round(totalDuration / progress.sessions.length);
  };

  /**
   * Get the most used breathing pattern
   * @returns Most popular breathing pattern name
   */
  const getFavoritePattern = (): string => {
    if (progress.sessions.length === 0) return 'None';
    
    // Count frequency of each pattern
    const patternCounts: Record<string, number> = {};
    progress.sessions.forEach(session => {
      patternCounts[session.breathingPattern] = (patternCounts[session.breathingPattern] || 0) + 1;
    });
    
    // Find the most frequent pattern
    const mostUsed = Object.entries(patternCounts).reduce((a, b) => 
      patternCounts[a[0]] > patternCounts[b[0]] ? a : b
    );
    
    return mostUsed[0];
  };

  // Statistics cards data with icons and calculated values
  const stats = [
    {
      icon: Calendar,
      label: 'Total Sessions',
      value: progress.totalSessions.toString(),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: `${Math.floor(progress.totalMinutes / 60)}h ${progress.totalMinutes % 60}m`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${progress.currentStreak} days`,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      label: 'Longest Streak',
      value: `${progress.longestStreak} days`,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your meditation journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 rounded-full p-1">
            {/* Overview Tab Button */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-800 hover:bg-white/80'
              }`}
            >
              Overview
            </button>
            {/* History Tab Button */}
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-800 hover:bg-white/80'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Grid - 4 main stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center"
                  >
                    {/* Gradient icon background */}
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} 
                                   flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-gray-800" />
                    </div>
                    {/* Stat value and label */}
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Session Duration Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Session Insights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Duration:</span>
                    <span className="text-gray-800 font-medium">
                      {formatDuration(getAverageSessionDuration())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favorite Pattern:</span>
                    <span className="text-gray-800 font-medium">{getFavoritePattern()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Week:</span>
                    <span className="text-gray-800 font-medium">
                      {getRecentSessions().length} sessions
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivational Card */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm 
                            rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Keep Going!</h3>
                <div className="text-gray-600">
                  {progress.totalSessions === 0 && (
                    <p>Start your meditation journey today. Every expert was once a beginner.</p>
                  )}
                  {progress.totalSessions > 0 && progress.totalSessions < 5 && (
                    <p>Great start! You&apos;re building a healthy habit. Consistency is key to success.</p>
                  )}
                  {progress.totalSessions >= 5 && progress.totalSessions < 20 && (
                    <p>You&apos;re doing amazing! Your mind is getting stronger with each session.</p>
                  )}
                  {progress.totalSessions >= 20 && (
                    <p>Incredible dedication! You&apos;re truly committed to your mental well-being.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab Content */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {progress.sessions.length === 0 ? (
              // Empty state when no sessions exist
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No sessions yet</h3>
                <p className="text-gray-600">Complete your first meditation to see your history here.</p>
              </div>
            ) : (
              // List of meditation sessions, most recent first
              progress.sessions
                .slice() // Create copy to avoid mutating original array
                .reverse() // Show most recent sessions first
                .map((session, index) => (
                  <div
                    key={session.id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
                  >
                    {/* Session info on the left */}
                    <div className="flex items-center space-x-4">
                      {/* Session number badge */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                                    flex items-center justify-center text-gray-800 font-semibold text-sm">
                        #{progress.sessions.length - index}
                      </div>
                      {/* Session details */}
                      <div>
                        <div className="text-gray-800 font-medium">
                          {formatDuration(session.duration)} • {session.breathingPattern}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {formatDate(session.date)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Completion badge on the right */}
                    <div className="text-green-400 text-sm font-medium">
                      ✓ Completed
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
