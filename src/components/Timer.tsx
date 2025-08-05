'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useBreathing } from '@/hooks/useBreathing';
import { BreathingPattern, MeditationSession } from '@/types';
import { addSession } from '@/lib/storage';

// Predefined breathing patterns for user selection
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: '4-7-8 Relaxing',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    description: 'Calming pattern for stress relief and sleep'
  },
  {
    name: 'Box Breathing',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: 'Balanced breathing for focus and clarity'
  },
  {
    name: 'Simple 4-6',
    inhale: 4,
    exhale: 6,
    description: 'Basic pattern for beginners'
  },
  {
    name: 'Energy Boost',
    inhale: 3,
    hold1: 2,
    exhale: 4,
    description: 'Energizing pattern for alertness'
  }
];

// Timer duration options in seconds
const DURATION_OPTIONS = [
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '20 min', value: 1200 },
  { label: '30 min', value: 1800 }
];

export default function Timer() {
  // Selected breathing pattern state
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  
  // Timer hook for managing countdown and controls
  const { 
    timerState, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    setDuration, 
    formatTime, 
    getProgress 
  } = useTimer();

  // Breathing hook for managing breathing cycles
  const { 
    breathingState, 
    resetBreathing, 
    getPhaseInstruction, 
    getPhaseColor, 
    getBreathingScale 
  } = useBreathing(selectedPattern, timerState.isActive);

  /**
   * Handle timer completion - save session data
   */
  useEffect(() => {
    if (timerState.phase === 'completed') {
      // Create meditation session record
      const session: MeditationSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: timerState.duration,
        breathingPattern: selectedPattern,
        completed: true
      };

      // Save session to localStorage
      addSession(session);
    }
  }, [timerState.phase, timerState.duration, selectedPattern]);

  /**
   * Handle pattern change - reset breathing when pattern changes
   */
  const handlePatternChange = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    resetBreathing();
  };

  /**
   * Handle duration change
   */
  const handleDurationChange = (seconds: number) => {
    setDuration(seconds);
  };

  /**
   * Handle timer start
   */
  const handleStart = () => {
    startTimer();
    resetBreathing();
  };

  /**
   * Handle timer reset
   */
  const handleReset = () => {
    stopTimer();
    resetBreathing();
  };

  // Render setup phase - pattern and duration selection
  if (timerState.phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Guided Meditation</h1>
          <p className="text-gray-600">Choose your breathing pattern and duration</p>
        </div>

        {/* Breathing Pattern Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Breathing Pattern</h2>
          <div className="grid gap-3">
            {BREATHING_PATTERNS.map((pattern) => (
              <button
                key={pattern.name}
                onClick={() => handlePatternChange(pattern)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPattern.name === pattern.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-800">{pattern.name}</div>
                <div className="text-sm text-gray-600 mt-1">{pattern.description}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Inhale: {pattern.inhale}s
                  {pattern.hold1 && ` • Hold: ${pattern.hold1}s`}
                  • Exhale: {pattern.exhale}s
                  {pattern.hold2 && ` • Hold: ${pattern.hold2}s`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Duration</h2>
          <div className="grid grid-cols-3 gap-3">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDurationChange(option.value)}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  timerState.duration === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center pt-4">
          <button
            onClick={handleStart}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Meditation
          </button>
        </div>
      </div>
    );
  }

  // Render meditation phase - active timer with breathing guidance
  if (timerState.phase === 'meditation') {
    const currentScale = getBreathingScale(breathingState.currentPhase, breathingState.phaseTimeRemaining);
    
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8 text-center">
        {/* Timer Display */}
        <div className="space-y-2">
          <div className="text-6xl font-mono font-bold text-gray-800">
            {formatTime(timerState.timeRemaining)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex justify-center items-center py-8">
          <div
            className={`w-48 h-48 rounded-full ${getPhaseColor(breathingState.currentPhase)} transition-all duration-1000 flex items-center justify-center`}
            style={{ transform: `scale(${currentScale})` }}
          >
            <div className="text-gray-800 text-xl font-semibold">
              {getPhaseInstruction(breathingState.currentPhase)}
            </div>
          </div>
        </div>

        {/* Breathing Info */}
        <div className="space-y-2">
          <div className="text-lg text-gray-600">
            {breathingState.phaseTimeRemaining}s remaining
          </div>
          <div className="text-sm text-gray-500">
            Cycle {breathingState.cycleCount + 1} • {selectedPattern.name}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {timerState.isPaused ? (
            <button
              onClick={resumeTimer}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Resume
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="inline-flex items-center px-6 py-3 bg-yellow-600 text-gray-800 font-medium rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </button>
        </div>
      </div>
    );
  }

  // Render completion phase - session completed
  if (timerState.phase === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8 text-center">
        {/* Completion Message */}
        <div className="space-y-4">
          <div className="text-6xl">🧘‍♀️</div>
          <h1 className="text-3xl font-bold text-gray-800">Session Complete!</h1>
          <p className="text-gray-600">
            You completed a {Math.floor(timerState.duration / 60)}-minute meditation session
            using {selectedPattern.name}
          </p>
        </div>

        {/* Session Stats */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-2">
          <div className="text-sm text-gray-500">Session Summary</div>
          <div className="text-lg font-semibold text-gray-800">
            Duration: {Math.floor(timerState.duration / 60)} minutes
          </div>
          <div className="text-lg font-semibold text-gray-800">
            Breathing Cycles: {breathingState.cycleCount}
          </div>
          <div className="text-lg font-semibold text-gray-800">
            Pattern: {selectedPattern.name}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Session
          </button>
        </div>
      </div>
    );
  }

  return null;
}
