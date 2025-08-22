import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class SolanaService {
  constructor() {
    this.connection = null;
    this.provider = null;
    this.escrowProgram = null;
    this.treasuryKeypair = null;
  }

  async initialize() {
    try {
      // Initialize Solana connection
      const endpoint = config.solana.rpcEndpoint || clusterApiUrl(config.solana.network);
      this.connection = new Connection(endpoint, 'confirmed');

      // Initialize treasury wallet
      if (config.solana.treasuryWallet) {
        const secretKey = Buffer.from(config.solana.treasuryWallet, 'base64');
        this.treasuryKeypair = Keypair.fromSecretKey(secretKey);
      }

      // Initialize Anchor provider
      const opts = {
        preflightCommitment: 'confirmed',
        commitment: 'confirmed',
      };

      this.provider = new AnchorProvider(
        this.connection,
        this.treasuryKeypair,
        opts
      );

      // Initialize escrow program if program ID is provided
      if (config.solana.escrowProgramId) {
        this.escrowProgram = new Program(
          require('../idl/escrow.json'),
          config.solana.escrowProgramId,
          this.provider
        );
      }

      logInfo('Solana service initialized successfully');
      return true;
    } catch (error) {
      logError('Error initializing Solana service:', error);
      throw error;
    }
  }

  // Connection methods
  async getBalance(publicKey) {
    try {
      const balance = await this.connection.getBalance(new web3.PublicKey(publicKey));
      return balance / web3.LAMPORTS_PER_SOL;
    } catch (error) {
      logError('Error getting balance:', error);
      throw error;
    }
  }

  async getRecentBlockhash() {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      logError('Error getting recent blockhash:', error);
      throw error;
    }
  }

  // Transaction methods
  async sendTransaction(transaction, signers) {
    try {
      transaction.recentBlockhash = await this.getRecentBlockhash();
      transaction.feePayer = signers[0].publicKey;

      // Sign transaction
      transaction.sign(...signers);

      // Send transaction
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize()
      );

      // Confirm transaction
      const confirmation = await this.connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      return signature;
    } catch (error) {
      logError('Error sending transaction:', error);
      throw error;
    }
  }

  // Escrow methods
  async createEscrow(amount, buyer, seller) {
    if (!this.escrowProgram) {
      throw new Error('Escrow program not initialized');
    }

    try {
      const escrowAccount = web3.Keypair.generate();
      
      const tx = await this.escrowProgram.methods
        .initialize(new web3.BN(amount * web3.LAMPORTS_PER_SOL))
        .accounts({
          escrow: escrowAccount.publicKey,
          buyer: new web3.PublicKey(buyer),
          seller: new web3.PublicKey(seller),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([escrowAccount])
        .rpc();

      return {
        signature: tx,
        escrowAccount: escrowAccount.publicKey.toString(),
      };
    } catch (error) {
      logError('Error creating escrow:', error);
      throw error;
    }
  }

  async releaseEscrow(escrowAccount, seller) {
    if (!this.escrowProgram) {
      throw new Error('Escrow program not initialized');
    }

    try {
      const tx = await this.escrowProgram.methods
        .release()
        .accounts({
          escrow: new web3.PublicKey(escrowAccount),
          seller: new web3.PublicKey(seller),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      logError('Error releasing escrow:', error);
      throw error;
    }
  }

  async refundEscrow(escrowAccount, buyer) {
    if (!this.escrowProgram) {
      throw new Error('Escrow program not initialized');
    }

    try {
      const tx = await this.escrowProgram.methods
        .refund()
        .accounts({
          escrow: new web3.PublicKey(escrowAccount),
          buyer: new web3.PublicKey(buyer),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      logError('Error refunding escrow:', error);
      throw error;
    }
  }

  // NFT methods
  async mintNFT(recipient, metadata) {
    try {
      // Implementation for minting NFTs will go here
      // This will use the Metaplex SDK for NFT operations
      throw new Error('NFT minting not implemented yet');
    } catch (error) {
      logError('Error minting NFT:', error);
      throw error;
    }
  }
}

// Create and export Solana service instance
const solanaService = new SolanaService();
export default solanaService;