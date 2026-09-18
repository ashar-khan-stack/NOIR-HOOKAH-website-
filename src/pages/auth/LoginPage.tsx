import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check if redirected from session timeout or another protected route
  const locationState = location.state as { sessionExpired?: boolean; message?: string; from?: { pathname: string } } | null;
  const timeoutNotice = locationState?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both your email and password.');
        setLoading(false);
        return;
      }

      await login(email, password);
      
      const currentUser = auth.currentUser;
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult(true);
        const claims = tokenResult.claims;
        const isAdmin = claims.admin === true && claims.role === 'ADMIN';
        if (isAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      const code = err?.code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('Access temporarily restricted due to multiple failed attempts. Try again later.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg('Network connection issue. Please check your internet connection.');
      } else {
        setErrorMsg(err?.message || 'Authentication failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Elevate the Night.">
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
            VIP Member Suite
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in to access your personal lounge reservations and rewards.
          </p>
        </div>

        {timeoutNotice && (
          <div
            role="alert"
            className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-200 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{timeoutNotice}</span>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vip@noirhookah.com"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-neutral-600 transition outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="login-password"
                className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-[#d4af37] hover:text-[#f7e7ce] transition font-medium focus:outline-none focus:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-10 py-3 placeholder:text-neutral-600 transition outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Member Suite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Links section */}
        <div className="pt-4 border-t border-neutral-800/80 text-center">
          <p className="text-xs text-neutral-400">
            Not a VIP member yet?{' '}
            <Link
              to="/register"
              className="text-[#d4af37] font-semibold hover:text-[#f7e7ce] transition underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#d4af37] rounded"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
