import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Activity, 
  LayoutDashboard, 
  Map, 
  Server, 
  AlertTriangle, 
  CheckSquare, 
  LogOut,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHead = user?.role === 'IT_HEAD';

  const navTabs = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Hospital Map', path: '/map', icon: Map },
    { name: 'Devices & Assets', path: '/assets', icon: Server },
    { name: 'Support & Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Inspection Checklist', path: '/tasks', icon: CheckSquare },
    ...(isHead ? [{ name: 'User Creation & Employee KPIs', path: '/users', icon: Users, badge: 'HEAD' }] : [])
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Brand & Controls Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight">
              Stavya Intelligence
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan-700 font-bold">
              Spine Hospital IT Operations
            </p>
          </div>
        </div>

        {/* Center Live Telemetry Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Hospital Systems Operational (SLA 99.98%)</span>
        </div>

        {/* Right User Profile Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-slate-300 object-cover"
            />
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
              <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                isHead ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isHead ? 'IT Head (Admin)' : 'IT Executive'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-cyan-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};
