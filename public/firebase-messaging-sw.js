// Scripts for Firebase Cloud Messaging background notification handler
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCTzD1sRCKJXpYIv6skMLOzIus_bUbVjl4",
  authDomain: "noir-hookah-f4492.firebaseapp.com",
  projectId: "noir-hookah-f4492",
  storageBucket: "noir-hookah-f4492.firebasestorage.app",
  messagingSenderId: "874569819276",
  appId: "1:874569819276:web:6fcc46dea87cf1e4f947a9"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || 'NOIR HOOKAH Dispatch';
    const notificationOptions = {
      body: payload.notification?.body || 'VIP table and lounge service update.',
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (err) {
  // Background messaging gracefully idle if offline or unsupported
  console.debug('[NOIR FCM SW] Idle background worker:', err);
}
