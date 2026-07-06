import { Router } from 'express';
import { getReports, submitReport, acknowledgeReport } from '../controllers/reportsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getReports);
router.post('/submit', submitReport);
router.put('/:id/acknowledge', acknowledgeReport);

export default router;
