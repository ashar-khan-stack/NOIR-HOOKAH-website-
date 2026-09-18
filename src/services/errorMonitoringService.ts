import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, auth, functions } from '../firebase/firebaseConfig';
import { SystemError, ErrorSeverity, ErrorSourceType } from '../types/errorMonitoring';

// Maximum length for messages and stack traces to prevent oversized payloads
const MAX_MESSAGE_LENGTH = 1500;
const MAX_STACK_LENGTH = 3000;
const DEDUPLICATION_WINDOW_MS = 15000; // 15 seconds client-side throttle per fingerprint

class ErrorMonitoringService {
  private isInitialized = false;
  private isReporting = false;
  private recentFingerprints = new Map<string, number>();

  /**
   * Initialize global runtime error and rejection listeners
   */
  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Uncaught global JavaScript errors
    window.addEventListener('error', (event: ErrorEvent) => {
      // Ignore benign script loading errors from browser extensions
      if (!event.error && !event.message) return;
      if (this.isIgnorableError(event.message)) return;

      this.reportError(event.error || new Error(event.message), {
        errorType: 'uncaught_error',
        severity: 'error',
        customMessage: event.message,
      });
    });

    // 2. Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      let reason = event.reason;
      let message = 'Unhandled Promise Rejection';
      let stack = '';

      if (reason instanceof Error) {
        message = reason.message;
        stack = reason.stack || '';
      } else if (typeof reason === 'string') {
        message = reason;
      } else if (reason && typeof reason === 'object') {
        try {
          message = JSON.stringify(reason);
        } catch {
          message = String(reason);
        }
      }

      if (this.isIgnorableError(message)) return;

