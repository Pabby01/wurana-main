/**
 * Bid Service
 * Handles bidding system for job requests and gig orders
 */

import { apiClient, API_ENDPOINTS } from './api';
import { Bid } from '../types';

export interface CreateBidRequest {
  jobId: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  deliveryTime: number;
  proposal: string;
  attachments?: File[];
}

export interface UpdateBidRequest {
  amount?: number;
  currency?: 'SOL' | 'USDC';
  deliveryTime?: number;
  proposal?: string;
}

export interface BidFilters {
  status?: 'pending' | 'accepted' | 'rejected';
  jobId?: string;
  artisanId?: string;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: 'SOL' | 'USDC';
  page?: number;
  limit?: number;
}

export interface BidWithDetails extends Bid {
  job: {
    id: string;
    title: string;
    category: string;
    client: {
      id: string;
      displayName: string;
      avatar?: string;
      rating: number;
    };
  };
  artisan: {
    id: string;
    displayName: string;
    avatar?: string;
    rating: number;
    completedJobs: number;
  };
}

class BidService {
  /**
   * Create a new bid on a job
   */
  async createBid(bidData: CreateBidRequest): Promise<{ bidId: string }> {
    const formData = new FormData();

    // Add text fields
    Object.entries(bidData).forEach(([key, value]) => {
      if (key !== 'attachments') {
        formData.append(key, String(value));
      }
    });

    // Add attachment files if any
    if (bidData.attachments && bidData.attachments.length > 0) {
      bidData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    const response = await apiClient.post<{ bidId: string }>(
      API_ENDPOINTS.BIDS,
      formData
    );
    return response.data;
  }

  /**
   * Get bid by ID
   */
  async getBidById(bidId: string): Promise<BidWithDetails> {
    const response = await apiClient.get<BidWithDetails>(`${API_ENDPOINTS.BIDS}/${bidId}`);
    return response.data;
  }

  /**
   * Update an existing bid
   */
  async updateBid(bidId: string, updateData: UpdateBidRequest): Promise<Bid> {
    const response = await apiClient.put<Bid>(`${API_ENDPOINTS.BIDS}/${bidId}`, updateData);
    return response.data;
  }

  /**
   * Withdraw a bid
   */
  async withdrawBid(bidId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.BIDS}/${bidId}`);
  }

  /**
   * Get bids with filters
   */
  async getBids(filters?: BidFilters): Promise<{
    bids: BidWithDetails[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.BIDS}`, filters as unknown as Record<string, string | number | boolean | undefined | string[]>);
    return response.data as {
      bids: BidWithDetails[];
      total: number;
      hasMore: boolean;
    };
  }

  /**
   * Get bids for a specific job
   */
  async getJobBids(jobId: string, filters?: {
    status?: 'pending' | 'accepted' | 'rejected';
    sortBy?: 'amount' | 'created_at' | 'rating';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{
    bids: BidWithDetails[];
    total: number;
    hasMore: boolean;
    statistics: {
      averageAmount: number;
      medianAmount: number;
      totalBids: number;
      pendingBids: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/${jobId}/bids`, filters);
    return response.data as {
      bids: BidWithDetails[];
      total: number;
      hasMore: boolean;
      statistics: {
        averageAmount: number;
        medianAmount: number;
        totalBids: number;
        pendingBids: number;
      };
    };
  }

  /**
   * Get user's submitted bids
   */
  async getMyBids(filters?: {
    status?: 'pending' | 'accepted' | 'rejected';
    jobStatus?: 'open' | 'in_progress' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
  }): Promise<{
    bids: BidWithDetails[];
    total: number;
    hasMore: boolean;
    statistics: {
      totalSubmitted: number;
      acceptanceRate: number;
      averageAmount: number;
      totalWon: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.BIDS}/my-bids`, filters);
    return response.data as {
      bids: BidWithDetails[];
      total: number;
      hasMore: boolean;
      statistics: {
        totalSubmitted: number;
        acceptanceRate: number;
        averageAmount: number;
        totalWon: number;
      };
    };
  }

  /**
   * Accept a bid (for job owners)
   */
  async acceptBid(bidId: string): Promise<{
    success: boolean;
    contractId: string;
    escrowAddress?: string;
  }> {
    const response = await apiClient.post(`${API_ENDPOINTS.BIDS}/${bidId}/accept`);
    return response.data as {
      success: boolean;
      contractId: string;
      escrowAddress?: string;
    };
  }

  /**
   * Reject a bid (for job owners)
   */
  async rejectBid(bidId: string, reason?: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.BIDS}/${bidId}/reject`, { reason });
  }

  /**
   * Get bid statistics for artisan
   */
  async getBidStatistics(artisanId?: string): Promise<{
    totalBids: number;
    acceptedBids: number;
    rejectedBids: number;
    pendingBids: number;
    acceptanceRate: number;
    averageBidAmount: number;
    totalWinnings: number;
    bestPerformingCategory: string;
    bidTrends: Array<{
      date: string;
      bids: number;
      accepted: number;
    }>;
  }> {
    const endpoint = artisanId
      ? `${API_ENDPOINTS.USERS}/${artisanId}/bid-stats`
      : `${API_ENDPOINTS.BIDS}/my-stats`;

    const response = await apiClient.get(endpoint);
    return response.data as {
      totalBids: number;
      acceptedBids: number;
      rejectedBids: number;
      pendingBids: number;
      acceptanceRate: number;
      averageBidAmount: number;
      totalWinnings: number;
      bestPerformingCategory: string;
      bidTrends: Array<{
        date: string;
        bids: number;
        accepted: number;
      }>;
    };
  }

  /**
   * Get recommended bid amount for a job
   */
  async getRecommendedBidAmount(jobId: string): Promise<{
    recommendedAmount: number;
    currency: 'SOL' | 'USDC';
    reasoning: {
      averageBidAmount: number;
      competitiveRange: { min: number; max: number };
      factorsConsidered: string[];
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/${jobId}/recommended-bid`);
    return response.data as {
      recommendedAmount: number;
      currency: 'SOL' | 'USDC';
      reasoning: {
        averageBidAmount: number;
        competitiveRange: { min: number; max: number };
        factorsConsidered: string[];
      };
    };
  }

  /**
   * Get bid competition analysis
   */
  async getBidCompetition(jobId: string): Promise<{
    totalBids: number;
    averageAmount: number;
    priceDistribution: Array<{
      range: string;
      count: number;
    }>;
    topArtisans: Array<{
      id: string;
      displayName: string;
      rating: number;
      bidAmount: number;
    }>;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/${jobId}/bid-competition`);
    return response.data as {
      totalBids: number;
      averageAmount: number;
      priceDistribution: Array<{
        range: string;
        count: number;
      }>;
      topArtisans: Array<{
        id: string;
        displayName: string;
        rating: number;
        bidAmount: number;
      }>;
    };
  }

  /**
   * Send message to client (for bidders)
   */
  async sendBidMessage(bidId: string, message: string, attachments?: File[]): Promise<void> {
    const formData = new FormData();
    formData.append('message', message);

    if (attachments && attachments.length > 0) {
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    await apiClient.post(`${API_ENDPOINTS.BIDS}/${bidId}/message`, formData);
  }

  /**
   * Get bid conversation messages
   */
  async getBidMessages(bidId: string): Promise<Array<{
    id: string;
    senderId: string;
    content: string;
    attachments: string[];
    timestamp: string;
    isRead: boolean;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.BIDS}/${bidId}/messages`);
    return response.data as Array<{
      id: string;
      senderId: string;
      content: string;
      attachments: string[];
      timestamp: string;
      isRead: boolean;
    }>;
  }

  /**
   * Mark bid messages as read
   */
  async markBidMessagesAsRead(bidId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.BIDS}/${bidId}/messages/read`);
  }

  /**
   * Report inappropriate bid
   */
  async reportBid(bidId: string, reason: string, details?: string): Promise<{ reportId: string }> {
    const response = await apiClient.post<{ reportId: string }>(
      `${API_ENDPOINTS.BIDS}/${bidId}/report`,
      { reason, details }
    );
    return response.data;
  }

  /**
   * Get bid history for analytics
   */
  async getBidHistory(filters?: {
    period?: '7d' | '30d' | '90d' | '1y';
    category?: string;
    status?: 'pending' | 'accepted' | 'rejected';
  }): Promise<Array<{
    date: string;
    totalBids: number;
    acceptedBids: number;
    averageAmount: number;
    category: string;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.BIDS}/history`, filters);
    return response.data as Array<{
      date: string;
      totalBids: number;
      acceptedBids: number;
      averageAmount: number;
      category: string;
    }>;
  }
}

export const bidService = new BidService();
