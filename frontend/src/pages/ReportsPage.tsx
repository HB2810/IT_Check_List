import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks, InspectionReport } from '../contexts/TaskContext';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  ShieldCheck, 
  Printer, 
  ChevronRight, 
  Calendar,
  Search,
  Check
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === 'IT_HEAD';
  const { reports, acknowledgeReport } = useTasks();

  const [selectedReport, setSelectedReport] = useState<InspectionReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(
    (rep) =>
      rep.date.includes(searchTerm) ||
      rep.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-600" />
            Daily Checklist Inspection Reports & Audit Hub
          </h1>
          <p className="text-xs text-slate-500">
            Official hospital IT operations log • Submitted daily inspection reports & IT Head sign-off audit.
          </p>
        </div>

        {/* Search / Filter Bar */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search date or inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Reports Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Reports Filed</span>
          <p className="text-2xl font-extrabold text-slate-900">{reports.length} Reports</p>
          <p className="text-[10px] text-slate-500 font-semibold">Hospital Compliance Archive</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Head Approved & Signed</span>
          <p className="text-2xl font-extrabold text-emerald-600">
            {reports.filter((r) => r.status === 'ACKNOWLEDGED_BY_HEAD').length} Reports
          </p>
          <p className="text-[10px] text-emerald-700 font-semibold">Digitally Signed Off</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Awaiting Head Review</span>
          <p className="text-2xl font-extrabold text-amber-600">
            {reports.filter((r) => r.status === 'SUBMITTED').length} Reports
          </p>
          <p className="text-[10px] text-amber-700 font-bold">
            {isHead ? 'Action Required (Sign-Off Pending)' : 'Delivered to IT Head'}
          </p>
        </div>
      </div>

      {/* Main Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Daily Checklist Submissions Log ({filteredReports.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">
            {isHead ? 'Click any report to inspect & sign off' : 'View submitted checklist details'}
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-800">No Submitted Reports Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When an inspector submits the daily checklist from the "Inspection Checklist" page, the official report will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="p-4 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-600" /> Date: {report.date}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Inspector: {report.submittedBy}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Submitted: {report.submittedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {report.okCount} Verified OK
                    </span>
                    {report.faultCount > 0 ? (
                      <span className="text-red-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> {report.faultCount} Fault(s) Reported
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Zero Faults</span>
                    )}
                  </div>
                </div>

                {/* Status & Action Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {report.status === 'ACKNOWLEDGED_BY_HEAD' ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Head Signed ({report.acknowledgedBy})
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-600" /> Pending Head Review
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Inspection Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header / Brand */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-700">
                  Stavya Spine Hospital IT Operations
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Daily IT Infrastructure Inspection Report ({selectedReport.date})
                </h2>
                <p className="text-xs text-slate-500">
                  Inspector: <span className="font-bold text-slate-800">{selectedReport.submittedBy}</span> • Time: {selectedReport.submittedAt}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" /> Print / Export PDF
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Approval & Sign-Off Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">IT Head Sign-off Status</span>
                {selectedReport.status === 'ACKNOWLEDGED_BY_HEAD' ? (
                  <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Approved & Signed by {selectedReport.acknowledgedBy} at {selectedReport.acknowledgedAt}
                  </p>
                ) : (
                  <p className="text-xs text-amber-800 font-bold flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Awaiting IT Head Sign-Off & Approval
                  </p>
                )}
              </div>

              {isHead && selectedReport.status !== 'ACKNOWLEDGED_BY_HEAD' && (
                <button
                  onClick={() => {
                    acknowledgeReport(selectedReport.id, user?.fullName);
                    setSelectedReport((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: 'ACKNOWLEDGED_BY_HEAD',
                            acknowledgedBy: user?.fullName || 'Vatsal Patel (IT Head)',
                            acknowledgedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }
                        : null
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0"
                >
                  <Check className="w-4 h-4" /> Acknowledge & Sign Off Report
                </button>
              )}
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Checked</span>
                <p className="text-xl font-extrabold text-slate-900">{selectedReport.totalItems} Assets</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Verified OK</span>
                <p className="text-xl font-extrabold text-emerald-700">{selectedReport.okCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
                <span className="text-[10px] uppercase font-bold text-red-700">Faults Reported</span>
                <p className="text-xl font-extrabold text-red-700">{selectedReport.faultCount}</p>
              </div>
            </div>

            {/* Detailed Checklist Assets Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Full Infrastructure Item Inspection Breakdown
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedReport.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-semibold">{item.department} • {item.category}</p>
                      {item.faultNote && (
                        <p className="text-red-700 font-bold text-[11px] mt-1 bg-red-50 p-1.5 rounded border border-red-200">
                          Fault Note: {item.faultNote} (Reported at {item.reportedAt})
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {item.status === 'OK' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          OK / Operational
                        </span>
                      ) : item.status === 'FAULT' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-bold text-[11px]">
                          FAULT DETECTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px]">
                          UNCHECKED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
