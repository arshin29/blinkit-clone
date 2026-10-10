import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Orders } from './pages/Orders';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected admin dashboard routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
