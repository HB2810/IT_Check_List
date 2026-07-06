import { io } from 'socket.io-client';

// Detect socket URL or use current host / proxy path
const SOCKET_URL = window.location.origin.includes('5173')
  ? 'http://localhost:5000'
  : window.location.origin;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});
