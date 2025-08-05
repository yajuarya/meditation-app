'use client';

import { useState } from 'react';
import Timer from '@/components/Timer';
import Progress from '@/components/Progress';
import { Play, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<'timer' | 'progress'>('timer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Navigation Header */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveView('timer')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeView === 'timer'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Meditate</span>
            </button>
            <button
              onClick={() => setActiveView('progress')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeView === 'progress'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'timer' && <Timer />}
      {activeView === 'progress' && <Progress />}
    </div>
  );
}
