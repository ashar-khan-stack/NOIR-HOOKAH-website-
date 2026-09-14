import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/email-already-in-use') {
        setErrorMsg('This email address is already registered. Please log in instead.');
      } else if (code === 'auth/invalid-email') {
        setErrorMsg('The email address format is invalid.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password is too weak. Please use a stronger combination.');
      } else {
        setErrorMsg(err?.message || 'Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Elevate the Night." badge="VIP Membership">
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Join the NOIR Circle
          </h1>
          <p className="text-xs text-neutral-400">
            Create your account to unlock private lounge bookings and luxury perks.
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Full Name */}
          <div className="space-y-1">
            <label
              htmlFor="register-name"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord Alexander Vance"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder:text-neutral-600 transition outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label
              htmlFor="register-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@noirhookah.com"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder:text-neutral-600 transition outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="register-password"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-10 py-2.5 placeholder:text-neutral-600 transition outline-none"
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="register-confirm-password"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder:text-neutral-600 transition outline-none"
              />
            </div>
          </div>

          {/* Membership Tier Note */}
          <div className="p-3 bg-[#0a0a0c] rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>Automatic Gold VIP tier access granted upon account activation.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          >
            {loading ? (
              <span>Creating VIP Account...</span>
            ) : (
              <>
                <span>Create VIP Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-neutral-800/80 text-center">
          <p className="text-xs text-neutral-400">
            Already have a VIP account?{' '}
            <Link
              to="/login"
              className="text-[#d4af37] font-semibold hover:text-[#f7e7ce] transition underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#d4af37] rounded"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
