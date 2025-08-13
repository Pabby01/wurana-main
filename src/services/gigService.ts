/**
 * Gig Service
 * Handles gig/service listing CRUD operations and gig-related functionality
 */

import { apiClient, API_ENDPOINTS } from './api';
import { ServiceListing } from '../types';

export interface CreateGigRequest {
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
  images: File[];
  tags: string[];
}

export interface UpdateGigRequest {
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  priceModel?: 'fixed' | 'hourly';
  price?: number;
  currency?: 'SOL' | 'USDC';
  deliveryTime?: number;
  location?: {
    city: string;
    country: string;
    geohash: string;
  };
  tags?: string[];
  isActive?: boolean;
}

export interface GigSearchFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: 'SOL' | 'USDC';
  location?: string;
  deliveryTime?: number;
  tags?: string[];
  rating?: number;
  sortBy?: 'price' | 'rating' | 'created_at' | 'delivery_time';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GigCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: GigSubcategory[];
}

export interface GigSubcategory {
  id: string;
  name: string;
  description: string;
}

class GigService {
  /**
   * Get all gigs with optional filters
   */
  async getGigs(filters?: GigSearchFilters): Promise<{
    gigs: ServiceListing[];
    total: number;
    hasMore: boolean;
    filters: {
      categories: string[];
      priceRange: { min: number; max: number };
      locations: string[];
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.GIGS}`, filters);
    return response.data;
  }

  /**
   * Get gig by ID
   */
  async getGigById(gigId: string): Promise<ServiceListing & {
    artisan: {
      id: string;
      displayName: string;
      avatar?: string;
      rating: number;
      completedJobs: number;
      responseTime: number;
    };
    reviews: {
      average: number;
      count: number;
      recent: any[];
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.GIGS}/${gigId}`);
    return response.data;
  }

  /**
   * Create new gig
   */
  async createGig(gigData: CreateGigRequest): Promise<{ gigId: string }> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(gigData).forEach(([key, value]) => {
      if (key !== 'images' && key !== 'location' && key !== 'tags') {
        formData.append(key, String(value));
      }
    });

    // Add location as JSON string
    formData.append('location', JSON.stringify(gigData.location));
    
    // Add tags as JSON array
    formData.append('tags', JSON.stringify(gigData.tags));

    // Add image files
    gigData.images.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });

    const response = await apiClient.post<{ gigId: string }>(
      API_ENDPOINTS.GIGS,
      formData
    );
    return response.data;
  }

  /**
   * Update existing gig
   */
  async updateGig(gigId: string, updateData: UpdateGigRequest): Promise<ServiceListing> {
    const response = await apiClient.put<ServiceListing>(
      `${API_ENDPOINTS.GIGS}/${gigId}`,
      updateData
    );
    return response.data;
  }

  /**
   * Delete gig
   */
  async deleteGig(gigId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.GIGS}/${gigId}`);
  }

  /**
   * Toggle gig active status
   */
  async toggleGigStatus(gigId: string, isActive: boolean): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.GIGS}/${gigId}/status`, { isActive });
  }

  /**
   * Upload additional gig images
   */
  async uploadGigImages(gigId: string, images: File[]): Promise<string[]> {
    const formData = new FormData();
    images.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });

    const response = await apiClient.post<{ imageUrls: string[] }>(
      `${API_ENDPOINTS.GIGS}/${gigId}/images`,
      formData
    );
    return response.data.imageUrls;
  }

  /**
   * Remove gig image
   */
  async removeGigImage(gigId: string, imageUrl: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.GIGS}/${gigId}/images`, {
      body: JSON.stringify({ imageUrl }),
    });
  }

  /**
   * Get user's gigs
   */
  async getUserGigs(userId?: string, filters?: {
    status?: 'active' | 'inactive' | 'all';
    page?: number;
    limit?: number;
  }): Promise<{
    gigs: ServiceListing[];
    total: number;
    hasMore: boolean;
  }> {
    const endpoint = userId 
      ? `${API_ENDPOINTS.USERS}/${userId}/gigs`
      : `${API_ENDPOINTS.GIGS}/my-gigs`;
      
    const response = await apiClient.get(endpoint, filters);
    return response.data;
  }

  /**
   * Get gig categories
   */
  async getCategories(): Promise<GigCategory[]> {
    const response = await apiClient.get<GigCategory[]>(API_ENDPOINTS.GIG_CATEGORIES);
    return response.data;
  }

  /**
   * Get featured gigs
   */
  async getFeaturedGigs(limit: number = 10): Promise<ServiceListing[]> {
    const response = await apiClient.get<ServiceListing[]>(
      `${API_ENDPOINTS.GIGS}/featured`,
      { limit }
    );
    return response.data;
  }

  /**
   * Get similar gigs
   */
  async getSimilarGigs(gigId: string, limit: number = 5): Promise<ServiceListing[]> {
    const response = await apiClient.get<ServiceListing[]>(
      `${API_ENDPOINTS.GIGS}/${gigId}/similar`,
      { limit }
    );
    return response.data;
  }

  /**
   * Get gig analytics (for gig owners)
   */
  async getGigAnalytics(gigId: string): Promise<{
    views: number;
    impressions: number;
    clickThroughRate: number;
    orderConversionRate: number;
    dailyStats: Array<{
      date: string;
      views: number;
      orders: number;
    }>;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.GIGS}/${gigId}/analytics`);
    return response.data;
  }

  /**
   * Report gig
   */
  async reportGig(gigId: string, reason: string, details?: string): Promise<{ reportId: string }> {
    const response = await apiClient.post<{ reportId: string }>(
      `${API_ENDPOINTS.GIGS}/${gigId}/report`,
      { reason, details }
    );
    return response.data;
  }

  /**
   * Save/unsave gig to favorites
   */
  async toggleGigFavorite(gigId: string, isFavorited: boolean): Promise<void> {
    if (isFavorited) {
      await apiClient.post(`${API_ENDPOINTS.GIGS}/${gigId}/favorite`);
    } else {
      await apiClient.delete(`${API_ENDPOINTS.GIGS}/${gigId}/favorite`);
    }
  }

  /**
   * Get user's favorite gigs
   */
  async getFavoriteGigs(): Promise<ServiceListing[]> {
    const response = await apiClient.get<ServiceListing[]>(`${API_ENDPOINTS.GIGS}/favorites`);
    return response.data;
  }

  /**
   * Get trending gigs
   */
  async getTrendingGigs(period: '24h' | '7d' | '30d' = '7d', limit: number = 10): Promise<ServiceListing[]> {
    const response = await apiClient.get<ServiceListing[]>(
      `${API_ENDPOINTS.GIGS}/trending`,
      { period, limit }
    );
    return response.data;
  }

  /**
   * Search gigs by text
   */
  async searchGigs(query: string, filters?: GigSearchFilters): Promise<{
    gigs: ServiceListing[];
    total: number;
    hasMore: boolean;
    suggestions: string[];
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.GIGS}/search`, {
      q: query,
      ...filters,
    });
    return response.data;
  }
}

export const gigService = new GigService();
