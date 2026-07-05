import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  FileText, 
  Server, 
  Printer, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  ShieldCheck, 
  Filter, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface InfrastructureItem {
  id: string;
  name: string;
  category: string;
  department: string;
  dueTime: string; // e.g. "09:00 AM"
  tetMinutes: number; // Target Execution Time in minutes
  status: 'UNCHECKED' | 'OK' | 'FAULT';
  faultNote?: string;
  reportedAt?: string;
}

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === 'IT_HEAD';

  const [selectedDate, setSelectedDate] = useState<string>('2026-07-05');

  // Complete End-to-End Hospital IT Infrastructure Items
  const [items, setItems] = useState<InfrastructureItem[]>([
    { id: '1', name: 'Primary HIS Server (Dell PowerEdge R750)', category: 'Server & Datacenter', department: 'Server Room (SRV-01)', dueTime: '08:30 AM', tetMinutes: 15, status: 'UNCHECKED' },
    { id: '2', name: 'FortiGate 200F Core Firewall & IPS Gateway', category: 'Security & Network', department: 'Server Room (SRV-01)', dueTime: '08:45 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '3', name: 'Cisco Catalyst 9300 Core Switches & Fiber Link', category: 'Core Network', department: 'Server Room (SRV-01)', dueTime: '09:00 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '4', name: 'Server Room Precision AC (Temp Target 18°C)', category: 'Datacenter Facility', department: 'Server Room (SRV-01)', dueTime: '09:15 AM', tetMinutes: 5, status: 'UNCHECKED' },
    { id: '5', name: 'OPD Billing Thermal Printers (HP LaserJet)', category: 'Printers & Scanners', department: 'OPD (Outpatient)', dueTime: '09:30 AM', tetMinutes: 15, status: 'UNCHECKED' },
    { id: '6', name: 'OPD Prescription Barcode Scanners & Displays', category: 'Workstations', department: 'OPD (Outpatient)', dueTime: '09:45 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '7', name: 'OT Central APC 30kVA Online UPS & Battery Bank', category: 'UPS & Power Backup', department: 'Operation Theatre (OT-01)', dueTime: '10:00 AM', tetMinutes: 20, status: 'UNCHECKED' },
    { id: '8', name: 'OT Surgical Display DICOM Medical Monitors', category: 'Medical Displays', department: 'Operation Theatre (OT-01)', dueTime: '10:15 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '9', name: 'PACS DICOM Radiology Gateway & Workstations', category: 'Medical PACS', department: 'Radiology & Imaging', dueTime: '10:30 AM', tetMinutes: 15, status: 'UNCHECKED' },
    { id: '10', name: 'Radiology DICOM Film Printer', category: 'Printers & Scanners', department: 'Radiology & Imaging', dueTime: '10:45 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '11', name: 'ICU Central Patient Monitor Network Gateway', category: 'Critical Care Network', department: 'ICU Monitoring', dueTime: '11:00 AM', tetMinutes: 15, status: 'UNCHECKED' },
    { id: '12', name: 'IPD Nursing Station PCs & Discharge Printers', category: 'Workstations', department: 'IPD (Inpatient)', dueTime: '11:15 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '13', name: 'Billing Counter Receipt Printers & POS Terminals', category: 'Financial Systems', department: 'Billing & Accounts', dueTime: '11:30 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '14', name: 'Biometric Attendance Readers & Door Security', category: 'Access Control', department: 'Main Lobby & Admin', dueTime: '11:45 AM', tetMinutes: 10, status: 'UNCHECKED' },
    { id: '15', name: 'IP CCTV Security Cameras (All Hospital Floors)', category: 'Facility Security', department: 'Security & Surveillance', dueTime: '12:00 PM', tetMinutes: 15, status: 'UNCHECKED' },
    { id: '16', name: 'CSSD Autoclave Barcode Tag Printer', category: 'Utility Printers', department: 'CSSD Sterilization', dueTime: '12:15 PM', tetMinutes: 10, status: 'UNCHECKED' },
  ]);

  // Modal State for Adding New Item (IT Head)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Server & Datacenter');
  const [newItemDept, setNewItemDept] = useState('Server Room (SRV-01)');
  const [newItemDue, setNewItemDue] = useState('09:00 AM');
  const [newItemTet, setNewItemTet] = useState<number>(15);

  // Modal State for Editing TET & Due Time (IT Head)
  const [editingItem, setEditingItem] = useState<InfrastructureItem | null>(null);

  // Fault reporting modal state
  const [activeFaultId, setActiveFaultId] = useState<string | null>(null);
  const [faultInput, setFaultInput] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [adminNotificationSent, setAdminNotificationSent] = useState(false);

  // Mark Item OK
  const handleMarkOk = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'OK' } : item))
    );
  };

  // Submit Fault
  const handleSubmitFault = (id: string) => {
    if (!faultInput.trim()) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'FAULT',
              faultNote: faultInput,
              reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : item
      )
    );
    setActiveFaultId(null);
    setAdminNotificationSent(true);
    setTimeout(() => setAdminNotificationSent(false), 5000);
  };

  // IT Head: Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: InfrastructureItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: newItemCat,
      department: newItemDept,
      dueTime: newItemDue,
      tetMinutes: Number(newItemTet),
      status: 'UNCHECKED'
    };
    setItems((prev) => [...prev, newItem]);
    setShowAddModal(false);
    setNewItemName('');
  };

  // IT Head: Delete Item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // IT Head: Save Edit TET & Due Time
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const completedCount = items.filter((i) => i.status !== 'UNCHECKED').length;
  const faultCount = items.filter((i) => i.status === 'FAULT').length;
  const okCount = items.filter((i) => i.status === 'OK').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            End-to-End Hospital IT Infrastructure Checklist
          </h1>
          <p className="text-xs text-slate-500">
            Inspector: <span className="font-bold text-slate-900">{user?.fullName}</span> ({isHead ? 'IT Head & Admin' : 'IT Executive'}) • Complete coverage across 16 core IT categories.
          </p>
        </div>

        {/* Live Calendar Date Switcher & Add Item Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <CalendarIcon className="w-4 h-4 text-cyan-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
            />
          </div>

          {/* IT Head Exclusive Add Button */}
          {isHead && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Item to Checklist
            </button>
          )}
        </div>
      </div>

      {/* Admin Real-Time Notification Toast */}
      {adminNotificationSent && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>High-Priority Fault Notification sent to IT Head (vatsal_IT_Head)!</span>
          </div>
          <span className="text-[10px] font-mono text-amber-800 font-bold">Real-time Notification Dispatched</span>
        </div>
      )}

      {/* Progress & Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Items</span>
          <p className="text-2xl font-extrabold text-slate-900">{items.length} Assets</p>
          <p className="text-[10px] text-slate-500 font-semibold">10 Hospital Departments</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Inspected Progress</span>
          <p className="text-2xl font-extrabold text-slate-900">{completedCount} / {items.length}</p>
          <p className="text-[10px] text-emerald-600 font-bold">{Math.round((completedCount / items.length) * 100)}% Completed</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Verified OK</span>
          <p className="text-2xl font-extrabold text-emerald-600">{okCount}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">Operational Systems</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Faults Reported</span>
          <p className="text-2xl font-extrabold text-red-600">{faultCount}</p>
          <p className="text-[10px] text-amber-700 font-bold">{faultCount > 0 ? 'Admin Notified' : 'Zero Faults'}</p>
        </div>
      </div>

      {/* Main Checklist Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Daily Inspection Items ({selectedDate})
          </h3>
          {isHead && (
            <span className="text-[11px] text-cyan-800 font-bold bg-cyan-100 px-2.5 py-0.5 rounded border border-cyan-200">
              IT Head Admin Controls Enabled (Add / Edit TET / Remove)
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.status === 'OK'
                  ? 'bg-emerald-50/40'
                  : item.status === 'FAULT'
                  ? 'bg-red-50/50'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{item.name}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.department}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-600" /> Due: {item.dueTime} | TET: {item.tetMinutes}m
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">{item.category}</p>

                {item.status === 'FAULT' && (
                  <div className="p-2.5 rounded-xl bg-white border border-red-200 text-red-800 text-xs mt-2 space-y-0.5">
                    <p className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Issue Reported: {item.faultNote}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">Reported at {item.reportedAt} • Admin (vatsal_IT_Head) Notified</p>
                  </div>
                )}
              </div>

              {/* Action & Edit Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* IT Head Admin Edit/Delete Controls */}
                {isHead && (
                  <div className="flex items-center gap-1 mr-2 border-r border-slate-200 pr-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      title="Edit Due Time & TET Time"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-700 hover:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      title="Remove from Checklist"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Inspection Check Buttons */}
                {item.status === 'OK' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" /> System Alright
                  </span>
                ) : item.status === 'FAULT' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1 border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" /> Issue Raised
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleMarkOk(item.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> System Alright
                    </button>

                    <button
                      onClick={() => {
                        setActiveFaultId(item.id);
                        setFaultInput('');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-600" /> Raise Fault
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fault Drawer */}
      {activeFaultId && (
        <div className="p-5 rounded-2xl bg-white border-2 border-red-300 shadow-xl space-y-3 animate-in fade-in">
          <h3 className="text-sm font-extrabold text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-red-600" /> Describe Infrastructure Fault
          </h3>
          <textarea
            value={faultInput}
            onChange={(e) => setFaultInput(e.target.value)}
            placeholder="Describe issue (e.g. OPD printer paper jam, server temperature high)..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setActiveFaultId(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmitFault(activeFaultId)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Raise Issue & Dispatch Notification to IT Head
            </button>
          </div>
        </div>
      )}

      {/* IT Head Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Add IT Infrastructure Checklist Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Infrastructure Asset Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. OT Backup UPS Line 02"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newItemDept}
                    onChange={(e) => setNewItemDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="text"
                    value={newItemDue}
                    onChange={(e) => setNewItemDue(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                    placeholder="09:30 AM"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TET (Target Execution Mins)</label>
                  <input
                    type="number"
                    value={newItemTet}
                    onChange={(e) => setNewItemTet(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IT Head Edit Item TET & Due Time Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Edit TET & Due Time</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="text"
                    value={editingItem.dueTime}
                    onChange={(e) => setEditingItem({ ...editingItem, dueTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TET Time (Minutes)</label>
                  <input
                    type="number"
                    value={editingItem.tetMinutes}
                    onChange={(e) => setEditingItem({ ...editingItem, tetMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Finalize & Generate Executive Report */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Finish Daily Morning Inspection Routine</h3>
            <p className="text-xs text-slate-500">
              Generates the Daily Executive Inspection Report and delivers it directly to Admin (<span className="font-bold text-cyan-800">vatsal_IT_Head</span>).
            </p>
          </div>
          <button
            disabled={completedCount < items.length}
            onClick={() => setReportGenerated(true)}
            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Submit Inspection & Deliver Report to IT Head
          </button>
        </div>

        {reportGenerated && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Daily Executive Inspection Report Sent to IT Head
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800">Status: Delivered to vatsal_IT_Head</span>
            </div>
            <p className="text-xs text-emerald-800">
              Summary for <span className="font-bold">{selectedDate}</span>: Checked <span className="font-bold">{items.length}</span> hospital IT systems. <span className="font-bold text-emerald-900">{completedCount - faultCount} Verified OK</span> • <span className="font-bold text-red-700">{faultCount} Faults Reported</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
