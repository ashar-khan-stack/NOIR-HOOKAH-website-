import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notificationService } from '../services/notificationService';
import { NotificationCenter } from '../components/common/NotificationCenter';
import { PWAInstallBanner } from '../components/common/PWAInstallBanner';
import { OfflineIndicator } from '../components/common/OfflineIndicator';
import {
  Flame,
  Crown,
  LayoutDashboard,
  Wind,
  Sparkles,
  Utensils,
  ShoppingBag,
  Clock,
  Calendar,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  ChevronRight,
  Shield,
  Bell,
} from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const MemberLayout: React.FC<MemberLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { userProfile, firebaseUser, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const updateNotifs = () => {
      setUnreadNotifs(notificationService.getUnreadCount());
    };
    updateNotifs();
    const unsub = notificationService.subscribe(updateNotifs);
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Hookahs', path: '/hookahs', icon: Wind },
    { label: 'Flavors', path: '/flavors', icon: Sparkles },
    { label: 'Gourmet Menu', path: '/menu', icon: Utensils },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { label: 'Orders', path: '/orders', icon: Clock },
    { label: 'Reservations', path: '/reservations', icon: Calendar },
    { label: 'Dispatches', path: '/notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const displayName = userProfile?.name || firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'VIP Member';
  const tier = userProfile?.membershipTier || 'Gold VIP';
  const points = userProfile?.loyaltyPoints ?? 0;

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col justify-between relative selection:bg-[#d4af37]/30 selection:text-[#f7e7ce]">
      {/* Ambient luxury lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[radial-gradient(circle,rgba(139,0,0,0.06),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed -top-24 -left-20 w-96 h-96 rounded-full bg-neutral-600/5 blur-3xl animate-smoke pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-[#d4af37]/5 blur-3xl animate-smoke-slow pointer-events-none z-0" />

      {/* Main Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-[#d4af37]/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 bg-[#121216] flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif-luxury font-bold text-lg sm:text-xl tracking-[0.2em] text-[#f7e7ce] block leading-tight">
                  NOIR HOOKAH
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block">
                  Elevate the Night.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#d4af37]/15 text-[#f7e7ce] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#d4af37]' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-0.5 px-1.5 py-0.2 bg-[#d4af37] text-black font-bold text-[10px] rounded-full min-w-4 text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Status / Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Member Tier & Points */}
              <Link
                to="/profile"
                className="px-3 py-1.5 rounded-xl bg-[#121216] border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition flex items-center gap-2.5 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold leading-none">
                    {tier}
                  </div>
                  <div className="text-[11px] font-mono text-white font-medium leading-tight">
                    {points.toLocaleString()} PTS
                  </div>
                </div>
              </Link>

              {/* Notification Center Quick Toggle */}
              <button
                onClick={() => setNotificationCenterOpen(true)}
                aria-label="VIP Dispatches & Notifications"
                className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/50 text-neutral-300 hover:text-white transition"
              >
                <Bell className="w-4 h-4 text-[#d4af37]" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#d4af37] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Cart Button Quick Action */}
              <Link
                to="/cart"
                aria-label="View Shopping Cart"
                className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/50 text-neutral-300 hover:text-white transition"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#d4af37] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin Portal shortcut if admin claims verified */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  aria-label="Executive Console"
                  className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/60 transition"
                  title="Executive Portal"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              )}

              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                aria-label="Sign out from NOIR HOOKAH"
                className="px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-rose-700/80 hover:text-rose-300 text-neutral-400 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>

            {/* Mobile Actions: Notifications + Cart + Hamburger */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setNotificationCenterOpen(true)}
                aria-label="VIP Notifications"
                className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[#d4af37]"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                aria-label="View Shopping Cart"
                className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[#d4af37]"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0a0a0c]/98 border-b border-[#d4af37]/30 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="p-3 bg-[#121216] rounded-2xl border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{displayName}</div>
                  <div className="text-[10px] text-[#d4af37] font-semibold tracking-wider">
                    {tier} • {points.toLocaleString()} PTS
                  </div>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] uppercase font-bold text-[#d4af37] hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition min-h-[44px] ${
                      isActive
                        ? 'bg-[#d4af37]/20 text-[#f7e7ce] border border-[#d4af37]/40'
                        : 'bg-neutral-900/80 border border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-neutral-400'}`} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 bg-[#d4af37] text-black font-bold text-[9px] rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-rose-400 font-semibold flex items-center gap-1 min-h-[44px]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Executive Portal</span>
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs text-neutral-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 ml-auto min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {(title || subtitle) && (
          <div className="mb-8 space-y-1">
            {subtitle && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
                {subtitle}
              </span>
            )}
            {title && (
              <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white tracking-wide">
                {title}
              </h1>
            )}
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-[#070709] py-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-[#d4af37]/40 bg-[#121216] flex items-center justify-center text-[#d4af37]">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span>© {new Date().getFullYear()} NOIR HOOKAH LOUNGE • Elevate the Night.</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] tracking-wider">
            <span className="text-neutral-400">Strictly 21+</span>
            <span>•</span>
            <span className="text-neutral-400">All prices in PKR (Rs.)</span>
            <span>•</span>
            <span className="text-[#d4af37]">VIP Member Suite</span>
          </div>
        </div>
      </footer>

      {/* Slide-over Notification Center Modal */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Network Offline Alert */}
      <OfflineIndicator />
    </div>
  );
};
