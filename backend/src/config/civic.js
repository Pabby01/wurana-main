import { GatewayProvider } from '@civic/solana-gateway-react';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class CivicService {
  constructor() {
    this.gatekeeperNetwork = config.civicGatekeeperNetwork;
    this.provider = null;
  }

  async initialize() {
    try {
      if (!this.gatekeeperNetwork) {
        throw new Error('Civic gatekeeper network not configured');
      }

      this.provider = new GatewayProvider({
        gatekeeperNetwork: this.gatekeeperNetwork,
        cluster: config.solana.network,
      });

      logInfo('Civic service initialized successfully');
      return true;
    } catch (error) {
      logError('Error initializing Civic service:', error);
      throw error;
    }
  }

  // Verify user identity
  async verifyIdentity(walletAddress) {
    try {
      if (!this.provider) {
        throw new Error('Civic provider not initialized');
      }

      const verificationState = await this.provider.state();

      if (verificationState.status !== 'active') {
        throw new Error('Identity verification not active');
      }

      const verificationResult = await this.provider.requestGatewayToken({
        wallet: walletAddress,
      });

      logInfo('Identity verification completed:', verificationResult);
      return verificationResult;
    } catch (error) {
      logError('Error verifying identity:', error);
      throw error;
    }
  }

  // Check verification status
  async checkVerificationStatus(walletAddress) {
    try {
      if (!this.provider) {
        throw new Error('Civic provider not initialized');
      }

      const status = await this.provider.getGatewayTokenState(walletAddress);

      return {
        isVerified: status === 'ACTIVE',
        status,
      };
    } catch (error) {
      logError('Error checking verification status:', error);
      throw error;
    }
  }

  // Revoke verification
  async revokeVerification(walletAddress) {
    try {
      if (!this.provider) {
        throw new Error('Civic provider not initialized');
      }

      await this.provider.freezeGatewayToken(walletAddress);
      logInfo('Verification revoked for wallet:', walletAddress);
      return true;
    } catch (error) {
      logError('Error revoking verification:', error);
      throw error;
    }
  }

  // Get verification details
  async getVerificationDetails(walletAddress) {
    try {
      if (!this.provider) {
        throw new Error('Civic provider not initialized');
      }

      const token = await this.provider.getGatewayToken(walletAddress);
      
      if (!token) {
        return null;
      }

      return {
        tokenAddress: token.publicKey.toString(),
        expiryTime: token.expiryTime,
        issuedAt: token.issuedAt,
        state: token.state,
      };
    } catch (error) {
      logError('Error getting verification details:', error);
      throw error;
    }
  }

  // Refresh verification token
  async refreshVerification(walletAddress) {
    try {
      if (!this.provider) {
        throw new Error('Civic provider not initialized');
      }

      const result = await this.provider.refreshGatewayToken(walletAddress);
      logInfo('Verification refreshed for wallet:', walletAddress);
      return result;
    } catch (error) {
      logError('Error refreshing verification:', error);
      throw error;
    }
  }

  // Handle verification webhook
  async handleWebhook(payload) {
    try {
      const event = payload.event;
      const data = payload.data;

      switch (event) {
        case 'verification.completed':
          logInfo('Verification completed:', data);
          return { event, data };

        case 'verification.failed':
          logInfo('Verification failed:', data);
          return { event, data };

        case 'token.expired':
          logInfo('Verification token expired:', data);
          return { event, data };

        default:
          logInfo('Unhandled webhook event:', event);
          return { event, data };
      }
    } catch (error) {
      logError('Error handling webhook:', error);
      throw error;
    }
  }
}

// Create and export Civic service instance
const civicService = new CivicService();
export default civicService;