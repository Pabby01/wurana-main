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
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  updatedAt: Date;
}