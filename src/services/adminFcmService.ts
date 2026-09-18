import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { app, db, auth } from '../firebase/firebaseConfig';
import { AdminFcmToken } from '../types/errorMonitoring';

class AdminFcmService {
  private messaging: Messaging | null = null;
  private isSupportedBrowser: boolean | null = null;

  /**
   * Check if Firebase Messaging is supported in this browser
   */
  public async isMessagingSupported(): Promise<boolean> {
    if (this.isSupportedBrowser !== null) return this.isSupportedBrowser;
    try {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('Notification' in window)) {
        this.isSupportedBrowser = false;
        return false;
      }
      this.isSupportedBrowser = await isSupported();
      return this.isSupportedBrowser;
    } catch {
      this.isSupportedBrowser = false;
      return false;
    }
  }

  /**
   * Initialize Messaging singleton
   */
  private async getMessagingInstance(): Promise<Messaging | null> {
    const supported = await this.isMessagingSupported();
    if (!supported) return null;
    if (!this.messaging) {
      this.messaging = getMessaging(app);
    }
    return this.messaging;
  }

  /**
   * Register the authenticated admin's browser for push alerts
   */
  public async registerAdminFcmToken(customVapidKey?: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'Administrator is not authenticated' };
      }

      // Check ID Token custom claims directly
      const tokenResult = await currentUser.getIdTokenResult(true);
      const claims = tokenResult.claims as { admin?: boolean; role?: string };
      if (claims.admin !== true || claims.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized: Custom claims (admin: true, role: "ADMIN") required.' };
      }

      const supported = await this.isMessagingSupported();
      if (!supported) {
        return { success: false, error: 'Web Push Notifications are not supported in this browser.' };
      }

      // Request browser notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, error: 'Notification permission was denied or dismissed.' };
      }

      const messagingInstance = await this.getMessagingInstance();
      if (!messagingInstance) {
        return { success: false, error: 'Could not initialize messaging instance.' };
      }

      // Register or get active service worker
      let registration: ServiceWorkerRegistration | undefined;
      if ('serviceWorker' in navigator) {
        try {
          registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (!registration) {
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          }
        } catch (swErr) {
          console.debug('[NOIR FCM] SW registration notice:', swErr);
        }
      }

      // Obtain FCM Web Token
      const token = await getToken(messagingInstance, {
        serviceWorkerRegistration: registration,
        vapidKey: customVapidKey || undefined,
      });

      if (!token) {
        return { success: false, error: 'Failed to retrieve FCM Web Push token from Firebase.' };
      }

      // Store in Firestore /adminFcmTokens/{tokenId}
      // Hash or sanitize token string for clean doc ID
      const tokenId = `adm_token_${currentUser.uid}_${token.slice(-12)}`;
      const tokenRef = doc(db, 'adminFcmTokens', tokenId);

      const tokenDoc: AdminFcmToken = {
        tokenId,
        token,
        userId: currentUser.uid,
        userEmail: currentUser.email || null,
        userAgent: navigator.userAgent.slice(0, 200),
        platform: navigator.platform || 'web',
        active: true,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      };

      await setDoc(tokenRef, tokenDoc, { merge: true });

      // Save active token in local storage for session management
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('noir_admin_fcm_token_id', tokenId);
      }

      return { success: true, token };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to register notification token.' };
    }
  }

  /**
   * Deregister admin token on sign out or disable
   */
  public async unregisterAdminFcmToken(): Promise<void> {
    try {
      const tokenId = typeof localStorage !== 'undefined' ? localStorage.getItem('noir_admin_fcm_token_id') : null;
      if (tokenId) {
        const tokenRef = doc(db, 'adminFcmTokens', tokenId);
        await deleteDoc(tokenRef);
        localStorage.removeItem('noir_admin_fcm_token_id');
      }
    } catch (err) {
      console.debug('[NOIR FCM] Token deregistration warning:', err);
    }
  }

  /**
   * Setup foreground notification listener
   */
  public async setupForegroundListener(onNotification: (payload: any) => void): Promise<(() => void) | null> {
    const messagingInstance = await this.getMessagingInstance();
    if (!messagingInstance) return null;

    return onMessage(messagingInstance, (payload) => {
      onNotification(payload);
    });
  }
}

export const adminFcmService = new AdminFcmService();
export default adminFcmService;
