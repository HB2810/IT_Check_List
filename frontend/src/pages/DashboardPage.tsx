import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Zap, 
  ArrowRight, 
  HardDrive, 
  Check, 
  Wrench 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, incidents } = useTasks();

  const completedCount = tasks.filter((i) => i.status !== 'UNCHECKED').length;
  const faultCount = tasks.filter((i) => i.status === 'FAULT').length;
  const okCount = tasks.filter((i) => i.status === 'OK').length;
  const totalTasks = tasks.length;
  const activeTicketsCount = incidents.filter((i) => i.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Smart Morning Intelligence */}
      <div className="bg-gradient-to-r from-cyan-700 via-cyan-800 to-teal-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-white">
              AI Morning Summary
            </span>
            <span className="text-xs text-cyan-100 font-mono">Stavya Spine Hospital</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-cyan-100 max-w-xl">
            HIS server temperature is <span className="font-bold text-emerald-300">18°C (Optimal)</span>. {faultCount === 0 ? 'All hospital systems operational without reported faults!' : `${faultCount} infrastructure fault(s) reported.`}
          </p>
        </div>
        <Link
          to="/copilot"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-cyan-50 text-cyan-900 text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Bot className="w-4 h-4 text-cyan-700" /> Ask AI Copilot
        </Link>
      </div>

      {/* 4 Clean Smart Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified OK</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{okCount} / {totalTasks}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Operational Systems</p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-700">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tickets</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{activeTicketsCount}</p>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">{activeTicketsCount > 0 ? `${activeTicketsCount} open support ticket(s)` : 'Zero active tickets'}</p>
          </div>
          <div className={`p-3 rounded-2xl ${activeTicketsCount === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Completed</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{completedCount} / {totalTasks}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{Math.round((completedCount / (totalTasks || 1)) * 100)}% Daily Progress</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faults Reported</p>
            <p className="text-2xl font-extrabold text-red-600 mt-1">{faultCount}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{faultCount > 0 ? 'Requires Attention' : 'Zero Faults'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* One-Click Smart Action Center */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-600" /> 1-Click Smart Action Hub
          </h2>
          <span className="text-xs text-slate-500">Quick automated actions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Quick Action Button 1 */}
          <Link
            to="/tasks"
            className="p-4 rounded-2xl text-left border border-cyan-200 bg-cyan-50/60 hover:bg-cyan-100/70 transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider">IT Infrastructure Checklist</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-xs font-bold text-cyan-900">Inspect & Verify Daily Checklist</p>
            <p className="text-[10px] text-cyan-700">{completedCount} of {totalTasks} items verified</p>
          </Link>

          {/* Quick Action Button 2 */}
          <Link
            to="/incidents"
            className="p-4 rounded-2xl text-left border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">SLA Incident Desk</span>
              <Wrench className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs font-bold text-amber-900">View Active SLA Support Tickets</p>
            <p className="text-[10px] text-amber-700">{activeTicketsCount} open support ticket(s)</p>
          </Link>

          {/* Quick Action Button 3 */}
          <Link
            to="/copilot"
            className="p-4 rounded-2xl text-left border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">AI Diagnostics</span>
              <Bot className="w-4 h-4 text-teal-700" />
            </div>
            <p className="text-xs font-bold text-teal-900">Run Automated Network Diagnostics</p>
            <p className="text-[10px] text-teal-700">Scans 48 hospital switches & APs</p>
          </Link>
        </div>
      </div>

      {/* Hospital Departments Telemetry Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-600" /> Hospital Departments Telemetry
          </h3>
          <Link to="/map" className="text-xs text-cyan-700 font-bold hover:underline flex items-center gap-1">
            Interactive Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Server Room', key: 'Server Room (SRV-01)' },
            { name: 'Operation Theatre', key: 'Operation Theatre (OT-01)' },
            { name: 'OPD (Outpatient)', key: 'OPD (Outpatient)' },
            { name: 'Radiology DICOM', key: 'Radiology & Imaging' },
            { name: 'ICU Monitoring', key: 'ICU Monitoring' },
            { name: 'IPD (Inpatient)', key: 'IPD (Inpatient)' },
            { name: 'Billing & Accounts', key: 'Billing & Accounts' },
            { name: 'CSSD Utility', key: 'CSSD Sterilization' },
          ].map((dept, idx) => {
            const deptTasks = tasks.filter((t) => t.department.includes(dept.name) || t.department === dept.key);
            const hasFault = deptTasks.some((t) => t.status === 'FAULT');
            const status = hasFault ? 'FAULT DETECTED' : 'HEALTHY';
            const countStr = `${deptTasks.length || 2} Assets`;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-1.5 ${
                  !hasFault
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{dept.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !hasFault ? 'bg-emerald-500' : 'bg-red-500 animate-ping'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{countStr}</span>
                  <span className={`font-bold ${hasFault ? 'text-red-700' : 'text-emerald-700'}`}>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
