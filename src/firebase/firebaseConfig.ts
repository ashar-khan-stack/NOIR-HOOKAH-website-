import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCTzD1sRCKJXpYIv6skMLOzIus_bUbVjl4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'noir-hookah-f4492.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'noir-hookah-f4492',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'noir-hookah-f4492.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '874569819276',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:874569819276:web:6fcc46dea87cf1e4f947a9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EY7SG3B68F',
};

// Initialize Firebase App singleton using Modular SDK
export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Analytics (safe client-side initialization)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn('[NOIR Firebase] Analytics initialization skipped:', err);
    });
}

export default app;
