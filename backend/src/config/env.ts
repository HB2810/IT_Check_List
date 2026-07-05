import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'stavya-default-jwt-secret-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'stavya-default-refresh-secret-key-2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
