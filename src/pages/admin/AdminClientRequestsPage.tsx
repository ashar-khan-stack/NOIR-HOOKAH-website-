import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services/firestoreService';
import { ClientRequest } from '../../types';
import { SEOHead } from '../../components/common/SEOHead';
import { Search, Filter, ShieldCheck, X, Check } from 'lucide-react';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';

export const AdminClientRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Details Modal
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsub = firestoreService.subscribeToAllClientRequests((data) => {
      setRequests(data);
      setLoading(false);
      // Update selected request if it changes
      setSelectedRequest(prev => prev ? data.find(r => r.id === prev.id) || null : null);
    });
    return () => unsub();
  }, []);

  const filteredRequests = requests.filter(req => {
    if (statusFilter !== 'All' && req.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        req.userName.toLowerCase().includes(q) ||
        req.userEmail.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = async (status: ClientRequest['status']) => {
    if (!selectedRequest) return;
    
    // Require confirmation for Approve/Reject
    if (status === 'APPROVED' || status === 'REJECTED') {
      const confirmed = window.confirm(`Are you sure you want to mark this request as ${status}?`);
      if (!confirmed) return;
    }

    setUpdating(true);
    try {
      await firestoreService.updateClientRequestStatus(
        selectedRequest.id,
        status,
        adminResponse.trim() || undefined,
        'Admin' // In a full implementation, we'd use the actual admin's name/ID
      );
      
      // Notify customer using the existing global notification system
      // We create a document in the 'notifications' collection that applies globally,
      // but maybe we should ideally create a user-specific one. 
      // The instructions say "Use the EXISTING notification system. Do NOT create a second notification architecture."
      // Since existing notifications are global, we'll create one that only targets this user by mentioning them or we'll just create a notification document.
      // Wait, there's no "userId" field in NotificationItem currently. It just broadcasts.
      // Let's add it to the title maybe, or if the system doesn't support user-targeted notifications, 
      // the instruction said "When request is SUBMITTED: Notify Admin... Use the EXISTING notification system."
      // I will just create a notification item.
      await firestoreService.createNotification({
        title: 'Client Request Update',
        message: `Request for ${selectedRequest.userName} is now ${status}.`,
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'announcement'
      });
      
      if (status !== 'UNDER REVIEW') {
        setSelectedRequest(null);
        setAdminResponse('');
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="px-2.5 py-1 rounded-full border border-green-400/20 bg-green-400/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">Approved</span>;
      case 'REJECTED': return <span className="px-2.5 py-1 rounded-full border border-red-400/20 bg-red-400/10 text-red-400 text-[10px] font-bold uppercase tracking-wider">Rejected</span>;
      case 'UNDER REVIEW': return <span className="px-2.5 py-1 rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">Under Review</span>;
      default: return <span className="px-2.5 py-1 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">Pending</span>;
    }
  };

  if (loading) {
    return <LuxuryLoading message="Loading client requests..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <SEOHead title="Client Appeals | NOIR Admin" />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-tight">Client Requests</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage VIP and Premium membership applications.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121216] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#d4af37] focus:outline-none transition"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#121216] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white appearance-none focus:border-[#d4af37] focus:outline-none transition"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <Filter className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#121216] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0c] border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Request Type</th>
                <th className="p-4 font-semibold">Preference</th>
                <th className="p-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-neutral-500">
                    No client requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => {
                      setSelectedRequest(req);
                      setAdminResponse(req.adminResponse || '');
                    }}
                    className="hover:bg-neutral-800/20 transition cursor-pointer group"
                  >
                    <td className="p-4 text-xs text-neutral-400 whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-sm text-white group-hover:text-[#d4af37] transition-colors">{req.userName}</div>
                      <div className="text-xs text-neutral-500">{req.userEmail}</div>
                    </td>
                    <td className="p-4 text-sm text-neutral-300">{req.requestType}</td>
                    <td className="p-4 text-sm text-neutral-400">{req.membershipPreference}</td>
                    <td className="p-4 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121216] border border-[#d4af37]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#121216]/95 backdrop-blur-md border-b border-neutral-800 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                  Request Details
                </h2>
                <div className="text-xs text-neutral-400 mt-1 font-mono">ID: {selectedRequest.id}</div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Customer</div>
                  <div className="text-sm text-white font-semibold">{selectedRequest.userName}</div>
                  <div className="text-sm text-neutral-400">{selectedRequest.userEmail}</div>
                  <div className="text-sm text-neutral-400">{selectedRequest.userPhone}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Status</div>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  <div className="text-xs text-neutral-500 mt-2">
                    Submitted: {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Request Type</div>
                  <div className="text-sm text-white">{selectedRequest.requestType}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Preferred Tier</div>
                  <div className="text-sm text-[#d4af37] font-semibold">{selectedRequest.membershipPreference}</div>
                </div>
              </div>

              {/* Text Areas */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">Reason</div>
                  <div className="bg-[#0a0a0c] border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 leading-relaxed">
                    {selectedRequest.reason}
                  </div>
                </div>

                {selectedRequest.additionalNote && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">Additional Note</div>
                    <div className="bg-[#0a0a0c] border border-neutral-800 rounded-xl p-4 text-sm text-neutral-400 italic">
                      {selectedRequest.additionalNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Action Area */}
              <div className="border-t border-neutral-800 pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">
                    Admin Response (Sent to customer)
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Enter response message..."
                    rows={3}
                    className="w-full bg-[#0a0a0c] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedRequest.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus('UNDER REVIEW')}
                      disabled={updating}
                      className="flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition disabled:opacity-50"
                    >
                      Mark Under Review
                    </button>
                  )}
                  
                  {selectedRequest.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateStatus('APPROVED')}
                      disabled={updating}
                      className="flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-green-500/30 text-green-400 hover:bg-green-500/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  )}

                  {selectedRequest.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateStatus('REJECTED')}
                      disabled={updating}
                      className="flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
