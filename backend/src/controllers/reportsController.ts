import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { InfrastructureItem, getTaskStore } from './taskController';

export interface InspectionReport {
  id: string;
  date: string;
  submittedBy: string;
  submittedAt: string;
  totalItems: number;
  okCount: number;
  faultCount: number;
  status: 'SUBMITTED' | 'ACKNOWLEDGED_BY_HEAD';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  items: InfrastructureItem[];
}

let reportStore: InspectionReport[] = [
  {
    id: 'rep-2026-07-05',
    date: '2026-07-05',
    submittedBy: 'Mohit (IT Executive)',
    submittedAt: '05:45 PM',
    totalItems: 16,
    okCount: 15,
    faultCount: 1,
    status: 'ACKNOWLEDGED_BY_HEAD',
    acknowledgedBy: 'Vatsal Patel (IT Head)',
    acknowledgedAt: '06:10 PM',
    items: [
      { id: '1', name: 'Primary HIS Server (Dell PowerEdge R750)', category: 'Server & Datacenter', department: 'Server Room (SRV-01)', dueTime: '08:30 AM', tetMinutes: 15, status: 'OK' },
      { id: '2', name: 'FortiGate 200F Core Firewall & IPS Gateway', category: 'Security & Network', department: 'Server Room (SRV-01)', dueTime: '08:45 AM', tetMinutes: 10, status: 'OK' },
      { id: '3', name: 'Cisco Catalyst 9300 Core Switches & Fiber Link', category: 'Core Network', department: 'Server Room (SRV-01)', dueTime: '09:00 AM', tetMinutes: 10, status: 'OK' },
      { id: '4', name: 'Server Room Precision AC (Temp Target 18°C)', category: 'Datacenter Facility', department: 'Server Room (SRV-01)', dueTime: '09:15 AM', tetMinutes: 5, status: 'OK' },
      { id: '5', name: 'OPD Billing Thermal Printers (HP LaserJet)', category: 'Printers & Scanners', department: 'OPD (Outpatient)', dueTime: '09:30 AM', tetMinutes: 15, status: 'FAULT', faultNote: 'Paper roller squeak requiring lubricated maintenance', reportedAt: '09:35 AM' },
      { id: '6', name: 'OPD Prescription Barcode Scanners & Displays', category: 'Workstations', department: 'OPD (Outpatient)', dueTime: '09:45 AM', tetMinutes: 10, status: 'OK' },
      { id: '7', name: 'OT Central APC 30kVA Online UPS & Battery Bank', category: 'UPS & Power Backup', department: 'Operation Theatre (OT-01)', dueTime: '10:00 AM', tetMinutes: 20, status: 'OK' },
      { id: '8', name: 'OT Surgical Display DICOM Medical Monitors', category: 'Medical Displays', department: 'Operation Theatre (OT-01)', dueTime: '10:15 AM', tetMinutes: 10, status: 'OK' },
      { id: '9', name: 'PACS DICOM Radiology Gateway & Workstations', category: 'Medical PACS', department: 'Radiology & Imaging', dueTime: '10:30 AM', tetMinutes: 15, status: 'OK' },
      { id: '10', name: 'Radiology DICOM Film Printer', category: 'Printers & Scanners', department: 'Radiology & Imaging', dueTime: '10:45 AM', tetMinutes: 10, status: 'OK' },
      { id: '11', name: 'ICU Central Patient Monitor Network Gateway', category: 'Critical Care Network', department: 'ICU Monitoring', dueTime: '11:00 AM', tetMinutes: 15, status: 'OK' },
      { id: '12', name: 'IPD Nursing Station PCs & Discharge Printers', category: 'Workstations', department: 'IPD (Inpatient)', dueTime: '11:15 AM', tetMinutes: 10, status: 'OK' },
      { id: '13', name: 'Billing Counter Receipt Printers & POS Terminals', category: 'Financial Systems', department: 'Billing & Accounts', dueTime: '11:30 AM', tetMinutes: 10, status: 'OK' },
      { id: '14', name: 'Biometric Attendance Readers & Door Security', category: 'Access Control', department: 'Main Lobby & Admin', dueTime: '11:45 AM', tetMinutes: 10, status: 'OK' },
      { id: '15', name: 'IP CCTV Security Cameras (All Hospital Floors)', category: 'Facility Security', department: 'Security & Surveillance', dueTime: '12:00 PM', tetMinutes: 15, status: 'OK' },
      { id: '16', name: 'CSSD Autoclave Barcode Tag Printer', category: 'Utility Printers', department: 'CSSD Sterilization', dueTime: '12:15 PM', tetMinutes: 10, status: 'OK' },
    ]
  }
];

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: reportStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

export const submitReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { submittedBy, date } = req.body;
    const currentTasks = getTaskStore();

    const todayDate = date || new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const okCount = currentTasks.filter((t) => t.status === 'OK').length;
    const faultCount = currentTasks.filter((t) => t.status === 'FAULT').length;

    const newReport: InspectionReport = {
      id: `rep-${Date.now()}`,
      date: todayDate,
      submittedBy: submittedBy || 'IT Executive',
      submittedAt: nowTime,
      totalItems: currentTasks.length,
      okCount,
      faultCount,
      status: 'SUBMITTED',
      items: JSON.parse(JSON.stringify(currentTasks))
    };

    // Replace if report for today already exists or unshift
    const existingIndex = reportStore.findIndex((r) => r.date === todayDate);
    if (existingIndex !== -1) {
      reportStore[existingIndex] = newReport;
    } else {
      reportStore.unshift(newReport);
    }

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('report_submitted', { report: newReport, allReports: reportStore });
    }

    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
};

export const acknowledgeReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { acknowledgedBy } = req.body;

    const reportIndex = reportStore.findIndex((r) => r.id === id);
    if (reportIndex === -1) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    reportStore[reportIndex].status = 'ACKNOWLEDGED_BY_HEAD';
    reportStore[reportIndex].acknowledgedBy = acknowledgedBy || 'Vatsal Patel (IT Head)';
    reportStore[reportIndex].acknowledgedAt = nowTime;

    const updatedReport = reportStore[reportIndex];

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('report_acknowledged', { report: updatedReport, allReports: reportStore });
    }

    res.json({ success: true, data: updatedReport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to acknowledge report' });
  }
};
