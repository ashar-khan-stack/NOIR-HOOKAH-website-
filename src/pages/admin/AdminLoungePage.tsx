import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { Order } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  UtensilsCrossed,
} from 'lucide-react';

export const AdminLoungePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = firestoreService.subscribeToAdminOrders((items) => {
      if (isMounted) {
        setOrders(items);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleAdvanceStatus = async (orderId: string, nextStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      await firestoreService.updateAdminOrderStatus(orderId, nextStatus);
    } catch (err) {
      console.error('[NOIR Admin] Lounge status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Lounge Operations Board" subtitle="Live dispatch console">
        <LuxuryLoading message="Connecting Lounge Floor Stream..." />
      </AdminLayout>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const readyOrders = orders.filter((o) => o.status === 'Ready');
  const servedOrders = orders.filter((o) => o.status === 'Served');

  return (
    <AdminLayout
      title="Lounge Floor Dispatch"
      subtitle="Fast-action Kanban workflow for coal masters, sommeliers, and lounge runners"
      action={
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Floor Sync
          </span>
        </div>
      }
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Column 1: Pending */}
          <div className="flex flex-col rounded-3xl bg-[#0a0a0c] border border-neutral-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="font-serif-luxury font-bold text-white text-sm">
                  1. Incoming / Pending
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-mono text-xs font-bold">
                {pendingOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-600 text-xs">
                  No pending queue.
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#121216] border border-amber-900/40 space-y-3 shadow-md hover:border-amber-700/60 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[#d4af37] font-bold text-xs">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <div className="text-sm font-bold text-white">
                          Table {order.tableNumber || 'VIP'}
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="text-xs text-neutral-300 space-y-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="truncate max-w-[170px]">{it.item?.name || 'Hookah'}</span>
                          <span className="font-mono text-neutral-500">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleAdvanceStatus(order.id, 'Preparing')}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Start Preparing</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Preparing */}
          <div className="flex flex-col rounded-3xl bg-[#0a0a0c] border border-neutral-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="font-serif-luxury font-bold text-white text-sm">
                  2. Active Prep / Coals
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 font-mono text-xs font-bold">
                {preparingOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {preparingOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-600 text-xs">
                  No sessions in prep.
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#121216] border border-rose-900/50 space-y-3 shadow-md hover:border-rose-700/60 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[#d4af37] font-bold text-xs">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <div className="text-sm font-bold text-white">
                          Table {order.tableNumber || 'VIP'}
                        </div>
                      </div>
                      <span className="text-[10px] text-rose-400 font-mono animate-pulse">
                        Heating Coals...
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#070709] border border-neutral-800 text-[10px] text-neutral-400">
                      Coals: Natural Coconut (3 cubes, purged)
                    </div>

                    <div className="text-xs text-neutral-300 space-y-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="truncate max-w-[170px]">{it.item?.name || 'Hookah'}</span>
                          <span className="font-mono text-neutral-500">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleAdvanceStatus(order.id, 'Ready')}
                      className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Ready for Delivery</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready */}
          <div className="flex flex-col rounded-3xl bg-[#0a0a0c] border border-neutral-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="font-serif-luxury font-bold text-white text-sm">
                  3. Ready for Runner
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {readyOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-600 text-xs">
                  No orders waiting for runner.
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#121216] border border-cyan-900/50 space-y-3 shadow-md hover:border-cyan-700/60 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[#d4af37] font-bold text-xs">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <div className="text-sm font-bold text-white">
                          Deliver to Table {order.tableNumber || 'VIP'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold">
                        READY
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300 space-y-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="truncate max-w-[170px]">{it.item?.name || 'Hookah'}</span>
                          <span className="font-mono text-neutral-500">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleAdvanceStatus(order.id, 'Served')}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Confirm Served at Table</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 4: Served / Active Sessions */}
          <div className="flex flex-col rounded-3xl bg-[#0a0a0c] border border-neutral-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="font-serif-luxury font-bold text-white text-sm">
                  4. Active Table Session
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold">
                {servedOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {servedOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-600 text-xs">
                  No active smoking sessions.
                </div>
              ) : (
                servedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#121216] border border-neutral-800 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[#d4af37] font-bold text-xs">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <div className="text-sm font-bold text-white">
                          Table {order.tableNumber || 'VIP'}
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        Smoking Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Total: Rs. {(order.total || 0).toLocaleString()}</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleAdvanceStatus(order.id, 'Completed')}
                      className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Settle & Close Session</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
