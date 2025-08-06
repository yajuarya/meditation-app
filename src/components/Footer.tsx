'use client';

import { HelpCircle, Share2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FooterProps {
  onFAQClick: () => void;
}

export default function Footer({ onFAQClick }: FooterProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile/tablet
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileUA || (hasTouchScreen && window.innerWidth <= 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Mindful Breathing - Guided Meditation App',
      text: 'Check out this amazing guided meditation app for breathing exercises and mindfulness!',
      url: window.location.href
    };

    if (isMobile && navigator.share) {
      // Use native share API on mobile
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard if native share fails
        await copyToClipboard();
      }
    } else {
      // Desktop behavior: try clipboard first
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage('Link Copied!');
      setTimeout(() => setShareMessage(''), 2000);
    } catch (err) {
      // Fallback: show social share modal
      setShowShareModal(true);
    }
  };

  const getSocialShareUrls = () => {
    if (typeof window === 'undefined') return { twitter: '', facebook: '', linkedin: '' };
    
    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this amazing guided meditation app for breathing exercises and mindfulness!')}&url=${encodeURIComponent(window.location.href)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };
  };

  const socialShareUrls = getSocialShareUrls();

  return (
    <>
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
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
              {shareMessage && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                  {shareMessage}
                </span>
              )}
            </button>

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

      {/* Social Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share this app</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <a
                href={socialShareUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                onClick={() => setShowShareModal(false)}
              >
                Share on Twitter
              </a>
              
              <a
                href={socialShareUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                onClick={() => setShowShareModal(false)}
              >
                Share on Facebook
              </a>
              
              <a
                href={socialShareUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-700 hover:bg-blue-800 text-white text-center py-2 px-4 rounded-lg transition-colors"
                onClick={() => setShowShareModal(false)}
              >
                Share on LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
