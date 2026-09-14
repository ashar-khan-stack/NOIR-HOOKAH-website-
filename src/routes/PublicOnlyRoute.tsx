import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuxuryLoading } from '../components/common/LuxuryLoading';

interface PublicOnlyRouteProps {
  children?: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { firebaseUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <LuxuryLoading message="Connecting..." />;
  }

  if (firebaseUser) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
