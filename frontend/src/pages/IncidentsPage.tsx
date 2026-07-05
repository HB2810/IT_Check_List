import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Plus, Clock, User, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface IncidentTicket {
  id: string;
  ticketNumber: string;
  title: string;
  severity: string;
  status: string;
  department: string;
  assignee: string;
  reportedAt: string;
}

export const IncidentsPage: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<IncidentTicket[]>([]);

  // Report Incident State
  const [showReportModal, setShowReportModal] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [severityInput, setSeverityInput] = useState('MEDIUM');
  const [deptInput, setDeptInput] = useState('OPD (Outpatient)');

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    const newInc: IncidentTicket = {
      id: Date.now().toString(),
      ticketNumber: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: titleInput,
      severity: severityInput,
      status: 'OPEN',
      department: deptInput,
      assignee: 'Mohit (IT Executive)',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIncidents((prev) => [newInc, ...prev]);
    setShowReportModal(false);
    setTitleInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Support Incidents & SLA Desk</h1>
          <p className="text-xs text-slate-500">
            Fresh production incident log for Stavya Spine Hospital IT tickets and SLA tracking.
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Report New Support Incident
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Incident Tickets</span>
          <span className="text-xs text-slate-500 font-mono font-bold">{incidents.length} Tickets</span>
        </div>

        {incidents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-800">Zero Active Tickets</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All hospital IT systems operational! Click "Report New Support Incident" above if an issue occurs.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((ticket) => (
              <div key={ticket.id} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                      {ticket.ticketNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                      {ticket.severity}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{ticket.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-800">Reported: {ticket.reportedAt}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold pt-1">
                  <span>Department: {ticket.department}</span>
                  <span>Assignee: {ticket.assignee}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Report Support Incident</h3>
            <form onSubmit={handleReportIncident} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Title / Issue</label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. OPD Billing printer paper jam"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={severityInput}
                    onChange={(e) => setSeverityInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold shadow-md shadow-amber-600/20"
                >
                  Create Incident Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
