import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import incidentRoutes from './routes/incidentRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach Socket.IO to App Locals for route access
app.set('io', io);

// Security & Middleware Setup
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API V1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'Stavya Intelligence Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use(errorHandler);

// Real-time Socket Connection Listener
io.on('connection', (socket) => {
  logger.info(`Socket Client Connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Socket Client Disconnected: ${socket.id}`);
  });
});

// Start HTTP Server
server.listen(env.PORT, () => {
  logger.info(`Stavya Intelligence Backend running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
});

export { app, io };