      this.reportError(reason instanceof Error ? reason : new Error(message), {
        errorType: 'unhandled_rejection',
        severity: 'error',
        customMessage: message,
        stackOverride: stack,
      });
    });
  }

  /**
   * Check if the error is benign or from browser extensions/known noise
   */
  private isIgnorableError(message: string): boolean {
    if (!message) return false;
    const lower = message.toLowerCase();
    return (
      lower.includes('resizeobserver loop limit exceeded') ||
      lower.includes('resizeobserver loop completed with undelivered notifications') ||
      lower.includes('script error.') ||
      lower.includes('chrome-extension://') ||
      lower.includes('moz-extension://') ||
      lower.includes('safari-extension://')
    );
  }

  /**
   * Sanitizes sensitive information (passwords, tokens, keys)
   */
  public sanitize(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      // Passwords in queries or bodies
      .replace(/(password|pwd|secret|auth|apiKey|api_key|token)=([^\s&"'`]+)/gi, '$1=***REDACTED***')
      // Bearer tokens
      .replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, 'Bearer ***REDACTED***')
      // Firebase standard API keys
      .replace(/AIza[0-9A-Za-z-_]{35}/g, 'AIza***REDACTED***')
      // Credit card numbers (approximate 13-19 digits)
      .replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '****-****-****-****');
  }

  /**
   * Generate deterministic hash for error fingerprinting
   */
  public generateFingerprint(type: string, message: string, stack: string, pathname: string): string {
    const normMsg = message.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<UUID>')
      .replace(/\d+/g, '<NUM>')
      .trim()
      .slice(0, 150);

    const firstStackLine = (stack || '')
      .split('\n')
      .slice(0, 2)
      .join(' ')
      .replace(/https?:\/\/[^/]+/g, '')
      .replace(/:\d+:\d+/g, '')
      .trim()
      .slice(0, 150);

    const raw = `${type}::${pathname}::${normMsg}::${firstStackLine}`;
    
    // Fast string DJB2 hash
    let hash = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) + hash) + raw.charCodeAt(i);
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `fp_${hex}`;
  }

  /**
   * Detect client environment details
   */
  private getEnvironmentDetails() {
    let browser = 'Unknown Browser';
    let browserVersion = '';
    let operatingSystem = 'Unknown OS';

    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      
      // OS Detection
      if (/Windows/i.test(ua)) operatingSystem = 'Windows';
      else if (/Macintosh|Mac OS X/i.test(ua)) operatingSystem = 'macOS';
      else if (/iPhone|iPad|iPod/i.test(ua)) operatingSystem = 'iOS';
      else if (/Android/i.test(ua)) operatingSystem = 'Android';
      else if (/Linux/i.test(ua)) operatingSystem = 'Linux';

      // Browser Detection
      if (/Edg\//i.test(ua)) {
        browser = 'Microsoft Edge';
        browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || '';
      } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
        browser = 'Chrome';
        browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
      } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
        browser = 'Safari';
        browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
      } else if (/Firefox\//i.test(ua)) {
        browser = 'Firefox';
        browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
      }
    }

    const viewport = typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : '0x0';

    return { browser, browserVersion, operatingSystem, viewport };
  }

  /**
   * Main reporting method.
   */
  public async reportError(
    error: Error | any,
    options: {
      errorType?: ErrorSourceType;
      severity?: ErrorSeverity;
      customMessage?: string;
      componentStack?: string;
      stackOverride?: string;
    } = {}
  ): Promise<string | null> {
    // Prevent infinite recursive error reporting
    if (this.isReporting) return null;
    this.isReporting = true;

    try {
      const errorType = options.errorType || 'uncaught_error';
      const severity = options.severity || 'error';
      const rawMessage = options.customMessage || error?.message || (typeof error === 'string' ? error : 'Unknown runtime anomaly');
      const sanitizedMessage = this.sanitize(String(rawMessage)).slice(0, MAX_MESSAGE_LENGTH);

      const rawStack = options.stackOverride || error?.stack || '';
      const sanitizedStack = this.sanitize(String(rawStack)).slice(0, MAX_STACK_LENGTH);
      const sanitizedComponentStack = options.componentStack ? this.sanitize(options.componentStack).slice(0, 1000) : undefined;

      const url = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

      const fingerprint = this.generateFingerprint(errorType, sanitizedMessage, sanitizedStack, pathname);
      const errorId = `err_${fingerprint.replace('fp_', '')}`;

      // Deduplication check: Debounce rapid repeated errors locally
      const now = Date.now();
      const lastReported = this.recentFingerprints.get(fingerprint);
      if (lastReported && now - lastReported < DEDUPLICATION_WINDOW_MS) {
        // Debounce: update in-memory record and return existing errorId
        return errorId;
      }
      this.recentFingerprints.set(fingerprint, now);

      const { browser, browserVersion, operatingSystem, viewport } = this.getEnvironmentDetails();
      const currentUser = auth?.currentUser;

      const errorPayload: Partial<SystemError> = {
        id: errorId,
        errorId: errorId,
        fingerprint,
        message: sanitizedMessage,
        stack: sanitizedStack,
        componentStack: sanitizedComponentStack,
        errorType,
        severity,
        url,
        pathname,
        timestamp: new Date().toISOString(),
        environment: import.meta.env.PROD ? 'production' : 'development',
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || null,
        browser,
        browserVersion,
        operatingSystem,
        viewport,
        appVersion: '1.0.0-noir',
        notified: false,
        notificationStatus: 'PENDING',
        resolved: false,
      };

      // Ingest anomaly via secure Cloud Function serverless endpoint
      try {
        const reportCallable = httpsCallable(functions, 'reportSystemErrorCallable');
        await reportCallable({
          fingerprint,
          message: sanitizedMessage,
          stack: sanitizedStack,
          componentStack: sanitizedComponentStack,
          errorType,
          severity,
          url,
          pathname,
          browser,
          browserVersion,
          operatingSystem,
          viewport,
          appVersion: '1.0.0-noir',
        });
      } catch (functionErr) {
        // If Cloud Function invocation fails (e.g. offline or transient network issue),
        // check if authenticated user is Executive Admin to attempt direct Firestore write
        if (currentUser) {
          try {
            const tokenResult = await currentUser.getIdTokenResult();
            if (tokenResult.claims.admin === true && tokenResult.claims.role === 'ADMIN') {
              const errorDocRef = doc(db, 'systemErrors', errorId);
              const docSnap = await getDoc(errorDocRef);
              if (docSnap.exists()) {
                await updateDoc(errorDocRef, {
                  occurrenceCount: increment(1),
                  lastSeen: serverTimestamp(),
                  viewport,
                  url,
                  pathname,
                });
              } else {
                await setDoc(errorDocRef, {
                  ...errorPayload,
                  occurrenceCount: 1,
                  createdAt: serverTimestamp(),
                  lastSeen: serverTimestamp(),
                });
              }
            }
          } catch (e) {
            // Silently handle fallback write failures without throwing
          }
        }
      }

      return errorId;
    } catch (criticalErr) {
      // Service must never throw or disrupt the application
      if (import.meta.env.DEV) {
        console.warn('[NOIR ErrorMonitoring] Reporting failure caught safely:', criticalErr);
      }
      return null;
    } finally {
      this.isReporting = false;
    }
  }
}

export const errorMonitoringService = new ErrorMonitoringService();
export default errorMonitoringService;
