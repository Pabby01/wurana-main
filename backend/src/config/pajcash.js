import axios from 'axios';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class PAJCashService {
  constructor() {
    this.api = axios.create({
      baseURL: config.pajCash.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.pajCash.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        logError('PAJ Cash API error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Initialize payment
  async initializePayment({
    amount,
    currency,
    orderId,
    description,
    customerEmail,
    successUrl,
    cancelUrl,
  }) {
    try {
      const response = await this.api.post('/payments/initialize', {
        amount,
        currency,
        orderId,
        description,
        customerEmail,
        successUrl,
        cancelUrl,
      });

      logInfo('Payment initialized:', response.data);
      return response.data;
    } catch (error) {
      logError('Error initializing payment:', error);
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(paymentId) {
    try {
      const response = await this.api.get(`/payments/${paymentId}/verify`);
      logInfo('Payment verified:', response.data);
      return response.data;
    } catch (error) {
      logError('Error verifying payment:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund({
    paymentId,
    amount,
    reason,
  }) {
    try {
      const response = await this.api.post(`/payments/${paymentId}/refund`, {
        amount,
        reason,
      });

      logInfo('Refund processed:', response.data);
      return response.data;
    } catch (error) {
      logError('Error processing refund:', error);
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const response = await this.api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      logError('Error getting payment details:', error);
      throw error;
    }
  }

  // List payments
  async listPayments({
    page = 1,
    limit = 10,
    startDate,
    endDate,
    status,
  }) {
    try {
      const response = await this.api.get('/payments', {
        params: {
          page,
          limit,
          startDate,
          endDate,
          status,
        },
      });

      return response.data;
    } catch (error) {
      logError('Error listing payments:', error);
      throw error;
    }
  }

  // Create payout
  async createPayout({
    amount,
    currency,
    recipientEmail,
    description,
  }) {
    try {
      const response = await this.api.post('/payouts', {
        amount,
        currency,
        recipientEmail,
        description,
      });

      logInfo('Payout created:', response.data);
      return response.data;
    } catch (error) {
      logError('Error creating payout:', error);
      throw error;
    }
  }

  // Get payout details
  async getPayoutDetails(payoutId) {
    try {
      const response = await this.api.get(`/payouts/${payoutId}`);
      return response.data;
    } catch (error) {
      logError('Error getting payout details:', error);
      throw error;
    }
  }

  // List payouts
  async listPayouts({
    page = 1,
    limit = 10,
    startDate,
    endDate,
    status,
  }) {
    try {
      const response = await this.api.get('/payouts', {
        params: {
          page,
          limit,
          startDate,
          endDate,
          status,
        },
      });

      return response.data;
    } catch (error) {
      logError('Error listing payouts:', error);
      throw error;
    }
  }

  // Get account balance
  async getAccountBalance() {
    try {
      const response = await this.api.get('/account/balance');
      return response.data;
    } catch (error) {
      logError('Error getting account balance:', error);
      throw error;
    }
  }

  // Webhook handling
  async handleWebhook(payload, signature) {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const event = payload.event;
      const data = payload.data;

      switch (event) {
        case 'payment.succeeded':
          logInfo('Payment succeeded:', data);
          return { event, data };

        case 'payment.failed':
          logInfo('Payment failed:', data);
          return { event, data };

        case 'payout.succeeded':
          logInfo('Payout succeeded:', data);
          return { event, data };

        case 'payout.failed':
          logInfo('Payout failed:', data);
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

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    try {
      // Implementation will depend on PAJ Cash's signature verification method
      // This is a placeholder for the actual implementation
      return true;
    } catch (error) {
      logError('Error verifying webhook signature:', error);
      return false;
    }
  }
}

// Create and export PAJ Cash service instance
const pajCashService = new PAJCashService();
export default pajCashService;