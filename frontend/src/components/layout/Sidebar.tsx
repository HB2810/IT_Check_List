import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Server, 
  Map, 
  CheckSquare, 
  AlertTriangle, 
  Bot, 
  BookOpen, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  Activity,
  Users,
  Zap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isHead = user?.role === 'IT_HEAD';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'ALL' },
    { name: 'Hospital Map', path: '/map', icon: Map, role: 'ALL' },
    { name: 'Infrastructure & Assets', path: '/assets', icon: Server, role: 'ALL' },
    { name: 'Incidents & SLA', path: '/incidents', icon: AlertTriangle, role: 'ALL' },
    { name: 'Tasks & Checklists', path: '/tasks', icon: CheckSquare, role: 'ALL' },
    { name: 'AI Intelligence Copilot', path: '/copilot', icon: Bot, role: 'ALL', badge: 'AI' },
    { name: 'Knowledge Base', path: '/kb', icon: BookOpen, role: 'ALL' },
    { name: 'Analytics & KPIs', path: '/analytics', icon: BarChart3, role: 'IT_HEAD' },
    { name: 'Automation & Rules', path: '/automation', icon: Zap, role: 'IT_HEAD' },
    { name: 'User Management', path: '/users', icon: Users, role: 'IT_HEAD' },
    { name: 'Audit & Security Logs', path: '/audit', icon: ShieldCheck, role: 'IT_HEAD' },
    { name: 'System Settings', path: '/settings', icon: Settings, role: 'IT_HEAD' },
  ];

  const filteredItems = navItems.filter(
    item => item.role === 'ALL' || (item.role === 'IT_HEAD' && isHead)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-600 p-0.5 shadow-sm shadow-cyan-600/30 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <Activity className="w-5 h-5 text-cyan-600 animate-pulse" />
          </div>
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wide text-slate-900">
            Stavya Intelligence
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-cyan-700 font-bold">
            Spine Hospital IT Ops
          </p>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Current Role</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isHead ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            {user?.role === 'IT_HEAD' ? 'IT Head (Full)' : 'IT Executive'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-50 text-cyan-900 border border-cyan-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-700' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-600 text-white uppercase">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Quick Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center gap-3">
        <img
          src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt="Avatar"
          className="w-9 h-9 rounded-full border border-slate-300 object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};
