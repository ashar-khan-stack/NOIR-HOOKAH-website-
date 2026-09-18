import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SystemError, ErrorSeverity } from '../../types/errorMonitoring';
import { useAdminFcm } from '../../hooks/useAdminFcm';
import { errorMonitoringService } from '../../services/errorMonitoringService';
import {
  AlertOctagon,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Monitor,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

export const AdminSystemErrorsPage: React.FC = () => {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedError, setSelectedError] = useState<SystemError | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const {
    isSupported: fcmSupported,
    permission: fcmPermission,
    isRegistered: fcmRegistered,
    isLoading: fcmLoading,
    statusMessage: fcmStatusMessage,
    registerToken,
    unregisterToken,
  } = useAdminFcm();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'systemErrors'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const errorList: SystemError[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          errorList.push({
            id: docSnap.id,
            errorId: data.errorId || docSnap.id,
            fingerprint: data.fingerprint || '',
            message: data.message || 'Unknown runtime error',
            stack: data.stack || '',
            componentStack: data.componentStack || '',
            errorType: data.errorType || 'uncaught_error',
            severity: data.severity || 'error',
            url: data.url || '',
            pathname: data.pathname || '/',
            timestamp: data.timestamp || new Date().toISOString(),
            environment: data.environment || 'production',
            userId: data.userId || null,
            userEmail: data.userEmail || null,
            browser: data.browser || 'Unknown',
            browserVersion: data.browserVersion || '',
            operatingSystem: data.operatingSystem || 'Unknown',
            viewport: data.viewport || '0x0',
            appVersion: data.appVersion || '1.0.0',
            occurrenceCount: data.occurrenceCount || 1,
            notified: !!data.notified,
            notificationStatus: data.notificationStatus || 'PENDING',
            notificationError: data.notificationError || null,
            resolved: !!data.resolved,
            resolvedAt: data.resolvedAt || null,
            resolvedBy: data.resolvedBy || null,
          });
        });

        setErrors(errorList);
        setLoading(false);
      },
      (err) => {
        console.warn('[NOIR ErrorMonitoring] Snapshot subscription warning:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleToggleResolve = async (err: SystemError) => {
    try {
      const docRef = doc(db, 'systemErrors', err.id);
      await updateDoc(docRef, {
        resolved: !err.resolved,
        resolvedAt: !err.resolved ? new Date().toISOString() : null,
      });
      if (selectedError?.id === err.id) {
        setSelectedError({
          ...selectedError,
          resolved: !err.resolved,
          resolvedAt: !err.resolved ? new Date().toISOString() : null,
        });
      }
    } catch (e) {
      console.error('Failed to update resolution status:', e);
    }
  };

  const handleDeleteError = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'systemErrors', id));
      if (selectedError?.id === id) {
        setSelectedError(null);
      }
    } catch (e) {
      console.error('Failed to delete error record:', e);
    }
  };

  const handleTriggerTestError = async () => {
    setTestStatus('Emitting test error...');
    try {
      const testId = await errorMonitoringService.reportError(
        new Error(`NOIR Admin Test Anomaly (${new Date().toLocaleTimeString()})`),
        {
          errorType: 'manual_report',
          severity: 'warning',
          customMessage: `Test verification exception triggered from Executive Console at ${new Date().toLocaleTimeString()}`,
        }
      );
      setTestStatus(`Test anomaly ${testId ? 'logged' : 'handled'}`);
      setTimeout(() => setTestStatus(null), 4000);
    } catch (err: any) {
      setTestStatus('Test dispatch failed');
      setTimeout(() => setTestStatus(null), 4000);
    }
  };

  const filteredErrors = errors.filter((err) => {
    if (severityFilter !== 'all' && err.severity !== severityFilter) return false;
    if (statusFilter === 'unresolved' && err.resolved) return false;
    if (statusFilter === 'resolved' && !err.resolved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        err.message.toLowerCase().includes(q) ||
        err.pathname.toLowerCase().includes(q) ||
        err.fingerprint.toLowerCase().includes(q) ||
        err.errorType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-950/80 text-rose-300 border border-rose-600/60 uppercase tracking-wider">
            Critical
          </span>
        );
      case 'error':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-950/80 text-amber-300 border border-amber-600/60 uppercase tracking-wider">
            Error
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-yellow-950/60 text-yellow-300 border border-yellow-600/50 uppercase tracking-wider">
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-neutral-900 text-neutral-300 border border-neutral-700 uppercase tracking-wider">
            Info
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title="System Anomaly Monitoring"
      subtitle="Real-time production error capture, telemetry, and administrator FCM push notification pipeline"
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerTestError}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Error Capture</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Control Banner: FCM Push Status & Telemetry Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FCM Push Notification Management Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121218] to-[#0a0a0c] border border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-950/50 border border-rose-800/50 flex items-center justify-center text-rose-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Admin Push Alerts</h3>
                  <p className="text-[10px] text-neutral-400">Firebase Cloud Messaging</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  fcmRegistered
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                }`}
              >
                {fcmRegistered ? 'Active' : 'Inactive'}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Receive instant background push notifications whenever severe errors occur in production.
            </p>

            <div className="pt-1 flex items-center gap-2">
              {fcmRegistered ? (
                <button
                  onClick={unregisterToken}
                  disabled={fcmLoading}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <BellOff className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Disable On This Device</span>
                </button>
              ) : (
                <button
                  onClick={registerToken}
                  disabled={fcmLoading || !fcmSupported}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#500000] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{fcmLoading ? 'Enrolling...' : 'Activate Admin Push'}</span>
                </button>
              )}
            </div>
            {fcmStatusMessage && <p className="text-[11px] text-amber-400 font-mono">{fcmStatusMessage}</p>}
          </div>

          {/* Quick Stats: Unresolved Errors */}
          <div className="p-5 rounded-2xl bg-[#0a0a0c] border border-neutral-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Unresolved Anomalies</span>
              <AlertOctagon className="w-4 h-4 text-rose-500" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-serif-luxury font-bold text-white">
                {errors.filter((e) => !e.resolved).length}
              </span>
              <span className="text-xs text-neutral-500 ml-2">/ {errors.length} total logged</span>
            </div>
            <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Deduplicated in real-time</span>
            </div>
          </div>

          {/* Quick Stats: Critical Invocations */}
          <div className="p-5 rounded-2xl bg-[#0a0a0c] border border-neutral-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Critical Errors</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-serif-luxury font-bold text-amber-400">
                {errors.filter((e) => e.severity === 'critical').length}
              </span>
              <span className="text-xs text-neutral-500 ml-2">high-priority events</span>
            </div>
            <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-neutral-400" />
              <span>Automatic stack sanitization</span>
            </div>
          </div>
        </div>

        {testStatus && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Zap className="w-4 h-4" />
            <span>{testStatus}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by message, pathname (/checkout), or fingerprint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="py-2 px-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            {/* Resolution Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-2 px-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Error Records Table */}
        <div className="rounded-2xl bg-[#0a0a0c] border border-neutral-800/80 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-neutral-500 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#d4af37]" />
              <span>Synchronizing error registry...</span>
            </div>
          ) : filteredErrors.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">System Pristine</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No matching runtime anomalies recorded. The NOIR HOOKAH digital ecosystem is performing optimally.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Error Summary</th>
                    <th className="py-3 px-4">Route / Origin</th>
                    <th className="py-3 px-4 text-center">Hits</th>
                    <th className="py-3 px-4">FCM Dispatch</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-xs">
                  {filteredErrors.map((err) => (
                    <tr
                      key={err.id}
                      className={`hover:bg-neutral-900/50 transition cursor-pointer ${
                        err.resolved ? 'opacity-60 bg-neutral-950/40' : ''
                      }`}
                      onClick={() => setSelectedError(err)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">{getSeverityBadge(err.severity)}</td>
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <div className="font-semibold text-white truncate">{err.message}</div>
                        <div className="text-[10px] text-neutral-500 font-mono truncate">
                          {err.errorType} &bull; {err.fingerprint}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-md border border-[#d4af37]/20">
                          {err.pathname}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 font-mono text-[11px] border border-neutral-800">
                          {err.occurrenceCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            err.notificationStatus === 'SENT'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                              : err.notificationStatus === 'SKIPPED'
                              ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                              : 'bg-amber-950/50 text-amber-300 border border-amber-800/50'
                          }`}
                        >
                          {err.notificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-400 text-[11px] font-mono">
                        {new Date(err.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedError(err)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleResolve(err)}
                            className={`p-1.5 rounded-lg transition ${
                              err.resolved
                                ? 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                            }`}
                            title={err.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteError(err.id)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/60 text-neutral-500 hover:text-rose-400 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Error Inspector Drawer/Modal */}
        {selectedError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#0a0a0c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(selectedError.severity)}
                    <span className="font-mono text-xs text-neutral-500">{selectedError.errorId}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{selectedError.message}</h3>
                </div>
                <button
                  onClick={() => setSelectedError(null)}
                  className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Context Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Route</span>
                  <span className="font-mono text-white truncate block">{selectedError.pathname}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Occurrences</span>
                  <span className="font-mono text-white font-bold block">{selectedError.occurrenceCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Client OS / Device</span>
                  <span className="text-white truncate block">{selectedError.operatingSystem}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Browser</span>
                  <span className="text-white truncate block">
                    {selectedError.browser} {selectedError.browserVersion}
                  </span>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-neutral-500">Fingerprint:</span>
                  <span className="font-mono text-neutral-300">{selectedError.fingerprint}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-neutral-500">Full URL:</span>
                  <span className="font-mono text-neutral-300 truncate max-w-md">{selectedError.url || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-neutral-500">Viewport:</span>
                  <span className="font-mono text-neutral-300">{selectedError.viewport}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-neutral-500">User Context:</span>
                  <span className="font-mono text-neutral-300">
                    {selectedError.userEmail ? `${selectedError.userEmail} (${selectedError.userId})` : 'Anonymous Guest'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900">
                  <span className="text-neutral-500">FCM Notification:</span>
                  <span className="font-mono text-neutral-300">{selectedError.notificationStatus}</span>
                </div>
              </div>

              {/* Stack Trace Viewer */}
              {selectedError.stack && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400 block uppercase tracking-wider">
                    Sanitized Stack Trace
                  </span>
                  <pre className="p-4 rounded-xl bg-black/90 border border-neutral-800 text-[11px] font-mono text-rose-300/90 overflow-x-auto custom-scrollbar max-h-60 whitespace-pre-wrap leading-relaxed">
                    {selectedError.stack}
                  </pre>
                </div>
              )}

              {/* Component Stack if React Error */}
              {selectedError.componentStack && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400 block uppercase tracking-wider">
                    React Component Hierarchy
                  </span>
                  <pre className="p-4 rounded-xl bg-black/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 overflow-x-auto custom-scrollbar max-h-40 whitespace-pre-wrap">
                    {selectedError.componentStack}
                  </pre>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-neutral-500 font-mono">
                  Recorded: {new Date(selectedError.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleToggleResolve(selectedError)}
                    className={`flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      selectedError.resolved
                        ? 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
                        : 'bg-emerald-950 border border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedError.resolved ? 'Reopen Anomaly' : 'Resolve Anomaly'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteError(selectedError.id)}
                    className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-rose-950/60 border border-neutral-800 hover:border-rose-800 text-rose-400 text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSystemErrorsPage;
