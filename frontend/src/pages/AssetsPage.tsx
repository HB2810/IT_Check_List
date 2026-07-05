import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, Filter, QrCode, Server, HardDrive, Cpu, Shield, X } from 'lucide-react';

export interface AssetDevice {
  assetTag: string;
  name: string;
  category: string;
  department: string;
  location: string;
  ip: string;
  health: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  riskScore: number;
  assigned: string;
  vendor: string;
}

export const AssetsPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === 'IT_HEAD';

  const [assets, setAssets] = useState<AssetDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Asset Modal State (IT Head)
  const [showAddModal, setShowAddModal] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [catInput, setCatInput] = useState('Server & Rack Infrastructure');
  const [deptInput, setDeptInput] = useState('Server Room (SRV-01)');
  const [locationInput, setLocationInput] = useState('Rack 01');
  const [ipInput, setIpInput] = useState('192.168.1.10');
  const [assignedInput, setAssignedInput] = useState('Mohit (IT Executive)');
  const [vendorInput, setVendorInput] = useState('Dell Technologies');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const newAsset: AssetDevice = {
      assetTag: tagInput || `STV-AST-${Math.floor(100 + Math.random() * 900)}`,
      name: nameInput,
      category: catInput,
      department: deptInput,
      location: locationInput,
      ip: ipInput,
      health: 'HEALTHY',
      riskScore: 0,
      assigned: assignedInput,
      vendor: vendorInput
    };

    setAssets((prev) => [...prev, newAsset]);
    setShowAddModal(false);
    setTagInput('');
    setNameInput('');
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Hospital Devices & IT Assets Directory</h1>
          <p className="text-xs text-slate-500">
            Fresh production asset registry for Stavya Spine Hospital devices, servers, switches & printers.
          </p>
        </div>
        {isHead && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Hospital Device / Asset
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by asset tag, name, department, or IP address..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          {filteredAssets.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Server className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-extrabold text-slate-700">No Devices Registered Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isHead ? 'Click "Add New Hospital Device / Asset" above to register hardware, servers, switches, or printers.' : 'Your IT Head (vatsal_IT_Head) can register and assign new devices here.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Asset Tag / Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Department & Location</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Health</th>
                  <th className="py-3.5 px-4">Assigned Staff</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAssets.map((asset) => (
                  <tr key={asset.assetTag} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-100 text-cyan-800 border border-cyan-200">
                          {asset.assetTag}
                        </span>
                        {asset.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{asset.category}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      <div>{asset.department}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{asset.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">{asset.ip}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                        {asset.health}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{asset.assigned}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-cyan-700">
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* IT Head Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Register New Device / Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Asset Tag</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                  placeholder="e.g. STV-SRV-001"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Device Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold"
                  placeholder="e.g. Dell PowerEdge HIS Server R750"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={catInput}
                    onChange={(e) => setCatInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Employee</label>
                  <input
                    type="text"
                    value={assignedInput}
                    onChange={(e) => setAssignedInput(e.target.value)}
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
                  Register Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
