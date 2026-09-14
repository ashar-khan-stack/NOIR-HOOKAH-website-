import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Crown, Shield, Clock, LogOut, Sparkles, CheckCircle2, User as UserIcon } from 'lucide-react';

export const DashboardFoundationPage: React.FC = () => {
  const { firebaseUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = userProfile?.name || firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'VIP Member';
  const displayEmail = userProfile?.email || firebaseUser?.email || '—';
  const tier = userProfile?.membershipTier || 'Gold VIP';
  const points = userProfile?.loyaltyPoints ?? 0;

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 selection:bg-[#d4af37]/30 selection:text-[#f7e7ce] p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-neutral-800/80 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 bg-[#121216] flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-lg tracking-widest text-[#f7e7ce] block">
              NOIR HOOKAH
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37]">
              VIP Member Suite
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          aria-label="Sign out from VIP Member Suite"
          className="px-4 py-2 bg-neutral-900/90 border border-neutral-700/80 hover:border-rose-700/80 hover:text-rose-300 text-neutral-300 text-xs font-semibold rounded-xl transition flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full my-auto py-8 z-10 space-y-6">
        {/* Welcome Card */}
        <div className="bg-[#121216]/90 border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7e7ce] to-[#aa820a] p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                  <Crown className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                    {tier} MEMBER
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Authenticated
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
                  Welcome, {displayName}
                </h1>
                <p className="text-xs text-neutral-400 font-mono">
                  {displayEmail}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#070709] border border-neutral-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Loyalty Points
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {points.toLocaleString()} PTS
                </div>
              </div>
            </div>
          </div>

          {/* Security & Inactivity Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80">
            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-xs font-semibold text-neutral-200">
                  30-Minute Inactivity Protection Active
                </h2>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Your VIP session actively terminates upon 30 minutes of idle time to safeguard private lounge data and reservations.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-xs font-semibold text-neutral-200">
                  Firebase Authentication Active
                </h2>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  UID: <code className="text-[#d4af37] text-[10px]">{firebaseUser?.uid}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 text-neutral-500 text-[11px] tracking-wider">
        © {new Date().getFullYear()} NOIR HOOKAH LOUNGE • Phase 1 Web Foundation
      </footer>
    </div>
  );
};
