import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-neutral-900 border border-amber-500/50 px-4 py-2.5 text-xs font-semibold text-amber-200 shadow-2xl backdrop-blur-md">
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>Offline Mode — Cached menu & app details available.</span>
    </div>
  );
};
