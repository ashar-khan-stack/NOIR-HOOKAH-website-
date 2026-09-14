import React, { useState } from 'react';
import { PageRoute, User } from '../../types';
import { authService } from '../../services/authService';
import { analytics } from '../../services/analyticsService';
import {
  Sparkles,
  Lock,
  UserCheck,
  ShieldCheck,
  Flame,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface WelcomeAuthGateProps {
  onNavigate: (page: PageRoute) => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'welcome' | 'login' | 'register' | 'admin-login';
}

export const WelcomeAuthGate: React.FC<WelcomeAuthGateProps> = ({
  onNavigate,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'login' | 'register' | 'admin'>(() => {
    if (initialMode === 'admin-login') return 'admin';
    if (initialMode === 'register') return 'register';
    return 'login';
  });

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Customer Login
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (!email || !password) {
        setErrorMsg('Please enter your email and password.');
        setLoading(false);
        return;
      }
      const user = await authService.login(email, password);
      analytics.trackLogin('Customer_Email');
      onLoginSuccess(user);
      onNavigate('user-dashboard');
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('Too many failed attempts. Please try again later.');
      } else {
        setErrorMsg(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Customer Registration
  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (!name || !email || !phone || !password) {
        setErrorMsg('Please complete all required fields.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      const newUser = await authService.register(name, email, phone, password);
      analytics.trackEvent('customer_registration_success', { email });
      onLoginSuccess(newUser);
      onNavigate('user-dashboard');
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setErrorMsg('This email address is already registered. Please log in.');
      } else if (err?.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err?.message || 'Failed to create account. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Executive Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (!adminUsername || !adminPassword) {
        setErrorMsg('Please enter your admin email and password.');
        setLoading(false);
        return;
      }
      const adminUser = await authService.adminLogin(adminUsername, adminPassword);
      analytics.trackEvent('admin_login_success', { username: adminUsername });
      onLoginSuccess(adminUser);
      onNavigate('admin');
    } catch (err: any) {
      if (err?.message?.includes('custom claims')) {
        setErrorMsg('Access Denied: Account lacks executive custom claims (admin: true, role: "ADMIN").');
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        setErrorMsg('Invalid executive credentials. Access restricted.');
      } else {
        setErrorMsg(err?.message || 'Admin authorization failed. Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="welcome-auth-gate"
      className="min-h-screen bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#d4af37] selection:text-black py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Ambient Glow & Cinematic Smoke Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] gold-radial-glow opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none"></div>

      {/* Cinematic Smoke Overlays */}
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-gradient-to-t from-[#d4af37]/10 via-neutral-900/10 to-transparent rounded-full blur-3xl opacity-25 animate-smoke pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-b from-[#d4af37]/15 via-black/20 to-transparent rounded-full blur-3xl opacity-20 animate-smoke-slow pointer-events-none" />
      <div className="absolute -top-10 left-1/3 w-80 h-80 bg-neutral-800/20 rounded-full blur-2xl opacity-30 animate-smoke-fast pointer-events-none" />

      {/* Top Header Branding */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#d4af37] bg-[#121216] flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-lg tracking-widest text-white block">
              NOIR HOOKAH
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37]">
              Elevate the Night
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold border border-[#d4af37]/30 px-3 py-1.5 rounded-full bg-[#121216]/80 backdrop-blur-md">
            VIP Portal Access
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="max-w-xl w-full mx-auto my-auto z-10 pt-6 pb-6">
        <div className="bg-[#121216]/90 border border-[#d4af37]/30 rounded-3xl p-6 sm:p-10 glass-panel shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
          
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-bl-full pointer-events-none"></div>

          {/* Heading Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ULTRA LUXURY MEMBERS PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white">
              NOIR HOOKAH
            </h1>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Welcome to Pakistan&apos;s premier 24K Gold Hookah & Artisanal Lounge experience. Please sign in to access your VIP Concierge.
            </p>
          </div>

          {/* Nav Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#0a0a0c] p-1.5 rounded-2xl border border-neutral-800 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login' || activeTab === 'welcome'
                  ? 'bg-[#d4af37] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Member Login</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#d4af37] text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join VIP Club</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-neutral-800 text-[#d4af37] font-bold border border-[#d4af37]/40 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Suite</span>
            </button>
          </div>

          {/* Error / Alert Display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: CUSTOMER LOGIN */}
          {(activeTab === 'login' || activeTab === 'welcome') && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  VIP Member Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="vip.guest@noirhookah.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      if (email) {
                        await authService.forgotPassword(email);
                        setSuccessMsg('Reset password link dispatched to your email.');
                      } else {
                        setErrorMsg('Please enter your email address to reset password.');
                      }
                    }}
                    className="text-[10px] text-[#d4af37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#d4af37] rounded"
                  />
                  <span>Remember Session</span>
                </label>
              </div>

              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Enter Member Suite</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-neutral-400">
                Not a VIP member yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                  }}
                  className="text-[#d4af37] font-semibold underline hover:text-[#f7e7ce]"
                >
                  Create Gold VIP Account
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CUSTOMER REGISTRATION */}
          {activeTab === 'register' && (
            <form onSubmit={handleCustomerRegister} className="space-y-3.5">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmad Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="guest@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[#0a0a0c] rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>New accounts instantly unlock 100 Gold VIP Loyalty Points!</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                {loading ? <span>Creating Account...</span> : <span>Create VIP Account</span>}
              </button>

              <div className="text-center text-xs text-neutral-400 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                  }}
                  className="text-[#d4af37] font-semibold underline"
                >
                  Log In Here
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: EXECUTIVE ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-xl text-xs text-[#f7e7ce] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
                <div>
                  <strong className="block text-white uppercase text-[10px] tracking-wider">
                    Executive Portal Access
                  </strong>
                  For lounge management, floor captains, and administrative staff only.
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#d4af37] block mb-1">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin@noirhookah.com"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#d4af37] block mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#d4af37]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-neutral-900 border border-[#d4af37] text-[#d4af37] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#d4af37] hover:text-black transition flex items-center justify-center gap-2"
              >
                {loading ? <span>Verifying Admin...</span> : <span>Access Executive Suite</span>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-neutral-500 z-10">
        NOIR HOOKAH © {new Date().getFullYear()} • 18+ VIP Sheesha & Artisanal Lounge
      </div>
    </div>
  );
};
