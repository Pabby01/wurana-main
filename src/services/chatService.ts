/**
 * Chat Service
 * Handles messaging functionality, conversations, and real-time communication
 */

import { apiClient, API_ENDPOINTS } from './api';
import { Message, Conversation } from '../types';

export interface SendMessageRequest {
  conversationId?: string;
  recipientId?: string;
  content: string;
  attachments?: File[];
  type?: 'text' | 'image' | 'file' | 'voice' | 'system';
}

export interface CreateConversationRequest {
  participantIds: string[];
  title?: string;
  type?: 'direct' | 'group' | 'support';
}

export interface ConversationFilters {
  type?: 'direct' | 'group' | 'support';
  unreadOnly?: boolean;
  archived?: boolean;
  page?: number;
  limit?: number;
}

export interface MessageFilters {
  conversationId: string;
  type?: 'text' | 'image' | 'file' | 'voice' | 'system';
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface ConversationWithDetails extends Conversation {
  participants: Array<{
    id: string;
    displayName: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
  type: 'direct' | 'group' | 'support';
}

export interface MessageWithDetails extends Message {
  sender: {
    id: string;
    displayName: string;
    avatar?: string;
  };
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

class ChatService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(filters?: ConversationFilters): Promise<{
    conversations: ConversationWithDetails[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.CONVERSATIONS}`, filters);
    return response.data;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationWithDetails> {
    const response = await apiClient.get<ConversationWithDetails>(
      `${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`
    );
    return response.data;
  }

  /**
   * Create a new conversation
   */
  async createConversation(conversationData: CreateConversationRequest): Promise<{
    conversationId: string;
  }> {
    const response = await apiClient.post<{ conversationId: string }>(
      API_ENDPOINTS.CONVERSATIONS,
      conversationData
    );
    return response.data;
  }

  /**
   * Get messages in a conversation
   */
  async getMessages(filters: MessageFilters): Promise<{
    messages: MessageWithDetails[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CONVERSATIONS}/${filters.conversationId}/messages`,
      filters
    );
    return response.data;
  }

  /**
   * Send a message
   */
  async sendMessage(messageData: SendMessageRequest): Promise<{
    messageId: string;
    conversationId: string;
  }> {
    let endpoint = API_ENDPOINTS.MESSAGES;
    let requestData: any;

    // If sending to a specific conversation
    if (messageData.conversationId) {
      endpoint = `${API_ENDPOINTS.CONVERSATIONS}/${messageData.conversationId}/messages`;
    }

    // Handle attachments
    if (messageData.attachments && messageData.attachments.length > 0) {
      const formData = new FormData();
      formData.append('content', messageData.content);
      formData.append('type', messageData.type || 'text');
      
      if (messageData.recipientId) {
        formData.append('recipientId', messageData.recipientId);
      }

      messageData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      requestData = formData;
    } else {
      requestData = {
        content: messageData.content,
        type: messageData.type || 'text',
        recipientId: messageData.recipientId,
      };
    }

    const response = await apiClient.post<{
      messageId: string;
      conversationId: string;
    }>(endpoint, requestData);

    return response.data;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string, messageIds?: string[]): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/read`, {
      messageIds,
    });
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string, deleteForEveryone: boolean = false): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.MESSAGES}/${messageId}`, {
      body: JSON.stringify({ deleteForEveryone }),
    });
  }

  /**
   * Edit a message
   */
  async editMessage(messageId: string, newContent: string): Promise<MessageWithDetails> {
    const response = await apiClient.put<MessageWithDetails>(
      `${API_ENDPOINTS.MESSAGES}/${messageId}`,
      { content: newContent }
    );
    return response.data;
  }

  /**
   * React to a message
   */
  async reactToMessage(messageId: string, emoji: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.MESSAGES}/${messageId}/react`, { emoji });
  }

  /**
   * Remove reaction from message
   */
  async removeReaction(messageId: string, emoji: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.MESSAGES}/${messageId}/react`, {
      body: JSON.stringify({ emoji }),
    });
  }

  /**
   * Archive/unarchive conversation
   */
  async toggleConversationArchive(conversationId: string, archived: boolean): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`, { archived });
  }

  /**
   * Pin/unpin conversation
   */
  async toggleConversationPin(conversationId: string, pinned: boolean): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`, { pinned });
  }

  /**
   * Mute/unmute conversation
   */
  async toggleConversationMute(conversationId: string, muted: boolean): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}`, { muted });
  }

  /**
   * Leave conversation
   */
  async leaveConversation(conversationId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/leave`);
  }

  /**
   * Add participants to conversation
   */
  async addParticipants(conversationId: string, participantIds: string[]): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/participants`, {
      participantIds,
    });
  }

  /**
   * Remove participant from conversation
   */
  async removeParticipant(conversationId: string, participantId: string): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/participants/${participantId}`
    );
  }

  /**
   * Search messages
   */
  async searchMessages(query: string, filters?: {
    conversationId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    messages: MessageWithDetails[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.MESSAGES}/search`, {
      q: query,
      ...filters,
    });
    return response.data;
  }

  /**
   * Get conversation settings
   */
  async getConversationSettings(conversationId: string): Promise<{
    notifications: boolean;
    soundEnabled: boolean;
    theme: string;
    autoDelete: boolean;
    autoDeleteDays: number;
  }> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/settings`
    );
    return response.data;
  }

  /**
   * Update conversation settings
   */
  async updateConversationSettings(
    conversationId: string,
    settings: {
      notifications?: boolean;
      soundEnabled?: boolean;
      theme?: string;
      autoDelete?: boolean;
      autoDeleteDays?: number;
    }
  ): Promise<void> {
    await apiClient.put(
      `${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/settings`,
      settings
    );
  }

  /**
   * Get user's online status
   */
  async getUserOnlineStatus(userIds: string[]): Promise<Record<string, {
    isOnline: boolean;
    lastSeen?: string;
  }>> {
    const response = await apiClient.post('/users/online-status', { userIds });
    return response.data;
  }

  /**
   * Update user's online status
   */
  async updateOnlineStatus(isOnline: boolean): Promise<void> {
    await apiClient.post('/users/online-status/update', { isOnline });
  }

  /**
   * Get typing indicators
   */
  async getTypingIndicators(conversationId: string): Promise<Array<{
    userId: string;
    displayName: string;
  }>> {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/typing`
    );
    return response.data;
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.CONVERSATIONS}/${conversationId}/typing`, {
      isTyping,
    });
  }

  /**
   * Report conversation or message
   */
  async reportContent(
    type: 'conversation' | 'message',
    id: string,
    reason: string,
    details?: string
  ): Promise<{ reportId: string }> {
    const endpoint = type === 'conversation'
      ? `${API_ENDPOINTS.CONVERSATIONS}/${id}/report`
      : `${API_ENDPOINTS.MESSAGES}/${id}/report`;

    const response = await apiClient.post<{ reportId: string }>(endpoint, {
      reason,
      details,
    });
    return response.data;
  }

  /**
   * Block/unblock user in chat
   */
  async toggleUserBlock(userId: string, blocked: boolean): Promise<void> {
    await apiClient.post('/users/block', { userId, blocked });
  }

  /**
   * Get blocked users list
   */
  async getBlockedUsers(): Promise<Array<{
    id: string;
    displayName: string;
    avatar?: string;
    blockedAt: string;
  }>> {
    const response = await apiClient.get('/users/blocked');
    return response.data;
  }
}

export const chatService = new ChatService();
