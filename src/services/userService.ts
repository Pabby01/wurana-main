/**
 * User Service
 * Handles user profile management, KYC verification, and user-related operations
 */

import { apiClient, API_ENDPOINTS, ApiResponse } from './api';
import { User, UserProfile } from '../types';

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  skills?: string[];
  location?: {
    city: string;
    country: string;
    geohash: string;
  };
}

export interface KYCVerificationRequest {
  documentType: 'passport' | 'drivers_license' | 'national_id';
  documentNumber: string;
  documentImages: File[];
  selfieImage: File;
}

export interface UserSearchFilters {
  skills?: string[];
  location?: string;
  rating?: number;
  availability?: boolean;
  page?: number;
  limit?: number;
}

class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.PROFILE}`);
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.USERS}/${userId}`);
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(
      `${API_ENDPOINTS.PROFILE}`,
      profileData
    );
    return response.data;
  }

  /**
   * Upload profile avatar
   */
  async updateAvatar(avatarFile: File): Promise<string> {
    const response = await apiClient.upload<{ avatarUrl: string }>(
      `${API_ENDPOINTS.PROFILE}/avatar`,
      avatarFile
    );
    return response.data.avatarUrl;
  }

  /**
   * Submit KYC verification documents
   */
  async submitKYCVerification(kycData: KYCVerificationRequest): Promise<{ verificationId: string }> {
    const formData = new FormData();
    formData.append('documentType', kycData.documentType);
    formData.append('documentNumber', kycData.documentNumber);
    formData.append('selfieImage', kycData.selfieImage);
    
    kycData.documentImages.forEach((file, index) => {
      formData.append(`documentImage_${index}`, file);
    });

    const response = await apiClient.post<{ verificationId: string }>(
      `${API_ENDPOINTS.VERIFY_KYC}`,
      formData
    );
    return response.data;
  }

  /**
   * Get KYC verification status
   */
  async getKYCStatus(): Promise<{
    status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.VERIFY_KYC}/status`);
    return response.data;
  }

  /**
   * Search users with filters
   */
  async searchUsers(filters: UserSearchFilters): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/search`, filters);
    return response.data;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalJobs: number;
    completedJobs: number;
    successRate: number;
    averageRating: number;
    totalEarnings: number;
    responseTime: number;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}/stats`);
    return response.data;
  }

  /**
   * Get user's portfolio
   */
  async getUserPortfolio(userId: string): Promise<{
    items: any[];
    total: number;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}/portfolio`);
    return response.data;
  }

  /**
   * Add portfolio item
   */
  async addPortfolioItem(portfolioData: {
    title: string;
    description: string;
    category: string;
    image: File;
  }): Promise<{ itemId: string }> {
    const response = await apiClient.upload(
      `${API_ENDPOINTS.PROFILE}/portfolio`,
      portfolioData.image,
      {
        title: portfolioData.title,
        description: portfolioData.description,
        category: portfolioData.category,
      }
    );
    return response.data;
  }

  /**
   * Update portfolio item
   */
  async updatePortfolioItem(
    itemId: string,
    updateData: {
      title?: string;
      description?: string;
      category?: string;
      image?: File;
    }
  ): Promise<void> {
    if (updateData.image) {
      await apiClient.upload(
        `${API_ENDPOINTS.PROFILE}/portfolio/${itemId}`,
        updateData.image,
        {
          title: updateData.title,
          description: updateData.description,
          category: updateData.category,
        }
      );
    } else {
      await apiClient.put(`${API_ENDPOINTS.PROFILE}/portfolio/${itemId}`, updateData);
    }
  }

  /**
   * Delete portfolio item
   */
  async deletePortfolioItem(itemId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PROFILE}/portfolio/${itemId}`);
  }

  /**
   * Get user's NFT badges
   */
  async getUserBadges(userId: string): Promise<any[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}/badges`);
    return response.data;
  }

  /**
   * Update user availability status
   */
  async updateAvailability(isAvailable: boolean): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.PROFILE}/availability`, { 
      isAvailable 
    });
  }

  /**
   * Block/unblock user
   */
  async toggleUserBlock(userId: string, blocked: boolean): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.USERS}/${userId}/block`, { blocked });
  }

  /**
   * Report user
   */
  async reportUser(userId: string, reason: string, details?: string): Promise<{ reportId: string }> {
    const response = await apiClient.post(`${API_ENDPOINTS.USERS}/${userId}/report`, {
      reason,
      details,
    });
    return response.data;
  }

  /**
   * Get user's recent activity
   */
  async getUserActivity(userId: string, limit: number = 10): Promise<any[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${userId}/activity`, {
      limit,
    });
    return response.data;
  }
}

export const userService = new UserService();
