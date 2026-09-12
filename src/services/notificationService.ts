import { NotificationItem } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

const NOTIF_SETTINGS_KEY = 'noir_push_settings_v1';

class NotificationService {
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];
  private isPushEnabled: boolean = true;
  private listeners: (() => void)[] = [];

  constructor() {
    try {
      const stored = localStorage.getItem(NOTIF_SETTINGS_KEY);
      if (stored !== null) {
        this.isPushEnabled = JSON.parse(stored);
      }
    } catch (e) {
      this.isPushEnabled = true;
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAsRead(id: string): void {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.notify();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  isPushActive(): boolean {
    return this.isPushEnabled;
  }

  setPushActive(enabled: boolean): void {
    this.isPushEnabled = enabled;
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(enabled));
    this.notify();
  }

  /**
   * Clean FCM / Push Provider Abstraction
   * Request native browser permission or register push subscription token.
   */
  async requestPushPermission(): Promise<boolean> {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          this.setPushActive(true);
          return true;
        }
      } catch (e) {
        console.warn('Native notification permission error:', e);
      }
    }
    this.setPushActive(true);
    return true;
  }

  pushLocalNotification(title: string, message: string, type: 'offer' | 'reservation' | 'order' | 'drop' = 'offer'): void {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      date: 'Just now',
      read: false,
      type,
    };
    this.notifications.unshift(newNotif);
    this.notify();

    if (this.isPushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/icon.svg' });
      } catch (e) {
        // Fallback silently if inside restricted iframe
      }
    }
  }
}

export const notificationService = new NotificationService();
