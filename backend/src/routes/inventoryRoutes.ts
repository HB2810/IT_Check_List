import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  getInventory,
  createInventoryItem,
  restockItem,
  getRequests,
  createRequest,
  approveRequest,
  rejectRequest
} from '../controllers/inventoryController';

const router = Router();

// All inventory routes require a valid authenticated user
router.use(authenticateToken);

// Inventory items management
router.get('/', getInventory);
router.post('/', requireRole(['IT_HEAD']), createInventoryItem);
router.put('/:id/restock', requireRole(['IT_HEAD']), restockItem);

// Inventory requests management
router.get('/requests', getRequests);
router.post('/requests', createRequest);
router.put('/requests/:id/approve', requireRole(['IT_HEAD']), approveRequest);
router.put('/requests/:id/reject', requireRole(['IT_HEAD']), rejectRequest);

export default router;
