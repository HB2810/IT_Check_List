import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const [tasksDone, setTasksDone] = useState<number>(8);
  const [opdFixed, setOpdFixed] = useState<boolean>(false);

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
            HIS server temperature is <span className="font-bold text-emerald-300">18°C (Optimal)</span>. {opdFixed ? 'All OPD printers are running smoothly!' : '1 printer jam reported in OPD Counter 03.'}
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital SLA</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">99.98%</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">All Systems Operational</p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-700">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tickets</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{opdFixed ? '0' : '1'}</p>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">{opdFixed ? 'No tickets pending' : 'OPD Printer Roller Jam'}</p>
          </div>
          <div className={`p-3 rounded-2xl ${opdFixed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Completed</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{tasksDone} / 12</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Daily Inspection Queue</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storage Health</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">12% Risk</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">84 Days Capacity Remaining</p>
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
          {/* Quick Fix Button 1 */}
          <button
            onClick={() => setOpdFixed(!opdFixed)}
            className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-2 ${
              opdFixed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">OPD Billing Printer</span>
              {opdFixed ? <Check className="w-4 h-4 text-emerald-600" /> : <Wrench className="w-4 h-4 text-amber-600" />}
            </div>
            <p className="text-xs font-semibold">
              {opdFixed ? 'Status: Resolved & Online' : 'Action: Mark Roller Jam Resolved'}
            </p>
            <p className="text-[10px] text-slate-500">{opdFixed ? '1-click toggle to reopen' : 'Assigned to Het Patel • OPD Counter 03'}</p>
          </button>

          {/* Quick Fix Button 2 */}
          <button
            onClick={() => setTasksDone((prev) => Math.min(prev + 1, 12))}
            className="p-4 rounded-2xl text-left border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Morning Inspection</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Mark Next Daily Task Done</p>
            <p className="text-[10px] text-slate-500">Completed: {tasksDone} of 12 checklists</p>
          </button>

          {/* Quick Fix Button 3 */}
          <Link
            to="/copilot"
            className="p-4 rounded-2xl text-left border border-cyan-200 bg-cyan-50/60 hover:bg-cyan-100/70 transition-all flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider">AI Diagnostics</span>
              <Bot className="w-4 h-4 text-cyan-700" />
            </div>
            <p className="text-xs font-bold text-cyan-900">Run Automated Network Diagnostics</p>
            <p className="text-[10px] text-cyan-700">Scans 48 hospital switches & APs</p>
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
            { name: 'Server Room', count: '6 Assets', status: 'HEALTHY' },
            { name: 'Operation Theatre', count: '8 Assets', status: 'HEALTHY' },
            { name: 'OPD (Outpatient)', count: '12 Assets', status: opdFixed ? 'HEALTHY' : '1 ALERT' },
            { name: 'Radiology DICOM', count: '5 Assets', status: 'HEALTHY' },
            { name: 'ICU Monitoring', count: '9 Assets', status: 'HEALTHY' },
            { name: 'Billing & Accounts', count: '4 Assets', status: 'HEALTHY' },
            { name: 'Reception Desk', count: '3 Assets', status: 'HEALTHY' },
            { name: 'CSSD Utility', count: '2 Assets', status: 'HEALTHY' },
          ].map((dept, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-1.5 ${
                dept.status === 'HEALTHY'
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{dept.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    dept.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>{dept.count}</span>
                <span className="font-bold">{dept.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
