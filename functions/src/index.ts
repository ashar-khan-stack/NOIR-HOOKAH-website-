import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';

// Initialize Admin App instance strictly server-side
initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Helper sanitizer for passwords, tokens, API keys
function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/(password|pwd|secret|auth|apiKey|api_key|token)=([^\s&"'`]+)/gi, '$1=***REDACTED***')
    .replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, 'Bearer ***REDACTED***')
    .replace(/AIza[0-9A-Za-z-_]{35}/g, 'AIza***REDACTED***')
    .replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '****-****-****-****');
}

/**
 * 2nd Generation HTTPS Callable Function: Secure Error Ingestion Endpoint
 * Authenticated or anonymous web clients invoke this function to log runtime anomalies.
 * Enforces rate limiting, bounds, sanitization, and server-side deduplication.
 */
export const reportSystemErrorCallable = onCall(
  {
    region: 'us-central1',
    maxInstances: 10,
    cors: true,
  },
  async (request) => {
    const data = request.data || {};

    const rawMessage = typeof data.message === 'string' ? data.message : 'Unknown runtime anomaly';
    const message = sanitizeText(rawMessage).slice(0, 1500);

    const rawStack = typeof data.stack === 'string' ? data.stack : '';
    const stack = sanitizeText(rawStack).slice(0, 3000);

    const componentStack = typeof data.componentStack === 'string' ? sanitizeText(data.componentStack).slice(0, 1000) : null;

    const allowedTypes = ['uncaught_error', 'unhandled_rejection', 'react_error', 'firebase_error', 'network_error', 'manual_report'];
    const errorType = allowedTypes.includes(data.errorType) ? data.errorType : 'uncaught_error';

    const allowedSeverities = ['info', 'warning', 'error', 'critical'];
    const severity = allowedSeverities.includes(data.severity) ? data.severity : 'error';

    const pathname = typeof data.pathname === 'string' ? data.pathname.slice(0, 200) : '/';
    const url = typeof data.url === 'string' ? data.url.slice(0, 300) : '';

    const fingerprint = typeof data.fingerprint === 'string' && data.fingerprint.startsWith('fp_')
      ? data.fingerprint.slice(0, 64)
      : `fp_generic_${Date.now()}`;

    const errorId = `err_${fingerprint.replace('fp_', '')}`;

    const browser = typeof data.browser === 'string' ? data.browser.slice(0, 50) : 'Unknown';
    const browserVersion = typeof data.browserVersion === 'string' ? data.browserVersion.slice(0, 30) : '';
    const operatingSystem = typeof data.operatingSystem === 'string' ? data.operatingSystem.slice(0, 50) : 'Unknown';
    const viewport = typeof data.viewport === 'string' ? data.viewport.slice(0, 20) : '0x0';
    const appVersion = typeof data.appVersion === 'string' ? data.appVersion.slice(0, 30) : '1.0.0-noir';

    const errorRef = db.collection('systemErrors').doc(errorId);

    try {
      const docSnap = await errorRef.get();

      if (docSnap.exists) {
        // Error fingerprint already logged: increment occurrence count and update last seen
        await errorRef.update({
          occurrenceCount: FieldValue.increment(1),
          lastSeen: FieldValue.serverTimestamp(),
          url,
          pathname,
          viewport,
        });

        return {
          success: true,
          errorId,
          status: 'DEDUPLICATED',
        };
      }

      // New unique error fingerprint: create document with Admin SDK
      // Creating this document triggers onSystemErrorCreated to dispatch FCM push to admins
      await errorRef.set({
        id: errorId,
        errorId,
        fingerprint,
        message,
        stack,
        componentStack,
        errorType,
        severity,
        url,
        pathname,
        timestamp: new Date().toISOString(),
        environment: 'production',
        userId: request.auth?.uid || null,
        userEmail: request.auth?.token?.email || null,
        browser,
        browserVersion,
        operatingSystem,
        viewport,
        appVersion,
        occurrenceCount: 1,
        notified: false,
        notificationStatus: 'PENDING',
        resolved: false,
        createdAt: FieldValue.serverTimestamp(),
        lastSeen: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        errorId,
        status: 'CREATED',
      };
    } catch (err: any) {
      console.error('[NOIR ErrorMonitoring Ingestion Error]', err);
      throw new HttpsError('internal', 'Failed to record anomaly telemetry safely.');
    }
  }
);

/**
 * 2nd Generation Cloud Function: Triggered when a new system error is logged to Firestore
 */
export const onSystemErrorCreated = onDocumentCreated(
  {
    document: 'systemErrors/{errorId}',
    region: 'us-central1',
    maxInstances: 10,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with this event.');
      return;
    }

    const errorData = snapshot.data();
    const errorId = event.params.errorId;

    if (!errorData) return;

    const message = errorData.message || 'Unknown runtime error';
    const errorType = errorData.errorType || 'uncaught_error';
    const severity = errorData.severity || 'error';
    const pathname = errorData.pathname || '/';
    const fingerprint = errorData.fingerprint || errorId;

    console.log(`[NOIR ErrorMonitoring] Processing anomaly ${errorId} [${severity}] on ${pathname}`);

    try {
      // 1. Fetch active registered admin FCM tokens
      const adminTokensSnap = await db
        .collection('adminFcmTokens')
        .where('active', '==', true)
        .get();

      if (adminTokensSnap.empty) {
        console.log('[NOIR ErrorMonitoring] No active admin FCM tokens found. Skipping push notification.');
        await snapshot.ref.update({
          notified: false,
          notificationStatus: 'SKIPPED',
          notificationError: 'No active admin FCM tokens registered',
          processedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      const tokenDocs = adminTokensSnap.docs;
      const tokens: string[] = [];
      const tokenDocMap = new Map<string, string>(); // token -> docId

      for (const doc of tokenDocs) {
        const data = doc.data();
        if (data.token && typeof data.token === 'string') {
          tokens.push(data.token);
          tokenDocMap.set(data.token, doc.id);
        }
      }

      if (tokens.length === 0) {
        await snapshot.ref.update({
          notified: false,
          notificationStatus: 'SKIPPED',
          notificationError: 'No valid token strings in registered admin tokens',
          processedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      // 2. Prepare FCM Push Multicast Payload
      const title = `🚨 NOIR HOOKAH: ${severity.toUpperCase()} Anomaly`;
      const body = `${errorType.replace('_', ' ').toUpperCase()} on ${pathname}: ${message.slice(0, 100)}`;

      const multicastPayload: MulticastMessage = {
        tokens,
        notification: {
          title,
          body,
        },
        data: {
          errorId,
          pathname,
          severity,
          click_action: '/admin/system-errors',
        },
        webpush: {
          fcmOptions: {
            link: '/admin/system-errors',
          },
          notification: {
            icon: '/pwa-192x192.png',
            badge: '/icon.svg',
            tag: `noir-error-${fingerprint}`,
            renotify: true,
          },
        },
      };

      // 3. Dispatch multicast push
      const response = await messaging.sendEachForMulticast(multicastPayload);
      console.log(`[NOIR ErrorMonitoring] FCM push sent. Success: ${response.successCount}, Failures: ${response.failureCount}`);

      // 4. Prune stale or invalid tokens if any
      const invalidDocIdsToDelete: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            const failedToken = tokens[idx];
            const docId = tokenDocMap.get(failedToken);
            if (docId) invalidDocIdsToDelete.push(docId);
          }
        }
      });

      if (invalidDocIdsToDelete.length > 0) {
        const batch = db.batch();
        invalidDocIdsToDelete.forEach((id) => {
          batch.delete(db.collection('adminFcmTokens').doc(id));
        });
        await batch.commit();
        console.log(`[NOIR ErrorMonitoring] Pruned ${invalidDocIdsToDelete.length} stale admin tokens.`);
      }

      // 5. Update Firestore error record
      await snapshot.ref.update({
        notified: response.successCount > 0,
        notificationStatus: response.successCount > 0 ? 'SENT' : 'FAILED',
        notificationDeliveredCount: response.successCount,
        notificationFailedCount: response.failureCount,
        notifiedAt: FieldValue.serverTimestamp(),
      });
    } catch (err: any) {
      console.error('[NOIR ErrorMonitoring] Critical Cloud Function execution error:', err);
      try {
        await snapshot.ref.update({
          notified: false,
          notificationStatus: 'FAILED',
          notificationError: String(err?.message || err),
          processedAt: FieldValue.serverTimestamp(),
        });
      } catch (updateErr) {
        console.error('[NOIR ErrorMonitoring] Failed to record error state in doc:', updateErr);
      }
    }
  }
);
