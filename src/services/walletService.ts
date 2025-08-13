/**
 * Wallet Service
 * Handles wallet operations, transactions, and Solana blockchain interactions
 */

import { apiClient, API_ENDPOINTS } from './api';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

export interface WalletInfo {
  address: string;
  balance: {
    sol: number;
    usdc: number;
  };
  tokens: Array<{
    mint: string;
    symbol: string;
    name: string;
    balance: number;
    decimals: number;
    logoURI?: string;
  }>;
  nfts: Array<{
    mint: string;
    name: string;
    symbol: string;
    image: string;
    description?: string;
    collection?: string;
  }>;
}

export interface TransactionHistory {
  signature: string;
  type: 'payment' | 'escrow_create' | 'escrow_release' | 'token_transfer' | 'nft_transfer';
  amount: number;
  currency: 'SOL' | 'USDC' | string;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  blockTime?: number;
  fee: number;
  memo?: string;
  jobId?: string;
  escrowId?: string;
}

export interface EscrowDetails {
  id: string;
  address: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  client: string;
  artisan: string;
  jobId: string;
  status: 'created' | 'funded' | 'released' | 'disputed' | 'refunded';
  createdAt: string;
  expiresAt?: string;
  releaseConditions: {
    requiresBothParties: boolean;
    autoReleaseAfterDays?: number;
  };
}

export interface PaymentRequest {
  recipientAddress: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  memo?: string;
  jobId?: string;
}

export interface EscrowCreateRequest {
  artisanAddress: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  jobId: string;
  autoReleaseAfterDays?: number;
  requiresBothParties?: boolean;
}

class WalletService {
  private connection: Connection;

