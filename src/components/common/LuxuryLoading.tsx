import React from 'react';
import { Flame } from 'lucide-react';

interface LuxuryLoadingProps {
  message?: string;
}

export const LuxuryLoading: React.FC<LuxuryLoadingProps> = ({ message = 'Accessing NOIR Suite...' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="absolute w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col items-center space-y-6 z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37] animate-spin flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]" />
          <div className="absolute inset-0 flex items-center justify-center text-[#d4af37]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="font-serif-luxury font-bold tracking-[0.25em] text-[#f7e7ce] text-sm uppercase">
            NOIR HOOKAH
          </div>
          <p className="text-[11px] uppercase tracking-widest text-[#d4af37] font-sans">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
