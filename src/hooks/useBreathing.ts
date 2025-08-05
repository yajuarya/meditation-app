import { useState, useEffect, useRef } from 'react';
import { BreathingState, BreathingPattern } from '@/types';

/**
 * Custom hook for managing breathing exercise cycles
 * Handles breathing phases, timing, and visual guidance
 */
export function useBreathing(pattern: BreathingPattern, isActive: boolean) {
  // Breathing state management
  const [breathingState, setBreathingState] = useState<BreathingState>({
    currentPhase: 'inhale',
    phaseTimeRemaining: pattern.inhale,
    cycleCount: 0
  });

  // Ref to store interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Reset breathing cycle to initial state
   */
  const resetBreathing = () => {
    setBreathingState({
      currentPhase: 'inhale',
      phaseTimeRemaining: pattern.inhale,
      cycleCount: 0
    });
  };

  /**
   * Get the next phase in the breathing cycle
   * @param currentPhase - Current breathing phase
   * @returns Next phase in the cycle
   */
  const getNextPhase = (currentPhase: BreathingState['currentPhase']): BreathingState['currentPhase'] => {
    switch (currentPhase) {
      case 'inhale':
        return pattern.hold1 ? 'hold1' : 'exhale';
      case 'hold1':
        return 'exhale';
      case 'exhale':
        return pattern.hold2 ? 'hold2' : 'inhale';
      case 'hold2':
        return 'inhale';
      default:
        return 'inhale';
    }
  };

  /**
   * Get duration for a specific breathing phase
   * @param phase - Breathing phase
   * @returns Duration in seconds
   */
  const getPhaseDuration = (phase: BreathingState['currentPhase']): number => {
    switch (phase) {
      case 'inhale':
        return pattern.inhale;
      case 'hold1':
        return pattern.hold1 || 0;
      case 'exhale':
        return pattern.exhale;
      case 'hold2':
        return pattern.hold2 || 0;
      default:
        return pattern.inhale;
    }
  };

  /**
   * Get user-friendly instruction for current breathing phase
   * @param phase - Current breathing phase
   * @returns Instruction text
   */
  const getPhaseInstruction = (phase: BreathingState['currentPhase']): string => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
      default:
        return 'Breathe In';
    }
  };

  /**
   * Get color for visual breathing guidance
   * @param phase - Current breathing phase
   * @returns Tailwind CSS color class
   */
  const getPhaseColor = (phase: BreathingState['currentPhase']): string => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-500'; // Blue for inhale
      case 'hold1':
        return 'bg-purple-500'; // Purple for hold after inhale
      case 'exhale':
        return 'bg-green-500'; // Green for exhale
      case 'hold2':
        return 'bg-orange-500'; // Orange for hold after exhale
      default:
        return 'bg-blue-500';
    }
  };

  /**
   * Get breathing circle scale for visual animation
   * @param phase - Current breathing phase
   * @param timeRemaining - Time remaining in current phase
   * @returns Scale value for CSS transform
   */
  const getBreathingScale = (phase: BreathingState['currentPhase'], timeRemaining: number): number => {
    const phaseDuration = getPhaseDuration(phase);
    const progress = (phaseDuration - timeRemaining) / phaseDuration;
    
    switch (phase) {
      case 'inhale':
        return 1 + (progress * 0.5); // Scale from 1 to 1.5
      case 'exhale':
        return 1.5 - (progress * 0.5); // Scale from 1.5 to 1
      case 'hold1':
      case 'hold2':
        return phase === 'hold1' ? 1.5 : 1; // Stay at max/min scale
      default:
        return 1;
    }
  };

  // Effect to handle breathing cycle progression
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setBreathingState(prev => {
          const newTimeRemaining = prev.phaseTimeRemaining - 1;
          
          // Check if current phase is complete
          if (newTimeRemaining <= 0) {
            const nextPhase = getNextPhase(prev.currentPhase);
            const nextDuration = getPhaseDuration(nextPhase);
            
            // Increment cycle count when completing a full cycle (returning to inhale)
            const newCycleCount = nextPhase === 'inhale' ? prev.cycleCount + 1 : prev.cycleCount;
            
            return {
              currentPhase: nextPhase,
              phaseTimeRemaining: nextDuration,
              cycleCount: newCycleCount
            };
          }
          
          return {
            ...prev,
            phaseTimeRemaining: newTimeRemaining
          };
        });
      }, 1000);
    } else {
      // Clear interval when not active
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
  }, [isActive, pattern]);

  // Reset breathing state when pattern changes
  useEffect(() => {
    resetBreathing();
  }, [pattern]);

  return {
    breathingState,
    resetBreathing,
    getPhaseInstruction,
    getPhaseColor,
    getBreathingScale
  };
}
