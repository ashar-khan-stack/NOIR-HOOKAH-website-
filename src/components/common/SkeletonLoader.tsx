import React from 'react';

interface SkeletonLoaderProps {
  type?: 'page' | 'menu' | 'hookah' | 'gallery' | 'card';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'page', count = 3 }) => {
  if (type === 'menu') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-neutral-800/60 rounded-xl w-1/3 mx-auto"></div>
        <div className="h-4 bg-neutral-800/40 rounded w-1/2 mx-auto"></div>
        <div className="flex justify-center gap-3 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 bg-neutral-800/50 rounded-full"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="bg-[#121216] border border-neutral-800/80 rounded-2xl p-5 space-y-4">
              <div className="h-48 bg-neutral-800/40 rounded-xl w-full"></div>
              <div className="h-6 bg-neutral-800/60 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-800/40 rounded w-full"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-20 bg-neutral-800/60 rounded"></div>
                <div className="h-9 w-24 bg-neutral-800/60 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'hookah') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="bg-[#121216] border border-[#d4af37]/20 rounded-3xl p-6 space-y-4">
              <div className="h-64 bg-neutral-800/50 rounded-2xl w-full"></div>
              <div className="h-7 bg-neutral-800/70 rounded w-2/3"></div>
              <div className="h-4 bg-neutral-800/40 rounded w-full"></div>
              <div className="h-4 bg-neutral-800/40 rounded w-4/5"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-neutral-800/60 rounded-full"></div>
                <div className="h-6 w-16 bg-neutral-800/60 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'gallery') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-10 bg-neutral-800/60 rounded-xl w-1/4 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: count * 2 }).map((_, idx) => (
            <div key={idx} className="h-64 bg-neutral-800/40 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6 animate-pulse">
      <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/40 bg-[#121216] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-[#d4af37] border-neutral-700 animate-spin"></div>
      </div>
      <div className="space-y-2 text-center">
        <div className="h-6 bg-neutral-800/70 rounded-md w-48 mx-auto"></div>
        <div className="h-4 bg-neutral-800/40 rounded-md w-64 mx-auto"></div>
      </div>
    </div>
  );
};
