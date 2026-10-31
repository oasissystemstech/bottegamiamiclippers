import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  setCurrentIndex,
}) => {
  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + 1) % items.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') setCurrentIndex((currentIndex + 1) % items.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, setCurrentIndex]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative max-w-5xl w-full flex flex-col items-center"
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-3 text-xs text-[#a5a9b7]">
          <div className="flex items-center gap-2">
            <span className="text-[#c59b27] font-semibold uppercase tracking-wider">
              {currentItem.category.replace('_', ' ')}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentIndex + 1} of {items.length}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#181a22] text-[#e0e2ec] hover:text-white hover:bg-[#252834] transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image View */}
        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-[#0a0a0d] border border-[#232733]">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full max-h-[75vh] object-contain select-none"
            referrerPolicy="no-referrer"
          />

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Caption & Title */}
        <div className="w-full text-center pt-3 text-xs">
          <h4 className="font-semibold text-sm text-[#f5ebd7]">
            {currentItem.title}
          </h4>
          {currentItem.caption && (
            <p className="text-[#8e92a2] mt-0.5 max-w-xl mx-auto">
              {currentItem.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
