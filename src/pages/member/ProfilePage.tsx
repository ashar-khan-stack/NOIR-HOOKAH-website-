import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Crown,
  Sparkles,
  Shield,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  Lock,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userProfile, firebaseUser, logout, updateMemberProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>(userProfile?.name || firebaseUser?.displayName || '');
  const [phone, setPhone] = useState<string>(userProfile?.phone || '');
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tier = userProfile?.membershipTier || 'Gold VIP';
  const loyaltyPoints = userProfile?.loyaltyPoints ?? 0;
  const progressPercent = userProfile?.tierProgressPercent ?? Math.min(100, Math.round((loyaltyPoints % 2500) / 25));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await updateMemberProfile({
        name,
        phone,
      });
      setFeedback({ type: 'success', text: 'Member profile updated successfully.' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('[NOIR Profile] Update failed:', err);
      setFeedback({ type: 'error', text: 'Failed to update member profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <MemberLayout title="VIP Member Profile & Credentials" subtitle="Account Registry">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* VIP Status Card */}
        <div className="bg-gradient-to-br from-[#121216] via-[#1a1a24] to-[#0a0a0c] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7e7ce] to-[#aa820a] p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                  <Crown className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f7e7ce] text-[10px] uppercase font-bold tracking-widest">
                    {tier} Member
                  </span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-[9px] font-bold uppercase">
                      Admin Claim Verified
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-serif-luxury font-bold text-white">
                  {name || 'VIP Member'}
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  UID: {firebaseUser?.uid}
                </p>
              </div>
            </div>

            {/* Points & Progress Box */}
            <div className="p-4 rounded-2xl bg-[#0a0a0c]/80 border border-neutral-800 min-w-[220px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Loyalty Points</span>
                <span className="text-lg font-mono font-bold text-[#d4af37]">
                  {loyaltyPoints.toLocaleString()} PTS
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#f7e7ce] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Tier Progress</span>
                <span className="text-neutral-300 font-mono">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2 animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Safe Profile Information Form */}
        <form onSubmit={handleSaveProfile} className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-white">Personal Information</h3>
              <p className="text-xs text-neutral-400">
                Update your contact details for VIP lounge reservations and order receipts.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold block">Full Member Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord / Lady VIP"
                required
                className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-semibold block">Mobile Contact Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Email - Read-Only Protected */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Registered Email Address (Locked)</span>
              </label>
              <input
                type="email"
                disabled
                value={firebaseUser?.email || ''}
                className="w-full p-3 rounded-xl bg-[#0a0a0c]/60 border border-neutral-800 text-neutral-400 cursor-not-allowed"
              />
              <p className="text-[10px] text-neutral-500">
                Email address is managed securely through Firebase Authentication.
              </p>
            </div>

            {/* Membership Tier - Read-Only Protected */}
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Assigned Membership Tier (Locked)</span>
              </label>
              <input
                type="text"
                disabled
                value={tier}
                className="w-full p-3 rounded-xl bg-[#0a0a0c]/60 border border-neutral-800 text-[#d4af37] font-bold cursor-not-allowed"
              />
              <p className="text-[10px] text-neutral-500">
                Tiers unlock automatically as your verified lounge spend accumulates.
              </p>
            </div>
          </div>
        </form>

        {/* Security & Access Protection Section */}
        <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Shield className="w-5 h-5" />
            <h3 className="font-serif-luxury font-bold text-lg text-white">Privilege & Role Security</h3>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            In compliance with NOIR HOOKAH zero-trust security standards, administrative privileges and custom claims are validated server-side and cannot be self-elevated.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Account Role</div>
              <div className="text-sm font-bold text-white">{userProfile?.role || 'USER'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Security Rule Isolation</div>
              <div className="text-sm font-bold text-emerald-400">Strict UID Scoped</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-500">Inactivity Timeout</div>
              <div className="text-sm font-bold text-[#d4af37]">30-Minute Auto-Lock</div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-700/80 hover:text-rose-300 text-neutral-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of VIP Suite</span>
            </button>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};
