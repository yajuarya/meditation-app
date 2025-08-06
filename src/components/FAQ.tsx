'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I start a meditation session?",
    answer: "Select your preferred breathing pattern (4-7-8, Box Breathing, or Triangle Breathing), choose your session duration using the timer controls, and click the \"Start\" button. The app will guide you through the breathing exercise with visual cues."
  },
  {
    question: "What are the different breathing patterns?",
    answer: "• 4-7-8 Breathing: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Great for relaxation and sleep.\n• Box Breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Perfect for stress relief and focus.\n• Triangle Breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Simple and effective for beginners."
  },
  {
    question: "How does the progress tracking work?",
    answer: "The app automatically saves each completed session to your browser's local storage. You can view your total sessions, minutes meditated, current streak, longest streak, and recent session history in the Progress tab."
  },
  {
    question: "Will my progress be saved if I close the browser?",
    answer: "Yes! Your meditation history is stored locally on your device and will persist between browser sessions. However, clearing your browser data will reset your progress."
  },
  {
    question: "Can I pause or stop a session early?",
    answer: "Yes, you can stop a session at any time by clicking the \"Stop\" button. Only completed sessions are counted toward your progress statistics."
  },
  {
    question: "What if I miss a day? Will my streak reset?",
    answer: "Yes, your current streak will reset if you don't meditate for a day. However, your longest streak record will be preserved, and you can always start building a new streak."
  },
  {
    question: "Is this app suitable for beginners?",
    answer: "Absolutely! The app is designed for all experience levels. Start with shorter sessions (2-5 minutes) and the Triangle Breathing pattern if you're new to meditation."
  },
  {
    question: "Do I need headphones or speakers?",
    answer: "No audio is required. The app provides visual breathing guidance through animated cues and text instructions, making it perfect for silent meditation anywhere."
  },
  {
    question: "Can I use this app offline?",
    answer: "Once loaded, the app works offline for meditation sessions. However, you'll need an internet connection for initial loading and any future updates."
  },
  {
    question: "How often should I meditate?",
    answer: "Consistency is more important than duration. Even 2-3 minutes daily can be beneficial. Start small and gradually increase your session length as you build the habit."
  }
];

export default function FAQ({ isOpen, onClose }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* FAQ Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 pr-4">{item.question}</span>
                  {expandedItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                </button>
                {expandedItems.includes(index) && (
                  <div className="px-4 pb-4">
                    <div className="text-gray-600 whitespace-pre-line">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Have more questions? This app is designed to help you build a consistent meditation practice.
          </p>
        </div>
      </div>
    </div>
  );
}
