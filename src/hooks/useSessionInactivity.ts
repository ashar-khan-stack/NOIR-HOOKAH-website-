import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 Minutes

export const useSessionInactivity = () => {
  const { firebaseUser, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTimeout = useCallback(async () => {
    console.warn('[NOIR Security] 30 minutes inactivity reached. Terminating Firebase Auth session.');
    try {
      await logout();
    } catch (e) {
      console.error('[NOIR Security] Logout on timeout error:', e);
    }
    navigate('/login', {
      replace: true,
      state: { sessionExpired: true, message: 'Your session has expired due to 30 minutes of inactivity.' },
    });
  }, [logout, navigate]);

  useEffect(() => {
    if (!firebaseUser) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        handleTimeout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    // Track user interactions
    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'keydown',
      'click',
      'touchstart',
      'scroll',
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start initial 30 min timer
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [firebaseUser, handleTimeout]);
};
