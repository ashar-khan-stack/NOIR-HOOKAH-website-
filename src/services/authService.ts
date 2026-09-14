import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  onIdTokenChanged,
  User as FirebaseUser,
  IdTokenResult,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { firestoreService } from './firestoreService';
import { User, UserRole } from '../types';

export interface AdminClaims {
  admin?: boolean;
  role?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private authInitialized = false;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    // Listen for auth and token state changes
    onIdTokenChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userObj = await this.buildUserObject(firebaseUser);
          this.currentUser = userObj;
        } catch (e) {
          console.warn('[NOIR Auth] Error building user object from token change:', e);
        }
      } else {
        this.currentUser = null;
      }
      this.authInitialized = true;
      this.notifyListeners();
    });
  }

  /**
   * Builds the application User object by verifying Firebase custom claims
   * and merging Firestore profile data.
   * Admin security rule: MUST verify custom claims `admin === true` AND `role === "ADMIN"`.
   */
  private async buildUserObject(firebaseUser: FirebaseUser, forceTokenRefresh = false): Promise<User> {
    const idTokenResult: IdTokenResult = await firebaseUser.getIdTokenResult(forceTokenRefresh);
    const claims = idTokenResult.claims as AdminClaims;

    // Strict validation: Admin is ONLY determined by server-signed Firebase custom claims
    const isAdmin = claims.admin === true && claims.role === 'ADMIN';
    const role: UserRole = isAdmin ? 'ADMIN' : 'USER';

    // Fetch user document from Firestore
    let firestoreUser = await firestoreService.getUserDoc(firebaseUser.uid);

    if (!firestoreUser) {
      // First-time initialization of user document in Firestore
      firestoreUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'VIP Member',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        role,
        tier: 'Gold VIP',
        membershipTier: 'Gold VIP',
        loyaltyPoints: 100,
        isAdmin,
      };
      await firestoreService.setUserDoc(firebaseUser.uid, firestoreUser);
    } else {
      // Sync verified role to Firestore user state
      firestoreUser = {
        ...firestoreUser,
        role,
        isAdmin,
      };
    }

    return firestoreUser;
  }

  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!auth.currentUser && !!this.currentUser;
  }

  getUserRole(): UserRole | null {
    if (!this.currentUser) return null;
    return this.currentUser.role || (this.currentUser.isAdmin ? 'ADMIN' : 'USER');
  }

  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  /**
   * User Login with Firebase Authentication
   */
  async login(email: string, password?: string): Promise<User> {
    if (!password) {
      throw new Error('Password is required for authentication.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = await this.buildUserObject(userCredential.user, true);
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  /**
   * Admin Login with Firebase Authentication and strict Custom Claims verification
   */
  async adminLogin(emailOrUsername: string, password?: string): Promise<User> {
    if (!password) {
      throw new Error('Executive password is required.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, emailOrUsername.trim(), password);
    
    // Force refresh ID token to get latest custom claims
    const idTokenResult = await userCredential.user.getIdTokenResult(true);
    const claims = idTokenResult.claims as AdminClaims;

    const hasAdminClaims = claims.admin === true && claims.role === 'ADMIN';

    if (!hasAdminClaims) {
      // Sign out unauthorized user immediately
      await signOut(auth);
      this.currentUser = null;
      this.notifyListeners();
      throw new Error('Access Denied: Account lacks executive custom claims (admin: true, role: "ADMIN").');
    }

    const adminUser = await this.buildUserObject(userCredential.user, false);
    this.currentUser = adminUser;
    this.notifyListeners();
    return adminUser;
  }

  /**
   * User Registration with Firebase Authentication
   * ALWAYS creates standard USER accounts. Admin role cannot be created.
   */
  async register(name: string, email: string, phone: string, password?: string): Promise<User> {
    if (!password) {
      throw new Error('Password is required for VIP registration.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    const newUser: User = {
      id: userCredential.user.uid,
      name,
      email: email.trim(),
      phone,
      role: 'USER',
      isAdmin: false,
      tier: 'Gold VIP',
      membershipTier: 'Gold VIP',
      loyaltyPoints: 100,
      rewardHistory: [
        {
          id: 'rew-welcome',
          title: 'VIP Welcome Bonus',
          points: 100,
          date: new Date().toISOString().split('T')[0],
        },
      ],
      orderHistory: [],
      reservationsHistory: [],
    };

    await firestoreService.setUserDoc(userCredential.user.uid, newUser);
    this.currentUser = newUser;
    this.notifyListeners();
    return newUser;
  }

  /**
   * Send Password Reset Email via Firebase Auth
   */
  async sendPasswordReset(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email address is required.');
    }
    await sendPasswordResetEmail(auth, email.trim());
  }

  /**
   * Forgot Password Alias
   */
  async forgotPassword(email: string): Promise<void> {
    return this.sendPasswordReset(email);
  }

  /**
   * Complete Sign Out from Firebase Auth
   */
  async logout(): Promise<void> {
    await signOut(auth);
    this.currentUser = null;
    this.notifyListeners();
  }

  /**
   * Add or Redeem Loyalty Points
   */
  async addLoyaltyPoints(points: number, description: string = 'Loyalty adjustment'): Promise<void> {
    if (!this.currentUser) return;
    const currentPoints = this.currentUser.loyaltyPoints || 0;
    const newPoints = Math.max(0, currentPoints + points);
    const newHistory = [
      ...(this.currentUser.rewardHistory || []),
      {
        id: `rew-${Date.now()}`,
        title: description,
        points: Math.abs(points),
        date: new Date().toISOString().split('T')[0],
      },
    ];

    await this.updateProfileDetails({
      loyaltyPoints: newPoints,
      rewardHistory: newHistory,
    });
  }

  /**
   * Update Profile Details in Firestore
   */
  async updateProfileDetails(updates: Partial<User>): Promise<void> {
    if (!this.currentUser) return;
    const uid = this.currentUser.id;
    // Disallow overriding role or admin status via frontend profile updates
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates.role;
    delete sanitizedUpdates.isAdmin;

    await firestoreService.setUserDoc(uid, sanitizedUpdates);
    this.currentUser = {
      ...this.currentUser,
      ...sanitizedUpdates,
    };
    this.notifyListeners();
  }
}

export const authService = new AuthService();
