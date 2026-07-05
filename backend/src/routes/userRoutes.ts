import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', authenticateToken, getUsers);
router.post('/', authenticateToken, requireRole(['IT_HEAD']), createUser);

export default router;
