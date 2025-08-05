import { UserProgress, MeditationSession } from '@/types';

const STORAGE_KEY = 'meditation-progress';

/**
 * Get stored meditation progress from localStorage
 * @returns UserProgress object or null if not found
 */
export function getStoredProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const progress = JSON.parse(stored) as UserProgress;
    return progress;
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    return null;
  }
}

/**
 * Save meditation progress to localStorage
 * @param progress - UserProgress object to save
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
}

/**
 * Add a new meditation session and update progress
 * @param session - MeditationSession to add
 */
export function addSession(session: MeditationSession): void {
  const currentProgress = getStoredProgress() || {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
    sessions: []
  };

  // Add the new session
  currentProgress.sessions.push(session);
  currentProgress.totalSessions += 1;
  currentProgress.totalMinutes += Math.floor(session.duration / 60);

  // Update streak calculation
  const today = new Date().toDateString();
  const lastSessionDate = currentProgress.lastSessionDate;
  
  if (lastSessionDate) {
    const lastDate = new Date(lastSessionDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day - increment streak
      currentProgress.currentStreak += 1;
    } else if (diffDays > 1) {
      // Gap in sessions - reset streak
      currentProgress.currentStreak = 1;
    }
    // If same day (diffDays === 0), keep current streak
  } else {
    // First session ever
    currentProgress.currentStreak = 1;
  }

  // Update longest streak if current is higher
  if (currentProgress.currentStreak > currentProgress.longestStreak) {
    currentProgress.longestStreak = currentProgress.currentStreak;
  }

  currentProgress.lastSessionDate = today;
  saveProgress(currentProgress);
}

/**
 * Initialize default progress if none exists
 * @returns Default UserProgress object
 */
export function initializeProgress(): UserProgress {
  const defaultProgress: UserProgress = {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
    sessions: []
  };
  
  saveProgress(defaultProgress);
  return defaultProgress;
}
