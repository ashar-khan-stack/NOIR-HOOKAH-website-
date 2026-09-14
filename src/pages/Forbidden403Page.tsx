import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, ArrowLeft, LogOut, ArrowRight } from 'lucide-react';

export const Forbidden403Page: React.FC = () => {
  const { firebaseUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchAccount = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div
      role="main"
      className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#d4af37]/30 selection:text-[#f7e7ce] relative overflow-hidden"
    >
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,0,0,0.12),transparent_70%)] pointer-events-none" />

      <div className="max-w-md w-full bg-[#121216]/90 backdrop-blur-xl border border-rose-900/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10">
        <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_25px_rgba(139,0,0,0.3)]">
          <ShieldX className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-rose-400 font-bold font-mono">
            403 UNAUTHORIZED • ACCESS RESTRICTED
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
            Executive Portal Blocked
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your current authenticated session (
            <span className="text-white font-medium">{firebaseUser?.email || userProfile?.email || 'Active Account'}</span>
            ) does not possess verified server-signed Firebase custom claims:
          </p>
          <div className="p-2.5 bg-[#0a0a0c] rounded-xl border border-neutral-800 text-[11px] font-mono text-[#d4af37]">
            claims: &#123; admin: true, role: &quot;ADMIN&quot; &#125;
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <button
            onClick={handleSwitchAccount}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-neutral-300 bg-neutral-900/90 border border-neutral-700 hover:text-white hover:border-neutral-500 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
