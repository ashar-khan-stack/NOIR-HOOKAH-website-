import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestoreService';
import { Order } from '../../types';
import {
  Clock,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Wind,
  Utensils,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const OrdersHistoryPage: React.FC = () => {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const currentUid = firebaseUser?.uid;

  useEffect(() => {
    if (!currentUid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time order updates for current user
    const unsubscribe = firestoreService.onUserOrdersSnapshot(currentUid, (userOrders) => {
      setOrders(userOrders);
      setLoading(false);
    });

    // Also do an initial fetch
    firestoreService.getUserOrders(currentUid).then((initialList) => {
      setOrders(initialList);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUid]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
      case 'delivered':
      case 'Served':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
            {status}
          </span>
        );
      case 'Preparing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            Sommelier Preparing
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] font-bold uppercase tracking-wider">
            {status || 'Pending'}
          </span>
        );
    }
  };

  return (
    <MemberLayout title="Order History & Live Status" subtitle="Private Lounge Sessions">
      <div className="space-y-8 animate-fadeIn">
        {loading ? (
          <div className="py-20 text-center text-sm text-neutral-500 animate-pulse flex flex-col items-center gap-3">
            <Clock className="w-8 h-8 text-[#d4af37] animate-spin" />
            <span>Fetching member order records...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-[#121216]/60 border border-neutral-800 rounded-3xl p-8">
            <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-xl text-white">No Previous Orders</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              You have not placed any lounge orders under this member account yet. Explore our handcrafted hookahs and gourmet delights.
            </p>
            <div className="pt-2">
              <Link
                to="/hookahs"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
              >
                Order Hookah Experience
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-neutral-400 px-2">
              Showing {orders.length} order{orders.length > 1 ? 's' : ''} placed under your VIP account
            </div>

            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Recent Session';

              return (
                <div
                  key={order.id}
                  className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 rounded-3xl p-6 transition-all duration-300 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-white">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {dateStr} • <span className="text-neutral-300 font-medium">{order.tableNumber || 'VIP Table'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Amount</div>
                        <div className="text-lg font-mono font-bold text-[#d4af37]">
                          Rs. {order.total.toLocaleString()} PKR
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37] text-neutral-300 hover:text-white transition flex items-center gap-1 text-xs"
                      >
                        <span>{isExpanded ? 'Hide' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Breakdown */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-neutral-800/80 space-y-4 animate-fadeIn">
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                          Itemized Selections ({order.items?.length || 0})
                        </div>
                        <div className="divide-y divide-neutral-900 rounded-2xl bg-[#0a0a0c] border border-neutral-800/80 p-4">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex justify-between items-start text-xs first:pt-0 last:pb-0">
                              <div>
                                <div className="text-white font-semibold">
                                  {item.quantity}x {item.item.name}
                                </div>
                                {item.type === 'hookah' && item.selectedFlavor && (
                                  <div className="text-[11px] text-neutral-400 mt-0.5">
                                    Flavor: <strong className="text-neutral-200">{item.selectedFlavor}</strong> • Base: {item.selectedBase}
                                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                      <span className="text-[#d4af37] block">Add-ons: {item.selectedAddOns.join(', ')}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="font-mono text-neutral-200">
                                Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial Detail Breakdown */}
                      <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800/80 text-xs space-y-1.5 max-w-sm ml-auto">
                        <div className="flex justify-between text-neutral-400">
                          <span>Subtotal</span>
                          <span className="font-mono text-white">Rs. {order.subtotal?.toLocaleString() ?? order.total.toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>VIP Discount</span>
                            <span className="font-mono">-Rs. {order.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-neutral-400">
                          <span>Lounge Tax (5%)</span>
                          <span className="font-mono text-white">Rs. {order.tax?.toLocaleString() ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold pt-2 border-t border-neutral-800">
                          <span>Settlement Method</span>
                          <span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'Lounge Tab'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
