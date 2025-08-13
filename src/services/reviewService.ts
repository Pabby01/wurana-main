/**
 * Review Service
 * Handles review system, ratings, and feedback management
 */

import { apiClient, API_ENDPOINTS } from './api';
import { Review } from '../types';

export interface CreateReviewRequest {
  jobId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  categories?: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  isPublic?: boolean;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  categories?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    professionalism?: number;
  };
  isPublic?: boolean;
}

export interface ReviewFilters {
  userId?: string;
  jobId?: string;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  fromDate?: string;
  toDate?: string;
  isPublic?: boolean;
  sortBy?: 'created_at' | 'rating' | 'helpful_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReviewWithDetails extends Review {
  job: {
    id: string;
    title: string;
    category: string;
  };
  reviewer: {
    id: string;
    displayName: string;
    avatar?: string;
    isVerified: boolean;
  };
  reviewee: {
    id: string;
    displayName: string;
    avatar?: string;
    isVerified: boolean;
  };
  categories?: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  helpfulCount: number;
  isHelpful?: boolean;
  response?: {
    content: string;
    createdAt: string;
  };
  isPublic: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  recentTrend: 'improving' | 'declining' | 'stable';
  monthlyStats: Array<{
    month: string;
    averageRating: number;
    totalReviews: number;
  }>;
}

