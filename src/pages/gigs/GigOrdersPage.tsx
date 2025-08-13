import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OrderManagement } from '../../components/gigs/OrderManagement';
import { GigOrder } from '../../types/gig';

// Mock data for demonstration
const MOCK_ORDERS: GigOrder[] = [
  {
    id: 'order-001',
    gigId: '1',
    packageId: 'pkg1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    title: 'Professional Logo Design for Tech Startup',
    status: 'in_progress',
    totalAmount: 0.35,
    currency: 'SOL',
    deadline: new Date('2024-02-25'),
    requirements: [
      {
        id: 'req1',
        question: 'What is your business name?',
        answer: 'TechFlow Solutions',
        type: 'text',
        required: true
      },
      {
        id: 'req2',
        question: 'Describe your business',
        answer: 'We provide cloud-based workflow automation solutions for small to medium businesses.',
        type: 'text',
        required: true
      }
    ],
    deliverables: [],
    revisions: [],
    messages: [
      {
        id: 'msg1',
        senderId: 'buyer1',
        content: 'Hi! I\'m excited to work with you on my logo. I\'ve filled out all the requirements. Looking forward to seeing your concepts!',
        attachments: [],
        timestamp: new Date('2024-02-20T10:00:00'),
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'seller1',
        content: 'Hello! Thank you for choosing my service. I\'ve reviewed your requirements and will start working on your logo concepts right away. I\'ll have the initial designs ready within 24 hours.',
        attachments: [],
        timestamp: new Date('2024-02-20T10:30:00'),
        isRead: true
      }
    ],
    extras: [],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: 'order-002',
    gigId: '1',
    packageId: 'pkg2',
    buyerId: 'buyer2',
    sellerId: 'seller1',
    title: 'Complete Brand Identity Package',
    status: 'delivered',
    totalAmount: 0.75,
    currency: 'SOL',
    deadline: new Date('2024-02-22'),
    requirements: [
      {
        id: 'req3',
        question: 'What is your business name?',
        answer: 'Green Earth Coffee',
        type: 'text',
        required: true
      }
    ],
    deliverables: [
      {
        id: 'del1',
        name: 'Logo_Package_Final.zip',
        fileUrl: '/downloads/logo-package.zip',
        fileType: 'application/zip',
        fileSize: 15728640,
        uploadedAt: new Date('2024-02-21')
      }
    ],
    revisions: [],
    messages: [
      {
        id: 'msg3',
        senderId: 'seller1',
        content: 'I\'ve completed your brand identity package! Please review the files and let me know if you need any adjustments.',
        attachments: ['Logo_Package_Final.zip'],
        timestamp: new Date('2024-02-21T14:00:00'),
        isRead: true
      }
    ],
    extras: ['extra2'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-21')
  }
];

export const GigOrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<GigOrder[]>(MOCK_ORDERS.filter(order => order.gigId === id));

  const handleUpdateOrder = (orderId: string, updates: Partial<GigOrder>) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, ...updates, updatedAt: new Date() }
          : order
      )
    );
  };

  const handleSendMessage = (orderId: string, message: string, attachments?: File[]) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'seller1', // Current user
      content: message,
      attachments: attachments?.map(f => f.name) || [],
      timestamp: new Date(),
      isRead: true
    };

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              messages: [...order.messages, newMessage],
              updatedAt: new Date()
            }
          : order
      )
    );
  };

  const handleUploadDeliverable = (orderId: string, files: File[]) => {
    const deliverables = files.map(file => ({
      id: `del-${Date.now()}-${Math.random()}`,
      name: file.name,
      fileUrl: URL.createObjectURL(file),
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date()
    }));

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              deliverables: [...order.deliverables, ...deliverables],
              status: 'delivered',
              updatedAt: new Date()
            }
          : order
      )
    );
  };

  const handleRequestRevision = (orderId: string, reason: string, description: string) => {
    const revision = {
      id: `rev-${Date.now()}`,
      reason,
      description,
      requestedAt: new Date(),
      status: 'pending' as const
    };

    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              revisions: [...order.revisions, revision],
              status: 'in_progress',
              updatedAt: new Date()
            }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/gigs/manage`)}
            className="flex items-center text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gigs
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Gig Orders</h1>
          <p className="text-white/70">Manage orders and communicate with buyers</p>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <OrderManagement
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            onSendMessage={handleSendMessage}
            onUploadDeliverable={handleUploadDeliverable}
            onRequestRevision={handleRequestRevision}
            currentUserId="seller1"
          />
        </div>
      </div>
    </div>
  );
};
