/**
 * Job Service
 * Handles job request CRUD operations and job-related functionality
 */

import { apiClient, API_ENDPOINTS } from './api';
import { JobRequest, Bid } from '../types';

export interface CreateJobRequest {
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: 'SOL' | 'USDC';
  };
  deadline: string; // ISO date string
  location?: {
    city: string;
    country: string;
    geohash: string;
  };
  requirements: string[];
  attachments?: File[];
  isRemote?: boolean;
  skills?: string[];
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  category?: string;
  budget?: {
    min: number;
    max: number;
    currency: 'SOL' | 'USDC';
  };
  deadline?: string;
  location?: {
    city: string;
    country: string;
    geohash: string;
  };
  requirements?: string[];
  isRemote?: boolean;
  skills?: string[];
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
}

export interface JobFilters {
  category?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: 'SOL' | 'USDC';
  location?: string;
  isRemote?: boolean;
  skills?: string[];
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  datePosted?: '24h' | '7d' | '30d';
  sortBy?: 'created_at' | 'deadline' | 'budget' | 'bids_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface JobWithDetails extends JobRequest {
  client: {
    id: string;
    displayName: string;
    avatar?: string;
    rating: number;
    completedJobs: number;
    isVerified: boolean;
  };
  bidsCount: number;
  averageBidAmount?: number;
  isBookmarked: boolean;
  canEdit: boolean;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
  };
}

