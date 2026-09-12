import React, { useState, useEffect } from 'react';
import { PageRoute, CartItem } from '../../types';
import { cartService } from '../../services/cartService';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Gift, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState('');

  useEffect(() => {
    const update = () => {
      setItems(cartService.getItems());
    };
    update();
    const unsubscribe = cartService.subscribe(update);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const { subtotal, tax, discount, total } = cartService.getTotal(appliedDiscount);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedDiscount(discountCode);
  };

  const handleProceedToCheckout = () => {
    onClose();
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e12] border-l border-[#d4af37]/30 text-neutral-200 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-cinzel text-lg font-bold text-white tracking-widest">
                YOUR SELECTION
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                <p className="text-sm text-neutral-400">Your selection is currently empty.</p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('menu');
                  }}
                  className="mt-2 text-xs uppercase tracking-widest text-[#d4af37] border-b border-[#d4af37] pb-1 hover:text-[#f7e7ce]"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="p-3.5 bg-[#14141a] rounded-xl border border-neutral-800 flex gap-3 relative group"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-700"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {cartItem.item.name}
                      </h4>
                      <button
                        onClick={() => cartService.removeItem(cartItem.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {cartItem.type === 'hookah' && (
                      <div className="text-[11px] text-neutral-400 space-y-0.5 mt-1">
                        <div>Flavor: <span className="text-[#f7e7ce]">{cartItem.selectedFlavor}</span></div>
                        <div>Base: <span className="text-neutral-300">{cartItem.selectedBase}</span></div>
                        {cartItem.selectedAddOns && cartItem.selectedAddOns.length > 0 && (
                          <div>Add-ons: <span className="text-neutral-300">{cartItem.selectedAddOns.join(', ')}</span></div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-neutral-700 rounded-lg px-2 py-0.5 bg-neutral-900">
                        <button
                          onClick={() => cartService.updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">{cartItem.quantity}</span>
                        <button
                          onClick={() => cartService.updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#d4af37]">
                        Rs. {(cartItem.unitPrice * cartItem.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-[#0a0a0c] space-y-4">
              {/* Discount / Gift Card Code */}
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <div className="relative flex-1">
                  <Gift className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Gift card or promo code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full bg-[#14141a] border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg text-white"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="text-[11px] text-[#f7e7ce] bg-[#d4af37]/10 p-2 rounded border border-[#d4af37]/30 flex justify-between items-center">
                  <span>Code Applied: {appliedDiscount.toUpperCase()}</span>
                  <span className="font-semibold">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
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
                  <span>Luxury Tax (5%)</span>
                  <span>Rs. {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Amount</span>
                  <span className="text-[#d4af37]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest py-3 rounded-xl shadow-xl hover:brightness-110 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
