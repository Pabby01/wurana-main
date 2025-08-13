export interface User {
  id: string;
  email: string;
  walletAddress: string;
  profile: UserProfile;
  isVerified: boolean;
  createdAt: Date;
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  bio: string;
  skills: string[];
  location: {
    city: string;
    country: string;
    geohash: string;
  };
  portfolio: PortfolioItem[];
  rating: number;
  completedJobs: number;
  badges: NFTBadge[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ipfsHash: string;
  category: string;
}

export interface ServiceListing {
  id: string;
  artisanId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priceModel: 'fixed' | 'hourly';
  price: number;
  currency: 'SOL' | 'USDC';
  deliveryTime: number;
  location: {
    city: string;
    country: string;
    geohash: string;
  };
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface JobRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: 'SOL' | 'USDC';
  };
  deadline: Date;
  location?: {
    city: string;
    country: string;
    geohash: string;
  };
  requirements: string[];
  attachments: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  bids: Bid[];
  createdAt: Date;
}

export interface Bid {
  id: string;
  artisanId: string;
  jobId: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  deliveryTime: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface EscrowContract {
  id: string;
  jobId: string;
  clientId: string;
  artisanId: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  status: 'locked' | 'released' | 'disputed';
  createdAt: Date;
  releasedAt?: Date;
}

export interface NFTBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  mintAddress: string;
  earnedAt: Date;
  category: 'quality' | 'reliability' | 'communication' | 'milestone';
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  timestamp: Date;
  isRead: boolean;
  attachments?: MessageAttachment[];
  replyTo?: string;
  reactions?: MessageReaction[];
  isEdited?: boolean;
  editedAt?: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
  title?: string;
  type: 'direct' | 'project' | 'group';
  projectId?: string;
  isArchived: boolean;
  isPinned: boolean;
  unreadCount: number;
  metadata?: {
    avatar?: string;
    description?: string;
  };
}

export interface JobPosting {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  budget: {
    min: number;
    max: number;
    currency: 'SOL' | 'USDC';
    type: 'fixed' | 'hourly';
  };
  timeline: {
    duration: number;
    unit: 'days' | 'weeks' | 'months';
    startDate?: Date;
    deadline?: Date;
  };
  location: {
    type: 'remote' | 'onsite' | 'hybrid';
    city?: string;
    country?: string;
    geohash?: string;
  };
  requirements: string[];
  skills: string[];
  qualifications: string[];
  attachments: JobAttachment[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibility: 'public' | 'private' | 'invited_only';
  bids: Bid[];
  savedBy: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface JobAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface BidProposal {
  content: string;
  timeline: {
    duration: number;
    unit: 'days' | 'weeks' | 'months';
    milestones?: Milestone[];
  };
  attachments: JobAttachment[];
  questions?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface EnhancedBid extends Bid {
  proposal: BidProposal;
  freelancerProfile: {
    displayName: string;
    avatar?: string;
    rating: number;
    completedJobs: number;
    skills: string[];
    location?: string;
  };
  isShortlisted: boolean;
  feedback?: string;
  negotiationHistory?: BidNegotiation[];
}

export interface BidNegotiation {
  id: string;
  bidId: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  proposedChanges?: {
    amount?: number;
    timeline?: number;
    terms?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

export interface JobFilter {
  categories?: string[];
  budgetRange?: {
    min: number;
    max: number;
    currency: 'SOL' | 'USDC';
  };
  location?: {
    type: 'remote' | 'onsite' | 'hybrid';
    countries?: string[];
  };
  timeline?: {
    min: number;
    max: number;
    unit: 'days' | 'weeks' | 'months';
  };
  skills?: string[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  sortBy?: 'newest' | 'oldest' | 'budget_high' | 'budget_low' | 'deadline';
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'project' | 'support' | 'general';
  projectId?: string;
  participants: ChatParticipant[];
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  settings: {
    allowFileSharing: boolean;
    allowVoiceMessages: boolean;
    maxFileSize: number;
    notificationsEnabled: boolean;
  };
}

export interface ChatParticipant {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  lastSeenAt: Date;
  isOnline: boolean;
  isTyping: boolean;
  permissions: {
    canSendMessages: boolean;
    canSendFiles: boolean;
    canDeleteMessages: boolean;
    canInviteUsers: boolean;
  };
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  timestamp: Date;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}

// Re-export gig types
export * from './gig';