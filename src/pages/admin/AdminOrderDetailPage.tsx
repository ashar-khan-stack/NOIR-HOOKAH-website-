import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { Order } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  ArrowLeft,
  ShoppingBag,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const loadOrder = async () => {
      try {
        const data = await firestoreService.getOrderById(id);
        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('[NOIR Admin] Order fetch error:', err);
        if (isMounted) setLoading(false);
      }
    };

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (!order) return;
    setUpdating(true);
    try {
      await firestoreService.updateAdminOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
      setFeedback(`Status changed to ${newStatus}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Order update error:', err);
      setFeedback('Status update failed: ' + err?.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Dossier" subtitle="Loading order details...">
        <LuxuryLoading message="Retrieving Order Dossier..." />
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Not Found">
        <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-4">
          <p className="text-sm text-neutral-400">
            No order record matching ID: <span className="font-mono text-white">{id}</span>
          </p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl text-xs"
          >
            Return to Orders Console
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Order Dossier #${order.id.slice(-6).toUpperCase()}`}
      subtitle="Complete table session specifications, preparations, and dispatch status"
      action={
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </button>
      }
    >
      <div className="space-y-6 animate-fadeIn max-w-5xl">
        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Top Status & Dispatch Bar */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono">
                Order ID: {order.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
            </div>
            <div className="text-sm font-semibold text-white">
              Table {order.tableNumber || 'VIP'} • Sector: {order.loungeSector || 'Main Velvet Room'}
            </div>
            <div className="text-xs text-neutral-500">
              Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Live'}
            </div>
          </div>

          {/* Operational Quick Dispatch Action */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium mr-1">Change Status:</span>
            {(['Pending', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                disabled={updating || order.status === st}
                onClick={() => handleStatusUpdate(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  order.status === st
                    ? 'bg-[#d4af37] text-black font-bold shadow-md cursor-default'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Coal & Preparation Information */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-rose-900/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <Flame className="w-5 h-5" />
            <h3 className="font-serif-luxury font-bold text-white text-base">
              Lounge Coal & Sommelier Preparation
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
              <div className="text-neutral-500 text-[10px] uppercase font-bold">Coal Routine</div>
              <div className="text-white font-semibold mt-1">
                {order.coalTiming || 'Natural Coconut Charcoal (3 cubes, purged)'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
              <div className="text-neutral-500 text-[10px] uppercase font-bold">Preparation Notes</div>
              <div className="text-white font-semibold mt-1">
                {order.preparationNotes || 'Standard premium pack, heat management active'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
              <div className="text-neutral-500 text-[10px] uppercase font-bold">Payment Method</div>
              <div className="text-[#d4af37] font-semibold mt-1 uppercase font-mono">
                {order.paymentMethod === 'card' ? 'Card on Table' : order.paymentMethod === 'wallet' ? 'VIP Balance' : 'Cash on Service'}
              </div>
            </div>
          </div>
        </div>

        {/* Items Breakdown */}
        <div className="p-6 rounded-3xl bg-[#121216]/90 border border-neutral-800 space-y-4 shadow-xl">
          <h3 className="font-serif-luxury font-bold text-white text-base pb-3 border-b border-neutral-800">
            Ordered Line Items ({order.items?.length || 0})
          </h3>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#d4af37] shrink-0">
                    {item.type === 'hookah' ? (
                      <Flame className="w-5 h-5" />
                    ) : (
                      <UtensilsCrossed className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {item.item?.name || 'Hookah Session'}
                    </div>
                    {item.selectedFlavor && (
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Flavor: <span className="text-[#d4af37]">{item.selectedFlavor}</span>
                      </div>
                    )}
                    {item.selectedStrength && (
                      <div className="text-xs text-neutral-500">
                        Strength: {item.selectedStrength} • Base: {item.selectedBase || 'Spring Water'}
                      </div>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <div className="text-xs text-neutral-500">
                        Add-ons: {item.selectedAddOns.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                  <div className="text-neutral-400">
                    Qty: <span className="text-white font-mono font-bold">{item.quantity}</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-white font-bold">
                      Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      (Rs. {item.unitPrice.toLocaleString()} each)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-neutral-800 space-y-2 max-w-xs ml-auto text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>Rs. {(order.subtotal || 0).toLocaleString()}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex items-center justify-between text-neutral-400">
                <span>Lounge Tax (16%)</span>
                <span>Rs. {order.tax.toLocaleString()}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>VIP Privilege Discount</span>
                <span>- Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm font-bold text-[#d4af37] pt-2 border-t border-neutral-800">
              <span>Grand Total</span>
              <span>Rs. {(order.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
