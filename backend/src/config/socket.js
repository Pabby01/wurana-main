import { Server } from 'socket.io';
import config from './config.js';
import { authenticateSocket, socketRateLimit, trackPresence, socketErrorHandler } from '../middleware/socket.middleware.js';
import { logError, logInfo } from './logger.js';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    try {
      this.io = new Server(server, config.socketOptions);

      // Apply middleware
      this.io.use(authenticateSocket);
      this.io.use(socketRateLimit('message', 10, 1000)); // 10 messages per second

      // Set up connection handling
      this.io.on('connection', (socket) => {
        this.handleConnection(socket);
      });

      logInfo('Socket.IO service initialized successfully');
      return this.io;
    } catch (error) {
      logError('Error initializing Socket.IO service:', error);
      throw error;
    }
  }

  handleConnection(socket) {
    const userId = socket.user._id.toString();

    // Track user presence
    trackPresence(this.io)(socket);

    // Add error handler
    socketErrorHandler(socket);

    // Store user connection
    this.connectedUsers.set(userId, socket.id);

    // Handle chat events
    this.setupChatHandlers(socket);

    // Handle notification events
    this.setupNotificationHandlers(socket);

    // Handle order events
    this.setupOrderHandlers(socket);

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });

    logInfo(`User ${userId} connected`);
  }

  handleDisconnect(socket) {
    const userId = socket.user._id.toString();
    this.connectedUsers.delete(userId);
    logInfo(`User ${userId} disconnected`);
  }

  setupChatHandlers(socket) {
    // Join chat room
    socket.on('chat:join', (chatId) => {
      socket.join(`chat:${chatId}`);
      socket.to(`chat:${chatId}`).emit('chat:userJoined', {
        userId: socket.user._id,
        username: socket.user.username,
      });
    });

    // Leave chat room
    socket.on('chat:leave', (chatId) => {
      socket.leave(`chat:${chatId}`);
      socket.to(`chat:${chatId}`).emit('chat:userLeft', {
        userId: socket.user._id,
        username: socket.user.username,
      });
    });

    // Send message
    socket.on('chat:message', async (data) => {
      try {
        const { chatId, content, attachments } = data;

        // Emit message to chat room
        this.io.to(`chat:${chatId}`).emit('chat:message', {
          chatId,
          sender: {
            _id: socket.user._id,
            username: socket.user.username,
          },
          content,
          attachments,
          createdAt: new Date(),
        });
      } catch (error) {
        logError('Error handling chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
      const { chatId, isTyping } = data;
      socket.to(`chat:${chatId}`).emit('chat:typing', {
        userId: socket.user._id,
        username: socket.user.username,
        isTyping,
      });
    });
  }

  setupNotificationHandlers(socket) {
    // Subscribe to notifications
    socket.on('notifications:subscribe', () => {
      socket.join(`notifications:${socket.user._id}`);
    });

    // Unsubscribe from notifications
    socket.on('notifications:unsubscribe', () => {
      socket.leave(`notifications:${socket.user._id}`);
    });
  }

  setupOrderHandlers(socket) {
    // Join order room
    socket.on('order:join', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    // Leave order room
    socket.on('order:leave', (orderId) => {
      socket.leave(`order:${orderId}`);
    });
  }

  // Utility methods
  isUserOnline(userId) {
    return this.connectedUsers.has(userId.toString());
  }

  getUserSocket(userId) {
    const socketId = this.connectedUsers.get(userId.toString());
    return socketId ? this.io.sockets.sockets.get(socketId) : null;
  }

  // Notification methods
  async sendNotification(userId, notification) {
    try {
      this.io.to(`notifications:${userId}`).emit('notification', notification);
    } catch (error) {
      logError('Error sending notification:', error);
    }
  }

  // Order update methods
  async sendOrderUpdate(orderId, update) {
    try {
      this.io.to(`order:${orderId}`).emit('order:update', update);
    } catch (error) {
      logError('Error sending order update:', error);
    }
  }

  // Broadcast methods
  async broadcastToAll(event, data) {
    try {
      this.io.emit(event, data);
    } catch (error) {
      logError('Error broadcasting to all users:', error);
    }
  }

  async broadcastToRoom(room, event, data) {
    try {
      this.io.to(room).emit(event, data);
    } catch (error) {
      logError('Error broadcasting to room:', error);
    }
  }
}

// Create and export Socket.IO service instance
const socketService = new SocketService();
export default socketService;