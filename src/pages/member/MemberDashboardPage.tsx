import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MemberLayout } from '../../layouts/MemberLayout';
import { firestoreService } from '../../services/firestoreService';
import { notificationService } from '../../services/notificationService';
import { Order, Reservation, NotificationItem } from '../../types';
import {
  Crown,
  Sparkles,
  Calendar,
  Clock,
  ShoppingBag,
  Wind,
  Utensils,
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const MemberDashboardPage: React.FC = () => {
  const { userProfile, firebaseUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const currentUid = firebaseUser?.uid;
  const currentEmail = firebaseUser?.email || userProfile?.email;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoadingData(true);
      try {
        if (currentUid) {
          const orders = await firestoreService.getUserOrders(currentUid);
          if (isMounted) {
            setRecentOrders(orders.slice(0, 3));
          }
        }
        if (currentEmail) {
          const reservations = await firestoreService.getUserReservations(currentEmail);
          if (isMounted) {
            setUpcomingReservations(reservations.slice(0, 3));
          }
        }
        setUnreadCount(notificationService.getUnreadCount());
      } catch (err) {
        console.warn('[NOIR Dashboard] Failed loading member data:', err);
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    };

    loadData();

    // Listen to notification state changes
    const unsubNotifs = notificationService.subscribe(() => {
      if (isMounted) {
        setUnreadCount(notificationService.getUnreadCount());
      }
    });

    return () => {
      isMounted = false;
      unsubNotifs();
    };
  }, [currentUid, currentEmail]);

  const displayName = userProfile?.name || firebaseUser?.displayName || currentEmail?.split('@')[0] || 'VIP Member';
  const tier = userProfile?.membershipTier || 'Gold VIP';
  const loyaltyPoints = userProfile?.loyaltyPoints ?? 0;
  const progressPercent = userProfile?.tierProgressPercent ?? Math.min(100, Math.round((loyaltyPoints % 2500) / 25));

  return (
    <MemberLayout title={`Welcome, ${displayName}`} subtitle="VIP Member Suite">
      <div className="space-y-8 animate-fadeIn">
        {/* VIP Membership Card & Tier Status */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121216] via-[#1a1a24] to-[#0a0a0c] border border-[#d4af37]/35 p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7e7ce] to-[#aa820a] p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                  <Crown className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f7e7ce] text-[10px] uppercase font-bold tracking-widest">
                    {tier}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[9px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified Member
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
                  {displayName}
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  {currentEmail}
                </p>
              </div>
            </div>

            {/* Loyalty Points & Progress */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#0a0a0c]/80 border border-neutral-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Loyalty Balance
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {loyaltyPoints.toLocaleString()}{' '}
                    <span className="text-xs text-[#d4af37] font-normal font-sans">PTS</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a0a0c]/80 border border-neutral-800 min-w-[200px] space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-400">Tier Progress</span>
                  <span className="text-[#d4af37] font-mono font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#f7e7ce] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[9px] text-neutral-500 text-right">
                  Next Tier: Noir Reserve
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Member Action Shortcuts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/reservations"
            className="p-5 rounded-2xl bg-[#121216]/90 border border-neutral-800 hover:border-[#d4af37]/50 transition group flex flex-col justify-between space-y-4 shadow-lg min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Reservations</div>
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Book VIP Table</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            to="/hookahs"
            className="p-5 rounded-2xl bg-[#121216]/90 border border-neutral-800 hover:border-[#d4af37]/50 transition group flex flex-col justify-between space-y-4 shadow-lg min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Catalog</div>
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Signature Hookahs</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            to="/flavors"
            className="p-5 rounded-2xl bg-[#121216]/90 border border-neutral-800 hover:border-[#d4af37]/50 transition group flex flex-col justify-between space-y-4 shadow-lg min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Molasses</div>
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Explore Flavors</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            to="/menu"
            className="p-5 rounded-2xl bg-[#121216]/90 border border-neutral-800 hover:border-[#d4af37]/50 transition group flex flex-col justify-between space-y-4 shadow-lg min-h-[120px]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Dining</div>
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Gourmet Menu</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Two-Column Grid: Recent Orders & Upcoming Reservations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders Section */}
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-serif-luxury font-bold text-lg text-white">Recent Orders</h3>
              </div>
              <Link
                to="/orders"
                className="text-xs text-[#d4af37] hover:text-[#f7e7ce] font-semibold flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-xs text-neutral-500 animate-pulse">
                Loading orders from lounge register...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-[#0a0a0c]/60 rounded-2xl border border-neutral-800/80 p-6">
                <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">No recent lounge orders found.</p>
                <Link
                  to="/hookahs"
                  className="inline-block px-4 py-2 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold hover:bg-[#d4af37] hover:text-black transition"
                >
                  Order Hookah & Drinks
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[9px] font-bold uppercase">
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Table {order.tableNumber || 'VIP Lounge'} • {order.items?.length || 1} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#d4af37] font-mono">
                        Rs. {order.total.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reservations Section */}
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-serif-luxury font-bold text-lg text-white">Table Reservations</h3>
              </div>
              <Link
                to="/reservations"
                className="text-xs text-[#d4af37] hover:text-[#f7e7ce] font-semibold flex items-center gap-1"
              >
                <span>Manage Reservations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-xs text-neutral-500 animate-pulse">
                Checking VIP lounge bookings...
              </div>
            ) : upcomingReservations.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-[#0a0a0c]/60 rounded-2xl border border-neutral-800/80 p-6">
                <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">You have no active table reservations.</p>
                <Link
                  to="/reservations"
                  className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition"
                >
                  Reserve VIP Suite
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {res.date} at {res.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[9px] font-bold uppercase">
                          {res.status || 'Confirmed'}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        {res.guests} Guests • {res.seatingPreference || 'VIP Seating'}
                      </div>
                    </div>
                    <Link
                      to="/reservations"
                      className="text-xs text-[#d4af37] hover:text-white transition font-medium"
                    >
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Bar */}
        {unreadCount > 0 && (
          <div className="p-4 rounded-2xl bg-[#121216] border border-[#d4af37]/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs text-neutral-200">
                You have <strong className="text-[#d4af37]">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</strong> from NOIR HOOKAH concierge.
              </span>
            </div>
            <Link
              to="/profile"
              className="text-xs text-[#d4af37] hover:underline font-semibold shrink-0"
            >
              Review Updates
            </Link>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
