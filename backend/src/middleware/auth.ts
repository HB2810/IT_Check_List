import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { prisma } from '../config/db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Access token required' });
    return;
  }

  // Bypass JWT and DB lookup for offline/mock frontend tokens
  if (token === 'vatsal-active-token') {
    req.user = {
      id: 'usr-vatsal-001',
      email: 'vatsal@stavyaspine.com',
      role: 'IT_HEAD',
      fullName: 'Vatsal (IT Head)'
    };
    return next();
  }
  if (token === 'mohit-active-token') {
    req.user = {
      id: 'usr-mohit-001',
      email: 'mohit@stavyaspine.com',
      role: 'IT_EXECUTIVE',
      fullName: 'Mohit (IT Executive)'
    };
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, fullName: true }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid or revoked token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token is invalid or expired' });
    return;
  }
};
