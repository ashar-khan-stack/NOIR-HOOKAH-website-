import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { PageRoute, User, Hookah } from './types';
import { authService } from './services/authService';
import { useSessionInactivity } from './hooks/useSessionInactivity';
import { AdminRouteGuard } from './components/auth/AdminRouteGuard';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { NewsletterModal } from './components/layout/NewsletterModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { NotificationCenter } from './components/common/NotificationCenter';
import { CursorGlow } from './components/layout/CursorGlow';
import { SkeletonLoader } from './components/common/SkeletonLoader';
import { ShieldAlert, ShieldX, Sparkles, ArrowRight, Lock } from 'lucide-react';

// Lazy Loaded Pages for initial bundle optimization
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const MenuPage = lazy(() => import('./pages/MenuPage').then((m) => ({ default: m.MenuPage })));
const HookahsPage = lazy(() => import('./pages/HookahsPage').then((m) => ({ default: m.HookahsPage })));
const FlavorsPage = lazy(() => import('./pages/FlavorsPage').then((m) => ({ default: m.FlavorsPage })));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ReservationsPage = lazy(() => import('./pages/ReservationsPage').then((m) => ({ default: m.ReservationsPage })));
const PrivateEventsPage = lazy(() => import('./pages/PrivateEventsPage').then((m) => ({ default: m.PrivateEventsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const AppDownloadPage = lazy(() => import('./pages/AppDownloadPage').then((m) => ({ default: m.AppDownloadPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then((m) => ({ default: m.UserDashboard })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const WelcomeAuthGate = lazy(() => import('./components/auth/WelcomeAuthGate').then((m) => ({ default: m.WelcomeAuthGate })));

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  
  // Set initial page: if logged in as admin -> 'admin'; if logged in as user -> 'user-dashboard'; if unauthenticated -> 'login'
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    const user = authService.getCurrentUser();
    if (user?.role === 'ADMIN' || user?.isAdmin) return 'admin';
    if (user?.role === 'USER' || user) return 'user-dashboard';
    return 'login';
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedHookahDetail, setSelectedHookahDetail] = useState<Hookah | null>(null);
  const [accentColor, setAccentColor] = useState<string>('#d4af37');

  // Age Verification
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('noir_age_verified') === 'true';
  });

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, [currentPage]);

  // Handle navigation & role-protection checks
  const handleNavigate = (page: PageRoute) => {
    const activeUser = authService.getCurrentUser();

    // If navigating to admin route without admin credentials, block and redirect
    if (page === 'admin') {
      if (!activeUser) {
        setCurrentPage('admin-login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (activeUser.role !== 'ADMIN' && !activeUser.isAdmin) {
        // Block normal user from admin (renders 403 Unauthorized view)
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Require authentication for protected pages
    const publicAuthPages: PageRoute[] = ['login', 'register', 'admin-login', 'privacy', 'terms'];
    if (!activeUser && !publicAuthPages.includes(page)) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyAge = (verified: boolean) => {
    if (verified) {
      localStorage.setItem('noir_age_verified', 'true');
      setIsAgeVerified(true);
    } else {
      window.location.href = 'https://google.com';
    }
  };

  const handleSelectHookahDetail = (hookah: Hookah | null) => {
    setSelectedHookahDetail(hookah);
    if (hookah) {
      setCurrentPage('hookahs');
    }
  };

  const handleLogout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('login');
  }, []);

  // 30-minute session inactivity auto-logout hook
  useSessionInactivity(handleLogout, !!currentUser);

  return (
    <div
      className="bg-[#070709] text-neutral-100 font-sans selection:bg-[#d4af37] selection:text-black min-h-screen flex flex-col relative"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Subtle Cursor Glow Effect */}
      <CursorGlow />

      {/* Offline Alert Indicator */}
      <OfflineIndicator />

      {/* Age Gate Overlay if not verified */}
      {!isAgeVerified && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full border border-[#d4af37] bg-[#0a0a0c] flex items-center justify-center text-[#d4af37] mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold">
                AGE VERIFICATION REQUIRED
              </span>
              <h2 className="text-2xl font-bold font-serif-luxury text-white">
                Are You 18 Years or Older?
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                NOIR HOOKAH is an adult lounge. You must be of legal smoking age in your jurisdiction to view our website, menu, and reserve tables.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => handleVerifyAge(true)}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
              >
                Yes, I am 18 or Older
              </button>
              <button
                onClick={() => handleVerifyAge(false)}
                className="w-full py-3 border border-neutral-800 hover:border-neutral-600 text-xs text-neutral-400 rounded-xl"
              >
                No, Exit Site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Glassmorphism Header (Hidden on Auth Views) */}
      {!(currentPage === 'welcome' || currentPage === 'login' || currentPage === 'register' || currentPage === 'admin-login' || currentPage === 'auth' || !currentUser) && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={currentUser}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
        />
      )}

      {/* Main View Area with Suspense Lazy Loading */}
      <main className="flex-1">
        <Suspense fallback={<SkeletonLoader type="page" />}>
          {(currentPage === 'welcome' || currentPage === 'login' || currentPage === 'auth') && (
            <WelcomeAuthGate
              initialMode="login"
              onNavigate={handleNavigate}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                if (user.role === 'ADMIN' || user.isAdmin) {
                  setCurrentPage('admin');
                } else {
                  setCurrentPage('user-dashboard');
                }
              }}
            />
          )}

          {currentPage === 'register' && (
            <WelcomeAuthGate
              initialMode="register"
              onNavigate={handleNavigate}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setCurrentPage('user-dashboard');
              }}
            />
          )}

          {currentPage === 'admin-login' && (
            <WelcomeAuthGate
              initialMode="admin-login"
              onNavigate={handleNavigate}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setCurrentPage('admin');
              }}
            />
          )}

          {currentPage === 'home' && (
            <Home
              onNavigate={handleNavigate}
              onOpenCart={() => setIsCartOpen(true)}
              onSelectHookahDetail={handleSelectHookahDetail}
            />
          )}

          {currentPage === 'menu' && (
            <MenuPage onNavigate={handleNavigate} onOpenCart={() => setIsCartOpen(true)} />
          )}

          {currentPage === 'hookahs' && (
            <HookahsPage
              onNavigate={handleNavigate}
              onOpenCart={() => setIsCartOpen(true)}
              selectedHookah={selectedHookahDetail}
              onSelectHookah={setSelectedHookahDetail}
            />
          )}

          {currentPage === 'flavors' && <FlavorsPage onNavigate={handleNavigate} />}

          {currentPage === 'experience' && <ExperiencePage onNavigate={handleNavigate} />}

          {currentPage === 'gallery' && <GalleryPage onNavigate={handleNavigate} />}

          {currentPage === 'reservations' && <ReservationsPage onNavigate={handleNavigate} />}

          {currentPage === 'private-events' && <PrivateEventsPage onNavigate={handleNavigate} />}

          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

          {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}

          {currentPage === 'app-download' && <AppDownloadPage onNavigate={handleNavigate} />}

          {currentPage === 'auth' && (
            <AuthPage
              onNavigate={handleNavigate}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setCurrentPage('user-dashboard');
              }}
            />
          )}

          {currentPage === 'user-dashboard' && (
            currentUser ? (
              <UserDashboard
                user={currentUser}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            ) : (
              <WelcomeAuthGate
                onNavigate={handleNavigate}
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setCurrentPage('user-dashboard');
                }}
              />
            )
          )}

          {currentPage === 'profile' && (
            currentUser ? (
              <ProfilePage
                user={currentUser}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            ) : (
              <WelcomeAuthGate
                onNavigate={handleNavigate}
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  setCurrentPage('user-dashboard');
                }}
              />
            )
          )}

          {currentPage === 'checkout' && (
            <CheckoutPage onNavigate={handleNavigate} currentUser={currentUser} />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              onNavigate={handleNavigate}
              accentColor={accentColor}
              onSelectAccentColor={(color) => setAccentColor(color)}
            />
          )}

          {/* STRICT ADMIN ROLE GUARD */}
          {currentPage === 'admin' && (
            <AdminRouteGuard onNavigate={handleNavigate} onLogout={handleLogout}>
              <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
            </AdminRouteGuard>
          )}

          {currentPage === 'privacy' && <LegalPage type="privacy" onNavigate={handleNavigate} />}

          {currentPage === 'terms' && <LegalPage type="terms" onNavigate={handleNavigate} />}
        </Suspense>
      </main>

      {/* Footer (Hidden on Auth Views) */}
      {!(currentPage === 'welcome' || currentPage === 'login' || currentPage === 'register' || currentPage === 'admin-login' || currentPage === 'auth' || !currentUser) && <Footer onNavigate={handleNavigate} />}

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <NewsletterModal />
    </div>
  );
};

export default App;
