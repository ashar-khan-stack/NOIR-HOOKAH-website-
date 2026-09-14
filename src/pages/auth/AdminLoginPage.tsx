import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter your executive email and password.');
        setLoading(false);
        return;
      }

      await adminLogin(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      if (err?.message?.includes('custom claims')) {
        setErrorMsg('Access Denied: This account is authenticated but lacks server-verified Executive Custom Claims (admin: true, role: "ADMIN").');
      } else if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        setErrorMsg('Invalid executive credentials. Access restricted.');
      } else {
        setErrorMsg(err?.message || 'Executive authorization failed. Access restricted.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Lounge Executive Management" badge="Restricted Console">
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-[#8B0000]/20 border border-[#8B0000]/60 flex items-center justify-center text-rose-400 mx-auto mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Executive Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Authorized management credentials required for console access.
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Executive Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executive@noirhookah.com"
                className="w-full bg-[#070709] border border-neutral-700/80 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-neutral-600 transition outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
            >
              Executive Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          >
            {loading ? (
              <span>Verifying Claims...</span>
            ) : (
              <>
                <span>Authenticate Executive</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800/80 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-[#d4af37] transition font-medium focus:outline-none focus:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to VIP Member Suite</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
