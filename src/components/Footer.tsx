'use client';

import { HelpCircle } from 'lucide-react';

interface FooterProps {
  onFAQClick: () => void;
}

export default function Footer({ onFAQClick }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <a
            href="http://yajuarya.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors"
          >
            By Yaju Arya
          </a>
          <button
            onClick={onFAQClick}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">FAQ</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
