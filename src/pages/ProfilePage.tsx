import React, { useState, useEffect } from 'react';
import { PageRoute, User, Order, Reservation } from '../types';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { reservationService } from '../services/reservationService';
import { Award, Calendar, ShoppingBag, LogOut, ShieldCheck, Star, Heart, Check, Gift } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onNavigate: (page: PageRoute) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'reservations' | 'loyalty'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [redeemedCode, setRedeemedCode] = useState('');

  useEffect(() => {
    setOrders(cartService.getOrdersHistory(user.id));
    setReservations(reservationService.getUserReservations(user.email));
  }, [user]);

  const handleRedeemPoints = () => {
    if (user.loyaltyPoints >= 500) {
      setRedeemedCode('VIPGIFT500');
    }
  };

  return (
    <div id="profile-page" className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-[#121216] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 glass-panel shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#d4af37] bg-[#0a0a0c] flex items-center justify-center text-[#d4af37] font-cinzel font-bold text-2xl shadow-xl">
            {user.name ? user.name.charAt(0) : 'V'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif-luxury text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f7e7ce] text-[10px] font-bold uppercase tracking-wider">
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl border border-neutral-800 hover:border-rose-500/50 text-neutral-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-semibold uppercase tracking-wider transition ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 px-4 font-semibold uppercase tracking-wider transition ${
            activeTab === 'loyalty'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Loyalty & Rewards ({user.loyaltyPoints} pts)
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 px-4 font-semibold uppercase tracking-wider transition ${
            activeTab === 'reservations'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Reservations ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-semibold uppercase tracking-wider transition ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
            <Award className="w-6 h-6 text-[#d4af37]" />
            <div className="text-xl font-bold text-white">{user.loyaltyPoints} VIP Points</div>
            <p className="text-xs text-neutral-400">Equivalent to Rs. {user.loyaltyPoints} in lounge rewards.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
            <Calendar className="w-6 h-6 text-[#d4af37]" />
            <div className="text-xl font-bold text-white">{reservations.length} Table Reservations</div>
            <p className="text-xs text-neutral-400">Total VIP table bookings completed.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
            <ShoppingBag className="w-6 h-6 text-[#d4af37]" />
            <div className="text-xl font-bold text-white">{orders.length} Completed Orders</div>
            <p className="text-xs text-neutral-400">In-lounge pre-orders & deliveries.</p>
          </div>
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-serif-luxury">VIP Loyalty Rewards</h2>
              <p className="text-xs text-neutral-400">Earn 10 points for every Rs. 100 spent at NOIR.</p>
            </div>
            <div className="text-2xl font-bold text-[#d4af37]">{user.loyaltyPoints} PTS</div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-neutral-300 font-semibold">Tier Progress to Black Diamond VIP:</div>
            <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] rounded-full"
                style={{ width: `${Math.min((user.loyaltyPoints / 2500) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-400 flex justify-between">
              <span>Current: Gold VIP</span>
              <span>Target: 2,500 PTS for Black Diamond</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={handleRedeemPoints}
              disabled={user.loyaltyPoints < 500}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-wider disabled:opacity-50"
            >
              Redeem 500 PTS for Rs. 500 Lounge Voucher
            </button>

            {redeemedCode && (
              <div className="p-4 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-xs text-[#f7e7ce] flex items-center justify-between">
                <div>
                  <strong>Promo Code Generated:</strong> {redeemedCode}
                </div>
                <span className="text-[10px] uppercase font-bold text-[#d4af37]">Ready to use</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-500">No reservations booked yet.</div>
          ) : (
            reservations.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-[#121216] border border-neutral-800 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">Table Reservation #{r.id}</div>
                  <div className="text-neutral-400 mt-1">{r.date} at {r.time} • {r.guests} Guests</div>
                  <div className="text-[#d4af37] mt-0.5">Seating: {r.seatingPreference}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold uppercase text-[10px]">
                  {r.status}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-500">No orders placed yet.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="p-4 rounded-2xl bg-[#121216] border border-neutral-800 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">Order #{o.id}</div>
                  <div className="text-neutral-400 mt-1">{o.createdAt} • {o.items.length} items</div>
                  <div className="text-[#d4af37] font-bold mt-0.5">Total: Rs. {o.total.toLocaleString()}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f7e7ce] font-bold uppercase text-[10px]">
                  {o.status}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
