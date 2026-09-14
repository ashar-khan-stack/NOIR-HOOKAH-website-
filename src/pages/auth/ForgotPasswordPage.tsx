import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter the email address linked to your VIP account.');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        setErrorMsg('No account found associated with this email address.');
      } else if (code === 'auth/invalid-email') {
        setErrorMsg('Please provide a valid email format.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg('Network error. Please check your connection and try again.');
      } else {
        setErrorMsg(err?.message || 'Failed to dispatch password reset link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Elevate the Night." badge="Security">
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Reset Password
          </h1>
          <p className="text-xs text-neutral-400">
            Enter your email to receive private password reset instructions.
          </p>
        </div>

        {success ? (
          <div className="space-y-5 animate-fadeIn">
            <div
              role="status"
              className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-200 text-xs sm:text-sm space-y-2 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-emerald-300 mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-white">Reset Link Dispatched</h2>
              <p className="text-emerald-300/90 text-xs">
                We have sent instructions to <strong className="text-white">{email}</strong>. Please check your inbox and spam folders.
              </p>
            </div>

            <Link
              to="/login"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Member Sign In</span>
            </Link>
          </div>
        ) : (
          <>
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
              <div className="space-y-1.5">
                <label
                  htmlFor="reset-email"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reset-email"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              >
                {loading ? (
                  <span>Dispatching Link...</span>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
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
                <span>Back to Member Sign In</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
