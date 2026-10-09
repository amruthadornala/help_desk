import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to appropriate login page
    const redirectUrl = adminOnly ? '/admin/login' : '/login';
    return <Navigate to={redirectUrl} state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Student trying to access admin page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
