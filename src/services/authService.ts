import { User, UserRole } from '../types';
import { CURRENT_USER_MOCK } from '../data/mockData';

const AUTH_STORAGE_KEY = 'noir_user_session_v1';

/**
 * Storage Wrapper for LocalStorage & Token Management.
 * Currently uses Base64 encoding/obfuscation for demo session persistence.
 * Note: Base64 encoding is NOT encryption. When a production backend API is integrated,
 * replace this obfuscation layer with WebCrypto AES-256-GCM hardware key storage or secure cookies.
 */
class SecureStorage {
  private static PREFIX = 'noir_sec_';

  private static encode(data: string): string {
    try {
      // Base64 client-side obfuscation (replace with AES-GCM in production)
      return btoa(encodeURIComponent(data));
    } catch {
      return data;
    }
  }

  private static decode(cipherText: string): string {
    try {
      return decodeURIComponent(atob(cipherText));
    } catch {
      return cipherText;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      const jsonString = JSON.stringify(value);
      const encoded = this.encode(jsonString);
      localStorage.setItem(`${this.PREFIX}${key}`, encoded);
    } catch (err) {
      console.warn('SecureStorage setItem failed:', err);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${this.PREFIX}${key}`) || localStorage.getItem(key);
      if (!raw) return null;
      // Handle legacy raw JSON vs obfuscated
      if (raw.startsWith('{') || raw.startsWith('[')) {
        return JSON.parse(raw) as T;
      }
      const decoded = this.decode(raw);
      return JSON.parse(decoded) as T;
    } catch {
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(`${this.PREFIX}${key}`);
    localStorage.removeItem(key);
  }
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    try {
      this.currentUser = SecureStorage.getItem<User>(AUTH_STORAGE_KEY);
    } catch (e) {
      this.currentUser = null;
    }
  }

  private saveSession(): void {
    if (this.currentUser) {
      SecureStorage.setItem<User>(AUTH_STORAGE_KEY, this.currentUser);
    } else {
      SecureStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getUserRole(): UserRole | null {
    if (!this.currentUser) return null;
    if (this.currentUser.role) return this.currentUser.role;
    return this.currentUser.isAdmin ? 'ADMIN' : 'USER';
  }

  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  async login(email: string, _password?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const user: User = {
      ...CURRENT_USER_MOCK,
      email: email || CURRENT_USER_MOCK.email,
      role: 'USER',
      isAdmin: false,
    };
    this.currentUser = user;
    this.saveSession();
    return user;
  }

  async adminLogin(emailOrUsername: string, _password?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const adminUser: User = {
      id: 'usr-admin-01',
      name: 'Executive Admin Desk',
      email: emailOrUsername || 'admin@noirhookah.com',
      phone: '+92 300 0000000',
      role: 'ADMIN',
      isAdmin: true,
      tier: 'Black VIP',
      membershipTier: 'Black VIP',
      loyaltyPoints: 9999,
      rewardHistory: [],
      orderHistory: [],
      reservationsHistory: [],
    };
    this.currentUser = adminUser;
    this.saveSession();
    return adminUser;
  }

  async register(name: string, email: string, phone: string, _password?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const newUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      role: 'USER',
      isAdmin: false,
      tier: 'Gold VIP',
      membershipTier: 'Gold VIP',
      loyaltyPoints: 100,
      rewardHistory: [
        {
          id: 'rw-welcome',
          title: 'Welcome Member Gift',
          points: 100,
          date: new Date().toISOString().split('T')[0],
        },
      ],
      orderHistory: [],
      reservationsHistory: [],
    };
    this.currentUser = newUser;
    this.saveSession();
    return newUser;
  }

  async forgotPassword(_email: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }

  logout(): void {
    this.currentUser = null;
    this.saveSession();
  }

  addLoyaltyPoints(points: number, reason: string): void {
    if (!this.currentUser) return;
    this.currentUser.loyaltyPoints += points;
    if (this.currentUser.rewardHistory) {
      this.currentUser.rewardHistory.unshift({
        id: `rw-${Date.now()}`,
        title: reason,
        points,
        date: new Date().toISOString().split('T')[0],
      });
    }
    this.saveSession();
  }
}

export const authService = new AuthService();
