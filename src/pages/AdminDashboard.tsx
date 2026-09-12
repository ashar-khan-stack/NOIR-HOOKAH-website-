import React, { useState, useEffect } from 'react';
import { PageRoute, Reservation, Order, User } from '../types';
import { reservationService } from '../services/reservationService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { SEOHead } from '../components/common/SEOHead';
import {
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  BarChart3,
  RefreshCw,
  LogOut,
  Sliders,
  Bell,
  Mail,
  Flame,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageRoute) => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders' | 'vip' | 'analytics' | 'settings'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());

  const loadData = () => {
    setReservations(reservationService.getAllReservations());
    setOrders(cartService.getAllOrders());
    setCurrentUser(authService.getCurrentUser());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateReservationStatus = (id: string, newStatus: any) => {
    reservationService.updateReservationStatus(id, newStatus);
    loadData();
  };

  const handleUpdateOrderStatus = (id: string, newStatus: any) => {
    cartService.updateOrderStatus(id, newStatus);
    loadData();
  };

  const handleAdminLogout = () => {
    authService.logout();
    if (onLogout) {
      onLogout();
    } else {
      onNavigate('welcome');
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div id="admin-dashboard" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <SEOHead
        title="Executive Admin Dashboard | NOIR HOOKAH"
        description="Exclusive lounge management suite for table reservations, guest orders, revenue analytics, and VIP accounts."
      />

      {/* Header Banner */}
      <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3.5 z-10">
          <div className="p-3.5 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                MANAGEMENT PORTAL
              </span>
              <span className="px-2 py-0.5 rounded bg-[#d4af37]/10 text-[#d4af37] text-[9px] font-bold border border-[#d4af37]/30">
                ROLE: ADMIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              Executive Management Suite
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#d4af37] text-xs font-semibold text-white flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Sync Live Data</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-800 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400 text-xs">
            <span>Gross Nightly Revenue</span>
            <DollarSign className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-bold text-white font-serif-luxury">
            Rs. {totalRevenue > 0 ? totalRevenue.toLocaleString() : '142,500'}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">+18.4% from last night</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400 text-xs">
            <span>Table Bookings</span>
            <Calendar className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-bold text-white font-serif-luxury">
            {reservations.length} Active
          </div>
          <div className="text-[10px] text-[#f7e7ce]">
            {reservations.filter((r) => r.status === 'Confirmed').length} Confirmed Tables
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400 text-xs">
            <span>In-Lounge Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-bold text-white font-serif-luxury">
            {orders.length} Orders
          </div>
          <div className="text-[10px] text-amber-400">Live floor fulfillment</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400 text-xs">
            <span>VIP Black & Gold Directory</span>
            <Users className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-bold text-white font-serif-luxury">248 VIP Guests</div>
          <div className="text-[10px] text-[#d4af37] font-semibold">Verified High-Value Members</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 px-5 font-semibold uppercase tracking-wider whitespace-nowrap transition ${
            activeTab === 'reservations'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Reservations Manager ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-5 font-semibold uppercase tracking-wider whitespace-nowrap transition ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Orders Manager ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('vip')}
          className={`pb-3 px-5 font-semibold uppercase tracking-wider whitespace-nowrap transition ${
            activeTab === 'vip'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          VIP Members & Loyalty
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-5 font-semibold uppercase tracking-wider whitespace-nowrap transition ${
            activeTab === 'settings'
              ? 'border-b-2 border-[#d4af37] text-[#d4af37]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Lounge Controls & Settings
        </button>
      </div>

      {/* TAB 1: RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-800 text-xs">
            <h3 className="font-bold text-white font-serif-luxury text-base">Live Floor Table Reservations</h3>
            <span className="text-neutral-400">Gulberg III VIP Lounge Floorplan</span>
          </div>

          <div className="space-y-3">
            {reservations.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{r.name}</span>
                    <span className="text-[#d4af37] text-[10px] font-bold uppercase border border-[#d4af37]/30 px-2 py-0.5 rounded">
                      {r.seatingPreference}
                    </span>
                  </div>
                  <div className="text-neutral-400 mt-1">
                    Phone: <strong className="text-white">{r.phone}</strong> • Email: <strong className="text-white">{r.email}</strong> • {r.guests} Guests
                  </div>
                  <div className="text-neutral-300 mt-0.5">
                    Date: <strong className="text-white">{r.date}</strong> at <strong className="text-white">{r.time}</strong>
                  </div>
                  {r.specialRequest && (
                    <div className="text-amber-300 text-[11px] mt-1 italic">
                      &quot;Note: {r.specialRequest}&quot;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                    r.status === 'Confirmed' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-amber-950 border-amber-800 text-amber-300'
                  }`}>
                    {r.status}
                  </span>
                  <button
                    onClick={() => handleUpdateReservationStatus(r.id, 'Confirmed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition text-[11px] font-semibold"
                  >
                    Confirm Table
                  </button>
                  <button
                    onClick={() => handleUpdateReservationStatus(r.id, 'Cancelled')}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 transition text-[11px] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-800 text-xs">
            <h3 className="font-bold text-white font-serif-luxury text-base">In-Lounge Active Orders</h3>
            <span className="text-neutral-400">Kitchen & Hookah Captain Queue</span>
          </div>

          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">
                    Order #{o.id} — Table {o.tableNumber}
                  </div>
                  <div className="text-neutral-400 mt-1">
                    Items: {o.items.map((i) => `${i.item.name} (${i.quantity})`).join(', ')}
                  </div>
                  <div className="text-[#d4af37] font-bold mt-1">
                    Total: Rs. {o.total.toLocaleString()} • Payment: {o.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                    className="px-3.5 py-2 rounded-xl bg-[#d4af37] text-[#0a0a0c] text-[11px] font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    Mark Served
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VIP MEMBERS */}
      {activeTab === 'vip' && (
        <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white font-serif-luxury text-base">VIP Guest Register</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex justify-between items-center text-xs">
              <div>
                <strong className="text-white text-sm block">Ahmad Mansoor (Gold VIP)</strong>
                <span className="text-neutral-400">ahmad@noir.pk • Loyalty Points: 1,250 Pts</span>
              </div>
              <span className="px-3 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] font-bold uppercase text-[10px]">
                Gold Member
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 flex justify-between items-center text-xs">
              <div>
                <strong className="text-white text-sm block">Zara Sheikh (Black VIP)</strong>
                <span className="text-neutral-400">zara@sheikh.com • Loyalty Points: 3,800 Pts</span>
              </div>
              <span className="px-3 py-1 rounded bg-neutral-800 text-white font-bold uppercase text-[10px] border border-neutral-700">
                Black VIP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-white font-serif-luxury text-base">Lounge Operating Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-2">
              <strong className="text-white font-bold block">Capacity & Seating Rules</strong>
              <p className="text-neutral-400">Maximum concurrent indoor seating: 85 guests.</p>
              <button className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-white rounded-lg">
                Edit Seating Grid
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-2">
              <strong className="text-white font-bold block">24K Gold Refill Pricing</strong>
              <p className="text-neutral-400">Base Sheesha: Rs. 4,500 • Charcoal Swap: Rs. 500</p>
              <button className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-white rounded-lg">
                Update Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
