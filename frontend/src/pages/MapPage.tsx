import React, { useState } from 'react';
import { Wifi, Cpu, Printer } from 'lucide-react';

interface DeptDetail {
  name: string;
  code: string;
  floor: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  devices: number;
  wifiStatus: string;
  switches: string;
  printers: string;
  incidents: number;
  users: string[];
}

export const MapPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<DeptDetail | null>({
    name: 'Server Room',
    code: 'SRV-01',
    floor: 'Basement Core',
    status: 'HEALTHY',
    devices: 6,
    wifiStatus: 'Subnet 192.168.1.0/24 (Optimal)',
    switches: 'Core Switch Cisco Catalyst 9300 (48G)',
    printers: '0 Printers',
    incidents: 0,
    users: ['Vikram Sharma (IT Head)', 'Rahul Mehta (Network Spec)']
  });

  const departments: DeptDetail[] = [
    {
      name: 'Server Room',
      code: 'SRV-01',
      floor: 'Basement',
      status: 'HEALTHY',
      devices: 6,
      wifiStatus: '192.168.1.0/24 (100% Signal)',
      switches: 'Cisco Catalyst 9300 Stack',
      printers: 'None',
      incidents: 0,
      users: ['Vikram Sharma', 'Rahul Mehta']
    },
    {
      name: 'Operation Theatre (OT)',
      code: 'OT-01',
      floor: '3rd Floor',
      status: 'HEALTHY',
      devices: 8,
      wifiStatus: 'Dedicated Medical VLAN 50',
      switches: 'Edge Switch OT-SW1',
      printers: '1 Barcode Labeler',
      incidents: 0,
      users: ['Dr. Anish (Surgeon)', 'OT Staff']
    },
    {
      name: 'OPD (Outpatient)',
      code: 'OPD-01',
      floor: '1st Floor',
      status: 'WARNING',
      devices: 12,
      wifiStatus: 'OPD-AP-01 (88% Load)',
      switches: 'OPD-SW-02',
      printers: '3 Thermal LaserJet Printers',
      incidents: 1,
      users: ['Het Patel (Senior Exec)', 'OPD Receptionist']
    },
    {
      name: 'Radiology & Imaging',
      code: 'RAD-01',
      floor: 'Ground Floor',
      status: 'HEALTHY',
      devices: 5,
      wifiStatus: 'DICOM Fiber Backbone (10 Gbps)',
      switches: 'RAD-PACS-SW1',
      printers: '1 DICOM Film Printer',
      incidents: 0,
      users: ['Radiology Tech', 'Het Patel']
    },
    {
      name: 'ICU Monitoring',
      code: 'ICU-01',
      floor: '3rd Floor',
      status: 'HEALTHY',
      devices: 9,
      wifiStatus: 'Isolated Critical Care VLAN',
      switches: 'ICU-SW-01',
      printers: '1 Workstation Printer',
      incidents: 0,
      users: ['ICU Charge Nurse', 'Rahul Mehta']
    },
    {
      name: 'Billing & Accounts',
      code: 'BIL-01',
      floor: 'Ground Floor',
      status: 'HEALTHY',
      devices: 4,
      wifiStatus: 'Corporate Internal WiFi',
      switches: 'BIL-SW-01',
      printers: '2 Invoice Printers',
      incidents: 0,
      users: ['Billing Manager']
    },
    {
      name: 'Reception & Helpdesk',
      code: 'REC-01',
      floor: 'Ground Floor',
      status: 'HEALTHY',
      devices: 3,
      wifiStatus: 'Public & Admin Dual SSID',
      switches: 'REC-SW-01',
      printers: '1 Receipt Printer',
      incidents: 0,
      users: ['Receptionist']
    },
    {
      name: 'CSSD Sterilization',
      code: 'CSD-01',
      floor: 'Basement',
      status: 'HEALTHY',
      devices: 2,
      wifiStatus: 'Utility WiFi AP',
      switches: 'CSD-SW-01',
      printers: '1 Autoclave Tag Printer',
      incidents: 0,
      users: ['CSSD In-charge']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Live Hospital Interactive Map</h1>
          <p className="text-xs text-slate-500">
            Real-time layout telemetry of Stavya Spine Hospital departments, network switches, APs & active devices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Live Telemetry Synced
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Visual Floor Plan Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Stavya Spine Hospital Floor Layout (Click Department to Inspect)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {departments.map((dept) => {
              const isSelected = selectedDept?.code === dept.code;
              return (
                <button
                  key={dept.code}
                  onClick={() => setSelectedDept(dept)}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between h-36 relative overflow-hidden group ${
                    isSelected
                      ? 'border-cyan-600 bg-cyan-50/80 shadow-md shadow-cyan-600/10'
                      : dept.status === 'WARNING'
                      ? 'border-amber-300 bg-amber-50/60 hover:border-amber-400'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{dept.code}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        dept.status === 'HEALTHY'
                          ? 'bg-emerald-500 shadow-sm'
                          : 'bg-amber-500 shadow-sm'
                      }`}
                    />
                  </div>

                  <div className="space-y-1 my-auto">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-cyan-700 transition-colors">
                      {dept.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{dept.floor}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-1.5 font-semibold">
                    <span>{dept.devices} Devices</span>
                    {dept.incidents > 0 && (
                      <span className="text-amber-800 font-extrabold">{dept.incidents} Alert</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Department Telemetry Details Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {selectedDept ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-cyan-700 font-bold uppercase">{selectedDept.code}</span>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedDept.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedDept.floor}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedDept.status === 'HEALTHY'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {selectedDept.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-600 flex items-center gap-1.5 font-bold">
                    <Wifi className="w-3.5 h-3.5 text-cyan-700" /> WiFi & AP Telemetry
                  </span>
                  <p className="text-slate-900 font-mono font-semibold">{selectedDept.wifiStatus}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-600 flex items-center gap-1.5 font-bold">
                    <Cpu className="w-3.5 h-3.5 text-cyan-700" /> Managed Switches
                  </span>
                  <p className="text-slate-900 font-mono font-semibold">{selectedDept.switches}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-600 flex items-center gap-1.5 font-bold">
                    <Printer className="w-3.5 h-3.5 text-cyan-700" /> Printers & Peripherals
                  </span>
                  <p className="text-slate-900 font-mono font-semibold">{selectedDept.printers}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-600 font-bold">Assigned Staff / Engineers</span>
                  <p className="text-slate-900 font-semibold">{selectedDept.users.join(', ')}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-10 font-semibold">Select a department on the floor layout map to inspect telemetry.</p>
          )}
        </div>
      </div>
    </div>
  );
};
