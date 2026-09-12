import React, { useState, useEffect } from 'react';
import { PageRoute, CartItem, Order, User } from '../types';
import { cartService } from '../services/cartService';
import { analytics } from '../services/analyticsService';
import { notificationService } from '../services/notificationService';
import { CreditCard, DollarSign, Wallet, CheckCircle2, ArrowLeft, Gift, ShieldCheck } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: PageRoute) => void;
  currentUser: User | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, currentUser }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'lounge_cash' | 'wallet'>('lounge_cash');
  const [tableNumber, setTableNumber] = useState('Table 12 (VIP Lounge)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setItems(cartService.getItems());
  }, []);

  const { subtotal, tax, discount, total } = cartService.getTotal(discountCode);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    analytics.trackCheckoutStart();

    const order = cartService.createOrder(
      currentUser?.id || 'guest',
      tableNumber,
      paymentMethod,
      discountCode
    );

    setCompletedOrder(order);
    setLoading(false);

    analytics.trackCheckoutComplete(order.id, order.total);
    notificationService.pushLocalNotification(
      'Order Placed Successfully',
      `Order #${order.id} total Rs. ${order.total.toLocaleString()} sent to lounge staff for ${tableNumber}.`,
      'order'
    );
  };

  if (completedOrder) {
    return (
      <div id="checkout-completed" className="pt-24 pb-20 max-w-xl mx-auto px-4 space-y-6 text-center animate-fadeIn">
        <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
              ORDER CONFIRMED #{completedOrder.id}
            </span>
            <h1 className="text-2xl font-bold font-serif-luxury text-white">Your Order is Being Prepared</h1>
            <p className="text-xs text-neutral-300">
              Lounge staff will serve your hookah and items to <strong className="text-white">{completedOrder.tableNumber}</strong> shortly.
            </p>
          </div>

          <div className="bg-[#0a0a0c] border border-neutral-800 rounded-2xl p-4 text-xs text-left space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>Items:</span>
              <span className="text-white">{completedOrder.items.length} items</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Payment Method:</span>
              <span className="text-[#f7e7ce] uppercase font-semibold">{completedOrder.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
              <span>Total Amount:</span>
              <span className="text-[#d4af37]">Rs. {completedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page" className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <button
        onClick={() => onNavigate('menu')}
        className="text-xs uppercase tracking-widest text-[#d4af37] flex items-center gap-1 hover:text-[#f7e7ce]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Browsing Menu</span>
      </button>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif-luxury text-white">Checkout & Pre-Order</h1>
        <p className="text-xs text-neutral-400">Review your hookah selection and finalize table delivery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-[#121216] border border-neutral-800 p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] block mb-2">
              1. Table / Lounge Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Table 12 or VIP Suite 3"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] block mb-2">
              2. Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'lounge_cash', label: 'Pay at Table', icon: <DollarSign className="w-4 h-4" /> },
                { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'wallet', label: 'Mobile Wallet', icon: <Wallet className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === m.id
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f7e7ce] font-bold'
                      : 'border-neutral-800 bg-[#0a0a0c] text-neutral-400'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Promo Code or Gift Card
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="NOIRVIP10"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Processing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
          </button>
        </form>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-[#121216] border border-neutral-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white font-serif-luxury border-b border-neutral-800 pb-3">
            Selection Summary
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((cartItem) => (
              <div key={cartItem.id} className="flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-white">{cartItem.item.name}</div>
                  <div className="text-[10px] text-neutral-400">Qty: {cartItem.quantity}</div>
                </div>
                <div className="font-bold text-[#d4af37]">
                  Rs. {(cartItem.unitPrice * cartItem.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-800 pt-3 space-y-1.5 text-xs text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#f7e7ce]">
                <span>VIP Discount</span>
                <span>-Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Service Tax (5%)</span>
              <span>Rs. {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
              <span>Total Payable</span>
              <span className="text-[#d4af37]">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
