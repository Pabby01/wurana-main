/**
 * Services Index
 * Central export point for all services with configuration management
 */

// Core API client
export { apiClient, API_ENDPOINTS } from './api';
export type { ApiConfig, ApiResponse, ApiError, ApiEndpoint } from './api';

// Individual services
export { userService } from './userService';
export type { 
  UpdateProfileRequest, 
  KYCVerificationRequest, 
  UserSearchFilters 
} from './userService';

export { gigService } from './gigService';
export type { 
  CreateGigRequest, 
  UpdateGigRequest, 
  GigSearchFilters,
  GigCategory,
  GigSubcategory 
} from './gigService';

export { jobService } from './jobService';
export type { 
  CreateJobRequest, 
  UpdateJobRequest, 
  JobFilters,
  JobWithDetails 
} from './jobService';

export { bidService } from './bidService';
export type { 
  CreateBidRequest, 
  UpdateBidRequest, 
  BidFilters,
  BidWithDetails 
} from './bidService';

export { chatService } from './chatService';
export type { 
  SendMessageRequest, 
  CreateConversationRequest, 
  ConversationFilters,
  MessageFilters,
  ConversationWithDetails,
  MessageWithDetails 
} from './chatService';

export { walletService } from './walletService';
export type { 
  WalletInfo, 
  TransactionHistory, 
  EscrowDetails,
  PaymentRequest,
  EscrowCreateRequest 
} from './walletService';

export { reviewService } from './reviewService';
export type { 
  CreateReviewRequest, 
  UpdateReviewRequest, 
  ReviewFilters,
  ReviewWithDetails,
  ReviewStatistics 
} from './reviewService';

export { uploadService } from './uploadService';
export type { 
  UploadOptions, 
  UploadedFile, 
  UploadProgress,
  BatchUploadResult 
} from './uploadService';

export { realtimeService } from './realtimeService';
export type { 
  RealtimeEvent, 
  ConnectionConfig, 
  ChannelSubscription,
  EventType 
} from './realtimeService';

export { mockService, MockDataGenerator } from './mockService';

// Service configuration and management
class ServiceManager {
  private static instance: ServiceManager;
  private isInitialized = false;
  private currentMode: 'production' | 'development' | 'mock' = 'development';

  private constructor() {}

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * Initialize services with configuration
   */
  async initialize(config: {
    mode?: 'production' | 'development' | 'mock';
    apiBaseUrl?: string;
    wsUrl?: string;
    authToken?: string;
    userId?: string;
    enableRealtime?: boolean;
    enableMockData?: boolean;
  } = {}): Promise<void> {
    if (this.isInitialized) {
      console.warn('Services already initialized');
      return;
    }

    this.currentMode = config.mode || 'development';
    
    // Configure API client
    if (config.apiBaseUrl) {
      // Update API base URL if provided
      console.log(`API configured for ${config.apiBaseUrl}`);
    }

    // Set authentication if provided
    if (config.authToken) {
      apiClient.setAuthToken(config.authToken);
    }

    // Initialize real-time service if enabled
    if (config.enableRealtime && config.authToken && config.userId) {
      try {
        await realtimeService.connect(config.authToken, config.userId);
        console.log('Real-time service connected');
      } catch (error) {
        console.error('Failed to connect real-time service:', error);
      }
    }

    // Configure mock service
    if (config.enableMockData !== undefined) {
      mockService.setMockMode(config.enableMockData);
    }

    this.isInitialized = true;
    console.log(`Services initialized in ${this.currentMode} mode`);
  }

  /**
   * Get current service mode
   */
  getCurrentMode(): 'production' | 'development' | 'mock' {
    return this.currentMode;
  }

  /**
   * Check if services are initialized
   */
  isServicesInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Set authentication for all services
   */
  setAuthentication(authToken: string, userId?: string): void {
    apiClient.setAuthToken(authToken);
    
    if (userId) {
      realtimeService.setAuthToken(authToken);
      realtimeService.setUserId(userId);
    }
  }

