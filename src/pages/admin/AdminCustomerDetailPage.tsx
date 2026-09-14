import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { User, Order, Reservation } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  ArrowLeft,
  Crown,
  Lock,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CalendarDays,
  Shield,
  Clock,
} from 'lucide-react';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const loadData = async () => {
      try {
        const userDoc = await firestoreService.getCustomerById(id);
        if (userDoc && isMounted) {
          setCustomer(userDoc);
          // Fetch user's orders and reservations
          const [userOrders, userReservations] = await Promise.all([
            firestoreService.getUserOrders(id),
            userDoc.email ? firestoreService.getUserReservations(userDoc.email) : Promise.resolve([]),
          ]);
          if (isMounted) {
            setOrders(userOrders);
            setReservations(userReservations);
          }
        }
      } catch (err) {
        console.error('[NOIR Admin] Customer detail load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="VIP Dossier" subtitle="Loading member record...">
        <LuxuryLoading message="Retrieving Member Dossier & Telemetry..." />
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout title="Member Not Found">
        <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-4">
          <p className="text-sm text-neutral-400">
            No registered member record matches ID: <span className="font-mono text-white">{id}</span>
          </p>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl text-xs"
          >
            Return to Member Directory
          </button>
        </div>
      </AdminLayout>
    );
  }

  const tier = customer.membershipTier || customer.tier || 'Gold VIP';

  return (
    <AdminLayout
      title={`VIP Dossier: ${customer.name || 'Member'}`}
      subtitle="Comprehensive profile, historical lounge orders, and table bookings"
      action={
        <button
          onClick={() => navigate('/admin/customers')}
          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Members</span>
        </button>
      }
    >
      <div className="space-y-8 animate-fadeIn max-w-5xl">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121216] via-[#1a1a24] to-[#0a0a0c] border border-[#d4af37]/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7e7ce] to-[#aa820a] p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                <Crown className="w-8 h-8" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f7e7ce] text-[10px] uppercase font-bold tracking-widest">
                  {tier}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  UID: {customer.id}
                </span>
              </div>
              <h2 className="text-2xl font-serif-luxury font-bold text-white">
                {customer.name || 'Anonymous VIP Patron'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  {customer.email || 'No email'}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    {customer.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 min-w-[200px] text-right">
            <div className="text-xs text-neutral-400">Loyalty Balance</div>
            <div className="text-2xl font-mono font-bold text-[#d4af37]">
              {(customer.loyaltyPoints ?? 0).toLocaleString()} PTS
            </div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-end gap-1">
              <Lock className="w-3 h-3" />
              <span>Tamper-Protected Record</span>
            </div>
          </div>
        </div>

        {/* Security & Access Protection Notice */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-3">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Admin Security Policy: Member tier status and points balances are validated against server-side audit logs. Client-side mutations of protected fields are strictly blocked by Firestore security rules.
          </span>
        </div>

        {/* Member Order History */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-rose-400" />
              <h3 className="font-serif-luxury font-bold text-white text-base">
                Historical Orders ({orders.length})
              </h3>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              This member has not yet placed any table orders in the lounge.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Table</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-neutral-300 font-semibold">
                        Table {order.tableNumber || 'VIP'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#d4af37]">
                        Rs. {(order.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-900 border border-neutral-800 text-neutral-300">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="text-[#d4af37] hover:underline text-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Member Reservation History */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif-luxury font-bold text-white text-base">
                Table Reservations ({reservations.length})
              </h3>
            </div>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No historical reservations recorded for this member.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Party Size</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {res.id}
                      </td>
                      <td className="py-3 px-3 text-neutral-300">
                        {res.date} • {res.time}
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {res.seatingPreference}
                      </td>
                      <td className="py-3 px-3 font-mono text-white">
                        {res.guests} Guests
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
