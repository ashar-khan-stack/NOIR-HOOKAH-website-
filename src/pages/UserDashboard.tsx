import React, { useState, useEffect } from 'react';
import { PageRoute, User, Reservation, Order } from '../types';
import { authService } from '../services/authService';
import { reservationService } from '../services/reservationService';
import { cartService } from '../services/cartService';
import { SEOHead } from '../components/common/SEOHead';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  Gift,
  Crown,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Clock,
  CheckCircle2,
  Smartphone,
  Settings,
  Flame,
  Award,
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onNavigate: (page: PageRoute) => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onNavigate, onLogout }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [redeemSuccess, setRedeemSuccess] = useState<string>('');

  useEffect(() => {
    if (user) {
      setReservations(reservationService.getUserReservations(user.email));
      setOrders(cartService.getOrdersHistory(user.id));
    }
  }, [user]);

  const handleRedeemVoucher = (pointsCost: number, voucherName: string) => {
    if (user.loyaltyPoints < pointsCost) {
      alert(`Insufficient Loyalty Points. You need ${pointsCost} points.`);
      return;
    }
    authService.addLoyaltyPoints(-pointsCost, `Redeemed: ${voucherName}`);
    setRedeemSuccess(`Successfully redeemed ${voucherName}! Added code to your wallet: NOIRVIP10`);
    setTimeout(() => setRedeemSuccess(''), 5000);
  };

  return (
    <div id="user-dashboard" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <SEOHead
        title={`VIP Member Portal | ${user.name} — NOIR HOOKAH`}
        description="Your personal NOIR HOOKAH member dashboard, table reservations, loyalty rewards, and active orders."
      />

      {/* Top Banner Header */}
      <div className="bg-[#121216] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7e7ce] to-[#aa820a] p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center text-[#d4af37]">
              <Crown className="w-8 h-8" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                {user.tier || 'Gold VIP'} MEMBER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-bold uppercase">
                Active Member
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              Welcome Back, {user.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {user.email} • {user.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={() => onNavigate('reservations')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-110"
          >
            <Calendar className="w-4 h-4" />
            <span>Book VIP Table</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37] text-neutral-300 hover:text-white transition"
            title="App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#121216] border border-[#d4af37]/30 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>VIP Loyalty Balance</span>
            <Award className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-bold text-white font-serif-luxury">
            {user.loyaltyPoints} <span className="text-xs text-[#d4af37] font-sans font-normal">PTS</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">
            Ready to redeem for Rs. 500 Voucher
          </div>
        </div>

        <div className="bg-[#121216] border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>Active Reservations</span>
            <Calendar className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-bold text-white font-serif-luxury">
            {reservations.length}
          </div>
          <div className="text-[10px] text-neutral-400">
            {reservations.length > 0 ? 'Upcoming table holds' : 'No active bookings'}
          </div>
        </div>

        <div className="bg-[#121216] border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>In-Lounge Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-bold text-white font-serif-luxury">
            {orders.length}
          </div>
          <div className="text-[10px] text-neutral-400">Total table orders placed</div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Loyalty & Rewards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold font-serif-luxury text-white">
                  Gold VIP Reward Vault
                </h3>
              </div>
              <span className="text-xs text-[#d4af37] font-semibold">100 Pts = Rs. 100</span>
            </div>

            {redeemSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{redeemSuccess}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-white">Rs. 500 Lounge Credit Voucher</div>
                  <p className="text-neutral-400 text-[11px]">Valid on all 24K Gold Hookah refills and teas.</p>
                </div>
                <button
                  onClick={() => handleRedeemVoucher(500, 'Rs. 500 Lounge Credit Voucher')}
                  className="px-3.5 py-2 rounded-xl bg-[#d4af37] text-black font-bold uppercase text-[10px] tracking-wider hover:brightness-110 shrink-0"
                >
                  Redeem 500 Pts
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-white">Free Artisan Tea Pot Upgrade</div>
                  <p className="text-neutral-400 text-[11px]">Complementary Kashmiri Pink Chai or Moroccan Mint.</p>
                </div>
                <button
                  onClick={() => handleRedeemVoucher(300, 'Free Artisan Tea Upgrade')}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 border border-[#d4af37]/40 text-[#d4af37] font-bold uppercase text-[10px] tracking-wider hover:bg-[#d4af37] hover:text-black transition shrink-0"
                >
                  Redeem 300 Pts
                </button>
              </div>
            </div>
          </div>

          {/* Active Table Bookings */}
          <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold font-serif-luxury text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
                <span>Your Table Reservations</span>
              </h3>
              <button
                onClick={() => onNavigate('reservations')}
                className="text-xs text-[#d4af37] hover:underline font-semibold"
              >
                + New Reservation
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">No active table reservations found.</p>
                <button
                  onClick={() => onNavigate('reservations')}
                  className="px-4 py-2 bg-[#d4af37] text-black rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Reserve Table Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{res.seatingPreference} Seating</div>
                      <div className="text-neutral-400 mt-1">
                        Date: <strong className="text-white">{res.date}</strong> at{' '}
                        <strong className="text-white">{res.time}</strong> • {res.guests} Guests
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mobile App & Orders */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              VIP Lounge Shortcuts
            </h3>

            <button
              onClick={() => onNavigate('menu')}
              className="w-full p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800 hover:border-[#d4af37] flex items-center justify-between text-xs text-white transition group"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#d4af37]" />
                <span>Browse Sheesha & Beverage Menu</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d4af37]" />
            </button>

            <button
              onClick={() => onNavigate('app-download')}
              className="w-full p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800 hover:border-[#d4af37] flex items-center justify-between text-xs text-white transition group"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[#d4af37]" />
                <span>Get NOIR Mobile App (iOS / Android)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d4af37]" />
            </button>
          </div>

          {/* Orders History */}
          <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold font-serif-luxury text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <span>In-Lounge Order History</span>
            </h3>

            {orders.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">
                No previous table orders recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{ord.id}</span>
                      <span className="text-[#d4af37] font-bold">Rs. {ord.total.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Table: {ord.tableNumber} • Payment: {ord.paymentMethod}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
