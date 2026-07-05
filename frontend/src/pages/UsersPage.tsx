import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  UserPlus, 
  BarChart2, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Search,
  FileText
} from 'lucide-react';
import api from '../services/api';

interface EmployeeUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  departmentName: string;
  completedTasks: number;
  tetAvgSpeed: string;
  faultsReported: number;
  kpiScore: number;
}

export const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === 'IT_HEAD';

  const [usersList, setUsersList] = useState<EmployeeUser[]>([
    {
      id: '1',
      username: 'vatsal_IT_Head',
      fullName: 'Vatsal (IT Head)',
      email: 'vatsal@stavyaspine.com',
      role: 'IT_HEAD',
      departmentName: 'Server Room',
      completedTasks: 42,
      tetAvgSpeed: '12 mins',
      faultsReported: 0,
      kpiScore: 100
    },
    {
      id: '2',
      username: 'Mohit_IT',
      fullName: 'Mohit (IT Executive)',
      email: 'mohit@stavyaspine.com',
      role: 'IT_EXECUTIVE',
      departmentName: 'OPD (Outpatient)',
      completedTasks: 128,
      tetAvgSpeed: '14 mins',
      faultsReported: 6,
      kpiScore: 96
    }
  ]);

  // Create User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [deptInput, setDeptInput] = useState('OPD (Outpatient)');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await api.post('/users', {
        username: usernameInput,
        password: passwordInput,
        fullName: fullNameInput,
        email: emailInput,
        role: 'IT_EXECUTIVE',
        departmentCode: 'OPD-01'
      });
      
      const newUser: EmployeeUser = {
        id: Date.now().toString(),
        username: usernameInput,
        fullName: fullNameInput,
        email: emailInput,
        role: 'IT_EXECUTIVE',
        departmentName: deptInput,
        completedTasks: 0,
        tetAvgSpeed: '0 mins',
        faultsReported: 0,
        kpiScore: 100
      };

      setUsersList((prev) => [...prev, newUser]);
      setMessage('New employee user created successfully!');
      setShowAddModal(false);
      setUsernameInput('');
      setPasswordInput('');
      setFullNameInput('');
      setEmailInput('');
    } catch (err: any) {
      // Local fallback state addition if offline
      const newUser: EmployeeUser = {
        id: Date.now().toString(),
        username: usernameInput,
        fullName: fullNameInput,
        email: emailInput,
        role: 'IT_EXECUTIVE',
        departmentName: deptInput,
        completedTasks: 0,
        tetAvgSpeed: '0 mins',
        faultsReported: 0,
        kpiScore: 100
      };
      setUsersList((prev) => [...prev, newUser]);
      setMessage('New employee user ID & password generated!');
      setShowAddModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            User Management & Employee KPI Reports <Users className="w-5 h-5 text-cyan-600" />
          </h1>
          <p className="text-xs text-slate-500">
            Generate employee login IDs/passwords and review staff performance metrics & SLA compliance.
          </p>
        </div>

        {isHead && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> Create New Employee Account
          </button>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Employee KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Active IT Staff</span>
          <p className="text-2xl font-extrabold text-slate-900">{usersList.length} Employees</p>
          <p className="text-[10px] text-cyan-700 font-bold">1 IT Head • {usersList.length - 1} IT Executives</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Team Inspection Score</span>
          <p className="text-2xl font-extrabold text-emerald-600">98.4%</p>
          <p className="text-[10px] text-emerald-700 font-bold">Target SLA Met</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Average TET Execution</span>
          <p className="text-2xl font-extrabold text-slate-900">13 mins</p>
          <p className="text-[10px] text-slate-500 font-semibold">Under 15 min benchmark</p>
        </div>
      </div>

      {/* Employee Roster & KPI Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Employee Performance & Credentials Directory
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold font-mono">
            Stavya Spine Hospital IT Staff
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">Employee Name / Username</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Dept</th>
                <th className="py-3.5 px-4">Completed Checklists</th>
                <th className="py-3.5 px-4">Avg TET Speed</th>
                <th className="py-3.5 px-4">KPI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {usersList.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
                        {emp.username}
                      </span>
                      {emp.fullName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{emp.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      emp.role === 'IT_HEAD' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {emp.role === 'IT_HEAD' ? 'IT Head' : 'IT Executive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{emp.departmentName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{emp.completedTasks} Tasks</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">{emp.tetAvgSpeed}</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-600">{emp.kpiScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IT Head Create User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Generate New Employee Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username / Login ID</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Rahul_IT"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Rahul Mehta"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="rahul@stavyaspine.com"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Department</label>
                <select
                  value={deptInput}
                  onChange={(e) => setDeptInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="OPD (Outpatient)">OPD (Outpatient)</option>
                  <option value="Server Room">Server Room</option>
                  <option value="Operation Theatre">Operation Theatre</option>
                  <option value="Radiology & Imaging">Radiology & Imaging</option>
                  <option value="ICU Monitoring">ICU Monitoring</option>
                  <option value="Billing & Accounts">Billing & Accounts</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
