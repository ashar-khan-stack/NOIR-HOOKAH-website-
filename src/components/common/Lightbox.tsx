import React from 'react';
import { GalleryItem } from '../../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ item, onClose, onPrev, onNext }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-900/60 border border-neutral-700 transition"
      >
        <X className="w-6 h-6" />
      </button>

      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/60 border border-neutral-700 text-white hover:border-[#d4af37] transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/60 border border-neutral-700 text-white hover:border-[#d4af37] transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[70vh] object-contain rounded-xl border border-[#d4af37]/30 shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="mt-4 text-center max-w-lg">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            {item.category}
          </span>
          <h3 className="text-xl font-bold text-white font-serif-luxury mt-1">{item.title}</h3>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
};
