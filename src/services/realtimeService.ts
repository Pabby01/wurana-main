/**
 * Real-time Service
 * Handles WebSocket connections, real-time updates, and event subscriptions
 */

import { API_ENDPOINTS } from './api';

export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: string;
  userId?: string;
  channel?: string;
}

export interface ConnectionConfig {
  wsUrl?: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
  timeout?: number;
}

export interface ChannelSubscription {
  channel: string;
  callback: (event: RealtimeEvent) => void;
  filter?: (event: RealtimeEvent) => boolean;
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'failed';

type EventType = 
  | 'message_received'
  | 'message_sent'
  | 'user_online'
  | 'user_offline'
  | 'typing_start'
  | 'typing_stop'
  | 'bid_created'
  | 'bid_accepted'
  | 'bid_rejected'
  | 'job_created'
  | 'job_updated'
  | 'job_completed'
  | 'payment_received'
  | 'payment_sent'
  | 'review_received'
  | 'escrow_created'
  | 'escrow_released'
  | 'notification'
  | 'system_announcement';

class RealtimeService {
  private ws: WebSocket | null = null;
  private config: Required<ConnectionConfig>;
  private connectionState: ConnectionState = 'disconnected';
  private subscriptions = new Map<string, ChannelSubscription[]>();
  private messageQueue: any[] = [];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private authToken: string | null = null;
  private userId: string | null = null;

  // Event listeners
  private eventListeners = new Map<string, Set<Function>>();

  constructor(config: ConnectionConfig = {}) {
    this.config = {
      wsUrl: config.wsUrl || API_ENDPOINTS.WEBSOCKET,
      reconnectAttempts: config.reconnectAttempts || 5,
      reconnectDelay: config.reconnectDelay || 2000,
      heartbeatInterval: config.heartbeatInterval || 30000,
      timeout: config.timeout || 10000,
    };
  }

  /**
   * Connect to WebSocket server
   */
  async connect(authToken: string, userId: string): Promise<void> {
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      return;
    }

    this.authToken = authToken;
    this.userId = userId;

    return new Promise((resolve, reject) => {
      this.connectionState = 'connecting';
      this.emit('connection_state_changed', { state: this.connectionState });

      const wsUrl = `${this.config.wsUrl}?token=${authToken}&userId=${userId}`;
      this.ws = new WebSocket(wsUrl);

      const timeout = setTimeout(() => {
        if (this.connectionState === 'connecting') {
          this.ws?.close();
          this.connectionState = 'failed';
          this.emit('connection_state_changed', { state: this.connectionState });
          reject(new Error('Connection timeout'));
        }
      }, this.config.timeout);

      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.connectionState = 'connected';
        this.emit('connection_state_changed', { state: this.connectionState });
        
        this.startHeartbeat();
        this.processMessageQueue();
        
        console.log('WebSocket connected');
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        clearTimeout(timeout);
        this.stopHeartbeat();
        
        if (this.connectionState !== 'disconnected') {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.handleDisconnection();
        }
      };

      this.ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('WebSocket error:', error);
        
        if (this.connectionState === 'connecting') {
          this.connectionState = 'failed';
          this.emit('connection_state_changed', { state: this.connectionState });
          reject(new Error('Connection failed'));
        }
      };
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.connectionState = 'disconnected';
      this.emit('connection_state_changed', { state: this.connectionState });
      this.ws.close(1000, 'Client disconnected');
    }

    this.ws = null;
  }

  /**
   * Subscribe to a channel
   */
  subscribe(
    channel: string,
    callback: (event: RealtimeEvent) => void,
    filter?: (event: RealtimeEvent) => boolean
  ): () => void {
    const subscription: ChannelSubscription = { channel, callback, filter };
    
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
      
      // Send subscription message to server
      this.send({
        type: 'subscribe',
        channel,
      });
    }
    
    this.subscriptions.get(channel)!.push(subscription);

    // Return unsubscribe function
    return () => {
      const channelSubs = this.subscriptions.get(channel);
      if (channelSubs) {
        const index = channelSubs.indexOf(subscription);
        if (index > -1) {
          channelSubs.splice(index, 1);
          
          if (channelSubs.length === 0) {
            this.subscriptions.delete(channel);
            
            // Send unsubscribe message to server
            this.send({
              type: 'unsubscribe',
              channel,
            });
          }
        }
      }
    };
  }

  /**
   * Subscribe to specific event types
   */
  subscribeToEvent(
    eventType: EventType,
    callback: (data: any) => void
  ): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    this.eventListeners.get(eventType)!.add(callback);

    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Send message through WebSocket
   */
  private send(message: any): void {
    if (this.connectionState === 'connected' && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: any): void {
    const event: RealtimeEvent = {
      type: data.type,
      data: data.data || data,
      timestamp: data.timestamp || new Date().toISOString(),
      userId: data.userId,
      channel: data.channel,
    };

    // Handle system messages
    if (data.type === 'pong') {
      // Heartbeat response received
      return;
    }

    // Notify channel subscribers
    if (event.channel) {
      const channelSubs = this.subscriptions.get(event.channel);
      if (channelSubs) {
        channelSubs.forEach(({ callback, filter }) => {
          if (!filter || filter(event)) {
            callback(event);
          }
        });
      }
    }

    // Notify event type listeners
    const eventListeners = this.eventListeners.get(event.type as EventType);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(event.data));
    }

    // Emit general event
    this.emit('message', event);
  }

  /**
   * Handle connection disconnection
   */
  private handleDisconnection(): void {
    this.connectionState = 'disconnected';
    this.emit('connection_state_changed', { state: this.connectionState });

    // Attempt to reconnect if we have auth credentials
    if (this.authToken && this.userId) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(attempt: number = 1): void {
    if (attempt > this.config.reconnectAttempts) {
      this.connectionState = 'failed';
      this.emit('connection_state_changed', { state: this.connectionState });
      return;
    }

    this.connectionState = 'reconnecting';
    this.emit('connection_state_changed', { 
      state: this.connectionState, 
      attempt 
    });

    const delay = this.config.reconnectDelay * attempt;
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`Reconnection attempt ${attempt}/${this.config.reconnectAttempts}`);
      
      this.connect(this.authToken!, this.userId!)
        .catch(() => {
          this.scheduleReconnect(attempt + 1);
        });
    }, delay);
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.connectionState === 'connected') {
        this.send({ type: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    this.send({
      type: 'typing',
      data: {
        conversationId,
        isTyping,
      },
    });
  }

  /**
   * Update online status
   */
  updateOnlineStatus(isOnline: boolean): void {
    this.send({
      type: 'status_update',
      data: {
        isOnline,
      },
    });
  }

  /**
   * Join a room/channel
   */
  joinChannel(channel: string): void {
    this.send({
      type: 'join_channel',
      channel,
    });
  }

  /**
   * Leave a room/channel
   */
  leaveChannel(channel: string): void {
    this.send({
      type: 'leave_channel',
      channel,
    });
  }

  /**
   * Send custom event
   */
  sendEvent(type: string, data: any, channel?: string): void {
    this.send({
      type,
      data,
      channel,
    });
  }

  /**
   * Get active subscriptions
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Clear all subscriptions
   */
  clearSubscriptions(): void {
    // Unsubscribe from all channels on server
    this.subscriptions.forEach((_, channel) => {
      this.send({
        type: 'unsubscribe',
        channel,
      });
    });

    this.subscriptions.clear();
    this.eventListeners.clear();
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// Export types for external use
export type { 
  RealtimeEvent, 
  ConnectionConfig, 
  ChannelSubscription,
  EventType 
};
