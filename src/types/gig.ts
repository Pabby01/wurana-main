export interface Gig {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  images: string[];
  videoUrl?: string;
  status: 'draft' | 'active' | 'paused' | 'deleted';
  packages: GigPackage[];
  extras: GigExtra[];
  faq: GigFAQ[];
  requirements: string[];
  deliverables: string[];
  keywords: string[];
  rating: number;
  totalOrders: number;
  totalEarnings: number;
  impressions: number;
  clicks: number;
  conversionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GigPackage {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'premium';
  title: string;
  description: string;
  price: number;
  currency: 'SOL' | 'USDC';
  deliveryTime: number; // in days
  revisions: number;
  features: string[];
  isActive: boolean;
}

export interface GigExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'SOL' | 'USDC';
  deliveryTime: number;
  isActive: boolean;
}

export interface GigFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface GigOrder {
  id: string;
  gigId: string;
  packageId: string;
  buyerId: string;
  sellerId: string;
  title: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  totalAmount: number;
  currency: 'SOL' | 'USDC';
  deadline: Date;
  requirements: OrderRequirement[];
  deliverables: OrderDeliverable[];
  revisions: OrderRevision[];
  messages: OrderMessage[];
  extras: string[]; // GigExtra IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRequirement {
  id: string;
  question: string;
  answer: string;
  type: 'text' | 'file' | 'multiple_choice';
  options?: string[];
  required: boolean;
}

export interface OrderDeliverable {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface OrderRevision {
  id: string;
  reason: string;
  description: string;
  requestedAt: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export interface OrderMessage {
  id: string;
  senderId: string;
  content: string;
  attachments: string[];
  timestamp: Date;
  isRead: boolean;
}

export interface GigCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: GigSubcategory[];
}

export interface GigSubcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
}

export interface GigAnalytics {
  gigId: string;
  period: 'day' | 'week' | 'month' | 'year';
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  date: Date;
}

export interface CreateGigData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  images: File[];
  videoUrl?: string;
  packages: Omit<GigPackage, 'id' | 'isActive'>[];
  extras: Omit<GigExtra, 'id' | 'isActive'>[];
  faq: Omit<GigFAQ, 'id'>[];
  requirements: string[];
  deliverables: string[];
  keywords: string[];
}
