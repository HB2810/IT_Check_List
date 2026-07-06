import { Router } from 'express';
import { getIncidents, createIncident, updateIncidentStatus } from '../controllers/incidentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getIncidents);
router.post('/', createIncident);
router.put('/:id/status', updateIncidentStatus);

export default router;
