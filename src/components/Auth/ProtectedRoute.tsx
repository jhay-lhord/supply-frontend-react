import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './authStore';
import RoleBaseRouting from './RoleBaseRouting';
import Loading from '@/pages/Dashboard/shared/components/Loading';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, checkAuth, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  if (isChecking) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Loading />;
  }

  return <RoleBaseRouting />;
};

export default ProtectedRoute;

