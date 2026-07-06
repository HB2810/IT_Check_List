import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';

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

let incidentStore: IncidentTicket[] = [];

export const getIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: incidentStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch incidents' });
  }
};

export const createIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, severity, department, assignee, taskId } = req.body;

    const newTicket: IncidentTicket = {
      id: Date.now().toString(),
      ticketNumber: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || 'Unspecified IT Incident',
      severity: severity || 'MEDIUM',
      status: 'OPEN',
      department: department || 'OPD (Outpatient)',
      assignee: assignee || 'Mohit (IT Executive)',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      taskId
    };

    incidentStore.unshift(newTicket);

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('incident_created', { incident: newTicket, allIncidents: incidentStore });
    }

    res.status(201).json({ success: true, data: newTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create incident' });
  }
};

export const updateIncidentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticketIndex = incidentStore.findIndex((t) => t.id === id);
    if (ticketIndex === -1) {
      res.status(404).json({ success: false, message: 'Incident not found' });
      return;
    }

    incidentStore[ticketIndex].status = status || incidentStore[ticketIndex].status;
    const updatedTicket = incidentStore[ticketIndex];

    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('incident_updated', { incident: updatedTicket, allIncidents: incidentStore });
    }

    res.json({ success: true, data: updatedTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update incident status' });
  }
};
