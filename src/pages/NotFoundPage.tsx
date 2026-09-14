import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { firebaseUser } = useAuth();
  const returnPath = firebaseUser ? '/dashboard' : '/login';

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex items-center justify-center p-4 selection:bg-[#d4af37]/30 selection:text-[#f7e7ce] relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_65%)] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-rose-950/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0a0a0c] border border-[#d4af37]/30 shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-[#121216] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto shadow-2xl">
          <Compass className="w-10 h-10 animate-spin-slow text-[#d4af37]" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#d4af37]">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Error 404</span>
          </div>
          <h1 className="font-serif-luxury font-bold text-3xl text-white">Chamber Not Found</h1>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mx-auto">
            The private chamber, menu dispatch, or route you are searching for does not exist in the NOIR sanctuary.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to={returnPath}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to {firebaseUser ? 'Dashboard' : 'Lounge'}</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
