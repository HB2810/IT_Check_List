import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { socket } from '../services/socket';
import { InfrastructureItem } from '../pages/TasksPage';

export interface IncidentTicket {
  id: string;
  ticketNumber: string;
  title: string;
  severity: string;
  status: string;
  department: string;
  assignee: string;
  reportedAt: string;
  taskId?: string;
}

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

interface TaskContextType {
  tasks: InfrastructureItem[];
  incidents: IncidentTicket[];
  reports: InspectionReport[];
  loading: boolean;
  adminNotificationSent: boolean;
  markTaskOk: (id: string) => Promise<void>;
  submitFault: (id: string, faultNote: string, userFullName?: string) => Promise<void>;
  addTask: (newItem: { name: string; category: string; department: string; dueTime: string; tetMinutes: number }) => Promise<void>;
  editTask: (item: InfrastructureItem) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createIncident: (ticket: { title: string; severity: string; department: string; assignee?: string }) => Promise<void>;
  submitInspectionReport: (submittedBy?: string, date?: string) => Promise<InspectionReport>;
  acknowledgeReport: (reportId: string, acknowledgedBy?: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_TASKS: InfrastructureItem[] = [
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

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<InfrastructureItem[]>(() => {
    const cached = localStorage.getItem('stavya_tasks_cache');
    return cached ? JSON.parse(cached) : DEFAULT_TASKS;
  });

  const [incidents, setIncidents] = useState<IncidentTicket[]>(() => {
    const cached = localStorage.getItem('stavya_incidents_cache');
    return cached ? JSON.parse(cached) : [];
  });

  const [reports, setReports] = useState<InspectionReport[]>(() => {
    const cached = localStorage.getItem('stavya_reports_cache');
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(false);
  const [adminNotificationSent, setAdminNotificationSent] = useState(false);

  // Sync cache with localStorage
  useEffect(() => {
    localStorage.setItem('stavya_tasks_cache', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('stavya_incidents_cache', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('stavya_reports_cache', JSON.stringify(reports));
  }, [reports]);

  // Fetch initial tasks, incidents & reports from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, incRes, repRes] = await Promise.allSettled([
        api.get('/tasks'),
        api.get('/incidents'),
        api.get('/reports')
      ]);

      if (tasksRes.status === 'fulfilled' && tasksRes.value.data?.data) {
        setTasks(tasksRes.value.data.data);
      }
      if (incRes.status === 'fulfilled' && incRes.value.data?.data) {
        setIncidents(incRes.value.data.data);
      }
      if (repRes.status === 'fulfilled' && repRes.value.data?.data) {
        setReports(repRes.value.data.data);
      }
    } catch (err) {
      console.log('Backend sync offline, using local cached data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Socket listeners for real-time live synchronization
    const handleTaskUpdated = (data: { task: InfrastructureItem; allTasks?: InfrastructureItem[] }) => {
      if (data.allTasks) {
        setTasks(data.allTasks);
      } else if (data.task) {
        setTasks((prev) => prev.map((t) => (t.id === data.task.id ? data.task : t)));
      }
    };

    const handleTaskCreated = (data: { task: InfrastructureItem; allTasks?: InfrastructureItem[] }) => {
      if (data.allTasks) {
        setTasks(data.allTasks);
      } else if (data.task) {
        setTasks((prev) => [...prev, data.task]);
      }
    };

    const handleTaskDeleted = (data: { id: string; allTasks?: InfrastructureItem[] }) => {
      if (data.allTasks) {
        setTasks(data.allTasks);
      } else if (data.id) {
        setTasks((prev) => prev.filter((t) => t.id !== data.id));
      }
    };

    const handleIncidentCreated = (data: { incident: IncidentTicket; allIncidents?: IncidentTicket[] }) => {
      if (data.allIncidents) {
        setIncidents(data.allIncidents);
      } else if (data.incident) {
        setIncidents((prev) => [data.incident, ...prev.filter((i) => i.id !== data.incident.id)]);
      }
    };

    const handleIncidentUpdated = (data: { incident: IncidentTicket; allIncidents?: IncidentTicket[] }) => {
      if (data.allIncidents) {
        setIncidents(data.allIncidents);
      } else if (data.incident) {
        setIncidents((prev) => prev.map((i) => (i.id === data.incident.id ? data.incident : i)));
      }
    };

    const handleReportSubmitted = (data: { report: InspectionReport; allReports?: InspectionReport[] }) => {
      if (data.allReports) {
        setReports(data.allReports);
      } else if (data.report) {
        setReports((prev) => [data.report, ...prev.filter((r) => r.id !== data.report.id)]);
      }
      setAdminNotificationSent(true);
      setTimeout(() => setAdminNotificationSent(false), 6000);
    };

    const handleReportAcknowledged = (data: { report: InspectionReport; allReports?: InspectionReport[] }) => {
      if (data.allReports) {
        setReports(data.allReports);
      } else if (data.report) {
        setReports((prev) => prev.map((r) => (r.id === data.report.id ? data.report : r)));
      }
    };

    socket.on('task_updated', handleTaskUpdated);
    socket.on('task_created', handleTaskCreated);
    socket.on('task_deleted', handleTaskDeleted);
    socket.on('incident_created', handleIncidentCreated);
    socket.on('incident_updated', handleIncidentUpdated);
    socket.on('report_submitted', handleReportSubmitted);
    socket.on('report_acknowledged', handleReportAcknowledged);

    return () => {
      socket.off('task_updated', handleTaskUpdated);
      socket.off('task_created', handleTaskCreated);
      socket.off('task_deleted', handleTaskDeleted);
      socket.off('incident_created', handleIncidentCreated);
      socket.off('incident_updated', handleIncidentUpdated);
      socket.off('report_submitted', handleReportSubmitted);
      socket.off('report_acknowledged', handleReportAcknowledged);
    };
  }, []);

  const markTaskOk = async (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'OK', faultNote: undefined } : t)));
    try {
      await api.put(`/tasks/${id}/status`, { status: 'OK' });
    } catch (err) {
      console.log('Offline status update fallback saved locally');
    }
  };

  const submitFault = async (id: string, faultNote: string, userFullName?: string) => {
    const task = tasks.find((t) => t.id === id);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'FAULT',
              faultNote,
              reportedAt: nowTime,
              reportedBy: userFullName || 'IT Executive'
            }
          : t
      )
    );

    const newInc: IncidentTicket = {
      id: `fault-${Date.now()}`,
      ticketNumber: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${task?.name || 'Asset'}: ${faultNote}`,
      severity: 'HIGH',
      status: 'OPEN',
      department: task?.department || 'OPD (Outpatient)',
      assignee: 'Mohit (IT Executive)',
      reportedAt: nowTime,
      taskId: id
    };

    setIncidents((prev) => [newInc, ...prev.filter((i) => i.taskId !== id)]);

    setAdminNotificationSent(true);
    setTimeout(() => setAdminNotificationSent(false), 5000);

    try {
      await api.put(`/tasks/${id}/status`, { status: 'FAULT', faultNote, reportedBy: userFullName });
      await api.post('/incidents', {
        title: `${task?.name || 'Asset'}: ${faultNote}`,
        severity: 'HIGH',
        department: task?.department || 'OPD (Outpatient)',
        taskId: id
      });
    } catch (err) {
      console.log('Offline fault update fallback saved locally');
    }
  };

  const addTask = async (newItem: { name: string; category: string; department: string; dueTime: string; tetMinutes: number }) => {
    const created: InfrastructureItem = {
      id: Date.now().toString(),
      ...newItem,
      status: 'UNCHECKED'
    };
    setTasks((prev) => [...prev, created]);

    try {
      await api.post('/tasks', newItem);
    } catch (err) {
      console.log('Offline add task fallback saved locally');
    }
  };

  const editTask = async (item: InfrastructureItem) => {
    setTasks((prev) => prev.map((t) => (t.id === item.id ? item : t)));

    try {
      await api.put(`/tasks/${item.id}`, item);
    } catch (err) {
      console.log('Offline edit task fallback saved locally');
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.log('Offline delete task fallback saved locally');
    }
  };

  const createIncident = async (ticket: { title: string; severity: string; department: string; assignee?: string }) => {
    const newInc: IncidentTicket = {
      id: Date.now().toString(),
      ticketNumber: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticket.title,
      severity: ticket.severity,
      status: 'OPEN',
      department: ticket.department,
      assignee: ticket.assignee || 'Mohit (IT Executive)',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIncidents((prev) => [newInc, ...prev]);

    try {
      await api.post('/incidents', ticket);
    } catch (err) {
      console.log('Offline create incident fallback saved locally');
    }
  };

  const submitInspectionReport = async (submittedBy?: string, date?: string): Promise<InspectionReport> => {
    const todayDate = date || new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const okCount = tasks.filter((t) => t.status === 'OK').length;
    const faultCount = tasks.filter((t) => t.status === 'FAULT').length;

    const newReport: InspectionReport = {
      id: `rep-${Date.now()}`,
      date: todayDate,
      submittedBy: submittedBy || 'Mohit (IT Executive)',
      submittedAt: nowTime,
      totalItems: tasks.length,
      okCount,
      faultCount,
      status: 'SUBMITTED',
      items: JSON.parse(JSON.stringify(tasks))
    };

    setReports((prev) => [newReport, ...prev.filter((r) => r.date !== todayDate)]);
    setAdminNotificationSent(true);
    setTimeout(() => setAdminNotificationSent(false), 5000);

    try {
      const res = await api.post('/reports/submit', { submittedBy: newReport.submittedBy, date: todayDate });
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.log('Offline report submit fallback saved locally');
    }

    return newReport;
  };

  const acknowledgeReport = async (reportId: string, acknowledgedBy?: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'ACKNOWLEDGED_BY_HEAD',
              acknowledgedBy: acknowledgedBy || 'Vatsal Patel (IT Head)',
              acknowledgedAt: nowTime
            }
          : r
      )
    );

    try {
      await api.put(`/reports/${reportId}/acknowledge`, { acknowledgedBy });
    } catch (err) {
      console.log('Offline report acknowledge fallback saved locally');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        incidents,
        reports,
        loading,
        adminNotificationSent,
        markTaskOk,
        submitFault,
        addTask,
        editTask,
        deleteTask,
        createIncident,
        submitInspectionReport,
        acknowledgeReport
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
