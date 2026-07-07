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
  ChevronRight,
  Archive,
  ShoppingCart,
  CheckSquare as CheckSquareIcon,
  RefreshCw,
  Layers,
  Inbox,
  Sparkles
} from 'lucide-react';

import { useTasks } from '../contexts/TaskContext';
import { useInventory, InventoryItem, InventoryRequest } from '../contexts/InventoryContext';

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
  reportedBy?: string;
}

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === 'IT_HEAD';
  const { 
    tasks: items, 
    markTaskOk, 
    submitFault, 
    addTask, 
    editTask, 
    deleteTask, 
    submitInspectionReport,
    adminNotificationSent 
  } = useTasks();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  // Tab State
  const [activeTab, setActiveTab] = useState<'checklist' | 'inventory'>('checklist');

  // Inventory context
  const {
    inventoryItems,
    requests: inventoryRequests,
    loading: inventoryLoading,
    addInventoryItem,
    restockItem,
    createRequest,
    approveRequest,
    rejectRequest
  } = useInventory();

  // Inventory UI States
  const [invSearch, setInvSearch] = useState('');
  const [invCatFilter, setInvCatFilter] = useState('ALL');
  const [showAddInvModal, setShowAddInvModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedInvItem, setSelectedInvItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(5);

  // Request Modal States
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqItemId, setReqItemId] = useState('');
  const [reqQuantity, setReqQuantity] = useState(1);
  const [reqPurpose, setReqPurpose] = useState('');
  const [reqNotes, setReqNotes] = useState('');

  // Approval/Reject Action States
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionRequestId, setActionRequestId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  // Form States for adding new item
  const [newInvName, setNewInvName] = useState('');
  const [newInvCategory, setNewInvCategory] = useState('Consumables');
  const [newInvTotalStock, setNewInvTotalStock] = useState(10);
  const [newInvReorderLevel, setNewInvReorderLevel] = useState(3);
  const [newInvUnit, setNewInvUnit] = useState('Units');
  const [newInvLocation, setNewInvLocation] = useState('Cabinet A-1');

  // Helpers
  const handleOpenRequestModal = (itemId: string, defaultPurpose: string = '') => {
    setReqItemId(itemId);
    setReqQuantity(1);
    setReqPurpose(defaultPurpose);
    setReqNotes('');
    setShowRequestModal(true);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqItemId || reqQuantity <= 0 || !reqPurpose.trim()) return;
    createRequest({
      itemId: reqItemId,
      quantity: reqQuantity,
      purpose: reqPurpose,
      notes: reqNotes
    });
    setShowRequestModal(false);
  };

  const handleOpenActionModal = (reqId: string, type: 'APPROVE' | 'REJECT') => {
    setActionRequestId(reqId);
    setActionType(type);
    setActionNotes('');
    setShowActionModal(true);
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionRequestId || !actionType) return;
    if (actionType === 'APPROVE') {
      approveRequest(actionRequestId, actionNotes);
    } else {
      rejectRequest(actionRequestId, actionNotes);
    }
    setShowActionModal(false);
  };

  const handleAddInvItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName.trim()) return;
    addInventoryItem({
      name: newInvName,
      category: newInvCategory,
      totalStock: Number(newInvTotalStock),
      reorderLevel: Number(newInvReorderLevel),
      unit: newInvUnit,
      location: newInvLocation
    });
    setShowAddInvModal(false);
    setNewInvName('');
  };

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvItem || restockQuantity <= 0) return;
    restockItem(selectedInvItem.id, restockQuantity);
    setShowRestockModal(false);
  };

  // Mark Item OK
  const handleMarkOk = (id: string) => {
    markTaskOk(id);
  };

  // Submit Fault
  const handleSubmitFault = (id: string) => {
    if (!faultInput.trim()) return;
    submitFault(id, faultInput, user?.fullName);
    setActiveFaultId(null);
  };

  // IT Head: Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addTask({
      name: newItemName,
      category: newItemCat,
      department: newItemDept,
      dueTime: newItemDue,
      tetMinutes: Number(newItemTet)
    });
    setShowAddModal(false);
    setNewItemName('');
  };

  // IT Head: Delete Item
  const handleDeleteItem = (id: string) => {
    deleteTask(id);
  };

  // IT Head: Save Edit TET & Due Time
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    editTask(editingItem);
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
            {activeTab === 'checklist' 
              ? 'End-to-End Hospital IT Infrastructure Checklist' 
              : 'Smart Inventory & Consumables System'}
          </h1>
          <p className="text-xs text-slate-500">
            {activeTab === 'checklist' 
              ? `Inspector: ${user?.fullName} (${isHead ? 'IT Head & Admin' : 'IT Executive'}) • Complete coverage across 16 core IT categories.`
              : `Manager: ${user?.fullName} (${isHead ? 'IT Head & Admin' : 'IT Executive'}) • Track stock, restock parts, and approve requests.`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {activeTab === 'checklist' ? (
            <>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CalendarIcon className="w-4 h-4 text-cyan-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>
              {isHead && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Item to Checklist
                </button>
              )}
            </>
          ) : (
            <>
              {isHead && (
                <button
                  onClick={() => {
                    setNewInvName('');
                    setNewInvCategory('Consumables');
                    setNewInvTotalStock(10);
                    setNewInvReorderLevel(3);
                    setNewInvUnit('Units');
                    setNewInvLocation('Cabinet A-1');
                    setShowAddInvModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Stock Item
                </button>
              )}
              <button
                onClick={() => {
                  setReqItemId(inventoryItems[0]?.id || '');
                  setReqQuantity(1);
                  setReqPurpose('');
                  setReqNotes('');
                  setShowRequestModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" /> Request Stock Item
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-200/50 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'checklist'
              ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckSquareIcon className="w-4 h-4" /> Inspection Checklist
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inventory'
              ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Archive className="w-4 h-4" /> Smart Inventory System
        </button>
      </div>

      {activeTab === 'checklist' ? (
        <>
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
                      <div className="p-2.5 rounded-xl bg-white border border-red-200 text-red-800 text-xs mt-2 space-y-2">
                        <div>
                          <p className="font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Issue Reported: {item.faultNote}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">Reported at {item.reportedAt} • Admin (vatsal_IT_Head) Notified</p>
                        </div>
                        <button
                          onClick={() => {
                            let suggestedItem = inventoryItems[0]?.id || '';
                            const lowercaseName = item.name.toLowerCase();
                            if (lowercaseName.includes('printer') || lowercaseName.includes('barcode')) {
                              suggestedItem = inventoryItems.find(i => i.name.toLowerCase().includes('toner') || i.name.toLowerCase().includes('roll'))?.id || suggestedItem;
                            } else if (lowercaseName.includes('keyboard') || lowercaseName.includes('pc') || lowercaseName.includes('nursing station') || lowercaseName.includes('counter')) {
                              suggestedItem = inventoryItems.find(i => i.name.toLowerCase().includes('keyboard') || i.name.toLowerCase().includes('mouse'))?.id || suggestedItem;
                            } else if (lowercaseName.includes('switch') || lowercaseName.includes('cisco') || lowercaseName.includes('cable') || lowercaseName.includes('link')) {
                              suggestedItem = inventoryItems.find(i => i.name.toLowerCase().includes('cable'))?.id || suggestedItem;
                            } else if (lowercaseName.includes('ups') || lowercaseName.includes('battery')) {
                              suggestedItem = inventoryItems.find(i => i.name.toLowerCase().includes('battery'))?.id || suggestedItem;
                            }
                            
                            handleOpenRequestModal(suggestedItem, `Spare part required for checklist item fault on: ${item.name} (${item.faultNote})`);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 border border-red-300 text-red-800 font-bold text-[10px] transition-all"
                        >
                          <ShoppingCart className="w-3 h-3 text-red-700" /> Request Stock for Repair
                        </button>
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
                onClick={() => {
                  submitInspectionReport(user?.fullName);
                  setReportGenerated(true);
                }}
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
                  <span className="text-[10px] font-mono font-bold text-emerald-800">Status: Delivered & Synced Live</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Summary for <span className="font-bold">{selectedDate}</span>: Checked <span className="font-bold">{items.length}</span> hospital IT systems. <span className="font-bold text-emerald-900">{completedCount - faultCount} Verified OK</span> • <span className="font-bold text-red-700">{faultCount} Faults Reported</span>.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ==================== SMART INVENTORY TAB ==================== */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Inventory Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-600" /> Total Stock Types
              </span>
              <p className="text-2xl font-extrabold text-slate-900">{inventoryItems.length} Items</p>
              <p className="text-[10px] text-slate-500 font-semibold">Consumables & Hardware Spares</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Low Stock Alerts
              </span>
              <p className={`text-2xl font-extrabold ${inventoryItems.filter(i => i.availableStock <= i.reorderLevel).length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {inventoryItems.filter(i => i.availableStock <= i.reorderLevel).length} Alerts
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Items below critical reorder level</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Inbox className="w-3.5 h-3.5 text-cyan-600" /> Pending Approvals
              </span>
              <p className={`text-2xl font-extrabold ${inventoryRequests.filter(r => r.status === 'PENDING').length > 0 ? 'text-cyan-700 animate-pulse font-extrabold' : 'text-slate-900'}`}>
                {inventoryRequests.filter(r => r.status === 'PENDING').length} Requests
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Requires IT Head sign-off</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Inventory List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Inventory Directory
                  </h3>
                  
                  {/* Search and Filter Row */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search stock..."
                      value={invSearch}
                      onChange={(e) => setInvSearch(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 placeholder-slate-400"
                    />
                    <select
                      value={invCatFilter}
                      onChange={(e) => setInvCatFilter(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Consumables">Consumables</option>
                      <option value="Peripherals">Peripherals</option>
                      <option value="Networking">Networking</option>
                      <option value="Power Backup">Power Backup</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Item Name / Category</th>
                        <th className="py-3 px-4">Stock Level</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {inventoryItems
                        .filter(item => {
                          const matchesSearch = item.name.toLowerCase().includes(invSearch.toLowerCase()) || item.category.toLowerCase().includes(invSearch.toLowerCase());
                          const matchesCat = invCatFilter === 'ALL' || item.category === invCatFilter;
                          return matchesSearch && matchesCat;
                        })
                        .map(item => {
                          const isLowStock = item.availableStock <= item.reorderLevel;
                          const percentage = Math.round((item.availableStock / item.totalStock) * 100);
                          return (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-4 space-y-0.5">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  {item.name}
                                  {isLowStock && (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                                      LOW STOCK
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-semibold uppercase">{item.category}</div>
                              </td>
                              <td className="py-3.5 px-4 space-y-1.5 min-w-[150px]">
                                <div className="flex items-center justify-between text-[11px] font-mono">
                                  <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                                    {item.availableStock} / {item.totalStock} {item.unit}
                                  </span>
                                  <span className="text-slate-400 font-semibold">{percentage}% Available</span>
                                </div>
                                {/* Stock Bar */}
                                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${isLowStock ? 'bg-red-500' : 'bg-cyan-500'}`}
                                    style={{ width: `${Math.min(100, percentage)}%` }}
                                  />
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 font-medium font-mono text-[10px]">
                                {item.location}
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                                {isHead && (
                                  <button
                                    onClick={() => {
                                      setSelectedInvItem(item);
                                      setRestockQuantity(5);
                                      setShowRestockModal(true);
                                    }}
                                    title="Restock Item"
                                    className="p-1 px-2.5 rounded bg-slate-100 border border-slate-200 text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 hover:border-cyan-200 transition-colors font-bold text-[10px] inline-flex items-center gap-1"
                                  >
                                    <RefreshCw className="w-3 h-3" /> Restock
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenRequestModal(item.id)}
                                  disabled={item.availableStock <= 0}
                                  className="p-1 px-2.5 rounded bg-cyan-600 disabled:bg-slate-150 disabled:text-slate-400 border border-transparent text-white font-bold text-[10px] hover:bg-cyan-700 transition-colors inline-flex items-center gap-1"
                                >
                                  <ShoppingCart className="w-3 h-3" /> Request
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Approval Queue (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Requests & Approvals
                  </h3>
                </div>

                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {inventoryRequests.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No stock request records found.
                    </div>
                  ) : (
                    inventoryRequests.map(req => {
                      const isPending = req.status === 'PENDING';
                      return (
                        <div key={req.id} className="p-4 space-y-2 text-xs">
                          {/* Top Row: Info */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-slate-900">{req.itemName}</p>
                              <p className="text-[10px] text-slate-500 font-semibold">{req.itemCategory} • Qty: {req.quantity}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : req.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse'
                            }`}>
                              {req.status}
                            </span>
                          </div>

                          {/* Middle row: Purpose */}
                          <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                            <span className="font-bold text-slate-500">Purpose:</span> {req.purpose}
                          </p>

                          {/* Footer row: Timestamps & Notes */}
                          <div className="text-[10px] space-y-0.5 text-slate-500 font-semibold">
                            <p>Requested by: <span className="text-slate-800">{req.requestedByName}</span></p>
                            {req.approvedByName && (
                              <p>{req.status === 'APPROVED' ? 'Approved' : 'Rejected'} by: <span className="text-slate-800">{req.approvedByName}</span></p>
                            )}
                            {req.notes && (
                              <p className="italic text-[10px] text-cyan-850 bg-cyan-50/70 px-1.5 py-0.5 rounded mt-1 font-medium border border-cyan-100/50">
                                Notes: "{req.notes}"
                              </p>
                            )}
                            <p className="text-[9px] text-slate-400 font-mono pt-1">
                              {new Date(req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                          </div>

                          {/* Head actions */}
                          {isPending && isHead && (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleOpenActionModal(req.id, 'APPROVE')}
                                className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all text-center"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleOpenActionModal(req.id, 'REJECT')}
                                className="flex-1 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[10px] transition-all text-center"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SMART INVENTORY MODALS ==================== */}

      {/* 1. Request Stock Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <ShoppingCart className="w-4 h-4 text-cyan-600" /> Request Stock / Part Issue
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Inventory Item</label>
                <select
                  value={reqItemId}
                  onChange={(e) => setReqItemId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs"
                  required
                >
                  <option value="" disabled>-- Select Stock Item --</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id} disabled={item.availableStock <= 0}>
                      {item.name} (Available: {item.availableStock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={inventoryItems.find(i => i.id === reqItemId)?.availableStock || 10}
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={inventoryItems.find(i => i.id === reqItemId)?.unit || 'Units'}
                    className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-500 font-bold"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose / Task Reference</label>
                <input
                  type="text"
                  value={reqPurpose}
                  onChange={(e) => setReqPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Keyboard replacement for OPD room 103"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Broken keyboard has sticky keys"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  Submit Stock Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add New Inventory Item Modal (IT HEAD) */}
      {showAddInvModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <Plus className="w-4 h-4 text-cyan-600" /> Register New Inventory Stock
              </h3>
              <button onClick={() => setShowAddInvModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInvItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newInvName}
                  onChange={(e) => setNewInvName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                  placeholder="e.g. RJ45 Connectors Cat6"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newInvCategory}
                    onChange={(e) => setNewInvCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="Consumables">Consumables</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Networking">Networking</option>
                    <option value="Power Backup">Power Backup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    value={newInvUnit}
                    onChange={(e) => setNewInvUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                    placeholder="e.g. Boxes, Rolls, Units"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Total Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newInvTotalStock}
                    onChange={(e) => setNewInvTotalStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Threshold Alert</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newInvReorderLevel}
                    onChange={(e) => setNewInvReorderLevel(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Storage Location</label>
                <input
                  type="text"
                  required
                  value={newInvLocation}
                  onChange={(e) => setNewInvLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Cabinet A-4, Server Room Drawer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddInvModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Restock Inventory Item Modal (IT HEAD) */}
      {showRestockModal && selectedInvItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <RefreshCw className="w-4 h-4 text-cyan-600" /> Restock: {selectedInvItem.name}
              </h3>
              <button onClick={() => setShowRestockModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestock} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                <p className="text-slate-500 font-semibold mb-1">Current Stock Details:</p>
                <p className="font-mono text-slate-800 font-bold">Available: {selectedInvItem.availableStock} {selectedInvItem.unit}</p>
                <p className="font-mono text-slate-800 font-bold">Total: {selectedInvItem.totalStock} {selectedInvItem.unit}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity to Add (Restock)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  Restock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Action Request Notes Modal (Approve / Reject) (IT HEAD) */}
      {showActionModal && actionType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Confirm: {actionType === 'APPROVE' ? 'Approve Stock Request' : 'Reject Stock Request'}
              </h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Approver/Rejection Notes</label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={actionType === 'APPROVE' ? "e.g. Issued 1 cartridge from Cabinet A-1" : "e.g. Request denied: Sufficient spares exist at nursing desk."}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  rows={3}
                  required={actionType === 'REJECT'}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white font-bold shadow-md ${
                    actionType === 'APPROVE' ? 'bg-emerald-600 shadow-emerald-600/20 animate-none' : 'bg-red-600 shadow-red-600/20'
                  }`}
                >
                  Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            onClick={() => {
              submitInspectionReport(user?.fullName);
              setReportGenerated(true);
            }}
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
              <span className="text-[10px] font-mono font-bold text-emerald-800">Status: Delivered & Synced Live</span>
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