  constructor() {
    const rpcEndpoint = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcEndpoint, 'confirmed');
  }

  /**
   * Get wallet information including balances and tokens
   */
  async getWalletInfo(walletAddress?: string): Promise<WalletInfo> {
    const endpoint = walletAddress 
      ? `${API_ENDPOINTS.WALLET}/${walletAddress}`
      : API_ENDPOINTS.WALLET;
      
    const response = await apiClient.get<WalletInfo>(endpoint);
    return response.data;
  }

  /**
   * Get SOL balance for a wallet
   */
  async getSolBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      return 0;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(filters?: {
    type?: string;
    currency?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    transactions: TransactionHistory[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSACTIONS}`, filters);
    return response.data;
  }

  /**
   * Create a payment transaction
   */
  async createPayment(paymentData: PaymentRequest): Promise<{
    transactionId: string;
    serializedTransaction: string;
    signature?: string;
  }> {
    const response = await apiClient.post<{
      transactionId: string;
      serializedTransaction: string;
      signature?: string;
    }>(`${API_ENDPOINTS.WALLET}/payment`, paymentData);
    return response.data;
  }

  /**
   * Confirm a transaction
   */
  async confirmTransaction(signature: string): Promise<{
    confirmed: boolean;
    blockTime?: number;
    status: 'pending' | 'confirmed' | 'failed';
  }> {
    const response = await apiClient.post<{
      confirmed: boolean;
      blockTime?: number;
      status: 'pending' | 'confirmed' | 'failed';
    }>(`${API_ENDPOINTS.TRANSACTIONS}/${signature}/confirm`);
    return response.data;
  }

  /**
   * Create escrow contract
   */
  async createEscrow(escrowData: EscrowCreateRequest): Promise<{
    escrowId: string;
    escrowAddress: string;
    serializedTransaction: string;
  }> {
    const response = await apiClient.post<{
      escrowId: string;
      escrowAddress: string;
      serializedTransaction: string;
    }>(`${API_ENDPOINTS.WALLET}/escrow`, escrowData);
    return response.data;
  }

  /**
   * Get escrow details
   */
  async getEscrowDetails(escrowId: string): Promise<EscrowDetails> {
    const response = await apiClient.get<EscrowDetails>(
      `${API_ENDPOINTS.WALLET}/escrow/${escrowId}`
    );
    return response.data;
  }

  /**
   * Release escrow funds
   */
  async releaseEscrow(escrowId: string): Promise<{
    transactionId: string;
    serializedTransaction: string;
  }> {
    const response = await apiClient.post<{
      transactionId: string;
      serializedTransaction: string;
    }>(`${API_ENDPOINTS.WALLET}/escrow/${escrowId}/release`);
    return response.data;
  }

  /**
   * Dispute escrow
   */
  async disputeEscrow(escrowId: string, reason: string, evidence?: File[]): Promise<{
    disputeId: string;
  }> {
    const formData = new FormData();
    formData.append('reason', reason);

    if (evidence && evidence.length > 0) {
      evidence.forEach((file, index) => {
        formData.append(`evidence_${index}`, file);
      });
    }

    const response = await apiClient.post<{ disputeId: string }>(
      `${API_ENDPOINTS.WALLET}/escrow/${escrowId}/dispute`,
      formData
    );
    return response.data;
  }

  /**
   * Get user's active escrows
   */
  async getActiveEscrows(): Promise<EscrowDetails[]> {
    const response = await apiClient.get<EscrowDetails[]>(
      `${API_ENDPOINTS.WALLET}/escrow/active`
    );
    return response.data;
  }

  /**
   * Get wallet statistics
   */
  async getWalletStatistics(): Promise<{
    totalEarnings: number;
    totalSpent: number;
    completedTransactions: number;
    pendingTransactions: number;
    activeEscrows: number;
    totalEscrowValue: number;
    monthlyStats: Array<{
      month: string;
      earnings: number;
      spending: number;
      transactions: number;
    }>;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.WALLET}/statistics`);
    return response.data;
  }

  /**
   * Estimate transaction fee
   */
  async estimateTransactionFee(transactionType: 'payment' | 'escrow' | 'release'): Promise<{
    feeInSol: number;
    feeInLamports: number;
  }> {
    const response = await apiClient.get<{
      feeInSol: number;
      feeInLamports: number;
    }>(`${API_ENDPOINTS.WALLET}/fee-estimate`, { type: transactionType });
    return response.data;
  }

  /**
   * Get supported tokens
   */
  async getSupportedTokens(): Promise<Array<{
    mint: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
    coingeckoId?: string;
  }>> {
    const response = await apiClient.get('/tokens/supported');
    return response.data;
  }

  /**
   * Get token prices
   */
  async getTokenPrices(symbols: string[]): Promise<Record<string, {
    usd: number;
    usd24hChange: number;
  }>> {
    const response = await apiClient.get('/tokens/prices', {
      symbols: symbols.join(','),
    });
    return response.data;
  }

  /**
   * Connect wallet
   */
  async connectWallet(walletAddress: string, signature: string): Promise<{
    connected: boolean;
    user: {
      id: string;
      walletAddress: string;
      isVerified: boolean;
    };
  }> {
    const response = await apiClient.post<{
      connected: boolean;
      user: {
        id: string;
        walletAddress: string;
        isVerified: boolean;
      };
    }>('/auth/wallet-connect', {
      walletAddress,
      signature,
    });
    return response.data;
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    await apiClient.post('/auth/wallet-disconnect');
  }

  /**
   * Verify wallet ownership
   */
  async verifyWalletOwnership(
    walletAddress: string,
    signedMessage: string,
    originalMessage: string
  ): Promise<boolean> {
    const response = await apiClient.post<{ verified: boolean }>(
      '/auth/verify-wallet',
      {
        walletAddress,
        signedMessage,
        originalMessage,
      }
    );
    return response.data.verified;
  }

  /**
   * Request airdrop (for development/testing)
   */
  async requestAirdrop(amount: number = 1): Promise<{
    signature: string;
    amount: number;
  }> {
    const response = await apiClient.post<{
      signature: string;
      amount: number;
    }>(`${API_ENDPOINTS.WALLET}/airdrop`, { amount });
    return response.data;
  }

  /**
   * Get transaction by signature
   */
  async getTransaction(signature: string): Promise<TransactionHistory | null> {
    try {
      const response = await apiClient.get<TransactionHistory>(
        `${API_ENDPOINTS.TRANSACTIONS}/${signature}`
      );
      return response.data;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Export wallet data
   */
  async exportWalletData(format: 'json' | 'csv' = 'json'): Promise<{
    downloadUrl: string;
    filename: string;
  }> {
    const response = await apiClient.get<{
      downloadUrl: string;
      filename: string;
    }>(`${API_ENDPOINTS.WALLET}/export`, { format });
    return response.data;
  }

  /**
   * Set up recurring payment
   */
  async setupRecurringPayment(paymentData: {
    recipientAddress: string;
    amount: number;
    currency: 'SOL' | 'USDC';
    interval: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate?: string;
    maxPayments?: number;
    memo?: string;
  }): Promise<{ recurringPaymentId: string }> {
    const response = await apiClient.post<{ recurringPaymentId: string }>(
      `${API_ENDPOINTS.WALLET}/recurring-payment`,
      paymentData
    );
    return response.data;
  }

  /**
   * Cancel recurring payment
   */
  async cancelRecurringPayment(recurringPaymentId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.WALLET}/recurring-payment/${recurringPaymentId}`);
  }

  /**
   * Get recurring payments
   */
  async getRecurringPayments(): Promise<Array<{
    id: string;
    recipientAddress: string;
    amount: number;
    currency: 'SOL' | 'USDC';
    interval: string;
    nextPaymentDate: string;
    status: 'active' | 'paused' | 'cancelled' | 'completed';
    totalPaid: number;
    remainingPayments?: number;
  }>> {
    const response = await apiClient.get(`${API_ENDPOINTS.WALLET}/recurring-payments`);
    return response.data;
  }
}

export const walletService = new WalletService();
