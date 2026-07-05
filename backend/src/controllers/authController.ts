import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username and password are required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      },
      include: { department: true }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), isOnline: true }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'USER_LOGIN',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          department: user.department ? user.department.name : null
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token is required' });
      return;
    }

    const existingToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      res.status(403).json({ success: false, message: 'Refresh token invalid or expired' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      userId: existingToken.user.id,
      email: existingToken.user.email,
      role: existingToken.user.role
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken }
    });
  } catch (error: any) {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        phone: true,
        isOnline: true,
        lastLoginAt: true,
        department: { select: { id: true, name: true, code: true } }
      }
    });

    res.json({ success: true, data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { isOnline: false }
      });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
