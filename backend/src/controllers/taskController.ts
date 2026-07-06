import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';

export interface InfrastructureItem {
  id: string;
  name: string;
  category: string;
  department: string;
  dueTime: string;
  tetMinutes: number;
  status: 'UNCHECKED' | 'OK' | 'FAULT';
  faultNote?: string;
  reportedAt?: string;
  reportedBy?: string;
}

// In-Memory Task Store initialized with complete End-to-End Hospital IT Infrastructure Items
let taskStore: InfrastructureItem[] = [
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
];

export const getTaskStore = () => taskStore;

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: taskStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, faultNote, reportedBy } = req.body;

    const taskIndex = taskStore.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const updatedTask: InfrastructureItem = {
      ...taskStore[taskIndex],
      status: status || taskStore[taskIndex].status,
      faultNote: status === 'FAULT' ? faultNote || taskStore[taskIndex].faultNote : undefined,
      reportedAt: status === 'FAULT' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : taskStore[taskIndex].reportedAt,
      reportedBy: reportedBy || taskStore[taskIndex].reportedBy || 'IT Executive'
    };

    taskStore[taskIndex] = updatedTask;

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('task_updated', { task: updatedTask, allTasks: taskStore });
    }

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task status' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, department, dueTime, tetMinutes } = req.body;

    const newTask: InfrastructureItem = {
      id: Date.now().toString(),
      name: name || 'New IT Asset Check',
      category: category || 'General IT',
      department: department || 'Server Room (SRV-01)',
      dueTime: dueTime || '09:00 AM',
      tetMinutes: Number(tetMinutes) || 15,
      status: 'UNCHECKED'
    };

    taskStore.push(newTask);

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('task_created', { task: newTask, allTasks: taskStore });
    }

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, department, dueTime, tetMinutes } = req.body;

    const taskIndex = taskStore.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    taskStore[taskIndex] = {
      ...taskStore[taskIndex],
      ...(name && { name }),
      ...(category && { category }),
      ...(department && { department }),
      ...(dueTime && { dueTime }),
      ...(tetMinutes !== undefined && { tetMinutes: Number(tetMinutes) })
    };

    const updatedTask = taskStore[taskIndex];

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('task_updated', { task: updatedTask, allTasks: taskStore });
    }

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    taskStore = taskStore.filter((t) => t.id !== id);

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('task_deleted', { id, allTasks: taskStore });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};
