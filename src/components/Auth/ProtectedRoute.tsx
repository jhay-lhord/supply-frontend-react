import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './authStore';
import Loading from '@/pages/Dashboard/shared/components/Loading';
import Login from '@/pages/Forms/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      await checkAuth();
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      navigate('/login');
    }
  }, [isChecking, isAuthenticated, navigate]);

  if (isChecking) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Login />;
};

export default ProtectedRoute;

