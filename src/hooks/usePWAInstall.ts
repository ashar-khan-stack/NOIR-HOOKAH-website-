import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'noir_pwa_dismissed_at';
const DISMISS_DURATION_DAYS = 7;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check recent dismissal
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
        if (daysSince < DISMISS_DURATION_DAYS) {
          setIsDismissed(true);
        }
      }
    } catch {
      // Ignore storage access issues
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      } else {
        dismiss();
        return false;
      }
    } catch (err) {
      console.error('[NOIR PWA] Prompt failed:', err);
      return false;
    }
  };

  const dismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Ignore
    }
  };

  return {
    isInstallable: !!deferredPrompt && !isDismissed && !isInstalled,
    isInstalled,
    isIOS: isIOS && !isDismissed && !isInstalled,
    install,
    dismiss,
  };
}
