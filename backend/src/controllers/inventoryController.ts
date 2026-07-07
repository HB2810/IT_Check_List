import { Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { AuthenticatedRequest } from '../middleware/auth';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  totalStock: number;
  availableStock: number;
  reorderLevel: number;
  unit: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryRequest {
  id: string;
  itemId: string;
  itemName: string;
  itemCategory: string;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  purpose: string;
  requestedById: string;
  requestedByName: string;
  approvedById?: string;
  approvedByName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Database for demonstration and robust offline execution
let inventoryStore: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'HP LaserJet Q2612A Black Toner Cartridge',
    category: 'Consumables',
    totalStock: 12,
    availableStock: 8,
    reorderLevel: 3,
    unit: 'Cartridges',
    location: 'Cabinet A-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-2',
    name: 'Thermal Receipt Paper Rolls (80mm x 80m)',
    category: 'Consumables',
    totalStock: 50,
    availableStock: 4, // Trigger Low Stock Alert! (reorderLevel = 15)
    reorderLevel: 15,
    unit: 'Rolls',
    location: 'Cabinet A-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-3',
    name: 'Dell KB216 Wired USB Keyboard',
    category: 'Peripherals',
    totalStock: 10,
    availableStock: 9,
    reorderLevel: 4,
    unit: 'Units',
    location: 'Cabinet B-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-4',
    name: 'Dell MS116 Wired USB Optical Mouse',
    category: 'Peripherals',
    totalStock: 15,
    availableStock: 14,
    reorderLevel: 4,
    unit: 'Units',
    location: 'Cabinet B-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-5',
    name: 'Cat6 UTP RJ45 Ethernet Patch Cable (3m)',
    category: 'Networking',
    totalStock: 30,
    availableStock: 25,
    reorderLevel: 8,
    unit: 'Cables',
    location: 'Rack Room Storage',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-6',
    name: 'APC RBC17 Smart-UPS Replacement Battery',
    category: 'Power Backup',
    totalStock: 4,
    availableStock: 1, // Trigger Low Stock Alert! (reorderLevel = 2)
    reorderLevel: 2,
    unit: 'Units',
    location: 'Power Storage Shelf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-7',
    name: 'Dell PowerEdge R750 Spare RAM DDR4 32GB',
    category: 'Hardware Spares',
    totalStock: 8,
    availableStock: 2, // Trigger Low Stock Alert! (reorderLevel = 3)
    reorderLevel: 3,
    unit: 'Modules',
    location: 'Cabinet C-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-8',
    name: 'Windows Server 2022 Client Access License (CAL)',
    category: 'Software & Licenses',
    totalStock: 25,
    availableStock: 22,
    reorderLevel: 5,
    unit: 'Licenses',
    location: 'Digital Active Directory Locker',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv-9',
    name: 'Microsoft Office 365 E3 Enterprise Subscription',
    category: 'Software & Licenses',
    totalStock: 100,
    availableStock: 12, // Trigger Low Stock Alert! (reorderLevel = 20)
    reorderLevel: 20,
    unit: 'Subscriptions',
    location: 'Microsoft 365 Admin Portal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let requestStore: InventoryRequest[] = [
  {
    id: 'req-1',
    itemId: 'inv-3',
    itemName: 'Dell KB216 Wired USB Keyboard',
    itemCategory: 'Peripherals',
    quantity: 1,
    status: 'APPROVED',
    purpose: 'Keyboard replacement for Billing Counter 2',
    requestedById: 'usr-mohit-001',
    requestedByName: 'Mohit (IT Executive)',
    approvedById: 'usr-vatsal-001',
    approvedByName: 'Vatsal (IT Head)',
    notes: 'Approved and issued standard replacement',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

// 1. Get Inventory List
export const getInventory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: inventoryStore });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Inventory Item (IT HEAD only)
export const createInventoryItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, category, totalStock, reorderLevel, unit, location } = req.body;

    if (!name || !category || totalStock === undefined) {
      res.status(400).json({ success: false, message: 'Item name, category, and total stock are required.' });
      return;
    }

    const exists = inventoryStore.some(item => item.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      res.status(400).json({ success: false, message: 'Inventory item with this name already exists.' });
      return;
    }

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name,
      category,
      totalStock: Number(totalStock),
      availableStock: Number(totalStock), // Initially available == total
      reorderLevel: Number(reorderLevel || 5),
      unit: unit || 'Units',
      location: location || 'General Shelf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inventoryStore.push(newItem);

    // Broadcast update via Socket.io
    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('inventory_updated', inventoryStore);
    }

    res.status(201).json({ success: true, data: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Restock Item (IT HEAD only)
export const restockItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) <= 0) {
      res.status(400).json({ success: false, message: 'Valid restock quantity is required.' });
      return;
    }

    const itemIndex = inventoryStore.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      res.status(404).json({ success: false, message: 'Inventory item not found.' });
      return;
    }

    const item = inventoryStore[itemIndex];
    item.totalStock += Number(quantity);
    item.availableStock += Number(quantity);
    item.updatedAt = new Date().toISOString();

    // Broadcast update via Socket.io
    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('inventory_updated', inventoryStore);
    }

    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Requests
