import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg-page)',
          gap: '16px',
        }}
      >
        <div className="brand-badge" style={{ width: '56px', height: '56px', fontSize: '30px' }}>
          b
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Verifying Admin Permissions...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
