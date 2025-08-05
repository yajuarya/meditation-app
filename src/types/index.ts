export interface MeditationSession {
  id: string;
  date: string;
  duration: number; // in minutes
  breathingPattern: BreathingPattern;
  completed: boolean;
}

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  description: string;
}

export interface UserProgress {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  sessions: MeditationSession[];
}

export interface TimerState {
  duration: number;
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  phase: 'setup' | 'meditation' | 'completed';
}

export interface BreathingState {
  currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  phaseTimeRemaining: number;
  cycleCount: number;
}
