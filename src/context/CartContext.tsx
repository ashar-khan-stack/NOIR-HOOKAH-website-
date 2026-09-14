import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { CartItem, Hookah, MenuItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  discountCode: string;
  applyDiscountCode: (code: string) => boolean;
  addHookah: (
    hookah: Hookah,
    flavor: string,
    strength: string,
    base: string,
    addOns?: string[],
    quantity?: number
  ) => void;
  addMenuItem: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const getStorageKey = (uid: string | null | undefined): string => {
  return uid ? `noir_cart_${uid}` : 'noir_cart_guest';
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firebaseUser } = useAuth();
  const currentUid = firebaseUser?.uid;

  const [items, setItems] = useState<CartItem[]>(() => {
    if (!currentUid) return [];
    try {
      const saved = localStorage.getItem(getStorageKey(currentUid));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountCode, setDiscountCode] = useState<string>('');

  // Synchronize cart whenever authenticated user changes
  useEffect(() => {
    if (!currentUid) {
      setItems([]);
      setDiscountCode('');
      return;
    }
    try {
      const saved = localStorage.getItem(getStorageKey(currentUid));
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
    }
  }, [currentUid]);

  // Persist cart to user-isolated storage key
  const persist = useCallback(
    (newItems: CartItem[]) => {
      setItems(newItems);
      if (currentUid) {
        try {
          localStorage.setItem(getStorageKey(currentUid), JSON.stringify(newItems));
        } catch (e) {
          console.error('[NOIR Cart] Failed to persist user cart:', e);
        }
      }
    },
    [currentUid]
  );

  const addHookah = useCallback(
    (
      hookah: Hookah,
      flavor: string,
      strength: string,
      base: string,
      addOns: string[] = [],
      quantity: number = 1
    ) => {
      const addOnCost = addOns.length * 300;
      const unitPrice = hookah.price + addOnCost;

      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (ci) =>
            ci.type === 'hookah' &&
            ci.item.id === hookah.id &&
            ci.selectedFlavor === flavor &&
            ci.selectedStrength === strength &&
            ci.selectedBase === base &&
            JSON.stringify(ci.selectedAddOns?.slice().sort()) === JSON.stringify(addOns.slice().sort())
        );

        let updated: CartItem[];
        if (existingIndex > -1) {
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
        } else {
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'hookah',
            item: hookah,
            selectedFlavor: flavor,
            selectedStrength: strength,
            selectedBase: base,
            selectedAddOns: addOns,
            quantity,
            unitPrice,
          };
          updated = [...prev, newItem];
        }

        if (currentUid) {
          try {
            localStorage.setItem(getStorageKey(currentUid), JSON.stringify(updated));
          } catch (e) {
            console.error('[NOIR Cart] Save error:', e);
          }
        }
        return updated;
      });
    },
    [currentUid]
  );

  const addMenuItem = useCallback(
    (menuItem: MenuItem, quantity: number = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (ci) => ci.type === 'menu_item' && ci.item.id === menuItem.id
        );

        let updated: CartItem[];
        if (existingIndex > -1) {
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
        } else {
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'menu_item',
            item: menuItem,
            quantity,
            unitPrice: menuItem.price,
          };
          updated = [...prev, newItem];
        }

        if (currentUid) {
          try {
            localStorage.setItem(getStorageKey(currentUid), JSON.stringify(updated));
          } catch (e) {
            console.error('[NOIR Cart] Save error:', e);
          }
        }
        return updated;
      });
    },
    [currentUid]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(cartItemId);
        return;
      }
      setItems((prev) => {
        const updated = prev.map((ci) => (ci.id === cartItemId ? { ...ci, quantity } : ci));
        if (currentUid) {
          try {
            localStorage.setItem(getStorageKey(currentUid), JSON.stringify(updated));
          } catch (e) {
            console.error('[NOIR Cart] Save error:', e);
          }
        }
        return updated;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUid]
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      setItems((prev) => {
        const updated = prev.filter((ci) => ci.id !== cartItemId);
        if (currentUid) {
          try {
            localStorage.setItem(getStorageKey(currentUid), JSON.stringify(updated));
          } catch (e) {
            console.error('[NOIR Cart] Save error:', e);
          }
        }
        return updated;
      });
    },
    [currentUid]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode('');
    if (currentUid) {
      try {
        localStorage.removeItem(getStorageKey(currentUid));
      } catch (e) {
        console.error('[NOIR Cart] Clear error:', e);
      }
    }
  }, [currentUid]);

  const applyDiscountCode = useCallback((code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'NOIRVIP10' || cleaned === 'VIPGIFT500' || cleaned === 'ELEVATE') {
      setDiscountCode(cleaned);
      return true;
    }
    return false;
  }, []);

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (discountCode === 'NOIRVIP10') {
      return Math.round(subtotal * 0.1);
    }
    if (discountCode === 'VIPGIFT500') {
      return Math.min(500, subtotal);
    }
    if (discountCode === 'ELEVATE') {
      return Math.round(subtotal * 0.15);
    }
    return 0;
  }, [subtotal, discountCode]);

  const tax = useMemo(() => {
    return Math.round((subtotal - discount) * 0.05);
  }, [subtotal, discount]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + tax);
  }, [subtotal, discount, tax]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        tax,
        discount,
        total,
        discountCode,
        applyDiscountCode,
        addHookah,
        addMenuItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
