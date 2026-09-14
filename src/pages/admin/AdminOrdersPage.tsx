import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { Order } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  ShoppingBag,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';

const STATUSES: Array<'All' | Order['status']> = [
  'All',
  'Pending',
  'Preparing',
  'Ready',
  'Served',
  'Completed',
  'Cancelled',
];

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
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

  const handleQuickStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      await firestoreService.updateAdminOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('[NOIR Admin] Quick status change error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const idMatch = o.id.toLowerCase().includes(query);
    const tableMatch = (o.tableNumber || '').toLowerCase().includes(query);
    const userMatch = (o.userId || '').toLowerCase().includes(query);
    const matchesSearch = idMatch || tableMatch || userMatch;

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Lounge Orders Master"
      subtitle="Track, audit, and dispatch table orders with real-time status synchronization"
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Toolbar */}
        <div className="p-4 rounded-2xl bg-[#121216]/90 border border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by Order ID, Table #, or User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400">Filter:</span>
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

        {/* Orders Table */}
        {loading ? (
          <LuxuryLoading message="Connecting Live Orders Stream..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-3">
            <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-white text-base">No Orders Found</h3>
            <p className="text-xs text-neutral-400">
              {searchQuery || statusFilter !== 'All'
                ? 'No lounge orders match your current filter parameters.'
                : 'No table orders have been registered in the system yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] bg-[#0a0a0c]">
                    <th className="py-3 px-4">Order Details</th>
                    <th className="py-3 px-4">Table & Sector</th>
                    <th className="py-3 px-4">Items Breakdown</th>
                    <th className="py-3 px-4">Payment & Total</th>
                    <th className="py-3 px-4">Status & Dispatch</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="font-mono font-bold text-[#d4af37]">
                          #{order.id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">Table {order.tableNumber || 'VIP'}</div>
                        <div className="text-[10px] text-neutral-400">
                          Sector: {order.loungeSector || 'Main Lounge'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="text-neutral-200 font-medium">
                          {order.items?.length || 1} distinct item(s)
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-xs">
                          {order.items?.map((i) => i.item?.name || 'Hookah Session').join(', ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-[#d4af37] font-bold text-sm">
                          Rs. {(order.total || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neutral-500 uppercase font-sans">
                          {order.paymentMethod === 'card' ? 'Credit / Debit Card' : order.paymentMethod === 'wallet' ? 'VIP Wallet' : 'Lounge Cash'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={updatingId === order.id}
                            value={order.status}
                            onChange={(e: any) => handleQuickStatusChange(order.id, e.target.value)}
                            className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 border bg-[#0a0a0c] cursor-pointer focus:outline-none ${
                              order.status === 'Completed' || order.status === 'delivered'
                                ? 'border-emerald-800 text-emerald-400'
                                : order.status === 'Preparing'
                                ? 'border-rose-800 text-rose-400'
                                : order.status === 'Ready'
                                ? 'border-cyan-800 text-cyan-400'
                                : order.status === 'Cancelled'
                                ? 'border-neutral-700 text-neutral-500'
                                : 'border-amber-800 text-amber-400'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Served">Served</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {updatingId === order.id && (
                            <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-[#d4af37] animate-spin" />
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/50 text-neutral-300 hover:text-white text-xs inline-flex items-center gap-1 transition"
                        >
                          <span>Dossier</span>
                          <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
