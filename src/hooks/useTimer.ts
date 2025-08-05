import { useState, useEffect, useRef } from 'react';
import { TimerState } from '@/types';

/**
 * Custom hook for managing meditation timer functionality
 * Handles timer state, countdown logic, and timer controls
 */
export function useTimer() {
  // Timer state management
  const [timerState, setTimerState] = useState<TimerState>({
    duration: 300, // Default 5 minutes in seconds
    timeRemaining: 300,
    isActive: false,
    isPaused: false,
    phase: 'setup'
  });

  // Ref to store interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start the meditation timer
   * Transitions from setup to meditation phase
   */
  const startTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      phase: 'meditation'
    }));
  };

  /**
   * Pause the currently running timer
   * Can be resumed later
   */
  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: true
    }));
  };

  /**
   * Resume a paused timer
   */
  const resumeTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false
    }));
  };

  /**
   * Stop the timer and reset to setup phase
   */
  const stopTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      phase: 'setup',
      timeRemaining: prev.duration
    }));
  };

  /**
   * Set the timer duration in seconds
   * @param seconds - Duration in seconds
   */
  const setDuration = (seconds: number) => {
    setTimerState(prev => ({
      ...prev,
      duration: seconds,
      timeRemaining: seconds
    }));
  };

  /**
   * Format time in MM:SS format
   * @param seconds - Time in seconds
   * @returns Formatted time string
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Get progress percentage for visual indicators
   * @returns Progress as percentage (0-100)
   */
  const getProgress = (): number => {
    if (timerState.duration === 0) return 0;
    return ((timerState.duration - timerState.timeRemaining) / timerState.duration) * 100;
  };

  // Effect to handle countdown logic
  useEffect(() => {
    if (timerState.isActive && timerState.timeRemaining > 0) {
      // Start countdown interval
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          // Check if timer completed
          if (newTimeRemaining <= 0) {
            return {
              ...prev,
              timeRemaining: 0,
              isActive: false,
              phase: 'completed'
            };
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining
          };
        });
      }, 1000);
    } else {
      // Clear interval when timer is not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isActive, timerState.timeRemaining]);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setDuration,
    formatTime,
    getProgress
  };
}
