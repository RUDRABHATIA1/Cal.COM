import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute — No login required.
 * Assumes a default user (John Doe) is always logged in.
 * Shows a spinner while the auth context initializes, then always renders the dashboard.
 */
const ProtectedRoute = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <Loader2 className="w-8 h-8 animate-spin text-[#111827]" />
      </div>
    );
  }

  // Always render — no login redirect. The AuthContext guarantees a user.
  return <Outlet />;
};

export default ProtectedRoute;
