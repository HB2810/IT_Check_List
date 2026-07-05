import { Router } from 'express';
import { login, refreshTokenHandler, getMe, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshTokenHandler);
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);

export default router;