class ReviewService {
  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewRequest): Promise<{ reviewId: string }> {
    const response = await apiClient.post<{ reviewId: string }>(
      API_ENDPOINTS.REVIEWS,
      reviewData
    );
    return response.data;
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string): Promise<ReviewWithDetails> {
    const response = await apiClient.get<ReviewWithDetails>(
      `${API_ENDPOINTS.REVIEWS}/${reviewId}`
    );
    return response.data;
  }

  /**
   * Update an existing review
   */
  async updateReview(reviewId: string, updateData: UpdateReviewRequest): Promise<ReviewWithDetails> {
    const response = await apiClient.put<ReviewWithDetails>(
      `${API_ENDPOINTS.REVIEWS}/${reviewId}`,
      updateData
    );
    return response.data;
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.REVIEWS}/${reviewId}`);
  }

  /**
   * Get reviews with filters
   */
  async getReviews(filters?: ReviewFilters): Promise<{
    reviews: ReviewWithDetails[];
    total: number;
    hasMore: boolean;
    statistics: {
      averageRating: number;
      totalCount: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.REVIEWS}`, filters);
    return response.data;
  }

  /**
   * Get reviews for a specific user
   */
  async getUserReviews(userId: string, filters?: {
    type?: 'received' | 'given' | 'all';
    rating?: number;
    minRating?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    reviews: ReviewWithDetails[];
    total: number;
    hasMore: boolean;
    statistics: ReviewStatistics;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}/reviews`, filters);
    return response.data;
  }

  /**
   * Get reviews for a specific job
   */
  async getJobReviews(jobId: string): Promise<{
    clientReview?: ReviewWithDetails;
    artisanReview?: ReviewWithDetails;
    canReview: {
      asClient: boolean;
      asArtisan: boolean;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/${jobId}/reviews`);
    return response.data;
  }

  /**
   * Get user's review statistics
   */
  async getUserReviewStatistics(userId: string): Promise<ReviewStatistics> {
    const response = await apiClient.get<ReviewStatistics>(
      `${API_ENDPOINTS.USERS}/${userId}/review-stats`
    );
    return response.data;
  }

  /**
   * Mark review as helpful/not helpful
   */
  async markReviewHelpful(reviewId: string, isHelpful: boolean): Promise<{
    helpfulCount: number;
  }> {
    const response = await apiClient.post<{ helpfulCount: number }>(
      `${API_ENDPOINTS.REVIEWS}/${reviewId}/helpful`,
      { isHelpful }
    );
    return response.data;
  }

  /**
   * Respond to a review (for reviewees)
   */
  async respondToReview(reviewId: string, response: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.REVIEWS}/${reviewId}/response`, {
      response,
    });
  }

  /**
   * Update review response
   */
  async updateReviewResponse(reviewId: string, response: string): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.REVIEWS}/${reviewId}/response`, {
      response,
    });
  }

  /**
   * Delete review response
   */
  async deleteReviewResponse(reviewId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.REVIEWS}/${reviewId}/response`);
  }

  /**
   * Report a review
   */
  async reportReview(reviewId: string, reason: string, details?: string): Promise<{ reportId: string }> {
    const response = await apiClient.post<{ reportId: string }>(
      `${API_ENDPOINTS.REVIEWS}/${reviewId}/report`,
      { reason, details }
    );
    return response.data;
  }

  /**
   * Get pending reviews for current user
   */
  async getPendingReviews(): Promise<Array<{
    jobId: string;
    jobTitle: string;
    otherParty: {
      id: string;
      displayName: string;
      avatar?: string;
    };
    completedAt: string;
    daysRemaining: number;
    type: 'client' | 'artisan';
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.REVIEWS}/pending`);
    return response.data;
  }

  /**
   * Get review templates/suggestions
   */
  async getReviewTemplates(category?: string, rating?: number): Promise<Array<{
    category: string;
    rating: number;
    templates: string[];
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.REVIEWS}/templates`, {
      category,
      rating,
    });
    return response.data;
  }

  /**
   * Get review insights for user
   */
  async getReviewInsights(userId?: string): Promise<{
    strengths: string[];
    areasForImprovement: string[];
    commonKeywords: Array<{
      word: string;
      frequency: number;
      sentiment: 'positive' | 'negative' | 'neutral';
    }>;
    trendAnalysis: {
      ratingTrend: 'improving' | 'declining' | 'stable';
      trendDescription: string;
      recommendations: string[];
    };
    competitorComparison?: {
      averageRating: number;
      yourRating: number;
      positionInCategory: number;
      totalInCategory: number;
    };
  }> {
    const endpoint = userId
      ? `${API_ENDPOINTS.USERS}/${userId}/review-insights`
      : `${API_ENDPOINTS.REVIEWS}/my-insights`;
      
    const response = await apiClient.get(endpoint);
    return response.data;
  }

  /**
   * Export reviews data
   */
  async exportReviews(filters?: ReviewFilters, format: 'json' | 'csv' = 'json'): Promise<{
    downloadUrl: string;
    filename: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
    }>(`${API_ENDPOINTS.REVIEWS}/export`, {
      ...filters,
      format,
    });
    return response.data;
  }

  /**
   * Get review reminder settings
   */
  async getReviewReminderSettings(): Promise<{
    enabled: boolean;
    reminderDays: number[];
    emailEnabled: boolean;
    pushEnabled: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.REVIEWS}/reminder-settings`);
    return response.data;
  }

  /**
   * Update review reminder settings
   */
  async updateReviewReminderSettings(settings: {
    enabled?: boolean;
    reminderDays?: number[];
    emailEnabled?: boolean;
    pushEnabled?: boolean;
  }): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.REVIEWS}/reminder-settings`, settings);
  }

  /**
   * Get badge eligibility based on reviews
   */
  async getBadgeEligibility(userId?: string): Promise<Array<{
    badgeType: string;
    badgeName: string;
    description: string;
    eligible: boolean;
    progress: {
      current: number;
      required: number;
      percentage: number;
    };
    requirements: string[];
  }>> {
    const endpoint = userId
      ? `${API_ENDPOINTS.USERS}/${userId}/badge-eligibility`
      : `${API_ENDPOINTS.REVIEWS}/badge-eligibility`;
      
    const response = await apiClient.get(endpoint);
    return response.data;
  }

  /**
   * Get review quality score
   */
  async getReviewQualityScore(reviewId: string): Promise<{
    score: number;
    factors: {
      length: number;
      specificity: number;
      helpfulness: number;
      constructiveness: number;
    };
    suggestions: string[];
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.REVIEWS}/${reviewId}/quality-score`);
    return response.data;
  }
}

export const reviewService = new ReviewService();
