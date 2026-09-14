import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Wind,
  Utensils,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    cartCount,
    subtotal,
    tax,
    discount,
    total,
    discountCode,
    applyDiscountCode,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoMsg, setPromoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyDiscountCode(promoInput.trim());
    if (ok) {
      setPromoMsg({ type: 'success', text: `Voucher "${promoInput.toUpperCase()}" activated!` });
    } else {
      setPromoMsg({ type: 'error', text: 'Invalid voucher code. Try "NOIRVIP10"' });
    }
  };

  return (
    <MemberLayout title="Your Lounge Selection" subtitle="Member Cart">
      <div className="space-y-8 animate-fadeIn">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-6 max-w-lg mx-auto bg-[#121216]/60 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif-luxury font-bold text-white">Your Cart is Empty</h2>
              <p className="text-xs text-neutral-400">
                Explore our bohemian crystal hookahs, curated tobacco blends, and gourmet dining elixirs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/hookahs"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <Wind className="w-4 h-4" />
                <span>Explore Hookahs</span>
              </Link>
              <Link
                to="/menu"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Gourmet Menu</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {cartCount} item{cartCount > 1 ? 's' : ''} in private session
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400/80 hover:text-rose-300 transition flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="p-4 sm:p-5 rounded-3xl bg-[#121216] border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                            {cartItem.type === 'hookah' ? 'Signature Hookah' : 'Lounge Bite/Beverage'}
                          </span>
                        </div>
                        <h4 className="font-serif-luxury font-bold text-base text-white">
                          {cartItem.item.name}
                        </h4>

                        {/* Custom options for hookahs */}
                        {cartItem.type === 'hookah' && (
                          <div className="text-[11px] text-neutral-400 space-y-0.5">
                            <div>Flavor: <strong className="text-neutral-200">{cartItem.selectedFlavor}</strong></div>
                            <div>Base: <span className="text-neutral-300">{cartItem.selectedBase}</span> • Draw: {cartItem.selectedStrength}</div>
                            {cartItem.selectedAddOns && cartItem.selectedAddOns.length > 0 && (
                              <div className="text-[#d4af37] text-[10px]">
                                Add-ons: {cartItem.selectedAddOns.join(', ')}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-xs font-mono font-bold text-[#d4af37] pt-1">
                          Rs. {cartItem.unitPrice.toLocaleString()} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Action Controls */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      <div className="flex items-center gap-2 bg-[#0a0a0c] p-1 rounded-xl border border-neutral-800">
                        <button
                          type="button"
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white flex items-center justify-center transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-white w-6 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white flex items-center justify-center transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <div className="text-sm font-mono font-bold text-white">
                          Rs. {(cartItem.unitPrice * cartItem.quantity).toLocaleString()}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(cartItem.id)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary & Checkout Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-[#121216] border border-[#d4af37]/30 space-y-6 shadow-2xl">
                <h3 className="font-serif-luxury font-bold text-lg text-white border-b border-neutral-800 pb-4">
                  Session Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCode} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Voucher code (e.g. NOIRVIP10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#d4af37] font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37] text-white text-xs font-semibold transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMsg && (
                    <div
                      className={`text-[11px] font-medium ${
                        promoMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {promoMsg.text}
                    </div>
                  )}
                  {discountCode && (
                    <div className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider">
                      Active: {discountCode}
                    </div>
                  )}
                </form>

                {/* Costs Breakdown */}
                <div className="space-y-3 pt-2 border-t border-neutral-800 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>VIP Privilege Discount</span>
                      <span className="font-mono">-Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Lounge Tax (5%)</span>
                    <span className="font-mono text-white">Rs. {tax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-neutral-800 text-base">
                    <span className="font-serif-luxury font-bold text-white">Total Amount</span>
                    <span className="font-mono font-extrabold text-xl text-[#d4af37]">
                      Rs. {total.toLocaleString()} <span className="text-xs font-sans font-normal text-neutral-400">PKR</span>
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition"
                >
                  <span>Proceed to Table Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Authenticated Member Privilege • Instant Table Service</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
