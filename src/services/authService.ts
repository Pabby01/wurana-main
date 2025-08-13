/**
 * Authentication Service
 * Handles user authentication, registration, and wallet integration
 */

import { Keypair } from '@solana/web3.js';
import { apiClient, API_ENDPOINTS } from './api';
import { serviceState } from './index';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
}

export interface WalletConnectRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

class AuthService {
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private currentUser: User | null = null;
  private tokenExpiresAt: Date | null = null;

  /**
   * Initialize auth service with stored credentials
   */
  initialize(): void {
    // Load stored credentials
    this.authToken = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (expiresAt) {
      this.tokenExpiresAt = new Date(expiresAt);
    }

    // Set API client token
    if (this.authToken) {
      apiClient.setAuthToken(this.authToken);
    }

    // Load current user data
    const userData = localStorage.getItem('current_user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        serviceState.setAuthenticated(this.currentUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        this.clearStoredAuth();
      }
    }

    // Check if token needs refresh
    if (this.authToken && this.tokenExpiresAt && this.tokenExpiresAt <= new Date()) {
      this.refreshAuthToken();
    }
  }

  /**
   * Register new user with email and password
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>(API_ENDPOINTS.REGISTER, registerData);

      if (response.success && response.data) {
        await this.handleAuthSuccess(response.data);
        return {
          success: true,
          message: 'Registration successful',
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Registration failed',
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Login with email and password
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>(API_ENDPOINTS.LOGIN, loginData);

      if (response.success && response.data) {
        await this.handleAuthSuccess(response.data);
        return {
          success: true,
          message: 'Login successful',
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Login failed',
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }

  /**
   * Connect with Solana wallet
   */
  async connectWallet(walletData: WalletConnectRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>('/auth/wallet-connect', walletData);

      if (response.success && response.data) {
        await this.handleAuthSuccess(response.data);
        return {
          success: true,
          message: 'Wallet connected successfully',
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Wallet connection failed',
      };
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      return {
        success: false,
        message: error.message || 'Wallet connection failed',
      };
    }
  }

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>('/auth/google', { token: googleToken });

      if (response.success && response.data) {
        await this.handleAuthSuccess(response.data);
        return {
          success: true,
          message: 'Google login successful',
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Google login failed',
      };
    } catch (error: any) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: error.message || 'Google login failed',
      };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) {
      this.logout();
      return false;
    }

    try {
      const response = await apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.REFRESH, {
        refreshToken: this.refreshToken,
      });

      if (response.success && response.data) {
        this.authToken = response.data.token;
        this.refreshToken = response.data.refreshToken;
        this.tokenExpiresAt = new Date(response.data.expiresAt);

        this.storeAuthData();
        apiClient.setAuthToken(this.authToken);

        return true;
      }

      this.logout();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<boolean> {
    try {
      if (this.authToken) {
        await apiClient.post(API_ENDPOINTS.LOGOUT);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
      return true;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.authToken && this.currentUser);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get auth token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Verify current token validity
   */
  async verifyToken(): Promise<boolean> {
    if (!this.authToken) return false;

    try {
      const response = await apiClient.get('/auth/verify');
      return response.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  /**
   * Create new Solana wallet
   */
  async createWallet(): Promise<{
    publicKey: string;
    privateKey: string; // In production, this should be encrypted and stored securely
  }> {
    try {
      const keypair = Keypair.generate();
      return {
        publicKey: keypair.publicKey.toString(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  /**
   * Verify Civic Gateway token
   */
  async verifyGatewayToken(gatewayToken: string): Promise<{
    isValid: boolean;
    userData?: any;
  }> {
    try {
      const response = await apiClient.post('/auth/verify-gateway', {
        gatewayToken,
      });

      return {
        isValid: response.success,
        userData: response.data,
      };
    } catch (error) {
      console.error('Gateway token verification error:', error);
      return { isValid: false };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return {
        success: response.success,
        message: response.message || 'Password reset email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send password reset email',
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return {
        success: response.success,
        message: response.message || 'Password reset successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to reset password',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return {
        success: response.success,
        message: response.message || 'Password changed successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to change password',
      };
    }
  }

  /**
   * Handle successful authentication
   */
  private async handleAuthSuccess(data: {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: string;
  }): Promise<void> {
    this.currentUser = data.user;
    this.authToken = data.token;
    this.refreshToken = data.refreshToken;
    this.tokenExpiresAt = new Date(data.expiresAt);

    // Store authentication data
    this.storeAuthData();

    // Set API client token
    apiClient.setAuthToken(this.authToken);

    // Update service state
    serviceState.setAuthenticated(this.currentUser);

    // Connect to real-time service
    try {
      const { realtimeService } = await import('./realtimeService');
      await realtimeService.connect(this.authToken, this.currentUser.id);
    } catch (error) {
      console.error('Failed to connect to real-time service:', error);
    }
  }

  /**
   * Store authentication data to localStorage
   */
  private storeAuthData(): void {
    if (this.authToken) {
      localStorage.setItem('auth_token', this.authToken);
    }
    if (this.refreshToken) {
      localStorage.setItem('refresh_token', this.refreshToken);
    }
    if (this.tokenExpiresAt) {
      localStorage.setItem('token_expires_at', this.tokenExpiresAt.toISOString());
    }
    if (this.currentUser) {
      localStorage.setItem('current_user', JSON.stringify(this.currentUser));
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.authToken = null;
    this.refreshToken = null;
    this.currentUser = null;
    this.tokenExpiresAt = null;

    this.clearStoredAuth();
    apiClient.setAuthToken(null);
    serviceState.setUnauthenticated();

    // Disconnect from real-time service
    try {
      const { realtimeService } = require('./realtimeService');
      realtimeService.disconnect();
    } catch (error) {
      // Real-time service might not be imported yet
    }
  }

  /**
   * Clear stored authentication data
   */
  private clearStoredAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('current_user');
  }

  /**
   * Set up automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (!this.tokenExpiresAt) return;

    const refreshTime = this.tokenExpiresAt.getTime() - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry
    
    if (refreshTime > 0) {
      setTimeout(() => {
        this.refreshAuthToken();
      }, refreshTime);
    }
  }
}

export const authService = new AuthService();