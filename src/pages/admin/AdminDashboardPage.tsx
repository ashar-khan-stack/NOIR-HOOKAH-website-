import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { Order, Reservation, User } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  ShoppingBag,
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Crown,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        const users = await firestoreService.getAdminCustomers();
        if (isMounted) {
          setCustomers(users);
        }
      } catch (e: any) {
        console.warn('[NOIR Admin] Customer fetch warning:', e);
      }
    };

    loadCustomers();

    // Subscribe to real-time orders
    const unsubscribeOrders = firestoreService.subscribeToAdminOrders((items) => {
      if (isMounted) {
        setOrders(items);
        setLoading(false);
      }
    });

    // Subscribe to real-time reservations
    const unsubscribeReservations = firestoreService.subscribeToAdminReservations((items) => {
      if (isMounted) {
        setReservations(items);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeOrders();
      unsubscribeReservations();
    };
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Executive Overview" subtitle="Real-time Operational Telemetry">
        <LuxuryLoading message="Synchronizing Live Operational Telemetry..." />
      </AdminLayout>
    );
  }

  // Calculate Real Telemetry
  const todayStr = new Date().toISOString().split('T')[0];

  const todayOrders = orders.filter((o) => o.createdAt?.startsWith(todayStr));
  const todaySales = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;
  const readyOrders = orders.filter((o) => o.status === 'Ready').length;
  const servedOrders = orders.filter((o) => o.status === 'Served').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed' || o.status === 'delivered').length;

  const todayReservations = reservations.filter((r) => r.date === todayStr);
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;
  const confirmedReservations = reservations.filter((r) => r.status === 'Confirmed').length;

  const totalMembers = customers.length;
  const goldMembers = customers.filter(
    (c) => c.membershipTier === 'Gold VIP' || c.tier === 'Gold VIP'
  ).length;
  const blackMembers = customers.filter(
    (c) => c.membershipTier === 'Black VIP' || c.tier === 'Black VIP'
  ).length;
  const noirReserveMembers = customers.filter(
    (c) => c.membershipTier === 'Noir Reserve' || c.tier === 'Noir Reserve'
  ).length;

  return (
    <AdminLayout
      title="Executive Operations Control"
      subtitle="Real-time lounge activity, orders, reservations, and member telemetry"
      action={
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Firestore Sync
          </span>
        </div>
      }
    >
      <div className="space-y-8 animate-fadeIn">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Today's Sales */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-[#d4af37]/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Today's Lounge Sales</span>
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                Rs. {todaySales.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Lifetime Sales: Rs. {totalSales.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Orders Today & Total */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Today's Orders</span>
              <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                {todayOrders.length}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Total Orders Logged: {orders.length}
              </div>
            </div>
          </div>

          {/* Today's Reservations */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Today's Reservations</span>
              <div className="w-8 h-8 rounded-lg bg-amber-950/60 text-amber-400 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                {todayReservations.length}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Pending: {pendingReservations} • Confirmed: {confirmedReservations}
              </div>
            </div>
          </div>

          {/* VIP Registry Count */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>VIP Members</span>
              <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-300 flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                {totalMembers}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Noir Reserve: {noirReserveMembers} • Black: {blackMembers}
              </div>
            </div>
          </div>
        </div>

        {/* Operational Status Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <h2 className="font-serif-luxury font-bold text-white text-base">
                  Real-time Order Workflow
                </h2>
              </div>
              <button
                onClick={() => navigate('/admin/lounge')}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Live Lounge Board</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0a0a0c] border border-neutral-800/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-amber-400">Pending</div>
                <div className="text-xl font-mono font-bold text-white">{pendingOrders}</div>
                <div className="text-[9px] text-neutral-500">Awaiting coal master</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0a0c] border border-rose-900/40 space-y-1">
                <div className="text-[10px] uppercase font-bold text-rose-400">Preparing</div>
                <div className="text-xl font-mono font-bold text-white">{preparingOrders}</div>
                <div className="text-[9px] text-neutral-500">Coals heating / packing</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0a0c] border border-emerald-900/40 space-y-1">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Ready</div>
                <div className="text-xl font-mono font-bold text-white">{readyOrders}</div>
                <div className="text-[9px] text-neutral-500">Ready for table delivery</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0a0c] border border-neutral-800/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-neutral-300">Served</div>
                <div className="text-xl font-mono font-bold text-white">{servedOrders}</div>
                <div className="text-[9px] text-neutral-500">Active table session</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0a0c] border border-neutral-800/80 space-y-1 sm:col-span-2">
                <div className="text-[10px] uppercase font-bold text-neutral-400">Completed</div>
                <div className="text-xl font-mono font-bold text-white">{completedOrders}</div>
                <div className="text-[9px] text-neutral-500">Settled and closed sessions</div>
              </div>
            </div>
          </div>

          {/* Membership Breakdown */}
          <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#d4af37]" />
                <h2 className="font-serif-luxury font-bold text-white text-base">
                  VIP Membership Tiers
                </h2>
              </div>
              <button
                onClick={() => navigate('/admin/customers')}
                className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Manage Members</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Noir Reserve */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0a0c] border border-[#d4af37]/40">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                  <div>
                    <div className="text-xs font-bold text-white">Noir Reserve</div>
                    <div className="text-[10px] text-neutral-400">Ultra-exclusive invite-only tier</div>
                  </div>
                </div>
                <div className="text-lg font-mono font-bold text-[#d4af37]">{noirReserveMembers}</div>
              </div>

              {/* Black VIP */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0a0c] border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Black VIP</div>
                    <div className="text-[10px] text-neutral-400">High frequency lounge members</div>
                  </div>
                </div>
                <div className="text-lg font-mono font-bold text-white">{blackMembers}</div>
              </div>

              {/* Gold VIP */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0a0c] border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-white">Gold VIP</div>
                    <div className="text-[10px] text-neutral-400">Standard registered members</div>
                  </div>
                </div>
                <div className="text-lg font-mono font-bold text-white">{goldMembers}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Orders Quick Feed */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h2 className="font-serif-luxury font-bold text-white text-base">
              Recent Live Orders
            </h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              No orders have been recorded in the lounge registry yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Table</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3 px-3 font-mono text-neutral-300 font-bold">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 text-white font-semibold">
                        Table {order.tableNumber || 'VIP'}
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {order.items?.length || 1} item(s)
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#d4af37]">
                        Rs. {(order.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'Completed' || order.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.status === 'Preparing'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : order.status === 'Ready'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition text-[11px]"
                        >
                          Inspect
                        </button>
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
