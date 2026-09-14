import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  Bell,
  Send,
  CheckCircle2,
  Users,
  Shield,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  targetAudience: string;
  type: string;
  createdAt: string;
}

export const AdminNotificationsPage: React.FC = () => {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Broadcast Form
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All VIPs' | 'Noir Reserve' | 'Black VIP' | 'Gold VIP'>('All VIPs');
  const [type, setType] = useState<'Announcement' | 'Privilege' | 'Tasting' | 'Floor'>('Announcement');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLogs = async () => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(15));
      const snap = await getDocs(q);
      const list: NotificationLog[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setLogs(list);
    } catch (err) {
      console.warn('[NOIR Admin] Notifications log query error (falling back):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        body,
        targetAudience,
        type,
        createdAt: new Date().toISOString(),
        read: false,
      });

      setFeedback({ type: 'success', text: `Broadcast dispatched to ${targetAudience}.` });
      setTitle('');
      setBody('');
      await fetchLogs();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error('[NOIR Admin] Notification dispatch failed:', err);
      setFeedback({ type: 'error', text: 'Broadcast failed: ' + (err?.message || 'Check Firestore rules.') });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout
      title="VIP Notifications & Broadcasts"
      subtitle="Dispatch executive announcements, exclusive tastings, and floor alerts to members"
    >
      <div className="space-y-6 animate-fadeIn max-w-5xl">
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dispatch Form Card */}
          <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 text-[#d4af37]">
              <Send className="w-5 h-5" />
              <h3 className="font-serif-luxury font-bold text-white text-base">
                Create Executive Dispatch
              </h3>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Broadcast Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Damascus Rose Harvest — Exclusive Reserve Tasting"
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e: any) => setTargetAudience(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All VIPs">All VIP Patrons</option>
                    <option value="Noir Reserve">Noir Reserve Only</option>
                    <option value="Black VIP">Black VIP & Above</option>
                    <option value="Gold VIP">Gold VIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Category</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Privilege">VIP Privilege</option>
                    <option value="Tasting">Private Tasting</option>
                    <option value="Floor">Floor Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-semibold">Notification Content</label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Detailed notification message visible in member suite..."
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Transmitting...' : 'Transmit Broadcast'}</span>
              </button>
            </form>
          </div>

          {/* Historical Broadcasts Log */}
          <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
              <Bell className="w-4 h-4 text-neutral-400" />
              <h3 className="font-serif-luxury font-bold text-white text-base">
                Recent Broadcast Dispatches
              </h3>
            </div>

            {loading ? (
              <LuxuryLoading message="Loading Dispatch Logs..." />
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                No recent notifications logged. Dispatches will appear here.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{log.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-[#d4af37] font-semibold">
                        {log.targetAudience}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{log.body}</p>
                    <div className="text-[9px] text-neutral-600 font-mono pt-1">
                      Sent: {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
