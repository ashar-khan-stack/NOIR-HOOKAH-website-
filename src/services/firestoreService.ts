import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Hookah, Flavor, MenuItem, Reservation, Order, NotificationItem, User } from '../types';
import { SIGNATURE_HOOKAHS, FLAVORS, MENU_ITEMS, MOCK_NOTIFICATIONS } from '../data/mockData';

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  HOOKAHS: 'hookahs',
  FLAVORS: 'flavors',
  MENU: 'menu',
  ORDERS: 'orders',
  RESERVATIONS: 'reservations',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_STATES: 'notificationStates',
} as const;

export interface NotificationStateDoc {
  id?: string;
  userId: string;
  readNotificationIds: string[];
  updatedAt?: any;
}

class FirestoreService {
  private isInitialized = false;

  /**
   * Seed catalog collections (hookahs, flavors, menu, notifications)
   * if they are currently empty in Firestore.
   */
  async initializeCatalog(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Check hookahs
      const hookahsSnap = await getDocs(collection(db, COLLECTIONS.HOOKAHS));
      if (hookahsSnap.empty) {
        const batch = writeBatch(db);
        SIGNATURE_HOOKAHS.forEach((hookah) => {
          const docRef = doc(db, COLLECTIONS.HOOKAHS, hookah.id);
          batch.set(docRef, { ...hookah, createdAt: serverTimestamp() });
        });
        await batch.commit();
      }

      // Check flavors
      const flavorsSnap = await getDocs(collection(db, COLLECTIONS.FLAVORS));
      if (flavorsSnap.empty) {
        const batch = writeBatch(db);
        FLAVORS.forEach((flavor) => {
          const docRef = doc(db, COLLECTIONS.FLAVORS, flavor.id);
          batch.set(docRef, { ...flavor, createdAt: serverTimestamp() });
        });
        await batch.commit();
      }

      // Check menu
      const menuSnap = await getDocs(collection(db, COLLECTIONS.MENU));
      if (menuSnap.empty) {
        const batch = writeBatch(db);
        MENU_ITEMS.forEach((item) => {
          const docRef = doc(db, COLLECTIONS.MENU, item.id);
          batch.set(docRef, { ...item, createdAt: serverTimestamp() });
        });
        await batch.commit();
      }

      // Check notifications
      const notifsSnap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
      if (notifsSnap.empty) {
        const batch = writeBatch(db);
        MOCK_NOTIFICATIONS.forEach((notif) => {
          const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
          batch.set(docRef, { ...notif, createdAt: serverTimestamp() });
        });
        await batch.commit();
      }
    } catch (error) {
      console.warn('[NOIR Firestore] Catalog auto-seed notice (offline or permission required):', error);
    }
  }

  /* ---------------- USERS COLLECTION ---------------- */
  async getUserDoc(uid: string): Promise<User | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (e) {
      console.error('[NOIR Firestore] getUserDoc error:', e);
      return null;
    }
  }

  async setUserDoc(uid: string, userData: Partial<User>): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, uid), {
        ...userData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error('[NOIR Firestore] setUserDoc error:', e);
      throw e;
    }
  }

  /* ---------------- HOOKAHS COLLECTION ---------------- */
  async getHookahs(): Promise<Hookah[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.HOOKAHS));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Hookah));
      }
      return SIGNATURE_HOOKAHS;
    } catch (e) {
      console.warn('[NOIR Firestore] Falling back to local hookahs cache:', e);
      return SIGNATURE_HOOKAHS;
    }
  }

  async getHookahById(id: string): Promise<Hookah | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.HOOKAHS, id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Hookah;
      }
      return SIGNATURE_HOOKAHS.find((h) => h.id === id) || null;
    } catch (e) {
      return SIGNATURE_HOOKAHS.find((h) => h.id === id) || null;
    }
  }

  /* ---------------- FLAVORS COLLECTION ---------------- */
  async getFlavors(): Promise<Flavor[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.FLAVORS));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Flavor));
      }
      return FLAVORS;
    } catch (e) {
      console.warn('[NOIR Firestore] Falling back to local flavors cache:', e);
      return FLAVORS;
    }
  }

  /* ---------------- MENU COLLECTION ---------------- */
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.MENU));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
      }
      return MENU_ITEMS;
    } catch (e) {
      console.warn('[NOIR Firestore] Falling back to local menu cache:', e);
      return MENU_ITEMS;
    }
  }

  /* ---------------- ORDERS COLLECTION ---------------- */
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
        ...orderData,
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        createdAt: new Date().toISOString(),
        ...orderData,
      };
    } catch (e) {
      console.error('[NOIR Firestore] createOrder error:', e);
      // Generate client-side fallback order
      return {
        id: `ord-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...orderData,
      };
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    } catch (e) {
      // In case composite index is not created yet, query without orderBy and sort locally
      try {
        const qSimple = query(
          collection(db, COLLECTIONS.ORDERS),
          where('userId', '==', userId)
        );
        const snapSimple = await getDocs(qSimple);
        const items = snapSimple.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
        return items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      } catch (err) {
        console.warn('[NOIR Firestore] getUserOrders fallback:', err);
        return [];
      }
    }
  }

  onUserOrdersSnapshot(userId: string, callback: (orders: Order[]) => void): () => void {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('userId', '==', userId)
      );
      return onSnapshot(q, (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
        items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
        callback(items);
      }, (error) => {
        console.warn('[NOIR Firestore] onUserOrdersSnapshot error:', error);
      });
    } catch (e) {
      console.warn('[NOIR Firestore] onUserOrdersSnapshot setup error:', e);
      return () => {};
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    } catch (e) {
      console.warn('[NOIR Firestore] getAllOrders error:', e);
      return [];
    }
  }

  /* ---------------- RESERVATIONS COLLECTION ---------------- */
  async createReservation(data: Omit<Reservation, 'id' | 'status' | 'createdAt'> & { userId?: string }): Promise<Reservation> {
    try {
      const reservationPayload = {
        ...data,
        status: 'Confirmed' as const,
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.RESERVATIONS), reservationPayload);
      return {
        id: docRef.id,
        ...reservationPayload,
      };
    } catch (e) {
      console.error('[NOIR Firestore] createReservation error:', e);
      return {
        id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
        ...data,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
    }
  }

  async getUserReservations(email: string): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.RESERVATIONS),
        where('email', '==', email)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Reservation));
      return items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    } catch (e) {
      console.warn('[NOIR Firestore] getUserReservations fallback:', e);
      return [];
    }
  }

  onUserReservationsSnapshot(email: string, callback: (reservations: Reservation[]) => void): () => void {
    try {
      const q = query(
        collection(db, COLLECTIONS.RESERVATIONS),
        where('email', '==', email)
      );
      return onSnapshot(q, (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Reservation));
        items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
        callback(items);
      }, (error) => {
        console.warn('[NOIR Firestore] onUserReservationsSnapshot error:', error);
      });
    } catch (e) {
      console.warn('[NOIR Firestore] onUserReservationsSnapshot setup error:', e);
      return () => {};
    }
  }

  async getAllReservations(): Promise<Reservation[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.RESERVATIONS));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Reservation));
    } catch (e) {
      console.warn('[NOIR Firestore] getAllReservations fallback:', e);
      return [];
    }
  }

  async updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.RESERVATIONS, id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[NOIR Firestore] updateReservationStatus fallback:', e);
    }
  }

  /* ---------------- NOTIFICATIONS COLLECTION ---------------- */
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationItem));
      }
      return MOCK_NOTIFICATIONS;
    } catch (e) {
      return MOCK_NOTIFICATIONS;
    }
  }

  /* ---------------- NOTIFICATION STATES COLLECTION ---------------- */
  async getUserNotificationState(userId: string): Promise<string[]> {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.NOTIFICATION_STATES, userId));
      if (snap.exists()) {
        const data = snap.data() as NotificationStateDoc;
        return data.readNotificationIds || [];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async setUserNotificationState(userId: string, readNotificationIds: string[]): Promise<void> {
    try {
      await setDoc(
        doc(db, COLLECTIONS.NOTIFICATION_STATES, userId),
        {
          userId,
          readNotificationIds,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('[NOIR Firestore] setUserNotificationState error:', e);
    }
  }

  /* ---------------- ADMIN OPERATIONS ---------------- */

  /**
   * Get all registered customers for admin management
   */
  async getAdminCustomers(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.USERS));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as User));
    } catch (e) {
      console.error('[NOIR Firestore] getAdminCustomers error:', e);
      return [];
    }
  }

  /**
   * Get customer details by id for customer detail page
   */
  async getCustomerById(id: string): Promise<User | null> {
    return this.getUserDoc(id);
  }

  /**
   * Real-time subscription to all orders for admin console
   */
  subscribeToAdminOrders(callback: (orders: Order[]) => void): () => void {
    try {
      const q = collection(db, COLLECTIONS.ORDERS);
      return onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
          items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
          callback(items);
        },
        (err) => {
          console.error('[NOIR Firestore] subscribeToAdminOrders listener error:', err);
        }
      );
    } catch (e) {
      console.error('[NOIR Firestore] subscribeToAdminOrders error:', e);
      return () => {};
    }
  }

  /**
   * Get specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (e) {
      console.error('[NOIR Firestore] getOrderById error:', e);
      return null;
    }
  }

  /**
   * Update order status from admin console
   */
  async updateAdminOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('[NOIR Firestore] updateAdminOrderStatus error:', e);
      throw e;
    }
  }

  /**
   * Real-time subscription to all reservations for admin console
   */
  subscribeToAdminReservations(callback: (reservations: Reservation[]) => void): () => void {
    try {
      const q = collection(db, COLLECTIONS.RESERVATIONS);
      return onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Reservation));
          items.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
          callback(items);
        },
        (err) => {
          console.error('[NOIR Firestore] subscribeToAdminReservations listener error:', err);
        }
      );
    } catch (e) {
      console.error('[NOIR Firestore] subscribeToAdminReservations error:', e);
      return () => {};
    }
  }

  /**
   * Update reservation status
   */
  async updateAdminReservationStatus(id: string, status: Reservation['status']): Promise<void> {
    return this.updateReservationStatus(id, status);
  }

  /* Catalog CRUD - Hookahs */
  async createHookah(data: Omit<Hookah, 'id'>): Promise<Hookah> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.HOOKAHS), {
        ...data,
        available: data.available !== false,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    } catch (e) {
      console.error('[NOIR Firestore] createHookah error:', e);
      throw e;
    }
  }

  async updateHookah(id: string, data: Partial<Hookah>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.HOOKAHS, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('[NOIR Firestore] updateHookah error:', e);
      throw e;
    }
  }

  async deleteHookah(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.HOOKAHS, id));
    } catch (e) {
      console.error('[NOIR Firestore] deleteHookah error:', e);
      throw e;
    }
  }

  /* Catalog CRUD - Flavors */
  async createFlavor(data: Omit<Flavor, 'id'>): Promise<Flavor> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.FLAVORS), {
        ...data,
        available: data.available !== false,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    } catch (e) {
      console.error('[NOIR Firestore] createFlavor error:', e);
      throw e;
    }
  }

  async updateFlavor(id: string, data: Partial<Flavor>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.FLAVORS, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('[NOIR Firestore] updateFlavor error:', e);
      throw e;
    }
  }

  async deleteFlavor(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.FLAVORS, id));
    } catch (e) {
      console.error('[NOIR Firestore] deleteFlavor error:', e);
      throw e;
    }
  }

  /* Catalog CRUD - Menu Items */
  async createMenuItem(data: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MENU), {
        ...data,
        available: data.available !== false,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    } catch (e) {
      console.error('[NOIR Firestore] createMenuItem error:', e);
      throw e;
    }
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.MENU, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('[NOIR Firestore] updateMenuItem error:', e);
      throw e;
    }
  }

  async deleteMenuItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MENU, id));
    } catch (e) {
      console.error('[NOIR Firestore] deleteMenuItem error:', e);
      throw e;
    }
  }

  /* Notifications */
  async createNotification(data: Omit<NotificationItem, 'id'>): Promise<NotificationItem> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    } catch (e) {
      console.error('[NOIR Firestore] createNotification error:', e);
      throw e;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id));
    } catch (e) {
      console.error('[NOIR Firestore] deleteNotification error:', e);
      throw e;
    }
  }
}

export const firestoreService = new FirestoreService();
