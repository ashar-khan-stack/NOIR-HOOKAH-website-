import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestoreService';
import { ClientRequest } from '../../types';
import { SEOHead } from '../../components/common/SEOHead';
import { ShieldCheck, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';

export const ClientAppealPage: React.FC = () => {
  const { firebaseUser, userProfile } = useAuth();
  
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [requestType, setRequestType] = useState('VIP Membership');
  const [membershipPreference, setMembershipPreference] = useState('Gold VIP');
  const [reason, setReason] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');

  useEffect(() => {
    if (!firebaseUser) return;
    
    const unsub = firestoreService.subscribeToUserClientRequests(firebaseUser.uid, (data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => unsub();
  }, [firebaseUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !userProfile) return;
    
    setError('');
    setSuccess('');

    // Check for existing pending request
    const hasPending = requests.some(r => r.status === 'PENDING' || r.status === 'UNDER REVIEW');
    if (hasPending) {
      setError('You already have a request currently pending or under review.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for your request.');
      return;
    }

    setSubmitting(true);
    try {
      await firestoreService.createClientRequest({
        userId: firebaseUser.uid,
        userName: userProfile.name,
        userEmail: firebaseUser.email || '',
        userPhone: userProfile.phone || '',
        requestType,
        membershipPreference,
        reason: reason.trim(),
        additionalNote: additionalNote.trim(),
        status: 'PENDING'
      });
      setSuccess('Your request has been sent to the NOIR team for review.');
      setReason('');
      setAdditionalNote('');
    } catch (err: any) {
      console.error('Failed to submit client appeal:', err);
      setError('Unable to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'UNDER REVIEW': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/20';
    }
  };

  if (loading) {
    return <LuxuryLoading message="Loading your requests..." />;
  }

  const hasPending = requests.some(r => r.status === 'PENDING' || r.status === 'UNDER REVIEW');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <SEOHead title="Become a NOIR Client | NOIR HOOKAH" />

      <header className="space-y-2">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Client <span className="text-gold-gradient">Requests</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Request elevated VIP membership or special corporate privileges. All requests are personally reviewed by NOIR executive management.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="bg-[#121216] border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#8c721e]" />
            <h2 className="text-lg font-serif-luxury font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              Submit Request
            </h2>

            {hasPending ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <Clock className="w-12 h-12 text-[#d4af37]/50" />
                <div>
                  <h3 className="text-white font-semibold mb-1">Request in Progress</h3>
                  <p className="text-xs text-neutral-400">
                    You currently have a request pending review. Please wait for our team to respond before submitting another.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-green-200">{success}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Request Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition"
                  >
                    <option value="VIP Membership">VIP Membership</option>
                    <option value="Premium Membership">Premium Membership</option>
                    <option value="Corporate / Private Client">Corporate / Private Client</option>
                    <option value="Special Client Request">Special Client Request</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Preferred Membership
                  </label>
                  <select
                    value={membershipPreference}
                    onChange={(e) => setMembershipPreference(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition"
                  >
                    <option value="Gold VIP">Gold VIP</option>
                    <option value="Black VIP">Black VIP</option>
                    <option value="Noir Reserve">Noir Reserve</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Reason for Request *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly explain why you would like to join the VIP circle..."
                    rows={3}
                    required
                    className="w-full bg-[#0a0a0c] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Additional Note (Optional)
                  </label>
                  <textarea
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Any specific requests or requirements..."
                    rows={2}
                    className="w-full bg-[#0a0a0c] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] text-[#0a0a0c] bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] hover:brightness-110 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                  {!submitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: History */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif-luxury font-bold text-white mb-2">Request History</h2>
          
          {requests.length === 0 ? (
            <div className="bg-[#121216]/50 border border-neutral-800/50 rounded-2xl p-8 text-center">
              <p className="text-sm text-neutral-500">No requests submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-[#121216] border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-semibold text-sm">{req.requestType}</h4>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {new Date(req.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>

                  {req.adminResponse && (
                    <div className="mt-2 bg-[#0a0a0c] border border-neutral-800 rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold mb-1">
                        NOIR Team Response
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {req.adminResponse}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
