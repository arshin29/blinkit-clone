import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-page">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner" />
          <p className="text-secondary font-medium text-sm animate-pulse">
            Verifying partner session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'RIDER') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
