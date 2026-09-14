import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Clock,
  Coins,
  Server,
  AlertTriangle,
  Key,
  CheckCircle2,
  Sliders,
  User,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { firebaseUser } = useAuth();
  const [claims, setClaims] = useState<any>(null);

  useEffect(() => {
    const fetchTokenResult = async () => {
      if (firebaseUser?.getIdTokenResult) {
        try {
          const result = await firebaseUser.getIdTokenResult();
          setClaims(result.claims);
        } catch (e) {
          console.error('[NOIR Admin] Token claims inspection error:', e);
        }
      }
    };
    fetchTokenResult();
  }, [firebaseUser]);

  return (
    <AdminLayout
      title="System Security & Parameters"
      subtitle="Operational compliance, security assertions, and lounge financial standards"
    >
      <div className="space-y-6 animate-fadeIn max-w-5xl">
        {/* Security Compliance Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#121216] to-[#0a0a0c] border border-emerald-800/60 shadow-xl space-y-3">
          <div className="flex items-center gap-3 text-emerald-400">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <h3 className="font-serif-luxury font-bold text-white text-base">
              Production Security Verification
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Custom Claims</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Enforces <span className="text-white font-mono">admin === true</span> & <span className="text-white font-mono">role === 'ADMIN'</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Key Exposure</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                No Admin SDK credentials or service-account JSON in client bundle.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Inactivity Guard</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Strict 30-minute session inactivity timer terminates idle sessions.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Firestore Rules</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Restricted catalog and order mutations to verified administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Lounge Operating Parameters */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 text-[#d4af37]">
            <Sliders className="w-5 h-5" />
            <h3 className="font-serif-luxury font-bold text-white text-base">
              Lounge Operational Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Lounge Currency</span>
                <span className="font-mono font-bold text-[#d4af37]">PKR (Rs.)</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Standard currency for all transactions. Foreign currency denominations are strictly prohibited.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Lounge Hospitality Tax</span>
                <span className="font-mono font-bold text-white">16.0%</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Applied automatically to order subtotal during table checkout calculation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Operating Hours</span>
                <span className="font-mono font-bold text-white">18:00 — 04:00 PKT</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Nightly VIP service hours. Reservations outside these bounds require executive approval.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Coal Replacement Cycle</span>
                <span className="font-mono font-bold text-rose-400">45 Minutes</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Automated alert prompt for coal runner refresh during active table sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Current Authenticated Admin Identity */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 text-neutral-300">
            <User className="w-5 h-5 text-neutral-400" />
            <h3 className="font-serif-luxury font-bold text-white text-base">
              Active Executive Session
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">Executive Email</span>
              <div className="text-white font-semibold truncate">{firebaseUser?.email || 'N/A'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">User UID</span>
              <div className="text-neutral-300 truncate">{firebaseUser?.uid || 'N/A'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">Claims Audit</span>
              <div className="text-emerald-400 font-bold">
                {claims?.admin && claims?.role === 'ADMIN'
                  ? 'VERIFIED EXECUTIVE'
                  : 'ROLE: ' + (claims?.role || 'EXECUTIVE')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
