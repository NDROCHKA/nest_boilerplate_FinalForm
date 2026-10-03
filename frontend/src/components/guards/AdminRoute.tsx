import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';

interface AdminRouteProps {
  children?: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--color-bg-primary)',
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};
