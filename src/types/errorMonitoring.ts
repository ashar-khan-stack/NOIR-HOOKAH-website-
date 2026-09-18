export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type ErrorSourceType =
  | 'uncaught_error'
  | 'unhandled_rejection'
  | 'react_error'
  | 'firebase_error'
  | 'network_error'
  | 'manual_report';

export type NotificationDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED';

export interface SystemError {
  id: string;
  errorId: string;
  fingerprint: string;
  message: string;
  stack?: string;
  componentStack?: string;
  errorType: ErrorSourceType;
  severity: ErrorSeverity;
  url: string;
  pathname: string;
  timestamp: string; // ISO string
  createdAt?: any; // Firestore server timestamp
  lastSeen?: any;
  environment: 'production' | 'development';
  userId?: string | null;
  userEmail?: string | null;
  browser: string;
  browserVersion?: string;
  operatingSystem: string;
  viewport: string;
  appVersion: string;
  occurrenceCount: number;
  notified: boolean;
  notificationStatus: NotificationDeliveryStatus;
  notificationError?: string | null;
  resolved: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
}

export interface AdminFcmToken {
  tokenId: string;
  token: string;
  userId: string;
  userEmail?: string | null;
  userAgent: string;
  platform: string;
  active: boolean;
  createdAt: any;
  lastSeen: any;
}
