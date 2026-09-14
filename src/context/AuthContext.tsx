import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User as FirebaseUser,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  IdTokenResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  membershipTier: 'Silver Member' | 'Gold VIP' | 'Black VIP' | 'Noir Reserve';
  loyaltyPoints: number;
  tierProgressPercent: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface AdminClaims {
  admin?: boolean;
  role?: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  checkAdminClaims: (forceRefresh?: boolean) => Promise<boolean>;
  updateMemberProfile: (safeData: { name?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Verifies custom claims against Firebase Auth ID Token directly
  const verifyAdminClaims = useCallback(async (user: FirebaseUser, forceRefresh = false): Promise<boolean> => {
    try {
      const idTokenResult: IdTokenResult = await user.getIdTokenResult(forceRefresh);
      const claims = idTokenResult.claims as AdminClaims;
      const hasAdmin = claims.admin === true && claims.role === 'ADMIN';
      setIsAdmin(hasAdmin);
      return hasAdmin;
    } catch (e) {
      console.warn('[NOIR Auth] Claims verification warning:', e);
      setIsAdmin(false);
      return false;
    }
  }, []);

  // Fetch or initialize user profile document in Firestore
  const syncUserProfile = useCallback(async (user: FirebaseUser, hasAdminClaim: boolean) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        const resolvedRole = hasAdminClaim ? 'ADMIN' : 'USER';
        const profile: UserProfile = {
          ...data,
          uid: user.uid,
          email: user.email || data.email,
          role: resolvedRole,
        };
        setUserProfile(profile);
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'VIP Member',
          email: user.email || '',
          role: hasAdminClaim ? 'ADMIN' : 'USER',
          membershipTier: 'Gold VIP',
          loyaltyPoints: 0,
          tierProgressPercent: 0,
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile, { merge: true });
        setUserProfile(newProfile);
      }
    } catch (e) {
      console.warn('[NOIR Auth] UserProfile fetch warning (offline/cached):', e);
      // Fallback in-memory profile
      setUserProfile({
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'VIP Member',
        email: user.email || '',
        role: hasAdminClaim ? 'ADMIN' : 'USER',
        membershipTier: 'Gold VIP',
        loyaltyPoints: 0,
        tierProgressPercent: 0,
      });
    }
  }, []);

  useEffect(() => {
    // Listen to Firebase ID token and auth state changes
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        const hasAdmin = await verifyAdminClaims(user, false);
        await syncUserProfile(user, hasAdmin);
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [verifyAdminClaims, syncUserProfile]);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const hasAdmin = await verifyAdminClaims(cred.user, true);
    await syncUserProfile(cred.user, hasAdmin);
  };

  const adminLogin = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Please enter executive credentials.');
    }
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const hasAdmin = await verifyAdminClaims(cred.user, true);

    if (!hasAdmin) {
      await signOut(auth);
      setFirebaseUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      throw new Error('Access Denied: Account lacks verified custom claims (admin: true, role: "ADMIN").');
    }

    await syncUserProfile(cred.user, true);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    if (!email || !password || !name) {
      throw new Error('All required registration fields must be filled.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, { displayName: name.trim() });

    // Enforce safe default role: USER only. Never ADMIN.
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      role: 'USER',
      membershipTier: 'Gold VIP',
      loyaltyPoints: 0,
      tierProgressPercent: 0,
      createdAt: serverTimestamp(),
    };

    const userRef = doc(db, 'users', cred.user.uid);
    await setDoc(userRef, newProfile);
    setUserProfile(newProfile);
    setIsAdmin(false);
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      throw new Error('Please enter your email address.');
    }
    await sendPasswordResetEmail(auth, email.trim());
  };

  const checkAdminClaims = async (forceRefresh = true): Promise<boolean> => {
    if (!auth.currentUser) {
      setIsAdmin(false);
      return false;
    }
    return verifyAdminClaims(auth.currentUser, forceRefresh);
  };

  const updateMemberProfile = async (safeData: { name?: string; phone?: string }) => {
    if (!firebaseUser) throw new Error('No user is currently authenticated.');

    const updates: Partial<UserProfile> = {
      updatedAt: serverTimestamp(),
    };
    if (typeof safeData.name === 'string' && safeData.name.trim()) {
      updates.name = safeData.name.trim();
    }
    if (typeof safeData.phone === 'string') {
      updates.phone = safeData.phone.trim();
    }

    // Persist to Firestore
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, updates, { merge: true });

    // Update Firebase Auth displayName if name changed
    if (updates.name) {
      await updateProfile(firebaseUser, { displayName: updates.name });
    }

    // Refresh local user profile
    setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        loading,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
        forgotPassword,
        checkAdminClaims,
        updateMemberProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
