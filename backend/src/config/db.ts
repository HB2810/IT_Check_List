import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: ['error', 'warn']
});

prisma.$connect()
  .then(() => logger.info('Database connection established successfully.'))
  .catch((err) => logger.error('Database connection error:', err));
