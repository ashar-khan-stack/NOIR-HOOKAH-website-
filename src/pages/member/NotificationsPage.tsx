import React, { useState, useEffect } from 'react';
import { MemberLayout } from '../../layouts/MemberLayout';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  Calendar,
  ShoppingBag,
  Tag,
  Crown,
  Filter,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [isPushActive, setIsPushActive] = useState<boolean>(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setNotifications(notificationService.getNotifications());
      setIsPushActive(notificationService.isPushActive());
      setLoading(false);
    };

    update();
    const unsubscribe = notificationService.subscribe(update);
    return () => unsubscribe();
  }, []);

  const handleTogglePush = async () => {
    if (!isPushActive) {
      setPushStatusMessage('Requesting VIP push dispatch permissions...');
      const success = await notificationService.requestPushPermission();
      if (success) {
        setIsPushActive(true);
        setPushStatusMessage('VIP dispatches enabled on this device.');
      } else {
        setPushStatusMessage('Push notifications permission was not granted.');
      }
      setTimeout(() => setPushStatusMessage(''), 4000);
    } else {
      notificationService.setPushActive(false);
      setIsPushActive(false);
      setPushStatusMessage('VIP push notifications paused on this browser.');
      setTimeout(() => setPushStatusMessage(''), 3000);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (unreadOnly && n.read) return false;
    if (selectedCategory === 'all') return true;
    return n.type === selectedCategory;
  });

  const getCategoryIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-[#d4af37]" />;
      case 'reservation':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-amber-400" />;
      case 'drop':
        return <Sparkles className="w-4 h-4 text-[#f7e7ce]" />;
      case 'privilege':
      case 'announcement':
        return <Crown className="w-4 h-4 text-[#d4af37]" />;
      case 'tasting':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-400" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Dispatches' },
    { id: 'announcement', label: 'VIP Announcements' },
    { id: 'order', label: 'Table Orders' },
    { id: 'reservation', label: 'Reservations' },
    { id: 'drop', label: 'Special Drops' },
    { id: 'offer', label: 'Exclusive Perks' },
  ];

  return (
    <MemberLayout
      title="VIP Dispatches & Notifications"
      subtitle="Real-time lounge updates, dispatch statuses, and private privileges."
    >
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
        {/* Top Control Header Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#14141a] via-[#101014] to-[#0a0a0c] border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-serif-luxury font-bold text-xl text-white">VIP Dispatches</h1>
                  <p className="text-xs text-neutral-400">
                    {unreadCount > 0 ? (
                      <span className="text-[#d4af37] font-semibold">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
                    ) : (
                      'All dispatches up to date'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Push Permission Toggle */}
              <button
                onClick={handleTogglePush}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition shadow-sm ${
                  isPushActive
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/50'
                    : 'bg-[#181820] border-neutral-700 text-neutral-300 hover:border-[#d4af37]/50'
                }`}
              >
                {isPushActive ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Push Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Enable VIP Push</span>
                  </>
                )}
              </button>

              {/* Mark All As Read */}
              {unreadCount > 0 && (
                <button
                  onClick={() => notificationService.markAllAsRead()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs flex items-center gap-1.5 transition shadow-md"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>
          </div>

          {pushStatusMessage && (
            <div className="mt-4 p-2.5 rounded-xl bg-[#181820] border border-[#d4af37]/40 text-[#f7e7ce] text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>{pushStatusMessage}</span>
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#d4af37] text-black font-bold shadow-md'
                    : 'bg-[#121216] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Unread Only Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                unreadOnly
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7e7ce]'
                  : 'bg-[#121216] border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Unread Only</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#d4af37] text-black rounded-full text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notification Stream */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#121216] border border-neutral-800 animate-pulse space-y-2">
                <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-3 bg-neutral-850 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#121216]/60 border border-neutral-800/80 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#181820] border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury font-bold text-white text-base">No Dispatches Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {unreadOnly
                ? 'You have read all notifications in this category.'
                : 'No lounge dispatches or announcements match your current filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-[#101014]/80 border-neutral-850 opacity-80'
                    : 'bg-gradient-to-r from-[#181822] via-[#14141c] to-[#121216] border-[#d4af37]/40 shadow-xl'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0a0c] border border-neutral-800 flex items-center justify-center shrink-0">
                    {getCategoryIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">{notif.title}</h4>
                        {!notif.read && (
                          <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] text-[9px] uppercase font-bold tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono shrink-0">
                        <Clock className="w-3 h-3 text-neutral-600" />
                        <span>{notif.date}</span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-xs leading-relaxed">{notif.message}</p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                        Sector: {notif.type}
                      </span>
                      {!notif.read && (
                        <button
                          onClick={() => notificationService.markAsRead(notif.id)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/40 text-[#f7e7ce] text-[11px] flex items-center gap-1 transition"
                        >
                          <Check className="w-3 h-3 text-[#d4af37]" />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
