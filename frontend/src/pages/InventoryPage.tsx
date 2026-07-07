import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInventory, InventoryItem } from '../contexts/InventoryContext';
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  RefreshCw, 
  Layers, 
  AlertTriangle, 
  Inbox, 
  X, 
  Check, 
  Database,
  Globe,
  Settings,
  BookOpen
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === 'IT_HEAD';
  const location = useLocation();
  
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

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  // Selected entities
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [actionRequestId, setActionRequestId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  // Form input states
  const [restockQty, setRestockQty] = useState(10);
  const [actionNotes, setActionNotes] = useState('');

  // Request form state
  const [reqItemId, setReqItemId] = useState('');
  const [reqQty, setReqQty] = useState(1);
  const [reqPurpose, setReqPurpose] = useState('');
  const [reqNotes, setReqNotes] = useState('');

  // Add Item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Consumables');
  const [newItemTotalStock, setNewItemTotalStock] = useState(10);
  const [newItemReorderLevel, setNewItemReorderLevel] = useState(3);
  const [newItemUnit, setNewItemUnit] = useState('Units');
  const [newItemLocation, setNewItemLocation] = useState('Cabinet A-1');

  // Request from external link/fault helper (called when opening page with state)
  React.useEffect(() => {
    if (location.state && location.state.requestItemId) {
      setReqItemId(location.state.requestItemId);
      setReqQty(1);
      setReqPurpose(location.state.purpose || '');
      setReqNotes('');
      setShowRequestModal(true);
      
      // Clear the history state so refreshing doesn't keep opening the modal
      window.history.replaceState({}, document.title);
    } else if (inventoryItems.length > 0) {
      setReqItemId(inventoryItems[0].id);
    }
  }, [location, inventoryItems]);

  const handleOpenRequest = (itemId: string, suggestedPurpose = '') => {
    setReqItemId(itemId);
    setReqQty(1);
    setReqPurpose(suggestedPurpose);
    setReqNotes('');
    setShowRequestModal(true);
  };

  const onSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqItemId || reqQty <= 0 || !reqPurpose.trim()) return;
    createRequest({
      itemId: reqItemId,
      quantity: reqQty,
      purpose: reqPurpose,
      notes: reqNotes
    });
    setShowRequestModal(false);
  };

  const handleOpenAction = (reqId: string, type: 'APPROVE' | 'REJECT') => {
    setActionRequestId(reqId);
    setActionType(type);
    setActionNotes('');
    setShowActionModal(true);
  };

  const onSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionRequestId || !actionType) return;
    if (actionType === 'APPROVE') {
      approveRequest(actionRequestId, actionNotes);
    } else {
      rejectRequest(actionRequestId, actionNotes);
    }
    setShowActionModal(false);
  };

  const onSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addInventoryItem({
      name: newItemName,
      category: newItemCategory,
      totalStock: Number(newItemTotalStock),
      reorderLevel: Number(newItemReorderLevel),
      unit: newItemUnit,
      location: newItemLocation
    });
    setShowAddModal(false);
    setNewItemName('');
  };

  const onSubmitRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || restockQty <= 0) return;
    restockItem(selectedItem.id, restockQty);
    setShowRestockModal(false);
  };

  // Filtered items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            Smart Inventory System (IT Hardware & Software)
          </h1>
          <p className="text-xs text-slate-500">
            Real-time stock level monitoring, hardware spares tracking, software license metrics, and approval workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isHead && (
            <button
              onClick={() => {
                setNewItemName('');
                setNewItemCategory('Consumables');
                setNewItemTotalStock(10);
                setNewItemReorderLevel(3);
                setNewItemUnit('Units');
                setNewItemLocation('Cabinet A-1');
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Inventory Stock
            </button>
          )}
          <button
            onClick={() => handleOpenRequest(inventoryItems[0]?.id || '')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold text-xs transition-all"
          >
            <ShoppingCart className="w-4 h-4" /> Request Item Issue
          </button>
        </div>
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-600" /> Total Stock Items
          </span>
          <p className="text-2xl font-extrabold text-slate-900">{inventoryItems.length} Products</p>
          <p className="text-[10px] text-slate-500 font-semibold">Consumables, Spares, and Software</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Low Stock Alerts
          </span>
          <p className={`text-2xl font-extrabold ${inventoryItems.filter(i => i.availableStock <= i.reorderLevel).length > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>
            {inventoryItems.filter(i => i.availableStock <= i.reorderLevel).length} Alerts
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">Items below critical reorder limits</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Inbox className="w-3.5 h-3.5 text-cyan-600" /> Pending Approvals
          </span>
          <p className={`text-2xl font-extrabold ${inventoryRequests.filter(r => r.status === 'PENDING').length > 0 ? 'text-cyan-700 font-extrabold' : 'text-slate-900'}`}>
            {inventoryRequests.filter(r => r.status === 'PENDING').length} Requests
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">Requires IT Head approval</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-600" /> Sync Status
          </span>
          <p className="text-2xl font-extrabold text-emerald-600">Connected</p>
          <p className="text-[10px] text-slate-500 font-semibold">Real-time WebSockets Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inventory List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                IT Hardware & Software Directory
              </h3>
              
              {/* Search and Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search stock..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 placeholder-slate-400 w-44"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Networking">Networking</option>
                  <option value="Power Backup">Power Backup</option>
                  <option value="Hardware Spares">Hardware Spares</option>
                  <option value="Software & Licenses">Software & Licenses</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Item Name / Category</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4">Storage / Portal</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No inventory items found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
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
                          <td className="py-3.5 px-4 space-y-1.5 min-w-[170px]">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
                                {item.availableStock} / {item.totalStock} {item.unit}
                              </span>
                              <span className="text-slate-400 font-semibold">{percentage}% Available</span>
                            </div>
                            {/* Stock Progress Bar */}
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${isLowStock ? 'bg-red-500' : 'bg-cyan-500'}`}
                                style={{ width: `${Math.min(100, percentage)}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium font-mono text-[10px]">
                            {item.location || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {isHead && (
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setRestockQty(10);
                                  setShowRestockModal(true);
                                }}
                                className="p-1 px-2.5 rounded bg-slate-100 border border-slate-200 text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 hover:border-cyan-200 transition-colors font-bold text-[10px] inline-flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" /> Restock
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenRequest(item.id)}
                              disabled={item.availableStock <= 0}
                              className="p-1 px-2.5 rounded bg-cyan-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 border border-transparent text-white font-bold text-[10px] hover:bg-cyan-700 transition-colors inline-flex items-center gap-1"
                            >
                              <ShoppingCart className="w-3 h-3" /> Request
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Approvals Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Requests & Approvals Log
              </h3>
            </div>

            <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
              {inventoryRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No stock request records found.
                </div>
              ) : (
                inventoryRequests.map(req => {
                  const isPending = req.status === 'PENDING';
                  return (
                    <div key={req.id} className="p-4 space-y-2 text-xs">
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

                      <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                        <span className="font-bold text-slate-500">Purpose:</span> {req.purpose}
                      </p>

                      <div className="text-[10px] space-y-0.5 text-slate-500 font-semibold">
                        <p>Requested by: <span className="text-slate-800">{req.requestedByName}</span></p>
                        {req.approvedByName && (
                          <p>{req.status === 'APPROVED' ? 'Approved' : 'Rejected'} by: <span className="text-slate-800">{req.approvedByName}</span></p>
                        )}
                        {req.notes && (
                          <p className="italic text-[10px] text-cyan-855 bg-cyan-50/70 px-1.5 py-0.5 rounded mt-1 font-medium border border-cyan-100/50">
                            Notes: "{req.notes}"
                          </p>
                        )}
                        <p className="text-[9px] text-slate-400 font-mono pt-1">
                          {new Date(req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>

                      {isPending && isHead && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleOpenAction(req.id, 'APPROVE')}
                            className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-all text-center animate-none"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenAction(req.id, 'REJECT')}
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

      {/* ==================== MODALS ==================== */}

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

            <form onSubmit={onSubmitRequest} className="space-y-4 text-xs">
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
                      {item.name} ({item.category} • Available: {item.availableStock} {item.unit})
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
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
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
                  placeholder="e.g. Memory upgrade for HIS Secondary Server"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Critical for PACS DICOM rendering speed"
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
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <Plus className="w-4 h-4 text-cyan-600" /> Register New Inventory Stock
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmitAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Stock Item / License Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                  placeholder="e.g. Windows Server 2022 CAL License"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                  >
                    <option value="Consumables">Consumables</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Networking">Networking</option>
                    <option value="Power Backup">Power Backup</option>
                    <option value="Hardware Spares">Hardware Spares</option>
                    <option value="Software & Licenses">Software & Licenses</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                    placeholder="e.g. Modules, Licenses, Cartridges"
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
                    value={newItemTotalStock}
                    onChange={(e) => setNewItemTotalStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Level Alert</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newItemReorderLevel}
                    onChange={(e) => setNewItemReorderLevel(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Storage Location / License Portal</label>
                <input
                  type="text"
                  required
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  placeholder="e.g. Cabinet C-1 or Microsoft Admin Portal"
                />
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
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Restock Modal (IT HEAD) */}
      {showRestockModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <RefreshCw className="w-4 h-4 text-cyan-600" /> Restock: {selectedItem.name}
              </h3>
              <button onClick={() => setShowRestockModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmitRestock} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                <p className="text-slate-500 font-semibold mb-1">Current Stock Details:</p>
                <p className="font-mono text-slate-800 font-bold">Available: {selectedItem.availableStock} {selectedItem.unit}</p>
                <p className="font-mono text-slate-800 font-bold">Total: {selectedItem.totalStock} {selectedItem.unit}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity to Restock / Issue In</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
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
                Confirm: {actionType === 'APPROVE' ? 'Approve Request' : 'Reject Request'}
              </h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmitAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Approver/Rejection Notes</label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={actionType === 'APPROVE' ? "e.g. Issued 32GB module from cabinet C-1" : "e.g. Rejected: Sufficient subscriptions exist."}
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
                    actionType === 'APPROVE' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-red-600 shadow-red-600/20'
                  }`}
                >
                  Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
