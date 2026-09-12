import React, { useState, useEffect } from 'react';
import { NotificationItem } from '../../types';
import { notificationService } from '../../services/notificationService';
import { Bell, X, Check, Sparkles, AlertCircle, Calendar, Tag } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isPushActive, setIsPushActive] = useState(true);

  useEffect(() => {
    const update = () => {
      setNotifications(notificationService.getNotifications());
      setIsPushActive(notificationService.isPushActive());
    };
    update();
    const unsubscribe = notificationService.subscribe(update);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleTogglePush = async () => {
    if (!isPushActive) {
      await notificationService.requestPushPermission();
    } else {
      notificationService.setPushActive(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return <Calendar className="w-4 h-4 text-[#d4af37]" />;
      case 'drop':
        return <Sparkles className="w-4 h-4 text-[#f7e7ce]" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-[#0e0e12] border-l border-[#d4af37]/30 text-neutral-200 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-cinzel text-base font-bold text-white tracking-widest">
                VIP NOTIFICATIONS
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Banner */}
          <div className="p-4 bg-[#14141a] border-b border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-300">Push Notifications</span>
            <button
              onClick={handleTogglePush}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                isPushActive
                  ? 'bg-[#d4af37] text-[#0a0a0c]'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isPushActive ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => notificationService.markAsRead(notif.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    notif.read
                      ? 'bg-[#121216] border-neutral-850 opacity-75'
                      : 'bg-[#181820] border-[#d4af37]/30 shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{notif.title}</h4>
                        <span className="text-[10px] text-neutral-500">{notif.date}</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-neutral-800 bg-[#0a0a0c] text-center">
            <button
              onClick={() => notificationService.markAllAsRead()}
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-[#f7e7ce] transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
