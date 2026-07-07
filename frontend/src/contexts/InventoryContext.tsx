import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { socket } from '../services/socket';

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

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  requests: InventoryRequest[];
  loading: boolean;
  addInventoryItem: (item: {
    name: string;
    category: string;
    totalStock: number;
    reorderLevel: number;
    unit: string;
    location: string;
  }) => Promise<void>;
  restockItem: (id: string, quantity: number) => Promise<void>;
  createRequest: (req: {
    itemId: string;
    quantity: number;
    purpose: string;
    notes?: string;
  }) => Promise<void>;
  approveRequest: (id: string, notes?: string) => Promise<void>;
  rejectRequest: (id: string, notes?: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const DEFAULT_INVENTORY: InventoryItem[] = [
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
  }
];

const DEFAULT_REQUESTS: InventoryRequest[] = [
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

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const cached = localStorage.getItem('stavya_inventory_cache');
    return cached ? JSON.parse(cached) : DEFAULT_INVENTORY;
  });

  const [requests, setRequests] = useState<InventoryRequest[]>(() => {
    const cached = localStorage.getItem('stavya_inventory_requests_cache');
    return cached ? JSON.parse(cached) : DEFAULT_REQUESTS;
  });

  const [loading, setLoading] = useState(false);

  // Sync cache with localStorage
  useEffect(() => {
    localStorage.setItem('stavya_inventory_cache', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem('stavya_inventory_requests_cache', JSON.stringify(requests));
  }, [requests]);

  // Fetch initial inventory list & requests from backend API
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [invRes, reqRes] = await Promise.allSettled([
        api.get('/inventory'),
        api.get('/inventory/requests')
      ]);

      if (invRes.status === 'fulfilled' && invRes.value.data?.data) {
        setInventoryItems(invRes.value.data.data);
      }
      if (reqRes.status === 'fulfilled' && reqRes.value.data?.data) {
        setRequests(reqRes.value.data.data);
      }
    } catch (err) {
      console.log('Backend sync offline, using local cached inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();

    // Socket.IO listeners for real-time synchronization
    const handleInventoryUpdated = (data: InventoryItem[]) => {
      setInventoryItems(data);
    };

    const handleRequestCreated = (data: { request: InventoryRequest; allRequests?: InventoryRequest[] }) => {
      if (data.allRequests) {
        setRequests(data.allRequests);
      } else if (data.request) {
        setRequests(prev => [data.request, ...prev.filter(r => r.id !== data.request.id)]);
      }
    };

    const handleRequestUpdated = (data: { request: InventoryRequest; allRequests?: InventoryRequest[] }) => {
      if (data.allRequests) {
        setRequests(data.allRequests);
      } else if (data.request) {
        setRequests(prev => prev.map(r => r.id === data.request.id ? data.request : r));
      }
    };

    socket.on('inventory_updated', handleInventoryUpdated);
    socket.on('inventory_request_created', handleRequestCreated);
    socket.on('inventory_request_updated', handleRequestUpdated);

    return () => {
      socket.off('inventory_updated', handleInventoryUpdated);
      socket.off('inventory_request_created', handleRequestCreated);
      socket.off('inventory_request_updated', handleRequestUpdated);
    };
  }, []);

  // 1. Add Inventory Item
  const addInventoryItem = async (item: {
    name: string;
    category: string;
    totalStock: number;
    reorderLevel: number;
    unit: string;
    location: string;
  }) => {
    const tempId = `inv-${Date.now()}`;
    const newItem: InventoryItem = {
      id: tempId,
      ...item,
      availableStock: item.totalStock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInventoryItems(prev => [...prev, newItem]);

    try {
      await api.post('/inventory', item);
    } catch (err) {
      console.log('Offline item addition, fallback saved locally');
    }
  };

  // 2. Restock Item
  const restockItem = async (id: string, quantity: number) => {
    setInventoryItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              totalStock: item.totalStock + quantity,
              availableStock: item.availableStock + quantity,
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );

    try {
      await api.put(`/inventory/${id}/restock`, { quantity });
    } catch (err) {
      console.log('Offline restock update, fallback saved locally');
    }
  };

  // 3. Create Request
  const createRequest = async (req: {
    itemId: string;
    quantity: number;
    purpose: string;
    notes?: string;
  }) => {
    const item = inventoryItems.find(i => i.id === req.itemId);
    if (!item) return;

    const savedUsername = localStorage.getItem('stavya_saved_username') || 'Mohit_IT';
    const requesterName = savedUsername === 'vatsal_IT_Head' ? 'Vatsal (IT Head)' : 'Mohit (IT Executive)';
    const requesterId = savedUsername === 'vatsal_IT_Head' ? 'usr-vatsal-001' : 'usr-mohit-001';

    const newReq: InventoryRequest = {
      id: `req-${Date.now()}`,
      itemId: req.itemId,
      itemName: item.name,
      itemCategory: item.category,
      quantity: req.quantity,
      status: 'PENDING',
      purpose: req.purpose,
      requestedById: requesterId,
      requestedByName: requesterName,
      notes: req.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRequests(prev => [newReq, ...prev]);

    try {
      await api.post('/inventory/requests', req);
    } catch (err) {
      console.log('Offline stock request, fallback saved locally');
    }
  };

  // 4. Approve Request
  const approveRequest = async (id: string, notes?: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    // Decrement local inventory stock
    setInventoryItems(prev =>
      prev.map(item =>
        item.id === req.itemId
          ? {
              ...item,
              availableStock: Math.max(0, item.availableStock - req.quantity),
              updatedAt: new Date().toISOString()
            }
          : item
      )
    );

    // Update local request status
    setRequests(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              approvedById: 'usr-vatsal-001',
              approvedByName: 'Vatsal (IT Head)',
              notes: notes || r.notes || 'Approved & issued stock.',
              updatedAt: new Date().toISOString()
            }
          : r
      )
    );

    try {
      await api.put(`/inventory/requests/${id}/approve`, { notes });
    } catch (err) {
      console.log('Offline request approval, fallback saved locally');
    }
  };

  // 5. Reject Request
  const rejectRequest = async (id: string, notes?: string) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              approvedById: 'usr-vatsal-001',
              approvedByName: 'Vatsal (IT Head)',
              notes: notes || r.notes || 'Rejected by IT Head.',
              updatedAt: new Date().toISOString()
            }
          : r
      )
    );

    try {
      await api.put(`/inventory/requests/${id}/reject`, { notes });
    } catch (err) {
      console.log('Offline request rejection, fallback saved locally');
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        requests,
        loading,
        addInventoryItem,
        restockItem,
        createRequest,
        approveRequest,
        rejectRequest
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
