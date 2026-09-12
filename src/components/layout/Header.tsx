import React, { useState, useEffect } from 'react';
import { PageRoute, User as UserType } from '../../types';
import { APP_CONFIG } from '../../config/appConfig';
import {
  Menu,
  X,
  ShoppingBag,
  User as UserIcon,
  Bell,
  Smartphone,
  Calendar,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cartService } from '../../services/cartService';
import { notificationService } from '../../services/notificationService';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  user?: UserType | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenCart,
  onOpenNotifications,
  user,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Cart count subscription
    const updateCart = () => {
      const items = cartService.getItems();
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    };
    updateCart();
    const unsubscribeCart = cartService.subscribe(updateCart);

    // Notifications subscription
    const updateNotifs = () => {
      setUnreadNotifs(notificationService.getUnreadCount());
    };
    updateNotifs();
    const unsubscribeNotifs = notificationService.subscribe(updateNotifs);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeCart();
      unsubscribeNotifs();
    };
  }, []);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Menu', route: 'menu' },
    { label: 'Hookahs', route: 'hookahs' },
    { label: 'Flavors', route: 'flavors' },
    { label: 'Experience', route: 'experience' },
    { label: 'Gallery', route: 'gallery' },
    { label: 'Reservations', route: 'reservations' },
    { label: 'About', route: 'about' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0c]/85 backdrop-blur-md border-b border-[#d4af37]/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full border border-[#d4af37]/40 bg-[#121216] flex items-center justify-center text-[#d4af37] shadow-lg group-hover:border-[#d4af37] transition duration-300">
            <span className="font-cinzel font-bold text-lg tracking-widest">N</span>
          </div>
          <div>
            <div className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.25em] text-white group-hover:text-[#f7e7ce] transition">
              NOIR
            </div>
            <div className="text-[9px] tracking-[0.35em] uppercase text-[#d4af37] font-semibold">
              HOOKAH
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
          {navLinks.map((link) => {
            const isActive = currentPage === link.route;
            return (
              <button
                key={link.route}
                id={`nav-link-${link.route}`}
                onClick={() => handleNavClick(link.route)}
                className={`text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] font-medium transition duration-200 py-1.5 px-2 relative whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#f7e7ce] font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div id="desktop-actions" className="hidden lg:flex items-center space-x-2.5 xl:space-x-3 shrink-0">
          {/* Notifications Toggle */}
          <button
            id="notifications-header-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37] ring-4 ring-[#0a0a0c]" />
            )}
          </button>

          {/* Cart Drawer Button */}
          <button
            id="cart-header-btn"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#0a0a0c] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Admin Suite */}
          {user?.role === 'ADMIN' || user?.isAdmin ? (
            <button
              id="admin-header-btn"
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition"
              title="Admin Management Suite"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Suite</span>
            </button>
          ) : (
            <button
              id="account-header-btn"
              onClick={() => handleNavClick(user ? 'user-dashboard' : 'welcome')}
              className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition relative"
              title={user ? `Logged in as ${user.name}` : 'VIP Account Sign In'}
            >
              <UserIcon className="w-4 h-4 text-[#d4af37]" />
              {user && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0c]" />
              )}
            </button>
          )}

          {/* Settings */}
          <button
            id="settings-header-btn"
            onClick={() => handleNavClick('settings')}
            className="p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reserve Now Primary CTA */}
          <button
            id="reserve-now-header-btn"
            onClick={() => handleNavClick('reservations')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-semibold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition duration-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve Now</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div id="mobile-controls" className="flex lg:hidden items-center space-x-2">
          {/* Mobile Cart Button */}
          <button
            id="mobile-cart-btn"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg text-neutral-300 hover:text-white"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#d4af37] text-[#0a0a0c] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            id="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-200 hover:text-[#f7e7ce] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden fixed inset-0 top-[60px] bg-[#0a0a0c]/98 backdrop-blur-xl z-50 flex flex-col justify-between p-6 border-t border-[#d4af37]/20 overflow-y-auto animate-fadeIn">
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="text-xs uppercase tracking-widest text-[#d4af37]">
                Navigation Menu
              </div>
              <button
                id="mobile-settings-link"
                onClick={() => handleNavClick('settings')}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Preferences</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  id={`mobile-nav-${link.route}`}
                  onClick={() => handleNavClick(link.route)}
                  className={`text-left text-base uppercase tracking-[0.18em] font-medium py-2.5 px-4 rounded-lg transition ${
                    currentPage === link.route
                      ? 'bg-[#d4af37]/15 text-[#f7e7ce] border-l-2 border-[#d4af37]'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="pt-6 border-t border-neutral-800 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                id="mobile-profile-btn"
                onClick={() => handleNavClick(user ? 'user-dashboard' : 'welcome')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#d4af37]/40 text-[#f7e7ce] text-xs uppercase tracking-wider font-semibold"
              >
                <UserIcon className="w-4 h-4 text-[#d4af37]" />
                <span>{user ? 'VIP Dashboard' : 'VIP Sign In'}</span>
              </button>

              <button
                id="mobile-[#d4af37]-notifications-btn"
                onClick={() => {
                  onOpenNotifications();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-800 text-neutral-200 text-xs uppercase tracking-wider font-semibold"
              >
                <Bell className="w-4 h-4 text-[#d4af37]" />
                <span>Notifications</span>
              </button>
            </div>

            <button
              id="mobile-reserve-cta"
              onClick={() => handleNavClick('reservations')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-sm tracking-widest uppercase py-3.5 rounded-xl shadow-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
