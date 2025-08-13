/**
 * Base API Client Service
 * Provides centralized HTTP client with authentication, error handling, and retry logic
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  statusCode: number;
}

// Gig-related interfaces
export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface GigFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryTime?: number;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'deliveryTime' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class ApiClient {
  private config: ApiConfig;
  private authToken: string | null = null;

  constructor(config?: Partial<ApiConfig>) {
    this.config = {
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * Set authentication token for requests
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build headers for requests
   */
  private buildHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: unknown;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const error: ApiError = {
      code: (errorData as { code?: string })?.code || 'API_ERROR',
      message: (errorData as { message?: string })?.message || 'An error occurred',
      details: (errorData as { details?: unknown })?.details,
      statusCode: response.status,
    };

    throw error;
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (attempt >= this.config.retryAttempts || apiError.statusCode < 500) {
        throw error;
      }

      await new Promise(resolve => 
        setTimeout(resolve, this.config.retryDelay * attempt)
      );

      return this.retryRequest(requestFn, attempt + 1);
    }
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: this.buildHeaders(options.headers as Record<string, string>),
      signal: AbortSignal.timeout(this.config.timeout),
    };

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        await this.handleError(response);
      }

      return response.json();
    };

    return this.retryRequest(makeRequest);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    )}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  /**
   * Fetch gigs with optional filters
   */
  async fetchGigs(filters?: GigFilters): Promise<ApiResponse<{ gigs: Gig[]; total: number; page: number; totalPages: number }>> {
    const params: Record<string, string | number | boolean> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }

    return this.get<{ gigs: Gig[]; total: number; page: number; totalPages: number }>(
      API_ENDPOINTS.GIGS,
      params
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export the fetchGigs function for direct use
export const fetchGigs = (filters?: GigFilters) => apiClient.fetchGigs(filters);

// Environment-based configuration
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  PROFILE: '/users/profile',
  VERIFY_KYC: '/users/kyc/verify',
  
  // Gigs
  GIGS: '/gigs',
  GIG_CATEGORIES: '/gigs/categories',
  
  // Bids
  BIDS: '/bids',
  
  // Jobs
  JOBS: '/jobs',
  
  // Wallet
  WALLET: '/wallet',
  TRANSACTIONS: '/wallet/transactions',
  
  // Chat
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: '/chat/messages',
  
  // Reviews
  REVIEWS: '/reviews',
  
  // Upload
  UPLOAD: '/upload',
  
  // Real-time
  WEBSOCKET: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];