 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Upload, 
  Download, 
  Send,
  Paperclip,
  User,
  RefreshCw
} from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { Input } from '../ui/Input';
import { GlassmorphicCard } from '../ui/GlassmorphicCard';
import { GigOrder } from '../../types/gig';

interface OrderManagementProps {
  orders: GigOrder[];
  onUpdateOrder: (orderId: string, updates: Partial<GigOrder>) => void;
  onSendMessage: (orderId: string, message: string, attachments?: File[]) => void;
  onUploadDeliverable: (orderId: string, files: File[]) => void;
  onRequestRevision: (orderId: string, reason: string, description: string) => void;
  currentUserId: string;
}

const ORDER_STATUS_CONFIG = {
  pending: { color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30', label: 'Pending' },
  in_progress: { color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', label: 'In Progress' },
  delivered: { color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', label: 'Delivered' },
  completed: { color: 'text-green-400 bg-green-500/20 border-green-500/30', label: 'Completed' },
  cancelled: { color: 'text-red-400 bg-red-500/20 border-red-500/30', label: 'Cancelled' },
  disputed: { color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', label: 'Disputed' }
};

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onSendMessage,
  onUploadDeliverable,
  onRequestRevision,
  currentUserId
}) => {
  const [selectedOrder, setSelectedOrder] = useState<GigOrder | null>(null);
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [revisionReason, setRevisionReason] = useState('');
  const [revisionDescription, setRevisionDescription] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const handleSendMessage = () => {
    if (selectedOrder && messageText.trim()) {
      onSendMessage(selectedOrder.id, messageText.trim(), attachments);
      setMessageText('');
      setAttachments([]);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files && selectedOrder) {
      onUploadDeliverable(selectedOrder.id, Array.from(files));
    }
  };

  const handleSubmitRevision = () => {
    if (selectedOrder && revisionReason && revisionDescription) {
      onRequestRevision(selectedOrder.id, revisionReason, revisionDescription);
      setRevisionReason('');
      setRevisionDescription('');
      setShowRevisionForm(false);
    }
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (deadline: Date) => {
    return new Date() > deadline;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Orders List */}
      <div className="lg:col-span-1">
        <GlassmorphicCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Orders</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-purple-500"
            >
              <option value="all" className="text-gray-900">All Orders</option>
              <option value="pending" className="text-gray-900">Pending</option>
              <option value="in_progress" className="text-gray-900">In Progress</option>
              <option value="delivered" className="text-gray-900">Delivered</option>
              <option value="completed" className="text-gray-900">Completed</option>
              <option value="cancelled" className="text-gray-900">Cancelled</option>
              <option value="disputed" className="text-gray-900">Disputed</option>
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedOrder?.id === order.id
                    ? 'border-purple-400 bg-purple-500/10'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
                onClick={() => setSelectedOrder(order)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">#{order.id.slice(0, 8)}</span>
                  <span className={`px-2 py-1 rounded text-xs border ${ORDER_STATUS_CONFIG[order.status].color}`}>
                    {ORDER_STATUS_CONFIG[order.status].label}
                  </span>
                </div>
                
                <h4 className="text-white text-sm font-medium mb-2 line-clamp-2">{order.title}</h4>
                
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>{order.totalAmount} {order.currency}</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className={isOverdue(order.deadline) ? 'text-red-400' : ''}>
                      {getTimeRemaining(order.deadline)}
                    </span>
                  </div>
                </div>

                {/* Unread messages indicator */}
                {order.messages.some(msg => !msg.isRead && msg.senderId !== currentUserId) && (
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 ml-auto"></div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-white/70">No orders found</p>
            </div>
          )}
        </GlassmorphicCard>
      </div>

      {/* Order Details */}
      <div className="lg:col-span-2">
        {selectedOrder ? (
          <GlassmorphicCard className="p-6 h-full">
            <div className="flex flex-col h-full">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/20">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Order #{selectedOrder.id.slice(0, 8)}</h2>
                  <p className="text-white/70">{selectedOrder.title}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm border ${ORDER_STATUS_CONFIG[selectedOrder.status].color}`}>
                    {ORDER_STATUS_CONFIG[selectedOrder.status].label}
                  </span>
                  <p className="text-white font-semibold mt-2">{selectedOrder.totalAmount} {selectedOrder.currency}</p>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-white/70 text-sm">Deadline</p>
                  <p className={`text-white font-semibold ${isOverdue(selectedOrder.deadline) ? 'text-red-400' : ''}`}>
                    {formatDate(selectedOrder.deadline)}
                  </p>
                  <p className={`text-sm ${isOverdue(selectedOrder.deadline) ? 'text-red-400' : 'text-white/70'}`}>
                    {getTimeRemaining(selectedOrder.deadline)}
                  </p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Buyer</p>
                  <div className="flex items-center mt-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-2">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">John Doe</p>
                      <p className="text-white/70 text-xs">Member since 2023</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Revisions</p>
                  <p className="text-white font-semibold">{selectedOrder.revisions.length}/3 used</p>
                </div>
              </div>

              {/* Requirements */}
              {selectedOrder.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Order Requirements</h3>
                  <div className="space-y-3">
                    {selectedOrder.requirements.map((req) => (
                      <div key={req.id} className="bg-white/5 rounded-lg p-3">
                        <p className="text-white font-medium text-sm mb-1">{req.question}</p>
                        <p className="text-white/70 text-sm">{req.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {selectedOrder.deliverables.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Deliverables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOrder.deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                          <Download className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{deliverable.name}</p>
                          <p className="text-white/70 text-xs">
                            {(deliverable.fileSize / 1024 / 1024).toFixed(2)} MB • {formatDate(deliverable.uploadedAt)}
                          </p>
                        </div>
                        <button className="text-purple-400 hover:text-purple-300 p-1">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Messages</h3>
                  <div className="flex space-x-2">
                    {selectedOrder.status === 'in_progress' && currentUserId === selectedOrder.sellerId && (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                        <div className="flex items-center px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm hover:bg-green-500/30">
                          <Upload className="w-4 h-4 mr-1" />
                          Deliver
                        </div>
                      </label>
                    )}
                    {selectedOrder.status === 'delivered' && currentUserId === selectedOrder.buyerId && (
                      <button
                        onClick={() => setShowRevisionForm(!showRevisionForm)}
                        className="flex items-center px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm hover:bg-yellow-500/30"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Request Revision
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 bg-white/5 rounded-lg p-4 mb-4 overflow-y-auto max-h-64">
                  <div className="space-y-4">
                    {selectedOrder.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === currentUserId
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.attachments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center text-xs">
                                  <Paperclip className="w-3 h-3 mr-1" />
                                  {attachment}
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1">{formatDate(message.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revision Request Form */}
                <AnimatePresence>
                  {showRevisionForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                    >
                      <h4 className="text-white font-semibold mb-3">Request Revision</h4>
                      <div className="space-y-3">
                        <Input
                          label="Reason for Revision"
                          value={revisionReason}
                          onChange={(e) => setRevisionReason(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="e.g., Color adjustment needed"
                        />
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">Description</label>
                          <textarea
                            value={revisionDescription}
                            onChange={(e) => setRevisionDescription(e.target.value)}
                            rows={3}
                            placeholder="Please describe the changes you'd like..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <NeonButton
                            size="sm"
                            onClick={handleSubmitRevision}
                            disabled={!revisionReason || !revisionDescription}
                          >
                            Submit Revision Request
                          </NeonButton>
                          <button
                            onClick={() => setShowRevisionForm(false)}
                            className="px-4 py-2 text-white/70 hover:text-white border border-white/30 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <label className="cursor-pointer flex items-center px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => e.target.files && setAttachments(Array.from(e.target.files))}
                      className="hidden"
                    />
                    <Paperclip className="w-4 h-4" />
                  </label>
                  <NeonButton onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="w-4 h-4" />
                  </NeonButton>
                </div>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center px-2 py-1 bg-purple-500/20 rounded text-white text-xs">
                        <Paperclip className="w-3 h-3 mr-1" />
                        {file.name}
                        <button
                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </GlassmorphicCard>
        ) : (
          <GlassmorphicCard className="p-6 h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-white mb-2">Select an Order</h3>
                <p className="text-white/70">Choose an order from the list to view details and manage communication</p>
              </div>
            </div>
          </GlassmorphicCard>
        )}
      </div>
    </div>
  );
};
