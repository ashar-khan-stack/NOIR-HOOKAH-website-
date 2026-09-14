import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuxuryLoading } from '../components/common/LuxuryLoading';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { firebaseUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LuxuryLoading message="Validating VIP Session..." />;
  }

  if (!firebaseUser) {
    // Unauthenticated user attempting to access protected route -> redirect to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