export const getRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: requestStore });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Create Request
export const createRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { itemId, quantity, purpose, notes } = req.body;

    if (!itemId || !quantity || !purpose) {
      res.status(400).json({ success: false, message: 'Item, quantity, and purpose are required.' });
      return;
    }

    const item = inventoryStore.find(item => item.id === itemId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Inventory item not found.' });
      return;
    }

    if (item.availableStock < Number(quantity)) {
      res.status(400).json({ 
        success: false, 
        message: `Insufficient stock. Requested: ${quantity}, Available: ${item.availableStock}` 
      });
      return;
    }

    const newRequest: InventoryRequest = {
      id: `req-${Date.now()}`,
      itemId,
      itemName: item.name,
      itemCategory: item.category,
      quantity: Number(quantity),
      status: 'PENDING',
      purpose,
      requestedById: req.user?.id || 'usr-guest-01',
      requestedByName: req.user?.fullName || 'IT Executive',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    requestStore.unshift(newRequest);

    // Broadcast update via Socket.io
    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('inventory_request_created', { request: newRequest, allRequests: requestStore });
    }

    res.status(201).json({ success: true, data: newRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Approve Request (IT HEAD only)
export const approveRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const requestIndex = requestStore.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      res.status(404).json({ success: false, message: 'Stock request not found.' });
      return;
    }

    const request = requestStore[requestIndex];
    if (request.status !== 'PENDING') {
      res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
      return;
    }

    const item = inventoryStore.find(item => item.id === request.itemId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Associated inventory item not found.' });
      return;
    }

    if (item.availableStock < request.quantity) {
      res.status(400).json({ 
        success: false, 
        message: `Cannot approve. Stock is low. Available: ${item.availableStock}, Requested: ${request.quantity}` 
      });
      return;
    }

    // Process approval
    item.availableStock -= request.quantity;
    item.updatedAt = new Date().toISOString();

    request.status = 'APPROVED';
    request.approvedById = req.user?.id || 'usr-vatsal-001';
    request.approvedByName = req.user?.fullName || 'Vatsal (IT Head)';
    request.notes = notes || request.notes || 'Approved and stock issued.';
    request.updatedAt = new Date().toISOString();

    // Broadcast update via Socket.io
    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('inventory_request_updated', { request, allRequests: requestStore });
      io.emit('inventory_updated', inventoryStore);
    }

    res.json({ success: true, data: { request, item } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Reject Request (IT HEAD only)
export const rejectRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const requestIndex = requestStore.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      res.status(404).json({ success: false, message: 'Stock request not found.' });
      return;
    }

    const request = requestStore[requestIndex];
    if (request.status !== 'PENDING') {
      res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
      return;
    }

    // Process rejection
    request.status = 'REJECTED';
    request.approvedById = req.user?.id || 'usr-vatsal-001';
    request.approvedByName = req.user?.fullName || 'Vatsal (IT Head)';
    request.notes = notes || request.notes || 'Rejected by IT Head.';
    request.updatedAt = new Date().toISOString();

    // Broadcast update via Socket.io
    const io: SocketIOServer = req.app.get('io');
    if (io) {
      io.emit('inventory_request_updated', { request, allRequests: requestStore });
    }

    res.json({ success: true, data: request });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
