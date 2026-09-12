import { CartItem, Hookah, MenuItem, Order } from '../types';

const CART_STORAGE_KEY = 'noir_cart_v1';
const ORDERS_STORAGE_KEY = 'noir_orders_v1';

class CartService {
  private items: CartItem[] = [];
  private orders: Order[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadCart();
    this.loadOrders();
  }

  private loadCart(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
      }
    } catch (e) {
      this.items = [];
    }
  }

  private loadOrders(): void {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        this.orders = JSON.parse(stored);
      } else {
        // Mock sample order for dashboard preview
        this.orders = [
          {
            id: 'ORD-9021',
            userId: 'usr-9901',
            tableNumber: 'Table 12 (VIP Lounge)',
            items: [],
            subtotal: 5500,
            tax: 275,
            discount: 0,
            total: 5775,
            paymentMethod: 'lounge_cash',
            status: 'Preparing',
            createdAt: new Date().toISOString().split('T')[0],
          },
        ];
        this.saveOrders();
      }
    } catch (e) {
      this.orders = [];
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }

  private saveOrders(): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch (e) {
      console.error('Failed to persist orders:', e);
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l());
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  addHookahToCart(
    hookah: Hookah,
    flavor: string,
    strength: string,
    base: string,
    addOns: string[] = [],
    quantity: number = 1
  ): void {
    const addOnCost = addOns.length * 300;
    const unitPrice = hookah.price + addOnCost;

    const existingIndex = this.items.findIndex(
      (ci) =>
        ci.type === 'hookah' &&
        ci.item.id === hookah.id &&
        ci.selectedFlavor === flavor &&
        ci.selectedStrength === strength &&
        ci.selectedBase === base &&
        JSON.stringify(ci.selectedAddOns?.sort()) === JSON.stringify(addOns.sort())
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-hk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: 'hookah',
        item: hookah,
        selectedFlavor: flavor,
        selectedStrength: strength,
        selectedBase: base,
        selectedAddOns: addOns,
        quantity,
        unitPrice,
      };
      this.items.push(newItem);
    }
    this.saveCart();
  }

  addMenuItemToCart(menuItem: MenuItem, quantity: number = 1): void {
    const existingIndex = this.items.findIndex(
      (ci) => ci.type === 'menu_item' && ci.item.id === menuItem.id
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-mi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: 'menu_item',
        item: menuItem,
        quantity,
        unitPrice: menuItem.price,
      };
      this.items.push(newItem);
    }
    this.saveCart();
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }
    const index = this.items.findIndex((ci) => ci.id === cartItemId);
    if (index > -1) {
      this.items[index].quantity = quantity;
      this.saveCart();
    }
  }

  removeItem(cartItemId: string): void {
    this.items = this.items.filter((ci) => ci.id !== cartItemId);
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  getTotal(discountCode: string = ''): { subtotal: number; tax: number; discount: number; total: number } {
    const subtotal = this.getSubtotal();
    let discount = 0;
    if (discountCode.toUpperCase() === 'NOIRVIP10') {
      discount = Math.round(subtotal * 0.1);
    } else if (discountCode.toUpperCase() === 'BLACKFRIDAY' || discountCode.toUpperCase() === 'VIPGIFT500') {
      discount = Math.min(500, subtotal);
    }
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = Math.max(0, subtotal - discount + tax);
    return { subtotal, tax, discount, total };
  }

  createOrder(
    userId: string,
    tableNumber: string,
    paymentMethod: 'card' | 'lounge_cash' | 'wallet',
    discountCode: string = ''
  ): Order {
    const { subtotal, tax, discount, total } = this.getTotal(discountCode);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      tableNumber,
      items: [...this.items],
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: 'Preparing',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.orders.unshift(newOrder);
    this.saveOrders();
    this.clearCart();
    return newOrder;
  }

  getAllOrders(): Order[] {
    return [...this.orders];
  }

  getOrdersHistory(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId || userId === 'usr-9901');
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveOrders();
    }
  }
}

export const cartService = new CartService();
