import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, MoreVertical, Phone, Video, Paperclip, Smile, Send,
  Pin, Settings, Users, Image as ImageIcon, File,
  Mic, MicOff, X, Check, Volume2, MessageCircle, Minimize2
} from 'lucide-react';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { Input } from '../../components/ui/Input';
import { Conversation, Message, MessageAttachment, OnlineStatus } from '../../types';
import { mockConversations, mockMessages } from '../../data/mockData';

// Fixed empty interface by removing it since it's not needed
const reactionEmojis = ['👍', '❤️', '😊', '😮', '😢', '😡'];

export const ChatPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers] = useState<OnlineStatus[]>([
    { userId: 'client-1', isOnline: true, lastSeen: new Date() },
    { userId: 'freelancer-3', isOnline: false, lastSeen: new Date(Date.now() - 30 * 60 * 1000) },
    { userId: 'support', isOnline: true, lastSeen: new Date() }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      // Load messages for selected conversation
      setMessages(mockMessages.filter(m => m.conversationId === selectedConversation.id));
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicators
    const interval = setInterval(() => {
      if (selectedConversation && Math.random() > 0.7) {
        const otherParticipants = selectedConversation.participants.filter(p => p !== 'current-user');
        if (otherParticipants.length > 0) {
          setTypingUsers([otherParticipants[0]]);
          setTimeout(() => setTypingUsers([]), 2000);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'current-user',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      isRead: false,
      replyTo: replyToMessage?.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyToMessage(null);

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: message, updatedAt: new Date() }
          : conv
      )
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedConversation) return;

    Array.from(files).forEach(file => {
      const attachment: MessageAttachment = {
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      };

      const message: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        conversationId: selectedConversation.id,
        senderId: 'current-user',
        content: file.type.startsWith('image/') ? 'Shared an image' : `Shared ${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        timestamp: new Date(),
        isRead: false,
        attachments: [attachment]
      };

      setMessages(prev => [...prev, message]);
    });
  };

  const toggleConversationPin = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, isPinned: !conv.isPinned }
          : conv
      )
    );
  };

  const getUserDisplayName = (userId: string): string => {
    if (userId === 'current-user') return 'You';
    if (userId === 'client-1') return 'John Smith';
    if (userId === 'freelancer-3') return 'Sarah Wilson';
    if (userId === 'support') return 'Support Team';
    return userId;
  };

  const getUserAvatar = (userId: string): string => {
    if (userId === 'client-1') return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
    if (userId === 'freelancer-3') return 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150';
    if (userId === 'support') return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
    return '';
  };

  const isUserOnline = (userId: string): boolean => {
    return onlineUsers.find(u => u.userId === userId)?.isOnline || false;
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d`;
    if (diffInHours > 0) return `${diffInHours}h`;
    if (diffInMinutes > 0) return `${diffInMinutes}m`;
    return 'now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Stay connected with your clients and projects</p>
            </div>
            <div className="flex items-center space-x-2">
              <NeonButton
                variant="secondary"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? 'Expand chat window' : 'Minimize chat window'}
                title={isMinimized ? 'Expand chat window' : 'Minimize chat window'}
              >
                <Minimize2 className="w-4 h-4" />
                {isMinimized ? 'Expand' : 'Minimize'}
              </NeonButton>
              <NeonButton 
                variant="primary" 
                size="sm"
                aria-label="Start new chat"
                title="Start new chat"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </NeonButton>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isMinimized ? 'h-20' : 'h-[800px]'}`}>
          <GlassmorphicCard className="h-full" opacity={0.2}>
            {isMinimized ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-600">Chat minimized - Click expand to continue</span>
                  <div className="flex -space-x-2">
                    {conversations.slice(0, 3).map((conv) => (
                      <div
                        key={conv.id}
                        className="relative w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full border-2 border-white flex items-center justify-center overflow-hidden"
                      >
                        {conv.metadata?.avatar ? (
                          <img src={conv.metadata.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-xs font-semibold">
                            {getUserDisplayName(conv.participants.find(p => p !== 'current-user') || '').charAt(0)}
                          </span>
                        )}
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex">
                {/* Conversations Sidebar */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                  {/* Search */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                        aria-label="Search conversations"
                      />
                    </div>
                  </div>

                  {/* Conversation List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-purple-50 border-l-4 border-l-purple-500'
                            : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                              {conversation.metadata?.avatar ? (
                                <img
                                  src={conversation.metadata.avatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-semibold">
                                  {getUserDisplayName(conversation.participants.find(p => p !== 'current-user') || '').charAt(0)}
                                </span>
                              )}
                            </div>
                            {isUserOnline(conversation.participants.find(p => p !== 'current-user') || '') && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {conversation.title || getUserDisplayName(conversation.participants.find(p => p !== 'current-user') || '')}
                                </h3>
                                {conversation.isPinned && (
                                  <Pin className="w-3 h-3 text-purple-600" />
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {getTimeAgo(conversation.updatedAt)}
                                </span>
                              </div>
                            </div>

                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate mt-1">
                                {conversation.lastMessage.senderId === 'current-user' ? 'You: ' : ''}
                                {conversation.lastMessage.type === 'image' ? '📷 Image' :
                                 conversation.lastMessage.type === 'file' ? '📎 File' :
                                 conversation.lastMessage.content}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                {conversation.type === 'project' && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    Project
                                  </span>
                                )}
                                {conversation.type === 'group' && (
                                  <>
                                    <Users className="w-3 h-3" />
                                    <span>{conversation.participants.length} members</span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleConversationPin(conversation.id);
                                  }}
                                  className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                                    conversation.isPinned ? 'text-purple-600' : 'text-gray-400'
                                  }`}
                                  aria-label={conversation.isPinned ? 'Unpin conversation' : 'Pin conversation'}
                                  title={conversation.isPinned ? 'Unpin conversation' : 'Pin conversation'}
                                >
                                  <Pin className="w-3 h-3" />
                                </button>
                                <button 
                                  className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
                                  aria-label="More options"
                                  title="More options"
                                >
                                  <MoreVertical className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                                {selectedConversation.metadata?.avatar ? (
                                  <img
                                    src={selectedConversation.metadata.avatar}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-semibold">
                                    {getUserDisplayName(selectedConversation.participants.find(p => p !== 'current-user') || '').charAt(0)}
                                  </span>
                                )}
                              </div>
                              {isUserOnline(selectedConversation.participants.find(p => p !== 'current-user') || '') && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>

                            <div>
                              <h2 className="font-semibold text-gray-900">
                                {selectedConversation.title || getUserDisplayName(selectedConversation.participants.find(p => p !== 'current-user') || '')}
                              </h2>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                {isUserOnline(selectedConversation.participants.find(p => p !== 'current-user') || '') ? (
                                  <span className="text-green-600">Online</span>
                                ) : (
                                  <span>Last seen {getTimeAgo(onlineUsers.find(u => u.userId === selectedConversation.participants.find(p => p !== 'current-user'))?.lastSeen || new Date())}</span>
                                )}
                                {typingUsers.length > 0 && (
                                  <span className="text-purple-600">
                                    {getUserDisplayName(typingUsers[0])} is typing...
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button 
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                              aria-label="Start voice call"
                              title="Start voice call"
                            >
                              <Phone className="w-5 h-5" />
                            </button>
                            <button 
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                              aria-label="Start video call"
                              title="Start video call"
                            >
                              <Video className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setShowParticipants(!showParticipants)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                              aria-label={showParticipants ? 'Hide participants' : 'Show participants'}
                              title={showParticipants ? 'Hide participants' : 'Show participants'}
                            >
                              <Users className="w-5 h-5" />
                            </button>
                            <button 
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                              aria-label="Chat settings"
                              title="Chat settings"
                            >
                              <Settings className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`flex ${
                                message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                  message.senderId === 'current-user'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                {message.replyTo && (
                                  <div className="mb-2 p-2 bg-black/10 rounded-lg text-sm">
                                    <p className="opacity-75">Replying to:</p>
                                    <p className="truncate">
                                      {messages.find(m => m.id === message.replyTo)?.content}
                                    </p>
                                  </div>
                                )}

                                {message.type === 'image' && message.attachments && (
                                  <div className="mb-2">
                                    {message.attachments.map(att => (
                                      <img
                                        key={att.id}
                                        src={att.url}
                                        alt={att.name}
                                        className="rounded-lg max-w-full h-auto"
                                      />
                                    ))}
                                  </div>
                                )}

                                {message.type === 'file' && message.attachments && (
                                  <div className="mb-2">
                                    {message.attachments.map(att => (
                                      <div key={att.id} className="flex items-center space-x-2 p-2 bg-black/10 rounded-lg">
                                        <File className="w-4 h-4" />
                                        <span className="text-sm">{att.name}</span>
                                        <span className="text-xs opacity-75">
                                          ({(att.size / 1024).toFixed(1)}KB)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {message.type === 'voice' && (
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      className="p-1 rounded-full bg-black/10"
                                      aria-label="Play voice message"
                                      title="Play voice message"
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1 h-1 bg-black/20 rounded-full">
                                      <div className="w-1/3 h-full bg-white rounded-full" />
                                    </div>
                                    <span className="text-xs">0:23</span>
                                  </div>
                                )}

                                <p className="text-sm">{message.content}</p>
                                
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs opacity-75">
                                    {message.timestamp.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                  {message.senderId === 'current-user' && (
                                    <div className="flex items-center space-x-1">
                                      {message.isRead ? (
                                        <div className="flex space-x-0.5">
                                          <Check className="w-3 h-3" />
                                          <Check className="w-3 h-3 -ml-1" />
                                        </div>
                                      ) : (
                                        <Check className="w-3 h-3" />
                                      )}
                                    </div>
                                  )}
                                </div>

                                {message.reactions && message.reactions.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {message.reactions.reduce((acc, reaction) => {
                                      const existing = acc.find(r => r.emoji === reaction.emoji);
                                      if (existing) {
                                        existing.count++;
                                      } else {
                                        acc.push({ emoji: reaction.emoji, count: 1 });
                                      }
                                      return acc;
                                    }, [] as Array<{emoji: string, count: number}>).map(reaction => (
                                      <span
                                        key={reaction.emoji}
                                        className="px-2 py-1 bg-black/10 rounded-full text-xs flex items-center space-x-1"
                                      >
                                        <span>{reaction.emoji}</span>
                                        {reaction.count > 1 && <span>{reaction.count}</span>}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        {replyToMessage && (
                          <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-1 h-8 bg-purple-600 rounded-full" />
                              <div>
                                <p className="text-xs text-gray-600">Replying to {getUserDisplayName(replyToMessage.senderId)}</p>
                                <p className="text-sm truncate">{replyToMessage.content}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setReplyToMessage(null)}
                              className="text-gray-400 hover:text-gray-600"
                              aria-label="Cancel reply"
                              title="Cancel reply"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-end space-x-2">
                          <div className="flex items-center space-x-1">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              className="hidden"
                              multiple
                              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              aria-label="Attach file"
                              title="Attach file"
                            >
                              <Paperclip className="w-5 h-5" />
                            </button>
                            <button 
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              aria-label="Attach image"
                              title="Attach image"
                            >
                              <ImageIcon className="w-5 h-5" />
                            </button>
                            <button
                              onMouseDown={() => setIsRecording(true)}
                              onMouseUp={() => setIsRecording(false)}
                              className={`p-2 rounded-lg transition-colors ${
                                isRecording
                                  ? 'text-red-600 bg-red-50'
                                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                              }`}
                              aria-label={isRecording ? 'Recording voice message' : 'Record voice message'}
                              title={isRecording ? 'Recording voice message' : 'Record voice message'}
                            >
                              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                          </div>

                          <div className="flex-1">
                            <div className="relative">
                              <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder="Type a message..."
                                className="pr-12"
                                aria-label="Type your message"
                              />
                              <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                                aria-label="Add emoji"
                                title="Add emoji"
                              >
                                <Smile className="w-5 h-5" />
                              </button>

                              {showEmojiPicker && (
                                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                  <div className="flex space-x-1">
                                    {reactionEmojis.map(emoji => (
                                      <button
                                        key={emoji}
                                        onClick={() => {
                                          setNewMessage(newMessage + emoji);
                                          setShowEmojiPicker(false);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded"
                                        aria-label={`Add ${emoji} emoji`}
                                        title={`Add ${emoji} emoji`}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <NeonButton
                            variant="primary"
                            size="sm"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="px-4"
                            aria-label="Send message"
                            title="Send message"
                          >
                            <Send className="w-4 h-4" />
                          </NeonButton>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Select a conversation
                        </h3>
                        <p className="text-gray-600">
                          Choose a conversation from the sidebar to start messaging
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Participants Sidebar */}
                <AnimatePresence>
                  {showParticipants && selectedConversation && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '300px', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="border-l border-gray-200 bg-gray-50 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Participants</h3>
                          <button
                            onClick={() => setShowParticipants(false)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close participants panel"
                            title="Close participants panel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {selectedConversation.participants.map(participantId => (
                            <div key={participantId} className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                                  {getUserAvatar(participantId) ? (
                                    <img
                                      src={getUserAvatar(participantId)}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-white text-xs font-semibold">
                                      {getUserDisplayName(participantId).charAt(0)}
                                    </span>
                                  )}
                                </div>
                                {isUserOnline(participantId) && (
                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{getUserDisplayName(participantId)}</p>
                                <p className="text-xs text-gray-600">
                                  {isUserOnline(participantId) ? 'Online' : 'Offline'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedConversation.type === 'project' && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-semibold text-sm text-gray-900 mb-3">Project Info</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium">In Progress</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Deadline:</span>
                                <span className="font-medium">Dec 15, 2024</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Budget:</span>
                                <span className="font-medium">20 SOL</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-sm text-gray-900 mb-3">Quick Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                              View Project Details
                            </button>
                            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                              Share Files
                            </button>
                            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                              Schedule Meeting
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
};