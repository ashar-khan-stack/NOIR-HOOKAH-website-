import React from 'react';
import { PageRoute, User } from '../../types';
import { authService } from '../../services/authService';
import { ShieldX, ShieldAlert, ArrowRight, Lock } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  onNavigate: (page: PageRoute) => void;
  onLogout?: () => void;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  onNavigate,
  onLogout,
}) => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.isAdmin);

  if (!currentUser) {
    // Unauthenticated user attempting to access Admin
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] bg-[#121216] flex items-center justify-center text-[#d4af37] mx-auto shadow-2xl">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
            AUTHENTICATION REQUIRED
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white">
            Executive Admin Portal
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Please sign in with your executive management credentials to access the NOIR lounge control console.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('admin-login')}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Admin Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl hover:text-white transition"
          >
            Back to Public Lounge
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Authenticated non-admin user
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full border-2 border-rose-500/50 bg-rose-950/40 flex items-center justify-center text-rose-400 mx-auto shadow-2xl">
          <ShieldX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-rose-400 font-bold">
            ACCESS RESTRICTED • 403 UNAUTHORIZED
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white">
            Executive Management Portal
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Your current account (<span className="text-white font-semibold">{currentUser.email}</span>) does not possess executive administrative privileges.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('user-dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110"
          >
            Return to VIP User Dashboard
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              onNavigate('admin-login');
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl hover:text-white"
          >
            Switch to Admin Account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
