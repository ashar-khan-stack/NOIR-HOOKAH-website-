import { useEffect, useRef } from 'react';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 Minutes

export const useSessionInactivity = (onTimeout: () => void, isLoggedIn: boolean) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        console.warn('[NOIR Security] User session timed out after 30 minutes of inactivity.');
        onTimeout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    // Events that signify user activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start initial timer
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn, onTimeout]);
};
