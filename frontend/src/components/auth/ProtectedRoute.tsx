import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RoleType } from '../../types/auth';

interface ProtectedRouteProps {
  allowedRoles?: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading Stavya Intelligence Platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-12 text-center glass-panel rounded-2xl max-w-lg mx-auto mt-20 border border-red-500/30">
        <h2 className="text-xl font-bold text-red-400">Access Restricted</h2>
        <p className="text-xs text-slate-400 mt-2">
          Your current role (<span className="font-mono text-cyan-300">{user.role}</span>) does not have authorization to view this section. Switch to IT Head role from the top navbar to view admin controls.
        </p>
      </div>
    );
  }

  return <Outlet />;
};
