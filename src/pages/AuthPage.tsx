import React, { useState } from 'react';
import { PageRoute, User } from '../types';
import { authService } from '../services/authService';
import { analytics } from '../services/analyticsService';
import { Lock, Mail, User as UserIcon, Phone, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: PageRoute) => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);
        analytics.trackLogin('email');
        onLoginSuccess(user);
        onNavigate('profile');
      } else if (mode === 'register') {
        const user = await authService.register(name, email, phone, password);
        onLoginSuccess(user);
        onNavigate('profile');
      } else {
        await authService.forgotPassword(email);
        setErrorMsg('Password reset link sent to your email.');
        setMode('login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillVIPDemo = () => {
    setEmail('vip@noirhookah.com');
    setPassword('vip12345');
  };

  return (
    <div id="auth-page" className="pt-24 pb-20 max-w-md mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full border border-[#d4af37]/50 bg-[#121216] flex items-center justify-center text-[#d4af37] font-cinzel font-bold text-xl mx-auto">
          N
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
          {mode === 'login' ? 'VIP Access Portal' : mode === 'register' ? 'Join NOIR VIP Club' : 'Reset Password'}
        </h1>
        <p className="text-xs text-neutral-400">
          {mode === 'login'
            ? 'Sign in to access order history, loyalty points, and priority table reservations.'
            : mode === 'register'
            ? 'Unlock 500 complimentary loyalty points upon registration.'
            : 'Enter your registered VIP email address.'}
        </p>
      </div>

      <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="vip@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+92 300 0000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#d4af37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to VIP Account'
              : mode === 'register'
              ? 'Create VIP Member Account'
              : 'Send Reset Instructions'}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        {mode === 'login' && (
          <div className="pt-2 text-center border-t border-neutral-800">
            <button
              onClick={handleFillVIPDemo}
              className="text-[11px] text-[#f7e7ce] hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Fill Pre-Filled VIP Demo Credentials</span>
            </button>
          </div>
        )}

        <div className="text-center text-xs text-neutral-400">
          {mode === 'login' ? (
            <>
              Don't have a VIP account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-[#d4af37] font-semibold hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[#d4af37] font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
