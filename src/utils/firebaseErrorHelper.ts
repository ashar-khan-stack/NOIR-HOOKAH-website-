/**
 * Translates Firebase & Network error codes into polished, human-friendly messages.
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error?.code || '';
  const message = error?.message || '';

  // Firebase Auth Error Codes
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email address already exists. Please log in.';
  }
  if (code === 'auth/weak-password') {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/user-disabled') {
    return 'This account has been suspended by lounge management. Please contact concierge.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. For your security, this action has been temporarily throttled. Try again in a few moments.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection failed. Please verify your internet connection and retry.';
  }
  if (code === 'auth/requires-recent-login') {
    return 'This operation requires recent authentication. Please sign out and sign in again.';
  }

  // Firestore Error Codes
  if (code === 'permission-denied') {
    return 'Access denied. You do not have sufficient privileges for this lounge resource.';
  }
  if (code === 'unavailable') {
    return 'The NOIR lounge server is temporarily unavailable. Cached offline assets are being served.';
  }
  if (code === 'deadline-exceeded') {
    return 'The dispatch request timed out. Please check your network connection.';
  }
  if (code === 'not-found') {
    return 'The requested lounge item or record was not found.';
  }
  if (code === 'already-exists') {
    return 'This document or reservation entry already exists.';
  }

  // Firebase Storage Error Codes
  if (code === 'storage/unauthorized') {
    return 'Storage access denied. Only verified administrators can upload executive catalog assets.';
  }
  if (code === 'storage/canceled') {
    return 'Media upload was cancelled.';
  }
  if (code === 'storage/quota-exceeded') {
    return 'Storage quota exceeded. Please contact system operations.';
  }
  if (code === 'storage/invalid-checksum') {
    return 'Asset upload corrupted. Please try uploading the image again.';
  }

  // Generic fallback with cleaner message
  if (message.includes('offline') || message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'You are currently offline or connection was interrupted. Please check your internet connection.';
  }

  return message.length < 150 ? message : 'An unexpected error occurred. Please try again.';
}
