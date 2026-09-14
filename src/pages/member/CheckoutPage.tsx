import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { firestoreService } from '../../services/firestoreService';
import { notificationService } from '../../services/notificationService';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  Banknote,
  Wallet,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { firebaseUser, userProfile } = useAuth();
  const { items, subtotal, tax, discount, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState<string>('VIP Table 3');
  const [loungeArea, setLoungeArea] = useState<string>('Main VIP Atrium');
  const [paymentMethod, setPaymentMethod] = useState<'lounge_cash' | 'card' | 'wallet'>('lounge_cash');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Guard against empty cart
  if (items.length === 0 && !orderSuccessId) {
    return (
      <MemberLayout title="Table Checkout" subtitle="VIP Lounge Ordering">
        <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-[#121216] border border-neutral-800 rounded-3xl p-8">
          <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="font-serif-luxury font-bold text-lg text-white">Your Cart is Empty</h3>
          <p className="text-xs text-neutral-400">
            Please select your hookahs or gourmet refreshments before proceeding to table checkout.
          </p>
          <Link
            to="/hookahs"
            className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black text-xs font-bold uppercase tracking-wider"
          >
            Explore Hookah Catalog
          </Link>
        </div>
      </MemberLayout>
    );
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      setErrorMsg('You must be logged in as an authenticated member to place orders.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        userId: firebaseUser.uid,
        tableNumber: `${tableNumber} (${loungeArea})${specialNotes ? ` - Notes: ${specialNotes}` : ''}`,
        items: [...items],
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        status: 'Preparing' as const,
      };

      const created = await firestoreService.createOrder(orderPayload);
      clearCart();
      setOrderSuccessId(created.id);
      notificationService.pushLocalNotification({
        title: 'Lounge Order Dispatched',
        message: `Order #${created.id.slice(-6).toUpperCase()} (Total Rs. ${total.toLocaleString()} PKR) has been sent to the hookah preparation station.`,
        type: 'order',
      });
    } catch (err) {
      console.error('[NOIR Checkout] Order creation error:', err);
      setErrorMsg('Failed to place order to lounge kitchen. Please contact your table host.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccessId) {
    return (
      <MemberLayout title="Order Confirmed" subtitle="Lounge Kitchen Dispatched">
        <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-8 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
              SESSION DISPATCHED
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Order #{orderSuccessId.slice(-6).toUpperCase()}
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
              Your hookah master and sommelier are preparing your selections for delivery to{' '}
              <strong className="text-white">{tableNumber}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 text-xs text-neutral-400 space-y-2">
            <div className="flex justify-between">
              <span>Delivery Location:</span>
              <span className="text-white font-semibold">{tableNumber} ({loungeArea})</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="text-white font-semibold capitalize">
                {paymentMethod === 'lounge_cash' ? 'Pay at Table (Cash / Card)' : paymentMethod === 'wallet' ? 'Member VIP Credit' : 'Card at Table'}
              </span>
            </div>
            <div className="flex justify-between font-mono font-bold text-[#d4af37] pt-2 border-t border-neutral-800">
              <span>Amount Due:</span>
              <span>Rs. {total.toLocaleString()} PKR</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/orders"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
            >
              Track Live in Order History
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs transition"
            >
              Return to Member Suite
            </Link>
          </div>
        </div>
      </MemberLayout>
    );
  }

  const displayName = userProfile?.name || firebaseUser?.displayName || firebaseUser?.email || '';

  return (
    <MemberLayout title="Table Checkout & Service Dispatch" subtitle="Member Privilege Service">
      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Member Information */}
          <div className="p-6 rounded-3xl bg-[#121216] border border-neutral-800 space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-white">Member Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={displayName}
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-neutral-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Registered Member Email</label>
                <input
                  type="text"
                  disabled
                  value={firebaseUser?.email || ''}
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-neutral-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Table / Lounge Seating */}
          <div className="p-6 rounded-3xl bg-[#121216] border border-neutral-800 space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-white">Lounge Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Select Table / Booth</label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="VIP Table 1">VIP Table 1 (Window Lounge)</option>
                  <option value="VIP Table 2">VIP Table 2 (Centerstage)</option>
                  <option value="VIP Table 3">VIP Table 3 (Chandelier Zone)</option>
                  <option value="VIP Booth A">VIP Booth A (Velvet Enclosure)</option>
                  <option value="VIP Booth B">VIP Booth B (Velvet Enclosure)</option>
                  <option value="Private Suite Obsidian">Private Suite Obsidian</option>
                  <option value="Skyline Terrace 4">Skyline Terrace Table 4</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-300 font-semibold block mb-1">Lounge Sector</label>
                <select
                  value={loungeArea}
                  onChange={(e) => setLoungeArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Main VIP Atrium">Main VIP Atrium</option>
                  <option value="Executive Mezannine">Executive Mezannine</option>
                  <option value="Noir Reserve Salon">Noir Reserve Salon</option>
                  <option value="Heated Outdoor Terrace">Heated Outdoor Terrace</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-neutral-300 font-semibold block mb-1 text-xs">
                Preparation Notes / Coal Refresh Timing
              </label>
              <textarea
                rows={2}
                placeholder="E.g., extra ice tip hose, light charcoal, bring beverages with appetizer..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl bg-[#121216] border border-neutral-800 space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-white">Payment Method</h3>
            <p className="text-xs text-neutral-400">
              Select how you would like to settle this session bill:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('lounge_cash')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                  paymentMethod === 'lounge_cash'
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                    : 'bg-[#0a0a0c] border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <div className="text-xs font-bold">Cash at Table</div>
                  <div className="text-[10px] text-neutral-400">Pay your lounge server</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                  paymentMethod === 'card'
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                    : 'bg-[#0a0a0c] border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <div className="text-xs font-bold">POS Terminal</div>
                  <div className="text-[10px] text-neutral-400">Wireless card terminal at table</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                  paymentMethod === 'wallet'
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                    : 'bg-[#0a0a0c] border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Wallet className="w-5 h-5 text-[#d4af37]" />
                <div>
                  <div className="text-xs font-bold">Member Tab</div>
                  <div className="text-[10px] text-neutral-400">Charge to member balance</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order Review & Confirm Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#121216] border border-[#d4af37]/30 space-y-6 shadow-2xl sticky top-28">
            <h3 className="font-serif-luxury font-bold text-lg text-white border-b border-neutral-800 pb-4">
              Session Order Summary
            </h3>

            {/* Items summary */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between items-start text-xs border-b border-neutral-800/60 pb-2">
                  <div>
                    <div className="text-white font-semibold">{it.quantity}x {it.item.name}</div>
                    {it.type === 'hookah' && it.selectedFlavor && (
                      <div className="text-[10px] text-neutral-400">
                        {it.selectedFlavor} • {it.selectedBase}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-neutral-200">
                    Rs. {(it.unitPrice * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-2 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount</span>
                  <span className="font-mono">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Lounge Tax (5%)</span>
                <span className="font-mono text-white">Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline text-base pt-3 border-t border-neutral-800">
                <span className="font-serif-luxury font-bold text-white">Grand Total</span>
                <span className="font-mono font-extrabold text-xl text-[#d4af37]">
                  Rs. {total.toLocaleString()} <span className="text-xs font-normal text-neutral-400">PKR</span>
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition"
            >
              {submitting ? (
                <span>Dispatching Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Table Order • Rs. {total.toLocaleString()}</span>
                </>
              )}
            </button>

            <div className="text-center">
              <Link to="/cart" className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Cart to Modify Items</span>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </MemberLayout>
  );
};