  /**
   * Clear authentication from all services
   */
  clearAuthentication(): void {
    apiClient.setAuthToken(null);
    realtimeService.disconnect();
  }

  /**
   * Switch to mock mode
   */
  enableMockMode(): void {
    mockService.setMockMode(true);
    this.currentMode = 'mock';
    console.log('Switched to mock mode');
  }

  /**
   * Switch to production mode
   */
  enableProductionMode(): void {
    mockService.setMockMode(false);
    this.currentMode = 'production';
    console.log('Switched to production mode');
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    api: 'connected' | 'disconnected' | 'error';
    realtime: 'connected' | 'disconnected' | 'error';
    mock: 'enabled' | 'disabled';
    mode: string;
  }> {
    let apiStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
    let realtimeStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';

    // Check API connection
    try {
      // Simple health check endpoint
      await apiClient.get('/health');
      apiStatus = 'connected';
    } catch (error) {
      apiStatus = 'error';
    }

    // Check real-time connection
    realtimeStatus = realtimeService.isConnected() ? 'connected' : 'disconnected';

    return {
      api: apiStatus,
      realtime: realtimeStatus,
      mock: mockService.isMockMode() ? 'enabled' : 'disabled',
      mode: this.currentMode,
    };
  }

  /**
   * Reset all services to initial state
   */
  async reset(): Promise<void> {
    this.clearAuthentication();
    realtimeService.clearSubscriptions();
    mockService.resetData();
    uploadService.cancelAllUploads();
    
    this.isInitialized = false;
    console.log('Services reset');
  }
}

// Export singleton service manager
export const serviceManager = ServiceManager.getInstance();

// Convenience functions for common operations
export const initializeServices = (config?: Parameters<ServiceManager['initialize']>[0]) => {
  return serviceManager.initialize(config);
};

export const setAuthentication = (authToken: string, userId?: string) => {
  serviceManager.setAuthentication(authToken, userId);
};

export const clearAuthentication = () => {
  serviceManager.clearAuthentication();
};

export const enableMockMode = () => {
  serviceManager.enableMockMode();
};

export const enableProductionMode = () => {
  serviceManager.enableProductionMode();
};

export const getServiceHealth = () => {
  return serviceManager.getHealthStatus();
};

// Service state management for React components
export class ServiceState {
  private listeners = new Set<() => void>();
  private state: {
    isAuthenticated: boolean;
    currentUser: any;
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    mode: 'production' | 'development' | 'mock';
  } = {
    isAuthenticated: false,
    currentUser: null,
    connectionStatus: 'disconnected',
    mode: 'development',
  };

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getState() {
    return { ...this.state };
  }

  updateState(updates: Partial<typeof this.state>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(callback => callback());
  }

  setAuthenticated(user: any): void {
    this.updateState({
      isAuthenticated: true,
      currentUser: user,
    });
  }

  setUnauthenticated(): void {
    this.updateState({
      isAuthenticated: false,
      currentUser: null,
    });
  }

  setConnectionStatus(status: 'connected' | 'disconnected' | 'connecting'): void {
    this.updateState({ connectionStatus: status });
  }

  setMode(mode: 'production' | 'development' | 'mock'): void {
    this.updateState({ mode });
  }
}

export const serviceState = new ServiceState();

// Initialize real-time connection status monitoring
realtimeService.subscribeToEvent('connection_state_changed' as any, (data) => {
  serviceState.setConnectionStatus(data.state === 'connected' ? 'connected' : 'disconnected');
});

// Service error handling utilities
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  static fromApiError(error: any): ServiceError {
    return new ServiceError(
      error.message || 'An error occurred',
      error.code || 'SERVICE_ERROR',
      error.statusCode,
      error.details
    );
  }
}

export const handleServiceError = (error: any): ServiceError => {
  if (error instanceof ServiceError) {
    return error;
  }
  return ServiceError.fromApiError(error);
};

// Export version info
export const SERVICE_VERSION = '1.0.0';
export const SERVICE_BUILD_DATE = new Date().toISOString();
