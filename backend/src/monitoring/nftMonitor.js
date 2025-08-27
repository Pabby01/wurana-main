import { logError, logInfo } from '../config/logger.js';
import { EventEmitter } from 'events';
import NFT from '../models/nft.model.js';
import solanaService from '../config/solana.js';

class NFTMonitor extends EventEmitter {
  constructor() {
    super();
    this.monitoringInterval = null;
    this.alertThresholds = {
      mintingDuration: 5 * 60 * 1000, // 5 minutes
      failedMintingsThreshold: 3,
      highFeeThreshold: 0.05, // 0.05 SOL
    };
  }

  async startMonitoring() {
    try {
      if (this.monitoringInterval) {
        logInfo('NFT monitoring is already running');
        return;
      }

      // Monitor every 30 seconds
      this.monitoringInterval = setInterval(
        () => this.checkNFTStatus(),
        30000
      );

      logInfo('NFT monitoring started');
    } catch (error) {
      logError('Error starting NFT monitoring:', error);
      throw error;
    }
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logInfo('NFT monitoring stopped');
    }
  }

  async checkNFTStatus() {
    try {
      // Check pending mints
      await this.checkPendingMints();

      // Check failed mints
      await this.checkFailedMints();

      // Monitor transaction fees
      await this.monitorTransactionFees();

      // Verify collection integrity
      await this.verifyCollections();

    } catch (error) {
      logError('Error in NFT status check:', error);
      this.emit('monitoring:error', error);
    }
  }

  async checkPendingMints() {
    const pendingNFTs = await NFT.find({ status: 'minting' });

    for (const nft of pendingNFTs) {
      const mintingDuration = Date.now() - nft.mintingDetails.timestamp;

      if (mintingDuration > this.alertThresholds.mintingDuration) {
        this.emit('minting:delayed', {
          nftId: nft._id,
          mintAddress: nft.mintAddress,
          duration: mintingDuration
        });
      }

      // Verify minting status on-chain
      try {
        const onChainData = await solanaService.getNFTMetadata(nft.mintAddress);
        if (onChainData) {
          await nft.updateMintingStatus('minted', {
            transactionHash: nft.mintingDetails.transactionHash,
          });
        }
      } catch (error) {
        logError(`Error verifying NFT ${nft.mintAddress}:`, error);
      }
    }
  }

  async checkFailedMints() {
    const failedCount = await NFT.countDocuments({
      status: 'failed',
      'mintingDetails.timestamp': { $gte: new Date(Date.now() - 3600000) } // Last hour
    });

    if (failedCount >= this.alertThresholds.failedMintingsThreshold) {
      this.emit('minting:highFailureRate', {
        count: failedCount,
        timeframe: '1 hour'
      });
    }
  }

  async monitorTransactionFees() {
    try {
      // Get a sample transaction to estimate fees
      const transaction = new solanaService.web3.Transaction();
      const fees = await solanaService.validateTransactionFees(transaction);

      if (fees > this.alertThresholds.highFeeThreshold * solanaService.web3.LAMPORTS_PER_SOL) {
        this.emit('transaction:highFees', {
          currentFee: fees / solanaService.web3.LAMPORTS_PER_SOL,
          threshold: this.alertThresholds.highFeeThreshold
        });
      }
    } catch (error) {
      logError('Error monitoring transaction fees:', error);
    }
  }

  async verifyCollections() {
    try {
      const collectionsToVerify = await NFT.aggregate([
        {
          $match: {
            status: 'minted',
            'collectionDetails.collectionMint': { $exists: true }
          }
        },
        {
          $group: {
            _id: '$collectionDetails.collectionMint',
            nfts: { $push: '$mintAddress' }
          }
        }
      ]);

      for (const collection of collectionsToVerify) {
        for (const nftMint of collection.nfts) {
          try {
            await solanaService.verifyNFTCollection(nftMint, collection._id);
          } catch (error) {
            this.emit('collection:verificationFailed', {
              collectionMint: collection._id,
              nftMint,
              error: error.message
            });
          }
        }
      }
    } catch (error) {
      logError('Error verifying collections:', error);
    }
  }

  setAlertThresholds(newThresholds) {
    this.alertThresholds = {
      ...this.alertThresholds,
      ...newThresholds
    };
    logInfo('Alert thresholds updated:', this.alertThresholds);
  }
}

// Create and export monitor instance
const nftMonitor = new NFTMonitor();

// Set up event handlers
nftMonitor.on('minting:delayed', (data) => {
  logError('Delayed minting detected:', data);
});

nftMonitor.on('minting:highFailureRate', (data) => {
  logError('High minting failure rate detected:', data);
});

nftMonitor.on('transaction:highFees', (data) => {
  logError('High transaction fees detected:', data);
});

nftMonitor.on('collection:verificationFailed', (data) => {
  logError('Collection verification failed:', data);
});

nftMonitor.on('monitoring:error', (error) => {
  logError('Monitoring system error:', error);
});

export default nftMonitor;