import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuxuryLoading } from '../components/common/LuxuryLoading';

interface AdminRouteGuardProps {
  children?: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { firebaseUser, checkAdminClaims, loading } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [hasValidClaims, setHasValidClaims] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const runCheck = async () => {
      if (!firebaseUser) {
        if (isMounted) {
          setHasValidClaims(false);
          setVerifying(false);
        }
        return;
      }

      try {
        // Force refresh the ID token directly from Firebase Auth to ensure up-to-date custom claims
        const authorized = await checkAdminClaims(true);
        if (isMounted) {
          setHasValidClaims(authorized);
          setVerifying(false);
        }
      } catch {
        if (isMounted) {
          setHasValidClaims(false);
          setVerifying(false);
        }
      }
    };

    if (!loading) {
      runCheck();
    }

    return () => {
      isMounted = false;
    };
  }, [firebaseUser, loading, checkAdminClaims]);

  if (loading || verifying) {
    return <LuxuryLoading message="Verifying Executive Claims..." />;
  }

  if (!firebaseUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Strict verification: Admin access requires Firebase custom claims: admin === true AND role === "ADMIN"
  if (!hasValidClaims) {
    return <Navigate to="/403" state={{ attemptedUrl: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
