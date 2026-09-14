import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { Reservation } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Users,
  AlertCircle,
} from 'lucide-react';

const STATUSES: Array<'All' | Reservation['status']> = ['All', 'Confirmed', 'Pending', 'Cancelled'];

export const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Reservation['status']>('All');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = firestoreService.subscribeToAdminReservations((items) => {
      if (isMounted) {
        setReservations(items);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (id: string, status: Reservation['status']) => {
    setUpdatingId(id);
    try {
      await firestoreService.updateAdminReservationStatus(id, status);
    } catch (err) {
      console.error('[NOIR Admin] Reservation status update error:', err);
    } finally {
      setUpdatingId(null);
      setCancelModalId(null);
    }
  };

  const filtered = reservations.filter((r) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (r.name || '').toLowerCase().includes(q);
    const emailMatch = (r.email || '').toLowerCase().includes(q);
    const phoneMatch = (r.phone || '').includes(q);
    const idMatch = (r.id || '').toLowerCase().includes(q);
    const matchesSearch = nameMatch || emailMatch || phoneMatch || idMatch;

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Table & VIP Reservations"
      subtitle="Review member bookings, confirm sectors, and manage guest lounge capacity"
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Toolbar */}
        <div className="p-4 rounded-2xl bg-[#121216]/90 border border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by patron name, email, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-[#0a0a0c] border border-neutral-800 text-neutral-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#d4af37]"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LuxuryLoading message="Connecting Live Reservations Stream..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-3">
            <CalendarDays className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-white text-base">No Reservations Found</h3>
            <p className="text-xs text-neutral-400">
              {searchQuery || statusFilter !== 'All'
                ? 'No reservation matches your specified filters.'
                : 'No table bookings have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] bg-[#0a0a0c]">
                    <th className="py-3 px-4">Booking ID & Date</th>
                    <th className="py-3 px-4">Patron Contact</th>
                    <th className="py-3 px-4">Party & Sector</th>
                    <th className="py-3 px-4">Special Requests</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filtered.map((res) => (
                    <tr key={res.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="font-mono text-[#d4af37] font-bold">
                          {res.id}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {res.date} • {res.time}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-bold text-white">{res.name}</div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" />
                          <span>{res.email}</span>
                        </div>
                        {res.phone && (
                          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{res.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {res.guests} Guests
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {res.seatingPreference}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 max-w-xs truncate text-[11px]">
                        {res.specialRequest || 'None'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            res.status === 'Confirmed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : res.status === 'Cancelled'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {res.status !== 'Confirmed' && (
                          <button
                            disabled={updatingId === res.id}
                            onClick={() => handleStatusChange(res.id, 'Confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-[11px] font-semibold transition"
                          >
                            Confirm
                          </button>
                        )}
                        {res.status !== 'Pending' && (
                          <button
                            disabled={updatingId === res.id}
                            onClick={() => handleStatusChange(res.id, 'Pending')}
                            className="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 text-[11px] font-semibold transition"
                          >
                            Pending
                          </button>
                        )}
                        {res.status !== 'Cancelled' && (
                          <button
                            disabled={updatingId === res.id}
                            onClick={() => setCancelModalId(res.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 text-[11px] font-semibold transition"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {cancelModalId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-rose-900/60 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-serif-luxury font-bold text-white text-base">
                  Cancel Reservation
                </h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to cancel booking #{cancelModalId}? The member will see this reservation marked as Cancelled.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setCancelModalId(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold"
                >
                  Return
                </button>
                <button
                  onClick={() => handleStatusChange(cancelModalId, 'Cancelled')}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-lg"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
