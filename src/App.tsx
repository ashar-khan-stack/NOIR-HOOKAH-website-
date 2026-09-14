import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useSessionInactivity } from './hooks/useSessionInactivity';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRouteGuard } from './routes/AdminRouteGuard';
import { PublicOnlyRoute } from './routes/PublicOnlyRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public & Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { Forbidden403Page } from './pages/Forbidden403Page';
import { NotFoundPage } from './pages/NotFoundPage';

// Authenticated Member Suite Pages
import { MemberDashboardPage } from './pages/member/MemberDashboardPage';
import { HookahsCatalogPage } from './pages/member/HookahsCatalogPage';
import { FlavorsCatalogPage } from './pages/member/FlavorsCatalogPage';
import { GourmetMenuPage } from './pages/member/GourmetMenuPage';
import { CartPage } from './pages/member/CartPage';
import { CheckoutPage } from './pages/member/CheckoutPage';
import { OrdersHistoryPage } from './pages/member/OrdersHistoryPage';
import { ReservationsPage } from './pages/member/ReservationsPage';
import { NotificationsPage } from './pages/member/NotificationsPage';
import { ProfilePage } from './pages/member/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCustomerDetailPage } from './pages/admin/AdminCustomerDetailPage';
import { AdminHookahsPage } from './pages/admin/AdminHookahsPage';
import { AdminFlavorsPage } from './pages/admin/AdminFlavorsPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminLoungePage } from './pages/admin/AdminLoungePage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Global Inactivity Monitor within the Router tree
const InactivityWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useSessionInactivity();
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <InactivityWrapper>
              <Routes>
                {/* Root Route: directs to /login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Public Authentication Routes */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPasswordPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <PublicOnlyRoute>
                    <AdminLoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />

              {/* 403 Forbidden Page */}
              <Route path="/403" element={<Forbidden403Page />} />

              {/* Protected Member Suite Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MemberDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hookahs"
                element={
                  <ProtectedRoute>
                    <HookahsCatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flavors"
                element={
                  <ProtectedRoute>
                    <FlavorsCatalogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <GourmetMenuPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute>
                    <ReservationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes (Guarded via Firebase Custom Claims) */}
              <Route
                path="/admin"
                element={
                  <AdminRouteGuard>
                    <AdminDashboardPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRouteGuard>
                    <AdminDashboardPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminRouteGuard>
                    <AdminCustomersPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/customers/:id"
                element={
                  <AdminRouteGuard>
                    <AdminCustomerDetailPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/catalog/hookahs"
                element={
                  <AdminRouteGuard>
                    <AdminHookahsPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/catalog/flavors"
                element={
                  <AdminRouteGuard>
                    <AdminFlavorsPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/catalog/menu"
                element={
                  <AdminRouteGuard>
                    <AdminMenuPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRouteGuard>
                    <AdminOrdersPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/orders/:id"
                element={
                  <AdminRouteGuard>
                    <AdminOrderDetailPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/reservations"
                element={
                  <AdminRouteGuard>
                    <AdminReservationsPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/lounge"
                element={
                  <AdminRouteGuard>
                    <AdminLoungePage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <AdminRouteGuard>
                    <AdminNotificationsPage />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRouteGuard>
                    <AdminSettingsPage />
                  </AdminRouteGuard>
                }
              />

              {/* 404 Dedicated and Catch-all Routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </InactivityWrapper>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
};

export default App;
