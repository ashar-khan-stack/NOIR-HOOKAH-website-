import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminFcmService } from '../services/adminFcmService';

export function useAdminFcm() {
  const { firebaseUser, isAdmin } = useAuth();
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    adminFcmService.isMessagingSupported().then((supported) => {
      if (isMounted) {
        setIsSupported(supported);
        if (typeof Notification !== 'undefined') {
          setPermission(Notification.permission);
          const hasStoredToken = !!localStorage.getItem('noir_admin_fcm_token_id');
          setIsRegistered(hasStoredToken && Notification.permission === 'granted');
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const registerToken = useCallback(async () => {
    if (!isAdmin || !firebaseUser) {
      setStatusMessage('Executive administrator privileges required.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Requesting push notification permission...');

    const result = await adminFcmService.registerAdminFcmToken();
    setIsLoading(false);

    if (result.success) {
      setIsRegistered(true);
      if (typeof Notification !== 'undefined') {
        setPermission(Notification.permission);
      }
      setStatusMessage('Admin push alerts activated successfully.');
    } else {
      setStatusMessage(result.error || 'Failed to activate push notifications.');
    }
  }, [isAdmin, firebaseUser]);

  const unregisterToken = useCallback(async () => {
    setIsLoading(true);
    await adminFcmService.unregisterAdminFcmToken();
    setIsRegistered(false);
    setIsLoading(false);
    setStatusMessage('Admin push alerts deactivated.');
  }, []);

  return {
    isSupported,
    permission,
    isRegistered,
    isLoading,
    statusMessage,
    registerToken,
    unregisterToken,
  };
}
