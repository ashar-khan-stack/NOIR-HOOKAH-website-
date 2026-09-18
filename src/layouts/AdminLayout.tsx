import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OfflineIndicator } from '../components/common/OfflineIndicator';
import { PWAInstallBanner } from '../components/common/PWAInstallBanner';
import {
  LayoutDashboard,
  Users,
  Flame,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  Store,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/lounge', label: 'Lounge Ops', icon: Store, badge: 'Live' },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/reservations', label: 'Reservations', icon: CalendarDays },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/client-requests', label: 'Client Appeals', icon: ShieldCheck },
  { path: '/admin/catalog/hookahs', label: 'Hookahs', icon: Flame },
  { path: '/admin/catalog/flavors', label: 'Flavors', icon: Sparkles },
  { path: '/admin/catalog/menu', label: 'Gourmet Menu', icon: UtensilsCrossed },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const { firebaseUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col lg:flex-row antialiased selection:bg-[#d4af37]/30 selection:text-[#f7e7ce]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#0a0a0c] border-r border-neutral-800/80 p-5 shrink-0 justify-between h-screen sticky top-0 z-30">
        <div className="space-y-6">
          {/* Brand & Executive Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B0000] via-[#500000] to-[#121216] border border-rose-600/50 flex items-center justify-center text-rose-300 shadow-[0_0_15px_rgba(139,0,0,0.3)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury font-bold text-sm tracking-widest text-white block">
                  NOIR HOOKAH
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                  Executive Suite
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1 custom-scrollbar">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold px-3 mb-2">
              Console Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B0000]/30 via-[#121216] to-[#121216] text-white border border-rose-800/50 shadow-md font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#8B0000]/60 text-rose-200 border border-rose-700/60">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#d4af37] font-mono text-xs font-bold">
              {firebaseUser?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                Executive Admin
              </div>
              <div className="text-[10px] text-neutral-500 truncate font-mono">
                {firebaseUser?.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => navigate('/dashboard')}
              title="Preview Customer Suite"
              className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span>VIP View</span>
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out of Console"
              className="py-2 px-3 rounded-xl bg-neutral-900/80 hover:bg-rose-950/60 border border-neutral-800 hover:border-rose-800/60 text-[11px] text-rose-400 hover:text-rose-200 flex items-center justify-center transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0c] border-b border-neutral-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8B0000] border border-rose-600/60 flex items-center justify-center text-rose-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-xs tracking-wider text-white">
              NOIR HOOKAH
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[#d4af37] block">
              Admin Console
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300"
          aria-label="Toggle admin navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85%] bg-[#0a0a0c] border-r border-neutral-800 p-5 flex flex-col justify-between h-full z-10 animate-fadeIn">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  <span className="font-serif-luxury font-bold text-sm text-white">
                    Executive Suite
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? 'bg-rose-950/60 text-white border border-rose-800/60 font-semibold'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                <span>Switch to VIP Lounge</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Executive Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Operational Bar */}
        <div className="px-4 sm:px-8 py-5 border-b border-neutral-800/80 bg-[#070709]/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-wide">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-neutral-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-3">{action}</div>}
        </div>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Network Offline Alert */}
      <OfflineIndicator />
    </div>
  );
};