class JobService {
  /**
   * Get all jobs with optional filters
   */
  async getJobs(filters?: JobFilters): Promise<{
    jobs: JobWithDetails[];
    total: number;
    hasMore: boolean;
    filters: {
      categories: string[];
      budgetRanges: Array<{ label: string; min: number; max: number }>;
      locations: string[];
      skills: string[];
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}`, filters);
    return response.data;
  }

  /**
   * Get job by ID
   */
  async getJobById(jobId: string): Promise<JobWithDetails> {
    const response = await apiClient.get<JobWithDetails>(`${API_ENDPOINTS.JOBS}/${jobId}`);
    return response.data;
  }

  /**
   * Create new job
   */
  async createJob(jobData: CreateJobRequest): Promise<{ jobId: string }> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(jobData).forEach(([key, value]) => {
      if (key !== 'attachments' && key !== 'budget' && key !== 'location' && key !== 'requirements' && key !== 'skills') {
        formData.append(key, String(value));
      }
    });

    // Add complex objects as JSON strings
    formData.append('budget', JSON.stringify(jobData.budget));
    if (jobData.location) {
      formData.append('location', JSON.stringify(jobData.location));
    }
    formData.append('requirements', JSON.stringify(jobData.requirements));
    if (jobData.skills) {
      formData.append('skills', JSON.stringify(jobData.skills));
    }

    // Add attachment files
    if (jobData.attachments && jobData.attachments.length > 0) {
      jobData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    const response = await apiClient.post<{ jobId: string }>(
      API_ENDPOINTS.JOBS,
      formData
    );
    return response.data;
  }

  /**
   * Update existing job
   */
  async updateJob(jobId: string, updateData: UpdateJobRequest): Promise<JobWithDetails> {
    const response = await apiClient.put<JobWithDetails>(
      `${API_ENDPOINTS.JOBS}/${jobId}`,
      updateData
    );
    return response.data;
  }

  /**
   * Delete job
   */
  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.JOBS}/${jobId}`);
  }

  /**
   * Get user's posted jobs
   */
  async getMyPostedJobs(filters?: {
    status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
  }): Promise<{
    jobs: JobWithDetails[];
    total: number;
    hasMore: boolean;
    statistics: {
      totalPosted: number;
      activeJobs: number;
      completedJobs: number;
      totalSpent: number;
      averageCompletionTime: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/my-posted-jobs`, filters);
    return response.data;
  }

  /**
   * Get jobs user has bid on
   */
  async getMyBiddingJobs(filters?: {
    bidStatus?: 'pending' | 'accepted' | 'rejected';
    jobStatus?: 'open' | 'in_progress' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
  }): Promise<{
    jobs: Array<JobWithDetails & {
      myBid: Bid;
    }>;
    total: number;
    hasMore: boolean;
    statistics: {
      totalBids: number;
      acceptanceRate: number;
      averageBidAmount: number;
      wonJobs: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/my-bidding-jobs`, filters);
    return response.data;
  }

  /**
   * Get featured jobs
   */
  async getFeaturedJobs(limit: number = 10): Promise<JobWithDetails[]> {
    const response = await apiClient.get<JobWithDetails[]>(
      `${API_ENDPOINTS.JOBS}/featured`,
      { limit }
    );
    return response.data;
  }

  /**
   * Get recent jobs
   */
  async getRecentJobs(limit: number = 10): Promise<JobWithDetails[]> {
    const response = await apiClient.get<JobWithDetails[]>(
      `${API_ENDPOINTS.JOBS}/recent`,
      { limit }
    );
    return response.data;
  }

  /**
   * Search jobs by text
   */
  async searchJobs(query: string, filters?: JobFilters): Promise<{
    jobs: JobWithDetails[];
    total: number;
    hasMore: boolean;
    suggestions: string[];
    relatedSkills: string[];
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/search`, {
      q: query,
      ...filters,
    });
    return response.data;
  }

  /**
   * Get similar jobs
   */
  async getSimilarJobs(jobId: string, limit: number = 5): Promise<JobWithDetails[]> {
    const response = await apiClient.get<JobWithDetails[]>(
      `${API_ENDPOINTS.JOBS}/${jobId}/similar`,
      { limit }
    );
    return response.data;
  }

  /**
   * Award job to winning bidder
   */
  async awardJob(jobId: string, bidId: string): Promise<{
    success: boolean;
    contractId: string;
    escrowAddress?: string;
  }> {
    const response = await apiClient.post(`${API_ENDPOINTS.JOBS}/${jobId}/award`, {
      bidId,
    });
    return response.data;
  }

  /**
   * Mark job as completed
   */
  async completeJob(jobId: string, deliverables?: File[]): Promise<{
    success: boolean;
    completedAt: string;
  }> {
    const formData = new FormData();
    
    if (deliverables && deliverables.length > 0) {
      deliverables.forEach((file, index) => {
        formData.append(`deliverable_${index}`, file);
      });
    }

    const response = await apiClient.post(`${API_ENDPOINTS.JOBS}/${jobId}/complete`, formData);
    return response.data;
  }

  /**
   * Cancel job
   */
  async cancelJob(jobId: string, reason: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.JOBS}/${jobId}/cancel`, { reason });
  }

  /**
   * Extend job deadline
   */
  async extendDeadline(jobId: string, newDeadline: string, reason?: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.JOBS}/${jobId}/extend-deadline`, {
      newDeadline,
      reason,
    });
  }

  /**
   * Bookmark/unbookmark job
   */
  async toggleJobBookmark(jobId: string, bookmarked: boolean): Promise<void> {
    if (bookmarked) {
      await apiClient.post(`${API_ENDPOINTS.JOBS}/${jobId}/bookmark`);
    } else {
      await apiClient.delete(`${API_ENDPOINTS.JOBS}/${jobId}/bookmark`);
    }
  }

  /**
   * Get bookmarked jobs
   */
  async getBookmarkedJobs(): Promise<JobWithDetails[]> {
    const response = await apiClient.get<JobWithDetails[]>(`${API_ENDPOINTS.JOBS}/bookmarked`);
    return response.data;
  }

  /**
   * Report job
   */
  async reportJob(jobId: string, reason: string, details?: string): Promise<{ reportId: string }> {
    const response = await apiClient.post<{ reportId: string }>(
      `${API_ENDPOINTS.JOBS}/${jobId}/report`,
      { reason, details }
    );
    return response.data;
  }

  /**
   * Get job categories
   */
  async getJobCategories(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    jobCount: number;
    averageBudget: number;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/categories`);
    return response.data;
  }

  /**
   * Get trending job categories
   */
  async getTrendingCategories(period: '24h' | '7d' | '30d' = '7d'): Promise<Array<{
    category: string;
    jobCount: number;
    growth: number;
    averageBudget: number;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/trending-categories`, { period });
    return response.data;
  }

  /**
   * Get job statistics
   */
  async getJobStatistics(filters?: {
    period?: '24h' | '7d' | '30d' | '90d';
    category?: string;
    userId?: string;
  }): Promise<{
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    cancelledJobs: number;
    averageBudget: number;
    averageCompletionTime: number;
    topCategories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
    budgetDistribution: Array<{
      range: string;
      count: number;
    }>;
    timeStats: Array<{
      date: string;
      jobsPosted: number;
      jobsCompleted: number;
    }>;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/statistics`, filters);
    return response.data;
  }

  /**
   * Get job recommendations for artisan
   */
  async getRecommendedJobs(limit: number = 10): Promise<{
    jobs: JobWithDetails[];
    reasoning: Array<{
      jobId: string;
      reasons: string[];
      matchScore: number;
    }>;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/recommendations`, { limit });
    return response.data;
  }

  /**
   * Get job alerts/notifications
   */
  async getJobAlerts(): Promise<Array<{
    id: string;
    query: string;
    filters: JobFilters;
    frequency: 'realtime' | 'daily' | 'weekly';
    isActive: boolean;
    createdAt: string;
    lastTriggered?: string;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/alerts`);
    return response.data;
  }

  /**
   * Create job alert
   */
  async createJobAlert(alertData: {
    query?: string;
    filters: JobFilters;
    frequency: 'realtime' | 'daily' | 'weekly';
  }): Promise<{ alertId: string }> {
    const response = await apiClient.post<{ alertId: string }>(
      `${API_ENDPOINTS.JOBS}/alerts`,
      alertData
    );
    return response.data;
  }

  /**
   * Update job alert
   */
  async updateJobAlert(alertId: string, updateData: {
    query?: string;
    filters?: JobFilters;
    frequency?: 'realtime' | 'daily' | 'weekly';
    isActive?: boolean;
  }): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.JOBS}/alerts/${alertId}`, updateData);
  }

  /**
   * Delete job alert
   */
  async deleteJobAlert(alertId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.JOBS}/alerts/${alertId}`);
  }

  /**
   * Get job performance analytics (for job posters)
   */
  async getJobPerformance(jobId: string): Promise<{
    views: number;
    applications: number;
    clickThroughRate: number;
    applicationRate: number;
    averageBidAmount: number;
    topSkillsRequired: string[];
    timeToFirstBid: number;
    bidQualityScore: number;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/${jobId}/performance`);
    return response.data;
  }

  /**
   * Get job completion milestones
   */
  async getJobMilestones(jobId: string): Promise<Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'approved';
    deliverables: string[];
    createdAt: string;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.JOBS}/${jobId}/milestones`);
    return response.data;
  }

  /**
   * Create job milestone
   */
  async createMilestone(jobId: string, milestoneData: {
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    deliverables: string[];
  }): Promise<{ milestoneId: string }> {
    const response = await apiClient.post<{ milestoneId: string }>(
      `${API_ENDPOINTS.JOBS}/${jobId}/milestones`,
      milestoneData
    );
    return response.data;
  }

  /**
   * Update milestone status
   */
  async updateMilestoneStatus(
    jobId: string,
    milestoneId: string,
    status: 'in_progress' | 'completed' | 'approved'
  ): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.JOBS}/${jobId}/milestones/${milestoneId}`, {
      status,
    });
  }
}

export const jobService = new JobService();
