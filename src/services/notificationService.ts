import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { doc, updateDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { app, db, auth } from '../firebase/firebaseConfig';
import { NotificationItem } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

const PUSH_ACTIVE_KEY = 'noir_push_active';
const LOCAL_NOTIFS_KEY = 'noir_local_notifications';
const READ_NOTIFS_KEY = 'noir_read_notification_ids';

class NotificationService {
  private messagingInstance: Messaging | null = null;
  private isInitialized = false;
  private listeners: Array<() => void> = [];
  private remoteNotifications: NotificationItem[] = [];
  private localNotifications: NotificationItem[] = [];
  private readIds: Set<string> = new Set();
  private isPushEnabled = false;
  private firestoreUnsubs: Array<() => void> = [];
  private currentUserId: string | null = null;

  constructor() {
    this.initLocalState();
    this.initFirestoreSync();
  }

  private initLocalState() {
    if (typeof window === 'undefined') return;

    try {
      // Load push active preference
      const savedPush = localStorage.getItem(PUSH_ACTIVE_KEY);
      this.isPushEnabled = savedPush !== null ? savedPush === 'true' : false;

      // Load read IDs
      const savedRead = localStorage.getItem(READ_NOTIFS_KEY);
      if (savedRead) {
        this.readIds = new Set(JSON.parse(savedRead));
      }

      // Load local notifications
      const savedLocals = localStorage.getItem(LOCAL_NOTIFS_KEY);
      if (savedLocals) {
        this.localNotifications = JSON.parse(savedLocals);
      }
    } catch {
      // Ignore storage errors
    }
  }

  private initFirestoreSync() {
    if (typeof window === 'undefined') return;

    // Listen for broadcast notifications from Firestore
    try {
      const notifsCol = collection(db, 'notifications');
      const unsubNotifs = onSnapshot(
        notifsCol,
        (snap) => {
          if (!snap.empty) {
            this.remoteNotifications = snap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as NotificationItem[];
          } else {
            this.remoteNotifications = MOCK_NOTIFICATIONS;
          }
          this.notify();
        },
        (err) => {
          console.debug('[NOIR Notifications] Remote notifications sync fallback:', err?.message);
          this.remoteNotifications = MOCK_NOTIFICATIONS;
          this.notify();
        }
      );
      this.firestoreUnsubs.push(unsubNotifs);
    } catch (e) {
      this.remoteNotifications = MOCK_NOTIFICATIONS;
    }

    // Monitor Auth state to sync per-user read state
    auth.onAuthStateChanged((user) => {
      this.currentUserId = user ? user.uid : null;
      if (user) {
        this.syncUserReadState(user.uid);
      }
    });
  }

  private syncUserReadState(userId: string) {
    try {
      const stateDocRef = doc(db, 'notificationStates', userId);
      const unsub = onSnapshot(
        stateDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data.readNotificationIds)) {
              data.readNotificationIds.forEach((id: string) => this.readIds.add(id));
              this.persistReadIds();
              this.notify();
            }
          }
        },
        (err) => {
          console.debug('[NOIR Notifications] User read-state listener note:', err?.message);
        }
      );
      this.firestoreUnsubs.push(unsub);
    } catch (err) {
      console.warn('[NOIR Notifications] Error syncing user read state:', err);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('[NOIR Notifications] Listener error:', err);
      }
    });
  }

  public getNotifications(): NotificationItem[] {
    // Combine remote and local notifications, eliminating duplicates
    const combinedMap = new Map<string, NotificationItem>();

    // Add remote (or mock fallback)
    const baseList = this.remoteNotifications.length > 0 ? this.remoteNotifications : MOCK_NOTIFICATIONS;
    baseList.forEach((n) => {
      combinedMap.set(n.id, {
        ...n,
        read: this.readIds.has(n.id) || !!n.read,
      });
    });

    // Add local notifications (order placed, reservation booked, etc.)
    this.localNotifications.forEach((n) => {
      combinedMap.set(n.id, {
        ...n,
        read: this.readIds.has(n.id) || !!n.read,
      });
    });

    const list = Array.from(combinedMap.values());
    // Sort newest first
    return list.sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  }

  public markAsRead(id: string) {
    this.readIds.add(id);
    this.persistReadIds();
    this.persistReadStateToFirestore();
    this.notify();
  }

  public markAllAsRead() {
    const all = this.getNotifications();
    all.forEach((n) => this.readIds.add(n.id));
    this.persistReadIds();
    this.persistReadStateToFirestore();
    this.notify();
  }

  private persistReadIds() {
    try {
      localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(Array.from(this.readIds)));
    } catch {
      // Ignore
    }
  }

  private async persistReadStateToFirestore() {
    if (!this.currentUserId) return;
    try {
      const stateDocRef = doc(db, 'notificationStates', this.currentUserId);
      await setDoc(
        stateDocRef,
        {
          userId: this.currentUserId,
          readNotificationIds: Array.from(this.readIds),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.debug('[NOIR Notifications] Could not persist read state to Firestore:', err);
    }
  }

  public pushLocalNotification(
    titleOrPayload: string | { title: string; message: string; type?: NotificationItem['type'] },
    message?: string,
    type: NotificationItem['type'] = 'announcement'
  ) {
    let finalTitle = '';
    let finalMessage = '';
    let finalType: NotificationItem['type'] = 'announcement';

    if (typeof titleOrPayload === 'object') {
      finalTitle = titleOrPayload.title;
      finalMessage = titleOrPayload.message;
      finalType = titleOrPayload.type || 'announcement';
    } else {
      finalTitle = titleOrPayload;
      finalMessage = message || '';
      finalType = type;
    }

    const newNotif: NotificationItem = {
      id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: finalTitle,
      message: finalMessage,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
      type: finalType,
    };

    this.localNotifications.unshift(newNotif);
    // Keep max 20 local notifications
    if (this.localNotifications.length > 20) {
      this.localNotifications = this.localNotifications.slice(0, 20);
    }

    try {
      localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(this.localNotifications));
    } catch {
      // Ignore
    }

    this.notify();

    // Trigger native browser notification if granted and push is enabled
    if (this.isPushEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(`NOIR HOOKAH — ${finalTitle}`, {
            body: finalMessage,
            icon: '/pwa-192x192.png',
            badge: '/icon.svg',
          });
        } catch {
          // Fallback on mobile/service worker if Notification constructor fails
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification(`NOIR HOOKAH — ${finalTitle}`, {
                body: finalMessage,
                icon: '/pwa-192x192.png',
                badge: '/icon.svg',
              });
            }).catch(() => {});
          }
        }
      }
    }
  }

  public isPushActive(): boolean {
    if (typeof window === 'undefined') return false;
    return this.isPushEnabled && 'Notification' in window && Notification.permission === 'granted';
  }

  public setPushActive(active: boolean) {
    this.isPushEnabled = active;
    try {
      localStorage.setItem(PUSH_ACTIVE_KEY, String(active));
    } catch {
      // Ignore
    }
    this.notify();
  }

  public async requestPushPermission(): Promise<boolean> {
    const res = await this.requestPermissionAndRegisterToken(this.currentUserId || undefined);
    const granted = res.permission === 'granted';
    this.setPushActive(granted);
    return granted;
  }

  public async getMessaging(): Promise<Messaging | null> {
    if (this.isInitialized) return this.messagingInstance;
    if (typeof window === 'undefined') return null;

    try {
      const supported = await isSupported();
      if (supported) {
        this.messagingInstance = getMessaging(app);
      }
    } catch (err) {
      console.debug('[NOIR Notifications] FCM not supported:', err);
      this.messagingInstance = null;
    }

    this.isInitialized = true;
    return this.messagingInstance;
  }

  public async requestPermissionAndRegisterToken(userId?: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
    permission: NotificationPermission;
  }> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return {
        success: false,
        error: 'Notifications are not supported by this browser.',
        permission: 'denied',
      };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          error: permission === 'denied' ? 'Permission denied by user.' : 'Permission prompt dismissed.',
          permission,
        };
      }

      const messaging = await this.getMessaging();
      if (!messaging) {
        return {
          success: true,
          permission,
          error: 'Browser notifications allowed (FCM worker inactive).',
        };
      }

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;

      try {
        let swRegistration: ServiceWorkerRegistration | undefined;
        if ('serviceWorker' in navigator) {
          swRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (!swRegistration) {
            swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => undefined);
          }
        }

        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: swRegistration,
        });

        if (token && userId) {
          await this.saveUserToken(userId, token);
        }

        return { success: true, token, permission };
      } catch (fcmErr: any) {
        console.debug('[NOIR Notifications] FCM token note:', fcmErr?.message);
        return { success: true, permission };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to request permission',
        permission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied',
      };
    }
  }

  private async saveUserToken(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        fcmTokenUpdatedAt: new Date().toISOString(),
      });

      const tokenDocRef = doc(db, 'users', userId, 'fcmTokens', token.slice(-20));
      await setDoc(
        tokenDocRef,
        {
          token,
          device: navigator.userAgent,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.debug('[NOIR Notifications] Token save note:', err);
    }
  }

  public cleanup() {
    this.firestoreUnsubs.forEach((unsub) => unsub());
    this.firestoreUnsubs = [];
  }
}

export const notificationService = new NotificationService();
