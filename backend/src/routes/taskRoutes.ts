import { Router } from 'express';
import { getTasks, updateTaskStatus, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id/status', updateTaskStatus);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
