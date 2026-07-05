import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
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
        workloadScore: true,
        skillTags: true,
        department: { select: { id: true, name: true, code: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: { users } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, fullName, email, role, departmentCode } = req.body;

    if (!username || !password || !fullName || !email) {
      res.status(400).json({ success: false, message: 'Username, password, full name, and email are required' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'Username or email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let departmentId: string | undefined = undefined;
    if (departmentCode) {
      const dept = await prisma.department.findUnique({ where: { code: departmentCode } });
      if (dept) departmentId = dept.id;
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        fullName,
        role: role || 'IT_EXECUTIVE',
        departmentId,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({ success: true, data: { user: newUser } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
