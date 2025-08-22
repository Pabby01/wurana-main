import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/user.model.js';
import { logError, logSecurityEvent } from '../config/logger.js';
import config from '../config/config.js';

/**
 * Authenticate socket connection using JWT token
 */
export const authenticateSocket = async (socket, next) => {
  try {
    // Get token from handshake auth
    const token = socket.handshake.auth.token;

    if (!token) {
      logSecurityEvent({
        type: 'socket_auth_failed',
        ip: socket.handshake.address,
        reason: 'No token provided'
      });
      return next(new Error('Authentication error'));
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, config.jwtSecret);

    // Check if user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      logSecurityEvent({
        type: 'socket_auth_failed',
        ip: socket.handshake.address,
        reason: 'User not found'
      });
      return next(new Error('Authentication error'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    logError(error);
    logSecurityEvent({
      type: 'socket_auth_failed',
      ip: socket.handshake.address,
      reason: error.message
    });
    next(new Error('Authentication error'));
  }
};

/**
 * Rate limiting for socket events
 */
export const socketRateLimit = (eventName, limit, windowMs) => {
  const requests = new Map();

  return (socket, next) => {
    const userId = socket.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;
    const userKey = `${userId}:${eventName}`;

    // Clean old requests
    requests.forEach((timestamp, key) => {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    });

    // Get requests in window
    const requestsInWindow = Array.from(requests.values())
      .filter(timestamp => timestamp > windowStart)
      .length;

    if (requestsInWindow >= limit) {
      logSecurityEvent({
        type: 'socket_rate_limit_exceeded',
        userId: userId,
        event: eventName,
        ip: socket.handshake.address
      });
      return next(new Error('Too many requests'));
    }

    requests.set(userKey, now);
    next();
  };
};

/**
 * Middleware to handle room joining
 */
export const handleRoomJoin = (socket, room) => {
  // Leave all current rooms except the default one
  socket.rooms.forEach(r => {
    if (r !== socket.id) {
      socket.leave(r);
    }
  });

  // Join new room
  socket.join(room);
};

/**
 * Middleware to track user presence
 */
export const trackPresence = (io) => {
  const onlineUsers = new Map();

  return (socket) => {
    const userId = socket.user._id.toString();

    // Add user to online users
    onlineUsers.set(userId, {
      socketId: socket.id,
      lastSeen: new Date(),
      status: 'online'
    });

    // Broadcast user online status
    socket.broadcast.emit('user:online', { userId });

    // Handle disconnect
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user:offline', { userId });
    });

    // Handle status change
    socket.on('status:change', (status) => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).status = status;
        socket.broadcast.emit('user:status', { userId, status });
      }
    });

    // Expose online users to socket instance
    socket.onlineUsers = onlineUsers;
  };
};

/**
 * Middleware to handle errors in socket events
 */
export const socketErrorHandler = (socket) => {
  socket.on('error', (error) => {
    logError(error);
    socket.emit('error', { message: 'Internal server error' });
  });
};