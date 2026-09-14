import React from 'react';
import { Flame } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
  badge?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  subtitle = 'Elevate the Night.',
  badge,
}) => {
  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col justify-between relative overflow-hidden selection:bg-[#d4af37]/30 selection:text-[#f7e7ce] p-4 sm:p-6 lg:p-8">
      {/* Background Luxury Ambient Glows & Smoke Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[radial-gradient(circle,rgba(139,0,0,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.025] pointer-events-none" />

      {/* Subtle Atmospheric Smoke Layers */}
      <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-neutral-600/5 blur-3xl animate-smoke pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-[#d4af37]/5 blur-3xl animate-smoke-slow pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-neutral-500/5 blur-3xl animate-smoke-delayed pointer-events-none" />

      {/* Top Header Logo */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-center pt-4 sm:pt-6 z-10">
        <div className="flex flex-col items-center gap-2 group cursor-pointer text-center">
          <div className="w-12 h-12 rounded-full border border-[#d4af37]/60 bg-[#121216] flex items-center justify-center text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:scale-105 transition-transform duration-300">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-xl sm:text-2xl tracking-[0.25em] text-[#f7e7ce] block">
              NOIR HOOKAH
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#d4af37] font-sans font-medium">
              {subtitle}
            </span>
          </div>
          {badge && (
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-[9px] uppercase tracking-widest font-semibold">
              {badge}
            </span>
          )}
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="bg-[#121216]/90 backdrop-blur-xl border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center py-4 z-10 text-neutral-500 text-[11px] tracking-wider space-y-1">
        <p>© {new Date().getFullYear()} NOIR HOOKAH LOUNGE. All Rights Reserved.</p>
        <p className="text-[10px] text-neutral-600">Ultra-Luxury Hookah & Sheesha Experience • Strictly 21+</p>
      </footer>
    </div>
  );
};
